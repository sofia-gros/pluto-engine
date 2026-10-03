[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / EventEmitter

# Class: EventEmitter

Defined in: [core/src/events/EventEmitter.ts:89](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/EventEmitter.ts#L89)

## Constructors

### Constructor

> **new EventEmitter**(): `EventEmitter`

#### Returns

`EventEmitter`

## Methods

### emit()

> **emit**(`event`, ...`args`): `void`

Defined in: [core/src/events/EventEmitter.ts:142](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/EventEmitter.ts#L142)

イベントを発火します。

- emit 中の `off` は即座に効きます。以降のリスナは呼ばれません。
- emit 中の `on` は次回 emit から有効です (スナップショット長で止めるため)。

注意: 可変長引数は呼び出しごとに配列を 1 つ生成します。
ホットパス (毎フレーム発火) では `emit1` / `emit2` / `emit3` を使ってください。

#### Parameters

##### event

`string`

##### args

...`any`[]

#### Returns

`void`

***

### emit0()

> **emit0**(`event`): `void`

Defined in: [core/src/events/EventEmitter.ts:210](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/EventEmitter.ts#L210)

引数を 0 個で発火します。引数配列すら生成しません。

#### Parameters

##### event

`string`

#### Returns

`void`

***

### emit1()

> **emit1**(`event`, `a`): `void`

Defined in: [core/src/events/EventEmitter.ts:163](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/EventEmitter.ts#L163)

引数 1 個で発火します。可変長引数の配列生成を避けます。
ハンドル (Flyweight) を 1 つ通知する場合に使う想定です。

#### Parameters

##### event

`string`

##### a

`unknown`

#### Returns

`void`

***

### emit2()

> **emit2**(`event`, `a`, `b`): `void`

Defined in: [core/src/events/EventEmitter.ts:178](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/EventEmitter.ts#L178)

引数 2 個で発火します。

#### Parameters

##### event

`string`

##### a

`unknown`

##### b

`unknown`

#### Returns

`void`

***

### emit3()

> **emit3**(`event`, `a`, `b`, `c`): `void`

Defined in: [core/src/events/EventEmitter.ts:193](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/EventEmitter.ts#L193)

引数 3 個で発火します。衝突のコールバック (bodyA / bodyB) で使います。

#### Parameters

##### event

`string`

##### a

`unknown`

##### b

`unknown`

##### c

`unknown`

#### Returns

`void`

***

### eventNames()

> **eventNames**(): `string`[]

Defined in: [core/src/events/EventEmitter.ts:246](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/EventEmitter.ts#L246)

イベント名を列挙します (プロファイラ・テスト用)。

#### Returns

`string`[]

***

### listenerCount()

> **listenerCount**(`event`): `number`

Defined in: [core/src/events/EventEmitter.ts:238](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/EventEmitter.ts#L238)

登録済みリスナ数を返します。

#### Parameters

##### event

`string`

#### Returns

`number`

***

### off()

> **off**(`event`, `fn`): `void`

Defined in: [core/src/events/EventEmitter.ts:124](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/EventEmitter.ts#L124)

購読を解除します。

#### Parameters

##### event

`string`

##### fn

[`EventListener`](../type-aliases/EventListener.md)

#### Returns

`void`

***

### on()

> **on**(`event`, `fn`): () => `void`

Defined in: [core/src/events/EventEmitter.ts:98](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/EventEmitter.ts#L98)

イベントを購読します。

#### Parameters

##### event

`string`

##### fn

[`EventListener`](../type-aliases/EventListener.md)

#### Returns

解除関数。`off(event, fn)` と同じ効果です。

() => `void`

***

### once()

> **once**(`event`, `fn`): () => `void`

Defined in: [core/src/events/EventEmitter.ts:113](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/EventEmitter.ts#L113)

一度だけ発火する購読を登録します。

#### Parameters

##### event

`string`

##### fn

[`EventListener`](../type-aliases/EventListener.md)

#### Returns

() => `void`

***

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: [core/src/events/EventEmitter.ts:253](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/events/EventEmitter.ts#L253)

すべての購読を破棄します。

#### Returns

`void`
