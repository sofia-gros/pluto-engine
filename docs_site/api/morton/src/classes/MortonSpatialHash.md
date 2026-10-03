[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [morton/src](../README.md) / MortonSpatialHash

# Class: MortonSpatialHash

Defined in: [morton/src/index.ts:37](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/morton/src/index.ts#L37)

## Constructors

### Constructor

> **new MortonSpatialHash**(`maxEntities`, `cellSize`): `MortonSpatialHash`

Defined in: [morton/src/index.ts:60](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/morton/src/index.ts#L60)

#### Parameters

##### maxEntities

`number`

追加できる最大エンティティ数

##### cellSize

`number`

セルの辺長 (ワールド単位)

#### Returns

`MortonSpatialHash`

## Accessors

### entityCount

#### Get Signature

> **get** **entityCount**(): `number`

Defined in: [morton/src/index.ts:79](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/morton/src/index.ts#L79)

##### Returns

`number`

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [morton/src/index.ts:83](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/morton/src/index.ts#L83)

##### Returns

`number`

## Methods

### addEntity()

> **addEntity**(`id`, `x`, `y`): `void`

Defined in: [morton/src/index.ts:90](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/morton/src/index.ts#L90)

エンティティを追加します。容量超過時は黙って無視します。

#### Parameters

##### id

`number`

##### x

`number`

##### y

`number`

#### Returns

`void`

***

### build()

> **build**(): `void`

Defined in: [morton/src/index.ts:106](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/morton/src/index.ts#L106)

追加済みのエンティティを Morton コード順に Radix Sort します。
32 bit コードを 8 bit ずつ 4 パスで安定的に並べます。
計算量は O(4n) で、桶の全走査は一切行いません。

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [morton/src/index.ts:75](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/morton/src/index.ts#L75)

#### Returns

`void`

***

### query()

> **query**(`x`, `y`, `radius`, `outArray`): `number`

Defined in: [morton/src/index.ts:196](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/morton/src/index.ts#L196)

指定位置の近傍セル内のエンティティ ID を outArray へ書き込み、件数を返します。
厳密な距離判定 (ブロードフェーズ) は呼び出し側の責務です。
半径が 1 セル以内なら二分探索 1 回で済み、セル走査は起こりません。

#### Parameters

##### x

`number`

##### y

`number`

##### radius

`number`

##### outArray

`Uint32Array`

呼び出し側が確保した書き込み先。実行中は new しません

#### Returns

`number`
