---
title: Sprite
---

# Sprite

## Properties

### `id`

**Type:** `number`



## Methods

### `setPosition(x?: number | undefined, y?: number | undefined, z?: number | undefined, w?: number | undefined)`

**Returns:** `this`

位置を設定し、チェーンのために this を返します (Phaser 互換)。

### `setX(x: number)`

**Returns:** `this`

X 座標を設定し、チェーンのために this を返します (Phaser 互換)。

### `setY(y: number)`

**Returns:** `this`

Y 座標を設定し、チェーンのために this を返します (Phaser 互換)。

### `setScale(x: number, y?: number | undefined)`

**Returns:** `this`

スケールを設定します (Phaser 互換)。

`scale` は**フレーム寸法の倍率**です。ピクセル数ではありません。
`y` を省略した場合は `x` を X/Y 両方に適用します。

```ts
this.load.sprite('hero', src, { frameWidth: 32, frameHeight: 32 });
const p = this.add.sprite(x, y, 'hero');  // 32px
p.setScale(2);                            // 64px
```

表示サイズを直接指定したい場合は `setDisplaySize` を使ってください。

### `setDisplaySize(w: number, h: number)`

**Returns:** `this`

表示サイズをピクセル単位で指定します (Phaser 互換の setDisplaySize)。

内部では「表示幅 / フレーム幅」を倍率として計算します。
テクスチャ未設定でフレーム寸法が既定 (32px) のときは、
現在は 32px 前提の倍率を設定するため、テクスチャ確定後に
`setDisplaySize` を呼ぶと期待どおりの表示になります。

### `setOrigin(x?: number, y?: number | undefined)`

**Returns:** `this`

描画原点を設定します (Phaser 互換の setOrigin)。

`0.5, 0.5` はスプライトの中心、`0, 0` は左上、`1, 1` は右下です。
`y` を省略した場合は `x` を両方に適用します。

### `setOriginToDefault()`

**Returns:** `this`

描画原点を中央 (0.5, 0.5) に戻します (Phaser 互換の setOriginToDefault)。

### `getOrigin(out: Float32Array&lt;ArrayBufferLike&gt;)`

**Returns:** `this`

現在の描画原点を `out` へ書き出します (Phaser 互換の getOrigin)。

### `setScrollFactor(x: number, y?: number | undefined)`

**Returns:** `this`

カメラスクロール係数を設定します (Phaser 互換の setScrollFactor)。

0.5 を指定するとカメラ移動の半分だけスプライトが動きます（背景など）。
`y` を省略した場合は `x` を両方に適用します。

### `setScrollFactorX(value: number)`

**Returns:** `this`

X 方向のカメラスクロール係数 (Phaser 互換の setScrollFactorX)。

### `setScrollFactorY(value: number)`

**Returns:** `this`

Y 方向のカメラスクロール係数 (Phaser 互換の setScrollFactorY)。

### `setActive(value: number | boolean)`

**Returns:** `this`

update / render の対象フラグ (Phaser 互換の setActive)。

false にすると描画対象から外れます（`visible` とは独立した概念です）。

### `setName(value: string)`

**Returns:** `this`

識別名を設定します (Phaser 互換の setName)。

文字列を SoA に格納できないため、`namePool` への参照だけを保持します。

### `setTintMode(mode: string | number)`

**Returns:** `this`

tint のブレンドモードを設定します (Phaser 4 互換の setTintMode)。

現在はフラグメントシェーダが `MULTIPLY` のみを実装しています。
値は保持されるため、シェーダを後から拡張しても API は変わりません。

### `setBlendMode(mode: string | number)`

**Returns:** `this`

ブレンドモードを設定します (Phaser 互換の setBlendMode)。

WebGL2 がネイティブにサポートするのは 4 種（Normal / Add / Multiply / Screen）だけなので、
範囲外は `Normal` に丸められます。
実際の反映はバッチ分割の実装（Phase 8）まで行われません。

### `getLocalTransformMatrix(out: Float32Array&lt;ArrayBufferLike&gt;)`

**Returns:** `this`

ローカル変換行列 (a, b, c, d, tx, ty) を `out` へ書き出します。

Phaser は `Float32Array(4)` を返しますが、
**ヒープ確保を避けるため `out` パラメータを必須**にしています
（SoA 判定コード **D**：Phaser とシグネチャが異なります）。

### `getWorldTransformMatrix(out: Float32Array&lt;ArrayBufferLike&gt;)`

**Returns:** `this`

ワールド変換行列を `out` へ書き出します。

階層を使っている場合は `computeWorldTransforms()` の結果を使います。
シェーダと同じ計算を CPU 側で行っています。

### `setSize(width: number, height: number)`

**Returns:** `this`

フレームのピクセル寸法を設定します (Phaser 互換の setSize)。
`scale` は倍率なので `width` / `height` には影響しません。

### `getSize(out: Float32Array&lt;ArrayBufferLike&gt;)`

**Returns:** `this`

現在のフレーム寸法を `out` へ書き出します (Phaser 互換の getSize)。

### `setAngle(degrees: number)`

**Returns:** `this`

回転角を度で設定し、チェーンのために this を返します (Phaser 互換)。

### `setRotation(degrees: number)`

**Returns:** `this`

回転角を度で設定し、チェーンのために this を返します (Phaser 互換の setRotation)。
内部ではラジアンとして保持します。

### `setVisible(value: boolean)`

**Returns:** `this`

表示するかどうかを設定し、チェーンのために this を返します。

### `toggleVisible()`

**Returns:** `this`

表示状態を反転します。

### `setTextureByKey(scene: { textures?: { get(key: string): unknown; } | undefined; }, key: string, frame?: string | number)`

**Returns:** `this`

テクスチャアセットを設定し、チェーンのために this を返します (Phaser 互換の setTexture)。

キーの文字列で渡す場合は Scene 側の textures から解決します。
呼び出し側から textures へ参照できるよう、Sprite は static で保持しません。

### `setTexture(asset: import("A:/Project/plute-engine/packages/core/src/arena/InstanceBufferArena").SpriteAssetLike | null, frame?: string | number)`

**Returns:** `this`

テクスチャアセットを設定し、GPU Texture2DArray の対応レイヤーとフレーム UV を適用します。
アセット参照はアリーナ側 (SoA) に格納され、このインスタンスは 32 バイトのまま保たれます。

テクスチャのフレーム寸法がそのままスプライトの表示サイズになります
（`scale` は倍率なので既定の 1.0 ではフレームそのまま）。
同時に、テクスチャ未設定の既定は「透明」だったため tint を不透明へ戻します。

### `getFrameSize(out: Float32Array&lt;ArrayBufferLike&gt;)`

**Returns:** `this`

テクスチャアセットのフレーム寸法 (px) を `out` へ書き出します。

`frameWidth` / `frameHeight` が使える場合はそれを使い、
無ければ画像全体の寸法、それも無ければ `DEFAULT_FRAME_SIZE` です。

毎フレーム呼ばれる可能性があるため、戻り値のオブジェクトを
生成せず使い回しバッファへ書き込みます（Flyweight の掟）。

### `setFrame(frame: string | number)`

**Returns:** `this`

スプライトシート内の 特定コマを設定します。

コマごとに大きさが異なるアトラスでも追従するよう、
フレーム UV と同時にピクセル寸法も更新します。

### `setFlipX(flip: boolean)`

**Returns:** `this`

水平反転を設定します。

### `toggleFlipX()`

**Returns:** `this`

水平反転を反転します (Phaser 互換)。

### `setFlipY(flip: boolean)`

**Returns:** `this`

垂直反転を設定します (Phaser 互換の setFlipY)。

`scaleY` の符号で表現します。負の値にすると上下反転します。
非等方スケールに対応したため可能になりました。

### `toggleFlipY()`

**Returns:** `this`

垂直反転を反転します (Phaser 互換の toggleFlipY)。

### `getBounds(out: import("A:/Project/plute-engine/packages/core/src/arena/Sprite").BoundsRect)`

**Returns:** `this`

画面上の矩形 (Rotated Rectangle ではなく軸平行矩形) を out へ書き出します (Phaser 互換の getBounds)。

回転を考慮せず、中心とスケールから軸平行矩形を求めます。
ヒープ割り当てを避けるため、戻り値は out へ書き込みます。

### `getTopLeft(out: import("A:/Project/plute-engine/packages/core/src/arena/Sprite").PointLike)`

**Returns:** `this`

左上端の座標を out へ書き出します (Phaser 互換の getTopLeft)。

### `getCenter(out: import("A:/Project/plute-engine/packages/core/src/arena/Sprite").PointLike)`

**Returns:** `this`

中央の座標を out へ書き出します (Phaser 互換の getCenter)。

### `getBottomRight(out: import("A:/Project/plute-engine/packages/core/src/arena/Sprite").PointLike)`

**Returns:** `this`

右下端の座標を out へ書き出します (Phaser 互換の getBottomRight)。

### `resetFlip()`

**Returns:** `this`

反転状態を初期状態 (反転なし) に戻します (Phaser 互換の resetFlip)。

横・縦の両方を戻します。縦は `scaleY` の符号で表現されます。

### `setFlip(flipX: boolean, flipY?: boolean | undefined)`

**Returns:** `this`

横・縦の反転をまとめて設定します (Phaser 互換の setFlip)。

`flipY` を省略した場合は現在の縦反転状態を維持します。

### `setTint(tintHex: number)`

**Returns:** `this`

スプライトの乗算カラー (Tint) を設定します。
0xRRGGBB 形式を自動的にリトルエンディアン RGBA Uint32 にパックします。

### `setTintFill(tintHex: number, alpha?: number | undefined)`

**Returns:** `this`

不透明度を指定して単色塗りを近似します (Phaser 互換の setTintFill)。

シェーダが texColor * vTint のため、色成分の指定は現状無視されます
（係数を 1.0 とした白を置きます）。alpha のみ反映されます。

### `clearTint()`

**Returns:** `this`

Tint を白に戻します (Phaser 互換の clearTint)。
現在の alpha は維持します。

### `setAlpha(value: number)`

**Returns:** `this`

不透明度を設定し、チェーンのために this を返します (Phaser 互換の setAlpha)。

### `clearAlpha()`

**Returns:** `this`

不透明度を白 (1.0) に戻します (Phaser 互換の clearAlpha)。

### `setInteractive(hitWidth?: number | undefined, hitHeight?: number | undefined)`

**Returns:** `this`

ポインタ操作を有効化します (Phaser 互換の setInteractive)。

引数を省略した場合は**表示サイズ**（フレーム寸法 × スケール倍率）を
ヒット領域として使います。これにより画像の大きさに当たり判定が追従します。
明示的な寸法を渡した場合はそちらを優先します。

### `setParentId(parentId: number)`

**Returns:** `this`

親スプライトの ID を設定します (-1 で親なし)。
親子関係はネストしたオブジェクト木ではなく SoA の `parentId` 配列で表現されます。
親子付けすると x/y/rotation はローカル値として解釈されます。

実装は {@link InstanceBufferArena.setParentId} に委譲し、
ローカル座標の初期化と dirty フラグの立て方を 1 か所に集約しています。

### `play(key: string, ignoreIfPlaying?: boolean)`

**Returns:** `this`

登録済みアニメーションを再生します。
Sprite 参照を一切保持せず ID のみを渡すことで、AnimationManager 側の参照 Map を不要にします。

### `playReverse(key: string, ignoreIfPlaying?: boolean)`

**Returns:** `import("A:/Project/plute-engine/packages/core/src/anim/AnimState").AnimState | null`

逆再生を開始します (Phaser 互換の `playReverse`)。
最終コマから先頭へ戻ります。

### `stop()`

**Returns:** `this`

再生中のアニメーションを停止します (Phaser 互換の sprite.anims.stop)。

現在のフレームの UV はそのまま残ります。キーは文字列で、
フレーム番号を指定する経路はないため、引数は取りません。

### `destroy()`

**Returns:** `void`

アリーナからこのスプライトの ID を解放 (削除) します。

