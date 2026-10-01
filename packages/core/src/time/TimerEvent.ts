/**
 * @file TimerEvent.ts
 * @description
 * Phaser 4 互換のタイマーハンドル。
 *
 * 設計上の掟 (R-03): Flyweight の own property は `id` と `_manager` の 2 個だけ。
 * 状態は TimeStepManager の SoA 配列が正本であり、本クラスは値を持たない。
 * ハンドルそのものを new されるのは登録時だけで、
 * update ループ内では一切生成しません。
 */

import type { TimeStepManager } from './TimeStepManager';

/** Flyweight が解放済みかどうかを表す index */
const ID_INVALID = -1;

export class TimerEvent {
  /** TimeStepManager 内のタイマー ID。`destroy` 後は -1 になる */
  public id: number;

  private readonly _manager: TimeStepManager;

  constructor(id: number, manager: TimeStepManager) {
    this.id = id;
    this._manager = manager;
  }

  /** ハンドルとして有効か (destroy されていないか) */
  get isValid(): boolean {
    return this.id !== ID_INVALID && this._manager.hasTimer(this.id);
  }

  /** タイマーが繰り返し中か */
  get hasLoop(): boolean {
    return this._manager.isTimerLooping(this.id);
  }

  /** 一時停止中か */
  get isPaused(): boolean {
    return this._manager.isTimerPaused(this.id);
  }

  /** 発火までの間隔 (ミリ秒) */
  get delay(): number {
    return this._manager.getTimerDelay(this.id);
  }

  /** 繰り返し間隔 (ミリ秒) */
  get repeatDelay(): number {
    return this._manager.getTimerRepeatDelay(this.id);
  }

  /**
   * 経過時間 (ミリ秒)。
   * Phaser 互換のため、GameLoop の開始時刻からの絶対値ではなく
   * このタイマーの経過のみを返します。
   */
  get elapsed(): number {
    return this._manager.getTimerElapsed(this.id);
  }

  /** 進捗率 (0〜1) */
  get progress(): number {
    return this._manager.getTimerProgress(this.id);
  }

  /**
   * 発火までの間隔 (ミリ秒) を書き換えます。
   * 繰り返し間隔も同時に追従します。
   */
  setDelay(delayMs: number): this {
    this._manager.setTimerDelay(this.id, delayMs);
    return this;
  }

  /**
   * 指定ミリ秒位置まで即座に進めます。発火はしません。
   */
  seek(ms: number): this {
    this._manager.seekTimer(this.id, ms);
    return this;
  }

  /** 経過時間を 0 に戻します。発火はしません。 */
  reset(): this {
    this._manager.resetTimer(this.id);
    return this;
  }

  /** 一時停止します。経過時間は保持されます。 */
  pause(): this {
    this._manager.pauseTimer(this.id);
    return this;
  }

  /** 一時停止を解除します。 */
  resume(): this {
    this._manager.resumeTimer(this.id);
    return this;
  }

  /**
   * タイマーを取り消します。ハンドル自身も無効になります。
   * 二重解放しても安全です。
   */
  remove(): this {
    if (this.id !== ID_INVALID) {
      this._manager.removeEvent(this.id);
      this.id = ID_INVALID;
    }
    return this;
  }

  /**
   * ハンドル自身を解放します。`remove` と同じですが、
   * Phaser の `destroy` と同じ名前で呼び出せるように用意しています。
   */
  destroy(): this {
    return this.remove();
  }
}
