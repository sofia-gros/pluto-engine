[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [renderer/src](../README.md) / GraphicsDevice

# Interface: GraphicsDevice

Defined in: [renderer/src/GraphicsDevice.ts:46](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L46)

## Properties

### textureHeight

> `readonly` **textureHeight**: `number`

Defined in: [renderer/src/GraphicsDevice.ts:86](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L86)

テクスチャ配列 1 レあたりの高さ (ピクセル)。[textureWidth](#texturewidth) と同じ基準。

***

### textureWidth

> `readonly` **textureWidth**: `number`

Defined in: [renderer/src/GraphicsDevice.ts:82](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L82)

テクスチャ配列 1 レあたりの幅 (ピクセル)。

フレーム UV の正規化はこのレイヤー寸法が基準になります。
ソース画像がレイヤーより小さい場合、画像は左上に寄せて配置され、
残りは未使用領域となるため、ソース寸法で正規化してはいけません。

## Methods

### beginComputeCulling()?

> `optional` **beginComputeCulling**(`rect`, `instanceCount`): `boolean`

Defined in: [renderer/src/GraphicsDevice.ts:218](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L218)

compute カリングを実行し、間接描画引数を更新します (Phase 8 P-02)。

頂点シェーダによる GPU カリング（P-03）と違い、**可視インスタンスだけを
描画します**。CPU コスト，切れない上に GPU 側も減るため、両方の 利得を
同時に得られます。コストは画面外も compute が 1 件ずつ判定する点です。

対応していないバックエンドでは何もしず false を返します（optional）。

#### Parameters

##### rect

`Float32Array`

可視矩形 (minX, minY, maxX, maxY)

##### instanceCount

`number`

判定対象のインスタンス数

#### Returns

`boolean`

dispatch を行ったか

***

### bindPipeline()

> **bindPipeline**(`pipeline`): `void`

Defined in: [renderer/src/GraphicsDevice.ts:241](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L241)

パイプラインをバインドします。

#### Parameters

##### pipeline

[`PipelineInfo`](PipelineInfo.md)

#### Returns

`void`

***

### bindShaders()

> **bindShaders**(`sdfThreshold?`, `sdfSmoothing?`): `void`

Defined in: [renderer/src/GraphicsDevice.ts:124](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L124)

スプライト描画用シェーダーとテクスチャ配列をバインドします。

#### Parameters

##### sdfThreshold?

`number`

SDF テキストの輪郭位置 (0.5 が縁)

##### sdfSmoothing?

`number`

輪郭をぼかす幅

#### Returns

`void`

***

### clear()

> **clear**(`r`, `g`, `b`, `a`): `void`

Defined in: [renderer/src/GraphicsDevice.ts:116](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L116)

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

***

### createBuffer()

> **createBuffer**(`size`): [`BufferInfo`](BufferInfo.md)

Defined in: [renderer/src/GraphicsDevice.ts:60](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L60)

ストリーミングデータ用のGPUバッファを作成します。

#### Parameters

##### size

`number`

#### Returns

[`BufferInfo`](BufferInfo.md)

***

### createPipeline()

> **createPipeline**(`vertSource`, `fragSource`): [`PipelineInfo`](PipelineInfo.md)

Defined in: [renderer/src/GraphicsDevice.ts:236](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L236)

シェーダーパイプラインを作成します。

#### Parameters

##### vertSource

`string`

##### fragSource

`string`

#### Returns

[`PipelineInfo`](PipelineInfo.md)

***

### destroy()

> **destroy**(): `void`

Defined in: [renderer/src/GraphicsDevice.ts:246](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L246)

コンテキストとGPUリソースを解放します。

#### Returns

`void`

***

### drawInstanced()

> **drawInstanced**(`activeCount`, `baseInstance?`): `void`

Defined in: [renderer/src/GraphicsDevice.ts:152](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L152)

インスタンスを描画します。

#### Parameters

##### activeCount

`number`

描画するインスタンス数

##### baseInstance?

`number`

描画開始インスタンスのインデックス

#### Returns

`void`

***

### generateProceduralTexture()

> **generateProceduralTexture**(`key`, `type`, `width`, `height`, `options?`): [`TextureAsset`](TextureAsset.md)

Defined in: [renderer/src/GraphicsDevice.ts:105](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L105)

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

[`TextureAsset`](TextureAsset.md)

***

### getTexture()

> **getTexture**(`key`): [`TextureAsset`](TextureAsset.md)

Defined in: [renderer/src/GraphicsDevice.ts:100](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L100)

登録済みテクスチャアセットを取得します。

#### Parameters

##### key

`string`

#### Returns

[`TextureAsset`](TextureAsset.md)

***

### init()

> **init**(`canvas`): `Promise`\<`void`\>

Defined in: [renderer/src/GraphicsDevice.ts:50](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L50)

グラフィックスコンテキストを初期化します。

#### Parameters

##### canvas

`HTMLCanvasElement`

#### Returns

`Promise`\<`void`\>

***

### initPipelines()

> **initPipelines**(): `void`

Defined in: [renderer/src/GraphicsDevice.ts:55](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L55)

スプライト・SDF等の標準シェーダーパイプラインを初期化します。

#### Returns

`void`

***

### isComputeCullingSupported()?

> `optional` **isComputeCullingSupported**(): `boolean`

Defined in: [renderer/src/GraphicsDevice.ts:221](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L221)

compute カリングが使える状態か (Phase 8 P-02)。

#### Returns

`boolean`

***

### readPixels()

> **readPixels**(`out`, `width?`, `height?`): `boolean`

Defined in: [renderer/src/GraphicsDevice.ts:169](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L169)

現在の描画結果を `out` へ読み戻します。

スクリーンショット取得や、golden テスト（描画の回帰検出）に使います。
GPU 側では毎フレームの定常経路ではないため、遅延確保を許します。

**左上原点**の RGBA 8bit の tight 配列で返します
（WebGL の `readPixels` は下原点のため、行を反転して渡します）。
キャンバスの設定によりアルファは premultiplied です。

#### Parameters

##### out

`Uint8Array`

`width * height * 4` 要素の受け先（呼び出し側の使い回し配列）

##### width?

`number`

既定は描画バッファの幅

##### height?

`number`

既定は描画バッファの高さ

#### Returns

`boolean`

読み戻せたなら true。対応しないバックエンドやコンテキスト喪失中なら false

***

### resolveGpuTimeMs()?

> `optional` **resolveGpuTimeMs**(): `number`

Defined in: [renderer/src/GraphicsDevice.ts:203](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L203)

直近の GPU 実行時間を返します (Phase 8 P-02)。

ドローコール発行は非同期なので、CPU 時間だけでは
「カリングを GPU に移した副作用（頂点処理の増）」を観測できません。
WebGPU の timestamp query で実測します。

非対応・未計測のときは -1 を返します（optional なので
未実装のバックエンドではこのメソッド自体がありません）。

**読み出しは非同期**です。実測できるフレームまで -1 が返るため、
ベンチは連続してフレームを回して中央値を取る必要があります。

#### Returns

`number`

***

### resolveVisibleCount()?

> `optional` **resolveVisibleCount**(): `number`

Defined in: [renderer/src/GraphicsDevice.ts:231](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L231)

compute カリングで数えた可視インスタンス数を返します (Phase 8 P-02)。

**間接描画は CPU から見た描画数を返さないため、.compute カリングの
実効性を示す唯一の証拠です。** ベンチはこれを報告します。

読み出しは非同期です。実測できるフレームまで -1 を返します。

#### Returns

`number`

***

### setCullRect()?

> `optional` **setCullRect**(`rect`, `enabled`): `void`

Defined in: [renderer/src/GraphicsDevice.ts:188](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L188)

GPU カリングの可視矩形を設定します（Phase 8 P-03）。

有効にすると頂点シェーダが矩形外のクワッドを縮退三角形へ変換し、
ラスタライザに破棄させます。これにより CPU 側の SoA の詰め替え
（`partitionVisible`）が不要になります。

未実装のバックエンドでは何もしません（optional）。

#### Parameters

##### rect

`Float32Array`

`(minX, minY, maxX, maxY)` のワールド座標 4 要素

##### enabled

`boolean`

false で頂点シェーダのカリングを無効にします

#### Returns

`void`

***

### setUniformMatrix4fv()

> **setUniformMatrix4fv**(`name`, `matrix`): `void`

Defined in: [renderer/src/GraphicsDevice.ts:174](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L174)

uniform マトリックスを設定します。

#### Parameters

##### name

`string`

##### matrix

`Float32Array`

#### Returns

`void`

***

### setupInstancedAttributes()

> **setupInstancedAttributes**(`buffers`, `activeCount?`, `baseInstance?`): `void`

Defined in: [renderer/src/GraphicsDevice.ts:140](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L140)

インスタンシング描画用の頂点属性を設定します。

`buffers` は `InstanceBufferArena` の `packed*` ミラーに対応する
GPU バッファ表です（`INSTANCE_BUFFERS` の name がキーになります）。

#### Parameters

##### buffers

`Record`\<`string`, [`BufferInfo`](BufferInfo.md)\>

パック済みバッファの表

##### activeCount?

`number`

描画するインスタンス数

##### baseInstance?

`number`

描画開始インスタンスのインデックス。
                    可視区間だけを描画したい場合に使います。
                    WebGPU には `firstInstance` 引数がありますが、
                    WebGL2 には無いので `vertexAttribPointer` の
                    `byteOffset` へ加算して実現します。

#### Returns

`void`

***

### updateBuffer()

> **updateBuffer**(`bufferInfo`, `data`, `srcOffset?`, `length?`): `void`

Defined in: [renderer/src/GraphicsDevice.ts:68](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L68)

GPUバッファをゼロアロケーションで更新します。

`subarray()` は毎回新しいビューオブジェクトをヒープへ確保するため使わないでください。
配列全体と範囲 (srcOffset / length) を渡し、転送したい範囲だけを GPU へ送ります。

#### Parameters

##### bufferInfo

[`BufferInfo`](BufferInfo.md)

##### data

`Float32Array`\<`ArrayBufferLike`\> \| `Uint32Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>

##### srcOffset?

`number`

##### length?

`number`

#### Returns

`void`

***

### uploadTexture()

> **uploadTexture**(`key`, `source`, `options?`): [`TextureAsset`](TextureAsset.md)

Defined in: [renderer/src/GraphicsDevice.ts:91](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/GraphicsDevice.ts#L91)

画像・Canvas・BitmapをGPUのTexture2DArrayに転送し、テクスチャアセットを登録します。

#### Parameters

##### key

`string`

##### source

`HTMLCanvasElement` \| `HTMLImageElement` \| `ImageBitmap` \| `ImageData`

##### options?

[`TextureUploadOptions`](TextureUploadOptions.md)

#### Returns

[`TextureAsset`](TextureAsset.md)
