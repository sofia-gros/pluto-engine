/**
 * @file GameLoop.ts
 * @description
 * ゲームループ。requestAnimationFrame をフックし、可変 dt と
 * 固定 fixedDeltaTime (アキュムレータ方式) を分離します。
 *
 * 設計上の掟:
 *  - ループ内で new を行わない (プロジェクション行列などは呼び出し側のバッファを使う)
 *  - Spiral of Death 防止のため dt を上限クランプし、
 *    固定ステップ的反復回数を panicLimit で明示的に制限する
 */

export interface LoopConfig {
  /** 目標フレームレート。指定するとその間隔より短いフレームを描画しない */
  targetFps?: number;
  /** 許容最低フレームレート。これを下回ると固定ステップの消化量を 1 回に抑える */
  minFps?: number;
  /** 物理・固定シミュレーションの刻み幅 (秒) */
  fixedDeltaTime?: number;
  /** 1 フレームで許容する固定ステップの最大反復回数 */
  panicLimit?: number;
  /** dt の上限 (秒)。タブ復帰時などの巨大な delta を弾く */
  maxDeltaTime?: number;
}

export interface LoopCallbacks {
  /** 可変フレームの更新。引数は (time 秒, dt 秒) */
  onUpdate?: (time: number, dt: number) => void;
  /** 固定ステップ。引数は固定刻み幅 (秒) */
  onFixedUpdate?: (fixedDt: number) => void;
  /** 描画 */
  onRender?: (time: number) => void;
  /** 目標FPS によるフレームスキップが発生したとき */
  onSkip?: (time: number) => void;
}

const DEFAULTS = {
  targetFps: 0, // 0 は無効 (VSync に任せる)
  minFps: 30,
  fixedDeltaTime: 1 / 60,
  panicLimit: 5,
  maxDeltaTime: 0.1,
};

export class GameLoop {
  public readonly config: Required<LoopConfig>;

  private _running = false;
  private _rafId: number | null = null;
  private _lastTime = 0;
  private _accumulator = 0;
  private _lastRenderTime = 0;
  /** 最初の 1 フレームはフレーム間隔の判定を行わない */
  private _primed = false;

  /** 計測用カウンタ */
  public frameCount = 0;
  public fixedStepCount = 0;
  public skippedFrameCount = 0;
  /** 直近に実測した実効 FPS (1 秒窓) */
  public measuredFps = 0;

  private _fpsFrames = 0;
  private _fpsWindowStart = 0;

  private readonly _callbacks: LoopCallbacks;

  constructor(config: LoopConfig = {}, callbacks: LoopCallbacks = {}) {
    this.config = {
      targetFps: config.targetFps ?? DEFAULTS.targetFps,
      minFps: config.minFps ?? DEFAULTS.minFps,
      fixedDeltaTime: config.fixedDeltaTime ?? DEFAULTS.fixedDeltaTime,
      panicLimit: config.panicLimit ?? DEFAULTS.panicLimit,
      maxDeltaTime: config.maxDeltaTime ?? DEFAULTS.maxDeltaTime,
    };
    this._callbacks = callbacks;
  }

  public start(now: number = performance.now()): void {
    if (this._running) return;
    this._running = true;
    this._lastTime = now;
    this._lastRenderTime = now;
    this._fpsWindowStart = now;
    this._accumulator = 0;
    this._primed = true;
    this._rafId = requestAnimationFrame(this._loop);
  }

  public stop(): void {
    this._running = false;
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  public get running(): boolean {
    return this._running;
  }

  private readonly _loop = (now: number): void => {
    if (!this._running) return;
    this.step(now);
    this._rafId = requestAnimationFrame(this._loop);
  };

  /**
   * 1 フレーム分の処理を実行します。
   * テストからは rAF に依存せず直接このメソッドを呼べます。
   */
  public step(now: number): void {
    // 初回は時間基準をここで確立する。フレーム間隔の判定は行わない。
    let isFirstFrame = false;
    if (!this._primed) {
      this._primed = true;
      isFirstFrame = true;
      this._lastTime = now;
      this._lastRenderTime = now;
      this._fpsWindowStart = now;
    }

    // 目標FPS を超えていれば描画も更新もせず次フレームへ
    if (!isFirstFrame && this.config.targetFps > 0) {
      const minFrameMs = 1000 / this.config.targetFps;
      if (now - this._lastRenderTime < minFrameMs) {
        this.skippedFrameCount++;
        this._lastTime = now;
        this._callbacks.onSkip?.(now);
        return;
      }
    }
    this._lastRenderTime = now;

    let dt = (now - this._lastTime) / 1000;
    this._lastTime = now;

    // Spiral of Death 防止: 巨大な delta を上限クランプする
    if (dt > this.config.maxDeltaTime) dt = this.config.maxDeltaTime;
    if (dt < 0) dt = 0;

    this._fpsFrames++;
    if (now - this._fpsWindowStart >= 1000) {
      this.measuredFps = this._fpsFrames;
      this._fpsFrames = 0;
      this._fpsWindowStart = now;
    }

    this.frameCount++;

    // 最低 FPS を下回る場合は消化する固定ステップ数を 1 回に抑える
    const backlogLimited = this.measuredFps > 0 && this.measuredFps < this.config.minFps;
    const maxSteps = backlogLimited ? 1 : this.config.panicLimit;

    const fixedDt = this.config.fixedDeltaTime;
    this._accumulator += dt;

    let steps = 0;
    while (this._accumulator >= fixedDt && steps < maxSteps) {
      this._callbacks.onFixedUpdate?.(fixedDt);
      this._accumulator -= fixedDt;
      steps++;
      this.fixedStepCount++;
    }

    // panicLimit に到達しても積みが残る場合は、下一代で計算し終わるよう切り捨てる
    if (this._accumulator > fixedDt) {
      this._accumulator = 0;
    }

    this._callbacks.onUpdate?.(now / 1000, dt);
    this._callbacks.onRender?.(now / 1000);
  }

  /**
   * ループを破棄します。
   */
  public destroy(): void {
    this.stop();
  }
}
