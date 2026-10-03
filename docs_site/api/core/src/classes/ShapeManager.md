[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / ShapeManager

# Class: ShapeManager

Defined in: [core/src/arena/Shape.ts:71](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Shape.ts#L71)

## Constructors

### Constructor

> **new ShapeManager**(`arena`, `registerTexture`, `capacity?`): `ShapeManager`

Defined in: [core/src/arena/Shape.ts:94](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Shape.ts#L94)

#### Parameters

##### arena

[`InstanceBufferArena`](InstanceBufferArena.md)

##### registerTexture

[`ShapeTextureRegistrar`](../type-aliases/ShapeTextureRegistrar.md)

##### capacity?

`number` = `4096`

#### Returns

`ShapeManager`

## Properties

### ids

> `readonly` **ids**: `Int32Array`

Defined in: [core/src/arena/Shape.ts:87](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Shape.ts#L87)

形状 ID -> アリーナの疎添字 ID

***

### kind

> `readonly` **kind**: `Uint8Array`

Defined in: [core/src/arena/Shape.ts:77](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Shape.ts#L77)

形状 ID -> 形状種別

***

### param0

> `readonly` **param0**: `Float32Array`

Defined in: [core/src/arena/Shape.ts:79](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Shape.ts#L79)

形状 ID -> 幅 / 半径 (px)

***

### param1

> `readonly` **param1**: `Float32Array`

Defined in: [core/src/arena/Shape.ts:81](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Shape.ts#L81)

形状 ID -> 高さ (px)

***

### param2

> `readonly` **param2**: `Float32Array`

Defined in: [core/src/arena/Shape.ts:83](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Shape.ts#L83)

形状 ID -> 補助パラメータ

***

### param3

> `readonly` **param3**: `Float32Array`

Defined in: [core/src/arena/Shape.ts:85](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Shape.ts#L85)

形状 ID -> 補助パラメータ

## Accessors

### count

#### Get Signature

> **get** **count**(): `number`

Defined in: [core/src/arena/Shape.ts:107](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Shape.ts#L107)

生成済みシェイプ数

##### Returns

`number`

## Methods

### add()

> **add**(`kind`, `width`, `height`, `aux2?`, `aux3?`, `color?`, `alpha?`): `number`

Defined in: [core/src/arena/Shape.ts:143](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Shape.ts#L143)

シェイプを生成します (Phaser 互換の `add.rectangle` などに対応)。

#### Parameters

##### kind

`number`

[ShapeKind](../variables/ShapeKind.md)

##### width

`number`

幅 / 半径 (px)

##### height

`number`

高さ (px)

##### aux2?

`number` = `0`

形状ごとの補助パラメータ

##### aux3?

`number` = `0`

形状ごとの補助パラメータ

##### color?

`number` = `0xffffff`

塗り色 (0xRRGGBB)

##### alpha?

`number` = `1`

濃度 (0〜1)

#### Returns

`number`

生成されたシェイプ ID。空席がない場合は -1

***

### destroy()

> **destroy**(): `void`

Defined in: [core/src/arena/Shape.ts:203](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Shape.ts#L203)

#### Returns

`void`

***

### getKind()

> **getKind**(`shapeId`): `number`

Defined in: [core/src/arena/Shape.ts:112](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Shape.ts#L112)

形状の種別を返します。範囲外なら -1。

#### Parameters

##### shapeId

`number`

#### Returns

`number`

***

### getParams()

> **getParams**(`shapeId`, `out`): `number`

Defined in: [core/src/arena/Shape.ts:122](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Shape.ts#L122)

形状のパラメータを `out` へ書き出します。

#### Parameters

##### shapeId

`number`

##### out

`Float32Array`

`SHAPE_PARAMS` 要素以上のバッファ

#### Returns

`number`

書き出した要素数

***

### remove()

> **remove**(`shapeId`): `boolean`

Defined in: [core/src/arena/Shape.ts:193](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Shape.ts#L193)

シェイプを解放します (Phaser 互換の `destroy`)。

#### Parameters

##### shapeId

`number`

#### Returns

`boolean`
