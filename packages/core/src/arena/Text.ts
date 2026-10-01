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

export interface TextStyle {
  fontSize?: number;
  color?: number;
  /** 等幅指定。指定時はアトラスの前進幅を無視します。 */
  monospace?: boolean;
  letterSpacing?: number;
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

  private _glyphSource: FontGlyphSource | null = null;
  private _layerIndex = 0;
  private _originX = 0;
  private _originY = 0;

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
    this.rebuild();
  }

  /**
   * レイアウトを作り直します。
   * 文字列長が増えない限り
   * アリーナ ID は再利用されます。
   * ヒープ割り当ては発生しません。
   */
  public rebuild(): void {
    const len = this._text.length;

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
    const spacing = this._style.letterSpacing ?? 0;
    const monospace = this._style.monospace === true;
    const monoAdvance = fontSize * 0.5;

    let penX = this._originX;
    const arena = this._arena;
    const source = this._glyphSource;
    const uv = this._uvScratch;

    for (let i = 0; i < len; i++) {
      let id: number;
      if (i < this._count) {
        id = this._ids[i];
        if (arena.idToIndex[id] < 0) {
          // 外部で解放されていた場合は再確保
          id = arena.allocate();
          if (id === -1) break;
          this._ids[i] = id;
        }
      } else {
        id = arena.allocate();
        if (id === -1) break;
        this._ids[i] = id;
      }

      // 必ず密添字で書き込む。ID と密添字は swap-remove により乖離しうるため。
      const idx = arena.idToIndex[id];

      let advance = monoAdvance + spacing;
      if (source) {
        const charCode = this._text.charCodeAt(i);
        const adv = source.lookup(charCode, uv);
        arena.setUv4(idx, uv[0], uv[1], uv[2], uv[3]);
        if (adv > 0) advance = adv * fontSize + spacing;
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
      const glyphSize = monospace ? fontSize * 0.5 : fontSize;
      arena.setPosX(idx, penX);
      arena.setPosY(idx, this._originY);
      arena.setFrameSize(idx, glyphSize, glyphSize);
      arena.setScale(idx, 1.0);
      arena.setTint(idx, color);

      penX += advance;
    }

    this._count = len;

    // テキストが 1 つでもあれば isText バッファの転送が必要です。
    // （packed ミラー側は write-through で個別に dirty が立っています）
    arena.hasText = true;
  }

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
