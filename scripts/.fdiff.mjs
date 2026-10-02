/**
 * 決定的な判定: identity filter（何もしない 1 パス）の出力が
 * フィルタなしと完全に一致するかを比較します。
 *
 * 「painted ピクセル数Counts」で比較すると、
 * 背景色が変わるフィルタ（vignette など）で误解するため、
 * **画素単位の最大差**で判定します。
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const DIST = 'A:/Project/plute-engine/apps/demo/dist';
const PORT = 5230;
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

async function grab(spec) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(
    `http://localhost:${PORT}/backend-bench/index.html` +
      `?backend=webgpu&entities=20000&frames=20&warmup=8&cull=gpu` +
      `${spec ? `&filter=${spec}` : ''}`,
    { waitUntil: 'load', timeout: 60000 },
  );
  await page.waitForFunction(() => window.__benchResult ?? window.__benchError ?? null, null, {
    timeout: 180000,
    polling: 250,
  });
  const buf = await page.locator('#game-canvas').screenshot();
  // PNG をブラウザ内で decode して生ピクセルを返します
  // PNG の decode は**使い回しの別ページ**で行います。
  // ベンチページは計測完了後に自動で閉じられることがあるため、
  // 同じページで evaluate すると実行コンテキストが破棄されます。
  const raw = await decoder.evaluate(
    async (url) => {
      const img = new Image();
      img.src = url;
      await img.decode();
      const cv = document.createElement('canvas');
      cv.width = img.width;
      cv.height = img.height;
      const ctx = cv.getContext('2d');
      ctx.drawImage(img, 0, 0);
      return Array.from(ctx.getImageData(0, 0, cv.width, cv.height).data);
    },
    `data:image/png;base64,${buf.toString('base64')}`,
  );
  await page.close();
  return raw;
}

// PNG decode 用のページを 1 つだけ用意します（ベンチページは自動 close されます）
const decoder = await browser.newPage();

const base = await grab('');
const ident = await grab('identity');

let maxDiff = 0;
let diffCount = 0;
for (let i = 0; i < base.length; i++) {
  const d = Math.abs(base[i] - ident[i]);
  if (d > maxDiff) maxDiff = d;
  if (d > 2) diffCount++;
}
console.log(
  `identity vs none: maxChannelDiff=${maxDiff} pixelsDiffering=${diffCount} / ${base.length / 4}`,
);
console.log(
  maxDiff <= 2 ? '=> 一致（filter 連鎖は正しい）' : '=> 不一致（offscreen / blit に問題）',
);

await browser.close();
server.close();
process.exit(0);
