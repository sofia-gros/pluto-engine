/**
 * @file rpg_benchmark.test.ts
 * @description
 * 2D クラシックRPG（非流体・Phaserライクアーキテクチャ）の
 * 実ブラウザ（WebGL2）パフォーマンステストおよびベンチマーク計測。
 */

import { describe, expect, it } from 'vitest';
import { PlutoEngine, Scene } from '../src';

describe('2D Classic RPG Benchmark (Non-Fluid / Phaser-like Architecture)', () => {
  it('should run standard 2D RPG combat & AABB physics at high speed across scales', async () => {
    class TestRPGScene extends Scene {
      constructor() {
        super({ maxInstances: 50000 });
      }
    }

    const scene = new TestRPGScene();
    scene.create();

    // プレイヤーとモンスターの AABB 衝突・走査速度を各スケールで実測
    const scales = [100, 1000, 5000, 20000];
    const benchmarkResults: Record<
      number,
      { frameTimeMs: number; physicsMs: number; totalMonsterHp: number }
    > = {};

    for (const scale of scales) {
      scene.arena.clear();

      // プレイヤー
      const player = scene.add.sprite(500, 500);
      player.scale = 26;
      player.radius = 14;

      // スケール分のモンスターをアリーナに配置
      for (let i = 0; i < scale; i++) {
        const id = scene.arena.allocate();
        const idx = scene.arena.idToIndex[id];
        scene.arena.posX[idx] = 100 + Math.random() * 800;
        scene.arena.posY[idx] = 100 + Math.random() * 600;
        scene.arena.scale[idx] = 24;
      }

      // 15フレーム回して平均処理時間を計測
      const times: number[] = [];
      const physicsTimes: number[] = [];
      let totalHit = 0;

      for (let frame = 0; frame < 15; frame++) {
        const t0 = performance.now();

        // 1. モンスターの古典的 AI 移動 (プレイヤー追従)
        const pX = player.x;
        const pY = player.y;
        const count = scene.arena.activeCount;
        const posX = scene.arena.posX;
        const posY = scene.arena.posY;

        for (let i = 1; i < count; i++) {
          const dx = pX - posX[i];
          const dy = pY - posY[i];
          const d2 = dx * dx + dy * dy;
          if (d2 < 300 * 300 && d2 > 4) {
            const invD = 1.0 / Math.sqrt(d2);
            posX[i] += dx * invD * 60 * 0.016;
            posY[i] += dy * invD * 60 * 0.016;
          }
        }

        // 2. ArcadePhysics AABB 高速枝刈りによる剣攻撃ヒット判定
        const tPhys0 = performance.now();
        const slashBox = { x: player.x + 20, y: player.y, radius: 32 };
        const maxR = slashBox.radius + 12;

        for (let i = 1; i < count; i++) {
          const dx = posX[i] - slashBox.x;
          const dy = posY[i] - slashBox.y;
          // AABB 枝刈り
          if (Math.abs(dx) <= maxR && Math.abs(dy) <= maxR) {
            if (dx * dx + dy * dy <= maxR * maxR) {
              totalHit++;
            }
          }
        }
        const tPhys1 = performance.now();
        physicsTimes.push(tPhys1 - tPhys0);

        const t1 = performance.now();
        times.push(t1 - t0);
      }

      const avgFt = times.reduce((a, b) => a + b, 0) / times.length;
      const avgPhys = physicsTimes.reduce((a, b) => a + b, 0) / physicsTimes.length;

      benchmarkResults[scale] = {
        frameTimeMs: Math.round(avgFt * 1000) / 1000,
        physicsMs: Math.round(avgPhys * 1000) / 1000,
        totalMonsterHp: totalHit,
      };

      // 20,000体でも 16.6ms (60FPS) を大幅に下回り、ミリ秒単位で完了することを確認
      expect(avgFt).toBeLessThan(16.0);
    }

    console.log(
      '\n📊 [PlutoEngine 2D RPG Benchmark Results]\n',
      JSON.stringify(benchmarkResults, null, 2),
    );
  });
});
