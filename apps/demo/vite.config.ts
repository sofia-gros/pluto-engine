import { defineConfig } from 'vite';
import wgsl from '@pluto-engine/vite-plugin-wgsl';
import { resolve } from 'path';

const wgslPlugin = (wgsl as any).default || wgsl;

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [wgslPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'swarm-survivors/index.html'),
        benchmark: resolve(__dirname, 'benchmark/index.html'),
      },
    },
  },
});
