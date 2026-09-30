# Scene

シーン (Scene) は、ゲームの特定の部分（タイトル画面、メインゲーム、リザルト画面など）を管理するための単位です。
ライフサイクル（初期化、プリロード、作成、更新）を持ち、アセットのロードやエンティティの生成を行います。

## 概要 (Overview)

各シーンは独立した状態を持ち、他のシーンへの遷移が可能です。
内部的には、シーン単位でエンティティやコンポーネントのアリーナ（TypedArray）が管理され、シーンの終了と共に効率的にリセットされます。

### アーキテクチャの内部設計
- **アリーナリセット**: シーン遷移時にエンティティのIDカウンターをリセットし、メモリの再割り当て（アロケーション）を回避します。
- **フライウェイトパターン**: シーン内で生成されたオブジェクト（スプライトなど）は、単なる TypedArray のインデックスを持つ軽量ハンドルとして機能します。

## ライフサイクル (Lifecycle)

シーンには以下のメソッドを実装することができます。

```typescript
import { Scene } from 'pluto-engine';

export class MainScene extends Scene {
  init(data) {
    // 他のシーンから渡されたデータの受け取り
  }

  preload() {
    // アセット（画像、音声など）のロード
    this.load.image('hero', 'assets/hero.png');
  }

  create() {
    // ゲームオブジェクトの生成
    const player = this.add.sprite(100, 200, 'hero');
  }

  update(dt) {
    // 毎フレームの更新処理（※この中でオブジェクトを生成してはいけない）
  }
}
```

## サブシステム (Subsystems)

### `this.add` (GameObjectFactory)
エンティティを生成するためのファクトリです。
- `this.add.sprite(x, y, texture)`
- `this.add.text(x, y, text, style)`
- `this.add.tilemap(mapData, tileSize)`
- `this.add.container(x, y, children)` — 複数のスプライトをまとめて動かす親を作ります

### ゼロコスト・サブシステム

`tweens` / `anim` / `particles` / `physics` は**初回の参照時にだけ生成**され、
その瞬間にサブシステムのビットが立ちます。生成される前から
更新ループに現れないため、使っていない機能のコストはゼロです。

```typescript
// まだ作られていない。ビットも立っていない。
console.log(scene.hasSubsystem(Subsystem.Tweens)); // false

// 初めて参照した瞬間に生成され、ビットが立つ。
scene.tweens.add(/* ... */);
console.log(scene.hasSubsystem(Subsystem.Tweens)); // true
```

定義は `@pluto-engine/core` の `Subsystem` から import できます。
`scene.activeSubsystems` で現在有効なビットをまとめて取得できます。

### `this.events` (EventEmitter)
シーン内イベントバスです。emit 中も安全に購読を解除できます。
```typescript
const dispose = this.events.on('player-died', () => { /* ... */ });
this.events.emit('player-died', payload);
dispose();
```

### `this.registry` (DataRegistry)
シーンを跨いで値を保持するデータストアです。
数値は `Float64Array` へ遅延確保されるため、毎フレームの文字列検索が発生しません。
```typescript
this.registry.setFloat('progress', 'stage', 3);
this.registry.addFloat('score', 'total', 120);
const stage = this.registry.getFloat('progress', 'stage'); // 3
```
`SceneManager` に登録されたシーンは同一のストアを共有します。

### `this.load` (LoaderManager)
アセットを非同期でロードするためのマネージャーです。プリロードフェーズで使用します。
- `this.load.image(key, url)`
- `this.load.audio(key, url)`

### `this.sound` (SoundManager)
音声の再生を管理します。
- `this.sound.play(key)`

## メソッド (Methods)

### `start(key, data)`
別のシーンへ遷移します。

| パラメータ | 型 | 説明 |
| :--- | :--- | :--- |
| `key` | `string` | 遷移先のシーンキー。 |
| `data` | `any` | 遷移先の `init` メソッドに渡すデータ。 |

## プロパティ (Properties)

- `cameras` (CameraManager): シーン内のカメラを管理。
- `tweens` (TweenManager): アニメーションやトゥイーンを管理。
