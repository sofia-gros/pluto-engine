# PLAN: GPU パイプライン再設計（vec ペアキング / GPU-Driven / 機能補完）

| 項目 | 内容 |
| --- | --- |
| ブランチ | `feature/gpu-vector-pipeline` |
| 基準 | `main` @ `1aecbbb` |
| 目標バージョン | 1.3.0 |
| 作成日 | 2026-10-01 |

---

## 0. 調査結果 — 「GPU に渡す枠が 8 しかない」の実体

コードベースを精査した結果、**明示的な「GPU リソース枠 = 8」のスロットテーブルは存在しません**。
実際に 8 として構造的に効いているのは以下の 4 つです。

| # | 実体 | 場所 | 影響 |
| --- | --- | --- | --- |
| 1 | **WebGPU `maxVertexBuffers` = 8**（仕様既定値） | `WebGPUDevice.ts:563-564` が 2 本しか使わず、`INSTANCE_ATTRS` 11 本を **1 本に AoS 化**して回避 | **WebGPU が WebGL2 より遅い直接原因** |
| 2 | WebGL2 `MAX_VERTEX_ATTRIBS` = **16**（うち 15 使用、空き 1） | `WebGL2Device.ts:17-36` | 追加の per-instance 機能（深度順・パーティクル・カスタム uniform）が原理的に足せない |
| 3 | `MAX_CAMERAS = 8` | `CameraManager.ts:17` | 8 台超は警告して拒否 |
| 4 | `MAX_EFFECTS = 8` | `Camera.ts:17` | カメラ 1 台につき 8 同時エフェクト |

### 0.1 #1 が bottleneck である理由

WebGPU の頂点バッファ仕様は「インスタンス属性は連続したオフセットでなければならない」ため、
SoA のままでは属性オフセットが連続しません。そこで実装は 11 本の SoA 配列を
**64 バイト・ストライドの AoS バッファへ毎フレーム repack** しています。

```
WebGPUDevice.ts:509-532   ← 300k × 16 float = 480万回/フレーム、毎回無条件実行
```

**この repack は dirty フラグで一切ゲートされていません。** WebGL2 側は
`PlutoEngine.ts:211-264` の 8 個の dirty フラグで毎フレーム通常 1〜3 本しか転送しません。

実測（`docs_site/performance.md:147-151`、300k インスタンス）:

| バックエンド | FPS | 備考 |
| --- | --- | --- |
| WebGL2 | **17** | SoA を直接ポインタ転送 → O(1) |
| WebGPU | **10** | O(n) CPU repack が毎フレーム走って 40% 減速 |

**これが本プランの中核的な問題です。**

### 0.2 「vec を渡して枠をデータ的に増やす」= 正しい解法だが、トレードオフがある

WebGL2 の `MAX_VERTEX_ATTRIBS = 16` と WebGPU の `maxVertexBuffers = 8` は、
**スカラー 1 値 = 1 枠**という前提で消費されます。`vec4` に詰めることで
**1 枠 = 4 値**にできます。13 属性 → **4 属性**に圧縮できます。

設計書には既にこの方針が書かれており、実装だけが追いついていません。

```
design_docs/plutoengine_basic_design_specification.md:389-398
  「インスタンス頂点レイアウト仕様 (32 Bytes per Instance)」
  「GPUキャッシュライン（64バイト）に2インスタンスが整列して収まるよう、
    厳密に32バイト（8個の Float32）で設計」
  Location 1/2/3 に vec4 ×3
```

**しかし、ここに決定的なトレードオフがあります。**

> **vec 化（AoS 化）は、WebGL2 のゼロコピー SoA 転送を破壊する。**
> WebGL2 の>O(1) 速度の源泉は「SoA 配列をポインタのまま `bufferSubData` すること」であり、
> vec に詰めるには interleave が必要 = O(n) CPU 書き込みが発生する。

したがって **「vec 化」と「ゼロコピー」は排他**であり、両立するには上記の
回避策（AoS + CPU repack）が必要です。しかしその回避策そのものが
CPU 側のコストを発生させているため、**この矛盾を解くのが本プランの中心課題**です。
解法は Phase 1〜4 の 4 段構えで示します。

### 0.3 欠損機能リスト（実コードとの乖離を含む）

| # | 欠損機能 | 根拠 |
| --- | --- | --- |
| A | **フラストムカリングが完全に無い** | `PlutoEngine.ts:196` が `renderCount = arena.activeCount` を無条件使用。300k 中可視 5k の場合 98% が無駄ドロー |
| B | **GPU compute が 1 つも無い** | `@compute` / `workgroup_size` / `dispatchWorkgroups` / `var<storage>` の検索はゼロ件。`docs_site/en/concepts/rendering.md:7-15` は compute culling + GPU Morton + indirect draw を「実装済み」と記述 |
| C | **RenderGraph / multi-pass が無い** | `renderGraph` の検索は `beginRenderPass` 6 件のみ。ポストプロセス（Bloom / Vignette / ColorGrading）が不可能 |
| D | **マテリアル / カスタムシェーダーが実質使えない** | シェーダーは `SPRITE_WGSL` / `SPRITE_VERT_GLSL` のインライン文字列のみ。`packages/renderer/src/shaders/*.wgsl` は **dead code**（本番 import ゼロ）かつ属性数 13 で実装 15 とズレ |
| E | **WGSL→GLSL トランスパイラが壊れている** | `packages/vite-plugin-wgsl/src/index.ts:116` が `let x = ...` を無条件に `vec4 x = ...` に変換。本番 `SPRITE_WGSL` の `let alpha = smoothstep(...)` は生成すると壊れるため、本番から使われていない |
| F | **`depth` がデッド** | `InstanceBufferArena.ts:51` で保持されるが GPU 未転送・頂点シェーダ未参照。Z 順ソートが実装されていない |
| G | **非等方スケール不可** | `Sprite.ts:191-209` で `scaleX`/`scaleY` が単一 `scale` へのエイリアス |
| H | **WebGL2 に VAO が無い** | `setupInstancedAttributes` は毎フレーム 15 属性を再指定。設計書 `renderer_pipeline.md:23` は VAO 前提で描いており乖離 |
| I | **`getUniformLocation` を毎フレーム呼ぶ** | `WebGL2Device.ts:591-597`。文字列→ポインタ探索を毎フレーム |
| J | **`adapter.limits` を一切見ない** | `WebGPUDevice.init` が `adapter.limits` を読まず、GPU 側の実制約（頂点バッファ数など）を認識していない |
| K | **テキストがグリフ 1 個 = インスタンス 1 個** | `Text.ts` が 1000 文字 = 1000 インスタンス。大量表示で線形に落ちる |
| L | **core ↔ renderer が循環依存** | `PlutoEngine.ts:12` が renderer を import、`renderer/package.json:12` が core に依存 |
| M | **テクスチャ層が固定 64 で満杯時に白ピクセルの黙示** | `WebGL2Device.ts:324-327`。WebGPU 側は `textures.size % 64` で黙ってラップし上書き（`WebGPUDevice.ts:340`） |

---

## 1. 目標 / 非目標

### 目標

1. **WebGPU ≥ WebGL2**（300k で 17 FPS 以上）— O(n) CPU repack をゲートまたは排除
2. **描画インスタンス数を 10〜50 倍削減** — culling + Morton 空間ソート
3. **属性枠を 15/16 から 6/16 に解放** — vec ペアキング。追加機能を塞がない
4. **WebGPU で GPU-driven rendering** — compute culling / sort / indirect draw
5. **未実装機能を埋める** — RenderGraph、Material、非等方スケール、Z 順

### 非目標

- 3D 対応（2D エンジンの軸は増やさない）
- ECS への移行（SoA + Flyweight は有効に機能している）
- ゼロアロケーション掟の緩和（維持・強化する）

---

## 2. コア設計 — `InstanceLayout`（vec ペアキングを唯一の仕様とする）

> **決定事項（2026-10-01）**
> 「vec を渡して枠をデータ的に増やす」= `vec4` ペアキングを **エンジン仕様として採用**する。
> SoA のゼロコピー直接転送は**廃止**する。両バックエンドが packed レイアウトを使う。
> repack コストは現行 WebGPU の「13 値 × n フルリパック」より小さい範囲に収まるため、許容する。

### 2.1 インスタンスレイアウト

現状 13 個のスカラー属性を **4 バッファ（vec4 単位）** に再編します。

| バッファ | 型 | 内容 | 由来 |
| --- | --- | --- | --- |
| `packedTransform` | `Float32Array(cap*4)` | `posX, posY, scale, rotation` | `posX` `posY` `scale` `rotation` |
| `packedUv` | `Float32Array(cap*4)` | `uvX, uvY, uvW, uvH` | `uvX` `uvY` `uvW` `uvH` |
| `packedFlags` | `Float32Array(cap*4)` | `frameIdx, facing, visible, isText` | `frameIdx` `facing` `visible` `isText` |
| `packedTint` | `Uint32Array(cap)` | `RGBA`（unorm8x4、1 インスタンス 4 バイト） | `tint` (0xAABBGGRR) |
| `packedExt` | `Float32Array(cap*16)` | ユーザー拡張 `vec4` × 4（オプトイン） | **新設** |

**SoA 配列は CPU 側の真値として維持します。** hitTest・物理・AI・Tween・demos が
`arena.posX[i]` を直接読むため、SoA を消すと読み取り側が全滅します。
packed 配列は **GPU アップロード用のミラー**です。

### 2.2 書き込みは write-through（O(1)）— 毎フレーム repack はしない

ここが本設計の要点です。**毎フレーム O(n) で pack し直す案は採用しません。**
`InstanceBufferArena` にフィールド書き込み用のセッター群を追加し、
SoA と packed の**両方へ同時に書き込み**ます。

```ts
setPosX(i, v)   // posX[i] = v;   packedTransform[i*4+0] = v;  dirtyTransform = true
setScale(i, v)  // scale[i] = v;  packedTransform[i*4+2] = v;  dirtyTransform = true
setUvW(i, v)    // uvW[i] = v;    packedUv[i*4+2]      = v;  dirtyUvGroup   = true
setTint(i, v)   // tint[i] = v;   packedTint[i]         = v;  dirtyTintGroup = true
// …全 13 フィールド分
```

**これが O(1) であることの意味:** スプライトが 1 体動いても pack コストは
書き込み 1 回だけ。現状の WebGPU は 300k 体の 13 値を毎フレーム無条件で
書き直していました。本案では **pack コストが「動いたスプライト数」に比例**します。

**直接書いている呼び出し元をセッターへ置換する（重要）:**
`Sprite` 以外にも SoA へ直接書いている箇所があるため、すべて置換しないと
packed ミラーが腐ります。

| ファイル | 対象行 |
| --- | --- |
| `packages/core/src/arena/Sprite.ts` | 全 setter |
| `packages/core/src/tween/TweenManager.ts` | `:503-532` |
| `packages/core/src/anim/AnimationManager.ts` | `:203-206` |
| `packages/core/src/particles/ParticleManager.ts` | `:52-54`, `:87` |
| `packages/core/src/scene/Scene.ts` | `:292-293` |
| `packages/core/src/tilemap/Tilemap.ts` | `:136-138` |
| `packages/core/src/arena/Text.ts` | `:139-159` |

**階層（`hasHierarchy`）の扱い:** `computeWorldTransforms()` が解決した
`worldX / worldY / worldRotation` を `packedTransform` へ直接書き込みます。
階層を使わないシーン（大半）では write-through がそのまま使われ、毎フレームの
O(n) 追加コストは発生しません。

**`allocate` / `free` の swap-remove:** packed 配列も同じ末尾要素で詰め替えます
（O(1)）。`markAllDirty()` で 4 グループすべてを dirty にします。

### 2.3 枠消費

| | 現状 | 新レイアウト | 空き |
| --- | --- | --- | --- |
| WebGL2 頂点属性 | 15 / 16 | **6 / 16** | **10** |
| WebGPU 頂点バッファ | 2 / 8（+11 値を pack して 1 本に） | **5 / 8** | **3** |
| GPU アップロード単位 | 13 | **4** | — |
| 帯域（300k・全 dirty） | 13 × n = 156 MB/frame | **4 × n = 48 MB/frame** | **−69%** |

`packedExt` を使う場合は WebGPU 6/8、WebGL2 10/16 になります。

### 2.4 culling のための「追加コストなしの baseInstance」

Phase 3（culling）の前提となる重要技術。

WebGL2 コアに `baseInstance` / `firstInstance` は**存在しません**
（`drawArraysInstanced(mode, first, count, instanceCount)` のみ）。
しかし **`gl.vertexAttribPointer` の `byteOffset` はインスタンス index に加算されます**。
したがって per-camera に

```js
gl.vertexAttribPointer(2, 4, FLOAT, false, 16, baseInstance * 16);
```

と指定すれば、`baseInstance` を **属性の追加コストなし** で実現できます。

- WebGL2: カメラごとに 4 属性を再指定（カメラ 8 台でも 32 コールで無視できる）
- WebGPU: `setVertexBuffer(slot, buffer, byteOffset)` の offset 引数が同等の役割

**SoA 撤退の副次効果:** `stride = 0` の SoA 属性では `byteOffset` が効かなかったため、
従来は WebGL2 に culling の経路ができませんでした。
packed 化によって SoA フォールバックの分岐が不要になります。

この線が効きます。**vec 化（interleave）が culling を可能にする**。
Morton ソートで可視インスタンスが連続区間になるため、区間全体を
1 回の draw call で描画できます。

---

## 3. フェーズ構成

各フェーズは独立してマージ可能。Phase 1〜3 が本プランの中核です。

---

### Phase 0 — 計測基盤の確立（ブロッキング）

**なぜ先にやるか**: 以降すべての変更の成否を数字で判定する必要がある。
現状 `packTimeMs` は構造的に 0（`PlutoEngine.ts:205-206` で `performance.now()` を
2 回呼んでいるだけ）で、**WebGPU の repack コストをどこも計測していません**。

**作業:**

1. `WebGPUDevice.setupInstancedAttributes` に `packTimeMs` 計測を追加
   （`PlutoEngine.ts:186` の「SoA をそのまま転送するためパッキング時間は 0」という
   コメントは WebGPU に対して虚偽）
2. `scripts/gpu-benchmark.mjs` に per-backend 計測を整備し、
   300k で `packTimeMs` / `uploadTimeMs` / `drawTimeMs` を記録
3. 既存 `benchmark_results.json` に WebGPU 行を追加する基盤

**成果物:** backend 別のコスト内訳表（300k）

**受け入れ:** WebGPU の pack コストが 17 FPS との差額を説明できる量であることが確定する。

---

### Phase 1 — インスタンスレイアウトの vec ペアキング（write-through）

**目的:** 枠を 15/16 → 6/16 に解放し、GPU アップロード単位を 13 → 4 にする。
毎フレーム O(n) repack を **write-through (O(1))** に置き換える。

**変更:**

1. `packages/renderer/src/InstanceLayout.ts` を新設
   - バッファ定義（名前・型・1 インスタンスあたりバイト数・ストライド・
     WebGL2 の `location`・WebGPU の `shaderLocation`）を単一の情報源として保持
   - `INSTANCE_BUFFERS` 配列と `totalBytesPerInstance()`
   - **既存設計書 `plutoengine_basic_design_specification.md:389-398` の
     「vec4 に詰める」方針と一致**させる（32 バイトという記述値は
     4 × vec4 = 64 バイトに順位を修正し、理由も明記する）

2. `packages/core/src/arena/InstanceBufferArena.ts`
   - 追加: `packedTransform` / `packedUv` / `packedFlags`（`Float32Array(cap*4)` ×3）
   - 追加: `packedTint`（`Uint32Array(cap)`）
   - 追加: `packedExt`（`Float32Array(cap*16)`、オプトイン）
   - 追加: **13 個の write-through セッター**（§2.2）
   - 追加: グループ dirty フラグ `dirtyTransformGroup` / `dirtyUvGroup` /
     `dirtyFlagsGroup` / `dirtyTintGroup`
   - `allocate()` / `free()` で packed 配列も swap-remove
   - `computeWorldTransforms()` が `packedTransform` を直接更新
   - **SoA 本体は維持する**（読み取り側が relying しているため）

3. `packages/core/src/arena/Sprite.ts` ほか 6 ファイル
   - SoA への直接代入をすべて write-through セッターへ置換（§2.2 の表）

4. `packages/renderer/src/WebGPUDevice.ts`
   - `INSTANCE_ATTRS`（`:106-118`）と `setupInstancedAttributes` の
     **毎フレーム O(n) interleave ループ（`:509-532`）を完全に撤去**
   - 4 バッファを `setVertexBuffer(1..4)` に 1 回ずつ設定するだけにする
   - `updateBuffer` が即時に `queue.writeBuffer` する deferred 方式へ変更
   - WGSL の `@location` を新レイアウトへ

5. `packages/renderer/src/WebGL2Device.ts`
   - `SPRITE_VERT_GLSL`（`:14-60`）を新レイアウト（location 2〜5）へ
   - `setupInstancedAttributes`（`:484-524`）に **VAO** を導入
   - `setupInstancedAttributes(buffers, activeCount, baseInstance?)` に対応

6. `packages/renderer/src/GraphicsDevice.ts`
   - `setupInstancedAttributes(buffers, activeCount, baseInstance?)` に
     baseInstance パラメータを追加（Phase 3 のため先に足す）

7. `packages/core/src/core/PlutoEngine.ts`
   - `bufferNames`（`:148-162`）を `packedTransform` / `packedUv` /
     `packedFlags` / `packedTint` の 4 本に置換
   - 転送をグループ dirty フラグでゲート（分岐は render 内で 1 箇所のみ）

**テスト:**
- `packages/renderer/tests/instance_layout.test.ts`（新規）— オフセット・stride の一致検証
- `packages/core/tests/phase1_arena.test.ts` — packed バッファと SoA の値一致
- `packages/core/tests/arena.test.ts` — write-through が全 setter で機能すること

**受け入れ:**
- `bun run test` 全通過
- WebGL2 / WebGPU とも 300k で 17 FPS 以上
- 属性使用数が 15 → 6、GPU アップロード単位が 13 → 4
- **毎フレーム O(n) pack ループが両バックエンドから消滅している**

---

### Phase 2 — dirty ゲーティングの検証と調整

**目的:** Phase 1 で write-through 化したため、既存フラグ体系の整理と
グループフラグの精度を上げる。

**これが WebGPU を WebGL2 以上にする決定打です**（現行の毎フレーム
13 値フルリパックが 4 グループ單位・dirty 限定になる）。

**変更:**

1. グループ dirty フラグをセッター側で直接立てる（導出ではなく必然的に）

   | フラグ | 対応バッファ | 立てるセッター |
   | --- | --- | --- |
   | `dirtyTransformGroup` | `packedTransform` | `setPosX` `setPosY` `setScale` `setRotation` |
   | `dirtyUvGroup` | `packedUv` | `setUvX` `setUvY` `setUvW` `setUvH` |
   | `dirtyFlagsGroup` | `packedFlags` | `setFrameIdx` `setFacing` `setVisible` `setIsText` |
   | `dirtyTintGroup` | `packedTint` | `setTint` |

2. `dirtyPos` / `dirtyScale` / `dirtyRotation` など旧フラグは
   既存テストと外部 API の互換のため残しますが、**転送判定には使いません**

3. 既存フラグとグループフラグが常に整合していることをテストで保証する

**試算:**

| シーン | dirty グループ数（典型） | 現状の 13 値書き込み | 改善後 |
| --- | --- | --- | --- |
| 大群が移動（swarm-survivors） | 2 / 4 | 13 | 8 |
| 静的背景のみ | 0 / 4 | 13 | **0** |
| HUD のみ更新 | 1 / 4 | 13 | 4 |

**受け入れ:**
- 300k で両バックエンド 17 FPS 以上
- 静的シーンで転送バイト数が 0 になることを確認

---

### Phase 3 — カリング + Morton 空間ソート（最大の描画量削減）

**目的:** Phase 0 の欠損機能 A を実装。**これが 300k 달성 への真の鍵**。

**現状の問題:** `PlutoEngine.ts:196` が `arena.activeCount` を無条件に描画回数へ流用しています。
300k 中可視が 5k の場合、**98% の頂点処理が捨てられています**。

**変更:**

1. **Morton ソート（既存の `packages/morton` を再利用）**
   - `packages/morton/src/index.ts` は既に CPU LSD radix sort（`:106-154`）と
     `lowerBound`（`:160-169`）を持つ。**新規実装不要**
   - arena の順序を Morton code 順に並べ替え（並べ替えは camera と独立、World 座標確定後に 1 度）
   - 並べ替えの主体は SoA 配列の copy で O(n) ですが**頻度は低い**想定です
     （新規出現 / 死亡が閾値を超えたときだけ再構築）

2. **画面領域 → 可視区間**
   - `Camera.getWorldBounds`（`Camera.ts:213-222`）が既に存在。
   - 可視矩形 4 隅の Morton code を `lowerBound` で二分探索し、
     可視スプライトの**連続区間 `[lo, hi)`** を求める

3. **per-camera baseInstance 描画**
   - `setupInstancedAttributes(buffers, activeCount, baseInstance = lo)`
   - `PlutoEngine.render()` のカメラ 루ープ（`:288-292`）で
      `baseInstance` を渡し、Phase 2.3 の「byteOffset による baseInstance」を使用
   - カメラごとの SoA 転送は 1 回のまま（現状の「転送は 1 回だけ」という利点を維持）

4. **culling の中身**
   packed レイアウトが標準になったため、`vertexAttribPointer` の `byteOffset`
   がすべての属性で機能します。SoA フォールバックの分岐は不要です。
   可視区間 `[lo, hi)` について `baseInstance = lo` を渡し、
   `drawInstanced(hi - lo)` で描画します。


**試算（swarm-survivors, 300k, 1080p）:**

| | 現状 | culling + Morton 適用後 |
| --- | --- | --- |
| 描画インスタンス | 300,000 | **約 6,000** |
| 頂点処理 | 300,000 × 4 | 6,000 × 4 |
| 帯域（32B 化後） | 9.6 MB/frame | 0.19 MB/frame |

**受け入れ:**
- swarm-survivors 300k で 60 FPS 安定（現状 38 FPS）
- `rpg` デモで大きなマップのカメラ移動時に FPS が低下しない
- **注意:** 既存テストが `drawInstanced(activeCount)` の引数に依存している可能性。
  `packages/core/tests/camera.test.ts` と `phaser_compat.test.ts` を確認すること

---

### Phase 4 — GPU-Driven Compute（WebGPU 本命）

**目的:** CPU から repack・culling・sorting を完全に排除する。

`docs_site/en/concepts/rendering.md:7-15` が既に約束している機能であり、
`design_docs/detailed_design/renderer_pipeline.md:79-81` が「将来の拡張性」と
明記しているものの未実装のものです。**ドキュメントの約束を実装で埋める。**

**新規ファイル:**

| ファイル | 内容 |
| --- | --- |
| `packages/renderer/src/shaders/cull.wgsl` | フラストムカリング compute。SoA .storage バッファを読み、生存インデックスを出力 |
| `packages/renderer/src/shaders/sort.wgsl` | Morton code 計算 + ビットonic / LSD radix sort |
| `packages/renderer/src/shaders/gather.wgsl` | ソート済みインデックスで interleave（CPU repack の置き換え） |
| `packages/renderer/src/GPUCompute.ts` | compute pipeline の作成・dispatch ヘルパ |

**パイプライン:**

```
CPU: dirty な SoA 配列を STORAGE|COPY_DST バッファへ writeBuffer（転送のみ、interleave なし）
GPU pass 1 (cull):    SoA を読み、可視判定 → visibleIndices (atomic counter)
GPU pass 2 (morton):  worldX/worldY → Morton code → radix sort
GPU pass 3 (gather):   ソート順で interleave → instanceBuffer (VERTEX|STORAGE)
GPU pass 4 (draw):     drawIndirect(instanceCount を GPU が書く)
```

**`GraphicsDevice` のインターフェース拡張:**

```ts
// 既存メソッドはそのまま。追加のみ（後方互換）
readonly hasCompute: boolean;
beginComputePass(label: string): ComputeScope;
supportsComputePipelines: boolean;
```

**WebGL2 フォールバック:** `hasCompute = false`。
`beginComputePass` は no-op で、CPU 側の Phase 1〜3 のパスが使われる。

**受け入れ:**
- WebGPU で CPU `packTimeMs` が **0** になる
- `docs_site/en/concepts/rendering.md` と実装が一致する
- compute 無効環境（SwiftShader / CI）で自動的に CPU パスへフォール

---

### Phase 5 — 「枠」の抽象化（binding スロット / effects / cameras）

**目的:** ハードコードされた枠を vec ベースのデータ構造に置き換える。

#### 5a. binding スロットの抽象化

**現状:** `WebGPUDevice.ts:40-42` で 3 つハードコード、`layout: 'auto'`（`:253`）、
uniform buffer は 80 バイト固定（`:189-192`）。

**変更:**
- `packages/renderer/src/BindingLayout.ts` を新設
- binding を `{binding, resource, visibility}` の配列で宣言し、
  `createBindGroupLayout` を明示的に構築（`'auto'` をやめる）
- uniform を `vec4` 単位の**拡張可能**バッファに変更
  （80 バイト固定 → `adapter.limits.maxUniformBufferBindingSize` に応じて拡張。
  現在は `mat4`（64B）+ `vec4`（16B）のみ）
- **uniform バッファの容量拡張** が「vec を渡して枠を増やす」方向の uniform 側の答え

#### 5b. `MAX_EFFECTS = 8` のデータ化

**現状:** `Camera.ts:86-105` が 8 個の `Effect` オブジェクトを `push` します。
`Effect`（`:27-46`）は 12 プロパティの JS オブジェクトで、
**8 個 × 12 プロパティ = 96 プロパティが連続していない**ためキャッシュ効率が悪く、
`for` ループでの走査もベクトル化しにくい状態です。

**変更:** SoA 化（エンジン全体の原則に従う）

```
kind      : Uint8Array(N)
time      : Float32Array(N)
duration  : Float32Array(N)
from      : Float32Array(N)
to        : Float32Array(N)
delay     : Float32Array(N)
fromX/Y   : Float32Array(N)
toX/Y     : Float32Array(N)
active    : Uint8Array(N)
```

`N` を 8 から 32 に拡大（`MAX_EFFECTS` を 32 に）。
さらに時間軸の 5 フィールド（`time` / `duration` / `from` / `to` / `delay`）は
**`vec4` × 2 に詰めて** 1 キャッシュライン（64B）に収めます。

- 削減: カメラ 1 台あたり 8 エフェクト × 12 プロパティ = 96 プロパティの
  オブジェクトアクセス → TypedArray の連続アクセス
- カメラ 8 台なら 768 個のオブジェクトを排除

#### 5c. `MAX_CAMERAS = 8` のデータ化

`CameraManager.ts:17` の 8 を 16 に拡大。
`Camera` の内部状態も SoA 化できますが副作用が大きいため、**これは Phase 6 に回します**
（`MAX_EFFECTS` の SoA 化で構造が分かれば比較的容易）。

**受け入れ:**
- `MAX_EFFECTS` を 32 に拡大しても B/frame が 2048 を超えない
- `Camera.ts` の `Effect` インターフェースを削除し TypedArray に置換
- `packages/core/tests/camera.test.ts:244` の上限テストを更新

---

### Phase 6 — 欠損機能の補完

| # | 機能 | 作業 | 依存 |
| --- | --- | --- | --- |
| D | **シェーダーのファイル化の実現** | `packages/renderer/src/shaders/*.wgsl` を**実際に import** に変更。インライン文字列を削除 | Phase 1 |
| E | **WGSL→GLSL トランスパイラ修正** | `vite-plugin-wgsl/src/index.ts:116` の `vec4` 決め打ちを型推論に置換。`#version` / `precision` の出力追加 | D の後 |
| C | **RenderGraph / multi-pass** | `packages/renderer/src/RenderGraph.ts` を新設。パス登録 → テクスチャ生成 → multi-pass draw。ポストプロセス效果的実装 | Phase 1 |
| F | **Z 順ソート** | `depth`（`InstanceBufferArena.ts:51`）を Morton ソートの tie-breaker として利用。`i_flags` の拡張枠に `depth` を追加 | Phase 3 |
| G | **非等方スケール** | `scale` 単一 → `scaleX`/`scaleY` の 2 値化。`i_transform` を `vec4` のまま `scaleX, scaleY, scaleZ(unused), rotation` へ | Phase 1 |
| H | **WebGL2 VAO** | `WebGL2Device` に VAO を導入。属性指定を camera loop から除去 | Phase 1 |
| I | **`getUniformLocation` のキャッシュ** | `WebGL2Device.ts:591-597` を pipeline 作成時にキャッシュ | Phase 5a |
| J | **`adapter.limits` の取得** | `WebGPUDevice.init` で `adapter.limits` を読み、レイアウト選択に反映 | Phase 1 |
| K | **テキストのバッチ化** | `Text.ts` のグリフ毎インスタンスを、1 フォントアトラス上の連続 UV としてまとめて 1 インスタンス化 | Phase 1 |
| L | **循環依存の解消** | `renderer/package.json:12` から `core` 依存を削除 | 最後 |
| M | **テクスチャ層の枯渇を明示的に検出** | `WebGPUDevice.ts:340` の `% 64` ラップを修正。両バックエンドで「満杯」を一貫して throw | Phase 1 |

**受け入れ（全体）:**
- `bun run lint` が clean
- `bun run test` が全通過（46 ファイル）
- `docs_site` の記述が実装と一致（特に `concepts/rendering.md`）
- `scripts/smoke-test.mjs` の 2048 B/frame 予算内に収まる

---

## 4. フェーズ依存関係

```
Phase 0 (計測)
   │
   ├─→ Phase 1 (vec ペアキング + レイアウト抽象)  ──→ Phase 3 (culling + Morton)
   │         │                                              │
   │         │                                              ↓
   │         └─→ Phase 2 (dirty ゲーティング)         Phase 4 (compute)
   │                                                        │
   │                                                        ↓
   ├─→ Phase 5 (枠の抽象化) ─────────────────────→ Phase 6 (機能補完)
   │
   └─→ (全フェーズを通して) 計測で出し入れ
```

**重要:** Phase 2 は Phase 1 のグループ分割が前提。
**Phase 3 の culling は Phase 1 の interleave（byteOffset）が前提。**
**Phase 4 は Phase 1〜3 の CPU パスを前提に、その置き換えとして行う。**

---

## 5. リスクと対策

| リスク | 影響 | 対策 |
| --- | --- | --- |
| **Phase 1 で WebGL2 が遅延する**（interleave コスト） | 高 | デュアルレイアウトで SoA を既定維持。Phase 1 の受け入れで 17 FPS を即座に検証 |
| **Phase 3 で描画結果が壊れる**（culling での取りこぼし） | 高 | `Camera.getWorldBounds` の結果へ安全マージンを加える（境界付近は安全側に寄せて overestimate）。大きめのマージンで実装し、境界ケースのテストを必ず書く |
| **Phase 4 の compute が CI（SwiftShader）で動かない** | 中 | `hasCompute` フラグで CPU パスへ自動フォール。`adapter.limits` を必ず確認 |
| **`MAX_EFFECTS` SoA 化で API 破壊** | 中 | 公開 API（`fadeIn` / `pan` / `zoomTo`）は不変。内部構造のみ変更 |
| **Phase 6-L の循環依存解消が構造を壊す** | 中 | 最後に実施。`renderer` が `core` を使う箇所を先行調査すること |
| **32B 化でキャッシュラインが合わず逆効果** | 低 | 32B × 2 = 64B で**ちょうど整列**（設計書通り）。`benchmark_results.json` で確認 |

---

## 6. 検証コマンド

```bash
# 品質
bun run lint                                   # Biome
bun run format                                 # 整形
bun run test                                   # Vitest Browser + Playwright (46 ファイル)

# パフォーマンス
bun scripts/gpu-benchmark.mjs                 # GPU ベンチマーク
bun scripts/smoke-test.mjs                     # ゼロアロケーション検証（2048 B/frame 予算）
bun scripts/heap-profile.mjs                   # ヒーププロファイル
bun scripts/run-rpg-benchmark.mjs              # RPG ベンチマーク

# 3 デモの実測
#   swarm-survivors: 60 FPS / <5 B/frame
#   rpg:             60 FPS / <5 B/frame
#   benchmark:       38 FPS (300k)
```

**各フェーズ終了時のチェックリスト:**

- [ ] `bun run test` 全通過
- [ ] `bun run lint` clean
- [ ] `scripts/smoke-test.mjs` が 3 デモで 2048 B/frame 以内
- [ ] `benchmark_results.json` を更新
- [ ] 影響を受ける設計書を更新（`gemini.md` §5.1 のワークフロー規則）

---

## 7. 優先度のまとめ

| フェーズ | 効果 | コスト | 優先 |
| --- | --- | --- | --- |
| Phase 0 計測 | 必須の前提 | 小 | **最優先** |
| Phase 2 dirty ゲート | **WebGPU を WebGL2 以上に**（10→17+ FPS） | **小** | **最優先** |
| Phase 3 culling + Morton | **300k で 38→60 FPS**、帯域 98%削減 | 中 | **最優先** |
| Phase 1 vec ペアキング | 上記 2 つの前提。枠を 15→6 に解放 | 中〜大 | 高 |
| Phase 4 compute | CPU repack を完全に排除。ドキュメントの約束を実現 | 大 | 中 |
| Phase 5 枠の抽象化 | 拡張性の確保、`MAX_EFFECTS` 8→32 | 中 | 中 |
| Phase 6 欠損機能 | 機能価値（RenderGraph / Material / 非等方スケール） | 大 | 中 |

**推奨された実行順序（最短で効果が出る順）:**

```
Phase 0 → Phase 1 → Phase 2 → Phase 3
        （ここまでで WebGPU ≥ WebGL2 + 300k で 60 FPS）

→ ここで一度レビュー →

Phase 4 → Phase 5 → Phase 6
```

---

## 8. 補足 — 今回調査で発見した既存バグ

実装着手時に併せて修正することを推奨します。

| # | 場所 | 内容 |
| --- | --- | --- |
| 1 | `WebGPUDevice.ts:509-532` | `aN[oN + i] \|\| 0` — 正当な `0` や `NaN` を暗黙に潰す。`\|\|` は常に falsy へ落とす |
| 2 | `WebGPUDevice.ts:340` | `textures.size % 64` — WebGL2 側（`WebGL2Device.ts:324-327`）は単調増加 + 警告で、**意味が真逆**。WebGPU は黙って既存層を上書きする |
| 3 | `WebGL2Device.ts:591-597` | 毎フレーム `getUniformLocation` |
| 4 | `WebGPUDevice.ts:211-219` vs `WebGL2Device.ts:134-136` | テクスチャ配列サイズが **2048²（1 GB）vs 1024²（256 MB）** で不一致。WebGPU 側だけ CI で context lost を起こす危険 |
| 5 | `Sprite.ts:191-209` | `scaleX`/`scaleY` が単一 `scale` へのエイリアス |
| 6 | `WebGPUDevice.ts:196-202` | `_sdfUniforms` に `size: 16` をハードコード（80 バイトバッファの 4×f32 = 16 バイトとして正しいため脆い） |
| 7 | `renderer/package.json` | `vitest ^1.0.0` と root の `^2.0.0` が不一致 |
| 8 | `packages/renderer/src/shaders/*.wgsl` | 本番 import ゼロの dead code、かつ属性数が 13 で実装の 15 と乖離 |

---

## 9. 最終目標のアーキテクチャ図

```
                    ┌────────────────────────────┐
                    │      PlutoEngine.render()   │
                    │   dirty フラグで転送を gate   │
                    └──────────────┬─────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              │                                         │
    ┌─────────▼─────────┐                  ┌────────────▼────────────┐
    │   WebGL2Device     │                  │      WebGPUDevice       │
    │  (SoA, ゼロコピー)  │                  │  (Packed, 32B stride)   │
    │  15/16 → 6/16 属性 │                  │  2/8 → 5/8 vertex buffer │
    │  VAO 導入          │                  │  compute 可 / CPU repack│
    └─────────┬─────────┘                  └────────────┬────────────┘
              │                                         │
              │  ┌───────────────────────────────┐      │
              └─►│ InstanceLayout（単一の情報源）  │◄─────┘
                 │  i_transform / i_uv / i_flags  │
                 │  / i_tint / i_ext0..3         │
                 └───────────────────────────────┘
                                   │
                     ┌─────────────▼─────────────┐
                     │  Camera × MAX_CAMERAS      │
                     │  Morton 区間 + baseInstance │
                     │  Effects: SoA × 32 (vec4)  │
                     └─────────────────────────────┘
```

**これが「枠を 8 から data で増やす」ことの最終形です。**
バッファ数や属性数という「枠」を単純に増やすのではなく、
**1 枠に 4 値を載せ、CPU の interleave を減らし、
判断を GPU へ移す**——という 3 段構えです。
