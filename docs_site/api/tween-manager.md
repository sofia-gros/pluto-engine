---
title: TweenManager
---

# TweenManager

## Properties

### `capacity`

**Type:** `number`



### `active`

**Type:** `Uint8Array&lt;ArrayBufferLike&gt;`



### `entityId`

**Type:** `Int32Array&lt;ArrayBufferLike&gt;`



### `propType`

**Type:** `Uint8Array&lt;ArrayBufferLike&gt;`



### `startVal`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `endVal`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `duration`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `elapsed`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`



### `delay`

**Type:** `Float32Array&lt;ArrayBufferLike&gt;`

遅延 (ミリ秒)

### `easeKind`

**Type:** `Uint8Array&lt;ArrayBufferLike&gt;`

イージングの種類 (EaseKind)

### `yoyo`

**Type:** `Uint8Array&lt;ArrayBufferLike&gt;`

往復フラグ (0 = 通常、1 = yoyo)

### `direction`

**Type:** `Uint8Array&lt;ArrayBufferLike&gt;`

現在の方向 (0 = 始点から終点、1 = 終点から始点)

### `repeatLeft`

**Type:** `Int32Array&lt;ArrayBufferLike&gt;`

残り繰り返し回数 (-1 = 無限)

### `groupId`

**Type:** `Int32Array&lt;ArrayBufferLike&gt;`

グループ ID。複数プロパティを 1 つの Group として管理します

### `started`

**Type:** `Uint8Array&lt;ArrayBufferLike&gt;`

onStart を発火済みかどうか。0 なら未発火

### `paused`

**Type:** `Uint8Array&lt;ArrayBufferLike&gt;`

一時停止中か。update() では時間を進めない

## Methods

### `add(config: import("A:/Project/plute-engine/packages/core/src/tween/TweenManager").TweenConfig)`

**Returns:** `import("A:/Project/plute-engine/packages/core/src/tween/Tween").Tween`

Phaser 互換の `this.tweens.add({ targets, ... })` を受け付けます。

既存の SoA をそのまま使い、1 プロパティにつき 1 スロットを確保します。
`props` に 2 つ指定すれば 2 スロットが確保され、常に同じ速度で同期します。

### `chain(configs: import("A:/Project/plute-engine/packages/core/src/tween/TweenManager").TweenConfig[])`

**Returns:** `import("A:/Project/plute-engine/packages/core/src/tween/Tween").Tween`

複数の設定を順番に実行するチェーンを作ります (Phaser の Chain)。

前の設定が完了してから次を開始するため、チェーンの実行中は
同時に動くスロットは 1 グループ分だけです。

### `killTweensOf(target: number | import("A:/Project/plute-engine/packages/core/src/tween/TweenManager").TweenTarget)`

**Returns:** `number`

対象が持つトゥイーンを全て停止します (Phaser 互換の killTweensOf)。

### `killTweensOfGroup(group: number | import("A:/Project/plute-engine/packages/core/src/tween/Tween").Tween)`

**Returns:** `number`

グループ ID 指定でトゥイーンを全て停止します (Phaser 互換の killTweensOfGroup)。

`add` / `chain` が返す Tween ハンドルもそのまま渡せます。

### `isGroupActive(groupId: number)`

**Returns:** `boolean`

グループ ID に属するスロットが 1 つでも生存しているか

### `isGroupPlaying(groupId: number)`

**Returns:** `boolean`

グループが再生中か (active と同義。Phaser 互換の別名)

### `isGroupPaused(groupId: number)`

**Returns:** `boolean`

グループが一時停止中か。
グループ内のスロットが 1 つでも paused なら true とします。

### `getGroupProgress(groupId: number)`

**Returns:** `number`

グループの進捗率 (0〜1) を返します。

複数スロットがあるグループでは、平均値ではなく
「最も進んでいるスロット」を返します。Phaser の
`getProgress()` が全プロパティ共通の 1 値を返す挙動に合わせています。
duration が 0 の場合は 0 を返します。

### `getGroupElapsed(groupId: number)`

**Returns:** `number`

グループの経過時間 (ミリ秒) を返します。
複数スロットがある場合は最大値を返します。

### `getGroupDuration(groupId: number)`

**Returns:** `number`

グループの所要時間 (ミリ秒)。複数スロットでは最大値。

### `pauseGroup(groupId: number)`

**Returns:** `void`

グループ内の全スロットを一時停止します

### `resumeGroup(groupId: number)`

**Returns:** `void`

グループ内の全スロットの一時停止を解除します

### `stopGroup(groupId: number)`

**Returns:** `number`

グループを停止します (Phaser 互換の `stop`)。
onComplete は呼びません。

### `resetGroup(groupId: number)`

**Returns:** `void`

グループを先頭に戻します (Phaser 互換の `reset`)。
経過時間・方向・繰り返し回数を初期状態に戻し、値を即座に適用します。

### `seekGroup(groupId: number, ms: number)`

**Returns:** `void`

グループを指定ミリ秒位置まで進めます (Phaser 互換の `seek`)。

発火はさせず、値を適用したうえで次の update で継続します。
yoyo や繰り返しの方向は考慮せず、単純な線形の位置に置きます。

### `free(id: number)`

**Returns:** `void`

トゥイーンを解放します。

### `update(dt: number)`

**Returns:** `void`

全てのトゥイーンを更新し、エンティティのプロパティに適用します。

### `clear()`

**Returns:** `void`

実行中の全トゥイーンを解放し、フリーリストを初期状態へ戻します。

