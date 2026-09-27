import { defineConfig } from 'vite';
import wgsl from '@plutoengine/vite-plugin-wgsl';
import { resolve } from 'path';

const wgslPlugin = (wgsl as any).default || wgsl;

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [wgslPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'swarm-survivors/index.html'),
      },
    },
  },
});
