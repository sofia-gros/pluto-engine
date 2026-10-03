[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / TextureManager

# Class: TextureManager

Defined in: [core/src/loader/TextureManager.ts:61](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L61)

## Constructors

### Constructor

> **new TextureManager**(`device?`): `TextureManager`

Defined in: [core/src/loader/TextureManager.ts:70](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L70)

#### Parameters

##### device?

[`GraphicsDevice`](../../../renderer/src/interfaces/GraphicsDevice.md)

#### Returns

`TextureManager`

## Methods

### addAtlas()

> **addAtlas**(`key`, `source`, `frames`): [`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

Defined in: [core/src/loader/TextureManager.ts:168](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L168)

アトラス (TexturePacker 形式) を登録・GPU転送します。

均一グリッドではないため、フレーム UV は呼び出し側が矩形一覧で渡します。
配列順がそのままフレーム番号になるため、
描画時は `setFrame(番号)` で指定します。

#### Parameters

##### key

`string`

テクスチャキー

##### source

`HTMLCanvasElement` \| `HTMLImageElement` \| `ImageBitmap` \| `ImageData`

画像

##### frames

`object`[]

フレーム矩形 (ピクセル)。配列順 = フレーム番号

#### Returns

[`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

***

### addBase64()

> **addBase64**(`key`, `data`): `Promise`\<[`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)\>

Defined in: [core/src/loader/TextureManager.ts:302](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L302)

#### Parameters

##### key

`string`

##### data

`string`

#### Returns

`Promise`\<[`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)\>

***

### addCanvas()

> **addCanvas**(`key`, `canvas`): [`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

Defined in: [core/src/loader/TextureManager.ts:298](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L298)

#### Parameters

##### key

`string`

##### canvas

`HTMLCanvasElement`

#### Returns

[`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

***

### addImage()

> **addImage**(`key`, `source`): [`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

Defined in: [core/src/loader/TextureManager.ts:95](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L95)

画像オブジェクトまたはCanvasからテクスチャを登録・GPU転送します。

#### Parameters

##### key

`string`

##### source

`HTMLCanvasElement` \| `HTMLImageElement` \| `ImageBitmap` \| `ImageData`

#### Returns

[`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

***

### addSpritesheet()

> **addSpritesheet**(`key`, `source`, `options`): [`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

Defined in: [core/src/loader/TextureManager.ts:124](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L124)

スプライトシートからテクスチャを登録・GPU転送します。

`options.frames` に明示矩形があればそれを使い、
無ければ `frameWidth` / `frameHeight` から均一グリッドを計算します。

#### Parameters

##### key

`string`

##### source

`HTMLCanvasElement` \| `HTMLImageElement` \| `ImageBitmap` \| `ImageData`

##### options

[`TextureUploadOptions`](../../../renderer/src/interfaces/TextureUploadOptions.md)

#### Returns

[`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

***

### addSpriteSheet()

> **addSpriteSheet**(`key`, `image`, `config`): [`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

Defined in: [core/src/loader/TextureManager.ts:290](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L290)

#### Parameters

##### key

`string`

##### image

`HTMLCanvasElement` \| `HTMLImageElement`

##### config

###### endFrame?

`number`

###### frameHeight

`number`

###### frameWidth

`number`

###### startFrame?

`number`

#### Returns

[`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

***

### createCanvasTexture()

> **createCanvasTexture**(`key`, `width`, `height`, `drawCallback`, `options?`): [`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

Defined in: [core/src/loader/TextureManager.ts:179](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L179)

Canvas 描画コールバックから動的にプロシージャルテクスチャを作成・GPU転送します。

#### Parameters

##### key

`string`

##### width

`number`

##### height

`number`

##### drawCallback

(`ctx`) => `void`

##### options?

[`TextureUploadOptions`](../../../renderer/src/interfaces/TextureUploadOptions.md)

#### Returns

[`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

***

### exists()

> **exists**(`key`): `boolean`

Defined in: [core/src/loader/TextureManager.ts:245](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L245)

テクスチャが存在するかどうか判定します。

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### generateGradient()

> **generateGradient**(`key`, `width`, `height`, `options?`): [`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

Defined in: [core/src/loader/TextureManager.ts:197](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L197)

プロシージャルなグラデーションテクスチャを生成・GPU転送します。

#### Parameters

##### key

`string`

##### width

`number`

##### height

`number`

##### options?

`any`

#### Returns

[`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

***

### generateNoise()

> **generateNoise**(`key`, `width`, `height`, `options?`): [`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

Defined in: [core/src/loader/TextureManager.ts:216](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L216)

プロシージャルなノイズテクスチャを生成・GPU転送します。

#### Parameters

##### key

`string`

##### width

`number`

##### height

`number`

##### options?

`any`

#### Returns

[`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

***

### get()

> **get**(`key`): [`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

Defined in: [core/src/loader/TextureManager.ts:235](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L235)

登録済みテクスチャを取得します。

#### Parameters

##### key

`string`

#### Returns

[`TextureAsset`](../../../renderer/src/interfaces/TextureAsset.md)

***

### getFrame()

> **getFrame**(`textureKey`, `frameKey?`): [`TextureFrame`](../../../renderer/src/interfaces/TextureFrame.md)

Defined in: [core/src/loader/TextureManager.ts:271](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L271)

#### Parameters

##### textureKey

`string`

##### frameKey?

`string` \| `number`

#### Returns

[`TextureFrame`](../../../renderer/src/interfaces/TextureFrame.md)

***

### getKeys()

> **getKeys**(): `string`[]

Defined in: [core/src/loader/TextureManager.ts:267](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L267)

#### Returns

`string`[]

***

### list()

> **list**(): `string`[]

Defined in: [core/src/loader/TextureManager.ts:263](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L263)

#### Returns

`string`[]

***

### refresh()

> **refresh**(): `this`

Defined in: [core/src/loader/TextureManager.ts:286](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L286)

#### Returns

`this`

***

### remove()

> **remove**(`key`): `boolean`

Defined in: [core/src/loader/TextureManager.ts:255](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L255)

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### setDevice()

> **setDevice**(`device`): `void`

Defined in: [core/src/loader/TextureManager.ts:77](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/TextureManager.ts#L77)

グラフィックスデバイスを設定し、保留中のテクスチャをGPUにアップロードします。

#### Parameters

##### device

[`GraphicsDevice`](../../../renderer/src/interfaces/GraphicsDevice.md)

#### Returns

`void`
