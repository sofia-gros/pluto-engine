/**
 * @file AtlasParser.ts
 * @description
 * TexturePacker の JSON (JSON Hash / JSON Array) を解析し、
 * フレーム矩形と名前表を返します。
 *
 * 出力はロード時のみ使う一時オブジェクトなので、毎フレームの new とは無関係です。
 */

/** 解析結果。矩形と名前表の 2 つを持ちます。 */
export interface ParsedAtlas {
  /**
   * フレーム矩形 (ピクセル)。配列順がそのままフレーム番号になります。
   * `Sprite.setFrame()` にはこの添字を渡します。
   */
  frames: { x: number; y: number; w: number; h: number }[];
  /**
   * フレーム名 → フレーム番号の対応表。
   *
   * エンジンはフレームを整数で参照するため、この表は
   * 「TexturePacker のどの名がどの番号になるか」を調べるための補助情報です。
   * `this.load.get(key).frameNames` から参照できます。
   */
  frameNames: Map<string, number>;
  /** アトラス画像のパス。textureURL が無ければ JSON の meta.image を使います。 */
  imagePath: string | null;
}

/** TexturePacker の 1 フレーム分の情報。 */
interface RawFrame {
  frame?: { x: number; y: number; w: number; h: number };
  rotated?: boolean;
  trimmed?: boolean;
  spriteSourceSize?: { x: number; y: number; w: number; h: number };
  sourceSize?: { w: number; h: number };
  filename?: string;
}

/**
 * TexturePacker の JSON を解析します。
 *
 * - JSON Hash 形式 (`{ frames: { name: {...} }, meta: {...} }`) に対応します
 * - 旧形式の配列 (`[ { filename, frame }, ... ]`) にも対応します
 * - `rotated: true` は 90 度回転済みなので、そのまま UV を使います
 *   (-pluto では回転の補正を行わないため、trimmed 情報のみ参照します)
 *
 * @param json 解析済みの JSON オブジェクト
 * @returns 解析結果。形式が読めない場合は空の結果を返します
 */
export function parseAtlasJson(json: unknown): ParsedAtlas {
  const result: ParsedAtlas = {
    frames: [],
    frameNames: new Map(),
    imagePath: null,
  };

  if (json === null || typeof json !== 'object') return result;

  // 旧形式では JSON 自体がフレームの配列です。
  if (Array.isArray(json)) {
    const list = json as RawFrame[];
    for (let i = 0; i < list.length; i++) {
      const raw = list[i];
      const name = raw.filename ?? String(i);
      const rect = normalizeRect(raw);
      if (rect === null) continue;
      result.frames.push(rect);
      result.frameNames.set(name, result.frames.length - 1);
    }
    return result;
  }

  const root = json as {
    frames?: unknown;
    meta?: { image?: string };
  };

  if (typeof root.meta?.image === 'string') {
    result.imagePath = root.meta.image;
  }

  // JSON Hash 形式
  if (root.frames !== null && typeof root.frames === 'object' && !Array.isArray(root.frames)) {
    const names = Object.keys(root.frames as Record<string, RawFrame>);
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const raw = (root.frames as Record<string, RawFrame>)[name];
      const rect = normalizeRect(raw);
      if (rect === null) continue;
      result.frames.push(rect);
      result.frameNames.set(name, result.frames.length - 1);
      // 拡張子を除いた名前でも引けるようにします (Phaser の __BASE 相当の扱い)。
      const dot = name.lastIndexOf('.');
      if (dot > 0) result.frameNames.set(name.slice(0, dot), result.frames.length - 1);
    }
    return result;
  }

  // 旧形式の配列
  if (Array.isArray(root.frames)) {
    const list = root.frames as RawFrame[];
    for (let i = 0; i < list.length; i++) {
      const raw = list[i];
      const name = raw.filename ?? String(i);
      const rect = normalizeRect(raw);
      if (rect === null) continue;
      result.frames.push(rect);
      result.frameNames.set(name, result.frames.length - 1);
    }
  }

  return result;
}

/**
 * TexturePacker のフレーム情報からピクセル矩形を 1 つ取り出します。
 *
 * @returns 取り出せなければ null
 */
function normalizeRect(raw: RawFrame): { x: number; y: number; w: number; h: number } | null {
  if (raw === null || typeof raw !== 'object') return null;

  // `frame` があればそれを使い、無ければ raw 自身を frame とみなします。
  const f = raw.frame ?? (raw as unknown as RawFrame['frame']);
  if (f === undefined || f === null) return null;
  if (typeof f.x !== 'number' || typeof f.y !== 'number') return null;

  const w = typeof f.w === 'number' ? f.w : 0;
  const h = typeof f.h === 'number' ? f.h : 0;
  if (w <= 0 || h <= 0) return null;

  // trimmed なら切り取られた分を元画像上の位置へ加算します。
  // spriteSourceSize は「元画像内での切り抜き位置」です。
  let x = f.x;
  let y = f.y;
  if (raw.trimmed === true && raw.spriteSourceSize !== undefined) {
    x += raw.spriteSourceSize.x;
    y += raw.spriteSourceSize.y;
  }

  return { x, y, w, h };
}
