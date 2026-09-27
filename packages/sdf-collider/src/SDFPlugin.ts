import type { Scene, Plugin } from '@plutoengine/core';
import { SDFCollider } from './SDFCollider';

declare module '@plutoengine/core' {
  interface Scene {
    sdf?: SDFCollider;
  }
}

/**
 * SDFPlugin
 */
export class SDFPlugin implements Plugin {
  public name = 'SDFPlugin';

  constructor(private solver: SDFCollider) {}

  public init(scene: Scene): void {
    scene.sdf = this.solver;
  }
}
