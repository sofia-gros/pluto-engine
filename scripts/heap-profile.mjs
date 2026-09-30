/**
 * 開発用の診断スクリプト (.smoke-test.mjs とは別)。
 * CDP の HeapProfiler サンプリングで、毎フレームの確保場所を特定します。
 *
 * 使い方: node scripts/heap-profile.mjs [demo]
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'apps', 'demo', 'dist');
const PORT = 5201;
const TARGET = process.argv[2] || 'swarm-survivors';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function startServer(root) {
  const server = createServer(async (req, res) => {
    try {
      let p = decodeURIComponent((req.url || '/').split('?')[0]);
      p = p.replace(/^\/pluto-engine\/demos/, '');
      if (p.endsWith('/')) p += 'index.html';
      const filePath = join(root, normalize(p).replace(/^(\.\.[/\\])+/, ''));
      if (!existsSync(filePath)) {
        res.writeHead(404);
        res.end('nf');
        return;
      }
      const s = await stat(filePath);
      if (s.isDirectory()) {
        res.writeHead(404);
        res.end('nf');
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
  return new Promise((r) => server.listen(PORT, () => r(server)));
}

const server = await startServer(DIST);
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=gl', '--enable-webgl', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const cdp = await page.context().newCDPSession(page);

await page.goto(`http://localhost:${PORT}/${TARGET}/index.html`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 15000 });
await page.waitForTimeout(2500);

// ウォームアップ後のみサンプリングします
await cdp.send('HeapProfiler.enable');
await cdp.send('HeapProfiler.startSampling', { samplingInterval: 2048 });

await page.evaluate(
  () =>
    new Promise((resolve) => {
      let i = 0;
      const tick = () => {
        if (++i >= 240) resolve();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }),
);

const { profile } = await cdp.send('HeapProfiler.stopSampling');

/** self > 0 のノードを集計し、呼び出しスタック付きで表示します */
const rows = [];
function walk(node, stack) {
  const self = node.selfSize || 0;
  if (self > 0) {
    const frames = stack
      .slice(0, 6)
      .map((f) => `${f.functionName || '(anon)'}@${(f.url || '').split('/').pop()}:${f.lineNumber}`);
    rows.push({ bytes: self, size: node.selfSize, frames: frames.join(' <- ') });
  }
  for (const c of node.children || []) {
    walk(c, [c.callFrame, ...stack]);
  }
}
walk(profile.head, []);

rows.sort((a, b) => b.size - a.size);
console.log(`\n=== ${TARGET}: top allocation sites (sampled) ===`);
for (const r of rows.slice(0, 15)) {
  console.log(`\n${(r.size / 1024).toFixed(1)} KB`);
  console.log(`  ${r.frames}`);
}

await cdp.detach();
await browser.close();
server.close();
process.exit(0);
