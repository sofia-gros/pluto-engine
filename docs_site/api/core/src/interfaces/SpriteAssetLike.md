[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / SpriteAssetLike

# Interface: SpriteAssetLike

Defined in: [core/src/arena/InstanceBufferArena.ts:46](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L46)

スプライトが参照するテクスチャアセットの最小インターフェース。
実体は TextureManager / LoaderManager が保持する TextureAsset。

## Properties

### frameHeight?

> `optional` **frameHeight?**: `number`

Defined in: [core/src/arena/InstanceBufferArena.ts:59](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L59)

1 フレームのピクセル高さ。表示サイズの基準になります。

***

### frames?

> `optional` **frames?**: `object`[]

Defined in: [core/src/arena/InstanceBufferArena.ts:63](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L63)

スプライトシート内のフレーム UV

#### uvH

> **uvH**: `number`

#### uvW

> **uvW**: `number`

#### uvX

> **uvX**: `number`

#### uvY

> **uvY**: `number`

***

### frameWidth?

> `optional` **frameWidth?**: `number`

Defined in: [core/src/arena/InstanceBufferArena.ts:57](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L57)

1 フレームのピクセル幅。
スプライトの表示サイズ（`width`）の基準になります。

***

### height?

> `optional` **height?**: `number`

Defined in: [core/src/arena/InstanceBufferArena.ts:52](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L52)

テクスチャ全体のピクセル高さ

***

### key?

> `optional` **key?**: `string`

Defined in: [core/src/arena/InstanceBufferArena.ts:61](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L61)

テクスチャキー (Phaser 互換の texture プロパティで返します)

***

### layerIndex?

> `optional` **layerIndex?**: `number`

Defined in: [core/src/arena/InstanceBufferArena.ts:48](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L48)

GPU Texture2DArray のレイヤーインデックス

***

### textureAsset?

> `optional` **textureAsset?**: `SpriteAssetLike`

Defined in: [core/src/arena/InstanceBufferArena.ts:65](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L65)

ラッパー構造で保持されている場合の互換フィールド

***

### width?

> `optional` **width?**: `number`

Defined in: [core/src/arena/InstanceBufferArena.ts:50](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L50)

テクスチャ全体のピクセル幅
