[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / TweenManager

# Class: TweenManager

Defined in: [core/src/tween/TweenManager.ts:80](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L80)

## Constructors

### Constructor

> **new TweenManager**(`arena`, `maxTweens?`): `TweenManager`

Defined in: [core/src/tween/TweenManager.ts:123](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L123)

#### Parameters

##### arena

[`InstanceBufferArena`](InstanceBufferArena.md)

##### maxTweens?

`number` = `10000`

#### Returns

`TweenManager`

## Properties

### active

> `readonly` **active**: `Uint8Array`

Defined in: [core/src/tween/TweenManager.ts:85](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L85)

***

### capacity

> `readonly` **capacity**: `number`

Defined in: [core/src/tween/TweenManager.ts:81](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L81)

***

### delay

> `readonly` **delay**: `Float32Array`

Defined in: [core/src/tween/TweenManager.ts:95](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L95)

遅延 (ミリ秒)

***

### direction

> `readonly` **direction**: `Uint8Array`

Defined in: [core/src/tween/TweenManager.ts:101](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L101)

現在の方向 (0 = 始点から終点、1 = 終点から始点)

***

### duration

> `readonly` **duration**: `Float32Array`

Defined in: [core/src/tween/TweenManager.ts:90](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L90)

***

### easeKind

> `readonly` **easeKind**: `Uint8Array`

Defined in: [core/src/tween/TweenManager.ts:97](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L97)

イージングの種類 (EaseKind)

***

### elapsed

> `readonly` **elapsed**: `Float32Array`

Defined in: [core/src/tween/TweenManager.ts:91](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L91)

***

### endVal

> `readonly` **endVal**: `Float32Array`

Defined in: [core/src/tween/TweenManager.ts:89](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L89)

***

### entityId

> `readonly` **entityId**: `Int32Array`

Defined in: [core/src/tween/TweenManager.ts:86](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L86)

***

### groupId

> `readonly` **groupId**: `Int32Array`

Defined in: [core/src/tween/TweenManager.ts:105](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L105)

グループ ID。複数プロパティを 1 つの Group として管理します

***

### paused

> `readonly` **paused**: `Uint8Array`

Defined in: [core/src/tween/TweenManager.ts:109](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L109)

一時停止中か。update() では時間を進めない

***

### propType

> `readonly` **propType**: `Uint8Array`

Defined in: [core/src/tween/TweenManager.ts:87](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L87)

***

### repeatLeft

> `readonly` **repeatLeft**: `Int32Array`

Defined in: [core/src/tween/TweenManager.ts:103](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L103)

残り繰り返し回数 (-1 = 無限)

***

### started

> `readonly` **started**: `Uint8Array`

Defined in: [core/src/tween/TweenManager.ts:107](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L107)

onStart を発火済みかどうか。0 なら未発火

***

### startVal

> `readonly` **startVal**: `Float32Array`

Defined in: [core/src/tween/TweenManager.ts:88](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L88)

***

### yoyo

> `readonly` **yoyo**: `Uint8Array`

Defined in: [core/src/tween/TweenManager.ts:99](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L99)

往復フラグ (0 = 通常、1 = yoyo)

## Accessors

### count

#### Get Signature

> **get** **count**(): `number`

Defined in: [core/src/tween/TweenManager.ts:374](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L374)

実行中のトゥイーン数 (Phaser 互換の getTweens().length)。

##### Returns

`number`

## Methods

### add()

> **add**(`config`): [`Tween`](Tween.md)

Defined in: [core/src/tween/TweenManager.ts:201](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L201)

Phaser 互換の `this.tweens.add({ targets, ... })` を受け付けます。

既存の SoA をそのまま使い、1 プロパティにつき 1 スロットを確保します。
`props` に 2 つ指定すれば 2 スロットが確保され、常に同じ速度で同期します。

#### Parameters

##### config

[`TweenConfig`](../interfaces/TweenConfig.md)

#### Returns

[`Tween`](Tween.md)

Tween ハンドル。killTweensOfGroup(handle.id) にも使えます

***

### chain()

> **chain**(`configs`): [`Tween`](Tween.md)

Defined in: [core/src/tween/TweenManager.ts:216](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L216)

複数の設定を順番に実行するチェーンを作ります (Phaser の Chain)。

前の設定が完了してから次を開始するため、チェーンの実行中は
同時に動くスロットは 1 グループ分だけです。

#### Parameters

##### configs

[`TweenConfig`](../interfaces/TweenConfig.md)[]

順番に実行する設定の配列

#### Returns

[`Tween`](Tween.md)

Tween ハンドル

***

### clear()

> **clear**(): `void`

Defined in: [core/src/tween/TweenManager.ts:757](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L757)

実行中の全トゥイーンを解放し、フリーリストを初期状態へ戻します。

#### Returns

`void`

***

### free()

> **free**(`id`): `void`

Defined in: [core/src/tween/TweenManager.ts:530](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L530)

トゥイーンを解放します。

#### Parameters

##### id

`number`

#### Returns

`void`

***

### getGroupDuration()

> **getGroupDuration**(`groupId`): `number`

Defined in: [core/src/tween/TweenManager.ts:451](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L451)

グループの所要時間 (ミリ秒)。複数スロットでは最大値。

#### Parameters

##### groupId

`number`

#### Returns

`number`

***

### getGroupElapsed()

> **getGroupElapsed**(`groupId`): `number`

Defined in: [core/src/tween/TweenManager.ts:440](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L440)

グループの経過時間 (ミリ秒) を返します。
複数スロットがある場合は最大値を返します。

#### Parameters

##### groupId

`number`

#### Returns

`number`

***

### getGroupProgress()

> **getGroupProgress**(`groupId`): `number`

Defined in: [core/src/tween/TweenManager.ts:421](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L421)

グループの進捗率 (0〜1) を返します。

複数スロットがあるグループでは、平均値ではなく
「最も進んでいるスロット」を返します。Phaser の
`getProgress()` が全プロパティ共通の 1 値を返す挙動に合わせています。
duration が 0 の場合は 0 を返します。

#### Parameters

##### groupId

`number`

#### Returns

`number`

***

### isGroupActive()

> **isGroupActive**(`groupId`): `boolean`

Defined in: [core/src/tween/TweenManager.ts:388](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L388)

グループ ID に属するスロットが 1 つでも生存しているか

#### Parameters

##### groupId

`number`

#### Returns

`boolean`

***

### isGroupPaused()

> **isGroupPaused**(`groupId`): `boolean`

Defined in: [core/src/tween/TweenManager.ts:405](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L405)

グループが一時停止中か。
グループ内のスロットが 1 つでも paused なら true とします。

#### Parameters

##### groupId

`number`

#### Returns

`boolean`

***

### isGroupPlaying()

> **isGroupPlaying**(`groupId`): `boolean`

Defined in: [core/src/tween/TweenManager.ts:397](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L397)

グループが再生中か (active と同義。Phaser 互換の別名)

#### Parameters

##### groupId

`number`

#### Returns

`boolean`

***

### killTweensOf()

> **killTweensOf**(`target`): `number`

Defined in: [core/src/tween/TweenManager.ts:340](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L340)

対象が持つトゥイーンを全て停止します (Phaser 互換の killTweensOf)。

#### Parameters

##### target

`number` \| [`TweenTarget`](../interfaces/TweenTarget.md)

#### Returns

`number`

停止したスロット数

***

### killTweensOfGroup()

> **killTweensOfGroup**(`group`): `number`

Defined in: [core/src/tween/TweenManager.ts:359](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L359)

グループ ID 指定でトゥイーンを全て停止します (Phaser 互換の killTweensOfGroup)。

`add` / `chain` が返す Tween ハンドルもそのまま渡せます。

#### Parameters

##### group

`number` \| [`Tween`](Tween.md)

#### Returns

`number`

停止したスロット数

***

### pauseGroup()

> **pauseGroup**(`groupId`): `void`

Defined in: [core/src/tween/TweenManager.ts:462](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L462)

グループ内の全スロットを一時停止します

#### Parameters

##### groupId

`number`

#### Returns

`void`

***

### resetGroup()

> **resetGroup**(`groupId`): `void`

Defined in: [core/src/tween/TweenManager.ts:496](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L496)

グループを先頭に戻します (Phaser 互換の `reset`)。
経過時間・方向・繰り返し回数を初期状態に戻し、値を即座に適用します。

#### Parameters

##### groupId

`number`

#### Returns

`void`

***

### resumeGroup()

> **resumeGroup**(`groupId`): `void`

Defined in: [core/src/tween/TweenManager.ts:470](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L470)

グループ内の全スロットの一時停止を解除します

#### Parameters

##### groupId

`number`

#### Returns

`void`

***

### seekGroup()

> **seekGroup**(`groupId`, `ms`): `void`

Defined in: [core/src/tween/TweenManager.ts:516](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L516)

グループを指定ミリ秒位置まで進めます (Phaser 互換の `seek`)。

発火はさせず、値を適用したうえで次の update で継続します。
yoyo や繰り返しの方向は考慮せず、単純な線形の位置に置きます。

#### Parameters

##### groupId

`number`

##### ms

`number`

#### Returns

`void`

***

### stopGroup()

> **stopGroup**(`groupId`): `number`

Defined in: [core/src/tween/TweenManager.ts:482](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L482)

グループを停止します (Phaser 互換の `stop`)。
onComplete は呼びません。

#### Parameters

##### groupId

`number`

#### Returns

`number`

停止したスロット数

***

### update()

> **update**(`dt`): `void`

Defined in: [core/src/tween/TweenManager.ts:616](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/tween/TweenManager.ts#L616)

全てのトゥイーンを更新し、エンティティのプロパティに適用します。

#### Parameters

##### dt

`number`

デルタタイム (ミリ秒)

#### Returns

`void`
