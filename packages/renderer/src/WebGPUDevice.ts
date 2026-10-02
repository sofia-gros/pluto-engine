/**
 * @file WebGPUDevice.ts
 * @description
 * WebGPU バックエンド。
 *
 * 旧実装は clear / drawInstanced などが空実装で「初期化しても何も描けない」状態でした。
 * ここでは実際に描画できるようにしています。
 *
 * 頂点レイアウトは `InstanceLayout` を単一の情報源として共有します
 * （WebGL2Device と完全に同じ vec4 パック形式）:
 *   Slot 0 / Location 0-1: 共有 Quad (vec2 × 2)
 *   Slot 1 / Location 2:   iTransform = (posX, posY, scale, rotation)
 *   Slot 2 / Location 3:   iUv        = (uvX, uvY, uvW, uvH)
 *   Slot 3 / Location 4:   iFlags     = (frameIdx, facing, visible, isText)
 *   Slot 4 / Location 5:   iTint      = (r, g, b, a) [unorm8x4]
 *   Slot 5 / Location 6-9: iExt0..3   = ユーザー拡張 (オプトイン)
 *
 * **頂点バッファは 6/8 枠しか使いません。** 以前は SoA 11 本を
 * 1 本の 64 バイト AoS バッファへ毎フレーム O(n) で interleave していたため、
 * WebGL2 より大幅に遅くなっていました。パッキングは
 * `InstanceBufferArena` の write-through セッター側で完了しているため、
 * このバックエンドは転送 WRITE だけを行います。
 */

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
  wgslAttributeSpecs,
  wgslInstanceMembers,
} from './InstanceLayout';

/**
 * WGSL の頂点シェーダー。
 * インスタンス属性の宣言は `InstanceLayout` から生成するため、
 * WebGL2Device とレイアウトが食い違うことはありません。
 */
const SPRITE_WGSL = /* wgsl */ `
struct Uniforms {
  projectionMatrix : mat4x4<f32>,
  // SDF テキストの輪郭位置 (0.5 がグリフの縁)
  sdfThreshold : f32,
  // 輪郭をぼかす幅
  sdfSmoothing : f32,
  // GPU カリングの有効フラグ (0 / 1)
  gpuCull : f32,
  // 4 バイト境界に合わせるためのパディング
  pad0 : f32,
  // GPU カリングの可視矩形 (minX, minY, maxX, maxY)
  cullRect : vec4<f32>,
};

@group(0) @binding(0) var<uniform> uniforms : Uniforms;
@group(0) @binding(1) var textureArray : texture_2d_array<f32>;
@group(0) @binding(2) var textureSampler : sampler;

struct VertexInput {
  @location(${QUAD_LOCATION.Pos}) vertexPos : vec2<f32>,
  @location(${QUAD_LOCATION.Uv}) vertexUV  : vec2<f32>,
${wgslInstanceMembers()}
};

struct VertexOutput {
  @builtin(position) clipPosition : vec4<f32>,
  @location(0) uv    : vec2<f32>,
  @location(1) layer : f32,
  @location(2) tint  : vec4<f32>,
  @location(3) spriteFlags : f32,
};

@vertex
fn vs_main(input : VertexInput) -> VertexOutput {
  var out : VertexOutput;
  // iTransform = (posX, posY, scaleX, scaleY)  ※ scale は倍率
  // iUv        = (uvX, uvY, uvW, uvH)
  // iFlags     = (frameIdx, facing, visible, isText)
  // iShape     = (rotation, frameWidth, frameHeight, depth)
  // iOrigin    = (originX, originY, scrollFactorX, scrollFactorY)
  // iTint      = (r, g, b, a)
  //
  // 描画サイズは「フレームのピクセル寸法 × スケール倍率」です。
  // scale = 1.0 ならフレームそのままの大きさになります。
  let frameSize = input.iShape.yz;
  let displaySize = frameSize * input.iTransform.zw;

  // 原点 (0.5, 0.5 = 中心が既定) を引くとクワッドの位置的原点を再現できます。
  let local = (input.vertexPos - (input.iOrigin.xy - vec2<f32>(0.5, 0.5))) * displaySize;

  let c = cos(input.iShape.x);
  let s = sin(input.iShape.x);
  let rotated = vec2<f32>(local.x * c - local.y * s, local.x * s + local.y * c);
  let world = vec2<f32>(rotated.x * input.iFlags.y, rotated.y) + input.iTransform.xy;

  // GPU カリング（Phase 8 P-03）。
  // 矩形外のクワッドはクリップ空間の外 (z = 2) へ退避させ縮退三角形にし、
  // ラスタライザに破棄させます。これにより CPU 側の SoA の詰め替え
  // （partitionVisible）が不要になります。
  if (uniforms.gpuCull > 0.5) {
    let ax = abs(c) * displaySize.x + abs(s) * displaySize.y;
    let ay = abs(s) * displaySize.x + abs(c) * displaySize.y;
    let hw = ax * 0.5;
    let hh = ay * 0.5;
    if (input.iTransform.x + hw < uniforms.cullRect.x
      || input.iTransform.x - hw > uniforms.cullRect.z
      || input.iTransform.y + hh < uniforms.cullRect.y
      || input.iTransform.y - hh > uniforms.cullRect.w) {
      out.clipPosition = vec4<f32>(0.0, 0.0, 2.0, 1.0);
      out.uv = vec2<f32>(0.0, 0.0);
      out.layer = 0.0;
      out.tint = vec4<f32>(0.0, 0.0, 0.0, 0.0);
      out.spriteFlags = 0.0;
      return out;
    }
  }

  out.clipPosition = uniforms.projectionMatrix * vec4<f32>(world, 0.0, 1.0);
  out.uv = input.vertexUV * input.iUv.zw + input.iUv.xy;
  out.layer = input.iFlags.x;
  out.tint = input.iTint;
  out.spriteFlags = input.iFlags.w;
  return out;
}

@fragment
fn fs_main(input : VertexOutput) -> @location(0) vec4<f32> {
  let texColor = textureSample(textureArray, textureSampler, input.uv, i32(input.layer));
  // SDF テキストだけ距離場を閾値で切り、滑らかな縁を生成します。
  // 通常のスプライトはテクスチャの色をそのまま使います。
  let flags = u32(input.spriteFlags + 0.5);
  let isText = (flags & 1u) != 0u;
  let isFill = (flags & 2u) != 0u;

  if (isText) {
    let alpha = smoothstep(
      uniforms.sdfThreshold - uniforms.sdfSmoothing,
      uniforms.sdfThreshold + uniforms.sdfSmoothing,
      texColor.r,
    );
    return vec4<f32>(input.tint.rgb, input.tint.a * alpha);
  }
  if (isFill) {
    return vec4<f32>(input.tint.rgb, input.tint.a * texColor.a);
  }
  return texColor * input.tint;
}
`;

/** PipelineInfo.id はバックエンドごとに型が異なるため here で緩めます。 */
type GPUProgramHandle = GPURenderPipeline;

const QUAD_VERTICES = new Float32Array([
  -0.5, -0.5, 0, 0, 0.5, -0.5, 1, 0, -0.5, 0.5, 0, 1, 0.5, 0.5, 1, 1,
]);

/**
 * WebGPU はバッファサイズを 4 バイト境界へ丸めます。
 * 純粋関数として切り出し、初期化なしでも検証できるようにしています。
 */
export function alignBufferSize(size: number): number {
  return Math.ceil(size / 4) * 4;
}

export class WebGPUDevice implements GraphicsDevice {
  private device: GPUDevice | null = null;
  private context: GPUCanvasContext | null = null;
  private textures: Map<string, TextureAsset> = new Map();

  private pipeline: GPURenderPipeline | null = null;
  private bindGroup: GPUBindGroup | null = null;
  private uniformBuffer: GPUBuffer | null = null;
  private quadBuffer: GPUBuffer | null = null;
  private textureArray: GPUTexture | null = null;
  private textureView: GPUTextureView | null = null;
  private sampler: GPUSampler | null = null;

  private clearColor = { r: 0, g: 0, b: 0, a: 1 };

  /**
   * SDF テキストの uniform を書き込むためのスクラッチ (threshold, smoothing, pad, pad)。
   * 毎フレーム new しないため保持します。
   */
  private readonly _sdfUniforms = new Float32Array(4);

  /** `adapter.limits` から読み取った実制約。レイアウト選択と検証に使います。 */
  public limits: GPUSupportedLimits | null = null;

  /**
   * テクスチャ配列 1 レあたりの幅 (ピクセル)。
   * フレーム UV の正規化基準になります。
   */
  public readonly textureWidth = 2048;

  /**
   * テクスチャ配列 1 レあたりの高さ (ピクセル)。{@link textureWidth} と同じ基準。
   */
  public readonly textureHeight = 2048;

  /**
   * `setupInstancedAttributes` で束縛した GPU バッファ（スロット番号 → バッファ）。
   * キーには `INSTANCE_BUFFERS` の name を使います。
   */
  private _boundBuffers: Record<string, BufferInfo> = {};

  async init(canvas: HTMLCanvasElement): Promise<void> {
    if (!navigator.gpu) {
      throw new Error('WebGPU is not supported');
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error('No WebGPU adapter found');
    }
    // 頂点バッファ数の上限を実際に確認します。
    // 既定 8 のうち、共有 Quad 1 + インスタンス 4 (+ 拡張 1) を使います。
    this.limits = adapter.limits;

    /**
     * GPU 実行時間を測るための timestamp query を要求します (Phase 8 P-02)。
     *
     * ドローコール発行は非同期なので、CPU 時間だけでは
     * 「カリングを GPU に移した副作用（頂点処理の増）」が見えません。
     * `gpuMs` で実測できることが P-02 の判断材料です。
     *
     * **ただし読み出し（resolveQuerySet → copyBufferToBuffer → mapAsync）が
     * まだ値を返しません**（実測: timestampSupported=true / サンプル 0）。
     * 未完のため **`timestampQueryEnabled` で明示的に有効化しない限り
     * 無効**にします。描画経路に未検証の処理を入れないためです。
     * 実装状況と切り分け結果は IMPACT_SCOPE.md の 9.3 を参照してください。
     */
    if (this._timestampQueryEnabled) {
      this._timestampSupported = adapter.features.has('timestamp-query');
    } else {
      this._timestampSupported = false;
    }
    const requiredFeatures = this._timestampSupported ? (['timestamp-query'] as const) : [];
    const requiredSlots = INSTANCE_BUFFERS.filter((b) => b.eager).length + 1;
    if (this.limits.maxVertexBuffers < requiredSlots) {
      console.warn(
        `[WebGPUDevice] maxVertexBuffers=${this.limits.maxVertexBuffers} < 必要数 ${requiredSlots}。` +
          '描画が壊れる可能性があります。',
      );
    }

    this.device = await adapter.requestDevice({
      requiredFeatures: [...requiredFeatures] as unknown as GPUFeatureName[],
    });
    this._setupTimestampQuery();

    const context = canvas.getContext('webgpu') as GPUCanvasContext | null;
    if (!context) {
      throw new Error('Failed to get WebGPU context');
    }
    context.configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: 'premultiplied',
    });
    this.context = context;
  }

  /**
   * WGSL からパイプラインを組み立てます。
   * レイアウトは WebGL2Device と同一にします。
   */
  initPipelines(): void {
    if (!this.device || !this.context) {
      throw new Error('Device not initialized');
    }
    const device = this.device;

    // projectionMatrix (64) + sdfThreshold / sdfSmoothing / gpuCull / pad (16)
    // + cullRect (16) = 96 バイト
    this.uniformBuffer = device.createBuffer({
      size: 96,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    // SDF の既定値。uniform を一度も書かないと未定義値になりグリフが消えます。
    this._sdfUniforms[0] = 0.5;
    this._sdfUniforms[1] = 0.08;
    device.queue.writeBuffer(
      this.uniformBuffer,
      64,
      this._sdfUniforms.buffer as ArrayBuffer,
      0,
      16,
    );

    this.quadBuffer = device.createBuffer({
      size: QUAD_VERTICES.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.quadBuffer, 0, QUAD_VERTICES);

    this.textureArray = device.createTexture({
      size: { width: 2048, height: 2048, depthOrArrayLayers: 64 },
      format: 'rgba8unorm',
      dimension: '2d',
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    this.textureView = this.textureArray.createView({ dimension: '2d-array' });
    this.sampler = device.createSampler({ magFilter: 'nearest', minFilter: 'nearest' });

    const module = device.createShaderModule({ code: SPRITE_WGSL });

    // インスタンス属性は `InstanceLayout` の定義どおり「バッファ 1 本 = vec4 1 枠」です。
    // 属性を 1 枠ずつに分けることで、頂点バッファ枠を 13 → 4 に減らし、
    // 更新のないグループを丸ごと転送せずに済みます。
    const attrSpecs = wgslAttributeSpecs();
    const instanceBuffers: GPUVertexBufferLayout[] = [];
    for (let b = 0; b < INSTANCE_BUFFERS.length; b++) {
      const spec = INSTANCE_BUFFERS[b];
      if (!spec.eager) continue;
      const attributes = attrSpecs.filter(
        (a) => a.shaderLocation >= spec.location && a.shaderLocation < spec.location + spec.vectors,
      );
      instanceBuffers.push({
        arrayStride: spec.stride,
        stepMode: 'instance',
        attributes,
      });
    }

    this.pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module,
        entryPoint: 'vs_main',
        buffers: [
          {
            arrayStride: QUAD_STRIDE_BYTES,
            stepMode: 'vertex',
            attributes: [
              { shaderLocation: QUAD_LOCATION.Pos, offset: 0, format: 'float32x2' },
              { shaderLocation: QUAD_LOCATION.Uv, offset: 8, format: 'float32x2' },
            ],
          },
          ...instanceBuffers,
        ],
      },
      fragment: {
        module,
        entryPoint: 'fs_main',
        targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
      },
      primitive: { topology: 'triangle-strip' },
    });

    this.bindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer } },
        { binding: 1, resource: this.textureView },
        { binding: 2, resource: this.sampler },
      ],
    });
  }

  createBuffer(size: number): BufferInfo {
    if (!this.device) {
      throw new Error('Device not initialized');
    }
    // 4 バイト境界に揃えます (WebGPU は 4 の倍数を要求します)
    const aligned = alignBufferSize(size);
    const buffer = this.device.createBuffer({
      size: aligned,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX,
    });
    return { buffer, size: aligned };
  }

  /**
   * packed ミラー配列を GPU へ転送します。
   *
   * WebGL2 と同じく subarray を new せず、範囲を直接指定します。
   *
   * 転送元の配列は `InstanceBufferArena` の write-through ミラーなので、
   * **このメソッドは pack を行いません。** 行うのは転送だけです。
   * そのため 1 フレームあたり O(1) のコマンド発行で済みます。
   */
  updateBuffer(
    bufferInfo: BufferInfo,
    data: Float32Array | Uint32Array | Uint8Array,
    srcOffset = 0,
    length?: number,
  ): void {
    if (!this.device) {
      throw new Error('Device not initialized');
    }
    const n = length ?? data.length - srcOffset;
    if (n <= 0) return;
    const buffer = bufferInfo.buffer as GPUBuffer;
    // 開始バイトオフセットを先に反映してから転送します。
    const startBytes = srcOffset * data.BYTES_PER_ELEMENT;
    const sizeBytes = n * data.BYTES_PER_ELEMENT;
    const avail = buffer.size - startBytes;
    this.device.queue.writeBuffer(
      buffer,
      startBytes,
      data.buffer as ArrayBuffer,
      data.byteOffset,
      Math.min(sizeBytes, avail),
    );
  }

  /**
   * 画像を Texture2DArray の 1 層へ転送します。
   * Canvas / ImageData / ImageBitmap をすべて扱えるよう、
   * 必要なら一時的に 2D Canvas へ描画してから readPixels します。
   */
  uploadTexture(
    key: string,
    source: HTMLImageElement | HTMLCanvasElement | ImageBitmap | ImageData,
    options?: TextureUploadOptions,
  ): TextureAsset {
    if (!this.device || !this.textureArray) {
      throw new Error('Device not initialized');
    }
    const device = this.device;
    const width = source.width;
    const height = source.height;
    const layerIndex = this.textures.size % 64;

    let pixels: Uint8Array;
    if (typeof ImageData !== 'undefined' && source instanceof ImageData) {
      pixels = new Uint8Array(source.data.buffer.slice(0));
    } else {
      // 2D Canvas へ描画して取得します (初期化時のみの一時オブジェクト)
      const tmp = document.createElement('canvas');
      tmp.width = width;
      tmp.height = height;
      const ctx = tmp.getContext('2d');
      if (!ctx) throw new Error('Failed to acquire 2d context for texture upload');
      ctx.drawImage(source as CanvasImageSource, 0, 0);
      const data = ctx.getImageData(0, 0, width, height);
      pixels = new Uint8Array(data.data.buffer.slice(0));
    }

    device.queue.writeTexture(
      { texture: this.textureArray, origin: { x: 0, y: 0, z: layerIndex } },
      pixels as Uint8Array<ArrayBuffer>,
      { bytesPerRow: width * 4, rowsPerImage: height },
      { width, height, depthOrArrayLayers: 1 },
    );

    // フレーム UV の構築。WebGL2 側と同じ規則に揃えます。
    //
    // 正規化の基準は **テクスチャ配列のレイヤー寸法** です。
    // 画像は (0, 0) から配置され、レイヤーより小さい分は未使用領域になるため、
    // ソース画像寸法で正規化するとサンプル位置がずれます。
    const frames: TextureFrame[] = [];
    const normW = this.textureWidth;
    const normH = this.textureHeight;
    const explicit = options?.frames;
    if (explicit !== undefined && explicit.length > 0) {
      for (let i = 0; i < explicit.length; i++) {
        const r = explicit[i];
        frames.push({
          uvX: r.x / normW,
          uvY: r.y / normH,
          uvW: r.w / normW,
          uvH: r.h / normH,
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
            uvX: (c * gridW) / normW,
            uvY: (r * gridH) / normH,
            uvW: gridW / normW,
            uvH: gridH / normH,
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

  clear(r: number, g: number, b: number, a: number): void {
    this.clearColor = { r, g, b, a };
  }

  bindShaders(sdfThreshold = 0.5, sdfSmoothing = 0.08): void {
    // WebGPU は描画時にまとめて設定するため何もしません。
    // ただし SDF の uniform はここで書き換える必要があります。
    if (!this.device || !this.uniformBuffer) return;
    this._sdfUniforms[0] = sdfThreshold;
    this._sdfUniforms[1] = sdfSmoothing;
    this.device.queue.writeBuffer(
      this.uniformBuffer,
      64,
      this._sdfUniforms.buffer as ArrayBuffer,
      0,
      16,
    );
  }

  /**
   * インスタンス用バッファのバインド内容を記録します。
   *
   * **pack は行いません。** 転送元は `InstanceBufferArena` の
   * write-through ミラーで、すでに vec4 単位にまとまっています。
   * そのためこのメソッドは O(1) の記録のみで済みます。
   *
   * `baseInstance` は可視区間の先頭インスタンス番号です。
   * 実際の `setVertexBuffer` は `drawInstanced` の中で行います
   * （WebGL2 の VAO と同じ「カメラ単位の属性設定」に合わせます）。
   */
  setupInstancedAttributes(
    buffers: Record<string, BufferInfo>,
    activeCount?: number,
    baseInstance = 0,
  ): void {
    void activeCount;
    void baseInstance;
    if (!this.device) {
      throw new Error('Device not initialized');
    }
    // バッファ表の実体だけを記録します。drawInstanced が毎.camera 読み直します。
    this._boundBuffers = buffers;
  }

  /**
   * 現在の描画結果を読み戻します。
   *
   * WebGPU は `GPUCommandEncoder.copyTextureToBuffer` + `mapAsync` が
   * **非同期**であるため、この同期インターフェースでは実装できません。
   * スクリーンショットは非同期版を別途用意する必要があり、
   * ここでは常に false を返して「未対応」を明示します。
   */
  readPixels(out: Uint8Array, width?: number, height?: number): boolean {
    void out;
    void width;
    void height;
    return false;
  }

  /**
   * timestamp query のリソースを用意します。
   *
   * バッファは `MAP_READ | COPY_DST`、クエリセットは 2 エントリです。
   * 読み出しは {@link resolveGpuTimeMs} から明示的に行います。
   */
  private _setupTimestampQuery(): void {
    const dev = this.device;
    if (!dev || !this._timestampSupported) return;
    try {
      this._timestampQuerySet = dev.createQuerySet({ type: 'timestamp', count: 2 });
      this._timestampResolve = dev.createBuffer({
        size: 16,
        usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
      });
      this._timestampReadback = dev.createBuffer({
        size: 16,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      });
    } catch {
      // 環境によっては query set の生成に失敗します。描画は継続します。
      this._timestampSupported = false;
      this._timestampQuerySet = null;
      this._timestampResolve = null;
      this._timestampReadback = null;
    }
  }

  private _timestampSupported = false;
  /**
   * timestamp query を有効にするかどうか。**既定は false**。
   *
   * 読み出しが値を返さないため、検証前の経路を既定で描画に
   * 載せないようにします。有効化は {@link enableTimestampQuery} 経由です。
   */
  private _timestampQueryEnabled = false;

  /**
   * timestamp query を有効化します（検証用）。
   *
   * 有効化は `init()` より前に呼ぶ必要があります
   * （device 取得時に feature を要求する必要があるためです）。
   */
  public enableTimestampQuery(): void {
    this._timestampQueryEnabled = true;
  }
  private _timestampQuerySet: GPUQuerySet | null = null;
  private _timestampResolve: GPUBuffer | null = null;
  private _timestampReadback: GPUBuffer | null = null;
  /** 直近の resolve 済み GPU 時間 (ms)。未計測なら -1。 */
  private _lastGpuMs = -1;
  /** timestamp 読み出しの直近エラー。正常なら空文字列。 */
  private _timestampError = '';
  /** 生読できた timestamp の生値（診断用）。-1 は未読出し。 */
  private _timestampRaw0 = -1;
  private _timestampRaw1 = -1;
  /** mapAsync  が進行中か。二重マップを避けるために使います。 */
  private _timestampMapping = false;
  /** resolve は済んでいて、まだマップしていないデータがあるか。 */
  private _timestampPendingMap = false;

  drawInstanced(activeCount: number, baseInstance = 0): void {
    if (!this.device || !this.context || !this.pipeline || !this.bindGroup) return;
    if (!this.quadBuffer) return;

    const encoder = this.device.createCommandEncoder();
    const view = this.context.getCurrentTexture().createView();

    // timestamp query が使えるなら描画の前後を計測します。
    // 生の timestamp はローカルの量子化刻みなので、
    // period を Unknown から 1e-6 秒と仮定して ns として扱います。
    const useTs =
      this._timestampSupported &&
      this._timestampQuerySet !== null &&
      this._timestampResolve !== null &&
      !this._timestampMapping;
    const passDesc: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view,
          clearValue: this.clearColor,
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    };
    if (useTs) {
      const qs = this._timestampQuerySet;
      const resolve = this._timestampResolve;
      if (qs && resolve) {
        passDesc.timestampWrites = {
          querySet: qs,
          beginningOfPassWriteIndex: 0,
          endOfPassWriteIndex: 1,
        };
      }
    }
    const pass = encoder.beginRenderPass(passDesc);

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.setVertexBuffer(0, this.quadBuffer);
    for (let b = 0; b < INSTANCE_BUFFERS.length; b++) {
      const spec = INSTANCE_BUFFERS[b];
      if (!spec.eager) continue;
      const info = this._boundBuffers[spec.name];
      if (!info) continue;
      // baseInstance * stride を byteOffset として渡すことで、
      // firstInstance のない WebGL2 と同じ「可視区間だけ描画」を実現します。
      pass.setVertexBuffer(spec.slot, info.buffer as GPUBuffer, baseInstance * spec.stride);
    }
    // 共有 Quad は triangle-strip の 4 頂点です
    pass.draw(4, activeCount, 0, 0);
    pass.end();

    if (useTs) {
      const qs = this._timestampQuerySet;
      const resolve = this._timestampResolve;
      const readback = this._timestampReadback;
      if (qs && resolve && readback) {
        encoder.resolveQuerySet(qs, 0, 2, resolve, 0);
        encoder.copyBufferToBuffer(resolve, 0, readback, 0, 16);
        this._timestampPendingMap = true;
      }
    }

    this.device.queue.submit([encoder.finish()]);
  }

  /**
   * 直近の GPU 実行時間を返します (ms)。
   *
   * 非同期の map 読み出しなので、**実測できる帧まで -1 を返します**。
   * ベンチは連続してフレームを回して中央値を取ってください。
   *
   * @returns GPU 時間 (ms)。非対応・未計測なら -1
   */
  resolveGpuTimeMs(): number {
    const dev = this.device;
    const dst = this._timestampReadback;
    if (!dev || !dst || !this._timestampSupported) return -1;

    // 前フレームの resolve 済みデータがあれば、それを読み出します。
    // 読み出しは mapAsync なので、値が返るのは「1 フレーム遅れ」です。
    if (this._timestampPendingMap && !this._timestampMapping) {
      this._timestampPendingMap = false;
      this._timestampMapping = true;
      void dst
        .mapAsync(GPUMapMode.READ)
        .then(() => {
          const view = dst.getMappedRange();
          const raw = new BigUint64Array(view, 0, 2);
          const begin = Number(raw[0]);
          const end = Number(raw[1]);
          dst.unmap();
          this._lastGpuMs = end > begin ? (end - begin) / 1e6 : -1;
          // 生の値を診断用に残します。0 を読んでいるのか、
          // resolve 自体が書き込まれていないのかを区別するためです。
          this._timestampRaw0 = begin;
          this._timestampRaw1 = end;
        })
        .catch((err: unknown) => {
          // 失敗を潰すと切り分けできません。原因をそのまま残します。
          this._timestampError = err instanceof Error ? err.message : String(err);
          this._lastGpuMs = -1;
        })
        .finally(() => {
          this._timestampMapping = false;
        });
    }

    // 進行中のマップの完了を待つため、今日は前回確定した値を返します。
    return this._lastGpuMs;
  }

  /**
   * timestamp query が使えるかを返します (デバッグ・報告用)。
   */
  isTimestampQuerySupported(): boolean {
    return this._timestampSupported;
  }

  setUniformMatrix4fv(name: string, matrix: Float32Array): void {
    if (!this.device || !this.uniformBuffer) return;
    void name;
    this.device.queue.writeBuffer(
      this.uniformBuffer,
      0,
      matrix.buffer as ArrayBuffer,
      matrix.byteOffset,
      64,
    );
  }

  /**
   * GPU カリングの可視矩形を設定します（Phase 8 P-03）。
   *
   * 有効にすると頂点シェーダが矩形外のクワッドを縮退三角形にして破棄します。
   * uniform バッファは 96 バイト（offset 80 が gpuCull、84 が cullRect）です。
   */
  setCullRect(rect: Float32Array, enabled: boolean): void {
    const dev = this.device;
    if (!dev || !this.uniformBuffer) return;
    // gpuCull (f32) を 76 へ
    const flag = new Float32Array([enabled ? 1 : 0]);
    dev.queue.writeBuffer(this.uniformBuffer, 76, flag.buffer as ArrayBuffer, 0, 4);
    // cullRect (vec4<f32>) を 80 へ
    dev.queue.writeBuffer(this.uniformBuffer, 80, rect.buffer as ArrayBuffer, rect.byteOffset, 16);
  }

  createPipeline(vertSource: string, fragSource: string): PipelineInfo {
    if (!this.device) {
      throw new Error('Device not initialized');
    }
    // WGSL としてコンパイルし、任意のパイプラインを生成します
    const module = this.device.createShaderModule({ code: `${vertSource}\n${fragSource}` });
    const pipeline = this.device.createRenderPipeline({
      layout: 'auto',
      vertex: { module, entryPoint: 'vs_main' },
      fragment: {
        module,
        entryPoint: 'fs_main',
        targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
      },
      primitive: { topology: 'triangle-strip' },
    });
    return { id: pipeline as unknown as GPUProgramHandle };
  }

  bindPipeline(pipeline: PipelineInfo): void {
    this.pipeline = pipeline.id as unknown as GPURenderPipeline;
  }

  destroy(): void {
    if (this.device) {
      this.device.destroy();
      this.device = null;
    }
    this.textures.clear();
    this._boundBuffers = {};
  }
  /**
   * timestamp 読み出しの直近のエラーを返します (デバッグ・報告用)。
   *
   * 値が取れない原因を切り分けるためのものです。
   * 正常な場合は空文字列を返します。
   */
  lastTimestampError(): string {
    return this._timestampError;
  }

  /**
   * 生読できた timestamp の生値を `out` へ書き出します (診断用)。
   *
   * @param out 2 要素のバッファ。`[0]` = begin, `[1]` = end
   * @returns 読み出せたか
   */
  lastTimestampRaw(out: Float64Array): boolean {
    if (this._timestampRaw0 < 0) return false;
    out[0] = this._timestampRaw0;
    out[1] = this._timestampRaw1;
    return true;
  }
}
