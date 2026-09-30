/**
 * @file InstanceBufferArena.ts
 * @description
 * ゼロアロケーションのための SoA (Structure of Arrays) アリーナ。
 * Sparse Set (Swap-Remove) パターンを導入し、アクティブなエンティティが常に 0〜activeCount-1 に密(Dense)に配置されるようにします。
 * また、Dirty Flag を用いて変更があった属性のみをGPUに転送します。
 *
 * 設計上の掟:
 *  - コンストラクタ以外ではヒープメモリを一切確保しません。
 *  - 親子関係はネストした木ではなく
 *    SoA の parentId 配列で表します。
 *  - computeWorldTransforms() が
 *    ローカル座標をワールド座標へ畳み込みます。
 */

/**
 * スプライトが参照するテクスチャアセットの最小インターフェース。
 * 実体は TextureManager / LoaderManager が保持する TextureAsset。
 */
export interface SpriteAssetLike {
  /** GPU Texture2DArray のレイヤーインデックス */
  layerIndex?: number;
  width?: number;
  height?: number;
  /** テクスチャキー (Phaser 互換の texture プロパティで返します) */
  key?: string;
  /** スプライトシート内のフレーム UV */
  frames?: { uvX: number; uvY: number; uvW: number; uvH: number }[];
  /** ラッパー構造で保持されている場合の互換フィールド */
  textureAsset?: SpriteAssetLike;
}

/**
 * アリーナがアニメーション再生を委譲するための最小インターフェース (AnimationManager が実装)。
 */
export interface AnimPlayTarget {
  play(id: number, key: string, ignoreIfPlaying?: boolean): void;
}

export class InstanceBufferArena {
  public readonly capacity: number;
  private _activeCount = 0;

  // --- SoA Arrays (Dense, 常に 0 ~ activeCount - 1 にデータが詰まる) ---
  public readonly posX: Float32Array;
  public readonly posY: Float32Array;
  public readonly rotation: Float32Array;
  public readonly scale: Float32Array;
  public readonly facing: Float32Array;
  public readonly depth: Float32Array;
  public readonly uvX: Float32Array;
  public readonly uvY: Float32Array;
  public readonly uvW: Float32Array;
  public readonly uvH: Float32Array;
  public readonly frameIdx: Float32Array;
  public readonly tint: Uint32Array;
  /**
   * 1.0 のインスタンスは SDF テキストとして描画します。
   * 0.0 は通常のスプライトです。
   * 頂点属性 14 として渡し、フラグメントシェーダーで描画方式を分岐させます。
   */
  public readonly isText: Float32Array;
  /**
   * 1.0 = 描画する、0.0 = 描画しない (Phaser 互換の setVisible)。
   *
   * 頂点属性の上限 (WebGL2 では 16) があるため、depth の空き枠
   * (location 7) を再利用しています。depth は CPU 側 (SoA) で保持します。
   */
  public readonly visible: Float32Array;

  /**
   * `frameIdx` は GPU のテクスチャーアレイ・レイヤーIDを保持する。
   * 同一レイヤー内での「どのコマか」は `srcFrame` が担当する (2バイトで済むため Uint16Array)。
   */
  public readonly srcFrame: Uint16Array;

  /**
   * SoA 内の「参照」を保持する密配列。
   * Sprite インスタンス側 (Flyweight) にアセット参照を持たせ aesthetically 32Byte を守るために、
   * 参照はここへ集約する。Flyweight パターンの純度を保つための「SoA 版フィールド」。
   */
  public readonly assetRef: (SpriteAssetLike | null)[];

  // --- Hierarchy (SoA Scene Graph) ---
  /** 親の Sprite ID。-1 ならルート。 */
  public readonly parentId: Int32Array;
  /** 親から見たローカル位置 (parentId >= 0 のときだけ使用) */
  public readonly localX: Float32Array;
  public readonly localY: Float32Array;
  public readonly localRotation: Float32Array;
  /** computeWorldTransforms() の出力 (親から見た変換を畳み込んだワールド座標) */
  public readonly worldX: Float32Array;
  public readonly worldY: Float32Array;
  public readonly worldRotation: Float32Array;
  /** メモ化による階層解決の訪問スタンプ (フレーム毎に単調増加) */
  private readonly _resolvedStamp: Int32Array;
  private _stamp = 0;

  // --- Interaction ---
  public readonly interactive: Uint8Array;
  public readonly hitWidth: Float32Array;
  public readonly hitHeight: Float32Array;

  // --- Sparse Set Mapping ---
  // idToIndex[ID] = Dense Array Index
  // indexToId[Dense Array Index] = ID
  public readonly idToIndex: Int32Array;
  public readonly indexToId: Int32Array;

  // --- Dirty Flags (属性ごとの変更検知) ---
  public dirtyPos = true;
  public dirtyRotation = true;
  public dirtyScale = true;
  public dirtyUv = true;
  public dirtyFrameIdx = true;
  public dirtyTint = true;
  public dirtyDepth = true;
  public dirtyHierarchy = true;

  // --- Free List (IDの再利用管理) ---
  private readonly freeList: Int32Array;
  private freeListHead = 0;

  /** アニメーション再生の委譲先。Scene 構築時に差し込まれる。 */
  public animTracker: AnimPlayTarget | null = null;

  /**
   * 親子関係を持つエンティティが 1 体でも存在するかどうか。
   * false の間はワールド変換の解決を丸ごと省略できます。
   * ゲームが直接 posX を書き換える運用にも影響しないため、このフラグで経路を分けます。
   */
  public hasHierarchy = false;

  /**
   * SDF テキストのインスタンスが 1 つでも存在するかどうか。
   * false の間は isText バッファの転送を丸ごと省略できます。
   */
  public hasText = false;
  /**
   * isText バッファが前回転送時から変化したかどうか。
   * false のフレームは GPU 側に前回の内容が残っているので送信不要です。
   */
  public dirtyIsText = false;
  /**
   * visible バッファが前回転送時から変化したかどうか。
   */
  public dirtyVisible = false;

  constructor(maxInstances: number) {
    this.capacity = maxInstances;

    // SoA Arrays
    this.posX = new Float32Array(maxInstances);
    this.posY = new Float32Array(maxInstances);
    this.rotation = new Float32Array(maxInstances);
    this.scale = new Float32Array(maxInstances);
    this.facing = new Float32Array(maxInstances);
    this.depth = new Float32Array(maxInstances);
    this.uvX = new Float32Array(maxInstances);
    this.uvY = new Float32Array(maxInstances);
    this.uvW = new Float32Array(maxInstances);
    this.uvH = new Float32Array(maxInstances);
    this.frameIdx = new Float32Array(maxInstances);
    this.tint = new Uint32Array(maxInstances);
    this.isText = new Float32Array(maxInstances);
    // 確保時は全て「表示」にしておきます (0 だと何も描画されません)。
    // 頂点属性として 1 インスタンス 1 バイト版を渡すと GPU 側の
    // ストライド (4 バイト) と食い合い、値がずれて描画されなくなるため
    // 必ず Float32Array にします。
    this.visible = new Float32Array(maxInstances).fill(1);
    this.srcFrame = new Uint16Array(maxInstances);

    // 参照を保持する密配列は new Array を1度だけ行う。.push() は使わない。
    this.assetRef = new Array<SpriteAssetLike | null>(maxInstances).fill(null);

    this.parentId = new Int32Array(maxInstances).fill(-1);
    this.localX = new Float32Array(maxInstances);
    this.localY = new Float32Array(maxInstances);
    this.localRotation = new Float32Array(maxInstances);
    this.worldX = new Float32Array(maxInstances);
    this.worldY = new Float32Array(maxInstances);
    this.worldRotation = new Float32Array(maxInstances);
    this._resolvedStamp = new Int32Array(maxInstances);

    this.interactive = new Uint8Array(maxInstances);
    this.hitWidth = new Float32Array(maxInstances);
    this.hitHeight = new Float32Array(maxInstances);

    this.idToIndex = new Int32Array(maxInstances).fill(-1);
    this.indexToId = new Int32Array(maxInstances).fill(-1);

    this.freeList = new Int32Array(maxInstances);
    for (let i = 0; i < maxInstances; i++) {
      this.freeList[i] = i;
    }
  }

  public allocate(): number {
    if (this.freeListHead >= this.capacity) {
      return -1;
    }

    const id = this.freeList[this.freeListHead++];
    const idx = this._activeCount++;

    this.idToIndex[id] = idx;
    this.indexToId[idx] = id;

    this.posX[idx] = 0.0;
    this.posY[idx] = 0.0;
    this.rotation[idx] = 0.0;
    this.scale[idx] = 1.0;
    this.facing[idx] = 1.0;
    this.depth[idx] = 0.0;
    this.frameIdx[idx] = 0.0;
    this.srcFrame[idx] = 0;
    this.tint[idx] = 0xffffffff;
    this.isText[idx] = 0.0;
    this.visible[idx] = 1.0;
    this.assetRef[idx] = null;
    this.parentId[idx] = -1;
    this.localX[idx] = 0.0;
    this.localY[idx] = 0.0;
    this.localRotation[idx] = 0.0;
    this.worldX[idx] = 0.0;
    this.worldY[idx] = 0.0;
    this.worldRotation[idx] = 0.0;
    this._resolvedStamp[idx] = 0;
    this.interactive[idx] = 0;
    this.hitWidth[idx] = 0.0;
    this.hitHeight[idx] = 0.0;

    // Allocate時に全属性が変更されるためDirtyフラグを立てる
    this.markAllDirty();

    return id;
  }

  public free(id: number): void {
    const idx = this.idToIndex[id];
    if (idx < 0 || idx >= this._activeCount) {
      return;
    }

    const lastIdx = this._activeCount - 1;

    // Swap with the last active element if it's not the last one
    if (idx !== lastIdx) {
      const lastId = this.indexToId[lastIdx];

      this.posX[idx] = this.posX[lastIdx];
      this.posY[idx] = this.posY[lastIdx];
      this.rotation[idx] = this.rotation[lastIdx];
      this.scale[idx] = this.scale[lastIdx];
      this.facing[idx] = this.facing[lastIdx];
      this.depth[idx] = this.depth[lastIdx];
      this.uvX[idx] = this.uvX[lastIdx];
      this.uvY[idx] = this.uvY[lastIdx];
      this.uvW[idx] = this.uvW[lastIdx];
      this.uvH[idx] = this.uvH[lastIdx];
      this.frameIdx[idx] = this.frameIdx[lastIdx];
      this.tint[idx] = this.tint[lastIdx];
      this.isText[idx] = this.isText[lastIdx];
      this.visible[idx] = this.visible[lastIdx];
      this.srcFrame[idx] = this.srcFrame[lastIdx];
      this.assetRef[idx] = this.assetRef[lastIdx];
      this.parentId[idx] = this.parentId[lastIdx];
      this.localX[idx] = this.localX[lastIdx];
      this.localY[idx] = this.localY[lastIdx];
      this.localRotation[idx] = this.localRotation[lastIdx];
      this.worldX[idx] = this.worldX[lastIdx];
      this.worldY[idx] = this.worldY[lastIdx];
      this.worldRotation[idx] = this.worldRotation[lastIdx];
      this._resolvedStamp[idx] = this._resolvedStamp[lastIdx];
      this.interactive[idx] = this.interactive[lastIdx];
      this.hitWidth[idx] = this.hitWidth[lastIdx];
      this.hitHeight[idx] = this.hitHeight[lastIdx];

      this.idToIndex[lastId] = idx;
      this.indexToId[idx] = lastId;
    }

    this.idToIndex[id] = -1;
    this.indexToId[lastIdx] = -1;
    this._activeCount--;

    // 参照を明示的に解放し、TextureAsset を後から破棄できるようにする
    this.assetRef[idx] = null;

    // データ配列がずれるためDirtyフラグを立てる
    this.markAllDirty();

    this.freeList[--this.freeListHead] = id;
  }

  /**
   * 全 Dirty Flag を立てます。allocate / free のようにデータ順序が変わる操作後に呼びます。
   */
  public markAllDirty(): void {
    this.dirtyPos = true;
    this.dirtyRotation = true;
    this.dirtyScale = true;
    this.dirtyUv = true;
    this.dirtyFrameIdx = true;
    this.dirtyTint = true;
    this.dirtyDepth = true;
    this.dirtyHierarchy = true;
    // isText / visible はスロットの入れ替えで内容が変わるため、
    // 同時に転送します。GPU 側と CPU 側で内容が違うままだと描画が壊れます。
    this.dirtyIsText = true;
    this.dirtyVisible = true;
  }

  /**
   * SoA シーングラフの変換を 1 パスで解決します。
   * ネストしたオブジェクト木は作りません。
   * インデックス配列と再帰で解決します。
   * 親を先に解決したかどうかはスタンプで判定します。
   * ヒープ割り当ては発生しません。
   * 再帰の深さは階層と同じで、浅くなります。
   */
  public computeWorldTransforms(): void {
    this._stamp++;

    // まずルートをすべて確定させる (親なし = ワールド = ローカル)
    for (let i = 0; i < this._activeCount; i++) {
      if (this.parentId[i] < 0) {
        this.worldX[i] = this.posX[i];
        this.worldY[i] = this.posY[i];
        this.worldRotation[i] = this.rotation[i];
        this._resolvedStamp[i] = this._stamp;
      }
    }

    // 親子在親より後に現れていても、メモ化により親を先に解決してから合成する
    for (let i = 0; i < this._activeCount; i++) {
      if (this._resolvedStamp[i] === this._stamp) continue;
      this._resolveWorld(i, 0);
    }
  }

  /**
   * 単一エンティティのワールド変換を解決します。
   * 循環参照が存在する場合に備えて深さ上限を設けて無限再帰を防ぎます。
   */
  private _resolveWorld(idx: number, depth: number): void {
    if (this._resolvedStamp[idx] === this._stamp) return;
    // 循環参照 (depth === capacity) 時は親を無視してローカル座標をそのまま使う
    if (depth >= this.capacity) {
      this.worldX[idx] = this.posX[idx];
      this.worldY[idx] = this.posY[idx];
      this.worldRotation[idx] = this.rotation[idx];
      this._resolvedStamp[idx] = this._stamp;
      return;
    }

    const parentId = this.parentId[idx];
    const parentIdx = this.idToIndex[parentId];
    if (parentId < 0 || parentIdx < 0) {
      this.worldX[idx] = this.posX[idx];
      this.worldY[idx] = this.posY[idx];
      this.worldRotation[idx] = this.rotation[idx];
      this._resolvedStamp[idx] = this._stamp;
      return;
    }

    this._resolveWorld(parentIdx, depth + 1);

    // 親のワールド回転でローカル平行移動を回転させ、ワールド回転を加算する。
    // スケールは意図的に継承しない (亲子で同一スケールを前提とする)。
    const pRot = this.worldRotation[parentIdx];
    const cos = Math.cos(pRot);
    const sin = Math.sin(pRot);
    const lx = this.localX[idx];
    const ly = this.localY[idx];

    this.worldX[idx] = this.worldX[parentIdx] + lx * cos - ly * sin;
    this.worldY[idx] = this.worldY[parentIdx] + lx * sin + ly * cos;
    this.worldRotation[idx] = pRot + this.localRotation[idx];
    this._resolvedStamp[idx] = this._stamp;
  }

  /**
   * ワールド座標に対してポインタの当たり判定 (AABB) を行います。
   * 結果を `out` へ上から (後方インデックスから) 書き込むため、out[0] が常に手前のエンティティです。
   * 階層を使っていない場合は posX / posY をそのまま判定座標として使います。
   * @returns 書き込んだヒット数
   */
  public hitTest(px: number, py: number, out: Int32Array): number {
    let count = 0;
    const max = out.length;
    const useWorld = this.hasHierarchy;
    // 手前のエンティティを優先するため降順に走査する
    for (let i = this._activeCount - 1; i >= 0; i--) {
      if (this.interactive[i] === 0) continue;

      const cx = useWorld ? this.worldX[i] : this.posX[i];
      const cy = useWorld ? this.worldY[i] : this.posY[i];
      const halfW = this.hitWidth[i] * 0.5;
      const halfH = this.hitHeight[i] * 0.5;

      if (px < cx - halfW || px > cx + halfW) continue;
      if (py < cy - halfH || py > cy + halfH) continue;

      if (count < max) {
        out[count] = this.indexToId[i];
        count++;
        if (count >= max) break;
      }
    }
    return count;
  }

  public get activeCount(): number {
    return this._activeCount;
  }

  public clear(): void {
    this._activeCount = 0;
    this.freeListHead = 0;
    this.idToIndex.fill(-1);
    this.indexToId.fill(-1);
    this.parentId.fill(-1);
    this.hasHierarchy = false;
    this.hasText = false;
    for (let i = 0; i < this.capacity; i++) {
      this.assetRef[i] = null;
      this.freeList[i] = i;
      // 再利用されるスロットを表示状態に戻しておきます。
      // 0 のままだと setVisible(false) の影響が次の生成へ漏れます。
      this.visible[i] = 1.0;
      this.isText[i] = 0.0;
    }
    this.markAllDirty();
  }
}
