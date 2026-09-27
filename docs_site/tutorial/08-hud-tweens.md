# 第8章: HUD表示とTweenアニメーション

ゲームに命を吹き込むのは、「手応え（Juice）」と「視覚的フィードバック」です！
どれほど優れた戦闘システムがあっても、敵に与えたダメージが見えず、現在のHPやレベルが分からなければ、面白さは半減してしまいます。

第8章では、PlutoEngine の **SDFテキスト描画（`this.add.text`）** と、**完全データ指向のゼロアロケーション・Tweenシステム（`this.tweens`）** を使って、画面上部のHUDと、敵を攻撃した時に気持ちよく弾け飛ぶ「浮動ダメージ数値（Floating Damage Numbers）」を実装します！

---

## 1. HUD (ヘッドアップディスプレイ) の構築

画面の左上に、プレイヤーのレベル、HP、撃破数、生存時間を表示するテキストを作成します。

```typescript
import { PlutoEngine, ScaleMode, Scene, TweenProperty, type Sprite, type Text } from 'pluto-engine';

export class SwarmSurvivorScene extends Scene {
  // ... 前章までのプロパティ ...

  // HUD テキストハンドル
  private hudLevelText!: Text;
  private hudHpText!: Text;
  private hudStatsText!: Text;

  // ゲームプレイ統計
  private killCount = 0;
  private survivalTime = 0; // 秒

  private initHUD(): void {
    // 画面左上にレベル表示 (フォントサイズ 24px)
    this.hudLevelText = this.add.text(20, 20, 'LV. 1', {
      fontSize: 24,
      color: 0x38bdf8, // スカイブルー
    });

    // HP 表示
    this.hudHpText = this.add.text(20, 52, 'HP: 100 / 100', {
      fontSize: 18,
      color: 0x10b981, // グリーン
    });

    // 撃破数 & 生存時間
    this.hudStatsText = this.add.text(20, 80, 'KILLS: 0 | TIME: 00:00', {
      fontSize: 16,
      color: 0x9ca3af, // グレー
    });
  }
```

---

## 2. HUD の高効率な更新

毎フレーム文字列を連結すると文字列オブジェクトが生成されてしまいますが、PlutoEngine のテキスト更新は描画バッファを効率よく同期します。整数の秒数や値が変わった時だけ更新するように工夫します。

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

      this.hudStatsText.text = `KILLS: ${this.killCount} | TIME: ${min}:${sec}`;
    }

    // HP表示の更新
    const hpDisplay = Math.max(0, Math.ceil(this.playerHp));
    this.hudHpText.text = `HP: ${hpDisplay} / ${this.playerMaxHp}`;
  }
```

---

## 3. PlutoEngine の SoA トゥイーンシステム

PlutoEngine の `TweenManager` は、他の一般的なライブラリ（GSAPなど）とは異なり、**Tween自体も事前確保された固定型付き配列（SoA）で動作**します。

```typescript
// ゼロアロケーションでエンティティのプロパティを補間
this.tweens.add(
  entityId,           // 対象スプライトのID
  TweenProperty.SCALE,// 補間する対象プロパティ (X, Y, SCALE, TINT など)
  startValue,         // 開始値
  endValue,           // 終了値
  durationMs          // アニメーション時間 (ミリ秒)
);
```

補間が終わると自動的にフリーリストへ返却されるため、数千回トゥイーンを発行してもGCは完全にゼロです！

---

## 4. 飛び跳ねるダメージポップ演出の実装

敵に攻撃がヒットした瞬間に、小さなテキストスプライトを発生させ、上に向かってフワッと跳ね上がるアニメーションを適用します。

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

    const popup = this.add.text(startX, startY, `${rounded}`, {
      fontSize: 16,
      color: 0xfacc15, // クリティカルな黄色
    });

    // 1. 上方向にフワッと浮き上がるトゥイーン (300ms)
    this.tweens.add(
      popup.id,
      TweenProperty.Y,
      startY,
      startY - 35,
      350
    );

    // 2. スケールを大きくしてから収束させるポップ効果
    this.tweens.add(
      popup.id,
      TweenProperty.SCALE,
      22,
      12,
      350
    );
  }
```

これを第5章の `damageEnemy` 内で呼び出します：

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

レベルアップした瞬間、プレイヤーのサイズを一瞬大きく膨らませて元に戻す「パルスアニメーション」を加えます。

```typescript
  private applyLevelUpUpgrade(): void {
    // レベル表示のテキストを更新
    this.hudLevelText.text = `LV. ${this.playerLevel}`;

    // プレイヤーが「ドクン！」と一瞬巨大化して元に戻るトゥイーン
    this.tweens.add(
      this.player.id,
      TweenProperty.SCALE,
      44, // 一瞬 44px に膨張
      28, // 通常サイズ 28px へ復帰
      300 // 0.3秒間
    );
    // ...
  }
```

---

## 6. 動作確認

ゲームを起動して敵にブレードを当ててみましょう！

黄色いダメージ数字がポンポンと空中に跳ね上がり、倒したモンスターの数とタイムが画面左上でリアルタイムにカウントアップされます。
さらに、レベルアップ時にはプレイヤーが力強く脈動し、ゲームとしての爽快感が一気に極限まで高まりました！

視覚的な表現は完璧です。
続く第9章では、画面全体を揺らす**画面振動（スクリーンシェイク）**、被弾時の**ホワイトフラッシュ**、そして外部ファイルを一切使わない**Web Audio APIによるゼロ遅延シンセサウンド**を追加します！
