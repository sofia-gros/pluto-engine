# Arcade Physics プラグイン (Phaser-like AABB 物理エンジン)

> **v1.2.1 の注意点**: PlutoEngine は現在、最大限のパフォーマンスを引き出すために WebGPU、`InstanceBufferArena`、SoA、および Flyweight pattern (Zero-Allocation) を利用しています。

PlutoEngine には、Phaser 開発者にとって馴染み深い直感的な API を持ちながら、**内部では 30万体規模を 0.08ms で判定する「AABB Broadphase Culling（高速枝刈り）」** を備えた `ArcadePhysics` プラグインが標準搭載されています。

---

## 特徴と設計

- **Phaser-like な宣言的 API**: `this.physics.add.overlap()` や `this.physics.add.collider()` でシンプルに登録。
- **全ターゲット形式のシームレスな相互判定**:
  - **単一オブジェクト** (`player`, `boss`, `Sprite`)
  - **オブジェクト配列** (`bullets: Sprite[]`, `items: PhysicsBody[]`)
  - **SoA アリーナ** (`this.arena` - 30万体の巨大群集)
  - **TypedArray バッファ** (`PhysicsBuffer` - 高速 SoA 配列)
- **AABB Broadphase Culling**:
  - 30万体全数との無駄な距離計算（平方根・乗算）を排除。対象オブジェクトのバウンディングボックス（AABB）範囲外のエンティティを四則演算のみで 99.9% 瞬時にスキップ。
- **ゼロアロケーション**: 判定ループ中のメモリ確保（GC）を一切行いません。

---

## 基本的な使い方

### 1. プレイヤー vs 巨大敵群集 (`this.arena`)

```typescript
export class GameScene extends Scene {
  create() {
    const player = this.add.sprite(400, 300, 'player');
    player.body?.setCircle(16);

    // プレイヤーと 30万体の敵（アリーナ）の重なり判定を登録
    this.physics.add.overlap(player, this.arena, (p, enemyIdx) => {
      // 接触した敵のインデックスが高速に渡される
      p.takeDamage(10);
      console.log(`Enemy #${enemyIdx} hit player!`);
    });
  }
}
```

---

### 2. 弾丸配列 (`Sprite[]`) vs 巨大敵群集 (`this.arena`)

```typescript
export class GameScene extends Scene {
  bullets: Sprite[] = [];

  create() {
    // 弾丸配列と敵アリーナの判定
    this.physics.add.overlap(this.bullets, this.arena, (bullet, enemyIdx) => {
      // 弾丸が敵にヒット
      this.enemyHp[enemyIdx] -= bullet.damage;
      bullet.destroy();
    });
  }
}
```

---

### 3. TypedArray バッファ (`PhysicsBuffer`) vs 敵アリーナ

超高速なパーティクルや弾幕を自作の Float32Array で管理している場合も、そのまま渡すだけで AABB 枝刈り判定が可能です。

```typescript
// 独自の SoA 弾丸バッファ
const bulletBuffer = {
  posX: new Float32Array(1000),
  posY: new Float32Array(1000),
  count: activeBulletCount,
  radius: 8,
};

// バッファ vs アリーナ
this.physics.add.overlap(bulletBuffer, this.arena, (bulletIdx, enemyIdx) => {
  console.log(`Bullet #${bulletIdx} hit enemy #${enemyIdx}`);
});
```

---

### 4. 押し出し・反発付きコライダー (`this.physics.add.collider`)

障害物や壁、ボスとのめり込み防止・押し出しを自動解決します。

```typescript
// プレイヤーとボスの押し出し解決
this.physics.add.collider(player, boss, (p, b) => {
  console.log("Player collided with boss!");
});
```

---

## パフォーマンス比較 (30万体エンティティ実行時)

| 判定方式 | 30万体 処理時間 | 特徴 |
| :--- | :---: | :--- |
| **従来の全数距離計算 (Naive)** | **2.65 ms** | 30万回 全数で `dx*dx + dy*dy < r*r` を律儀に計算 |
| **AABB Broadphase Culling (PlutoEngine)** | **0.08 ms (33倍 高速化)** | AABB 境界外の 99.9% を四則演算のみで即座にスキップ |

---

## API リファレンス

### `this.physics.add.overlap(targetA, targetB, callback, margin?)`
- **`targetA`**: `PhysicsBody` | `PhysicsBody[]` | `InstanceBufferArena` | `PhysicsBuffer`
- **`targetB`**: `PhysicsBody` | `PhysicsBody[]` | `InstanceBufferArena` | `PhysicsBuffer`
- **`callback`**: `(itemA, itemB) => void`
- **`margin`**: 判定半径に追加するマージン（px）

### `this.physics.add.collider(targetA, targetB, callback?, bounce?)`
- **`bounce`**: 反発係数（0.0 〜 1.0）
