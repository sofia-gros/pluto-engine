const { chromium } = require('playwright');
const { spawn } = require('child_process');

(async () => {
  console.log("Starting Vite dev server...");
  const server = spawn('bun', ['run', 'dev'], { cwd: 'apps/demo' });
  await new Promise(r => setTimeout(r, 5000)); 

  console.log("Launching browser in non-headless mode...");
  const browser = await chromium.launch({ headless: false }); 
  const page = await browser.newPage();
  page.setDefaultTimeout(600000); // 10 minutes
  
  await page.goto('http://localhost:5173/benchmark/index.html');
  
  console.log("Waiting for benchmark to finish (waiting for chart container)...");
  
  await page.waitForFunction(() => {
    const el = document.getElementById('chart-container');
    return el && el.style.display === 'block';
  }, { timeout: 600000 });
  
  console.log("Benchmark finished! Extracting data...");
  
  const data = await page.evaluate(() => {
     const chart = Chart.getChart("benchmark-chart") || Chart.getChart("resultChart");
     if (!chart) return null;
     return {
       labels: chart.data.labels,
       fps: chart.data.datasets[0].data
     };
  });
  
  const html = await page.evaluate(() => {
    return document.getElementById('stats').innerText;
  });

  console.log("=== FINAL STATS ===");
  console.log(html);
  
  console.log("=== CHART DATA ===");
  console.log(JSON.stringify(data, null, 2));
  
  await browser.close();
  server.kill();
  process.exit(0);
})();
