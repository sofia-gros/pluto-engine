import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { createHash } from 'node:crypto';

const DIST = 'A:/Project/plute-engine/apps/demo/dist';
const PORT = 5224;
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

async function run(filterSpec, backend = 'webgpu') {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', async (m) => {
    if (m.type() !== 'error' && m.type() !== 'warning') return;
    const parts = [];
    for (const a of m.args()) {
      try {
        parts.push(await a.jsonValue());
      } catch {
        parts.push(await a.toString());
      }
    }
    errors.push(parts.map((p) => (typeof p === 'string' ? p : JSON.stringify(p))).join(' '));
  });
  const url =
    `http://localhost:${PORT}/backend-bench/index.html` +
    `?backend=${backend}&entities=40000&frames=20&warmup=8` +
    (filterSpec ? `&filter=${filterSpec}` : '');
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  const h = await page.waitForFunction(
    () => window.__benchResult ?? window.__benchError ?? null,
    null,
    { timeout: 180000, polling: 250 },
  );
  const v = await h.jsonValue();
  const buf = await page.locator('#game-canvas').screenshot();
  await page.close();
  return {
    err: typeof v === 'string' ? v : null,
    active: typeof v === 'string' ? null : v.filtersActive,
    bytes: buf.length,
    hash: createHash('sha256').update(buf).digest('hex').slice(0, 12),
    errors,
  };
}

console.log('filter              filtersActive  pngBytes  hash         notes');
const base = await run('');
console.log(
  `(none)              ${String(base.active).padStart(13)}  ${String(base.bytes).padStart(8)}  ${base.hash}` +
    (base.errors.length ? `\n      ERR: ${JSON.stringify(base.errors).slice(0, 500)}` : ''),
);

for (const f of [
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
  const same = r.hash === base.hash ? 'SAME-AS-NONE' : 'differs';
  console.log(
    `${f.padEnd(18)} ${String(r.active).padStart(13)}  ${String(r.bytes).padStart(8)}  ${r.hash}  ${same}` +
      (r.errors.length ? `\n      ERR: ${JSON.stringify(r.errors).slice(0, 500)}` : ''),
  );
}

// WebGL2 では webgpuOnly フィルタが無視されることを確認します
const gl = await run('threshold', 'webgl2');
console.log(
  `webgl2 threshold    ${String(gl.active).padStart(13)}  ${String(gl.bytes).padStart(8)}  ${gl.hash}  (webgpuOnly は除外される)`,
);

await browser.close();
server.close();
process.exit(0);
