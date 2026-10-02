/**
 * @file Math.ts
 * @description
 * Phaser 4 互換の数学ヘルパー群。
 *
 * 設計上の掟:
 * - **戻り値の生成を禁じる**。点や矩形を返す関数は必ず `out: Float32Array`
 *   を受け取ります（R-02: ループ内 `new` 禁止）。
 * - スカラーの返す関数は例外です。数値のみを返すのでヒープが発生しません。
 * - 使い回しのバッファをモジュール内には持ちません。
 *   呼び出し側が `out` を用意するのが明示的で、所有者を紛らわしくしないためです。
 *
 * 使い方の例:
 * ```ts
 * const out = new Float32Array(2);   // 呼び出し側で 1 度だけ生成
 * Vector2.Add(a, b, out);
 * Math.GetCentroid(points, out);
 * ```
 */

/** 点が SoA として渡せる形（Float32Array / 通常の配列） */
export type MathVec2Like = ArrayLike<number>;

/** 2 要素のバッファ。`Vector2` 系関数の `out` として使います。 */
export type MathVec2Out = Float32Array;

/** 4 要素のバッファ。矩形・境界の `out` として使います。 */
export type Float32Out4 = Float32Array;

export const Math2 = {
  // ============================================================
  // 補間
  // ============================================================

  /**
   * 線形補間 (Phaser 互換の `Math.Linear`)。
   *
   * @param p 補間係数 (0〜1)。範囲外はクランプしません
   * @param p0 開始値
   * @param p1 終了値
   */
  Linear(p: number, p0: number, p1: number): number {
    return p0 + (p1 - p0) * p;
  },

  /**
   * スムーズステップ補間 (Phaser 互換の `Math.SmoothStep`)。
   *
   * 端で 2 次微分連続になるよう `t * t * (3 - 2t)` でクランプします。
   *
   * @returns `[min, max]` の区間に対する正規化位置 0〜1
   */
  SmoothStep(value: number, min: number, max: number): number {
    const t = Math2.Clamp((value - min) / (max - min), 0, 1);
    return t * t * (3 - 2 * t);
  },

  /**
   * サインステップ補間 (Phaser 互換の `Math.SinusoidalStep`)。
   * 始点と終点で傾きが 0 になる形です。
   *
   * @returns `[min, max]` の区間に対する正規化位置 0〜1
   */
  Sinusoidal(value: number, min: number, max: number): number {
    const t = Math2.Clamp((value - min) / (max - min), 0, 1);
    return 0.5 - Math.cos(t * Math.PI) * 0.5;
  },

  /**
   * 位置の百分率 (Phaser 互換の `Math.Percentage`)。
   *
   * @param x 値
   * @param min 下限
   * @param max 上限
   * @returns `(x - min) / (max - min)`。`min === max` のときは 0
   */
  Percentage(x: number, min: number, max: number): number {
    const span = max - min;
    if (span === 0) return 0;
    return (x - min) / span;
  },

  /**
   * 許容範囲内かを判定します (Phaser 互換の `Math.FuzzyMatch`)。
   *
   * @param value 検査する値
   * @param expected 期待値
   * @param tolerance 許容誤差
   */
  FuzzyMatch(value: number, expected: number, tolerance: number): boolean {
    return Math.abs(value - expected) <= tolerance;
  },

  // ============================================================
  // 距離と角度
  // ============================================================

  /**
   * 2 点間の距離 (Phaser 互換の `Math.Distance.Between`)。
   */
  DistanceBetween(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  },

  /**
   * 2 点間の距離の二乗 (Phaser 互換の `Math.Distance.Squared`)。
   *
   * 平方根を取らないため、**大小比較だけをするならこちらが速い**です。
   */
  DistanceSquared(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx * dx + dy * dy;
  },

  /**
   * 2 点間の距離を `out` へ書き出します (Phaser 互換の `Math.Distance.BetweenPoints`)。
   *
   * @param a 点 A (2 要素)
   * @param b 点 B (2 要素)
   * @param out 1 要素のバッファ。out[0] = 距離
   */
  BetweenPoints(a: MathVec2Like, b: MathVec2Like, out: MathVec2Out): Float32Array {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    out[0] = Math.sqrt(dx * dx + dy * dy);
    return out;
  },

  /**
   * 2 点間の角度 (ラジアン) を返します (Phaser 互換の `Math.Angle.Between`)。
   */
  AngleBetween(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y2 - y1, x2 - x1);
  },

  /**
   * 度数をラジアンに変換します (Phaser 互換の `Math.DegToRad`)。
   */
  DegreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  },

  /**
   * ラジアンを度数に変換します (Phaser 互換の `Math.RadToDeg`)。
   */
  RadiansToDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
  },

  // ============================================================
  // 集合に対する操作
  // ============================================================

  /**
   * 点を `out` にコピーします (Phaser 互換の `Math.Copy`)。
   *
   * @param out 2 要素のバッファ
   */
  Copy(source: MathVec2Like, out: MathVec2Out): Float32Array {
    out[0] = source[0];
    out[1] = source[1];
    return out;
  },

  /**
   * 点群の長さを返します (Phaser 互換の `Vector2` の length 相当)。
   */
  Length(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
  },

  /**
   * 点群の重心を `out` へ書き出します (Phaser 互換の `Math.GetCentroid`)。
   *
   * 内部で全点の平均を取ります。点群は `[x0, y0, x1, y1, ...]` のフラットな
   * `Float32Array` を想定します。
   *
   * @param points フラットな点群
   * @param out 2 要素のバッファ。out[0] = x, out[1] = y
   * @returns 書き出した点の数。0 点の場合は `out` を書き換えず 0 を返します
   */
  GetCentroid(points: MathVec2Like, out: MathVec2Out): number {
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
   * (Phaser 互換の `Math.GetVec2Bounds`)。
   *
   * @param points フラットな点群
   * @param out 4 要素のバッファ。out = [minX, minY, maxX, maxY]
   * @returns 書き出した点の数。0 点の場合は `out` を書き換えず 0 を返します
   */
  GetVec2Bounds(points: MathVec2Like, out: Float32Out4): number {
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
  // 汎用
  // ============================================================

  /** 値を `[min, max]` にクランプします。 */
  Clamp(val: number, min: number, max: number): number {
    if (val < min) return min;
    if (val > max) return max;
    return val;
  },

  /** 値の符号を返します (-1 / 0 / 1)。 */
  Sign(val: number): number {
    if (val < 0) return -1;
    if (val > 0) return 1;
    return 0;
  },

  /** 度数をラジアンに変換します（旧名 `DegToRad` の互換エイリアス）。 */
  DegToRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  },

  /** ラジアンを度数に変換します（旧名 `RadToDeg` の互換エイリアス）。 */
  RadToDeg(radians: number): number {
    return (radians * 180) / Math.PI;
  },
} as const;

/**
 * 旧 API の互換ラッパー。
 *
 * 既存の呼び出し箇所（`Scene` など）向けに `mathHelpers.Clamp` などを提供します。
 * 新規コードは {@link Math2} を直接使ってください。
 */
export class MathHelpers {
  public Distance = {
    Between(x1: number, y1: number, x2: number, y2: number): number {
      return Math2.DistanceBetween(x1, y1, x2, y2);
    },
    BetweenSquared(x1: number, y1: number, x2: number, y2: number): number {
      return Math2.DistanceSquared(x1, y1, x2, y2);
    },
  };

  public Angle = {
    Between(x1: number, y1: number, x2: number, y2: number): number {
      return Math2.AngleBetween(x1, y1, x2, y2);
    },
  };

  public Clamp(val: number, min: number, max: number): number {
    return Math2.Clamp(val, min, max);
  }

  public DegToRad(degrees: number): number {
    return Math2.DegToRad(degrees);
  }

  public RadToDeg(radians: number): number {
    return Math2.RadToDeg(radians);
  }
}

export const mathHelpers = new MathHelpers();
