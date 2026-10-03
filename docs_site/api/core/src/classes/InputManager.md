[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / InputManager

# Class: InputManager

Defined in: [core/src/input/InputManager.ts:254](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L254)

## Constructors

### Constructor

> **new InputManager**(): `InputManager`

Defined in: [core/src/input/InputManager.ts:333](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L333)

#### Returns

`InputManager`

## Properties

### clientX

> **clientX**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:268](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L268)

変換前の画面座標 (CSS ピクセル)

***

### clientY

> **clientY**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:269](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L269)

***

### downPointerX

> **downPointerX**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:274](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L274)

ボタンが押された位置 (ワールド座標)

***

### downPointerY

> **downPointerY**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:275](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L275)

***

### pointerAngle

> **pointerAngle**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:287](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L287)

現在の移動方向 (ラジアン、+X 方向が 0)

***

### pointerDistance

> **pointerDistance**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:285](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L285)

ボタン押下からの累積移動距離 (ワールド座標)

***

### pointerId

> **pointerId**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:289](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L289)

ポインタ ID。単一ポインタのため常に 0

***

### pointerTransform

> **pointerTransform**: [`PointerTransform`](../type-aliases/PointerTransform.md) = `null`

Defined in: [core/src/input/InputManager.ts:303](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L303)

画面座標からゲーム座標へ変換する関数。
ScaleManager が設定し、未設定の場合は画面座標をそのまま渡します。

***

### pointerVelocityX

> **pointerVelocityX**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:280](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L280)

移動速度 (ワールド座標 / 秒)

***

### pointerVelocityY

> **pointerVelocityY**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:281](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L281)

***

### pointerX

> **pointerX**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:265](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L265)

変換後のワールド/キャンバス座標

***

### pointerY

> **pointerY**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:266](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L266)

***

### prevPointerX

> **prevPointerX**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:271](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L271)

前フレームのワールド座標。dx / dy の算出に使う

***

### prevPointerY

> **prevPointerY**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:272](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L272)

***

### upPointerX

> **upPointerX**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:277](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L277)

ボタンが離された位置 (ワールド座標)

***

### upPointerY

> **upPointerY**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:278](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L278)

***

### worldPointerX

> **worldPointerX**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:282](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L282)

***

### worldPointerY

> **worldPointerY**: `number` = `0`

Defined in: [core/src/input/InputManager.ts:283](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L283)

## Accessors

### activePointer

#### Get Signature

> **get** **activePointer**(): [`Pointer`](Pointer.md)

Defined in: [core/src/input/InputManager.ts:369](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L369)

プライマリポインタ (Phaser 互換の activePointer)。

##### Returns

[`Pointer`](Pointer.md)

***

### attached

#### Get Signature

> **get** **attached**(): `boolean`

Defined in: [core/src/input/InputManager.ts:395](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L395)

##### Returns

`boolean`

***

### gamepad

#### Get Signature

> **get** **gamepad**(): `this`

Defined in: [core/src/input/InputManager.ts:362](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L362)

ゲームパッドのファサード (Phaser 互換の this.input.gamepad)。
this 自体を返します。

##### Returns

`this`

***

### gamepadTotal

#### Get Signature

> **get** **gamepadTotal**(): `number`

Defined in: [core/src/input/InputManager.ts:744](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L744)

接続されているゲームパッドの数 (Phaser 互換の `input.gamepad.total`)。

##### Returns

`number`

***

### isGamepadSupported

#### Get Signature

> **get** **isGamepadSupported**(): `boolean`

Defined in: [core/src/input/InputManager.ts:737](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L737)

Gamepad API が利用可能か (Phaser 互換の `input.gamepad.supported`)。
navigator が無い環境 (SSR / テスト) では false を返します。

##### Returns

`boolean`

***

### keyboard

#### Get Signature

> **get** **keyboard**(): `this`

Defined in: [core/src/input/InputManager.ts:346](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L346)

キーボードのファサード (Phaser 互換の this.input.keyboard)。
this 自体を返します。

##### Returns

`this`

***

### pointer

#### Get Signature

> **get** **pointer**(): [`Pointer`](Pointer.md)

Defined in: [core/src/input/InputManager.ts:354](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L354)

ポインタのファサード (Phaser 互換の this.input)。
this 自体を返します。

##### Returns

[`Pointer`](Pointer.md)

## Methods

### addKey()

> **addKey**(`code`): [`Key`](Key.md)

Defined in: [core/src/input/InputManager.ts:603](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L603)

キーの参照ハンドルを生成します (Phaser 互換の this.input.keyboard.addKey)。

生成された Key は内部の Set と同じ状態を見ます。
状態自体を複製しないため、毎フレーム new も発生しません。
同じ code を複数回要求しても同じ Key インスタンスを返します。

#### Parameters

##### code

`string`

#### Returns

[`Key`](Key.md)

***

### addKeys()

> **addKeys**(`codes`): [`Key`](Key.md)[]

Defined in: [core/src/input/InputManager.ts:618](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L618)

複数のキーをまとめて生成します (Phaser 互換の addKeys)。

#### Parameters

##### codes

`string` \| `string`[]

KeyboardEvent.code の配列、または単一文字列

#### Returns

[`Key`](Key.md)[]

生成した Key の配列

***

### addPointer()

> **addPointer**(`_id?`): [`Pointer`](Pointer.md)

Defined in: [core/src/input/InputManager.ts:648](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L648)

ポインタを追加します (Phaser 互換の addPointer)。

pluto-engine は単一ポインタのみを扱うため、2 つ目以降は無視されます。
戻り値は常に this.primaryPointer です。

#### Parameters

##### \_id?

`number`

#### Returns

[`Pointer`](Pointer.md)

***

### attach()

> **attach**(`target?`): `void`

Defined in: [core/src/input/InputManager.ts:373](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L373)

#### Parameters

##### target?

`GlobalEventHandlers` = `window`

#### Returns

`void`

***

### createCursorKeys()

> **createCursorKeys**(): [`CursorKeys`](../interfaces/CursorKeys.md)

Defined in: [core/src/input/InputManager.ts:628](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L628)

矢印キーの Key 群を生成します (Phaser 互換の createCursorKeys)。

#### Returns

[`CursorKeys`](../interfaces/CursorKeys.md)

***

### detach()

> **detach**(`target?`): `void`

Defined in: [core/src/input/InputManager.ts:384](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L384)

#### Parameters

##### target?

`GlobalEventHandlers`

#### Returns

`void`

***

### getAllGamepads()

> **getAllGamepads**(`out?`): [`GamepadHandle`](GamepadHandle.md)[]

Defined in: [core/src/input/InputManager.ts:765](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L765)

接続されているゲームパッドのハンドルをまとめて返します
(Phaser 互換の `getAll`)。

#### Parameters

##### out?

[`GamepadHandle`](GamepadHandle.md)[]

呼び出し側の使い回し配列。省略時は内部のバッファを使います。

#### Returns

[`GamepadHandle`](GamepadHandle.md)[]

接続中の Gamepad ハンドル (未接続のスロットは null)

***

### getGamepad()

> **getGamepad**(`padIndex`): [`GamepadHandle`](GamepadHandle.md)

Defined in: [core/src/input/InputManager.ts:754](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L754)

指定インデックスの Gamepad ハンドルを返します (Phaser 互換の `getPad`)。

ハンドルは内部配列を使い回すため、同じインデックスでは常に同じ
インスタンスが返ります。接続されていない場合は null です。

#### Parameters

##### padIndex

`number`

#### Returns

[`GamepadHandle`](GamepadHandle.md)

***

### getGamepadAxis()

> **getGamepadAxis**(`padIndex`, `axisIndex`): `number`

Defined in: [core/src/input/InputManager.ts:695](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L695)

ゲームパッドのアナログスティックの値を取得します

#### Parameters

##### padIndex

`number`

コントローラー番号 (0 から)

##### axisIndex

`number`

軸番号 (0=左X, 1=左Y, 2=右X, 3=右Y)

#### Returns

`number`

***

### getGamepadConnected()

> **getGamepadConnected**(`padIndex`): `boolean`

Defined in: [core/src/input/InputManager.ts:720](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L720)

指定スロットにゲームパッドが接続されているか。
Gamepad ハンドルからの参照用に公開しています。

#### Parameters

##### padIndex

`number`

#### Returns

`boolean`

***

### getGamepadCount()

> **getGamepadCount**(): `number`

Defined in: [core/src/input/InputManager.ts:706](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L706)

接続されているゲームパッドの数を返します。

#### Returns

`number`

***

### getGamepadNative()

> **getGamepadNative**(`padIndex`): `Gamepad`

Defined in: [core/src/input/InputManager.ts:728](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L728)

指定スロットのブラウザ Gamepad オブジェクトを返す。未接続なら null。
Gamepad ハンドルからの参照用に公開しています。

#### Parameters

##### padIndex

`number`

#### Returns

`Gamepad`

***

### getKeyDuration()

> **getKeyDuration**(`code`): `number`

Defined in: [core/src/input/InputManager.ts:585](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L585)

#### Parameters

##### code

`string`

#### Returns

`number`

***

### getKeyTimeDown()

> **getKeyTimeDown**(`code`): `number`

Defined in: [core/src/input/InputManager.ts:577](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L577)

#### Parameters

##### code

`string`

#### Returns

`number`

***

### getKeyTimeUp()

> **getKeyTimeUp**(`code`): `number`

Defined in: [core/src/input/InputManager.ts:581](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L581)

#### Parameters

##### code

`string`

#### Returns

`number`

***

### isGamepadButtonJustPressed()

> **isGamepadButtonJustPressed**(`padIndex`, `buttonIndex`): `boolean`

Defined in: [core/src/input/InputManager.ts:673](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L673)

ゲームパッドのボタンが今フレームで押されたか。

#### Parameters

##### padIndex

`number`

##### buttonIndex

`number`

#### Returns

`boolean`

***

### isGamepadButtonJustReleased()

> **isGamepadButtonJustReleased**(`padIndex`, `buttonIndex`): `boolean`

Defined in: [core/src/input/InputManager.ts:683](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L683)

ゲームパッドのボタンがこのフレームで離されたか。

#### Parameters

##### padIndex

`number`

##### buttonIndex

`number`

#### Returns

`boolean`

***

### isGamepadButtonPressed()

> **isGamepadButtonPressed**(`padIndex`, `buttonIndex`): `boolean`

Defined in: [core/src/input/InputManager.ts:665](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L665)

ゲームパッドの指定ボタンが押されているか (buttonIndex: 0=A, 1=B など)

#### Parameters

##### padIndex

`number`

##### buttonIndex

`number`

#### Returns

`boolean`

***

### isKeyJustPressed()

> **isKeyJustPressed**(`code`): `boolean`

Defined in: [core/src/input/InputManager.ts:570](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L570)

#### Parameters

##### code

`string`

#### Returns

`boolean`

***

### isKeyJustReleased()

> **isKeyJustReleased**(`code`): `boolean`

Defined in: [core/src/input/InputManager.ts:573](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L573)

#### Parameters

##### code

`string`

#### Returns

`boolean`

***

### isKeyPressed()

> **isKeyPressed**(`code`): `boolean`

Defined in: [core/src/input/InputManager.ts:567](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L567)

#### Parameters

##### code

`string`

#### Returns

`boolean`

***

### isPointerDown()

> **isPointerDown**(): `boolean`

Defined in: [core/src/input/InputManager.ts:652](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L652)

#### Returns

`boolean`

***

### isPointerJustPressed()

> **isPointerJustPressed**(): `boolean`

Defined in: [core/src/input/InputManager.ts:655](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L655)

#### Returns

`boolean`

***

### isPointerJustReleased()

> **isPointerJustReleased**(): `boolean`

Defined in: [core/src/input/InputManager.ts:658](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L658)

#### Returns

`boolean`

***

### update()

> **update**(`dtSeconds?`): `void`

Defined in: [core/src/input/InputManager.ts:424](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L424)

毎フレーム 1 回、入力状態を更新します。

#### Parameters

##### dtSeconds?

`number` = `0`

前フレームからの経過秒数。速度の算出に使います。
  未指定や 0 の場合は生の移動量を速度として扱います。

#### Returns

`void`
