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

---

## 実施記録

### STEP 4: Tween ファサード + イージング（完了）

#### 追加したファイル

`packages/core/src/tween/Easing.ts`（新規）

- `EaseKind` は 28 種類（Linear / Quad / Cubic / Quart / Sine / Expo / Circ / Back / Bounce / Elastic の In / Out / InOut）
- 64 サンプル × 28 = 1792 エントリを 1 本の `Float32Array` に詰めて module スコープで 1 度だけ構築。以降は読み取り専用です
- `evaluateEase(kind, t)` は添字参照 1 回 + 線形補間のみ。毎フレームの `new` は 0 です
- `getEaseKind(name)` は `Quad.easeIn` / `quad.in` / `quadin` のいずれの書き方も受け付けます（`normalizeName` が区切りと `ease` を落として検索キーにします）

#### `TweenManager` の変更

SoA に 7 本を追加しました（頂点属性は 0 個です）。

| 配列 | 型 | 役割 |
|---|---|---|
| `delay` | `Float32Array` | 開始までの待機。減算してから判定するので境界で 1 フレームずれません |
| `easeKind` | `Uint8Array` | `EaseKind` |
| `yoyo` | `Uint8Array` | 往復フラグ |
| `direction` | `Uint8Array` | 0 = 往路、1 = 復路 |
| `repeatLeft` | `Int32Array` | 残り繰り返し回数（-1 = 無限） |
| `groupId` | `Int32Array` | グループ ID |
| `started` | `Uint8Array` | `onStart` の発済みフラグ |

`update()` の書き換えでは次を行います。

- `ALPHA` を tint の最上位バイト（A チャンネル）へ書き込みます。独立した SoA を作らないので属性追加は 0 です
- `ROTATION` / `FLIP_X` を実装しました
- `yoyo` は復路が終わってから `repeat` を消費します（1 往復 = 1 回と数える）
- 位置系は ID ではなく密添字で管理されているため、`_apply()` 内で `idToIndex` を通します

ファサードは次の通りです。

- `add(config)` — `targets` / `props` / `duration` / `delay` / `ease` / `yoyo` / `repeat` / `onStart` / `onUpdate` / `onComplete`。`props` 1 つにつき SoA スロット 1 個。`targets` は配列可。開始値は現在値から取るので、登録した瞬間に座標が飛ばない
- `chain(configs)` — 順番に実行します。完了判定をコールバック呼び出しより先に行うため、`onComplete` の中から `killTweensOfGroup()` しても次のステップは始まりません
- `killTweensOf` / `killTweensOfGroup` — Phaser と同じく `onComplete` は発火しません（`_freeSilent` 経路）
- `count` — `getTweens().length` 相当

コールバックは `onStart` / `onUpdate` を 1 スロット目にだけ載せ、`onComplete` はグループ生存数を `Map` で数えて 0 になった 1 回だけ呼びます。`Map` のエントリは 1 グループにつき 1 つで、毎フレームには増えません。

#### ゲート結果

| 項目 | 結果 |
|---|---|
| `bun run build` | 成功 |
| `bun run test` | 32 ファイル / 382 テスト全通過（今回 19 件追加） |
| `apps/demo` の `tsc --noEmit` | エラー 0 |
| `apps/demo` の `vite build` | 成功 |
| `scripts/smoke-test.mjs` | 3 デモ PASS / errors 0 |

| デモ | FPS | B/frame |
|---|---|---|
| swarm-survivors | 59.8 | 63.24 |
| rpg | 60.7 | 65.42 |
| benchmark | 37.0 | 3680.76（対象外） |

FPS 低下 5% 未満、B/frame 増加 50 未満の両方を満たしています。

#### 実装中に見つけた不整合

- 旧 `add(entityId, propType, start, end, durationMs)` とファサード `add(config)` が名前上で衝突したため、内部用を `_addSlot()` へ改名しました
- `const enum EaseKind` を `TweenManager` から使うため `Easing.ts` を値として import する必要があり、`isolatedModules` では `const enum` の逆引き（`EaseKind[k]`）が使えません。名前を明示した配列に置き換えました
- イージング名 `Quad.easeIn` はそのままでは検索キーに合いません。`normalizeName` で `quad.in` に落とします

---

### STEP 5: 音声接続 + 改良（完了）

#### 依存の向きを反転

プランには「`core` の dependencies に `audio` を追加」と書かれていましたが、そのままでは
循環参照になります（`audio` が既に `core` に依存済み）。そのため実装を `core` 側へ移し、
`packages/audio` は後方互換用の再エクスポートに留めました。

| ファイル | 変更 |
|---|---|
| `packages/core/src/sound/SoundManager.ts` | 新規。実装本体 |
| `packages/audio/src/SoundManager.ts` | `core` からの再エクスポートのみ |
| `packages/audio/src/SoundPlugin.ts` | `scene.setSoundManager()` を使う形に更新 |

`import { SoundManager } from '@pluto-engine/audio'` はそのまま動作します。

#### `Scene.sound`（遅延サブシステム）

- `Subsystem.Sound`（`1 << 8`、定義済み・未使用だったもの）を初次アクセスで立てます
- `sysUpdate` は `if ((active & Subsystem.Sound) !== 0) this._sound!.update();` の 1 行だけ追加。
  未使用なら AND 1 回でスキップされます
- `sysShutdown` で `AudioContext` を必ず閉じます（有限リソースなので）
- `setSoundManager(manager)` を追加し、`SoundPlugin` が自前のインスタンスを渡せるようにしました。
  ビットもここで立てるため二重生成は起きません

#### Phaser 互換 API

| API | 内容 |
|---|---|
| `play(key, config)` | `SoundHandle` を返します。Phaser の `Sound` に相当 |
| `playAudioSprite(key, config)` | `seek` を割合として受け取り `delay`（秒）へ変換します |
| `stopByKey(key)` | `Voice` に `key` を持たせ、プール側を直接照合します。停止本数を返します |
| `add` / `remove` / `exists` / `count` | 登録済み音声の管理 |
| `loadAudioData(key, arrayBuffer)` | エンコード済みデータの登録 |
| `get(key)` / `isPlaying(key)` | 再生ハンドルの取得と状態照会 |
| `setVolume` / `volume` | master gain 0〜1。範囲外は丸めます |
| `mute` / `setMute` | master gain を 0 にします |
| `unlock` / `unlocked` | 自動再生ポリシーによる停止からの復帰 |
| `pauseAll` / `resumeAll` / `paused` | context 全体のサスペンド |
| `setListenerPosition(x, y, z)` | 3D 配置。`positionX` が無い WebKit 向けに `setPosition` へフォールバック |
| `stopAll` / `removeAll` / `destroy` | 解放 |
| `setConfig` | 旧 API の別名 |

`config` は `volume` / `loop` / `rate` / `seek` / `delay` / `x` / `y` / `z` / `mute` / `fadeIn` を受け付けます。

#### ゼロアロケーション上の論点（プランの論点を、計測の代わりに構造で解決）

`AudioBufferSourceNode` は Web Audio の仕様で再生ごとに新規生成が必須です。ただし
`SoundManager` は「空いている `Voice` を再利用する」設計なので、プール上限（既定 32）までは
毎フレームの `new` は 1 再生 1 個だけです。`Voice` の `PannerNode` と `GainNode` は
生成時 1 度しか作らず、以降は `positionX.value` への書き込みと `gain.value` の更新だけです。

`SoundHandle` もプール済みの `Voice` をそのままラップするので、`play()` の戻り値に new は発生しません。

`fadeIn` は `setValueCurve`（呼び出しごとに new が要る）を使わず、
`Voice.updateFade()` が `gain.value` を線形ランプで書き込みます。
`SoundManager.update()` は毎フレーム `voicePool` を 1 回走査するだけなので new は 0 です。

#### 未実装（意図的）

- `AudioSprite` は実装しません。`SoundManager` が既に 1 キーで複数同時再生でき、
  同じ用途の音源が重複しない 1 本の Voice で足ります
- フェードアウトは未実装です。逆再生はテクスチャの reverse 再生一样の見栄えになり、
  現段階では複雑さが割に合わないと判断しました

#### ゲート結果

| 項目 | 結果 |
|---|---|
| `bun run build` | 成功 |
| `bun run test` | 32 ファイル / 396 テスト全通過（今回 14 件追加） |
| `apps/demo` の `tsc --noEmit` | エラー 0 |
| `apps/demo` の `vite build` | 成功 |
| `scripts/smoke-test.mjs` | 3 デモ PASS / errors 0 |

| デモ | FPS | B/frame |
|---|---|---|
| swarm-survivors | 59.8 | 60.29 |
| rpg | 60.4 | -8.2 |
| benchmark | 37.2 | 3254.16（対象外） |

FPS 低下 5% 未満、B/frame 増加 50 未満の両方を満たしています。
3 デモとも `this.sound` に触れていないため、SoundManager の生成コストは発生していません。

