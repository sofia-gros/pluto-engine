/**
 * @file TextureManager.ts
 * @description
 * シーンおよびエンジン全体でテクスチャアセットを一元管理し、GPUへの転送・キャッシュを統括するマネージャー。
 */

import type { GraphicsDevice, TextureAsset, TextureUploadOptions } from '@pluto-engine/renderer';

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
    const asset: TextureAsset = {
      key,
      layerIndex: 0,
      width: source.width,
      height: source.height,
      frameWidth: options.frameWidth || source.width,
      frameHeight: options.frameHeight || source.height,
      ...({ _source: source } as any),
    };
    this.textures.set(key, asset);
    return asset;
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
