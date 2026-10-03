[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [ai/src](../README.md) / UtilityAISystem

# Class: UtilityAISystem

Defined in: [ai/src/UtilityAISystem.ts:17](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/ai/src/UtilityAISystem.ts#L17)

## File

UtilityAISystem.ts

## Description

SoA 構造の Utility AI。

FSM (状態遷移) は遷移条件が増えるほど組み合わせが爆発し、
挙動の把握も困難になります。Utility AI は
「各行動の効用を採点し、最も Effekt の高いものを選ぶ」方式なので
行動の追加が他の行動へ影響しません。

設計上の掟:
 - エンティティごとにオブジェクトを持たない (SoA)
 - 評価は 2 フェーズ (一括採点 + 1 パスで argmax)
 - スコアの書き込み先は呼び出し側のバッファ (new しない)

## Constructors

### Constructor

> **new UtilityAISystem**(`maxEntities`): `UtilityAISystem`

Defined in: [ai/src/UtilityAISystem.ts:32](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/ai/src/UtilityAISystem.ts#L32)

#### Parameters

##### maxEntities

`number`

#### Returns

`UtilityAISystem`

## Properties

### bestActionIds

> **bestActionIds**: `Uint16Array`

Defined in: [ai/src/UtilityAISystem.ts:24](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/ai/src/UtilityAISystem.ts#L24)

勝利した行動 ID。
Uint16Array を使うのは 256 種を超える行動 Defining に対応するためです
(Uint8Array では 256 で暗黙に折り返します)。

***

### bestScores

> **bestScores**: `Float32Array`

Defined in: [ai/src/UtilityAISystem.ts:18](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/ai/src/UtilityAISystem.ts#L18)

***

### currentScores

> **currentScores**: `Float32Array`

Defined in: [ai/src/UtilityAISystem.ts:25](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/ai/src/UtilityAISystem.ts#L25)

***

### lastEvaluatedActionCount

> **lastEvaluatedActionCount**: `number` = `0`

Defined in: [ai/src/UtilityAISystem.ts:30](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/ai/src/UtilityAISystem.ts#L30)

評価に絡む統計。デバッグやバランス調整に使います

***

### maxEntities

> `readonly` **maxEntities**: `number`

Defined in: [ai/src/UtilityAISystem.ts:27](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/ai/src/UtilityAISystem.ts#L27)

評価済みの行動のうち、1 エンティティあたりの最高スコア

## Methods

### beginEvaluation()

> **beginEvaluation**(`entityCount`): `void`

Defined in: [ai/src/UtilityAISystem.ts:44](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/ai/src/UtilityAISystem.ts#L44)

評価を開始します。
指定されたエンティティ数のスコアをリセットします。

#### Parameters

##### entityCount

`number`

#### Returns

`void`

***

### evaluateAction()

> **evaluateAction**(`actionId`, `entityCount`, `evaluator`): `void`

Defined in: [ai/src/UtilityAISystem.ts:68](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/ai/src/UtilityAISystem.ts#L68)

単一の行動のスコアを一括計算し、最高スコアを上回る場合のみ更新します。

2 フェーズ構成の理由:
 - Phase 1: カーネルが currentScores へ一括で書き込む
 - Phase 2: 1 本のループで argmax を更新する
This keeps one branch per entity, so the scan cost does not grow
行動数が増えても走査回数は増えません。

#### Parameters

##### actionId

`number`

評価対象の行動 ID

##### entityCount

`number`

有効なエンティティ数

##### evaluator

(`outScores`, `count`) => `void`

currentScores へスコアを書き込むカーネル関数

#### Returns

`void`

***

### scoreOf()

> **scoreOf**(`entityIndex`): `number`

Defined in: [ai/src/UtilityAISystem.ts:109](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/ai/src/UtilityAISystem.ts#L109)

選択された行動のスコアを返します。
未評価なら -Infinity を返します。

#### Parameters

##### entityIndex

`number`

#### Returns

`number`

***

### selectAction()

> **selectAction**(`entityIndex`): `number`

Defined in: [ai/src/UtilityAISystem.ts:101](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/ai/src/UtilityAISystem.ts#L101)

行動 ID をそのまま返す糖衣関数。
評価済みかどうかを確かめるための補助です。

#### Parameters

##### entityIndex

`number`

#### Returns

`number`

***

### utility()

> `static` **utility**(`preference`, `penalty?`): `number`

Defined in: [ai/src/UtilityAISystem.ts:121](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/ai/src/UtilityAISystem.ts#L121)

得点 2 つの大小比較を行います。

Utility AI の効用は「値が大きいほど良い」ので、
ペナルティ (回避したい行動) は負値で表現します。
 ArdenUtility 関数として公開することで、
ペナルティ (回避したい行動) は負値で表現します。

#### Parameters

##### preference

`number`

##### penalty?

`number` = `0`

#### Returns

`number`
