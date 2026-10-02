/**
 * @file Curves.ts
 * @description
 * Phaser 4 互換のカーブ群。すべて `out` パラメータのみ。
 *
 * 設計上の掟 (IMPACT_SCOPE 8.1 の判定 C):
 * Phaser の `Curves.*` は `getPoint(t)` が `new Vector2()` を返します。
 * 本実装は **`out: Float32Array` (2 要素) を必須**にします。
 * 曲線も点群も SoA (`Float32Array`) で扱い、Point オブジェクトを
 * 生成しません（R-02 / R-03）。
 *
 * 対応する点群の形式は「フラットな `[x0, y0, x1, y1, ...]`」です。
 * `Curve.getSpacedPoints` などの「点列を生成する」系は `Path` へ委ねます。
 */

/** 点として受け取れる型。 */
export type CurvePointLike = ArrayLike<number>;

/** 2 要素のバッファ。すべての関数の `out` として使います。 */
export type CurveOut = Float32Array;

/** 点列の平坦な `Float32Array`。 */
export type PointList = Float32Array;

/**
 * カーブの共通 Yep 実。具象クラスを継承せず、
 * discriminated union の kind で分岐します。
 *
 * 継承階層を持つと Flyweight ではないオブジェクトが 1 つ増えます（R-03）。
 * `kind` による分岐なら 1 個の関数に集約できます。
 */
export const CurveKind = {
  Line: 0,
  QuadraticBezier: 1,
  CubicBezier: 2,
  Spline: 3,
  CatmullRom: 4,
} as const;

export type CurveKindValue = (typeof CurveKind)[keyof typeof CurveKind];

/** カーブの入力点群（制御点）。点数は `kind` ごとに決まります。 */
export type CurveInput = {
  readonly kind: CurveKindValue;
  /** 制御点。`kind` に応じて 2 / 3 / 4 / n 個の点を受けす。 */
  readonly points: CurvePointLike;
};

export const Curves = {
  /**
   * 制御点からカブを構築します。
   *
   * @param points 制御点列
   * @param kind {@link CurveKind}
   * @returns 構築済みのカーブ
   */
  from(points: CurvePointLike, kind: CurveKindValue): CurveInput {
    return { kind, points };
  },

  /**
   * `t` における点  `out` へ書き出します (Phaser 互換の `Curve.getPoint`)。
   *
   * @param t 0〜1 のパラメータ。範囲外は評価します（クランプしません）
   * @param out 2 要素のバッファ
   */
  getPoint(curve: CurveInput, t: number, out: CurveOut): CurveOut {
    const p = curve.points;
    switch (curve.kind) {
      case CurveKind.Line:
        return Curves._pointLine(p, t, out);
      case CurveKind.QuadraticBezier:
        return Curves._pointQuadratic(p, t, out);
      case CurveKind.CubicBezier:
        return Curves._pointCubic(p, t, out);
      case CurveKind.CatmullRom:
        return Curves._pointCatmullRom(p, t, out);
      case CurveKind.Spline:
        return Curves._pointSpline(p, t, out);
      default:
        out[0] = 0;
        out[1] = 0;
        return out;
    }
  },

  /**
   * 弧長で等間隔の点を `out` へ書き出します
   * (Phaser 互換の `Curve.getSpacedPoints`)。
   *
   * 等間隔にするには弧長が必要で、その計算は仮分割（数値積分）で行います。
   * 正確な弧長は `getLength` を参照してください。
   *
   * @param divisions 分割数。0 なら 64 を使います
   * @param out 2 要素 × `divisions` のバッファ
   * @returns 書き出した点数
   */
  getSpacedPoints(curve: CurveInput, divisions: number, out: Float32Array): number {
    const n = divisions > 0 ? divisions : 64;
    if (out.length < n * 2) return 0;

    // 仮分割で累積弧長テーブルを作ります。
    const samples = 128;
    const cum = Curves._arcTable(curve, samples);
    // Phaser 互換に、始点 (t=0) から終点 (t=1) までを n 点に分けます。
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1 || 1);
      const target = u * cum[samples];
      // 累積弧長から t を二分探索します。
      let lo = 0;
      let hi = samples;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (cum[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      const seg = Math.max(1, lo);
      const prev = cum[seg - 1];
      const span = cum[seg] - prev;
      const frac = span > 1e-9 ? (target - prev) / span : 0;
      const w = (seg - 1 + frac) / samples;
      Curves.getPoint(curve, w, SUB);
      out[i * 2] = SUB[0];
      out[i * 2 + 1] = SUB[1];
    }
    return n;
  },

  /**
   * 弧長を返します (Phaser 互換の `Curve.getLength`)。
   *
   * 数値積分（区分求積）で求めます。厳密な値が必要な場合は
   * `getLength` を `divisions` 较大的 で再計算してください。
   */
  getLength(curve: CurveInput, divisions = 32): number {
    const n = divisions > 0 ? divisions : 32;
    const cum = Curves._arcTable(curve, n);
    return cum[n];
  },

  /**
   * `t` における接線（微分）を `out` へ書き出します
   * (Phaser 互換の `Curve.getTangent`)。
   *
   * 微分が 0 の場合は (0, 0) を返します。
   */
  getTangent(curve: CurveInput, t: number, out: CurveOut): CurveOut {
    const p = curve.points;
    switch (curve.kind) {
      case CurveKind.Line: {
        // 線分は常に一定方向なので導函数は (P1 - P0)
        out[0] = p[2] - p[0];
        out[1] = p[3] - p[1];
        return out;
      }
      case CurveKind.QuadraticBezier: {
        const mt = 1 - t;
        out[0] = 2 * mt * (p[2] - p[0]) + 2 * t * (p[4] - p[2]);
        out[1] = 2 * mt * (p[3] - p[1]) + 2 * t * (p[5] - p[3]);
        return out;
      }
      case CurveKind.CubicBezier: {
        const mt = 1 - t;
        const a = 3 * mt * mt;
        const b = 6 * mt * t;
        const c = 3 * t * t;
        out[0] = a * (p[2] - p[0]) + b * (p[4] - p[2]) + c * (p[6] - p[4]);
        out[1] = a * (p[3] - p[1]) + b * (p[5] - p[3]) + c * (p[7] - p[5]);
        return out;
      }
      default: {
        // Spline / CatmullRom は差分で求めます
        const h = 1e-4;
        const t0 = Math.max(0, t - h);
        const t1 = Math.min(1, t + h);
        Curves.getPoint(curve, t0, TMP_A);
        Curves.getPoint(curve, t1, TMP_B);
        out[0] = (TMP_B[0] - TMP_A[0]) / (t1 - t0);
        out[1] = (TMP_B[1] - TMP_A[1]) / (t1 - t0);
        return out;
      }
    }
  },

  // ============================================================
  // 種別ごとの点評価（private）
  // ============================================================

  _pointLine(p: CurvePointLike, t: number, out: CurveOut): CurveOut {
    out[0] = p[0] + (p[2] - p[0]) * t;
    out[1] = p[1] + (p[3] - p[1]) * t;
    return out;
  },

  _pointQuadratic(p: CurvePointLike, t: number, out: CurveOut): CurveOut {
    const mt = 1 - t;
    const a = mt * mt;
    const b = 2 * mt * t;
    const c = t * t;
    out[0] = a * p[0] + b * p[2] + c * p[4];
    out[1] = a * p[1] + b * p[3] + c * p[5];
    return out;
  },

  _pointCubic(p: CurvePointLike, t: number, out: CurveOut): CurveOut {
    const mt = 1 - t;
    const a = mt * mt * mt;
    const b = 3 * mt * mt * t;
    const c = 3 * mt * t * t;
    const d = t * t * t;
    out[0] = a * p[0] + b * p[2] + c * p[4] + d * p[6];
    out[1] = a * p[1] + b * p[3] + c * p[5] + d * p[7];
    return out;
  },

  _pointCatmullRom(p: CurvePointLike, t: number, out: CurveOut): CurveOut {
    // Phaser 互換の Catmull-Rom。両端は折り返さず端点複製で扱います。
    const n = p.length / 2;
    if (n < 2) {
      if (n === 1) {
        out[0] = p[0];
        out[1] = p[1];
      } else {
        out[0] = 0;
        out[1] = 0;
      }
      return out;
    }
    const scaled = t * (n - 1);
    const i = Math.min(n - 2, Math.floor(scaled));
    const lt = scaled - i;
    const i0 = Math.max(0, i - 1);
    const i1 = i;
    const i2 = i + 1;
    const i3 = Math.min(n - 1, i + 2);
    const t2 = lt * lt;
    const t3 = t2 * lt;
    out[0] =
      0.5 *
      (2 * p[i1 * 2] +
        (-p[i0 * 2] + p[i2 * 2]) * lt +
        (2 * p[i0 * 2] - 5 * p[i1 * 2] + 4 * p[i2 * 2] - p[i3 * 2]) * t2 +
        (-p[i0 * 2] + 3 * p[i1 * 2] - 3 * p[i2 * 2] + p[i3 * 2]) * t3);
    out[1] =
      0.5 *
      (2 * p[i1 * 2 + 1] +
        (-p[i0 * 2 + 1] + p[i2 * 2 + 1]) * lt +
        (2 * p[i0 * 2 + 1] - 5 * p[i1 * 2 + 1] + 4 * p[i2 * 2 + 1] - p[i3 * 2 + 1]) * t2 +
        (-p[i0 * 2 + 1] + 3 * p[i1 * 2 + 1] - 3 * p[i2 * 2 + 1] + p[i3 * 2 + 1]) * t3);
    return out;
  },

  _pointSpline(p: CurvePointLike, t: number, out: CurveOut): CurveOut {
    return Curves._pointCatmullRom(p, t, out);
  },

  /**
   * 累積弧長テーブルを作ります。
   *
   * @param out `samples + 1` 要素のバッファ。cum[0] = 0
   * @returns `out` と同じ参照
   */
  _arcTable(curve: CurveInput, samples: number, out = ARC_SCRATCH): Float32Array {
    if (out.length < samples + 1) return out;
    out[0] = 0;
    Curves.getPoint(curve, 0, SUB);
    let px = SUB[0];
    let py = SUB[1];
    for (let i = 1; i <= samples; i++) {
      Curves.getPoint(curve, i / samples, SUB);
      const dx = SUB[0] - px;
      const dy = SUB[1] - py;
      out[i] = out[i - 1] + Math.sqrt(dx * dx + dy * dy);
      px = SUB[0];
      py = SUB[1];
    }
    return out;
  },

  /**
   * この種別が必要とする制御点数。
   *
   * 制御点数が足りないカーブを作らないために {@link Path.addCurve} から参照します。
   */
  _requiredPoints(kind: number): number {
    switch (kind) {
      case CurveKind.Line:
        return 2;
      case CurveKind.QuadraticBezier:
        return 3;
      case CurveKind.CubicBezier:
        return 4;
      default:
        // Spline / CatmullRom は可変長
        return 2;
    }
  },
} as const;

/** 内部計算用の使い回しバッファ。呼び出しには露出しません。 */
const SUB = new Float32Array(2);
const TMP_A = new Float32Array(2);
const TMP_B = new Float32Array(2);
const ARC_SCRATCH = new Float32Array(256);
