[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / TilemapLayer

# Class: TilemapLayer

Defined in: [core/src/tilemap/TilemapLayer.ts:15](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L15)

## Constructors

### Constructor

> **new TilemapLayer**(`index`, `map`): `TilemapLayer`

Defined in: [core/src/tilemap/TilemapLayer.ts:21](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L21)

#### Parameters

##### index

`number`

##### map

[`Tilemap`](Tilemap.md)

#### Returns

`TilemapLayer`

## Properties

### index

> `readonly` **index**: `number`

Defined in: [core/src/tilemap/TilemapLayer.ts:17](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L17)

Tilemap 内のレイヤーインデックス

## Accessors

### isValid

#### Get Signature

> **get** **isValid**(): `boolean`

Defined in: [core/src/tilemap/TilemapLayer.ts:27](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L27)

レイヤーが有効か

##### Returns

`boolean`

***

### scrollX

#### Get Signature

> **get** **scrollX**(): `number`

Defined in: [core/src/tilemap/TilemapLayer.ts:32](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L32)

レイヤーのオフセット X

##### Returns

`number`

***

### scrollY

#### Get Signature

> **get** **scrollY**(): `number`

Defined in: [core/src/tilemap/TilemapLayer.ts:37](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L37)

レイヤーのオフセット Y

##### Returns

`number`

***

### tileCount

#### Get Signature

> **get** **tileCount**(): `number`

Defined in: [core/src/tilemap/TilemapLayer.ts:147](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L147)

このレイヤーに存在するタイル数 (デバッグ・統計用)

##### Returns

`number`

***

### visible

#### Get Signature

> **get** **visible**(): `boolean`

Defined in: [core/src/tilemap/TilemapLayer.ts:42](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L42)

レイヤーの表示状態 (0 = 描画しない)

##### Returns

`boolean`

#### Set Signature

> **set** **visible**(`_v`): `void`

Defined in: [core/src/tilemap/TilemapLayer.ts:46](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L46)

##### Parameters

###### \_v

`boolean`

##### Returns

`void`

## Methods

### collides()

> **collides**(`tileX`, `tileY`): `boolean`

Defined in: [core/src/tilemap/TilemapLayer.ts:129](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L129)

指定タイル座標が衝突タイルか

#### Parameters

##### tileX

`number`

##### tileY

`number`

#### Returns

`boolean`

***

### destroy()

> **destroy**(): `this`

Defined in: [core/src/tilemap/TilemapLayer.ts:163](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L163)

レイヤーを破棄します (Phaser 互換の `destroy`)。

Tilemap 全体の破棄は Tilemap.destroy() で行います。
ここではこのレイヤーへの参照を破棄します。

#### Returns

`this`

***

### findTileAt()

> **findTileAt**(`px`, `py`): `number`

Defined in: [core/src/tilemap/TilemapLayer.ts:97](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L97)

ワールド座標 (`px, py`) にあるタイルの gid を返します
(Phaser 互換の `findTileAt`)。

`tileIndex()` はタイル座標、本メソッドはピクセル座標です。

#### Parameters

##### px

`number`

##### py

`number`

#### Returns

`number`

gid。範囲外または空きタイルなら -1

***

### getBounds()

> **getBounds**(`out?`): `Float32Array`

Defined in: [core/src/tilemap/TilemapLayer.ts:138](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L138)

レイヤー全体の矩形を `out` バッファに書き出します (Phaser 互換の `getBounds`)。

#### Parameters

##### out?

`Float32Array` = `RECT`

4 要素以上 (x, y, width, height)

#### Returns

`Float32Array`

***

### getTilesWithinWorldXY()

> **getTilesWithinWorldXY**(`out`, `x`, `y`, `width`, `height`): `number`

Defined in: [core/src/tilemap/TilemapLayer.ts:109](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L109)

ワールド矩形内のタイル gid を `out` へ書き込みます
(Phaser 互換の `getTilesWithinWorldXY`)。

ホットパスでは `out` を呼び出し側で使い回してください。

#### Parameters

##### out

`Int32Array`

##### x

`number`

##### y

`number`

##### width

`number`

##### height

`number`

#### Returns

`number`

書き出したタイル数

***

### putTileAt()

> **putTileAt**(`tileX`, `tileY`, `gid`): `boolean`

Defined in: [core/src/tilemap/TilemapLayer.ts:124](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L124)

指定タイル座標に gid を書き込みます (Phaser 互換の `putTileAt`)。

#### Parameters

##### tileX

`number`

##### tileY

`number`

##### gid

`number`

#### Returns

`boolean`

書き込みに成功したか

***

### setCollision()

> **setCollision**(`tiles`, `collides?`): `number`

Defined in: [core/src/tilemap/TilemapLayer.ts:72](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L72)

指定 gid のタイル群をまとめて衝突tiles に指定します (Phaser 互換の `setCollision`)。
(Phaser 互換の `setCollision`)。

#### Parameters

##### tiles

`number`[]

##### collides?

`boolean` = `true`

#### Returns

`number`

設定したタイル数

***

### setCollisionByIndex()

> **setCollisionByIndex**(`tileIndex`, `collides`): `number`

Defined in: [core/src/tilemap/TilemapLayer.ts:63](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L63)

指定 gid のタイルを衝突tiles に指定します (Phaser 互換の `setCollisionByIndex`)。

#### Parameters

##### tileIndex

`number`

##### collides

`boolean`

#### Returns

`number`

設定したタイル数

***

### setPosition()

> **setPosition**(`x`, `y`): `this`

Defined in: [core/src/tilemap/TilemapLayer.ts:54](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L54)

レイヤーのオフセットを設定します (Phaser 互換の `setPosition`)。

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`this`

***

### tileIndex()

> **tileIndex**(`tileX`, `tileY`): `number`

Defined in: [core/src/tilemap/TilemapLayer.ts:85](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tilemap/TilemapLayer.ts#L85)

指定タイル座標の gid を返します (Phaser 互換の `index`)。

フィールド `index` と同名になるため `tileIndex` として命名しています。

#### Parameters

##### tileX

`number`

##### tileY

`number`

#### Returns

`number`
