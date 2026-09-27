# Camera / CameraManager

2Dワールドの描画範囲や視点を管理するシステムです。カメラの移動、ズーム、シェイクなどの演出をサポートします。

## 概要 (Overview)

シーンごとに複数のカメラを持つことができますが、デフォルトで1つの `main` カメラが用意されています。
カメラのトランスフォーム（位置、スケール、回転）は行列演算に変換され、レンダリング時にシェーダーへと渡されます。

### アーキテクチャの内部設計
- **Float32Array マトリックス**: カメラのビュー行列およびプロジェクション行列は `Float32Array` として保持され、WebGL に直接転送可能な形式となっています。

## 使用例 (Usage)

```typescript
export class MainScene extends Scene {
  create() {
    // カメラのスクロール設定
    this.cameras.main.x = 100;
    this.cameras.main.y = 200;

    // カメラのズーム
    this.cameras.main.zoom = 1.5;

    // カメラシェイク
    this.cameras.main.shake(500, 0.05);

    // バウンズの設定（画面外へ出ないようにする）
    this.cameras.main.setBounds(0, 0, 2000, 2000);
  }
}
```

## メソッド (Methods)

### `shake(duration, intensity)`
カメラを揺らすエフェクトを再生します。

| パラメータ | 型 | デフォルト | 説明 |
| :--- | :--- | :--- | :--- |
| `duration` | `number` | - | シェイクの持続時間（ミリ秒）。 |
| `intensity` | `number` | `0.05` | 揺れの強さ。 |

### `setBounds(x, y, width, height)`
カメラが移動可能な境界領域を設定します。

| パラメータ | 型 | 説明 |
| :--- | :--- | :--- |
| `x` | `number` | 境界の左上の X 座標。 |
| `y` | `number` | 境界の左上の Y 座標。 |
| `width` | `number` | 境界の幅。 |
| `height` | `number` | 境界の高さ。 |

## プロパティ (Properties)

- `x` (number): カメラの中心または左上のX座標（スクロール量）。
- `y` (number): カメラの中心または左上のY座標（スクロール量）。
- `zoom` (number): カメラのズーム倍率（デフォルト `1.0`）。
