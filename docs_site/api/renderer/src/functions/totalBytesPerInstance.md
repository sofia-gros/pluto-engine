[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [renderer/src](../README.md) / totalBytesPerInstance

# Function: totalBytesPerInstance()

> **totalBytesPerInstance**(`includeExt?`): `number`

Defined in: [renderer/src/InstanceLayout.ts:305](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/InstanceLayout.ts#L305)

1 インスタンスあたりの転送バイト数（拡張枠を含む）。

`stride` が既に「1 インスタンスあたりのバイト数」なので、
`vectors` を掛けてはいけません（拡張枠は stride 64 に vec4 x 4 が入っているため）。

## Parameters

### includeExt?

`boolean` = `false`

## Returns

`number`
