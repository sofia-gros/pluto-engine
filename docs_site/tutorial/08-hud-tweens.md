# 第8章: HUD表示とTweenアニメーション

ゲームに命を吹き込むのは、「手応え（Juice）」と「視覚的フィードバック」です！
どれほど優れた戦闘システムがあっても、敵に与えたダメージが見えず、現在のHPやレベルが分からなければ、面白さは半減してしまいます。

第8章では、PlutoEngine v1.2.1 の **SDFTextPlugin** によるテキスト描画と、**TweenPlugin** の完全データ指向のゼロアロケーション・Tweenシステムを使って、画面上部のHUDと、敵を攻撃した時に気持ちよく弾け飛ぶ「浮動ダメージ数値（Floating Damage Numbers）」を実装します！

---

## 1. HUD (ヘッドアップディスプレイ) の構築

画面の左上に、プレイヤーのレベル、HP、撃破数、生存時間を表示するテキストを作成します。v1.2.1 の `SDFTextPlugin` では、テキストも実体を持たない Flyweight パターンのIDとして管理されます。

```typescript
import { Scene, TweenProperty, SDFTextPlugin, TweenPlugin } from 'pluto-engine';

export class SwarmSurvivorScene extends Scene {
  // ... 前章までのプロパティ ...

  private textPlugin!: SDFTextPlugin;
  private tweenPlugin!: TweenPlugin;

  // HUD テキストID (SoAインデックス)
  private hudLevelTextId: number = -1;
  private hudHpTextId: number = -1;
  private hudStatsTextId: number = -1;

  // ゲームプレイ統計
  private killCount = 0;
  private survivalTime = 0; // 秒

  public onStart(): void {
    // ...
    this.textPlugin = this.engine.getPlugin(SDFTextPlugin);
    this.tweenPlugin = this.engine.getPlugin(TweenPlugin);
    this.initHUD();
  }

  private initHUD(): void {
    // 画面左上にレベル表示 (フォントサイズ 24px)
    this.hudLevelTextId = this.textPlugin.spawn({
      x: 20,
      y: 20,
      text: 'LV. 1',
      fontSize: 24,
      color: 0x38bdf8, // スカイブルー
    });

    // HP 表示
    this.hudHpTextId = this.textPlugin.spawn({
      x: 20,
      y: 52,
      text: 'HP: 100 / 100',
      fontSize: 18,
      color: 0x10b981, // グリーン
    });

    // 撃破数 & 生存時間
    this.hudStatsTextId = this.textPlugin.spawn({
      x: 20,
      y: 80,
      text: 'KILLS: 0 | TIME: 00:00',
      fontSize: 16,
      color: 0x9ca3af, // グレー
    });
  }
```

---

## 2. HUD の高効率な更新

毎フレーム文字列を連結するとJSのガベージコレクション（GC）が発生しやすくなります。PlutoEngine v1.2.1 ではバッファへの書き込みは WebGPU バックエンドに効率よく同期されますが、無駄な更新は避けるべきです。整数の秒数や値が変わった時だけ `setText` を呼び出すように工夫します。

```typescript
  private lastDisplayedSec = -1;

  private updateHUD(dt: number): void {
    this.survivalTime += dt;
    const currentSec = Math.floor(this.survivalTime);

    // 1秒ごとにタイマーと統計テキストを更新
    if (currentSec !== this.lastDisplayedSec) {
      this.lastDisplayedSec = currentSec;

      const min = Math.floor(currentSec / 60).toString().padStart(2, '0');
      const sec = (currentSec % 60).toString().padStart(2, '0');

      this.textPlugin.setText(this.hudStatsTextId, `KILLS: ${this.killCount} | TIME: ${min}:${sec}`);
    }

    // HP表示の更新
    const hpDisplay = Math.max(0, Math.ceil(this.playerHp));
    this.textPlugin.setText(this.hudHpTextId, `HP: ${hpDisplay} / ${this.playerMaxHp}`);
  }
```

---

## 3. PlutoEngine の SoA トゥイーンシステム

PlutoEngine v1.2.1 の `TweenPlugin` は、他の一般的なライブラリ（GSAPなど）とは異なり、**Tween自体も事前確保された `Float32Array`（SoA）で動作**します。`new` キーワードによるオブジェクト生成を完全に排除しています。

```typescript
// ゼロアロケーションでエンティティのプロパティを補間
this.tweenPlugin.add({
  targetId: entityId,           // 対象スプライトのID
  property: TweenProperty.SCALE,// 補間する対象プロパティ (X, Y, SCALE, TINT など)
  startValue: startValue,       // 開始値
  endValue: endValue,           // 終了値
  durationMs: durationMs        // アニメーション時間 (ミリ秒)
});
```

補間が終わると内部のプールで自動的に再利用されるため、毎フレーム数千回トゥイーンを発行してもGCは完全にゼロに保たれます！

---

## 4. 飛び跳ねるダメージポップ演出の実装

敵に攻撃がヒットした瞬間に、テキストを発生させ、上に向かってフワッと跳ね上がるアニメーションを適用します。SDFテキストとTweenの組み合わせは、WebGPU の `RenderGraph` によって超高速に処理されます。

```typescript
  /**
   * 敵の頭上にダメージ数字をポップさせる
   */
  private spawnDamagePopup(x: number, y: number, damage: number): void {
    const rounded = Math.round(damage);
    if (rounded <= 0) return;

    // 頭上の少しランダムな位置にテキストを生成
    const startX = x + (Math.random() * 16 - 8);
    const startY = y - 10;

    const popupId = this.textPlugin.spawn({
      x: startX,
      y: startY,
      text: `${rounded}`,
      fontSize: 16,
      color: 0xfacc15, // クリティカルな黄色
    });

    // 1. 上方向にフワッと浮き上がるトゥイーン (350ms)
    this.tweenPlugin.add({
      targetId: popupId,
      property: TweenProperty.Y,
      startValue: startY,
      endValue: startY - 35,
      durationMs: 350
    });

    // 2. スケールを大きくしてから収束させるポップ効果
    this.tweenPlugin.add({
      targetId: popupId,
      property: TweenProperty.SCALE,
      startValue: 22,
      endValue: 12,
      durationMs: 350
    });
  }
```

これを前章までの `damageEnemy` などの関数内で呼び出します：

```typescript
  public damageEnemy(enemyIndex: number, amount: number): void {
    const id = this.enemyIds[enemyIndex];
    // ダメージポップを生成
    this.spawnDamagePopup(this.arena.posX[id], this.arena.posY[id], amount);

    this.enemyHp[enemyIndex] -= amount;
    // ...
```

---

## 5. レベルアップ時のヒーロー・パルス演出

レベルアップした瞬間、プレイヤーのサイズを一瞬大きく膨らませて元に戻す「パルスアニメーション」を加えます。ここでも `TweenPlugin` を使用します。

```typescript
  private applyLevelUpUpgrade(): void {
    // レベル表示のテキストを更新
    this.textPlugin.setText(this.hudLevelTextId, `LV. ${this.playerLevel}`);

    // プレイヤーが「ドクン！」と一瞬巨大化して元に戻るトゥイーン
    this.tweenPlugin.add({
      targetId: this.playerId,
      property: TweenProperty.SCALE,
      startValue: 44, // 一瞬 44px に膨張
      endValue: 28,   // 通常サイズ 28px へ復帰
      durationMs: 300 // 0.3秒間
    });
    // ...
  }
```

---

## 6. 動作確認

ゲームを起動して敵にブレードを当ててみましょう！

黄色いダメージ数字がポンポンと空中に跳ね上がり、倒したモンスターの数とタイムが画面左上でリアルタイムにカウントアップされます。
さらに、レベルアップ時にはプレイヤーが力強く脈動し、ゲームとしての爽快感が一気に極限まで高まりました！オブジェクトの生成・破棄（GC）を伴わないアーキテクチャにより、大量のダメージポップが発生しても処理落ちは一切ありません。

視覚的な表現は完璧です。
続く第9章では、画面全体を揺らす**画面振動（スクリーンシェイク）**、被弾時の**ホワイトフラッシュ**、そして外部ファイルを一切使わない**Web Audio APIによるゼロ遅延シンセサウンド**を追加します！
