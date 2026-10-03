[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [pluto/src](../README.md) / VerletPlugin

# Class: VerletPlugin

Defined in: [verlet-ik/src/VerletPlugin.ts:31](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletPlugin.ts#L31)

## Implements

- [`Plugin`](../../../core/src/interfaces/Plugin.md)

## Constructors

### Constructor

> **new VerletPlugin**(`options?`): `VerletPlugin`

Defined in: [verlet-ik/src/VerletPlugin.ts:39](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletPlugin.ts#L39)

#### Parameters

##### options?

[`VerletPluginOptions`](../interfaces/VerletPluginOptions.md) = `{}`

#### Returns

`VerletPlugin`

## Properties

### name

> `readonly` **name**: `"VerletPlugin"` = `'VerletPlugin'`

Defined in: [verlet-ik/src/VerletPlugin.ts:32](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletPlugin.ts#L32)

***

### solver

> **solver**: [`VerletSolver`](VerletSolver.md) = `null`

Defined in: [verlet-ik/src/VerletPlugin.ts:35](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletPlugin.ts#L35)

シーン側へ公開するソルバー。build() 後まで null です。

## Methods

### build()

> **build**(): [`VerletSolver`](VerletSolver.md)

Defined in: [verlet-ik/src/VerletPlugin.ts:52](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletPlugin.ts#L52)

ソルバーを生成して Scene へ公開します。

init() の時点ではまだ生成しません。ゲーム側が初めて
`scene.verlet` を参照した時点、あるいは `build()` を明示呼んだ時点で
生成されます。

#### Returns

[`VerletSolver`](VerletSolver.md)

***

### createTentacle()

> **createTentacle**(`rootX`, `rootY`, `options?`): [`Tentacle`](Tentacle.md)

Defined in: [verlet-ik/src/VerletPlugin.ts:71](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletPlugin.ts#L71)

触手 (マントや揺れの演出用) を作ります。

#### Parameters

##### rootX

`number`

##### rootY

`number`

##### options?

[`TentacleOptions`](../interfaces/TentacleOptions.md) = `{}`

#### Returns

[`Tentacle`](Tentacle.md)

***

### init()

> **init**(`scene`): `void`

Defined in: [verlet-ik/src/VerletPlugin.ts:41](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletPlugin.ts#L41)

プラグインの初期化時に呼ばれます

#### Parameters

##### scene

[`Scene`](../../../core/src/classes/Scene.md)

#### Returns

`void`

#### Implementation of

[`Plugin`](../../../core/src/interfaces/Plugin.md).[`init`](../../../core/src/interfaces/Plugin.md#init)

***

### update()

> **update**(`dt`): `void`

Defined in: [verlet-ik/src/VerletPlugin.ts:75](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletPlugin.ts#L75)

毎フレームの可変更新時に呼ばれます

#### Parameters

##### dt

`number`

#### Returns

`void`

#### Implementation of

[`Plugin`](../../../core/src/interfaces/Plugin.md).[`update`](../../../core/src/interfaces/Plugin.md#update)
