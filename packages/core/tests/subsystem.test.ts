import { describe, expect, it } from 'vitest';
import { Scene } from '../src/scene/Scene';
import { Subsystem, describeSubsystems } from '../src/scene/SubsystemMask';
import { EventEmitter } from '../src/events/EventEmitter';
import { DataRegistry } from '../src/events/DataRegistry';

describe('SubsystemMask', () => {
  it('各ビットが単一ビットであり、互いに重ならない', () => {
    const bits = [
      Subsystem.Sprites,
      Subsystem.Tilemap,
      Subsystem.Tweens,
      Subsystem.Anims,
      Subsystem.Swarm,
      Subsystem.Physics,
      Subsystem.Lighting,
      Subsystem.Particles,
      Subsystem.Sound,
      Subsystem.Camera,
      Subsystem.Text,
    ];
    for (const b of bits) {
      // 2 の冪乗であること
      expect(b & (b - 1)).toBe(0);
    }
    // 全部足しても重複ビットがないこと
    const all = bits.reduce((a, b) => a | b, 0);
    let seen = 0;
    for (const b of bits) {
      expect(all & b).toBe(b);
      expect(seen & b).toBe(0);
      seen |= b;
    }
  });

  it('OR 合成で複数フラグをまとめられる', () => {
    const mask = Subsystem.Tweens | Subsystem.Physics;
    expect((mask & Subsystem.Tweens) !== 0).toBe(true);
    expect((mask & Subsystem.Physics) !== 0).toBe(true);
    expect((mask & Subsystem.Anims) !== 0).toBe(false);
  });

  it('describeSubsystems は名前リストを返す', () => {
    expect(describeSubsystems(Subsystem.None)).toBe('None');
    const s = describeSubsystems(Subsystem.Tweens | Subsystem.Physics);
    expect(s).toContain('Tweens');
    expect(s).toContain('Physics');
    expect(s).not.toContain('Anims');
  });
});

describe('ゼロコスト・サブシステム (遅延アクティベーション)', () => {
  it('未アクセスのマネージャーは生成されず、ビットも立たない', () => {
    const scene = new Scene({ maxInstances: 500 });
    expect(scene.hasSubsystem(Subsystem.Tweens)).toBe(false);
    expect(scene.hasSubsystem(Subsystem.Anims)).toBe(false);
    expect(scene.hasSubsystem(Subsystem.Particles)).toBe(false);
    expect(scene.hasSubsystem(Subsystem.Physics)).toBe(false);
  });

  it('初回アクセスで生成され、ビットが立つ', () => {
    const scene = new Scene({ maxInstances: 500 });
    const t = scene.tweens;
    expect(scene.hasSubsystem(Subsystem.Tweens)).toBe(true);
    // 2 回目は同一インスタンスが返る (再生成しない)
    expect(scene.tweens).toBe(t);
  });

  it('tweens / anim / particles / physics がそれぞれ独立して活性化される', () => {
    const scene = new Scene({ maxInstances: 500 });
    void scene.tweens;
    expect(scene.hasSubsystem(Subsystem.Tweens)).toBe(true);
    expect(scene.hasSubsystem(Subsystem.Anims)).toBe(false);
    expect(scene.hasSubsystem(Subsystem.Physics)).toBe(false);

    void scene.physics;
    expect(scene.hasSubsystem(Subsystem.Physics)).toBe(true);
    expect(scene.hasSubsystem(Subsystem.Anims)).toBe(false);
  });

  it('activeSubsystems は Camera を既定で含む', () => {
    const scene = new Scene({ maxInstances: 100 });
    expect(scene.hasSubsystem(Subsystem.Camera)).toBe(true);
    const before = scene.activeSubsystems;
    void scene.tweens;
    expect(scene.activeSubsystems).toBe(before | Subsystem.Tweens);
  });

  it('anim 初回アクセス時に animTracker が接続される (Sprite.play の経路)', () => {
    const scene = new Scene({ maxInstances: 100 });
    // 遅延生成前は何も接続されていない
    expect(scene.arena.animTracker).toBeNull();
    void scene.anim;
    expect(scene.arena.animTracker).toBe(scene.anim);
  });

  it('physics は生成時に init 済み (arena 参照を保持)', () => {
    const scene = new Scene({ maxInstances: 300 });
    void scene.physics;
    // collide() が例外を投げずに完走すれば参照が正しい
    expect(() => scene.physics.collide()).not.toThrow();
    // SoA 配列が容量どおり確保されていること
    expect(scene.physics.velX.length).toBe(300);
  });

  it('particles は生成時に init 済み', () => {
    const scene = new Scene({ maxInstances: 300 });
    void scene.particles;
    expect(scene.particles.life.length).toBe(300);
  });

  it('未使用サブシステムでは update を回しても何も起きない (スキップ経路)', () => {
    const scene = new Scene({ maxInstances: 100 });
    let userCalled = 0;
    scene.update = () => {
      userCalled++;
    };
    // どのマネージャーも作らないまま 10 フレーム回す
    for (let i = 0; i < 10; i++) scene.sysUpdate(1 / 60);
    expect(userCalled).toBe(10);
    // 一切作られていない
    expect(scene.hasSubsystem(Subsystem.Tweens)).toBe(false);
    expect(scene.hasSubsystem(Subsystem.Physics)).toBe(false);
  });

  it('使用中の tweens は update される', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);
    const idx = sprite.index;
    // x を 0 -> 100 へ 1000ms でトゥイーン (Phaser 互換の記法)
    scene.tweens.add({ targets: sprite, props: { x: 100 }, duration: 1000 });
    expect(scene.arena.posX[idx]).toBe(0);

    scene.sysUpdate(500);
    // 半分まで進んでいること
    expect(scene.arena.posX[idx]).toBeGreaterThan(0);
    expect(scene.arena.posX[idx]).toBeLessThan(100);
    expect(scene.hasSubsystem(Subsystem.Tweens)).toBe(true);
  });

  it('tilemap 生成 Tilemap ビットが立つ', () => {
    const scene = new Scene({ maxInstances: 100 });
    expect(scene.hasSubsystem(Subsystem.Tilemap)).toBe(false);
    scene.add.tilemap(
      [
        [0, 1],
        [2, 3],
      ],
      16,
    );
    expect(scene.hasSubsystem(Subsystem.Tilemap)).toBe(true);
  });

  it('anims は anim への別名として同じインスタンスを返す', () => {
    const scene = new Scene({ maxInstances: 100 });
    expect(scene.anims).toBe(scene.anim);
    expect(scene.hasSubsystem(Subsystem.Anims)).toBe(true);
  });
});

describe('add.container', () => {
  it('子を親へ結び、子の座標を相対座標へ変換する', () => {
    const scene = new Scene({ maxInstances: 100 });
    const a = scene.add.sprite(110, 120);
    const b = scene.add.sprite(130, 140);
    const parent = scene.add.container(100, 100, [a, b]);

    expect(a.parentId).toBe(parent.id);
    expect(b.parentId).toBe(parent.id);
    // ローカル座標は親基準になります
    expect(scene.arena.posX[scene.arena.idToIndex[a.id]]).toBe(10);
    expect(scene.arena.posY[scene.arena.idToIndex[a.id]]).toBe(20);
    expect(scene.arena.posX[scene.arena.idToIndex[b.id]]).toBe(30);
    expect(scene.arena.posY[scene.arena.idToIndex[b.id]]).toBe(40);
    expect(scene.arena.hasHierarchy).toBe(true);
  });

  it('ワールド変換は親の移動量だけ加算される', () => {
    const scene = new Scene({ maxInstances: 100 });
    const child = scene.add.sprite(110, 120);
    const parent = scene.add.container(100, 100, [child]);

    const pidx = scene.arena.idToIndex[parent.id];
    scene.arena.posX[pidx] = 150;
    scene.arena.posY[pidx] = 160;
    scene.arena.dirtyPos = true;
    scene.arena.dirtyHierarchy = true;
    scene.arena.computeWorldTransforms();

    expect(child.x).toBe(160);
    expect(child.y).toBe(180);
  });

  it('親なしの子は解決されず、ローカル座標がそのままワールドになる', () => {
    const scene = new Scene({ maxInstances: 100 });
    const s = scene.add.sprite(42, 84);
    expect(s.x).toBe(42);
    expect(s.y).toBe(84);
  });
});

describe('EventEmitter', () => {
  it('購読したコールバックが引数付きで呼ばれる', () => {
    const bus = new EventEmitter();
    let got = -1;
    bus.on('hit', (v: number) => {
      got = v;
    });
    bus.emit('hit', 7);
    expect(got).toBe(7);
  });

  it('複数リスナは登録順に呼ばれる', () => {
    const bus = new EventEmitter();
    const order: number[] = [];
    bus.on('e', () => order.push(1));
    bus.on('e', () => order.push(2));
    bus.on('e', () => order.push(3));
    bus.emit('e');
    expect(order).toEqual([1, 2, 3]);
  });

  it('off で解除すると呼ばれなくなる', () => {
    const bus = new EventEmitter();
    let n = 0;
    const fn = () => {
      n++;
    };
    bus.on('e', fn);
    bus.emit('e');
    bus.off('e', fn);
    bus.emit('e');
    expect(n).toBe(1);
  });

  it('on が返す関数でも解除できる', () => {
    const bus = new EventEmitter();
    let n = 0;
    const dispose = bus.on('e', () => {
      n++;
    });
    bus.emit('e');
    dispose();
    bus.emit('e');
    expect(n).toBe(1);
  });

  it('emit 中の解除でもそのフレームは安全 (残りは呼ばれ、以降は呼ばれない)', () => {
    const bus = new EventEmitter();
    const calls: string[] = [];
    const second = () => calls.push('second');
    bus.on('e', () => {
      calls.push('first');
      bus.off('e', second);
    });
    bus.on('e', second);

    bus.emit('e');
    // first が実行され second を外す。off は即座に効くため second は呼ばれない
    expect(calls).toEqual(['first']);

    calls.length = 0;
    bus.emit('e');
    expect(calls).toEqual(['first']);
  });

  it('emit 中の自己解除で再入しても無限ループしない', () => {
    const bus = new EventEmitter();
    let n = 0;
    const fn = () => {
      n++;
      bus.off('e', fn);
    };
    bus.on('e', fn);
    bus.emit('e');
    bus.emit('e');
    expect(n).toBe(1);
  });

  it('once は 1 度だけ呼ばれる', () => {
    const bus = new EventEmitter();
    let n = 0;
    bus.once('e', () => {
      n++;
    });
    bus.emit('e');
    bus.emit('e');
    bus.emit('e');
    expect(n).toBe(1);
  });

  it('未登録イベントの emit は何もしない', () => {
    const bus = new EventEmitter();
    expect(() => bus.emit('nothing')).not.toThrow();
  });

  it('空の配列に新規購読が入っても emit は既存のものにだけ届く', () => {
    const bus = new EventEmitter();
    const order: string[] = [];
    bus.on('e', () => {
      order.push('a');
      bus.on('e', () => order.push('late'));
    });
    bus.emit('e');
    expect(order).toEqual(['a']);
    // 走査長を固定したため、次回 emit から有効になる
    bus.emit('e');
    expect(order).toEqual(['a', 'a', 'late']);
  });

  it('listenerCount / eventNames が正しく反映する', () => {
    const bus = new EventEmitter();
    const fn = () => {};
    bus.on('a', fn);
    bus.on('a', fn);
    bus.on('b', fn);
    expect(bus.listenerCount('a')).toBe(2);
    expect(bus.listenerCount('b')).toBe(1);
    expect(bus.eventNames().sort()).toEqual(['a', 'b']);
    bus.off('a', fn);
    expect(bus.listenerCount('a')).toBe(1);
  });

  it('全解除できる', () => {
    const bus = new EventEmitter();
    bus.on('a', () => {});
    bus.on('b', () => {});
    bus.removeAllListeners();
    expect(bus.eventNames().length).toBe(0);
  });

  it('異なる関数を渡しても解除されない (誤解除の防止)', () => {
    const bus = new EventEmitter();
    const a = () => {};
    const b = () => {};
    bus.on('e', a);
    bus.off('e', b);
    expect(bus.listenerCount('e')).toBe(1);
  });
});

describe('DataRegistry', () => {
  it('名前空間ごとに値を保持し、隔離される', () => {
    const reg = new DataRegistry();
    reg.set('a', 'hp', 10);
    reg.set('b', 'hp', 99);
    expect(reg.get<number>('a', 'hp', 0)).toBe(10);
    expect(reg.get<number>('b', 'hp', 0)).toBe(99);
  });

  it('未登録キーには fallback が返る', () => {
    const reg = new DataRegistry();
    expect(reg.get('x', 'nope', -1)).toBe(-1);
    expect(reg.has('x', 'nope')).toBe(false);
  });

  it('has / remove が機能する', () => {
    const reg = new DataRegistry();
    reg.set('s', 'k', 'v');
    expect(reg.has('s', 'k')).toBe(true);
    expect(reg.remove('s', 'k')).toBe(true);
    expect(reg.has('s', 'k')).toBe(false);
    expect(reg.remove('s', 'k')).toBe(false);
  });

  it('float スロットは初回アクセス時に遅延確保される', () => {
    const reg = new DataRegistry();
    expect(reg.getFloat('f', 'x')).toBe(0);
    reg.setFloat('f', 'x', 5);
    expect(reg.getFloat('f', 'x')).toBe(5);
    expect(reg.floatCount('f')).toBe(1);
  });

  it('float スロットは自動拡張される', () => {
    const reg = new DataRegistry();
    for (let i = 0; i < 100; i++) reg.setFloat('f', `k${i}`, i);
    expect(reg.floatCount('f')).toBe(100);
    for (let i = 0; i < 100; i++) expect(reg.getFloat('f', `k${i}`)).toBe(i);
  });

  it('addFloat は累積値を返し、負数も扱える', () => {
    const reg = new DataRegistry();
    expect(reg.addFloat('f', 'score', 10)).toBe(10);
    expect(reg.addFloat('f', 'score', 5)).toBe(15);
    expect(reg.addFloat('f', 'score', -20)).toBe(-5);
    expect(reg.getFloat('f', 'score')).toBe(-5);
  });

  it('名前空間ごとに float スロットは独立する', () => {
    const reg = new DataRegistry();
    reg.setFloat('a', 'v', 1);
    reg.setFloat('b', 'v', 2);
    expect(reg.getFloat('a', 'v')).toBe(1);
    expect(reg.getFloat('b', 'v')).toBe(2);
  });

  it('floatSnapshot で全値が取得できる', () => {
    const reg = new DataRegistry();
    reg.setFloat('f', 'hp', 3);
    reg.setFloat('f', 'mp', 7);
    const snap = reg.floatSnapshot('f');
    expect(snap.hp).toBe(3);
    expect(snap.mp).toBe(7);
    expect(Object.keys(snap).length).toBe(2);
  });

  it('clear で名前空間単位・全体単位に消せる', () => {
    const reg = new DataRegistry();
    reg.set('a', 'k', 1);
    reg.set('b', 'k', 2);
    reg.setFloat('a', 'n', 5);
    reg.clear('a');
    expect(reg.has('a', 'k')).toBe(false);
    expect(reg.has('b', 'k')).toBe(true);
    expect(reg.floatCount('a')).toBe(0);
    reg.clear();
    expect(reg.has('b', 'k')).toBe(false);
  });

  it('keys で名前空間内のキーを列挙できる', () => {
    const reg = new DataRegistry();
    reg.set('s', 'one', 1);
    reg.set('s', 'two', 2);
    expect(reg.keys('s').sort()).toEqual(['one', 'two']);
    expect(reg.keys('missing').length).toBe(0);
  });
});

describe('Scene の events / registry', () => {
  it('events はシーンごとに独立している', () => {
    const a = new Scene({ maxInstances: 50 });
    const b = new Scene({ maxInstances: 50 });
    let na = 0;
    let nb = 0;
    a.events.on('x', () => na++);
    b.events.on('x', () => nb++);
    a.events.emit('x');
    expect(na).toBe(1);
    expect(nb).toBe(0);
  });

  it('SceneManager 経由のシーンは registry を共有する', () => {
    const a = new Scene({ maxInstances: 50 });
    const b = new Scene({ maxInstances: 50 });
    // SceneManager 未登録時はそれぞれ専用
    expect(a.registry).not.toBe(b.registry);

    const shared = new DataRegistry();
    (a as unknown as { scene: { registry: DataRegistry } }).scene = {
      registry: shared,
    } as never;
    (b as unknown as { scene: { registry: DataRegistry } }).scene = {
      registry: shared,
    } as never;

    a.registry.set('progress', 'stage', 3);
    expect(b.registry.get('progress', 'stage', 0)).toBe(3);
  });
});
