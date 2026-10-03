[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / LoopCallbacks

# Interface: LoopCallbacks

Defined in: [core/src/core/GameLoop.ts:26](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L26)

## Properties

### onFixedUpdate?

> `optional` **onFixedUpdate?**: (`fixedDt`) => `void`

Defined in: [core/src/core/GameLoop.ts:30](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L30)

固定ステップ。引数は固定刻み幅 (秒)

#### Parameters

##### fixedDt

`number`

#### Returns

`void`

***

### onRender?

> `optional` **onRender?**: (`time`) => `void`

Defined in: [core/src/core/GameLoop.ts:32](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L32)

描画

#### Parameters

##### time

`number`

#### Returns

`void`

***

### onSkip?

> `optional` **onSkip?**: (`time`) => `void`

Defined in: [core/src/core/GameLoop.ts:34](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L34)

目標FPS によるフレームスキップが発生したとき

#### Parameters

##### time

`number`

#### Returns

`void`

***

### onUpdate?

> `optional` **onUpdate?**: (`time`, `dt`) => `void`

Defined in: [core/src/core/GameLoop.ts:28](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L28)

可変フレームの更新。引数は (time 秒, dt 秒)

#### Parameters

##### time

`number`

##### dt

`number`

#### Returns

`void`
