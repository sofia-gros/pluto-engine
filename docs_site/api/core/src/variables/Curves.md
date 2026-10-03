[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Curves

# Variable: Curves

> `const` **Curves**: `object`

Defined in: [core/src/math/Curves.ts:49](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/math/Curves.ts#L49)

## Type Declaration

### \_arcTable()

> `readonly` **\_arcTable**(`curve`, `samples`, `out?`): `Float32Array`

累積弧長テーブルを作ります。

#### Parameters

##### curve

[`CurveInput`](../type-aliases/CurveInput.md)

##### samples

`number`

##### out?

`Float32Array`\<`ArrayBuffer`\> = `ARC_SCRATCH`

`samples + 1` 要素のバッファ。cum[0] = 0

#### Returns

`Float32Array`

`out` と同じ参照

### \_pointCatmullRom()

> `readonly` **\_pointCatmullRom**(`p`, `t`, `out`): [`CurveOut`](../type-aliases/CurveOut.md)

#### Parameters

##### p

[`CurvePointLike`](../type-aliases/CurvePointLike.md)

##### t

`number`

##### out

[`CurveOut`](../type-aliases/CurveOut.md)

#### Returns

[`CurveOut`](../type-aliases/CurveOut.md)

### \_pointCubic()

> `readonly` **\_pointCubic**(`p`, `t`, `out`): [`CurveOut`](../type-aliases/CurveOut.md)

#### Parameters

##### p

[`CurvePointLike`](../type-aliases/CurvePointLike.md)

##### t

`number`

##### out

[`CurveOut`](../type-aliases/CurveOut.md)

#### Returns

[`CurveOut`](../type-aliases/CurveOut.md)

### \_pointLine()

> `readonly` **\_pointLine**(`p`, `t`, `out`): [`CurveOut`](../type-aliases/CurveOut.md)

#### Parameters

##### p

[`CurvePointLike`](../type-aliases/CurvePointLike.md)

##### t

`number`

##### out

[`CurveOut`](../type-aliases/CurveOut.md)

#### Returns

[`CurveOut`](../type-aliases/CurveOut.md)

### \_pointQuadratic()

> `readonly` **\_pointQuadratic**(`p`, `t`, `out`): [`CurveOut`](../type-aliases/CurveOut.md)

#### Parameters

##### p

[`CurvePointLike`](../type-aliases/CurvePointLike.md)

##### t

`number`

##### out

[`CurveOut`](../type-aliases/CurveOut.md)

#### Returns

[`CurveOut`](../type-aliases/CurveOut.md)

### \_pointSpline()

> `readonly` **\_pointSpline**(`p`, `t`, `out`): [`CurveOut`](../type-aliases/CurveOut.md)

#### Parameters

##### p

[`CurvePointLike`](../type-aliases/CurvePointLike.md)

##### t

`number`

##### out

[`CurveOut`](../type-aliases/CurveOut.md)

#### Returns

[`CurveOut`](../type-aliases/CurveOut.md)

### \_requiredPoints()

> `readonly` **\_requiredPoints**(`kind`): `number`

この種別が必要とする制御点数。

制御点数が足りないカーブを作らないために [Path.addCurve](../classes/Path.md#addcurve) から参照します。

#### Parameters

##### kind

`number`

#### Returns

`number`

### from()

> `readonly` **from**(`points`, `kind`): [`CurveInput`](../type-aliases/CurveInput.md)

制御点からカブを構築します。

#### Parameters

##### points

[`CurvePointLike`](../type-aliases/CurvePointLike.md)

制御点列

##### kind

[`CurveKindValue`](../type-aliases/CurveKindValue.md)

[CurveKind](CurveKind.md)

#### Returns

[`CurveInput`](../type-aliases/CurveInput.md)

構築済みのカーブ

### getLength()

> `readonly` **getLength**(`curve`, `divisions?`): `number`

弧長を返します (Phaser 互換の `Curve.getLength`)。

数値積分（区分求積）で求めます。厳密な値が必要な場合は
`getLength` を `divisions` 较大的 で再計算してください。

#### Parameters

##### curve

[`CurveInput`](../type-aliases/CurveInput.md)

##### divisions?

`number` = `32`

#### Returns

`number`

### getPoint()

> `readonly` **getPoint**(`curve`, `t`, `out`): [`CurveOut`](../type-aliases/CurveOut.md)

`t` における点  `out` へ書き出します (Phaser 互換の `Curve.getPoint`)。

#### Parameters

##### curve

[`CurveInput`](../type-aliases/CurveInput.md)

##### t

`number`

0〜1 のパラメータ。範囲外は評価します（クランプしません）

##### out

[`CurveOut`](../type-aliases/CurveOut.md)

2 要素のバッファ

#### Returns

[`CurveOut`](../type-aliases/CurveOut.md)

### getSpacedPoints()

> `readonly` **getSpacedPoints**(`curve`, `divisions`, `out`): `number`

弧長で等間隔の点を `out` へ書き出します
(Phaser 互換の `Curve.getSpacedPoints`)。

等間隔にするには弧長が必要で、その計算は仮分割（数値積分）で行います。
正確な弧長は `getLength` を参照してください。

#### Parameters

##### curve

[`CurveInput`](../type-aliases/CurveInput.md)

##### divisions

`number`

分割数。0 なら 64 を使います

##### out

`Float32Array`

2 要素 × `divisions` のバッファ

#### Returns

`number`

書き出した点数

### getTangent()

> `readonly` **getTangent**(`curve`, `t`, `out`): [`CurveOut`](../type-aliases/CurveOut.md)

`t` における接線（微分）を `out` へ書き出します
(Phaser 互換の `Curve.getTangent`)。

微分が 0 の場合は (0, 0) を返します。

#### Parameters

##### curve

[`CurveInput`](../type-aliases/CurveInput.md)

##### t

`number`

##### out

[`CurveOut`](../type-aliases/CurveOut.md)

#### Returns

[`CurveOut`](../type-aliases/CurveOut.md)
