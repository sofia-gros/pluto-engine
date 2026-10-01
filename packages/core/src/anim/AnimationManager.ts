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
import { AnimState } from './AnimState';

export interface AnimationConfig {
  key: string;
  frames: number[];
  frameRate?: number;
  repeat?: number; // -1 は無限ループ
}

/**
 * 1 回の update() で進めるコマ数の上限です。
 *
 * タブが非表示だった-carbox 時に(dt が数百秒) なると、
 * 取りこぼしを全部消化しようとして CPU を占有し続けます。
 * 1 フレームあたり 256 コマまでに制限して、
 * 追い付け分は意図的に落として描画を優先します。
 */
const MAX_CATCHUP_STEPS = 256;

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
  /** 一時停止中か。update() では時間を進めない */
  public readonly paused: Uint8Array;
  /** 逆再生中か (playReverse で立てます) */
  public readonly reverse: Uint8Array;

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

  /** 生成済みの AnimState ハンドル。スロット番号で添字参照します。 */
  private readonly _handles: AnimState[] = [];

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
    this.paused = new Uint8Array(maxAnims);
    this.reverse = new Uint8Array(maxAnims);

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
   *
   * @param id アリーナの ID
   * @param key アニメーションキー
   * @param ignoreIfPlaying true の場合、既に別のアニメーションを再生中なら何もしない
   * @returns AnimState ハンドル。キーが未定義やスロット枯渇なら null
   */
  public play(id: number, key: string, ignoreIfPlaying = false): AnimState | null {
    const playId = this.getSlot(id);
    return this.playBySlot(playId, id, key, ignoreIfPlaying, false);
  }

  /**
   * アリーナ ID を指定して逆再生します (Phaser 互換の `playReverse`)。
   * 最終コマから先頭へ戻ります。
   */
  public playReverse(id: number, key: string, ignoreIfPlaying = false): AnimState | null {
    const playId = this.getSlot(id);
    return this.playBySlot(playId, id, key, ignoreIfPlaying, true);
  }

  /**
   * 再生スロット番号から、そのエンティティの現在のスロットを探します。
   *
   * @returns 再生中であればスロット番号、未再生なら -1
   *
   * 走査のみで GC は発生しません。Flyweight (AnimState) は
   * 「アリーナ ID」ではなくこのスロット番号を保持します。
   */
  public getSlot(entityId: number): number {
    for (let i = 0; i < this.capacity; i++) {
      if (this.active[i] === 1 && this.entityId[i] === entityId) return i;
    }
    return -1;
  }

  /**
   * play / playReverse の共通実装。
   *
   * @param playId getSlot の戻り値。-1 なら空きスロットを確保します。
   * @param reverse true なら逆再生で開始します
   * @returns AnimState ハンドル。開始できなかったら null
   */
  private playBySlot(
    playId: number,
    entityId: number,
    key: string,
    ignoreIfPlaying: boolean,
    reverse: boolean,
  ): AnimState | null {
    const animIndex = this._animKeyToIndex.get(key);
    if (animIndex === undefined) {
      console.warn(`Animation key not found: ${key}`);
      return null;
    }

    if (playId !== -1 && ignoreIfPlaying) {
      return this._wrap(playId);
    }

    if (playId === -1) {
      if (this.freeListHead >= this.capacity) return null; // 枯渇
      playId = this.freeList[this.freeListHead++];
      this.active[playId] = 1;
      this._activeCount++;
      this.entityId[playId] = entityId;
    }

    this.animId[playId] = animIndex;
    this.repeatCount[playId] = 0;
    this.elapsed[playId] = 0.0;
    this.paused[playId] = 0;
    this.reverse[playId] = reverse ? 1 : 0;

    // 逆再生なら最終コマから開始します
    const len = this.refFramesLength[animIndex];
    this.currentFrameIdx[playId] = reverse ? (len > 0 ? len - 1 : 0) : 0;

    // 初期フレームを即座に適用
    const ptr = this.refFramesPtr[animIndex] + this.currentFrameIdx[playId];
    this._applyFrame(entityId, this._flatFrames[ptr]);
    return this._wrap(playId);
  }

  /**
   * スロット番号に対応する Flyweight ハンドルを返します。
   * 同じスロットなら必ず同じインスタンスを返します。
   */
  private _wrap(slot: number): AnimState {
    if (slot >= this._handles.length) {
      for (let i = this._handles.length; i <= slot; i++) {
        this._handles.push(new AnimState(i, this));
      }
    }
    return this._handles[slot];
  }

  /**
   * アリーナ ID に対する AnimState ハンドルを返します (Phaser 互換の `sprite.anims`)。
   *
   * 再生していない場合は無効なハンドル (slot = -1) を返します。
   * 毎フレーム new しないよう、内部配列を使い回します。
   */
  public getAnimState(entityId: number): AnimState {
    return this._wrap(this.getSlot(entityId));
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
    this._arena.setUv4(idx, f.uvX, f.uvY, f.uvW, f.uvH);
    this._arena.srcFrame[idx] = frameNum;
  }

  public update(dt: number): void {
    if (this._activeCount === 0) return;

    for (let i = 0; i < this.capacity; i++) {
      if (this.active[i] === 0) continue;
      // 一時停止中はコマを進めません
      if (this.paused[i] === 1) continue;

      const eId = this.entityId[i];
      if (eId < 0 || this._arena.idToIndex[eId] < 0) {
        // エンティティが破棄されたのでアニメーションも終了
        this.free(i);
        continue;
      }

      const aId = this.animId[i];
      const duration = this.refFrameDuration[aId];

      // frameRate が 0 や負なら 1 コマ目の無限ループになるため、0 に丸めます。
      const step = duration > 0 ? duration : 0;

      this.elapsed[i] += dt;

      // dt が 1 コマ時間を超える場合 (低フレームレート、タブ復帰時の巨大 dt など) は
      // 取りこぼさないよう while で複数コマを進めます。
      // 1 回の update で進める上限を設けて spirals of death を防ぎます。
      let guard = MAX_CATCHUP_STEPS;
      while (this.elapsed[i] >= step && this.active[i] === 1 && guard-- > 0) {
        this.elapsed[i] -= step;

        const len = this.refFramesLength[aId];
        const isReverse = this.reverse[i] === 1;
        let isEnded = false;

        if (isReverse) {
          // 0 未満なら先頭に戻します
          this.currentFrameIdx[i]--;
          if (this.currentFrameIdx[i] < 0) {
            const maxRepeat = this.refRepeat[aId];
            if (maxRepeat === -1) {
              this.currentFrameIdx[i] = len > 0 ? len - 1 : 0;
            } else if (this.repeatCount[i] < maxRepeat) {
              this.repeatCount[i]++;
              this.currentFrameIdx[i] = len > 0 ? len - 1 : 0;
            } else {
              isEnded = true;
            }
          }
        } else {
          this.currentFrameIdx[i]++;
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
        }

        if (isEnded) {
          this.free(i);
          break;
        }

        const ptr = this.refFramesPtr[aId] + this.currentFrameIdx[i];
        this._applyFrame(eId, this._flatFrames[ptr]);
      }
    }
  }

  /**
   * 特定のアリーナ ID の再生を停止します。
   */
  public stop(id: number): void {
    const slot = this.getSlot(id);
    if (slot >= 0) this.free(slot);
  }

  // --- Flyweight (AnimState) 向けの公開アクセサ ---

  /** スロットが再生中か */
  public isSlotActive(slot: number): boolean {
    return slot >= 0 && slot < this.capacity && this.active[slot] === 1;
  }

  /** スロットが一時停止中か */
  public isSlotPaused(slot: number): boolean {
    return this.isSlotActive(slot) && this.paused[slot] === 1;
  }

  /** スロットが逆再生中か */
  public isSlotReverse(slot: number): boolean {
    return this.isSlotActive(slot) && this.reverse[slot] === 1;
  }

  /** スロットの現在のコマ位置 */
  public getSlotFrameIndex(slot: number): number {
    return this.isSlotActive(slot) ? this.currentFrameIdx[slot] : 0;
  }

  /** スロットの総コマ数 */
  public getSlotFrameLength(slot: number): number {
    if (!this.isSlotActive(slot)) return 0;
    return this.refFramesLength[this.animId[slot]];
  }

  /**
   * スロットの進捗率 (0〜1)。
   * 現在コマとコマ時間から算出します。逆再生は 1 から 0 へ進みます。
   */
  public getSlotProgress(slot: number): number {
    if (!this.isSlotActive(slot)) return 0;
    const aId = this.animId[slot];
    const len = this.refFramesLength[aId];
    if (len <= 0) return 0;
    const duration = this.refFrameDuration[aId];
    const withinFrame = duration > 0 ? this.elapsed[slot] / duration : 0;
    const p = (this.currentFrameIdx[slot] + (withinFrame > 1 ? 1 : withinFrame)) / len;
    if (this.reverse[slot] === 1) {
      return p >= 1 ? 0 : 1 - p;
    }
    return p > 1 ? 1 : p;
  }

  /** スロットを一時停止します */
  public pauseSlot(slot: number): void {
    if (this.isSlotActive(slot)) this.paused[slot] = 1;
  }

  /** スロットの一時停止を解除します */
  public resumeSlot(slot: number): void {
    if (this.isSlotActive(slot)) this.paused[slot] = 0;
  }

  /**
   * スロットの再生方向を切り替えます。
   * 逆再生中に false を渡すと正再生に戻ります。
   */
  public setSlotReverse(slot: number, reverse: boolean): void {
    if (this.isSlotActive(slot)) this.reverse[slot] = reverse ? 1 : 0;
  }

  /**
   * スロットを即座に終了します (Flyweight の `stop`)。
   * stop(entityId) と違い、走査なしで直接解放します。
   */
  public stopSlot(slot: number): void {
    if (this.isSlotActive(slot)) this.free(slot);
  }

  public clear(): void {
    this._activeCount = 0;
    this.freeListHead = 0;
    this.active.fill(0);
    this.paused.fill(0);
    this.reverse.fill(0);
    for (let i = 0; i < this.capacity; i++) {
      this.freeList[i] = i;
    }
  }
}
