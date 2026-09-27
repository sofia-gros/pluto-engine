# 第5章: 自動攻撃システムと飛び道具

大群サバイバーゲーム（Survivor系）の醍醐味といえば、**プレイヤーの操作に関わらず全自動で発動し、敵の大群をなぎ倒すド派手な武器システム**です！

第5章では、2つの強力な自動攻撃兵器を実装します：
1. **軌道エネルギーブレード (Orbiting Blades)**: プレイヤーの周囲を高速旋回し、接近する敵をミンチにする回転刃。
2. **追尾マジックダガー (Magic Daggers)**: 一定間隔で最寄りの敵を自動検知し、一直線に高速射出される魔法の短剣。

第4章で作成した空間ハッシュを活用し、数千体の敵との当たり判定を毎フレーム超高速に処理します。

---

## 1. 武器 1: 軌道エネルギーブレードの実装

プレイヤーの周囲を回転するブレードスプライトを3本生成し、三角関数で公転運動させます。

```typescript
export class SwarmSurvivorScene extends Scene {
  // ... 前章のプロパティ ...

  // 軌道ブレードの管理
  private readonly bladeCount = 3;
  private readonly bladeIds = new Int32Array(3);
  private bladeAngle = 0;       // 現在の回転角度 (ラジアン)
  private readonly bladeRadius = 75; // 公転半径 (px)
  private readonly bladeSpeed = 4.0; // 回転角速度 (rad/s)
  private readonly bladeDamage = 15; // 接触ダメージ

  private initWeapons(): void {
    // 3本のブレードスプライトをアリーナから確保 (サイズ 20px)
    for (let i = 0; i < this.bladeCount; i++) {
      const blade = this.add.sprite(0, 0, 20);
      blade.setTint(0xfacc15); // まばゆい黄金色 (0xfacc15)
      this.bladeIds[i] = blade.id;
    }
  }
```

### ブレードの回転更新と当たり判定

毎フレーム角度を進め、ブレードの位置を更新しつつ、ブレードの周囲にある敵に対してダメージを与えます。

```typescript
  private updateBlades(dt: number): void {
    this.bladeAngle += this.bladeSpeed * dt;
    const px = this.player.x;
    const py = this.player.y;
    const posX = this.arena.posX;
    const posY = this.arena.posY;

    for (let i = 0; i < this.bladeCount; i++) {
      const id = this.bladeIds[i];
      // 3本のブレードを均等 (120度ずつ) に配置
      const angle = this.bladeAngle + (i * Math.PI * 2) / this.bladeCount;

      const bx = px + Math.cos(angle) * this.bladeRadius;
      const by = py + Math.sin(angle) * this.bladeRadius;

      posX[id] = bx;
      posY[id] = by;

      // ブレードの半径 18px 以内にいる敵を空間ハッシュで検索
      this.queryNearbyEnemies(bx, by, 18, (enemyIdx) => {
        this.damageEnemy(enemyIdx, this.bladeDamage * dt * 10);
      });
    }
  }
```

---

## 2. 武器 2: 自動照準マジックダガーの実装

飛び道具（弾）も、ヒープ確保を避けるために固定サイズのプールで管理します。

```typescript
const MAX_PROJECTILES = 200;

export class SwarmSurvivorScene extends Scene {
  // 飛び道具プール
  private projCount = 0;
  private readonly projIds = new Int32Array(MAX_PROJECTILES);
  private readonly projVelX = new Float32Array(MAX_PROJECTILES);
  private readonly projVelY = new Float32Array(MAX_PROJECTILES);
  private readonly projLife = new Float32Array(MAX_PROJECTILES);

  // ダガー発射タイマー
  private daggerTimer = 0;
  private readonly daggerInterval = 0.4; // 0.4秒ごとに発射
```

### 最寄りの敵を自動探索して発射 (`fireDagger`)

空間ハッシュを利用して、プレイヤーから最も近い敵を探索します。

```typescript
  private fireDagger(): void {
    if (this.projCount >= MAX_PROJECTILES) return;

    const px = this.player.x;
    const py = this.player.y;

    // 最寄りの敵を探す
    let closestEnemyId = -1;
    let closestDistSq = 500 * 500; // 射程 500px

    this.queryNearbyEnemies(px, py, 500, (enemyIdx, id) => {
      const dx = this.arena.posX[id] - px;
      const dy = this.arena.posY[id] - py;
      const dSq = dx * dx + dy * dy;
      if (dSq < closestDistSq) {
        closestDistSq = dSq;
        closestEnemyId = id;
      }
    });

    // 射程内に敵がいれば発射
    if (closestEnemyId !== -1) {
      const targetX = this.arena.posX[closestEnemyId];
      const targetY = this.arena.posY[closestEnemyId];
      const dx = targetX - px;
      const dy = targetY - py;
      const dist = Math.hypot(dx, dy);

      const bulletSpeed = 500; // 弾速 500 px/s
      const sprite = this.add.sprite(px, py, 14);
      sprite.setTint(0x38bdf8); // スカイブルー

      const idx = this.projCount++;
      this.projIds[idx] = sprite.id;
      this.projVelX[idx] = (dx / dist) * bulletSpeed;
      this.projVelY[idx] = (dy / dist) * bulletSpeed;
      this.projLife[idx] = 1.5; // 1.5秒生存
    }
  }
```

### 弾の移動と敵への着弾処理

```typescript
  private updateProjectiles(dt: number): void {
    const posX = this.arena.posX;
    const posY = this.arena.posY;

    for (let i = this.projCount - 1; i >= 0; i--) {
      const id = this.projIds[i];

      // 弾を前進
      posX[id] += this.projVelX[i] * dt;
      posY[id] += this.projVelY[i] * dt;
      this.projLife[i] -= dt;

      let hit = false;
      // 弾の周囲 16px の敵と接触判定
      this.queryNearbyEnemies(posX[id], posY[id], 16, (enemyIdx) => {
        if (!hit) {
          hit = true;
          this.damageEnemy(enemyIdx, 30); // 30ダメージ
        }
      });

      // 寿命切れ、または敵に着弾したら消滅 (プールから削除してアリーナに返却)
      if (hit || this.projLife[i] <= 0) {
        this.arena.free(id); // アリーナのフリーリストに返却 (ゼロGC)

        // 配列末尾の要素と入れ替えて O(1) 削除
        const last = --this.projCount;
        this.projIds[i] = this.projIds[last];
        this.projVelX[i] = this.projVelX[last];
        this.projVelY[i] = this.projVelY[last];
        this.projLife[i] = this.projLife[last];
      }
    }
  }
```

---

## 3. ダメージ処理と敵の撃破

敵のHPを減らし、0以下になったらアリーナから解放します。

```typescript
  public damageEnemy(enemyIndex: number, amount: number): void {
    this.enemyHp[enemyIndex] -= amount;

    // HPが0以下なら撃破
    if (this.enemyHp[enemyIndex] <= 0) {
      const id = this.enemyIds[enemyIndex];
      this.arena.free(id); // スロットをフリーリストに返却！

      // 敵プールから O(1) でスワップ削除
      const last = --this.enemyCount;
      this.enemyIds[enemyIndex] = this.enemyIds[last];
      this.enemyHp[enemyIndex] = this.enemyHp[last];
      this.enemySpeed[enemyIndex] = this.enemySpeed[last];
    }
  }
```

---

## 4. 動作確認

ゲームを実行すると、黄金の3本刃がプレイヤーの周囲を高速でうなりを上げて回転し、近づく敵を次々に一掃していきます！
さらに、自動照準の青い魔法の短剣が周囲のモンスターへ矢継ぎ早に放たれ、一気に爽快感あふれるアクションサバイバーゲームに変貌しました。

しかし、まだ敵同士がお互いを無視して1点に重なり合ってしまう問題が残っています。
次の第6章では、物理ソルバ **XPBD（Extended Position Based Dynamics）**を組み込み、モンスター同士がリアルに押し合いへし合う有機的な群衆物理を実装します！
