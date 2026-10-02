/**
 * @file ParticleEmitter.ts
 * @description
 * Phaser 4 互換のパーティクルエミッターハンドル。
 *
 * 設計上の掟 (R-03): own property は `id` と `_manager` の 2 個だけ。
 * エミッターの設定は ParticleManager の SoA 配列が正本であり、
 * 本クラスは値を一切持ちません。
 */

import type { EmitterCreateConfig, ParticleManager } from './ParticleManager';

/** 使い回し用の 2 要素バッファ。範囲指定の一時領域に使います。 */
const RANGE = new Float32Array(2);

export interface EmitterConfig {
  x: number;
  y: number;
  count: number;
  speed: number;
  /** 生存時間 (ミリ秒) */
  life: number;
  /** 射出角の下限 (ラジアン) */
  angleMin?: number;
  /** 射出角の上限 (ラジアン) */
  angleMax?: number;
}

export class ParticleEmitter {
  /** ParticleManager 内のエミッター ID */
  public readonly id: number;

  private readonly _manager: ParticleManager;

  constructor(id: number, manager: ParticleManager) {
    this.id = id;
    this._manager = manager;
  }

  /** ハンドルとして有効か */
  get isValid(): boolean {
    return this._manager.isEmitterAlive(this.id);
  }

  /** 毎フレーム生成を続けているか */
  get isEmitting(): boolean {
    return this.isValid && this._manager.isEmitterEmitting(this.id);
  }

  /** X 座標 */
  get x(): number {
    return this._manager.getEmitterX(this.id);
  }

  set x(v: number) {
    this._manager.setEmitterPosition(this.id, v, this.y);
  }

  /** Y 座標 */
  get y(): number {
    return this._manager.getEmitterY(this.id);
  }

  set y(v: number) {
    this._manager.setEmitterPosition(this.id, this.x, v);
  }

  /** 1 秒あたりの生成個数 */
  get frequency(): number {
    return this._manager.getEmitterFrequency(this.id);
  }

  set frequency(v: number) {
    this._manager.setEmitterFrequency(this.id, v);
  }

  /** 現在の生存粒子数 */
  get particleCount(): number {
    return this._manager.particleCount;
  }

  /**
   * 毎フレーム生成を始めます (Phaser 互換の `start`)。
   * frequency が 0 の場合は何も生成されません。
   */
  start(): this {
    this._manager.setEmitterEmitting(this.id, true);
    return this;
  }

  /**
   * 生成を止めます (Phaser 互換の `stop`)。
   * 既に生成済みの粒子はそのまま残ります。
   */
  stop(): this {
    this._manager.stopEmitter(this.id);
    return this;
  }

  /** 粒子を 1 個だけ生成します (Phaser 互換の `emitParticle`) */
  emitParticle(): this {
    this._manager.emitOne(this.id);
    return this;
  }

  /**
   * 粒子を `count` 個まとめて生成します (Phaser 互換の `emitParticleAt`)。
   * @returns 生成できた数
   */
  emitParticleAt(count: number): number {
    return this._manager.emitMany(this.id, count);
  }

  /**
   * 一度だけまとめて生成します (Phaser 互換の `explode`)。
   * @returns 生成できた数
   */
  explode(count: number): number {
    return this._manager.explodeEmitter(this.id, count);
  }

  /** 位置を設定します (Phaser 互換の `setPosition`) */
  setPosition(x: number, y: number): this {
    this._manager.setEmitterPosition(this.id, x, y);
    return this;
  }

  /** 生成速度を設定します (Phaser 互換の `setSpeed`) */
  setSpeed(speed: number): this {
    this._manager.setEmitterSpeed(this.id, speed);
    return this;
  }

  /** 生存時間を設定します (Phaser 互換の `setLifespan`) */
  setLifespan(ms: number): this {
    this._manager.setEmitterLifespan(this.id, ms);
    return this;
  }

  /** 射出角の範囲を設定します (Phaser 互換の `setAngle`) */
  setAngle(min: number, max: number): this {
    RANGE[0] = min;
    RANGE[1] = max;
    this._manager.setEmitterAngle(this.id, RANGE[0], RANGE[1]);
    return this;
  }

  /** ティント色を設定します (Phaser 互換の `setParticleTint`) */
  setParticleTint(tint: number): this {
    this._manager.setEmitterTint(this.id, tint);
    return this;
  }

  /**
   * 設定を書き換えます (Phaser 互換の `setConfig`)。
   * 指定しなかった項目は現在の値を維持します。
   */
  setConfig(config: EmitterCreateConfig): this {
    if (config.x !== undefined || config.y !== undefined) {
      this.setPosition(config.x ?? this.x, config.y ?? this.y);
    }
    if (config.frequency !== undefined) this.frequency = config.frequency;
    if (config.speed !== undefined) this.setSpeed(config.speed);
    if (config.lifespan !== undefined) this.setLifespan(config.lifespan);
    if (config.angle !== undefined) this.setAngle(config.angle.min, config.angle.max);
    if (config.tint !== undefined) this.setParticleTint(config.tint);
    if (config.zone !== undefined) {
      const z = config.zone.params;
      this.setZone(config.zone.shape, z?.[0] ?? 0, z?.[1] ?? 0, z?.[2] ?? 0, z?.[3] ?? 0);
    }
    if (config.quantity !== undefined) this.setQuantity(config.quantity);
    if (config.maxAliveParticles !== undefined) this.setMaxAliveParticles(config.maxAliveParticles);
    if (config.duration !== undefined) this.setDuration(config.duration);
    if (config.gravityX !== undefined || config.gravityY !== undefined) {
      this.setParticleGravity(config.gravityX ?? this.gravityX, config.gravityY ?? this.gravityY);
    }
    if (config.timeScale !== undefined) this.setTimeScale(config.timeScale);
    return this;
  }

  // --- zone (Phaser 互換の ParticleEmitterZone) ---

  /** zone の形状 ID (`ParticleEmitterZoneShape` の値) */
  get zoneShape(): number {
    return this._manager.getEmitterZoneShape(this.id);
  }

  /**
   * zone のパラメータ 4 個を `out` へ書き出します。
   *
   * @param out 4 要素以上のバッファ
   * @returns 常に 4
   */
  getZoneParams(out: Float32Array): number {
    return this._manager.getEmitterZoneParams(this.id, out);
  }

  /** zone を設定します (Phaser 互換の `setZone`) */
  setZone(shape: number, p0: number, p1: number, p2: number, p3: number): this {
    this._manager.setEmitterZone(this.id, shape, p0, p1, p2, p3);
    return this;
  }

  // --- ops (Phaser 互換の EmitterOps) ---

  /** ops の個数 */
  get opCount(): number {
    return this._manager.getEmitterOpCount(this.id);
  }

  /**
   * ops を `out` へ書き出します。
   *
   * @param out 2 要素以上のバッファ。[k*2] = isEnabled, [k*2+1] = value
   * @returns 書き出した op の個数
   */
  getOps(out: Float32Array): number {
    return this._manager.getEmitterOps(this.id, out);
  }

  /** k 番目の op の対象パラメータ (`EmitterOpKind` の数値 ID、範囲外は -1) */
  getOpKind(k: number): number {
    return this._manager.getEmitterOpKind(this.id, k);
  }

  // --- quantity / maxAliveParticles / duration ---

  /** 1 回の生成個数 */
  get quantity(): number {
    return this._manager.getEmitterQuantity(this.id);
  }

  set quantity(v: number) {
    this.setQuantity(v);
  }

  /** 1 回の生成個数を設定します (Phaser 互換の `setQuantity`) */
  setQuantity(n: number): this {
    this._manager.setEmitterQuantity(this.id, n);
    return this;
  }

  /** 生存粒子上限。0 は無制限 */
  get maxAliveParticles(): number {
    return this._manager.getEmitterMaxAlive(this.id);
  }

  set maxAliveParticles(v: number) {
    this.setMaxAliveParticles(v);
  }

  /** 生存粒子上限を設定します (Phaser 互換の `setMaxAliveParticles`) */
  setMaxAliveParticles(n: number): this {
    this._manager.setEmitterMaxAlive(this.id, n);
    return this;
  }

  /** このエミッターが生成した生存粒子数 */
  get aliveParticleCount(): number {
    return this._manager.getEmitterAliveCount(this.id);
  }

  /** 自動停止までの時間 (ms)。0 は無制限 */
  get duration(): number {
    return this._manager.getEmitterDuration(this.id);
  }

  set duration(v: number) {
    this.setDuration(v);
  }

  /** 自動停止までの時間を設定します (Phaser 互換の `setDuration`) */
  setDuration(ms: number): this {
    this._manager.setEmitterDuration(this.id, ms);
    return this;
  }

  /** 経過時間 (ms) */
  get elapsed(): number {
    return this._manager.getEmitterElapsed(this.id);
  }

  // --- 重力 ---

  /** 粒子ごとの重力 X (px/s^2) */
  get gravityX(): number {
    return this._manager.getEmitterGravityX(this.id);
  }

  set gravityX(v: number) {
    this.setParticleGravityX(v);
  }

  /** 粒子ごとの重力 Y (px/s^2) */
  get gravityY(): number {
    return this._manager.getEmitterGravityY(this.id);
  }

  set gravityY(v: number) {
    this.setParticleGravityY(v);
  }

  /** 粒子ごとの重力を設定します (Phaser 互換の `setParticleGravity`) */
  setParticleGravity(gx: number, gy: number): this {
    this._manager.setEmitterGravity(this.id, gx, gy);
    return this;
  }

  /** 水平方向の重力だけを設定します (Phaser 互換の `setParticleGravityX`) */
  setParticleGravityX(gx: number): this {
    this._manager.setEmitterGravityX(this.id, gx);
    return this;
  }

  /** 垂直方向の重力だけを設定します (Phaser 互換の `setParticleGravityY`) */
  setParticleGravityY(gy: number): this {
    this._manager.setEmitterGravityY(this.id, gy);
    return this;
  }

  /** 時間倍率。1.0 が等速 (Phaser 互換の `setTimeScale`) */
  get timeScale(): number {
    return this._manager.getEmitterTimeScale(this.id);
  }

  set timeScale(v: number) {
    this.setTimeScale(v);
  }

  /** 時間倍率を設定します (Phaser 互換の `setTimeScale`) */
  setTimeScale(scale: number): this {
    this._manager.setEmitterTimeScale(this.id, scale);
    return this;
  }

  /**
   * 生成する粒子のテクスチャを設定します (Phaser 互換の `setParticleTexture`)。
   *
   * 粒子はフレーム寸法を 1x1 に落とすため、描画は常に 1 ピクセル点です。
   * テクスチャはサンプル元としてだけ意味を持ちます。
   */
  setTexture(asset: unknown | null): this {
    this._manager.setEmitterTexture(this.id, asset);
    return this;
  }

  /** このエミッターが生成した生存粒子をすべて破棄します (Phaser 互換の `killAll`) */
  killAll(): number {
    return this._manager.killAll(this.id);
  }
}
