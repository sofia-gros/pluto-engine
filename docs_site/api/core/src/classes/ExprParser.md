[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / ExprParser

# Class: ExprParser

Defined in: [core/src/math/ExprParser.ts:100](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/math/ExprParser.ts#L100)

## Constructors

### Constructor

> **new ExprParser**(`capacity?`): `ExprParser`

Defined in: [core/src/math/ExprParser.ts:132](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/math/ExprParser.ts#L132)

#### Parameters

##### capacity?

`number` = `128`

#### Returns

`ExprParser`

## Accessors

### tokenCount

#### Get Signature

> **get** **tokenCount**(): `number`

Defined in: [core/src/math/ExprParser.ts:128](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/math/ExprParser.ts#L128)

直近のパースで得たトークン数。

##### Returns

`number`

## Methods

### evaluate()

> **evaluate**(`expression`, `parameters?`): `number`

Defined in: [core/src/math/ExprParser.ts:362](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/math/ExprParser.ts#L362)

式をパースして評価します。

#### Parameters

##### expression

`string`

##### parameters?

`ArrayLike`\<`number`\>

識別子に対応する値。`Float64Array` を推奨

#### Returns

`number`

評価結果。構文エラーや致命的エラー時は `NaN`

***

### evaluateParsed()

> **evaluateParsed**(`parameters?`): `number`

Defined in: [core/src/math/ExprParser.ts:371](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/math/ExprParser.ts#L371)

直近の [parse](#parse) 結果だけを評価します。
文字列が変わらないなら [evaluate](#evaluate) より速くなります。

#### Parameters

##### parameters?

`ArrayLike`\<`number`\>

#### Returns

`number`

***

### parse()

> **parse**(`expression`): `boolean`

Defined in: [core/src/math/ExprParser.ts:164](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/core/src/math/ExprParser.ts#L164)

文字列を後缀記法（RPN）へ変換します。

#### Parameters

##### expression

`string`

#### Returns

`boolean`

構文が正しければ true
