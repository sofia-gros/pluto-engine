# 第7章: 経験値ジェム・ドロップとレベルアップ

敵を倒したら、プレイヤーを強化するための報酬が必要です。
サバイバー系ゲームの中毒性のある要素が、**敵が消滅した瞬間に飛び散る大量の経験値ジェム（XP Gems）と、それを磁石のように引き寄せてレベルアップする仕組み**です。

第7章では、PlutoEngine v1.2.1 の**`InstanceBufferArena`を用いたフリーリスト（Free List）によるスロット再利用の真骨頂**を体験しながら、ジェム収集とプレイヤー強化システムを実装します。

---

## 1. フリーリストが生み出す「完全循環エコシステム」

敵が倒れたとき、敵のIDは `this.instances.free(enemyId)` によってアリーナのフリーリストへ返却されます。
そして、その直後に経験値ジェムを生成するとどうなるでしょうか？

```
[ 敵が死亡 ] --> instances.free(id: 42) を呼ぶ (フリーリストに返却)
                    │
[ ジェム生成 ] <-- instances.allocate() が同じ (id: 42) を即座に払い出す！
```

**敵が死んでジェムが生まれる際、メモリアリーナの消費量は一切増えません。**
同じメモリスロットがそのままジェムとして再利用されるため、何万体の敵を倒してもヒープメモリのフットプリントは完全に一定に保たれ、ガベージコレクションによるスパイクも発生しません。

---

## 2. 経験値ジェムプールの設計

ジェムも同様に SoA (Structure of Arrays) パターンで管理します。

```typescript
const MAX_GEMS = 5000;

export class SwarmSurvivorScene extends Scene {
  // ... 前章までのプロパティ ...

  // 経験値ジェムプール
  private gemCount = 0;
  private readonly gemIds = new Int32Array(MAX_GEMS);
  private readonly gemValues = new Float32Array(MAX_GEMS);

  // プレイヤーの成長ステータス
  public playerLevel = 1;
  public playerXp = 0;
  public playerXpNeeded = 100;
  public magnetRadius = 130; // ジェムを引き寄せる磁石の半径 (px)
```

---

## 3. 敵死亡時のジェムドロップ処理

第5章の `damageEnemy` 関数を拡張し、HPが0になった瞬間にジェムを出現させます。

```typescript
  public damageEnemy(enemyIndex: number, amount: number): void {
    this.enemyHp[enemyIndex] -= amount;

    if (this.enemyHp[enemyIndex] <= 0) {
      const id = this.enemyIds[enemyIndex];
      const ex = this.instances.posX[id];
      const ey = this.instances.posY[id];

      // 1. 敵インスタンスを InstanceBufferArena に返却
      this.instances.free(id);

      // 2. 敵プールから O(1) スワップ削除
      const last = --this.enemyCount;
      this.enemyIds[enemyIndex] = this.enemyIds[last];
      this.enemyHp[enemyIndex] = this.enemyHp[last];
      this.enemySpeed[enemyIndex] = this.enemySpeed[last];

      // 3. ジェムのスポーン (最大容量内)
      if (this.gemCount < MAX_GEMS) {
        // 先ほど解放されたスロットが即座に再利用される！
        const gemId = this.instances.allocate();
        this.instances.posX[gemId] = ex;
        this.instances.posY[gemId] = ey;
        this.instances.scale[gemId] = 10;
        this.instances.color[gemId] = 0x34d399; // エメラルドグリーンの発光ジェム

        const gIdx = this.gemCount++;
        this.gemIds[gIdx] = gemId;
        this.gemValues[gIdx] = 10; // 10 XP
      }
    }
  }
```

---

## 4. ジェムの磁気吸引と獲得 (`updateGems`)

プレイヤーがジェムの磁石範囲（`magnetRadius`）に近づくと、ジェムがプレイヤーに向かって加速しながら吸い寄せられます。プレイヤーに触れると経験値が加算されます。
この処理内でも `new` によるメモリアロケーションを一切行わず、SoA配列に対して直接計算を適用します。

```typescript
  private updateGems(dt: number): void {
    const px = this.player.x;
    const py = this.player.y;
    const magnetSq = this.magnetRadius * this.magnetRadius;
    const pickupDistSq = 20 * 20; // 回収距離 20px
    const posX = this.instances.posX;
    const posY = this.instances.posY;

    for (let i = this.gemCount - 1; i >= 0; i--) {
      const id = this.gemIds[i];
      const gx = posX[id];
      const gy = posY[id];

      const dx = px - gx;
      const dy = py - gy;
      const distSq = dx * dx + dy * dy;

      // 磁気範囲内ならプレイヤーに向かって引き寄せる
      if (distSq < magnetSq) {
        const dist = Math.sqrt(distSq);
        const pullSpeed = 450 * dt; // 吸い寄せ速度

        posX[id] += (dx / dist) * pullSpeed;
        posY[id] += (dy / dist) * pullSpeed;

        // プレイヤーに接触したら回収
        if (distSq < pickupDistSq) {
          this.gainXp(this.gemValues[i]);

          // ジェムをアリーナから解放
          this.instances.free(id);

          // ジェムプールから O(1) スワップ削除
          const last = --this.gemCount;
          this.gemIds[i] = this.gemIds[last];
          this.gemValues[i] = this.gemValues[last];
        }
      }
    }
  }
```

---

## 5. レベルアップと強化の適用 (`gainXp`)

経験値が閾値を超えたらレベルアップし、プレイヤーの能力を強化します。

```typescript
  private gainXp(amount: number): void {
    this.playerXp += amount;

    if (this.playerXp >= this.playerXpNeeded) {
      this.playerXp -= this.playerXpNeeded;
      this.playerLevel++;
      // 必要経験値を 25% ずつ増加
      this.playerXpNeeded = Math.floor(this.playerXpNeeded * 1.25);

      // レベルアップ効果の適用
      this.applyLevelUpUpgrade();
    }
  }

  private applyLevelUpUpgrade(): void {
    console.log(`LEVEL UP! 現在のレベル: ${this.playerLevel}`);

    // レベルに応じて武器やステータスを強化
    switch (this.playerLevel % 3) {
      case 0:
        // 移動速度アップ
        this.playerSpeed += 25;
        console.log(`移動速度がアップ: ${this.playerSpeed} px/s`);
        break;
      case 1:
        // 磁石範囲拡大
        this.magnetRadius += 30;
        console.log(`磁石範囲が拡大: ${this.magnetRadius} px`);
        break;
      case 2:
        // 軌道ブレードの回転速度アップ
        this.bladeSpeed += 1.5;
        console.log(`ブレード回転速度が上昇: ${this.bladeSpeed}`);
        break;
    }
  }
```

---

## 6. 動作確認

ゲームを動かし、ブレードやダガーで敵を倒してみてください。
敵が消滅した場所にエメラルド色のジェムが散らばり、プレイヤーが近づくと吸い寄せられてレベルアップするゲームサイクルが動作します。
また WebGPU バックエンドの `RenderGraph` によって、膨大なジェムが描画されても極めて高いパフォーマンスを維持していることが確認できるはずです。

現在、レベルやステータスはコンソールに出力されていますが、画面上に数字やHPバーがなければプレイヤーに伝わりません。
続く第8章では、PlutoEngine の `add.text` と **ゼロアロケーション・Tweenシステム**を使って、HUDとダメージ数字（ポップアニメーション）を実装します。
