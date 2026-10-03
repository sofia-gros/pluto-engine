[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [renderer/src](../README.md) / TextureUploadOptions

# Interface: TextureUploadOptions

Defined in: [renderer/src/GraphicsDevice.ts:34](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L34)

## Properties

### frameHeight?

> `optional` **frameHeight?**: `number`

Defined in: [renderer/src/GraphicsDevice.ts:36](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L36)

***

### frames?

> `optional` **frames?**: `object`[]

Defined in: [renderer/src/GraphicsDevice.ts:43](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L43)

明示的なフレーム矩形 (ピクセル単位)。

指定すると、frameWidth / frameHeight による均一グリッドの自動計算を
飛ばしてこの配列をそのまま使います。TexturePacker のアトラス用です。

#### h

> **h**: `number`

#### w

> **w**: `number`

#### x

> **x**: `number`

#### y

> **y**: `number`

***

### frameWidth?

> `optional` **frameWidth?**: `number`

Defined in: [renderer/src/GraphicsDevice.ts:35](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L35)
