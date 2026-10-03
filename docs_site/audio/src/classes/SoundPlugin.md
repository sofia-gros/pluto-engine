[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [audio/src](../README.md) / SoundPlugin

# Class: SoundPlugin

Defined in: [audio/src/SoundPlugin.ts:14](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/audio/src/SoundPlugin.ts#L14)

## Implements

- [`Plugin`](../../../core/src/interfaces/Plugin.md)

## Constructors

### Constructor

> **new SoundPlugin**(`config?`): `SoundPlugin`

Defined in: [audio/src/SoundPlugin.ts:19](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/audio/src/SoundPlugin.ts#L19)

#### Parameters

##### config?

[`AudioConfig`](../../../core/src/interfaces/AudioConfig.md)

#### Returns

`SoundPlugin`

## Properties

### soundManager

> **soundManager**: [`SoundManager`](../../../core/src/classes/SoundManager.md)

Defined in: [audio/src/SoundPlugin.ts:15](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/audio/src/SoundPlugin.ts#L15)

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [audio/src/SoundPlugin.ts:42](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/audio/src/SoundPlugin.ts#L42)

シーン破棄時に呼ばれます

#### Returns

`void`

#### Implementation of

[`Plugin`](../../../core/src/interfaces/Plugin.md).[`destroy`](../../../core/src/interfaces/Plugin.md#destroy)

***

### init()

> **init**(`scene`): `void`

Defined in: [audio/src/SoundPlugin.ts:23](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/audio/src/SoundPlugin.ts#L23)

プラグインの初期化時に呼ばれます

#### Parameters

##### scene

[`Scene`](../../../core/src/classes/Scene.md)

#### Returns

`void`

#### Implementation of

[`Plugin`](../../../core/src/interfaces/Plugin.md).[`init`](../../../core/src/interfaces/Plugin.md#init)

***

### update()

> **update**(): `void`

Defined in: [audio/src/SoundPlugin.ts:30](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/audio/src/SoundPlugin.ts#L30)

毎フレームの可変更新時に呼ばれます

#### Returns

`void`

#### Implementation of

[`Plugin`](../../../core/src/interfaces/Plugin.md).[`update`](../../../core/src/interfaces/Plugin.md#update)
