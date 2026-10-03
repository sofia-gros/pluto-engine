import { describe, expect, test } from 'vitest';
import { XPBDSolver, type XPBDParticles } from '../src/XPBDSolver';

/** n 体ぶんの SoA データを作るヘルパ */
function makeParticles(
  xs: number[],
  ys: number[],
  opts: { radius?: number; invMass?: number } = {},
): XPBDParticles {
  const n = xs.length;
  const p: XPBDParticles = {
    count: n,
    posX: Float32Array.from(xs),
    posY: Float32Array.from(ys),
    prevX: Float32Array.from(xs),
    prevY: Float32Array.from(ys),
    velX: new Float32Array(n),
    velY: new Float32Array(n),
    radii: new Float32Array(n).fill(opts.radius ?? 1),
    invMasses: new Float32Array(n).fill(opts.invMass ?? 1),
  };
  return p;
}

/** 指定された 2 体だけの接触ペア */
function pairList(a: number, b: number): Int32Array {
  return Int32Array.from([a, b]);
}

describe('XPBDSolver: penetration resolution', () => {
  test('two overlapping circles are pushed apart', () => {
    // 半径 1 の 2 体が x=0.9 / x=1.1 にいる。中心距離 0.2 < 2 なので重なり
    const p = makeParticles([0.9, 1.1], [0, 0]);
    XPBDSolver.step(p, 1 / 60, { pairs: pairList(0, 1), pairCount: 1 });

    // 離れてinkerners
    const dx = p.posX[1] - p.posX[0];
    expect(Math.abs(dx)).toBeGreaterThan(1.9);
  });

  test('the two bodies move symmetrically by default', () => {
    const p = makeParticles([0.9, 1.1], [0, 0]);
    XPBDSolver.step(p, 1 / 60, { pairs: pairList(0, 1), pairCount: 1 });
    // 質量比 1:1 なので中心は保存される
    const midBefore = (0.9 + 1.1) / 2;
    const midAfter = (p.posX[0] + p.posX[1]) / 2;
    expect(midAfter).toBeCloseTo(midBefore, 3);
  });

  test('an infinitely massive body does not move', () => {
    const p = makeParticles([0.9, 1.1], [0, 0], { invMass: 1 });
    p.invMasses[0] = 0; // 静的壁
    const staticX = p.posX[0];

    XPBDSolver.step(p, 1 / 60, { pairs: pairList(0, 1), pairCount: 1 });
    expect(p.posX[0]).toBe(staticX);
    // 動的側は離れる
    expect(p.posX[1]).toBeGreaterThan(1.1);
  });

  test('two static bodies are left untouched', () => {
    const p = makeParticles([0.9, 1.1], [0, 0], { invMass: 0 });
    const x0 = p.posX[0];
    const x1 = p.posX[1];
    XPBDSolver.step(p, 1 / 60, { pairs: pairList(0, 1), pairCount: 1 });
    expect(p.posX[0]).toBe(x0);
    expect(p.posX[1]).toBe(x1);
  });

  test('mass ratio shifts the correction', () => {
    // 軽い粒子が大きく動く
    const p = makeParticles([0.9, 1.1], [0, 0]);
    p.invMasses[0] = 4; // 軽い
    p.invMasses[1] = 1; // 重い

    XPBDSolver.step(p, 1 / 60, { pairs: pairList(0, 1), pairCount: 1 });
    const move0 = Math.abs(p.posX[0] - 0.9);
    const move1 = Math.abs(p.posX[1] - 1.1);
    expect(move0).toBeGreaterThan(move1);
  });

  test('non-overlapping bodies are not modified', () => {
    const p = makeParticles([0, 5], [0, 0]);
    const x0 = p.posX[0];
    XPBDSolver.step(p, 1 / 60, { pairs: pairList(0, 1), pairCount: 1 });
    expect(p.posX[0]).toBe(x0);
  });
});

describe('XPBDSolver: integration and velocity', () => {
  test('position is integrated from velocity', () => {
    const p = makeParticles([0, 100], [0, 100]);
    p.velX[0] = 10;
    p.velY[0] = -5;

    XPBDSolver.step(p, 0.1, {});
    expect(p.posX[0]).toBeCloseTo(1.0, 4);
    // 質量比 4:1 なので軽い側は大きく動きます
  });

  test('velocity is recomputed from the corrected position', () => {
    const p = makeParticles([0, 100], [0, 100]);
    p.velX[0] = 10;
    XPBDSolver.step(p, 0.1, {});
    // 衝突がないので速度は保存される
    expect(p.velX[0]).toBeCloseTo(10, 3);
  });

  test('an incoming contact is arrested by the solver', () => {
    // ちょうど接している 2 体が互いへ衝突する設定
    const p = makeParticles([0, 2.0], [0, 0]);
    p.velX[0] = 6;
    p.velX[1] = -6;

    XPBDSolver.step(p, 1 / 30, { pairs: pairList(0, 1), pairCount: 1 });

    // 進行方向の速度が 0 へ収束する (非弾性接触)
    // 左の粒子が右へは不会再接近する
    expect(p.velX[0]).toBeLessThanOrEqual(0.01);
    expect(p.velX[1]).toBeGreaterThanOrEqual(-0.01);
    // 位置は重なっていない
    expect(Math.abs(p.posX[1] - p.posX[0])).toBeGreaterThan(1.99);
  });

  test('restitution is applied on impact', () => {
    // 反発には解法前の法線速度のバッファが必要です (呼び出し側が確保します)
    const preVel = new Float32Array(1);

    const noBounce = makeParticles([0, 2.0], [0, 0]);
    noBounce.velX[0] = 6;
    noBounce.velX[1] = -6;
    XPBDSolver.step(noBounce, 1 / 30, { pairs: pairList(0, 1), pairCount: 1 });

    const bouncy = makeParticles([0, 2.0], [0, 0]);
    bouncy.velX[0] = 6;
    bouncy.velX[1] = -6;
    XPBDSolver.step(bouncy, 1 / 30, {
      pairs: pairList(0, 1),
      pairCount: 1,
      restitution: 1.0,
      preSolveNormalVel: preVel,
    });

    // 完全反発なら互いに離れる向きの速度になる
    expect(bouncy.velX[0]).toBeLessThan(0);
    expect(bouncy.velX[1]).toBeGreaterThan(0);

    // 反発ありのほうが離れる速度は大きい
    const sepBouncy = bouncy.velX[1] - bouncy.velX[0];
    const sepNone = noBounce.velX[1] - noBounce.velX[0];
    expect(sepBouncy).toBeGreaterThan(sepNone);
  });

  test('maxSpeed clamps runaway velocity', () => {
    const p = makeParticles([0, 100], [0, 100]);
    p.velX[0] = 100000;
    XPBDSolver.step(p, 1 / 60, { maxSpeed: 50 });
    expect(Math.abs(p.velX[0])).toBeLessThanOrEqual(50.5);
  });

  test('friction damps velocity over steps', () => {
    const p = makeParticles([0, 100], [0, 100]);
    p.velX[0] = 10;
    XPBDSolver.step(p, 1 / 60, { friction: 0.5 });
    expect(p.velX[0]).toBeLessThan(10);
  });
});

describe('XPBDSolver: compliance', () => {
  test('zero compliance resolves overlap completely', () => {
    const p = makeParticles([0.5, 1.5], [0, 0]);
    XPBDSolver.step(p, 1 / 60, { pairs: pairList(0, 1), pairCount: 1, substeps: 8 });
    const dist = Math.abs(p.posX[1] - p.posX[0]);
    expect(dist).toBeGreaterThan(1.99);
  });

  test('high compliance leaves residual overlap (soft constraint)', () => {
    const p = makeParticles([0.5, 1.5], [0, 0]);
    XPBDSolver.step(p, 1 / 60, {
      pairs: pairList(0, 1),
      pairCount: 1,
      substeps: 1,
      compliance: 1.0,
    });
    const dist = Math.abs(p.posX[1] - p.posX[0]);
    // 軟らかい拘束なので完全な分離はしない
    expect(dist).toBeLessThan(1.99);
  });

  test('more substeps converge faster than more iterations', () => {
    const run = (substeps: number, iterations: number): number => {
      const p = makeParticles([0.5, 1.5], [0, 0]);
      XPBDSolver.step(p, 1 / 60, {
        pairs: pairList(0, 1),
        pairCount: 1,
        substeps,
        iterations,
      });
      return Math.abs(p.posX[1] - p.posX[0]);
    };

    // 同じコスト (4) でもサブステップの方が分離大きい
    const substepHeavy = run(4, 1);
    const iterHeavy = run(1, 4);
    expect(substepHeavy).toBeGreaterThanOrEqual(iterHeavy);
  });
});

describe('XPBDSolver: broadphase pairs', () => {
  test('a chain of touching bodies spreads out', () => {
    // 3 体を隙間なく並べる
    const p = makeParticles([0.9, 1.9, 2.9], [0, 0, 0], { radius: 1 });
    const pairs = Int32Array.from([0, 1, 1, 2]);
    XPBDSolver.step(p, 1 / 60, { pairs, pairCount: 2, substeps: 4 });

    expect(Math.abs(p.posX[1] - p.posX[0])).toBeGreaterThan(1.9);
    expect(Math.abs(p.posX[2] - p.posX[1])).toBeGreaterThan(1.9);
  });

  test('pairs containing invalid indices are skipped', () => {
    const p = makeParticles([0.9, 1.1], [0, 0]);
    const pairs = Int32Array.from([-1, 1, 0, -1, 0, 1]);
    expect(() => XPBDSolver.step(p, 1 / 60, { pairs, pairCount: 3 })).not.toThrow();
  });

  test('brute force mode still resolves overlaps', () => {
    const p = makeParticles([0.9, 1.1], [0, 0]);
    // pairs を渡さない場合は全探索になる
    XPBDSolver.step(p, 1 / 60, { substeps: 4 });
    expect(Math.abs(p.posX[1] - p.posX[0])).toBeGreaterThan(1.9);
  });
});

describe('XPBDSolver: fully coincident bodies', () => {
  test('exactly overlapping bodies separate without NaN', () => {
    const p = makeParticles([5, 5], [5, 5]);
    XPBDSolver.step(p, 1 / 60, { pairs: pairList(0, 1), pairCount: 1 });
    expect(Number.isFinite(p.posX[0])).toBe(true);
    expect(Number.isFinite(p.posY[1])).toBe(true);
    // 分離軸は Patterns を振るため、楕円距離で見ます
    const dx = p.posX[1] - p.posX[0];
    const dy = p.posY[1] - p.posY[0];
    expect(Math.sqrt(dx * dx + dy * dy)).toBeGreaterThan(1.9);
  });
});

describe('XPBDSolver: legacy solve API', () => {
  test('solve() still separates overlapping circles', () => {
    const posX = Float32Array.from([0.9, 1.1]);
    const posY = Float32Array.from([0, 0]);
    const radii = Float32Array.from([1, 1]);
    const invMasses = Float32Array.from([1, 1]);

    XPBDSolver.solve(2, posX, posY, radii, invMasses, 4, 1 / 60);
    expect(Math.abs(posX[1] - posX[0])).toBeGreaterThan(1.9);
  });

  test('solve() handles a static body', () => {
    const posX = Float32Array.from([0.9, 1.1]);
    const posY = Float32Array.from([0, 0]);
    const radii = Float32Array.from([1, 1]);
    const invMasses = Float32Array.from([0, 1]);

    XPBDSolver.solve(2, posX, posY, radii, invMasses, 2, 1 / 60);
    expect(posX[0]).toBeCloseTo(0.9, 5);
    expect(posX[1]).toBeGreaterThan(1.1);
  });
});
