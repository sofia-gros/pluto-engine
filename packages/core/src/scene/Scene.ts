/**
 * @file Scene.ts
 * @description
 * 開発者が継承してゲームロジックを構築するためのベースクラス。
 */

import { InstanceBufferArena } from '../arena/InstanceBufferArena';
import { Sprite } from '../arena/Sprite';
import { Text, type TextStyle } from '../arena/Text';
import type { PlutoEngine } from '../core/PlutoEngine';
import { InputManager } from '../input/InputManager';
import { LoaderManager } from '../loader/LoaderManager';
import { mathHelpers } from '../math/Math';
import { TweenManager } from '../tween/TweenManager';
import type { Plugin } from './Plugin';
import type { SceneManager } from './SceneManager';

export class Scene {
  public key = '';
  public scene!: SceneManager;
  public engine!: PlutoEngine;

  public arena!: InstanceBufferArena;
  public input!: InputManager;
  public load!: LoaderManager;
  public tweens!: TweenManager;

  private _plugins: Plugin[] = [];

  public math = mathHelpers;

  public get scale() {
    return this.engine.scale;
  }

  public get time() {
    return this.engine.time;
  }

  public camera = {
    x: 0,
    y: 0,
    zoom: 1.0,
  };

  public readonly add = {
    sprite: (x = 0, y = 0, scale = 20): Sprite => {
      const id = this.arena.allocate();
      if (id === -1) {
        throw new Error('アリーナの容量が上限に達しています。');
      }
      this.arena.posX[id] = x;
      this.arena.posY[id] = y;
      this.arena.scale[id] = scale;
      return new Sprite(id, this.arena);
    },
    text: (x = 0, y = 0, text = '', style: TextStyle = {}): Text => {
      return new Text(x, y, text, style, this.arena);
    },
  };

  constructor(maxInstances = 100000) {
    this.arena = new InstanceBufferArena(maxInstances);
    this.input = new InputManager();
    this.load = new LoaderManager();
    this.tweens = new TweenManager(this.arena);
  }

  public init(): void {}
  public create(): void {}
  public update(dt: number): void {
    void dt;
  }
  public fixedUpdate(fixedDt: number): void {
    void fixedDt;
  }

  public sysInit(engine: PlutoEngine): void {
    this.engine = engine;
    this.init();
  }

  public sysCreate(): void {
    this.input.attach(window);
    this.create();
  }

  public sysUpdate(dt: number): void {
    this.input.update();
    this.tweens.update(dt);
    this.update(dt);
    for (let i = 0; i < this._plugins.length; i++) {
      this._plugins[i].update?.(dt);
    }
  }

  public sysFixedUpdate(fixedDt: number): void {
    this.fixedUpdate(fixedDt);
    for (let i = 0; i < this._plugins.length; i++) {
      this._plugins[i].fixedUpdate?.(fixedDt);
    }
  }

  public sysShutdown(): void {
    this.input.detach(window);
    for (let i = 0; i < this._plugins.length; i++) {
      this._plugins[i].destroy?.();
    }
    this._plugins.length = 0;
    this.arena.clear();
    this.tweens.clear();
    this.load.clear();
  }

  public registerPlugin(plugin: Plugin): this {
    if (plugin.init) {
      plugin.init(this);
    }
    this._plugins.push(plugin);
    return this;
  }
}
