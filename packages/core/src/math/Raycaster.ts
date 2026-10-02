/**
 * @file Raycaster.ts
 * @description
 * Phaser 4 互換のレイキャスト（線分と図形の交差判定）。
 *
 * 設計上の判断 (IMPACT_SCOPE 8.2 の「A/C・SoA 走査」):
 * Phaser の `Phaser.Geom.Intersects.*` は図形を**オブジェクト**で受け取ります。
 * 数十万体規模には通用しません。本実装は図形群を `Float32Array` に
 * **事前配置**した SoA に対して走査します。
 *
 * ## SoA の配置規則
 *
 * 図形群は「1 図形あたり固定 stride」の `Float32Array` です。
 *
 * | 種別 | stride | 内容 |
 * | --- | --- | --- |
 * | `Rect` | 4 | `x, y, width, height` |
 * | `Circle` | 3 | `x, y, radius` |
 * | `Triangle` | 6 | `x1, y1, x2, y2, x3, y3` |
 * | `Line` | 4 | `x1, y1, x2, y2` |
 *
 * 走査は `for (let o = 0; o < buffer.length; o += stride)` のみで、
 * 途中のオブジェクト生成は一切ありません（R-02）。
 *
 * ## 交差結果の受け渡し
 *
 * 交差結果は `out: Float32Array` に `RAY_HIT_STRIDE` 個ずつ詰めます。
 * 戻り値は「`out` に詰めた交差結果の数」です。`out` が小さい場合は
 * 入るだけ詰めて {@link RAY_HIT_STRIDE} を返します。
 */

/** 図形群の種別。stride（1 図形あたりの要素数）が決まります。 */
export const RayShapeKind = {
  Rect: 0,
  Circle: 1,
  Triangle: 2,
  Line: 3,
} as const;

export type RayShapeKindValue = (typeof RayShapeKind)[keyof typeof RayShapeKind];

/** 各種別が使う stride。{@link Raycaster.intersectLine} の `stride` と一致させます。 */
export const RAY_STRIDE: Record<number, number> = {
  [RayShapeKind.Rect]: 4,
  [RayShapeKind.Circle]: 3,
  [RayShapeKind.Triangle]: 6,
  [RayShapeKind.Line]: 4,
};

/** 交差結果 1 件あたりの要素数。 */
export const RAY_HIT_STRIDE = 6;

/** 交差結果のフィールド位置。iloc を魔法数にしないための定数です。 */
export const RayHit = {
  X: 0,
  Y: 1,
  /** 線分の始点からのパラメータ（0〜1） */
  T: 2,
  /** 当たった図形のインデックス */
  ShapeIndex: 3,
  /** 面法線 X（線分の場合は 0） */
  NormalX: 4,
  /** 面法線 Y（線分の場合は 0） */
  NormalY: 5,
} as const;

/** 線分。`[x1, y1, x2, y2]` */
export type RayLine = ArrayLike<number>;

export const Raycaster = {
  /**
   * 指定 stride の SoA 図形群を線分と交差判定します。
   *
   * stride が 3 なら円、6 なら三角形、4 なら矩形として扱います。
   * 線分群との交差には {@link Raycaster.intersectLineSegments} を使ってください。
   *
   * @param line      線分 `[x1, y1, x2, y2]`
   * @param shapes    図形群の SoA バッファ
   * @param stride    1 図形あたりの要素数
   * @param out       交差結果を詰めるバッファ（`RAY_HIT_STRIDE` 個ずつ）
   * @param tolerance 境界の判定に使う許容誤差
   * @returns `out` に詰めた交差結果の数
   */
  intersectLine(
    line: RayLine,
    shapes: ArrayLike<number>,
    stride: number,
    out: Float32Array,
    tolerance = 1e-6,
  ): number {
    const x1 = line[0];
    const y1 = line[1];
    const x2 = line[2];
    const y2 = line[3];
    const dx = x2 - x1;
    const dy = y2 - y1;

    const cap = Math.floor(out.length / RAY_HIT_STRIDE);
    const n = Math.floor(shapes.length / stride);
    let written = 0;

    for (let s = 0; s < n; s++) {
      const o = s * stride;
      const base = written * RAY_HIT_STRIDE;
      let hit = false;

      if (stride === 3) {
        hit = Raycaster._lineCircle(
          x1,
          y1,
          dx,
          dy,
          shapes[o],
          shapes[o + 1],
          shapes[o + 2],
          tolerance,
          out,
          base,
        );
      } else if (stride === 6) {
        hit = Raycaster._lineTriangle(
          x1,
          y1,
          dx,
          dy,
          shapes[o],
          shapes[o + 1],
          shapes[o + 2],
          shapes[o + 3],
          shapes[o + 4],
          shapes[o + 5],
          tolerance,
          out,
          base,
        );
      } else if (stride === 4) {
        hit = Raycaster._lineRect(
          x1,
          y1,
          dx,
          dy,
          shapes[o],
          shapes[o + 1],
          shapes[o + 2],
          shapes[o + 3],
          tolerance,
          out,
          base,
        );
      }
      // 未対応の stride は静かに無視します（Phaser も非対応形状を無視します）

      if (!hit) continue;
      if (written >= cap) return cap;
      out[base + RayHit.ShapeIndex] = s;
      written++;
    }
    return written;
  },

  /**
   * 線分群（stride 4 の `[x1, y1, x2, y2]`）と線分の交差を走査します。
   *
   * 線どうしの交差なので法線は求めません（`NormalX` / `NormalY` は 0）。
   * 平行（または同一線）な場合は交差として扱いません。
   */
  intersectLineSegments(
    line: RayLine,
    segments: ArrayLike<number>,
    out: Float32Array,
    tolerance = 1e-6,
  ): number {
    const x1 = line[0];
    const y1 = line[1];
    const x2 = line[2];
    const y2 = line[3];
    const dx = x2 - x1;
    const dy = y2 - y1;

    const cap = Math.floor(out.length / RAY_HIT_STRIDE);
    const n = Math.floor(segments.length / 4);
    let written = 0;

    for (let s = 0; s < n; s++) {
      const o = s * 4;
      const t = Raycaster._segSeg(
        x1,
        y1,
        dx,
        dy,
        segments[o],
        segments[o + 1],
        segments[o + 2],
        segments[o + 3],
        tolerance,
      );
      if (t < 0) continue;
      if (written >= cap) return cap;
      const base = written * RAY_HIT_STRIDE;
      out[base + RayHit.X] = x1 + dx * t;
      out[base + RayHit.Y] = y1 + dy * t;
      out[base + RayHit.T] = t;
      out[base + RayHit.ShapeIndex] = s;
      out[base + RayHit.NormalX] = 0;
      out[base + RayHit.NormalY] = 0;
      written++;
    }
    return written;
  },

  /**
   * 線分と 1 個の矩形の交差を slab 法で判定します。
   * @returns 交差したか
   */
  _lineRect(
    x1: number,
    y1: number,
    dx: number,
    dy: number,
    rx: number,
    ry: number,
    rw: number,
    rh: number,
    tolerance: number,
    out: Float32Array,
    base: number,
  ): boolean {
    let tMin = 0;
    let tMax = 1;
    // 0 = x 軸で入った、1 = y 軸で入った。法線は逆向きを向きます。
    let axis = 0;
    let sign = 1;

    if (Math.abs(dx) < 1e-12) {
      // x 方向に進まない = x 座標は一定。その軸は矩形内である必要があります
      if (x1 < rx - tolerance || x1 > rx + rw + tolerance) return false;
    } else {
      const inv = 1 / dx;
      let t0 = (rx - x1) * inv;
      let t1 = (rx + rw - x1) * inv;
      if (t0 > t1) {
        const tmp = t0;
        t0 = t1;
        t1 = tmp;
      }
      if (t0 > tMin) {
        tMin = t0;
        axis = 0;
        sign = dx > 0 ? 1 : -1;
      }
      if (t1 < tMax) tMax = t1;
      if (tMin > tMax) return false;
    }

    if (Math.abs(dy) < 1e-12) {
      if (y1 < ry - tolerance || y1 > ry + rh + tolerance) return false;
    } else {
      const inv = 1 / dy;
      let t0 = (ry - y1) * inv;
      let t1 = (ry + rh - y1) * inv;
      if (t0 > t1) {
        const tmp = t0;
        t0 = t1;
        t1 = tmp;
      }
      if (t0 > tMin) {
        tMin = t0;
        axis = 1;
        sign = dy > 0 ? 1 : -1;
      }
      if (t1 < tMax) tMax = t1;
      if (tMin > tMax) return false;
    }

    out[base + RayHit.X] = x1 + dx * tMin;
    out[base + RayHit.Y] = y1 + dy * tMin;
    out[base + RayHit.T] = tMin;
    out[base + RayHit.NormalX] = axis === 0 ? -sign : 0;
    out[base + RayHit.NormalY] = axis === 1 ? -sign : 0;
    return true;
  },

  /** 線分と 1 個の円の交差を 2 次方程式で判定します。 */
  _lineCircle(
    x1: number,
    y1: number,
    dx: number,
    dy: number,
    cx: number,
    cy: number,
    r: number,
    tolerance: number,
    out: Float32Array,
    base: number,
  ): boolean {
    const fx = x1 - cx;
    const fy = y1 - cy;
    const a = dx * dx + dy * dy;

    if (a < 1e-12) {
      // 長さ 0 の線分：始点が円内ならヒット
      if (fx * fx + fy * fy > (r + tolerance) * (r + tolerance)) return false;
      out[base + RayHit.X] = x1;
      out[base + RayHit.Y] = y1;
      out[base + RayHit.T] = 0;
      out[base + RayHit.NormalX] = 0;
      out[base + RayHit.NormalY] = 0;
      return true;
    }

    const b = 2 * (fx * dx + fy * dy);
    const c = fx * fx + fy * fy - r * r;
    const disc = b * b - 4 * a * c;
    if (disc < 0) return false;

    const sq = Math.sqrt(disc);
    const inv2a = 1 / (2 * a);
    let t = (-b - sq) * inv2a;
    if (t < 0) t = (-b + sq) * inv2a;
    if (t < -tolerance || t > 1 + tolerance) return false;

    const hx = x1 + dx * t;
    const hy = y1 + dy * t;
    let nx = hx - cx;
    let ny = hy - cy;
    const nl = Math.sqrt(nx * nx + ny * ny);
    if (nl > 1e-9) {
      nx /= nl;
      ny /= nl;
    }
    out[base + RayHit.X] = hx;
    out[base + RayHit.Y] = hy;
    out[base + RayHit.T] = t;
    out[base + RayHit.NormalX] = nx;
    out[base + RayHit.NormalY] = ny;
    return true;
  },

  /**
   * 線分と 1 個の三角形の交差を判定します。
   *
   * 3 辺との交点を求め、そのパラメータの最小・最大を線分の
   * `[0, 1]` と突き合わせます。裏返した三角形（winding が逆）でも
   * 判定できるよう、交差の有無は符号ではなく幾何で決めます。
   */
  _lineTriangle(
    x1: number,
    y1: number,
    dx: number,
    dy: number,
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number,
    tolerance: number,
    out: Float32Array,
    base: number,
  ): boolean {
    // 3 辺との交点を集めます。
    let tMin = Number.POSITIVE_INFINITY;
    let tMax = Number.NEGATIVE_INFINITY;
    let hits = 0;

    for (let e = 0; e < 3; e++) {
      const ex0 = e === 0 ? ax : e === 1 ? bx : cx;
      const ey0 = e === 0 ? ay : e === 1 ? by : cy;
      const ex1 = e === 0 ? bx : e === 1 ? cx : ax;
      const ey1 = e === 0 ? by : e === 1 ? cy : ay;

      const ex = ex1 - ex0;
      const ey = ey1 - ey0;
      const denom = dx * ey - dy * ex;
      if (Math.abs(denom) < 1e-12) continue; // 平行
      const qx = ex0 - x1;
      const qy = ey0 - y1;
      const t = (qx * ey - qy * ex) / denom;
      const u = (qx * dy - qy * dx) / denom;
      if (u < -tolerance || u > 1 + tolerance) continue; // 辺の外
      hits++;
      if (t < tMin) tMin = t;
      if (t > tMax) tMax = t;
    }

    // 1 交点しか無い = 頂点や辺に接するだけ。内部を通らないため非交差とします。
    if (hits < 2) return false;
    // 三角形の t 区間と線分の [0, 1] が重なるか
    if (tMax < -tolerance || tMin > 1 + tolerance) return false;

    let t: number;
    if (tMin >= 0 && tMin <= 1) t = tMin;
    else if (tMax >= 0 && tMax <= 1) t = tMax;
    else t = tMin > 1 ? 1 : 0;

    out[base + RayHit.X] = x1 + dx * t;
    out[base + RayHit.Y] = y1 + dy * t;
    out[base + RayHit.T] = t;

    // 三角形は平面なので法線は一定です。辺 AB の左法線を正規化して使います。
    const ex = bx - ax;
    const ey = by - ay;
    const nl = Math.sqrt(ex * ex + ey * ey);
    if (nl > 1e-9) {
      out[base + RayHit.NormalX] = -ey / nl;
      out[base + RayHit.NormalY] = ex / nl;
    } else {
      out[base + RayHit.NormalX] = 0;
      out[base + RayHit.NormalY] = 0;
    }
    return true;
  },

  /**
   * 2 本の線分の交差を判定し、線分 1 のパラメータ `t` を返します。
   * 交差（重なる範囲を持つ）しなければ -1 を返します。
   */
  _segSeg(
    x1: number,
    y1: number,
    dx: number,
    dy: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    tolerance: number,
  ): number {
    const sx = x3 - x2;
    const sy = y3 - y2;
    const denom = dx * sy - dy * sx;
    if (Math.abs(denom) < 1e-12) return -1; // 平行（同一線も交差に含めない）
    const qx = x2 - x1;
    const qy = y2 - y1;
    const t = (qx * sy - qy * sx) / denom;
    const u = (qx * dy - qy * dx) / denom;
    if (t < -tolerance || t > 1 + tolerance) return -1;
    if (u < -tolerance || u > 1 + tolerance) return -1;
    return t;
  },
} as const;
