import { Sprite } from '../arena/Sprite';
import { Text, type TextStyle } from '../arena/Text';

import type { PlutoEngine } from '../core/PlutoEngine';
import { InputManager } from '../input/InputManager';
import { LoaderManager } from '../loader/LoaderManager';
import { mathHelpers } from '../math/Math';
import { TweenManager } from '../tween/TweenManager';
import { AnimationManager } from '../anim/AnimationManager';
import type { Plugin } from './Plugin';
import type { SceneManager } from './SceneManager';
import { Tilemap } from '../tilemap/Tilemap';
import { Camera } from './Camera';
import { ParticleManager } from '../particles/ParticleManager';
import { ArcadePhysics } from '../physics/ArcadePhysics';
// Note: InstanceBufferArena is imported from engine or arena directly, here I'll use the one from ../arena/InstanceBufferArena
// But since we had InstanceBufferArena implicitly in the previous code, I'll import it.
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
        const asset = this.load.get(textureKey);
        if (asset && asset.type === 'spritesheet') {
          sprite.setTexture(asset, frameKey ?? 0);
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
    this.load = new LoaderManager();
    this.tweens = new TweenManager(this.arena);
    this.anim = new AnimationManager(this.arena);
    this.particles = new ParticleManager(maxInstances);
    this.physics = new ArcadePhysics(maxInstances);
    this.physics.init(this);
    this.camera = new Camera();
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
    this.particles.init(this);
    this.physics.init(this);
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

    // Hierarchy update
    const arena = this.arena;
    const count = arena.activeCount; // Dense array loop!
    for (let i = 0; i < count; i++) {
      const pid = arena.parentId[i];
      if (pid !== -1) {
        const pIdx = arena.idToIndex[pid];
        if (pIdx !== -1) {
          const pr = arena.rotation[pIdx];
          const lx = arena.localX[i];
          const ly = arena.localY[i];

          if (pr !== 0.0) {
            const cosR = Math.cos(pr);
            const sinR = Math.sin(pr);
            arena.posX[i] = arena.posX[pIdx] + (lx * cosR - ly * sinR);
            arena.posY[i] = arena.posY[pIdx] + (lx * sinR + ly * cosR);
          } else {
            arena.posX[i] = arena.posX[pIdx] + lx;
            arena.posY[i] = arena.posY[pIdx] + ly;
          }
          arena.rotation[i] = arena.rotation[pIdx] + arena.localRotation[i];
          arena.dirtyPos = true; // Mark dirty
        }
      }
    }

    // Input processing
    const input = this.input;
    if (input.isPointerJustPressed()) {
      const worldX = this.scale.transformX(input.pointerX) + this.camera.x;
      const worldY = this.scale.transformY(input.pointerY) + this.camera.y;

      for (let i = count - 1; i >= 0; i--) {
        if (arena.interactive[i] === 0) continue;

        const hw = arena.hitWidth[i] * arena.scale[i];
        const hh = arena.hitHeight[i] * arena.scale[i];
        if (hw <= 0 || hh <= 0) continue;

        const left = arena.posX[i] - hw / 2;
        const right = arena.posX[i] + hw / 2;
        const top = arena.posY[i] - hh / 2;
        const bottom = arena.posY[i] + hh / 2;

        if (worldX >= left && worldX <= right && worldY >= top && worldY <= bottom) {
          input.emit(arena.indexToId[i], 'pointerdown');
          break;
        }
      }
    }
    if (input.isPointerJustReleased()) {
      const worldX = this.scale.transformX(input.pointerX) + this.camera.x;
      const worldY = this.scale.transformY(input.pointerY) + this.camera.y;
      for (let i = count - 1; i >= 0; i--) {
        if (arena.interactive[i] === 0) continue;
        const hw = arena.hitWidth[i] * arena.scale[i];
        const hh = arena.hitHeight[i] * arena.scale[i];
        if (hw <= 0 || hh <= 0) continue;
        const left = arena.posX[i] - hw / 2;
        const right = arena.posX[i] + hw / 2;
        const top = arena.posY[i] - hh / 2;
        const bottom = arena.posY[i] + hh / 2;
        if (worldX >= left && worldX <= right && worldY >= top && worldY <= bottom) {
          input.emit(arena.indexToId[i], 'pointerup');
          break;
        }
      }
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
    for (let i = 0; i < this._tilemaps.length; i++) {
      this._tilemaps[i].destroy();
    }
    this._tilemaps.length = 0;
    this.physics.clear();
    this.particles.destroy();
    this.arena.clear();
    this.tweens.clear();
    this.anim.clear();
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
