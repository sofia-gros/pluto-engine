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
import { AnimationManager } from '../anim/AnimationManager';
import type { Plugin } from './Plugin';
import type { SceneManager } from './SceneManager';
import { Tilemap } from '../tilemap/Tilemap';
import { Camera } from './Camera';

export interface SceneProps {
  id?: string;
  maxInstances?: number;
  [key: string]: any;
}

export class Scene {
  public id = '';
  public scene!: SceneManager;
  public engine!: PlutoEngine;

  public arena!: InstanceBufferArena;
  public input!: InputManager;
  public load!: LoaderManager;
  public tweens!: TweenManager;
  public anim!: AnimationManager;

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
        throw new Error('アリーナの容量が上限に達しています。');
      }
      this.arena.posX[id] = x;
      this.arena.posY[id] = y;

      const sprite = new Sprite(id, this.arena);

      if (textureKey) {
        // Simple integration with loader cache (assumes 0 layer index for now if no texture array manager yet)
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
      Object.assign(this, props); // Bind extra props
    }
    this.arena = new InstanceBufferArena(maxInstances);
    this.input = new InputManager();
    this.load = new LoaderManager();
    this.tweens = new TweenManager(this.arena);
    this.anim = new AnimationManager(this.arena);
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
    this.update(dt);
    for (let i = 0; i < this._plugins.length; i++) {
      this._plugins[i].update?.(dt);
    }

    // Tilemap Culling
    const sw = this.engine.scale.width;
    const sh = this.engine.scale.height;
    for (let i = 0; i < this._tilemaps.length; i++) {
      this._tilemaps[i].updateCulling(this.camera, sw, sh);
    }

    // シーングラフ（親子階層）の更新
    // キャッシュ効率のため、ループを分けるかまとめますが、ここでは単純に回します。
    const arena = this.arena;
    const count = arena.capacity; // IDはcapacityまで使われる可能性がある（再利用など考慮して全配列スキャン）
    for (let i = 0; i < count; i++) {
      if (arena.active[i] === 0) continue;
      const pid = arena.parentId[i];
      if (pid !== -1 && arena.active[pid] !== 0) {
        // Simple position inheritance (no rotation inheritance in this basic version, or with rotation)
        const pr = arena.rotation[pid];
        const lx = arena.localX[i];
        const ly = arena.localY[i];

        if (pr !== 0.0) {
          const cosR = Math.cos(pr);
          const sinR = Math.sin(pr);
          arena.posX[i] = arena.posX[pid] + (lx * cosR - ly * sinR);
          arena.posY[i] = arena.posY[pid] + (lx * sinR + ly * cosR);
        } else {
          arena.posX[i] = arena.posX[pid] + lx;
          arena.posY[i] = arena.posY[pid] + ly;
        }
        arena.rotation[i] = arena.rotation[pid] + arena.localRotation[i];
      }
    }

    // ポインターイベントの処理
    const input = this.input;
    if (input.isPointerJustPressed()) {
      const worldX = this.scale.transformX(input.pointerX) + this.camera.x;
      const worldY = this.scale.transformY(input.pointerY) + this.camera.y;

      // 手前に描画されるものから逆順に判定する (簡略化のためIDの大きい順=後に生成された順を前面と仮定)
      for (let i = count - 1; i >= 0; i--) {
        if (arena.active[i] === 0 || arena.interactive[i] === 0) continue;

        const hw = arena.hitWidth[i] * arena.scale[i];
        const hh = arena.hitHeight[i] * arena.scale[i];
        if (hw <= 0 || hh <= 0) continue;

        // Originを中心と仮定
        const left = arena.posX[i] - hw / 2;
        const right = arena.posX[i] + hw / 2;
        const top = arena.posY[i] - hh / 2;
        const bottom = arena.posY[i] + hh / 2;

        if (worldX >= left && worldX <= right && worldY >= top && worldY <= bottom) {
          input.emit(i, 'pointerdown');
          // 一番上の要素のみクリック判定する場合は break;
          break;
        }
      }
    }
    if (input.isPointerJustReleased()) {
      const worldX = this.scale.transformX(input.pointerX) + this.camera.x;
      const worldY = this.scale.transformY(input.pointerY) + this.camera.y;
      for (let i = count - 1; i >= 0; i--) {
        if (arena.active[i] === 0 || arena.interactive[i] === 0) continue;
        const hw = arena.hitWidth[i] * arena.scale[i];
        const hh = arena.hitHeight[i] * arena.scale[i];
        if (hw <= 0 || hh <= 0) continue;
        const left = arena.posX[i] - hw / 2;
        const right = arena.posX[i] + hw / 2;
        const top = arena.posY[i] - hh / 2;
        const bottom = arena.posY[i] + hh / 2;
        if (worldX >= left && worldX <= right && worldY >= top && worldY <= bottom) {
          input.emit(i, 'pointerup');
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
