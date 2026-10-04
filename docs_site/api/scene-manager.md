---
title: SceneManager
---

# SceneManager

## Properties

### `registry`

**Type:** `import("A:/Project/plute-engine/packages/core/src/events/DataRegistry").DataRegistry`

全シーンで共有するグローバルデータストア。
シーンを跨いでスコアや進行度を渡す場合に使います。

## Methods

### `add(key: string, sceneClass: new () =&gt; import("A:/Project/plute-engine/packages/core/src/index").Scene, autoStart?: boolean)`

**Returns:** `void`



### `isActive(key: string)`

**Returns:** `boolean`

シーンが存在するか確認します (Phaser 互換の this.scene.isActive)。

### `get(key: string)`

**Returns:** `import("A:/Project/plute-engine/packages/core/src/index").Scene | null`

シーンを取得します (Phaser 互換の this.scene.get)。

### `start(key: string)`

**Returns:** `void`

シーンを開始します (Phaser 互換の this.scene.start)。

`preload()` でキューに積まれたアセットがある場合は読み込みを待ってから
`create()` を呼びます。キューが空 (preload を使わないシーン) なら
await せずに同期的に進むので、既存の挙動は変わりません。

### `stop(key: string)`

**Returns:** `void`

シーンを停止します (Phaser 互換の this.scene.stop)。

破棄はせずに一時停止させ、start() で再開できるようにします。

### `restart(key: string)`

**Returns:** `void`

シーンを再初期化して開始します (Phaser 互換の this.scene.restart)。

一時停止状態を解除してから作り直します。

### `pause(key?: string | undefined)`

**Returns:** `void`

シーンを一時停止します (Phaser 互換の this.scene.pause)。

### `resume(key?: string | undefined)`

**Returns:** `void`

シーンを再開します (Phaser 互換の this.scene.resume)。

### `switch(key: string)`

**Returns:** `void`



### `setOverlay(key: string | null)`

**Returns:** `void`

HUD として前面で同時に動作させるシーンを登録します。

### `getKeys()`

**Returns:** `string[]`

登録済みのシーンキーを返します。

### `pauseAll()`

**Returns:** `void`

全シーンを停止します。

### `resumeAll()`

**Returns:** `void`



### `fixedUpdate(fixedDt: number)`

**Returns:** `void`

固定ステップを能動シーンと前面シーンへ配信します。

### `update(dt: number)`

**Returns:** `void`

可変フレームの更新を能動シーンと前面シーンへ配信します。

