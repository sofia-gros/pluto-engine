# シーンとアリーナメモリ管理 (Scene & Arena)

PlutoEngineにおいて、「シーン」とは事前確保されたコンポーネントデータの集合体（アリーナ）と、それらを操作するシステムのセットを指します。

## アリーナ (Arena) によるメモリ管理

オブジェクトの生成と破棄によるフラグメンテーションとGCスパイクを防ぐため、PlutoEngineは独自のアリーナアロケータを使用します。

### Structure of Arrays (SoA)

エンティティは単なる整数型の「ID」に過ぎません。その実体となるデータは、コンポーネントごとに独立した TypedArray の同一インデックス位置に保存されます。

```typescript
// 内部的なイメージ (SoA)
const positionsX = new Float32Array(MAX_ENTITIES);
const positionsY = new Float32Array(MAX_ENTITIES);
const velocitiesX = new Float32Array(MAX_ENTITIES);
const velocitiesY = new Float32Array(MAX_ENTITIES);

// Entity ID = 42 の更新
positionsX[42] += velocitiesX[42] * dt;
positionsY[42] += velocitiesY[42] * dt;
```

これにより、CPUのキャッシュヒット率が劇的に向上し、SIMDライクな連続メモリアクセスが可能になります。

## エンティティのライフサイクル

エンティティの「生成」は、空いているID（フリーリスト）から一つを取得し、対応する配列の値を初期化するだけの処理です。「破棄」は、そのIDをフリーリストに戻すだけです。

1. **Spawn**: フリーリストからIDをPop。各コンポーネント配列の対象インデックスをリセット。
2. **Update**: システムが全ての有効なIDをループ処理。
3. **Despawn**: IDをフリーリストにPushし、再利用可能にする。
