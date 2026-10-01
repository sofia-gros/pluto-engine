/**
 * @file InstanceBufferArena.ts
 * @description
 * ゼロアロケーションのための SoA (Structure of Arrays) アリーナ。
 * Sparse Set (Swap-Remove) パターンを導入し、アクティブなエンティティが常に 0〜activeCount-1 に密(Dense)に配置されるようにします。
 * また、Dirty Flag を用いて変更があった属性のみをGPUに転送します。
 *
 * ## SoA と Packed の二重保持
 *
 * SoA 配列は CPU 側の真値です。hitTest・物理・AI・Tween・tilemap が
 * `posX[i]` のように直接読むため、SoA を崩すことはできません。
 *
 * 一方 GPU へは「1 枠 = vec4」で詰めた `packed*` ミラーを渡します
 * （`@pluto-engine/renderer` の `InstanceLayout` がレイアウトの単一の情報源）。
 * ミラーは**毎フレーム repack しません**。本クラスの write-through セッターが
 * SoA とミラーの両方へ同時に書き込むため、1 体あたりのコストは O(1) です。
 *
 * **SoA 配列へ直接代入してはいけません。** セッターを通さないと
 * ミラーが腐り、そのスプライトだけが描画されなくなります。
 *
 * 設計上の掟:
 *  - コンストラクタ以外ではヒープメモリを一切確保しません。
 *  - 親子関係はネストした木ではなく
 *    SoA の parentId 配列で表します。
 *  - computeWorldTransforms() が
 *    ローカル座標をワールド座標へ畳み込みます。
 */

import {
  BlendMode,
  DEFAULT_FRAME_SIZE,
  FlagsLane,
  OriginLane,
  ShapeLane,
  TintMode,
  TransformLane,
  UvLane,
} from '@pluto-engine/renderer';
import type { AnimState } from '../anim/AnimState';

/**
 * スプライトが参照するテクスチャアセットの最小インターフェース。
 * 実体は TextureManager / LoaderManager が保持する TextureAsset。
 */
export interface SpriteAssetLike {
  /** GPU Texture2DArray のレイヤーインデックス */
  layerIndex?: number;
  /** テクスチャ全体のピクセル幅 */
  width?: number;
  /** テクスチャ全体のピクセル高さ */
  height?: number;
  /**
   * 1 フレームのピクセル幅。
   * スプライトの表示サイズ（`width`）の基準になります。
   */
  frameWidth?: number;
  /** 1 フレームのピクセル高さ。表示サイズの基準になります。 */
  frameHeight?: number;
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
  play(id: number, key: string, ignoreIfPlaying?: boolean): AnimState | null;
  playReverse(id: number, key: string, ignoreIfPlaying?: boolean): AnimState | null;
  getAnimState(id: number): AnimState;
  stop(id: number): void;
}

export class InstanceBufferArena {
  public readonly capacity: number;
  private _activeCount = 0;

  // --- SoA Arrays (Dense, 常に 0 ~ activeCount - 1 にデータが詰まる) ---
  public readonly posX: Float32Array;
  public readonly posY: Float32Array;
  public readonly rotation: Float32Array;
  /**
   * X 方向のスケール**倍率**。
   * 1.0 ならフレーム寸法そのままの大きさに描画されます。
   * ピクセル数ではありません。描画サイズは `frameWidth * scaleX` です。
   */
  public readonly scaleX: Float32Array;
  /** Y 方向のスケール倍率。`scaleX` と同じ扱い (1.0 = フレーム寸法そのまま)。 */
  public readonly scaleY: Float32Array;
  /**
   * 現在のフレームのピクセル幅。
   *
   * 頂点シェーダはクワッドの大きさを `frameWidth * scaleX` で決めるため、
   * テクスチャのピクセル寸法が必要です。
   * テクスチャ未設定時は `DEFAULT_FRAME_SIZE` を入れます。
   */
  public readonly frameWidth: Float32Array;
  /** 現在のフレームのピクセル高さ。`frameWidth` と同じ扱い。 */
  public readonly frameHeight: Float32Array;
  public readonly facing: Float32Array;
  public readonly depth: Float32Array;

  // --- Phaser 4 互換の追加フィールド ---
  /**
   * 描画原点の X 座標 (0.0〜1.0)。
   *
   * Phaser の既定は 0.5, 0.5（スプライトの中心）です。
   * クワッドはこの値を引いてから `frameSize * scale` で拡大するため、
   * 頂点シェーダ側で処理します。
   */
  public readonly originX: Float32Array;
  /** 描画原点の Y 座標 (0.0〜1.0)。既定 0.5。 */
  public readonly originY: Float32Array;
  /**
   * カメラスクロールの係数 X（パララックス）。
   *
   * 描画位置を `x - camera.scrollX * scrollFactorX` で求めるため、
   * カメラごとに 1 回ずつ計算します。
   */
  public readonly scrollFactorX: Float32Array;
  /** カメラスクロールの係数 Y。既定 1.0。 */
  public readonly scrollFactorY: Float32Array;
  /** 1 = update / render の対象、0 = スキップ。Phaser の `active`。 */
  public readonly active: Uint8Array;
  /** `TintMode` の値。フラグメントシェーダの分岐に使います。 */
  public readonly tintMode: Uint8Array;
  /** `BlendMode` の値。バッチ分割のキーになります。 */
  public readonly blendMode: Uint8Array;
  /** `setName` で設定した文字列のスロット番号（-1 = 未設定）。 */
  public readonly nameSlot: Int32Array;
  /** `type` の数値表現。文字列は `kindNames` から返します。 */
  public readonly kind: Uint8Array;
  /** `nameSlot` が参照する文字列プール。`addName()` で grown します。 */
  public readonly namePool: string[] = [];
  /** `kind` が参照する文字列プール。 */
  public readonly kindNames: string[] = ['Sprite'];
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

  // --- Packed Mirrors (GPU 転送用。vec4 単位にまとめたもの) ---
  /**
   * `posX, posY, scaleX, scaleY` を 1 インスタンス 16 バイトに詰めたミラー。
   * `TransformLane` がレーン位置を与えます。
   */
  public readonly packedTransform: Float32Array;
  /** `uvX, uvY, uvW, uvH` を 1 インスタンス 16 バイトに詰めたミラー。 */
  public readonly packedUv: Float32Array;
  /** `frameIdx, facing, visible, isText` を 1 インスタンス 16 バイトに詰めたミラー。 */
  public readonly packedFlags: Float32Array;
  /** `rotation, frameWidth, frameHeight, depth` を 1 インスタンス 16 バイトに詰めたミラー。 */
  public readonly packedShape: Float32Array;
  /** `RGBA` を 1 インスタンス 4 バイト (unorm8x4) で保持するミラー。 */
  public readonly packedTint: Uint32Array;
  /** `originX, originY, scrollFactorX, scrollFactorY` を 1 インスタンス 16 バイトに詰めたミラー。 */
  public readonly packedOrigin: Float32Array;
  /**
   * ユーザー拡張用の `vec4` × 4（1 インスタンス 64 バイト）。
   * エンジンは書き込みません。利用側が `setExt` 経由で使います。
   */
  public readonly packedExt: Float32Array;

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

  // --- Group Dirty Flags (packed ミラーの転送判定に使う) ---
  /**
   * `packedTransform` が前回転送時から変化したかどうか。
   * write-through セッターが自動で立てます。
   */
  public dirtyTransformGroup = true;
  /** `packedUv` が前回転送時から変化したかどうか。 */
  public dirtyUvGroup = true;
  /** `packedFlags` が前回転送時から変化したかどうか。 */
  public dirtyFlagsGroup = true;
  /** `packedShape` (rotation / frameWidth / frameHeight / depth) が変化したかどうか。 */
  public dirtyShapeGroup = true;
  /** `packedOrigin` (originX / originY / scrollFactorX / scrollFactorY) が変化したかどうか。 */
  public dirtyOriginGroup = true;
  /** `packedTint` が前回転送時から変化したかどうか。 */
  public dirtyTintGroup = true;
  /** `packedExt` が前回転送時から変化したかどうか。 */
  public dirtyExtGroup = false;

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
    this.scaleX = new Float32Array(maxInstances).fill(1);
    this.scaleY = new Float32Array(maxInstances).fill(1);
    // テクスチャ未設定のスプライトは透明な既定サイズを持ちます。
    this.frameWidth = new Float32Array(maxInstances).fill(DEFAULT_FRAME_SIZE);
    this.frameHeight = new Float32Array(maxInstances).fill(DEFAULT_FRAME_SIZE);
    this.facing = new Float32Array(maxInstances);
    this.depth = new Float32Array(maxInstances);

    // Phaser 4 互換の追加フィールド。
    // origin は Phaser と同じ中央 (0.5, 0.5)、scrollFactor は 1.0 が既定です。
    this.originX = new Float32Array(maxInstances).fill(0.5);
    this.originY = new Float32Array(maxInstances).fill(0.5);
    this.scrollFactorX = new Float32Array(maxInstances).fill(1);
    this.scrollFactorY = new Float32Array(maxInstances).fill(1);
    this.active = new Uint8Array(maxInstances).fill(1);
    this.tintMode = new Uint8Array(maxInstances).fill(TintMode.Multiply);
    this.blendMode = new Uint8Array(maxInstances).fill(BlendMode.Normal);
    this.nameSlot = new Int32Array(maxInstances).fill(-1);
    this.kind = new Uint8Array(maxInstances);
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

    // Packed ミラー。GPU へはこれらを vec4 単位で転送します。
    // 総コストは 1 インスタンス 68 バイト + 拡張枠 64 バイトです。
    this.packedTransform = new Float32Array(maxInstances * 4);
    this.packedUv = new Float32Array(maxInstances * 4);
    this.packedFlags = new Float32Array(maxInstances * 4);
    this.packedShape = new Float32Array(maxInstances * 4);
    this.packedTint = new Uint32Array(maxInstances).fill(0xffffffff);
    this.packedOrigin = new Float32Array(maxInstances * 4);
    this.packedExt = new Float32Array(maxInstances * 16);

    // origin / scrollFactor の既定をミラーへ反映しておきます。
    for (let i = 0; i < maxInstances; i++) {
      const base = i * 4;
      this.packedOrigin[base + OriginLane.OriginX] = 0.5;
      this.packedOrigin[base + OriginLane.OriginY] = 0.5;
      this.packedOrigin[base + OriginLane.ScrollFactorX] = 1.0;
      this.packedOrigin[base + OriginLane.ScrollFactorY] = 1.0;
    }

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
    this.scaleX[idx] = 1.0;
    this.scaleY[idx] = 1.0;
    this.frameWidth[idx] = DEFAULT_FRAME_SIZE;
    this.frameHeight[idx] = DEFAULT_FRAME_SIZE;
    this.facing[idx] = 1.0;
    this.depth[idx] = 0.0;
    this.frameIdx[idx] = 0.0;
    // UV も明示的にリセットします。
    // かつては未代入のままで、スロット再利用時に前のスプライトの UV が
    // 漏れていました（packed ミラー導入時に SoA と既定値がずれる原因とも
    // なっていたため、ここで両方を 0 に揃えます）。
    // 0 は UV 面積が 0 = (point sample) となり、レイヤー 0 の白 1 ピクセルを引きます。
    this.uvX[idx] = 0.0;
    this.uvY[idx] = 0.0;
    this.uvW[idx] = 0.0;
    this.uvH[idx] = 0.0;
    this.srcFrame[idx] = 0;
    // テクスチャ未設定のスプライトは**透明**です (Phaser の `__DEFAULT` 相当)。
    // 見た目には 32x32 の透明な画像として扱われます。
    // 実際に画像を設定した時点で `Sprite.setTexture` が不透明へ戻すため、
    // `add.sprite(x, y)` 単体では白い箱は出ません。
    this.tint[idx] = 0x00ffffff;
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

    // Phaser 4 互換フィールドの既定値。
    this.originX[idx] = 0.5;
    this.originY[idx] = 0.5;
    this.scrollFactorX[idx] = 1.0;
    this.scrollFactorY[idx] = 1.0;
    this.active[idx] = 1;
    this.tintMode[idx] = TintMode.Multiply;
    this.blendMode[idx] = BlendMode.Normal;
    this.nameSlot[idx] = -1;
    this.kind[idx] = 0;

    // Packed ミラーも同じ既定値へ揃えます。
    // SoA とミラーがずれると、その 1 体だけ描画がおかしくなります。
    const tBase = idx * 4;
    this.packedTransform[tBase + TransformLane.PosX] = 0.0;
    this.packedTransform[tBase + TransformLane.PosY] = 0.0;
    this.packedTransform[tBase + TransformLane.ScaleX] = 1.0;
    this.packedTransform[tBase + TransformLane.ScaleY] = 1.0;
    this.packedUv[tBase + UvLane.X] = 0.0;
    this.packedUv[tBase + UvLane.Y] = 0.0;
    this.packedUv[tBase + UvLane.W] = 0.0;
    this.packedUv[tBase + UvLane.H] = 0.0;
    this.packedFlags[tBase + FlagsLane.FrameIdx] = 0.0;
    this.packedFlags[tBase + FlagsLane.Facing] = 1.0;
    this.packedFlags[tBase + FlagsLane.Visible] = 1.0;
    this.packedFlags[tBase + FlagsLane.IsText] = 0.0;
    this.packedShape[tBase + ShapeLane.Rotation] = 0.0;
    this.packedShape[tBase + ShapeLane.FrameWidth] = DEFAULT_FRAME_SIZE;
    this.packedShape[tBase + ShapeLane.FrameHeight] = DEFAULT_FRAME_SIZE;
    this.packedShape[tBase + ShapeLane.Depth] = 0.0;
    this.packedTint[idx] = 0x00ffffff;
    this.packedOrigin[tBase + OriginLane.OriginX] = 0.5;
    this.packedOrigin[tBase + OriginLane.OriginY] = 0.5;
    this.packedOrigin[tBase + OriginLane.ScrollFactorX] = 1.0;
    this.packedOrigin[tBase + OriginLane.ScrollFactorY] = 1.0;
    // packedExt はユーザー拡張用のため、ここでは触りません（0 初期化のまま）。

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
      this.scaleX[idx] = this.scaleX[lastIdx];
      this.scaleY[idx] = this.scaleY[lastIdx];
      this.frameWidth[idx] = this.frameWidth[lastIdx];
      this.frameHeight[idx] = this.frameHeight[lastIdx];
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
      this.originX[idx] = this.originX[lastIdx];
      this.originY[idx] = this.originY[lastIdx];
      this.scrollFactorX[idx] = this.scrollFactorX[lastIdx];
      this.scrollFactorY[idx] = this.scrollFactorY[lastIdx];
      this.active[idx] = this.active[lastIdx];
      this.tintMode[idx] = this.tintMode[lastIdx];
      this.blendMode[idx] = this.blendMode[lastIdx];
      this.nameSlot[idx] = this.nameSlot[lastIdx];
      this.kind[idx] = this.kind[lastIdx];

      // Packed ミラーも同じ末尾要素で詰め替えます。
      // SoA とミラーがずれると、末尾要素のスプライトが化けます。
      const pBase = idx * 4;
      const lBase = lastIdx * 4;
      const eBase = idx * 16;
      const leBase = lastIdx * 16;
      for (let k = 0; k < 4; k++) {
        this.packedTransform[pBase + k] = this.packedTransform[lBase + k];
        this.packedUv[pBase + k] = this.packedUv[lBase + k];
        this.packedFlags[pBase + k] = this.packedFlags[lBase + k];
        this.packedShape[pBase + k] = this.packedShape[lBase + k];
        this.packedOrigin[pBase + k] = this.packedOrigin[lBase + k];
      }
      for (let k = 0; k < 16; k++) {
        this.packedExt[eBase + k] = this.packedExt[leBase + k];
      }
      this.packedTint[idx] = this.packedTint[lastIdx];

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
    // packed ミラーも全グループを再送します。
    this.dirtyTransformGroup = true;
    this.dirtyUvGroup = true;
    this.dirtyFlagsGroup = true;
    this.dirtyShapeGroup = true;
    this.dirtyOriginGroup = true;
    this.dirtyTintGroup = true;
    this.dirtyExtGroup = true;
  }

  // ============================================================
  // Write-through セッター群
  // ============================================================
  //
  // SoA と packed ミラーの両方へ同時に書き込みます。
  // **SoA 配列へ直接代入しないでください。** セッターを通さないと
  // ミラーが腐り、そのスプライトだけが描画されなくなります。
  //
  // いずれも O(1) です。毎フレームの pack コストは「動いたスプライト数」に
  // 比例するため、300k 体を毎フレーム書き直すより十分小さいです。

  /** `posX` を書き込みます。 */
  public setPosX(i: number, v: number): void {
    this.posX[i] = v;
    this.packedTransform[i * 4 + TransformLane.PosX] = v;
    this.dirtyPos = true;
    this.dirtyTransformGroup = true;
  }

  /** `posY` を書き込みます。 */
  public setPosY(i: number, v: number): void {
    this.posY[i] = v;
    this.packedTransform[i * 4 + TransformLane.PosY] = v;
    this.dirtyPos = true;
    this.dirtyTransformGroup = true;
  }

  /** X 方向のスケール**倍率**を書き込みます。1.0 = フレーム寸法そのまま。 */
  public setScaleX(i: number, v: number): void {
    this.scaleX[i] = v;
    this.packedTransform[i * 4 + TransformLane.ScaleX] = v;
    this.dirtyScale = true;
    this.dirtyTransformGroup = true;
  }

  /** Y 方向のスケール倍率を書き込みます。1.0 = フレーム寸法そのまま。 */
  public setScaleY(i: number, v: number): void {
    this.scaleY[i] = v;
    this.packedTransform[i * 4 + TransformLane.ScaleY] = v;
    this.dirtyScale = true;
    this.dirtyTransformGroup = true;
  }

  /**
   * スケール倍率をまとめて書き込みます。
   *
   * `y` を省略した場合は `x` を両方に適用します（Phaser 互換）。
   */
  public setScale(i: number, x: number, y?: number): void {
    const sy = y === undefined ? x : y;
    const base = i * 4;
    this.scaleX[i] = x;
    this.scaleY[i] = sy;
    this.packedTransform[base + TransformLane.ScaleX] = x;
    this.packedTransform[base + TransformLane.ScaleY] = sy;
    this.dirtyScale = true;
    this.dirtyTransformGroup = true;
  }

  /**
   * 現在のフレームのピクセル寸法を書き込みます。
   *
   * 頂点シェーダはクワッドの大きさを `frameWidth * scaleX` で決めるため、
   * テクスチャのピクセル寸法が必要です。
   *
   * @param i     SoA スロット番号
   * @param w     フレーム幅 (px)
   * @param h     フレーム高 (px)
   * @param keepScale true なら `scaleX` / `scaleY` を倍率のまま維持します
   *                  （フレームだけ差し替えたときの見た目を保つため）
   */
  public setFrameSize(i: number, w: number, h: number, keepScale = true): void {
    const base = i * 4;
    this.frameWidth[i] = w;
    this.frameHeight[i] = h;
    this.packedShape[base + ShapeLane.FrameWidth] = w;
    this.packedShape[base + ShapeLane.FrameHeight] = h;
    if (!keepScale) {
      this.scaleX[i] = 1;
      this.scaleY[i] = 1;
      this.packedTransform[base + TransformLane.ScaleX] = 1;
      this.packedTransform[base + TransformLane.ScaleY] = 1;
    }
    this.dirtyShapeGroup = true;
    if (!keepScale) this.dirtyTransformGroup = true;
  }

  /** `rotation` を書き込みます。 */
  public setRotation(i: number, v: number): void {
    this.rotation[i] = v;
    this.packedShape[i * 4 + ShapeLane.Rotation] = v;
    this.dirtyRotation = true;
    this.dirtyShapeGroup = true;
  }

  /** `uvX` を書き込みます。 */
  public setUvX(i: number, v: number): void {
    this.uvX[i] = v;
    this.packedUv[i * 4 + UvLane.X] = v;
    this.dirtyUv = true;
    this.dirtyUvGroup = true;
  }

  /** `uvY` を書き込みます。 */
  public setUvY(i: number, v: number): void {
    this.uvY[i] = v;
    this.packedUv[i * 4 + UvLane.Y] = v;
    this.dirtyUv = true;
    this.dirtyUvGroup = true;
  }

  /** `uvW` を書き込みます。 */
  public setUvW(i: number, v: number): void {
    this.uvW[i] = v;
    this.packedUv[i * 4 + UvLane.W] = v;
    this.dirtyUv = true;
    this.dirtyUvGroup = true;
  }

  /** `uvH` を書き込みます。 */
  public setUvH(i: number, v: number): void {
    this.uvH[i] = v;
    this.packedUv[i * 4 + UvLane.H] = v;
    this.dirtyUv = true;
    this.dirtyUvGroup = true;
  }

  /** `frameIdx` を書き込みます。 */
  public setFrameIdx(i: number, v: number): void {
    this.frameIdx[i] = v;
    this.packedFlags[i * 4 + FlagsLane.FrameIdx] = v;
    this.dirtyFrameIdx = true;
    this.dirtyFlagsGroup = true;
  }

  /** `facing` を書き込みます。 */
  public setFacing(i: number, v: number): void {
    this.facing[i] = v;
    this.packedFlags[i * 4 + FlagsLane.Facing] = v;
    this.dirtyScale = true;
    this.dirtyFlagsGroup = true;
  }

  /** `visible` を書き込みます。 */
  public setVisible(i: number, v: number): void {
    this.visible[i] = v;
    // `active` が 0 のスプライトは描画されないため、
    // GPU へは `visible && active` を送ります。
    // 逆も同様で `setActive` 側で `visible` 側を書き直すため、
    // どちらを先に呼んでも結果は同じになります。
    const draw = v !== 0 && this.active[i] !== 0 ? 1.0 : 0.0;
    this.packedFlags[i * 4 + FlagsLane.Visible] = draw;
    this.dirtyVisible = true;
    this.dirtyFlagsGroup = true;
  }

  /** `isText` を書き込みます。 */
  public setIsText(i: number, v: number): void {
    this.isText[i] = v;
    this.packedFlags[i * 4 + FlagsLane.IsText] = v;
    if (v !== 0) this.hasText = true;
    this.dirtyIsText = true;
    this.dirtyFlagsGroup = true;
  }

  /** `tint` を書き込みます。 */
  public setTint(i: number, v: number): void {
    this.tint[i] = v;
    this.packedTint[i] = v;
    this.dirtyTint = true;
    this.dirtyTintGroup = true;
  }

  // --- Phaser 4 互換フィールドの write-through セッター ---

  /** 描画原点を書き込みます。Phaser の既定は 0.5, 0.5 です。 */
  public setOrigin(i: number, x: number, y: number): void {
    const base = i * 4;
    this.originX[i] = x;
    this.originY[i] = y;
    this.packedOrigin[base + OriginLane.OriginX] = x;
    this.packedOrigin[base + OriginLane.OriginY] = y;
    this.dirtyOriginGroup = true;
  }

  /**
   * カメラスクロール係数を書き込みます。
   * パララックス（背景をゆっくり動かす）に使います。
   */
  public setScrollFactor(i: number, x: number, y: number): void {
    const base = i * 4;
    this.scrollFactorX[i] = x;
    this.scrollFactorY[i] = y;
    this.packedOrigin[base + OriginLane.ScrollFactorX] = x;
    this.packedOrigin[base + OriginLane.ScrollFactorY] = y;
    this.dirtyOriginGroup = true;
  }

  /**
   * update / render の対象フラグ。0 なら描画対象から外します。
   *
   * Phaser の `active` は「visible とは独立した概念」ですが、
   * どちらも「描画するか否か」なので GPU へは AND を取った値を送ります。
   * 頂点シェーダに新しい属性枠を消費せずに済む点が利点です。
   */
  public setActive(i: number, v: number): void {
    this.active[i] = v;
    const draw = v !== 0 && this.visible[i] !== 0 ? 1.0 : 0.0;
    this.packedFlags[i * 4 + FlagsLane.Visible] = draw;
    this.dirtyFlagsGroup = true;
  }

  /**
   * tint のブレンドモードを書き込みます。
   *
   * 現状のフラグメントシェーダは `MULTIPLY` のみを実装しています
   * （分岐を増やさず要件2「WebGPU > WebGL > CPU」を保つため）。
   * 値としては保持されるので、後からシェーダを拡張neau，而不改变 API。
   */
  public setTintMode(i: number, v: number): void {
    this.tintMode[i] = v;
  }

  /**
   * ブレンドモードを書き込みます。
   *
   * WebGL2 がネイティブにサポートするのは 4 種（Normal / Add / Multiply / Screen）だけなので、
   * 範囲外は `BlendMode.Normal` へ丸めます。
   * 実際の反映はバッチ分割が実装されるまで行われません（Phase 8）。
   */
  public setBlendMode(i: number, v: number): void {
    const clamped = v >= 0 && v < BlendMode.Count ? v : BlendMode.Normal;
    this.blendMode[i] = clamped;
  }

  /**
   * `name` 文字列をスロット化します。
   *
   * 文字列を SoA に入れることはできないため、
   * `namePool` への参照（スロット番号）だけを `Int32Array` に持ちます。
   *
   * @returns 確保されたスロット番号
   */
  public setName(i: number, name: string): number {
    let slot = -1;
    for (let k = 0; k < this.namePool.length; k++) {
      if (this.namePool[k] === name) {
        slot = k;
        break;
      }
    }
    if (slot === -1) {
      slot = this.namePool.length;
      this.namePool.push(name);
    }
    this.nameSlot[i] = slot;
    return slot;
  }

  /** `name` 文字列を取得します（未設定なら空文字）。 */
  public nameOf(i: number): string {
    const slot = this.nameSlot[i];
    if (slot < 0 || slot >= this.namePool.length) return '';
    return this.namePool[slot];
  }

  /** `type` の文字列を返します。 */
  public kindNameOf(i: number): string {
    return this.kindNames[this.kind[i]] ?? 'Sprite';
  }

  /**
   * `depth` を書き込みます。
   * Z 順ソート用に `packedShape` のレーンへ渡します。
   */
  public setDepth(i: number, v: number): void {
    this.depth[i] = v;
    this.packedShape[i * 4 + ShapeLane.Depth] = v;
    this.dirtyDepth = true;
    this.dirtyShapeGroup = true;
  }

  /**
   * 拡張枠 `packedExt` の `vec4` を 1 つ書き込みます。
   *
   * @param i    SoA スロット番号
   * @param slot 0〜3 の拡張枠番号
   * @param x,y,z,w 書き込む値
   */
  public setExt(i: number, slot: number, x: number, y: number, z: number, w: number): void {
    const base = i * 16 + slot * 4;
    this.packedExt[base] = x;
    this.packedExt[base + 1] = y;
    this.packedExt[base + 2] = z;
    this.packedExt[base + 3] = w;
    this.dirtyExtGroup = true;
  }

  /**
   * 拡張枠の 1 つの `vec4` を out へ読み出します。
   * ヒープを割り当てないため、呼び出し側の使い回しバッファへ書き込みます。
   */
  public getExt(i: number, slot: number, out: Float32Array): void {
    const base = i * 16 + slot * 4;
    out[0] = this.packedExt[base];
    out[1] = this.packedExt[base + 1];
    out[2] = this.packedExt[base + 2];
    out[3] = this.packedExt[base + 3];
  }

  /**
   * transform の 4 フィールドをまとめて書き込みます。
   *
   * `scaleX` / `scaleY` は倍率です。Y を省略すると X を両方に適用します。
   */
  public setTransform4(
    i: number,
    posX: number,
    posY: number,
    scaleX: number,
    scaleY?: number,
  ): void {
    const sy = scaleY === undefined ? scaleX : scaleY;
    const base = i * 4;
    this.posX[i] = posX;
    this.posY[i] = posY;
    this.scaleX[i] = scaleX;
    this.scaleY[i] = sy;
    this.packedTransform[base + TransformLane.PosX] = posX;
    this.packedTransform[base + TransformLane.PosY] = posY;
    this.packedTransform[base + TransformLane.ScaleX] = scaleX;
    this.packedTransform[base + TransformLane.ScaleY] = sy;
    this.dirtyPos = true;
    this.dirtyScale = true;
    this.dirtyTransformGroup = true;
  }

  /** 4 フィールドをまとめて `packedUv` へ書き込みます。 */
  public setUv4(i: number, x: number, y: number, w: number, h: number): void {
    const base = i * 4;
    this.uvX[i] = x;
    this.uvY[i] = y;
    this.uvW[i] = w;
    this.uvH[i] = h;
    this.packedUv[base + UvLane.X] = x;
    this.packedUv[base + UvLane.Y] = y;
    this.packedUv[base + UvLane.W] = w;
    this.packedUv[base + UvLane.H] = h;
    this.dirtyUv = true;
    this.dirtyUvGroup = true;
  }

  /** 4 フィールドをまとめて `packedFlags` へ書き込みます。 */
  public setFlags4(
    i: number,
    frameIdx: number,
    facing: number,
    visible: number,
    isText: number,
  ): void {
    const base = i * 4;
    this.frameIdx[i] = frameIdx;
    this.facing[i] = facing;
    this.visible[i] = visible;
    this.isText[i] = isText;
    this.packedFlags[base + FlagsLane.FrameIdx] = frameIdx;
    this.packedFlags[base + FlagsLane.Facing] = facing;
    this.packedFlags[base + FlagsLane.Visible] = visible;
    this.packedFlags[base + FlagsLane.IsText] = isText;
    if (isText !== 0) this.hasText = true;
    this.dirtyFrameIdx = true;
    this.dirtyScale = true;
    this.dirtyVisible = true;
    this.dirtyIsText = true;
    this.dirtyFlagsGroup = true;
  }

  /**
   * SoA シーングラフの変換を 1 パスで解決します。
   * ネストしたオブジェクト木は作りません。
   * インデックス配列と再帰で解決します。
   * 親を先に解決したかどうかはスタンプで判定します。
   * ヒープ割り当ては発生しません。
   * 再帰の深さは階層と同じで、浅くなります。
   *
   * 階層を使っている場合、GPU はワールド座標で描画する必要があります。
   * そのため解決と同時に `packedTransform` へ書き戻します
   * （階層を使わないシーンでは write-through がそのまま使われるため、
   * この O(n) パスは走りません）。
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

    // 解決済みのワールド座標を GPU 転送用のミラーへ反映する。
    // rotation は transform ではなく shape バッファの担当になりました。
    for (let i = 0; i < this._activeCount; i++) {
      const base = i * 4;
      this.packedTransform[base + TransformLane.PosX] = this.worldX[i];
      this.packedTransform[base + TransformLane.PosY] = this.worldY[i];
      this.packedShape[base + ShapeLane.Rotation] = this.worldRotation[i];
    }
    this.dirtyTransformGroup = true;
    this.dirtyShapeGroup = true;
    // dirtyHierarchy は Scene 側がループ判定で管理するため、ここでは触りません。
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
      // 明示的なヒット領域が指定されていなければ、
      // 「フレームのピクセル寸法 × スケール倍率」を使います。
      // これにより当たり判定が画像の大きさに追従します (Phaser 互換)。
      const hw =
        this.hitWidth[i] > 0 ? this.hitWidth[i] : this.frameWidth[i] * Math.abs(this.scaleX[i]);
      const hh =
        this.hitHeight[i] > 0 ? this.hitHeight[i] : this.frameHeight[i] * Math.abs(this.scaleY[i]);
      const halfW = hw * 0.5;
      const halfH = hh * 0.5;

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
      // ミラー側も同じ既定値へ戻します。
      const base = i * 4;
      this.packedFlags[base + FlagsLane.Visible] = 1.0;
      this.packedFlags[base + FlagsLane.IsText] = 0.0;
      this.packedOrigin[base + OriginLane.OriginX] = 0.5;
      this.packedOrigin[base + OriginLane.OriginY] = 0.5;
      this.packedOrigin[base + OriginLane.ScrollFactorX] = 1.0;
      this.packedOrigin[base + OriginLane.ScrollFactorY] = 1.0;
    }
    this.namePool.length = 0;
    this.markAllDirty();
  }
}
