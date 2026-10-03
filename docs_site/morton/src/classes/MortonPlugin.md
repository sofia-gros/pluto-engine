[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [morton/src](../README.md) / MortonPlugin

# Class: MortonPlugin

Defined in: [morton/src/MortonPlugin.ts:16](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/morton/src/MortonPlugin.ts#L16)

PlutoEngine Scene プラグイン
SceneにMortonSpatialHashインスタンスを注入します。

## Implements

- [`Plugin`](../../../core/src/interfaces/Plugin.md)

## Constructors

### Constructor

> **new MortonPlugin**(`cellSize?`): `MortonPlugin`

Defined in: [morton/src/MortonPlugin.ts:20](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/morton/src/MortonPlugin.ts#L20)

#### Parameters

##### cellSize?

`number` = `64`

#### Returns

`MortonPlugin`

## Methods

### init()

> **init**(`scene`): `void`

Defined in: [morton/src/MortonPlugin.ts:24](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/morton/src/MortonPlugin.ts#L24)

プラグインの初期化時に呼ばれます

#### Parameters

##### scene

[`Scene`](../../../core/src/classes/Scene.md)

#### Returns

`void`

#### Implementation of

[`Plugin`](../../../core/src/interfaces/Plugin.md).[`init`](../../../core/src/interfaces/Plugin.md#init)
