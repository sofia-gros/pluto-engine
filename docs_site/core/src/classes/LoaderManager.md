[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / LoaderManager

# Class: LoaderManager

Defined in: [core/src/loader/LoaderManager.ts:94](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L94)

## Constructors

### Constructor

> **new LoaderManager**(`textureManager?`): `LoaderManager`

Defined in: [core/src/loader/LoaderManager.ts:104](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L104)

#### Parameters

##### textureManager?

[`TextureManager`](TextureManager.md)

#### Returns

`LoaderManager`

## Accessors

### isLoading

#### Get Signature

> **get** **isLoading**(): `boolean`

Defined in: [core/src/loader/LoaderManager.ts:296](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L296)

読み込み中のか

##### Returns

`boolean`

***

### pendingCount

#### Get Signature

> **get** **pendingCount**(): `number`

Defined in: [core/src/loader/LoaderManager.ts:291](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L291)

キューに入っているアセットの数

##### Returns

`number`

## Methods

### abort()

> **abort**(): `void`

Defined in: [core/src/loader/LoaderManager.ts:547](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L547)

現在の読み込みを中断します (Phaser互換)。

#### Returns

`void`

***

### atlas()

> **atlas**(`key`, `url`, `config?`): `this`

Defined in: [core/src/loader/LoaderManager.ts:227](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L227)

TexturePacker のアトラスをキューに追加します。

#### Parameters

##### key

`string`

登録キー

##### url

`string`

アトラス JSON の URL

##### config?

[`AtlasConfig`](../interfaces/AtlasConfig.md)

省略時は JSON の meta.image を使います

#### Returns

`this`

***

### audio()

> **audio**(`key`, `url`): `this`

Defined in: [core/src/loader/LoaderManager.ts:281](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L281)

オーディオアセットをキューに追加します。

#### Parameters

##### key

`string`

##### url

`string` \| `string`[]

#### Returns

`this`

***

### bitmapfont()

> **bitmapfont**(`key`, `url`, `dataURL?`): `this`

Defined in: [core/src/loader/LoaderManager.ts:241](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L241)

ビットマップフォントをキューに追加します。

#### Parameters

##### key

`string`

登録キー

##### url

`string`

.fnt の URL

##### dataURL?

`string` \| [`BitmapFontConfig`](../interfaces/BitmapFontConfig.md)

フォント画像。省略時は .fnt 内の file を参照します

#### Returns

`this`

***

### clear()

> **clear**(): `void`

Defined in: [core/src/loader/LoaderManager.ts:561](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L561)

キャッシュをクリアします。

#### Returns

`void`

***

### csv()

> **csv**(`key`, `url`): `this`

Defined in: [core/src/loader/LoaderManager.ts:265](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L265)

CSVアセットをキューに追加します。

#### Parameters

##### key

`string`

##### url

`string`

#### Returns

`this`

***

### exists()

> **exists**(`key`): `boolean`

Defined in: [core/src/loader/LoaderManager.ts:533](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L533)

キーがキャッシュされているか (Phaser 互換の exists)

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### get()

> **get**(`key`): `unknown`

Defined in: [core/src/loader/LoaderManager.ts:528](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L528)

キャッシュされたアセットを取得します。

#### Parameters

##### key

`string`

#### Returns

`unknown`

***

### image()

> **image**(`key`, `url`): `this`

Defined in: [core/src/loader/LoaderManager.ts:201](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L201)

画像アセットをキューに追加します。

#### Parameters

##### key

`string`

##### url

`string`

#### Returns

`this`

***

### json()

> **json**(`key`, `url`): `this`

Defined in: [core/src/loader/LoaderManager.ts:257](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L257)

JSONアセットをキューに追加します。

#### Parameters

##### key

`string`

##### url

`string`

#### Returns

`this`

***

### off()

> **off**\<`K`\>(`event`, `fn`): `boolean`

Defined in: [core/src/loader/LoaderManager.ts:169](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L169)

イベントの購読を解除します。

#### Type Parameters

##### K

`K` *extends* keyof [`LoaderEvents`](../interfaces/LoaderEvents.md)

#### Parameters

##### event

`K`

##### fn

[`LoaderEvents`](../interfaces/LoaderEvents.md)\[`K`\]

#### Returns

`boolean`

解除できたら true

***

### on()

> **on**\<`K`\>(`event`, `fn`, `context?`): `this`

Defined in: [core/src/loader/LoaderManager.ts:133](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L133)

イベントを購読します。

#### Type Parameters

##### K

`K` *extends* keyof [`LoaderEvents`](../interfaces/LoaderEvents.md)

#### Parameters

##### event

`K`

イベント名

##### fn

[`LoaderEvents`](../interfaces/LoaderEvents.md)\[`K`\]

ハンドラ

##### context?

`unknown`

`this` として渡す値

#### Returns

`this`

***

### once()

> **once**\<`K`\>(`event`, `fn`, `context?`): `this`

Defined in: [core/src/loader/LoaderManager.ts:149](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L149)

イベントを 1 度だけ購読します。

発火時に自身を解除してから呼ぶので、2 回目以降は呼ばれません。

#### Type Parameters

##### K

`K` *extends* keyof [`LoaderEvents`](../interfaces/LoaderEvents.md)

#### Parameters

##### event

`K`

##### fn

[`LoaderEvents`](../interfaces/LoaderEvents.md)\[`K`\]

##### context?

`unknown`

#### Returns

`this`

***

### onProgress()

> **onProgress**(`callback`): `this`

Defined in: [core/src/loader/LoaderManager.ts:554](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L554)

progress イベントを購読します (Phaser互換)。

#### Parameters

##### callback

(`value`) => `void`

#### Returns

`this`

***

### reset()

> **reset**(): `void`

Defined in: [core/src/loader/LoaderManager.ts:540](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L540)

キャッシュとキューを初期化します (Phaser互換)。

#### Returns

`void`

***

### setSoundManagerFactory()

> **setSoundManagerFactory**(`factory`): `void`

Defined in: [core/src/loader/LoaderManager.ts:118](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L118)

SoundManager のファクトリを設定します (遅延生成用)。

#### Parameters

##### factory

() => [`SoundManager`](SoundManager.md)

#### Returns

`void`

***

### setTextureManager()

> **setTextureManager**(`textureManager`): `void`

Defined in: [core/src/loader/LoaderManager.ts:111](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L111)

TextureManager を設定します。

#### Parameters

##### textureManager

[`TextureManager`](TextureManager.md)

#### Returns

`void`

***

### spritesheet()

> **spritesheet**(`key`, `url`, `config`): `this`

Defined in: [core/src/loader/LoaderManager.ts:213](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L213)

スプライトシートをキューに追加します。

引数形は Phaser と同じ `{ frameWidth, frameHeight }` オブジェクトです。

#### Parameters

##### key

`string`

##### url

`string`

##### config

[`SpritesheetConfig`](../interfaces/SpritesheetConfig.md)

#### Returns

`this`

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [core/src/loader/LoaderManager.ts:309](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L309)

キューに積まれたすべてのアセットを非同期でロードし、GPUテクスチャへ転送します。

キューが空でも `complete` を 1 度発火します（`once('complete')` の登録漏れを防ぐため）。

#### Returns

`Promise`\<`void`\>

***

### yaml()

> **yaml**(`key`, `url`): `this`

Defined in: [core/src/loader/LoaderManager.ts:273](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L273)

YAMLアセットをキューに追加します。

#### Parameters

##### key

`string`

##### url

`string`

#### Returns

`this`
