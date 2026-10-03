import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const DIST = 'A:/Project/plute-engine/apps/demo/dist';
const PORT = 5229;
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

for (const spec of ['identity', 'vignette', 'blur']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(
    `http://localhost:${PORT}/backend-bench/index.html` +
      `?backend=webgpu&entities=20000&frames=20&warmup=8&cull=cpu&filter=${spec}`,
    { waitUntil: 'load', timeout: 60000 },
  );
  await page.waitForFunction(() => window.__benchResult ?? window.__benchError ?? null, null, {
    timeout: 180000,
    polling: 250,
  });
  const v = await page.evaluate(() => window.__benchResult);
  console.log(
    `${spec}: filtersActive=${v.filtersActive} sceneDrawCalls=${v.sceneDrawCalls} ` +
      `filterStatus=${JSON.stringify(v.filterStatus)} renderCount=${v.renderCount} ` +
      `visibleDrawn=${v.visibleDrawn}`,
  );
  await page.close();
}

await browser.close();
server.close();
process.exit(0);
