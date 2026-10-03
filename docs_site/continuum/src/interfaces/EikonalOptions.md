[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [continuum/src](../README.md) / EikonalOptions

# Interface: EikonalOptions

Defined in: [continuum/src/EikonalField.ts:21](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L21)

## File

EikonalField.ts

## Description

アイコナール方程式 (Eikonal equation) に基づく大群ナビゲーション場。

目的:
  群集が障害物を回り込みながら目的地へ向かう経路を、
  「各セルから最も近いゴールまでの距離場」として 1 回だけ計算します。
  エンティティごとの探索は一切行わず、 afterwards は
  勾配を引くだけなので数万体でも O(1)/体 で済みます。

解法:
  |grad D| = 1 (Eikonal) を Fast Sweeping / Fast Iterative
  方式で解きます。CPU 友好的で、GrFS とほぼ同じ精度を
  4 倍スキャンで得られます。

完全独立 (Pure Math): ブラウザ API に依存せず、
将来 Wasm 化できるようにしています。

## Properties

### smoothingPasses?

> `optional` **smoothingPasses?**: `number`

Defined in: [continuum/src/EikonalField.ts:23](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L23)

勾配を平滑化する反復回数

***

### smoothingStrength?

> `optional` **smoothingStrength?**: `number`

Defined in: [continuum/src/EikonalField.ts:25](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/continuum/src/EikonalField.ts#L25)

勾配を平滑化する強度 (0 で無効)
