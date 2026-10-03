[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / BitmapFontGlyphSource

# Class: BitmapFontGlyphSource

Defined in: [core/src/arena/BitmapFontGlyphSource.ts:19](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/BitmapFontGlyphSource.ts#L19)

1 文字分の UV と前進幅を供給する最小インターフェース。

## Implements

- [`FontGlyphSource`](../interfaces/FontGlyphSource.md)

## Constructors

### Constructor

> **new BitmapFontGlyphSource**(`font`, `asset`): `BitmapFontGlyphSource`

Defined in: [core/src/arena/BitmapFontGlyphSource.ts:28](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/BitmapFontGlyphSource.ts#L28)

#### Parameters

##### font

[`ParsedBitmapFont`](../interfaces/ParsedBitmapFont.md)

##### asset

[`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

#### Returns

`BitmapFontGlyphSource`

## Properties

### layerIndex

> `readonly` **layerIndex**: `number`

Defined in: [core/src/arena/BitmapFontGlyphSource.ts:21](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/BitmapFontGlyphSource.ts#L21)

ページ画像の GPU レイヤーインデックス。0 は白 1 ピクセル相当。

#### Implementation of

[`FontGlyphSource`](../interfaces/FontGlyphSource.md).[`layerIndex`](../interfaces/FontGlyphSource.md#layerindex)

## Methods

### lookup()

> **lookup**(`charCode`, `outUv`): `number`

Defined in: [core/src/arena/BitmapFontGlyphSource.ts:71](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/BitmapFontGlyphSource.ts#L71)

文字コードから UV (outUv の 0〜3) と前進幅 (fontSize 単位) を返します。

未知の文字は前進幅 0 を返します（Phaser と同じ挙動）。

#### Parameters

##### charCode

`number`

##### outUv

`Float32Array`

#### Returns

`number`

#### Implementation of

[`FontGlyphSource`](../interfaces/FontGlyphSource.md).[`lookup`](../interfaces/FontGlyphSource.md#lookup)
