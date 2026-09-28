const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
};

const server = http.createServer((req, res) => {
  let filePath = './apps/demo/dist' + req.url;
  if (filePath.endsWith('/')) filePath += 'benchmark/index.html';
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(8080, async () => {
  console.log('Server started on port 8080. Launching browser...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-frame-rate-limit'],
  });

  const page = await browser.newPage();

  page.on('console', async (msg) => {
    const text = msg.text();
    console.log('[BROWSER]', text);
    if (text.includes('BENCHMARK FINISHED')) {
      const results = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('#stats table tr')).slice(1);
        return rows.map((r) => {
          const cells = r.querySelectorAll('td');
          return {
            entities: parseInt(cells[0].innerText, 10),
            fps: parseInt(cells[1].innerText, 10),
          };
        });
      });

      console.log('--- RAW BENCHMARK RESULTS ---');
      console.log(JSON.stringify(results, null, 2));
      fs.writeFileSync('benchmark_results.json', JSON.stringify(results, null, 2));
      await browser.close();
      server.close();
      process.exit(0);
    }
  });

  await page.goto('http://localhost:8080/benchmark/index.html');

  setTimeout(async () => {
    console.log('Timeout.');
    await browser.close();
    server.close();
    process.exit(1);
  }, 60000);
});
