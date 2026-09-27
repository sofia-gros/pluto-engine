import { describe, expect, test } from 'vitest';
import { InputManager } from '../src/input/InputManager';

describe('InputManager', () => {
  test('Should latch key states correctly over frames', () => {
    const input = new InputManager();

    // イベントエミッターのモックとして使う用の簡単なダミーターゲット
    const listeners: Record<string, EventListener> = {};
    const dummyTarget: any = {
      addEventListener: (type: string, listener: EventListener) => {
        listeners[type] = listener;
      },
      removeEventListener: (type: string) => {
        delete listeners[type];
      },
    };

    input.attach(dummyTarget);

    // キー押下イベントを発火（非同期）
    listeners['keydown']({ code: 'Space' } as any);

    // update() 前は false
    expect(input.isKeyPressed('Space')).toBe(false);

    // --- 1フレーム目 ---
    input.update();
    expect(input.isKeyPressed('Space')).toBe(true);
    expect(input.isKeyJustPressed('Space')).toBe(true); // 初めて押された

    // --- 2フレーム目 ---
    input.update();
    expect(input.isKeyPressed('Space')).toBe(true);
    expect(input.isKeyJustPressed('Space')).toBe(false); // 押しっぱなしなので false

    // キーを離す（非同期）
    listeners['keyup']({ code: 'Space' } as any);

    // update() 前はまだ押されていると判定される
    expect(input.isKeyPressed('Space')).toBe(true);

    // --- 3フレーム目 ---
    input.update();
    expect(input.isKeyPressed('Space')).toBe(false);
    expect(input.isKeyJustReleased('Space')).toBe(true); // 今回離された

    // --- 4フレーム目 ---
    input.update();
    expect(input.isKeyJustReleased('Space')).toBe(false);
  });
});
