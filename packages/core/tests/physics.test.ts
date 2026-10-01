import { describe, expect, it } from 'vitest';
import { Scene } from '../src/scene/Scene';

describe('ArcadePhysics (Phaser-like AABB Culling & Overlap/Collider)', () => {
  it('Phaser-like API で overlap を登録し、AABB枝刈りにより近傍エンティティのみコールバックが発火すること', () => {
    const scene = new Scene({ maxInstances: 1000 });

    // 1000体のエンティティを生成（遠くに配置）
    for (let i = 0; i < 100; i++) {
      const id = scene.arena.allocate();
      const idx = scene.arena.idToIndex[id];
      scene.arena.setPosX(idx, 1000 + i * 10);
      scene.arena.setPosY(idx, 1000 + i * 10);
      scene.arena.setFrameSize(idx, 20, 20, false);
    }

    // プレイヤーの近くに2体だけ配置
    const nearId1 = scene.arena.allocate();
    const nearIdx1 = scene.arena.idToIndex[nearId1];
    scene.arena.setPosX(nearIdx1, 50);
    scene.arena.setPosY(nearIdx1, 50);
    scene.arena.setFrameSize(nearIdx1, 20, 20, false);

    const nearId2 = scene.arena.allocate();
    const nearIdx2 = scene.arena.idToIndex[nearId2];
    scene.arena.setPosX(nearIdx2, 55);
    scene.arena.setPosY(nearIdx2, 50);
    scene.arena.setFrameSize(nearIdx2, 20, 20, false);

    // プレイヤー定義
    const player = {
      x: 50,
      y: 50,
      radius: 16,
    };

    const hitIndices: number[] = [];

    // Phaser-like API で overlap 登録 (単一 vs Arena)
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

  it('配列 targets (bullets: Sprite[]) と SoA アリーナの overlap 判定が正しく動作すること', () => {
    const scene = new Scene({ maxInstances: 500 });

    // 敵を配置
    const enemyId = scene.arena.allocate();
    const enemyIdx = scene.arena.idToIndex[enemyId];
    scene.arena.setPosX(enemyIdx, 100);
    scene.arena.setPosY(enemyIdx, 100);
    scene.arena.setFrameSize(enemyIdx, 20, 20, false);

    // 弾丸配列 (Sprite / PhysicsBody の配列)
    const bullets = [
      { x: 100, y: 100, radius: 8, name: 'bullet1' }, // ヒット
      { x: 500, y: 500, radius: 8, name: 'bullet2' }, // 遠い (スキップ)
    ];

    const hitPairs: Array<{ bullet: any; enemy: number }> = [];

    // 配列 vs Arena
    scene.physics.add.overlap(bullets, scene.arena, (bullet, eIdx) => {
      hitPairs.push({ bullet, enemy: eIdx });
    });

    scene.physics.collide();

    expect(hitPairs.length).toBe(1);
    expect(hitPairs[0].bullet.name).toBe('bullet1');
    expect(hitPairs[0].enemy).toBe(enemyIdx);
  });

  it('TypedArray バッファ (PhysicsBuffer) と SoA アリーナの overlap 判定が正しく動作すること', () => {
    const scene = new Scene({ maxInstances: 500 });

    const enemyId = scene.arena.allocate();
    const enemyIdx = scene.arena.idToIndex[enemyId];
    scene.arena.setPosX(enemyIdx, 200);
    scene.arena.setPosY(enemyIdx, 200);
    scene.arena.setFrameSize(enemyIdx, 20, 20, false);

    // 弾丸の SoA TypedArray バッファ
    const bulletBuffer = {
      posX: new Float32Array([200, 800]),
      posY: new Float32Array([200, 800]),
      count: 2,
      radius: 10,
    };

    const hits: Array<{ bulletIdx: number; enemyIdx: number }> = [];

    // Buffer vs Arena
    scene.physics.add.overlap(bulletBuffer, scene.arena, (bIdx, eIdx) => {
      hits.push({ bulletIdx: bIdx, enemyIdx: eIdx });
    });

    scene.physics.collide();

    expect(hits.length).toBe(1);
    expect(hits[0].bulletIdx).toBe(0);
    expect(hits[0].enemyIdx).toBe(enemyIdx);
  });

  it('collider 登録時に AABB 枝刈り + 押し出し解決が正しく行われること', () => {
    const scene = new Scene({ maxInstances: 100 });

    const enemyId = scene.arena.allocate();
    const enemyIdx = scene.arena.idToIndex[enemyId];
    scene.arena.setPosX(enemyIdx, 50);
    scene.arena.setPosY(enemyIdx, 50);
    scene.arena.setFrameSize(enemyIdx, 20, 20, false);

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
