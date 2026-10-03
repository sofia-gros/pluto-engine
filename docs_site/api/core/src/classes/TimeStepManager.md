[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / TimeStepManager

# Class: TimeStepManager

Defined in: [core/src/time/TimeStepManager.ts:32](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L32)

## Constructors

### Constructor

> **new TimeStepManager**(`timerCapacity?`): `TimeStepManager`

Defined in: [core/src/time/TimeStepManager.ts:75](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L75)

#### Parameters

##### timerCapacity?

`number` = `DEFAULT_TIMER_CAPACITY`

#### Returns

`TimeStepManager`

## Properties

### deltaTime

> **deltaTime**: `number` = `0`

Defined in: [core/src/time/TimeStepManager.ts:37](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L37)

***

### fps

> **fps**: `number` = `0`

Defined in: [core/src/time/TimeStepManager.ts:34](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L34)

直近に実測した FPS (1 秒窓)

***

### measuredFps

> **measuredFps**: `number` = `0`

Defined in: [core/src/time/TimeStepManager.ts:36](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L36)

実効フレームレート。GameLoop から毎フレーム書き込まれる

***

### now

> **now**: `number` = `0`

Defined in: [core/src/time/TimeStepManager.ts:41](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L41)

現在のフレームのタイムスタンプ (ミリ秒)

***

### time

> **time**: `number` = `0`

Defined in: [core/src/time/TimeStepManager.ts:39](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L39)

ゲーム開始からの経過秒数

***

### timerCapacity

> `readonly` **timerCapacity**: `number`

Defined in: [core/src/time/TimeStepManager.ts:54](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L54)

***

### timeScale

> **timeScale**: `number` = `1`

Defined in: [core/src/time/TimeStepManager.ts:46](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L46)

時間スケール。1.0 が等速、2.0 で 2 倍速です。
タイマーの登録時と更新時の両方に乗算されます。

## Accessors

### activeTimerCount

#### Get Signature

> **get** **activeTimerCount**(): `number`

Defined in: [core/src/time/TimeStepManager.ts:196](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L196)

##### Returns

`number`

## Methods

### addEvent()

> **addEvent**(`config`): `number`

Defined in: [core/src/time/TimeStepManager.ts:140](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L140)

タイマーを登録します。

#### Parameters

##### config

[`TimerEventConfig`](../interfaces/TimerEventConfig.md) & `object`

#### Returns

`number`

タイマー ID

***

### clearTimers()

> **clearTimers**(): `void`

Defined in: [core/src/time/TimeStepManager.ts:344](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L344)

すべてのタイマーを取り消します。

#### Returns

`void`

***

### delayedCall()

> **delayedCall**(`delayMs`, `callback`, `args?`): `number`

Defined in: [core/src/time/TimeStepManager.ts:131](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L131)

指定ミリ秒後に一度だけ実行するタイマーを登録します。

オブジェクトリテラルを生成しないよう、addEvent を直接呼びます。

#### Parameters

##### delayMs

`number`

##### callback

(...`args`) => `void`

##### args?

`any`[]

#### Returns

`number`

タイマー ID (removeEvent に渡します)

***

### getTimerCallback()

> **getTimerCallback**(`id`): (...`args`) => `void`

Defined in: [core/src/time/TimeStepManager.ts:280](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L280)

コールバックを読み取り専用で取得します。Flyweight からの差し替え用。

#### Parameters

##### id

`number`

#### Returns

(...`args`) => `void`

***

### getTimerDelay()

> **getTimerDelay**(`id`): `number`

Defined in: [core/src/time/TimeStepManager.ts:218](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L218)

発火までの間隔 (ミリ秒)

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getTimerElapsed()

> **getTimerElapsed**(`id`): `number`

Defined in: [core/src/time/TimeStepManager.ts:213](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L213)

経過時間 (ミリ秒)

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getTimerProgress()

> **getTimerProgress**(`id`): `number`

Defined in: [core/src/time/TimeStepManager.ts:235](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L235)

進捗率 (0〜1)。delay が 0 のときは完了扱いとして 1 を返します。

#### Parameters

##### id

`number`

#### Returns

`number`

***

### getTimerRepeatDelay()

> **getTimerRepeatDelay**(`id`): `number`

Defined in: [core/src/time/TimeStepManager.ts:223](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L223)

繰り返し間隔 (ミリ秒)

#### Parameters

##### id

`number`

#### Returns

`number`

***

### hasTimer()

> **hasTimer**(`id`): `boolean`

Defined in: [core/src/time/TimeStepManager.ts:203](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L203)

タイマーが登録済みで、まだ取り消されていないか

#### Parameters

##### id

`number`

#### Returns

`boolean`

***

### isTimerLooping()

> **isTimerLooping**(`id`): `boolean`

Defined in: [core/src/time/TimeStepManager.ts:228](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L228)

繰り返し中か

#### Parameters

##### id

`number`

#### Returns

`boolean`

***

### isTimerPaused()

> **isTimerPaused**(`id`): `boolean`

Defined in: [core/src/time/TimeStepManager.ts:208](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L208)

タイマーが一時停止中か

#### Parameters

##### id

`number`

#### Returns

`boolean`

***

### pauseTimer()

> **pauseTimer**(`id`): `void`

Defined in: [core/src/time/TimeStepManager.ts:244](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L244)

一時停止します。経過時間は保持されます。

#### Parameters

##### id

`number`

#### Returns

`void`

***

### removeEvent()

> **removeEvent**(`id`): `void`

Defined in: [core/src/time/TimeStepManager.ts:184](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L184)

登録済みタイマーを取り消します。

#### Parameters

##### id

`number`

#### Returns

`void`

***

### resetTimer()

> **resetTimer**(`id`): `void`

Defined in: [core/src/time/TimeStepManager.ts:254](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L254)

経過時間を 0 に戻し、delay 閾値に戻します。発火はしません。

#### Parameters

##### id

`number`

#### Returns

`void`

***

### resumeTimer()

> **resumeTimer**(`id`): `void`

Defined in: [core/src/time/TimeStepManager.ts:249](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L249)

一時停止を解除します。

#### Parameters

##### id

`number`

#### Returns

`void`

***

### seekTimer()

> **seekTimer**(`id`, `ms`): `void`

Defined in: [core/src/time/TimeStepManager.ts:264](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L264)

指定ミリ秒位置まで即座に進めます。発火はさせず、経過時間だけを変更します。
Phaser の seek に相当します。

#### Parameters

##### id

`number`

##### ms

`number`

#### Returns

`void`

***

### setTimerDelay()

> **setTimerDelay**(`id`, `delayMs`): `void`

Defined in: [core/src/time/TimeStepManager.ts:271](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L271)

発火までの間隔を書き換えます。

#### Parameters

##### id

`number`

##### delayMs

`number`

#### Returns

`void`

***

### step()

> **step**(`now`): `number`

Defined in: [core/src/time/TimeStepManager.ts:96](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L96)

ループの 1 ステップを進めます。引数は rAF のタイムスタンプ (ミリ秒)。

#### Parameters

##### now

`number`

#### Returns

`number`

可変フレームの dt (秒)

***

### update()

> **update**(`dtMs`): `void`

Defined in: [core/src/time/TimeStepManager.ts:287](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L287)

登録済みのタイマーを進めます。GameLoop から毎フレーム 1 回呼ばれます。

#### Parameters

##### dtMs

`number`

#### Returns

`void`
