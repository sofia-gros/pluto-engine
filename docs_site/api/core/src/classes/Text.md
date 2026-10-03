[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Text

# Class: Text

Defined in: [core/src/arena/Text.ts:56](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Text.ts#L56)

## Constructors

### Constructor

> **new Text**(`x`, `y`, `text`, `style`, `arena`): `Text`

Defined in: [core/src/arena/Text.ts:98](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Text.ts#L98)

#### Parameters

##### x

`number`

##### y

`number`

##### text

`string`

##### style

[`TextStyle`](../interfaces/TextStyle.md)

##### arena

[`InstanceBufferArena`](InstanceBufferArena.md)

#### Returns

`Text`

## Properties

### x

> **x**: `number`

Defined in: [core/src/arena/Text.ts:58](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Text.ts#L58)

***

### y

> **y**: `number`

Defined in: [core/src/arena/Text.ts:59](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Text.ts#L59)

## Accessors

### glyphCount

#### Get Signature

> **get** **glyphCount**(): `number`

Defined in: [core/src/arena/Text.ts:393](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Text.ts#L393)

##### Returns

`number`

***

### text

#### Get Signature

> **get** **text**(): `string`

Defined in: [core/src/arena/Text.ts:371](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Text.ts#L371)

##### Returns

`string`

#### Set Signature

> **set** **text**(`value`): `void`

Defined in: [core/src/arena/Text.ts:375](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Text.ts#L375)

##### Parameters

###### value

`string`

##### Returns

`void`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [core/src/arena/Text.ts:397](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Text.ts#L397)

#### Returns

`void`

***

### rebuild()

> **rebuild**(): `void`

Defined in: [core/src/arena/Text.ts:133](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Text.ts#L133)

レイアウトを作り直します。
文字列長が増えない限り
アリーナ ID は再利用されます。
ヒープ割り当ては発生しません。

#### Returns

`void`

***

### setGlyphSource()

> **setGlyphSource**(`source`): `void`

Defined in: [core/src/arena/Text.ts:119](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Text.ts#L119)

フォント UV の供給元を差し替えます (MSDF アトラス接続用)。

#### Parameters

##### source

[`FontGlyphSource`](../interfaces/FontGlyphSource.md)

#### Returns

`void`

***

### setPosition()

> **setPosition**(`x`, `y`): `void`

Defined in: [core/src/arena/Text.ts:385](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Text.ts#L385)

基準位置を設定し、レイアウトを再計算します。

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`void`
