[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [xpbd/src](../README.md) / XPBDParticles

# Interface: XPBDParticles

Defined in: [xpbd/src/XPBDSolver.ts:21](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/xpbd/src/XPBDSolver.ts#L21)

粒子 1 体を表す入力 SoA

## Properties

### count

> **count**: `number`

Defined in: [xpbd/src/XPBDSolver.ts:22](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/xpbd/src/XPBDSolver.ts#L22)

***

### invMasses

> **invMasses**: `Float32Array`

Defined in: [xpbd/src/XPBDSolver.ts:35](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/xpbd/src/XPBDSolver.ts#L35)

逆質量。0 は無限質量 (静的物体) を表します

***

### posX

> **posX**: `Float32Array`

Defined in: [xpbd/src/XPBDSolver.ts:24](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/xpbd/src/XPBDSolver.ts#L24)

現在の位置 (解法後に書き換わります)

***

### posY

> **posY**: `Float32Array`

Defined in: [xpbd/src/XPBDSolver.ts:25](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/xpbd/src/XPBDSolver.ts#L25)

***

### prevX

> **prevX**: `Float32Array`

Defined in: [xpbd/src/XPBDSolver.ts:27](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/xpbd/src/XPBDSolver.ts#L27)

1 ステップ前の位置。ここから速度を復元します

***

### prevY

> **prevY**: `Float32Array`

Defined in: [xpbd/src/XPBDSolver.ts:28](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/xpbd/src/XPBDSolver.ts#L28)

***

### radii

> **radii**: `Float32Array`

Defined in: [xpbd/src/XPBDSolver.ts:33](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/xpbd/src/XPBDSolver.ts#L33)

半径

***

### velX

> **velX**: `Float32Array`

Defined in: [xpbd/src/XPBDSolver.ts:30](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/xpbd/src/XPBDSolver.ts#L30)

解法後の速度 (v = (x - x_prev) / h)

***

### velY

> **velY**: `Float32Array`

Defined in: [xpbd/src/XPBDSolver.ts:31](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/xpbd/src/XPBDSolver.ts#L31)
