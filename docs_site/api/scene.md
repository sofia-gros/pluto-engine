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
