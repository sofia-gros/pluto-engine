import { describe, expect, test, vi, afterEach } from 'vitest';
import { InputManager } from '../src/input/InputManager';

interface FakePad {
  buttons: { pressed: boolean }[];
  axes: number[];
}

function makeGamepad(buttons: boolean[], axes: number[] = [0, 0, 0, 0]): FakePad {
  return { buttons: buttons.map((p) => ({ pressed: p })), axes };
}

function stubGamepads(get: () => (FakePad | null)[]) {
  const original = navigator.getGamepads;
  Object.defineProperty(navigator, 'getGamepads', {
    value: get,
    configurable: true,
    writable: true,
  });
  return () => {
    Object.defineProperty(navigator, 'getGamepads', {
      value: original,
      configurable: true,
      writable: true,
    });
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('InputManager: pointer transform', () => {
  test('pointer coordinates are mapped through the transform function', () => {
    const input = new InputManager();
    const listeners: Record<string, (e: any) => void> = {};
    const target: any = {
      addEventListener: (type: string, l: any) => {
        listeners[type] = l;
      },
      removeEventListener: (type: string) => {
        delete listeners[type];
      },
    };
    input.attach(target);

    // 画面座標 (100, 50) をゲーム座標 (10, 5) に変換する
    input.pointerTransform = (cx, cy, out) => {
      out[0] = (cx - 90) * 0.1;
      out[1] = (cy - 45) * 0.1;
    };

    listeners['pointermove']({ clientX: 100, clientY: 50 });
    input.update();

    expect(input.clientX).toBe(100);
    expect(input.clientY).toBe(50);
    expect(input.pointerX).toBeCloseTo(1, 5);
    expect(input.pointerY).toBeCloseTo(0.5, 5);
  });

  test('falls back to screen coordinates when no transform is set', () => {
    const input = new InputManager();
    const listeners: Record<string, (e: any) => void> = {};
    const target: any = {
      addEventListener: (type: string, l: any) => {
        listeners[type] = l;
      },
      removeEventListener: (type: string) => {
        delete listeners[type];
      },
    };
    input.attach(target);
    listeners['pointermove']({ clientX: 33, clientY: 44 });
    input.update();
    expect(input.pointerX).toBe(33);
    expect(input.pointerY).toBe(44);
  });

  test('attach is idempotent so listeners do not pile up', () => {
    const input = new InputManager();
    let keydownCount = 0;
    const target: any = {
      addEventListener: (type: string, l: any) => {
        if (type === 'keydown') keydownCount++;
      },
      removeEventListener: () => {},
    };
    input.attach(target);
    input.attach(target);
    expect(keydownCount).toBe(2);
    // 1 フレーム目: 何も押されていない
    expect(input.attached).toBe(true);
    input.detach();
    expect(input.attached).toBe(false);
  });
});

describe('InputManager: gamepad edge detection', () => {
  test('detects just pressed and just released', () => {
    let pad = makeGamepad([false, false]);
    const restore = stubGamepads(() => [pad]);

    const input = new InputManager();
    input.update();

    // フレーム 1: 何も押されていない
    expect(input.isGamepadButtonPressed(0, 0)).toBe(false);
    expect(input.isGamepadButtonJustPressed(0, 0)).toBe(false);

    // フレーム 2: ボタン 0 を押す
    pad = makeGamepad([true, false]);
    input.update();
    expect(input.isGamepadButtonPressed(0, 0)).toBe(true);
    expect(input.isGamepadButtonJustPressed(0, 0)).toBe(true);
    expect(input.isGamepadButtonJustReleased(0, 0)).toBe(false);

    // フレーム 3: 押しっぱなし
    input.update();
    expect(input.isGamepadButtonJustPressed(0, 0)).toBe(false);
    expect(input.isGamepadButtonPressed(0, 0)).toBe(true);

    // フレーム 4: 離す
    pad = makeGamepad([false, false]);
    input.update();
    expect(input.isGamepadButtonPressed(0, 0)).toBe(false);
    expect(input.isGamepadButtonJustReleased(0, 0)).toBe(true);

    restore();
  });

  test('axis values apply a dead zone', () => {
    const pad = makeGamepad([], [0.05, 0.9, -0.5, 0]);
    const restore = stubGamepads(() => [pad]);
    const input = new InputManager();
    input.update();
    expect(input.getGamepadAxis(0, 0)).toBe(0);
    expect(input.getGamepadAxis(0, 1)).toBeCloseTo(0.9, 5);
    expect(input.getGamepadAxis(0, 2)).toBeCloseTo(-0.5, 5);
    expect(input.getGamepadAxis(9, 0)).toBe(0);
    restore();
  });

  test('counts connected gamepads', () => {
    const restore = stubGamepads(() => [makeGamepad([]), null, makeGamepad([])]);
    const input = new InputManager();
    input.update();
    expect(input.getGamepadCount()).toBe(2);
    restore();
  });
});
