[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [pluto/src](../README.md) / PoissonPlugin

# Class: PoissonPlugin

Defined in: [poisson/src/PoissonPlugin.ts:13](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonPlugin.ts#L13)

PoissonPlugin

## Implements

- [`Plugin`](../../../core/src/interfaces/Plugin.md)

## Constructors

### Constructor

> **new PoissonPlugin**(`solver`): `PoissonPlugin`

Defined in: [poisson/src/PoissonPlugin.ts:16](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonPlugin.ts#L16)

#### Parameters

##### solver

[`PoissonSolver`](PoissonSolver.md)

#### Returns

`PoissonPlugin`

## Properties

### name

> **name**: `string` = `'PoissonPlugin'`

Defined in: [poisson/src/PoissonPlugin.ts:14](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonPlugin.ts#L14)

## Methods

### init()

> **init**(`scene`): `void`

Defined in: [poisson/src/PoissonPlugin.ts:18](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonPlugin.ts#L18)

プラグインの初期化時に呼ばれます

#### Parameters

##### scene

[`Scene`](../../../core/src/classes/Scene.md)

#### Returns

`void`

#### Implementation of

[`Plugin`](../../../core/src/interfaces/Plugin.md).[`init`](../../../core/src/interfaces/Plugin.md#init)
