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
 * 1フレームの詳細な分解プロファイリングサンプル
 */
interface DetailedFrameSample {
  entities: number;
  fps: number;
  frameTimeMs: number;
  
  // Entity Update の詳細分解 (ms)
  densitySplatMs: number;     // 1. 密度蓄積 (Grid Density Splatting)
  poissonMs: number;          // 2. ポアソン方程式解法 (Poisson UIC Solver)
  steeringMs: number;         // 3. AI / フロー場ステアリング計算 (Pressure Gradient & Normalization)
  integrationMs: number;      // 4. 座標・速度積分 (Position & Velocity Integration)
  spatialHashMs: number;      // 5. 空間ハッシュ構築 & クエリ (Spatial Hash / Morton Partition)
  separationMs: number;       // 6. ペア衝突判定・押し戻し緩和 (Pairwise Separation Relaxation)
  pureMemoryMs: number;       // 7. 純粋な TypedArray 読書ベースライン (Pure Memory Bandwidth Limit)
  randomMemoryMs: number;     // 8. キャッシュミス（ランダムアクセス）時の読書時間 (Cache Miss Penalty)
  
  totalSimMs: number;         // 合計シミュレーション時間
  packMs: number;             // Data Packing (0.0ms)
  uploadMs: number;           // CPU -> GPU Upload
  drawMs: number;             // WebGL2 Draw Call
  totalCpuMs: number;         // 1フレームの合計CPU時間
}

/**
 * 集計済みベンチマークエントリ
 */
export interface DetailedBenchmarkEntry {
  entities: number;
  fps_p5: number;
  fps_p50: number;
  fps_p95: number;
  frameTimeMs: number;

  densitySplatMs: number;
  poissonMs: number;
  steeringMs: number;
  integrationMs: number;
  spatialHashMs: number;
  separationMs: number;
  pureMemoryMs: number;
  randomMemoryMs: number;

  totalSimMs: number;
  packMs: number;
  uploadMs: number;
  drawMs: number;
  totalCpuMs: number;
  sampleCount: number;
}

class BenchmarkFlowGrid {
  cols: number;
  rows: number;
  cellSize: number;
  width: number;
  height: number;
  size: number;
  dirX: Float32Array;
  dirY: Float32Array;
  density: Float32Array;
  pressure: Float32Array;
  originX = 0;
  originY = 0;

  constructor(cols = 128, rows = 128, cellSize = 20) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.width = cols * cellSize;
    this.height = rows * cellSize;
    this.size = cols * rows;
    this.dirX = new Float32Array(this.size);
    this.dirY = new Float32Array(this.size);
    this.density = new Float32Array(this.size);
    this.pressure = new Float32Array(this.size);
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
    const c = Math.floor(lx / this.cellSize);
    const r = Math.floor(ly / this.cellSize);
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
}

class BenchmarkScene extends Scene {
  private flow!: BenchmarkFlowGrid;
  private px = 0;
  private py = 0;

  private isFinished = false;

  // メモリ帯域 & キャッシュミス測定用スクラッチ配列
  private scratchA!: Float32Array;
  private scratchB!: Float32Array;
  private randomIndices!: Int32Array;

  // 速度バッファ
  private vx!: Float32Array;
  private vy!: Float32Array;

  // 空間ハッシュテスト用セルバッファ
  private spatialCellHeads!: Int32Array;
  private spatialNext!: Int32Array;

  private currentBurstSamples: DetailedFrameSample[] = [];
  private benchmarkResults: DetailedBenchmarkEntry[] = [];

  private readonly spawnStep = 25000;
  private readonly warmupFrames = 25;
  private readonly measureFrames = 40;
  private framesSinceSpawn = 0;

  private statsDiv!: HTMLElement;

  constructor() {
    super({ maxInstances: 1000000 });
  }

  create() {
    this.statsDiv = document.getElementById('stats')!;
    this.flow = new BenchmarkFlowGrid(128, 128, 20);

    const maxCap = 1000000;
    this.scratchA = new Float32Array(maxCap);
    this.scratchB = new Float32Array(maxCap);
    this.vx = new Float32Array(maxCap);
    this.vy = new Float32Array(maxCap);
    this.spatialCellHeads = new Int32Array(128 * 128).fill(-1);
    this.spatialNext = new Int32Array(maxCap);

    // ランダムインデックス（キャッシュミス測定用）
    this.randomIndices = new Int32Array(maxCap);
    for (let i = 0; i < maxCap; i++) {
      this.randomIndices[i] = i;
    }
    // 部分シャッフル
    for (let i = maxCap - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.randomIndices[i];
      this.randomIndices[i] = this.randomIndices[j];
      this.randomIndices[j] = temp;
    }

    this._nextSpawn(25000);
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

    const frameStart = performance.now();
    const activeCount = this.arena.activeCount;
    const posX = this.arena.posX;
    const posY = this.arena.posY;
    const vx = this.vx;
    const vy = this.vy;

    // =========================================================================
    // 1. Density Splatting (グリッドへの密度蓄積)
    // =========================================================================
    this.flow.updatePlayerCenter(this.px, this.py);
    this.flow.clearDensity();

    const tSplatStart = performance.now();
    for (let i = 0; i < activeCount; i++) {
      this.flow.addDensity(posX[i], posY[i], 1);
    }
    const tSplatEnd = performance.now();
    const densitySplatMs = tSplatEnd - tSplatStart;

    // =========================================================================
    // 2. Poisson UIC Solver (圧力場計算)
    // =========================================================================
    const tPoissonStart = performance.now();
    this.flow.solvePoissonUIC(1);
    const tPoissonEnd = performance.now();
    const poissonMs = tPoissonEnd - tPoissonStart;

    // プレイヤー自動移動
    let minPressure = 999999;
    let bestX = this.px;
    let bestY = this.py;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const sx = this.px + Math.cos(a) * 40;
      const sy = this.py + Math.sin(a) * 40;
      const lx = sx - this.flow.originX;
      const ly = sy - this.flow.originY;
      if (lx >= 0 && lx < this.flow.width && ly >= 0 && ly < this.flow.height) {
        const c = Math.floor(lx / this.flow.cellSize);
        const r = Math.floor(ly / this.flow.cellSize);
        const pr = this.flow.pressure[r * this.flow.cols + c];
        if (pr < minPressure) {
          minPressure = pr;
          bestX = sx;
          bestY = sy;
        }
      }
    }
    const pdx = bestX - this.px;
    const pdy = bestY - this.py;
    const pdist = Math.hypot(pdx, pdy) + 0.001;
    this.px += (pdx / pdist) * 150 * dt;
    this.py += (pdy / pdist) * 150 * dt;
    this.camera.x = this.px;
    this.camera.y = this.py;

    // =========================================================================
    // 3. AI / Flow Steering (圧力勾配・方向ベクトル・Math.hypot 正規化)
    // =========================================================================
    const ox = this.flow.originX,
      oy = this.flow.originY;
    const fw = this.flow.width,
      fh = this.flow.height;
    const cs = this.flow.cellSize;
    const dX = this.flow.dirX,
      dY = this.flow.dirY;
    const pressure = this.flow.pressure;
    const cols = this.flow.cols;

    const tSteerStart = performance.now();
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
      } else {
        const dx = this.px - x,
          dy = this.py - y;
        const len = Math.hypot(dx, dy) + 0.001;
        vx[i] = (dx / len) * 80;
        vy[i] = (dy / len) * 80;
      }
    }
    const tSteerEnd = performance.now();
    const steeringMs = tSteerEnd - tSteerStart;

    // =========================================================================
    // 4. Position Integration (速度適用 & 座標積分)
    // =========================================================================
    const tIntegStart = performance.now();
    for (let i = 0; i < activeCount; i++) {
      posX[i] += vx[i] * dt;
      posY[i] += vy[i] * dt;
    }
    this.arena.dirtyPos = true;
    const tIntegEnd = performance.now();
    const integrationMs = tIntegEnd - tIntegStart;

    // =========================================================================
    // 5. Spatial Hash / Query (空間ハッシュ構築 & 近傍ペア走査)
    // =========================================================================
    const tSpatialStart = performance.now();
    this.spatialCellHeads.fill(-1);
    for (let i = 0; i < activeCount; i++) {
      const gx = Math.floor((posX[i] - ox) / (cs * 2));
      const gy = Math.floor((posY[i] - oy) / (cs * 2));
      if (gx >= 0 && gx < 64 && gy >= 0 && gy < 64) {
        const cell = gy * 64 + gx;
        this.spatialNext[i] = this.spatialCellHeads[cell];
        this.spatialCellHeads[cell] = i;
      }
    }
    const tSpatialEnd = performance.now();
    const spatialHashMs = tSpatialEnd - tSpatialStart;

    // =========================================================================
    // 6. Separation / Relaxation (近傍ペア反発・押し戻し計算 - 2000体サンプリング)
    // =========================================================================
    const tSepStart = performance.now();
    const sepSampleCount = Math.min(activeCount, 2000);
    for (let i = 0; i < sepSampleCount; i++) {
      const gx = Math.floor((posX[i] - ox) / (cs * 2));
      const gy = Math.floor((posY[i] - oy) / (cs * 2));
      if (gx >= 0 && gx < 64 && gy >= 0 && gy < 64) {
        const cell = gy * 64 + gx;
        let other = this.spatialCellHeads[cell];
        while (other !== -1) {
          if (other > i) {
            const dx = posX[other] - posX[i];
            const dy = posY[other] - posY[i];
            const d2 = dx * dx + dy * dy;
            if (d2 < 400 && d2 > 0.001) {
              const dist = Math.sqrt(d2);
              const push = (20 - dist) * 0.1;
              posX[i] -= (dx / dist) * push;
              posY[i] -= (dy / dist) * push;
            }
          }
          other = this.spatialNext[other];
        }
      }
    }
    const tSepEnd = performance.now();
    // 全体推計値（2000体サンプルを activeCount に比例換算）
    const separationMs = (tSepEnd - tSepStart) * (activeCount / Math.max(1, sepSampleCount));

    // =========================================================================
    // 7. Pure Memory Bandwidth Baseline (連続アクセス時の純粋な限界速度)
    // =========================================================================
    const tMemStart = performance.now();
    const scA = this.scratchA;
    const scB = this.scratchB;
    for (let i = 0; i < activeCount; i++) {
      scA[i] = posX[i] + 1.0;
      scB[i] = posY[i] + 1.0;
    }
    const tMemEnd = performance.now();
    const pureMemoryMs = tMemEnd - tMemStart;

    // =========================================================================
    // 8. Cache Miss Penalty (ランダムアクセス時の帯域低下・ペナルティ)
    // =========================================================================
    const tRandStart = performance.now();
    const randIdx = this.randomIndices;
    for (let i = 0; i < activeCount; i++) {
      const idx = randIdx[i];
      if (idx < activeCount) {
        scA[i] = posX[idx] + 1.0;
      }
    }
    const tRandEnd = performance.now();
    const randomMemoryMs = tRandEnd - tRandStart;

    const tSimEnd = performance.now();
    const totalSimMs = tSimEnd - frameStart;

    const packMs = this.engine.packTimeMs;
    const uploadMs = this.engine.uploadTimeMs;
    const drawMs = this.engine.drawTimeMs;
    const totalCpuMs = totalSimMs + packMs + uploadMs + drawMs;
    const fps = dt > 0.0001 ? Math.round(1 / dt) : 60;

    // HUD更新
    this.statsDiv.innerHTML = `
      <p>FPS: ${fps}</p>
      <p>Entities: ${activeCount}</p>
      <p>1. Density Splat: ${densitySplatMs.toFixed(2)} ms</p>
      <p>2. Poisson UIC: ${poissonMs.toFixed(2)} ms</p>
      <p>3. AI / Steering: ${steeringMs.toFixed(2)} ms</p>
      <p>4. Integration: ${integrationMs.toFixed(2)} ms</p>
      <p>5. Spatial Hash: ${spatialHashMs.toFixed(2)} ms</p>
      <p>6. Separation: ${separationMs.toFixed(2)} ms</p>
      <p>-- Pure Mem Baseline: ${pureMemoryMs.toFixed(2)} ms</p>
      <p>-- Cache Miss Penalty: ${randomMemoryMs.toFixed(2)} ms</p>
      <p>Pack: ${packMs.toFixed(2)} ms | GPU: ${uploadMs.toFixed(2)} ms | Draw: ${drawMs.toFixed(2)} ms</p>
    `;

    this.framesSinceSpawn++;

    if (this.framesSinceSpawn > this.warmupFrames) {
      this.currentBurstSamples.push({
        entities: activeCount,
        fps,
        frameTimeMs: dt * 1000,
        densitySplatMs,
        poissonMs,
        steeringMs,
        integrationMs,
        spatialHashMs,
        separationMs,
        pureMemoryMs,
        randomMemoryMs,
        totalSimMs,
        packMs,
        uploadMs,
        drawMs,
        totalCpuMs,
      });

      if (this.currentBurstSamples.length >= this.measureFrames) {
        this._recordResult();
        const latest = this.benchmarkResults[this.benchmarkResults.length - 1];

        if (latest.fps_p50 < 20 || this.arena.activeCount >= 300000) {
          this._finishBenchmark();
          return;
        }

        this._nextSpawn(this.spawnStep);
      }
    }
  }

  private _percentile(arr: number[], p: number): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = Math.floor(sorted.length * p);
    return sorted[Math.min(idx, sorted.length - 1)];
  }

  private _avg(arr: number[]): number {
    return arr.reduce((s, v) => s + v, 0) / arr.length;
  }

  private _recordResult() {
    const s = this.currentBurstSamples;
    const fpsList = s.map((x) => x.fps);
    const entry: DetailedBenchmarkEntry = {
      entities: Math.round(this._avg(s.map((x) => x.entities))),
      fps_p5: Math.round(this._percentile(fpsList, 0.05)),
      fps_p50: Math.round(this._percentile(fpsList, 0.5)),
      fps_p95: Math.round(this._percentile(fpsList, 0.95)),
      frameTimeMs: parseFloat(this._avg(s.map((x) => x.frameTimeMs)).toFixed(2)),
      densitySplatMs: parseFloat(this._avg(s.map((x) => x.densitySplatMs)).toFixed(2)),
      poissonMs: parseFloat(this._avg(s.map((x) => x.poissonMs)).toFixed(2)),
      steeringMs: parseFloat(this._avg(s.map((x) => x.steeringMs)).toFixed(2)),
      integrationMs: parseFloat(this._avg(s.map((x) => x.integrationMs)).toFixed(2)),
      spatialHashMs: parseFloat(this._avg(s.map((x) => x.spatialHashMs)).toFixed(2)),
      separationMs: parseFloat(this._avg(s.map((x) => x.separationMs)).toFixed(2)),
      pureMemoryMs: parseFloat(this._avg(s.map((x) => x.pureMemoryMs)).toFixed(2)),
      randomMemoryMs: parseFloat(this._avg(s.map((x) => x.randomMemoryMs)).toFixed(2)),
      totalSimMs: parseFloat(this._avg(s.map((x) => x.totalSimMs)).toFixed(2)),
      packMs: parseFloat(this._avg(s.map((x) => x.packMs)).toFixed(2)),
      uploadMs: parseFloat(this._avg(s.map((x) => x.uploadMs)).toFixed(2)),
      drawMs: parseFloat(this._avg(s.map((x) => x.drawMs)).toFixed(2)),
      totalCpuMs: parseFloat(this._avg(s.map((x) => x.totalCpuMs)).toFixed(2)),
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
              label: '1. Density Splat',
              data: this.benchmarkResults.map((r) => r.densitySplatMs),
              backgroundColor: '#3b82f6',
            },
            {
              label: '2. Poisson UIC',
              data: this.benchmarkResults.map((r) => r.poissonMs),
              backgroundColor: '#6366f1',
            },
            {
              label: '3. AI / Steering',
              data: this.benchmarkResults.map((r) => r.steeringMs),
              backgroundColor: '#f59e0b',
            },
            {
              label: '4. Integration',
              data: this.benchmarkResults.map((r) => r.integrationMs),
              backgroundColor: '#10b981',
            },
            {
              label: '5. Spatial Hash',
              data: this.benchmarkResults.map((r) => r.spatialHashMs),
              backgroundColor: '#ec4899',
            },
            {
              label: '6. Separation',
              data: this.benchmarkResults.map((r) => r.separationMs),
              backgroundColor: '#8b5cf6',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true, grid: { color: '#333' } },
            y: { stacked: true, grid: { color: '#333' }, title: { display: true, text: 'Execution Time (ms)', color: '#fff' } },
          },
          plugins: {
            title: { display: true, text: 'Entity Update Sub-phase Breakdown (ms)', color: '#fff' },
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
