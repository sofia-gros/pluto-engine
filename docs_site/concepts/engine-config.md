# エンジン設定と初期化 (Engine Configuration)

PlutoEngineは、ゼロアロケーション（Zero-Allocation）とデータ指向設計（DOD）を中核に据えたブラウザ向け超高性能2Dゲームエンジンです。
エンジンの初期化時にすべてのアリーナ（メモリ領域）を事前確保するため、ゲームループ内でのガベージコレクション（GC）スパイクを完全に排除します。

## コア設計思想

1. **ゼロアロケーション (Zero-Allocation)**
   `update` や `render` のクリティカルパスにおいて、`new` オペレータや配列・オブジェクトリテラルの生成を一切行いません。これにより、ブラウザ特有のGCによるカクつきを防ぎます。
2. **データ指向設計 (Data-Oriented Design / SoA)**
   オブジェクト指向 (AoS) のクラスインスタンスの配列ではなく、Structure of Arrays (SoA) としてコンポーネントデータを `Float32Array` や `Uint32Array` などのフラットなTypedArrayで管理します。
3. **WGSL-First レンダリング**
   WebGPUを最大限に活かすため、すべてのレンダリングロジックはコンピュートシェーダと密接に連携するWGSLファーストな設計を採用しています。

## 初期化フロー

```typescript
import { Engine, EngineConfig } from 'pluto-engine';

const config: EngineConfig = {
  canvas: document.getElementById('gameWebGPU') as HTMLCanvasElement,
  maxEntities: 100000,       // 確保するエンティティの最大数
  targetFPS: 60,             // 目標フレームレート
  memoryPoolSize: 1024 * 1024 * 64, // 64MBの共有メモリプール
};

const engine = new Engine(config);
await engine.init();
engine.start();
```

初期化時に `maxEntities` の数だけTypedArrayのインデックス領域が確保され、ゲーム中はそのインデックスを再利用する（フリーリストなどの手法）ことで動作します。
