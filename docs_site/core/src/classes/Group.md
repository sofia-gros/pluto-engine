[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Group

# Class: Group

Defined in: [core/src/arena/Group.ts:17](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L17)

## File

Group.ts

## Description

Phaser 4 互換のグループ。

設計上の判断 (IMPACT_SCOPE 3.2 の判定 D):
Group は **SoA 化しません**。可変長の子リストは SoA の得意分野ではなく、
使い回し `Array` で実装し、**Pluto のアリーナは汚しません**
(Group は「CPU 管理のビュー」として arena と並行して持ちます)。

所属数组は呼び出し側が渡す `out` を使い回すのが前提です。
毎フレーム `getChildren()` を呼ぶと new が発生するため、
ホットパスでは `forEachInto()` を使ってください。

## Constructors

### Constructor

> **new Group**(): `Group`

#### Returns

`Group`

## Accessors

### alive

#### Get Signature

> **get** **alive**(): `boolean`

Defined in: [core/src/arena/Group.ts:159](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L159)

グループが生きているか (更新・操作の対象にするか)。
Phaser の `Group.runChildUpdate` に対応します。

##### Returns

`boolean`

#### Set Signature

> **set** **alive**(`v`): `void`

Defined in: [core/src/arena/Group.ts:163](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L163)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### length

#### Get Signature

> **get** **length**(): `number`

Defined in: [core/src/arena/Group.ts:113](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L113)

所属数 (`length` の別名)

##### Returns

`number`

***

### visible

#### Get Signature

> **get** **visible**(): `boolean`

Defined in: [core/src/arena/Group.ts:171](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L171)

グループMembersの表示状態。
Group 自体は描画しません (Phaser 互換の stub)。

##### Returns

`boolean`

#### Set Signature

> **set** **visible**(`v`): `void`

Defined in: [core/src/arena/Group.ts:175](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L175)

##### Parameters

###### v

`boolean`

##### Returns

`void`

## Methods

### add()

> **add**\<`T`\>(`item`): `boolean`

Defined in: [core/src/arena/Group.ts:34](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L34)

所属スプライトを追加します。

すでに所属している場合は何もしません (Phaser と同一)。

#### Type Parameters

##### T

`T`

#### Parameters

##### item

`T`

#### Returns

`boolean`

追加されたか

***

### addMultiple()

> **addMultiple**\<`T`\>(`items`): `number`

Defined in: [core/src/arena/Group.ts:57](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L57)

複数のスプライトをまとめて追加します。

#### Type Parameters

##### T

`T`

#### Parameters

##### items

`T`[]

#### Returns

`number`

実際に追加された数

***

### contains()

> **contains**(`item`): `boolean`

Defined in: [core/src/arena/Group.ts:118](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L118)

所属スプライトの中に含まれるか (Phaser 互換の `contains`)

#### Parameters

##### item

`unknown`

#### Returns

`boolean`

***

### forEach()

> **forEach**\<`T`\>(`callback`): `void`

Defined in: [core/src/arena/Group.ts:140](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L140)

所属スプライトを 1 個ずつ走査します。
コールバック配列を new せずに forEach を呼ぶ経路です。

走査中に remove すると添字がずれるため、
その場合は `getAll()` でバッファへ退避してから処理してください。

#### Type Parameters

##### T

`T`

#### Parameters

##### callback

(`item`, `index`) => `void`

#### Returns

`void`

***

### forEachInto()

> **forEachInto**\<`T`\>(`out`, `callback`): `number`

Defined in: [core/src/arena/Group.ts:149](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L149)

`out` バッファを展開してから走査します。
走査中の追加・削除があっても安全に動きます。

#### Type Parameters

##### T

`T`

#### Parameters

##### out

`T`[]

##### callback

(`item`, `index`) => `void`

#### Returns

`number`

***

### getAll()

> **getAll**\<`T`\>(`out`): `number`

Defined in: [core/src/arena/Group.ts:99](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L99)

所属スプライトを `out` バッファに展開します (Phaser 互換の `getAll`)。

#### Type Parameters

##### T

`T`

#### Parameters

##### out

`T`[]

呼び出し側の使い回し配列

#### Returns

`number`

展開した要素数

***

### getAt()

> **getAt**\<`T`\>(`index`): `T`

Defined in: [core/src/arena/Group.ts:88](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L88)

インデックスでスプライトを取得します (Phaser 互換の `getAt`)。

#### Type Parameters

##### T

`T`

#### Parameters

##### index

`number`

#### Returns

`T`

範囲外なら null

***

### getFirst()

> **getFirst**\<`T`\>(): `T`

Defined in: [core/src/arena/Group.ts:123](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L123)

グループ内の先頭スプライト (空なら null)

#### Type Parameters

##### T

`T`

#### Returns

`T`

***

### getLast()

> **getLast**\<`T`\>(): `T`

Defined in: [core/src/arena/Group.ts:128](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L128)

グループ内の末尾スプライト (空なら null)

#### Type Parameters

##### T

`T`

#### Returns

`T`

***

### getLength()

> **getLength**(): `number`

Defined in: [core/src/arena/Group.ts:108](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L108)

所属数を返します (Phaser 互換の `getLength` / `length`)。

#### Returns

`number`

***

### remove()

> **remove**\<`T`\>(`item`): `boolean`

Defined in: [core/src/arena/Group.ts:69](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L69)

スプライトをグループから外します。

#### Type Parameters

##### T

`T`

#### Parameters

##### item

`T`

#### Returns

`boolean`

所属していたか

***

### removeAll()

> **removeAll**(): `void`

Defined in: [core/src/arena/Group.ts:80](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L80)

グループ内のすべてのスプライトを外します。

#### Returns

`void`

***

### runChildUpdate()

> **runChildUpdate**\<`T`\>(`callback`): `void`

Defined in: [core/src/arena/Group.ts:183](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L183)

グループ_members に対して callback を適用します (Phaser 互換の `runChildUpdate`)。
alive が false の場合は何もしません。

#### Type Parameters

##### T

`T`

#### Parameters

##### callback

(`item`) => `void`

#### Returns

`void`

***

### setOnAddHook()

> **setOnAddHook**(`hook`): `this`

Defined in: [core/src/arena/Group.ts:48](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Group.ts#L48)

追加時に呼ぶフックを登録します。
`physics.add.staticGroup` の immovable 実効化用です。

#### Parameters

##### hook

(`item`) => `void`

#### Returns

`this`
