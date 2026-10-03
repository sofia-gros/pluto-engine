[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [renderer/src](../README.md) / filtersExternal

# Variable: filtersExternal

> `const` **filtersExternal**: `object`

Defined in: [renderer/src/filters/external.ts:167](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/filters/external.ts#L167)

`filters.external` — 任意の texture を加工するフィルタのレジストリ。

コールは new を伴います。毎フレーム呼ぶのは呼び出し側の誤りです
（`engineConfig.filters` に 1 度だけ入れてください）。

## Type Declaration

### displacement

> **displacement**: () => `DisplacementFilter`

#### Returns

`DisplacementFilter`

### threshold

> **threshold**: () => `ThresholdFilter`

#### Returns

`ThresholdFilter`

### wipe

> **wipe**: () => `WipeFilter`

#### Returns

`WipeFilter`
