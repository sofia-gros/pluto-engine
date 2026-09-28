import { PlutoEngine, Scene } from '@pluto-engine/core';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Filler,
  Title,
  Legend,
  Tooltip,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Filler,
  Title,
  Legend,
  Tooltip,
);

/**
 * Steering 内部の詳細分解プロファイリング結果
 */
export interface SteeringDissectionEntry {
  entities: number;

  // 1. 各処理要素の単体コスト (ms)
  t_coord_mapping_floor: number; // Math.floor(lx / cs) 座標変換
  t_coord_mapping_fast: number; // (lx * invCs) | 0 高速ビットシフト座標変換
  t_memory_lookups_raw: number; // 6箇所の Float32Array ランダム読出 (pressure 4点 + dirX/Y 2点)
  t_math_hypot: number; // Math.hypot(svx, svy) による正規化
  t_math_sqrt_inv: number; // 1.0 / Math.sqrt(d2) 乗算正規化
  t_velocity_writes: number; // vx[i], vy[i] への Float32Array 書込

  // 2. アーキテクチャ別 Steering 全体時間の比較 (ms)
  steer_baseline_ms: number; // 【現行】30万回個別勾配計算 + Math.hypot (15.8ms)
  steer_fastmath_ms: number; // 【改善案1】Math.sqrt & 逆数乗算化 (8.0ms)
  steer_fastindex_ms: number; // 【改善案2】Fast Indexing + Fast Math (6.1ms)
  steer_precomputed_grid_ms: number; // 【改善案3】16kグリッド事前計算 (2.7ms)
  steer_bilinear_grid_ms: number; // 【改善案4・本命】16kグリッド + 双線形補間 (3.2ms)

  sampleCount: number;
}

class BenchmarkFlowGrid {
  cols: number;
  rows: number;
  cellSize: number;
  invCellSize: number;
  width: number;
  height: number;
  size: number;
  dirX: Float32Array;
  dirY: Float32Array;
  density: Float32Array;
  pressure: Float32Array;

  // 事前計算済み統合ステアリングベクトルグリッド (128x128 = 16,384 要素)
  precomputedVx: Float32Array;
  precomputedVy: Float32Array;

  originX = 0;
  originY = 0;

  constructor(cols = 128, rows = 128, cellSize = 20) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.invCellSize = 1.0 / cellSize;
    this.width = cols * cellSize;
    this.height = rows * cellSize;
    this.size = cols * rows;
    this.dirX = new Float32Array(this.size);
    this.dirY = new Float32Array(this.size);
    this.density = new Float32Array(this.size);
    this.pressure = new Float32Array(this.size);
    this.precomputedVx = new Float32Array(this.size);
    this.precomputedVy = new Float32Array(this.size);
  }

  updatePlayerCenter(px: number, py: number) {
    this.originX = px - this.width * 0.5;
    this.originY = py - this.height * 0.5;
    const halfW = this.width * 0.5;
    const halfH = this.height * 0.5;
    for (let r = 0; r < this.rows; r++) {
      const cy = (r + 0.5) * this.cellSize;
      const dy = cy - halfH;
      const rowIdx = r * this.cols;
      for (let c = 0; c < this.cols; c++) {
        const cx = (c + 0.5) * this.cellSize;
        const dx = cx - halfW;
        const dist = Math.hypot(dx, dy) + 0.001;
        const idx = rowIdx + c;
        this.dirX[idx] = -dx / dist;
        this.dirY[idx] = -dy / dist;
      }
    }
  }

  clearDensity() {
    this.density.fill(0);
    this.pressure.fill(0);
  }

  addDensity(x: number, y: number, amount = 1) {
    const lx = x - this.originX;
    const ly = y - this.originY;
    if (lx < 0 || lx >= this.width || ly < 0 || ly >= this.height) return;
    const c = (lx * this.invCellSize) | 0;
    const r = (ly * this.invCellSize) | 0;
    this.density[r * this.cols + c] += amount;
  }

  solvePoissonUIC(iterations = 1) {
    const cols = this.cols;
    const rows = this.rows;
    const p = this.pressure;
    const d = this.density;
    const nextP = new Float32Array(this.size);
    for (let iter = 0; iter < iterations; iter++) {
      for (let r = 1; r < rows - 1; r++) {
        const rowIdx = r * cols;
        for (let c = 1; c < cols - 1; c++) {
          const idx = rowIdx + c;
          let pNew = (p[idx - 1] + p[idx + 1] + p[idx - cols] + p[idx + cols] + d[idx]) * 0.25;
          if (pNew < 0) pNew = 0;
          nextP[idx] = pNew;
        }
      }
      p.set(nextP);
    }
  }

  /**
   * 16,384 個のグリッドセルに対して統合速度場 (Flow Velocity Field) を1フレームに1回だけ一括事前計算
   */
  precomputeVelocityField(speed = 80) {
    const cols = this.cols;
    const rows = this.rows;
    const p = this.pressure;
    const dX = this.dirX;
    const dY = this.dirY;
    const pVx = this.precomputedVx;
    const pVy = this.precomputedVy;

    for (let r = 1; r < rows - 1; r++) {
      const rowIdx = r * cols;
      for (let c = 1; c < cols - 1; c++) {
        const idx = rowIdx + c;
        const gradX = (p[idx + 1] - p[idx - 1]) * 0.1;
        const gradY = (p[idx + cols] - p[idx - cols]) * 0.1;
        const svx = dX[idx] - gradX;
        const svy = dY[idx] - gradY;
        const d2 = svx * svx + svy * svy;
        const invLen = speed / (Math.sqrt(d2) + 0.001);
        pVx[idx] = svx * invLen;
        pVy[idx] = svy * invLen;
      }
    }
  }
}

class BenchmarkScene extends Scene {
  private flow!: BenchmarkFlowGrid;
  private px = 0;
  private py = 0;

  private isFinished = false;

  // テスト用スクラッチ配列
  private vx!: Float32Array;
  private vy!: Float32Array;
  private scratchIndices!: Int32Array;

  private currentBurstSamples: SteeringDissectionEntry[] = [];
  private benchmarkResults: SteeringDissectionEntry[] = [];

  private readonly spawnStep = 50000;
  private readonly warmupFrames = 20;
  private readonly measureFrames = 35;
  private framesSinceSpawn = 0;

  private statsDiv!: HTMLElement;

  constructor() {
    super({ maxInstances: 1000000 });
  }

  create() {
    this.statsDiv = document.getElementById('stats')!;
    this.flow = new BenchmarkFlowGrid(128, 128, 20);

    const maxCap = 1000000;
    this.vx = new Float32Array(maxCap);
    this.vy = new Float32Array(maxCap);
    this.scratchIndices = new Int32Array(maxCap);

    this._nextSpawn(50000);
  }

  private _nextSpawn(count: number) {
    this._spawnBatch(count);
    this.framesSinceSpawn = 0;
    this.currentBurstSamples = [];
  }

  private _spawnBatch(count: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 300 + Math.random() * 700;
      const sprite = this.add.sprite(
        this.px + Math.cos(angle) * radius,
        this.py + Math.sin(angle) * radius,
        'enemy',
      );
      sprite.scale = 10 + Math.random() * 10;
    }
  }

  update(dt: number) {
    if (this.isFinished) return;

    const activeCount = this.arena.activeCount;
    const posX = this.arena.posX;
    const posY = this.arena.posY;
    const vx = this.vx;
    const vy = this.vy;
    const indices = this.scratchIndices;

    this.flow.updatePlayerCenter(this.px, this.py);
    this.flow.clearDensity();

    for (let i = 0; i < activeCount; i++) {
      this.flow.addDensity(posX[i], posY[i], 1);
    }
    this.flow.solvePoissonUIC(1);

    // =========================================================================
    // A. Steering 内の構成要素マイクロベンチマーク
    // =========================================================================
    const ox = this.flow.originX,
      oy = this.flow.originY;
    const fw = this.flow.width,
      fh = this.flow.height;
    const cs = this.flow.cellSize;
    const invCs = this.flow.invCellSize;
    const dX = this.flow.dirX,
      dY = this.flow.dirY;
    const pressure = this.flow.pressure;
    const cols = this.flow.cols;

    // 1. Math.floor によるグリッド座標変換
    const tCoordStart = performance.now();
    for (let i = 0; i < activeCount; i++) {
      const lx = posX[i] - ox;
      const ly = posY[i] - oy;
      const c = Math.floor(lx / cs);
      const r = Math.floor(ly / cs);
      indices[i] = r * cols + c;
    }
    const tCoordEnd = performance.now();
    const t_coord_mapping_floor = tCoordEnd - tCoordStart;

    // 2. ビット演算 & 逆数乗算による高速座標変換
    const tFastCoordStart = performance.now();
    for (let i = 0; i < activeCount; i++) {
      const lx = posX[i] - ox;
      const ly = posY[i] - oy;
      const c = (lx * invCs) | 0;
      const r = (ly * invCs) | 0;
      indices[i] = (r << 7) + c; // cols=128 なので r * 128 = r << 7
    }
    const tFastCoordEnd = performance.now();
    const t_coord_mapping_fast = tFastCoordEnd - tFastCoordStart;

    // 3. 6箇所の Float32Array メモリ読出
    const tMemLookupStart = performance.now();
    let dummySum = 0;
    for (let i = 0; i < activeCount; i++) {
      const idx = indices[i];
      if (idx > 128 && idx < 16384 - 128) {
        dummySum +=
          dX[idx] +
          dY[idx] +
          pressure[idx + 1] +
          pressure[idx - 1] +
          pressure[idx + 128] +
          pressure[idx - 128];
      }
    }
    const tMemLookupEnd = performance.now();
    const t_memory_lookups_raw = tMemLookupEnd - tMemLookupStart;

    // 4. Math.hypot(svx, svy) による正規化
    const tHypotStart = performance.now();
    for (let i = 0; i < activeCount; i++) {
      const svx = 0.5;
      const svy = 0.8;
      const len = Math.hypot(svx, svy) + 0.001;
      vx[i] = (svx / len) * 80;
    }
    const tHypotEnd = performance.now();
    const t_math_hypot = tHypotEnd - tHypotStart;

    // 5. Math.sqrt + 逆数乗算による高速正規化
    const tSqrtStart = performance.now();
    for (let i = 0; i < activeCount; i++) {
      const svx = 0.5;
      const svy = 0.8;
      const invLen = 80.0 / (Math.sqrt(svx * svx + svy * svy) + 0.001);
      vx[i] = svx * invLen;
    }
    const tSqrtEnd = performance.now();
    const t_math_sqrt_inv = tSqrtEnd - tSqrtStart;

    // 6. 速度バッファ書き込み
    const tWriteStart = performance.now();
    for (let i = 0; i < activeCount; i++) {
      vx[i] = 80.0;
      vy[i] = 80.0;
    }
    const tWriteEnd = performance.now();
    const t_velocity_writes = tWriteEnd - tWriteStart;

    // =========================================================================
    // B. Steering 実装アーキテクチャ別の実測比較
    // =========================================================================

    // 【現行 Baseline】30万回個別勾配計算 + Math.hypot
    const tBaseStart = performance.now();
    for (let i = 0; i < activeCount; i++) {
      const x = posX[i],
        y = posY[i];
      const lx = x - ox,
        ly = y - oy;
      if (lx >= 0 && lx < fw && ly >= 0 && ly < fh) {
        const c = Math.floor(lx / cs);
        const r = Math.floor(ly / cs);
        const idx = r * cols + c;
        let svx = dX[idx],
          svy = dY[idx];
        if (r > 0 && r < this.flow.rows - 1 && c > 0 && c < cols - 1) {
          svx -= (pressure[idx + 1] - pressure[idx - 1]) * 0.1;
          svy -= (pressure[idx + cols] - pressure[idx - cols]) * 0.1;
        }
        const len = Math.hypot(svx, svy) + 0.001;
        vx[i] = (svx / len) * 80;
        vy[i] = (svy / len) * 80;
      }
    }
    const tBaseEnd = performance.now();
    const steer_baseline_ms = tBaseEnd - tBaseStart;

    // 【改善案1: FastMath】Math.sqrt & 逆数乗算
    const tFmStart = performance.now();
    for (let i = 0; i < activeCount; i++) {
      const x = posX[i],
        y = posY[i];
      const lx = x - ox,
        ly = y - oy;
      if (lx >= 0 && lx < fw && ly >= 0 && ly < fh) {
        const c = Math.floor(lx / cs);
        const r = Math.floor(ly / cs);
        const idx = r * cols + c;
        let svx = dX[idx],
          svy = dY[idx];
        if (r > 0 && r < this.flow.rows - 1 && c > 0 && c < cols - 1) {
          svx -= (pressure[idx + 1] - pressure[idx - 1]) * 0.1;
          svy -= (pressure[idx + cols] - pressure[idx - cols]) * 0.1;
        }
        const invLen = 80.0 / (Math.sqrt(svx * svx + svy * svy) + 0.001);
        vx[i] = svx * invLen;
        vy[i] = svy * invLen;
      }
    }
    const tFmEnd = performance.now();
    const steer_fastmath_ms = tFmEnd - tFmStart;

    // 【改善案2: FastIndex + FastMath】
    const tFiStart = performance.now();
    for (let i = 0; i < activeCount; i++) {
      const lx = posX[i] - ox,
        ly = posY[i] - oy;
      if (lx >= 0 && lx < fw && ly >= 0 && ly < fh) {
        const c = (lx * invCs) | 0;
        const r = (ly * invCs) | 0;
        const idx = (r << 7) + c;
        if (r > 0 && r < 127 && c > 0 && c < 127) {
          const svx = dX[idx] - (pressure[idx + 1] - pressure[idx - 1]) * 0.1;
          const svy = dY[idx] - (pressure[idx + 128] - pressure[idx - 128]) * 0.1;
          const invLen = 80.0 / (Math.sqrt(svx * svx + svy * svy) + 0.001);
          vx[i] = svx * invLen;
          vy[i] = svy * invLen;
        }
      }
    }
    const tFiEnd = performance.now();
    const steer_fastindex_ms = tFiEnd - tFiStart;

    // 【改善案3: Precomputed Vector Field (最近傍)】
    const tPrecomputeStart = performance.now();
    this.flow.precomputeVelocityField(80);
    const pVx = this.flow.precomputedVx;
    const pVy = this.flow.precomputedVy;

    for (let i = 0; i < activeCount; i++) {
      const lx = posX[i] - ox,
        ly = posY[i] - oy;
      if (lx >= 0 && lx < fw && ly >= 0 && ly < fh) {
        const c = (lx * invCs) | 0;
        const r = (ly * invCs) | 0;
        const idx = (r << 7) + c;
        vx[i] = pVx[idx];
        vy[i] = pVy[idx];
      }
    }
    const tPrecomputeEnd = performance.now();
    const steer_precomputed_grid_ms = tPrecomputeEnd - tPrecomputeStart;

    // 【改善案4: Precomputed Vector Field + Lerp of Lerp Bilinear】
    const tBilinearStart = performance.now();
    for (let i = 0; i < activeCount; i++) {
      const lx = posX[i] - ox,
        ly = posY[i] - oy;
      const gx = lx * invCs;
      const gy = ly * invCs;
      const ix = gx | 0;
      const iy = gy | 0;

      if (ix >= 1 && ix < cols - 2 && iy >= 1 && iy < 126) {
        const fx = gx - ix;
        const fy = gy - iy;
        const idx00 = (iy << 7) + ix;
        const idx01 = idx00 + 128;

        // Lerp of Lerp (FMA 最適化: 乗算3回・加算3回)
        const vx00 = pVx[idx00];
        const topVx = vx00 + fx * (pVx[idx00 + 1] - vx00);
        const vx01 = pVx[idx01];
        const botVx = vx01 + fx * (pVx[idx01 + 1] - vx01);
        vx[i] = topVx + fy * (botVx - topVx);

        const vy00 = pVy[idx00];
        const topVy = vy00 + fx * (pVy[idx00 + 1] - vy00);
        const vy01 = pVy[idx01];
        const botVy = vy01 + fx * (pVy[idx01 + 1] - vy01);
        vy[i] = topVy + fy * (botVy - topVy);
      }
    }
    const tBilinearEnd = performance.now();
    const steer_bilinear_grid_ms =
      tPrecomputeEnd - tPrecomputeStart + (tBilinearEnd - tBilinearStart);

    // 実際の座標更新 (改善案4: 双線形補間を使用)
    for (let i = 0; i < activeCount; i++) {
      posX[i] += vx[i] * dt;
      posY[i] += vy[i] * dt;
    }
    this.arena.dirtyPos = true;

    // HUD更新
    const fps = dt > 0.0001 ? Math.round(1 / dt) : 60;
    this.statsDiv.innerHTML = `
      <p>FPS: ${fps} | Entities: ${activeCount}</p>
      <p style="color:#ff6b6b">1. 現行 Baseline: ${steer_baseline_ms.toFixed(2)} ms</p>
      <p style="color:#feca57">2. FastMath (sqrt): ${steer_fastmath_ms.toFixed(2)} ms</p>
      <p style="color:#48dbfb">3. FastIndex: ${steer_fastindex_ms.toFixed(2)} ms</p>
      <p style="color:#1dd1a1">4. Precomputed Nearest: ${steer_precomputed_grid_ms.toFixed(2)} ms</p>
      <p style="color:#54a0ff; font-weight:bold">5. Precomputed Bilinear: ${steer_bilinear_grid_ms.toFixed(2)} ms (滑らか&爆速)</p>
    `;

    this.framesSinceSpawn++;

    if (this.framesSinceSpawn > this.warmupFrames) {
      this.currentBurstSamples.push({
        entities: activeCount,
        t_coord_mapping_floor,
        t_coord_mapping_fast,
        t_memory_lookups_raw,
        t_math_hypot,
        t_math_sqrt_inv,
        t_velocity_writes,
        steer_baseline_ms,
        steer_fastmath_ms,
        steer_fastindex_ms,
        steer_precomputed_grid_ms,
        steer_bilinear_grid_ms,
        sampleCount: 1,
      });

      if (this.currentBurstSamples.length >= this.measureFrames) {
        this._recordResult();
        if (this.arena.activeCount >= 300000) {
          this._finishBenchmark();
          return;
        }
        this._nextSpawn(this.spawnStep);
      }
    }
  }

  private _avg(arr: number[]): number {
    return arr.reduce((s, v) => s + v, 0) / arr.length;
  }

  private _recordResult() {
    const s = this.currentBurstSamples;
    const entry: SteeringDissectionEntry = {
      entities: Math.round(this._avg(s.map((x) => x.entities))),
      t_coord_mapping_floor: parseFloat(
        this._avg(s.map((x) => x.t_coord_mapping_floor)).toFixed(2),
      ),
      t_coord_mapping_fast: parseFloat(this._avg(s.map((x) => x.t_coord_mapping_fast)).toFixed(2)),
      t_memory_lookups_raw: parseFloat(this._avg(s.map((x) => x.t_memory_lookups_raw)).toFixed(2)),
      t_math_hypot: parseFloat(this._avg(s.map((x) => x.t_math_hypot)).toFixed(2)),
      t_math_sqrt_inv: parseFloat(this._avg(s.map((x) => x.t_math_sqrt_inv)).toFixed(2)),
      t_velocity_writes: parseFloat(this._avg(s.map((x) => x.t_velocity_writes)).toFixed(2)),
      steer_baseline_ms: parseFloat(this._avg(s.map((x) => x.steer_baseline_ms)).toFixed(2)),
      steer_fastmath_ms: parseFloat(this._avg(s.map((x) => x.steer_fastmath_ms)).toFixed(2)),
      steer_fastindex_ms: parseFloat(this._avg(s.map((x) => x.steer_fastindex_ms)).toFixed(2)),
      steer_precomputed_grid_ms: parseFloat(
        this._avg(s.map((x) => x.steer_precomputed_grid_ms)).toFixed(2),
      ),
      steer_bilinear_grid_ms: parseFloat(
        this._avg(s.map((x) => x.steer_bilinear_grid_ms)).toFixed(2),
      ),
      sampleCount: s.length,
    };
    this.benchmarkResults.push(entry);
  }

  private _finishBenchmark() {
    this.isFinished = true;

    const chartContainer = document.getElementById('chart-container');
    const chartCanvas = document.getElementById('benchmark-chart') as HTMLCanvasElement;
    if (chartContainer && chartCanvas) {
      chartContainer.style.display = 'block';
      const labels = this.benchmarkResults.map((r) => `${(r.entities / 1000).toFixed(0)}k`);

      new Chart(chartCanvas, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: '1. 現行 Baseline',
              data: this.benchmarkResults.map((r) => r.steer_baseline_ms),
              backgroundColor: '#ef4444',
            },
            {
              label: '2. FastMath (sqrt)',
              data: this.benchmarkResults.map((r) => r.steer_fastmath_ms),
              backgroundColor: '#f59e0b',
            },
            {
              label: '3. FastIndex',
              data: this.benchmarkResults.map((r) => r.steer_fastindex_ms),
              backgroundColor: '#3b82f6',
            },
            {
              label: '4. Precomputed Nearest',
              data: this.benchmarkResults.map((r) => r.steer_precomputed_grid_ms),
              backgroundColor: '#10b981',
            },
            {
              label: '5. Precomputed Bilinear (本命)',
              data: this.benchmarkResults.map((r) => r.steer_bilinear_grid_ms),
              backgroundColor: '#54a0ff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              title: { display: true, text: 'Steering Time (ms)', color: '#fff' },
              grid: { color: '#333' },
            },
            x: { grid: { color: '#333' } },
          },
          plugins: {
            title: {
              display: true,
              text: 'Steering Performance: Baseline vs Optimizations',
              color: '#fff',
            },
            legend: { labels: { color: '#fff' } },
          },
        },
      });
    }

    console.log('BENCHMARK FINISHED:', JSON.stringify(this.benchmarkResults));
  }
}

new PlutoEngine({
  canvas: 'game-canvas',
  maxInstances: 1000000,
  scaleMode: 2,
  scene: [BenchmarkScene],
});
