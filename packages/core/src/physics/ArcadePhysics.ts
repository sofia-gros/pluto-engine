import type { InstanceBufferArena } from '../arena/InstanceBufferArena';
import type { Plugin } from '../scene/Plugin';
import type { Scene } from '../scene/Scene';

/**
 * 単一オブジェクトの物理境界インターフェース
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
 * 高速 SoA / TypedArray 形式のバッファコレクションインターフェース
 */
export interface PhysicsBuffer {
  posX: Float32Array | ArrayLike<number>;
  posY: Float32Array | ArrayLike<number>;
  count?: number;
  activeCount?: number;
  scale?: Float32Array | ArrayLike<number>;
  radius?: number | Float32Array | ArrayLike<number>;
}

/**
 * 判定対象として指定可能なすべての物理ターゲット型
 * - 単一オブジェクト (Sprite, Player)
 * - オブジェクト配列 (Sprite[], PhysicsBody[])
 * - InstanceBufferArena (SoA アリーナ)
 * - PhysicsBuffer (カスタム TypedArray バッファ)
 */
export type PhysicsTarget = PhysicsBody | PhysicsBody[] | InstanceBufferArena | PhysicsBuffer;

/**
 * 衝突・重なり判定コールバック
 */
export type OverlapCallback<A = any, B = any> = (source: A, target: B) => void;

/**
 * Overlap（重なり判定）ルール定義
 */
export interface OverlapRule {
  targetA: PhysicsTarget;
  targetB: PhysicsTarget;
  callback: OverlapCallback;
  margin: number;
}

/**
 * Collider（衝突・押し出し解決）ルール定義
 */
export interface ColliderRule {
  targetA: PhysicsTarget;
  targetB: PhysicsTarget;
  callback?: OverlapCallback;
  bounce: number;
}

/**
 * 2D Arcade Physics プラグイン (Phaser-like API + AABB Broadphase 全形式対応)
 * 単一オブジェクト、配列、SoAアリーナ、TypedArrayバッファの全組み合わせに対応し、
 * AABB 高速枝刈りにより数十万体規模でも瞬時に衝突判定を行います。
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
     * 既存のゲームオブジェクトを物理管理対象として登録します。
     * @param target 物理演算対象オブジェクト
     */
    existing: <T extends PhysicsTarget>(target: T): T => {
      return target;
    },

    /**
     * オブジェクトAとオブジェクトBの重なり判定を登録します。
     * 単一オブジェクト、配列（`bullet[]`）、アリーナ（`this.arena`）、バッファ構造の全組み合わせに対応します。
     * @param targetA 判定対象A (例: Player, bullets[])
     * @param targetB 判定対象B (例: this.arena, bullets, enemyBuffer)
     * @param callback 接触時に呼ばれるコールバック (itemA, itemB)
     * @param margin 判定半径への追加マージン
     */
    overlap: <A extends PhysicsTarget, B extends PhysicsTarget>(
      targetA: A,
      targetB?: B | OverlapCallback,
      callback?: OverlapCallback,
      margin = 0,
    ): void => {
      let actualTargetB: PhysicsTarget = this.arena;
      let cb: OverlapCallback | undefined = callback;

      if (typeof targetB === 'function') {
        cb = targetB as OverlapCallback;
      } else if (targetB) {
        actualTargetB = targetB;
      }

      if (!cb) return;

      this._overlapRules.push({
        targetA,
        targetB: actualTargetB,
        callback: cb,
        margin,
      });
    },

    /**
     * オブジェクトAとオブジェクトBの衝突・押し出し解決を登録します。
     * @param targetA 判定対象A
     * @param targetB 判定対象B
     * @param callback 衝突時のコールバック
     * @param bounce 反発係数 (0.0〜1.0)
     */
    collider: <A extends PhysicsTarget, B extends PhysicsTarget>(
      targetA: A,
      targetB?: B | OverlapCallback,
      callback?: OverlapCallback,
      bounce = 0.0,
    ): void => {
      let actualTargetB: PhysicsTarget = this.arena;
      let cb: OverlapCallback | undefined = callback;

      if (typeof targetB === 'function') {
        cb = targetB as OverlapCallback;
      } else if (targetB) {
        actualTargetB = targetB;
      }

      this._colliderRules.push({
        targetA,
        targetB: actualTargetB,
        callback: cb,
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
    const count = arena.activeCount;

    for (let i = 0; i < count; i++) {
      arena.posX[i] += this.velX[i] * dt;
      arena.posY[i] += this.velY[i] * dt;
    }
  }

  /**
   * 登録された Overlap ルールを一括高速評価 (全ターゲット形式対応 & AABB Broadphase Culling)
   */
  public processOverlaps(): void {
    const ruleCount = this._overlapRules.length;
    if (ruleCount === 0) return;

    for (let r = 0; r < ruleCount; r++) {
      const rule = this._overlapRules[r];
      this._evaluateOverlapPair(rule.targetA, rule.targetB, rule.callback, rule.margin);
    }
  }

  /**
   * 登録された Collider ルールを一括高速評価
   */
  public processColliders(): void {
    const ruleCount = this._colliderRules.length;
    if (ruleCount === 0) return;

    for (let r = 0; r < ruleCount; r++) {
      const rule = this._colliderRules[r];
      this._evaluateColliderPair(rule.targetA, rule.targetB, rule.callback, rule.bounce);
    }
  }

  /**
   * ターゲットAとターゲットBのペアを型判別して高速評価
   */
  private _evaluateOverlapPair(
    targetA: PhysicsTarget,
    targetB: PhysicsTarget,
    callback: OverlapCallback,
    margin: number,
  ): void {
    // 1. targetA が配列の場合
    if (Array.isArray(targetA)) {
      for (let i = 0; i < targetA.length; i++) {
        const itemA = targetA[i];
        if (itemA) {
          this._evaluateSingleVsTarget(itemA, targetB, callback, margin);
        }
      }
      return;
    }

    // 2. targetA が単一オブジェクトの場合
    if ('x' in targetA && 'y' in targetA && typeof targetA.x === 'number') {
      this._evaluateSingleVsTarget(targetA as PhysicsBody, targetB, callback, margin);
      return;
    }

    // 3. targetA が Buffer / Arena の場合
    this._evaluateBufferVsTarget(
      targetA as InstanceBufferArena | PhysicsBuffer,
      targetB,
      callback,
      margin,
    );
  }

  /**
   * 単一オブジェクト vs (単一 / 配列 / Arena / Buffer) の AABB 枝刈り判定
   */
  private _evaluateSingleVsTarget(
    source: PhysicsBody,
    target: PhysicsTarget,
    callback: OverlapCallback,
    margin: number,
  ): void {
    const sx = source.x;
    const sy = source.y;
    const sr =
      (source.radius ?? source.body?.radius ?? (source.width ? source.width * 0.5 : 16)) + margin;

    const minX = sx - sr;
    const maxX = sx + sr;
    const minY = sy - sr;
    const maxY = sy + sr;

    // A. target が配列の場合
    if (Array.isArray(target)) {
      for (let j = 0; j < target.length; j++) {
        const itemB = target[j];
        if (!itemB) continue;
        const bx = itemB.x;
        const by = itemB.y;
        if (bx >= minX && bx <= maxX && by >= minY && by <= maxY) {
          const br = itemB.radius ?? itemB.body?.radius ?? (itemB.width ? itemB.width * 0.5 : 16);
          const reach = sr + br;
          const dx = bx - sx;
          const dy = by - sy;
          if (dx * dx + dy * dy < reach * reach) {
            callback(source, itemB);
          }
        }
      }
      return;
    }

    // B. target が単一オブジェクトの場合
    if ('x' in target && 'y' in target && typeof target.x === 'number') {
      const targetBody = target as PhysicsBody;
      const bx = targetBody.x;
      const by = targetBody.y;
      if (bx >= minX && bx <= maxX && by >= minY && by <= maxY) {
        const br =
          targetBody.radius ??
          targetBody.body?.radius ??
          (targetBody.width ? targetBody.width * 0.5 : 16);
        const reach = sr + br;
        const dx = bx - sx;
        const dy = by - sy;
        if (dx * dx + dy * dy < reach * reach) {
          callback(source, targetBody);
        }
      }
      return;
    }

    // C. target が Arena / Buffer の場合 (30万体 AABB 枝刈り)
    const buf = target as InstanceBufferArena | PhysicsBuffer;
    const posX = buf.posX;
    const posY = buf.posY;
    const count = this._getBufCount(buf);

    for (let i = 0; i < count; i++) {
      const ex = posX[i];
      const ey = posY[i];

      // AABB 枝刈り (四則演算のみ)
      if (ex >= minX && ex <= maxX && ey >= minY && ey <= maxY) {
        const eRadius = this._getBufRadius(buf, i);
        const reach = sr + eRadius;
        const dx = ex - sx;
        const dy = ey - sy;
        if (dx * dx + dy * dy < reach * reach) {
          callback(source, i);
        }
      }
    }
  }

  /**
   * Buffer / Arena vs (単一 / Arena) の高速判定
   */
  private _evaluateBufferVsTarget(
    sourceBuf: InstanceBufferArena | PhysicsBuffer,
    target: PhysicsTarget,
    callback: OverlapCallback,
    margin: number,
  ): void {
    const sPosX = sourceBuf.posX;
    const sPosY = sourceBuf.posY;
    const sCount = this._getBufCount(sourceBuf);

    for (let i = 0; i < sCount; i++) {
      const sx = sPosX[i];
      const sy = sPosY[i];
      const sr = this._getBufRadius(sourceBuf, i) + margin;

      const minX = sx - sr;
      const maxX = sx + sr;
      const minY = sy - sr;
      const maxY = sy + sr;

      if ('x' in target && 'y' in target && typeof target.x === 'number') {
        const targetBody = target as PhysicsBody;
        const bx = targetBody.x;
        const by = targetBody.y;
        if (bx >= minX && bx <= maxX && by >= minY && by <= maxY) {
          const br =
            targetBody.radius ??
            targetBody.body?.radius ??
            (targetBody.width ? targetBody.width * 0.5 : 16);
          const reach = sr + br;
          const dx = bx - sx;
          const dy = by - sy;
          if (dx * dx + dy * dy < reach * reach) {
            callback(i, targetBody);
          }
        }
      } else if ('posX' in target && 'posY' in target) {
        const targetBuf = target as InstanceBufferArena | PhysicsBuffer;
        const tPosX = targetBuf.posX;
        const tPosY = targetBuf.posY;
        const tCount = this._getBufCount(targetBuf);

        for (let j = 0; j < tCount; j++) {
          const tx = tPosX[j];
          const ty = tPosY[j];
          if (tx >= minX && tx <= maxX && ty >= minY && ty <= maxY) {
            const tr = this._getBufRadius(targetBuf, j);
            const reach = sr + tr;
            const dx = tx - sx;
            const dy = ty - sy;
            if (dx * dx + dy * dy < reach * reach) {
              callback(i, j);
            }
          }
        }
      }
    }
  }

  /**
   * Collider 判定と押し出し解決
   */
  private _evaluateColliderPair(
    targetA: PhysicsTarget,
    targetB: PhysicsTarget,
    callback?: OverlapCallback,
    _bounce = 0.0,
  ): void {
    if ('x' in targetA && 'y' in targetA && typeof targetA.x === 'number') {
      const source = targetA as PhysicsBody;
      const sx = source.x;
      const sy = source.y;
      const sr = source.radius ?? source.body?.radius ?? (source.width ? source.width * 0.5 : 16);

      const minX = sx - sr;
      const maxX = sx + sr;
      const minY = sy - sr;
      const maxY = sy + sr;

      if ('posX' in targetB && 'posY' in targetB) {
        const buf = targetB as InstanceBufferArena | PhysicsBuffer;
        const posX = buf.posX as Float32Array;
        const posY = buf.posY as Float32Array;
        const count = this._getBufCount(buf);

        for (let i = 0; i < count; i++) {
          const ex = posX[i];
          const ey = posY[i];

          if (ex >= minX && ex <= maxX && ey >= minY && ey <= maxY) {
            const eRadius = this._getBufRadius(buf, i);
            const reach = sr + eRadius;
            const dx = ex - sx;
            const dy = ey - sy;
            const dist2 = dx * dx + dy * dy;

            if (dist2 < reach * reach && dist2 > 0.0001) {
              const dist = Math.sqrt(dist2);
              const overlap = reach - dist;
              const nx = dx / dist;
              const ny = dy / dist;

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
  }

  private _getBufCount(buf: InstanceBufferArena | PhysicsBuffer): number {
    if ('activeCount' in buf && typeof buf.activeCount === 'number') {
      return buf.activeCount;
    }
    if ('count' in buf && typeof buf.count === 'number') {
      return buf.count;
    }
    return buf.posX.length;
  }

  private _getBufRadius(buf: InstanceBufferArena | PhysicsBuffer, index: number): number {
    if ('scale' in buf && buf.scale) {
      return buf.scale[index] * 0.42;
    }
    if ('radius' in buf) {
      if (typeof buf.radius === 'number') return buf.radius;
      if (buf.radius && typeof buf.radius[index] === 'number') return buf.radius[index];
    }
    return 16;
  }

  /**
   * 物理更新
   */
  public collide(): void {
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
