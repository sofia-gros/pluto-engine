import type { Scene, Plugin } from '@plutoengine/core';
import { VerletSolver } from './VerletSolver';

declare module '@plutoengine/core' {
  interface Scene {
    verlet?: VerletSolver;
  }
}

/**
 * VerletPlugin
 */
export class VerletPlugin implements Plugin {
  public name = 'VerletPlugin';

  constructor(private solver: VerletSolver) {}

  public init(scene: Scene): void {
    scene.verlet = this.solver;
  }
}
