/**
 * @file ParticleEmitter.ts
 * @description
 * Phaser 4 互換のパーティクルエミッターハンドル。
 *
 * 設計上の掟 (R-03): own property は `id` と `_manager` の 2 個だけ。
 * エミッターの設定は ParticleManager の SoA 配列が正本であり、
 * 本クラスは値を一切持ちません。
 */

import type { ParticleManager } from './ParticleManager';

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
  setConfig(config: {
    x?: number;
    y?: number;
    frequency?: number;
    speed?: number;
    lifespan?: number;
    angle?: { min: number; max: number };
    tint?: number;
  }): this {
    if (config.x !== undefined || config.y !== undefined) {
      this.setPosition(config.x ?? this.x, config.y ?? this.y);
    }
    if (config.frequency !== undefined) this.frequency = config.frequency;
    if (config.speed !== undefined) this.setSpeed(config.speed);
    if (config.lifespan !== undefined) this.setLifespan(config.lifespan);
    if (config.angle !== undefined) this.setAngle(config.angle.min, config.angle.max);
    if (config.tint !== undefined) this.setParticleTint(config.tint);
    return this;
  }
}
