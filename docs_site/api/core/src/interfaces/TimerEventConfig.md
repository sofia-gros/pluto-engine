[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / TimerEventConfig

# Interface: TimerEventConfig

Defined in: [core/src/time/TimeStepManager.ts:13](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L13)

## File

TimeStepManager.ts

## Description

時間の管理。DeltaTime の計算、実効 FPS の計測、
フレームレート非依存のタイマー (delayedCall / addEvent) を担当します。

設計上の掟: タイマーは事前確保した SoA 配列 + フリーリストで管理し、
update ループ内で new を行いません。
Flyweight ハンドル (TimerEvent) からは本クラスの公开アクセサだけを呼び、
SoA 配列を直接触りません。

## Properties

### callback

> **callback**: (...`args`) => `void`

Defined in: [core/src/time/TimeStepManager.ts:17](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L17)

発火時に呼ばれる関数

#### Parameters

##### args

...`any`[]

#### Returns

`void`

***

### delay

> **delay**: `number`

Defined in: [core/src/time/TimeStepManager.ts:15](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L15)

発火までのミリ秒

***

### loop?

> `optional` **loop?**: `boolean`

Defined in: [core/src/time/TimeStepManager.ts:19](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L19)

true

***

### repeatDelay?

> `optional` **repeatDelay?**: `number`

Defined in: [core/src/time/TimeStepManager.ts:21](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/time/TimeStepManager.ts#L21)

繰り返し時の間隔 (ミリ秒)。未指定なら delay を使用します
