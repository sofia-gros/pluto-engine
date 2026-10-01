/**
 * @file render_golden.test.ts
 * @description
 * 描画結果の golden テスト（回帰検出用）。
 *
 * ## なぜこのテストが必要か
 *
 * 既存のテストは.SoA 配列の中身やシェーダーのコンパイル成否を
 * 検証しますが、以下のような**実機でのみ現れる不具合**は検出できません。
 *
 *  - 画面が真っ暗になる（クリアやブレンドの破壊）
 *  - スプライトシートのフレームカットがずれる（UV / レイヤーずれ）
 *  - tint が効かない・全部同じ色になる
 *  - `setVisible(false)` が効かない（見える/見えないの反転）
 *  - 頂点属性のオフセットが 1 つぶんズレる（vec4 ペアキングの事故）
 *
 * これらはすべて「レンダリング結果」を見ないと気づけません。
 * そこで **実際のフレームバッファを読み戻し**、
 * 2 種類の検証を併用します。
 *
 *  1. **セマンティック検証** — 想定ピクセル値を 1 ピクセルずつ照合する。
 *     失敗時に「どのスプライトのどの位置に何が入ったか」が分かります。
 *  2. **Golden チェックサム** — フレームバッファ全体の FNV-1a を
 *     固定値と比較する。上の検証で見落としていた変化も 1 ピクセルでも検出します。
 *
 * ## 決定性について
 *
 * `Math.random` や時間依存のアニメーションは一切使いません。
 * カラーパレット・座標・スケールはすべてリテラルです。
 * そのため golden は環境（GPU 実装）だけが結果に影響します。
 */

import { describe, expect, it } from 'vitest';
import { PlutoEngine, Scene } from '../src';

/** 16 タイルのスプライトシートに塗る固定パレット（すべて完全不透明） */
const PALETTE: readonly number[] = [
  0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff, 0x808080, 0xff8800,
  0x88ff00, 0x0088ff, 0xff0088, 0x884400, 0x4488cc, 0x22aa77, 0xdddddd,
];

/** 4x4 グリッド（列 c、行 r）のスプライト中心のスクリーン座標 */
const CANVAS_W = 256;
const CANVAS_H = 192;
const TILE = 16;
/**
 * スプライトの画面上の辺長（ピクセル）。
 *
 * 共有 Quad は **単位サイズ**（頂点座標 ±0.5）です。
 * 頂点シェーダが `vertexPos * scale` を計算するため、
 * `scale = 1` は「1 ピクセル」を意味します。
 * つまり 16x16 ピクセルで描画したいなら `scale = 16` です。
 * （`Scene.add.sprite` はフレーム寸法から scale を補完しないため、
 *  利用側が明示的に指定する必要があります）
 */
const SPRITE_PX = 16;
const CELL_W = 64;
const CELL_H = 48;

function screenCenterX(col: number): number {
  return 32 + col * CELL_W;
}
function screenCenterY(row: number): number {
  return 24 + row * CELL_H;
}

/**
 * スクリーン座標をワールド座標へ変換します。
 *
 * `PlutoEngine._writeProjection` は
 *   sx =  (2 / w) * zoom、sy = -(2 / h) * zoom
 * をもとに射影行列を組み立てます。zoom = 1 のとき素朴には
 * 「ワールド原点が画面中央」と読めますが、sy が負のため
 * 実際には **ワールド Y は画面上向きではなく下向き** に伸びます
 * （Phaser 互換の Y-down ワールド）。
 *
 * したがって:
 *   screen_x = world_x + w / 2
 *   screen_y = world_y + h / 2
 */
function worldXFromScreen(px: number): number {
  return px - CANVAS_W * 0.5;
}
function worldYFromScreen(py: number): number {
  return py - CANVAS_H * 0.5;
}

/** 独自解像度のシーン用に、ワールド原点が画面中央になる変換 */
function worldX(px: number): number {
  return px - 100;
}
function worldY(py: number): number {
  return py - 50;
}

/** FNV-1a 32bit。フレームバッファ全体の golden 判定に使います。 */
function fnv1a(bytes: Uint8Array): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i++) {
    hash ^= bytes[i];
    // 32bit での乗算（Math.imul で精度を落とす）
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/** 背景色（`PlutoEngine.render` が clear(0.01, 0.02, 0.05, 1.0) する） */
const BACKGROUND: readonly [number, number, number] = [3, 5, 13];

/**
 * 16 タイル描画のフレームバッファ全体ハッシュ（golden）。
 *
 * 256x192 / 4x4 グリッド / 16x16 タイルを scale 2 で描画した構成の決定的ハッシュです。
 * ここでのレイアウト（解像度・色・パレット・スケール・カメラ倍率）を
 * 変更した場合は、この定数も更新してください。
 */
const GOLDEN_SHEET_HASH = 'a41211c5';

function rgbaOf(hex: number): [number, number, number] {
  return [(hex >> 16) & 0xff, (hex >> 8) & 0xff, hex & 0xff];
}

/**
 * 16 タイルのスプライトシートと 16 体のスプライトを deterministic に構築します。
 * 各スプライトは自分のタイル番号（= フレーム番号）の色をそのまま表示します。
 * これにより「フレームカットがずれている」場合は色が違うので一意に検出できます。
 */
function createSheetScene(): typeof Scene {
  return class SheetScene extends Scene {
    preload(): void {
      this.textures.createCanvasTexture(
        'sheet',
        64,
        64,
        (ctx) => {
          for (let i = 0; i < 16; i++) {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const [r, g, b] = rgbaOf(PALETTE[i]);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(col * TILE, row * TILE, TILE, TILE);
          }
        },
        { frameWidth: TILE, frameHeight: TILE },
      );
    }

    create(): void {
      for (let i = 0; i < 16; i++) {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const sprite = this.add.sprite(
          worldXFromScreen(screenCenterX(col)),
          worldYFromScreen(screenCenterY(row)),
          'sheet',
          i,
        );
        // scale は倍率です。scale = 1 ならフレーム (16px) そのまま。
        sprite.setDisplaySize(SPRITE_PX, SPRITE_PX);
      }
    }
  };
}

describe('render golden — 実描画の回帰検出', () => {
  it('16 タイルのスプライトが正しい色で正しい位置に描画される', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    document.body.appendChild(canvas);

    const engine = new PlutoEngine({
      canvas,
      width: CANVAS_W,
      height: CANVAS_H,
      maxInstances: 64,
      scene: [createSheetScene()],
    });
    await engine.ready;

    const device = engine.device;
    if (!device) throw new Error('device が初期化されていません');

    // 描画結果を読み戻せるバックエンド（WebGL2）のみ検証します。
    const pixels = new Uint8Array(CANVAS_W * CANVAS_H * 4);

    const sample = (px: number, py: number): [number, number, number] => {
      const o = (py * CANVAS_W + px) * 4;
      return [pixels[o], pixels[o + 1], pixels[o + 2]];
    };
    const expectColor = (px: number, py: number, label: string, hex: number) => {
      const [r, g, b] = sample(px, py);
      expect(`${r},${g},${b}`, label).toBe(rgbaOf(hex).join(','));
    };

    /**
     * `readPixels` は「合成される前のバックバッファ」を読むため、
     * **同一タスク内で draw した直後**に呼ぶ必要があります。
     * rAF を待つと `preserveDrawingBuffer: false` の既定では
     * バッファ内容が undefined になり、真っ黒 (0,0,0,0) が返ります。
     * そのため `engine.render()` を同期的に呼んでから読み戻します。
     */
    engine.render();
    if (!device.readPixels(pixels, CANVAS_W, CANVAS_H)) {
      console.warn('[golden] このバックエンドは readPixels 未対応のため検証をスキップします。');
      engine.destroy();
      canvas.remove();
      return;
    }

    // 1. 各スプライトの中心が「そのフレームの色」であること
    //    → フレームカットずれ・属性オフセットずれを検出
    for (let i = 0; i < 16; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      expectColor(
        screenCenterX(col),
        screenCenterY(row),
        `スプライト #${i} (フレーム ${i}) の中心色`,
        PALETTE[i],
      );
    }

    // 2. スプライトの四隅も同じ色であること（クワッド頂点位置の検証）
    const half = SPRITE_PX / 2 - 1;
    for (let i = 0; i < 16; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const cx = screenCenterX(col);
      const cy = screenCenterY(row);
      for (const [dx, dy, label] of [
        [-half, -half, '左上'],
        [half, -half, '右上'],
        [-half, half, '左下'],
        [half, half, '右下'],
      ] as const) {
        expectColor(cx + dx, cy + dy, `スプライト #${i} の${label}`, PALETTE[i]);
      }
    }

    // 3. グリッド間（スプライトが存在しない場所）が背景色であること
    //    → 描画範囲の破れ・ 余計な塗り（clear の破壊）を検出
    for (let i = 0; i < 16; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      // 各セルの四隅（スプライトの外側）
      const gapX = screenCenterX(col) + CELL_W / 2 - 4;
      const gapY = screenCenterY(row) + CELL_H / 2 - 4;
      const [r, g, b] = sample(gapX, gapY);
      expect(`${r},${g},${b}`, `スプライト #${i} の右下外側（背景であるべき）`).toBe(
        BACKGROUND.join(','),
      );
    }

    // 4. 画面が「暗く」いないこと（描画が生きていることの総量チェック）
    const nonBackground = countNonBackground(pixels, BACKGROUND);
    // 16 体 × 16x16 = 4096 ピクセルがスプライト前提値
    expect(nonBackground, '背景色以外のピクセル数').toBeGreaterThan(4000);

    // 5. Golden チェックサム
    //    セマンティック検証が見落としていた 1 ピクセルも落ちます。
    //    レイアウト（解像度・タイル数・配置・スケール）を変えると
    //    正当な変更でも落ちます。その場合はこの定数を更新してください。
    const golden = fnv1a(pixels);
    expect(golden, 'フレームバッファ全体の golden チェックサム').toBe(GOLDEN_SHEET_HASH);
    console.log('[golden] sheet framebuffer hash =', golden);

    engine.destroy();
    canvas.remove();
  });

  it('tint / setVisible(false) / alpha が反映される', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    document.body.appendChild(canvas);

    class TintScene extends Scene {
      preload(): void {
        // 白一色の 16x16 タイル（tint の乗算を検証するため）
        this.textures.createCanvasTexture(
          'white',
          16,
          16,
          (ctx) => {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 16, 16);
          },
          { frameWidth: 16, frameHeight: 16 },
        );
        // 非表示テスト用に黒一色
        this.textures.createCanvasTexture(
          'black',
          16,
          16,
          (ctx) => {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 16, 16);
          },
          { frameWidth: 16, frameHeight: 16 },
        );
      }

      create(): void {
        // 表示サイズをピクセル数で指定します (scale は倍率)。
        const S = 32;
        // 0: tint 未設定（白）
        this.add.sprite(worldXFromScreen(40), worldYFromScreen(40), 'white').setDisplaySize(S, S);
        // 1: 赤の tint
        const tinted = this.add.sprite(worldXFromScreen(104), worldYFromScreen(40), 'white');
        tinted.setDisplaySize(S, S);
        tinted.setTint(0xff0000);
        // 2: 半透明 (alpha 0.5)
        const faded = this.add.sprite(worldXFromScreen(168), worldYFromScreen(40), 'white');
        faded.setDisplaySize(S, S);
        faded.setAlpha(0.5);
        // 3: setVisible(false) — 描画されないので背景色になる
        const hidden = this.add.sprite(worldXFromScreen(232), worldYFromScreen(40), 'black');
        hidden.setDisplaySize(S, S);
        hidden.setVisible(false);
      }
    }

    const engine = new PlutoEngine({
      canvas,
      width: CANVAS_W,
      height: CANVAS_H,
      maxInstances: 32,
      scene: [TintScene],
    });
    await engine.ready;

    const device = engine.device;
    if (!device) throw new Error('device が初期化されていません');

    const pixels = new Uint8Array(CANVAS_W * CANVAS_H * 4);
    // 合成前のバックバッファを読むため、同一タスク内で描画してから読み戻します。
    engine.render();
    if (!device.readPixels(pixels, CANVAS_W, CANVAS_H)) {
      console.warn('[golden] このバックエンドは readPixels 未対応のため検証をスキップします。');
      engine.destroy();
      canvas.remove();
      return;
    }

    const sample = (px: number, py: number): number[] => {
      const o = (py * CANVAS_W + px) * 4;
      return [pixels[o], pixels[o + 1], pixels[o + 2]];
    };

    // tint 未設定の白は白のまま
    expect(sample(40, 40).join(','), 'tint 未設定').toBe('255,255,255');
    // 赤の tint は R のみ残る
    expect(sample(104, 40).join(','), 'tint 0xff0000').toBe('255,0,0');
    // 半透明は背景とブレンドされる（背景は 3,5,13）
    const faded = sample(168, 40);
    expect(faded[0], 'alpha=0.5 の R').toBeGreaterThan(100);
    expect(faded[0], 'alpha=0.5 の R').toBeLessThan(200);
    // 非表示は背景のまま
    expect(sample(232, 40).join(','), 'setVisible(false)').toBe(BACKGROUND.join(','));

    engine.destroy();
    canvas.remove();
  });

  it('scale は倍率: scale=1 でフレームそのまま、scale=2 で 2 倍になる', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 100;
    document.body.appendChild(canvas);

    /** frameWidth/frameHeight を指定して読み込むテストシーン */
    class FrameSizeScene extends Scene {
      preload(): void {
        // 32x32 の単色タイル。frameWidth / frameHeight を明示します。
        this.textures.createCanvasTexture(
          'box',
          32,
          32,
          (ctx) => {
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(0, 0, 32, 32);
          },
          { frameWidth: 32, frameHeight: 32 },
        );
      }

      create(): void {
        // 1) scale = 1 → フレーム 32px のまま
        const a = this.add.sprite(worldX(50), worldY(30), 'box');
        expect(a.scale).toBe(1);
        expect(a.width).toBe(32);
        expect(a.displayWidth).toBe(32);

        // 2) scale = 2 → 64px
        const b = this.add.sprite(worldX(120), worldY(30), 'box');
        b.scale = 2;
        expect(b.scale).toBe(2);
        expect(b.width).toBe(32);
        expect(b.displayWidth).toBe(64);

        // 3) 非等方スケール → 横 64 / 縦 32
        const c = this.add.sprite(worldX(180), worldY(80), 'box');
        c.scale = 2;
        c.scaleY = 1;
        expect(c.displayWidth).toBe(64);
        expect(c.displayHeight).toBe(32);
      }
    }

    const engine = new PlutoEngine({
      canvas,
      width: 200,
      height: 100,
      maxInstances: 16,
      scene: [FrameSizeScene],
    });
    await engine.ready;

    const device = engine.device;
    if (!device) throw new Error('device が初期化されていません');

    const pixels = new Uint8Array(200 * 100 * 4);
    engine.render();
    if (!device.readPixels(pixels, 200, 100)) {
      engine.destroy();
      canvas.remove();
      return;
    }

    const isGreen = (px: number, py: number) => {
      const o = (py * 200 + px) * 4;
      return pixels[o] === 0x22 && pixels[o + 1] === 0xc5 && pixels[o + 2] === 0x5e;
    };

    // scale=1: 32x32 なので中心は緑、端の 1 ピクセル先は背景。
    // 中心 (50, 30) から ±16 のクワッドなので、
    // 覆われるのは x 34..65 / y 14..45（ピクセル中心が矩形内に入る範囲）。
    expect(isGreen(50, 30), 'scale=1 の中心').toBe(true);
    expect(isGreen(34, 30), 'scale=1 の左端').toBe(true);
    expect(isGreen(65, 30), 'scale=1 の右端').toBe(true);
    expect(isGreen(50, 14), 'scale=1 の上端').toBe(true);
    expect(isGreen(50, 45), 'scale=1 の下端').toBe(true);
    expect(isGreen(33, 30), 'scale=1 の左 1 ピクセル外側').toBe(false);
    expect(isGreen(66, 30), 'scale=1 の右 1 ピクセル外側').toBe(false);
    expect(isGreen(50, 13), 'scale=1 の上 1 ピクセル外側').toBe(false);
    expect(isGreen(50, 46), 'scale=1 の下 1 ピクセル外側').toBe(false);

    // scale=2: 64x64 になる (中心 120, 30 から ±32)
    // 覆われるのは x 88..151 / y は画面外 (-2) から 61
    expect(isGreen(120, 30), 'scale=2 の中心').toBe(true);
    expect(isGreen(88, 30), 'scale=2 の左端').toBe(true);
    expect(isGreen(151, 30), 'scale=2 の右端').toBe(true);
    expect(isGreen(87, 30), 'scale=2 の左 1 ピクセル外側').toBe(false);
    expect(isGreen(120, 0), 'scale=2 の画面上端').toBe(true);

    engine.destroy();
    canvas.remove();
  });

  it('setOrigin が描画位置を動かす (0.5=中心 / 0=左上 / 1=右下)', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 100;
    document.body.appendChild(canvas);

    class OriginScene extends Scene {
      preload(): void {
        this.textures.createCanvasTexture(
          'box',
          32,
          32,
          (ctx) => {
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(0, 0, 32, 32);
          },
          { frameWidth: 32, frameHeight: 32 },
        );
      }

      create(): void {
        // origin (0.5, 0.5) = 中心基準 → 位置がそのまま中心になる
        // 位置 (60, 50)、大きさ 32x32 なので矩形は x 44..75 / y 34..65
        const center = this.add.sprite(worldX(60), worldY(50), 'box');
        center.setOrigin(0.5, 0.5);

        // origin (0, 0) = 左上基準 → 位置から右下方へ伸びる
        // 位置 (110, 50) なので矩形は x 110..141 / y 50..81
        const topLeft = this.add.sprite(worldX(110), worldY(50), 'box');
        topLeft.setOrigin(0, 0);

        // origin (1, 1) = 右下基準 → 位置から左上へ伸びる
        // 位置 (160, 50) なので矩形は x 128..159 / y 18..49
        const bottomRight = this.add.sprite(worldX(160), worldY(50), 'box');
        bottomRight.setOrigin(1, 1);

        // setActive(false) は描画されない
        const hidden = this.add.sprite(worldX(60), worldY(80), 'box');
        hidden.setActive(false);
      }
    }

    const engine = new PlutoEngine({
      canvas,
      width: 200,
      height: 100,
      maxInstances: 16,
      scene: [OriginScene],
    });
    await engine.ready;

    const device = engine.device;
    if (!device) throw new Error('device が初期化されていません');

    const pixels = new Uint8Array(200 * 100 * 4);
    engine.render();
    if (!device.readPixels(pixels, 200, 100)) {
      engine.destroy();
      canvas.remove();
      return;
    }

    const isBlue = (px: number, py: number) => {
      const o = (py * 200 + px) * 4;
      return pixels[o] === 0x38 && pixels[o + 1] === 0xbd && pixels[o + 2] === 0xf8;
    };
    const rgbAt = (px: number, py: number) => {
      const o = (py * 200 + px) * 4;
      return `${pixels[o]},${pixels[o + 1]},${pixels[o + 2]}`;
    };

    // origin (0.5, 0.5): 位置がそのまま矩形の中心
    expect(isBlue(60, 50), 'origin 0.5 の中心').toBe(true);
    expect(isBlue(44, 50), 'origin 0.5 の左端').toBe(true);
    expect(isBlue(43, 50), 'origin 0.5 の左 1px 外').toBe(false);
    expect(isBlue(75, 50), 'origin 0.5 の右端').toBe(true);
    expect(isBlue(76, 50), 'origin 0.5 の右 1px 外').toBe(false);

    // origin (0, 0): 位置が矩形の左上なので、位置から右下が塗られる
    expect(isBlue(110, 50), 'origin (0,0) の左上').toBe(true);
    expect(isBlue(141, 81), 'origin (0,0) の右下').toBe(true);
    expect(isBlue(109, 50), 'origin (0,0) の左 1px 外').toBe(false);
    expect(isBlue(110, 49), 'origin (0,0) の上 1px 外').toBe(false);

    // origin (1, 1): 位置が矩形の右下なので、位置から左上へ塗られる
    expect(isBlue(159, 49), 'origin (1,1) の右下端').toBe(true);
    expect(isBlue(128, 18), 'origin (1,1) の左上端').toBe(true);
    expect(isBlue(160, 50), 'origin (1,1) の右 1px 外').toBe(false);
    expect(isBlue(159, 50), 'origin (1,1) の下 1px 外').toBe(false);
    expect(isBlue(127, 18), 'origin (1,1) の左 1px 外').toBe(false);

    // setActive(false) は背景のまま
    expect(rgbAt(60, 80), 'setActive(false) は描画されない').toBe(BACKGROUND.join(','));

    engine.destroy();
    canvas.remove();
  });

  it('フレームバッファが単色で塗られない（画面が真っ暗にならない）', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    document.body.appendChild(canvas);

    class BrightScene extends Scene {
      create(): void {
        // 白で画面全体を覆う
        const s = this.add.sprite(0, 0);
        s.setDisplaySize(200, 200);
        s.setTint(0xffffff);
      }
    }

    const engine = new PlutoEngine({
      canvas,
      width: 64,
      height: 64,
      maxInstances: 8,
      scene: [BrightScene],
    });
    await engine.ready;

    const device = engine.device;
    if (!device) throw new Error('device が初期化されていません');

    const pixels = new Uint8Array(64 * 64 * 4);
    engine.render();
    if (!device.readPixels(pixels, 64, 64)) {
      engine.destroy();
      canvas.remove();
      return;
    }

    // 平均輝度が十分に高いこと（暗すぎる画面を検出する）
    let sum = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      sum += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    }
    const mean = sum / (64 * 64);
    expect(mean, '画面全体の平均輝度').toBeGreaterThan(200);

    engine.destroy();
    canvas.remove();
  });
});

/** 背景色と異なるピクセルの数を集計します。 */
function countNonBackground(pixels: Uint8Array, bg: readonly [number, number, number]): number {
  let count = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i] === bg[0] && pixels[i + 1] === bg[1] && pixels[i + 2] === bg[2]) continue;
    count++;
  }
  return count;
}
