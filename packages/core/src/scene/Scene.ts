import { Sprite } from '../arena/Sprite';
import { Text, type TextStyle } from '../arena/Text';
import { FontAtlas, type FontAtlasOptions } from '../text/FontAtlas';

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
import { Subsystem } from './SubsystemMask';
import { EventEmitter } from '../events/EventEmitter';
import { DataRegistry } from '../events/DataRegistry';

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

  /** シーン内イベントバス */
  public readonly events = new EventEmitter();
  /**
   * SceneManager に登録されるまでは自分専用のストアを使います。
   * SceneManager 経由のシーンでは、全シーンで 1 つのストアを共有します。
   */
  private readonly _ownRegistry = new DataRegistry();

  public camera: Camera;

  private _plugins: Plugin[] = [];
  private _tilemaps: Tilemap[] = [];
  private _paused = false;

  // --- ゼロコスト・サブシステム ---
  // 各マネージャーは初回の参照時にだけ生成され、その参照で
  // `_active` の対応ビットが立ちます。sysUpdate は 1 回の AND で
  // 未使用分をまとめてスキップします。
  private _active = Subsystem.Sprites | Subsystem.Camera;
  private _tweens: TweenManager | null = null;
  private _anim: AnimationManager | null = null;
  private _particles: ParticleManager | null = null;
  private _physics: ArcadePhysics | null = null;

  /**
   * ビットマスク。初期化済みのサブシステムのみが立ちます。
   * ここに無いものは更新ループから丸ごと除外されます。
   */
  public get activeSubsystems(): number {
    return this._active;
  }

  /**
   * サブシステムが初期化済みかどうかを返します。
   */
  public hasSubsystem(bit: number): boolean {
    return (this._active & bit) !== 0;
  }

  /**
   * サブシステムを有効化します。
   *
   * プラグインが自分のサブシステムを登録するために使います。
   * Plugin は自前で update を定義してもよいですが、
   * ビットを立てておけばプロファイラで有効状態が可視化されます。
   */
  public markSubsystem(bit: number): void {
    this._active |= bit;
  }

  /**
   * サブシステム {@link this.tweens} (遅延生成)
   */
  public get tweens(): TweenManager {
    if (this._tweens === null) {
      this._tweens = new TweenManager(this.arena);
      this._active |= Subsystem.Tweens;
    }
    return this._tweens;
  }

  /**
   * サブシステム {@link this.anim} (遅延生成)
   */
  public get anim(): AnimationManager {
    if (this._anim === null) {
      this._anim = new AnimationManager(this.arena);
      this._active |= Subsystem.Anims;
      this.arena.animTracker = this._anim;
    }
    return this._anim;
  }

  /**
   * サブシステム {@link this.particles} (遅延生成)
   */
  public get particles(): ParticleManager {
    if (this._particles === null) {
      this._particles = new ParticleManager(this.arena.capacity);
      this._particles.init(this);
      this._active |= Subsystem.Particles;
    }
    return this._particles;
  }

  /**
   * サブシステム {@link this.physics} (遅延生成)
   */
  public get physics(): ArcadePhysics {
    if (this._physics === null) {
      this._physics = new ArcadePhysics(this.arena.capacity);
      this._physics.init(this);
      this._active |= Subsystem.Physics;
    }
    return this._physics;
  }

  /** ポインタヒットテストの結果を受け取るバッファ (毎フレーム new しない) */
  public readonly _hitBuffer = new Int32Array(64);
  /** 生成済みフォントアトラス。作成は初期化時のみです。 */
  private readonly _fonts = new Map<string, FontAtlas>();

  public math = mathHelpers;

  /**
   * 全部シーンで共有されるグローバルデータストア。
   * SceneManager に載っていない単独シーンでは、自分専用のストアを返します。
   */
  public get registry(): DataRegistry {
    return this.scene?.registry ?? this._ownRegistry;
  }

  public get scale() {
    return this.engine.scale;
  }

  public get time() {
    return this.engine.time;
  }

  /** アニメーション名 {@link this.anim} の別名 (Phaser 互換) */
  public get anims(): AnimationManager {
    return this.anim;
  }

  /**
   * フォントアトラスを生成し、Text から参照できるようにします。
   *
   * 生成は 1 度だけで、以降は Text.setGlyphSource() へ渡して再利用できます。
   *
   * @param key アトラスのキャッシュキー
   */
  public createFont(key = 'default', options: FontAtlasOptions = {}): FontAtlas | null {
    const existing = this._fonts.get(key);
    if (existing) return existing;
    const device = this.engine?.device;
    if (!device) return null;
    const atlas = new FontAtlas(device, key, options);
    this._fonts.set(key, atlas);
    return atlas;
  }

  /**
   * 登録済みフォントを取得します。
   */
  public getFont(key = 'default'): FontAtlas | null {
    return this._fonts.get(key) ?? null;
  }

  /**
   * テキストを生成します。
   * 指定したフォントアトラスが存在する場合は自動で接続します。
   *
   * @param fontKey createFont() で登録したキー
   */
  public addText(
    x: number,
    y: number,
    text: string,
    style: TextStyle = {},
    fontKey = 'default',
  ): Text {
    const instance = new Text(x, y, text, style, this.arena);
    const atlas = this.getFont(fontKey);
    if (atlas) instance.setGlyphSource(atlas);
    return instance;
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
      this._active |= Subsystem.Tilemap;
      return tm;
    },
    /**
     * Group a batch of display objects under a parent.
     * Parent-child transforms are resolved on the SoA scene graph.
     */
    container: (x = 0, y = 0, children: Sprite[] = []): Sprite => {
      const parent = this.add.sprite(x, y);
      this._active |= Subsystem.Sprites;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        // Children's coordinates become relative to the container.
        child.x = child.x - x;
        child.y = child.y - y;
        child.setParentId(parent.id);
      }
      return parent;
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

  public setPaused(paused: boolean): void {
    this._paused = paused;
  }

  public get paused(): boolean {
    return this._paused;
  }

  public sysShutdown(): void {
    this.shutdown();
    // 入力リスナを必ず外す。シーン遷移で溜まると同じ関数が多重登録される。
    this.input.detach();
    for (let i = 0; i < this._plugins.length; i++) {
      this._plugins[i].destroy?.();
    }
  }

  public sysInit(engine: PlutoEngine): void {
    this.engine = engine;
    if (engine.device) {
      this.textures.setDevice(engine.device);
    }
    this.preload();
    this.init();
  }

  public sysCreate(): void {
    this.input.attach(window);
    // 画面座標をゲーム座標へ変換する関数を渡す (ScaleManager が提供)
    this.input.pointerTransform = (clientX, clientY, out) => {
      this.engine.scale.transform(clientX, clientY, out);
    };
    this.create();
  }

  public sysUpdate(dt: number): void {
    if (this._paused) return;

    // Subsystems not yet initialized are skipped by a single bitwise AND.
    // The cost of an unused subsystem is one AND, not a virtual call.
    const active = this._active;

    if ((active & Subsystem.Camera) !== 0) this.camera.update(dt);
    this.input.update();
    if ((active & Subsystem.Tweens) !== 0) this._tweens!.update(dt);
    if ((active & Subsystem.Anims) !== 0) this._anim!.update(dt);
    if ((active & Subsystem.Particles) !== 0) this._particles!.update(dt);
    if ((active & Subsystem.Physics) !== 0) {
      this._physics!.update(dt);
      this._physics!.collide();
    }
    this.update(dt);
    for (let i = 0; i < this._plugins.length; i++) {
      this._plugins[i].update?.(dt);
    }

    // 階層を持つエンティティのワールド変換を解決する。
    // 階層を 1 体も使っていない場合はこの経路を丸ごと省略する。
    if (this.arena.hasHierarchy && this.arena.dirtyHierarchy) {
      this.arena.computeWorldTransforms();
      this.arena.dirtyHierarchy = false;
    }

    if ((active & Subsystem.Tilemap) !== 0) {
      const sw = this.engine?.scale?.width ?? 800;
      const sh = this.engine?.scale?.height ?? 600;
      const maps = this._tilemaps;
      for (let i = 0; i < maps.length; i++) {
        maps[i].updateCulling(this.camera, sw, sh);
      }
    }
  }

  public sysFixedUpdate(fixedDt: number): void {
    if (this._paused) return;
    this.fixedUpdate(fixedDt);
    for (let i = 0; i < this._plugins.length; i++) {
      this._plugins[i].fixedUpdate?.(fixedDt);
    }
  }

  public registerPlugin(plugin: Plugin): void {
    this._plugins.push(plugin);
    plugin.init?.(this);
  }

  /**
   * 現在のポインタ位置にあるエンティティの ID を返します。
   * 手前のエンティティを優先し、1 つも無ければ -1 を返します。
   */
  public pickTop(): number {
    const n = this.arena.hitTest(this.input.pointerX, this.input.pointerY, this._hitBuffer);
    return n > 0 ? this._hitBuffer[0] : -1;
  }

  /**
   * ポインタ位置にあるエンティティの ID を返します (重複を許容)。
   * 結果は `out` に書き込まれ、ヒット数が返ります。
   */
  public pickAll(out: Int32Array): number {
    return this.arena.hitTest(this.input.pointerX, this.input.pointerY, out);
  }
}
