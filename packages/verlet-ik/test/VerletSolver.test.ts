import { beforeEach, describe, expect, it } from 'vitest';
import { VerletSolver } from '../src/VerletSolver';

describe('VerletSolver', () => {
  let solver: VerletSolver;

  beforeEach(() => {
    solver = new VerletSolver(10, 10, 15);
  });

  it('should initialize correctly', () => {
    expect(solver.positions.length).toBe(20);
    expect(solver.prevPositions.length).toBe(20);
    expect(solver.constraints.length).toBe(20);
    expect(solver.constraintLengths.length).toBe(10);
  });

  it('should add points correctly', () => {
    const p1 = solver.addPoint(10, 20);
    const p2 = solver.addPoint(30, 40);

    expect(p1).toBe(0);
    expect(p2).toBe(1);

    const out = { x: 0, y: 0 };
    solver.getPointPosition(0, out);
    expect(out.x).toBe(10);
    expect(out.y).toBe(20);

    solver.getPointPosition(1, out);
    expect(out.x).toBe(30);
    expect(out.y).toBe(40);
  });

  it('should integrate positions with velocity and gravity', () => {
    const p = solver.addPoint(0, 0);

    // Initial integration without velocity or gravity should stay same
    solver.update(0.1);
    const out = { x: 0, y: 0 };
    solver.getPointPosition(p, out);
    expect(out.x).toBe(0);
    expect(out.y).toBe(0);

    // Apply simulated velocity
    solver.prevPositions[0] = -1; // vx = 1
    solver.prevPositions[1] = -2; // vy = 2

    solver.update(1.0);
    solver.getPointPosition(p, out);
    expect(out.x).toBe(1);
    expect(out.y).toBe(2);

    // Apply gravity
    solver.setGravity(0, 9.8);
    solver.update(1.0);
    solver.getPointPosition(p, out);
    // previous position is 0, 0. current is 1, 2. velocity is 1, 2.
    // x = 1 + 1 + 0 = 2
    // y = 2 + 2 + 9.8 = 13.8
    expect(out.x).toBe(2);
    expect(out.y).toBeCloseTo(13.8);
  });

  it('should solve constraints correctly to keep distance', () => {
    const p1 = solver.addPoint(0, 0);
    const p2 = solver.addPoint(10, 0);
    solver.addConstraint(p1, p2, 10);

    // Move p1 explicitly and reset its prev position so it doesn't get velocity
    solver.setPointPosition(p1, 5, 0);
    solver.prevPositions[0] = 5;
    solver.prevPositions[1] = 0;

    solver.update(0.1); // integration + constraints

    const out1 = { x: 0, y: 0 };
    const out2 = { x: 0, y: 0 };
    solver.getPointPosition(p1, out1);
    solver.getPointPosition(p2, out2);

    const dx = out2.x - out1.x;
    const dy = out2.y - out1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    expect(dist).toBeCloseTo(10);
  });

  it('should simulate a rope', () => {
    const p0 = solver.addPoint(0, 0);
    const p1 = solver.addPoint(10, 0);
    const p2 = solver.addPoint(20, 0);

    solver.addConstraint(p0, p1, 10);
    solver.addConstraint(p1, p2, 10);

    // Fix p0 position by resetting it after integration, or we just manually move p0
    solver.setGravity(0, 10);

    for (let i = 0; i < 60; i++) {
      // Keep p0 fixed
      solver.setPointPosition(p0, 0, 0);
      solver.prevPositions[0] = 0;
      solver.prevPositions[1] = 0;
      solver.update(0.16);
      solver.setPointPosition(p0, 0, 0); // enforce pin
      solver.prevPositions[0] = 0;
      solver.prevPositions[1] = 0;
    }

    const out1 = { x: 0, y: 0 };
    const out2 = { x: 0, y: 0 };
    solver.getPointPosition(p1, out1);
    solver.getPointPosition(p2, out2);

    // Points should have fallen down due to gravity, y should be positive
    expect(out1.y).toBeGreaterThan(0);
    expect(out2.y).toBeGreaterThan(out1.y);

    // Check constraint distances
    const dist1 = Math.sqrt(out1.x * out1.x + out1.y * out1.y);
    const dist2 = Math.sqrt((out2.x - out1.x) ** 2 + (out2.y - out1.y) ** 2);

    expect(dist1).toBeGreaterThan(9);
    expect(dist1).toBeLessThan(11);
    expect(dist2).toBeGreaterThan(9);
    expect(dist2).toBeLessThan(11);
  });
});
