import type {
  BufferInfo,
  GraphicsDevice,
  PipelineInfo,
  TextureAsset,
  TextureFrame,
  TextureUploadOptions,
} from './GraphicsDevice';
import {
  INSTANCE_BUFFERS,
  QUAD_LOCATION,
  QUAD_STRIDE_BYTES,
  glslInstanceDecl,
} from './InstanceLayout';

/**
 * WebGL2 スプライト描画用の頂点シェーダー（GLSL ES 3.0）
 *
 * インスタンスデータは **vec4 に詰めた 4 バッファ** で渡されます
 * （`InstanceLayout` がレイアウトの単一の情報源）。
 * これにより頂点属性の使用数は 15/16 から 6/16 へ、
 * GPU アップロード単位は 13 本から 4 本へ減ります。
 */
const SPRITE_VERT_GLSL = `#version 300 es
precision highp float;

layout(location = ${QUAD_LOCATION.Pos}) in vec2 vertexPos;
layout(location = ${QUAD_LOCATION.Uv}) in vec2 vertexUV;
${glslInstanceDecl()}

uniform mat4 projectionMatrix;

/**
 * GPU カリング用の可視矩形（ワールド座標）。
 * (minX, minY, maxX, maxY)
 */
uniform vec4 uCullRect;
/** GPU カリングを有効にするか。0 = 無効、1 = 有効。 */
uniform float uGpuCull;

out vec2 vUV;
out float vLayer;
out vec4 vTint;
out float vSpriteFlags;
out float vVisible;

/**
 * クワッドのワールド AABB が可視矩形の外なら縮退三角形を返します。
 *
 * gl_Position をクリップ空間の外 (z = 2) にすることで、
 * ラスタライザが面積 0 として破棄します。
 * これにより CPU 側の partitionVisible (SoA の詰め替え) が不要になり、
 * インスタンス数に比例する CPU コストが消えます。
 */
bool cullOut(vec2 worldCenter, vec2 halfSize) {
    if (uGpuCull < 0.5) return false;
    return worldCenter.x + halfSize.x < uCullRect.x
        || worldCenter.x - halfSize.x > uCullRect.z
        || worldCenter.y + halfSize.y < uCullRect.y
        || worldCenter.y - halfSize.y > uCullRect.w;
}

void main() {
    // iTransform = (posX, posY, scaleX, scaleY)   ※ scale は倍率
    // iUv        = (uvX, uvY, uvW, uvH)
    // iFlags     = (frameIdx, facing, visible, isText)
    // iShape     = (rotation, frameWidth, frameHeight, depth)
    // iOrigin    = (originX, originY, scrollFactorX, scrollFactorY)
    // iTint      = (r, g, b, a)   [unorm8 で正規化済み]

    // 描画サイズは「フレームのピクセル寸法 × スケール倍率」です。
    // scale = 1.0 ならフレームそのままの大きさになります。
    vec2 frameSize = iShape.yz;
    vec2 displaySize = frameSize * iTransform.zw;

    // 原点 (0.5, 0.5 = 中心が既定) を引くとクワッドの位置的原点を再現できます。
    // vertexPos は -0.5〜0.5 の単位クワッドなので、
    // (vertexPos - (origin - 0.5)) * displaySize で原点を動かします。
    vec2 local = (vertexPos - (iOrigin.xy - 0.5)) * displaySize;

    float c = cos(iShape.x);
    float s = sin(iShape.x);
    vec2 rotated = vec2(local.x * c - local.y * s, local.x * s + local.y * c);
    vec2 worldPos = vec2(rotated.x * iFlags.y, rotated.y) + iTransform.xy;

    // 回転を考慮しない AABB（外接矩形）で判定します。
    // 判定を厳密にすると
    // シェーダが重くなりますが、外接矩形なら cos/sin の絶対値だけで足ります。
    float ax = abs(c) * displaySize.x + abs(s) * displaySize.y;
    float ay = abs(s) * displaySize.x + abs(c) * displaySize.y;
    if (cullOut(iTransform.xy, vec2(ax, ay) * 0.5)) {
        // 縮退三角形にしてラスタライザに破棄させます
        gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
        vUV = vec2(0.0);
        vLayer = 0.0;
        vTint = vec4(0.0);
        vSpriteFlags = 0.0;
        vVisible = 0.0;
        return;
    }

    gl_Position = projectionMatrix * vec4(worldPos, 0.0, 1.0);
    vUV = vertexUV * iUv.zw + iUv.xy;
    vLayer = iFlags.x;
    vTint = iTint;
    vSpriteFlags = iFlags.w;
    vVisible = iFlags.z;
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
in float vSpriteFlags;
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
    uint flags = uint(vSpriteFlags + 0.5);
    bool isText = (flags & 1u) != 0u;
    bool isFill = (flags & 2u) != 0u;

    if (isText) {
        float alpha = smoothstep(sdfThreshold - sdfSmoothing, sdfThreshold + sdfSmoothing, texColor.r);
        fragColor = vec4(vTint.rgb, vTint.a * alpha);
    } else if (isFill) {
        fragColor = vec4(vTint.rgb, vTint.a * texColor.a);
    } else {
        fragColor = texColor * vTint;
    }
}
`;

/** シェーダーの uniform 位置をキャッシュするための入れ物 */
interface UniformLocations {
  projectionMatrix: WebGLUniformLocation | null;
  textureArray: WebGLUniformLocation | null;
  sdfThreshold: WebGLUniformLocation | null;
  sdfSmoothing: WebGLUniformLocation | null;
  /** GPU カリングの可視矩形 (minX, minY, maxX, maxY) */
  cullRect: WebGLUniformLocation | null;
  /** GPU カリングの有効フラグ (0 / 1) */
  gpuCull: WebGLUniformLocation | null;
}

/**
 * timestamp query のリングバッファ長。
 *
 * 1 本では結果が返るまで次の draw を出せず Moreover、フレームを止めると
 * 時刻測定そのものがボトルネックになります。3 本で「2〜3 フレーム遅れ」を許容し、
 * 中央値でなら影響しません。
 */
const TSQ_RING = 3;

export class WebGL2Device implements GraphicsDevice {
  private gl: WebGL2RenderingContext | null = null;
  private currentPipeline: WebGLProgram | null = null;

  private spritePipeline: PipelineInfo | null = null;
  /**
   * 頂点属性の指定は VAO に集約します。
   * VAO を買わないと毎フレーム 15 属性を再指定することになり、
   * `baseInstance` 対応のために属性を書き直す必要も出てきます。
   */
  private vao: WebGLVertexArrayObject | null = null;
  /** VAO 作成時に 1 度だけ解決する uniform の位置 */
  private uniforms: UniformLocations = {
    projectionMatrix: null,
    textureArray: null,
    sdfThreshold: null,
    sdfSmoothing: null,
    cullRect: null,
    gpuCull: null,
  };
  private quadBuffer: WebGLBuffer | null = null;
  private textureArray: WebGLTexture | null = null;

  /**
   * テクスチャ配列のサイズ設定。
   *
   * 3D テクスチャの領域は width * height * 4 * layers バイトを
   * 丸ごと確保します。**この確保は失敗しても GL エラーになりません。**
   * ANGLE/Vulkan は `texImage3D` のメモリ不足で
   * コンテキストごと破棄します (`CONTEXT_LOST_WEBGL`)。
   * そのため「大きめに確保してから縮小リトライ」は構造上できず、
   * 最初から安全な既定値で確保する必要があります。
   *
   * 実測: 2048 x 2048 x 64 は **1 GB** で、GitHub Actions ランナー
   * (7 GB / SwiftShader) では確実にコンテキストが失効し、
   * 全デモが「60 FPS でruns したまま何も描画されない」状態になりました。
   * 1 GB を要求するゲームエンジンとしては異常な値です。
   *
   * 既定値は 1024 x 1024 x 64 = **256 MB** にしました。
   * 2D ドット絵向けテクスチャなら 1 レイヤーあたり 1024px あれば
   * 数百〜数千スプライトを余裕で格納できます。
   *
   * メモリがさらに限られる環境では `?textureSize=512` (64 MB) を
   * 付けて指定できます。
   */
  public textureWidth = 1024;
  public textureHeight = 1024;
  public maxLayers = 64;
  private currentLayerCount = 1; // Layer 0 は白色単色ピクセル

  /** コンテキスト喪失を検出したら true。失効中の描画はスキップします。 */
  private contextLost = false;

  private textures: Map<string, TextureAsset> = new Map();

  /** setupInstancedAttributes で束縛したバッファ表。保持してクロージャを new しません。 */
  private _boundBuffers: Record<string, BufferInfo> = {};
  /** 現在の VAO に束縛済みかどうか。baseInstance 変更時にだけ作り直します。 */
  private vaoDirty = true;
  /** 現在の VAO が適用されている baseInstance */
  private vaoBaseInstance = 0;

  async init(canvas: HTMLCanvasElement): Promise<void> {
    // preserveDrawingBuffer は既定で無効です。このままだと
    // 合成後の描画バッファが破棄されるため、.canvas へ drawImage しても
    // 透明な 0 が返り、描画の有無を自動テストで判定できません。
    // URL に ?preserveDrawingBuffer を付けたときだけ有効化します
    // (通常の実行では性能に影響しません)。
    const params = typeof location !== 'undefined' ? new URLSearchParams(location.search) : null;
    const attributes: WebGLContextAttributes = {
      preserveDrawingBuffer: params?.has('preserveDrawingBuffer') ?? false,
    };
    // テクスチャ配列のサイズ上書き。メモリが限られた環境向けです。
    // 例: ?textureSize=512 で 512x512x64 = 64 MB。
    const sizeParam = params?.get('textureSize');
    if (sizeParam !== null && sizeParam !== undefined) {
      const n = Number.parseInt(sizeParam, 10);
      if (Number.isFinite(n) && n >= 64 && n <= 4096) {
        this.textureWidth = n;
        this.textureHeight = n;
      } else {
        console.warn(
          `[WebGL2Device] ?textureSize=${sizeParam} は 64〜4096 の整数でありません。` +
            `既定値 ${this.textureWidth} を使います。`,
        );
      }
    }
    const gl = (canvas.getContext('webgl2', attributes) ||
      canvas.getContext('experimental-webgl2', attributes)) as WebGL2RenderingContext | null;
    if (!gl) {
      throw new Error('WebGL2 is not supported');
    }
    this.gl = gl;
    // GPU 時間計測の拡張はここで要求します（それより後で createQuery できません）
    this._setupTimestampQuery();

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
      this.vaoDirty = true;
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
   * メモリ不足の扱いに注意が必要です。**この確保は GL エラーを返しません。**
   * ANGLE/Vulkan は texImage3D のメモリ不足でコンテキストごと破棄し、
   * getError() も例外も出さず CONTEXT_LOST_WEBGL を返すだけです。
   * 「大きめに確保して失敗したら小さくリトライ」方式是
   * 1 度目で context を失った時点で破綻します。
   * そのため ensure するサイズそのものを安全な既定値にしています。
   *
   * @returns 確保に成功したら true。コンテキストを失った場合は false
   */
  private allocateTextureArray(): boolean {
    if (!this.gl) return false;

    // 過去のエラーを消化します (getError は 1 回しかエラーを返さないためループで空にします)。
    while (this.gl.getError() !== this.gl.NO_ERROR) {
      /* 溜まっているエラーを捨てる */
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.textureArray);
    this.gl.texImage3D(
      this.gl.TEXTURE_2D_ARRAY,
      0,
      this.gl.RGBA,
      this.textureWidth,
      this.textureHeight,
      this.maxLayers,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      null,
    );

    // 確保直後に生存確認します。ANGLE は失敗を CONTEXT_LOST としてのみ返します。
    if (this.gl.isContextLost()) {
      this.contextLost = true;
      return false;
    }

    const bytes = this.textureWidth * this.textureHeight * 4 * this.maxLayers;
    const mb = (bytes / 1024 / 1024).toFixed(0);
    console.log(
      `[WebGL2Device] texture array allocated: ` +
        `${this.textureWidth}x${this.textureHeight} x ${this.maxLayers} layers ` +
        `(= ${mb} MB)`,
    );
    return true;
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
    this.cacheUniformLocations();
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
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  /**
   * uniform の位置をパイプライン作成時に一度だけ解決します。
   * 毎フレーム `getUniformLocation` を呼ぶと文字列探索コストがフレームごとに発生します。
   */
  private cacheUniformLocations(): void {
    if (!this.gl || !this.spritePipeline) return;
    const program = this.spritePipeline.id as WebGLProgram;
    this.uniforms.projectionMatrix = this.gl.getUniformLocation(program, 'projectionMatrix');
    this.uniforms.cullRect = this.gl.getUniformLocation(program, 'uCullRect');
    this.uniforms.gpuCull = this.gl.getUniformLocation(program, 'uGpuCull');
    this.uniforms.textureArray = this.gl.getUniformLocation(program, 'textureArray');
    this.uniforms.sdfThreshold = this.gl.getUniformLocation(program, 'sdfThreshold');
    this.uniforms.sdfSmoothing = this.gl.getUniformLocation(program, 'sdfSmoothing');
  }

  createBuffer(size: number): BufferInfo {
    if (!this.gl) throw new Error('Device not initialized');
    const buffer = this.gl.createBuffer();
    if (!buffer) throw new Error('Failed to create WebGL2 buffer');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, size, this.gl.DYNAMIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    // バッファ実体が入れ替わったので VAO を作り直します。
    this.vaoDirty = true;

    return { buffer, size };
  }

  /**
   * packed ミラーを GPU へ転送します。
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
      if (this.uniforms.textureArray !== null) {
        this.gl.uniform1i(this.uniforms.textureArray, 0);
      }
      // SDF テキスト用の閾値。uniform を忘れると未定義値になりグリフが消えます。
      if (this.uniforms.sdfThreshold !== null) {
        this.gl.uniform1f(this.uniforms.sdfThreshold, sdfThreshold);
      }
      if (this.uniforms.sdfSmoothing !== null) {
        this.gl.uniform1f(this.uniforms.sdfSmoothing, sdfSmoothing);
      }
    }
  }

  /**
   * GPU カリングの可視矩形を設定します。
   *
   * 有効にすると、頂点シェーダが可視矩形の外にあるクワッドを
   * 縮退三角形にして破棄します。これにより CPU 側の SoA 詰め替え
   * （`partitionVisible`）が不要になり、インスタンス数に比例する
   * CPU コストが消えます。
   *
   * @param rect `(minX, minY, maxX, maxY)` のワールド座標 4 要素
   * @param enabled false の場合は頂点シェーダのカリングを無効にします
   */
  setCullRect(rect: Float32Array, enabled: boolean): void {
    const gl = this.gl;
    if (!gl || !this.currentPipeline) return;
    const loc = this.uniforms.cullRect;
    const on = this.uniforms.gpuCull;
    if (loc) gl.uniform4f(loc, rect[0], rect[1], rect[2], rect[3]);
    if (on) gl.uniform1f(on, enabled ? 1 : 0);
  }

  /**
   * インスタンス属性を VAO へ設定します。
   *
   * `baseInstance` を指定すると、可視区間の先頭インスタンスだけを描画できます。
   * WebGL2 には `firstInstance`  引数が無い代替として、
   * `vertexAttribPointer` の `byteOffset`（インスタンス index に加算される）を使います。
   */
  setupInstancedAttributes(
    buffers: Record<string, BufferInfo>,
    activeCount?: number,
    baseInstance = 0,
  ): void {
    void activeCount;
    if (!this.gl || !this.spritePipeline) return;

    // バッファ表が変わった場合は VAO を作り直します。
    if (this._boundBuffers !== buffers) {
      this._boundBuffers = buffers;
      this.vaoDirty = true;
    }

    if (this.vaoDirty || this.vaoBaseInstance !== baseInstance) {
      this.applyVertexAttribs(baseInstance);
      this.vaoBaseInstance = baseInstance;
    }
    this.gl.bindVertexArray(this.vao);
  }

  /**
   * VAO を新規作成して全インスタンス属性を指定します。
   * `baseInstance` を変えたときだけ呼ばれます（毎フレームではありません）。
   */
  private applyVertexAttribs(baseInstance: number): void {
    const gl = this.gl;
    if (!gl || !this.quadBuffer) return;

    const vao = gl.createVertexArray();
    if (!vao) {
      throw new Error('Failed to create WebGL2 vertex array object');
    }
    gl.bindVertexArray(vao);

    // 共有 Quad (per-vertex)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.enableVertexAttribArray(QUAD_LOCATION.Pos);
    gl.vertexAttribPointer(QUAD_LOCATION.Pos, 2, gl.FLOAT, false, QUAD_STRIDE_BYTES, 0);
    gl.enableVertexAttribArray(QUAD_LOCATION.Uv);
    gl.vertexAttribPointer(QUAD_LOCATION.Uv, 2, gl.FLOAT, false, QUAD_STRIDE_BYTES, 8);

    // インスタンス属性 (per-instance)
    // byteOffset に baseInstance * stride を足すことで、firstInstance を実現します。
    // WebGL2 には drawArraysInstanced の firstInstance 引数が無いため、
    // インスタンス index に加算される属性オフセットを利用します。
    for (let b = 0; b < INSTANCE_BUFFERS.length; b++) {
      const spec = INSTANCE_BUFFERS[b];
      if (!spec.eager) continue;
      const info = this._boundBuffers[spec.name];
      if (!info) continue;
      const buf = info.buffer as WebGLBuffer;
      const instanceOffset = baseInstance * spec.stride;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      for (let v = 0; v < spec.vectors; v++) {
        const loc = spec.location + v;
        const attrOffset = instanceOffset + v * (spec.format === 'unorm8x4' ? 4 : 16);
        gl.enableVertexAttribArray(loc);
        if (spec.format === 'unorm8x4') {
          gl.vertexAttribPointer(loc, 4, gl.UNSIGNED_BYTE, true, spec.stride, attrOffset);
        } else {
          gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, spec.stride, attrOffset);
        }
        gl.vertexAttribDivisor(loc, 1);
      }
    }

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // 作り直しになったので古い VAO を破棄します。
    if (this.vao !== null && this.vao !== vao) gl.deleteVertexArray(this.vao);
    this.vao = vao;
    this.vaoDirty = false;
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

    // 別のプログラムへ切り替わったら VAO と uniform のキャッシュを破棄します。
    this.vaoDirty = true;
    this.uniforms.projectionMatrix = null;
    this.uniforms.cullRect = null;
    this.uniforms.gpuCull = null;
    this.uniforms.textureArray = null;
    this.uniforms.sdfThreshold = null;
    this.uniforms.sdfSmoothing = null;

    return { id: program };
  }

  bindPipeline(pipeline: PipelineInfo): void {
    if (!this.gl) return;
    this.currentPipeline = pipeline.id as WebGLProgram;
    this.gl.useProgram(this.currentPipeline);
  }

  setUniformMatrix4fv(name: string, matrix: Float32Array): void {
    if (!this.gl || !this.currentPipeline) return;
    if (name !== 'projectionMatrix') return;
    const location = this.uniforms.projectionMatrix;
    if (location !== null) {
      this.gl.uniformMatrix4fv(location, false, matrix);
    }
  }

  /**
   * 現在の描画結果を `out` へ読み戻します。
   *
   * WebGL は `readPixels` を合成前に呼ぶ必要があるため、
   * **フレームの draw と同じタスク内**から呼ぶ必要があります。
   * ブラウザのスクリーンショット取得は `canvas.toDataURL` を使ってください。
   */
  readPixels(out: Uint8Array, width?: number, height?: number): boolean {
    const gl = this.gl;
    if (!gl) return false;
    if (this.contextLost) return false;

    const w = width ?? gl.drawingBufferWidth;
    const h = height ?? gl.drawingBufferHeight;
    const need = w * h * 4;
    if (out.length < need) return false;

    // まず下原点のまま読み、続けて行を反転して左上原点にします。
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, out);

    if (this._flipRow === null || this._flipRow.length < w * 4) {
      this._flipRow = new Uint8Array(w * 4);
    }
    const rowBytes = w * 4;
    const tmp = this._flipRow;
    for (let y = 0; y < h >> 1; y++) {
      const top = y * rowBytes;
      const bottom = (h - 1 - y) * rowBytes;
      for (let i = 0; i < rowBytes; i++) tmp[i] = out[top + i];
      for (let i = 0; i < rowBytes; i++) out[top + i] = out[bottom + i];
      for (let i = 0; i < rowBytes; i++) out[bottom + i] = tmp[i];
    }
    return true;
  }

  /** readPixels の行反転に使うスクラッチ。スクリーンショット経路のみで使用します。 */
  private _flipRow: Uint8Array | null = null;

  drawInstanced(activeCount: number, baseInstance = 0): void {
    if (!this.gl) return;
    if (this.contextLost) return;
    if (this.vao === null) return;
    // VAO の属性指定は setupInstancedAttributes 側で済んでいるため、
    // ここでは draw のみ発行します。
    void baseInstance;
    const query = this._beginGpuTimer();
    this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, 0, 4, activeCount);
    this._endGpuTimer(query);
  }

  // ---------------------------------------------------------------------
  // GPU 時間計測 (Phase 8 P-02)
  //
  // WebGPU の timestamp query に対応する WebGL2 側の実装です。
  // `EXT_disjoint_timer_query_webgl2` が無ければ計測できないので、
  // 非対応環境では -1 を返します（比較表には「計測不可」と出ます）。
  //
  // 查询は 1 本では再利用できません（結果が返るまで次のフレームを出せないため）。
  // そのため 3 本をリングバッファにして、**2〜3 フレーム遅れのサンプル**を
  // 受けます。中央値を取るため 1〜2 フレームの遅れは測定に影響しません。
  // ---------------------------------------------------------------------

  /** GPU 時間計測が有効か（`enableTimestampQuery` 後かつ拡張が存在） */
  isTimestampQuerySupported(): boolean {
    return this._tsqSupported;
  }

  /** 読み出しに失敗したときの理由（切り分け用） */
  lastTimestampError(): string {
    return this._tsqError;
  }

  /**
   * 直近に読み出せた GPU 時間 (ms) を返します。計測できなければ -1。
   *
   * `GPU_DISJOINT_EXT` が立ったフレームの値は破棄します
   * （timer query の値は交差時に不正になるためです）。
   */
  resolveGpuTimeMs(): number {
    const gl = this.gl;
    if (!gl || !this._tsqSupported || this._tsqError) return -1;
    const ext = this._tsqExt;
    if (!ext) return -1;

    // 完了済みのサンプルから最も新しいものを 1 つだけ採用します。
    let taken = false;
    for (let k = 0; k < TSQ_RING; k++) {
      const slot = (this._tsqNext + k) % TSQ_RING;
      const query = this._tsqQueries[slot];
      if (!query || this._tsqPending[slot] !== true) continue;
      const available = gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE) as boolean;
      if (!available) continue;
      // GPU 側が別の作業中なら値は信用できません
      const disjoint = gl.getParameter(ext.GPU_DISJOINT_EXT) as boolean;
      if (disjoint) {
        this._tsqPending[slot] = false;
        continue;
      }
      const ns = gl.getQueryParameter(query, gl.QUERY_RESULT) as number;
      this._tsqPending[slot] = false;
      if (!taken) {
        this._lastGpuMs = ns / 1e6;
        taken = true;
      }
      // 読み終えたスロットは次のサンプルに再利用します
      this._tsqReusable.push(slot);
    }
    return this._lastGpuMs;
  }

  /**
   * 直近の draw の計測を開始します。
   *
   * リングに空きが無ければ計測をスキップします
   * （强制性で待たせると 오히려 計測そのものがボトルネックになるため）。
   */
  private _beginGpuTimer(): WebGLQuery | null {
    const gl = this.gl;
    if (!gl || !this._tsqSupported || this.contextLost) return null;
    const slot = this._tsqReusable.pop();
    if (slot === undefined) return null;
    const query = this._tsqQueries[slot];
    if (!query) return null;
    const gl2 = gl as WebGL2RenderingContext;
    gl2.beginQuery(this._tsqExt!.TIME_ELAPSED_EXT, query);
    this._tsqPending[slot] = true;
    this._tsqActive = slot;
    return query;
  }

  private _endGpuTimer(query: WebGLQuery | null): void {
    const gl = this.gl;
    if (!gl || !query || this._tsqActive === -1) return;
    const gl2 = gl as WebGL2RenderingContext;
    gl2.endQuery(this._tsqExt!.TIME_ELAPSED_EXT);
    this._tsqNext = (this._tsqActive + 1) % TSQ_RING;
    this._tsqActive = -1;
  }

  /** timestamp query を有効化します。`init()` より前に呼ぶ必要があります。 */
  enableTimestampQuery(): void {
    this._tsqEnabled = true;
  }

  /**
   * `init()` の中で拡張を要求します。
   *
   * 拡張の要求は `init()` の后才有效地行えます
   * （WebGPU の timestamp-query feature と同じ制約です）。
   */
  private _setupTimestampQuery(): void {
    const gl = this.gl;
    if (!gl || !this._tsqEnabled) {
      this._tsqSupported = false;
      return;
    }
    // WebGL2 版という名前の拡張が標準です（旧来の WebGL1 名は使えません）
    const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2') as {
      TIME_ELAPSED_EXT: number;
      GPU_DISJOINT_EXT: number;
      QUERY_COUNTER_BITS_EXT: number;
    } | null;
    if (!ext) {
      this._tsqSupported = false;
      this._tsqError = 'EXT_disjoint_timer_query_webgl2 がありません';
      return;
    }
    this._tsqExt = ext;
    for (let k = 0; k < TSQ_RING; k++) {
      this._tsqQueries[k] = gl.createQuery();
      this._tsqReusable.push(k);
    }
    this._tsqSupported = true;
  }

  private _tsqEnabled = false;
  private _tsqSupported = false;
  private _tsqExt: {
    TIME_ELAPSED_EXT: number;
    GPU_DISJOINT_EXT: number;
    QUERY_COUNTER_BITS_EXT: number;
  } | null = null;
  private _tsqQueries: (WebGLQuery | null)[] = new Array(TSQ_RING).fill(null);
  private _tsqPending: boolean[] = new Array(TSQ_RING).fill(false);
  private _tsqReusable: number[] = [];
  private _tsqNext = 0;
  private _tsqActive = -1;
  private _lastGpuMs = -1;
  private _tsqError = '';

  destroy(): void {
    if (this.gl) {
      if (this.vao) {
        this.gl.deleteVertexArray(this.vao);
        this.vao = null;
      }
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
