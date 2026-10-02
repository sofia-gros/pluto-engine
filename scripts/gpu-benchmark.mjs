/**
 * @file gpu-benchmark.mjs
 * @description
 * Phase 8 P-05: WebGPU / WebGL2 / CPU の 3 系統を同じ条件で計測し、
 * `benchmark_results.json` の `backends` キーへ記録します。
 *
 * 旧版は 30 秒ずつ回して `#stats` の innerText をスクレイップするだけで、
 * 数値として比較できませんでした。その 3 系統比較という要件には
 * なっていないため、書き直しています。
 *
 * ## 計測のFair条件
 *
 * 3 系統とも**同じシーン・同じエンティティ数・同じフレーム数**を使います。
 * バックエンドだけ меняjas  thereby比較が成立するようにしています。
 *
 * CPU 系列は `PlutoEngine` の `cpuOnly` モードを使い、
 * clear / 転送 / draw をすべて省いて CPU 側の時間だけを測ります。
 *
 * ## 使い方
 *
 * ```
 * node scripts/gpu-benchmark.mjs
 * node scripts/gpu-benchmark.mjs --entities 50000,100000,200000
 * node scripts/gpu-benchmark.mjs --frames 240 --headed
 * ```
 */

import { existsSync } from 'node:fs';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'apps', 'demo', 'dist');
const RESULT_PATH = join(ROOT, 'benchmark_results.json');
const PORT = 5200;

/** 既定のエンティティ数。要件2 の 300k を含めます。 */
const DEFAULT_ENTITY_COUNTS = [50000, 100000, 200000, 300000];
const DEFAULT_FRAMES = 120;
const DEFAULT_WARMUP = 30;

/** 計測する 3 系統。この順に JSON に並べます。 */
const SERIES = [
  { key: 'webgpu', backend: 'webgpu' },
  { key: 'webgl2', backend: 'webgl2' },
  { key: 'cpu', backend: 'cpu' },
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

/** 引数を解析します。 */
function parseArgs(argv) {
  const out = {
    entities: DEFAULT_ENTITY_COUNTS,
    frames: DEFAULT_FRAMES,
    warmup: DEFAULT_WARMUP,
    headed: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--entities') {
      out.entities = String(argv[++i])
        .split(',')
        .map((s) => Number.parseInt(s, 10))
        .filter((n) => Number.isFinite(n) && n > 0);
    } else if (a === '--frames') {
      out.frames = Number.parseInt(String(argv[++i]), 10) || DEFAULT_FRAMES;
    } else if (a === '--warmup') {
      out.warmup = Number.parseInt(String(argv[++i]), 10) ?? DEFAULT_WARMUP;
    } else if (a === '--headed') {
      out.headed = true;
    }
  }
  if (out.entities.length === 0) out.entities = DEFAULT_ENTITY_COUNTS;
  return out;
}

function startServer(root) {
  const server = createServer(async (req, res) => {
    try {
      let p = normalize(decodeURIComponent((req.url || '/').split('?')[0]));
      if (p.endsWith('/')) p += 'index.html';
      const fp = join(root, p);
      if (!existsSync(fp) || (await stat(fp)).isDirectory()) {
        res.writeHead(404);
        res.end('not found');
        return;
      }
      const body = await readFile(fp);
      res.writeHead(200, { 'Content-Type': MIME[extname(fp)] || 'application/octet-stream' });
      res.end(body);
    } catch (e) {
      res.writeHead(500);
      res.end(String(e));
    }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

const args = parseArgs(process.argv.slice(2));

if (!existsSync(join(DIST, 'backend-bench', 'index.html'))) {
  console.error(
    'apps/demo/dist/backend-bench/index.html がありません。\n' +
      '先に `cd apps/demo && npx vite build` を実行してください。',
  );
  process.exit(1);
}

const server = await startServer(DIST);
// headless だと WebGPU が拾えない環境があるため、既定は headed です。
const browser = await chromium.launch({
  headless: false,
  args: ['--enable-unsafe-webgpu', '--enable-webgl', '--no-sandbox', '--disable-gpu-sandbox'],
});

/** backends[seriesKey][entityCount] = 計測結果 */
const backends = { webgpu: {}, webgl2: {}, cpu: {} };
const failures = [];

for (const series of SERIES) {
  for (const entities of args.entities) {
    const label = `${series.key} @ ${entities}`;
    process.stdout.write(`[bench] ${label} ... `);
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

    // WebGL2 を強制したいときは navigator.gpu を隠します。
    // （引擎側の backend: 'webgl2' 指定だけでも充分的ですが、
    //   ブラウザが WebGPU を自動選択しない念のための保険です）
    if (series.backend === 'webgl2') {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'gpu', { get: () => undefined });
      });
    }

    try {
      const url =
        `http://localhost:${PORT}/backend-bench/index.html` +
        `?backend=${series.backend}&entities=${entities}` +
        `&frames=${args.frames}&warmup=${args.warmup}`;
      await page.goto(url, { waitUntil: 'load', timeout: 60000 });

      const result = await page.waitForFunction(
        () => window.__benchResult ?? window.__benchError ?? null,
        null,
        { timeout: 180000, polling: 250 },
      );
      const value = await result.jsonValue();
      if (typeof value === 'string') {
        throw new Error(value);
      }
      backends[series.key][String(entities)] = value;
      const drawn = value.renderCount;
      console.log(
        `rendered=${drawn}/${entities} ` +
          `frame median=${value.frameMsMedian.toFixed(3)}ms ` +
          `cull=${value.cullMsMedian.toFixed(3)}ms ` +
          `upload=${value.uploadMsMedian.toFixed(3)}ms ` +
          `draw=${value.drawMsMedian.toFixed(3)}ms`,
      );
      if (drawn === 0) {
        // 全スプライトがカリングで落ちているため比較になりません
        console.log('  (警告: 描画対象が 0 体です。比較には使えません)');
      }
    } catch (err) {
      console.log('FAILED');
      failures.push({ series: series.key, entities, error: String(err) });
    }
    await page.close();
  }
}

await browser.close();
server.close();

/**
 * 要件2 の検証: WebGPU > WebGL2 > CPU が成立するか。
 *
 * **フレーム全体と draw のみの 2 つを見ます。**
 * 現状の設計ではカリングが CPU 側にあるため、フレーム全体は
 * カリング時間が支配的になって 3 系統almost同値になります。
 * バックエンド差が現れるのは draw 部分だけなので、両方を併記します。
 */
function checkRequirement2(data) {
  const rows = [];
  for (const entities of args.entities) {
    const k = String(entities);
    const g = data.webgpu[k];
    const l = data.webgl2[k];
    const c = data.cpu[k];
    if (!g || !l || !c) continue;
    rows.push({
      entities: Number(entities),
      webgpuFrameMs: g.frameMsMedian,
      webgl2FrameMs: l.frameMsMedian,
      cpuFrameMs: c.frameMsMedian,
      webgpuDrawMs: g.drawMsMedian,
      webgl2DrawMs: l.drawMsMedian,
      cpuDrawMs: c.drawMsMedian,
      cullMs: g.cullMsMedian,
      frameOk: g.frameMsMedian < l.frameMsMedian && l.frameMsMedian < c.frameMsMedian,
      drawOk: g.drawMsMedian < l.drawMsMedian && l.drawMsMedian < c.drawMsMedian,
    });
  }
  return rows;
}

const payload = {
  generatedAt: new Date().toISOString(),
  note: 'backends は Phase 8 P-01/P-05 の 3 系統比較。steering は従来の実測値。',
  frames: args.frames,
  warmup: args.warmup,
  backends,
  requirement2: checkRequirement2(backends),
  failures,
};

/** 既存の steering 実測値は保持します（上書きで失わないため）。 */
let existing = {};
if (existsSync(RESULT_PATH)) {
  try {
    const prev = JSON.parse(await readFile(RESULT_PATH, 'utf8'));
    existing = Array.isArray(prev) ? { steering: prev } : prev;
  } catch {
    existing = {};
  }
}
const merged = { ...existing, ...payload };
await writeFile(RESULT_PATH, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');

console.log('');
console.log('=== 要件2 (WebGPU > WebGL2 > CPU) ===');
for (const row of payload.requirement2) {
  console.log(`  ${String(row.entities).padStart(7)} 体 (cull=${row.cullMs.toFixed(3)}ms)`);
  console.log(
    `    frame: webgpu=${row.webgpuFrameMs.toFixed(3)} webgl2=${row.webgl2FrameMs.toFixed(3)} ` +
      `cpu=${row.cpuFrameMs.toFixed(3)} -> ${row.frameOk ? 'OK' : 'NG'}`,
  );
  console.log(
    `    draw : webgpu=${row.webgpuDrawMs.toFixed(3)} webgl2=${row.webgl2DrawMs.toFixed(3)} ` +
      `cpu=${row.cpuDrawMs.toFixed(3)} -> ${row.drawOk ? 'OK' : 'NG'}`,
  );
}
if (failures.length > 0) {
  console.log('');
  console.log('=== 失敗 ===');
  for (const f of failures) console.log(`  ${f.series} @ ${f.entities}: ${f.error}`);
}
console.log('');
console.log(`${RESULT_PATH} に書き込みました。`);
process.exit(failures.length === 0 ? 0 : 1);
