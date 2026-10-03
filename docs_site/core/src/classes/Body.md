[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Body

# Class: Body

Defined in: [core/src/physics/Body.ts:16](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L16)

## Constructors

### Constructor

> **new Body**(`entityId`, `physics`): `Body`

Defined in: [core/src/physics/Body.ts:22](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L22)

#### Parameters

##### entityId

`number`

##### physics

[`ArcadePhysics`](ArcadePhysics.md)

#### Returns

`Body`

## Properties

### entityId

> `readonly` **entityId**: `number`

Defined in: [core/src/physics/Body.ts:18](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L18)

アリーナの疎添字 ID

## Accessors

### accelerationX

#### Get Signature

> **get** **accelerationX**(): `number`

Defined in: [core/src/physics/Body.ts:70](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L70)

水平方向の加速度

##### Returns

`number`

#### Set Signature

> **set** **accelerationX**(`v`): `void`

Defined in: [core/src/physics/Body.ts:74](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L74)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### accelerationY

#### Get Signature

> **get** **accelerationY**(): `number`

Defined in: [core/src/physics/Body.ts:79](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L79)

垂直方向の加速度

##### Returns

`number`

#### Set Signature

> **set** **accelerationY**(`v`): `void`

Defined in: [core/src/physics/Body.ts:83](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L83)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### angle

#### Get Signature

> **get** **angle**(): `number`

Defined in: [core/src/physics/Body.ts:136](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L136)

速度ベクトルの向き (ラジアン、`Math.atan2(vy, vx)`)

##### Returns

`number`

***

### bounce

#### Get Signature

> **get** **bounce**(): `number`

Defined in: [core/src/physics/Body.ts:99](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L99)

反発係数 (0〜1)

##### Returns

`number`

#### Set Signature

> **set** **bounce**(`v`): `void`

Defined in: [core/src/physics/Body.ts:103](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L103)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### checkCollision

#### Get Signature

> **get** **checkCollision**(): `boolean`

Defined in: [core/src/physics/Body.ts:174](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L174)

ワールド境界で反弹するか

##### Returns

`boolean`

#### Set Signature

> **set** **checkCollision**(`v`): `void`

Defined in: [core/src/physics/Body.ts:178](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L178)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### drag

#### Get Signature

> **get** **drag**(): `number`

Defined in: [core/src/physics/Body.ts:90](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L90)

空気抵抗 (0〜1)

##### Returns

`number`

#### Set Signature

> **set** **drag**(`v`): `void`

Defined in: [core/src/physics/Body.ts:94](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L94)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### enabled

#### Get Signature

> **get** **enabled**(): `boolean`

Defined in: [core/src/physics/Body.ts:183](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L183)

物理演算の対象になっているか

##### Returns

`boolean`

#### Set Signature

> **set** **enabled**(`v`): `void`

Defined in: [core/src/physics/Body.ts:187](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L187)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### friction

#### Get Signature

> **get** **friction**(): `number`

Defined in: [core/src/physics/Body.ts:108](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L108)

動摩擦 (0〜1)。加速度が 0 のときだけ作用します

##### Returns

`number`

#### Set Signature

> **set** **friction**(`v`): `void`

Defined in: [core/src/physics/Body.ts:112](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L112)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### frictionStatic

#### Get Signature

> **get** **frictionStatic**(): `number`

Defined in: [core/src/physics/Body.ts:117](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L117)

静摩擦。速度がこれ以下で完全停止

##### Returns

`number`

#### Set Signature

> **set** **frictionStatic**(`v`): `void`

Defined in: [core/src/physics/Body.ts:121](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L121)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### immovable

#### Get Signature

> **get** **immovable**(): `boolean`

Defined in: [core/src/physics/Body.ts:165](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L165)

押し出されないか

##### Returns

`boolean`

#### Set Signature

> **set** **immovable**(`v`): `void`

Defined in: [core/src/physics/Body.ts:169](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L169)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### mass

#### Get Signature

> **get** **mass**(): `number`

Defined in: [core/src/physics/Body.ts:141](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L141)

質量

##### Returns

`number`

#### Set Signature

> **set** **mass**(`v`): `void`

Defined in: [core/src/physics/Body.ts:145](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L145)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### maxVelocityX

#### Get Signature

> **get** **maxVelocityX**(): `number`

Defined in: [core/src/physics/Body.ts:150](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L150)

水平方向の速度上限。0 以下は無制限

##### Returns

`number`

***

### maxVelocityY

#### Get Signature

> **get** **maxVelocityY**(): `number`

Defined in: [core/src/physics/Body.ts:155](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L155)

垂直方向の速度上限。0 以下は無制限

##### Returns

`number`

***

### radius

#### Get Signature

> **get** **radius**(): `number`

Defined in: [core/src/physics/Body.ts:160](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L160)

当たり判定の半径。0 のときは矩形判定

##### Returns

`number`

***

### speed

#### Get Signature

> **get** **speed**(): `number`

Defined in: [core/src/physics/Body.ts:129](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L129)

速度の大きさ (`Math.hypot(vx, vy)`)。
書き込みはせず、方向を保ったまま速度設定時に使う読み取り専用の値です。

##### Returns

`number`

***

### velocityX

#### Get Signature

> **get** **velocityX**(): `number`

Defined in: [core/src/physics/Body.ts:50](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L50)

水平方向の速度

##### Returns

`number`

#### Set Signature

> **set** **velocityX**(`v`): `void`

Defined in: [core/src/physics/Body.ts:54](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L54)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### velocityY

#### Get Signature

> **get** **velocityY**(): `number`

Defined in: [core/src/physics/Body.ts:59](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L59)

垂直方向の速度

##### Returns

`number`

#### Set Signature

> **set** **velocityY**(`v`): `void`

Defined in: [core/src/physics/Body.ts:63](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L63)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [core/src/physics/Body.ts:30](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L30)

X 座標

##### Returns

`number`

#### Set Signature

> **set** **x**(`v`): `void`

Defined in: [core/src/physics/Body.ts:34](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L34)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [core/src/physics/Body.ts:39](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L39)

Y 座標

##### Returns

`number`

#### Set Signature

> **set** **y**(`v`): `void`

Defined in: [core/src/physics/Body.ts:43](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L43)

##### Parameters

###### v

`number`

##### Returns

`void`

## Methods

### disable()

> **disable**(): `this`

Defined in: [core/src/physics/Body.ts:277](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L277)

物理演算を停止します (Phaser 互換の `disable`)。

#### Returns

`this`

***

### enable()

> **enable**(): `this`

Defined in: [core/src/physics/Body.ts:271](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L271)

物理演算を有効にします (Phaser 互換の `enable`)。

#### Returns

`this`

***

### reset()

> **reset**(): `this`

Defined in: [core/src/physics/Body.ts:321](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L321)

速度、加速度、抵抗をすべて 0 に戻します。

#### Returns

`this`

***

### setAcceleration()

> **setAcceleration**(`ax?`, `ay?`): `this`

Defined in: [core/src/physics/Body.ts:215](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L215)

加速度を設定します。

#### Parameters

##### ax?

`number`

##### ay?

`number`

#### Returns

`this`

***

### setAccelerationX()

> **setAccelerationX**(`ax`): `this`

Defined in: [core/src/physics/Body.ts:223](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L223)

水平方向の加速度だけを設定します。

#### Parameters

##### ax

`number`

#### Returns

`this`

***

### setAccelerationY()

> **setAccelerationY**(`ay`): `this`

Defined in: [core/src/physics/Body.ts:229](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L229)

垂直方向の加速度だけを設定します。

#### Parameters

##### ay

`number`

#### Returns

`this`

***

### setBounce()

> **setBounce**(`bounce`): `this`

Defined in: [core/src/physics/Body.ts:241](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L241)

反発係数を設定します。

#### Parameters

##### bounce

`number`

#### Returns

`this`

***

### setCircle()

> **setCircle**(`radius`): `this`

Defined in: [core/src/physics/Body.ts:291](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L291)

当たり判定を円にします。

#### Parameters

##### radius

`number`

#### Returns

`this`

***

### setCollideWorldBounds()

> **setCollideWorldBounds**(`value?`): `this`

Defined in: [core/src/physics/Body.ts:315](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L315)

ワールド境界で反弹するようにします。

#### Parameters

##### value?

`boolean` = `true`

#### Returns

`this`

***

### setDrag()

> **setDrag**(`drag`): `this`

Defined in: [core/src/physics/Body.ts:235](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L235)

空気抵抗を設定します。

#### Parameters

##### drag

`number`

#### Returns

`this`

***

### setFriction()

> **setFriction**(`value`, `staticValue?`): `this`

Defined in: [core/src/physics/Body.ts:253](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L253)

動摩擦と静摩擦を設定します (Phaser 互換の `setFriction`)。
動摩擦は**加速度が 0 のときだけ**速度を減衰させます。

#### Parameters

##### value

`number`

動摩擦 (0〜1)。0 のときは無効

##### staticValue?

`number` = `0`

静摩擦。速度がこれ以下で完全停止。0 なら停止しない

#### Returns

`this`

***

### setImmovable()

> **setImmovable**(`value?`): `this`

Defined in: [core/src/physics/Body.ts:309](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L309)

押し出されないようにします。

#### Parameters

##### value?

`boolean` = `true`

#### Returns

`this`

***

### setMaxVelocity()

> **setMaxVelocity**(`maxVx?`, `maxVy?`): `this`

Defined in: [core/src/physics/Body.ts:283](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L283)

速度の上限を設定します。0 以下は無制限。

#### Parameters

##### maxVx?

`number`

##### maxVy?

`number`

#### Returns

`this`

***

### setOffset()

> **setOffset**(`ox`, `oy`): `this`

Defined in: [core/src/physics/Body.ts:303](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L303)

当たり判定中心のスプライト中心からのオフセットを設定します。

#### Parameters

##### ox

`number`

##### oy

`number`

#### Returns

`this`

***

### setSize()

> **setSize**(`width`, `height`): `this`

Defined in: [core/src/physics/Body.ts:297](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L297)

当たり判定を矩形にします。

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`this`

***

### setVelocity()

> **setVelocity**(`vx?`, `vy?`): `this`

Defined in: [core/src/physics/Body.ts:194](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L194)

速度を設定します。

#### Parameters

##### vx?

`number`

##### vy?

`number`

#### Returns

`this`

***

### setVelocityFromAngle()

> **setVelocityFromAngle**(`degrees`, `speed`): `this`

Defined in: [core/src/physics/Body.ts:264](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L264)

速度の大きさと向きから速度を設定します (Phaser 互換の `setVelocityFromAngle`)。

#### Parameters

##### degrees

`number`

向き (度)。反時計回りが正

##### speed

`number`

速度の大きさ

#### Returns

`this`

***

### setVelocityX()

> **setVelocityX**(`vx`): `this`

Defined in: [core/src/physics/Body.ts:203](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L203)

水平方向の速度だけを設定します。

#### Parameters

##### vx

`number`

#### Returns

`this`

***

### setVelocityY()

> **setVelocityY**(`vy`): `this`

Defined in: [core/src/physics/Body.ts:209](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/Body.ts#L209)

垂直方向の速度だけを設定します。

#### Parameters

##### vy

`number`

#### Returns

`this`
