[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / LoaderEvents

# Interface: LoaderEvents

Defined in: [core/src/loader/LoaderManager.ts:83](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L83)

LoaderManager が発火するイベント。

## Properties

### complete

> **complete**: () => `void`

Defined in: [core/src/loader/LoaderManager.ts:89](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L89)

キューが空になって全部終わった (キューが空のまま開始した場合も発火します)

#### Returns

`void`

***

### filecomplete

> **filecomplete**: (`key`, `type`) => `void`

Defined in: [core/src/loader/LoaderManager.ts:85](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L85)

ファイル 1 件の読み込みが完了した

#### Parameters

##### key

`string`

##### type

[`AssetType`](../type-aliases/AssetType.md)

#### Returns

`void`

***

### progress

> **progress**: (`value`) => `void`

Defined in: [core/src/loader/LoaderManager.ts:87](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/LoaderManager.ts#L87)

進捗が動いた

#### Parameters

##### value

[`LoadProgress`](LoadProgress.md)

#### Returns

`void`
