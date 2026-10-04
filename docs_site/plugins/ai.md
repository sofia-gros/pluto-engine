# AIとビヘイビアツリー (AI Behavior)

> **v1.2.1 の注意点**: PlutoEngine は現在、最大限のパフォーマンスを引き出すために WebGPU、`InstanceBufferArena`、SoA、および Flyweight pattern (Zero-Allocation) を利用しています。

数千から数万体のエンティティを同時に動作させる場合、オブジェクト指向による状態遷移（ステートマシン）やノードベースのAIは、メモリポインタの追跡や関数呼び出しのオーバーヘッドでパフォーマンスが崩壊します。

## PlutoEngine v1.2.1 のフラットなデータ駆動AI

PlutoEngineのAIプラグインは、ロジックツリーをメモリ上の「命令配列（バイトコード）」としてフラット化して扱います。すべてのデータはSoA（Structure of Arrays）アーキテクチャに準拠し、ゼロアロケーションで実行されます。

1. **ビヘイビアのコンパイル**
   ノードベースやJSONで定義されたAIの挙動は、初期化時に一次元の命令セット（ `Uint16Array` または `Uint32Array` ）にコンパイルされます。
2. **命令ポインタの管理**
   各エンティティのAIコンポーネントは、巨大な状態オブジェクトを持つ代わりに、SoAアリーナ上で「現在実行中の命令インデックス」と「数個のレジスタ」だけを保持します。
3. **バッチ実行**
   CPUは同一のAIパターンを持つエンティティの配列を連続して走査し、Switch文やルックアップテーブルを用いて命令をシーケンシャルに処理します。ループ内で `new` キーワードやオブジェクトの確保は一切行われません。

## Standalone Usage

```typescript
import { UtilityAISystem } from '@pluto-engine/ai';
const solver = new UtilityAISystem();
```

## Plugin Usage (this.registerPlugin)

```typescript
import { AiPlugin } from '@pluto-engine/ai';

class MyScene extends Scene {
  constructor() {
    super();
    this.registerPlugin(new AiPlugin());
  }

  update() {
    // SoAアリーナによるゼロアロケーション更新
    // ループ内で動的なメモリ確保（new）を行わずに状態を更新します
    const count = this.arena.activeCount;
    for (let i = 0; i < count; i++) {
      this.ai.process(this.arena.aiState[i]);
    }
  }
}
```
