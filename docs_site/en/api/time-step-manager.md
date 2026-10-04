---
title: TimeStepManager
---

# TimeStepManager

## Properties

### `fps`

**Type:** `number`

直近に実測した FPS (1 秒窓)

### `measuredFps`

**Type:** `number`

実効フレームレート。GameLoop から毎フレーム書き込まれる

### `deltaTime`

**Type:** `number`



### `time`

**Type:** `number`

ゲーム開始からの経過秒数

### `now`

**Type:** `number`

現在のフレームのタイムスタンプ (ミリ秒)

### `timeScale`

**Type:** `number`

時間スケール。1.0 が等速、2.0 で 2 倍速です。
タイマーの登録時と更新時の両方に乗算されます。

### `timerCapacity`

**Type:** `number`



## Methods

### `step(now: number)`

**Returns:** `number`

ループの 1 ステップを進めます。引数は rAF のタイムスタンプ (ミリ秒)。

### `delayedCall(delayMs: number, callback: (...args: any[]) =&gt; void, args?: any[] | undefined)`

**Returns:** `number`

指定ミリ秒後に一度だけ実行するタイマーを登録します。

オブジェクトリテラルを生成しないよう、addEvent を直接呼びます。

### `addEvent(config: import("A:/Project/plute-engine/packages/core/src/time/TimeStepManager").TimerEventConfig & { args?: any[] | undefined; })`

**Returns:** `number`

タイマーを登録します。

### `removeEvent(id: number)`

**Returns:** `void`

登録済みタイマーを取り消します。

### `hasTimer(id: number)`

**Returns:** `boolean`

タイマーが登録済みで、まだ取り消されていないか

### `isTimerPaused(id: number)`

**Returns:** `boolean`

タイマーが一時停止中か

### `getTimerElapsed(id: number)`

**Returns:** `number`

経過時間 (ミリ秒)

### `getTimerDelay(id: number)`

**Returns:** `number`

発火までの間隔 (ミリ秒)

### `getTimerRepeatDelay(id: number)`

**Returns:** `number`

繰り返し間隔 (ミリ秒)

### `isTimerLooping(id: number)`

**Returns:** `boolean`

繰り返し中か

### `getTimerProgress(id: number)`

**Returns:** `number`

進捗率 (0〜1)。delay が 0 のときは完了扱いとして 1 を返します。

### `pauseTimer(id: number)`

**Returns:** `void`

一時停止します。経過時間は保持されます。

### `resumeTimer(id: number)`

**Returns:** `void`

一時停止を解除します。

### `resetTimer(id: number)`

**Returns:** `void`

経過時間を 0 に戻し、delay 閾値に戻します。発火はしません。

### `seekTimer(id: number, ms: number)`

**Returns:** `void`

指定ミリ秒位置まで即座に進めます。発火はさせず、経過時間だけを変更します。
Phaser の seek に相当します。

### `setTimerDelay(id: number, delayMs: number)`

**Returns:** `void`

発火までの間隔を書き換えます。

### `getTimerCallback(id: number)`

**Returns:** `((...args: any[]) =&gt; void) | undefined`

コールバックを読み取り専用で取得します。Flyweight からの差し替え用。

### `update(dtMs: number)`

**Returns:** `void`

登録済みのタイマーを進めます。GameLoop から毎フレーム 1 回呼ばれます。

### `clearTimers()`

**Returns:** `void`

すべてのタイマーを取り消します。

