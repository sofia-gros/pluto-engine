# 第1章: プロジェクト構築とアリーナ初期化

チュートリアルへようこそ！🎮
この10章のチュートリアルでは、ブラウザ上で**数千〜数万体ものモンスターがプレイヤーに押し寄せる本格的な大群サバイバーゲーム（Swarm Survivor）**を、PlutoEngine を使ってゼロから完成させます！

従来のゲームエンジンでは、敵が300体を超えるとガベージコレクション（GC）の発生で画面がカクつき始めます。しかし、PlutoEngine の**データ指向（SoA）とゼロアロケーション設計**を用いれば、5,000体以上の敵が画面を埋め尽くしても、144FPSでシルクのように滑らかに動作します。

第1章では、開発環境のセットアップと、超大容量メモリアリーナを持つゲームエンジンの初期化を行います。

---

## 1. プロジェクトの作成

まずは Vite と TypeScript で新しいプロジェクトを作成しましょう。

```bash
# Bun を使用する場合 (推奨)
bun create vite swarm-survivor --template vanilla-ts
cd swarm-survivor

# 依存パッケージのインストール
bun add pluto-engine
```

> [!TIP]
> npm や pnpm をお使いの場合は、`npm create vite@latest swarm-survivor -- --template vanilla-ts` を実行し、`npm install pluto-engine` を実行してください。

---

## 2. HTML と Canvas の準備 (`index.html`)

ゲーム画面を中央に配置し、暗黒の宇宙空間を演出するCSSを設定します。`index.html` を以下のように編集します：

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Swarm Survivor - PlutoEngine</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      user-select: none;
    }
    body {
      background-color: #030712;
      color: #f3f4f6;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
    }
    #game-container {
      position: relative;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.15);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #1f2937;
    }
    canvas {
      display: block;
    }
  </style>
</head>
<body>
  <div id="game-container">
    <canvas id="game-canvas"></canvas>
  </div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

---

## 3. シーンとエンジンの初期化 (`src/main.ts`)

`src/main.ts` に最初のゲームシーン `SwarmSurvivorScene` を作成し、`PlutoEngine` を初期化します。

```typescript
import { PlutoEngine, ScaleMode, Scene } from 'pluto-engine';

/**
 * スウォーム・サバイバーのメインゲームシーン
 */
export class SwarmSurvivorScene extends Scene {
  /**
   * シーンの初期化時に一度だけ実行される
   */
  create(): void {
    console.log('🪐 SwarmSurvivorScene が初期化されました！');
    console.log(`アリーナ最大収容量: ${this.arena.capacity} インスタンス`);

    // アリーナの中央にテスト用の目印スプライトを1つ配置
    const centerMarker = this.add.sprite(960 / 2, 540 / 2, 16);
    centerMarker.setTint(0x38bdf8); // スカイブルー (0xRRGGBB)
  }

  /**
   * 毎フレーム呼ばれる更新ロジック (ゼロアロケーション)
   * @param dt 前フレームからの経過時間 (秒)
   */
  update(dt: number): void {
    // 次章でプレイヤーの入力処理を実装します
  }
}

// PlutoEngine インスタンスの作成と起動
const engine = new PlutoEngine({
  canvas: 'game-canvas',
  width: 960,
  height: 540,
  scaleMode: ScaleMode.FIT,
  autoCenter: true,
  maxInstances: 50000, // 5万体のエンティティを収容可能なSoAアリーナを確保
  scene: [SwarmSurvivorScene],
});
```

---

## 4. なぜ `maxInstances: 50000` なのか？

PlutoEngine の核心は、**ゲームが起動した瞬間に必要なメモリ領域を一括確保する**ことにあります。

- `Float32Array`（4バイト）× 50,000 ＝ 約 200 KB
- X座標、Y座標、スケール、向き、色、アクティブフラグを合わせても、**わずか数MBの連続メモリ領域**しか消費しません。

起動時にこの領域を確保しておくことで、ゲームプレイ中に数千体のモンスターが出現しても、ブラウザのV8エンジンはメモリ割り当て（ヒープアロケーション）を一切行う必要がありません。これが**ガベージコレクション（GC）によるカクつきを永久にゼロにする秘訣**です！

---

## 5. 動作確認

ローカル開発サーバーを立ち上げましょう：

```bash
bun run dev
```

ブラウザで開くと、深みのある宇宙色（ダークブルーグレー）のキャンバスの中央に、スカイブルー色の小さなマーカーが表示されるはずです。

第1章はこれで完了です！素晴らしいスタートを切りました。
次の第2章では、主人公キャラクター（プレイヤー）を登場させ、WASD / 矢印キーで滑らかに操作できるようにしましょう！
