[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [renderer/src](../README.md) / createGraphicsDevice

# Function: createGraphicsDevice()

> **createGraphicsDevice**(`canvas`, `options?`): `Promise`\<[`GraphicsDevice`](../interfaces/GraphicsDevice.md)\>

Defined in: [renderer/src/index.ts:52](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/index.ts#L52)

GraphicsDevice を生成します。

'auto' の場合は WebGPU を優先し、初期化に失敗したら WebGL2 へ自動的に
フォールバックします。'webgpu' を明示した場合はフォールバックしません
(呼び出し側で制御できます)。

## Parameters

### canvas

`HTMLCanvasElement`

### options?

[`CreateDeviceOptions`](../interfaces/CreateDeviceOptions.md) = `{}`

## Returns

`Promise`\<[`GraphicsDevice`](../interfaces/GraphicsDevice.md)\>
