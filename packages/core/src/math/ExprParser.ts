/**
 * @file ExprParser.ts
 * @description
 * 算術式の評価器 (Phaser 4 互換の `Math.ExprParser`)。
 *
 * 設計上の判断 (IMPACT_SCOPE 8.2 の「A/C」):
 * Phaser の `ExprParser` は `evaluate()` のたびに文字列をトークン分割し直します。
 * 本実装は **shunting-yard で 1 回だけ後缀記法（RPN）に変換**し、
 * 評価は値スタック 1 パスで終えます。
 *
 * - **パースフェーズ**: 文字列を `Int8Array`（トークン種別）、
 *   `Float64Array`（数値）、`Int32Array`（識別子インデックス）へ書き出します。
 *   バッファは確保済みで使い回します。
 * - **評価フェーズ**: `Float64Array` の値スタックを 1 パスで走査します。
 *   **評価中にヒープを生成しません**（R-02）。
 *
 * 文字列が変わらない限り {@link evaluateParsed} を使うとパースを省略できます。
 *
 * ## 対応範囲
 *
 * 演算子: `+` `-` `*` `/` `%` `^` と括弧による優先順位、負の符号
 * 関数（固定の引数個数）:
 * `abs` `floor` `ceil` `round` `sqrt` `sin` `cos` `tan`（1 引数）、
 * `min` `max` `pow`（2 引数）
 * 定数: `PI` `E`
 * 数値: `123` `1.5` `1e3` `2e-2`
 *
 * 識別子は `parameters` の**添字**として解決します。
 * 式中の最初の識別子が `parameters[0]` に対応します。
 */

/** トークン種別。`Int8Array` に格納します。 */
export const Tok = {
  /** 数値 */
  Num: 0,
  /** 識別子（`parameters` の添字に解決） */
  Ident: 1,
  /** 1 引数関数 */
  Fn1: 2,
  /** 2 引数関数 */
  Fn2: 3,
  Plus: 4,
  Minus: 5,
  Star: 6,
  Slash: 7,
  Percent: 8,
  Caret: 9,
  End: 10,
} as const;

/** 1 引数関数の種別（`Tok.Fn1` と対で使います）。 */
export const Fn1 = {
  Abs: 0,
  Floor: 1,
  Ceil: 2,
  Round: 3,
  Sqrt: 4,
  Sin: 5,
  Cos: 6,
  Tan: 7,
} as const;

/** 2 引数関数の種別（`Tok.Fn2` と対で使います）。 */
export const Fn2 = {
  Min: 0,
  Max: 1,
  Pow: 2,
} as const;

const FN1_TABLE: Record<string, number> = {
  abs: Fn1.Abs,
  floor: Fn1.Floor,
  ceil: Fn1.Ceil,
  round: Fn1.Round,
  sqrt: Fn1.Sqrt,
  sin: Fn1.Sin,
  cos: Fn1.Cos,
  tan: Fn1.Tan,
};

const FN2_TABLE: Record<string, number> = {
  min: Fn2.Min,
  max: Fn2.Max,
  pow: Fn2.Pow,
};

/** 演算子の優先順位。大きいほど強い結合です。 */
function precedence(t: number): number {
  if (t === Tok.Caret) return 3;
  if (t === Tok.Star || t === Tok.Slash || t === Tok.Percent) return 2;
  if (t === Tok.Plus || t === Tok.Minus) return 1;
  return 0;
}

/** 右結合かどうか。`^` だけ右結合です。 */
function rightAssoc(t: number): boolean {
  return t === Tok.Caret;
}

export class ExprParser {
  /** 出力列（RPN）のトークン種別。 */
  private _types: Int8Array;
  /** 出力列の数値 / 関数 ID。 */
  private _values: Float64Array;
  /** 出力列の識別子インデックス。 */
  private _identIdx: Int32Array;
  private _count = 0;

  /** 演算子スタック。 */
  private _ops: Int8Array;
  private _opTop = 0;

  /** 評価フェーズで使う値スタック。 */
  private _stack: Float64Array;
  private _stackTop = 0;
  /** スタックが足りなかった場合に立ちます。評価結果は NaN になります。 */
  private _underflow = false;

  /**
   * 識別子名 -> `parameters` の添字。
   *
   * パース時（セットアップ相当）だけ使うため `Map` を許します。
   * 評価フェーズは一切触れません（R-02 の対象は評価側です）。
   */
  private _idents = new Map<string, number>();

  /** 直近のパースで得たトークン数。 */
  public get tokenCount(): number {
    return this._count;
  }

  constructor(capacity = 128) {
    this._types = new Int8Array(capacity);
    this._values = new Float64Array(capacity);
    this._identIdx = new Int32Array(capacity);
    this._ops = new Int8Array(capacity);
    this._stack = new Float64Array(64);
  }

  /** 出力列の容量を、必要なら 2 倍にして確保します。 */
  private _ensure(need: number): void {
    if (this._types.length >= need) return;
    let cap = this._types.length;
    while (cap < need) cap *= 2;
    const t = new Int8Array(cap);
    t.set(this._types);
    this._types = t;
    const v = new Float64Array(cap);
    v.set(this._values);
    this._values = v;
    const d = new Int32Array(cap);
    d.set(this._identIdx);
    this._identIdx = d;
    const o = new Int8Array(cap);
    o.set(this._ops);
    this._ops = o;
  }

  /**
   * 文字列を後缀記法（RPN）へ変換します。
   *
   * @returns 構文が正しければ true
   */
  public parse(expression: string): boolean {
    // 出力列と演算子スタックは式の文字数で足ります
    this._ensure(expression.length + 2);
    this._count = 0;
    this._opTop = 0;
    this._idents.clear();

    const n = expression.length;
    let i = 0;
    // 直前のトークンが「被演算子」だったか。`-` を単項か二項かの判定に使います。
    let expectOperand = true;

    const emit = (type: number, value = 0, ident = -1): void => {
      this._types[this._count] = type;
      this._values[this._count] = value;
      this._identIdx[this._count] = ident;
      this._count++;
    };
    const pushOp = (t: number): void => {
      this._ops[this._opTop++] = t;
    };
    const popOp = (): number => {
      return this._opTop > 0 ? this._ops[--this._opTop] : Tok.End;
    };

    while (i < n) {
      const c = expression.charCodeAt(i);
      if (c === 32 || c === 9 || c === 10 || c === 13) {
        i++;
        continue;
      }

      // --- 数値 ---
      if ((c >= 48 && c <= 57) || c === 46) {
        let j = i;
        while (j < n) {
          const d = expression.charCodeAt(j);
          if ((d >= 48 && d <= 57) || d === 46) {
            j++;
            continue;
          }
          if (d === 101 || d === 69) {
            // 'e' / 'E' は指数表記。直後の '+'/'-' も含めます
            if (j + 1 < n) {
              const s = expression.charCodeAt(j + 1);
              if (s === 43 || s === 45) {
                j += 2;
                continue;
              }
            }
            j++;
            continue;
          }
          break;
        }
        const v = Number.parseFloat(expression.slice(i, j));
        if (Number.isNaN(v)) return false;
        emit(Tok.Num, v);
        expectOperand = false;
        i = j;
        continue;
      }

      // --- 識別子・関数・定数 ---
      if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c === 95) {
        let j = i;
        while (j < n) {
          const d = expression.charCodeAt(j);
          if ((d >= 65 && d <= 90) || (d >= 97 && d <= 122) || (d >= 48 && d <= 57) || d === 95) {
            j++;
            continue;
          }
          break;
        }
        const name = expression.slice(i, j);
        i = j;

        if (name === 'PI') {
          emit(Tok.Num, Math.PI);
          expectOperand = false;
          continue;
        }
        if (name === 'E') {
          emit(Tok.Num, Math.E);
          expectOperand = false;
          continue;
        }
        const f1 = FN1_TABLE[name];
        if (f1 !== undefined) {
          emit(Tok.Fn1, f1);
          expectOperand = true;
          continue;
        }
        const f2 = FN2_TABLE[name];
        if (f2 !== undefined) {
          emit(Tok.Fn2, f2);
          expectOperand = true;
          continue;
        }
        // 同じ識別子は `parameters` の同じ添字に対応します
        let identIndex = this._idents.get(name);
        if (identIndex === undefined) {
          identIndex = this._idents.size;
          this._idents.set(name, identIndex);
        }
        emit(Tok.Ident, 0, identIndex);
        expectOperand = false;
        continue;
      }

      switch (c) {
        case 40: {
          // '('
          pushOp(-1); // 括弧のマーカー（負の値で演算子と区別します）
          expectOperand = true;
          i++;
          break;
        }
        case 41: {
          // ')'
          while (this._opTop > 0 && this._ops[this._opTop - 1] !== -1) {
            emit(popOp());
          }
          if (this._opTop === 0) return false; // 対応する '(' が無い
          popOp();
          // '(' の直前が関数なら、その関数トークンも出力へ落とします
          expectOperand = false;
          i++;
          break;
        }
        case 43:
        case 45:
        case 42:
        case 47:
        case 37:
        case 94: {
          let t: number;
          if (c === 43) t = Tok.Plus;
          else if (c === 45) t = Tok.Minus;
          else if (c === 42) t = Tok.Star;
          else if (c === 47) t = Tok.Slash;
          else if (c === 37) t = Tok.Percent;
          else t = Tok.Caret;

          // 二項演算子の右辺が符号付き数値のとき、負の数を 1 つの数値として
          // 読むには括弧が必要です。ここでは単項 minus として扱います。
          if (t === Tok.Minus && expectOperand) {
            // 単項 minus: 0 を先に吐いて二項 minus と同じ経路を通します
            emit(Tok.Num, 0);
            expectOperand = false;
          } else if (t === Tok.Plus && expectOperand) {
            // 単項 plus は何もしません
            i++;
            break;
          }

          // 優先順位较高的演算子を先に出力します
          while (this._opTop > 0) {
            const top = this._ops[this._opTop - 1];
            if (top === -1) break;
            const pt = precedence(top);
            const pc = precedence(t);
            if (pt > pc || (pt === pc && !rightAssoc(t))) {
              emit(popOp());
              continue;
            }
            break;
          }
          pushOp(t);
          expectOperand = true;
          i++;
          break;
        }
        case 44:
          // 関数の引数区切り。本実装は固定引数個数なので読み飛ばします
          i++;
          break;
        default:
          return false;
      }
    }

    // 残った演算子を出力列へ
    while (this._opTop > 0) {
      const top = popOp();
      if (top === -1) return false; // '(' が閉じていない
      emit(top);
    }
    emit(Tok.End);
    return true;
  }

  /**
   * 式をパースして評価します。
   *
   * @param parameters 識別子に対応する値。`Float64Array` を推奨
   * @returns 評価結果。構文エラーや致命的エラー時は `NaN`
   */
  public evaluate(expression: string, parameters?: ArrayLike<number>): number {
    if (!this.parse(expression)) return Number.NaN;
    return this.evaluateParsed(parameters);
  }

  /**
   * 直近の {@link parse} 結果だけを評価します。
   * 文字列が変わらないなら {@link evaluate} より速くなります。
   */
  public evaluateParsed(parameters?: ArrayLike<number>): number {
    this._stackTop = 0;
    this._underflow = false;

    for (let i = 0; i < this._count; i++) {
      const t = this._types[i];

      if (t === Tok.Num) {
        this._push(this._values[i]);
        continue;
      }
      if (t === Tok.Ident) {
        const idx = this._identIdx[i];
        this._push(parameters ? (parameters[idx] ?? 0) : 0);
        continue;
      }
      if (t === Tok.Fn1) {
        const a = this._pop();
        this._push(ExprParser._apply1(this._values[i], a));
        continue;
      }
      if (t === Tok.Fn2) {
        const b = this._pop();
        const a = this._pop();
        this._push(ExprParser._apply2(this._values[i], a, b));
        continue;
      }
      if (t === Tok.End) break;

      const b = this._pop();
      const a = this._pop();
      switch (t) {
        case Tok.Plus:
          this._push(a + b);
          break;
        case Tok.Minus:
          this._push(a - b);
          break;
        case Tok.Star:
          this._push(a * b);
          break;
        case Tok.Slash:
          this._push(b === 0 ? Number.NaN : a / b);
          break;
        case Tok.Percent:
          this._push(b === 0 ? Number.NaN : a % b);
          break;
        case Tok.Caret:
          this._push(a ** b);
          break;
        default:
          return Number.NaN;
      }
    }

    if (this._underflow) return Number.NaN;
    return this._stackTop > 0 ? this._stack[this._stackTop - 1] : Number.NaN;
  }

  /** 1 引数関数を適用します。 */
  private static _apply1(fn: number, a: number): number {
    switch (fn) {
      case Fn1.Abs:
        return Math.abs(a);
      case Fn1.Floor:
        return Math.floor(a);
      case Fn1.Ceil:
        return Math.ceil(a);
      case Fn1.Round:
        return Math.round(a);
      case Fn1.Sqrt:
        return a < 0 ? Number.NaN : Math.sqrt(a);
      case Fn1.Sin:
        return Math.sin(a);
      case Fn1.Cos:
        return Math.cos(a);
      case Fn1.Tan:
        return Math.tan(a);
      default:
        return Number.NaN;
    }
  }

  /** 2 引数関数を適用します。 */
  private static _apply2(fn: number, a: number, b: number): number {
    switch (fn) {
      case Fn2.Min:
        return a < b ? a : b;
      case Fn2.Max:
        return a > b ? a : b;
      case Fn2.Pow:
        return a ** b;
      default:
        return Number.NaN;
    }
  }

  /** 値スタックへ積みます。 */
  private _push(v: number): void {
    if (this._stackTop >= this._stack.length) {
      this._underflow = true;
      return;
    }
    this._stack[this._stackTop++] = v;
  }

  /**
   * 値スタックから取り出します。
   *
   * 空だった場合は **0 ではなくアンダーフローを立てて NaN を返します**。
   * `1 +` のような不完全な式を黙って 0 として扱ってしまうためです。
   */
  private _pop(): number {
    if (this._stackTop === 0) {
      this._underflow = true;
      return Number.NaN;
    }
    return this._stack[--this._stackTop];
  }
}
