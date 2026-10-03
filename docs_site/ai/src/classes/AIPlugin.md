[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [ai/src](../README.md) / AIPlugin

# Class: AIPlugin

Defined in: [ai/src/AIPlugin.ts:13](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/ai/src/AIPlugin.ts#L13)

AIPlugin

## Implements

- [`Plugin`](../../../core/src/interfaces/Plugin.md)

## Constructors

### Constructor

> **new AIPlugin**(`solver`): `AIPlugin`

Defined in: [ai/src/AIPlugin.ts:16](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/ai/src/AIPlugin.ts#L16)

#### Parameters

##### solver

[`UtilityAISystem`](UtilityAISystem.md)

#### Returns

`AIPlugin`

## Properties

### name

> **name**: `string` = `'AIPlugin'`

Defined in: [ai/src/AIPlugin.ts:14](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/ai/src/AIPlugin.ts#L14)

## Methods

### init()

> **init**(`scene`): `void`

Defined in: [ai/src/AIPlugin.ts:18](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/ai/src/AIPlugin.ts#L18)

プラグインの初期化時に呼ばれます

#### Parameters

##### scene

[`Scene`](../../../core/src/classes/Scene.md)

#### Returns

`void`

#### Implementation of

[`Plugin`](../../../core/src/interfaces/Plugin.md).[`init`](../../../core/src/interfaces/Plugin.md#init)
