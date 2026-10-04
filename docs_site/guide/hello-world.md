# Hello World

このガイドでは、PlutoEngine を使って最初のスプライトを画面に表示し、キーボードの矢印キーで動かせる最小限のゲームを作成します。

---

## 1. プロジェクト構造

シンプルなプロジェクト構成を作ります：

```
my-pluto-game/
├── index.html
├── src/
│   └── main.ts
├── package.json
└── tsconfig.json
```

---

## 2. HTML の準備 (`index.html`)

Canvas を配置し、フルスクリーンで表示できるようにシンプルなCSSを指定します。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PlutoEngine Hello World</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background-color: #0b0f19;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
      font-family: sans-serif;
    }
    canvas {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <canvas id="game-canvas"></canvas>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

---

## 3. ゲームコードの記述 (`src/main.ts`)

`Scene` クラスを継承してゲームの初期化と更新処理を定義し、`PlutoEngine` に渡して起動します。

```typescript
import { PlutoEngine, Scene, type Sprite } from 'pluto-engine';

/**
 * 最初のゲームシーン
 */
class MainScene extends Scene {
  private player!: Sprite;
  private speed = 250; // ピクセル/秒

  /**
   * シーンの生成時に一度だけ呼ばれる
   */
  create(): void {
    // 画面中央 (400, 300) にサイズ 32px のスプライトを生成
    this.player = this.add.sprite(400, 300, 32);

    // 鮮やかなシアン色 (0x00E5FF) に設定
    this.player.setTint(0x00e5ff);

    console.log(`プレイヤーが生成されました！ アリーナID: ${this.player.id}`);
  }

  /**
   * 毎フレーム呼ばれる更新処理 (ゼロアロケーション)
   * @param dt 前のフレームからの経過時間 (秒単位)
   */
  update(dt: number): void {
    const moveDist = this.speed * dt;

    // キー入力の判定 (同期クエリ、毎フレーム固定ラッチ)
    if (this.input.isKeyPressed('KeyA') || this.input.isKeyPressed('ArrowLeft')) {
      this.player.x -= moveDist;
      this.player.setFlipX(true); // 左を向く
    }
    if (this.input.isKeyPressed('KeyD') || this.input.isKeyPressed('ArrowRight')) {
      this.player.x += moveDist;
      this.player.setFlipX(false); // 右を向く
    }
    if (this.input.isKeyPressed('KeyW') || this.input.isKeyPressed('ArrowUp')) {
      this.player.y -= moveDist;
    }
    if (this.input.isKeyPressed('KeyS') || this.input.isKeyPressed('ArrowDown')) {
      this.player.y += moveDist;
    }

    // 画面外に出ないようにクランプ
    this.player.x = Math.max(16, Math.min(800 - 16, this.player.x));
    this.player.y = Math.max(16, Math.min(600 - 16, this.player.y));
  }
}

// エンジンの起動設定
new PlutoEngine({
  canvas: 'game-canvas',
  width: 800,
  height: 600,
  maxInstances: 10000, // アリーナの最大収容量
  scene: [MainScene],
});
```

---

## 4. コードのポイント解説

### `this.add.sprite(x, y, scale)`
`this.add.sprite` はヒープに巨大なオブジェクトを新規作成するのではなく、事前確保された `InstanceBufferArena` から利用可能な空きID（フリーリスト）を取得し、軽量なハンドルオブジェクト（Flyweight）を返します。

### `this.player.x` と `this.player.y`
プロパティのゲッター/セッターは、内部で `arena.posX[id]` や `arena.posY[id]` などのフラットな型付き配列（`Float32Array`）を直接読み書きします。

### `this.input.isKeyPressed(code)`
PlutoEngine の入力管理は、非同期な入力イベントを毎フレームの先頭でラッチ（固定）します。そのため、フレーム更新の途中で入力状態が変化してロジックの不整合が起きる心配がありません。

### ゼロアロケーションなゲームループ
`update(dt)` の内部では、`new Vector2()` やオブジェクトリテラル `{}` を一切使用していません。プリミティブ型の数値演算だけで完結しているため、ガベージコレクションは一切発生しません。

---

## 5. 実行してみよう

開発サーバーを起動してブラウザで確認します：

```bash
bun run dev
# または
npm run dev
```

ブラウザで `http://localhost:5173` を開くと、深い宇宙色の背景の中央にシアン色の四角形（スプライト）が現れ、矢印キーや WASD キーで滑らかに操作できます。

PlutoEngine の基本操作を確認できたら、続いて [アーキテクチャ概要](./architecture) で内部の SoA メカニズムを学ぶか、実践編の [チュートリアル: Swarm Survivorの制作](/tutorial/01-setup) に進んでください。
