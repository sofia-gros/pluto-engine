/**
 * @file TimeStepManager.ts
 * @description
 * 時間の管理。DeltaTime の計算、実効 FPS の計測、
 * フレームレート非依存のタイマー (delayedCall / addEvent) を担当します。
 *
 * 設計上の掟: タイマーは事前確保した SoA 配列 + フリーリストで管理し、
 * update ループ内で new を行いません。
 */

export interface TimerEventConfig {
  /** 発火までのミリ秒 */
  delay: number;
  /** 発火時に呼ばれる関数 */
  callback: (...args: any[]) => void;
  /** true */
  loop?: boolean;
  /** 繰り返し時の間隔 (ミリ秒)。未指定なら delay を使用します */
  repeatDelay?: number;
}

const DEFAULT_TIMER_CAPACITY = 4096;

export class TimeStepManager {
  /** 直近に実測した FPS (1 秒窓) */
  public fps = 0;
  /** 実効フレームレート。GameLoop から毎フレーム書き込まれる */
  public measuredFps = 0;
  public deltaTime = 0;
  /** ゲーム開始からの経過秒数 */
  public time = 0;
  /** 現在のフレームのタイムスタンプ (ミリ秒) */
  public now = 0;

  private lastTime = 0;
  private frames = 0;
  private lastFpsTime = 0;
  private _started = false;

  // --- タイマー (SoA) ---
  public readonly timerCapacity: number;
  private readonly _active: Uint8Array;
  private readonly _elapsedMs: Float32Array;
  private readonly _delayMs: Float32Array;
  private readonly _loop: Uint8Array;
  private readonly _freeList: Int32Array;
  private _freeListHead = 0;
  private _timerActiveCount = 0;

  /**
   * コールバックは更新ループ外 (通常は初期化時) に登録されるため、
   * 事前確保した配列で保持します。
   */
  private readonly _callbacks: ((...args: any[]) => void)[];
  private readonly _args: any[][];
  private _timerCount = 0;

  constructor(timerCapacity: number = DEFAULT_TIMER_CAPACITY) {
    this.timerCapacity = timerCapacity;
    this._active = new Uint8Array(timerCapacity);
    this._elapsedMs = new Float32Array(timerCapacity);
    this._delayMs = new Float32Array(timerCapacity);
    this._loop = new Uint8Array(timerCapacity);
    this._freeList = new Int32Array(timerCapacity);
    for (let i = 0; i < timerCapacity; i++) {
      this._freeList[i] = i;
    }
    this._callbacks = new Array(timerCapacity);
    this._args = new Array(timerCapacity);
  }

  /**
   * ループの 1 ステップを進めます。引数は rAF のタイムスタンプ (ミリ秒)。
   * @returns 可変フレームの dt (秒)
   */
  public step(now: number): number {
    if (!this._started) {
      this._started = true;
      this.lastTime = now;
      this.lastFpsTime = now;
      this.now = now;
    }

    let dt = (now - this.lastTime) / 1000;

    // Spiral of Death 防止策 (DeltaTime の上限を固定)
    if (dt > 0.1) dt = 0.1;
    if (dt < 0) dt = 0;

    this.deltaTime = dt;
    this.time += dt;
    this.lastTime = now;
    this.now = now;

    this.frames++;
    if (now - this.lastFpsTime >= 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.lastFpsTime = now;
    }

    return dt;
  }

  /**
   * 指定ミリ秒後に一度だけ実行するタイマーを登録します。
   * @returns タイマー ID (removeEvent に渡します)
   */
  public delayedCall(
    delayMs: number,
    callback: (...args: any[]) => void,
    args?: any[],
  ): number {
    return this.addEvent({ delay: delayMs, callback, loop: false, ...(args ? { args } : {}) } as any);
  }

  /**
   * タイマーを登録します。
   * @returns タイマー ID
   */
  public addEvent(config: TimerEventConfig & { args?: any[] }): number {
    if (this._freeListHead >= this.timerCapacity) {
      console.warn('TimeStepManager: タイマーが上限に達しました。');
      return -1;
    }
    const id = this._freeList[this._freeListHead++];
    this._active[id] = 1;
    this._elapsedMs[id] = 0;
    this._delayMs[id] = config.delay;
    this._loop[id] = config.loop ? 1 : 0;
    this._callbacks[id] = config.callback;
    this._args[id] = (config as any).args ?? EMPTY_ARGS;
    this._timerActiveCount++;
    this._timerCount = Math.max(this._timerCount, id + 1);
    return id;
  }

  /**
   * 登録済みタイマーを取り消します。
   */
  public removeEvent(id: number): void {
    if (id < 0 || id >= this.timerCapacity) return;
    if (this._active[id] === 0) return;
    this._active[id] = 0;
    this._callbacks[id] = undefined as any;
    this._args[id] = undefined as any;
    this._timerActiveCount--;
    this._freeList[--this._freeListHead] = id;
  }

  public get activeTimerCount(): number {
    return this._timerActiveCount;
  }

  /**
   * 登録済みのタイマーを進めます。GameLoop から毎フレーム 1 回呼ばれます。
   */
  public update(dtMs: number): void {
    if (this._timerActiveCount === 0) return;

    for (let i = 0; i < this._timerCount; i++) {
      if (this._active[i] === 0) continue;

      this._elapsedMs[i] += dtMs;
      if (this._elapsedMs[i] < this._delayMs[i]) continue;

      const cb = this._callbacks[i];
      const a = this._args[i];
      if (this._loop[i] === 1) {
        this._elapsedMs[i] -= this._delayMs[i];
        // 遅延を複数回跨いでいた場合は 0 に戻して暴走を防ぐ
        if (this._elapsedMs[i] > this._delayMs[i]) this._elapsedMs[i] = 0;
        if (cb) cb(...a);
      } else {
        cb?.(...a);
        this.removeEvent(i);
      }
    }
  }

  /**
   * すべてのタイマーを取り消します。
   */
  public clearTimers(): void {
    for (let i = 0; i < this.timerCapacity; i++) {
      if (this._active[i] === 1) {
        this._active[i] = 0;
        this._callbacks[i] = undefined as any;
        this._args[i] = undefined as any;
        this._freeList[--this._freeListHead] = i;
      }
    }
    this._timerActiveCount = 0;
    this._timerCount = 0;
  }
}

const EMPTY_ARGS: any[] = [];
