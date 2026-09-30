/**
 * @file smoke-test.mjs
 * @description
 * 全デモを実ブラウザ (Playwright + Chromium) で起動し、
 * 描画が実際に進むこと、JavaScript エラーが出ないことを検証する。
 *
 * 使い方: node scripts/smoke-test.mjs
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'apps', 'demo', 'dist');
const PORT = 5199;

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
  '.ico': 'image/x-icon',
};

function startServer(root) {
  const server = createServer(async (req, res) => {
    try {
      let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      // プレフィックス付きのパスを除去する
      urlPath = urlPath.replace(/^\/pluto-engine\/demos/, '');
      if (urlPath.endsWith('/')) urlPath += 'index.html';

      const filePath = join(root, normalize(urlPath).replace(/^(\.\.[/\\])+/, ''));
      if (!existsSync(filePath)) {
        res.writeHead(404);
        res.end('not found');
        return;
      }
      const s = await stat(filePath);
      if (s.isDirectory()) {
        res.writeHead(404);
        res.end('not found');
        return;
      }
      const body = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
      res.end(body);
    } catch (e) {
      res.writeHead(500);
      res.end(String(e));
    }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

/**
 * 検証対象のデモ。
 *
 * heapBudget は 1 フレームあたりの許容ヒープ増加量 (バイト) です。
 * 計測ハーネス (CDP への問い合わせ、Promise の生成) 自体に数十〜数百バイトの
 * 実装のゼロアロケーション違反だけを検出する粗い線引きにします。
 * benchmark デモは計測ハーネスの物が支配的なため、予算を適用しません。
 */
const TARGETS = [
  {
    name: 'swarm-survivors',
    path: '/swarm-survivors/index.html',
    canvas: '#game-canvas',
    ready: 'canvas',
    heapBudget: 2048,
  },
  {
    name: 'rpg',
    path: '/rpg/index.html',
    canvas: '#game-canvas',
    ready: 'canvas',
    heapBudget: 2048,
  },
  {
    name: 'benchmark',
    path: '/benchmark/index.html',
    canvas: 'canvas',
    ready: 'canvas',
  },
];

/**
 * preserveDrawingBuffer を有効にした URL を返します。
 * 無効のままだと合成後の描画バッファが破棄され、canvas へ drawImage しても
 * 何も読み取れず、「描画が起きているか」を判定できません。
 */
function withPixelRead(path) {
  return path + (path.includes('?') ? '&' : '?') + 'preserveDrawingBuffer';
}

/** 指定 ms のあいだに描画が数フレーム進んだかを rAF で計測する */
async function measureFrames(page, ms) {
  return page.evaluate(
    (duration) =>
      new Promise((resolve) => {
        let frames = 0;
        const t0 = performance.now();
        const tick = () => {
          frames++;
          if (performance.now() - t0 < duration) {
            requestAnimationFrame(tick);
          } else {
            resolve({ frames, elapsed: performance.now() - t0 });
          }
        };
        requestAnimationFrame(tick);
      }),
    ms,
  );
}

/**
 * 描画バックエンドの実機確認。
 *
 * テストブラウザ (vitest) 側は WebGL コンテキストの上限が
 * ほぼ埋まっているため、実 GPU が有効な Playwright 側で確認します。
 * WebGPU があれば WGSL のコンパイルまで通します。
 */
async function checkBackends(page) {
  return page.evaluate(async () => {
    const out = { webgl2: false, webgpuApi: false, webgpuAdapter: false, wgslCompiled: false };

    // WebGL2
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2');
      if (gl) {
        out.webgl2 = true;
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    } catch {
      // WebGL2 は使えない環境があります
    }

    // WebGPU
    out.webgpuApi = typeof navigator !== 'undefined' && !!navigator.gpu;
    if (out.webgpuApi) {
      try {
        const adapter = await navigator.gpu.requestAdapter();
        out.webgpuAdapter = adapter !== null;
        if (adapter) {
          // WGSL のコンパイルが通るか確認します
          const device = await adapter.requestDevice();
          const module = device.createShaderModule({
            code: `
struct U { projectionMatrix : mat4x4<f32> };
@group(0) @binding(0) var<uniform> u : U;
@vertex fn vs(@builtin(vertex_index) i : u32) -> @builtin(position) vec4<f32> {
  return u.projectionMatrix * vec4<f32>(0.0, 0.0, 0.0, 1.0);
}
`,
          });
          // getCompilationInfo は環境によって未実装なので try します
          if (module.getCompilationInfo) {
            const info = await module.getCompilationInfo();
            out.wgslCompiled = info.messages.every((m) => m.type !== 'error');
          } else {
            out.wgslCompiled = true;
          }
          device.destroy();
        }
      } catch {
        out.webgpuAdapter = false;
      }
    }
    return out;
  });
}

const server = await startServer(DIST);
const browser = await chromium.launch({
  args: [
    '--use-gl=angle',
    '--use-angle=gl',
    '--enable-webgl',
    '--no-sandbox',
    // GC を明示的に走らせるために必要です。
    // 遅延 GC によるヒープ増加を「毎フレームのアロケーション」と
    // 取り違えないよう、計測の前後で GC を強制します。
    '--js-flags=--expose-gc',
  ],
});

/**
 * ゲームループ実行中のヒープ増加量を実測します。
 * 「定常時ゼロアロケーション」の SLA を、実ブラウザで検証するためのものです。
 *
 * CDP の Performance.getMetrics から JSHeapUsedSize を採取し、
 * 描画が安定した後の N フレームでどれだけ増えたかを見ます。
 * 数千フレームあたり数百 KB 程度の増加なら
 * 定常ループでの動的確保は無視できる水準です。
 */
async function measureHeapGrowth(cdp, page, frames = 180) {
  const forceGC = async () => {
    try {
      await page.evaluate(() => {
        if (typeof window.gc === 'function') window.gc();
      });
      // 数回 回さないと遅延したオブジェクトが残ります
      await page.evaluate(() => new Promise((r) => setTimeout(r, 60)));
      await page.evaluate(() => {
        if (typeof window.gc === 'function') window.gc();
      });
    } catch {
      // gc が使えない環境ではそのまま進めます
    }
  };

  const readHeap = async () => {
    const { metrics } = await cdp.send('Performance.getMetrics');
    const m = metrics.find((x) => x.name === 'JSHeapUsedSize');
    return m ? m.value : 0;
  };

  // 起動直後の JIT やアセット読み込みは含めたくないため、
  // まず 60 フレーム走らせてウォームアップします
  await page.waitForTimeout(1000);
  await forceGC();
  const before = await readHeap();

  const t0 = Date.now();
  await page.evaluate(
    (count) =>
      new Promise((resolve) => {
        let i = 0;
        const tick = () => {
          if (++i >= count) resolve();
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    frames,
  );
  const elapsed = Date.now() - t0;

  // 生存オブジェクトだけを見るため、計測後に GC を強制します
  await forceGC();
  const after = await readHeap();
  return { before, after, deltaBytes: after - before, elapsedMs: elapsed, frames };
}

let failed = 0;
const results = [];

// バックエンドの実機確認 (最初に 1 度だけ)
let backendInfo = null;
{
  const page = await browser.newPage();
  try {
    backendInfo = await checkBackends(page);
  } finally {
    await page.close();
  }
  console.log('Backends:', JSON.stringify(backendInfo));
  if (!backendInfo.webgl2) {
    console.error('  WebGL2 is unavailable in the real browser');
    failed++;
  }
  if (backendInfo.webgpuAdapter && !backendInfo.wgslCompiled) {
    console.error('  WGSL failed to compile');
    failed++;
  }
}

for (const target of TARGETS) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

  try {
    await page.goto(`http://localhost:${PORT}${withPixelRead(target.path)}`, {
      waitUntil: 'load',
      timeout: 30000,
    });
    await page.waitForSelector(target.canvas, { timeout: 15000 });
    // canvas に 1 ピクセルでも描画されていれば描画は開始している
    await page.waitForTimeout(1500);

    const m = await measureFrames(page, 1200);

    // 描画されたピクセル数。WebGL の preserveDrawingBuffer が false のと
    // drawImage のタイミングによっては 0 になるため、判定には
    // rAF 内 (描画直後) で読む方式に切り替えます。
    const painted = await page.evaluate(
      () =>
        new Promise((resolve) => {
          requestAnimationFrame(() => {
            const c = document.querySelector('canvas');
            if (!c) {
              resolve(null);
              return;
            }
            try {
              const tmp = document.createElement('canvas');
              tmp.width = c.width;
              tmp.height = c.height;
              const g = tmp.getContext('2d');
              g.drawImage(c, 0, 0);
              const d = g.getImageData(0, 0, tmp.width, tmp.height).data;
              let nonEmpty = 0;
              let distinct = new Set();
              for (let i = 0; i < d.length; i += 4) {
                if (d[i + 3] > 0) {
                  nonEmpty++;
                  if (distinct.size < 64) {
                    distinct.add((d[i] >> 4) * 256 + (d[i + 1] >> 4) * 16 + (d[i + 2] >> 4));
                  }
                }
              }
              resolve({
                width: tmp.width,
                height: tmp.height,
                nonEmpty,
                colors: distinct.size,
              });
            } catch (e) {
              resolve({ error: String(e) });
            }
          });
        }),
    );

    const fps = m.frames / (m.elapsed / 1000);
    // 定常ループでのヒープ増加量を実測します (ゼロアロケーション SLA)
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Performance.enable');
    const heap = await measureHeapGrowth(cdp, page, 180);
    const bytesPerFrame = heap.deltaBytes / heap.frames;
    await cdp.detach();

    // 描画の实证: 1 ピクセル以上塗られていることと、
    // 単色の空白画面でないこと (色数が 2 種類以上) を要求します。
    // ここを判定に含めない>rta と、何も描画していないデモが PASS になります。
    const rendered = painted && !painted.error && painted.nonEmpty > 0 && painted.colors >= 2;
    if (!rendered) {
      console.error(
        `  [${target.name}] canvas is not actually rendering: ${JSON.stringify(painted)}`,
      );
    }

    // FPS はヘッドレス環境では一向に安定しないため、
    // 「描画が 1 フレームでも進んだ」ことを最低条件に据えます。
    const fpsOk = m.frames > 10;

    // ゼロアロケーション SLA。計測ハーネス自身のノイズを吸収するため、
    // 数百 B/frame 未満であれば許容します。
    // (ベンチマークデモは計測ハーネス側の物になるため対象外)
    const heapOk = target.heapBudget === undefined || bytesPerFrame < target.heapBudget;
    if (!heapOk) {
      console.error(
        `  [${target.name}] heap grew ${bytesPerFrame.toFixed(1)} B/frame ` +
          `(budget ${target.heapBudget} B/frame)`,
      );
    }

    const ok = errors.length === 0 && fpsOk && rendered && heapOk;
    if (!ok) failed++;

    results.push({
      demo: target.name,
      frames: m.frames,
      fps: Number(fps.toFixed(1)),
      canvas: painted ? `${painted.nonEmpty}px/${painted.colors}c` : 'none',
      bytesPerFrame: Number(bytesPerFrame.toFixed(2)),
      budget: target.heapBudget ?? 'n/a',
      errors: errors.length,
      status: ok ? 'PASS' : 'FAIL',
    });

    if (errors.length) {
      for (const e of errors.slice(0, 5)) console.error(`  [${target.name}] ${e}`);
    }
  } catch (e) {
    failed++;
    results.push({ demo: target.name, status: 'FAIL', error: String(e.message ?? e) });
    console.error(`  [${target.name}] ${e.message ?? e}`);
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();

console.table(results);

if (failed > 0) {
  console.error(`\n❌ ${failed} demo(s) failed`);
  process.exit(1);
}
console.log(`\n✅ All ${results.length} demos passed the real-browser smoke test`);
process.exit(0);
