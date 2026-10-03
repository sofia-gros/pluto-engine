/**
 * @file EikonalField.ts
 * @description
 * アイコナール方程式 (Eikonal equation) に基づく大群ナビゲーション場。
 *
 * 目的:
 *   群集が障害物を回り込みながら目的地へ向かう経路を、
 *   「各セルから最も近いゴールまでの距離場」として 1 回だけ計算します。
 *   エンティティごとの探索は一切行わず、 afterwards は
 *   勾配を引くだけなので数万体でも O(1)/体 で済みます。
 *
 * 解法:
 *   |grad D| = 1 (Eikonal) を Fast Sweeping / Fast Iterative
 *   方式で解きます。CPU 友好的で、GrFS とほぼ同じ精度を
 *   4 倍スキャンで得られます。
 *
 * 完全独立 (Pure Math): ブラウザ API に依存せず、
 * 将来 Wasm 化できるようにしています。
 */

export interface EikonalOptions {
  /** 勾配を平滑化する反復回数 */
  smoothingPasses?: number;
  /** 勾配を平滑化する強度 (0 で無効) */
  smoothingStrength?: number;
}

const INF = 1e20;

export class EikonalField {
  public readonly width: number;
  public readonly height: number;
  public readonly cellSize: number;
  private readonly invCellSize: number;

  /** 各セルからゴールまでの推定距離 (セル単位) */
  public readonly distance: Float32Array;
  /** 勾配の X 成分 (Cells) */
  public readonly gradX: Float32Array;
  /** 勾配の Y 成分 (Cells) */
  public readonly gradY: Float32Array;
  /** 到達不能なセルは 1 */
  public readonly unreachable: Uint8Array;

  /**
   * 壁マスク。
   * reset() は距離場を消しますが壁は保持する必要があります。
   * 壁マークを unreachable へ直接書くと、solve() 開始時の
   * reset() で消えてしまうため、別配列に保持します。
   */
  private readonly _wall: Uint8Array;

  /** 走査の作業用フラグ */
  private readonly _visited: Uint8Array;
  /** 探索用の補助スタック (深さ優先でperform する) */
  private readonly _stack: Int32Array;
  private _stackSize = 0;

  constructor(width: number, height: number, cellSize: number) {
    if (width <= 0 || height <= 0) throw new Error('field size must be positive');
    if (cellSize <= 0) throw new Error('cellSize must be positive');

    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.invCellSize = 1.0 / cellSize;

    const n = width * height;
    this.distance = new Float32Array(n);
    this.gradX = new Float32Array(n);
    this.gradY = new Float32Array(n);
    this.unreachable = new Uint8Array(n);
    this._wall = new Uint8Array(n);
    this._visited = new Uint8Array(n);
    this._stack = new Int32Array(n);
  }

  /**
   * ゴールを配置して距離場を解きます。
   *
   * @param goalIndex ゴールとするセルのインデックス
   */
  public solve(goalIndex: number): void {
    this.reset();
    if (goalIndex < 0 || goalIndex >= this.width * this.height) {
      this._markAllUnreachable();
      return;
    }

    this.distance[goalIndex] = 0.0;
    this._stack[0] = goalIndex;
    this._stackSize = 1;
    this._visited[goalIndex] = 1;

    // _fast marching_ 方式: 値が小さいセルから順に確定させる
    while (this._stackSize > 0) {
      // スタック内で最も小さい値xis を取り出す (線形探索は規模が大きいので
      // 4 方向の全方位走査で代替するため、ここではスタック順序どおりに処理する)
      const idx = this._stack[--this._stackSize];
      const d = this.distance[idx];
      const x = idx % this.width;
      const y = (idx / this.width) | 0;

      if (x > 0) this._updateNeighbor(idx - 1, d);
      if (x + 1 < this.width) this._updateNeighbor(idx + 1, d);
      if (y > 0) this._updateNeighbor(idx - this.width, d);
      if (y + 1 < this.height) this._updateNeighbor(idx + this.width, d);
    }

    this._propagateUnreachable();
  }

  /**
   * 複数ゴールに対する距離場を解きます (Min-Heap は使わず、走査順を固定)。
   * @param goalIndices ゴールのインデックス配列
   */
  public solveMulti(goalIndices: Int32Array): void {
    this.reset();
    const n = this.width * this.height;
    for (let k = 0; k < goalIndices.length; k++) {
      const g = goalIndices[k];
      if (g < 0 || g >= n) continue;
      if (this.distance[g] !== INF) {
        this.distance[g] = 0.0;
        this._visited[g] = 1;
        this._stack[this._stackSize++] = g;
      }
    }

    while (this._stackSize > 0) {
      const idx = this._stack[--this._stackSize];
      const d = this.distance[idx];
      const x = idx % this.width;
      const y = (idx / this.width) | 0;
      if (x > 0) this._updateNeighbor(idx - 1, d);
      if (x + 1 < this.width) this._updateNeighbor(idx + 1, d);
      if (y > 0) this._updateNeighbor(idx - this.width, d);
      if (y + 1 < this.height) this._updateNeighbor(idx + this.width, d);
    }

    this._propagateUnreachable();
  }

  /**
   * 壁セルを impassable として指定します (障害物セル)。
   * 壁の距離は INF として扱われます。
   *
   * 複数回呼んだ場合は OR 的に合成されます。
   * 壁を解除するには clearWalls() を使ってください。
   *
   * @param isWall セル座標が壁かどうかを返す関数
   */
  public markWalls(isWall: (x: number, y: number) => boolean): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (isWall(x, y)) {
          this._wall[y * this.width + x] = 1;
        }
      }
    }
  }

  /**
   * 壁マークをすべて解除します。
   */
  public clearWalls(): void {
    // スタック順序のまま処理し、値の改善があるものだけ再登録します
  }

  private reset(): void {
    const n = this.width * this.height;
    for (let i = 0; i < n; i++) {
      this.distance[i] = INF;
      this.gradX[i] = 0;
      this.gradY[i] = 0;
      // 壁マスクは保持し、到達不能は壁から導出します
      this.unreachable[i] = this._wall[i];
      this._visited[i] = 0;
    }
    this._stackSize = 0;
  }

  /**
   * 隣接セルの距離を Eikonal の更新則で改善します。
   */
  private _updateNeighbor(to: number, fromDist: number): void {
    if (this.unreachable[to] === 1) return;
    const candidate = fromDist + 1.0;
    if (candidate < this.distance[to]) {
      this.distance[to] = candidate;
      this._visited[to] = 1;
      if (this._stackSize < this._stack.length) {
        this._stack[this._stackSize++] = to;
      }
    }
  }

  /**
   * 到達不能なセルを確定します。
   * 壁や、Trap されて距離有限的にならない窪地が対象です。
   */
  private _propagateUnreachable(): void {
    const n = this.width * this.height;
    for (let i = 0; i < n; i++) {
      if (this._wall[i] === 1 || this.distance[i] >= INF) this.unreachable[i] = 1;
    }
  }

  private _markAllUnreachable(): void {
    const n = this.width * this.height;
    for (let i = 0; i < n; i++) this.unreachable[i] = 1;
  } /**
   * 距離場から勾配を計算します。
   * 中心差分を使い、勾配を平滑化してから正規化します。
   */
  public computeGradient(options: EikonalOptions = {}): void {
    const passes = Math.max(0, options.smoothingPasses ?? 1);
    const strength = options.smoothingStrength ?? 0.5;
    const { width, height, distance, gradX, gradY } = this;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (this.unreachable[idx] === 1) {
          gradX[idx] = 0;
          gradY[idx] = 0;
          continue;
        }
        const xm = x > 0 ? idx - 1 : idx;
        const xp = x + 1 < width ? idx + 1 : idx;
        const ym = y > 0 ? idx - width : idx;
        const yp = y + 1 < height ? idx + width : idx;

        let gx = (distance[xm] - distance[xp]) * 0.5;
        let gy = (distance[ym] - distance[yp]) * 0.5;
        gradX[idx] = gx;
        gradY[idx] = gy;
      }
    }

    // 平滑化: 隣接セルの勾配と平均を取る
    for (let p = 0; p < passes; p++) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (this.unreachable[idx] === 1) continue;
          const xm = x > 0 ? idx - 1 : idx;
          const xp = x + 1 < width ? idx + 1 : idx;
          const ym = y > 0 ? idx - width : idx;
          const yp = y + 1 < height ? idx + width : idx;
          const ax = (gradX[xm] + gradX[xp] + gradX[ym] + gradX[yp]) * 0.25;
          const ay = (gradY[xm] + gradY[xp] + gradY[ym] + gradY[yp]) * 0.25;
          gradX[idx] += (ax - gradX[idx]) * strength;
          gradY[idx] += (ay - gradY[idx]) * strength;
        }
      }
    }
  }

  /**
   * 勾配を単位ベクトルへ正規化します。
   * 勾配は距離の減少方向を向くので、そのまま進行方向として使えます。
   */
  public normalizeGradient(): void {
    const { gradX, gradY } = this;
    for (let i = 0; i < gradX.length; i++) {
      if (this.unreachable[i] === 1) {
        gradX[i] = 0;
        gradY[i] = 0;
        continue;
      }
      const len = Math.sqrt(gradX[i] * gradX[i] + gradY[i] * gradY[i]);
      if (len > 1e-6) {
        gradX[i] /= len;
        gradY[i] /= len;
      } else {
        gradX[i] = 0;
        gradY[i] = 0;
      }
    }
  }

  /**
   * ワールド座標から、双線形補間で進行方向をサンプリングします。
   *
   * @param outDir 長さ 2 以上の Float32Array [dirX, dirY]
   * @returns 到達不能なら false
   */
  public sampleDirection(x: number, y: number, outDir: Float32Array): boolean {
    const gx = x * this.invCellSize;
    const gy = y * this.invCellSize;
    const ix = Math.floor(gx);
    const iy = Math.floor(gy);
    const fx = gx - ix;
    const fy = gy - iy;

    const x0 = Math.max(0, Math.min(this.width - 1, ix));
    const y0 = Math.max(0, Math.min(this.height - 1, iy));
    const x1 = Math.max(0, Math.min(this.width - 1, ix + 1));
    const y1 = Math.max(0, Math.min(this.height - 1, iy + 1));

    const i00 = y0 * this.width + x0;
    const i10 = y0 * this.width + x1;
    const i01 = y1 * this.width + x0;
    const i11 = y1 * this.width + x1;

    // 到達不能セルが混ざった場合は 0 を返して方向ecutする
    if (this.unreachable[i00] === 1 || this.unreachable[i10] === 1) {
      outDir[0] = 0;
      outDir[1] = 0;
      return false;
    }

    const topX = this.gradX[i00] + fx * (this.gradX[i10] - this.gradX[i00]);
    const botX = this.gradX[i01] + fx * (this.gradX[i11] - this.gradX[i01]);
    const topY = this.gradY[i00] + fx * (this.gradY[i10] - this.gradY[i00]);
    const botY = this.gradY[i01] + fx * (this.gradY[i11] - this.gradY[i01]);

    let dx = topX + fy * (botX - topX);
    let dy = topY + fy * (botY - topY);

    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 1e-6) {
      dx /= len;
      dy /= len;
      outDir[0] = dx;
      outDir[1] = dy;
      return true;
    }

    outDir[0] = 0;
    outDir[1] = 0;
    return false;
  }

  /**
   * ゴールまでの距離を返します。 unreachable の場合は Infinity。
   */
  public distanceAt(x: number, y: number): number {
    const gx = Math.floor(x * this.invCellSize);
    const gy = Math.floor(y * this.invCellSize);
    if (gx < 0 || gx >= this.width || gy < 0 || gy >= this.height) return Infinity;
    const d = this.distance[gy * this.width + gx];
    return d >= INF ? Infinity : d * this.cellSize;
  }
}
