[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Vector2

# Variable: Vector2

> `const` **Vector2**: `object`

Defined in: [core/src/math/Vector2.ts:30](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/math/Vector2.ts#L30)

## Type Declaration

### Add()

> `readonly` **Add**(`a`, `b`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

`out = a + b`

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### b

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### Angle()

> `readonly` **Angle**(`a`, `b`): `number`

2 点間の角度を返します (ラジアン、Phaser 互換の `Angle.Between`)。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### b

[`Vec2Like`](../type-aliases/Vec2Like.md)

#### Returns

`number`

### Ceil()

> `readonly` **Ceil**(`a`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

小数部分を切り捨てます (`out = ceil(a)`)。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### ClampDistance()

> `readonly` **ClampDistance**(`a`, `b`, `min`, `max`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

2 点間の距離をクランプします (Phaser 互換の `Vector2.DistanceSq` 系)。
`out[0]` に距離を書きます。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### b

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### min

`number`

##### max

`number`

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### Copy()

> `readonly` **Copy**(`a`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

`out` に点 A をコピーします。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### Cross()

> `readonly` **Cross**(`a`, `b`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

外積 (z 成分) を `out[0]` に書きます。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### b

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

1 要素のバッファ

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### Distance()

> `readonly` **Distance**(`a`, `b`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

2 点間の距離を `out[0]` に書きます。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### b

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### Divide()

> `readonly` **Divide**(`a`, `scalar`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

`out = a / scalar`

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### scalar

`number`

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### Dot()

> `readonly` **Dot**(`a`, `b`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

内積 `out = a · b`

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### b

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

1 要素のバッファ

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### Equals()

> `readonly` **Equals**(`a`, `b`): `boolean`

`out` と `other` が同じ参照かどうか。
`in` と `out` を安全に共有できるかの判定に使います。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### b

[`Vec2Like`](../type-aliases/Vec2Like.md)

#### Returns

`boolean`

### Floor()

> `readonly` **Floor**(`a`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

各成分を 0 方向へ丸めます (`out = floor(a)`)。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### FromAngle()

> `readonly` **FromAngle**(`angle`, `length`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

角度と長さから点を作ります (Phaser 互換の `Vector2.FromAngle`)。

#### Parameters

##### angle

`number`

##### length

`number`

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

2 要素のバッファ

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### Invert()

> `readonly` **Invert**(`a`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

各成分を符号反転します。Phaser の `invert` と同じ意味です。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### Length()

> `readonly` **Length**(`a`): `number`

点の長さ (`sqrt(x^2 + y^2)`) を返します。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

#### Returns

`number`

### LengthSq()

> `readonly` **LengthSq**(`a`): `number`

点の長さの二乗を返します。平方根が不要な比較に。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

#### Returns

`number`

### Linear()

> `readonly` **Linear**(`a`, `b`, `t`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

線形補間 (Phaser 互換の `Vector2.Linear`)。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### b

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### t

`number`

補間係数

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### Negate()

> `readonly` **Negate**(`a`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

`out = -a`

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### Normalize()

> `readonly` **Normalize**(`a`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

単位ベクトルにします（長さを 1 に）。

長さ 0 の点では `(0, 0)` を返します（`SetLength` と挙動が違います）。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### ProjectUnit()

> `readonly` **ProjectUnit**(`a`, `point`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

`point` を `a` から見た**単位**方向の位置へ射影します
(Phaser 互換の `Vector2.ProjectUnit`)。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### point

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

2 要素のバッファ。out = 射影点 (a + dir * t)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### Round()

> `readonly` **Round**(`a`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

各成分を丸めます。

`Math.round` と同じ規則（0.5 は `+Infinity` 側）を使います。
つまり `-1.5` は `-1` になります。0 方向への丸めが必要な場合は
呼び出し側で `Math.floor(x + 0.5)` を書いてください。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### Scale()

> `readonly` **Scale**(`a`, `scalar`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

`out = a * scalar`

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### scalar

`number`

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### SetLength()

> `readonly` **SetLength**(`a`, `length`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

長さを指定値にします。元の向きは保たれます。

長さ 0 の点では方向が定義できないため `(1, 0)` になります。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### length

`number`

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### SmoothStep()

> `readonly` **SmoothStep**(`a`, `b`, `t`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

滑らかな線形補間 (Phaser 互換の `Vector2.SmoothStep`)。

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### b

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### t

`number`

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### Subtract()

> `readonly` **Subtract**(`a`, `b`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

`out = a - b`

#### Parameters

##### a

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### b

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)

### Unit()

> `readonly` **Unit**(`from`, `point`, `out`): [`Vec2Out`](../type-aliases/Vec2Out.md)

`a` から `point` への方向を単位ベクトルとして書き出します
(Phaser 互換の `Vector2.Unit`)。

#### Parameters

##### from

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### point

[`Vec2Like`](../type-aliases/Vec2Like.md)

##### out

[`Vec2Out`](../type-aliases/Vec2Out.md)

#### Returns

[`Vec2Out`](../type-aliases/Vec2Out.md)
