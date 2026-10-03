[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [renderer/src](../README.md) / RenderGraph

# Class: RenderGraph

Defined in: [renderer/src/filters/RenderGraph.ts:47](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/filters/RenderGraph.ts#L47)

## Constructors

### Constructor

> **new RenderGraph**(): `RenderGraph`

#### Returns

`RenderGraph`

## Accessors

### hasFilters

#### Get Signature

> **get** **hasFilters**(): `boolean`

Defined in: [renderer/src/filters/RenderGraph.ts:68](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/filters/RenderGraph.ts#L68)

フィルタが 1 つでもあれば true

##### Returns

`boolean`

## Methods

### effectiveFilters()

> **effectiveFilters**(`device`): readonly [`FilterDef`](../interfaces/FilterDef.md)[]

Defined in: [renderer/src/filters/RenderGraph.ts:78](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/filters/RenderGraph.ts#L78)

実際に適用されるフィルタ列（WebGL2 で無視されるものを除外）。

`webgpuOnly` は **対応状況が確定してから**判定します。
ここで推測すると、「対応済みでないのに適用された」挙動になります。

#### Parameters

##### device

`unknown`

#### Returns

readonly [`FilterDef`](../interfaces/FilterDef.md)[]

***

### render()

> **render**(`drawScene`, `width`, `height`, `device`): `boolean`

Defined in: [renderer/src/filters/RenderGraph.ts:92](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/filters/RenderGraph.ts#L92)

1 フレームを描画します。

#### Parameters

##### drawScene

() => `void`

スプライト描画（この中では `drawInstanced` を呼ぶ）

##### width

`number`

画面幅 (px)

##### height

`number`

画面高 (px)

##### device

`unknown`

#### Returns

`boolean`

***

### sceneDrawCalls()

> **sceneDrawCalls**(): `number`

Defined in: [renderer/src/filters/RenderGraph.ts:186](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/filters/RenderGraph.ts#L186)

診断: 直近のフレームで scene 描画を何回呼んだか

#### Returns

`number`

***

### setFilters()

> **setFilters**(`internal`, `external?`): `void`

Defined in: [renderer/src/filters/RenderGraph.ts:60](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/filters/RenderGraph.ts#L60)

Filter チェーンを設定します。

#### Parameters

##### internal

readonly [`FilterDef`](../interfaces/FilterDef.md)[]

`filters.internal` 由来のフィルタ列

##### external?

readonly [`FilterDef`](../interfaces/FilterDef.md)[] = `[]`

外部（post-pipeline）フィルタ列。RenderGraph は順序を保つだけで、
                個別の意味は持ちません

#### Returns

`void`
