[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / TiledJSON

# Interface: TiledJSON

Defined in: [core/src/tilemap/Tilemap.ts:5](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L5)

## Properties

### height

> **height**: `number`

Defined in: [core/src/tilemap/Tilemap.ts:7](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L7)

***

### layers

> **layers**: `object`[]

Defined in: [core/src/tilemap/Tilemap.ts:10](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L10)

#### data

> **data**: `number`[]

#### opacity

> **opacity**: `number`

#### type

> **type**: `string`

#### visible

> **visible**: `boolean`

#### x

> **x**: `number`

#### y

> **y**: `number`

***

### objectlayers?

> `optional` **objectlayers?**: `object`[]

Defined in: [core/src/tilemap/Tilemap.ts:29](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L29)

Tiled の collision layers (オブジェクト图层)

#### name

> **name**: `string`

#### objects?

> `optional` **objects?**: `object`[]

#### visible

> **visible**: `boolean`

***

### tileheight

> **tileheight**: `number`

Defined in: [core/src/tilemap/Tilemap.ts:9](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L9)

***

### tilesets

> **tilesets**: `object`[]

Defined in: [core/src/tilemap/Tilemap.ts:18](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L18)

#### columns?

> `optional` **columns?**: `number`

1 タイルに収まるフレーム数 (縦方向)。未指定は 1 とみなします

#### count?

> `optional` **count?**: `number`

#### firstgid

> **firstgid**: `number`

#### image

> **image**: `string`

#### name

> **name**: `string`

#### tileheight

> **tileheight**: `number`

#### tilewidth

> **tilewidth**: `number`

***

### tilewidth

> **tilewidth**: `number`

Defined in: [core/src/tilemap/Tilemap.ts:8](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L8)

***

### width

> **width**: `number`

Defined in: [core/src/tilemap/Tilemap.ts:6](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L6)
