# PlutoEngine 公式マニュアル (AI & 開発者向け)

PlutoEngine は、**「GC（ガベージコレクション）を完全に排除し、JavaScript上で10万体のエンティティを60FPS/144FPSで動かす」** ことを目的とした究極のデータ指向(SoA)・2Dゲームエンジンです。

このドキュメントは、人間および AI（サブエージェント等）がこのエンジンを利用してゲームを実装するための「絶対的なルールとAPIリファレンス」です。

## 1. コア概念: ゼロアロケーションと SoA
PlutoEngine では、`new Sprite()` などのオブジェクト生成は**初期化時にしか行われません**。
ゲームループ（`update` 等）の内部で新しくオブジェクトを作ったり、配列に `push()` したりすることは**厳禁**です。

すべてのエンティティのデータ（座標、スケール、色など）は `InstanceBufferArena` 内部の `Float32Array` にフラットに保存されています。

## 2. API リファレンス

### 2.1 PlutoEngine と Scene クラス (`@pluto-engine/core`)
`PlutoEngine` がエントリポイントとなり、`Scene` がゲームのロジックを担当します。Phaser と完全に同じDXで構築できます。

```typescript
import { PlutoEngine, Scene } from '@pluto-engine/core';
import { XPBDSolver } from '@pluto-engine/xpbd'; // プラグイン例

class MyGame extends Scene {
  create() {
    this.registerPlugin(new XPBDSolver());
    const sprite = this.add.sprite();
    sprite.x = 100;
  }
}

// ゲーム起動
const game = new PlutoEngine({
  canvas: document.getElementById('game-canvas'),
  maxInstances: 100000,
  scene: [MyGame]
});
```

### 2.2 プラグインシステム (`Plugin` インターフェース)
物理演算や AI を Scene に組み込むためのインターフェースです。
```typescript
interface Plugin {
  init?(scene: Scene): void;
  update?(dt: number): void;
  fixedUpdate?(fixedDt: number): void;
  destroy?(): void;
}
```

### 2.3 空間ハッシュ (`@pluto-engine/morton`)
Morton空間ハッシュを用いて、数万体の近傍探索を $O(1)$ で行います。
```typescript
import { MortonSpatialHash } from '@pluto-engine/morton';
// 内部でUint32Arrayなどを使い、ゼロアロケで実装されています。
```

### 2.4 物理ソルバ (`@pluto-engine/xpbd`, `@pluto-engine/verlet-ik`)
- `XPBDSolver`: 位置ベース動力学。敵同士の「めり込み反発」を一括計算します。
- `VerletSolver`: マントや触手など、点の距離制約を用いた軽量なIK。

### 2.5 レンダラ (`@pluto-engine/renderer`)
WebGL2 と WebGPU を抽象化した統合レンダラです。
```typescript
import { createGraphicsDevice } from '@pluto-engine/renderer';

const canvas = document.getElementById('game-canvas');
const device = await createGraphicsDevice(canvas);

// 毎フレームの描画時に呼ばれるループなどで：
// Arenaの配列データをそのままGPUに転送（ゼロアロケーション）
device.updateBuffer(scene.arena.posX); 
```

## 3. アプリケーション実装のルール (apps/demo 作成時など)
1. **HTML側**: UI（Tailwind等）はHTMLに記述し、Canvasは全画面に広げます。
2. **ゲームロジック**: `Scene` を継承またはラップしたクラスを作り、`update(dt)` 内でキャラクターの移動ロジックを書きます。
3. **破棄と再利用**: 敵が死んだときは `sprite.destroy()` を呼ぶことでアリーナのIDがフリーリストに戻り、次に `scene.add.sprite()` を呼んだときにオブジェクトを作らずに再利用されます。
