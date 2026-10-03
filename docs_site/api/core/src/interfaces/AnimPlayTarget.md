[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / AnimPlayTarget

# Interface: AnimPlayTarget

Defined in: [core/src/arena/InstanceBufferArena.ts:106](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L106)

## Methods

### getAnimState()

> **getAnimState**(`id`): [`AnimState`](../classes/AnimState.md)

Defined in: [core/src/arena/InstanceBufferArena.ts:109](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L109)

#### Parameters

##### id

`number`

#### Returns

[`AnimState`](../classes/AnimState.md)

***

### play()

> **play**(`id`, `key`, `ignoreIfPlaying?`): [`AnimState`](../classes/AnimState.md)

Defined in: [core/src/arena/InstanceBufferArena.ts:107](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L107)

#### Parameters

##### id

`number`

##### key

`string`

##### ignoreIfPlaying?

`boolean`

#### Returns

[`AnimState`](../classes/AnimState.md)

***

### playReverse()

> **playReverse**(`id`, `key`, `ignoreIfPlaying?`): [`AnimState`](../classes/AnimState.md)

Defined in: [core/src/arena/InstanceBufferArena.ts:108](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L108)

#### Parameters

##### id

`number`

##### key

`string`

##### ignoreIfPlaying?

`boolean`

#### Returns

[`AnimState`](../classes/AnimState.md)

***

### stop()

> **stop**(`id`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:110](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L110)

#### Parameters

##### id

`number`

#### Returns

`void`
