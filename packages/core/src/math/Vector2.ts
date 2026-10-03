/**
 * @file Vector2.ts
 * @description
 * Phaser 4 互換の Vector2 ユーティリティ群。
 *
 * 設計上の掟 (R-02: ループ内 `new` 禁止):
 * **すべての関数が `out: Float32Array` (2 要素) を要求します。**
 * Phaser は `new Vector2()` を返すため呼び出し側がオブジェクトを生成しますが、
 * 本実装はそれを採用しません。呼び出し側が 1 度だけ生成したバッファを
 * 全フレームで使い回す形です。
 *
 * ```ts
 * const tmp = new Float32Array(2);       // 1 度だけ生成
 * for (...) {
 *   Vector2.Add(a, b, tmp);
 *   Vector2.Scale(tmp, 0.5, tmp);        // in と out を共有できます
 * }
 * ```
 *
 * `in` と `out` を共有して構いません。関数は必要な値を
 * 局所変数に退避してから書き込むためです。
 */

/** 点として受け取れる型。Float32Array / 通常の配列を都可。 */
export type Vec2Like = ArrayLike<number>;

/** 2 要素のバッファ。`out` として使います。 */
export type Vec2Out = Float32Array;

export const Vector2 = {
  /** `out` に点 A をコピーします。 */
  Copy(a: Vec2Like, out: Vec2Out): Vec2Out {
    out[0] = a[0];
    out[1] = a[1];
    return out;
  },

  /** `out = a + b` */
  Add(a: Vec2Like, b: Vec2Like, out: Vec2Out): Vec2Out {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
  },

  /** `out = a - b` */
  Subtract(a: Vec2Like, b: Vec2Like, out: Vec2Out): Vec2Out {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
  },

  /** `out = a * scalar` */
  Scale(a: Vec2Like, scalar: number, out: Vec2Out): Vec2Out {
    out[0] = a[0] * scalar;
    out[1] = a[1] * scalar;
    return out;
  },

  /** `out = a / scalar` */
  Divide(a: Vec2Like, scalar: number, out: Vec2Out): Vec2Out {
    if (scalar === 0) {
      out[0] = 0;
      out[1] = 0;
      return out;
    }
    out[0] = a[0] / scalar;
    out[1] = a[1] / scalar;
    return out;
  },

  /**
   * 内積 `out = a · b`
   *
   * @param out 1 要素のバッファ
   */
  Dot(a: Vec2Like, b: Vec2Like, out: Vec2Out): Vec2Out {
    out[0] = a[0] * b[0] + a[1] * b[1];
    return out;
  },

  /**
   * 外積 (z 成分) を `out[0]` に書きます。
   *
   * @param out 1 要素のバッファ
   */
  Cross(a: Vec2Like, b: Vec2Like, out: Vec2Out): Vec2Out {
    out[0] = a[0] * b[1] - a[1] * b[0];
    return out;
  },

  /** 点の長さ (`sqrt(x^2 + y^2)`) を返します。 */
  Length(a: Vec2Like): number {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
  },

  /** 点の長さの二乗を返します。平方根が不要な比較に。 */
  LengthSq(a: Vec2Like): number {
    return a[0] * a[0] + a[1] * a[1];
  },

  /** `out = -a` */
  Negate(a: Vec2Like, out: Vec2Out): Vec2Out {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
  },

  /** 各成分を符号反転します。Phaser の `invert` と同じ意味です。 */
  Invert(a: Vec2Like, out: Vec2Out): Vec2Out {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
  },

  /** 小数部分を切り捨てます (`out = ceil(a)`)。 */
  Ceil(a: Vec2Like, out: Vec2Out): Vec2Out {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    return out;
  },

  /** 各成分を 0 方向へ丸めます (`out = floor(a)`)。 */
  Floor(a: Vec2Like, out: Vec2Out): Vec2Out {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    return out;
  },

  /**
   * 各成分を丸めます。
   *
   * `Math.round` と同じ規則（0.5 は `+Infinity` 側）を使います。
   * つまり `-1.5` は `-1` になります。0 方向への丸めが必要な場合は
   * 呼び出し側で `Math.floor(x + 0.5)` を書いてください。
   */
  Round(a: Vec2Like, out: Vec2Out): Vec2Out {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    return out;
  },

  /**
   * 長さを指定値にします。元の向きは保たれます。
   *
   * 長さ 0 の点では方向が定義できないため `(1, 0)` になります。
   */
  SetLength(a: Vec2Like, length: number, out: Vec2Out): Vec2Out {
    const x = a[0];
    const y = a[1];
    const len = Math.sqrt(x * x + y * y);
    if (len === 0) {
      out[0] = 1;
      out[1] = 0;
      return out;
    }
    const s = length / len;
    out[0] = x * s;
    out[1] = y * s;
    return out;
  },

  /**
   * 単位ベクトルにします（長さを 1 に）。
   *
   * 長さ 0 の点では `(0, 0)` を返します（`SetLength` と挙動が違います）。
   */
  Normalize(a: Vec2Like, out: Vec2Out): Vec2Out {
    const x = a[0];
    const y = a[1];
    const len = Math.sqrt(x * x + y * y);
    if (len === 0) {
      out[0] = 0;
      out[1] = 0;
      return out;
    }
    out[0] = x / len;
    out[1] = y / len;
    return out;
  },

  /**
   * `point` を `a` から見た**単位**方向の位置へ射影します
   * (Phaser 互換の `Vector2.ProjectUnit`)。
   *
   * @param out 2 要素のバッファ。out = 射影点 (a + dir * t)
   */
  ProjectUnit(a: Vec2Like, point: Vec2Like, out: Vec2Out): Vec2Out {
    const dx = point[0] - a[0];
    const dy = point[1] - a[1];
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) {
      out[0] = a[0];
      out[1] = a[1];
      return out;
    }
    out[0] = a[0] + dx / len;
    out[1] = a[1] + dy / len;
    return out;
  },

  /**
   * `a` から `point` への方向を単位ベクトルとして書き出します
   * (Phaser 互換の `Vector2.Unit`)。
   */
  Unit(from: Vec2Like, point: Vec2Like, out: Vec2Out): Vec2Out {
    const dx = point[0] - from[0];
    const dy = point[1] - from[1];
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) {
      out[0] = 0;
      out[1] = 0;
      return out;
    }
    out[0] = dx / len;
    out[1] = dy / len;
    return out;
  },

  /**
   * 2 点間の距離を `out[0]` に書きます。
   */
  Distance(a: Vec2Like, b: Vec2Like, out: Vec2Out): Vec2Out {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    out[0] = Math.sqrt(dx * dx + dy * dy);
    return out;
  },

  /**
   * 2 点間の距離をクランプします (Phaser 互換の `Vector2.DistanceSq` 系)。
   * `out[0]` に距離を書きます。
   */
  ClampDistance(a: Vec2Like, b: Vec2Like, min: number, max: number, out: Vec2Out): Vec2Out {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    let d = Math.sqrt(dx * dx + dy * dy);
    if (d < min) d = min;
    else if (d > max) d = max;
    out[0] = d;
    return out;
  },

  /**
   * 角度と長さから点を作ります (Phaser 互換の `Vector2.FromAngle`)。
   *
   * @param out 2 要素のバッファ
   */
  FromAngle(angle: number, length: number, out: Vec2Out): Vec2Out {
    out[0] = Math.cos(angle) * length;
    out[1] = Math.sin(angle) * length;
    return out;
  },

  /**
   * 2 点間の角度を返します (ラジアン、Phaser 互換の `Angle.Between`)。
   */
  Angle(a: Vec2Like, b: Vec2Like): number {
    return Math.atan2(b[1] - a[1], b[0] - a[0]);
  },

  /**
   * 線形補間 (Phaser 互換の `Vector2.Linear`)。
   *
   * @param t 補間係数
   */
  Linear(a: Vec2Like, b: Vec2Like, t: number, out: Vec2Out): Vec2Out {
    out[0] = a[0] + (b[0] - a[0]) * t;
    out[1] = a[1] + (b[1] - a[1]) * t;
    return out;
  },

  /**
   * 滑らかな線形補間 (Phaser 互換の `Vector2.SmoothStep`)。
   */
  SmoothStep(a: Vec2Like, b: Vec2Like, t: number, out: Vec2Out): Vec2Out {
    const s = t * t * (3 - 2 * t);
    out[0] = a[0] + (b[0] - a[0]) * s;
    out[1] = a[1] + (b[1] - a[1]) * s;
    return out;
  },

  /**
   * `out` と `other` が同じ参照かどうか。
   * `in` と `out` を安全に共有できるかの判定に使います。
   */
  Equals(a: Vec2Like, b: Vec2Like): boolean {
    return a[0] === b[0] && a[1] === b[1];
  },
} as const;
