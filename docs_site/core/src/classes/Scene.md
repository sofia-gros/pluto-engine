[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / Scene

# Class: Scene

Defined in: [core/src/scene/Scene.ts:39](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L39)

## Constructors

### Constructor

> **new Scene**(`props?`): `Scene`

Defined in: [core/src/scene/Scene.ts:706](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L706)

#### Parameters

##### props?

`string` \| [`SceneProps`](../interfaces/SceneProps.md)

#### Returns

`Scene`

## Properties

### \_hitBuffer

> `readonly` **\_hitBuffer**: `Int32Array`\<`ArrayBuffer`\>

Defined in: [core/src/scene/Scene.ts:276](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L276)

ポインタヒットテストの結果を受け取るバッファ (毎フレーム new しない)

***

### add

> `readonly` **add**: `object`

Defined in: [core/src/scene/Scene.ts:371](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L371)

#### bitmapText

> **bitmapText**: (`x`, `y`, `text`, `font`, `pageKey?`) => [`Text`](Text.md)

ビットマップフォントのテキストを生成します
(Phaser 互換の `add.bitmapText`)。

BMFont (AngelCode) の解析結果と、ページ画像のテクスチャキーを受け取ります。
ページ画像は TextureManager に登録済みである必要があります
（未登録の場合はアトラス全体を 1 文字 1 クイッドとして描画するフォールバックになります）。

返り値は [Text](Text.md) と同じ arena 上のオブジェクトです。

##### Parameters

###### x

`number`

###### y

`number`

###### text

`string`

###### font

[`ParsedBitmapFont`](../interfaces/ParsedBitmapFont.md)

###### pageKey?

`string`

##### Returns

[`Text`](Text.md)

#### container

> **container**: (`x`, `y`, `children`) => [`Container`](Container.md)

複数の表示オブジェクトを親の下へまとめます (Phaser 互換の `add.container`)。

親子変換は SoA のシーングラフで解決されます。
返り値は Container Flyweight で、own property は id と _arena の 2 個だけです。

##### Parameters

###### x?

`number` = `0`

###### y?

`number` = `0`

###### children?

[`Sprite`](Sprite.md)[] = `[]`

##### Returns

[`Container`](Container.md)

#### group

> **group**: (`children`) => [`Group`](Group.md)

グループを生成します (Phaser 互換の `add.group`)。

Group は SoA 化せず、使い回し `Array` で実装します (判定 D)。
アリーナは汚さず、「CPU 管理のビュー」として並行して持ちます。

##### Parameters

###### children?

[`Sprite`](Sprite.md)[] = `[]`

##### Returns

[`Group`](Group.md)

#### image

> **image**: (`x`, `y`, `textureKey?`, `frameKey?`) => [`Sprite`](Sprite.md)

静的な画像を生成します (Phaser 互換の this.add.image)。

内部は sprite と同一です。pluto-engine の Flyweight 設計では
画像もスプライトも同じアリーナ上の 1 スロットで表現されます。

##### Parameters

###### x?

`number` = `0`

###### y?

`number` = `0`

###### textureKey?

`string`

###### frameKey?

`string` \| `number`

##### Returns

[`Sprite`](Sprite.md)

#### particles

> **particles**: (`x`, `y`, `textureKey`, `config`) => [`ParticleEmitter`](ParticleEmitter.md)

パーティクルエミッターを生成します (Phaser 互換の `add.particles`)。

`textureKey` を渡すと各粒子にそのテクスチャを設定します。
Particles subsystem を有効化するため `Subsystem.Particles` を立てます。

##### Parameters

###### x?

`number` = `0`

###### y?

`number` = `0`

###### textureKey?

`string` = `undefined`

###### config?

[`EmitterCreateConfig`](../interfaces/EmitterCreateConfig.md) = `{}`

##### Returns

[`ParticleEmitter`](ParticleEmitter.md)

#### sprite

> **sprite**: (`x`, `y`, `textureKey?`, `frameKey?`) => [`Sprite`](Sprite.md)

##### Parameters

###### x?

`number` = `0`

###### y?

`number` = `0`

###### textureKey?

`string`

###### frameKey?

`string` \| `number`

##### Returns

[`Sprite`](Sprite.md)

#### text

> **text**: (`x`, `y`, `text`, `style`) => [`Text`](Text.md)

##### Parameters

###### x?

`number` = `0`

###### y?

`number` = `0`

###### text?

`string` = `''`

###### style?

[`TextStyle`](../interfaces/TextStyle.md) = `{}`

##### Returns

[`Text`](Text.md)

#### tilemap

> **tilemap**: (`mapData`, `tileSize`) => [`Tilemap`](Tilemap.md)

##### Parameters

###### mapData

`any`

###### tileSize?

`number` = `32`

##### Returns

[`Tilemap`](Tilemap.md)

***

### ai?

> `optional` **ai?**: [`UtilityAISystem`](../../../ai/src/classes/UtilityAISystem.md)

Defined in: [ai/src/AIPlugin.ts:6](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/ai/src/AIPlugin.ts#L6)

***

### arena

> **arena**: [`InstanceBufferArena`](InstanceBufferArena.md)

Defined in: [core/src/scene/Scene.ts:44](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L44)

***

### camera

> **camera**: [`Camera`](Camera.md)

Defined in: [core/src/scene/Scene.ts:65](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L65)

メインカメラ (this.cameras.main の別名)。
既存のコードとの互換のために残しています。

***

### cameras

> **cameras**: [`CameraManager`](CameraManager.md)

Defined in: [core/src/scene/Scene.ts:60](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L60)

カメラ管理 (Phaser 互換の this.cameras)。

***

### engine

> **engine**: [`PlutoEngine`](PlutoEngine.md)

Defined in: [core/src/scene/Scene.ts:42](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L42)

***

### events

> `readonly` **events**: [`EventEmitter`](EventEmitter.md)

Defined in: [core/src/scene/Scene.ts:50](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L50)

シーン内イベントバス

***

### id

> **id**: `string` = `''`

Defined in: [core/src/scene/Scene.ts:40](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L40)

***

### input

> **input**: [`InputManager`](InputManager.md)

Defined in: [core/src/scene/Scene.ts:45](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L45)

***

### load

> **load**: [`LoaderManager`](LoaderManager.md)

Defined in: [core/src/scene/Scene.ts:46](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L46)

***

### math

> **math**: [`MathHelpers`](MathHelpers.md) = `mathHelpers`

Defined in: [core/src/scene/Scene.ts:280](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L280)

***

### poisson?

> `optional` **poisson?**: [`PoissonSolver`](../../../pluto/src/classes/PoissonSolver.md)

Defined in: [poisson/src/PoissonPlugin.ts:6](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/poisson/src/PoissonPlugin.ts#L6)

***

### scene

> **scene**: [`SceneManager`](SceneManager.md)

Defined in: [core/src/scene/Scene.ts:41](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L41)

***

### sdf?

> `optional` **sdf?**: [`SDFCollider`](../../../pluto/src/classes/SDFCollider.md)

Defined in: [sdf-collider/src/SDFPlugin.ts:6](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/sdf-collider/src/SDFPlugin.ts#L6)

***

### spatialHash

> **spatialHash**: [`MortonSpatialHash`](../../../morton/src/classes/MortonSpatialHash.md)

Defined in: [morton/src/MortonPlugin.ts:8](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/morton/src/MortonPlugin.ts#L8)

***

### textures

> **textures**: [`TextureManager`](TextureManager.md)

Defined in: [core/src/scene/Scene.ts:47](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L47)

***

### verlet?

> `optional` **verlet?**: [`VerletSolver`](../../../pluto/src/classes/VerletSolver.md)

Defined in: [verlet-ik/src/VerletPlugin.ts:18](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/verlet-ik/src/VerletPlugin.ts#L18)

***

### xpbd?

> `optional` **xpbd?**: [`XPBDSolver`](../../../xpbd/src/classes/XPBDSolver.md)

Defined in: [xpbd/src/XPBDPlugin.ts:6](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/xpbd/src/XPBDPlugin.ts#L6)

## Accessors

### activeSubsystems

#### Get Signature

> **get** **activeSubsystems**(): `number`

Defined in: [core/src/scene/Scene.ts:117](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L117)

ビットマスク。初期化済みのサブシステムのみが立ちます。
ここに無いものは更新ループから丸ごと除外されます。

##### Returns

`number`

***

### anim

#### Get Signature

> **get** **anim**(): [`AnimationManager`](AnimationManager.md)

Defined in: [core/src/scene/Scene.ts:153](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L153)

サブシステム this.anim (遅延生成)

##### Returns

[`AnimationManager`](AnimationManager.md)

***

### anims

#### Get Signature

> **get** **anims**(): [`AnimationManager`](AnimationManager.md)

Defined in: [core/src/scene/Scene.ts:324](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L324)

Phaser 互換のアニメーション门面 (実体は this.anim)。

`play` / `playReverse` が AnimState ハンドルを返す点が異なります。

##### Returns

[`AnimationManager`](AnimationManager.md)

***

### game

#### Get Signature

> **get** **game**(): [`PlutoEngine`](PlutoEngine.md)

Defined in: [core/src/scene/Scene.ts:297](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L297)

エンジン本体への参照 (Phaser 互換の this.game)。

##### Returns

[`PlutoEngine`](PlutoEngine.md)

***

### particles

#### Get Signature

> **get** **particles**(): [`ParticleManager`](ParticleManager.md)

Defined in: [core/src/scene/Scene.ts:165](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L165)

サブシステム this.particles (遅延生成)

##### Returns

[`ParticleManager`](ParticleManager.md)

***

### paused

#### Get Signature

> **get** **paused**(): `boolean`

Defined in: [core/src/scene/Scene.ts:742](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L742)

##### Returns

`boolean`

***

### physics

#### Get Signature

> **get** **physics**(): [`ArcadePhysics`](ArcadePhysics.md)

Defined in: [core/src/scene/Scene.ts:206](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L206)

サブシステム this.physics (遅延生成)

##### Returns

[`ArcadePhysics`](ArcadePhysics.md)

***

### registry

#### Get Signature

> **get** **registry**(): [`DataRegistry`](DataRegistry.md)

Defined in: [core/src/scene/Scene.ts:286](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L286)

全部シーンで共有されるグローバルデータストア。
SceneManager に載っていない単独シーンでは、自分専用のストアを返します。

##### Returns

[`DataRegistry`](DataRegistry.md)

***

### scale

#### Get Signature

> **get** **scale**(): [`ScaleManager`](ScaleManager.md)

Defined in: [core/src/scene/Scene.ts:290](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L290)

##### Returns

[`ScaleManager`](ScaleManager.md)

***

### scenePlugin

#### Get Signature

> **get** **scenePlugin**(): [`SceneManager`](SceneManager.md)

Defined in: [core/src/scene/Scene.ts:305](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L305)

シーン管理への参照 (Phaser 互換の this.scene)。
コンストラクタ内で代入される Field として保持します。

##### Returns

[`SceneManager`](SceneManager.md)

***

### shapes

#### Get Signature

> **get** **shapes**(): [`ShapeManager`](ShapeManager.md)

Defined in: [core/src/scene/Scene.ts:698](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L698)

静的シェイプの SoA。初回参照時に生成します。

##### Returns

[`ShapeManager`](ShapeManager.md)

***

### sound

#### Get Signature

> **get** **sound**(): [`SoundManager`](SoundManager.md)

Defined in: [core/src/scene/Scene.ts:183](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L183)

サブシステム this.sound (遅延生成)

初回参照時に SoundManager を生成し、Subsystem.Sound のビットを立てます。
 SoundManager はコンストラクタで AudioContext を 1 つだけ作るため、
シーン 1 あたり 1 回しか生成されません。

##### Returns

[`SoundManager`](SoundManager.md)

***

### time

#### Get Signature

> **get** **time**(): [`TimeFacade`](TimeFacade.md)

Defined in: [core/src/scene/Scene.ts:315](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L315)

エンジン全体の時間 API。Scene 単位ではありません。

Phaser 互換の门面を別クラスに切り出しており、実体は
this.engine.time の TimeStepManager です。

##### Returns

[`TimeFacade`](TimeFacade.md)

***

### tweens

#### Get Signature

> **get** **tweens**(): [`TweenManager`](TweenManager.md)

Defined in: [core/src/scene/Scene.ts:142](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L142)

サブシステム this.tweens (遅延生成)

##### Returns

[`TweenManager`](TweenManager.md)

***

### world

#### Get Signature

> **get** **world**(): [`World`](World.md)

Defined in: [core/src/scene/Scene.ts:232](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L232)

物理ワールド (Phaser 互換の `scene.physics.world`)。

シーン全体で 1 つだけ生成されます。境界矩形と重力は
this.physics のスカラーが正本です。

##### Returns

[`World`](World.md)

## Methods

### addArc()

> **addArc**(`x`, `y`, `radius`, `lineWidth?`, `color?`, `alpha?`): `number`

Defined in: [core/src/scene/Scene.ts:674](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L674)

円弧 (Phaser 互換の `add.arc`)

#### Parameters

##### x

`number`

##### y

`number`

##### radius

`number`

##### lineWidth?

`number` = `2`

##### color?

`number` = `0xffffff`

##### alpha?

`number` = `1`

#### Returns

`number`

***

### addCircle()

> **addCircle**(`x`, `y`, `radius`, `color?`, `alpha?`): `number`

Defined in: [core/src/scene/Scene.ts:520](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L520)

円 (Phaser 互換の `add.circle`)

#### Parameters

##### x

`number`

##### y

`number`

##### radius

`number`

##### color?

`number` = `0xffffff`

##### alpha?

`number` = `1`

#### Returns

`number`

***

### addEllipse()

> **addEllipse**(`x`, `y`, `width`, `height`, `color?`, `alpha?`): `number`

Defined in: [core/src/scene/Scene.ts:527](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L527)

楕円 (Phaser 互換の `add.ellipse`)

#### Parameters

##### x

`number`

##### y

`number`

##### width

`number`

##### height

`number`

##### color?

`number` = `0xffffff`

##### alpha?

`number` = `1`

#### Returns

`number`

***

### addGrid()

> **addGrid**(`x`, `y`, `cellWidth`, `cellHeight`, `cells?`, `lineWidth?`, `color?`, `alpha?`): `number`

Defined in: [core/src/scene/Scene.ts:607](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L607)

格子 (Phaser 互換の `add.grid`)

#### Parameters

##### x

`number`

##### y

`number`

##### cellWidth

`number`

##### cellHeight

`number`

##### cells?

`number` = `2`

##### lineWidth?

`number` = `1`

##### color?

`number` = `0xffffff`

##### alpha?

`number` = `1`

#### Returns

`number`

***

### addIsoDiamond()

> **addIsoDiamond**(`x`, `y`, `width`, `height`, `color?`, `alpha?`): `number`

Defined in: [core/src/scene/Scene.ts:645](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L645)

等角ダイヤ (Phaser 互換の `add.isodiamond` / `isobox`)

#### Parameters

##### x

`number`

##### y

`number`

##### width

`number`

##### height

`number`

##### color?

`number` = `0xffffff`

##### alpha?

`number` = `1`

#### Returns

`number`

***

### addIsoTriangle()

> **addIsoTriangle**(`x`, `y`, `width`, `height`, `color?`, `alpha?`): `number`

Defined in: [core/src/scene/Scene.ts:631](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L631)

等角三角形 (Phaser 互換の `add.isotriangle`)

#### Parameters

##### x

`number`

##### y

`number`

##### width

`number`

##### height

`number`

##### color?

`number` = `0xffffff`

##### alpha?

`number` = `1`

#### Returns

`number`

***

### addLine()

> **addLine**(`x`, `y`, `length`, `lineWidth?`, `color?`, `alpha?`): `number`

Defined in: [core/src/scene/Scene.ts:593](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L593)

線 (Phaser 互換の `add.line`)

#### Parameters

##### x

`number`

##### y

`number`

##### length

`number`

##### lineWidth?

`number` = `1`

##### color?

`number` = `0xffffff`

##### alpha?

`number` = `1`

#### Returns

`number`

***

### addQuad()

> **addQuad**(`x`, `y`, `width`, `height`, `inset?`, `color?`, `alpha?`): `number`

Defined in: [core/src/scene/Scene.ts:659](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L659)

四辺形 (Phaser 互換の `add.quad`)

#### Parameters

##### x

`number`

##### y

`number`

##### width

`number`

##### height

`number`

##### inset?

`number` = `0`

##### color?

`number` = `0xffffff`

##### alpha?

`number` = `1`

#### Returns

`number`

***

### addRectangle()

> **addRectangle**(`x`, `y`, `width`, `height`, `color?`, `alpha?`): `number`

Defined in: [core/src/scene/Scene.ts:506](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L506)

矩形 (Phaser 互換の `add.rectangle`)

#### Parameters

##### x

`number`

##### y

`number`

##### width

`number`

##### height

`number`

##### color?

`number` = `0xffffff`

##### alpha?

`number` = `1`

#### Returns

`number`

***

### addRoundRect()

> **addRoundRect**(`x`, `y`, `width`, `height`, `radius?`, `color?`, `alpha?`): `number`

Defined in: [core/src/scene/Scene.ts:578](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L578)

角丸矩形 (Phaser 互換の `add.roundRect` / `add.roundrect`)

#### Parameters

##### x

`number`

##### y

`number`

##### width

`number`

##### height

`number`

##### radius?

`number` = `8`

##### color?

`number` = `0xffffff`

##### alpha?

`number` = `1`

#### Returns

`number`

***

### addStar()

> **addStar**(`x`, `y`, `points`, `radius`, `innerRadius?`, `color?`, `alpha?`): `number`

Defined in: [core/src/scene/Scene.ts:555](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L555)

星形 (Phaser 互換の `add.star`)

#### Parameters

##### x

`number`

##### y

`number`

##### points

`number`

##### radius

`number`

##### innerRadius?

`number` = `...`

##### color?

`number` = `0xffffff`

##### alpha?

`number` = `1`

#### Returns

`number`

***

### addText()

> **addText**(`x`, `y`, `text`, `style?`, `fontKey?`): [`Text`](Text.md)

Defined in: [core/src/scene/Scene.ts:358](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L358)

テキストを生成します。
指定したフォントアトラスが存在する場合は自動で接続します。

#### Parameters

##### x

`number`

##### y

`number`

##### text

`string`

##### style?

[`TextStyle`](../interfaces/TextStyle.md) = `{}`

##### fontKey?

`string` = `'default'`

createFont() で登録したキー

#### Returns

[`Text`](Text.md)

***

### addTriangle()

> **addTriangle**(`x`, `y`, `width`, `height`, `color?`, `alpha?`): `number`

Defined in: [core/src/scene/Scene.ts:541](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L541)

三角形 (Phaser 互換の `add.triangle`)

#### Parameters

##### x

`number`

##### y

`number`

##### width

`number`

##### height

`number`

##### color?

`number` = `0xffffff`

##### alpha?

`number` = `1`

#### Returns

`number`

***

### create()

> **create**(): `void`

Defined in: [core/src/scene/Scene.ts:729](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L729)

#### Returns

`void`

***

### createFont()

> **createFont**(`key?`, `options?`): [`FontAtlas`](FontAtlas.md)

Defined in: [core/src/scene/Scene.ts:335](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L335)

フォントアトラスを生成し、Text から参照できるようにします。

生成は 1 度だけで、以降は Text.setGlyphSource() へ渡して再利用できます。

#### Parameters

##### key?

`string` = `'default'`

アトラスのキャッシュキー

##### options?

[`FontAtlasOptions`](../interfaces/FontAtlasOptions.md) = `{}`

#### Returns

[`FontAtlas`](FontAtlas.md)

***

### fixedUpdate()

> **fixedUpdate**(`fixedDt`): `void`

Defined in: [core/src/scene/Scene.ts:733](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L733)

#### Parameters

##### fixedDt

`number`

#### Returns

`void`

***

### getBody()

> **getBody**(`target`): [`Body`](Body.md)

Defined in: [core/src/scene/Scene.ts:244](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L244)

スプライトの物理ボディを取得します (Phaser 互換の `sprite.body`)。

ハンドルなので毎フレーム new しません。同じ ID なら同じ
インスタンスを返します。

#### Parameters

##### target

物理ボディを取得したいスプライト

###### id

`number`

#### Returns

[`Body`](Body.md)

***

### getBodyById()

> **getBodyById**(`entityId`): [`Body`](Body.md)

Defined in: [core/src/scene/Scene.ts:252](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L252)

疎添字 ID から Body ハンドルを取得します。
内部でキャッシュし、同じ ID なら同じインスタンスを返します。

#### Parameters

##### entityId

`number`

#### Returns

[`Body`](Body.md)

***

### getContainer()

> **getContainer**(`entityId`): [`Container`](Container.md)

Defined in: [core/src/scene/Scene.ts:266](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L266)

コンテナハンドル (Phaser 互換の `sprite` を `Container` で包む) を取得します。
キャッシュするため、同じ ID なら毎回同じインスタンスを返します。

#### Parameters

##### entityId

`number`

#### Returns

[`Container`](Container.md)

***

### getFont()

> **getFont**(`key?`): [`FontAtlas`](FontAtlas.md)

Defined in: [core/src/scene/Scene.ts:348](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L348)

登録済みフォントを取得します。

#### Parameters

##### key?

`string` = `'default'`

#### Returns

[`FontAtlas`](FontAtlas.md)

***

### hasSubsystem()

> **hasSubsystem**(`bit`): `boolean`

Defined in: [core/src/scene/Scene.ts:124](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L124)

サブシステムが初期化済みかどうかを返します。

#### Parameters

##### bit

`number`

#### Returns

`boolean`

***

### init()

> **init**(): `void`

Defined in: [core/src/scene/Scene.ts:728](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L728)

#### Returns

`void`

***

### markSubsystem()

> **markSubsystem**(`bit`): `void`

Defined in: [core/src/scene/Scene.ts:135](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L135)

サブシステムを有効化します。

プラグインが自分のサブシステムを登録するために使います。
Plugin は自前で update を定義してもよいですが、
ビットを立てておけばプロファイラで有効状態が可視化されます。

#### Parameters

##### bit

`number`

#### Returns

`void`

***

### pickAll()

> **pickAll**(`out`): `number`

Defined in: [core/src/scene/Scene.ts:860](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L860)

ポインタ位置にあるエンティティの ID を返します (重複を許容)。
結果は `out` に書き込まれ、ヒット数が返ります。

#### Parameters

##### out

`Int32Array`

#### Returns

`number`

***

### pickTop()

> **pickTop**(): `number`

Defined in: [core/src/scene/Scene.ts:851](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L851)

現在のポインタ位置にあるエンティティの ID を返します。
手前のエンティティを優先し、1 つも無ければ -1 を返します。

#### Returns

`number`

***

### preload()

> **preload**(): `void`

Defined in: [core/src/scene/Scene.ts:727](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L727)

#### Returns

`void`

***

### registerPlugin()

> **registerPlugin**(`plugin`): `void`

Defined in: [core/src/scene/Scene.ts:842](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L842)

#### Parameters

##### plugin

[`Plugin`](../interfaces/Plugin.md)

#### Returns

`void`

***

### setCameraFollowTarget()

> **setCameraFollowTarget**(`id`, `x`, `y`): `void`

Defined in: [core/src/scene/Scene.ts:107](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L107)

カメラの追従対象を設定します。

既存の startFollow(target) を使う場合は ID だけで十分ですが、
ワールド座標を明示したい場合はこちらを使います。

#### Parameters

##### id

`number`

追従対象の ID (-1 で解除)

##### x

`number`

追従対象の世界座標 X

##### y

`number`

追従対象の世界座標 Y

#### Returns

`void`

***

### setPaused()

> **setPaused**(`paused`): `void`

Defined in: [core/src/scene/Scene.ts:738](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L738)

#### Parameters

##### paused

`boolean`

#### Returns

`void`

***

### setSoundManager()

> **setSoundManager**(`manager`): `void`

Defined in: [core/src/scene/Scene.ts:198](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L198)

外部で生成した SoundManager を差し込みます。

プラグイン (SoundPlugin) が SoundManager を自前で持つ場合に、
Scene の遅延サブシステムと二重に作らないために使います。
ビットをここで立てるので、毎フレームの update も確実に走ります。

#### Parameters

##### manager

[`SoundManager`](SoundManager.md)

#### Returns

`void`

***

### shutdown()

> **shutdown**(): `void`

Defined in: [core/src/scene/Scene.ts:736](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L736)

#### Returns

`void`

***

### sysCreate()

> **sysCreate**(): `void`

Defined in: [core/src/scene/Scene.ts:768](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L768)

#### Returns

`void`

***

### sysFixedUpdate()

> **sysFixedUpdate**(`fixedDt`): `void`

Defined in: [core/src/scene/Scene.ts:834](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L834)

#### Parameters

##### fixedDt

`number`

#### Returns

`void`

***

### sysInit()

> **sysInit**(`engine`): `void`

Defined in: [core/src/scene/Scene.ts:759](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L759)

#### Parameters

##### engine

[`PlutoEngine`](PlutoEngine.md)

#### Returns

`void`

***

### sysShutdown()

> **sysShutdown**(): `void`

Defined in: [core/src/scene/Scene.ts:746](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L746)

#### Returns

`void`

***

### sysUpdate()

> **sysUpdate**(`dt`): `void`

Defined in: [core/src/scene/Scene.ts:777](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L777)

#### Parameters

##### dt

`number`

#### Returns

`void`

***

### update()

> **update**(`dt`): `void`

Defined in: [core/src/scene/Scene.ts:730](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/scene/Scene.ts#L730)

#### Parameters

##### dt

`number`

#### Returns

`void`
