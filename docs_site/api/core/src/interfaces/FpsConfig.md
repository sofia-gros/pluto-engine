[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / FpsConfig

# Interface: FpsConfig

Defined in: [core/src/core/PlutoEngine.ts:22](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/core/PlutoEngine.ts#L22)

## Properties

### fixedDeltaTime?

> `optional` **fixedDeltaTime?**: `number`

Defined in: [core/src/core/PlutoEngine.ts:28](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/core/PlutoEngine.ts#L28)

固定シミュレーション刻み幅 (秒)

***

### min?

> `optional` **min?**: `number`

Defined in: [core/src/core/PlutoEngine.ts:26](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/core/PlutoEngine.ts#L26)

許容最低フレームレート。これを下回ると固定ステップの消化を 1 回に抑えます

***

### panicLimit?

> `optional` **panicLimit?**: `number`

Defined in: [core/src/core/PlutoEngine.ts:30](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/core/PlutoEngine.ts#L30)

1 フレームで許容する固定ステップの最大反復回数

***

### target?

> `optional` **target?**: `number`

Defined in: [core/src/core/PlutoEngine.ts:24](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/core/PlutoEngine.ts#L24)

目標フレームレート。0 または未指定なら VSync に任せます
