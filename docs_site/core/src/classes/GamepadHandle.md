[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / GamepadHandle

# Class: GamepadHandle

Defined in: [core/src/input/InputManager.ts:183](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/input/InputManager.ts#L183)

Phaser 4 互換のゲームパッドハンドル。

設計上の掟 (R-03): own property は `index` と `_input` の 2 個だけ。
接続状態は InputManager 側の SoA とブラウザの Gamepad 参照が正本です。

## Constructors

### Constructor

> **new GamepadHandle**(`index`, `input`): `GamepadHandle`

Defined in: [core/src/input/InputManager.ts:189](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/input/InputManager.ts#L189)

#### Parameters

##### index

`number`

##### input

[`InputManager`](InputManager.md)

#### Returns

`GamepadHandle`

## Properties

### index

> `readonly` **index**: `number`

Defined in: [core/src/input/InputManager.ts:185](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/input/InputManager.ts#L185)

コントローラー番号 (0 から)

## Accessors

### axes

#### Get Signature

> **get** **axes**(): `number`

Defined in: [core/src/input/InputManager.ts:217](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/input/InputManager.ts#L217)

アナログ軸の数

##### Returns

`number`

***

### buttons

#### Get Signature

> **get** **buttons**(): `number`

Defined in: [core/src/input/InputManager.ts:211](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/input/InputManager.ts#L211)

ゲームパッドのボタン数

##### Returns

`number`

***

### connected

#### Get Signature

> **get** **connected**(): `boolean`

Defined in: [core/src/input/InputManager.ts:195](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/input/InputManager.ts#L195)

このスロットにゲームパッドが接続されているか

##### Returns

`boolean`

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [core/src/input/InputManager.ts:205](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/input/InputManager.ts#L205)

ゲームパッドの識別名 (Phaser 互換の `id`)

##### Returns

`string`

***

### native

#### Get Signature

> **get** **native**(): `Gamepad`

Defined in: [core/src/input/InputManager.ts:200](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/input/InputManager.ts#L200)

接続済みならブラウザの Gamepad オブジェクトを返す

##### Returns

`Gamepad`

## Methods

### getAxis()

> **getAxis**(`axisIndex`): `number`

Defined in: [core/src/input/InputManager.ts:244](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/input/InputManager.ts#L244)

アナログ軸の値 (0=左X, 1=左Y, 2=右X, 3=右Y)。
デッドゾーン (0.1) は入力側で処理済みです。

#### Parameters

##### axisIndex

`number`

#### Returns

`number`

***

### isDown()

> **isDown**(`buttonIndex`): `boolean`

Defined in: [core/src/input/InputManager.ts:226](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/input/InputManager.ts#L226)

ボタンが押されているか (Phaser 互換の `isDown`)。

#### Parameters

##### buttonIndex

`number`

0=A, 1=B, ...

#### Returns

`boolean`

***

### isJustDown()

> **isJustDown**(`buttonIndex`): `boolean`

Defined in: [core/src/input/InputManager.ts:231](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/input/InputManager.ts#L231)

ボタンが今フレームで押されたか

#### Parameters

##### buttonIndex

`number`

#### Returns

`boolean`

***

### isJustUp()

> **isJustUp**(`buttonIndex`): `boolean`

Defined in: [core/src/input/InputManager.ts:236](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/input/InputManager.ts#L236)

ボタンが今フレームで離されたか

#### Parameters

##### buttonIndex

`number`

#### Returns

`boolean`

***

### toString()

> **toString**(): `string`

Defined in: [core/src/input/InputManager.ts:249](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/input/InputManager.ts#L249)

デバッグ用の文字列表現

#### Returns

`string`
