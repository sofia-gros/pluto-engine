/**
 * @file TweenManager.ts
 * @description
 * ゼロアロケーションを目指したデータ指向 (SoA) トゥイーンシステム。
 * アリーナ内のエンティティのプロパティ（x, y, scale, tint, alpha）を直接書き換えます。
 */

import type { InstanceBufferArena } from '../arena/InstanceBufferArena';

export enum TweenProperty {
  X = 0,
  Y = 1,
  SCALE = 2,
  TINT = 3,
  ALPHA = 4,
}

export class TweenManager {
  public readonly capacity: number;
  private _activeCount = 0;

  // --- SoA Arrays ---
  public readonly active: Uint8Array;
  public readonly entityId: Int32Array;
  public readonly propType: Uint8Array;
  public readonly startVal: Float32Array;
  public readonly endVal: Float32Array;
  public readonly duration: Float32Array;
  public readonly elapsed: Float32Array;

  // Free List
  private readonly freeList: Int32Array;
  private freeListHead = 0;

  private _arena: InstanceBufferArena;

  constructor(arena: InstanceBufferArena, maxTweens = 10000) {
    this._arena = arena;
    this.capacity = maxTweens;

    this.active = new Uint8Array(maxTweens);
    this.entityId = new Int32Array(maxTweens);
    this.propType = new Uint8Array(maxTweens);
    this.startVal = new Float32Array(maxTweens);
    this.endVal = new Float32Array(maxTweens);
    this.duration = new Float32Array(maxTweens);
    this.elapsed = new Float32Array(maxTweens);

    this.freeList = new Int32Array(maxTweens);
    for (let i = 0; i < maxTweens; i++) {
      this.freeList[i] = i;
    }
  }

  /**
   * トゥイーンを追加します。
   */
  public add(
    entityId: number,
    propType: TweenProperty,
    startVal: number,
    endVal: number,
    durationMs: number,
  ): number {
    if (this.freeListHead >= this.capacity) {
      return -1; // 枯渇
    }

    const id = this.freeList[this.freeListHead++];
    this.active[id] = 1;
    this._activeCount++;

    this.entityId[id] = entityId;
    this.propType[id] = propType;
    this.startVal[id] = startVal;
    this.endVal[id] = endVal;
    this.duration[id] = durationMs;
    this.elapsed[id] = 0.0;

    return id;
  }

  /**
   * トゥイーンを解放します。
   */
  public free(id: number): void {
    if (id < 0 || id >= this.capacity || this.active[id] === 0) return;

    this.active[id] = 0;
    this._activeCount--;
    this.freeList[--this.freeListHead] = id;
  }

  /**
   * 全てのトゥイーンを更新し、エンティティのプロパティに適用します。
   * @param dt デルタタイム (ミリ秒)
   */
  public update(dt: number): void {
    if (this._activeCount === 0) return;

    for (let i = 0; i < this.capacity; i++) {
      if (this.active[i] === 0) continue;

      this.elapsed[i] += dt;
      let t = this.elapsed[i] / this.duration[i];
      if (t >= 1.0) {
        t = 1.0;
      }

      const eId = this.entityId[i];
      if (eId >= 0 && this.active[i]) {
        const val = this.startVal[i] + (this.endVal[i] - this.startVal[i]) * t;

        switch (this.propType[i]) {
          case TweenProperty.X:
            this._arena.posX[eId] = val;
            break;
          case TweenProperty.Y:
            this._arena.posY[eId] = val;
            break;
          case TweenProperty.SCALE:
            this._arena.scale[eId] = val;
            break;
          case TweenProperty.TINT:
            this._arena.tint[eId] = val >>> 0; // Float32 から Uint32 への変換
            break;
          case TweenProperty.ALPHA:
            // 今回のArenaにAlphaプロパティがないため、TintのAlpha領域に書き込む等の実装を想定
            break;
        }
      }

      // トゥイーン終了
      if (t >= 1.0) {
        this.free(i);
      }
    }
  }

  public clear(): void {
    this._activeCount = 0;
    this.freeListHead = 0;
    this.active.fill(0);
    for (let i = 0; i < this.capacity; i++) {
      this.freeList[i] = i;
    }
  }
}
