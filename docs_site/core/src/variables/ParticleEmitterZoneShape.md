[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / ParticleEmitterZoneShape

# Variable: ParticleEmitterZoneShape

> `const` **ParticleEmitterZoneShape**: `object`

Defined in: [core/src/particles/ParticleEmitterZone.ts:27](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/particles/ParticleEmitterZone.ts#L27)

## Type Declaration

### Circle

> `readonly` **Circle**: `2` = `2`

円内の一様分布から射出

### Emit

> `readonly` **Emit**: `4` = `4`

エミッター位置に追従する

### Line

> `readonly` **Line**: `1` = `1`

線分上の一様分布から射出

### Point

> `readonly` **Point**: `0` = `0`

単一点から射出

### Random

> `readonly` **Random**: `3` = `3`

矩形内の一様分布から射出

## File

ParticleEmitterZone.ts

## Description

パーティクルエミッターの zone（射出位置の指定）の形状 enum。

設計上の判断 (IMPACT_SCOPE 6.1):
Phaser の `ParticleEmitterZone` は zone の種類とパラメータを
オブジェクトで持ちます。SoA では**形状 ID は `Uint8Array`、
パラメータは `Float32Array(n*4)`** に平坦化します。
1 形状あたり 4 パラメータに固定的原因是、境界チェックを
ホットパスで行わないためです（zone は生成時の 1 回だけ評価される）。

パラメータの意味は形状ごとに如下:

| 形状 | params[0] | params[1] | params[2] | params[3] |
| --- | --- | --- | --- | --- |
| `Point` | x | y | (不使用) | (不使用) |
| `Line` | x1 | y1 | x2 | y2 |
| `Circle` | x | y | radius | (不使用) |
| `Random` | x | y | 幅 | 高さ |
| `Emit` | (不使用) | (不使用) | (不使用) | (不使用) |

`Emit` は射出点に，追従する zone です。Phaser の `EmitterZone.emit()`
と同じ意味になり、zone の位置は `ParticleEmitter.x/y` を正本とします。
