[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / AtlasConfig

# Interface: AtlasConfig

Defined in: [core/src/loader/LoaderManager.ts:48](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/loader/LoaderManager.ts#L48)

`atlas` の設定。省略時は JSON の meta から補います。

## Properties

### basePath?

> `optional` **basePath?**: `boolean`

Defined in: [core/src/loader/LoaderManager.ts:52](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/loader/LoaderManager.ts#L52)

JSON の meta.image を設定ファイルの位置を基準に解決するか (既定 true)

***

### textureURL?

> `optional` **textureURL?**: `string`

Defined in: [core/src/loader/LoaderManager.ts:50](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/loader/LoaderManager.ts#L50)

アトラス画像の実パス。省略時は JSON の meta.image を使います。
