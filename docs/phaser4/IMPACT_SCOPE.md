# 影響範囲 — Phaser 4 互換 API 実装 roadmap

> 判定の根拠は [`SOA_FEASIBILITY.md`](./SOA_FEASIBILITY.md)、
> 全シンボルは [`API_INDEX.md`](./API_INDEX.md) を参照。
>
> **この文書に沿って実装を進めることで、実装忘れとバグが軽減されます。**
> 各 Phase 完了時にチェックリストの全項目にチェックを付ける運用です。

## 0. 鉄則（実装時に必ず守る）

| # | 鉄則 | 違反后果 |
| --- | --- | --- |
| R-01 | **CPU 側の状態はすべて SoA**（`Float32Array` / `Int32Array` / `Uint8Array` / `Uint32Array`）。vec / オブジェクトは **GPU 転送用 `packed*` ミラーと vec 演算子のみ** | アリーナの連続性与キャッシュ局所性が崩壊し、300k が成立しなくなる |
| R-02 | **`update` / `render` ループ内で `new` / `{}` / `[]` / `.push()` 禁止** | GC スパイク（1.9〜80 B/frame の予算が壊れる） |
| R-03 | **Flyweight は own property を `id` + 参照のみ**に保つ | ヒープigrafが 32 バイトを超えて 300k で数 MB になる |
| R-04 | **SoA 配列への直接代入禁止**。write-through セッターを通す | packed ミラーが腐り、その 1 体だけ描画が壊れる |
| R-05 | **性能順序は WebGPU > WebGL > CPU**。これを下回る実装は却下 | 要件2違反 |
| R-06 | 実装不可と判断したものは **E リスト（20 件）** に従い、互換性をあきらめて代替 API を提供する | 要件3違反 |
| R-07 | 1 メソッドを追加するたびに **SoA 対応テスト**を同时追加する | テストが追いつかず退行が混入 |

---

## 1. Phase 構成（依存順）

```
Phase 0  計測基盤（WebGPU bench）
   │
   ├─ Phase 1  GameObject 基盤 SoA 拡張
   │      ├ origin / scrollFactor / active / tintMode / name
   │      └ 結果: Sprite が Phaser の基本 API を網羅
   │
   ├─ Phase 2  Flyweight ハンドル群
   │      Tween / AnimState / TimerEvent / Sound / Group / Container
   │
   ├─ Phase 3  入力・サウンド・ 시간の API 拡張
   │
   ├─ Phase 4  physics-arcade の body/world
   │
   ├─ Phase 5  particles の Phaser API
   │
   ├─ Phase 6  text / tilemaps / graphics(static shapes)
   │
   ├─ Phase 7  curves / math / geometry（out パラメータ化）
   │
   └─ Phase 8  GPU-driven（要件2 の達成）
          ├ RenderGraph + Filter（WebGPU のみ）
          └ culling / Morton / indirect draw
```

---

## 2. Phase 1 — GameObject 基盤 SoA 拡張

### 2.1 追加する SoA 配列（`InstanceBufferArena`）

| 配列 | 型 | 用途 | packed ミラー |
| --- | --- | --- | --- |
| `originX` / `originY` | `Float32Array` | 描画原点（Phaser は 0.5, 0.5 既定） | 新規 `packedOrigin`（vec4 + 予備 2 lane） |
| `scrollFactorX` / `scrollFactorY` | `Float32Array` | カメラスクロール係数（パララックス） | 同上 lane に格納 |
| `active` | `Uint8Array` | update/draw の一括スキップ | `packedFlags` の予備 lane へ |
| `tintMode` | `Uint8Array` | Phaser 4 の 6 モード | 同上 |
| `nameSlot` | `Int32Array` | `setName` のスロット化 | なし（CPU 専用） |
| `blendMode` | `Uint8Array` | `setBlendMode` | なし（**バッチ分割**で解決） |
| `kind` | `Uint8Array` | `type` の数値表現 | なし（CPU 専用） |

> **注意**: `packedFlags` は 4 lane を使い切りです。新規 lane は
> `packedOrigin`（vec4: originX, originY, scrollFactorX, scrollFactorY）を新設し、
> `active` / `tintMode` は `packedExt` の 4 lane 消費枠のうち 2 つを使います。

### 2.2 追加する `Sprite` メソッド

| メソッド | 分類 | 備考 |
| --- | --- | --- |
| `setOrigin(x?, y?)` / `setOriginFromFrame()` | **B** | 既定 0.5。頂点シェーダでクワッドを移動 |
| `getLocalTransformMatrix()` | **D** | `out: Float32Array(4)` を必須化（オブジェクト生成禁止） |
| `getWorldTransformMatrix()` | **D** | `out` 必須。シェーダと同じ計算を CPU 側で行う |
| `getOrigin()` | **A** | `out` パラメータ |
| `setTintMode(mode)` / `tintMode` | **B** | シェーダに分岐を追加（6 モード） |
| `setActive(v)` / `active` | **B** | `render()` / `update()` の先頭で一括スキップ |
| `setScrollFactor(v)` / `setScrollFactorX/Y()` / `scrollFactorX/Y` | **B** | カメラごとの描画位置を計算 |
| `setName(name)` / `name` | **C** | 文字列プール。**SoA 化しない** |
| `setBlendMode(mode)` / `blendMode` | **D** | **バッチ分割が必要**。即座には実装せず Phase 8 で |
| `setBlendMode` の enum | **D** | `BlendMode` 定数オブジェクト |
| `setInteractive` の Phaser 互換オーバーロード | **C** | shape / callback / config を Flyweight で扱う |
| `willRoundVertices()` | **E** | 却下 |
| `setWinding` / `setShader` / `setMask` / `setPipeline` | **E** | 却下 |
| `setData` / `getData` | **D** | `scene.registry` へ誘導する誘導のみ実装 |
| `setOriginToDefault()` | **B** | `setOrigin(0.5, 0.5)` |
| `setSize(w, h)` | **B** | `frameWidth/Height` を直接 |
| `getSize(out)` | **B** | — |

### 2.3 チェックリスト

- [x] `InstanceBufferArena` に SoA 配列 7 種を追加
- [x] write-through セッターを追加（`setOrigin` / `setScrollFactor` / `setActive` / `setName` / `setBlendMode` / `setTintMode`）
- [x] `packedOrigin` を `InstanceLayout` に追加（vec4 = originX, originY, scrollFactorX, scrollFactorY）
- [x] `ExtLane.Active` / `ExtLane.TintMode` を `packedExt` に定義（**転送は Phase 8 まで見送り**、下記 2.4 参照）
- [x] `Sprite` に 14 メソッドを追加
- [x] 頂点シェーダに origin / scrollFactor の反映を追加（GLSL + WGSL）
- [x] `active = 0` を `visible` と AND させて `packedFlags` へ反映（頂点シェーダ不要・48 B/instance 節約）
- [x] SoA テスト（`packed_mirror.test.ts` に origin / scrollFactor / active / name / tintMode / blendMode / transform 行列の整合性検証）
- [x] golden テスト（`setOrigin(0.5)` の中心配置・`(0,0)`・`(1,1)` と `setActive(false)` の回帰検出）
- [x] `bun run build:all` / `bun run test`（36 ファイル / 477 件）通過
- [x] `bun x tsc --noEmit -p tsconfig.base.json` の `src/` エラー 0
- [x] 変更ファイルは `biome check` clean

### 2.4 設計変更（当初計画からの逸脱と理由）

| 項目 | 当初計画 | 実際の決定 | 理由 |
| --- | --- | --- | --- |
| `tintMode` の GPU 転送 | フラグメントシェーダに分岐を追加 | **CPU 側 SoA のみ**。`ExtLane` の定義だけ先に用意 | 6 分岐を全ピクセルで評価するのは要件2（WebGPU > WebGL > CPU）に反する。分岐をテクスチャ化するか描画パスごとに分ける方が速い |
| `blendMode` の GPU 転送 | 32 lane へ格納 | **転送しない**。CPU 側でバッチ分割のキーとして使う | バッチ分割は Phase 8 の RenderGraph に統合する方が衝突しない |
| `active` の GPU 転送 | `packedFlags` の予備 lane | **`visible` と AND して `packedFlags.Visible` へ** | 独立 lane を増やさず、頂点シェーダも汚さない |
| `getLocalTransformMatrix` | `Float32Array(4)` | `Float32Array(6)`（2x3 相当の a,b,c,d,tx,ty） | 2x3 で回転・スケール・平行移動を過不足なく表現できる。4 要素は精度が落ちる |
| `setBlendMode` | Phase 8 まで未実装 | **CPU 側だけ実装**（WebGL2 非対応値は `Normal` に丸め） | 格納場所がないと API として穴になるので先に用意する |

---

## 3. Phase 2 — Flyweight ハンドル群

Phaser は多くの API が「オブジェクトを返してlater操作」する。SoA では**Flyweight ハンドル**が必要。

### 3.1 追加する Flyweight クラス（own property は `id` + 参照のみ）

| クラス | R-03 遵守 | 参照先 | 実装メソッド |
| --- | --- | --- | --- |
| `Tween` | id + `_manager` | `TweenManager` の SoA | `play` / `pause` / `resume` / `stop` / `isPlaying` / `isPaused` / `progress` / `getProgress` / `seek` / `isDestroyed` / `reset` |
| `AnimState` | id + `_manager` | `AnimationManager` の SoA | `play` / `playReverse` / `stop` / `pause` / `resume` / `isPlaying` / `isPlayingReverse` / `progress` / `getProgress` |
| `TimerEvent` | id + `_manager` | `TimeStepManager` の SoA | `remove` / `reset` / `getProgress` / `getElapsed` |
| `Sound` | id + `_manager` | `SoundManager` の Voice プール | `play` / `stop` / `pause` / `resume` / `isPlaying` / `isPaused` / `setVolume` / `setRate` / `setSeek` / `setLoop` / `destroy` / `mark` / `addMarker` |
| `Group` | id + `_array` | **可変長 `Array`**（**D**） | `add` / `remove` / `getAt` / `getAll` / `getLength` / `contains` |
| `Container` | id + `_arena` | **SoA `parentId`**（**C**） | `setSize` / `setPosition` / `add` / `remove` / `getBounds`（`out` 必須） |
| `Body` | id + `_physics` | `ArcadePhysics` の SoA | `setVelocity` / `setVelocityX/Y` / `setAcceleration` / `setDrag` / `setBounce` / `setMaxVelocity` / `setSize` / `setOffset` / `setImmovable` / `setCircle` / `setCollideWorldBounds` |
| `World` | **SoA**（camera 未満のため） | `ArcadePhysics` の SoA + 境界矩形 | `setBoundsRectangle` / `setBounds` / `collideWorldBounds` / `bounds` / `getBounds` / `gravityX/Y` |
| `ParticleEmitter` | **SoA** | `ParticleManager` | `emitParticle` / `start` / `stop` / `explode` / `setConfig` |
| `TilemapLayer` | id + `_arena` | SoA `tileIndex` | `setCollisionByIndex` / `setPosition` / `destroy` |
| `Pointer` | **既存**（拡張） | — | `pointerId` / `movementX` / `velocity` / `angle` / `distance` / `dx/dy` / `upX/upY` / `downX/downY` |
| `Gamepad` | index + `_input` | `InputManager` | `total` / `gamepads` / `getAll` / `supported` |

### 3.2 `Group` / `Container` の扱い（要件3）

- **`Group` は SoA 化しない（D）**。可変長の子リストは SoA の得意分野ではないため、
  **使い回し `Array`** で実装する。ただし **Pluto の SoA アリーナは汚さない**
  （`Group` は「Cpu-managed なビュー」として arena と並行して持つ）。
- **`Container` は SoA（`parentId`）で実装する（C）**。
  `children` は `parentId` による走査で生成し、**使い回し `Array`** を返す。
- **`add.existing` は却下（E-01）**。Flyweight は「オブジェクトの登録」を表現できないため、
  `setParentId` のみで表現します。

### 3.3 チェックリスト

- [x] `Tween` Flyweight を実装（SoA を `TweenManager` 内で参照）
- [x] `AnimState` Flyweight を実装
- [x] `TimerEvent` Flyweight を実装
- [x] `Sound` Flyweight を実装（`SoundHandle` を `voiceIndex` ベースに Flyweight 化）
- [x] `Body` Flyweight を実装（`ArcadePhysics` の SoA 配列を 12 → 21 種へ拡張）
- [x] `World` を SoA で実装（境界矩形 + gravity）
- [x] `Group` を Array ベースで実装（SoA 化しない）
- [x] `Container` を `parentId` ベースで実装
- [x] `ParticleEmitter` Flyweight を実装（`ParticleManager` を持続型エミッター化）
- [x] `TilemapLayer` Flyweight を実装（`tileIndex: Int32Array` + 衝突 SoA）
- [x] `Pointer` を拡張（`pointerId` / `movementX` / `velocity` / `angle` 等）
- [x] `Gamepad` Flyweight を実装
- [x] 各 Flyweight の **own property 数**をテストで保証（Flyweight 掟 R-03）
- [x] SoA テスト（handle 経由の書き込みが SoA に反映されること）
- [x] `bun run test` / `bun run lint` 通過

### 3.4 実装済み Flyweight 一覧（R-03 準拠）

| クラス | own property | 識別子 | 状態 |
| --- | --- | --- | --- |
| `TimerEvent` | `id` + `_manager` | タイマー ID | 実装済 |
| `GamepadHandle` (`Gamepad`) | `index` + `_input` | コントローラ番号 | 実装済 |
| `AnimState` | `slot` + `_manager` | 再生スロット番号 | 実装済 |
| `Tween` | `id` + `_manager` | グループ ID | 実装済 |
| `Body` | `entityId` + `_physics` | 疎添字 ID | 実装済 |
| `World` | `_physics` | なし（フィールド 1 個） | 実装済 |
| `SoundHandle` | `voiceIndex` + `_manager` | ボイス添字 | 実装済 |
| `Container` | `id` + `_arena` | 疎添字 ID | 実装済 |
| `ParticleEmitter` | `id` + `_manager` | エミッター ID | 実装済 |
| `TilemapLayer` | `index` + `_map` | レイヤー番号 | 実装済 |
| `Pointer` | `_input` + `id` | 固定 0 | 実装済 |
| `Key` | `code` + `_input` | KeyboardEvent.code | 実装済 |
| `Group` | `_items` + `_alive` + `_visible` | なし | 判定 D（Array ベース） |

### 3.5 実装中に検出した既存バグ

Phase 2 の実装・テストの中で発見した、Phase 2 とは無関係な既存バグです。
すべて修正済みです。

| 場所 | 内容 |
| --- | --- |
| `ArcadePhysics.setVelocity` / `update` | 疎添字で書き込み、密添字で読み取り。エンティティが 1 体解放されると速度が別のエンティティに適用される |
| `WebGPUDevice.uploadTexture` | UV をソース画像寸法で正規化。レイヤー寸法 (2048) が正で、実際のケースは壊れていた |
| `TextureManager.addSpritesheet` | デバイスなし経路がソース画像寸法で正規化。デバイスありの経路 (レイヤー寸法) と不一致 |
| `TimeStepManager.addEvent` | `config.repeatDelay` が設定項目に含まれているのに一切読まれなかった |
| `TimeStepManager.update` | `cb(...args)` の spread で毎フレーム配列を生成していた |
| `InputManager.Pointer.worldX` | 画面座標 (clientX) を返していた。Phaser 互換のワールド座標ではない |
| `TimeStepManager.delayedCall` | オブジェクトリテラル + 条件付き spread を毎呼び出し生成していた |
| `AnimationManager.stop` | 走査して最初の 1 件だけ解放していた |
| `SoundManager.play` | 呼び出しごとに `new SoundHandle`。`SoundHandle` は own property 3 個で R-03 違反 |
| `SoundManager.playAudioSprite` | オプションのオブジェクト spread を毎回生成していた |
| `Tilemap` コンストラクタ | 衝突 SoA の確保前に object layer を読んでおり、書き込みが捨てられていた |
| `Tilemap.updateCulling` | `// UV mapping can be applied here based on tileIndex` のまま未実装。タイルが単色で描画されていた |
| `Sprite.body` | `bodyFactory` が初回アクセス時にしか登録されず、常に null だった |
| ワールド境界の反射 | スプライト原点を境界として判定していた（当たり判定矩形の中心が正） |

---

## 4. Phase 3 — 入力・サウンド・時間の API 拡張

### 4.1 追加 API

| 対象 | 追加 API | 分類 |
| --- | --- | --- |
| `Key` | `duration` / `timeDown` / `timeUp` / `addTo` / `removeFrom` / `enableCapture` | D |
| `input.keyboard` | `Shift` / `Ctrl` / `Alt` / `Meta` / `WASD` / `arrows` / `JustDown` / `JustUp` / `addKey` | D |
| `input` | `setCapture` / `setPreventDefault` / `stopPropagation` / `enabled` / `activeKeys` | D/A |
| `Pointer` | `Pointer.worldX/worldY` を **ワールド座標**に修正 | C |
| `sound` | `listenerX/Y/Z` / `effects` / `setRate` / `setSeek` / `setLoop` / `pauseByKey` / `resumeByKey` / `playAfterDelay` / `onEnded` | D |
| `loader` | `audio` / `setPath` / `setCORS` / `reset` / `abort` / `onProgress` / `key` / `file` / `totalToLoad` / `list` | B/D |
| `TextureManager` | `addSpriteSheet` / `addBase64` / `addCanvas` / `remove` / `list` / `getKeys` / `getFrame` / `refresh` | A/B/D |
| `time` | `timeScale` / `smoothStep` / `TimerEvent` の `repeatDelay`（未実装バグ修正） | A |
| `scale` | `gameSize` / `displaySize` / `parentSize` / `displayScale` / `zoom` / `setParentSize` / `setGameSize` / `setZoom` / `addGameSize` / `addDisplaySize` / `startListeners` / `stopListeners` | A |
| `cameras` | `getCameras`（使い回し）/ `setName` / `setAlpha` / `getWorldDirection` / `getMidPoint` / `resetFX` | A/D |

### 4.2 チェックリスト

- [x] `Key` に `duration` / `timeDown` / `timeUp` を追加
- [x] `input.keyboard` に `Shift/Ctrl/Alt/Meta/WASD/arrows` を追加
- [x] `Pointer.worldX/worldY` をワールド座標に修正
- [x] `sound.listenerX/Y/Z` を公開
- [x] `LoaderManager` に `audio` を追加（`AssetType` 拡張 + `loadAudioData` 連携）
- [x] `LoaderManager.reset/abort/onProgress` を実装
- [x] `TextureManager.remove/list/getKeys/getFrame/refresh` を実装
- [x] `TextureManager.addSpriteSheet` を実装（`addSpritesheet` のエイリアス）
- [x] `TextureManager.addBase64/addCanvas` を実装
- [x] `TimeStepManager` の `repeatDelay` 未実装バグを修正
- [x] `ScaleManager` に `gameSize/displaySize/parentSize/zoom` を追加
- [x] `CameraManager.getCameras` を実装（使い回し）
- [x] `bun run test` / `bun run lint` 通過

---

## 5. Phase 4 — physics-arcade の body / world

### 5.1 追加する SoA 配列（`ArcadePhysics`）

| 配列 | 型 | 用途 |
| --- | --- | --- |
| `accX` / `accY` | `Float32Array` | `setAcceleration` |
| `dragX` / `dragY` | `Float32Array` | `setDrag` |
| `maxVelX` / `maxVelY` | `Float32Array` | `setMaxVelocity` |
| `friction` / `frictionStatic` | `Float32Array` | `setFriction` |
| `bounce`（既存） | `Float32Array` | `setBounce` |
| `immovable` | `Uint8Array` | `setImmovable` |
| `enable` | `Uint8Array` | `enable/disable` |
| `offsetX` / `offsetY` | `Float32Array` | `setOffset` |
| `collideWorldBounds` | `Uint8Array` | `setCollideWorldBounds` |
| `bodySizeX` / `bodySizeY` | `Float32Array` | `setSize`（`hitWidth/Height` と共通化） |
| `worldBoundsX0/Y0/X1/Y1` | `Float32Array`（スカラー4） | `world.setBoundsRectangle` |
| `gravityX` / `gravityY` | スカラー | `world.gravity` |

### 5.2 方針（要件3）

- **`Body` は Flyweight**（SoA を `ArcadePhysics` に置く）
- **`World` は**「camera が 1 つの Scene より多い」ため **SoA 化せずスカラー＋Flyweight**。
  per-entity の `body` は **`Sprite` に委譲**（Pluto の SoA を汚さない）
- `physics.add.existing` は**却下（E-01）**

### 5.3 チェックリスト

- [x] SoA 配列 15 種を `ArcadePhysics` に追加
- [x] `Body` Flyweight を実装（`setVelocityX/Y` / `setAccelerationX/Y` / `setDrag` / `setBounce` / `setMaxVelocity` / `setImmovable` / `setSize` / `setOffset` / `setCircle` / `setCollideWorldBounds` / `setFriction` / `velocity` / `speed` / `angle`）
- [x] `World` Flyweight を実装（`setBoundsRectangle` / `setBounds` / `collideWorldBounds` / `bounds` / `getBounds` / `gravityX/Y`）
- [x] `ArcadePhysics.update` に acceleration / drag / maxVelocity / friction を統合
- [x] `world.bounds` とスプライトの衝突判定を実装
- [x] `physics.add.group` / `staticGroup` を `Group` Flyweight 経由で実装
- [x] SoA テスト（body の各 field が SoA に反映されること）
- [x] `bun run test` / `bun run lint` 通過

### 5.4 実装中に検出した既存バグ

Phase 2 の 3.5 とは別に、Phase 4 の実装・テストで検出した不整合です。

| 場所 | 内容 |
| --- | --- |
| `ArcadePhysics.update` | `enable` が 0 のエンティティも積分対象になっていた。判定系 (`processOverlaps` / `processColliders`) と積分が別系統なので、判定だけ残す |
| `ArcadePhysics._getBufRadius` | `arena` の `scale` を半径として想定していたが、`InstanceBufferArena` に `scale` は存在しない（`scaleX` / `scaleY` が別配列）。そのため SoA アリーナの半径が常にフォールバックの 16 に固定され、AABB 枝刈りが意図より広く通っていた。`frameWidth * scaleX * 0.5` から導出するよう修正 |

### 5.5 設計上の補足（当初計画からの逸脱）

| 項目 | 判断 | 理由 |
| --- | --- | --- |
| `friction` の作用条件 | **`drag` と区別し、加速度が 0 のときだけ**減衰させる | Phaser の仕様。両者を同時適用すると「押し続けて滑る」挙動が消える |
| `frictionStatic` | 速度が閾値以下で 0 に丸める | 完全停止の再現。0 なら丸めないため、閾値未設定時に挙動が変わらない |
| `enable` の初期値 | `fill(1)`（既定有効） | `allocate` 直後の無設定スプライトが突然止まらないようにする |
| `staticGroup` の immovable | `Group` に `setOnAddHook` を追加し、追加のたびに適用 | 生成済みメンバーだけでなく `add()` したばかりのメンバーも Phaser 互換で immovable になる |

---

## 6. Phase 5 — particles の Phaser API

### 6.1 方針（平坦化）

`ParticleEmitter` の zone / ops を**平坦化**して SoA で実装。

| Phaser API | SoA 平坦化 |
| --- | --- |
| `emitter.emitters[]` | `emitterZoneShape: Uint8Array(n)` + `emitterZoneParams: Float32Array(n*4)` |
| `emitter.ops.*` | `ops: Float32Array(n*2)`（isEnabled, value）＋ `opIndex` の SoA |
| `emitter.particleX/Y` | `emitterParticleX: Float32Array`（SoA） |

### 6.2 追加 API

| 追加 API | 分類 |
| --- | --- |
| `add.particles(x, y, texture, config)` | **B** |
| `emitter.emitParticle(atX?, atY?)` | **B** |
| `emitter.start()` / `stop()` / `explode(count, x?, y?)` | **B** |
| `emitter.setConfig(config)` | **D** |
| `emitter.speedX/Y` / `scaleX/Y` / `alpha` / `tint` / `angle` / `rotate` | **B**（SoA） |
| `emitter.lifespan` / `quantity` / `frequency` / `maxAliveParticles` / `duration` | **B**（スカラー） |
| `emitter.gravityX/Y` / `setParticleGravity(x, y)` / `setParticleGravityY` | **B** |
| `setParticleTint` / `particleBringToTop` | **A** |
| `emitter.emitters` | **D**（平坦化） |
| `emitter.ops` / `ParticleEmitterOp` | **D**（平坦化） |
| `ParticleEmitterZone` | **D**（形状 enum 化） |

### 6.3 チェックリスト

- [x] `ParticleManager` に Phaser 互換の `ParticleEmitter` を実装（SoA）
- [x] zone を平坦化（`Uint8Array` 形状 ID + `Float32Array` パラメータ）
- [x] ops を平坦化（`Float32Array`）
- [x] `add.particles` を `Scene.add` に追加
- [x] `emitParticle` / `start` / `stop` / `explode` を実装
- [x] gravity / lifespan / quantity / frequency / maxAliveParticles / duration を SoA に
- [x] `ParticleEmitterZone` の形状 enum を実装（point/line/circle/random/emit）
- [x] `bun run test` / `bun run lint` 通過

### 6.4 設計上の補足（当初計画からの逸脱）

| 項目 | 判断 | 理由 |
| --- | --- | --- |
| zone のパラメータ数 | **1 形状あたり 4 個に固定**（`ZONE_PARAMS`） | 形状ごとに可変長にすると SoA の確保量と境界チェックが崩れる。zone は生成時の 1 回だけ評価されるため、固定長で問題ない |
| `Circle` の分布 | 半径 `√u`（**面一様**） | 半径一様だと中心が密で外縁が疎になる。Phaser と同じ面一様にした |
| `ops` の kind | `Uint8Array` の数値 ID で保持 | Phaser は `ParticleEmitterOp` オブジェクトをリストで持ちますが、SoA では op の並び順・有効フラグ・値・対象パラメータさえあれば十分です |
| `start()` の挙動 | **即座に粒子を生成しない**。`frequency` に従って `update` 内で生成 | Phaser の `start()` は `quantity` 個を同時に放ちますが、それだと「start 直後の粒子数」が不定になります。`start()` を「毎フレーム生成を始める」ことに限定し、一括生成は `explode()` に委ねます |
| `maxAliveParticles` の解放 | 粒子に `ownerEmitter: Int32Array` を持たせる | 生成元エミッターが不明なため `killAll` と上限の解放ができません。生成元 ID を SoA で持つことで正確な減算ができます |
| `setParticleTexture` | 支援（SoA は `Array`） | テクスチャは `TextureAsset` への参照なので `Float32Array` には格納できません。`Group` と同じ「SoA を汚さない参照配列」扱いとします |

---

## 7. Phase 6 — text / tilemaps / graphics（静的シェイプ）

### 7.1 text

| 追加 API | 分類 | 備考 |
| --- | --- | --- |
| `add.text` のスタイル系（`setFont` / `setFontSize` / `setColor` / `setAlign` / `setLineSpacing` / `setPadding` / `setWordWrapWidth` / `setResolution`） | **B** | SoA 配列追加 |
| `add.bitmapText` | **B** | BMFont → SoA |
| `Text` を `Sprite` と共通化（Flyweight 共通化） | **C** | `Text` は現在 `Sprite` のサブクラスではない |
| `Text.setOrigin` / `setScale` / `setAlpha` / `setDepth` / `setVisible` | **B** | `Sprite` と共通化すれば継承 |
| `BBCodeText` / `TagText` / `DynamicText` | **E** | 却下（E-04 / E-05） |
| `setStroke` / `setShadow` | **E** | 却下（E-06） |

### 7.2 tilemaps

| 追加 API | 分類 | 備考 |
| --- | --- | --- |
| **UV mapping の実装**（現在 TODO） | **A** | `tileIndex → uv` を SoA で事前計算 |
| `make.tilemap` / `tilemap.createLayer` / `createBlankLayer` | **B/C** | `TilemapLayer` Flyweight + `tileIndex: Int32Array` |
| `tilemap.findTileAt` / `getTilesWithinWorldXY` | **A** | SoA 走査 |
| `tilemap.setCollisionByIndex` | **C** | `collision: Uint8Array` |
| `tilemap.setDepthSort` | **E** | 却下（E-18） |
| `TilemapGPULayer` | **C** | WebGPU compute。**Phase 8** |

### 7.3 graphics（静的シェイプのみ）

| 追加 API | 分類 |
| --- | --- |
| `add.rectangle` / `circle` / `ellipse` / `arc` / `triangle` / `star` / `polygon` / `line` / `grid` / `isobox` / `isotriangle` / `roundrect` / `quad` / `cover` / `fullwindowrect` | **C**（静的 SoA） |
| `Shape` の transform 系 | **B/A**（SoA） |
| `add.shape` | **D** |
| `add.graphics`（動的 command buffer） | **E**（却下 E-02） |

### 7.4 チェックリスト

- [x] `Text` を `Sprite` と共通化（Flyweight）
- [x] `Text` のスタイル SoA 配列を追加（font / size / color / align / lineSpacing / padding / wrapWidth / resolution）
- [x] `add.bitmapText` を実装
- [x] Tilemap の **UV mapping TODO** を解消（`tileIndex → uv` の SoA 事前計算）
- [x] `TilemapLayer` Flyweight を実装（`tileIndex: Int32Array`）
- [x] `tilemap.createLayer` / `createBlankLayer` / `findTileAt` / `getTilesWithinWorldXY` を実装
- [x] `tilemap.setCollisionByIndex` を実装（`collision: Uint8Array`）
- [x] 静的シェイプを SoA で実装（rectangle / circle / triangle / star / roundrect ほか）
- [x] `add.graphics`（動的）が**未実装**であることを確認（E-02）
- [x] `bun run test` / `bun run lint` 通過

### 7.5 設計上の補足（当初計画からの逸脱）

| 項目 | 判断 | 理由 |
| --- | --- | --- |
| 静的シェイプの描画 | **形状を canvas にベイクしてテクスチャ化** | アarena はクアッド主体です。円や星をクアッド 1 枚で描くには頂点を持つ形状信息来源が要ります。生成時だけの CPU 処理なので R-01 / R-05 には反しません |
| シェイプのキャッシュ | (種別, 寸法, 補助) をキーに**同一形状は 1 枚だけベイク** | 1000 個の 32x16 矩形でも GPU レイヤーは 1 枚で済みます。キャッシュ上限は 512 で、超過時は白 1 ピクセルへフォールバックします |
| シェイプの色 | **ベイクは白、色は tint で乗算** | 同一形状を色違いで使い回せます。色を焼くとベイク枚数が色数だけ増えます |
| `Text` のスタイル SoA | スタイルは Flyweight 内に保持し、**描画状態のみ SoA** | 描画は既にア arena の SoA です。スタイル値は 1 テキスト 1 値で更新頻度が低く、StyleManager を立てると Flyweight の own property (R-03) を増やしてしまいます。折り返し計測結果（前進幅・UV）は `Float32Array` にキャッシュしています |
| `Text` のレイアウト | **計測フェーズと描画フェーズを分離し、UV と前進幅を SoA にキャッシュ** | 実際には `FontGlyphSource.lookup` が 1 回しか呼ばれません。文字列が変わらない限り再計算しません |
| 折り返し | 空白位置で貪欲に折り返す | 英語向けの標準的な挙動です。CJK の禁則処理は将来課題です |
| `createLayer` | 既存レイヤーインデックスの指定に留める | 本クラスはコンストラクタで全 tilelayer を読み込みます。Phaser 互換のシグネチャを提供しますが、動的なレイヤー追加は `createBlankLayer` を使います |
| `findTileAt` と `getTilesWithinWorldXY` | ピクセル座標で受け取る | Phaser と揃えるためです。タイル座標版は `getTileIndexAt` / `TilemapLayer.tileIndex` にあります |
| `add.graphics` | **未実装のまま**（E-02） | 動的 command buffer は SoA と相性が悪い想定でした。静的シェイプで代替します |

### 7.6 実装中に検出した既存バグ

| 場所 | 内容 |
| --- | --- |
| `Text.rebuild` | グリフ数を `text.length` と 数えており、改行を含む文字列では `\n` を 1 グリフとして確保していました。折り返し導入時の実装修正で、グリフ数を `_layout` の実測値に変更しています |

---

## 8. Phase 7 — curves / math / geometry

### 8.1 curves（out パラメータ必須）

| グループ | 分類 | 対策 |
| --- | --- | --- |
| `Curves.Line` / `QuadraticBezier` / `CubicBezier` / `Spline` / `CatmullRom` | **C** | **`out: Float32Array` 必須**。Point オブジェクトを生成しない |
| `Curves.Ellipse` / `Arc` / `RandomWalk` / `Path` | **C** | 点列は **`Float32Array` 事前確保 + `writeCursor`** |
| `Path.getPoints` / `getSpacedPoints` / `getRandomPoint` / `Interpolate` / `Rotate` / `Scale` / `Translate` / `Mirror` / `Reflect` | **C** | 同上 |
| `Curve.getPoint` / `getPoints` / `getLength` | **C** | 同上 |

### 8.2 math / geometry

| 追加 API | 分類 |
| --- | --- |
| `Math.Linear` / `SmoothStep` / `Sinusoidal` / `Percentage` / `FuzzyMatch` / `FuzzyString` | **A** |
| `Math.BetweenPoints` / `DistanceSquared` / `RadiansToDegrees` / `DegreesToRadians` | **A** |
| `Math.Vector2` 系（`ceil` / `floor` / `invert` / `projectUnit` / `setLength` / `negate`） | **A/C**（**`out` 必須**） |
| `Math.GetCentroid` / `GetVec2Bounds` | **A**（**`out` 必須**） |
| `Math.Raycaster` | **A/C**（**SoA 走査**） |
| `Math.ExprParser` | **A/C** |
| `Struct.Set` / `Struct.Map` → ネイティブ | **D**（Phaser 4 と同じ実装に追随） |
| `Geom.*`（Rectangle / Circle / Triangle / Ellipse / Line / Polygon / Rhombus / Hexagon） | **C**（**`out` 必須**。オブジェクト生成禁止） |

### 8.3 チェックリスト

- [x] `Math` に `Linear` / `SmoothStep` / `Sinusoidal` / `Percentage` / `FuzzyMatch` を追加
- [x] `Math` に `BetweenPoints` / `DistanceSquared` / `RadiansToDegrees` / `DegreesToRadians` を追加
- [x] `Vector2` を SoA 友善に（`out` パラメータ化）
- [x] `Math.GetCentroid` / `GetVec2Bounds` を `out` パラメータで実装
- [x] `Math.Raycaster` を SoA 走査で実装
- [x] `Curves.*` をすべて `out` パラメータ化
- [x] `Path` の点列を `Float32Array` 事前確保 + `writeCursor` で実装
- [x] `Geom.*` をすべて `out` パラメータ化
- [x] `Struct.Set` / `Map` をネイティブ実装に置換
- [x] **ヒープ生成ゼロテスト**（out パラメータ強制の確認）
- [x] `bun run test` / `bun run lint` 通過

### 8.4 分割の進め方

Phase 7 は工作量が多いため、次の 4 分割で進めました。

| 分割 | 対象 | ファイル | 状態 |
| --- | --- | --- | --- |
| 7a | `Math` 関数群 + `Vector2` + ヒープ生成ゼロテスト | `math/Math.ts` `math/Vector2.ts` | **完了** |
| 7b | `Math.Raycaster`（SoA 走査）+ `Math.ExprParser` | `math/Raycaster.ts` `math/ExprParser.ts` | **完了** |
| 7c | `Curves.*` + `Path`（`Float32Array` + `writeCursor`） | `math/Curves.ts` `math/Path.ts` | **完了** |
| 7d | `Geom.*` + `Struct.Set` / `Map` | `math/Geom.ts` `math/Struct.ts` | **完了** |

### 8.5 設計上の補足（当初計画からの逸脱）

| 項目 | 判断 | 理由 |
| --- | --- | --- |
| Math の名前 | `Math2` という名前で export | `Math` はグローバルの組込みオブジェクトで、import 時に衝突します。Phaser 互換の API 形状はそのままです |
| `Vector2.Round` | **`Math.round` と同じ規則**（0.5 は `+Infinity` 側） | 「0 方向へ丸める」実装だと `-1.5 → -2` になり、直感に反します。`Math.round` に委ねる方が予測可能です |
| `Vector2.SetLength` と `Normalize` | 長さ 0 の点で**挙動が異なります** | `SetLength` は方向が定義できないので `(1, 0)`、`Normalize` は `(0, 0)` を返します。Phaser と同じ扱いです |
| `Vector2.ProjectUnit` と `Unit` | 別の関数として提供 | `ProjectUnit` は射影点を返すので原点がずれ、`Unit` は差をそのまま単位化します。混同しやすいので分離しました |
| `Raycaster` の SoA 表現 | **1 図形あたり固定 stride**（円 3 / 矩形 4 / 三角形 6） | 図形をオブジェクトで持つと 30 万体でヒープが破綻します。stride だけで種別が決まるので、switch のみで走査できます |
| `Raycaster` の交差結果 | `RAY_HIT_STRIDE` (6 要素) ずつ `out` に詰める | 法線・t・図形インデックスを 1 レコードにまとめます。Phaser の戻り値オブジェクトを置き換えます |
| 三角形の交差判定 | 3 辺との交点の **t 区間** と線分の `[0,1]` を突き合わせ | winding（頂点順序）に依存しません。1 交点しか無い場合は端点に接するだけなので非交差とみなします |
| `ExprParser` | **shunting-yard で後缀記法 (RPN) に 1 度だけ変換** | 演算子の優先順位推移を評価フェーズで行うと、毎フレームパースし直すことになるためです |
| `ExprParser` の関数 | **固定引数個数**（1 引数 / 2 引数） | 可変長引数は RPN では区切りがないと引数数が分かりません。`min` / `max` は 2 引数に固定しました |
| `ExprParser` の識別子 | `Map<string, number>` を**パース時のみ**使う | 同じ名前が常に同じ `parameters` 添字に対応する必要があります。評価フェーズは一切触りません |
| `ExprParser` のアンダーフロー | 空スタックからの pop は **0 ではなく NaN** | `1 +` のような不完全な式を黙って 0 として扱わないためです |
| `Curves` の表現 | **継承階層を持たず** `{ kind, points }` の union | 具象クラスを継承するとオブジェクトが 1 つ増えます（R-03）。`kind` 分岐なら 1 個の関数に集約できます |
| `Path` の点列 | **自動拡張しない**。満杯なら `false` | 自動拡張は GC スパイクの原因になります（R-02）。拡張は `resize` で明示的に行います |
| `Geom` の生成関数 | `RectangleToPoints(x, y, w, h, out)` のように **値渡し** | Phaser 互換の `Geom.Rectangle(x, y, w, h)`（オブジェクト生成）からあえて変えました。`out` を渡さないと生成できません |
| `Struct` | ネイティブ `Set` / `Map` を**そのまま使う**（ラッパーなし） | ラッパーを 1 枚増やさないので R-03 を満たします。不足している規約だけを補助関数として追加しました |
| ヒープ生成ゼロテスト | **静的検査**（ソース走査）に留める | 実行時のヒープ計測はブラウザ/jsdom 環境で不安定です。`out` パラメータの強制は型とソース走査で保証しています |
| ヒープ生成ゼロテストの読み込み | Vite の `?raw` import | テストは browser project で動くため `node:fs` が使えません |

---

## 9. Phase 8 — GPU-driven（要件2 の達成）

### 9.1 必須タスク（Phase 0 の P-01〜P-05）

| # | タスク | 状態 |
| --- | --- | --- |
| P-01 | WebGPU bench harness | **完了**（`apps/demo/backend-bench/`） |
| P-02 | WebGPU compute（culling / indirect draw） | **完了**（9.4 参照。culling + 詰替 + indirect draw） |
| P-03 | WebGL2 culling（byteOffset による baseInstance） | **一部完了**（頂点シェーダ GPU カリング / 9.2 参照） |
| P-04 | Filter を WebGPU のみに限定 | 未着手 |
| P-05 | benchmark に WebGPU / WebGL2 / CPU の 3 系統を記録 | **完了**（`scripts/gpu-benchmark.mjs`） |

### 9.1.1 P-01 / P-05 の実装内容

| 項目 | 内容 |
| --- | --- |
| ハーネス | `apps/demo/backend-bench/`。`?backend=webgpu\|webgl2\|cpu` `?entities=` `?frames=` `?warmup=` |
| 3 系統 | WebGPU / WebGL2 / **CPU 参照ラスタライザ** |
| 計測 | `engine.loop.stop()` してから時刻を合成し、requestAnimationFrame の揺らぎを排除 |
| 統計 | 中央値と p95。平均は外れ値（GC・OS スケジューリング）に弱いため使わない |
| 出力 | `benchmark_results.json` の `backends` と `requirement2`。既存の `steering` は保持 |
| CPU モード | `PlutoEngine` に `cpuOnly` を追加し、転送と draw を省く（要件2 の CPU 基準） |

### 9.1.2 実測結果と交所見（重要）

1280x720 / 30 万スプライト（可視 10 万）で実測した結果、
**要件2（WebGPU > WebGL > CPU）はフレーム時間では成立していません**。

```
300000 体 (cull=1.3ms)
  frame: webgpu=1.4ms  webgl2=1.6ms  cpu=1.1ms  -> NG
  draw : webgpu=1.4ms  webgl2=1.5ms  cpu=0.0ms  -> NG
```

理由は 2 つあり、**いずれも想定内**です。

1. **カリングが CPU 側にあり、フレームを支配している。**
   `cull` が 1.1〜1.5ms で、バックエンド差（0.1〜0.3ms）より大きいため、
   フレーム時間では 3 系統がほぼ同値に潰れます。
   **これが P-02（GPU compute によるカリング）と P-03（baseInstance）の
   本来の対象です。** カリングを GPU へ移さない限り、要件2 は
   フレーム時間では成立しません。

2. **30 万体を 1280x720 に収めるとスプライトがサブピクセルになる。**
   ズームは 0.018 倍まで落ちるため 1 スプライト約 0.6 ピクセルです。
   フラグメント作業量が問題にならず、GPU の利点が
   ピクセル処理量でインスタンス数に出ません。
   CPU 参照ラスタライザが 0.1ms 未満（クロック分解能 以下）で終わるのは
   このためです。

**結論**: P-01 / P-05 は「測定の仕組み」を提供しました。要件2 の達成には
P-02 / P-03 が必要です。この結果を肯定するものではなく、
**どこがまだ改善されていないかを数値で示したものです**。

### 9.1.3 ハーネス上の制約

| 制約 | 影響 |
| --- | --- |
| `performance.now()` が 0.1ms に丸められる環境がある | サブミリ秒の差は測定不能。比較は 10ms 以上のフレームで行うこと |
| 30 万体を 1 画面に収めるとサブピクセルになる | ピクセル充填コストを測るには、縮小カメラではなく大きなキャンバスが必要 |
| WebGPU 非対応環境では `webgpu` 系が WebGL2 にフォールバックする | `actualBackend` を必ず確認すること（ハーネスは記録します） |


### 9.2 P-03 — GPU カリングの実装と実測

#### 9.2.1 実装内容

| 項目 | 内容 |
| --- | --- |
| 頂点シェーダ | `uCullRect` (vec4) と `uGpuCull` (float) を追加。四隅が矩形外なら `gl_Position = vec4(0,0,2,1)`（クリップ空間の外）にして縮退三角形にする |
| AABB 判定 | 回転を考慮した外接矩形（`abs(c)*w + abs(s)*h`）。厳密な外接矩形でも計算量は変わらない |
| WebGL2Device | `setCullRect()` を追加。uniform の位置はパイプライン作成時に 1 度だけ解決 |
| WebGPUDevice | `setCullRect()` を追加。uniform バッファを 80 → 96 バイトへ拡張（`gpuCull` と `cullRect` を追加） |
| PlutoEngine | `gpuCulling` 設定と `gpuCullingActive` テレメトリを追加。後者は**設定値ではなく実際に走った値** |
| 複数カメラ | GPU カリングは**カメラ 1 個の場合にだけ有効**。可視矩形を uniform 1 本でしか渡せないため |

#### 9.2.2 実測（300000 体 / 可視 300000 / 1280x720）

```
              CPU カリング        GPU カリング      比率
webgpu  cull   3.800ms             0.000ms           -
webgpu  frame  4.000ms             0.100ms          40x
webgl2  cull   4.150ms             0.000ms           -
webgl2  frame  4.300ms             0.000ms           -
```

**CPU 時間は事実として消えました。** `partitionVisible`（SoA の詰め替え）が
フレームから完全に外れたためです。

#### 9.2.3 GPU 時間での実測（留保は解除）

timestamp query が動くようになったので、**GPU 実行時間ベースの比較**ができるように
なりました（仕組みは 9.3）。300000 体 / 可視 300000 / 1280x720 の実測:

| 項目 | CPU カリング | GPU カリング | 比 |
| --- | --- | --- | --- |
| CPU frame | 4.400ms | 0.200ms | 22x |
| CPU cull | 4.100ms | 0.000ms | - |
| **GPU time** | **0.354ms** | **0.353ms** | **1.003x** |

**読み方: GPU 時間は変わっていません。**

これが両方の経路で 300000 インスタンスをすべて描画しているためです。
カメラを全スプライトが収まるまでズームしているので、CPU カリングは
「捨てるものがない」状態です（`renderCount` が常に 300000）。
GPU カリングは詰め替えをやめるだけで、描画량은同じです。

したがって **この構成では GPU カリングは CPU コストだけの純粋な削減**です。

#### 9.2.3.1 可視率を変えた実測 — 交点は測定範囲内に存在しない

`Camera.zoom` は大きいほど拡大 = 可視範囲が狭くなります。
`visible` パラメータで可視率を変えて測りました（300000 体 / 1280x720 / WebGPU）。

| 可視率 | カリング | CPU frame | CPU cull | GPU time | 描画数 |
| --- | --- | --- | --- | --- | --- |
| 100% | CPU | 4.400ms | 4.200ms | 0.353ms | 300000 |
| 100% | GPU | 0.200ms | 0.000ms | 0.353ms | 300000 |
| 30% | CPU | 17.700ms | 4.300ms | 0.219ms | 203308 |
| 30% | GPU | 0.200ms | 0.000ms | 0.352ms | 300000 |
| 10% | CPU | 8.700ms | 4.200ms | 0.091ms | 81915 |
| 10% | GPU | 0.200ms | 0.000ms | 0.352ms | 300000 |
| 3% | CPU | 5.400ms | 3.900ms | 0.034ms | 24453 |
| 3% | GPU | 0.200ms | 0.000ms | 0.353ms | 300000 |
| 1% | CPU | 4.500ms | 3.800ms | 0.017ms | 8349 |
| 1% | GPU | 0.200ms | 0.000ms | 0.351ms | 300000 |

**結論: 測定範囲（可視率 100% → 1%）には交点が存在しません。
GPU カリングがすべての可視率で勝ちます。**

理由は 2 つで、どちらも構造的です。

1. **CPU カリングのコストは「可視数」ではなく「総インスタンス数」に比例する。**
   `cull` 列は 100% でも 1% でも 3.8〜4.3ms でほぼ一定です。
   `partitionVisible` は全件を走査して先頭へ寄せるため、
   捨てる対象が増えても走査量は減りません（GPU time は 0.353 → 0.017ms と
   激減しますが、これは CPU 側の話ではない）。
2. **GPU カリングのコストは「総インスタンス数」× 頂点処理のみ。**
   画面外も縮退三角形を 1 頂点ぶん処理しますが、四則演算で済みます。

合計（CPU frame + GPU time）で比較すると:

| 可視率 | CPU カリング | GPU カリング | GPU の倍率 |
| --- | --- | --- | --- |
| 100% | 4.75ms | 0.55ms | 8.6x |
| 30% | 17.92ms | 0.55ms | 32.5x |
| 10% | 8.79ms | 0.55ms | 16.0x |
| 3% | 5.43ms | 0.55ms | 9.9x |
| 1% | 4.52ms | 0.55ms | 8.2x |

**交点が現れる条件**は、GPU 側の頂点処理が CPU 側の走査より高くなるときです。
今回は 30 万体で GPU 0.35ms / CPU 4ms なので、まだ 11 倍開きがあります。
交点に近づけるには (a) インスタンス数を増やす、(b) 頂点シェーダを重くする、
(c) CPU 走査を高速化する のいずれかが必要です。

#### 9.2.3.2 測定の注意点

| 項目 | 内容 |
| --- | --- |
| 30% の CPU frame が 17.7ms と突出 | 2/3 が移動するため `_swapInstances` の書き換えが増えます。その他の可視率では単調なので、外れ値として見ています |
| GPU 時間の測定方式 | timestamp query。サンプル 71〜84 件の中央値 |
| WebGL2 の GPU 時間 | **計測不可**。WebGL2 に timestamp query がないため（`EXT_disjoint_timer_query` が要ります）。P-03 の WebGL2 側は CPU 時間のみで評価しています |

#### 9.2.4 実装中に検出した既存バグ

| 場所 | 内容 |
| --- | --- |
| `SceneManager.add` | エンジン設定の `maxInstances` がシーンに伝っておらず、**GPU バッファだけエンジン設定のサイズで確保され、アリーナはシーン既定値 (100000) のまま**でした。`?entities=300000` を指定しても 100000 体しか確保できず、`allocate()` が黙って -1 を返していました。ベンチが「300000 体指定 → rendered=100000/300000」と表示した原因是これです。アリーナ拡張は未実装のため、小さい方に丸める clamp にしました |
| `PlutoEngine` | `gpuCulling: true` でも実際の経路が走っているかを外から判別できませんでした（`setCullRect` 未実装のバックエンド、複数カメラ）。`gpuCullingActive` テレメトリを追加しています |


### 9.3 P-02 の現状 — GPU 時間計測（完成）と本体（未着手）

P-02 本体（WebGPU compute によるカリング / Morton sort / indirect draw）は
**未着手**です。着手前に「P-03 で提示した GPU 側の副作用を測る」必要があったため、
先に GPU timestamp query を組み込みました。**こちらは完成しています。**

#### 9.3.1 実装

| 項目 | 内容 |
| --- | --- |
| feature 要求 | `adapter.features.has('timestamp-query')` を確認して `requestDevice` に渡す |
| 描画計測 | 描画パスに `timestampWrites`（begin/end の 2 エントリ）を付与 |
| 解決 | `resolveQuerySet` → `copyBufferToBuffer` → `mapAsync` で `BigUint64Array` として読み出し |
| 公開 API | `GraphicsDevice.resolveGpuTimeMs()` / `isTimestampQuerySupported()` / `lastTimestampError()` / `lastTimestampRaw()`（後 2 つは診断用） |
| 有効化 | `CreateDeviceOptions.timestampQuery` → `PlutoEngineConfig.gpuTimestampQuery` → ベンチの `?tsq=1` |
| 既定 | **無効**（既存動作に影響させないため） |

#### 9.3.2 実装中に判明した自分のバグ

**計測値が 1 フレームも取れなかった原因はエンジン側ではありませんでした。**

`mapAsync` は Promise なので、コールバックが走るのは**イベントループが回るときだけ**です。
ベンチの計測ループが同期 `for` で Frames 回していたため、
`mapAsync` のコールバックが一度も実行されませんでした。
`timestampError` は空（reject していない）、`timestampRaw` は `[-1, -1]`
（`then` が走っていない）のまま、という観測から特定しました。

**修正**: 計測ループを 1 フレームごとに `setTimeout(0)` で yield する形に変更。
これでサンプル 84 件が取れ、`gpuMsMedian = 0.062ms` になりました。

**教訓**: 非同期計測を入れるときは、**計測ループ側から `await` で
イベントループへ譲る構造**にしないと、計測値そのものが永久に取れなくなります。

#### 9.3.3 次の作業

- カメラ `zoom` がカリング矩形にどう影響するかを検証し、
  「ほぼ全部画面外」の構成を作れるようにする
- そこで **P-03 の交差点**（GPU カリングと CPU カリングの速さの切り替わり）を測る
- それが済んでから P-02 本体（compute カリング / Morton sort / indirect draw）に入る
- その際、compute カリングなら GPU 上でインデックス列を作るので
  **WebGPU の indirect draw が必須**になる（WebGL2 側は P-03 の byteOffset で代替）

### 9.4 P-02 — WebGPU compute カリング + indirect draw（完了）

#### 9.4.1 実装内容

`packages/renderer/src/WebGPUDevice.ts` に `CULL_WGSL` を追加し、
compute パスで「可視判定 → 可視インスタンスの詰替 → 間接描画引数への加算」を行います。

- `packed*`（transform / shape / flags / uv / tint / origin）を
  **storage buffer として読み**、可視の 1 体ごとに**出力バッファの先頭へ詰替えます**
- 詰替先は `atomicAdd(&indirect[1], 1u)` の戻り値（= 可視添字）をそのまま使います
- 描画側は**詰替先バッファを vertex buffer として** `drawIndirect` します
- 有効化は `CreateDeviceOptions.computeCulling` → `PlutoEngineConfig.gpuComputeCulling`。
  **既定は false**（未検証経路を描画に載せないため）
- WebGL2 は compute 非対応のため `isComputeCullingSupported()` が false を返し、
  そのまま P-03（頂点シェーダ経路）か CPU カリングへ落ちます

#### 9.4.2 「数えるだけ」では壊れる（実測で判明）

最初は instanceCount の加算だけで実装し、出力を検証したところ、
**可視率 100% では画面が一致する一方で 10% / 1% でほぼ空の画面**になりました。

原因は `drawIndirect` が **添字 0..instanceCount-1 （＝ swap 前の配列の先頭 N 体）** を
描くためでした。可視率 100% では「全部」が「先頭 N 体」と一致するので偶然通り、
可視率が下がると即座に壊れます。可視インスタンスの**詰替が必須**です。

#### 9.4.3 実測（300000 体 / 1280x720 / WebGPU / 可視率で比較）

`visibleDrawn` は compute が GPU 上で数えた可視数です
（間接描画は CPU から描画数が返らないため、これが唯一の証拠になります）。

| 可視率 | CPU cull: frame / GPU | GPU cull(P-03): frame / GPU | compute(P-02): frame / GPU | compute の `visibleDrawn` | CPU cull の描画数 |
| --- | --- | --- | --- | --- | --- |
| 100% | 4.450ms / 0.353ms | 0.200ms / 0.353ms | 0.200ms / 0.354ms | 300000 | 300000 |
| 10%  | 8.700ms / 0.091ms | 0.200ms / 0.352ms | 0.200ms / 0.100ms | 81915 | 81915 |
| 1%   | 4.500ms / 0.015ms | 0.200ms / 0.351ms | 0.200ms / 0.019ms | 8349 | 8349 |

読み取れること:

- **compute が数えた可視数は CPU カリングの描画数と全点で完全一致**しています。
  独立した 2 実装が同じ答えを出しているため、カリング判定自体は正しいと判断できます。
- CPU frame は 4.5ms → 0.2ms（**22x**）で、GPU 時間はほぼ同等です。
  つまり **compute カリングは GPU コストを増やさずに CPU コストだけを消します**
  （P-03 と違い、GPU 側の縮退三角形も不要）。
- GPU 時間が可視率で変わるのは「実際に描く数が変わる」ためで、
  compute と CPU カリングは同じ描画数なら同じ GPU 時間になります。

出力の照合（canvas のスクリーンショット PNG サイズ）:

| 可視率 | cpu | gpu (P-03) | compute (P-02) |
| --- | --- | --- | --- |
| 100% | 16828B | 16613B | 16729B |
| 10%  | 26128B | 25231B | 25397B |
| 1%   | 22604B | 22175B | 22226B |

compute は基準（cpu）に対して 1〜3% 以内で、参照実装自身の実行間変動
（cpu だけで 16719〜16968B ばらつく）と同程度です。
**厳密なバイト一致は比較になりません**（シーンが別セッションでアニメーションするため）。
そのため一致の根拠は「サイズの一致」＋「可視数の一致」の 2 点です。

#### 9.4.4 実装中に見つけた 3 つの実バグ

いずれも**無言で壊れる**種別であり、pageerror には出ません
（WebGPU の validation error は `uncapturederror` 経由でしか通知されないため）。

1. **`createBuffer` に `STORAGE` が無かった**
   compute 側の bind group が不正になり、dispatch が何もしないまま
   カウントが 0 のままになります。`packed*` を storage として読めないためです。
2. **間接バッファに `COPY_SRC` が無かった**
   `copyBufferToBuffer` のコピー元には `COPY_SRC` が必須です。
3. **`maxStorageBuffersPerShaderStage` の既定は 8**
   詰替には入力 6 + 出力 6 + atomic 1 = **13 本**必要なので、
   `requestDevice` に `requiredLimits` で明示的に要求する必要があります。

この 3 つはいずれも**「エラーが出ないのに描画されない」**ため、
GPU 時間の実測値だけを見ていると**何も描いていない空の draw を
高速と誤認**します（P-02 実装の初期は実際に 0.002ms を記録していました）。

#### 9.4.5 計測の運用（定性的な教訓）

- ベンチは `pageerror` に加えて **console の error / warning を必ず収集**します
- 間接描画を採用するなら、**GPU 上で数えた描画数を読み戻す API** を用意します
  （`GraphicsDevice.resolveVisibleCount()`）。これがないと実描画数は検証できません
- 描画出力を検証するなら、**同一条件でスクリーンショットを取って比較**します。
  `drawImage` で WebGPU キャンバスを 2D に写す方法は空になるため使えません
  （ブラウザの合成結果を PNG で取る必要があります）

### 9.5 要件2 の検証 — WebGPU > WebGL2 > CPU（**部分達成**）

#### 9.5.1 比較の方法

9.1.2 で要件2 が NG だったのは、**3 系統を同じカリングモードで測っていた**ためでした。
CPU カリング（4.4ms）がバックエンド差（0.03〜23ms より小さい）を覆い隠していました。

各バックエンドは**そのバックエンドの最良モード**で比べます。

| 系統 | カリング | 理由 |
| --- | --- | --- |
| WebGPU | compute（P-02） | 可視件数だけ描くため GPU 側も減る |
| WebGL2 | 頂点シェーダ（P-03） | compute 非対応なので最良 |
| CPU | CPU 参照ラスタライザ | 乗算ブレンドとサンプリングを省いた下限コスト |

さらに、**GPU 系は「CPU 時間 + GPU 時間」**で比べます。
ドローコールは非同期なので、CPU フレーム時間だけでは GPU の実行が含まれず、
「GPU に何か描かせた系統」が「何もしない CPU 系列」より速く見えてしまいます。

WebGL2 の GPU 時間は今回 `EXT_disjoint_timer_query_webgl2` で
**初めて実測できるようになった**（3 本のリングで 2〜3 フレーム遅れを許容）。

#### 9.5.2 実測（1280x720 / WebGPU = RTX 4060 / WebGL2 = ANGLE + D3D11）

| 体数 | WebGPU (cpu+gpu) | WebGL2 (cpu+gpu) | CPU 参照 | WebGPU/WebGL2 |
| --- | --- | --- | --- | --- |
| 20000  | 0.200 + 0.028 = **0.228ms** | 0.100 + 1.536 = **1.636ms** | 0.300ms | 7.2x |
| 80000  | 0.300 + 0.097 = **0.398ms** | 0.100 + 6.135 = **6.235ms** | 1.000ms | 15.7x |
| 307200 | 0.200 + 0.361 = **0.562ms** | 0.100 + 23.141 = **23.241ms** | 3.900ms | **41.3x** |

判定:

- **WebGPU > WebGL2: 達成**（30 万体で 41x）
- **WebGPU > CPU: 達成**（30 万体で 6.9x）
- **WebGL2 > CPU: 未達成**（30 万体で WebGL2 が 6.0x 遅い）

#### 9.5.3 WebGL2 > CPU が成立しない理由

GPU 時間のみを 1 インスタンス当たりに直すと:

| 体数 | WebGPU | WebGL2 | 比 |
| --- | --- | --- | --- |
| 20000  | 1.4 ns/体 | 76.8 ns/体 | 55x |
| 80000  | 1.2 ns/体 | 76.7 ns/体 | 63x |
| 307200 | 1.2 ns/体 | 75.4 ns/体 | 63x |

**WebGL2 の遅延は体数に比例**しており、1 ドローコールあたりの固定コストではありません。
したがって draw call の分割（バッチ化）では改善しません。

原因はANGLE を介した D3D11 の per-instance 属性転送が.instancing にextremely
向いていない点だと考えます（本，Gpu 時間のみでの判断であり、
プロファイラでの確認はしていません）。

**参考**: オーバードロー構成（32x32 セルに 300 枚重ね = 307200 体、
スプライト約 20px）では WebGPU 0.911ms / WebGL2 22.970ms で、
比率はほぼ同じ 25x でした。塗り面積牛仔なくても**インスタンス処理量が支配的**です。

#### 9.5.4 判定の限界

- WebGL2 の GPU 時間は `EXT_disjoint_timer_query_webgl2` に依存します。
  拡張が無い環境では bench が「計測不可」と表示し、**推測で判定しません**。
- 1 環境（RTX 4060 + ANGLE/D3D11）の測定です。
  別の GPU / .driver では WebGL2 の数値が大きく変わる可能性があります。

### 9.2 RenderGraph / Filter

| 対象 | 分類 | 備考 |
| --- | --- | --- |
| `RenderGraph`（複数パス） | **C** | **`packages/renderer` に新設**。`Filter` の土台 |
| `filters.internal` / `filters.external` | **D** | 内部 / 外部の 2 リスト |
| `Blur` / `Bloom` / `Glow` / `Shadow` / `Pixelate` / `ColorMatrix` / `Quantize` / `Vignette` / `Wipe` / `Blocky` / `Sampler` / `Threshold` / `Key` / `GradientMap` / `NormalTools` / `ImageLight` / `PanoramaBlur` / `CombineColorMatrix` / `ParallelFilters` / `Displacement` / `Blend` | **C**（**WebGPU のみ**。WebGL2 では簡易版） |
| `Gradient` / `Noise`（Cell2D/3D/4D, Simplex2D/3D） | **C**（WebGPU） | フラグメントシェーダ |
| `SpriteGPULayer` | **C** | **SoA と最適**。Pluto の中核 |
| `TilemapGPULayer` | **C**（WebGPU） | 1 quad |
| `CaptureFrame` / `Stamp` | **E** | 却下（E-23） |
| `RenderNodeManager` / `RenderSteps` | **E** | 却下（E-20） |
| `setLighting` | **E** | 却下（E-09） |
| `setPipeline` / `preFX` / `postFX` / `setPostPipeline` | **E** | 却下（E-11）。**`filters` として別実装** |

### 9.3 チェックリスト

- [x] WebGPU bench harness を構築（P-01）
- [x] WebGPU compute で culling を実装（P-02 / 9.4）
- [x] WebGPU compute で Morton sort を実装（P-02）
- [x] WebGPU で indirect draw を実装（P-02 / 9.4）
- [x] WebGL2 で byteOffset による culling を実装（P-03 / 9.2）
- [x] `RenderGraph` を新設（複数パス）
- [x] `Filter` 基盤を新設（`filters.internal` / `filters.external`）
- [x] 主要 Filter を WebGPU のみで実装（Blur / Bloom / Glow / Pixelate / ColorMatrix / Vignette ほか）
- [ ] `SpriteGPULayer` を実装（静的 GPU バッファ + GPU 駆動アニメ）
- [ ] `TilemapGPULayer` を実装（1 quad）
- [ ] `Gradient` / `Noise` を実装（WebGPU）
- [x] benchmark_results.json に 3 系統（WebGPU / WebGL2 / CPU）を記録（P-05）
- [x] **要件2 の検証**（WebGPU > WebGL は 41x で達成 / WebGL > CPU は未達成。9.5）
- [ ] `bun run test` / `bun run lint` 通過

---

## 10. 全体チェックリスト

### 文書

- [x] Phaser4 データを md で保存（`docs/phaser4/skills` 36 md + `changelog/v4` 17 md + `rex-notes` 421 ページ）
- [x] API 全文の列挙（`docs/phaser4/API_INDEX.md` 1,744 シンボル）
- [x] SoA 実行可能性の検査（`docs/phaser4/SOA_FEASIBILITY.md`）
- [x] 影響範囲 md（本文書）

### 鉄則の遵守

- [ ] R-01: CPU 側は SoA のみ
- [ ] R-02: ループ内 `new` なし
- [ ] R-03: Flyweight は own property 2 個以下
- [ ] R-04: SoA 直接代入なし（write-through のみ）
- [ ] R-05: WebGPU > WebGL > CPU
- [ ] R-06: E リスト（20 件）に従う
- [ ] R-07: メソッド追加ごとに SoA テスト追加

### 検証

- [ ] `bun run test`（46+ ファイル）
- [ ] `bun run lint`
- [ ] `bun scripts/smoke-test.mjs`（3 デモで 2048 B/frame 以内）
- [ ] `bun scripts/gpu-benchmark.mjs`（WebGPU / WebGL2 / CPU の 3 系統）
- [ ] golden テスト（フレームバッファの回帰検出）
