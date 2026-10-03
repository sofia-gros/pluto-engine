[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / CurveKind

# Variable: CurveKind

> `const` **CurveKind**: `object`

Defined in: [core/src/math/Curves.ts:32](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/math/Curves.ts#L32)

カーブの共通 Yep 実。具象クラスを継承せず、
discriminated union の kind で分岐します。

継承階層を持つと Flyweight ではないオブジェクトが 1 つ増えます（R-03）。
`kind` による分岐なら 1 個の関数に集約できます。

## Type Declaration

### CatmullRom

> `readonly` **CatmullRom**: `4` = `4`

### CubicBezier

> `readonly` **CubicBezier**: `2` = `2`

### Line

> `readonly` **Line**: `0` = `0`

### QuadraticBezier

> `readonly` **QuadraticBezier**: `1` = `1`

### Spline

> `readonly` **Spline**: `3` = `3`
