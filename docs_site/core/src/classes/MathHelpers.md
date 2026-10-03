[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / MathHelpers

# Class: MathHelpers

Defined in: [core/src/math/Math.ts:265](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Math.ts#L265)

旧 API の互換ラッパー。

既存の呼び出し箇所（`Scene` など）向けに `mathHelpers.Clamp` などを提供します。
新規コードは [Math2](../variables/Math2.md) を直接使ってください。

## Constructors

### Constructor

> **new MathHelpers**(): `MathHelpers`

#### Returns

`MathHelpers`

## Properties

### Angle

> **Angle**: `object`

Defined in: [core/src/math/Math.ts:275](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Math.ts#L275)

#### Between()

> **Between**(`x1`, `y1`, `x2`, `y2`): `number`

##### Parameters

###### x1

`number`

###### y1

`number`

###### x2

`number`

###### y2

`number`

##### Returns

`number`

***

### Distance

> **Distance**: `object`

Defined in: [core/src/math/Math.ts:266](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Math.ts#L266)

#### Between()

> **Between**(`x1`, `y1`, `x2`, `y2`): `number`

##### Parameters

###### x1

`number`

###### y1

`number`

###### x2

`number`

###### y2

`number`

##### Returns

`number`

#### BetweenSquared()

> **BetweenSquared**(`x1`, `y1`, `x2`, `y2`): `number`

##### Parameters

###### x1

`number`

###### y1

`number`

###### x2

`number`

###### y2

`number`

##### Returns

`number`

## Methods

### Clamp()

> **Clamp**(`val`, `min`, `max`): `number`

Defined in: [core/src/math/Math.ts:281](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Math.ts#L281)

#### Parameters

##### val

`number`

##### min

`number`

##### max

`number`

#### Returns

`number`

***

### DegToRad()

> **DegToRad**(`degrees`): `number`

Defined in: [core/src/math/Math.ts:285](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Math.ts#L285)

#### Parameters

##### degrees

`number`

#### Returns

`number`

***

### RadToDeg()

> **RadToDeg**(`radians`): `number`

Defined in: [core/src/math/Math.ts:289](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Math.ts#L289)

#### Parameters

##### radians

`number`

#### Returns

`number`
