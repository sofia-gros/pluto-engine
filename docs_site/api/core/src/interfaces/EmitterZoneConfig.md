[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / EmitterZoneConfig

# Interface: EmitterZoneConfig

Defined in: [core/src/particles/ParticleManager.ts:19](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L19)

zone の形状とパラメータを SoA に渡すための設定。

## Properties

### params?

> `optional` **params?**: `ArrayLike`\<`number`\>

Defined in: [core/src/particles/ParticleManager.ts:23](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L23)

形状ごとのパラメータ 4 個。意味は ParticleEmitterZone を参照

***

### shape

> **shape**: [`ParticleEmitterZoneShapeValue`](../type-aliases/ParticleEmitterZoneShapeValue.md)

Defined in: [core/src/particles/ParticleManager.ts:21](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L21)

`ParticleEmitterZoneShape` のいずれか
