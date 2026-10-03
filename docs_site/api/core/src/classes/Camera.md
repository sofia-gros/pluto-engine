[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Camera

# Class: Camera

Defined in: [core/src/scene/Camera.ts:48](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L48)

## Constructors

### Constructor

> **new Camera**(`name?`): `Camera`

Defined in: [core/src/scene/Camera.ts:88](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L88)

#### Parameters

##### name?

`string` = `''`

#### Returns

`Camera`

## Properties

### backgroundColor

> **backgroundColor**: `number` = `0`

Defined in: [core/src/scene/Camera.ts:57](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L57)

背景色 (0xRRGGBB)。0 はエンジン既定の色を使用します

***

### name

> **name**: `string` = `''`

Defined in: [core/src/scene/Camera.ts:59](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L59)

このカメラの識別名

***

### rotation

> **rotation**: `number` = `0`

Defined in: [core/src/scene/Camera.ts:55](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L55)

回転 (ラジアン)

***

### shakeX

> **shakeX**: `number` = `0`

Defined in: [core/src/scene/Camera.ts:67](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L67)

***

### shakeY

> **shakeY**: `number` = `0`

Defined in: [core/src/scene/Camera.ts:68](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L68)

***

### visible

> **visible**: `boolean` = `true`

Defined in: [core/src/scene/Camera.ts:61](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L61)

カメラが有効かどうか。false なら描画しません

***

### x

> **x**: `number` = `0`

Defined in: [core/src/scene/Camera.ts:50](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L50)

スクロール位置 (ワールド座標)

***

### y

> **y**: `number` = `0`

Defined in: [core/src/scene/Camera.ts:51](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L51)

***

### zoom

> **zoom**: `number` = `1.0`

Defined in: [core/src/scene/Camera.ts:53](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L53)

ズーム倍率。1.0 が等倍です

## Accessors

### actualX

#### Get Signature

> **get** **actualX**(): `number`

Defined in: [core/src/scene/Camera.ts:545](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L545)

実際にレンダリングに使う X 座標 (シェイクを加味)。

##### Returns

`number`

***

### actualY

#### Get Signature

> **get** **actualY**(): `number`

Defined in: [core/src/scene/Camera.ts:550](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L550)

実際にレンダリングに使う Y 座標 (シェイクを加味)。

##### Returns

`number`

***

### angle

#### Get Signature

> **get** **angle**(): `number`

Defined in: [core/src/scene/Camera.ts:157](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L157)

回転を度で取得します (Phaser 互換の angle)。

##### Returns

`number`

#### Set Signature

> **set** **angle**(`degrees`): `void`

Defined in: [core/src/scene/Camera.ts:160](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L160)

##### Parameters

###### degrees

`number`

##### Returns

`void`

***

### centerX

#### Get Signature

> **get** **centerX**(): `number`

Defined in: [core/src/scene/Camera.ts:173](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L173)

##### Returns

`number`

#### Set Signature

> **set** **centerX**(`val`): `void`

Defined in: [core/src/scene/Camera.ts:176](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L176)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### centerY

#### Get Signature

> **get** **centerY**(): `number`

Defined in: [core/src/scene/Camera.ts:180](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L180)

##### Returns

`number`

#### Set Signature

> **set** **centerY**(`val`): `void`

Defined in: [core/src/scene/Camera.ts:183](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L183)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### fadeEffect

#### Get Signature

> **get** **fadeEffect**(): `number`

Defined in: [core/src/scene/Camera.ts:335](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L335)

##### Returns

`number`

***

### isFading

#### Get Signature

> **get** **isFading**(): `boolean`

Defined in: [core/src/scene/Camera.ts:306](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L306)

フェード実行中かどうか (Phaser 互換の isFading)。

##### Returns

`boolean`

***

### isFollowing

#### Get Signature

> **get** **isFollowing**(): `boolean`

Defined in: [core/src/scene/Camera.ts:264](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L264)

追従対象が設定されているかを取得します。

##### Returns

`boolean`

***

### progress

#### Get Signature

> **get** **progress**(): `number`

Defined in: [core/src/scene/Camera.ts:315](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L315)

フェードの進行度 (0〜1) を返します (Phaser 互換の progress)。

##### Returns

`number`

***

### scrollX

#### Get Signature

> **get** **scrollX**(): `number`

Defined in: [core/src/scene/Camera.ts:130](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L130)

##### Returns

`number`

#### Set Signature

> **set** **scrollX**(`val`): `void`

Defined in: [core/src/scene/Camera.ts:133](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L133)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### scrollY

#### Get Signature

> **get** **scrollY**(): `number`

Defined in: [core/src/scene/Camera.ts:137](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L137)

##### Returns

`number`

#### Set Signature

> **set** **scrollY**(`val`): `void`

Defined in: [core/src/scene/Camera.ts:140](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L140)

##### Parameters

###### val

`number`

##### Returns

`void`

## Methods

### centerOn()

> **centerOn**(`x`, `y`, `viewWidth?`, `viewHeight?`): `this`

Defined in: [core/src/scene/Camera.ts:190](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L190)

指定座標を画面中央に置くようにスクロール位置を設定します。

#### Parameters

##### x

`number`

##### y

`number`

##### viewWidth?

`number` = `0`

##### viewHeight?

`number` = `0`

#### Returns

`this`

***

### fadeComplete()

> **fadeComplete**(): `this`

Defined in: [core/src/scene/Camera.ts:295](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L295)

フェードを即座に完了させます (Phaser 互換の fadeComplete)。

#### Returns

`this`

***

### fadeIn()

> **fadeIn**(`duration`, `red?`, `green?`, `blue?`, `callback?`): `this`

Defined in: [core/src/scene/Camera.ts:273](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L273)

フェードインを開始します (Phaser 互換の fadeIn)。

#### Parameters

##### duration

`number`

##### red?

`number` = `0`

##### green?

`number` = `0`

##### blue?

`number` = `0`

##### callback?

() => `void`

#### Returns

`this`

***

### fadeOut()

> **fadeOut**(`duration`, `red?`, `green?`, `blue?`, `callback?`): `this`

Defined in: [core/src/scene/Camera.ts:284](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L284)

フェードアウトを開始します (Phaser 互換の fadeOut)。

#### Parameters

##### duration

`number`

##### red?

`number` = `0`

##### green?

`number` = `0`

##### blue?

`number` = `0`

##### callback?

() => `void`

#### Returns

`this`

***

### getCenter()

> **getCenter**(`out`, `viewWidth`, `viewHeight`): `this`

Defined in: [core/src/scene/Camera.ts:167](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L167)

画面中央のワールド座標を out へ書き出します (Phaser 互換の getCenter)。

#### Parameters

##### out

###### x

`number`

###### y

`number`

##### viewWidth

`number`

##### viewHeight

`number`

#### Returns

`this`

***

### getFadeColor()

> **getFadeColor**(`out`): `this`

Defined in: [core/src/scene/Camera.ts:342](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L342)

フェード色と不透明度を out へ書き出します (0〜1 に正規化済み)。

#### Parameters

##### out

`Float32Array`

#### Returns

`this`

***

### getWorldBounds()

> **getWorldBounds**(`out`, `viewWidth`, `viewHeight`): `this`

Defined in: [core/src/scene/Camera.ts:213](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L213)

画面可視範囲をワールド座標の矩形として out へ書き出します。

#### Parameters

##### out

[`BoundsRect`](../interfaces/BoundsRect.md)

##### viewWidth

`number`

##### viewHeight

`number`

#### Returns

`this`

***

### getWorldPoint()

> **getWorldPoint**(`screenX`, `screenY`, `viewWidth`, `viewHeight`, `out`): `this`

Defined in: [core/src/scene/Camera.ts:199](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L199)

スクリーン座標からワールド座標を復元します (Phaser 互換の getWorldPoint)。

#### Parameters

##### screenX

`number`

##### screenY

`number`

##### viewWidth

`number`

##### viewHeight

`number`

##### out

###### x

`number`

###### y

`number`

#### Returns

`this`

***

### pan()

> **pan**(`x`, `y`, `duration?`, `ease?`, `delay?`): `this`

Defined in: [core/src/scene/Camera.ts:357](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L357)

指定位置へ滑らかに移動します (Phaser 互換の pan)。

#### Parameters

##### x

`number`

##### y

`number`

##### duration?

`number` = `1000`

##### ease?

`boolean` = `false`

##### delay?

`number` = `0`

#### Returns

`this`

***

### setBackgroundColor()

> **setBackgroundColor**(`color`): `this`

Defined in: [core/src/scene/Camera.ts:225](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L225)

背景色を設定します (Phaser 互換の setBackgroundColor)。

#### Parameters

##### color

`string` \| `number`

#### Returns

`this`

***

### setFadeEffect()

> **setFadeEffect**(`effectId`): `this`

Defined in: [core/src/scene/Camera.ts:330](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L330)

フェードした範囲の描画矩形 (-1 で全画面)

#### Parameters

##### effectId

`number`

#### Returns

`this`

***

### setRotation()

> **setRotation**(`degrees`): `this`

Defined in: [core/src/scene/Camera.ts:151](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L151)

回転を度で設定します (Phaser 互換)。内部ではラジアンです。

#### Parameters

##### degrees

`number`

#### Returns

`this`

***

### setScroll()

> **setScroll**(`x`, `y`): `this`

Defined in: [core/src/scene/Camera.ts:112](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L112)

スクロール位置を設定し、チェーンのために this を返します。

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`this`

***

### setScrollX()

> **setScrollX**(`x`): `this`

Defined in: [core/src/scene/Camera.ts:119](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L119)

横スクロールを設定します (Phaser 互換の setScrollX)。

#### Parameters

##### x

`number`

#### Returns

`this`

***

### setScrollY()

> **setScrollY**(`y`): `this`

Defined in: [core/src/scene/Camera.ts:125](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L125)

縦スクロールを設定します (Phaser 互換の setScrollY)。

#### Parameters

##### y

`number`

#### Returns

`this`

***

### setZoom()

> **setZoom**(`value`): `this`

Defined in: [core/src/scene/Camera.ts:145](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L145)

ズームを設定し、チェーンのために this を返します。

#### Parameters

##### value

`number`

#### Returns

`this`

***

### shake()

> **shake**(`intensity`, `duration`): `void`

Defined in: [core/src/scene/Camera.ts:391](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L391)

画面を揺らすシェイクエフェクトを開始します。

#### Parameters

##### intensity

`number`

揺れの強さ

##### duration

`number`

揺れの持続時間 (秒)

#### Returns

`void`

***

### startFollow()

> **startFollow**(`targetId`, `lerpX?`, `lerpY?`): `this`

Defined in: [core/src/scene/Camera.ts:248](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L248)

指定スプライトを追従します (Phaser 互換の startFollow)。

補間は線形です。lerp が 0 ならスナップ移動になります。

#### Parameters

##### targetId

`number`

追従するスプライトの ID

##### lerpX?

`number` = `0`

X 方向の補間係数 (大きいほど遅く追従)

##### lerpY?

`number` = `0`

Y 方向の補間係数

#### Returns

`this`

***

### stopFollow()

> **stopFollow**(): `this`

Defined in: [core/src/scene/Camera.ts:256](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L256)

追従を解除します (Phaser 互換の stopFollow)。

#### Returns

`this`

***

### stopShake()

> **stopShake**(): `void`

Defined in: [core/src/scene/Camera.ts:398](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L398)

シェイクを即座に停止します (Phaser 互換の stopShake)。

#### Returns

`void`

***

### update()

> **update**(`dt`, `followX?`, `followY?`): `void`

Defined in: [core/src/scene/Camera.ts:415](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L415)

毎フレームの更新です。CameraManager から全カメラへ呼ばれます。

#### Parameters

##### dt

`number`

デルタタイム (秒)

##### followX?

`number` = `-1`

追従対象の世界座標 X (-1 で追従なし)

##### followY?

`number` = `-1`

追従対象の世界座標 Y

#### Returns

`void`

***

### zoomTo()

> **zoomTo**(`value`, `duration?`, `ease?`, `delay?`): `this`

Defined in: [core/src/scene/Camera.ts:376](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/Camera.ts#L376)

ズーム率を指定値へ滑らかに変化させます (Phaser 互換の zoomTo)。

#### Parameters

##### value

`number`

##### duration?

`number` = `1000`

##### ease?

`boolean` = `false`

##### delay?

`number` = `0`

#### Returns

`this`
