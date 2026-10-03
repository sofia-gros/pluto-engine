[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / AnimationManager

# Class: AnimationManager

Defined in: [core/src/anim/AnimationManager.ts:40](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L40)

## Constructors

### Constructor

> **new AnimationManager**(`arena`, `maxAnims?`): `AnimationManager`

Defined in: [core/src/anim/AnimationManager.ts:81](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L81)

#### Parameters

##### arena

[`InstanceBufferArena`](InstanceBufferArena.md)

##### maxAnims?

`number` = `10000`

#### Returns

`AnimationManager`

## Properties

### active

> `readonly` **active**: `Uint8Array`

Defined in: [core/src/anim/AnimationManager.ts:50](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L50)

***

### animId

> `readonly` **animId**: `Int32Array`

Defined in: [core/src/anim/AnimationManager.ts:52](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L52)

***

### capacity

> `readonly` **capacity**: `number`

Defined in: [core/src/anim/AnimationManager.ts:41](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L41)

***

### currentFrameIdx

> `readonly` **currentFrameIdx**: `Int32Array`

Defined in: [core/src/anim/AnimationManager.ts:53](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L53)

***

### elapsed

> `readonly` **elapsed**: `Float32Array`

Defined in: [core/src/anim/AnimationManager.ts:55](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L55)

***

### entityId

> `readonly` **entityId**: `Int32Array`

Defined in: [core/src/anim/AnimationManager.ts:51](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L51)

***

### paused

> `readonly` **paused**: `Uint8Array`

Defined in: [core/src/anim/AnimationManager.ts:57](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L57)

一時停止中か。update() では時間を進めない

***

### refFrameDuration

> `readonly` **refFrameDuration**: `Float32Array`

Defined in: [core/src/anim/AnimationManager.ts:66](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L66)

アニメーション定義テーブルです。refFrameDuration の単位は秒です。

***

### refFramesLength

> `readonly` **refFramesLength**: `Int32Array`

Defined in: [core/src/anim/AnimationManager.ts:62](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L62)

***

### refFramesPtr

> `readonly` **refFramesPtr**: `Int32Array`

Defined in: [core/src/anim/AnimationManager.ts:68](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L68)

***

### refRepeat

> `readonly` **refRepeat**: `Int32Array`

Defined in: [core/src/anim/AnimationManager.ts:67](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L67)

***

### repeatCount

> `readonly` **repeatCount**: `Int32Array`

Defined in: [core/src/anim/AnimationManager.ts:54](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L54)

***

### reverse

> `readonly` **reverse**: `Uint8Array`

Defined in: [core/src/anim/AnimationManager.ts:59](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L59)

逆再生中か (playReverse で立てます)

## Methods

### clear()

> **clear**(): `void`

Defined in: [core/src/anim/AnimationManager.ts:435](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L435)

#### Returns

`void`

***

### create()

> **create**(`configs`): `void`

Defined in: [core/src/anim/AnimationManager.ts:111](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L111)

アニメーションを定義します。配列を渡すことで複数同時定義が可能です。

#### Parameters

##### configs

[`AnimationConfig`](../interfaces/AnimationConfig.md) \| [`AnimationConfig`](../interfaces/AnimationConfig.md)[]

#### Returns

`void`

***

### getAnimState()

> **getAnimState**(`entityId`): [`AnimState`](AnimState.md)

Defined in: [core/src/anim/AnimationManager.ts:252](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L252)

アリーナ ID に対する AnimState ハンドルを返します (Phaser 互換の `sprite.anims`)。

再生していない場合は無効なハンドル (slot = -1) を返します。
毎フレーム new しないよう、内部配列を使い回します。

#### Parameters

##### entityId

`number`

#### Returns

[`AnimState`](AnimState.md)

***

### getSlot()

> **getSlot**(`entityId`): `number`

Defined in: [core/src/anim/AnimationManager.ts:178](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L178)

再生スロット番号から、そのエンティティの現在のスロットを探します。

#### Parameters

##### entityId

`number`

#### Returns

`number`

再生中であればスロット番号、未再生なら -1

走査のみで GC は発生しません。Flyweight (AnimState) は
「アリーナ ID」ではなくこのスロット番号を保持します。

***

### getSlotFrameIndex()

> **getSlotFrameIndex**(`slot`): `number`

Defined in: [core/src/anim/AnimationManager.ts:381](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L381)

スロットの現在のコマ位置

#### Parameters

##### slot

`number`

#### Returns

`number`

***

### getSlotFrameLength()

> **getSlotFrameLength**(`slot`): `number`

Defined in: [core/src/anim/AnimationManager.ts:386](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L386)

スロットの総コマ数

#### Parameters

##### slot

`number`

#### Returns

`number`

***

### getSlotProgress()

> **getSlotProgress**(`slot`): `number`

Defined in: [core/src/anim/AnimationManager.ts:395](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L395)

スロットの進捗率 (0〜1)。
現在コマとコマ時間から算出します。逆再生は 1 から 0 へ進みます。

#### Parameters

##### slot

`number`

#### Returns

`number`

***

### hasKey()

> **hasKey**(`key`): `boolean`

Defined in: [core/src/anim/AnimationManager.ts:144](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L144)

定義済みアニメーションのキー一覧を返します。

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### isSlotActive()

> **isSlotActive**(`slot`): `boolean`

Defined in: [core/src/anim/AnimationManager.ts:366](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L366)

スロットが再生中か

#### Parameters

##### slot

`number`

#### Returns

`boolean`

***

### isSlotPaused()

> **isSlotPaused**(`slot`): `boolean`

Defined in: [core/src/anim/AnimationManager.ts:371](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L371)

スロットが一時停止中か

#### Parameters

##### slot

`number`

#### Returns

`boolean`

***

### isSlotReverse()

> **isSlotReverse**(`slot`): `boolean`

Defined in: [core/src/anim/AnimationManager.ts:376](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L376)

スロットが逆再生中か

#### Parameters

##### slot

`number`

#### Returns

`boolean`

***

### pauseSlot()

> **pauseSlot**(`slot`): `void`

Defined in: [core/src/anim/AnimationManager.ts:410](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L410)

スロットを一時停止します

#### Parameters

##### slot

`number`

#### Returns

`void`

***

### play()

> **play**(`id`, `key`, `ignoreIfPlaying?`): [`AnimState`](AnimState.md)

Defined in: [core/src/anim/AnimationManager.ts:156](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L156)

アリーナ ID を指定してアニメーションを再生します。

#### Parameters

##### id

`number`

アリーナの ID

##### key

`string`

アニメーションキー

##### ignoreIfPlaying?

`boolean` = `false`

true の場合、既に別のアニメーションを再生中なら何もしない

#### Returns

[`AnimState`](AnimState.md)

AnimState ハンドル。キーが未定義やスロット枯渇なら null

***

### playReverse()

> **playReverse**(`id`, `key`, `ignoreIfPlaying?`): [`AnimState`](AnimState.md)

Defined in: [core/src/anim/AnimationManager.ts:165](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L165)

アリーナ ID を指定して逆再生します (Phaser 互換の `playReverse`)。
最終コマから先頭へ戻ります。

#### Parameters

##### id

`number`

##### key

`string`

##### ignoreIfPlaying?

`boolean` = `false`

#### Returns

[`AnimState`](AnimState.md)

***

### resumeSlot()

> **resumeSlot**(`slot`): `void`

Defined in: [core/src/anim/AnimationManager.ts:415](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L415)

スロットの一時停止を解除します

#### Parameters

##### slot

`number`

#### Returns

`void`

***

### setSlotReverse()

> **setSlotReverse**(`slot`, `reverse`): `void`

Defined in: [core/src/anim/AnimationManager.ts:423](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L423)

スロットの再生方向を切り替えます。
逆再生中に false を渡すと正再生に戻ります。

#### Parameters

##### slot

`number`

##### reverse

`boolean`

#### Returns

`void`

***

### stop()

> **stop**(`id`): `void`

Defined in: [core/src/anim/AnimationManager.ts:358](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L358)

特定のアリーナ ID の再生を停止します。

#### Parameters

##### id

`number`

#### Returns

`void`

***

### stopSlot()

> **stopSlot**(`slot`): `void`

Defined in: [core/src/anim/AnimationManager.ts:431](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L431)

スロットを即座に終了します (Flyweight の `stop`)。
stop(entityId) と違い、走査なしで直接解放します。

#### Parameters

##### slot

`number`

#### Returns

`void`

***

### update()

> **update**(`dt`): `void`

Defined in: [core/src/anim/AnimationManager.ts:281](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/anim/AnimationManager.ts#L281)

#### Parameters

##### dt

`number`

#### Returns

`void`
