import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'browser-tests',
      include: ['packages/**/*.test.ts'],
      // 単一ブラウザセッションで全ファイルを回します。
      // WebGL コンテキスト数には上限があり、並列・分離実行すると
      // 描画を伴うテストがコンテキスト不足で失敗するため無効化しています。
      fileParallelism: false,
      isolate: false,
      browser: {
        enabled: true,
        name: 'chromium',
        provider: 'playwright',
        headless: true,
      },
    },
  },
]);
