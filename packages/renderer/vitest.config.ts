import { defineConfig } from 'vitest/config';
import wgsl from '@pluto-engine/vite-plugin-wgsl';

const wgslPlugin = (wgsl as any).default || wgsl;

export default defineConfig({
  plugins: [wgslPlugin()],
  test: {
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
    },
  },
});
