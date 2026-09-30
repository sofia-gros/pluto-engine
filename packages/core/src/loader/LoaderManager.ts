/**
 * @file LoaderManager.ts
 * @description
 * アセット（画像、スプライトシート、アトラス、ビットマップフォント、JSON、CSV、YAML等）を
 * 非同期で読み込み、キャッシュするマネージャー。
 *
 * Phaser の Loader と同じ形で `this.load.image(...)` でキューに積み、
 * シーンの `preload()` 後に自動で `start()` されます。
 * 完了を待ちたい場合は `this.load.once('complete', ...)` を使えます。
 */

import type { TextureAsset } from '@pluto-engine/renderer';
import type { TextureManager } from './TextureManager';
import { parseAtlasJson, type ParsedAtlas } from './AtlasParser';
import { parseBitmapFontJson, parseBitmapFontText, type ParsedBitmapFont } from './BitmapFontParser';

/** 読み込みの種類。 */
export type AssetType =
  | 'image'
  | 'spritesheet'
  | 'atlas'
  | 'bitmapfont'
  | 'json'
  | 'csv'
  | 'yaml';

/** `spritesheet` の設定。Phaser と同じ `{ frameWidth, frameHeight }` 形式です。 */
export interface SpritesheetConfig {
  frameWidth: number;
  frameHeight: number;
  /** 開始フレーム番号 (既定 0) */
  startFrame?: number;
  /** 読み込むフレーム数 (省略時は全体) */
  endFrame?: number;
  /** 1 行目のフレーム番号 (Phaser 互換。`startFrame` が優先されます) */
  firstFrame?: number;
  /** 最終フレーム番号 (Phaser 互換。`endFrame` が優先されます) */
  lastFrame?: number;
}

/** `atlas` の設定。省略時は JSON の meta から補います。 */
export interface AtlasConfig {
  /** アトラス画像の実パス。省略時は JSON の meta.image を使います。 */
  textureURL?: string;
  /** JSON の meta.image を設定ファイルの位置を基準に解決するか (既定 true) */
  basePath?: boolean;
}

/** `bitmapfont` の設定。 */
export interface BitmapFontConfig {
  /** XML を使う場合 true。fnt が XML でない場合は JSON かテキストとして解釈します。 */
  xmlFormat?: boolean;
  /** 設定ファイル内のパスを基準に画像パスを解決するか (既定 true) */
  basePath?: boolean;
}

interface LoadItem {
  key: string;
  url: string;
  type: AssetType;
  config?: SpritesheetConfig | AtlasConfig | BitmapFontConfig;
  /** bitmapfont で明示指定されたフォント画像 URL */
  dataURL?: string;
}

/** `progress` イベントで渡される進捗。 */
export interface LoadProgress {
  /** 完了したファイル数 */
  loaded: number;
  /** 全体のファイル数 */
  total: number;
  /** 0〜1 の進捗率 */
  progress: number;
}

/** LoaderManager が発火するイベント。 */
export interface LoaderEvents {
  /** ファイル 1 件の読み込みが完了した */
  filecomplete: (key: string, type: AssetType) => void;
  /** 進捗が動いた */
  progress: (value: LoadProgress) => void;
  /** キューが空になって全部終わった (キューが空のまま開始した場合も発火します) */
  complete: () => void;
}

type Listener = (...args: never[]) => void;

export class LoaderManager {
  private _queue: LoadItem[] = [];
  private _cache: Map<string, unknown> = new Map();
  private _isLoading = false;
  private _textureManager: TextureManager | null = null;

  /** イベント名 → リスナ。Phaser 互換の `on` / `once` / `off` を使います。 */
  private _listeners: Map<string, Listener[]> = new Map();

  constructor(textureManager?: TextureManager) {
    this._textureManager = textureManager || null;
  }

  /**
   * TextureManager を設定します。
   */
  public setTextureManager(textureManager: TextureManager): void {
    this._textureManager = textureManager;
  }

  // ============================================================
  // イベントの購読 (Phaser 互換)
  // ============================================================

  /**
   * イベントを購読します。
   *
   * @param event イベント名
   * @param fn ハンドラ
   * @param context `this` として渡す値
   */
  public on<K extends keyof LoaderEvents>(
    event: K,
    fn: LoaderEvents[K],
    context?: unknown,
  ): this {
    const bound = context === undefined ? fn : fn.bind(context);
    const list = this._listeners.get(event);
    if (list === undefined) {
      this._listeners.set(event, [bound as Listener]);
    } else {
      list.push(bound as Listener);
    }
    return this;
  }

  /**
   * イベントを 1 度だけ購読します。
   *
   * 発火時に自身を解除してから呼ぶので、2 回目以降は呼ばれません。
   */
  public once<K extends keyof LoaderEvents>(
    event: K,
    fn: LoaderEvents[K],
    context?: unknown,
  ): this {
    const wrapped = (): void => {
      this.off(event, wrapped as unknown as LoaderEvents[K]);
      // 呼び出し側が決める引数型を持つため、ここでは無参数的関数として扱います。
      const call = fn as unknown as () => void;
      if (context === undefined) call();
      else call.call(context);    };
    return this.on(event, wrapped as unknown as LoaderEvents[K]);
  }

  /**
   * イベントの購読を解除します。
   *
   * @returns 解除できたら true
   */
  public off<K extends keyof LoaderEvents>(event: K, fn: LoaderEvents[K]): boolean {
    const list = this._listeners.get(event);
    if (list === undefined) return false;
    for (let i = 0; i < list.length; i++) {
      if (list[i] === fn || (list[i] as unknown) === (fn as unknown)) {
        list.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  /** イベントを発火します。リスナは登録順に呼ばれます。 */
  private _emit(event: keyof LoaderEvents, ...args: never[]): void {
    const list = this._listeners.get(event);
    if (list === undefined || list.length === 0) return;
    // 走査長を固定してから回します。emit 中に購読が変わっても安全です。
    const n = list.length;
    for (let i = 0; i < n; i++) {
      const fn = list[i];
      if (fn === undefined) continue;
      fn(...args);
    }
  }

  // ============================================================
  // キューへの追加
  // ============================================================

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
   *
   * 引数形は Phaser と同じ `{ frameWidth, frameHeight }` オブジェクトです。
   */
  public spritesheet(key: string, url: string, config: SpritesheetConfig): this {
    if (!this._cache.has(key)) {
      this._queue.push({ key, url, type: 'spritesheet', config });
    }
    return this;
  }

  /**
   * TexturePacker のアトラスをキューに追加します。
   *
   * @param key 登録キー
   * @param url アトラス JSON の URL
   * @param config 省略時は JSON の meta.image を使います
   */
  public atlas(key: string, url: string, config?: AtlasConfig): this {
    if (!this._cache.has(key)) {
      this._queue.push({ key, url, type: 'atlas', config });
    }
    return this;
  }

  /**
   * ビットマップフォントをキューに追加します。
   *
   * @param key 登録キー
   * @param url .fnt の URL
   * @param dataURL フォント画像。省略時は .fnt 内の file を参照します
   */
  public bitmapfont(key: string, url: string, dataURL?: string | BitmapFontConfig): this {
    if (!this._cache.has(key)) {
      const config: BitmapFontConfig =
        typeof dataURL === 'string' || dataURL === undefined
          ? { xmlFormat: url.endsWith('.xml') }
          : dataURL;
      const item: LoadItem = { key, url, type: 'bitmapfont', config };
      if (typeof dataURL === 'string') item.dataURL = dataURL;
      this._queue.push(item);
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

  /** キューに入っているアセットの数 */
  public get pendingCount(): number {
    return this._queue.length;
  }

  /** 読み込み中のか */
  public get isLoading(): boolean {
    return this._isLoading;
  }

  // ============================================================
  // 読み込み
  // ============================================================

  /**
   * キューに積まれたすべてのアセットを非同期でロードし、GPUテクスチャへ転送します。
   *
   * キューが空でも `complete` を 1 度発火します（`once('complete')` の登録漏れを防ぐため）。
   */
  public async start(): Promise<void> {
    if (this._isLoading) return;
    this._isLoading = true;

    const items = this._queue;
    this._queue = [];
    const total = items.length;
    let loaded = 0;

    const promises = new Array<Promise<void>>(total);
    for (let i = 0; i < total; i++) {
      promises[i] = this._loadItem(items[i]).then(() => {
        loaded++;
        this._emit('filecomplete', items[i].key as never, items[i].type as never);
        this._emit('progress', {
          loaded,
          total,
          progress: total === 0 ? 1 : loaded / total,
        } as never);
      });
    }
    await Promise.all(promises);

    this._isLoading = false;
    this._emit('complete');
  }

  private async _loadItem(item: LoadItem): Promise<void> {
    try {
      const response = await fetch(item.url);
      if (!response.ok) {
        throw new Error(`Failed to load ${item.url}: ${response.statusText}`);
      }

      switch (item.type) {
        case 'image': {
          const image = await responseToImage(response);
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
          const image = await responseToImage(response);
          const config = item.config as SpritesheetConfig;
          const opts = { frameWidth: config.frameWidth, frameHeight: config.frameHeight };
          let texAsset: TextureAsset | undefined;
          if (this._textureManager) {
            texAsset = this._textureManager.addSpritesheet(item.key, image, opts);
          }
          this._cache.set(item.key, {
            type: 'spritesheet',
            image,
            config,
            textureAsset: texAsset,
          });
          break;
        }
        case 'atlas': {
          await this._loadAtlas(item);
          break;
        }
        case 'bitmapfont': {
          await this._loadBitmapFont(item);
          break;
        }
        case 'json': {
          this._cache.set(item.key, await response.json());
          break;
        }
        case 'csv':
        case 'yaml': {
          this._cache.set(item.key, await response.text());
          break;
        }
      }
    } catch (e) {
      console.error(`Error loading asset [${item.key}]:`, e);
    }
  }

  /**
   * TexturePacker のアトラスを読み込みます。
   *
   * 設定 JSON を読み、次に画像を読み込み，最后に UV と名前表をまとめて登録します。
   */
  private async _loadAtlas(item: LoadItem): Promise<void> {
    const config = (item.config ?? {}) as AtlasConfig;
    const response = await fetch(item.url);
    if (!response.ok) {
      throw new Error(`Failed to load ${item.url}: ${response.statusText}`);
    }
    const parsed: ParsedAtlas = parseAtlasJson(await response.json());

    // 画像パスは「明示指定 → JSON の meta.image」の順で決めます。
    const imageURL =
      config.textureURL ??
      (parsed.imagePath === null
        ? null
        : resolveRelative(item.url, parsed.imagePath, config.basePath));

    if (imageURL === null) {
      console.error(
        `LoaderManager: atlas [${item.key}] に画像パスがありません。textureURL を指定してください。`,
      );
      this._cache.set(item.key, parsed);
      return;
    }

    const imageResp = await fetch(imageURL);
    if (!imageResp.ok) {
      throw new Error(`Failed to load ${imageURL}: ${imageResp.statusText}`);
    }
    const image = await responseToImage(imageResp);

    let texAsset: TextureAsset | undefined;
    if (this._textureManager) {
      texAsset = this._textureManager.addAtlas(
        item.key,
        image,
        parsed.frames,
        parsed.frameNames,
      );
    }
    this._cache.set(item.key, {
      type: 'atlas',
      image,
      frames: parsed.frames,
      frameNames: parsed.frameNames,
      textureAsset: texAsset,
    });
  }

  /**
   * ビットマップフォントを読み込みます。
   *
   * `.fnt` のテキスト (または JSON) を読み、次にフォント画像を読み込みます。
   * 画像の指定は「dataURL → .fnt 内の file」の順です。
   */
  private async _loadBitmapFont(item: LoadItem): Promise<void> {
    const config = (item.config ?? {}) as BitmapFontConfig;
    const response = await fetch(item.url);
    if (!response.ok) {
      throw new Error(`Failed to load ${item.url}: ${response.statusText}`);
    }

    const text = await response.text();
    let parsed: ParsedBitmapFont;
    if (config.xmlFormat === true || text.trimStart().startsWith('<')) {
      // XML 形式は未対応なので、JSON として解釈できるかを試します。
      try {
        parsed = parseBitmapFontJson(JSON.parse(text));
      } catch {
        console.warn(
          `LoaderManager: XML のビットマップフォント [${item.key}] は未対応です。JSON かテキスト形式を使ってください。`,
        );
        this._cache.set(item.key, { type: 'bitmapfont', name: item.key, chars: [] });
        return;
      }
    } else if (text.trimStart().startsWith('{')) {
      parsed = parseBitmapFontJson(JSON.parse(text));
    } else {
      parsed = parseBitmapFontText(text);
    }

    // 画像パスの解決。dataURL が明示されていればそれを優先します。
    const imageURL =
      item.dataURL ??
      (parsed.imagePath === null
        ? null
        : resolveRelative(item.url, parsed.imagePath, config.basePath));

    let textureAsset: TextureAsset | undefined;
    if (imageURL !== null) {
      const imgResp = await fetch(imageURL);
      if (!imgResp.ok) {
        throw new Error(`Failed to load ${imageURL}: ${imgResp.statusText}`);
      }
      const image = await responseToImage(imgResp);
      // ビットマップフォントの画像は均一グリッドではないため、
      // 各文字の矩形をそのままフレームとして登録します。
      const rects = parsed.chars.map((c) => ({ x: c.x, y: c.y, w: c.width, h: c.height }));
      if (this._textureManager) {
        textureAsset = this._textureManager.addAtlas(item.key, image, rects);
      }
    } else {
      console.warn(
        `LoaderManager: ビットマップフォント [${item.key}] の画像が見つかりません。dataURL を指定してください。`,
      );
    }

    this._cache.set(item.key, {
      type: 'bitmapfont',
      name: parsed.name,
      size: parsed.size,
      lineHeight: parsed.lineHeight,
      chars: parsed.chars,
      textureAsset,
    });
  }

  // ============================================================
  // 参照
  // ============================================================

  /**
   * キャッシュされたアセットを取得します。
   */
  public get(key: string): unknown {
    return this._cache.get(key);
  }

  /** キーがキャッシュされているか (Phaser 互換の exists) */
  public exists(key: string): boolean {
    return this._cache.has(key);
  }

  /**
   * キャッシュをクリアします。
   */
  public clear(): void {
    this._cache.clear();
    this._queue.length = 0;
  }
}

/** fetch の Response を Image へ変換します。 */
async function responseToImage(response: Response): Promise<HTMLImageElement> {
  const blob = await response.blob();
  const image = new Image();
  const objectURL = URL.createObjectURL(blob);
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('画像のデコードに失敗しました'));
      image.src = objectURL;
    });
  } finally {
    // デコード後は Blob を解放してよいので、objectURL も破棄します。
    URL.revokeObjectURL(objectURL);
  }
  return image;
}

/**
 * 設定ファイルの位置を基準に、画像パスを絶対 URL へ解決します。
 *
 * @param baseUrl 設定ファイルの URL
 * @param relative 設定ファイル内に書かれた相対パス
 * @param basePath false の場合はそのまま、true / 省略時は baseUrl のディレクトリを基準にします
 */
function resolveRelative(baseUrl: string, relative: string, basePath?: boolean): string {
  if (basePath === false) return relative;
  try {
    return new URL(relative, baseUrl).href;
  } catch {
    return relative;
  }
}
