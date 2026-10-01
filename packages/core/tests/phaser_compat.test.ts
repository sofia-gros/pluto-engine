import { DEFAULT_FRAME_SIZE } from '@pluto-engine/renderer';
import { describe, expect, it } from 'vitest';
import { InstanceBufferArena } from '../src/arena/InstanceBufferArena';
import { type BoundsRect, type PointLike, Sprite } from '../src/arena/Sprite';

/** テスト用の最小アセット。layerIndex とフレーム UV を持ちます。 */
function makeAsset(key: string, width = 32, height = 32, frames = 4, frameSize?: number) {
  const fw = frameSize ?? Math.min(width, height);
  return {
    key,
    layerIndex: 1,
    width,
    height,
    frameWidth: fw,
    frameHeight: fw,
    frames: Array.from({ length: frames }, (_, i) => ({
      uvX: i * 0.25,
      uvY: 0,
      uvW: 0.25,
      uvH: 1,
    })),
  };
}

function makeSprite(arena: InstanceBufferArena): Sprite {
  return new Sprite(arena.allocate(), arena);
}

describe('Phaser 互換 - setPosition / setX / setY', () => {
  it('setPosition が x と y を設定し this を返す', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    const ret = s.setPosition(100, 200);
    expect(ret).toBe(s);
    expect(s.x).toBe(100);
    expect(s.y).toBe(200);
  });

  it('setPosition は省略引数を無視する（Phaser と同一の挙動）', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setPosition(10, 20);
    s.setPosition(undefined, 99);
    expect(s.x).toBe(10);
    expect(s.y).toBe(99);
    s.setPosition(77);
    expect(s.x).toBe(77);
    expect(s.y).toBe(99);
  });

  it('setX / setY がそれぞれ設定し this を返す', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    expect(s.setX(5)).toBe(s);
    expect(s.setY(6)).toBe(s);
    expect(s.x).toBe(5);
    expect(s.y).toBe(6);
  });
});

describe('Phaser 互換 - scale / scaleX / scaleY', () => {
  it('scale はフレーム寸法の倍率で、既定は 1.0', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setTexture(makeAsset('a', 32, 32));
    expect(s.scale).toBe(1);
    expect(s.width).toBe(32);
    expect(s.displayWidth).toBe(32);
  });

  it('setScale が倍率を設定する', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setTexture(makeAsset('a', 32, 32));
    expect(s.setScale(3)).toBe(s);
    expect(s.scale).toBe(3);
    // 倍率なので表示サイズはフレームの 3 倍
    expect(s.displayWidth).toBe(96);
  });

  it('setScale の第 2 引数は Y の倍率になる (Phaser 互換)', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setTexture(makeAsset('a', 32, 32));
    s.setScale(2);
    // 第 2 引数省略時は X/Y とも 2
    expect(s.scaleX).toBe(2);
    expect(s.scaleY).toBe(2);
    s.setScale(2, 8);
    expect(s.scaleX).toBe(2);
    expect(s.scaleY).toBe(8);
  });

  it('scaleX / scaleY は独立した値を持つ (非等方スケール)', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setTexture(makeAsset('a', 32, 32));
    s.scaleX = 4;
    expect(s.scale).toBe(4);
    expect(s.scaleY).toBe(1);
    s.scaleY = 9;
    expect(s.scaleY).toBe(9);
    expect(s.displayWidth).toBe(128);
    expect(s.displayHeight).toBe(288);
  });

  it('setDisplaySize がピクセル数から倍率を逆算する (Phaser 互換)', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setTexture(makeAsset('a', 32, 32));
    s.setDisplaySize(64, 96);
    expect(s.scaleX).toBeCloseTo(2, 5);
    expect(s.scaleY).toBeCloseTo(3, 5);
    expect(s.displayWidth).toBeCloseTo(64, 4);
    expect(s.displayHeight).toBeCloseTo(96, 4);
    // フレーム寸法は変わらない（Phaser 互換）
    expect(s.width).toBe(32);
  });

  it('flipY は scaleY の符号で表現できる', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setTexture(makeAsset('a', 32, 32));
    expect(s.flipY).toBe(false);
    s.setFlipY(true);
    expect(s.flipY).toBe(true);
    // 絶対値は保たれる
    expect(Math.abs(s.scaleY)).toBe(1);
    s.toggleFlipY();
    expect(s.flipY).toBe(false);
  });
});

describe('Phaser 互換 - テクスチャ未設定の既定サイズ', () => {
  it('フレーム指定が無い場合は DEFAULT_FRAME_SIZE になり透明で描画される', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    expect(s.width).toBe(DEFAULT_FRAME_SIZE);
    expect(s.height).toBe(DEFAULT_FRAME_SIZE);
    expect(s.displayWidth).toBe(DEFAULT_FRAME_SIZE);
    expect(s.hasTexture).toBe(false);
    // 透明 = tint のアルファが 0
    expect((arena.tint[s.index] >>> 24) & 0xff).toBe(0);
  });

  it('テクスチャを設定すると不透明に戻る', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setTexture(makeAsset('a', 32, 32));
    expect((arena.tint[s.index] >>> 24) & 0xff).toBe(0xff);
    expect(s.width).toBe(32);
  });
});

describe('Phaser 互換 - angle / setAngle / setRotation', () => {
  it('rotation はラジアン、angle は度で扱われる', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.rotation = Math.PI / 2;
    // 90 度として読み取れること
    expect(s.angle).toBeCloseTo(90, 5);
  });

  it('setAngle が度を受け取ってラジアンで保持する', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    expect(s.setAngle(180)).toBe(s);
    expect(s.rotation).toBeCloseTo(Math.PI, 5);
    // Float32 への格納で丸めが入るため、許容誤差を少し広めに取ります。
    expect(s.angle).toBeCloseTo(180, 4);
  });

  it('setRotation は setAngle と同じ（Phaser では同義）', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setRotation(45);
    expect(s.rotation).toBeCloseTo(Math.PI / 4, 5);
  });

  it('angle のセッターも度を受け取る', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.angle = -90;
    expect(s.rotation).toBeCloseTo(-Math.PI / 2, 5);
  });
});

describe('Phaser 互換 - visible / setVisible / toggleVisible', () => {
  it('生成直後は表示状態（SoA の初期値が 1）', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    expect(s.visible).toBe(true);
  });

  it('setVisible(false) で非表示になり dirty が立つ', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    arena.dirtyVisible = false;
    expect(s.setVisible(false)).toBe(s);
    expect(s.visible).toBe(false);
    expect(arena.dirtyVisible).toBe(true);
    expect(arena.visible[s.index]).toBe(0.0);
  });

  it('visible のセッターが setVisible と同じ機能を提供する', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.visible = false;
    expect(arena.visible[s.index]).toBe(0);
    s.visible = true;
    expect(arena.visible[s.index]).toBe(1.0);
  });

  it('toggleVisible が反転する', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.toggleVisible();
    expect(s.visible).toBe(false);
    s.toggleVisible();
    expect(s.visible).toBe(true);
  });
});

describe('Phaser 互換 - alpha / setAlpha / clearAlpha', () => {
  it('alpha は tint の最上位バイトから読み出される（SoA 追加なし）', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.alpha = 0.5;
    // tint の最上位バイトがそのまま A チャンネルになります。
    const packed = arena.tint[s.index];
    expect((packed >>> 24) & 0xff).toBe(128);
    expect(s.alpha).toBeCloseTo(128 / 255, 4);
  });

  it('setAlpha が this を返す', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    expect(s.setAlpha(0.25)).toBe(s);
    expect(s.alpha).toBeCloseTo(0.25, 2);
  });

  it('clearAlpha が 1.0 に戻す', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setAlpha(0.1);
    s.clearAlpha();
    expect(s.alpha).toBe(1.0);
  });

  it('alpha は 0-1 にクランプされる', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setAlpha(5);
    expect(s.alpha).toBe(1.0);
    s.setAlpha(-3);
    expect(s.alpha).toBe(0.0);
  });

  it('alpha 変更が tint の RGB を壊さない', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setTint(0x3366cc);
    const rgbBefore = arena.tint[s.index] & 0x00ffffff;
    s.setAlpha(0.5);
    const rgbAfter = arena.tint[s.index] & 0x00ffffff;
    expect(rgbAfter).toBe(rgbBefore);
    expect(s.tint).toBe(0x3366cc);
  });
});

describe('Phaser 互換 - tint / clearTint / setTintFill', () => {
  it('tint が 0xRRGGBB 形式で読み書きできる', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.tint = 0xff0000;
    expect(s.tint).toBe(0xff0000);
  });

  it('clearTint が alpha を保ったまま白へ戻す', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setTint(0x3366cc);
    s.setAlpha(0.4);
    s.clearTint();
    expect(s.tint).toBe(0xffffff);
    expect(s.alpha).toBeCloseTo(0.4, 2);
  });

  it('setTintFill は alpha のみ反映し係数を 1.0 にする', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setTintFill(0xff0000, 0.5);
    // シェーダが texColor * vTint なので、色成分ではなく係数 1.0 が入ります。
    expect(s.tint).toBe(0xffffff);
    expect(s.alpha).toBeCloseTo(0.5, 2);
  });
});

describe('Phaser 互換 - flipX / setFlipX / toggleFlipX / resetFlip / setFlip', () => {
  it('flipX は facing が負のとき true', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    expect(s.flipX).toBe(false);
    s.setFlipX(true);
    expect(s.flipX).toBe(true);
    expect(arena.facing[s.index]).toBe(-1);
  });

  it('toggleFlipX が反転する', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.toggleFlipX();
    expect(s.flipX).toBe(true);
    s.toggleFlipX();
    expect(s.flipX).toBe(false);
  });

  it('resetFlip が横反転を戻す', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setFlipX(true);
    s.resetFlip();
    expect(s.flipX).toBe(false);
  });

  it('setFlip の第 2 引数（縦）は pluto の単一 scale では無視される', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setFlip(true, true);
    expect(s.flipX).toBe(true);
  });
});

describe('Phaser 互換 - texture / setTextureByKey', () => {
  it('texture がキーの文字列を返す', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setTexture(makeAsset('hero', 32, 32));
    expect(s.texture).toBe('hero');
  });

  it('未設定なら空文字を返す', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    expect(s.texture).toBe('');
  });

  it('setTextureByKey が textures から解決して key を反映する', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    const scene = { textures: { get: (k: string) => (k === 'hero' ? makeAsset('hero') : null) } };
    s.setTextureByKey(scene, 'hero');
    expect(s.texture).toBe('hero');
  });

  it('setTextureByKey は未知のキーで null を設定する', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    const scene = { textures: { get: () => null } };
    s.setTextureByKey(scene, 'missing');
    expect(s.texture).toBe('');
  });
});

describe('Phaser 互換 - getBounds / getTopLeft / getCenter / getBottomRight', () => {
  it('getBounds が中心とスケールから軸平行矩形を求める', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setTexture(makeAsset('a', 32, 32));
    s.setPosition(100, 100);
    s.setScale(2);

    const out: BoundsRect = { x: 0, y: 0, width: 0, height: 0 };
    expect(s.getBounds(out)).toBe(s);
    // 32 * 2 = 64 の幅、中心 100 なので左端は 100 - 32 = 68
    expect(out.x).toBeCloseTo(68, 4);
    expect(out.y).toBeCloseTo(68, 4);
    expect(out.width).toBeCloseTo(64, 4);
    expect(out.height).toBeCloseTo(64, 4);
  });

  it('getTopLeft / getBottomRight が矩形の角を返す', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setTexture(makeAsset('a', 32, 32));
    s.setPosition(50, 50);
    s.setScale(1);

    const tl: PointLike = { x: 0, y: 0 };
    const br: PointLike = { x: 0, y: 0 };
    s.getTopLeft(tl);
    s.getBottomRight(br);
    expect(tl.x).toBeCloseTo(34, 4);
    expect(tl.y).toBeCloseTo(34, 4);
    expect(br.x).toBeCloseTo(66, 4);
    expect(br.y).toBeCloseTo(66, 4);
  });

  it('getCenter が位置をそのまま返す', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setPosition(12, 34);
    const c: PointLike = { x: 0, y: 0 };
    s.getCenter(c);
    expect(c.x).toBe(12);
    expect(c.y).toBe(34);
  });

  it('毎フレーム new を発生させない（出力先は呼び出し側）', () => {
    const arena = new InstanceBufferArena(16);
    const s = makeSprite(arena);
    s.setTexture(makeAsset('a', 16, 16));
    const out: BoundsRect = { x: 0, y: 0, width: 0, height: 0 };
    for (let i = 0; i < 100; i++) {
      s.setPosition(i, i);
      s.getBounds(out);
    }
    expect(out.width).toBeCloseTo(16, 4);
  });
});

describe('SoA 整合性 - visible / alpha の伝播', () => {
  it('swap-remove で visible が跟着移動する', () => {
    const arena = new InstanceBufferArena(8);
    const a = makeSprite(arena);
    const b = makeSprite(arena);
    const c = makeSprite(arena);
    c.setVisible(false);

    // b を解放すると、末尾の c が b のスロットへ移動します。
    arena.free(b.id);
    expect(arena.activeCount).toBe(2);
    // 移動先が非表示であるべきです（移し替えが漏れると 1 のままになります）。
    const bIdx = arena.idToIndex[a.id] === 0 ? 1 : 0;
    expect(arena.visible[bIdx]).toBe(0.0);
  });

  it('allocate は表示状態 1 で初期化される', () => {
    const arena = new InstanceBufferArena(8);
    const a = makeSprite(arena);
    a.setVisible(false);
    arena.free(a.id);
    const b = makeSprite(arena);
    expect(b.visible).toBe(true);
  });

  it('clear() は全スロットを表示状態へ戻す', () => {
    const arena = new InstanceBufferArena(8);
    const a = makeSprite(arena);
    a.setVisible(false);
    arena.clear();
    const b = makeSprite(arena);
    expect(b.visible).toBe(true);
    expect(arena.dirtyVisible).toBe(true);
  });

  it('markAllDirty が visible も転送対象にします', () => {
    const arena = new InstanceBufferArena(8);
    makeSprite(arena);
    arena.dirtyVisible = false;
    arena.markAllDirty();
    expect(arena.dirtyVisible).toBe(true);
  });
});
