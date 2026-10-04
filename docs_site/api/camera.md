# Camera API リファレンス

`Camera` は 1 台分のビューポートとエフェクト（フェード、パン、ズーム、シェイクなど）を管理します。
位置・ズーム・回転はすべてゼロアロケーション（ヒープ割り当てなし）で扱われます。

## プロパティ

- `x: number` / `y: number` - スクロール位置（ワールド座標）
- `zoom: number` - ズーム倍率（1.0 が等倍）
- `rotation: number` - 回転（ラジアン）
- `backgroundColor: number` - 背景色
- `name: string` - カメラの識別名
- `visible: boolean` - カメラが有効かどうか
- `actualX: number` / `actualY: number` (Getter) - 実際にレンダリングに使われる座標（シェイクなどを加味）

## スクロール・トランスフォーム

### `setScroll(x: number, y: number): this`
スクロール位置を設定します。
### `setZoom(value: number): this`
ズーム倍率を設定します。
### `setRotation(degrees: number): this`
回転を度（degrees）で設定します。
### `centerOn(x: number, y: number, viewWidth?, viewHeight?): this`
指定座標が画面中央に来るようにスクロール位置を設定します。
### `getWorldPoint(screenX, screenY, viewWidth, viewHeight, out): this`
スクリーン座標からワールド座標を復元します。
### `getWorldBounds(out, viewWidth, viewHeight): this`
カメラの可視範囲をワールド座標の矩形として書き出します。

## 追従 (Follow)

### `startFollow(targetId: number, lerpX = 0, lerpY = 0): this`
指定したエンティティIDを追従します。lerp に 0 より大きい値を指定すると滑らかに追従します。
### `stopFollow(): this`
追従を解除します。

## エフェクト (Effects)

カメラエフェクトは固定長プールで管理され、`new` を発生させません。

### `fadeIn(duration, red?, green?, blue?, callback?): this`
フェードインを開始します。
### `fadeOut(duration, red?, green?, blue?, callback?): this`
フェードアウトを開始します。
### `pan(x, y, duration?, ease?, delay?): this`
指定位置へ滑らかにスクロール移動します。
### `zoomTo(value, duration?, ease?, delay?): this`
ズーム率を指定値へ滑らかに変化させます。
### `shake(intensity: number, duration: number): void`
画面を揺らすシェイクエフェクトを開始します。
### `stopShake(): void`
シェイクを即座に停止します。
