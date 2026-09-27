/**
 * Grid-based Poisson solver for Unilateral Incompressibility Constraint (UIC).
 * Useful for Continuum Crowds and fluid simulations.
 * Implements a Jacobi iteration solver using SoA Float32Array for zero-allocation performance.
 */
export class PoissonSolver {
  public readonly width: number;
  public readonly height: number;

  // Grid attributes
  public readonly density: Float32Array;
  public readonly pressure: Float32Array;
  public readonly divergence: Float32Array;

  // Internal buffers for double buffering
  private readonly nextPressure: Float32Array;

  // Cell size (dx, dy)
  public cellSize: number;

  constructor(width: number, height: number, cellSize = 1.0) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;

    const size = width * height;
    this.density = new Float32Array(size);
    this.pressure = new Float32Array(size);
    this.divergence = new Float32Array(size);
    this.nextPressure = new Float32Array(size);
  }

  /**
   * Clear all grid data for a new frame.
   */
  public clear(): void {
    this.density.fill(0);
    this.pressure.fill(0);
    this.divergence.fill(0);
    this.nextPressure.fill(0);
  }

  /**
   * Splats a quantity (e.g., density or mass) at world coordinates (x, y)
   * using bilinear interpolation.
   * @param x World X coordinate
   * @param y World Y coordinate
   * @param amount Amount to splat
   */
  public splatDensity(x: number, y: number, amount: number): void {
    const gridX = x / this.cellSize;
    const gridY = y / this.cellSize;

    const ix = Math.floor(gridX);
    const iy = Math.floor(gridY);

    const fx = gridX - ix;
    const fy = gridY - iy;

    const w00 = (1 - fx) * (1 - fy);
    const w10 = fx * (1 - fy);
    const w01 = (1 - fx) * fy;
    const w11 = fx * fy;

    const { width, height, density } = this;

    // Bounds check
    if (ix >= 0 && ix < width - 1 && iy >= 0 && iy < height - 1) {
      const idx00 = iy * width + ix;
      const idx10 = idx00 + 1;
      const idx01 = idx00 + width;
      const idx11 = idx01 + 1;

      density[idx00] += amount * w00;
      density[idx10] += amount * w10;
      density[idx01] += amount * w01;
      density[idx11] += amount * w11;
    }
  }

  /**
   * Computes the divergence field based on the UIC logic.
   * For crowds, if density exceeds a target, we want a positive divergence
   * to push agents away (pressure).
   * @param targetDensity The maximum allowed density
   */
  public computeDivergence(targetDensity: number): void {
    const { density, divergence } = this;
    for (let i = 0; i < density.length; i++) {
      const diff = density[i] - targetDensity;
      // Only positive divergence for over-dense regions (Unilateral)
      divergence[i] = diff > 0 ? diff : 0;
    }
  }

  /**
   * Solves the Poisson equation for pressure using Jacobi iteration.
   * Laplacian(pressure) = divergence
   * @param iterations Number of Jacobi iterations
   */
  public solve(iterations: number): void {
    const { width, height, pressure, nextPressure, divergence, cellSize } = this;

    // Laplacian dx^2
    const dx2 = cellSize * cellSize;
    // const alpha = ...
    const beta = 4.0; // beta is usually 4 (for 2D grid)
    const invBeta = 1.0 / beta;

    for (let iter = 0; iter < iterations; iter++) {
      // Update interior cells
      // For boundaries, we assume Dirichlet (P=0) or Neumann (dP/dn=0).
      // Let's use simple Neumann by letting bounds equal adjacent for gradient,
      // but for simplicity here we just don't iterate on the very border (Dirichlet p=0).
      for (let y = 1; y < height - 1; y++) {
        let idx = y * width + 1;
        for (let x = 1; x < width - 1; x++) {
          const pL = pressure[idx - 1];
          const pR = pressure[idx + 1];
          const pB = pressure[idx - width];
          const pT = pressure[idx + width];

          const div = divergence[idx];

          // Jacobi step
          // p_new = (pL + pR + pB + pT + div * dx2) / beta
          let pNew = (pL + pR + pB + pT + div * dx2) * invBeta;

          // UIC: pressure cannot be negative (no attractive force)
          if (pNew < 0) {
            pNew = 0;
          }

          nextPressure[idx] = pNew;
          idx++;
        }
      }

      // Apply bounds (Dirichlet P=0 at boundary for simplicity)
      // Or copy nextPressure to pressure
      pressure.set(nextPressure);
    }
  }

  /**
   * Samples the pressure gradient at world coordinates.
   * @param x World X coordinate
   * @param y World Y coordinate
   * @param outGradient Float32Array of length 2 to store [dx, dy] without allocation
   */
  public getPressureGradient(x: number, y: number, outGradient: Float32Array): void {
    const gridX = x / this.cellSize;
    const gridY = y / this.cellSize;

    const ix = Math.floor(gridX);
    const iy = Math.floor(gridY);

    const { width, height, pressure, cellSize } = this;

    if (ix > 0 && ix < width - 1 && iy > 0 && iy < height - 1) {
      const idx = iy * width + ix;
      // Central difference for gradient
      const dpdx = (pressure[idx + 1] - pressure[idx - 1]) / (2 * cellSize);
      const dpdy = (pressure[idx + width] - pressure[idx - width]) / (2 * cellSize);

      outGradient[0] = dpdx;
      outGradient[1] = dpdy;
    } else {
      outGradient[0] = 0;
      outGradient[1] = 0;
    }
  }
}
