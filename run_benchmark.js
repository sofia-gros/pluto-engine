
const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-frame-rate-limit',
      '--enable-webgl',
      '--use-gl=angle',
      '--use-angle=d3d11'
    ]
  });

  const page = await browser.newPage();
  
  page.on('console', async msg => {
    const text = msg.text();
    console.log('[BROWSER CONSOLE]', text);
    if (text.includes('BENCHMARK FINISHED')) {
      console.log('Benchmark completed. Collecting results...');
      await page.waitForTimeout(1000);
      
      const results = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('#stats table tr')).slice(1);
        return rows.map(r => {
          const cells = r.querySelectorAll('td');
          return {
            entities: parseInt(cells[0].innerText, 10),
            fps: parseInt(cells[1].innerText, 10)
          };
        });
      });
      
      console.log('--- RAW BENCHMARK RESULTS ---');
      console.log(JSON.stringify(results, null, 2));
      
      const fs = require('fs');
      fs.writeFileSync('benchmark_results.json', JSON.stringify(results, null, 2));
      
      await browser.close();
      process.exit(0);
    }
  });

  console.log('Navigating to benchmark...');
  await page.goto('http://localhost:5176/benchmark/index.html');
  
  // Timeout after 60 seconds
  setTimeout(async () => {
    console.log('Benchmark timed out after 60 seconds.');
    await browser.close();
    process.exit(1);
  }, 60000);
})();

