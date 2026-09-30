import type {
  BufferInfo,
  GraphicsDevice,
  PipelineInfo,
  TextureAsset,
  TextureFrame,
  TextureUploadOptions,
} from './GraphicsDevice';

/**
 * WebGL2 スプライト描画用の頂点シェーダー（GLSL ES 3.0）
 * インスタンシング属性を使用し、SoA データを直接処理する。
 */
const SPRITE_VERT_GLSL = `#version 300 es
precision highp float;

layout(location = 0) in vec2 vertexPos;
layout(location = 1) in vec2 vertexUV;
layout(location = 2) in float posX;
layout(location = 3) in float posY;
layout(location = 4) in float scale;
layout(location = 5) in float facing;
layout(location = 6) in float rotation;
// 0.0 なら描画をスキップします (Phaser 互換の setVisible)。
// かつては depth (描画順) をここに渡していましたが、頂点シェーダで
// 参照されておらず、デッド属性でした。頂点属性には上限 (WebGL2 では 16) が
// あるため、空いた枠を可視性に使っています。
layout(location = 7) in float visible;
layout(location = 8) in float uvX;
layout(location = 9) in float uvY;
layout(location = 10) in float uvW;
layout(location = 11) in float uvH;
layout(location = 12) in float frameIdx;
layout(location = 13) in vec4 tint;
// 1.0 のインスタンスは SDF テキスト。0.0 は通常のスプライト。
layout(location = 14) in float isText;

uniform mat4 projectionMatrix;

out vec2 vUV;
out float vLayer;
out vec4 vTint;
out float vIsText;
out float vVisible;

void main() {
    // 頂点を中心に scale してから rotation だけ回す
    vec2 scaled = vertexPos * scale;
    float c = cos(rotation);
    float s = sin(rotation);
    vec2 rotated = vec2(scaled.x * c - scaled.y * s, scaled.x * s + scaled.y * c);
    vec2 worldPos = vec2(rotated.x * facing, rotated.y) + vec2(posX, posY);
    gl_Position = projectionMatrix * vec4(worldPos, 0.0, 1.0);
    vUV = vertexUV * vec2(uvW, uvH) + vec2(uvX, uvY);
    vLayer = frameIdx;
    vTint = tint;
    vIsText = isText;
    vVisible = visible;
}
`;

/**
 * WebGL2 スプライト描画用のフラグメントシェーダー（GLSL ES 3.0）
 * sampler2DArray でテクスチャアトラスを参照し、Tint 色を乗算する。
 */
const SPRITE_FRAG_GLSL = `#version 300 es
precision highp float;

uniform highp sampler2DArray textureArray;
// SDF の輪郭位置。0.5 がグリフの縁に対応します。
uniform float sdfThreshold;
// 輪郭をぼかす幅 (0.0 はハードエッジ)
uniform float sdfSmoothing;

in vec2 vUV;
in float vLayer;
in vec4 vTint;
// 1.0 のインスタンスは SDF テキストとして扱います。
in float vIsText;
// 0.0 のインスタンスは描画しません (setVisible(false))。
in float vVisible;

out vec4 fragColor;

void main() {
    // 非表示のインスタンスはテクスチャを引かずに打ち切ります。
    // フラグメント側で捨てることで、テクスチャフェッチを回避できます。
    if (vVisible < 0.5) discard;

    vec4 texColor = texture(textureArray, vec3(vUV, vLayer));
    // 通常のスプライトはテクスチャの色をそのまま使います。
    // テキスト (isText = 1) だけ距離場を閾値で切り、輪郭を滑らかにします。
    if (vIsText > 0.5) {
        float alpha = smoothstep(sdfThreshold - sdfSmoothing, sdfThreshold + sdfSmoothing, texColor.r);
        fragColor = vec4(vTint.rgb, vTint.a * alpha);
    } else {
        fragColor = texColor * vTint;
    }
}
`;

export class WebGL2Device implements GraphicsDevice {
  private gl: WebGL2RenderingContext | null = null;
  private currentPipeline: WebGLProgram | null = null;

  private spritePipeline: PipelineInfo | null = null;
  /** setupInstancedAttributes で使うバッファ表。クロージャを new しないため保持します。 */
  private _boundBuffers: Record<string, BufferInfo> = {};
  private quadBuffer: WebGLBuffer | null = null;
  private textureArray: WebGLTexture | null = null;

  /**
   * テクスチャ配列のサイズ設定。
   *
   * 3D テクスチャの領域は width * height * 4 * layers バイトを
   * 丸ごと確保します。2048 x 2048 x 64 は **1 GB** になるため、
   * メモリが限られた環境 (CI ランナー / ソフトウェアラスタライザ) では
   * 確保に失敗して WebGL コンテキストごと失効します。
   * 実測で CI 上で `CONTEXT_LOST_WEBGL` が出たため、
   * 初期化時に確保結果を確認し、段階的に小さくして再試行します。
   */
  public textureWidth = 2048;
  public textureHeight = 2048;
  public maxLayers = 64;
  private currentLayerCount = 1; // Layer 0 は白色単色ピクセル

  /** コンテキスト喪失を検出したら true。失効中の描画はスキップします。 */
  private contextLost = false;

  private textures: Map<string, TextureAsset> = new Map();

  async init(canvas: HTMLCanvasElement): Promise<void> {
    // preserveDrawingBuffer は既定で無効です。このままだと
    // 合成後の描画バッファが破棄されるため、.canvas へ drawImage しても
    // 透明な 0 が返り、描画の有無を自動テストで判定できません。
    // URL に ?preserveDrawingBuffer を付けたときだけ有効化します
    // (通常の実行では性能に影響しません)。
    const params =
      typeof location !== 'undefined' ? new URLSearchParams(location.search) : null;
    const attributes: WebGLContextAttributes = {
      preserveDrawingBuffer: params?.has('preserveDrawingBuffer') ?? false,
    };
    const gl = (canvas.getContext('webgl2', attributes) ||
      canvas.getContext('experimental-webgl2', attributes)) as WebGL2RenderingContext | null;
    if (!gl) {
      throw new Error('WebGL2 is not supported');
    }
    this.gl = gl;

    // コンテキスト喪失を検出します。
    // 喪失中は一切描画せず、黙って 60 FPS を走り続けます
    // (CI で実際に発生しました。描画が死んでいても
    //  ループは動くため、FPS だけでは検出できません)。
    canvas.addEventListener('webglcontextlost', (e) => {
      // preventDefault しないと restored が発火しません。
      e.preventDefault();
      this.contextLost = true;
      console.error(
        '[WebGL2Device] WebGL context lost. ' +
          'The texture array is allocated in one shot, so a 1 GB shortfall ' +
          'will kill the context. Check the GPU memory budget.',
      );
    });
    canvas.addEventListener('webglcontextrestored', () => {
      this.contextLost = false;
      console.warn('[WebGL2Device] WebGL context restored. Rebuilding the texture array.');
      this.currentLayerCount = 1;
      this.textures.clear();
      this.initTextureArray();
    });

    // ブレンド設定 (透過PNG対応)
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    // Texture2DArray の初期化 (Layer 0 に白ピクセルを格納)
    this.initTextureArray();
  }

  /** コンテキストが失効していないか */
  public isContextLost(): boolean {
    return this.contextLost;
  }

  /**
   * テクスチャ配列を確保します。
   *
   * 大きな領域から順に試し、`texImage3D` が GL エラーを返したら
   * 半分に落として再試行します。どの段階で成功したかを
   * `textureWidth` / `textureHeight` に反映します
   * (UV の正規化がこの値を使うため、必ず実際の値に揃える必要があります)。
   *
   * @returns 確保に成功したら true。すべて失敗したら false
   */
  private allocateTextureArray(): boolean {
    if (!this.gl) return false;

    let w = this.textureWidth;
    let h = this.textureHeight;

    while (w >= 64 && h >= 64) {
      // 過去のエラーを先に消化して、今回の判定を偽陽性にしないようにします。
      // getError() は 1 回しかエラーを返さないため、ループで空になるまで回します。
      while (this.gl.getError() !== this.gl.NO_ERROR) {
        /* 溜まっているエラーを捨てる */
      }

      this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.textureArray);
      this.gl.texImage3D(
        this.gl.TEXTURE_2D_ARRAY,
        0,
        this.gl.RGBA,
        w,
        h,
        this.maxLayers,
        0,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        null,
      );

      const err = this.gl.getError();
      if (err === this.gl.NO_ERROR) {
        this.textureWidth = w;
        this.textureHeight = h;
        return true;
      }

      // コンテキスト喪失なら、これ以上縮小しても意味がありません。
      if (err === this.gl.CONTEXT_LOST_WEBGL) {
        this.contextLost = true;
        return false;
      }

      w = Math.max(64, w >> 1);
      h = Math.max(64, h >> 1);
    }
    return false;
  }

  private initTextureArray(): void {
    if (!this.gl) return;
    this.textureArray = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.textureArray);

    // テクスチャパラメータ (ピクセルアート向けニアレスト隣接)
    this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

    if (!this.allocateTextureArray()) {
      throw new Error(
        'Failed to allocate the texture array: ' +
          `${this.maxLayers} layers could not be allocated ` +
          `(contextLost=${this.contextLost}). ` +
          'GPU memory is insufficient. Reduce the texture array size or layer count.',
      );
    }

    // Layer 0: 単色・未テクスチャ用 1x1 白ピクセルを書き込み
    const whitePixel = new Uint8Array([255, 255, 255, 255]);
    this.gl.texSubImage3D(
      this.gl.TEXTURE_2D_ARRAY,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      whitePixel,
    );

    // レイヤー0アセットをデフォルト白テクスチャとして登録
    this.textures.set('__default_white__', {
      key: '__default_white__',
      layerIndex: 0,
      width: 1,
      height: 1,
      frames: [{ uvX: 0, uvY: 0, uvW: 1.0 / this.textureWidth, uvH: 1.0 / this.textureHeight }],
    });
  }

  /**
   * 画像・Canvasを GPU の Texture2DArray に転送し、スプライト用の TextureAsset を生成します。
   */
  uploadTexture(
    key: string,
    source: HTMLImageElement | HTMLCanvasElement | ImageBitmap | ImageData,
    options?: TextureUploadOptions,
  ): TextureAsset {
    if (!this.gl || !this.textureArray) {
      throw new Error('Device or texture array not initialized');
    }

    if (this.textures.has(key)) {
      return this.textures.get(key)!;
    }

    if (this.currentLayerCount >= this.maxLayers) {
      console.warn(`TextureArray layer limit reached (${this.maxLayers}). Reusing existing layer.`);
      return this.textures.get('__default_white__')!;
    }

    const layerIndex = this.currentLayerCount++;
    const width = source.width;
    const height = source.height;

    this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.textureArray);

    // GPU への直接サブ画像転送 (TexSubImage3D)
    this.gl.texSubImage3D(
      this.gl.TEXTURE_2D_ARRAY,
      0,
      0,
      0,
      layerIndex,
      width,
      height,
      1,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      source as any,
    );

    // フレーム UV 座標の計算
    const frames: TextureFrame[] = [];
    const explicit = options?.frames;
    if (explicit !== undefined && explicit.length > 0) {
      // 明示指定がある場合はピクセル矩形のまま正規化します (アトラス用)。
      for (let i = 0; i < explicit.length; i++) {
        const r = explicit[i];
        frames.push({
          uvX: r.x / this.textureWidth,
          uvY: r.y / this.textureHeight,
          uvW: r.w / this.textureWidth,
          uvH: r.h / this.textureHeight,
        });
      }
    } else {
      const gridW = options?.frameWidth || width;
      const gridH = options?.frameHeight || height;

      const cols = Math.max(1, Math.floor(width / gridW));
      const rows = Math.max(1, Math.floor(height / gridH));

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          frames.push({
            uvX: (c * gridW) / this.textureWidth,
            uvY: (r * gridH) / this.textureHeight,
            uvW: gridW / this.textureWidth,
            uvH: gridH / this.textureHeight,
          });
        }
      }
    }

    const asset: TextureAsset = {
      key,
      layerIndex,
      width,
      height,
      frameWidth: options?.frameWidth || width,
      frameHeight: options?.frameHeight || height,
      frames,
    };

    this.textures.set(key, asset);
    return asset;
  }

  getTexture(key: string): TextureAsset | undefined {
    return this.textures.get(key);
  }

  initPipelines(): void {
    this.spritePipeline = this.createPipeline(SPRITE_VERT_GLSL, SPRITE_FRAG_GLSL);
    this.createQuadBuffer();
  }

  private createQuadBuffer(): void {
    if (!this.gl) return;
    // スプライト用 Quad (4頂点 Triangle Strip)
    const quadData = new Float32Array([
      -0.5, -0.5, 0.0, 0.0, 0.5, -0.5, 1.0, 0.0, -0.5, 0.5, 0.0, 1.0, 0.5, 0.5, 1.0, 1.0,
    ]);
    this.quadBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, quadData, this.gl.STATIC_DRAW);
  }

  createBuffer(size: number): BufferInfo {
    if (!this.gl) throw new Error('Device not initialized');
    const buffer = this.gl.createBuffer();
    if (!buffer) throw new Error('Failed to create WebGL2 buffer');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, size, this.gl.DYNAMIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    return { buffer, size };
  }

  /**
   * SoA 配列を GPU へ転送します。
   *
   * `TypedArray.prototype.subarray()` は呼び出しごとに新しいビューオブジェクトを
   * ヒープへ確保するため、毎フレーム呼ぶとゼロアロケーションの掟に反します。
   * WebGL2 の bufferSubData は srcOffset / length を受け取れるため、
   * 配列全体と範囲だけを渡し、ビュー生成を完全に排除します。
   */
  updateBuffer(
    bufferInfo: BufferInfo,
    data: Float32Array | Uint32Array | Uint8Array,
    srcOffset = 0,
    length?: number,
  ): void {
    if (!this.gl) throw new Error('Device not initialized');
    const buffer = bufferInfo.buffer as WebGLBuffer;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferSubData(
      this.gl.ARRAY_BUFFER,
      0,
      data,
      srcOffset,
      length ?? data.length - srcOffset,
    );
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  clear(r: number, g: number, b: number, a: number): void {
    if (!this.gl) return;
    // コンテキスト喪失中の clear / draw はすべて無効命令になります。
    // 無駄な GPU 通信を避けて黙ります。
    if (this.contextLost) return;
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  bindShaders(sdfThreshold = 0.5, sdfSmoothing = 0.08): void {
    if (this.spritePipeline && this.gl) {
      this.bindPipeline(this.spritePipeline);
      // Texture2DArray をバインド
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.textureArray);
      const program = this.spritePipeline.id as WebGLProgram;
      const loc = this.gl.getUniformLocation(program, 'textureArray');
      if (loc !== null) {
        this.gl.uniform1i(loc, 0);
      }
      // SDF テキスト用の閾値。uniform を忘れると未定義値になりグリフが消えます。
      const t = this.gl.getUniformLocation(program, 'sdfThreshold');
      if (t !== null) this.gl.uniform1f(t, sdfThreshold);
      const s = this.gl.getUniformLocation(program, 'sdfSmoothing');
      if (s !== null) this.gl.uniform1f(s, sdfSmoothing);
    }
  }

  setupInstancedAttributes(buffers: Record<string, BufferInfo>): void {
    if (!this.gl || !this.spritePipeline) return;

    // 0: vertexPos, 1: vertexUV
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
    this.gl.enableVertexAttribArray(0);
    this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 16, 0);

    this.gl.enableVertexAttribArray(1);
    this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, 16, 8);

    this._boundBuffers = buffers;
    this._bindAttr(2, 'posX');
    this._bindAttr(3, 'posY');
    this._bindAttr(4, 'scale');
    this._bindAttr(6, 'rotation');
    // 7: visible (未使用だった枠を可視性フラグとして再利用)
    this._setDefault(7, 'visible', 1.0);

    this._setDefault(5, 'facing', 1.0);
    this._setDefault(8, 'uvX', 0.0);
    this._setDefault(9, 'uvY', 0.0);
    this._setDefault(10, 'uvW', 1.0);
    this._setDefault(11, 'uvH', 1.0);
    this._setDefault(12, 'frameIdx', 0.0);

    if (buffers['tint']) {
      const b = buffers['tint'];
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, b.buffer);
      this.gl.enableVertexAttribArray(13);
      this.gl.vertexAttribPointer(13, 4, this.gl.UNSIGNED_BYTE, true, 0, 0);
      this.gl.vertexAttribDivisor(13, 1);
    } else {
      this.gl.disableVertexAttribArray(13);
      this.gl.vertexAttrib4f(13, 1.0, 1.0, 1.0, 1.0);
    }

    // 14: isText (SDF テキストか否か)
    this._bindAttr(14, 'isText');
  }

  /** 単一スカラー属性をインスタンス属性としてバインドします。 */
  private _bindAttr(loc: number, bufName: string): void {
    if (!this.gl) return;
    const b = this._boundBuffers[bufName];
    if (b) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, b.buffer);
      this.gl.enableVertexAttribArray(loc);
      this.gl.vertexAttribPointer(loc, 1, this.gl.FLOAT, false, 0, 0);
      this.gl.vertexAttribDivisor(loc, 1);
    }
  }

  /** バッファが無い属性は定数へバインドします (無効化しません)。 */
  private _setDefault(loc: number, bufName: string, def: number): void {
    if (this._boundBuffers[bufName]) {
      this._bindAttr(loc, bufName);
    } else if (this.gl) {
      this.gl.disableVertexAttribArray(loc);
      this.gl.vertexAttrib1f(loc, def);
    }
  }

  private compileShader(type: number, source: string): WebGLShader {
    if (!this.gl) throw new Error('Device not initialized');
    const shader = this.gl.createShader(type);
    if (!shader) throw new Error('Failed to create shader');
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error(`Shader compile error: ${info}`);
    }
    return shader;
  }

  createPipeline(vertSource: string, fragSource: string): PipelineInfo {
    if (!this.gl) throw new Error('Device not initialized');
    const vert = this.compileShader(this.gl.VERTEX_SHADER, vertSource);
    const frag = this.compileShader(this.gl.FRAGMENT_SHADER, fragSource);

    const program = this.gl.createProgram();
    if (!program) throw new Error('Failed to create program');
    this.gl.attachShader(program, vert);
    this.gl.attachShader(program, frag);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(program);
      this.gl.deleteProgram(program);
      throw new Error(`Program link error: ${info}`);
    }

    this.gl.deleteShader(vert);
    this.gl.deleteShader(frag);

    return { id: program };
  }

  bindPipeline(pipeline: PipelineInfo): void {
    if (!this.gl) return;
    this.currentPipeline = pipeline.id as WebGLProgram;
    this.gl.useProgram(this.currentPipeline);
  }

  setUniformMatrix4fv(name: string, matrix: Float32Array): void {
    if (!this.gl || !this.currentPipeline) return;
    const location = this.gl.getUniformLocation(this.currentPipeline, name);
    if (location !== null) {
      this.gl.uniformMatrix4fv(location, false, matrix);
    }
  }

  drawInstanced(activeCount: number): void {
    if (!this.gl) return;
    this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, 0, 4, activeCount);
  }

  destroy(): void {
    if (this.gl) {
      const ext = this.gl.getExtension('WEBGL_lose_context');
      if (ext) {
        ext.loseContext();
      }
      this.gl = null;
      this.currentPipeline = null;
      this.spritePipeline = null;
      this.quadBuffer = null;
      this.textureArray = null;
    }
  }
}
