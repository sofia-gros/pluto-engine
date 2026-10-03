[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / ParsedAtlas

# Interface: ParsedAtlas

Defined in: [core/src/loader/AtlasParser.ts:11](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/loader/AtlasParser.ts#L11)

解析結果。矩形と名前表の 2 つを持ちます。

## Properties

### frameNames

> **frameNames**: `Map`\<`string`, `number`\>

Defined in: [core/src/loader/AtlasParser.ts:24](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/loader/AtlasParser.ts#L24)

フレーム名 → フレーム番号の対応表。

エンジンはフレームを整数で参照するため、この表は
「TexturePacker のどの名がどの番号になるか」を調べるための補助情報です。
`this.load.get(key).frameNames` から参照できます。

***

### frames

> **frames**: `object`[]

Defined in: [core/src/loader/AtlasParser.ts:16](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/loader/AtlasParser.ts#L16)

フレーム矩形 (ピクセル)。配列順がそのままフレーム番号になります。
`Sprite.setFrame()` にはこの添字を渡します。

#### h

> **h**: `number`

#### w

> **w**: `number`

#### x

> **x**: `number`

#### y

> **y**: `number`

***

### imagePath

> **imagePath**: `string`

Defined in: [core/src/loader/AtlasParser.ts:26](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/loader/AtlasParser.ts#L26)

アトラス画像のパス。textureURL が無ければ JSON の meta.image を使います。
