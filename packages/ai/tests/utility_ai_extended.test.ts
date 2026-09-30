import { describe, expect, test } from 'vitest';
import { UtilityAISystem } from '../src/UtilityAISystem';

describe('UtilityAISystem: argmax selection', () => {
  test('picks the highest scoring action', () => {
    const ai = new UtilityAISystem(8);
    ai.beginEvaluation(4);

    // 行動 2 のスコアが個体ごとに違うようにします
    ai.evaluateAction(1, 4, (s) => s.fill(0.5));
    ai.evaluateAction(2, 4, (s) => {
      s[0] = 0.9;
      s[1] = 0.1;
      s[2] = 0.6;
      s[3] = 0.0;
    });
    ai.evaluateAction(3, 4, (s) => s.fill(0.2));

    // 0.9 > 0.5 > 0.2
    expect(ai.selectAction(0)).toBe(2);
    // 0.1 < 0.5 < 0.2 のため行動 1 が勝つ
    expect(ai.selectAction(1)).toBe(1);
    // 0.6 > 0.5 > 0.2
    expect(ai.selectAction(2)).toBe(2);
    // 0.0 < 0.2 < 0.5
    expect(ai.selectAction(3)).toBe(1);
  });

  test('a later action must beat the best to win', () => {
    const ai = new UtilityAISystem(4);
    ai.beginEvaluation(1);
    ai.evaluateAction(10, 1, (s) => {
      s[0] = 0.8;
    });
    ai.evaluateAction(11, 1, (s) => {
      s[0] = 0.5;
    });
    expect(ai.selectAction(0)).toBe(10);
    expect(ai.scoreOf(0)).toBeCloseTo(0.8, 5);
  });

  test('negative scores are valid utility (penalties)', () => {
    const ai = new UtilityAISystem(4);
    ai.beginEvaluation(1);
    ai.evaluateAction(1, 1, (s) => {
      s[0] = -5.0;
    });
    ai.evaluateAction(2, 1, (s) => {
      s[0] = -1.0;
    });
    // -1 > -5 なので行動 2 が選ばれる
    expect(ai.selectAction(0)).toBe(2);
  });

  test('entities are scored independently', () => {
    const ai = new UtilityAISystem(8);
    ai.beginEvaluation(3);
    ai.evaluateAction(1, 3, (s) => s.fill(0.1));
    ai.evaluateAction(2, 3, (s) => {
      s[0] = 0.0;
      s[1] = 0.9;
      s[2] = 0.2;
    });
    expect(ai.selectAction(0)).toBe(1);
    expect(ai.selectAction(1)).toBe(2);
    expect(ai.selectAction(2)).toBe(2);
  });

  test('beginEvaluation resets the previous frame', () => {
    const ai = new UtilityAISystem(4);
    ai.beginEvaluation(1);
    ai.evaluateAction(5, 1, (s) => {
      s[0] = 1.0;
    });
    expect(ai.selectAction(0)).toBe(5);

    // 次のフレームでは 0.2 の行動 6 だけが評価される
    ai.beginEvaluation(1);
    ai.evaluateAction(6, 1, (s) => {
      s[0] = 0.2;
    });
    expect(ai.selectAction(0)).toBe(6);
  });

  test('the first action always wins even with a negative score', () => {
    const ai = new UtilityAISystem(4);
    ai.beginEvaluation(1);
    // 未評価は -Infinity なので、負のスコアの行動も選ばれます
    ai.evaluateAction(7, 1, (s) => {
      s[0] = -3.0;
    });
    expect(ai.selectAction(0)).toBe(7);
    expect(ai.scoreOf(0)).toBeCloseTo(-3.0, 5);
  });
});

describe('UtilityAISystem: action id range', () => {
  test('supports more than 256 distinct actions', () => {
    const ai = new UtilityAISystem(4);
    ai.beginEvaluation(1);
    // 300 番の行動でも折り返さない
    ai.evaluateAction(300, 1, (s) => {
      s[0] = 0.5;
    });
    expect(ai.selectAction(0)).toBe(300);

    ai.evaluateAction(1000, 1, (s) => {
      s[0] = 0.9;
    });
    expect(ai.selectAction(0)).toBe(1000);
  });

  test('the storage is 16-bit wide', () => {
    const ai = new UtilityAISystem(4);
    expect(ai.bestActionIds).toBeInstanceOf(Uint16Array);
  });
});

describe('UtilityAISystem: capacity handling', () => {
  test('clamps the entity count to the capacity', () => {
    const ai = new UtilityAISystem(4);
    // 4 体しかないのに 8 体ぶん評価しても範囲外へ出ない
    expect(() => {
      ai.beginEvaluation(8);
      ai.evaluateAction(1, 8, (s) => s.fill(1.0));
    }).not.toThrow();
    expect(ai.selectAction(3)).toBe(1);
  });

  test('rejects a non-positive capacity', () => {
    expect(() => new UtilityAISystem(0)).toThrow();
    expect(() => new UtilityAISystem(-1)).toThrow();
  });

  test('counting a zero entity evaluation is safe', () => {
    const ai = new UtilityAISystem(4);
    ai.beginEvaluation(0);
    ai.evaluateAction(1, 0, () => {
      throw new Error('the kernel should not be called for zero entities');
    });
    expect(ai.lastEvaluatedActionCount).toBe(1);
  });

  test('the score buffer is reused (no per-call allocation)', () => {
    const ai = new UtilityAISystem(4);
    ai.beginEvaluation(1);
    let captured: Float32Array | null = null;
    ai.evaluateAction(1, 1, (s) => {
      captured = s;
    });
    ai.evaluateAction(2, 1, (s) => {
      // 2 回目の評価でも同じバッファが渡される
      expect(s).toBe(captured);
    });
    expect(captured).toBe(ai.currentScores);
  });

  test('the evaluated action count is tracked', () => {
    const ai = new UtilityAISystem(4);
    ai.beginEvaluation(1);
    ai.evaluateAction(1, 1, (s) => s.fill(0.1));
    ai.evaluateAction(2, 1, (s) => s.fill(0.2));
    ai.evaluateAction(3, 1, (s) => s.fill(0.3));
    expect(ai.lastEvaluatedActionCount).toBe(3);
  });
});

describe('UtilityAISystem: utility helper', () => {
  test('subtracts a penalty from a preference', () => {
    expect(UtilityAISystem.utility(1.0)).toBe(1.0);
    expect(UtilityAISystem.utility(1.0, 0.3)).toBeCloseTo(0.7, 5);
    // ペナルティが好みを上回ると負値になる
    expect(UtilityAISystem.utility(0.2, 1.0)).toBeCloseTo(-0.8, 5);
  });
});
