/**
 * @file Path.ts
 * @description
 * Phaser 4 互換のパス（点列 + カーブの集合）。
 *
 * 設計上の掟 (IMPACT_SCOPE 8.1 の判定 C):
 * Phaser の `Path` は `curves: Curve[]` と `cachePoints: Point[]` を持ちます。
 * どちらも可変長配列で、点を読むたびに Point オブジェクトを生成します。
 * 本実装は 2 つとも **SoA** にします。
 *
 * - **点列**: `points: Float32Array` をコンストラクタで確保し、
 *   `cursor` で書き込み位置を管理します。`getPoint` / `getPoints` は
 *   既存の要素だけを参照するので、**読み取りでは new が起きません**。
 * - **カーブ列**: `curves: CurveInput[]` を `Float32Array` として持ちます。
 *   カーブ数の増加は `addCurve` のときだけ起こります。
 *
 * `writeCursor` 方式的优点:
 * `addPoint` は「末尾に追加」だけを行うため、既存の点インデックスが
 * 変わることはありません。確保済みのバッファを使い続けられます。
 */

import { type CurveInput, CurveKind, Curves } from './Curves';

/** 1 点あたり 2 要素。 */
export const PATH_POINT_STRIDE = 2;

export class Path {
  /** 点列のバッファ。`cursor / 2` が点の個数です。 */
  public points: Float32Array;
  /** 書き込み位置（要素単位）。`getPointCount()` は `cursor / 2` です。 */
  public cursor = 0;

  /** 所属カーブの点列（CurveInput の配列）。増加は `addCurve` のときだけです。 */
  public readonly curves: CurveInput[] = [];

  /**
   * @param maxPoints 点列の最大点数。超出時は `addPoint` が false を返します
   * @param maxCurves カーブの最大本数
   */
  constructor(maxPoints = 256, maxCurves = 32) {
    this.points = new Float32Array(maxPoints * PATH_POINT_STRIDE);
    this.maxCurves = maxCurves;
  }

  private readonly maxCurves: number;

  /** 点列の最大点数 */
  public get maxPoints(): number {
    return this.points.length / PATH_POINT_STRIDE;
  }

  /** 現在のパス上の点数 */
  public getPointCount(): number {
    return this.cursor / PATH_POINT_STRIDE;
  }

  /**
   * 末尾に点を 1 つ追加します。
   *
   * バッファが満杯の場合は何もせず false を返します（拡張しません）。
   * 拡張が要るなら `resize` を明示的に呼んでください。
   *
   * @returns 追加に成功したか
   */
  public addPoint(x: number, y: number): boolean {
    if (this.cursor + PATH_POINT_STRIDE > this.points.length) return false;
    this.points[this.cursor] = x;
    this.points[this.cursor + 1] = y;
    this.cursor += PATH_POINT_STRIDE;
    return true;
  }

  /**
   * 点列バッファを拡張します。既存の点は保たれます。
   *
   * @param newMaxPoints 新しい最大点数
   */
  public resize(newMaxPoints: number): void {
    if (newMaxPoints * PATH_POINT_STRIDE <= this.points.length) return;
    const next = new Float32Array(newMaxPoints * PATH_POINT_STRIDE);
    next.set(this.points);
    this.points = next;
  }

  /** 末尾の点を 1 つ取り除きます。 */
  public popPoint(): boolean {
    if (this.cursor < PATH_POINT_STRIDE) return false;
    this.cursor -= PATH_POINT_STRIDE;
    return true;
  }

  /** すべての点を消去します。バッファは再確保しません。 */
  public clearPoints(): void {
    this.cursor = 0;
  }

  /**
   * `index` 番目の点を `out` へ書き出します (Phaser 互換の `Path.getPoint`)。
   *
   * @param out 2 要素のバッファ
   * @returns 範囲外なら false
   */
  public getPoint(index: number, out: Float32Array): boolean {
    if (index < 0 || index >= this.getPointCount()) return false;
    const o = index * PATH_POINT_STRIDE;
    out[0] = this.points[o];
    out[1] = this.points[o + 1];
    return true;
  }

  /**
   * 点列を `out` へ展開します (Phaser 互換の `Path.getPoints`)。
   *
   * @returns 書き出した点数
   */
  public getPoints(out: Float32Array): number {
    const n = this.getPointCount();
    if (out.length < n * PATH_POINT_STRIDE) return 0;
    out.set(this.points.subarray(0, this.cursor));
    return n;
  }

  /**
   * 累積長を `out` へ書き出します (Phaser 互換の `Path.getLengths`)。
   *
   * @param divisions 分割数
   * @param out `divisions * 2` 要素のバッファ。[k*2] = x, [k*2+1] = y
   * @returns 書き出した点数
   */
  public getLengths(divisions: number, out: Float32Array): number {
    const n = Math.min(divisions, this.maxPoints);
    if (out.length < n * PATH_POINT_STRIDE) return 0;
    let px = 0;
    let py = 0;
    for (let i = 0; i < n; i++) {
      const o = i * PATH_POINT_STRIDE;
      const t = n === 1 ? 0 : i / (n - 1);
      if (i === 0) {
        this.getPoint(0, TMP);
        px = TMP[0];
        py = TMP[1];
      } else {
        const idx = Math.min(this.getPointCount() - 1, Math.round(t * (this.getPointCount() - 1)));
        this.getPoint(idx, TMP);
        px = TMP[0];
        py = TMP[1];
      }
      out[o] = px;
      out[o + 1] = py;
    }
    return n;
  }

  /**
   * カーブを 1 つ追加します (Phaser 互換の `Path.add`)。
   *
   * @returns 追加に成功したか（上限超過や制御点不足なら false）
   */
  public addCurve(points: ArrayLike<number>, kind: number): boolean {
    if (this.curves.length >= this.maxCurves) return false;
    const needed = Curves._requiredPoints(kind);
    if (points.length < needed * PATH_POINT_STRIDE) return false;
    this.curves.push({ kind: kind as CurveInput['kind'], points });
    return true;
  }

  /** 所属カーブの点（等間隔）を `out` へ展開します
   * (Phaser 互換の `Path.draw` / `getCurvePoints` のデータ供給側)。
   *
   * 全カーブの点を連結して 1 本の点列として書き出します。
   *
   * @param divisions カーブごとの分割数
   * @param out 書き込み先バッファ
   * @returns 書き出した点数
   */
  public getCurvePoints(divisions: number, out: Float32Array): number {
    let written = 0;
    for (let c = 0; c < this.curves.length; c++) {
      const n = divisions > 0 ? divisions : 32;
      if (out.length < (written + n) * PATH_POINT_STRIDE) break;
      for (let i = 0; i < n; i++) {
        Curves.getPoint(this.curves[c], i / (n - 1 || 1), TMP);
        const o = (written + i) * PATH_POINT_STRIDE;
        out[o] = TMP[0];
        out[o + 1] = TMP[1];
      }
      written += n;
    }
    return written;
  }

  /**
   * 線分を 1 本追加します (Phaser 互換の `Path.lineTo`)。
   *
   * 線分は 2 点の制御点を持つので、内部では CurveKind.Line として保持します。
   *
   * @returns 線分を追加できたか
   */
  public lineTo(x: number, y: number): boolean {
    if (this.getPointCount() === 0) {
      // 始点がなければ 0,0 を始点として使います
      this.addPoint(0, 0);
    }
    const last = (this.getPointCount() - 1) * PATH_POINT_STRIDE;
    const sx = this.points[last];
    const sy = this.points[last + 1];
    return this.addCurve(new Float32Array([sx, sy, x, y]), CurveKind.Line);
  }

  /**
   * カーブ 1 本を評価した点を点列へ展開します
   * (Phaser 互換の `Path.splice` の実体)。
   *
   * @returns 展開した点数
   */
  public splice(curveIndex: number, divisions: number): number {
    if (curveIndex < 0 || curveIndex >= this.curves.length) return 0;
    const n = divisions > 0 ? divisions : 32;
    let added = 0;
    for (let i = 0; i < n; i++) {
      Curves.getPoint(this.curves[curveIndex], i / (n - 1 || 1), TMP);
      if (this.addPoint(TMP[0], TMP[1])) added++;
    }
    return added;
  }
}

/** 内部計算用の使い回しバッファ。 */
const TMP = new Float32Array(2);
