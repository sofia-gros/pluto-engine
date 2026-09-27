export class UtilityAISystem {
  public bestScores: Float32Array;
  public bestActionIds: Uint8Array;
  public currentScores: Float32Array;

  constructor(public maxEntities: number) {
    this.bestScores = new Float32Array(maxEntities);
    this.bestActionIds = new Uint8Array(maxEntities);
    this.currentScores = new Float32Array(maxEntities);
  }

  /**
   * 評価プロセスを開始します。
   * 指定されたエンティティ数のスコアをリセットします。
   */
  public beginEvaluation(entityCount: number): void {
    // スコアは通常 0.0 ~ 1.0。未評価状態を示すため -1.0 で初期化
    this.bestScores.fill(-1.0, 0, entityCount);
    // デフォルトのアクションIDは 0 とする
    this.bestActionIds.fill(0, 0, entityCount);
  }

  /**
   * 単一のアクションのスコアを一括計算し、これまでの最高スコアを上回る場合は更新します。
   *
   * @param actionId 評価対象のアクションID
   * @param entityCount 有効なエンティティ数
   * @param evaluator エンティティ状態の配列（SoA）からスコアを算出し、outScoresに書き込むカーネル関数
   */
  public evaluateAction(
    actionId: number,
    entityCount: number,
    evaluator: (outScores: Float32Array, count: number) => void,
  ): void {
    // 1. 各エンティティに対するこのアクションの効用スコアを一括で計算する（ゼロアロケーション）
    evaluator(this.currentScores, entityCount);

    // 2. 計算されたスコアと現在の最高スコアを比較・更新する
    const bestScores = this.bestScores;
    const bestActionIds = this.bestActionIds;
    const currentScores = this.currentScores;

    for (let i = 0; i < entityCount; i++) {
      const score = currentScores[i];
      // 条件分岐をシンプルにしてJIT最適化を促す
      if (score > bestScores[i]) {
        bestScores[i] = score;
        bestActionIds[i] = actionId;
      }
    }
  }
}
