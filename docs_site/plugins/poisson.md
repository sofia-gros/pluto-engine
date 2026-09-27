# ポアソン群集流体 (Continuum Crowds)

`@plutoengine/poisson` パッケージは、**流体力学ベースの群集シミュレーション (Continuum Crowds)** を実現する高度な物理プラグインです。
数万体の敵（群集）が、まるで水やスライムのように互いを避け合いながらプレイヤーに向かって流れるような滑らかな動きを、**ゼロアロケーション (GCフリー)** で計算します。

「囲碁盤のように画面をマス目に分割し、そのマスの人口密度（容量）に応じて敵の流れを変える」というアルゴリズムを、ヤコビ反復法を用いたポアソン方程式ソルバ（Poisson UIC）で解決しています。

## インストールと登録

```typescript
import { PoissonPlugin } from '@plutoengine/poisson';

export class MyScene extends Scene {
  public init() {
    // 画面をグリッドに分割 (幅, 高さ, セルサイズ)
    this.registerPlugin(new PoissonPlugin(800, 600, 24));
  }
}
```

## 使い方

毎フレーム、以下の3ステップで処理を行います。

1. **密度のスプラッティング (Splatting)**: 敵の現在位置をグリッドに書き込みます。
2. **ポアソン方程式の解決 (Solve)**: 人口密度から圧力の勾配を計算します。
3. **圧力勾配の適用 (Gradient)**: 敵が密度の高い場所（渋滞）を避けるベクトルを取得します。

```typescript
// 1. グリッドのクリア
this.poisson.clear();

// 2. 全敵エンティティの密度をマス目に書き込む
for (let i = 0; i < enemiesCount; i++) {
  this.poisson.splatDensity(enemyX[i], enemyY[i], 1.0);
}

// 3. 目標密度(例: 2.0)を超えた場所から圧力を計算
this.poisson.computeDivergence(2.0);
this.poisson.solve(3); // 3回反復

// 4. 計算結果（圧力勾配ベクトル）を敵の移動ベクトルに加算する
const grad = new Float32Array(2);
for (let i = 0; i < enemiesCount; i++) {
  this.poisson.getPressureGradient(enemyX[i], enemyY[i], grad);
  
  // 渋滞している方向とは逆向きの力が grad に入る
  enemyVelX[i] -= grad[0] * pushForce;
  enemyVelY[i] -= grad[1] * pushForce;
}
```

PhaserやPixiの一般的な実装では、このような流体力学演算は重すぎてブラウザではフリーズしてしまいますが、PlutoEngineではすべての計算が `Float32Array` 上のフラットループで行われるため、10万体の敵がいても60FPSを維持できます。
