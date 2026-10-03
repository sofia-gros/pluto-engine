[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / EngineConfig

# Interface: EngineConfig

Defined in: [core/src/core/PlutoEngine.ts:33](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L33)

## Properties

### autoCenter?

> `optional` **autoCenter?**: `boolean`

Defined in: [core/src/core/PlutoEngine.ts:39](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L39)

***

### backend?

> `optional` **backend?**: `"webgpu"` \| `"webgl2"` \| `"auto"`

Defined in: [core/src/core/PlutoEngine.ts:46](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L46)

描画バックエンドの選択。
'auto' (既定) は WebGPU を試し、失敗したら WebGL2 へ落ちます。

***

### canvas?

> `optional` **canvas?**: `string` \| `HTMLCanvasElement`

Defined in: [core/src/core/PlutoEngine.ts:34](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L34)

***

### cpuOnly?

> `optional` **cpuOnly?**: `boolean`

Defined in: [core/src/core/PlutoEngine.ts:54](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L54)

CPU 系列的ベンチ用。true のとき clear / 転送 / draw をすべてスキップし、
シーン更新とカリングだけを走らせます。

要件2（WebGPU > WebGL > CPU）の CPU 基準を測るためのモードです。
通常のゲームでは指定しないでください。

***

### externalFilters?

> `optional` **externalFilters?**: readonly [`FilterDef`](../../../renderer/src/interfaces/FilterDef.md)[]

Defined in: [core/src/core/PlutoEngine.ts:103](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L103)

外部フィルタ列 (`filters.external`)。

`filters` の後に同じ順序で適用されます。WebGPU のみ対応です。

***

### filters?

> `optional` **filters?**: readonly [`FilterDef`](../../../renderer/src/interfaces/FilterDef.md)[]

Defined in: [core/src/core/PlutoEngine.ts:96](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L96)

シーン全体にかかるフィルタ列 (`filters.internal`)。

例: `[filters.internal.vignette()]`

**既定は空**です（未検証経路を描画に載せないため）。
Filter を 1 個でも入れると描画は offscreen → filter → canvas の
多重パスになります。WebGL2 など Filter 非対応のバックエンドでは
自動的に無視され、従来どおり直接描画します。

フィルタのインスタンスは毎フレーム `new` しないでください。
この設定は 1 度だけ呼びます。

***

### fps?

> `optional` **fps?**: [`FpsConfig`](FpsConfig.md)

Defined in: [core/src/core/PlutoEngine.ts:41](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L41)

***

### gpuComputeCulling?

> `optional` **gpuComputeCulling?**: `boolean`

Defined in: [core/src/core/PlutoEngine.ts:81](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L81)

compute カリング + 間接描画を有効にします (Phase 8 P-02、既定は false)。

頂点シェーダ GPU カリング（P-03）と違い、可視インスタンスだけを
描画します。CPU コストが切れた上に GPU 側も減ります。
WebGPU のみ対応で、compute と indirect draw を使います。

***

### gpuCulling?

> `optional` **gpuCulling?**: `boolean`

Defined in: [core/src/core/PlutoEngine.ts:66](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L66)

GPU カリングを有効にします（Phase 8 P-03、既定は false）。

有効にすると頂点シェーダが可視矩形の外にあるクワッドを
縮退三角形にして破棄し、CPU 側の SoA 詰め替えを省きます。
`GraphicsDevice.setCullRect` を実装していないバックエンドでは
自動的に無効になります。

**複数カメラを同時に描く場合は無効になります。** 可視矩形を
uniform 1 本でしか渡せないためです。

***

### gpuTimestampQuery?

> `optional` **gpuTimestampQuery?**: `boolean`

Defined in: [core/src/core/PlutoEngine.ts:73](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L73)

WebGPU の timestamp query を有効化します (Phase 8 P-02、既定は false)。

**読み出しが値を返さない既知の問題**があります
（IMPACT_SCOPE.md の 9.3）。診断用にのみ使う想定です。

***

### height?

> `optional` **height?**: `number`

Defined in: [core/src/core/PlutoEngine.ts:36](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L36)

***

### maxInstances?

> `optional` **maxInstances?**: `number`

Defined in: [core/src/core/PlutoEngine.ts:40](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L40)

***

### pixelArt?

> `optional` **pixelArt?**: `boolean`

Defined in: [core/src/core/PlutoEngine.ts:38](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L38)

***

### scaleMode?

> `optional` **scaleMode?**: [`ScaleMode`](../enumerations/ScaleMode.md)

Defined in: [core/src/core/PlutoEngine.ts:37](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L37)

***

### scene

> **scene**: () => [`Scene`](../classes/Scene.md)[]

Defined in: [core/src/core/PlutoEngine.ts:105](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L105)

#### Returns

[`Scene`](../classes/Scene.md)

***

### width?

> `optional` **width?**: `number`

Defined in: [core/src/core/PlutoEngine.ts:35](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L35)
