/**
 * @file VerletPlugin.ts
 * @description
 * Verlet 積分を Scene へ遅延導入するプラグイン。
 *
 * ゼロコスト・サブシステムの方針に従い、
 * Scene 側は VerletPlugin を組み込まない限りソルバーを一切作りません。
 * 参照した時点で {@link Subsystem.Swarm} ビットが立ち、更新対象になります。
 */

import type { Scene, Plugin } from '@pluto-engine/core';
import { Subsystem } from '@pluto-engine/core';
import { VerletSolver } from './VerletSolver';
import { Tentacle, type TentacleOptions } from './Tentacle';

declare module '@pluto-engine/core' {
  interface Scene {
    verlet?: VerletSolver;
  }
}

export interface VerletPluginOptions {
  /** 配置できる最大節数 */
  maxPoints?: number;
  /** 最大距離拘束数 */
  maxConstraints?: number;
  /** 拘束解法の反復回数 */
  iterations?: number;
}

export class VerletPlugin implements Plugin {
  public readonly name = 'VerletPlugin';

  /** シーン側へ公開するソルバー。build() 後まで null です。 */
  public solver: VerletSolver | null = null;

  private _scene: Scene | null = null;

  constructor(private readonly options: VerletPluginOptions = {}) {}

  public init(scene: Scene): void {
    this._scene = scene;
  }

  /**
   * ソルバーを生成して Scene へ公開します。
   *
   * init() の時点ではまだ生成しません。ゲーム側が初めて
   * `scene.verlet` を参照した時点、あるいは `build()` を明示呼んだ時点で
   * 生成されます。
   */
  public build(): VerletSolver {
    if (this.solver === null) {
      this.solver = new VerletSolver(
        this.options.maxPoints ?? 1024,
        this.options.maxConstraints ?? 2048,
        this.options.iterations ?? 4,
      );
      if (this._scene !== null) {
        this._scene.verlet = this.solver as any;
        // Verlet は群集と同じ系統のサブシステムとして扱います。
        this._scene.markSubsystem(Subsystem.Swarm);
      }
    }
    return this.solver;
  }

  /**
   * 触手 (マントや揺れの演出用) を作ります。
   */
  public createTentacle(rootX: number, rootY: number, options: TentacleOptions = {}): Tentacle {
    return new Tentacle(this.build(), rootX, rootY, options);
  }

  public update(dt: number): void {
    this.solver?.update(dt);
  }
}
