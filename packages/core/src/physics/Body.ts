/**
 * @file Body.ts
 * @description
 * Phaser 4 互換の物理ボディハンドル。
 *
 * 設計上の掟 (R-03): own property は `entityId` と `_physics` の 2 個だけ。
 *
 * **entityId はアリーナの疎添字 ID** で、これは単調増加するため
 * 途中で他のエンティティが解放されても値は変わりません。
 * SoA 自体は密添字で保持されるため、書き込みのたびに
 * `_physics` 側で `arena.idToIndex` を通します (O(1) の配列参照 1 回)。
 */

import type { ArcadePhysics } from './ArcadePhysics';

export class Body {
  /** アリーナの疎添字 ID */
  public readonly entityId: number;

  private readonly _physics: ArcadePhysics;

  constructor(entityId: number, physics: ArcadePhysics) {
    this.entityId = entityId;
    this._physics = physics;
  }

  // --- 位置 (SoA ではなくアリーナ側が正本) ---

  /** X 座標 */
  get x(): number {
    return this._physics.getBodyX(this.entityId);
  }

  set x(v: number) {
    this._physics.setBodyX(this.entityId, v);
  }

  /** Y 座標 */
  get y(): number {
    return this._physics.getBodyY(this.entityId);
  }

  set y(v: number) {
    this._physics.setBodyY(this.entityId, v);
  }

  // --- 速度 ---

  /** 水平方向の速度 */
  get velocityX(): number {
    return this._physics.getVelocityX(this.entityId);
  }

  set velocityX(v: number) {
    this._physics.setVelocity(this.entityId, v, this.velocityY);
  }

  /** 垂直方向の速度 */
  get velocityY(): number {
    return this._physics.getVelocityY(this.entityId);
  }

  set velocityY(v: number) {
    this._physics.setVelocity(this.entityId, this.velocityX, v);
  }

  // --- 加速度 ---

  /** 水平方向の加速度 */
  get accelerationX(): number {
    return this._physics.getAccelerationX(this.entityId);
  }

  set accelerationX(v: number) {
    this._physics.setAcceleration(this.entityId, v, this.accelerationY);
  }

  /** 垂直方向の加速度 */
  get accelerationY(): number {
    return this._physics.getAccelerationY(this.entityId);
  }

  set accelerationY(v: number) {
    this._physics.setAcceleration(this.entityId, this.accelerationX, v);
  }

  // --- その他の SoA 値 ---

  /** 空気抵抗 (0〜1) */
  get drag(): number {
    return this._physics.getDrag(this.entityId);
  }

  set drag(v: number) {
    this._physics.setDrag(this.entityId, v);
  }

  /** 反発係数 (0〜1) */
  get bounce(): number {
    return this._physics.getBounce(this.entityId);
  }

  set bounce(v: number) {
    this._physics.setBounce(this.entityId, v);
  }

  /** 質量 */
  get mass(): number {
    return this._physics.getMass(this.entityId);
  }

  set mass(v: number) {
    this._physics.setMass(this.entityId, v);
  }

  /** 水平方向の速度上限。0 以下は無制限 */
  get maxVelocityX(): number {
    return this._physics.getMaxVelocityX(this.entityId);
  }

  /** 垂直方向の速度上限。0 以下は無制限 */
  get maxVelocityY(): number {
    return this._physics.getMaxVelocityY(this.entityId);
  }

  /** 当たり判定の半径。0 のときは矩形判定 */
  get radius(): number {
    return this._physics.getRadius(this.entityId);
  }

  /** 押し出されないか */
  get immovable(): boolean {
    return this._physics.getImmovable(this.entityId);
  }

  set immovable(v: boolean) {
    this._physics.setImmovable(this.entityId, v);
  }

  /** ワールド境界で反弹するか */
  get checkCollision(): boolean {
    return this._physics.getCollideWorldBounds(this.entityId);
  }

  set checkCollision(v: boolean) {
    this._physics.setCollideWorldBounds(this.entityId, v);
  }

  // --- メソッド (Phaser 互換) ---

  /** 速度を設定します。 */
  setVelocity(vx?: number, vy?: number): this {
    const cur = this._physics;
    const cx = vx === undefined ? this.velocityX : vx;
    const cy = vy === undefined ? this.velocityY : vy;
    cur.setVelocity(this.entityId, cx, cy);
    return this;
  }

  /** 水平方向の速度だけを設定します。 */
  setVelocityX(vx: number): this {
    this._physics.setVelocity(this.entityId, vx, this.velocityY);
    return this;
  }

  /** 垂直方向の速度だけを設定します。 */
  setVelocityY(vy: number): this {
    this._physics.setVelocity(this.entityId, this.velocityX, vy);
    return this;
  }

  /** 加速度を設定します。 */
  setAcceleration(ax?: number, ay?: number): this {
    const cx = ax === undefined ? this.accelerationX : ax;
    const cy = ay === undefined ? this.accelerationY : ay;
    this._physics.setAcceleration(this.entityId, cx, cy);
    return this;
  }

  /** 水平方向の加速度だけを設定します。 */
  setAccelerationX(ax: number): this {
    this._physics.setAcceleration(this.entityId, ax, this.accelerationY);
    return this;
  }

  /** 垂直方向の加速度だけを設定します。 */
  setAccelerationY(ay: number): this {
    this._physics.setAcceleration(this.entityId, this.accelerationX, ay);
    return this;
  }

  /** 空気抵抗を設定します。 */
  setDrag(drag: number): this {
    this._physics.setDrag(this.entityId, drag);
    return this;
  }

  /** 反発係数を設定します。 */
  setBounce(bounce: number): this {
    this._physics.setBounce(this.entityId, bounce);
    return this;
  }

  /** 速度の上限を設定します。0 以下は無制限。 */
  setMaxVelocity(maxVx?: number, maxVy?: number): this {
    const cx = maxVx === undefined ? this.maxVelocityX : maxVx;
    const cy = maxVy === undefined ? this.maxVelocityY : maxVy;
    this._physics.setMaxVelocity(this.entityId, cx, cy);
    return this;
  }

  /** 当たり判定を円にします。 */
  setCircle(radius: number): this {
    this._physics.setCircle(this.entityId, radius);
    return this;
  }

  /** 当たり判定を矩形にします。 */
  setSize(width: number, height: number): this {
    this._physics.setSize(this.entityId, width, height);
    return this;
  }

  /** 当たり判定中心のスプライト中心からのオフセットを設定します。 */
  setOffset(ox: number, oy: number): this {
    this._physics.setOffset(this.entityId, ox, oy);
    return this;
  }

  /** 押し出されないようにします。 */
  setImmovable(value = true): this {
    this._physics.setImmovable(this.entityId, value);
    return this;
  }

  /** ワールド境界で反弹するようにします。 */
  setCollideWorldBounds(value = true): this {
    this._physics.setCollideWorldBounds(this.entityId, value);
    return this;
  }

  /** 速度、加速度、抵抗をすべて 0 に戻します。 */
  reset(): this {
    this._physics.setVelocity(this.entityId, 0, 0);
    this._physics.setAcceleration(this.entityId, 0, 0);
    this._physics.setDrag(this.entityId, 0);
    return this;
  }
}
