import type { Scene, Plugin } from '@plutoengine/core';
import { UtilityAISystem } from './UtilityAISystem';

declare module '@plutoengine/core' {
  interface Scene {
    ai?: UtilityAISystem;
  }
}

/**
 * AIPlugin
 */
export class AIPlugin implements Plugin {
  public name = 'AIPlugin';

  constructor(private solver: UtilityAISystem) {}

  public init(scene: Scene): void {
    scene.ai = this.solver;
  }
}
