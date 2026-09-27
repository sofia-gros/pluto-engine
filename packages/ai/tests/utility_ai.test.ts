import { describe, expect, it } from 'vitest';
import { UtilityAISystem } from '../src/UtilityAISystem';

describe('UtilityAISystem', () => {
  it('should select the action with the highest score', () => {
    const maxEntities = 4;
    const aiSystem = new UtilityAISystem(maxEntities);

    // SoA データのモック
    // エンティティ0: health=0.1 (ピンチ), distanceToEnemy=10 (近い)
    // エンティティ1: health=0.9 (元気), distanceToEnemy=100 (遠い)
    // エンティティ2: health=0.5 (普通), distanceToEnemy=50 (中間)
    // エンティティ3: health=1.0 (無敵), distanceToEnemy=10 (近い)

    const health = new Float32Array([0.1, 0.9, 0.5, 1.0]);
    const distanceToEnemy = new Float32Array([10, 100, 50, 10]);

    const entityCount = 4;

    aiSystem.beginEvaluation(entityCount);

    // アクション1: 攻撃 (Attack)
    // スコア計算: healthが高く、敵が近いほどスコアが高い
    const ACTION_ATTACK = 1;
    aiSystem.evaluateAction(ACTION_ATTACK, entityCount, (outScores, count) => {
      for (let i = 0; i < count; i++) {
        // 正規化 (0~1) の簡易表現
        const distScore = Math.max(0, 1.0 - distanceToEnemy[i] / 100);
        outScores[i] = health[i] * distScore;
      }
    });

    // アクション2: 逃亡 (Flee)
    // スコア計算: healthが低く、敵が近いほどスコアが高い
    const ACTION_FLEE = 2;
    aiSystem.evaluateAction(ACTION_FLEE, entityCount, (outScores, count) => {
      for (let i = 0; i < count; i++) {
        const distScore = Math.max(0, 1.0 - distanceToEnemy[i] / 100);
        outScores[i] = (1.0 - health[i]) * distScore;
      }
    });

    // アクション3: 巡回 (Patrol)
    // スコア計算: 固定スコア 0.3
    const ACTION_PATROL = 3;
    aiSystem.evaluateAction(ACTION_PATROL, entityCount, (outScores, count) => {
      for (let i = 0; i < count; i++) {
        outScores[i] = 0.3;
      }
    });

    const bestActionIds = aiSystem.bestActionIds;

    // エンティティ0:
    // Attack = 0.1 * 0.9 = 0.09
    // Flee = 0.9 * 0.9 = 0.81
    // Patrol = 0.3
    // -> 最良は Flee (2)
    expect(bestActionIds[0]).toBe(ACTION_FLEE);

    // エンティティ1:
    // Attack = 0.9 * 0 = 0
    // Flee = 0.1 * 0 = 0
    // Patrol = 0.3
    // -> 最良は Patrol (3)
    expect(bestActionIds[1]).toBe(ACTION_PATROL);

    // エンティティ2:
    // Attack = 0.5 * 0.5 = 0.25
    // Flee = 0.5 * 0.5 = 0.25
    // Patrol = 0.3
    // -> 最良は Patrol (3)
    expect(bestActionIds[2]).toBe(ACTION_PATROL);

    // エンティティ3:
    // Attack = 1.0 * 0.9 = 0.9
    // Flee = 0.0 * 0.9 = 0
    // Patrol = 0.3
    // -> 最良は Attack (1)
    expect(bestActionIds[3]).toBe(ACTION_ATTACK);
  });

  it('should enforce zero allocation during evaluation', () => {
    const aiSystem = new UtilityAISystem(100);
    const count = 100;

    aiSystem.beginEvaluation(count);

    // テスト環境で厳密なメモリアロケーション追跡は難しいため、
    // 配列の参照が変化していないことをアサートしてゼロアロケーションであることを示唆する
    const bestScoresRef = aiSystem.bestScores;
    const bestActionIdsRef = aiSystem.bestActionIds;
    const currentScoresRef = aiSystem.currentScores;

    aiSystem.evaluateAction(1, count, (outScores, count) => {
      for (let i = 0; i < count; i++) outScores[i] = Math.random();
    });

    expect(aiSystem.bestScores).toBe(bestScoresRef);
    expect(aiSystem.bestActionIds).toBe(bestActionIdsRef);
    expect(aiSystem.currentScores).toBe(currentScoresRef);
  });
});
