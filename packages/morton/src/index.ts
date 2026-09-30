/**
 * @file index.ts
 * @description
 * 2D Morton 符号化 (Z-Order Curve) によるゼロアロケーション空間ハッシュ。
 *
 * 設計方針:
 *  - エンティティは LSD Radix Sort で Morton コード順に並べます。
 *    これにより Z-Order 曲線上の空間局所性が実際に現れ、
 *    近傍Probe のメモリアクセスが連続領域に収まります。
 *  - セル参照はハッシュテーブルではなく、ソート済みコード列の
 *    二分探索で行います。桶を全走査しないため build() が O(n) に収まります。
 *  - update / build / query のいずれのループでも new しません。
 */

/**
 * 16 bit 整数の各ビットの間に 0 を 1 つ挿入して 32 bit へ拡張します。
 */
function expandBits(v: number): number {
  v = (v | (v << 8)) & 0x00ff00ff;
  v = (v | (v << 4)) & 0x000f0f0f;
  v = (v | (v << 2)) & 0x03333333;
  v = (v | (v << 1)) & 0x55555555;
  return v >>> 0;
}

/**
 * 2D 座標を 32 bit の Morton コードへ変換します。
 * x と y は 16 bit 整数 (0 〜 65535) である必要があります。
 */
export function encodeMorton2D(x: number, y: number): number {
  return (expandBits(x) | (expandBits(y) << 1)) >>> 0;
}

/** 座標のバイアス値。負の座標を 16 bit の正の値へ折り返します。 */
const COORD_BIAS = 32768;

export class MortonSpatialHash {
  private readonly cellSize: number;
  private readonly maxEntities: number;

  /** 追加順の ID とコード */
  private readonly entityIds: Uint32Array;
  private readonly entityCodes: Uint32Array;

  /** Radix Sort の作業領域 (コンストラクタで確保し使い回す) */
  private readonly tmpIds: Uint32Array;
  private readonly tmpCodes: Uint32Array;
  private readonly radixCounts = new Uint32Array(256);

  /** Z-Order 順に並んだ ID と、そのソート済みコード列 */
  private readonly sortedIds: Uint32Array;
  private readonly sortedCodes: Uint32Array;

  private count = 0;

  /**
   * @param maxEntities 追加できる最大エンティティ数
   * @param cellSize セルの辺長 (ワールド単位)
   */
  constructor(maxEntities: number, cellSize: number) {
    if (maxEntities <= 0) throw new Error('maxEntities must be positive');
    if (cellSize <= 0) throw new Error('cellSize must be positive');

    this.cellSize = cellSize;
    this.maxEntities = maxEntities;

    this.entityIds = new Uint32Array(maxEntities);
    this.entityCodes = new Uint32Array(maxEntities);
    this.tmpIds = new Uint32Array(maxEntities);
    this.tmpCodes = new Uint32Array(maxEntities);
    this.sortedIds = new Uint32Array(maxEntities);
    this.sortedCodes = new Uint32Array(maxEntities);
  }

  public clear(): void {
    this.count = 0;
  }

  public get entityCount(): number {
    return this.count;
  }

  public get size(): number {
    return this.cellSize;
  }

  /**
   * エンティティを追加します。容量超過時は黙って無視します。
   */
  public addEntity(id: number, x: number, y: number): void {
    if (this.count >= this.maxEntities) return;

    const cx = (Math.floor(x / this.cellSize) + COORD_BIAS) & 0xffff;
    const cy = (Math.floor(y / this.cellSize) + COORD_BIAS) & 0xffff;

    this.entityIds[this.count] = id;
    this.entityCodes[this.count] = encodeMorton2D(cx, cy);
    this.count++;
  }

  /**
   * 追加済みのエンティティを Morton コード順に Radix Sort します。
   * 32 bit コードを 8 bit ずつ 4 パスで安定的に並べます。
   * 計算量は O(4n) で、桶の全走査は一切行いません。
   */
  public build(): void {
    const n = this.count;
    if (n === 0) return;

    // 0 パス目: 入力配列は追加順、書き込み先は tmp
    let srcIds = this.entityIds;
    let srcCodes = this.entityCodes;
    let dstIds = this.tmpIds;
    let dstCodes = this.tmpCodes;

    for (let shift = 0; shift < 32; shift += 8) {
      const counts = this.radixCounts;
      counts.fill(0);

      for (let i = 0; i < n; i++) {
        counts[(srcCodes[i] >>> shift) & 0xff]++;
      }

      // 累積和で開始位置を作る
      let sum = 0;
      for (let b = 0; b < 256; b++) {
        const c = counts[b];
        counts[b] = sum;
        sum += c;
      }

      // 安定散布
      for (let i = 0; i < n; i++) {
        const code = srcCodes[i];
        const dest = counts[(code >>> shift) & 0xff]++;
        dstIds[dest] = srcIds[i];
        dstCodes[dest] = code;
      }

      // 参照を入れ替えて次のパスへ
      const tIds = srcIds;
      srcIds = dstIds;
      dstIds = tIds;
      const tCodes = srcCodes;
      srcCodes = dstCodes;
      dstCodes = tCodes;
    }

    // 4 パスなので src は追加順の配列へ戻ります。最终結果を sorted へ転記します。
    for (let i = 0; i < n; i++) {
      this.sortedIds[i] = srcIds[i];
      this.sortedCodes[i] = srcCodes[i];
    }
  }

  /**
   * ソート済みコード列から、code 以上の最初の位置を二分探索します。
   * @returns 範囲の開始位置。存在しなければ count 以上になります
   */
  private lowerBound(code: number): number {
    let lo = 0;
    let hi = this.count;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (this.sortedCodes[mid] < code) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  /**
   * 指定セル内のエンティティ ID を outArray へ追記します。
   * 同一コードの連続区間が Z-Order 上の連続区間になるため、走査は連続アクセスになります。
   * @returns 追記した件数
   */
  private queryCell(cx: number, cy: number, outArray: Uint32Array, outCount: number): number {
    const code = encodeMorton2D(cx, cy);
    const start = this.lowerBound(code);
    let n = outCount;
    for (let i = start; i < this.count; i++) {
      // コードが変わった時点でこのセルの区間終わり
      if (this.sortedCodes[i] !== code) break;
      if (n < outArray.length) {
        outArray[n++] = this.sortedIds[i];
      }
    }
    return n;
  }

  /**
   * 指定位置の近傍セル内のエンティティ ID を outArray へ書き込み、件数を返します。
   * 厳密な距離判定 (ブロードフェーズ) は呼び出し側の責務です。
   * 半径が 1 セル以内なら二分探索 1 回で済み、セル走査は起こりません。
   * @param outArray 呼び出し側が確保した書き込み先。実行中は new しません
   */
  public query(x: number, y: number, radius: number, outArray: Uint32Array): number {
    if (this.count === 0) return 0;

    const cs = this.cellSize;
    const minX = (Math.floor((x - radius) / cs) + COORD_BIAS) & 0xffff;
    const minY = (Math.floor((y - radius) / cs) + COORD_BIAS) & 0xffff;
    const maxX = (Math.floor((x + radius) / cs) + COORD_BIAS) & 0xffff;
    const maxY = (Math.floor((y + radius) / cs) + COORD_BIAS) & 0xffff;

    let outCount = 0;
    for (let cy = minY; cy <= maxY; cy++) {
      for (let cx = minX; cx <= maxX; cx++) {
        outCount = this.queryCell(cx, cy, outArray, outCount);
        if (outCount >= outArray.length) return outCount;
      }
    }
    return outCount;
  }
}

export * from './MortonPlugin';
