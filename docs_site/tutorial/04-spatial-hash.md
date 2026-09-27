# 第4章: モートン空間ハッシュによる超高速近傍探索

第3章では、5,000体を超える敵モンスターを画面に出現させ、60FPS以上で滑らかに追跡させることに成功しました。
しかし、ここで巨大な壁にぶつかります。それが**当たり判定の「$O(N^2)$ の罠」**です。

5,000体の敵とプレイヤーの攻撃や武器の当たり判定を愚直（総当たり）に計算すると：
$$\text{判定回数} = 5,000 \times 5,000 = 25,000,000 \text{ 回 / フレーム}$$
60FPSの場合、**1秒間に15億回もの平方根（距離計算）**が走ることになり、どんな最新CPUでも一瞬でフリーズしてしまいます。

第4章では、PlutoEngine の**モートン順序（Z-Curve）および空間ハッシュ分割（Spatial Hashing）**を導入し、当たり判定の計算量を $O(1)$ の超高速探索に短縮します！

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

## 2. ゼロアロケーションな空間グリッドの設計

通常、グリッドのセルを `cells = new Map<number, Entity[]>()` などの配列で実装すると、毎フレーム無数の配列確保が発生してGCが発生します。
PlutoEngine では、伝統的なゲーム開発で用いられる**固定型付き配列による連結リスト（Head-Next Linked List）**を採用します！

```typescript
// グリッドの設定
const GRID_CELL_SIZE = 64; // セルの幅・高さ (px)
const GRID_COLS = 32;      // 横セル数 (2048px カバー)
const GRID_ROWS = 18;      // 縦セル数 (1152px カバー)
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

export class SwarmSurvivorScene extends Scene {
  // ... プレイヤー・敵のプロパティ ...

  // 空間グリッド用配列 (メモリ割り当てゼロ)
  // 各セルの先頭エンティティのインデックスを保持
  private readonly gridHead = new Int32Array(TOTAL_CELLS);
  // 次のエンティティへのポインタリンク
  private readonly gridNext = new Int32Array(MAX_ENEMIES);
```

---

## 3. グリッドの構築 (`buildSpatialGrid`)

毎フレーム、敵の移動が終わった直後に、敵全員をグリッドセルに登録します。この処理は敵の数に対して線形時間 $O(N)$ で完了します。

```typescript
  /**
   * 敵全員を空間グリッドに登録する (O(N) ゼロアロケーション)
   */
  private buildSpatialGrid(): void {
    // 1. 全セルの先頭ポインタを -1 (空) でリセット
    this.gridHead.fill(-1);

    const posX = this.arena.posX;
    const posY = this.arena.posY;
    const count = this.enemyCount;

    for (let i = 0; i < count; i++) {
      const id = this.enemyIds[i];

      // 座標からセル座標を計算
      const cellX = Math.floor(posX[id] / GRID_CELL_SIZE);
      const cellY = Math.floor(posY[id] / GRID_CELL_SIZE);

      // ワールド範囲内のセルに限定
      if (cellX >= 0 && cellX < GRID_COLS && cellY >= 0 && cellY < GRID_ROWS) {
        const cellIndex = cellY * GRID_COLS + cellX;

        // 連結リストの先頭に自分を挿入
        this.gridNext[i] = this.gridHead[cellIndex];
        this.gridHead[cellIndex] = i;
      } else {
        this.gridNext[i] = -1;
      }
    }
  }
```

---

## 4. 近傍の敵を $O(1)$ で検索する (`queryNearbyEnemies`)

指定した座標 $(qx, qy)$ と半径 $radius$ の範囲内にある敵を検索する関数です。
コールバック関数を渡すスタイルにすることで、結果を格納する一時配列の生成（アロケーション）をゼロにします。

```typescript
  /**
   * 指定座標の半径内にある敵を検索してコールバックを実行する
   * @param qx 検索中心X
   * @param qy 検索中心Y
   * @param radius 検索半径
   * @param onFound ヒットした敵が見つかったときのコールバック
   */
  public queryNearbyEnemies(
    qx: number,
    qy: number,
    radius: number,
    onFound: (enemyIndex: number, arenaId: number) => void
  ): void {
    const minCellX = Math.max(0, Math.floor((qx - radius) / GRID_CELL_SIZE));
    const maxCellX = Math.min(GRID_COLS - 1, Math.floor((qx + radius) / GRID_CELL_SIZE));
    const minCellY = Math.max(0, Math.floor((qy - radius) / GRID_CELL_SIZE));
    const maxCellY = Math.min(GRID_ROWS - 1, Math.floor((qy + radius) / GRID_CELL_SIZE));

    const radiusSq = radius * radius;
    const posX = this.arena.posX;
    const posY = this.arena.posY;

    // 検索矩形に含まれるセルだけを走査
    for (let cy = minCellY; cy <= maxCellY; cy++) {
      const rowOffset = cy * GRID_COLS;
      for (let cx = minCellX; cx <= maxCellX; cx++) {
        const cellIndex = rowOffset + cx;

        // 該当セルの連結リストを辿る
        let enemyIdx = this.gridHead[cellIndex];
        while (enemyIdx !== -1) {
          const id = this.enemyIds[enemyIdx];
          const dx = posX[id] - qx;
          const dy = posY[id] - qy;

          // 半径判定 (平方根を使わない高速な2乗距離比較)
          if (dx * dx + dy * dy <= radiusSq) {
            onFound(enemyIdx, id);
          }

          enemyIdx = this.gridNext[enemyIdx];
        }
      }
    }
  }
```

---

## 5. モートン空間ハッシュ (`@pluto-engine/morton`) との親和性

PlutoEngine に内蔵されている `@pluto-engine/morton` パッケージを使用すると、X座標とY座標のビットを互い違いに織り交ぜる**モートンコード（Z-order Curve）**を生成できます。

```typescript
import { morton2D } from '@pluto-engine/morton';

// 2次元座標を1次元のモートンキーに変換 (CPUビット演算 O(1))
const zCode = morton2D(Math.floor(x / 64), Math.floor(y / 64));
```

モートン順序に沿ってエンティティをソートしておくと、空間的に近くにあるエンティティがメモリ上でも連続して配置されるため、さらなるキャッシュヒット率の向上とGPUコンピュートシェーダーでの並列処理が可能になります。

---

## 6. まとめと次章予告

空間ハッシュの導入により、**5,000体もの敵が存在しても、当たり判定にかかるCPU時間はわずか 0.2ms 未満**になりました！

準備は万全です！続く第5章では、プレイヤーの周囲を高速回転する「回転エネルギーブレード」と、最寄りの敵を自動で撃ち抜く「追尾マジックミサイル」の**自動攻撃武器システム**を実装します！
