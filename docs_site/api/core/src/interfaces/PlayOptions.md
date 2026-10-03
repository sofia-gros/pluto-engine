[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / PlayOptions

# Interface: PlayOptions

Defined in: [core/src/sound/SoundManager.ts:23](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L23)

再生の指定。Phaser の config と同じ形です。

## Properties

### delay?

> `optional` **delay?**: `number`

Defined in: [core/src/sound/SoundManager.ts:33](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L33)

音源の再生開始位置 (秒)

***

### fadeIn?

> `optional` **fadeIn?**: `number`

Defined in: [core/src/sound/SoundManager.ts:45](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L45)

フェードイン (ms)。フェードアウトは非対応です。

***

### loop?

> `optional` **loop?**: `boolean`

Defined in: [core/src/sound/SoundManager.ts:27](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L27)

ループするか

***

### loops?

> `optional` **loops?**: `number`

Defined in: [core/src/sound/SoundManager.ts:43](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L43)

再生ループ的回数を指定 (loop: true のときのみ有効)

***

### mute?

> `optional` **mute?**: `boolean`

Defined in: [core/src/sound/SoundManager.ts:41](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L41)

再生中の bool を反転してミュートするか

***

### rate?

> `optional` **rate?**: `number`

Defined in: [core/src/sound/SoundManager.ts:29](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L29)

音速 playbackRate 1.0 = 等倍

***

### seek?

> `optional` **seek?**: `number`

Defined in: [core/src/sound/SoundManager.ts:31](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L31)

音源の横幅秒数。rate を上書きします

***

### volume?

> `optional` **volume?**: `number`

Defined in: [core/src/sound/SoundManager.ts:25](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L25)

音量 0〜1

***

### x?

> `optional` **x?**: `number`

Defined in: [core/src/sound/SoundManager.ts:35](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L35)

音源の X 座標 (3D 配置用)

***

### y?

> `optional` **y?**: `number`

Defined in: [core/src/sound/SoundManager.ts:37](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L37)

音源の Y 座標 (3D 配置用)

***

### z?

> `optional` **z?**: `number`

Defined in: [core/src/sound/SoundManager.ts:39](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L39)

音源の Z 座標 (3D 配置用)
