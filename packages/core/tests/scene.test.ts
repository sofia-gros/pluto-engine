import { describe, expect, test, vi } from 'vitest';
import type { Plugin } from '../src/scene/Plugin';
import { Scene } from '../src/scene/Scene';

describe('Scene', () => {
  test('Should allocate sprites using this.add.sprite()', () => {
    const scene = new Scene(10);
    expect(scene.arena.activeCount).toBe(0);

    const sprite = scene.add.sprite();
    expect(sprite.id).toBe(0);
    expect(scene.arena.activeCount).toBe(1);

    sprite.x = 50;
    expect(scene.arena.posX[0]).toBe(50);
  });

  test('Should handle plugins correctly', () => {
    const scene = new Scene(10);

    let initCalled = false;
    let updateCalled = 0;
    let fixedUpdateCalled = 0;
    let destroyCalled = false;

    const dummyPlugin: Plugin = {
      init: (s) => {
        expect(s).toBe(scene);
        initCalled = true;
      },
      update: (dt) => {
        updateCalled += dt;
      },
      fixedUpdate: (fixedDt) => {
        fixedUpdateCalled += fixedDt;
      },
      destroy: () => {
        destroyCalled = true;
      },
    };

    scene.registerPlugin(dummyPlugin);
    expect(initCalled).toBe(true);

    scene.sysUpdate(0.16);
    expect(updateCalled).toBeCloseTo(0.16);

    scene.sysFixedUpdate(0.016);
    expect(fixedUpdateCalled).toBeCloseTo(0.016);

    scene.sysShutdown();
    expect(destroyCalled).toBe(true);
  });
});
