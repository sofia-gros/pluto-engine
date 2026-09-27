/**
 * SDFCollider
 * Represents a 2D Signed Distance Field for continuous collision detection.
 * Optimized for zero-allocation and O(1) evaluation at any point.
 */
export class SDFCollider {
  private width: number;
  private height: number;
  private invResolution: number;
  private data: Float32Array;

  /**
   * @param width Width of the SDF grid in cells
   * @param height Height of the SDF grid in cells
   * @param resolution World units per cell
   * @param initialData Optional pre-populated Float32Array of distances (size: width * height)
   */
  constructor(width: number, height: number, resolution: number, initialData?: Float32Array) {
    this.width = width;
    this.height = height;
    this.invResolution = 1.0 / resolution;

    if (initialData) {
      if (initialData.length !== width * height) {
        throw new Error('initialData length must match width * height');
      }
      this.data = initialData;
    } else {
      this.data = new Float32Array(width * height);
    }
  }

  /**
   * Set the distance value at a specific cell
   */
  public setDistance(x: number, y: number, distance: number): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    this.data[y * this.width + x] = distance;
  }

  /**
   * Get the distance value at a specific cell
   */
  public getDistance(x: number, y: number): number {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
    return this.data[y * this.width + x];
  }

  /**
   * Evaluate distance and normal at arbitrary world coordinates (O(1)).
   * Results are written to the outResult array to avoid allocation.
   *
   * @param x World X coordinate
   * @param y World Y coordinate
   * @param outResult Float32Array of at least length 3 [distance, normalX, normalY]
   */
  public evaluate(x: number, y: number, outResult: Float32Array): void {
    const gx = x * this.invResolution;
    const gy = y * this.invResolution;

    const ix = Math.floor(gx);
    const iy = Math.floor(gy);

    const fx = gx - ix;
    const fy = gy - iy;

    const x0 = Math.max(0, Math.min(this.width - 1, ix));
    const y0 = Math.max(0, Math.min(this.height - 1, iy));
    const x1 = Math.max(0, Math.min(this.width - 1, ix + 1));
    const y1 = Math.max(0, Math.min(this.height - 1, iy + 1));

    const d00 = this.data[y0 * this.width + x0];
    const d10 = this.data[y0 * this.width + x1];
    const d01 = this.data[y1 * this.width + x0];
    const d11 = this.data[y1 * this.width + x1];

    // Bilinear interpolation for distance
    const d0 = d00 * (1 - fx) + d10 * fx;
    const d1 = d01 * (1 - fx) + d11 * fx;
    const dist = d0 * (1 - fy) + d1 * fy;

    // Gradient of bilinear interpolation
    const ddx = (d10 - d00) * (1 - fy) + (d11 - d01) * fy;
    const ddy = (d01 - d00) * (1 - fx) + (d11 - d10) * fx;

    const lenSq = ddx * ddx + ddy * ddy;
    let nx = 0;
    let ny = 0;
    if (lenSq > 1e-12) {
      const len = Math.sqrt(lenSq);
      nx = ddx / len;
      ny = ddy / len;
    }

    outResult[0] = dist;
    outResult[1] = nx;
    outResult[2] = ny;
  }
}
