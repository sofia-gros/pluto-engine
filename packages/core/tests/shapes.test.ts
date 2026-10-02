import { describe, expect, it } from 'vitest';
import { SHAPE_PARAMS, Scene, ShapeKind } from '../src/index';

function makeScene(): Scene {
  return new Scene({ maxInstances: 256 });
}

describe('静的シェイプ (Phase 6 / SoA + canvas ベイク)', () => {
  it('矩形が生成され SoA に種別と寸法が入る', () => {
    const scene = makeScene();
    const id = scene.addRectangle(10, 20, 32, 16, 0xff0000, 1);
    expect(id).toBe(0);
    expect(scene.shapes.count).toBe(1);
    expect(scene.shapes.getKind(id)).toBe(ShapeKind.Rectangle);

    const out = new Float32Array(SHAPE_PARAMS);
    expect(scene.shapes.getParams(id, out)).toBe(SHAPE_PARAMS);
    expect(out[0]).toBe(32);
    expect(out[1]).toBe(16);
  });

  it('生成位置がアarena に反映される', () => {
    const scene = makeScene();
    const id = scene.addCircle(100, 200, 12);
    const arenaId = scene.shapes.ids[id];
    const dense = scene.arena.idToIndex[arenaId];
    expect(scene.arena.posX[dense]).toBe(100);
    expect(scene.arena.posY[dense]).toBe(200);
    // 円のフレーム寸法は直径
    expect(scene.arena.frameWidth[dense]).toBe(24);
    expect(scene.arena.frameHeight[dense]).toBe(24);
  });

  it('同寸法の形状はテクスチャを共有する（ベイクが 1 回だけ）', () => {
    const scene = makeScene();
    const a = scene.addRectangle(0, 0, 32, 16);
    const b = scene.addRectangle(64, 0, 32, 16);
    // 形状としては別インスタンス
    expect(a).not.toBe(b);
    // 参照するテクスチャは同じ
    const arenaA = scene.arena.idToIndex[scene.shapes.ids[a]];
    const arenaB = scene.arena.idToIndex[scene.shapes.ids[b]];
    expect(scene.arena.assetRef[arenaA]).toBe(scene.arena.assetRef[arenaB]);
  });

  it('異なる寸法は別テクスチャになる', () => {
    const scene = makeScene();
    const a = scene.addRectangle(0, 0, 32, 16);
    const b = scene.addRectangle(0, 0, 64, 16);
    const arenaA = scene.arena.idToIndex[scene.shapes.ids[a]];
    const arenaB = scene.arena.idToIndex[scene.shapes.ids[b]];
    expect(scene.arena.assetRef[arenaA]).not.toBe(scene.arena.assetRef[arenaB]);
  });

  it('色は tint 経由で反映される', () => {
    const scene = makeScene();
    const id = scene.addRectangle(0, 0, 8, 8, 0x00ff00, 0.5);
    const dense = scene.arena.idToIndex[scene.shapes.ids[id]];
    const tint = scene.arena.tint[dense];
    // 上位 8bit は alpha
    expect((tint >>> 24) & 0xff).toBe(128);
    // 下位 24bit は色
    expect(tint & 0xffffff).toBe(0x00ff00);
  });

  it('星形は param2 に角数を持つ', () => {
    const scene = makeScene();
    const id = scene.addStar(0, 0, 6, 16);
    const out = new Float32Array(SHAPE_PARAMS);
    scene.shapes.getParams(id, out);
    expect(scene.shapes.getKind(id)).toBe(ShapeKind.Star);
    expect(out[2]).toBe(6);
  });

  it('全形状種別が生成できる', () => {
    const scene = makeScene();
    const ids = [
      scene.addRectangle(0, 0, 8, 8),
      scene.addCircle(0, 0, 4),
      scene.addEllipse(0, 0, 10, 6),
      scene.addTriangle(0, 0, 8, 8),
      scene.addStar(0, 0, 5, 8),
      scene.addRoundRect(0, 0, 20, 10, 3),
      scene.addLine(0, 0, 16, 2),
      scene.addGrid(0, 0, 8, 8, 3, 1),
      scene.addIsoTriangle(0, 0, 8, 8),
      scene.addIsoDiamond(0, 0, 8, 8),
      scene.addQuad(0, 0, 8, 8, 2),
      scene.addArc(0, 0, 6, 2),
    ];
    expect(ids.every((id) => id >= 0)).toBe(true);
    expect(scene.shapes.count).toBe(12);
    // 全てにテクスチャが乗っている（null でない）
    for (const id of ids) {
      const dense = scene.arena.idToIndex[scene.shapes.ids[id]];
      expect(scene.arena.assetRef[dense]).not.toBeNull();
      expect(scene.arena.frameWidth[dense]).toBeGreaterThan(0);
      expect(scene.arena.frameHeight[dense]).toBeGreaterThan(0);
    }
  });

  it('remove でアarena のスロットが解放される', () => {
    const scene = makeScene();
    const id = scene.addRectangle(0, 0, 8, 8);
    const before = scene.arena.activeCount;
    expect(scene.shapes.remove(id)).toBe(true);
    expect(scene.arena.activeCount).toBe(before - 1);
    expect(scene.shapes.remove(id)).toBe(true); // 二度呼んでも例外は出ない
  });

  it('範囲外の shapeId アクセスは安全に 0 / -1 を返す', () => {
    const scene = makeScene();
    const out = new Float32Array(SHAPE_PARAMS);
    expect(scene.shapes.getKind(999)).toBe(-1);
    expect(scene.shapes.getParams(999, out)).toBe(0);
    expect(scene.shapes.remove(999)).toBe(false);
  });

  it('add.graphics (動的 command buffer) は未実装である (E-02)', () => {
    const scene = makeScene();
    // 動的 command buffer は却下です。存在しないことを確認します。
    expect((scene.add as unknown as Record<string, unknown>).graphics).toBeUndefined();
  });
});
