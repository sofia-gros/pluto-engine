[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / DataRegistry

# Class: DataRegistry

Defined in: [core/src/events/DataRegistry.ts:13](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/DataRegistry.ts#L13)

## File

DataRegistry.ts

## Description

全シーン共有のグローバルデータストア。

設計方針:
 - 値の取得は `Map.get` 1 回で済み、毎フレームの走査が起きません。
 - 数値の高頻度アクセス用に、任意のキーへ倍精度配列を遅延確保できます。
   `getFloat(key)` は初回アクセス時に `Float64Array` を生成し、
   以降は添字 1 回の参照だけになります (毎回の文字列探索なし)。

## Constructors

### Constructor

> **new DataRegistry**(): `DataRegistry`

#### Returns

`DataRegistry`

## Methods

### addFloat()

> **addFloat**(`ns`, `key`, `delta`): `number`

Defined in: [core/src/events/DataRegistry.ts:171](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/DataRegistry.ts#L171)

数値に加算します。未登録のキーは 0 として扱います。

#### Parameters

##### ns

`string`

##### key

`string`

##### delta

`number`

#### Returns

`number`

***

### clear()

> **clear**(`ns?`): `void`

Defined in: [core/src/events/DataRegistry.ts:78](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/DataRegistry.ts#L78)

名前空間ごと破棄します。

#### Parameters

##### ns?

`string`

#### Returns

`void`

***

### floatCount()

> **floatCount**(`ns`): `number`

Defined in: [core/src/events/DataRegistry.ts:107](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/DataRegistry.ts#L107)

Returns the number of float slots currently allocated.

#### Parameters

##### ns

`string`

#### Returns

`number`

***

### floatKeys()

> **floatKeys**(`ns`): readonly `string`[]

Defined in: [core/src/events/DataRegistry.ts:182](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/DataRegistry.ts#L182)

float スロットのキー順を返します (デバッグ・セーブ用)。

#### Parameters

##### ns

`string`

#### Returns

readonly `string`[]

***

### floatSnapshot()

> **floatSnapshot**(`ns`): `Record`\<`string`, `number`\>

Defined in: [core/src/events/DataRegistry.ts:189](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/DataRegistry.ts#L189)

float ストアを JSON 化可能なオブジェクトへ変換します。

#### Parameters

##### ns

`string`

#### Returns

`Record`\<`string`, `number`\>

***

### get()

> **get**\<`T`\>(`ns`, `key`, `fallback`): `T`

Defined in: [core/src/events/DataRegistry.ts:51](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/DataRegistry.ts#L51)

値を取得します。未登録なら `fallback` を返します。

#### Type Parameters

##### T

`T`

#### Parameters

##### ns

`string`

##### key

`string`

##### fallback

`T`

#### Returns

`T`

***

### getFloat()

> **getFloat**(`ns`, `key`): `number`

Defined in: [core/src/events/DataRegistry.ts:152](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/DataRegistry.ts#L152)

数値を取得します。未登録の場合は 0 を返します。

2 回目以降の呼び出しは `Map.get` + 配列参照のみで完結します。

#### Parameters

##### ns

`string`

##### key

`string`

#### Returns

`number`

***

### has()

> **has**(`ns`, `key`): `boolean`

Defined in: [core/src/events/DataRegistry.ts:61](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/DataRegistry.ts#L61)

値が存在するか確認します。

#### Parameters

##### ns

`string`

##### key

`string`

#### Returns

`boolean`

***

### keys()

> **keys**(`ns`): `string`[]

Defined in: [core/src/events/DataRegistry.ts:97](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/DataRegistry.ts#L97)

名前空間内のキーを列挙します (プロファイラ・保存用)。

#### Parameters

##### ns

`string`

#### Returns

`string`[]

***

### ns()

> **ns**(`ns?`): `Map`\<`string`, `unknown`\>

Defined in: [core/src/events/DataRegistry.ts:32](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/DataRegistry.ts#L32)

名前空間を取得します。存在しなければ作ります。

#### Parameters

##### ns?

`string` = `''`

名前空間名。`''` は既定の名前空間です。

#### Returns

`Map`\<`string`, `unknown`\>

***

### remove()

> **remove**(`ns`, `key`): `boolean`

Defined in: [core/src/events/DataRegistry.ts:69](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/DataRegistry.ts#L69)

値を削除します。

#### Parameters

##### ns

`string`

##### key

`string`

#### Returns

`boolean`

***

### set()

> **set**(`ns`, `key`, `value`): `void`

Defined in: [core/src/events/DataRegistry.ts:44](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/DataRegistry.ts#L44)

値を保存します。

#### Parameters

##### ns

`string`

##### key

`string`

##### value

`unknown`

#### Returns

`void`

***

### setFloat()

> **setFloat**(`ns`, `key`, `value`): `void`

Defined in: [core/src/events/DataRegistry.ts:163](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/DataRegistry.ts#L163)

数値を設定します。初回アクセス時にスロットを確保します。

#### Parameters

##### ns

`string`

##### key

`string`

##### value

`number`

#### Returns

`void`
