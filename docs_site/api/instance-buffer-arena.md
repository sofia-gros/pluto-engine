# InstanceBufferArena API リファレンス

`InstanceBufferArena` は、ゼロアロケーションと SoA (Structure of Arrays) パターンを実現する、PlutoEngine の中核となるデータ管理クラスです。
エンティティのすべてのデータはフラットな `Float32Array` や `Uint8Array` などに格納され、オブジェクトの生成・破棄によるガベージコレクションを回避します。

## 設計思想

- **ゼロアロケーション**: コンストラクタ以外でヒープメモリを確保しません。
- **データ指向設計**: 属性ごとに配列を持つ SoA 構成により、CPU キャッシュ効率を最大化します。
- **Packed Mirrors**: GPU 転送用に vec4 単位で詰められたミラー配列を保持し、高速な転送を実現します。

## プロパティ (SoA Arrays)

各プロパティは密(Dense)なTypedArrayであり、インデックス `0` から `activeCount - 1` までにデータが詰まっています。

- `posX: Float32Array`, `posY: Float32Array`
- `rotation: Float32Array`
- `scaleX: Float32Array`, `scaleY: Float32Array`
- `frameWidth: Float32Array`, `frameHeight: Float32Array`
- `depth: Float32Array`, `visible: Float32Array`
- `tint: Uint32Array`
- `uvX`, `uvY`, `uvW`, `uvH`: `Float32Array`
- `originX`, `originY`: `Float32Array`
- `scrollFactorX`, `scrollFactorY`: `Float32Array`

## メソッド

### `allocate(): number`
空きスロットから新しいエンティティ用のID（疎添字ID）を確保し、初期化して返します。

### `free(id: number): void`
指定したエンティティIDを解放します。末尾の要素との Swap-Remove によって密配列の隙間を埋めます。

### `partitionVisible(minX, minY, maxX, maxY): number`
指定した矩形と交差する可視インスタンスを配列の先頭へ移動させます。
これにより、1回の `drawInstanced` で可視範囲のみを描画するGPUカリングの下準備をCPUで行います。

### Write-through セッター群

SoA 配列への直接代入は禁止されています。必ず以下のセッターを通すことで、GPU転送用のPackedミラーにも同時に値が書き込まれます。

- `setPosX(i: number, v: number): void`
- `setPosY(i: number, v: number): void`
- `setScaleX(i: number, v: number): void`
- `setScaleY(i: number, v: number): void`
- `setScale(i: number, x: number, y?: number): void`
- `setRotation(i: number, v: number): void`
- `setDepth(i: number, v: number): void`
- `setTint(i: number, v: number): void`
- `setVisible(i: number, v: number): void`
- `setOrigin(i: number, x: number, y?: number): void`
- `setScrollFactor(i: number, x: number, y?: number): void`

※ `i` は密添字（Dense Array Index）です。疎添字IDからは `arena.idToIndex[id]` で取得します。

## 階層・シーングラフ

親子関係はツリー構造ではなく、SoA の `parentId` 配列を使って表現されます。
- `setParentId(id: number, parentId: number): void`
- `getParentId(id: number): number`
- `computeWorldTransforms(): void`
  毎フレーム呼び出され、ローカル座標をワールド座標へ畳み込みます。
