/**
 * @file BitmapFontParser.ts
 * @description
 * BMFont (AngelCode) の AngelCode テキスト形式と JSON 形式を解析します。
 *
 * 出力はロード時のみ使う一時オブジェクトなので、毎フレームの new とは無関係です。
 */

/** 解析後の 1 文字分のメトリクス。 */
export interface BitmapFontChar {
  /** 文字コード */
  id: number;
  /** テクスチャ内の X 座標 (px) */
  x: number;
  /** テクスチャ内の Y 座標 (px) */
  y: number;
  /** 幅 (px) */
  width: number;
  /** 高さ (px) */
  height: number;
  /** 横方向の繰り上がり (px) */
  xoffset: number;
  /** 縦方向の繰り上がり (px) */
  yoffset: number;
  /** 次の文字への送り幅 (px) */
  xadvance: number;
  /** 字間 (px) */
  xoffsetSpacing?: number;
}

/** 解析結果。 */
export interface ParsedBitmapFont {
  /** フォント名 */
  name: string;
  /** フォントサイズ (px) */
  size: number;
  /** 行送り (px) */
  lineHeight: number;
  /** ページ (テクスチャ画像) の URL */
  imagePath: string | null;
  /** 文字ごとのメトリクス。配列順は文字コード順です。 */
  chars: BitmapFontChar[];
}

/**
 * AngelCode のテキスト形式を解析します。
 *
 * ```
 * info face="Arial" size=32 ...
 * common lineHeight=32 base=26 scaleW=256 scaleH=256 pages=1
 * page id=0 file="arial.png"
 * chars count=95
 * char id=32 x=0 y=0 width=0 height=0 xoffset=0 yoffset=0 xadvance=8 page=0
 * ```
 *
 * @param text ファイル全文
 * @returns 解析結果
 */
export function parseBitmapFontText(text: string): ParsedBitmapFont {
  const result: ParsedBitmapFont = {
    name: '',
    size: 16,
    lineHeight: 16,
    imagePath: null,
    chars: [],
  };

  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') continue;

    if (line.startsWith('info ')) {
      result.name = readQuoted(line, 'face') ?? '';
      const size = readNumber(line, 'size');
      if (size !== null) result.size = size;
      continue;
    }
    if (line.startsWith('common ')) {
      const lh = readNumber(line, 'lineHeight');
      if (lh !== null) result.lineHeight = lh;
      continue;
    }
    if (line.startsWith('page ')) {
      const file = readQuoted(line, 'file');
      if (file !== null) result.imagePath = file;
      continue;
    }
    if (line.startsWith('char ')) {
      const c = readChar(line);
      if (c !== null) result.chars.push(c);
      continue;
    }
  }

  result.chars.sort((a, b) => a.id - b.id);
  return result;
}

/**
 * BMFont の JSON 形式を解析します。
 *
 * @param json 解析済みの JSON
 * @returns 解析結果
 */
export function parseBitmapFontJson(json: unknown): ParsedBitmapFont {
  const result: ParsedBitmapFont = {
    name: '',
    size: 16,
    lineHeight: 16,
    imagePath: null,
    chars: [],
  };
  if (json === null || typeof json !== 'object') return result;

  const root = json as {
    font?: string;
    size?: number;
    lineHeight?: number;
    common?: { lineHeight?: number; pages?: string[] };
    chars?: {
      id?: number;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      xoffset?: number;
      yoffset?: number;
      xadvance?: number;
    }[];
  };

  if (typeof root.font === 'string') result.name = root.font;
  if (typeof root.size === 'number') result.size = root.size;
  if (typeof root.lineHeight === 'number') result.lineHeight = root.lineHeight;
  if (typeof root.common?.lineHeight === 'number') {
    result.lineHeight = root.common.lineHeight;
  }
  if (root.common?.pages !== undefined && root.common.pages.length > 0) {
    result.imagePath = root.common.pages[0];
  }

  if (Array.isArray(root.chars)) {
    for (let i = 0; i < root.chars.length; i++) {
      const c = root.chars[i];
      if (typeof c.id !== 'number') continue;
      result.chars.push({
        id: c.id,
        x: c.x ?? 0,
        y: c.y ?? 0,
        width: c.width ?? 0,
        height: c.height ?? 0,
        xoffset: c.xoffset ?? 0,
        yoffset: c.yoffset ?? 0,
        xadvance: c.xadvance ?? 0,
      });
    }
  }

  result.chars.sort((a, b) => a.id - b.id);
  return result;
}

/** テキストから読み出した 1 行を解析します。 */
function readChar(line: string): BitmapFontChar | null {
  const id = readNumber(line, 'id');
  if (id === null) return null;
  return {
    id,
    x: readNumber(line, 'x') ?? 0,
    y: readNumber(line, 'y') ?? 0,
    width: readNumber(line, 'width') ?? 0,
    height: readNumber(line, 'height') ?? 0,
    xoffset: readNumber(line, 'xoffset') ?? 0,
    yoffset: readNumber(line, 'yoffset') ?? 0,
    xadvance: readNumber(line, 'xadvance') ?? 0,
  };
}

/**
 * `key=value` または `key="value"` 形式の値を読み出します。
 *
 * @param line 対象行
 * @param key 探したいキー
 * @returns 見つからなければ null
 */
function readNumber(line: string, key: string): number | null {
  const re = new RegExp(`(?:^|\\s)${key}=(-?[0-9.]+)`);
  const m = re.exec(line);
  if (m === null) return null;
  const v = parseFloat(m[1]);
  return Number.isNaN(v) ? null : v;
}

/** `key="value"` 形式の文字列を読み出します。 */
function readQuoted(line: string, key: string): string | null {
  const re = new RegExp(`(?:^|\\s)${key}="([^"]*)"`);
  const m = re.exec(line);
  return m === null ? null : m[1];
}
