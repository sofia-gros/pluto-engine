import { describe, expect, it } from 'vitest';
import { XPBDSolver } from '../src/XPBDSolver';

describe('XPBDSolver', () => {
  it('should resolve penetration between two particles', () => {
    const count = 2;
    const positionsX = new Float32Array([0, 1.5]);
    const positionsY = new Float32Array([0, 0]);
    const radii = new Float32Array([1, 1]); // minDist = 2
    const invMasses = new Float32Array([1, 1]); // equal mass

    // They are 1.5 units apart, but radii sum is 2.0.
    // Penetration is 0.5. They should move 0.25 units each away from each other.

    XPBDSolver.solve(
      count,
      positionsX,
      positionsY,
      radii,
      invMasses,
      1, // 1 iteration
      1 / 60,
      0, // stiff constraint
    );

    // Expected distance is 2.0
    // Particle 0 moves left: 0 - 0.25 = -0.25
    // Particle 1 moves right: 1.5 + 0.25 = 1.75
    expect(positionsX[0]).toBeCloseTo(-0.25);
    expect(positionsX[1]).toBeCloseTo(1.75);
    expect(positionsY[0]).toBeCloseTo(0);
    expect(positionsY[1]).toBeCloseTo(0);
  });

  it('should resolve penetration with a static particle', () => {
    const count = 2;
    const positionsX = new Float32Array([0, 1.5]);
    const positionsY = new Float32Array([0, 0]);
    const radii = new Float32Array([1, 1]);
    const invMasses = new Float32Array([0, 1]); // Particle 0 is static

    XPBDSolver.solve(count, positionsX, positionsY, radii, invMasses, 1, 1 / 60, 0);

    // Particle 0 is static, so it shouldn't move.
    expect(positionsX[0]).toBeCloseTo(0);
    // Particle 1 should move the entire 0.5 distance to resolve penetration.
    expect(positionsX[1]).toBeCloseTo(2.0);
  });

  it('should handle multi-iteration solving for multiple particles', () => {
    const count = 3;
    const positionsX = new Float32Array([0, 1.5, 3.0]);
    const positionsY = new Float32Array([0, 0, 0]);
    const radii = new Float32Array([1, 1, 1]); // Overlap between 0-1 and 1-2
    const invMasses = new Float32Array([1, 1, 1]);

    XPBDSolver.solve(
      count,
      positionsX,
      positionsY,
      radii,
      invMasses,
      5, // Multiple iterations to propagate constraints
      1 / 60,
      0,
    );

    // All should be at least distance 2 apart
    const d01 = Math.abs(positionsX[0] - positionsX[1]);
    const d12 = Math.abs(positionsX[1] - positionsX[2]);

    expect(d01).toBeGreaterThanOrEqual(1.99);
    expect(d12).toBeGreaterThanOrEqual(1.99);
  });
});
