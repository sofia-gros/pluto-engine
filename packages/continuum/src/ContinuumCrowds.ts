/**
 * @file ContinuumCrowds.ts
 * @description
 * Continuum Crowds (連続体群集) の統合ファサード。
 *
 * 圧力の Poisson UIC ソルバ (UIC 密度場) と、
 * アイコナール方程式ベースの経路場 (EikonalField) を配線し、
 * 大群の「圧力による押し合い」と「障害物を回り込む誘導」を
 * 1 つの API から使えるようにします。
 *
 * 完全独立 (Pure Math): ブラウザ API を持ちません。
 */

import { EikonalField, type EikonalOptions } from './EikonalField';

export interface ContinuumCrowdsOptions {
  /** 目標とする密度のしきい値。これを超えたら圧力を生じさせます */
  targetDensity?: number;
  /** 圧力を増幅する係数 */
  pressureStiffness?: number;
  /** 勾配の平滑化設定 */
  gradient?: EikonalOptions;
}

export class ContinuumCrowds {
  /** 目標密度 (セルあたりの目標個体数) */
  public targetDensity: number;
  /** 圧力の増幅係数 */
  public pressureStiffness: number;

  /** 圧力場 (0 以上) */
  public readonly pressure: Float32Array;
  /** 速度場 (目標進行方向と圧力勾配の合成結果) */
  public readonly fieldVx: Float32Array;
  public readonly fieldVy: Float32Array;
  /** 到達不能セル */
  public readonly unreachable: Uint8Array;

  public readonly width: number;
  public readonly height: number;
  public readonly cellSize: number;
  private readonly invCellSize: number;
  private readonly invCellSizeSq: number;

  /** 一時作業バッファ (コンストラクタで確保) */
  public readonly density: Float32Array;
  private readonly _nextPressure: Float32Array;
  private readonly _divergence: Float32Array;
  private readonly _targetVx: Float32Array;
  private readonly _targetVy: Float32Array;
  private readonly _eikonal: EikonalField;

  constructor(
    width: number,
    height: number,
    cellSize: number,
    options: ContinuumCrowdsOptions = {},
  ) {
    if (width <= 0 || height <= 0) throw new Error('field size must be positive');
    if (cellSize <= 0) throw new Error('cellSize must be positive');

    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.invCellSize = 1.0 / cellSize;
    this.invCellSizeSq = this.invCellSize * this.invCellSize;

    this.targetDensity = options.targetDensity ?? 3.5;
    this.pressureStiffness = options.pressureStiffness ?? 1.5;

    const n = width * height;
    this.pressure = new Float32Array(n);
    this.fieldVx = new Float32Array(n);
    this.fieldVy = new Float32Array(n);
    this.unreachable = new Uint8Array(n);

    this.density = new Float32Array(n);
    this._nextPressure = new Float32Array(n);
    this._divergence = new Float32Array(n);
    this._targetVx = new Float32Array(n);
    this._targetVy = new Float32Array(n);
    this._eikonal = new EikonalField(width, height, cellSize);
  }

  /**
   * 密度場をゼロへ戻します。毎フレームの最初の操作です。
   */
  public clear(): void {
    this.density.fill(0);
  }

  /**
   * 個体を密度場へスプラットします (双線形補間)。
   * エンティティごとに格子 4 点へ書き込むだけなので O(1)/体 です。
   */
  public splat(x: number, y: number, amount = 1.0): void {
    const gx = x * this.invCellSize;
    const gy = y * this.invCellSize;
    const ix = Math.floor(gx);
    const iy = Math.floor(gy);
    const fx = gx - ix;
    const fy = gy - iy;

    const x0 = Math.max(0, Math.min(this.width - 1, ix));
    const y0 = Math.max(0, Math.min(this.height - 1, iy));
    const x1 = Math.max(0, Math.min(this.width - 1, ix + 1));
    const y1 = Math.max(0, Math.min(this.height - 1, iy + 1));

    const d = this.density;
    d[y0 * this.width + x0] += amount * (1 - fx) * (1 - fy);
    d[y0 * this.width + x1] += amount * fx * (1 - fy);
    d[y1 * this.width + x0] += amount * (1 - fx) * fy;
    d[y1 * this.width + x1] += amount * fx * fy;
  }

  /**
   * 一様非圧縮性拘束 (UIC) の発散項を計算します。
   * 目標密度を超えた分だけが正になります (引力のための負の圧力は作りません)。
   */
  public computeDivergence(): void {
    const n = this.width * this.height;
    const t = this.targetDensity;
    for (let i = 0; i < n; i++) {
      const excess = this.density[i] - t;
      this._divergence[i] = excess > 0 ? excess : 0;
    }
  }

  /**
   * 圧力をヤコビ反復で解きます。
   *
   * 負の圧力 (引力) は発生させません。UIC の本質的な制約です。
   *
   * @param iterations 反復回数。実時間では 2 から 4 程度が目安です
   */
  public solvePressure(iterations = 2): void {
    const w = this.width;
    const h = this.height;
    const p = this.pressure;
    const next = this._nextPressure;
    const div = this._divergence;
    const k = this.pressureStiffness * this.invCellSizeSq;

    // 境界は 0 に固定します
    for (let i = 0; i < w; i++) {
      p[i] = 0;
      p[(h - 1) * w + i] = 0;
    }
    for (let y = 0; y < h; y++) {
      p[y * w] = 0;
      p[y * w + w - 1] = 0;
    }

    for (let it = 0; it < iterations; it++) {
      for (let y = 1; y < h - 1; y++) {
        const row = y * w;
        for (let x = 1; x < w - 1; x++) {
          const idx = row + x;
          const sum = p[idx - 1] + p[idx + 1] + p[idx - w] + p[idx + w] + div[idx] * k;
          const v = sum * 0.25;
          // UIC: 負の圧力は発生させない
          next[idx] = v > 0 ? v : 0;
        }
      }
      // ダブルバッファの入れ替え
      p.set(next);
    }
  }

  /**
   * 目標方向場を設定します (ゴールへ向かう単位ベクトル)。
   */
  public setTargetDirection(x: number, y: number, dirX: number, dirY: number): void {
    const gx = Math.floor(x * this.invCellSize);
    const gy = Math.floor(y * this.invCellSize);
    if (gx < 0 || gx >= this.width || gy < 0 || gy >= this.height) return;
    this.setTargetDirectionRaw(gy * this.width + gx, dirX, dirY);
  }

  /**
   * セルインデックスの直接指定で目標方向を設定します。
   * 呼び出し側が既にグリッド座標を計算済みの場合に使います。
   */
  public setTargetDirectionRaw(index: number, dirX: number, dirY: number): void {
    if (index < 0 || index >= this.width * this.height) return;
    const len = Math.sqrt(dirX * dirX + dirY * dirY);
    if (len < 1e-6) return;
    this._targetVx[index] = dirX / len;
    this._targetVy[index] = dirY / len;
  }

  /**
   * アイコナール方程式で障害物を回り込む経路場を構築します。
   *
   * 圧力場とは独立に、目標地点から各セルまでの距離を解きます。
   * これにより壁の向こう側へ迂回する経路が得られます。
   *
   * @param goalIndex ゴールのセルインデックス
   * @param isWall 壁かどうかを返す関数
   */
  public solveNavigation(
    goalIndex: number,
    isWall: (x: number, y: number) => boolean,
    options: EikonalOptions = {},
  ): void {
    this._eikonal.markWalls(isWall);
    this._eikonal.solve(goalIndex);
    this._eikonal.computeGradient(options);
    this._eikonal.normalizeGradient();

    const n = this.width * this.height;
    for (let i = 0; i < n; i++) {
      this.unreachable[i] = this._eikonal.unreachable[i];
    }
  }

  /**
   * 圧力勾配と目標方向を合成して速度場を一括計算します。
   *
   * エンティティ数に依存せず、セル数 (16k 程度) だけを走査します。
   * これが Continuum Crowds が 30 万体でも軽い理由です。
   *
   * @param speed 目標速度
   * @param pressureWeight 圧力勾配の影響度
   * @param useNavigation true の場合、経路場の勾配を優先します
   */
  public bakeVelocityField(speed: number, pressureWeight = 0.7, useNavigation = true): void {
    const w = this.width;
    const h = this.height;
    const p = this.pressure;
    const inv2Cell = 0.5 * this.invCellSize;

    for (let y = 1; y < h - 1; y++) {
      const row = y * w;
      for (let x = 1; x < w - 1; x++) {
        const idx = row + x;
        if (this.unreachable[idx] === 1) {
          this.fieldVx[idx] = 0;
          this.fieldVy[idx] = 0;
          continue;
        }

        const dpdx = (p[idx + 1] - p[idx - 1]) * inv2Cell;
        const dpdy = (p[idx + w] - p[idx - w]) * inv2Cell;

        let bx = this._targetVx[idx];
        let by = this._targetVy[idx];

        if (useNavigation) {
          // 経路場の勾配 (距離の減少方向) を優先し、
          // 目標方向が未設定のセルだけを使う
          const nx = this._eikonal.gradX[idx];
          const ny = this._eikonal.gradY[idx];
          if (nx !== 0 || ny !== 0) {
            bx = nx;
            by = ny;
          }
        }

        const svx = bx - dpdx * pressureWeight;
        const svy = by - dpdy * pressureWeight;
        const d2 = svx * svx + svy * svy;

        if (d2 > 1e-8) {
          const k = speed / Math.sqrt(d2);
          this.fieldVx[idx] = svx * k;
          this.fieldVy[idx] = svy * k;
        } else {
          this.fieldVx[idx] = 0;
          this.fieldVy[idx] = 0;
        }
      }
    }
  }

  /**
   * 速度場を双線形補間してサンプリングします。
   * セル境界での不連続な回転が完全に消えます。
   *
   * @param outVel 長さ 2 以上の Float32Array [vx, vy]
   * @returns 到達不能なら false
   */
  public sampleVelocity(x: number, y: number, outVel: Float32Array): boolean {
    const gx = x * this.invCellSize;
    const gy = y * this.invCellSize;
    const ix = Math.floor(gx);
    const iy = Math.floor(gy);
    const fx = gx - ix;
    const fy = gy - iy;

    const x0 = Math.max(0, Math.min(this.width - 1, ix));
    const y0 = Math.max(0, Math.min(this.height - 1, iy));
    const x1 = Math.max(0, Math.min(this.width - 1, ix + 1));
    const y1 = Math.max(0, Math.min(this.height - 1, iy + 1));

    const i00 = y0 * this.width + x0;
    const i10 = y0 * this.width + x1;
    const i01 = y1 * this.width + x0;
    const i11 = y1 * this.width + x1;

    if (this.unreachable[i00] === 1 || this.unreachable[i10] === 1) {
      outVel[0] = 0;
      outVel[1] = 0;
      return false;
    }

    // Lerp of Lerp: 乗算 3 回・加算 3 回にまとめます
    const topVx = this.fieldVx[i00] + fx * (this.fieldVx[i10] - this.fieldVx[i00]);
    const botVx = this.fieldVx[i01] + fx * (this.fieldVx[i11] - this.fieldVx[i01]);
    const topVy = this.fieldVy[i00] + fx * (this.fieldVy[i10] - this.fieldVy[i00]);
    const botVy = this.fieldVy[i01] + fx * (this.fieldVy[i11] - this.fieldVy[i01]);

    outVel[0] = topVx + fy * (botVx - topVx);
    outVel[1] = topVy + fy * (botVy - topVy);
    return true;
  }

  /**
   * 圧力を直接サンプルします。
   */
  public pressureAt(x: number, y: number): number {
    const gx = Math.floor(x * this.invCellSize);
    const gy = Math.floor(y * this.invCellSize);
    if (gx < 0 || gx >= this.width || gy < 0 || gy >= this.height) return 0;
    return this.pressure[gy * this.width + gx];
  }

  /**
   * 経路場からSampling した進行方向を返します。
   */
  public sampleDirection(x: number, y: number, outDir: Float32Array): boolean {
    return this._eikonal.sampleDirection(x, y, outDir);
  }
}

export { EikonalField };
export type { EikonalOptions };
