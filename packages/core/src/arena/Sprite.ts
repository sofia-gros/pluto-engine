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

import { DEFAULT_FRAME_SIZE } from '@pluto-engine/renderer';
import type { AnimState } from '../anim/AnimState';
import type { Body } from '../physics/Body';
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

/**
 * `getFrameSize` の一時計算用バッファ。
 * `setFrame` から毎フレーム呼ばれるため、module スコープで 1 つだけ確保します。
 */
const _scratchSize = new Float32Array(2);

/**
 * tint モード名 → `TintMode` の対応表 (Phaser 互換)。
 *
 * 毎フレーム呼ばれる `setTintMode` では文字列比較をせず、
 * 呼び出し側で数値解決してから渡します。
 */
const TintModeMap: Record<string, number> = {
  MULTIPLY: 0,
  FILL: 1,
  ADD: 2,
  SCREEN: 3,
  OVERLAY: 4,
  HARD_LIGHT: 5,
};

/** ブレンドモード名 → `BlendMode` の対応表 (Phaser 互換)。WebGL2 は 4 種のみ対応。 */
const BlendModeMap: Record<string, number> = {
  NORMAL: 0,
  ADD: 1,
  MULTIPLY: 2,
  SCREEN: 3,
};

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
   * `scale` は**フレーム寸法の倍率**です。ピクセル数ではありません。
   * `y` を省略した場合は `x` を X/Y 両方に適用します。
   *
   * ```ts
   * this.load.sprite('hero', src, { frameWidth: 32, frameHeight: 32 });
   * const p = this.add.sprite(x, y, 'hero');  // 32px
   * p.setScale(2);                            // 64px
   * ```
   *
   * 表示サイズを直接指定したい場合は `setDisplaySize` を使ってください。
   */
  public setScale(x: number, y?: number): this {
    this._arena.setScale(this.idx, x, y);
    return this;
  }

  public get scale(): number {
    // Phaser 互換: scale は scaleX を返す
    return this._arena.scaleX[this.idx];
  }
  public set scale(val: number) {
    this._arena.setScale(this.idx, val, val);
  }

  /** X 方向のスケール倍率 (Phaser 互換の scaleX)。 */
  public get scaleX(): number {
    return this._arena.scaleX[this.idx];
  }
  public set scaleX(val: number) {
    this._arena.setScaleX(this.idx, val);
  }

  /** Y 方向のスケール倍率 (Phaser 互換の scaleY)。 */
  public get scaleY(): number {
    return this._arena.scaleY[this.idx];
  }
  public set scaleY(val: number) {
    this._arena.setScaleY(this.idx, val);
  }

  // --- 寸法 (Phaser 互換) ---

  /**
   * 現在のフレームのピクセル幅 (スケール未適用)。
   *
   * Phaser 互換の `width` は「フレームの横幅」です。
   * 実際に表示される幅は `displayWidth` を参照してください。
   */
  public get width(): number {
    return this._arena.frameWidth[this.idx];
  }
  public set width(val: number) {
    this._arena.setFrameSize(this.idx, val, this._arena.frameHeight[this.idx]);
  }

  /**
   * 現在のフレームのピクセル高 (スケール未適用)。
   * Phaser 互換の `height` は「フレームの高さ」です。
   */
  public get height(): number {
    return this._arena.frameHeight[this.idx];
  }
  public set height(val: number) {
    this._arena.setFrameSize(this.idx, this._arena.frameWidth[this.idx], val);
  }

  /**
   * 実際に表示される幅 (px)。`width * |scaleX|` です。
   *
   * 当たり判定・`getBounds` はすべてこの値を使います。
   */
  public get displayWidth(): number {
    return this._arena.frameWidth[this.idx] * Math.abs(this._arena.scaleX[this.idx]);
  }

  /** 実際に表示される高さ (px)。`height * |scaleY|` です。 */
  public get displayHeight(): number {
    return this._arena.frameHeight[this.idx] * Math.abs(this._arena.scaleY[this.idx]);
  }

  /**
   * 表示サイズをピクセル単位で指定します (Phaser 互換の setDisplaySize)。
   *
   * 内部では「表示幅 / フレーム幅」を倍率として計算します。
   * テクスチャ未設定でフレーム寸法が既定 (32px) のときは、
   * 現在は 32px 前提の倍率を設定するため、テクスチャ確定後に
   * `setDisplaySize` を呼ぶと期待どおりの表示になります。
   */
  public setDisplaySize(w: number, h: number): this {
    const fw = this._arena.frameWidth[this.idx];
    const fh = this._arena.frameHeight[this.idx];
    if (fw > 0) this._arena.setScaleX(this.idx, w / fw);
    if (fh > 0) this._arena.setScaleY(this.idx, h / fh);
    return this;
  }

  /** テクスチャ未設定のスプライトかどうか (Phaser 互換の hasTexture 相当)。 */
  public get hasTexture(): boolean {
    return this._arena.assetRef[this.idx] !== null;
  }

  // --- 描画原点 (Phaser 互換) ---

  /**
   * 描画原点を設定します (Phaser 互換の setOrigin)。
   *
   * `0.5, 0.5` はスプライトの中心、`0, 0` は左上、`1, 1` は右下です。
   * `y` を省略した場合は `x` を両方に適用します。
   */
  public setOrigin(x = 0.5, y?: number): this {
    this._arena.setOrigin(this.idx, x, y === undefined ? x : y);
    return this;
  }

  /** 描画原点を中央 (0.5, 0.5) に戻します (Phaser 互換の setOriginToDefault)。 */
  public setOriginToDefault(): this {
    return this.setOrigin(0.5, 0.5);
  }

  /** 現在の描画原点を `out` へ書き出します (Phaser 互換の getOrigin)。 */
  public getOrigin(out: Float32Array): this {
    const i = this.idx;
    out[0] = this._arena.originX[i];
    out[1] = this._arena.originY[i];
    return this;
  }

  // --- パララックス (Phaser 互換) ---

  /**
   * カメラスクロール係数を設定します (Phaser 互換の setScrollFactor)。
   *
   * 0.5 を指定するとカメラ移動の半分だけスプライトが動きます（背景など）。
   * `y` を省略した場合は `x` を両方に適用します。
   */
  public setScrollFactor(x: number, y?: number): this {
    this._arena.setScrollFactor(this.idx, x, y === undefined ? x : y);
    return this;
  }

  /** X 方向のカメラスクロール係数 (Phaser 互換の setScrollFactorX)。 */
  public setScrollFactorX(value: number): this {
    const i = this.idx;
    this._arena.setScrollFactor(i, value, this._arena.scrollFactorY[i]);
    return this;
  }

  /** Y 方向のカメラスクロール係数 (Phaser 互換の setScrollFactorY)。 */
  public setScrollFactorY(value: number): this {
    const i = this.idx;
    this._arena.setScrollFactor(i, this._arena.scrollFactorX[i], value);
    return this;
  }

  public get scrollFactorX(): number {
    return this._arena.scrollFactorX[this.idx];
  }
  public get scrollFactorY(): number {
    return this._arena.scrollFactorY[this.idx];
  }

  // --- active / name / type (Phaser 互換) ---

  /**
   * update / render の対象フラグ (Phaser 互換の setActive)。
   *
   * false にすると描画対象から外れます（`visible` とは独立した概念です）。
   */
  public setActive(value: boolean | number): this {
    this._arena.setActive(this.idx, value ? 1 : 0);
    return this;
  }
  public get active(): boolean {
    return this._arena.active[this.idx] !== 0;
  }

  /**
   * 識別名を設定します (Phaser 互換の setName)。
   *
   * 文字列を SoA に格納できないため、`namePool` への参照だけを保持します。
   */
  public setName(value: string): this {
    this._arena.setName(this.idx, value);
    return this;
  }
  public get name(): string {
    return this._arena.nameOf(this.idx);
  }

  /** オブジェクト種別の文字列 (Phaser 互換の type)。 */
  public get type(): string {
    return this._arena.kindNameOf(this.idx);
  }

  // --- tint モード / ブレンドモード (Phaser 互換) ---

  /**
   * tint のブレンドモードを設定します (Phaser 4 互換の setTintMode)。
   *
   * 現在はフラグメントシェーダが `MULTIPLY` のみを実装しています。
   * 値は保持されるため、シェーダを後から拡張しても API は変わりません。
   */
  public setTintMode(mode: number | string): this {
    const resolved = typeof mode === 'string' ? (TintModeMap[mode] ?? 0) : mode;
    this._arena.setTintMode(this.idx, resolved);
    return this;
  }
  public get tintMode(): number {
    return this._arena.tintMode[this.idx];
  }

  /**
   * ブレンドモードを設定します (Phaser 互換の setBlendMode)。
   *
   * WebGL2 がネイティブにサポートするのは 4 種（Normal / Add / Multiply / Screen）だけなので、
   * 範囲外は `Normal` に丸められます。
   * 実際の反映はバッチ分割の実装（Phase 8）まで行われません。
   */
  public setBlendMode(mode: number | string): this {
    const resolved = typeof mode === 'string' ? (BlendModeMap[mode] ?? 0) : mode;
    this._arena.setBlendMode(this.idx, resolved);
    return this;
  }
  public get blendMode(): number {
    return this._arena.blendMode[this.idx];
  }

  // --- 行列 (Phaser 互換) ---

  /**
   * ローカル変換行列 (a, b, c, d, tx, ty) を `out` へ書き出します。
   *
   * Phaser は `Float32Array(4)` を返しますが、
   * **ヒープ確保を避けるため `out` パラメータを必須**にしています
   * （SoA 判定コード **D**：Phaser とシグネチャが異なります）。
   */
  public getLocalTransformMatrix(out: Float32Array): this {
    const i = this.idx;
    const sx = this._arena.scaleX[i];
    const sy = this._arena.scaleY[i];
    const rot = this._arena.rotation[i];
    const c = Math.cos(rot);
    const s = Math.sin(rot);
    out[0] = c * sx;
    out[1] = s * sx;
    out[2] = -s * sy;
    out[3] = c * sy;
    out[4] = this.x;
    out[5] = this.y;
    return this;
  }

  /**
   * ワールド変換行列を `out` へ書き出します。
   *
   * 階層を使っている場合は `computeWorldTransforms()` の結果を使います。
   * シェーダと同じ計算を CPU 側で行っています。
   */
  public getWorldTransformMatrix(out: Float32Array): this {
    const i = this.idx;
    const arena = this._arena;
    const sx = arena.scaleX[i];
    const sy = arena.scaleY[i];
    const useWorld = arena.parentId[i] >= 0;
    const rot = useWorld ? arena.worldRotation[i] : arena.rotation[i];
    const c = Math.cos(rot);
    const s = Math.sin(rot);
    out[0] = c * sx;
    out[1] = s * sx;
    out[2] = -s * sy;
    out[3] = c * sy;
    out[4] = useWorld ? arena.worldX[i] : arena.posX[i];
    out[5] = useWorld ? arena.worldY[i] : arena.posY[i];
    return this;
  }

  /**
   * フレームのピクセル寸法を設定します (Phaser 互換の setSize)。
   * `scale` は倍率なので `width` / `height` には影響しません。
   */
  public setSize(width: number, height: number): this {
    this._arena.setFrameSize(this.idx, width, height);
    return this;
  }

  /** 現在のフレーム寸法を `out` へ書き出します (Phaser 互換の getSize)。 */
  public getSize(out: Float32Array): this {
    const i = this.idx;
    out[0] = this._arena.frameWidth[i];
    out[1] = this._arena.frameHeight[i];
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
      this._arena.setPosX(i, val);
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
      this._arena.setPosY(i, val);
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
      this._arena.setRotation(i, val);
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

  public get facing(): number {
    return this._arena.facing[this.idx];
  }
  public set facing(val: number) {
    this._arena.setFacing(this.idx, val);
  }

  /**
   * 表示するかどうか (Phaser 互換)。
   * false のインスタンスはフラグメントシェーダで discard されます。
   */
  public get visible(): boolean {
    return this._arena.visible[this.idx] === 1;
  }
  public set visible(val: boolean) {
    this._arena.setVisible(this.idx, val ? 1.0 : 0.0);
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
    this._arena.setDepth(this.idx, val);
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
    this._arena.setFrameIdx(this.idx, val);
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
    this._arena.setUvX(this.idx, val);
  }

  public get uvY(): number {
    return this._arena.uvY[this.idx];
  }
  public set uvY(val: number) {
    this._arena.setUvY(this.idx, val);
  }

  public get uvW(): number {
    return this._arena.uvW[this.idx];
  }
  public set uvW(val: number) {
    this._arena.setUvW(this.idx, val);
  }

  public get uvH(): number {
    return this._arena.uvH[this.idx];
  }
  public set uvH(val: number) {
    this._arena.setUvH(this.idx, val);
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
   *
   * テクスチャのフレーム寸法がそのままスプライトの表示サイズになります
   * （`scale` は倍率なので既定の 1.0 ではフレームそのまま）。
   * 同時に、テクスチャ未設定の既定は「透明」だったため tint を不透明へ戻します。
   */
  public setTexture(asset: SpriteAssetLike | null, frame: string | number = 0): this {
    const i = this.idx;
    const resolved = asset?.textureAsset ?? asset;
    this._arena.assetRef[i] = resolved;
    this._arena.setFrameIdx(i, resolved?.layerIndex ?? 0);
    // テクスチャが確定したので不透明に戻します。
    if (resolved) {
      this._arena.setTint(i, (this._arena.tint[i] & 0x00ffffff) | 0xff000000);
    }
    this.setFrame(frame);
    return this;
  }

  /**
   * テクスチャアセットのフレーム寸法 (px) を `out` へ書き出します。
   *
   * `frameWidth` / `frameHeight` が使える場合はそれを使い、
   * 無ければ画像全体の寸法、それも無ければ `DEFAULT_FRAME_SIZE` です。
   *
   * 毎フレーム呼ばれる可能性があるため、戻り値のオブジェクトを
   * 生成せず使い回しバッファへ書き込みます（Flyweight の掟）。
   */
  public getFrameSize(out: Float32Array): this {
    const i = this.idx;
    const asset = this._arena.assetRef[i];
    const resolved = asset?.textureAsset ?? asset;
    if (resolved !== null && resolved !== undefined) {
      const fw = resolved.frameWidth;
      const fh = resolved.frameHeight;
      if (fw !== undefined && fh !== undefined && fw > 0 && fh > 0) {
        out[0] = fw;
        out[1] = fh;
        return this;
      }
      const w = resolved.width;
      const h = resolved.height;
      if (w !== undefined && h !== undefined && w > 0 && h > 0) {
        out[0] = w;
        out[1] = h;
        return this;
      }
    }
    out[0] = DEFAULT_FRAME_SIZE;
    out[1] = DEFAULT_FRAME_SIZE;
    return this;
  }

  /**
   * スプライトシート内の 特定コマを設定します。
   *
   * コマごとに大きさが異なるアトラスでも追従するよう、
   * フレーム UV と同時にピクセル寸法も更新します。
   */
  public setFrame(frame: string | number): this {
    const i = this.idx;
    const asset = this._arena.assetRef[i];
    const frames = asset?.frames;
    const size = _scratchSize;
    this.getFrameSize(size);
    if (!frames || frames.length === 0) {
      // アセット未設定時は UV をテクスチャ全面 へ初期化し、描画可能にする
      if (this._arena.uvW[i] === 0.0 || this._arena.uvH[i] === 0.0) {
        this._arena.setUv4(i, 0.0, 0.0, 1.0, 1.0);
      }
      this._arena.setFrameSize(i, size[0], size[1]);
      return this;
    }
    // フレームは添字 (数値) で指定します。アニメーションのキーだけが文字列です。
    const fIdx = typeof frame === 'number' ? frame : 0;
    if (fIdx >= 0 && fIdx < frames.length) {
      this._arena.srcFrame[i] = fIdx;
      const fData = frames[fIdx];
      this._arena.setUv4(i, fData.uvX, fData.uvY, fData.uvW, fData.uvH);
      this._arena.setFrameSize(i, size[0], size[1]);
    }
    return this;
  }

  /**
   * 水平反転を設定します。
   */
  public setFlipX(flip: boolean): this {
    this._arena.setFacing(this.idx, flip ? -1.0 : 1.0);
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
    this._arena.setFacing(this.idx, val ? -1.0 : 1.0);
  }

  /**
   * 水平反転を反転します (Phaser 互換)。
   */
  public toggleFlipX(): this {
    this._arena.setFacing(this.idx, this._arena.facing[this.idx] < 0 ? 1.0 : -1.0);
    return this;
  }

  // --- 垂直反転 (Phaser 互換) ---

  /**
   * 垂直反転を設定します (Phaser 互換の setFlipY)。
   *
   * `scaleY` の符号で表現します。負の値にすると上下反転します。
   * 非等方スケールに対応したため可能になりました。
   */
  public setFlipY(flip: boolean): this {
    const i = this.idx;
    // 絶対値は保ったまま符号だけ反転します。
    // scaleY が 0 の場合は反転しても描画されないため 1 に寄せます。
    const mag = Math.abs(this._arena.scaleY[i]) || 1;
    this._arena.setScaleY(i, flip ? -mag : mag);
    return this;
  }

  /** 垂直反転の状態 (Phaser 互換の flipY)。`scaleY` が負のとき反転しています。 */
  public get flipY(): boolean {
    return this._arena.scaleY[this.idx] < 0;
  }
  public set flipY(val: boolean) {
    this.setFlipY(val);
  }

  /** 垂直反転を反転します (Phaser 互換の toggleFlipY)。 */
  public toggleFlipY(): this {
    this.setFlipY(!this.flipY);
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
    // 表示サイズは「フレームのピクセル寸法 × スケール倍率」です。
    // 当たり判定も `getBounds` も同じ式を使うので、
    // 画像のサイズを変えればそのまま当たり判定の広さも追従します。
    const halfW = this.displayWidth * 0.5;
    const halfH = this.displayHeight * 0.5;
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
   * 反転状態を初期状態 (反転なし) に戻します (Phaser 互換の resetFlip)。
   *
   * 横・縦の両方を戻します。縦は `scaleY` の符号で表現されます。
   */
  public resetFlip(): this {
    const i = this.idx;
    this._arena.setFacing(i, 1.0);
    this._arena.setScaleY(i, Math.abs(this._arena.scaleY[i]) || 1);
    return this;
  }

  /**
   * 横・縦の反転をまとめて設定します (Phaser 互換の setFlip)。
   *
   * `flipY` を省略した場合は現在の縦反転状態を維持します。
   */
  public setFlip(flipX: boolean, flipY?: boolean): this {
    this.flipX = flipX;
    if (flipY !== undefined) {
      this.setFlipY(flipY);
    }
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
    this._arena.setTint(this.idx, packed);
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
    this.setTint(tintHex);
    if (alpha !== undefined) this.setAlpha(alpha);
    this._arena.setTintMode(this.idx, 1);
    return this;
  }
  /**
   * Tint を白に戻します (Phaser 互換の clearTint)。
   * 現在の alpha は維持します。
   */
  public clearTint(): this {
    const i = this.idx;
    const alpha = (this._arena.tint[i] >>> 24) & 0xff;
    this._arena.setTint(i, (alpha << 24) | 0xffffff);
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
    this._arena.setTint(i, ((this._arena.tint[i] & 0x00ffffff) | (byte << 24)) >>> 0);
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
   * ポインタ操作を有効化します (Phaser 互換の setInteractive)。
   *
   * 引数を省略した場合は**表示サイズ**（フレーム寸法 × スケール倍率）を
   * ヒット領域として使います。これにより画像の大きさに当たり判定が追従します。
   * 明示的な寸法を渡した場合はそちらを優先します。
   */
  public setInteractive(hitWidth?: number, hitHeight?: number): this {
    const i = this.idx;
    this._arena.interactive[i] = 1;
    this._arena.hitWidth[i] = hitWidth ?? 0;
    this._arena.hitHeight[i] = hitHeight ?? 0;
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
   *
   * 実装は {@link InstanceBufferArena.setParentId} に委譲し、
   * ローカル座標の初期化と dirty フラグの立て方を 1 か所に集約しています。
   */
  public setParentId(parentId: number): this {
    this._arena.setParentId(this.id, parentId);
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
   * アニメーション状態ハンドル (Phaser 互換の `sprite.anims`)。
   *
   * Flyweight なので毎フレーム new しません。内部配列を使い回し、
   * 同じスロットなら同じインスタンスを返します。停止中は
   * slot が -1 の無効ハンドルになります。
   *
   * @returns AnimationManager が未初期化なら null
   */
  public get anims(): AnimState | null {
    return this._arena.animTracker?.getAnimState(this.id) ?? null;
  }

  /**
   * 物理ボディ (Phaser 互換の `sprite.body`)。
   *
   * Scene の Body ハンドルキャッシュを経由するため、毎フレーム new は起きません。
   * Sprite 自身は Scene 参照を持たないため、null の場合は
   * {@link Scene.getBody} を使ってください。
   */
  public get body(): Body | null {
    return this._arena.bodyFactory?.(this.id) ?? null;
  }

  /**
   * 逆再生を開始します (Phaser 互換の `playReverse`)。
   * 最終コマから先頭へ戻ります。
   */
  public playReverse(key: string, ignoreIfPlaying = false): AnimState | null {
    return this._arena.animTracker?.playReverse(this.id, key, ignoreIfPlaying) ?? null;
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
