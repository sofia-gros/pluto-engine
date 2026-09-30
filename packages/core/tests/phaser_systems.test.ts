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
