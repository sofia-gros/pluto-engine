/**
 * @file Geom.ts
 * @description
 * Phaser 4 互換の幾何ユーティリティ群。**すべて `out` パラメータ必須**。
 *
 * 設計上の掟 (IMPACT_SCOPE 8.2 の判定 C「オブジェクト生成禁止」):
 * Phaser の `Phaser.Geom.*` は `new Rectangle()` / `new Circle()` を返します。
 * 本実装は **オブジェクトを一切生成しません**。結果は呼び出し側が
 * 用意した `Float32Array` へ書き込みます（R-02 / R-03）。
 *
 * ## `out` の内容
 *
 * | 関数 | 必要な要素数 | 内容 |
 * | --- | --- | --- |
 * | `RectangleToPoints` | 4 | `x, y, width, height` |
 * | `CircleToPoints` | 4 | `x, y, radius, 0`（円は stride 3 ではなく 4 で統一） |
 * | `TriangleToPoints` | 6 | `x1, y1, x2, y2, x3, y3` |
 * | `GetTriangleAngles` | 3 | `angleA, angleB, angleC`（ラジアン） |
 * | `LineToPoints` | 4 | `x1, y1, x2, y2` |
 * | `PolygonToPoints` | 2n | `[x0, y0, x1, y1, ...]` |
 * | `Interpolate` | 2 | 補間結果の x, y |
 * | `GetCentroid` | 2 | 重心の x, y |
 * | `GetBounds` | 4 | `minX, minY, maxX, maxY` |
 *
 * 矩形・円・三角形は **1 図形あたり固定 stride の SoA asel** で表せます。
 * 配列の横断走査に関する `Geom` 関数はこの配置を前提に走査します。
 */

import type { Vec2Like } from './Vector2';

/** 矩形。`x, y, width, height` */
export const RECT_STRIDE = 4;
/** 円。`x, y, radius` */
export const CIRCLE_STRIDE = 3;
/** 三角形。`x1, y1, x2, y2, x3, y3` */
export const TRIANGLE_STRIDE = 6;
/** 多角形。1 頂点あたり 2 要素 */
export const POLYGON_VERTEX_STRIDE = 2;

export const Geom = {
  // ============================================================
  // 生成
  // ============================================================

  /** 矩形を `out` へ書き出します。 */
  RectangleToPoints(x: number, y: number, width: number, height: number, out: Float32Array) {
    out[0] = x;
    out[1] = y;
    out[2] = width;
    out[3] = height;
    return out;
  },

  /** 楕円を `out` へ書き出します（`x, y, radiusX, radiusY`）。 */
  EllipseToPoints(x: number, y: number, radiusX: number, radiusY: number, out: Float32Array) {
    out[0] = x;
    out[1] = y;
    out[2] = radiusX;
    out[3] = radiusY;
    return out;
  },

  /** 線を `out` へ書き出します（`x1, y1, x2, y2`）。 */
  LineToPoints(x1: number, y1: number, x2: number, y2: number, out: Float32Array) {
    out[0] = x1;
    out[1] = y1;
    out[2] = x2;
    out[3] = y2;
    return out;
  },

  /** 三角形を `out` へ書き出します（`x1, y1, x2, y2, x3, y3`）。 */
  TriangleToPoints(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    out: Float32Array,
  ) {
    out[0] = x1;
    out[1] = y1;
    out[2] = x2;
    out[3] = y2;
    out[4] = x3;
    out[5] = y3;
    return out;
  },

  /**
   * 多角形を `out` へ展開します。
   *
   * @param vertices フラットな頂点列 `[x0, y0, x1, y1, ...]`
   * @param close 終端に始点を追加するか（`closePoints` 相当）
   * @returns 書き出した要素数
   */
  PolygonToPoints(vertices: Vec2Like, close: boolean, out: Float32Array): number {
    const n = vertices.length;
    if (out.length < n) return 0;
    for (let i = 0; i < n; i++) out[i] = vertices[i];
    if (!close) return n;
    if (out.length < n + 2) return n;
    out[n] = vertices[0];
    out[n + 1] = vertices[1];
    return n + 2;
  },

  /**
   * 菱形を `out` へ書き出します（`x, y, halfWidth, halfHeight`）。
   *
   * 上下と左右が同じ半径の Rhombus は、実質的に 45 度回転した矩形です。
   */
  RhombusToPoints(x: number, y: number, halfWidth: number, halfHeight: number, out: Float32Array) {
    out[0] = x;
    out[1] = y;
    out[2] = halfWidth;
    out[3] = halfHeight;
    return out;
  },

  /**
   * 六角形を `out` へ書き出します。
   *
   * 頂点は 6 点（12 要素）を正六角形として配置します。
   * 半径は外接円半径です。
   */
  HexagonToPoints(x: number, y: number, radius: number, out: Float32Array): number {
    if (out.length < 12) return 0;
    for (let i = 0; i < 6; i++) {
      const th = (Math.PI / 3) * i;
      out[i * 2] = x + Math.cos(th) * radius;
      out[i * 2 + 1] = y + Math.sin(th) * radius;
    }
    return 12;
  },

  // ============================================================
  // 測量
  // ============================================================

  /** 矩形の幅を返します。 */
  RectangleWidth(r: Vec2Like): number {
    return r[2];
  },

  /** 矩形の高さを返します。 */
  RectangleHeight(r: Vec2Like): number {
    return r[3];
  },

  /** 矩形の面積を返します。 */
  RectangleArea(r: Vec2Like): number {
    return r[2] * r[3];
  },

  /** 矩形の外周の長さを返します。 */
  RectanglePerimeter(r: Vec2Like): number {
    return 2 * (r[2] + r[3]);
  },

  /** 矩形が点を含むかを返します。 */
  RectangleContains(r: Vec2Like, x: number, y: number): boolean {
    return x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3];
  },

  /** 円の面積を返します。 */
  CircleArea(c: Vec2Like): number {
    return Math.PI * c[2] * c[2];
  },

  /** 円が点を含むかを返します。 */
  CircleContains(c: Vec2Like, x: number, y: number): boolean {
    const dx = x - c[0];
    const dy = y - c[1];
    return dx * dx + dy * dy <= c[2] * c[2];
  },

  /**
   * 三角形の 3 頂点の角度を `out` へ書き出します
   * (Phaser 互換の `Triangle.GetAngles`)。
   *
   * 3 頂点の角度の和は π になります。
   */
  GetTriangleAngles(t: Vec2Like, out: Float32Array): Float32Array {
    const a = Geom._angleAt(t[0], t[1], t[2], t[3], t[4], t[5]);
    const b = Geom._angleAt(t[2], t[3], t[4], t[5], t[0], t[1]);
    const c = Math.PI - a - b;
    out[0] = a;
    out[1] = b;
    out[2] = c;
    return out;
  },

  /** 三角形の面積を返します。 */
  TriangleArea(t: Vec2Like): number {
    const d = (t[2] - t[0]) * (t[5] - t[1]) - (t[4] - t[0]) * (t[3] - t[1]);
    return Math.abs(d) * 0.5;
  },

  /**
   * 多角形の面積を返します（靴ひも公式）。
   *
   * @param vertices フラットな頂点列
   */
  PolygonArea(vertices: Vec2Like): number {
    const n = vertices.length;
    if (n < 6) return 0;
    let sum = 0;
    for (let i = 0; i < n; i += 2) {
      const j = (i + 2) % n;
      sum += vertices[i] * vertices[j + 1] - vertices[j] * vertices[i + 1];
    }
    return Math.abs(sum) * 0.5;
  },

  /**
   * 点群の重心を `out` へ書き出します。
   *
   * 面積の重み付きなら多角形でも面積重心を返しますが、
   * 本実装は Phaser と同じく**頂点の平均**を返します。
   */
  GetCentroid(points: Vec2Like, out: Float32Array): number {
    const n = points.length;
    if (n < 2) return 0;
    const count = n >> 1;
    let sx = 0;
    let sy = 0;
    for (let i = 0; i < n; i += 2) {
      sx += points[i];
      sy += points[i + 1];
    }
    out[0] = sx / count;
    out[1] = sy / count;
    return count;
  },

  /**
   * 点群を包む矩形を `out` へ書き出します
   * (Phaser 互換の `Geom.GetBounds`)。
   *
   * @param out 4 要素。`minX, minY, maxX, maxY`
   * @returns 書き出した点数
   */
  GetBounds(points: Vec2Like, out: Float32Array): number {
    const n = points.length;
    if (n < 2) return 0;
    let minX = points[0];
    let minY = points[1];
    let maxX = points[0];
    let maxY = points[1];
    for (let i = 2; i < n; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    out[0] = minX;
    out[1] = minY;
    out[2] = maxX;
    out[3] = maxY;
    return n >> 1;
  },

  // ============================================================
  // 補間
  // ============================================================

  /**
   * 2 点を指定量だけ `out` へ補間します
   * (Phaser 互換の `Geom.Interpolate`)。
   *
   * @param quantity 補間係数
   */
  Interpolate(a: Vec2Like, b: Vec2Like, quantity: number, out: Float32Array): Float32Array {
    out[0] = a[0] + (b[0] - a[0]) * quantity;
    out[1] = a[1] + (b[1] - a[1]) * quantity;
    return out;
  },

  // ============================================================
  // SoA 走査
  // ============================================================

  /**
   * SoA 図形群と点の重なりを走査します。
   *
   * 図形群の stride で種別を決めます。
   * `out` には交差した図形インデックスを詰めていきます。
   *
   * @param out `Int32Array`。足りなければ `cap` 個で打ち切ります
   * @returns 交差した図形の数
   */
  OverlapPoint(
    x: number,
    y: number,
    shapes: ArrayLike<number>,
    stride: number,
    out: Int32Array,
  ): number {
    const n = Math.floor(shapes.length / stride);
    let w = 0;
    for (let i = 0; i < n; i++) {
      const o = i * stride;
      let hit = false;
      if (stride === RECT_STRIDE) {
        // オブジェクトを生成せずに直接判定します（R-02）
        const rx = shapes[o];
        const ry = shapes[o + 1];
        hit = x >= rx && x <= rx + shapes[o + 2] && y >= ry && y <= ry + shapes[o + 3];
      } else if (stride === CIRCLE_STRIDE) {
        const dx = x - shapes[o];
        const dy = y - shapes[o + 1];
        const r = shapes[o + 2];
        hit = dx * dx + dy * dy <= r * r;
      } else if (stride === TRIANGLE_STRIDE) {
        hit = Geom._pointInTriangle(
          x,
          y,
          shapes[o],
          shapes[o + 1],
          shapes[o + 2],
          shapes[o + 3],
          shapes[o + 4],
          shapes[o + 5],
        );
      }
      if (!hit) continue;
      if (w >= out.length) return w;
      out[w++] = i;
    }
    return w;
  },

  /**
   * 頂点 `px, py` から頂点 `ax, ay` を見た 3 頂点の角度を求めます。
   */
  _angleAt(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
    const a1x = ax - px;
    const a1y = ay - py;
    const a2x = bx - px;
    const a2y = by - py;
    const dot = a1x * a2x + a1y * a2y;
    const la = Math.sqrt(a1x * a1x + a1y * a1y);
    const lb = Math.sqrt(a2x * a2x + a2y * a2y);
    if (la === 0 || lb === 0) return 0;
    // 浮動小数点の誤差で acos の定義域を外れるためクランプします
    return Math.acos(Math.min(1, Math.max(-1, dot / (la * lb))));
  },

  /**
   * 点が三角形の内側かを判定します。
   *
   * 符号付き面積の符号で判定します（法線の向きに依存しません）。
   */
  _pointInTriangle(
    px: number,
    py: number,
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number,
  ): boolean {
    const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
    const d2 = (px - cx) * (by - cy) - (bx - cx) * (py - cy);
    const d3 = (px - ax) * (cy - ay) - (cx - ax) * (py - ay);
    const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
    const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
    // 符号が混在するなら外、全部 0 なら境界上とみなして内
    return !(hasNeg && hasPos);
  },
} as const;
