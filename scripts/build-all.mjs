import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const packages = [
  'vite-plugin-wgsl',
  'renderer',
  'core',
  'audio',
  'ai',
  'morton',
  'poisson',
  'sdf-collider',
  'verlet-ik',
  'xpbd',
  'pluto',
];

console.log('🚀 Starting sequential build for PlutoEngine packages...\n');

for (const pkg of packages) {
  const dir = join(process.cwd(), 'packages', pkg);
  if (existsSync(dir)) {
    console.log(`📦 Building @pluto-engine/${pkg}...`);
    const res = spawnSync('npm', ['run', 'build'], {
      cwd: dir,
      env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' },
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
