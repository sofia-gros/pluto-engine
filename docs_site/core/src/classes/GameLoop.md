[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / GameLoop

# Class: GameLoop

Defined in: [core/src/core/GameLoop.ts:45](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L45)

## Constructors

### Constructor

> **new GameLoop**(`config?`, `callbacks?`): `GameLoop`

Defined in: [core/src/core/GameLoop.ts:68](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L68)

#### Parameters

##### config?

[`LoopConfig`](../interfaces/LoopConfig.md) = `{}`

##### callbacks?

[`LoopCallbacks`](../interfaces/LoopCallbacks.md) = `{}`

#### Returns

`GameLoop`

## Properties

### config

> `readonly` **config**: `Required`\<[`LoopConfig`](../interfaces/LoopConfig.md)\>

Defined in: [core/src/core/GameLoop.ts:46](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L46)

***

### fixedStepCount

> **fixedStepCount**: `number` = `0`

Defined in: [core/src/core/GameLoop.ts:58](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L58)

***

### frameCount

> **frameCount**: `number` = `0`

Defined in: [core/src/core/GameLoop.ts:57](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L57)

計測用カウンタ

***

### measuredFps

> **measuredFps**: `number` = `0`

Defined in: [core/src/core/GameLoop.ts:61](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L61)

直近に実測した実効 FPS (1 秒窓)

***

### skippedFrameCount

> **skippedFrameCount**: `number` = `0`

Defined in: [core/src/core/GameLoop.ts:59](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L59)

## Accessors

### running

#### Get Signature

> **get** **running**(): `boolean`

Defined in: [core/src/core/GameLoop.ts:98](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L98)

##### Returns

`boolean`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [core/src/core/GameLoop.ts:178](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L178)

ループを破棄します。

#### Returns

`void`

***

### start()

> **start**(`now?`): `void`

Defined in: [core/src/core/GameLoop.ts:79](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L79)

#### Parameters

##### now?

`number` = `...`

#### Returns

`void`

***

### step()

> **step**(`now`): `void`

Defined in: [core/src/core/GameLoop.ts:112](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L112)

1 フレーム分の処理を実行します。
テストからは rAF に依存せず直接このメソッドを呼べます。

#### Parameters

##### now

`number`

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [core/src/core/GameLoop.ts:90](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/GameLoop.ts#L90)

#### Returns

`void`
