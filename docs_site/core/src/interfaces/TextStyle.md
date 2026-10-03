[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / TextStyle

# Interface: TextStyle

Defined in: [core/src/arena/Text.ts:32](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Text.ts#L32)

## Properties

### align?

> `optional` **align?**: [`TextAlign`](../type-aliases/TextAlign.md)

Defined in: [core/src/arena/Text.ts:47](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Text.ts#L47)

水平方向の揃え。Phaser 互換の `setAlign`。

***

### color?

> `optional` **color?**: `number`

Defined in: [core/src/arena/Text.ts:36](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Text.ts#L36)

***

### fontFamily?

> `optional` **fontFamily?**: `string`

Defined in: [core/src/arena/Text.ts:34](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Text.ts#L34)

フォントファミリー名。接続するフォントを選ぶために使います。

***

### fontSize?

> `optional` **fontSize?**: `number`

Defined in: [core/src/arena/Text.ts:35](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Text.ts#L35)

***

### letterSpacing?

> `optional` **letterSpacing?**: `number`

Defined in: [core/src/arena/Text.ts:39](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Text.ts#L39)

***

### lineSpacing?

> `optional` **lineSpacing?**: `number`

Defined in: [core/src/arena/Text.ts:41](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Text.ts#L41)

行間 (px)。Phaser 互換の `setLineSpacing`。

***

### monospace?

> `optional` **monospace?**: `boolean`

Defined in: [core/src/arena/Text.ts:38](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Text.ts#L38)

等幅指定。指定時はアトラスの前進幅を無視します。

***

### padding?

> `optional` **padding?**: `number` \| \{ `x?`: `number`; `y?`: `number`; \}

Defined in: [core/src/arena/Text.ts:45](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Text.ts#L45)

内側の余白。Phaser 互換の `setPadding`。

***

### resolution?

> `optional` **resolution?**: `number`

Defined in: [core/src/arena/Text.ts:53](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Text.ts#L53)

解像度倍率 (Phaser 互換の `setResolution`)。
1 より大きいと	fontSize` がそのままピクセル寸法になります。
目前的実装ではレイアウト計算の倍率としてのみ使用します。

***

### wordWrapWidth?

> `optional` **wordWrapWidth?**: `number`

Defined in: [core/src/arena/Text.ts:43](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/arena/Text.ts#L43)

折り返し幅 (px)。0 なら折り返しません。Phaser 互換の `setWordWrapWidth`。
