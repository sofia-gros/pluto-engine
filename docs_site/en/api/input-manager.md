---
title: InputManager
---

# InputManager

## Properties

### `pointerX`

**Type:** `number`

変換後のワールド/キャンバス座標

### `pointerY`

**Type:** `number`



### `clientX`

**Type:** `number`

変換前の画面座標 (CSS ピクセル)

### `clientY`

**Type:** `number`



### `prevPointerX`

**Type:** `number`

前フレームのワールド座標。dx / dy の算出に使う

### `prevPointerY`

**Type:** `number`



### `downPointerX`

**Type:** `number`

ボタンが押された位置 (ワールド座標)

### `downPointerY`

**Type:** `number`



### `upPointerX`

**Type:** `number`

ボタンが離された位置 (ワールド座標)

### `upPointerY`

**Type:** `number`



### `pointerVelocityX`

**Type:** `number`

移動速度 (ワールド座標 / 秒)

### `pointerVelocityY`

**Type:** `number`



### `worldPointerX`

**Type:** `number`



### `worldPointerY`

**Type:** `number`



### `pointerDistance`

**Type:** `number`

ボタン押下からの累積移動距離 (ワールド座標)

### `pointerAngle`

**Type:** `number`

現在の移動方向 (ラジアン、+X 方向が 0)

### `pointerId`

**Type:** `number`

ポインタ ID。単一ポインタのため常に 0

### `pointerTransform`

**Type:** `import("A:/Project/plute-engine/packages/core/src/input/InputManager").PointerTransform | null`

画面座標からゲーム座標へ変換する関数。
ScaleManager が設定し、未設定の場合は画面座標をそのまま渡します。

## Methods

### `attach(target?: GlobalEventHandlers)`

**Returns:** `void`



### `detach(target?: GlobalEventHandlers | undefined)`

**Returns:** `void`



### `update(dtSeconds?: number)`

**Returns:** `void`

毎フレーム 1 回、入力状態を更新します。

### `isKeyPressed(code: string)`

**Returns:** `boolean`



### `isKeyJustPressed(code: string)`

**Returns:** `boolean`



### `isKeyJustReleased(code: string)`

**Returns:** `boolean`



### `getKeyTimeDown(code: string)`

**Returns:** `number`



### `getKeyTimeUp(code: string)`

**Returns:** `number`



### `getKeyDuration(code: string)`

**Returns:** `number`



### `addKey(code: string)`

**Returns:** `import("A:/Project/plute-engine/packages/core/src/input/InputManager").Key`

キーの参照ハンドルを生成します (Phaser 互換の this.input.keyboard.addKey)。

生成された Key は内部の Set と同じ状態を見ます。
状態自体を複製しないため、毎フレーム new も発生しません。
同じ code を複数回要求しても同じ Key インスタンスを返します。

### `addKeys(codes: string | string[])`

**Returns:** `import("A:/Project/plute-engine/packages/core/src/input/InputManager").Key[]`

複数のキーをまとめて生成します (Phaser 互換の addKeys)。

### `createCursorKeys()`

**Returns:** `import("A:/Project/plute-engine/packages/core/src/input/InputManager").CursorKeys`

矢印キーの Key 群を生成します (Phaser 互換の createCursorKeys)。

### `addPointer(_id?: number | undefined)`

**Returns:** `import("A:/Project/plute-engine/packages/core/src/input/InputManager").Pointer`

ポインタを追加します (Phaser 互換の addPointer)。

pluto-engine は単一ポインタのみを扱うため、2 つ目以降は無視されます。
戻り値は常に this.primaryPointer です。

### `isPointerDown()`

**Returns:** `boolean`



### `isPointerJustPressed()`

**Returns:** `boolean`



### `isPointerJustReleased()`

**Returns:** `boolean`



### `isGamepadButtonPressed(padIndex: number, buttonIndex: number)`

**Returns:** `boolean`

ゲームパッドの指定ボタンが押されているか (buttonIndex: 0=A, 1=B など)

### `isGamepadButtonJustPressed(padIndex: number, buttonIndex: number)`

**Returns:** `boolean`

ゲームパッドのボタンが今フレームで押されたか。

### `isGamepadButtonJustReleased(padIndex: number, buttonIndex: number)`

**Returns:** `boolean`

ゲームパッドのボタンがこのフレームで離されたか。

### `getGamepadAxis(padIndex: number, axisIndex: number)`

**Returns:** `number`

ゲームパッドのアナログスティックの値を取得します

### `getGamepadCount()`

**Returns:** `number`

接続されているゲームパッドの数を返します。

### `getGamepadConnected(padIndex: number)`

**Returns:** `boolean`

指定スロットにゲームパッドが接続されているか。
Gamepad ハンドルからの参照用に公開しています。

### `getGamepadNative(padIndex: number)`

**Returns:** `Gamepad | null`

指定スロットのブラウザ Gamepad オブジェクトを返す。未接続なら null。
Gamepad ハンドルからの参照用に公開しています。

### `getGamepad(padIndex: number)`

**Returns:** `import("A:/Project/plute-engine/packages/core/src/input/InputManager").GamepadHandle | null`

指定インデックスの Gamepad ハンドルを返します (Phaser 互換の `getPad`)。

ハンドルは内部配列を使い回すため、同じインデックスでは常に同じ
インスタンスが返ります。接続されていない場合は null です。

### `getAllGamepads(out?: (import("A:/Project/plute-engine/packages/core/src/input/InputManager").GamepadHandle | null)[] | undefined)`

**Returns:** `(import("A:/Project/plute-engine/packages/core/src/input/InputManager").GamepadHandle | null)[]`

接続されているゲームパッドのハンドルをまとめて返します
(Phaser 互換の `getAll`)。

