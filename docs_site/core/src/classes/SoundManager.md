[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / SoundManager

# Class: SoundManager

Defined in: [core/src/sound/SoundManager.ts:510](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L510)

シーン単位のサウンドマネージャー。

Phaser の `this.sound` に対応するファサードです。
コンストラクタでは `AudioContext` を 1 度だけ作るので、
生成コストはシーン 1 あたり 1 回です。

## Constructors

### Constructor

> **new SoundManager**(`config?`): `SoundManager`

Defined in: [core/src/sound/SoundManager.ts:527](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L527)

#### Parameters

##### config?

[`AudioConfig`](../interfaces/AudioConfig.md) = `{}`

#### Returns

`SoundManager`

## Properties

### context

> `readonly` **context**: `AudioContext`

Defined in: [core/src/sound/SoundManager.ts:512](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L512)

Web Audio のコンテキスト

## Accessors

### count

#### Get Signature

> **get** **count**(): `number`

Defined in: [core/src/sound/SoundManager.ts:879](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L879)

キーが登録されている数

##### Returns

`number`

***

### listenerX

#### Get Signature

> **get** **listenerX**(): `number`

Defined in: [core/src/sound/SoundManager.ts:910](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L910)

リスナーの位置を設定します。

##### Returns

`number`

#### Set Signature

> **set** **listenerX**(`v`): `void`

Defined in: [core/src/sound/SoundManager.ts:913](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L913)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### listenerY

#### Get Signature

> **get** **listenerY**(): `number`

Defined in: [core/src/sound/SoundManager.ts:916](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L916)

##### Returns

`number`

#### Set Signature

> **set** **listenerY**(`v`): `void`

Defined in: [core/src/sound/SoundManager.ts:919](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L919)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### listenerZ

#### Get Signature

> **get** **listenerZ**(): `number`

Defined in: [core/src/sound/SoundManager.ts:922](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L922)

##### Returns

`number`

#### Set Signature

> **set** **listenerZ**(`v`): `void`

Defined in: [core/src/sound/SoundManager.ts:925](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L925)

##### Parameters

###### v

`number`

##### Returns

`void`

***

### mute

#### Get Signature

> **get** **mute**(): `boolean`

Defined in: [core/src/sound/SoundManager.ts:591](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L591)

全体のミュート状態

##### Returns

`boolean`

#### Set Signature

> **set** **mute**(`val`): `void`

Defined in: [core/src/sound/SoundManager.ts:594](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L594)

##### Parameters

###### val

`boolean`

##### Returns

`void`

***

### paused

#### Get Signature

> **get** **paused**(): `boolean`

Defined in: [core/src/sound/SoundManager.ts:628](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L628)

ポーズ中か

##### Returns

`boolean`

***

### playingCount

#### Get Signature

> **get** **playingCount**(): `number`

Defined in: [core/src/sound/SoundManager.ts:870](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L870)

再生中の総本数

##### Returns

`number`

***

### unlocked

#### Get Signature

> **get** **unlocked**(): `boolean`

Defined in: [core/src/sound/SoundManager.ts:609](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L609)

AudioContext が動作状態か (ユーザー操作で解除されたか)

##### Returns

`boolean`

***

### volume

#### Get Signature

> **get** **volume**(): `number`

Defined in: [core/src/sound/SoundManager.ts:576](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L576)

master gain の音量 0〜1

##### Returns

`number`

#### Set Signature

> **set** **volume**(`val`): `void`

Defined in: [core/src/sound/SoundManager.ts:579](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L579)

##### Parameters

###### val

`number`

##### Returns

`void`

## Methods

### add()

> **add**(`key`, `buffer`): `this`

Defined in: [core/src/sound/SoundManager.ts:662](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L662)

キー对应的音声データを登録します (Phaser の audio.add)。

#### Parameters

##### key

`string`

##### buffer

`AudioBuffer`

#### Returns

`this`

***

### destroy()

> **destroy**(): `void`

Defined in: [core/src/sound/SoundManager.ts:975](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L975)

シーン破棄時の後片付けです。
AudioContext を閉じて解放します。

#### Returns

`void`

***

### exists()

> **exists**(`key`): `boolean`

Defined in: [core/src/sound/SoundManager.ts:689](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L689)

キーが登録されているか

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### get()

> **get**(`key`): [`SoundHandle`](SoundHandle.md)

Defined in: [core/src/sound/SoundManager.ts:851](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L851)

再生中のハンドルを取得します (Phaser の this.sound.get)。

#### Parameters

##### key

`string`

#### Returns

[`SoundHandle`](SoundHandle.md)

***

### getVoiceByIndex()

> **getVoiceByIndex**(`index`): [`Voice`](Voice.md)

Defined in: [core/src/sound/SoundManager.ts:712](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L712)

プール内のインデックスから Voice を取得します (Flyweight 用)。

#### Parameters

##### index

`number`

#### Returns

[`Voice`](Voice.md)

範囲外なら null

***

### indexOfVoice()

> **indexOfVoice**(`voice`): `number`

Defined in: [core/src/sound/SoundManager.ts:721](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L721)

Voice をプール内のインデックスへ変換します (Flyweight 用)。

#### Parameters

##### voice

[`Voice`](Voice.md)

#### Returns

`number`

見つからなければ -1

***

### isPlaying()

> **isPlaying**(`key`): `boolean`

Defined in: [core/src/sound/SoundManager.ts:858](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L858)

そのキーが再生中か (Phaser の isPlaying)。

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### loadAudioData()

> **loadAudioData**(`key`, `audioData`): `Promise`\<`void`\>

Defined in: [core/src/sound/SoundManager.ts:673](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L673)

エンコード済み音声データを変換して登録します。

#### Parameters

##### key

`string`

登録キー

##### audioData

`ArrayBuffer`

エンコード済みの ArrayBuffer

#### Returns

`Promise`\<`void`\>

***

### pauseAll()

> **pauseAll**(): `this`

Defined in: [core/src/sound/SoundManager.ts:638](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L638)

再生中をサスペンドします。

AudioContext は 1 個しかないので、Voice ごとではなく context 全体をサスペンドします。
再生位置は保持されるため、再開しても続きから鳴ります。

#### Returns

`this`

***

### play()

> **play**(`key`, `config?`): [`SoundHandle`](SoundHandle.md)

Defined in: [core/src/sound/SoundManager.ts:756](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L756)

音声を再生します (Phaser の this.sound.play)。

**毎回の new は発生しません。** キーが違ってもハンドルは
使い回しのプール (`_handlePool`) から借り、内部の `voiceIndex` を
書き換えるだけなので、毎フレーム再生しても GC が発生しません。

#### Parameters

##### key

`string`

登録キー

##### config?

[`PlayOptions`](../interfaces/PlayOptions.md)

再生の指定

#### Returns

[`SoundHandle`](SoundHandle.md)

ハンドル。キーが未登録、またはプールが枯れている場合は null

***

### playAudioSprite()

> **playAudioSprite**(`key`, `config?`): [`SoundHandle`](SoundHandle.md)

Defined in: [core/src/sound/SoundManager.ts:799](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L799)

音量だけ変えた「別」として再生します (Phaser の playAudioSprite)。

返されたハンドルは 2 本目として管理されるので、
`stopByKey` などでまとめて止められます。

#### Parameters

##### key

`string`

##### config?

[`PlayOptions`](../interfaces/PlayOptions.md)

#### Returns

[`SoundHandle`](SoundHandle.md)

***

### playVoice()

> **playVoice**(`key`, `options?`): [`Voice`](Voice.md)

Defined in: [core/src/sound/SoundManager.ts:732](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L732)

内部用。キーを指定して Voice を再生します。
[SoundHandle.play](SoundHandle.md#play) から使います。

#### Parameters

##### key

`string`

##### options?

[`PlayOptions`](../interfaces/PlayOptions.md)

#### Returns

[`Voice`](Voice.md)

***

### remove()

> **remove**(`key`): `boolean`

Defined in: [core/src/sound/SoundManager.ts:683](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L683)

登録済みの音声を削除します (Phaser の audio.remove)。

#### Parameters

##### key

`string`

#### Returns

`boolean`

削除できたら true

***

### removeAll()

> **removeAll**(): `void`

Defined in: [core/src/sound/SoundManager.ts:894](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L894)

登録済み音声をすべて削除します (Phaser の removeAll)。

#### Returns

`void`

***

### resumeAll()

> **resumeAll**(): `this`

Defined in: [core/src/sound/SoundManager.ts:647](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L647)

ポーズを解除します。

#### Returns

`this`

***

### setConfig()

> **setConfig**(`config`): `void`

Defined in: [core/src/sound/SoundManager.ts:569](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L569)

構成値の変更を反映します。
既存の [setConfig](#setconfig) を Phaser 互換の命名へ揃えたものです。

#### Parameters

##### config

[`AudioConfig`](../interfaces/AudioConfig.md)

#### Returns

`void`

***

### setListenerPosition()

> **setListenerPosition**(`x`, `y`, `z?`): `this`

Defined in: [core/src/sound/SoundManager.ts:929](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L929)

#### Parameters

##### x

`number`

##### y

`number`

##### z?

`number` = `100`

#### Returns

`this`

***

### setMute()

> **setMute**(`val`): `this`

Defined in: [core/src/sound/SoundManager.ts:602](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L602)

全体をミュートします。
ミュート中も `play()` 自体は動き、 master gain だけを 0 にします。

#### Parameters

##### val

`boolean`

#### Returns

`this`

***

### setVolume()

> **setVolume**(`val`): `this`

Defined in: [core/src/sound/SoundManager.ts:584](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L584)

master gain の音量を設定します。

#### Parameters

##### val

`number`

#### Returns

`this`

***

### stopAll()

> **stopAll**(): `void`

Defined in: [core/src/sound/SoundManager.ts:886](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L886)

全ての再生を停止し、登録済み音声も削除します (Phaser の removeAll / stopAll)。

#### Returns

`void`

***

### stopByKey()

> **stopByKey**(`key`): `number`

Defined in: [core/src/sound/SoundManager.ts:834](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L834)

指定キーの再生を全部停止します (Phaser の stopByKey)。

#### Parameters

##### key

`string`

#### Returns

`number`

停止した本数

***

### unlock()

> **unlock**(): `this`

Defined in: [core/src/sound/SoundManager.ts:619](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L619)

ブラウザの自動再生ポリシーにより停止している AudioContext を再開します。

ブラウザの規約でユーザー操作orquないと呼べないため、
クリックなどのハンドラの中から呼ぶ想定です。

#### Returns

`this`

***

### update()

> **update**(`now?`): `void`

Defined in: [core/src/sound/SoundManager.ts:957](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/sound/SoundManager.ts#L957)

毎フレームの更新です。

フェードインを進め、終了したハンドルをテーブルから落とします。
new は発生しません。

#### Parameters

##### now?

`number`

AudioContext の現在時刻 (省略時は内部の値を使います)

#### Returns

`void`
