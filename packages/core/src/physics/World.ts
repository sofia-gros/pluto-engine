/**
 * @file World.ts
 * @description
 * Phaser 4 互換の物理ワールドハンドル。
 *
 * 設計上の掟 (R-03): own property は `_physics` の 1 個だけ。
 * シーン全体で 1 つだけ生成し、境界矩形と重力は
 * ArcadePhysics のスカラーが正本です。
 */

import type { ArcadePhysics } from './ArcadePhysics';

/** 境界情報を取り出すための使い回しバッファ */
const BOUNDS_OUT = new Float32Array(4);

export class World {
  private readonly _physics: ArcadePhysics;

  constructor(physics: ArcadePhysics) {
    this._physics = physics;
  }

  /**
   * ワールド境界を設定します (Phaser 互換の `setBoundsRectangle`)。
   * @param width / height が 0 以下の場合は境界なしとして扱います
   */
  setBoundsRectangle(x: number, y: number, width: number, height: number): this {
    this._physics.setBounds(x, y, width, height);
    return this;
  }

  /**
   * ワールド境界を無効にします (Phaser 互換の `setBounds` に 0 を渡す相当)。
   */
  setBounds(width: number, height: number, x = 0, y = 0): this {
    this._physics.setBounds(x, y, width, height);
    return this;
  }

  /** ワールド境界を無効にします。 */
  clearBounds(): this {
    this._physics.clearBounds();
    return this;
  }

  /**
   * 境界矩形の x, y, width, height を out バッファに書き出します
   * (Phaser 互換の `getBounds`)。
   *
   * @param out 4 要素以上のバッファ
   */
  getBounds(out: Float32Array = BOUNDS_OUT): Float32Array {
    out[0] = this._physics.boundsX;
    out[1] = this._physics.boundsY;
    out[2] = this._physics.boundsWidth;
    out[3] = this._physics.boundsHeight;
    return out;
  }

  /** ワールド境界を持っているか */
  get hasBounds(): boolean {
    return this._physics.hasBounds;
  }

  /** 水平方向の重力加速度 */
  get gravityX(): number {
    return this._physics.gravityX;
  }

  set gravityX(v: number) {
    this._physics.gravityX = v;
  }

  /** 垂直方向の重力加速度 */
  get gravityY(): number {
    return this._physics.gravityY;
  }

  set gravityY(v: number) {
    this._physics.gravityY = v;
  }

  /**
   * 指定エンティティのワールド境界衝突を有効にします
   * (Phaser 互換の `collideWorldBounds`)。
   */
  collideWorldBounds(entityId: number, value = true): this {
    this._physics.setCollideWorldBounds(entityId, value);
    return this;
  }

  /**
   * 指定エンティティがワールド境界の内側か外側かを返します。
   *
   * 当たり判定矩形の**四隅**で判定するため、当たり判定設定によって
   * よって外側判定が変わります。
   *
   * @param out 1 要素のバッファ。0 = 内側、1 = 外側
   */
  isOutsideWorld(entityId: number, out: Float32Array = BOUNDS_OUT): boolean {
    const p = this._physics;
    if (!p.hasBounds) return false;
    const cx = p.getBodyX(entityId);
    const cy = p.getBodyY(entityId);
    const hw = p.getHalfWidth(entityId);
    const hh = p.getHalfHeight(entityId);
    const left = p.boundsX;
    const top = p.boundsY;
    const right = p.boundsX + p.boundsWidth;
    const bottom = p.boundsY + p.boundsHeight;
    const outside = cx - hw < left || cy - hh < top || cx + hw > right || cy + hh > bottom;
    out[0] = outside ? 1 : 0;
    return outside;
  }
}
