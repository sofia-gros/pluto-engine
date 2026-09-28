/**
 * 単側非圧縮性制約（UIC: Unilateral Incompressibility Constraint）に基づくグリッドポアソンソルバー。
 * 群集流体シミュレーション（Continuum Crowds）や流体シミュレーションで活用される。
 * ゼロアロケーション原則に従い、SoA (Float32Array) によるヤコビ反復解法を実装。
 */
export class PoissonSolver {
  public readonly width: number;
  public readonly height: number;

  // グリッド属性バッファ
  public readonly density: Float32Array;
  public readonly pressure: Float32Array;
  public readonly divergence: Float32Array;

  // 統合速度場（Precomputed Vector Field）用バッファ
  public readonly vectorFieldVx: Float32Array;
  public readonly vectorFieldVy: Float32Array;

  // ダブルバッファリング用内部配列
  private readonly nextPressure: Float32Array;

  // セルサイズおよび逆数（除算削減用）
  public cellSize: number;
  public invCellSize: number;

  constructor(width: number, height: number, cellSize = 1.0) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.invCellSize = 1.0 / cellSize;

    const size = width * height;
    this.density = new Float32Array(size);
    this.pressure = new Float32Array(size);
    this.divergence = new Float32Array(size);
    this.nextPressure = new Float32Array(size);
    this.vectorFieldVx = new Float32Array(size);
    this.vectorFieldVy = new Float32Array(size);
  }

  /**
   * 新しいフレーム用に全グリッドデータをクリアする。
   */
  public clear(): void {
    this.density.fill(0);
    this.pressure.fill(0);
    this.divergence.fill(0);
    this.nextPressure.fill(0);
    this.vectorFieldVx.fill(0);
    this.vectorFieldVy.fill(0);
  }

  /**
   * 双線形補間（Bilinear Splatting）を用いて、ワールド座標 (x, y) に密度（または質量）を加算する。
   * @param x ワールドX座標
   * @param y ワールドY座標
   * @param amount 加算量
   */
  public splatDensity(x: number, y: number, amount: number): void {
    const gridX = x * this.invCellSize;
    const gridY = y * this.invCellSize;

    const ix = gridX | 0;
    const iy = gridY | 0;

    const fx = gridX - ix;
    const fy = gridY - iy;

    const w00 = (1.0 - fx) * (1.0 - fy);
    const w10 = fx * (1.0 - fy);
    const w01 = (1.0 - fx) * fy;
    const w11 = fx * fy;

    const { width, height, density } = this;

    // 境界チェック
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
   * UIC ロジックに基づき発散場（Divergence Field）を計算する。
   * 目標密度を超過した過密領域にのみ正の圧力（押し戻し力）を発生させる。
   * @param targetDensity 許容最大密度
   */
  public computeDivergence(targetDensity: number): void {
    const { density, divergence } = this;
    for (let i = 0; i < density.length; i++) {
      const diff = density[i] - targetDensity;
      divergence[i] = diff > 0 ? diff : 0;
    }
  }

  /**
   * ヤコビ反復（Jacobi Iteration）を用いてポアソン圧力方程式を解く。
   * Laplacian(pressure) = divergence
   * @param iterations 反復回数
   */
  public solve(iterations: number): void {
    const { width, height, pressure, nextPressure, divergence, cellSize } = this;

    const dx2 = cellSize * cellSize;
    const invBeta = 0.25; // 2D グリッドの 1/4

    for (let iter = 0; iter < iterations; iter++) {
      for (let y = 1; y < height - 1; y++) {
        let idx = y * width + 1;
        for (let x = 1; x < width - 1; x++) {
          const pL = pressure[idx - 1];
          const pR = pressure[idx + 1];
          const pB = pressure[idx - width];
          const pT = pressure[idx + width];

          const div = divergence[idx];

          let pNew = (pL + pR + pB + pT + div * dx2) * invBeta;

          // UIC: 負の圧力（引力）は発生させない
          if (pNew < 0) {
            pNew = 0;
          }

          nextPressure[idx] = pNew;
          idx++;
        }
      }

      pressure.set(nextPressure);
    }
  }

  /**
   * 圧力勾配と目標方向ベクトルを統合し、全グリッドセルに対して事前に速度場を一括計算する。
   * 30万体エンティティが毎フレーム個別に行っていた勾配計算・平方根演算を 1 回（16k回）に集約する。
   * @param baseDirX 目標進行方向 X 成分配列
   * @param baseDirY 目標進行方向 Y 成分配列
   * @param speed 基本移動速度
   * @param pressureWeight 圧力勾配の影響度係数
   */
  public precomputeVectorField(
    baseDirX: Float32Array,
    baseDirY: Float32Array,
    speed: number,
    pressureWeight = 0.5,
  ): void {
    const { width, height, pressure, vectorFieldVx, vectorFieldVy } = this;
    const inv2Cell = 0.5 * this.invCellSize;

    for (let y = 1; y < height - 1; y++) {
      const rowIdx = y * width;
      for (let x = 1; x < width - 1; x++) {
        const idx = rowIdx + x;
        const dpdx = (pressure[idx + 1] - pressure[idx - 1]) * inv2Cell;
        const dpdy = (pressure[idx + width] - pressure[idx - width]) * inv2Cell;

        const svx = baseDirX[idx] - dpdx * pressureWeight;
        const svy = baseDirY[idx] - dpdy * pressureWeight;

        const d2 = svx * svx + svy * svy;
        if (d2 > 0.0001) {
          const invLen = speed / (Math.sqrt(d2) + 0.0001);
          vectorFieldVx[idx] = svx * invLen;
          vectorFieldVy[idx] = svy * invLen;
        } else {
          vectorFieldVx[idx] = 0;
          vectorFieldVy[idx] = 0;
        }
      }
    }
  }

  /**
   * 事前計算済み速度場から、双線形補間（Bilinear Interpolation）を用いて滑らかな移動速度をサンプリングする。
   * セル境界での不連続な回転・急旋回を完全に排除する。
   * @param x ワールドX座標
   * @param y ワールドY座標
   * @param outVel [vx, vy] を格納する Float32Array（ゼロアロケーション）
   */
  public sampleVelocityBilinear(x: number, y: number, outVel: Float32Array): void {
    const gridX = x * this.invCellSize;
    const gridY = y * this.invCellSize;

    const ix = gridX | 0;
    const iy = gridY | 0;

    const { width, height, vectorFieldVx, vectorFieldVy } = this;

    if (ix >= 1 && ix < width - 2 && iy >= 1 && iy < height - 2) {
      const fx = gridX - ix;
      const fy = gridY - iy;

      const w00 = (1.0 - fx) * (1.0 - fy);
      const w10 = fx * (1.0 - fy);
      const w01 = (1.0 - fx) * fy;
      const w11 = fx * fy;

      const idx00 = iy * width + ix;
      const idx10 = idx00 + 1;
      const idx01 = idx00 + width;
      const idx11 = idx01 + 1;

      outVel[0] =
        vectorFieldVx[idx00] * w00 +
        vectorFieldVx[idx10] * w10 +
        vectorFieldVx[idx01] * w01 +
        vectorFieldVx[idx11] * w11;

      outVel[1] =
        vectorFieldVy[idx00] * w00 +
        vectorFieldVy[idx10] * w10 +
        vectorFieldVy[idx01] * w01 +
        vectorFieldVy[idx11] * w11;
    } else {
      outVel[0] = 0;
      outVel[1] = 0;
    }
  }

  /**
   * ワールド座標における圧力勾配をサンプリングする。
   * @param x ワールドX座標
   * @param y ワールドY座標
   * @param outGradient [dx, dy] を格納する Float32Array（ゼロアロケーション）
   */
  public getPressureGradient(x: number, y: number, outGradient: Float32Array): void {
    const gridX = x * this.invCellSize;
    const gridY = y * this.invCellSize;

    const ix = gridX | 0;
    const iy = gridY | 0;

    const { width, height, pressure, invCellSize } = this;

    if (ix > 0 && ix < width - 1 && iy > 0 && iy < height - 1) {
      const idx = iy * width + ix;
      const inv2Cell = 0.5 * invCellSize;
      const dpdx = (pressure[idx + 1] - pressure[idx - 1]) * inv2Cell;
      const dpdy = (pressure[idx + width] - pressure[idx - width]) * inv2Cell;

      outGradient[0] = dpdx;
      outGradient[1] = dpdy;
    } else {
      outGradient[0] = 0;
      outGradient[1] = 0;
    }
  }
}
