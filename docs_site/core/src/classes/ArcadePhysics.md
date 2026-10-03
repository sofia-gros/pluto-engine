[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / ArcadePhysics

# Class: ArcadePhysics

Defined in: [core/src/physics/ArcadePhysics.ts:73](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L73)

2D Arcade Physics プラグイン (Phaser-like API + AABB Broadphase 全形式対応)
単一オブジェクト、配列、SoAアリーナ、TypedArrayバッファの全組み合わせに対応し、
AABB 高速枝刈りにより数十万体規模でも瞬時に衝突判定を行います。

## Implements

- [`Plugin`](../interfaces/Plugin.md)

## Constructors

### Constructor

> **new ArcadePhysics**(`maxInstances?`): `ArcadePhysics`

Defined in: [core/src/physics/ArcadePhysics.ts:260](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L260)

#### Parameters

##### maxInstances?

`number` = `100000`

#### Returns

`ArcadePhysics`

## Properties

### accelX

> **accelX**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:91](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L91)

加速度

***

### accelY

> **accelY**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:92](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L92)

***

### add

> `readonly` **add**: `object`

Defined in: [core/src/physics/ArcadePhysics.ts:149](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L149)

Phaser スタイルの物理オブジェクト・判定ファクトリー API

#### collider

> **collider**: \<`A`, `B`\>(`targetA`, `targetB?`, `callback?`, `bounce`) => `void`

オブジェクトAとオブジェクトBの衝突・押し出し解決を登録します。

##### Type Parameters

###### A

`A` *extends* [`PhysicsTarget`](../type-aliases/PhysicsTarget.md)

###### B

`B` *extends* [`PhysicsTarget`](../type-aliases/PhysicsTarget.md)

##### Parameters

###### targetA

`A`

判定対象A

###### targetB?

[`OverlapCallback`](../type-aliases/OverlapCallback.md)\<`any`, `any`\> \| `B`

判定対象B

###### callback?

[`OverlapCallback`](../type-aliases/OverlapCallback.md)

衝突時のコールバック

###### bounce?

`number` = `0.0`

反発係数 (0.0〜1.0)

##### Returns

`void`

#### existing

> **existing**: \<`T`\>(`target`) => `T`

既存のゲームオブジェクトを物理管理対象として登録します。

##### Type Parameters

###### T

`T` *extends* [`PhysicsTarget`](../type-aliases/PhysicsTarget.md)

##### Parameters

###### target

`T`

物理演算対象オブジェクト

##### Returns

`T`

#### group

> **group**: \<`T`\>(`children?`) => [`Group`](Group.md)

物理演算対象の [Group](Group.md) を作成します
(Phaser 互換の `physics.add.group`)。

設計上の判断 (IMPACT_SCOPE 3.2 の判定 D):
Group は SoA 化しない使い回し `Array` で、アリーナは汚しません。
本メソッドはグループ用の器を返すだけで、SoA への登録は
呼び出し側が `body` 経由で個別に行います。

##### Type Parameters

###### T

`T`

##### Parameters

###### children?

readonly `T`[]

初期メンバー

##### Returns

[`Group`](Group.md)

#### overlap

> **overlap**: \<`A`, `B`\>(`targetA`, `targetB?`, `callback?`, `margin`) => `void`

オブジェクトAとオブジェクトBの重なり判定を登録します。
単一オブジェクト、配列（`bullet[]`）、アリーナ（`this.arena`）、バッファ構造の全組み合わせに対応します。

##### Type Parameters

###### A

`A` *extends* [`PhysicsTarget`](../type-aliases/PhysicsTarget.md)

###### B

`B` *extends* [`PhysicsTarget`](../type-aliases/PhysicsTarget.md)

##### Parameters

###### targetA

`A`

判定対象A (例: Player, bullets[])

###### targetB?

[`OverlapCallback`](../type-aliases/OverlapCallback.md)\<`any`, `any`\> \| `B`

判定対象B (例: this.arena, bullets, enemyBuffer)

###### callback?

[`OverlapCallback`](../type-aliases/OverlapCallback.md)

接触時に呼ばれるコールバック (itemA, itemB)

###### margin?

`number` = `0`

判定半径への追加マージン

##### Returns

`void`

#### staticGroup

> **staticGroup**: \<`T`\>(`children?`) => [`Group`](Group.md)

Immovable な [Group](Group.md) を作成します
(Phaser 互換の `physics.add.staticGroup`)。

`group` と違い、所属メンバーを「動かない SoA」として実効化します。
`body` を公開するオブジェクト (Sprite) には immovable を立て、
そうでないメンバーは.Group 側の記録だけに留めます。

##### Type Parameters

###### T

`T`

##### Parameters

###### children?

readonly `T`[]

初期メンバー

##### Returns

[`Group`](Group.md)

***

### bodyHeight

> **bodyHeight**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:103](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L103)

***

### bodyWidth

> **bodyWidth**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:102](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L102)

当たり判定矩形の幅と高さ (radius が 0 のときだけ使用)

***

### bounce

> **bounce**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:89](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L89)

***

### boundsHeight

> **boundsHeight**: `number` = `0`

Defined in: [core/src/physics/ArcadePhysics.ts:135](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L135)

ワールド境界の高さ

***

### boundsWidth

> **boundsWidth**: `number` = `0`

Defined in: [core/src/physics/ArcadePhysics.ts:133](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L133)

ワールド境界の幅

***

### boundsX

> **boundsX**: `number` = `0`

Defined in: [core/src/physics/ArcadePhysics.ts:129](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L129)

ワールド境界の左端

***

### boundsY

> **boundsY**: `number` = `0`

Defined in: [core/src/physics/ArcadePhysics.ts:131](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L131)

ワールド境界の上端

***

### collideWorldBounds

> **collideWorldBounds**: `Uint8Array`

Defined in: [core/src/physics/ArcadePhysics.ts:110](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L110)

ワールド境界で反弹する (1 = 有効)

***

### dragX

> **dragX**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:94](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L94)

空気抵抗 (1 フレームあたりの減衰率、0〜1)

***

### dragY

> **dragY**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:95](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L95)

***

### enable

> **enable**: `Uint8Array`

Defined in: [core/src/physics/ArcadePhysics.ts:123](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L123)

物理演算の対象にするか (0 = 無効、1 = 有効)

***

### friction

> **friction**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:116](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L116)

動摩擦 (0 のときは無効)。
`update` で速度を毎フレームこの割合だけ減衰させます。
`drag` と違い、**加速度が 0 のときだけ**作用します。

***

### frictionStatic

> **frictionStatic**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:121](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L121)

静摩擦。速度がこの値以下になったら摩擦による減速を打ち切って
完全停止させます (0 のときは何も起こりません)。

***

### gravityX

> **gravityX**: `number` = `0`

Defined in: [core/src/physics/ArcadePhysics.ts:139](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L139)

重力加速度 X

***

### gravityY

> **gravityY**: `number` = `0`

Defined in: [core/src/physics/ArcadePhysics.ts:141](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L141)

重力加速度 Y

***

### hasBounds

> **hasBounds**: `boolean` = `false`

Defined in: [core/src/physics/ArcadePhysics.ts:137](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L137)

ワールドが境界を持つか

***

### immovable

> **immovable**: `Uint8Array`

Defined in: [core/src/physics/ArcadePhysics.ts:108](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L108)

押し出されない (1 = immovable)

***

### mass

> **mass**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:88](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L88)

***

### maxVelX

> **maxVelX**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:97](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L97)

速度の上限。0 以下は無制限

***

### maxVelY

> **maxVelY**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:98](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L98)

***

### offsetX

> **offsetX**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:105](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L105)

当たり判定中心のスプライト中心からのオフセット

***

### offsetY

> **offsetY**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:106](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L106)

***

### radius

> **radius**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:100](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L100)

当たり判定の半径 (0 のときは矩形判定)

***

### scene?

> `optional` **scene?**: [`Scene`](Scene.md)

Defined in: [core/src/physics/ArcadePhysics.ts:74](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L74)

***

### velX

> **velX**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:86](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L86)

***

### velY

> **velY**: `Float32Array`

Defined in: [core/src/physics/ArcadePhysics.ts:87](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L87)

## Methods

### clear()

> **clear**(): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:1029](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L1029)

登録ルールを全クリア

#### Returns

`void`

***

### clearBounds()

> **clearBounds**(): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:438](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L438)

ワールド境界を無効にします。

#### Returns

`void`

***

### collide()

> **collide**(): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:1021](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L1021)

物理更新

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:1037](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L1037)

プラグイン解放

#### Returns

`void`

#### Implementation of

[`Plugin`](../interfaces/Plugin.md).[`destroy`](../interfaces/Plugin.md#destroy)

***

### getAccelerationX()

> **getAccelerationX**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:519](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L519)

水平方向の加速度

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getAccelerationY()

> **getAccelerationY**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:525](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L525)

垂直方向の加速度

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getBodyX()

> **getBodyX**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:481](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L481)

X 座標

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getBodyY()

> **getBodyY**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:494](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L494)

Y 座標

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getBounce()

> **getBounce**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:537](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L537)

反発係数

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getCollideWorldBounds()

> **getCollideWorldBounds**(`id`): `boolean`

Defined in: [core/src/physics/ArcadePhysics.ts:605](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L605)

ワールド境界で反弹するか

#### Parameters

##### id

`number`

#### Returns

`boolean`

***

### getDrag()

> **getDrag**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:531](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L531)

空気抵抗

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getEnabled()

> **getEnabled**(`id`): `boolean`

Defined in: [core/src/physics/ArcadePhysics.ts:555](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L555)

物理演算の対象になっているか

#### Parameters

##### id

`number`

#### Returns

`boolean`

***

### getFriction()

> **getFriction**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:543](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L543)

動摩擦 (0 のときは無効)

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getFrictionStatic()

> **getFrictionStatic**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:549](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L549)

静摩擦

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getHalfHeight()

> **getHalfHeight**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:475](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L475)

当たり判定の半高。矩形設定がなければ表示寸法の半分

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getHalfWidth()

> **getHalfWidth**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:469](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L469)

当たり判定の半幅。矩形設定がなければ表示寸法の半分

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getImmovable()

> **getImmovable**(`id`): `boolean`

Defined in: [core/src/physics/ArcadePhysics.ts:599](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L599)

押し出されないか

#### Parameters

##### id

`number`

#### Returns

`boolean`

***

### getMass()

> **getMass**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:568](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L568)

質量

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getMaxVelocityX()

> **getMaxVelocityX**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:581](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L581)

水平方向の速度上限

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getMaxVelocityY()

> **getMaxVelocityY**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:587](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L587)

垂直方向の速度上限

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getRadius()

> **getRadius**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:593](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L593)

当たり判定の半径

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getVelocityX()

> **getVelocityX**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:507](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L507)

水平方向の速度

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getVelocityY()

> **getVelocityY**(`id`): `number`

Defined in: [core/src/physics/ArcadePhysics.ts:513](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L513)

垂直方向の速度

#### Parameters

##### id

`number`

#### Returns

`number`

***

### init()

> **init**(`scene`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:289](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L289)

プラグイン初期化

#### Parameters

##### scene

[`Scene`](Scene.md)

#### Returns

`void`

#### Implementation of

[`Plugin`](../interfaces/Plugin.md).[`init`](../interfaces/Plugin.md#init)

***

### processColliders()

> **processColliders**(): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:734](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L734)

登録された Collider ルールを一括高速評価

#### Returns

`void`

***

### processOverlaps()

> **processOverlaps**(): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:721](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L721)

登録された Overlap ルールを一括高速評価 (全ターゲット形式対応 & AABB Broadphase Culling)

#### Returns

`void`

***

### setAcceleration()

> **setAcceleration**(`id`, `ax`, `ay`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:320](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L320)

加速度を設定します (Phaser 互換の `setAcceleration`)。

#### Parameters

##### id

`number`

##### ax

`number`

##### ay

`number`

#### Returns

`void`

***

### setBodyX()

> **setBodyX**(`id`, `v`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:487](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L487)

X 座標を設定します。

#### Parameters

##### id

`number`

##### v

`number`

#### Returns

`void`

***

### setBodyY()

> **setBodyY**(`id`, `v`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:500](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L500)

Y 座標を設定します。

#### Parameters

##### id

`number`

##### v

`number`

#### Returns

`void`

***

### setBounce()

> **setBounce**(`id`, `v`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:561](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L561)

反発係数を設定します。0〜1 にクランプします。

#### Parameters

##### id

`number`

##### v

`number`

#### Returns

`void`

***

### setBounds()

> **setBounds**(`x`, `y`, `width`, `height`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:427](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L427)

ワールド境界を設定します (Phaser 互換の `setBoundsRectangle`)。

#### Parameters

##### x

`number`

##### y

`number`

##### width

`number`

/ height が 0 以下の場合は境界なしとして扱います

##### height

`number`

#### Returns

`void`

***

### setCircle()

> **setCircle**(`id`, `r`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:378](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L378)

当たり判定の形状を設定します (Phaser 互換の `setCircle`)。

#### Parameters

##### id

`number`

##### r

`number`

#### Returns

`void`

***

### setCollideWorldBounds()

> **setCollideWorldBounds**(`id`, `value`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:418](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L418)

ワールド境界での反弹を有効にします (Phaser 互換の `setCollideWorldBounds`)。

#### Parameters

##### id

`number`

##### value

`boolean`

#### Returns

`void`

***

### setDrag()

> **setDrag**(`id`, `drag`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:331](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L331)

空気抵抗を設定します (Phaser 互換の `setDrag`)。
1 フレームごとに速度が drag の割合だけ減衰します。

#### Parameters

##### id

`number`

##### drag

`number`

#### Returns

`void`

***

### setEnabled()

> **setEnabled**(`id`, `value`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:369](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L369)

物理演算の有効・無効を切り替えます (Phaser 互換の `enable` / `disable`)。
無効なエンティティは `update` の積分から除外されます。

#### Parameters

##### id

`number`

##### value

`boolean`

#### Returns

`void`

***

### setFriction()

> **setFriction**(`id`, `value`, `staticValue?`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:358](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L358)

動摩擦と静摩擦を設定します (Phaser 互換の `setFriction`)。

動摩擦は**加速度が 0 のときだけ**速度を減衰させます。
加速度中有は fricton の影響を受けません。

#### Parameters

##### id

`number`

##### value

`number`

動摩擦 (0〜1)。0 のときは無効

##### staticValue?

`number` = `0`

静摩擦。速度がこれ以下で完全停止。0 なら停止しない

#### Returns

`void`

***

### setImmovable()

> **setImmovable**(`id`, `value`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:409](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L409)

押し出されないようにします (Phaser 互換の `setImmovable`)。

#### Parameters

##### id

`number`

##### value

`boolean`

#### Returns

`void`

***

### setMass()

> **setMass**(`id`, `v`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:574](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L574)

質量を設定します。0 未満は 0 にクランプします。

#### Parameters

##### id

`number`

##### v

`number`

#### Returns

`void`

***

### setMaxVelocity()

> **setMaxVelocity**(`id`, `maxVx`, `maxVy`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:342](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L342)

速度の上限を設定します (Phaser 互換の `setMaxVelocity`)。
0 以下は無制限として扱います。

#### Parameters

##### id

`number`

##### maxVx

`number`

##### maxVy

`number`

#### Returns

`void`

***

### setOffset()

> **setOffset**(`id`, `ox`, `oy`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:399](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L399)

当たり判定中心のスプライト中心からのオフセットを設定します。

#### Parameters

##### id

`number`

##### ox

`number`

##### oy

`number`

#### Returns

`void`

***

### setSize()

> **setSize**(`id`, `w`, `h`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:388](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L388)

当たり判定の形状を設定します (Phaser 互換の `setSize`)。
width/height が 0 の場合は矩形を無効化し、表示寸法へ委ねます。

#### Parameters

##### id

`number`

##### w

`number`

##### h

`number`

#### Returns

`void`

***

### setVelocity()

> **setVelocity**(`id`, `vx`, `vy`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:310](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L310)

エンティティの速度を設定します。

#### Parameters

##### id

`number`

アリーナの疎添字 ID

##### vx

`number`

##### vy

`number`

#### Returns

`void`

***

### update()

> **update**(`dt`): `void`

Defined in: [core/src/physics/ArcadePhysics.ts:616](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L616)

物理更新 (加速度・空気抵抗・速度上限・ワールド境界の処理を含む積分)。

順序は Phaser Arcade Physics に合わせています。
加速度 → 重力 → 空気抵抗 → 速度上限 → 位置更新 → 境界反射

#### Parameters

##### dt

`number`

#### Returns

`void`

#### Implementation of

[`Plugin`](../interfaces/Plugin.md).[`update`](../interfaces/Plugin.md#update)
