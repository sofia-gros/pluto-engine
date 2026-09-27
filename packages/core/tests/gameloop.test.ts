import { describe, expect, test, vi } from 'vitest';
import { GameLoop } from '../src/loop/GameLoop';

describe('GameLoop', () => {
  test('Should invoke update and fixedUpdate correctly', () => {
    // 仮想の requestAnimationFrame を用意
    let rafCallback: FrameRequestCallback | null = null;
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      rafCallback = cb;
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {
      rafCallback = null;
    });
    // performance.now のモック
    let currentTime = 1000;
    vi.stubGlobal('performance', {
      now: () => currentTime,
    });

    const loop = new GameLoop({ fixedDeltaTime: 0.1 });

    let updateCalls = 0;
    let fixedUpdateCalls = 0;
    let renderCalls = 0;

    loop.onUpdate = () => {
      updateCalls++;
    };
    loop.onFixedUpdate = () => {
      fixedUpdateCalls++;
    };
    loop.onRender = () => {
      renderCalls++;
    };

    loop.start();
    expect(loop.isRunning).toBe(true);
    expect(rafCallback).not.toBeNull();

    // 1フレーム目: 50ms (0.05s) 経過
    // fixedDeltaTime (0.1s) に満たないため、fixedUpdate は呼ばれない
    currentTime += 50;
    if (rafCallback) rafCallback(currentTime);

    expect(updateCalls).toBe(1);
    expect(fixedUpdateCalls).toBe(0);
    expect(renderCalls).toBe(1);

    // 2フレーム目: さらに 60ms (0.06s) 経過。合計 0.11s 蓄積
    // fixedDeltaTime を超えるため、fixedUpdate が 1回 呼ばれる
    currentTime += 60;
    if (rafCallback) rafCallback(currentTime);

    expect(updateCalls).toBe(2);
    expect(fixedUpdateCalls).toBe(1);
    expect(renderCalls).toBe(2);

    loop.stop();
    expect(loop.isRunning).toBe(false);

    vi.unstubAllGlobals();
  });
});
