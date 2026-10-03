[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Plugin

# Interface: Plugin

Defined in: [core/src/scene/Plugin.ts:9](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Plugin.ts#L9)

## Methods

### destroy()?

> `optional` **destroy**(): `void`

Defined in: [core/src/scene/Plugin.ts:17](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Plugin.ts#L17)

シーン破棄時に呼ばれます

#### Returns

`void`

***

### fixedUpdate()?

> `optional` **fixedUpdate**(`fixedDt`): `void`

Defined in: [core/src/scene/Plugin.ts:15](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Plugin.ts#L15)

固定タイムステップの更新時に呼ばれます

#### Parameters

##### fixedDt

`number`

#### Returns

`void`

***

### init()?

> `optional` **init**(`scene`): `void`

Defined in: [core/src/scene/Plugin.ts:11](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Plugin.ts#L11)

プラグインの初期化時に呼ばれます

#### Parameters

##### scene

[`Scene`](../classes/Scene.md)

#### Returns

`void`

***

### update()?

> `optional` **update**(`dt`): `void`

Defined in: [core/src/scene/Plugin.ts:13](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Plugin.ts#L13)

毎フレームの可変更新時に呼ばれます

#### Parameters

##### dt

`number`

#### Returns

`void`
