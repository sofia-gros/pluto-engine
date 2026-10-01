/**
 * @file TweenManager.ts
 * @description
 * ゼロアロケーションを目指したデータ指向 (SoA) トゥイーンシステム。
 * アリーナ内のエンティティのプロパティ（x, y, scale, tint, alpha）を直接書き換えます。
 */

import type { InstanceBufferArena } from '../arena/InstanceBufferArena';
import { EaseKind, evaluateEase, getEaseKind } from './Easing';

export enum TweenProperty {
  X = 0,
  Y = 1,
  SCALE = 2,
  TINT = 3,
  ALPHA = 4,
  ROTATION = 5,
  FLIP_X = 6,
}

/**
 * Phaser 互換のトゥイーン設定。
 * 対象のプロパティは `props` で指定します。
 */
export interface TweenConfig {
  /** 対象のスプライト。Phaser は配列も受け付けます。 */
  targets: TweenTarget | TweenTarget[];
  /** 補間するプロパティ。例: { x: 100, y: 200 } */
  props: Record<string, number>;
  /** 所要時間 (ミリ秒) */
  duration?: number;
  /** 遅延 (ミリ秒) */
  delay?: number;
  /** イージング名。例: 'Cubic.easeOut' / 'Quad.easeIn' */
  ease?: string;
  /** 往復する場合 true。false の場合は折り返して 0 から始めます。 */
  yoyo?: boolean;
  /** 繰り返し回数。-1 は無限、0 は 1 回のみ。 */
  repeat?: number;
  /** 開始時に 1 度だけ呼ばれます。 */
  onStart?: () => void;
  /** 毎フレーム呼ばれます。 */
  onUpdate?: () => void;
  /** 完了時に 1 度だけ呼ばれます。 */
  onComplete?: () => void;
}

/** トゥイーンの 対象として扱えるオブジェクト。id を持つクラスを想定します。 */
export interface TweenTarget {
  readonly id: number;
}

/** スロットごとに保持するコールバック。null なら何もしません。 */
interface TweenCallbacks {
  onStart?: () => void;
  onUpdate?: () => void;
  onComplete?: () => void;
}

/** プロパティ名から TweenProperty への対応表。初期化時に 1 度だけ埋めます。 */
const PROP_TO_ENUM = new Map<string, TweenProperty>([
  ['x', TweenProperty.X],
  ['y', TweenProperty.Y],
  ['scale', TweenProperty.SCALE],
  ['scaleX', TweenProperty.SCALE],
  ['scaleY', TweenProperty.SCALE],
  ['tint', TweenProperty.TINT],
  ['alpha', TweenProperty.ALPHA],
  ['rotation', TweenProperty.ROTATION],
  ['angle', TweenProperty.ROTATION],
  ['flipX', TweenProperty.FLIP_X],
]);

/** 文字列名を TweenProperty へ変換します。未対応なら null を返します。 */
export function resolveTweenProperty(name: string): TweenProperty | null {
  return PROP_TO_ENUM.get(name) ?? null;
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

  // --- Phaser 互換で拡張した SoA ---
  /** 遅延 (ミリ秒) */
  public readonly delay: Float32Array;
  /** イージングの種類 (EaseKind) */
  public readonly easeKind: Uint8Array;
  /** 往復フラグ (0 = 通常、1 = yoyo) */
  public readonly yoyo: Uint8Array;
  /** 現在の方向 (0 = 始点から終点、1 = 終点から始点) */
  public readonly direction: Uint8Array;
  /** 残り繰り返し回数 (-1 = 無限) */
  public readonly repeatLeft: Int32Array;
  /** グループ ID。複数プロパティを 1 つの Group として管理します */
  public readonly groupId: Int32Array;
  /** onStart を発火済みかどうか。0 なら未発火 */
  public readonly started: Uint8Array;
  /**
   * コールバックの格納先。
   * 配列を 1 度だけ capacity 個確保して null で埋め、
   * 更新中は既存要素を書き換えるだけなので new は発生しません。
   */
  private readonly callbacks: (TweenCallbacks | null)[];

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
    this.delay = new Float32Array(maxTweens);
    this.easeKind = new Uint8Array(maxTweens);
    this.yoyo = new Uint8Array(maxTweens);
    this.direction = new Uint8Array(maxTweens);
    this.repeatLeft = new Int32Array(maxTweens);
    this.groupId = new Int32Array(maxTweens);
    this.started = new Uint8Array(maxTweens);

    this.callbacks = new Array<TweenCallbacks | null>(maxTweens).fill(null);

    this.freeList = new Int32Array(maxTweens);
    for (let i = 0; i < maxTweens; i++) {
      this.freeList[i] = i;
    }
  }

  /**
   * 内部用。SoA のスロットを 1 つ確保します。
   * Phaser 互換の Facade からは _addSlot() 経由で呼び出します。
   */
  private _addSlot(
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
    this.delay[id] = 0.0;
    this.easeKind[id] = EaseKind.Linear;
    this.yoyo[id] = 0;
    this.direction[id] = 0;
    this.started[id] = 0;
    this.callbacks[id] = null;
    this.repeatLeft[id] = 0;
    this.groupId[id] = -1;

    return id;
  }

  // ============================================================
  // Phaser 互換ファサード
  // ============================================================

  /**
   * Phaser 互換の `this.tweens.add({ targets, ... })` を受け付けます。
   *
   * 既存の SoA をそのまま使い、1 プロパティにつき 1 スロットを確保します。
   * `props` に 2 つ指定すれば 2 スロットが確保され、常に同じ速度で同期します。
   *
   * @returns グループ ID。killTweensOf() などに使います
   */
  public add(config: TweenConfig): number {
    const g = this._nextGroupId++;
    this._addOne(config, g);
    return g;
  }

  /**
   * 複数の設定 gaspregistered を順番に実行するチェーンを作ります (Phaser の FadeIn / Chain)。
   *
   * 前の設定が完了してから次を開始するため、チェーンの実行中は
   * 同時に動くスロットは 1 グループ分だけです。
   *
   * @param configs 順番に実行する設定の配列
   * @returns チェーン ID。killTweensOfGroup() で中断できます
   */
  public chain(configs: TweenConfig[]): number {
    const chainId = this._nextGroupId++;
    if (configs.length === 0) return chainId;

    this.chainQueue.set(chainId, { list: configs, index: 0 });
    this._addOne(configs[0], chainId);
    return chainId;
  }

  /** チェーン ID → 実行中のステップ。Map は 1 チェーンにつき 1 エントリです。 */
  private readonly chainQueue = new Map<
    number,
    { list: TweenConfig[]; index: number }
  >();

  private _nextGroupId = 0;

  /**
   * グループ ID → 生存スロット数。
   * 0 になった時点で onComplete を呼び、Map から自身を削除します。
   * エントリは 1 グループにつき 1 つしか増えないため、毎フレームの new はありません。
   */
  private readonly groupLive = new Map<number, number>();
  /** グループ ID → onComplete を持つ設定。コールバックがあるものだけ登録します。 */
  private readonly groupCallbacks = new Map<number, TweenConfig>();

  private _addOne(config: TweenConfig, groupId: number): void {
    const targets = Array.isArray(config.targets) ? config.targets : [config.targets];
    const duration = config.duration ?? 1000;
    const delay = config.delay ?? 0;
    const ease = getEaseKind(config.ease);
    const repeat = config.repeat ?? 0;
    const yoyo = config.yoyo ? 1 : 0;

    const props = config.props;
    const propNames = Object.keys(props);

    let isFirst = true;
    let groupLive = 0;

    for (let t = 0; t < targets.length; t++) {
      const target = targets[t];
      if (target === null || target === undefined) continue;
      const entityId = target.id;

      for (let p = 0; p < propNames.length; p++) {
        const name = propNames[p];
        const prop = resolveTweenProperty(name);
        if (prop === null) continue;

        const slot = this._addSlot(entityId, prop, 0, props[name], duration);
        if (slot === -1) continue;
        this.delay[slot] = delay;
        this.easeKind[slot] = ease;
        this.repeatLeft[slot] = repeat;
        this.yoyo[slot] = yoyo;
        this.groupId[slot] = groupId;
        // 開始値は現在値から取るため、開始時に現在値へスナップ移動しません。
        this.startVal[slot] = this._readCurrent(entityId, prop);
        groupLive++;

        if (isFirst) {
          // onStart / onUpdate は 1 スロット目にだけ載せ、毎フレームの参照を 1 回に抑えます。
          this.callbacks[slot] = config;
        }
        isFirst = false;
      }
    }

    if (groupLive > 0) {
      // onComplete はグループ単位なので、生存数をここで記録します。
      this.groupLive.set(groupId, groupLive);
      if (config.onComplete !== undefined) this.groupCallbacks.set(groupId, config);
    }
  }

  /**
   * プロパティの現在値を読み出します (開始値の設定に使用)。
   */
  private _readCurrent(entityId: number, prop: TweenProperty): number {
    const arena = this._arena;
    const idx = arena.idToIndex[entityId];
    if (idx < 0) return 0;
    switch (prop) {
      case TweenProperty.X:
        return arena.posX[idx];
      case TweenProperty.Y:
        return arena.posY[idx];
      case TweenProperty.SCALE:
        // scale は倍率です。tween の開始値・終了値も倍率として扱います。
        return arena.scaleX[idx];
      case TweenProperty.TINT:
        return arena.tint[idx];
      case TweenProperty.ALPHA:
        return ((arena.tint[idx] >>> 24) & 0xff) / 255;
      case TweenProperty.ROTATION:
        return arena.rotation[idx];
      case TweenProperty.FLIP_X:
        return arena.facing[idx] < 0 ? 1 : 0;
    }
    return 0;
  }

  /**
   * 対象が持つトゥイーンを全て停止します (Phaser 互換の killTweensOf)。
   *
   * @returns 停止したスロット数
   */
  public killTweensOf(target: TweenTarget | number): number {
    const id = typeof target === 'number' ? target : target.id;
    let killed = 0;
    for (let i = 0; i < this.capacity; i++) {
      if (this.active[i] === 0) continue;
      if (this.entityId[i] !== id) continue;
      this._freeSilent(i);
      killed++;
    }
    return killed;
  }

  /**
   * グループ ID 指定でトゥイーンを全て停止します (Phaser 互換の killTweensOfGroup)。
   */
  public killTweensOfGroup(groupId: number): number {
    let killed = 0;
    for (let i = 0; i < this.capacity; i++) {
      if (this.active[i] === 0) continue;
      if (this.groupId[i] !== groupId) continue;
      this._freeSilent(i);
      killed++;
    }
    return killed;
  }

  /**
   * 実行中のトゥイーン数 (Phaser 互換の getTweens().length)。
   */
  public get count(): number {
    return this._activeCount;
  }

  /**
   * トゥイーンを解放します。
   */
  public free(id: number): void {
    this._release(id, true);
  }

  /**
   * 強制停止用。Phaser でも killTweensOf() では onComplete は走りません。
   * そのためグループ生存数だけを減らし、コールバックは呼びません。
   */
  private _freeSilent(id: number): void {
    this._release(id, false);
  }

  private _release(id: number, fireComplete: boolean): void {
    if (id < 0 || id >= this.capacity || this.active[id] === 0) return;

    this.active[id] = 0;
    this.callbacks[id] = null;
    this._activeCount--;
    this.freeList[--this.freeListHead] = id;

    const g = this.groupId[id];
    this.groupId[id] = -1;
    if (g < 0) return;

    if (fireComplete) {
      this._retireGroupSlot(g);
      return;
    }

    // 強制停止のときは生存数だけを減らし、コールバックは残します。
    // グループ内の残りが全て解放されたら Map ごと片付けるので、
    // ここで onComplete を呼ばなければ発火しません。
    const left = this.groupLive.get(g);
    if (left === undefined) return;
    if (left > 1) {
      this.groupLive.set(g, left - 1);
      return;
    }
    this.groupLive.delete(g);
    this.groupCallbacks.delete(g);
    this.chainQueue.delete(g);
  }

  /**
   * グループ内の 1 スロットが終わるたびに生存数を減らし、
   * 0 になったら onComplete を呼びます。
   */
  private _retireGroupSlot(groupId: number): void {
    const left = this.groupLive.get(groupId);
    if (left === undefined) return;

    if (left > 1) {
      this.groupLive.set(groupId, left - 1);
      return;
    }

    this.groupLive.delete(groupId);
    const config = this.groupCallbacks.get(groupId);
    this.groupCallbacks.delete(groupId);

    // チェーンの判定はコールバック呼び出しより先に行います。
    // こうすることで onComplete の中から killTweensOfGroup() されても、
    // 次のステップが始まってしまう事故を避けられます。
    const chain = this.chainQueue.get(groupId);
    let nextConfig: TweenConfig | undefined;
    if (chain !== undefined) {
      chain.index++;
      if (chain.index < chain.list.length) {
        nextConfig = chain.list[chain.index];
      } else {
        this.chainQueue.delete(groupId);
      }
    }

    config?.onComplete?.();

    if (nextConfig !== undefined) {
      this._addOne(nextConfig, groupId);
    }
  }

  /**
   * 全てのトゥイーンを更新し、エンティティのプロパティに適用します。
   * @param dt デルタタイム (ミリ秒)
   */
  public update(dt: number): void {
    if (this._activeCount === 0) return;

    for (let i = 0; i < this.capacity; i++) {
      if (this.active[i] === 0) continue;

      // 遅延中は進行させません。
      // 減算してから判定することで、境界で 1 フレーム分ずれるのを防ぎます。
      let step = dt;
      if (this.delay[i] > 0) {
        this.delay[i] -= dt;
        if (this.delay[i] > 0) continue;
        // 遅延を消化した残りは進行に使います。
        step = -this.delay[i];
        this.delay[i] = 0.0;
        if (step <= 0) continue;
      }

      // onStart は遅延明けの最初の 1 フレームでだけ呼びます。
      const cb = this.callbacks[i];
      if (cb !== null && this.started[i] === 0) {
        this.started[i] = 1;
        cb.onStart?.();
      }

      this.elapsed[i] += step;
      let t = this.duration[i] > 0 ? this.elapsed[i] / this.duration[i] : 1.0;
      if (t > 1.0) t = 1.0;

      // イージングはテーブル引きなので、呼び出し側の new は発生しません。
      const eased = evaluateEase(this.easeKind[i] as EaseKind, t);

      const eId = this.entityId[i];
      if (eId >= 0) {
        this._apply(i, eId, eased);
      }

      if (t >= 1.0) {
        this._advance(i);
      }

      if (cb !== null) cb.onUpdate?.();
    }
  }

  /**
   * 進行度 (イージング適用済み) をプロパティへ書き込みます。
   *
   * 位置系はアリーナの密添字で管理されているため、
   * 渡された ID から変換してから書き込みます。
   */
  private _apply(i: number, eId: number, eased: number): void {
    const arena = this._arena;
    const idx = arena.idToIndex[eId];
    if (idx < 0) return;

    // 往復中は始点と終点を入れ替えます。
    const dir = this.direction[i];
    const from = dir === 0 ? this.startVal[i] : this.endVal[i];
    const to = dir === 0 ? this.endVal[i] : this.startVal[i];
    const val = from + (to - from) * eased;

    switch (this.propType[i] as TweenProperty) {
      case TweenProperty.X:
        arena.setPosX(idx, val);
        break;
      case TweenProperty.Y:
        arena.setPosY(idx, val);
        break;
      case TweenProperty.SCALE:
        arena.setScale(idx, val);
        break;
      case TweenProperty.TINT:
        arena.setTint(idx, val >>> 0);
        break;
      case TweenProperty.ALPHA: {
        // alpha は独立した SoA を持たず、tint の最上位バイト（A チャンネル）を
        // 共有します。そのため頂点属性を 1 個も追加せずに表現できます。
        const packed = arena.tint[idx];
        const byte = Math.max(0, Math.min(255, Math.round(val * 255)));
        arena.setTint(idx, ((packed & 0x00ffffff) | (byte << 24)) >>> 0);
        break;
      }
      case TweenProperty.ROTATION:
        arena.setRotation(idx, val);
        break;
      case TweenProperty.FLIP_X:
        arena.setFacing(idx, val >= 0.5 ? -1.0 : 1.0);
        break;
    }
  }

  /**
   * 完了したトゥイーンを次の繰り返しへ進めるか、終了します。
   */
  private _advance(i: number): void {
    if (this.yoyo[i] === 1) {
      if (this.direction[i] === 0) {
        // 往路が終わったばかりなので、復路に折り返します。
        // 復路は 1 往復として数えるため、repeat は消費しません。
        this.direction[i] = 1;
        this.elapsed[i] = 0.0;
        return;
      }
      // 復路が終わったので、repeat の消費と次の判断を平常に委ねます。
    }

    const left = this.repeatLeft[i];
    if (left === -1) {
      // 無限繰り返し。0 から始め直します。yoyo なら折り返します。
      this.elapsed[i] = 0.0;
      this.direction[i] = 0;
      return;
    }
    if (left > 0) {
      this.repeatLeft[i] = left - 1;
      this.elapsed[i] = 0.0;
      this.direction[i] = 0;
      return;
    }
    this.free(i);
  }

  /**
   * 実行中の全トゥイーンを解放し、フリーリストを初期状態へ戻します。
   */
  public clear(): void {
    this._activeCount = 0;
    this.freeListHead = 0;
    this.active.fill(0);
    this.groupId.fill(-1);
    this.groupLive.clear();
    this.groupCallbacks.clear();
    this.chainQueue.clear();
    this.callbacks.fill(null);
    for (let i = 0; i < this.capacity; i++) {
      this.freeList[i] = i;
    }
  }
}
