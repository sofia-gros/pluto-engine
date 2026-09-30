import { describe, expect, test, vi } from 'vitest';
import { TimeStepManager } from '../src/time/TimeStepManager';

describe('TimeStepManager', () => {
  test('step computes deltaTime and clamps it', () => {
    const t = new TimeStepManager();
    t.step(0);
    expect(t.step(16)).toBeCloseTo(0.016, 3);
    // 5 秒ぶんの巨大 delta は 0.1 秒に丸められる
    expect(t.step(5016)).toBeCloseTo(0.1, 6);
  });

  test('accumulates elapsed time', () => {
    const t = new TimeStepManager();
    t.step(0);
    t.step(100);
    t.step(200);
    expect(t.time).toBeCloseTo(0.2, 3);
  });

  test('delayedCall fires once after the delay', () => {
    const t = new TimeStepManager();
    const cb = vi.fn();
    t.delayedCall(100, cb);

    t.update(50);
    expect(cb).not.toHaveBeenCalled();
    t.update(50);
    expect(cb).toHaveBeenCalledTimes(1);

    // 一度だけ発火して取り消される
    t.update(500);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(t.activeTimerCount).toBe(0);
  });

  test('addEvent with loop keeps firing', () => {
    const t = new TimeStepManager();
    const cb = vi.fn();
    t.addEvent({ delay: 10, callback: cb, loop: true });

    for (let i = 0; i < 5; i++) t.update(10);
    expect(cb).toHaveBeenCalledTimes(5);
    expect(t.activeTimerCount).toBe(1);

    t.clearTimers();
    expect(t.activeTimerCount).toBe(0);
  });

  test('removeEvent cancels a pending timer', () => {
    const t = new TimeStepManager();
    const cb = vi.fn();
    const id = t.addEvent({ delay: 10, callback: cb });
    t.removeEvent(id);
    t.update(100);
    expect(cb).not.toHaveBeenCalled();
  });

  test('timer ids are recycled through the free list', () => {
    const t = new TimeStepManager();
    const cb = vi.fn();
    const a = t.addEvent({ delay: 1000, callback: cb });
    t.removeEvent(a);
    const b = t.addEvent({ delay: 1000, callback: cb });
    expect(b).toBe(a);
  });

  test('arguments are forwarded to the callback', () => {
    const t = new TimeStepManager();
    const cb = vi.fn();
    t.addEvent({ delay: 10, callback: cb, args: [1, 'two'] } as any);
    t.update(20);
    expect(cb).toHaveBeenCalledWith(1, 'two');
  });

  test('reports the active timer count', () => {
    const t = new TimeStepManager();
    const cb = () => {};
    t.addEvent({ delay: 10, callback: cb });
    t.addEvent({ delay: 10, callback: cb });
    expect(t.activeTimerCount).toBe(2);
  });
});
