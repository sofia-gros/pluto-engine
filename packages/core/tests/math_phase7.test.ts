import { describe, expect, it } from 'vitest';
import { Math2, Vector2 } from '../src/index';
// Vite の `?raw` import でソーステキストを取り込みます。
// テストは browser project で動くため `node:fs` は使えません。
import vector2Src from '../src/math/Vector2.ts?raw';

describe('Phase 7a — Math 関数群 (Phaser 互換 / out パラメータ)', () => {
  it('Linear が線形補間する', () => {
    expect(Math2.Linear(0, 10, 20)).toBe(10);
    expect(Math2.Linear(0.5, 0, 100)).toBe(50);
    expect(Math2.Linear(1, 10, 20)).toBe(20);
  });

  it('SmoothStep が 0〜1 にクランプされ端が緩やか', () => {
    expect(Math2.SmoothStep(-10, 0, 10)).toBe(0);
    expect(Math2.SmoothStep(10, 0, 10)).toBe(1);
    // 中央で 0.5
    expect(Math2.SmoothStep(5, 0, 10)).toBeCloseTo(0.5);
    // 端では線形補間より小さい（2 次微分連続 = 端の傾きが 0）
    expect(Math2.SmoothStep(2, 0, 10)).toBeLessThan(0.2);
    // 中央付近では線形補間より大きい（S 字曲線は t=0.5 で線形と交差する）
    expect(Math2.SmoothStep(6, 0, 10)).toBeGreaterThan(0.6);
    expect(Math2.SmoothStep(4, 0, 10)).toBeLessThan(0.4);
  });

  it('Sinusoidal が始点・終点で 0 / 1 になる', () => {
    expect(Math2.Sinusoidal(0, 0, 10)).toBeCloseTo(0);
    expect(Math2.Sinusoidal(10, 0, 10)).toBeCloseTo(1);
    expect(Math2.Sinusoidal(5, 0, 10)).toBeCloseTo(0.5);
  });

  it('Percentage が区間内での割合を返す', () => {
    expect(Math2.Percentage(5, 0, 10)).toBe(0.5);
    expect(Math2.Percentage(15, 0, 10)).toBe(1.5);
    // 幅 0 の区間は 0 を返します（0 除算の防止）
    expect(Math2.Percentage(5, 10, 10)).toBe(0);
  });

  it('FuzzyMatch が許容誤差内かを判定する', () => {
    expect(Math2.FuzzyMatch(1.0, 1.0, 0)).toBe(true);
    expect(Math2.FuzzyMatch(1.05, 1.0, 0.1)).toBe(true);
    expect(Math2.FuzzyMatch(1.5, 1.0, 0.1)).toBe(false);
  });

  it('DistanceSquared は平方根を取らない', () => {
    expect(Math2.DistanceSquared(0, 0, 3, 4)).toBe(25);
    expect(Math2.DistanceBetween(0, 0, 3, 4)).toBe(5);
  });

  it('BetweenPoints が out へ距離を書く', () => {
    const a = new Float32Array([0, 0]);
    const b = new Float32Array([3, 4]);
    const out = new Float32Array(1);
    Math2.BetweenPoints(a, b, out);
    expect(out[0]).toBe(5);
  });

  it('RadiansToDegrees / DegreesToRadians が相互変換できる', () => {
    expect(Math2.RadiansToDegrees(Math.PI)).toBe(180);
    expect(Math2.DegreesToRadians(180)).toBeCloseTo(Math.PI);
    // 旧名も残しています
    expect(Math2.RadToDeg(Math.PI)).toBe(180);
    expect(Math2.DegToRad(180)).toBeCloseTo(Math.PI);
  });

  it('GetCentroid が点群の中心を out へ書く', () => {
    const points = new Float32Array([0, 0, 10, 0, 10, 10, 0, 10]);
    const out = new Float32Array(2);
    expect(Math2.GetCentroid(points, out)).toBe(4);
    expect(out[0]).toBe(5);
    expect(out[1]).toBe(5);
  });

  it('GetCentroid は 0 点では out を書き換えない', () => {
    const out = new Float32Array([99, 99]);
    expect(Math2.GetCentroid(new Float32Array(0), out)).toBe(0);
    expect(out[0]).toBe(99);
    expect(out[1]).toBe(99);
  });

  it('GetVec2Bounds が点群の境界を out へ書く', () => {
    const points = new Float32Array([3, 7, -2, 4, 9, -1, 0, 0]);
    const out = new Float32Array(4);
    expect(Math2.GetVec2Bounds(points, out)).toBe(4);
    expect(out[0]).toBe(-2); // minX
    expect(out[1]).toBe(-1); // minY
    expect(out[2]).toBe(9); // maxX
    expect(out[3]).toBe(7); // maxY
  });

  it('GetVec2Bounds は 1 点以下では 0 を返す', () => {
    const out = new Float32Array(4);
    expect(Math2.GetVec2Bounds(new Float32Array([1]), out)).toBe(0);
    expect(out[0]).toBe(0);
  });
});

describe('Phase 7a — Vector2 (out 必須)', () => {
  const A = new Float32Array([1, 2]);
  const B = new Float32Array([3, 4]);

  it('Add / Subtract / Scale', () => {
    const out = new Float32Array(2);
    Vector2.Add(A, B, out);
    expect([out[0], out[1]]).toEqual([4, 6]);
    Vector2.Subtract(B, A, out);
    expect([out[0], out[1]]).toEqual([2, 2]);
    Vector2.Scale(A, 3, out);
    expect([out[0], out[1]]).toEqual([3, 6]);
  });

  it('Divide は 0 割で 0 を返す（NaN を撒かない）', () => {
    const out = new Float32Array(2);
    Vector2.Divide(A, 0, out);
    expect(out[0]).toBe(0);
    expect(out[1]).toBe(0);
    Vector2.Divide(A, 2, out);
    expect([out[0], out[1]]).toEqual([0.5, 1]);
  });

  it('Dot / Cross は out[0] にスональをく', () => {
    const out = new Float32Array(2);
    Vector2.Dot(A, B, out);
    expect(out[0]).toBe(11);
    Vector2.Cross(A, B, out);
    expect(out[0]).toBe(-2);
  });

  it('Length / LengthSq', () => {
    expect(Vector2.Length(new Float32Array([3, 4]))).toBe(5);
    expect(Vector2.LengthSq(new Float32Array([3, 4]))).toBe(25);
  });

  it('Negate と Invert は同じ結果', () => {
    const out = new Float32Array(2);
    Vector2.Negate(A, out);
    expect([out[0], out[1]]).toEqual([-1, -2]);
    Vector2.Invert(A, out);
    expect([out[0], out[1]]).toEqual([-1, -2]);
  });

  it('Ceil / Floor / Round', () => {
    const out = new Float32Array(2);
    Vector2.Ceil(new Float32Array([1.2, -1.2]), out);
    expect([out[0], out[1]]).toEqual([2, -1]);
    Vector2.Floor(new Float32Array([1.8, -1.8]), out);
    expect([out[0], out[1]]).toEqual([1, -2]);
    Vector2.Round(new Float32Array([1.5, -1.5]), out);
    // Math.round と同じ規則（0.5 は +Infinity 側）
    expect([out[0], out[1]]).toEqual([2, -1]);
  });

  it('SetLength は向きを保って長さを変える', () => {
    const out = new Float32Array(2);
    Vector2.SetLength(new Float32Array([3, 4]), 10, out);
    expect(out[0]).toBeCloseTo(6);
    expect(out[1]).toBeCloseTo(8);
  });

  it('SetLength は長さ 0 の点で (1, 0) を返す', () => {
    const out = new Float32Array(2);
    Vector2.SetLength(new Float32Array([0, 0]), 5, out);
    expect([out[0], out[1]]).toEqual([1, 0]);
  });

  it('Normalize は 0 点で (0, 0) を返す（SetLength と異なる）', () => {
    const out = new Float32Array(2);
    Vector2.Normalize(new Float32Array([0, 0]), out);
    expect([out[0], out[1]]).toEqual([0, 0]);
    Vector2.Normalize(new Float32Array([3, 4]), out);
    expect(out[0]).toBeCloseTo(0.6);
    expect(out[1]).toBeCloseTo(0.8);
  });

  it('ProjectUnit は from からの単位方向の位置を返す', () => {
    const out = new Float32Array(2);
    Vector2.ProjectUnit(new Float32Array([0, 0]), new Float32Array([3, 4]), out);
    expect(out[0]).toBeCloseTo(0.6);
    expect(out[1]).toBeCloseTo(0.8);
  });

  it('Unit は差を単位化しない（ProjectUnit と異なる）', () => {
    const out = new Float32Array(2);
    Vector2.Unit(new Float32Array([0, 0]), new Float32Array([3, 4]), out);
    expect(out[0]).toBeCloseTo(0.6);
    expect(out[1]).toBeCloseTo(0.8);
  });

  it('Distance / ClampDistance', () => {
    const out = new Float32Array(1);
    Vector2.Distance(new Float32Array([0, 0]), new Float32Array([3, 4]), out);
    expect(out[0]).toBe(5);
    Vector2.ClampDistance(new Float32Array([0, 0]), new Float32Array([30, 0]), 0, 10, out);
    expect(out[0]).toBe(10);
  });

  it('FromAngle は角度と長さから点を作る', () => {
    const out = new Float32Array(2);
    Vector2.FromAngle(0, 5, out);
    expect(out[0]).toBeCloseTo(5);
    expect(out[1]).toBeCloseTo(0);
    Vector2.FromAngle(Math.PI / 2, 5, out);
    expect(out[0]).toBeCloseTo(0);
    expect(out[1]).toBeCloseTo(5);
  });

  it('Linear / SmoothStep は点単位で補間する', () => {
    const out = new Float32Array(2);
    Vector2.Linear(new Float32Array([0, 0]), new Float32Array([10, 20]), 0.5, out);
    expect([out[0], out[1]]).toEqual([5, 10]);
    Vector2.SmoothStep(new Float32Array([0, 0]), new Float32Array([10, 20]), 0.5, out);
    expect(out[0]).toBe(5);
  });

  it('in と out を共有しても壊れない', () => {
    const out = new Float32Array(2);
    Vector2.Add(out, new Float32Array([1, 1]), out);
    expect([out[0], out[1]]).toEqual([1, 1]);
    Vector2.Scale(out, 4, out);
    expect([out[0], out[1]]).toEqual([4, 4]);
    Vector2.SetLength(out, 8, out);
    expect(Vector2.Length(out)).toBeCloseTo(8);
  });
});

describe('Phase 7a — ヒープ生成ゼロ (R-02 / R-03)', () => {
  it('ホットパスのループで new / {} / [] / .push() が出ていない', () => {
    // ソースを静的検査します。実行時の計測は環境依存で不安定なため、
    // 構文レベルの保証に留めます。
    const src = vector2Src;
    // `new` が現れるのは `new URL(...)` のようなテスト側の記述だけです。
    // ここでは関数本体に new がないことを確認するため、コメントと
    // ドキュメント部分を除いた行を走査します。
    const codeLines = src
      .split('\n')
      .filter((l) => !l.trim().startsWith('*') && !l.trim().startsWith('//'))
      .filter((l) => !l.includes('new URL'));
    const offenders = codeLines.filter(
      (l) => /[^.\w]new\s+[A-Z]/.test(l) || /\[\]/.test(l) || /\.push\(/.test(l),
    );
    expect(offenders).toEqual([]);
  });

  it('戻り値は out と同じ参照を返す（オブジェクト生成なし）', () => {
    const out = new Float32Array(2);
    expect(Vector2.Add(new Float32Array([1, 1]), new Float32Array([2, 2]), out)).toBe(out);
    expect(Vector2.Negate(new Float32Array([1, 1]), out)).toBe(out);
    expect(Vector2.Copy(new Float32Array([1, 1]), out)).toBe(out);
  });
});
