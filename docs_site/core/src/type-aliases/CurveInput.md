[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / CurveInput

# Type Alias: CurveInput

> **CurveInput** = `object`

Defined in: [core/src/math/Curves.ts:43](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Curves.ts#L43)

カーブの入力点群（制御点）。点数は `kind` ごとに決まります。

## Properties

### kind

> `readonly` **kind**: [`CurveKindValue`](CurveKindValue.md)

Defined in: [core/src/math/Curves.ts:44](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Curves.ts#L44)

***

### points

> `readonly` **points**: [`CurvePointLike`](CurvePointLike.md)

Defined in: [core/src/math/Curves.ts:46](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Curves.ts#L46)

制御点。`kind` に応じて 2 / 3 / 4 / n 個の点を受けす。
