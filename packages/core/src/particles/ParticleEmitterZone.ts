/**
 * @file ParticleEmitterZone.ts
 * @description
 * パーティクルエミッターの zone（射出位置の指定）の形状 enum。
 *
 * 設計上の判断 (IMPACT_SCOPE 6.1):
 * Phaser の `ParticleEmitterZone` は zone の種類とパラメータを
 * オブジェクトで持ちます。SoA では**形状 ID は `Uint8Array`、
 * パラメータは `Float32Array(n*4)`** に平坦化します。
 * 1 形状あたり 4 パラメータに固定的原因是、境界チェックを
 * ホットパスで行わないためです（zone は生成時の 1 回だけ評価される）。
 *
 * パラメータの意味は形状ごとに如下:
 *
 * | 形状 | params[0] | params[1] | params[2] | params[3] |
 * | --- | --- | --- | --- | --- |
 * | `Point` | x | y | (不使用) | (不使用) |
 * | `Line` | x1 | y1 | x2 | y2 |
 * | `Circle` | x | y | radius | (不使用) |
 * | `Random` | x | y | 幅 | 高さ |
 * | `Emit` | (不使用) | (不使用) | (不使用) | (不使用) |
 *
 * `Emit` は射出点に，追従する zone です。Phaser の `EmitterZone.emit()`
 * と同じ意味になり、zone の位置は `ParticleEmitter.x/y` を正本とします。
 */

export const ParticleEmitterZoneShape = {
  /** 単一点から射出 */
  Point: 0,
  /** 線分上の一様分布から射出 */
  Line: 1,
  /** 円内の一様分布から射出 */
  Circle: 2,
  /** 矩形内の一様分布から射出 */
  Random: 3,
  /** エミッター位置に追従する */
  Emit: 4,
} as const;

export type ParticleEmitterZoneShapeValue =
  (typeof ParticleEmitterZoneShape)[keyof typeof ParticleEmitterZoneShape];

/** 1 形状あたりのパラメータ数。SoA 配列は `n * ZONE_PARAMS` で確保します。 */
export const ZONE_PARAMS = 4;
