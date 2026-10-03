[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / TimeFacade

# Class: TimeFacade

Defined in: [core/src/time/TimeFacade.ts:14](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeFacade.ts#L14)

## Constructors

### Constructor

> **new TimeFacade**(`time`): `TimeFacade`

Defined in: [core/src/time/TimeFacade.ts:19](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeFacade.ts#L19)

#### Parameters

##### time

[`TimeStepManager`](TimeStepManager.md)

#### Returns

`TimeFacade`

## Accessors

### activeTimerCount

#### Get Signature

> **get** **activeTimerCount**(): `number`

Defined in: [core/src/time/TimeFacade.ts:107](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeFacade.ts#L107)

現在有効なタイマーの数

##### Returns

`number`

***

### delta

#### Get Signature

> **get** **delta**(): `number`

Defined in: [core/src/time/TimeFacade.ts:29](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeFacade.ts#L29)

可変フレームの delta (秒)

##### Returns

`number`

***

### fps

#### Get Signature

> **get** **fps**(): `number`

Defined in: [core/src/time/TimeFacade.ts:24](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeFacade.ts#L24)

実効フレームレート

##### Returns

`number`

***

### now

#### Get Signature

> **get** **now**(): `number`

Defined in: [core/src/time/TimeFacade.ts:34](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeFacade.ts#L34)

ゲーム開始からの経過秒数

##### Returns

`number`

***

### timeScale

#### Get Signature

> **get** **timeScale**(): `number`

Defined in: [core/src/time/TimeFacade.ts:42](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeFacade.ts#L42)

時間スケール。1.0 が等速、2.0 で 2 倍速です。
0 以下の値にはクランプします。

##### Returns

`number`

#### Set Signature

> **set** **timeScale**(`v`): `void`

Defined in: [core/src/time/TimeFacade.ts:46](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeFacade.ts#L46)

##### Parameters

###### v

`number`

##### Returns

`void`

## Methods

### addEvent()

> **addEvent**(`config`): [`TimerEvent`](TimerEvent.md)

Defined in: [core/src/time/TimeFacade.ts:70](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeFacade.ts#L70)

イベントを登録します (Phaser 互換の `addEvent`)。

#### Parameters

##### config

###### args?

`any`[]

###### callback

(...`args`) => `void`

###### delay

`number`

###### loop?

`boolean`

###### repeatDelay?

`number`

#### Returns

[`TimerEvent`](TimerEvent.md)

TimerEvent ハンドル

***

### clear()

> **clear**(): `void`

Defined in: [core/src/time/TimeFacade.ts:101](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeFacade.ts#L101)

登録済みのタイマーをすべて取り消します

#### Returns

`void`

***

### delayedCall()

> **delayedCall**(`delayMs`, `callback`, `args?`): [`TimerEvent`](TimerEvent.md)

Defined in: [core/src/time/TimeFacade.ts:54](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeFacade.ts#L54)

指定ミリ秒後に一度だけ実行します (Phaser 互換の `delayedCall`)。

#### Parameters

##### delayMs

`number`

##### callback

(...`args`) => `void`

##### args?

`any`[]

#### Returns

[`TimerEvent`](TimerEvent.md)

TimerEvent ハンドル

***

### removeEvent()

> **removeEvent**(`id`): `void`

Defined in: [core/src/time/TimeFacade.ts:95](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeFacade.ts#L95)

登録済みのタイマーを取り消します。
`delayedCall` が返すハンドルではなく、TimeStepManager 、
つまり数値 ID を取る既存のコード向けの互換経路です。

#### Parameters

##### id

`number`

#### Returns

`void`

***

### smoothStep()

> **smoothStep**(`t`): `number`

Defined in: [core/src/time/TimeFacade.ts:116](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeFacade.ts#L116)

線形補間を行います (Phaser 互換の `smoothStep`)。

#### Parameters

##### t

`number`

0〜1 の進行度

#### Returns

`number`

t を 0〜1 にクランプした eased 値
