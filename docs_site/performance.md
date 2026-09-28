# パフォーマンス & ベンチマーク (Performance & Benchmarks)

PlutoEngineは、**ゼロアロケーション (Zero-Allocation)**、**Structure of Arrays (SoA)**、そして **WebGL2 / WebGPU のGPUインスタンシング** を活用し、ブラウザ上で数十万体規模のエンティティを高速・安定して動かすために設計された次世代2Dゲームエンジンです。

---

## 📊 インタラクティブ・ベンチマークダッシュボード

実ブラウザ環境（Playwright Headed 実行、GPUアクセラレーション有効）にて 2.5万体〜30万体 までの群集シミュレーションを実行した実測データです。

<BenchmarkChart />

---

## 新旧バージョンの詳細比較 (v1.0.7 vs v1.0.8)

**v1.0.8** では、エンジンのコアメモリアーキテクチャに抜本的なデータ指向（Data-Oriented Design）最適化を導入しました。

### 1. Data Packing の完全消滅 (0.0 ms化)
- **旧 (v1.0.7)**: エンティティの死亡時に `active[i] = 0` のフラグ管理をしていたため、毎フレーム全配列をループして生存エンティティのみを詰める「Data Packing」処理が発生し、30万体で約 **6.3ms** のCPU時間を浪費していました。
- **新 (v1.0.8)**: **Swap-Remove Sparse Set** パターンを採用。死亡エンティティは最後尾の生存エンティティとスワップされるため、データ配列は常に先頭から `activeCount` まで完全に密（Dense）に保たれます。これによりパッキング処理自体が**完全に不要（0.0ms）**になりました。

### 2. CPU ➔ GPU 転送量の 75% 削減 (Dirty Flags)
- **旧 (v1.0.7)**: 毎フレーム、全インスタンスの全属性（位置、回転、スケール、UV、Tint 等）を無条件で GPU バッファへ一括転送していました。
- **新 (v1.0.8)**: 属性ごとの **Dirty Flags** (`dirtyPos`, `dirtyScale`, `dirtyUv` 等) を導入。位置 `(posX, posY)` のみ更新された場合は静的なスケールやテクスチャUVのバッファ転送を自動スキップし、毎フレームの転送帯域を **約75% 削減** しました。

---

### 計測環境スペック

| 項目 | スペック |
| :--- | :--- |
| **OS** | Microsoft Windows 11 Pro |
| **CPU** | AMD Ryzen 7 2700 Eight-Core Processor |
| **GPU** | NVIDIA GeForce RTX 4060 |
| **RAM** | 32 GB |
| **ブラウザ / ランタイム** | Chromium (Playwright Headed / 144Hz) |
| **計測フレーム数** | 各エンティティ数ごとに 45フレームの統計（P5 / P50 / P95） |

---

### 30万体 (300k Entities) シミュレーション時の詳細プロファイリング比較

| 処理項目 (Task) | v1.0.7 (旧) | v1.0.8 (新) | 改善率 | 最適化の技術的要因 |
| :--- | :---: | :---: | :---: | :--- |
| **Poisson Solver** | 0.90 ms | **0.18 ms** | **5.0x 高速化** | 128x128 圧力場のSoAフラット配列最適化 |
| **Entity Update / Sim** | 20.10 ms | **15.99 ms** | **+25% 高速化** | Sparse Set による密配列走査（`active` 分岐チェック排除） |
| **Data Packing** | 6.30 ms | **0.00 ms** | **100% 削減 (消滅)** | 密配列の `subarray()` をそのまま WebGL2 バッファへ直渡し |
| **WebGL Upload (CPU→GPU)** | 2.00 ms | **0.32 ms** | **-84% 削減** | Dirty Flags による非変更属性バッファの転送スキップ |
| **Draw Call (WebGL2)** | 0.09 ms | **0.08 ms** | **極小** | 単一の `drawArraysInstanced` 呼出し |
| **合計 CPU 時間 (1 Frame)** | **~29.39 ms** | **~16.57 ms** | **約1.8倍 高速化** | **30万体で 40 FPS（旧 14 FPS）を達成** |

---

## アーキテクチャのコア原則

1. **TypedArray SoA (Structure of Arrays)**:
   すべてのエンティティプロパティは `Float32Array` や `Int32Array` にフラットに連続配置されています。JavaScript オブジェクト（`{}`）の動的生成がゼロであるため、GC（ガベージコレクション）によるフレーム落ちが原理的に発生しません。

2. **GPU インスタンシング**:
   更新された `Float32Array` の部分配列（`subarray(0, activeCount)`）をそのまま GPU バッファへ転送し、1回のドローコール (`drawArraysInstanced`) で数十万体を一括描画します。

3. **ポアソン群集流体 (Continuum Crowds)**:
   10万〜30万体の敵同士を O(N²) で当たり判定する代わりに、グリッド上に密度をスプラットしポアソン方程式を解くことで、自然な群集の密集・回避行動を **O(N)** の極めて低い計算量で実現しています。
