[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [pluto/src](../README.md) / PoissonSolver

# Class: PoissonSolver

Defined in: [poisson/src/PoissonSolver.ts:6](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L6)

単側非圧縮性制約（UIC: Unilateral Incompressibility Constraint）に基づくグリッドポアソンソルバー。
群集流体シミュレーション（Continuum Crowds）や流体シミュレーションで活用される。
ゼロアロケーション原則に従い、SoA (Float32Array) によるヤコビ反復解法を実装。

## Constructors

### Constructor

> **new PoissonSolver**(`width`, `height`, `cellSize?`): `PoissonSolver`

Defined in: [poisson/src/PoissonSolver.ts:26](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L26)

#### Parameters

##### width

`number`

##### height

`number`

##### cellSize?

`number` = `1.0`

#### Returns

`PoissonSolver`

## Properties

### cellSize

> **cellSize**: `number`

Defined in: [poisson/src/PoissonSolver.ts:23](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L23)

***

### density

> `readonly` **density**: `Float32Array`

Defined in: [poisson/src/PoissonSolver.ts:11](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L11)

***

### divergence

> `readonly` **divergence**: `Float32Array`

Defined in: [poisson/src/PoissonSolver.ts:13](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L13)

***

### height

> `readonly` **height**: `number`

Defined in: [poisson/src/PoissonSolver.ts:8](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L8)

***

### invCellSize

> **invCellSize**: `number`

Defined in: [poisson/src/PoissonSolver.ts:24](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L24)

***

### pressure

> `readonly` **pressure**: `Float32Array`

Defined in: [poisson/src/PoissonSolver.ts:12](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L12)

***

### vectorFieldVx

> `readonly` **vectorFieldVx**: `Float32Array`

Defined in: [poisson/src/PoissonSolver.ts:16](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L16)

***

### vectorFieldVy

> `readonly` **vectorFieldVy**: `Float32Array`

Defined in: [poisson/src/PoissonSolver.ts:17](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L17)

***

### width

> `readonly` **width**: `number`

Defined in: [poisson/src/PoissonSolver.ts:7](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L7)

## Methods

### clear()

> **clear**(): `void`

Defined in: [poisson/src/PoissonSolver.ts:44](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L44)

新しいフレーム用に全グリッドデータをクリアする。

#### Returns

`void`

***

### computeDivergence()

> **computeDivergence**(`targetDensity`): `void`

Defined in: [poisson/src/PoissonSolver.ts:95](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L95)

UIC ロジックに基づき発散場（Divergence Field）を計算する。
目標密度を超過した過密領域にのみ正の圧力（押し戻し力）を発生させる。

#### Parameters

##### targetDensity

`number`

許容最大密度

#### Returns

`void`

***

### getPressureGradient()

> **getPressureGradient**(`x`, `y`, `outGradient`): `void`

Defined in: [poisson/src/PoissonSolver.ts:228](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L228)

ワールド座標における圧力勾配をサンプリングする。

#### Parameters

##### x

`number`

ワールドX座標

##### y

`number`

ワールドY座標

##### outGradient

`Float32Array`

[dx, dy] を格納する Float32Array（ゼロアロケーション）

#### Returns

`void`

***

### precomputeVectorField()

> **precomputeVectorField**(`baseDirX`, `baseDirY`, `speed`, `pressureWeight?`): `void`

Defined in: [poisson/src/PoissonSolver.ts:149](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L149)

圧力勾配と目標方向ベクトルを統合し、全グリッドセルに対して事前に速度場を一括計算する。
30万体エンティティが毎フレーム個別に行っていた勾配計算・平方根演算を 1 回（16k回）に集約する。

#### Parameters

##### baseDirX

`Float32Array`

目標進行方向 X 成分配列

##### baseDirY

`Float32Array`

目標進行方向 Y 成分配列

##### speed

`number`

基本移動速度

##### pressureWeight?

`number` = `0.5`

圧力勾配の影響度係数

#### Returns

`void`

***

### sampleVelocityBilinear()

> **sampleVelocityBilinear**(`x`, `y`, `outVel`): `void`

Defined in: [poisson/src/PoissonSolver.ts:188](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L188)

事前計算済み速度場から、双線形補間（Bilinear Interpolation）を用いて滑らかな移動速度をサンプリングする。
セル境界での不連続な回転・急旋回を完全に排除する。

#### Parameters

##### x

`number`

ワールドX座標

##### y

`number`

ワールドY座標

##### outVel

`Float32Array`

[vx, vy] を格納する Float32Array（ゼロアロケーション）

#### Returns

`void`

***

### solve()

> **solve**(`iterations`): `void`

Defined in: [poisson/src/PoissonSolver.ts:108](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L108)

ヤコビ反復（Jacobi Iteration）を用いてポアソン圧力方程式を解く。
Laplacian(pressure) = divergence

#### Parameters

##### iterations

`number`

反復回数

#### Returns

`void`

***

### splatDensity()

> **splatDensity**(`x`, `y`, `amount`): `void`

Defined in: [poisson/src/PoissonSolver.ts:59](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonSolver.ts#L59)

双線形補間（Bilinear Splatting）を用いて、ワールド座標 (x, y) に密度（または質量）を加算する。

#### Parameters

##### x

`number`

ワールドX座標

##### y

`number`

ワールドY座標

##### amount

`number`

加算量

#### Returns

`void`
