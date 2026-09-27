const fs = require('fs');
const path = require('path');

const packages = [
  { name: 'ai', className: 'AIPlugin', prop: 'ai', implClass: 'UtilityAISystem', importFrom: './UtilityAISystem' },
  { name: 'poisson', className: 'PoissonPlugin', prop: 'poisson', implClass: 'PoissonSolver', importFrom: './PoissonSolver' },
  { name: 'sdf-collider', className: 'SDFPlugin', prop: 'sdf', implClass: 'SDFCollider', importFrom: './SDFCollider' },
  { name: 'verlet-ik', className: 'VerletPlugin', prop: 'verlet', implClass: 'VerletSolver', importFrom: './VerletSolver' },
  { name: 'xpbd', className: 'XPBDPlugin', prop: 'xpbd', implClass: 'XPBDSolver', importFrom: './XPBDSolver' }
];

for (const pkg of packages) {
  const pluginFile = path.join('packages', pkg.name, 'src', `${pkg.className}.ts`);
  const content = `import type { Scene, Plugin } from '@plutoengine/core';
import { ${pkg.implClass} } from '${pkg.importFrom}';

declare module '@plutoengine/core' {
  interface Scene {
    ${pkg.prop}?: ${pkg.implClass};
  }
}

/**
 * ${pkg.className}
 */
export class ${pkg.className} implements Plugin {
  public name = '${pkg.className}';

  constructor(private solver: ${pkg.implClass}) {}

  public install(scene: Scene): void {
    scene.${pkg.prop} = this.solver;
  }
}
`;
  fs.writeFileSync(pluginFile, content);

  const indexFile = path.join('packages', pkg.name, 'src', 'index.ts');
  let indexContent = fs.readFileSync(indexFile, 'utf8');
  indexContent += `export { ${pkg.className} } from './${pkg.className}';\n`;
  fs.writeFileSync(indexFile, indexContent);

  const packageJsonPath = path.join('packages', pkg.name, 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  pkgJson.dependencies = pkgJson.dependencies || {};
  pkgJson.dependencies['@plutoengine/core'] = 'workspace:*';
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
}
