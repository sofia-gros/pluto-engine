[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Math2

# Variable: Math2

> `const` **Math2**: `object`

Defined in: [core/src/math/Math.ts:30](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Math.ts#L30)

## Type Declaration

### AngleBetween()

> `readonly` **AngleBetween**(`x1`, `y1`, `x2`, `y2`): `number`

2 点間の角度 (ラジアン) を返します (Phaser 互換の `Math.Angle.Between`)。

#### Parameters

##### x1

`number`

##### y1

`number`

##### x2

`number`

##### y2

`number`

#### Returns

`number`

### BetweenPoints()

> `readonly` **BetweenPoints**(`a`, `b`, `out`): `Float32Array`

2 点間の距離を `out` へ書き出します (Phaser 互換の `Math.Distance.BetweenPoints`)。

#### Parameters

##### a

[`MathVec2Like`](../type-aliases/MathVec2Like.md)

点 A (2 要素)

##### b

[`MathVec2Like`](../type-aliases/MathVec2Like.md)

点 B (2 要素)

##### out

[`MathVec2Out`](../type-aliases/MathVec2Out.md)

1 要素のバッファ。out[0] = 距離

#### Returns

`Float32Array`

### Clamp()

> `readonly` **Clamp**(`val`, `min`, `max`): `number`

値を `[min, max]` にクランプします。

#### Parameters

##### val

`number`

##### min

`number`

##### max

`number`

#### Returns

`number`

### Copy()

> `readonly` **Copy**(`source`, `out`): `Float32Array`

点を `out` にコピーします (Phaser 互換の `Math.Copy`)。

#### Parameters

##### source

[`MathVec2Like`](../type-aliases/MathVec2Like.md)

##### out

[`MathVec2Out`](../type-aliases/MathVec2Out.md)

2 要素のバッファ

#### Returns

`Float32Array`

### DegreesToRadians()

> `readonly` **DegreesToRadians**(`degrees`): `number`

度数をラジアンに変換します (Phaser 互換の `Math.DegToRad`)。

#### Parameters

##### degrees

`number`

#### Returns

`number`

### DegToRad()

> `readonly` **DegToRad**(`degrees`): `number`

度数をラジアンに変換します（旧名 `DegToRad` の互換エイリアス）。

#### Parameters

##### degrees

`number`

#### Returns

`number`

### DistanceBetween()

> `readonly` **DistanceBetween**(`x1`, `y1`, `x2`, `y2`): `number`

2 点間の距離 (Phaser 互換の `Math.Distance.Between`)。

#### Parameters

##### x1

`number`

##### y1

`number`

##### x2

`number`

##### y2

`number`

#### Returns

`number`

### DistanceSquared()

> `readonly` **DistanceSquared**(`x1`, `y1`, `x2`, `y2`): `number`

2 点間の距離の二乗 (Phaser 互換の `Math.Distance.Squared`)。

平方根を取らないため、**大小比較だけをするならこちらが速い**です。

#### Parameters

##### x1

`number`

##### y1

`number`

##### x2

`number`

##### y2

`number`

#### Returns

`number`

### FuzzyMatch()

> `readonly` **FuzzyMatch**(`value`, `expected`, `tolerance`): `boolean`

許容範囲内かを判定します (Phaser 互換の `Math.FuzzyMatch`)。

#### Parameters

##### value

`number`

検査する値

##### expected

`number`

期待値

##### tolerance

`number`

許容誤差

#### Returns

`boolean`

### GetCentroid()

> `readonly` **GetCentroid**(`points`, `out`): `number`

点群の重心を `out` へ書き出します (Phaser 互換の `Math.GetCentroid`)。

内部で全点の平均を取ります。点群は `[x0, y0, x1, y1, ...]` のフラットな
`Float32Array` を想定します。

#### Parameters

##### points

[`MathVec2Like`](../type-aliases/MathVec2Like.md)

フラットな点群

##### out

[`MathVec2Out`](../type-aliases/MathVec2Out.md)

2 要素のバッファ。out[0] = x, out[1] = y

#### Returns

`number`

書き出した点の数。0 点の場合は `out` を書き換えず 0 を返します

### GetVec2Bounds()

> `readonly` **GetVec2Bounds**(`points`, `out`): `number`

点群を包む矩形を `out` へ書き出します
(Phaser 互換の `Math.GetVec2Bounds`)。

#### Parameters

##### points

[`MathVec2Like`](../type-aliases/MathVec2Like.md)

フラットな点群

##### out

[`Float32Out4`](../type-aliases/Float32Out4.md)

4 要素のバッファ。out = [minX, minY, maxX, maxY]

#### Returns

`number`

書き出した点の数。0 点の場合は `out` を書き換えず 0 を返します

### Length()

> `readonly` **Length**(`x`, `y`): `number`

点群の長さを返します (Phaser 互換の `Vector2` の length 相当)。

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`number`

### Linear()

> `readonly` **Linear**(`p`, `p0`, `p1`): `number`

線形補間 (Phaser 互換の `Math.Linear`)。

#### Parameters

##### p

`number`

補間係数 (0〜1)。範囲外はクランプしません

##### p0

`number`

開始値

##### p1

`number`

終了値

#### Returns

`number`

### Percentage()

> `readonly` **Percentage**(`x`, `min`, `max`): `number`

位置の百分率 (Phaser 互換の `Math.Percentage`)。

#### Parameters

##### x

`number`

値

##### min

`number`

下限

##### max

`number`

上限

#### Returns

`number`

`(x - min) / (max - min)`。`min === max` のときは 0

### RadiansToDegrees()

> `readonly` **RadiansToDegrees**(`radians`): `number`

ラジアンを度数に変換します (Phaser 互換の `Math.RadToDeg`)。

#### Parameters

##### radians

`number`

#### Returns

`number`

### RadToDeg()

> `readonly` **RadToDeg**(`radians`): `number`

ラジアンを度数に変換します（旧名 `RadToDeg` の互換エイリアス）。

#### Parameters

##### radians

`number`

#### Returns

`number`

### Sign()

> `readonly` **Sign**(`val`): `number`

値の符号を返します (-1 / 0 / 1)。

#### Parameters

##### val

`number`

#### Returns

`number`

### Sinusoidal()

> `readonly` **Sinusoidal**(`value`, `min`, `max`): `number`

サインステップ補間 (Phaser 互換の `Math.SinusoidalStep`)。
始点と終点で傾きが 0 になる形です。

#### Parameters

##### value

`number`

##### min

`number`

##### max

`number`

#### Returns

`number`

`[min, max]` の区間に対する正規化位置 0〜1

### SmoothStep()

> `readonly` **SmoothStep**(`value`, `min`, `max`): `number`

スムーズステップ補間 (Phaser 互換の `Math.SmoothStep`)。

端で 2 次微分連続になるよう `t * t * (3 - 2t)` でクランプします。

#### Parameters

##### value

`number`

##### min

`number`

##### max

`number`

#### Returns

`number`

`[min, max]` の区間に対する正規化位置 0〜1
