import { describe, expect, it } from 'vitest';
import { parseAtlasJson } from '../src/loader/AtlasParser';
import { parseBitmapFontJson, parseBitmapFontText } from '../src/loader/BitmapFontParser';
import { LoaderManager } from '../src/loader/LoaderManager';
import { TextureManager } from '../src/loader/TextureManager';
import { Scene } from '../src/scene/Scene';
import { SceneManager } from '../src/scene/SceneManager';

describe('TexturePacker アトラスの解析', () => {
  it('JSON Hash 形式からフレーム矩形と名前表を作る', () => {
    const parsed = parseAtlasJson({
      frames: {
        'hero.png': { frame: { x: 0, y: 0, w: 32, h: 48 } },
        'coin.png': { frame: { x: 32, y: 0, w: 16, h: 16 } },
      },
      meta: { image: 'atlas.png' },
    });

    expect(parsed.frames).toHaveLength(2);
    expect(parsed.frames[0]).toEqual({ x: 0, y: 0, w: 32, h: 48 });
    expect(parsed.frames[1]).toEqual({ x: 32, y: 0, w: 16, h: 16 });
    expect(parsed.frameNames.get('hero.png')).toBe(0);
    expect(parsed.frameNames.get('coin.png')).toBe(1);
    // 拡張子を除いた名前でも引けます
    expect(parsed.frameNames.get('hero')).toBe(0);
    expect(parsed.imagePath).toBe('atlas.png');
  });

  it('旧形式の配列にも対応する', () => {
    const parsed = parseAtlasJson([
      { filename: 'a.png', frame: { x: 1, y: 2, w: 3, h: 4 } },
      { filename: 'b.png', frame: { x: 5, y: 6, w: 7, h: 8 } },
    ]);
    expect(parsed.frames).toHaveLength(2);
    expect(parsed.frames[0]).toEqual({ x: 1, y: 2, w: 3, h: 4 });
    expect(parsed.frameNames.get('b.png')).toBe(1);
  });

  it('trimmed なら spriteSourceSize を加算する', () => {
    const parsed = parseAtlasJson({
      frames: {
        'trim.png': {
          frame: { x: 0, y: 0, w: 10, h: 10 },
          trimmed: true,
          spriteSourceSize: { x: 5, y: 7, w: 20, h: 20 },
          sourceSize: { w: 20, h: 20 },
        },
      },
    });
    // 切り抜き元画像上の位置 (5, 7) が足されます
    expect(parsed.frames[0]).toEqual({ x: 5, y: 7, w: 10, h: 10 });
  });

  it('trimmed が false なら加算しない', () => {
    const parsed = parseAtlasJson({
      frames: {
        'plain.png': {
          frame: { x: 2, y: 3, w: 4, h: 5 },
          trimmed: false,
          spriteSourceSize: { x: 100, y: 100, w: 4, h: 5 },
        },
      },
    });
    expect(parsed.frames[0]).toEqual({ x: 2, y: 3, w: 4, h: 5 });
  });

  it('不正な入力では空の結果を返す', () => {
    expect(parseAtlasJson(null).frames).toHaveLength(0);
    expect(parseAtlasJson({}).frames).toHaveLength(0);
    expect(parseAtlasJson({ frames: { bad: { frame: { x: 0, y: 0, w: 0, h: 5 } } } })
      .frames).toHaveLength(0);
  });

  it('frame をnested させて直接 frame を持つ形式も読む', () => {
    const parsed = parseAtlasJson({
      frames: [{ frame: { x: 4, y: 5, w: 6, h: 7 } }],
    });
    expect(parsed.frames[0]).toEqual({ x: 4, y: 5, w: 6, h: 7 });
  });
});

describe('ビットマップフォントの解析', () => {
  it('AngelCode のテキスト形式を読む', () => {
    const text = [
      'info face="Arial" size=32 bold=0',
      'common lineHeight=40 base=32 scaleW=256 scaleH=256 pages=1',
      'page id=0 file="arial.png"',
      'chars count=2',
      'char id=65 x=1 y=2 width=10 height=20 xoffset=3 yoffset=4 xadvance=12 page=0',
      'char id=66 x=11 y=12 width=13 height=14 xoffset=5 yoffset=6 xadvance=16 page=0',
    ].join('\n');

    const parsed = parseBitmapFontText(text);
    expect(parsed.name).toBe('Arial');
    expect(parsed.size).toBe(32);
    expect(parsed.lineHeight).toBe(40);
    expect(parsed.imagePath).toBe('arial.png');
    expect(parsed.chars).toHaveLength(2);

    // 文字コード順に並ぶようにします
    expect(parsed.chars[0].id).toBe(65);
    expect(parsed.chars[0].x).toBe(1);
    expect(parsed.chars[0].y).toBe(2);
    expect(parsed.chars[0].width).toBe(10);
    expect(parsed.chars[0].height).toBe(20);
    expect(parsed.chars[0].xadvance).toBe(12);
    expect(parsed.chars[1].id).toBe(66);
  });

  it('JSON 形式を読む', () => {
    const parsed = parseBitmapFontJson({
      font: 'Pixel',
      size: 12,
      lineHeight: 16,
      common: { lineHeight: 18, pages: ['pixel.png'] },
      chars: [
        { id: 65, x: 0, y: 0, width: 8, height: 12, xadvance: 9 },
        { id: 66, x: 8, y: 0, width: 8, height: 12, xadvance: 10 },
      ],
    });
    expect(parsed.name).toBe('Pixel');
    expect(parsed.size).toBe(12);
    // common.lineHeight が優先されます
    expect(parsed.lineHeight).toBe(18);
    expect(parsed.imagePath).toBe('pixel.png');
    expect(parsed.chars).toHaveLength(2);
    expect(parsed.chars[0].xadvance).toBe(9);
  });

  it('不正な入力では空の結果を返す', () => {
    expect(parseBitmapFontJson(null).chars).toHaveLength(0);
    expect(parseBitmapFontText('').chars).toHaveLength(0);
  });
});

describe('LoaderManager のイベント', () => {
  it('on / once / off で購読を制御できる', () => {
    const loader = new LoaderManager();
    let a = 0;
    let b = 0;

    loader.on('complete', () => a++);
    loader.once('complete', () => b++);

    void loader.start();
    // start は非同期なので、microtask を 1 周させるだけで十分です
    return Promise.resolve().then(() => {
      expect(a).toBe(1);
      expect(b).toBe(1);
    });
  });

  it('off で解除すると呼ばれなくなる', () => {
    const loader = new LoaderManager();
    let count = 0;
    const fn = (): void => {
      count++;
    };
    loader.on('complete', fn);
    expect(loader.off('complete', fn)).toBe(true);
    expect(loader.off('complete', fn)).toBe(false);

    return loader.start().then(() => {
      expect(count).toBe(0);
    });
  });

  it('キューが空でも complete を 1 度発火する', () => {
    const loader = new LoaderManager();
    let count = 0;
    loader.once('complete', () => count++);
    return loader.start().then(() => {
      expect(count).toBe(1);
    });
  });

  it('pendingCount がキューの長さを返す', () => {
    const loader = new LoaderManager();
    expect(loader.pendingCount).toBe(0);
    loader.json('a', '/a.json');
    loader.json('b', '/b.json');
    expect(loader.pendingCount).toBe(2);
  });

  it('clear がキューとキャッシュを空にする', () => {
    const loader = new LoaderManager();
    loader.json('a', '/a.json');
    loader.clear();
    expect(loader.pendingCount).toBe(0);
  });
});

describe('TextureManager.addAtlas', () => {
  it('明示フレームをそのまま UV として登録する', () => {
    const textures = new TextureManager();
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;

    const names = new Map<string, number>([
      ['a', 0],
      ['b', 1],
    ]);
    const asset = textures.addAtlas(
      'atlas',
      canvas,
      [
        { x: 0, y: 0, w: 32, h: 64 },
        { x: 32, y: 0, w: 32, h: 64 },
      ],
      names,
    );

    expect(asset.key).toBe('atlas');
    expect(asset.frames).toHaveLength(2);
    // 128x64 のうち 32x64 = 幅 1/4、高さ 1
    expect(asset.frames![0].uvX).toBeCloseTo(0, 5);
    expect(asset.frames![0].uvW).toBeCloseTo(0.25, 5);
    expect(asset.frames![0].uvH).toBeCloseTo(1, 5);
    expect(asset.frames![1].uvX).toBeCloseTo(0.25, 5);
    expect(asset.frameNames).toBe(names);
  });

  it('名前表を省略すると null になる', () => {
    const textures = new TextureManager();
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const asset = textures.addAtlas('plain', canvas, [{ x: 0, y: 0, w: 16, h: 16 }]);
    expect(asset.frameNames).toBeNull();
  });
});

describe('Sprite.setFrame の名前解決', () => {
  it('アトラスのフレーム名で UV を引ける', () => {
    const scene = new Scene({ maxInstances: 100 });
    const textures = scene.textures;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;

    const names = new Map<string, number>([
      ['left', 0],
      ['right', 1],
    ]);
    textures.addAtlas(
      'hero',
      canvas,
      [
        { x: 0, y: 0, w: 32, h: 64 },
        { x: 32, y: 0, w: 32, h: 64 },
      ],
      names,
    );

    const sprite = scene.add.sprite(0, 0);
    sprite.setTextureByKey(scene, 'hero', 'right');
    const i = sprite.index;

    expect(scene.arena.uvX[i]).toBeCloseTo(0.25, 5);
    expect(scene.arena.srcFrame[i]).toBe(1);

    sprite.setFrame('left');
    expect(scene.arena.uvX[i]).toBeCloseTo(0, 5);
    expect(scene.arena.srcFrame[i]).toBe(0);
  });

  it('未知の名前は 0 番へフォールバックする', () => {
    const scene = new Scene({ maxInstances: 100 });
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    scene.textures.addAtlas(
      'pack',
      canvas,
      [
        { x: 0, y: 0, w: 32, h: 64 },
        { x: 32, y: 0, w: 32, h: 64 },
      ],
      new Map([['known', 1]]),
    );

    const sprite = scene.add.sprite(0, 0);
    sprite.setTextureByKey(scene, 'pack', 'known');
    sprite.setFrame('unknown');
    expect(scene.arena.srcFrame[sprite.index]).toBe(0);
  });

  it('名前表が無いスプライトシートでは文字列は 0 のまま', () => {
    const scene = new Scene({ maxInstances: 100 });
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    scene.textures.addSpritesheet('grid', canvas, { frameWidth: 32, frameHeight: 64 });

    const sprite = scene.add.sprite(0, 0);
    sprite.setTextureByKey(scene, 'grid', 'anything');
    // frameNames が無いので 0 番 (従来挙動の維持)
    expect(scene.arena.srcFrame[sprite.index]).toBe(0);
  });

  it('数値はそのまま添字として扱われる', () => {
    const scene = new Scene({ maxInstances: 100 });
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    scene.textures.addAtlas(
      'num',
      canvas,
      [
        { x: 0, y: 0, w: 32, h: 64 },
        { x: 32, y: 0, w: 32, h: 64 },
        { x: 64, y: 0, w: 32, h: 64 },
      ],
      new Map([['two', 2]]),
    );

    const sprite = scene.add.sprite(0, 0);
    sprite.setTextureByKey(scene, 'num', 1);
    expect(scene.arena.srcFrame[sprite.index]).toBe(1);
    sprite.setFrame(2);
    expect(scene.arena.srcFrame[sprite.index]).toBe(2);
  });
});

describe('Scene の preload と start', () => {
  it('キューが空なら create() が同期的に呼ばれる', () => {
    let created = false;
    class Demo extends Scene {
      public override create(): void {
        created = true;
      }
    }
    const mgr = new SceneManager({} as never);
    mgr.add('demo', Demo);
    mgr.start('demo');
    // await せずにすでに呼ばれていること
    expect(created).toBe(true);
  });

  it('キューにアセットがあれば読み込み後に create() が呼ばれる', async () => {
    const order: string[] = [];

    class Demo extends Scene {
      public override preload(): void {
        order.push('preload');
        // 存在しないパスでも start() は例外を投げずに完了します
        this.load.json('data', '/__does_not_exist__.json');
      }
      public override create(): void {
        order.push('create');
      }
    }

    const mgr = new SceneManager({} as never);
    mgr.add('demo', Demo);
    mgr.start('demo');
    // 同期段階では create はまだ呼ばれていません
    expect(order).toEqual(['preload']);

    // フェッチの失敗を待って create まで進みます
    await new Promise((r) => setTimeout(r, 200));
    expect(order).toEqual(['preload', 'create']);
  });
});
