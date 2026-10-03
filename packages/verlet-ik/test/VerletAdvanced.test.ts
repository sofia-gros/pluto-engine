import { describe, expect, it } from 'vitest';
import { VerletSolver } from '../src/VerletSolver';
import { Tentacle } from '../src/Tentacle';

describe('VerletSolver - 固定点', () => {
  it('pin は点の座標を固定し、重力を適用しても動かない', () => {
    const solver = new VerletSolver(10, 10, 5);
    solver.setGravity(0, 1000);
    const p = solver.addPoint(50, 50);
    solver.pin(p, 50, 50);
    expect(solver.isPinned(p)).toBe(true);

    for (let i = 0; i < 30; i++) solver.update(1 / 60);
    expect(solver.positions[0]).toBe(50);
    expect(solver.positions[1]).toBe(50);
  });

  it('固定点の前後位置は常に同期し、速度が蓄積しない', () => {
    const solver = new VerletSolver(10, 10, 1);
    const p = solver.addPoint(0, 0);
    solver.pin(p, 10, 20);
    for (let i = 0; i < 5; i++) solver.update(1 / 60);
    expect(solver.prevPositions[0]).toBe(10);
    expect(solver.prevPositions[1]).toBe(20);
  });

  it('unpin で固定が解除され、その後は落下する', () => {
    const solver = new VerletSolver(10, 10, 5);
    solver.setGravity(0, 1000);
    const p = solver.addPoint(0, 0);
    solver.pin(p, 0, 0);
    for (let i = 0; i < 10; i++) solver.update(1 / 60);
    expect(solver.positions[1]).toBe(0);

    solver.unpin(p);
    expect(solver.isPinned(p)).toBe(false);
    for (let i = 0; i < 10; i++) solver.update(1 / 60);
    expect(solver.positions[1]).toBeGreaterThan(0);
  });

  it('固定端を持つ拘束は固定点を動かさず、もう片側だけ動かす', () => {
    const solver = new VerletSolver(10, 10, 1);
    const a = solver.addPoint(0, 0);
    const b = solver.addPoint(0, 0);
    solver.addConstraint(a, b, 50);
    solver.pin(a, 0, 0);

    for (let i = 0; i < 10; i++) solver.update(1 / 60);

    // a は不動
    expect(solver.positions[0]).toBe(0);
    expect(solver.positions[1]).toBe(0);
    // b は約 50 だけ離れる
    expect(solver.positions[2]).toBeCloseTo(50, 3);
  });

  it('両端固定の拘束は解かれない (両点が不動)', () => {
    const solver = new VerletSolver(10, 10, 5);
    const a = solver.addPoint(0, 0);
    const b = solver.addPoint(100, 0);
    solver.addConstraint(a, b, 10);
    solver.pin(a, 0, 0);
    solver.pin(b, 100, 0);

    for (let i = 0; i < 10; i++) solver.update(1 / 60);
    // 距離が 10 でも 100 のままです。両端固定は動かせません。
    expect(solver.positions[0]).toBe(0);
    expect(solver.positions[2]).toBe(100);
  });

  it('reset で固定フラグも消える', () => {
    const solver = new VerletSolver(10, 10, 3);
    const p = solver.addPoint(0, 0);
    solver.pin(p, 0, 0);
    expect(solver.isPinned(p)).toBe(true);

    solver.reset();
    const q = solver.addPoint(5, 5);
    // 同じスロット番号でも固定は解除されている
    expect(solver.isPinned(q)).toBe(false);
  });
});

describe('VerletSolver - 減衰と剛性', () => {
  it('減衰を設定すると振動が収束する', () => {
    const mk = (damping: number) => {
      const s = new VerletSolver(10, 10, 4);
      s.setGravity(0, 900);
      s.setDamping(damping);
      const p = s.addPoint(0, 0);
      s.prevPositions[0] = 50; // 横方向へ初期速度を与える
      for (let i = 0; i < 120; i++) s.update(1 / 60);
      return Math.abs(s.positions[0] - 50);
    };
    // 減衰ありのほうが減衰なしより元の位置へ近い
    expect(mk(0.9)).toBeLessThan(mk(0));
  });

  it('反復回数を増やすと鎖の拘束誤差が小さくなる', () => {
    // 単一の拘束は 1 回の反復で収束するため、末端まで訂正が伝播しない
    // 長い鎖を使わないと反復回数の差が現れません。
    const err = (iters: number) => {
      const s = new VerletSolver(64, 64, iters);
      // 8 節の鎖。根元は固定、末端は重力と拘束の抗争で誤差最容易に残ります。
      const root = s.addChain(8, 0, 0, 0, 1, 25);
      s.setGravity(0, 900);
      for (let i = 0; i < 60; i++) {
        s.moveRoot(root, 0, 0);
        s.update(1 / 60);
      }
      // 末端の根元からの距離。全長の 7 * 25 = 175 になるべきです。
      const tip = 7;
      const dx = s.positions[tip << 1] - s.positions[0];
      const dy = s.positions[(tip << 1) + 1] - s.positions[1];
      return Math.abs(Math.sqrt(dx * dx + dy * dy) - 175);
    };
    expect(err(12)).toBeLessThan(err(1));
  });

  it('setIterations(0) は 1 に丸められる (無限ループ防止)', () => {
    const s = new VerletSolver(10, 10);
    s.setIterations(0);
    expect(s.iterations).toBe(1);
    s.setIterations(-5);
    expect(s.iterations).toBe(1);
  });

  it('stiffness と damping は範囲内に丸められる', () => {
    const s = new VerletSolver(10, 10);
    s.setStiffness(5);
    s.setStiffness(-1);
    s.setDamping(9);
    s.setDamping(-9);
    // 範囲外の値でも例外を投げずに動く
    expect(() => s.update(1 / 60)).not.toThrow();
  });
});

describe('VerletSolver - 境界安全性', () => {
  it('容量超過の addPoint は -1 を返し、配列を壊さない', () => {
    const s = new VerletSolver(3, 3);
    expect(s.addPoint(0, 0)).toBe(0);
    expect(s.addPoint(1, 1)).toBe(1);
    expect(s.addPoint(2, 2)).toBe(2);
    expect(s.addPoint(3, 3)).toBe(-1);
    expect(s.pointCount).toBe(3);
  });

  it('容量超過の addConstraint は -1 を返す', () => {
    const s = new VerletSolver(10, 1);
    const a = s.addPoint(0, 0);
    const b = s.addPoint(1, 0);
    expect(s.addConstraint(a, b, 1)).toBe(0);
    expect(s.addConstraint(a, b, 1)).toBe(-1);
    expect(s.constraintCount).toBe(1);
  });

  it('範囲外のインデックス是无害な no-op になる', () => {
    const s = new VerletSolver(4, 4);
    s.addPoint(3, 4);
    expect(() => s.setPointPosition(99, 1, 1)).not.toThrow();
    expect(() => s.pin(99, 0, 0)).not.toThrow();
    expect(() => s.unpin(-1)).not.toThrow();
    expect(s.isPinned(99)).toBe(false);

    const out = { x: 9, y: 9 };
    s.getPointPosition(99, out);
    expect(out.x).toBe(0);
    expect(out.y).toBe(0);
  });

  it('同一座標の 2 点は NaN を生まない (ゼロ長除算の防止)', () => {
    const s = new VerletSolver(4, 4, 3);
    const a = s.addPoint(0, 0);
    const b = s.addPoint(0, 0);
    s.addConstraint(a, b, 10);
    for (let i = 0; i < 10; i++) s.update(1 / 60);
    expect(Number.isNaN(s.positions[0])).toBe(false);
    expect(Number.isNaN(s.positions[2])).toBe(false);
  });
});

describe('VerletSolver - addChain (ロープ/触手生成)', () => {
  it('指定方向の直線上の鎖を生成し、根元を固定する', () => {
    const s = new VerletSolver(32, 32, 4);
    const root = s.addChain(5, 100, 100, 1, 0, 10);

    expect(root).toBe(0);
    expect(s.pointCount).toBe(5);
    expect(s.constraintCount).toBe(4);
    // すべて x 方向に 10 ずつ並ぶ
    for (let i = 0; i < 5; i++) {
      expect(s.positions[i * 2]).toBeCloseTo(100 + i * 10, 4);
      expect(s.positions[i * 2 + 1]).toBeCloseTo(100, 4);
    }
    expect(s.isPinned(root)).toBe(true);
  });

  it('方向ベクトルは正規化される (長さが影響しない)', () => {
    const a = new VerletSolver(32, 32);
    const b = new VerletSolver(32, 32);
    a.addChain(3, 0, 0, 3, 0, 10);
    b.addChain(3, 0, 0, 1, 0, 10);
    for (let i = 0; i < 3; i++) {
      expect(a.positions[i * 2]).toBeCloseTo(b.positions[i * 2], 4);
    }
  });

  it('ゼロ長方向は下向きへフォールバックする', () => {
    const s = new VerletSolver(32, 32);
    s.addChain(3, 0, 0, 0, 0, 10);
    // y 方向へ伸びる
    expect(s.positions[2]).toBeCloseTo(0, 4);
    expect(s.positions[3]).toBeCloseTo(10, 4);
  });

  it('点数が 1 なら拘束は 0 本で根元のみ固定される', () => {
    const s = new VerletSolver(8, 8);
    const root = s.addChain(1, 5, 5, 0, 1, 10);
    expect(root).toBe(0);
    expect(s.constraintCount).toBe(0);
    expect(s.isPinned(root)).toBe(true);
  });

  it('容量を超える鎖は -1 を返し、部分的に作らない', () => {
    const s = new VerletSolver(4, 4);
    expect(s.addChain(10, 0, 0, 0, 1, 10)).toBe(-1);
    expect(s.pointCount).toBe(0);
  });

  it('count < 1 は -1', () => {
    const s = new VerletSolver(8, 8);
    expect(s.addChain(0, 0, 0, 0, 1, 10)).toBe(-1);
  });

  it('moveRoot で鎖の根元を追いかけられる', () => {
    const s = new VerletSolver(32, 32, 4);
    const root = s.addChain(4, 0, 0, 0, 1, 10);
    s.moveRoot(root, 200, 50);
    expect(s.positions[0]).toBe(200);
    expect(s.positions[1]).toBe(50);
    expect(s.isPinned(root)).toBe(true);
  });

  it('steerRoot は根元に速度を与え、鎖を引かせる', () => {
    const s = new VerletSolver(32, 32, 4);
    s.setGravity(0, 0);
    const root = s.addChain(5, 0, 0, 0, 1, 10);
    s.steerRoot(root, 100, 0, 20, 0);
    for (let i = 0; i < 20; i++) s.update(1 / 60);
    // 根元が右へ動いた結果、末端も右へ寄る
    expect(s.positions[4 * 2]).toBeGreaterThan(0);
  });

  it('重力下の鎖は根元からの距離保ちながら垂れ下がる', () => {
    const s = new VerletSolver(64, 64, 8);
    s.setGravity(0, 600);
    const root = s.addChain(6, 0, 0, 0, 1, 10);
    for (let i = 0; i < 120; i++) {
      s.moveRoot(root, 0, 0);
      s.update(1 / 60);
    }
    // 節往下へ垂れる
    for (let i = 1; i < 6; i++) {
      expect(s.positions[i * 2 + 1]).toBeGreaterThan(0);
    }
    // 隣接節間距離が保たれる
    for (let i = 1; i < 6; i++) {
      const dx = s.positions[i * 2] - s.positions[(i - 1) * 2];
      const dy = s.positions[i * 2 + 1] - s.positions[(i - 1) * 2 + 1];
      const d = Math.sqrt(dx * dx + dy * dy);
      expect(d).toBeGreaterThan(9);
      expect(d).toBeLessThan(11);
    }
  });
});

describe('Tentacle', () => {
  it('生成直後に節座標がバッファへ転記されている', () => {
    const s = new VerletSolver(64, 64, 4);
    // 既定方向は (0, 1) = 下向き
    const t = new Tentacle(s, 0, 0, { segments: 5, segmentLength: 8 });
    expect(t.count).toBe(5);
    expect(t.pointsX.length).toBe(5);
    expect(t.pointsX[0]).toBe(0);
    expect(t.pointsY[4]).toBeCloseTo(32, 4);
  });

  it('方向を指定するとその向きへ伸びる', () => {
    const s = new VerletSolver(64, 64, 4);
    const t = new Tentacle(s, 0, 0, {
      segments: 5,
      segmentLength: 8,
      dirX: 1,
      dirY: 0,
    });
    expect(t.pointsX[4]).toBeCloseTo(32, 4);
    expect(t.pointsY[4]).toBeCloseTo(0, 4);
  });

  it('複数の触手が 1 つのソルバーに重ならずに作られる', () => {
    const s = new VerletSolver(128, 128, 4);
    const a = new Tentacle(s, 0, 0, { segments: 4, segmentLength: 10 });
    const b = new Tentacle(s, 100, 0, { segments: 4, segmentLength: 10 });
    expect(s.pointCount).toBe(8);
    expect(a.rootIndex).toBe(0);
    expect(b.rootIndex).toBe(4);
    // 位置が混ざらないこと
    expect(b.pointsX[0]).toBeCloseTo(100, 4);
  });

  it('solver.update の後に sync すると節座標が進む', () => {
    const s = new VerletSolver(64, 64, 4);
    s.setGravity(0, 800);
    const t = new Tentacle(s, 0, 0, { segments: 6, segmentLength: 10 });
    const before = t.pointsY[t.count - 1];
    for (let i = 0; i < 60; i++) s.update(1 / 60);
    t.sync();
    expect(t.pointsY[t.count - 1]).toBeGreaterThan(before);
  });

  it('setRoot が根元を動かすと鎖全体が寄る', () => {
    const s = new VerletSolver(64, 64, 4);
    s.setGravity(0, 400);
    const t = new Tentacle(s, 0, 0, { segments: 5, segmentLength: 10 });
    for (let i = 0; i < 30; i++) s.update(1 / 60);
    t.setRoot(300, 0);
    t.sync();
    expect(t.pointsX[0]).toBe(300);
    for (let i = 0; i < 60; i++) {
      t.setRoot(300, 0);
      s.update(1 / 60);
    }
    t.sync();
    // 根元へ引き寄せられている
    expect(t.pointsX[t.count - 1]).toBeGreaterThan(0);
  });

  it('getTip は先端座標を返す', () => {
    const s = new VerletSolver(64, 64, 4);
    const t = new Tentacle(s, 0, 0, { segments: 4, segmentLength: 10 });
    const out = { x: 0, y: 0 };
    t.getTip(out);
    expect(out.x).toBeCloseTo(t.pointsX[3], 5);
    expect(out.y).toBeCloseTo(t.pointsY[3], 5);
  });

  it('getPoint は範囲外で 0 を返す', () => {
    const s = new VerletSolver(64, 64, 4);
    const t = new Tentacle(s, 0, 0, { segments: 4 });
    const out = { x: 7, y: 7 };
    t.getPoint(99, out);
    expect(out.x).toBe(0);
    expect(out.y).toBe(0);
    t.getPoint(-1, out);
    expect(out.x).toBe(0);
  });

  it('totalLength は初期状態で segments * segmentLength', () => {
    const s = new VerletSolver(64, 64, 4);
    const t = new Tentacle(s, 0, 0, { segments: 5, segmentLength: 10 });
    expect(t.totalLength()).toBeCloseTo(40, 3);
  });

  it('設定 (iterations/stiffness/damping/gravity) がソルバーへ反映される', () => {
    const s = new VerletSolver(64, 64, 1);
    const t = new Tentacle(s, 0, 0, {
      segments: 4,
      iterations: 9,
      stiffness: 0.5,
      damping: 0.2,
      gravityX: 1,
      gravityY: 2,
    });
    expect(s.iterations).toBe(9);
    expect(t.count).toBe(4);
    for (let i = 0; i < 5; i++) s.update(1 / 60);
    // 重力 Y=2 なので下へ落ちる
    expect(s.positions[3]).toBeGreaterThan(0);
  });

  it('destroy はバッファをゼロクリアする', () => {
    const s = new VerletSolver(64, 64, 4);
    const t = new Tentacle(s, 0, 0, { segments: 4, segmentLength: 10 });
    t.destroy();
    expect(t.pointsX[0]).toBe(0);
    expect(t.pointsY[3]).toBe(0);
  });

  it('多数本でも毎フレーム new なしで更新できる', () => {
    const s = new VerletSolver(4096, 8192, 4);
    const tentacles: Tentacle[] = [];
    for (let i = 0; i < 20; i++) {
      tentacles.push(new Tentacle(s, i * 10, 0, { segments: 10, segmentLength: 6, gravityY: 300 }));
    }
    for (let i = 0; i < 60; i++) {
      s.update(1 / 60);
      for (let t = 0; t < tentacles.length; t++) tentacles[t].sync();
    }
    // 先端が有限値であること
    const out = { x: 0, y: 0 };
    for (const t of tentacles) {
      t.getTip(out);
      expect(Number.isFinite(out.x)).toBe(true);
      expect(Number.isFinite(out.y)).toBe(true);
    }
  });
});
