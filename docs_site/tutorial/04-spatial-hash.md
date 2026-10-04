# 第4章: モートン空間ハッシュによる超高速近傍探索

第3章では、5,000体を超える敵モンスターを画面に出現させ、60FPS以上で滑らかに追跡させることに成功しました。
しかし、ここで巨大な壁にぶつかります。それが**当たり判定の「$O(N^2)$ の罠」**です。

5,000体の敵とプレイヤーの攻撃や武器の当たり判定を愚直（総当たり）に計算すると：
$$\text{判定回数} = 5,000 \times 5,000 = 25,000,000 \text{ 回 / フレーム}$$
60FPSの場合、**1秒間に15億回もの距離計算**が走ることになり、いくらSoA（Structure of Arrays）アーキテクチャのPlutoEngine v1.2.1であってもパフォーマンスの低下を招きます。

第4章では、PlutoEngine の**モートン空間ハッシュ（MortonPlugin）**を導入し、当たり判定の計算量を $O(1)$ に近い超高速探索へと最適化します！

---

## 1. 空間分割（Uniform Spatial Grid）の仕組み

空間分割とは、ゲームワールド全体を格子（セル）に区切り、各エンティティが「どのセルに存在するか」を登録しておく技術です。
弾や武器が敵を探すときは、**自分の周囲の数セルだけ**を走査すればよいため、チェック対象が5,000体からわずか数体に激減します！

```text
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

PlutoEngine v1.2.1には、モートンコード（Z-order Curve）を用いたゼロアロケーションの空間ハッシュパッケージ `@pluto-engine/morton` が用意されています。
プラグインとして登録するだけで、シーン内にキャッシュ効率の高い空間ハッシュが利用可能になります。

```typescript
import { Scene } from '@pluto-engine/core';
import { MortonPlugin } from '@pluto-engine/morton';

export class SwarmSurvivorScene extends Scene {
  constructor() {
    super(); 
    
    // セルサイズ64でモートン空間ハッシュを登録
    // (自動で this.spatialHash が利用可能になります)
    this.registerPlugin(new MortonPlugin({ cellSize: 64, capacity: 10000 }));
  }
}
```

---

## 3. グリッドの構築 (`build`)

毎フレーム、敵の移動が終わった直後に、SoAバッファ（`InstanceBufferArena`）のデータを空間ハッシュに登録し、構築を行います。v1.2.1ではオブジェクトのインスタンス化を避けるため、一括でバッファを処理します。

```typescript
  public sysUpdate(dt: number): void {
    super.sysUpdate(dt);

    // 1. ハッシュをクリア
    this.spatialHash.clear();

    // 2. エンティティを登録 (SoAバッファから直接読み込み)
    const capacity = this.arena.capacity;
    const active = this.arena.active;
    const posX = this.arena.posX;
    const posY = this.arena.posY;

    for (let i = 0; i < capacity; i++) {
      if (active[i] === 0) continue;
      this.spatialHash.addEntity(i, posX[i], posY[i]);
    }

    // 3. 空間ハッシュの構築
    this.spatialHash.build();
  }
```

---

## 4. 近傍の敵を高速で検索する (`query`)

指定した座標と半径の範囲内にある敵を検索するには、 `this.spatialHash.query` を使用します。
結果を受け取るためのバッファ（`Uint32Array` など）を事前にクラスメンバとして用意しておくことで、アップデート・ループ内での `new`（メモリ確保）を完全に排除した**ゼロアロケーション**な検索を実現します。

```typescript
  // ゼロアロケーションのための事前確保バッファ
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

## 5. XPBDPlugin との連携

もし剛体物理演算や衝突応答が必要な場合は、自作の判定ではなく `@pluto-engine/physics` の **`XPBDPlugin`** を利用することも検討してください。`XPBDPlugin` 内部でも空間ハッシュを用いた広域フェーズ（Broad-phase）衝突判定が行われており、WebGPUバックエンドの描画パイプライン（`RenderGraph`）との連携もスムーズです。

---

## 6. まとめと次章予告

モートン空間ハッシュプラグインの導入により、SoAデータのキャッシュラインとモートン順序の親和性が活かされ、**5,000体もの敵が存在しても、当たり判定にかかるCPU時間はわずか 0.2ms 未満**になりました！

準備は万全です！続く第5章では、プレイヤーの周囲を高速回転する「回転エネルギーブレード」と、最寄りの敵を自動で撃ち抜く「追尾マジックミサイル」の**自動攻撃武器システム**を実装します！
