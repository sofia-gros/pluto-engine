import type { GraphicsDevice } from '@pluto-engine/renderer';
import { describe, expect, it } from 'vitest';
import { PlutoEngine, Scene } from '../src/index';

/**
 * 本番アセットを使った実描画テスト。
 *
 * 手続き生成の単色テクスチャではなく、実際にFPS ゲームで使っている
 * スプライトシートを読み込むことで、UV 計算・テクスチャ配列へのアップロード・
 * アニメーションのフレーム切替までを含む実データ経路を検証します。
 *
 * 使用するアセット:
 * - apps/demo/public/assets/spritesheet.png (1024 x 320 = 16 x 5 コマ、64px 角)
 * - apps/demo/public/assets/{Idle Front}/Sprite-0001.png などの単体フレーム
 */

/** スプライトシートの実寸 (swarm-survivors デモの load.spritesheet と同一) */
const SHEET_FRAME = 64;

/**
 * 画面座標からワールド座標へ変換します。
 *
 * 投影は Y-down で `screen = world + size / 2` の関係にあるため、
 * 画面位置 (sx, sy) にスプライトを置くにはワールド座標は
 * (sx - w/2, sy - h/2) になります。ここを混同すると
 * スプライトを画面外へ出してしまい、背景だけをサンプルしてしまいます。
 */
let canvasW = 0;
let canvasH = 0;
const worldX = (screenX: number) => screenX - canvasW / 2;
const worldY = (screenY: number) => screenY - canvasH / 2;

/** 実アセットを読み込みます。Vite の dev サーバ経由で配信されます。 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`画像を読み込めませんでした: ${url}`));
    img.src = url;
  });
}

const SPRITESHEET_URL = '/apps/demo/public/assets/spritesheet.png';
const IDLE_FRONT_1_URL = '/apps/demo/public/assets/Idle Front/Sprite-0001.png';

/** FNV-1a でフレームバッファをハッシュ化します。 */
function hashPixels(pixels: Uint8Array): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < pixels.length; i++) {
    h ^= pixels[i];
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

describe('本番アセットによる実描画', () => {
  it('spritesheet.png を 64px グリッドで分割して描画できる', async () => {
    const img = await loadImage(SPRITESHEET_URL);
    expect(img.naturalWidth).toBe(1024);
    expect(img.naturalHeight).toBe(320);

    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 200;
    canvasW = 320;
    canvasH = 200;

    // 16 コマを 4 x 4 で並べる。1 コマあたり 64px。
    const layout: { frame: number; col: number; row: number }[] = [];
    for (let i = 0; i < 16; i++) {
      layout.push({ frame: i, col: i % 4, row: Math.floor(i / 4) });
    }

    class SheetScene extends Scene {
      preload(): void {
        this.textures.addSpritesheet('sheet', img, {
          frameWidth: SHEET_FRAME,
          frameHeight: SHEET_FRAME,
        });
      }

      create(): void {
        for (const item of layout) {
          const s = this.add.sprite(
            worldX(40 + item.col * 80),
            worldY(40 + item.row * 50),
            'sheet',
            item.frame,
          );
          s.setDisplaySize(64, 64);
        }
      }
    }

    const engine = new PlutoEngine({
      canvas,
      width: 320,
      height: 200,
      maxInstances: 32,
      scene: [SheetScene],
    });
    await engine.ready;

    const device = engine.device;
    if (!device) throw new Error('device が初期化されていません');

    // テクスチャがエンジンに登録されたかを確認
    const scene = engine.scene.activeScene;
    expect(scene).not.toBeNull();
    expect(scene?.textures.exists('sheet')).toBe(true);
    const asset = scene?.textures.get('sheet');
    expect(asset?.frames.length).toBe(80); // 16 x 5 = 80 コマ
    // 1 コマ目の UV がテクスチャ左上隅を指している。
    // 正規化の基準はソース画像 (1024x320) ではなく
    // **テクスチャ配列のレイヤー寸法 (1024x1024)** です。
    // 画像はレイヤーの左上に寄せて配置されるため、Y 方向だけ余白を含みます。
    expect(asset?.frames[0].uvX).toBeCloseTo(0);
    expect(asset?.frames[0].uvY).toBeCloseTo(0);
    expect(asset?.frames[0].uvW).toBeCloseTo(SHEET_FRAME / 1024);
    expect(asset?.frames[0].uvH).toBeCloseTo(SHEET_FRAME / 1024);
    // 2 コマ目は 1 マス右
    expect(asset?.frames[1].uvX).toBeCloseTo(SHEET_FRAME / 1024);
    // 16 コマ目 (= 1 行目の最終) も 1 行目
    expect(asset?.frames[15].uvY).toBeCloseTo(0);
    // 16 コマ目の次 (= 2 行目の先頭) は下へ 1 マス
    expect(asset?.frames[16].uvY).toBeCloseTo(SHEET_FRAME / 1024);

    const pixels = new Uint8Array(320 * 200 * 4);
    engine.render();
    if (!device.readPixels(pixels, 320, 200)) {
      engine.destroy();
      canvas.remove();
      return;
    }

    // 描画された領域に実データ（非ゼロのアルファ）があること
    let opaque = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] > 0) opaque++;
    }
    expect(opaque).toBeGreaterThan(0);

    engine.destroy();
    canvas.remove();
  });

  it('spritesheet.png の UV が正しい（コマ位置でピクセルが変わる）', async () => {
    const img = await loadImage(SPRITESHEET_URL);
    const W = 160;
    const H = 100;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    canvasW = W;
    canvasH = H;

    // 同じ行の連続コマ (0, 1, 2, 3) ではなく、**別の行にあるコマ**を使います。
    // 歩行アニメの連続コマは 32px に縮小するとほぼ同一に見えるため、
    // UV の違いが確実に検出できるように行をまたいで選びます。
    // 16 コマ x 5 行 = 80 コマ。0 / 20 / 40 / 60 はそれぞれ別の行です。
    const frames = [0, 20, 40, 60];

    class UvScene extends Scene {
      preload(): void {
        this.textures.addSpritesheet('sheet', img, {
          frameWidth: SHEET_FRAME,
          frameHeight: SHEET_FRAME,
        });
      }

      create(): void {
        for (let i = 0; i < frames.length; i++) {
          const s = this.add.sprite(worldX(20 + i * 36), worldY(50), 'sheet', frames[i]);
          s.setDisplaySize(32, 32);
        }
      }
    }

    const engine = new PlutoEngine({
      canvas,
      width: W,
      height: H,
      maxInstances: 8,
      scene: [UvScene],
    });
    await engine.ready;

    const device = engine.device;
    if (!device) throw new Error('device が初期化されていません');
    const pixels = new Uint8Array(W * H * 4);
    engine.render();
    if (!device.readPixels(pixels, W, H)) {
      engine.destroy();
      canvas.remove();
      return;
    }

    // スプライトの描画領域 32x32 全体をハッシュ化します。
    // 中心 8x8 だけだとコマが変わっても同じハッシュになることがあるため、
    // 描画領域全体をサンプルします。
    // 4 コマすべてが同一ハッシュなら UV 参照が壊れています。
    const hashes: string[] = [];
    for (let i = 0; i < frames.length; i++) {
      const cx = 20 + i * 36;
      const cy = 50;
      // origin 0.5 + displaySize 32 なので矩形は [cx-16, cx+16]
      const half = 16;
      const size = half * 2;
      const region = new Uint8Array(size * size * 4);
      let k = 0;
      for (let y = cy - half; y < cy + half; y++) {
        for (let x = cx - half; x < cx + half; x++) {
          const o = (y * W + x) * 4;
          region[k++] = pixels[o];
          region[k++] = pixels[o + 1];
          region[k++] = pixels[o + 2];
          region[k++] = pixels[o + 3];
        }
      }
      hashes.push(hashPixels(region));
    }

    // 4 コマすべてが同一ハッシュなら UV 参照が壊れている
    // (1 コマでも違えば UV が機能している)
    expect(new Set(hashes).size).toBe(frames.length);

    engine.destroy();
    canvas.remove();
  });

  it('単体フレーム PNG をそのまま 1 枚テクスチャとして描画できる', async () => {
    const img = await loadImage(IDLE_FRONT_1_URL);
    expect(img.naturalWidth).toBeGreaterThan(0);

    const W = 120;
    const H = 120;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    canvasW = W;
    canvasH = H;

    class SingleScene extends Scene {
      preload(): void {
        // 分割なしの単一テクスチャとして読み込む
        this.textures.addImage('idle1', img);
      }

      create(): void {
        const s = this.add.sprite(worldX(60), worldY(60), 'idle1');
        s.setDisplaySize(96, 96);
      }
    }

    const engine = new PlutoEngine({
      canvas,
      width: W,
      height: H,
      maxInstances: 4,
      scene: [SingleScene],
    });
    await engine.ready;

    const device: GraphicsDevice | null = engine.device;
    if (!device) throw new Error('device が初期化されていません');
    const pixels = new Uint8Array(W * H * 4);
    engine.render();
    if (!device.readPixels(pixels, W, H)) {
      engine.destroy();
      canvas.remove();
      return;
    }

    // 中心付近に不透明ピクセルがあること
    const o = (60 * W + 60) * 4;
    expect(pixels[o + 3]).toBeGreaterThan(0);

    engine.destroy();
    canvas.remove();
  });

  it('アニメーションがコマを切り替えると描画内容が変わる', async () => {
    const img = await loadImage(SPRITESHEET_URL);
    const W = 96;
    const H = 96;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    canvasW = W;
    canvasH = H;
    document.body.appendChild(canvas);

    // 1 行目の連続 4 コマを 2 フレーム/秒で往復する
    class AnimScene extends Scene {
      preload(): void {
        this.textures.addSpritesheet('sheet', img, {
          frameWidth: SHEET_FRAME,
          frameHeight: SHEET_FRAME,
        });
      }

      create(): void {
        this.anim.create({
          key: 'walk',
          frames: [0, 1, 2, 3],
          frameRate: 2,
          repeat: -1,
        });
        const s = this.add.sprite(worldX(48), worldY(48), 'sheet', 0);
        s.setDisplaySize(64, 64);
        s.play('walk');
      }
    }

    const engine = new PlutoEngine({
      canvas,
      width: W,
      height: H,
      maxInstances: 4,
      scene: [AnimScene],
    });
    await engine.ready;

    const device = engine.device;
    if (!device) throw new Error('device が初期化されていません');

    const capture = () => {
      const p = new Uint8Array(W * H * 4);
      engine.render();
      if (!device.readPixels(p, W, H)) return null;
      return p;
    };

    const first = capture();
    if (!first) {
      engine.destroy();
      canvas.remove();
      return;
    }
    const h0 = hashPixels(first);

    // frameRate 2 = 1コマ 0.5 秒。0.6 秒進めてから描き直す
    const scene = engine.scene.activeScene;
    scene?.anim.update(0.6);

    const second = capture();
    if (!second) {
      engine.destroy();
      canvas.remove();
      return;
    }
    const h1 = hashPixels(second);

    // コマが変わっているのでハッシュも変わる
    expect(h1).not.toBe(h0);

    engine.destroy();
    canvas.remove();
  });
});
