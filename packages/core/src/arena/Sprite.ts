/**
 * @file Sprite.ts
 * @description
 * フライウェイトパターンのスプライトハンドル。
 *
 * 設計上の掟: このインスタンスが保持する own プロパティは `id` と `_arena` の 2 つだけです。
 * アセット参照や現在のコマ番号などの状態は、例外なくアリーナ側の SoA 配列
 * (`assetRef` / `srcFrame`) に格納します。これにより 1 インスタンスあたり
 * オブジェクトヘッダ込みで約 32 バイトという目標フットプリントを維持し、
 * ヒープ上のオブジェクトグラフを生成しません。
 */

import type { InstanceBufferArena, SpriteAssetLike } from './InstanceBufferArena';

export class Sprite {
  public readonly id: number;
  private readonly _arena: InstanceBufferArena;

  constructor(id: number, arena: InstanceBufferArena) {
    this.id = id;
    this._arena = arena;
  }

  private get idx(): number {
    return this._arena.idToIndex[this.id];
  }

  /**
   * 現在の SoA スロット番号 (密添字)。
   *
   * 解放済み、または未確保なら -1 を返します。
   * SoA を直接走査する利用者 (インデックス単位のパス処理) のために公開しています。
   * 毎フレーム `id` 1 回の参照で済むため、追加のコストはありません。
   */
  public get index(): number {
    return this._arena.idToIndex[this.id];
  }

  // --- トランスフォーム ---
  // 親子関係を持つ場合 (parentId >= 0) は、x/y/rotation は親からのローカル値として解釈され、
  // 読み出しは computeWorldTransforms() が解決したワールド値を返す。

  public get x(): number {
    const i = this.idx;
    return this._arena.parentId[i] >= 0 ? this._arena.worldX[i] : this._arena.posX[i];
  }
  public set x(val: number) {
    const i = this.idx;
    if (this._arena.parentId[i] >= 0) {
      this._arena.localX[i] = val;
      this._arena.dirtyHierarchy = true;
    } else {
      this._arena.posX[i] = val;
      this._arena.dirtyPos = true;
    }
  }

  public get y(): number {
    const i = this.idx;
    return this._arena.parentId[i] >= 0 ? this._arena.worldY[i] : this._arena.posY[i];
  }
  public set y(val: number) {
    const i = this.idx;
    if (this._arena.parentId[i] >= 0) {
      this._arena.localY[i] = val;
      this._arena.dirtyHierarchy = true;
    } else {
      this._arena.posY[i] = val;
      this._arena.dirtyPos = true;
    }
  }

  /**
   * 回転 (ラジアン)。親を持つ場合は親のワールド回転を加算した値が返ります。
   */
  public get rotation(): number {
    const i = this.idx;
    return this._arena.parentId[i] >= 0 ? this._arena.worldRotation[i] : this._arena.rotation[i];
  }
  public set rotation(val: number) {
    const i = this.idx;
    if (this._arena.parentId[i] >= 0) {
      this._arena.localRotation[i] = val;
      this._arena.dirtyHierarchy = true;
    } else {
      this._arena.rotation[i] = val;
      this._arena.dirtyRotation = true;
    }
  }

  public get scale(): number {
    return this._arena.scale[this.idx];
  }
  public set scale(val: number) {
    this._arena.scale[this.idx] = val;
    this._arena.dirtyScale = true;
  }

  public get facing(): number {
    return this._arena.facing[this.idx];
  }
  public set facing(val: number) {
    this._arena.facing[this.idx] = val;
    this._arena.dirtyScale = true;
  }

  /**
   * 描画優先順 (Z 順ソート値)。大きいほど手前に描画されます。
   */
  public get depth(): number {
    return this._arena.depth[this.idx];
  }
  public set depth(val: number) {
    this._arena.depth[this.idx] = val;
    this._arena.dirtyDepth = true;
  }

  public get depthIndex(): number {
    return this.idx;
  }

  // --- テクスチャ参照 ---

  /**
   * GPU Texture2DArray のサンプリングレイヤーインデックス。
   */
  public get frameIdx(): number {
    return this._arena.frameIdx[this.idx];
  }
  public set frameIdx(val: number) {
    this._arena.frameIdx[this.idx] = val;
    this._arena.dirtyFrameIdx = true;
  }

  /**
   * 同一スプライトシート内の現在のコマ番号。
   */
  public get frame(): number {
    return this._arena.srcFrame[this.idx];
  }
  public set frame(val: number) {
    this.setFrame(val);
  }

  public get uvX(): number {
    return this._arena.uvX[this.idx];
  }
  public set uvX(val: number) {
    this._arena.uvX[this.idx] = val;
    this._arena.dirtyUv = true;
  }

  public get uvY(): number {
    return this._arena.uvY[this.idx];
  }
  public set uvY(val: number) {
    this._arena.uvY[this.idx] = val;
    this._arena.dirtyUv = true;
  }

  public get uvW(): number {
    return this._arena.uvW[this.idx];
  }
  public set uvW(val: number) {
    this._arena.uvW[this.idx] = val;
    this._arena.dirtyUv = true;
  }

  public get uvH(): number {
    return this._arena.uvH[this.idx];
  }
  public set uvH(val: number) {
    this._arena.uvH[this.idx] = val;
    this._arena.dirtyUv = true;
  }

  /**
   * このスプライトが参照しているテクスチャアセット (SoA 格納)。
   */
  public get asset(): SpriteAssetLike | null {
    return this._arena.assetRef[this.idx];
  }

  /**
   * テクスチャアセットを設定し、GPU Texture2DArray の対応レイヤーとフレーム UV を適用します。
   * アセット参照はアリーナ側 (SoA) に格納され、このインスタンスは 32 バイトのまま保たれます。
   */
  public setTexture(asset: SpriteAssetLike | null, frame: string | number = 0): this {
    const i = this.idx;
    const resolved = asset?.textureAsset ?? asset;
    this._arena.assetRef[i] = resolved;
    this._arena.frameIdx[i] = resolved?.layerIndex ?? 0;
    this._arena.dirtyFrameIdx = true;
    this.setFrame(frame);
    return this;
  }

  /**
   * スプライトシート内の 特定コマを設定します。
   */
  public setFrame(frame: string | number): this {
    const i = this.idx;
    const asset = this._arena.assetRef[i];
    const frames = asset?.frames;
    if (!frames || frames.length === 0) {
      // アセット未設定時は UV をテキスト全面 へ初期化し、描画可能にする
      if (this._arena.uvW[i] === 0.0 || this._arena.uvH[i] === 0.0) {
        this._arena.uvX[i] = 0.0;
        this._arena.uvY[i] = 0.0;
        this._arena.uvW[i] = 1.0;
        this._arena.uvH[i] = 1.0;
        this._arena.dirtyUv = true;
      }
      return this;
    }
    const fIdx = typeof frame === 'number' ? frame : 0;
    if (fIdx >= 0 && fIdx < frames.length) {
      this._arena.srcFrame[i] = fIdx;
      const fData = frames[fIdx];
      this._arena.uvX[i] = fData.uvX;
      this._arena.uvY[i] = fData.uvY;
      this._arena.uvW[i] = fData.uvW;
      this._arena.uvH[i] = fData.uvH;
      this._arena.dirtyUv = true;
    }
    return this;
  }

  /**
   * 水平反転を設定します。
   */
  public setFlipX(flip: boolean): this {
    this._arena.facing[this.idx] = flip ? -1.0 : 1.0;
    this._arena.dirtyScale = true;
    return this;
  }

  /**
   * スプライトの乗算カラー (Tint) を設定します。
   * 0xRRGGBB 形式を自動的にリトルエンディアン RGBA Uint32 にパックします。
   */
  public setTint(tintHex: number): this {
    let packed = tintHex;
    if ((tintHex & 0xff000000) === 0) {
      const r = (tintHex >> 16) & 0xff;
      const g = (tintHex >> 8) & 0xff;
      const b = tintHex & 0xff;
      packed = (0xff << 24) | (b << 16) | (g << 8) | r;
    }
    this._arena.tint[this.idx] = packed;
    this._arena.dirtyTint = true;
    return this;
  }

  /**
   * ポインタ操作を有効化します。
   * 引数を省略した場合は参照中のアセット寸法からヒット領域を補完します。
   */
  public setInteractive(hitWidth?: number, hitHeight?: number): this {
    const i = this.idx;
    this._arena.interactive[i] = 1;

    if (hitWidth === undefined) {
      this._arena.hitWidth[i] = this._arena.assetRef[i]?.width ?? 0;
    } else {
      this._arena.hitWidth[i] = hitWidth;
    }

    if (hitHeight === undefined) {
      this._arena.hitHeight[i] = this._arena.assetRef[i]?.height ?? 0;
    } else {
      this._arena.hitHeight[i] = hitHeight;
    }
    return this;
  }

  public get interactive(): boolean {
    return this._arena.interactive[this.idx] === 1;
  }

  public get hitWidth(): number {
    return this._arena.hitWidth[this.idx];
  }

  public get hitHeight(): number {
    return this._arena.hitHeight[this.idx];
  }

  // --- シーングラフ ---

  /**
   * 親スプライト。根の場合は null を返します。
   * 呼び出しごとにヒープを生成しないよう、利用側は parentId を直接参照してください。
   */
  public get parentId(): number {
    return this._arena.parentId[this.idx];
  }

  /**
   * 親スプライトの ID を設定します (-1 で親なし)。
   * 親子関係はネストしたオブジェクト木ではなく SoA の `parentId` 配列で表現されます。
   * 親子付けすると x/y/rotation はローカル値として解釈されます。
   */
  public setParentId(parentId: number): this {
    const i = this.idx;
    const parentIdx = parentId >= 0 ? this._arena.idToIndex[parentId] : -1;
    if (parentId >= 0 && parentIdx < 0) {
      // 存在しない親 ID の場合は根として扱う
      this._arena.parentId[i] = -1;
    } else {
      this._arena.parentId[i] = parentId;
    }
    // ローカル変換を現在の値から初期化する
    this._arena.localX[i] = this._arena.posX[i];
    this._arena.localY[i] = this._arena.posY[i];
    this._arena.localRotation[i] = this._arena.rotation[i];
    this._arena.dirtyHierarchy = true;
    if (parentId >= 0 && parentIdx >= 0) this._arena.hasHierarchy = true;
    return this;
  }

  // --- アニメーション ---

  /**
   * 登録済みアニメーションを再生します。
   * Sprite 参照を一切保持せず ID のみを渡すことで、AnimationManager 側の参照 Map を不要にします。
   */
  public play(key: string, ignoreIfPlaying = false): this {
    this._arena.animTracker?.play(this.id, key, ignoreIfPlaying);
    return this;
  }

  /**
   * アリーナからこのスプライトの ID を解放 (削除) します。
   */
  public destroy(): void {
    this._arena.free(this.id);
  }

  /**
   * 破棄済みかどうか。
   */
  public get destroyed(): boolean {
    return this._arena.idToIndex[this.id] < 0;
  }
}
