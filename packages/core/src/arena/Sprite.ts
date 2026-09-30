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

/** 座標を受け取るための出力先 (Phaser 互換の getBounds 系) */
export interface BoundsRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 2 つの数値を受け取るための出力先 */
export interface PointLike {
  x: number;
  y: number;
}

/**
 * getBounds の一時計算用です。
 * 毎フレーム new しないため、module スコープで 1 つだけ確保します。
 */
const _scratchBounds: BoundsRect = { x: 0, y: 0, width: 0, height: 0 };

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

  /**
   * 位置を設定し、チェーンのために this を返します (Phaser 互換)。
   */
  public setPosition(x?: number, y?: number, z?: number, w?: number): this {
    void z;
    void w;
    if (x !== undefined) this.x = x;
    if (y !== undefined) this.y = y;
    return this;
  }

  /**
   * X 座標を設定し、チェーンのために this を返します (Phaser 互換)。
   */
  public setX(x: number): this {
    this.x = x;
    return this;
  }

  /**
   * Y 座標を設定し、チェーンのために this を返します (Phaser 互換)。
   */
  public setY(y: number): this {
    this.y = y;
    return this;
  }

  /**
   * スケールを設定します (Phaser 互換)。
   *
   * pluto-engine の scale は X/Y 共通の単一値です。
   * Y のみを指定された場合、Phaser と同じ「X を維持して Y だけ変える」
   * 挙動は表現できないため、引数は無視して単一値として扱います。
   */
  public setScale(x: number, y?: number): this {
    void y;
    this.scale = x;
    return this;
  }

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

  /**
   * 回転角を度で取得します (Phaser 互換の angle)。
   * pluto-engine の内部表現はラジアンです。
   */
  public get angle(): number {
    return (this.rotation * 180) / Math.PI;
  }
  public set angle(val: number) {
    this.rotation = (val * Math.PI) / 180;
  }

  /**
   * 回転角を度で設定し、チェーンのために this を返します (Phaser 互換)。
   */
  public setAngle(degrees: number): this {
    this.angle = degrees;
    return this;
  }

  /**
   * 回転角を度で設定し、チェーンのために this を返します (Phaser 互換の setRotation)。
   * 内部ではラジアンとして保持します。
   */
  public setRotation(degrees: number): this {
    this.angle = degrees;
    return this;
  }

  public get scale(): number {
    return this._arena.scale[this.idx];
  }
  public set scale(val: number) {
    this._arena.scale[this.idx] = val;
    this._arena.dirtyScale = true;
  }

  /**
   * X 方向のスケール (Phaser 互換の scaleX)。
   * pluto-engine の scale は単一値のため、scale と同じ値を返します。
   */
  public get scaleX(): number {
    return this._arena.scale[this.idx];
  }
  public set scaleX(val: number) {
    this._arena.scale[this.idx] = val;
    this._arena.dirtyScale = true;
  }

  /**
   * Y 方向のスケール (Phaser 互換の scaleY)。
   * pluto-engine の scale は単一値のため、scale と同じ値を返します。
   */
  public get scaleY(): number {
    return this._arena.scale[this.idx];
  }
  public set scaleY(val: number) {
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
   * 表示するかどうか (Phaser 互換)。
   * false のインスタンスはフラグメントシェーダで discard されます。
   */
  public get visible(): boolean {
    return this._arena.visible[this.idx] === 1;
  }
  public set visible(val: boolean) {
    this._arena.visible[this.idx] = val ? 1.0 : 0.0;
    this._arena.dirtyVisible = true;
  }

  /**
   * 表示するかどうかを設定し、チェーンのために this を返します。
   */
  public setVisible(value: boolean): this {
    this.visible = value;
    return this;
  }

  /**
   * 表示状態を反転します。
   */
  public toggleVisible(): this {
    this.visible = !this.visible;
    return this;
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
   * テクスチャキーの文字列を取得します (Phaser 互換の texture)。
   *
   * 内部では Texture2DArray のレイヤー番号で保持しているため、
   * キー文字列はアセットの side から返します。読み取り専用です。
   */
  public get texture(): string {
    return this._arena.assetRef[this.idx]?.key ?? '';
  }

  /**
   * テクスチャアセットを設定し、チェーンのために this を返します (Phaser 互換の setTexture)。
   *
   * キーの文字列で渡す場合は Scene 側の textures から解決します。
   * 呼び出し側から textures へ参照できるよう、Sprite は static で保持しません。
   */
  public setTextureByKey(
    scene: { textures?: { get(key: string): unknown } },
    key: string,
    frame: string | number = 0,
  ): this {
    const asset = scene.textures?.get(key) as SpriteAssetLike | undefined;
    return this.setTexture(asset ?? null, frame);
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
    // フレームは添字 (数値) で指定します。アニメーションのキーだけが文字列です。
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
   * 水平反転の状態 (Phaser 互換の flipX)。
   * facing が負のとき反転しています。
   */
  public get flipX(): boolean {
    return this._arena.facing[this.idx] < 0;
  }
  public set flipX(val: boolean) {
    this._arena.facing[this.idx] = val ? -1.0 : 1.0;
    this._arena.dirtyScale = true;
  }

  /**
   * 水平反転を反転します (Phaser 互換)。
   */
  public toggleFlipX(): this {
    this._arena.facing[this.idx] = this._arena.facing[this.idx] < 0 ? 1.0 : -1.0;
    this._arena.dirtyScale = true;
    return this;
  }

  /**
   * 画面上の矩形 (Rotated Rectangle ではなく軸平行矩形) を out へ書き出します (Phaser 互換の getBounds)。
   *
   * 回転を考慮せず、中心とスケールから軸平行矩形を求めます。
   * ヒープ割り当てを避けるため、戻り値は out へ書き込みます。
   */
  public getBounds(out: BoundsRect): this {
    const cx = this.x;
    const cy = this.y;
    // 現在の scale は表示倍率なので、テクスチャの素寸に戻します。
    const i = this.idx;
    const asset = this._arena.assetRef[i];
    const frameW = this._arena.hitWidth[i] > 0 ? this._arena.hitWidth[i] : (asset?.width ?? 0);
    const frameH = this._arena.hitHeight[i] > 0 ? this._arena.hitHeight[i] : (asset?.height ?? 0);
    const s = this._arena.scale[i];
    const halfW = Math.abs(frameW * s) * 0.5;
    const halfH = Math.abs(frameH * s) * 0.5;
    out.x = cx - halfW;
    out.y = cy - halfH;
    out.width = halfW * 2;
    out.height = halfH * 2;
    return this;
  }

  /**
   * 左上端の座標を out へ書き出します (Phaser 互換の getTopLeft)。
   */
  public getTopLeft(out: PointLike): this {
    this.getBounds(_scratchBounds);
    out.x = _scratchBounds.x;
    out.y = _scratchBounds.y;
    return this;
  }

  /**
   * 中央の座標を out へ書き出します (Phaser 互換の getCenter)。
   */
  public getCenter(out: PointLike): this {
    out.x = this.x;
    out.y = this.y;
    return this;
  }

  /**
   * 右下端の座標を out へ書き出します (Phaser 互換の getBottomRight)。
   */
  public getBottomRight(out: PointLike): this {
    this.getBounds(_scratchBounds);
    out.x = _scratchBounds.x + _scratchBounds.width;
    out.y = _scratchBounds.y + _scratchBounds.height;
    return this;
  }

  /**
   * 反転状態を初期状態 (横 反転なし) に戻します (Phaser 互換の resetFlip)。
   *
   * 垂直反転 (flipY) は pluto-engine の scale が単一値のため未対応です。
   * 横方向のみ戻します。
   */
  public resetFlip(): this {
    this._arena.facing[this.idx] = 1.0;
    this._arena.dirtyScale = true;
    return this;
  }

  /**
   * 横・縦の反転をまとめて設定します (Phaser 互換の setFlip)。
   * 縦方向は未対応のため無視されます。
   */
  public setFlip(flipX: boolean, flipY?: boolean): this {
    void flipY;
    this.flipX = flipX;
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
   * 現在の Tint 色を 0xRRGGBB 形式で取得します (Phaser 互換の tint)。
   *
   * 内部ではリトルエンディアンの BGRA として packs されているため、
   * RGB だけを取り出して 0xRRGGBB へ並べ替えます。アルファは含みません。
   */
  public get tint(): number {
    const packed = this._arena.tint[this.idx];
    const r = packed & 0xff;
    const g = (packed >> 8) & 0xff;
    const b = (packed >> 16) & 0xff;
    return (r << 16) | (g << 8) | b;
  }
  public set tint(val: number) {
    this.setTint(val);
  }

  /**
   * 不透明度を指定して単色塗りを近似します (Phaser 互換の setTintFill)。
   *
   * シェーダが texColor * vTint のため、色成分の指定は現状無視されます
   * （係数を 1.0 とした白を置きます）。alpha のみ反映されます。
   */
  public setTintFill(tintHex: number, alpha?: number): this {
    const a = alpha === undefined ? 0xff : Math.max(0, Math.min(255, Math.round(alpha * 255)));
    // フラグメントシェーダが texColor * vTint なので、指定色をそのまま入れると
    // 「元テクスチャ × 指定色」となり単色塗りになりません。
    // ここでは色成分を保持せず、係数を 1.0 として alpha だけを反映します。
    // 真に単色で塗るにはシェーダ側の分岐が必要で、これは将来課題とします。
    void tintHex;
    this._arena.tint[this.idx] = (a << 24) | 0xffffff;
    this._arena.dirtyTint = true;
    return this;
  }
  /**
   * Tint を白に戻します (Phaser 互換の clearTint)。
   * 現在の alpha は維持します。
   */
  public clearTint(): this {
    const i = this.idx;
    const alpha = (this._arena.tint[i] >>> 24) & 0xff;
    this._arena.tint[i] = (alpha << 24) | 0xffffff;
    this._arena.dirtyTint = true;
    return this;
  }

  /**
   * 不透明度を取得します (Phaser 互換の alpha)。0.0 から 1.0 の範囲です。
   *
   * tint はリトルエンディアンの BGRA として packs されているため、
   * 最上位バイトがそのまま A チャンネルになります。
   * そのため alpha 用に新しい SoA フィールドや頂点属性を用意する必要はありません。
   */
  public get alpha(): number {
    return ((this._arena.tint[this.idx] >>> 24) & 0xff) / 255;
  }
  public set alpha(val: number) {
    const clamped = Math.max(0, Math.min(1, val));
    const byte = Math.round(clamped * 255);
    const i = this.idx;
    this._arena.tint[i] = ((this._arena.tint[i] & 0x00ffffff) | (byte << 24)) >>> 0;
    this._arena.dirtyTint = true;
  }

  /**
   * 不透明度を設定し、チェーンのために this を返します (Phaser 互換の setAlpha)。
   */
  public setAlpha(value: number): this {
    this.alpha = value;
    return this;
  }

  /**
   * 不透明度を白 (1.0) に戻します (Phaser 互換の clearAlpha)。
   */
  public clearAlpha(): this {
    return this.setAlpha(1.0);
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
   * 再生中のアニメーションを停止します (Phaser 互換の sprite.anims.stop)。
   *
   * 現在のフレームの UV はそのまま残ります。キーは文字列で、
   * フレーム番号を指定する経路はないため、引数は取りません。
   */
  public stop(): this {
    this._arena.animTracker?.stop(this.id);
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
