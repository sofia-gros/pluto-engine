/**
 * @file TextureManager.ts
 * @description
 * シーンおよびエンジン全体でテクスチャアセットを一元管理し、GPUへの転送・キャッシュを統括するマネージャー。
 */

import type {
  GraphicsDevice,
  TextureAsset,
  TextureFrame,
  TextureUploadOptions,
} from '@pluto-engine/renderer';

/**
 * フレーム UV を構築します。
 *
 * `options.frames` に明示矩形があればそれを使い、無ければ
 * `frameWidth` / `frameHeight` から均一グリッドを計算します。
 *
 * 登録時のみ呼ばれるため、配列の new は想定内です。
 */
function buildFrames(
  width: number,
  height: number,
  options: TextureUploadOptions,
): TextureFrame[] {
  const frames: TextureFrame[] = [];
  const explicit = options.frames;
  if (explicit !== undefined && explicit.length > 0) {
    for (let i = 0; i < explicit.length; i++) {
      const r = explicit[i];
      frames.push({
        uvX: r.x / width,
        uvY: r.y / height,
        uvW: r.w / width,
        uvH: r.h / height,
      });
    }
    return frames;
  }

  const gridW = options.frameWidth || width;
  const gridH = options.frameHeight || height;
  const cols = Math.max(1, Math.floor(width / gridW));
  const rows = Math.max(1, Math.floor(height / gridH));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      frames.push({
        uvX: (c * gridW) / width,
        uvY: (r * gridH) / height,
        uvW: gridW / width,
        uvH: gridH / height,
      });
    }
  }
  return frames;
}

export class TextureManager {
  private device: GraphicsDevice | null = null;
  private textures: Map<string, TextureAsset> = new Map();

  constructor(device?: GraphicsDevice | null) {
    this.device = device || null;
  }

  /**
   * グラフィックスデバイスを設定し、保留中のテクスチャをGPUにアップロードします。
   */
  public setDevice(device: GraphicsDevice): void {
    this.device = device;
    for (const [key, asset] of this.textures.entries()) {
      const source = (asset as any)._source;
      if (source && this.device) {
        const uploaded = this.device.uploadTexture(key, source, {
          frameWidth: asset.frameWidth,
          frameHeight: asset.frameHeight,
        });
        this.textures.set(key, uploaded);
      }
    }
  }

  /**
   * 画像オブジェクトまたはCanvasからテクスチャを登録・GPU転送します。
   */
  public addImage(
    key: string,
    source: HTMLImageElement | HTMLCanvasElement | ImageBitmap | ImageData,
  ): TextureAsset {
    if (this.device) {
      const asset = this.device.uploadTexture(key, source);
      this.textures.set(key, asset);
      return asset;
    }
    const asset: TextureAsset = {
      key,
      layerIndex: 0,
      width: source.width,
      height: source.height,
      frameWidth: source.width,
      frameHeight: source.height,
      frames: [{ uvX: 0, uvY: 0, uvW: 1, uvH: 1 }],
      ...({ _source: source } as any),
    };
    this.textures.set(key, asset);
    return asset;
  }

  /**
   * スプライトシートからテクスチャを登録・GPU転送します。
   *
   * `options.frames` に明示矩形があればそれを使い、
   * 無ければ `frameWidth` / `frameHeight` から均一グリッドを計算します。
   */
  public addSpritesheet(
    key: string,
    source: HTMLImageElement | HTMLCanvasElement | ImageBitmap | ImageData,
    options: TextureUploadOptions,
  ): TextureAsset {
    if (this.device) {
      const asset = this.device.uploadTexture(key, source, options);
      this.textures.set(key, asset);
      return asset;
    }

    // デバイスが無い間も UV を計算しないと Sprite.setFrame() が何もできません。
    const width = source.width;
    const height = source.height;
    const asset: TextureAsset = {
      key,
      layerIndex: 0,
      width,
      height,
      frameWidth: options.frameWidth || width,
      frameHeight: options.frameHeight || height,
      frames: buildFrames(width, height, options),
      ...({ _source: source } as any),
    };
    this.textures.set(key, asset);
    return asset;
  }

  /**
   * アトラス (TexturePacker 形式) を登録・GPU転送します。
   *
   * 均一グリッドではないため、フレーム UV は呼び出し側が矩形一覧で渡します。
   * 配列順がそのままフレーム番号になるため、
   * 描画時は `setFrame(番号)` で指定します。
   *
   * @param key テクスチャキー
   * @param source 画像
   * @param frames フレーム矩形 (ピクセル)。配列順 = フレーム番号
   */
  public addAtlas(
    key: string,
    source: HTMLImageElement | HTMLCanvasElement | ImageBitmap | ImageData,
    frames: { x: number; y: number; w: number; h: number }[],
  ): TextureAsset {
    return this.addSpritesheet(key, source, { frames });
  }

  /**
   * Canvas 描画コールバックから動的にプロシージャルテクスチャを作成・GPU転送します。
   */
  public createCanvasTexture(
    key: string,
    width: number,
    height: number,
    drawCallback: (ctx: CanvasRenderingContext2D) => void,
    options?: TextureUploadOptions,
  ): TextureAsset {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    drawCallback(ctx);
    return options ? this.addSpritesheet(key, canvas, options) : this.addImage(key, canvas);
  }

  /**
   * 登録済みテクスチャを取得します。
   */
  public get(key: string): TextureAsset | undefined {
    if (this.device) {
      return this.device.getTexture(key) || this.textures.get(key);
    }
    return this.textures.get(key);
  }

  /**
   * テクスチャが存在するかどうか判定します。
   */
  public exists(key: string): boolean {
    return (
      this.textures.has(key) || (this.device ? this.device.getTexture(key) !== undefined : false)
    );
  }
}
