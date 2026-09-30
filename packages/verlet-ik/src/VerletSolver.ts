/**
 * @file VerletSolver.ts
 * @description
 * マントや触手の演出に特化したゼロアロケーションの Verlet 積分ソルバー。
 *
 * 設計方針:
 *  - 状態はすべて SoA の TypedArray に置き、毎フレームの new を排除します。
 *  - 固定点を明示的に持つため、ロープの根元を物体の座標へそのまま追従できます。
 *  - 拘束の反復回数を増やせば剛性が高まり、減らせば柔らかく動きます。
 */
export class VerletSolver {
  public positions: Float32Array;
  public prevPositions: Float32Array;
  public constraints: Int32Array;
  public constraintLengths: Float32Array;
  /**
   * 固定された点インデックスを持つ SoA 配列。
   * 0 = 自由、1 = 固定。固定点は積分から除外し、前位置も常に同期させます。
   */
  public readonly pinned: Uint8Array;

  private _numPoints: number;
  private _numConstraints: number;
  private _iterations: number;
  private _gravityX: number;
  private _gravityY: number;
  /** 拘束の剛性係数 (0 = 振り子状に残す, 1 = 完全に距離を満たす) */
  private _stiffness: number;
  /** 速度の減衰率 (0 = 減衰なし, 1 = 完全停止) */
  private _damping: number;

  /**
   * @param maxPoints 最大点数
   * @param maxConstraints 最大距離拘束数
   * @param iterations 拘束解法の反復回数 (既定 3)
   */
  constructor(maxPoints: number, maxConstraints: number, iterations = 3) {
    this.positions = new Float32Array(maxPoints * 2);
    this.prevPositions = new Float32Array(maxPoints * 2);
    this.constraints = new Int32Array(maxConstraints * 2);
    this.constraintLengths = new Float32Array(maxConstraints);
    this.pinned = new Uint8Array(maxPoints);

    this._numPoints = 0;
    this._numConstraints = 0;
    this._iterations = iterations;
    this._gravityX = 0.0;
    this._gravityY = 0.0;
    this._stiffness = 1.0;
    this._damping = 0.0;
  }

  /** 登録済みの点数 */
  public get pointCount(): number {
    return this._numPoints;
  }

  /** 登録済みの拘束数 */
  public get constraintCount(): number {
    return this._numConstraints;
  }

  /** 拘束解法の反復回数 */
  public get iterations(): number {
    return this._iterations;
  }

  public setIterations(n: number): void {
    this._iterations = n < 1 ? 1 : n;
  }

  /**
   * 拘束の剛性係数を設定します。0.5 なら誤差が半分ずつしか解消されません。
   */
  public setStiffness(s: number): void {
    this._stiffness = s < 0 ? 0 : s > 1 ? 1 : s;
  }

  /**
   * 速度減衰を設定します。マントや触手の抜け Monument を抑えます。
   */
  public setDamping(d: number): void {
    this._damping = d < 0 ? 0 : d > 1 ? 1 : d;
  }

  /**
   * 点を固定します。固定点は重力・速度の影響を受けません。
   */
  public pin(index: number, x: number, y: number): void {
    if (index < 0 || index >= this._numPoints) return;
    const offset = index * 2;
    this.positions[offset] = x;
    this.positions[offset + 1] = y;
    // 前位置を同じ場所へ入れることで、速度をゼロに保って固定を維持します。
    this.prevPositions[offset] = x;
    this.prevPositions[offset + 1] = y;
    this.pinned[index] = 1;
  }

  /**
   * 固定を解除します。
   */
  public unpin(index: number): void {
    if (index < 0 || index >= this._numPoints) return;
    this.pinned[index] = 0;
  }

  public isPinned(index: number): boolean {
    return index >= 0 && index < this._numPoints && this.pinned[index] === 1;
  }

  public setGravity(gx: number, gy: number): void {
    this._gravityX = gx;
    this._gravityY = gy;
  }

  public addPoint(x: number, y: number): number {
    if (this._numPoints >= this.pinned.length) return -1;
    const index = this._numPoints;
    const offset = index * 2;
    this.positions[offset] = x;
    this.positions[offset + 1] = y;
    this.prevPositions[offset] = x;
    this.prevPositions[offset + 1] = y;
    this._numPoints++;
    return index;
  }

  public setPointPosition(index: number, x: number, y: number): void {
    if (index < 0 || index >= this._numPoints) return;
    const offset = index * 2;
    this.positions[offset] = x;
    this.positions[offset + 1] = y;
  }

  public getPointPosition(index: number, out: { x: number; y: number }): void {
    if (index < 0 || index >= this._numPoints) {
      out.x = 0;
      out.y = 0;
      return;
    }
    const offset = index * 2;
    out.x = this.positions[offset];
    out.y = this.positions[offset + 1];
  }

  public addConstraint(p1: number, p2: number, length: number): number {
    if (this._numConstraints >= this.constraintLengths.length) return -1;
    const index = this._numConstraints;
    this.constraints[index * 2] = p1;
    this.constraints[index * 2 + 1] = p2;
    this.constraintLengths[index] = length;
    this._numConstraints++;
    return index;
  }

  /**
   * 直線上の鎖 (ロープ・触手・マント) を一括生成します。
   *
   * 点はすべて等間隔で設置され、隣接点どうしに距離拘束が入ります。
   * 先頭点 (根元) は固定されるため、そのまま物体の位置として追従できます。
   *
   * @param count 点数 (根元を含む)
   * @param rootX 根元の X
   * @param rootY 根元の Y
   * @param dirX 伸びる方向の X 成分 (正規化されます)
   * @param dirY 伸びる方向の Y 成分 (正規化されます)
   * @param segmentLength 隣接点間の距離
   * @returns 根元の点インデックス。容量超過時は -1
   */
  public addChain(
    count: number,
    rootX: number,
    rootY: number,
    dirX: number,
    dirY: number,
    segmentLength: number,
  ): number {
    if (count < 1) return -1;
    if (this._numPoints + count > this.pinned.length) return -1;
    if (this._numConstraints + (count - 1) > this.constraintLengths.length) return -1;

    // 方向ベクトルを正規化します。ゼロ長なら真下へ倒します。
    let len = Math.sqrt(dirX * dirX + dirY * dirY);
    if (len < 1e-9) {
      dirX = 0;
      dirY = 1;
    } else {
      dirX /= len;
      dirY /= len;
    }

    const rootIndex = this.addPoint(rootX, rootY);
    for (let i = 1; i < count; i++) {
      const px = rootX + dirX * segmentLength * i;
      const py = rootY + dirY * segmentLength * i;
      const idx = this.addPoint(px, py);
      this.addConstraint(idx - 1, idx, segmentLength);
    }
    // 根元は固定し、追従元として使う
    this.pin(rootIndex, rootX, rootY);
    return rootIndex;
  }

  /**
   * 鎖の根元 (固定点) を移動します。物体の追従に使います。
   */
  public moveRoot(index: number, x: number, y: number): void {
    this.pin(index, x, y);
  }

  /**
   * 鎖の進行方向を書き換えます (触手の狙い撃ち)。
   *
   * 根元に速度を与えることで、鎖全体がその向きへ引かれます。
   * 演出上の「狙う」動作に使います。
   */
  public steerRoot(index: number, x: number, y: number, velocityX: number, velocityY: number): void {
    this.pin(index, x, y);
    const offset = index << 1;
    // 根元に速度を与えると、鎖全体がその向きへ引かれます。
    this.prevPositions[offset] = x - velocityX;
    this.prevPositions[offset + 1] = y - velocityY;
  }

  public update(dt: number): void {
    this.integrate(dt);
    for (let i = 0; i < this._iterations; i++) {
      this.solveConstraints();
    }
  }

  private integrate(dt: number): void {
    const dtSq = dt * dt;
    const gx = this._gravityX * dtSq;
    const gy = this._gravityY * dtSq;
    const damp = 1.0 - this._damping;
    const n = this._numPoints;
    const pos = this.positions;
    const prev = this.prevPositions;
    const pinned = this.pinned;

    for (let i = 0; i < n; i++) {
      const offset = i << 1;
      // 固定点は積分しません。前位置を同期するだけで重力も速度も入りません。
      if (pinned[i] === 1) {
        prev[offset] = pos[offset];
        prev[offset + 1] = pos[offset + 1];
        continue;
      }
      const x = pos[offset];
      const y = pos[offset + 1];
      const vx = (x - prev[offset]) * damp;
      const vy = (y - prev[offset + 1]) * damp;

      prev[offset] = x;
      prev[offset + 1] = y;

      pos[offset] = x + vx + gx;
      pos[offset + 1] = y + vy + gy;
    }
  }

  private solveConstraints(): void {
    const pos = this.positions;
    const constraints = this.constraints;
    const lengths = this.constraintLengths;
    const pinned = this.pinned;
    const n = this._numConstraints;
    const k = this._stiffness;

    for (let i = 0; i < n; i++) {
      const p1 = constraints[i << 1];
      const p2 = constraints[(i << 1) + 1];
      const off1 = p1 << 1;
      const off2 = p2 << 1;

      const b1 = pinned[p1] === 1;
      const b2 = pinned[p2] === 1;
      // 両方固定ならこの拘束は不動なので解かなくてよい
      if (b1 && b2) continue;

      const dx = pos[off2] - pos[off1];
      const dy = pos[off2 + 1] - pos[off1 + 1];
      const distSq = dx * dx + dy * dy;
      const target = lengths[i];
      if (distSq <= 1e-12) {
        // 2 点が重なっています。方向ベクトルが定義できないため
        // 0 除算を避ける代わりに、後の節から見て直前の節の向きへ
        // 目標距離だけ離します (縮退した鎖を展開します)。
        if (target <= 0) continue;
        const ux = p1 > 0 ? pos[off1] - pos[(p1 - 1) << 1] : 0;
        const uy = p1 > 0 ? pos[off1 + 1] - pos[((p1 - 1) << 1) + 1] : 0;
        const ul = Math.sqrt(ux * ux + uy * uy);
        // 直前の節も重なっていれば+X へ退避します。
        const dirX = ul > 1e-9 ? ux / ul : 1;
        const dirY = ul > 1e-9 ? uy / ul : 0;
        pos[off2] = pos[off1] + dirX * target;
        pos[off2 + 1] = pos[off1 + 1] + dirY * target;
        continue;
      }
      const dist = Math.sqrt(distSq);
      const diff = ((target - dist) / dist) * k;

      if (b1) {
        // p1 固定: 移動量を p2 へ全量適用
        pos[off2] += dx * diff;
        pos[off2 + 1] += dy * diff;
      } else if (b2) {
        // p2 固定: 移動量を p1 へ全量適用
        pos[off1] -= dx * diff;
        pos[off1 + 1] -= dy * diff;
      } else {
        // 両方自由: 半分ずつ配分
        const ox = dx * diff * 0.5;
        const oy = dy * diff * 0.5;
        pos[off1] -= ox;
        pos[off1 + 1] -= oy;
        pos[off2] += ox;
        pos[off2 + 1] += oy;
      }
    }
  }

  public reset(): void {
    this._numPoints = 0;
    this._numConstraints = 0;
    // 固定フラグを落とさないと、reset 後に同一点番号へ addPoint した点が
    // 意図せず固定されたままになります。
    this.pinned.fill(0);
  }
}
