[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / ParticleManager

# Class: ParticleManager

Defined in: [core/src/particles/ParticleManager.ts:80](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L80)

## Implements

- [`Plugin`](../interfaces/Plugin.md)

## Constructors

### Constructor

> **new ParticleManager**(`maxParticles?`, `maxEmitters?`, `opsPerEmitter?`): `ParticleManager`

Defined in: [core/src/particles/ParticleManager.ts:170](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L170)

#### Parameters

##### maxParticles?

`number` = `100000`

##### maxEmitters?

`number` = `4096`

##### opsPerEmitter?

`number` = `8`

#### Returns

`ParticleManager`

## Accessors

### emitterCount

#### Get Signature

> **get** **emitterCount**(): `number`

Defined in: [core/src/particles/ParticleManager.ts:348](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L348)

登録済みエミッター数

##### Returns

`number`

***

### particleCapacity

#### Get Signature

> **get** **particleCapacity**(): `number`

Defined in: [core/src/particles/ParticleManager.ts:343](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L343)

粒子 SoA の確保数 (アarena の capacity と等しい)

##### Returns

`number`

***

### particleCount

#### Get Signature

> **get** **particleCount**(): `number`

Defined in: [core/src/particles/ParticleManager.ts:338](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L338)

現在の生存粒子数

##### Returns

`number`

## Methods

### create()

> **create**(`config?`): [`ParticleEmitter`](ParticleEmitter.md)

Defined in: [core/src/particles/ParticleManager.ts:250](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L250)

持続型エミッターを生成します (Phaser 互換の `this.add.particles`)。

#### Parameters

##### config?

[`EmitterCreateConfig`](../interfaces/EmitterCreateConfig.md) = `{}`

#### Returns

[`ParticleEmitter`](ParticleEmitter.md)

ParticleEmitter ハンドル。上限に達した場合は null

***

### createEmitter()

> **createEmitter**(`config`): `number`

Defined in: [core/src/particles/ParticleManager.ts:227](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L227)

1 回だけ burst するパーティクルを生成します (旧 API、后方互換)。

持続して出したい場合は [ParticleManager.create](#create) と
`ParticleEmitter.start()` を使ってください。

#### Parameters

##### config

[`EmitterConfig`](../interfaces/EmitterConfig.md)

#### Returns

`number`

生成できた粒子数

***

### destroy()

> **destroy**(): `void`

Defined in: [core/src/particles/ParticleManager.ts:901](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L901)

シーン破棄時に呼ばれます

#### Returns

`void`

#### Implementation of

[`Plugin`](../interfaces/Plugin.md).[`destroy`](../interfaces/Plugin.md#destroy)

***

### emitBurst()

> **emitBurst**(`config`): `number`

Defined in: [core/src/particles/ParticleManager.ts:235](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L235)

burst を 1 回実行します。

#### Parameters

##### config

[`EmitterConfig`](../interfaces/EmitterConfig.md)

#### Returns

`number`

生成できた粒子数

***

### emitMany()

> **emitMany**(`id`, `count`): `number`

Defined in: [core/src/particles/ParticleManager.ts:682](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L682)

粒子をまとめて生成します (Phaser 互換の `emitParticleAt`)

#### Parameters

##### id

`number`

##### count

`number`

#### Returns

`number`

***

### emitOne()

> **emitOne**(`id`): `boolean`

Defined in: [core/src/particles/ParticleManager.ts:580](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L580)

粒子を 1 個生成します (Phaser 互換の `emitParticle`)

#### Parameters

##### id

`number`

#### Returns

`boolean`

***

### explodeEmitter()

> **explodeEmitter**(`id`, `count`): `number`

Defined in: [core/src/particles/ParticleManager.ts:729](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L729)

一度だけまとめて生成します (Phaser 互換の `explode`)

#### Parameters

##### id

`number`

##### count

`number`

#### Returns

`number`

***

### getEmitterAliveCount()

> **getEmitterAliveCount**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:474](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L474)

このエミッターが生成した生存粒子数

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterAngleMax()

> **getEmitterAngleMax**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:548](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L548)

射出角の上限

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterAngleMin()

> **getEmitterAngleMin**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:543](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L543)

射出角の下限

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterDuration()

> **getEmitterDuration**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:479](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L479)

自動停止するまでの時間 (ms)。0 なら無制限

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterElapsed()

> **getEmitterElapsed**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:491](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L491)

経過時間 (ms)

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterFrequency()

> **getEmitterFrequency**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:333](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L333)

1 秒あたりの生成個数

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterGravityX()

> **getEmitterGravityX**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:496](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L496)

粒子ごとの重力 X (px/s^2)

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterGravityY()

> **getEmitterGravityY**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:501](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L501)

粒子ごとの重力 Y (px/s^2)

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterLifespan()

> **getEmitterLifespan**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:558](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L558)

生存時間 (ミリ秒)

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterMaxAlive()

> **getEmitterMaxAlive**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:463](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L463)

生存粒子上限 (Phaser 互換の `maxAliveParticles`)

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterOpCount()

> **getEmitterOpCount**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:423](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L423)

ops の個数 (Phaser 互換の `ops.getChildren().length`)

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterOpKind()

> **getEmitterOpKind**(`id`, `k`): `number`

Defined in: [core/src/particles/ParticleManager.ts:445](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L445)

ops の対象パラメータ_kind を返します (SoA の数値 ID)

#### Parameters

##### id

`number`

##### k

`number`

#### Returns

`number`

***

### getEmitterOps()

> **getEmitterOps**(`id`, `out`): `number`

Defined in: [core/src/particles/ParticleManager.ts:433](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L433)

ops の値を `out` へ書き出します。

#### Parameters

##### id

`number`

##### out

`Float32Array`

2 要素以上のバッファ。[k*2] = isEnabled, [k*2+1] = value

#### Returns

`number`

書き出した op の個数

***

### getEmitterQuantity()

> **getEmitterQuantity**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:452](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L452)

1 回の生成個数 (Phaser 互換の `quantity`)

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterSpeed()

> **getEmitterSpeed**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:553](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L553)

生成速度

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterTimeScale()

> **getEmitterTimeScale**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:525](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L525)

時間倍率 (Phaser 互換の `setTimeScale`)。1.0 が等速。

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterTint()

> **getEmitterTint**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:563](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L563)

ティント色

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterX()

> **getEmitterX**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:323](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L323)

エミッターの X 座標

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterY()

> **getEmitterY**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:328](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L328)

エミッターの Y 座標

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEmitterZoneParams()

> **getEmitterZoneParams**(`id`, `out`): `number`

Defined in: [core/src/particles/ParticleManager.ts:388](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L388)

zone のパラメータを `out` へ書き出します。

#### Parameters

##### id

`number`

##### out

`Float32Array`

4 要素以上のバッファ

#### Returns

`number`

書き出した要素数（常に 4）

***

### getEmitterZoneShape()

> **getEmitterZoneShape**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:378](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L378)

zone の形状 ID (Phaser 互換の `emitter.emitters` の形状部分)

#### Parameters

##### id

`number`

#### Returns

`number`

***

### init()

> **init**(`scene`): `void`

Defined in: [core/src/particles/ParticleManager.ts:215](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L215)

プラグインの初期化時に呼ばれます

#### Parameters

##### scene

[`Scene`](Scene.md)

#### Returns

`void`

#### Implementation of

[`Plugin`](../interfaces/Plugin.md).[`init`](../interfaces/Plugin.md#init)

***

### isEmitterAlive()

> **isEmitterAlive**(`id`): `boolean`

Defined in: [core/src/particles/ParticleManager.ts:318](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L318)

エミッターが登録済みか

#### Parameters

##### id

`number`

#### Returns

`boolean`

***

### isEmitterEmitting()

> **isEmitterEmitting**(`id`): `boolean`

Defined in: [core/src/particles/ParticleManager.ts:353](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L353)

エミッターが毎フレーム生成を続けているか

#### Parameters

##### id

`number`

#### Returns

`boolean`

***

### killAll()

> **killAll**(`id`): `number`

Defined in: [core/src/particles/ParticleManager.ts:741](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L741)

このエミッターが生成した生存粒子をすべて破棄します
(Phaser 互換の `killAll`)。

`maxAliveParticles` の計算峙、熱ループ（`update`）ではなく
コマンド側から呼ばれるため、`Array` の生成を許容します。

#### Parameters

##### id

`number`

#### Returns

`number`

***

### setEmitterAngle()

> **setEmitterAngle**(`id`, `min`, `max`): `void`

Defined in: [core/src/particles/ParticleManager.ts:536](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L536)

射出角の範囲を設定します (Phaser 互換の `setAngle`)

#### Parameters

##### id

`number`

##### min

`number`

##### max

`number`

#### Returns

`void`

***

### setEmitterDuration()

> **setEmitterDuration**(`id`, `ms`): `void`

Defined in: [core/src/particles/ParticleManager.ts:484](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L484)

自動停止までの時間を設定します (Phaser 互換の `setDuration`)

#### Parameters

##### id

`number`

##### ms

`number`

#### Returns

`void`

***

### setEmitterEmitting()

> **setEmitterEmitting**(`id`, `emitting`): `void`

Defined in: [core/src/particles/ParticleManager.ts:366](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L366)

エミッターの生成開始・停止を切り替えます (Phaser 互換の `start` / `stop`)。

**開始時に即座に粒子は生成しません。** 生成は `frequency` に従って
`update` の中で行われます。Phaser の `start()` は `quantity` 個を
同時に放ちますが、その挙動は [explodeEmitter](#explodeemitter) に委ねています。
`start()` を「毎フレーム生成を始める」ことだけに限定することで、
「start 直後の粒子数が確定する」保証を保ちます。

#### Parameters

##### id

`number`

##### emitting

`boolean`

#### Returns

`void`

***

### setEmitterFrequency()

> **setEmitterFrequency**(`id`, `freq`): `void`

Defined in: [core/src/particles/ParticleManager.ts:699](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L699)

1 秒あたりの生成個数を設定します (Phaser 互換の `setFrequency`)

#### Parameters

##### id

`number`

##### freq

`number`

#### Returns

`void`

***

### setEmitterGravity()

> **setEmitterGravity**(`id`, `gx`, `gy`): `void`

Defined in: [core/src/particles/ParticleManager.ts:506](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L506)

粒子ごとの重力を設定します (Phaser 互換の `setParticleGravity`)

#### Parameters

##### id

`number`

##### gx

`number`

##### gy

`number`

#### Returns

`void`

***

### setEmitterGravityX()

> **setEmitterGravityX**(`id`, `gx`): `void`

Defined in: [core/src/particles/ParticleManager.ts:513](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L513)

水平方向の重力だけを設定します (Phaser 互換の `setParticleGravityX`)

#### Parameters

##### id

`number`

##### gx

`number`

#### Returns

`void`

***

### setEmitterGravityY()

> **setEmitterGravityY**(`id`, `gy`): `void`

Defined in: [core/src/particles/ParticleManager.ts:519](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L519)

垂直方向の重力だけを設定します (Phaser 互換の `setParticleGravityY`)

#### Parameters

##### id

`number`

##### gy

`number`

#### Returns

`void`

***

### setEmitterLifespan()

> **setEmitterLifespan**(`id`, `ms`): `void`

Defined in: [core/src/particles/ParticleManager.ts:711](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L711)

生存時間を設定します (Phaser 互換の `setLifespan`)

#### Parameters

##### id

`number`

##### ms

`number`

#### Returns

`void`

***

### setEmitterMaxAlive()

> **setEmitterMaxAlive**(`id`, `n`): `void`

Defined in: [core/src/particles/ParticleManager.ts:468](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L468)

生存粒子上限を設定します (Phaser 互換の `setMaxAliveParticles`)

#### Parameters

##### id

`number`

##### n

`number`

#### Returns

`void`

***

### setEmitterPosition()

> **setEmitterPosition**(`id`, `x`, `y`): `void`

Defined in: [core/src/particles/ParticleManager.ts:692](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L692)

エミッターの X 座標を設定します (Phaser 互換の `setPosition`)

#### Parameters

##### id

`number`

##### x

`number`

##### y

`number`

#### Returns

`void`

***

### setEmitterQuantity()

> **setEmitterQuantity**(`id`, `n`): `void`

Defined in: [core/src/particles/ParticleManager.ts:457](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L457)

1 回の生成個数を設定します (Phaser 互換の `setQuantity`)

#### Parameters

##### id

`number`

##### n

`number`

#### Returns

`void`

***

### setEmitterSpeed()

> **setEmitterSpeed**(`id`, `speed`): `void`

Defined in: [core/src/particles/ParticleManager.ts:705](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L705)

生成速度を設定します (Phaser 互換の `setSpeed`)

#### Parameters

##### id

`number`

##### speed

`number`

#### Returns

`void`

***

### setEmitterTexture()

> **setEmitterTexture**(`id`, `asset`): `void`

Defined in: [core/src/particles/ParticleManager.ts:574](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L574)

生成する粒子のテクスチャを設定します (Phaser 互換の `setParticleTexture`)。

`TextureAsset` または `{ textureAsset }` を持つオブジェクトを受け取ります。
粒子は生成時に `setFrameSize(1, 1)` でフレーム寸法を 1 に落とすため、
テクスチャ 있을場合も 1 ピクセル点として描画されます。

#### Parameters

##### id

`number`

##### asset

`unknown`

#### Returns

`void`

***

### setEmitterTimeScale()

> **setEmitterTimeScale**(`id`, `scale`): `void`

Defined in: [core/src/particles/ParticleManager.ts:530](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L530)

時間倍率を設定します (Phaser 互換の `setTimeScale`)

#### Parameters

##### id

`number`

##### scale

`number`

#### Returns

`void`

***

### setEmitterTint()

> **setEmitterTint**(`id`, `tint`): `void`

Defined in: [core/src/particles/ParticleManager.ts:717](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L717)

ティント色を設定します (Phaser 互換の `setParticleTint`)

#### Parameters

##### id

`number`

##### tint

`number`

#### Returns

`void`

***

### setEmitterZone()

> **setEmitterZone**(`id`, `shape`, `p0`, `p1`, `p2`, `p3`): `void`

Defined in: [core/src/particles/ParticleManager.ts:405](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L405)

zone の形状を設定します (Phaser 互換の `setZone` / `ParticleEmitterZone`)

#### Parameters

##### id

`number`

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

`void`

***

### stopEmitter()

> **stopEmitter**(`id`): `void`

Defined in: [core/src/particles/ParticleManager.ts:723](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L723)

生成を停止します (Phaser 互換の `stop`)。生成済みの粒子は残ります。

#### Parameters

##### id

`number`

#### Returns

`void`

***

### update()

> **update**(`dt`): `void`

Defined in: [core/src/particles/ParticleManager.ts:818](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L818)

毎フレームの可変更新時に呼ばれます

#### Parameters

##### dt

`number`

#### Returns

`void`

#### Implementation of

[`Plugin`](../interfaces/Plugin.md).[`update`](../interfaces/Plugin.md#update)
