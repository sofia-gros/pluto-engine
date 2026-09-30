/**
 * @file AnimationManager.ts
 * @description
 * ゼロアロケーションのデータ指向 (SoA) アニメーションシステム。
 *
 * 設計上の掟: Sprite インスタンスへの参照を一切保持しません。
 * アリーナ ID だけを.SoA 配列で管理し、UV の書き戻しは
 * アリーナの密添字へ直接行います。これによりヒープ上の
 * オブジェクトグラフ (Map<id, Sprite>) を生成しません。
 */

import type { InstanceBufferArena } from '../arena/InstanceBufferArena';

export interface AnimationConfig {
  key: string;
  frames: number[];
  frameRate?: number;
  repeat?: number; // -1 は無限ループ
}

interface AnimationData {
  key: string;
  frames: number[];
  /** 1 コマにかかる時間 (秒)。update() が受け取る dt と単位を揃える。 */
  frameDuration: number;
  repeat: number;
}

export class AnimationManager {
  public readonly capacity: number;
  private _activeCount = 0;

  // アニメーション定義の保存先 (初期化時のみ確保)
  private _animations: Map<string, AnimationData> = new Map();
  private _animKeyToIndex: Map<string, number> = new Map();
  private _nextAnimIndex = 0;

  // --- SoA Arrays (再生中の状態) ---
  public readonly active: Uint8Array;
  public readonly entityId: Int32Array;
  public readonly animId: Int32Array;
  public readonly currentFrameIdx: Int32Array;
  public readonly repeatCount: Int32Array;
  public readonly elapsed: Float32Array;

  // フラット化されたアニメーションデータ
  public readonly refFramesLength: Int32Array;
  /**
   * アニメーション定義テーブルです。refFrameDuration の単位は秒です。
   */
  public readonly refFrameDuration: Float32Array;
  public readonly refRepeat: Int32Array;
  public readonly refFramesPtr: Int32Array;
  private _flatFrames: Int32Array;
  private _flatFramesCount = 0;

  // Free List
  private readonly freeList: Int32Array;
  private freeListHead = 0;

  private _arena: InstanceBufferArena;

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

    // 定義は初期化時に確定し、実行中に増やさない
    this._flatFrames = new Int32Array(100000);

    this.freeList = new Int32Array(maxAnims);
    for (let i = 0; i < maxAnims; i++) {
      this.freeList[i] = i;
    }
  }

  /**
   * アニメーションを定義します。配列を渡すことで複数同時定義が可能です。
   */
  public create(configs: AnimationConfig | AnimationConfig[]): void {
    const arr = Array.isArray(configs) ? configs : [configs];

    for (const config of arr) {
      const frameRate = config.frameRate ?? 24;
      const data: AnimationData = {
        key: config.key,
        frames: config.frames,
        // 旧実装はミリ秒で保持していたため dt(秒) に対して 1000 倍遅く進んでいた。
        // 秒に統一して update() の dt と単位を揃える。
        frameDuration: 1 / frameRate,
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
   * 定義済みアニメーションのキー一覧を返します。
   */
  public hasKey(key: string): boolean {
    return this._animKeyToIndex.has(key);
  }

  /**
   * アリーナ ID を指定してアニメーションを再生します。
   * @param id アリーナの ID
   * @param key アニメーションキー
   * @param ignoreIfPlaying true の場合、既に別のアニメーションを再生中なら何もしない
   */
  public play(id: number, key: string, ignoreIfPlaying = false): void {
    const animIndex = this._animKeyToIndex.get(key);
    if (animIndex === undefined) {
      console.warn(`Animation key not found: ${key}`);
      return;
    }

    // 再生中のスロットを探す (上限 maxAnims の走査で GC は発生しない)
    let playId = -1;
    for (let i = 0; i < this.capacity; i++) {
      if (this.active[i] === 1 && this.entityId[i] === id) {
        playId = i;
        break;
      }
    }

    if (playId !== -1 && ignoreIfPlaying) {
      return;
    }

    if (playId === -1) {
      if (this.freeListHead >= this.capacity) return; // 枯渇
      playId = this.freeList[this.freeListHead++];
      this.active[playId] = 1;
      this._activeCount++;
      this.entityId[playId] = id;
    }

    this.animId[playId] = animIndex;
    this.currentFrameIdx[playId] = 0;
    this.repeatCount[playId] = 0;
    this.elapsed[playId] = 0.0;

    // 初期フレームを即座に適用
    const ptr = this.refFramesPtr[animIndex];
    this._applyFrame(id, this._flatFrames[ptr]);
  }

  private free(id: number): void {
    if (this.active[id] === 0) return;
    this.active[id] = 0;
    this._activeCount--;
    this.freeList[--this.freeListHead] = id;
  }

  /**
   * アリーナ ID とシート内のコマ番号から UV を直接書き換えます。
   * Sprite オブジェクトを生成しないため、参照を一切保持せずに済みます。
   */
  private _applyFrame(id: number, frameNum: number): void {
    const idx = this._arena.idToIndex[id];
    if (idx < 0) return;

    const asset = this._arena.assetRef[idx];
    const frames = asset?.frames;
    if (!frames || frames.length === 0) return;
    if (frameNum < 0 || frameNum >= frames.length) return;

    const f = frames[frameNum];
    this._arena.uvX[idx] = f.uvX;
    this._arena.uvY[idx] = f.uvY;
    this._arena.uvW[idx] = f.uvW;
    this._arena.uvH[idx] = f.uvH;
    this._arena.srcFrame[idx] = frameNum;
    this._arena.dirtyUv = true;
  }

  public update(dt: number): void {
    if (this._activeCount === 0) return;

    for (let i = 0; i < this.capacity; i++) {
      if (this.active[i] === 0) continue;

      const eId = this.entityId[i];
      if (eId < 0 || this._arena.idToIndex[eId] < 0) {
        // エンティティが破棄されたのでアニメーションも終了
        this.free(i);
        continue;
      }

      const aId = this.animId[i];
      const duration = this.refFrameDuration[aId];

      this.elapsed[i] += dt;

      if (this.elapsed[i] >= duration) {
        this.elapsed[i] -= duration;

        const len = this.refFramesLength[aId];
        this.currentFrameIdx[i]++;

        let isEnded = false;

        if (this.currentFrameIdx[i] >= len) {
          const maxRepeat = this.refRepeat[aId];
          if (maxRepeat === -1) {
            this.currentFrameIdx[i] = 0;
          } else if (this.repeatCount[i] < maxRepeat) {
            this.repeatCount[i]++;
            this.currentFrameIdx[i] = 0;
          } else {
            isEnded = true;
          }
        }

        if (!isEnded) {
          const ptr = this.refFramesPtr[aId] + this.currentFrameIdx[i];
          this._applyFrame(eId, this._flatFrames[ptr]);
        } else {
          this.free(i);
        }
      }
    }
  }

  /**
   * 特定のアリーナ ID の再生を停止します。
   */
  public stop(id: number): void {
    for (let i = 0; i < this.capacity; i++) {
      if (this.active[i] === 1 && this.entityId[i] === id) {
        this.free(i);
        return;
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
