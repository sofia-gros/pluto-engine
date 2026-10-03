import type { InstanceBufferArena } from '../arena/InstanceBufferArena';
import type { Plugin } from '../scene/Plugin';
import type { Scene } from '../scene/Scene';
import { type EmitterConfig, ParticleEmitter } from './ParticleEmitter';
import {
  ParticleEmitterZoneShape,
  type ParticleEmitterZoneShapeValue,
  ZONE_PARAMS,
} from './ParticleEmitterZone';

export type { EmitterConfig };
export { ParticleEmitterZoneShape, ZONE_PARAMS };
export type { ParticleEmitterZoneShapeValue };

/** 使い回し用の乱数範囲バッファ。emitParticle の引数変換に使います。 */
const SCRATCH = new Float32Array(2);

/** zone の形状とパラメータを SoA に渡すための設定。 */
export interface EmitterZoneConfig {
  /** `ParticleEmitterZoneShape` のいずれか */
  shape: ParticleEmitterZoneShapeValue;
  /** 形状ごとのパラメータ 4 個。意味は {@link ParticleEmitterZone} を参照 */
  params?: ArrayLike<number>;
}

/**
 * ops 1 件。生成する粒子のパラメータを一時的に上書きします。
 *
 * Phaser の `EmitterOps` は 1 エミッターに複数登録できますが、
 * SoA では `ops: Float32Array(n*2)` に (isEnabled, value) として平坦化します。
 * どのパラメータに対する op なのかは {@link EmitterOpKind} で指定します。
 */
export interface EmitterOpConfig {
  /** false のとき無効。Phaser の `ops.set(false)` 相当 */
  enabled?: boolean;
  /** 適用する値 */
  value: number;
  /** どのパラメータに対する op か。省略時は 'speed' */
  kind?: EmitterOpKind;
}

/** ops が対象とするパラメータ。SoA では enum として持ちます。 */
export type EmitterOpKind = 'speed' | 'lifespan' | 'frequency' | 'scale';

/** `EmitterOpKind` を `Uint8Array` に格納するための数値 ID。 */
const OP_KIND_IDS: Record<EmitterOpKind, number> = {
  speed: 0,
  lifespan: 1,
  frequency: 2,
  scale: 3,
};

/** `this.add.particles` / `ParticleManager.create` の設定。 */
export interface EmitterCreateConfig {
  x?: number;
  y?: number;
  /** 1 秒あたりの生成個数。0 なら手動の emitParticle のみ */
  frequency?: number;
  speed?: number;
  lifespan?: number;
  angle?: { min: number; max: number };
  tint?: number;
  /** 射出位置の zone */
  zone?: EmitterZoneConfig;
  /** 生成パラメータの上書き op */
  ops?: EmitterOpConfig[];
  /** 1 回の explode / start で生成する個数 */
  quantity?: number;
  /** 生存粒子上限。0 なら無制限 */
  maxAliveParticles?: number;
  /** 生成を自動停止するまでの時間 (ms)。0 なら無制限 */
  duration?: number;
  /** 粒子ごとの重力 (px/s^2) */
  gravityX?: number;
  gravityY?: number;
  /** 時間倍率。1.0 が等速 */
  timeScale?: number;
}

export class ParticleManager implements Plugin {
  private arena!: InstanceBufferArena;
  private maxParticles: number;

  // SoA for physics
  private velX: Float32Array;
  private velY: Float32Array;
  private life: Float32Array;
  private lifeMax: Float32Array;
  /**
   * 粒子ごとの重力加速度 (px/s^2)。
   * エミッター単位の `setParticleGravity` を粒子生成時に焼き付けた値です。
   * `update` で毎フレーム速度に加算します。
   */
  private readonly gravX: Float32Array;
  private readonly gravY: Float32Array;
  /** 粒子の生存時間倍率 (`emitter.timeScale`)。1.0 が等速。 */
  private readonly timeScale: Float32Array;
  /**
   * 粒子を生成したエミッターの ID。-1 は burst 由来（生成元なし）。
   * 粒子の消滅時に `maxAliveParticles` の生存数を減算するために使います。
   */
  private readonly ownerEmitter: Int32Array;

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
  /** 生成する粒子のテクスチャ。null は白 1 ピクセル相当。 */
  private readonly _emitterTexture: (unknown | null)[];

  /**
   * zone の形状 ID (`ParticleEmitterZoneShape`)。
   * Phaser の zone オブジェクトを SoA に平坦化しています。
   */
  private readonly _zoneShape: Uint8Array;
  /** zone のパラメータ。1 エミッターあたり `ZONE_PARAMS` 個の Float32。 */
  private readonly _zoneParams: Float32Array;

  /**
   * ops の値 (isEnabled, value) を `Float32Array(n*2)` に平坦化。
   * ops は EmitterOps 相当で、生成する粒子のパラメータを一時的に上書きします。
   */
  private readonly _ops: Float32Array;
  /** 各エミッターの ops 開始位置と個数。`opStart` は開始添字、`opLen` は個数。 */
  private readonly _opStart: Int32Array;
  private readonly _opLen: Int32Array;
  /** 各 op の対象パラメータ (`EmitterOpKind` の数値 ID)。 */
  private readonly _opKind: Uint8Array;

  /** 1 回の explode / start 時に生成する個数 (Phaser 互換の `quantity`)。 */
  private readonly _emitterQuantity: Float32Array;
  /** 生存粒子上限。超えた分は生成を止めます (Phaser 互換の `maxAliveParticles`)。 */
  private readonly _emitterMaxAlive: Float32Array;
  /** /ms ではなく「ms」。0 なら無制限。生成を自動で止める (Phaser 互換の `duration`)。 */
  private readonly _emitterDuration: Float32Array;
  /** 経過時間 (ms)。`duration` との比較に使います。 */
  private readonly _emitterElapsed: Float32Array;
  /** このエミッターが生成した生存粒子数。`maxAliveParticles` の判定に使います。 */
  private readonly _emitterAliveCount: Int32Array;
  /** 粒子ごとの重力加速度。生成時に粒子 SoA へ焼き付けます。 */
  private readonly _emitterGravX: Float32Array;
  private readonly _emitterGravY: Float32Array;
  /** 時間倍率 (`emitter.timeScale`)。1.0 が等速。 */
  private readonly _emitterTimeScale: Float32Array;

  private _emitterCount = 0;
  private _emitterCapacity: number;
  private _opsPerEmitter: number;
  private _opsCapacity: number;

  /** 生成済み ParticleEmitter のキャッシュ。ID -> ParticleEmitter。 */
  private readonly _emitterHandles = new Map<number, ParticleEmitter>();

  constructor(maxParticles = 100000, maxEmitters = 4096, opsPerEmitter = 8) {
    this.maxParticles = maxParticles;
    this._emitterCapacity = maxEmitters;
    this._opsPerEmitter = opsPerEmitter;
    this._opsCapacity = maxEmitters * opsPerEmitter;
    this.velX = new Float32Array(maxParticles);
    this.velY = new Float32Array(maxParticles);
    this.life = new Float32Array(maxParticles);
    this.lifeMax = new Float32Array(maxParticles);
    this.gravX = new Float32Array(maxParticles);
    this.gravY = new Float32Array(maxParticles);
    this.timeScale = new Float32Array(maxParticles).fill(1);
    this.ownerEmitter = new Int32Array(maxParticles).fill(-1);
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
    this._emitterTexture = new Array<unknown | null>(maxEmitters).fill(null);

    this._zoneShape = new Uint8Array(maxEmitters);
    this._zoneParams = new Float32Array(maxEmitters * ZONE_PARAMS);

    this._ops = new Float32Array(this._opsCapacity * 2);
    this._opStart = new Int32Array(maxEmitters);
    this._opLen = new Int32Array(maxEmitters);
    this._opKind = new Uint8Array(this._opsCapacity);

    this._emitterQuantity = new Float32Array(maxEmitters);
    this._emitterMaxAlive = new Float32Array(maxEmitters);
    this._emitterDuration = new Float32Array(maxEmitters);
    this._emitterElapsed = new Float32Array(maxEmitters);
    this._emitterAliveCount = new Int32Array(maxEmitters);
    this._emitterGravX = new Float32Array(maxEmitters);
    this._emitterGravY = new Float32Array(maxEmitters);
    this._emitterTimeScale = new Float32Array(maxEmitters).fill(1);
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
  public create(config: EmitterCreateConfig = {}): ParticleEmitter | null {
    if (this._emitterCount >= this._emitterCapacity) {
      console.warn('ParticleManager: エミッター数が上限に達しました。');
      return null;
    }
    const id = this._emitterCount++;
    this._emitterActive[id] = 0;
    this._emitterAliveCount[id] = 0;
    this._emitterX[id] = config.x ?? 0;
    this._emitterY[id] = config.y ?? 0;
    this._emitterRate[id] = config.frequency ?? 0;
    this._emitterAccum[id] = 0;
    this._emitterSpeed[id] = config.speed ?? 100;
    this._emitterLife[id] = config.lifespan ?? 1000;
    this._emitterAngleMin[id] = config.angle?.min ?? 0;
    this._emitterAngleMax[id] = config.angle?.max ?? Math.PI * 2;
    this._emitterTint[id] = config.tint ?? 0xffffffff;
    this._emitterQuantity[id] = config.quantity ?? 1;
    this._emitterMaxAlive[id] = config.maxAliveParticles ?? 0;
    this._emitterDuration[id] = config.duration ?? 0;
    this._emitterElapsed[id] = 0;
    this._emitterGravX[id] = config.gravityX ?? 0;
    this._emitterGravY[id] = config.gravityY ?? 0;
    this._emitterTimeScale[id] = config.timeScale ?? 1;

    // zone の初期化。指定が無ければ射出点に追従する Emit 形状です。
    this._zoneShape[id] = config.zone?.shape ?? ParticleEmitterZoneShape.Emit;
    const p = id * ZONE_PARAMS;
    const zp = config.zone?.params;
    if (zp && zp.length >= ZONE_PARAMS) {
      this._zoneParams[p] = zp[0];
      this._zoneParams[p + 1] = zp[1];
      this._zoneParams[p + 2] = zp[2];
      this._zoneParams[p + 3] = zp[3];
    } else {
      this._zoneParams[p] = this._emitterX[id];
      this._zoneParams[p + 1] = this._emitterY[id];
      this._zoneParams[p + 2] = 0;
      this._zoneParams[p + 3] = 0;
    }

    // ops の開始位置と長さを確保します。長さ 0 = op なし。
    const opStart = id * this._opsPerEmitter;
    this._opStart[id] = opStart;
    this._opLen[id] = 0;
    if (config.ops) {
      const n = Math.min(config.ops.length, this._opsPerEmitter);
      for (let k = 0; k < n; k++) {
        this._ops[(opStart + k) * 2] = config.ops[k].enabled === false ? 0 : 1;
        this._ops[(opStart + k) * 2 + 1] = config.ops[k].value;
        this._opKind[opStart + k] = OP_KIND_IDS[config.ops[k].kind ?? 'speed'];
      }
      this._opLen[id] = n;
    }

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

  /** 粒子 SoA の確保数 (アarena の capacity と等しい) */
  public get particleCapacity(): number {
    return this.maxParticles;
  }

  /** 登録済みエミッター数 */
  public get emitterCount(): number {
    return this._emitterCount;
  }

  /** エミッターが毎フレーム生成を続けているか */
  public isEmitterEmitting(id: number): boolean {
    return this.isEmitterAlive(id) && this._emitterActive[id] === 1;
  }

  /**
   * エミッターの生成開始・停止を切り替えます (Phaser 互換の `start` / `stop`)。
   *
   * **開始時に即座に粒子は生成しません。** 生成は `frequency` に従って
   * `update` の中で行われます。Phaser の `start()` は `quantity` 個を
   * 同時に放ちますが、その挙動は {@link explodeEmitter} に委ねています。
   * `start()` を「毎フレーム生成を始める」ことだけに限定することで、
   * 「start 直後の粒子数が確定する」保証を保ちます。
   */
  public setEmitterEmitting(id: number, emitting: boolean): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterActive[id] = emitting ? 1 : 0;
    if (!emitting) return;

    // 再開時に端数が残らないように accum を初期化します
    this._emitterAccum[id] = 0;
    // duration の経過時間もリセットします
    this._emitterElapsed[id] = 0;
  }

  /** zone の形状 ID (Phaser 互換の `emitter.emitters` の形状部分) */
  public getEmitterZoneShape(id: number): number {
    return this.isEmitterAlive(id) ? this._zoneShape[id] : ParticleEmitterZoneShape.Emit;
  }

  /**
   * zone のパラメータを `out` へ書き出します。
   *
   * @param out 4 要素以上のバッファ
   * @returns 書き出した要素数（常に 4）
   */
  public getEmitterZoneParams(id: number, out: Float32Array): number {
    if (!this.isEmitterAlive(id)) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      return ZONE_PARAMS;
    }
    const p = id * ZONE_PARAMS;
    out[0] = this._zoneParams[p];
    out[1] = this._zoneParams[p + 1];
    out[2] = this._zoneParams[p + 2];
    out[3] = this._zoneParams[p + 3];
    return ZONE_PARAMS;
  }

  /** zone の形状を設定します (Phaser 互換の `setZone` / `ParticleEmitterZone`) */
  public setEmitterZone(
    id: number,
    shape: number,
    p0: number,
    p1: number,
    p2: number,
    p3: number,
  ): void {
    if (!this.isEmitterAlive(id)) return;
    this._zoneShape[id] = shape;
    const p = id * ZONE_PARAMS;
    this._zoneParams[p] = p0;
    this._zoneParams[p + 1] = p1;
    this._zoneParams[p + 2] = p2;
    this._zoneParams[p + 3] = p3;
  }

  /** ops の個数 (Phaser 互換の `ops.getChildren().length`) */
  public getEmitterOpCount(id: number): number {
    return this.isEmitterAlive(id) ? this._opLen[id] : 0;
  }

  /**
   * ops の値を `out` へ書き出します。
   *
   * @param out 2 要素以上のバッファ。[k*2] = isEnabled, [k*2+1] = value
   * @returns 書き出した op の個数
   */
  public getEmitterOps(id: number, out: Float32Array): number {
    if (!this.isEmitterAlive(id)) return 0;
    const start = this._opStart[id];
    const len = this._opLen[id];
    for (let k = 0; k < len; k++) {
      out[k * 2] = this._ops[(start + k) * 2];
      out[k * 2 + 1] = this._ops[(start + k) * 2 + 1];
    }
    return len;
  }

  /** ops の対象パラメータ_kind を返します (SoA の数値 ID) */
  public getEmitterOpKind(id: number, k: number): number {
    if (!this.isEmitterAlive(id)) return -1;
    if (k < 0 || k >= this._opLen[id]) return -1;
    return this._opKind[this._opStart[id] + k];
  }

  /** 1 回の生成個数 (Phaser 互換の `quantity`) */
  public getEmitterQuantity(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterQuantity[id] : 0;
  }

  /** 1 回の生成個数を設定します (Phaser 互換の `setQuantity`) */
  public setEmitterQuantity(id: number, n: number): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterQuantity[id] = n < 0 ? 0 : n;
  }

  /** 生存粒子上限 (Phaser 互換の `maxAliveParticles`) */
  public getEmitterMaxAlive(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterMaxAlive[id] : 0;
  }

  /** 生存粒子上限を設定します (Phaser 互換の `setMaxAliveParticles`) */
  public setEmitterMaxAlive(id: number, n: number): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterMaxAlive[id] = n < 0 ? 0 : n;
  }

  /** このエミッターが生成した生存粒子数 */
  public getEmitterAliveCount(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterAliveCount[id] : 0;
  }

  /** 自動停止するまでの時間 (ms)。0 なら無制限 */
  public getEmitterDuration(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterDuration[id] : 0;
  }

  /** 自動停止までの時間を設定します (Phaser 互換の `setDuration`) */
  public setEmitterDuration(id: number, ms: number): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterDuration[id] = ms < 0 ? 0 : ms;
    this._emitterElapsed[id] = 0;
  }

  /** 経過時間 (ms) */
  public getEmitterElapsed(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterElapsed[id] : 0;
  }

  /** 粒子ごとの重力 X (px/s^2) */
  public getEmitterGravityX(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterGravX[id] : 0;
  }

  /** 粒子ごとの重力 Y (px/s^2) */
  public getEmitterGravityY(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterGravY[id] : 0;
  }

  /** 粒子ごとの重力を設定します (Phaser 互換の `setParticleGravity`) */
  public setEmitterGravity(id: number, gx: number, gy: number): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterGravX[id] = gx;
    this._emitterGravY[id] = gy;
  }

  /** 水平方向の重力だけを設定します (Phaser 互換の `setParticleGravityX`) */
  public setEmitterGravityX(id: number, gx: number): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterGravX[id] = gx;
  }

  /** 垂直方向の重力だけを設定します (Phaser 互換の `setParticleGravityY`) */
  public setEmitterGravityY(id: number, gy: number): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterGravY[id] = gy;
  }

  /** 時間倍率 (Phaser 互換の `setTimeScale`)。1.0 が等速。 */
  public getEmitterTimeScale(id: number): number {
    return this.isEmitterAlive(id) ? this._emitterTimeScale[id] : 1;
  }

  /** 時間倍率を設定します (Phaser 互換の `setTimeScale`) */
  public setEmitterTimeScale(id: number, scale: number): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterTimeScale[id] = scale <= 0 ? 1 : scale;
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

  /**
   * 生成する粒子のテクスチャを設定します (Phaser 互換の `setParticleTexture`)。
   *
   * `TextureAsset` または `{ textureAsset }` を持つオブジェクトを受け取ります。
   * 粒子は生成時に `setFrameSize(1, 1)` でフレーム寸法を 1 に落とすため、
   * テクスチャ 있을場合も 1 ピクセル点として描画されます。
   */
  public setEmitterTexture(id: number, asset: unknown | null): void {
    if (!this.isEmitterAlive(id)) return;
    this._emitterTexture[id] = asset;
  }

  /** 粒子を 1 個生成します (Phaser 互換の `emitParticle`) */
  public emitOne(id: number): boolean {
    if (!this.isEmitterAlive(id)) return false;
    return this._emitFromEmitter(id);
  }

  /**
   * 1 エミッターから粒子を 1 個生成します。
   *
   * zone の評価 → ops の適用 → SoA への書き込みの順です。
   * zone と ops は生成時の 1 回だけ評価されるため、
   * ホットパス（`update`）である `update` ループには入りません。
   */
  private _emitFromEmitter(id: number): boolean {
    // maxAliveParticles の上限判定（0 = 無制限）
    const maxAlive = this._emitterMaxAlive[id];
    if (maxAlive > 0 && this._emitterAliveCount[id] >= maxAlive) return false;

    this._evalZone(id, SCRATCH);

    // ops を適用します。複数登録されていれば後勝ちです。
    let speed = this._emitterSpeed[id];
    let life = this._emitterLife[id];
    const opStart = this._opStart[id];
    const opLen = this._opLen[id];
    for (let k = 0; k < opLen; k++) {
      const o = opStart + k;
      if (this._ops[o * 2] === 0) continue;
      const v = this._ops[o * 2 + 1];
      const kind = this._opKind[o];
      if (kind === OP_KIND_IDS.speed) speed = v;
      else if (kind === OP_KIND_IDS.lifespan) life = v;
      // frequency と scale は粒子生成時に効く概念ではないため、
      // 設定 API (`setEmitterFrequency` / `setEmitterTimeScale`) 側で扱います。
    }

    const ok = this._emitOne(
      SCRATCH[0],
      SCRATCH[1],
      speed,
      life,
      this._emitterAngleMin[id],
      this._emitterAngleMax[id],
      this._emitterTint[id],
    );
    if (!ok) return false;

    // 生成された粒子 ID は末尾に追加されています。
    const particleId = this.activeIds[this.activeCount - 1];
    this.gravX[particleId] = this._emitterGravX[id];
    this.gravY[particleId] = this._emitterGravY[id];
    this.timeScale[particleId] = this._emitterTimeScale[id];
    this.ownerEmitter[particleId] = id;
    this._emitterAliveCount[id]++;
    return true;
  }

  /**
   * zone を評価して `out` に射出位置を書きます (Phaser 互換の `ParticleEmitterZone`)。
   *
   * `Emit` 形状はエミッター位置に追従します。それ以外は
   * `_zoneParams` に格納された形状ごとのパラメータを使います。
   */
  private _evalZone(id: number, out: Float32Array): void {
    const shape = this._zoneShape[id];
    const p = id * ZONE_PARAMS;
    const a = this._zoneParams[p];
    const b = this._zoneParams[p + 1];
    const c = this._zoneParams[p + 2];
    const d = this._zoneParams[p + 3];

    switch (shape) {
      case ParticleEmitterZoneShape.Point:
        out[0] = a;
        out[1] = b;
        break;
      case ParticleEmitterZoneShape.Line: {
        const t = Math.random();
        out[0] = a + (c - a) * t;
        out[1] = b + (d - b) * t;
        break;
      }
      case ParticleEmitterZoneShape.Circle: {
        // 半径 √u で面一様分布
        const r = c * Math.sqrt(Math.random());
        const th = Math.random() * Math.PI * 2;
        out[0] = a + Math.cos(th) * r;
        out[1] = b + Math.sin(th) * r;
        break;
      }
      case ParticleEmitterZoneShape.Random:
        out[0] = a + Math.random() * c;
        out[1] = b + Math.random() * d;
        break;
      default:
        // `Emit` 形状と不正値はどちらもエミッター位置に追従します
        out[0] = this._emitterX[id];
        out[1] = this._emitterY[id];
        break;
    }
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

  /** 生成を停止します (Phaser 互換の `stop`)。生成済みの粒子は残ります。 */
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
   * このエミッターが生成した生存粒子をすべて破棄します
   * (Phaser 互換の `killAll`)。
   *
   * `maxAliveParticles` の計算峙、熱ループ（`update`）ではなく
   * コマンド側から呼ばれるため、`Array` の生成を許容します。
   */
  public killAll(id: number): number {
    if (!this.isEmitterAlive(id)) return 0;
    let freed = 0;
    for (let i = this.activeCount - 1; i >= 0; i--) {
      const pid = this.activeIds[i];
      if (pid === -1 || this.ownerEmitter[pid] !== id) continue;
      this.arena.free(pid);
      this.activeIds[i] = this.activeIds[this.activeCount - 1];
      this.activeIds[this.activeCount - 1] = -1;
      this.activeCount--;
      freed++;
    }
    this._emitterAliveCount[id] = 0;
    return freed;
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

    // テクスチャがあれば差し替えます。allocate() が `assetRef` を null に
    // 戻すため、未設定のままでは描画されないままになります。
    const owner = this.ownerEmitter[id];
    const asset = owner >= 0 ? this._emitterTexture[owner] : null;
    if (asset) {
      // `Sprite.setTexture` と同じ経路で差し替えます。
      // フレーム寸法は上で 1x1 に落としているため、setFrame は呼ばません。
      const resolved = (asset as { textureAsset?: unknown }).textureAsset ?? asset;
      this.arena.assetRef[idx] = resolved as never;
      this.arena.setFrameIdx(idx, (resolved as { layerIndex?: number })?.layerIndex ?? 0);
    }

    // テクスチャ未設定のスプライトは既定で透明なので、
    // 描画されるよう不透明へ戻します。
    this.arena.setTint(idx, tint);

    this.velX[id] = Math.cos(angle) * v;
    this.velY[id] = Math.sin(angle) * v;
    this.life[id] = lifeMs;
    this.lifeMax[id] = lifeMs;
    // 生成元は既定 `-1` です。エミッター経由の生成なら
    // `_emitFromEmitter` が上書きします（burst は -1 のまま）。
    this.ownerEmitter[id] = -1;
    this.gravX[id] = 0;
    this.gravY[id] = 0;
    this.timeScale[id] = 1;

    this.activeIds[this.activeCount++] = id;
    return true;
  }

  public update(dt: number): void {
    const dtMs = dt * 1000;

    // 持続型エミッターの生成
    for (let e = 0; e < this._emitterCount; e++) {
      if (this._emitterActive[e] === 0) continue;

      // duration が設定されていれば経過時間で自動停止します。
      // 0 なら無制限なので判定をスキップします。
      const duration = this._emitterDuration[e];
      if (duration > 0) {
        this._emitterElapsed[e] += dtMs;
        if (this._emitterElapsed[e] >= duration) {
          this._emitterActive[e] = 0;
          continue;
        }
      }

      const rate = this._emitterRate[e];
      if (rate <= 0) continue;

      // 秒単位の生成個数 dt を掛けて積算し、端数を持ち越します
      this._emitterAccum[e] += rate * dt;
      const n = Math.floor(this._emitterAccum[e]);
      if (n <= 0) continue;
      this._emitterAccum[e] -= n;

      for (let i = 0; i < n; i++) {
        if (!this._emitFromEmitter(e)) break;
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

      const ts = this.timeScale[id];
      this.life[id] -= dtMs * ts;
      if (this.life[id] <= 0) {
        this.arena.free(id);
        this._decEmitterAliveCount(id);

        // Swap and pop
        this.activeIds[i] = this.activeIds[this.activeCount - 1];
        this.activeIds[this.activeCount - 1] = -1;
        this.activeCount--;
        i--; // Re-check the swapped element
        continue;
      }

      // 重力を速度に加算します。px/s^2 × dt(秒) で速度の増分になります。
      const gx = this.gravX[id];
      const gy = this.gravY[id];
      if (gx !== 0) this.velX[id] += gx * dt;
      if (gy !== 0) this.velY[id] += gy * dt;

      this.arena.setPosX(idx, this.arena.posX[idx] + this.velX[id] * dt);
      this.arena.setPosY(idx, this.arena.posY[idx] + this.velY[id] * dt);

      // Alpha / Scale decay
      const ratio = this.life[id] / this.lifeMax[id];
      this.arena.setScale(idx, ratio);
    }
  }

  /**
   * 粒子を解放したら、その生成元エミッターの生存粒子数を減らします。
   * `maxAliveParticles` の減算用です。
   */
  private _decEmitterAliveCount(particleId: number): void {
    const owner = this.ownerEmitter[particleId];
    if (owner >= 0 && this._emitterAliveCount[owner] > 0) this._emitterAliveCount[owner]--;
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
    this._emitterAliveCount.fill(0);
    this._emitterElapsed.fill(0);
    this._emitterHandles.clear();
  }
}

/** SCRATCH は将来の拡張用に確保しています。 */
void SCRATCH;
