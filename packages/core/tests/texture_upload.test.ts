/**
 * @file texture_upload.test.ts
 * @description
 * GPU テクスチャ転送 (Texture2DArray) とスプライト描画の単体・統合テスト。
 * Canvas および Image オブジェクトが GPU に正しく転送され、
 * Sprite の UV 座標とフレームインデックスが設定されることを検証します。
 */

import { describe, expect, it } from 'vitest';
import { PlutoEngine, Scene } from '../src';

describe('Texture Management & GPU Texture2DArray Upload', () => {
  it('should upload procedural canvas and spritesheets to GPU and assign frame UVs to Sprite', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);

    class TextureTestScene extends Scene {
      preload() {
        // 1. 動的 Canvas テクスチャの生成と GPU 転送 (64x64)
        this.textures.createCanvasTexture('hero', 64, 64, (ctx) => {
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(0, 0, 64, 64);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(16, 16, 32, 32);
        });

        // 2. スプライトシートテクスチャの生成と GPU 転送 (128x64, 32x32フレーム = 4x2=8フレーム)
        this.textures.createCanvasTexture(
          'monsters',
          128,
          64,
          (ctx) => {
            for (let i = 0; i < 8; i++) {
              const x = (i % 4) * 32;
              const y = Math.floor(i / 4) * 32;
              ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#22c55e';
              ctx.fillRect(x, y, 32, 32);
            }
          },
          { frameWidth: 32, frameHeight: 32 },
        );
      }

      create() {
        // 単一テクスチャのスプライト生成
        const heroSprite = this.add.sprite(100, 100, 'hero');
        expect(heroSprite).toBeDefined();
        expect(heroSprite.frameIdx).toBeGreaterThan(0);
        expect(heroSprite.uvW).toBeCloseTo(64 / 2048, 4);
        expect(heroSprite.uvH).toBeCloseTo(64 / 2048, 4);

        // スプライトシートの特定フレーム (Frame 3)
        const monsterSprite = this.add.sprite(200, 200, 'monsters', 3);
        expect(monsterSprite).toBeDefined();
        expect(monsterSprite.frameIdx).toBeGreaterThan(0);
        expect(monsterSprite.frame).toBe(3);
        expect(monsterSprite.uvW).toBeCloseTo(32 / 2048, 4);
        expect(monsterSprite.uvH).toBeCloseTo(32 / 2048, 4);

        // フレーム切り替え
        monsterSprite.setFrame(5);
        expect(monsterSprite.frame).toBe(5);

        // 水平反転
        monsterSprite.setFlipX(true);
        expect(monsterSprite.facing).toBe(-1.0);

        // Tint 設定 (0xFF00FF)
        heroSprite.setTint(0xff00ff);
        const idx = this.arena.idToIndex[heroSprite.id];
        expect(this.arena.tint[idx]).toBeDefined();
      }
    }

    const engine = new PlutoEngine({
      canvas,
      width: 800,
      height: 600,
      maxInstances: 1000,
      scene: [TextureTestScene],
    });

    await engine.ready;
    expect(engine).toBeDefined();

    engine.destroy();
  });
});
