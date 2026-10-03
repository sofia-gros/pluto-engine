[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Pointer

# Class: Pointer

Defined in: [core/src/input/InputManager.ts:73](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L73)

ポインタの参照ハンドル (Phaser 互換の Pointer)。

pluto-engine は単一ポインタのみを扱うため、座標と状態を
InputManager から参照するだけの薄い存在です。

## Constructors

### Constructor

> **new Pointer**(`input`): `Pointer`

Defined in: [core/src/input/InputManager.ts:78](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L78)

#### Parameters

##### input

[`InputManager`](InputManager.md)

#### Returns

`Pointer`

## Properties

### id

> `readonly` **id**: `0` = `0`

Defined in: [core/src/input/InputManager.ts:76](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L76)

常に 0 です (単一ポインタのため)

## Accessors

### angle

#### Get Signature

> **get** **angle**(): `number`

Defined in: [core/src/input/InputManager.ts:139](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L139)

移動方向 (ラジアン、+X 方向が 0)

##### Returns

`number`

***

### button

#### Get Signature

> **get** **button**(): `number`

Defined in: [core/src/input/InputManager.ts:172](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L172)

ボタン番号は無視され、常に左ボタン相当です

##### Returns

`number`

***

### distance

#### Get Signature

> **get** **distance**(): `number`

Defined in: [core/src/input/InputManager.ts:143](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L143)

ボタン押下からの累積移動距離

##### Returns

`number`

***

### downX

#### Get Signature

> **get** **downX**(): `number`

Defined in: [core/src/input/InputManager.ts:147](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L147)

ボタンが押された位置の X

##### Returns

`number`

***

### downY

#### Get Signature

> **get** **downY**(): `number`

Defined in: [core/src/input/InputManager.ts:151](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L151)

ボタンが押された位置の Y

##### Returns

`number`

***

### dx

#### Get Signature

> **get** **dx**(): `number`

Defined in: [core/src/input/InputManager.ts:123](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L123)

前フレームからの移動量 X (`movementX` と同値)

##### Returns

`number`

***

### dy

#### Get Signature

> **get** **dy**(): `number`

Defined in: [core/src/input/InputManager.ts:127](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L127)

前フレームからの移動量 Y (`movementY` と同値)

##### Returns

`number`

***

### isDown

#### Get Signature

> **get** **isDown**(): `boolean`

Defined in: [core/src/input/InputManager.ts:162](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L162)

##### Returns

`boolean`

***

### isJustDown

#### Get Signature

> **get** **isJustDown**(): `boolean`

Defined in: [core/src/input/InputManager.ts:165](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L165)

##### Returns

`boolean`

***

### isJustUp

#### Get Signature

> **get** **isJustUp**(): `boolean`

Defined in: [core/src/input/InputManager.ts:168](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L168)

##### Returns

`boolean`

***

### movementX

#### Get Signature

> **get** **movementX**(): `number`

Defined in: [core/src/input/InputManager.ts:115](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L115)

前フレームからの移動量 X

##### Returns

`number`

***

### movementY

#### Get Signature

> **get** **movementY**(): `number`

Defined in: [core/src/input/InputManager.ts:119](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L119)

前フレームからの移動量 Y

##### Returns

`number`

***

### pointerId

#### Get Signature

> **get** **pointerId**(): `number`

Defined in: [core/src/input/InputManager.ts:111](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L111)

ポインタ ID。単一ポインタのため常に 0

##### Returns

`number`

***

### screenX

#### Get Signature

> **get** **screenX**(): `number`

Defined in: [core/src/input/InputManager.ts:103](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L103)

変換前の画面座標の X (CSS ピクセル)

##### Returns

`number`

***

### screenY

#### Get Signature

> **get** **screenY**(): `number`

Defined in: [core/src/input/InputManager.ts:107](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L107)

変換前の画面座標の Y (CSS ピクセル)

##### Returns

`number`

***

### upX

#### Get Signature

> **get** **upX**(): `number`

Defined in: [core/src/input/InputManager.ts:155](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L155)

ボタンが離された位置の X

##### Returns

`number`

***

### upY

#### Get Signature

> **get** **upY**(): `number`

Defined in: [core/src/input/InputManager.ts:159](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L159)

ボタンが離された位置の Y

##### Returns

`number`

***

### velocityX

#### Get Signature

> **get** **velocityX**(): `number`

Defined in: [core/src/input/InputManager.ts:131](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L131)

移動速度 X (座標 / 秒)

##### Returns

`number`

***

### velocityY

#### Get Signature

> **get** **velocityY**(): `number`

Defined in: [core/src/input/InputManager.ts:135](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L135)

移動速度 Y (座標 / 秒)

##### Returns

`number`

***

### worldX

#### Get Signature

> **get** **worldX**(): `number`

Defined in: [core/src/input/InputManager.ts:95](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L95)

ワールド座標の X。
Phaser 互換のため `x` と同じゲーム座標を返します。
変換前の画面座標が必要な場合は `screenX` を使ってください。

##### Returns

`number`

***

### worldY

#### Get Signature

> **get** **worldY**(): `number`

Defined in: [core/src/input/InputManager.ts:99](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L99)

ワールド座標の Y。`y` と同じゲーム座標を返します

##### Returns

`number`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [core/src/input/InputManager.ts:83](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L83)

ゲーム座標の X

##### Returns

`number`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [core/src/input/InputManager.ts:87](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L87)

ゲーム座標の Y

##### Returns

`number`
