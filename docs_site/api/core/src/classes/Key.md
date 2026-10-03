[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Key

# Class: Key

Defined in: [core/src/input/InputManager.ts:18](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L18)

キー 1 個分の参照ハンドル (Phaser 互換の Key)。

状態は InputManager 内の Set を参照するため、
このインスタンスは own プロパティを code と _input の 2 つだけ持ちます。

## Constructors

### Constructor

> **new Key**(`code`, `input`): `Key`

Defined in: [core/src/input/InputManager.ts:23](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L23)

#### Parameters

##### code

`string`

##### input

[`InputManager`](InputManager.md)

#### Returns

`Key`

## Properties

### code

> `readonly` **code**: `string`

Defined in: [core/src/input/InputManager.ts:20](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L20)

KeyboardEvent.code (例: 'KeyW', 'ArrowUp')

## Accessors

### duration

#### Get Signature

> **get** **duration**(): `number`

Defined in: [core/src/input/InputManager.ts:47](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L47)

##### Returns

`number`

***

### isDown

#### Get Signature

> **get** **isDown**(): `boolean`

Defined in: [core/src/input/InputManager.ts:29](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L29)

押されているか

##### Returns

`boolean`

***

### isJustDown

#### Get Signature

> **get** **isJustDown**(): `boolean`

Defined in: [core/src/input/InputManager.ts:33](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L33)

このフレームで押されたか

##### Returns

`boolean`

***

### isJustUp

#### Get Signature

> **get** **isJustUp**(): `boolean`

Defined in: [core/src/input/InputManager.ts:37](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L37)

このフレームで離されたか

##### Returns

`boolean`

***

### timeDown

#### Get Signature

> **get** **timeDown**(): `number`

Defined in: [core/src/input/InputManager.ts:41](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L41)

##### Returns

`number`

***

### timeUp

#### Get Signature

> **get** **timeUp**(): `number`

Defined in: [core/src/input/InputManager.ts:44](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L44)

##### Returns

`number`

## Methods

### addTo()

> **addTo**(): `void`

Defined in: [core/src/input/InputManager.ts:54](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L54)

#### Returns

`void`

***

### enableCapture()

> **enableCapture**(): `void`

Defined in: [core/src/input/InputManager.ts:52](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L52)

#### Returns

`void`

***

### removeFrom()

> **removeFrom**(): `void`

Defined in: [core/src/input/InputManager.ts:53](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L53)

#### Returns

`void`
