/**
 * @file UtilityAISystem.ts
 * @description
 * SoA 構造の Utility AI。
 *
 * FSM (状態遷移) は遷移条件が増えるほど組み合わせが爆発し、
 * 挙動の把握も困難になります。Utility AI は
 * 「各行動の効用を採点し、最も Effekt の高いものを選ぶ」方式なので
 * 行動の追加が他の行動へ影響しません。
 *
 * 設計上の掟:
 *  - エンティティごとにオブジェクトを持たない (SoA)
 *  - 評価は 2 フェーズ (一括採点 + 1 パスで argmax)
 *  - スコアの書き込み先は呼び出し側のバッファ (new しない)
 */

export class UtilityAISystem {
  public bestScores: Float32Array;
  /**
   * 勝利した行動 ID。
   * Uint16Array を使うのは 256 種を超える行動 Defining に対応するためです
   * (Uint8Array では 256 で暗黙に折り返します)。
   */
  public bestActionIds: Uint16Array;
  public currentScores: Float32Array;
  /** 評価済みの行動のうち、1 エンティティあたりの最高スコア */
  public readonly maxEntities: number;

  /** 評価に絡む統計。デバッグやバランス調整に使います */
  public lastEvaluatedActionCount = 0;

  constructor(maxEntities: number) {
    if (maxEntities <= 0) throw new Error('maxEntities must be positive');
    this.maxEntities = maxEntities;
    this.bestScores = new Float32Array(maxEntities);
    this.bestActionIds = new Uint16Array(maxEntities);
    this.currentScores = new Float32Array(maxEntities);
  }

  /**
   * 評価を開始します。
   * 指定されたエンティティ数のスコアをリセットします。
   */
  public beginEvaluation(entityCount: number): void {
    const n = Math.min(entityCount, this.maxEntities);
    // 未評価は -Infinity にします。
    // -1.0 だと「スコア -1.0 の行動」が未評価と区別できず、
    // ペナルティを表す負スコア (Utility AI では普通) が
    // 決して選ばれないバグになります。
    this.bestScores.fill(-Infinity, 0, n);
    this.bestActionIds.fill(0, 0, n);
    this.lastEvaluatedActionCount = 0;
  }

  /**
   * 単一の行動のスコアを一括計算し、最高スコアを上回る場合のみ更新します。
   *
   * 2 フェーズ構成の理由:
   *  - Phase 1: カーネルが currentScores へ一括で書き込む
   *  - Phase 2: 1 本のループで argmax を更新する
   * This keeps one branch per entity, so the scan cost does not grow
   * 行動数が増えても走査回数は増えません。
   *
   * @param actionId 評価対象の行動 ID
   * @param entityCount 有効なエンティティ数
   * @param evaluator currentScores へスコアを書き込むカーネル関数
   */
  public evaluateAction(
    actionId: number,
    entityCount: number,
    evaluator: (outScores: Float32Array, count: number) => void,
  ): void {
    const n = Math.min(entityCount, this.maxEntities);
    // 対象が 0 体ならカーネルも走査も不要です
    if (n === 0) {
      this.lastEvaluatedActionCount++;
      return;
    }

    // Phase 1: スコアの一括計算
    evaluator(this.currentScores, n);

    // Phase 2: 最高スコアの更新 (分岐を単純に保って JIT を効かせる)
    const bestScores = this.bestScores;
    const bestActionIds = this.bestActionIds;
    const currentScores = this.currentScores;
    for (let i = 0; i < n; i++) {
      if (currentScores[i] > bestScores[i]) {
        bestScores[i] = currentScores[i];
        bestActionIds[i] = actionId;
      }
    }

    this.lastEvaluatedActionCount++;
  }

  /**
   * 行動 ID をそのまま返す糖衣関数。
   * 評価済みかどうかを確かめるための補助です。
   */
  public selectAction(entityIndex: number): number {
    return this.bestActionIds[entityIndex];
  }

  /**
   * 選択された行動のスコアを返します。
   * 未評価なら -Infinity を返します。
   */
  public scoreOf(entityIndex: number): number {
    return this.bestScores[entityIndex];
  }

  /**
   * 得点 2 つの大小比較を行います。
   *
   * Utility AI の効用は「値が大きいほど良い」ので、
   * ペナルティ (回避したい行動) は負値で表現します。
   *  ArdenUtility 関数として公開することで、
   * ペナルティ (回避したい行動) は負値で表現します。
   */
  public static utility(preference: number, penalty = 0): number {
    return preference - penalty;
  }
}
