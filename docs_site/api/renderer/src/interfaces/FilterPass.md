[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [renderer/src](../README.md) / FilterPass

# Interface: FilterPass

Defined in: [renderer/src/filters/types.ts:26](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/filters/types.ts#L26)

1 パスの定義。uniform は事前確保済みで、毎フレームは書き換えのみ。

## Properties

### samplesSource

> `readonly` **samplesSource**: `boolean`

Defined in: [renderer/src/filters/types.ts:39](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/filters/types.ts#L39)

このパスが source テクスチャを読むか（false なら黒で塗りつぶす）

***

### uniforms

> `readonly` **uniforms**: `Float32Array`

Defined in: [renderer/src/filters/types.ts:37](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/filters/types.ts#L37)

uniform データ（`vec4` 単位・16 バイト境界）

***

### wgsl

> `readonly` **wgsl**: `string`

Defined in: [renderer/src/filters/types.ts:35](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/filters/types.ts#L35)

フルスクリーン三角形を描画する WGSL。

入口点は `fs_main` 固定、頂点シェーダは共有の
`fullscreen.ts` が fourni します。fragment 側は
`@group(0) @binding(0)` にSampler、`@binding(1)` に
source テクスチャ、`@binding(2)` に uniform を受け取ります。
