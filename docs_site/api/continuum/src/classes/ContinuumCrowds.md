[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [continuum/src](../README.md) / ContinuumCrowds

# Class: ContinuumCrowds

Defined in: [continuum/src/ContinuumCrowds.ts:25](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L25)

## Constructors

### Constructor

> **new ContinuumCrowds**(`width`, `height`, `cellSize`, `options?`): `ContinuumCrowds`

Defined in: [continuum/src/ContinuumCrowds.ts:53](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L53)

#### Parameters

##### width

`number`

##### height

`number`

##### cellSize

`number`

##### options?

[`ContinuumCrowdsOptions`](../interfaces/ContinuumCrowdsOptions.md) = `{}`

#### Returns

`ContinuumCrowds`

## Properties

### cellSize

> `readonly` **cellSize**: `number`

Defined in: [continuum/src/ContinuumCrowds.ts:41](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L41)

***

### density

> `readonly` **density**: `Float32Array`

Defined in: [continuum/src/ContinuumCrowds.ts:46](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L46)

一時作業バッファ (コンストラクタで確保)

***

### fieldVx

> `readonly` **fieldVx**: `Float32Array`

Defined in: [continuum/src/ContinuumCrowds.ts:34](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L34)

速度場 (目標進行方向と圧力勾配の合成結果)

***

### fieldVy

> `readonly` **fieldVy**: `Float32Array`

Defined in: [continuum/src/ContinuumCrowds.ts:35](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L35)

***

### height

> `readonly` **height**: `number`

Defined in: [continuum/src/ContinuumCrowds.ts:40](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L40)

***

### pressure

> `readonly` **pressure**: `Float32Array`

Defined in: [continuum/src/ContinuumCrowds.ts:32](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L32)

圧力場 (0 以上)

***

### pressureStiffness

> **pressureStiffness**: `number`

Defined in: [continuum/src/ContinuumCrowds.ts:29](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L29)

圧力の増幅係数

***

### targetDensity

> **targetDensity**: `number`

Defined in: [continuum/src/ContinuumCrowds.ts:27](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L27)

目標密度 (セルあたりの目標個体数)

***

### unreachable

> `readonly` **unreachable**: `Uint8Array`

Defined in: [continuum/src/ContinuumCrowds.ts:37](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L37)

到達不能セル

***

### width

> `readonly` **width**: `number`

Defined in: [continuum/src/ContinuumCrowds.ts:39](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L39)

## Methods

### bakeVelocityField()

> **bakeVelocityField**(`speed`, `pressureWeight?`, `useNavigation?`): `void`

Defined in: [continuum/src/ContinuumCrowds.ts:227](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L227)

圧力勾配と目標方向を合成して速度場を一括計算します。

エンティティ数に依存せず、セル数 (16k 程度) だけを走査します。
これが Continuum Crowds が 30 万体でも軽い理由です。

#### Parameters

##### speed

`number`

目標速度

##### pressureWeight?

`number` = `0.7`

圧力勾配の影響度

##### useNavigation?

`boolean` = `true`

true の場合、経路場の勾配を優先します

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [continuum/src/ContinuumCrowds.ts:88](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L88)

密度場をゼロへ戻します。毎フレームの最初の操作です。

#### Returns

`void`

***

### computeDivergence()

> **computeDivergence**(): `void`

Defined in: [continuum/src/ContinuumCrowds.ts:120](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L120)

一様非圧縮性拘束 (UIC) の発散項を計算します。
目標密度を超えた分だけが正になります (引力のための負の圧力は作りません)。

#### Returns

`void`

***

### pressureAt()

> **pressureAt**(`x`, `y`): `number`

Defined in: [continuum/src/ContinuumCrowds.ts:321](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L321)

圧力を直接サンプルします。

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`number`

***

### sampleDirection()

> **sampleDirection**(`x`, `y`, `outDir`): `boolean`

Defined in: [continuum/src/ContinuumCrowds.ts:331](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L331)

経路場からSampling した進行方向を返します。

#### Parameters

##### x

`number`

##### y

`number`

##### outDir

`Float32Array`

#### Returns

`boolean`

***

### sampleVelocity()

> **sampleVelocity**(`x`, `y`, `outVel`): `boolean`

Defined in: [continuum/src/ContinuumCrowds.ts:283](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L283)

速度場を双線形補間してサンプリングします。
セル境界での不連続な回転が完全に消えます。

#### Parameters

##### x

`number`

##### y

`number`

##### outVel

`Float32Array`

長さ 2 以上の Float32Array [vx, vy]

#### Returns

`boolean`

到達不能なら false

***

### setTargetDirection()

> **setTargetDirection**(`x`, `y`, `dirX`, `dirY`): `void`

Defined in: [continuum/src/ContinuumCrowds.ts:173](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L173)

目標方向場を設定します (ゴールへ向かう単位ベクトル)。

#### Parameters

##### x

`number`

##### y

`number`

##### dirX

`number`

##### dirY

`number`

#### Returns

`void`

***

### setTargetDirectionRaw()

> **setTargetDirectionRaw**(`index`, `dirX`, `dirY`): `void`

Defined in: [continuum/src/ContinuumCrowds.ts:184](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L184)

セルインデックスの直接指定で目標方向を設定します。
呼び出し側が既にグリッド座標を計算済みの場合に使います。

#### Parameters

##### index

`number`

##### dirX

`number`

##### dirY

`number`

#### Returns

`void`

***

### solveNavigation()

> **solveNavigation**(`goalIndex`, `isWall`, `options?`): `void`

Defined in: [continuum/src/ContinuumCrowds.ts:201](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L201)

アイコナール方程式で障害物を回り込む経路場を構築します。

圧力場とは独立に、目標地点から各セルまでの距離を解きます。
これにより壁の向こう側へ迂回する経路が得られます。

#### Parameters

##### goalIndex

`number`

ゴールのセルインデックス

##### isWall

(`x`, `y`) => `boolean`

壁かどうかを返す関数

##### options?

[`EikonalOptions`](../interfaces/EikonalOptions.md) = `{}`

#### Returns

`void`

***

### solvePressure()

> **solvePressure**(`iterations?`): `void`

Defined in: [continuum/src/ContinuumCrowds.ts:136](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L136)

圧力をヤコビ反復で解きます。

負の圧力 (引力) は発生させません。UIC の本質的な制約です。

#### Parameters

##### iterations?

`number` = `2`

反復回数。実時間では 2 から 4 程度が目安です

#### Returns

`void`

***

### splat()

> **splat**(`x`, `y`, `amount?`): `void`

Defined in: [continuum/src/ContinuumCrowds.ts:96](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L96)

個体を密度場へスプラットします (双線形補間)。
エンティティごとに格子 4 点へ書き込むだけなので O(1)/体 です。

#### Parameters

##### x

`number`

##### y

`number`

##### amount?

`number` = `1.0`

#### Returns

`void`
