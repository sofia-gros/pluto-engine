import { describe, expect, test } from 'vitest';
import { AnimationManager } from '../src/anim/AnimationManager';
import { InstanceBufferArena } from '../src/arena/InstanceBufferArena';
import { Sprite } from '../src/arena/Sprite';
import { Text } from '../src/arena/Text';

describe('InstanceBufferArena: SoA Scene Graph', () => {
  test('computeWorldTransforms resolves parent-child composition', () => {
    const arena = new InstanceBufferArena(16);
    const parentId = arena.allocate();
    const childId = arena.allocate();

    const parent = new Sprite(parentId, arena);
    const child = new Sprite(childId, arena);

    parent.x = 100;
    parent.y = 50;
    child.setParentId(parentId);
    child.x = 10;
    child.y = 20;

    expect(arena.hasHierarchy).toBe(true);
    arena.computeWorldTransforms();

    // 親自身がルートなのでワールドはローカルと一致する
    expect(parent.x).toBe(100);
    expect(parent.y).toBe(50);

    // 子のワールド座標は親のワールドにローカルが加算された値
    expect(child.x).toBe(110);
    expect(child.y).toBe(70);
  });

  test('parent rotation rotates the child local offset', () => {
    const arena = new InstanceBufferArena(16);
    const parentId = arena.allocate();
    const childId = arena.allocate();

    const parent = new Sprite(parentId, arena);
    const child = new Sprite(childId, arena);

    parent.x = 0;
    parent.y = 0;
    parent.rotation = Math.PI / 2; // 90 度
    child.setParentId(parentId);
    child.x = 10;
    child.y = 0;

    arena.computeWorldTransforms();

    // 90度回転会让 (10, 0) 变成 (0, 10)
    expect(child.x).toBeCloseTo(0, 4);
    expect(child.y).toBeCloseTo(10, 4);
    expect(child.rotation).toBeCloseTo(Math.PI / 2, 4);
  });

  test('resolution works even when the child is stored before the parent', () => {
    const arena = new InstanceBufferArena(16);
    // 先に子、後に親费率という非自明な並び来做测试
    const childId = arena.allocate();
    const parentId = arena.allocate();

    const parent = new Sprite(parentId, arena);
    const child = new Sprite(childId, arena);

    parent.x = 200;
    parent.y = 0;
    child.setParentId(parentId);
    child.x = 5;
    child.y = 5;

    arena.computeWorldTransforms();

    expect(child.x).toBe(205);
    expect(child.y).toBe(5);
  });

  test('cycle in the hierarchy does not cause infinite recursion', () => {
    const arena = new InstanceBufferArena(8);
    const a = arena.allocate();
    const b = arena.allocate();

    const sa = new Sprite(a, arena);
    const sb = new Sprite(b, arena);

    sa.setParentId(b);
    sb.setParentId(a);

    // 例外が出ずに完了することのみを確認する
    expect(() => arena.computeWorldTransforms()).not.toThrow();
  });

  test('hasHierarchy stays false when no parent is assigned', () => {
    const arena = new InstanceBufferArena(8);
    const id = arena.allocate();
    const s = new Sprite(id, arena);
    s.x = 10;
    arena.computeWorldTransforms();
    expect(arena.hasHierarchy).toBe(false);
    // 階層不使用時は posX がそのまま使われる
    expect(s.x).toBe(10);
  });
});

describe('InstanceBufferArena: hit testing', () => {
  test('hitTest returns the topmost interactive entity first', () => {
    const arena = new InstanceBufferArena(16);
    const back = arena.allocate();
    const front = arena.allocate();

    const sb = new Sprite(back, arena);
    const sf = new Sprite(front, arena);

    sb.setInteractive(20, 20);
    sf.setInteractive(20, 20);

    sb.x = 100;
    sb.y = 100;
    sf.x = 100;
    sf.y = 100;

    const out = new Int32Array(8);
    const n = arena.hitTest(100, 100, out);

    expect(n).toBe(2);
    // 降順走査なので手前の front が先に来る
    expect(out[0]).toBe(front);
  });

  test('non-interactive entities are skipped', () => {
    const arena = new InstanceBufferArena(16);
    const id = arena.allocate();
    const s = new Sprite(id, arena);
    s.setInteractive(10, 10);
    s.x = 0;
    s.y = 0;

    const out = new Int32Array(4);
    expect(arena.hitTest(0, 0, out)).toBe(1);
    expect(arena.hitTest(50, 50, out)).toBe(0);
  });
});

describe('Flyweight Sprite: own property footprint', () => {
  test('Sprite holds only id and _arena as own properties', () => {
    const arena = new InstanceBufferArena(8);
    const id = arena.allocate();
    const sprite = new Sprite(id, arena);

    // 32 Byte の目標を守るため、状態は SoA に集約されていること
    expect(Object.keys(sprite).sort()).toEqual(['_arena', 'id']);
  });

  test('asset reference is stored in the arena, not on the handle', () => {
    const arena = new InstanceBufferArena(8);
    const id = arena.allocate();
    const sprite = new Sprite(id, arena);

    const asset = {
      layerIndex: 7,
      width: 64,
      height: 64,
      frames: [
        { uvX: 0, uvY: 0, uvW: 0.5, uvH: 0.5 },
        { uvX: 0.5, uvY: 0, uvW: 0.5, uvH: 0.5 },
      ],
    };

    sprite.setTexture(asset, 1);

    expect(arena.assetRef[arena.idToIndex[id]]).toBe(asset);
    expect(sprite.frameIdx).toBe(7);
    expect(sprite.frame).toBe(1);
    expect(sprite.uvX).toBe(0.5);
    // setTexture は SoA を書き換えるだけなので own プロパティは増えない
    expect(Object.keys(sprite).sort()).toEqual(['_arena', 'id']);
  });

  test('setInteractive with no args derives the hit area from the display size', () => {
    const arena = new InstanceBufferArena(8);
    const id = arena.allocate();
    const sprite = new Sprite(id, arena);
    sprite.setTexture({ layerIndex: 0, width: 32, height: 48 });
    sprite.setInteractive();

    // 明示的なヒット領域は指定していません (0 = 自動導出)。
    // 実際の判定サイズはフレーム寸法 × スケール倍率から導出されます。
    expect(sprite.hitWidth).toBe(0);
    expect(sprite.hitHeight).toBe(0);
    expect(sprite.displayWidth).toBe(32);
    expect(sprite.displayHeight).toBe(48);

    // 明示指定した場合はそちらが使われる
    sprite.setInteractive(20, 20);
    expect(sprite.hitWidth).toBe(20);
    expect(sprite.hitHeight).toBe(20);
  });

  test('setInteractive with no args follows the scale multiplier', () => {
    const arena = new InstanceBufferArena(8);
    const id = arena.allocate();
    const sprite = new Sprite(id, arena);
    sprite.setTexture({ layerIndex: 0, width: 32, height: 32 });
    sprite.setInteractive();
    sprite.setScale(3);

    // 当たり判定が画像の大きさに追従します (Phaser 互換)
    const out = new Int32Array(4);
    // 中心ちょうどならヒット
    expect(arena.hitTest(0, 0, out)).toBe(1);
    // 96x96 なので端ギリギリ (48) は内側
    expect(arena.hitTest(47, 0, out)).toBe(1);
    // 48 を超えると外
    expect(arena.hitTest(49, 0, out)).toBe(0);
  });

  test('rotation and depth accessors write through to the arena', () => {
    const arena = new InstanceBufferArena(8);
    const id = arena.allocate();
    const sprite = new Sprite(id, arena);
    const idx = arena.idToIndex[id];

    sprite.rotation = 1.25;
    sprite.depth = 5;

    expect(arena.rotation[idx]).toBe(1.25);
    expect(arena.depth[idx]).toBe(5);
    expect(sprite.rotation).toBe(1.25);
    expect(sprite.depth).toBe(5);
    expect(arena.dirtyRotation).toBe(true);
    expect(arena.dirtyDepth).toBe(true);
  });

  test('destroyed reports true after free', () => {
    const arena = new InstanceBufferArena(8);
    const id = arena.allocate();
    const sprite = new Sprite(id, arena);
    expect(sprite.destroyed).toBe(false);
    sprite.destroy();
    expect(sprite.destroyed).toBe(true);
  });
});

describe('AnimationManager without Sprite references', () => {
  test('play() accepts an arena id and writes UVs directly', () => {
    const arena = new InstanceBufferArena(8);
    const anim = new AnimationManager(arena, 8);
    arena.animTracker = anim;

    const id = arena.allocate();
    const idx = arena.idToIndex[id];
    const sprite = new Sprite(id, arena);

    const asset = {
      layerIndex: 0,
      frames: [
        { uvX: 0, uvY: 0, uvW: 0.25, uvH: 0.25 },
        { uvX: 0.25, uvY: 0, uvW: 0.25, uvH: 0.25 },
      ],
    };
    sprite.setTexture(asset, 0);

    anim.create({ key: 'walk', frames: [0, 1], frameRate: 1000, repeat: -1 });
    sprite.play('walk');

    // 初期フレーム (0) が適用される
    expect(sprite.frame).toBe(0);
    expect(arena.uvX[idx]).toBe(0);

    // フレーム跨界でコマ 1 へ進む
    anim.update(0.001);
    expect(sprite.frame).toBe(1);
    expect(arena.uvX[idx]).toBe(0.25);
  });

  test('ignoreIfPlaying keeps the current animation', () => {
    const arena = new InstanceBufferArena(8);
    const anim = new AnimationManager(arena, 8);
    arena.animTracker = anim;

    const id = arena.allocate();
    const sprite = new Sprite(id, arena);
    sprite.setTexture({ layerIndex: 0, frames: [{ uvX: 0, uvY: 0, uvW: 1, uvH: 1 }] });

    anim.create({ key: 'idle', frames: [0], frameRate: 10, repeat: -1 });
    anim.create({ key: 'run', frames: [0], frameRate: 10, repeat: -1 });

    sprite.play('idle');
    sprite.play('run', true);
    anim.update(0.001);
    // idle は frameRate 10 = 100ms なのでまだフレーム遷移していない
    expect(sprite.frame).toBe(0);
  });

  test('stop() halts playback', () => {
    const arena = new InstanceBufferArena(8);
    const anim = new AnimationManager(arena, 8);
    arena.animTracker = anim;
    const id = arena.allocate();

    anim.create({ key: 'a', frames: [0], frameRate: 10, repeat: -1 });
    anim.play(id, 'a');
    anim.stop(id);

    let active = 0;
    for (let i = 0; i < anim.capacity; i++) active += anim.active[i];
    expect(active).toBe(0);
  });
});

describe('Text: zero-allocation glyph layout', () => {
  test('each glyph consumes one arena slot and advances the pen', () => {
    const arena = new InstanceBufferArena(64);
    const text = new Text(10, 20, 'abc', { fontSize: 10 }, arena);

    expect(text.glyphCount).toBe(3);
    expect(arena.activeCount).toBe(3);

    // 等幅 10px * 0.5 = 5px ずつ前進する
    const base = arena.idToIndex[0];
    expect(arena.posX[base]).toBe(10);
    expect(arena.posX[base + 1]).toBe(15);
    expect(arena.posX[base + 2]).toBe(20);
    expect(arena.posY[base]).toBe(20);
  });

  test('shortening the string frees the surplus arena slots', () => {
    const arena = new InstanceBufferArena(64);
    const text = new Text(0, 0, 'abcde', { fontSize: 10 }, arena);
    expect(arena.activeCount).toBe(5);

    text.text = 'ab';
    expect(text.glyphCount).toBe(2);
    expect(arena.activeCount).toBe(2);
  });

  test('reusing the same length does not allocate new arena slots', () => {
    const arena = new InstanceBufferArena(64);
    const text = new Text(0, 0, 'abc', { fontSize: 10 }, arena);
    const ids: number[] = [];
    for (let i = 0; i < 3; i++) {
      ids.push(arena.indexToId[i]);
    }

    text.text = 'xyz';
    expect(arena.activeCount).toBe(3);
    // 同じ長度の差し替えではスロットが再利用される
    for (let i = 0; i < 3; i++) {
      expect(arena.indexToId[i]).toBe(ids[i]);
    }
  });

  test('writes to the dense index, not the raw id', () => {
    const arena = new InstanceBufferArena(64);
    // 先に 1 個だけ確保して解放し、ID と密添字のずれを作る
    const tmp = arena.allocate();
    arena.free(tmp);

    const text = new Text(100, 200, 'A', { fontSize: 10 }, arena);
    const id = arena.indexToId[arena.activeCount - 1];
    const idx = arena.idToIndex[id];
    // ずれaption があっても正しい密添字へ書き込まれていること
    expect(arena.posX[idx]).toBe(100);
    expect(arena.posY[idx]).toBe(200);
  });

  test('destroy releases all glyph slots', () => {
    const arena = new InstanceBufferArena(64);
    const text = new Text(0, 0, 'hello', { fontSize: 10 }, arena);
    expect(arena.activeCount).toBe(5);
    text.destroy();
    expect(arena.activeCount).toBe(0);
  });

  test('glyph source supplies UV and advance width', () => {
    const arena = new InstanceBufferArena(64);
    const text = new Text(0, 0, 'ab', { fontSize: 10 }, arena);
    const calls: number[] = [];
    text.setGlyphSource({
      layerIndex: 3,
      lookup(charCode: number, outUv: Float32Array): number {
        calls.push(charCode);
        outUv[0] = charCode / 1000;
        outUv[1] = 0;
        outUv[2] = 0.25;
        outUv[3] = 0.25;
        return 0.5; // fontSize 単位
      },
    });

    expect(calls).toEqual([97, 98]);
    const base = arena.idToIndex[0];
    expect(arena.frameIdx[base]).toBe(3);
    expect(arena.uvW[base]).toBe(0.25);
    // 前進幅 0.5 * fontSize 10 = 5
    expect(arena.posX[base + 1]).toBe(5);
  });
});
