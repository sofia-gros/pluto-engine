/**
 * @file AnimationManager.ts
 * @description
 * ゼロアロケーションを目指したデータ指向 (SoA) アニメーションシステム。
 * アリーナ内のエンティティの UV を直接書き換えてパラパラアニメーションを実現します。
 */

import type { InstanceBufferArena } from '../arena/InstanceBufferArena';
import type { Sprite } from '../arena/Sprite';

export interface AnimationConfig {
  key: string;
  frames: number[];
  frameRate?: number;
  repeat?: number; // -1 for infinite loop
}

interface AnimationData {
  key: string;
  frames: number[];
  frameDuration: number; // ミリ秒単位
  repeat: number;
}

export class AnimationManager {
  public readonly capacity: number;
  private _activeCount = 0;

  // アニメーション定義の保存先
  private _animations: Map<string, AnimationData> = new Map();

  // --- SoA Arrays (再生中の状態) ---
  public readonly active: Uint8Array;
  public readonly entityId: Int32Array;
  public readonly animId: Int32Array;
  public readonly currentFrameIdx: Int32Array;
  public readonly repeatCount: Int32Array;
  public readonly elapsed: Float32Array;

  // フラット化されたアニメーションデータ (参照を高速化するため)
  public readonly refFramesLength: Int32Array;
  public readonly refFrameDuration: Float32Array;
  public readonly refRepeat: Int32Array;
  // フレーム配列は可変長なので、ポインタとフラット配列で管理
  public readonly refFramesPtr: Int32Array;
  private _flatFrames: Int32Array;
  private _flatFramesCount = 0;

  private _animKeyToIndex: Map<string, number> = new Map();
  private _nextAnimIndex = 0;

  // Free List
  private readonly freeList: Int32Array;
  private freeListHead = 0;

  private _arena: InstanceBufferArena;
  private _spriteMap: Map<number, Sprite> = new Map(); // entityId -> Sprite の逆引きキャッシュ (uv更新用)

  constructor(arena: InstanceBufferArena, maxAnims = 10000) {
    this._arena = arena;
    this.capacity = maxAnims;

    this.active = new Uint8Array(maxAnims);
    this.entityId = new Int32Array(maxAnims);
    this.animId = new Int32Array(maxAnims);
    this.currentFrameIdx = new Int32Array(maxAnims);
    this.repeatCount = new Int32Array(maxAnims);
    this.elapsed = new Float32Array(maxAnims);

    this.refFramesLength = new Int32Array(maxAnims);
    this.refFrameDuration = new Float32Array(maxAnims);
    this.refRepeat = new Int32Array(maxAnims);
    this.refFramesPtr = new Int32Array(maxAnims);

    // 仮に全アニメーション合計で最大10万フレーム分の定義を許容
    this._flatFrames = new Int32Array(100000);

    this.freeList = new Int32Array(maxAnims);
    for (let i = 0; i < maxAnims; i++) {
      this.freeList[i] = i;
    }
  }

  /**
   * アニメーションを定義します。配列を渡すことで複数同時定義が可能（JSONからのインポートに最適）。
   */
  public create(configs: AnimationConfig | AnimationConfig[]): void {
    const arr = Array.isArray(configs) ? configs : [configs];

    for (const config of arr) {
      const frameRate = config.frameRate ?? 24;
      const data: AnimationData = {
        key: config.key,
        frames: config.frames,
        frameDuration: 1000 / frameRate,
        repeat: config.repeat ?? 0,
      };

      this._animations.set(config.key, data);

      const animIndex = this._nextAnimIndex++;
      this._animKeyToIndex.set(config.key, animIndex);

      this.refFramesLength[animIndex] = data.frames.length;
      this.refFrameDuration[animIndex] = data.frameDuration;
      this.refRepeat[animIndex] = data.repeat;
      this.refFramesPtr[animIndex] = this._flatFramesCount;

      for (let i = 0; i < data.frames.length; i++) {
        this._flatFrames[this._flatFramesCount++] = data.frames[i];
      }
    }
  }

  /**
   * 指定したスプライトでアニメーションを再生します。
   */
  public play(sprite: Sprite, key: string): void {
    const animIndex = this._animKeyToIndex.get(key);
    if (animIndex === undefined) {
      console.warn(`Animation key not found: ${key}`);
      return;
    }

    // すでに再生中のものがあれば上書き、なければ新規確保
    let playId = -1;
    for (let i = 0; i < this.capacity; i++) {
      if (this.active[i] === 1 && this.entityId[i] === sprite.id) {
        playId = i;
        break;
      }
    }

    if (playId === -1) {
      if (this.freeListHead >= this.capacity) return; // 枯渇
      playId = this.freeList[this.freeListHead++];
      this.active[playId] = 1;
      this._activeCount++;
      this.entityId[playId] = sprite.id;

      // uv更新のためにスプライト参照をキャッシュ
      this._spriteMap.set(sprite.id, sprite);
    }

    this.animId[playId] = animIndex;
    this.currentFrameIdx[playId] = 0;
    this.repeatCount[playId] = 0;
    this.elapsed[playId] = 0.0;

    // 初期フレームを即座に適用
    const ptr = this.refFramesPtr[animIndex];
    const frameNum = this._flatFrames[ptr];
    sprite.setFrame(frameNum);
  }

  private free(id: number): void {
    if (this.active[id] === 0) return;
    this.active[id] = 0;
    this._activeCount--;
    this.freeList[--this.freeListHead] = id;

    this._spriteMap.delete(this.entityId[id]);
  }

  public update(dt: number): void {
    if (this._activeCount === 0) return;

    for (let i = 0; i < this.capacity; i++) {
      if (this.active[i] === 0) continue;

      const eId = this.entityId[i];
      if (eId < 0 || this._arena.idToIndex[eId] < 0) {
        // エンティティが死んでいればアニメーションも終了
        this.free(i);
        continue;
      }

      const aId = this.animId[i];
      const duration = this.refFrameDuration[aId];

      this.elapsed[i] += dt;

      // フレームが切り替わるかチェック
      if (this.elapsed[i] >= duration) {
        this.elapsed[i] -= duration;

        const len = this.refFramesLength[aId];
        this.currentFrameIdx[i]++;

        let isEnded = false;

        // アニメーションの末尾に達したか
        if (this.currentFrameIdx[i] >= len) {
          const maxRepeat = this.refRepeat[aId];
          if (maxRepeat === -1) {
            // 無限ループ
            this.currentFrameIdx[i] = 0;
          } else if (this.repeatCount[i] < maxRepeat) {
            // リピート回数内
            this.repeatCount[i]++;
            this.currentFrameIdx[i] = 0;
          } else {
            // 終了
            isEnded = true;
          }
        }

        if (!isEnded) {
          const ptr = this.refFramesPtr[aId] + this.currentFrameIdx[i];
          const frameNum = this._flatFrames[ptr];
          const sprite = this._spriteMap.get(eId);
          if (sprite) {
            sprite.setFrame(frameNum);
          }
        } else {
          this.free(i);
        }
      }
    }
  }

  public clear(): void {
    this._activeCount = 0;
    this.freeListHead = 0;
    this.active.fill(0);
    this._spriteMap.clear();
    for (let i = 0; i < this.capacity; i++) {
      this.freeList[i] = i;
    }
  }
}
