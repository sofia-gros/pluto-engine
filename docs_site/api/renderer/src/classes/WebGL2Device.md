[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [renderer/src](../README.md) / WebGL2Device

# Class: WebGL2Device

Defined in: [renderer/src/WebGL2Device.ts:178](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L178)

## Implements

- [`GraphicsDevice`](../interfaces/GraphicsDevice.md)

## Constructors

### Constructor

> **new WebGL2Device**(): `WebGL2Device`

#### Returns

`WebGL2Device`

## Properties

### maxLayers

> **maxLayers**: `number` = `64`

Defined in: [renderer/src/WebGL2Device.ts:225](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L225)

***

### textureHeight

> **textureHeight**: `number` = `1024`

Defined in: [renderer/src/WebGL2Device.ts:224](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L224)

テクスチャ配列 1 レあたりの高さ (ピクセル)。[textureWidth](../interfaces/GraphicsDevice.md#texturewidth) と同じ基準。

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`textureHeight`](../interfaces/GraphicsDevice.md#textureheight)

***

### textureWidth

> **textureWidth**: `number` = `1024`

Defined in: [renderer/src/WebGL2Device.ts:223](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L223)

テクスチャ配列のサイズ設定。

3D テクスチャの領域は width * height * 4 * layers バイトを
丸ごと確保します。**この確保は失敗しても GL エラーになりません。**
ANGLE/Vulkan は `texImage3D` のメモリ不足で
コンテキストごと破棄します (`CONTEXT_LOST_WEBGL`)。
そのため「大きめに確保してから縮小リトライ」は構造上できず、
最初から安全な既定値で確保する必要があります。

実測: 2048 x 2048 x 64 は **1 GB** で、GitHub Actions ランナー
(7 GB / SwiftShader) では確実にコンテキストが失効し、
全デモが「60 FPS でruns したまま何も描画されない」状態になりました。
1 GB を要求するゲームエンジンとしては異常な値です。

既定値は 1024 x 1024 x 64 = **256 MB** にしました。
2D ドット絵向けテクスチャなら 1 レイヤーあたり 1024px あれば
数百〜数千スプライトを余裕で格納できます。

メモリがさらに限られる環境では `?textureSize=512` (64 MB) を
付けて指定できます。

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`textureWidth`](../interfaces/GraphicsDevice.md#texturewidth)

## Methods

### bindPipeline()

> **bindPipeline**(`pipeline`): `void`

Defined in: [renderer/src/WebGL2Device.ts:841](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L841)

パイプラインをバインドします。

#### Parameters

##### pipeline

[`PipelineInfo`](../interfaces/PipelineInfo.md)

#### Returns

`void`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`bindPipeline`](../interfaces/GraphicsDevice.md#bindpipeline)

***

### bindShaders()

> **bindShaders**(`sdfThreshold?`, `sdfSmoothing?`): `void`

Defined in: [renderer/src/WebGL2Device.ts:673](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L673)

スプライト描画用シェーダーとテクスチャ配列をバインドします。

#### Parameters

##### sdfThreshold?

`number` = `0.5`

SDF テキストの輪郭位置 (0.5 が縁)

##### sdfSmoothing?

`number` = `0.08`

輪郭をぼかす幅

#### Returns

`void`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`bindShaders`](../interfaces/GraphicsDevice.md#bindshaders)

***

### clear()

> **clear**(`r`, `g`, `b`, `a`): `void`

Defined in: [renderer/src/WebGL2Device.ts:663](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L663)

画面をクリアします。

#### Parameters

##### r

`number`

##### g

`number`

##### b

`number`

##### a

`number`

#### Returns

`void`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`clear`](../interfaces/GraphicsDevice.md#clear)

***

### createBuffer()

> **createBuffer**(`size`): [`BufferInfo`](../interfaces/BufferInfo.md)

Defined in: [renderer/src/WebGL2Device.ts:623](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L623)

ストリーミングデータ用のGPUバッファを作成します。

#### Parameters

##### size

`number`

#### Returns

[`BufferInfo`](../interfaces/BufferInfo.md)

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`createBuffer`](../interfaces/GraphicsDevice.md#createbuffer)

***

### createPipeline()

> **createPipeline**(`vertSource`, `fragSource`): [`PipelineInfo`](../interfaces/PipelineInfo.md)

Defined in: [renderer/src/WebGL2Device.ts:809](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L809)

シェーダーパイプラインを作成します。

#### Parameters

##### vertSource

`string`

##### fragSource

`string`

#### Returns

[`PipelineInfo`](../interfaces/PipelineInfo.md)

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`createPipeline`](../interfaces/GraphicsDevice.md#createpipeline)

***

### destroy()

> **destroy**(): `void`

Defined in: [renderer/src/WebGL2Device.ts:1046](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L1046)

コンテキストとGPUリソースを解放します。

#### Returns

`void`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`destroy`](../interfaces/GraphicsDevice.md#destroy)

***

### drawInstanced()

> **drawInstanced**(`activeCount`, `baseInstance?`): `void`

Defined in: [renderer/src/WebGL2Device.ts:894](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L894)

インスタンスを描画します。

#### Parameters

##### activeCount

`number`

描画するインスタンス数

##### baseInstance?

`number` = `0`

描画開始インスタンスのインデックス

#### Returns

`void`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`drawInstanced`](../interfaces/GraphicsDevice.md#drawinstanced)

***

### enableTimestampQuery()

> **enableTimestampQuery**(): `void`

Defined in: [renderer/src/WebGL2Device.ts:996](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L996)

timestamp query を有効化します。`init()` より前に呼ぶ必要があります。

#### Returns

`void`

***

### generateProceduralTexture()

> **generateProceduralTexture**(`key`, `type`, `width`, `height`, `options?`): [`TextureAsset`](../interfaces/TextureAsset.md)

Defined in: [renderer/src/WebGL2Device.ts:494](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L494)

プロシージャルテクスチャをGPUで生成し、TextureAssetとして登録します。

#### Parameters

##### key

`string`

##### type

`"gradient"` \| `"noise"`

##### width

`number`

##### height

`number`

##### options?

`any`

#### Returns

[`TextureAsset`](../interfaces/TextureAsset.md)

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`generateProceduralTexture`](../interfaces/GraphicsDevice.md#generateproceduraltexture)

***

### getTexture()

> **getTexture**(`key`): [`TextureAsset`](../interfaces/TextureAsset.md)

Defined in: [renderer/src/WebGL2Device.ts:490](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L490)

登録済みテクスチャアセットを取得します。

#### Parameters

##### key

`string`

#### Returns

[`TextureAsset`](../interfaces/TextureAsset.md)

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`getTexture`](../interfaces/GraphicsDevice.md#gettexture)

***

### init()

> **init**(`canvas`): `Promise`\<`void`\>

Defined in: [renderer/src/WebGL2Device.ts:240](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L240)

グラフィックスコンテキストを初期化します。

#### Parameters

##### canvas

`HTMLCanvasElement`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`init`](../interfaces/GraphicsDevice.md#init)

***

### initPipelines()

> **initPipelines**(): `void`

Defined in: [renderer/src/WebGL2Device.ts:590](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L590)

スプライト・SDF等の標準シェーダーパイプラインを初期化します。

#### Returns

`void`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`initPipelines`](../interfaces/GraphicsDevice.md#initpipelines)

***

### isContextLost()

> **isContextLost**(): `boolean`

Defined in: [renderer/src/WebGL2Device.ts:306](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L306)

コンテキストが失効していないか

#### Returns

`boolean`

***

### isTimestampQuerySupported()

> **isTimestampQuerySupported**(): `boolean`

Defined in: [renderer/src/WebGL2Device.ts:919](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L919)

GPU 時間計測が有効か（`enableTimestampQuery` 後かつ拡張が存在）

#### Returns

`boolean`

***

### lastTimestampError()

> **lastTimestampError**(): `string`

Defined in: [renderer/src/WebGL2Device.ts:924](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L924)

読み出しに失敗したときの理由（切り分け用）

#### Returns

`string`

***

### readPixels()

> **readPixels**(`out`, `width?`, `height?`): `boolean`

Defined in: [renderer/src/WebGL2Device.ts:863](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L863)

現在の描画結果を `out` へ読み戻します。

WebGL は `readPixels` を合成前に呼ぶ必要があるため、
**フレームの draw と同じタスク内**から呼ぶ必要があります。
ブラウザのスクリーンショット取得は `canvas.toDataURL` を使ってください。

#### Parameters

##### out

`Uint8Array`

##### width?

`number`

##### height?

`number`

#### Returns

`boolean`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`readPixels`](../interfaces/GraphicsDevice.md#readpixels)

***

### resolveGpuTimeMs()

> **resolveGpuTimeMs**(): `number`

Defined in: [renderer/src/WebGL2Device.ts:934](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L934)

直近に読み出せた GPU 時間 (ms) を返します。計測できなければ -1。

`GPU_DISJOINT_EXT` が立ったフレームの値は破棄します
（timer query の値は交差時に不正になるためです）。

#### Returns

`number`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`resolveGpuTimeMs`](../interfaces/GraphicsDevice.md#resolvegputimems)

***

### setCullRect()

> **setCullRect**(`rect`, `enabled`): `void`

Defined in: [renderer/src/WebGL2Device.ts:703](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L703)

GPU カリングの可視矩形を設定します。

有効にすると、頂点シェーダが可視矩形の外にあるクワッドを
縮退三角形にして破棄します。これにより CPU 側の SoA 詰め替え
（`partitionVisible`）が不要になり、インスタンス数に比例する
CPU コストが消えます。

#### Parameters

##### rect

`Float32Array`

`(minX, minY, maxX, maxY)` のワールド座標 4 要素

##### enabled

`boolean`

false の場合は頂点シェーダのカリングを無効にします

#### Returns

`void`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`setCullRect`](../interfaces/GraphicsDevice.md#setcullrect)

***

### setUniformMatrix4fv()

> **setUniformMatrix4fv**(`name`, `matrix`): `void`

Defined in: [renderer/src/WebGL2Device.ts:847](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L847)

uniform マトリックスを設定します。

#### Parameters

##### name

`string`

##### matrix

`Float32Array`

#### Returns

`void`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`setUniformMatrix4fv`](../interfaces/GraphicsDevice.md#setuniformmatrix4fv)

***

### setupInstancedAttributes()

> **setupInstancedAttributes**(`buffers`, `activeCount?`, `baseInstance?`): `void`

Defined in: [renderer/src/WebGL2Device.ts:719](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L719)

インスタンス属性を VAO へ設定します。

`baseInstance` を指定すると、可視区間の先頭インスタンスだけを描画できます。
WebGL2 には `firstInstance`  引数が無い代替として、
`vertexAttribPointer` の `byteOffset`（インスタンス index に加算される）を使います。

#### Parameters

##### buffers

`Record`\<`string`, [`BufferInfo`](../interfaces/BufferInfo.md)\>

##### activeCount?

`number`

##### baseInstance?

`number` = `0`

#### Returns

`void`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`setupInstancedAttributes`](../interfaces/GraphicsDevice.md#setupinstancedattributes)

***

### updateBuffer()

> **updateBuffer**(`bufferInfo`, `data`, `srcOffset?`, `length?`): `void`

Defined in: [renderer/src/WebGL2Device.ts:644](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L644)

packed ミラーを GPU へ転送します。

`TypedArray.prototype.subarray()` は呼び出しごとに新しいビューオブジェクトを
ヒープへ確保するため、毎フレーム呼ぶとゼロアロケーションの掟に反します。
WebGL2 の bufferSubData は srcOffset / length を受け取れるため、
配列全体と範囲だけを渡し、ビュー生成を完全に排除します。

#### Parameters

##### bufferInfo

[`BufferInfo`](../interfaces/BufferInfo.md)

##### data

`Float32Array`\<`ArrayBufferLike`\> \| `Uint32Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>

##### srcOffset?

`number` = `0`

##### length?

`number`

#### Returns

`void`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`updateBuffer`](../interfaces/GraphicsDevice.md#updatebuffer)

***

### uploadTexture()

> **uploadTexture**(`key`, `source`, `options?`): [`TextureAsset`](../interfaces/TextureAsset.md)

Defined in: [renderer/src/WebGL2Device.ts:404](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGL2Device.ts#L404)

画像・Canvasを GPU の Texture2DArray に転送し、スプライト用の TextureAsset を生成します。

#### Parameters

##### key

`string`

##### source

`HTMLCanvasElement` \| `HTMLImageElement` \| `ImageBitmap` \| `ImageData`

##### options?

[`TextureUploadOptions`](../interfaces/TextureUploadOptions.md)

#### Returns

[`TextureAsset`](../interfaces/TextureAsset.md)

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`uploadTexture`](../interfaces/GraphicsDevice.md#uploadtexture)
