/**
 * @file TimeStepManager.ts
 * @description
 * 時間の管理。DeltaTime の計算、実効 FPS の計測、
 * フレームレート非依存のタイマー (delayedCall / addEvent) を担当します。
 *
 * 設計上の掟: タイマーは事前確保した SoA 配列 + フリーリストで管理し、
 * update ループ内で new を行いません。
 * Flyweight ハンドル (TimerEvent) からは本クラスの公开アクセサだけを呼び、
 * SoA 配列を直接触りません。
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

/** コールバック引数ゼロの共有配列。毎回の new を避ける */
const EMPTY_ARGS: any[] = [];

/** 引数を spread せずに呼ぶためのスクラッチ。上限 4 要素 */
const ARITY_LIMIT = 4;

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
  /**
   * 時間スケール。1.0 が等速、2.0 で 2 倍速です。
   * タイマーの登録時と更新時の両方に乗算されます。
   */
  public timeScale = 1;

  private lastTime = 0;
  private frames = 0;
  private lastFpsTime = 0;
  private _started = false;

  // --- タイマー (SoA) ---
  public readonly timerCapacity: number;
  private readonly _active: Uint8Array;
  private readonly _paused: Uint8Array;
  private readonly _elapsedMs: Float32Array;
  private readonly _delayMs: Float32Array;
  private readonly _repeatDelayMs: Float32Array;
  private readonly _loop: Uint8Array;
  /** 一度でも発火したか。delay と repeatDelay の切り替え判定に使います。 */
  private readonly _hasFired: Uint8Array;
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
    this._paused = new Uint8Array(timerCapacity);
    this._elapsedMs = new Float32Array(timerCapacity);
    this._delayMs = new Float32Array(timerCapacity);
    this._repeatDelayMs = new Float32Array(timerCapacity);
    this._loop = new Uint8Array(timerCapacity);
    this._hasFired = new Uint8Array(timerCapacity);
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
   *
   * オブジェクトリテラルを生成しないよう、addEvent を直接呼びます。
   * @returns タイマー ID (removeEvent に渡します)
   */
  public delayedCall(delayMs: number, callback: (...args: any[]) => void, args?: any[]): number {
    const id = this._acquire(delayMs, callback, false, undefined, args);
    return id;
  }

  /**
   * タイマーを登録します。
   * @returns タイマー ID
   */
  public addEvent(config: TimerEventConfig & { args?: any[] }): number {
    return this._acquire(
      config.delay,
      config.callback,
      config.loop === true,
      config.repeatDelay,
      config.args,
    );
  }

  /**
   * フリーリストから枠を取って SoA を初期化します。
   * 設定オブジェクトを組み立てずに registrations 経路を一本化します。
   */
  private _acquire(
    delayMs: number,
    callback: (...args: any[]) => void,
    loop: boolean,
    repeatDelayMs: number | undefined,
    args: any[] | undefined,
  ): number {
    if (this._freeListHead >= this.timerCapacity) {
      console.warn('TimeStepManager: タイマーが上限に達しました。');
      return -1;
    }
    const id = this._freeList[this._freeListHead++];
    this._active[id] = 1;
    this._paused[id] = 0;
    this._elapsedMs[id] = 0;
    this._delayMs[id] = delayMs;
    // repeatDelay が未指定の場合は delay と同じ間隔で繰り返す
    this._repeatDelayMs[id] = repeatDelayMs !== undefined ? repeatDelayMs : delayMs;
    this._loop[id] = loop ? 1 : 0;
    this._hasFired[id] = 0;
    this._callbacks[id] = callback;
    this._args[id] = args ?? EMPTY_ARGS;
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
    this._paused[id] = 0;
    this._hasFired[id] = 0;
    this._callbacks[id] = undefined as any;
    this._args[id] = undefined as any;
    this._timerActiveCount--;
    this._freeList[--this._freeListHead] = id;
  }

  public get activeTimerCount(): number {
    return this._timerActiveCount;
  }

  // --- Flyweight (TimerEvent) 向けの公開アクセサ ---

  /** タイマーが登録済みで、まだ取り消されていないか */
  public hasTimer(id: number): boolean {
    return id >= 0 && id < this.timerCapacity && this._active[id] === 1;
  }

  /** タイマーが一時停止中か */
  public isTimerPaused(id: number): boolean {
    return this.hasTimer(id) && this._paused[id] === 1;
  }

  /** 経過時間 (ミリ秒) */
  public getTimerElapsed(id: number): number {
    return this.hasTimer(id) ? this._elapsedMs[id] : 0;
  }

  /** 発火までの間隔 (ミリ秒) */
  public getTimerDelay(id: number): number {
    return this.hasTimer(id) ? this._delayMs[id] : 0;
  }

  /** 繰り返し間隔 (ミリ秒) */
  public getTimerRepeatDelay(id: number): number {
    return this.hasTimer(id) ? this._repeatDelayMs[id] : 0;
  }

  /** 繰り返し中か */
  public isTimerLooping(id: number): boolean {
    return this.hasTimer(id) && this._loop[id] === 1;
  }

  /**
   * 進捗率 (0〜1)。delay が 0 のときは完了扱いとして 1 を返します。
   */
  public getTimerProgress(id: number): number {
    if (!this.hasTimer(id)) return 0;
    const delay = this._delayMs[id];
    if (delay <= 0) return 1;
    const p = this._elapsedMs[id] / delay;
    return p > 1 ? 1 : p;
  }

  /** 一時停止します。経過時間は保持されます。 */
  public pauseTimer(id: number): void {
    if (this.hasTimer(id)) this._paused[id] = 1;
  }

  /** 一時停止を解除します。 */
  public resumeTimer(id: number): void {
    if (this.hasTimer(id)) this._paused[id] = 0;
  }

  /** 経過時間を 0 に戻し、delay 閾値に戻します。発火はしません。 */
  public resetTimer(id: number): void {
    if (!this.hasTimer(id)) return;
    this._elapsedMs[id] = 0;
    this._hasFired[id] = 0;
  }

  /**
   * 指定ミリ秒位置まで即座に進めます。発火はさせず、経過時間だけを変更します。
   * Phaser の seek に相当します。
   */
  public seekTimer(id: number, ms: number): void {
    if (!this.hasTimer(id)) return;
    const delay = this._delayMs[id];
    this._elapsedMs[id] = ms < 0 ? 0 : ms > delay ? delay : ms;
  }

  /** 発火までの間隔を書き換えます。 */
  public setTimerDelay(id: number, delayMs: number): void {
    if (!this.hasTimer(id) || delayMs < 0) return;
    this._delayMs[id] = delayMs;
    this._repeatDelayMs[id] = delayMs;
  }

  /**
   * コールバックを読み取り専用で取得します。Flyweight からの差し替え用。
   */
  public getTimerCallback(id: number): ((...args: any[]) => void) | undefined {
    return this.hasTimer(id) ? this._callbacks[id] : undefined;
  }

  /**
   * 登録済みのタイマーを進めます。GameLoop から毎フレーム 1 回呼ばれます。
   */
  public update(dtMs: number): void {
    if (this._timerActiveCount === 0) return;

    // timeScale は 0 にクランプ済みなので負の dt は発生しません
    const scaled = dtMs * this.timeScale;

    for (let i = 0; i < this._timerCount; i++) {
      if (this._active[i] === 0) continue;
      // 一時停止中のタイマーは時間を進めない
      if (this._paused[i] === 1) continue;

      this._elapsedMs[i] += scaled;
      // 初回は delay、2 回目以降は repeatDelay を閾値にする
      const threshold = this._hasFired[i] === 1 ? this._repeatDelayMs[i] : this._delayMs[i];
      if (this._elapsedMs[i] < threshold) continue;

      const cb = this._callbacks[i];
      const a = this._args[i];
      if (this._loop[i] === 1) {
        // 満たした閾値だけ减去して、過剰分は次回に持ち越す
        this._elapsedMs[i] -= threshold;
        // 遅延を複数回跨いでいた場合は 0 に戻して暴走を防ぐ
        if (this._elapsedMs[i] > threshold) this._elapsedMs[i] = 0;
        this._hasFired[i] = 1;
        if (cb) this._invoke(cb, a);
      } else {
        if (cb) this._invoke(cb, a);
        this.removeEvent(i);
      }
    }
  }

  /**
   * 引数を spread せずにコールバックを呼びます。
   * Arguments に length が無いため、引数 0〜4 を個別に分岐して
   * 毎フレームの配列生成を避けます。
   */
  private _invoke(cb: (...args: any[]) => void, a: any[]): void {
    const n = a.length;
    if (n === 0) {
      cb();
    } else if (n === 1) {
      cb(a[0]);
    } else if (n === 2) {
      cb(a[0], a[1]);
    } else if (n === 3) {
      cb(a[0], a[1], a[2]);
    } else if (n <= ARITY_LIMIT) {
      cb(a[0], a[1], a[2], a[3]);
    } else {
      cb(...a);
    }
  }

  /**
   * すべてのタイマーを取り消します。
   */
  public clearTimers(): void {
    for (let i = 0; i < this.timerCapacity; i++) {
      if (this._active[i] === 1) {
        this._active[i] = 0;
        this._paused[i] = 0;
        this._hasFired[i] = 0;
        this._callbacks[i] = undefined as any;
        this._args[i] = undefined as any;
        this._freeList[--this._freeListHead] = i;
      }
    }
    this._timerActiveCount = 0;
    this._timerCount = 0;
  }
}
