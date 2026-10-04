# Scene API リファレンス

`Scene` はゲームの1つの画面や状態（タイトル、メインゲーム、リザルトなど）を管理するクラスです。
ゼロコスト・サブシステムを採用しており、使用しないシステムへのアクセスはオーバーヘッドを生みません。

## 概要

```typescript
import { Scene } from '@pluto-engine/core';

export class MainScene extends Scene {
  preload() {
    this.load.image('player', 'assets/player.png');
  }

  create() {
    const player = this.add.sprite(400, 300, 'player');
    this.cameras.main.startFollow(player.id);
  }

  update(dt: number) {
    // 毎フレームの更新処理
  }
}
```

## プロパティ

- `id: string` - シーンの識別子
- `arena: InstanceBufferArena` - ゼロアロケーションのためのSoAアリーナ
- `input: InputManager` - 入力管理
- `load: LoaderManager` - アセットローダー
- `textures: TextureManager` - テクスチャ管理
- `cameras: CameraManager` - カメラ管理マネージャー
- `camera: Camera` - メインカメラへのエイリアス
- `events: EventEmitter` - シーン内イベントバス
- `add` - 各種オブジェクト（スプライト、テキスト、タイルマップなど）を生成するファクトリ

## サブシステム（遅延生成）

以下のプロパティは初回アクセス時にのみインスタンスが生成されます。
- `tweens: TweenManager`
- `anim: AnimationManager`
- `particles: ParticleManager`
- `physics: ArcadePhysics`
- `world: World`
- `sound: SoundManager`
- `shapes: ShapeManager`

## ライフサイクルメソッド

ユーザーがオーバーライドして使用します。

### `preload(): void`
アセットの読み込みを行います。
### `init(): void`
シーンの初期化処理を行います。
### `create(): void`
オブジェクトの生成や初期セットアップを行います。
### `update(dt: number): void`
毎フレーム呼び出される更新処理です。`dt` はデルタタイム（秒）です。
### `fixedUpdate(fixedDt: number): void`
固定ステップでの更新処理です。
### `shutdown(): void`
シーンの終了時に呼ばれます。

## 主なファクトリメソッド (`this.add`)

- `sprite(x?: number, y?: number, textureKey?: string, frameKey?: string | number): Sprite`
- `text(x?: number, y?: number, text?: string, style?: TextStyle): Text`
- `container(x?: number, y?: number, children?: Sprite[]): Container`
- `group(children?: Sprite[]): Group`
- `particles(x?: number, y?: number, textureKey?: string, config?: EmitterCreateConfig)`
- `bitmapText(x: number, y: number, text: string, font: ParsedBitmapFont, pageKey?: string)`

## シェイプ生成メソッド

静的シェイプを生成し、アリーナのスロットIDを返します。
- `addRectangle(x, y, width, height, color?, alpha?): number`
- `addCircle(x, y, radius, color?, alpha?): number`
- `addEllipse(x, y, width, height, color?, alpha?): number`
- `addLine(...)`
- `addTriangle(...)`
- `addStar(...)`
- `addRoundRect(...)`

## その他のメソッド

### `getBodyById(entityId: number): Body`
エンティティIDから物理ボディのハンドルを取得します。
### `getContainer(entityId: number): Container`
エンティティIDからコンテナハンドルを取得します。
### `setCameraFollowTarget(id: number, x: number, y: number): void`
カメラの追従対象を明示的な座標とともに設定します。
