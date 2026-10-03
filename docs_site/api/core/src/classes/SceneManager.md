[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / SceneManager

# Class: SceneManager

Defined in: [core/src/scene/SceneManager.ts:12](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L12)

## Constructors

### Constructor

> **new SceneManager**(`engine`): `SceneManager`

Defined in: [core/src/scene/SceneManager.ts:25](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L25)

#### Parameters

##### engine

[`PlutoEngine`](PlutoEngine.md)

#### Returns

`SceneManager`

## Properties

### registry

> `readonly` **registry**: [`DataRegistry`](DataRegistry.md)

Defined in: [core/src/scene/SceneManager.ts:23](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L23)

全シーンで共有するグローバルデータストア。
シーンを跨いでスコアや進行度を渡す場合に使います。

## Accessors

### activeScene

#### Get Signature

> **get** **activeScene**(): [`Scene`](Scene.md)

Defined in: [core/src/scene/SceneManager.ts:162](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L162)

##### Returns

[`Scene`](Scene.md)

***

### overlayScene

#### Get Signature

> **get** **overlayScene**(): [`Scene`](Scene.md)

Defined in: [core/src/scene/SceneManager.ts:166](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L166)

##### Returns

[`Scene`](Scene.md)

## Methods

### add()

> **add**(`key`, `sceneClass`, `autoStart?`): `void`

Defined in: [core/src/scene/SceneManager.ts:29](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L29)

#### Parameters

##### key

`string`

##### sceneClass

() => [`Scene`](Scene.md)

##### autoStart?

`boolean` = `false`

#### Returns

`void`

***

### fixedUpdate()

> **fixedUpdate**(`fixedDt`): `void`

Defined in: [core/src/scene/SceneManager.ts:196](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L196)

固定ステップを能動シーンと前面シーンへ配信します。

#### Parameters

##### fixedDt

`number`

#### Returns

`void`

***

### get()

> **get**(`key`): [`Scene`](Scene.md)

Defined in: [core/src/scene/SceneManager.ts:67](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L67)

シーンを取得します (Phaser 互換の this.scene.get)。

#### Parameters

##### key

`string`

#### Returns

[`Scene`](Scene.md)

***

### getKeys()

> **getKeys**(): `string`[]

Defined in: [core/src/scene/SceneManager.ts:173](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L173)

登録済みのシーンキーを返します。

#### Returns

`string`[]

***

### isActive()

> **isActive**(`key`): `boolean`

Defined in: [core/src/scene/SceneManager.ts:60](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L60)

シーンが存在するか確認します (Phaser 互換の this.scene.isActive)。

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### pause()

> **pause**(`key?`): `void`

Defined in: [core/src/scene/SceneManager.ts:126](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L126)

シーンを一時停止します (Phaser 互換の this.scene.pause)。

#### Parameters

##### key?

`string`

#### Returns

`void`

***

### pauseAll()

> **pauseAll**(): `void`

Defined in: [core/src/scene/SceneManager.ts:183](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L183)

全シーンを停止します。

#### Returns

`void`

***

### restart()

> **restart**(`key`): `void`

Defined in: [core/src/scene/SceneManager.ts:113](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L113)

シーンを再初期化して開始します (Phaser 互換の this.scene.restart)。

一時停止状態を解除してから作り直します。

#### Parameters

##### key

`string`

#### Returns

`void`

***

### resume()

> **resume**(`key?`): `void`

Defined in: [core/src/scene/SceneManager.ts:134](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L134)

シーンを再開します (Phaser 互換の this.scene.resume)。

#### Parameters

##### key?

`string`

#### Returns

`void`

***

### resumeAll()

> **resumeAll**(): `void`

Defined in: [core/src/scene/SceneManager.ts:188](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L188)

#### Returns

`void`

***

### setOverlay()

> **setOverlay**(`key`): `void`

Defined in: [core/src/scene/SceneManager.ts:149](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L149)

HUD として前面で同時に動作させるシーンを登録します。

#### Parameters

##### key

`string`

#### Returns

`void`

***

### start()

> **start**(`key`): `void`

Defined in: [core/src/scene/SceneManager.ts:78](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L78)

シーンを開始します (Phaser 互換の this.scene.start)。

`preload()` でキューに積まれたアセットがある場合は読み込みを待ってから
`create()` を呼びます。キューが空 (preload を使わないシーン) なら
await せずに同期的に進むので、既存の挙動は変わりません。

#### Parameters

##### key

`string`

#### Returns

`void`

***

### stop()

> **stop**(`key`): `void`

Defined in: [core/src/scene/SceneManager.ts:100](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L100)

シーンを停止します (Phaser 互換の this.scene.stop)。

破棄はせずに一時停止させ、start() で再開できるようにします。

#### Parameters

##### key

`string`

#### Returns

`void`

***

### switch()

> **switch**(`key`): `void`

Defined in: [core/src/scene/SceneManager.ts:139](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L139)

#### Parameters

##### key

`string`

#### Returns

`void`

***

### update()

> **update**(`dt`): `void`

Defined in: [core/src/scene/SceneManager.ts:204](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/scene/SceneManager.ts#L204)

可変フレームの更新を能動シーンと前面シーンへ配信します。

#### Parameters

##### dt

`number`

#### Returns

`void`
