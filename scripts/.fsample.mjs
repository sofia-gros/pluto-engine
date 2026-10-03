/**
 * 決定的実験: フィルタが「何を出しているか」を画素レベルで特定します。
 *
 * フィルタなし bg=rgb(2,5,13) / フィルタあり bg=rgb(0,0,0)
 * かつ painted が画面左 25% だけ → 何が起きているかを推測せず測ります。
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const DIST = 'A:/Project/plute-engine/apps/demo/dist';
const PORT = 5228;
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

async function sample(page, buf, tag) {
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
    const pts = [
      [0, 0],
      [320, 180],
      [640, 360],
      [960, 540],
      [1279, 719],
      [160, 600],
      [1100, 100],
    ];
    return pts.map(([x, y]) => {
      const d = ctx.getImageData(x, y, 1, 1).data;
      return `${x},${y}=rgb(${d[0]},${d[1]},${d[2]})`;
    });
  }, `data:image/png;base64,${b64}`);
}

async function run(spec, tag, extra = '') {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(
    `http://localhost:${PORT}/backend-bench/index.html` +
      `?backend=webgpu&entities=20000&frames=20&warmup=8&cull=gpu` +
      `${extra}${spec ? `&filter=${spec}` : ''}`,
    { waitUntil: 'load', timeout: 60000 },
  );
  await page.waitForFunction(() => window.__benchResult ?? window.__benchError ?? null, null, {
    timeout: 180000,
    polling: 250,
  });
  const buf = await page.locator('#game-canvas').screenshot();
  const s = await sample(page, buf, tag);
  await page.close();
  return s;
}

console.log('--- フィルタなし ---');
console.log((await run('', 'none')).join('\n'));
console.log('--- vignette ---');
console.log((await run('vignette', 'vig')).join('\n'));
console.log('--- identity (no-op 1 pass) ---');
console.log((await run('identity', 'ident')).join('\n'));

await browser.close();
server.close();
process.exit(0);
