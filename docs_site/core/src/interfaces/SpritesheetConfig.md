[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / SpritesheetConfig

# Interface: SpritesheetConfig

Defined in: [core/src/loader/LoaderManager.ts:34](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L34)

`spritesheet` の設定。Phaser と同じ `{ frameWidth, frameHeight }` 形式です。

## Properties

### endFrame?

> `optional` **endFrame?**: `number`

Defined in: [core/src/loader/LoaderManager.ts:40](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L40)

読み込むフレーム数 (省略時は全体)

***

### firstFrame?

> `optional` **firstFrame?**: `number`

Defined in: [core/src/loader/LoaderManager.ts:42](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L42)

1 行目のフレーム番号 (Phaser 互換。`startFrame` が優先されます)

***

### frameHeight

> **frameHeight**: `number`

Defined in: [core/src/loader/LoaderManager.ts:36](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L36)

***

### frameWidth

> **frameWidth**: `number`

Defined in: [core/src/loader/LoaderManager.ts:35](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L35)

***

### lastFrame?

> `optional` **lastFrame?**: `number`

Defined in: [core/src/loader/LoaderManager.ts:44](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L44)

最終フレーム番号 (Phaser 互換。`endFrame` が優先されます)

***

### startFrame?

> `optional` **startFrame?**: `number`

Defined in: [core/src/loader/LoaderManager.ts:38](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L38)

開始フレーム番号 (既定 0)
