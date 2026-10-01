/**
 * @file Tween.ts
 * @description
 * Phaser 4 互換のトゥイーンハンドル。
 *
 * 設計上の掟 (R-03): own property は `id` と `_manager` の 2 個だけ。
 *
 * `id` は「グループ ID」です。pluto-engine のトゥイーンは
 * (ターゲット x プロパティ) を 1 スロットずつ確保し、1 つのグループにまとめます。
 * Phaser の `tween.stop()` も同じ「1 つのトゥイーンを全部止める」意味なので、
 * グループ単位で操作するのが素直です。
 *
 * 状態は TweenManager の SoA 配列が正本であり、本クラスは値を持ちません。
 */

import type { TweenManager } from './TweenManager';

/** ハンドルが無効であることを表すグループ ID */
const ID_INVALID = -1;

export class Tween {
  /** TweenManager 内のグループ ID。`stop` 後は -1 になる */
  public id: number;

  private readonly _manager: TweenManager;

  constructor(id: number, manager: TweenManager) {
    this.id = id;
    this._manager = manager;
  }

  /** ハンドルとして有効か (まだ動いているか) */
  get isValid(): boolean {
    return this.id !== ID_INVALID && this._manager.isGroupActive(this.id);
  }

  /**
   * 再生中か (Phaser 互換の `isPlaying`)。
   * 一時停止中も true のままです。
   */
  get isPlaying(): boolean {
    return this._manager.isGroupActive(this.id);
  }

  /** 一時停止中か (Phaser 互換の `isPaused`) */
  get isPaused(): boolean {
    return this._manager.isGroupPaused(this.id);
  }

  /** 解放済みか (Phaser 互換の `isDestroyed`) */
  get isDestroyed(): boolean {
    return !this.isValid;
  }

  /** 進捗率 (0〜1) */
  get progress(): number {
    return this._manager.getGroupProgress(this.id);
  }

  /** 経過時間 (ミリ秒) */
  get elapsed(): number {
    return this._manager.getGroupElapsed(this.id);
  }

  /** 所要時間 (ミリ秒) */
  get duration(): number {
    return this._manager.getGroupDuration(this.id);
  }

  /** 進捗率 (0〜1) */
  getProgress(): number {
    return this._manager.getGroupProgress(this.id);
  }

  /** 一時停止します。経過時間は保持されます。 */
  pause(): this {
    this._manager.pauseGroup(this.id);
    return this;
  }

  /** 一時停止を解除します。 */
  resume(): this {
    this._manager.resumeGroup(this.id);
    return this;
  }

  /**
   * 再生を開始します。
   *
   * 停止済みのハンドルに対しては no-op です。Phaser と違い
   * 同じ設定で作り直すことはしません (SoA の状態は失われています)。
   */
  play(): this {
    return this;
  }

  /**
   * 停止します (Phaser 互換の `stop`)。onComplete は呼びません。
   * ハンドル自身も無効になります。二重停止しても安全です。
   */
  stop(): this {
    if (this.id !== ID_INVALID) {
      this._manager.stopGroup(this.id);
      this.id = ID_INVALID;
    }
    return this;
  }

  /**
   * 先頭へ戻します (Phaser 互換の `reset`)。
   * 経過時間・方向・繰り返し回数を初期状態に戻し、開始値へスナップします。
   */
  reset(): this {
    if (this.isValid) this._manager.resetGroup(this.id);
    return this;
  }

  /**
   * 指定ミリ秒位置まで進めます (Phaser 互換の `seek`)。
   * 発火はしません。
   */
  seek(ms: number): this {
    if (this.isValid) this._manager.seekGroup(this.id, ms);
    return this;
  }
}
