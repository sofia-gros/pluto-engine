import { defineConfig } from 'tsup';
import fs from 'node:fs/promises';
import path from 'node:path';
import { transpileWGSLtoGLSL } from '@plutoengine/vite-plugin-wgsl';

const wgslPlugin = {
  name: 'wgsl-plugin',
  setup(build) {
    build.onResolve({ filter: /\.wgsl$/ }, (args) => {
      return {
        path: path.resolve(args.resolveDir, args.path),
        namespace: 'wgsl',
      };
    });

    build.onLoad({ filter: /.*/, namespace: 'wgsl' }, async (args) => {
      const code = await fs.readFile(args.path, 'utf8');
      const glsl = transpileWGSLtoGLSL(code);
      return {
        contents: `
          export const wgsl = ${JSON.stringify(code)};
          export const glsl = ${JSON.stringify(glsl)};
          export default wgsl;
        `,
        loader: 'js',
      };
    });
  },
};

export default defineConfig([
  {
    entry: {
      pluto: 'src/index.ts',
    },
    format: ['esm', 'iife'],
    globalName: 'Pluto',
    outExtension({ format }) {
      return {
        js: format === 'iife' ? '.global.js' : '.esm.js',
      };
    },
    minify: false,
    dts: true,
    noExternal: [/(.*)/],
    clean: true,
    esbuildPlugins: [wgslPlugin],
  },
  {
    entry: {
      pluto: 'src/index.ts',
    },
    format: ['esm', 'iife'],
    globalName: 'Pluto',
    outExtension({ format }) {
      return {
        js: format === 'iife' ? '.global.min.js' : '.esm.min.js',
      };
    },
    minify: true,
    dts: false,
    noExternal: [/(.*)/],
    clean: false,
    esbuildPlugins: [wgslPlugin],
  },
]);
