import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const packages = [
  'vite-plugin-wgsl',
  'core',
  'audio',
  'ai',
  'morton',
  'poisson',
  'sdf-collider',
  'verlet-ik',
  'xpbd',
  'renderer',
  'pluto',
];

console.log('🚀 Starting sequential build for PlutoEngine packages...\n');

for (const pkg of packages) {
  const dir = join(process.cwd(), 'packages', pkg);
  if (existsSync(dir)) {
    console.log(`📦 Building @pluto-engine/${pkg}...`);
    const res = spawnSync('bun', ['run', 'build'], {
      cwd: dir,
      stdio: 'inherit',
      shell: true,
    });
    if (res.status !== 0) {
      console.error(`❌ Build failed for ${pkg}`);
      process.exit(1);
    }
  }
}

console.log('\n✅ All packages built successfully!');
