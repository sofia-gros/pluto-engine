[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / PlutoEngine

# Class: PlutoEngine

Defined in: [core/src/core/PlutoEngine.ts:108](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L108)

## Constructors

### Constructor

> **new PlutoEngine**(`config`): `PlutoEngine`

Defined in: [core/src/core/PlutoEngine.ts:129](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L129)

#### Parameters

##### config

[`EngineConfig`](../interfaces/EngineConfig.md)

#### Returns

`PlutoEngine`

## Properties

### computeCullingActive

> **computeCullingActive**: `boolean` = `false`

Defined in: [core/src/core/PlutoEngine.ts:285](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L285)

直近のフレームで compute カリング（間接描画）が実際に使われたか。
`gpuCullingActive` と同じ理由で、設定値ではなく実測値を報告します。

***

### config

> `readonly` **config**: [`EngineConfig`](../interfaces/EngineConfig.md)

Defined in: [core/src/core/PlutoEngine.ts:110](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L110)

***

### cullTimeMs

> **cullTimeMs**: `number` = `0`

Defined in: [core/src/core/PlutoEngine.ts:270](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L270)

カリング（可視判定と先頭への詰め替え）に要した時間 (ms)。

描画対象を V 体へ絞ったぶん、転送量と頂点処理が減ります。
`totalInstanceCount` と `renderCount` を合わせて効果を確認できます。

***

### device

> **device**: [`GraphicsDevice`](../../../renderer/src/interfaces/GraphicsDevice.md) = `null`

Defined in: [core/src/core/PlutoEngine.ts:115](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L115)

***

### drawTimeMs

> **drawTimeMs**: `number` = `0`

Defined in: [core/src/core/PlutoEngine.ts:254](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L254)

***

### filtersActive

> **filtersActive**: `boolean` = `false`

Defined in: [core/src/core/PlutoEngine.ts:293](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L293)

直近のフレームで Filter（RenderGraph 経路）が実際に使われたか。

設定値ではなく実測値を報告します。バックエンドが WebGPU でなく、
`webgpuOnly` のフィルタが除外された場合にも false になります。

***

### gpuCullingActive

> **gpuCullingActive**: `boolean` = `false`

Defined in: [core/src/core/PlutoEngine.ts:280](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L280)

直近のフレームで GPU カリングが実際に有効だったか。

`config.gpuCulling` を true にしても、バックエンドが
`GraphicsDevice.setCullRect` を実装していない場合や、
カメラが複数ある場合は自動的に無効になります。
**ベンチの報告では設定値ではなくこの実際に走った値を使います**
（Phase 8 P-03 の計測でこれを区別する必要がありました）。

***

### loop

> `readonly` **loop**: [`GameLoop`](GameLoop.md)

Defined in: [core/src/core/PlutoEngine.ts:113](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L113)

***

### packTimeMs

> **packTimeMs**: `number` = `0`

Defined in: [core/src/core/PlutoEngine.ts:262](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L262)

SoA から vec4 への pack コストです。

write-through のため、毎フレームの pack は **構造的に 0** です。
pack は `InstanceBufferArena` の write-through セッター内で
「動いたスプライト 1 体につき定数回」だけ発生します。

***

### ready

> `readonly` **ready**: `Promise`\<`void`\>

Defined in: [core/src/core/PlutoEngine.ts:196](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L196)

***

### renderCount

> **renderCount**: `number` = `0`

Defined in: [core/src/core/PlutoEngine.ts:307](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L307)

実際に描画したインスタンス数（カリング後）

***

### renderGraph

> `readonly` **renderGraph**: [`RenderGraph`](../../../renderer/src/classes/RenderGraph.md)

Defined in: [core/src/core/PlutoEngine.ts:301](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L301)

Filter チェーンと多重パス構成（Phase 8 RenderGraph）。

公開しているため、`engine.renderGraph.setFilters(...)` で
実行時にフィルタを差し替えられます。

***

### renderTimeMs

> **renderTimeMs**: `number` = `0`

Defined in: [core/src/core/PlutoEngine.ts:252](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L252)

***

### scale

> `readonly` **scale**: [`ScaleManager`](ScaleManager.md)

Defined in: [core/src/core/PlutoEngine.ts:111](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L111)

***

### scene

> `readonly` **scene**: [`SceneManager`](SceneManager.md)

Defined in: [core/src/core/PlutoEngine.ts:109](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L109)

***

### time

> `readonly` **time**: [`TimeStepManager`](TimeStepManager.md)

Defined in: [core/src/core/PlutoEngine.ts:112](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L112)

***

### totalInstanceCount

> **totalInstanceCount**: `number` = `0`

Defined in: [core/src/core/PlutoEngine.ts:304](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L304)

登録済みインスタンス総数（カリング前）

***

### updateTimeMs

> **updateTimeMs**: `number` = `0`

Defined in: [core/src/core/PlutoEngine.ts:251](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L251)

***

### uploadTimeMs

> **uploadTimeMs**: `number` = `0`

Defined in: [core/src/core/PlutoEngine.ts:253](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L253)

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [core/src/core/PlutoEngine.ts:568](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L568)

エンジンインスタンスとレンダラー、アニメーションループを破棄・解放します。

#### Returns

`void`

***

### render()

> **render**(): `void`

Defined in: [core/src/core/PlutoEngine.ts:312](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/core/PlutoEngine.ts#L312)

#### Returns

`void`
