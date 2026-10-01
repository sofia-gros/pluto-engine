/**
 * @file AnimState.ts
 * @description
 * Phaser 4 互換のアニメーション状態ハンドル。
 *
 * 設計上の掟 (R-03): own property は `slot` と `_manager` の 2 個だけ。
 * アリーナ ID ではなく **AnimationManager の再生スロット番号** を保持します。
 * これにより stop / pause などの操作が走査なしで O(1) になります。
 *
 * 状態は AnimationManager の SoA 配列が正本であり、本クラスは値を持ちません。
 */

import type { AnimationManager } from './AnimationManager';

/** ハンドルが無効であることを表すスロット番号 */
const SLOT_INVALID = -1;

export class AnimState {
  /** AnimationManager 内の再生スロット番号。`stop` 後は -1 になる */
  public slot: number;

  private readonly _manager: AnimationManager;

  constructor(slot: number, manager: AnimationManager) {
    this.slot = slot;
    this._manager = manager;
  }

  /** ハンドルとして有効か (停止していないか) */
  get isValid(): boolean {
    return this.slot !== SLOT_INVALID && this._manager.isSlotActive(this.slot);
  }

  /** 再生中か */
  get isPlaying(): boolean {
    return this._manager.isSlotActive(this.slot);
  }

  /** 一時停止中か */
  get isPaused(): boolean {
    return this._manager.isSlotPaused(this.slot);
  }

  /** 逆再生中か */
  get isPlayingReverse(): boolean {
    return this._manager.isSlotReverse(this.slot);
  }

  /** 現在のコマ番号 (0 始まり) */
  get currentFrame(): number {
    return this._manager.getSlotFrameIndex(this.slot);
  }

  /** 総コマ数 */
  get totalFrames(): number {
    return this._manager.getSlotFrameLength(this.slot);
  }

  /**
   * 再生の進捗率 (0〜1)。
   * 逆再生では 1 から 0 へ減少します。
   */
  get progress(): number {
    return this._manager.getSlotProgress(this.slot);
  }

  /** 進捗率 (0〜1) */
  getProgress(): number {
    return this._manager.getSlotProgress(this.slot);
  }

  /**
   * 再生方向を切り替えます (Phaser 互換の `setDirection`)。
   * @param reverse true で逆再生
   */
  setDirection(reverse: boolean): this {
    this._manager.setSlotReverse(this.slot, reverse);
    return this;
  }

  /** 一時停止します。コマ位置は保持されます。 */
  pause(): this {
    this._manager.pauseSlot(this.slot);
    return this;
  }

  /** 一時停止を解除します。 */
  resume(): this {
    this._manager.resumeSlot(this.slot);
    return this;
  }

  /**
   * 再生を停止してスロットを解放します。ハンドル自身も無効になります。
   * 二重解放しても安全です。
   */
  stop(): this {
    if (this.slot !== SLOT_INVALID) {
      this._manager.stopSlot(this.slot);
      this.slot = SLOT_INVALID;
    }
    return this;
  }

  /**
   * 再生中なら停止し、そうでなければ何もしない。
   * `isPlaying` を確認してから `stop` する処理を 1 つにまとめます。
   */
  stopIfPlaying(): this {
    if (this.isPlaying) this.stop();
    return this;
  }
}
