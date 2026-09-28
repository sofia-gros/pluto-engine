import { Sprite } from '../arena/Sprite';
import { Text, type TextStyle } from '../arena/Text';

import type { PlutoEngine } from '../core/PlutoEngine';
import { InputManager } from '../input/InputManager';
import { LoaderManager } from '../loader/LoaderManager';
import { TextureManager } from '../loader/TextureManager';
import { mathHelpers } from '../math/Math';
import { TweenManager } from '../tween/TweenManager';
import { AnimationManager } from '../anim/AnimationManager';
import type { Plugin } from './Plugin';
import type { SceneManager } from './SceneManager';
import { Tilemap } from '../tilemap/Tilemap';
import { Camera } from './Camera';
import { ParticleManager } from '../particles/ParticleManager';
import { ArcadePhysics } from '../physics/ArcadePhysics';
import { InstanceBufferArena as ArenaClass } from '../arena/InstanceBufferArena';

export interface SceneProps {
  id?: string;
  maxInstances?: number;
  [key: string]: any;
}

export class Scene {
  public id = '';
  public scene!: SceneManager;
  public engine!: PlutoEngine;

  public arena!: ArenaClass;
  public input!: InputManager;
  public load!: LoaderManager;
  public textures!: TextureManager;
  public tweens!: TweenManager;
  public anim!: AnimationManager;
  public particles!: ParticleManager;
  public physics!: ArcadePhysics;

  public camera: Camera;

  private _plugins: Plugin[] = [];
  private _tilemaps: Tilemap[] = [];

  public math = mathHelpers;

  public get scale() {
    return this.engine.scale;
  }

  public get time() {
    return this.engine.time;
  }

  public readonly add = {
    sprite: (x = 0, y = 0, textureKey?: string, frameKey?: string | number): Sprite => {
      const id = this.arena.allocate();
      if (id === -1) {
        throw new Error('アリーナの容量に到達しました。');
      }
      const idx = this.arena.idToIndex[id];
      this.arena.posX[idx] = x;
      this.arena.posY[idx] = y;
      this.arena.dirtyPos = true;

      const sprite = new Sprite(id, this.arena);

      if (textureKey) {
        const tex = this.textures.get(textureKey) || this.load.get(textureKey);
        if (tex) {
          sprite.setTexture(tex, frameKey ?? 0);
        }
      }
      return sprite;
    },
    text: (x = 0, y = 0, text = '', style: TextStyle = {}): Text => {
      return new Text(x, y, text, style, this.arena);
    },
    tilemap: (mapData: any, tileSize = 32): Tilemap => {
      const tm = new Tilemap(this.arena, mapData, tileSize);
      this._tilemaps.push(tm);
      return tm;
    },
  };

  constructor(props: SceneProps | string = {}) {
    let maxInstances = 100000;
    if (typeof props === 'string') {
      this.id = props;
    } else {
      this.id = props.id || this.constructor.name;
      maxInstances = props.maxInstances ?? 100000;
      Object.assign(this, props);
    }
    this.arena = new ArenaClass(maxInstances);
    this.input = new InputManager();
    this.textures = new TextureManager();
    this.load = new LoaderManager(this.textures);
    this.tweens = new TweenManager(this.arena);
    this.anim = new AnimationManager(this.arena);
    this.particles = new ParticleManager(maxInstances);
    this.physics = new ArcadePhysics(maxInstances);
    this.physics.init(this);
    this.camera = new Camera();
  }

  public preload(): void {}
  public init(): void {}
  public create(): void {}
  public update(dt: number): void {
    void dt;
  }
  public fixedUpdate(fixedDt: number): void {
    void fixedDt;
  }
  public shutdown(): void {}

  public sysShutdown(): void {
    this.shutdown();
    for (let i = 0; i < this._plugins.length; i++) {
      this._plugins[i].destroy?.();
    }
  }

  public sysInit(engine: PlutoEngine): void {
    this.engine = engine;
    if (engine.device) {
      this.textures.setDevice(engine.device);
    }
    this.particles.init(this);
    this.physics.init(this);
    this.preload();
    this.init();
  }

  public sysCreate(): void {
    this.input.attach(window);
    this.create();
  }

  public sysUpdate(dt: number): void {
    this.camera.update(dt);
    this.input.update();
    this.tweens.update(dt);
    this.anim.update(dt);
    this.particles.update(dt);
    this.physics.update(dt);
    this.physics.collide();
    this.update(dt);
    for (let i = 0; i < this._plugins.length; i++) {
      this._plugins[i].update?.(dt);
    }

    const sw = this.engine?.scale?.width ?? 800;
    const sh = this.engine?.scale?.height ?? 600;
    for (let i = 0; i < this._tilemaps.length; i++) {
      this._tilemaps[i].updateCulling(this.camera, sw, sh);
    }
  }

  public sysFixedUpdate(fixedDt: number): void {
    this.fixedUpdate(fixedDt);
    for (let i = 0; i < this._plugins.length; i++) {
      this._plugins[i].fixedUpdate?.(fixedDt);
    }
  }

  public registerPlugin(plugin: Plugin): void {
    this._plugins.push(plugin);
    plugin.init?.(this);
  }
}
