[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [renderer/src](../README.md) / InstanceBufferSpec

# Interface: InstanceBufferSpec

Defined in: [renderer/src/InstanceLayout.ts:173](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/InstanceLayout.ts#L173)

インスタンス用バッファ 1 本の仕様

## Properties

### arrayName

> `readonly` **arrayName**: `"packedTransform"` \| `"packedUv"` \| `"packedFlags"` \| `"packedShape"` \| `"packedTint"` \| `"packedOrigin"` \| `"packedExt"`

Defined in: [renderer/src/InstanceLayout.ts:177](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/InstanceLayout.ts#L177)

アリーナ側のミラー配列（Float32Array か Uint32Array）

***

### eager

> `readonly` **eager**: `boolean`

Defined in: [renderer/src/InstanceLayout.ts:196](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/InstanceLayout.ts#L196)

true なら初期化時に必ず確保する、false なら利用者が求めるまで未確保

***

### format

> `readonly` **format**: `"float32x4"` \| `"unorm8x4"`

Defined in: [renderer/src/InstanceLayout.ts:194](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/InstanceLayout.ts#L194)

WebGPU の `GPUVertexFormat`

***

### location

> `readonly` **location**: `number`

Defined in: [renderer/src/InstanceLayout.ts:190](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/InstanceLayout.ts#L190)

WebGL2 で使用する `location` の開始番号

***

### name

> `readonly` **name**: `string`

Defined in: [renderer/src/InstanceLayout.ts:175](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/InstanceLayout.ts#L175)

GPU バッファ名。`PlutoEngine` が `gpuBuffers` のキーとして使います

***

### slot

> `readonly` **slot**: `number`

Defined in: [renderer/src/InstanceLayout.ts:192](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/InstanceLayout.ts#L192)

WebGPU の `setVertexBuffer` スロット番号（0 は共有 Quad 予約）

***

### stride

> `readonly` **stride**: `number`

Defined in: [renderer/src/InstanceLayout.ts:186](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/InstanceLayout.ts#L186)

1 インスタンスあたりのバイト数（WebGL2 の stride / WebGPU の arrayStride）

***

### vectors

> `readonly` **vectors**: `number`

Defined in: [renderer/src/InstanceLayout.ts:188](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/InstanceLayout.ts#L188)

このバッファが持つ `vec4` の個数
