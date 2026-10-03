[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [renderer/src](../README.md) / CreateDeviceOptions

# Interface: CreateDeviceOptions

Defined in: [renderer/src/index.ts:17](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/renderer/src/index.ts#L17)

## Properties

### backend?

> `optional` **backend?**: `"webgpu"` \| `"webgl2"` \| `"auto"`

Defined in: [renderer/src/index.ts:19](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/renderer/src/index.ts#L19)

'auto' (既定) は WebGPU を試し失敗時 WebGL2 へ落ちます

***

### computeCulling?

> `optional` **computeCulling?**: `boolean`

Defined in: [renderer/src/index.ts:42](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/renderer/src/index.ts#L42)

compute カリング（間接描画）を有効化します (Phase 8 P-02、既定は false)。

頂点シェーダ GPU カリング（P-03）とは別物で、可視インスタンスだけを
描画します。WebGPU の compute と indirect draw を使います。

ストレージバッファを compute stage で 4 本使うため
`maxStorageBuffersPerShaderStage < 4` の環境では自動的に無効になります。

***

### timestampQuery?

> `optional` **timestampQuery?**: `boolean`

Defined in: [renderer/src/index.ts:32](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/renderer/src/index.ts#L32)

WebGPU の timestamp query を有効化します (Phase 8 P-02)。

feature を `requestDevice` 時に要求する必要があるため、
デバイス生成前に指定しなければなりません。

**読み出しが値を返さない既知の問題があるため既定は false** です。
有効化しても描画は壊れません（タイムスタンプが計測されないだけ）。
詳細は IMPACT_SCOPE.md の 9.3 を参照してください。

***

### warnOnFallback?

> `optional` **warnOnFallback?**: `boolean`

Defined in: [renderer/src/index.ts:21](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/renderer/src/index.ts#L21)

フォールバック時に警告を出します
