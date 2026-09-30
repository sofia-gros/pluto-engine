import { describe, expect, test, vi } from 'vitest';
import { GameLoop } from '../src/core/GameLoop';

describe('GameLoop', () => {
  test('splits variable dt into fixed steps via the accumulator', () => {
    const fixed: number[] = [];
    const loop = new GameLoop(
      { fixedDeltaTime: 0.01, panicLimit: 100, targetFps: 0 },
      { onFixedUpdate: (dt) => fixed.push(dt) },
    );

    loop.step(0);
    // 100ms 経過 = 固定刻み 10ms なので 10 回分
    loop.step(100);
    expect(fixed.length).toBe(10);
    expect(fixed[0]).toBeCloseTo(0.01, 6);
  });

  test('clamps dt to maxDeltaTime to avoid a spiral of death', () => {
    const fixed: number[] = [];
    const loop = new GameLoop(
      { fixedDeltaTime: 1 / 60, panicLimit: 100, maxDeltaTime: 0.1 },
      { onFixedUpdate: (dt) => fixed.push(dt) },
    );

    loop.step(0);
    // タブ復帰直後の 10 秒ぶりのフレーム
    loop.step(10000);
    // 0.1 秒でクランプされるため 1/60 秒刻みでは高々 6 回
    expect(fixed.length).toBeLessThanOrEqual(6);
  });

  test('panicLimit bounds the number of fixed steps per frame', () => {
    let count = 0;
    const loop = new GameLoop(
      { fixedDeltaTime: 0.001, panicLimit: 3, maxDeltaTime: 10 },
      { onFixedUpdate: () => count++ },
    );

    loop.step(0);
    loop.step(100);
    expect(count).toBe(3);
  });

  test('targetFps skips frames that arrive too early', () => {
    const onUpdate = vi.fn();
    const onRender = vi.fn();
    const onSkip = vi.fn();
    const loop = new GameLoop(
      { targetFps: 60, fixedDeltaTime: 1 / 60 },
      { onUpdate, onRender, onSkip },
    );

    loop.step(0);
    expect(onRender).toHaveBeenCalledTimes(1);

    // 5ms だけ経過 (60FPS のフレーム間隔 16.6ms に満たない)
    loop.step(5);
    expect(onRender).toHaveBeenCalledTimes(1);
    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(loop.skippedFrameCount).toBe(1);

    // 20ms 経過すれば描画される
    loop.step(20);
    expect(onRender).toHaveBeenCalledTimes(2);
  });

  test('measures effective FPS over a one second window', () => {
    const loop = new GameLoop({ targetFps: 0, fixedDeltaTime: 1 / 60 }, {});
    let now = 0;
    loop.step(now);
    // 16ms 刻みで 62 フレーム進める
    for (let i = 1; i <= 62; i++) {
      now += 16.6;
      loop.step(now);
    }
    expect(loop.measuredFps).toBeGreaterThan(50);
  });

  test('update and render receive the same frame', () => {
    const order: string[] = [];
    const loop = new GameLoop({ targetFps: 0, fixedDeltaTime: 1 / 60 }, {
      onFixedUpdate: () => order.push('fixed'),
      onUpdate: () => order.push('update'),
      onRender: () => order.push('render'),
    });

    // 初回は dt = 0 なので固定ステップは発火しない
    loop.step(0);
    expect(order).toEqual(['update', 'render']);

    // 20ms 経過 = 固定刻み 16.6ms を 1 回消費する
    loop.step(20);
    expect(order).toEqual(['update', 'render', 'fixed', 'update', 'render']);
  });

  test('start and stop toggle the running state', () => {
    const loop = new GameLoop({}, {});
    expect(loop.running).toBe(false);
    loop.start(0);
    expect(loop.running).toBe(true);
    loop.stop();
    expect(loop.running).toBe(false);
  });
});
