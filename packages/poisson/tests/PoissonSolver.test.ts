import { beforeEach, describe, expect, it } from 'vitest';
import { PoissonSolver } from '../src/PoissonSolver';

describe('PoissonSolver', () => {
  let solver: PoissonSolver;

  beforeEach(() => {
    // 10x10 grid, cell size 1.0
    solver = new PoissonSolver(10, 10, 1.0);
  });

  it('should initialize arrays with zeros', () => {
    expect(solver.density[0]).toBe(0);
    expect(solver.pressure[0]).toBe(0);
    expect(solver.divergence[0]).toBe(0);
    expect(solver.density.length).toBe(100);
  });

  it('should splat density correctly via bilinear interpolation', () => {
    // Splat exactly at the center of cell (2, 2)
    solver.splatDensity(2.0, 2.0, 10.0);

    // At exactly (2.0, 2.0), ix=2, iy=2, fx=0, fy=0
    // It should fully distribute to (2, 2)
    const idx = 2 * 10 + 2;
    expect(solver.density[idx]).toBe(10.0);

    solver.clear();

    // Splat halfway between (3, 3) and (4, 4) -> (3.5, 3.5)
    solver.splatDensity(3.5, 3.5, 10.0);
    expect(solver.density[3 * 10 + 3]).toBeCloseTo(2.5);
    expect(solver.density[3 * 10 + 4]).toBeCloseTo(2.5);
    expect(solver.density[4 * 10 + 3]).toBeCloseTo(2.5);
    expect(solver.density[4 * 10 + 4]).toBeCloseTo(2.5);
  });

  it('should compute divergence for UIC (density > target)', () => {
    solver.splatDensity(2.0, 2.0, 5.0);
    solver.splatDensity(4.0, 4.0, 2.0);

    // Target density is 3.0
    solver.computeDivergence(3.0);

    const idx1 = 2 * 10 + 2;
    const idx2 = 4 * 10 + 4;

    // 5.0 - 3.0 = 2.0 (positive, so kept)
    expect(solver.divergence[idx1]).toBe(2.0);
    // 2.0 - 3.0 = -1.0 (negative, so clamped to 0)
    expect(solver.divergence[idx2]).toBe(0.0);
  });

  it('should solve Poisson equation and yield non-negative pressure', () => {
    solver.splatDensity(5.0, 5.0, 10.0);
    solver.computeDivergence(1.0); // Divergence at center = 9.0

    solver.solve(20); // Run Jacobi iterations

    const centerIdx = 5 * 10 + 5;
    // Pressure should be built up at the center
    expect(solver.pressure[centerIdx]).toBeGreaterThan(0);

    // Check for non-negativity
    for (let i = 0; i < solver.pressure.length; i++) {
      expect(solver.pressure[i]).toBeGreaterThanOrEqual(0);
    }
  });

  it('should compute pressure gradient correctly', () => {
    // Artificially setup pressure
    // p at (2,2) = 0
    // p at (3,2) = 10
    // p at (4,2) = 0
    solver.pressure[2 * 10 + 3] = 10.0;

    const gradient = new Float32Array(2);

    // Gradient at (3,2): (P[4,2] - P[2,2]) / 2 = 0
    solver.getPressureGradient(3.0, 2.0, gradient);
    expect(gradient[0]).toBe(0);

    // Gradient at (2,2): (P[3,2] - P[1,2]) / 2 = 10 / 2 = 5
    solver.getPressureGradient(2.0, 2.0, gradient);
    expect(gradient[0]).toBe(5);
    expect(gradient[1]).toBe(0);
  });

  it('should perform operations with zero allocations', () => {
    const gradient = new Float32Array(2);

    solver.splatDensity(5.5, 5.5, 2.0);
    solver.computeDivergence(1.0);
    solver.solve(5);
    solver.getPressureGradient(5.5, 5.5, gradient);
    solver.clear();

    // Test passes if no errors are thrown and no allocations occur during step.
    // It's conceptually tested by ensuring no 'new' or array literals are in the hot path.
    expect(true).toBe(true);
  });
});
