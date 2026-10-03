[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Path

# Class: Path

Defined in: [core/src/math/Path.ts:27](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L27)

## Constructors

### Constructor

> **new Path**(`maxPoints?`, `maxCurves?`): `Path`

Defined in: [core/src/math/Path.ts:40](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L40)

#### Parameters

##### maxPoints?

`number` = `256`

点列の最大点数。超出時は `addPoint` が false を返します

##### maxCurves?

`number` = `32`

カーブの最大本数

#### Returns

`Path`

## Properties

### cursor

> **cursor**: `number` = `0`

Defined in: [core/src/math/Path.ts:31](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L31)

書き込み位置（要素単位）。`getPointCount()` は `cursor / 2` です。

***

### curves

> `readonly` **curves**: [`CurveInput`](../type-aliases/CurveInput.md)[] = `[]`

Defined in: [core/src/math/Path.ts:34](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L34)

所属カーブの点列（CurveInput の配列）。増加は `addCurve` のときだけです。

***

### points

> **points**: `Float32Array`

Defined in: [core/src/math/Path.ts:29](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L29)

点列のバッファ。`cursor / 2` が点の個数です。

## Accessors

### maxPoints

#### Get Signature

> **get** **maxPoints**(): `number`

Defined in: [core/src/math/Path.ts:48](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L48)

点列の最大点数

##### Returns

`number`

## Methods

### addCurve()

> **addCurve**(`points`, `kind`): `boolean`

Defined in: [core/src/math/Path.ts:159](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L159)

カーブを 1 つ追加します (Phaser 互換の `Path.add`)。

#### Parameters

##### points

`ArrayLike`\<`number`\>

##### kind

`number`

#### Returns

`boolean`

追加に成功したか（上限超過や制御点不足なら false）

***

### addPoint()

> **addPoint**(`x`, `y`): `boolean`

Defined in: [core/src/math/Path.ts:65](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L65)

末尾に点を 1 つ追加します。

バッファが満杯の場合は何もせず false を返します（拡張しません）。
拡張が要るなら `resize` を明示的に呼んでください。

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`boolean`

追加に成功したか

***

### clearPoints()

> **clearPoints**(): `void`

Defined in: [core/src/math/Path.ts:93](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L93)

すべての点を消去します。バッファは再確保しません。

#### Returns

`void`

***

### getCurvePoints()

> **getCurvePoints**(`divisions`, `out`): `number`

Defined in: [core/src/math/Path.ts:176](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L176)

所属カーブの点（等間隔）を `out` へ展開します
(Phaser 互換の `Path.draw` / `getCurvePoints` のデータ供給側)。

全カーブの点を連結して 1 本の点列として書き出します。

#### Parameters

##### divisions

`number`

カーブごとの分割数

##### out

`Float32Array`

書き込み先バッファ

#### Returns

`number`

書き出した点数

***

### getLengths()

> **getLengths**(`divisions`, `out`): `number`

Defined in: [core/src/math/Path.ts:130](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L130)

累積長を `out` へ書き出します (Phaser 互換の `Path.getLengths`)。

#### Parameters

##### divisions

`number`

分割数

##### out

`Float32Array`

`divisions * 2` 要素のバッファ。[k*2] = x, [k*2+1] = y

#### Returns

`number`

書き出した点数

***

### getPoint()

> **getPoint**(`index`, `out`): `boolean`

Defined in: [core/src/math/Path.ts:103](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L103)

`index` 番目の点を `out` へ書き出します (Phaser 互換の `Path.getPoint`)。

#### Parameters

##### index

`number`

##### out

`Float32Array`

2 要素のバッファ

#### Returns

`boolean`

範囲外なら false

***

### getPointCount()

> **getPointCount**(): `number`

Defined in: [core/src/math/Path.ts:53](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L53)

現在のパス上の点数

#### Returns

`number`

***

### getPoints()

> **getPoints**(`out`): `number`

Defined in: [core/src/math/Path.ts:116](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L116)

点列を `out` へ展開します (Phaser 互換の `Path.getPoints`)。

#### Parameters

##### out

`Float32Array`

#### Returns

`number`

書き出した点数

***

### lineTo()

> **lineTo**(`x`, `y`): `boolean`

Defined in: [core/src/math/Path.ts:199](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L199)

線分を 1 本追加します (Phaser 互換の `Path.lineTo`)。

線分は 2 点の制御点を持つので、内部では CurveKind.Line として保持します。

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`boolean`

線分を追加できたか

***

### popPoint()

> **popPoint**(): `boolean`

Defined in: [core/src/math/Path.ts:86](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L86)

末尾の点を 1 つ取り除きます。

#### Returns

`boolean`

***

### resize()

> **resize**(`newMaxPoints`): `void`

Defined in: [core/src/math/Path.ts:78](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L78)

点列バッファを拡張します。既存の点は保たれます。

#### Parameters

##### newMaxPoints

`number`

新しい最大点数

#### Returns

`void`

***

### splice()

> **splice**(`curveIndex`, `divisions`): `number`

Defined in: [core/src/math/Path.ts:216](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Path.ts#L216)

カーブ 1 本を評価した点を点列へ展開します
(Phaser 互換の `Path.splice` の実体)。

#### Parameters

##### curveIndex

`number`

##### divisions

`number`

#### Returns

`number`

展開した点数
