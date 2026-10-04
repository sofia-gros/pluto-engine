---
title: Camera
---

# Camera

## Properties

### `x`

**Type:** `number`

スクロール位置 (ワールド座標)

### `y`

**Type:** `number`



### `zoom`

**Type:** `number`

ズーム倍率。1.0 が等倍です

### `rotation`

**Type:** `number`

回転 (ラジアン)

### `backgroundColor`

**Type:** `number`

背景色 (0xRRGGBB)。0 はエンジン既定の色を使用します

### `name`

**Type:** `string`

このカメラの識別名

### `visible`

**Type:** `boolean`

カメラが有効かどうか。false なら描画しません

### `shakeX`

**Type:** `number`



### `shakeY`

**Type:** `number`



## Methods

### `setScroll(x: number, y: number)`

**Returns:** `this`

スクロール位置を設定し、チェーンのために this を返します。

### `setScrollX(x: number)`

**Returns:** `this`

横スクロールを設定します (Phaser 互換の setScrollX)。

### `setScrollY(y: number)`

**Returns:** `this`

縦スクロールを設定します (Phaser 互換の setScrollY)。

### `setZoom(value: number)`

**Returns:** `this`

ズームを設定し、チェーンのために this を返します。

### `setRotation(degrees: number)`

**Returns:** `this`

回転を度で設定します (Phaser 互換)。内部ではラジアンです。

### `getCenter(out: { x: number; y: number; }, viewWidth: number, viewHeight: number)`

**Returns:** `this`

画面中央のワールド座標を out へ書き出します (Phaser 互換の getCenter)。

### `centerOn(x: number, y: number, viewWidth?: number, viewHeight?: number)`

**Returns:** `this`

指定座標を画面中央に置くようにスクロール位置を設定します。

### `getWorldPoint(screenX: number, screenY: number, viewWidth: number, viewHeight: number, out: { x: number; y: number; })`

**Returns:** `this`

スクリーン座標からワールド座標を復元します (Phaser 互換の getWorldPoint)。

### `getWorldBounds(out: import("A:/Project/plute-engine/packages/core/src/arena/Sprite").BoundsRect, viewWidth: number, viewHeight: number)`

**Returns:** `this`

画面可視範囲をワールド座標の矩形として out へ書き出します。

### `setBackgroundColor(color: string | number)`

**Returns:** `this`

背景色を設定します (Phaser 互換の setBackgroundColor)。

### `startFollow(targetId: number, lerpX?: number, lerpY?: number)`

**Returns:** `this`

指定スプライトを追従します (Phaser 互換の startFollow)。

補間は線形です。lerp が 0 ならスナップ移動になります。

### `stopFollow()`

**Returns:** `this`

追従を解除します (Phaser 互換の stopFollow)。

### `fadeIn(duration: number, red?: number, green?: number, blue?: number, callback?: (() =&gt; void) | undefined)`

**Returns:** `this`

フェードインを開始します (Phaser 互換の fadeIn)。

### `fadeOut(duration: number, red?: number, green?: number, blue?: number, callback?: (() =&gt; void) | undefined)`

**Returns:** `this`

フェードアウトを開始します (Phaser 互換の fadeOut)。

### `fadeComplete()`

**Returns:** `this`

フェードを即座に完了させます (Phaser 互換の fadeComplete)。

### `setFadeEffect(effectId: number)`

**Returns:** `this`

フェードした範囲の描画矩形 (-1 で全画面)

### `getFadeColor(out: Float32Array&lt;ArrayBufferLike&gt;)`

**Returns:** `this`

フェード色と不透明度を out へ書き出します (0〜1 に正規化済み)。

### `pan(x: number, y: number, duration?: number, ease?: boolean, delay?: number)`

**Returns:** `this`

指定位置へ滑らかに移動します (Phaser 互換の pan)。

### `zoomTo(value: number, duration?: number, ease?: boolean, delay?: number)`

**Returns:** `this`

ズーム率を指定値へ滑らかに変化させます (Phaser 互換の zoomTo)。

### `shake(intensity: number, duration: number)`

**Returns:** `void`

画面を揺らすシェイクエフェクトを開始します。

### `stopShake()`

**Returns:** `void`

シェイクを即座に停止します (Phaser 互換の stopShake)。

### `update(dt: number, followX?: number, followY?: number)`

**Returns:** `void`

毎フレームの更新です。CameraManager から全カメラへ呼ばれます。

