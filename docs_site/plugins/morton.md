# モートン順序と空間分割 (Morton Order / Z-Curve)

PlutoEngine は、数万のエンティティの衝突判定や描画順序の最適化のために、空間分割アルゴリズムである「モートン順序（Z-Curve）」プラグインを提供します。

## モートン順序とは？

モートン順序は、2次元（または3次元）の座標データを、空間の局所性を保ったまま1次元の整数値（モートンコード）にマッピングする手法です。
2進数のビットを交互にインターリーブ（交差）させることで計算されます。

```
X座標: 011
Y座標: 101
モートンコード: 100111
```

## CPU ベースの空間ハッシュ

一般的な四分木（Quadtree）は、木構造の生成やノードの再帰的走査でメモリアロケーション（GC）とポインタチェイスが発生するため、データ指向設計に反します。

PlutoEngine では、エンティティのX, Y座標からモートンコードを計算し、CPU 上でエンティティを空間的に近い順に並び替えます。これにより、広域衝突判定（Broad-phase Collision Detection）やカリングが、ポインタを一切使わない1次元配列のバイナリサーチや線形走査だけで高速に完了します。

> [!NOTE]
> WGSL コンピュートシェーダによる GPU ソートは将来の対応として検討中です。現行の実装は CPU 側で完結しています。

## Standalone Usage

```typescript
import { MortonSpatialHash } from '@pluto-engine/morton';
const solver = new MortonSpatialHash();
```

## Plugin Usage (this.registerPlugin)

```typescript
import { MortonPlugin } from '@pluto-engine/morton';

class MyScene extends Scene {
  constructor() {
    super();
    this.registerPlugin(new MortonPlugin());
  }

  update() {
    // Use it via this.spatialHash
    // this.spatialHash...
  }
}
```
