/**
 * @file SoundPlugin.ts
 * @description
 * Scene にオーディオ機能を注入するプラグイン。
 *
 * `Scene.sound` が遅延サブシステムとして組み込まれたため、このプラグインは
 * SoundManager の生成-timing と 3D 配置の追従だけを担当します。
 * 既存の `this.registerPlugin(new SoundPlugin())` はそのまま動作します。
 */

import type { Plugin, Scene } from '@pluto-engine/core';
import { SoundManager } from './SoundManager';

export class SoundPlugin implements Plugin {
  public soundManager: SoundManager;

  private scene?: Scene;

  constructor(config?: ConstructorParameters<typeof SoundManager>[0]) {
    this.soundManager = new SoundManager(config);
  }

  public init(scene: Scene): void {
    this.scene = scene;
    // Scene の遅延サブシステムへ同じインスタンスを渡します。
    // どちらから触っても AudioContext が 2 つできることはありません。
    scene.setSoundManager(this.soundManager);
  }

  public update(): void {
    if (this.scene === undefined) return;
    // カメラ位置にリスナーを追従させます。
    this.soundManager.setListenerPosition(
      this.scene.camera.actualX || 0,
      this.scene.camera.actualY || 0,
      100,
    );
    // フェードインを進めます。
    this.soundManager.update();
  }

  public destroy(): void {
    this.soundManager.destroy();
  }
}
