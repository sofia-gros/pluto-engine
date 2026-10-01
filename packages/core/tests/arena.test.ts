import { describe, expect, test } from 'vitest';
import { InstanceBufferArena } from '../src/arena/InstanceBufferArena';
import { Sprite } from '../src/arena/Sprite';

describe('InstanceBufferArena and Flyweight Sprite', () => {
  test('Arena should allocate and free correctly (Zero Allocation)', () => {
    const arena = new InstanceBufferArena(100);
    expect(arena.capacity).toBe(100);
    expect(arena.activeCount).toBe(0);

    const id1 = arena.allocate();
    expect(id1).toBe(0);
    expect(arena.activeCount).toBe(1);

    const id2 = arena.allocate();
    expect(id2).toBe(1);
    expect(arena.activeCount).toBe(2);

    // デフォルト値の確認
    expect(arena.posX[id1]).toBe(0.0);
    expect(arena.scaleX[id1]).toBe(1.0);
    expect(arena.scaleY[id1]).toBe(1.0);

    // 解放の確認
    arena.free(id1);
    expect(arena.activeCount).toBe(1);

    // 再確保時に空きリストから再利用されることの確認
    const id3 = arena.allocate();
    expect(id3).toBe(id1); // 再利用されたので id1 と同じインデックスになるはず
    expect(arena.activeCount).toBe(2);
  });

  test('Arena should return -1 when out of capacity', () => {
    const arena = new InstanceBufferArena(2);
    expect(arena.allocate()).toBe(0);
    expect(arena.allocate()).toBe(1);
    // 枯渇
    expect(arena.allocate()).toBe(-1);
  });

  test('Flyweight Sprite should modify arena arrays directly', () => {
    const arena = new InstanceBufferArena(10);
    const id = arena.allocate();

    // Flyweightハンドルの作成
    const sprite = new Sprite(id, arena);

    // Setter経由での代入
    sprite.x = 250.5;
    sprite.y = -10.0;
    sprite.scale = 2.0;
    sprite.setFlipX(true);
    sprite.setTint(0xff0000ff);

    // 実際の値がTypedArrayに直書きされているか検証
    expect(arena.posX[id]).toBe(250.5);
    expect(arena.posY[id]).toBe(-10.0);
    expect(arena.scaleX[id]).toBe(2.0);
    expect(arena.scaleY[id]).toBe(2.0);
    expect(arena.facing[id]).toBe(-1.0);
    expect(arena.tint[id]).toBe(0xff0000ff);

    // Getterの検証
    expect(sprite.x).toBe(250.5);
    expect(sprite.y).toBe(-10.0);
    expect(sprite.scale).toBe(2.0);
  });
});
