/**
 * PlutoEngine ベンチマーク実行スクリプト
 * 既存のVite devサーバーを使い、Playwright（有フレーム）でベンチマークを実行する。
 * 呼び出す前に `cd apps/demo && bun run dev` でサーバーを起動しておくこと。
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BENCHMARK_URL = 'http://localhost:5173/benchmark/index.html';
const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

(async () => {
  let browser = null;

  // 終了時に確実にブラウザを終了するクリーンアップ
  const cleanup = async () => {
    if (browser) {
      try {
        await browser.close();
      } catch (_) {}
      browser = null;
    }
  };

  process.on('SIGINT', async () => {
    await cleanup();
    process.exit(1);
  });
  process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(1);
  });

  try {
    console.log('▶ Launching browser (headed)...');
    browser = await chromium.launch({
      headless: false,
      args: ['--disable-frame-rate-limit', '--disable-gpu-vsync', '--window-size=1280,800'],
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(TIMEOUT_MS);

    /** コンソールログを全て中継 */
    let results = null;
    page.on('console', async (msg) => {
      const text = msg.text();
      process.stdout.write(`[browser][${msg.type()}] ${text}\n`);

      if (text.startsWith('BENCHMARK FINISHED:')) {
        try {
          const json = text.replace('BENCHMARK FINISHED:', '').trim();
          results = JSON.parse(json);
        } catch (e) {
          console.error('Failed to parse results:', e);
        }
      }
    });

    page.on('pageerror', (err) => {
      console.error('[page error]', err.message);
    });

    page.on('requestfailed', (req) => {
      console.warn('[request failed]', req.url(), req.failure()?.errorText);
    });

    console.log(`▶ Navigating to ${BENCHMARK_URL}...`);
    await page.goto(BENCHMARK_URL, { waitUntil: 'networkidle' });

    console.log('▶ Waiting for benchmark to finish (chart-container visible)...');
    await page.waitForFunction(
      () => {
        const el = document.getElementById('chart-container');
        return el && el.style.display === 'block';
      },
      { timeout: TIMEOUT_MS },
    );

    console.log('▶ Benchmark finished! Collecting data...');

    if (!results || results.length === 0) {
      console.error('❌ No results collected!');
      process.exit(1);
    }

    // JSON ファイルとして保存
    const jsonPath = path.join(__dirname, 'benchmark_results.json');
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
    console.log(`\n✅ Results saved to ${jsonPath}`);
    console.log('\n=== RAW RESULTS ===');
    console.table(results);
  } catch (err) {
    console.error('Benchmark execution error:', err);
    process.exit(1);
  } finally {
    await cleanup();
  }

  process.exit(0);
})();
