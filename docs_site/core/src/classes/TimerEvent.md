[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / TimerEvent

# Class: TimerEvent

Defined in: [core/src/time/TimerEvent.ts:17](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L17)

## Constructors

### Constructor

> **new TimerEvent**(`id`, `manager`): `TimerEvent`

Defined in: [core/src/time/TimerEvent.ts:23](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L23)

#### Parameters

##### id

`number`

##### manager

[`TimeStepManager`](TimeStepManager.md)

#### Returns

`TimerEvent`

## Properties

### id

> **id**: `number`

Defined in: [core/src/time/TimerEvent.ts:19](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L19)

TimeStepManager 内のタイマー ID。`destroy` 後は -1 になる

## Accessors

### delay

#### Get Signature

> **get** **delay**(): `number`

Defined in: [core/src/time/TimerEvent.ts:44](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L44)

発火までの間隔 (ミリ秒)

##### Returns

`number`

***

### elapsed

#### Get Signature

> **get** **elapsed**(): `number`

Defined in: [core/src/time/TimerEvent.ts:58](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L58)

経過時間 (ミリ秒)。
Phaser 互換のため、GameLoop の開始時刻からの絶対値ではなく
このタイマーの経過のみを返します。

##### Returns

`number`

***

### hasLoop

#### Get Signature

> **get** **hasLoop**(): `boolean`

Defined in: [core/src/time/TimerEvent.ts:34](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L34)

タイマーが繰り返し中か

##### Returns

`boolean`

***

### isPaused

#### Get Signature

> **get** **isPaused**(): `boolean`

Defined in: [core/src/time/TimerEvent.ts:39](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L39)

一時停止中か

##### Returns

`boolean`

***

### isValid

#### Get Signature

> **get** **isValid**(): `boolean`

Defined in: [core/src/time/TimerEvent.ts:29](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L29)

ハンドルとして有効か (destroy されていないか)

##### Returns

`boolean`

***

### progress

#### Get Signature

> **get** **progress**(): `number`

Defined in: [core/src/time/TimerEvent.ts:63](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L63)

進捗率 (0〜1)

##### Returns

`number`

***

### repeatDelay

#### Get Signature

> **get** **repeatDelay**(): `number`

Defined in: [core/src/time/TimerEvent.ts:49](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L49)

繰り返し間隔 (ミリ秒)

##### Returns

`number`

## Methods

### destroy()

> **destroy**(): `this`

Defined in: [core/src/time/TimerEvent.ts:118](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L118)

ハンドル自身を解放します。`remove` と同じですが、
Phaser の `destroy` と同じ名前で呼び出せるように用意しています。

#### Returns

`this`

***

### pause()

> **pause**(): `this`

Defined in: [core/src/time/TimerEvent.ts:91](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L91)

一時停止します。経過時間は保持されます。

#### Returns

`this`

***

### remove()

> **remove**(): `this`

Defined in: [core/src/time/TimerEvent.ts:106](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L106)

タイマーを取り消します。ハンドル自身も無効になります。
二重解放しても安全です。

#### Returns

`this`

***

### reset()

> **reset**(): `this`

Defined in: [core/src/time/TimerEvent.ts:85](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L85)

経過時間を 0 に戻します。発火はしません。

#### Returns

`this`

***

### resume()

> **resume**(): `this`

Defined in: [core/src/time/TimerEvent.ts:97](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L97)

一時停止を解除します。

#### Returns

`this`

***

### seek()

> **seek**(`ms`): `this`

Defined in: [core/src/time/TimerEvent.ts:79](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L79)

指定ミリ秒位置まで即座に進めます。発火はしません。

#### Parameters

##### ms

`number`

#### Returns

`this`

***

### setDelay()

> **setDelay**(`delayMs`): `this`

Defined in: [core/src/time/TimerEvent.ts:71](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/time/TimerEvent.ts#L71)

発火までの間隔 (ミリ秒) を書き換えます。
繰り返し間隔も同時に追従します。

#### Parameters

##### delayMs

`number`

#### Returns

`this`
