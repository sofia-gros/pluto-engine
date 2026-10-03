[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / EmitterZoneConfig

# Interface: EmitterZoneConfig

Defined in: [core/src/particles/ParticleManager.ts:19](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L19)

zone の形状とパラメータを SoA に渡すための設定。

## Properties

### params?

> `optional` **params?**: `ArrayLike`\<`number`\>

Defined in: [core/src/particles/ParticleManager.ts:23](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L23)

形状ごとのパラメータ 4 個。意味は ParticleEmitterZone を参照

***

### shape

> **shape**: [`ParticleEmitterZoneShapeValue`](../type-aliases/ParticleEmitterZoneShapeValue.md)

Defined in: [core/src/particles/ParticleManager.ts:21](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleManager.ts#L21)

`ParticleEmitterZoneShape` のいずれか
