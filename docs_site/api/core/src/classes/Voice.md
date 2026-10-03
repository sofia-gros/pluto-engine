[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Voice

# Class: Voice

Defined in: [core/src/sound/SoundManager.ts:265](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L265)

再生ボイス 1 本。

`PannerNode` と `GainNode` は生成時に 1 度だけ作り、以降は書き換えるだけです。
`AudioBufferSourceNode` だけは再生ごとに生成します (Web Audio の仕様上の制約)。

## Constructors

### Constructor

> **new Voice**(`context`, `destination`): `Voice`

Defined in: [core/src/sound/SoundManager.ts:290](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L290)

#### Parameters

##### context

`AudioContext`

##### destination

`AudioNode`

#### Returns

`Voice`

## Properties

### fadingIn

> **fadingIn**: `boolean` = `false`

Defined in: [core/src/sound/SoundManager.ts:283](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L283)

フェードインで減衰している途中なら true

***

### isPlaying

> **isPlaying**: `boolean` = `false`

Defined in: [core/src/sound/SoundManager.ts:271](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L271)

再生中か

***

### key

> **key**: `string` = `''`

Defined in: [core/src/sound/SoundManager.ts:281](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L281)

再生中のキー名。stopByKey() が voice 側を照合するために持ちます。

***

### loop

> **loop**: `boolean` = `false`

Defined in: [core/src/sound/SoundManager.ts:273](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L273)

ループ再生中か

***

### paused

> **paused**: `boolean` = `false`

Defined in: [core/src/sound/SoundManager.ts:275](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L275)

一時停止中か (Phaser 互換の `pause` / `resume`)

***

### rate

> **rate**: `number` = `1`

Defined in: [core/src/sound/SoundManager.ts:277](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L277)

再生速度倍率 (1.0 = 等速)

***

### seek

> **seek**: `number` = `0`

Defined in: [core/src/sound/SoundManager.ts:279](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L279)

再生位置 (秒)。`AudioBufferSourceNode` の能力上、停止中のみ変更できます。

## Accessors

### volume

#### Get Signature

> **get** **volume**(): `number`

Defined in: [core/src/sound/SoundManager.ts:494](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L494)

音量 0〜1

##### Returns

`number`

#### Set Signature

> **set** **volume**(`val`): `void`

Defined in: [core/src/sound/SoundManager.ts:497](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L497)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [core/src/sound/SoundManager.ts:470](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L470)

音源の X 座標

##### Returns

`number`

#### Set Signature

> **set** **x**(`val`): `void`

Defined in: [core/src/sound/SoundManager.ts:473](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L473)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [core/src/sound/SoundManager.ts:478](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L478)

音源の Y 座標

##### Returns

`number`

#### Set Signature

> **set** **y**(`val`): `void`

Defined in: [core/src/sound/SoundManager.ts:481](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L481)

##### Parameters

###### val

`number`

##### Returns

`void`

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [core/src/sound/SoundManager.ts:486](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L486)

音源の Z 座標

##### Returns

`number`

#### Set Signature

> **set** **z**(`val`): `void`

Defined in: [core/src/sound/SoundManager.ts:489](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L489)

##### Parameters

###### val

`number`

##### Returns

`void`

## Methods

### pause()

> **pause**(): `void`

Defined in: [core/src/sound/SoundManager.ts:426](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L426)

一時停止します (Phaser 互換の `pause`)。

`AudioBufferSourceNode` は再生位置を直接操作できないため、
playbackRate を 0 にして実質停止させます。

#### Returns

`void`

***

### play()

> **play**(`buffer`, `options?`): `void`

Defined in: [core/src/sound/SoundManager.ts:318](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L318)

再生を開始します。

#### Parameters

##### buffer

`AudioBuffer`

再生する音声データ

##### options?

[`PlayOptions`](../interfaces/PlayOptions.md)

再生の指定

#### Returns

`void`

***

### resume()

> **resume**(): `void`

Defined in: [core/src/sound/SoundManager.ts:436](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L436)

一時停止を解除します (Phaser 互換の `resume`)。

#### Returns

`void`

***

### setRate()

> **setRate**(`value`): `void`

Defined in: [core/src/sound/SoundManager.ts:448](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L448)

再生速度を変更します (Phaser 互換の `setRate`)。
一時停止中の場合は解除時に適用する値を更新します。

#### Parameters

##### value

`number`

#### Returns

`void`

***

### setSeek()

> **setSeek**(`seconds`): `void`

Defined in: [core/src/sound/SoundManager.ts:464](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L464)

再生位置を変更します (Phaser 互換の `setSeek`)。

`AudioBufferSourceNode` の再生位置は start() の offset 引数でのみ
指定できるため、**停止中のみ**有効です。

#### Parameters

##### seconds

`number`

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [core/src/sound/SoundManager.ts:400](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L400)

#### Returns

`void`

***

### updateFade()

> **updateFade**(`now`): `void`

Defined in: [core/src/sound/SoundManager.ts:389](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/sound/SoundManager.ts#L389)

フェードインを進めます。
SoundManager から毎フレーム 1 回だけ呼ばれます。

#### Parameters

##### now

`number`

AudioContext の現在時刻

#### Returns

`void`
