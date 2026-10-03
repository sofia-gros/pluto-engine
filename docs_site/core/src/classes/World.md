[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / World

# Class: World

Defined in: [core/src/physics/World.ts:16](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/World.ts#L16)

## Constructors

### Constructor

> **new World**(`physics`): `World`

Defined in: [core/src/physics/World.ts:19](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/World.ts#L19)

#### Parameters

##### physics

[`ArcadePhysics`](ArcadePhysics.md)

#### Returns

`World`

## Accessors

### gravityX

#### Get Signature

> **get** **gravityX**(): `number`

Defined in: [core/src/physics/World.ts:66](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/World.ts#L66)

水平方向の重力加速度

##### Returns

`number`

#### Set Signature

> **set** **gravityX**(`v`): `void`

Defined in: [core/src/physics/World.ts:70](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/World.ts#L70)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### gravityY

#### Get Signature

> **get** **gravityY**(): `number`

Defined in: [core/src/physics/World.ts:75](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/World.ts#L75)

垂直方向の重力加速度

##### Returns

`number`

#### Set Signature

> **set** **gravityY**(`v`): `void`

Defined in: [core/src/physics/World.ts:79](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/World.ts#L79)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### hasBounds

#### Get Signature

> **get** **hasBounds**(): `boolean`

Defined in: [core/src/physics/World.ts:61](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/World.ts#L61)

ワールド境界を持っているか

##### Returns

`boolean`

## Methods

### clearBounds()

> **clearBounds**(): `this`

Defined in: [core/src/physics/World.ts:41](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/World.ts#L41)

ワールド境界を無効にします。

#### Returns

`this`

***

### collideWorldBounds()

> **collideWorldBounds**(`entityId`, `value?`): `this`

Defined in: [core/src/physics/World.ts:87](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/World.ts#L87)

指定エンティティのワールド境界衝突を有効にします
(Phaser 互換の `collideWorldBounds`)。

#### Parameters

##### entityId

`number`

##### value?

`boolean` = `true`

#### Returns

`this`

***

### getBounds()

> **getBounds**(`out?`): `Float32Array`

Defined in: [core/src/physics/World.ts:52](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/World.ts#L52)

境界矩形の x, y, width, height を out バッファに書き出します
(Phaser 互換の `getBounds`)。

#### Parameters

##### out?

`Float32Array` = `BOUNDS_OUT`

4 要素以上のバッファ

#### Returns

`Float32Array`

***

### isOutsideWorld()

> **isOutsideWorld**(`entityId`, `out?`): `boolean`

Defined in: [core/src/physics/World.ts:100](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/World.ts#L100)

指定エンティティがワールド境界の内側か外側かを返します。

当たり判定矩形の**四隅**で判定するため、当たり判定設定によって
よって外側判定が変わります。

#### Parameters

##### entityId

`number`

##### out?

`Float32Array` = `BOUNDS_OUT`

1 要素のバッファ。0 = 内側、1 = 外側

#### Returns

`boolean`

***

### setBounds()

> **setBounds**(`width`, `height`, `x?`, `y?`): `this`

Defined in: [core/src/physics/World.ts:35](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/World.ts#L35)

ワールド境界を無効にします (Phaser 互換の `setBounds` に 0 を渡す相当)。

#### Parameters

##### width

`number`

##### height

`number`

##### x?

`number` = `0`

##### y?

`number` = `0`

#### Returns

`this`

***

### setBoundsRectangle()

> **setBoundsRectangle**(`x`, `y`, `width`, `height`): `this`

Defined in: [core/src/physics/World.ts:27](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/World.ts#L27)

ワールド境界を設定します (Phaser 互換の `setBoundsRectangle`)。

#### Parameters

##### x

`number`

##### y

`number`

##### width

`number`

/ height が 0 以下の場合は境界なしとして扱います

##### height

`number`

#### Returns

`this`
