# インストールとセットアップ

PlutoEngine は、プロジェクトの目的や規模に合わせて、4つの異なる方法で導入できます。本ページでは、各方法のセットアップ手順を解説します。

---

## 前提条件

- **Node.js**: v18.0.0 以上、または **Bun** (推奨: 1.0 以上)
- **モダンブラウザ**: Chrome, Edge, Firefox, Safari (WebGPU に対応した環境)

---

## 方法 1: パッケージマネージャーによる導入 (推奨)

Vite、Next.js、Nuxt、Astro などのモダンなフロントエンド環境で開発する場合、パッケージマネージャーを使った導入が最も一般的で型安全です。

### 1. プロジェクトの作成 (Vite + TypeScript)

```bash
# Bun を使う場合 (推奨)
bun create vite my-pluto-game --template vanilla-ts
cd my-pluto-game

# npm を使う場合
npm create vite@latest my-pluto-game -- --template vanilla-ts
cd my-pluto-game
```

### 2. PlutoEngine のインストール

統合パッケージ `pluto-engine`、またはコアパッケージ `@pluto-engine/core` をインストールします：

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
```bash [yarn]
yarn add pluto-engine
```
:::

モジュール個別で導入したい場合（物理やAIなど）：

```bash
bun add @pluto-engine/core @pluto-engine/renderer @pluto-engine/xpbd @pluto-engine/morton
```

---

## 方法 2: TypeScript モジュールとしてのインポート

TypeScript プロジェクトでは、`tsconfig.json` を以下のように設定しておくと、厳格な型チェックと最適なパフォーマンスが得られます。

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "strict": true,
    "isolatedModules": true
  }
}
```

コード側でのインポート：

```typescript
import { PlutoEngine, Scene } from 'pluto-engine';
// または
import { PlutoEngine, Scene } from '@pluto-engine/core';
```

---

## 方法 3: トランスパイル済み JavaScript ESM インポート

バンドラー（Webpack や Vite）を使わずに、ブラウザネイティブの ES Modules を利用して直接読み込むことも可能です。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>PlutoEngine ESM Demo</title>
</head>
<body>
  <canvas id="game-canvas"></canvas>

  <script type="module">
    import { PlutoEngine, Scene } from 'https://cdn.jsdelivr.net/npm/pluto-engine/dist/pluto.esm.js';

    class MainScene extends Scene {
      create() {
        const sprite = this.add.sprite(400, 300, 'textureKey').setDisplaySize(30, 30);
        sprite.setTint(0x00ffff);
      }
    }

    new PlutoEngine({
      canvas: 'game-canvas',
      scene: [MainScene]
    });
  </script>
</body>
</html>
```

---

## 方法 4: `<script>` タグによる直接利用 (CDN Ready)

HTML ファイル単体で完結させたい場合や、CodePen、JSFiddle などのオンラインエディタで実験したい場合は、単一の UMD/IIFE バンドルを読み込みます。シェーダーやアセットも内包されているため、追加の設定なしでグローバル変数 `Pluto` が使用可能になります。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>PlutoEngine Standalone</title>
  <!-- PlutoEngine Global Bundle -->
  <script src="https://cdn.jsdelivr.net/npm/pluto-engine/dist/pluto.global.js"></script>
</head>
<body>
  <canvas id="game-canvas"></canvas>

  <script>
    const { PlutoEngine, Scene } = window.Pluto;

    class BattleScene extends Scene {
      create() {
        console.log("アリーナ初期化完了！");
      }
    }

    const game = new PlutoEngine({
      canvas: 'game-canvas',
      width: 1280,
      height: 720,
      scene: [BattleScene]
    });
  </script>
</body>
</html>
```

---

## おすすめの開発環境

1. **エディタ**: [Visual Studio Code](https://code.visualstudio.com/) または [Cursor](https://www.cursor.com/)
2. **推奨拡張機能**:
   - `Biome` (フォーマッター・高速リンター)
   - `Even Better TOML` / `TypeScript Vue Plugin` (UI連携時)
3. **ローカルサーバー**: Vite または Bun の高速プレビューサーバー (`bun run dev`)

環境の準備が整ったら、次の [Hello World](./hello-world) で最初のスプライトを表示してみましょう。
