# SDFとポアソンディスクサンプリング (SDF Text & Poisson)

> **v1.2.1 の注意点**: PlutoEngine は現在、最大限のパフォーマンスを引き出すために WebGPU、`InstanceBufferArena`、SoA、および Flyweight pattern (Zero-Allocation) を利用しています。

2Dゲームにおいて、高品質なフォントレンダリングと自然なオブジェクト配置は重要です。PlutoEngine v1.2.1 ではこれをSDFプラグインで解決します。

## SDF (Signed Distance Field) フォント

通常のビットマップフォントは拡大するとピクセルが荒くなります。SDFは、文字の輪郭からの「距離」をテクスチャに保存する技術です。

PlutoEngineのWGSLレンダラは、このSDFテクスチャを読み込み、フラグメントシェーダ内でピクセルパーフェクトな滑らかな曲線をリアルタイムに描画します。
アウトライン（縁取り）やドロップシャドウなどのエフェクトも、シェーダ内の単純な算術計算でゼロコストで付与できます。

## ポアソンディスクサンプリング (Poisson Disk Sampling)

草、木、群衆などをマップ上にランダムかつ「自然に（重なりすぎずに）」配置するためのアルゴリズムです。
PlutoEngineのDODアーキテクチャでは、初期化時にこのアルゴリズムを走らせ、生成された大量の座標データを直接 `Float32Array` アリーナに一括ロードします。

実行時には完全なゼロアロケーションで、数万の草木をWGSLインスタンシングで描画します。

## Standalone Usage

```typescript
import { SDFCollider } from '@pluto-engine/sdf-collider';
const solver = new SDFCollider();
```

## Plugin Usage (this.registerPlugin)

```typescript
import { SdfPlugin } from '@pluto-engine/sdf-collider';

class MyScene extends Scene {
  constructor() {
    super();
    this.registerPlugin(new SdfPlugin());
  }

  update() {
    // SDFコライダの更新処理 (GCフリー)
    this.sdf.updateCollisions(this.arena);
  }
}
```
