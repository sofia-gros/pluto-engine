/**
 * @file WebGPUDevice.ts
 * @description
 * WebGPU バックエンド。
 *
 * 旧実装は clear / drawInstanced などが空実装で「初期化しても何も描けない」状態でした。
 * ここでは WebGL2Device と同じ頂点レイアウト (13 スカラー属性 + 共有 Quad) で
 * 実際に描画できるようにしています。
 *
 * 属性レイアウトは WebGL2Device と同一に揃えています:
 *   Location  0: vertexPos   (vec2, 共有 Quad)
 *   Location  1: vertexUV    (vec2, 共有 Quad)
 *   Location  2-12: インスタンス属性 (各 1 スカラー、stepMode: instance)
 *   Location 13: tint (vec4 unorm8, stepMode: instance)
 *   Location 14: isText (SDF テキストか否か、stepMode: instance)
 */

import type {
  BufferInfo,
  GraphicsDevice,
  PipelineInfo,
  TextureAsset,
  TextureFrame,
  TextureUploadOptions,
} from './GraphicsDevice';

/** WGSL の頂点シェーダー。WebGPU 経路では WGSL を直接使用します。 */
const SPRITE_WGSL = /* wgsl */ `
struct Uniforms {
  projectionMatrix : mat4x4<f32>,
  // SDF テキストの輪郭位置 (0.5 がグリフの縁)
  sdfThreshold : f32,
  // 輪郭をぼかす幅
  sdfSmoothing : f32,
  // f32 の並びを 16 バイト境界に合わせるためのパディング
  pad0 : f32,
  pad1 : f32,
};

@group(0) @binding(0) var<uniform> uniforms : Uniforms;
@group(0) @binding(1) var textureArray : texture_2d_array<f32>;
@group(0) @binding(2) var textureSampler : sampler;

struct VertexInput {
  @location(0)  vertexPos  : vec2<f32>,
  @location(1)  vertexUV   : vec2<f32>,
  @location(2)  posX       : f32,
  @location(3)  posY       : f32,
  @location(4)  scale      : f32,
  @location(5)  facing     : f32,
  @location(6)  rotation   : f32,
  @location(7)  layerDepth : f32,
  @location(8)  uvX        : f32,
  @location(9)  uvY        : f32,
  @location(10) uvW        : f32,
  @location(11) uvH        : f32,
  @location(12) frameIdx   : f32,
  @location(13) tint       : vec4<f32>,
  // 1.0 のインスタンスは SDF テキスト。0.0 は通常のスプライト。
  @location(14) isText     : f32,
};

struct VertexOutput {
  @builtin(position) clipPosition : vec4<f32>,
  @location(0) uv    : vec2<f32>,
  @location(1) layer : f32,
  @location(2) tint  : vec4<f32>,
  @location(3) isText : f32,
};

@vertex
fn vs_main(input : VertexInput) -> VertexOutput {
  var out : VertexOutput;
  let scaled = input.vertexPos * input.scale;
  let c = cos(input.rotation);
  let s = sin(input.rotation);
  let rotated = vec2<f32>(scaled.x * c - scaled.y * s, scaled.x * s + scaled.y * c);
  let world = vec2<f32>(rotated.x * input.facing, rotated.y) + vec2<f32>(input.posX, input.posY);

  out.clipPosition = uniforms.projectionMatrix * vec4<f32>(world, 0.0, 1.0);
  out.uv = input.vertexUV * vec2<f32>(input.uvW, input.uvH) + vec2<f32>(input.uvX, input.uvY);
  out.layer = input.frameIdx;
  out.tint = input.tint;
  out.isText = input.isText;
  return out;
}

@fragment
fn fs_main(input : VertexOutput) -> @location(0) vec4<f32> {
  let texColor = textureSample(textureArray, textureSampler, input.uv, i32(input.layer));
  // SDF テキストだけ距離場を閾値で切り、滑らかな縁を生成します。
  // 通常のスプライトはテクスチャの色をそのまま使います。
  if (input.isText > 0.5) {
    let alpha = smoothstep(
      uniforms.sdfThreshold - uniforms.sdfSmoothing,
      uniforms.sdfThreshold + uniforms.sdfSmoothing,
      texColor.r,
    );
    return vec4<f32>(input.tint.rgb, input.tint.a * alpha);
  }
  return texColor * input.tint;
}
`;

/** インスタンス属性の定義順。WebGL2Device と共通で使います。 */
const INSTANCE_ATTRS: { name: string; shaderLocation: number; offset: number }[] = [
  { name: 'posX', shaderLocation: 2, offset: 0 },
  { name: 'posY', shaderLocation: 3, offset: 4 },
  { name: 'scale', shaderLocation: 4, offset: 8 },
  { name: 'facing', shaderLocation: 5, offset: 12 },
  { name: 'rotation', shaderLocation: 6, offset: 16 },
  { name: 'depth', shaderLocation: 7, offset: 20 },
  { name: 'uvX', shaderLocation: 8, offset: 24 },
  { name: 'uvY', shaderLocation: 9, offset: 28 },
  { name: 'uvW', shaderLocation: 10, offset: 32 },
  { name: 'uvH', shaderLocation: 11, offset: 36 },
  { name: 'frameIdx', shaderLocation: 12, offset: 40 },
];

/** PipelineInfo.id はバックエンドごとに型が異なるため here で緩めます。 */
type GPUProgramHandle = GPURenderPipeline;

const QUAD_VERTICES = new Float32Array([-0.5, -0.5, 0, 0, 0.5, -0.5, 1, 0, -0.5, 0.5, 0, 1, 0.5, 0.5, 1, 1]);

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
  private hasVertexBuffers = false;

  /**
   * SDF テキストの uniform を書き込むためのスクラッチ (threshold, smoothing, pad, pad)。
   * 毎フレーム new しないため保持します。
   */
  private readonly _sdfUniforms = new Float32Array(4);


  async init(canvas: HTMLCanvasElement): Promise<void> {
    if (!navigator.gpu) {
      throw new Error('WebGPU is not supported');
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error('No WebGPU adapter found');
    }
    this.device = await adapter.requestDevice();

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

    // projectionMatrix (64 バイト) + sdfThreshold / sdfSmoothing / pad
    this.uniformBuffer = device.createBuffer({
      size: 80,
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

    // WebGL2 と同じ 2048x2048 を 64 層を持つ 2D 配列として用意します
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

    // インスタンス属性は 64 バイトのストライド 1 本にまとめます。
    // (48 バイトの属性 + 12 バイトのパディング。WebGPU は arrayStride を
    //  4 の倍数で要求し、16 バイト境界が GPU 側で最も速く処理されます)
    const instanceLayout: GPUVertexBufferLayout = {
      arrayStride: 64,
      stepMode: 'instance',
      attributes: [
        ...INSTANCE_ATTRS.map((a) => ({
          shaderLocation: a.shaderLocation,
          offset: a.offset,
          format: 'float32' as GPUVertexFormat,
        })),
        // tint は 4 バイトを 4 チャンネルへ割ります
        {
          shaderLocation: 13,
          offset: 44,
          format: 'unorm8x4' as GPUVertexFormat,
        },
        // isText (SDF テキストか否か)
        {
          shaderLocation: 14,
          offset: 48,
          format: 'float32' as GPUVertexFormat,
        },
      ],
    };

    this.pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module,
        entryPoint: 'vs_main',
        buffers: [
          {
            arrayStride: 16,
            stepMode: 'vertex',
            attributes: [
              { shaderLocation: 0, offset: 0, format: 'float32x2' },
              { shaderLocation: 1, offset: 8, format: 'float32x2' },
            ],
          },
          instanceLayout,
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

    this.hasVertexBuffers = false;
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
   * SoA 配列を GPU へ転送します。
   * WebGL2 と同じく subarray を new せず、範囲を直接指定します。
   *
   * WebGPU の頂点バッファは連続した 1 本を要求するため、
   * 転送元の配列をここで控えておき、setupInstancedAttributes が
   * pack 時に参照します (コピーは pack 時の 1 回だけです)。
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
    const byteOffset = data.byteOffset + srcOffset * data.BYTES_PER_ELEMENT;
    const byteLength = n * data.BYTES_PER_ELEMENT;
    this.device.queue.writeBuffer(
      bufferInfo.buffer as GPUBuffer,
      0,
      data.buffer as ArrayBuffer,
      byteOffset,
      byteLength,
    );
    this._sources.set(bufferInfo, { data, srcOffset, count: n });
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
    const frames: TextureFrame[] = [];
    const explicit = options?.frames;
    if (explicit !== undefined && explicit.length > 0) {
      for (let i = 0; i < explicit.length; i++) {
        const r = explicit[i];
        frames.push({
          uvX: r.x / width,
          uvY: r.y / height,
          uvW: r.w / width,
          uvH: r.h / height,
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
            uvX: (c * gridW) / width,
            uvY: (r * gridH) / height,
            uvW: gridW / width,
            uvH: gridH / height,
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
   * インスタンス属性を 1 本のバッファへ纏めます。
   *
   * WebGPU は頂点バッファの仕様上、SoA のままでは属性オフセットが
   * 連続になりません。そのため 64 バイトのストライドへ pack します。
   *
   * ゼロアロケーションの掟を守るため、書き込み先は
   * 確保済みのバッファを再利用します。
   */
  setupInstancedAttributes(buffers: Record<string, BufferInfo>, activeCount?: number): void {
    if (!this.device) {
      throw new Error('Device not initialized');
    }
    const anyBuf = buffers['posX'];
    if (!anyBuf) return;

    const capacity = anyBuf.size / 4;
    const STRIDE_BYTES = 64;
    const bytes = capacity * STRIDE_BYTES;
    if (this._instanceStaging === null || this._instanceStaging.byteLength < bytes) {
      this._instanceStaging = new Float32Array(Math.ceil(bytes / 4));
      this._stagingU8 = new Uint8Array(this._instanceStaging.buffer);
      this._instanceBuffer?.destroy();
      this._instanceBuffer = this.device.createBuffer({
        size: Math.ceil(bytes / 4) * 4,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX,
      });
    }

    const staging = this._instanceStaging;
    const u8 = this._stagingU8;
    if (!u8) return;

    // 12 個の float (48 バイト) + tint 4 バイト = 52 バイトを
    // 16 バイト境界へ切り詰めた 64 バイトのストライドを使います。
    const FLOATS_PER_INSTANCE = 16;
    const count = activeCount ?? capacity;
    
    // アロケーションと関数呼び出しのオーバーヘッドを避けるため、
    // 配列の参照を事前に解決しておく
    const attrArrays: (Float32Array | null)[] = [];
    const attrOffsets: number[] = [];
    for (let a = 0; a < INSTANCE_ATTRS.length; a++) {
      const buf = buffers[INSTANCE_ATTRS[a].name];
      const src = buf ? this._sources.get(buf) : null;
      if (src && src.data instanceof Float32Array) {
        attrArrays.push(src.data);
        attrOffsets.push(src.srcOffset);
      } else {
        attrArrays.push(null);
        attrOffsets.push(0);
      }
    }

    const tintBuf = buffers['tint'];
    const tintSrc = tintBuf ? this._sources.get(tintBuf) : null;
    const tintData = (tintSrc && tintSrc.data instanceof Uint32Array) ? tintSrc.data : null;
    const tintOffset = tintSrc ? tintSrc.srcOffset : 0;

    const isTextBuf = buffers['isText'];
    const isTextSrc = isTextBuf ? this._sources.get(isTextBuf) : null;
    const isTextData = (isTextSrc && isTextSrc.data instanceof Float32Array) ? isTextSrc.data : null;
    const isTextOffset = isTextSrc ? isTextSrc.srcOffset : 0;

    for (let i = 0; i < count; i++) {
      const base = i * FLOATS_PER_INSTANCE;
      
      // 11属性
      for (let a = 0; a < 11; a++) {
        const arr = attrArrays[a];
        staging[base + a] = arr ? arr[attrOffsets[a] + i] : 0;
      }
      
      // tint は 44 バイト目 (base + 11 float) に RGBA バイトとして書き込む
      const tv = tintData ? tintData[tintOffset + i] : 0xffffffff;
      let o = (base + 11) * 4;
      u8[o] = tv & 0xff;
      u8[o + 1] = (tv >> 8) & 0xff;
      u8[o + 2] = (tv >> 16) & 0xff;
      u8[o + 3] = (tv >>> 24) & 0xff;

      // isText は 48 バイト目 (base + 12 float) に float として書き込む
      staging[base + 12] = isTextData ? isTextData[isTextOffset + i] : 0;
    }

    this.device.queue.writeBuffer(this._instanceBuffer as GPUBuffer, 0, staging.buffer as ArrayBuffer, 0, count * STRIDE_BYTES);
    this.hasVertexBuffers = true;
  }

  /** 転送元から i 番目の値を float として読み戻します */
  // private _readF32(buf: BufferInfo | undefined, index: number): number { ... }

  /** 転送元から i 番目の値を uint32 (tint) として読み戻します */
  // private _readU32(buf: BufferInfo | undefined, index: number): number { ... }

  drawInstanced(activeCount: number): void {
    if (!this.device || !this.context || !this.pipeline || !this.bindGroup) return;
    if (!this.hasVertexBuffers || !this._instanceBuffer || !this.quadBuffer) return;

    const encoder = this.device.createCommandEncoder();
    const view = this.context.getCurrentTexture().createView();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view,
          clearValue: this.clearColor,
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    });

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.setVertexBuffer(0, this.quadBuffer);
    pass.setVertexBuffer(1, this._instanceBuffer);
    // 共有 Quad は triangle-strip の 4 頂点です
    pass.draw(4, activeCount);
    pass.end();

    this.device.queue.submit([encoder.finish()]);
  }

  setUniformMatrix4fv(name: string, matrix: Float32Array): void {
    if (!this.device || !this.uniformBuffer) return;
    void name;
    this.device.queue.writeBuffer(this.uniformBuffer, 0, matrix.buffer as ArrayBuffer, matrix.byteOffset, 64);
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
    this._sources.clear();
    this._instanceStaging = null;
    this._stagingU8 = null;
    this._instanceBuffer = null;
  }

  /** SoA -> 連続レイアウトの pack 用バッファ (遅延確保) */
  private _instanceStaging: Float32Array | null = null;
  private _stagingU8: Uint8Array | null = null;
  private _instanceBuffer: GPUBuffer | null = null;
  /** 転送元の SoA 配列。pack 時に読み返します。 */
  private readonly _sources = new Map<
    BufferInfo,
    { data: Float32Array | Uint32Array | Uint8Array; srcOffset: number; count: number }
  >();
}
