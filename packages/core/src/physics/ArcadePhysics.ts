import type { InstanceBufferArena } from '../arena/InstanceBufferArena';
import type { Plugin } from '../scene/Plugin';
import type { Scene } from '../scene/Scene';

/**
 * 物理演算対象のオブジェクト境界インターフェース
 */
export interface PhysicsBody {
  x: number;
  y: number;
  radius?: number;
  width?: number;
  height?: number;
  body?: {
    radius?: number;
    width?: number;
    height?: number;
  };
}

/**
 * Overlap（重なり判定）登録定義
 */
export interface OverlapRule<T extends PhysicsBody = PhysicsBody> {
  source: T;
  targetArena?: InstanceBufferArena;
  callback: (source: T, entityIndex: number) => void;
  margin: number;
}

/**
 * Collider（衝突・押し出し解決）登録定義
 */
export interface ColliderRule<T extends PhysicsBody = PhysicsBody> {
  source: T;
  targetArena?: InstanceBufferArena;
  callback?: (source: T, entityIndex: number) => void;
  bounce: number;
}

/**
 * 2D Arcade Physics プラグイン (Phaser-like API + AABB Broadphase 高速枝刈り)
 * ゼロアロケーション原則に基づき、数十万体規模のエンティティと高速に衝突・重なり判定を行います。
 */
export class ArcadePhysics implements Plugin {
  public scene?: Scene;
  private arena!: InstanceBufferArena;

  public velX: Float32Array;
  public velY: Float32Array;
  public mass: Float32Array;
  public bounce: Float32Array;

  private _overlapRules: OverlapRule[] = [];
  private _colliderRules: ColliderRule[] = [];

  /**
   * Phaser スタイルの物理オブジェクト・判定ファクトリー API
   */
  public readonly add = {
    /**
     * 既存のゲームオブジェクト（Sprite / Player 等）を物理管理対象として登録します。
     * @param target 物理演算対象オブジェクト
     */
    existing: <T extends PhysicsBody>(target: T): T => {
      return target;
    },

    /**
     * 単一の物理オブジェクトとエンティティ群（Arena）の重なり判定を登録します。
     * 内部で AABB 高速枝刈り（Broadphase Culling）が適用され、近傍エンティティのみコールバックが発火します。
     * @param source 基準オブジェクト (例: Player, Weapon)
     * @param targetArena 判定対象のアリーナ (省略時は現在のシーンのアリーナ)
     * @param callback 接触時に呼ばれるコールバック (source, entityIndex)
     * @param margin 判定半径への追加マージン
     */
    overlap: <T extends PhysicsBody>(
      source: T,
      targetArena?: InstanceBufferArena | ((source: T, entityIndex: number) => void),
      callback?: (source: T, entityIndex: number) => void,
      margin = 0,
    ): void => {
      let arenaTarget = this.arena;
      let cb = callback;
      if (typeof targetArena === 'function') {
        cb = targetArena;
      } else if (targetArena) {
        arenaTarget = targetArena;
      }

      if (!cb) return;

      this._overlapRules.push({
        source,
        targetArena: arenaTarget,
        callback: cb as (source: PhysicsBody, entityIndex: number) => void,
        margin,
      });
    },

    /**
     * 単一の物理オブジェクトとエンティティ群（Arena）の衝突・押し出し解決を登録します。
     * @param source 基準オブジェクト
     * @param targetArena 判定対象のアリーナ
     * @param callback 衝突時のコールバック
     * @param bounce 反発係数 (0.0〜1.0)
     */
    collider: <T extends PhysicsBody>(
      source: T,
      targetArena?: InstanceBufferArena | ((source: T, entityIndex: number) => void),
      callback?: (source: T, entityIndex: number) => void,
      bounce = 0.0,
    ): void => {
      let arenaTarget = this.arena;
      let cb = callback;
      if (typeof targetArena === 'function') {
        cb = targetArena;
      } else if (targetArena) {
        arenaTarget = targetArena;
      }

      this._colliderRules.push({
        source,
        targetArena: arenaTarget,
        callback: cb as ((source: PhysicsBody, entityIndex: number) => void) | undefined,
        bounce,
      });
    },
  };

  constructor(maxInstances = 100000) {
    this.velX = new Float32Array(maxInstances);
    this.velY = new Float32Array(maxInstances);
    this.mass = new Float32Array(maxInstances).fill(1.0);
    this.bounce = new Float32Array(maxInstances).fill(0.0);
  }

  /**
   * プラグイン初期化
   */
  public init(scene: Scene): void {
    this.scene = scene;
    this.arena = scene.arena;
  }

  /**
   * エンティティの速度を設定
   */
  public setVelocity(id: number, vx: number, vy: number): void {
    this.velX[id] = vx;
    this.velY[id] = vy;
  }

  /**
   * 物理更新 (位置積分)
   */
  public update(dt: number): void {
    const arena = this.arena;
    if (!arena) return;
    const count = arena.activeCount; // Dense 配列走査

    for (let i = 0; i < count; i++) {
      arena.posX[i] += this.velX[i] * dt;
      arena.posY[i] += this.velY[i] * dt;
    }
  }

  /**
   * 登録された Overlap ルールを一括高速評価 (AABB Broadphase Culling)
   */
  public processOverlaps(): void {
    const ruleCount = this._overlapRules.length;
    if (ruleCount === 0) return;

    for (let r = 0; r < ruleCount; r++) {
      const rule = this._overlapRules[r];
      const source = rule.source;
      const targetArena = rule.targetArena || this.arena;
      const callback = rule.callback;
      const margin = rule.margin;

      const sx = source.x;
      const sy = source.y;
      const sRadius =
        (source.radius ?? source.body?.radius ?? (source.width ? source.width * 0.5 : 16)) + margin;

      const minX = sx - sRadius;
      const maxX = sx + sRadius;
      const minY = sy - sRadius;
      const maxY = sy + sRadius;

      const posX = targetArena.posX;
      const posY = targetArena.posY;
      const scale = targetArena.scale;
      const count = targetArena.activeCount;

      for (let i = 0; i < count; i++) {
        const ex = posX[i];
        const ey = posY[i];

        // 高速 AABB 枝刈り (四則演算のみ、99.9% はここでスキップ)
        if (ex >= minX && ex <= maxX && ey >= minY && ey <= maxY) {
          const eRadius = scale[i] * 0.42;
          const reach = sRadius + eRadius;
          const dx = ex - sx;
          const dy = ey - sy;
          if (dx * dx + dy * dy < reach * reach) {
            callback(source, i);
          }
        }
      }
    }
  }

  /**
   * 登録された Collider ルールを一括高速評価 (AABB 押し出し解決)
   */
  public processColliders(): void {
    const ruleCount = this._colliderRules.length;
    if (ruleCount === 0) return;

    for (let r = 0; r < ruleCount; r++) {
      const rule = this._colliderRules[r];
      const source = rule.source;
      const targetArena = rule.targetArena || this.arena;
      const callback = rule.callback;

      const sx = source.x;
      const sy = source.y;
      const sRadius =
        source.radius ?? source.body?.radius ?? (source.width ? source.width * 0.5 : 16);

      const minX = sx - sRadius;
      const maxX = sx + sRadius;
      const minY = sy - sRadius;
      const maxY = sy + sRadius;

      const posX = targetArena.posX;
      const posY = targetArena.posY;
      const scale = targetArena.scale;
      const count = targetArena.activeCount;

      for (let i = 0; i < count; i++) {
        const ex = posX[i];
        const ey = posY[i];

        if (ex >= minX && ex <= maxX && ey >= minY && ey <= maxY) {
          const eRadius = scale[i] * 0.42;
          const reach = sRadius + eRadius;
          const dx = ex - sx;
          const dy = ey - sy;
          const dist2 = dx * dx + dy * dy;

          if (dist2 < reach * reach && dist2 > 0.0001) {
            const dist = Math.sqrt(dist2);
            const overlap = reach - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            // 敵を押し出し
            posX[i] += nx * overlap;
            posY[i] += ny * overlap;

            if (callback) {
              callback(source, i);
            }
          }
        }
      }
    }
  }

  /**
   * 従来の同一アリーナ内エンティティ同士の衝突処理 (必要時のみ利用)
   */
  public collide(): void {
    // processOverlaps および processColliders を実行
    this.processOverlaps();
    this.processColliders();
  }

  /**
   * 登録ルールを全クリア
   */
  public clear(): void {
    this._overlapRules.length = 0;
    this._colliderRules.length = 0;
  }

  /**
   * プラグイン解放
   */
  public destroy(): void {
    this.clear();
  }
}
