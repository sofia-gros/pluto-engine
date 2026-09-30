import { describe, expect, test } from 'vitest';
import { PoissonSolver } from '../src/PoissonSolver';

describe('PoissonSolver: precomputeVectorField', () => {
  test('bakes a field of the requested speed', () => {
    const s = new PoissonSolver(8, 8, 1);
    // 目標方向を右へ向ける
    const baseX = new Float32Array(64).fill(1);
    const baseY = new Float32Array(64);
    s.precomputeVectorField(baseX, baseY, 100, 0.5);

    // 圧力が無いので純粋に目標方向になる
    // 境界セルは書き込み対象外なので内側だけ確認する
    for (let y = 1; y < 7; y++) {
      for (let x = 1; x < 7; x++) {
        const i = y * 8 + x;
        const len = Math.hypot(s.vectorFieldVx[i], s.vectorFieldVy[i]);
        expect(len).toBeCloseTo(100, 1);
        expect(s.vectorFieldVx[i]).toBeGreaterThan(0);
      }
    }
  });

  test('a zero target direction produces no velocity', () => {
    const s = new PoissonSolver(8, 8, 1);
    const baseX = new Float32Array(64);
    const baseY = new Float32Array(64);
    s.precomputeVectorField(baseX, baseY, 100, 0.5);
    // 目標も圧力もないので加速しない
    for (let y = 1; y < 7; y++) {
      for (let x = 1; x < 7; x++) {
        const i = y * 8 + x;
        expect(s.vectorFieldVx[i]).toBe(0);
        expect(s.vectorFieldVy[i]).toBe(0);
      }
    }
  });

  test('pressure gradient deflects the flow', () => {
    const s = new PoissonSolver(8, 8, 1, );
    // 左側に密度INESS を作って圧力を発生させる
    s.splatDensity(2, 4, 20);
    s.computeDivergence(4);
    s.solve(6);

    // 目標方向は右
    const baseX = new Float32Array(64).fill(1);
    const baseY = new Float32Array(64);
    s.precomputeVectorField(baseX, baseY, 100, 1.5);

    // 高圧なセルでは右方向への流れが弱まる (圧力勾配で押し戻される)
    const highPressureCell = 4 * 8 + 2;
    const lowPressureCell = 4 * 8 + 6;
    expect(s.pressure[highPressureCell]).toBeGreaterThan(s.pressure[lowPressureCell]);
    expect(s.vectorFieldVx[highPressureCell]).toBeLessThan(s.vectorFieldVx[lowPressureCell]);
  });

  test('the baked field never exceeds the requested speed', () => {
    const s = new PoissonSolver(8, 8, 1);
    s.splatDensity(4, 4, 30);
    s.computeDivergence(5);
    s.solve(8);
    const baseX = new Float32Array(64).fill(1);
    const baseY = new Float32Array(64);
    s.precomputeVectorField(baseX, baseY, 90, 2.0);

    for (let y = 1; y < 7; y++) {
      for (let x = 1; x < 7; x++) {
        const i = y * 8 + x;
        const len = Math.hypot(s.vectorFieldVx[i], s.vectorFieldVy[i]);
        // 浮動小数点誤差の分だけ許容する
        expect(len).toBeLessThanOrEqual(90.001);
      }
    }
  });
});

describe('PoissonSolver: sampleVelocityBilinear', () => {
  test('samples the baked field with interpolation', () => {
    const s = new PoissonSolver(8, 8, 1);
    const baseX = new Float32Array(64).fill(1);
    const baseY = new Float32Array(64);
    s.precomputeVectorField(baseX, baseY, 100, 0.5);

    const out = new Float32Array(2);
    s.sampleVelocityBilinear(4.5, 4.5, out);

    // 目標方向が右なので vx が正になる
    expect(out[0]).toBeGreaterThan(0);
    expect(out[1]).toBeCloseTo(0, 3);
  });

  test('interpolation produces intermediate values between cells', () => {
    const s = new PoissonSolver(8, 8, 1);
    // 中央のセルのみ横向き、それ以外は縦向きという階段状の場を作る
    const baseX = new Float32Array(64);
    const baseY = new Float32Array(64);
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const i = y * 8 + x;
        if (x === 3) {
          baseX[i] = 1;
        } else {
          baseY[i] = 1;
        }
      }
    }
    s.precomputeVectorField(baseX, baseY, 100, 0.0);

    const out = new Float32Array(2);
    // x=2 のセル (縦) と x=3 のセル (横) の間
    s.sampleVelocityBilinear(2.5, 4.5, out);
    expect(Number.isFinite(out[0])).toBe(true);
    expect(Number.isFinite(out[1])).toBe(true);
    // 両方が混ざるため、どちらか一方ではない
    expect(out[0]).toBeGreaterThan(0);
    expect(out[1]).toBeGreaterThan(0);
  });

  test('sampling is stable across the cell boundary (no snap)', () => {
    const s = new PoissonSolver(8, 8, 1);
    const baseX = new Float32Array(64).fill(1);
    const baseY = new Float32Array(64);
    s.precomputeVectorField(baseX, baseY, 100, 0.0);

    const a = new Float32Array(2);
    const b = new Float32Array(2);
    s.sampleVelocityBilinear(2.999, 4.5, a);
    s.sampleVelocityBilinear(3.001, 4.5, b);
    // 境界をまたいでも不連続な跳躍が起きない
    expect(Math.abs(a[0] - b[0])).toBeLessThan(1.0);
  });

  test('the result is always finite', () => {
    const s = new PoissonSolver(8, 8, 1);
    const baseX = new Float32Array(64).fill(1);
    const baseY = new Float32Array(64);
    s.precomputeVectorField(baseX, baseY, 100, 0.0);

    const out = new Float32Array(2);
    for (let y = 0.5; y < 8; y += 1.3) {
      for (let x = 0.5; x < 8; x += 1.3) {
        s.sampleVelocityBilinear(x, y, out);
        expect(Number.isFinite(out[0])).toBe(true);
        expect(Number.isFinite(out[1])).toBe(true);
      }
    }
  });
});

describe('PoissonSolver: getPressureGradient', () => {
  test('reports the gradient direction', () => {
    const s = new PoissonSolver(9, 9, 1);
    s.splatDensity(2, 4, 20);
    s.computeDivergence(6);
    s.solve(8);

    const out = new Float32Array(2);
    s.getPressureGradient(4, 4, out);
    // 左側が高圧なので、勾配は X の負方向を向く
    expect(out[0]).toBeLessThan(0);
  });
});
