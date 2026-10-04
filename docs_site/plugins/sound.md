# オーディオプラグイン (SoundManager)

> **v1.2.1 の注意点**: PlutoEngine は現在、最大限のパフォーマンスを引き出すために WebGPU、`InstanceBufferArena`、SoA、および Flyweight pattern (Zero-Allocation) を利用しています。

`@pluto-engine/audio` は、Web Audio API をフル活用した強力なサウンドシステムです。PlutoEngine v1.2.1 では、大量の敵が同時に爆発した際などに音が割れる（クリッピングする）のを防ぐマスターリミッターや、GC（ガベージコレクション）スパイクを防ぐオーディオノードの事前割り当てプーリング機構を内蔵しています。

## インストールと登録

```typescript
import { SoundPlugin } from '@pluto-engine/audio';

export class MyScene extends Scene {
  public init() {
    // Scene にオーディオ機能を注入
    this.registerPlugin(new SoundPlugin());
  }

  public create() {
    // 事前割り当て済みプールから音を再生 (GCフリー)
    this.sound.play('explosion', { volume: 0.8 });
  }
}
```

## 主な機能

### 1. ゼロアロケーション・プーリング
Web Audio APIの仕様上 `AudioBufferSourceNode` は使い捨てですが、PlutoEngine では空間オーディオ用の `PannerNode` や音量制御の `GainNode` を再利用可能な `VoiceNode` としてプールし、メモリ確保のオーバーヘッドを極限まで削っています。再生ループ内でのオブジェクトの確保は発生しません。

### 2. マスターリミッター
出力の最終段に `DynamicsCompressorNode` が接続されているため、100個のサウンドエフェクトが完全に同時に鳴っても、耳を劈くようなノイズが発生しません。

### 3. 空間オーディオ (Spatial Panning)
ステレオパンニングに対応しています。
```typescript
this.sound.play('laser', { pan: -1.0 }); // 左から鳴る
this.sound.play('laser', { pan: 1.0 });  // 右から鳴る
```
