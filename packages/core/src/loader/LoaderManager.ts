/**
 * @file LoaderManager.ts
 * @description
 * アセット（画像、スプライトシート、JSON、CSV、YAML等）を非同期で読み込み、キャッシュするマネージャー。
 * PhaserのLoaderのように、this.load.image(...) でキューに積み、ロード完了時に GPU テクスチャへ自動転送します。
 */

import type { TextureAsset } from '@pluto-engine/renderer';
import type { TextureManager } from './TextureManager';

type AssetType = 'image' | 'spritesheet' | 'json' | 'csv' | 'yaml';

export interface SpritesheetConfig {
  frameWidth: number;
  frameHeight: number;
}

interface LoadItem {
  key: string;
  url: string;
  type: AssetType;
  config?: SpritesheetConfig;
}

export class LoaderManager {
  private _queue: LoadItem[] = [];
  private _cache: Map<string, any> = new Map();
  private _isLoading = false;
  private _textureManager: TextureManager | null = null;

  constructor(textureManager?: TextureManager) {
    this._textureManager = textureManager || null;
  }

  /**
   * TextureManager を設定します。
   */
  public setTextureManager(textureManager: TextureManager): void {
    this._textureManager = textureManager;
  }

  /**
   * 画像アセットをキューに追加します。
   */
  public image(key: string, url: string): this {
    if (!this._cache.has(key)) {
      this._queue.push({ key, url, type: 'image' });
    }
    return this;
  }

  /**
   * スプライトシートをキューに追加します。
   */
  public spritesheet(key: string, url: string, config: SpritesheetConfig): this {
    if (!this._cache.has(key)) {
      this._queue.push({ key, url, type: 'spritesheet', config });
    }
    return this;
  }

  /**
   * JSONアセットをキューに追加します。
   */
  public json(key: string, url: string): this {
    this._queue.push({ key, url, type: 'json' });
    return this;
  }

  /**
   * CSVアセットをキューに追加します。
   */
  public csv(key: string, url: string): this {
    this._queue.push({ key, url, type: 'csv' });
    return this;
  }

  /**
   * YAMLアセットをキューに追加します。
   */
  public yaml(key: string, url: string): this {
    this._queue.push({ key, url, type: 'yaml' });
    return this;
  }

  /**
   * キューに積まれたすべてのアセットを非同期でロードし、GPUテクスチャへ転送します。
   */
  public async start(): Promise<void> {
    if (this._isLoading || this._queue.length === 0) return;
    this._isLoading = true;

    const promises = this._queue.map((item) => this._loadItem(item));
    await Promise.all(promises);

    this._queue.length = 0;
    this._isLoading = false;
  }

  private async _loadItem(item: LoadItem): Promise<void> {
    try {
      const response = await fetch(item.url);
      if (!response.ok) {
        throw new Error(`Failed to load ${item.url}: ${response.statusText}`);
      }

      switch (item.type) {
        case 'image': {
          const blob = await response.blob();
          const image = new Image();
          image.src = URL.createObjectURL(blob);
          await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
          });

          let texAsset: TextureAsset | undefined;
          if (this._textureManager) {
            texAsset = this._textureManager.addImage(item.key, image);
          }

          this._cache.set(item.key, {
            type: 'image',
            image,
            textureAsset: texAsset,
          });
          break;
        }
        case 'spritesheet': {
          const blob = await response.blob();
          const image = new Image();
          image.src = URL.createObjectURL(blob);
          await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
          });

          const config = item.config!;
          let texAsset: TextureAsset | undefined;
          if (this._textureManager) {
            texAsset = this._textureManager.addSpritesheet(item.key, image, config);
          }

          this._cache.set(item.key, {
            type: 'spritesheet',
            image,
            config,
            textureAsset: texAsset,
          });
          break;
        }
        case 'json': {
          const json = await response.json();
          this._cache.set(item.key, json);
          break;
        }
        case 'csv':
        case 'yaml': {
          const text = await response.text();
          this._cache.set(item.key, text);
          break;
        }
      }
    } catch (e) {
      console.error(`Error loading asset [${item.key}]:`, e);
    }
  }

  /**
   * キャッシュされたアセットを取得します。
   */
  public get(key: string): any {
    return this._cache.get(key);
  }

  /**
   * キャッシュをクリアします。
   */
  public clear(): void {
    this._cache.clear();
    this._queue.length = 0;
  }
}
