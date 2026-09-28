import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const distDir = path.resolve(process.cwd(), 'apps/demo/dist');

const server = http.createServer((req, res) => {
  let reqUrl = req.url || '/';
  if (reqUrl.startsWith('/pluto-engine/demos/')) {
    reqUrl = reqUrl.replace('/pluto-engine/demos/', '/');
  }
  let filePath = path.join(distDir, reqUrl.split('?')[0]);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(5188, async () => {
  console.log('🚀 HTTP Server serving dist at http://localhost:5188/rpg/index.html');

  try {
    const browser = await chromium.launch({
      headless: true,
      args: ['--use-gl=angle', '--use-angle=gl', '--enable-webgl', '--no-sandbox'],
    });

    const page = await browser.newPage();
    page.on('console', (msg) => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', (err) => console.error('BROWSER ERROR:', err));

    await page.goto('http://localhost:5188/rpg/index.html');
    await page.waitForSelector('#game-canvas');
    await page.waitForTimeout(1000);

    const scales = [100, 1000, 5000, 20000];
    const results = [];

    for (const scale of scales) {
      console.log(`\n⏳ Measuring RPG Performance at ${scale} entities...`);

      await page.evaluate((count) => {
        const benchBtn = document.querySelector(`.btn-spawn-bench[data-count="${count}"]`);
        if (benchBtn) {
          benchBtn.click();
        }
      }, scale);

      await page.waitForTimeout(1000);

      const metrics = await page.evaluate(async (count) => {
        const frameTimes = [];
        const fpsHistory = [];
        const start = performance.now();

        while (performance.now() - start < 1500) {
          const ftText = document.getElementById('bench-frame-time')?.textContent || '0ms';
          const fpsText = document.getElementById('bench-fps')?.textContent || '60';
          const ft = parseFloat(ftText);
          const fps = parseFloat(fpsText);
          if (!isNaN(ft)) frameTimes.push(ft);
          if (!isNaN(fps)) fpsHistory.push(fps);
          await new Promise((r) => requestAnimationFrame(r));
        }

        const avgFt = frameTimes.reduce((a, b) => a + b, 0) / Math.max(1, frameTimes.length);
        const avgFps = fpsHistory.reduce((a, b) => a + b, 0) / Math.max(1, fpsHistory.length);

        return {
          scale: count,
          avgFps: Math.round(avgFps * 10) / 10,
          avgFrameTimeMs: Math.round(avgFt * 100) / 100,
          sampleFrames: frameTimes.length,
        };
      }, scale);

      results.push(metrics);
      console.log(`✅ [${scale} Entities] FPS: ${metrics.avgFps}, Frame Time: ${metrics.avgFrameTimeMs}ms (${metrics.sampleFrames} frames sampled)`);
    }

    await browser.close();
    server.close();

    console.log('\n📊 === 2D RPG Benchmark Results Summary ===');
    console.table(results);
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    server.close();
    process.exit(1);
  }
});
