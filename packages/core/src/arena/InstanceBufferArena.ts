/**
 * @file InstanceBufferArena.ts
 * @description
 * ゼロアロケーションを実現するための SoA (Structure of Arrays) メモリアリーナ。
 * スプライトやエンティティのトランスフォーム、色、UVデータなどをフラットな型付き配列として事前確保し、
 * 動的なオブジェクト生成 (new) を防ぎます。
 */

export class InstanceBufferArena {
  public readonly capacity: number;
  private _activeCount = 0;

  // --- SoA Arrays ---
  public readonly posX: Float32Array;
  public readonly posY: Float32Array;
  public readonly rotation: Float32Array;
  public readonly scale: Float32Array;
  public readonly facing: Float32Array;
  public readonly uvX: Float32Array;
  public readonly uvY: Float32Array;
  public readonly uvW: Float32Array;
  public readonly uvH: Float32Array;
  public readonly frameIdx: Float32Array;
  public readonly tint: Uint32Array; // 0xAABBGGRR 形式などを想定

  // --- Hierarchy ---
  public readonly parentId: Int32Array;
  public readonly localX: Float32Array;
  public readonly localY: Float32Array;
  public readonly localRotation: Float32Array;

  // 生存フラグ
  public readonly active: Uint8Array;

  // --- Free List (再利用のためのインデックス管理) ---
  private readonly freeList: Int32Array;
  private freeListHead = 0;

  /**
   * 指定された最大エンティティ数でアリーナを初期化します。
   * @param maxInstances 確保する最大インスタンス数
   */
  constructor(maxInstances: number) {
    this.capacity = maxInstances;

    // メモリの一括確保
    this.posX = new Float32Array(maxInstances);
    this.posY = new Float32Array(maxInstances);
    this.rotation = new Float32Array(maxInstances);
    this.scale = new Float32Array(maxInstances);
    this.facing = new Float32Array(maxInstances);
    this.uvX = new Float32Array(maxInstances);
    this.uvY = new Float32Array(maxInstances);
    this.uvW = new Float32Array(maxInstances);
    this.uvH = new Float32Array(maxInstances);
    this.frameIdx = new Float32Array(maxInstances);
    this.tint = new Uint32Array(maxInstances);

    this.parentId = new Int32Array(maxInstances).fill(-1);
    this.localX = new Float32Array(maxInstances);
    this.localY = new Float32Array(maxInstances);
    this.localRotation = new Float32Array(maxInstances);

    this.active = new Uint8Array(maxInstances);

    this.freeList = new Int32Array(maxInstances);

    // 空きリストの初期化（最初はすべてのインデックスが空き）
    // 0, 1, 2, ..., maxInstances - 1
    for (let i = 0; i < maxInstances; i++) {
      this.freeList[i] = i;
    }
  }

  /**
   * 新しいインスタンス用のインデックス（ハンドル）を確保します。
   * アロケーション失敗時（枯渇時）は -1 を返します。
   * @returns 確保されたインデックス（ID）
   */
  public allocate(): number {
    if (this.freeListHead >= this.capacity) {
      // 枯渇
      return -1;
    }

    const id = this.freeList[this.freeListHead++];
    this.active[id] = 1;
    this._activeCount++;

    // デフォルト値の初期化
    this.posX[id] = 0.0;
    this.posY[id] = 0.0;
    this.rotation[id] = 0.0;
    this.scale[id] = 1.0;
    this.facing[id] = 1.0;
    this.tint[id] = 0xffffffff; // 白 (RGBA)
    this.parentId[id] = -1;
    this.localX[id] = 0.0;
    this.localY[id] = 0.0;
    this.localRotation[id] = 0.0;

    return id;
  }

  /**
   * 使用済みのインデックスを解放し、再利用可能にします。
   * @param id 解放するインデックス
   */
  public free(id: number): void {
    if (id < 0 || id >= this.capacity || this.active[id] === 0) {
      return; // 無効なID、または既に解放済み
    }

    this.active[id] = 0;
    this._activeCount--;
    this.parentId[id] = -1;

    // 空きリストに戻す
    this.freeList[--this.freeListHead] = id;
  }

  /**
   * 現在アクティブなエンティティの数を取得します。
   */
  public get activeCount(): number {
    return this._activeCount;
  }

  /**
   * すべてのエンティティを解放します（メモリ空間は維持されます）。
   */
  public clear(): void {
    this._activeCount = 0;
    this.freeListHead = 0;
    this.active.fill(0);
    this.parentId.fill(-1);

    for (let i = 0; i < this.capacity; i++) {
      this.freeList[i] = i;
    }
  }
}
