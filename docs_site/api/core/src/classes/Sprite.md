[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Sprite

# Class: Sprite

Defined in: [core/src/arena/Sprite.ts:67](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L67)

## Constructors

### Constructor

> **new Sprite**(`id`, `arena`): `Sprite`

Defined in: [core/src/arena/Sprite.ts:71](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L71)

#### Parameters

##### id

`number`

##### arena

[`InstanceBufferArena`](InstanceBufferArena.md)

#### Returns

`Sprite`

## Properties

### id

> `readonly` **id**: `number`

Defined in: [core/src/arena/Sprite.ts:68](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L68)

## Accessors

### active

#### Get Signature

> **get** **active**(): `boolean`

Defined in: [core/src/arena/Sprite.ts:297](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L297)

##### Returns

`boolean`

***

### alpha

#### Get Signature

> **get** **alpha**(): `number`

Defined in: [core/src/arena/Sprite.ts:903](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L903)

不透明度を取得します (Phaser 互換の alpha)。0.0 から 1.0 の範囲です。

tint はリトルエンディアンの BGRA として packs されているため、
最上位バイトがそのまま A チャンネルになります。
そのため alpha 用に新しい SoA フィールドや頂点属性を用意する必要はありません。

##### Returns

`number`

#### Set Signature

> **set** **alpha**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:906](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L906)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### angle

#### Get Signature

> **get** **angle**(): `number`

Defined in: [core/src/arena/Sprite.ts:467](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L467)

回転角を度で取得します (Phaser 互換の angle)。
pluto-engine の内部表現はラジアンです。

##### Returns

`number`

#### Set Signature

> **set** **angle**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:470](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L470)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### anims

#### Get Signature

> **get** **anims**(): [`AnimState`](AnimState.md)

Defined in: [core/src/arena/Sprite.ts:998](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L998)

アニメーション状態ハンドル (Phaser 互換の `sprite.anims`)。

Flyweight なので毎フレーム new しません。内部配列を使い回し、
同じスロットなら同じインスタンスを返します。停止中は
slot が -1 の無効ハンドルになります。

##### Returns

[`AnimState`](AnimState.md)

AnimationManager が未初期化なら null

***

### asset

#### Get Signature

> **get** **asset**(): [`SpriteAssetLike`](../interfaces/SpriteAssetLike.md)

Defined in: [core/src/arena/Sprite.ts:592](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L592)

このスプライトが参照しているテクスチャアセット (SoA 格納)。

##### Returns

[`SpriteAssetLike`](../interfaces/SpriteAssetLike.md)

***

### blendMode

#### Get Signature

> **get** **blendMode**(): `number`

Defined in: [core/src/arena/Sprite.ts:348](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L348)

##### Returns

`number`

***

### body

#### Get Signature

> **get** **body**(): [`Body`](Body.md)

Defined in: [core/src/arena/Sprite.ts:1009](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L1009)

物理ボディ (Phaser 互換の `sprite.body`)。

Scene の Body ハンドルキャッシュを経由するため、毎フレーム new は起きません。
Sprite 自身は Scene 参照を持たないため、null の場合は
[Scene.getBody](Scene.md#getbody) を使ってください。

##### Returns

[`Body`](Body.md)

***

### depth

#### Get Signature

> **get** **depth**(): `number`

Defined in: [core/src/arena/Sprite.ts:528](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L528)

描画優先順 (Z 順ソート値)。大きいほど手前に描画されます。

##### Returns

`number`

#### Set Signature

> **set** **depth**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:531](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L531)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### depthIndex

#### Get Signature

> **get** **depthIndex**(): `number`

Defined in: [core/src/arena/Sprite.ts:535](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L535)

##### Returns

`number`

***

### destroyed

#### Get Signature

> **get** **destroyed**(): `boolean`

Defined in: [core/src/arena/Sprite.ts:1042](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L1042)

破棄済みかどうか。

##### Returns

`boolean`

***

### displayHeight

#### Get Signature

> **get** **displayHeight**(): `number`

Defined in: [core/src/arena/Sprite.ts:201](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L201)

実際に表示される高さ (px)。`height * |scaleY|` です。

##### Returns

`number`

***

### displayWidth

#### Get Signature

> **get** **displayWidth**(): `number`

Defined in: [core/src/arena/Sprite.ts:196](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L196)

実際に表示される幅 (px)。`width * |scaleX|` です。

当たり判定・`getBounds` はすべてこの値を使います。

##### Returns

`number`

***

### facing

#### Get Signature

> **get** **facing**(): `number`

Defined in: [core/src/arena/Sprite.ts:491](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L491)

##### Returns

`number`

#### Set Signature

> **set** **facing**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:494](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L494)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### flipX

#### Get Signature

> **get** **flipX**(): `boolean`

Defined in: [core/src/arena/Sprite.ts:719](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L719)

水平反転の状態 (Phaser 互換の flipX)。
facing が負のとき反転しています。

##### Returns

`boolean`

#### Set Signature

> **set** **flipX**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:722](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L722)

##### Parameters

###### val

`boolean`

##### Returns

`void`

***

### flipY

#### Get Signature

> **get** **flipY**(): `boolean`

Defined in: [core/src/arena/Sprite.ts:752](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L752)

垂直反転の状態 (Phaser 互換の flipY)。`scaleY` が負のとき反転しています。

##### Returns

`boolean`

#### Set Signature

> **set** **flipY**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:755](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L755)

##### Parameters

###### val

`boolean`

##### Returns

`void`

***

### frame

#### Get Signature

> **get** **frame**(): `number`

Defined in: [core/src/arena/Sprite.ts:554](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L554)

同一スプライトシート内の現在のコマ番号。

##### Returns

`number`

#### Set Signature

> **set** **frame**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:557](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L557)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### frameIdx

#### Get Signature

> **get** **frameIdx**(): `number`

Defined in: [core/src/arena/Sprite.ts:544](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L544)

GPU Texture2DArray のサンプリングレイヤーインデックス。

##### Returns

`number`

#### Set Signature

> **set** **frameIdx**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:547](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L547)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### hasTexture

#### Get Signature

> **get** **hasTexture**(): `boolean`

Defined in: [core/src/arena/Sprite.ts:222](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L222)

テクスチャ未設定のスプライトかどうか (Phaser 互換の hasTexture 相当)。

##### Returns

`boolean`

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [core/src/arena/Sprite.ts:184](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L184)

現在のフレームのピクセル高 (スケール未適用)。
Phaser 互換の `height` は「フレームの高さ」です。

##### Returns

`number`

#### Set Signature

> **set** **height**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:187](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L187)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### hitHeight

#### Get Signature

> **get** **hitHeight**(): `number`

Defined in: [core/src/arena/Sprite.ts:951](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L951)

##### Returns

`number`

***

### hitWidth

#### Get Signature

> **get** **hitWidth**(): `number`

Defined in: [core/src/arena/Sprite.ts:947](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L947)

##### Returns

`number`

***

### index

#### Get Signature

> **get** **index**(): `number`

Defined in: [core/src/arena/Sprite.ts:87](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L87)

現在の SoA スロット番号 (密添字)。

解放済み、または未確保なら -1 を返します。
SoA を直接走査する利用者 (インデックス単位のパス処理) のために公開しています。
毎フレーム `id` 1 回の参照で済むため、追加のコストはありません。

##### Returns

`number`

***

### interactive

#### Get Signature

> **get** **interactive**(): `boolean`

Defined in: [core/src/arena/Sprite.ts:943](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L943)

##### Returns

`boolean`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [core/src/arena/Sprite.ts:310](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L310)

##### Returns

`string`

***

### parentId

#### Get Signature

> **get** **parentId**(): `number`

Defined in: [core/src/arena/Sprite.ts:961](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L961)

親スプライト。根の場合は null を返します。
呼び出しごとにヒープを生成しないよう、利用側は parentId を直接参照してください。

##### Returns

`number`

***

### rotation

#### Get Signature

> **get** **rotation**(): `number`

Defined in: [core/src/arena/Sprite.ts:449](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L449)

回転 (ラジアン)。親を持つ場合は親のワールド回転を加算した値が返ります。

##### Returns

`number`

#### Set Signature

> **set** **rotation**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:453](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L453)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### scale

#### Get Signature

> **get** **scale**(): `number`

Defined in: [core/src/arena/Sprite.ts:141](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L141)

##### Returns

`number`

#### Set Signature

> **set** **scale**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:145](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L145)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [core/src/arena/Sprite.ts:150](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L150)

X 方向のスケール倍率 (Phaser 互換の scaleX)。

##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:153](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L153)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [core/src/arena/Sprite.ts:158](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L158)

Y 方向のスケール倍率 (Phaser 互換の scaleY)。

##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:161](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L161)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### scrollFactorX

#### Get Signature

> **get** **scrollFactorX**(): `number`

Defined in: [core/src/arena/Sprite.ts:279](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L279)

##### Returns

`number`

***

### scrollFactorY

#### Get Signature

> **get** **scrollFactorY**(): `number`

Defined in: [core/src/arena/Sprite.ts:282](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L282)

##### Returns

`number`

***

### texture

#### Get Signature

> **get** **texture**(): `string`

Defined in: [core/src/arena/Sprite.ts:602](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L602)

テクスチャキーの文字列を取得します (Phaser 互換の texture)。

内部では Texture2DArray のレイヤー番号で保持しているため、
キー文字列はアセットの side から返します。読み取り専用です。

##### Returns

`string`

***

### tint

#### Get Signature

> **get** **tint**(): `number`

Defined in: [core/src/arena/Sprite.ts:862](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L862)

現在の Tint 色を 0xRRGGBB 形式で取得します (Phaser 互換の tint)。

内部ではリトルエンディアンの BGRA として packs されているため、
RGB だけを取り出して 0xRRGGBB へ並べ替えます。アルファは含みません。

##### Returns

`number`

#### Set Signature

> **set** **tint**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:869](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L869)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### tintMode

#### Get Signature

> **get** **tintMode**(): `number`

Defined in: [core/src/arena/Sprite.ts:332](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L332)

##### Returns

`number`

***

### type

#### Get Signature

> **get** **type**(): `string`

Defined in: [core/src/arena/Sprite.ts:315](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L315)

オブジェクト種別の文字列 (Phaser 互換の type)。

##### Returns

`string`

***

### uvH

#### Get Signature

> **get** **uvH**(): `number`

Defined in: [core/src/arena/Sprite.ts:582](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L582)

##### Returns

`number`

#### Set Signature

> **set** **uvH**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:585](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L585)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### uvW

#### Get Signature

> **get** **uvW**(): `number`

Defined in: [core/src/arena/Sprite.ts:575](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L575)

##### Returns

`number`

#### Set Signature

> **set** **uvW**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:578](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L578)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### uvX

#### Get Signature

> **get** **uvX**(): `number`

Defined in: [core/src/arena/Sprite.ts:561](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L561)

##### Returns

`number`

#### Set Signature

> **set** **uvX**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:564](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L564)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### uvY

#### Get Signature

> **get** **uvY**(): `number`

Defined in: [core/src/arena/Sprite.ts:568](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L568)

##### Returns

`number`

#### Set Signature

> **set** **uvY**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:571](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L571)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### visible

#### Get Signature

> **get** **visible**(): `boolean`

Defined in: [core/src/arena/Sprite.ts:502](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L502)

表示するかどうか (Phaser 互換)。
false のインスタンスはフラグメントシェーダで discard されます。

##### Returns

`boolean`

#### Set Signature

> **set** **visible**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:505](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L505)

##### Parameters

###### val

`boolean`

##### Returns

`void`

***

### width

#### Get Signature

> **get** **width**(): `number`

Defined in: [core/src/arena/Sprite.ts:173](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L173)

現在のフレームのピクセル幅 (スケール未適用)。

Phaser 互換の `width` は「フレームの横幅」です。
実際に表示される幅は `displayWidth` を参照してください。

##### Returns

`number`

#### Set Signature

> **set** **width**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:176](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L176)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [core/src/arena/Sprite.ts:418](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L418)

##### Returns

`number`

#### Set Signature

> **set** **x**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:422](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L422)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [core/src/arena/Sprite.ts:432](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L432)

##### Returns

`number`

#### Set Signature

> **set** **y**(`val`): `void`

Defined in: [core/src/arena/Sprite.ts:436](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L436)

##### Parameters

###### val

`number`

##### Returns

`void`

## Methods

### clearAlpha()

> **clearAlpha**(): `this`

Defined in: [core/src/arena/Sprite.ts:924](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L924)

不透明度を白 (1.0) に戻します (Phaser 互換の clearAlpha)。

#### Returns

`this`

***

### clearTint()

> **clearTint**(): `this`

Defined in: [core/src/arena/Sprite.ts:889](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L889)

Tint を白に戻します (Phaser 互換の clearTint)。
現在の alpha は維持します。

#### Returns

`this`

***

### destroy()

> **destroy**(): `void`

Defined in: [core/src/arena/Sprite.ts:1035](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L1035)

アリーナからこのスプライトの ID を解放 (削除) します。

#### Returns

`void`

***

### getBottomRight()

> **getBottomRight**(`out`): `this`

Defined in: [core/src/arena/Sprite.ts:808](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L808)

右下端の座標を out へ書き出します (Phaser 互換の getBottomRight)。

#### Parameters

##### out

[`PointLike`](../interfaces/PointLike.md)

#### Returns

`this`

***

### getBounds()

> **getBounds**(`out`): `this`

Defined in: [core/src/arena/Sprite.ts:771](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L771)

画面上の矩形 (Rotated Rectangle ではなく軸平行矩形) を out へ書き出します (Phaser 互換の getBounds)。

回転を考慮せず、中心とスケールから軸平行矩形を求めます。
ヒープ割り当てを避けるため、戻り値は out へ書き込みます。

#### Parameters

##### out

[`BoundsRect`](../interfaces/BoundsRect.md)

#### Returns

`this`

***

### getCenter()

> **getCenter**(`out`): `this`

Defined in: [core/src/arena/Sprite.ts:799](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L799)

中央の座標を out へ書き出します (Phaser 互換の getCenter)。

#### Parameters

##### out

[`PointLike`](../interfaces/PointLike.md)

#### Returns

`this`

***

### getFrameSize()

> **getFrameSize**(`out`): `this`

Defined in: [core/src/arena/Sprite.ts:651](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L651)

テクスチャアセットのフレーム寸法 (px) を `out` へ書き出します。

`frameWidth` / `frameHeight` が使える場合はそれを使い、
無ければ画像全体の寸法、それも無ければ `DEFAULT_FRAME_SIZE` です。

毎フレーム呼ばれる可能性があるため、戻り値のオブジェクトを
生成せず使い回しバッファへ書き込みます（Flyweight の掟）。

#### Parameters

##### out

`Float32Array`

#### Returns

`this`

***

### getLocalTransformMatrix()

> **getLocalTransformMatrix**(`out`): `this`

Defined in: [core/src/arena/Sprite.ts:361](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L361)

ローカル変換行列 (a, b, c, d, tx, ty) を `out` へ書き出します。

Phaser は `Float32Array(4)` を返しますが、
**ヒープ確保を避けるため `out` パラメータを必須**にしています
（SoA 判定コード **D**：Phaser とシグネチャが異なります）。

#### Parameters

##### out

`Float32Array`

#### Returns

`this`

***

### getOrigin()

> **getOrigin**(`out`): `this`

Defined in: [core/src/arena/Sprite.ts:245](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L245)

現在の描画原点を `out` へ書き出します (Phaser 互換の getOrigin)。

#### Parameters

##### out

`Float32Array`

#### Returns

`this`

***

### getSize()

> **getSize**(`out`): `this`

Defined in: [core/src/arena/Sprite.ts:411](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L411)

現在のフレーム寸法を `out` へ書き出します (Phaser 互換の getSize)。

#### Parameters

##### out

`Float32Array`

#### Returns

`this`

***

### getTopLeft()

> **getTopLeft**(`out`): `this`

Defined in: [core/src/arena/Sprite.ts:789](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L789)

左上端の座標を out へ書き出します (Phaser 互換の getTopLeft)。

#### Parameters

##### out

[`PointLike`](../interfaces/PointLike.md)

#### Returns

`this`

***

### getWorldTransformMatrix()

> **getWorldTransformMatrix**(`out`): `this`

Defined in: [core/src/arena/Sprite.ts:383](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L383)

ワールド変換行列を `out` へ書き出します。

階層を使っている場合は `computeWorldTransforms()` の結果を使います。
シェーダと同じ計算を CPU 側で行っています。

#### Parameters

##### out

`Float32Array`

#### Returns

`this`

***

### play()

> **play**(`key`, `ignoreIfPlaying?`): `this`

Defined in: [core/src/arena/Sprite.ts:984](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L984)

登録済みアニメーションを再生します。
Sprite 参照を一切保持せず ID のみを渡すことで、AnimationManager 側の参照 Map を不要にします。

#### Parameters

##### key

`string`

##### ignoreIfPlaying?

`boolean` = `false`

#### Returns

`this`

***

### playReverse()

> **playReverse**(`key`, `ignoreIfPlaying?`): [`AnimState`](AnimState.md)

Defined in: [core/src/arena/Sprite.ts:1017](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L1017)

逆再生を開始します (Phaser 互換の `playReverse`)。
最終コマから先頭へ戻ります。

#### Parameters

##### key

`string`

##### ignoreIfPlaying?

`boolean` = `false`

#### Returns

[`AnimState`](AnimState.md)

***

### resetFlip()

> **resetFlip**(): `this`

Defined in: [core/src/arena/Sprite.ts:820](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L820)

反転状態を初期状態 (反転なし) に戻します (Phaser 互換の resetFlip)。

横・縦の両方を戻します。縦は `scaleY` の符号で表現されます。

#### Returns

`this`

***

### setActive()

> **setActive**(`value`): `this`

Defined in: [core/src/arena/Sprite.ts:293](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L293)

update / render の対象フラグ (Phaser 互換の setActive)。

false にすると描画対象から外れます（`visible` とは独立した概念です）。

#### Parameters

##### value

`number` \| `boolean`

#### Returns

`this`

***

### setAlpha()

> **setAlpha**(`value`): `this`

Defined in: [core/src/arena/Sprite.ts:916](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L916)

不透明度を設定し、チェーンのために this を返します (Phaser 互換の setAlpha)。

#### Parameters

##### value

`number`

#### Returns

`this`

***

### setAngle()

> **setAngle**(`degrees`): `this`

Defined in: [core/src/arena/Sprite.ts:477](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L477)

回転角を度で設定し、チェーンのために this を返します (Phaser 互換)。

#### Parameters

##### degrees

`number`

#### Returns

`this`

***

### setBlendMode()

> **setBlendMode**(`mode`): `this`

Defined in: [core/src/arena/Sprite.ts:343](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L343)

ブレンドモードを設定します (Phaser 互換の setBlendMode)。

WebGL2 がネイティブにサポートするのは 4 種（Normal / Add / Multiply / Screen）だけなので、
範囲外は `Normal` に丸められます。
実際の反映はバッチ分割の実装（Phase 8）まで行われません。

#### Parameters

##### mode

`string` \| `number`

#### Returns

`this`

***

### setDisplaySize()

> **setDisplaySize**(`w`, `h`): `this`

Defined in: [core/src/arena/Sprite.ts:213](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L213)

表示サイズをピクセル単位で指定します (Phaser 互換の setDisplaySize)。

内部では「表示幅 / フレーム幅」を倍率として計算します。
テクスチャ未設定でフレーム寸法が既定 (32px) のときは、
現在は 32px 前提の倍率を設定するため、テクスチャ確定後に
`setDisplaySize` を呼ぶと期待どおりの表示になります。

#### Parameters

##### w

`number`

##### h

`number`

#### Returns

`this`

***

### setFlip()

> **setFlip**(`flipX`, `flipY?`): `this`

Defined in: [core/src/arena/Sprite.ts:832](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L832)

横・縦の反転をまとめて設定します (Phaser 互換の setFlip)。

`flipY` を省略した場合は現在の縦反転状態を維持します。

#### Parameters

##### flipX

`boolean`

##### flipY?

`boolean`

#### Returns

`this`

***

### setFlipX()

> **setFlipX**(`flip`): `this`

Defined in: [core/src/arena/Sprite.ts:710](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L710)

水平反転を設定します。

#### Parameters

##### flip

`boolean`

#### Returns

`this`

***

### setFlipY()

> **setFlipY**(`flip`): `this`

Defined in: [core/src/arena/Sprite.ts:742](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L742)

垂直反転を設定します (Phaser 互換の setFlipY)。

`scaleY` の符号で表現します。負の値にすると上下反転します。
非等方スケールに対応したため可能になりました。

#### Parameters

##### flip

`boolean`

#### Returns

`this`

***

### setFrame()

> **setFrame**(`frame`): `this`

Defined in: [core/src/arena/Sprite.ts:682](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L682)

スプライトシート内の 特定コマを設定します。

コマごとに大きさが異なるアトラスでも追従するよう、
フレーム UV と同時にピクセル寸法も更新します。

#### Parameters

##### frame

`string` \| `number`

#### Returns

`this`

***

### setInteractive()

> **setInteractive**(`hitWidth?`, `hitHeight?`): `this`

Defined in: [core/src/arena/Sprite.ts:935](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L935)

ポインタ操作を有効化します (Phaser 互換の setInteractive)。

引数を省略した場合は**表示サイズ**（フレーム寸法 × スケール倍率）を
ヒット領域として使います。これにより画像の大きさに当たり判定が追従します。
明示的な寸法を渡した場合はそちらを優先します。

#### Parameters

##### hitWidth?

`number`

##### hitHeight?

`number`

#### Returns

`this`

***

### setName()

> **setName**(`value`): `this`

Defined in: [core/src/arena/Sprite.ts:306](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L306)

識別名を設定します (Phaser 互換の setName)。

文字列を SoA に格納できないため、`namePool` への参照だけを保持します。

#### Parameters

##### value

`string`

#### Returns

`this`

***

### setOrigin()

> **setOrigin**(`x?`, `y?`): `this`

Defined in: [core/src/arena/Sprite.ts:234](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L234)

描画原点を設定します (Phaser 互換の setOrigin)。

`0.5, 0.5` はスプライトの中心、`0, 0` は左上、`1, 1` は右下です。
`y` を省略した場合は `x` を両方に適用します。

#### Parameters

##### x?

`number` = `0.5`

##### y?

`number`

#### Returns

`this`

***

### setOriginToDefault()

> **setOriginToDefault**(): `this`

Defined in: [core/src/arena/Sprite.ts:240](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L240)

描画原点を中央 (0.5, 0.5) に戻します (Phaser 互換の setOriginToDefault)。

#### Returns

`this`

***

### setParentId()

> **setParentId**(`parentId`): `this`

Defined in: [core/src/arena/Sprite.ts:973](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L973)

親スプライトの ID を設定します (-1 で親なし)。
親子関係はネストしたオブジェクト木ではなく SoA の `parentId` 配列で表現されます。
親子付けすると x/y/rotation はローカル値として解釈されます。

実装は [InstanceBufferArena.setParentId](InstanceBufferArena.md#setparentid) に委譲し、
ローカル座標の初期化と dirty フラグの立て方を 1 か所に集約しています。

#### Parameters

##### parentId

`number`

#### Returns

`this`

***

### setPosition()

> **setPosition**(`x?`, `y?`, `z?`, `w?`): `this`

Defined in: [core/src/arena/Sprite.ts:98](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L98)

位置を設定し、チェーンのために this を返します (Phaser 互換)。

#### Parameters

##### x?

`number`

##### y?

`number`

##### z?

`number`

##### w?

`number`

#### Returns

`this`

***

### setRotation()

> **setRotation**(`degrees`): `this`

Defined in: [core/src/arena/Sprite.ts:486](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L486)

回転角を度で設定し、チェーンのために this を返します (Phaser 互換の setRotation)。
内部ではラジアンとして保持します。

#### Parameters

##### degrees

`number`

#### Returns

`this`

***

### setScale()

> **setScale**(`x`, `y?`): `this`

Defined in: [core/src/arena/Sprite.ts:136](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L136)

スケールを設定します (Phaser 互換)。

`scale` は**フレーム寸法の倍率**です。ピクセル数ではありません。
`y` を省略した場合は `x` を X/Y 両方に適用します。

```ts
this.load.sprite('hero', src, { frameWidth: 32, frameHeight: 32 });
const p = this.add.sprite(x, y, 'hero');  // 32px
p.setScale(2);                            // 64px
```

表示サイズを直接指定したい場合は `setDisplaySize` を使ってください。

#### Parameters

##### x

`number`

##### y?

`number`

#### Returns

`this`

***

### setScrollFactor()

> **setScrollFactor**(`x`, `y?`): `this`

Defined in: [core/src/arena/Sprite.ts:260](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L260)

カメラスクロール係数を設定します (Phaser 互換の setScrollFactor)。

0.5 を指定するとカメラ移動の半分だけスプライトが動きます（背景など）。
`y` を省略した場合は `x` を両方に適用します。

#### Parameters

##### x

`number`

##### y?

`number`

#### Returns

`this`

***

### setScrollFactorX()

> **setScrollFactorX**(`value`): `this`

Defined in: [core/src/arena/Sprite.ts:266](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L266)

X 方向のカメラスクロール係数 (Phaser 互換の setScrollFactorX)。

#### Parameters

##### value

`number`

#### Returns

`this`

***

### setScrollFactorY()

> **setScrollFactorY**(`value`): `this`

Defined in: [core/src/arena/Sprite.ts:273](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L273)

Y 方向のカメラスクロール係数 (Phaser 互換の setScrollFactorY)。

#### Parameters

##### value

`number`

#### Returns

`this`

***

### setSize()

> **setSize**(`width`, `height`): `this`

Defined in: [core/src/arena/Sprite.ts:405](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L405)

フレームのピクセル寸法を設定します (Phaser 互換の setSize)。
`scale` は倍率なので `width` / `height` には影響しません。

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`this`

***

### setTexture()

> **setTexture**(`asset`, `frame?`): `this`

Defined in: [core/src/arena/Sprite.ts:629](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L629)

テクスチャアセットを設定し、GPU Texture2DArray の対応レイヤーとフレーム UV を適用します。
アセット参照はアリーナ側 (SoA) に格納され、このインスタンスは 32 バイトのまま保たれます。

テクスチャのフレーム寸法がそのままスプライトの表示サイズになります
（`scale` は倍率なので既定の 1.0 ではフレームそのまま）。
同時に、テクスチャ未設定の既定は「透明」だったため tint を不透明へ戻します。

#### Parameters

##### asset

[`SpriteAssetLike`](../interfaces/SpriteAssetLike.md)

##### frame?

`string` \| `number`

#### Returns

`this`

***

### setTextureByKey()

> **setTextureByKey**(`scene`, `key`, `frame?`): `this`

Defined in: [core/src/arena/Sprite.ts:612](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L612)

テクスチャアセットを設定し、チェーンのために this を返します (Phaser 互換の setTexture)。

キーの文字列で渡す場合は Scene 側の textures から解決します。
呼び出し側から textures へ参照できるよう、Sprite は static で保持しません。

#### Parameters

##### scene

###### textures?

\{ `get`: `unknown`; \}

###### textures.get

##### key

`string`

##### frame?

`string` \| `number`

#### Returns

`this`

***

### setTint()

> **setTint**(`tintHex`): `this`

Defined in: [core/src/arena/Sprite.ts:844](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L844)

スプライトの乗算カラー (Tint) を設定します。
0xRRGGBB 形式を自動的にリトルエンディアン RGBA Uint32 にパックします。

#### Parameters

##### tintHex

`number`

#### Returns

`this`

***

### setTintFill()

> **setTintFill**(`tintHex`, `alpha?`): `this`

Defined in: [core/src/arena/Sprite.ts:879](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L879)

不透明度を指定して単色塗りを近似します (Phaser 互換の setTintFill)。

シェーダが texColor * vTint のため、色成分の指定は現状無視されます
（係数を 1.0 とした白を置きます）。alpha のみ反映されます。

#### Parameters

##### tintHex

`number`

##### alpha?

`number`

#### Returns

`this`

***

### setTintMode()

> **setTintMode**(`mode`): `this`

Defined in: [core/src/arena/Sprite.ts:327](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L327)

tint のブレンドモードを設定します (Phaser 4 互換の setTintMode)。

現在はフラグメントシェーダが `MULTIPLY` のみを実装しています。
値は保持されるため、シェーダを後から拡張しても API は変わりません。

#### Parameters

##### mode

`string` \| `number`

#### Returns

`this`

***

### setVisible()

> **setVisible**(`value`): `this`

Defined in: [core/src/arena/Sprite.ts:512](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L512)

表示するかどうかを設定し、チェーンのために this を返します。

#### Parameters

##### value

`boolean`

#### Returns

`this`

***

### setX()

> **setX**(`x`): `this`

Defined in: [core/src/arena/Sprite.ts:109](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L109)

X 座標を設定し、チェーンのために this を返します (Phaser 互換)。

#### Parameters

##### x

`number`

#### Returns

`this`

***

### setY()

> **setY**(`y`): `this`

Defined in: [core/src/arena/Sprite.ts:117](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L117)

Y 座標を設定し、チェーンのために this を返します (Phaser 互換)。

#### Parameters

##### y

`number`

#### Returns

`this`

***

### stop()

> **stop**(): `this`

Defined in: [core/src/arena/Sprite.ts:1027](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L1027)

再生中のアニメーションを停止します (Phaser 互換の sprite.anims.stop)。

現在のフレームの UV はそのまま残ります。キーは文字列で、
フレーム番号を指定する経路はないため、引数は取りません。

#### Returns

`this`

***

### toggleFlipX()

> **toggleFlipX**(): `this`

Defined in: [core/src/arena/Sprite.ts:729](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L729)

水平反転を反転します (Phaser 互換)。

#### Returns

`this`

***

### toggleFlipY()

> **toggleFlipY**(): `this`

Defined in: [core/src/arena/Sprite.ts:760](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L760)

垂直反転を反転します (Phaser 互換の toggleFlipY)。

#### Returns

`this`

***

### toggleVisible()

> **toggleVisible**(): `this`

Defined in: [core/src/arena/Sprite.ts:520](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/Sprite.ts#L520)

表示状態を反転します。

#### Returns

`this`
