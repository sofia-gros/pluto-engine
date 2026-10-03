[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Geom

# Variable: Geom

> `const` **Geom**: `object`

Defined in: [core/src/math/Geom.ts:40](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Geom.ts#L40)

## Type Declaration

### \_angleAt()

> `readonly` **\_angleAt**(`px`, `py`, `ax`, `ay`, `bx`, `by`): `number`

頂点 `px, py` から頂点 `ax, ay` を見た 3 頂点の角度を求めます。

#### Parameters

##### px

`number`

##### py

`number`

##### ax

`number`

##### ay

`number`

##### bx

`number`

##### by

`number`

#### Returns

`number`

### \_pointInTriangle()

> `readonly` **\_pointInTriangle**(`px`, `py`, `ax`, `ay`, `bx`, `by`, `cx`, `cy`): `boolean`

点が三角形の内側かを判定します。

符号付き面積の符号で判定します（法線の向きに依存しません）。

#### Parameters

##### px

`number`

##### py

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

#### Returns

`boolean`

### CircleArea()

> `readonly` **CircleArea**(`c`): `number`

円の面積を返します。

#### Parameters

##### c

[`Vec2Like`](../type-aliases/Vec2Like.md)

#### Returns

`number`

### CircleContains()

> `readonly` **CircleContains**(`c`, `x`, `y`): `boolean`

円が点を含むかを返します。

#### Parameters

##### c

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### x

`number`

##### y

`number`

#### Returns

`boolean`

### EllipseToPoints()

> `readonly` **EllipseToPoints**(`x`, `y`, `radiusX`, `radiusY`, `out`): `Float32Array`\<`ArrayBufferLike`\>

楕円を `out` へ書き出します（`x, y, radiusX, radiusY`）。

#### Parameters

##### x

`number`

##### y

`number`

##### radiusX

`number`

##### radiusY

`number`

##### out

`Float32Array`

#### Returns

`Float32Array`\<`ArrayBufferLike`\>

### GetBounds()

> `readonly` **GetBounds**(`points`, `out`): `number`

点群を包む矩形を `out` へ書き出します
(Phaser 互換の `Geom.GetBounds`)。

#### Parameters

##### points

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

`Float32Array`

4 要素。`minX, minY, maxX, maxY`

#### Returns

`number`

書き出した点数

### GetCentroid()

> `readonly` **GetCentroid**(`points`, `out`): `number`

点群の重心を `out` へ書き出します。

面積の重み付きなら多角形でも面積重心を返しますが、
本実装は Phaser と同じく**頂点の平均**を返します。

#### Parameters

##### points

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

`Float32Array`

#### Returns

`number`

### GetTriangleAngles()

> `readonly` **GetTriangleAngles**(`t`, `out`): `Float32Array`

三角形の 3 頂点の角度を `out` へ書き出します
(Phaser 互換の `Triangle.GetAngles`)。

3 頂点の角度の和は π になります。

#### Parameters

##### t

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

`Float32Array`

#### Returns

`Float32Array`

### HexagonToPoints()

> `readonly` **HexagonToPoints**(`x`, `y`, `radius`, `out`): `number`

六角形を `out` へ書き出します。

頂点は 6 点（12 要素）を正六角形として配置します。
半径は外接円半径です。

#### Parameters

##### x

`number`

##### y

`number`

##### radius

`number`

##### out

`Float32Array`

#### Returns

`number`

### Interpolate()

> `readonly` **Interpolate**(`a`, `b`, `quantity`, `out`): `Float32Array`

2 点を指定量だけ `out` へ補間します
(Phaser 互換の `Geom.Interpolate`)。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### b

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### quantity

`number`

補間係数

##### out

`Float32Array`

#### Returns

`Float32Array`

### LineToPoints()

> `readonly` **LineToPoints**(`x1`, `y1`, `x2`, `y2`, `out`): `Float32Array`\<`ArrayBufferLike`\>

線を `out` へ書き出します（`x1, y1, x2, y2`）。

#### Parameters

##### x1

`number`

##### y1

`number`

##### x2

`number`

##### y2

`number`

##### out

`Float32Array`

#### Returns

`Float32Array`\<`ArrayBufferLike`\>

### OverlapPoint()

> `readonly` **OverlapPoint**(`x`, `y`, `shapes`, `stride`, `out`): `number`

SoA 図形群と点の重なりを走査します。

図形群の stride で種別を決めます。
`out` には交差した図形インデックスを詰めていきます。

#### Parameters

##### x

`number`

##### y

`number`

##### shapes

`ArrayLike`\<`number`\>

##### stride

`number`

##### out

`Int32Array`

`Int32Array`。足りなければ `cap` 個で打ち切ります

#### Returns

`number`

交差した図形の数

### PolygonArea()

> `readonly` **PolygonArea**(`vertices`): `number`

多角形の面積を返します（靴ひも公式）。

#### Parameters

##### vertices

[`Vec2Like`](../type-aliases/Vec2Like.md)

フラットな頂点列

#### Returns

`number`

### PolygonToPoints()

> `readonly` **PolygonToPoints**(`vertices`, `close`, `out`): `number`

多角形を `out` へ展開します。

#### Parameters

##### vertices

[`Vec2Like`](../type-aliases/Vec2Like.md)

フラットな頂点列 `[x0, y0, x1, y1, ...]`

##### close

`boolean`

終端に始点を追加するか（`closePoints` 相当）

##### out

`Float32Array`

#### Returns

`number`

書き出した要素数

### RectangleArea()

> `readonly` **RectangleArea**(`r`): `number`

矩形の面積を返します。

#### Parameters

##### r

[`Vec2Like`](../type-aliases/Vec2Like.md)

#### Returns

`number`

### RectangleContains()

> `readonly` **RectangleContains**(`r`, `x`, `y`): `boolean`

矩形が点を含むかを返します。

#### Parameters

##### r

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### x

`number`

##### y

`number`

#### Returns

`boolean`

### RectangleHeight()

> `readonly` **RectangleHeight**(`r`): `number`

矩形の高さを返します。

#### Parameters

##### r

[`Vec2Like`](../type-aliases/Vec2Like.md)

#### Returns

`number`

### RectanglePerimeter()

> `readonly` **RectanglePerimeter**(`r`): `number`

矩形の外周の長さを返します。

#### Parameters

##### r

[`Vec2Like`](../type-aliases/Vec2Like.md)

#### Returns

`number`

### RectangleToPoints()

> `readonly` **RectangleToPoints**(`x`, `y`, `width`, `height`, `out`): `Float32Array`\<`ArrayBufferLike`\>

矩形を `out` へ書き出します。

#### Parameters

##### x

`number`

##### y

`number`

##### width

`number`

##### height

`number`

##### out

`Float32Array`

#### Returns

`Float32Array`\<`ArrayBufferLike`\>

### RectangleWidth()

> `readonly` **RectangleWidth**(`r`): `number`

矩形の幅を返します。

#### Parameters

##### r

[`Vec2Like`](../type-aliases/Vec2Like.md)

#### Returns

`number`

### RhombusToPoints()

> `readonly` **RhombusToPoints**(`x`, `y`, `halfWidth`, `halfHeight`, `out`): `Float32Array`\<`ArrayBufferLike`\>

菱形を `out` へ書き出します（`x, y, halfWidth, halfHeight`）。

上下と左右が同じ半径の Rhombus は、実質的に 45 度回転した矩形です。

#### Parameters

##### x

`number`

##### y

`number`

##### halfWidth

`number`

##### halfHeight

`number`

##### out

`Float32Array`

#### Returns

`Float32Array`\<`ArrayBufferLike`\>

### TriangleArea()

> `readonly` **TriangleArea**(`t`): `number`

三角形の面積を返します。

#### Parameters

##### t

[`Vec2Like`](../type-aliases/Vec2Like.md)

#### Returns

`number`

### TriangleToPoints()

> `readonly` **TriangleToPoints**(`x1`, `y1`, `x2`, `y2`, `x3`, `y3`, `out`): `Float32Array`\<`ArrayBufferLike`\>

三角形を `out` へ書き出します（`x1, y1, x2, y2, x3, y3`）。

#### Parameters

##### x1

`number`

##### y1

`number`

##### x2

`number`

##### y2

`number`

##### x3

`number`

##### y3

`number`

##### out

`Float32Array`

#### Returns

`Float32Array`\<`ArrayBufferLike`\>
