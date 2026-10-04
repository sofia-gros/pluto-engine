# 第5章: 自動攻撃システムと飛び道具

大群サバイバーゲーム（Survivor系）の醍醐味といえば、**プレイヤーの操作に関わらず全自動で発動し、敵の大群をなぎ倒すド派手な武器システム**です！

第5章では、PlutoEngine v1.2.1 の新しい設計に沿って2つの強力な自動攻撃兵器を実装します：
1. **軌道エネルギーブレード (Orbiting Blades)**: プレイヤーの周囲を高速旋回し、接近する敵をミンチにする回転刃。
2. **追尾マジックダガー (Magic Daggers)**: 一定間隔で最寄りの敵を自動検知し、一直線に高速射出される魔法の短剣。

第4章で紹介した `MortonPlugin` (モートンコードによる空間ハッシュ) を活用し、数千体の敵との当たり判定を毎フレーム超高速に処理します。

---

## 1. 武器 1: 軌道エネルギーブレードの実装

プレイヤーの周囲を回転するブレードスプライトを `InstanceBufferArena` から3つ確保し、三角関数で公転運動させます。

```typescript
import { MortonSpatialHash, InstanceBufferArena } from 'pluto-engine';

export class SwarmSurvivorScene {
  // ... 前章のプロパティ ...

  // 軌道ブレードの管理
  private readonly bladeCount = 3;
  private readonly bladeIds = new Int32Array(3);
  private bladeAngle = 0;       // 現在の回転角度 (ラジアン)
  private readonly bladeRadius = 75; // 公転半径 (px)
  private readonly bladeSpeed = 4.0; // 回転角速度 (rad/s)
  private readonly bladeDamage = 15; // 接触ダメージ

  private initWeapons(arena: InstanceBufferArena): void {
    for (let i = 0; i < this.bladeCount; i++) {
      // 3本のブレードスプライトをアリーナから確保 (サイズ 20px)
      const id = arena.allocate();
      arena.setScale(id, 20);
      arena.setTint(id, 0xfacc15); // まばゆい黄金色 (0xfacc15)
      this.bladeIds[i] = id;
    }
  }
```

### ブレードの回転更新と当たり判定

毎フレーム角度を進め、ブレードの位置を更新しつつ、ブレードの周囲にある敵に対してダメージを与えます。

```typescript
  private updateBlades(dt: number, arena: InstanceBufferArena, morton: MortonSpatialHash): void {
    this.bladeAngle += this.bladeSpeed * dt;
    const px = arena.posX[this.playerId];
    const py = arena.posY[this.playerId];

    for (let i = 0; i < this.bladeCount; i++) {
      const id = this.bladeIds[i];
      // 3本のブレードを均等 (120度ずつ) に配置
      const angle = this.bladeAngle + (i * Math.PI * 2) / this.bladeCount;

      const bx = px + Math.cos(angle) * this.bladeRadius;
      const by = py + Math.sin(angle) * this.bladeRadius;

      arena.setPosX(id, bx);
      arena.setPosY(id, by);

      // ブレードの半径 18px 以内にいる敵をMortonPluginで高速検索
      const queryCount = morton.query(bx, by, 18, this.queryResult);
      for (let j = 0; j < queryCount; j++) {
        const enemyIdx = this.queryResult[j];
        this.damageEnemy(enemyIdx, this.bladeDamage * dt * 10, arena);
      }
    }
  }
```

---

## 2. 武器 2: 自動照準マジックダガーの実装

飛び道具（弾）も、ヒープ確保（GC）を避けるために固定サイズのプール (SoA構造) で管理します。

```typescript
const MAX_PROJECTILES = 200;

export class SwarmSurvivorScene {
  // 飛び道具プール (SoA)
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

`MortonPlugin` の空間ハッシュを利用して、プレイヤーから最も近い敵を探索します。

```typescript
  private fireDagger(arena: InstanceBufferArena, morton: MortonSpatialHash): void {
    if (this.projCount >= MAX_PROJECTILES) return;

    const px = arena.posX[this.playerId];
    const py = arena.posY[this.playerId];

    // 最寄りの敵を探す
    let closestEnemyId = -1;
    let closestDistSq = 500 * 500; // 射程 500px

    const queryCount = morton.query(px, py, 500, this.queryResult);
      for (let j = 0; j < queryCount; j++) {
        const id = this.queryResult[j];
      const dx = arena.posX[id] - px;
      const dy = arena.posY[id] - py;
      const dSq = dx * dx + dy * dy;
      if (dSq < closestDistSq) {
        closestDistSq = dSq;
        closestEnemyId = id;
      }
    }

    // 射程内に敵がいれば発射
    if (closestEnemyId !== -1) {
      const targetX = arena.posX[closestEnemyId];
      const targetY = arena.posY[closestEnemyId];
      const dx = targetX - px;
      const dy = targetY - py;
      const dist = Math.hypot(dx, dy);

      const bulletSpeed = 500; // 弾速 500 px/s
      const id = arena.allocate();
      arena.setScale(id, 14);
      arena.setPosX(id, px);
      arena.setPosY(id, py);
      arena.setTint(id, 0x38bdf8); // スカイブルー

      const idx = this.projCount++;
      this.projIds[idx] = id;
      this.projVelX[idx] = (dx / dist) * bulletSpeed;
      this.projVelY[idx] = (dy / dist) * bulletSpeed;
      this.projLife[idx] = 1.5; // 1.5秒生存
    }
  }
```

### 弾の移動と敵への着弾処理

```typescript
  private updateProjectiles(dt: number, arena: InstanceBufferArena, morton: MortonSpatialHash): void {
    for (let i = this.projCount - 1; i >= 0; i--) {
      const id = this.projIds[i];

      // 弾を前進
      const px = arena.posX[id] + this.projVelX[i] * dt;
      const py = arena.posY[id] + this.projVelY[i] * dt;
      arena.setPosX(id, px);
      arena.setPosY(id, py);
      this.projLife[i] -= dt;

      let hit = false;
      // 弾の周囲 16px の敵と接触判定
      const queryCount = morton.query(px, py, 16, this.queryResult);
      for (let j = 0; j < queryCount; j++) {
        const enemyIdx = this.queryResult[j];
        if (!hit) {
          hit = true;
          this.damageEnemy(enemyIdx, 30, arena); // 30ダメージ
        }
      }

      // 寿命切れ、または敵に着弾したら消滅 (プールから削除してアリーナに返却)
      if (hit || this.projLife[i] <= 0) {
        arena.free(id); // アリーナのフリーリストに返却 (ゼロGC)

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

敵のHPを減らし、0以下になったら `InstanceBufferArena` から解放します。

```typescript
  public damageEnemy(enemyIndex: number, amount: number, arena: InstanceBufferArena): void {
    this.enemyHp[enemyIndex] -= amount;

    // HPが0以下なら撃破
    if (this.enemyHp[enemyIndex] <= 0) {
      const id = this.enemyIds[enemyIndex];
      arena.free(id); // スロットをフリーリストに返却！

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
次の第6章では、物理ソルバ **`XPBDPlugin`（Extended Position Based Dynamics）**を組み込み、モンスター同士がリアルに押し合いへし合う有機的な群衆物理を実装します！
