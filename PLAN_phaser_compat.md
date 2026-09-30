# 実装プラン（最終版）

## 前提の確定

| 項目 | 値 |
|---|---|
| ブランチ | `opencode`（`f04ac82`） |
| GL 属性上限 | **16**（実測 `gl_MaxVertexAttribs` = 16） |
| 現在 / 未使用 | 15 属性、うち `layerDepth` (loc 7) が頂点シェーダで未使用 |
| `setFlipY` | 保留 |
| `active` / `setActive` | 実装しない |
| イージング | テーブル実装 OK |
| `this.sound` | 既存 `SoundManager` を改良して `Scene` に接続 |
| 複数カメラ | 単一パスに近い形で対応（高速が最優先） |
| 深度ソート / UI / Group / Container | 対象外 |

---

## STEP 0: 属性枠の整理（FPS 低下防止の最前提）

1. `layerDepth` (location 7) は頂点シェーダで未使用。`depth` の GPU 転送と属性バインドを削除し、枠を 1 個空ける
2. `isText` に dirty flag を追加。`arena.textDirty` が false のフレームは転送を省略

これにより 15 → 14 属性となり、追加枠が 2 個になります。すべての後続 STEP の前提です。

---

## STEP 1: SoA 相乗り（属性追加ゼロ）

### 1-A. `alpha` / `clearAlpha` / `setTintFill`

`setTint` は tint を `0xAABBGGRR` として pack しており、最上位の A バイトが未使用です。新規フィールド不要:

```
get alpha()  → (tint[i] >>> 24) & 0xff  を 0-1 に
setAlpha(a)  → 最上位バイトのみ書換 + dirtyTint
clearAlpha() → A = 0xff
```

副次効果として、`TweenProperty.ALPHA` が現状 no-op（未実装）ですが、この経路で同時に解決します。

### 1-B. `texture` / `frame` / `isCropped`（読み取り専用）

`assetRef` の既存 `frames: TextureFrame[]` を参照するだけで提供。SoA 追加ゼロ。

### 1-C. Transform 系（すべて既存 SoA への直書き）

`setPosition` / `setX` / `setY` / `setScale` / `setRotation(度→ラジアン)` / `setAngle` / `setFlipX`（既存 `facing`）/ `getBounds` 9 種 / `setSize` / `setDisplaySize` はすべて SoA 追加ゼロ・属性追加ゼロです。

`setVisible` / `visible` のみ STEP 0 で空けた location 7 を使用します（属性 1 個、`Uint8Array` 1 本）。

---

## STEP 2: カメラ（`this.cameras`）

現状 `Camera` は 1 個のみです。単一パスに近い形で複数カメラを対応させます。

### 方針: カメラごとのドローコール（SoA 転送は 1 回のみ）

- 全スプライトは 1 つの SoA アリーナに 1 回だけ転送します（既存そのまま）
- カメラごとに `setupInstancedAttributes`（バッファは同一オブジェクトを再利用）と `drawInstanced` のみ発行します
- カメラ数は `CameraManager` が固定長配列で保持します
- `clear` はカメラ 1 台目の前だけ 1 回です

カメラ 2 台なら `drawArraysInstanced` が 2 回、属性再バインドが 2 回になるだけです。SoA 転送は 1 回のみなので、FPS への影響はドローコール分割分に限られます。

`cameras.main` / `cameras.add(x, y)` / `cameras.getCamera(name)` を実装します。

### Camera の Phaser 互換 API

`setScroll` / `scrollX` / `scrollY` / `setZoom` / `centerX` / `centerY` / `centerOn` / `setRotation` / `getWorldPoint` / `setBackgroundColor` / `ignore` は、既存フィールドと uniform のみで実装します。`renderList` は保留です。

`startFollow` / `stopFollow` / `fadeIn` / `fadeOut` / `pan` / `zoomTo` / `flash` は、カメラ数が少ないため固定長 `Float32Array(8)` の effect キューでゼロアロケーションを維持します。

---

## STEP 3: Scene システム（Phaser 互換ファサード）

| Phaser | 現状 | 方針 |
|---|---|---|
| `this.cameras` | `camera`（単一） | STEP 2 で `CameraManager` 化。`camera` は `cameras.main` の別名として残す |
| `this.input` | `InputManager` | そのまま公開。`input.keyboard` / `.pointer` / `.gamepad` のネストファサードを追加 |
| `this.scale` | `ScaleManager` | 公開済み。`displaySize` / `gameSize` の getter を追加 |
| `this.time` | `TimeStepManager` | 公開済み |
| `this.tweens` | `TweenManager` | STEP 4 でファサードを追加 |
| `this.anims` | `AnimationManager` | 別名あり。`play` / `stop` / `exists` を追加 |
| `this.textures` | `TextureManager` | `get` / `exists` / `addSpriteSheet` を追加 |
| `this.registry` / `this.events` | 実装済み | 変更なし |
| `this.add` | `GameObjectFactory` | `image` を `sprite` の別名として追加 |
| `this.game` | `PlutoEngine` | `canvas` / `config` / `destroy` の getter を追加 |
| `this.scene` | `SceneManager` | `start` / `stop` / `restart` / `pause` / `resume` / `isActive` / `get` を追加 |
| `this.sound` | 未接続 | STEP 5 で接続 |

### `this.input` の追加機能

現状は `isKeyDown(code: string)` のような文字列ベースの同期クエリのみで、Phaser の `addKey` / `addKeys` / `createCursorKeys` / `addPointer` がありません。これらは `Key` ハンドルを返すため、SoA 外の軽量ハンドルとして実装します。キーの集合は既存の `Set<string>` のまま、キーごとに `Key` ハンドルを 1 個だけ生成して `Map` で保持します。

---

## STEP 4: Tween ファサード + イージング

`TweenManager` の SoA を維持したまま、Phaser 風呼び出しを上に被せます:

```typescript
this.tweens.add({ targets: sprite, x: 100, duration: 500, ease: 'Cubic.easeOut' });
```

- `props` の各キーを `TweenProperty` enum へマップし、既存 SoA へ 1 スロットずつ展開します
- `ease` は初期化時に量子化した `Float32Array` テーブル（約 30 種 × 64 サンプル）を使い、毎フレームは添字参照のみで new ゼロです
- `TweenProperty.ALPHA` の no-op を STEP 1-A の経路で解決します
- `yoyo` / `repeat` / `delay` / `onComplete` / `onUpdate` に対応します

---

## STEP 5: 音声（既存 `SoundManager` の改良）

`packages/audio/src/SoundManager.ts`（187 行）に `Voice` プールと `PannerNode` による空間音響まで既に実装済みですが、`Scene` に接続されていません（core の dependencies にも audio が含まれていません）。

### 接続と API 整備

- `Scene.sound` を遅延生成サブシステムとして追加します（`Subsystem.Sound` は定義済みですが未使用です）
- Phaser 互換 API: `play(key, config)` / `stopByKey` / `add` / `remove` / `setVolume` / `mute` / `unlock` / `setListenerPosition` / `get` / `isPlaying`

### ゼロアロケーション上の論点

`Voice.play()` は呼び出しごとに `this.context.createBufferSource()` を生成します。`AudioBufferSourceNode` は再生ごとに新規生成が必須（再利用不可）なので、この 1 箇所は Web Audio の仕様上の制約です。ただし `Voice` プールが既に「空いているボイスを使い回す」設計なので、プール上限を超えない範囲では GC 負荷は小さいはずです。STEP 5 完了時に音連射のケースでヒープを実測して判断します。

---

## STEP 6: Loader の Phaser 互換

- `atlas(key, url, textureURL?)` — TexturePacker JSON
- `bitmapfont(key, url, dataURL)`
- `spritesheet` の引数形を `{ frameWidth, frameHeight }` へ統一

---

## STEP 7: 計測ゲート（各 STEP 完了で必須）

ベースライン:

```
swarm-survivors  60.2 FPS  28.96 B/frame  1024000px/5c
rpg              60.5 FPS  19.42 B/frame   614400px/15c
benchmark        37.8 FPS  計測対象外
```

各 STEP 後に `node scripts/smoke-test.mjs` を実行し、FPS 低下 5% 超、または B/frame の増加が 50 B 超え当該 STEP を破棄します。特に STEP 0（属性削除）と STEP 2（カメラ別ドローコール）は実測が重要です。

---

## 実装順序

| STEP | 内容 | 属性増減 | リスク |
|---|---|---|---|
| 0 | デッド属性削除 + isText dirty 化 | -1 | 低（むしろ高速化） |
| 1 | SoA 相乗り（alpha, texture, Transform, visible） | +1 | 低 |
| 2 | カメラ複数対応 + Phaser 互換 API | 0 | 中（描画パス変更） |
| 3 | Scene システムファサード | 0 | 低 |
| 4 | Tween ファサード + イージング | 0 | 低 |
| 5 | 音声接続 + 改良 | 0 | 中（Web Audio） |
| 6 | Loader 互換 | 0 | 低 |

---

## 残る確認事項

**Q1. カメラ数の上限** — `cameras.add()` の最大数をどうしますか。8 台を固定長配列で確保し、超過時は警告して拒否する形を想定しています。

**Q2. カメラの描画範囲** — 全カメラが全スプライトを描画する前提でよいですか（Phaser の `renderList` 相当は保留）。つまり同じスプライトが 2 台のカメラ両方に映えます。高速優先のため、カメラごとのスプライト振り分けは行いません。

**Q3. `setVisible` の属性** — STEP 0 で空く `layerDepth` (loc 7) を `visible` に再利用します。それでよろしいですか。

ご回答をいただければ STEP 0 から着手します。