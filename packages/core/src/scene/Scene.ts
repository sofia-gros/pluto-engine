import { Container } from '../arena/Container';
import { Group } from '../arena/Group';
import { Sprite } from '../arena/Sprite';
import { Text, type TextStyle } from '../arena/Text';
import { FontAtlas, type FontAtlasOptions } from '../text/FontAtlas';

import { AnimationManager } from '../anim/AnimationManager';
import { BitmapFontGlyphSource } from '../arena/BitmapFontGlyphSource';
import { InstanceBufferArena as ArenaClass } from '../arena/InstanceBufferArena';
import { ShapeKind, ShapeManager } from '../arena/Shape';
import type { PlutoEngine } from '../core/PlutoEngine';
import { DataRegistry } from '../events/DataRegistry';
import { EventEmitter } from '../events/EventEmitter';
import { InputManager } from '../input/InputManager';
import type { ParsedBitmapFont } from '../loader/BitmapFontParser';
import { LoaderManager } from '../loader/LoaderManager';
import { TextureManager } from '../loader/TextureManager';
import { mathHelpers } from '../math/Math';
import { type EmitterCreateConfig, ParticleManager } from '../particles/ParticleManager';
import { ArcadePhysics } from '../physics/ArcadePhysics';
import { Body } from '../physics/Body';
import { World } from '../physics/World';
import { SoundManager } from '../sound/SoundManager';
import { Tilemap } from '../tilemap/Tilemap';
import { TimeFacade } from '../time/TimeFacade';
import { TweenManager } from '../tween/TweenManager';
import type { Camera } from './Camera';
import { CameraManager } from './CameraManager';
import type { Plugin } from './Plugin';
import type { SceneManager } from './SceneManager';
import { Subsystem } from './SubsystemMask';

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

  /**
   * カメラ管理 (Phaser 互換の this.cameras)。
   */
  public cameras!: CameraManager;
  /**
   * メインカメラ (this.cameras.main の別名)。
   * 既存のコードとの互換のために残しています。
   */
  public camera!: Camera;

  private _plugins: Plugin[] = [];
  private _tilemaps: Tilemap[] = [];
  private _paused = false;
  /** `this.time` の Phaser 互換门面。初回参照時に 1 度だけ生成します。 */
  private _timeFacade: TimeFacade | null = null;
  /** `this.world` の Flyweight。初回参照時に 1 度だけ生成します。 */
  private _world: World | null = null;
  /** Body ハンドルのキャッシュ。疎添字 ID -> Body。 */
  private readonly _bodyHandles = new Map<number, Body>();
  /** Container ハンドルのキャッシュ。疎添字 ID -> Container。 */
  private readonly _containerHandles = new Map<number, Container>();

  // --- ゼロコスト・サブシステム ---
  // 各マネージャーは初回の参照時にだけ生成され、その参照で
  // `_active` の対応ビットが立ちます。sysUpdate は 1 回の AND で
  // 未使用分をまとめてスキップします。
  private _active = Subsystem.Sprites | Subsystem.Camera;
  private _tweens: TweenManager | null = null;
  private _anim: AnimationManager | null = null;
  private _particles: ParticleManager | null = null;
  private _physics: ArcadePhysics | null = null;
  private _sound: SoundManager | null = null;

  // --- カメラの追従対象 ---
  // sysUpdate() の先頭でカメラへ渡すため、値を保持しておきます。
  // -1 は「追従なし」を表します。
  private _followId = -1;
  private _followX = -1;
  private _followY = -1;

  /**
   * カメラの追従対象を設定します。
   *
   * 既存の startFollow(target) を使う場合は ID だけで十分ですが、
   * ワールド座標を明示したい場合はこちらを使います。
   *
   * @param id 追従対象の ID (-1 で解除)
   * @param x 追従対象の世界座標 X
   * @param y 追従対象の世界座標 Y
   */
  public setCameraFollowTarget(id: number, x: number, y: number): void {
    this._followId = id;
    this._followX = x;
    this._followY = y;
  }

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
   * サブシステム {@link this.sound} (遅延生成)
   *
   * 初回参照時に SoundManager を生成し、Subsystem.Sound のビットを立てます。
   *  SoundManager はコンストラクタで AudioContext を 1 つだけ作るため、
   * シーン 1 あたり 1 回しか生成されません。
   *
   * @param config 初期化時に反映する構成値
   */
  public get sound(): SoundManager {
    if (this._sound === null) {
      this._sound = new SoundManager();
      this._active |= Subsystem.Sound;
    }
    return this._sound;
  }

  /**
   * 外部で生成した SoundManager を差し込みます。
   *
   * プラグイン (SoundPlugin) が SoundManager を自前で持つ場合に、
   * Scene の遅延サブシステムと二重に作らないために使います。
   * ビットをここで立てるので、毎フレームの update も確実に走ります。
   */
  public setSoundManager(manager: SoundManager): void {
    this._sound = manager;
    this._active |= Subsystem.Sound;
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

  /**
   * Sprite.body が Body ハンドルを取得できるようにファクトリを登録します。
   *
   * Sprite は Scene 参照を持たないため、アリーナ経由で注入します。
   * 実体は {@link Scene.getBody} でキャッシュされます。
   */
  private _ensureBodyFactory(): void {
    if (this.arena.bodyFactory !== null) return;
    this.arena.bodyFactory = (entityId: number) => this.getBodyById(entityId);
  }

  /**
   * 物理ワールド (Phaser 互換の `scene.physics.world`)。
   *
   * シーン全体で 1 つだけ生成されます。境界矩形と重力は
   * {@link this.physics} のスカラーが正本です。
   */
  public get world(): World {
    return (this._world ??= new World(this.physics));
  }

  /**
   * スプライトの物理ボディを取得します (Phaser 互換の `sprite.body`)。
   *
   * ハンドルなので毎フレーム new しません。同じ ID なら同じ
   * インスタンスを返します。
   *
   * @param target 物理ボディを取得したいスプライト
   */
  public getBody(target: { readonly id: number }): Body {
    return this.getBodyById(target.id);
  }

  /**
   * 疎添字 ID から Body ハンドルを取得します。
   * 内部でキャッシュし、同じ ID なら同じインスタンスを返します。
   */
  public getBodyById(entityId: number): Body {
    this._ensureBodyFactory();
    let b = this._bodyHandles.get(entityId);
    if (b === undefined) {
      b = new Body(entityId, this.physics);
      this._bodyHandles.set(entityId, b);
    }
    return b;
  }

  /**
   * コンテナハンドル (Phaser 互換の `sprite` を `Container` で包む) を取得します。
   * キャッシュするため、同じ ID なら毎回同じインスタンスを返します。
   */
  public getContainer(entityId: number): Container {
    let c = this._containerHandles.get(entityId);
    if (c === undefined) {
      c = new Container(entityId, this.arena);
      this._containerHandles.set(entityId, c);
    }
    return c;
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

  /**
   * エンジン本体への参照 (Phaser 互換の this.game)。
   */
  public get game(): PlutoEngine {
    return this.engine;
  }

  /**
   * シーン管理への参照 (Phaser 互換の this.scene)。
   * コンストラクタ内で代入される Field として保持します。
   */
  public get scenePlugin(): SceneManager {
    return this.scene;
  }

  /**
   * エンジン全体の時間 API。Scene 単位ではありません。
   *
   * Phaser 互換の门面を別クラスに切り出しており、実体は
   * {@link this.engine.time} の TimeStepManager です。
   */
  public get time(): TimeFacade {
    return (this._timeFacade ??= new TimeFacade(this.engine.time));
  }

  /**
   * Phaser 互換のアニメーション门面 (実体は {@link this.anim})。
   *
   * `play` / `playReverse` が AnimState ハンドルを返す点が異なります。
   */
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
      this.arena.setPosX(idx, x);
      this.arena.setPosY(idx, y);

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
     * 複数の表示オブジェクトを親の下へまとめます (Phaser 互換の `add.container`)。
     *
     * 親子変換は SoA のシーングラフで解決されます。
     * 返り値は Container Flyweight で、own property は id と _arena の 2 個だけです。
     */
    container: (x = 0, y = 0, children: Sprite[] = []): Container => {
      const parentSprite = this.add.sprite(x, y);
      this._active |= Subsystem.Sprites;
      const parent = this.getContainer(parentSprite.id);
      for (let i = 0; i < children.length; i++) {
        parent.add(children[i].id);
      }
      return parent;
    },
    /**
     * 静的な画像を生成します (Phaser 互換の this.add.image)。
     *
     * 内部は sprite と同一です。pluto-engine の Flyweight 設計では
     * 画像もスプライトも同じアリーナ上の 1 スロットで表現されます。
     */
    image: (x = 0, y = 0, textureKey?: string, frameKey?: string | number): Sprite => {
      return this.add.sprite(x, y, textureKey, frameKey);
    },
    /**
     * グループを生成します (Phaser 互換の `add.group`)。
     *
     * Group は SoA 化せず、使い回し `Array` で実装します (判定 D)。
     * アリーナは汚さず、「CPU 管理のビュー」として並行して持ちます。
     */
    group: (children: Sprite[] = []): Group => {
      const g = new Group();
      g.addMultiple(children);
      return g;
    },
    /**
     * パーティクルエミッターを生成します (Phaser 互換の `add.particles`)。
     *
     * `textureKey` を渡すと各粒子にそのテクスチャを設定します。
     * Particles subsystem を有効化するため `Subsystem.Particles` を立てます。
     */
    particles: (
      x = 0,
      y = 0,
      textureKey: string | undefined = undefined,
      config: EmitterCreateConfig = {},
    ) => {
      const emitter = this.particles.create({ x, y, ...config });
      if (emitter === null) return null;
      if (textureKey) {
        const tex = this.textures.get(textureKey) || this.load.get(textureKey);
        if (tex) emitter.setTexture(tex);
      }
      return emitter;
    },
    /**
     * ビットマップフォントのテキストを生成します
     * (Phaser 互換の `add.bitmapText`)。
     *
     * BMFont (AngelCode) の解析結果と、ページ画像のテクスチャキーを受け取ります。
     * ページ画像は TextureManager に登録済みである必要があります
     * （未登録の場合はアトラス全体を 1 文字 1 クイッドとして描画するフォールバックになります）。
     *
     * 返り値は {@link Text} と同じ arena 上のオブジェクトです。
     */
    bitmapText: (x = 0, y = 0, text = '', font: ParsedBitmapFont, pageKey?: string) => {
      const t = new Text(
        x,
        y,
        text,
        { fontSize: font.size, lineSpacing: font.lineHeight },
        this.arena,
      );
      t.setGlyphSource(new BitmapFontGlyphSource(font, this.textures.get(pageKey ?? '')));
      return t;
    },
  };

  /**
   * 静的シェイプを生成します (Phaser 互換の `add.rectangle` ほか)。
   *
   * シェイプは canvas にベイクしてテクスチャ化します。同じ寸法は
   * 1 枚しかベイクされないため、多数生成しても GPU レイヤーは増えません。
   *
   * 返り値は形状 ID (`ShapeManager` のインデックス) で、
   * Sprite と同じアarena 上に存在します。
   *
   * **注意**: `add.graphics` (動的 command buffer) は却下 (E-02) です。
   * 現在のシェイプは生成時に確定する静的形状のみです。
   */
  private _addShape(
    kind: number,
    width: number,
    height: number,
    aux2: number,
    aux3: number,
    color: number,
    alpha: number,
  ): number {
    const shapes = (this._shapes ??= new ShapeManager(this.arena, (key, canvas) =>
      this.textures.addCanvas(key, canvas),
    ));
    return shapes.add(kind, width, height, aux2, aux3, color, alpha);
  }

  /** 矩形 (Phaser 互換の `add.rectangle`) */
  public addRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    color = 0xffffff,
    alpha = 1,
  ): number {
    const id = this._addShape(ShapeKind.Rectangle, width, height, 0, 0, color, alpha);
    if (id >= 0) this._setShapePos(id, x, y);
    return id;
  }

  /** 円 (Phaser 互換の `add.circle`) */
  public addCircle(x: number, y: number, radius: number, color = 0xffffff, alpha = 1): number {
    const id = this._addShape(ShapeKind.Circle, radius * 2, radius * 2, 0, 0, color, alpha);
    if (id >= 0) this._setShapePos(id, x, y);
    return id;
  }

  /** 楕円 (Phaser 互換の `add.ellipse`) */
  public addEllipse(
    x: number,
    y: number,
    width: number,
    height: number,
    color = 0xffffff,
    alpha = 1,
  ): number {
    const id = this._addShape(ShapeKind.Ellipse, width, height, 0, 0, color, alpha);
    if (id >= 0) this._setShapePos(id, x, y);
    return id;
  }

  /** 三角形 (Phaser 互換の `add.triangle`) */
  public addTriangle(
    x: number,
    y: number,
    width: number,
    height: number,
    color = 0xffffff,
    alpha = 1,
  ): number {
    const id = this._addShape(ShapeKind.Triangle, width, height, 0, 0, color, alpha);
    if (id >= 0) this._setShapePos(id, x, y);
    return id;
  }

  /** 星形 (Phaser 互換の `add.star`) */
  public addStar(
    x: number,
    y: number,
    points: number,
    radius: number,
    innerRadius = radius / 2,
    color = 0xffffff,
    alpha = 1,
  ): number {
    const id = this._addShape(
      ShapeKind.Star,
      radius * 2,
      radius * 2,
      points,
      innerRadius / radius,
      color,
      alpha,
    );
    if (id >= 0) this._setShapePos(id, x, y);
    return id;
  }

  /** 角丸矩形 (Phaser 互換の `add.roundRect` / `add.roundrect`) */
  public addRoundRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius = 8,
    color = 0xffffff,
    alpha = 1,
  ): number {
    const id = this._addShape(ShapeKind.RoundRect, width, height, radius, 0, color, alpha);
    if (id >= 0) this._setShapePos(id, x, y);
    return id;
  }

  /** 線 (Phaser 互換の `add.line`) */
  public addLine(
    x: number,
    y: number,
    length: number,
    lineWidth = 1,
    color = 0xffffff,
    alpha = 1,
  ): number {
    const id = this._addShape(ShapeKind.Line, length, lineWidth, lineWidth, 0, color, alpha);
    if (id >= 0) this._setShapePos(id, x, y);
    return id;
  }

  /** 格子 (Phaser 互換の `add.grid`) */
  public addGrid(
    x: number,
    y: number,
    cellWidth: number,
    cellHeight: number,
    cells = 2,
    lineWidth = 1,
    color = 0xffffff,
    alpha = 1,
  ): number {
    const id = this._addShape(
      ShapeKind.Grid,
      cellWidth * cells,
      cellHeight * cells,
      cells,
      lineWidth,
      color,
      alpha,
    );
    if (id >= 0) this._setShapePos(id, x, y);
    return id;
  }

  /** 等角三角形 (Phaser 互換の `add.isotriangle`) */
  public addIsoTriangle(
    x: number,
    y: number,
    width: number,
    height: number,
    color = 0xffffff,
    alpha = 1,
  ): number {
    const id = this._addShape(ShapeKind.IsoTriangle, width, height, 0, 0, color, alpha);
    if (id >= 0) this._setShapePos(id, x, y);
    return id;
  }

  /** 等角ダイヤ (Phaser 互換の `add.isodiamond` / `isobox`) */
  public addIsoDiamond(
    x: number,
    y: number,
    width: number,
    height: number,
    color = 0xffffff,
    alpha = 1,
  ): number {
    const id = this._addShape(ShapeKind.IsoDiamond, width, height, 0, 0, color, alpha);
    if (id >= 0) this._setShapePos(id, x, y);
    return id;
  }

  /** 四辺形 (Phaser 互換の `add.quad`) */
  public addQuad(
    x: number,
    y: number,
    width: number,
    height: number,
    inset = 0,
    color = 0xffffff,
    alpha = 1,
  ): number {
    const id = this._addShape(ShapeKind.Quad, width, height, inset, 0, color, alpha);
    if (id >= 0) this._setShapePos(id, x, y);
    return id;
  }

  /** 円弧 (Phaser 互換の `add.arc`) */
  public addArc(
    x: number,
    y: number,
    radius: number,
    lineWidth = 2,
    color = 0xffffff,
    alpha = 1,
  ): number {
    const id = this._addShape(ShapeKind.Arc, radius * 2, radius * 2, lineWidth, 0, color, alpha);
    if (id >= 0) this._setShapePos(id, x, y);
    return id;
  }

  /** 生成済みシェイプ先頭の位置を書き込みます。 */
  private _setShapePos(shapeId: number, x: number, y: number): void {
    const arenaId = this.shapes.ids[shapeId];
    if (arenaId < 0) return;
    const dense = this.arena.idToIndex[arenaId];
    if (dense < 0) return;
    this.arena.setPosX(dense, x);
    this.arena.setPosY(dense, y);
  }

  /** 静的シェイプの SoA。初回参照時に生成します。 */
  public get shapes(): ShapeManager {
    return (this._shapes ??= new ShapeManager(this.arena, (key, canvas) =>
      this.textures.addCanvas(key, canvas),
    ));
  }

  private _shapes: ShapeManager | null = null;

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
    // Sprite.body が Body ハンドルを取得できるようにファクトリを登録します。
    // 物理サブシステムには触らないので、未初期化でも new は発生しません。
    this._ensureBodyFactory();
    this.input = new InputManager();
    this.textures = new TextureManager();
    this.load = new LoaderManager(this.textures);
    this.load.setSoundManagerFactory(() => this.sound);
    this.cameras = new CameraManager(this);
    this.camera = this.cameras.main;
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
    // AudioContext は有限リソースなので、シーン破棄時に必ず閉じます。
    this._sound?.destroy();
    this._sound = null;
    this._active &= ~Subsystem.Sound;
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

    // Subsystems that have not been accessed yet are skipped with a single bitwise AND.
    // The cost of an unused subsystem is one AND, not a virtual call.
    const active = this._active;

    if ((active & Subsystem.Camera) !== 0) {
      // 追従対象の座標をカメラへ渡すため、カメラを先に更新します。
      this.cameras.update(dt, this._followId, this._followX, this._followY);
    }
    // dt を渡すことで Pointer の移動速度 (velocity) を正しく算出できます。
    this.input.update(dt);
    const cam = this.cameras.main;
    const viewW = this.sys?.scale?.gameSize?.width ?? 0;
    const viewH = this.sys?.scale?.gameSize?.height ?? 0;
    const z = cam.zoom !== 0 ? cam.zoom : 1;
    this.input.worldPointerX = cam.actualX + (this.input.pointerX - viewW * 0.5) / z;
    this.input.worldPointerY = cam.actualY + (this.input.pointerY - viewH * 0.5) / z;
    if ((active & Subsystem.Tweens) !== 0) {
      // ループの dt は秒ですが、Phaser 互換の `duration` / `delay` はミリ秒です。
      // 変換をこの境界 1 か所に閉じることで、TweenManager 側は ms 前提で
      // 書き続けられます (Phaser から移植したコードがそのまま動くようにするため)。
      this._tweens!.update(dt * 1000);
    }
    if ((active & Subsystem.Anims) !== 0) this._anim!.update(dt);
    if ((active & Subsystem.Particles) !== 0) this._particles!.update(dt);
    if ((active & Subsystem.Sound) !== 0) this._sound!.update();
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
      // 複数カメラでは最も広い可視範囲を使います。
      // すべてのカメラで描画するため、1 台だけカリングすると消えてしまうためです。
      const main = this.cameras.main;
      for (let i = 0; i < maps.length; i++) {
        maps[i].updateCulling(main, sw, sh);
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
