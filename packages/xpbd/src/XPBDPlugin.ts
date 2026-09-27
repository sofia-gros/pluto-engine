import type { Scene, Plugin } from '@pluto-engine/core';
import { XPBDSolver } from './XPBDSolver';

declare module '@pluto-engine/core' {
  interface Scene {
    xpbd?: XPBDSolver;
  }
}

/**
 * XPBDPlugin
 */
export class XPBDPlugin implements Plugin {
  public name = 'XPBDPlugin';

  constructor(private solver: XPBDSolver) {}

  public init(scene: Scene): void {
    scene.xpbd = this.solver;
  }
}
