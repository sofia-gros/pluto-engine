[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [continuum/src](../README.md) / EikonalField

# Class: EikonalField

Defined in: [continuum/src/EikonalField.ts:30](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L30)

## Constructors

### Constructor

> **new EikonalField**(`width`, `height`, `cellSize`): `EikonalField`

Defined in: [continuum/src/EikonalField.ts:59](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L59)

#### Parameters

##### width

`number`

##### height

`number`

##### cellSize

`number`

#### Returns

`EikonalField`

## Properties

### cellSize

> `readonly` **cellSize**: `number`

Defined in: [continuum/src/EikonalField.ts:33](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L33)

***

### distance

> `readonly` **distance**: `Float32Array`

Defined in: [continuum/src/EikonalField.ts:37](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L37)

各セルからゴールまでの推定距離 (セル単位)

***

### gradX

> `readonly` **gradX**: `Float32Array`

Defined in: [continuum/src/EikonalField.ts:39](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L39)

勾配の X 成分 (Cells)

***

### gradY

> `readonly` **gradY**: `Float32Array`

Defined in: [continuum/src/EikonalField.ts:41](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L41)

勾配の Y 成分 (Cells)

***

### height

> `readonly` **height**: `number`

Defined in: [continuum/src/EikonalField.ts:32](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L32)

***

### unreachable

> `readonly` **unreachable**: `Uint8Array`

Defined in: [continuum/src/EikonalField.ts:43](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L43)

到達不能なセルは 1

***

### width

> `readonly` **width**: `number`

Defined in: [continuum/src/EikonalField.ts:31](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L31)

## Methods

### clearWalls()

> **clearWalls**(): `void`

Defined in: [continuum/src/EikonalField.ts:166](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L166)

壁マークをすべて解除します。

#### Returns

`void`

***

### computeGradient()

> **computeGradient**(`options?`): `void`

Defined in: [continuum/src/EikonalField.ts:216](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L216)

#### Parameters

##### options?

[`EikonalOptions`](../interfaces/EikonalOptions.md) = `{}`

#### Returns

`void`

***

### distanceAt()

> **distanceAt**(`x`, `y`): `number`

Defined in: [continuum/src/EikonalField.ts:339](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L339)

ゴールまでの距離を返します。 unreachable の場合は Infinity。

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`number`

***

### markWalls()

> **markWalls**(`isWall`): `void`

Defined in: [continuum/src/EikonalField.ts:153](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L153)

壁セルを impassable として指定します (障害物セル)。
壁の距離は INF として扱われます。

複数回呼んだ場合は OR 的に合成されます。
壁を解除するには clearWalls() を使ってください。

#### Parameters

##### isWall

(`x`, `y`) => `boolean`

セル座標が壁かどうかを返す関数

#### Returns

`void`

***

### normalizeGradient()

> **normalizeGradient**(): `void`

Defined in: [continuum/src/EikonalField.ts:264](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L264)

勾配を単位ベクトルへ正規化します。
勾配は距離の減少方向を向くので、そのまま進行方向として使えます。

#### Returns

`void`

***

### sampleDirection()

> **sampleDirection**(`x`, `y`, `outDir`): `boolean`

Defined in: [continuum/src/EikonalField.ts:289](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L289)

ワールド座標から、双線形補間で進行方向をサンプリングします。

#### Parameters

##### x

`number`

##### y

`number`

##### outDir

`Float32Array`

長さ 2 以上の Float32Array [dirX, dirY]

#### Returns

`boolean`

到達不能なら false

***

### solve()

> **solve**(`goalIndex`): `void`

Defined in: [continuum/src/EikonalField.ts:83](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L83)

ゴールを配置して距離場を解きます。

#### Parameters

##### goalIndex

`number`

ゴールとするセルのインデックス

#### Returns

`void`

***

### solveMulti()

> **solveMulti**(`goalIndices`): `void`

Defined in: [continuum/src/EikonalField.ts:117](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L117)

複数ゴールに対する距離場を解きます (Min-Heap は使わず、走査順を固定)。

#### Parameters

##### goalIndices

`Int32Array`

ゴールのインデックス配列

#### Returns

`void`
