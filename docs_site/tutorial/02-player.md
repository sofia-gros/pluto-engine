# 第2章: プレイヤー操作と入力管理

第1章ではゲームの土台と大容量メモリアリーナを構築しました。
第2章では、大群に立ち向かう主人公（プレイヤー）を登場させ、キーボード（WASD / 矢印キー）による**滑らかでキビキビとした8方向移動**を実装します！

ここで最も重要なのは、**斜め移動時の速度補正（ベクトルの正規化）を、新しいオブジェクトを作らずに計算する（ゼロアロケーション）**テクニックです。

---

## 1. プレイヤースプライトの作成

シーンにプレイヤーを保持するプロパティを追加し、`create()` メソッドでスプライトを生成します。

```typescript
import { PlutoEngine, ScaleMode, Scene, type Sprite } from 'pluto-engine';

export class SwarmSurvivorScene extends Scene {
  // プレイヤーのハンドル
  private player!: Sprite;

  // プレイヤーステータス
  private playerSpeed = 220; // 移動速度 (px/s)
  public playerHp = 100;
  public playerMaxHp = 100;

  create(): void {
    // 画面中央にサイズ 28px のプレイヤースプライトを生成
    this.player = this.add.sprite(960 / 2, 540 / 2, 28);

    // 鮮やかなエメラルドグリーン (0x10b981) を設定
    this.player.setTint(0x10b981);

    console.log(`プレイヤーが生成されました！ Slot ID: ${this.player.id}`);
  }
}
```

---

## 2. 8方向移動とゼロアロケーション正規化

従来のゲーム制作では、斜め移動の正規化に `new Vector2(dx, dy).normalize()` といったオブジェクト生成がよく使われます。しかし、1秒間に60〜144回も `new` を行うと、メモリ上にゴミが溜まりGCスパイクの原因になります。

PlutoEngine では、スカラー値（ローカル変数）だけで高速に計算します：

```typescript
  update(dt: number): void {
    // 1. 入力ベクトルの集計 (ローカル変数のためヒープ割り当てゼロ)
    let moveX = 0;
    let moveY = 0;

    if (this.input.isKeyPressed('KeyA') || this.input.isKeyPressed('ArrowLeft')) {
      moveX -= 1;
    }
    if (this.input.isKeyPressed('KeyD') || this.input.isKeyPressed('ArrowRight')) {
      moveX += 1;
    }
    if (this.input.isKeyPressed('KeyW') || this.input.isKeyPressed('ArrowUp')) {
      moveY -= 1;
    }
    if (this.input.isKeyPressed('KeyS') || this.input.isKeyPressed('ArrowDown')) {
      moveY += 1;
    }

    // 2. 移動入力がある場合の正規化と移動
    if (moveX !== 0 || moveY !== 0) {
      // 斜め移動時の長さを計算
      const length = Math.hypot(moveX, moveY); // sqrt(moveX^2 + moveY^2)
      const normX = moveX / length;
      const normY = moveY / length;

      // 速度と経過時間(dt)を掛けて移動
      const dist = this.playerSpeed * dt;
      this.player.x += normX * dist;
      this.player.y += normY * dist;

      // 3. 進行方向に応じて向きを反転 (FlipX)
      if (moveX < 0) {
        this.player.setFlipX(true); // 左向き
      } else if (moveX > 0) {
        this.player.setFlipX(false); // 右向き
      }
    }

    // 4. 画面外への侵入を防ぐクランプ処理
    const halfSize = 14;
    this.player.x = Math.max(halfSize, Math.min(960 - halfSize, this.player.x));
    this.player.y = Math.max(halfSize, Math.min(540 - halfSize, this.player.y));
  }
```

---

## 3. 入力システムの利点 (`this.input`)

PlutoEngine の `InputManager` は、ブラウザの非同期な DOM キーボードイベントを、毎フレームの更新直前に**同期スナップショットとしてラッチ（固定）**します。

- **入力の取りこぼしがない**: 連打やキーの組み合わせを正確に判定。
- **スレッドセーフ**: フレームの途中でキー状態が変わり、ロジックが矛盾することを防ぎます。

---

## 4. 全体コード (`src/main.ts`)

現在の `src/main.ts` は以下のようになります：

```typescript
import { PlutoEngine, ScaleMode, Scene, type Sprite } from 'pluto-engine';

export class SwarmSurvivorScene extends Scene {
  private player!: Sprite;
  private playerSpeed = 220;
  public playerHp = 100;
  public playerMaxHp = 100;

  create(): void {
    this.player = this.add.sprite(960 / 2, 540 / 2, 28);
    this.player.setTint(0x10b981);
  }

  update(dt: number): void {
    let moveX = 0;
    let moveY = 0;

    if (this.input.isKeyPressed('KeyA') || this.input.isKeyPressed('ArrowLeft')) moveX -= 1;
    if (this.input.isKeyPressed('KeyD') || this.input.isKeyPressed('ArrowRight')) moveX += 1;
    if (this.input.isKeyPressed('KeyW') || this.input.isKeyPressed('ArrowUp')) moveY -= 1;
    if (this.input.isKeyPressed('KeyS') || this.input.isKeyPressed('ArrowDown')) moveY += 1;

    if (moveX !== 0 || moveY !== 0) {
      const length = Math.hypot(moveX, moveY);
      const dist = this.playerSpeed * dt;
      this.player.x += (moveX / length) * dist;
      this.player.y += (moveY / length) * dist;

      if (moveX < 0) this.player.setFlipX(true);
      else if (moveX > 0) this.player.setFlipX(false);
    }

    const halfSize = 14;
    this.player.x = Math.max(halfSize, Math.min(960 - halfSize, this.player.x));
    this.player.y = Math.max(halfSize, Math.min(540 - halfSize, this.player.y));
  }
}

new PlutoEngine({
  canvas: 'game-canvas',
  width: 960,
  height: 540,
  scaleMode: ScaleMode.FIT,
  autoCenter: true,
  maxInstances: 50000,
  scene: [SwarmSurvivorScene],
});
```

---

## 5. 動作確認

ブラウザを開いて、WASD または矢印キーを押してみてください。
エメラルドグリーンのプレイヤーが、斜め移動でも速度が変わることなく、滑らかに画面内を駆け巡るはずです！

操作感も抜群ですね！
続く第3章では、いよいよ**数千体のモンスター大群（スウォーム）を一気に出現させ、プレイヤーに向かって押し寄せるAIロジック**を実装します！
