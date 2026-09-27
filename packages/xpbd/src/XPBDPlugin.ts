import type { Scene, Plugin } from '@plutoengine/core';
import { XPBDSolver } from './XPBDSolver';

declare module '@plutoengine/core' {
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
