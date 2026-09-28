/**
 * @file Sprite.ts
 * @description
 * フライウェイトパターンのスプライトハンドル。
 * ヒープオブジェクトを生成せず、InstanceBufferArena の ID を介して
 * 位置、スケール、テクスチャレイヤー、UV座標、Tint色を操作します。
 */

import type { InstanceBufferArena } from './InstanceBufferArena';

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

  public get x(): number {
    return this._arena.posX[this.idx];
  }
  public set x(val: number) {
    this._arena.posX[this.idx] = val;
    this._arena.dirtyPos = true;
  }

  public get y(): number {
    return this._arena.posY[this.idx];
  }
  public set y(val: number) {
    this._arena.posY[this.idx] = val;
    this._arena.dirtyPos = true;
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

  public get frameIdx(): number {
    return this._arena.frameIdx[this.idx];
  }
  public set frameIdx(val: number) {
    this._arena.frameIdx[this.idx] = val;
    this._arena.dirtyFrameIdx = true;
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

  // Animation support
  public get frame(): number {
    return this._currentFrame;
  }
  public set frame(val: number) {
    this.setFrame(Math.floor(val));
  }

  private _asset: any;
  private _currentFrame = 0;

  /**
   * テクスチャアセットを設定し、GPU Texture2DArray の対応レイヤーとフレームUVを適用します。
   */
  public setTexture(asset: any, frame: string | number = 0): this {
    this._asset = asset;
    const i = this.idx;
    const layerIdx = asset?.layerIndex ?? asset?.textureAsset?.layerIndex ?? 0;
    this._arena.frameIdx[i] = layerIdx;
    this._arena.dirtyFrameIdx = true;
    this.setFrame(frame);
    return this;
  }

  /**
   * スプライトシート内の特定フレームインデックスを設定します。
   */
  public setFrame(frame: string | number): this {
    const frames = this._asset?.frames || this._asset?.textureAsset?.frames;
    if (!frames || frames.length === 0) return this;
    const fIdx = typeof frame === 'number' ? frame : 0;
    if (fIdx >= 0 && fIdx < frames.length) {
      this._currentFrame = fIdx;
      const fData = frames[fIdx];
      const i = this.idx;
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
   * スプライトの乗算カラー（Tint）を設定します。
   * 0xRRGGBB 形式を自動的にリトルエンディアン RGBA Uint32 にパックします。
   */
  public setTint(tintHex: number): this {
    let packed = tintHex;
    // 0xRRGGBB (24bit) の場合、アルファ0xFFを付加してリトルエンディアン 0xAABBGGRR にパック
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
   * ポインター対話を有効化します。
   */
  public setInteractive(hitWidth?: number, hitHeight?: number): this {
    const i = this.idx;
    this._arena.interactive[i] = 1;
    if (hitWidth !== undefined) {
      this._arena.hitWidth[i] = hitWidth;
    } else {
      this._arena.hitWidth[i] = this._asset ? (this._asset.width ?? 0) : 0;
    }

    if (hitHeight !== undefined) {
      this._arena.hitHeight[i] = hitHeight;
    } else {
      this._arena.hitHeight[i] = this._asset ? (this._asset.height ?? 0) : 0;
    }
    return this;
  }

  /**
   * アリーナからこのスプライトのIDを解放（削除）します。
   */
  public destroy(): void {
    this._arena.free(this.id);
  }
}
