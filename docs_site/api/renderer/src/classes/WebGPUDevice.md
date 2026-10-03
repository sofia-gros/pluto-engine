[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [renderer/src](../README.md) / WebGPUDevice

# Class: WebGPUDevice

Defined in: [renderer/src/WebGPUDevice.ts:304](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L304)

## Implements

- [`GraphicsDevice`](../interfaces/GraphicsDevice.md)

## Constructors

### Constructor

> **new WebGPUDevice**(): `WebGPUDevice`

#### Returns

`WebGPUDevice`

## Properties

### limits

> **limits**: `GPUSupportedLimits` = `null`

Defined in: [renderer/src/WebGPUDevice.ts:326](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L326)

`adapter.limits` から読み取った実制約。レイアウト選択と検証に使います。

***

### textureHeight

> `readonly` **textureHeight**: `2048` = `2048`

Defined in: [renderer/src/WebGPUDevice.ts:337](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L337)

テクスチャ配列 1 レあたりの高さ (ピクセル)。[textureWidth](#texturewidth) と同じ基準。

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`textureHeight`](../interfaces/GraphicsDevice.md#textureheight)

***

### textureWidth

> `readonly` **textureWidth**: `2048` = `2048`

Defined in: [renderer/src/WebGPUDevice.ts:332](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L332)

テクスチャ配列 1 レあたりの幅 (ピクセル)。
フレーム UV の正規化基準になります。

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`textureWidth`](../interfaces/GraphicsDevice.md#texturewidth)

## Accessors

### renderingToTarget

#### Get Signature

> **get** **renderingToTarget**(): `boolean`

Defined in: [renderer/src/WebGPUDevice.ts:1158](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1158)

scene target を背景色で clear します。

target を**使い回す**ため、毎フレーム clear が/** Filter 経路の途中か（= スプライトがオフスクリーンへ描かれているか）

##### Returns

`boolean`

## Methods

### beginComputeCulling()

> **beginComputeCulling**(`rect`, `instanceCount`): `boolean`

Defined in: [renderer/src/WebGPUDevice.ts:1623](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1623)

compute カリングを実行し、間接描画引数を更新します (Phase 8 P-02)。

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

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`beginComputeCulling`](../interfaces/GraphicsDevice.md#begincomputeculling)

***

### beginSceneToTarget()

> **beginSceneToTarget**(`width`, `height`): `boolean`

Defined in: [renderer/src/WebGPUDevice.ts:1111](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1111)

スプライトを描き込むオフスクリーン target を作ります（既存は再利用）。

画面サイズが変わったときだけ作り直します。
filter 経路は毎フレーム `load` で上書きするため clear はここで 1 回だけ行います。

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`boolean`

***

### bindPipeline()

> **bindPipeline**(`pipeline`): `void`

Defined in: [renderer/src/WebGPUDevice.ts:1991](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1991)

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

Defined in: [renderer/src/WebGPUDevice.ts:811](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L811)

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

Defined in: [renderer/src/WebGPUDevice.ts:807](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L807)

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

### computeCullingStatus()

> **computeCullingStatus**(): `object`

Defined in: [renderer/src/WebGPUDevice.ts:1592](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1592)

compute カリングの各段階の状態を返します（診断用）。

`isComputeCullingSupported()` が false になる原因は 1 つではないため、
どの段階で落ちたかを bench に報告させます
（Phase 8 P-02 で「無言で compute が効かない」症状の切り分けに使用）。

#### Returns

`object`

##### attempts

> **attempts**: `number`

##### bufferCount

> **bufferCount**: `number`

##### enabled

> **enabled**: `boolean`

##### hasBindGroup

> **hasBindGroup**: `boolean`

##### hasIndirect

> **hasIndirect**: `boolean`

##### hasParams

> **hasParams**: `boolean`

##### hasPipeline

> **hasPipeline**: `boolean`

##### lastFail

> **lastFail**: `string`

##### limitOk

> **limitOk**: `boolean`

***

### createBuffer()

> **createBuffer**(`size`): [`BufferInfo`](../interfaces/BufferInfo.md)

Defined in: [renderer/src/WebGPUDevice.ts:570](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L570)

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

Defined in: [renderer/src/WebGPUDevice.ts:1972](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1972)

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

Defined in: [renderer/src/WebGPUDevice.ts:1995](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1995)

コンテキストとGPUリソースを解放します。

#### Returns

`void`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`destroy`](../interfaces/GraphicsDevice.md#destroy)

***

### drawInstanced()

> **drawInstanced**(`activeCount`, `baseInstance?`): `void`

Defined in: [renderer/src/WebGPUDevice.ts:1794](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1794)

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

### enableComputeCulling()

> **enableComputeCulling**(): `void`

Defined in: [renderer/src/WebGPUDevice.ts:933](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L933)

compute カリングを有効化します (Phase 8 P-02、既定は false)。

有効化は `init()` より前に呼ぶ必要があります
（バッファと feature を先に用意する必要があるためです）。

#### Returns

`void`

***

### enableTimestampQuery()

> **enableTimestampQuery**(): `void`

Defined in: [renderer/src/WebGPUDevice.ts:1776](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1776)

timestamp query を有効化します（検証用）。

有効化は `init()` より前に呼ぶ必要があります
（device 取得時に feature を要求する必要があるためです）。

#### Returns

`void`

***

### filterStatus()

> **filterStatus**(): `object`

Defined in: [renderer/src/WebGPUDevice.ts:1554](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1554)

Filter 経路の診断情報を返します（ベンチ用）。

`passes` が 0 なら filter が 1 度も実行されていません。
`lastError` があれば、その理由が入っています。

#### Returns

`object`

##### lastError

> **lastError**: `string`

##### passes

> **passes**: `number`

##### probe

> **probe**: \[`number`, `number`, `number`, `number`\]

##### probeSrc

> **probeSrc**: \[`number`, `number`, `number`, `number`\]

##### sceneProbe

> **sceneProbe**: \[`number`, `number`, `number`, `number`\]

##### swapHeight

> **swapHeight**: `number`

##### swapWidth

> **swapWidth**: `number`

##### targetHeight

> **targetHeight**: `number`

##### targetWidth

> **targetWidth**: `number`

***

### generateProceduralTexture()

> **generateProceduralTexture**(`key`, `type`, `width`, `height`, `options?`): [`TextureAsset`](../interfaces/TextureAsset.md)

Defined in: [renderer/src/WebGPUDevice.ts:713](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L713)

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

### getFilterScratchTexture()

> **getFilterScratchTexture**(): `GPUTexture`

Defined in: [renderer/src/WebGPUDevice.ts:1489](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1489)

RenderGraph から参照するための scratch texture getter

#### Returns

`GPUTexture`

***

### getSceneTexture()

> **getSceneTexture**(): `GPUTexture`

Defined in: [renderer/src/WebGPUDevice.ts:1484](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1484)

RenderGraph から参照するための texture getter

#### Returns

`GPUTexture`

***

### getTexture()

> **getTexture**(`key`): [`TextureAsset`](../interfaces/TextureAsset.md)

Defined in: [renderer/src/WebGPUDevice.ts:709](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L709)

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

Defined in: [renderer/src/WebGPUDevice.ts:345](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L345)

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

Defined in: [renderer/src/WebGPUDevice.ts:452](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L452)

スプライト・SDF等の標準シェーダーパイプラインを初期化します。

#### Returns

`void`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`initPipelines`](../interfaces/GraphicsDevice.md#initpipelines)

***

### isComputeCullingSupported()

> **isComputeCullingSupported**(): `boolean`

Defined in: [renderer/src/WebGPUDevice.ts:1083](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1083)

compute カリングが使える状態か。

#### Returns

`boolean`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`isComputeCullingSupported`](../interfaces/GraphicsDevice.md#iscomputecullingsupported)

***

### isFilterSupported()

> **isFilterSupported**(): `boolean`

Defined in: [renderer/src/WebGPUDevice.ts:1101](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1101)

Filter を適用できる状態か（WebGPU 限定）

#### Returns

`boolean`

***

### isTimestampQuerySupported()

> **isTimestampQuerySupported**(): `boolean`

Defined in: [renderer/src/WebGPUDevice.ts:1940](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1940)

timestamp query が使えるかを返します (デバッグ・報告用)。

#### Returns

`boolean`

***

### lastTimestampError()

> **lastTimestampError**(): `string`

Defined in: [renderer/src/WebGPUDevice.ts:2009](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L2009)

timestamp 読み出しの直近のエラーを返します (デバッグ・報告用)。

値が取れない原因を切り分けるためのものです。
正常な場合は空文字列を返します。

#### Returns

`string`

***

### lastTimestampRaw()

> **lastTimestampRaw**(`out`): `boolean`

Defined in: [renderer/src/WebGPUDevice.ts:2019](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L2019)

生読できた timestamp の生値を `out` へ書き出します (診断用)。

#### Parameters

##### out

`Float64Array`

2 要素のバッファ。`[0]` = begin, `[1]` = end

#### Returns

`boolean`

読み出せたか

***

### presentTarget()

> **presentTarget**(`srcTexture`): `boolean`

Defined in: [renderer/src/WebGPUDevice.ts:1438](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1438)

Filter 適用済みの texture を canvas へ 1 パスで blit します。

ここで初めて swapchain を書きます。Filter が無いときは
このメソッドを呼ばないので、canvas への直接描画のままです。

#### Parameters

##### srcTexture

`GPUTexture`

#### Returns

`boolean`

***

### probeSceneTarget()

> **probeSceneTarget**(): `void`

Defined in: [renderer/src/WebGPUDevice.ts:1185](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1185)

診断: scene target の中心画素を 1 つ読み戻します。

「scene が offscreen に入っているか」を推測せずに確認します。
読み戻しは非同期なので、値は [filterStatus](#filterstatus) から取得します。

#### Returns

`void`

***

### readPixels()

> **readPixels**(`out`, `width?`, `height?`): `boolean`

Defined in: [renderer/src/WebGPUDevice.ts:859](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L859)

現在の描画結果を読み戻します。

WebGPU は `GPUCommandEncoder.copyTextureToBuffer` + `mapAsync` が
**非同期**であるため、この同期インターフェースでは実装できません。
スクリーンショットは非同期版を別途用意する必要があり、
ここでは常に false を返して「未対応」を明示します。

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

Defined in: [renderer/src/WebGPUDevice.ts:1899](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1899)

直近の GPU 実行時間を返します (ms)。

非同期の map 読み出しなので、**実測できる帧まで -1 を返します**。
ベンチは連続してフレームを回して中央値を取ってください。

#### Returns

`number`

GPU 時間 (ms)。非対応・未計測なら -1

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`resolveGpuTimeMs`](../interfaces/GraphicsDevice.md#resolvegputimems)

***

### resolveVisibleCount()

> **resolveVisibleCount**(): `number`

Defined in: [renderer/src/WebGPUDevice.ts:1684](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1684)

直近の compute カリングで数えた可視インスタンス数を返します (Phase 8 P-02)。

**間接描画は CPU から見た描画数を返さないため、この値が唯一の
「本当に何体描いたか」の証拠になります。** ベンチはこれを必ず報告します。

読み出しは非同期です。実測できるフレームまで -1 を返します。

#### Returns

`number`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`resolveVisibleCount`](../interfaces/GraphicsDevice.md#resolvevisiblecount)

***

### runFilterPass()

> **runFilterPass**(`wgsl`, `srcTexture`, `dstTexture`, `uniforms`, `probe?`): `boolean`

Defined in: [renderer/src/WebGPUDevice.ts:1228](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1228)

#### Parameters

##### wgsl

`string`

##### srcTexture

`GPUTexture`

##### dstTexture

`GPUTexture`

##### uniforms

`Float32Array`

##### probe?

`boolean` = `false`

#### Returns

`boolean`

***

### setCullRect()

> **setCullRect**(`rect`, `enabled`): `void`

Defined in: [renderer/src/WebGPUDevice.ts:1962](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1962)

GPU カリングの可視矩形を設定します（Phase 8 P-03）。

有効にすると頂点シェーダが矩形外のクワッドを縮退三角形にして破棄します。
uniform バッファは 96 バイト（offset 80 が gpuCull、84 が cullRect）です。

#### Parameters

##### rect

`Float32Array`

##### enabled

`boolean`

#### Returns

`void`

#### Implementation of

[`GraphicsDevice`](../interfaces/GraphicsDevice.md).[`setCullRect`](../interfaces/GraphicsDevice.md#setcullrect)

***

### setUniformMatrix4fv()

> **setUniformMatrix4fv**(`name`, `matrix`): `void`

Defined in: [renderer/src/WebGPUDevice.ts:1944](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L1944)

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

Defined in: [renderer/src/WebGPUDevice.ts:837](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L837)

インスタンス用バッファのバインド内容を記録します。

**pack は行いません。** 転送元は `InstanceBufferArena` の
write-through ミラーで、すでに vec4 単位にまとまっています。
そのためこのメソッドは O(1) の記録のみで済みます。

`baseInstance` は可視区間の先頭インスタンス番号です。
実際の `setVertexBuffer` は `drawInstanced` の中で行います
（WebGL2 の VAO と同じ「カメラ単位の属性設定」に合わせます）。

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

Defined in: [renderer/src/WebGPUDevice.ts:595](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L595)

packed ミラー配列を GPU へ転送します。

WebGL2 と同じく subarray を new せず、範囲を直接指定します。

転送元の配列は `InstanceBufferArena` の write-through ミラーなので、
**このメソッドは pack を行いません。** 行うのは転送だけです。
そのため 1 フレームあたり O(1) のコマンド発行で済みます。

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

Defined in: [renderer/src/WebGPUDevice.ts:625](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/renderer/src/WebGPUDevice.ts#L625)

画像を Texture2DArray の 1 層へ転送します。
Canvas / ImageData / ImageBitmap をすべて扱えるよう、
必要なら一時的に 2D Canvas へ描画してから readPixels します。

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
