[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [renderer/src](../README.md) / FilterChain

# Interface: FilterChain

Defined in: [renderer/src/filters/types.ts:83](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/filters/types.ts#L83)

フィルタチェーンの適用結果を表す不変データ。

`internal` / `external` の 2 系統を 1 本のチェーンに並べ替えます
（Phaser 4 と同じ考え方です）。

## Properties

### external

> `readonly` **external**: readonly [`FilterDef`](FilterDef.md)[]

Defined in: [renderer/src/filters/types.ts:85](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/filters/types.ts#L85)

***

### internal

> `readonly` **internal**: readonly [`FilterDef`](FilterDef.md)[]

Defined in: [renderer/src/filters/types.ts:84](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/filters/types.ts#L84)
