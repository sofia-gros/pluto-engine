import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const DIST = 'A:/Project/plute-engine/apps/demo/dist';
const PORT = 5225;
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
 * 実際に絵が出ているかを、スクリーンショットの統計で見ます。
 *
 * PNG バイト数だけでは「背景が 1 色の空画像」と「描けている画像」を区別できません。
 * そこで distinct 色数と非背景ピクセル数を出します。
 */
async function stats(page) {
  const buf = await page.locator('#game-canvas').screenshot();
  return { bytes: buf.length };
}

async function pixelStats(page, screenshotBuf) {
  // WebGPU キャンバスは drawImage で空になるため、
  // **ブラウザが合成したスクリーンショット（普通の PNG）** を読み込みます。
  const b64 = screenshotBuf.toString('base64');
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
    const bg = [d[0], d[1], d[2]];
    let painted = 0;
    const seen = new Set();
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] !== bg[0] || d[i + 1] !== bg[1] || d[i + 2] !== bg[2]) painted++;
      seen.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
    }
    return { painted, distinct: seen.size, bg };
  }, `data:image/png;base64,${b64}`);
}

async function run(filterSpec, backend = 'webgpu', entities = 20000) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const url =
    `http://localhost:${PORT}/backend-bench/index.html` +
    `?backend=${backend}&entities=${entities}&frames=20&warmup=8` +
    (filterSpec ? `&filter=${filterSpec}` : '');
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => window.__benchResult ?? window.__benchError ?? null, null, {
    timeout: 180000,
    polling: 250,
  });
  // 合成結果の PNG を先に撮ります（WebGPU キャンバスは直接読めないため）
  const buf = await page.locator('#game-canvas').screenshot();
  const px = await pixelStats(page, buf);
  await page.close();
  return { ...px, bytes: buf.length, errors };
}

console.log('filter           painted/total   distinct  pngBytes');
for (const f of [
  '',
  'vignette',
  'grayscale',
  'invert',
  'sepia',
  'brightness',
  'pixelate',
  'blur',
  'threshold',
  'blur,vignette',
]) {
  const r = await run(f);
  console.log(
    `${(f || '(none)').padEnd(16)} ${String(r.painted).padStart(7)}/921600  ${String(r.distinct).padStart(8)}  ${String(r.bytes).padStart(8)}`,
  );
}

await browser.close();
server.close();
process.exit(0);
