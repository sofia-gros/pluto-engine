/**
 * @file SoundPlugin.ts
 * @description
 * Scene にオーディオ機能を注入するプラグイン。
 * ユーザーは this.registerPlugin(new SoundPlugin()) として登録可能。
 */

import type { Plugin, Scene } from '@pluto-engine/core';
import { SoundManager } from './SoundManager';

export class SoundPlugin implements Plugin {
  public soundManager: SoundManager;

  private scene?: Scene;

  constructor(config?: any) {
    this.soundManager = new SoundManager(config);
  }

  public init(scene: Scene): void {
    this.scene = scene;
    (scene as any).sound = this.soundManager;
  }

  public update(): void {
    if (this.scene && this.scene.camera) {
      const cx = this.scene.camera.actualX || 0;
      const cy = this.scene.camera.actualY || 0;
      this.soundManager.setListenerPosition(cx, cy, 100);
    }
  }

  public destroy(): void {
    if (this.soundManager.context.state !== 'closed') {
      this.soundManager.context.close();
    }
  }
}
