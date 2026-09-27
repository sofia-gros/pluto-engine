import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'browser-tests',
      include: ['packages/**/*.test.ts'],
      browser: {
        enabled: true,
        name: 'chromium',
        provider: 'playwright',
      },
    },
  },
]);
