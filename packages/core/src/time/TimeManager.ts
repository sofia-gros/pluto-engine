/**
 * @file TimeManager.ts
 * @description
 * メインループのFPS計測やDeltaTimeの計算など、時間管理を担当する。
 */

export class TimeManager {
  public fps = 0;
  public deltaTime = 0;
  public time = 0;

  private lastTime = 0;
  private frames = 0;
  private lastFpsTime = 0;

  constructor() {
    this.lastTime = performance.now();
    this.lastFpsTime = this.lastTime;
  }

  public step(now: number): number {
    this.deltaTime = (now - this.lastTime) / 1000;

    // Spiral of death 防止策 (DeltaTime の上限を固定)
    if (this.deltaTime > 0.1) {
      this.deltaTime = 0.1;
    }

    this.time += this.deltaTime;
    this.lastTime = now;

    this.frames++;
    if (now - this.lastFpsTime >= 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.lastFpsTime = now;
    }

    return this.deltaTime;
  }
}
