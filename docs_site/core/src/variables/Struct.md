[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Struct

# Variable: Struct

> `const` **Struct**: `object`

Defined in: [core/src/math/Struct.ts:43](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Struct.ts#L43)

## Type Declaration

### createMap()

> `readonly` **createMap**\<`K`, `V`\>(): [`ValueMap`](../type-aliases/ValueMap.md)\<`K`, `V`\>

キーと値の Map を作ります（Phaser 互換の `Struct.Map`）。

#### Type Parameters

##### K

`K`

##### V

`V`

#### Returns

[`ValueMap`](../type-aliases/ValueMap.md)\<`K`, `V`\>

### createSet()

> `readonly` **createSet**\<`T`\>(...`values`): [`ValueSet`](../type-aliases/ValueSet.md)\<`T`\>

値の集合を作ります（Phaser 互換の `Struct.Set`）。

可変長引数で渡すとその値をすべて入れます。

#### Type Parameters

##### T

`T`

#### Parameters

##### values

...`T`[]

#### Returns

[`ValueSet`](../type-aliases/ValueSet.md)\<`T`\>

### each()

> `readonly` **each**\<`K`, `V`\>(`map`, `callback`): `void`

Map の各要素を走査します（`forEach` 相当）。

コールバックは引数を受け取るため、呼び出し側の外側の関数を使います。

#### Type Parameters

##### K

`K`

##### V

`V`

#### Parameters

##### map

[`ValueMap`](../type-aliases/ValueMap.md)\<`K`, `V`\>

##### callback

(`value`, `key`) => `void`

#### Returns

`void`

### eachSet()

> `readonly` **eachSet**\<`T`\>(`set`, `callback`): `void`

値付き Set の各要素を走査します。

#### Type Parameters

##### T

`T`

#### Parameters

##### set

[`ValueSet`](../type-aliases/ValueSet.md)\<`T`\>

##### callback

(`value`) => `void`

#### Returns

`void`

### getIndex()

> `readonly` **getIndex**\<`T`\>(`set`, `value`): `number`

値のインデックスを返します（Phaser 互換の `Struct.Set.getIndex`）。

#### Type Parameters

##### T

`T`

#### Parameters

##### set

[`ValueSet`](../type-aliases/ValueSet.md)\<`T`\>

##### value

`T`

#### Returns

`number`

見つからなければ -1

### insert()

> `readonly` **insert**\<`T`\>(`set`, `value`): `boolean`

値付き Set の末尾へ追加します。

ネイティブの `add` と違い、**追加できたか**を返します。

#### Type Parameters

##### T

`T`

#### Parameters

##### set

[`ValueSet`](../type-aliases/ValueSet.md)\<`T`\>

##### value

`T`

#### Returns

`boolean`

追加できたか（すでに存在する場合は false）

### mapNumbersInto()

> `readonly` **mapNumbersInto**\<`K`\>(`map`, `out`): `number`

Map の内容を `Float32Array` へ展開します。

数値値の Map を **SoA で持ちたい場合**に使います。
値の順序は `Map` の挿入順に限られます。

#### Type Parameters

##### K

`K`

#### Parameters

##### map

[`ValueMap`](../type-aliases/ValueMap.md)\<`K`, `number`\>

##### out

`Float32Array`

#### Returns

`number`

書き出した要素数

### remove()

> `readonly` **remove**\<`T`\>(`set`, `value`): `boolean`

値付き Set から削除します。

#### Type Parameters

##### T

`T`

#### Parameters

##### set

[`ValueSet`](../type-aliases/ValueSet.md)\<`T`\>

##### value

`T`

#### Returns

`boolean`

削除できたか

### setKeysInto()

> `readonly` **setKeysInto**\<`K`, `V`\>(`map`, `out`): `number`

Map のキーを別配列へ展開します。

#### Type Parameters

##### K

`K`

##### V

`V`

#### Parameters

##### map

[`ValueMap`](../type-aliases/ValueMap.md)\<`K`, `V`\>

##### out

`K`[]

#### Returns

`number`

展開した要素数

### setValuesInto()

> `readonly` **setValuesInto**\<`T`\>(`set`, `out`): `number`

値を別配列へ展開します（`forEach` 相当）。

`Array.from(set)` と違い **新しい配列を作りません**（R-02）。

#### Type Parameters

##### T

`T`

#### Parameters

##### set

[`ValueSet`](../type-aliases/ValueSet.md)\<`T`\>

##### out

`T`[]

書き込み先配列

#### Returns

`number`

展開した要素数

### valuesInto()

> `readonly` **valuesInto**\<`K`, `V`\>(`map`, `out`): `number`

Map の値を別配列へ展開します。

#### Type Parameters

##### K

`K`

##### V

`V`

#### Parameters

##### map

[`ValueMap`](../type-aliases/ValueMap.md)\<`K`, `V`\>

##### out

`V`[]

#### Returns

`number`

展開した要素数
