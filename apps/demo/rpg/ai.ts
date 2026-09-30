/**
 * @file ai.ts
 * @description
 * rpg デモの.SoA Utility AI。
 *
 * 以前は Monster ごとに FSM (idle / aggro / attack / dead) を持ち、
 * update 内で分岐していました。個体数が増えると遷移の組み合わせが
 * 以前は Monster ごとに FSM (idle / aggro / attack / dead) を持ち、
 *
 * ここでは SoA 配列 (距離・HP・種別フラグ) と
 * `UtilityAISystem` を使い、全個体まとめて行動を 1 回で決めます。
 * 追加したい行動は `evaluateAction` を 1 回足すだけで済みます。
 */

import { UtilityAISystem } from '@pluto-engine/ai';

/** 行動 ID。SoA へ格納されます。 */
export const enum MonsterAction {
  /** プレイヤーへ接近する */
  Chase = 0,
  /** 距離を保ちながら射撃する (スケルトン・ボス) */
  KeepDistance = 1,
  /** その場で待機する */
  Idle = 2,
  /** 低 HP なので後退する */
  Retreat = 3,
  /** 攻撃行動 */
  Attack = 4,
}

export interface MonsterAiConfig {
  /** 接近を好む距離 (これより近いと效用が下がる) */
  preferredRange: number;
  /** 射撃の最適距離 */
  preferredShootRange: number;
  /** 後退を始める HP 比率 */
  retreatHpRatio: number;
  /** 接近を諦める距離 */
  giveUpRange: number;
}

const DEFAULTS: MonsterAiConfig = {
  preferredRange: 90,
  preferredShootRange: 220,
  retreatHpRatio: 0.25,
  giveUpRange: 900,
};

export class MonsterUtilityAI {
  private readonly ai: UtilityAISystem;
  private readonly config: MonsterAiConfig;

  /** プレイヤーまでの距離 (毎フレーム更新) */
  public readonly dist: Float32Array;
  /** 正規化した HP (0.0 - 1.0) */
  public readonly hpRatio: Float32Array;
  /** 射撃可能なら 1 */
  public readonly canShoot: Float32Array;
  /** ボスなら 1 */
  public readonly isBoss: Float32Array;
  /** 個体数 */
  public count = 0;

  /** 評価に使う内部定数 */
  private readonly _invGiveUp: number;
  private readonly _hpRetreat: number;

  constructor(maxEnemies: number, config: Partial<MonsterAiConfig> = {}) {
    this.ai = new UtilityAISystem(maxEnemies);
    this.config = { ...DEFAULTS, ...config };
    this.dist = new Float32Array(maxEnemies);
    this.hpRatio = new Float32Array(maxEnemies);
    this.canShoot = new Float32Array(maxEnemies);
    this.isBoss = new Float32Array(maxEnemies);
    this._invGiveUp = 1.0 / this.config.giveUpRange;
    this._hpRetreat = this.config.retreatHpRatio;
  }

  /**
   * 全個体の状態を SoA へ書き込み、行動を選び直します。
   *
   * 呼び出し側は個体ごとのオブジェクトではなく、
   * 位置と HP だけを渡します。
   *
   * @param xs 個体の X 座標
   * @param ys 個体の Y 座標
   * @param hp 現在の HP
   * @param maxHp 最大 HP
   * @param canShoot 射撃可能なら 1
   * @param boss ボスなら 1
   */
  public update(
    xs: Float32Array,
    ys: Float32Array,
    hp: Float32Array,
    maxHp: Float32Array,
    canShoot: Float32Array,
    boss: Float32Array,
    playerX: number,
    playerY: number,
    count: number,
  ): void {
    this.count = count;
    if (count === 0) return;

    // --- 入力の SoA 化 ---
    for (let i = 0; i < count; i++) {
      const dx = playerX - xs[i];
      const dy = playerY - ys[i];
      this.dist[i] = Math.sqrt(dx * dx + dy * dy);
      this.hpRatio[i] = maxHp[i] > 0 ? hp[i] / maxHp[i] : 0;
      this.canShoot[i] = canShoot[i];
      this.isBoss[i] = boss[i];
    }

    this.ai.beginEvaluation(count);

    // --- 接近の効用 ---
    // 距離が好む範囲に近いほど高い。射程外なら 0 に近づく。
    const preferred = this.config.preferredRange;
    this.ai.evaluateAction(MonsterAction.Chase, count, (out, n) => {
      for (let i = 0; i < n; i++) {
        const d = this.dist[i];
        if (d >= this.config.giveUpRange) {
          out[i] = 0;
        } else {
          // 好む距離との差を 0〜1 に正規化してから反転する
          const err = (d - preferred) / preferred;
          out[i] = err <= 0 ? 1.0 : 1.0 - Math.min(1, err * 0.35);
        }
      }
    });

    // --- 距離取りの効用 (射撃可能個体のみ) ---
    const shootRange = this.config.preferredShootRange;
    this.ai.evaluateAction(MonsterAction.KeepDistance, count, (out, n) => {
      for (let i = 0; i < n; i++) {
        if (this.canShoot[i] === 0) {
          out[i] = 0;
          continue;
        }
        const d = this.dist[i];
        // 好む射撃距離に近いほど高い
        const err = (d - shootRange) / shootRange;
        out[i] = 1.0 - Math.min(1, Math.abs(err));
      }
    });

    // --- 待機の効用 ---
    // 遠いほど高い (何もしないのが安全な場合)
    this.ai.evaluateAction(MonsterAction.Idle, count, (out, n) => {
      for (let i = 0; i < n; i++) {
        out[i] = this.dist[i] * this._invGiveUp;
      }
    });

    // --- 後退の効用 ---
    // HP が低いほど高い。ボスは逃走しないので効用を無効化します。
    this.ai.evaluateAction(MonsterAction.Retreat, count, (out, n) => {
      for (let i = 0; i < n; i++) {
        if (this.isBoss[i] === 1) {
          out[i] = 0;
          continue;
        }
        const low = this._hpRetreat - this.hpRatio[i];
        out[i] = low > 0 ? 1.0 + low * 3.0 : 0;
      }
    });

    // --- 攻撃の効用 ---
    // 攻撃間隔を跨いだときだけ発動するよう、HP ではなく
    // 距離と射撃可否で決めます。
    this.ai.evaluateAction(MonsterAction.Attack, count, (out, n) => {
      for (let i = 0; i < n; i++) {
        const d = this.dist[i];
        if (d > this.config.preferredRange) {
          out[i] = 0;
        } else {
          out[i] = 0.85;
        }
      }
    });
  }

  /**
   * 個体の選択された行動を返します。
   */
  public actionOf(index: number): MonsterAction {
    return this.ai.selectAction(index) as MonsterAction;
  }

  /**
   * 選択された行動の効用スコアを返します。
   */
  public scoreOf(index: number): number {
    return this.ai.scoreOf(index);
  }
}
