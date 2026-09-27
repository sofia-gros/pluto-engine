# 第4章: モートン空間ハッシュによる超高速近傍探索

第3章では、5,000体を超える敵モンスターを画面に出現させ、60FPS以上で滑らかに追跡させることに成功しました。
しかし、ここで巨大な壁にぶつかります。それが**当たり判定の「$O(N^2)$ の罠」**です。

5,000体の敵とプレイヤーの攻撃や武器の当たり判定を愚直（総当たり）に計算すると：
$$\text{判定回数} = 5,000 \times 5,000 = 25,000,000 \text{ 回 / フレーム}$$
60FPSの場合、**1秒間に15億回もの平方根（距離計算）**が走ることになり、どんな最新CPUでも一瞬でフリーズしてしまいます。

第4章では、PlutoEngine の**モートン空間ハッシュ（MortonPlugin）**を導入し、当たり判定の計算量を $O(1)$ の超高速探索に短縮します！

---

## 1. 空間分割（Uniform Spatial Grid）の仕組み

空間分割とは、ゲームワールド全体を格子（セル）に区切り、各エンティティが「どのセルに存在するか」を登録しておく技術です。
弾や武器が敵を探すときは、**自分の周囲の数セルだけ**を走査すればよいため、チェック対象が5,000体からわずか10〜20体に激減します！

```
+----+----+----+----+
|    |    |  * |    |  <-- 愚直に全画面を探すのではなく、
+----+----+----+----+
|    | P  | ** |    |  <-- 武器(P)の周囲 3x3 セルの敵(*)だけを
+----+----+----+----+      ピンポイントで探索する！
|    |    |  * |    |
+----+----+----+----+
```

---

## 2. MortonPlugin の登録

PlutoEngine には、モートンコード（Z-order Curve）を用いた超高速な空間ハッシュパッケージ `@pluto-engine/morton` が用意されています。
プラグインとして登録するだけで、シーン内にゼロアロケーションの空間ハッシュが注入されます。

```typescript
import { Scene } from '@pluto-engine/core';
import { MortonPlugin } from '@pluto-engine/morton';

export class SwarmSurvivorScene extends Scene {
  constructor() {
    super(10000); // 最大1万体
    
    // セルサイズ64でモートン空間ハッシュを登録
    // (自動で this.spatialHash が注入されます)
    this.registerPlugin(new MortonPlugin(64));
  }
}
```

---

## 3. グリッドの構築 (`build`)

毎フレーム、敵の移動が終わった直後に、空間ハッシュにエンティティを登録し、構築を行います。

```typescript
  public sysUpdate(dt: number): void {
    super.sysUpdate(dt);

    // 1. ハッシュをクリア
    this.spatialHash.clear();

    // 2. エンティティを登録
    for (let i = 0; i < this.arena.capacity; i++) {
      if (this.arena.active[i] === 0) continue;
      this.spatialHash.addEntity(i, this.arena.posX[i], this.arena.posY[i]);
    }

    // 3. 空間ハッシュの構築
    this.spatialHash.build();
  }
```

---

## 4. 近傍の敵を $O(1)$ で検索する (`query`)

指定した座標と半径の範囲内にある敵を検索するには、 `this.spatialHash.query` を使用します。
結果を受け取るための配列を事前に用意しておくことで、アロケーションゼロで検索結果を取得できます。

```typescript
  private queryResult = new Uint32Array(64);

  public attackNearbyEnemies(px: number, py: number, radius: number): void {
    // 検索実行 (戻り値は見つかったエンティティ数)
    const count = this.spatialHash.query(px, py, radius, this.queryResult);

    for (let i = 0; i < count; i++) {
      const enemyId = this.queryResult[i];
      // enemyId にダメージを与えるなどの処理
      this.damageEnemy(enemyId);
    }
  }
```

---

## 5. モートン空間ハッシュの親和性

モートン順序に沿ってエンティティを管理することで、空間的に近くにあるエンティティがメモリ上でも連続して配置される傾向になり、キャッシュヒット率の向上や並列処理への最適化が容易になります。

---

## 6. まとめと次章予告

空間ハッシュプラグインの導入により、**5,000体もの敵が存在しても、当たり判定にかかるCPU時間はわずか 0.2ms 未満**になりました！

準備は万全です！続く第5章では、プレイヤーの周囲を高速回転する「回転エネルギーブレード」と、最寄りの敵を自動で撃ち抜く「追尾マジックミサイル」の**自動攻撃武器システム**を実装します！
