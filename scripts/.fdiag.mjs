/**
 * 参照画像：フィルタなしの描画。
 * painted が 110290 で、フィルタ適用時は約 6400 に落ちています。
 * つまりフィルタ有効時に描画RIX が 17 分の 1 になっています。
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const DIST = 'A:/Project/plute-engine/apps/demo/dist';
const PORT = 5226;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
};
const server = createServer(async (req, res) => {
  try {
    let p = normalize(decodeURIComponent((req.url || '/').split('?')[0]));
    if (p.endsWith('/')) p += 'index.html';
    const fp = join(DIST, p);
    if (!existsSync(fp) || (await stat(fp)).isDirectory()) {
      res.writeHead(404);
      res.end('nf');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(fp)] || 'application/octet-stream' });
    res.end(await readFile(fp));
  } catch {
    res.writeHead(404);
    res.end('nf');
  }
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch({
  headless: false,
  args: ['--enable-unsafe-webgpu', '--enable-webgl', '--no-sandbox', '--disable-gpu-sandbox'],
});

/**
 * 画面左 1/4（_filters が影響しない領域）と全画面の両方を測ります。
 *
 * 左 1/4 が 0 付近なら「フィルタの連鎖で scene 描画が失われている」のが確定します。
 */
async function regions(page, buf) {
  const b64 = buf.toString('base64');
  return page.evaluate(async (dataUrl) => {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    const cv = document.createElement('canvas');
    cv.width = img.width;
    cv.height = img.height;
    const ctx = cv.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    const w = cv.width;
    const bg = [d[0], d[1], d[2]];
    let all = 0;
    let left = 0;
    for (let y = 0; y < cv.height; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (d[i] !== bg[0] || d[i + 1] !== bg[1] || d[i + 2] !== bg[2]) {
          all++;
          if (x < w * 0.25) left++;
        }
      }
    }
    return { all, left, bg: `rgb(${bg.join(',')})` };
  }, `data:image/png;base64,${b64}`);
}

async function run(spec) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(
    `http://localhost:${PORT}/backend-bench/index.html` +
      `?backend=webgpu&entities=20000&frames=20&warmup=8&cull=gpu${spec ? `&filter=${spec}` : ''}`,
    { waitUntil: 'load', timeout: 60000 },
  );
  const h = await page.waitForFunction(
    () => window.__benchResult ?? window.__benchError ?? null,
    null,
    { timeout: 180000, polling: 250 },
  );
  const v = await h.jsonValue();
  const buf = await page.locator('#game-canvas').screenshot();
  const px = await regions(page, buf);
  await page.close();
  return {
    active: typeof v === 'string' ? 'ERROR' : v.filtersActive,
    applied: typeof v === 'string' ? null : v.appliedFilters,
    ...px,
  };
}

console.log('filter          active  applied          all      left25%');
for (const f of ['', 'vignette', 'blur', 'brightness', 'threshold']) {
  const r = await run(f);
  console.log(
    `${(f || '(none)').padEnd(15)} ${String(r.active).padEnd(7)} ` +
      `${JSON.stringify(r.applied).padEnd(17)} ${String(r.all).padStart(7)}  ${String(r.left).padStart(7)}`,
  );
}

await browser.close();
server.close();
process.exit(0);
