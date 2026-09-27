/**
 * @file SoundPlugin.ts
 * @description
 * Scene にオーディオ機能を注入するプラグイン。
 * ユーザーは this.registerPlugin(new SoundPlugin()) として登録可能。
 */

import type { Plugin, Scene } from '@plutoengine/core';
import { SoundManager } from './SoundManager';

export class SoundPlugin implements Plugin {
  public soundManager: SoundManager;

  constructor() {
    this.soundManager = new SoundManager();
  }

  public init(scene: Scene): void {
    // Scene に soundManager を動的に生やすか、Plugin 側からアクセスさせる
    (scene as any).sound = this.soundManager;
  }

  public destroy(): void {
    if (this.soundManager.context.state !== 'closed') {
      this.soundManager.context.close();
    }
  }
}
