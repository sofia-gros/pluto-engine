/**
 * @file SDFCollider.ts
 * @description
 * 2D Signed Distance Field による衝突判定。
 *
 * 提供機能:
 *  - 符号付き距離場の生成 (8SSEDT)
 *  - O(1) 評価: バイリニア補間で距離と法線を得る
 *  - 円との押し出し応答: 角に引っかからず滑らかに滑る
 *  - スイープ判定: 高速移動でも貫通しない
 *
 * ゼロアロケーション:
 *  生成は初期化時に 1 回だけ。毎フレームの評価と応答は
 *  呼び出し側のバッファへ書き込むため new を発生しません。
 */

/** 1 セルあたりの保持する値の数: 距離二乗, seedX, seedY */
const STRIDE = 3;
/**
 * 未訪問の印です。
 * 距離二乗は必ず 0 以上なので -1 を使えます。
 * 巨大な有限値 (1e20 など) を番兵にすると Float32 への丸めによって
 * 「未訪問」判定が漏れるため、厳密に表現できる値を使います。
 */
const UNVISITED = -1;

export class SDFCollider {
  private width: number;
  private height: number;
  private invResolution: number;
  private resolution: number;
  private data: Float32Array;

  constructor(width: number, height: number, resolution: number, initialData?: Float32Array) {
    if (width <= 0 || height <= 0) throw new Error('SDF grid size must be positive');
    if (resolution <= 0) throw new Error('resolution must be positive');

    this.width = width;
    this.height = height;
    this.resolution = resolution;
    this.invResolution = 1.0 / resolution;

    if (initialData) {
      if (initialData.length !== width * height) {
        throw new Error('initialData length must match width * height');
      }
      this.data = initialData;
    } else {
      this.data = new Float32Array(width * height);
    }
  }

  public get gridWidth(): number {
    return this.width;
  }

  public get gridHeight(): number {
    return this.height;
  }

  public get worldWidth(): number {
    return this.width * this.resolution;
  }

  public get worldHeight(): number {
    return this.height * this.resolution;
  }

  /** 生データ (読み取り専用用途) */
  public get raw(): Float32Array {
    return this.data;
  }

  /**
   * 指定セルの距離値を設定します。
   * 正は障害物の外側、負は内側 (埋没) を表します。
   */
  public setDistance(x: number, y: number, distance: number): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    this.data[y * this.width + x] = distance;
  }

  public getDistance(x: number, y: number): number {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
    return this.data[y * this.width + x];
  }

  /**
   * ワールド座標で符号付き距離と法線を O(1) 評価します。
   * @param outResult 長さ 3 以上 [distance, normalX, normalY]
   */
  public evaluate(x: number, y: number, outResult: Float32Array): void {
    const gx = x * this.invResolution;
    const gy = y * this.invResolution;

    const ix = Math.floor(gx);
    const iy = Math.floor(gy);
    const fx = gx - ix;
    const fy = gy - iy;

    const x0 = Math.max(0, Math.min(this.width - 1, ix));
    const y0 = Math.max(0, Math.min(this.height - 1, iy));
    const x1 = Math.max(0, Math.min(this.width - 1, ix + 1));
    const y1 = Math.max(0, Math.min(this.height - 1, iy + 1));

    const d00 = this.data[y0 * this.width + x0];
    const d10 = this.data[y0 * this.width + x1];
    const d01 = this.data[y1 * this.width + x0];
    const d11 = this.data[y1 * this.width + x1];

    // バイリニア補間による距離
    const d0 = d00 * (1 - fx) + d10 * fx;
    const d1 = d01 * (1 - fx) + d11 * fx;
    const dist = d0 * (1 - fy) + d1 * fy;

    // 補間値の差分が勾配そのものになる
    const ddx = (d10 - d00) * (1 - fy) + (d11 - d01) * fy;
    const ddy = (d01 - d00) * (1 - fx) + (d11 - d10) * fx;

    const lenSq = ddx * ddx + ddy * ddy;
    let nx = 0;
    let ny = 0;
    if (lenSq > 1e-12) {
      const inv = 1.0 / Math.sqrt(lenSq);
      nx = ddx * inv;
      ny = ddy * inv;
    }

    outResult[0] = dist;
    outResult[1] = nx;
    outResult[2] = ny;
  }

  /**
   * 距離だけを求める軽量版です。法線が必要ない場面向け。
   */
  public distanceAt(x: number, y: number): number {
    const gx = x * this.invResolution;
    const gy = y * this.invResolution;
    const ix = Math.floor(gx);
    const iy = Math.floor(gy);
    const fx = gx - ix;
    const fy = gy - iy;
    const x0 = Math.max(0, Math.min(this.width - 1, ix));
    const y0 = Math.max(0, Math.min(this.height - 1, iy));
    const x1 = Math.max(0, Math.min(this.width - 1, ix + 1));
    const y1 = Math.max(0, Math.min(this.height - 1, iy + 1));
    const d00 = this.data[y0 * this.width + x0];
    const d10 = this.data[y0 * this.width + x1];
    const d01 = this.data[y1 * this.width + x0];
    const d11 = this.data[y1 * this.width + x1];
    const d0 = d00 * (1 - fx) + d10 * fx;
    const d1 = d01 * (1 - fx) + d11 * fx;
    return d0 * (1 - fy) + d1 * fy;
  }

  /**
   * 8SSEDT で符号付き距離場を生成します。
   *
   * 内外は「セル中心の座標で isSolid を呼ぶ」方式で判定します。
   * 境界で 1 セル程度の誤差が出るため、tileSize と同じ
   * 分解能なら実用上十分な滑らかさを得られます。
   *
   * 退化ケース: 世界が完全に壁、または完全に空の場合、
   * 片側の EDT に種が存在せず距離は定義できません。
   * その場合は 0 として確定し、NaN を出さないようにします。
   *
   * @param isSolid セル中心のワールド座標で固体かどうかを返す関数
   */
  public generate(isSolid: (cx: number, cy: number) => boolean): void {
    const w = this.width;
    const h = this.height;
    const n = w * h;
    const g = new Float32Array(n * STRIDE);

    // 外部距離場 (壁の外のセルが種)
    this._seed(g, isSolid, true);
    this._edt(g, w, h);
    const outer = new Float32Array(n);
    // EDT は距離二乗で持つため、ここで開いてから差し引きます
    for (let i = 0; i < n; i++) {
      outer[i] = Math.sqrt(this._finalize(g, i));
    }

    // 内部距離場 (空間のセルが種)
    this._seed(g, isSolid, false);
    this._edt(g, w, h);

    // 符号付き距離 = 外部距離 - 内部距離
    for (let i = 0; i < n; i++) {
      this.data[i] = (outer[i] - Math.sqrt(this._finalize(g, i))) * this.resolution;
    }
  }

  /**
   * 未訪問セルを 0 として確定します。
   *
   * 退化ケース (壁が 1 つも無い、または全部壁) では片方の EDT に種が無く、
   * 未訪問のまま残ります。そのまま平方根を取ると NaN になるため 0 に丸めます。
   * 通常の 2 パス EDT では全セルが訪問済なので、この処理は結果に影響しません。
   */
  private _finalize(g: Float32Array, i: number): number {
    const v = g[i * STRIDE];
    return v < 0 ? 0 : v;
  }

  /** isSolid が (wantSolid === true) と一致するセルを距離 0 の種にする */
  private _seed(g: Float32Array, isSolid: (x: number, y: number) => boolean, wantSolid: boolean): void {
    const w = this.width;
    const h = this.height;
    for (let i = 0; i < w * h; i++) {
      g[i * STRIDE] = UNVISITED;
      g[i * STRIDE + 1] = 0;
      g[i * STRIDE + 2] = 0;
    }
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (isSolid((x + 0.5) * this.resolution, (y + 0.5) * this.resolution) === wantSolid) {
          g[i * STRIDE] = 0;
          g[i * STRIDE + 1] = x;
          g[i * STRIDE + 2] = y;
        }
      }
    }
  }

  /**
   * 2 パス Chrono の 8SSEDT。
   * 各セルは (距離二乗, dx, dy) を保持し、近傍 8 方向から
   * ユークリッド距離を伝播させます。
   */
  private _edt(g: Float32Array, w: number, h: number): void {
    // パス 1: 左上から右下
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (x > 0) this._prop(g, i, i - 1, x, y);
        if (y > 0) this._prop(g, i, i - w, x, y);
        if (x > 0 && y > 0) this._prop(g, i, i - w - 1, x, y);
        if (x + 1 < w && y > 0) this._prop(g, i, i - w + 1, x, y);
      }
    }
    // パス 2: 右下から左上
    for (let y = h - 1; y >= 0; y--) {
      for (let x = w - 1; x >= 0; x--) {
        const i = y * w + x;
        if (x + 1 < w) this._prop(g, i, i + 1, x, y);
        if (y + 1 < h) this._prop(g, i, i + w, x, y);
        if (x + 1 < w && y + 1 < h) this._prop(g, i, i + w + 1, x, y);
        if (x > 0 && y + 1 < h) this._prop(g, i, i + w - 1, x, y);
      }
    }
  }

  /**
   * 近傍セル n が持つ「最寄り種の絶対座標」を、現セル i での候補として反映します。
   *
   * 保存するのは絶対座標なので隣接方向の補正は不要です。
   * 相対オフセットを保存すると伝播のたびに値が合成され、距離場が崩れます。
   */
  private _prop(g: Float32Array, i: number, n: number, x: number, y: number): void {
    const nd2 = g[n * STRIDE];
    if (nd2 < 0) return;
    const dx = g[n * STRIDE + 1] - x;
    const dy = g[n * STRIDE + 2] - y;
    const d2 = dx * dx + dy * dy;
    const cur = g[i * STRIDE];
    if (cur < 0 || d2 < cur) {
      g[i * STRIDE] = d2;
      g[i * STRIDE + 1] = g[n * STRIDE + 1];
      g[i * STRIDE + 2] = g[n * STRIDE + 2];
    }
  }

  /**
   * 円の押し出し応答を計算します。
   *
   * 障害物の内側 (距離 < 半径) なら法線に沿って外へ押し出します。
   * 結果は outPos に書き込まれます。
   *
   * @param outPos 長さ 2 以上 [x, y]
   * @param scratch 長さ 3 以上 (evaluate 用の作業領域)
   * @returns 応答が発生したか
   */
  public resolveCircle(
    cx: number,
    cy: number,
    radius: number,
    outPos: Float32Array,
    scratch: Float32Array,
  ): boolean {
    this.evaluate(cx, cy, scratch);
    const d = scratch[0];

    outPos[0] = cx;
    outPos[1] = cy;

    // 半径ぶん外側なら接触していない
    if (d >= radius) return false;
    // 完全に埋まっている場合は勾配が取れないため動かさない
    if (d <= 0) return false;

    const push = radius - d;
    outPos[0] = cx + scratch[1] * push;
    outPos[1] = cy + scratch[2] * push;
    return true;
  }

  /**
   * 2 点間のスイープ判定 (連続衝突検出)。
   * 経路を分割してサンプルするため、高速移動でも壁を貫通しません。
   *
   * @param samples 分割数。小さいほど速い代わりに薄い壁を貫通します
   * @param outHit 長さ 2 以上。接触した座標を書き込む
   * @param evalScratch 長さ 3 以上
   * @returns 接触したか
   */
  public sweep(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    radius: number,
    samples: number,
    outHit: Float32Array,
    evalScratch: Float32Array,
  ): boolean {
    const steps = Math.max(1, samples | 0);
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const sx = x0 + (x1 - x0) * t;
      const sy = y0 + (y1 - y0) * t;
      this.evaluate(sx, sy, evalScratch);
      if (evalScratch[0] < radius) {
        outHit[0] = sx;
        outHit[1] = sy;
        return true;
      }
    }
    return false;
  }

  /**
   * タイルマップ (tileId の二次元配列) から直接生成します。
   *
   * @param grid 行ごとにタイル ID を並べた配列
   * @param tileSize タイルの辺長 (ワールド単位)
   * @param isSolidTile タイル ID が固体かどうかを返す関数
   */
  public generateFromGrid(
    grid: ArrayLike<number>[],
    tileSize: number,
    isSolidTile: (tileId: number) => boolean,
  ): void {
    this.generate((x, y) => {
      const tx = Math.floor(x / tileSize);
      const ty = Math.floor(y / tileSize);
      const row = grid[ty];
      if (!row) return false;
      const t = row[tx];
      if (t === undefined) return false;
      return isSolidTile(t);
    });
  }
}
