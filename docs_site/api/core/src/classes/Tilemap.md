[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Tilemap

# Class: Tilemap

Defined in: [core/src/tilemap/Tilemap.ts:36](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L36)

## Constructors

### Constructor

> **new Tilemap**(`arena`, `mapData`, `tileSize?`): `Tilemap`

Defined in: [core/src/tilemap/Tilemap.ts:222](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L222)

#### Parameters

##### arena

[`InstanceBufferArena`](InstanceBufferArena.md)

##### mapData

[`TiledJSON`](../interfaces/TiledJSON.md) \| `number`[][]

##### tileSize?

`number`

#### Returns

`Tilemap`

## Properties

### mapHeight

> **mapHeight**: `number`

Defined in: [core/src/tilemap/Tilemap.ts:39](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L39)

***

### mapWidth

> **mapWidth**: `number`

Defined in: [core/src/tilemap/Tilemap.ts:38](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L38)

***

### tileSize

> **tileSize**: `number`

Defined in: [core/src/tilemap/Tilemap.ts:40](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L40)

## Accessors

### cellsPerLayer

#### Get Signature

> **get** **cellsPerLayer**(): `number`

Defined in: [core/src/tilemap/Tilemap.ts:343](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L343)

1 レイヤあたりのセル数

##### Returns

`number`

***

### layerCount

#### Get Signature

> **get** **layerCount**(): `number`

Defined in: [core/src/tilemap/Tilemap.ts:311](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L311)

レイヤー数

##### Returns

`number`

## Methods

### createBlankLayer()

> **createBlankLayer**(): [`TilemapLayer`](TilemapLayer.md)

Defined in: [core/src/tilemap/Tilemap.ts:69](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L69)

空のレイヤーを生成します (Phaser 互換の `createBlankLayer`)。

生成直後は全セルが 0 (空き) です。gid を書き込むには
[setTileAt](#settileat) を使ってください。

#### Returns

[`TilemapLayer`](TilemapLayer.md)

TilemapLayer ハンドル。上限に達した場合は null

***

### createLayer()

> **createLayer**(`index`, `_layerName?`, `_tileset?`): [`TilemapLayer`](TilemapLayer.md)

Defined in: [core/src/tilemap/Tilemap.ts:97](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L97)

Tiled JSON のレイヤー指定から TilemapLayer を作成します
(Phaser 互換の `createLayer`)。

本クラスはコンストラクタで全 tilelayer を読み込むため、
このメソッドは**既存のレイヤーインデックス指定**という
Phaser 互換シグネチャを Provides します。存在しない index なら null を返します。

#### Parameters

##### index

`number`

レイヤーインデックス。`layerName` を指定した場合は無視されます

##### \_layerName?

`string`

未使用（名前引きは本クラスのスコープ外）

##### \_tileset?

`string`

未使用（タイルセットはコンストラクタで確定済み）

#### Returns

[`TilemapLayer`](TilemapLayer.md)

***

### destroy()

> **destroy**(): `void`

Defined in: [core/src/tilemap/Tilemap.ts:576](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L576)

#### Returns

`void`

***

### findTile()

> **findTile**(`layerIndex`, `tileX`, `tileY`): `number`

Defined in: [core/src/tilemap/Tilemap.ts:370](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L370)

指定タイル座標の gid を返します (Phaser 互換の `index`)。

`findTileAt` はピクセル座標、本メソッドはタイル座標です。

#### Parameters

##### layerIndex

`number`

##### tileX

`number`

##### tileY

`number`

#### Returns

`number`

gid。範囲外なら -1

***

### findTileAt()

> **findTileAt**(`layerIndex`, `px`, `py`): `number`

Defined in: [core/src/tilemap/Tilemap.ts:125](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L125)

ワールド座標 (`px, py`) にあるタイルの gid を返します
(Phaser 互換の `findTileAt`)。

`getTileIndexAt` と違い、**ピクセル座標**で引きます。

#### Parameters

##### layerIndex

`number`

##### px

`number`

##### py

`number`

#### Returns

`number`

gid。範囲外または空きタイルなら -1

***

### getFlatTiles()

> **getFlatTiles**(): `Int32Array`

Defined in: [core/src/tilemap/Tilemap.ts:338](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L338)

レイヤーのタイル参照配列 (layerIndex * cellCount + mapIndex -> tileIndex)

#### Returns

`Int32Array`

***

### getLayer()

> **getLayer**(`index`): [`TilemapLayer`](TilemapLayer.md)

Defined in: [core/src/tilemap/Tilemap.ts:319](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L319)

TilemapLayer ハンドル (Phaser 互換の `tilemap.getLayerIndex` 系) を取得します。
キャッシュするため、同じインデックスなら毎回同じインスタンスを返します。

#### Parameters

##### index

`number`

#### Returns

[`TilemapLayer`](TilemapLayer.md)

***

### getLayerScrollX()

> **getLayerScrollX**(`index`): `number`

Defined in: [core/src/tilemap/Tilemap.ts:348](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L348)

バーのオフセット X

#### Parameters

##### index

`number`

#### Returns

`number`

***

### getLayerScrollY()

> **getLayerScrollY**(`index`): `number`

Defined in: [core/src/tilemap/Tilemap.ts:353](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L353)

レイヤーのオフセット Y

#### Parameters

##### index

`number`

#### Returns

`number`

***

### getTileIndexAt()

> **getTileIndexAt**(`layerIndex`, `tileX`, `tileY`): `number`

Defined in: [core/src/tilemap/Tilemap.ts:426](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L426)

指定タイルの gid を返します。範囲外なら 0。

#### Parameters

##### layerIndex

`number`

##### tileX

`number`

##### tileY

`number`

#### Returns

`number`

***

### getTilesWithinWorldXY()

> **getTilesWithinWorldXY**(`out`, `layerIndex`, `x`, `y`, `width`, `height`): `number`

Defined in: [core/src/tilemap/Tilemap.ts:152](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L152)

ワールド矩形内に収まるタイルの gid を `out` へ書き込みます
(Phaser 互換の `getTilesWithinWorldXY`)。

ホットパスで呼ばれるため、戻り値の配列は生成しません。
呼び出し側は `out` を使い回してください。

#### Parameters

##### out

`Int32Array`

書き込み先バッファ

##### layerIndex

`number`

レイヤーインデックス

##### x

`number`

ワールド X

##### y

`number`

ワールド Y

##### width

`number`

ワールド幅 (px)

##### height

`number`

ワールド高 (px)

#### Returns

`number`

書き出したタイル数

***

### gidToFrame()

> **gidToFrame**(`gid`): `number`

Defined in: [core/src/tilemap/Tilemap.ts:440](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L440)

gid を UV グリッドのフレーム番号へ変換します。

Tiled の gid は `firstgid + フレーム番号` です。

#### Parameters

##### gid

`number`

#### Returns

`number`

フレーム番号。解決できない場合は -1

***

### hasCollisionAt()

> **hasCollisionAt**(`layerIndex`, `tileX`, `tileY`): `boolean`

Defined in: [core/src/tilemap/Tilemap.ts:415](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L415)

指定タイル座標に衝突があるか (SoA を O(1) で参照)。

#### Parameters

##### layerIndex

`number`

##### tileX

`number`

##### tileY

`number`

#### Returns

`boolean`

***

### isLayerValid()

> **isLayerValid**(`index`): `boolean`

Defined in: [core/src/tilemap/Tilemap.ts:333](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L333)

レイヤーが存在するか

#### Parameters

##### index

`number`

#### Returns

`boolean`

***

### setCollisionByIndex()

> **setCollisionByIndex**(`index`, `collides`): `number`

Defined in: [core/src/tilemap/Tilemap.ts:379](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L379)

指定 gid のタイルに衝突フラグを立てます (Phaser 互換の `setCollisionByIndex`)。

#### Parameters

##### index

`number`

##### collides

`boolean`

#### Returns

`number`

設定したタイル数

***

### setLayerPosition()

> **setLayerPosition**(`index`, `x`, `y`): `void`

Defined in: [core/src/tilemap/Tilemap.ts:358](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L358)

レイヤーのオフセットを設定します (Phaser 互換の `setPosition`)

#### Parameters

##### index

`number`

##### x

`number`

##### y

`number`

#### Returns

`void`

***

### setTileAt()

> **setTileAt**(`layerIndex`, `tileX`, `tileY`, `gid`): `boolean`

Defined in: [core/src/tilemap/Tilemap.ts:106](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L106)

指定タイル座標に gid を書き込みます (Phaser 互換の `putTileAt`)。

#### Parameters

##### layerIndex

`number`

##### tileX

`number`

##### tileY

`number`

##### gid

`number`

#### Returns

`boolean`

書き込みに成功したか（範囲外なら false）

***

### setTileGrid()

> **setTileGrid**(`cols`, `rows`): `void`

Defined in: [core/src/tilemap/Tilemap.ts:305](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L305)

UV グリッドの列数・行数を明示的に設定します。
Tiled JSON に `columns` が無い場合に使います。

#### Parameters

##### cols

`number`

##### rows

`number`

#### Returns

`void`

***

### updateCulling()

> **updateCulling**(`camera`, `screenWidth`, `screenHeight`, `buffer?`): `void`

Defined in: [core/src/tilemap/Tilemap.ts:461](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tilemap/Tilemap.ts#L461)

カメラの可視範囲外のタイルのIDを解放し、可視範囲内のタイルをアロケートします。

#### Parameters

##### camera

[`Camera`](Camera.md)

##### screenWidth

`number`

##### screenHeight

`number`

##### buffer?

`number` = `1`

#### Returns

`void`
