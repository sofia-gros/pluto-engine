# クイックスタートガイド

このページでは、PlutoEngine の基本を理解し、実際に動くプロジェクトを起動するまでの流れを網羅します。

---

## 3ステップで始める PlutoEngine

```
[ Step 1: インストール ]  --->  [ Step 2: シーンを定義 ]  --->  [ Step 3: エンジン起動 ]
 bun add pluto-engine           Scene クラスを拡張             new PlutoEngine(config)
```

### ステップ 1: パッケージのインストール

お好きなパッケージマネージャーで `pluto-engine` をインストールします：

::: code-group
```bash [bun]
bun add pluto-engine
```
```bash [npm]
npm install pluto-engine
```
```bash [pnpm]
pnpm add pluto-engine
```
:::

### ステップ 2: HTML の準備

プロジェクトのルートまたは `public/` に `index.html` を作成し、`<canvas>` を配置します：

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>PlutoEngine Quick Start</title>
  <style>
    body { margin: 0; background: #050811; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
  </style>
</head>
<body>
  <canvas id="game-canvas"></canvas>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

### ステップ 3: ゲームロジックを実装

`src/main.ts` に以下のコードを記述します：

```typescript
import { PlutoEngine, Scene } from 'pluto-engine';

class GameScene extends Scene {
  create() {
    // 画面中央にスプライトを生成
    const sprite = this.add.sprite(400, 300, 'textureKey').setDisplaySize(32, 32);
    sprite.setTint(0x00ffcc); // エメラルドグリーン
  }

  update(dt: number) {
    // 毎フレームのロジック (ゼロアロケーション)
  }
}

// エンジンの初期化
new PlutoEngine({
  canvas: 'game-canvas',
  width: 800,
  height: 600,
  maxInstances: 50000,
  scene: [GameScene],
});
```

開発サーバーを起動し、ブラウザで確認します：

```bash
bun run dev
```

---

## 主要なドキュメントへのナビゲーション

開発の目的に応じて、以下のドキュメントをご活用ください：

- **[PlutoEngine とは](./intro)**: エンジンの誕生背景とゼロアロケーション設計思想。
- **[インストールとセットアップ](./setup)**: TSインポート、ESM、CDNなど4つの利用形態。
- **[Hello World](./hello-world)**: プレイヤーのキーボード操作を含む最初のステップ。
- **[アーキテクチャ概要](./architecture)**: SoA メモリアリーナとハードウェアインスタンシングの仕組み。
- **[チュートリアル: Swarm Survivorの制作](/tutorial/01-setup)**: 数万体の敵が押し寄せる大群サバイバーゲームをゼロから制作する10章チュートリアル。
