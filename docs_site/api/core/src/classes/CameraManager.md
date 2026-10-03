[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / CameraManager

# Class: CameraManager

Defined in: [core/src/scene/CameraManager.ts:19](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/CameraManager.ts#L19)

## Constructors

### Constructor

> **new CameraManager**(`scene`): `CameraManager`

Defined in: [core/src/scene/CameraManager.ts:25](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/CameraManager.ts#L25)

#### Parameters

##### scene

[`Scene`](Scene.md)

#### Returns

`CameraManager`

## Accessors

### count

#### Get Signature

> **get** **count**(): `number`

Defined in: [core/src/scene/CameraManager.ts:38](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/CameraManager.ts#L38)

登録済みカメラの数。

##### Returns

`number`

***

### main

#### Get Signature

> **get** **main**(): [`Camera`](Camera.md)

Defined in: [core/src/scene/CameraManager.ts:33](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/CameraManager.ts#L33)

最も前面のカメラ (Phaser 互換の this.cameras.main)。

##### Returns

[`Camera`](Camera.md)

## Methods

### add()

> **add**(`x?`, `y?`, `name?`): [`Camera`](Camera.md)

Defined in: [core/src/scene/CameraManager.ts:46](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/CameraManager.ts#L46)

カメラを追加します (Phaser 互換の this.cameras.add)。
上限 (MAX_CAMERAS) を超える場合は null を返します。

#### Parameters

##### x?

`number` = `0`

##### y?

`number` = `0`

##### name?

`string` = `''`

#### Returns

[`Camera`](Camera.md)

***

### collectForRender()

> **collectForRender**(`out`): `number`

Defined in: [core/src/scene/CameraManager.ts:81](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/CameraManager.ts#L81)

描画対象となるカメラを列挙します。
毎フレーム new しないよう、呼び出し側の配列へ書き込みます。

#### Parameters

##### out

[`Camera`](Camera.md)[]

出力先。カメラ数だけ上書きします

#### Returns

`number`

書き込んだカメラ数

***

### getCamera()

> **getCamera**(`name`): [`Camera`](Camera.md)

Defined in: [core/src/scene/CameraManager.ts:62](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/CameraManager.ts#L62)

名前でカメラを取得します (Phaser 互換の this.cameras.getCamera)。

#### Parameters

##### name

`string`

#### Returns

[`Camera`](Camera.md)

***

### getCameras()

> **getCameras**(): [`Camera`](Camera.md)[]

Defined in: [core/src/scene/CameraManager.ts:70](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/CameraManager.ts#L70)

すべてのカメラのリストを返します (Phaser 互換の this.cameras.getCameras)。
ゼロアロケーション（使い回し）のため、内部配列をそのまま返します。

#### Returns

[`Camera`](Camera.md)[]

***

### update()

> **update**(`dt`, `followId?`, `followX?`, `followY?`): `void`

Defined in: [core/src/scene/CameraManager.ts:98](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/CameraManager.ts#L98)

追従を 1 フレーム進めます。

#### Parameters

##### dt

`number`

デルタタイム (秒)

##### followId?

`number` = `-1`

追従対象の ID (-1 で追従なし)

##### followX?

`number` = `-1`

追従対象の世界座標 X

##### followY?

`number` = `-1`

追従対象の世界座標 Y

#### Returns

`void`
