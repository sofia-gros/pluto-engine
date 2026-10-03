/**
 * @file DataRegistry.ts
 * @description
 * 全シーン共有のグローバルデータストア。
 *
 * 設計方針:
 *  - 値の取得は `Map.get` 1 回で済み、毎フレームの走査が起きません。
 *  - 数値の高頻度アクセス用に、任意のキーへ倍精度配列を遅延確保できます。
 *    `getFloat(key)` は初回アクセス時に `Float64Array` を生成し、
 *    以降は添字 1 回の参照だけになります (毎回の文字列探索なし)。
 */

export class DataRegistry {
  /** 名前空間ごとの Map。名前空間文字列で 1 段だけ分割します。 */
  private readonly _namespaces = new Map<string, Map<string, unknown>>();

  /** 高速数値ストア。名前空間ごとに確保します。 */
  private readonly _floatStore = new Map<string, Float64Array>();
  private readonly _floatIndex = new Map<string, Map<string, number>>();
  private readonly _floatCount = new Map<string, number>();

  /**
   * 名前空間と float スロットの対応表。保存やデバッグ出力にだけ使います。
   */
  private readonly _keysByNamespace = new Map<string, string[]>();

  /**
   * 名前空間を取得します。存在しなければ作ります。
   *
   * @param ns 名前空間名。`''` は既定の名前空間です。
   */
  public ns(ns = ''): Map<string, unknown> {
    let m = this._namespaces.get(ns);
    if (m === undefined) {
      m = new Map();
      this._namespaces.set(ns, m);
    }
    return m;
  }

  /**
   * 値を保存します。
   */
  public set(ns: string, key: string, value: unknown): void {
    this.ns(ns).set(key, value);
  }

  /**
   * 値を取得します。未登録なら `fallback` を返します。
   */
  public get<T>(ns: string, key: string, fallback: T): T {
    const m = this._namespaces.get(ns);
    if (m === undefined) return fallback;
    const v = m.get(key);
    return v === undefined ? fallback : (v as T);
  }

  /**
   * 値が存在するか確認します。
   */
  public has(ns: string, key: string): boolean {
    const m = this._namespaces.get(ns);
    return m?.has(key) ?? false;
  }

  /**
   * 値を削除します。
   */
  public remove(ns: string, key: string): boolean {
    const m = this._namespaces.get(ns);
    if (m === undefined) return false;
    return m.delete(key);
  }

  /**
   * 名前空間ごと破棄します。
   */
  public clear(ns?: string): void {
    if (ns === undefined) {
      this._namespaces.clear();
      this._floatStore.clear();
      this._floatIndex.clear();
      this._floatCount.clear();
      this._keysByNamespace.clear();
      return;
    }
    this._namespaces.delete(ns);
    this._floatStore.delete(ns);
    this._floatIndex.delete(ns);
    this._floatCount.delete(ns);
    this._keysByNamespace.delete(ns);
  }

  /**
   * 名前空間内のキーを列挙します (プロファイラ・保存用)。
   */
  public keys(ns: string): string[] {
    const m = this._namespaces.get(ns);
    return m === undefined ? [] : Array.from(m.keys());
  }

  // --- High-speed numeric store ---

  /**
   * Returns the number of float slots currently allocated.
   */
  public floatCount(ns: string): number {
    return this._floatCount.get(ns) ?? 0;
  }

  /**
   * float スロットへのキー割り当て番号を返します。登録済みの場合はそれを返し、
   * 未登録なら新規に割り当てます。
   */
  private floatSlot(ns: string, key: string): number {
    let index = this._floatIndex.get(ns);
    if (index === undefined) {
      index = new Map();
      this._floatIndex.set(ns, index);
      // 32 スロットから始め、倍々に増やします。
      this._floatStore.set(ns, new Float64Array(32));
      this._floatCount.set(ns, 0);
    }
    const existing = index.get(key);
    if (existing !== undefined) return existing;

    const count = this._floatCount.get(ns) ?? 0;
    let store = this._floatStore.get(ns);
    if (store === undefined || count >= store.length) {
      const grown = new Float64Array((store?.length ?? 32) * 2);
      if (store !== undefined) grown.set(store);
      this._floatStore.set(ns, grown);
      store = grown;
    }
    index.set(key, count);
    this._floatCount.set(ns, count + 1);

    let keys = this._keysByNamespace.get(ns);
    if (keys === undefined) {
      keys = [];
      this._keysByNamespace.set(ns, keys);
    }
    keys.push(key);
    return count;
  }

  /**
   * 数値を取得します。未登録の場合は 0 を返します。
   *
   * 2 回目以降の呼び出しは `Map.get` + 配列参照のみで完結します。
   */
  public getFloat(ns: string, key: string): number {
    const index = this._floatIndex.get(ns);
    if (index === undefined) return 0;
    const slot = index.get(key);
    if (slot === undefined) return 0;
    return this._floatStore.get(ns)?.[slot] ?? 0;
  }

  /**
   * 数値を設定します。初回アクセス時にスロットを確保します。
   */
  public setFloat(ns: string, key: string, value: number): void {
    const slot = this.floatSlot(ns, key);
    this._floatStore.get(ns)![slot] = value;
  }

  /**
   * 数値に加算します。未登録のキーは 0 として扱います。
   */
  public addFloat(ns: string, key: string, delta: number): number {
    const slot = this.floatSlot(ns, key);
    const store = this._floatStore.get(ns)!;
    const next = store[slot] + delta;
    store[slot] = next;
    return next;
  }

  /**
   * float スロットのキー順を返します (デバッグ・セーブ用)。
   */
  public floatKeys(ns: string): readonly string[] {
    return this._keysByNamespace.get(ns) ?? [];
  }

  /**
   * float ストアを JSON 化可能なオブジェクトへ変換します。
   */
  public floatSnapshot(ns: string): Record<string, number> {
    const store = this._floatStore.get(ns);
    const keys = this._keysByNamespace.get(ns);
    const out: Record<string, number> = {};
    if (store === undefined || keys === undefined) return out;
    for (let i = 0; i < keys.length; i++) {
      out[keys[i]] = store[i];
    }
    return out;
  }
}
