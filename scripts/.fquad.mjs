/**
 * フィルタ有効時に描画が失われる位置を特定します。
 *
 * 事象: フィルタなし all=110290 / 有効 all=6404 かつ left25% == all
 * → 描画されているのは画面の一部だけです。四分割して特定します。
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const DIST = 'A:/Project/plute-engine/apps/demo/dist';
const OUT = 'C:/Users/metal/AppData/Local/Temp/opencode';
const PORT = 5227;
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

async function quadrants(page, buf, tag) {
  await writeFile(join(OUT, `shot-${tag}.png`), buf);
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
    const h = cv.height;
    const bg = [d[0], d[1], d[2]];
    const q = [0, 0, 0, 0];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (d[i] === bg[0] && d[i + 1] === bg[1] && d[i + 2] === bg[2]) continue;
        q[(y < h / 2 ? 0 : 2) + (x < w / 2 ? 0 : 1)]++;
      }
    }
    return { size: `${w}x${h}`, bg: `rgb(${bg.join(',')})`, q };
  }, `data:image/png;base64,${b64}`);
}

async function run(spec, tag) {
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
  const r = await quadrants(page, buf, tag);
  await page.close();
  return {
    ...r,
    active: typeof v === 'string' ? 'ERR' : v.filtersActive,
    renderCount: v.renderCount,
  };
}

for (const [spec, tag] of [
  ['', 'none'],
  ['vignette', 'vig'],
]) {
  const r = await run(spec, tag);
  console.log(
    `${tag.padEnd(8)} active=${String(r.active).padEnd(6)} ${r.size} bg=${r.bg} ` +
      `quadrants(TL,TR,BL,BR)=${r.q.join(',')} renderCount=${r.renderCount}`,
  );
}

await browser.close();
server.close();
process.exit(0);
