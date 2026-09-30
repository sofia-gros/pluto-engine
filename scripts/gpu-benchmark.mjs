import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'apps', 'demo', 'dist');
const PORT = 5200;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png'
};

const server = createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    urlPath = urlPath.replace(/^\/pluto-engine\/demos/, '');
    if (urlPath.endsWith('/')) urlPath += 'index.html';
    const relativePath = urlPath.replace(/^\/+/, '');
    const filePath = join(DIST, normalize(relativePath).replace(/^(\.\.[/\\])+/, ''));
    if (!existsSync(filePath)) { res.writeHead(404); res.end('not found'); return; }
    const s = await stat(filePath);
    if (s.isDirectory()) { res.writeHead(404); res.end('not found'); return; }
    const body = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
    res.end(body);
  } catch (e) {
    res.writeHead(500); res.end(String(e));
  }
});

server.listen(PORT, async () => {
  console.log("Server started.");
  
  const results = {};
  
  // Launch headed to avoid headless WebGPU issues
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--enable-unsafe-webgpu',
      '--enable-webgl',
      '--no-sandbox',
      '--disable-gpu-sandbox'
    ]
  });

  for (const backend of ['webgl2', 'webgpu']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    page.on('console', (m) => console.log(`[${backend}] ${m.text()}`));
    
    // Add param to force backend if engine supports it? 
    // Wait, PlutoEngine auto-selects WebGPU if available, then falls back to WebGL2.
    // To force WebGL2, we can intercept or inject.
    // Let's just use evaluate to set a flag or block navigator.gpu.
    if (backend === 'webgl2') {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'gpu', { get: () => undefined });
      });
    }

    await page.goto(`http://localhost:${PORT}/benchmark/index.html`);
    console.log(`Running benchmark on ${backend} for 30 seconds...`);
    await page.waitForTimeout(30000); // let it run to spawn entities

    const stats = await page.evaluate(() => {
      const statsDiv = document.getElementById('stats');
      return {
        text: statsDiv ? statsDiv.innerText : 'not found'
      };
    });

    results[backend] = stats;
    await page.close();
  }

  await browser.close();
  server.close();
  
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
});
