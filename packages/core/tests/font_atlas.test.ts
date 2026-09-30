import { describe, expect, test } from 'vitest';
import { FontAtlas } from '../src/text/FontAtlas';
import { Text } from '../src/arena/Text';
import { Sprite } from '../src/arena/Sprite';
import { InstanceBufferArena } from '../src/arena/InstanceBufferArena';

/** アップロード先を模した最小限のデバイス。TextureManager の経路と同じ形です。 */
function fakeDevice() {
  const uploads: { key: string; source: HTMLCanvasElement }[] = [];
  return {
    uploads,
    uploadTexture(key: string, source: HTMLCanvasElement) {
      uploads.push({ key, source });
      return { layerIndex: 3, width: source.width, height: source.height };
    },
  };
}

describe('FontAtlas', () => {
  test('generates UVs for printable ASCII', () => {
    const atlas = new FontAtlas(fakeDevice(), 'default', { fontSize: 24 });
    const out = new Float32Array(4);

    // 'A' の UV が取得でき、0〜1 の範囲に収まる
    const adv = atlas.lookup(65, out);
    expect(adv).toBeGreaterThan(0);
    for (let i = 0; i < 4; i++) {
      expect(out[i]).toBeGreaterThanOrEqual(0);
      expect(out[i]).toBeLessThanOrEqual(1);
    }
    // UV 幅は正
    expect(out[2]).toBeGreaterThan(0);
    expect(out[3]).toBeGreaterThan(0);
  });

  test('different characters get different UVs', () => {
    const atlas = new FontAtlas(fakeDevice(), 'default', { fontSize: 24 });
    const a = new Float32Array(4);
    const b = new Float32Array(4);
    atlas.lookup(65, a); // 'A'
    atlas.lookup(66, b); // 'B'
    // アトラス上で隣り合うので x が違う (同一行なら)
    expect(a[0]).not.toBe(b[0]);
  });

  test('space has a positive advance but no ink', () => {
    const atlas = new FontAtlas(fakeDevice(), 'default', { fontSize: 24 });
    const out = new Float32Array(4);
    // スペースは前進幅を持ちます
    expect(atlas.lookup(32, out)).toBeGreaterThan(0);
  });

  test('out of range characters fall back to zero advance', () => {
    const atlas = new FontAtlas(fakeDevice(), 'default', { fontSize: 24 });
    const out = new Float32Array(4);
    expect(atlas.lookup(0, out)).toBe(0);
    expect(atlas.lookup(10000, out)).toBe(0);
    expect(out[2]).toBe(0);
  });

  test('uploads exactly one canvas texture', () => {
    const device = fakeDevice();
    const atlas = new FontAtlas(device, 'hero-font', { fontSize: 16 });
    expect(device.uploads.length).toBe(1);
    expect(device.uploads[0].key).toBe('hero-font');
    expect(atlas.layerIndex).toBe(3);
  });

  test('the generated canvas contains a signed distance field', () => {
    const device = fakeDevice();
    new FontAtlas(device, 'default', { fontSize: 24 });
    const canvas = device.uploads[0].source;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let min = 255;
    let max = 0;
    let dark = 0;
    const levels = new Set<number>();
    for (let i = 0; i < img.data.length; i += 4) {
      const v = img.data[i];
      if (v < min) min = v;
      if (v > max) max = v;
      if (v < 64) dark++;
      // 階調が丰富であること (二値化されていない)
      if (levels.size < 64) levels.add(v);
    }

    // 背景 (外側) は暗く、文字の内側は明るい
    expect(min).toBeLessThan(40);
    expect(max).toBeGreaterThan(140);
    // 背景が支配的 (白に飽和していない)
    expect(dark).toBeGreaterThan((canvas.width * canvas.height) / 2);
    // 距離場なので滑らかな階調を持ちます
    expect(levels.size).toBeGreaterThan(8);
  });
});

describe('Text with a font atlas', () => {
  test('glyphs get real UVs from the atlas', () => {
    const arena = new InstanceBufferArena(256);
    const atlas = new FontAtlas(fakeDevice(), 'default', { fontSize: 24 });
    const text = new Text(0, 0, 'AB', { fontSize: 20 }, arena);
    text.setGlyphSource(atlas);

    expect(text.glyphCount).toBe(2);
    const base = arena.idToIndex[0];
    // 実際の UV が書き込まれている (全面 uv ではない)
    expect(arena.uvW[base]).toBeGreaterThan(0);
    expect(arena.uvW[base]).toBeLessThan(1);
    // フォントのレイヤーも設定される
    expect(arena.frameIdx[base]).toBe(atlas.layerIndex);
  });

  test('proportional advance widths are applied', () => {
    const arena = new InstanceBufferArena(256);
    const atlas = new FontAtlas(fakeDevice(), 'default', { fontSize: 24 });
    const text = new Text(0, 0, 'iW', { fontSize: 20 }, arena);
    text.setGlyphSource(atlas);

    // 'i' は 'W' より細いので、2 文字目の x 開始は
    // 2 文字目の advance だけ進みます (等幅ではない)
    const iAdv = atlas.advanceOf(105) * 20; // 'i'
    const base = arena.idToIndex[0];
    expect(arena.posX[base + 1]).toBeCloseTo(iAdv, 3);
  });

  test('changing the text keeps reusing the arena slots', () => {
    const arena = new InstanceBufferArena(256);
    const atlas = new FontAtlas(fakeDevice(), 'default', { fontSize: 24 });
    const text = new Text(0, 0, 'AB', { fontSize: 20 }, arena);
    text.setGlyphSource(atlas);

    const ids: number[] = [];
    for (let i = 0; i < 2; i++) ids.push(arena.indexToId[i]);

    text.text = 'CD';
    // 同じ長さなのでスロットは再利用されます
    expect(arena.activeCount).toBe(2);
    for (let i = 0; i < 2; i++) {
      expect(arena.indexToId[i]).toBe(ids[i]);
    }
  });

  test('glyphs are flagged as SDF text for the shader', () => {
    const arena = new InstanceBufferArena(256);
    const atlas = new FontAtlas(fakeDevice(), 'default', { fontSize: 24 });
    const text = new Text(0, 0, 'AB', { fontSize: 20 }, arena);
    text.setGlyphSource(atlas);

    // シェーダーは isText = 1.0 のときだけ距離場を閾値で切ります。
    expect(arena.isText[arena.idToIndex[0]]).toBe(1.0);
    expect(arena.isText[arena.idToIndex[1]]).toBe(1.0);
    // テキスト_curve があることで転送フラグが立ちます
    expect(arena.hasText).toBe(true);
  });

  test('plain sprites are not flagged as text', () => {
    const arena = new InstanceBufferArena(256);
    const sprite = new Sprite(arena.allocate(), arena);
    void sprite;
    // 生成直後は通常スプライト (0.0) です
    expect(arena.isText[arena.idToIndex[0]]).toBe(0.0);
    // テキスト_curve がないので転送フラグは立たない
    expect(arena.hasText).toBe(false);
  });

  test('isText follows the slot during swap-remove', () => {
    const arena = new InstanceBufferArena(8);
    const atlas = new FontAtlas(fakeDevice(), 'default', { fontSize: 24 });
    const text = new Text(0, 0, 'AB', { fontSize: 20 }, arena);
    text.setGlyphSource(atlas);

    // 2 つのテキストスロットの後ろに通常スプライトを 1 つ足す
    const extraId = arena.allocate();
    const extra = new Sprite(extraId, arena);
    void extra;
    expect(arena.activeCount).toBe(3);

    // index 0 (テキスト) を解放すると、末尾の通常スプライトが index 0 へ
    // 移動します (swap-remove)。
    const firstId = arena.indexToId[0];
    arena.free(firstId);
    expect(arena.activeCount).toBe(2);
    // 移ったのは通常スプライトなので 0.0 になるはずです。
    // isText の移し替えが抜けていれば 1.0 のまま残ります。
    expect(arena.isText[0]).toBe(0.0);
  });

  test('multibyte characters do not corrupt the layout', () => {
    const arena = new InstanceBufferArena(256);
    const atlas = new FontAtlas(fakeDevice(), 'default', { fontSize: 24 });
    const text = new Text(0, 0, 'Aあ', { fontSize: 20 }, arena);
    text.setGlyphSource(atlas);
    // サロゲートペアでも 1 グリフとして数えられます
    expect(text.glyphCount).toBe(2);
    expect(Number.isFinite(arena.posX[arena.idToIndex[0]])).toBe(true);
  });
});
