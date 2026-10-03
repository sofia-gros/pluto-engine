[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / SoundHandle

# Class: SoundHandle

Defined in: [core/src/sound/SoundManager.ts:68](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L68)

再生 1 本を表すハンドル。

内部的にはプール済みの [Voice](Voice.md) をそのまま公開するので、
`play()` が返した後も new は発生しません。

## Constructors

### Constructor

> **new SoundHandle**(`manager`, `voiceIndex`): `SoundHandle`

Defined in: [core/src/sound/SoundManager.ts:80](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L80)

#### Parameters

##### manager

[`SoundManager`](SoundManager.md)

##### voiceIndex

`number`

#### Returns

`SoundHandle`

## Properties

### voiceIndex

> **voiceIndex**: `number`

Defined in: [core/src/sound/SoundManager.ts:76](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L76)

Voice プール内のインデックス。-1 は未割当を示します。

**own property はこの値と `_manager` の 2 個だけ** (掟 R-03)。
Voice 自体は SoundManager のプールが使い回すため、
ハンドル側はインデックスしか保持しません。

## Accessors

### isPaused

#### Get Signature

> **get** **isPaused**(): `boolean`

Defined in: [core/src/sound/SoundManager.ts:106](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L106)

一時停止中か

##### Returns

`boolean`

***

### isPlaying

#### Get Signature

> **get** **isPlaying**(): `boolean`

Defined in: [core/src/sound/SoundManager.ts:100](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L100)

再生中か

##### Returns

`boolean`

***

### key

#### Get Signature

> **get** **key**(): `string`

Defined in: [core/src/sound/SoundManager.ts:89](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L89)

再生中のキー名。未割当または停止済みなら空文字です。
文字列への参照を own property として持たない点が掟 R-03 違反を避ける鍵です。

##### Returns

`string`

***

### loop

#### Get Signature

> **get** **loop**(): `boolean`

Defined in: [core/src/sound/SoundManager.ts:142](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L142)

ループ再生するか

##### Returns

`boolean`

#### Set Signature

> **set** **loop**(`val`): `void`

Defined in: [core/src/sound/SoundManager.ts:146](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L146)

##### Parameters

###### val

`boolean`

##### Returns

`void`

***

### rate

#### Get Signature

> **get** **rate**(): `number`

Defined in: [core/src/sound/SoundManager.ts:122](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L122)

再生速度倍率 (1.0 = 等速)

##### Returns

`number`

#### Set Signature

> **set** **rate**(`val`): `void`

Defined in: [core/src/sound/SoundManager.ts:126](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L126)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### seek

#### Get Signature

> **get** **seek**(): `number`

Defined in: [core/src/sound/SoundManager.ts:132](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L132)

再生位置 (秒)

##### Returns

`number`

#### Set Signature

> **set** **seek**(`val`): `void`

Defined in: [core/src/sound/SoundManager.ts:136](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L136)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### volume

#### Get Signature

> **get** **volume**(): `number`

Defined in: [core/src/sound/SoundManager.ts:112](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L112)

音量 0〜1

##### Returns

`number`

#### Set Signature

> **set** **volume**(`val`): `void`

Defined in: [core/src/sound/SoundManager.ts:116](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L116)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [core/src/sound/SoundManager.ts:172](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L172)

音源の X 座標

##### Returns

`number`

#### Set Signature

> **set** **x**(`val`): `void`

Defined in: [core/src/sound/SoundManager.ts:176](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L176)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [core/src/sound/SoundManager.ts:182](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L182)

音源の Y 座標

##### Returns

`number`

#### Set Signature

> **set** **y**(`val`): `void`

Defined in: [core/src/sound/SoundManager.ts:186](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L186)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [core/src/sound/SoundManager.ts:192](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L192)

音源の Z 座標

##### Returns

`number`

#### Set Signature

> **set** **z**(`val`): `void`

Defined in: [core/src/sound/SoundManager.ts:196](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L196)

##### Parameters

###### val

`number`

##### Returns

`void`

## Methods

### destroy()

> **destroy**(): `this`

Defined in: [core/src/sound/SoundManager.ts:239](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L239)

再生中なら停止します (Phaser 互換の `destroy`)

#### Returns

`this`

***

### pause()

> **pause**(): `void`

Defined in: [core/src/sound/SoundManager.ts:160](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L160)

一時停止します

#### Returns

`void`

***

### play()

> **play**(): `SoundHandle`

Defined in: [core/src/sound/SoundManager.ts:205](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L205)

同じキーの音源を再生し直します。
再生中に呼ぶと 2 本目として扱われます (Phaser と同じ挙動です)。

#### Returns

`SoundHandle`

***

### resume()

> **resume**(): `void`

Defined in: [core/src/sound/SoundManager.ts:166](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L166)

一時停止を解除します

#### Returns

`void`

***

### setLoop()

> **setLoop**(`val`): `this`

Defined in: [core/src/sound/SoundManager.ts:233](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L233)

ループを設定します (Phaser 互換の `setLoop`)

#### Parameters

##### val

`boolean`

#### Returns

`this`

***

### setRate()

> **setRate**(`val`): `this`

Defined in: [core/src/sound/SoundManager.ts:221](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L221)

再生速度を設定します (Phaser 互換の `setRate`)

#### Parameters

##### val

`number`

#### Returns

`this`

***

### setSeek()

> **setSeek**(`val`): `this`

Defined in: [core/src/sound/SoundManager.ts:227](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L227)

再生位置を設定します (Phaser 互換の `setSeek`)

#### Parameters

##### val

`number`

#### Returns

`this`

***

### setVolume()

> **setVolume**(`val`): `this`

Defined in: [core/src/sound/SoundManager.ts:215](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L215)

音量を更新しつつ再生中の状態を保ちます

#### Parameters

##### val

`number`

#### Returns

`this`

***

### stop()

> **stop**(): `void`

Defined in: [core/src/sound/SoundManager.ts:152](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L152)

再生中なら停止し、ハンドルを解放します

#### Returns

`void`
