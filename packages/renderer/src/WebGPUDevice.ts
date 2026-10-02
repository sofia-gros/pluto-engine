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
 * compute カリング + 可視インスタンス詰替シェーダー (Phase 8 P-02)。
 *
 * 1 インスタンスずつ可視矩形を判定し、可視なら
 * **出力バッファの先頭へ詰oupledえ的同时に** 間接描画引数の instanceCount を
 * atomic で加算します。
 *
 * ## なぜ「数えるだけ」でだめなのか
 *
 * `drawIndirect` は第 1  引数の instanceCount 体（= 添字 0..N-1）を描きます。
 * 可視判定だけ synd implementingして instanceCount を_BITS的增长させても、
 * 詰替をしないと **swap 前の配列の先頭 N 体** が描かれてしまいます
 * （可視率 100% では偶然一致するため気づきにくい）。
 *
 * そのため可視の 1 体ごとに全属性を出力バッファへ書き写し、
 * 描画側は出力バッファを vertex buffer として参照します。
 *
 * 入力:
 * - transform : (posX, posY, scaleX, scaleY)
 * - shape     : (rotation, frameWidth, frameHeight, depth)
 * - flags     : (frameIdx, facing, visible, isText)
 * - uv / tint / origin : 描画_other属性（そのまま写す）
 * - params    : (rectMinX, rectMinY, rectMaxX, rectMaxY, instanceCount, pad, pad, pad)
 * - indirect  : [0]=vertexCount [1]=instanceCount(atomic) [2]=firstIndex [3]=baseVertex
 */
/**
 * 不変コピー用 WGSL（canvas へ 1 パスで blit します）。
 *
 * `filters/fullscreen.ts` の頂点シェーダと同じ構造ですが、
 * uniform を持たないぶん binding が 2 つだけです。
 */
const BLIT_WGSL = /* wgsl */ `
struct VsOut {
  @builtin(position) pos : vec4<f32>,
  @location(0) uv : vec2<f32>,
};

@group(0) @binding(0) var samp : sampler;
@group(0) @binding(1) var srcTex : texture_2d<f32>;

@vertex
fn vs_main(@builtin(vertex_index) vi : u32) -> VsOut {
  var p = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0),
  );
  var o : VsOut;
  let xy = p[vi];
  o.pos = vec4<f32>(xy, 0.0, 1.0);
  o.uv = vec2<f32>(xy.x * 0.5 + 0.5, 0.5 - xy.y * 0.5);
  return o;
}

@fragment
fn fs_main(in : VsOut) -> @location(0) vec4<f32> {
  return textureSampleLevel(srcTex, samp, in.uv, 0.0);
}
`;

/**
 * compute stage で使う storage buffer の本数。
 *
 * 入力 6（transform / shape / flags / uv / tint / origin）+ 出力 6 + atomic 1。
 * WebGPU の既定上限は 8 なので、これを満たす adapter では
 * `requestDevice` に明示的に要求する必要があります。
 */
const CULL_STORAGE_BUFFER_COUNT = 13;

const CULL_WGSL = /* wgsl */ `
struct CullParams {
  rect : vec4<f32>,
  // x に instanceCount を入れます、残りはパディング
  misc : vec4<u32>,
};

@group(0) @binding(0) var<uniform> params : CullParams;
@group(0) @binding(1) var<storage, read> inTransform : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> inShape : array<vec4<f32>>;
@group(0) @binding(3) var<storage, read> inFlags : array<vec4<f32>>;
@group(0) @binding(4) var<storage, read> inUv : array<vec4<f32>>;
@group(0) @binding(5) var<storage, read> inTint : array<u32>;
@group(0) @binding(6) var<storage, read> inOrigin : array<vec4<f32>>;
@group(0) @binding(7) var<storage, read_write> indirect : array<atomic<u32>>;
@group(0) @binding(8) var<storage, read_write> outTransform : array<vec4<f32>>;
@group(0) @binding(9) var<storage, read_write> outUv : array<vec4<f32>>;
@group(0) @binding(10) var<storage, read_write> outFlags : array<vec4<f32>>;
@group(0) @binding(11) var<storage, read_write> outShape : array<vec4<f32>>;
@group(0) @binding(12) var<storage, read_write> outTint : array<u32>;
@group(0) @binding(13) var<storage, read_write> outOrigin : array<vec4<f32>>;

fn cullOut(center : vec2<f32>, half : vec2<f32>) -> bool {
  return center.x + half.x < params.rect.x
      || center.x - half.x > params.rect.z
      || center.y + half.y < params.rect.y
      || center.y - half.y > params.rect.w;
}

@compute @workgroup_size(64)
fn cs_main(@builtin(global_invocation_id) gid : vec3<u32>) {
  let i = gid.x;
  if (i >= params.misc.x) {
    return;
  }
  let f = inFlags[i];
  // 非表示 / 非 active は描かないのでカウンタも増やしません
  if (f.z < 0.5) {
    return;
  }
  let t = inTransform[i];
  let s = inShape[i];
  let display = vec2<f32>(abs(t.z) * s.y, abs(t.w) * s.z);
  // 回転は外接矩形（角速度と同じ）で判定します
  let c = abs(cos(s.x));
  let sn = abs(sin(s.x));
  let ext = vec2<f32>(c * display.x + sn * display.y,
                      sn * display.x + c * display.y) * 0.5;
  if (cullOut(t.xy, ext)) {
    return;
  }
  // 可視分を先頭へ詰替えます。atomicAdd の戻り値がそのまま出力添字です。
  let slot = atomicAdd(&indirect[1], 1u);
  outTransform[slot] = t;
  outShape[slot] = s;
  outFlags[slot] = f;
  outUv[slot] = inUv[i];
  outTint[slot] = inTint[i];
  outOrigin[slot] = inOrigin[i];
}
`;

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

    /**
     * compute カリング（Phase 8 P-02）は入力 6 + 出力 6 + atomic 1 = 13 本の
     * storage buffer を compute stage で使います。WebGPU の既定上限は 8 なので、
     * adapter が対応している分だけ明示的に要求します。
     *
     * 要求过多すると requestDevice が失敗するため、adapter の実測値でクランプします。
     */
    const wantedStorage = CULL_STORAGE_BUFFER_COUNT;
    const availableStorage = this.limits.maxStorageBuffersPerShaderStage;
    const requiredLimits =
      availableStorage >= wantedStorage
        ? ({ maxStorageBuffersPerShaderStage: wantedStorage } as Record<string, number>)
        : ({} as Record<string, number>);

    this.device = await adapter.requestDevice({
      requiredFeatures: [...requiredFeatures] as unknown as GPUFeatureName[],
      requiredLimits,
    });
    this._setupTimestampQuery();
    // 上限が足りなければ compute カリングは使わず、頂点シェーダ経路に落とします
    this._computeCullingSupported =
      this._computeCullingEnabled && this.limits.maxStorageBuffersPerShaderStage >= 13;
    if (this._computeCullingSupported) {
      this._setupComputeCulling();
    }

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
  /**
   * Filter 用 sampler と bind group layout を作ります。
   *
   * layout は `auto` ではなく明示します。フィルタごとにシェーダを違うため、
   * 1 つの layout を共有します（`auto` だとシェーダごとに layout が変わります）。
   */
  private _initFilterSupport(): void {
    const dev = this.device;
    if (!dev || this._filterPipelineLayout) return;
    this._filterSampler = dev.createSampler({
      magFilter: 'linear',
      minFilter: 'linear',
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge',
    });
    this._filterBindGroupLayout = dev.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });
    this._filterPipelineLayout = dev.createPipelineLayout({
      bindGroupLayouts: [this._filterBindGroupLayout],
    });
  }

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
      format: this._swapFormat(),
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

    // compute カリングのパイプラインは描画パイプラインと同じタイミングで用意します。
    this._initComputeCulling();
    this._initFilterSupport();
  }

  createBuffer(size: number): BufferInfo {
    if (!this.device) {
      throw new Error('Device not initialized');
    }
    // 4 バイト境界に揃えます (WebGPU は 4 の倍数を要求します)
    const aligned = alignBufferSize(size);
    const buffer = this.device.createBuffer({
      size: aligned,
      // STORAGE は compute カリング（Phase 8 P-02）が packed ミrror を
      // storage buffer として読むために必要です。付けないと compute 側の
      // bind group が不正になり、dispatch が黙って何も描かなくなります。
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
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
   * compute カリングのリソースを用意します (Phase 8 P-02)。
   *
   * `packedTransform` / `packedShape` / `packedFlags` を
   * storage buffer として読み、間接描画引数へ可視数を atomic で加算します。
   *
   * storage buffer を compute stage で 4 本使うため
   * `maxStorageBuffersPerShaderStage` が必要です。非対応環境では
   * false を返して CPU / 頂点シェーダ経路にフォールバックします。
   */
  private _setupComputeCulling(): void {
    const dev = this.device;
    if (!dev) return;
    // 入力 6 + 出力 6 + atomic 1 = 13 本の storage を compute stage で使います
    if (dev.limits.maxStorageBuffersPerShaderStage < 4) return;
    try {
      this._cullParams = dev.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      // [0]=vertexCount [1]=instanceCount [2]=firstIndex [3]=baseVertex
      this._cullIndirect = dev.createBuffer({
        size: 16,
        // COPY_SRC は resolveVisibleCount が instanceCount を読み戻すために必要
        usage:
          GPUBufferUsage.STORAGE |
          GPUBufferUsage.INDIRECT |
          GPUBufferUsage.COPY_DST |
          GPUBufferUsage.COPY_SRC,
      });
      // 初回の instanceCount を 0 にします。以後は compute が加算します。
      dev.queue.writeBuffer(this._cullIndirect, 0, new Uint32Array([4, 0, 0, 0]).buffer);
    } catch {
      this._cullParams = null;
      this._cullIndirect = null;
    }
  }

  private _cullParams: GPUBuffer | null = null;
  private _cullIndirect: GPUBuffer | null = null;
  private _cullPipeline: GPUComputePipeline | null = null;
  private _cullBindGroup: GPUBindGroup | null = null;
  /** compute カリングを有効にするか（既定は false）。 */
  private _computeCullingEnabled = false;
  /** ストレージ 4 本を使えるか。 */
  private _computeCullingSupported = false;
  /** bind group を構築済みか。バッファが替わるたびに作り直します。 */
  private _cullBindGroupBuilt = false;
  /** 詰替先バッファ（compute が書き、描画は vertex buffer として読む）。 */
  private readonly _cullOutBuffers: Partial<Record<string, GPUBuffer>> = {};
  /** 直近のフレームで compute dispatch を行ったか。 */
  private _computeCullingDispatched = false;
  /** 直近の dispatch で渡した可視矩形。 */
  private readonly _cullRectBuf = new Float32Array(4);
  private readonly _cullParamsBuf = new ArrayBuffer(32);
  private readonly _cullParamsF32 = new Float32Array(this._cullParamsBuf);
  private readonly _cullParamsU32 = new Uint32Array(this._cullParamsBuf);

  /**
   * compute カリングを有効化します (Phase 8 P-02、既定は false)。
   *
   * 有効化は `init()` より前に呼ぶ必要があります
   * （バッファと feature を先に用意する必要があるためです）。
   */
  enableComputeCulling(): void {
    this._computeCullingEnabled = true;
  }

  /**
   * compute bind group を必要になった時点で構築します。
   *
   * インスタンスバッファは描画ごとに差し替わることがあるため、
   * 束縛したバッファ集合が変わったら作り直します。
   */
  private _ensureCullBindGroup(): boolean {
    const dev = this.device;
    if (!dev || !this._cullPipeline || !this._cullParams || !this._cullIndirect) return false;
    if (this._cullBindGroup && this._cullBindGroupBuilt) return true;

    const src = (name: string): GPUBuffer | undefined =>
      this._boundBuffers[name]?.buffer as GPUBuffer | undefined;
    const transform = src('packedTransform');
    const shape = src('packedShape');
    const flags = src('packedFlags');
    const uv = src('packedUv');
    const tint = src('packedTint');
    const origin = src('packedOrigin');
    if (!transform || !shape || !flags || !uv || !tint || !origin) return false;

    try {
      /**
       * 詰替先バッファは入力と同じ容量で作ります。
       *
       * 可視数は入力.instanc数以下なので、入力と同じあれば十分です。
       * 容量が変わった（アリーナが伸びた）ときだけ作り直します。
       */
      const ensureOut = (name: string, source: GPUBuffer): GPUBuffer | null => {
        const existing = this._cullOutBuffers[name];
        if (existing && existing.size === source.size) return existing;
        existing?.destroy();
        const created = dev.createBuffer({
          size: source.size,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX,
        });
        this._cullOutBuffers[name] = created;
        return created;
      };
      const outTransform = ensureOut('packedTransform', transform);
      const outShape = ensureOut('packedShape', shape);
      const outFlags = ensureOut('packedFlags', flags);
      const outUv = ensureOut('packedUv', uv);
      const outOrigin = ensureOut('packedOrigin', origin);
      const outTint = ensureOut('packedTint', tint);
      if (!outTransform || !outShape || !outFlags || !outUv || !outOrigin || !outTint) {
        return false;
      }

      dev.pushErrorScope('validation');
      this._cullBindGroup = dev.createBindGroup({
        layout: this._cullPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: this._cullParams } },
          { binding: 1, resource: { buffer: transform } },
          { binding: 2, resource: { buffer: shape } },
          { binding: 3, resource: { buffer: flags } },
          { binding: 4, resource: { buffer: uv } },
          { binding: 5, resource: { buffer: tint } },
          { binding: 6, resource: { buffer: origin } },
          { binding: 7, resource: { buffer: this._cullIndirect } },
          { binding: 8, resource: { buffer: outTransform } },
          { binding: 9, resource: { buffer: outUv } },
          { binding: 10, resource: { buffer: outFlags } },
          { binding: 11, resource: { buffer: outShape } },
          { binding: 12, resource: { buffer: outTint } },
          { binding: 13, resource: { buffer: outOrigin } },
        ],
      });
      this._cullBindGroupBuilt = true;
      void dev.popErrorScope().then((err) => {
        // createBindGroup は例外を投げずに validation error として報告します。
        // ここで捕捉しないと「bind group が作られない」症状だけが残ります。
        if (err) {
          console.error('[computeCulling] bindGroup:', err.message);
          this._cullBindGroup = null;
          this._cullBindGroupBuilt = false;
        }
      });
      return true;
    } catch {
      void dev.popErrorScope();
      this._cullBindGroup = null;
      this._cullBindGroupBuilt = false;
      return false;
    }
  }

  /**
   * compute カリングの初期化 (Phase 8 P-02)。
   *
   * 有効化する場合のみ呼ばれます。`initPipelines` から呼びます。
   */
  private _initComputeCulling(): void {
    const dev = this.device;
    if (!dev || !this._computeCullingEnabled || !this._cullParams || !this._cullIndirect) return;
    try {
      const module = dev.createShaderModule({ code: CULL_WGSL });
      // シェーダが失敗しても dispatch は黙って何もしないため、
      // コンパイル 결과를明示的に取り出して報告します。
      void module.getCompilationInfo?.().then((info) => {
        for (const m of info.messages) {
          if (m.type === 'error') {
            console.error(`[computeCulling] WGSL ${m.lineNum}:${m.linePos} ${m.message}`);
          }
        }
      });
      dev.pushErrorScope('validation');
      this._cullPipeline = dev.createComputePipeline({
        layout: 'auto',
        compute: { module, entryPoint: 'cs_main' },
      });
      void dev.popErrorScope().then((err) => {
        if (err) console.error('[computeCulling] pipeline:', err.message);
      });
    } catch {
      this._cullPipeline = null;
    }
    this._cullBindGroup = null;
    this._cullBindGroupBuilt = false;
  }

  /** compute カリングが使える状態か。 */
  isComputeCullingSupported(): boolean {
    return this._computeCullingSupported && this._cullPipeline !== null;
  }

  // ---------------------------------------------------------------------
  // RenderGraph / Filter 用のオフスクリーン描画 (Phase 8)
  //
  // 流れは次の 3 段階です。
  //   1. beginSceneToTarget()  : スプライト用テクスチャ created + clear
  //   2. drawInstanced()        : そのテクスチャへ通常のスプライト描画
  //   3. runFilterPass() × N    : Filter チェーン
  //      presentTarget()        : 最後の結果を canvas へ 1 パスで blit
  //
  // Filter が 0 個なら beginSceneToTarget() を呼ばないため、
  // 従来とまったく同じ経路で描画されます（挙動が変わらない）。
  // ---------------------------------------------------------------------

  /** Filter を適用できる状態か（WebGPU 限定） */
  isFilterSupported(): boolean {
    return this.device !== null && this.context !== null;
  }

  /**
   * スプライトを描き込むオフスクリーン target を作ります（既存は再利用）。
   *
   * 画面サイズが変わったときだけ作り直します。
   * filter 経路は毎フレーム `load` で上書きするため clear はここで 1 回だけ行います。
   */
  beginSceneToTarget(width: number, height: number): boolean {
    const dev = this.device;
    if (!dev || !this.isFilterSupported()) return false;
    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));
    if (this._sceneTexture && this._sceneTargetSize[0] === w && this._sceneTargetSize[1] === h) {
      this._swapSize[0] = w;
      this._swapSize[1] = h;
      // 使い回すフレームは view を作り直します。
      // 破棄済みの view を参照すると validation error になるため。
      this._sceneTarget = this._sceneTexture.createView();
      return true;
    }
    // view は texture から作るため、破棄は texture 側だけで足ります
    this._sceneTexture?.destroy();

    const texture = dev.createTexture({
      size: { width: w, height: h },
      format: this._swapFormat(),
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT |
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_SRC,
    });
    this._sceneTexture = texture;
    this._sceneTarget = texture.createView();
    this._sceneTargetSize[0] = w;
    this._sceneTargetSize[1] = h;

    // ping-pong 用の scratch も同じサイズで作ります
    this._filterScratchTexture?.destroy();
    this._filterScratchTexture = dev.createTexture({
      size: { width: w, height: h },
      format: this._swapFormat(),
      // COPY_SRC は診断の読み戻し用です（本番経路では不要）
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT |
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_SRC,
    });
    return true;
  }

  /**
   * scene target を背景色で clear します。
   *
   * target を**使い回す**ため、毎フレーム clear が/** Filter 経路の途中か（= スプライトがオフスクリーンへ描かれているか） */
  get renderingToTarget(): boolean {
    return this._sceneTarget !== null;
  }

  /**
   * Filter パスを 1 つ実行します。
   *
   * @param wgsl フラグメントシェーダ（`fs_main` を持つ）
   * @param srcTexture 読むテクスチャ
   * @param dstTexture 書くテクスチャ
   * @param uniforms uniform データ（vec4 × 8 = 128 バイト）
   */
  /**
   * Filter パスを 1 つ実行します。
   *
   * ## `passIndex` について
   *
   * 診断のため `passIndex` を持ちます。0 なら最初の入力（scene target）、
   * 1 以降なら直前の scratch を読む-pass であることを表します。
   * 出力は常に scratch です。
   */
  /**
   * 診断: scene target の中心画素を 1 つ読み戻します。
   *
   * 「scene が offscreen に入っているか」を推測せずに確認します。
   * 読み戻しは非同期なので、値は {@link filterStatus} から取得します。
   */
  probeSceneTarget(): void {
    const dev = this.device;
    const tex = this._sceneTexture;
    if (!dev || !tex || this._filterProbePending) return;
    if (!this._filterProbeBuffer) {
      this._filterProbeBuffer = dev.createBuffer({
        size: 256,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      });
    }
    const buffer = this._filterProbeBuffer;
    const w = Math.max(1, Math.floor(tex.width / 2));
    const h = Math.max(1, Math.floor(tex.height / 2));
    try {
      const enc = dev.createCommandEncoder();
      enc.copyTextureToBuffer(
        { texture: tex, origin: { x: w, y: h } },
        { buffer, bytesPerRow: 256 },
        { width: 1, height: 1 },
      );
      dev.queue.submit([enc.finish()]);
    } catch {
      this._sceneProbeValue = null;
      return;
    }
    this._filterProbePending = true;
    void buffer
      .mapAsync(GPUMapMode.READ)
      .then(() => {
        const px = new Uint8Array(buffer.getMappedRange(0, 4));
        this._sceneProbeValue = [px[0] ?? -1, px[1] ?? -1, px[2] ?? -1, px[3] ?? -1];
        buffer.unmap();
      })
      .catch(() => {
        this._sceneProbeValue = null;
      })
      .finally(() => {
        this._filterProbePending = false;
      });
  }

  private _sceneProbeValue: [number, number, number, number] | null = null;

  runFilterPass(
    wgsl: string,
    srcTexture: GPUTexture,
    dstTexture: GPUTexture,
    uniforms: Float32Array,
    probe = false,
  ): boolean {
    // probeSceneTarget が既に map 中なら、filter 側 probe は見送ります
    // （同じ buffer を二重に map するとエラーになります）
    const doProbe = probe && !this._filterProbePending;
    const dev = this.device;
    if (!dev) {
      this._filterLastError = 'device が未初期化';
      return false;
    }
    if (!this._filterPipelineLayout) {
      this._filterLastError = 'pipelineLayout が未初期化（initPipelines が走っていない）';
      return false;
    }

    const key = wgsl;
    let pipeline = this._filterPipelines.get(key);
    if (!pipeline) {
      const module = dev.createShaderModule({ code: wgsl });
      /**
       * pipeline 生成は**エラースコープ内で**行います。
       *
       * 不正な pipeline は例外ではなく validation error として報告され、
       * `setPipeline` が黙って無視されます（描画は空のまま）。
       * 生成直後に捕まえないと原因が失われます。
       */
      dev.pushErrorScope('validation');
      pipeline = dev.createRenderPipeline({
        layout: this._filterPipelineLayout,
        vertex: { module, entryPoint: 'vs_main' },
        fragment: { module, entryPoint: 'fs_main', targets: [{ format: this._swapFormat() }] },
        primitive: { topology: 'triangle-list' },
      });
      void dev.popErrorScope().then((err) => {
        if (err) {
          this._filterLastError = `pipeline 生成失敗: ${err.message}`;
          console.error('[filter] pipeline:', err.message);
        }
      });
      // コンパイル結果も明示的に取り出します
      void module.getCompilationInfo?.().then((info) => {
        for (const m of info.messages) {
          if (m.type === 'error') {
            const msg = `WGSL ${m.lineNum}:${m.linePos} ${m.message}`;
            this._filterLastError = msg;
            console.error('[filter]', msg);
          }
        }
      });
      this._filterPipelines.set(key, pipeline);
    }

    const uniformBuffer = this._ensureFilterUniforms();
    dev.queue.writeBuffer(
      uniformBuffer,
      0,
      uniforms.buffer as ArrayBuffer,
      uniforms.byteOffset,
      128,
    );

    const sampler = this._filterSampler;
    const layout = this._filterBindGroupLayout;
    if (!sampler || !layout) {
      this._filterLastError = 'sampler または bindGroupLayout が未初期化';
      return false;
    }
    const bindGroup = dev.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: sampler },
        { binding: 1, resource: srcTexture.createView() },
        { binding: 2, resource: { buffer: uniformBuffer } },
      ],
    });

    /**
     * Filter pass をエラースコープで包みます。
     *
     * draw が無効化されると**例外を投げずに黙って何も描かなくなる**ため、
     * 原因をBench に報告できるようにします。
     */
    dev.pushErrorScope('validation');
    const encoder = dev.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: dstTexture.createView(),
          clearValue: this.clearColor,
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.draw(3, 1, 0, 0);
    pass.end();
    /**
     * 診断は**出力側**（filter の結果）から読み戻します。
     *
     * 入力側を測ると「offscreen が空だった」のか
     * 「filter が空を出した」のかを区別できないためです。
     */
    if (doProbe) this._queueFilterProbe(encoder, dstTexture, srcTexture);
    dev.queue.submit([encoder.finish()]);
    void dev.popErrorScope().then((err) => {
      if (err) {
        this._filterLastError = err.message;
        console.error('[filter] validation:', err.message);
      }
    });
    this._filterLastError = '';
    this._filterPasses++;
    return true;
  }

  /**
   * 診断用: filter の入力 texture の中央 1 ピクセルを読み戻します。
   *
   * 「offscreen に scene が入っているか」を推測せずに確認するためです
   * （P-02 で「空描画を高速と誤認」した反省に基づきます）。
   * COPY_SRC が無い texture に対しては読み戻せません。
   */
  private _queueFilterProbe(
    encoder: GPUCommandEncoder,
    dstTexture: GPUTexture,
    srcTexture: GPUTexture,
  ): void {
    const dev = this.device;
    if (!dev || this._filterProbePending) return;
    if (!this._filterProbeBuffer) {
      this._filterProbeBuffer = dev.createBuffer({
        size: 512,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      });
    }
    const buffer = this._filterProbeBuffer;
    /**
     * 出力（dst）と入力（src）の 2 画素を 1 つのバッファへ読み戻します。
     * bytesPerRow 256 × 2 行 = 512 バイト。
     *
     * 「入力が空」か「出力が空」かを 1 回で区別するためです。
     */
    const w = Math.max(1, Math.floor(srcTexture.width / 2));
    const h = Math.max(1, Math.floor(srcTexture.height / 2));
    try {
      // 出力と入力は**別々のオフセット**へ読み戻します。
      // 同じオフセットへ 2 回コピーすると後勝ちで上書きされます。
      encoder.copyTextureToBuffer(
        { texture: dstTexture, origin: { x: w, y: h } },
        { buffer, bytesPerRow: 256, rowsPerImage: 1 },
        { width: 1, height: 1 },
      );
      encoder.copyTextureToBuffer(
        { texture: srcTexture, origin: { x: w, y: h } },
        { buffer, bytesPerRow: 256, offset: 256 },
        { width: 1, height: 1 },
      );
    } catch {
      // COPY_SRC が無い場合は読み戻せません（エラーにはしません）
      this._filterProbeValue = null;
      return;
    }
    this._filterProbePending = true;
    void buffer
      .mapAsync(GPUMapMode.READ)
      .then(() => {
        const px = new Uint8Array(buffer.getMappedRange(0, 8));
        // 出力 4 バイト +（256 へ整列された後）入力 4 バイト
        const dst: [number, number, number, number] = [
          px[0] ?? -1,
          px[1] ?? -1,
          px[2] ?? -1,
          px[3] ?? -1,
        ];
        const src: [number, number, number, number] = [
          px[4] ?? -1,
          px[5] ?? -1,
          px[6] ?? -1,
          px[7] ?? -1,
        ];
        this._filterProbeValue = dst;
        this._filterProbeSrc = src;
        buffer.unmap();
      })
      .catch(() => {
        this._filterProbeValue = null;
      })
      .finally(() => {
        this._filterProbePending = false;
      });
  }

  private _filterProbeBuffer: GPUBuffer | null = null;
  private _filterProbePending = false;
  private _filterProbeValue: [number, number, number, number] | null = null;
  private _filterProbeSrc: [number, number, number, number] | null = null;

  /**
   * Filter 適用済みの texture を canvas へ 1 パスで blit します。
   *
   * ここで初めて swapchain を書きます。Filter が無いときは
   * このメソッドを呼ばないので、canvas への直接描画のままです。
   */
  presentTarget(srcTexture: GPUTexture): boolean {
    const dev = this.device;
    if (!dev || !this.context) return false;
    // 不変パス（1:1 コピー）を使います。uniform なし・texture 1 枚のみ。
    if (!this._blitPipeline) {
      const module = dev.createShaderModule({ code: BLIT_WGSL });
      this._blitPipeline = dev.createRenderPipeline({
        layout: 'auto',
        vertex: { module, entryPoint: 'vs_main' },
        fragment: { module, entryPoint: 'fs_main', targets: [{ format: this._swapFormat() }] },
        primitive: { topology: 'triangle-list' },
      });
      this._blitSampler = dev.createSampler({ magFilter: 'linear', minFilter: 'linear' });
    }
    const pipeline = this._blitPipeline;
    const sampler = this._blitSampler;
    if (!pipeline || !sampler) return false;

    const bindGroup = dev.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: sampler },
        { binding: 1, resource: srcTexture.createView() },
      ],
    });

    const encoder = dev.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          clearValue: this.clearColor,
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.draw(3, 1, 0, 0);
    pass.end();
    dev.queue.submit([encoder.finish()]);
    return true;
  }

  /** RenderGraph から参照するための texture getter */
  getSceneTexture(): GPUTexture | null {
    return this._sceneTexture;
  }

  /** RenderGraph から参照するための scratch texture getter */
  getFilterScratchTexture(): GPUTexture | null {
    return this._filterScratchTexture;
  }

  /** Filter 用の uniform バッファ（128 バイト）を 1 つだけ持ち回します */
  private _ensureFilterUniforms(): GPUBuffer {
    if (this._filterUniformBuffer) return this._filterUniformBuffer;
    const dev = this.device;
    if (!dev) throw new Error('Device not initialized');
    this._filterUniformBuffer = dev.createBuffer({
      size: 128,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    return this._filterUniformBuffer;
  }

  /**
   * scene の描画先 view。`null` なら swapchain（従来経路）です。
   *
   * **view と texture を分けて持ちます。** view は texture から作るため
   * 破棄は texture 側だけで済みますが、probe（copyTextureToBuffer）は
   * texture を要求するため、view だけでは読み戻せません。
   */
  private _sceneTarget: GPUTextureView | null = null;
  private _sceneTexture: GPUTexture | null = null;

  /**
   * swapchain の format（キャッシュ）。
   *
   * **offscreen texture はこの format と一致させる必要があります。**
   * 異なる format で render pass を作ると validation error になり、
   * scene が 1 ピクセルも描かれません。
   * 症状だけ見ると「空描画」なので、原因の特定には時間がかかります
   * （実際にここでは時間のかかりました）。
   */
  private _swapFormatValue: GPUTextureFormat | null = null;

  private _swapFormat(): GPUTextureFormat {
    if (!this._swapFormatValue) {
      this._swapFormatValue = navigator.gpu.getPreferredCanvasFormat();
    }
    return this._swapFormatValue;
  }
  private _sceneTargetSize: [number, number] = [0, 0];
  /** swapchain（canvas）の実寸。target と一致しているかを確認するために持ちます */
  private _swapSize: [number, number] = [0, 0];
  private _filterScratchTexture: GPUTexture | null = null;
  private _filterPipelines = new Map<string, GPURenderPipeline>();
  /** 明示的な bind group layout。`auto` だとシェーダごとに変わるため共有します。 */
  private _filterBindGroupLayout: GPUBindGroupLayout | null = null;
  private _filterPipelineLayout: GPUPipelineLayout | null = null;
  private _filterUniformBuffer: GPUBuffer | null = null;
  private _filterSampler: GPUSampler | null = null;
  private _blitPipeline: GPURenderPipeline | null = null;
  private _blitSampler: GPUSampler | null = null;
  /** 診断: 直近の filter パス失敗理由と、通過したパス数 */
  private _filterLastError = '';
  private _filterPasses = 0;

  /**
   * Filter 経路の診断情報を返します（ベンチ用）。
   *
   * `passes` が 0 なら filter が 1 度も実行されていません。
   * `lastError` があれば、その理由が入っています。
   */
  filterStatus(): {
    passes: number;
    lastError: string;
    targetWidth: number;
    targetHeight: number;
    swapWidth: number;
    swapHeight: number;
    probe: [number, number, number, number] | null;
    probeSrc: [number, number, number, number] | null;
    sceneProbe: [number, number, number, number] | null;
  } {
    return {
      passes: this._filterPasses,
      lastError: this._filterLastError,
      targetWidth: this._sceneTargetSize[0],
      targetHeight: this._sceneTargetSize[1],
      /** swapchain の実寸（target と一致している必要があります） */
      swapWidth: this._swapSize[0],
      swapHeight: this._swapSize[1],
      /**
       * filter 入力 texture の中央付近 1 ピクセル（診断用）。
       * null なら読み戻し失敗、全部 -1 なら offscreen が空です。
       */
      probe: this._filterProbeValue,
      /** filter の入力（= scene target）側の同じ画素。null なら読み戻し失敗 */
      probeSrc: this._filterProbeSrc,
      /** scene target の中心画素（filter 連鎖の前）。null なら読み戻し失敗 */
      sceneProbe: this._sceneProbeValue,
    };
  }

  /**
   * compute カリングの各段階の状態を返します（診断用）。
   *
   * `isComputeCullingSupported()` が false になる原因は 1 つではないため、
   * どの段階で落ちたかを bench に報告させます
   * （Phase 8 P-02 で「無言で compute が効かない」症状の切り分けに使用）。
   */
  computeCullingStatus(): {
    enabled: boolean;
    limitOk: boolean;
    hasParams: boolean;
    hasIndirect: boolean;
    hasPipeline: boolean;
    hasBindGroup: boolean;
    bufferCount: number;
    attempts: number;
    lastFail: string;
  } {
    return {
      enabled: this._computeCullingEnabled,
      limitOk: (this.limits?.maxStorageBuffersPerShaderStage ?? 0) >= CULL_STORAGE_BUFFER_COUNT,
      hasParams: this._cullParams !== null,
      hasIndirect: this._cullIndirect !== null,
      hasPipeline: this._cullPipeline !== null,
      hasBindGroup: this._cullBindGroup !== null,
      bufferCount: Object.keys(this._boundBuffers).length,
      attempts: this._cullAttempts,
      lastFail: this._cullLastFail,
    };
  }

  /**
   * compute カリングを実行し、間接描画引数を更新します (Phase 8 P-02)。
   *
   * @param rect 可視矩形 (minX, minY, maxX, maxY)
   * @param instanceCount 判定対象のインスタンス数
   * @returns dispatch を行ったか
   */
  beginComputeCulling(rect: Float32Array, instanceCount: number): boolean {
    const dev = this.device;
    const indirectBuf = this._cullIndirect;
    const paramsBuf = this._cullParams;
    const pipeline = this._cullPipeline;
    this._computeCullingDispatched = false;
    this._cullAttempts++;
    if (!dev || instanceCount <= 0) {
      this._cullLastFail = !dev ? 'device が未初期化' : `instanceCount=${instanceCount}`;
      return false;
    }
    /**
     * bind group は `_ensureCullBindGroup` が作るので、
     * ここで存在を要求してはいけません（鶏と卵になります）。
     */
    if (!indirectBuf || !paramsBuf || !pipeline) {
      this._cullLastFail = 'params / indirect / pipeline が未用意';
      return false;
    }
    if (!this._ensureCullBindGroup()) {
      this._cullLastFail = '_ensureCullBindGroup が false を返した';
      return false;
    }
    // _ensureCullBindGroup が bind group を作り直すため、その実体をここで確定します
    const group = this._cullBindGroup;
    if (!group) {
      this._cullLastFail = '_ensureCullBindGroup 後も bindGroup が null';
      return false;
    }

    // 間接描画引数の instanceCount を毎回 0 に戻します
    dev.queue.writeBuffer(indirectBuf, 4, new Uint32Array([0]).buffer);
    this._cullRectBuf.set(rect);
    this._cullParamsF32.set(rect, 0);
    this._cullParamsU32[4] = instanceCount;
    dev.queue.writeBuffer(paramsBuf, 0, this._cullParamsBuf);

    dev.pushErrorScope('validation');
    const encoder = dev.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, group);
    pass.dispatchWorkgroups(Math.ceil(instanceCount / 64));
    pass.end();
    dev.queue.submit([encoder.finish()]);
    void dev.popErrorScope().then((err) => {
      if (err) console.warn('[computeCulling]', err.message);
    });
    this._computeCullingDispatched = true;
    return true;
  }

  /**
   * 直近の compute カリングで数えた可視インスタンス数を返します (Phase 8 P-02)。
   *
   * **間接描画は CPU から見た描画数を返さないため、この値が唯一の
   * 「本当に何体描いたか」の証拠になります。** ベンチはこれを必ず報告します。
   *
   * 読み出しは非同期です。実測できるフレームまで -1 を返します。
   */
  resolveVisibleCount(): number {
    const dev = this.device;
    const indirect = this._cullIndirect;
    if (!dev || !indirect) return -1;
    if (!this._visibleCountReadback) {
      this._visibleCountReadback = dev.createBuffer({
        size: 16,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      });
    }
    const dst = this._visibleCountReadback;
    if (this._visibleCountMapping) return this._lastVisibleCount;

    const enc = dev.createCommandEncoder();
    enc.copyBufferToBuffer(indirect, 4, dst, 0, 4);
    dev.queue.submit([enc.finish()]);

    this._visibleCountMapping = true;
    void dst
      .mapAsync(GPUMapMode.READ)
      .then(() => {
        this._lastVisibleCount = new Uint32Array(dst.getMappedRange(0, 4))[0] ?? -1;
        dst.unmap();
      })
      .catch(() => {
        this._lastVisibleCount = -1;
      })
      .finally(() => {
        this._visibleCountMapping = false;
      });
    return this._lastVisibleCount;
  }

  private _visibleCountReadback: GPUBuffer | null = null;
  private _visibleCountMapping = false;
  private _lastVisibleCount = -1;
  /** `beginComputeCulling` の呼ばれ回数と直近の失敗理由（診断用）。 */
  private _cullAttempts = 0;
  private _cullLastFail = '';

  /**
   * 直近の compute dispatch 状態を踏まえて、間接描画を使うか決めます。
   *
   * compute カリングが走っていないフレーム（0 体など）は通常描画に戻します。
   */
  private _shouldUseIndirect(): boolean {
    return this._cullIndirect !== null && this._computeCullingDispatched;
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
    /**
     * Filter 経路（RenderGraph）が有効なときは canvas ではなく
     * オフスクリーンのテクスチャへ描きます。
     * canvas への描画は最後に 1 パスだけで行います。
     *
     * `load` は**必ず clear** にします。target は使い回すため、
     * `load` にすると前のフレームの残像が上書きされずに残ります。
     * clear は {@link beginSceneToTarget} の専用パスで行い、
     * このパスは scene の上書きに専念します（同一パスの load/clear は
     * どちらでも 1 回ですが、职责を分けたほうが安全です）。
     */
    const view = this._sceneTarget ?? this.context.getCurrentTexture().createView();

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
          // Filter 経路では前のパスの結果を引き継ぐので load します
          // 背景で clear します（前フレームの残像を残さないため）
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
    // compute カリング時は詰替先（出力バッファ）を描画データとして使います。
    // 入力バッファは swap 前の並びなので、そのまま描くと「先頭 N 体」になります。
    const indirectDraw = this._shouldUseIndirect();
    for (let b = 0; b < INSTANCE_BUFFERS.length; b++) {
      const spec = INSTANCE_BUFFERS[b];
      if (!spec.eager) continue;
      const info = this._boundBuffers[spec.name];
      if (!info) continue;
      const bound = indirectDraw
        ? (this._cullOutBuffers[spec.name] ?? (info.buffer as GPUBuffer))
        : (info.buffer as GPUBuffer);
      // baseInstance * stride を byteOffset として渡すことで、
      // firstInstance のない WebGL2 と同じ「可視区間だけ描画」を実現します。
      pass.setVertexBuffer(spec.slot, bound, baseInstance * spec.stride);
    }
    // 共有 Quad は triangle-strip の 4 頂点です
    if (indirectDraw) {
      // 可視数は compute が間接描画引数へ加算済みです
      const indirectBuf = this._cullIndirect;
      if (indirectBuf) {
        pass.drawIndirect(indirectBuf, 0);
      } else {
        pass.draw(4, activeCount, 0, 0);
      }
    } else {
      pass.draw(4, activeCount, 0, 0);
    }
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
