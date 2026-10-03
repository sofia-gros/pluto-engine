[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [pluto/src](../README.md) / SDFCollider

# Class: SDFCollider

Defined in: [sdf-collider/src/SDFCollider.ts:27](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFCollider.ts#L27)

## Constructors

### Constructor

> **new SDFCollider**(`width`, `height`, `resolution`, `initialData?`): `SDFCollider`

Defined in: [sdf-collider/src/SDFCollider.ts:34](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFCollider.ts#L34)

#### Parameters

##### width

`number`

##### height

`number`

##### resolution

`number`

##### initialData?

`Float32Array`

#### Returns

`SDFCollider`

## Accessors

### gridHeight

#### Get Signature

> **get** **gridHeight**(): `number`

Defined in: [sdf-collider/src/SDFCollider.ts:57](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFCollider.ts#L57)

##### Returns

`number`

***

### gridWidth

#### Get Signature

> **get** **gridWidth**(): `number`

Defined in: [sdf-collider/src/SDFCollider.ts:53](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFCollider.ts#L53)

##### Returns

`number`

***

### raw

#### Get Signature

> **get** **raw**(): `Float32Array`

Defined in: [sdf-collider/src/SDFCollider.ts:70](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFCollider.ts#L70)

生データ (読み取り専用用途)

##### Returns

`Float32Array`

***

### worldHeight

#### Get Signature

> **get** **worldHeight**(): `number`

Defined in: [sdf-collider/src/SDFCollider.ts:65](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFCollider.ts#L65)

##### Returns

`number`

***

### worldWidth

#### Get Signature

> **get** **worldWidth**(): `number`

Defined in: [sdf-collider/src/SDFCollider.ts:61](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFCollider.ts#L61)

##### Returns

`number`

## Methods

### distanceAt()

> **distanceAt**(`x`, `y`): `number`

Defined in: [sdf-collider/src/SDFCollider.ts:137](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFCollider.ts#L137)

距離だけを求める軽量版です。法線が必要ない場面向け。

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`number`

***

### evaluate()

> **evaluate**(`x`, `y`, `outResult`): `void`

Defined in: [sdf-collider/src/SDFCollider.ts:92](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFCollider.ts#L92)

ワールド座標で符号付き距離と法線を O(1) 評価します。

#### Parameters

##### x

`number`

##### y

`number`

##### outResult

`Float32Array`

長さ 3 以上 [distance, normalX, normalY]

#### Returns

`void`

***

### generate()

> **generate**(`isSolid`): `void`

Defined in: [sdf-collider/src/SDFCollider.ts:170](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFCollider.ts#L170)

8SSEDT で符号付き距離場を生成します。

内外は「セル中心の座標で isSolid を呼ぶ」方式で判定します。
境界で 1 セル程度の誤差が出るため、tileSize と同じ
分解能なら実用上十分な滑らかさを得られます。

退化ケース: 世界が完全に壁、または完全に空の場合、
片側の EDT に種が存在せず距離は定義できません。
その場合は 0 として確定し、NaN を出さないようにします。

#### Parameters

##### isSolid

(`cx`, `cy`) => `boolean`

セル中心のワールド座標で固体かどうかを返す関数

#### Returns

`void`

***

### generateFromGrid()

> **generateFromGrid**(`grid`, `tileSize`, `isSolidTile`): `void`

Defined in: [sdf-collider/src/SDFCollider.ts:355](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFCollider.ts#L355)

タイルマップ (tileId の二次元配列) から直接生成します。

#### Parameters

##### grid

`ArrayLike`\<`number`\>[]

行ごとにタイル ID を並べた配列

##### tileSize

`number`

タイルの辺長 (ワールド単位)

##### isSolidTile

(`tileId`) => `boolean`

タイル ID が固体かどうかを返す関数

#### Returns

`void`

***

### getDistance()

> **getDistance**(`x`, `y`): `number`

Defined in: [sdf-collider/src/SDFCollider.ts:83](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFCollider.ts#L83)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`number`

***

### resolveCircle()

> **resolveCircle**(`cx`, `cy`, `radius`, `outPos`, `scratch`): `boolean`

Defined in: [sdf-collider/src/SDFCollider.ts:290](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFCollider.ts#L290)

円の押し出し応答を計算します。

障害物の内側 (距離 < 半径) なら法線に沿って外へ押し出します。
結果は outPos に書き込まれます。

#### Parameters

##### cx

`number`

##### cy

`number`

##### radius

`number`

##### outPos

`Float32Array`

長さ 2 以上 [x, y]

##### scratch

`Float32Array`

長さ 3 以上 (evaluate 用の作業領域)

#### Returns

`boolean`

応答が発生したか

***

### setDistance()

> **setDistance**(`x`, `y`, `distance`): `void`

Defined in: [sdf-collider/src/SDFCollider.ts:78](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFCollider.ts#L78)

指定セルの距離値を設定します。
正は障害物の外側、負は内側 (埋没) を表します。

#### Parameters

##### x

`number`

##### y

`number`

##### distance

`number`

#### Returns

`void`

***

### sweep()

> **sweep**(`x0`, `y0`, `x1`, `y1`, `radius`, `samples`, `outHit`, `evalScratch`): `boolean`

Defined in: [sdf-collider/src/SDFCollider.ts:323](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFCollider.ts#L323)

2 点間のスイープ判定 (連続衝突検出)。
経路を分割してサンプルするため、高速移動でも壁を貫通しません。

#### Parameters

##### x0

`number`

##### y0

`number`

##### x1

`number`

##### y1

`number`

##### radius

`number`

##### samples

`number`

分割数。小さいほど速い代わりに薄い壁を貫通します

##### outHit

`Float32Array`

長さ 2 以上。接触した座標を書き込む

##### evalScratch

`Float32Array`

長さ 3 以上

#### Returns

`boolean`

接触したか
