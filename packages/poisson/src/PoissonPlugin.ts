import type { Scene, Plugin } from '@pluto-engine/core';
import { PoissonSolver } from './PoissonSolver';

declare module '@pluto-engine/core' {
  interface Scene {
    poisson?: PoissonSolver;
  }
}

/**
 * PoissonPlugin
 */
export class PoissonPlugin implements Plugin {
  public name = 'PoissonPlugin';

  constructor(private solver: PoissonSolver) {}

  public init(scene: Scene): void {
    scene.poisson = this.solver;
  }
}
