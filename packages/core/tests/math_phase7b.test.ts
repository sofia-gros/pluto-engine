import { describe, expect, it } from 'vitest';
import { ExprParser, RAY_HIT_STRIDE, RayHit, RayShapeKind, Raycaster } from '../src/index';

describe('Phase 7b — Raycaster (SoA 走査)', () => {
  it('矩形に交差する（斜め右下から矩形へ）', () => {
    // 矩形 1 個: [x=10, y=10, w=10, h=10]
    const rects = new Float32Array([10, 10, 10, 10]);
    const line = new Float32Array([0, 0, 100, 100]);
    const out = new Float32Array(RAY_HIT_STRIDE);
    expect(Raycaster.intersectLine(line, rects, RayShapeKind.Rect === 0 ? 4 : 4, out)).toBe(1);
    // 線分は (0,0) から (100,100)。矩形の左上の角 (10,10) を最初に通ります。
    expect(out[RayHit.X]).toBeCloseTo(10);
    expect(out[RayHit.Y]).toBeCloseTo(10);
    expect(out[RayHit.T]).toBeCloseTo(0.1);
    expect(out[RayHit.ShapeIndex]).toBe(0);
    // 左から入るので法線は (-1, 0)
    expect(out[RayHit.NormalX]).toBeCloseTo(-1);
    expect(out[RayHit.NormalY]).toBeCloseTo(0);
  });

  it('矩形の外を通る線分は交差しない', () => {
    const rects = new Float32Array([10, 10, 10, 10]);
    const line = new Float32Array([0, 0, 5, 5]);
    const out = new Float32Array(RAY_HIT_STRIDE);
    expect(Raycaster.intersectLine(line, rects, 4, out)).toBe(0);
  });

  it('円に交差する（法線は外向き）', () => {
    // 円 1 個: [cx=50, cy=50, r=10]
    const circles = new Float32Array([50, 50, 10]);
    const line = new Float32Array([0, 50, 100, 50]);
    const out = new Float32Array(RAY_HIT_STRIDE);
    expect(Raycaster.intersectLine(line, circles, 3, out)).toBe(1);
    expect(out[RayHit.X]).toBeCloseTo(40);
    expect(out[RayHit.Y]).toBeCloseTo(50);
    // 中心から外向き
    expect(out[RayHit.NormalX]).toBeCloseTo(-1);
    expect(out[RayHit.NormalY]).toBeCloseTo(0);
  });

  it('円を貫通しない線分は交差しない', () => {
    const circles = new Float32Array([50, 50, 10]);
    // y = 65 は中心から 15 離れているので円に触れません
    const line = new Float32Array([0, 65, 100, 65]);
    const out = new Float32Array(RAY_HIT_STRIDE);
    expect(Raycaster.intersectLine(line, circles, 3, out)).toBe(0);
  });

  it('円に入る位置が線分の内側のときは手前の交点を返す', () => {
    const circles = new Float32Array([50, 50, 10]);
    // 始点 (45, 50) は中心から 5 離れているので円内
    const line = new Float32Array([45, 50, 100, 50]);
    const out = new Float32Array(RAY_HIT_STRIDE);
    expect(Raycaster.intersectLine(line, circles, 3, out)).toBe(1);
    // 始点が内側なので、まず外へ出る (60, 50) が最初の交点
    expect(out[RayHit.X]).toBeCloseTo(60);
  });

  it('三角形に交差する', () => {
    // 三角形 1 個: (0,10) (10,10) (5,0)
    const tris = new Float32Array([0, 10, 10, 10, 5, 0]);
    const line = new Float32Array([7, -20, 7, 30]);
    const out = new Float32Array(RAY_HIT_STRIDE * 2);
    expect(Raycaster.intersectLine(line, tris, 6, out)).toBe(1);
    // x=7 は右の辺 (10,10)-(5,0) を y=4 で横切ります
    expect(out[RayHit.X]).toBeCloseTo(7);
    expect(out[RayHit.Y]).toBeCloseTo(4);
    expect(out[RayHit.T]).toBeCloseTo(0.48);
  });

  it('三角形の横を通る線分は交差しない', () => {
    const tris = new Float32Array([0, 10, 10, 10, 5, 0]);
    // x=15 は三角形の外
    const line = new Float32Array([15, -20, 15, 30]);
    const out = new Float32Array(RAY_HIT_STRIDE);
    expect(Raycaster.intersectLine(line, tris, 6, out)).toBe(0);
  });

  it('複数図形を走査して交差数とインデックスを返す', () => {
    // 矩形 3 個。1 番目と 3 番目に交差する配置
    const rects = new Float32Array([
      10,
      10,
      10,
      10, // (10,10)-(20,20)
      200,
      200,
      10,
      10, // 遠く
      30,
      30,
      10,
      10, // (30,30)-(40,40)
    ]);
    const line = new Float32Array([0, 0, 100, 100]);
    const out = new Float32Array(RAY_HIT_STRIDE * 3);
    const n = Raycaster.intersectLine(line, rects, 4, out);
    expect(n).toBe(2);
    expect(out[RAY_HIT_STRIDE + RayHit.ShapeIndex]).toBe(2);
  });

  it('out が小さい場合は入るだけ詰めて stride を返す', () => {
    const rects = new Float32Array([
      10, 10, 10, 10, 20, 20, 10, 10, 30, 30, 10, 10, 40, 40, 10, 10,
    ]);
    const line = new Float32Array([0, 0, 100, 100]);
    // 1 件分しかない
    const out = new Float32Array(RAY_HIT_STRIDE);
    expect(Raycaster.intersectLine(line, rects, 4, out)).toBe(1);
  });

  it('未対応の stride は静かに無視する', () => {
    const shapes = new Float32Array([1, 2, 3, 4, 5, 6, 7]);
    const line = new Float32Array([0, 0, 100, 100]);
    const out = new Float32Array(RAY_HIT_STRIDE);
    expect(Raycaster.intersectLine(line, shapes, 5, out)).toBe(0);
  });

  it('線分群と交差する', () => {
    // 縦線 2 本: x=30 と x=60
    const segs = new Float32Array([30, 0, 30, 100, 60, 0, 60, 100]);
    const line = new Float32Array([0, 50, 100, 50]);
    const out = new Float32Array(RAY_HIT_STRIDE * 2);
    const n = Raycaster.intersectLineSegments(line, segs, out);
    expect(n).toBe(2);
    expect(out[RayHit.X]).toBeCloseTo(30);
    expect(out[RAY_HIT_STRIDE + RayHit.X]).toBeCloseTo(60);
    expect(out[RAY_HIT_STRIDE + RayHit.ShapeIndex]).toBe(1);
  });

  it('平行な線分は交差とみなさない', () => {
    const segs = new Float32Array([0, 10, 100, 10]);
    const line = new Float32Array([0, 0, 100, 0]);
    const out = new Float32Array(RAY_HIT_STRIDE);
    expect(Raycaster.intersectLineSegments(line, segs, out)).toBe(0);
  });

  it('交差点と t が逆順の線でも正しい（双方向）', () => {
    const rects = new Float32Array([10, 10, 10, 10]);
    const line = new Float32Array([100, 100, 0, 0]);
    const out = new Float32Array(RAY_HIT_STRIDE);
    expect(Raycaster.intersectLine(line, rects, 4, out)).toBe(1);
    expect(out[RayHit.X]).toBeCloseTo(20);
    expect(out[RayHit.Y]).toBeCloseTo(20);
  });
});

describe('Phase 7b — ExprParser (値スタック SoA)', () => {
  it('四則演算を評価する', () => {
    const p = new ExprParser();
    expect(p.evaluate('1 + 2')).toBe(3);
    expect(p.evaluate('10 - 4')).toBe(6);
    expect(p.evaluate('3 * 4')).toBe(12);
    expect(p.evaluate('9 / 3')).toBe(3);
  });

  it('優先順位と括弧を尊重する', () => {
    const p = new ExprParser();
    expect(p.evaluate('2 + 3 * 4')).toBe(14);
    expect(p.evaluate('(2 + 3) * 4')).toBe(20);
    expect(p.evaluate('10 - 2 - 3')).toBe(5);
    expect(p.evaluate('100 / 10 / 2')).toBe(5);
  });

  it('累乗と剰余を評価する', () => {
    const p = new ExprParser();
    expect(p.evaluate('2 ^ 10')).toBe(1024);
    expect(p.evaluate('17 % 5')).toBe(2);
  });

  it('定数 PI と E を展開する', () => {
    const p = new ExprParser();
    expect(p.evaluate('PI')).toBeCloseTo(Math.PI);
    expect(p.evaluate('E')).toBeCloseTo(Math.E);
    expect(p.evaluate('2 * PI')).toBeCloseTo(2 * Math.PI);
  });

  it('指数表記を数値として読む', () => {
    const p = new ExprParser();
    expect(p.evaluate('1e3')).toBe(1000);
    expect(p.evaluate('1.5e2')).toBe(150);
    expect(p.evaluate('2e-2')).toBeCloseTo(0.02);
  });

  it('識別子は parameters の添字で解決する', () => {
    const p = new ExprParser();
    const params = new Float64Array([3, 4]);
    // a -> params[0] = 3, b -> params[1] = 4
    expect(p.evaluate('a * b', params)).toBe(12);
    expect(p.evaluate('a + b + a', params)).toBe(10);
  });

  it('parameters を渡さない識別子は 0 になる', () => {
    const p = new ExprParser();
    expect(p.evaluate('a + 1')).toBe(1);
  });

  it('0 による除算は NaN を返す（Infinity にしない）', () => {
    const p = new ExprParser();
    expect(p.evaluate('1 / 0')).toBeNaN();
    expect(p.evaluate('1 % 0')).toBeNaN();
  });

  it('不正な構文は NaN を返す', () => {
    const p = new ExprParser();
    expect(p.evaluate('1 +')).toBeNaN();
    expect(p.evaluate('(1 + 2')).toBeNaN();
    expect(p.evaluate('@#$')).toBeNaN();
  });

  it('空式は NaN を返す', () => {
    const p = new ExprParser();
    expect(p.evaluate('')).toBeNaN();
  });

  it('parse はトークン列を生成し、evaluateParsed は再利用できる', () => {
    const p = new ExprParser();
    expect(p.parse('1 + 2')).toBe(true);
    expect(p.tokenCount).toBe(4); // 1, +, 2, End
    const params = new Float64Array([10]);
    expect(p.evaluateParsed(params)).toBe(3);
    // パラメータを変えてもトークン列は変わらない
    expect(p.evaluateParsed(new Float64Array([99]))).toBe(3);
  });

  it('トークンバッファが式より短い場合自動で拡張する', () => {
    const p = new ExprParser(8); // 小さめに確保
    const long = '1+1+1+1+1+1+1+1+1+1+1+1';
    expect(p.evaluate(long)).toBe(12);
    expect(p.tokenCount).toBe(long.length + 1);
  });
});
