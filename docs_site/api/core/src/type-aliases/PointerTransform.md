[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / PointerTransform

# Type Alias: PointerTransform

> **PointerTransform** = (`clientX`, `clientY`, `out`) => `void`

Defined in: [core/src/input/InputManager.ts:10](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/input/InputManager.ts#L10)

## Parameters

### clientX

`number`

### clientY

`number`

### out

`Float32Array`

## Returns

`void`

## File

InputManager.ts

## Description

Ebitengine スタイルの同期クエリを提供する入力マネージャー。
DOM イベントから非同期に受け取った状態を、毎フレームの update() 時にラッチし、
ゲームロジック中に入力状態が途中で変わることを防ぎます。
キーボード、ポインタ (マウス/タッチ)、ゲームパッドに対応します。
