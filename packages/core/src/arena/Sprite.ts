/**
 * @file Sprite.ts
 * @description
 * InstanceBufferArena の単一インスタンスを指し示す軽量なハンドル（Flyweight）。
 * プロパティへのアクセスはすべて Arena の Float32Array への直接読み書きに変換されます。
 */

import type { InstanceBufferArena } from './InstanceBufferArena';

export class Sprite {
  /**
   * アリーナ内のデータスロットを指すインデックス
   */
  public readonly id: number;

  /**
   * 参照するメモリアリーナ
   */
  private readonly _arena: InstanceBufferArena;

  /**
   * @param id アリーナで割り当てられたID
   * @param arena 所属するメモリアリーナ
   */
  constructor(id: number, arena: InstanceBufferArena) {
    this.id = id;
    this._arena = arena;
  }

  public get x(): number {
    return this._arena.posX[this.id];
  }
  public set x(val: number) {
    this._arena.posX[this.id] = val;
  }

  public get y(): number {
    return this._arena.posY[this.id];
  }
  public set y(val: number) {
    this._arena.posY[this.id] = val;
  }

  public get scale(): number {
    return this._arena.scale[this.id];
  }
  public set scale(val: number) {
    this._arena.scale[this.id] = val;
  }

  public get frameIdx(): number {
    return this._arena.frameIdx[this.id];
  }
  public set frameIdx(val: number) {
    this._arena.frameIdx[this.id] = val;
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

  public setTexture(asset: any, frame: string | number = 0): this {
    this._asset = asset;
    // Layer index in texture array - currently mock logic, assuming 0
    this._arena.frameIdx[this.id] = 0;
    this.setFrame(frame);
    return this;
  }

  public setFrame(frame: string | number): this {
    if (!this._asset || !this._asset.frames) return this;
    const fIdx = typeof frame === 'number' ? frame : 0; // In future, support string names
    if (fIdx >= 0 && fIdx < this._asset.frames.length) {
      this._currentFrame = fIdx;
      const fData = this._asset.frames[fIdx];
      this._arena.uvX[this.id] = fData.uvX;
      this._arena.uvY[this.id] = fData.uvY;
      this._arena.uvW[this.id] = fData.uvW;
      this._arena.uvH[this.id] = fData.uvH;
    }
    return this;
  }

  /**
   * 向きを設定します。true の場合は左向き (-1.0)、false の場合は右向き (1.0)。
   */
  public setFlipX(flip: boolean): this {
    this._arena.facing[this.id] = flip ? -1.0 : 1.0;
    return this;
  }

  /**
   * 描画色（Tint）を設定します。
   * @param tintHex 0xAABBGGRR 形式の色データ
   */
  public setTint(tintHex: number): this {
    this._arena.tint[this.id] = tintHex;
    return this;
  }

  /**
   * このスプライトをアリーナから解放（破壊）します。
   * 以降このハンドルへのアクセスは未定義の動作を引き起こす可能性があります。
   */
  public destroy(): void {
    this._arena.free(this.id);
  }
}
