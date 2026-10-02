import { resolve } from 'path';
import wgsl from '@pluto-engine/vite-plugin-wgsl';
import { defineConfig } from 'vite';

const wgslPlugin = (wgsl as any).default || wgsl;

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [wgslPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'swarm-survivors/index.html'),
        rpg: resolve(__dirname, 'rpg/index.html'),
        benchmark: resolve(__dirname, 'benchmark/index.html'),
        'backend-bench': resolve(__dirname, 'backend-bench/index.html'),
      },
    },
  },
});
