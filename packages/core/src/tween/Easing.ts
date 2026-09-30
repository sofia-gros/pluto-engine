/**
 * @file Easing.ts
 * @description
 * Phaser 互換のイージング関数をテーブルとして提供します。
 *
 * 設計方針:
 *  - すべてのイージングは「初期化時に量子化し、毎フレームは添字参照のみ」で動きます。
 *  - テーブルは module スコープで 1 度だけ確保し、以降は読み取り専用です。
 *  - 実行時に new しないため、ゼロアロケーションの掟を守れます。
 *  - 種類を増やさず 1 本の Float32Array に詰めることで、
  *    参照の局所性を保ちつつ、メモリも節約できます。
 */

/** 各イージングのサンプル数。補間結果の精度はこの値に依存します。 */
const SAMPLES = 64;

/**
 * イージングの種類。
 * Phaser の名前をそのまま enum 名にしています。
 */
export const enum EaseKind {
  Linear = 0,
  QuadIn = 1,
  QuadOut = 2,
  QuadInOut = 3,
  CubicIn = 4,
  CubicOut = 5,
  CubicInOut = 6,
  QuartIn = 7,
  QuartOut = 8,
  QuartInOut = 9,
  SineIn = 10,
  SineOut = 11,
  SineInOut = 12,
  ExpoIn = 13,
  ExpoOut = 14,
  ExpoInOut = 15,
  CircIn = 16,
  CircOut = 17,
  CircInOut = 18,
  BackIn = 19,
  BackOut = 20,
  BackInOut = 21,
  BounceIn = 22,
  BounceOut = 23,
  BounceInOut = 24,
  ElasticIn = 25,
  ElasticOut = 26,
  ElasticInOut = 27,
  Count = 28,
}

/** 名前から種類を求めるための表。初期化時に 1 度だけ埋めます。 */
const easeByName = new Map<string, EaseKind>();

/** テーブルの総サンプル数 */
const TOTAL = SAMPLES * EaseKind.Count;

/**
 * 量子化済みのイージングテーブル。
 * index = kind * SAMPLES + sampleIndex
 */
const table = new Float32Array(TOTAL);

const PI = Math.PI;
// Back / Elastic の係数です。
const C1 = 1.70158;
const C2 = C1 * 1.525;
const C3 = C1 + 1;
const C4 = (2 * PI) / 3;
const C5 = (2 * PI) / 4.5;
const N1 = 7.5625;
const D1 = 2.75;

/** 関数の形。t は 0 から 1 です。 */
type EaseFn = (t: number) => number;

const fns: EaseFn[] = [
  (t) => t,
  (t) => t * t,
  (t) => 1 - (1 - t) * (1 - t),
  (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  (t) => t * t * t,
  (t) => 1 - Math.pow(1 - t, 3),
  (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  (t) => t * t * t * t,
  (t) => 1 - Math.pow(1 - t, 4),
  (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
  (t) => 1 - Math.cos((t * PI) / 2),
  (t) => Math.sin((t * PI) / 2),
  (t) => -(Math.cos(PI * t) - 1) / 2,
  (t) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  (t) =>
    t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? Math.pow(2, 20 * t - 10) / 2
          : (2 - Math.pow(2, -20 * t + 10)) / 2,
  (t) => 1 - Math.sqrt(1 - Math.pow(t, 2)),
  (t) => Math.sqrt(1 - Math.pow(t - 1, 2)),
  (t) =>
    t < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,
  (t) => C3 * t * t * t - C1 * t * t,
  (t) => 1 + C3 * Math.pow(t - 1, 3) + C1 * Math.pow(t - 1, 2),
  (t) =>
    t < 0.5
      ? (Math.pow(2 * t, 2) * ((C2 + 1) * 2 * t - C2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((C2 + 1) * (t * 2 - 2) + C2) + 2) / 2,
  (t) => bounceOut(1 - t),
  (t) => bounceOut(t),
  (t) => (t < 0.5 ? (1 - bounceOut(1 - 2 * t)) / 2 : (1 + bounceOut(2 * t - 1)) / 2),
  (t) => (t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * C4)),
  (t) => (t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * C4) + 1),
  (t) =>
    t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * C5)) / 2
          : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * C5)) / 2 + 1,
];

function bounceOut(t: number): number {
  if (t < 1 / D1) return N1 * t * t;
  if (t < 2 / D1) {
    const u = t - 1.5 / D1;
    return N1 * u * u + 0.75;
  }
  if (t < 2.5 / D1) {
    const u = t - 2.25 / D1;
    return N1 * u * u + 0.9375;
  }
  const u = t - 2.625 / D1;
  return N1 * u * u + 0.984375;
}

/**
 * テーブルを 1 度だけ構築します。
 * 複数回呼んでも再構築しません (呼び出し側で状態を書き換えません)。
 */
let initialized = false;
function ensureInitialized(): void {
  if (initialized) return;
  initialized = true;

  for (let k = 0; k < EaseKind.Count; k++) {
    const fn = fns[k];
    const base = k * SAMPLES;
    for (let i = 0; i < SAMPLES; i++) {
      const t = i / (SAMPLES - 1);
      table[base + i] = fn(t);
    }
  }

  // `quadin` / `quadout` / `quadinout` のような検索キーを登録します。
  // 配列順は EaseKind の並びと一致しています。
  const simpleNames = [
    'Linear',
    'QuadIn',
    'QuadOut',
    'QuadInOut',
    'CubicIn',
    'CubicOut',
    'CubicInOut',
    'QuartIn',
    'QuartOut',
    'QuartInOut',
    'SineIn',
    'SineOut',
    'SineInOut',
    'ExpoIn',
    'ExpoOut',
    'ExpoInOut',
    'CircIn',
    'CircOut',
    'CircInOut',
    'BackIn',
    'BackOut',
    'BackInOut',
    'BounceIn',
    'BounceOut',
    'BounceInOut',
    'ElasticIn',
    'ElasticOut',
    'ElasticInOut',
  ];
  for (let k = 0; k < simpleNames.length; k++) {
    easeByName.set(simpleNames[k].toLowerCase(), k as EaseKind);
  }
  // エイリアスを登録します (Phaser の呼び方に合わせたもの)
  const aliases: Record<string, EaseKind> = {
    'quad.in': EaseKind.QuadIn,
    'quad.out': EaseKind.QuadOut,
    'quad.inout': EaseKind.QuadInOut,
    'cubic.in': EaseKind.CubicIn,
    'cubic.out': EaseKind.CubicOut,
    'cubic.inout': EaseKind.CubicInOut,
    'sine.in': EaseKind.SineIn,
    'sine.out': EaseKind.SineOut,
    'sine.inout': EaseKind.SineInOut,
    'expo.in': EaseKind.ExpoIn,
    'expo.out': EaseKind.ExpoOut,
    'expo.inout': EaseKind.ExpoInOut,
    'circ.in': EaseKind.CircIn,
    'circ.out': EaseKind.CircOut,
    'circ.inout': EaseKind.CircInOut,
    'back.in': EaseKind.BackIn,
    'back.out': EaseKind.BackOut,
    'back.inout': EaseKind.BackInOut,
    'bounce.in': EaseKind.BounceIn,
    'bounce.out': EaseKind.BounceOut,
    'bounce.inout': EaseKind.BounceInOut,
    'elastic.in': EaseKind.ElasticIn,
    'elastic.out': EaseKind.ElasticOut,
    'elastic.inout': EaseKind.ElasticInOut,
    quadin: EaseKind.QuadIn,
    quadout: EaseKind.QuadOut,
    quadinout: EaseKind.QuadInOut,
    cubicin: EaseKind.CubicIn,
    cubicout: EaseKind.CubicOut,
    cubicinout: EaseKind.CubicInOut,
  };
  for (const key of Object.keys(aliases)) {
    easeByName.set(key, aliases[key]);
  }
}

ensureInitialized();

/**
 * 名前からイージングの種類を取得します。
 * 未知の名前は Linear として扱います。
 */
export function getEaseKind(name: string | undefined): EaseKind {
  if (name === undefined) return EaseKind.Linear;
  if (typeof name === 'number') return name as EaseKind;

  const key = normalizeName(String(name));
  const found = easeByName.get(key);
  return found === undefined ? EaseKind.Linear : found;
}

/**
 * イージング名を検索キーに正規化します。
 *
 * Phaser の呼び方は `Quad.easeIn` / `Cubic.easeOut` / `Sine.easeInOut` のように
 * カテゴリと kind が `.` と `ease` で繋がっています。区切りだけ取り除いて
 * `quad.in` のような形へ落とすので、エイリアス側での取り違えが起きません。
 */
function normalizeName(raw: string): string {
  let s = raw.toLowerCase().replace(/[\s_-]/g, '');
  // 末尾の "ease" を落として "in" / "out" / "inout" だけを残す形にします。
  const dot = s.lastIndexOf('.');
  if (dot >= 0) {
    s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/^ease/, '');
  }
  return s;
}

/**
 * イージングを評価します。tables への添字参照 1 回で済みます。
 *
 * @param kind イージングの種類
 * @param t 0 から 1 の進行度
 */
export function evaluateEase(kind: EaseKind, t: number): number {
  const base = kind * SAMPLES;
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  // 線形補間でサンプルを引きます。端からのクランプは行いません。
  const f = t * (SAMPLES - 1);
  const i0 = f | 0;
  const i1 = i0 + 1 < SAMPLES ? i0 + 1 : SAMPLES - 1;
  const frac = f - i0;
  const a = table[base + i0];
  const b = table[base + i1];
  return a + (b - a) * frac;
}
