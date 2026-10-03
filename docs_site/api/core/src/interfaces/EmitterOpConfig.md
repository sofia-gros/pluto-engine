[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / EmitterOpConfig

# Interface: EmitterOpConfig

Defined in: [core/src/particles/ParticleManager.ts:33](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L33)

ops 1 件。生成する粒子のパラメータを一時的に上書きします。

Phaser の `EmitterOps` は 1 エミッターに複数登録できますが、
SoA では `ops: Float32Array(n*2)` に (isEnabled, value) として平坦化します。
どのパラメータに対する op なのかは [EmitterOpKind](../type-aliases/EmitterOpKind.md) で指定します。

## Properties

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [core/src/particles/ParticleManager.ts:35](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L35)

false のとき無効。Phaser の `ops.set(false)` 相当

***

### kind?

> `optional` **kind?**: [`EmitterOpKind`](../type-aliases/EmitterOpKind.md)

Defined in: [core/src/particles/ParticleManager.ts:39](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L39)

どのパラメータに対する op か。省略時は 'speed'

***

### value

> **value**: `number`

Defined in: [core/src/particles/ParticleManager.ts:37](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/particles/ParticleManager.ts#L37)

適用する値
