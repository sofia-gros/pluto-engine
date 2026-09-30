import { describe, expect, test } from 'vitest';
import { EikonalField } from '../src/EikonalField';
import { ContinuumCrowds } from '../src/ContinuumCrowds';

describe('EikonalField', () => {
  test('distance is zero at the goal and grows outward', () => {
    const f = new EikonalField(16, 16, 1);
    const goal = 8 * 16 + 8;
    f.solve(goal);

    expect(f.distance[goal]).toBe(0);
    // マンハッタン距離が近いセルほど距離が小さい
    expect(f.distance[8 * 16 + 9]).toBe(1);
    expect(f.distance[9 * 16 + 8]).toBe(1);
    expect(f.distance[7 * 16 + 8]).toBe(1);
  });

  test('gradient points toward the goal', () => {
    const f = new EikonalField(16, 16, 1);
    const goal = 4 * 16 + 4;
    f.solve(goal);
    f.computeGradient();
    f.normalizeGradient();

    // ゴールの右下にあるセルなら、方向は左上を向く
    const idx = 8 * 16 + 8;
    expect(f.gradX[idx]).toBeLessThan(0);
    expect(f.gradY[idx]).toBeLessThan(0);
  });

  test('walls block propagation and create unreachable areas', () => {
    const f = new EikonalField(16, 16, 1);
    // 左半分を壁にする
    f.markWalls((x) => x < 8);
    f.solve(8 * 16 + 12);

    // 壁のセルは到達不能
    expect(f.unreachable[8 * 16 + 2]).toBe(1);
    // 壁の右側は到達できる
    expect(f.unreachable[8 * 16 + 12]).toBe(0);
  });

  test('distanceAt converts to world units', () => {
    const f = new EikonalField(16, 16, 10);
    f.solve(8 * 16 + 8);
    // (9, 8) セル = ゴールから 1 セル (10 ワールド単位) 離れる
    expect(f.distanceAt(95, 85)).toBeCloseTo(10, 4);
  });

  test('sampleDirection interpolates smoothly', () => {
    const f = new EikonalField(16, 16, 1);
    f.solve(0);
    f.computeGradient();
    f.normalizeGradient();

    const out = new Float32Array(2);
    const ok = f.sampleDirection(8.5, 8.5, out);
    expect(ok).toBe(true);
    // ゴール (0,0) へ向かうため左上を向く
    expect(out[0]).toBeLessThan(0);
    expect(out[1]).toBeLessThan(0);
  });

  test('rejects invalid construction', () => {
    expect(() => new EikonalField(0, 8, 1)).toThrow();
    expect(() => new EikonalField(8, 8, 0)).toThrow();
  });
});

describe('ContinuumCrowds: UIC pressure', () => {
  test('splat distributes density bilinearly', () => {
    const c = new ContinuumCrowds(8, 8, 1, { targetDensity: 4 });
    c.clear();
    // 格子線上の座標なので 1 セルへ完全に載る
    c.splat(1.0, 1.0, 1.0);

    let total = 0;
    for (let i = 0; i < 64; i++) total += c.density[i];
    // 双線形補間なので総和は amount に一致する
    expect(total).toBeCloseTo(1.0, 4);
  });

  test('splat spreads across four cells when between grid lines', () => {
    const c = new ContinuumCrowds(8, 8, 1, { targetDensity: 4 });
    c.clear();
    c.splat(1.5, 1.5, 1.0);

    // 4 セルへ均等に 0.25 ずつ配られる
    expect(c.density[1 * 8 + 1]).toBeCloseTo(0.25, 5);
    expect(c.density[1 * 8 + 2]).toBeCloseTo(0.25, 5);
    expect(c.density[2 * 8 + 1]).toBeCloseTo(0.25, 5);
    expect(c.density[2 * 8 + 2]).toBeCloseTo(0.25, 5);
  });

  test('pressure stays non-negative (UIC constraint)', () => {
    const c = new ContinuumCrowds(16, 16, 1, { targetDensity: 2 });
    c.clear();
    // 中央に大量-renewdens
    for (let y = 6; y < 10; y++) {
      for (let x = 6; x < 10; x++) c.splat(x, y, 1.0);
    }
    c.computeDivergence();
    c.solvePressure(6);

    for (let i = 0; i < c.pressure.length; i++) {
      expect(c.pressure[i]).toBeGreaterThanOrEqual(0);
    }
  });

  test('over-dense region develops positive pressure', () => {
    const c = new ContinuumCrowds(16, 16, 1, { targetDensity: 2 });
    c.clear();
    // 各セルに 3 個体置く = 目標密度 2 を超過する
    for (let y = 7; y < 9; y++) {
      for (let x = 7; x < 9; x++) c.splat(x, y, 3.0);
    }
    c.computeDivergence();
    c.solvePressure(8);
    // 密集の中心付近の圧力が高い
    const center = 8 * 16 + 8;
    expect(c.pressure[center]).toBeGreaterThan(0);
  });

  test('density below the target produces no pressure', () => {
    const c = new ContinuumCrowds(16, 16, 1, { targetDensity: 5 });
    c.clear();
    // 各セル 1 個体 = 目標 5 未満なので UIC は働かない
    for (let y = 7; y < 9; y++) {
      for (let x = 7; x < 9; x++) c.splat(x, y, 1.0);
    }
    c.computeDivergence();
    c.solvePressure(6);
    for (let i = 0; i < c.pressure.length; i++) {
      expect(c.pressure[i]).toBe(0);
    }
  });

  test('an empty field develops no pressure', () => {
    const c = new ContinuumCrowds(8, 8, 1, { targetDensity: 2 });
    c.clear();
    c.computeDivergence();
    c.solvePressure(4);
    for (let i = 0; i < c.pressure.length; i++) {
      expect(c.pressure[i]).toBe(0);
    }
  });
});

describe('ContinuumCrowds: navigation and velocity field', () => {
  test('solveNavigation marks walls as unreachable', () => {
    const c = new ContinuumCrowds(16, 16, 1);
    c.solveNavigation(8 * 16 + 12, (x) => x < 8);
    expect(c.unreachable[8 * 16 + 2]).toBe(1);
    expect(c.unreachable[8 * 16 + 12]).toBe(0);
  });

  test('bakeVelocityField points agents toward the goal', () => {
    const c = new ContinuumCrowds(16, 16, 1);
    c.solveNavigation(2 * 16 + 2, () => false);
    c.bakeVelocityField(100, 0.7, true);

    // ゴール右上にあるセルは、左上 (ゴール方向) を向く
    const idx = 12 * 16 + 12;
    expect(c.fieldVx[idx]).toBeLessThan(0);
    expect(c.fieldVy[idx]).toBeLessThan(0);
  });

  test('velocity magnitude is normalized to the requested speed', () => {
    const c = new ContinuumCrowds(16, 16, 1);
    c.solveNavigation(8 * 16 + 8, () => false);
    c.bakeVelocityField(120, 0.0, true);

    const idx = 12 * 16 + 4;
    const len = Math.hypot(c.fieldVx[idx], c.fieldVy[idx]);
    expect(len).toBeCloseTo(120, 1);
  });

  test('sampleVelocity interpolates across cells', () => {
    const c = new ContinuumCrowds(16, 16, 1);
    c.solveNavigation(8 * 16 + 8, () => false);
    c.bakeVelocityField(100, 0.0, true);

    const out = new Float32Array(2);
    const ok = c.sampleVelocity(8.5, 8.5, out);
    expect(ok).toBe(true);
    // 有限値であること (NaN にならない)
    // 左側の密集セルは圧力の向右に押し出されます
    expect(Number.isFinite(out[1])).toBe(true);
  });

  test('sampleVelocity returns false in unreachable cells', () => {
    const c = new ContinuumCrowds(16, 16, 1);
    c.solveNavigation(8 * 16 + 12, (x) => x < 8);
    c.bakeVelocityField(100, 0.0, true);

    const out = new Float32Array(2);
    const ok = c.sampleVelocity(2.5, 8.5, out);
    expect(ok).toBe(false);
    expect(out[0]).toBe(0);
  });

  test('unreachable cells are not accelerated in the baked field', () => {
    const c = new ContinuumCrowds(16, 16, 1);
    c.solveNavigation(8 * 16 + 12, (x) => x < 8);
    c.bakeVelocityField(100, 0.7, true);

    const idx = 8 * 16 + 2;
    expect(c.fieldVx[idx]).toBe(0);
    expect(c.fieldVy[idx]).toBe(0);
  });

  test('pressure gradient deflects the flow away from crowds', () => {
    const c = new ContinuumCrowds(16, 16, 1, { targetDensity: 1 });
    c.clear();
    // 左側に密集
    for (let y = 4; y < 12; y++) {
      for (let x = 2; x < 6; x++) c.splat(x, y, 1.0);
    }
    c.computeDivergence();
    c.solvePressure(8);
    c.solveNavigation(12 * 16 + 12, () => false);
    c.bakeVelocityField(100, 1.5, true);

    // 左側の密度affectedセルは、圧力の向右に押し出される
    const idx = 8 * 16 + 4;
    expect(c.fieldVx[idx]).toBeGreaterThan(0);
  });

  test('clear resets the density field', () => {
    const c = new ContinuumCrowds(8, 8, 1, { targetDensity: 1 });
    c.splat(4, 4, 5);
    c.clear();
    c.computeDivergence();
    c.solvePressure(2);
    for (let i = 0; i < c.pressure.length; i++) expect(c.pressure[i]).toBe(0);
  });

  test('rejects invalid construction', () => {
    expect(() => new ContinuumCrowds(0, 8, 1)).toThrow();
    expect(() => new ContinuumCrowds(8, 8, 0)).toThrow();
  });
});
