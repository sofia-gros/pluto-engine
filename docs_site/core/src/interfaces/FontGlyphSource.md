[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / FontGlyphSource

# Interface: FontGlyphSource

Defined in: [core/src/arena/Text.ts:19](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Text.ts#L19)

1 文字分の UV と前進幅を供給する最小インターフェース。

## Properties

### layerIndex

> `readonly` **layerIndex**: `number`

Defined in: [core/src/arena/Text.ts:21](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Text.ts#L21)

GPU Texture2DArray のレイヤーインデックス

## Methods

### lookup()

> **lookup**(`charCode`, `outUv`): `number`

Defined in: [core/src/arena/Text.ts:26](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Text.ts#L26)

文字コードから UV (outUv の 0〜3) と、前進幅 (fontSize 単位) を返します。
未知の文字は 0 を返して構いません。

#### Parameters

##### charCode

`number`

##### outUv

`Float32Array`

#### Returns

`number`
