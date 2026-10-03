/**
 * @file Group.ts
 * @description
 * Phaser 4 互換のグループ。
 *
 * 設計上の判断 (IMPACT_SCOPE 3.2 の判定 D):
 * Group は **SoA 化しません**。可変長の子リストは SoA の得意分野ではなく、
 * 使い回し `Array` で実装し、**Pluto のアリーナは汚しません**
 * (Group は「CPU 管理のビュー」として arena と並行して持ちます)。
 *
 *
 * 所属数组は呼び出し側が渡す `out` を使い回すのが前提です。
 * 毎フレーム `getChildren()` を呼ぶと new が発生するため、
 * ホットパスでは `forEachInto()` を使ってください。
 */

export class Group {
  /** 所属スプライトの配列。追加・削除のたびに詰め替えます。 */
  private readonly _items: unknown[] = [];
  private _alive = true;
  private _visible = true;
  /**
   * 追加時に呼ばれるフック (null = 何もしない)。
   * `physics.add.staticGroup` が immovable を立てるために使います。
   */
  private _onAdd: ((item: unknown) => void) | null = null;

  /**
   * 所属スプライトを追加します。
   *
   * すでに所属している場合は何もしません (Phaser と同一)。
   * @returns 追加されたか
   */
  public add<T>(item: T): boolean {
    if (!this._alive) return false;
    for (let i = 0; i < this._items.length; i++) {
      if (this._items[i] === item) return false;
    }
    this._items.push(item);
    this._onAdd?.(item);
    return true;
  }

  /**
   * 追加時に呼ぶフックを登録します。
   * `physics.add.staticGroup` の immovable 実効化用です。
   */
  public setOnAddHook(hook: ((item: unknown) => void) | null): this {
    this._onAdd = hook;
    return this;
  }

  /**
   * 複数のスプライトをまとめて追加します。
   * @returns 実際に追加された数
   */
  public addMultiple<T>(items: T[]): number {
    let n = 0;
    for (let i = 0; i < items.length; i++) {
      if (this.add(items[i])) n++;
    }
    return n;
  }

  /**
   * スプライトをグループから外します。
   * @returns 所属していたか
   */
  public remove<T>(item: T): boolean {
    const idx = this._items.indexOf(item);
    if (idx < 0) return false;
    // 末尾で上書きして length を縮めます (pop より最後の添字が小さい場合が多い)
    const last = this._items.length - 1;
    this._items[idx] = this._items[last];
    this._items.pop();
    return true;
  }

  /** グループ内のすべてのスプライトを外します。 */
  public removeAll(): void {
    this._items.length = 0;
  }

  /**
   * インデックスでスプライトを取得します (Phaser 互換の `getAt`)。
   * @returns 範囲外なら null
   */
  public getAt<T>(index: number): T | null {
    if (index < 0 || index >= this._items.length) return null;
    return this._items[index] as T;
  }

  /**
   * 所属スプライトを `out` バッファに展開します (Phaser 互換の `getAll`)。
   *
   * @param out 呼び出し側の使い回し配列
   * @returns 展開した要素数
   */
  public getAll<T>(out: T[]): number {
    const n = this._items.length;
    for (let i = 0; i < n; i++) out[i] = this._items[i] as T;
    return n;
  }

  /**
   * 所属数を返します (Phaser 互換の `getLength` / `length`)。
   */
  public getLength(): number {
    return this._items.length;
  }

  /** 所属数 (`length` の別名) */
  public get length(): number {
    return this._items.length;
  }

  /** 所属スプライトの中に含まれるか (Phaser 互換の `contains`) */
  public contains(item: unknown): boolean {
    return this._items.indexOf(item) >= 0;
  }

  /** グループ内の先頭スプライト (空なら null) */
  public getFirst<T>(): T | null {
    return this._items.length > 0 ? (this._items[0] as T) : null;
  }

  /** グループ内の末尾スプライト (空なら null) */
  public getLast<T>(): T | null {
    const n = this._items.length;
    return n > 0 ? (this._items[n - 1] as T) : null;
  }

  /**
   * 所属スプライトを 1 個ずつ走査します。
   * コールバック配列を new せずに forEach を呼ぶ経路です。
   *
   * 走査中に remove すると添字がずれるため、
   * その場合は `getAll()` でバッファへ退避してから処理してください。
   */
  public forEach<T>(callback: (item: T, index: number) => void): void {
    const n = this._items.length;
    for (let i = 0; i < n; i++) callback(this._items[i] as T, i);
  }

  /**
   * `out` バッファを展開してから走査します。
   * 走査中の追加・削除があっても安全に動きます。
   */
  public forEachInto<T>(out: T[], callback: (item: T, index: number) => void): number {
    const n = this.getAll(out);
    for (let i = 0; i < n; i++) callback(out[i], i);
    return n;
  }

  /**
   * グループが生きているか (更新・操作の対象にするか)。
   * Phaser の `Group.runChildUpdate` に対応します。
   */
  public get alive(): boolean {
    return this._alive;
  }

  public set alive(v: boolean) {
    this._alive = v;
  }

  /**
   * グループMembersの表示状態。
   * Group 自体は描画しません (Phaser 互換の stub)。
   */
  public get visible(): boolean {
    return this._visible;
  }

  public set visible(v: boolean) {
    this._visible = v;
  }

  /**
   * グループ_members に対して callback を適用します (Phaser 互換の `runChildUpdate`)。
   * alive が false の場合は何もしません。
   */
  public runChildUpdate<T>(callback: (item: T) => void): void {
    if (!this._alive) return;
    this.forEach<T>(callback);
  }
}
