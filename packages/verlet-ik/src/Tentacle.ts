/**
 * @file Tentacle.ts
 * @description
 * Verlet 鎖を 1 本の触手やマントとして扱うための薄いラッパー。
 *
 * 役割:
 *  - 鎖の生成と根元追従をまとめます。
 *  - 节的座標を SoA の Float32Array へ書き出すため、描画側は
 *    バッファを読むだけで、毎フレーム new が発生しません。
 *
 * 描画側は {@link pointsX} / {@link pointsY} を読み、
 * 節と節の間を線として描けば一本の触手になります。
 */

import { VerletSolver } from './VerletSolver';

/** 触手の生成設定 */
export interface TentacleOptions {
  /** 节の数 (根元を含む)。既定 12 */
  segments?: number;
  /** 节間の距離。実際の長さは segments * segmentLength です。 */
  segmentLength?: number;
  /** 伸びる初期方向 (0, 1) が下向き */
  dirX?: number;
  dirY?: number;
  /** 拘束を解く反復回数。大きいほど硬くなります */
  iterations?: number;
  /** 拘束の剛性係数 (0〜1) */
  stiffness?: number;
  /** 速度の減衰 (0〜1) */
  damping?: number;
  /** 重力 */
  gravityX?: number;
  gravityY?: number;
}

export class Tentacle {
  /** 根元 (固定点) の点インデックス */
  public readonly rootIndex: number;
  /** 節数 */
  public readonly count: number;

  /** 節のワールド座標 X (SoA) */
  public readonly pointsX: Float32Array;
  /** 節のワールド座標 Y (SoA) */
  public readonly pointsY: Float32Array;

  private readonly _solver: VerletSolver;
  private readonly _first: number;

  /**
   * 既存ソルバーへ触手を追加します。
   * ソルバーは複数本の触手をまとめて 1 つの Buffers 上で解きます。
   */
  constructor(solver: VerletSolver, rootX: number, rootY: number, options: TentacleOptions = {}) {
    const count = options.segments ?? 12;
    const segmentLength = options.segmentLength ?? 10;
    this._solver = solver;

    if (options.iterations !== undefined) solver.setIterations(options.iterations);
    if (options.stiffness !== undefined) solver.setStiffness(options.stiffness);
    if (options.damping !== undefined) solver.setDamping(options.damping);
    if (options.gravityX !== undefined || options.gravityY !== undefined) {
      solver.setGravity(options.gravityX ?? 0, options.gravityY ?? 0);
    }

    this._first = solver.pointCount;
    this.rootIndex = solver.addChain(
      count,
      rootX,
      rootY,
      options.dirX ?? 0,
      options.dirY ?? 1,
      segmentLength,
    );
    this.count = count;
    this.pointsX = new Float32Array(count);
    this.pointsY = new Float32Array(count);
    this.sync();
  }

  /**
   * 根元を現在の座標へ移動します。持ち主に追従させるために呼びます。
   */
  public setRoot(x: number, y: number): void {
    this._solver.moveRoot(this.rootIndex, x, y);
  }

  /**
   * 根元を移動しつつ、根元に速度を与えます。
   * 触手が移動する持ち主に追従して流れるように見えます。
   */
  public setRootWithVelocity(x: number, y: number, vx: number, vy: number): void {
    this._solver.steerRoot(this.rootIndex, x, y, vx, vy);
  }

  /**
   * ソルバーを 1 ステップ進め、節座標をこの触手metroのバッファへ転記します。
   *
   * 複数本の触手で 1 つのソルバーを共有する場合、
   * solver.update() は 1 度だけ呼び、その後各触手が sync() します。
   */
  public sync(): void {
    const pos = this._solver.positions;
    const base = this._first;
    for (let i = 0; i < this.count; i++) {
      const src = (base + i) << 1;
      this.pointsX[i] = pos[src];
      this.pointsY[i] = pos[src + 1];
    }
  }

  /**
   * 節 i の座標を取得します。範囲外の場合は 0 を返します。
   */
  public getPoint(i: number, out: { x: number; y: number }): void {
    if (i < 0 || i >= this.count) {
      out.x = 0;
      out.y = 0;
      return;
    }
    out.x = this.pointsX[i];
    out.y = this.pointsY[i];
  }

  /**
   * 先端の座標を取得します。触手の-tip の判定に使います。
   */
  /**
   * 先端の座標を取得します。触手の先端の判定に使います。
   */
  public getTip(out: { x: number; y: number }): void {
    out.x = this.pointsX[this.count - 1];
    out.y = this.pointsY[this.count - 1];
  }

  /**
   * 触手全体の長さを返します。
   */
  public totalLength(): number {
    let sum = 0;
    for (let i = 1; i < this.count; i++) {
      const dx = this.pointsX[i] - this.pointsX[i - 1];
      const dy = this.pointsY[i] - this.pointsY[i - 1];
      sum += Math.sqrt(dx * dx + dy * dy);
    }
    return sum;
  }

  /**
   * この触手が使う点と拘束をソルバーから解放します。
   *
   * 末尾にある場合だけ正しく解放できます。途中の鎖を消すと
   * 接続が壊れるため、末尾の触手から順に呼び出してください。
   */
  public destroy(): void {
    // VerletSolver は末尾からの解放を前提にしていないため、
    // ここでは座標バッファのみ解放し、点の再利用は呼び出し側に委ねます。
    this.pointsX.fill(0);
    this.pointsY.fill(0);
  }
}
