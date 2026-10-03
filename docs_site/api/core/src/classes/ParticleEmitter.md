[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / ParticleEmitter

# Class: ParticleEmitter

Defined in: [core/src/particles/ParticleEmitter.ts:29](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L29)

## Constructors

### Constructor

> **new ParticleEmitter**(`id`, `manager`): `ParticleEmitter`

Defined in: [core/src/particles/ParticleEmitter.ts:35](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L35)

#### Parameters

##### id

`number`

##### manager

[`ParticleManager`](ParticleManager.md)

#### Returns

`ParticleEmitter`

## Properties

### id

> `readonly` **id**: `number`

Defined in: [core/src/particles/ParticleEmitter.ts:31](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L31)

ParticleManager 内のエミッター ID

## Accessors

### aliveParticleCount

#### Get Signature

> **get** **aliveParticleCount**(): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:259](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L259)

このエミッターが生成した生存粒子数

##### Returns

`number`

***

### duration

#### Get Signature

> **get** **duration**(): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:264](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L264)

自動停止までの時間 (ms)。0 は無制限

##### Returns

`number`

#### Set Signature

> **set** **duration**(`v`): `void`

Defined in: [core/src/particles/ParticleEmitter.ts:268](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L268)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### elapsed

#### Get Signature

> **get** **elapsed**(): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:279](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L279)

経過時間 (ms)

##### Returns

`number`

***

### frequency

#### Get Signature

> **get** **frequency**(): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:69](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L69)

1 秒あたりの生成個数

##### Returns

`number`

#### Set Signature

> **set** **frequency**(`v`): `void`

Defined in: [core/src/particles/ParticleEmitter.ts:73](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L73)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### gravityX

#### Get Signature

> **get** **gravityX**(): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:286](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L286)

粒子ごとの重力 X (px/s^2)

##### Returns

`number`

#### Set Signature

> **set** **gravityX**(`v`): `void`

Defined in: [core/src/particles/ParticleEmitter.ts:290](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L290)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### gravityY

#### Get Signature

> **get** **gravityY**(): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:295](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L295)

粒子ごとの重力 Y (px/s^2)

##### Returns

`number`

#### Set Signature

> **set** **gravityY**(`v`): `void`

Defined in: [core/src/particles/ParticleEmitter.ts:299](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L299)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### isEmitting

#### Get Signature

> **get** **isEmitting**(): `boolean`

Defined in: [core/src/particles/ParticleEmitter.ts:46](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L46)

毎フレーム生成を続けているか

##### Returns

`boolean`

***

### isValid

#### Get Signature

> **get** **isValid**(): `boolean`

Defined in: [core/src/particles/ParticleEmitter.ts:41](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L41)

ハンドルとして有効か

##### Returns

`boolean`

***

### maxAliveParticles

#### Get Signature

> **get** **maxAliveParticles**(): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:244](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L244)

生存粒子上限。0 は無制限

##### Returns

`number`

#### Set Signature

> **set** **maxAliveParticles**(`v`): `void`

Defined in: [core/src/particles/ParticleEmitter.ts:248](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L248)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### opCount

#### Get Signature

> **get** **opCount**(): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:207](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L207)

ops の個数

##### Returns

`number`

***

### particleCount

#### Get Signature

> **get** **particleCount**(): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:78](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L78)

現在の生存粒子数

##### Returns

`number`

***

### quantity

#### Get Signature

> **get** **quantity**(): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:229](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L229)

1 回の生成個数

##### Returns

`number`

#### Set Signature

> **set** **quantity**(`v`): `void`

Defined in: [core/src/particles/ParticleEmitter.ts:233](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L233)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### timeScale

#### Get Signature

> **get** **timeScale**(): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:322](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L322)

時間倍率。1.0 が等速 (Phaser 互換の `setTimeScale`)

##### Returns

`number`

#### Set Signature

> **set** **timeScale**(`v`): `void`

Defined in: [core/src/particles/ParticleEmitter.ts:326](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L326)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:51](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L51)

X 座標

##### Returns

`number`

#### Set Signature

> **set** **x**(`v`): `void`

Defined in: [core/src/particles/ParticleEmitter.ts:55](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L55)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:60](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L60)

Y 座標

##### Returns

`number`

#### Set Signature

> **set** **y**(`v`): `void`

Defined in: [core/src/particles/ParticleEmitter.ts:64](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L64)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### zoneShape

#### Get Signature

> **get** **zoneShape**(): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:184](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L184)

zone の形状 ID (`ParticleEmitterZoneShape` の値)

##### Returns

`number`

## Methods

### emitParticle()

> **emitParticle**(): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:101](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L101)

粒子を 1 個だけ生成します (Phaser 互換の `emitParticle`)

#### Returns

`this`

***

### emitParticleAt()

> **emitParticleAt**(`count`): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:110](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L110)

粒子を `count` 個まとめて生成します (Phaser 互換の `emitParticleAt`)。

#### Parameters

##### count

`number`

#### Returns

`number`

生成できた数

***

### explode()

> **explode**(`count`): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:118](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L118)

一度だけまとめて生成します (Phaser 互換の `explode`)。

#### Parameters

##### count

`number`

#### Returns

`number`

生成できた数

***

### getOpKind()

> **getOpKind**(`k`): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:222](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L222)

k 番目の op の対象パラメータ (`EmitterOpKind` の数値 ID、範囲外は -1)

#### Parameters

##### k

`number`

#### Returns

`number`

***

### getOps()

> **getOps**(`out`): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:217](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L217)

ops を `out` へ書き出します。

#### Parameters

##### out

`Float32Array`

2 要素以上のバッファ。[k*2] = isEnabled, [k*2+1] = value

#### Returns

`number`

書き出した op の個数

***

### getZoneParams()

> **getZoneParams**(`out`): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:194](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L194)

zone のパラメータ 4 個を `out` へ書き出します。

#### Parameters

##### out

`Float32Array`

4 要素以上のバッファ

#### Returns

`number`

常に 4

***

### killAll()

> **killAll**(): `number`

Defined in: [core/src/particles/ParticleEmitter.ts:348](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L348)

このエミッターが生成した生存粒子をすべて破棄します (Phaser 互換の `killAll`)

#### Returns

`number`

***

### setAngle()

> **setAngle**(`min`, `max`): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:141](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L141)

射出角の範囲を設定します (Phaser 互換の `setAngle`)

#### Parameters

##### min

`number`

##### max

`number`

#### Returns

`this`

***

### setConfig()

> **setConfig**(`config`): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:158](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L158)

設定を書き換えます (Phaser 互換の `setConfig`)。
指定しなかった項目は現在の値を維持します。

#### Parameters

##### config

[`EmitterCreateConfig`](../interfaces/EmitterCreateConfig.md)

#### Returns

`this`

***

### setDuration()

> **setDuration**(`ms`): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:273](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L273)

自動停止までの時間を設定します (Phaser 互換の `setDuration`)

#### Parameters

##### ms

`number`

#### Returns

`this`

***

### setLifespan()

> **setLifespan**(`ms`): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:135](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L135)

生存時間を設定します (Phaser 互換の `setLifespan`)

#### Parameters

##### ms

`number`

#### Returns

`this`

***

### setMaxAliveParticles()

> **setMaxAliveParticles**(`n`): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:253](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L253)

生存粒子上限を設定します (Phaser 互換の `setMaxAliveParticles`)

#### Parameters

##### n

`number`

#### Returns

`this`

***

### setParticleGravity()

> **setParticleGravity**(`gx`, `gy`): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:304](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L304)

粒子ごとの重力を設定します (Phaser 互換の `setParticleGravity`)

#### Parameters

##### gx

`number`

##### gy

`number`

#### Returns

`this`

***

### setParticleGravityX()

> **setParticleGravityX**(`gx`): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:310](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L310)

水平方向の重力だけを設定します (Phaser 互換の `setParticleGravityX`)

#### Parameters

##### gx

`number`

#### Returns

`this`

***

### setParticleGravityY()

> **setParticleGravityY**(`gy`): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:316](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L316)

垂直方向の重力だけを設定します (Phaser 互換の `setParticleGravityY`)

#### Parameters

##### gy

`number`

#### Returns

`this`

***

### setParticleTint()

> **setParticleTint**(`tint`): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:149](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L149)

ティント色を設定します (Phaser 互換の `setParticleTint`)

#### Parameters

##### tint

`number`

#### Returns

`this`

***

### setPosition()

> **setPosition**(`x`, `y`): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:123](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L123)

位置を設定します (Phaser 互換の `setPosition`)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`this`

***

### setQuantity()

> **setQuantity**(`n`): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:238](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L238)

1 回の生成個数を設定します (Phaser 互換の `setQuantity`)

#### Parameters

##### n

`number`

#### Returns

`this`

***

### setSpeed()

> **setSpeed**(`speed`): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:129](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L129)

生成速度を設定します (Phaser 互換の `setSpeed`)

#### Parameters

##### speed

`number`

#### Returns

`this`

***

### setTexture()

> **setTexture**(`asset`): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:342](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L342)

生成する粒子のテクスチャを設定します (Phaser 互換の `setParticleTexture`)。

粒子はフレーム寸法を 1x1 に落とすため、描画は常に 1 ピクセル点です。
テクスチャはサンプル元としてだけ意味を持ちます。

#### Parameters

##### asset

`unknown`

#### Returns

`this`

***

### setTimeScale()

> **setTimeScale**(`scale`): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:331](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L331)

時間倍率を設定します (Phaser 互換の `setTimeScale`)

#### Parameters

##### scale

`number`

#### Returns

`this`

***

### setZone()

> **setZone**(`shape`, `p0`, `p1`, `p2`, `p3`): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:199](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L199)

zone を設定します (Phaser 互換の `setZone`)

#### Parameters

##### shape

`number`

##### p0

`number`

##### p1

`number`

##### p2

`number`

##### p3

`number`

#### Returns

`this`

***

### start()

> **start**(): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:86](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L86)

毎フレーム生成を始めます (Phaser 互換の `start`)。
frequency が 0 の場合は何も生成されません。

#### Returns

`this`

***

### stop()

> **stop**(): `this`

Defined in: [core/src/particles/ParticleEmitter.ts:95](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleEmitter.ts#L95)

生成を止めます (Phaser 互換の `stop`)。
既に生成済みの粒子はそのまま残ります。

#### Returns

`this`
