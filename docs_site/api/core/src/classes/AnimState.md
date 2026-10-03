[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / AnimState

# Class: AnimState

Defined in: [core/src/anim/AnimState.ts:18](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L18)

## Constructors

### Constructor

> **new AnimState**(`slot`, `manager`): `AnimState`

Defined in: [core/src/anim/AnimState.ts:24](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L24)

#### Parameters

##### slot

`number`

##### manager

[`AnimationManager`](AnimationManager.md)

#### Returns

`AnimState`

## Properties

### slot

> **slot**: `number`

Defined in: [core/src/anim/AnimState.ts:20](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L20)

AnimationManager 内の再生スロット番号。`stop` 後は -1 になる

## Accessors

### currentFrame

#### Get Signature

> **get** **currentFrame**(): `number`

Defined in: [core/src/anim/AnimState.ts:50](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L50)

現在のコマ番号 (0 始まり)

##### Returns

`number`

***

### isPaused

#### Get Signature

> **get** **isPaused**(): `boolean`

Defined in: [core/src/anim/AnimState.ts:40](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L40)

一時停止中か

##### Returns

`boolean`

***

### isPlaying

#### Get Signature

> **get** **isPlaying**(): `boolean`

Defined in: [core/src/anim/AnimState.ts:35](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L35)

再生中か

##### Returns

`boolean`

***

### isPlayingReverse

#### Get Signature

> **get** **isPlayingReverse**(): `boolean`

Defined in: [core/src/anim/AnimState.ts:45](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L45)

逆再生中か

##### Returns

`boolean`

***

### isValid

#### Get Signature

> **get** **isValid**(): `boolean`

Defined in: [core/src/anim/AnimState.ts:30](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L30)

ハンドルとして有効か (停止していないか)

##### Returns

`boolean`

***

### progress

#### Get Signature

> **get** **progress**(): `number`

Defined in: [core/src/anim/AnimState.ts:63](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L63)

再生の進捗率 (0〜1)。
逆再生では 1 から 0 へ減少します。

##### Returns

`number`

***

### totalFrames

#### Get Signature

> **get** **totalFrames**(): `number`

Defined in: [core/src/anim/AnimState.ts:55](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L55)

総コマ数

##### Returns

`number`

## Methods

### getProgress()

> **getProgress**(): `number`

Defined in: [core/src/anim/AnimState.ts:68](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L68)

進捗率 (0〜1)

#### Returns

`number`

***

### pause()

> **pause**(): `this`

Defined in: [core/src/anim/AnimState.ts:82](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L82)

一時停止します。コマ位置は保持されます。

#### Returns

`this`

***

### resume()

> **resume**(): `this`

Defined in: [core/src/anim/AnimState.ts:88](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L88)

一時停止を解除します。

#### Returns

`this`

***

### setDirection()

> **setDirection**(`reverse`): `this`

Defined in: [core/src/anim/AnimState.ts:76](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L76)

再生方向を切り替えます (Phaser 互換の `setDirection`)。

#### Parameters

##### reverse

`boolean`

true で逆再生

#### Returns

`this`

***

### stop()

> **stop**(): `this`

Defined in: [core/src/anim/AnimState.ts:97](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L97)

再生を停止してスロットを解放します。ハンドル自身も無効になります。
二重解放しても安全です。

#### Returns

`this`

***

### stopIfPlaying()

> **stopIfPlaying**(): `this`

Defined in: [core/src/anim/AnimState.ts:109](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimState.ts#L109)

再生中なら停止し、そうでなければ何もしない。
`isPlaying` を確認してから `stop` する処理を 1 つにまとめます。

#### Returns

`this`
