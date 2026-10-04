---
title: Scene
---

# Scene

## Properties

### `id`

**Type:** `string`



### `scene`

**Type:** `import("A:/Project/plute-engine/packages/core/src/scene/SceneManager").SceneManager`



### `engine`

**Type:** `import("A:/Project/plute-engine/packages/core/src/core/PlutoEngine").PlutoEngine`



### `arena`

**Type:** `import("A:/Project/plute-engine/packages/core/src/arena/InstanceBufferArena").InstanceBufferArena`



### `input`

**Type:** `import("A:/Project/plute-engine/packages/core/src/input/InputManager").InputManager`



### `load`

**Type:** `import("A:/Project/plute-engine/packages/core/src/loader/LoaderManager").LoaderManager`



### `textures`

**Type:** `import("A:/Project/plute-engine/packages/core/src/loader/TextureManager").TextureManager`



### `events`

**Type:** `import("A:/Project/plute-engine/packages/core/src/events/EventEmitter").EventEmitter`

シーン内イベントバス

### `cameras`

**Type:** `import("A:/Project/plute-engine/packages/core/src/scene/CameraManager").CameraManager`

カメラ管理 (Phaser 互換の this.cameras)。

### `camera`

**Type:** `import("A:/Project/plute-engine/packages/core/src/scene/Camera").Camera`

メインカメラ (this.cameras.main の別名)。
既存のコードとの互換のために残しています。

### `_hitBuffer`

**Type:** `Int32Array&lt;ArrayBuffer&gt;`

ポインタヒットテストの結果を受け取るバッファ (毎フレーム new しない)

### `math`

**Type:** `import("A:/Project/plute-engine/packages/core/src/math/Math").MathHelpers`



### `add`

**Type:** `{ sprite: (x?: number, y?: number, textureKey?: string | undefined, frameKey?: string | number | undefined) =&gt; import("A:/Project/plute-engine/packages/core/src/arena/Sprite").Sprite; text: (x?: number, y?: number, text?: string, style?: import("A:/Project/plute-engine/packages/core/src/arena/Text").TextStyle) =&gt; import("A:/Project/plute-engine/packages/core/src/arena/Text").Text; tilemap: (mapData: any, tileSize?: number) =&gt; import("A:/Project/plute-engine/packages/core/src/tilemap/Tilemap").Tilemap; container: (x?: number, y?: number, children?: import("A:/Project/plute-engine/packages/core/src/arena/Sprite").Sprite[]) =&gt; import("A:/Project/plute-engine/packages/core/src/arena/Container").Container; image: (x?: number, y?: number, textureKey?: string | undefined, frameKey?: string | number | undefined) =&gt; import("A:/Project/plute-engine/packages/core/src/arena/Sprite").Sprite; group: (children?: import("A:/Project/plute-engine/packages/core/src/arena/Sprite").Sprite[]) =&gt; import("A:/Project/plute-engine/packages/core/src/arena/Group").Group; particles: (x?: number, y?: number, textureKey?: string | undefined, config?: import("A:/Project/plute-engine/packages/core/src/particles/ParticleManager").EmitterCreateConfig) =&gt; import("A:/Project/plute-engine/packages/core/src/particles/ParticleEmitter").ParticleEmitter | null; bitmapText: (x: number, y: number, text: string, font: import("A:/Project/plute-engine/packages/core/src/loader/BitmapFontParser").ParsedBitmapFont, pageKey?: string | undefined) =&gt; import("A:/Project/plute-engine/packages/core/src/arena/Text").Text; }`



## Methods

### `setCameraFollowTarget(id: number, x: number, y: number)`

**Returns:** `void`

カメラの追従対象を設定します。

既存の startFollow(target) を使う場合は ID だけで十分ですが、
ワールド座標を明示したい場合はこちらを使います。

### `hasSubsystem(bit: number)`

**Returns:** `boolean`

サブシステムが初期化済みかどうかを返します。

### `markSubsystem(bit: number)`

**Returns:** `void`

サブシステムを有効化します。

プラグインが自分のサブシステムを登録するために使います。
Plugin は自前で update を定義してもよいですが、
ビットを立てておけばプロファイラで有効状態が可視化されます。

### `setSoundManager(manager: import("A:/Project/plute-engine/packages/core/src/sound/SoundManager").SoundManager)`

**Returns:** `void`

外部で生成した SoundManager を差し込みます。

プラグイン (SoundPlugin) が SoundManager を自前で持つ場合に、
Scene の遅延サブシステムと二重に作らないために使います。
ビットをここで立てるので、毎フレームの update も確実に走ります。

### `getBody(target: { readonly id: number; })`

**Returns:** `import("A:/Project/plute-engine/packages/core/src/physics/Body").Body`

スプライトの物理ボディを取得します (Phaser 互換の `sprite.body`)。

ハンドルなので毎フレーム new しません。同じ ID なら同じ
インスタンスを返します。

### `getBodyById(entityId: number)`

**Returns:** `import("A:/Project/plute-engine/packages/core/src/physics/Body").Body`

疎添字 ID から Body ハンドルを取得します。
内部でキャッシュし、同じ ID なら同じインスタンスを返します。

### `getContainer(entityId: number)`

**Returns:** `import("A:/Project/plute-engine/packages/core/src/arena/Container").Container`

コンテナハンドル (Phaser 互換の `sprite` を `Container` で包む) を取得します。
キャッシュするため、同じ ID なら毎回同じインスタンスを返します。

### `createFont(key?: string, options?: import("A:/Project/plute-engine/packages/core/src/text/FontAtlas").FontAtlasOptions)`

**Returns:** `import("A:/Project/plute-engine/packages/core/src/text/FontAtlas").FontAtlas | null`

フォントアトラスを生成し、Text から参照できるようにします。

生成は 1 度だけで、以降は Text.setGlyphSource() へ渡して再利用できます。

### `getFont(key?: string)`

**Returns:** `import("A:/Project/plute-engine/packages/core/src/text/FontAtlas").FontAtlas | null`

登録済みフォントを取得します。

### `addText(x: number, y: number, text: string, style?: import("A:/Project/plute-engine/packages/core/src/arena/Text").TextStyle, fontKey?: string)`

**Returns:** `import("A:/Project/plute-engine/packages/core/src/arena/Text").Text`

テキストを生成します。
指定したフォントアトラスが存在する場合は自動で接続します。

### `addRectangle(x: number, y: number, width: number, height: number, color?: number, alpha?: number)`

**Returns:** `number`

矩形 (Phaser 互換の `add.rectangle`)

### `addCircle(x: number, y: number, radius: number, color?: number, alpha?: number)`

**Returns:** `number`

円 (Phaser 互換の `add.circle`)

### `addEllipse(x: number, y: number, width: number, height: number, color?: number, alpha?: number)`

**Returns:** `number`

楕円 (Phaser 互換の `add.ellipse`)

### `addTriangle(x: number, y: number, width: number, height: number, color?: number, alpha?: number)`

**Returns:** `number`

三角形 (Phaser 互換の `add.triangle`)

### `addStar(x: number, y: number, points: number, radius: number, innerRadius?: number, color?: number, alpha?: number)`

**Returns:** `number`

星形 (Phaser 互換の `add.star`)

### `addRoundRect(x: number, y: number, width: number, height: number, radius?: number, color?: number, alpha?: number)`

**Returns:** `number`

角丸矩形 (Phaser 互換の `add.roundRect` / `add.roundrect`)

### `addLine(x: number, y: number, length: number, lineWidth?: number, color?: number, alpha?: number)`

**Returns:** `number`

線 (Phaser 互換の `add.line`)

### `addGrid(x: number, y: number, cellWidth: number, cellHeight: number, cells?: number, lineWidth?: number, color?: number, alpha?: number)`

**Returns:** `number`

格子 (Phaser 互換の `add.grid`)

### `addIsoTriangle(x: number, y: number, width: number, height: number, color?: number, alpha?: number)`

**Returns:** `number`

等角三角形 (Phaser 互換の `add.isotriangle`)

### `addIsoDiamond(x: number, y: number, width: number, height: number, color?: number, alpha?: number)`

**Returns:** `number`

等角ダイヤ (Phaser 互換の `add.isodiamond` / `isobox`)

### `addQuad(x: number, y: number, width: number, height: number, inset?: number, color?: number, alpha?: number)`

**Returns:** `number`

四辺形 (Phaser 互換の `add.quad`)

### `addArc(x: number, y: number, radius: number, lineWidth?: number, color?: number, alpha?: number)`

**Returns:** `number`

円弧 (Phaser 互換の `add.arc`)

### `preload()`

**Returns:** `void`



### `init()`

**Returns:** `void`



### `create()`

**Returns:** `void`



### `update(dt: number)`

**Returns:** `void`



### `fixedUpdate(fixedDt: number)`

**Returns:** `void`



### `shutdown()`

**Returns:** `void`



### `setPaused(paused: boolean)`

**Returns:** `void`



### `sysShutdown()`

**Returns:** `void`



### `sysInit(engine: import("A:/Project/plute-engine/packages/core/src/core/PlutoEngine").PlutoEngine)`

**Returns:** `void`



### `sysCreate()`

**Returns:** `void`



### `sysUpdate(dt: number)`

**Returns:** `void`



### `sysFixedUpdate(fixedDt: number)`

**Returns:** `void`



### `registerPlugin(plugin: import("A:/Project/plute-engine/packages/core/src/scene/Plugin").Plugin)`

**Returns:** `void`



### `pickTop()`

**Returns:** `number`

現在のポインタ位置にあるエンティティの ID を返します。
手前のエンティティを優先し、1 つも無ければ -1 を返します。

### `pickAll(out: Int32Array&lt;ArrayBufferLike&gt;)`

**Returns:** `number`

ポインタ位置にあるエンティティの ID を返します (重複を許容)。
結果は `out` に書き込まれ、ヒット数が返ります。

