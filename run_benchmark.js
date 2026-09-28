const { chromium } = require('playwright');
const { spawn } = require('child_process');

(async () => {
  // Start vite dev server
  const server = spawn('bun', ['run', 'dev'], { cwd: 'apps/demo' });
  
  // Wait for server to start
  await new Promise(r => setTimeout(r, 3000));

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(300000); // 5 mins
  
  console.log("Navigating to benchmark...");
  await page.goto('http://localhost:5173/benchmark/index.html');
  
  console.log("Running benchmark (waiting for 30fps drop)...");
  
  page.on('console', msg => {
    if (msg.text().includes('chart') || msg.text().includes('fps')) {
       console.log('PAGE LOG:', msg.text());
    }
  });

  await page.waitForFunction(() => {
    const el = document.getElementById('chart-container');
    return el && el.style.display === 'block';
  }, { timeout: 300000 }); 
  
  const data = await page.evaluate(() => {
     const chart = Chart.getChart("resultChart");
     if (!chart) return null;
     return {
       labels: chart.data.labels,
       fps: chart.data.datasets[0].data,
       sim: chart.data.datasets[1].data,
       pack: chart.data.datasets[2].data,
       upload: chart.data.datasets[3].data
     };
  });
  console.log(JSON.stringify(data, null, 2));
  
  await browser.close();
  server.kill();
  process.exit(0);
})();
