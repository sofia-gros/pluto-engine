/**
 * @file FontAtlas.ts
 * @description
 * フォントアトラスの生成と、Text へのグリフ供給。
 *
 * 方針:
 *  - 1 枚の Canvas へ ASCII を描画し、輝度を距離場 (SDF) へ変換します
 *  - 生成したアトラスは Texture2DArray の 1 レイヤーへアップロードされ、
 *    他のスプライトと同じインスタンシング経路で描画されます
 *  - 文字ごとに UV と前進幅を持つので、等幅ではなく実際のフォント幅で組版できます
 *
 * 生成は初期化時に 1 度だけ。毎フレームの new はありません。
 */

/** アトラス 1 枚に収める文字コードの範囲 */
const FIRST_CHAR = 32; // スペース
const LAST_CHAR = 126; // ~

export interface FontAtlasOptions {
  /** フォントサイズ (px)。小さいほど処理が軽い */
  fontSize?: number;
  /** アトラスの解像度。fontSize を上書きします */
  atlasSize?: number;
  /** フォントファミリー */
  fontFamily?: string;
  /** グリフ間の余白 (アトラスセル内) */
  padding?: number;
  /** 距離場へ変換する際の帯の幅 (px) */
  spread?: number;
}

export class FontAtlas {
  /** GPU Texture2DArray のレイヤーインデックス */
  public readonly layerIndex: number;
  /** グリフの数 */
  public readonly glyphCount: number;
  /** 1 グリフあたりの UV 幅・高さ (0-1) */
  public readonly cellWidth: number;
  public readonly cellHeight: number;
  /** 基準となる fontSize (前進幅の計算に使う) */
  public readonly fontSize: number;

  /** 文字コードごとの UV。 Garbage を避けるため初期化時に確保します。 */
  private readonly _uvX: Float32Array;
  private readonly _uvY: Float32Array;
  private readonly _uvW: Float32Array;
  private readonly _uvH: Float32Array;
  /** 文字コードごとの前進幅 (fontSize 単位) */
  private readonly _advance: Float32Array;
  /** アトラス分解能での 1 グリフ幅 */
  private readonly _pixelAdvance: Float32Array;

  constructor(
    device: { uploadTexture: (key: string, source: HTMLCanvasElement) => unknown },
    key: string,
    options: FontAtlasOptions = {},
  ) {
    const fontSize = options.fontSize ?? 32;
    const padding = options.padding ?? 2;
    const spread = options.spread ?? 4;
    const fontFamily = options.fontFamily ?? 'sans-serif';

    this.glyphCount = LAST_CHAR - FIRST_CHAR + 1;
    const cols = Math.ceil(Math.sqrt(this.glyphCount));
    const rows = Math.ceil(this.glyphCount / cols);
    this.cellWidth = 1 / cols;
    this.cellHeight = 1 / rows;
    this.fontSize = fontSize;

    this._uvX = new Float32Array(this.glyphCount);
    this._uvY = new Float32Array(this.glyphCount);
    this._uvW = new Float32Array(this.glyphCount);
    this._uvH = new Float32Array(this.glyphCount);
    this._advance = new Float32Array(this.glyphCount);
    this._pixelAdvance = new Float32Array(this.glyphCount);

    // --- 1. テキストを Canvas へ描画 ---
    // glyphBox はアトラス分解能での 1 セル幅です
    const glyphBox = fontSize * 2;
    const canvasW = cols * glyphBox;
    const canvasH = rows * glyphBox;

    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to acquire 2d context for font atlas');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `${fontSize}px ${fontFamily}`;

    for (let i = 0; i < this.glyphCount; i++) {
      const code = FIRST_CHAR + i;
      const col = i % cols;
      const row = (i / cols) | 0;
      const px = col * glyphBox;
      const py = row * glyphBox;

      const char = String.fromCharCode(code);
      ctx.fillText(char, px + padding, py + glyphBox - padding);

      // 幅の計測は 1 度だけ行う
      const m = ctx.measureText(char);
      const advance = m.width / fontSize;
      this._advance[i] = advance;
      this._pixelAdvance[i] = m.width;

      this._uvX[i] = (px + padding) / canvasW;
      this._uvY[i] = 1.0 - (py + glyphBox - padding) / canvasH;
      this._uvW[i] = (glyphBox - padding * 2) / canvasW;
      this._uvH[i] = (glyphBox - padding * 2) / canvasH;
    }

    // --- 2. 輝度から符号付き距離場へ変換 ---
    // 2 パスとも ImageData を再取得せず、1 度だけ読みます
    const img = ctx.getImageData(0, 0, canvasW, canvasH);
    const src = img.data;
    const w = canvasW;
    const h = canvasH;

    // 内側距離 (文字の内側) と外側距離 (背景側) を別々に計算します
    const inner = new Float32Array(w * h);
    const outer = new Float32Array(w * h);
    inner.fill(1e9);
    outer.fill(1e9);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        // 文字の 白さは 255
        if (src[i * 4] > 127) {
          inner[i] = 0;
        } else {
          outer[i] = 0;
        }
      }
    }

    chamfer8Step(inner, w, h);
    chamfer8Step(outer, w, h);

    // 差分を取り、SDF として符号化します (0.5 = 輪郭)
    // 符号の向きに注意:
    //   内部距離 = 最も近い文字ピクセルまでの距離 (文字の内側では 0)
    //   外部距離 = 最も近い背景ピクセルまでの距離 (背景では 0)
    // 文字の内側では inner が小さく外側では outer が小さいため、
    // 「外側は正、内側は負」になるよう inner - outer で取ります。
    for (let i = 0; i < w * h; i++) {
      const d = inner[i] - outer[i];
      // d は正なら外側、負なら内側
      const v = 0.5 - d / (spread * 2);
      const c = Math.max(0, Math.min(255, Math.round(v * 255)));
      src[i * 4] = c;
      src[i * 4 + 1] = c;
      src[i * 4 + 2] = c;
      src[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);

    // --- 3. GPU へアップロード ---
    const asset = device.uploadTexture(key, canvas) as { layerIndex?: number };
    this.layerIndex = asset?.layerIndex ?? 0;
    // 生成元の Canvas を保持します (再生成を避け、テスト・デバッグで参照できるように)
    this.canvas = canvas;
  }

  /** 生成元の Canvas (読み取り専用) */
  public readonly canvas: HTMLCanvasElement;

  /**
   * 文字コードに対応する UV を outUv へ書き込み、前進幅を返します。
   * Text 側の FontGlyphSource 契約と同一です。
   */
  public lookup(charCode: number, outUv: Float32Array): number {
    const i = charCode - FIRST_CHAR;
    if (i < 0 || i >= this.glyphCount) {
      // 範囲外は空白として扱います
      outUv[0] = 0;
      outUv[1] = 0;
      outUv[2] = 0;
      outUv[3] = 0;
      return 0;
    }
    outUv[0] = this._uvX[i];
    outUv[1] = this._uvY[i];
    outUv[2] = this._uvW[i];
    outUv[3] = this._uvH[i];
    return this._advance[i];
  }

  /** 文字コードに対応する前進幅 (fontSize 単位) */
  public advanceOf(charCode: number): number {
    const i = charCode - FIRST_CHAR;
    if (i < 0 || i >= this.glyphCount) return 0;
    return this._advance[i];
  }

  /** アトラス分解能でのグリフ幅 (レイアウト計算用) */
  public pixelAdvanceOf(charCode: number): number {
    const i = charCode - FIRST_CHAR;
    if (i < 0 || i >= this.glyphCount) return 0;
    return this._pixelAdvance[i];
  }
}

/**
 * 3x3 の neighborhood を使った 2 パス distance transform。
 * 正確なユークリッド距離ではないため近似ですが、
 * フォントのアンチエイリアス用途には十分です。
 */
function chamfer8Step(field: Float32Array, w: number, h: number): void {
  const d1 = 1.0;
  const d2 = Math.SQRT2;

  // 左上から右下
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let v = field[i];
      if (y > 0) {
        if (x > 0) v = Math.min(v, field[i - w - 1] + d2);
        v = Math.min(v, field[i - w] + d1);
        if (x < w - 1) v = Math.min(v, field[i - w + 1] + d2);
      }
      if (x > 0) v = Math.min(v, field[i - 1] + d1);
      field[i] = v;
    }
  }
  // 右下から左上
  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x;
      let v = field[i];
      if (y < h - 1) {
        if (x < w - 1) v = Math.min(v, field[i + w + 1] + d2);
        v = Math.min(v, field[i + w] + d1);
        if (x > 0) v = Math.min(v, field[i + w - 1] + d2);
      }
      if (x < w - 1) v = Math.min(v, field[i + 1] + d1);
      field[i] = v;
    }
  }
}
