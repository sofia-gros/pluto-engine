[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [renderer/src](../README.md) / FilterDef

# Interface: FilterDef

Defined in: [renderer/src/filters/types.ts:47](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/renderer/src/filters/types.ts#L47)

1 つのフィルタ。

複数パス（ぼかしの水平/垂直など）は `passCount` で表します。

## Properties

### key

> `readonly` **key**: `string`

Defined in: [renderer/src/filters/types.ts:49](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/renderer/src/filters/types.ts#L49)

安定識別子（保存 / セーブデータからの復元用）

***

### name

> `readonly` **name**: `string`

Defined in: [renderer/src/filters/types.ts:51](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/renderer/src/filters/types.ts#L51)

表示名

***

### passCount

> `readonly` **passCount**: `number`

Defined in: [renderer/src/filters/types.ts:53](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/renderer/src/filters/types.ts#L53)

1 フレームあたりのパス数

***

### webgpuOnly

> `readonly` **webgpuOnly**: `boolean`

Defined in: [renderer/src/filters/types.ts:55](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/renderer/src/filters/types.ts#L55)

WebGPU のみサポートされるか（WebGL2 では無視される）

## Methods

### passSamplesSource()

> **passSamplesSource**(`passIndex`): `boolean`

Defined in: [renderer/src/filters/types.ts:62](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/renderer/src/filters/types.ts#L62)

pass 番号が source を読むか

#### Parameters

##### passIndex

`number`

#### Returns

`boolean`

***

### uniform()

> **uniform**(`passIndex`): `Float32Array`

Defined in: [renderer/src/filters/types.ts:58](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/renderer/src/filters/types.ts#L58)

pass 番号の uniform 配列（構築時に確保済み）

#### Parameters

##### passIndex

`number`

#### Returns

`Float32Array`

***

### wgsl()

> **wgsl**(`passIndex`): `string`

Defined in: [renderer/src/filters/types.ts:60](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/renderer/src/filters/types.ts#L60)

pass 番号の WGSL（毎回同じ文字列を返してよい）

#### Parameters

##### passIndex

`number`

#### Returns

`string`
