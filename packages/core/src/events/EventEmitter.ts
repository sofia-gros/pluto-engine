/**
 * @file EventEmitter.ts
 * @description
 * シーン内イベントバス。
 *
 * emit は毎フレーム呼ばれる可能性があるため、
 * 引数オブジェクトの生成や配列の確保を一切行いません。
 * 引数は `emit` の引数としてそのまま渡し、コールバック側は同じ引数列を受け取ります。
 *
 * 登録・解除のたびに配列を作り直さず、削除は「空きスロット」方式で
 * deferred コンパクションを行います (emit 中の安全な走査を保証するため)。
 */

/** イベントリスナ。引数は emit 時の引数と一致します。 */
export type EventListener = (...args: any[]) => void;

/** emit 中も解除できるリスト。空きスロットは -1 で表します。 */
class ListenerList {
  public readonly fns: EventListener[] = [];
  /** -1 は空きスロット (削除済み) を表す番兵です。 */
  public readonly live: number[] = [];
  public count = 0;
  /** emit 中かどうか。解除は即時ではなくマークのみ行います。 */
  public emitting = 0;
  /** コンパクションが必要な場合の予約フラグ。 */
  public needsCompact = false;

  public push(fn: EventListener): void {
    this.fns.push(fn);
    this.live.push(1);
    this.count++;
  }

  /**
   * リスナを解除します。
   * emit 中はスイッチを落とすだけで、配列は縮めません。
   */
  public remove(fn: EventListener): boolean {
    if (this.emitting > 0) {
      for (let i = 0; i < this.fns.length; i++) {
        if (this.fns[i] === fn && this.live[i] === 1) {
          this.live[i] = 0;
          this.count--;
          this.needsCompact = true;
          return true;
        }
      }
      return false;
    }
    for (let i = 0; i < this.fns.length; i++) {
      if (this.fns[i] === fn && this.live[i] === 1) {
        this.fns[i] = EMPTY_FN;
        this.live[i] = 0;
        this.count--;
        this.compact();
        return true;
      }
    }
    return false;
  }

  public clear(): void {
    this.fns.length = 0;
    this.live.length = 0;
    this.count = 0;
    this.needsCompact = false;
  }

  /** 空きスロットを詰めます。emit 中は呼ばれません。 */
  public compact(): void {
    if (!this.needsCompact) return;
    let w = 0;
    for (let r = 0; r < this.fns.length; r++) {
      if (this.live[r] === 1) {
        this.fns[w] = this.fns[r];
        this.live[w] = 1;
        w++;
      }
    }
    this.fns.length = w;
    this.live.length = w;
    this.needsCompact = false;
  }
}

/** 削除済みスロットの埋番用ダミー関数。全スロットで同じ参照を使います。 */
const EMPTY_FN: EventListener = () => {};

export class EventEmitter {
  /** イベント名 -> リスナリスト。emit 中の新規追加は反映されません。 */
  private readonly _map = new Map<string, ListenerList>();

  /**
   * イベントを購読します。
   *
   * @returns 解除関数。`off(event, fn)` と同じ効果です。
   */
  public on(event: string, fn: EventListener): () => void {
    let list = this._map.get(event);
    if (list === undefined) {
      list = new ListenerList();
      this._map.set(event, list);
    }
    list.push(fn);
    return () => {
      this.off(event, fn);
    };
  }

  /**
   * 一度だけ発火する購読を登録します。
   */
  public once(event: string, fn: EventListener): () => void {
    const wrapper: EventListener = (...args: any[]) => {
      this.off(event, wrapper);
      fn(...args);
    };
    return this.on(event, wrapper);
  }

  /**
   * 購読を解除します。
   */
  public off(event: string, fn: EventListener): void {
    const list = this._map.get(event);
    if (list === undefined) return;
    list.remove(fn);
    if (list.count === 0 && list.emitting === 0) {
      this._map.delete(event);
    }
  }

  /**
   * イベントを発火します。
   *
   * - emit 中の `off` は即座に効きます。以降のリスナは呼ばれません。
   * - emit 中の `on` は次回 emit から有効です (スナップショット長で止めるため)。
   */
  public emit(event: string, ...args: any[]): void {
    const list = this._map.get(event);
    if (list === undefined || list.count === 0) return;
    list.emitting++;
    // 走査開始時の長さを固定します。emit 中の on() で配列が伸びても
    // そのリスナは今回呼ばれません。
    const fns = list.fns;
    const n = fns.length;
    for (let i = 0; i < n; i++) {
      // live は emit 中の off で 0 になり得るので、都度確認します。
      if (list.live[i] === 1) {
        fns[i](...args);
      }
    }
    list.emitting--;
    if (list.emitting === 0) {
      list.compact();
      if (list.count === 0) this._map.delete(event);
    }
  }

  /**
   * 登録済みリスナ数を返します。
   */
  public listenerCount(event: string): number {
    const list = this._map.get(event);
    return list === undefined ? 0 : list.count;
  }

  /**
   * イベント名を列挙します (プロファイラ・テスト用)。
   */
  public eventNames(): string[] {
    return Array.from(this._map.keys());
  }

  /**
   * すべての購読を破棄します。
   */
  public removeAllListeners(): void {
    this._map.clear();
  }
}
