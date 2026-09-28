import { PlutoEngine, Scene } from '@pluto-engine/core';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
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
  LinearScale,
  CategoryScale,
  Filler,
  Title,
  Legend,
  Tooltip,
);

/**
 * 各フレームの詳細なプロファイリングデータを保持する型
 */
interface FrameSample {
  entities: number;
  fps: number;
  frameTimeMs: number;
  gridPrepMs: number;
  poissonMs: number;
  simMs: number;
  packMs: number;
  uploadMs: number;
  drawMs: number;
  totalCpuMs: number;
}

/**
 * エンティティ数ごとに集計したベンチマーク結果
 */
interface BenchmarkEntry {
  entities: number;
  fps: number;
  fps_p5: number; // 5パーセンタイル（最悪値に近い）
  fps_p50: number; // 中央値
  fps_p95: number; // 95パーセンタイル（最良値に近い）
  frameTimeMs: number;
  gridPrepMs: number;
  poissonMs: number;
  simMs: number;
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

  solvePoissonUIC(iterations = 2) {
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

  /** 現在のバーストグループにおけるフレームサンプル */
  private currentBurstSamples: FrameSample[] = [];
  /** 確定済みの集計結果 */
  private benchmarkResults: BenchmarkEntry[] = [];

  /** 次にスポーンするエンティティ数のステップ */
  private readonly spawnStep = 25000;
  private readonly warmupFrames = 30; // スポーン後のウォームアップフレーム数
  private readonly measureFrames = 45; // 計測するフレーム数
  private framesSinceSpawn = 0;
  private currentEntityTarget = 0;

  private statsDiv!: HTMLElement;

  constructor() {
    super({ maxInstances: 1000000 });
  }

  create() {
    this.statsDiv = document.getElementById('stats')!;
    this.flow = new BenchmarkFlowGrid(128, 128, 20);
    this._nextSpawn(25000);
  }

  private _nextSpawn(count: number) {
    this.currentEntityTarget = this.arena.activeCount + count;
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

    // ---- Flow Field Update ----
    this.flow.updatePlayerCenter(this.px, this.py);
    this.flow.clearDensity();

    const activeCount = this.arena.activeCount;
    const posX = this.arena.posX;
    const posY = this.arena.posY;

    for (let i = 0; i < activeCount; i++) {
      this.flow.addDensity(posX[i], posY[i], 1);
    }
    const t1 = performance.now();
    const gridPrepMs = t1 - frameStart;

    this.flow.solvePoissonUIC(1);
    const t2 = performance.now();
    const poissonMs = t2 - t1;

    // ---- Player Auto-Move ----
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

    // ---- Enemy Movement ----
    const ox = this.flow.originX,
      oy = this.flow.originY;
    const fw = this.flow.width,
      fh = this.flow.height;
    const cs = this.flow.cellSize;
    const dX = this.flow.dirX,
      dY = this.flow.dirY;
    const pressure = this.flow.pressure;
    const cols = this.flow.cols;

    for (let i = 0; i < activeCount; i++) {
      const x = posX[i],
        y = posY[i];
      const lx = x - ox,
        ly = y - oy;
      if (lx >= 0 && lx < fw && ly >= 0 && ly < fh) {
        const c = Math.floor(lx / cs);
        const r = Math.floor(ly / cs);
        const idx = r * cols + c;
        let vx = dX[idx],
          vy = dY[idx];
        if (r > 0 && r < this.flow.rows - 1 && c > 0 && c < cols - 1) {
          vx -= (pressure[idx + 1] - pressure[idx - 1]) * 0.1;
          vy -= (pressure[idx + cols] - pressure[idx - cols]) * 0.1;
        }
        const len = Math.hypot(vx, vy) + 0.001;
        posX[i] += (vx / len) * 80 * dt;
        posY[i] += (vy / len) * 80 * dt;
      } else {
        const dx = this.px - x,
          dy = this.py - y;
        const len = Math.hypot(dx, dy) + 0.001;
        posX[i] += (dx / len) * 80 * dt;
        posY[i] += (dy / len) * 80 * dt;
      }
    }
    this.arena.dirtyPos = true;

    const t3 = performance.now();
    const simMs = t3 - t2;

    const packMs = this.engine.packTimeMs;
    const uploadMs = this.engine.uploadTimeMs;
    const drawMs = this.engine.drawTimeMs;
    const totalCpuMs = t3 - frameStart;
    const fps = dt > 0.0001 ? Math.round(1 / dt) : 60;

    // HUD更新
    this.statsDiv.innerHTML = `
      <p>FPS: ${fps}</p>
      <p>Entities: ${activeCount}</p>
      <p>GridPrep: ${gridPrepMs.toFixed(2)} ms</p>
      <p>Poisson: ${poissonMs.toFixed(2)} ms</p>
      <p>Sim: ${simMs.toFixed(2)} ms</p>
      <p>Pack: ${packMs.toFixed(2)} ms</p>
      <p>CPU→GPU: ${uploadMs.toFixed(2)} ms</p>
      <p>DrawCall: ${drawMs.toFixed(2)} ms</p>
      <p>Phase: ${this.framesSinceSpawn < this.warmupFrames ? 'Warmup' : 'Measuring'}</p>
    `;

    this.framesSinceSpawn++;

    // ウォームアップ後に計測
    if (this.framesSinceSpawn > this.warmupFrames) {
      this.currentBurstSamples.push({
        entities: activeCount,
        fps,
        frameTimeMs: dt * 1000,
        gridPrepMs,
        poissonMs,
        simMs,
        packMs,
        uploadMs,
        drawMs,
        totalCpuMs,
      });

      // 指定フレーム数の計測が完了
      if (this.currentBurstSamples.length >= this.measureFrames) {
        this._recordResult();
        const latestResult = this.benchmarkResults[this.benchmarkResults.length - 1];

        // 中央値FPSが20を下回った場合、または30万体に達したら終了
        if (latestResult.fps_p50 < 20 || this.arena.activeCount >= 300000) {
          this._finishBenchmark();
          return;
        }

        // 次のバーストをスポーン
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
    const entry: BenchmarkEntry = {
      entities: Math.round(this._avg(s.map((x) => x.entities))),
      fps: Math.round(this._avg(fpsList)),
      fps_p5: Math.round(this._percentile(fpsList, 0.05)),
      fps_p50: Math.round(this._percentile(fpsList, 0.5)),
      fps_p95: Math.round(this._percentile(fpsList, 0.95)),
      frameTimeMs: parseFloat(this._avg(s.map((x) => x.frameTimeMs)).toFixed(2)),
      gridPrepMs: parseFloat(this._avg(s.map((x) => x.gridPrepMs)).toFixed(2)),
      poissonMs: parseFloat(this._avg(s.map((x) => x.poissonMs)).toFixed(2)),
      simMs: parseFloat(this._avg(s.map((x) => x.simMs)).toFixed(2)),
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

    let tableRows = '';
    const labels: string[] = [];
    const dataFpsAvg: number[] = [];
    const dataFpsP5: number[] = [];
    const dataFpsP95: number[] = [];
    const dataGridPrep: number[] = [];
    const dataPoisson: number[] = [];
    const dataSim: number[] = [];
    const dataPack: number[] = [];
    const dataUpload: number[] = [];
    const dataDraw: number[] = [];

    for (const res of this.benchmarkResults) {
      const entityK = (res.entities / 1000).toFixed(0) + 'k';
      labels.push(entityK);
      dataFpsAvg.push(res.fps_p50);
      dataFpsP5.push(res.fps_p5);
      dataFpsP95.push(res.fps_p95);
      dataGridPrep.push(res.gridPrepMs);
      dataPoisson.push(res.poissonMs);
      dataSim.push(res.simMs);
      dataPack.push(res.packMs);
      dataUpload.push(res.uploadMs);
      dataDraw.push(res.drawMs);

      tableRows += `<tr>
        <td style="padding:0 8px;">${entityK}</td>
        <td style="padding:0 8px;">${res.fps_p5}</td>
        <td style="padding:0 8px;">${res.fps_p50}</td>
        <td style="padding:0 8px;">${res.fps_p95}</td>
        <td style="padding:0 8px;">${res.gridPrepMs}</td>
        <td style="padding:0 8px;">${res.poissonMs}</td>
        <td style="padding:0 8px;">${res.simMs}</td>
        <td style="padding:0 8px;">${res.packMs}</td>
        <td style="padding:0 8px;">${res.uploadMs}</td>
        <td style="padding:0 8px;">${res.drawMs}</td>
        <td style="padding:0 8px;">${res.sampleCount}</td>
      </tr>`;
    }

    this.statsDiv.innerHTML += `
      <hr>
      <h2 style='color: #ff0; margin-top:10px;'>Benchmark Complete</h2>
      <table style="text-align: right; font-size: 11px; border-collapse: collapse;">
        <tr>
          <th style="padding:0 8px;">Entities</th>
          <th style="padding:0 8px;">P5 FPS</th>
          <th style="padding:0 8px;">P50 FPS</th>
          <th style="padding:0 8px;">P95 FPS</th>
          <th style="padding:0 8px;">GridPrep</th>
          <th style="padding:0 8px;">Poisson</th>
          <th style="padding:0 8px;">Sim</th>
          <th style="padding:0 8px;">Pack</th>
          <th style="padding:0 8px;">Upload</th>
          <th style="padding:0 8px;">Draw</th>
          <th style="padding:0 8px;">N</th>
        </tr>
        ${tableRows}
      </table>
    `;

    // FPS折れ線グラフ（p5/p50/p95帯）
    const chartContainer = document.getElementById('chart-container');
    const chartCanvas = document.getElementById('benchmark-chart') as HTMLCanvasElement;
    if (chartContainer && chartCanvas) {
      chartContainer.style.display = 'block';
      new Chart(chartCanvas, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'FPS P95 (Best)',
              data: dataFpsP95,
              borderColor: '#4fc3f7',
              backgroundColor: 'rgba(79, 195, 247, 0.08)',
              borderWidth: 1.5,
              borderDash: [4, 2],
              fill: false,
              tension: 0.3,
              pointRadius: 3,
            },
            {
              label: 'FPS P50 (Median)',
              data: dataFpsAvg,
              borderColor: '#00ff00',
              backgroundColor: 'rgba(0, 255, 0, 0.12)',
              borderWidth: 2.5,
              fill: '+1',
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'FPS P5 (Worst)',
              data: dataFpsP5,
              borderColor: '#ff6b35',
              backgroundColor: 'rgba(255, 107, 53, 0.08)',
              borderWidth: 1.5,
              borderDash: [4, 2],
              fill: false,
              tension: 0.3,
              pointRadius: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, max: 150, grid: { color: '#333' }, ticks: { color: '#ccc' } },
            x: { grid: { color: '#333' }, ticks: { color: '#ccc' } },
          },
          plugins: {
            title: {
              display: true,
              text: 'PlutoEngine v1.0.8 – FPS vs Entity Count',
              color: '#fff',
              font: { size: 14 },
            },
            legend: { labels: { color: '#fff' } },
          },
        },
      });
    }

    // 完全な結果をconsoleに出力（Playwright が拾う）
    console.log('BENCHMARK FINISHED:', JSON.stringify(this.benchmarkResults));
  }
}

new PlutoEngine({
  canvas: 'game-canvas',
  maxInstances: 1000000,
  scaleMode: 2,
  scene: [BenchmarkScene],
});
