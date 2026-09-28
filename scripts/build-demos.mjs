import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const demoDir = join(rootDir, 'apps', 'demo');
const destDir = join(rootDir, 'docs_site', 'public', 'demos');

console.log('🎮 Building demo games for documentation site...\n');

// 1. Build apps/demo with base /pluto-engine/demos/
const res = spawnSync('bun', ['run', 'build'], {
  cwd: demoDir,
  env: {
    ...process.env,
    VITE_BASE: '/pluto-engine/demos/',
  },
  stdio: 'inherit',
  shell: true,
});

if (res.status !== 0) {
  console.error('❌ Failed to build demo apps');
  process.exit(1);
}

// 2. Ensure docs_site/public/demos exists and copy files
if (existsSync(destDir)) {
  rmSync(destDir, { recursive: true, force: true });
}
mkdirSync(destDir, { recursive: true });

const distDir = join(demoDir, 'dist');
cpSync(distDir, destDir, { recursive: true });

console.log(`✅ Demo games copied to ${destDir} successfully!`);
