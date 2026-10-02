/**
 * @file Text.ts
 * @description
 * テキスト表示。
 *
 * 設計上の掟: 1 文字につき Sprite オブジェクトを new しません。
 * アリーナの ID を Int32Array に預け、文字列が変わっても可能な限りその ID を再利用します。
 * これにより update ループ内から文字列を変更してもヒープ割り当てが発生しません。
 *
 * フォントの UV を使う場合は FontGlyphSource を注入します。
 * フォントを接続していない場合は
 * アトラス全体を 1 文字 1 クイッドとして描画します。
 * 実装 (Phase 3.3) の MSDF アトラスはこの契約にそのまま接続できます。
 */

/**
 * 1 文字分の UV と前進幅を供給する最小インターフェース。
 */
export interface FontGlyphSource {
  /** GPU Texture2DArray のレイヤーインデックス */
  readonly layerIndex: number;
  /**
   * 文字コードから UV (outUv の 0〜3) と、前進幅 (fontSize 単位) を返します。
   * 未知の文字は 0 を返して構いません。
   */
  lookup(charCode: number, outUv: Float32Array): number;
}

/** 水平方向の揃え */
export type TextAlign = 'left' | 'center' | 'right';

export interface TextStyle {
  /** フォントファミリー名。接続するフォントを選ぶために使います。 */
  fontFamily?: string;
  fontSize?: number;
  color?: number;
  /** 等幅指定。指定時はアトラスの前進幅を無視します。 */
  monospace?: boolean;
  letterSpacing?: number;
  /** 行間 (px)。Phaser 互換の `setLineSpacing`。 */
  lineSpacing?: number;
  /** 折り返し幅 (px)。0 なら折り返しません。Phaser 互換の `setWordWrapWidth`。 */
  wordWrapWidth?: number;
  /** 内側の余白。Phaser 互換の `setPadding`。 */
  padding?: { x?: number; y?: number } | number;
  /** 水平方向の揃え。Phaser 互換の `setAlign`。 */
  align?: TextAlign;
  /**
   * 解像度倍率 (Phaser 互換の `setResolution`)。
   * 1 より大きいと	fontSize` がそのままピクセル寸法になります。
   * 目前的実装ではレイアウト計算の倍率としてのみ使用します。
   */
  resolution?: number;
}

export class Text {
  private _text: string;
  public x: number;
  public y: number;
  private _arena;
  private _style: TextStyle;

  /** 1 文字ごとに確保したアリーナ ID */
  private _ids: Int32Array;
  private _count = 0;

  /** 文字幅取得用のスクラッチ */
  private readonly _uvScratch = new Float32Array(4);

  /** フォント UV の供給元。 */
  private _glyphSource: FontGlyphSource | null = null;
  private _layerIndex = 0;
  private _originX = 0;
  private _originY = 0;

  /**
   * 折り返し後の行レイアウト。
   *
   * `_lineStarts[k]` = 行 k の先頭文字添字、`_lineEnds[k]` = 終端文字添字 (exclusive)。
   * 文字列が変わらない限り `rebuild` は再利用します (R-02: new 禁止)。
   */
  private _lineStarts: Int32Array = new Int32Array(8);
  private _lineEnds: Int32Array = new Int32Array(8);
  private _lineCount = 1;
  /**
   * 折り返し計測の結果を.SoA にキャッシュします。
   * `_advances[i]` = 文字 i の前進幅、`_uvs[i*4..]` = 文字 i の UV。
   *
   * これを保持することで `FontGlyphSource.lookup` は文字列が変わったときだけ
   * 呼ばれ、レイアウト計算と描画の 2 パスで二重に引かれません (R-02)。
   */
  private _advances: Float32Array = new Float32Array(8);
  private _uvs: Float32Array = new Float32Array(8 * 4);
  /** 折り返し結果と判定するための文字列の版。 */
  private _laidOutText = '';
  private _laidOutWrap = -1;

  constructor(
    x: number,
    y: number,
    text: string,
    style: TextStyle,
    arena: import('./InstanceBufferArena').InstanceBufferArena,
  ) {
    this.x = x;
    this.y = y;
    this._text = text;
    this._style = style;
    this._arena = arena;
    this._originX = x;
    this._originY = y;
    this._ids = new Int32Array(16);
    this.rebuild();
  }

  /**
   * フォント UV の供給元を差し替えます (MSDF アトラス接続用)。
   */
  public setGlyphSource(source: FontGlyphSource | null): void {
    this._glyphSource = source;
    this._layerIndex = source?.layerIndex ?? 0;
    // 前進幅はソースに依存するため、折り返しキャッシュを無効化します
    this._laidOutWrap = -1;
    this.rebuild();
  }

  /**
   * レイアウトを作り直します。
   * 文字列長が増えない限り
   * アリーナ ID は再利用されます。
   * ヒープ割り当ては発生しません。
   */
  public rebuild(): void {
    this._layout();
    // `\n` はグリフを持ちません。空き文字の実数です。
    const len = this._glyphTotal;

    if (len > this._ids.length) {
      let newCap = this._ids.length;
      while (newCap < len) newCap *= 2;
      const grown = new Int32Array(newCap);
      grown.set(this._ids);
      this._ids = grown;
    }

    // 余った ID を解放する
    for (let i = len; i < this._count; i++) {
      this._arena.free(this._ids[i]);
    }

    const fontSize = this._style.fontSize ?? 16;
    const color = this._style.color ?? 0xffffffff;
    const monospace = this._style.monospace === true;
    const resolution = this._style.resolution ?? 1;
    const glyphScale = resolution > 0 ? resolution : 1;

    // 内側の余白 (Phaser 互換の `setPadding`)
    const pad = this._style.padding;
    let padX = 0;
    let padY = 0;
    if (typeof pad === 'number') {
      padX = pad;
      padY = pad;
    } else if (pad) {
      padX = pad.x ?? 0;
      padY = pad.y ?? 0;
    }

    const lineSpacing = this._style.lineSpacing ?? 0;
    const align = this._style.align ?? 'left';
    const baseX = this._originX + padX;
    const lineHeight = fontSize + lineSpacing;

    let penX = baseX;
    const arena = this._arena;
    const source = this._glyphSource;

    // 行ごとに 1 度、描画開始 X を決めます (align と折り返し幅から計算)。
    let charIndex = 0;
    for (let line = 0; line < this._lineCount; line++) {
      const lineStart = this._lineStarts[line];
      const lineEnd = this._lineEnds[line];
      const lineLen = lineEnd - lineStart;

      let lineWidth = 0;
      for (let i = 0; i < lineLen; i++) {
        lineWidth += this._advances[lineStart + i];
      }
      // 折り返し幅のぶんだけ広げた領域に対して揃えます。
      const boxWidth = this._style.wordWrapWidth ?? 0;
      let startX = baseX;
      if (align === 'center' && boxWidth > 0) {
        startX = baseX + (boxWidth - lineWidth) * 0.5;
      } else if (align === 'right' && boxWidth > 0) {
        startX = baseX + (boxWidth - lineWidth);
      }
      penX = startX;
      const penY = this._originY + padY + line * lineHeight;

      for (let i = lineStart; i < lineEnd; i++, charIndex++) {
        let id: number;
        if (charIndex < this._count) {
          id = this._ids[charIndex];
          if (arena.idToIndex[id] < 0) {
            // 外部で解放されていた場合は再確保
            id = arena.allocate();
            if (id === -1) break;
            this._ids[charIndex] = id;
          }
        } else {
          id = arena.allocate();
          if (id === -1) break;
          this._ids[charIndex] = id;
        }

        // 必ず密添字で書き込む。ID と密添字は swap-remove により乖離しうるため。
        const idx = arena.idToIndex[id];

        if (source) {
          // UV と前進幅は折り返し計測のフェーズでキャッシュ済みです
          const u = i * 4;
          arena.setUv4(idx, this._uvs[u], this._uvs[u + 1], this._uvs[u + 2], this._uvs[u + 3]);
        } else {
          // フォント未接続時はアトラス全体を描画する
          arena.setUv4(idx, 0.0, 0.0, 1.0, 1.0);
        }
        arena.setFrameIdx(idx, this._layerIndex);
        arena.srcFrame[idx] = 0;
        // シェーダー側で SDF として解釈させるフラグ
        arena.setIsText(idx, 1.0);

        // グリフは回転しないので rotation は 0 のままにします。
        //
        // scale は**倍率**です。ここでは「グリフ 1 文字の表示サイズ」を
        // フレーム寸法として与え、scale = 1 でそのまま描画させます。
        // これによりフォントサイズの変更にも表示サイズが自動的に追従します
        // （以前は scale にピクセル数を渡していました）。
        const glyphSize = (monospace ? fontSize * 0.5 : fontSize) * glyphScale;
        arena.setPosX(idx, penX);
        arena.setPosY(idx, penY);
        arena.setFrameSize(idx, glyphSize, glyphSize);
        arena.setScale(idx, 1.0);
        arena.setTint(idx, color);

        penX += this._advances[i];
      }
    }

    // 改行だけの行などでグリフが 1 つも置けなかった場合に備えて残りを解放します
    this._count = charIndex;

    // テキストが 1 つでもあれば isText バッファの転送が必要です。
    // （packed ミラー側は write-through で個別に dirty が立っています）
    arena.hasText = true;
  }

  /**
   * `\n` と折り返し幅から行レイアウトを計算します。
   *
   * 文字列と折り返し幅が変わらない限り再計算しません。
   * バッファは `rebuild` と同じ貪欲の方式で doubling します。
   */
  private _layout(): void {
    const wrap = this._style.wordWrapWidth ?? 0;
    const key = wrap;
    if (this._laidOutText === this._text && this._laidOutWrap === key) return;
    this._laidOutText = this._text;
    this._laidOutWrap = key;

    const text = this._text;
    // 必要な行数は「改行数 + 1」で上から数えられます
    let maxLines = 1;
    for (let i = 0; i < text.length; i++) {
      if (text.charCodeAt(i) === 10) maxLines++;
    }
    if (this._lineStarts.length < maxLines) {
      let cap = this._lineStarts.length;
      while (cap < maxLines) cap *= 2;
      this._lineStarts = new Int32Array(cap);
      this._lineEnds = new Int32Array(cap);
    }

    const fontSize = this._style.fontSize ?? 16;
    const spacing = this._style.letterSpacing ?? 0;
    const monoAdvance = fontSize * 0.5;
    const source = this._glyphSource;
    const uv = this._uvScratch;

    // 前進幅と UV のキャッシュを確保します
    if (this._advances.length < text.length) {
      let cap = this._advances.length;
      while (cap < text.length) cap *= 2;
      this._advances = new Float32Array(cap);
      this._uvs = new Float32Array(cap * 4);
    }

    let line = 0;
    let start = 0;
    let width = 0;
    let lastSpace = -1;

    /**
     * 1 行を確定します。折り返しで行数が `\n` の数を超えることがあるため、
     * バッファはここで動的に拡張します。
     */
    const flush = (end: number): void => {
      if (line >= this._lineStarts.length) {
        const cap = this._lineStarts.length * 2;
        const s = new Int32Array(cap);
        s.set(this._lineStarts);
        this._lineStarts = s;
        const e = new Int32Array(cap);
        e.set(this._lineEnds);
        this._lineEnds = e;
      }
      this._lineStarts[line] = start;
      this._lineEnds[line] = end;
      line++;
      start = end;
      width = 0;
      lastSpace = -1;
    };

    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code === 10) {
        flush(i);
        start = i + 1;
        continue;
      }
      let adv = monoAdvance + spacing;
      if (source) {
        const a = source.lookup(code, uv);
        const u = i * 4;
        this._uvs[u] = uv[0];
        this._uvs[u + 1] = uv[1];
        this._uvs[u + 2] = uv[2];
        this._uvs[u + 3] = uv[3];
        if (a > 0) adv = a * fontSize + spacing;
      } else {
        const u = i * 4;
        this._uvs[u] = 0;
        this._uvs[u + 1] = 0;
        this._uvs[u + 2] = 1;
        this._uvs[u + 3] = 1;
      }
      this._advances[i] = adv;
      if (code === 32) lastSpace = i;
      width += adv;
      // 折り返し幅を超えたら、直前の空白で折り返します
      if (wrap > 0 && width > wrap && lastSpace > start) {
        flush(lastSpace);
        i = lastSpace;
        width = 0;
        lastSpace = -1;
      }
    }
    // 最後の行は必ず確定します。折り返しで既に flush 済みでも空行は残します
    flush(text.length);
    this._lineCount = line;

    // グリフ数 = 全行の文字数の合計 (`\n` を除く)
    let total = 0;
    for (let k = 0; k < line; k++) total += this._lineEnds[k] - this._lineStarts[k];
    this._glyphTotal = total;
  }

  /** 折り返し後のグリフ総数。`\n` は数えません。 */
  private _glyphTotal = 0;

  public get text(): string {
    return this._text;
  }

  public set text(value: string) {
    if (this._text !== value) {
      this._text = value;
      this.rebuild();
    }
  }

  /**
   * 基準位置を設定し、レイアウトを再計算します。
   */
  public setPosition(x: number, y: number): void {
    this._originX = x;
    this._originY = y;
    this.x = x;
    this.y = y;
    this.rebuild();
  }

  public get glyphCount(): number {
    return this._count;
  }

  public destroy(): void {
    for (let i = 0; i < this._count; i++) {
      this._arena.free(this._ids[i]);
    }
    this._count = 0;
  }
}
