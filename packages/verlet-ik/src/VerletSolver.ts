/**
 * Zero-allocation Verlet integration solver using Float32Array.
 * Optimized for cache locality and performance.
 */
export class VerletSolver {
  public positions: Float32Array;
  public prevPositions: Float32Array;
  public constraints: Int32Array;
  public constraintLengths: Float32Array;

  private _numPoints: number;
  private _numConstraints: number;
  private _iterations: number;
  private _gravityX: number;
  private _gravityY: number;

  /**
   * @param maxPoints Maximum number of points
   * @param maxConstraints Maximum number of distance constraints
   * @param iterations Number of iterations for constraint solving (default: 3)
   */
  constructor(maxPoints: number, maxConstraints: number, iterations = 3) {
    this.positions = new Float32Array(maxPoints * 2);
    this.prevPositions = new Float32Array(maxPoints * 2);
    this.constraints = new Int32Array(maxConstraints * 2);
    this.constraintLengths = new Float32Array(maxConstraints);

    this._numPoints = 0;
    this._numConstraints = 0;
    this._iterations = iterations;
    this._gravityX = 0.0;
    this._gravityY = 0.0;
  }

  public setGravity(gx: number, gy: number): void {
    this._gravityX = gx;
    this._gravityY = gy;
  }

  public addPoint(x: number, y: number): number {
    const index = this._numPoints;
    const offset = index * 2;
    this.positions[offset] = x;
    this.positions[offset + 1] = y;
    this.prevPositions[offset] = x;
    this.prevPositions[offset + 1] = y;
    this._numPoints++;
    return index;
  }

  public setPointPosition(index: number, x: number, y: number): void {
    const offset = index * 2;
    this.positions[offset] = x;
    this.positions[offset + 1] = y;
  }

  public getPointPosition(index: number, out: { x: number; y: number }): void {
    const offset = index * 2;
    out.x = this.positions[offset];
    out.y = this.positions[offset + 1];
  }

  public addConstraint(p1: number, p2: number, length: number): number {
    const index = this._numConstraints;
    this.constraints[index * 2] = p1;
    this.constraints[index * 2 + 1] = p2;
    this.constraintLengths[index] = length;
    this._numConstraints++;
    return index;
  }

  public update(dt: number): void {
    this.integrate(dt);
    for (let i = 0; i < this._iterations; i++) {
      this.solveConstraints();
    }
  }

  private integrate(dt: number): void {
    const dtSq = dt * dt;
    const gx = this._gravityX * dtSq;
    const gy = this._gravityY * dtSq;

    for (let i = 0; i < this._numPoints; i++) {
      const offset = i * 2;
      const x = this.positions[offset];
      const y = this.positions[offset + 1];
      const px = this.prevPositions[offset];
      const py = this.prevPositions[offset + 1];

      const vx = x - px;
      const vy = y - py;

      this.prevPositions[offset] = x;
      this.prevPositions[offset + 1] = y;

      this.positions[offset] = x + vx + gx;
      this.positions[offset + 1] = y + vy + gy;
    }
  }

  private solveConstraints(): void {
    for (let i = 0; i < this._numConstraints; i++) {
      const p1 = this.constraints[i * 2];
      const p2 = this.constraints[i * 2 + 1];
      const targetLength = this.constraintLengths[i];

      const off1 = p1 * 2;
      const off2 = p2 * 2;

      const x1 = this.positions[off1];
      const y1 = this.positions[off1 + 1];
      const x2 = this.positions[off2];
      const y2 = this.positions[off2 + 1];

      const dx = x2 - x1;
      const dy = y2 - y1;
      const distSq = dx * dx + dy * dy;

      if (distSq > 0) {
        const dist = Math.sqrt(distSq);
        const diff = (targetLength - dist) / dist;
        const offsetX = dx * 0.5 * diff;
        const offsetY = dy * 0.5 * diff;

        this.positions[off1] -= offsetX;
        this.positions[off1 + 1] -= offsetY;
        this.positions[off2] += offsetX;
        this.positions[off2 + 1] += offsetY;
      }
    }
  }

  public reset(): void {
    this._numPoints = 0;
    this._numConstraints = 0;
  }
}
