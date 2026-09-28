import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'browser-tests',
      include: ['packages/**/*.test.ts'],
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
