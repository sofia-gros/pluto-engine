---
title: PlutoEngine
---

# PlutoEngine

## Properties

### `scene`

**Type:** `import("A:/Project/plute-engine/packages/core/src/scene/SceneManager").SceneManager`



### `config`

**Type:** `import("A:/Project/plute-engine/packages/core/src/core/PlutoEngine").EngineConfig`



### `scale`

**Type:** `import("A:/Project/plute-engine/packages/core/src/scale/ScaleManager").ScaleManager`



### `time`

**Type:** `import("A:/Project/plute-engine/packages/core/src/time/TimeStepManager").TimeStepManager`



### `loop`

**Type:** `import("A:/Project/plute-engine/packages/core/src/core/GameLoop").GameLoop`



### `device`

**Type:** `import("A:/Project/plute-engine/packages/renderer/src/GraphicsDevice").GraphicsDevice | null`



### `ready`

**Type:** `Promise&lt;void&gt;`



### `updateTimeMs`

**Type:** `number`



### `renderTimeMs`

**Type:** `number`



### `uploadTimeMs`

**Type:** `number`



### `drawTimeMs`

**Type:** `number`



### `packTimeMs`

**Type:** `number`

SoA から vec4 への pack コストです。

write-through のため、毎フレームの pack は **構造的に 0** です。
pack は `InstanceBufferArena` の write-through セッター内で
「動いたスプライト 1 体につき定数回」だけ発生します。

### `cullTimeMs`

**Type:** `number`

カリング（可視判定と先頭への詰め替え）に要した時間 (ms)。

描画対象を V 体へ絞ったぶん、転送量と頂点処理が減ります。
`totalInstanceCount` と `renderCount` を合わせて効果を確認できます。

### `gpuCullingActive`

**Type:** `boolean`

直近のフレームで GPU カリングが実際に有効だったか。

`config.gpuCulling` を true にしても、バックエンドが
`GraphicsDevice.setCullRect` を実装していない場合や、
カメラが複数ある場合は自動的に無効になります。
**ベンチの報告では設定値ではなくこの実際に走った値を使います**
（Phase 8 P-03 の計測でこれを区別する必要がありました）。

### `computeCullingActive`

**Type:** `boolean`

直近のフレームで compute カリング（間接描画）が実際に使われたか。
`gpuCullingActive` と同じ理由で、設定値ではなく実測値を報告します。

### `filtersActive`

**Type:** `boolean`

直近のフレームで Filter（RenderGraph 経路）が実際に使われたか。

設定値ではなく実測値を報告します。バックエンドが WebGPU でなく、
`webgpuOnly` のフィルタが除外された場合にも false になります。

### `renderGraph`

**Type:** `import("A:/Project/plute-engine/packages/renderer/src/filters/RenderGraph").RenderGraph`

Filter チェーンと多重パス構成（Phase 8 RenderGraph）。

公開しているため、`engine.renderGraph.setFilters(...)` で
実行時にフィルタを差し替えられます。

### `totalInstanceCount`

**Type:** `number`

登録済みインスタンス総数（カリング前）

### `renderCount`

**Type:** `number`

実際に描画したインスタンス数（カリング後）

## Methods

### `render()`

**Returns:** `void`



### `destroy()`

**Returns:** `void`

エンジンインスタンスとレンダラー、アニメーションループを破棄・解放します。

