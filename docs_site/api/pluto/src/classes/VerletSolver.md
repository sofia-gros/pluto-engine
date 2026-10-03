[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [pluto/src](../README.md) / VerletSolver

# Class: VerletSolver

Defined in: [verlet-ik/src/VerletSolver.ts:11](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L11)

## File

VerletSolver.ts

## Description

マントや触手の演出に特化したゼロアロケーションの Verlet 積分ソルバー。

設計方針:
 - 状態はすべて SoA の TypedArray に置き、毎フレームの new を排除します。
 - 固定点を明示的に持つため、ロープの根元を物体の座標へそのまま追従できます。
 - 拘束の反復回数を増やせば剛性が高まり、減らせば柔らかく動きます。

## Constructors

### Constructor

> **new VerletSolver**(`maxPoints`, `maxConstraints`, `iterations?`): `VerletSolver`

Defined in: [verlet-ik/src/VerletSolver.ts:37](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L37)

#### Parameters

##### maxPoints

`number`

最大点数

##### maxConstraints

`number`

最大距離拘束数

##### iterations?

`number` = `3`

拘束解法の反復回数 (既定 3)

#### Returns

`VerletSolver`

## Properties

### constraintLengths

> **constraintLengths**: `Float32Array`

Defined in: [verlet-ik/src/VerletSolver.ts:15](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L15)

***

### constraints

> **constraints**: `Int32Array`

Defined in: [verlet-ik/src/VerletSolver.ts:14](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L14)

***

### pinned

> `readonly` **pinned**: `Uint8Array`

Defined in: [verlet-ik/src/VerletSolver.ts:20](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L20)

固定された点インデックスを持つ SoA 配列。
0 = 自由、1 = 固定。固定点は積分から除外し、前位置も常に同期させます。

***

### positions

> **positions**: `Float32Array`

Defined in: [verlet-ik/src/VerletSolver.ts:12](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L12)

***

### prevPositions

> **prevPositions**: `Float32Array`

Defined in: [verlet-ik/src/VerletSolver.ts:13](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L13)

## Accessors

### constraintCount

#### Get Signature

> **get** **constraintCount**(): `number`

Defined in: [verlet-ik/src/VerletSolver.ts:59](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L59)

登録済みの拘束数

##### Returns

`number`

***

### iterations

#### Get Signature

> **get** **iterations**(): `number`

Defined in: [verlet-ik/src/VerletSolver.ts:64](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L64)

拘束解法の反復回数

##### Returns

`number`

***

### pointCount

#### Get Signature

> **get** **pointCount**(): `number`

Defined in: [verlet-ik/src/VerletSolver.ts:54](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L54)

登録済みの点数

##### Returns

`number`

## Methods

### addChain()

> **addChain**(`count`, `rootX`, `rootY`, `dirX`, `dirY`, `segmentLength`): `number`

Defined in: [verlet-ik/src/VerletSolver.ts:171](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L171)

直線上の鎖 (ロープ・触手・マント) を一括生成します。

点はすべて等間隔で設置され、隣接点どうしに距離拘束が入ります。
先頭点 (根元) は固定されるため、そのまま物体の位置として追従できます。

#### Parameters

##### count

`number`

点数 (根元を含む)

##### rootX

`number`

根元の X

##### rootY

`number`

根元の Y

##### dirX

`number`

伸びる方向の X 成分 (正規化されます)

##### dirY

`number`

伸びる方向の Y 成分 (正規化されます)

##### segmentLength

`number`

隣接点間の距離

#### Returns

`number`

根元の点インデックス。容量超過時は -1

***

### addConstraint()

> **addConstraint**(`p1`, `p2`, `length`): `number`

Defined in: [verlet-ik/src/VerletSolver.ts:147](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L147)

#### Parameters

##### p1

`number`

##### p2

`number`

##### length

`number`

#### Returns

`number`

***

### addPoint()

> **addPoint**(`x`, `y`): `number`

Defined in: [verlet-ik/src/VerletSolver.ts:117](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L117)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`number`

***

### getPointPosition()

> **getPointPosition**(`index`, `out`): `void`

Defined in: [verlet-ik/src/VerletSolver.ts:136](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L136)

#### Parameters

##### index

`number`

##### out

###### x

`number`

###### y

`number`

#### Returns

`void`

***

### isPinned()

> **isPinned**(`index`): `boolean`

Defined in: [verlet-ik/src/VerletSolver.ts:108](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L108)

#### Parameters

##### index

`number`

#### Returns

`boolean`

***

### moveRoot()

> **moveRoot**(`index`, `x`, `y`): `void`

Defined in: [verlet-ik/src/VerletSolver.ts:208](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L208)

鎖の根元 (固定点) を移動します。物体の追従に使います。

#### Parameters

##### index

`number`

##### x

`number`

##### y

`number`

#### Returns

`void`

***

### pin()

> **pin**(`index`, `x`, `y`): `void`

Defined in: [verlet-ik/src/VerletSolver.ts:89](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L89)

点を固定します。固定点は重力・速度の影響を受けません。

#### Parameters

##### index

`number`

##### x

`number`

##### y

`number`

#### Returns

`void`

***

### reset()

> **reset**(): `void`

Defined in: [verlet-ik/src/VerletSolver.ts:331](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L331)

#### Returns

`void`

***

### setDamping()

> **setDamping**(`d`): `void`

Defined in: [verlet-ik/src/VerletSolver.ts:82](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L82)

速度減衰を設定します。マントや触手の抜け Monument を抑えます。

#### Parameters

##### d

`number`

#### Returns

`void`

***

### setGravity()

> **setGravity**(`gx`, `gy`): `void`

Defined in: [verlet-ik/src/VerletSolver.ts:112](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L112)

#### Parameters

##### gx

`number`

##### gy

`number`

#### Returns

`void`

***

### setIterations()

> **setIterations**(`n`): `void`

Defined in: [verlet-ik/src/VerletSolver.ts:68](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L68)

#### Parameters

##### n

`number`

#### Returns

`void`

***

### setPointPosition()

> **setPointPosition**(`index`, `x`, `y`): `void`

Defined in: [verlet-ik/src/VerletSolver.ts:129](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L129)

#### Parameters

##### index

`number`

##### x

`number`

##### y

`number`

#### Returns

`void`

***

### setStiffness()

> **setStiffness**(`s`): `void`

Defined in: [verlet-ik/src/VerletSolver.ts:75](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L75)

拘束の剛性係数を設定します。0.5 なら誤差が半分ずつしか解消されません。

#### Parameters

##### s

`number`

#### Returns

`void`

***

### steerRoot()

> **steerRoot**(`index`, `x`, `y`, `velocityX`, `velocityY`): `void`

Defined in: [verlet-ik/src/VerletSolver.ts:218](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L218)

鎖の進行方向を書き換えます (触手の狙い撃ち)。

根元に速度を与えることで、鎖全体がその向きへ引かれます。
演出上の「狙う」動作に使います。

#### Parameters

##### index

`number`

##### x

`number`

##### y

`number`

##### velocityX

`number`

##### velocityY

`number`

#### Returns

`void`

***

### unpin()

> **unpin**(`index`): `void`

Defined in: [verlet-ik/src/VerletSolver.ts:103](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L103)

固定を解除します。

#### Parameters

##### index

`number`

#### Returns

`void`

***

### update()

> **update**(`dt`): `void`

Defined in: [verlet-ik/src/VerletSolver.ts:232](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/VerletSolver.ts#L232)

#### Parameters

##### dt

`number`

#### Returns

`void`
