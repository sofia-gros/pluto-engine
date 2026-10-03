[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / EmitterCreateConfig

# Interface: EmitterCreateConfig

Defined in: [core/src/particles/ParticleManager.ts:54](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L54)

`this.add.particles` / `ParticleManager.create` の設定。

## Properties

### angle?

> `optional` **angle?**: `object`

Defined in: [core/src/particles/ParticleManager.ts:61](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L61)

#### max

> **max**: `number`

#### min

> **min**: `number`

***

### duration?

> `optional` **duration?**: `number`

Defined in: [core/src/particles/ParticleManager.ts:72](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L72)

生成を自動停止するまでの時間 (ms)。0 なら無制限

***

### frequency?

> `optional` **frequency?**: `number`

Defined in: [core/src/particles/ParticleManager.ts:58](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L58)

1 秒あたりの生成個数。0 なら手動の emitParticle のみ

***

### gravityX?

> `optional` **gravityX?**: `number`

Defined in: [core/src/particles/ParticleManager.ts:74](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L74)

粒子ごとの重力 (px/s^2)

***

### gravityY?

> `optional` **gravityY?**: `number`

Defined in: [core/src/particles/ParticleManager.ts:75](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L75)

***

### lifespan?

> `optional` **lifespan?**: `number`

Defined in: [core/src/particles/ParticleManager.ts:60](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L60)

***

### maxAliveParticles?

> `optional` **maxAliveParticles?**: `number`

Defined in: [core/src/particles/ParticleManager.ts:70](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L70)

生存粒子上限。0 なら無制限

***

### ops?

> `optional` **ops?**: [`EmitterOpConfig`](EmitterOpConfig.md)[]

Defined in: [core/src/particles/ParticleManager.ts:66](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L66)

生成パラメータの上書き op

***

### quantity?

> `optional` **quantity?**: `number`

Defined in: [core/src/particles/ParticleManager.ts:68](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L68)

1 回の explode / start で生成する個数

***

### speed?

> `optional` **speed?**: `number`

Defined in: [core/src/particles/ParticleManager.ts:59](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L59)

***

### timeScale?

> `optional` **timeScale?**: `number`

Defined in: [core/src/particles/ParticleManager.ts:77](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L77)

時間倍率。1.0 が等速

***

### tint?

> `optional` **tint?**: `number`

Defined in: [core/src/particles/ParticleManager.ts:62](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L62)

***

### x?

> `optional` **x?**: `number`

Defined in: [core/src/particles/ParticleManager.ts:55](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L55)

***

### y?

> `optional` **y?**: `number`

Defined in: [core/src/particles/ParticleManager.ts:56](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L56)

***

### zone?

> `optional` **zone?**: [`EmitterZoneConfig`](EmitterZoneConfig.md)

Defined in: [core/src/particles/ParticleManager.ts:64](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L64)

射出位置の zone
