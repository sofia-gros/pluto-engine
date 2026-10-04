---
title: InstanceBufferArena
---

# InstanceBufferArena

## Properties

### `capacity`

**Type:** `number`



### `posX`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `posY`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `rotation`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `scaleX`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

X 方向のスケール**倍率**。
1.0 ならフレーム寸法そのままの大きさに描画されます。
ピクセル数ではありません。描画サイズは `frameWidth * scaleX` です。

### `scaleY`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

Y 方向のスケール倍率。`scaleX` と同じ扱い (1.0 = フレーム寸法そのまま)。

### `frameWidth`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

現在のフレームのピクセル幅。

頂点シェーダはクワッドの大きさを `frameWidth * scaleX` で決めるため、
テクスチャのピクセル寸法が必要です。
テクスチャ未設定時は `DEFAULT_FRAME_SIZE` を入れます。

### `frameHeight`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

現在のフレームのピクセル高さ。`frameWidth` と同じ扱い。

### `facing`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `depth`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `originX`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

描画原点の X 座標 (0.0〜1.0)。

Phaser の既定は 0.5, 0.5（スプライトの中心）です。
クワッドはこの値を引いてから `frameSize * scale` で拡大するため、
頂点シェーダ側で処理します。

### `originY`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

描画原点の Y 座標 (0.0〜1.0)。既定 0.5。

### `scrollFactorX`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

カメラスクロールの係数 X（パララックス）。

描画位置を `x - camera.scrollX * scrollFactorX` で求めるため、
カメラごとに 1 回ずつ計算します。

### `scrollFactorY`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

カメラスクロールの係数 Y。既定 1.0。

### `active`

**Type:** `Uint8Array&lt;ArrayBufferLike&gt;`

1 = update / render の対象、0 = スキップ。Phaser の `active`。

### `tintMode`

**Type:** `Uint8Array&lt;ArrayBufferLike&gt;`

`TintMode` の値。フラグメントシェーダの分岐に使います。

### `blendMode`

**Type:** `Uint8Array&lt;ArrayBufferLike&gt;`

`BlendMode` の値。バッチ分割のキーになります。

### `nameSlot`

**Type:** `Int32Array&lt;ArrayBufferLike&gt;`

`setName` で設定した文字列のスロット番号（-1 = 未設定）。

### `kind`

**Type:** `Uint8Array&lt;ArrayBufferLike&gt;`

`type` の数値表現。文字列は `kindNames` から返します。

### `namePool`

**Type:** `string[]`

`nameSlot` が参照する文字列プール。`addName()` で grown します。

### `kindNames`

**Type:** `string[]`

`kind` が参照する文字列プール。

### `uvX`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `uvY`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `uvW`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `uvH`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `frameIdx`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `tint`

**Type:** `Uint32Array&lt;ArrayBufferLike&gt;`



### `isText`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

1.0 のインスタンスは SDF テキストとして描画します。
0.0 は通常のスプライトです。
頂点属性 14 として渡し、フラグメントシェーダーで描画方式を分岐させます。

### `visible`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

1.0 = 描画する、0.0 = 描画しない (Phaser 互換の setVisible)。

頂点属性の上限 (WebGL2 では 16) があるため、depth の空き枠
(location 7) を再利用しています。depth は CPU 側 (SoA) で保持します。

### `srcFrame`

**Type:** `Uint16Array&lt;ArrayBufferLike&gt;`

`frameIdx` は GPU のテクスチャーアレイ・レイヤーIDを保持する。
同一レイヤー内での「どのコマか」は `srcFrame` が担当する (2バイトで済むため Uint16Array)。

### `packedTransform`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

`posX, posY, scaleX, scaleY` を 1 インスタンス 16 バイトに詰めたミラー。
`TransformLane` がレーン位置を与えます。

### `packedUv`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

`uvX, uvY, uvW, uvH` を 1 インスタンス 16 バイトに詰めたミラー。

### `packedFlags`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

`frameIdx, facing, visible, isText` を 1 インスタンス 16 バイトに詰めたミラー。

### `packedShape`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

`rotation, frameWidth, frameHeight, depth` を 1 インスタンス 16 バイトに詰めたミラー。

### `packedTint`

**Type:** `Uint32Array&lt;ArrayBufferLike&gt;`

`RGBA` を 1 インスタンス 4 バイト (unorm8x4) で保持するミラー。

### `packedOrigin`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

`originX, originY, scrollFactorX, scrollFactorY` を 1 インスタンス 16 バイトに詰めたミラー。

### `packedExt`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

ユーザー拡張用の `vec4` × 4（1 インスタンス 64 バイト）。
エンジンは書き込みません。利用側が `setExt` 経由で使います。

### `assetRef`

**Type:** `(import("A:/Project/plute-engine/packages/core/src/arena/InstanceBufferArena").SpriteAssetLike | null)[]`

SoA 内の「参照」を保持する密配列。
Sprite インスタンス側 (Flyweight) にアセット参照を持たせ aesthetically 32Byte を守るために、
参照はここへ集約する。Flyweight パターンの純度を保つための「SoA 版フィールド」。

### `parentId`

**Type:** `Int32Array&lt;ArrayBufferLike&gt;`

親の Sprite ID。-1 ならルート。

### `localX`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

親から見たローカル位置 (parentId >= 0 のときだけ使用)

### `localY`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `localRotation`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `worldX`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

computeWorldTransforms() の出力 (親から見た変換を畳み込んだワールド座標)

### `worldY`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `worldRotation`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `interactive`

**Type:** `Uint8Array&lt;ArrayBufferLike&gt;`



### `hitWidth`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `hitHeight`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `idToIndex`

**Type:** `Int32Array&lt;ArrayBufferLike&gt;`



### `indexToId`

**Type:** `Int32Array&lt;ArrayBufferLike&gt;`



### `dirtyPos`

**Type:** `boolean`



### `dirtyRotation`

**Type:** `boolean`



### `dirtyScale`

**Type:** `boolean`



### `dirtyUv`

**Type:** `boolean`



### `dirtyFrameIdx`

**Type:** `boolean`



### `dirtyTint`

**Type:** `boolean`



### `dirtyDepth`

**Type:** `boolean`



### `dirtyHierarchy`

**Type:** `boolean`



### `dirtyTransformGroup`

**Type:** `boolean`

`packedTransform` が前回転送時から変化したかどうか。
write-through セッターが自動で立てます。

### `dirtyUvGroup`

**Type:** `boolean`

`packedUv` が前回転送時から変化したかどうか。

### `dirtyFlagsGroup`

**Type:** `boolean`

`packedFlags` が前回転送時から変化したかどうか。

### `dirtyShapeGroup`

**Type:** `boolean`

`packedShape` (rotation / frameWidth / frameHeight / depth) が変化したかどうか。

### `dirtyOriginGroup`

**Type:** `boolean`

`packedOrigin` (originX / originY / scrollFactorX / scrollFactorY) が変化したかどうか。

### `dirtyTintGroup`

**Type:** `boolean`

`packedTint` が前回転送時から変化したかどうか。

### `dirtyExtGroup`

**Type:** `boolean`

`packedExt` が前回転送時から変化したかどうか。

### `animTracker`

**Type:** `import("A:/Project/plute-engine/packages/core/src/arena/InstanceBufferArena").AnimPlayTarget | null`

アニメーション再生の委譲先。Scene 構築時に差し込まれる。

### `bodyFactory`

**Type:** `((entityId: number) =&gt; import("A:/Project/plute-engine/packages/core/src/physics/Body").Body) | null`

Body ハンドルのファクトリ。Scene が登録します。

Sprite は Scene 参照を持たないため、Body はこの注入された
ファクトリ経由で取得します。キャッシュは Scene 側にあるため、
呼び出しごとに new は発生しません。

### `hasHierarchy`

**Type:** `boolean`

親子関係を持つエンティティが 1 体でも存在するかどうか。
false の間はワールド変換の解決を丸ごと省略できます。
ゲームが直接 posX を書き換える運用にも影響しないため、このフラグで経路を分けます。

### `hasText`

**Type:** `boolean`

SDF テキストのインスタンスが 1 つでも存在するかどうか。
false の間は isText バッファの転送を丸ごと省略できます。

### `dirtyIsText`

**Type:** `boolean`

isText バッファが前回転送時から変化したかどうか。
false のフレームは GPU 側に前回の内容が残っているので送信不要です。

### `dirtyVisible`

**Type:** `boolean`

visible バッファが前回転送時から変化したかどうか。

## Methods

### `setParentId(id: number, parentId: number)`

**Returns:** `void`

親子関係を設定します (Phaser 互換のコンテナ階層)。

ローカル座標 (`localX` / `localY` / `localRotation`) は
**現在のワールド座標から初期化**されます。
これにより、親짓ける前の位置が保たれます。
階層リゾルバは `localX` を使ってワールド座標を組み立てるため、
ここを省略すると子が原点へ飛んでしまいます。

### `getParentId(id: number)`

**Returns:** `number`

親 ID を取得します。親なしなら -1 を返します。

### `sparseIdOf(denseIndex: number)`

**Returns:** `number`

密添字から疎添字 ID へ変換します (逆引き)。

### `allocate()`

**Returns:** `number`



### `free(id: number)`

**Returns:** `void`

インスタンスを解放します。

末尾以外を解放する場合は末尾との swap-remove で配列を詰めます。
`assetRef` は明示的に解放し、TextureAsset を後から破棄できるようにします。

### `_swapInstances(a: number, b: number)`

**Returns:** `void`

密添字 `a` と `b` の 2 インスタンスを丸ごと入れ替えます。

SoA と `packed*` ミラーの両方を同じ規則で入れ替えるため、ずれが起きません。
`idToIndex` / `indexToId` も追随させます。
2 つの添字が等しい場合は何もしません。

### `partitionVisible(minX: number, minY: number, maxX: number, maxY: number)`

**Returns:** `number`

指定矩形と交差する可視インスタンスを先頭へまとめます（カリング）。

可視なものは `[0, visibleCount)` に、不可視なものはその後ろに寄せることで、
連続した区間として描画できます。
これにより `drawInstanced(visibleCount, 0)` 1 回の描画で済むため、
頂点シェーダの処理量と転送量を同時に削減できます。

入れ替えは O(n) ですが、描画対象を V 体へ絞ることで
N 体の頂点処理と N 体分の転送を避けられます。

### `markAllDirty()`

**Returns:** `void`

全 Dirty Flag を立てます。allocate / free のようにデータ順序が変わる操作後に呼びます。

### `setPosX(i: number, v: number)`

**Returns:** `void`

`posX` を書き込みます。

### `setPosY(i: number, v: number)`

**Returns:** `void`

`posY` を書き込みます。

### `setScaleX(i: number, v: number)`

**Returns:** `void`

X 方向のスケール**倍率**を書き込みます。1.0 = フレーム寸法そのまま。

### `setScaleY(i: number, v: number)`

**Returns:** `void`

Y 方向のスケール倍率を書き込みます。1.0 = フレーム寸法そのまま。

### `setScale(i: number, x: number, y?: number | undefined)`

**Returns:** `void`

スケール倍率をまとめて書き込みます。

`y` を省略した場合は `x` を両方に適用します（Phaser 互換）。

### `setFrameSize(i: number, w: number, h: number, keepScale?: boolean)`

**Returns:** `void`

現在のフレームのピクセル寸法を書き込みます。

頂点シェーダはクワッドの大きさを `frameWidth * scaleX` で決めるため、
テクスチャのピクセル寸法が必要です。

### `setRotation(i: number, v: number)`

**Returns:** `void`

`rotation` を書き込みます。

### `setUvX(i: number, v: number)`

**Returns:** `void`

`uvX` を書き込みます。

### `setUvY(i: number, v: number)`

**Returns:** `void`

`uvY` を書き込みます。

### `setUvW(i: number, v: number)`

**Returns:** `void`

`uvW` を書き込みます。

### `setUvH(i: number, v: number)`

**Returns:** `void`

`uvH` を書き込みます。

### `setFrameIdx(i: number, v: number)`

**Returns:** `void`

`frameIdx` を書き込みます。

### `setFacing(i: number, v: number)`

**Returns:** `void`

`facing` を書き込みます。

### `setVisible(i: number, v: number)`

**Returns:** `void`

`visible` を書き込みます。

### `setTint(i: number, v: number)`

**Returns:** `void`

`tint` を書き込みます。

### `setOrigin(i: number, x: number, y: number)`

**Returns:** `void`

描画原点を書き込みます。Phaser の既定は 0.5, 0.5 です。

### `setScrollFactor(i: number, x: number, y: number)`

**Returns:** `void`

カメラスクロール係数を書き込みます。
パララックス（背景をゆっくり動かす）に使います。

### `setActive(i: number, v: number)`

**Returns:** `void`

update / render の対象フラグ。0 なら描画対象から外します。

Phaser の `active` は「visible とは独立した概念」ですが、
どちらも「描画するか否か」なので GPU へは AND を取った値を送ります。
頂点シェーダに新しい属性枠を消費せずに済む点が利点です。

### `setTintMode(i: number, v: number)`

**Returns:** `void`

tint のブレンドモードを書き込みます。

現状のフラグメントシェーダは `MULTIPLY` のみを実装しています
（分岐を増やさず要件2「WebGPU > WebGL > CPU」を保つため）。
値としては保持されるので、後からシェーダを拡張neau，而不改变 API。

### `setIsText(i: number, v: number)`

**Returns:** `void`

`isText` を設定します。

### `setBlendMode(i: number, v: number)`

**Returns:** `void`

ブレンドモードを書き込みます。

WebGL2 がネイティブにサポートするのは 4 種（Normal / Add / Multiply / Screen）だけなので、
範囲外は `BlendMode.Normal` へ丸めます。
実際の反映はバッチ分割が実装されるまで行われません（Phase 8）。

### `setName(i: number, name: string)`

**Returns:** `number`

`name` 文字列をスロット化します。

文字列を SoA に入れることはできないため、
`namePool` への参照（スロット番号）だけを `Int32Array` に持ちます。

### `nameOf(i: number)`

**Returns:** `string`

`name` 文字列を取得します（未設定なら空文字）。

### `kindNameOf(i: number)`

**Returns:** `string`

`type` の文字列を返します。

### `setDepth(i: number, v: number)`

**Returns:** `void`

`depth` を書き込みます。
Z 順ソート用に `packedShape` のレーンへ渡します。

### `setExt(i: number, slot: number, x: number, y: number, z: number, w: number)`

**Returns:** `void`

拡張枠 `packedExt` の `vec4` を 1 つ書き込みます。

### `getExt(i: number, slot: number, out: Float32Array&lt;ArrayBufferLike&gt;)`

**Returns:** `void`

拡張枠の 1 つの `vec4` を out へ読み出します。
ヒープを割り当てないため、呼び出し側の使い回しバッファへ書き込みます。

### `setTransform4(i: number, posX: number, posY: number, scaleX: number, scaleY?: number | undefined)`

**Returns:** `void`

transform の 4 フィールドをまとめて書き込みます。

`scaleX` / `scaleY` は倍率です。Y を省略すると X を両方に適用します。

### `setUv4(i: number, x: number, y: number, w: number, h: number)`

**Returns:** `void`

4 フィールドをまとめて `packedUv` へ書き込みます。

### `setFlags4(i: number, frameIdx: number, facing: number, visible: number, isText: number)`

**Returns:** `void`

4 フィールドをまとめて `packedFlags` へ書き込みます。

### `computeWorldTransforms()`

**Returns:** `void`

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

### `hitTest(px: number, py: number, out: Int32Array&lt;ArrayBufferLike&gt;)`

**Returns:** `number`

ワールド座標に対してポインタの当たり判定 (AABB) を行います。
結果を `out` へ上から (後方インデックスから) 書き込むため、out[0] が常に手前のエンティティです。
階層を使っていない場合は posX / posY をそのまま判定座標として使います。

### `clear()`

**Returns:** `void`



