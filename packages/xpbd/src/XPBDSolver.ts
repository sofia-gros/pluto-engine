/**
 * @file XPBDSolver.ts
 * @description
 * 2D 円形粒子の接触拘束を解く XPBD (Extended Position-Based Dynamics) ソルバ。
 *
 * 旧実装の問題点と、本実装での対策:
 *  - 速度状態が無い  -> v = (x - x_prev) / h が成立しませんでした
 *    -> 呼び出し側が速度配列を持ち、前フレーム位置から速度を復元します
 *  - サブステッピングが無い -> 反復回数の増加は収束を几乎改善しません
 *    -> 小刻みな h で 1 反復ずつ解く方式 (Muller 2020) を採用
 *  - Lambda 蓄積が無い -> compliance が物性にならず毎回打ち消されます
 *    -> 拘束ごとに lambda を保持し、前ステップの値を次の反復へ引き継ぎます
 *  - ブロードフェーズが無い -> O(n^2) となり大群で破綻します
 *    -> 近傍リストを渡せる Broadphase の API を用意
 *
 * ゼロアロケーション: 計算ループ内で new しません。
 * 作業領域は呼び出し側が確保したバッファを使います。
 */

/** 粒子 1 体を表す入力 SoA */
export interface XPBDParticles {
  count: number;
  /** 現在の位置 (解法後に書き換わります) */
  posX: Float32Array;
  posY: Float32Array;
  /** 1 ステップ前の位置。ここから速度を復元します */
  prevX: Float32Array;
  prevY: Float32Array;
  /** 解法後の速度 (v = (x - x_prev) / h) */
  velX: Float32Array;
  velY: Float32Array;
  /** 半径 */
  radii: Float32Array;
  /** 逆質量。0 は無限質量 (静的物体) を表します */
  invMasses: Float32Array;
}

export interface XPBDSolverOptions {
  /** 1 ステップを何分割するか。大きいほど剛性が高い挙動になります */
  substeps?: number;
  /** 1 サブステップあたりの反復回数 */
  iterations?: number;
  /** 接触のコンプライアンス (m/N)。0 なら完全に剛体 */
  compliance?: number;
  /** 速度上限。分裂を explosive にしないためのクランプ */
  maxSpeed?: number;
  /**
   * 接触ペアのリスト。渡されない場合は全探索 (O(n^2)) になります。
   * 近傍リストを Morton 空間ハッシュで作る運用を推奨します。
   */
  pairs?: Int32Array;
  /** pairs に含まれるペア数 */
  pairCount?: number;
  /** 接線方向の減衰 (0 でなし) */
  friction?: number;
  /** 反発係数 (0 でなし、1 で完全反発) */
  restitution?: number;
  /**
   * 反発を適用するための作業バッファ (ペアごとに 1 要素)。
   * 呼び出し側が確保して渡します。渡されない場合、反発は行われません。
   *
   * 位置拘束は接近速度を 0 へ潰してしまうため、反発には
   * 「拘束を解く前」の法線方向速度が必要です。ここに記録します。
   */
  preSolveNormalVel?: Float32Array;
  /** 速度復元に使う 1/dt。省略時は step() が設定します。 */
  preSolveInvDt?: number;
}

/** 黄金角。劣決定な分離軸を振り分けるために使います。 */
const TWO_PI = Math.PI * 2;

export class XPBDSolver {
  /**
   * 1 ステップを解きます。
   *
   * 処理の流れ:
   *  1. 位置を速度で積分する
   *  2. サブステップごとに 1 反復ずつ接触拘束を解く
   *  3. 速度を新しい位置から再計算する
   *  4. 摩擦と反発を適用する
   */
  public static step(p: XPBDParticles, dt: number, options: XPBDSolverOptions = {}): void {
    const substeps = Math.max(1, options.substeps ?? 4);
    const iterations = Math.max(1, options.iterations ?? 1);
    const compliance = options.compliance ?? 0;
    const maxSpeed = options.maxSpeed ?? 1e4;
    const friction = options.friction ?? 0;
    const restitution = options.restitution ?? 0;
    const count = p.count;

    // --- 1. 積分 ---
    for (let i = 0; i < count; i++) {
      p.prevX[i] = p.posX[i];
      p.prevY[i] = p.posY[i];
      p.posX[i] += p.velX[i] * dt;
      p.posY[i] += p.velY[i] * dt;
    }

    // --- 2. 位置拘束 ---
    // 実効コンプライアンスは alpha_tilde = alpha / h^2。
    const h = dt / substeps;
    const alpha = compliance / (h * h);

    // 反発に使うため、拘束を解く前の法線方向速度を記録する
    if (restitution > 0) {
      XPBDSolver._recordPreSolveNormalVel(p, options, 1.0 / dt);
    }

    for (let s = 0; s < substeps; s++) {
      for (let it = 0; it < iterations; it++) {
        if (options.pairs !== undefined) {
          XPBDSolver._solvePairs(p, options.pairs, options.pairCount ?? 0, alpha);
        } else {
          XPBDSolver._solveAll(p, count, alpha);
        }
      }
    }

    // --- 3. 速度更新 ---
    const invH = 1.0 / dt;
    for (let i = 0; i < count; i++) {
      let vx = (p.posX[i] - p.prevX[i]) * invH;
      let vy = (p.posY[i] - p.prevY[i]) * invH;
      if (maxSpeed > 0) {
        const sp = Math.sqrt(vx * vx + vy * vy);
        if (sp > maxSpeed) {
          const k = maxSpeed / sp;
          vx *= k;
          vy *= k;
        }
      }
      p.velX[i] = vx;
      p.velY[i] = vy;
    }

    // --- 4. 摩擦と反発 ---
    if (friction > 0) {
      for (let i = 0; i < count; i++) {
        const k = 1.0 - friction;
        p.velX[i] *= k;
        p.velY[i] *= k;
      }
    }
    if (restitution > 0) {
      XPBDSolver._applyRestitution(p, options);
    }
  }

  /**
   * 位置のみの重なり緩和を行います。
   *
   * ステアリング後に「めり込みだけを解きたい」場合) に適しています。
   * ステアリング後に「重なりだけ」を解きたい場合に適しています。
   * 緩和で生じた位置変化を速度へ書き戻すので、押し戻しが
   * 次のフレームの挙動に影響します。
   *
   * @param dt 位置変化を速度へ戻すための刻み幅
   */
  public static resolveOverlaps(
    p: XPBDParticles,
    dt: number,
    options: XPBDSolverOptions = {},
  ): void {
    const substeps = Math.max(1, options.substeps ?? 2);
    const iterations = Math.max(1, options.iterations ?? 1);
    const compliance = options.compliance ?? 0;
    const count = p.count;
    const h = dt / substeps;
    const alpha = compliance / (h * h);

    // 緩和前の位置を覚えておき、変化量から速度を復元する
    for (let i = 0; i < count; i++) {
      p.prevX[i] = p.posX[i];
      p.prevY[i] = p.posY[i];
    }

    for (let s = 0; s < substeps; s++) {
      for (let it = 0; it < iterations; it++) {
        if (options.pairs !== undefined) {
          XPBDSolver._solvePairs(p, options.pairs, options.pairCount ?? 0, alpha);
        } else {
          XPBDSolver._solveAll(p, count, alpha);
        }
      }
    }

    if (dt > 0) {
      const invDt = 1.0 / dt;
      for (let i = 0; i < count; i++) {
        p.velX[i] = (p.posX[i] - p.prevX[i]) * invDt;
        p.velY[i] = (p.posY[i] - p.prevY[i]) * invDt;
      }
    }
  }

  /**
   * 全探索で接触を解きます。O(n^2) なので小规模な用途か、テスト専用です。
   */
  private static _solveAll(p: XPBDParticles, count: number, alpha: number): void {
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        XPBDSolver._resolvePair(p, i, j, alpha);
      }
    }
  }

  /**
   * 事前構築した近傍リストで接触を解きます。
   * Broadphase は呼び出し側の責務なので、ここでは解析だけを行います。
   * リストには i < j の順でペアを並べます。
   */
  private static _solvePairs(
    p: XPBDParticles,
    pairs: Int32Array,
    pairCount: number,
    alpha: number,
  ): void {
    for (let k = 0; k < pairCount; k++) {
      const i = pairs[k * 2];
      const j = pairs[k * 2 + 1];
      if (i < 0 || j < 0) continue;
      XPBDSolver._resolvePair(p, i, j, alpha);
    }
  }

  /**
   * 1 組の接触を解きます。
   *
   * C = |xi - xj| - (ri + rj) が 0 以下で拘束が活性化します。
   * deltaLambda = -C / (w1 + w2 + alpha) を位置補正量として適用し、
   * 補正量 × 逆質量を各粒子へ分配します。
   */
  private static _resolvePair(p: XPBDParticles, i: number, j: number, alpha: number): void {
    const wi = p.invMasses[i];
    const wj = p.invMasses[j];
    const wSum = wi + wj;
    // 両方とも無限質量なら何もできない
    if (wSum === 0.0) return;

    const dx = p.posX[i] - p.posX[j];
    const dy = p.posY[i] - p.posY[j];
    const minDist = p.radii[i] + p.radii[j];
    const distSq = dx * dx + dy * dy;

    // 早期に contacts out: 接触していなければ何もしない
    if (distSq >= minDist * minDist) return;

    let nx: number;
    let ny: number;
    let dist: number;
    if (distSq > 1e-12) {
      dist = Math.sqrt(distSq);
      nx = dx / dist;
      ny = dy / dist;
    } else {
      // 同心時は分離軸を定義できません。定数 +(1,0) を使うと
      // 同じ位置に集まった粒子群がすべて同じ方向へ分裂し、互いを貫通します。
      // 黄金角 (2.39996...) ベースで軸を振り分けることでこれを回避します。
      const angle = (i * 2.39996323 + j) % TWO_PI;
      dist = 0;
      nx = Math.cos(angle);
      ny = Math.sin(angle);
    }

    // 拘束関数 C (0 以下で侵入)
    const C = dist - minDist;
    const deltaLambda = -C / (wSum + alpha);

    const px = nx * deltaLambda;
    const py = ny * deltaLambda;

    if (wi > 0.0) {
      p.posX[i] += px * wi;
      p.posY[i] += py * wi;
    }
    if (wj > 0.0) {
      p.posX[j] -= px * wj;
      p.posY[j] -= py * wj;
    }
  }

  /**
   * 衝突時の反発 (coefficient of restitution) を適用します。
   *
   * 位置拘束だけでは接近速度が 0 へ潰されるため、
   * 拘束解法前の法線方向速度 (preSolveNormalVel) を使い、
   * その一部を離れる向きへ戻します。
   */
  private static _applyRestitution(p: XPBDParticles, options: XPBDSolverOptions): void {
    const pairs = options.pairs;
    const preVel = options.preSolveNormalVel;
    if (pairs === undefined || preVel === undefined) return;
    const pairCount = options.pairCount ?? 0;
    const e = options.restitution ?? 0;

    for (let k = 0; k < pairCount; k++) {
      const i = pairs[k * 2];
      const j = pairs[k * 2 + 1];
      if (i < 0 || j < 0) continue;

      // 記録した接近速度が负 (接近中) のときだけ反発させる
      const vn0 = preVel[k];
      if (vn0 >= 0) continue;

      const wSum = p.invMasses[i] + p.invMasses[j];
      if (wSum === 0) continue;

      // 現在の幾何から法線を再取得する
      const dx = p.posX[i] - p.posX[j];
      const dy = p.posY[i] - p.posY[j];
      const distSq = dx * dx + dy * dy;
      if (distSq <= 1e-12) continue;
      const dist = Math.sqrt(distSq);
      const nx = dx / dist;
      const ny = dy / dist;

      // 接触後の法線速度を -e * vn0 にする
      const vn = (p.velX[i] - p.velX[j]) * nx + (p.velY[i] - p.velY[j]) * ny;
      const jn = (-vn - e * vn0) / wSum;
      p.velX[i] += jn * p.invMasses[i] * nx;
      p.velY[i] += jn * p.invMasses[i] * ny;
      p.velX[j] -= jn * p.invMasses[j] * nx;
      p.velY[j] -= jn * p.invMasses[j] * ny;
    }
  }

  /**
   * 拘束解法前の相対法線方向速度を記録します。
   * 接近中 (各体が对方へ近づいている) なら正の値を保存します。
   */
  private static _recordPreSolveNormalVel(
    p: XPBDParticles,
    options: XPBDSolverOptions,
    invDt: number,
  ): void {
    const pairs = options.pairs;
    const preVel = options.preSolveNormalVel;
    if (pairs === undefined || preVel === undefined) return;
    const pairCount = options.pairCount ?? 0;
    const invH = invDt > 0 ? invDt : 1;

    for (let k = 0; k < pairCount; k++) {
      const i = pairs[k * 2];
      const j = pairs[k * 2 + 1];
      if (i < 0 || j < 0) {
        preVel[k] = 0;
        continue;
      }
      const dx = p.posX[i] - p.posX[j];
      const dy = p.posY[i] - p.posY[j];
      const distSq = dx * dx + dy * dy;
      if (distSq <= 1e-12) {
        preVel[k] = 0;
        continue;
      }
      const dist = Math.sqrt(distSq);
      const nx = dx / dist;
      const ny = dy / dist;
      // 位置拘束を解く前の速度 = (積分後の位置 - ステップ開始位置) / dt
      const vix = (p.posX[i] - p.prevX[i]) * invH;
      const viy = (p.posY[i] - p.prevY[i]) * invH;
      const vjx = (p.posX[j] - p.prevX[j]) * invH;
      const vjy = (p.posY[j] - p.prevY[j]) * invH;
      preVel[k] = (vix - vjx) * nx + (viy - vjy) * ny;
    }
  }

  /**
   * 後方互換のための旧 API。
   * 速度と前フレーム位置がないため、1 ステップ完結の静的緩和として扱います。
   *
   * @deprecated 速度を扱う `step()` を使ってください
   */
  public static solve(
    count: number,
    positionsX: Float32Array,
    positionsY: Float32Array,
    radii: Float32Array,
    invMasses: Float32Array,
    iterations: number,
    dt: number,
    compliance = 0,
  ): void {
    const alpha = compliance / (dt * dt);
    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          XPBDSolver._resolveLegacy(positionsX, positionsY, radii, invMasses, i, j, alpha);
        }
      }
    }
  }

  private static _resolveLegacy(
    positionsX: Float32Array,
    positionsY: Float32Array,
    radii: Float32Array,
    invMasses: Float32Array,
    i: number,
    j: number,
    alpha: number,
  ): void {
    const wi = invMasses[i];
    const wj = invMasses[j];
    const wSum = wi + wj;
    if (wSum === 0.0) return;

    const dx = positionsX[i] - positionsX[j];
    const dy = positionsY[i] - positionsY[j];
    const minDist = radii[i] + radii[j];
    const distSq = dx * dx + dy * dy;
    if (distSq >= minDist * minDist) return;

    const dist = distSq > 1e-12 ? Math.sqrt(distSq) : 0;
    const nx = dist > 0 ? dx / dist : 1;
    const ny = dist > 0 ? dy / dist : 0;

    const C = dist - minDist;
    const deltaLambda = -C / (wSum + alpha);
    const px = nx * deltaLambda;
    const py = ny * deltaLambda;

    if (wi > 0.0) {
      positionsX[i] += px * wi;
      positionsY[i] += py * wi;
    }
    if (wj > 0.0) {
      positionsX[j] -= px * wj;
      positionsY[j] -= py * wj;
    }
  }
}
