/**
 * @file TimeFacade.ts
 * @description
 * Phaser 4 互換の `scene.time` 门面。
 *
 * 実体である TimeStepManager (SoA) への薄いラッパーで、
 * ユーザーには Flyweight ハンドル (TimerEvent) を返します。
 * 状態は SoA が正本なので、このクラスは値を一切持ちません。
 */

import type { TimeStepManager } from './TimeStepManager';
import { TimerEvent } from './TimerEvent';

export class TimeFacade {
  private readonly _time: TimeStepManager;
  /** 生成済みのハンドル。id -> TimerEvent の対応です。 */
  private readonly _handles = new Map<number, TimerEvent>();

  constructor(time: TimeStepManager) {
    this._time = time;
  }

  /** 実効フレームレート */
  public get fps(): number {
    return this._time.measuredFps;
  }

  /** 可変フレームの delta (秒) */
  public get delta(): number {
    return this._time.deltaTime;
  }

  /** ゲーム開始からの経過秒数 */
  public get now(): number {
    return this._time.time;
  }

  /**
   * 時間スケール。1.0 が等速、2.0 で 2 倍速です。
   * 0 以下の値にはクランプします。
   */
  public get timeScale(): number {
    return this._time.timeScale;
  }

  public set timeScale(v: number) {
    this._time.timeScale = v < 0 ? 0 : v;
  }

  /**
   * 指定ミリ秒後に一度だけ実行します (Phaser 互換の `delayedCall`)。
   * @returns TimerEvent ハンドル
   */
  public delayedCall(
    delayMs: number,
    // Phaser 互換のため、コールバックの引数型は any[] のままにします
    // biome-ignore lint/suspicious/noExplicitAny: Phaser 互換のコールバック引数
    callback: (...args: any[]) => void,
    // biome-ignore lint/suspicious/noExplicitAny: 呼び出し側が任意の引数を渡す
    args?: any[],
  ): TimerEvent {
    const id = this._time.delayedCall(delayMs * this._time.timeScale, callback, args);
    return this._wrap(id);
  }

  /**
   * イベントを登録します (Phaser 互換の `addEvent`)。
   * @returns TimerEvent ハンドル
   */
  public addEvent(config: {
    delay: number;
    // biome-ignore lint/suspicious/noExplicitAny: Phaser 互換のコールバック引数
    callback: (...args: any[]) => void;
    loop?: boolean;
    repeatDelay?: number;
    // biome-ignore lint/suspicious/noExplicitAny: 呼び出し側が任意の引数を渡す
    args?: any[];
  }): TimerEvent {
    const scale = this._time.timeScale;
    const id = this._time.addEvent({
      delay: config.delay * scale,
      callback: config.callback,
      loop: config.loop,
      repeatDelay: config.repeatDelay === undefined ? undefined : config.repeatDelay * scale,
      args: config.args,
    });
    return this._wrap(id);
  }

  /**
   * 登録済みのタイマーを取り消します。
   * `delayedCall` が返すハンドルではなく、TimeStepManager 、
   * つまり数値 ID を取る既存のコード向けの互換経路です。
   */
  public removeEvent(id: number): void {
    this._time.removeEvent(id);
    this._handles.delete(id);
  }

  /** 登録済みのタイマーをすべて取り消します */
  public clear(): void {
    this._time.clearTimers();
    this._handles.clear();
  }

  /** 現在有効なタイマーの数 */
  public get activeTimerCount(): number {
    return this._time.activeTimerCount;
  }

  /**
   * 線形補間を行います (Phaser 互換の `smoothStep`)。
   * @param t 0〜1 の進行度
   * @returns t を 0〜1 にクランプした eased 値
   */
  public smoothStep(t: number): number {
    const c = t < 0 ? 0 : t > 1 ? 1 : t;
    return c * c * (3 - 2 * c);
  }

  /**
   * id に対応する Flyweight ハンドルを返します。
   * 同じ id は必ず同じインスタンスを返します。
   */
  private _wrap(id: number): TimerEvent {
    if (id < 0) {
      // 上限超過時は無効なハンドルを返します
      return new TimerEvent(-1, this._time);
    }
    let h = this._handles.get(id);
    if (h === undefined) {
      h = new TimerEvent(id, this._time);
      this._handles.set(id, h);
    }
    return h;
  }
}
