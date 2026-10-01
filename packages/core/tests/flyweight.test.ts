import { describe, expect, it } from 'vitest';
import { EventEmitter, TimeFacade, TimeStepManager, TimerEvent } from '../src/index';
import { InputManager } from '../src/input/InputManager';
import { Gamepad } from '../src/input/InputManager';

/**
 * Flyweight の own property 数を検証します (掟 R-03)。
 * ステートは参照先 ([0] の要素) にあり、ハンドル自身は持たないことが条件です。
 */
function ownPropertyCount(obj: object): number {
  return Object.getOwnPropertyNames(obj).length;
}

describe('TimerEvent Flyweight (R-03)', () => {
  it('own property は id と _manager の 2 個だけ', () => {
    const mgr = new TimeStepManager(16);
    const ev = new TimerEvent(0, mgr);
    const names = Object.getOwnPropertyNames(ev);
    expect(names.sort()).toEqual(['_manager', 'id']);
    expect(ownPropertyCount(ev)).toBe(2);
  });

  it('getter 経由では状態を複製しない（SoA を参照するだけ）', () => {
    const mgr = new TimeStepManager(16);
    const id = mgr.delayedCall(1000, () => {});
    const ev = new TimerEvent(id, mgr);
    // SoA 側を書き換えるとハンドル経由でも見える
    mgr.seekTimer(id, 500);
    expect(ev.elapsed).toBe(500);
    expect(ev.progress).toBeCloseTo(0.5);
  });

  it('pause / resume / reset / seek が SoA に反映される', () => {
    const mgr = new TimeStepManager(16);
    const id = mgr.delayedCall(1000, () => {});
    const ev = new TimerEvent(id, mgr);

    ev.seek(300);
    expect(ev.elapsed).toBe(300);

    ev.pause();
    expect(ev.isPaused).toBe(true);
    mgr.update(100);
    // 一時停止中は時間が進まない
    expect(ev.elapsed).toBe(300);

    ev.resume();
    expect(ev.isPaused).toBe(false);
    mgr.update(100);
    expect(ev.elapsed).toBe(400);

    ev.reset();
    expect(ev.elapsed).toBe(0);
    expect(ev.progress).toBe(0);
  });

  it('remove / destroy でハンドルが無効化される', () => {
    const mgr = new TimeStepManager(16);
    const id = mgr.delayedCall(1000, () => {});
    const ev = new TimerEvent(id, mgr);
    expect(ev.isValid).toBe(true);

    ev.remove();
    expect(ev.isValid).toBe(false);
    expect(ev.id).toBe(-1);
    expect(mgr.activeTimerCount).toBe(0);

    // 二重解放しても安全
    expect(() => {
      ev.remove();
    }).not.toThrow();
  });

  it('destroy は remove と同じ挙動', () => {
    const mgr = new TimeStepManager(16);
    const id = mgr.delayedCall(1000, () => {});
    const ev = new TimerEvent(id, mgr);
    ev.destroy();
    expect(ev.isValid).toBe(false);
    expect(mgr.activeTimerCount).toBe(0);
  });
});

describe('TimeStepManager', () => {
  it('delayedCall は 1 回だけ発火する', () => {
    const mgr = new TimeStepManager(16);
    let count = 0;
    mgr.delayedCall(100, () => {
      count++;
    });
    mgr.update(50);
    expect(count).toBe(0);
    mgr.update(60);
    expect(count).toBe(1);
    mgr.update(1000);
    expect(count).toBe(1);
    expect(mgr.activeTimerCount).toBe(0);
  });

  it('loop は delay 間隔で繰り返し発火する', () => {
    const mgr = new TimeStepManager(16);
    let count = 0;
    mgr.addEvent({
      delay: 100,
      callback: () => {
        count++;
      },
      loop: true,
    });
    mgr.update(100);
    mgr.update(100);
    mgr.update(100);
    expect(count).toBe(3);
  });

  it('repeatDelay は初回と異なる間隔で繰り返す', () => {
    const mgr = new TimeStepManager(16);
    let count = 0;
    // 初回 100ms、以後は 300ms ごと
    const id = mgr.addEvent({
      delay: 100,
      callback: () => {
        count++;
      },
      loop: true,
      repeatDelay: 300,
    });
    expect(mgr.getTimerRepeatDelay(id)).toBe(300);

    // t=100 で初回発火
    mgr.update(100);
    expect(count).toBe(1);
    // 以降は 300ms 間隔なので t=200 / t=300 では発火しない
    mgr.update(100);
    expect(count).toBe(1);
    mgr.update(100);
    expect(count).toBe(1);
    // t=400 で 2 回目
    mgr.update(100);
    expect(count).toBe(2);
  });

  it('reset は閾値を delay に戻す', () => {
    const mgr = new TimeStepManager(16);
    let count = 0;
    const id = mgr.addEvent({
      delay: 100,
      callback: () => {
        count++;
      },
      loop: true,
      repeatDelay: 1000,
    });
    mgr.update(100);
    expect(count).toBe(1);
    mgr.resetTimer(id);
    // reset 後はdelay 100ms で再度発火する
    mgr.update(100);
    expect(count).toBe(2);
  });

  it('repeatDelay 未指定時は delay がそのまま繰り返し間隔になる', () => {
    const mgr = new TimeStepManager(16);
    const id = mgr.addEvent({ delay: 250, callback: () => {}, loop: true });
    expect(mgr.getTimerRepeatDelay(id)).toBe(250);
  });

  it('コールバックに引数を渡せる', () => {
    const mgr = new TimeStepManager(16);
    let got = -1;
    mgr.delayedCall(
      10,
      (a: number) => {
        got = a;
      },
      [42],
    );
    mgr.update(20);
    expect(got).toBe(42);
  });

  it('timeScale がタイマーの進行速度を変える', () => {
    const mgr = new TimeStepManager(16);
    let count = 0;
    mgr.addEvent({
      delay: 100,
      callback: () => {
        count++;
      },
      loop: true,
    });

    mgr.timeScale = 2;
    mgr.update(50); // 実質 100ms 経過
    expect(count).toBe(1);

    mgr.timeScale = 0;
    mgr.update(10000); // 時間が進まない
    expect(count).toBe(1);
  });

  it('seek は発火せずに経過時間だけを変更する', () => {
    const mgr = new TimeStepManager(16);
    let count = 0;
    const id = mgr.delayedCall(100, () => {
      count++;
    });
    mgr.seekTimer(id, 100);
    // 発火は次の update まで起こらない
    expect(count).toBe(0);
    mgr.update(0);
    expect(count).toBe(1);
  });

  it('seek は範囲内にクランプされる', () => {
    const mgr = new TimeStepManager(16);
    const id = mgr.delayedCall(100, () => {});
    mgr.seekTimer(id, -50);
    expect(mgr.getTimerElapsed(id)).toBe(0);
    mgr.seekTimer(id, 9999);
    expect(mgr.getTimerElapsed(id)).toBe(100);
  });

  it('clearTimers は全タイマーを解放しハンドルを再利用する', () => {
    const mgr = new TimeStepManager(4);
    mgr.addEvent({ delay: 100, callback: () => {} });
    mgr.addEvent({ delay: 100, callback: () => {} });
    expect(mgr.activeTimerCount).toBe(2);
    mgr.clearTimers();
    expect(mgr.activeTimerCount).toBe(0);
    // 解放済みスロットが再利用される
    const id = mgr.delayedCall(100, () => {});
    expect(id).toBeGreaterThanOrEqual(0);
    expect(id).toBeLessThan(4);
  });
});

describe('TimeFacade (Phaser 互換の scene.time)', () => {
  it('delayedCall は Flyweight ハンドルを返す', () => {
    const mgr = new TimeStepManager(16);
    const facade = new TimeFacade(mgr);
    const ev = facade.delayedCall(100, () => {});
    expect(ev).toBeInstanceOf(TimerEvent);
    expect(ev.delay).toBe(100);
  });

  it('同じ id なら毎回同じハンドルを返す', () => {
    const mgr = new TimeStepManager(16);
    const facade = new TimeFacade(mgr);
    const a = facade.delayedCall(100, () => {});
    const id = a.id;
    const b = facade.addEvent({ delay: 100, callback: () => {} });
    // 別 id なので別ハンドル
    expect(b).not.toBe(a);
    // 同じ delay でも別タイマーなので別 id
    expect(b.id).not.toBe(id);
  });

  it('now / delta / fps を TimeStepManager から委譲する', () => {
    const mgr = new TimeStepManager(16);
    const facade = new TimeFacade(mgr);
    mgr.step(0);
    // dt は 0.1 秒でクランプされるため、それ以下の差で検証します
    mgr.step(50);
    expect(facade.delta).toBeCloseTo(0.05);
    expect(facade.now).toBeCloseTo(0.05);
  });

  it('timeScale は負を 0 にクランプする', () => {
    const mgr = new TimeStepManager(16);
    const facade = new TimeFacade(mgr);
    facade.timeScale = -1;
    expect(facade.timeScale).toBe(0);
  });

  it('smoothStep は 0〜1 にクランプして滑らかにする', () => {
    const mgr = new TimeStepManager(16);
    const facade = new TimeFacade(mgr);
    expect(facade.smoothStep(0)).toBe(0);
    expect(facade.smoothStep(1)).toBe(1);
    expect(facade.smoothStep(0.5)).toBeCloseTo(0.5);
    // クランプ
    expect(facade.smoothStep(-1)).toBe(0);
    expect(facade.smoothStep(2)).toBe(1);
  });

  it('clear は全ハンドルを破棄する', () => {
    const mgr = new TimeStepManager(16);
    const facade = new TimeFacade(mgr);
    const ev = facade.delayedCall(100, () => {});
    facade.clear();
    expect(ev.isValid).toBe(false);
    expect(facade.activeTimerCount).toBe(0);
  });
});

describe('Pointer 拡張 (Phaser 互換)', () => {
  it('own property は _input と id の 2 個だけ', () => {
    const input = new InputManager();
    const p = input.pointer;
    const names = Object.getOwnPropertyNames(p);
    expect(names.sort()).toEqual(['_input', 'id']);
    expect(ownPropertyCount(p)).toBe(2);
  });

  it('worldX / worldY はゲーム座標を返す（旧 worldX は画面座標だった）', () => {
    const input = new InputManager();
    const p = input.pointer;
    expect(p.worldX).toBe(p.x);
    expect(p.worldY).toBe(p.y);
  });

  it('screenX / screenY は変換前の画面座標を返す', () => {
    const input = new InputManager();
    const p = input.pointer;
    expect(p.screenX).toBe(input.clientX);
    expect(p.screenY).toBe(input.clientY);
  });

  it('movementX / movementY / dx / dy は前フレームとの差分', () => {
    const input = new InputManager();
    const p = input.pointer;
    input.prevPointerX = 0;
    input.prevPointerY = 0;
    input.pointerX = 10;
    input.pointerY = 20;
    expect(p.movementX).toBe(10);
    expect(p.movementY).toBe(20);
    expect(p.dx).toBe(10);
    expect(p.dy).toBe(20);
  });

  it('velocity は dt で割った移動速度', () => {
    const input = new InputManager();
    const p = input.pointer;
    input.prevPointerX = 0;
    input.pointerX = 100;
    input.pointerVelocityX = 50;
    expect(p.velocityX).toBe(50);
  });

  it('angle / distance / downX / upX を持つ', () => {
    const input = new InputManager();
    const p = input.pointer;
    input.pointerAngle = 1.5;
    input.pointerDistance = 42;
    input.downPointerX = 3;
    input.downPointerY = 4;
    input.upPointerX = 5;
    input.upPointerY = 6;
    expect(p.angle).toBe(1.5);
    expect(p.distance).toBe(42);
    expect(p.downX).toBe(3);
    expect(p.downY).toBe(4);
    expect(p.upX).toBe(5);
    expect(p.upY).toBe(6);
    expect(p.pointerId).toBe(0);
  });
});

describe('Gamepad Flyweight (R-03)', () => {
  it('own property は index と _input の 2 個だけ', () => {
    const input = new InputManager();
    const pad = input.getGamepad(0);
    expect(pad).toBeInstanceOf(Gamepad);
    const names = Object.getOwnPropertyNames(pad as object);
    expect(names.sort()).toEqual(['_input', 'index']);
    expect(ownPropertyCount(pad as object)).toBe(2);
  });

  it('同じインデックスなら同じハンドルを返す（毎フレーム new しない）', () => {
    const input = new InputManager();
    const a = input.getGamepad(0);
    const b = input.getGamepad(0);
    expect(a).toBe(b);
  });

  it('未接続なら connected が false', () => {
    const input = new InputManager();
    input.update(0);
    const pad = input.getGamepad(0);
    expect(pad?.connected).toBe(false);
    expect(pad?.id).toBe('');
    expect(pad?.buttons).toBe(0);
    expect(pad?.axes).toBe(0);
  });

  it('未接続ならボタンと軸は 0 / false を返す', () => {
    const input = new InputManager();
    input.update(0);
    const pad = input.getGamepad(0);
    expect(pad?.isDown(0)).toBe(false);
    expect(pad?.isJustDown(0)).toBe(false);
    expect(pad?.isJustUp(0)).toBe(false);
    expect(pad?.getAxis(0)).toBe(0);
  });

  it('isGamepadSupported を公開する', () => {
    const input = new InputManager();
    // テスト環境は navigator が navigator-like を持つ
    expect(typeof input.isGamepadSupported).toBe('boolean');
  });

  it('getAllGamepads は内部バッファを使い回す', () => {
    const input = new InputManager();
    input.update(0);
    const a = input.getAllGamepads();
    const b = input.getAllGamepads();
    // 同一バッファを返す（内部バッファのため）
    expect(a).toBe(b);
  });

  it('toString はデバッグ用文字列を返す', () => {
    const input = new InputManager();
    const pad = input.getGamepad(2);
    expect(String(pad)).toBe('Gamepad(2)');
  });
});

describe('EventEmitter の非アロケーション版 emit', () => {
  it('emit0 / emit1 / emit2 / emit3 が正しく届く', () => {
    const em = new EventEmitter();
    const seen: string[] = [];
    em.on('e', (a, b, c) => {
      seen.push(`${a}/${b}/${c}`);
    });
    em.emit0('e');
    em.emit1('e', 1);
    em.emit2('e', 1, 2);
    em.emit3('e', 1, 2, 3);
    expect(seen).toEqual([
      'undefined/undefined/undefined',
      '1/undefined/undefined',
      '1/2/undefined',
      '1/2/3',
    ]);
  });

  it('emit0 でも on / off の意味論が同じ（emit 中の off は効く）', () => {
    const em = new EventEmitter();
    let a = 0;
    let b = 0;
    const fa = () => {
      a++;
      em.off('e', fb);
    };
    const fb = () => {
      b++;
    };
    em.on('e', fa);
    em.on('e', fb);
    em.emit0('e');
    expect(a).toBe(1);
    expect(b).toBe(0);
  });

  it('リスナが無ければ何もしない', () => {
    const em = new EventEmitter();
    expect(() => {
      em.emit0('none');
      em.emit1('none', 1);
      em.emit2('none', 1, 2);
      em.emit3('none', 1, 2, 3);
    }).not.toThrow();
  });

  it('emit3 も emit 中の on を次回に延期する', () => {
    const em = new EventEmitter();
    let count = 0;
    const late = () => {
      count++;
    };
    em.on('e', () => {
      em.on('e', late);
    });
    em.emit3('e', 1, 2, 3);
    // 今回中の追加は呼ばれない
    expect(count).toBe(0);
    em.emit3('e', 1, 2, 3);
    expect(count).toBe(1);
  });
});
