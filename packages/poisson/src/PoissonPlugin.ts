import type { Scene, Plugin } from '@plutoengine/core';
import { PoissonSolver } from './PoissonSolver';

declare module '@plutoengine/core' {
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
