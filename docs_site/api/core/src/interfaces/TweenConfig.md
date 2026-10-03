[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / TweenConfig

# Interface: TweenConfig

Defined in: [core/src/tween/TweenManager.ts:26](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L26)

Phaser 互換のトゥイーン設定。
対象のプロパティは `props` で指定します。

## Properties

### delay?

> `optional` **delay?**: `number`

Defined in: [core/src/tween/TweenManager.ts:34](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L34)

遅延 (ミリ秒)

***

### duration?

> `optional` **duration?**: `number`

Defined in: [core/src/tween/TweenManager.ts:32](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L32)

所要時間 (ミリ秒)

***

### ease?

> `optional` **ease?**: `string`

Defined in: [core/src/tween/TweenManager.ts:36](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L36)

イージング名。例: 'Cubic.easeOut' / 'Quad.easeIn'

***

### onComplete?

> `optional` **onComplete?**: () => `void`

Defined in: [core/src/tween/TweenManager.ts:46](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L46)

完了時に 1 度だけ呼ばれます。

#### Returns

`void`

***

### onStart?

> `optional` **onStart?**: () => `void`

Defined in: [core/src/tween/TweenManager.ts:42](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L42)

開始時に 1 度だけ呼ばれます。

#### Returns

`void`

***

### onUpdate?

> `optional` **onUpdate?**: () => `void`

Defined in: [core/src/tween/TweenManager.ts:44](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L44)

毎フレーム呼ばれます。

#### Returns

`void`

***

### props

> **props**: `Record`\<`string`, `number`\>

Defined in: [core/src/tween/TweenManager.ts:30](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L30)

補間するプロパティ。例: { x: 100, y: 200 }

***

### repeat?

> `optional` **repeat?**: `number`

Defined in: [core/src/tween/TweenManager.ts:40](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L40)

繰り返し回数。-1 は無限、0 は 1 回のみ。

***

### targets

> **targets**: [`TweenTarget`](TweenTarget.md) \| [`TweenTarget`](TweenTarget.md)[]

Defined in: [core/src/tween/TweenManager.ts:28](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L28)

対象のスプライト。Phaser は配列も受け付けます。

***

### yoyo?

> `optional` **yoyo?**: `boolean`

Defined in: [core/src/tween/TweenManager.ts:38](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L38)

往復する場合 true。false の場合は折り返して 0 から始めます。
