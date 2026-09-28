import { PlutoEngine, Scene } from '@pluto-engine/core';

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

  constructor(cols = 128, rows = 128, cellSize = 24) {
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

  private enemyCount = 1000;
  private maxEnemyCount = 100000;
  private spawnTimer = 0;

  private isFinished = false;
  private benchmarkResults: any[] = [];

  private statsDiv!: HTMLElement;

  constructor() {
    super({ maxInstances: 100000 });
  }

  create() {
    this.statsDiv = document.getElementById('stats')!;
    this.flow = new BenchmarkFlowGrid(128, 128, 20);

    // Initial 1000 enemies
    this.spawnEnemies(1000);
  }

  spawnEnemies(count: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 500 + Math.random() * 500;
      const ex = this.px + Math.cos(angle) * radius;
      const ey = this.py + Math.sin(angle) * radius;

      const sprite = this.add.sprite(ex, ey, 'enemy');
      sprite.scale = 12 + Math.random() * 8;
    }
  }

  update(dt: number) {
    if (this.isFinished) return;

    const fps = this.engine.time.fps;
    const updateTime = this.engine.updateTimeMs.toFixed(1);
    const renderTime = this.engine.renderTimeMs.toFixed(1);
    const active = this.arena.activeCount;

    this.statsDiv.innerHTML = `
      <p>FPS: ${fps}</p>
      <p>Entities: ${active}</p>
      <p>Update: ${updateTime} ms</p>
      <p>Render: ${renderTime} ms</p>
    `;

    this.flow.updatePlayerCenter(this.px, this.py);
    this.flow.clearDensity();

    // Splat density
    const capacity = this.arena.capacity;
    const activeArr = this.arena.active;
    const posX = this.arena.posX;
    const posY = this.arena.posY;

    for (let i = 0; i < capacity; i++) {
      if (activeArr[i]) {
        this.flow.addDensity(posX[i], posY[i], 1);
      }
    }

    this.flow.solvePoissonUIC(1);

    // Auto Player Avoidance Logic
    let minPressure = 999999;
    let bestX = this.px;
    let bestY = this.py;

    // Sample around player to find lowest density/pressure
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const sampleX = this.px + Math.cos(a) * 40;
      const sampleY = this.py + Math.sin(a) * 40;

      const lx = sampleX - this.flow.originX;
      const ly = sampleY - this.flow.originY;
      if (lx >= 0 && lx < this.flow.width && ly >= 0 && ly < this.flow.height) {
        const c = Math.floor(lx / this.flow.cellSize);
        const r = Math.floor(ly / this.flow.cellSize);
        const p = this.flow.pressure[r * this.flow.cols + c];
        if (p < minPressure) {
          minPressure = p;
          bestX = sampleX;
          bestY = sampleY;
        }
      }
    }

    // Move player
    const pdx = bestX - this.px;
    const pdy = bestY - this.py;
    const pdist = Math.hypot(pdx, pdy) + 0.001;
    this.px += (pdx / pdist) * 150 * dt;
    this.py += (pdy / pdist) * 150 * dt;

    this.camera.x = this.px;
    this.camera.y = this.py;

    // Enemy movement
    const ox = this.flow.originX;
    const oy = this.flow.originY;
    const w = this.flow.width;
    const h = this.flow.height;
    const cs = this.flow.cellSize;
    const dX = this.flow.dirX;
    const dY = this.flow.dirY;
    const p = this.flow.pressure;
    const cols = this.flow.cols;

    for (let i = 0; i < capacity; i++) {
      if (!activeArr[i]) continue;

      const x = posX[i];
      const y = posY[i];

      const lx = x - ox;
      const ly = y - oy;

      if (lx >= 0 && lx < w && ly >= 0 && ly < h) {
        const c = Math.floor(lx / cs);
        const r = Math.floor(ly / cs);
        const idx = r * cols + c;

        // Base flow direction (towards player)
        let vx = dX[idx];
        let vy = dY[idx];

        // Separation from pressure gradient
        if (r > 0 && r < this.flow.rows - 1 && c > 0 && c < cols - 1) {
          const pr = p[idx + 1];
          const pl = p[idx - 1];
          const pb = p[idx + cols];
          const pt = p[idx - cols];

          vx -= (pr - pl) * 0.1;
          vy -= (pb - pt) * 0.1;
        }

        const len = Math.hypot(vx, vy) + 0.001;
        posX[i] += (vx / len) * 80 * dt;
        posY[i] += (vy / len) * 80 * dt;
      } else {
        // Fallback: move straight to player if outside grid
        const dx = this.px - x;
        const dy = this.py - y;
        const len = Math.hypot(dx, dy) + 0.001;
        posX[i] += (dx / len) * 80 * dt;
        posY[i] += (dy / len) * 80 * dt;
      }
    }

    // Benchmark Logic
    this.spawnTimer += dt;
    if (this.spawnTimer > 1.5) {
      this.spawnTimer = 0;

      // Target FPS check
      if (this.engine.time.time > 3.0) {
        // Wait 3s before starting measurements
        this.benchmarkResults.push({ entities: active, fps });

        if (fps < 30) {
          this.finishBenchmark();
          return;
        }
      }

      if (active < this.maxEnemyCount) {
        this.spawnEnemies(5000);
      } else {
        this.finishBenchmark();
      }
    }
  }

  finishBenchmark() {
    this.isFinished = true;
    let tableRows = '';
    for (const res of this.benchmarkResults) {
      tableRows += `<tr><td style="padding:0 10px;">${res.entities}</td><td style="padding:0 10px;">${res.fps}</td></tr>`;
    }

    this.statsDiv.innerHTML += `
      <hr>
      <h2 style='color: #ff0; margin-top:10px;'>Benchmark Finished</h2>
      <table style="text-align: right;">
        <tr><th style="padding:0 10px;">Entities</th><th style="padding:0 10px;">FPS</th></tr>
        ${tableRows}
      </table>
    `;
    console.log('BENCHMARK FINISHED:', this.benchmarkResults);
  }
}

new PlutoEngine({
  canvas: 'game-canvas',
  maxInstances: 100000,
  scaleMode: 2, // RESIZE
  scene: [BenchmarkScene],
});
