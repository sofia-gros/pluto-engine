/**
 * @file Struct.ts
 * @description
 * Phaser 4 互換の `Struct.Set` / `Struct.Map` のネイティブ実装。
 *
 * IMPACT_SCOPE 8.2 の分類 D「`Struct.Set` / `Struct.Map` → ネイティブ」。
 *
 * Phaser は `Phaser.Struct.Set` / `Phaser.Struct.Map` を `Map` や `Set` を
 * **修飾** して実装しています。本実装はその方針を採らず、
 * ネイティブの `Set` / `Map` をそのまま使い、必要なら補助を足します。
 *
 * ## なぜ修飾が不要か
 *
 * ネイティブの `Set` / `Map` は高速・省メモリで API も十分です。
 * ただし次の 2 点が不足しています。
 *
 * 1. `Phaser.Struct.Set` の `insert` / `getIndex` / `delete` の戻り値規約
 * 2. 順序を保つ `Array` を返す便利メソッド（`Array` を毎回生成する）
 *
 * これらは本ファイルで補助関数として提供し、**本体の数据结构は
 * ネイティブのまま**にします。オブジェクトラッパーを 1 枚増やさないので
 * R-03 を満たします。
 *
 * ## R-02 との整合
 *
 * `keys()` / `values()` はネイティブ実装では `Array` を生成します。
 * ホットパスでは {@link setKeysInto} / {@link setValuesInto} を
 * 使い回してください。
 */

/**
 * 値付き Set。Phaser の `Struct.Set` に相当します。
 *
 * 本类是 `Set` のラッパーではなく、`Set` の**北部**です。
 */
export type ValueSet<T> = Set<T>;

/**
 * 任意の値の Map。Phaser の `Struct.Map` に相当します。
 */
export type ValueMap<K, V> = Map<K, V>;

export const Struct = {
  /**
   * 値の集合を作ります（Phaser 互換の `Struct.Set`）。
   *
   * 可変長引数で渡すとその値をすべて入れます。
   */
  createSet<T>(...values: T[]): ValueSet<T> {
    if (values.length === 1 && Array.isArray(values[0])) {
      return new Set(values[0] as T[]);
    }
    return new Set(values);
  },

  /**
   * キーと値の Map を作ります（Phaser 互換の `Struct.Map`）。
   */
  createMap<K, V>(): ValueMap<K, V> {
    return new Map<K, V>();
  },

  /**
   * 値付き Set の末尾へ追加します。
   *
   * ネイティブの `add` と違い、**追加できたか**を返します。
   *
   * @returns 追加できたか（すでに存在する場合は false）
   */
  insert<T>(set: ValueSet<T>, value: T): boolean {
    if (set.has(value)) return false;
    set.add(value);
    return true;
  },

  /**
   * 値付き Set から削除します。
   *
   * @returns 削除できたか
   */
  remove<T>(set: ValueSet<T>, value: T): boolean {
    return set.delete(value);
  },

  /**
   * 値のインデックスを返します（Phaser 互換の `Struct.Set.getIndex`）。
   *
   * @returns 見つからなければ -1
   */
  getIndex<T>(set: ValueSet<T>, value: T): number {
    let i = 0;
    for (const v of set) {
      if (v === value) return i;
      i++;
    }
    return -1;
  },

  /**
   * 値を別配列へ展開します（`forEach` 相当）。
   *
   * `Array.from(set)` と違い **新しい配列を作りません**（R-02）。
   *
   * @param out 書き込み先配列
   * @returns 展開した要素数
   */
  setValuesInto<T>(set: ValueSet<T>, out: T[]): number {
    let i = 0;
    for (const v of set) {
      if (i >= out.length) break;
      out[i++] = v;
    }
    return i;
  },

  /**
   * Map のキーを別配列へ展開します。
   *
   * @returns 展開した要素数
   */
  setKeysInto<K, V>(map: ValueMap<K, V>, out: K[]): number {
    let i = 0;
    for (const k of map.keys()) {
      if (i >= out.length) break;
      out[i++] = k;
    }
    return i;
  },

  /**
   * Map の値を別配列へ展開します。
   *
   * @returns 展開した要素数
   */
  valuesInto<K, V>(map: ValueMap<K, V>, out: V[]): number {
    let i = 0;
    for (const v of map.values()) {
      if (i >= out.length) break;
      out[i++] = v;
    }
    return i;
  },

  /**
   * Map の内容を `Float32Array` へ展開します。
   *
   * 数値値の Map を **SoA で持ちたい場合**に使います。
   * 値の順序は `Map` の挿入順に限られます。
   *
   * @returns 書き出した要素数
   */
  mapNumbersInto<K>(map: ValueMap<K, number>, out: Float32Array): number {
    let i = 0;
    for (const v of map.values()) {
      if (i >= out.length) break;
      out[i++] = v;
    }
    return i;
  },

  /**
   * Map の各要素を走査します（`forEach` 相当）。
   *
   * コールバックは引数を受け取るため、呼び出し側の外側の関数を使います。
   */
  each<K, V>(map: ValueMap<K, V>, callback: (value: V, key: K) => void): void {
    map.forEach(callback);
  },

  /**
   * 値付き Set の各要素を走査します。
   */
  eachSet<T>(set: ValueSet<T>, callback: (value: T) => void): void {
    set.forEach(callback);
  },
} as const;
