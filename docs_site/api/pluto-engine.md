# PlutoEngine API リファレンス

`PlutoEngine` は Phaser の `new Phaser.Game(config)` に相当するエンジンのエントリポイントです。
レンダリングループ、時間管理、スケール、シーン遷移、および GPU への SoA バッファストリーミングを統括します。

## 概要

```typescript
import { PlutoEngine } from '@pluto-engine/core';

const engine = new PlutoEngine({
  width: 800,
  height: 600,
  maxInstances: 100000,
  scene: [MainScene]
});
```

## プロパティ

- `scene: SceneManager`
  シーン管理マネージャー。アクティブなシーンの切り替えなどを管理します。
- `config: EngineConfig`
  初期化時に渡されたエンジン設定。
- `scale: ScaleManager`
  画面のスケールやリサイズを管理します。
- `time: TimeStepManager`
  ゲームループの経過時間や FPS を管理します。
- `loop: GameLoop`
  メインの実行ループ。
- `device: GraphicsDevice | null`
  WebGPU のグラフィックスデバイス。
- `totalInstanceCount: number`
  登録済みインスタンス総数（カリング前）。
- `renderCount: number`
  実際に描画したインスタンス数（カリング後）。

## パフォーマンス計測プロパティ

- `packTimeMs: number`
  SoA から vec4 へのパック時間（常に構造的に 0）。
- `cullTimeMs: number`
  カリング処理にかかった時間（ミリ秒）。
- `uploadTimeMs: number`
  GPU への転送にかかった時間。
- `drawTimeMs: number`
  描画（ドローコール）にかかった時間。
- `gpuCullingActive: boolean`
  直近のフレームで GPU カリングが実際に有効だったか。

## メソッド

### `destroy(): void`
エンジンインスタンスとレンダラー、アニメーションループを破棄・解放します。

## インターフェース

### `EngineConfig`
エンジンの初期化設定。
- `canvas?: HTMLCanvasElement | string`
- `width?: number`
- `height?: number`
- `scaleMode?: ScaleMode`
- `pixelArt?: boolean`
- `maxInstances?: number` - (デフォルト: 100000) 最大スプライト数
- `backend?: 'auto' | 'webgpu' | 'webgl2'`
- `gpuCulling?: boolean` - GPU カリングを有効にするか
- `gpuComputeCulling?: boolean`
- `scene: (new () => Scene)[]` - 登録するシーンクラスの配列
