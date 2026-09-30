/**
 * 開発用 스크린ショット取得。
 * 実ブラウザで rpg デモを起動し、キャンバス内テキストの描画を確認します。
 *
 * 使い方: node scripts/screenshot.mjs [demo] [outPath]
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'apps', 'demo', 'dist');
const PORT = 5202;
const TARGET = process.argv[2] || 'rpg';
const OUT = process.argv[3] || join(ROOT, 'C:\\Users\\metal\\AppData\\Local\\Temp\\opencode', `${TARGET}.png`);

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
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
      res.end(await readFile(filePath));
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
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});

await page.goto(`http://localhost:${PORT}/${TARGET}/index.html`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 15000 });
await page.waitForTimeout(3000);

await page.screenshot({ path: OUT });
console.log(`saved: ${OUT}`);
if (errors.length) {
  console.error('errors:');
  for (const e of errors.slice(0, 5)) console.error(`  ${e}`);
}

await browser.close();
server.close();
process.exit(0);
