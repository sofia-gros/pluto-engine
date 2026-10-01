import type { InstanceBufferArena } from '../arena/InstanceBufferArena';
import type { Plugin } from '../scene/Plugin';
import type { Scene } from '../scene/Scene';
import { type EmitterConfig, ParticleEmitter } from './ParticleEmitter';

export type { EmitterConfig };

/** 使い回し用の乱数範囲バッファ。emitParticle の引数変換に使います。 */
const SCRATCH = new Float32Array(2);

export class ParticleManager implements Plugin {
  private arena!: InstanceBufferArena;
  private maxParticles: number;

  // SoA for physics
  private velX: Float32Array;
  private velY: Float32Array;
  private life: Float32Array;
  private lifeMax: Float32Array;

  // Emitters
  private activeIds: Int32Array;
  private activeCount = 0;

  /**
   * 生成済みエミッターの SoA。
   *
   * 「1 回だけ burst する」旧モデルではなく、毎フレーム `emitRate` 個を
   * 出し続ける持続型エミッターと、Phaser 互換の explode に対応します。
   */
  private readonly _emitterActive: Uint8Array;
  private readonly _emitterX: Float32Array;
  private readonly _emitterY: Float32Array;
  private readonly _emitterRate: Float32Array;
  private readonly _emitterAccum: Float32Array;
  private readonly _emitterSpeed: Float32Array;
  private readonly _emitterLife: Float32Array;
  private readonly _emitterAngleMin: Float32Array;
  private readonly _emitterAngleMax: Float32Array;
  private readonly _emitterTint: Uint32Array;
  private _emitterCount = 0;
  private _emitterCapacity: number;

  /** 生成済み ParticleEmitter のキャッシュ。ID -> ParticleEmitter。 */
  private readonly _emitterHandles = new Map<number, ParticleEmitter>();

  constructor(maxParticles = 100000, maxEmitters = 4096) {
    this.maxParticles = maxParticles;
    this._emitterCapacity = maxEmitters;
    this.velX = new Float32Array(maxParticles);
    this.velY = new Float32Array(maxParticles);
    this.life = new Float32Array(maxParticles);
    this.lifeMax = new Float32Array(maxParticles);
    this.activeIds = new Int32Array(maxParticles).fill(-1);

    this._emitterActive = new Uint8Array(maxEmitters);
    this._emitterX = new Float32Array(maxEmitters);
    this._emitterY = new Float32Array(maxEmitters);
    this._emitterRate = new Float32Array(maxEmitters);
    this._emitterAccum = new Float32Array(maxEmitters);
    this._emitterSpeed = new Float32Array(maxEmitters);
    this._emitterLife = new Float32Array(maxEmitters);
    this._emitterAngleMin = new Float32Array(maxEmitters);
    this._emitterAngleMax = new Float32Array(maxEmitters);
    this._emitterTint = new Uint32Array(maxEmitters);
  }

  public init(scene: Scene): void {
    this.arena = scene.arena;
  }

  /**
   * 1 回だけ burst するパーティクルを生成します (旧 API、后方互換)。
   *
   * 持続して出したい場合は {@link ParticleManager.create} と
   * `ParticleEmitter.start()` を使ってください。
   *
   * @returns 生成できた粒子数
   */
  public createEmitter(config: EmitterConfig): number {
    return this.emitBurst(config);
  }

  /**
   * burst を 1 回実行します。
   * @returns 生成できた粒子数
   */
  public emitBurst(config: EmitterConfig): number {
    const { x, y, count, speed, life, angleMin = 0, angleMax = Math.PI * 2 } = config;
    let made = 0;
    for (let i = 0; i < count; i++) {
      if (!this._emitOne(x, y, speed, life, angleMin, angleMax, 0xffffffff)) break;
      made++;
    }
    return made;
  }

  /**
   * 持続型エミッターを生成します (Phaser 互換の `this.add.particles`)。
   *
   * @returns ParticleEmitter ハンドル。上限に達した場合は null
   */
  public create(config: {
    x?: number;
    y?: number;
    /** 1 秒あたりの生成個数。0 なら手動の emitParticle のみ */
    frequency?: number;
    speed?: number;
    lifespan?: number;
    angle?: { min: number; max: number };
    tint?: number;
  }): ParticleEmitter | null {
    if (this._emitterCount >= this._emitterCapacity) {
      console.warn('ParticleManager: エミッター数が上限に達しました。');
      return null;
    }
    const id = this._emitterCount++;
    this._emitterActive[id] = 0;
    this._emitterX[id] = config.x ?? 0;
    this._emitterY[id] = config.y ?? 0;
    this._emitterRate[id] = config.frequency ?? 0;
    this._emitterAccum[id] = 0;
    this._emitterSpeed[id] = config.speed ?? 100;
    this._emitterLife[id] = config.lifespan ?? 1000;
    this._emitterAngleMin[id] = config.angle?.min ?? 0;
    this._emitterAngleMax[id] = config.angle?.max ?? Math.PI * 2;
    this._emitterTint[id] = config.tint ?? 0xffffffff;

    let handle = this._emitterHandles.get(id);
    if (handle === undefined) {
      handle = new ParticleEmitter(id, this);
      this._emitterHandles.set(id, handle);
    }
    return handle;
  }

  // ============================================================
  // Flyweight (ParticleEmitter) 向けの公開アクセサ
  // ============================================================

  /** エミッターが登録済みか */
  public isEmitterAlive(id: number): boolean {
    return id >= 0 && id < this._emitterCount;
  }

  /** エミッターの X 座標 */
  public getEmitterX(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterX[id] : 0;
  }

  /** エミッターの Y 座標 */
  public getEmitterY(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterY[id] : 0;
  }

  /** 1 秒あたりの生成個数 */
  public getEmitterFrequency(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterRate[id] : 0;
  }

  /** 現在の生存粒子数 */
  public get particleCount(): number {
    return this.activeCount;
  }

  /** 登録済みエミッター数 */
  public get emitterCount(): number {
    return this._emitterCount;
  }

  /** エミッターが毎フレーム生成を続けているか */
  public isEmitterEmitting(id: number): boolean {
    return this.isEmitterAlive(id) && this._emitterActive[id] === 1;
  }

  /** エミッターの生成開始・停止を切り替えます */
  public setEmitterEmitting(id: number, emitting: boolean): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterActive[id] = emitting ? 1 : 0;
    // 再開時に端数が残らないように accum を初期化します
    if (emitting) this._emitterAccum[id] = 0;
  }

  /** 射出角の範囲を設定します (Phaser 互換の `setAngle`) */
  public setEmitterAngle(id: number, min: number, max: number): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterAngleMin[id] = min;
    this._emitterAngleMax[id] = max;
  }

  /** 射出角の下限 */
  public getEmitterAngleMin(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterAngleMin[id] : 0;
  }

  /** 射出角の上限 */
  public getEmitterAngleMax(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterAngleMax[id] : 0;
  }

  /** 生成速度 */
  public getEmitterSpeed(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterSpeed[id] : 0;
  }

  /** 生存時間 (ミリ秒) */
  public getEmitterLifespan(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterLife[id] : 0;
  }

  /** ティント色 */
  public getEmitterTint(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterTint[id] : 0;
  }

  /** 粒子を 1 個生成します (Phaser 互換の `emitParticle`) */
  public emitOne(id: number): boolean {
    if (!this.isEmitterAlive(id)) return false;
    return this._emitOne(
      this._emitterX[id],
      this._emitterY[id],
      this._emitterSpeed[id],
      this._emitterLife[id],
      this._emitterAngleMin[id],
      this._emitterAngleMax[id],
      this._emitterTint[id],
    );
  }

  /** 粒子をまとめて生成します (Phaser 互換の `emitParticleAt`) */
  public emitMany(id: number, count: number): number {
    let made = 0;
    for (let i = 0; i < count; i++) {
      if (!this.emitOne(id)) break;
      made++;
    }
    return made;
  }

  /** エミッターの X 座標を設定します (Phaser 互換の `setPosition`) */
  public setEmitterPosition(id: number, x: number, y: number): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterX[id] = x;
    this._emitterY[id] = y;
  }

  /** 1 秒あたりの生成個数を設定します (Phaser 互換の `setFrequency`) */
  public setEmitterFrequency(id: number, freq: number): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterRate[id] = freq;
  }

  /** 生成速度を設定します (Phaser 互換の `setSpeed`) */
  public setEmitterSpeed(id: number, speed: number): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterSpeed[id] = speed;
  }

  /** 生存時間を設定します (Phaser 互換の `setLifespan`) */
  public setEmitterLifespan(id: number, ms: number): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterLife[id] = ms;
  }

  /** ティント色を設定します (Phaser 互換の `setParticleTint`) */
  public setEmitterTint(id: number, tint: number): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterTint[id] = tint >>> 0;
  }

  /** 生存中の粒子をすべて破棄します (Phaser 互換の `stop`) */
  public stopEmitter(id: number): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterActive[id] = 0;
  }

  /** 一度だけまとめて生成します (Phaser 互換の `explode`) */
  public explodeEmitter(id: number, count: number): number {
    if (!this.isEmitterAlive(id)) return 0;
    return this.emitMany(id, count);
  }

  /**
   * 粒子を 1 個生成する中核処理。
   * @returns 生成できたか
   */
  private _emitOne(
    x: number,
    y: number,
    speed: number,
    lifeMs: number,
    angleMin: number,
    angleMax: number,
    tint: number,
  ): boolean {
    if (this.activeCount >= this.maxParticles) return false;
    const id = this.arena.allocate();
    if (id === -1) return false;

    const angle = angleMin + Math.random() * (angleMax - angleMin);
    const v = speed * (0.5 + Math.random() * 0.5);

    // allocate() が返した id はそのまま密添字でも使えますが、
    // swap-remove の後では乖離しうるため idToIndex 経由で解決します。
    const idx = this.arena.idToIndex[id];
    this.arena.setPosX(idx, x);
    this.arena.setPosY(idx, y);
    // パーティクルは 1 ピクセル点として描画したいため、
    // フレーム寸法を 1 に落として scale = 1（倍率）で 1px 相当にします。
    // scale は倍率である点に注意してください。
    this.arena.setFrameSize(idx, 1, 1, false);
    // テクスチャ未設定のスプライトは既定で透明なので、
    // 描画されるよう不透明へ戻します。
    this.arena.setTint(idx, tint);

    this.velX[id] = Math.cos(angle) * v;
    this.velY[id] = Math.sin(angle) * v;
    this.life[id] = lifeMs;
    this.lifeMax[id] = lifeMs;

    this.activeIds[this.activeCount++] = id;
    return true;
  }

  public update(dt: number): void {
    // 持続型エミッターの生成
    for (let e = 0; e < this._emitterCount; e++) {
      if (this._emitterActive[e] === 0) continue;
      const rate = this._emitterRate[e];
      if (rate <= 0) continue;

      // 秒単位の生成個数 dt を掛けて積算し、端数を持ち越します
      this._emitterAccum[e] += rate * dt;
      const n = Math.floor(this._emitterAccum[e]);
      if (n <= 0) continue;
      this._emitterAccum[e] -= n;

      for (let i = 0; i < n; i++) {
        if (
          !this._emitOne(
            this._emitterX[e],
            this._emitterY[e],
            this._emitterSpeed[e],
            this._emitterLife[e],
            this._emitterAngleMin[e],
            this._emitterAngleMax[e],
            this._emitterTint[e],
          )
        ) {
          break;
        }
      }
    }

    for (let i = 0; i < this.activeCount; i++) {
      const id = this.activeIds[i];
      if (id === -1) continue;
      const idx = this.arena.idToIndex[id];
      if (idx < 0) {
        // 外部で解放されていた場合は詰め替えの対象から外します
        this.activeIds[i] = this.activeIds[this.activeCount - 1];
        this.activeIds[this.activeCount - 1] = -1;
        this.activeCount--;
        i--;
        continue;
      }

      this.life[id] -= dt * 1000;
      if (this.life[id] <= 0) {
        this.arena.free(id);

        // Swap and pop
        this.activeIds[i] = this.activeIds[this.activeCount - 1];
        this.activeIds[this.activeCount - 1] = -1;
        this.activeCount--;
        i--; // Re-check the swapped element
        continue;
      }

      this.arena.setPosX(idx, this.arena.posX[idx] + this.velX[id] * dt);
      this.arena.setPosY(idx, this.arena.posY[idx] + this.velY[id] * dt);

      // Alpha / Scale decay
      const ratio = this.life[id] / this.lifeMax[id];
      this.arena.setScale(idx, ratio);
    }
  }

  public destroy(): void {
    for (let i = 0; i < this.activeCount; i++) {
      if (this.activeIds[i] !== -1) {
        this.arena.free(this.activeIds[i]);
      }
    }
    this.activeCount = 0;
    this._emitterCount = 0;
    this._emitterActive.fill(0);
    this._emitterHandles.clear();
  }
}

/** SCRATCH は将来の拡張用に確保しています。 */
void SCRATCH;
