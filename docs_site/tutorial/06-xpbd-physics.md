# 第6章: XPBDによる群衆のめり込み防止物理

第5章までで、プレイヤーの自動攻撃兵器によって無数の敵をなぎ倒せるようになりました。
しかし、画面をよく見ると不自然な点があります。**敵同士が衝突判定を持たないため、何千体ものモンスターが完全に重なり合い、まるで1個の点のように縮んでしまう「重なり問題（Clumping Issue）」**です。

群衆が1点に集まってしまうと、せっかくの「大群」の迫力が台無しになってしまいます。

第6章では、PlutoEngine の誇る高速物理演算技術 **XPBD（Extended Position Based Dynamics）** の思想を取り入れ、**数千体のモンスターがお互いを自然に押し合い、流体のように蠢く有機的な群衆物理（Anti-Clustering）**を実装します！

---

## 1. なぜ従来の力学（Force-Based）ではなく XPBD なのか？

Box2D などの従来の物理エンジンは、衝突時に「反発力（Force）」を計算して速度を積分します。しかし、数千体が密集する満員電車のような過密状態では：
- 力が累積してオブジェクトが画面外へ弾け飛ぶ（物理爆発）
- 振動（ジッター）が止まらなくなる
- 莫大な計算コストがかかる

一方、**XPBD（位置ベース動力学）**は、**「重なり合っている距離の分だけ、直接位置（Position）を押し戻す（Solve）」**アプローチをとります。
どれほど高密度に敵が密集しても絶対に発散（爆発）せず、極めて安定したシミュレーションを維持できます。

```
[ 敵 A ] <---- 重なり量 (Overlap) ----> [ 敵 B ]
   │                                       │
   └─── A を左へ 50% 戻す    B を右へ 50% 戻す ───┘
```

---

## 2. 空間グリッドを活用した反発ソルバの実装

第4章で構築した空間グリッド（Uniform Grid）を使えば、反発計算の相手も $O(1)$ の近傍探索で見つけ出せます。

```typescript
export class SwarmSurvivorScene extends Scene {
  // ... 前章までのプロパティ ...

  // 敵の衝突半径
  private readonly enemyRadius = 9; // 半径 9px (直径 18px)
  private readonly minSeparation = 18; // 理想的な最小離隔距離 (9 + 9)
  private readonly minSepSq = 18 * 18; // 2乗距離
```

### 反発制約の緩和処理 (`solveCrowdOverlap`)

敵の移動直後、空間ハッシュで隣り合う敵との距離をチェックし、重なりがあれば半分ずつ互いに押し戻します。

```typescript
  /**
   * XPBDの反発制約を適用し、敵同士のめり込みを解消する
   */
  private solveCrowdOverlap(): void {
    const posX = this.arena.posX;
    const posY = this.arena.posY;
    const count = this.enemyCount;
    const minSep = this.minSeparation;
    const minSepSq = this.minSepSq;

    for (let i = 0; i < count; i++) {
      const idA = this.enemyIds[i];
      const ax = posX[idA];
      const ay = posY[idA];

      // 敵Aの周囲にある敵Bを空間ハッシュから検索
      this.queryNearbyEnemies(ax, ay, minSep, (neighborIdx, idB) => {
        // 自分自身、または重複チェックを防ぐため index が大きいものだけ対象にする
        if (neighborIdx <= i) return;

        const bx = posX[idB];
        const by = posY[idB];

        const dx = bx - ax;
        const dy = by - ay;
        const distSq = dx * dx + dy * dy;

        // 重なりが発生している場合
        if (distSq < minSepSq && distSq > 0.0001) {
          const dist = Math.sqrt(distSq);
          // 重なり深度
          const overlap = minSep - dist;
          // 正規化された押し戻しベクトル
          const nx = dx / dist;
          const ny = dy / dist;

          // お互いに 50% ずつ反発させる (XPBD 位置制約投影)
          const push = overlap * 0.5;

          posX[idA] -= nx * push;
          posY[idA] -= ny * push;

          posX[idB] += nx * push;
          posY[idB] += ny * push;
        }
      });
    }
  }
```

---

## 3. 固定タイムステップ (`fixedUpdate`) への配置

物理演算はフレームレートの変動に影響されないよう、PlutoEngine の `fixedUpdate(1/60)` で実行するのが最も理想的です。

```typescript
  /**
   * 物理演算・決定論的シミュレーション
   * 1秒間にきっかり60回呼び出される
   */
  fixedUpdate(fixedDt: number): void {
    // 1. 空間グリッドを最新の位置で再構築
    this.buildSpatialGrid();

    // 2. XPBD反発ソルバを実行 (必要に応じて2回反復するとさらに硬い剛体になる)
    this.solveCrowdOverlap();
    this.solveCrowdOverlap();
  }
```

---

## 4. プレイヤーとの押し合い判定

敵だけでなく、プレイヤーと敵の間にも XPBD 押し戻しを適用します。これにより、モンスターがプレイヤーの体の中に侵入できなくなり、プレイヤーを巨大な群衆が取り囲んで圧迫するリアルなスリルが生まれます！

```typescript
  private solvePlayerOverlap(): void {
    const px = this.player.x;
    const py = this.player.y;
    const playerRadius = 14;
    const combinedRadius = playerRadius + this.enemyRadius;
    const combSq = combinedRadius * combinedRadius;

    this.queryNearbyEnemies(px, py, combinedRadius, (enemyIdx, id) => {
      const ex = this.arena.posX[id];
      const ey = this.arena.posY[id];
      const dx = ex - px;
      const dy = ey - py;
      const distSq = dx * dx + dy * dy;

      if (distSq < combSq && distSq > 0.001) {
        const dist = Math.sqrt(distSq);
        const overlap = combinedRadius - dist;
        // 敵だけを外側へ押し出す
        this.arena.posX[id] += (dx / dist) * overlap;
        this.arena.posY[id] += (dy / dist) * overlap;

        // プレイヤーに微小ダメージ
        this.playerHp -= 0.1;
      }
    });
  }
```

---

## 5. 動作確認: 蠢く生きた群衆！

ブラウザを更新してプレイしてみてください。

数千体の赤いモンスターたちが、**お互いの体を押し合い、プレイヤーの周囲に巨大な円陣を作りながら押し寄せてくる**はずです！
狭い通路を抜ける液体のように、モンスターが自然に回り込んでくるリアルな群衆挙動が、一切のフレーム低下なしに実現しました。

敵を倒し、群衆を押し返せるようになりましたが、ゲームには「報酬」が必要です。
続く第7章では、敵が倒れた場所にドロップする**経験値ジェム（XP Gems）と、プレイヤーのレベルアップシステム**を実装します！
