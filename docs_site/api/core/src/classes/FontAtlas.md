[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / FontAtlas

# Class: FontAtlas

Defined in: [core/src/text/FontAtlas.ts:32](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/text/FontAtlas.ts#L32)

## Constructors

### Constructor

> **new FontAtlas**(`device`, `key`, `options?`): `FontAtlas`

Defined in: [core/src/text/FontAtlas.ts:53](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/text/FontAtlas.ts#L53)

#### Parameters

##### device

###### uploadTexture

(`key`, `source`) => `unknown`

##### key

`string`

##### options?

[`FontAtlasOptions`](../interfaces/FontAtlasOptions.md) = `{}`

#### Returns

`FontAtlas`

## Properties

### canvas

> `readonly` **canvas**: `HTMLCanvasElement`

Defined in: [core/src/text/FontAtlas.ts:171](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/text/FontAtlas.ts#L171)

生成元の Canvas (読み取り専用)

***

### cellHeight

> `readonly` **cellHeight**: `number`

Defined in: [core/src/text/FontAtlas.ts:39](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/text/FontAtlas.ts#L39)

***

### cellWidth

> `readonly` **cellWidth**: `number`

Defined in: [core/src/text/FontAtlas.ts:38](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/text/FontAtlas.ts#L38)

1 グリフあたりの UV 幅・高さ (0-1)

***

### fontSize

> `readonly` **fontSize**: `number`

Defined in: [core/src/text/FontAtlas.ts:41](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/text/FontAtlas.ts#L41)

基準となる fontSize (前進幅の計算に使う)

***

### glyphCount

> `readonly` **glyphCount**: `number`

Defined in: [core/src/text/FontAtlas.ts:36](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/text/FontAtlas.ts#L36)

グリフの数

***

### layerIndex

> `readonly` **layerIndex**: `number`

Defined in: [core/src/text/FontAtlas.ts:34](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/text/FontAtlas.ts#L34)

GPU Texture2DArray のレイヤーインデックス

## Methods

### advanceOf()

> **advanceOf**(`charCode`): `number`

Defined in: [core/src/text/FontAtlas.ts:195](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/text/FontAtlas.ts#L195)

文字コードに対応する前進幅 (fontSize 単位)

#### Parameters

##### charCode

`number`

#### Returns

`number`

***

### lookup()

> **lookup**(`charCode`, `outUv`): `number`

Defined in: [core/src/text/FontAtlas.ts:177](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/text/FontAtlas.ts#L177)

文字コードに対応する UV を outUv へ書き込み、前進幅を返します。
Text 側の FontGlyphSource 契約と同一です。

#### Parameters

##### charCode

`number`

##### outUv

`Float32Array`

#### Returns

`number`

***

### pixelAdvanceOf()

> **pixelAdvanceOf**(`charCode`): `number`

Defined in: [core/src/text/FontAtlas.ts:202](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/text/FontAtlas.ts#L202)

アトラス分解能でのグリフ幅 (レイアウト計算用)

#### Parameters

##### charCode

`number`

#### Returns

`number`
