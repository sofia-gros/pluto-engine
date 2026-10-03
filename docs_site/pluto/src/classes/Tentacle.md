[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [pluto/src](../README.md) / Tentacle

# Class: Tentacle

Defined in: [verlet-ik/src/Tentacle.ts:37](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/verlet-ik/src/Tentacle.ts#L37)

## Constructors

### Constructor

> **new Tentacle**(`solver`, `rootX`, `rootY`, `options?`): `Tentacle`

Defined in: [verlet-ik/src/Tentacle.ts:55](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/verlet-ik/src/Tentacle.ts#L55)

既存ソルバーへ触手を追加します。
ソルバーは複数本の触手をまとめて 1 つの Buffers 上で解きます。

#### Parameters

##### solver

[`VerletSolver`](VerletSolver.md)

##### rootX

`number`

##### rootY

`number`

##### options?

[`TentacleOptions`](../interfaces/TentacleOptions.md) = `{}`

#### Returns

`Tentacle`

## Properties

### count

> `readonly` **count**: `number`

Defined in: [verlet-ik/src/Tentacle.ts:41](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/verlet-ik/src/Tentacle.ts#L41)

節数

***

### pointsX

> `readonly` **pointsX**: `Float32Array`

Defined in: [verlet-ik/src/Tentacle.ts:44](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/verlet-ik/src/Tentacle.ts#L44)

節のワールド座標 X (SoA)

***

### pointsY

> `readonly` **pointsY**: `Float32Array`

Defined in: [verlet-ik/src/Tentacle.ts:46](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/verlet-ik/src/Tentacle.ts#L46)

節のワールド座標 Y (SoA)

***

### rootIndex

> `readonly` **rootIndex**: `number`

Defined in: [verlet-ik/src/Tentacle.ts:39](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/verlet-ik/src/Tentacle.ts#L39)

根元 (固定点) の点インデックス

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [verlet-ik/src/Tentacle.ts:156](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/verlet-ik/src/Tentacle.ts#L156)

この触手が使う点と拘束をソルバーから解放します。

末尾にある場合だけ正しく解放できます。途中の鎖を消すと
接続が壊れるため、末尾の触手から順に呼び出してください。

#### Returns

`void`

***

### getPoint()

> **getPoint**(`i`, `out`): `void`

Defined in: [verlet-ik/src/Tentacle.ts:116](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/verlet-ik/src/Tentacle.ts#L116)

節 i の座標を取得します。範囲外の場合は 0 を返します。

#### Parameters

##### i

`number`

##### out

###### x

`number`

###### y

`number`

#### Returns

`void`

***

### getTip()

> **getTip**(`out`): `void`

Defined in: [verlet-ik/src/Tentacle.ts:132](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/verlet-ik/src/Tentacle.ts#L132)

先端の座標を取得します。触手の先端の判定に使います。

#### Parameters

##### out

###### x

`number`

###### y

`number`

#### Returns

`void`

***

### setRoot()

> **setRoot**(`x`, `y`): `void`

Defined in: [verlet-ik/src/Tentacle.ts:85](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/verlet-ik/src/Tentacle.ts#L85)

根元を現在の座標へ移動します。持ち主に追従させるために呼びます。

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`void`

***

### setRootWithVelocity()

> **setRootWithVelocity**(`x`, `y`, `vx`, `vy`): `void`

Defined in: [verlet-ik/src/Tentacle.ts:93](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/verlet-ik/src/Tentacle.ts#L93)

根元を移動しつつ、根元に速度を与えます。
触手が移動する持ち主に追従して流れるように見えます。

#### Parameters

##### x

`number`

##### y

`number`

##### vx

`number`

##### vy

`number`

#### Returns

`void`

***

### sync()

> **sync**(): `void`

Defined in: [verlet-ik/src/Tentacle.ts:103](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/verlet-ik/src/Tentacle.ts#L103)

ソルバーを 1 ステップ進め、節座標をこの触手metroのバッファへ転記します。

複数本の触手で 1 つのソルバーを共有する場合、
solver.update() は 1 度だけ呼び、その後各触手が sync() します。

#### Returns

`void`

***

### totalLength()

> **totalLength**(): `number`

Defined in: [verlet-ik/src/Tentacle.ts:140](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/verlet-ik/src/Tentacle.ts#L140)

触手全体の長さを返します。

#### Returns

`number`
