[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Tween

# Class: Tween

Defined in: [core/src/tween/Tween.ts:21](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L21)

## Constructors

### Constructor

> **new Tween**(`id`, `manager`): `Tween`

Defined in: [core/src/tween/Tween.ts:27](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L27)

#### Parameters

##### id

`number`

##### manager

[`TweenManager`](TweenManager.md)

#### Returns

`Tween`

## Properties

### id

> **id**: `number`

Defined in: [core/src/tween/Tween.ts:23](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L23)

TweenManager 内のグループ ID。`stop` 後は -1 になる

## Accessors

### duration

#### Get Signature

> **get** **duration**(): `number`

Defined in: [core/src/tween/Tween.ts:66](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L66)

所要時間 (ミリ秒)

##### Returns

`number`

***

### elapsed

#### Get Signature

> **get** **elapsed**(): `number`

Defined in: [core/src/tween/Tween.ts:61](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L61)

経過時間 (ミリ秒)

##### Returns

`number`

***

### isDestroyed

#### Get Signature

> **get** **isDestroyed**(): `boolean`

Defined in: [core/src/tween/Tween.ts:51](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L51)

解放済みか (Phaser 互換の `isDestroyed`)

##### Returns

`boolean`

***

### isPaused

#### Get Signature

> **get** **isPaused**(): `boolean`

Defined in: [core/src/tween/Tween.ts:46](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L46)

一時停止中か (Phaser 互換の `isPaused`)

##### Returns

`boolean`

***

### isPlaying

#### Get Signature

> **get** **isPlaying**(): `boolean`

Defined in: [core/src/tween/Tween.ts:41](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L41)

再生中か (Phaser 互換の `isPlaying`)。
一時停止中も true のままです。

##### Returns

`boolean`

***

### isValid

#### Get Signature

> **get** **isValid**(): `boolean`

Defined in: [core/src/tween/Tween.ts:33](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L33)

ハンドルとして有効か (まだ動いているか)

##### Returns

`boolean`

***

### progress

#### Get Signature

> **get** **progress**(): `number`

Defined in: [core/src/tween/Tween.ts:56](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L56)

進捗率 (0〜1)

##### Returns

`number`

## Methods

### getProgress()

> **getProgress**(): `number`

Defined in: [core/src/tween/Tween.ts:71](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L71)

進捗率 (0〜1)

#### Returns

`number`

***

### pause()

> **pause**(): `this`

Defined in: [core/src/tween/Tween.ts:76](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L76)

一時停止します。経過時間は保持されます。

#### Returns

`this`

***

### play()

> **play**(): `this`

Defined in: [core/src/tween/Tween.ts:93](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L93)

再生を開始します。

停止済みのハンドルに対しては no-op です。Phaser と違い
同じ設定で作り直すことはしません (SoA の状態は失われています)。

#### Returns

`this`

***

### reset()

> **reset**(): `this`

Defined in: [core/src/tween/Tween.ts:113](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L113)

先頭へ戻します (Phaser 互換の `reset`)。
経過時間・方向・繰り返し回数を初期状態に戻し、開始値へスナップします。

#### Returns

`this`

***

### resume()

> **resume**(): `this`

Defined in: [core/src/tween/Tween.ts:82](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L82)

一時停止を解除します。

#### Returns

`this`

***

### seek()

> **seek**(`ms`): `this`

Defined in: [core/src/tween/Tween.ts:122](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L122)

指定ミリ秒位置まで進めます (Phaser 互換の `seek`)。
発火はしません。

#### Parameters

##### ms

`number`

#### Returns

`this`

***

### stop()

> **stop**(): `this`

Defined in: [core/src/tween/Tween.ts:101](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/tween/Tween.ts#L101)

停止します (Phaser 互換の `stop`)。onComplete は呼びません。
ハンドル自身も無効になります。二重停止しても安全です。

#### Returns

`this`
