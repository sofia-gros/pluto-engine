[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Subsystem

# Variable: Subsystem

> `const` **Subsystem**: `object`

Defined in: [core/src/scene/SubsystemMask.ts:19](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/SubsystemMask.ts#L19)

各サブシステムを示すビット。
値は 1 << n とし、直接 bitwise OR で合成できるようにします。

## Type Declaration

### Anims

> `readonly` **Anims**: `number`

this.anim

### Camera

> `readonly` **Camera**: `number`

カメラ

### Lighting

> `readonly` **Lighting**: `number`

ライティング

### None

> `readonly` **None**: `0` = `0`

### Particles

> `readonly` **Particles**: `number`

this.particles

### Physics

> `readonly` **Physics**: `number`

this.physics

### Sound

> `readonly` **Sound**: `number`

this.sound

### Sprites

> `readonly` **Sprites**: `number`

スプライト生成と描画対象

### Swarm

> `readonly` **Swarm**: `number`

群集シミュレーション (プラグイン)

### Text

> `readonly` **Text**: `number`

テキスト (MSDF)

### Tilemap

> `readonly` **Tilemap**: `number`

タイルマップ

### Tweens

> `readonly` **Tweens**: `number`

this.tweens
