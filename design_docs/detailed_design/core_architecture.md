# PlutoEngine コアアーキテクチャ詳細設計

## 1. 概要
PlutoEngineのコアアーキテクチャは、Web環境において極限のパフォーマンスを引き出すため、**ガベージコレクション(GC)の根絶**と**メモリ局所性の最大化**を設計の主軸としています。これを実現するために、Structure of Arrays (SoA) に基づくフラットなメモリ管理と、オブジェクトのインスタンス化を避けるFlyweightパターン（ハンドルベースのアクセス）を採用しています。最新の数学的アルゴリズム（XPBD等）への応用も見据えた設計です。

## 2. メモリ管理: Structure of Arrays (SoA)
すべてのコンポーネントデータは、JavaScriptのオブジェクトとしてではなく、単一または複数の連続した `TypedArray`（主に `Float32Array`）上でSoA形式として管理されます。これにより、キャッシュヒット率の向上、およびWebGL2/WebGPUへの直接的なデータ転送が可能になります。

### 2.1 Float32Arrayによるレイアウト設計
エンティティのトランスフォーム（位置、回転、スケール）を例にとると、以下のようにバッファを設計します。

```typescript
/**
 * トランスフォームデータをSoA形式で管理するコンポーネントマネージャー。
 * GCを回避するため、固定長バッファまたは手動拡張バッファを使用する。
 */
class TransformManager {
    /** 確保する最大エンティティ数 */
    private capacity: number;
    /** 現在の有効なエンティティ数 */
    public count: number;

    // SoAレイアウト: 各プロパティごとに独立したFloat32Arrayを割り当て
    public positionX: Float32Array; // オフセット 0
    public positionY: Float32Array; // オフセット 1
    public rotation: Float32Array;  // オフセット 2
    public scaleX: Float32Array;    // オフセット 3
    public scaleY: Float32Array;    // オフセット 4

    /**
     * @param initialCapacity 初期確保する要素数
     */
    constructor(initialCapacity: number = 10000) {
        this.capacity = initialCapacity;
        this.count = 0;
        
        // メモリの一括確保 (エンティティ数 × プロパティ数 × 4バイト)
        const buffer = new ArrayBuffer(this.capacity * 5 * 4);
        
        this.positionX = new Float32Array(buffer, 0, this.capacity);
        this.positionY = new Float32Array(buffer, this.capacity * 4, this.capacity);
        this.rotation  = new Float32Array(buffer, this.capacity * 8, this.capacity);
        this.scaleX    = new Float32Array(buffer, this.capacity * 12, this.capacity);
        this.scaleY    = new Float32Array(buffer, this.capacity * 16, this.capacity);
    }
}
```

## 3. Flyweightハンドルの仕組み
エンティティやコンポーネントにアクセスする際、クラスインスタンスを生成せず、インデックス（整数値）を「ハンドル」として扱います。

### 3.1 ハンドル設計
ハンドルは単なる `number` またはそれをラップした値であり、特定のエンティティやデータを指し示すインデックス/ポインタの役割を果たします。これにより、オブジェクト生成のオーバーヘッドとGCの発生を完全に排除します。

```typescript
/**
 * エンティティを一意に識別するハンドル（実態はインデックス）
 */
type EntityHandle = number;

/**
 * トランスフォームを操作するためのFlyweightファサード。
 * このクラスのインスタンスは使い回され、新たにインスタンス化されることはありません。
 */
class TransformAccessor {
    private manager: TransformManager;
    private currentHandle: EntityHandle = -1;

    constructor(manager: TransformManager) {
        this.manager = manager;
    }

    /**
     * 操作対象のエンティティハンドルをバインドする。
     * @param handle 対象のエンティティ
     */
    public bind(handle: EntityHandle): void {
        this.currentHandle = handle;
    }

    // セッター/ゲッターを通じたシームレスなアクセス
    get x(): number { return this.manager.positionX[this.currentHandle]; }
    set x(val: number) { this.manager.positionX[this.currentHandle] = val; }
    
    get y(): number { return this.manager.positionY[this.currentHandle]; }
    set y(val: number) { this.manager.positionY[this.currentHandle] = val; }
}
```

## 4. 将来の拡張性
- **SharedArrayBufferへの移行**: Web Workerを利用したマルチスレッド処理（例えばXPBDや連続体群集理論の並列化）を将来導入する際、基盤となる `ArrayBuffer` を `SharedArrayBuffer` に差し替えるだけでデータ競合を回避しつつ並列処理が可能になります。
- **動的拡張**: 初期キャパシティを超えた場合、新しい大きなバッファを確保し、既存のデータを `TypedArray.prototype.set()` で高速コピーするアロケータ機構を整備します。
- **エンティティ削除と再利用**: 削除されたエンティティのハンドル（インデックス）はフリーリストで管理し、新たなエンティティ追加時に再利用することで配列の断片化を防ぎます。

## 5. アニメーション: TweenManagerにおけるデータ指向設計
PlutoEngineのアニメーション（Tween）機能も、完全にData-Oriented Design (SoA) に基づいて実装されています。
従来のゲームエンジンではTweenをオブジェクトとしてヒープにアロケーションしますが、`TweenManager` ではすべてのTweenステート（進行度、開始値、終了値、対象のエンティティハンドル、イージングタイプなど）を事前確保された `Float32Array` (SoA) に保存します。
更新ループにおいては、オブジェクトの確保やGCを一切発生させることなく、メモリ（アリーナ）を直接ミューテート（更新）することで、数万単位の並列Tweenをゼロアロケーションかつ超高速に処理します。

## 6. アセット管理: LoaderManagerの目標
`LoaderManager` は、画像、音声、フォントなどのアセットを効率的にロード・管理するためのシステムです。
主な目標として、並列ロードの最適化と、ロード完了後のデータ（画像ピクセルデータやオーディオバッファ）をSoAベースのメモリアリーナやGPUバッファにゼロコピーに近い形で直接マッピングすることを目指しています。これにより、アセット展開時のメインスレッドのブロックや一時的なオブジェクト生成によるGCスパイクを防ぎます。
