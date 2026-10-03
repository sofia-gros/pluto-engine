[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [continuum/src](../README.md) / ContinuumCrowdsOptions

# Interface: ContinuumCrowdsOptions

Defined in: [continuum/src/ContinuumCrowds.ts:16](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L16)

## Properties

### gradient?

> `optional` **gradient?**: [`EikonalOptions`](EikonalOptions.md)

Defined in: [continuum/src/ContinuumCrowds.ts:22](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L22)

勾配の平滑化設定

***

### pressureStiffness?

> `optional` **pressureStiffness?**: `number`

Defined in: [continuum/src/ContinuumCrowds.ts:20](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L20)

圧力を増幅する係数

***

### targetDensity?

> `optional` **targetDensity?**: `number`

Defined in: [continuum/src/ContinuumCrowds.ts:18](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/continuum/src/ContinuumCrowds.ts#L18)

目標とする密度のしきい値。これを超えたら圧力を生じさせます
