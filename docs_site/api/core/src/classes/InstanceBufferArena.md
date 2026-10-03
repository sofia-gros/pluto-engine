[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / InstanceBufferArena

# Class: InstanceBufferArena

Defined in: [core/src/arena/InstanceBufferArena.ts:113](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L113)

## Constructors

### Constructor

> **new InstanceBufferArena**(`maxInstances`): `InstanceBufferArena`

Defined in: [core/src/arena/InstanceBufferArena.ts:374](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L374)

#### Parameters

##### maxInstances

`number`

#### Returns

`InstanceBufferArena`

## Properties

### active

> `readonly` **active**: `Uint8Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:163](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L163)

1 = update / render の対象、0 = スキップ。Phaser の `active`。

***

### animTracker

> **animTracker**: [`AnimPlayTarget`](../interfaces/AnimPlayTarget.md) = `null`

Defined in: [core/src/arena/InstanceBufferArena.ts:291](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L291)

アニメーション再生の委譲先。Scene 構築時に差し込まれる。

***

### assetRef

> `readonly` **assetRef**: [`SpriteAssetLike`](../interfaces/SpriteAssetLike.md)[]

Defined in: [core/src/arena/InstanceBufferArena.ts:229](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L229)

SoA 内の「参照」を保持する密配列。
Sprite インスタンス側 (Flyweight) にアセット参照を持たせ aesthetically 32Byte を守るために、
参照はここへ集約する。Flyweight パターンの純度を保つための「SoA 版フィールド」。

***

### blendMode

> `readonly` **blendMode**: `Uint8Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:167](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L167)

`BlendMode` の値。バッチ分割のキーになります。

***

### bodyFactory

> **bodyFactory**: (`entityId`) => [`Body`](Body.md) = `null`

Defined in: [core/src/arena/InstanceBufferArena.ts:300](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L300)

Body ハンドルのファクトリ。Scene が登録します。

Sprite は Scene 参照を持たないため、Body はこの注入された
ファクトリ経由で取得します。キャッシュは Scene 側にあるため、
呼び出しごとに new は発生しません。

#### Parameters

##### entityId

`number`

#### Returns

[`Body`](Body.md)

***

### capacity

> `readonly` **capacity**: `number`

Defined in: [core/src/arena/InstanceBufferArena.ts:114](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L114)

***

### depth

> `readonly` **depth**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:140](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L140)

***

### dirtyDepth

> **dirtyDepth**: `boolean` = `true`

Defined in: [core/src/arena/InstanceBufferArena.ts:264](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L264)

***

### dirtyExtGroup

> **dirtyExtGroup**: `boolean` = `false`

Defined in: [core/src/arena/InstanceBufferArena.ts:284](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L284)

`packedExt` が前回転送時から変化したかどうか。

***

### dirtyFlagsGroup

> **dirtyFlagsGroup**: `boolean` = `true`

Defined in: [core/src/arena/InstanceBufferArena.ts:276](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L276)

`packedFlags` が前回転送時から変化したかどうか。

***

### dirtyFrameIdx

> **dirtyFrameIdx**: `boolean` = `true`

Defined in: [core/src/arena/InstanceBufferArena.ts:262](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L262)

***

### dirtyHierarchy

> **dirtyHierarchy**: `boolean` = `true`

Defined in: [core/src/arena/InstanceBufferArena.ts:265](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L265)

***

### dirtyIsText

> **dirtyIsText**: `boolean` = `false`

Defined in: [core/src/arena/InstanceBufferArena.ts:368](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L368)

isText バッファが前回転送時から変化したかどうか。
false のフレームは GPU 側に前回の内容が残っているので送信不要です。

***

### dirtyOriginGroup

> **dirtyOriginGroup**: `boolean` = `true`

Defined in: [core/src/arena/InstanceBufferArena.ts:280](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L280)

`packedOrigin` (originX / originY / scrollFactorX / scrollFactorY) が変化したかどうか。

***

### dirtyPos

> **dirtyPos**: `boolean` = `true`

Defined in: [core/src/arena/InstanceBufferArena.ts:258](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L258)

***

### dirtyRotation

> **dirtyRotation**: `boolean` = `true`

Defined in: [core/src/arena/InstanceBufferArena.ts:259](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L259)

***

### dirtyScale

> **dirtyScale**: `boolean` = `true`

Defined in: [core/src/arena/InstanceBufferArena.ts:260](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L260)

***

### dirtyShapeGroup

> **dirtyShapeGroup**: `boolean` = `true`

Defined in: [core/src/arena/InstanceBufferArena.ts:278](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L278)

`packedShape` (rotation / frameWidth / frameHeight / depth) が変化したかどうか。

***

### dirtyTint

> **dirtyTint**: `boolean` = `true`

Defined in: [core/src/arena/InstanceBufferArena.ts:263](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L263)

***

### dirtyTintGroup

> **dirtyTintGroup**: `boolean` = `true`

Defined in: [core/src/arena/InstanceBufferArena.ts:282](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L282)

`packedTint` が前回転送時から変化したかどうか。

***

### dirtyTransformGroup

> **dirtyTransformGroup**: `boolean` = `true`

Defined in: [core/src/arena/InstanceBufferArena.ts:272](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L272)

`packedTransform` が前回転送時から変化したかどうか。
write-through セッターが自動で立てます。

***

### dirtyUv

> **dirtyUv**: `boolean` = `true`

Defined in: [core/src/arena/InstanceBufferArena.ts:261](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L261)

***

### dirtyUvGroup

> **dirtyUvGroup**: `boolean` = `true`

Defined in: [core/src/arena/InstanceBufferArena.ts:274](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L274)

`packedUv` が前回転送時から変化したかどうか。

***

### dirtyVisible

> **dirtyVisible**: `boolean` = `false`

Defined in: [core/src/arena/InstanceBufferArena.ts:372](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L372)

visible バッファが前回転送時から変化したかどうか。

***

### facing

> `readonly` **facing**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:139](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L139)

***

### frameHeight

> `readonly` **frameHeight**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:138](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L138)

現在のフレームのピクセル高さ。`frameWidth` と同じ扱い。

***

### frameIdx

> `readonly` **frameIdx**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:180](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L180)

***

### frameWidth

> `readonly` **frameWidth**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:136](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L136)

現在のフレームのピクセル幅。

頂点シェーダはクワッドの大きさを `frameWidth * scaleX` で決めるため、
テクスチャのピクセル寸法が必要です。
テクスチャ未設定時は `DEFAULT_FRAME_SIZE` を入れます。

***

### hasHierarchy

> **hasHierarchy**: `boolean` = `false`

Defined in: [core/src/arena/InstanceBufferArena.ts:357](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L357)

親子関係を持つエンティティが 1 体でも存在するかどうか。
false の間はワールド変換の解決を丸ごと省略できます。
ゲームが直接 posX を書き換える運用にも影響しないため、このフラグで経路を分けます。

***

### hasText

> **hasText**: `boolean` = `false`

Defined in: [core/src/arena/InstanceBufferArena.ts:363](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L363)

SDF テキストのインスタンスが 1 つでも存在するかどうか。
false の間は isText バッファの転送を丸ごと省略できます。

***

### hitHeight

> `readonly` **hitHeight**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:249](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L249)

***

### hitWidth

> `readonly` **hitWidth**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:248](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L248)

***

### idToIndex

> `readonly` **idToIndex**: `Int32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:254](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L254)

***

### indexToId

> `readonly` **indexToId**: `Int32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:255](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L255)

***

### interactive

> `readonly` **interactive**: `Uint8Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:247](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L247)

***

### isText

> `readonly` **isText**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:187](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L187)

1.0 のインスタンスは SDF テキストとして描画します。
0.0 は通常のスプライトです。
頂点属性 14 として渡し、フラグメントシェーダーで描画方式を分岐させます。

***

### kind

> `readonly` **kind**: `Uint8Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:171](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L171)

`type` の数値表現。文字列は `kindNames` から返します。

***

### kindNames

> `readonly` **kindNames**: `string`[]

Defined in: [core/src/arena/InstanceBufferArena.ts:175](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L175)

`kind` が参照する文字列プール。

***

### localRotation

> `readonly` **localRotation**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:237](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L237)

***

### localX

> `readonly` **localX**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:235](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L235)

親から見たローカル位置 (parentId >= 0 のときだけ使用)

***

### localY

> `readonly` **localY**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:236](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L236)

***

### namePool

> `readonly` **namePool**: `string`[] = `[]`

Defined in: [core/src/arena/InstanceBufferArena.ts:173](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L173)

`nameSlot` が参照する文字列プール。`addName()` で grown します。

***

### nameSlot

> `readonly` **nameSlot**: `Int32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:169](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L169)

`setName` で設定した文字列のスロット番号（-1 = 未設定）。

***

### originX

> `readonly` **originX**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:150](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L150)

描画原点の X 座標 (0.0〜1.0)。

Phaser の既定は 0.5, 0.5（スプライトの中心）です。
クワッドはこの値を引いてから `frameSize * scale` で拡大するため、
頂点シェーダ側で処理します。

***

### originY

> `readonly` **originY**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:152](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L152)

描画原点の Y 座標 (0.0〜1.0)。既定 0.5。

***

### packedExt

> `readonly` **packedExt**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:222](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L222)

ユーザー拡張用の `vec4` × 4（1 インスタンス 64 バイト）。
エンジンは書き込みません。利用側が `setExt` 経由で使います。

***

### packedFlags

> `readonly` **packedFlags**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:211](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L211)

`frameIdx, facing, visible, isText` を 1 インスタンス 16 バイトに詰めたミラー。

***

### packedOrigin

> `readonly` **packedOrigin**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:217](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L217)

`originX, originY, scrollFactorX, scrollFactorY` を 1 インスタンス 16 バイトに詰めたミラー。

***

### packedShape

> `readonly` **packedShape**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:213](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L213)

`rotation, frameWidth, frameHeight, depth` を 1 インスタンス 16 バイトに詰めたミラー。

***

### packedTint

> `readonly` **packedTint**: `Uint32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:215](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L215)

`RGBA` を 1 インスタンス 4 バイト (unorm8x4) で保持するミラー。

***

### packedTransform

> `readonly` **packedTransform**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:207](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L207)

`posX, posY, scaleX, scaleY` を 1 インスタンス 16 バイトに詰めたミラー。
`TransformLane` がレーン位置を与えます。

***

### packedUv

> `readonly` **packedUv**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:209](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L209)

`uvX, uvY, uvW, uvH` を 1 インスタンス 16 バイトに詰めたミラー。

***

### parentId

> `readonly` **parentId**: `Int32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:233](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L233)

親の Sprite ID。-1 ならルート。

***

### posX

> `readonly` **posX**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:118](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L118)

***

### posY

> `readonly` **posY**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:119](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L119)

***

### rotation

> `readonly` **rotation**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:120](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L120)

***

### scaleX

> `readonly` **scaleX**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:126](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L126)

X 方向のスケール**倍率**。
1.0 ならフレーム寸法そのままの大きさに描画されます。
ピクセル数ではありません。描画サイズは `frameWidth * scaleX` です。

***

### scaleY

> `readonly` **scaleY**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:128](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L128)

Y 方向のスケール倍率。`scaleX` と同じ扱い (1.0 = フレーム寸法そのまま)。

***

### scrollFactorX

> `readonly` **scrollFactorX**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:159](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L159)

カメラスクロールの係数 X（パララックス）。

描画位置を `x - camera.scrollX * scrollFactorX` で求めるため、
カメラごとに 1 回ずつ計算します。

***

### scrollFactorY

> `readonly` **scrollFactorY**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:161](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L161)

カメラスクロールの係数 Y。既定 1.0。

***

### srcFrame

> `readonly` **srcFrame**: `Uint16Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:200](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L200)

`frameIdx` は GPU のテクスチャーアレイ・レイヤーIDを保持する。
同一レイヤー内での「どのコマか」は `srcFrame` が担当する (2バイトで済むため Uint16Array)。

***

### tint

> `readonly` **tint**: `Uint32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:181](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L181)

***

### tintMode

> `readonly` **tintMode**: `Uint8Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:165](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L165)

`TintMode` の値。フラグメントシェーダの分岐に使います。

***

### uvH

> `readonly` **uvH**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:179](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L179)

***

### uvW

> `readonly` **uvW**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:178](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L178)

***

### uvX

> `readonly` **uvX**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:176](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L176)

***

### uvY

> `readonly` **uvY**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:177](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L177)

***

### visible

> `readonly` **visible**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:194](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L194)

1.0 = 描画する、0.0 = 描画しない (Phaser 互換の setVisible)。

頂点属性の上限 (WebGL2 では 16) があるため、depth の空き枠
(location 7) を再利用しています。depth は CPU 側 (SoA) で保持します。

***

### worldRotation

> `readonly` **worldRotation**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:241](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L241)

***

### worldX

> `readonly` **worldX**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:239](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L239)

computeWorldTransforms() の出力 (親から見た変換を畳み込んだワールド座標)

***

### worldY

> `readonly` **worldY**: `Float32Array`

Defined in: [core/src/arena/InstanceBufferArena.ts:240](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L240)

## Accessors

### activeCount

#### Get Signature

> **get** **activeCount**(): `number`

Defined in: [core/src/arena/InstanceBufferArena.ts:1262](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L1262)

##### Returns

`number`

## Methods

### \_swapInstances()

> **\_swapInstances**(`a`, `b`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:592](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L592)

密添字 `a` と `b` の 2 インスタンスを丸ごと入れ替えます。

SoA と `packed*` ミラーの両方を同じ規則で入れ替えるため、ずれが起きません。
`idToIndex` / `indexToId` も追随させます。
2 つの添字が等しい場合は何もしません。

#### Parameters

##### a

`number`

##### b

`number`

#### Returns

`void`

***

### allocate()

> **allocate**(): `number`

Defined in: [core/src/arena/InstanceBufferArena.ts:458](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L458)

#### Returns

`number`

***

### clear()

> **clear**(): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:1266](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L1266)

#### Returns

`void`

***

### computeWorldTransforms()

> **computeWorldTransforms**(): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:1151](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L1151)

SoA シーングラフの変換を 1 パスで解決します。
ネストしたオブジェクト木は作りません。
インデックス配列と再帰で解決します。
親を先に解決したかどうかはスタンプで判定します。
ヒープ割り当ては発生しません。
再帰の深さは階層と同じで、浅くなります。

階層を使っている場合、GPU はワールド座標で描画する必要があります。
そのため解決と同時に `packedTransform` へ書き戻します
（階層を使わないシーンでは write-through がそのまま使われるため、
この O(n) パスは走りません）。

#### Returns

`void`

***

### free()

> **free**(`id`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:559](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L559)

インスタンスを解放します。

末尾以外を解放する場合は末尾との swap-remove で配列を詰めます。
`assetRef` は明示的に解放し、TextureAsset を後から破棄できるようにします。

#### Parameters

##### id

`number`

#### Returns

`void`

***

### getExt()

> **getExt**(`i`, `slot`, `out`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:1062](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L1062)

拡張枠の 1 つの `vec4` を out へ読み出します。
ヒープを割り当てないため、呼び出し側の使い回しバッファへ書き込みます。

#### Parameters

##### i

`number`

##### slot

`number`

##### out

`Float32Array`

#### Returns

`void`

***

### getParentId()

> **getParentId**(`id`): `number`

Defined in: [core/src/arena/InstanceBufferArena.ts:337](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L337)

親 ID を取得します。親なしなら -1 を返します。

#### Parameters

##### id

`number`

#### Returns

`number`

***

### hitTest()

> **hitTest**(`px`, `py`, `out`): `number`

Defined in: [core/src/arena/InstanceBufferArena.ts:1230](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L1230)

ワールド座標に対してポインタの当たり判定 (AABB) を行います。
結果を `out` へ上から (後方インデックスから) 書き込むため、out[0] が常に手前のエンティティです。
階層を使っていない場合は posX / posY をそのまま判定座標として使います。

#### Parameters

##### px

`number`

##### py

`number`

##### out

`Int32Array`

#### Returns

`number`

書き込んだヒット数

***

### kindNameOf()

> **kindNameOf**(`i`): `string`

Defined in: [core/src/arena/InstanceBufferArena.ts:1027](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L1027)

`type` の文字列を返します。

#### Parameters

##### i

`number`

#### Returns

`string`

***

### markAllDirty()

> **markAllDirty**(): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:730](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L730)

全 Dirty Flag を立てます。allocate / free のようにデータ順序が変わる操作後に呼びます。

#### Returns

`void`

***

### nameOf()

> **nameOf**(`i`): `string`

Defined in: [core/src/arena/InstanceBufferArena.ts:1020](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L1020)

`name` 文字列を取得します（未設定なら空文字）。

#### Parameters

##### i

`number`

#### Returns

`string`

***

### partitionVisible()

> **partitionVisible**(`minX`, `minY`, `maxX`, `maxY`): `number`

Defined in: [core/src/arena/InstanceBufferArena.ts:683](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L683)

指定矩形と交差する可視インスタンスを先頭へまとめます（カリング）。

可視なものは `[0, visibleCount)` に、不可視なものはその後ろに寄せることで、
連続した区間として描画できます。
これにより `drawInstanced(visibleCount, 0)` 1 回の描画で済むため、
頂点シェーダの処理量と転送量を同時に削減できます。

入れ替えは O(n) ですが、描画対象を V 体へ絞ることで
N 体の頂点処理と N 体分の転送を避けられます。

#### Parameters

##### minX

`number`

判定矩形の左

##### minY

`number`

判定矩形の上

##### maxX

`number`

判定矩形の右

##### maxY

`number`

判定矩形の上下

#### Returns

`number`

先頭に寄せた可視インスタンス数

***

### setActive()

> **setActive**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:949](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L949)

update / render の対象フラグ。0 なら描画対象から外します。

Phaser の `active` は「visible とは独立した概念」ですが、
どちらも「描画するか否か」なので GPU へは AND を取った値を送ります。
頂点シェーダに新しい属性枠を消費せずに済む点が利点です。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setBlendMode()

> **setBlendMode**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:990](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L990)

ブレンドモードを書き込みます。

WebGL2 がネイティブにサポートするのは 4 種（Normal / Add / Multiply / Screen）だけなので、
範囲外は `BlendMode.Normal` へ丸めます。
実際の反映はバッチ分割が実装されるまで行われません（Phase 8）。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setDepth()

> **setDepth**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:1035](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L1035)

`depth` を書き込みます。
Z 順ソート用に `packedShape` のレーンへ渡します。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setExt()

> **setExt**(`i`, `slot`, `x`, `y`, `z`, `w`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:1049](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L1049)

拡張枠 `packedExt` の `vec4` を 1 つ書き込みます。

#### Parameters

##### i

`number`

SoA スロット番号

##### slot

`number`

0〜3 の拡張枠番号

##### x

`number`

##### y

`number`

##### z

`number`

##### w

`number`

#### Returns

`void`

***

### setFacing()

> **setFacing**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:889](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L889)

`facing` を書き込みます。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setFlags4()

> **setFlags4**(`i`, `frameIdx`, `facing`, `visible`, `isText`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:1113](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L1113)

4 フィールドをまとめて `packedFlags` へ書き込みます。

#### Parameters

##### i

`number`

##### frameIdx

`number`

##### facing

`number`

##### visible

`number`

##### isText

`number`

#### Returns

`void`

***

### setFrameIdx()

> **setFrameIdx**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:881](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L881)

`frameIdx` を書き込みます。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setFrameSize()

> **setFrameSize**(`i`, `w`, `h`, `keepScale?`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:824](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L824)

現在のフレームのピクセル寸法を書き込みます。

頂点シェーダはクワッドの大きさを `frameWidth * scaleX` で決めるため、
テクスチャのピクセル寸法が必要です。

#### Parameters

##### i

`number`

SoA スロット番号

##### w

`number`

フレーム幅 (px)

##### h

`number`

フレーム高 (px)

##### keepScale?

`boolean` = `true`

true なら `scaleX` / `scaleY` を倍率のまま維持します
                 （フレームだけ差し替えたときの見た目を保つため）

#### Returns

`void`

***

### setIsText()

> **setIsText**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:969](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L969)

`isText` を設定します。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setName()

> **setName**(`i`, `name`): `number`

Defined in: [core/src/arena/InstanceBufferArena.ts:1003](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L1003)

`name` 文字列をスロット化します。

文字列を SoA に入れることはできないため、
`namePool` への参照（スロット番号）だけを `Int32Array` に持ちます。

#### Parameters

##### i

`number`

##### name

`string`

#### Returns

`number`

確保されたスロット番号

***

### setOrigin()

> **setOrigin**(`i`, `x`, `y`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:920](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L920)

描画原点を書き込みます。Phaser の既定は 0.5, 0.5 です。

#### Parameters

##### i

`number`

##### x

`number`

##### y

`number`

#### Returns

`void`

***

### setParentId()

> **setParentId**(`id`, `parentId`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:314](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L314)

親子関係を設定します (Phaser 互換のコンテナ階層)。

ローカル座標 (`localX` / `localY` / `localRotation`) は
**現在のワールド座標から初期化**されます。
これにより、親짓ける前の位置が保たれます。
階層リゾルバは `localX` を使ってワールド座標を組み立てるため、
ここを省略すると子が原点へ飛んでしまいます。

#### Parameters

##### id

`number`

子の疎添字 ID

##### parentId

`number`

親の疎添字 ID。親なしは -1

#### Returns

`void`

***

### setPosX()

> **setPosX**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:765](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L765)

`posX` を書き込みます。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setPosY()

> **setPosY**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:773](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L773)

`posY` を書き込みます。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setRotation()

> **setRotation**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:841](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L841)

`rotation` を書き込みます。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setScale()

> **setScale**(`i`, `x`, `y?`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:801](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L801)

スケール倍率をまとめて書き込みます。

`y` を省略した場合は `x` を両方に適用します（Phaser 互換）。

#### Parameters

##### i

`number`

##### x

`number`

##### y?

`number`

#### Returns

`void`

***

### setScaleX()

> **setScaleX**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:781](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L781)

X 方向のスケール**倍率**を書き込みます。1.0 = フレーム寸法そのまま。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setScaleY()

> **setScaleY**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:789](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L789)

Y 方向のスケール倍率を書き込みます。1.0 = フレーム寸法そのまま。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setScrollFactor()

> **setScrollFactor**(`i`, `x`, `y`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:933](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L933)

カメラスクロール係数を書き込みます。
パララックス（背景をゆっくり動かす）に使います。

#### Parameters

##### i

`number`

##### x

`number`

##### y

`number`

#### Returns

`void`

***

### setTint()

> **setTint**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:910](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L910)

`tint` を書き込みます。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setTintMode()

> **setTintMode**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:963](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L963)

tint のブレンドモードを書き込みます。

現状のフラグメントシェーダは `MULTIPLY` のみを実装しています
（分岐を増やさず要件2「WebGPU > WebGL > CPU」を保つため）。
値としては保持されるので、後からシェーダを拡張neau，而不改变 API。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setTransform4()

> **setTransform4**(`i`, `posX`, `posY`, `scaleX`, `scaleY?`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:1075](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L1075)

transform の 4 フィールドをまとめて書き込みます。

`scaleX` / `scaleY` は倍率です。Y を省略すると X を両方に適用します。

#### Parameters

##### i

`number`

##### posX

`number`

##### posY

`number`

##### scaleX

`number`

##### scaleY?

`number`

#### Returns

`void`

***

### setUv4()

> **setUv4**(`i`, `x`, `y`, `w`, `h`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:1098](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L1098)

4 フィールドをまとめて `packedUv` へ書き込みます。

#### Parameters

##### i

`number`

##### x

`number`

##### y

`number`

##### w

`number`

##### h

`number`

#### Returns

`void`

***

### setUvH()

> **setUvH**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:873](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L873)

`uvH` を書き込みます。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setUvW()

> **setUvW**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:865](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L865)

`uvW` を書き込みます。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setUvX()

> **setUvX**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:849](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L849)

`uvX` を書き込みます。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setUvY()

> **setUvY**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:857](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L857)

`uvY` を書き込みます。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### setVisible()

> **setVisible**(`i`, `v`): `void`

Defined in: [core/src/arena/InstanceBufferArena.ts:897](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L897)

`visible` を書き込みます。

#### Parameters

##### i

`number`

##### v

`number`

#### Returns

`void`

***

### sparseIdOf()

> **sparseIdOf**(`denseIndex`): `number`

Defined in: [core/src/arena/InstanceBufferArena.ts:347](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/arena/InstanceBufferArena.ts#L347)

密添字から疎添字 ID へ変換します (逆引き)。

#### Parameters

##### denseIndex

`number`

#### Returns

`number`

範囲外なら -1
