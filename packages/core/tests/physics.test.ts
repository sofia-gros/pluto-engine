import { describe, expect, it } from 'vitest';
import { Scene } from '../src/scene/Scene';

describe('ArcadePhysics (Phaser-like AABB Culling & Overlap/Collider)', () => {
  it('Phaser-like API で overlap を登録し、AABB枝刈りにより近傍エンティティのみコールバックが発火すること', () => {
    const scene = new Scene({ maxInstances: 1000 });

    // 1000体のエンティティを生成（遠くに配置）
    for (let i = 0; i < 100; i++) {
      const id = scene.arena.allocate();
      const idx = scene.arena.idToIndex[id];
      scene.arena.posX[idx] = 1000 + i * 10;
      scene.arena.posY[idx] = 1000 + i * 10;
      scene.arena.scale[idx] = 20;
    }

    // プレイヤーの近くに2体だけ配置
    const nearId1 = scene.arena.allocate();
    const nearIdx1 = scene.arena.idToIndex[nearId1];
    scene.arena.posX[nearIdx1] = 50;
    scene.arena.posY[nearIdx1] = 50;
    scene.arena.scale[nearIdx1] = 20;

    const nearId2 = scene.arena.allocate();
    const nearIdx2 = scene.arena.idToIndex[nearId2];
    scene.arena.posX[nearIdx2] = 55;
    scene.arena.posY[nearIdx2] = 50;
    scene.arena.scale[nearIdx2] = 20;

    // プレイヤー定義
    const player = {
      x: 50,
      y: 50,
      radius: 16,
    };

    const hitIndices: number[] = [];

    // Phaser-like API で overlap 登録
    scene.physics.add.overlap(player, scene.arena, (source, entityIdx) => {
      expect(source).toBe(player);
      hitIndices.push(entityIdx);
    });

    // 判定実行
    scene.physics.collide();

    // 近傍の2体のみが発火し、遠くの100体は AABB 枝刈りでスキップされること
    expect(hitIndices.length).toBe(2);
    expect(hitIndices).toContain(nearIdx1);
    expect(hitIndices).toContain(nearIdx2);
  });

  it('collider 登録時に AABB 枝刈り + 押し出し解決が正しく行われること', () => {
    const scene = new Scene({ maxInstances: 100 });

    const enemyId = scene.arena.allocate();
    const enemyIdx = scene.arena.idToIndex[enemyId];
    scene.arena.posX[enemyIdx] = 50;
    scene.arena.posY[enemyIdx] = 50;
    scene.arena.scale[enemyIdx] = 20;

    const player = {
      x: 45,
      y: 50,
      radius: 10,
    };

    let collided = false;
    scene.physics.add.collider(player, scene.arena, () => {
      collided = true;
    });

    scene.physics.collide();

    expect(collided).toBe(true);
    // 敵が押し出されて X 座標が増加していること
    expect(scene.arena.posX[enemyIdx]).toBeGreaterThan(50);
  });
});
