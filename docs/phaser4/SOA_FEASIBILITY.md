# SoA 実行可能性マトリクス（Phaser 4 → PlutoEngine）

> 全シンボルの全量列挙は [`API_INDEX.md`](./API_INDEX.md)（1,744 シンボル）を参照。
> 本書は**各クラス・メソッドが SoA で実装可能か**の判定と、
> 不可の場合の対策（要件3）を示す。

## 0. 判定コード

| コード | 意味 | 実装方針 |
| --- | --- | --- |
| **A** | SoA 直接実装可 | `Float32Array` / `Int32Array` / `Uint8Array` に write-through。追加コスト O(1)。 |
| **B** | SoA 実装可（配列追加） | 新しい SoA 配列を `InstanceBufferArena` に追加。`packed*` ミラーへも write。 |
| **C** | SoA 実装可だが**対策が必要** | Flyweight 掟（ヒープ禁止）・ゼロアロケーション・GC 回避への工夫が要る。 |
| **D** | SoA 実装不可 → **別形で実装** | 互換性は「一部」。Pluto 独自の API 名で提供し、Phaser 名はエイリアス。 |
| **E** | **実装しない** | 要件3。重く、SoA を壊し、互換性が不要と判断。 |

## 1. 大判定サマリー（28 サブシステム）

| # | サブシステム | シンボル | SoA 可否 | 主要な制約・対策 |
| --- | --- | ---: | --- | --- |
| 1 | `game-object-components` | 87 | **A/B** | URES・prite の全 transform は SoA。`getData/setData` のみ **D** |
| 2 | `geometry-and-math` | 172 | **A** | 純数値。Phaser 4 は `Point` を廃し `Vector2` 統一 → SoA 反而Ryoutube benefited |
| 3 | `sprites-and-images` | 48 | **A/B** | 既に実装済み。`setOrigin` / `setDisplaySize` / `flipY` が未実装 |
| 4 | `tweens` | 50 | **A** | 既に SoA 化済み。不足は `Tween` ハンドルと単位（ms 統一） |
| 5 | `animations` | 42 | **A/B** | 既に SoA 化済み。不足は `AnimState` ハンドル |
| 6 | `physics-arcade` | 63 | **B** | `body` オブジェクトは SoA 化。`physics.world` は生成コスト大 → **D** |
| 7 | `particles` | 63 | **B** | SoA 完全適合。`ParticleEmitter` の zone/操作は**フラット設定に平坦化** |
| 8 | `groups-and-containers` | 40 | **C/D** | 親子は `parentId` SoA で可。`add.existing` は `E`（後述） |
| 9 | `text-and-bitmaptext` | 42 | **A/B** | 1 文字 = 1 スプライトは SoA 最適。BBCode/TagText は **E** |
| 10 | `tilemaps` | 40 | **B** | タイル位置は SoA。`TilemapLayer` オブジェクトは **C** |
| 11 | `audio-and-sound` | 41 | **A/D** | Voice は数値。`Sound` オブジェクト系は **D**（軽量ハンドル） |
| 12 | `input-keyboard-mouse-touch` | 70 | **A** | 入力は低頻度なので SoA 不要。`JustDown`/`JustUp` は **D** |
| 13 | `loading-assets` | 83 | **A/D** | LOADER はシングルトン。`scene.load.scenePlugin` は **E** |
| 14 | `events-system` | 15 | **C** | クロージャは SoA 不可。.emit は SoA だがリスナは Array（GC 抑制設計済） |
| 15 | `data-manager` | 21 | **D** | `setData(key, any)` は値型多样 → SoA 不可。`Registry` に分離 |
| 16 | `cameras` | 15 | **B/D** | カメラは少数なので SoA 不要。`preFX/postFX` は RenderGraph 経由 |
| 17 | `scale-and-responsive` | 20 | **A** | シングルトン。純粋な数値変換 |
| 18 | `time-and-timers` | 19 | **A** | 既に SoA 化済み。`Clock` は `TimeStepManager` に統合 |
| 19 | `scenes` | 43 | **A/D** | シーンは少数。`sys*` は Pluto 固有で実装しない |
| 20 | `physics-matter` | 96 | **E** | 要件3。XPBD / Verlet / Continuum を SoA で既に提供済 |
| 21 | `curves-and-paths` | 42 | **A/C** | 数値計算は可。`Path` の点列は動的配列 → **C**（事前確保） |
| 22 | `graphics-and-shapes` | 21 | **E/C** | 要求3。静的ジオメトリのみ **C**、動的 command buffer は **E** |
| 23 | `filters-and-postfx` | 43 | **E/C** | 要件2。WebGPU compute のみ **C**、WebGL2 は簡易 |
| 24 | `render-textures` | 19 | **C** | RenderTexture は再描画 Needed。**非 SoA**（テクスチャ側） |
| 25 | `game-setup-and-config` | 4 | **A** | 設定オブジェクトのみ |
| 26 | `actions-and-utilities` | 3 | **C** | クロージャ主体 → SoA 不可。Tween に lowering |
| 27 | `v4-new-features` | 17 | **C/E** | `SpriteGPULayer` は SoA と相性 **C**、`TilemapGPULayer` は **C** |
| 28 | `v3-to-v4-migration` | 12 | — | 資料。実装対象外 |

**集計**: A/B = 16 サブシステム、C = 6、D = 8、E = 6（重複カウントあり）。

---

## 2. クラス別マトリクス（実装対象の詳細）

### 2.1 `game-object-components` — SoA 適合度 **最高**

Phaser 4 の `GameObject` / `Components.*` は SoA 化と最も相性が良い。

| 成员 | 判定 | SoA 配列 | 備考 |
| --- | --- | --- | --- |
| `x` / `y` | **A** | `posX` / `posY` | 実装済 |
| `scaleX` / `scaleY` / `scale` | **A** | `scaleX` / `scaleY` | 実装済（倍率セマンティクス） |
| `rotation` / `angle` | **A** | `rotation` | 実装済 |
| `displayWidth` / `displayHeight` | **A** | 導出値 | 実装済 |
| `width` / `height` | **A** | `frameWidth` / `frameHeight` | 実装済 |
| `alpha` | **A** | `tint` の A チャンネル | 実装済（SoA 追加なし） |
| `tint` / `setTint()` | **A** | `tint: Uint32Array` | 実装済 |
| `tintFill` | **E** | — | Phaser 4 で削除済み。`setTintMode(FILL)` を使う |
| `setTintMode()` / `tintMode` | **B** | `tintMode: Uint8Array` | **未実装**。6 モード。シェーダ分岐が必要 |
| `visible` / `setVisible()` | **A** | `visible` / `packedFlags` | 実装済 |
| `active` / `setActive()` | **B** | `active: Uint8Array` | **未実装**。update/draw の一括スキップ |
| `depth` / `setDepth()` | **B** | `depth` | 実装済（`packedShape` へ）。**ソート未実装** |
| `setScrollFactor(X/Y)` | **B** | `scrollFactorX/Y: Float32Array` | **未実装**。描画時にカメラ별로位置をCirculate |
| `originX` / `originY` / `setOrigin()` | **B** | `originX/Y: Float32Array` | **未実装**。頂点シェーダで原点をえる |
| `getLocalTransformMatrix()` | **B** | — | **D**。`Float32Array(4)` を `out` パラメータで返す |
| `getWorldTransformMatrix()` | **D** | — | 「ワールド」はシェーダパス。`out` で `Float32Array(4)` |
| `name` / `setName()` | **C** | `nameSlot: Int32Array` + `namePool: string[]` | **未実装**。文字列は SoA 化せず**スロット化** |
| `type` | **D** | — | 文字列 enum → 数値 `kind: Uint8Array` を内部保持。`type` は getter で生文字列を返す |
| `setBlendMode()` / `blendMode` | **D** | `blendMode: Uint8Array` + **バッチ分割** | **未実装**。WebGL は blend 4 種のみ。**バッチ分割が必要** |
| `setData()` / `getData()` | **D** | — | **値型多样で SoA 不可**。`scene.registry` へ誘導 |
| `setInteractive()` | **A** | `interactive` / `hitWidth` / `hitHeight` | 実装済 |
| `setPipeline()` / `preFX` / `postFX` | **E** | — | Phaser 4 で RenderNode / Filter に変更。**`filters` として実装** |
| `setMask()` | **E** | — | 要件3。SoA では mask は物体単位必須 |
| `setLighting()` | **E** | — | 要件2。WebGPU で max light 数が小さい |
| `willRoundVertices()` | **E** | — | 要件2。頂点丸めは WebGL2 の GPU 負荷 |

### 2.2 `geometry-and-math` — SoA 適合度 **最高**（172 シンボル）

Phaser 4 は `Geom.Point` を廃止し `Vector2` へ統一ofoました。これは Pluto に**有利**です。

| グループ | 判定 | 備考 |
| --- | --- | --- |
| `Math.Distance` / `DistanceSquared` / `Angle` / `Clamp` / `Percent` / `Linear` | **A** | 純数値関数。`MathHelpers` に追加するだけ |
| `Math.SmoothStep` / `Sinusoidal` / `Ease` | **A** | `Easing.ts` に既出 |
| `Math.FuzzyMatch` / `FuzzyString` | **A** | 文字列演算。SoA 制約なし |
| `Geom.Rectangle` / `Circle` / `Triangle` / `Ellipse` / `Line` / `Polygon` / `Rhombus` / `Hexagon` | **C** | `Geom` は**値オブジェクト**を返す。**前世 SoA** のため**要注意**。`out` パラメータを必須とし、返り値オブジェクトを生成しない |
| `Geom.Path` / `Curves.Curve` | **C** | 点列は可変長。**事前確保 `Float32Array` + `writeCursor`** で実装（SoA 維持） |
| `Phaser.Struct.Set` / `Map` | **D** | Phaser 4 でネイティブ `Set` / `Map` へ変更。**Pluto も同じ実装に追随**（SoA 制約なし） |
| `Math.RandomDataGenerator` / `Gashapon` / `Perlin` | **A** | 状態は SoA（1 値） |
| `Math.Raycaster` / `ExprParser` | **A/C** | `Raycaster` は当たり判定であり SoA 可。`ExprParser` は字句解析で**非 SoA** |

### 2.3 `sprites-and-images` — SoA 適合度 **最高**

| メンバ | 判定 | 備考 |
| --- | --- | --- |
| `add.sprite` / `add.image` / `add.tileSprite` | **A** | `tileSprite` は UV 計算が特殊 → **B** |
| `Sprite.setCrop` | **B** | `cropX/Y/W/H: Float32Array` |
| `Sprite.setFlipY` / `toggleFlipY` | **A** | **実装済**（`scaleY` の符号） |
| `Sprite.setOrigin` | **B** | 未実装 |
| `Sprite.play` / `reverse` / `stop` / `chain` | **B** | `AnimationManager` は SoA。**`AnimState` ハンドルが未実装** |
| `Sprite.playReverse` / `setRepeat` / `setHold` / `seek` / `getProgress` | **B** | 補完 |
| `Sprite.setScrollFactor` | **B** | 未実装 |
| `Sprite.setBlendMode` | **D** | バッファ分割が必要です。`setPipeline` は **E** |
| `Sprite.setPipeline` / `setPostPipeline` | **E** | RenderNode 化 |
| `Sprite.setMask` | **E** | 要件3 |
| `Sprite.setWinding` / `setShader` | **E** | 要件3 |
| `TileSprite` | **B** | シェーダで UV を手動ラップ（Phaser 4 と同じ方針） |
| `Image` / `RenderTexture` / `DynamicTexture` | **C** | RenderTexture は**非 SoA**（テクスチャは共有資源）。SoA 破壊しないので可 |

### 2.4 `tweens` — SoA 適合度 **最高**

| メンバ | 判定 | 備考 |
| --- | --- | --- |
| `tweens.add` / `addCounter` / `addSequence` / `addChain` | **A** | 実装済 |
| `tweens.add` の戻り値 `Tween` ハンドル | **C** | **Flyweight `Tween`**（`id` のみ保持）を新設。SoA 維持 |
| `Tween.play/pause/resume/stop/isPlaying/isPaused/progress/getProgress/seek/isDestroyed` | **C** | 上記ハンドルから SoA を代理参照 |
| `tweens.chain` / `killTweensOf*` / `killAll` / `getTweens` / `getTweensOf` | **A/C** | `getTweensOf` の戻り値配列は**使い回し**にする |
| `tweens.timeScale` / `globalTimeScale` | **A** | スカラー |
| `tweens.add` の単位 | **A** | **Phaser は秒**。Pluto は `ms` → **要統一** |
| `Tween.seek` / `TweenChain` | **C** | `seek` は SoA を直接更新。SoA 維持 |
| `easeParams` / `repeatDelay` / `hold` / `persist` | **A** | SoA 配列追加 |

### 2.5 `animations` — SoA 適合度 **最高**

| メンバ | 判定 | 備考 |
| --- | --- | --- |
| `anims.create` / `generateFrameNumbers` / `load` / `parse` | **A** | 実装済 |
| `sprite.play` / `playReverse` / `chain` / `stop` | **B** | `play` は実装済。**`AnimState` ハンドルが未実装** |
| `anims.exists` / `getName` / `global` | **A** | — |
| `anims.get` / `anims.stops` | **C** | `AnimState` ハンドル |
| `chain` の引数 `includeDelay` | **A** | スカラー |
| `skipMissedFrames` | **A** | スカラー（既に `MAX_CATCHUP_STEPS` で近似） |

### 2.6 `physics-arcade` — SoA 適合度 **高**（対策が要る）

Pluto の `ArcadePhysics` は既に `velX/velY/mass/bounce` の SoA 化済み。

| メンバ | 判定 | SoA 配列 | 備考 |
| --- | --- | --- | --- |
| `body.velocity` / `setVelocity(X/Y)` | **A** | `velX` / `velY` | **setVelocity(X/Y) が未実装**（`setVelocity` のみ） |
| `body.setAcceleration` / `setDrag` / `setBounce` / `setMaxVelocity` / `setFriction` / `setGravityY` | **B** | `accX/accY/dragX/dragY/maxVelX/maxVelY/bounce: Float32Array` | **すべて未実装**。CPU ループ 增加 |
| `body.setSize` / `setOffset` / `setCircle` / `setCollideWorldBounds` | **B** | `hitWidth/hitHeight/offsetX/offsetY` | `setSize` 未実装 |
| `body.setImmovable` / `body.enable` | **B** | `immovable: Uint8Array` | — |
| `body.isColliding` / `getOverlap` / `getVelocity` | **C** | 返り値は `Array` → **使い回し** |
| `physics.add.overlap` / `collider` / `group` / `staticGroup` | **A** | 実装済（`overlap`/`collider`） |
| **`physics.world`** | **D** | — | `setBoundsRectangle` / `setBounds` / `collideWorldBounds` / `bounds` / `gravityX/Y` / `debugGraphic` / `step` は **`World` オブジェクト＋`body` を持ち SoA を崩す** |
| `physics.add.existing` | **E** | — | 要件3。既存の `body` を `Sprite` に紐付ける。SoA では不要 |
| `physics.add.staticGroup` | **C** | 固定長 `Float32Array` ＋ `Uint8Array` | `Group` は **D** |

**`physics.world` の方針（要件3）**: SoA  World's 状態を**カバーする:flutter 'setBoundsRectangle(bounds)` などで**し**、per-entity の `body` は**愤ね** `Sprite` に委譲**します。`physics.world` は**読み取り専用の sanctions ビュー**として公開し、per-object の `body` は**参照を持ちません**。

### 2.7 `particles` — SoA 適合度 **非常に高**

Phaser の `ParticleEmitter` は zone/emitter を持ちますが、**平坦化すれば** SoA 完全適合です。

| メンバ | 判定 | SoA 配列 |
| --- | --- | --- |
| `add.particles(x, y, texture, config)` | **B** | `ParticleManager` は実装済だが **Phaser 互換 API が無い** |
| `emitter.emitParticle(atX?, atY?)` | **B** | `createEmitter` の互換ラッパー |
| `setParticleTint` / `particleBringToTop` | **A** | `tint` / `sortIndex` |
| `emitter.speedX/Y` / `scaleX/Y` / `alpha` / `tint` / `angle` | **B** | **SoA** |
| `emitter.lifespan` / `quantity` / `frequency` / `maxAliveParticles` | **B** | スカラー |
| `emitter.gravityX/Y` / `emitter.setParticleGravity` | **B** | `accX/accY` |
| `emitter.emitters` / `ParticleEmitterZone` | **D** | **平坦化**：`emitter.Zone` は `Uint8Array`（形状 ID）+ `Float32Array`（パラメータ）。**per-emitter オブジェクトを作らない** |
| `emitter.ops` / `ParticleEmitterOp` | **D** | 連続値として `Float32Array` に平坦化（`ops.rotate = Float32Array(maxOps*2)`） |
| `emitter.processor` / `ParticleProcessor` | **E** | 要件3。**public API ではない** |

### 2.8 `groups-and-containers` — SoA 適合度 **中**（対策が必要）

| メンバ | 判定 | 対策 |
| --- | --- | --- |
| `add.container(x, y, children)` | **C** | **SoA スロット + `parentId`** で実装。`Container` は Flyweight（`id` のみ） |
| `Container.add` / `remove` / `removeAll` / `getAt` / `getAll` / `getIndex` / `swap` | **D** | **可変長の子リスト**は SoA 化できない。**对策**：`parentId` による走査で**使い回し `Array`**を返す |
| `Container.getBounds` / `getSize` | **A** | 子を走査して集約（SoA） |
| `add.group` / `Group` | **D** | `Group` は**可変長リスト**。SoA 化不可 → **使い回し `Array`** |
| `Group.add` / `remove` / `getChildren` / `getLength` / `contains` | **D/C** | 同上 |
| `Group.createMultiple` / `create` / `runChildUpdate` | **D** | 同上 |
| `Group.getFirst`/`getLast`/`getAt` | **C** | `Group` は内部に `int[]` を保持。Flyweight `Group` は `id` のみ |
| `Container.setSize` / `setPosition` | **A** | SoA |
| `staticGroup` | **D** | `physics` の判定を参照 |
| `createGameObjectFactory` | **D** | プレーンオブジェクトを返す → SoA 不可 |
| `Container` の mask / filter | **E** | 要件3 |
| **`add.existing`** | **E** | **既定で却下**。Phaser では `Sprite` を `Group`/`Container` に**オブジェクトとして**登録する。SoA では `parentId` の 1 書きで足りるため、`add.existing` 相当は **`setParentId` のみ**で足りる。**API 互換の `add.existing` は実装しない**（flyweight は既に double-registration を表現できない） |

### 2.9 `text-and-bitmaptext` — SoA 適合度 **高**（ただし一部 E）

Pluto の `Text` は 1 文字 = 1 アリーナスロットで既に SoA 化済み。

| メンバ | 判定 | 備考 |
| --- | --- | --- |
| `add.text` / `add.bitmapText` | **A/B** | `bitmapText` は BMFont をパースして SoA に落とす |
| `Text.setFont` / `setFontSize` / `setColor` / `setAlign` / `setLineSpacing` / `setPadding` / `setWordWrapWidth` / `setResolution` | **B** | **すべて未実装**。SoA 配列追加 |
| `Text.setStroke` / `setShadow` | **E** | 要件3。**2 パス描画＋StrokeStyle が SoA と非相性** |
| `Text.setOrigin` / `setScale` / `setAlpha` / `setDepth` / `setVisible` / `setInteractive` / `getBounds` | **B/A** | `Text` は現在 `Sprite` のサブクラスではない → **`Flyweight Text` を Sprite と共通化**が必要 |
| `Text.updateText` / `updateLetterSpacing` / `setText` | **A** | `rebuild` が実装済 |
| `BitmapText` の per-character 配置 | **A** | SoA が最適 |
| `BBCodeText` / `TagText` | **E** | 要件3。**per-character スタイル変化**は SoA では表現不可能（1 文字ごとに「different tint ＋ different size」＝ SoA 配列が壊れる） |
| `DynamicText` | **E** | 要件3。command buffer 主体 |
| `CharacterCache` | **C** | Glyph の SoA が実装済（`FontAtlas`）。`RetroFont.Parse` は **D** |
| `TextTyping` / `TextPage` / `TextTruncator` / `TextEdit` | **C/D** | 状態は SoA。コールバックは **D** |

### 2.10 `tilemaps` — SoA 適合度 **高**

| メンバ | 判定 | SoA 配列 / 対策 |
| --- | --- | --- |
| `make.tilemap` / `add.tilemap` | **C** | `Tilemap` は**メタデータのみ**（Layers/Tilesets）。SoA は tilemap レイヤ側 |
| `tilemap.createLayer(x, y, tileset)` | **B** | `TilemapLayer` は Flyweight + `tileIndex: Int32Array` |
| `tilemap.createBlankLayer` | **B** | 同上 |
| `TilemapLayer.setCollisionByIndex` | **C** | 衝突フラグは SoA `collision: Uint8Array` |
| `TilemapLayer.setDepthSort` | **E** | 要件3。Z 順ソートは SoA では重い |
| `Tilemap.findTileAt` / `getTilesWithinWorldXY` | **A** | SoA 走査 |
| `Tilemap.renderAll` / `destroy` | **A/C** | `destroy` は `SoA free` |
| `TilemapLayer` の UV / tile 取得 | **A** | **`UV mapping が TODO**。`tileIndex → uv` を SoA で事前計算 |
| `TilemapGPULayer` | **C** | 1 quad で描画。**WebGPU compute** で生成 |
| Tilemap の Collider / Overlap | **B** | `ArcadePhysics` に委譲 |

### 2.11 `audio-and-sound` — SoA 適合度 **低〜中**（音は SoA 向かない）

| メンバ | 判定 | 備考 |
| --- | --- | --- |
| `sound.add(key, url)` / `sound.add.audioSprite` | **D** | `AudioBuffer` は共有資源。SoA 制約外（ヒープ） |
| `sound.play` / `playAudioSprite` | **D** | **Flyweight `Sound`**（`id` + `_manager`）を新設。Voice は**共有プール** |
| `Sound.isPlaying` / `volume` / `mute` / `loop` / `rate` / `seek` / `isPaused` | **D** | Flyweight `Sound` から `Voice` を参照。**per-sound 状態は SoA 化しない**（sap 数少ないため） |
| `Sound.destroy` / `setVolume` / `stop` / `play` | **D** | 同上 |
| `Sound.pauseByKey` / `resumeByKey` / `stopByKey` / `stopAll` / `stopAll` | **A** | キー単位の集約。SoA |
| `sound.mark` / `addMarker` / `removeMarker` / `removeAllMarkers` | **D** | マーカー配列は可変長 |
| `Sound.pan` / `setPan` | **D** | — |
| `sound.setRate` / `setSeek` / `setLoop` / `setVolume` | **D** | — |
| `sound.effects` / `filters` / `listenerX/Y/Z` | **D/A** | `listenerX/Y/Z` は SoA（スカラー） |
| `sound.mute` / `volume` / `unlock` / `pauseAll` / `resumeAll` | **A** | スカラー |
| `load.audio` | **B** | `LoaderManager` に `'audio'` を追加 |
| `FadeVolume` | **C** | SoA で fade を計算（`Voice` は共有） |
| `sound.onEnded` イベント | **D** | クロージャ |
| `AudioSprite` | **D** | Flyweight |

### 2.12 `input-keyboard-mouse-touch` — SoA 適合度 **不要**（入力は低頻度）

| メンバ | 判定 | 備考 |
| --- | --- | --- |
| `input.keyboard.addKey` / `addKeys` / `createCursorKeys` / `addCaptureKeys` | **D** | **入力は毎フレーム数体**であり SoA のメリットなし。**Flyweight `Key`** が実装済 |
| `Key.isDown` / `isJustDown` / `isJustUp` / `duration` / `timeDown` / `timeUp` / `addTo` / `removeFrom` | **D** | `Key` は `code` のみ保持（Flyweight）。入力数は少数のため SoA 化は意味がない |
| `key.Shift/Ctrl/Alt/Meta/WASD/arrows` | **D** |  **`Key` のプロパティ** |
| `input.keyboard.JustDown` / `JustUp` / `addKey` | **D** |  Closure ベース |
| `input.activePointer` / `addPointer` | **D** |  **`Pointer` は実装済**。ただし単一ポインタのみ |
| `Pointer.x/y/worldX/worldY/pointerId/downX/upX/isDown/...` | **D** | `Pointer` は Flyweight |
| `Pointer.movementX` / `velocity` / `angle` / `distance` / `dx/dy` | **D** |  **`Pointer` を拡張**。ポインタ数は少ないので SoA 化しない |
| `input.addTouch` / `removeTouch` / `Touch` | **E** | 要件3。**複数タッチは SoA と非相性**（ただし `HitTest` は SoA 可） |
| `input.gamepad` / `Gamepad` / `GamepadPlugin` | **D** | **`InputManager` に委譲**。Flyweight `Gamepad` |
| `Gamepad.total` / `gamepads` / `getAll` / `supported` / `onDown/onUp/onAxis` | **D** | 同上 |
| `input.setCapture` / `setPreventDefault` / `stopPropagation` | **D** | — |
| `input.activeKeys` / `enabled` / `total` / `event` / `manager` / `handles` | **D/A** | `enabled` はスカラー |

### 2.13 `loading-assets` — SoA 適合度 **不要**（シングルトン）

| メンバ | 判定 | 備考 |
| --- | --- | --- |
| `load.image` / `spritesheet` / `atlas` / `bitmapText` / `json` / `csv` / `yaml` / `audio` / `video` | **A/B** | 実装済（`audio` は **B**） |
| `load.spritesheet` の `frameWidth/frameHeight` | **A** | **実装済**。スプライトサイズに直結 |
| `load.atlas` / `load.packerJsonAtlas` / `load.oil` | **A/C** | `atlas` は実装済 |
| `load.setPath` / `setCORS` / `setRequestHeader` | **D** | 文字列 |
| `load.audioSprite` / `audio` | **B** | `LoaderManager` に追加 |
| `load.video` | **E** | 要件3。**動画再生は SoA と非相性** |
| `load.svg` / `load.obj` | **E** | 要件3 |
| `load.glb` / `load.gltf` | **E** | 要件3 |
| `load.start` / `get` / `exists` / `once` / `on` / `off` / `reset` / `abort` | **A/D** | `reset/abort` は未実装 |
| `load.totalToLoad` / `loadProgress` / `list` | **A/C** | `list` は `Map` |
| `load.scenePlugin` | **E** | 要件3 |
| `load.texture` | **D** | `TextureManager` に委譲 |
| `textures.addSpriteSheet` / `addAtlas` / `addImage` / `addBase64` / `addCanvas` / `addDynamicTexture` / `remove` / `get` / `exists` / `list` / `getKeys` | **A/B/D** | `addSpriteSheet` は未実装、`addBase64` は **B** |
| `textures.getFrame` / `getSourceImage` / `refresh` | **A/D** | `getFrame` は SoA |

### 2.14 `events-system` — SoA 適合度 **不可**（クロージャ）

| メンバ | 判定 | 備考 |
| --- | --- | --- |
| `events.on` / `once` / `off` / `emit` / `removeAllListeners` / `listenerCount` / `eventNames` | **C** | **クロージャは SoA 化不可**。`EventEmitter` は実装済（emit 中の compact で GC 抑制）。**SoA を壊さない**ので可 |
| `events.once` の Promise 版 | **D** | Promise |
| `events.waitEvents` | **D** | — |
| `EventEmitter.on` の `context` 引数 | **D** | — |

### 2.15 `data-manager` — SoA 適合度 **不可**（`any` 型）

| メンバ | 判定 | 対策 |
| --- | --- | --- |
| `data.set` / `get` / `has` / `remove` / `clear` / `values` / `getAll` / `update` / `each` | **D** | `set(key, any)` は値型多样 → SoA 不可。**Pluto は `Registry` に分離** |
| `data.getFloat` / `setFloat` / `inc` / `addFloat` | **B** | **Pluto に実装済**（`Float64Array` fast path）。Phaser 4 には無いが SoA 最適 |
| `registry.set` / `get` / `has` / `remove` / `keys` / `events` | **D** | オブジェクトhib |

### 2.16 `cameras` — SoA 適合度 **不要**（カメラは少数）

| メンバ | 判定 | 備考 |
| --- | --- | --- |
| `cameras.add` / `main` / `getCamera` / `getCameras` | **A/D** | `getCameras` は使い回し配列 |
| `Camera.setScroll` / `setZoom` / `setRotation` / `centerOn` / `getWorldPoint` / `getBounds` | **A** | 実装済 |
| `Camera.setName` / `resetFX` | **D/A** | `resetFX` は RenderGraph |
| `Camera.startFollow` / `stopFollow` | **A** | 実装済 |
| `Camera.pan` / `zoomTo` / `fadeIn` / `fadeOut` / `shake` / `flash` | **A** | 実装済（`MAX_EFFECTS=8` の **SoA 化**は Phase 5） |
| `Camera.effects` | **D** | — |
| `Camera.setRenderToTexture` | **C** | RenderTexture が必要 |
| `Camera.preFX` / `postFX` | **E/C** | **Filter システム**。**WebGPU でのみ**（要件2） |
| `Camera.getWorldDirection` / `getMidPoint` | **A** | — |
| `Camera.setAlpha` / `setTransparent` | **B/A** | 追加 |

### 2.17 `scale-and-responsive` — SoA 適合度 **不要**

| メンバ | 判定 | 備考 |
| --- | --- | --- |
| `scale.width` / `height` / `displaySize` / `gameSize` / `parentSize` / `mode` / `zoom` | **A** | スカラー／ベクトル |
| `ScaleManager.refresh` / `resize` / `setParentSize` / `setGameSize` / `setZoom` / `startListeners` / `stopListeners` / `onResize` | **A/D** | — |
| `scale.refresh` / `updateBounds` / `displayScale` / `transformX` / `transformY` / `transformPoint` / `getParentBounds` / `addGameSize` / `addDisplaySize` | **A** | 数値変換 |
| `scale.setParentSize` / `setDisplaySize` | **A** | — |

### 2.18 `time-and-timers` — SoA 適合度 **最高**

| メンバ | 判定 | SoA 配列 | 備考 |
| --- | --- | --- | --- |
| `time.addEvent` / `delayedCall` / `removeEvent` / `clearTimers` | **A** | 実装済 |
| `time.time` / `delta` / `now` / `fps` / `smoothStep` | **A** | スカラー |
| `TimerEvent.remove` / `reset` / `getProgress` / `getElapsed` | **C** | Flyweight `TimerEvent` |
| `time.timeScale` / `slowMotion` / `slowMo` / `painSplit` | **A** | スカラー |
| `Clock.add` / `addPreUpdate` / `addPostUpdate` / `preUpdate` / `postUpdate` | **C** | クロージャ |
| `Counter` | **C** | Flyweight |

### 2.19 `scenes` — SoA 適合度 **不要**（シーンは少数）

| メンバ | 判定 | 備考 |
| --- | --- | --- |
| `scene.scene.start` / `stop` / `restart` / `pause` / `resume` / `switch` / `get` / `getScenes` / `isActive` / `isPaused` / `getKeys` / `setActive` / `isSleeping` / `wake` / `sleep` / `setVisible` | **A** | 実装済（`getScenes` は使い回し） |
| `Scene.preload` / `init` / `create` / `update` | **A** | 実装済 |
| `Scene.create` の `data` 引数 | **D** | `any` |
| `Systems.step` / `getUpdateList` / `getProcessList` | **E** | 要求3。**内部実装**、public API ではない |
| `sys.events` / `sys.settings` / `sys.game` / `sys.scene` | **D/A** | — |
| `ScenePlugin.start` / `stop` / `restart` / `pause` / `resume` / `isActive` / `isPaused` / `get` / `getScenes` / `setActive` / `sleep` / `wake` | **A/D** | 実装済 |
| `ScenePlugin.getRenderList` | **E** | 要件3。**内部実装** |

### 2.20 `physics-matter` — **実装しない（要件3）**

Matter.js は rigid-body で、`body` オブジェクトを多数持ちます。

- Pluto は **XPBD**（`packages/xpbd`）、**Verlet IK**（`packages/verlet-ik`）、
  **Continuum Crowds**（`packages/continuum`）、**Poisson Flow Field**（`packages/poisson`）を
  **全て SoA で実装済み**。
- 要件3により Matter.js 互換（`Bodies` / `Body` / `Composites` / `Constraint` / `Collision` / `Detector` /
  `Detector` / `Pairs` / `Query` / `SAT` / `Resolver` / `Sleeping` / `Composites` / `Svg` / `Vertices` /
  `Constraint` / `Common` / `MouseConstraint` / `Mouse` / `Runner` / `Render`）は**実装しません**。

### 2.21 `curves-and-paths` — SoA 適合度 **高**（動的長のみ対策）

| メンバ | 判定 | 対策 |
| --- | --- | --- |
| `Curves.Line` / `QuadraticBezier` / `CubicBezier` / `Spline` / `CatmullRom` | **C** | **`out: Float32Array` パラメータ必須**。Point オブジェクトを生成しない（Phaser 4 の `Vector2` 統一に乗る） |
| `Curves.Ellipse` / `Arc` / `RandomWalk` / `Path` | **C** | 点列は **`Float32Array` 事前確保 + `writeCursor`** で実装 |
| `Path.getPoints` / `draw` / `getSpacedPoints` | **C** | 使い回し配列 |
| `Path.getBounds` | **A** | SoA |
| `Path.Interpolate` / `Path.Rotate` / `Path.RotateAround` / `Path.Scale` / `Path.Translate` / `Path.RotateRandom` / `Path.getRandomPoint` / `Path.getPoint` | **C** | 同上 |
| `Curve.getPoint` / `getPoints` / `getLength` / `getLengths` | **C** | 同上 |
| `Path.TangentTo` / `NormalTo` / `Mirror` / `Reflect` | **C** | 同上 |

### 2.22 `graphics-and-shapes` — **一部実装しない（要件3）**

Phaser 4 の Shape は約 25 種類。すべて **command buffer（描画命令の列）** であり、
**SoA を破壊します**（1 エンティティ = N 個の異種描画命令）。

**方針（要件3）:**

- **静的地ジオメトリ**（矩形・円・角丸矩形・三角形・星・楕円・弧）は
  **頂点列を SoA（`Float32Array`）に事前計算**し、インスタンス描画で描画する → **C**
- **動的 command buffer**（`Graphics` の `fillRect` 連鎖、`Shape` の毎フレーム再構築）は
  **実装しない** → **E**
- **UI で必要な円／角丸矩形／進捗バー**は `rex-notes` に OEM がある（`CircularProgress` 等）。
  静的ジオメトリとして実装可能 → **C**

| メンバ | 判定 |
| --- | --- |
| `add.rectangle` / `circle` / `ellipse` / `arc` / `triangle` / `star` / `polygon` / `line` / `grid` / `isobox` / `isotriangle` / `roundrect` / `quad` / `spinner` / `checkbox` / `toggleswitch` / `cover` / `fullwindowrect` | **C**（静的 SoA） |
| `add.shape` | **D**（カスタム Shape） |
| `add.graphics` | **E**（動的 command buffer） |
| `add.progressBar` / `add.circleProgress` | **C**（静的） |
| `Shape` のメソッド（`setStrokeStyle` / `setFillStyle` / `setSize` / `setPosition` / `setDisplaySize` / `setAngle` / `setScale` / `setAlpha` / `setOrigin` / `setDepth` / `setScrollFactor` / `setVisible` / `setName` / `setActive` / `setBlendMode`） | **B/A**（SoA） |
| `Shape` の `geom` / `fillColor` / `fillAlpha` / `strokeColor` / `strokeAlpha` | **B**（SoA） |

### 2.23 `filters-and-postfx` — **WebGPU でのみ実装（要件2）**

| メンバ | 判定 | 備考 |
| --- | --- | --- |
| `preFX` / `postFX` / `filters` / `setPipeline` / `setPostPipeline` / `clearPipeline` | **E** | Phaser 4 で RenderNode / Filter に一本化。**SoA に対応しない** |
| `FilterMask` / `BitmapMask` / `GeometryMask` | **E** | 要件3。**Mask は per-object 必然** |
| `Blur` / `Bloom` / `Glow` / `Shadow` / `Pixelate` / `ColorMatrix` / `Quantize` / `Vignette` / `Wipe` / `Blocky` / `Sampler` / `Threshold` / `Key` / `GradientMap` / `NormalTools` / `ImageLight` / `PanoramaBlur` / `CombineColorMatrix` / `ParallelFilters` / `Displacement` / `Blend` | **C**（**WebGPU のみ**） | 要件2。**Fragment シェーダの multi-pass**。WebGPU では compute で高速化。**WebGL2 では簡易版のみ** |
| `setLighting(true)` | **E** | 要件2。max light 数が著しく制限 |
| `Gradient` / `Noise`（`NoiseCell2D/3D/4D`, `NoiseSimplex2D/3D`） | **C**（WebGPU） | フラグメントシェーダ |
| `CaptureFrame` / `Stamp` | **E** | 要件3 |

### 2.24 `render-textures` — SoA 適合度 **中**（テクスチャは共有資源）

| メンバ | 判定 | 備考 |
| --- | --- | --- |
| `add.renderTexture` / `add.dynamicTexture` | **C** | **非 SoA**（テクスチャを共有）。`SoA` を**壊さない**ので可 |
| `DynamicTexture.draw` / `drawFrame` / `fill` / `clear` / `render` | **C** | **描画命令の列**。SoA は関係しない（テクスチャが対象） |
| `RenderTexture` の `snapshot*` | **D** | — |
| `DynamicTexture` の `generateMipMaps` / `addBatch` | **E** | 要件3 |
| `textures.addDynamicTexture` | **B** | — |

### 2.25 `actions-and-utilities` — SoA 適合度 **不可**（クロージャ）

`RexPlugins` の Action は**クロージャ主体**です。

| メンバ | 判定 | 備考 |
| --- | --- | --- |
| `rotato` / `scalePopUp` / `fadeOutDestroy` / `fadeIn` / `gridAlign` / `randomPlace` / `shake` / `moveTo` / `easeMoveTo` / `anchor` / `flip` / `easeData` / `pathFollower` | **D** | クロージャ。**Tween / Effect に lowering**して実装 |
| `RunCommands.run` | **D** | — |
| `Easedata` | **C** | SoA（パラメータ列は Float32Array） |

### 2.26 `v4-new-features` — **WebGPU のみ（要件2）**

| メンバ | 判定 | 備考 |
| --- | --- | --- |
| `SpriteGPULayer` | **C** | **SoA と最適**。静的 GPU バッファ + GPU 駆動アニメ。**Pluto の中核** |
| `TilemapGPULayer` | **C** | 1 quad |
| `RenderNodeManager` | **E** | 要件3 |
| `TintModes`（`MULTIPLY` / `FILL` / `ADD` / `SCREEN` / `OVERLAY` / `HARD_LIGHT`） | **B** | `tintMode: Uint8Array`。シェーダ分岐 |
| `roundPixels` / `smoothPixelArt` / `vertexRoundMode` | **E** | 要件2 |
| PCT Atlas 形式 | **B** | Loader に追加 |
| `RenderSteps` | **E** | 要件3 |
| `Lighting` | **E** | 要件2 |

---

## 3. 要件3 に基づく「実装しない」一覧（明示的却下）

以下は **SoA を破壊する**か、**要求3により重い**ため**実装しません**。
互換性は提供しません。

| # | 対象 | 却下理由 |
| --- | --- | --- |
| E-01 | `physics.add.existing` | Flyweight は object registration を表現できない。`setParentId` で代替 |
| E-02 | `add.graphics`（動的 command buffer） | 1 エンティティ = N 命令となり SoA を破壊 |
| E-03 | `Shape` の動的再構築 | 同上 |
| E-04 | `BBCodeText` / `TagText` | per-character スタイル変化が SoA を破壊 |
| E-05 | `DynamicText` | command buffer 主体 |
| E-06 | `Text.setStroke` / `setShadow` | 2 パス描画＋StrokeStyle が SoA と非相性 |
| E-07 | `physics-matter` 全体 | XPBD / Verlet / Continuum を SoA で提供済 |
| E-08 | `setMask` / `BitmapMask` / `GeometryMask` | Mask は per-object 必然 |
| E-09 | `setLighting` | 要件2。max light 数が著しく制限 |
| E-10 | `load.video` / `svg` / `obj` / `glb` | 要件3。SoA と非相性 |
| E-11 | `setPipeline` / `preFX` / `postFX` | Phaser 4 で RenderNode に一本化済み。**`filters` として別実装** |
| E-12 | `willRoundVertices` / `roundPixels` / `vertexRoundMode` | 要件2。頂点丸めは GPU 負荷 |
| E-13 | `Systems.*` / `ScenePlugin.getRenderList` | 内部実装。public API ではない |
| E-14 | `input.addTouch` / `removeTouch` / `Touch` | 複数タッチは SoA と非相性（`HitTest` は SoA 可） |
| E-15 | `load.scenePlugin` | 要件3 |
| E-16 | `Container` の mask / filter | 要件3 |
| E-17 | `ParticleProcessor` | 非 public API |
| E-18 | `TilemapLayer.setDepthSort` | Z 順ソートは SoA では重い |
| E-19 | `willRoundVertices` の override | 要件2 |
| E-20 | `RenderNodeManager` / `RenderSteps` | 要件3 |

## 4. 要件2（WebGPU > WebGL > CPU）の担保策

**現状は要件2を満たしていません。** 300k 実測（`docs_site/performance.md:147-151`、旧実装）では
**WebGL2 17 FPS / WebGPU 10 FPS** でした（WebGPU の毎フレーム O(n) interleave が原因）。
Phase 1 で interleave を write-through 化済みですが、**CI に WebGPU adapter がなく未検証**です。

**必須タスク:**

| # | タスク | 目的 |
| --- | --- | --- |
| P-01 | WebGPU が使える bench harness を用意 | 要件2を**測定可能**にする |
| P-02 | WebGPU パスで culling / Morton sort / indirect draw を実装 | WebGPU を最速に |
| P-03 | WebGL2 に culling（byteOffset による baseInstance）を実装 | WebGL2 を CPU より速く |
| P-04 | すべての Filter を WebGPU のみに限定 | 要件2。WebGL2 では簡易版 |
| P-05 | benchmark_results.json に 3 othy (WebGPU / WebGL2 / CPU) を記録 | 退化検出 |

## 5. 未実装 API の-gap 一覧（既存コードとの差分）

| 分類 | 件数 | 主なもの |
| --- | ---: | --- |
| `Sprite` の Phaser メソッド | 30 | `setOrigin` / `setTintMode` / `setScrollFactor` / `setActive` / `setName` / `setBlendMode` / `getWorldTransformMatrix` / `setWinding` / `setMask` / `setPipeline` |
| `Tween` ハンドル | 12 | `play` / `pause` / `resume` / `stop` / `isPlaying` / `isPaused` / `progress` / `getProgress` / `seek` / `isDestroyed` / `reset` |
| `AnimState` ハンドル | 8 | `play` / `playReverse` / `stop` / `pause` / `resume` / `isPlaying` / `getProgress` / `progress` |
| `Body` / `World`（arcade） | 25+ | `setVelocityX/Y` / `setAcceleration` / `setDrag` / `setBounce` / `setImmovable` / `world.setBoundsRectangle` |
| `Text` のスタイル API | 12 | `setFont` / `setFontSize` / `setColor` / `setAlign` / `setLineSpacing` / `setPadding` / `setWordWrapWidth` / `setResolution` |
| `Group` / `Container` の子リスト API | 12 | `add` / `remove` / `getAt` / `getAll` / `getIndex` / `swap` |
| `ParticleEmitter` の Phaser API | 30+ | `emitParticle` / `start` / `stop` / `explode` / `speedX/Y` / `lifespan` / `quantity` / `frequency` / `ops` / `Zone` |
| `Pointer` の拡張 | 15 | `pointerId` / `movementX` / `velocity` / `angle` / `distance` / `dx/dy` / `upX/upY` / `downX/downY` |
| `TimerEvent` ハンドル | 5 | `remove` / `reset` / `getProgress` / `getElapsed` |
| `Gamepad` / `Touch` | 10+ | — |
| `Loader` の拡張 | 10 | `audio` / `video` / `setPath` / `setCORS` / `reset` / `abort` / `onProgress` / `key` / `file` |
| `TextureManager` の拡張 | 8 | `addSpriteSheet` / `addBase64` / `addCanvas` / `remove` / `list` / `getKeys` / `refresh` / `getFrame` |
| `Curves` の out パラメータ化 | 20+ | — |
| `Math` の追加 | 15 | `Linear` / `SmoothStep` / `Sinusoidal` / `Percentage` / `FuzzyMatch` / `BetweenPoints` / `RadiansToDegrees` |

**合計: 約 250+ メソッド／プロパティ** が未実装です。
