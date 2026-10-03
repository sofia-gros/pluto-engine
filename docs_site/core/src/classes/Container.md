[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Container

# Class: Container

Defined in: [core/src/arena/Container.ts:29](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L29)

## Constructors

### Constructor

> **new Container**(`id`, `arena`): `Container`

Defined in: [core/src/arena/Container.ts:35](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L35)

#### Parameters

##### id

`number`

##### arena

[`InstanceBufferArena`](InstanceBufferArena.md)

#### Returns

`Container`

## Properties

### id

> `readonly` **id**: `number`

Defined in: [core/src/arena/Container.ts:31](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L31)

コンテナ自身を表すアリーナの疎添字 ID

## Accessors

### destroyed

#### Get Signature

> **get** **destroyed**(): `boolean`

Defined in: [core/src/arena/Container.ts:253](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L253)

破棄済みか

##### Returns

`boolean`

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [core/src/arena/Container.ts:145](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L145)

当たり判定矩形の高さ

##### Returns

`number`

#### Set Signature

> **set** **height**(`v`): `void`

Defined in: [core/src/arena/Container.ts:150](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L150)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### localX

#### Get Signature

> **get** **localX**(): `number`

Defined in: [core/src/arena/Container.ts:92](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L92)

ローカル X 座標 (親の座標を差し引いた値)

##### Returns

`number`

#### Set Signature

> **set** **localX**(`v`): `void`

Defined in: [core/src/arena/Container.ts:97](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L97)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### localY

#### Get Signature

> **get** **localY**(): `number`

Defined in: [core/src/arena/Container.ts:105](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L105)

ローカル Y 座標

##### Returns

`number`

#### Set Signature

> **set** **localY**(`v`): `void`

Defined in: [core/src/arena/Container.ts:110](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L110)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### width

#### Get Signature

> **get** **width**(): `number`

Defined in: [core/src/arena/Container.ts:134](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L134)

当たり判定矩形の幅

##### Returns

`number`

#### Set Signature

> **set** **width**(`v`): `void`

Defined in: [core/src/arena/Container.ts:139](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L139)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### worldX

#### Get Signature

> **get** **worldX**(): `number`

Defined in: [core/src/arena/Container.ts:80](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L80)

コンテナ自身のワールド X 座標 (親からの計算結果を無視した値)

##### Returns

`number`

***

### worldY

#### Get Signature

> **get** **worldY**(): `number`

Defined in: [core/src/arena/Container.ts:86](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L86)

コンテナ自身のワールド Y 座標

##### Returns

`number`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [core/src/arena/Container.ts:44](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L44)

コンテナ自身の X 座標 (ワールド座標)。
親を持つ場合は親のワールド座標を加算した値になります。

##### Returns

`number`

#### Set Signature

> **set** **x**(`v`): `void`

Defined in: [core/src/arena/Container.ts:50](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L50)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [core/src/arena/Container.ts:62](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L62)

コンテナ自身の Y 座標 (ワールド座標)

##### Returns

`number`

#### Set Signature

> **set** **y**(`v`): `void`

Defined in: [core/src/arena/Container.ts:68](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L68)

##### Parameters

###### v

`number`

##### Returns

`void`

## Methods

### add()

> **add**(`childId`): `this`

Defined in: [core/src/arena/Container.ts:163](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L163)

子を追加します (Phaser 互換の `add`)。

追加前のワールド座標を保つように、親のワールド座標を引いて
ローカル座標として保存します。以降、親を動かすと子が追従します。

#### Parameters

##### childId

`number`

子の疎添字 ID

#### Returns

`this`

***

### collectChildrenInto()

> **collectChildrenInto**(`outIds`): `number`

Defined in: [core/src/arena/Container.ts:216](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L216)

直属の子を `outIds` バッファへ展開します (Phaser 互換の `getChildren`)。

#### Parameters

##### outIds

`Int32Array`

呼び出し側の使い回し配列

#### Returns

`number`

展開した子の数

***

### getBounds()

> **getBounds**(`out`): `Float32Array`

Defined in: [core/src/arena/Container.ts:244](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L244)

当たり判定矩形を `out` バッファに書き出します (Phaser 互換の `getBounds`)。

#### Parameters

##### out

`Float32Array`

4 要素以上 (x, y, width, height) のバッファ

#### Returns

`Float32Array`

***

### getChildCount()

> **getChildCount**(): `number`

Defined in: [core/src/arena/Container.ts:230](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L230)

直属の子を数えます (Phaser 互換の `getLength`)。

#### Returns

`number`

***

### remove()

> **remove**(`childId`): `boolean`

Defined in: [core/src/arena/Container.ts:193](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L193)

子を親から外します (Phaser 互換の `remove`)。

外す際に**親のワールド座標を足し戻して**、現在のワールド座標を保ちます。

#### Parameters

##### childId

`number`

#### Returns

`boolean`

確かに直属の子だったか

***

### setPosition()

> **setPosition**(`x`, `y`): `this`

Defined in: [core/src/arena/Container.ts:117](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L117)

コンテナの位置を設定します (Phaser 互換の `setPosition`)。

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`this`

***

### setSize()

> **setSize**(`width`, `height`): `this`

Defined in: [core/src/arena/Container.ts:126](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Container.ts#L126)

当たり判定矩形の幅と高さを設定します (Phaser 互換の `setSize`)。

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`this`
