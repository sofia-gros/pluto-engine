import { describe, expect, it } from 'vitest';
import { CurveKind, Curves, PATH_POINT_STRIDE, Path } from '../src/index';

describe('Phase 7c — Curves (out パラメータ必須)', () => {
  const out = new Float32Array(2);

  it('Line が線形補間する', () => {
    const c = Curves.from(new Float32Array([0, 0, 10, 20]), CurveKind.Line);
    Curves.getPoint(c, 0, out);
    expect([out[0], out[1]]).toEqual([0, 0]);
    Curves.getPoint(c, 0.5, out);
    expect([out[0], out[1]]).toEqual([5, 10]);
    Curves.getPoint(c, 1, out);
    expect([out[0], out[1]]).toEqual([10, 20]);
  });

  it('QuadraticBezier が両端の制御点を厳密に過する', () => {
    const c = Curves.from(new Float32Array([0, 0, 5, 10, 10, 0]), CurveKind.QuadraticBezier);
    Curves.getPoint(c, 0, out);
    expect([out[0], out[1]]).toEqual([0, 0]);
    Curves.getPoint(c, 1, out);
    expect([out[0], out[1]]).toEqual([10, 0]);
    // t=0.5 は制御点の半分
    Curves.getPoint(c, 0.5, out);
    expect(out[0]).toBeCloseTo(5);
    expect(out[1]).toBeCloseTo(5);
  });

  it('CubicBezier が両端の制御点を厳密に通過する', () => {
    const c = Curves.from(new Float32Array([0, 0, 0, 10, 10, 10, 10, 0]), CurveKind.CubicBezier);
    Curves.getPoint(c, 0, out);
    expect([out[0], out[1]]).toEqual([0, 0]);
    Curves.getPoint(c, 1, out);
    expect([out[0], out[1]]).toEqual([10, 0]);
    Curves.getPoint(c, 0.5, out);
    expect(out[0]).toBeCloseTo(5);
    expect(out[1]).toBeCloseTo(7.5);
  });

  it('CatmullRom が制御点を通る', () => {
    // 4 点を通るスプライン
    const c = Curves.from(new Float32Array([0, 0, 10, 10, 20, 0, 30, 10]), CurveKind.CatmullRom);
    // Catmull-Rom は区間の端点を必ず通ります
    Curves.getPoint(c, 0, out);
    expect([out[0], out[1]]).toEqual([0, 0]);
    Curves.getPoint(c, 1, out);
    expect([out[0], out[1]]).toEqual([30, 10]);
  });

  it('Spline は CatmullRom と同じ評価になる', () => {
    const pts = new Float32Array([0, 0, 10, 10, 20, 0, 30, 10]);
    const spline = Curves.from(pts, CurveKind.Spline);
    const rom = Curves.from(pts, CurveKind.CatmullRom);
    const a = new Float32Array(2);
    const b = new Float32Array(2);
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      Curves.getPoint(spline, t, a);
      Curves.getPoint(rom, t, b);
      expect(a[0]).toBeCloseTo(b[0]);
      expect(a[1]).toBeCloseTo(b[1]);
    }
  });

  it('CatmullRom は 1 点でも評価できる（0 を返さない）', () => {
    const c = Curves.from(new Float32Array([5, 7]), CurveKind.CatmullRom);
    Curves.getPoint(c, 0.5, out);
    expect([out[0], out[1]]).toEqual([5, 7]);
  });

  it('getPoint は out と同じ参照を返す', () => {
    const c = Curves.from(new Float32Array([0, 0, 10, 0]), CurveKind.Line);
    expect(Curves.getPoint(c, 0.5, out)).toBe(out);
  });

  it('getTangent が接線を返す', () => {
    const line = Curves.from(new Float32Array([0, 0, 10, 20]), CurveKind.Line);
    Curves.getTangent(line, 0.5, out);
    expect([out[0], out[1]]).toEqual([10, 20]);

    const quad = Curves.from(new Float32Array([0, 0, 5, 10, 10, 0]), CurveKind.QuadraticBezier);
    // t=0 では 2*(P1-P0) = (10, 20)
    Curves.getTangent(quad, 0, out);
    expect(out[0]).toBeCloseTo(10);
    expect(out[1]).toBeCloseTo(20);

    const cubic = Curves.from(
      new Float32Array([0, 0, 0, 10, 10, 10, 10, 0]),
      CurveKind.CubicBezier,
    );
    // t=0 では 3*(P1-P0) = (0, 30)
    Curves.getTangent(cubic, 0, out);
    expect(out[0]).toBeCloseTo(0);
    expect(out[1]).toBeCloseTo(30);
  });

  it('getTangent は Spline でも差分で求める', () => {
    const c = Curves.from(new Float32Array([0, 0, 10, 10, 20, 0]), CurveKind.Spline);
    Curves.getTangent(c, 0.5, out);
    // 有効な値が入っていることだけ確認します
    expect(Number.isFinite(out[0])).toBe(true);
    expect(Number.isFinite(out[1])).toBe(true);
  });

  it('getLength が弧長を返す', () => {
    // 長さ 10 の線分
    const line = Curves.from(new Float32Array([0, 0, 10, 0]), CurveKind.Line);
    expect(Curves.getLength(line, 64)).toBeCloseTo(10, 3);
  });

  it('getSpacedPoints が等間隔の点を返す', () => {
    const line = Curves.from(new Float32Array([0, 0, 10, 0]), CurveKind.Line);
    const pts = new Float32Array(5 * 2);
    expect(Curves.getSpacedPoints(line, 5, pts)).toBe(5);
    // 5 点が t=0..1 を等分するので間隔は 10/4 = 2.5
    expect(pts[0]).toBeCloseTo(0);
    expect(pts[2]).toBeCloseTo(2.5);
    expect(pts[4]).toBeCloseTo(5);
    expect(pts[6]).toBeCloseTo(7.5);
    expect(pts[8]).toBeCloseTo(10);
  });

  it('getSpacedPoints はバッファが小さいとき 0 を返す', () => {
    const line = Curves.from(new Float32Array([0, 0, 10, 0]), CurveKind.Line);
    expect(Curves.getSpacedPoints(line, 10, new Float32Array(4))).toBe(0);
  });

  it('未知の種別は (0, 0) を返す', () => {
    const c = Curves.from(new Float32Array([0, 0, 10, 10]), 99 as never);
    Curves.getPoint(c, 0.5, out);
    expect([out[0], out[1]]).toEqual([0, 0]);
  });
});

describe('Phase 7c — Path (Float32Array + writeCursor)', () => {
  it('addPoint が末尾にだけ追加する', () => {
    const p = new Path(8);
    expect(p.addPoint(1, 2)).toBe(true);
    expect(p.addPoint(3, 4)).toBe(true);
    expect(p.getPointCount()).toBe(2);
    const o = new Float32Array(2);
    expect(p.getPoint(0, o)).toBe(true);
    expect([o[0], o[1]]).toEqual([1, 2]);
    expect(p.getPoint(1, o)).toBe(true);
    expect([o[0], o[1]]).toEqual([3, 4]);
  });

  it('バッファが満杯なら false を返す（自動拡張しない）', () => {
    const p = new Path(2);
    expect(p.addPoint(0, 0)).toBe(true);
    expect(p.addPoint(1, 1)).toBe(true);
    expect(p.addPoint(2, 2)).toBe(false);
    expect(p.getPointCount()).toBe(2);
    expect(p.maxPoints).toBe(2);
  });

  it('resize で拡張しても既存点は保たれる', () => {
    const p = new Path(2);
    p.addPoint(7, 8);
    p.resize(10);
    expect(p.maxPoints).toBe(10);
    const o = new Float32Array(2);
    p.getPoint(0, o);
    expect([o[0], o[1]]).toEqual([7, 8]);
    expect(p.addPoint(9, 10)).toBe(true);
  });

  it('popPoint と clearPoints', () => {
    const p = new Path(4);
    p.addPoint(1, 1);
    p.addPoint(2, 2);
    expect(p.popPoint()).toBe(true);
    expect(p.getPointCount()).toBe(1);
    p.clearPoints();
    expect(p.getPointCount()).toBe(0);
    expect(p.popPoint()).toBe(false);
  });

  it('getPoint は範囲外で false', () => {
    const p = new Path(4);
    p.addPoint(1, 1);
    const o = new Float32Array(2);
    expect(p.getPoint(1, o)).toBe(false);
    expect(p.getPoint(-1, o)).toBe(false);
  });

  it('getPoints が点列を展開する', () => {
    const p = new Path(4);
    p.addPoint(1, 2);
    p.addPoint(3, 4);
    const out = new Float32Array(4);
    expect(p.getPoints(out)).toBe(2);
    expect([...out]).toEqual([1, 2, 3, 4]);
  });

  it('getPoints はバッファが小さいとき 0 を返す', () => {
    const p = new Path(4);
    p.addPoint(1, 2);
    p.addPoint(3, 4);
    expect(p.getPoints(new Float32Array(2))).toBe(0);
  });

  it('addCurve は制御点数が足りなければ false', () => {
    const p = new Path(8, 4);
    // QuadraticBezier は 3 点（6 要素）必要
    expect(p.addCurve(new Float32Array([0, 0, 1, 1]), CurveKind.QuadraticBezier)).toBe(false);
    expect(p.addCurve(new Float32Array([0, 0, 1, 1, 2, 0]), CurveKind.QuadraticBezier)).toBe(true);
    expect(p.curves.length).toBe(1);
  });

  it('addCurve は上限を超えると false', () => {
    const p = new Path(8, 1);
    const seg = new Float32Array([0, 0, 1, 1]);
    expect(p.addCurve(seg, CurveKind.Line)).toBe(true);
    expect(p.addCurve(seg, CurveKind.Line)).toBe(false);
  });

  it('lineTo が線分を Path に積む', () => {
    const p = new Path(8, 4);
    expect(p.lineTo(10, 0)).toBe(true);
    expect(p.curves.length).toBe(1);
    // 始点が (0,0) として記録されている
    expect([p.curves[0].points[0], p.curves[0].points[1]]).toEqual([0, 0]);
    expect([p.curves[0].points[2], p.curves[0].points[3]]).toEqual([10, 0]);
  });

  it('getCurvePoints が全カーブの点を連結して返す', () => {
    const p = new Path(16, 4);
    p.addCurve(new Float32Array([0, 0, 10, 0]), CurveKind.Line);
    p.addCurve(new Float32Array([10, 0, 10, 10]), CurveKind.Line);
    const out = new Float32Array(2 * 2 * 4);
    expect(p.getCurvePoints(4, out)).toBe(8);
    // 1 本目の終点と 2 本目の始点が連続している
    expect(out[3 * 2]).toBeCloseTo(10);
    expect(out[4 * 2]).toBeCloseTo(10);
  });

  it('splice がカーブを点列へ展開する', () => {
    const p = new Path(32, 4);
    p.addCurve(new Float32Array([0, 0, 10, 0]), CurveKind.Line);
    expect(p.splice(0, 5)).toBe(5);
    expect(p.getPointCount()).toBe(5);
    const o = new Float32Array(2);
    p.getPoint(4, o);
    expect(o[0]).toBeCloseTo(10);
    // 範囲外は 0
    expect(p.splice(9, 5)).toBe(0);
  });

  it('PATH_POINT_STRIDE は 2（点 1 個 = x, y）', () => {
    expect(PATH_POINT_STRIDE).toBe(2);
  });
});
