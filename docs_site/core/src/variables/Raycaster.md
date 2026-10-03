[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Raycaster

# Variable: Raycaster

> `const` **Raycaster**: `object`

Defined in: [core/src/math/Raycaster.ts:70](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Raycaster.ts#L70)

## Type Declaration

### \_lineCircle()

> `readonly` **\_lineCircle**(`x1`, `y1`, `dx`, `dy`, `cx`, `cy`, `r`, `tolerance`, `out`, `base`): `boolean`

線分と 1 個の円の交差を 2 次方程式で判定します。

#### Parameters

##### x1

`number`

##### y1

`number`

##### dx

`number`

##### dy

`number`

##### cx

`number`

##### cy

`number`

##### r

`number`

##### tolerance

`number`

##### out

`Float32Array`

##### base

`number`

#### Returns

`boolean`

### \_lineRect()

> `readonly` **\_lineRect**(`x1`, `y1`, `dx`, `dy`, `rx`, `ry`, `rw`, `rh`, `tolerance`, `out`, `base`): `boolean`

線分と 1 個の矩形の交差を slab 法で判定します。

#### Parameters

##### x1

`number`

##### y1

`number`

##### dx

`number`

##### dy

`number`

##### rx

`number`

##### ry

`number`

##### rw

`number`

##### rh

`number`

##### tolerance

`number`

##### out

`Float32Array`

##### base

`number`

#### Returns

`boolean`

交差したか

### \_lineTriangle()

> `readonly` **\_lineTriangle**(`x1`, `y1`, `dx`, `dy`, `ax`, `ay`, `bx`, `by`, `cx`, `cy`, `tolerance`, `out`, `base`): `boolean`

線分と 1 個の三角形の交差を判定します。

3 辺との交点を求め、そのパラメータの最小・最大を線分の
`[0, 1]` と突き合わせます。裏返した三角形（winding が逆）でも
判定できるよう、交差の有無は符号ではなく幾何で決めます。

#### Parameters

##### x1

`number`

##### y1

`number`

##### dx

`number`

##### dy

`number`

##### ax

`number`

##### ay

`number`

##### bx

`number`

##### by

`number`

##### cx

`number`

##### cy

`number`

##### tolerance

`number`

##### out

`Float32Array`

##### base

`number`

#### Returns

`boolean`

### \_segSeg()

> `readonly` **\_segSeg**(`x1`, `y1`, `dx`, `dy`, `x2`, `y2`, `x3`, `y3`, `tolerance`): `number`

2 本の線分の交差を判定し、線分 1 のパラメータ `t` を返します。
交差（重なる範囲を持つ）しなければ -1 を返します。

#### Parameters

##### x1

`number`

##### y1

`number`

##### dx

`number`

##### dy

`number`

##### x2

`number`

##### y2

`number`

##### x3

`number`

##### y3

`number`

##### tolerance

`number`

#### Returns

`number`

### intersectLine()

> `readonly` **intersectLine**(`line`, `shapes`, `stride`, `out`, `tolerance?`): `number`

指定 stride の SoA 図形群を線分と交差判定します。

stride が 3 なら円、6 なら三角形、4 なら矩形として扱います。
線分群との交差には [Raycaster.intersectLineSegments](#intersectlinesegments) を使ってください。

#### Parameters

##### line

[`RayLine`](../type-aliases/RayLine.md)

線分 `[x1, y1, x2, y2]`

##### shapes

`ArrayLike`\<`number`\>

図形群の SoA バッファ

##### stride

`number`

1 図形あたりの要素数

##### out

`Float32Array`

交差結果を詰めるバッファ（`RAY_HIT_STRIDE` 個ずつ）

##### tolerance?

`number` = `1e-6`

境界の判定に使う許容誤差

#### Returns

`number`

`out` に詰めた交差結果の数

### intersectLineSegments()

> `readonly` **intersectLineSegments**(`line`, `segments`, `out`, `tolerance?`): `number`

線分群（stride 4 の `[x1, y1, x2, y2]`）と線分の交差を走査します。

線どうしの交差なので法線は求めません（`NormalX` / `NormalY` は 0）。
平行（または同一線）な場合は交差として扱いません。

#### Parameters

##### line

[`RayLine`](../type-aliases/RayLine.md)

##### segments

`ArrayLike`\<`number`\>

##### out

`Float32Array`

##### tolerance?

`number` = `1e-6`

#### Returns

`number`
