import { describe, expect, it } from 'vitest';
import { InputManager, Key, Pointer } from '../src/input/InputManager';
import { Scene } from '../src/scene/Scene';
import { SceneManager } from '../src/scene/SceneManager';

/** キー押下を模擬するためのヘルパー */
function pressKey(input: InputManager, code: string): void {
  (input as unknown as { onKeyDown: (e: unknown) => void }).onKeyDown({
    code,
  } as KeyboardEvent);
}

function releaseKey(input: InputManager, code: string): void {
  (input as unknown as { onKeyUp: (e: unknown) => void }).onKeyUp({
    code,
  } as KeyboardEvent);
}

describe('Phaser 互換 - input.addKey', () => {
  it('Key ハンドルを生成し状態を反映する', () => {
    const input = new InputManager();
    const w = input.addKey('KeyW');
    expect(w).toBeInstanceOf(Key);
    expect(w.code).toBe('KeyW');
    expect(w.isDown).toBe(false);

    pressKey(input, 'KeyW');
    input.update();
    expect(w.isDown).toBe(true);
    expect(w.isJustDown).toBe(true);
  });

  it('同じ code は同じインスタンスを返す（毎フレーム new しない）', () => {
    const input = new InputManager();
    const a = input.addKey('KeyA');
    const b = input.addKey('KeyA');
    expect(a).toBe(b);
  });

  it('isJustUp が離したフレームだけ true', () => {
    const input = new InputManager();
    const s = input.addKey('Space');
    pressKey(input, 'Space');
    input.update();
    expect(s.isJustUp).toBe(false);
    releaseKey(input, 'Space');
    input.update();
    expect(s.isJustUp).toBe(true);
    input.update();
    expect(s.isJustUp).toBe(false);
  });

  it('addKeys が複数の Key を返す', () => {
    const input = new InputManager();
    const keys = input.addKeys(['KeyW', 'KeyA', 'KeyS']);
    expect(keys.length).toBe(3);
    expect(keys[0]).toBeInstanceOf(Key);
    expect(keys[1].code).toBe('KeyA');
  });

  it('addKeys が単一文字列も受け付ける', () => {
    const input = new InputManager();
    const keys = input.addKeys('KeyZ');
    expect(keys.length).toBe(1);
    expect(keys[0].code).toBe('KeyZ');
  });

  it('createCursorKeys が矢印キーを返す', () => {
    const input = new InputManager();
    const cursor = input.createCursorKeys();
    expect(cursor.up.code).toBe('ArrowUp');
    expect(cursor.down.code).toBe('ArrowDown');
    expect(cursor.left.code).toBe('ArrowLeft');
    expect(cursor.right.code).toBe('ArrowRight');
    // 2 回呼んでも同じインスタンスです
    expect(input.createCursorKeys()).toBe(cursor);
  });

  it('arrow キーの状態を反映する', () => {
    const input = new InputManager();
    const cursor = input.createCursorKeys();
    pressKey(input, 'ArrowLeft');
    input.update();
    expect(cursor.left.isDown).toBe(true);
    expect(cursor.right.isDown).toBe(false);
  });
});

describe('Phaser 互換 - input のネストファサード', () => {
  it('keyboard / gamepad が this を返す', () => {
    const input = new InputManager();
    expect(input.keyboard).toBe(input);
    expect(input.gamepad).toBe(input);
  });

  it('pointer / activePointer が同じ Pointer を返す', () => {
    const input = new InputManager();
    expect(input.pointer).toBeInstanceOf(Pointer);
    expect(input.activePointer).toBe(input.pointer);
  });

  it('addPointer が activePointer を返す', () => {
    const input = new InputManager();
    expect(input.addPointer(3)).toBe(input.pointer);
    expect(input.pointer.id).toBe(0);
  });

  it('Pointer が座標と状態を反映する', () => {
    const input = new InputManager();
    const p = input.pointer;
    (input as unknown as { onPointerMove: (e: unknown) => void }).onPointerMove({
      clientX: 120,
      clientY: 240,
    } as PointerEvent);
    (input as unknown as { onPointerDown: (e: unknown) => void }).onPointerDown({
      clientX: 120,
      clientY: 240,
    } as PointerEvent);
    input.update();

    expect(p.x).toBe(120);
    expect(p.y).toBe(240);
    expect(p.worldX).toBe(120);
    expect(p.worldY).toBe(240);
    expect(p.isDown).toBe(true);
    expect(p.isJustDown).toBe(true);
  });
});

describe('Phaser 互換 - this.add.image', () => {
  it('add.image がスプライトを返す', () => {
    const scene = new Scene({ maxInstances: 32 });
    const img = scene.add.image(10, 20);
    expect(img.x).toBe(10);
    expect(img.y).toBe(20);
  });

  it('add.image が add.sprite と同じ実装である', () => {
    const scene = new Scene({ maxInstances: 32 });
    const a = scene.add.image(1, 2);
    const b = scene.add.sprite(1, 2);
    // どちらも同じアリーナ上で 1 スロットを占有します
    expect(scene.arena.activeCount).toBe(2);
    expect(a.id).not.toBe(b.id);
  });
});

describe('Phaser 互換 - this.game / this.scene', () => {
  it('game が PlutoEngine を返す', () => {
    const scene = new Scene({ maxInstances: 32 });
    const fake = {} as PlutoEngineLike;
    scene.engine = fake;
    expect(scene.game).toBe(fake);
  });

  it('scenePlugin が SceneManager を返す', () => {
    const scene = new Scene({ maxInstances: 32 });
    const mgr = new SceneManager({} as PlutoEngineLike);
    scene.scene = mgr;
    expect(scene.scenePlugin).toBe(mgr);
  });
});

type PlutoEngineLike = {
  scale: unknown;
};

// コンパイル時に型変換を簡潔にするためのエイリアスです。
declare const PlutoEngine: unknown;

describe('Phaser 互換 - SceneManager', () => {
  class DemoScene extends Scene {}

  it('isActive / get でシーンを問い合わせる', () => {
    const mgr = new SceneManager({} as never);
    mgr.add('a', DemoScene);
    expect(mgr.isActive('a')).toBe(true);
    expect(mgr.isActive('missing')).toBe(false);
    expect(mgr.get('a')).not.toBeNull();
    expect(mgr.get('missing')).toBeNull();
  });

  it('pause / resume がシーンを停止・再開する', () => {
    const mgr = new SceneManager({} as never);
    mgr.add('a', DemoScene);
    const scene = mgr.get('a') as Scene;
    mgr.pause('a');
    expect(scene.paused).toBe(true);
    mgr.resume('a');
    expect(scene.paused).toBe(false);
  });

  it('stop がシーンを解放し activeScene をクリアする', () => {
    const mgr = new SceneManager({} as never);
    mgr.add('a', DemoScene);
    mgr.start('a');
    expect(mgr.activeScene).not.toBeNull();
    mgr.stop('a');
    expect(mgr.activeScene).toBeNull();
  });

  it('restart がシーンを再初期化する', () => {
    const mgr = new SceneManager({} as never);
    mgr.add('a', DemoScene);
    mgr.start('a');
    const scene = mgr.get('a') as Scene;
    scene.setPaused(true);
    mgr.restart('a');
    // restart により一時停止が解除されます
    expect(scene.paused).toBe(false);
  });
});

describe('Phaser 互換 - tweens.add', () => {
  it('props で指定したプロパティをトゥイーンする', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);
    const idx = sprite.index;

    scene.tweens.add({ targets: sprite, props: { x: 100 }, duration: 1000 });
    expect(scene.tweens.count).toBe(1);
    expect(scene.arena.posX[idx]).toBe(0);

    scene.sysUpdate(500);
    expect(scene.arena.posX[idx]).toBeCloseTo(50, 0);

    scene.sysUpdate(500);
    expect(scene.arena.posX[idx]).toBe(100);
    // 完了後は解放されます
    expect(scene.tweens.count).toBe(0);
  });

  it('複数プロパティを同時にトゥイーンする', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);
    const idx = sprite.index;

    scene.tweens.add({
      targets: sprite,
      props: { x: 100, y: 200 },
      duration: 1000,
    });
    // props 1 つにつきスロットが 1 個確保されます
    expect(scene.tweens.count).toBe(2);

    scene.sysUpdate(1000);
    expect(scene.arena.posX[idx]).toBe(100);
    expect(scene.arena.posY[idx]).toBe(200);
  });

  it('targets に配列を渡すと全てへ適用する', () => {
    const scene = new Scene({ maxInstances: 100 });
    const a = scene.add.sprite(0, 0);
    const b = scene.add.sprite(0, 0);

    scene.tweens.add({ targets: [a, b], props: { x: 50 }, duration: 100 });
    scene.sysUpdate(100);

    expect(scene.arena.posX[a.index]).toBe(50);
    expect(scene.arena.posX[b.index]).toBe(50);
  });

  it('delay 中は進行しない', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);

    scene.tweens.add({
      targets: sprite,
      props: { x: 100 },
      duration: 1000,
      delay: 500,
    });

    scene.sysUpdate(400);
    expect(scene.arena.posX[sprite.index]).toBe(0);

    // 遅延の境界ちょうどではまだ 0 です (経過時間が 0 なので)
    scene.sysUpdate(100);
    expect(scene.arena.posX[sprite.index]).toBe(0);

    // 遅延を抜けた後は進行します
    scene.sysUpdate(100);
    expect(scene.arena.posX[sprite.index]).toBeGreaterThan(0);
  });

  it('イージングで前半の進みが遅くなる', () => {
    const linear = new Scene({ maxInstances: 100 });
    const eased = new Scene({ maxInstances: 100 });
    const a = linear.add.sprite(0, 0);
    const b = eased.add.sprite(0, 0);

    linear.tweens.add({ targets: a, props: { x: 100 }, duration: 1000 });
    eased.tweens.add({
      targets: b,
      props: { x: 100 },
      duration: 1000,
      ease: 'Quad.easeIn',
    });

    linear.sysUpdate(250);
    eased.sysUpdate(250);

    // Quad.easeIn は 0.25^2 = 0.0625 なので 100 ではなく約 6.25
    expect(linear.arena.posX[a.index]).toBeCloseTo(25, 1);
    expect(eased.arena.posX[b.index]).toBeLessThan(
      linear.arena.posX[a.index] / 2,
    );
  });

  it('yoyo で往復する', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);
    const idx = sprite.index;

    scene.tweens.add({
      targets: sprite,
      props: { x: 100 },
      duration: 1000,
      yoyo: true,
    });

    scene.sysUpdate(1000);
    expect(scene.arena.posX[idx]).toBeCloseTo(100, 0);

    scene.sysUpdate(1000);
    expect(scene.arena.posX[idx]).toBeCloseTo(0, 0);
    // 往復 1 往復で完了します
    expect(scene.tweens.count).toBe(0);
  });

  it('repeat で指定回数だけ繰り返す', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);
    const idx = sprite.index;

    scene.tweens.add({
      targets: sprite,
      props: { x: 100 },
      duration: 1000,
      repeat: 1,
    });

    scene.sysUpdate(1000);
    expect(scene.tweens.count).toBe(1);
    scene.sysUpdate(1000);
    expect(scene.tweens.count).toBe(0);
    expect(scene.arena.posX[idx]).toBe(100);
  });

  it('alpha は tint の A チャンネルへ反映される', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);
    const idx = sprite.index;

    scene.tweens.add({
      targets: sprite,
      props: { alpha: 0 },
      duration: 1000,
    });
    scene.sysUpdate(1000);

    // 下位 24 ビット (色) は保持され、最上位バイトが 0 になる
    expect(scene.arena.tint[idx] & 0x00ffffff).toBe(0x00ffffff);
    expect((scene.arena.tint[idx] >>> 24) & 0xff).toBe(0);
  });

  it('angle を指定すると rotation へ反映される', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);
    const idx = sprite.index;

    scene.tweens.add({
      targets: sprite,
      props: { angle: 1.5708 },
      duration: 1000,
    });
    scene.sysUpdate(1000);

    expect(scene.arena.rotation[idx]).toBeCloseTo(1.5708, 3);
  });

  it('killTweensOf が対象だけ停止する', () => {
    const scene = new Scene({ maxInstances: 100 });
    const a = scene.add.sprite(0, 0);
    const b = scene.add.sprite(0, 0);

    scene.tweens.add({ targets: [a, b], props: { x: 100 }, duration: 1000 });
    expect(scene.tweens.count).toBe(2);

    const killed = scene.tweens.killTweensOf(a);
    expect(killed).toBe(1);
    expect(scene.tweens.count).toBe(1);

    scene.sysUpdate(500);
    expect(scene.arena.posX[a.index]).toBe(0);
    expect(scene.arena.posX[b.index]).toBeGreaterThan(0);
  });

  it('killTweensOfGroup がグループ単位で停止する', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);

    const group = scene.tweens.add({
      targets: sprite,
      props: { x: 100, y: 100 },
      duration: 1000,
    });
    expect(scene.tweens.count).toBe(2);

    expect(scene.tweens.killTweensOfGroup(group)).toBe(2);
    expect(scene.tweens.count).toBe(0);
  });

  it('未対応のプロパティ名は静かにスキップする', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);

    scene.tweens.add({
      targets: sprite,
      props: { unknownProp: 100 },
      duration: 1000,
    });
    expect(scene.tweens.count).toBe(0);
  });

  it('onStart は遅延明けに 1 度だけ呼ばれる', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);
    let starts = 0;

    scene.tweens.add({
      targets: sprite,
      props: { x: 100 },
      duration: 1000,
      delay: 200,
      onStart: () => starts++,
    });

    scene.sysUpdate(100);
    expect(starts).toBe(0);

    scene.sysUpdate(200);
    expect(starts).toBe(1);
    scene.sysUpdate(100);
    expect(starts).toBe(1);
  });

  it('onUpdate は進行中に毎フレーム呼ばれる', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);
    let updates = 0;

    scene.tweens.add({
      targets: sprite,
      props: { x: 100 },
      duration: 1000,
      onUpdate: () => updates++,
    });

    scene.sysUpdate(100);
    scene.sysUpdate(100);
    scene.sysUpdate(100);
    expect(updates).toBe(3);
  });

  it('onComplete はグループ全てが終わったら 1 度だけ呼ばれる', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);
    let completes = 0;

    scene.tweens.add({
      targets: sprite,
      props: { x: 100, y: 100 },
      duration: 1000,
      onComplete: () => completes++,
    });

    scene.sysUpdate(1000);
    expect(completes).toBe(1);

    // 追加でフレームを回しても二重には起きません
    scene.sysUpdate(1000);
    expect(completes).toBe(1);
  });

  it('killTweensOf では onComplete が起きない', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);
    let completes = 0;

    scene.tweens.add({
      targets: sprite,
      props: { x: 100 },
      duration: 1000,
      onComplete: () => completes++,
    });
    scene.tweens.killTweensOf(sprite);
    expect(completes).toBe(0);
  });

  it('chain が設定を順番に実行する', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);
    const idx = sprite.index;
    const order: string[] = [];

    scene.tweens.chain([
      {
        targets: sprite,
        props: { x: 100 },
        duration: 1000,
        onComplete: () => order.push('first'),
      },
      {
        targets: sprite,
        props: { x: 200 },
        duration: 1000,
        onComplete: () => order.push('second'),
      },
    ]);

    // 1 ステップ目が終わるまでは 2 つ目が動かない
    scene.sysUpdate(1000);
    expect(scene.arena.posX[idx]).toBe(100);
    expect(order).toEqual(['first']);

    scene.sysUpdate(500);
    expect(scene.arena.posX[idx]).toBe(150);

    scene.sysUpdate(500);
    expect(scene.arena.posX[idx]).toBe(200);
    expect(order).toEqual(['first', 'second']);
    expect(scene.tweens.count).toBe(0);
  });

  it('chain を killTweensOfGroup で中断できる', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);
    const idx = sprite.index;
    const ran: string[] = [];

    const chainId = scene.tweens.chain([
      {
        targets: sprite,
        props: { x: 100 },
        duration: 1000,
        onComplete: () => ran.push('first'),
      },
      {
        targets: sprite,
        props: { x: 200 },
        duration: 1000,
        onComplete: () => ran.push('second'),
      },
    ]);

    scene.sysUpdate(1000);
    expect(ran).toEqual(['first']);

    scene.tweens.killTweensOfGroup(chainId);
    scene.sysUpdate(1000);
    expect(ran).toEqual(['first']);
    expect(scene.arena.posX[idx]).toBe(100);
  });

  it('clear が全トゥイーンを解放する', () => {
    const scene = new Scene({ maxInstances: 100 });
    const sprite = scene.add.sprite(0, 0);

    scene.tweens.add({ targets: sprite, props: { x: 100 }, duration: 1000 });
    scene.tweens.clear();
    expect(scene.tweens.count).toBe(0);
  });
});
