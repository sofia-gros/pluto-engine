/**
 * @file InstanceBufferArena.ts
 * @description
 * ゼロアロケーションのための SoA (Structure of Arrays) アリーナ。
 * Sparse Set (Swap-Remove) パターンを導入し、アクティブなエンティティが常に 0〜activeCount-1 に密(Dense)に配置されるようにします。
 * また、Dirty Flag を用いて変更があった属性のみをGPUに転送します。
 */

export class InstanceBufferArena {
  public readonly capacity: number;
  private _activeCount = 0;

  // --- SoA Arrays (Dense, 常に 0 ~ activeCount - 1 にデータが詰まる) ---
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
  public readonly tint: Uint32Array; 

  // --- Hierarchy ---
  public readonly parentId: Int32Array;
  public readonly localX: Float32Array;
  public readonly localY: Float32Array;
  public readonly localRotation: Float32Array;

  // --- Interaction ---
  public readonly interactive: Uint8Array;
  public readonly hitWidth: Float32Array;
  public readonly hitHeight: Float32Array;

  // --- Sparse Set Mapping ---
  // idToIndex[ID] = Dense Array Index
  // indexToId[Dense Array Index] = ID
  public readonly idToIndex: Int32Array;
  public readonly indexToId: Int32Array;
  
  // --- Dirty Flags (属性ごとの変更検知) ---
  public dirtyPos = true;
  public dirtyScale = true;
  public dirtyUv = true;
  public dirtyFrameIdx = true;
  public dirtyTint = true;

  // --- Free List (IDの再利用管理) ---
  private readonly freeList: Int32Array;
  private freeListHead = 0;

  constructor(maxInstances: number) {
    this.capacity = maxInstances;

    // SoA Arrays
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

    this.interactive = new Uint8Array(maxInstances);
    this.hitWidth = new Float32Array(maxInstances);
    this.hitHeight = new Float32Array(maxInstances);

    this.idToIndex = new Int32Array(maxInstances).fill(-1);
    this.indexToId = new Int32Array(maxInstances).fill(-1);

    this.freeList = new Int32Array(maxInstances);
    for (let i = 0; i < maxInstances; i++) {
      this.freeList[i] = i;
    }
  }

  public allocate(): number {
    if (this.freeListHead >= this.capacity) {
      return -1;
    }

    const id = this.freeList[this.freeListHead++];
    const idx = this._activeCount++;

    this.idToIndex[id] = idx;
    this.indexToId[idx] = id;

    this.posX[idx] = 0.0;
    this.posY[idx] = 0.0;
    this.rotation[idx] = 0.0;
    this.scale[idx] = 1.0;
    this.facing[idx] = 1.0;
    this.tint[idx] = 0xffffffff;
    this.parentId[idx] = -1;
    this.localX[idx] = 0.0;
    this.localY[idx] = 0.0;
    this.localRotation[idx] = 0.0;
    this.interactive[idx] = 0;
    this.hitWidth[idx] = 0.0;
    this.hitHeight[idx] = 0.0;

    // Allocate時に全属性が変更されるためDirtyフラグを立てる
    this.dirtyPos = true;
    this.dirtyScale = true;
    this.dirtyUv = true;
    this.dirtyFrameIdx = true;
    this.dirtyTint = true;

    return id;
  }

  public free(id: number): void {
    const idx = this.idToIndex[id];
    if (idx < 0 || idx >= this._activeCount) {
      return; 
    }

    const lastIdx = this._activeCount - 1;

    // Swap with the last active element if it's not the last one
    if (idx !== lastIdx) {
      const lastId = this.indexToId[lastIdx];

      this.posX[idx] = this.posX[lastIdx];
      this.posY[idx] = this.posY[lastIdx];
      this.rotation[idx] = this.rotation[lastIdx];
      this.scale[idx] = this.scale[lastIdx];
      this.facing[idx] = this.facing[lastIdx];
      this.uvX[idx] = this.uvX[lastIdx];
      this.uvY[idx] = this.uvY[lastIdx];
      this.uvW[idx] = this.uvW[lastIdx];
      this.uvH[idx] = this.uvH[lastIdx];
      this.frameIdx[idx] = this.frameIdx[lastIdx];
      this.tint[idx] = this.tint[lastIdx];
      this.parentId[idx] = this.parentId[lastIdx];
      this.localX[idx] = this.localX[lastIdx];
      this.localY[idx] = this.localY[lastIdx];
      this.localRotation[idx] = this.localRotation[lastIdx];
      this.interactive[idx] = this.interactive[lastIdx];
      this.hitWidth[idx] = this.hitWidth[lastIdx];
      this.hitHeight[idx] = this.hitHeight[lastIdx];

      this.idToIndex[lastId] = idx;
      this.indexToId[idx] = lastId;
    }

    this.idToIndex[id] = -1;
    this.indexToId[lastIdx] = -1;
    this._activeCount--;
    
    // データ配列がずれるためDirtyフラグを立てる
    this.dirtyPos = true;
    this.dirtyScale = true;
    this.dirtyUv = true;
    this.dirtyFrameIdx = true;
    this.dirtyTint = true;

    this.freeList[--this.freeListHead] = id;
  }

  public get activeCount(): number {
    return this._activeCount;
  }

  public clear(): void {
    this._activeCount = 0;
    this.freeListHead = 0;
    this.idToIndex.fill(-1);
    this.indexToId.fill(-1);
    this.parentId.fill(-1);

    for (let i = 0; i < this.capacity; i++) {
      this.freeList[i] = i;
    }
  }
}
