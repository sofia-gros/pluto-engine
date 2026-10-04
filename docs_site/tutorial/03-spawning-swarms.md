# 第3章: 数千体の敵大群（スウォーム）出現

第2章で軽快に動くプレイヤーが完成しました。
第3章では、いよいよ本チュートリアルの真骨頂である**「数千体の敵モンスター（スウォーム）が画面外から一斉に押し寄せる」**システムを構築します！

従来のエンジンでは、500体のスプライトを動かすだけでFPSが激減していました。しかし PlutoEngine v1.2.1 なら、**5,000体以上の敵がプレイヤー目掛けて殺到しても、WebGPU バックエンドと InstanceBufferArena による一括バッチ描画により、まったく処理落ちしません**。

---

## 1. データ指向による敵プール (Enemy Pool) の設計

敵モンスターの管理も、ゼロアロケーションの原則（SoA: Structure of Arrays）に従います。`Enemy` クラスのインスタンスを数千個配列に `push` するのではなく、**事前確保されたフラットな TypedArray (Float32Array / Int32Array)** で敵のステータスを管理します。

```typescript
// 敵管理用の定数
const MAX_ENEMIES = 10000;

export class SwarmSurvivorScene extends Scene {
  // ... プレイヤーのプロパティ ...

  // 敵管理用 SoA 配列
  private enemyCount = 0;
  private readonly enemyIds = new Int32Array(MAX_ENEMIES);
  private readonly enemyHp = new Float32Array(MAX_ENEMIES);
  private readonly enemySpeed = new Float32Array(MAX_ENEMIES);

  // スポーンタイマー (ミリ秒ではなく秒で蓄積)
  private spawnTimer = 0;
  private readonly spawnInterval = 0.1; // 0.1秒ごとにスポーン
```

---

## 2. 画面外の円周上からのスポーン処理

プレイヤーを取り囲むように、画面外の一定半径 $R \approx 600\text{px}$ の円周上に敵をランダムに配置します。

```typescript
  /**
   * 敵を一定数スポーンさせる
   * @param count 一度に生成する敵の数
   */
  private spawnEnemies(count: number): void {
    const spawnRadius = 600; // 画面外の円周半径
    const px = this.player.x;
    const py = this.player.y;

    for (let i = 0; i < count; i++) {
      if (this.enemyCount >= MAX_ENEMIES) break;

      // ランダムな角度 (0 〜 2π)
      const angle = Math.random() * Math.PI * 2;
      const spawnX = px + Math.cos(angle) * spawnRadius;
      const spawnY = py + Math.sin(angle) * spawnRadius;

      // InstanceBufferArena から新しいスプライトIDを割り当て (サイズ 18px)
      const sprite = this.add.sprite(spawnX, spawnY, 'textureKey').setDisplaySize(18, 18);
      // 深紅のモンスターカラー (0xef4444)
      sprite.setTint(0xef4444);

      // 敵プールの末尾に登録
      const idx = this.enemyCount++;
      this.enemyIds[idx] = sprite.id;
      this.enemyHp[idx] = 20; // HP 20
      this.enemySpeed[idx] = 90 + Math.random() * 40; // 速度 90〜130 px/s
    }
  }
```

---

## 3. 数千体の敵を一括追跡移動させる (Swarm Update)

毎フレーム、登録されているすべての敵について、プレイヤーへの方向ベクトルを計算して移動させます。

InstanceBufferArena の型付き配列（`this.arena.posX`, `this.arena.posY`）をローカル変数に参照させてループを回すことで、JITコンパイラが最速のポインタ走査コードを生成します。ループ内で `new` は一切使用しません（ゼロアロケーション）。

```typescript
  /**
   * 全ての敵をプレイヤーに向かって前進させる
   */
  private updateEnemies(dt: number): void {
    const px = this.player.x;
    const py = this.player.y;
    
    // InstanceBufferArena のバッファを直接参照
    const posX = this.arena.posX;
    const posY = this.arena.posY;
    const facing = this.arena.facing;

    const count = this.enemyCount;
    for (let i = 0; i < count; i++) {
      const id = this.enemyIds[i];

      // プレイヤーへの相対ベクトル
      const dx = px - posX[id];
      const dy = py - posY[id];
      const dist = Math.hypot(dx, dy);

      if (dist > 1.0) {
        // ベクトルを正規化して移動
        const step = (this.enemySpeed[i] * dt) / dist;
        posX[id] += dx * step;
        posY[id] += dy * step;

        // プレイヤーのいる方向に向きを切り替え
        facing[id] = dx < 0 ? -1.0 : 1.0;
      }
    }
  }
```

---

## 4. `update(dt)` への統合

`update` メソッド内でタイマーを進め、大量の敵を連続生成します。

```typescript
  update(dt: number): void {
    // 1. プレイヤーの移動
    this.updatePlayer(dt);

    // 2. 敵のスポーンタイマー
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer -= this.spawnInterval;
      // 1回のインターバルで 15 体スポーン (秒間 150 体増加！)
      this.spawnEnemies(15);
    }

    // 3. 敵の移動更新
    this.updateEnemies(dt);
  }
```

---

## 5. 動作確認: 驚愕の 5,000 体同時描画！

ブラウザをリロードしてみましょう！
四方八方から、真っ赤な敵の群れが渦を巻きながらプレイヤーに迫ってきます。

ブラウザの DevTools（F12）の Performance タブを開いてみてください。
**敵の数が 1,000、2,000、3,000、5,000体と増え続けても、RenderGraph を介した WebGPU バックエンドの最適化により、フレームレートは 60 FPS または 144 FPS の上限に張り付いたまま、ノコギリ状のGCスパイクが一切現れない**ことに驚くはずです！

しかし、この状態では敵同士が1点に重なってしまったり、当たり判定を愚直に計算すると $O(N^2)$ の計算爆発が起きてしまいます。
続く第4章では、この大群の衝突判定を最適化する **XPBDPlugin (Extended Position Based Dynamics)** と、空間を高速検索する **MortonPlugin (モートンコードベースの空間ハッシュ)** を導入します！
