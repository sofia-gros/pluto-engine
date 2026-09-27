/**
 * Pure function XPBDSolver for 2D circular particle penetration resolution.
 * Strictly avoids allocations (no `new`) during calculation.
 * Operates directly on Structure of Arrays (SoA) for cache-friendly access.
 */
export class XPBDSolver {
  /**
   * Solves penetration constraints using Extended Position-Based Dynamics (XPBD).
   *
   * @param count The number of entities.
   * @param positionsX Float32Array containing X coordinates.
   * @param positionsY Float32Array containing Y coordinates.
   * @param radii Float32Array containing radii of the circles.
   * @param invMasses Float32Array containing inverse masses (0 for static objects).
   * @param iterations Number of solver iterations per substep.
   * @param dt Time step size.
   * @param compliance Constraint compliance (0 for infinitely stiff).
   */
  public static solve(
    count: number,
    positionsX: Float32Array,
    positionsY: Float32Array,
    radii: Float32Array,
    invMasses: Float32Array,
    iterations: number,
    dt: number,
    compliance = 0,
  ): void {
    const alpha = compliance / (dt * dt);

    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < count; i++) {
        const xi = positionsX[i];
        const yi = positionsY[i];
        const ri = radii[i];
        const wi = invMasses[i];

        for (let j = i + 1; j < count; j++) {
          const xj = positionsX[j];
          const yj = positionsY[j];
          const rj = radii[j];
          const wj = invMasses[j];

          const wSum = wi + wj;
          if (wSum === 0.0) continue; // Both objects are static

          const dx = xi - xj;
          const dy = yi - yj;
          const distSq = dx * dx + dy * dy;
          const minDist = ri + rj;

          // Check for penetration
          if (distSq < minDist * minDist) {
            const dist = Math.sqrt(distSq);

            // Normal vector
            const nx = dist > 1e-6 ? dx / dist : 1.0;
            const ny = dist > 1e-6 ? dy / dist : 0.0;

            // Penetration depth (negative value since C <= 0 constraint)
            const C = dist - minDist;

            // XPBD positional correction
            const deltaLambda = -C / (wSum + alpha);

            const px = nx * deltaLambda;
            const py = ny * deltaLambda;

            // Apply position updates directly to arrays
            if (wi > 0.0) {
              positionsX[i] += px * wi;
              positionsY[i] += py * wi;
            }
            if (wj > 0.0) {
              positionsX[j] -= px * wj;
              positionsY[j] -= py * wj;
            }
          }
        }
      }
    }
  }
}
