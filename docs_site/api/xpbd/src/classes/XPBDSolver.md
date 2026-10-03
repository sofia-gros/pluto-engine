[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [xpbd/src](../README.md) / XPBDSolver

# Class: XPBDSolver

Defined in: [xpbd/src/XPBDSolver.ts:73](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/xpbd/src/XPBDSolver.ts#L73)

## Constructors

### Constructor

> **new XPBDSolver**(): `XPBDSolver`

#### Returns

`XPBDSolver`

## Methods

### resolveOverlaps()

> `static` **resolveOverlaps**(`p`, `dt`, `options?`): `void`

Defined in: [xpbd/src/XPBDSolver.ts:160](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/xpbd/src/XPBDSolver.ts#L160)

位置のみの重なり緩和を行います。

ステアリング後に「めり込みだけを解きたい」場合) に適しています。
ステアリング後に「重なりだけ」を解きたい場合に適しています。
緩和で生じた位置変化を速度へ書き戻すので、押し戻しが
次のフレームの挙動に影響します。

#### Parameters

##### p

[`XPBDParticles`](../interfaces/XPBDParticles.md)

##### dt

`number`

位置変化を速度へ戻すための刻み幅

##### options?

[`XPBDSolverOptions`](../interfaces/XPBDSolverOptions.md) = `{}`

#### Returns

`void`

***

### ~~solve()~~

> `static` **solve**(`count`, `positionsX`, `positionsY`, `radii`, `invMasses`, `iterations`, `dt`, `compliance?`): `void`

Defined in: [xpbd/src/XPBDSolver.ts:375](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/xpbd/src/XPBDSolver.ts#L375)

後方互換のための旧 API。
速度と前フレーム位置がないため、1 ステップ完結の静的緩和として扱います。

#### Parameters

##### count

`number`

##### positionsX

`Float32Array`

##### positionsY

`Float32Array`

##### radii

`Float32Array`

##### invMasses

`Float32Array`

##### iterations

`number`

##### dt

`number`

##### compliance?

`number` = `0`

#### Returns

`void`

#### Deprecated

速度を扱う `step()` を使ってください

***

### step()

> `static` **step**(`p`, `dt`, `options?`): `void`

Defined in: [xpbd/src/XPBDSolver.ts:83](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/xpbd/src/XPBDSolver.ts#L83)

1 ステップを解きます。

処理の流れ:
 1. 位置を速度で積分する
 2. サブステップごとに 1 反復ずつ接触拘束を解く
 3. 速度を新しい位置から再計算する
 4. 摩擦と反発を適用する

#### Parameters

##### p

[`XPBDParticles`](../interfaces/XPBDParticles.md)

##### dt

`number`

##### options?

[`XPBDSolverOptions`](../interfaces/XPBDSolverOptions.md) = `{}`

#### Returns

`void`
