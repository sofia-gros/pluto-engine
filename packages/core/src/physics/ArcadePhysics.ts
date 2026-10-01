import type { InstanceBufferArena } from '../arena/InstanceBufferArena';
import { Group } from '../arena/Group';
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

  // ============================================================
  // Body の SoA
  //
  // **添字はアリーナの密添字 (dense index) です。**
  // これらの配列は update() で 0..activeCount-1 を順に走査するため、
  // 密添字でないと 1 体でも解放された瞬間に値がずれます。
  // 外部 API (setVelocity / Body など) は **疎添字の ID** を受け取り、
  // 内部で arena.idToIndex を通します。
  // ============================================================
  public velX: Float32Array;
  public velY: Float32Array;
  public mass: Float32Array;
  public bounce: Float32Array;
  /** 加速度 */
  public accelX: Float32Array;
  public accelY: Float32Array;
  /** 空気抵抗 (1 フレームあたりの減衰率、0〜1) */
  public dragX: Float32Array;
  public dragY: Float32Array;
  /** 速度の上限。0 以下は無制限 */
  public maxVelX: Float32Array;
  public maxVelY: Float32Array;
  /** 当たり判定の半径 (0 のときは矩形判定) */
  public radius: Float32Array;
  /** 当たり判定矩形の幅と高さ (radius が 0 のときだけ使用) */
  public bodyWidth: Float32Array;
  public bodyHeight: Float32Array;
  /** 当たり判定中心のスプライト中心からのオフセット */
  public offsetX: Float32Array;
  public offsetY: Float32Array;
  /** 押し出されない (1 = immovable) */
  public immovable: Uint8Array;
  /** ワールド境界で反弹する (1 = 有効) */
  public collideWorldBounds: Uint8Array;
  /**
   * 動摩擦 (0 のときは無効)。
   * `update` で速度を毎フレームこの割合だけ減衰させます。
   * `drag` と違い、**加速度が 0 のときだけ**作用します。
   */
  public friction: Float32Array;
  /**
   * 静摩擦。速度がこの値以下になったら摩擦による減速を打ち切って
   * 完全停止させます (0 のときは何も起こりません)。
   */
  public frictionStatic: Float32Array;
  /** 物理演算の対象にするか (0 = 無効、1 = 有効) */
  public enable: Uint8Array;

  // ============================================================
  // World (シーン全体で 1 つ)
  // ============================================================
  /** ワールド境界の左端 */
  public boundsX = 0;
  /** ワールド境界の上端 */
  public boundsY = 0;
  /** ワールド境界の幅 */
  public boundsWidth = 0;
  /** ワールド境界の高さ */
  public boundsHeight = 0;
  /** ワールドが境界を持つか */
  public hasBounds = false;
  /** 重力加速度 X */
  public gravityX = 0;
  /** 重力加速度 Y */
  public gravityY = 0;

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
     * 物理演算対象の {@link Group} を作成します
     * (Phaser 互換の `physics.add.group`)。
     *
     * 設計上の判断 (IMPACT_SCOPE 3.2 の判定 D):
     * Group は SoA 化しない使い回し `Array` で、アリーナは汚しません。
     * 本メソッドはグループ用の器を返すだけで、SoA への登録は
     * 呼び出し側が `body` 経由で個別に行います。
     *
     * @param children 初期メンバー
     */
    group: <T>(children?: readonly T[]): Group => {
      const g = new Group();
      if (children) g.addMultiple(children as T[]);
      return g;
    },

    /**
     * Immovable な {@link Group} を作成します
     * (Phaser 互換の `physics.add.staticGroup`)。
     *
     * `group` と違い、所属メンバーを「動かない SoA」として実効化します。
     * `body` を公開するオブジェクト (Sprite) には immovable を立て、
     * そうでないメンバーは.Group 側の記録だけに留めます。
     *
     * @param children 初期メンバー
     */
    staticGroup: <T>(children?: readonly T[]): Group => {
      const g = new Group();
      // 以降 add() されたメンバーにも immovable を立てるため、フックを登録します
      g.setOnAddHook((item) => {
        const child = item as { body?: { setImmovable?: (v: boolean) => void } } | null;
        child?.body?.setImmovable?.(true);
      });
      if (children) g.addMultiple(children as T[]);
      return g;
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
    this.accelX = new Float32Array(maxInstances);
    this.accelY = new Float32Array(maxInstances);
    this.dragX = new Float32Array(maxInstances);
    this.dragY = new Float32Array(maxInstances);
    // 0 は「無制限」を表すので初期値は 0 のままです
    this.maxVelX = new Float32Array(maxInstances);
    this.maxVelY = new Float32Array(maxInstances);
    this.radius = new Float32Array(maxInstances);
    this.bodyWidth = new Float32Array(maxInstances);
    this.bodyHeight = new Float32Array(maxInstances);
    this.offsetX = new Float32Array(maxInstances);
    this.offsetY = new Float32Array(maxInstances);
    this.immovable = new Uint8Array(maxInstances);
    this.collideWorldBounds = new Uint8Array(maxInstances);
    // 摩擦は既定で無効 (0)。静摩擦も 0 なので停止補間は起きません。
    this.friction = new Float32Array(maxInstances);
    this.frictionStatic = new Float32Array(maxInstances);
    // 物理は既定で有効 (1)。`disable()` で個別に止められます。
    this.enable = new Uint8Array(maxInstances).fill(1);
  }

  /**
   * プラグイン初期化
   */
  public init(scene: Scene): void {
    this.scene = scene;
    this.arena = scene.arena;
  }

  /**
   * 疎添字の ID を密添字へ変換します。
   *
   * SoA は密添字で更新するため、外部 API は必ずここを通します。
   * 存在しない ID は -1 を返します。
   */
  private _idx(id: number): number {
    const arena = this.arena;
    if (!arena || id < 0) return -1;
    return arena.idToIndex[id];
  }

  /**
   * エンティティの速度を設定します。
   * @param id アリーナの疎添字 ID
   */
  public setVelocity(id: number, vx: number, vy: number): void {
    const i = this._idx(id);
    if (i < 0) return;
    this.velX[i] = vx;
    this.velY[i] = vy;
  }

  /**
   * 加速度を設定します (Phaser 互換の `setAcceleration`)。
   */
  public setAcceleration(id: number, ax: number, ay: number): void {
    const i = this._idx(id);
    if (i < 0) return;
    this.accelX[i] = ax;
    this.accelY[i] = ay;
  }

  /**
   * 空気抵抗を設定します (Phaser 互換の `setDrag`)。
   * 1 フレームごとに速度が drag の割合だけ減衰します。
   */
  public setDrag(id: number, drag: number): void {
    const i = this._idx(id);
    if (i < 0) return;
    this.dragX[i] = drag;
    this.dragY[i] = drag;
  }

  /**
   * 速度の上限を設定します (Phaser 互換の `setMaxVelocity`)。
   * 0 以下は無制限として扱います。
   */
  public setMaxVelocity(id: number, maxVx: number, maxVy: number): void {
    const i = this._idx(id);
    if (i < 0) return;
    this.maxVelX[i] = maxVx;
    this.maxVelY[i] = maxVy;
  }

  /**
   * 動摩擦と静摩擦を設定します (Phaser 互換の `setFriction`)。
   *
   * 動摩擦は**加速度が 0 のときだけ**速度を減衰させます。
   * 加速度中有は fricton の影響を受けません。
   *
   * @param value 動摩擦 (0〜1)。0 のときは無効
   * @param staticValue 静摩擦。速度がこれ以下で完全停止。0 なら停止しない
   */
  public setFriction(id: number, value: number, staticValue = 0): void {
    const i = this._idx(id);
    if (i < 0) return;
    this.friction[i] = value < 0 ? 0 : value > 1 ? 1 : value;
    this.frictionStatic[i] = staticValue < 0 ? 0 : staticValue;
  }

  /**
   * 物理演算の有効・無効を切り替えます (Phaser 互換の `enable` / `disable`)。
   * 無効なエンティティは `update` の積分から除外されます。
   */
  public setEnabled(id: number, value: boolean): void {
    const i = this._idx(id);
    if (i < 0) return;
    this.enable[i] = value ? 1 : 0;
  }

  /**
   * 当たり判定の形状を設定します (Phaser 互換の `setCircle`)。
   */
  public setCircle(id: number, r: number): void {
    const i = this._idx(id);
    if (i < 0) return;
    this.radius[i] = r;
  }

  /**
   * 当たり判定の形状を設定します (Phaser 互換の `setSize`)。
   * width/height が 0 の場合は矩形を無効化し、表示寸法へ委ねます。
   */
  public setSize(id: number, w: number, h: number): void {
    const i = this._idx(id);
    if (i < 0) return;
    this.radius[i] = 0;
    this.bodyWidth[i] = w;
    this.bodyHeight[i] = h;
  }

  /**
   * 当たり判定中心のスプライト中心からのオフセットを設定します。
   */
  public setOffset(id: number, ox: number, oy: number): void {
    const i = this._idx(id);
    if (i < 0) return;
    this.offsetX[i] = ox;
    this.offsetY[i] = oy;
  }

  /**
   * 押し出されないようにします (Phaser 互換の `setImmovable`)。
   */
  public setImmovable(id: number, value: boolean): void {
    const i = this._idx(id);
    if (i < 0) return;
    this.immovable[i] = value ? 1 : 0;
  }

  /**
   * ワールド境界での反弹を有効にします (Phaser 互換の `setCollideWorldBounds`)。
   */
  public setCollideWorldBounds(id: number, value: boolean): void {
    const i = this._idx(id);
    if (i < 0) return;
    this.collideWorldBounds[i] = value ? 1 : 0;
  }

  /**
   * ワールド境界を設定します (Phaser 互換の `setBoundsRectangle`)。
   * @param width / height が 0 以下の場合は境界なしとして扱います   */
  public setBounds(x: number, y: number, width: number, height: number): void {
    this.boundsX = x;
    this.boundsY = y;
    this.boundsWidth = width > 0 ? width : 0;
    this.boundsHeight = height > 0 ? height : 0;
    this.hasBounds = this.boundsWidth > 0 && this.boundsHeight > 0;
  }

  /**
   * ワールド境界を無効にします。
   */
  public clearBounds(): void {
    this.hasBounds = false;
    this.boundsWidth = 0;
    this.boundsHeight = 0;
  }

  /**
   * 当たり判定の半幅を返します。矩形設定がなければ表示寸法の半分を使います。
   */
  private _halfWidth(i: number): number {
    const bw = this.bodyWidth[i];
    if (bw > 0) return bw * 0.5;
    const arena = this.arena;
    return arena.frameWidth[i] * arena.scaleX[i] * 0.5;
  }

  /** 当たり判定の半高を返します。 */
  private _halfHeight(i: number): number {
    const bh = this.bodyHeight[i];
    if (bh > 0) return bh * 0.5;
    const arena = this.arena;
    return arena.frameHeight[i] * arena.scaleY[i] * 0.5;
  }

  // ============================================================
  // Flyweight (Body) 向けの読み取りアクセサ
  // すべて疎添字の ID を受け取り、内部で密添字へ変換します。
  // 存在しない ID は 0 を返します。
  // ============================================================

  /** 当たり判定の半幅。矩形設定がなければ表示寸法の半分 */
  public getHalfWidth(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this._halfWidth(i);
  }

  /** 当たり判定の半高。矩形設定がなければ表示寸法の半分 */
  public getHalfHeight(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this._halfHeight(i);
  }

  /** X 座標 */
  public getBodyX(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this.arena.posX[i];
  }

  /** X 座標を設定します。 */
  public setBodyX(id: number, v: number): void {
    const i = this._idx(id);
    if (i < 0) return;
    this.arena.setPosX(i, v);
  }

  /** Y 座標 */
  public getBodyY(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this.arena.posY[i];
  }

  /** Y 座標を設定します。 */
  public setBodyY(id: number, v: number): void {
    const i = this._idx(id);
    if (i < 0) return;
    this.arena.setPosY(i, v);
  }

  /** 水平方向の速度 */
  public getVelocityX(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this.velX[i];
  }

  /** 垂直方向の速度 */
  public getVelocityY(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this.velY[i];
  }

  /** 水平方向の加速度 */
  public getAccelerationX(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this.accelX[i];
  }

  /** 垂直方向の加速度 */
  public getAccelerationY(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this.accelY[i];
  }

  /** 空気抵抗 */
  public getDrag(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this.dragX[i];
  }

  /** 反発係数 */
  public getBounce(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this.bounce[i];
  }

  /** 動摩擦 (0 のときは無効) */
  public getFriction(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this.friction[i];
  }

  /** 静摩擦 */
  public getFrictionStatic(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this.frictionStatic[i];
  }

  /** 物理演算の対象になっているか */
  public getEnabled(id: number): boolean {
    const i = this._idx(id);
    return i >= 0 && this.enable[i] === 1;
  }

  /** 反発係数を設定します。0〜1 にクランプします。 */
  public setBounce(id: number, v: number): void {
    const i = this._idx(id);
    if (i < 0) return;
    this.bounce[i] = v < 0 ? 0 : v > 1 ? 1 : v;
  }

  /** 質量 */
  public getMass(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this.mass[i];
  }

  /** 質量を設定します。0 未満は 0 にクランプします。 */
  public setMass(id: number, v: number): void {
    const i = this._idx(id);
    if (i < 0) return;
    this.mass[i] = v < 0 ? 0 : v;
  }

  /** 水平方向の速度上限 */
  public getMaxVelocityX(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this.maxVelX[i];
  }

  /** 垂直方向の速度上限 */
  public getMaxVelocityY(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this.maxVelY[i];
  }

  /** 当たり判定の半径 */
  public getRadius(id: number): number {
    const i = this._idx(id);
    return i < 0 ? 0 : this.radius[i];
  }

  /** 押し出されないか */
  public getImmovable(id: number): boolean {
    const i = this._idx(id);
    return i >= 0 && this.immovable[i] === 1;
  }

  /** ワールド境界で反弹するか */
  public getCollideWorldBounds(id: number): boolean {
    const i = this._idx(id);
    return i >= 0 && this.collideWorldBounds[i] === 1;
  }

  /**
   * 物理更新 (加速度・空気抵抗・速度上限・ワールド境界の処理を含む積分)。
   *
   * 順序は Phaser Arcade Physics に合わせています。
   * 加速度 → 重力 → 空気抵抗 → 速度上限 → 位置更新 → 境界反射
   */
  public update(dt: number): void {
    const arena = this.arena;
    if (!arena) return;
    const count = arena.activeCount;
    if (count === 0) return;

    const gx = this.gravityX;
    const gy = this.gravityY;
    const hasBounds = this.hasBounds;
    const bx0 = this.boundsX;
    const by0 = this.boundsY;
    const bx1 = bx0 + this.boundsWidth;
    const by1 = by0 + this.boundsHeight;

    // packed ミラーも同時に更新するため、write-through セッターを使います。
    // read-modify-write なので、値を読み直してから書き戻す形になります
    // （ここが最も実行回数の多いループですが、SoA 読み込み + ミラー書き込みのみです）。
    for (let i = 0; i < count; i++) {
      // 0. enable が 0 のエンティティは積分しない。
      // 判定 (`processOverlaps` / `processColliders`) は別系統なので影響しません。
      if (this.enable[i] === 0) continue;

      let vx = this.velX[i];
      let vy = this.velY[i];

      // 1. 加速度と重力を速度に加算
      vx += (this.accelX[i] + gx) * dt;
      vy += (this.accelY[i] + gy) * dt;

      // 2. 空気抵抗。drag は 0〜1 の比率として毎フレーム減衰させます
      const dx = this.dragX[i];
      if (dx > 0) vx -= vx * dx;
      const dy = this.dragY[i];
      if (dy > 0) vy -= vy * dy;

      // 3. 速度上限。0 以下は無制限
      const mx = this.maxVelX[i];
      if (mx > 0 && vx > mx) vx = mx;
      else if (mx > 0 && vx < -mx) vx = -mx;
      const my = this.maxVelY[i];
      if (my > 0 && vy > my) vy = my;
      else if (my > 0 && vy < -my) vy = -my;

      // 3.5 動摩擦・静摩擦
      // drag と違い、**この軸に加速度が架かっている間は作用しません**。
      // これにより「押し続けて滑る」挙動と「放したあと滑って止まる」挙動を分離できます。
      const f = this.friction[i];
      if (f > 0) {
        if (this.accelX[i] === 0) {
          vx -= vx * f;
          const fsx = this.frictionStatic[i];
          if (fsx > 0 && vx > -fsx && vx < fsx) vx = 0;
        }
        if (this.accelY[i] === 0) {
          vy -= vy * f;
          const fsy = this.frictionStatic[i];
          if (fsy > 0 && vy > -fsy && vy < fsy) vy = 0;
        }
      }

      this.velX[i] = vx;
      this.velY[i] = vy;

      // 4. 位置積分
      let px = arena.posX[i] + vx * dt;
      let py = arena.posY[i] + vy * dt;

      // 5. ワールド境界の反射
      // 当たり判定矩形の**中心**が境界を越えたら反射させます。
      // 中心判定にすることで、境界の外面と.speed の整合が取れます。
      if (hasBounds && this.collideWorldBounds[i] === 1) {
        const b = this.bounce[i];
        const left = bx0 + this._halfWidth(i);
        const right = bx1 - this._halfWidth(i);
        const top = by0 + this._halfHeight(i);
        const bottom = by1 - this._halfHeight(i);

        // 左
        if (px < left) {
          px = left;
          if (vx < 0) vx = -vx * b;
        } else if (px > right) {
          px = right;
          if (vx > 0) vx = -vx * b;
        }
        // 上
        if (py < top) {
          py = top;
          if (vy < 0) vy = -vy * b;
        } else if (py > bottom) {
          py = bottom;
          if (vy > 0) vy = -vy * b;
        }
        this.velX[i] = vx;
        this.velY[i] = vy;
      }

      arena.setPosX(i, px);
      arena.setPosY(i, py);
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

  /**
   * バッファ要素の当たり判定半径を返します。
   *
   * 優先順位:
   * 1. `PhysicsBuffer.radius`（明示指定。スカラー or 配列）
   * 2. `PhysicsBuffer.scale`（旧 API。`scale * 0.42`）
   * 3. `InstanceBufferArena` の `frameWidth * scaleX * 0.5`
   * 4. フォールバック 16
   *
   * 3 が無いと SoA アリーナ対象の半径が常に 16 に固定され、
   * 小さいスプライトでの AABB 枝刈りが効かなくなります。
   */
  private _getBufRadius(buf: InstanceBufferArena | PhysicsBuffer, index: number): number {
    if ('radius' in buf && buf.radius) {
      if (typeof buf.radius === 'number') return buf.radius;
      const r = buf.radius[index];
      if (typeof r === 'number') return r;
    }
    if ('scale' in buf && buf.scale) {
      return buf.scale[index] * 0.42;
    }
    // InstanceBufferArena には `scale` が無い（`scaleX` / `scaleY` が別配列）ため、
    // 表示寸法から半径を導出します。
    if ('frameWidth' in buf && 'scaleX' in buf) {
      return buf.frameWidth[index] * buf.scaleX[index] * 0.5;
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
