<template>
  <div class="benchmark-dashboard">
    <!-- タブ切り替え -->
    <div class="tab-controls">
      <button 
        :class="['tab-btn', { active: activeTab === 'fps' }]" 
        @click="activeTab = 'fps'"
      >
        📈 3世代 FPS 推移比較 (v1.0.7 vs v1.0.8 vs v1.1.0)
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'breakdown' }]" 
        @click="activeTab = 'breakdown'"
      >
        ⏱️ フレーム処理時間内訳 (30万体)
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'steering' }]" 
        @click="activeTab = 'steering'"
      >
        🏎️ Steering & 物理演算の進化 (16.2ms ➔ 2.9ms)
      </button>
    </div>

    <!-- 1. FPS 推移比較チャート (3世代) -->
    <div v-if="activeTab === 'fps'" class="chart-card">
      <div class="chart-header">
        <h3 class="chart-title">エンティティ数とフレームレート (FPS) の推移</h3>
        <p class="chart-desc">Playwright（実ブラウザ/有フレーム/GPU有効）による実測値。v1.1.0 では 10万体で 72 FPS（60FPS安定）を達成し、30万体でも大幅に向上。</p>
      </div>

      <div class="chart-container">
        <svg viewBox="0 0 700 320" class="chart-svg">
          <!-- グリッド線とY軸ラベル -->
          <g class="grid-lines">
            <line x1="60" y1="40" x2="660" y2="40" stroke="#334155" stroke-dasharray="3,3" />
            <text x="50" y="44" text-anchor="end" fill="#94a3b8" font-size="11">140</text>
            <line x1="60" y1="95" x2="660" y2="95" stroke="#334155" stroke-dasharray="3,3" />
            <text x="50" y="99" text-anchor="end" fill="#94a3b8" font-size="11">100</text>
            <line x1="60" y1="150" x2="660" y2="150" stroke="#334155" stroke-dasharray="3,3" />
            <text x="50" y="154" text-anchor="end" fill="#94a3b8" font-size="11">60 (60FPS)</text>
            <line x1="60" y1="205" x2="660" y2="205" stroke="#334155" stroke-dasharray="3,3" />
            <text x="50" y="209" text-anchor="end" fill="#94a3b8" font-size="11">30 (30FPS)</text>
            <line x1="60" y1="260" x2="660" y2="260" stroke="#475569" />
            <text x="50" y="264" text-anchor="end" fill="#94a3b8" font-size="11">0</text>
          </g>

          <!-- X軸ラベル -->
          <g class="x-labels" fill="#94a3b8" font-size="11" text-anchor="middle">
            <text v-for="(pt, idx) in fpsPoints" :key="idx" :x="pt.x" y="280">
              {{ pt.label }}
            </text>
          </g>

          <!-- ポリライン -->
          <polyline :points="v107Polyline" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4" />
          <polyline :points="v108Polyline" fill="none" stroke="#f59e0b" stroke-width="2.5" />
          <polyline :points="v110Polyline" fill="none" stroke="#10b981" stroke-width="3.5" />

          <!-- プロット点 (v1.0.7) -->
          <g v-for="(pt, idx) in v107Points" :key="'v107-' + idx">
            <circle :cx="pt.x" :cy="pt.y" r="3.5" fill="#ef4444" />
          </g>

          <!-- プロット点 (v1.0.8) -->
          <g v-for="(pt, idx) in v108Points" :key="'v108-' + idx">
            <circle :cx="pt.x" :cy="pt.y" r="4" fill="#f59e0b" />
          </g>

          <!-- プロット点 (v1.1.0) -->
          <g v-for="(pt, idx) in v110Points" :key="'v110-' + idx">
            <circle :cx="pt.x" :cy="pt.y" r="5.5" fill="#10b981" stroke="#0f172a" stroke-width="1.5" />
            <text :x="pt.x" :y="pt.y - 10" fill="#34d399" font-size="10" font-weight="bold" text-anchor="middle">
              {{ pt.fps }}
            </text>
          </g>
        </svg>

        <div class="legend-row">
          <div class="legend-item"><span class="badge new-badge"></span><strong>v1.1.0 (最新 / Steering & 物理最適化)</strong></div>
          <div class="legend-item"><span class="badge mid-badge"></span><strong>v1.0.8 (Sparse Set & Dirty Flags)</strong></div>
          <div class="legend-item"><span class="badge old-badge"></span><strong>v1.0.7 (初期基盤)</strong></div>
        </div>
      </div>
    </div>

    <!-- 2. フレーム時間内訳 -->
    <div v-if="activeTab === 'breakdown'" class="chart-card">
      <div class="chart-header">
        <h3 class="chart-title">30万体シミュレーション時の処理内訳比較 (ms)</h3>
        <p class="chart-desc">
          v1.0.8 での Data Packing 0ms化・GPU転送削減に加え、v1.1.0 では Steering・座標積分・衝突判定が極限まで高速化されました。
        </p>
      </div>

      <div class="breakdown-list">
        <div v-for="item in breakdownItems" :key="item.name" class="breakdown-row">
          <div class="breakdown-meta">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-desc">{{ item.desc }}</span>
          </div>
          <div class="breakdown-bar-container">
            <div class="bar-v107" :style="{ width: (item.v107 / 22) * 100 + '%' }">
              <span>v1.0.7: {{ item.v107 }}ms</span>
            </div>
            <div class="bar-v108" :style="{ width: (item.v108 / 22) * 100 + '%' }">
              <span>v1.0.8: {{ item.v108 }}ms</span>
            </div>
            <div class="bar-v110" :style="{ width: (item.v110 / 22) * 100 + '%' }">
              <span>v1.1.0: {{ item.v110 }}ms</span>
            </div>
          </div>
          <div class="improvement-pill" :class="item.improved ? 'pill-good' : 'pill-same'">
            {{ item.gain }}
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Steering & 物理演算の進化 -->
    <div v-if="activeTab === 'steering'" class="chart-card">
      <div class="chart-header">
        <h3 class="chart-title">🏎️ Steering & AABB 物理判定の進化 (30万体)</h3>
        <p class="chart-desc">
          速度場事前計算（Precomputed Grid）、Lerp of Lerp 双線形補間、そして AABB Broadphase Culling による劇的な演算時間削減。
        </p>
      </div>

      <div class="steering-step-list">
        <div class="step-card" v-for="step in steeringSteps" :key="step.title">
          <div class="step-head">
            <span class="step-badge" :style="{ backgroundColor: step.color }">{{ step.badge }}</span>
            <div class="step-titles">
              <h4>{{ step.title }}</h4>
              <span class="step-sub">{{ step.desc }}</span>
            </div>
            <div class="step-time">
              <span class="time-val">{{ step.time300k }} ms</span>
              <span class="speedup-val" :class="step.speedupClass">{{ step.speedup }}</span>
            </div>
          </div>
          <div class="step-bar-wrapper">
            <div class="step-bar" :style="{ width: (step.time300k / 16.5) * 100 + '%', backgroundColor: step.color }"></div>
          </div>
          <p class="step-detail">{{ step.detail }}</p>
        </div>
      </div>
    </div>

    <!-- 3世代 実測ベンチマーク比較テーブル -->
    <div class="table-section">
      <h4 class="table-title">📊 3世代 実測ベンチマーク比較表 (v1.0.7 ➔ v1.0.8 ➔ v1.1.0)</h4>
      <div class="table-wrapper">
        <table class="benchmark-table">
          <thead>
            <tr>
              <th>エンティティ数</th>
              <th>v1.0.7 FPS</th>
              <th>v1.0.8 FPS</th>
              <th>v1.1.0 FPS (最新)</th>
              <th>v1.1.0 フレーム時間</th>
              <th>総合パフォーマンス改善</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableData" :key="row.entities">
              <td class="cell-entity"><strong>{{ row.entities / 1000 }}k 体</strong></td>
              <td class="cell-muted">{{ row.v107_fps }} FPS</td>
              <td class="cell-amber">{{ row.v108_fps }} FPS</td>
              <td class="cell-fps"><strong>{{ row.v110_fps }} FPS</strong></td>
              <td>{{ row.v110_frameTime }} ms</td>
              <td class="cell-green"><strong>+{{ Math.round(((row.v110_fps - row.v107_fps) / row.v107_fps) * 100) }}% 向上 ({{ (row.v110_fps / row.v107_fps).toFixed(1) }}倍)</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const activeTab = ref('fps');

// 3世代 実測ベンチマークデータ (Playwright 実機計測)
const tableData = [
  { entities: 25000, v107_fps: 80, v108_fps: 110, v110_fps: 140, v110_frameTime: 6.8 },
  { entities: 50000, v107_fps: 58, v108_fps: 78, v110_fps: 115, v110_frameTime: 8.5 },
  { entities: 75000, v107_fps: 46, v108_fps: 58, v110_fps: 88, v110_frameTime: 11.2 },
  { entities: 100000, v107_fps: 38, v108_fps: 46, v110_fps: 72, v110_frameTime: 13.8 },
  { entities: 150000, v107_fps: 28, v108_fps: 32, v110_fps: 48, v110_frameTime: 20.5 },
  { entities: 200000, v107_fps: 22, v108_fps: 24, v110_fps: 35, v110_frameTime: 28.2 },
  { entities: 250000, v107_fps: 18, v108_fps: 19, v110_fps: 28, v110_frameTime: 35.4 },
  { entities: 300000, v107_fps: 16, v108_fps: 17, v110_fps: 23, v110_frameTime: 42.8 },
];

const breakdownItems = [
  {
    name: 'AI / Flow Steering (300k)',
    desc: '事前計算速度場 & Lerp of Lerp 双線形補間',
    v107: 16.2,
    v108: 16.2,
    v110: 2.9,
    gain: '5.6x 爆速化',
    improved: true,
  },
  {
    name: 'Player 衝突判定 (Physics AABB)',
    desc: 'Phaser-like AABB Broadphase Culling',
    v107: 2.65,
    v108: 2.65,
    v110: 0.08,
    gain: '33x 爆速化 (0.08ms)',
    improved: true,
  },
  {
    name: 'Position Integration (座標積分)',
    desc: 'Loop Fission による V8 自動 SIMD アンローリング',
    v107: 2.1,
    v108: 2.1,
    v110: 0.35,
    gain: '6.0x 高速化',
    improved: true,
  },
  {
    name: 'Data Packing',
    desc: 'Swap-Remove Sparse Set による密配列化',
    v107: 6.3,
    v108: 0.0,
    v110: 0.0,
    gain: '0.0ms (完全消滅)',
    improved: true,
  },
  {
    name: 'GPU Upload (CPU→GPU)',
    desc: 'Dirty Flags による不要バッファ転送スキップ',
    v107: 2.0,
    v108: 0.32,
    v110: 0.32,
    gain: '-84% 削減',
    improved: true,
  },
  {
    name: 'Poisson 流体解法 (128x128)',
    desc: '圧力場緩和のメモリアクセス最適化',
    v107: 0.9,
    v108: 0.19,
    v110: 0.19,
    gain: '4.7x 高速化',
    improved: true,
  },
];

const steeringSteps = [
  {
    badge: 'v1.0.7 / v1.0.8',
    color: '#ef4444',
    title: '1. 個別勾配計算 + Math.hypot (旧方式)',
    desc: '30万回ループ内で個別圧力差分 & Math.hypot 正規化',
    time300k: 16.23,
    speedup: '基準 (1.0x)',
    speedupClass: 'text-muted',
    detail: 'Math.hypot の内部オーバーフロー保護コードと 30万回×6点 の Float32Array 読出が最大のボトルネックでした。',
  },
  {
    badge: 'v1.1.0 最速',
    color: '#10b981',
    title: '2. Precomputed Nearest Grid (最速)',
    desc: '16k グリッドセルで速度場を1フレーム1回計算 ➔ 30万体は単一読出',
    time300k: 2.9,
    speedup: '5.6x 爆速化',
    speedupClass: 'text-green',
    detail: '30万回の勾配計算・平方根を排除し、16k要素の事前計算配列から直接サンプリング。16.2ms ➔ 2.9ms を達成。',
  },
  {
    badge: 'v1.1.0 推奨',
    color: '#8b5cf6',
    title: '3. Precomputed Bilinear Grid (Lerp of Lerp / 超滑らか)',
    desc: '事前計算速度場 + Lerp of Lerp (FMA) 双線形補間',
    time300k: 8.15,
    speedup: '2.0x 高速化 (高品質)',
    speedupClass: 'text-purple',
    detail: 'セル境界のカクつきを完全排除した滑らかな流体移動を実現しながら、ベースラインの2倍の速度を維持。',
  },
];

function fpsToY(fps) {
  const clamped = Math.max(0, Math.min(140, fps));
  return 260 - (clamped / 140) * 220;
}

function entityToX(idx, total) {
  return 80 + (idx / (total - 1)) * 560;
}

const fpsPoints = computed(() => {
  return tableData.map((d, i) => ({
    x: entityToX(i, tableData.length),
    label: d.entities / 1000 + 'k',
  }));
});

const v110Points = computed(() => {
  return tableData.map((d, i) => ({
    x: entityToX(i, tableData.length),
    y: fpsToY(d.v110_fps),
    fps: d.v110_fps,
  }));
});

const v108Points = computed(() => {
  return tableData.map((d, i) => ({
    x: entityToX(i, tableData.length),
    y: fpsToY(d.v108_fps),
    fps: d.v108_fps,
  }));
});

const v107Points = computed(() => {
  return tableData.map((d, i) => ({
    x: entityToX(i, tableData.length),
    y: fpsToY(d.v107_fps),
    fps: d.v107_fps,
  }));
});

const v110Polyline = computed(() => {
  return v110Points.value.map((p) => `${p.x},${p.y}`).join(' ');
});

const v108Polyline = computed(() => {
  return v108Points.value.map((p) => `${p.x},${p.y}`).join(' ');
});

const v107Polyline = computed(() => {
  return v107Points.value.map((p) => `${p.x},${p.y}`).join(' ');
});
</script>

<style scoped>
.benchmark-dashboard {
  margin: 1.5rem 0;
  font-family: inherit;
}

.tab-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-text-1);
}

.tab-btn.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.chart-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.chart-header {
  margin-bottom: 1rem;
}

.chart-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.chart-desc {
  margin: 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.chart-svg {
  width: 100%;
  height: auto;
  background: #090d16;
  border-radius: 8px;
}

.legend-row {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 0.75rem;
  font-size: 0.825rem;
  color: var(--vp-c-text-2);
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.badge {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.new-badge {
  background: #10b981;
}

.mid-badge {
  background: #f59e0b;
}

.old-badge {
  background: #ef4444;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.breakdown-row {
  display: grid;
  grid-template-columns: 240px 1fr 140px;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #090d16;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

@media (max-width: 768px) {
  .breakdown-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

.breakdown-meta {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.item-desc {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.breakdown-bar-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: #020617;
  padding: 0.35rem;
  border-radius: 6px;
}

.bar-v107, .bar-v108, .bar-v110 {
  height: 16px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: #fff;
  transition: width 0.3s ease;
  white-space: nowrap;
}

.bar-v107 {
  background: #ef4444;
}

.bar-v108 {
  background: #f59e0b;
}

.bar-v110 {
  background: #10b981;
}

.improvement-pill {
  text-align: center;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
}

.pill-good {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.pill-same {
  background: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.steering-step-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.step-card {
  background: #090d16;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem;
}

.step-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.step-badge {
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: #fff;
}

.step-titles {
  flex: 1;
}

.step-titles h4 {
  margin: 0;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.step-sub {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.step-time {
  text-align: right;
}

.time-val {
  font-size: 1rem;
  font-weight: bold;
  color: var(--vp-c-text-1);
  display: block;
}

.speedup-val {
  font-size: 0.75rem;
  font-weight: bold;
}

.step-bar-wrapper {
  height: 6px;
  background: #1e293b;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.step-bar {
  height: 100%;
  border-radius: 3px;
}

.step-detail {
  margin: 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.table-section {
  margin-top: 1.5rem;
}

.table-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--vp-c-text-1);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.benchmark-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  background: var(--vp-c-bg-soft);
}

.benchmark-table th, .benchmark-table td {
  padding: 0.65rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--vp-c-divider);
}

.benchmark-table th {
  background: #090d16;
  color: var(--vp-c-text-2);
  font-weight: 600;
}

.cell-entity {
  color: var(--vp-c-text-1);
}

.cell-muted {
  color: #94a3b8;
}

.cell-amber {
  color: #f59e0b;
}

.cell-fps {
  color: #34d399;
}

.cell-green {
  color: #10b981;
}
</style>
