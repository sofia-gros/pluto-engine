[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / ScaleManager

# Class: ScaleManager

Defined in: [core/src/scale/ScaleManager.ts:21](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L21)

## Constructors

### Constructor

> **new ScaleManager**(`config?`): `ScaleManager`

Defined in: [core/src/scale/ScaleManager.ts:36](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L36)

#### Parameters

##### config?

`Partial`\<[`ScaleConfig`](../interfaces/ScaleConfig.md)\> = `{}`

#### Returns

`ScaleManager`

## Properties

### autoCenter

> **autoCenter**: `boolean`

Defined in: [core/src/scale/ScaleManager.ts:26](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L26)

***

### displaySize

> `readonly` **displaySize**: `object`

Defined in: [core/src/scale/ScaleManager.ts:29](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L29)

#### height

> **height**: `number` = `0`

#### width

> **width**: `number` = `0`

***

### gameSize

> `readonly` **gameSize**: `object`

Defined in: [core/src/scale/ScaleManager.ts:28](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L28)

#### height

> **height**: `number` = `0`

#### width

> **width**: `number` = `0`

***

### height

> **height**: `number`

Defined in: [core/src/scale/ScaleManager.ts:23](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L23)

***

### mode

> **mode**: [`ScaleMode`](../enumerations/ScaleMode.md)

Defined in: [core/src/scale/ScaleManager.ts:24](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L24)

***

### parentSize

> `readonly` **parentSize**: `object`

Defined in: [core/src/scale/ScaleManager.ts:30](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L30)

#### height

> **height**: `number` = `0`

#### width

> **width**: `number` = `0`

***

### pixelArt

> **pixelArt**: `boolean`

Defined in: [core/src/scale/ScaleManager.ts:25](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L25)

***

### width

> **width**: `number`

Defined in: [core/src/scale/ScaleManager.ts:22](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L22)

***

### zoom

> **zoom**: `number` = `1`

Defined in: [core/src/scale/ScaleManager.ts:31](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L31)

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [core/src/scale/ScaleManager.ts:113](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L113)

#### Returns

`void`

***

### onResize()

> **onResize**(): `void`

Defined in: [core/src/scale/ScaleManager.ts:59](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L59)

#### Returns

`void`

***

### setCanvas()

> **setCanvas**(`canvas`): `void`

Defined in: [core/src/scale/ScaleManager.ts:49](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L49)

#### Parameters

##### canvas

`HTMLCanvasElement`

#### Returns

`void`

***

### transform()

> **transform**(`clientX`, `clientY`, `out`): `void`

Defined in: [core/src/scale/ScaleManager.ts:135](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L135)

画面座標をゲーム座標へ変換し、呼び出し側のバッファへ書き込みます。
InputManager は毎フレームこの関数を 1 度だけ呼ぶため、ヒープ割り当てが発生しません。

#### Parameters

##### clientX

`number`

##### clientY

`number`

##### out

`Float32Array`

#### Returns

`void`

***

### transformX()

> **transformX**(`screenX`): `number`

Defined in: [core/src/scale/ScaleManager.ts:119](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L119)

#### Parameters

##### screenX

`number`

#### Returns

`number`

***

### transformY()

> **transformY**(`screenY`): `number`

Defined in: [core/src/scale/ScaleManager.ts:125](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scale/ScaleManager.ts#L125)

#### Parameters

##### screenY

`number`

#### Returns

`number`
