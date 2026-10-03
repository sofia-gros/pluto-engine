[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [xpbd/src](../README.md) / XPBDPlugin

# Class: XPBDPlugin

Defined in: [xpbd/src/XPBDPlugin.ts:13](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/xpbd/src/XPBDPlugin.ts#L13)

XPBDPlugin

## Implements

- [`Plugin`](../../../core/src/interfaces/Plugin.md)

## Constructors

### Constructor

> **new XPBDPlugin**(`solver`): `XPBDPlugin`

Defined in: [xpbd/src/XPBDPlugin.ts:16](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/xpbd/src/XPBDPlugin.ts#L16)

#### Parameters

##### solver

[`XPBDSolver`](XPBDSolver.md)

#### Returns

`XPBDPlugin`

## Properties

### name

> **name**: `string` = `'XPBDPlugin'`

Defined in: [xpbd/src/XPBDPlugin.ts:14](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/xpbd/src/XPBDPlugin.ts#L14)

## Methods

### init()

> **init**(`scene`): `void`

Defined in: [xpbd/src/XPBDPlugin.ts:18](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/xpbd/src/XPBDPlugin.ts#L18)

プラグインの初期化時に呼ばれます

#### Parameters

##### scene

[`Scene`](../../../core/src/classes/Scene.md)

#### Returns

`void`

#### Implementation of

[`Plugin`](../../../core/src/interfaces/Plugin.md).[`init`](../../../core/src/interfaces/Plugin.md#init)
