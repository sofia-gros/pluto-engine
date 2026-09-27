# PlutoEngine 基本設計書 (System Architecture & Basic Design Document)

**文書バージョン:** v1.2.0

**対象ランタイム:** TypeScript 5.6+ / Bun / Modern Browsers (ESNext)

**描画バックエンド:** WebGL2 (Primary) / WebGPU (Extended Backend)

**アーキテクチャ分類:** Class-Based Scene Lifecycle × Zero-Cost Subsystem Activation × Flyweight Lightweight Objects × Unified Single-Pass GPU Pipeline

---

## 1. システム概要 & 設計方針

### 1.1 システムの目的

PlutoEngine は、Webブラウザ上で動作する**次世代汎用2Dゲームエンジン**である。
アクション、RPG、パズル、STG、ストラテジーなどあらゆるジャンルの2Dゲームを、Phaserで親しまれてきた直感的な **Class & Scene 記法（`this.add.sprite`, `this.tweens`, `this.anims`, `this.sound` 等）** で開発可能にする。

同時に、従来のWebゲームエンジンが抱えていた「大量オブジェクトによるGCスパイク・描画オーバーヘッド」を根絶するため、内部的には**極限まで贅肉を削ぎ落としたフライウェイト（Flyweight）構造と統一シングルパスGPUパイプライン**を採用する。

### 1.2 コア設計原則（Core Architectural Principles）

1. **Phaser互換の書き心地（Developer Experience）**:
   * `class DungeonScene extends Pluto.Scene`
   * `this.add.sprite(x, y, 'hero')`, `this.tweens.add(...)`, `this.anims.create(...)` など、誰もが迷わず書ける親しみやすいファサードAPIをフル提供。
2. **なぜPhaserは重いのか？ ──「Flyweight Object」による抜本的解決**:
   * **Phaserのボトルネック**: Sprite 1つにつき数百個のプロパティ、多段ネストされたシーングラフツリー、再帰的なワールドマトリクス計算、無数のイベントリスナーを抱え込み、数千個生成しただけでヒープメモリ圧迫とGCスパイクが発生する。
   * **PlutoEngineの解決策**: `this.add.sprite()` が返すオブジェクトは、**描画用 SoA バッファ上のインデックスを指す極小の軽量ハンドル（Flyweight Handle: 約32バイト）** に過ぎない。`player.x = 200` と代入した瞬間、内部の `Float32Array` へ直接書き込まれ、シーングラフの再帰走査やGCオブジェクト生成を一切行わない。
3. **ゼロコスト・サブシステム（Zero-Cost Subsystem Abstraction）**:
   * シーンには膨大なマネージャー（`tweens`, `anims`, `physics`, `swarm`, `tilemap`, `sound` 等）が用意されているが、**「そのシーンで呼び出されない・利用されない機能」は、更新ループ・描画ループにおいてビットマスク判定により 1 CPUサイクル（$O(1)$）で完全無視**される。
4. **Ebitengine 哲学の入力ポーリング（State-Query Input Architecture）**:
   * コールバック地獄を排除し、毎フレーム明示的に状態を問い合わせ可能な完全同期入力API（`isKeyPressed`, `isKeyJustPressed`, `getAxis`）を `this.input` で提供。
5. **統一シングルパスGPUレンダリング (Unified Single-Pass Rendering)**:
   * スプライト、タイルマップ、大群NPC、パーティクル、法線マップライティングを単一の頂点レイアウトおよびテクスチャアトラスへ集約。原則として「1フレーム＝1回のインスタンスドロー（`glDrawArraysInstanced`）」で完結させる。
6. **定常時ゼロアロケーション（Zero-Allocation at Runtime）**:
   * ゲームループ実行中、ヒープメモリの動的確保（`new` や配列の `.push()` 等）を 0 バイトに抑え、V8等のJavaScriptエンジンのガベージコレクションを根絶。

---

## 2. エンジン基本設定仕様 (`EngineConfig`)

エンジン起動時に渡す設定インターフェース。FPS制御、解像度スケーリング、ピクセルアート補間など、商用2Dゲームに必要な基本設定を網羅する。

```typescript
export interface EngineConfig {
  // キャンバス設定
  canvas: HTMLCanvasElement;
  width: number;
  height: number;

  // シーンリスト（起動時に配列の先頭、または指定キーのシーンを開始）
  scene: Array<typeof Scene> | typeof Scene;

  // フレームレート & タイムステップ設定
  fps?: {
    target?: number;            // 目標フレームレート（デフォルト: 60）
    min?: number;               // 許容最低フレームレート（デフォルト: 30、下回るとフレームスキップ）
    fixedDeltaTime?: number;    // 物理・固定シミュレーション刻み幅（デフォルト: 1 / 60 秒）
    panicLimit?: number;        // スパイラル・オブ・デス防止の上限反復回数（デフォルト: 5）
  };

  // 画面スケーリング & ビューポート設定
  scale?: {
    mode?: 'FIT' | 'FILL' | 'RESIZE' | 'NONE'; // 画面フィット方式
    autoCenter?: boolean;       // ウィンドウ中央への自動センタリング
    pixelArt?: boolean;         // trueの場合、Nearest-Neighbor補間とcrisp-edgesを自動適用
    zoom?: number;              // 初期キャンバス拡大率
    maxPixelRatio?: number;     // 高DPIディスプレイ対応（デフォルト: 2.0）
  };

  // 描画バックエンド設定
  render?: {
    backend?: 'auto' | 'webgl2' | 'webgpu'; // デフォルト: auto
    powerPreference?: 'high-performance' | 'default' | 'low-power';
    antialias?: boolean;        // デフォルト: false (ピクセルアート優先)
    maxInstances?: number;      // 統一インスタンスバッファの予約サイズ（デフォルト: 65,536）
  };

  // デバッグ機能
  debug?: {
    showFps?: boolean;
    showSpatialGrid?: boolean;
    showHitboxes?: boolean;
  };
}
```

---

## 3. システム構成 & パッケージアーキテクチャ

PlutoEngine は Bun ワークスペースを活用したモノレポ構造で構成される。

### 3.1 パッケージ依存関係ダイアグラム

```
                                [ Game Application ]
                                         |
               +-------------------------+-------------------------+
               |                                                   |
               v                                                   v
       @plutoengine/core                                 @plutoengine/swarm
(Scene, GameLoop, Input, Managers, Audio)               (All-in-One Swarm Facade)
               |                                                   |
       +-------+---------------+                                   |
       |       |               |                                   |
       v       v               v                                   |
@plutoengine/renderer   @plutoengine/tilemap                     |
(Unified GPU Pipeline)   (TMX / LDtk Parser)                       |
       ^                                                           |
       |===========================================================+
       |
       | (単体モジュールとして独立インポート可能)
       +---------------+---------------+-------------------+
       |               |               |                   |
       v               v               v                   v
@plutoengine/morton  @plutoengine/xpbd  @plutoengine/poisson  @plutoengine/continuum
```

### 3.2 パッケージ責務定義

| パッケージ名 | 責務・提供機能 | 依存関係 |
| ----- | ----- | ----- |
| `@plutoengine/core` | エンジン初期化、Scene基底、マネージャー群（Time, Tweens, Anims, Scale, Sound, Registry）、Input、Flyweight Sprite | なし（基底） |
| `@plutoengine/renderer` | WebGL2/WebGPU 統一シングルパス描画、シェーダー管理、テクスチャアトラス、法線ライティング | `@plutoengine/core` |
| `@plutoengine/tilemap` | TMX (Tiled) / LDtk 等のタイルデータ解析、静的インスタンスデータ変換 | `@plutoengine/core` |
| `@plutoengine/morton` | **【完全独立】** 2D Morton符号化（Z-Order）、近傍空間ハッシュ探索 | なし（Pure Math） |
| `@plutoengine/xpbd` | **【完全独立】** 拡張位置ベース動力学（XPBD）接触拘束・剛体緩和ソルバー | なし（Pure Math） |
| `@plutoengine/poisson` | **【完全独立】** 均一非圧縮性制約（UIC）圧力緩和ソルバー | なし（Pure Math） |
| `@plutoengine/continuum` | **【完全独立】** アイコナール方程式に基づく大群ナビゲーションベクトル場 | なし（Pure Math） |
| `@plutoengine/swarm` | 上記4数学モジュールを配線し、1行で統合群集を制御する高レベルファサード | 上記4数学モジュール |

---

## 4. コアアーキテクチャ詳細設計

### 4.1 ゼロコスト・サブシステム設計（Zero-Cost Subsystem Architecture）

シーンにはゲーム開発を容易にする多種多様なファサードAPIが `this.*` としてぶら下がっているが、**使われていない機能はゲームループの更新・描画パスから完全に除外**される。

```
[ Scene Instance ]
  - this.tweens   --> 初回アクセス時にフラグ点灯 (0b00000001)
  - this.anims    --> 初回アクセス時にフラグ点灯 (0b00000010)
  - this.sprites  --> 初回アクセス時にフラグ点灯 (0b00000100)
  - this.swarm    --> 初回アクセス時にフラグ点灯 (0b00001000)
  - this.physics  --> 初回アクセス時にフラグ点灯 (0b00010000)

  [ GameLoop Frame Pipeline ]
     if ((scene.activeMask & SUBSYSTEM_TWEENS) !== 0)  { tweens.update(dt); }   // 未使用なら 0 サイクル
     if ((scene.activeMask & SUBSYSTEM_ANIMS) !== 0)   { anims.update(dt); }
     if ((scene.activeMask & SUBSYSTEM_SWARM) !== 0)   { swarm.fixedUpdate(); }
```

#### サブシステム・アクティブマスク定義

```typescript
export const enum SubsystemMask {
  None      = 0,
  Sprites   = 1 << 0,
  Tilemap   = 1 << 1,
  Tweens    = 1 << 2,
  Anims     = 1 << 3,
  Swarm     = 1 << 4,
  Physics   = 1 << 5,
  Lighting  = 1 << 6,
  Particles = 1 << 7,
  Sound     = 1 << 8,
}
```

### 4.2 フライウェイト・スプライト設計（Flyweight Sprite Architecture）

Phaser の最大のボトルネック（Sprite 1体あたりの重厚なオブジェクト構造）を排除するため、PlutoEngine では **Flyweight パターン** を採用する。

```
[ User API Layer ]
const player = this.add.sprite(200, 300, 'hero');
player.x += 10;
player.setTint(0xff0000);

         │
         │ (内部的にはプロパティアクセサによる直書き)
         ▼
[ Shared Unified Instance SoA Buffer (Float32Array) ]
+---------------------+---------------------+---------------------+
| posX (Float32Array) | posY (Float32Array) | scale(Float32Array) |
| [ 200, ... ]        | [ 300, ... ]        | [ 1.0, ... ]        |
+---------------------+---------------------+---------------------+
| tint (Float32Array) | uvs  (Float32Array) | flags(Uint32Array)  |
+---------------------+---------------------+---------------------+
```

#### `Sprite` 実装仕様（薄型ハンドル）

```typescript
export class Sprite {
  // 実体は SoA メモリ内の 1 スロットへのインデックスのみ
  public readonly id: number;
  private readonly _arena: InstanceBufferArena;

  constructor(id: number, arena: InstanceBufferArena) {
    this.id = id;
    this._arena = arena;
  }

  // ゲッター／セッターは TypedArray の該当スロットを直読・直書き
  public get x(): number { return this._arena.posX[this.id]; }
  public set x(val: number) { this._arena.posX[this.id] = val; }

  public get y(): number { return this._arena.posY[this.id]; }
  public set y(val: number) { this._arena.posY[this.id] = val; }

  public get scale(): number { return this._arena.scale[this.id]; }
  public set scale(val: number) { this._arena.scale[this.id] = val; }

  public setFlipX(flip: boolean): this {
    this._arena.facing[this.id] = flip ? -1.0 : 1.0;
    return this;
  }

  public setTint(tintHex: number): this {
    this._arena.tint[this.id] = tintHex;
    return this;
  }

  public play(animKey: string, ignoreIfPlaying = false): this {
    this._arena.animTracker.play(this.id, animKey, ignoreIfPlaying);
    return this;
  }

  public destroy(): void {
    this._arena.free(this.id);
  }
}
```

この設計により、**1万個のスプライトを生成しても消費メモリはわずか数百キロバイト**であり、GCの対象になる複雑なオブジェクト参照グラフは一切生成されない。

---

## 5. Phaser互換マネージャー群 & `this` 提供API

PlutoEngine の `Scene` クラスは、Phaser でお馴染みの主要マネージャー群を完全に備える。

```typescript
export abstract class Scene {
  // 1. コアシステム & ライフサイクル
  public game!: Engine;
  public scene!: ScenePlugin;           // シーン切り替え・HUD並列起動・ポーズ
  public scale!: ScaleManager;          // 画面リサイズ・フルスクリーン・DPR制御
  public time!: TimeStepManager;        // タイマー・クロック・ディレイ実行
  public events!: EventEmitter;         // シーン内イベントバス
  public registry!: DataRegistry;       // 全シーン共有グローバルデータストア

  // 2. 入力サブシステム（Ebitengine哲学）
  public input!: InputManager;          // 同期キー・ポインタ・ゲームパッドクエリ

  // 3. 描画・ファクトリサブシステム
  public cameras!: CameraManager;       // ズーム・追従・シェイク・スコープ
  public add!: GameObjectFactory;       // sprite, container, text, tilemap 生成
  public load!: AssetLoader;            // 画像、アトラス、音声、タイルマップロード
  public anims!: AnimationManager;      // スプライトアニメーション定義・再生
  public tweens!: TweenManager;         // イージング・トゥイーンアニメーション
  public sound!: AudioManager;          // Web Audio BGM/SE、空間音響

  // 4. 遅延アクティベーション・ファサード（参照時にのみアクティブ化）
  public get swarm(): SwarmFacade;      // 数万体の大群シミュレーション
  public get physics(): PhysicsFacade;  // 2D剛体・めり込み拘束ソルバー

  // 5. ライフサイクルフック（オーバーライド可能）
  public init?(data?: unknown): void;
  public preload?(): void;
  public create?(data?: unknown): void;
  public fixedUpdate?(fixedDt: number): void;
  public update?(time: number, dt: number): void;
  public destroy?(): void;
}
```

### 5.1 各マネージャーの責務とAPI仕様

#### ① `this.add` (`GameObjectFactory`)
オブジェクトを生成し、共通インスタンスバッファに登録するファクトリ。
```typescript
export class GameObjectFactory {
  // 超軽量フライウェイトスプライト
  public sprite(x: number, y: number, textureKey: string, frame?: number | string): Sprite;

  // 軽量コンテナ（複数スプライトのオフセット一括移動）
  public container(x: number, y: number): Container;

  // ビットマップ/テクスチャレンダリングテキスト（ドローコール分割なし）
  public text(x: number, y: number, text: string, style?: TextStyle): TextInstance;

  // タイルマップ
  public tilemap(key: string): Tilemap;
}
```

#### ② `this.tweens` (`TweenManager`)
オブジェクトをプール化し、ゼロアロケーションで実行するトゥイーンエンジン。
```typescript
export class TweenManager {
  public add(config: {
    targets: object | object[];
    props: Record<string, number>;
    duration: number;
    ease?: 'Linear' | 'Quad.in' | 'Quad.out' | 'Cubic.out' | 'Bounce.out';
    delay?: number;
    yoyo?: boolean;
    repeat?: number;
    onComplete?: () => void;
  }): Tween;

  public killTweensOf(target: object): void;
}
```

#### ③ `this.anims` (`AnimationManager`)
スプライトシートからコマアニメーションを定義し、全スプライト間で共有する。
```typescript
export class AnimationManager {
  public create(config: {
    key: string;
    frames: Array<{ key: string; frame: number | string }>;
    frameRate?: number;
    repeat?: number; // -1: 無限ループ
  }): Animation;

  public play(sprite: Sprite, key: string): void;
}
```

#### ④ `this.time` (`TimeStepManager`)
フレームレート非依存のタイマーやディレイ処理。
```typescript
export class TimeStepManager {
  public delayedCall(delayMs: number, callback: () => void, args?: unknown[]): TimerEvent;
  public addEvent(config: { delay: number; callback: () => void; loop?: boolean }): TimerEvent;
  public readonly now: number;
}
```

#### ⑤ `this.sound` (`AudioManager`)
Web Audio API を用いた低レイテンシ音声管理。使われないシーンでは AudioContext をサスペンド状態にし負荷をゼロにする。
```typescript
export class AudioManager {
  public play(key: string, config?: { volume?: number; loop?: boolean; rate?: number }): SoundInstance;
  public playMusic(key: string, config?: { volume?: number; fadeIn?: number }): void;
  public stopAll(): void;
  public setMasterVolume(volume: number): void;
}
```

#### ⑥ `this.scale` (`ScaleManager`)
解像度とビューポートの追従。
```typescript
export class ScaleManager {
  public readonly width: number;
  public readonly height: number;
  public setSize(width: number, height: number): void;
  public toggleFullscreen(): Promise<void>;
  public onResize(callback: (width: number, height: number) => void): void;
}
```

---

## 6. 統一シングルパスGPU描画パイプライン（Unified Single-Pass Pipeline）

スプライト（`this.add.sprite`）、タイルマップ、数万体の大群（Swarm）、UIを、**単一のテクスチャアトラスと単一の頂点バッファへ統合し、1フレーム＝1ドローコールで完結**させる。

```
[ Active Scene Visual Elements ]
  ├── Tilemap Base Layer (地面)
  ├── Flyweight Sprites (自機・敵・弾幕)
  ├── Swarm Horde (数万体の群集NPC)
  └── UI & Texts
            │
            ▼ 毎フレーム単一の ArrayBuffer スライスへ直列パック
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, unifiedRenderStream)
            │
            ▼
  glDrawArraysInstanced(gl.TRIANGLES, 0, 6, totalInstances) [★ 1 Draw Call]
```

### インスタンス頂点レイアウト仕様 (32 Bytes per Instance)

GPUキャッシュライン（64バイト）に2インスタンスが整列して収まるよう、厳密に32バイト（8個の `Float32`）で設計。

| Location | 型 | 属性名 | 内訳・データ仕様 |
| ----- | ----- | ----- | ----- |
| **Location 0** | `vec2` | `a_vertex` | 共通Quad基底頂点: `[-0.5, -0.5]` 〜 `[0.5, 0.5]`（共有VBO） |
| **Location 1** | `vec4` | `a_posScaleFacing` | `posX` (px), `posY` (px), `scale` (px), `facingDirection` (`1.0` or `-1.0`) |
| **Location 2** | `vec4` | `a_uvTypeFrame` | `uvOffset.x`, `uvOffset.y`, `layerDepth` (Z順ソート値), `frameIdx` |
| **Location 3** | `vec4` | `a_tintLighting` | `tintColor.rgb` (乗算色), `emissiveIntensity` (発光度) |

---

## 7. 開発者体験（DX / Code Example）

### 7.1 王道のアクションRPG（Phaserライク記法での実装例）

重厚なシーングラフを持たないため、見た目はPhaserそのものでありながら、内部では圧倒的な軽快さで動作する。

```typescript
import { Pluto, Scene, Sprite } from "@plutoengine/core";

export class ActionRpgScene extends Scene {
  private player!: Sprite;

  preload(): void {
    this.load.image("hero", "assets/hero.png");
    this.load.tilemapTmx("stage1", "assets/stage1.tmx");
    this.load.audio("bgm", "assets/dungeon.ogg");
  }

  create(): void {
    // 1. タイルマップ構築（1ドローコールに自動統合）
    this.add.tilemap("stage1");

    // 2. 超軽量フライウェイトスプライト生成
    this.player = this.add.sprite(320, 240, "hero");

    // 3. カメラの追従
    this.cameras.main.startFollow(this.player, { smooth: 0.1 });

    // 4. アニメーション定義
    this.anims.create({
      key: "walk",
      frames: [{ key: "hero", frame: 0 }, { key: "hero", frame: 1 }],
      frameRate: 8,
      repeat: -1,
    });

    // 5. BGM再生
    this.sound.playMusic("bgm", { volume: 0.6, fadeIn: 1.0 });
  }

  update(time: number, dt: number): void {
    const move = this.input.getAxis(); // Ebitenライクな同期入力
    const speed = 180;

    this.player.x += move.x * speed * dt;
    this.player.y += move.y * speed * dt;

    if (move.x !== 0) {
      this.player.setFlipX(move.x < 0);
      this.player.play("walk", true);
    }

    // スペースキーでダッシュトゥイーン（GCゼロ）
    if (this.input.isKeyJustPressed("Space")) {
      this.tweens.add({
        targets: this.player,
        props: { x: this.player.x + (this.player.x > 0 ? 80 : -80) },
        duration: 200,
        ease: "Quad.out",
      });
    }
  }
}

// エンジン起動
Pluto.createGame({
  canvas: document.getElementById("game") as HTMLCanvasElement,
  width: 640,
  height: 360,
  scene: [ActionRpgScene],
  fps: { target: 60 },
  scale: { mode: "FIT", pixelArt: true },
});
```

---

## 8. フレーム実行シーケンス（Data Flow Pipeline）

```
[ Browser requestAnimationFrame(timestamp) ]
  │
  ├── 1. Input State Polling (Ebiten-style)
  │      input.update()（直前のキー状態をラッチし、現フレームの JustPressed/Released 確定）
  │
  ├── 2. TimeStep Accumulator & Fixed Loop (Configurable Hz, e.g. 60Hz)
  │      while (accumulator >= fixedDeltaTime) {
  │        activeScenes.forEach(s => {
  │          s.fixedUpdate?.(fixedDeltaTime);
  │          if (s.activeMask & SubsystemMask.Swarm)   { s.swarm.fixedUpdate(fixedDeltaTime); }
  │          if (s.activeMask & SubsystemMask.Physics) { s.physics.fixedUpdate(fixedDeltaTime); }
  │        });
  │        accumulator -= fixedDeltaTime;
  │      }
  │
  ├── 3. Variable Frame Logic
  │      activeScenes.forEach(s => {
  │        if (s.activeMask & SubsystemMask.Tweens) { s.tweens.update(dt); }
  │        if (s.activeMask & SubsystemMask.Anims)  { s.anims.update(dt); }
  │        s.update?.(time, dt);
  │        s.cameras.update(dt);
  │      });
  │
  ├── 4. Zero-Cost Render Buffer Assembly
  │      - アクティブシーンの可視要素（Tilemap + Sprites + Swarm）のTypedArrayスライスのみ直列コピー
  │
  └── 5. GPU Submission (Single-Pass Draw)
         gl.bindBuffer(gl.ARRAY_BUFFER, unifiedInstanceBuffer);
         gl.bufferSubData(gl.ARRAY_BUFFER, 0, currentFrameData);
         glDrawArraysInstanced(gl.TRIANGLES, 0, 6, totalInstanceCount); [★ 1 Draw Call]
```

---

## 9. 品質目標 & SLA（Performance Metrics）

| 評価項目 | 目標SLA | 測定環境条件 |
| ----- | ----- | ----- |
| **スプライト描画スループット** | **100,000体 安定描画 (目標FPS維持)** | Flyweight Sprite + 統一シングルパスGPU描画 |
| **1体あたりオブジェクトフットプリント** | **$\le 32 \text{ Bytes}$** | Phaser（約 1.2 KB〜4 KB）比で **97%以上削減** |
| **定常時ヒープメモリ確保量** | **$0 \text{ Bytes}$ / frame** | ゲームループ実行中のGC発生ゼロを保証 |
| **未使用サブシステムオーバーヘッド** | **$\le 0.0001 \text{ ms}$ (実質ゼロ)** | ビットフラグチェックによる即時バイパス |
| **ドローコール数** | **厳密に 1 回** | タイルマップ、スプライト、群集、UI を単一パス完結 |