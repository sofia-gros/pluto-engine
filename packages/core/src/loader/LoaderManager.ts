/**
 * @file LoaderManager.ts
 * @description
 * アセット（画像、JSON、CSV、YAML等）を非同期で読み込み、キャッシュするマネージャー。
 * PhaserのLoaderのように、this.load.image(...) でキューに積み、後でまとめてロードする仕組みを提供します。
 */

type AssetType = 'image' | 'json' | 'csv' | 'yaml';

interface LoadItem {
  key: string;
  url: string;
  type: AssetType;
}

export class LoaderManager {
  private _queue: LoadItem[] = [];
  private _cache: Map<string, any> = new Map();
  private _isLoading = false;

  /**
   * 画像アセットをキューに追加します。
   */
  public image(key: string, url: string): this {
    this._queue.push({ key, url, type: 'image' });
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
   * キューに積まれたすべてのアセットを非同期でロードします。
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
          this._cache.set(item.key, image);
          break;
        }
        case 'json': {
          const json = await response.json();
          this._cache.set(item.key, json);
          break;
        }
        case 'csv':
        case 'yaml': {
          // CSVとYAMLは文字列として読み込み、パーサーは別途用意する前提
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
