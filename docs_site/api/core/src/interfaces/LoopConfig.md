[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / LoopConfig

# Interface: LoopConfig

Defined in: [core/src/core/GameLoop.ts:13](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/core/GameLoop.ts#L13)

## File

GameLoop.ts

## Description

ゲームループ。requestAnimationFrame をフックし、可変 dt と
固定 fixedDeltaTime (アキュムレータ方式) を分離します。

設計上の掟:
 - ループ内で new を行わない (プロジェクション行列などは呼び出し側のバッファを使う)
 - Spiral of Death 防止のため dt を上限クランプし、
   固定ステップ的反復回数を panicLimit で明示的に制限する

## Properties

### fixedDeltaTime?

> `optional` **fixedDeltaTime?**: `number`

Defined in: [core/src/core/GameLoop.ts:19](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/core/GameLoop.ts#L19)

物理・固定シミュレーションの刻み幅 (秒)

***

### maxDeltaTime?

> `optional` **maxDeltaTime?**: `number`

Defined in: [core/src/core/GameLoop.ts:23](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/core/GameLoop.ts#L23)

dt の上限 (秒)。タブ復帰時などの巨大な delta を弾く

***

### minFps?

> `optional` **minFps?**: `number`

Defined in: [core/src/core/GameLoop.ts:17](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/core/GameLoop.ts#L17)

許容最低フレームレート。これを下回ると固定ステップの消化量を 1 回に抑える

***

### panicLimit?

> `optional` **panicLimit?**: `number`

Defined in: [core/src/core/GameLoop.ts:21](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/core/GameLoop.ts#L21)

1 フレームで許容する固定ステップの最大反復回数

***

### targetFps?

> `optional` **targetFps?**: `number`

Defined in: [core/src/core/GameLoop.ts:15](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/core/GameLoop.ts#L15)

目標フレームレート。指定するとその間隔より短いフレームを描画しない
