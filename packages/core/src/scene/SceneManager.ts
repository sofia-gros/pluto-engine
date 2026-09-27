/**
 * @file SceneManager.ts
 * @description
 * 複数の Scene を管理し、シーンの遷移を制御する。
 */

import type { PlutoEngine } from '../core/PlutoEngine';
import type { Scene } from './Scene';

export class SceneManager {
  private _scenes = new Map<string, Scene>();
  private _activeScene: Scene | null = null;
  private _engine: PlutoEngine;

  constructor(engine: PlutoEngine) {
    this._engine = engine;
  }

  public add(key: string, sceneClass: new () => Scene, autoStart = false): void {
    const scene = new sceneClass();
    scene.key = key;
    scene.scene = this;
    this._scenes.set(key, scene);

    if (autoStart) {
      this.start(key);
    }
  }

  public start(key: string): void {
    const scene = this._scenes.get(key);
    if (!scene) throw new Error(`Scene ${key} not found.`);

    this._activeScene = scene;
    scene.sysInit(this._engine);
    scene.sysCreate();
  }

  public switch(key: string): void {
    if (this._activeScene) {
      this._activeScene.sysShutdown();
    }
    this.start(key);
  }

  public get activeScene(): Scene | null {
    return this._activeScene;
  }
}
