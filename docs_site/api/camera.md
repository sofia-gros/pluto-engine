# Camera (CameraManager)

`Camera` クラスは、シーン全体の視点（位置、ズーム、回転）を管理し、画面揺らし（シェイク）などの強力な演出機能を提供します。
PlutoEngine では `Scene` の初期化時に自動的にインスタンス化され、`this.camera` としてアクセスできます。

## プロパティ

- `x: number`: カメラの中心の X 座標。
- `y: number`: カメラの中心の Y 座標。
- `zoom: number`: ズーム倍率（デフォルトは `1.0`）。値が大きいほど拡大されます。
- `rotation: number`: カメラの回転角度（ラジアン）。

## メソッド

### `shake(intensity: number, duration: number)`
カメラを振動させる（画面揺らし）エフェクトを発動します。
- `intensity`: 揺れの強さ（ピクセル単位の最大オフセット）。
- `duration`: 揺れが収束するまでの時間（秒）。

```typescript
// プレイヤーがダメージを受けた時に画面を揺らす
this.camera.shake(10, 0.5); // 10pxの強度で0.5秒間揺らす
```

## レンダリングへの適用
カメラの各プロパティは、毎フレーム自動的に WebGL2/WebGPU のビュープロジェクション行列（Uniform）に反映され、シェーダー（WGSL）側で全インスタンスに対して一括で適用されます。
