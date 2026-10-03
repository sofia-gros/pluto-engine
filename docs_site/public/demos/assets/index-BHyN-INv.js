var qt = Object.defineProperty;
var Nt = (t, e, i) =>
  e in t ? qt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : (t[e] = i);
var n = (t, e, i) => Nt(t, typeof e != 'symbol' ? e + '' : e, i);
(function () {
  const e = document.createElement('link').relList;
  if (e && e.supports && e.supports('modulepreload')) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) s(r);
  new MutationObserver((r) => {
    for (const a of r)
      if (a.type === 'childList')
        for (const h of a.addedNodes) h.tagName === 'LINK' && h.rel === 'modulepreload' && s(h);
  }).observe(document, { childList: !0, subtree: !0 });
  function i(r) {
    const a = {};
    return (
      r.integrity && (a.integrity = r.integrity),
      r.referrerPolicy && (a.referrerPolicy = r.referrerPolicy),
      r.crossOrigin === 'use-credentials'
        ? (a.credentials = 'include')
        : r.crossOrigin === 'anonymous'
          ? (a.credentials = 'omit')
          : (a.credentials = 'same-origin'),
      a
    );
  }
  function s(r) {
    if (r.ep) return;
    r.ep = !0;
    const a = i(r);
    fetch(r.href, a);
  }
})();
var O = 32,
  B = ((t) => (
    (t[(t.PosX = 0)] = 'PosX'),
    (t[(t.PosY = 1)] = 'PosY'),
    (t[(t.ScaleX = 2)] = 'ScaleX'),
    (t[(t.ScaleY = 3)] = 'ScaleY'),
    t
  ))(B || {}),
  R = ((t) => (
    (t[(t.Rotation = 0)] = 'Rotation'),
    (t[(t.FrameWidth = 1)] = 'FrameWidth'),
    (t[(t.FrameHeight = 2)] = 'FrameHeight'),
    (t[(t.Depth = 3)] = 'Depth'),
    t
  ))(R || {}),
  k = ((t) => (
    (t[(t.X = 0)] = 'X'), (t[(t.Y = 1)] = 'Y'), (t[(t.W = 2)] = 'W'), (t[(t.H = 3)] = 'H'), t
  ))(k || {}),
  D = ((t) => (
    (t[(t.FrameIdx = 0)] = 'FrameIdx'),
    (t[(t.Facing = 1)] = 'Facing'),
    (t[(t.Visible = 2)] = 'Visible'),
    (t[(t.SpriteFlags = 3)] = 'SpriteFlags'),
    t
  ))(D || {}),
  X = ((t) => (
    (t[(t.OriginX = 0)] = 'OriginX'),
    (t[(t.OriginY = 1)] = 'OriginY'),
    (t[(t.ScrollFactorX = 2)] = 'ScrollFactorX'),
    (t[(t.ScrollFactorY = 3)] = 'ScrollFactorY'),
    t
  ))(X || {}),
  gt = ((t) => (
    (t[(t.Multiply = 0)] = 'Multiply'),
    (t[(t.Fill = 1)] = 'Fill'),
    (t[(t.Add = 2)] = 'Add'),
    (t[(t.Screen = 3)] = 'Screen'),
    (t[(t.Overlay = 4)] = 'Overlay'),
    (t[(t.HardLight = 5)] = 'HardLight'),
    t
  ))(gt || {}),
  tt = ((t) => (
    (t[(t.Normal = 0)] = 'Normal'),
    (t[(t.Add = 1)] = 'Add'),
    (t[(t.Multiply = 2)] = 'Multiply'),
    (t[(t.Screen = 3)] = 'Screen'),
    (t[(t.Count = 4)] = 'Count'),
    t
  ))(tt || {}),
  L = { Pos: 0, Uv: 1 },
  yt = 16,
  I = [
    {
      name: 'packedTransform',
      arrayName: 'packedTransform',
      stride: 16,
      vectors: 1,
      location: 2,
      slot: 1,
      format: 'float32x4',
      eager: !0,
    },
    {
      name: 'packedUv',
      arrayName: 'packedUv',
      stride: 16,
      vectors: 1,
      location: 3,
      slot: 2,
      format: 'float32x4',
      eager: !0,
    },
    {
      name: 'packedFlags',
      arrayName: 'packedFlags',
      stride: 16,
      vectors: 1,
      location: 4,
      slot: 3,
      format: 'float32x4',
      eager: !0,
    },
    {
      name: 'packedShape',
      arrayName: 'packedShape',
      stride: 16,
      vectors: 1,
      location: 5,
      slot: 4,
      format: 'float32x4',
      eager: !0,
    },
    {
      name: 'packedTint',
      arrayName: 'packedTint',
      stride: 4,
      vectors: 1,
      location: 6,
      slot: 5,
      format: 'unorm8x4',
      eager: !0,
    },
    {
      name: 'packedOrigin',
      arrayName: 'packedOrigin',
      stride: 16,
      vectors: 1,
      location: 7,
      slot: 6,
      format: 'float32x4',
      eager: !0,
    },
    {
      name: 'packedExt',
      arrayName: 'packedExt',
      stride: 64,
      vectors: 4,
      location: 8,
      slot: 7,
      format: 'float32x4',
      eager: !1,
    },
  ];
I.filter((t) => t.eager).length;
new Map(I.map((t) => [t.name, t]));
function $t(t = !1) {
  const e = [];
  for (let i = 0; i < I.length; i++) {
    const s = I[i];
    if (!(!s.eager && !t))
      for (let r = 0; r < s.vectors; r++)
        e.push(
          `layout(location = ${s.location + r}) in vec4 ${Ht(s, r)};  // ${s.name}${s.vectors > 1 ? `[${r}]` : ''}`,
        );
  }
  return e.join(`
`);
}
function Kt(t = !1) {
  const e = [];
  for (let i = 0; i < I.length; i++) {
    const s = I[i];
    if (!(!s.eager && !t))
      for (let r = 0; r < s.vectors; r++)
        e.push(`  @location(${s.location + r}) ${jt(s, r)}: vec4<f32>,`);
  }
  return e.join(`
`);
}
function Qt(t = !1) {
  const e = [];
  for (let i = 0; i < I.length; i++) {
    const s = I[i];
    if (!(!s.eager && !t))
      for (let r = 0; r < s.vectors; r++)
        e.push({
          shaderLocation: s.location + r,
          offset: r * (s.format === 'unorm8x4' ? 4 : 16),
          format: s.format,
        });
  }
  return e;
}
function St(t) {
  switch (t.arrayName) {
    case 'packedTransform':
      return 'iTransform';
    case 'packedUv':
      return 'iUv';
    case 'packedFlags':
      return 'iFlags';
    case 'packedShape':
      return 'iShape';
    case 'packedTint':
      return 'iTint';
    case 'packedOrigin':
      return 'iOrigin';
    default:
      return 'iExt';
  }
}
function Ht(t, e) {
  return t.vectors > 1 ? `${St(t)}${e}` : St(t);
}
function jt(t, e) {
  return Ht(t, e);
}
var Jt = `
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
`,
  Et = 13,
  Zt = `
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
`,
  te = `
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
  @location(${L.Pos}) vertexPos : vec2<f32>,
  @location(${L.Uv}) vertexUV  : vec2<f32>,
${Kt()}
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
`,
  bt = new Float32Array([-0.5, -0.5, 0, 0, 0.5, -0.5, 1, 0, -0.5, 0.5, 0, 1, 0.5, 0.5, 1, 1]);
function ee(t) {
  return Math.ceil(t / 4) * 4;
}
var ie = class {
    constructor() {
      n(this, 'device', null);
      n(this, 'context', null);
      n(this, 'textures', new Map());
      n(this, 'pipeline', null);
      n(this, 'bindGroup', null);
      n(this, 'uniformBuffer', null);
      n(this, 'quadBuffer', null);
      n(this, 'textureArray', null);
      n(this, 'textureView', null);
      n(this, 'sampler', null);
      n(this, 'clearColor', { r: 0, g: 0, b: 0, a: 1 });
      n(this, '_sdfUniforms', new Float32Array(4));
      n(this, 'limits', null);
      n(this, 'textureWidth', 2048);
      n(this, 'textureHeight', 2048);
      n(this, '_boundBuffers', {});
      n(this, '_cullParams', null);
      n(this, '_cullIndirect', null);
      n(this, '_cullPipeline', null);
      n(this, '_cullBindGroup', null);
      n(this, '_computeCullingEnabled', !1);
      n(this, '_computeCullingSupported', !1);
      n(this, '_cullBindGroupBuilt', !1);
      n(this, '_cullOutBuffers', {});
      n(this, '_computeCullingDispatched', !1);
      n(this, '_cullRectBuf', new Float32Array(4));
      n(this, '_cullParamsBuf', new ArrayBuffer(32));
      n(this, '_cullParamsF32', new Float32Array(this._cullParamsBuf));
      n(this, '_cullParamsU32', new Uint32Array(this._cullParamsBuf));
      n(this, '_sceneProbeValue', null);
      n(this, '_filterProbeBuffer', null);
      n(this, '_filterProbePending', !1);
      n(this, '_filterProbeValue', null);
      n(this, '_filterProbeSrc', null);
      n(this, '_sceneTarget', null);
      n(this, '_sceneTexture', null);
      n(this, '_swapFormatValue', null);
      n(this, '_sceneTargetSize', [0, 0]);
      n(this, '_swapSize', [0, 0]);
      n(this, '_filterScratchTexture', null);
      n(this, '_filterPipelines', new Map());
      n(this, '_filterBindGroupLayout', null);
      n(this, '_filterPipelineLayout', null);
      n(this, '_filterUniformBuffer', null);
      n(this, '_filterSampler', null);
      n(this, '_blitPipeline', null);
      n(this, '_blitSampler', null);
      n(this, '_filterLastError', '');
      n(this, '_filterPasses', 0);
      n(this, '_visibleCountReadback', null);
      n(this, '_visibleCountMapping', !1);
      n(this, '_lastVisibleCount', -1);
      n(this, '_cullAttempts', 0);
      n(this, '_cullLastFail', '');
      n(this, '_timestampSupported', !1);
      n(this, '_timestampQueryEnabled', !1);
      n(this, '_timestampQuerySet', null);
      n(this, '_timestampResolve', null);
      n(this, '_timestampReadback', null);
      n(this, '_lastGpuMs', -1);
      n(this, '_timestampError', '');
      n(this, '_timestampRaw0', -1);
      n(this, '_timestampRaw1', -1);
      n(this, '_timestampMapping', !1);
      n(this, '_timestampPendingMap', !1);
    }
    async init(t) {
      if (!navigator.gpu) throw new Error('WebGPU is not supported');
      const e = await navigator.gpu.requestAdapter();
      if (!e) throw new Error('No WebGPU adapter found');
      (this.limits = e.limits),
        this._timestampQueryEnabled
          ? (this._timestampSupported = e.features.has('timestamp-query'))
          : (this._timestampSupported = !1);
      const i = this._timestampSupported ? ['timestamp-query'] : [],
        s = I.filter((u) => u.eager).length + 1;
      this.limits.maxVertexBuffers < s &&
        console.warn(
          `[WebGPUDevice] maxVertexBuffers=${this.limits.maxVertexBuffers} < 必要数 ${s}。描画が壊れる可能性があります。`,
        );
      const r = Et,
        h =
          this.limits.maxStorageBuffersPerShaderStage >= r
            ? { maxStorageBuffersPerShaderStage: r }
            : {};
      (this.device = await e.requestDevice({ requiredFeatures: [...i], requiredLimits: h })),
        this._setupTimestampQuery(),
        (this._computeCullingSupported =
          this._computeCullingEnabled && this.limits.maxStorageBuffersPerShaderStage >= 13),
        this._computeCullingSupported && this._setupComputeCulling();
      const o = t.getContext('webgpu');
      if (!o) throw new Error('Failed to get WebGPU context');
      o.configure({
        device: this.device,
        format: navigator.gpu.getPreferredCanvasFormat(),
        alphaMode: 'premultiplied',
      }),
        (this.context = o);
    }
    _initFilterSupport() {
      const t = this.device;
      !t ||
        this._filterPipelineLayout ||
        ((this._filterSampler = t.createSampler({
          magFilter: 'linear',
          minFilter: 'linear',
          addressModeU: 'clamp-to-edge',
          addressModeV: 'clamp-to-edge',
        })),
        (this._filterBindGroupLayout = t.createBindGroupLayout({
          entries: [
            { binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
            { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
            { binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
          ],
        })),
        (this._filterPipelineLayout = t.createPipelineLayout({
          bindGroupLayouts: [this._filterBindGroupLayout],
        })));
    }
    initPipelines() {
      if (!this.device || !this.context) throw new Error('Device not initialized');
      const t = this.device;
      (this.uniformBuffer = t.createBuffer({
        size: 96,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      })),
        (this._sdfUniforms[0] = 0.5),
        (this._sdfUniforms[1] = 0.08),
        t.queue.writeBuffer(this.uniformBuffer, 64, this._sdfUniforms.buffer, 0, 16),
        (this.quadBuffer = t.createBuffer({
          size: bt.byteLength,
          usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        })),
        t.queue.writeBuffer(this.quadBuffer, 0, bt),
        (this.textureArray = t.createTexture({
          size: { width: 2048, height: 2048, depthOrArrayLayers: 64 },
          format: this._swapFormat(),
          dimension: '2d',
          usage:
            GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.COPY_DST |
            GPUTextureUsage.RENDER_ATTACHMENT,
        })),
        (this.textureView = this.textureArray.createView({ dimension: '2d-array' })),
        (this.sampler = t.createSampler({ magFilter: 'nearest', minFilter: 'nearest' }));
      const e = t.createShaderModule({ code: te }),
        i = Qt(),
        s = [];
      for (let r = 0; r < I.length; r++) {
        const a = I[r];
        if (!a.eager) continue;
        const h = i.filter(
          (o) => o.shaderLocation >= a.location && o.shaderLocation < a.location + a.vectors,
        );
        s.push({ arrayStride: a.stride, stepMode: 'instance', attributes: h });
      }
      (this.pipeline = t.createRenderPipeline({
        layout: 'auto',
        vertex: {
          module: e,
          entryPoint: 'vs_main',
          buffers: [
            {
              arrayStride: yt,
              stepMode: 'vertex',
              attributes: [
                { shaderLocation: L.Pos, offset: 0, format: 'float32x2' },
                { shaderLocation: L.Uv, offset: 8, format: 'float32x2' },
              ],
            },
            ...s,
          ],
        },
        fragment: {
          module: e,
          entryPoint: 'fs_main',
          targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
        },
        primitive: { topology: 'triangle-strip' },
      })),
        (this.bindGroup = t.createBindGroup({
          layout: this.pipeline.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: this.uniformBuffer } },
            { binding: 1, resource: this.textureView },
            { binding: 2, resource: this.sampler },
          ],
        })),
        this._initComputeCulling(),
        this._initFilterSupport();
    }
    createBuffer(t) {
      if (!this.device) throw new Error('Device not initialized');
      const e = ee(t);
      return {
        buffer: this.device.createBuffer({
          size: e,
          usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
        }),
        size: e,
      };
    }
    updateBuffer(t, e, i = 0, s) {
      if (!this.device) throw new Error('Device not initialized');
      const r = s ?? e.length - i;
      if (r <= 0) return;
      const a = t.buffer,
        h = i * e.BYTES_PER_ELEMENT,
        o = r * e.BYTES_PER_ELEMENT,
        u = a.size - h;
      this.device.queue.writeBuffer(a, h, e.buffer, e.byteOffset, Math.min(o, u));
    }
    uploadTexture(t, e, i) {
      if (!this.device || !this.textureArray) throw new Error('Device not initialized');
      const s = this.device,
        r = e.width,
        a = e.height,
        h = this.textures.size % 64;
      let o;
      if (typeof ImageData < 'u' && e instanceof ImageData)
        o = new Uint8Array(e.data.buffer.slice(0));
      else {
        const _ = document.createElement('canvas');
        (_.width = r), (_.height = a);
        const g = _.getContext('2d');
        if (!g) throw new Error('Failed to acquire 2d context for texture upload');
        g.drawImage(e, 0, 0);
        const p = g.getImageData(0, 0, r, a);
        o = new Uint8Array(p.data.buffer.slice(0));
      }
      s.queue.writeTexture(
        { texture: this.textureArray, origin: { x: 0, y: 0, z: h } },
        o,
        { bytesPerRow: r * 4, rowsPerImage: a },
        { width: r, height: a, depthOrArrayLayers: 1 },
      );
      const u = [],
        l = this.textureWidth,
        d = this.textureHeight,
        c = i == null ? void 0 : i.frames;
      if (c !== void 0 && c.length > 0)
        for (let _ = 0; _ < c.length; _++) {
          const g = c[_];
          u.push({ uvX: g.x / l, uvY: g.y / d, uvW: g.w / l, uvH: g.h / d });
        }
      else {
        const _ = (i == null ? void 0 : i.frameWidth) || r,
          g = (i == null ? void 0 : i.frameHeight) || a,
          p = Math.max(1, Math.floor(r / _)),
          y = Math.max(1, Math.floor(a / g));
        for (let v = 0; v < y; v++)
          for (let m = 0; m < p; m++)
            u.push({ uvX: (m * _) / l, uvY: (v * g) / d, uvW: _ / l, uvH: g / d });
      }
      const f = {
        key: t,
        layerIndex: h,
        width: r,
        height: a,
        frameWidth: (i == null ? void 0 : i.frameWidth) || r,
        frameHeight: (i == null ? void 0 : i.frameHeight) || a,
        frames: u,
      };
      return this.textures.set(t, f), f;
    }
    getTexture(t) {
      return this.textures.get(t);
    }
    clear(t, e, i, s) {
      this.clearColor = { r: t, g: e, b: i, a: s };
    }
    bindShaders(t = 0.5, e = 0.08) {
      !this.device ||
        !this.uniformBuffer ||
        ((this._sdfUniforms[0] = t),
        (this._sdfUniforms[1] = e),
        this.device.queue.writeBuffer(this.uniformBuffer, 64, this._sdfUniforms.buffer, 0, 16));
    }
    setupInstancedAttributes(t, e, i = 0) {
      if (!this.device) throw new Error('Device not initialized');
      this._boundBuffers = t;
    }
    readPixels(t, e, i) {
      return !1;
    }
    _setupComputeCulling() {
      const t = this.device;
      if (t && !(t.limits.maxStorageBuffersPerShaderStage < 4))
        try {
          (this._cullParams = t.createBuffer({
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
          })),
            (this._cullIndirect = t.createBuffer({
              size: 16,
              usage:
                GPUBufferUsage.STORAGE |
                GPUBufferUsage.INDIRECT |
                GPUBufferUsage.COPY_DST |
                GPUBufferUsage.COPY_SRC,
            })),
            t.queue.writeBuffer(this._cullIndirect, 0, new Uint32Array([4, 0, 0, 0]).buffer);
        } catch {
          (this._cullParams = null), (this._cullIndirect = null);
        }
    }
    enableComputeCulling() {
      this._computeCullingEnabled = !0;
    }
    _ensureCullBindGroup() {
      const t = this.device;
      if (!t || !this._cullPipeline || !this._cullParams || !this._cullIndirect) return !1;
      if (this._cullBindGroup && this._cullBindGroupBuilt) return !0;
      const e = (u) => {
          var l;
          return (l = this._boundBuffers[u]) == null ? void 0 : l.buffer;
        },
        i = e('packedTransform'),
        s = e('packedShape'),
        r = e('packedFlags'),
        a = e('packedUv'),
        h = e('packedTint'),
        o = e('packedOrigin');
      if (!i || !s || !r || !a || !h || !o) return !1;
      try {
        const u = (p, y) => {
            const v = this._cullOutBuffers[p];
            if (v && v.size === y.size) return v;
            v == null || v.destroy();
            const m = t.createBuffer({
              size: y.size,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX,
            });
            return (this._cullOutBuffers[p] = m), m;
          },
          l = u('packedTransform', i),
          d = u('packedShape', s),
          c = u('packedFlags', r),
          f = u('packedUv', a),
          _ = u('packedOrigin', o),
          g = u('packedTint', h);
        return !l || !d || !c || !f || !_ || !g
          ? !1
          : (t.pushErrorScope('validation'),
            (this._cullBindGroup = t.createBindGroup({
              layout: this._cullPipeline.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: this._cullParams } },
                { binding: 1, resource: { buffer: i } },
                { binding: 2, resource: { buffer: s } },
                { binding: 3, resource: { buffer: r } },
                { binding: 4, resource: { buffer: a } },
                { binding: 5, resource: { buffer: h } },
                { binding: 6, resource: { buffer: o } },
                { binding: 7, resource: { buffer: this._cullIndirect } },
                { binding: 8, resource: { buffer: l } },
                { binding: 9, resource: { buffer: f } },
                { binding: 10, resource: { buffer: c } },
                { binding: 11, resource: { buffer: d } },
                { binding: 12, resource: { buffer: g } },
                { binding: 13, resource: { buffer: _ } },
              ],
            })),
            (this._cullBindGroupBuilt = !0),
            t.popErrorScope().then((p) => {
              p &&
                (console.error('[computeCulling] bindGroup:', p.message),
                (this._cullBindGroup = null),
                (this._cullBindGroupBuilt = !1));
            }),
            !0);
      } catch {
        return t.popErrorScope(), (this._cullBindGroup = null), (this._cullBindGroupBuilt = !1), !1;
      }
    }
    _initComputeCulling() {
      var e;
      const t = this.device;
      if (!(!t || !this._computeCullingEnabled || !this._cullParams || !this._cullIndirect)) {
        try {
          const i = t.createShaderModule({ code: Zt });
          (e = i.getCompilationInfo) == null ||
            e.call(i).then((s) => {
              for (const r of s.messages)
                r.type === 'error' &&
                  console.error(`[computeCulling] WGSL ${r.lineNum}:${r.linePos} ${r.message}`);
            }),
            t.pushErrorScope('validation'),
            (this._cullPipeline = t.createComputePipeline({
              layout: 'auto',
              compute: { module: i, entryPoint: 'cs_main' },
            })),
            t.popErrorScope().then((s) => {
              s && console.error('[computeCulling] pipeline:', s.message);
            });
        } catch {
          this._cullPipeline = null;
        }
        (this._cullBindGroup = null), (this._cullBindGroupBuilt = !1);
      }
    }
    isComputeCullingSupported() {
      return this._computeCullingSupported && this._cullPipeline !== null;
    }
    isFilterSupported() {
      return this.device !== null && this.context !== null;
    }
    beginSceneToTarget(t, e) {
      var h, o;
      const i = this.device;
      if (!i || !this.isFilterSupported()) return !1;
      const s = Math.max(1, Math.floor(t)),
        r = Math.max(1, Math.floor(e));
      if (this._sceneTexture && this._sceneTargetSize[0] === s && this._sceneTargetSize[1] === r)
        return (
          (this._swapSize[0] = s),
          (this._swapSize[1] = r),
          (this._sceneTarget = this._sceneTexture.createView()),
          !0
        );
      (h = this._sceneTexture) == null || h.destroy();
      const a = i.createTexture({
        size: { width: s, height: r },
        format: this._swapFormat(),
        usage:
          GPUTextureUsage.RENDER_ATTACHMENT |
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_SRC,
      });
      return (
        (this._sceneTexture = a),
        (this._sceneTarget = a.createView()),
        (this._sceneTargetSize[0] = s),
        (this._sceneTargetSize[1] = r),
        (o = this._filterScratchTexture) == null || o.destroy(),
        (this._filterScratchTexture = i.createTexture({
          size: { width: s, height: r },
          format: this._swapFormat(),
          usage:
            GPUTextureUsage.RENDER_ATTACHMENT |
            GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.COPY_SRC,
        })),
        !0
      );
    }
    get renderingToTarget() {
      return this._sceneTarget !== null;
    }
    probeSceneTarget() {
      const t = this.device,
        e = this._sceneTexture;
      if (!t || !e || this._filterProbePending) return;
      this._filterProbeBuffer ||
        (this._filterProbeBuffer = t.createBuffer({
          size: 256,
          usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
        }));
      const i = this._filterProbeBuffer,
        s = Math.max(1, Math.floor(e.width / 2)),
        r = Math.max(1, Math.floor(e.height / 2));
      try {
        const a = t.createCommandEncoder();
        a.copyTextureToBuffer(
          { texture: e, origin: { x: s, y: r } },
          { buffer: i, bytesPerRow: 256 },
          { width: 1, height: 1 },
        ),
          t.queue.submit([a.finish()]);
      } catch {
        this._sceneProbeValue = null;
        return;
      }
      (this._filterProbePending = !0),
        i
          .mapAsync(GPUMapMode.READ)
          .then(() => {
            const a = new Uint8Array(i.getMappedRange(0, 4));
            (this._sceneProbeValue = [a[0] ?? -1, a[1] ?? -1, a[2] ?? -1, a[3] ?? -1]), i.unmap();
          })
          .catch(() => {
            this._sceneProbeValue = null;
          })
          .finally(() => {
            this._filterProbePending = !1;
          });
    }
    runFilterPass(t, e, i, s, r = !1) {
      var p;
      const a = r && !this._filterProbePending,
        h = this.device;
      if (!h) return (this._filterLastError = 'device が未初期化'), !1;
      if (!this._filterPipelineLayout)
        return (
          (this._filterLastError = 'pipelineLayout が未初期化（initPipelines が走っていない）'), !1
        );
      const o = t;
      let u = this._filterPipelines.get(o);
      if (!u) {
        const y = h.createShaderModule({ code: t });
        h.pushErrorScope('validation'),
          (u = h.createRenderPipeline({
            layout: this._filterPipelineLayout,
            vertex: { module: y, entryPoint: 'vs_main' },
            fragment: {
              module: y,
              entryPoint: 'fs_main',
              targets: [{ format: this._swapFormat() }],
            },
            primitive: { topology: 'triangle-list' },
          })),
          h.popErrorScope().then((v) => {
            v &&
              ((this._filterLastError = `pipeline 生成失敗: ${v.message}`),
              console.error('[filter] pipeline:', v.message));
          }),
          (p = y.getCompilationInfo) == null ||
            p.call(y).then((v) => {
              for (const m of v.messages)
                if (m.type === 'error') {
                  const F = `WGSL ${m.lineNum}:${m.linePos} ${m.message}`;
                  (this._filterLastError = F), console.error('[filter]', F);
                }
            }),
          this._filterPipelines.set(o, u);
      }
      const l = this._ensureFilterUniforms();
      h.queue.writeBuffer(l, 0, s.buffer, s.byteOffset, 128);
      const d = this._filterSampler,
        c = this._filterBindGroupLayout;
      if (!d || !c)
        return (this._filterLastError = 'sampler または bindGroupLayout が未初期化'), !1;
      const f = h.createBindGroup({
        layout: c,
        entries: [
          { binding: 0, resource: d },
          { binding: 1, resource: e.createView() },
          { binding: 2, resource: { buffer: l } },
        ],
      });
      h.pushErrorScope('validation');
      const _ = h.createCommandEncoder(),
        g = _.beginRenderPass({
          colorAttachments: [
            {
              view: i.createView(),
              clearValue: this.clearColor,
              loadOp: 'clear',
              storeOp: 'store',
            },
          ],
        });
      return (
        g.setPipeline(u),
        g.setBindGroup(0, f),
        g.draw(3, 1, 0, 0),
        g.end(),
        a && this._queueFilterProbe(_, i, e),
        h.queue.submit([_.finish()]),
        h.popErrorScope().then((y) => {
          y &&
            ((this._filterLastError = y.message), console.error('[filter] validation:', y.message));
        }),
        (this._filterLastError = ''),
        this._filterPasses++,
        !0
      );
    }
    _queueFilterProbe(t, e, i) {
      const s = this.device;
      if (!s || this._filterProbePending) return;
      this._filterProbeBuffer ||
        (this._filterProbeBuffer = s.createBuffer({
          size: 512,
          usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
        }));
      const r = this._filterProbeBuffer,
        a = Math.max(1, Math.floor(i.width / 2)),
        h = Math.max(1, Math.floor(i.height / 2));
      try {
        t.copyTextureToBuffer(
          { texture: e, origin: { x: a, y: h } },
          { buffer: r, bytesPerRow: 256, rowsPerImage: 1 },
          { width: 1, height: 1 },
        ),
          t.copyTextureToBuffer(
            { texture: i, origin: { x: a, y: h } },
            { buffer: r, bytesPerRow: 256, offset: 256 },
            { width: 1, height: 1 },
          );
      } catch {
        this._filterProbeValue = null;
        return;
      }
      (this._filterProbePending = !0),
        r
          .mapAsync(GPUMapMode.READ)
          .then(() => {
            const o = new Uint8Array(r.getMappedRange(0, 8)),
              u = [o[0] ?? -1, o[1] ?? -1, o[2] ?? -1, o[3] ?? -1],
              l = [o[4] ?? -1, o[5] ?? -1, o[6] ?? -1, o[7] ?? -1];
            (this._filterProbeValue = u), (this._filterProbeSrc = l), r.unmap();
          })
          .catch(() => {
            this._filterProbeValue = null;
          })
          .finally(() => {
            this._filterProbePending = !1;
          });
    }
    presentTarget(t) {
      const e = this.device;
      if (!e || !this.context) return !1;
      if (!this._blitPipeline) {
        const o = e.createShaderModule({ code: Jt });
        (this._blitPipeline = e.createRenderPipeline({
          layout: 'auto',
          vertex: { module: o, entryPoint: 'vs_main' },
          fragment: { module: o, entryPoint: 'fs_main', targets: [{ format: this._swapFormat() }] },
          primitive: { topology: 'triangle-list' },
        })),
          (this._blitSampler = e.createSampler({ magFilter: 'linear', minFilter: 'linear' }));
      }
      const i = this._blitPipeline,
        s = this._blitSampler;
      if (!i || !s) return !1;
      const r = e.createBindGroup({
          layout: i.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: s },
            { binding: 1, resource: t.createView() },
          ],
        }),
        a = e.createCommandEncoder(),
        h = a.beginRenderPass({
          colorAttachments: [
            {
              view: this.context.getCurrentTexture().createView(),
              clearValue: this.clearColor,
              loadOp: 'clear',
              storeOp: 'store',
            },
          ],
        });
      return (
        h.setPipeline(i),
        h.setBindGroup(0, r),
        h.draw(3, 1, 0, 0),
        h.end(),
        e.queue.submit([a.finish()]),
        !0
      );
    }
    getSceneTexture() {
      return this._sceneTexture;
    }
    getFilterScratchTexture() {
      return this._filterScratchTexture;
    }
    _ensureFilterUniforms() {
      if (this._filterUniformBuffer) return this._filterUniformBuffer;
      const t = this.device;
      if (!t) throw new Error('Device not initialized');
      return (
        (this._filterUniformBuffer = t.createBuffer({
          size: 128,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })),
        this._filterUniformBuffer
      );
    }
    _swapFormat() {
      return (
        this._swapFormatValue || (this._swapFormatValue = navigator.gpu.getPreferredCanvasFormat()),
        this._swapFormatValue
      );
    }
    filterStatus() {
      return {
        passes: this._filterPasses,
        lastError: this._filterLastError,
        targetWidth: this._sceneTargetSize[0],
        targetHeight: this._sceneTargetSize[1],
        swapWidth: this._swapSize[0],
        swapHeight: this._swapSize[1],
        probe: this._filterProbeValue,
        probeSrc: this._filterProbeSrc,
        sceneProbe: this._sceneProbeValue,
      };
    }
    computeCullingStatus() {
      var t;
      return {
        enabled: this._computeCullingEnabled,
        limitOk:
          (((t = this.limits) == null ? void 0 : t.maxStorageBuffersPerShaderStage) ?? 0) >= Et,
        hasParams: this._cullParams !== null,
        hasIndirect: this._cullIndirect !== null,
        hasPipeline: this._cullPipeline !== null,
        hasBindGroup: this._cullBindGroup !== null,
        bufferCount: Object.keys(this._boundBuffers).length,
        attempts: this._cullAttempts,
        lastFail: this._cullLastFail,
      };
    }
    beginComputeCulling(t, e) {
      const i = this.device,
        s = this._cullIndirect,
        r = this._cullParams,
        a = this._cullPipeline;
      if (((this._computeCullingDispatched = !1), this._cullAttempts++, !i || e <= 0))
        return (this._cullLastFail = i ? `instanceCount=${e}` : 'device が未初期化'), !1;
      if (!s || !r || !a) return (this._cullLastFail = 'params / indirect / pipeline が未用意'), !1;
      if (!this._ensureCullBindGroup())
        return (this._cullLastFail = '_ensureCullBindGroup が false を返した'), !1;
      const h = this._cullBindGroup;
      if (!h) return (this._cullLastFail = '_ensureCullBindGroup 後も bindGroup が null'), !1;
      i.queue.writeBuffer(s, 4, new Uint32Array([0]).buffer),
        this._cullRectBuf.set(t),
        this._cullParamsF32.set(t, 0),
        (this._cullParamsU32[4] = e),
        i.queue.writeBuffer(r, 0, this._cullParamsBuf),
        i.pushErrorScope('validation');
      const o = i.createCommandEncoder(),
        u = o.beginComputePass();
      return (
        u.setPipeline(a),
        u.setBindGroup(0, h),
        u.dispatchWorkgroups(Math.ceil(e / 64)),
        u.end(),
        i.queue.submit([o.finish()]),
        i.popErrorScope().then((l) => {
          l && console.warn('[computeCulling]', l.message);
        }),
        (this._computeCullingDispatched = !0),
        !0
      );
    }
    resolveVisibleCount() {
      const t = this.device,
        e = this._cullIndirect;
      if (!t || !e) return -1;
      this._visibleCountReadback ||
        (this._visibleCountReadback = t.createBuffer({
          size: 16,
          usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
        }));
      const i = this._visibleCountReadback;
      if (this._visibleCountMapping) return this._lastVisibleCount;
      const s = t.createCommandEncoder();
      return (
        s.copyBufferToBuffer(e, 4, i, 0, 4),
        t.queue.submit([s.finish()]),
        (this._visibleCountMapping = !0),
        i
          .mapAsync(GPUMapMode.READ)
          .then(() => {
            (this._lastVisibleCount = new Uint32Array(i.getMappedRange(0, 4))[0] ?? -1), i.unmap();
          })
          .catch(() => {
            this._lastVisibleCount = -1;
          })
          .finally(() => {
            this._visibleCountMapping = !1;
          }),
        this._lastVisibleCount
      );
    }
    _shouldUseIndirect() {
      return this._cullIndirect !== null && this._computeCullingDispatched;
    }
    _setupTimestampQuery() {
      const t = this.device;
      if (!(!t || !this._timestampSupported))
        try {
          (this._timestampQuerySet = t.createQuerySet({ type: 'timestamp', count: 2 })),
            (this._timestampResolve = t.createBuffer({
              size: 16,
              usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
            })),
            (this._timestampReadback = t.createBuffer({
              size: 16,
              usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
            }));
        } catch {
          (this._timestampSupported = !1),
            (this._timestampQuerySet = null),
            (this._timestampResolve = null),
            (this._timestampReadback = null);
        }
    }
    enableTimestampQuery() {
      this._timestampQueryEnabled = !0;
    }
    drawInstanced(t, e = 0) {
      if (!this.device || !this.context || !this.pipeline || !this.bindGroup || !this.quadBuffer)
        return;
      const i = this.device.createCommandEncoder(),
        s = this._sceneTarget ?? this.context.getCurrentTexture().createView(),
        r =
          this._timestampSupported &&
          this._timestampQuerySet !== null &&
          this._timestampResolve !== null &&
          !this._timestampMapping,
        a = {
          colorAttachments: [
            { view: s, clearValue: this.clearColor, loadOp: 'clear', storeOp: 'store' },
          ],
        };
      if (r) {
        const u = this._timestampQuerySet,
          l = this._timestampResolve;
        u &&
          l &&
          (a.timestampWrites = {
            querySet: u,
            beginningOfPassWriteIndex: 0,
            endOfPassWriteIndex: 1,
          });
      }
      const h = i.beginRenderPass(a);
      h.setPipeline(this.pipeline),
        h.setBindGroup(0, this.bindGroup),
        h.setVertexBuffer(0, this.quadBuffer);
      const o = this._shouldUseIndirect();
      for (let u = 0; u < I.length; u++) {
        const l = I[u];
        if (!l.eager) continue;
        const d = this._boundBuffers[l.name];
        if (!d) continue;
        const c = o ? (this._cullOutBuffers[l.name] ?? d.buffer) : d.buffer;
        h.setVertexBuffer(l.slot, c, e * l.stride);
      }
      if (o) {
        const u = this._cullIndirect;
        u ? h.drawIndirect(u, 0) : h.draw(4, t, 0, 0);
      } else h.draw(4, t, 0, 0);
      if ((h.end(), r)) {
        const u = this._timestampQuerySet,
          l = this._timestampResolve,
          d = this._timestampReadback;
        u &&
          l &&
          d &&
          (i.resolveQuerySet(u, 0, 2, l, 0),
          i.copyBufferToBuffer(l, 0, d, 0, 16),
          (this._timestampPendingMap = !0));
      }
      this.device.queue.submit([i.finish()]);
    }
    resolveGpuTimeMs() {
      const t = this.device,
        e = this._timestampReadback;
      return !t || !e || !this._timestampSupported
        ? -1
        : (this._timestampPendingMap &&
            !this._timestampMapping &&
            ((this._timestampPendingMap = !1),
            (this._timestampMapping = !0),
            e
              .mapAsync(GPUMapMode.READ)
              .then(() => {
                const i = e.getMappedRange(),
                  s = new BigUint64Array(i, 0, 2),
                  r = Number(s[0]),
                  a = Number(s[1]);
                e.unmap(),
                  (this._lastGpuMs = a > r ? (a - r) / 1e6 : -1),
                  (this._timestampRaw0 = r),
                  (this._timestampRaw1 = a);
              })
              .catch((i) => {
                (this._timestampError = i instanceof Error ? i.message : String(i)),
                  (this._lastGpuMs = -1);
              })
              .finally(() => {
                this._timestampMapping = !1;
              })),
          this._lastGpuMs);
    }
    isTimestampQuerySupported() {
      return this._timestampSupported;
    }
    setUniformMatrix4fv(t, e) {
      !this.device ||
        !this.uniformBuffer ||
        this.device.queue.writeBuffer(this.uniformBuffer, 0, e.buffer, e.byteOffset, 64);
    }
    setCullRect(t, e) {
      const i = this.device;
      if (!i || !this.uniformBuffer) return;
      const s = new Float32Array([e ? 1 : 0]);
      i.queue.writeBuffer(this.uniformBuffer, 76, s.buffer, 0, 4),
        i.queue.writeBuffer(this.uniformBuffer, 80, t.buffer, t.byteOffset, 16);
    }
    createPipeline(t, e) {
      if (!this.device) throw new Error('Device not initialized');
      const i = this.device.createShaderModule({
        code: `${t}
${e}`,
      });
      return {
        id: this.device.createRenderPipeline({
          layout: 'auto',
          vertex: { module: i, entryPoint: 'vs_main' },
          fragment: {
            module: i,
            entryPoint: 'fs_main',
            targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
          },
          primitive: { topology: 'triangle-strip' },
        }),
      };
    }
    bindPipeline(t) {
      this.pipeline = t.id;
    }
    destroy() {
      this.device && (this.device.destroy(), (this.device = null)),
        this.textures.clear(),
        (this._boundBuffers = {});
    }
    lastTimestampError() {
      return this._timestampError;
    }
    lastTimestampRaw(t) {
      return this._timestampRaw0 < 0
        ? !1
        : ((t[0] = this._timestampRaw0), (t[1] = this._timestampRaw1), !0);
    }
  },
  se = `#version 300 es
precision highp float;

layout(location = ${L.Pos}) in vec2 vertexPos;
layout(location = ${L.Uv}) in vec2 vertexUV;
${$t()}

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
`,
  re = `#version 300 es
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
`,
  $ = 3,
  Tt = class {
    constructor() {
      n(this, 'gl', null);
      n(this, 'currentPipeline', null);
      n(this, 'spritePipeline', null);
      n(this, 'vao', null);
      n(this, 'uniforms', {
        projectionMatrix: null,
        textureArray: null,
        sdfThreshold: null,
        sdfSmoothing: null,
        cullRect: null,
        gpuCull: null,
      });
      n(this, 'quadBuffer', null);
      n(this, 'textureArray', null);
      n(this, 'textureWidth', 1024);
      n(this, 'textureHeight', 1024);
      n(this, 'maxLayers', 64);
      n(this, 'currentLayerCount', 1);
      n(this, 'contextLost', !1);
      n(this, 'textures', new Map());
      n(this, '_boundBuffers', {});
      n(this, 'vaoDirty', !0);
      n(this, 'vaoBaseInstance', 0);
      n(this, '_flipRow', null);
      n(this, '_tsqEnabled', !1);
      n(this, '_tsqSupported', !1);
      n(this, '_tsqExt', null);
      n(this, '_tsqQueries', new Array($).fill(null));
      n(this, '_tsqPending', new Array($).fill(!1));
      n(this, '_tsqReusable', []);
      n(this, '_tsqNext', 0);
      n(this, '_tsqActive', -1);
      n(this, '_lastGpuMs', -1);
      n(this, '_tsqError', '');
    }
    async init(t) {
      const e = typeof location < 'u' ? new URLSearchParams(location.search) : null,
        i = { preserveDrawingBuffer: (e == null ? void 0 : e.has('preserveDrawingBuffer')) ?? !1 },
        s = e == null ? void 0 : e.get('textureSize');
      if (s != null) {
        const a = Number.parseInt(s, 10);
        Number.isFinite(a) && a >= 64 && a <= 4096
          ? ((this.textureWidth = a), (this.textureHeight = a))
          : console.warn(
              `[WebGL2Device] ?textureSize=${s} は 64〜4096 の整数でありません。既定値 ${this.textureWidth} を使います。`,
            );
      }
      const r = t.getContext('webgl2', i) || t.getContext('experimental-webgl2', i);
      if (!r) throw new Error('WebGL2 is not supported');
      (this.gl = r),
        this._setupTimestampQuery(),
        t.addEventListener('webglcontextlost', (a) => {
          a.preventDefault(),
            (this.contextLost = !0),
            console.error(
              '[WebGL2Device] WebGL context lost. The texture array is allocated in one shot, so a 1 GB shortfall will kill the context. Check the GPU memory budget.',
            );
        }),
        t.addEventListener('webglcontextrestored', () => {
          (this.contextLost = !1),
            console.warn('[WebGL2Device] WebGL context restored. Rebuilding the texture array.'),
            (this.currentLayerCount = 1),
            this.textures.clear(),
            (this.vaoDirty = !0),
            this.initTextureArray();
        }),
        this.gl.enable(this.gl.BLEND),
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA),
        this.initTextureArray();
    }
    isContextLost() {
      return this.contextLost;
    }
    allocateTextureArray() {
      if (!this.gl) return !1;
      for (; this.gl.getError() !== this.gl.NO_ERROR; );
      if (
        (this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.textureArray),
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
        ),
        this.gl.isContextLost())
      )
        return (this.contextLost = !0), !1;
      const e = (
        (this.textureWidth * this.textureHeight * 4 * this.maxLayers) /
        1024 /
        1024
      ).toFixed(0);
      return (
        console.log(
          `[WebGL2Device] texture array allocated: ${this.textureWidth}x${this.textureHeight} x ${this.maxLayers} layers (= ${e} MB)`,
        ),
        !0
      );
    }
    initTextureArray() {
      if (!this.gl) return;
      if (
        ((this.textureArray = this.gl.createTexture()),
        this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.textureArray),
        this.gl.texParameteri(
          this.gl.TEXTURE_2D_ARRAY,
          this.gl.TEXTURE_MIN_FILTER,
          this.gl.NEAREST,
        ),
        this.gl.texParameteri(
          this.gl.TEXTURE_2D_ARRAY,
          this.gl.TEXTURE_MAG_FILTER,
          this.gl.NEAREST,
        ),
        this.gl.texParameteri(
          this.gl.TEXTURE_2D_ARRAY,
          this.gl.TEXTURE_WRAP_S,
          this.gl.CLAMP_TO_EDGE,
        ),
        this.gl.texParameteri(
          this.gl.TEXTURE_2D_ARRAY,
          this.gl.TEXTURE_WRAP_T,
          this.gl.CLAMP_TO_EDGE,
        ),
        !this.allocateTextureArray())
      )
        throw new Error(
          `Failed to allocate the texture array: ${this.maxLayers} layers could not be allocated (contextLost=${this.contextLost}). GPU memory is insufficient. Reduce the texture array size or layer count.`,
        );
      const t = new Uint8Array([255, 255, 255, 255]);
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
        t,
      ),
        this.textures.set('__default_white__', {
          key: '__default_white__',
          layerIndex: 0,
          width: 1,
          height: 1,
          frames: [{ uvX: 0, uvY: 0, uvW: 1 / this.textureWidth, uvH: 1 / this.textureHeight }],
        });
    }
    uploadTexture(t, e, i) {
      if (!this.gl || !this.textureArray)
        throw new Error('Device or texture array not initialized');
      if (this.textures.has(t)) return this.textures.get(t);
      if (this.currentLayerCount >= this.maxLayers)
        return (
          console.warn(
            `TextureArray layer limit reached (${this.maxLayers}). Reusing existing layer.`,
          ),
          this.textures.get('__default_white__')
        );
      const s = this.currentLayerCount++,
        r = e.width,
        a = e.height;
      this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.textureArray),
        this.gl.texSubImage3D(
          this.gl.TEXTURE_2D_ARRAY,
          0,
          0,
          0,
          s,
          r,
          a,
          1,
          this.gl.RGBA,
          this.gl.UNSIGNED_BYTE,
          e,
        );
      const h = [],
        o = i == null ? void 0 : i.frames;
      if (o !== void 0 && o.length > 0)
        for (let l = 0; l < o.length; l++) {
          const d = o[l];
          h.push({
            uvX: d.x / this.textureWidth,
            uvY: d.y / this.textureHeight,
            uvW: d.w / this.textureWidth,
            uvH: d.h / this.textureHeight,
          });
        }
      else {
        const l = (i == null ? void 0 : i.frameWidth) || r,
          d = (i == null ? void 0 : i.frameHeight) || a,
          c = Math.max(1, Math.floor(r / l)),
          f = Math.max(1, Math.floor(a / d));
        for (let _ = 0; _ < f; _++)
          for (let g = 0; g < c; g++)
            h.push({
              uvX: (g * l) / this.textureWidth,
              uvY: (_ * d) / this.textureHeight,
              uvW: l / this.textureWidth,
              uvH: d / this.textureHeight,
            });
      }
      const u = {
        key: t,
        layerIndex: s,
        width: r,
        height: a,
        frameWidth: (i == null ? void 0 : i.frameWidth) || r,
        frameHeight: (i == null ? void 0 : i.frameHeight) || a,
        frames: h,
      };
      return this.textures.set(t, u), u;
    }
    getTexture(t) {
      return this.textures.get(t);
    }
    initPipelines() {
      (this.spritePipeline = this.createPipeline(se, re)),
        this.createQuadBuffer(),
        this.cacheUniformLocations();
    }
    createQuadBuffer() {
      if (!this.gl) return;
      const t = new Float32Array([
        -0.5, -0.5, 0, 0, 0.5, -0.5, 1, 0, -0.5, 0.5, 0, 1, 0.5, 0.5, 1, 1,
      ]);
      (this.quadBuffer = this.gl.createBuffer()),
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer),
        this.gl.bufferData(this.gl.ARRAY_BUFFER, t, this.gl.STATIC_DRAW),
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }
    cacheUniformLocations() {
      if (!this.gl || !this.spritePipeline) return;
      const t = this.spritePipeline.id;
      (this.uniforms.projectionMatrix = this.gl.getUniformLocation(t, 'projectionMatrix')),
        (this.uniforms.cullRect = this.gl.getUniformLocation(t, 'uCullRect')),
        (this.uniforms.gpuCull = this.gl.getUniformLocation(t, 'uGpuCull')),
        (this.uniforms.textureArray = this.gl.getUniformLocation(t, 'textureArray')),
        (this.uniforms.sdfThreshold = this.gl.getUniformLocation(t, 'sdfThreshold')),
        (this.uniforms.sdfSmoothing = this.gl.getUniformLocation(t, 'sdfSmoothing'));
    }
    createBuffer(t) {
      if (!this.gl) throw new Error('Device not initialized');
      const e = this.gl.createBuffer();
      if (!e) throw new Error('Failed to create WebGL2 buffer');
      return (
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e),
        this.gl.bufferData(this.gl.ARRAY_BUFFER, t, this.gl.DYNAMIC_DRAW),
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null),
        (this.vaoDirty = !0),
        { buffer: e, size: t }
      );
    }
    updateBuffer(t, e, i = 0, s) {
      if (!this.gl) throw new Error('Device not initialized');
      const r = t.buffer;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, r),
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, e, i, s ?? e.length - i),
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }
    clear(t, e, i, s) {
      this.gl &&
        (this.contextLost ||
          (this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height),
          this.gl.clearColor(t, e, i, s),
          this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)));
    }
    bindShaders(t = 0.5, e = 0.08) {
      this.spritePipeline &&
        this.gl &&
        (this.bindPipeline(this.spritePipeline),
        this.gl.activeTexture(this.gl.TEXTURE0),
        this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.textureArray),
        this.uniforms.textureArray !== null && this.gl.uniform1i(this.uniforms.textureArray, 0),
        this.uniforms.sdfThreshold !== null && this.gl.uniform1f(this.uniforms.sdfThreshold, t),
        this.uniforms.sdfSmoothing !== null && this.gl.uniform1f(this.uniforms.sdfSmoothing, e));
    }
    setCullRect(t, e) {
      const i = this.gl;
      if (!i || !this.currentPipeline) return;
      const s = this.uniforms.cullRect,
        r = this.uniforms.gpuCull;
      s && i.uniform4f(s, t[0], t[1], t[2], t[3]), r && i.uniform1f(r, e ? 1 : 0);
    }
    setupInstancedAttributes(t, e, i = 0) {
      !this.gl ||
        !this.spritePipeline ||
        (this._boundBuffers !== t && ((this._boundBuffers = t), (this.vaoDirty = !0)),
        (this.vaoDirty || this.vaoBaseInstance !== i) &&
          (this.applyVertexAttribs(i), (this.vaoBaseInstance = i)),
        this.gl.bindVertexArray(this.vao));
    }
    applyVertexAttribs(t) {
      const e = this.gl;
      if (!e || !this.quadBuffer) return;
      const i = e.createVertexArray();
      if (!i) throw new Error('Failed to create WebGL2 vertex array object');
      e.bindVertexArray(i),
        e.bindBuffer(e.ARRAY_BUFFER, this.quadBuffer),
        e.enableVertexAttribArray(L.Pos),
        e.vertexAttribPointer(L.Pos, 2, e.FLOAT, !1, yt, 0),
        e.enableVertexAttribArray(L.Uv),
        e.vertexAttribPointer(L.Uv, 2, e.FLOAT, !1, yt, 8);
      for (let s = 0; s < I.length; s++) {
        const r = I[s];
        if (!r.eager) continue;
        const a = this._boundBuffers[r.name];
        if (!a) continue;
        const h = a.buffer,
          o = t * r.stride;
        e.bindBuffer(e.ARRAY_BUFFER, h);
        for (let u = 0; u < r.vectors; u++) {
          const l = r.location + u,
            d = o + u * (r.format === 'unorm8x4' ? 4 : 16);
          e.enableVertexAttribArray(l),
            r.format === 'unorm8x4'
              ? e.vertexAttribPointer(l, 4, e.UNSIGNED_BYTE, !0, r.stride, d)
              : e.vertexAttribPointer(l, 4, e.FLOAT, !1, r.stride, d),
            e.vertexAttribDivisor(l, 1);
        }
      }
      e.bindVertexArray(null),
        e.bindBuffer(e.ARRAY_BUFFER, null),
        this.vao !== null && this.vao !== i && e.deleteVertexArray(this.vao),
        (this.vao = i),
        (this.vaoDirty = !1);
    }
    compileShader(t, e) {
      if (!this.gl) throw new Error('Device not initialized');
      const i = this.gl.createShader(t);
      if (!i) throw new Error('Failed to create shader');
      if (
        (this.gl.shaderSource(i, e),
        this.gl.compileShader(i),
        !this.gl.getShaderParameter(i, this.gl.COMPILE_STATUS))
      ) {
        const s = this.gl.getShaderInfoLog(i);
        throw (this.gl.deleteShader(i), new Error(`Shader compile error: ${s}`));
      }
      return i;
    }
    createPipeline(t, e) {
      if (!this.gl) throw new Error('Device not initialized');
      const i = this.compileShader(this.gl.VERTEX_SHADER, t),
        s = this.compileShader(this.gl.FRAGMENT_SHADER, e),
        r = this.gl.createProgram();
      if (!r) throw new Error('Failed to create program');
      if (
        (this.gl.attachShader(r, i),
        this.gl.attachShader(r, s),
        this.gl.linkProgram(r),
        !this.gl.getProgramParameter(r, this.gl.LINK_STATUS))
      ) {
        const a = this.gl.getProgramInfoLog(r);
        throw (this.gl.deleteProgram(r), new Error(`Program link error: ${a}`));
      }
      return (
        this.gl.deleteShader(i),
        this.gl.deleteShader(s),
        (this.vaoDirty = !0),
        (this.uniforms.projectionMatrix = null),
        (this.uniforms.cullRect = null),
        (this.uniforms.gpuCull = null),
        (this.uniforms.textureArray = null),
        (this.uniforms.sdfThreshold = null),
        (this.uniforms.sdfSmoothing = null),
        { id: r }
      );
    }
    bindPipeline(t) {
      this.gl && ((this.currentPipeline = t.id), this.gl.useProgram(this.currentPipeline));
    }
    setUniformMatrix4fv(t, e) {
      if (!this.gl || !this.currentPipeline || t !== 'projectionMatrix') return;
      const i = this.uniforms.projectionMatrix;
      i !== null && this.gl.uniformMatrix4fv(i, !1, e);
    }
    readPixels(t, e, i) {
      const s = this.gl;
      if (!s || this.contextLost) return !1;
      const r = e ?? s.drawingBufferWidth,
        a = i ?? s.drawingBufferHeight,
        h = r * a * 4;
      if (t.length < h) return !1;
      s.readPixels(0, 0, r, a, s.RGBA, s.UNSIGNED_BYTE, t),
        (this._flipRow === null || this._flipRow.length < r * 4) &&
          (this._flipRow = new Uint8Array(r * 4));
      const o = r * 4,
        u = this._flipRow;
      for (let l = 0; l < a >> 1; l++) {
        const d = l * o,
          c = (a - 1 - l) * o;
        for (let f = 0; f < o; f++) u[f] = t[d + f];
        for (let f = 0; f < o; f++) t[d + f] = t[c + f];
        for (let f = 0; f < o; f++) t[c + f] = u[f];
      }
      return !0;
    }
    drawInstanced(t, e = 0) {
      if (!this.gl || this.contextLost || this.vao === null) return;
      const i = this._beginGpuTimer();
      this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, 0, 4, t), this._endGpuTimer(i);
    }
    isTimestampQuerySupported() {
      return this._tsqSupported;
    }
    lastTimestampError() {
      return this._tsqError;
    }
    resolveGpuTimeMs() {
      const t = this.gl;
      if (!t || !this._tsqSupported || this._tsqError) return -1;
      const e = this._tsqExt;
      if (!e) return -1;
      let i = !1;
      for (let s = 0; s < $; s++) {
        const r = (this._tsqNext + s) % $,
          a = this._tsqQueries[r];
        if (!a || this._tsqPending[r] !== !0 || !t.getQueryParameter(a, t.QUERY_RESULT_AVAILABLE))
          continue;
        if (t.getParameter(e.GPU_DISJOINT_EXT)) {
          this._tsqPending[r] = !1;
          continue;
        }
        const u = t.getQueryParameter(a, t.QUERY_RESULT);
        (this._tsqPending[r] = !1),
          i || ((this._lastGpuMs = u / 1e6), (i = !0)),
          this._tsqReusable.push(r);
      }
      return this._lastGpuMs;
    }
    _beginGpuTimer() {
      const t = this.gl;
      if (!t || !this._tsqSupported || this.contextLost) return null;
      const e = this._tsqReusable.pop();
      if (e === void 0) return null;
      const i = this._tsqQueries[e];
      return i
        ? (t.beginQuery(this._tsqExt.TIME_ELAPSED_EXT, i),
          (this._tsqPending[e] = !0),
          (this._tsqActive = e),
          i)
        : null;
    }
    _endGpuTimer(t) {
      const e = this.gl;
      if (!e || !t || this._tsqActive === -1) return;
      e.endQuery(this._tsqExt.TIME_ELAPSED_EXT),
        (this._tsqNext = (this._tsqActive + 1) % $),
        (this._tsqActive = -1);
    }
    enableTimestampQuery() {
      this._tsqEnabled = !0;
    }
    _setupTimestampQuery() {
      const t = this.gl;
      if (!t || !this._tsqEnabled) {
        this._tsqSupported = !1;
        return;
      }
      const e = t.getExtension('EXT_disjoint_timer_query_webgl2');
      if (!e) {
        (this._tsqSupported = !1),
          (this._tsqError = 'EXT_disjoint_timer_query_webgl2 がありません');
        return;
      }
      this._tsqExt = e;
      for (let i = 0; i < $; i++)
        (this._tsqQueries[i] = t.createQuery()), this._tsqReusable.push(i);
      this._tsqSupported = !0;
    }
    destroy() {
      if (this.gl) {
        this.vao && (this.gl.deleteVertexArray(this.vao), (this.vao = null));
        const t = this.gl.getExtension('WEBGL_lose_context');
        t && t.loseContext(),
          (this.gl = null),
          (this.currentPipeline = null),
          (this.spritePipeline = null),
          (this.quadBuffer = null),
          (this.textureArray = null);
      }
    }
  },
  ne = class {
    constructor() {
      n(this, '_internal', []);
      n(this, '_external', []);
      n(this, '_flipped', !1);
      n(this, '_lastWidth', 0);
      n(this, '_lastHeight', 0);
      n(this, '_probeOnce', !0);
      n(this, '_probeSceneOnce', !0);
      n(this, '_sceneDrawCalls', 0);
    }
    setFilters(t, e = []) {
      (this._internal = t),
        (this._external = e),
        this._notifyViewport(this._lastWidth, this._lastHeight);
    }
    get hasFilters() {
      return this._internal.length > 0 || this._external.length > 0;
    }
    effectiveFilters(t) {
      const e = t,
        i = typeof e.isFilterSupported == 'function' && e.isFilterSupported(),
        s = this._internal.concat(this._external);
      return i ? s.filter((r) => !r.webgpuOnly || i) : [];
    }
    render(t, e, i, s) {
      var o, u, l, d, c, f, _;
      const r = s;
      if (
        typeof r.beginSceneToTarget != 'function' ||
        typeof r.runFilterPass != 'function' ||
        typeof r.presentTarget != 'function'
      )
        return t(), !1;
      this._sceneDrawCalls = 0;
      const a = this.effectiveFilters(s);
      if (a.length === 0 || (this._notifyViewport(e, i), r.beginSceneToTarget(e, i) !== !0))
        return t(), !1;
      this._sceneDrawCalls++,
        t(),
        this._probeSceneOnce &&
          ((this._probeSceneOnce = !1), (o = r.probeSceneTarget) == null || o.call(r)),
        (this._flipped = !1);
      for (let g = 0; g < a.length; g++) {
        const p = a[g];
        for (let y = 0; y < p.passCount; y++) {
          const v = this._flipped
              ? (u = r.getFilterScratchTexture) == null
                ? void 0
                : u.call(r)
              : (l = r.getSceneTexture) == null
                ? void 0
                : l.call(r),
            m = this._flipped
              ? (d = r.getSceneTexture) == null
                ? void 0
                : d.call(r)
              : (c = r.getFilterScratchTexture) == null
                ? void 0
                : c.call(r);
          if (!v || !m) return !1;
          p.passSamplesSource(y) &&
            (r.runFilterPass(p.wgsl(y), v, m, p.uniform(y), this._probeOnce),
            (this._probeOnce = !1)),
            (this._flipped = !this._flipped);
        }
      }
      const h = this._flipped
        ? (f = r.getFilterScratchTexture) == null
          ? void 0
          : f.call(r)
        : (_ = r.getSceneTexture) == null
          ? void 0
          : _.call(r);
      return h ? r.presentTarget(h) === !0 : !1;
    }
    _notifyViewport(t, e) {
      var s;
      if (t === this._lastWidth && e === this._lastHeight) return;
      (this._lastWidth = t), (this._lastHeight = e);
      const i = this._internal.concat(this._external);
      for (let r = 0; r < i.length; r++) {
        const a = i[r];
        (s = a.setViewportSize) == null || s.call(a, t, e);
      }
    }
    sceneDrawCalls() {
      return this._sceneDrawCalls;
    }
  },
  ae = `
struct VsOut {
  @builtin(position) pos : vec4<f32>,
  @location(0) uv : vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vi : u32) -> VsOut {
  // 三角形 1 枚で全画面を覆います（対角線の隙間を避けるため quad を使いません）
  var p = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0),
  );
  var o : VsOut;
  let xy : vec2<f32> = p[vi];
  o.pos = vec4<f32>(xy, 0.0, 1.0);
  // WebGPU の NDC は Y 上向き、テクスチャ座標は Y 下向きなので反転します
  o.uv = vec2<f32>(xy.x * 0.5 + 0.5, 0.5 - xy.y * 0.5);
  return o;
}
`;
function q(t) {
  return `${ae}
@group(0) @binding(0) var samp : sampler;
@group(0) @binding(1) var srcTex : texture_2d<f32>;

struct FilterUniforms {
  // 各 vec4 はフィルタごとに自由に解釈します
  params : array<vec4<f32>, 8>,
};
@group(0) @binding(2) var<uniform> u : FilterUniforms;

@fragment
fn fs_main(in : VsOut) -> @location(0) vec4<f32> {
  ${t}
}
`;
}
var Ft = class {
    constructor(t, e, i, s) {
      n(this, 'key');
      n(this, 'name');
      n(this, 'webgpuOnly');
      n(this, '_wgsl');
      n(this, 'passCount', 1);
      n(this, '_uniforms', new Float32Array(32));
      (this.key = t), (this.name = e), (this.webgpuOnly = i), (this._wgsl = s);
    }
    uniform(t) {
      return this._uniforms;
    }
    wgsl(t) {
      return this._wgsl;
    }
    passSamplesSource(t) {
      return !0;
    }
  },
  ot = new Float32Array([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]);
function he() {
  const t = new Ft(
      'ColorMatrix',
      'ColorMatrix',
      !1,
      q(`
  let c = textureSampleLevel(srcTex, samp, in.uv, 0.0);
  let m = u.params[0];
  let m2 = u.params[1];
  let m3 = u.params[2];
  let m4 = u.params[3];
  return vec4<f32>(
    c.x * m.x + c.y * m.z + c.z * m.w + m.y,
    c.x * m2.x + c.y * m2.z + c.z * m2.w + m2.y,
    c.x * m3.x + c.y * m3.z + c.z * m3.w + m3.y,
    c.x * m4.x + c.y * m4.z + c.z * m4.w + m4.y,
  );
`),
    ),
    e = t;
  return (
    (e.setMatrix = (i) => {
      const s = t.uniform(0);
      for (let r = 0; r < 20; r++) s[r] = i[r] ?? ot[r];
    }),
    (e.reset = () => {
      e.setMatrix(ot);
    }),
    (e.setBrightness = (i) => {
      const s = t.uniform(0);
      e.setMatrix(ot), (s[1] = i), (s[6] = i), (s[11] = i);
    }),
    (e.setSaturation = (i) => {
      const h = 1 - i;
      e.setMatrix([
        0.2126 * i + h,
        0.7152 * i,
        0.0722 * i,
        0,
        0,
        0.2126 * i,
        0.7152 * i + h,
        0.0722 * i,
        0,
        0,
        0.2126 * i,
        0.7152 * i,
        0.0722 * i + h,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
      ]);
    }),
    (e.setHue = (i) => {
      const s = (i - 0.5) * Math.PI,
        r = Math.cos(s),
        a = Math.sin(s),
        h = 0.2126,
        o = 0.7152,
        u = 0.0722,
        l = [
          h + r * (1 - h) + a * -h,
          o + r * -o + a * -o,
          u + r * -u + a * (1 - u),
          0,
          0,
          h + r * -h + a * 0.143,
          o + r * (1 - o) + a * 0.14,
          u + r * -u + a * -0.283,
          0,
          0,
          h + r * -h + a * -0.7874,
          o + r * -o + a * o,
          u + r * (1 - u) + a * -u,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
        ];
      e.setMatrix(l);
    }),
    (e.setGrayscale = (i) => {
      t.uniform(0);
      const s = 0.2126,
        r = 0.7152,
        a = 0.0722;
      e.setMatrix([
        s * i + (1 - i),
        r * i,
        a * i,
        0,
        0,
        s * i,
        r * i + (1 - i),
        a * i,
        0,
        0,
        s * i,
        r * i,
        a * i + (1 - i),
        0,
        0,
        0,
        0,
        0,
        1,
        0,
      ]);
    }),
    (e.setSepia = (i) => {
      const s = 1 - i;
      e.setMatrix([
        0.393 + 0.607 * s,
        0.769 - 0.769 * s,
        0.189 - 0.189 * s,
        0,
        0,
        0.349 - 0.349 * s,
        0.686 + 0.314 * s,
        0.168 - 0.168 * s,
        0,
        0,
        0.272 - 0.272 * s,
        0.534 - 0.534 * s,
        0.131 + 0.869 * s,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
      ]);
    }),
    (e.setInvert = (i) => {
      const s = 1 - 2 * i;
      e.setMatrix([s, 0, 0, 0, 0, 0, s, 0, 0, 0, 0, 0, s, 0, 0, 0, 0, 0, 1, 0]);
    }),
    (e.setAlpha = (i) => {
      e.reset(), (t.uniform(0)[18] = i);
    }),
    e.reset(),
    e
  );
}
function oe() {
  const t = new Ft(
    'Pixelate',
    'Pixelate',
    !1,
    q(`
  // params.x = ブロック辺長(px), params.zw = 1/幅, 1/高さ
  let block = max(u.params[0].x, 1.0);
  let step = block * u.params[0].zw;
  // 格子の中心へ丸めます（ブロックの角ではなく中心をサンプルする）
  let snapped = (floor(in.uv / step) + 0.5) * step;
  return textureSampleLevel(srcTex, samp, snapped, 0.0);
`),
  );
  let e = 4;
  return (
    Object.defineProperty(t, 'blockSize', { get: () => e, enumerable: !0 }),
    (t.setBlockSize = (i) => {
      e = Math.max(1, i);
      const s = t.uniform(0);
      s[0] = e;
    }),
    t.setBlockSize(4),
    t
  );
}
function ue() {
  const t = new Ft(
    'Vignette',
    'Vignette',
    !1,
    q(`
  // params.x = radius, params.y = strength, params.z = 1(角丸) / 0(円形)
  let d = in.uv - vec2<f32>(0.5, 0.5);
  if (u.params[0].z > 0.5) {
    // 角丸: 正方形から中心への距離を使います
    let a = abs(d) * 2.0;
    d = vec2<f32>(max(a.x, a.y), max(a.x, a.y));
  }
  let dist = length(d);
  let r = u.params[0].x;
  let s = u.params[0].y;
  let k = clamp((dist - r) / max(1.0 - r, 1e-4), 0.0, 1.0);
  let c = textureSampleLevel(srcTex, samp, in.uv, 0.0);
  return vec4<f32>(c.rgb * (1.0 - k * s), c.a);
`),
  );
  return (
    (t.setRadius = (e) => {
      t.uniform(0)[0] = Math.min(1, Math.max(0, e));
    }),
    (t.setStrength = (e) => {
      t.uniform(0)[1] = Math.min(1, Math.max(0, e));
    }),
    (t.setRounded = (e) => {
      t.uniform(0)[2] = e ? 1 : 0;
    }),
    t.setRadius(0.5),
    t.setStrength(1),
    t.setRounded(!1),
    t
  );
}
var Pt = 9;
function le() {
  const t = [new Float32Array(32), new Float32Array(32)];
  let e = 4,
    i = 1,
    s = 1;
  function r() {
    const o = Math.max(1e-4, e / 2),
      u = (Pt - 1) >> 1;
    for (let l = 0; l < 2; l++) {
      const d = t[l];
      (d[0] = l === 0 ? 1 / i : 0), (d[1] = l === 0 ? 0 : 1 / s), (d[2] = e);
      for (let c = 0; c < Pt; c++) {
        const f = c - u;
        d[4 + c] = Math.exp(-(f * f) / (2 * o * o));
      }
    }
  }
  const a = q(`
  // params.xy = ステップ(px), params.z = radius(px), params.w = 未使用
  // params[1..3] = 9 タップの重み（w0..w8）
  let step = u.params[0].xy;
  var c = textureSampleLevel(srcTex, samp, in.uv, 0.0) * u.params[1].x;
  c += (textureSampleLevel(srcTex, samp, in.uv + step, 0.0)
      + textureSampleLevel(srcTex, samp, in.uv - step, 0.0)) * u.params[1].y;
  c += (textureSampleLevel(srcTex, samp, in.uv + step * 2.0, 0.0)
      + textureSampleLevel(srcTex, samp, in.uv - step * 2.0, 0.0)) * u.params[1].z;
  c += (textureSampleLevel(srcTex, samp, in.uv + step * 3.0, 0.0)
      + textureSampleLevel(srcTex, samp, in.uv - step * 3.0, 0.0)) * u.params[1].w;
  c += (textureSampleLevel(srcTex, samp, in.uv + step * 4.0, 0.0)
      + textureSampleLevel(srcTex, samp, in.uv - step * 4.0, 0.0)) * u.params[2].x;
  return c;
`),
    h = {
      key: 'Blur',
      name: 'Blur',
      passCount: 2,
      webgpuOnly: !1,
      uniform: (o) => t[o] ?? t[0],
      wgsl: () => a,
      passSamplesSource: () => !0,
      setStrength: (o) => {
        (e = Math.max(0, o)), r();
      },
      get strength() {
        return e;
      },
      setViewportSize: (o, u) => {
        (o === i && u === s) || ((i = o), (s = u), r());
      },
    };
  return r(), h;
}
var Si = { internal: { colorMatrix: he, pixelate: oe, vignette: ue, blur: le } },
  At = class {
    constructor(t, e, i) {
      n(this, 'key');
      n(this, 'name');
      n(this, '_wgsl');
      n(this, 'passCount', 1);
      n(this, '_uniforms', new Float32Array(32));
      n(this, 'webgpuOnly', !0);
      (this.key = t), (this.name = e), (this._wgsl = i);
    }
    uniform(t) {
      return this._uniforms;
    }
    wgsl(t) {
      return this._wgsl;
    }
    passSamplesSource(t) {
      return !0;
    }
  };
function ce() {
  const t = new At(
    'Displacement',
    'Displacement',
    q(`
  // params.xy = strength, params.z = 参照マップのテクセル数
  // マップは binding 3 以降にbind される想定です。
  // 現状は scale のみで maps は未実装のためidentity のままです。
  return textureSampleLevel(srcTex, samp, in.uv, 0.0);
`),
  );
  let e = 0,
    i = '';
  return (
    Object.defineProperty(t, 'mapKey', { get: () => i, enumerable: !0 }),
    (t.setStrength = (s) => {
      (e = Math.max(0, s)), (t.uniform(0)[0] = e);
    }),
    (t.setMap = (s) => {
      i = s;
    }),
    t.setStrength(0),
    t
  );
}
function de() {
  const t = new At(
    'Threshold',
    'Threshold',
    q(`
  // params.x = level, params.yzw = 二値化したときの色
  let c = textureSampleLevel(srcTex, samp, in.uv, 0.0);
  let lum = dot(c.rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
  if (lum < u.params[0].x) {
    return vec4<f32>(u.params[0].yzw, c.a);
  }
  return c;
`),
  );
  return (
    (t.setLevel = (e) => {
      t.uniform(0)[0] = e;
    }),
    (t.setColor = (e, i, s) => {
      const r = t.uniform(0);
      (r[1] = e), (r[2] = i), (r[3] = s);
    }),
    t.setLevel(0.5),
    t.setColor(0, 0, 0),
    t
  );
}
function fe() {
  const t = new At(
    'Wipe',
    'Wipe',
    q(`
  // params.x = progress, params.y = direction(ラジアン)
  let dir = vec2<f32>(cos(u.params[0].y), sin(u.params[0].y));
  // 進行方向に沿った正規化座標で progress と比較します
  let t = dot(in.uv - vec2<f32>(0.5, 0.5), dir) + 0.7071;
  if (t < u.params[0].x) {
    return textureSampleLevel(srcTex, samp, in.uv, 0.0);
  }
  // 右側は無視（現状は黒）。別の texture を混ぜる指定は未実装です
  return vec4<f32>(0.0, 0.0, 0.0, 1.0);
`),
  );
  return (
    (t.setProgress = (e) => {
      t.uniform(0)[0] = Math.min(1, Math.max(0, e));
    }),
    (t.setDirection = (e) => {
      t.uniform(0)[1] = e;
    }),
    t.setProgress(0.5),
    t.setDirection(0),
    t
  );
}
var Ei = { displacement: ce, threshold: de, wipe: fe };
async function pe(t, e = {}) {
  const i = e.backend ?? 'auto';
  if (i === 'webgl2') {
    const r = new Tt();
    return e.timestampQuery === !0 && r.enableTimestampQuery(), await r.init(t), r;
  }
  if (typeof navigator < 'u' && navigator.gpu)
    try {
      const r = new ie();
      return (
        e.timestampQuery === !0 && r.enableTimestampQuery(),
        e.computeCulling === !0 && r.enableComputeCulling(),
        await r.init(t),
        r.initPipelines(),
        r
      );
    } catch (r) {
      if (i === 'webgpu') throw r;
      e.warnOnFallback !== !1 &&
        console.warn('WebGPU initialization failed, falling back to WebGL2', r);
    }
  else if (i === 'webgpu') throw new Error('WebGPU is not available in this browser');
  const s = new Tt();
  return e.timestampQuery === !0 && s.enableTimestampQuery(), await s.init(t), s;
}
var _e = class {
    constructor(t = {}) {
      n(this, 'width');
      n(this, 'height');
      n(this, 'mode');
      n(this, 'pixelArt');
      n(this, 'autoCenter');
      n(this, 'gameSize', { width: 0, height: 0 });
      n(this, 'displaySize', { width: 0, height: 0 });
      n(this, 'parentSize', { width: 0, height: 0 });
      n(this, 'zoom', 1);
      n(this, 'canvas', null);
      n(this, 'resizeListener');
      (this.width = t.width || 800),
        (this.height = t.height || 600),
        (this.mode = t.mode ?? 1),
        (this.pixelArt = t.pixelArt ?? !1),
        (this.autoCenter = t.autoCenter ?? !0),
        (this.resizeListener = this.onResize.bind(this)),
        typeof window < 'u' && window.addEventListener('resize', this.resizeListener);
    }
    setCanvas(t) {
      (this.canvas = t),
        this.pixelArt && (this.canvas.style.imageRendering = 'pixelated'),
        this.onResize();
    }
    onResize() {
      if (!this.canvas || typeof window > 'u') return;
      const t = Math.min(window.devicePixelRatio || 1, 2);
      if (this.mode === 0)
        (this.canvas.width = this.width * t),
          (this.canvas.height = this.height * t),
          (this.canvas.style.width = `${this.width}px`),
          (this.canvas.style.height = `${this.height}px`);
      else if (this.mode === 2) {
        const e = window.innerWidth,
          i = window.innerHeight;
        (this.width = e),
          (this.height = i),
          (this.canvas.width = e * t),
          (this.canvas.height = i * t),
          (this.canvas.style.width = `${e}px`),
          (this.canvas.style.height = `${i}px`);
      } else if (this.mode === 1) {
        const e = window.innerWidth,
          i = window.innerHeight,
          s = e / this.width,
          r = i / this.height,
          a = Math.min(s, r),
          h = this.width * a,
          o = this.height * a;
        (this.canvas.style.width = `${h}px`),
          (this.canvas.style.height = `${o}px`),
          (this.canvas.width = this.width * t),
          (this.canvas.height = this.height * t),
          this.autoCenter &&
            ((this.canvas.style.position = 'absolute'),
            (this.canvas.style.left = `${(e - h) / 2}px`),
            (this.canvas.style.top = `${(i - o) / 2}px`));
      }
      (this.gameSize.width = this.width),
        (this.gameSize.height = this.height),
        (this.parentSize.width = window.innerWidth),
        (this.parentSize.height = window.innerHeight),
        (this.displaySize.width = parseFloat(this.canvas.style.width) || this.width),
        (this.displaySize.height = parseFloat(this.canvas.style.height) || this.height),
        (this.zoom = this.displaySize.width / this.width);
    }
    destroy() {
      typeof window < 'u' && window.removeEventListener('resize', this.resizeListener);
    }
    transformX(t) {
      if (!this.canvas) return t;
      const e = this.canvas.getBoundingClientRect();
      return (t - e.left) * (this.width / e.width);
    }
    transformY(t) {
      if (!this.canvas) return t;
      const e = this.canvas.getBoundingClientRect();
      return (t - e.top) * (this.height / e.height);
    }
    transform(t, e, i) {
      if (!this.canvas) {
        (i[0] = t), (i[1] = e);
        return;
      }
      const s = this.canvas.getBoundingClientRect();
      (i[0] = (t - s.left) * (this.width / s.width)),
        (i[1] = (e - s.top) * (this.height / s.height));
    }
  },
  Vt = class {
    constructor() {
      n(this, '_namespaces', new Map());
      n(this, '_floatStore', new Map());
      n(this, '_floatIndex', new Map());
      n(this, '_floatCount', new Map());
      n(this, '_keysByNamespace', new Map());
    }
    ns(t = '') {
      let e = this._namespaces.get(t);
      return e === void 0 && ((e = new Map()), this._namespaces.set(t, e)), e;
    }
    set(t, e, i) {
      this.ns(t).set(e, i);
    }
    get(t, e, i) {
      const s = this._namespaces.get(t);
      if (s === void 0) return i;
      const r = s.get(e);
      return r === void 0 ? i : r;
    }
    has(t, e) {
      const i = this._namespaces.get(t);
      return i !== void 0 && i.has(e);
    }
    remove(t, e) {
      const i = this._namespaces.get(t);
      return i === void 0 ? !1 : i.delete(e);
    }
    clear(t) {
      if (t === void 0) {
        this._namespaces.clear(),
          this._floatStore.clear(),
          this._floatIndex.clear(),
          this._floatCount.clear(),
          this._keysByNamespace.clear();
        return;
      }
      this._namespaces.delete(t),
        this._floatStore.delete(t),
        this._floatIndex.delete(t),
        this._floatCount.delete(t),
        this._keysByNamespace.delete(t);
    }
    keys(t) {
      const e = this._namespaces.get(t);
      return e === void 0 ? [] : Array.from(e.keys());
    }
    floatCount(t) {
      return this._floatCount.get(t) ?? 0;
    }
    floatSlot(t, e) {
      let i = this._floatIndex.get(t);
      i === void 0 &&
        ((i = new Map()),
        this._floatIndex.set(t, i),
        this._floatStore.set(t, new Float64Array(32)),
        this._floatCount.set(t, 0));
      const s = i.get(e);
      if (s !== void 0) return s;
      const r = this._floatCount.get(t) ?? 0;
      let a = this._floatStore.get(t);
      if (a === void 0 || r >= a.length) {
        const o = new Float64Array(((a == null ? void 0 : a.length) ?? 32) * 2);
        a !== void 0 && o.set(a), this._floatStore.set(t, o), (a = o);
      }
      i.set(e, r), this._floatCount.set(t, r + 1);
      let h = this._keysByNamespace.get(t);
      return h === void 0 && ((h = []), this._keysByNamespace.set(t, h)), h.push(e), r;
    }
    getFloat(t, e) {
      const i = this._floatIndex.get(t);
      if (i === void 0) return 0;
      const s = i.get(e);
      return s === void 0 ? 0 : this._floatStore.get(t)[s];
    }
    setFloat(t, e, i) {
      const s = this.floatSlot(t, e);
      this._floatStore.get(t)[s] = i;
    }
    addFloat(t, e, i) {
      const s = this.floatSlot(t, e),
        r = this._floatStore.get(t),
        a = r[s] + i;
      return (r[s] = a), a;
    }
    floatKeys(t) {
      return this._keysByNamespace.get(t) ?? [];
    }
    floatSnapshot(t) {
      const e = this._floatStore.get(t),
        i = this._keysByNamespace.get(t),
        s = {};
      if (e === void 0 || i === void 0) return s;
      for (let r = 0; r < i.length; r++) s[i[r]] = e[r];
      return s;
    }
  },
  me = class {
    constructor(t) {
      n(this, '_scenes', new Map());
      n(this, '_activeScene', null);
      n(this, '_overlayScene', null);
      n(this, '_engine');
      n(this, 'registry', new Vt());
      this._engine = t;
    }
    add(t, e, i = !1) {
      var h, o, u;
      const s = new e();
      (s.id = t), (s.scene = this);
      const r =
          (o = (h = this._engine) == null ? void 0 : h.config) == null ? void 0 : o.maxInstances,
        a = (u = s.arena) == null ? void 0 : u.capacity;
      typeof r == 'number' &&
        typeof a == 'number' &&
        r > a &&
        (this._engine.config.maxInstances = a),
        this._scenes.set(t, s),
        i && this.start(t);
    }
    isActive(t) {
      return this._scenes.has(t);
    }
    get(t) {
      return this._scenes.get(t) ?? null;
    }
    start(t) {
      const e = this._scenes.get(t);
      if (!e) throw new Error(`Scene ${t} not found.`);
      if (((this._activeScene = e), e.sysInit(this._engine), e.load.pendingCount === 0)) {
        e.sysCreate();
        return;
      }
      e.load.start().then(() => {
        this._activeScene === e && e.sysCreate();
      });
    }
    stop(t) {
      const e = this._scenes.get(t);
      e &&
        (e.sysShutdown(),
        this._activeScene === e && (this._activeScene = null),
        this._overlayScene === e && (this._overlayScene = null));
    }
    restart(t) {
      const e = this._scenes.get(t);
      if (!e) throw new Error(`Scene ${t} not found.`);
      e.sysShutdown(),
        e.setPaused(!1),
        (this._activeScene = e),
        e.sysInit(this._engine),
        e.sysCreate();
    }
    pause(t) {
      const e = t === void 0 ? this._activeScene : this._scenes.get(t);
      e == null || e.setPaused(!0);
    }
    resume(t) {
      const e = t === void 0 ? this._activeScene : this._scenes.get(t);
      e == null || e.setPaused(!1);
    }
    switch(t) {
      this._activeScene && this._activeScene.sysShutdown(), this.start(t);
    }
    setOverlay(t) {
      var i;
      if (t === null) {
        (i = this._overlayScene) == null || i.sysShutdown(), (this._overlayScene = null);
        return;
      }
      const e = this._scenes.get(t);
      if (!e) throw new Error(`Scene ${t} not found.`);
      (this._overlayScene = e), e.sysInit(this._engine), e.sysCreate();
    }
    get activeScene() {
      return this._activeScene;
    }
    get overlayScene() {
      return this._overlayScene;
    }
    getKeys() {
      const t = [];
      return this._scenes.forEach((e, i) => t.push(i)), t;
    }
    pauseAll() {
      var t, e;
      (t = this._activeScene) == null || t.setPaused(!0),
        (e = this._overlayScene) == null || e.setPaused(!0);
    }
    resumeAll() {
      var t, e;
      (t = this._activeScene) == null || t.setPaused(!1),
        (e = this._overlayScene) == null || e.setPaused(!1);
    }
    fixedUpdate(t) {
      var e, i;
      (e = this._activeScene) == null || e.sysFixedUpdate(t),
        (i = this._overlayScene) == null || i.sysFixedUpdate(t);
    }
    update(t) {
      var e, i;
      (e = this._activeScene) == null || e.sysUpdate(t),
        (i = this._overlayScene) == null || i.sysUpdate(t);
    }
  },
  ge = [],
  ye = 4,
  ve = 4096,
  xe = class {
    constructor(t = ve) {
      n(this, 'fps', 0);
      n(this, 'measuredFps', 0);
      n(this, 'deltaTime', 0);
      n(this, 'time', 0);
      n(this, 'now', 0);
      n(this, 'timeScale', 1);
      n(this, 'lastTime', 0);
      n(this, 'frames', 0);
      n(this, 'lastFpsTime', 0);
      n(this, '_started', !1);
      n(this, 'timerCapacity');
      n(this, '_active');
      n(this, '_paused');
      n(this, '_elapsedMs');
      n(this, '_delayMs');
      n(this, '_repeatDelayMs');
      n(this, '_loop');
      n(this, '_hasFired');
      n(this, '_freeList');
      n(this, '_freeListHead', 0);
      n(this, '_timerActiveCount', 0);
      n(this, '_callbacks');
      n(this, '_args');
      n(this, '_timerCount', 0);
      (this.timerCapacity = t),
        (this._active = new Uint8Array(t)),
        (this._paused = new Uint8Array(t)),
        (this._elapsedMs = new Float32Array(t)),
        (this._delayMs = new Float32Array(t)),
        (this._repeatDelayMs = new Float32Array(t)),
        (this._loop = new Uint8Array(t)),
        (this._hasFired = new Uint8Array(t)),
        (this._freeList = new Int32Array(t));
      for (let e = 0; e < t; e++) this._freeList[e] = e;
      (this._callbacks = new Array(t)), (this._args = new Array(t));
    }
    step(t) {
      this._started ||
        ((this._started = !0), (this.lastTime = t), (this.lastFpsTime = t), (this.now = t));
      let e = (t - this.lastTime) / 1e3;
      return (
        e > 0.1 && (e = 0.1),
        e < 0 && (e = 0),
        (this.deltaTime = e),
        (this.time += e),
        (this.lastTime = t),
        (this.now = t),
        this.frames++,
        t - this.lastFpsTime >= 1e3 &&
          ((this.fps = this.frames), (this.frames = 0), (this.lastFpsTime = t)),
        e
      );
    }
    delayedCall(t, e, i) {
      return this._acquire(t, e, !1, void 0, i);
    }
    addEvent(t) {
      return this._acquire(t.delay, t.callback, t.loop === !0, t.repeatDelay, t.args);
    }
    _acquire(t, e, i, s, r) {
      if (this._freeListHead >= this.timerCapacity)
        return console.warn('TimeStepManager: タイマーが上限に達しました。'), -1;
      const a = this._freeList[this._freeListHead++];
      return (
        (this._active[a] = 1),
        (this._paused[a] = 0),
        (this._elapsedMs[a] = 0),
        (this._delayMs[a] = t),
        (this._repeatDelayMs[a] = s !== void 0 ? s : t),
        (this._loop[a] = i ? 1 : 0),
        (this._hasFired[a] = 0),
        (this._callbacks[a] = e),
        (this._args[a] = r ?? ge),
        this._timerActiveCount++,
        (this._timerCount = Math.max(this._timerCount, a + 1)),
        a
      );
    }
    removeEvent(t) {
      t < 0 ||
        t >= this.timerCapacity ||
        (this._active[t] !== 0 &&
          ((this._active[t] = 0),
          (this._paused[t] = 0),
          (this._hasFired[t] = 0),
          (this._callbacks[t] = void 0),
          (this._args[t] = void 0),
          this._timerActiveCount--,
          (this._freeList[--this._freeListHead] = t)));
    }
    get activeTimerCount() {
      return this._timerActiveCount;
    }
    hasTimer(t) {
      return t >= 0 && t < this.timerCapacity && this._active[t] === 1;
    }
    isTimerPaused(t) {
      return this.hasTimer(t) && this._paused[t] === 1;
    }
    getTimerElapsed(t) {
      return this.hasTimer(t) ? this._elapsedMs[t] : 0;
    }
    getTimerDelay(t) {
      return this.hasTimer(t) ? this._delayMs[t] : 0;
    }
    getTimerRepeatDelay(t) {
      return this.hasTimer(t) ? this._repeatDelayMs[t] : 0;
    }
    isTimerLooping(t) {
      return this.hasTimer(t) && this._loop[t] === 1;
    }
    getTimerProgress(t) {
      if (!this.hasTimer(t)) return 0;
      const e = this._delayMs[t];
      if (e <= 0) return 1;
      const i = this._elapsedMs[t] / e;
      return i > 1 ? 1 : i;
    }
    pauseTimer(t) {
      this.hasTimer(t) && (this._paused[t] = 1);
    }
    resumeTimer(t) {
      this.hasTimer(t) && (this._paused[t] = 0);
    }
    resetTimer(t) {
      this.hasTimer(t) && ((this._elapsedMs[t] = 0), (this._hasFired[t] = 0));
    }
    seekTimer(t, e) {
      if (!this.hasTimer(t)) return;
      const i = this._delayMs[t];
      this._elapsedMs[t] = e < 0 ? 0 : e > i ? i : e;
    }
    setTimerDelay(t, e) {
      !this.hasTimer(t) || e < 0 || ((this._delayMs[t] = e), (this._repeatDelayMs[t] = e));
    }
    getTimerCallback(t) {
      return this.hasTimer(t) ? this._callbacks[t] : void 0;
    }
    update(t) {
      if (this._timerActiveCount === 0) return;
      const e = t * this.timeScale;
      for (let i = 0; i < this._timerCount; i++) {
        if (this._active[i] === 0 || this._paused[i] === 1) continue;
        this._elapsedMs[i] += e;
        const s = this._hasFired[i] === 1 ? this._repeatDelayMs[i] : this._delayMs[i];
        if (this._elapsedMs[i] < s) continue;
        const r = this._callbacks[i],
          a = this._args[i];
        this._loop[i] === 1
          ? ((this._elapsedMs[i] -= s),
            this._elapsedMs[i] > s && (this._elapsedMs[i] = 0),
            (this._hasFired[i] = 1),
            r && this._invoke(r, a))
          : (r && this._invoke(r, a), this.removeEvent(i));
      }
    }
    _invoke(t, e) {
      const i = e.length;
      i === 0
        ? t()
        : i === 1
          ? t(e[0])
          : i === 2
            ? t(e[0], e[1])
            : i === 3
              ? t(e[0], e[1], e[2])
              : i <= ye
                ? t(e[0], e[1], e[2], e[3])
                : t(...e);
    }
    clearTimers() {
      for (let t = 0; t < this.timerCapacity; t++)
        this._active[t] === 1 &&
          ((this._active[t] = 0),
          (this._paused[t] = 0),
          (this._hasFired[t] = 0),
          (this._callbacks[t] = void 0),
          (this._args[t] = void 0),
          (this._freeList[--this._freeListHead] = t));
      (this._timerActiveCount = 0), (this._timerCount = 0);
    }
  },
  j = { targetFps: 0, minFps: 30, fixedDeltaTime: 1 / 60, panicLimit: 5, maxDeltaTime: 0.1 },
  we = class {
    constructor(t = {}, e = {}) {
      n(this, 'config');
      n(this, '_running', !1);
      n(this, '_rafId', null);
      n(this, '_lastTime', 0);
      n(this, '_accumulator', 0);
      n(this, '_lastRenderTime', 0);
      n(this, '_primed', !1);
      n(this, 'frameCount', 0);
      n(this, 'fixedStepCount', 0);
      n(this, 'skippedFrameCount', 0);
      n(this, 'measuredFps', 0);
      n(this, '_fpsFrames', 0);
      n(this, '_fpsWindowStart', 0);
      n(this, '_callbacks');
      n(this, '_loop', (t) => {
        this._running && (this.step(t), (this._rafId = requestAnimationFrame(this._loop)));
      });
      (this.config = {
        targetFps: t.targetFps ?? j.targetFps,
        minFps: t.minFps ?? j.minFps,
        fixedDeltaTime: t.fixedDeltaTime ?? j.fixedDeltaTime,
        panicLimit: t.panicLimit ?? j.panicLimit,
        maxDeltaTime: t.maxDeltaTime ?? j.maxDeltaTime,
      }),
        (this._callbacks = e);
    }
    start(t = performance.now()) {
      this._running ||
        ((this._running = !0),
        (this._lastTime = t),
        (this._lastRenderTime = t),
        (this._fpsWindowStart = t),
        (this._accumulator = 0),
        (this._primed = !0),
        (this._rafId = requestAnimationFrame(this._loop)));
    }
    stop() {
      (this._running = !1),
        this._rafId !== null && (cancelAnimationFrame(this._rafId), (this._rafId = null));
    }
    get running() {
      return this._running;
    }
    step(t) {
      var o, u, l, d, c, f, _, g;
      let e = !1;
      if (
        (this._primed ||
          ((this._primed = !0),
          (e = !0),
          (this._lastTime = t),
          (this._lastRenderTime = t),
          (this._fpsWindowStart = t)),
        !e && this.config.targetFps > 0)
      ) {
        const p = 1e3 / this.config.targetFps;
        if (t - this._lastRenderTime < p) {
          this.skippedFrameCount++,
            (this._lastTime = t),
            (u = (o = this._callbacks).onSkip) == null || u.call(o, t);
          return;
        }
      }
      this._lastRenderTime = t;
      let i = (t - this._lastTime) / 1e3;
      (this._lastTime = t),
        i > this.config.maxDeltaTime && (i = this.config.maxDeltaTime),
        i < 0 && (i = 0),
        this._fpsFrames++,
        t - this._fpsWindowStart >= 1e3 &&
          ((this.measuredFps = this._fpsFrames), (this._fpsFrames = 0), (this._fpsWindowStart = t)),
        this.frameCount++;
      const r =
          this.measuredFps > 0 && this.measuredFps < this.config.minFps
            ? 1
            : this.config.panicLimit,
        a = this.config.fixedDeltaTime;
      this._accumulator += i;
      let h = 0;
      for (; this._accumulator >= a && h < r; )
        (d = (l = this._callbacks).onFixedUpdate) == null || d.call(l, a),
          (this._accumulator -= a),
          h++,
          this.fixedStepCount++;
      this._accumulator > a && (this._accumulator = 0),
        (f = (c = this._callbacks).onUpdate) == null || f.call(c, t / 1e3, i),
        (g = (_ = this._callbacks).onRender) == null || g.call(_, t / 1e3);
    }
    destroy() {
      this.stop();
    }
  },
  bi = class {
    constructor(t) {
      n(this, 'scene');
      n(this, 'config');
      n(this, 'scale');
      n(this, 'time');
      n(this, 'loop');
      n(this, 'device', null);
      n(this, 'canvasElement', null);
      n(this, 'gpuBuffers', {});
      n(this, '_projMatrix', new Float32Array(16));
      n(this, '_activeCameras', []);
      n(this, 'ready');
      n(this, 'updateTimeMs', 0);
      n(this, 'renderTimeMs', 0);
      n(this, 'uploadTimeMs', 0);
      n(this, 'drawTimeMs', 0);
      n(this, 'packTimeMs', 0);
      n(this, 'cullTimeMs', 0);
      n(this, 'gpuCullingActive', !1);
      n(this, 'computeCullingActive', !1);
      n(this, 'filtersActive', !1);
      n(this, 'renderGraph');
      n(this, 'totalInstanceCount', 0);
      n(this, 'renderCount', 0);
      n(this, '_camRect', new Float32Array(4));
      (this.config = Object.assign(
        {
          width: 800,
          height: 600,
          scaleMode: 1,
          pixelArt: !1,
          autoCenter: !0,
          maxInstances: 1e5,
          fps: { target: 0, min: 30, fixedDeltaTime: 1 / 60, panicLimit: 5 },
        },
        t,
      )),
        (this.scale = new _e({
          width: this.config.width,
          height: this.config.height,
          mode: this.config.scaleMode,
          pixelArt: this.config.pixelArt,
          autoCenter: this.config.autoCenter,
        })),
        (this.time = new xe()),
        (this.renderGraph = new ne()),
        (this.config.filters = t.filters ?? []),
        (this.config.externalFilters = t.externalFilters ?? []),
        (this.config.filters.length > 0 || this.config.externalFilters.length > 0) &&
          this.renderGraph.setFilters(this.config.filters, this.config.externalFilters);
      const e = this.config.fps ?? {};
      (this.loop = new we(
        {
          targetFps: e.target ?? 0,
          minFps: e.min ?? 30,
          fixedDeltaTime: e.fixedDeltaTime ?? 1 / 60,
          panicLimit: e.panicLimit ?? 5,
        },
        {
          onFixedUpdate: (i) => {
            this.scene.fixedUpdate(i);
          },
          onUpdate: (i, s) => {
            this.time.step(performance.now()),
              (this.time.measuredFps = this.loop.measuredFps),
              this.time.update(s * 1e3),
              this.scene.update(s);
          },
          onRender: () => {
            this.render();
          },
        },
      )),
        (this.scene = new me(this)),
        typeof location < 'u' &&
          new URLSearchParams(location.search).has('debug') &&
          (window.__pluto = this),
        (this.ready = this.init());
    }
    async init() {
      let t;
      typeof this.config.canvas == 'string'
        ? (t = document.getElementById(this.config.canvas))
        : this.config.canvas
          ? (t = this.config.canvas)
          : ((t = document.createElement('canvas')), document.body.appendChild(t)),
        (this.canvasElement = t),
        this.scale.setCanvas(t),
        (this.device = await pe(t, {
          backend: this.config.backend,
          timestampQuery: this.config.gpuTimestampQuery === !0,
          computeCulling: this.config.gpuComputeCulling === !0,
        })),
        this.device.initPipelines();
      const e = this.config.maxInstances;
      for (let i = 0; i < I.length; i++) {
        const s = I[i];
        s.eager && (this.gpuBuffers[s.name] = this.device.createBuffer(e * s.stride));
      }
      for (let i = 0; i < this.config.scene.length; i++) {
        const s = this.config.scene[i],
          a = new s().id || s.name;
        this.scene.add(a, s), i === 0 && this.scene.start(a);
      }
      this.loop.start();
    }
    render() {
      var u, l, d, c, f, _, g, p;
      if (!this.device) return;
      const t = this.scene.activeScene;
      if (!t) return;
      const e = t.arena;
      e.hasHierarchy && e.dirtyHierarchy && (e.computeWorldTransforms(), (e.dirtyHierarchy = !1));
      const i = e.activeCount,
        s = performance.now();
      this.packTimeMs = performance.now() - s;
      let r = i;
      this.totalInstanceCount = i;
      const a = performance.now();
      this.device.clear(0.01, 0.02, 0.05, 1), this.device.bindShaders();
      const h = this.canvasElement.width,
        o = this.canvasElement.height;
      if (i > 0) {
        const y = t.cameras.collectForRender(this._activeCameras);
        if (y === 0) {
          (this.cullTimeMs = 0), (this.renderCount = 0), (this.drawTimeMs = performance.now() - a);
          return;
        }
        const v =
            this.config.gpuComputeCulling === !0 &&
            ((u = this.device) == null ? void 0 : u.beginComputeCulling) !== void 0 &&
            ((d = (l = this.device) == null ? void 0 : l.isComputeCullingSupported) == null
              ? void 0
              : d.call(l)) === !0 &&
            y === 1,
          m =
            !v &&
            this.config.gpuCulling === !0 &&
            ((c = this.device) == null ? void 0 : c.setCullRect) !== void 0 &&
            y === 1;
        (this.computeCullingActive = v), (this.gpuCullingActive = m);
        const F = performance.now();
        let w = i;
        if (v) {
          const x = this._activeCameras[0],
            A = this._cameraRect(x, h, o, this._camRect);
          ((_ = (f = this.device) == null ? void 0 : f.beginComputeCulling) == null
            ? void 0
            : _.call(f, A, i)) === !0
            ? (w = i)
            : (this.computeCullingActive = !1);
        } else if (m) {
          const x = this._activeCameras[0],
            A = this._cameraRect(x, h, o, this._camRect);
          (p = (g = this.device) == null ? void 0 : g.setCullRect) == null || p.call(g, A, !0),
            (w = i);
        } else
          for (let x = 0; x < y; x++) {
            const A = this._activeCameras[x],
              S = this._cameraRect(A, h, o, this._camRect),
              b = e.partitionVisible(S[0], S[1], S[2], S[3]);
            if ((b < w && (w = b), w === 0)) break;
          }
        if (
          ((this.cullTimeMs = performance.now() - F),
          (r = w),
          (this.renderCount = r),
          this.config.cpuOnly === !0)
        ) {
          (this.uploadTimeMs = 0), (this.drawTimeMs = performance.now() - F);
          return;
        }
        if (r > 0) {
          const x = performance.now();
          this._uploadDirtyGroups(e, r), (this.uploadTimeMs = performance.now() - x);
          const A = () => {
            var S, b, T;
            for (let C = 0; C < y; C++) {
              const M = this._activeCameras[C];
              this._writeProjection(M, h, o),
                (S = this.device) == null ||
                  S.setUniformMatrix4fv('projectionMatrix', this._projMatrix),
                (b = this.device) == null || b.setupInstancedAttributes(this.gpuBuffers, r, 0),
                (T = this.device) == null || T.drawInstanced(r, 0);
            }
          };
          if (this.renderGraph.hasFilters) {
            const S = this.renderGraph.render(A, h, o, this.device);
            this.filtersActive = S;
          } else (this.filtersActive = !1), A();
        } else this.filtersActive = !1;
      } else (this.cullTimeMs = 0), (this.renderCount = 0);
      this.drawTimeMs = performance.now() - a;
    }
    _uploadDirtyGroups(t, e) {
      this.device &&
        (e <= 0 ||
          (t.dirtyTransformGroup &&
            (this.device.updateBuffer(this.gpuBuffers.packedTransform, t.packedTransform, 0, e * 4),
            (t.dirtyTransformGroup = !1)),
          t.dirtyUvGroup &&
            (this.device.updateBuffer(this.gpuBuffers.packedUv, t.packedUv, 0, e * 4),
            (t.dirtyUvGroup = !1)),
          t.dirtyFlagsGroup &&
            (this.device.updateBuffer(this.gpuBuffers.packedFlags, t.packedFlags, 0, e * 4),
            (t.dirtyFlagsGroup = !1)),
          t.dirtyShapeGroup &&
            (this.device.updateBuffer(this.gpuBuffers.packedShape, t.packedShape, 0, e * 4),
            (t.dirtyShapeGroup = !1)),
          t.dirtyOriginGroup &&
            (this.device.updateBuffer(this.gpuBuffers.packedOrigin, t.packedOrigin, 0, e * 4),
            (t.dirtyOriginGroup = !1)),
          t.dirtyTintGroup &&
            (this.device.updateBuffer(this.gpuBuffers.packedTint, t.packedTint, 0, e),
            (t.dirtyTintGroup = !1))));
    }
    _cameraRect(t, e, i, s) {
      const r = t.zoom > 0 ? t.zoom : 1,
        a = e / 2 / r,
        h = i / 2 / r,
        o = t.actualX || 0,
        u = t.actualY || 0;
      return (s[0] = o - a), (s[1] = u - h), (s[2] = o + a), (s[3] = u + h), s;
    }
    _writeProjection(t, e, i) {
      const s = (t == null ? void 0 : t.zoom) || 1.4,
        r = (t == null ? void 0 : t.rotation) || 0,
        a = (t == null ? void 0 : t.actualX) || 0,
        h = (t == null ? void 0 : t.actualY) || 0,
        o = Math.cos(-r),
        u = Math.sin(-r),
        l = (2 / e) * s,
        d = -(2 / i) * s,
        c = this._projMatrix;
      (c[0] = l * o),
        (c[1] = d * u),
        (c[2] = 0),
        (c[3] = 0),
        (c[4] = l * -u),
        (c[5] = d * o),
        (c[6] = 0),
        (c[7] = 0),
        (c[8] = 0),
        (c[9] = 0),
        (c[10] = 1),
        (c[11] = 0),
        (c[12] = l * (-a * o + h * u)),
        (c[13] = d * (-a * u - h * o)),
        (c[14] = 0),
        (c[15] = 1);
    }
    destroy() {
      this.loop.destroy(),
        this.scale.destroy(),
        this.scene.activeScene && this.scene.activeScene.sysShutdown(),
        this.device && this.device.destroy();
    }
  };
function E(t, e, i) {
  const s = t[e];
  (t[e] = t[i]), (t[i] = s);
}
function ut(t, e, i) {
  const s = t[e];
  (t[e] = t[i]), (t[i] = s);
}
function Ct(t, e, i) {
  const s = t[e];
  (t[e] = t[i]), (t[i] = s);
}
function Fe(t, e, i) {
  const s = t[e];
  (t[e] = t[i]), (t[i] = s);
}
function J(t, e, i) {
  const s = t[e];
  (t[e] = t[i]), (t[i] = s);
}
var Ae = class {
    constructor(t) {
      n(this, 'capacity');
      n(this, '_activeCount', 0);
      n(this, 'posX');
      n(this, 'posY');
      n(this, 'rotation');
      n(this, 'scaleX');
      n(this, 'scaleY');
      n(this, 'frameWidth');
      n(this, 'frameHeight');
      n(this, 'facing');
      n(this, 'depth');
      n(this, 'originX');
      n(this, 'originY');
      n(this, 'scrollFactorX');
      n(this, 'scrollFactorY');
      n(this, 'active');
      n(this, 'tintMode');
      n(this, 'blendMode');
      n(this, 'nameSlot');
      n(this, 'kind');
      n(this, 'namePool', []);
      n(this, 'kindNames', ['Sprite']);
      n(this, 'uvX');
      n(this, 'uvY');
      n(this, 'uvW');
      n(this, 'uvH');
      n(this, 'frameIdx');
      n(this, 'tint');
      n(this, 'isText');
      n(this, 'visible');
      n(this, 'srcFrame');
      n(this, 'packedTransform');
      n(this, 'packedUv');
      n(this, 'packedFlags');
      n(this, 'packedShape');
      n(this, 'packedTint');
      n(this, 'packedOrigin');
      n(this, 'packedExt');
      n(this, 'assetRef');
      n(this, 'parentId');
      n(this, 'localX');
      n(this, 'localY');
      n(this, 'localRotation');
      n(this, 'worldX');
      n(this, 'worldY');
      n(this, 'worldRotation');
      n(this, '_resolvedStamp');
      n(this, '_stamp', 0);
      n(this, 'interactive');
      n(this, 'hitWidth');
      n(this, 'hitHeight');
      n(this, 'idToIndex');
      n(this, 'indexToId');
      n(this, 'dirtyPos', !0);
      n(this, 'dirtyRotation', !0);
      n(this, 'dirtyScale', !0);
      n(this, 'dirtyUv', !0);
      n(this, 'dirtyFrameIdx', !0);
      n(this, 'dirtyTint', !0);
      n(this, 'dirtyDepth', !0);
      n(this, 'dirtyHierarchy', !0);
      n(this, 'dirtyTransformGroup', !0);
      n(this, 'dirtyUvGroup', !0);
      n(this, 'dirtyFlagsGroup', !0);
      n(this, 'dirtyShapeGroup', !0);
      n(this, 'dirtyOriginGroup', !0);
      n(this, 'dirtyTintGroup', !0);
      n(this, 'dirtyExtGroup', !1);
      n(this, 'freeList');
      n(this, 'freeListHead', 0);
      n(this, 'animTracker', null);
      n(this, 'bodyFactory', null);
      n(this, 'hasHierarchy', !1);
      n(this, 'hasText', !1);
      n(this, 'dirtyIsText', !1);
      n(this, 'dirtyVisible', !1);
      (this.capacity = t),
        (this.posX = new Float32Array(t)),
        (this.posY = new Float32Array(t)),
        (this.rotation = new Float32Array(t)),
        (this.scaleX = new Float32Array(t).fill(1)),
        (this.scaleY = new Float32Array(t).fill(1)),
        (this.frameWidth = new Float32Array(t).fill(O)),
        (this.frameHeight = new Float32Array(t).fill(O)),
        (this.facing = new Float32Array(t)),
        (this.depth = new Float32Array(t)),
        (this.originX = new Float32Array(t).fill(0.5)),
        (this.originY = new Float32Array(t).fill(0.5)),
        (this.scrollFactorX = new Float32Array(t).fill(1)),
        (this.scrollFactorY = new Float32Array(t).fill(1)),
        (this.active = new Uint8Array(t).fill(1)),
        (this.tintMode = new Uint8Array(t).fill(gt.Multiply)),
        (this.blendMode = new Uint8Array(t).fill(tt.Normal)),
        (this.nameSlot = new Int32Array(t).fill(-1)),
        (this.kind = new Uint8Array(t)),
        (this.uvX = new Float32Array(t)),
        (this.uvY = new Float32Array(t)),
        (this.uvW = new Float32Array(t)),
        (this.uvH = new Float32Array(t)),
        (this.frameIdx = new Float32Array(t)),
        (this.tint = new Uint32Array(t)),
        (this.isText = new Float32Array(t)),
        (this.visible = new Float32Array(t).fill(1)),
        (this.srcFrame = new Uint16Array(t)),
        (this.packedTransform = new Float32Array(t * 4)),
        (this.packedUv = new Float32Array(t * 4)),
        (this.packedFlags = new Float32Array(t * 4)),
        (this.packedShape = new Float32Array(t * 4)),
        (this.packedTint = new Uint32Array(t).fill(4294967295)),
        (this.packedOrigin = new Float32Array(t * 4)),
        (this.packedExt = new Float32Array(t * 16));
      for (let e = 0; e < t; e++) {
        const i = e * 4;
        (this.packedOrigin[i + X.OriginX] = 0.5),
          (this.packedOrigin[i + X.OriginY] = 0.5),
          (this.packedOrigin[i + X.ScrollFactorX] = 1),
          (this.packedOrigin[i + X.ScrollFactorY] = 1);
      }
      (this.assetRef = new Array(t).fill(null)),
        (this.parentId = new Int32Array(t).fill(-1)),
        (this.localX = new Float32Array(t)),
        (this.localY = new Float32Array(t)),
        (this.localRotation = new Float32Array(t)),
        (this.worldX = new Float32Array(t)),
        (this.worldY = new Float32Array(t)),
        (this.worldRotation = new Float32Array(t)),
        (this._resolvedStamp = new Int32Array(t)),
        (this.interactive = new Uint8Array(t)),
        (this.hitWidth = new Float32Array(t)),
        (this.hitHeight = new Float32Array(t)),
        (this.idToIndex = new Int32Array(t).fill(-1)),
        (this.indexToId = new Int32Array(t).fill(-1)),
        (this.freeList = new Int32Array(t));
      for (let e = 0; e < t; e++) this.freeList[e] = e;
    }
    setParentId(t, e) {
      const i = this.idToIndex[t];
      if (i < 0) return;
      const s = e >= 0 ? this.idToIndex[e] : -1;
      (this.parentId[i] = e >= 0 && s >= 0 ? e : -1),
        (this.localX[i] = this.posX[i]),
        (this.localY[i] = this.posY[i]),
        (this.localRotation[i] = this.rotation[i]),
        (this.dirtyHierarchy = !0),
        (this.dirtyTransformGroup = !0),
        (this.dirtyShapeGroup = !0),
        this.parentId[i] >= 0 && (this.hasHierarchy = !0);
    }
    getParentId(t) {
      const e = this.idToIndex[t];
      return e < 0 ? -1 : this.parentId[e];
    }
    sparseIdOf(t) {
      return t < 0 || t >= this._activeCount ? -1 : this.indexToId[t];
    }
    allocate() {
      if (this.freeListHead >= this.capacity) return -1;
      const t = this.freeList[this.freeListHead++],
        e = this._activeCount++;
      (this.idToIndex[t] = e),
        (this.indexToId[e] = t),
        (this.posX[e] = 0),
        (this.posY[e] = 0),
        (this.rotation[e] = 0),
        (this.scaleX[e] = 1),
        (this.scaleY[e] = 1),
        (this.frameWidth[e] = O),
        (this.frameHeight[e] = O),
        (this.facing[e] = 1),
        (this.depth[e] = 0),
        (this.frameIdx[e] = 0),
        (this.uvX[e] = 0),
        (this.uvY[e] = 0),
        (this.uvW[e] = 0),
        (this.uvH[e] = 0),
        (this.srcFrame[e] = 0),
        (this.tint[e] = 16777215),
        (this.isText[e] = 0),
        (this.visible[e] = 1),
        (this.assetRef[e] = null),
        (this.parentId[e] = -1),
        (this.localX[e] = 0),
        (this.localY[e] = 0),
        (this.localRotation[e] = 0),
        (this.worldX[e] = 0),
        (this.worldY[e] = 0),
        (this.worldRotation[e] = 0),
        (this._resolvedStamp[e] = 0),
        (this.interactive[e] = 0),
        (this.hitWidth[e] = 0),
        (this.hitHeight[e] = 0),
        (this.originX[e] = 0.5),
        (this.originY[e] = 0.5),
        (this.scrollFactorX[e] = 1),
        (this.scrollFactorY[e] = 1),
        (this.active[e] = 1),
        (this.tintMode[e] = gt.Multiply),
        (this.blendMode[e] = tt.Normal),
        (this.nameSlot[e] = -1),
        (this.kind[e] = 0);
      const i = e * 4;
      return (
        (this.packedTransform[i + B.PosX] = 0),
        (this.packedTransform[i + B.PosY] = 0),
        (this.packedTransform[i + B.ScaleX] = 1),
        (this.packedTransform[i + B.ScaleY] = 1),
        (this.packedUv[i + k.X] = 0),
        (this.packedUv[i + k.Y] = 0),
        (this.packedUv[i + k.W] = 0),
        (this.packedUv[i + k.H] = 0),
        (this.packedFlags[i + D.FrameIdx] = 0),
        (this.packedFlags[i + D.Facing] = 1),
        (this.packedFlags[i + D.Visible] = 1),
        (this.packedFlags[i + D.SpriteFlags] =
          (this.isText[e] !== 0 ? 1 : 0) | (this.tintMode[e] << 1)),
        (this.packedShape[i + R.Rotation] = 0),
        (this.packedShape[i + R.FrameWidth] = O),
        (this.packedShape[i + R.FrameHeight] = O),
        (this.packedShape[i + R.Depth] = 0),
        (this.packedTint[e] = 16777215),
        (this.packedOrigin[i + X.OriginX] = 0.5),
        (this.packedOrigin[i + X.OriginY] = 0.5),
        (this.packedOrigin[i + X.ScrollFactorX] = 1),
        (this.packedOrigin[i + X.ScrollFactorY] = 1),
        this.markAllDirty(),
        t
      );
    }
    free(t) {
      const e = this.idToIndex[t];
      if (e < 0 || e >= this._activeCount) return;
      const i = this._activeCount - 1;
      e !== i && this._swapInstances(e, i),
        (this.idToIndex[t] = -1),
        (this.indexToId[i] = -1),
        this._activeCount--,
        (this.assetRef[i] = null),
        this.markAllDirty(),
        (this.freeList[--this.freeListHead] = t);
    }
    _swapInstances(t, e) {
      if (t === e) return;
      const i = this.indexToId[t],
        s = this.indexToId[e];
      E(this.posX, t, e),
        E(this.posY, t, e),
        E(this.rotation, t, e),
        E(this.scaleX, t, e),
        E(this.scaleY, t, e),
        E(this.frameWidth, t, e),
        E(this.frameHeight, t, e),
        E(this.facing, t, e),
        E(this.depth, t, e),
        E(this.uvX, t, e),
        E(this.uvY, t, e),
        E(this.uvW, t, e),
        E(this.uvH, t, e),
        E(this.isText, t, e),
        Ct(this.tint, t, e),
        E(this.visible, t, e),
        Fe(this.srcFrame, t, e);
      {
        const r = this.assetRef[t];
        (this.assetRef[t] = this.assetRef[e]), (this.assetRef[e] = r);
      }
      ut(this.parentId, t, e),
        E(this.localX, t, e),
        E(this.localY, t, e),
        E(this.localRotation, t, e),
        E(this.worldX, t, e),
        E(this.worldY, t, e),
        E(this.worldRotation, t, e),
        ut(this._resolvedStamp, t, e),
        J(this.interactive, t, e),
        E(this.hitWidth, t, e),
        E(this.hitHeight, t, e),
        E(this.originX, t, e),
        E(this.originY, t, e),
        E(this.scrollFactorX, t, e),
        E(this.scrollFactorY, t, e),
        J(this.active, t, e),
        J(this.tintMode, t, e),
        J(this.blendMode, t, e),
        ut(this.nameSlot, t, e),
        J(this.kind, t, e);
      for (let r = 0; r < 4; r++)
        E(this.packedTransform, t * 4 + r, e * 4 + r),
          E(this.packedUv, t * 4 + r, e * 4 + r),
          E(this.packedFlags, t * 4 + r, e * 4 + r),
          E(this.packedShape, t * 4 + r, e * 4 + r),
          E(this.packedOrigin, t * 4 + r, e * 4 + r);
      for (let r = 0; r < 16; r++) E(this.packedExt, t * 16 + r, e * 16 + r);
      Ct(this.packedTint, t, e),
        (this.idToIndex[s] = t),
        (this.indexToId[t] = s),
        (this.idToIndex[i] = e),
        (this.indexToId[e] = i);
    }
    partitionVisible(t, e, i, s) {
      const r = this._activeCount;
      if (r === 0) return 0;
      const a = this.hasHierarchy,
        h = a ? this.worldX : this.posX,
        o = a ? this.worldY : this.posY,
        u = this.scaleX,
        l = this.scaleY,
        d = this.frameWidth,
        c = this.frameHeight,
        f = this.visible,
        _ = this.active;
      let g = 0;
      for (let p = 0; p < r; p++) {
        if (f[p] === 0 || _[p] === 0) continue;
        const y = d[p] * Math.abs(u[p]) * 0.5,
          v = c[p] * Math.abs(l[p]) * 0.5,
          m = h[p],
          F = o[p];
        m + y < t ||
          m - y > i ||
          F + v < e ||
          F - v > s ||
          (p !== g && this._swapInstances(p, g), g++);
      }
      return g !== r && this.markAllDirty(), g;
    }
    markAllDirty() {
      (this.dirtyPos = !0),
        (this.dirtyRotation = !0),
        (this.dirtyScale = !0),
        (this.dirtyUv = !0),
        (this.dirtyFrameIdx = !0),
        (this.dirtyTint = !0),
        (this.dirtyDepth = !0),
        (this.dirtyHierarchy = !0),
        (this.dirtyIsText = !0),
        (this.dirtyVisible = !0),
        (this.dirtyTransformGroup = !0),
        (this.dirtyUvGroup = !0),
        (this.dirtyFlagsGroup = !0),
        (this.dirtyShapeGroup = !0),
        (this.dirtyOriginGroup = !0),
        (this.dirtyTintGroup = !0),
        (this.dirtyExtGroup = !0);
    }
    setPosX(t, e) {
      (this.posX[t] = e),
        (this.packedTransform[t * 4 + B.PosX] = e),
        (this.dirtyPos = !0),
        (this.dirtyTransformGroup = !0);
    }
    setPosY(t, e) {
      (this.posY[t] = e),
        (this.packedTransform[t * 4 + B.PosY] = e),
        (this.dirtyPos = !0),
        (this.dirtyTransformGroup = !0);
    }
    setScaleX(t, e) {
      (this.scaleX[t] = e),
        (this.packedTransform[t * 4 + B.ScaleX] = e),
        (this.dirtyScale = !0),
        (this.dirtyTransformGroup = !0);
    }
    setScaleY(t, e) {
      (this.scaleY[t] = e),
        (this.packedTransform[t * 4 + B.ScaleY] = e),
        (this.dirtyScale = !0),
        (this.dirtyTransformGroup = !0);
    }
    setScale(t, e, i) {
      const s = i === void 0 ? e : i,
        r = t * 4;
      (this.scaleX[t] = e),
        (this.scaleY[t] = s),
        (this.packedTransform[r + B.ScaleX] = e),
        (this.packedTransform[r + B.ScaleY] = s),
        (this.dirtyScale = !0),
        (this.dirtyTransformGroup = !0);
    }
    setFrameSize(t, e, i, s = !0) {
      const r = t * 4;
      (this.frameWidth[t] = e),
        (this.frameHeight[t] = i),
        (this.packedShape[r + R.FrameWidth] = e),
        (this.packedShape[r + R.FrameHeight] = i),
        s ||
          ((this.scaleX[t] = 1),
          (this.scaleY[t] = 1),
          (this.packedTransform[r + B.ScaleX] = 1),
          (this.packedTransform[r + B.ScaleY] = 1)),
        (this.dirtyShapeGroup = !0),
        s || (this.dirtyTransformGroup = !0);
    }
    setRotation(t, e) {
      (this.rotation[t] = e),
        (this.packedShape[t * 4 + R.Rotation] = e),
        (this.dirtyRotation = !0),
        (this.dirtyShapeGroup = !0);
    }
    setUvX(t, e) {
      (this.uvX[t] = e),
        (this.packedUv[t * 4 + k.X] = e),
        (this.dirtyUv = !0),
        (this.dirtyUvGroup = !0);
    }
    setUvY(t, e) {
      (this.uvY[t] = e),
        (this.packedUv[t * 4 + k.Y] = e),
        (this.dirtyUv = !0),
        (this.dirtyUvGroup = !0);
    }
    setUvW(t, e) {
      (this.uvW[t] = e),
        (this.packedUv[t * 4 + k.W] = e),
        (this.dirtyUv = !0),
        (this.dirtyUvGroup = !0);
    }
    setUvH(t, e) {
      (this.uvH[t] = e),
        (this.packedUv[t * 4 + k.H] = e),
        (this.dirtyUv = !0),
        (this.dirtyUvGroup = !0);
    }
    setFrameIdx(t, e) {
      (this.frameIdx[t] = e),
        (this.packedFlags[t * 4 + D.FrameIdx] = e),
        (this.dirtyFrameIdx = !0),
        (this.dirtyFlagsGroup = !0);
    }
    setFacing(t, e) {
      (this.facing[t] = e),
        (this.packedFlags[t * 4 + D.Facing] = e),
        (this.dirtyScale = !0),
        (this.dirtyFlagsGroup = !0);
    }
    setVisible(t, e) {
      this.visible[t] = e;
      const i = e !== 0 && this.active[t] !== 0 ? 1 : 0;
      (this.packedFlags[t * 4 + D.Visible] = i),
        (this.dirtyVisible = !0),
        (this.dirtyFlagsGroup = !0);
    }
    setTint(t, e) {
      (this.tint[t] = e),
        (this.packedTint[t] = e),
        (this.dirtyTint = !0),
        (this.dirtyTintGroup = !0);
    }
    setOrigin(t, e, i) {
      const s = t * 4;
      (this.originX[t] = e),
        (this.originY[t] = i),
        (this.packedOrigin[s + X.OriginX] = e),
        (this.packedOrigin[s + X.OriginY] = i),
        (this.dirtyOriginGroup = !0);
    }
    setScrollFactor(t, e, i) {
      const s = t * 4;
      (this.scrollFactorX[t] = e),
        (this.scrollFactorY[t] = i),
        (this.packedOrigin[s + X.ScrollFactorX] = e),
        (this.packedOrigin[s + X.ScrollFactorY] = i),
        (this.dirtyOriginGroup = !0);
    }
    setActive(t, e) {
      this.active[t] = e;
      const i = e !== 0 && this.visible[t] !== 0 ? 1 : 0;
      (this.packedFlags[t * 4 + D.Visible] = i), (this.dirtyFlagsGroup = !0);
    }
    setTintMode(t, e) {
      (this.tintMode[t] = e), this._updateSpriteFlags(t);
    }
    setIsText(t, e) {
      (this.isText[t] = e),
        e !== 0 && (this.hasText = !0),
        (this.dirtyIsText = !0),
        this._updateSpriteFlags(t);
    }
    _updateSpriteFlags(t) {
      const e = this.isText[t] !== 0 ? 1 : 0,
        i = this.tintMode[t] << 1;
      (this.packedFlags[t * 4 + D.SpriteFlags] = e | i), (this.dirtyFlagsGroup = !0);
    }
    setBlendMode(t, e) {
      const i = e >= 0 && e < tt.Count ? e : tt.Normal;
      this.blendMode[t] = i;
    }
    setName(t, e) {
      let i = -1;
      for (let s = 0; s < this.namePool.length; s++)
        if (this.namePool[s] === e) {
          i = s;
          break;
        }
      return (
        i === -1 && ((i = this.namePool.length), this.namePool.push(e)), (this.nameSlot[t] = i), i
      );
    }
    nameOf(t) {
      const e = this.nameSlot[t];
      return e < 0 || e >= this.namePool.length ? '' : this.namePool[e];
    }
    kindNameOf(t) {
      return this.kindNames[this.kind[t]] ?? 'Sprite';
    }
    setDepth(t, e) {
      (this.depth[t] = e),
        (this.packedShape[t * 4 + R.Depth] = e),
        (this.dirtyDepth = !0),
        (this.dirtyShapeGroup = !0);
    }
    setExt(t, e, i, s, r, a) {
      const h = t * 16 + e * 4;
      (this.packedExt[h] = i),
        (this.packedExt[h + 1] = s),
        (this.packedExt[h + 2] = r),
        (this.packedExt[h + 3] = a),
        (this.dirtyExtGroup = !0);
    }
    getExt(t, e, i) {
      const s = t * 16 + e * 4;
      (i[0] = this.packedExt[s]),
        (i[1] = this.packedExt[s + 1]),
        (i[2] = this.packedExt[s + 2]),
        (i[3] = this.packedExt[s + 3]);
    }
    setTransform4(t, e, i, s, r) {
      const a = r === void 0 ? s : r,
        h = t * 4;
      (this.posX[t] = e),
        (this.posY[t] = i),
        (this.scaleX[t] = s),
        (this.scaleY[t] = a),
        (this.packedTransform[h + B.PosX] = e),
        (this.packedTransform[h + B.PosY] = i),
        (this.packedTransform[h + B.ScaleX] = s),
        (this.packedTransform[h + B.ScaleY] = a),
        (this.dirtyPos = !0),
        (this.dirtyScale = !0),
        (this.dirtyTransformGroup = !0);
    }
    setUv4(t, e, i, s, r) {
      const a = t * 4;
      (this.uvX[t] = e),
        (this.uvY[t] = i),
        (this.uvW[t] = s),
        (this.uvH[t] = r),
        (this.packedUv[a + k.X] = e),
        (this.packedUv[a + k.Y] = i),
        (this.packedUv[a + k.W] = s),
        (this.packedUv[a + k.H] = r),
        (this.dirtyUv = !0),
        (this.dirtyUvGroup = !0);
    }
    setFlags4(t, e, i, s, r) {
      const a = t * 4;
      (this.frameIdx[t] = e),
        (this.facing[t] = i),
        (this.visible[t] = s),
        (this.isText[t] = r),
        (this.packedFlags[a + D.FrameIdx] = e),
        (this.packedFlags[a + D.Facing] = i),
        (this.packedFlags[a + D.Visible] = s),
        (this.packedFlags[a + D.SpriteFlags] = (r !== 0 ? 1 : 0) | (this.tintMode[t] << 1)),
        r !== 0 && (this.hasText = !0),
        (this.dirtyFrameIdx = !0),
        (this.dirtyScale = !0),
        (this.dirtyVisible = !0),
        (this.dirtyIsText = !0),
        (this.dirtyFlagsGroup = !0);
    }
    computeWorldTransforms() {
      this._stamp++;
      for (let t = 0; t < this._activeCount; t++)
        this.parentId[t] < 0 &&
          ((this.worldX[t] = this.posX[t]),
          (this.worldY[t] = this.posY[t]),
          (this.worldRotation[t] = this.rotation[t]),
          (this._resolvedStamp[t] = this._stamp));
      for (let t = 0; t < this._activeCount; t++)
        this._resolvedStamp[t] !== this._stamp && this._resolveWorld(t, 0);
      for (let t = 0; t < this._activeCount; t++) {
        const e = t * 4;
        (this.packedTransform[e + B.PosX] = this.worldX[t]),
          (this.packedTransform[e + B.PosY] = this.worldY[t]),
          (this.packedShape[e + R.Rotation] = this.worldRotation[t]);
      }
      (this.dirtyTransformGroup = !0), (this.dirtyShapeGroup = !0);
    }
    _resolveWorld(t, e) {
      if (this._resolvedStamp[t] === this._stamp) return;
      if (e >= this.capacity) {
        (this.worldX[t] = this.posX[t]),
          (this.worldY[t] = this.posY[t]),
          (this.worldRotation[t] = this.rotation[t]),
          (this._resolvedStamp[t] = this._stamp);
        return;
      }
      const i = this.parentId[t],
        s = this.idToIndex[i];
      if (i < 0 || s < 0) {
        (this.worldX[t] = this.posX[t]),
          (this.worldY[t] = this.posY[t]),
          (this.worldRotation[t] = this.rotation[t]),
          (this._resolvedStamp[t] = this._stamp);
        return;
      }
      this._resolveWorld(s, e + 1);
      const r = this.worldRotation[s],
        a = Math.cos(r),
        h = Math.sin(r),
        o = this.localX[t],
        u = this.localY[t];
      (this.worldX[t] = this.worldX[s] + o * a - u * h),
        (this.worldY[t] = this.worldY[s] + o * h + u * a),
        (this.worldRotation[t] = r + this.localRotation[t]),
        (this._resolvedStamp[t] = this._stamp);
    }
    hitTest(t, e, i) {
      let s = 0;
      const r = i.length,
        a = this.hasHierarchy;
      for (let h = this._activeCount - 1; h >= 0; h--) {
        if (this.interactive[h] === 0) continue;
        const o = a ? this.worldX[h] : this.posX[h],
          u = a ? this.worldY[h] : this.posY[h],
          l =
            this.hitWidth[h] > 0 ? this.hitWidth[h] : this.frameWidth[h] * Math.abs(this.scaleX[h]),
          d =
            this.hitHeight[h] > 0
              ? this.hitHeight[h]
              : this.frameHeight[h] * Math.abs(this.scaleY[h]),
          c = l * 0.5,
          f = d * 0.5;
        if (
          !(t < o - c || t > o + c) &&
          !(e < u - f || e > u + f) &&
          s < r &&
          ((i[s] = this.indexToId[h]), s++, s >= r)
        )
          break;
      }
      return s;
    }
    get activeCount() {
      return this._activeCount;
    }
    clear() {
      (this._activeCount = 0),
        (this.freeListHead = 0),
        this.idToIndex.fill(-1),
        this.indexToId.fill(-1),
        this.parentId.fill(-1),
        (this.hasHierarchy = !1),
        (this.hasText = !1);
      for (let t = 0; t < this.capacity; t++) {
        (this.assetRef[t] = null),
          (this.freeList[t] = t),
          (this.visible[t] = 1),
          (this.isText[t] = 0);
        const e = t * 4;
        (this.packedFlags[e + D.Visible] = 1),
          (this.packedFlags[e + D.SpriteFlags] =
            (this.isText[t] !== 0 ? 1 : 0) | (this.tintMode[t] << 1)),
          (this.packedOrigin[e + X.OriginX] = 0.5),
          (this.packedOrigin[e + X.OriginY] = 0.5),
          (this.packedOrigin[e + X.ScrollFactorX] = 1),
          (this.packedOrigin[e + X.ScrollFactorY] = 1);
      }
      (this.namePool.length = 0), this.markAllDirty();
    }
  },
  U = { x: 0, y: 0, width: 0, height: 0 },
  Se = new Float32Array(2),
  Ee = { MULTIPLY: 0, FILL: 1, ADD: 2, SCREEN: 3, OVERLAY: 4, HARD_LIGHT: 5 },
  be = { NORMAL: 0, ADD: 1, MULTIPLY: 2, SCREEN: 3 },
  Te = class {
    constructor(t, e) {
      n(this, 'id');
      n(this, '_arena');
      (this.id = t), (this._arena = e);
    }
    get idx() {
      return this._arena.idToIndex[this.id];
    }
    get index() {
      return this._arena.idToIndex[this.id];
    }
    setPosition(t, e, i, s) {
      return t !== void 0 && (this.x = t), e !== void 0 && (this.y = e), this;
    }
    setX(t) {
      return (this.x = t), this;
    }
    setY(t) {
      return (this.y = t), this;
    }
    setScale(t, e) {
      return this._arena.setScale(this.idx, t, e), this;
    }
    get scale() {
      return this._arena.scaleX[this.idx];
    }
    set scale(t) {
      this._arena.setScale(this.idx, t, t);
    }
    get scaleX() {
      return this._arena.scaleX[this.idx];
    }
    set scaleX(t) {
      this._arena.setScaleX(this.idx, t);
    }
    get scaleY() {
      return this._arena.scaleY[this.idx];
    }
    set scaleY(t) {
      this._arena.setScaleY(this.idx, t);
    }
    get width() {
      return this._arena.frameWidth[this.idx];
    }
    set width(t) {
      this._arena.setFrameSize(this.idx, t, this._arena.frameHeight[this.idx]);
    }
    get height() {
      return this._arena.frameHeight[this.idx];
    }
    set height(t) {
      this._arena.setFrameSize(this.idx, this._arena.frameWidth[this.idx], t);
    }
    get displayWidth() {
      return this._arena.frameWidth[this.idx] * Math.abs(this._arena.scaleX[this.idx]);
    }
    get displayHeight() {
      return this._arena.frameHeight[this.idx] * Math.abs(this._arena.scaleY[this.idx]);
    }
    setDisplaySize(t, e) {
      const i = this._arena.frameWidth[this.idx],
        s = this._arena.frameHeight[this.idx];
      return (
        i > 0 && this._arena.setScaleX(this.idx, t / i),
        s > 0 && this._arena.setScaleY(this.idx, e / s),
        this
      );
    }
    get hasTexture() {
      return this._arena.assetRef[this.idx] !== null;
    }
    setOrigin(t = 0.5, e) {
      return this._arena.setOrigin(this.idx, t, e === void 0 ? t : e), this;
    }
    setOriginToDefault() {
      return this.setOrigin(0.5, 0.5);
    }
    getOrigin(t) {
      const e = this.idx;
      return (t[0] = this._arena.originX[e]), (t[1] = this._arena.originY[e]), this;
    }
    setScrollFactor(t, e) {
      return this._arena.setScrollFactor(this.idx, t, e === void 0 ? t : e), this;
    }
    setScrollFactorX(t) {
      const e = this.idx;
      return this._arena.setScrollFactor(e, t, this._arena.scrollFactorY[e]), this;
    }
    setScrollFactorY(t) {
      const e = this.idx;
      return this._arena.setScrollFactor(e, this._arena.scrollFactorX[e], t), this;
    }
    get scrollFactorX() {
      return this._arena.scrollFactorX[this.idx];
    }
    get scrollFactorY() {
      return this._arena.scrollFactorY[this.idx];
    }
    setActive(t) {
      return this._arena.setActive(this.idx, t ? 1 : 0), this;
    }
    get active() {
      return this._arena.active[this.idx] !== 0;
    }
    setName(t) {
      return this._arena.setName(this.idx, t), this;
    }
    get name() {
      return this._arena.nameOf(this.idx);
    }
    get type() {
      return this._arena.kindNameOf(this.idx);
    }
    setTintMode(t) {
      const e = typeof t == 'string' ? (Ee[t] ?? 0) : t;
      return this._arena.setTintMode(this.idx, e), this;
    }
    get tintMode() {
      return this._arena.tintMode[this.idx];
    }
    setBlendMode(t) {
      const e = typeof t == 'string' ? (be[t] ?? 0) : t;
      return this._arena.setBlendMode(this.idx, e), this;
    }
    get blendMode() {
      return this._arena.blendMode[this.idx];
    }
    getLocalTransformMatrix(t) {
      const e = this.idx,
        i = this._arena.scaleX[e],
        s = this._arena.scaleY[e],
        r = this._arena.rotation[e],
        a = Math.cos(r),
        h = Math.sin(r);
      return (
        (t[0] = a * i),
        (t[1] = h * i),
        (t[2] = -h * s),
        (t[3] = a * s),
        (t[4] = this.x),
        (t[5] = this.y),
        this
      );
    }
    getWorldTransformMatrix(t) {
      const e = this.idx,
        i = this._arena,
        s = i.scaleX[e],
        r = i.scaleY[e],
        a = i.parentId[e] >= 0,
        h = a ? i.worldRotation[e] : i.rotation[e],
        o = Math.cos(h),
        u = Math.sin(h);
      return (
        (t[0] = o * s),
        (t[1] = u * s),
        (t[2] = -u * r),
        (t[3] = o * r),
        (t[4] = a ? i.worldX[e] : i.posX[e]),
        (t[5] = a ? i.worldY[e] : i.posY[e]),
        this
      );
    }
    setSize(t, e) {
      return this._arena.setFrameSize(this.idx, t, e), this;
    }
    getSize(t) {
      const e = this.idx;
      return (t[0] = this._arena.frameWidth[e]), (t[1] = this._arena.frameHeight[e]), this;
    }
    get x() {
      const t = this.idx;
      return this._arena.parentId[t] >= 0 ? this._arena.worldX[t] : this._arena.posX[t];
    }
    set x(t) {
      const e = this.idx;
      this._arena.parentId[e] >= 0
        ? ((this._arena.localX[e] = t), (this._arena.dirtyHierarchy = !0))
        : this._arena.setPosX(e, t);
    }
    get y() {
      const t = this.idx;
      return this._arena.parentId[t] >= 0 ? this._arena.worldY[t] : this._arena.posY[t];
    }
    set y(t) {
      const e = this.idx;
      this._arena.parentId[e] >= 0
        ? ((this._arena.localY[e] = t), (this._arena.dirtyHierarchy = !0))
        : this._arena.setPosY(e, t);
    }
    get rotation() {
      const t = this.idx;
      return this._arena.parentId[t] >= 0 ? this._arena.worldRotation[t] : this._arena.rotation[t];
    }
    set rotation(t) {
      const e = this.idx;
      this._arena.parentId[e] >= 0
        ? ((this._arena.localRotation[e] = t), (this._arena.dirtyHierarchy = !0))
        : this._arena.setRotation(e, t);
    }
    get angle() {
      return (this.rotation * 180) / Math.PI;
    }
    set angle(t) {
      this.rotation = (t * Math.PI) / 180;
    }
    setAngle(t) {
      return (this.angle = t), this;
    }
    setRotation(t) {
      return (this.angle = t), this;
    }
    get facing() {
      return this._arena.facing[this.idx];
    }
    set facing(t) {
      this._arena.setFacing(this.idx, t);
    }
    get visible() {
      return this._arena.visible[this.idx] === 1;
    }
    set visible(t) {
      this._arena.setVisible(this.idx, t ? 1 : 0);
    }
    setVisible(t) {
      return (this.visible = t), this;
    }
    toggleVisible() {
      return (this.visible = !this.visible), this;
    }
    get depth() {
      return this._arena.depth[this.idx];
    }
    set depth(t) {
      this._arena.setDepth(this.idx, t);
    }
    get depthIndex() {
      return this.idx;
    }
    get frameIdx() {
      return this._arena.frameIdx[this.idx];
    }
    set frameIdx(t) {
      this._arena.setFrameIdx(this.idx, t);
    }
    get frame() {
      return this._arena.srcFrame[this.idx];
    }
    set frame(t) {
      this.setFrame(t);
    }
    get uvX() {
      return this._arena.uvX[this.idx];
    }
    set uvX(t) {
      this._arena.setUvX(this.idx, t);
    }
    get uvY() {
      return this._arena.uvY[this.idx];
    }
    set uvY(t) {
      this._arena.setUvY(this.idx, t);
    }
    get uvW() {
      return this._arena.uvW[this.idx];
    }
    set uvW(t) {
      this._arena.setUvW(this.idx, t);
    }
    get uvH() {
      return this._arena.uvH[this.idx];
    }
    set uvH(t) {
      this._arena.setUvH(this.idx, t);
    }
    get asset() {
      return this._arena.assetRef[this.idx];
    }
    get texture() {
      var t;
      return ((t = this._arena.assetRef[this.idx]) == null ? void 0 : t.key) ?? '';
    }
    setTextureByKey(t, e, i = 0) {
      var r;
      const s = (r = t.textures) == null ? void 0 : r.get(e);
      return this.setTexture(s ?? null, i);
    }
    setTexture(t, e = 0) {
      const i = this.idx,
        s = (t == null ? void 0 : t.textureAsset) ?? t;
      return (
        (this._arena.assetRef[i] = s),
        this._arena.setFrameIdx(i, (s == null ? void 0 : s.layerIndex) ?? 0),
        s && this._arena.setTint(i, (this._arena.tint[i] & 16777215) | 4278190080),
        this.setFrame(e),
        this
      );
    }
    getFrameSize(t) {
      const e = this.idx,
        i = this._arena.assetRef[e],
        s = (i == null ? void 0 : i.textureAsset) ?? i;
      if (s != null) {
        const r = s.frameWidth,
          a = s.frameHeight;
        if (r !== void 0 && a !== void 0 && r > 0 && a > 0) return (t[0] = r), (t[1] = a), this;
        const h = s.width,
          o = s.height;
        if (h !== void 0 && o !== void 0 && h > 0 && o > 0) return (t[0] = h), (t[1] = o), this;
      }
      return (t[0] = O), (t[1] = O), this;
    }
    setFrame(t) {
      const e = this.idx,
        i = this._arena.assetRef[e],
        s = i == null ? void 0 : i.frames,
        r = Se;
      if ((this.getFrameSize(r), !s || s.length === 0))
        return (
          (this._arena.uvW[e] === 0 || this._arena.uvH[e] === 0) &&
            this._arena.setUv4(e, 0, 0, 1, 1),
          this._arena.setFrameSize(e, r[0], r[1]),
          this
        );
      const a = typeof t == 'number' ? t : 0;
      if (a >= 0 && a < s.length) {
        this._arena.srcFrame[e] = a;
        const h = s[a];
        this._arena.setUv4(e, h.uvX, h.uvY, h.uvW, h.uvH), this._arena.setFrameSize(e, r[0], r[1]);
      }
      return this;
    }
    setFlipX(t) {
      return this._arena.setFacing(this.idx, t ? -1 : 1), this;
    }
    get flipX() {
      return this._arena.facing[this.idx] < 0;
    }
    set flipX(t) {
      this._arena.setFacing(this.idx, t ? -1 : 1);
    }
    toggleFlipX() {
      return this._arena.setFacing(this.idx, this._arena.facing[this.idx] < 0 ? 1 : -1), this;
    }
    setFlipY(t) {
      const e = this.idx,
        i = Math.abs(this._arena.scaleY[e]) || 1;
      return this._arena.setScaleY(e, t ? -i : i), this;
    }
    get flipY() {
      return this._arena.scaleY[this.idx] < 0;
    }
    set flipY(t) {
      this.setFlipY(t);
    }
    toggleFlipY() {
      return this.setFlipY(!this.flipY), this;
    }
    getBounds(t) {
      const e = this.x,
        i = this.y,
        s = this.displayWidth * 0.5,
        r = this.displayHeight * 0.5;
      return (t.x = e - s), (t.y = i - r), (t.width = s * 2), (t.height = r * 2), this;
    }
    getTopLeft(t) {
      return this.getBounds(U), (t.x = U.x), (t.y = U.y), this;
    }
    getCenter(t) {
      return (t.x = this.x), (t.y = this.y), this;
    }
    getBottomRight(t) {
      return this.getBounds(U), (t.x = U.x + U.width), (t.y = U.y + U.height), this;
    }
    resetFlip() {
      const t = this.idx;
      return (
        this._arena.setFacing(t, 1),
        this._arena.setScaleY(t, Math.abs(this._arena.scaleY[t]) || 1),
        this
      );
    }
    setFlip(t, e) {
      return (this.flipX = t), e !== void 0 && this.setFlipY(e), this;
    }
    setTint(t) {
      let e = t;
      if (!(t & 4278190080)) {
        const i = (t >> 16) & 255,
          s = (t >> 8) & 255,
          r = t & 255;
        e = (255 << 24) | (r << 16) | (s << 8) | i;
      }
      return this._arena.setTint(this.idx, e), this;
    }
    get tint() {
      const t = this._arena.tint[this.idx],
        e = t & 255,
        i = (t >> 8) & 255,
        s = (t >> 16) & 255;
      return (e << 16) | (i << 8) | s;
    }
    set tint(t) {
      this.setTint(t);
    }
    setTintFill(t, e) {
      return (
        this.setTint(t),
        e !== void 0 && this.setAlpha(e),
        this._arena.setTintMode(this.idx, 1),
        this
      );
    }
    clearTint() {
      const t = this.idx,
        e = (this._arena.tint[t] >>> 24) & 255;
      return this._arena.setTint(t, (e << 24) | 16777215), this;
    }
    get alpha() {
      return ((this._arena.tint[this.idx] >>> 24) & 255) / 255;
    }
    set alpha(t) {
      const e = Math.max(0, Math.min(1, t)),
        i = Math.round(e * 255),
        s = this.idx;
      this._arena.setTint(s, ((this._arena.tint[s] & 16777215) | (i << 24)) >>> 0);
    }
    setAlpha(t) {
      return (this.alpha = t), this;
    }
    clearAlpha() {
      return this.setAlpha(1);
    }
    setInteractive(t, e) {
      const i = this.idx;
      return (
        (this._arena.interactive[i] = 1),
        (this._arena.hitWidth[i] = t ?? 0),
        (this._arena.hitHeight[i] = e ?? 0),
        this
      );
    }
    get interactive() {
      return this._arena.interactive[this.idx] === 1;
    }
    get hitWidth() {
      return this._arena.hitWidth[this.idx];
    }
    get hitHeight() {
      return this._arena.hitHeight[this.idx];
    }
    get parentId() {
      return this._arena.parentId[this.idx];
    }
    setParentId(t) {
      return this._arena.setParentId(this.id, t), this;
    }
    play(t, e = !1) {
      var i;
      return (i = this._arena.animTracker) == null || i.play(this.id, t, e), this;
    }
    get anims() {
      var t;
      return ((t = this._arena.animTracker) == null ? void 0 : t.getAnimState(this.id)) ?? null;
    }
    get body() {
      var t, e;
      return ((e = (t = this._arena).bodyFactory) == null ? void 0 : e.call(t, this.id)) ?? null;
    }
    playReverse(t, e = !1) {
      var i;
      return (
        ((i = this._arena.animTracker) == null ? void 0 : i.playReverse(this.id, t, e)) ?? null
      );
    }
    stop() {
      var t;
      return (t = this._arena.animTracker) == null || t.stop(this.id), this;
    }
    destroy() {
      this._arena.free(this.id);
    }
    get destroyed() {
      return this._arena.idToIndex[this.id] < 0;
    }
  },
  vt = class {
    constructor() {
      n(this, '_items', []);
      n(this, '_alive', !0);
      n(this, '_visible', !0);
      n(this, '_onAdd', null);
    }
    add(t) {
      var e;
      if (!this._alive) return !1;
      for (let i = 0; i < this._items.length; i++) if (this._items[i] === t) return !1;
      return this._items.push(t), (e = this._onAdd) == null || e.call(this, t), !0;
    }
    setOnAddHook(t) {
      return (this._onAdd = t), this;
    }
    addMultiple(t) {
      let e = 0;
      for (let i = 0; i < t.length; i++) this.add(t[i]) && e++;
      return e;
    }
    remove(t) {
      const e = this._items.indexOf(t);
      if (e < 0) return !1;
      const i = this._items.length - 1;
      return (this._items[e] = this._items[i]), this._items.pop(), !0;
    }
    removeAll() {
      this._items.length = 0;
    }
    getAt(t) {
      return t < 0 || t >= this._items.length ? null : this._items[t];
    }
    getAll(t) {
      const e = this._items.length;
      for (let i = 0; i < e; i++) t[i] = this._items[i];
      return e;
    }
    getLength() {
      return this._items.length;
    }
    get length() {
      return this._items.length;
    }
    contains(t) {
      return this._items.indexOf(t) >= 0;
    }
    getFirst() {
      return this._items.length > 0 ? this._items[0] : null;
    }
    getLast() {
      const t = this._items.length;
      return t > 0 ? this._items[t - 1] : null;
    }
    forEach(t) {
      const e = this._items.length;
      for (let i = 0; i < e; i++) t(this._items[i], i);
    }
    forEachInto(t, e) {
      const i = this.getAll(t);
      for (let s = 0; s < i; s++) e(t[s], s);
      return i;
    }
    get alive() {
      return this._alive;
    }
    set alive(t) {
      this._alive = t;
    }
    get visible() {
      return this._visible;
    }
    set visible(t) {
      this._visible = t;
    }
    runChildUpdate(t) {
      this._alive && this.forEach(t);
    }
  },
  P = {
    Rectangle: 0,
    Circle: 1,
    Ellipse: 2,
    Triangle: 3,
    Star: 4,
    RoundRect: 5,
    Line: 6,
    Grid: 7,
    IsoTriangle: 8,
    IsoDiamond: 9,
    Quad: 10,
    Arc: 11,
  },
  Pe = 4,
  Ce = '__shape:',
  Be = 512,
  Bt = class {
    constructor(t, e, i = 4096) {
      n(this, 'arena');
      n(this, 'registerTexture');
      n(this, 'capacity');
      n(this, 'kind');
      n(this, 'param0');
      n(this, 'param1');
      n(this, 'param2');
      n(this, 'param3');
      n(this, 'ids');
      n(this, '_count', 0);
      n(this, '_baked', new Map());
      (this.arena = t),
        (this.registerTexture = e),
        (this.capacity = i),
        (this.kind = new Uint8Array(i)),
        (this.param0 = new Float32Array(i)),
        (this.param1 = new Float32Array(i)),
        (this.param2 = new Float32Array(i)),
        (this.param3 = new Float32Array(i)),
        (this.ids = new Int32Array(i).fill(-1));
    }
    get count() {
      return this._count;
    }
    getKind(t) {
      return t >= 0 && t < this._count ? this.kind[t] : -1;
    }
    getParams(t, e) {
      return t < 0 || t >= this._count
        ? 0
        : ((e[0] = this.param0[t]),
          (e[1] = this.param1[t]),
          (e[2] = this.param2[t]),
          (e[3] = this.param3[t]),
          Pe);
    }
    add(t, e, i, s = 0, r = 0, a = 16777215, h = 1) {
      if (this._count >= this.capacity)
        return console.warn('ShapeManager: シェイプ数が上限に達しました。'), -1;
      const o = Math.max(1, Math.round(e)),
        u = Math.max(1, Math.round(i)),
        l = `${t}:${o}:${u}:${s}:${r}`,
        d = this._bake(l, t, o, u, s, r),
        c = this.arena.allocate();
      if (c === -1) return -1;
      const f = this.arena.idToIndex[c],
        _ = this._count++;
      return (
        (this.kind[_] = t),
        (this.param0[_] = e),
        (this.param1[_] = i),
        (this.param2[_] = s),
        (this.param3[_] = r),
        (this.ids[_] = c),
        this.arena.setFrameSize(f, o, u, !1),
        this.arena.setScale(f, 1, 1),
        d && ((this.arena.assetRef[f] = d), this.arena.setFrameIdx(f, d.layerIndex ?? 0)),
        this.arena.setTint(
          f,
          (Math.round(Math.max(0, Math.min(1, h)) * 255) << 24) | (a & 16777215),
        ),
        _
      );
    }
    remove(t) {
      if (t < 0 || t >= this._count) return !1;
      const e = this.ids[t];
      return e >= 0 && (this.arena.free(e), (this.ids[t] = -1)), !0;
    }
    destroy() {
      for (let t = 0; t < this._count; t++) this.remove(t);
      (this._count = 0), this._baked.clear();
    }
    _bake(t, e, i, s, r, a) {
      const h = this._baked.get(t);
      if (h !== void 0) return h;
      if (this._baked.size >= Be) return null;
      const o = document.createElement('canvas');
      (o.width = i), (o.height = s);
      const u = o.getContext('2d');
      if (!u) return null;
      u.clearRect(0, 0, i, s),
        (u.fillStyle = '#ffffff'),
        (u.strokeStyle = '#ffffff'),
        this._draw(u, e, i, s, r, a);
      const l = this.registerTexture(`${Ce}${t}`, o);
      return this._baked.set(t, l), l;
    }
    _draw(t, e, i, s, r, a) {
      switch (e) {
        case P.Rectangle:
          t.fillRect(0, 0, i, s);
          break;
        case P.Circle:
          t.beginPath(), t.arc(i / 2, s / 2, Math.min(i, s) / 2, 0, Math.PI * 2), t.fill();
          break;
        case P.Ellipse:
          t.beginPath(), t.ellipse(i / 2, s / 2, i / 2, s / 2, 0, 0, Math.PI * 2), t.fill();
          break;
        case P.Triangle:
          this._fillPolygon(t, [i / 2, 0, i, s, 0, s]);
          break;
        case P.IsoTriangle:
          this._fillPolygon(t, [0, 0, i, s / 2, 0, s]);
          break;
        case P.IsoDiamond:
          this._fillPolygon(t, [i / 2, 0, i, s / 2, i / 2, s, 0, s / 2]);
          break;
        case P.Quad:
          this._fillPolygon(t, [r, 0, i - r, 0, i, s - r, r, s]);
          break;
        case P.Star: {
          const h = Math.max(3, Math.floor(r) || 5),
            o = a > 0 ? a : 0.5;
          this._fillPolygon(t, this._starPath(i, s, h, o));
          break;
        }
        case P.RoundRect: {
          const h = Math.min(r > 0 ? r : 8, Math.min(i, s) / 2);
          t.beginPath(), t.roundRect(0, 0, i, s, h), t.fill();
          break;
        }
        case P.Line: {
          const h = Math.max(1, Math.round(r > 0 ? r : 1));
          (t.lineWidth = h), t.beginPath(), t.moveTo(0, s / 2), t.lineTo(i, s / 2), t.stroke();
          break;
        }
        case P.Grid: {
          const h = Math.max(1, Math.floor(r) || 2),
            o = Math.max(1, Math.round(a > 0 ? a : 1));
          (t.lineWidth = o), t.beginPath();
          for (let u = 1; u < h; u++) {
            const l = (i / h) * u;
            t.moveTo(l, 0), t.lineTo(l, s);
            const d = (s / h) * u;
            t.moveTo(0, d), t.lineTo(i, d);
          }
          t.stroke();
          break;
        }
        case P.Arc: {
          const h = Math.max(1, Math.round(r > 0 ? r : 2));
          (t.lineWidth = h),
            t.beginPath(),
            t.arc(i / 2, s / 2, Math.max(0, Math.min(i, s) / 2 - h / 2), 0, Math.PI * 2),
            t.stroke();
          break;
        }
        default:
          t.fillRect(0, 0, i, s);
          break;
      }
    }
    _fillPolygon(t, e) {
      const i = e.length / 2;
      if (!(i < 3)) {
        t.beginPath(), t.moveTo(e[0], e[1]);
        for (let s = 1; s < i; s++) t.lineTo(e[s * 2], e[s * 2 + 1]);
        t.closePath(), t.fill();
      }
    }
    _starPath(t, e, i, s) {
      const r = t / 2,
        a = e / 2,
        h = t / 2,
        o = e / 2,
        u = [];
      for (let l = 0; l < i * 2; l++) {
        const d = l % 2 === 0 ? 1 : s,
          c = (Math.PI * l) / i - Math.PI / 2;
        u.push(r + Math.cos(c) * h * d, a + Math.sin(c) * o * d);
      }
      return u;
    }
  },
  Me = class {
    constructor(t, e) {
      n(this, 'layerIndex');
      n(this, '_map');
      n(this, '_uvs');
      n(this, '_advances');
      n(this, '_size');
      var o;
      (this.layerIndex = (e == null ? void 0 : e.layerIndex) ?? 0),
        (this._size = t.size > 0 ? t.size : 1);
      const i = t.chars;
      (this._map = new Map()),
        (this._uvs = new Float32Array(i.length * 4)),
        (this._advances = new Float32Array(i.length));
      const s = (o = e == null ? void 0 : e.frames) == null ? void 0 : o[0],
        r = s !== void 0 && s.uvW > 0,
        a = (e == null ? void 0 : e.width) ?? 0,
        h = (e == null ? void 0 : e.height) ?? 0;
      for (let u = 0; u < i.length; u++) {
        const l = i[u];
        this._map.set(l.id, u),
          r && a > 0 && h > 0
            ? ((this._uvs[u * 4] = l.x / a),
              (this._uvs[u * 4 + 1] = l.y / h),
              (this._uvs[u * 4 + 2] = l.width / a),
              (this._uvs[u * 4 + 3] = l.height / h))
            : ((this._uvs[u * 4] = 0),
              (this._uvs[u * 4 + 1] = 0),
              (this._uvs[u * 4 + 2] = 0),
              (this._uvs[u * 4 + 3] = 0)),
          (this._advances[u] = l.xadvance / this._size);
      }
    }
    lookup(t, e) {
      const i = this._map.get(t);
      if (i === void 0) return (e[0] = 0), (e[1] = 0), (e[2] = 0), (e[3] = 0), 0;
      const s = i * 4;
      return (
        (e[0] = this._uvs[s]),
        (e[1] = this._uvs[s + 1]),
        (e[2] = this._uvs[s + 2]),
        (e[3] = this._uvs[s + 3]),
        this._advances[i]
      );
    }
  },
  Ye = -1,
  Xe = class {
    constructor(t, e) {
      n(this, 'id');
      n(this, '_arena');
      (this.id = t), (this._arena = e);
    }
    get x() {
      const t = this._index;
      return t < 0 ? 0 : this._arena.parentId[t] >= 0 ? this._arena.worldX[t] : this._arena.posX[t];
    }
    set x(t) {
      const e = this._index;
      e < 0 ||
        (this._arena.parentId[e] >= 0
          ? ((this._arena.localX[e] = t), (this._arena.dirtyHierarchy = !0))
          : this._arena.setPosX(e, t));
    }
    get y() {
      const t = this._index;
      return t < 0 ? 0 : this._arena.parentId[t] >= 0 ? this._arena.worldY[t] : this._arena.posY[t];
    }
    set y(t) {
      const e = this._index;
      e < 0 ||
        (this._arena.parentId[e] >= 0
          ? ((this._arena.localY[e] = t), (this._arena.dirtyHierarchy = !0))
          : this._arena.setPosY(e, t));
    }
    get worldX() {
      const t = this._index;
      return t < 0 ? 0 : this._arena.worldX[t];
    }
    get worldY() {
      const t = this._index;
      return t < 0 ? 0 : this._arena.worldY[t];
    }
    get localX() {
      const t = this._index;
      return t < 0 ? 0 : this._arena.localX[t];
    }
    set localX(t) {
      const e = this._index;
      e < 0 || ((this._arena.localX[e] = t), (this._arena.dirtyHierarchy = !0));
    }
    get localY() {
      const t = this._index;
      return t < 0 ? 0 : this._arena.localY[t];
    }
    set localY(t) {
      this._index < 0 || ((this._arena.localY[this._index] = t), (this._arena.dirtyHierarchy = !0));
    }
    setPosition(t, e) {
      return (this.x = t), (this.y = e), this;
    }
    setSize(t, e) {
      const i = this._index;
      return i < 0 ? this : (this._arena.setFrameSize(i, t, e), this);
    }
    get width() {
      const t = this._index;
      return t < 0 ? 0 : this._arena.frameWidth[t];
    }
    set width(t) {
      const e = this._index;
      e >= 0 && this._arena.setFrameSize(e, t, this._arena.frameHeight[e]);
    }
    get height() {
      const t = this._index;
      return t < 0 ? 0 : this._arena.frameHeight[t];
    }
    set height(t) {
      const e = this._index;
      e >= 0 && this._arena.setFrameSize(e, this._arena.frameWidth[e], t);
    }
    add(t) {
      const e = this._arena.idToIndex[t],
        i = this._index;
      if (e < 0 || i < 0) return this;
      if (t === this.id) return this;
      const s = this._arena.posX[e],
        r = this._arena.posY[e],
        a = this._arena.parentId[i] >= 0 ? this._arena.worldX[i] : this._arena.posX[i],
        h = this._arena.parentId[i] >= 0 ? this._arena.worldY[i] : this._arena.posY[i];
      return (
        this._arena.setParentId(t, this.id),
        (this._arena.localX[e] = s - a),
        (this._arena.localY[e] = r - h),
        (this._arena.dirtyHierarchy = !0),
        this
      );
    }
    remove(t) {
      const e = this._arena.idToIndex[t];
      if (e < 0 || this._arena.parentId[e] !== this.id) return !1;
      const i = this.x,
        s = this.y;
      return (
        this._arena.setPosX(e, this._arena.worldX[e]),
        this._arena.setPosY(e, this._arena.worldY[e]),
        (this._arena.localX[e] = this._arena.posX[e] - i),
        (this._arena.localY[e] = this._arena.posY[e] - s),
        (this._arena.parentId[e] = Ye),
        (this._arena.dirtyHierarchy = !0),
        !0
      );
    }
    collectChildrenInto(t) {
      let e = 0;
      const i = this._arena.activeCount;
      for (let s = 0; s < i; s++)
        if (this._arena.parentId[s] === this.id) {
          if (e >= t.length) break;
          t[e++] = this._arena.indexToId[s];
        }
      return e;
    }
    getChildCount() {
      let t = 0;
      const e = this._arena.activeCount;
      for (let i = 0; i < e; i++) this._arena.parentId[i] === this.id && t++;
      return t;
    }
    getBounds(t) {
      return (t[0] = this.x), (t[1] = this.y), (t[2] = this.width), (t[3] = this.height), t;
    }
    get destroyed() {
      return this._index < 0;
    }
    get _index() {
      return this._arena.idToIndex[this.id];
    }
  },
  lt = class {
    constructor(t, e, i, s, r) {
      n(this, '_text');
      n(this, 'x');
      n(this, 'y');
      n(this, '_arena');
      n(this, '_style');
      n(this, '_ids');
      n(this, '_count', 0);
      n(this, '_uvScratch', new Float32Array(4));
      n(this, '_glyphSource', null);
      n(this, '_layerIndex', 0);
      n(this, '_originX', 0);
      n(this, '_originY', 0);
      n(this, '_lineStarts', new Int32Array(8));
      n(this, '_lineEnds', new Int32Array(8));
      n(this, '_lineCount', 1);
      n(this, '_advances', new Float32Array(8));
      n(this, '_uvs', new Float32Array(8 * 4));
      n(this, '_laidOutText', '');
      n(this, '_laidOutWrap', -1);
      n(this, '_glyphTotal', 0);
      (this.x = t),
        (this.y = e),
        (this._text = i),
        (this._style = s),
        (this._arena = r),
        (this._originX = t),
        (this._originY = e),
        (this._ids = new Int32Array(16)),
        this.rebuild();
    }
    setGlyphSource(t) {
      (this._glyphSource = t),
        (this._layerIndex = (t == null ? void 0 : t.layerIndex) ?? 0),
        (this._laidOutWrap = -1),
        this.rebuild();
    }
    rebuild() {
      this._layout();
      const t = this._glyphTotal;
      if (t > this._ids.length) {
        let v = this._ids.length;
        for (; v < t; ) v *= 2;
        const m = new Int32Array(v);
        m.set(this._ids), (this._ids = m);
      }
      for (let v = t; v < this._count; v++) this._arena.free(this._ids[v]);
      const e = this._style.fontSize ?? 16,
        i = this._style.color ?? 4294967295,
        s = this._style.monospace === !0,
        r = this._style.resolution ?? 1,
        a = r > 0 ? r : 1,
        h = this._style.padding;
      let o = 0,
        u = 0;
      typeof h == 'number' ? ((o = h), (u = h)) : h && ((o = h.x ?? 0), (u = h.y ?? 0));
      const l = this._style.lineSpacing ?? 0,
        d = this._style.align ?? 'left',
        c = this._originX + o,
        f = e + l;
      let _ = c;
      const g = this._arena,
        p = this._glyphSource;
      let y = 0;
      for (let v = 0; v < this._lineCount; v++) {
        const m = this._lineStarts[v],
          F = this._lineEnds[v],
          w = F - m;
        let x = 0;
        for (let T = 0; T < w; T++) x += this._advances[m + T];
        const A = this._style.wordWrapWidth ?? 0;
        let S = c;
        d === 'center' && A > 0
          ? (S = c + (A - x) * 0.5)
          : d === 'right' && A > 0 && (S = c + (A - x)),
          (_ = S);
        const b = this._originY + u + v * f;
        for (let T = m; T < F; T++, y++) {
          let C;
          if (y < this._count) {
            if (((C = this._ids[y]), g.idToIndex[C] < 0)) {
              if (((C = g.allocate()), C === -1)) break;
              this._ids[y] = C;
            }
          } else {
            if (((C = g.allocate()), C === -1)) break;
            this._ids[y] = C;
          }
          const M = g.idToIndex[C];
          if (p) {
            const N = T * 4;
            g.setUv4(M, this._uvs[N], this._uvs[N + 1], this._uvs[N + 2], this._uvs[N + 3]);
          } else g.setUv4(M, 0, 0, 1, 1);
          g.setFrameIdx(M, this._layerIndex), (g.srcFrame[M] = 0), g.setIsText(M, 1);
          const V = (s ? e * 0.5 : e) * a;
          g.setPosX(M, _),
            g.setPosY(M, b),
            g.setFrameSize(M, V, V),
            g.setScale(M, 1),
            g.setTint(M, i),
            (_ += this._advances[T]);
        }
      }
      (this._count = y), (g.hasText = !0);
    }
    _layout() {
      const t = this._style.wordWrapWidth ?? 0,
        e = t;
      if (this._laidOutText === this._text && this._laidOutWrap === e) return;
      (this._laidOutText = this._text), (this._laidOutWrap = e);
      const i = this._text;
      let s = 1;
      for (let p = 0; p < i.length; p++) i.charCodeAt(p) === 10 && s++;
      if (this._lineStarts.length < s) {
        let p = this._lineStarts.length;
        for (; p < s; ) p *= 2;
        (this._lineStarts = new Int32Array(p)), (this._lineEnds = new Int32Array(p));
      }
      const r = this._style.fontSize ?? 16,
        a = this._style.letterSpacing ?? 0,
        h = r * 0.5,
        o = this._glyphSource,
        u = this._uvScratch;
      if (this._advances.length < i.length) {
        let p = this._advances.length;
        for (; p < i.length; ) p *= 2;
        (this._advances = new Float32Array(p)), (this._uvs = new Float32Array(p * 4));
      }
      let l = 0,
        d = 0,
        c = 0,
        f = -1;
      const _ = (p) => {
        if (l >= this._lineStarts.length) {
          const y = this._lineStarts.length * 2,
            v = new Int32Array(y);
          v.set(this._lineStarts), (this._lineStarts = v);
          const m = new Int32Array(y);
          m.set(this._lineEnds), (this._lineEnds = m);
        }
        (this._lineStarts[l] = d), (this._lineEnds[l] = p), l++, (d = p), (c = 0), (f = -1);
      };
      for (let p = 0; p < i.length; p++) {
        const y = i.charCodeAt(p);
        if (y === 10) {
          _(p), (d = p + 1);
          continue;
        }
        let v = h + a;
        if (o) {
          const m = o.lookup(y, u),
            F = p * 4;
          (this._uvs[F] = u[0]),
            (this._uvs[F + 1] = u[1]),
            (this._uvs[F + 2] = u[2]),
            (this._uvs[F + 3] = u[3]),
            m > 0 && (v = m * r + a);
        } else {
          const m = p * 4;
          (this._uvs[m] = 0),
            (this._uvs[m + 1] = 0),
            (this._uvs[m + 2] = 1),
            (this._uvs[m + 3] = 1);
        }
        (this._advances[p] = v),
          y === 32 && (f = p),
          (c += v),
          t > 0 && c > t && f > d && (_(f), (p = f), (c = 0), (f = -1));
      }
      _(i.length), (this._lineCount = l);
      let g = 0;
      for (let p = 0; p < l; p++) g += this._lineEnds[p] - this._lineStarts[p];
      this._glyphTotal = g;
    }
    get text() {
      return this._text;
    }
    set text(t) {
      this._text !== t && ((this._text = t), this.rebuild());
    }
    setPosition(t, e) {
      (this._originX = t), (this._originY = e), (this.x = t), (this.y = e), this.rebuild();
    }
    get glyphCount() {
      return this._count;
    }
    destroy() {
      for (let t = 0; t < this._count; t++) this._arena.free(this._ids[t]);
      this._count = 0;
    }
  },
  Z = 32,
  Ie = 126,
  De = class {
    constructor(t, e, i = {}) {
      n(this, 'layerIndex');
      n(this, 'glyphCount');
      n(this, 'cellWidth');
      n(this, 'cellHeight');
      n(this, 'fontSize');
      n(this, '_uvX');
      n(this, '_uvY');
      n(this, '_uvW');
      n(this, '_uvH');
      n(this, '_advance');
      n(this, '_pixelAdvance');
      n(this, 'canvas');
      const s = i.fontSize ?? 32,
        r = i.padding ?? 2,
        a = i.spread ?? 4,
        h = i.fontFamily ?? 'sans-serif';
      this.glyphCount = Ie - Z + 1;
      const o = Math.ceil(Math.sqrt(this.glyphCount)),
        u = Math.ceil(this.glyphCount / o);
      (this.cellWidth = 1 / o),
        (this.cellHeight = 1 / u),
        (this.fontSize = s),
        (this._uvX = new Float32Array(this.glyphCount)),
        (this._uvY = new Float32Array(this.glyphCount)),
        (this._uvW = new Float32Array(this.glyphCount)),
        (this._uvH = new Float32Array(this.glyphCount)),
        (this._advance = new Float32Array(this.glyphCount)),
        (this._pixelAdvance = new Float32Array(this.glyphCount));
      const l = s * 2,
        d = o * l,
        c = u * l,
        f = document.createElement('canvas');
      (f.width = d), (f.height = c);
      const _ = f.getContext('2d');
      if (!_) throw new Error('Failed to acquire 2d context for font atlas');
      (_.fillStyle = '#000000'),
        _.fillRect(0, 0, d, c),
        (_.fillStyle = '#ffffff'),
        (_.textAlign = 'left'),
        (_.textBaseline = 'alphabetic'),
        (_.font = `${s}px ${h}`);
      for (let x = 0; x < this.glyphCount; x++) {
        const A = Z + x,
          S = x % o,
          b = (x / o) | 0,
          T = S * l,
          C = b * l,
          M = String.fromCharCode(A);
        _.fillText(M, T + r, C + l - r);
        const V = _.measureText(M),
          N = V.width / s;
        (this._advance[x] = N),
          (this._pixelAdvance[x] = V.width),
          (this._uvX[x] = (T + r) / d),
          (this._uvY[x] = 1 - (C + l - r) / c),
          (this._uvW[x] = (l - r * 2) / d),
          (this._uvH[x] = (l - r * 2) / c);
      }
      const g = _.getImageData(0, 0, d, c),
        p = g.data,
        y = d,
        v = c,
        m = new Float32Array(y * v),
        F = new Float32Array(y * v);
      m.fill(1e9), F.fill(1e9);
      for (let x = 0; x < v; x++)
        for (let A = 0; A < y; A++) {
          const S = x * y + A;
          p[S * 4] > 127 ? (m[S] = 0) : (F[S] = 0);
        }
      Mt(m, y, v), Mt(F, y, v);
      for (let x = 0; x < y * v; x++) {
        const S = 0.5 - (m[x] - F[x]) / (a * 2),
          b = Math.max(0, Math.min(255, Math.round(S * 255)));
        (p[x * 4] = b), (p[x * 4 + 1] = b), (p[x * 4 + 2] = b), (p[x * 4 + 3] = 255);
      }
      _.putImageData(g, 0, 0);
      const w = t.uploadTexture(e, f);
      (this.layerIndex = (w == null ? void 0 : w.layerIndex) ?? 0), (this.canvas = f);
    }
    lookup(t, e) {
      const i = t - Z;
      return i < 0 || i >= this.glyphCount
        ? ((e[0] = 0), (e[1] = 0), (e[2] = 0), (e[3] = 0), 0)
        : ((e[0] = this._uvX[i]),
          (e[1] = this._uvY[i]),
          (e[2] = this._uvW[i]),
          (e[3] = this._uvH[i]),
          this._advance[i]);
    }
    advanceOf(t) {
      const e = t - Z;
      return e < 0 || e >= this.glyphCount ? 0 : this._advance[e];
    }
    pixelAdvanceOf(t) {
      const e = t - Z;
      return e < 0 || e >= this.glyphCount ? 0 : this._pixelAdvance[e];
    }
  };
function Mt(t, e, i) {
  const r = Math.SQRT2;
  for (let a = 0; a < i; a++)
    for (let h = 0; h < e; h++) {
      const o = a * e + h;
      let u = t[o];
      a > 0 &&
        (h > 0 && (u = Math.min(u, t[o - e - 1] + r)),
        (u = Math.min(u, t[o - e] + 1)),
        h < e - 1 && (u = Math.min(u, t[o - e + 1] + r))),
        h > 0 && (u = Math.min(u, t[o - 1] + 1)),
        (t[o] = u);
    }
  for (let a = i - 1; a >= 0; a--)
    for (let h = e - 1; h >= 0; h--) {
      const o = a * e + h;
      let u = t[o];
      a < i - 1 &&
        (h < e - 1 && (u = Math.min(u, t[o + e + 1] + r)),
        (u = Math.min(u, t[o + e] + 1)),
        h > 0 && (u = Math.min(u, t[o + e - 1] + r))),
        h < e - 1 && (u = Math.min(u, t[o + 1] + 1)),
        (t[o] = u);
    }
}
var ct = -1,
  ke = class {
    constructor(t, e) {
      n(this, 'slot');
      n(this, '_manager');
      (this.slot = t), (this._manager = e);
    }
    get isValid() {
      return this.slot !== ct && this._manager.isSlotActive(this.slot);
    }
    get isPlaying() {
      return this._manager.isSlotActive(this.slot);
    }
    get isPaused() {
      return this._manager.isSlotPaused(this.slot);
    }
    get isPlayingReverse() {
      return this._manager.isSlotReverse(this.slot);
    }
    get currentFrame() {
      return this._manager.getSlotFrameIndex(this.slot);
    }
    get totalFrames() {
      return this._manager.getSlotFrameLength(this.slot);
    }
    get progress() {
      return this._manager.getSlotProgress(this.slot);
    }
    getProgress() {
      return this._manager.getSlotProgress(this.slot);
    }
    setDirection(t) {
      return this._manager.setSlotReverse(this.slot, t), this;
    }
    pause() {
      return this._manager.pauseSlot(this.slot), this;
    }
    resume() {
      return this._manager.resumeSlot(this.slot), this;
    }
    stop() {
      return this.slot !== ct && (this._manager.stopSlot(this.slot), (this.slot = ct)), this;
    }
    stopIfPlaying() {
      return this.isPlaying && this.stop(), this;
    }
  },
  Re = 256,
  Ge = class {
    constructor(t, e = 1e4) {
      n(this, 'capacity');
      n(this, '_activeCount', 0);
      n(this, '_animations', new Map());
      n(this, '_animKeyToIndex', new Map());
      n(this, '_nextAnimIndex', 0);
      n(this, 'active');
      n(this, 'entityId');
      n(this, 'animId');
      n(this, 'currentFrameIdx');
      n(this, 'repeatCount');
      n(this, 'elapsed');
      n(this, 'paused');
      n(this, 'reverse');
      n(this, 'refFramesLength');
      n(this, 'refFrameDuration');
      n(this, 'refRepeat');
      n(this, 'refFramesPtr');
      n(this, '_flatFrames');
      n(this, '_flatFramesCount', 0);
      n(this, 'freeList');
      n(this, 'freeListHead', 0);
      n(this, '_handles', []);
      n(this, '_arena');
      (this._arena = t),
        (this.capacity = e),
        (this.active = new Uint8Array(e)),
        (this.entityId = new Int32Array(e)),
        (this.animId = new Int32Array(e)),
        (this.currentFrameIdx = new Int32Array(e)),
        (this.repeatCount = new Int32Array(e)),
        (this.elapsed = new Float32Array(e)),
        (this.paused = new Uint8Array(e)),
        (this.reverse = new Uint8Array(e)),
        (this.refFramesLength = new Int32Array(e)),
        (this.refFrameDuration = new Float32Array(e)),
        (this.refRepeat = new Int32Array(e)),
        (this.refFramesPtr = new Int32Array(e)),
        (this._flatFrames = new Int32Array(1e5)),
        (this.freeList = new Int32Array(e));
      for (let i = 0; i < e; i++) this.freeList[i] = i;
    }
    create(t) {
      const e = Array.isArray(t) ? t : [t];
      for (const i of e) {
        const s = i.frameRate ?? 24,
          r = { key: i.key, frames: i.frames, frameDuration: 1 / s, repeat: i.repeat ?? 0 };
        this._animations.set(i.key, r);
        const a = this._nextAnimIndex++;
        this._animKeyToIndex.set(i.key, a),
          (this.refFramesLength[a] = r.frames.length),
          (this.refFrameDuration[a] = r.frameDuration),
          (this.refRepeat[a] = r.repeat),
          (this.refFramesPtr[a] = this._flatFramesCount);
        for (let h = 0; h < r.frames.length; h++)
          this._flatFrames[this._flatFramesCount++] = r.frames[h];
      }
    }
    hasKey(t) {
      return this._animKeyToIndex.has(t);
    }
    play(t, e, i = !1) {
      const s = this.getSlot(t);
      return this.playBySlot(s, t, e, i, !1);
    }
    playReverse(t, e, i = !1) {
      const s = this.getSlot(t);
      return this.playBySlot(s, t, e, i, !0);
    }
    getSlot(t) {
      for (let e = 0; e < this.capacity; e++)
        if (this.active[e] === 1 && this.entityId[e] === t) return e;
      return -1;
    }
    playBySlot(t, e, i, s, r) {
      const a = this._animKeyToIndex.get(i);
      if (a === void 0) return console.warn(`Animation key not found: ${i}`), null;
      if (t !== -1 && s) return this._wrap(t);
      if (t === -1) {
        if (this.freeListHead >= this.capacity) return null;
        (t = this.freeList[this.freeListHead++]),
          (this.active[t] = 1),
          this._activeCount++,
          (this.entityId[t] = e);
      }
      (this.animId[t] = a),
        (this.repeatCount[t] = 0),
        (this.elapsed[t] = 0),
        (this.paused[t] = 0),
        (this.reverse[t] = r ? 1 : 0);
      const h = this.refFramesLength[a];
      this.currentFrameIdx[t] = r && h > 0 ? h - 1 : 0;
      const o = this.refFramesPtr[a] + this.currentFrameIdx[t];
      return this._applyFrame(e, this._flatFrames[o]), this._wrap(t);
    }
    _wrap(t) {
      if (t >= this._handles.length)
        for (let e = this._handles.length; e <= t; e++) this._handles.push(new ke(e, this));
      return this._handles[t];
    }
    getAnimState(t) {
      return this._wrap(this.getSlot(t));
    }
    free(t) {
      this.active[t] !== 0 &&
        ((this.active[t] = 0), this._activeCount--, (this.freeList[--this.freeListHead] = t));
    }
    _applyFrame(t, e) {
      const i = this._arena.idToIndex[t];
      if (i < 0) return;
      const s = this._arena.assetRef[i],
        r = s == null ? void 0 : s.frames;
      if (!r || r.length === 0 || e < 0 || e >= r.length) return;
      const a = r[e];
      this._arena.setUv4(i, a.uvX, a.uvY, a.uvW, a.uvH), (this._arena.srcFrame[i] = e);
    }
    update(t) {
      if (this._activeCount !== 0)
        for (let e = 0; e < this.capacity; e++) {
          if (this.active[e] === 0 || this.paused[e] === 1) continue;
          const i = this.entityId[e];
          if (i < 0 || this._arena.idToIndex[i] < 0) {
            this.free(e);
            continue;
          }
          const s = this.animId[e],
            r = this.refFrameDuration[s],
            a = r > 0 ? r : 0;
          this.elapsed[e] += t;
          let h = Re;
          for (; this.elapsed[e] >= a && this.active[e] === 1 && h-- > 0; ) {
            this.elapsed[e] -= a;
            const o = this.refFramesLength[s],
              u = this.reverse[e] === 1;
            let l = !1;
            if (u) {
              if ((this.currentFrameIdx[e]--, this.currentFrameIdx[e] < 0)) {
                const c = this.refRepeat[s];
                c === -1
                  ? (this.currentFrameIdx[e] = o > 0 ? o - 1 : 0)
                  : this.repeatCount[e] < c
                    ? (this.repeatCount[e]++, (this.currentFrameIdx[e] = o > 0 ? o - 1 : 0))
                    : (l = !0);
              }
            } else if ((this.currentFrameIdx[e]++, this.currentFrameIdx[e] >= o)) {
              const c = this.refRepeat[s];
              c === -1
                ? (this.currentFrameIdx[e] = 0)
                : this.repeatCount[e] < c
                  ? (this.repeatCount[e]++, (this.currentFrameIdx[e] = 0))
                  : (l = !0);
            }
            if (l) {
              this.free(e);
              break;
            }
            const d = this.refFramesPtr[s] + this.currentFrameIdx[e];
            this._applyFrame(i, this._flatFrames[d]);
          }
        }
    }
    stop(t) {
      const e = this.getSlot(t);
      e >= 0 && this.free(e);
    }
    isSlotActive(t) {
      return t >= 0 && t < this.capacity && this.active[t] === 1;
    }
    isSlotPaused(t) {
      return this.isSlotActive(t) && this.paused[t] === 1;
    }
    isSlotReverse(t) {
      return this.isSlotActive(t) && this.reverse[t] === 1;
    }
    getSlotFrameIndex(t) {
      return this.isSlotActive(t) ? this.currentFrameIdx[t] : 0;
    }
    getSlotFrameLength(t) {
      return this.isSlotActive(t) ? this.refFramesLength[this.animId[t]] : 0;
    }
    getSlotProgress(t) {
      if (!this.isSlotActive(t)) return 0;
      const e = this.animId[t],
        i = this.refFramesLength[e];
      if (i <= 0) return 0;
      const s = this.refFrameDuration[e],
        r = s > 0 ? this.elapsed[t] / s : 0,
        a = (this.currentFrameIdx[t] + (r > 1 ? 1 : r)) / i;
      return this.reverse[t] === 1 ? (a >= 1 ? 0 : 1 - a) : a > 1 ? 1 : a;
    }
    pauseSlot(t) {
      this.isSlotActive(t) && (this.paused[t] = 1);
    }
    resumeSlot(t) {
      this.isSlotActive(t) && (this.paused[t] = 0);
    }
    setSlotReverse(t, e) {
      this.isSlotActive(t) && (this.reverse[t] = e ? 1 : 0);
    }
    stopSlot(t) {
      this.isSlotActive(t) && this.free(t);
    }
    clear() {
      (this._activeCount = 0),
        (this.freeListHead = 0),
        this.active.fill(0),
        this.paused.fill(0),
        this.reverse.fill(0);
      for (let t = 0; t < this.capacity; t++) this.freeList[t] = t;
    }
  },
  Le = class {
    constructor() {
      n(this, 'fns', []);
      n(this, 'live', []);
      n(this, 'count', 0);
      n(this, 'emitting', 0);
      n(this, 'needsCompact', !1);
    }
    push(t) {
      this.fns.push(t), this.live.push(1), this.count++;
    }
    remove(t) {
      if (this.emitting > 0) {
        for (let e = 0; e < this.fns.length; e++)
          if (this.fns[e] === t && this.live[e] === 1)
            return (this.live[e] = 0), this.count--, (this.needsCompact = !0), !0;
        return !1;
      }
      for (let e = 0; e < this.fns.length; e++)
        if (this.fns[e] === t && this.live[e] === 1)
          return (this.fns[e] = Ue), (this.live[e] = 0), this.count--, this.compact(), !0;
      return !1;
    }
    clear() {
      (this.fns.length = 0), (this.live.length = 0), (this.count = 0), (this.needsCompact = !1);
    }
    compact() {
      if (!this.needsCompact) return;
      let t = 0;
      for (let e = 0; e < this.fns.length; e++)
        this.live[e] === 1 && ((this.fns[t] = this.fns[e]), (this.live[t] = 1), t++);
      (this.fns.length = t), (this.live.length = t), (this.needsCompact = !1);
    }
  },
  Ue = () => {},
  ze = class {
    constructor() {
      n(this, '_map', new Map());
    }
    on(t, e) {
      let i = this._map.get(t);
      return (
        i === void 0 && ((i = new Le()), this._map.set(t, i)),
        i.push(e),
        () => {
          this.off(t, e);
        }
      );
    }
    once(t, e) {
      const i = (...s) => {
        this.off(t, i), e(...s);
      };
      return this.on(t, i);
    }
    off(t, e) {
      const i = this._map.get(t);
      i !== void 0 && (i.remove(e), i.count === 0 && i.emitting === 0 && this._map.delete(t));
    }
    emit(t, ...e) {
      const i = this._map.get(t);
      if (i === void 0 || i.count === 0) return;
      i.emitting++;
      const s = i.fns,
        r = s.length;
      for (let a = 0; a < r; a++) i.live[a] === 1 && s[a](...e);
      this._finishEmit(t, i);
    }
    emit1(t, e) {
      const i = this._map.get(t);
      if (i === void 0 || i.count === 0) return;
      i.emitting++;
      const s = i.fns,
        r = s.length;
      for (let a = 0; a < r; a++) i.live[a] === 1 && s[a](e);
      this._finishEmit(t, i);
    }
    emit2(t, e, i) {
      const s = this._map.get(t);
      if (s === void 0 || s.count === 0) return;
      s.emitting++;
      const r = s.fns,
        a = r.length;
      for (let h = 0; h < a; h++) s.live[h] === 1 && r[h](e, i);
      this._finishEmit(t, s);
    }
    emit3(t, e, i, s) {
      const r = this._map.get(t);
      if (r === void 0 || r.count === 0) return;
      r.emitting++;
      const a = r.fns,
        h = a.length;
      for (let o = 0; o < h; o++) r.live[o] === 1 && a[o](e, i, s);
      this._finishEmit(t, r);
    }
    emit0(t) {
      const e = this._map.get(t);
      if (e === void 0 || e.count === 0) return;
      e.emitting++;
      const i = e.fns,
        s = i.length;
      for (let r = 0; r < s; r++) e.live[r] === 1 && i[r]();
      this._finishEmit(t, e);
    }
    _finishEmit(t, e) {
      e.emitting--, e.emitting === 0 && (e.compact(), e.count === 0 && this._map.delete(t));
    }
    listenerCount(t) {
      const e = this._map.get(t);
      return e === void 0 ? 0 : e.count;
    }
    eventNames() {
      return Array.from(this._map.keys());
    }
    removeAllListeners() {
      this._map.clear();
    }
  },
  Oe = class {
    constructor(t, e) {
      n(this, 'code');
      n(this, '_input');
      (this.code = t), (this._input = e);
    }
    get isDown() {
      return this._input.isKeyPressed(this.code);
    }
    get isJustDown() {
      return this._input.isKeyJustPressed(this.code);
    }
    get isJustUp() {
      return this._input.isKeyJustReleased(this.code);
    }
    get timeDown() {
      return this._input.getKeyTimeDown(this.code);
    }
    get timeUp() {
      return this._input.getKeyTimeUp(this.code);
    }
    get duration() {
      return this._input.getKeyDuration(this.code);
    }
    enableCapture() {}
    removeFrom() {}
    addTo() {}
  },
  We = class {
    constructor(t) {
      n(this, '_input');
      n(this, 'id', 0);
      this._input = t;
    }
    get x() {
      return this._input.pointerX;
    }
    get y() {
      return this._input.pointerY;
    }
    get worldX() {
      return this._input.worldPointerX;
    }
    get worldY() {
      return this._input.worldPointerY;
    }
    get screenX() {
      return this._input.clientX;
    }
    get screenY() {
      return this._input.clientY;
    }
    get pointerId() {
      return this._input.pointerId;
    }
    get movementX() {
      return this._input.pointerX - this._input.prevPointerX;
    }
    get movementY() {
      return this._input.pointerY - this._input.prevPointerY;
    }
    get dx() {
      return this._input.pointerX - this._input.prevPointerX;
    }
    get dy() {
      return this._input.pointerY - this._input.prevPointerY;
    }
    get velocityX() {
      return this._input.pointerVelocityX;
    }
    get velocityY() {
      return this._input.pointerVelocityY;
    }
    get angle() {
      return this._input.pointerAngle;
    }
    get distance() {
      return this._input.pointerDistance;
    }
    get downX() {
      return this._input.downPointerX;
    }
    get downY() {
      return this._input.downPointerY;
    }
    get upX() {
      return this._input.upPointerX;
    }
    get upY() {
      return this._input.upPointerY;
    }
    get isDown() {
      return this._input.isPointerDown();
    }
    get isJustDown() {
      return this._input.isPointerJustPressed();
    }
    get isJustUp() {
      return this._input.isPointerJustReleased();
    }
    get button() {
      return 0;
    }
  },
  He = class {
    constructor(t, e) {
      n(this, 'index');
      n(this, '_input');
      (this.index = t), (this._input = e);
    }
    get connected() {
      return this._input.getGamepadConnected(this.index);
    }
    get native() {
      return this._input.getGamepadNative(this.index);
    }
    get id() {
      const t = this.native;
      return t ? t.id : '';
    }
    get buttons() {
      const t = this.native;
      return t ? t.buttons.length : 0;
    }
    get axes() {
      const t = this.native;
      return t ? t.axes.length : 0;
    }
    isDown(t) {
      return this._input.isGamepadButtonPressed(this.index, t);
    }
    isJustDown(t) {
      return this._input.isGamepadButtonJustPressed(this.index, t);
    }
    isJustUp(t) {
      return this._input.isGamepadButtonJustReleased(this.index, t);
    }
    getAxis(t) {
      return this._input.getGamepadAxis(this.index, t);
    }
    toString() {
      return `Gamepad(${this.index})`;
    }
  },
  Ve = class {
    constructor() {
      n(this, '_rawKeys', new Set());
      n(this, '_timeDownMap', new Map());
      n(this, '_timeUpMap', new Map());
      n(this, '_currentTimeMs', 0);
      n(this, '_currentKeys', new Set());
      n(this, '_previousKeys', new Set());
      n(this, 'pointerX', 0);
      n(this, 'pointerY', 0);
      n(this, 'clientX', 0);
      n(this, 'clientY', 0);
      n(this, 'prevPointerX', 0);
      n(this, 'prevPointerY', 0);
      n(this, 'downPointerX', 0);
      n(this, 'downPointerY', 0);
      n(this, 'upPointerX', 0);
      n(this, 'upPointerY', 0);
      n(this, 'pointerVelocityX', 0);
      n(this, 'pointerVelocityY', 0);
      n(this, 'worldPointerX', 0);
      n(this, 'worldPointerY', 0);
      n(this, 'pointerDistance', 0);
      n(this, 'pointerAngle', 0);
      n(this, 'pointerId', 0);
      n(this, '_rawPointerDown', !1);
      n(this, '_currentPointerDown', !1);
      n(this, '_previousPointerDown', !1);
      n(this, '_rawPointerX', 0);
      n(this, '_rawPointerY', 0);
      n(this, '_distanceOriginX', 0);
      n(this, '_distanceOriginY', 0);
      n(this, 'pointerTransform', null);
      n(this, '_pointerScratch', new Float32Array(2));
      n(this, '_gamepads', []);
      n(this, '_currentGamepadButtons', []);
      n(this, '_previousGamepadButtons', []);
      n(this, '_gamepadHandles', []);
      n(this, '_gamepadHandleBuffer', []);
      n(this, '_boundOnKeyDown');
      n(this, '_boundOnKeyUp');
      n(this, '_boundOnPointerMove');
      n(this, '_boundOnPointerDown');
      n(this, '_boundOnPointerUp');
      n(this, '_boundTarget', null);
      n(this, '_keyHandles', new Map());
      n(this, '_cursorKeys', null);
      n(this, '_primaryPointer');
      (this._boundOnKeyDown = this.onKeyDown.bind(this)),
        (this._boundOnKeyUp = this.onKeyUp.bind(this)),
        (this._boundOnPointerMove = this.onPointerMove.bind(this)),
        (this._boundOnPointerDown = this.onPointerDown.bind(this)),
        (this._boundOnPointerUp = this.onPointerUp.bind(this)),
        (this._primaryPointer = new We(this));
    }
    get keyboard() {
      return this;
    }
    get pointer() {
      return this._primaryPointer;
    }
    get gamepad() {
      return this;
    }
    get activePointer() {
      return this._primaryPointer;
    }
    attach(t = window) {
      this.detach(),
        t.addEventListener('keydown', this._boundOnKeyDown),
        t.addEventListener('keyup', this._boundOnKeyUp),
        t.addEventListener('pointermove', this._boundOnPointerMove),
        t.addEventListener('pointerdown', this._boundOnPointerDown),
        t.addEventListener('pointerup', this._boundOnPointerUp),
        (this._boundTarget = t);
    }
    detach(t) {
      const e = t ?? this._boundTarget;
      e &&
        (e.removeEventListener('keydown', this._boundOnKeyDown),
        e.removeEventListener('keyup', this._boundOnKeyUp),
        e.removeEventListener('pointermove', this._boundOnPointerMove),
        e.removeEventListener('pointerdown', this._boundOnPointerDown),
        e.removeEventListener('pointerup', this._boundOnPointerUp),
        (this._boundTarget = null));
    }
    get attached() {
      return this._boundTarget !== null;
    }
    onKeyDown(t) {
      this._rawKeys.add(t.code);
    }
    onKeyUp(t) {
      this._rawKeys.delete(t.code);
    }
    onPointerMove(t) {
      (this._rawPointerX = t.clientX), (this._rawPointerY = t.clientY);
    }
    onPointerDown(t) {
      (this._rawPointerX = t.clientX), (this._rawPointerY = t.clientY), (this._rawPointerDown = !0);
    }
    onPointerUp() {
      this._rawPointerDown = !1;
    }
    update(t = 0) {
      (this._currentTimeMs += t * 1e3), this._previousKeys.clear();
      for (const s of this._currentKeys) this._previousKeys.add(s);
      this._currentKeys.clear();
      for (const s of this._rawKeys) this._currentKeys.add(s);
      if (
        ((this.prevPointerX = this.pointerX),
        (this.prevPointerY = this.pointerY),
        (this.clientX = this._rawPointerX),
        (this.clientY = this._rawPointerY),
        this.pointerTransform)
      ) {
        const s = this._pointerScratch;
        this.pointerTransform(this._rawPointerX, this._rawPointerY, s),
          (this.pointerX = s[0]),
          (this.pointerY = s[1]);
      } else (this.pointerX = this._rawPointerX), (this.pointerY = this._rawPointerY);
      (this._previousPointerDown = this._currentPointerDown),
        (this._currentPointerDown = this._rawPointerDown);
      const e = this.pointerX - this.prevPointerX,
        i = this.pointerY - this.prevPointerY;
      if (
        (t > 0
          ? ((this.pointerVelocityX = e / t), (this.pointerVelocityY = i / t))
          : ((this.pointerVelocityX = e), (this.pointerVelocityY = i)),
        (e !== 0 || i !== 0) && (this.pointerAngle = Math.atan2(i, e)),
        this._currentPointerDown && !this._previousPointerDown
          ? ((this.downPointerX = this.pointerX),
            (this.downPointerY = this.pointerY),
            (this._distanceOriginX = this.pointerX),
            (this._distanceOriginY = this.pointerY),
            (this.pointerDistance = 0))
          : !this._currentPointerDown &&
            this._previousPointerDown &&
            ((this.upPointerX = this.pointerX), (this.upPointerY = this.pointerY)),
        this._currentPointerDown)
      ) {
        const s = this.pointerX - this._distanceOriginX,
          r = this.pointerY - this._distanceOriginY;
        this.pointerDistance = Math.sqrt(s * s + r * r);
      }
      (this.worldPointerX = this.pointerX),
        (this.worldPointerY = this.pointerY),
        this.pollGamepads();
    }
    pollGamepads() {
      if (typeof navigator > 'u' || !navigator.getGamepads) return;
      const t = navigator.getGamepads();
      if (t.length === 0) {
        (this._gamepads.length = 0),
          (this._currentGamepadButtons.length = 0),
          (this._previousGamepadButtons.length = 0);
        return;
      }
      if (this._currentGamepadButtons.length < t.length)
        for (let e = this._currentGamepadButtons.length; e < t.length; e++)
          this._currentGamepadButtons.push([]), this._previousGamepadButtons.push([]);
      if (this._gamepads.length < t.length)
        for (let e = this._gamepads.length; e < t.length; e++) this._gamepads.push(null);
      for (let e = 0; e < t.length; e++) {
        const i = t[e],
          s = this._currentGamepadButtons[e],
          r = this._previousGamepadButtons[e];
        if (((this._gamepads[e] = i), !i)) {
          (s.length = 0), (r.length = 0);
          continue;
        }
        if (s.length !== i.buttons.length) {
          (s.length = i.buttons.length), (r.length = i.buttons.length);
          for (let a = 0; a < i.buttons.length; a++)
            (r[a] = i.buttons[a].pressed), (s[a] = i.buttons[a].pressed);
          continue;
        }
        for (let a = 0; a < i.buttons.length; a++) (r[a] = s[a]), (s[a] = i.buttons[a].pressed);
      }
      this._gamepads.length > t.length &&
        ((this._gamepads.length = t.length),
        (this._currentGamepadButtons.length = t.length),
        (this._previousGamepadButtons.length = t.length));
    }
    isKeyPressed(t) {
      return this._currentKeys.has(t);
    }
    isKeyJustPressed(t) {
      return this._currentKeys.has(t) && !this._previousKeys.has(t);
    }
    isKeyJustReleased(t) {
      return !this._currentKeys.has(t) && this._previousKeys.has(t);
    }
    addKey(t) {
      let e = this._keyHandles.get(t);
      return e === void 0 && ((e = new Oe(t, this)), this._keyHandles.set(t, e)), e;
    }
    addKeys(t) {
      const e = typeof t == 'string' ? [t] : t,
        i = [];
      for (let s = 0; s < e.length; s++) i.push(this.addKey(e[s]));
      return i;
    }
    createCursorKeys() {
      return (
        this._cursorKeys === null &&
          (this._cursorKeys = {
            up: this.addKey('ArrowUp'),
            down: this.addKey('ArrowDown'),
            left: this.addKey('ArrowLeft'),
            right: this.addKey('ArrowRight'),
            space: this.addKey('Space'),
            shift: this.addKey('ShiftLeft'),
          }),
        this._cursorKeys
      );
    }
    addPointer(t) {
      return this._primaryPointer;
    }
    isPointerDown() {
      return this._currentPointerDown;
    }
    isPointerJustPressed() {
      return this._currentPointerDown && !this._previousPointerDown;
    }
    isPointerJustReleased() {
      return !this._currentPointerDown && this._previousPointerDown;
    }
    isGamepadButtonPressed(t, e) {
      const i = this._currentGamepadButtons[t];
      return i !== void 0 && i[e] === !0;
    }
    isGamepadButtonJustPressed(t, e) {
      const i = this._currentGamepadButtons[t],
        s = this._previousGamepadButtons[t];
      return i === void 0 || s === void 0 ? !1 : i[e] === !0 && s[e] !== !0;
    }
    isGamepadButtonJustReleased(t, e) {
      const i = this._currentGamepadButtons[t],
        s = this._previousGamepadButtons[t];
      return i === void 0 || s === void 0 ? !1 : i[e] !== !0 && s[e] === !0;
    }
    getGamepadAxis(t, e) {
      const i = this._gamepads[t];
      if (!i || i.axes.length <= e) return 0;
      const s = i.axes[e];
      return Math.abs(s) > 0.1 ? s : 0;
    }
    getGamepadCount() {
      let t = 0;
      for (let e = 0; e < this._gamepads.length; e++) this._gamepads[e] && t++;
      return t;
    }
    getGamepadConnected(t) {
      return this._gamepads[t] != null;
    }
    getGamepadNative(t) {
      const e = this._gamepads[t];
      return e === void 0 ? null : e;
    }
    get isGamepadSupported() {
      return typeof navigator < 'u' && typeof navigator.getGamepads == 'function';
    }
    get gamepadTotal() {
      return this.getGamepadCount();
    }
    getGamepad(t) {
      return this._getGamepadHandle(t);
    }
    getAllGamepads(t) {
      const e = t ?? this._gamepadHandleBuffer,
        i = this._gamepads.length;
      for (let s = 0; s < i; s++) e[s] = this._getGamepadHandle(s);
      return (e.length = i), e;
    }
    _getGamepadHandle(t) {
      if (t < 0) return null;
      if (t >= this._gamepadHandles.length)
        for (let e = this._gamepadHandles.length; e <= t; e++)
          this._gamepadHandles.push(new He(e, this));
      return this._gamepadHandles[t];
    }
  };
function qe(t) {
  var s;
  const e = { frames: [], frameNames: new Map(), imagePath: null };
  if (t === null || typeof t != 'object') return e;
  if (Array.isArray(t)) {
    const r = t;
    for (let a = 0; a < r.length; a++) {
      const h = r[a],
        o = h.filename ?? String(a),
        u = dt(h);
      u !== null && (e.frames.push(u), e.frameNames.set(o, e.frames.length - 1));
    }
    return e;
  }
  const i = t;
  if (
    (typeof ((s = i.meta) == null ? void 0 : s.image) == 'string' && (e.imagePath = i.meta.image),
    i.frames !== null && typeof i.frames == 'object' && !Array.isArray(i.frames))
  ) {
    const r = Object.keys(i.frames);
    for (let a = 0; a < r.length; a++) {
      const h = r[a],
        o = i.frames[h],
        u = dt(o);
      if (u === null) continue;
      e.frames.push(u), e.frameNames.set(h, e.frames.length - 1);
      const l = h.lastIndexOf('.');
      l > 0 && e.frameNames.set(h.slice(0, l), e.frames.length - 1);
    }
    return e;
  }
  if (Array.isArray(i.frames)) {
    const r = i.frames;
    for (let a = 0; a < r.length; a++) {
      const h = r[a],
        o = h.filename ?? String(a),
        u = dt(h);
      u !== null && (e.frames.push(u), e.frameNames.set(o, e.frames.length - 1));
    }
  }
  return e;
}
function dt(t) {
  if (t === null || typeof t != 'object') return null;
  const e = t.frame ?? t;
  if (e == null || typeof e.x != 'number' || typeof e.y != 'number') return null;
  const i = typeof e.w == 'number' ? e.w : 0,
    s = typeof e.h == 'number' ? e.h : 0;
  if (i <= 0 || s <= 0) return null;
  let r = e.x,
    a = e.y;
  return (
    t.trimmed === !0 &&
      t.spriteSourceSize !== void 0 &&
      ((r += t.spriteSourceSize.x), (a += t.spriteSourceSize.y)),
    { x: r, y: a, w: i, h: s }
  );
}
function Ne(t) {
  const e = { name: '', size: 16, lineHeight: 16, imagePath: null, chars: [] },
    i = t.split(`
`);
  for (let s = 0; s < i.length; s++) {
    const r = i[s].trim();
    if (r !== '') {
      if (r.startsWith('info ')) {
        e.name = Xt(r, 'face') ?? '';
        const a = G(r, 'size');
        a !== null && (e.size = a);
        continue;
      }
      if (r.startsWith('common ')) {
        const a = G(r, 'lineHeight');
        a !== null && (e.lineHeight = a);
        continue;
      }
      if (r.startsWith('page ')) {
        const a = Xt(r, 'file');
        a !== null && (e.imagePath = a);
        continue;
      }
      if (r.startsWith('char ')) {
        const a = $e(r);
        a !== null && e.chars.push(a);
        continue;
      }
    }
  }
  return e.chars.sort((s, r) => s.id - r.id), e;
}
function Yt(t) {
  var s, r;
  const e = { name: '', size: 16, lineHeight: 16, imagePath: null, chars: [] };
  if (t === null || typeof t != 'object') return e;
  const i = t;
  if (
    (typeof i.font == 'string' && (e.name = i.font),
    typeof i.size == 'number' && (e.size = i.size),
    typeof i.lineHeight == 'number' && (e.lineHeight = i.lineHeight),
    typeof ((s = i.common) == null ? void 0 : s.lineHeight) == 'number' &&
      (e.lineHeight = i.common.lineHeight),
    ((r = i.common) == null ? void 0 : r.pages) !== void 0 &&
      i.common.pages.length > 0 &&
      (e.imagePath = i.common.pages[0]),
    Array.isArray(i.chars))
  )
    for (let a = 0; a < i.chars.length; a++) {
      const h = i.chars[a];
      typeof h.id == 'number' &&
        e.chars.push({
          id: h.id,
          x: h.x ?? 0,
          y: h.y ?? 0,
          width: h.width ?? 0,
          height: h.height ?? 0,
          xoffset: h.xoffset ?? 0,
          yoffset: h.yoffset ?? 0,
          xadvance: h.xadvance ?? 0,
        });
    }
  return e.chars.sort((a, h) => a.id - h.id), e;
}
function $e(t) {
  const e = G(t, 'id');
  return e === null
    ? null
    : {
        id: e,
        x: G(t, 'x') ?? 0,
        y: G(t, 'y') ?? 0,
        width: G(t, 'width') ?? 0,
        height: G(t, 'height') ?? 0,
        xoffset: G(t, 'xoffset') ?? 0,
        yoffset: G(t, 'yoffset') ?? 0,
        xadvance: G(t, 'xadvance') ?? 0,
      };
}
function G(t, e) {
  const s = new RegExp(`(?:^|\\s)${e}=(-?[0-9.]+)`).exec(t);
  if (s === null) return null;
  const r = Number.parseFloat(s[1]);
  return Number.isNaN(r) ? null : r;
}
function Xt(t, e) {
  const s = new RegExp(`(?:^|\\s)${e}="([^"]*)"`).exec(t);
  return s === null ? null : s[1];
}
var Ke = class {
  constructor(t) {
    n(this, '_queue', []);
    n(this, '_cache', new Map());
    n(this, '_isLoading', !1);
    n(this, '_textureManager', null);
    n(this, '_soundManagerFactory', null);
    n(this, '_listeners', new Map());
    this._textureManager = t || null;
  }
  setTextureManager(t) {
    this._textureManager = t;
  }
  setSoundManagerFactory(t) {
    this._soundManagerFactory = t;
  }
  on(t, e, i) {
    const s = i === void 0 ? e : e.bind(i),
      r = this._listeners.get(t);
    return r === void 0 ? this._listeners.set(t, [s]) : r.push(s), this;
  }
  once(t, e, i) {
    const s = () => {
      this.off(t, s);
      const r = e;
      i === void 0 ? r() : r.call(i);
    };
    return this.on(t, s);
  }
  off(t, e) {
    const i = this._listeners.get(t);
    if (i === void 0) return !1;
    for (let s = 0; s < i.length; s++) if (i[s] === e || i[s] === e) return i.splice(s, 1), !0;
    return !1;
  }
  _emit(t, ...e) {
    const i = this._listeners.get(t);
    if (i === void 0 || i.length === 0) return;
    const s = i.length;
    for (let r = 0; r < s; r++) {
      const a = i[r];
      a !== void 0 && a(...e);
    }
  }
  image(t, e) {
    return this._cache.has(t) || this._queue.push({ key: t, url: e, type: 'image' }), this;
  }
  spritesheet(t, e, i) {
    return (
      this._cache.has(t) || this._queue.push({ key: t, url: e, type: 'spritesheet', config: i }),
      this
    );
  }
  atlas(t, e, i) {
    return (
      this._cache.has(t) || this._queue.push({ key: t, url: e, type: 'atlas', config: i }), this
    );
  }
  bitmapfont(t, e, i) {
    if (!this._cache.has(t)) {
      const s = typeof i == 'string' || i === void 0 ? { xmlFormat: e.endsWith('.xml') } : i,
        r = { key: t, url: e, type: 'bitmapfont', config: s };
      typeof i == 'string' && (r.dataURL = i), this._queue.push(r);
    }
    return this;
  }
  json(t, e) {
    return this._queue.push({ key: t, url: e, type: 'json' }), this;
  }
  csv(t, e) {
    return this._queue.push({ key: t, url: e, type: 'csv' }), this;
  }
  yaml(t, e) {
    return this._queue.push({ key: t, url: e, type: 'yaml' }), this;
  }
  audio(t, e) {
    const i = Array.isArray(e) ? e[0] : e;
    return i && this._queue.push({ key: t, url: i, type: 'audio' }), this;
  }
  get pendingCount() {
    return this._queue.length;
  }
  get isLoading() {
    return this._isLoading;
  }
  async start() {
    if (this._isLoading) return;
    this._isLoading = !0;
    const t = this._queue;
    this._queue = [];
    const e = t.length;
    let i = 0;
    const s = new Array(e);
    for (let r = 0; r < e; r++)
      s[r] = this._loadItem(t[r]).then(() => {
        i++,
          this._emit('filecomplete', t[r].key, t[r].type),
          this._emit('progress', { loaded: i, total: e, progress: e === 0 ? 1 : i / e });
      });
    await Promise.all(s), (this._isLoading = !1), this._emit('complete');
  }
  async _loadItem(t) {
    try {
      const e = await fetch(t.url);
      if (!e.ok) throw new Error(`Failed to load ${t.url}: ${e.statusText}`);
      switch (t.type) {
        case 'image': {
          const i = await it(e);
          let s;
          this._textureManager && (s = this._textureManager.addImage(t.key, i)),
            this._cache.set(t.key, { type: 'image', image: i, textureAsset: s });
          break;
        }
        case 'spritesheet': {
          const i = await it(e),
            s = t.config,
            r = { frameWidth: s.frameWidth, frameHeight: s.frameHeight };
          let a;
          this._textureManager && (a = this._textureManager.addSpritesheet(t.key, i, r)),
            this._cache.set(t.key, { type: 'spritesheet', image: i, config: s, textureAsset: a });
          break;
        }
        case 'atlas': {
          await this._loadAtlas(t);
          break;
        }
        case 'bitmapfont': {
          await this._loadBitmapFont(t);
          break;
        }
        case 'json': {
          this._cache.set(t.key, await e.json());
          break;
        }
        case 'csv':
        case 'yaml': {
          this._cache.set(t.key, await e.text());
          break;
        }
        case 'audio': {
          const i = await e.arrayBuffer();
          this._soundManagerFactory && (await this._soundManagerFactory().loadAudioData(t.key, i)),
            this._cache.set(t.key, i);
          break;
        }
      }
    } catch (e) {
      console.error(`Error loading asset [${t.key}]:`, e);
    }
  }
  async _loadAtlas(t) {
    const e = t.config ?? {},
      i = await fetch(t.url);
    if (!i.ok) throw new Error(`Failed to load ${t.url}: ${i.statusText}`);
    const s = qe(await i.json()),
      r = e.textureURL ?? (s.imagePath === null ? null : It(t.url, s.imagePath, e.basePath));
    if (r === null) {
      console.error(
        `LoaderManager: atlas [${t.key}] に画像パスがありません。textureURL を指定してください。`,
      ),
        this._cache.set(t.key, s);
      return;
    }
    const a = await fetch(r);
    if (!a.ok) throw new Error(`Failed to load ${r}: ${a.statusText}`);
    const h = await it(a);
    let o;
    this._textureManager && (o = this._textureManager.addAtlas(t.key, h, s.frames)),
      this._cache.set(t.key, {
        type: 'atlas',
        image: h,
        frames: s.frames,
        frameNames: s.frameNames,
        textureAsset: o,
      });
  }
  async _loadBitmapFont(t) {
    const e = t.config ?? {},
      i = await fetch(t.url);
    if (!i.ok) throw new Error(`Failed to load ${t.url}: ${i.statusText}`);
    const s = await i.text();
    let r;
    if (e.xmlFormat === !0 || s.trimStart().startsWith('<'))
      try {
        r = Yt(JSON.parse(s));
      } catch {
        console.warn(
          `LoaderManager: XML のビットマップフォント [${t.key}] は未対応です。JSON かテキスト形式を使ってください。`,
        ),
          this._cache.set(t.key, { type: 'bitmapfont', name: t.key, chars: [] });
        return;
      }
    else s.trimStart().startsWith('{') ? (r = Yt(JSON.parse(s))) : (r = Ne(s));
    const a = t.dataURL ?? (r.imagePath === null ? null : It(t.url, r.imagePath, e.basePath));
    let h;
    if (a !== null) {
      const o = await fetch(a);
      if (!o.ok) throw new Error(`Failed to load ${a}: ${o.statusText}`);
      const u = await it(o),
        l = r.chars.map((d) => ({ x: d.x, y: d.y, w: d.width, h: d.height }));
      this._textureManager && (h = this._textureManager.addAtlas(t.key, u, l));
    } else
      console.warn(
        `LoaderManager: ビットマップフォント [${t.key}] の画像が見つかりません。dataURL を指定してください。`,
      );
    this._cache.set(t.key, {
      type: 'bitmapfont',
      name: r.name,
      size: r.size,
      lineHeight: r.lineHeight,
      chars: r.chars,
      textureAsset: h,
    });
  }
  get(t) {
    return this._cache.get(t);
  }
  exists(t) {
    return this._cache.has(t);
  }
  reset() {
    this.clear();
  }
  abort() {
    this._queue.length = 0;
  }
  onProgress(t) {
    return this.on('progress', t);
  }
  clear() {
    this._cache.clear(), (this._queue.length = 0);
  }
};
async function it(t) {
  const e = await t.blob(),
    i = new Image(),
    s = URL.createObjectURL(e);
  try {
    await new Promise((r, a) => {
      (i.onload = () => r()),
        (i.onerror = () => a(new Error('画像のデコードに失敗しました'))),
        (i.src = s);
    });
  } finally {
    URL.revokeObjectURL(s);
  }
  return i;
}
function It(t, e, i) {
  if (i === !1) return e;
  try {
    return new URL(e, t).href;
  } catch {
    return e;
  }
}
function Qe(t, e, i, s, r) {
  const a = [],
    h = i.frames;
  if (h !== void 0 && h.length > 0) {
    for (let c = 0; c < h.length; c++) {
      const f = h[c];
      a.push({ uvX: f.x / s, uvY: f.y / r, uvW: f.w / s, uvH: f.h / r });
    }
    return a;
  }
  const o = i.frameWidth || t,
    u = i.frameHeight || e,
    l = Math.max(1, Math.floor(t / o)),
    d = Math.max(1, Math.floor(e / u));
  for (let c = 0; c < d; c++)
    for (let f = 0; f < l; f++)
      a.push({ uvX: (f * o) / s, uvY: (c * u) / r, uvW: o / s, uvH: u / r });
  return a;
}
var je = class {
    constructor(t) {
      n(this, 'device', null);
      n(this, 'textures', new Map());
      n(this, 'textureSize', null);
      this.device = t || null;
    }
    setDevice(t) {
      (this.device = t), (this.textureSize = t.textureWidth);
      for (const [e, i] of this.textures.entries()) {
        const s = i._source;
        if (s && this.device) {
          const r = this.device.uploadTexture(e, s, {
            frameWidth: i.frameWidth,
            frameHeight: i.frameHeight,
          });
          this.textures.set(e, r);
        }
      }
    }
    addImage(t, e) {
      if (this.device) {
        const s = this.device.uploadTexture(t, e);
        return this.textures.set(t, s), s;
      }
      const i = {
        key: t,
        layerIndex: 0,
        width: e.width,
        height: e.height,
        frameWidth: e.width,
        frameHeight: e.height,
        frames: [{ uvX: 0, uvY: 0, uvW: 1, uvH: 1 }],
        _source: e,
      };
      return this.textures.set(t, i), i;
    }
    addSpritesheet(t, e, i) {
      if (this.device) {
        const u = this.device.uploadTexture(t, e, i);
        return this.textures.set(t, u), u;
      }
      const s = e.width,
        r = e.height,
        a = this.textureSize ?? s,
        h = this.textureSize ?? r,
        o = {
          key: t,
          layerIndex: 0,
          width: s,
          height: r,
          frameWidth: i.frameWidth || s,
          frameHeight: i.frameHeight || r,
          frames: Qe(s, r, i, a, h),
          _source: e,
        };
      return this.textures.set(t, o), o;
    }
    addAtlas(t, e, i) {
      return this.addSpritesheet(t, e, { frames: i });
    }
    createCanvasTexture(t, e, i, s, r) {
      const a = document.createElement('canvas');
      (a.width = e), (a.height = i);
      const h = a.getContext('2d');
      return s(h), r ? this.addSpritesheet(t, a, r) : this.addImage(t, a);
    }
    get(t) {
      return this.device ? this.device.getTexture(t) || this.textures.get(t) : this.textures.get(t);
    }
    exists(t) {
      return this.textures.has(t) || (this.device ? this.device.getTexture(t) !== void 0 : !1);
    }
    remove(t) {
      return (
        this.device &&
          this.device.getTexture(t) &&
          console.warn(`TextureManager: GPU テクスチャ ${t} の削除は未実装です`),
        this.textures.delete(t)
      );
    }
    list() {
      return Array.from(this.textures.keys());
    }
    getKeys() {
      return this.list();
    }
    getFrame(t, e) {
      var s;
      const i = this.get(t);
      if (!i) return null;
      if (typeof e == 'string') {
        const r = (s = i.frameNames) == null ? void 0 : s[e];
        return r !== void 0 ? i.frames[r] : null;
      }
      return i.frames[e ?? 0] ?? null;
    }
    refresh() {
      return this;
    }
    addSpriteSheet(t, e, i) {
      return this.addSpritesheet(t, e, i);
    }
    addCanvas(t, e) {
      return this.addImage(t, e);
    }
    async addBase64(t, e) {
      return new Promise((i, s) => {
        const r = new Image();
        (r.onload = () => i(this.addImage(t, r))),
          (r.onerror = () => s(new Error(`addBase64 failed for ${t}`))),
          (r.src = e);
      });
    }
  },
  W = {
    Linear(t, e, i) {
      return e + (i - e) * t;
    },
    SmoothStep(t, e, i) {
      const s = W.Clamp((t - e) / (i - e), 0, 1);
      return s * s * (3 - 2 * s);
    },
    Sinusoidal(t, e, i) {
      const s = W.Clamp((t - e) / (i - e), 0, 1);
      return 0.5 - Math.cos(s * Math.PI) * 0.5;
    },
    Percentage(t, e, i) {
      const s = i - e;
      return s === 0 ? 0 : (t - e) / s;
    },
    FuzzyMatch(t, e, i) {
      return Math.abs(t - e) <= i;
    },
    DistanceBetween(t, e, i, s) {
      const r = i - t,
        a = s - e;
      return Math.sqrt(r * r + a * a);
    },
    DistanceSquared(t, e, i, s) {
      const r = i - t,
        a = s - e;
      return r * r + a * a;
    },
    BetweenPoints(t, e, i) {
      const s = e[0] - t[0],
        r = e[1] - t[1];
      return (i[0] = Math.sqrt(s * s + r * r)), i;
    },
    AngleBetween(t, e, i, s) {
      return Math.atan2(s - e, i - t);
    },
    DegreesToRadians(t) {
      return (t * Math.PI) / 180;
    },
    RadiansToDegrees(t) {
      return (t * 180) / Math.PI;
    },
    Copy(t, e) {
      return (e[0] = t[0]), (e[1] = t[1]), e;
    },
    Length(t, e) {
      return Math.sqrt(t * t + e * e);
    },
    GetCentroid(t, e) {
      const i = t.length;
      if (i < 2) return 0;
      const s = i >> 1;
      let r = 0,
        a = 0;
      for (let h = 0; h < i; h += 2) (r += t[h]), (a += t[h + 1]);
      return (e[0] = r / s), (e[1] = a / s), s;
    },
    GetVec2Bounds(t, e) {
      const i = t.length;
      if (i < 2) return 0;
      let s = t[0],
        r = t[1],
        a = t[0],
        h = t[1];
      for (let o = 2; o < i; o += 2) {
        const u = t[o],
          l = t[o + 1];
        u < s && (s = u), u > a && (a = u), l < r && (r = l), l > h && (h = l);
      }
      return (e[0] = s), (e[1] = r), (e[2] = a), (e[3] = h), i >> 1;
    },
    Clamp(t, e, i) {
      return t < e ? e : t > i ? i : t;
    },
    Sign(t) {
      return t < 0 ? -1 : t > 0 ? 1 : 0;
    },
    DegToRad(t) {
      return (t * Math.PI) / 180;
    },
    RadToDeg(t) {
      return (t * 180) / Math.PI;
    },
  },
  Je = class {
    constructor() {
      n(this, 'Distance', {
        Between(t, e, i, s) {
          return W.DistanceBetween(t, e, i, s);
        },
        BetweenSquared(t, e, i, s) {
          return W.DistanceSquared(t, e, i, s);
        },
      });
      n(this, 'Angle', {
        Between(t, e, i, s) {
          return W.AngleBetween(t, e, i, s);
        },
      });
    }
    Clamp(t, e, i) {
      return W.Clamp(t, e, i);
    }
    DegToRad(t) {
      return W.DegToRad(t);
    }
    RadToDeg(t) {
      return W.RadToDeg(t);
    }
  },
  Ze = new Je(),
  st = new Float32Array(2),
  ti = class {
    constructor(t, e) {
      n(this, 'id');
      n(this, '_manager');
      (this.id = t), (this._manager = e);
    }
    get isValid() {
      return this._manager.isEmitterAlive(this.id);
    }
    get isEmitting() {
      return this.isValid && this._manager.isEmitterEmitting(this.id);
    }
    get x() {
      return this._manager.getEmitterX(this.id);
    }
    set x(t) {
      this._manager.setEmitterPosition(this.id, t, this.y);
    }
    get y() {
      return this._manager.getEmitterY(this.id);
    }
    set y(t) {
      this._manager.setEmitterPosition(this.id, this.x, t);
    }
    get frequency() {
      return this._manager.getEmitterFrequency(this.id);
    }
    set frequency(t) {
      this._manager.setEmitterFrequency(this.id, t);
    }
    get particleCount() {
      return this._manager.particleCount;
    }
    start() {
      return this._manager.setEmitterEmitting(this.id, !0), this;
    }
    stop() {
      return this._manager.stopEmitter(this.id), this;
    }
    emitParticle() {
      return this._manager.emitOne(this.id), this;
    }
    emitParticleAt(t) {
      return this._manager.emitMany(this.id, t);
    }
    explode(t) {
      return this._manager.explodeEmitter(this.id, t);
    }
    setPosition(t, e) {
      return this._manager.setEmitterPosition(this.id, t, e), this;
    }
    setSpeed(t) {
      return this._manager.setEmitterSpeed(this.id, t), this;
    }
    setLifespan(t) {
      return this._manager.setEmitterLifespan(this.id, t), this;
    }
    setAngle(t, e) {
      return (st[0] = t), (st[1] = e), this._manager.setEmitterAngle(this.id, st[0], st[1]), this;
    }
    setParticleTint(t) {
      return this._manager.setEmitterTint(this.id, t), this;
    }
    setConfig(t) {
      if (
        ((t.x !== void 0 || t.y !== void 0) && this.setPosition(t.x ?? this.x, t.y ?? this.y),
        t.frequency !== void 0 && (this.frequency = t.frequency),
        t.speed !== void 0 && this.setSpeed(t.speed),
        t.lifespan !== void 0 && this.setLifespan(t.lifespan),
        t.angle !== void 0 && this.setAngle(t.angle.min, t.angle.max),
        t.tint !== void 0 && this.setParticleTint(t.tint),
        t.zone !== void 0)
      ) {
        const e = t.zone.params;
        this.setZone(
          t.zone.shape,
          (e == null ? void 0 : e[0]) ?? 0,
          (e == null ? void 0 : e[1]) ?? 0,
          (e == null ? void 0 : e[2]) ?? 0,
          (e == null ? void 0 : e[3]) ?? 0,
        );
      }
      return (
        t.quantity !== void 0 && this.setQuantity(t.quantity),
        t.maxAliveParticles !== void 0 && this.setMaxAliveParticles(t.maxAliveParticles),
        t.duration !== void 0 && this.setDuration(t.duration),
        (t.gravityX !== void 0 || t.gravityY !== void 0) &&
          this.setParticleGravity(t.gravityX ?? this.gravityX, t.gravityY ?? this.gravityY),
        t.timeScale !== void 0 && this.setTimeScale(t.timeScale),
        this
      );
    }
    get zoneShape() {
      return this._manager.getEmitterZoneShape(this.id);
    }
    getZoneParams(t) {
      return this._manager.getEmitterZoneParams(this.id, t);
    }
    setZone(t, e, i, s, r) {
      return this._manager.setEmitterZone(this.id, t, e, i, s, r), this;
    }
    get opCount() {
      return this._manager.getEmitterOpCount(this.id);
    }
    getOps(t) {
      return this._manager.getEmitterOps(this.id, t);
    }
    getOpKind(t) {
      return this._manager.getEmitterOpKind(this.id, t);
    }
    get quantity() {
      return this._manager.getEmitterQuantity(this.id);
    }
    set quantity(t) {
      this.setQuantity(t);
    }
    setQuantity(t) {
      return this._manager.setEmitterQuantity(this.id, t), this;
    }
    get maxAliveParticles() {
      return this._manager.getEmitterMaxAlive(this.id);
    }
    set maxAliveParticles(t) {
      this.setMaxAliveParticles(t);
    }
    setMaxAliveParticles(t) {
      return this._manager.setEmitterMaxAlive(this.id, t), this;
    }
    get aliveParticleCount() {
      return this._manager.getEmitterAliveCount(this.id);
    }
    get duration() {
      return this._manager.getEmitterDuration(this.id);
    }
    set duration(t) {
      this.setDuration(t);
    }
    setDuration(t) {
      return this._manager.setEmitterDuration(this.id, t), this;
    }
    get elapsed() {
      return this._manager.getEmitterElapsed(this.id);
    }
    get gravityX() {
      return this._manager.getEmitterGravityX(this.id);
    }
    set gravityX(t) {
      this.setParticleGravityX(t);
    }
    get gravityY() {
      return this._manager.getEmitterGravityY(this.id);
    }
    set gravityY(t) {
      this.setParticleGravityY(t);
    }
    setParticleGravity(t, e) {
      return this._manager.setEmitterGravity(this.id, t, e), this;
    }
    setParticleGravityX(t) {
      return this._manager.setEmitterGravityX(this.id, t), this;
    }
    setParticleGravityY(t) {
      return this._manager.setEmitterGravityY(this.id, t), this;
    }
    get timeScale() {
      return this._manager.getEmitterTimeScale(this.id);
    }
    set timeScale(t) {
      this.setTimeScale(t);
    }
    setTimeScale(t) {
      return this._manager.setEmitterTimeScale(this.id, t), this;
    }
    setTexture(t) {
      return this._manager.setEmitterTexture(this.id, t), this;
    }
    killAll() {
      return this._manager.killAll(this.id);
    }
  },
  K = { Point: 0, Line: 1, Circle: 2, Random: 3, Emit: 4 },
  z = 4,
  ft = new Float32Array(2),
  pt = { speed: 0, lifespan: 1, frequency: 2, scale: 3 },
  ei = class {
    constructor(t = 1e5, e = 4096, i = 8) {
      n(this, 'arena');
      n(this, 'maxParticles');
      n(this, 'velX');
      n(this, 'velY');
      n(this, 'life');
      n(this, 'lifeMax');
      n(this, 'gravX');
      n(this, 'gravY');
      n(this, 'timeScale');
      n(this, 'ownerEmitter');
      n(this, 'activeIds');
      n(this, 'activeCount', 0);
      n(this, '_emitterActive');
      n(this, '_emitterX');
      n(this, '_emitterY');
      n(this, '_emitterRate');
      n(this, '_emitterAccum');
      n(this, '_emitterSpeed');
      n(this, '_emitterLife');
      n(this, '_emitterAngleMin');
      n(this, '_emitterAngleMax');
      n(this, '_emitterTint');
      n(this, '_emitterTexture');
      n(this, '_zoneShape');
      n(this, '_zoneParams');
      n(this, '_ops');
      n(this, '_opStart');
      n(this, '_opLen');
      n(this, '_opKind');
      n(this, '_emitterQuantity');
      n(this, '_emitterMaxAlive');
      n(this, '_emitterDuration');
      n(this, '_emitterElapsed');
      n(this, '_emitterAliveCount');
      n(this, '_emitterGravX');
      n(this, '_emitterGravY');
      n(this, '_emitterTimeScale');
      n(this, '_emitterCount', 0);
      n(this, '_emitterCapacity');
      n(this, '_opsPerEmitter');
      n(this, '_opsCapacity');
      n(this, '_emitterHandles', new Map());
      (this.maxParticles = t),
        (this._emitterCapacity = e),
        (this._opsPerEmitter = i),
        (this._opsCapacity = e * i),
        (this.velX = new Float32Array(t)),
        (this.velY = new Float32Array(t)),
        (this.life = new Float32Array(t)),
        (this.lifeMax = new Float32Array(t)),
        (this.gravX = new Float32Array(t)),
        (this.gravY = new Float32Array(t)),
        (this.timeScale = new Float32Array(t).fill(1)),
        (this.ownerEmitter = new Int32Array(t).fill(-1)),
        (this.activeIds = new Int32Array(t).fill(-1)),
        (this._emitterActive = new Uint8Array(e)),
        (this._emitterX = new Float32Array(e)),
        (this._emitterY = new Float32Array(e)),
        (this._emitterRate = new Float32Array(e)),
        (this._emitterAccum = new Float32Array(e)),
        (this._emitterSpeed = new Float32Array(e)),
        (this._emitterLife = new Float32Array(e)),
        (this._emitterAngleMin = new Float32Array(e)),
        (this._emitterAngleMax = new Float32Array(e)),
        (this._emitterTint = new Uint32Array(e)),
        (this._emitterTexture = new Array(e).fill(null)),
        (this._zoneShape = new Uint8Array(e)),
        (this._zoneParams = new Float32Array(e * z)),
        (this._ops = new Float32Array(this._opsCapacity * 2)),
        (this._opStart = new Int32Array(e)),
        (this._opLen = new Int32Array(e)),
        (this._opKind = new Uint8Array(this._opsCapacity)),
        (this._emitterQuantity = new Float32Array(e)),
        (this._emitterMaxAlive = new Float32Array(e)),
        (this._emitterDuration = new Float32Array(e)),
        (this._emitterElapsed = new Float32Array(e)),
        (this._emitterAliveCount = new Int32Array(e)),
        (this._emitterGravX = new Float32Array(e)),
        (this._emitterGravY = new Float32Array(e)),
        (this._emitterTimeScale = new Float32Array(e).fill(1));
    }
    init(t) {
      this.arena = t.arena;
    }
    createEmitter(t) {
      return this.emitBurst(t);
    }
    emitBurst(t) {
      const {
        x: e,
        y: i,
        count: s,
        speed: r,
        life: a,
        angleMin: h = 0,
        angleMax: o = Math.PI * 2,
      } = t;
      let u = 0;
      for (let l = 0; l < s && this._emitOne(e, i, r, a, h, o, 4294967295); l++) u++;
      return u;
    }
    create(t = {}) {
      var h, o, u, l;
      if (this._emitterCount >= this._emitterCapacity)
        return console.warn('ParticleManager: エミッター数が上限に達しました。'), null;
      const e = this._emitterCount++;
      (this._emitterActive[e] = 0),
        (this._emitterAliveCount[e] = 0),
        (this._emitterX[e] = t.x ?? 0),
        (this._emitterY[e] = t.y ?? 0),
        (this._emitterRate[e] = t.frequency ?? 0),
        (this._emitterAccum[e] = 0),
        (this._emitterSpeed[e] = t.speed ?? 100),
        (this._emitterLife[e] = t.lifespan ?? 1e3),
        (this._emitterAngleMin[e] = ((h = t.angle) == null ? void 0 : h.min) ?? 0),
        (this._emitterAngleMax[e] = ((o = t.angle) == null ? void 0 : o.max) ?? Math.PI * 2),
        (this._emitterTint[e] = t.tint ?? 4294967295),
        (this._emitterQuantity[e] = t.quantity ?? 1),
        (this._emitterMaxAlive[e] = t.maxAliveParticles ?? 0),
        (this._emitterDuration[e] = t.duration ?? 0),
        (this._emitterElapsed[e] = 0),
        (this._emitterGravX[e] = t.gravityX ?? 0),
        (this._emitterGravY[e] = t.gravityY ?? 0),
        (this._emitterTimeScale[e] = t.timeScale ?? 1),
        (this._zoneShape[e] = ((u = t.zone) == null ? void 0 : u.shape) ?? K.Emit);
      const i = e * z,
        s = (l = t.zone) == null ? void 0 : l.params;
      s && s.length >= z
        ? ((this._zoneParams[i] = s[0]),
          (this._zoneParams[i + 1] = s[1]),
          (this._zoneParams[i + 2] = s[2]),
          (this._zoneParams[i + 3] = s[3]))
        : ((this._zoneParams[i] = this._emitterX[e]),
          (this._zoneParams[i + 1] = this._emitterY[e]),
          (this._zoneParams[i + 2] = 0),
          (this._zoneParams[i + 3] = 0));
      const r = e * this._opsPerEmitter;
      if (((this._opStart[e] = r), (this._opLen[e] = 0), t.ops)) {
        const d = Math.min(t.ops.length, this._opsPerEmitter);
        for (let c = 0; c < d; c++)
          (this._ops[(r + c) * 2] = t.ops[c].enabled === !1 ? 0 : 1),
            (this._ops[(r + c) * 2 + 1] = t.ops[c].value),
            (this._opKind[r + c] = pt[t.ops[c].kind ?? 'speed']);
        this._opLen[e] = d;
      }
      let a = this._emitterHandles.get(e);
      return a === void 0 && ((a = new ti(e, this)), this._emitterHandles.set(e, a)), a;
    }
    isEmitterAlive(t) {
      return t >= 0 && t < this._emitterCount;
    }
    getEmitterX(t) {
      return this.isEmitterAlive(t) ? this._emitterX[t] : 0;
    }
    getEmitterY(t) {
      return this.isEmitterAlive(t) ? this._emitterY[t] : 0;
    }
    getEmitterFrequency(t) {
      return this.isEmitterAlive(t) ? this._emitterRate[t] : 0;
    }
    get particleCount() {
      return this.activeCount;
    }
    get particleCapacity() {
      return this.maxParticles;
    }
    get emitterCount() {
      return this._emitterCount;
    }
    isEmitterEmitting(t) {
      return this.isEmitterAlive(t) && this._emitterActive[t] === 1;
    }
    setEmitterEmitting(t, e) {
      this.isEmitterAlive(t) &&
        ((this._emitterActive[t] = e ? 1 : 0),
        e && ((this._emitterAccum[t] = 0), (this._emitterElapsed[t] = 0)));
    }
    getEmitterZoneShape(t) {
      return this.isEmitterAlive(t) ? this._zoneShape[t] : K.Emit;
    }
    getEmitterZoneParams(t, e) {
      if (!this.isEmitterAlive(t)) return (e[0] = 0), (e[1] = 0), (e[2] = 0), (e[3] = 0), z;
      const i = t * z;
      return (
        (e[0] = this._zoneParams[i]),
        (e[1] = this._zoneParams[i + 1]),
        (e[2] = this._zoneParams[i + 2]),
        (e[3] = this._zoneParams[i + 3]),
        z
      );
    }
    setEmitterZone(t, e, i, s, r, a) {
      if (!this.isEmitterAlive(t)) return;
      this._zoneShape[t] = e;
      const h = t * z;
      (this._zoneParams[h] = i),
        (this._zoneParams[h + 1] = s),
        (this._zoneParams[h + 2] = r),
        (this._zoneParams[h + 3] = a);
    }
    getEmitterOpCount(t) {
      return this.isEmitterAlive(t) ? this._opLen[t] : 0;
    }
    getEmitterOps(t, e) {
      if (!this.isEmitterAlive(t)) return 0;
      const i = this._opStart[t],
        s = this._opLen[t];
      for (let r = 0; r < s; r++)
        (e[r * 2] = this._ops[(i + r) * 2]), (e[r * 2 + 1] = this._ops[(i + r) * 2 + 1]);
      return s;
    }
    getEmitterOpKind(t, e) {
      return !this.isEmitterAlive(t) || e < 0 || e >= this._opLen[t]
        ? -1
        : this._opKind[this._opStart[t] + e];
    }
    getEmitterQuantity(t) {
      return this.isEmitterAlive(t) ? this._emitterQuantity[t] : 0;
    }
    setEmitterQuantity(t, e) {
      this.isEmitterAlive(t) && (this._emitterQuantity[t] = e < 0 ? 0 : e);
    }
    getEmitterMaxAlive(t) {
      return this.isEmitterAlive(t) ? this._emitterMaxAlive[t] : 0;
    }
    setEmitterMaxAlive(t, e) {
      this.isEmitterAlive(t) && (this._emitterMaxAlive[t] = e < 0 ? 0 : e);
    }
    getEmitterAliveCount(t) {
      return this.isEmitterAlive(t) ? this._emitterAliveCount[t] : 0;
    }
    getEmitterDuration(t) {
      return this.isEmitterAlive(t) ? this._emitterDuration[t] : 0;
    }
    setEmitterDuration(t, e) {
      this.isEmitterAlive(t) &&
        ((this._emitterDuration[t] = e < 0 ? 0 : e), (this._emitterElapsed[t] = 0));
    }
    getEmitterElapsed(t) {
      return this.isEmitterAlive(t) ? this._emitterElapsed[t] : 0;
    }
    getEmitterGravityX(t) {
      return this.isEmitterAlive(t) ? this._emitterGravX[t] : 0;
    }
    getEmitterGravityY(t) {
      return this.isEmitterAlive(t) ? this._emitterGravY[t] : 0;
    }
    setEmitterGravity(t, e, i) {
      this.isEmitterAlive(t) && ((this._emitterGravX[t] = e), (this._emitterGravY[t] = i));
    }
    setEmitterGravityX(t, e) {
      this.isEmitterAlive(t) && (this._emitterGravX[t] = e);
    }
    setEmitterGravityY(t, e) {
      this.isEmitterAlive(t) && (this._emitterGravY[t] = e);
    }
    getEmitterTimeScale(t) {
      return this.isEmitterAlive(t) ? this._emitterTimeScale[t] : 1;
    }
    setEmitterTimeScale(t, e) {
      this.isEmitterAlive(t) && (this._emitterTimeScale[t] = e <= 0 ? 1 : e);
    }
    setEmitterAngle(t, e, i) {
      this.isEmitterAlive(t) && ((this._emitterAngleMin[t] = e), (this._emitterAngleMax[t] = i));
    }
    getEmitterAngleMin(t) {
      return this.isEmitterAlive(t) ? this._emitterAngleMin[t] : 0;
    }
    getEmitterAngleMax(t) {
      return this.isEmitterAlive(t) ? this._emitterAngleMax[t] : 0;
    }
    getEmitterSpeed(t) {
      return this.isEmitterAlive(t) ? this._emitterSpeed[t] : 0;
    }
    getEmitterLifespan(t) {
      return this.isEmitterAlive(t) ? this._emitterLife[t] : 0;
    }
    getEmitterTint(t) {
      return this.isEmitterAlive(t) ? this._emitterTint[t] : 0;
    }
    setEmitterTexture(t, e) {
      this.isEmitterAlive(t) && (this._emitterTexture[t] = e);
    }
    emitOne(t) {
      return this.isEmitterAlive(t) ? this._emitFromEmitter(t) : !1;
    }
    _emitFromEmitter(t) {
      const e = this._emitterMaxAlive[t];
      if (e > 0 && this._emitterAliveCount[t] >= e) return !1;
      this._evalZone(t, ft);
      let i = this._emitterSpeed[t],
        s = this._emitterLife[t];
      const r = this._opStart[t],
        a = this._opLen[t];
      for (let u = 0; u < a; u++) {
        const l = r + u;
        if (this._ops[l * 2] === 0) continue;
        const d = this._ops[l * 2 + 1],
          c = this._opKind[l];
        c === pt.speed ? (i = d) : c === pt.lifespan && (s = d);
      }
      if (
        !this._emitOne(
          ft[0],
          ft[1],
          i,
          s,
          this._emitterAngleMin[t],
          this._emitterAngleMax[t],
          this._emitterTint[t],
        )
      )
        return !1;
      const o = this.activeIds[this.activeCount - 1];
      return (
        (this.gravX[o] = this._emitterGravX[t]),
        (this.gravY[o] = this._emitterGravY[t]),
        (this.timeScale[o] = this._emitterTimeScale[t]),
        (this.ownerEmitter[o] = t),
        this._emitterAliveCount[t]++,
        !0
      );
    }
    _evalZone(t, e) {
      const i = this._zoneShape[t],
        s = t * z,
        r = this._zoneParams[s],
        a = this._zoneParams[s + 1],
        h = this._zoneParams[s + 2],
        o = this._zoneParams[s + 3];
      switch (i) {
        case K.Point:
          (e[0] = r), (e[1] = a);
          break;
        case K.Line: {
          const u = Math.random();
          (e[0] = r + (h - r) * u), (e[1] = a + (o - a) * u);
          break;
        }
        case K.Circle: {
          const u = h * Math.sqrt(Math.random()),
            l = Math.random() * Math.PI * 2;
          (e[0] = r + Math.cos(l) * u), (e[1] = a + Math.sin(l) * u);
          break;
        }
        case K.Random:
          (e[0] = r + Math.random() * h), (e[1] = a + Math.random() * o);
          break;
        default:
          (e[0] = this._emitterX[t]), (e[1] = this._emitterY[t]);
          break;
      }
    }
    emitMany(t, e) {
      let i = 0;
      for (let s = 0; s < e && this.emitOne(t); s++) i++;
      return i;
    }
    setEmitterPosition(t, e, i) {
      this.isEmitterAlive(t) && ((this._emitterX[t] = e), (this._emitterY[t] = i));
    }
    setEmitterFrequency(t, e) {
      this.isEmitterAlive(t) && (this._emitterRate[t] = e);
    }
    setEmitterSpeed(t, e) {
      this.isEmitterAlive(t) && (this._emitterSpeed[t] = e);
    }
    setEmitterLifespan(t, e) {
      this.isEmitterAlive(t) && (this._emitterLife[t] = e);
    }
    setEmitterTint(t, e) {
      this.isEmitterAlive(t) && (this._emitterTint[t] = e >>> 0);
    }
    stopEmitter(t) {
      this.isEmitterAlive(t) && (this._emitterActive[t] = 0);
    }
    explodeEmitter(t, e) {
      return this.isEmitterAlive(t) ? this.emitMany(t, e) : 0;
    }
    killAll(t) {
      if (!this.isEmitterAlive(t)) return 0;
      let e = 0;
      for (let i = this.activeCount - 1; i >= 0; i--) {
        const s = this.activeIds[i];
        s === -1 ||
          this.ownerEmitter[s] !== t ||
          (this.arena.free(s),
          (this.activeIds[i] = this.activeIds[this.activeCount - 1]),
          (this.activeIds[this.activeCount - 1] = -1),
          this.activeCount--,
          e++);
      }
      return (this._emitterAliveCount[t] = 0), e;
    }
    _emitOne(t, e, i, s, r, a, h) {
      if (this.activeCount >= this.maxParticles) return !1;
      const o = this.arena.allocate();
      if (o === -1) return !1;
      const u = r + Math.random() * (a - r),
        l = i * (0.5 + Math.random() * 0.5),
        d = this.arena.idToIndex[o];
      this.arena.setPosX(d, t), this.arena.setPosY(d, e), this.arena.setFrameSize(d, 1, 1, !1);
      const c = this.ownerEmitter[o],
        f = c >= 0 ? this._emitterTexture[c] : null;
      if (f) {
        const _ = f.textureAsset ?? f;
        (this.arena.assetRef[d] = _),
          this.arena.setFrameIdx(d, (_ == null ? void 0 : _.layerIndex) ?? 0);
      }
      return (
        this.arena.setTint(d, h),
        (this.velX[o] = Math.cos(u) * l),
        (this.velY[o] = Math.sin(u) * l),
        (this.life[o] = s),
        (this.lifeMax[o] = s),
        (this.ownerEmitter[o] = -1),
        (this.gravX[o] = 0),
        (this.gravY[o] = 0),
        (this.timeScale[o] = 1),
        (this.activeIds[this.activeCount++] = o),
        !0
      );
    }
    update(t) {
      const e = t * 1e3;
      for (let i = 0; i < this._emitterCount; i++) {
        if (this._emitterActive[i] === 0) continue;
        const s = this._emitterDuration[i];
        if (s > 0 && ((this._emitterElapsed[i] += e), this._emitterElapsed[i] >= s)) {
          this._emitterActive[i] = 0;
          continue;
        }
        const r = this._emitterRate[i];
        if (r <= 0) continue;
        this._emitterAccum[i] += r * t;
        const a = Math.floor(this._emitterAccum[i]);
        if (!(a <= 0)) {
          this._emitterAccum[i] -= a;
          for (let h = 0; h < a && this._emitFromEmitter(i); h++);
        }
      }
      for (let i = 0; i < this.activeCount; i++) {
        const s = this.activeIds[i];
        if (s === -1) continue;
        const r = this.arena.idToIndex[s];
        if (r < 0) {
          (this.activeIds[i] = this.activeIds[this.activeCount - 1]),
            (this.activeIds[this.activeCount - 1] = -1),
            this.activeCount--,
            i--;
          continue;
        }
        const a = this.timeScale[s];
        if (((this.life[s] -= e * a), this.life[s] <= 0)) {
          this.arena.free(s),
            this._decEmitterAliveCount(s),
            (this.activeIds[i] = this.activeIds[this.activeCount - 1]),
            (this.activeIds[this.activeCount - 1] = -1),
            this.activeCount--,
            i--;
          continue;
        }
        const h = this.gravX[s],
          o = this.gravY[s];
        h !== 0 && (this.velX[s] += h * t),
          o !== 0 && (this.velY[s] += o * t),
          this.arena.setPosX(r, this.arena.posX[r] + this.velX[s] * t),
          this.arena.setPosY(r, this.arena.posY[r] + this.velY[s] * t);
        const u = this.life[s] / this.lifeMax[s];
        this.arena.setScale(r, u);
      }
    }
    _decEmitterAliveCount(t) {
      const e = this.ownerEmitter[t];
      e >= 0 && this._emitterAliveCount[e] > 0 && this._emitterAliveCount[e]--;
    }
    destroy() {
      for (let t = 0; t < this.activeCount; t++)
        this.activeIds[t] !== -1 && this.arena.free(this.activeIds[t]);
      (this.activeCount = 0),
        (this._emitterCount = 0),
        this._emitterActive.fill(0),
        this._emitterAliveCount.fill(0),
        this._emitterElapsed.fill(0),
        this._emitterHandles.clear();
    }
  },
  ii = class {
    constructor(t = 1e5) {
      n(this, 'scene');
      n(this, 'arena');
      n(this, 'velX');
      n(this, 'velY');
      n(this, 'mass');
      n(this, 'bounce');
      n(this, 'accelX');
      n(this, 'accelY');
      n(this, 'dragX');
      n(this, 'dragY');
      n(this, 'maxVelX');
      n(this, 'maxVelY');
      n(this, 'radius');
      n(this, 'bodyWidth');
      n(this, 'bodyHeight');
      n(this, 'offsetX');
      n(this, 'offsetY');
      n(this, 'immovable');
      n(this, 'collideWorldBounds');
      n(this, 'friction');
      n(this, 'frictionStatic');
      n(this, 'enable');
      n(this, 'boundsX', 0);
      n(this, 'boundsY', 0);
      n(this, 'boundsWidth', 0);
      n(this, 'boundsHeight', 0);
      n(this, 'hasBounds', !1);
      n(this, 'gravityX', 0);
      n(this, 'gravityY', 0);
      n(this, '_overlapRules', []);
      n(this, '_colliderRules', []);
      n(this, 'add', {
        existing: (t) => t,
        group: (t) => {
          const e = new vt();
          return t && e.addMultiple(t), e;
        },
        staticGroup: (t) => {
          const e = new vt();
          return (
            e.setOnAddHook((i) => {
              var r, a;
              const s = i;
              (a = (r = s == null ? void 0 : s.body) == null ? void 0 : r.setImmovable) == null ||
                a.call(r, !0);
            }),
            t && e.addMultiple(t),
            e
          );
        },
        overlap: (t, e, i, s = 0) => {
          let r = this.arena,
            a = i;
          typeof e == 'function' ? (a = e) : e && (r = e),
            a && this._overlapRules.push({ targetA: t, targetB: r, callback: a, margin: s });
        },
        collider: (t, e, i, s = 0) => {
          let r = this.arena,
            a = i;
          typeof e == 'function' ? (a = e) : e && (r = e),
            this._colliderRules.push({ targetA: t, targetB: r, callback: a, bounce: s });
        },
      });
      (this.velX = new Float32Array(t)),
        (this.velY = new Float32Array(t)),
        (this.mass = new Float32Array(t).fill(1)),
        (this.bounce = new Float32Array(t).fill(0)),
        (this.accelX = new Float32Array(t)),
        (this.accelY = new Float32Array(t)),
        (this.dragX = new Float32Array(t)),
        (this.dragY = new Float32Array(t)),
        (this.maxVelX = new Float32Array(t)),
        (this.maxVelY = new Float32Array(t)),
        (this.radius = new Float32Array(t)),
        (this.bodyWidth = new Float32Array(t)),
        (this.bodyHeight = new Float32Array(t)),
        (this.offsetX = new Float32Array(t)),
        (this.offsetY = new Float32Array(t)),
        (this.immovable = new Uint8Array(t)),
        (this.collideWorldBounds = new Uint8Array(t)),
        (this.friction = new Float32Array(t)),
        (this.frictionStatic = new Float32Array(t)),
        (this.enable = new Uint8Array(t).fill(1));
    }
    init(t) {
      (this.scene = t), (this.arena = t.arena);
    }
    _idx(t) {
      const e = this.arena;
      return !e || t < 0 ? -1 : e.idToIndex[t];
    }
    setVelocity(t, e, i) {
      const s = this._idx(t);
      s < 0 || ((this.velX[s] = e), (this.velY[s] = i));
    }
    setAcceleration(t, e, i) {
      const s = this._idx(t);
      s < 0 || ((this.accelX[s] = e), (this.accelY[s] = i));
    }
    setDrag(t, e) {
      const i = this._idx(t);
      i < 0 || ((this.dragX[i] = e), (this.dragY[i] = e));
    }
    setMaxVelocity(t, e, i) {
      const s = this._idx(t);
      s < 0 || ((this.maxVelX[s] = e), (this.maxVelY[s] = i));
    }
    setFriction(t, e, i = 0) {
      const s = this._idx(t);
      s < 0 ||
        ((this.friction[s] = e < 0 ? 0 : e > 1 ? 1 : e), (this.frictionStatic[s] = i < 0 ? 0 : i));
    }
    setEnabled(t, e) {
      const i = this._idx(t);
      i < 0 || (this.enable[i] = e ? 1 : 0);
    }
    setCircle(t, e) {
      const i = this._idx(t);
      i < 0 || (this.radius[i] = e);
    }
    setSize(t, e, i) {
      const s = this._idx(t);
      s < 0 || ((this.radius[s] = 0), (this.bodyWidth[s] = e), (this.bodyHeight[s] = i));
    }
    setOffset(t, e, i) {
      const s = this._idx(t);
      s < 0 || ((this.offsetX[s] = e), (this.offsetY[s] = i));
    }
    setImmovable(t, e) {
      const i = this._idx(t);
      i < 0 || (this.immovable[i] = e ? 1 : 0);
    }
    setCollideWorldBounds(t, e) {
      const i = this._idx(t);
      i < 0 || (this.collideWorldBounds[i] = e ? 1 : 0);
    }
    setBounds(t, e, i, s) {
      (this.boundsX = t),
        (this.boundsY = e),
        (this.boundsWidth = i > 0 ? i : 0),
        (this.boundsHeight = s > 0 ? s : 0),
        (this.hasBounds = this.boundsWidth > 0 && this.boundsHeight > 0);
    }
    clearBounds() {
      (this.hasBounds = !1), (this.boundsWidth = 0), (this.boundsHeight = 0);
    }
    _halfWidth(t) {
      const e = this.bodyWidth[t];
      if (e > 0) return e * 0.5;
      const i = this.arena;
      return i.frameWidth[t] * i.scaleX[t] * 0.5;
    }
    _halfHeight(t) {
      const e = this.bodyHeight[t];
      if (e > 0) return e * 0.5;
      const i = this.arena;
      return i.frameHeight[t] * i.scaleY[t] * 0.5;
    }
    getHalfWidth(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this._halfWidth(e);
    }
    getHalfHeight(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this._halfHeight(e);
    }
    getBodyX(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this.arena.posX[e];
    }
    setBodyX(t, e) {
      const i = this._idx(t);
      i < 0 || this.arena.setPosX(i, e);
    }
    getBodyY(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this.arena.posY[e];
    }
    setBodyY(t, e) {
      const i = this._idx(t);
      i < 0 || this.arena.setPosY(i, e);
    }
    getVelocityX(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this.velX[e];
    }
    getVelocityY(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this.velY[e];
    }
    getAccelerationX(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this.accelX[e];
    }
    getAccelerationY(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this.accelY[e];
    }
    getDrag(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this.dragX[e];
    }
    getBounce(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this.bounce[e];
    }
    getFriction(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this.friction[e];
    }
    getFrictionStatic(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this.frictionStatic[e];
    }
    getEnabled(t) {
      const e = this._idx(t);
      return e >= 0 && this.enable[e] === 1;
    }
    setBounce(t, e) {
      const i = this._idx(t);
      i < 0 || (this.bounce[i] = e < 0 ? 0 : e > 1 ? 1 : e);
    }
    getMass(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this.mass[e];
    }
    setMass(t, e) {
      const i = this._idx(t);
      i < 0 || (this.mass[i] = e < 0 ? 0 : e);
    }
    getMaxVelocityX(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this.maxVelX[e];
    }
    getMaxVelocityY(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this.maxVelY[e];
    }
    getRadius(t) {
      const e = this._idx(t);
      return e < 0 ? 0 : this.radius[e];
    }
    getImmovable(t) {
      const e = this._idx(t);
      return e >= 0 && this.immovable[e] === 1;
    }
    getCollideWorldBounds(t) {
      const e = this._idx(t);
      return e >= 0 && this.collideWorldBounds[e] === 1;
    }
    update(t) {
      const e = this.arena;
      if (!e) return;
      const i = e.activeCount;
      if (i === 0) return;
      const s = this.gravityX,
        r = this.gravityY,
        a = this.hasBounds,
        h = this.boundsX,
        o = this.boundsY,
        u = h + this.boundsWidth,
        l = o + this.boundsHeight;
      for (let d = 0; d < i; d++) {
        if (this.enable[d] === 0) continue;
        let c = this.velX[d],
          f = this.velY[d];
        (c += (this.accelX[d] + s) * t), (f += (this.accelY[d] + r) * t);
        const _ = this.dragX[d];
        _ > 0 && (c -= c * _);
        const g = this.dragY[d];
        g > 0 && (f -= f * g);
        const p = this.maxVelX[d];
        p > 0 && c > p ? (c = p) : p > 0 && c < -p && (c = -p);
        const y = this.maxVelY[d];
        y > 0 && f > y ? (f = y) : y > 0 && f < -y && (f = -y);
        const v = this.friction[d];
        if (v > 0) {
          if (this.accelX[d] === 0) {
            c -= c * v;
            const w = this.frictionStatic[d];
            w > 0 && c > -w && c < w && (c = 0);
          }
          if (this.accelY[d] === 0) {
            f -= f * v;
            const w = this.frictionStatic[d];
            w > 0 && f > -w && f < w && (f = 0);
          }
        }
        (this.velX[d] = c), (this.velY[d] = f);
        let m = e.posX[d] + c * t,
          F = e.posY[d] + f * t;
        if (a && this.collideWorldBounds[d] === 1) {
          const w = this.bounce[d],
            x = h + this._halfWidth(d),
            A = u - this._halfWidth(d),
            S = o + this._halfHeight(d),
            b = l - this._halfHeight(d);
          m < x ? ((m = x), c < 0 && (c = -c * w)) : m > A && ((m = A), c > 0 && (c = -c * w)),
            F < S ? ((F = S), f < 0 && (f = -f * w)) : F > b && ((F = b), f > 0 && (f = -f * w)),
            (this.velX[d] = c),
            (this.velY[d] = f);
        }
        e.setPosX(d, m), e.setPosY(d, F);
      }
    }
    processOverlaps() {
      const t = this._overlapRules.length;
      if (t !== 0)
        for (let e = 0; e < t; e++) {
          const i = this._overlapRules[e];
          this._evaluateOverlapPair(i.targetA, i.targetB, i.callback, i.margin);
        }
    }
    processColliders() {
      const t = this._colliderRules.length;
      if (t !== 0)
        for (let e = 0; e < t; e++) {
          const i = this._colliderRules[e];
          this._evaluateColliderPair(i.targetA, i.targetB, i.callback, i.bounce);
        }
    }
    _evaluateOverlapPair(t, e, i, s) {
      if (Array.isArray(t)) {
        for (let r = 0; r < t.length; r++) {
          const a = t[r];
          a && this._evaluateSingleVsTarget(a, e, i, s);
        }
        return;
      }
      if ('x' in t && 'y' in t && typeof t.x == 'number') {
        this._evaluateSingleVsTarget(t, e, i, s);
        return;
      }
      this._evaluateBufferVsTarget(t, e, i, s);
    }
    _evaluateSingleVsTarget(t, e, i, s) {
      var p, y, v;
      const r = t.x,
        a = t.y,
        h =
          (t.radius ??
            ((p = t.body) == null ? void 0 : p.radius) ??
            (t.width ? t.width * 0.5 : 16)) + s,
        o = r - h,
        u = r + h,
        l = a - h,
        d = a + h;
      if (Array.isArray(e)) {
        for (let m = 0; m < e.length; m++) {
          const F = e[m];
          if (!F) continue;
          const w = F.x,
            x = F.y;
          if (w >= o && w <= u && x >= l && x <= d) {
            const A =
                F.radius ??
                ((y = F.body) == null ? void 0 : y.radius) ??
                (F.width ? F.width * 0.5 : 16),
              S = h + A,
              b = w - r,
              T = x - a;
            b * b + T * T < S * S && i(t, F);
          }
        }
        return;
      }
      if ('x' in e && 'y' in e && typeof e.x == 'number') {
        const m = e,
          F = m.x,
          w = m.y;
        if (F >= o && F <= u && w >= l && w <= d) {
          const x =
              m.radius ??
              ((v = m.body) == null ? void 0 : v.radius) ??
              (m.width ? m.width * 0.5 : 16),
            A = h + x,
            S = F - r,
            b = w - a;
          S * S + b * b < A * A && i(t, m);
        }
        return;
      }
      const c = e,
        f = c.posX,
        _ = c.posY,
        g = this._getBufCount(c);
      for (let m = 0; m < g; m++) {
        const F = f[m],
          w = _[m];
        if (F >= o && F <= u && w >= l && w <= d) {
          const x = this._getBufRadius(c, m),
            A = h + x,
            S = F - r,
            b = w - a;
          S * S + b * b < A * A && i(t, m);
        }
      }
    }
    _evaluateBufferVsTarget(t, e, i, s) {
      var o;
      const r = t.posX,
        a = t.posY,
        h = this._getBufCount(t);
      for (let u = 0; u < h; u++) {
        const l = r[u],
          d = a[u],
          c = this._getBufRadius(t, u) + s,
          f = l - c,
          _ = l + c,
          g = d - c,
          p = d + c;
        if ('x' in e && 'y' in e && typeof e.x == 'number') {
          const y = e,
            v = y.x,
            m = y.y;
          if (v >= f && v <= _ && m >= g && m <= p) {
            const F =
                y.radius ??
                ((o = y.body) == null ? void 0 : o.radius) ??
                (y.width ? y.width * 0.5 : 16),
              w = c + F,
              x = v - l,
              A = m - d;
            x * x + A * A < w * w && i(u, y);
          }
        } else if ('posX' in e && 'posY' in e) {
          const y = e,
            v = y.posX,
            m = y.posY,
            F = this._getBufCount(y);
          for (let w = 0; w < F; w++) {
            const x = v[w],
              A = m[w];
            if (x >= f && x <= _ && A >= g && A <= p) {
              const S = this._getBufRadius(y, w),
                b = c + S,
                T = x - l,
                C = A - d;
              T * T + C * C < b * b && i(u, w);
            }
          }
        }
      }
    }
    _evaluateColliderPair(t, e, i, s = 0) {
      var r;
      if ('x' in t && 'y' in t && typeof t.x == 'number') {
        const a = t,
          h = a.x,
          o = a.y,
          u =
            a.radius ??
            ((r = a.body) == null ? void 0 : r.radius) ??
            (a.width ? a.width * 0.5 : 16),
          l = h - u,
          d = h + u,
          c = o - u,
          f = o + u;
        if ('posX' in e && 'posY' in e) {
          const _ = e,
            g = _.posX,
            p = _.posY,
            y = this._getBufCount(_);
          for (let v = 0; v < y; v++) {
            const m = g[v],
              F = p[v];
            if (m >= l && m <= d && F >= c && F <= f) {
              const w = this._getBufRadius(_, v),
                x = u + w,
                A = m - h,
                S = F - o,
                b = A * A + S * S;
              if (b < x * x && b > 1e-4) {
                const T = Math.sqrt(b),
                  C = x - T,
                  M = A / T,
                  V = S / T;
                (g[v] += M * C), (p[v] += V * C), i && i(a, v);
              }
            }
          }
        }
      }
    }
    _getBufCount(t) {
      return 'activeCount' in t && typeof t.activeCount == 'number'
        ? t.activeCount
        : 'count' in t && typeof t.count == 'number'
          ? t.count
          : t.posX.length;
    }
    _getBufRadius(t, e) {
      if ('radius' in t && t.radius) {
        if (typeof t.radius == 'number') return t.radius;
        const i = t.radius[e];
        if (typeof i == 'number') return i;
      }
      return 'scale' in t && t.scale
        ? t.scale[e] * 0.42
        : 'frameWidth' in t && 'scaleX' in t
          ? t.frameWidth[e] * t.scaleX[e] * 0.5
          : 16;
    }
    collide() {
      this.processOverlaps(), this.processColliders();
    }
    clear() {
      (this._overlapRules.length = 0), (this._colliderRules.length = 0);
    }
    destroy() {
      this.clear();
    }
  },
  si = class {
    constructor(t, e) {
      n(this, 'entityId');
      n(this, '_physics');
      (this.entityId = t), (this._physics = e);
    }
    get x() {
      return this._physics.getBodyX(this.entityId);
    }
    set x(t) {
      this._physics.setBodyX(this.entityId, t);
    }
    get y() {
      return this._physics.getBodyY(this.entityId);
    }
    set y(t) {
      this._physics.setBodyY(this.entityId, t);
    }
    get velocityX() {
      return this._physics.getVelocityX(this.entityId);
    }
    set velocityX(t) {
      this._physics.setVelocity(this.entityId, t, this.velocityY);
    }
    get velocityY() {
      return this._physics.getVelocityY(this.entityId);
    }
    set velocityY(t) {
      this._physics.setVelocity(this.entityId, this.velocityX, t);
    }
    get accelerationX() {
      return this._physics.getAccelerationX(this.entityId);
    }
    set accelerationX(t) {
      this._physics.setAcceleration(this.entityId, t, this.accelerationY);
    }
    get accelerationY() {
      return this._physics.getAccelerationY(this.entityId);
    }
    set accelerationY(t) {
      this._physics.setAcceleration(this.entityId, this.accelerationX, t);
    }
    get drag() {
      return this._physics.getDrag(this.entityId);
    }
    set drag(t) {
      this._physics.setDrag(this.entityId, t);
    }
    get bounce() {
      return this._physics.getBounce(this.entityId);
    }
    set bounce(t) {
      this._physics.setBounce(this.entityId, t);
    }
    get friction() {
      return this._physics.getFriction(this.entityId);
    }
    set friction(t) {
      this._physics.setFriction(this.entityId, t, this._physics.getFrictionStatic(this.entityId));
    }
    get frictionStatic() {
      return this._physics.getFrictionStatic(this.entityId);
    }
    set frictionStatic(t) {
      this._physics.setFriction(this.entityId, this.friction, t);
    }
    get speed() {
      const t = this.velocityX,
        e = this.velocityY;
      return Math.sqrt(t * t + e * e);
    }
    get angle() {
      return Math.atan2(this.velocityY, this.velocityX);
    }
    get mass() {
      return this._physics.getMass(this.entityId);
    }
    set mass(t) {
      this._physics.setMass(this.entityId, t);
    }
    get maxVelocityX() {
      return this._physics.getMaxVelocityX(this.entityId);
    }
    get maxVelocityY() {
      return this._physics.getMaxVelocityY(this.entityId);
    }
    get radius() {
      return this._physics.getRadius(this.entityId);
    }
    get immovable() {
      return this._physics.getImmovable(this.entityId);
    }
    set immovable(t) {
      this._physics.setImmovable(this.entityId, t);
    }
    get checkCollision() {
      return this._physics.getCollideWorldBounds(this.entityId);
    }
    set checkCollision(t) {
      this._physics.setCollideWorldBounds(this.entityId, t);
    }
    get enabled() {
      return this._physics.getEnabled(this.entityId);
    }
    set enabled(t) {
      this._physics.setEnabled(this.entityId, t);
    }
    setVelocity(t, e) {
      const i = this._physics,
        s = t === void 0 ? this.velocityX : t,
        r = e === void 0 ? this.velocityY : e;
      return i.setVelocity(this.entityId, s, r), this;
    }
    setVelocityX(t) {
      return this._physics.setVelocity(this.entityId, t, this.velocityY), this;
    }
    setVelocityY(t) {
      return this._physics.setVelocity(this.entityId, this.velocityX, t), this;
    }
    setAcceleration(t, e) {
      const i = t === void 0 ? this.accelerationX : t,
        s = e === void 0 ? this.accelerationY : e;
      return this._physics.setAcceleration(this.entityId, i, s), this;
    }
    setAccelerationX(t) {
      return this._physics.setAcceleration(this.entityId, t, this.accelerationY), this;
    }
    setAccelerationY(t) {
      return this._physics.setAcceleration(this.entityId, this.accelerationX, t), this;
    }
    setDrag(t) {
      return this._physics.setDrag(this.entityId, t), this;
    }
    setBounce(t) {
      return this._physics.setBounce(this.entityId, t), this;
    }
    setFriction(t, e = 0) {
      return this._physics.setFriction(this.entityId, t, e), this;
    }
    setVelocityFromAngle(t, e) {
      const i = (t * Math.PI) / 180;
      return this._physics.setVelocity(this.entityId, Math.cos(i) * e, Math.sin(i) * e), this;
    }
    enable() {
      return this._physics.setEnabled(this.entityId, !0), this;
    }
    disable() {
      return this._physics.setEnabled(this.entityId, !1), this;
    }
    setMaxVelocity(t, e) {
      const i = t === void 0 ? this.maxVelocityX : t,
        s = e === void 0 ? this.maxVelocityY : e;
      return this._physics.setMaxVelocity(this.entityId, i, s), this;
    }
    setCircle(t) {
      return this._physics.setCircle(this.entityId, t), this;
    }
    setSize(t, e) {
      return this._physics.setSize(this.entityId, t, e), this;
    }
    setOffset(t, e) {
      return this._physics.setOffset(this.entityId, t, e), this;
    }
    setImmovable(t = !0) {
      return this._physics.setImmovable(this.entityId, t), this;
    }
    setCollideWorldBounds(t = !0) {
      return this._physics.setCollideWorldBounds(this.entityId, t), this;
    }
    reset() {
      return (
        this._physics.setVelocity(this.entityId, 0, 0),
        this._physics.setAcceleration(this.entityId, 0, 0),
        this._physics.setDrag(this.entityId, 0),
        this
      );
    }
  },
  Dt = new Float32Array(4),
  ri = class {
    constructor(t) {
      n(this, '_physics');
      this._physics = t;
    }
    setBoundsRectangle(t, e, i, s) {
      return this._physics.setBounds(t, e, i, s), this;
    }
    setBounds(t, e, i = 0, s = 0) {
      return this._physics.setBounds(i, s, t, e), this;
    }
    clearBounds() {
      return this._physics.clearBounds(), this;
    }
    getBounds(t = Dt) {
      return (
        (t[0] = this._physics.boundsX),
        (t[1] = this._physics.boundsY),
        (t[2] = this._physics.boundsWidth),
        (t[3] = this._physics.boundsHeight),
        t
      );
    }
    get hasBounds() {
      return this._physics.hasBounds;
    }
    get gravityX() {
      return this._physics.gravityX;
    }
    set gravityX(t) {
      this._physics.gravityX = t;
    }
    get gravityY() {
      return this._physics.gravityY;
    }
    set gravityY(t) {
      this._physics.gravityY = t;
    }
    collideWorldBounds(t, e = !0) {
      return this._physics.setCollideWorldBounds(t, e), this;
    }
    isOutsideWorld(t, e = Dt) {
      const i = this._physics;
      if (!i.hasBounds) return !1;
      const s = i.getBodyX(t),
        r = i.getBodyY(t),
        a = i.getHalfWidth(t),
        h = i.getHalfHeight(t),
        o = i.boundsX,
        u = i.boundsY,
        l = i.boundsX + i.boundsWidth,
        d = i.boundsY + i.boundsHeight,
        c = s - a < o || r - h < u || s + a > l || r + h > d;
      return (e[0] = c ? 1 : 0), c;
    }
  },
  ni = class {
    constructor(t, e) {
      n(this, 'voiceIndex');
      n(this, '_manager');
      (this._manager = t), (this.voiceIndex = e);
    }
    get key() {
      const t = this._voice;
      return t === null ? '' : t.key;
    }
    get _voice() {
      return this._manager.getVoiceByIndex(this.voiceIndex);
    }
    get isPlaying() {
      const t = this._voice;
      return t !== null && t.isPlaying;
    }
    get isPaused() {
      const t = this._voice;
      return t !== null && t.paused;
    }
    get volume() {
      const t = this._voice;
      return t === null ? 0 : t.volume;
    }
    set volume(t) {
      const e = this._voice;
      e !== null && (e.volume = t);
    }
    get rate() {
      const t = this._voice;
      return t === null ? 1 : t.rate;
    }
    set rate(t) {
      const e = this._voice;
      e !== null && (e.rate = t);
    }
    get seek() {
      const t = this._voice;
      return t === null ? 0 : t.seek;
    }
    set seek(t) {
      const e = this._voice;
      e !== null && (e.seek = t);
    }
    get loop() {
      const t = this._voice;
      return t !== null && t.loop;
    }
    set loop(t) {
      const e = this._voice;
      e !== null && (e.loop = t);
    }
    stop() {
      const t = this._voice;
      t !== null && (t.stop(), (this.voiceIndex = -1));
    }
    pause() {
      const t = this._voice;
      t !== null && t.pause();
    }
    resume() {
      const t = this._voice;
      t !== null && t.resume();
    }
    get x() {
      const t = this._voice;
      return t === null ? 0 : t.x;
    }
    set x(t) {
      const e = this._voice;
      e !== null && (e.x = t);
    }
    get y() {
      const t = this._voice;
      return t === null ? 0 : t.y;
    }
    set y(t) {
      const e = this._voice;
      e !== null && (e.y = t);
    }
    get z() {
      const t = this._voice;
      return t === null ? 0 : t.z;
    }
    set z(t) {
      const e = this._voice;
      e !== null && (e.z = t);
    }
    play() {
      const t = this.key;
      if (t === '') return this;
      this.stop();
      const e = this._manager.playVoice(t, this._voiceOptions());
      return (this.voiceIndex = e === null ? -1 : this._manager.indexOfVoice(e)), this;
    }
    setVolume(t) {
      return (this.volume = t), this;
    }
    setRate(t) {
      return (this.rate = t), this;
    }
    setSeek(t) {
      return (this.seek = t), this;
    }
    setLoop(t) {
      return (this.loop = t), this;
    }
    destroy() {
      return this.stop(), this;
    }
    _voiceOptions() {
      const t = this._voice;
      return t === null
        ? { volume: 0 }
        : { volume: t.volume, x: t.x, y: t.y, z: t.z, loop: t.loop, rate: t.rate };
    }
  },
  ai = class {
    constructor(t, e) {
      n(this, 'context');
      n(this, 'panner');
      n(this, 'gain');
      n(this, 'isPlaying', !1);
      n(this, 'loop', !1);
      n(this, 'paused', !1);
      n(this, 'rate', 1);
      n(this, 'seek', 0);
      n(this, 'key', '');
      n(this, 'fadingIn', !1);
      n(this, 'source', null);
      n(this, 'onEndedCallback');
      n(this, 'fadeGain', 1);
      n(this, '_startTime', 0);
      n(this, '_fadeFrom', 0);
      n(this, '_fadeTo', 0);
      n(this, '_fadeDuration', 0);
      n(this, '_rateBeforePause', 1);
      (this.context = t),
        (this.panner = t.createPanner()),
        (this.panner.panningModel = 'HRTF'),
        (this.panner.distanceModel = 'inverse'),
        (this.panner.refDistance = 100),
        (this.panner.maxDistance = 1e4),
        (this.panner.rolloffFactor = 1),
        (this.gain = t.createGain()),
        this.panner.connect(this.gain),
        this.gain.connect(e),
        (this.onEndedCallback = () => {
          (this.isPlaying = !1), (this.fadingIn = !1), (this.source = null);
        });
    }
    play(t, e) {
      if (this.source !== null)
        try {
          (this.source.onended = null), this.source.stop();
        } catch {}
      (this.isPlaying = !0), (this.loop = (e == null ? void 0 : e.loop) ?? !1);
      const i = this.context.createBufferSource();
      (i.buffer = t), (i.loop = this.loop);
      let s = (e == null ? void 0 : e.rate) ?? this.rate;
      (e == null ? void 0 : e.seek) !== void 0 && t.duration > 0 && (s = t.duration / e.seek),
        (i.playbackRate.value = s),
        (this.rate = s),
        (this.seek = (e == null ? void 0 : e.seek) ?? 0),
        (this.paused = !1),
        i.connect(this.panner),
        (i.onended = this.onEndedCallback),
        (this.source = i),
        (this.fadeGain = 1),
        (e == null ? void 0 : e.mute) === !0 && (this.fadeGain = 0),
        (this.gain.gain.value = ((e == null ? void 0 : e.volume) ?? 1) * this.fadeGain),
        (this.x = (e == null ? void 0 : e.x) ?? 0),
        (this.y = (e == null ? void 0 : e.y) ?? 0),
        (this.z = (e == null ? void 0 : e.z) ?? 0),
        (e == null ? void 0 : e.fadeIn) !== void 0 && e.fadeIn > 0
          ? ((this.fadingIn = !0),
            this.gain.gain.cancelScheduledValues(this.context.currentTime),
            this.gain.gain.setValueAtTime(0, this.context.currentTime),
            (this._fadeFrom = 0),
            (this._fadeTo = e.volume ?? 1),
            (this._fadeDuration = e.fadeIn))
          : ((this._fadeFrom = 0), (this._fadeTo = 0), (this._fadeDuration = 0)),
        (this._startTime = this.context.currentTime),
        i.start(0, (e == null ? void 0 : e.delay) ?? 0);
    }
    updateFade(t) {
      if (!this.fadingIn) return;
      const e = (t - this._startTime) / this._fadeDuration;
      if (e >= 1) {
        (this.fadingIn = !1), (this.gain.gain.value = this._fadeTo);
        return;
      }
      this.gain.gain.value = this._fadeFrom + (this._fadeTo - this._fadeFrom) * e;
    }
    stop() {
      if (this.source !== null) {
        try {
          (this.source.onended = null), this.source.stop();
        } catch {}
        this.source = null;
      }
      (this.isPlaying = !1), (this.paused = !1), (this.fadingIn = !1), (this.seek = 0);
    }
    pause() {
      !this.isPlaying ||
        this.paused ||
        ((this.paused = !0),
        this.source !== null &&
          ((this._rateBeforePause = this.source.playbackRate.value),
          (this.source.playbackRate.value = 0)));
    }
    resume() {
      this.paused &&
        ((this.paused = !1),
        this.source !== null && (this.source.playbackRate.value = this._rateBeforePause));
    }
    setRate(t) {
      if (!(t <= 0)) {
        if (((this.rate = t), this.paused)) {
          this._rateBeforePause = t;
          return;
        }
        this.source !== null && (this.source.playbackRate.value = t);
      }
    }
    setSeek(t) {
      t < 0 || (this.seek = t);
    }
    get x() {
      return this.panner.positionX.value;
    }
    set x(t) {
      this.panner.positionX.value = t;
    }
    get y() {
      return this.panner.positionY.value;
    }
    set y(t) {
      this.panner.positionY.value = t;
    }
    get z() {
      return this.panner.positionZ.value;
    }
    set z(t) {
      this.panner.positionZ.value = t;
    }
    get volume() {
      return this.gain.gain.value;
    }
    set volume(t) {
      (this.gain.gain.value = t), this.fadingIn && (this._fadeTo = t);
    }
  },
  hi = class {
    constructor(t = {}) {
      n(this, 'context');
      n(this, 'masterGain');
      n(this, 'compressor');
      n(this, 'buffers', new Map());
      n(this, 'voicePool', []);
      n(this, 'active', new Map());
      n(this, '_defaultVolume', 1);
      n(this, '_muted', !1);
      n(this, '_unlocked', !1);
      n(this, '_paused', !1);
      n(this, '_handlePool', []);
      n(this, '_audioSpriteOptions', {});
      const e = window.AudioContext ?? window.webkitAudioContext;
      if (e === void 0)
        throw new Error('Web Audio API が利用できません (AudioContext がありません)');
      (this.context = new e()),
        (this.compressor = this.context.createDynamicsCompressor()),
        this.compressor.threshold.setValueAtTime(-24, this.context.currentTime),
        this.compressor.knee.setValueAtTime(30, this.context.currentTime),
        this.compressor.ratio.setValueAtTime(12, this.context.currentTime),
        this.compressor.attack.setValueAtTime(0.003, this.context.currentTime),
        this.compressor.release.setValueAtTime(0.25, this.context.currentTime),
        (this.masterGain = this.context.createGain()),
        this.masterGain.connect(this.compressor),
        this.compressor.connect(this.context.destination);
      const i = t.poolSize ?? 32;
      for (let s = 0; s < i; s++) this.voicePool.push(new ai(this.context, this.masterGain));
      t.defaultVolume !== void 0 && (this._defaultVolume = t.defaultVolume),
        (this.masterGain.gain.value = this._defaultVolume),
        this.setListenerPosition(t.listenerX ?? 0, t.listenerY ?? 0, t.listenerZ ?? 100);
    }
    setConfig(t) {
      t.defaultVolume !== void 0 && this.setVolume(t.defaultVolume);
    }
    get volume() {
      return this._defaultVolume;
    }
    set volume(t) {
      this.setVolume(t);
    }
    setVolume(t) {
      return (
        (this._defaultVolume = Math.max(0, Math.min(1, t))),
        (this.masterGain.gain.value = this._defaultVolume),
        this
      );
    }
    get mute() {
      return this._muted;
    }
    set mute(t) {
      this.setMute(t);
    }
    setMute(t) {
      return (this._muted = t), (this.masterGain.gain.value = t ? 0 : this._defaultVolume), this;
    }
    get unlocked() {
      return this._unlocked;
    }
    unlock() {
      return (
        this.context.state === 'suspended' && this.context.resume(),
        (this._unlocked = this.context.state === 'running'),
        this
      );
    }
    get paused() {
      return this._paused;
    }
    pauseAll() {
      return this.context.state === 'running' && this.context.suspend(), (this._paused = !0), this;
    }
    resumeAll() {
      return this.context.state === 'suspended' && this.context.resume(), (this._paused = !1), this;
    }
    add(t, e) {
      return this.buffers.set(t, e), this;
    }
    async loadAudioData(t, e) {
      const i = await this.context.decodeAudioData(e);
      this.buffers.set(t, i);
    }
    remove(t) {
      return this.stopByKey(t), this.buffers.delete(t);
    }
    exists(t) {
      return this.buffers.has(t);
    }
    _acquireVoice() {
      for (let t = 0; t < this.voicePool.length; t++)
        if (!this.voicePool[t].isPlaying) return this.voicePool[t];
      return null;
    }
    getVoiceByIndex(t) {
      return t < 0 || t >= this.voicePool.length ? null : this.voicePool[t];
    }
    indexOfVoice(t) {
      for (let e = 0; e < this.voicePool.length; e++) if (this.voicePool[e] === t) return e;
      return -1;
    }
    playVoice(t, e) {
      const i = this.buffers.get(t);
      if (i === void 0) return console.warn(`SoundManager: Buffer not found for key: ${t}`), null;
      const s = this._acquireVoice();
      return s === null ? null : ((s.key = t), s.play(i, e), s);
    }
    play(t, e) {
      const i = this.playVoice(t, e);
      if (i === null) return null;
      const s = this._acquireHandle();
      return (s.voiceIndex = this.indexOfVoice(i)), this.active.set(t, s), s;
    }
    _acquireHandle() {
      for (let e = 0; e < this._handlePool.length; e++) {
        const i = this._handlePool[e];
        if (i.voiceIndex < 0) return i;
        const s = this.getVoiceByIndex(i.voiceIndex);
        if (s === null || !s.isPlaying) return i;
      }
      const t = new ni(this, -1);
      return this._handlePool.push(t), t;
    }
    playAudioSprite(t, e) {
      const i = e ?? {},
        s = this.buffers.get(t);
      let r = i.delay ?? 0;
      i.seek !== void 0 && s !== void 0 && s.duration > 0 && (r = i.seek * s.duration);
      const a = this._audioSpriteOptions;
      return (
        (a.volume = i.volume),
        (a.loop = i.loop),
        (a.rate = i.rate),
        (a.mute = i.mute),
        (a.fadeIn = i.fadeIn),
        (a.x = i.x),
        (a.y = i.y),
        (a.z = i.z),
        (a.delay = r),
        (a.seek = i.seek),
        this.play(t, a)
      );
    }
    stopByKey(t) {
      let e = 0;
      for (let s = 0; s < this.voicePool.length; s++) {
        const r = this.voicePool[s];
        !r.isPlaying || r.key !== t || (r.stop(), e++);
      }
      const i = this.active.get(t);
      return i !== void 0 && !i.isPlaying && this.active.delete(t), e;
    }
    get(t) {
      return this.active.get(t) ?? null;
    }
    isPlaying(t) {
      const e = this.active.get(t);
      return e === void 0 ? !1 : e.isPlaying ? !0 : (this.active.delete(t), !1);
    }
    get playingCount() {
      let t = 0;
      for (let e = 0; e < this.voicePool.length; e++) this.voicePool[e].isPlaying && t++;
      return t;
    }
    get count() {
      return this.buffers.size;
    }
    stopAll() {
      for (let t = 0; t < this.voicePool.length; t++) this.voicePool[t].stop();
      this.active.clear();
    }
    removeAll() {
      this.stopAll(), this.buffers.clear();
    }
    get listenerX() {
      var t;
      return ((t = this.context.listener.positionX) == null ? void 0 : t.value) ?? 0;
    }
    set listenerX(t) {
      this.context.listener.positionX !== void 0 && (this.context.listener.positionX.value = t);
    }
    get listenerY() {
      var t;
      return ((t = this.context.listener.positionY) == null ? void 0 : t.value) ?? 0;
    }
    set listenerY(t) {
      this.context.listener.positionY !== void 0 && (this.context.listener.positionY.value = t);
    }
    get listenerZ() {
      var t;
      return ((t = this.context.listener.positionZ) == null ? void 0 : t.value) ?? 0;
    }
    set listenerZ(t) {
      this.context.listener.positionZ !== void 0 && (this.context.listener.positionZ.value = t);
    }
    setListenerPosition(t, e, i = 100) {
      const s = this.context.listener;
      return (
        s.positionX !== void 0
          ? ((s.positionX.value = t), (s.positionY.value = e), (s.positionZ.value = i))
          : s.setPosition(t, e, i),
        this
      );
    }
    update(t) {
      const e = t ?? this.context.currentTime;
      for (let i = 0; i < this.voicePool.length; i++) {
        const s = this.voicePool[i];
        s.fadingIn && s.updateFade(e);
      }
      if (this.active.size !== 0)
        for (const i of this.active.values()) i.isPlaying || this.active.delete(i.key);
    }
    destroy() {
      this.stopAll(), this.buffers.clear(), this.context.state !== 'closed' && this.context.close();
    }
  },
  oi = new Float32Array(4),
  ui = class {
    constructor(t, e) {
      n(this, 'index');
      n(this, '_map');
      (this.index = t), (this._map = e);
    }
    get isValid() {
      return this._map.isLayerValid(this.index);
    }
    get scrollX() {
      return this._map.getLayerScrollX(this.index);
    }
    get scrollY() {
      return this._map.getLayerScrollY(this.index);
    }
    get visible() {
      return this.isValid;
    }
    set visible(t) {}
    setPosition(t, e) {
      return this._map.setLayerPosition(this.index, t, e), this;
    }
    setCollisionByIndex(t, e) {
      return this._map.setCollisionByIndex(t, e);
    }
    setCollision(t, e = !0) {
      let i = 0;
      for (let s = 0; s < t.length; s++) i += this._map.setCollisionByIndex(t[s], e);
      return i;
    }
    tileIndex(t, e) {
      return this._map.getTileIndexAt(this.index, t, e);
    }
    findTileAt(t, e) {
      return this._map.findTileAt(this.index, t, e);
    }
    getTilesWithinWorldXY(t, e, i, s, r) {
      return this._map.getTilesWithinWorldXY(t, this.index, e, i, s, r);
    }
    putTileAt(t, e, i) {
      return this._map.setTileAt(this.index, t, e, i);
    }
    collides(t, e) {
      return this._map.hasCollisionAt(this.index, t, e);
    }
    getBounds(t = oi) {
      return (
        (t[0] = this.scrollX),
        (t[1] = this.scrollY),
        (t[2] = this._map.mapWidth * this._map.tileSize),
        (t[3] = this._map.mapHeight * this._map.tileSize),
        t
      );
    }
    get tileCount() {
      const t = this._map.cellsPerLayer,
        e = this._map.getFlatTiles();
      let i = 0;
      for (let s = 0; s < t; s++) e[this.index * t + s] > 0 && i++;
      return i;
    }
    destroy() {
      return this._map.setLayerPosition(this.index, 0, 0), this;
    }
  },
  li = class {
    constructor(t, e, i) {
      n(this, 'arena');
      n(this, 'mapWidth');
      n(this, 'mapHeight');
      n(this, 'tileSize');
      n(this, 'layersData', []);
      n(this, 'activeTiles', new Map());
      n(this, 'flatTiles', new Int32Array(0));
      n(this, 'tilesets', []);
      n(this, 'tileCols', 1);
      n(this, 'tileRows', 1);
      n(this, 'maxLayers', 64);
      n(this, 'collision', new Uint8Array(0));
      n(this, 'layerScrollX', new Float32Array(0));
      n(this, 'layerScrollY', new Float32Array(0));
      n(this, '_layerHandles', new Map());
      n(this, 'lastStartX', -1);
      n(this, 'lastStartY', -1);
      n(this, 'lastEndX', -1);
      n(this, 'lastEndY', -1);
      var r;
      if (((this.arena = t), Array.isArray(e))) {
        (this.mapHeight = e.length),
          (this.mapWidth = ((r = e[0]) == null ? void 0 : r.length) || 0),
          (this.tileSize = i || 32);
        const a = new Array(this.mapWidth * this.mapHeight).fill(0);
        for (let h = 0; h < this.mapHeight; h++)
          for (let o = 0; o < this.mapWidth; o++) a[h * this.mapWidth + o] = e[h][o];
        this.layersData.push(a);
      } else {
        (this.mapWidth = e.width),
          (this.mapHeight = e.height),
          (this.tileSize = e.tilewidth),
          (this.tilesets = e.tilesets ?? []),
          this._initTilesetGrid();
        for (const a of e.layers)
          a.type === 'tilelayer' && a.visible !== !1 && this.layersData.push(a.data);
      }
      const s = this.mapWidth * this.mapHeight;
      this.flatTiles = new Int32Array(s * this.layersData.length);
      for (let a = 0; a < this.layersData.length; a++) {
        this.activeTiles.set(a, new Int32Array(s).fill(-1));
        const h = this.layersData[a],
          o = a * s;
        for (let u = 0; u < s; u++) this.flatTiles[o + u] = h[u] ?? 0;
      }
      if (
        ((this.collision = new Uint8Array(s * this.layersData.length)),
        (this.layerScrollX = new Float32Array(this.layersData.length)),
        (this.layerScrollY = new Float32Array(this.layersData.length)),
        !Array.isArray(e))
      ) {
        for (const a of e.objectlayers ?? [])
          if (a.visible !== !1)
            for (const h of a.objects ?? []) {
              if (h.gid === void 0 || h.width <= 0 || h.height <= 0) continue;
              const o = Math.floor(h.x / this.tileSize),
                u = Math.floor(h.y / this.tileSize),
                l = Math.max(1, Math.floor(h.width / this.tileSize)),
                d = Math.max(1, Math.floor(h.height / this.tileSize));
              this._markCollision(o, u, l, d, 1);
            }
      }
    }
    createBlankLayer() {
      if (this.layersData.length >= this.maxLayers)
        return console.warn('Tilemap: レイヤー数が上限に達しました。'), null;
      const t = this.layersData.length,
        e = this.cellsPerLayer;
      return (
        this.layersData.push(new Array(e).fill(0)),
        (this.flatTiles = this._growFlatTiles(t + 1)),
        this.activeTiles.set(t, new Int32Array(e).fill(-1)),
        (this.collision = this._growUint8(this.collision, (t + 1) * e)),
        (this.layerScrollX = this._growFloat32(this.layerScrollX, t + 1)),
        (this.layerScrollY = this._growFloat32(this.layerScrollY, t + 1)),
        this.getLayer(t)
      );
    }
    createLayer(t, e, i) {
      return this.isLayerValid(t) ? this.getLayer(t) : null;
    }
    setTileAt(t, e, i, s) {
      if (!this.isLayerValid(t) || e < 0 || e >= this.mapWidth || i < 0 || i >= this.mapHeight)
        return !1;
      const r = t * this.cellsPerLayer + i * this.mapWidth + e;
      return (this.flatTiles[r] = s), (this.layersData[t][i * this.mapWidth + e] = s), !0;
    }
    findTileAt(t, e, i) {
      if (!this.isLayerValid(t)) return -1;
      const s = Math.floor(e / this.tileSize) - Math.floor(this.layerScrollX[t] / this.tileSize),
        r = Math.floor(i / this.tileSize) - Math.floor(this.layerScrollY[t] / this.tileSize);
      if (s < 0 || s >= this.mapWidth || r < 0 || r >= this.mapHeight) return -1;
      const a = this.flatTiles[t * this.cellsPerLayer + r * this.mapWidth + s];
      return a > 0 ? a : -1;
    }
    getTilesWithinWorldXY(t, e, i, s, r, a) {
      if (!this.isLayerValid(e)) return 0;
      const h = Math.floor(this.layerScrollX[e] / this.tileSize),
        o = Math.floor(this.layerScrollY[e] / this.tileSize),
        u = Math.max(0, Math.floor(i / this.tileSize) - h),
        l = Math.max(0, Math.floor(s / this.tileSize) - o),
        d = Math.min(this.mapWidth - 1, Math.floor((i + r) / this.tileSize) - h),
        c = Math.min(this.mapHeight - 1, Math.floor((s + a) / this.tileSize) - o),
        f = t.length;
      let _ = 0;
      for (let g = l; g <= c; g++)
        for (let p = u; p <= d; p++) {
          if (_ >= f) return _;
          const y = this.flatTiles[e * this.cellsPerLayer + g * this.mapWidth + p];
          y > 0 && (t[_++] = y);
        }
      return _;
    }
    _growFlatTiles(t) {
      const e = new Int32Array(this.cellsPerLayer * t);
      return e.set(this.flatTiles), e;
    }
    _growUint8(t, e) {
      const i = new Uint8Array(e);
      return i.set(t), i;
    }
    _growFloat32(t, e) {
      const i = new Float32Array(e);
      return i.set(t), i;
    }
    _initTilesetGrid() {
      const t = this.tilesets[0];
      if (t === void 0) {
        (this.tileCols = 1), (this.tileRows = 1);
        return;
      }
      this.tileCols = t.columns ?? 1;
      const e = t.count ?? 1;
      this.tileRows = Math.max(1, Math.ceil(e / this.tileCols));
    }
    setTileGrid(t, e) {
      t > 0 && (this.tileCols = t), e > 0 && (this.tileRows = e);
    }
    get layerCount() {
      return this.layersData.length;
    }
    getLayer(t) {
      let e = this._layerHandles.get(t);
      return e === void 0 && ((e = new ui(t, this)), this._layerHandles.set(t, e)), e;
    }
    isLayerValid(t) {
      return t >= 0 && t < this.layersData.length;
    }
    getFlatTiles() {
      return this.flatTiles;
    }
    get cellsPerLayer() {
      return this.mapWidth * this.mapHeight;
    }
    getLayerScrollX(t) {
      return this.isLayerValid(t) ? this.layerScrollX[t] : 0;
    }
    getLayerScrollY(t) {
      return this.isLayerValid(t) ? this.layerScrollY[t] : 0;
    }
    setLayerPosition(t, e, i) {
      this.isLayerValid(t) && ((this.layerScrollX[t] = e), (this.layerScrollY[t] = i));
    }
    findTile(t, e, i) {
      const s = this.getTileIndexAt(t, e, i);
      return s > 0 ? s : -1;
    }
    setCollisionByIndex(t, e) {
      const i = this.flatTiles.length;
      let s = 0;
      for (let r = 0; r < i; r++) this.flatTiles[r] === t && ((this.collision[r] = e ? 1 : 0), s++);
      return s;
    }
    _markCollision(t, e, i, s, r) {
      const a = this.cellsPerLayer;
      for (let h = 0; h < this.layersData.length; h++) {
        const o = h * a;
        for (let u = e; u < e + s; u++)
          if (!(u < 0 || u >= this.mapHeight))
            for (let l = t; l < t + i; l++)
              l < 0 || l >= this.mapWidth || (this.collision[o + u * this.mapWidth + l] = r);
      }
    }
    hasCollisionAt(t, e, i) {
      if (!this.isLayerValid(t) || e < 0 || e >= this.mapWidth || i < 0 || i >= this.mapHeight)
        return !1;
      const s = t * this.cellsPerLayer + i * this.mapWidth + e;
      return this.collision[s] === 1;
    }
    getTileIndexAt(t, e, i) {
      if (!this.isLayerValid(t) || e < 0 || e >= this.mapWidth || i < 0 || i >= this.mapHeight)
        return 0;
      const s = t * this.cellsPerLayer + i * this.mapWidth + e;
      return this.flatTiles[s];
    }
    gidToFrame(t) {
      if (t <= 0 || this.tilesets.length === 0) return -1;
      for (let e = this.tilesets.length - 1; e >= 0; e--) {
        const i = this.tilesets[e];
        if (t >= i.firstgid) {
          const s = t - i.firstgid,
            r = i.columns ?? this.tileCols,
            a = i.count ?? r * this.tileRows;
          return s < 0 || s >= a || (this.tileRows > 0 && Math.floor(s / r) >= this.tileRows)
            ? -1
            : s;
        }
      }
      return -1;
    }
    updateCulling(t, e, i, s = 1) {
      const r = e / 2 / t.zoom,
        a = i / 2 / t.zoom,
        h = Math.max(0, Math.floor((t.x - r) / this.tileSize) - s),
        o = Math.max(0, Math.floor((t.y - a) / this.tileSize) - s),
        u = Math.min(this.mapWidth - 1, Math.floor((t.x + r) / this.tileSize) + s),
        l = Math.min(this.mapHeight - 1, Math.floor((t.y + a) / this.tileSize) + s);
      if (
        h === this.lastStartX &&
        o === this.lastStartY &&
        u === this.lastEndX &&
        l === this.lastEndY
      )
        return;
      for (let c = 0; c < this.layersData.length; c++) {
        const f = this.activeTiles.get(c);
        for (let _ = this.lastStartY; _ <= this.lastEndY; _++)
          if (!(_ < 0 || _ >= this.mapHeight)) {
            for (let g = this.lastStartX; g <= this.lastEndX; g++)
              if (!(g < 0 || g >= this.mapWidth) && (g < h || g > u || _ < o || _ > l)) {
                const p = _ * this.mapWidth + g,
                  y = f[p];
                y !== -1 && (this.arena.free(y), (f[p] = -1));
              }
          }
      }
      const d = this.cellsPerLayer;
      for (let c = 0; c < this.layersData.length; c++) {
        const f = this.activeTiles.get(c),
          _ = c * d,
          g = this.layerScrollX[c],
          p = this.layerScrollY[c];
        for (let y = o; y <= l; y++)
          for (let v = h; v <= u; v++) {
            const m = y * this.mapWidth + v,
              F = this.flatTiles[_ + m];
            if (!(F <= 0))
              if (f[m] === -1) {
                const w = this.arena.allocate();
                if (w === -1) continue;
                const x = this.arena.idToIndex[w];
                this.arena.setPosX(x, v * this.tileSize + this.tileSize / 2 + g),
                  this.arena.setPosY(x, y * this.tileSize + this.tileSize / 2 + p),
                  this.arena.setFrameSize(x, this.tileSize, this.tileSize, !1),
                  this.arena.setTint(x, 4294967295);
                const A = this.gidToFrame(F);
                A >= 0 && this._applyTileUv(w, A), (f[m] = w);
              } else {
                const w = this.arena.idToIndex[f[m]];
                w >= 0 &&
                  (this.arena.setPosX(w, v * this.tileSize + this.tileSize / 2 + g),
                  this.arena.setPosY(w, y * this.tileSize + this.tileSize / 2 + p));
              }
          }
      }
      (this.lastStartX = h), (this.lastStartY = o), (this.lastEndX = u), (this.lastEndY = l);
    }
    _applyTileUv(t, e) {
      const i = this.arena.idToIndex[t];
      if (i < 0) return;
      const s = this.arena.assetRef[i];
      if (!s || !s.frames || s.frames.length === 0 || e >= s.frames.length) return;
      const r = s.frames[e];
      this.arena.setUv4(i, r.uvX, r.uvY, r.uvW, r.uvH), (this.arena.srcFrame[i] = e);
    }
    destroy() {
      for (let t = 0; t < this.layersData.length; t++) {
        const e = this.activeTiles.get(t);
        for (let i = 0; i < e.length; i++) e[i] !== -1 && this.arena.free(e[i]);
      }
      (this.layersData = []), this.activeTiles.clear(), this._layerHandles.clear();
    }
  },
  _t = -1,
  kt = class {
    constructor(t, e) {
      n(this, 'id');
      n(this, '_manager');
      (this.id = t), (this._manager = e);
    }
    get isValid() {
      return this.id !== _t && this._manager.hasTimer(this.id);
    }
    get hasLoop() {
      return this._manager.isTimerLooping(this.id);
    }
    get isPaused() {
      return this._manager.isTimerPaused(this.id);
    }
    get delay() {
      return this._manager.getTimerDelay(this.id);
    }
    get repeatDelay() {
      return this._manager.getTimerRepeatDelay(this.id);
    }
    get elapsed() {
      return this._manager.getTimerElapsed(this.id);
    }
    get progress() {
      return this._manager.getTimerProgress(this.id);
    }
    setDelay(t) {
      return this._manager.setTimerDelay(this.id, t), this;
    }
    seek(t) {
      return this._manager.seekTimer(this.id, t), this;
    }
    reset() {
      return this._manager.resetTimer(this.id), this;
    }
    pause() {
      return this._manager.pauseTimer(this.id), this;
    }
    resume() {
      return this._manager.resumeTimer(this.id), this;
    }
    remove() {
      return this.id !== _t && (this._manager.removeEvent(this.id), (this.id = _t)), this;
    }
    destroy() {
      return this.remove();
    }
  },
  ci = class {
    constructor(t) {
      n(this, '_time');
      n(this, '_handles', new Map());
      this._time = t;
    }
    get fps() {
      return this._time.measuredFps;
    }
    get delta() {
      return this._time.deltaTime;
    }
    get now() {
      return this._time.time;
    }
    get timeScale() {
      return this._time.timeScale;
    }
    set timeScale(t) {
      this._time.timeScale = t < 0 ? 0 : t;
    }
    delayedCall(t, e, i) {
      const s = this._time.delayedCall(t * this._time.timeScale, e, i);
      return this._wrap(s);
    }
    addEvent(t) {
      const e = this._time.timeScale,
        i = this._time.addEvent({
          delay: t.delay * e,
          callback: t.callback,
          loop: t.loop,
          repeatDelay: t.repeatDelay === void 0 ? void 0 : t.repeatDelay * e,
          args: t.args,
        });
      return this._wrap(i);
    }
    removeEvent(t) {
      this._time.removeEvent(t), this._handles.delete(t);
    }
    clear() {
      this._time.clearTimers(), this._handles.clear();
    }
    get activeTimerCount() {
      return this._time.activeTimerCount;
    }
    smoothStep(t) {
      const e = t < 0 ? 0 : t > 1 ? 1 : t;
      return e * e * (3 - 2 * e);
    }
    _wrap(t) {
      if (t < 0) return new kt(-1, this._time);
      let e = this._handles.get(t);
      return e === void 0 && ((e = new kt(t, this._time)), this._handles.set(t, e)), e;
    }
  },
  H = 64,
  xt = new Map(),
  di = H * 28,
  wt = new Float32Array(di),
  et = Math.PI,
  ht = 1.70158,
  rt = ht * 1.525,
  Rt = ht + 1,
  Gt = (2 * et) / 3,
  Lt = (2 * et) / 4.5,
  nt = 7.5625,
  Q = 2.75,
  fi = [
    (t) => t,
    (t) => t * t,
    (t) => 1 - (1 - t) * (1 - t),
    (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    (t) => t * t * t,
    (t) => 1 - Math.pow(1 - t, 3),
    (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    (t) => t * t * t * t,
    (t) => 1 - Math.pow(1 - t, 4),
    (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
    (t) => 1 - Math.cos((t * et) / 2),
    (t) => Math.sin((t * et) / 2),
    (t) => -(Math.cos(et * t) - 1) / 2,
    (t) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
    (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    (t) =>
      t === 0
        ? 0
        : t === 1
          ? 1
          : t < 0.5
            ? Math.pow(2, 20 * t - 10) / 2
            : (2 - Math.pow(2, -20 * t + 10)) / 2,
    (t) => 1 - Math.sqrt(1 - Math.pow(t, 2)),
    (t) => Math.sqrt(1 - Math.pow(t - 1, 2)),
    (t) =>
      t < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,
    (t) => Rt * t * t * t - ht * t * t,
    (t) => 1 + Rt * Math.pow(t - 1, 3) + ht * Math.pow(t - 1, 2),
    (t) =>
      t < 0.5
        ? (Math.pow(2 * t, 2) * ((rt + 1) * 2 * t - rt)) / 2
        : (Math.pow(2 * t - 2, 2) * ((rt + 1) * (t * 2 - 2) + rt) + 2) / 2,
    (t) => at(1 - t),
    (t) => at(t),
    (t) => (t < 0.5 ? (1 - at(1 - 2 * t)) / 2 : (1 + at(2 * t - 1)) / 2),
    (t) =>
      t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * Gt),
    (t) => (t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * Gt) + 1),
    (t) =>
      t === 0
        ? 0
        : t === 1
          ? 1
          : t < 0.5
            ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * Lt)) / 2
            : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * Lt)) / 2 + 1,
  ];
function at(t) {
  if (t < 1 / Q) return nt * t * t;
  if (t < 2 / Q) {
    const i = t - 1.5 / Q;
    return nt * i * i + 0.75;
  }
  if (t < 2.5 / Q) {
    const i = t - 2.25 / Q;
    return nt * i * i + 0.9375;
  }
  const e = t - 2.625 / Q;
  return nt * e * e + 0.984375;
}
var Ut = !1;
function pi() {
  if (Ut) return;
  Ut = !0;
  for (let i = 0; i < 28; i++) {
    const s = fi[i],
      r = i * H;
    for (let a = 0; a < H; a++) {
      const h = a / (H - 1);
      wt[r + a] = s(h);
    }
  }
  const t = [
    'Linear',
    'QuadIn',
    'QuadOut',
    'QuadInOut',
    'CubicIn',
    'CubicOut',
    'CubicInOut',
    'QuartIn',
    'QuartOut',
    'QuartInOut',
    'SineIn',
    'SineOut',
    'SineInOut',
    'ExpoIn',
    'ExpoOut',
    'ExpoInOut',
    'CircIn',
    'CircOut',
    'CircInOut',
    'BackIn',
    'BackOut',
    'BackInOut',
    'BounceIn',
    'BounceOut',
    'BounceInOut',
    'ElasticIn',
    'ElasticOut',
    'ElasticInOut',
  ];
  for (let i = 0; i < t.length; i++) xt.set(t[i].toLowerCase(), i);
  const e = {
    'quad.in': 1,
    'quad.out': 2,
    'quad.inout': 3,
    'cubic.in': 4,
    'cubic.out': 5,
    'cubic.inout': 6,
    'sine.in': 10,
    'sine.out': 11,
    'sine.inout': 12,
    'expo.in': 13,
    'expo.out': 14,
    'expo.inout': 15,
    'circ.in': 16,
    'circ.out': 17,
    'circ.inout': 18,
    'back.in': 19,
    'back.out': 20,
    'back.inout': 21,
    'bounce.in': 22,
    'bounce.out': 23,
    'bounce.inout': 24,
    'elastic.in': 25,
    'elastic.out': 26,
    'elastic.inout': 27,
    quadin: 1,
    quadout: 2,
    quadinout: 3,
    cubicin: 4,
    cubicout: 5,
    cubicinout: 6,
  };
  for (const i of Object.keys(e)) xt.set(i, e[i]);
}
pi();
function _i(t) {
  if (t === void 0) return 0;
  if (typeof t == 'number') return t;
  const e = mi(String(t)),
    i = xt.get(e);
  return i === void 0 ? 0 : i;
}
function mi(t) {
  let e = t.toLowerCase().replace(/[\s_-]/g, '');
  const i = e.lastIndexOf('.');
  return i >= 0 && (e = e.slice(0, i + 1) + e.slice(i + 1).replace(/^ease/, '')), e;
}
function zt(t, e) {
  const i = t * H;
  if (e <= 0) return 0;
  if (e >= 1) return 1;
  const s = e * (H - 1),
    r = s | 0,
    a = r + 1 < H ? r + 1 : H - 1,
    h = s - r,
    o = wt[i + r],
    u = wt[i + a];
  return o + (u - o) * h;
}
var mt = -1,
  gi = class {
    constructor(t, e) {
      n(this, 'id');
      n(this, '_manager');
      (this.id = t), (this._manager = e);
    }
    get isValid() {
      return this.id !== mt && this._manager.isGroupActive(this.id);
    }
    get isPlaying() {
      return this._manager.isGroupActive(this.id);
    }
    get isPaused() {
      return this._manager.isGroupPaused(this.id);
    }
    get isDestroyed() {
      return !this.isValid;
    }
    get progress() {
      return this._manager.getGroupProgress(this.id);
    }
    get elapsed() {
      return this._manager.getGroupElapsed(this.id);
    }
    get duration() {
      return this._manager.getGroupDuration(this.id);
    }
    getProgress() {
      return this._manager.getGroupProgress(this.id);
    }
    pause() {
      return this._manager.pauseGroup(this.id), this;
    }
    resume() {
      return this._manager.resumeGroup(this.id), this;
    }
    play() {
      return this;
    }
    stop() {
      return this.id !== mt && (this._manager.stopGroup(this.id), (this.id = mt)), this;
    }
    reset() {
      return this.isValid && this._manager.resetGroup(this.id), this;
    }
    seek(t) {
      return this.isValid && this._manager.seekGroup(this.id, t), this;
    }
  },
  yi = new Map([
    ['x', 0],
    ['y', 1],
    ['scale', 2],
    ['scaleX', 2],
    ['scaleY', 2],
    ['tint', 3],
    ['alpha', 4],
    ['rotation', 5],
    ['angle', 5],
    ['flipX', 6],
  ]);
function vi(t) {
  return yi.get(t) ?? null;
}
var xi = class {
    constructor(t, e = 1e4) {
      n(this, 'capacity');
      n(this, '_activeCount', 0);
      n(this, 'active');
      n(this, 'entityId');
      n(this, 'propType');
      n(this, 'startVal');
      n(this, 'endVal');
      n(this, 'duration');
      n(this, 'elapsed');
      n(this, 'delay');
      n(this, 'easeKind');
      n(this, 'yoyo');
      n(this, 'direction');
      n(this, 'repeatLeft');
      n(this, 'groupId');
      n(this, 'started');
      n(this, 'paused');
      n(this, 'callbacks');
      n(this, 'freeList');
      n(this, 'freeListHead', 0);
      n(this, '_arena');
      n(this, 'chainQueue', new Map());
      n(this, '_handles', new Map());
      n(this, '_nextGroupId', 0);
      n(this, 'groupLive', new Map());
      n(this, 'groupCallbacks', new Map());
      (this._arena = t),
        (this.capacity = e),
        (this.active = new Uint8Array(e)),
        (this.entityId = new Int32Array(e)),
        (this.propType = new Uint8Array(e)),
        (this.startVal = new Float32Array(e)),
        (this.endVal = new Float32Array(e)),
        (this.duration = new Float32Array(e)),
        (this.elapsed = new Float32Array(e)),
        (this.delay = new Float32Array(e)),
        (this.easeKind = new Uint8Array(e)),
        (this.yoyo = new Uint8Array(e)),
        (this.direction = new Uint8Array(e)),
        (this.repeatLeft = new Int32Array(e)),
        (this.groupId = new Int32Array(e)),
        (this.started = new Uint8Array(e)),
        (this.paused = new Uint8Array(e)),
        (this.callbacks = new Array(e).fill(null)),
        (this.freeList = new Int32Array(e));
      for (let i = 0; i < e; i++) this.freeList[i] = i;
    }
    _addSlot(t, e, i, s, r) {
      if (this.freeListHead >= this.capacity) return -1;
      const a = this.freeList[this.freeListHead++];
      return (
        (this.active[a] = 1),
        this._activeCount++,
        (this.entityId[a] = t),
        (this.propType[a] = e),
        (this.startVal[a] = i),
        (this.endVal[a] = s),
        (this.duration[a] = r),
        (this.elapsed[a] = 0),
        (this.delay[a] = 0),
        (this.easeKind[a] = 0),
        (this.yoyo[a] = 0),
        (this.direction[a] = 0),
        (this.started[a] = 0),
        (this.paused[a] = 0),
        (this.callbacks[a] = null),
        (this.repeatLeft[a] = 0),
        (this.groupId[a] = -1),
        a
      );
    }
    add(t) {
      const e = this._nextGroupId++;
      return this._addOne(t, e), this._wrap(e);
    }
    chain(t) {
      const e = this._nextGroupId++;
      return (
        t.length > 0 && (this.chainQueue.set(e, { list: t, index: 0 }), this._addOne(t[0], e)),
        this._wrap(e)
      );
    }
    _wrap(t) {
      let e = this._handles.get(t);
      return e === void 0 && ((e = new gi(t, this)), this._handles.set(t, e)), e;
    }
    _addOne(t, e) {
      const i = Array.isArray(t.targets) ? t.targets : [t.targets],
        s = t.duration ?? 1e3,
        r = t.delay ?? 0,
        a = _i(t.ease),
        h = t.repeat ?? 0,
        o = t.yoyo ? 1 : 0,
        u = t.props,
        l = Object.keys(u);
      let d = !0,
        c = 0;
      for (let f = 0; f < i.length; f++) {
        const _ = i[f];
        if (_ == null) continue;
        const g = _.id;
        for (let p = 0; p < l.length; p++) {
          const y = l[p],
            v = vi(y);
          if (v === null) continue;
          const m = this._addSlot(g, v, 0, u[y], s);
          m !== -1 &&
            ((this.delay[m] = r),
            (this.easeKind[m] = a),
            (this.repeatLeft[m] = h),
            (this.yoyo[m] = o),
            (this.groupId[m] = e),
            (this.startVal[m] = this._readCurrent(g, v)),
            c++,
            d && (this.callbacks[m] = t),
            (d = !1));
        }
      }
      c > 0 && (this.groupLive.set(e, c), t.onComplete !== void 0 && this.groupCallbacks.set(e, t));
    }
    _readCurrent(t, e) {
      const i = this._arena,
        s = i.idToIndex[t];
      if (s < 0) return 0;
      switch (e) {
        case 0:
          return i.posX[s];
        case 1:
          return i.posY[s];
        case 2:
          return i.scaleX[s];
        case 3:
          return i.tint[s];
        case 4:
          return ((i.tint[s] >>> 24) & 255) / 255;
        case 5:
          return i.rotation[s];
        case 6:
          return i.facing[s] < 0 ? 1 : 0;
      }
      return 0;
    }
    killTweensOf(t) {
      const e = typeof t == 'number' ? t : t.id;
      let i = 0;
      for (let s = 0; s < this.capacity; s++)
        this.active[s] !== 0 && this.entityId[s] === e && (this._freeSilent(s), i++);
      return i;
    }
    killTweensOfGroup(t) {
      const e = typeof t == 'number' ? t : t.id;
      let i = 0;
      for (let s = 0; s < this.capacity; s++)
        this.active[s] !== 0 && this.groupId[s] === e && (this._freeSilent(s), i++);
      return i;
    }
    get count() {
      return this._activeCount;
    }
    isGroupActive(t) {
      if (t < 0) return !1;
      for (let e = 0; e < this.capacity; e++)
        if (this.active[e] === 1 && this.groupId[e] === t) return !0;
      return !1;
    }
    isGroupPlaying(t) {
      return this.isGroupActive(t);
    }
    isGroupPaused(t) {
      if (t < 0) return !1;
      for (let e = 0; e < this.capacity; e++)
        if (this.active[e] === 1 && this.groupId[e] === t) return this.paused[e] === 1;
      return !1;
    }
    getGroupProgress(t) {
      if (t < 0) return 0;
      let e = 0,
        i = !1;
      for (let s = 0; s < this.capacity; s++) {
        if (this.active[s] === 0 || this.groupId[s] !== t) continue;
        const r = this.duration[s],
          a = r > 0 ? this.elapsed[s] / r : 0;
        a > e && (e = a), (i = !0);
      }
      return i ? (e > 1 ? 1 : e) : 0;
    }
    getGroupElapsed(t) {
      if (t < 0) return 0;
      let e = 0;
      for (let i = 0; i < this.capacity; i++)
        this.active[i] === 0 ||
          this.groupId[i] !== t ||
          (this.elapsed[i] > e && (e = this.elapsed[i]));
      return e;
    }
    getGroupDuration(t) {
      if (t < 0) return 0;
      let e = 0;
      for (let i = 0; i < this.capacity; i++)
        this.active[i] === 0 ||
          this.groupId[i] !== t ||
          (this.duration[i] > e && (e = this.duration[i]));
      return e;
    }
    pauseGroup(t) {
      if (!(t < 0))
        for (let e = 0; e < this.capacity; e++)
          this.active[e] === 1 && this.groupId[e] === t && (this.paused[e] = 1);
    }
    resumeGroup(t) {
      if (!(t < 0))
        for (let e = 0; e < this.capacity; e++)
          this.active[e] === 1 && this.groupId[e] === t && (this.paused[e] = 0);
    }
    stopGroup(t) {
      let e = 0;
      for (let i = 0; i < this.capacity; i++)
        this.active[i] === 0 || this.groupId[i] !== t || (this._freeSilent(i), e++);
      return e;
    }
    resetGroup(t) {
      if (!(t < 0))
        for (let e = 0; e < this.capacity; e++)
          this.active[e] === 0 ||
            this.groupId[e] !== t ||
            ((this.elapsed[e] = 0),
            (this.direction[e] = 0),
            (this.started[e] = 0),
            (this.paused[e] = 0),
            (this.repeatLeft[e] = 0),
            this._applyValue(e, 0));
    }
    seekGroup(t, e) {
      if (!(t < 0))
        for (let i = 0; i < this.capacity; i++) {
          if (this.active[i] === 0 || this.groupId[i] !== t) continue;
          const s = this.duration[i];
          this.elapsed[i] = e < 0 ? 0 : e > s ? s : e;
          const r = s > 0 ? this.elapsed[i] / s : 0;
          this._applyValue(i, r);
        }
    }
    free(t) {
      this._release(t, !0);
    }
    _freeSilent(t) {
      this._release(t, !1);
    }
    _release(t, e) {
      if (t < 0 || t >= this.capacity || this.active[t] === 0) return;
      (this.active[t] = 0),
        (this.paused[t] = 0),
        (this.callbacks[t] = null),
        this._activeCount--,
        (this.freeList[--this.freeListHead] = t);
      const i = this.groupId[t];
      if (((this.groupId[t] = -1), i < 0)) return;
      if (e) {
        this._retireGroupSlot(i);
        return;
      }
      const s = this.groupLive.get(i);
      if (s !== void 0) {
        if (s > 1) {
          this.groupLive.set(i, s - 1);
          return;
        }
        this.groupLive.delete(i), this.groupCallbacks.delete(i), this.chainQueue.delete(i);
      }
    }
    _retireGroupSlot(t) {
      var a;
      const e = this.groupLive.get(t);
      if (e === void 0) return;
      if (e > 1) {
        this.groupLive.set(t, e - 1);
        return;
      }
      this.groupLive.delete(t);
      const i = this.groupCallbacks.get(t);
      this.groupCallbacks.delete(t);
      const s = this.chainQueue.get(t);
      let r;
      s !== void 0 &&
        (s.index++, s.index < s.list.length ? (r = s.list[s.index]) : this.chainQueue.delete(t)),
        (a = i == null ? void 0 : i.onComplete) == null || a.call(i),
        r !== void 0 && this._addOne(r, t);
    }
    update(t) {
      var e, i;
      if (this._activeCount !== 0)
        for (let s = 0; s < this.capacity; s++) {
          if (this.active[s] === 0 || this.paused[s] === 1) continue;
          let r = t;
          if (
            this.delay[s] > 0 &&
            ((this.delay[s] -= t),
            this.delay[s] > 0 || ((r = -this.delay[s]), (this.delay[s] = 0), r <= 0))
          )
            continue;
          const a = this.callbacks[s];
          a !== null &&
            this.started[s] === 0 &&
            ((this.started[s] = 1), (e = a.onStart) == null || e.call(a)),
            (this.elapsed[s] += r);
          let h = this.duration[s] > 0 ? this.elapsed[s] / this.duration[s] : 1;
          h > 1 && (h = 1);
          const o = zt(this.easeKind[s], h),
            u = this.entityId[s];
          u >= 0 && this._apply(s, u, o),
            h >= 1 && this._advance(s),
            a !== null && ((i = a.onUpdate) == null || i.call(a));
        }
    }
    _applyValue(t, e) {
      const i = this.entityId[t];
      i < 0 || this._apply(t, i, zt(this.easeKind[t], e));
    }
    _apply(t, e, i) {
      const s = this._arena,
        r = s.idToIndex[e];
      if (r < 0) return;
      const a = this.direction[t],
        h = a === 0 ? this.startVal[t] : this.endVal[t],
        o = a === 0 ? this.endVal[t] : this.startVal[t],
        u = h + (o - h) * i;
      switch (this.propType[t]) {
        case 0:
          s.setPosX(r, u);
          break;
        case 1:
          s.setPosY(r, u);
          break;
        case 2:
          s.setScale(r, u);
          break;
        case 3:
          s.setTint(r, u >>> 0);
          break;
        case 4: {
          const l = s.tint[r],
            d = Math.max(0, Math.min(255, Math.round(u * 255)));
          s.setTint(r, ((l & 16777215) | (d << 24)) >>> 0);
          break;
        }
        case 5:
          s.setRotation(r, u);
          break;
        case 6:
          s.setFacing(r, u >= 0.5 ? -1 : 1);
          break;
      }
    }
    _advance(t) {
      if (this.yoyo[t] === 1 && this.direction[t] === 0) {
        (this.direction[t] = 1), (this.elapsed[t] = 0);
        return;
      }
      const e = this.repeatLeft[t];
      if (e === -1) {
        (this.elapsed[t] = 0), (this.direction[t] = 0);
        return;
      }
      if (e > 0) {
        (this.repeatLeft[t] = e - 1), (this.elapsed[t] = 0), (this.direction[t] = 0);
        return;
      }
      this.free(t);
    }
    clear() {
      (this._activeCount = 0),
        (this.freeListHead = 0),
        this.active.fill(0),
        this.paused.fill(0),
        this.groupId.fill(-1),
        this.groupLive.clear(),
        this.groupCallbacks.clear(),
        this.chainQueue.clear(),
        this._handles.clear(),
        this.callbacks.fill(null);
      for (let t = 0; t < this.capacity; t++) this.freeList[t] = t;
    }
  },
  wi = 8,
  Ot = class {
    constructor(t = '') {
      n(this, 'x', 0);
      n(this, 'y', 0);
      n(this, 'zoom', 1);
      n(this, 'rotation', 0);
      n(this, 'backgroundColor', 0);
      n(this, 'name', '');
      n(this, 'visible', !0);
      n(this, 'shakeIntensity', 0);
      n(this, 'shakeDuration', 0);
      n(this, 'shakeTime', 0);
      n(this, 'shakeX', 0);
      n(this, 'shakeY', 0);
      n(this, 'followId', -1);
      n(this, 'followLerpX', 0);
      n(this, 'followLerpY', 0);
      n(this, '_fadeAlpha', 1);
      n(this, '_fadeColorR', 0);
      n(this, '_fadeColorG', 0);
      n(this, '_fadeColorB', 0);
      n(this, '_fadeEffect', -1);
      n(this, '_effects', []);
      n(this, '_fadeCallback', null);
      this.name = t;
      for (let e = 0; e < wi; e++)
        this._effects.push({
          kind: 0,
          time: 0,
          duration: 1,
          from: 0,
          to: 0,
          delay: 0,
          fromX: 0,
          fromY: 0,
          toX: 0,
          toY: 0,
          active: !1,
        });
    }
    setScroll(t, e) {
      return (this.x = t), (this.y = e), this;
    }
    setScrollX(t) {
      return (this.x = t), this;
    }
    setScrollY(t) {
      return (this.y = t), this;
    }
    get scrollX() {
      return this.x;
    }
    set scrollX(t) {
      this.x = t;
    }
    get scrollY() {
      return this.y;
    }
    set scrollY(t) {
      this.y = t;
    }
    setZoom(t) {
      return t > 0 && (this.zoom = t), this;
    }
    setRotation(t) {
      return (this.rotation = (t * Math.PI) / 180), this;
    }
    get angle() {
      return (this.rotation * 180) / Math.PI;
    }
    set angle(t) {
      this.rotation = (t * Math.PI) / 180;
    }
    getCenter(t, e, i) {
      return (t.x = this.actualX + e * 0.5), (t.y = this.actualY + i * 0.5), this;
    }
    get centerX() {
      return this.actualX;
    }
    set centerX(t) {
      this.x = t;
    }
    get centerY() {
      return this.actualY;
    }
    set centerY(t) {
      this.y = t;
    }
    centerOn(t, e, i = 0, s = 0) {
      return (this.x = t - i * 0.5), (this.y = e - s * 0.5), this;
    }
    getWorldPoint(t, e, i, s, r) {
      const a = this.zoom !== 0 ? this.zoom : 1;
      return (
        (r.x = this.actualX + (t - i * 0.5) / a), (r.y = this.actualY + (e - s * 0.5) / a), this
      );
    }
    getWorldBounds(t, e, i) {
      const s = this.zoom !== 0 ? this.zoom : 1,
        r = (e * 0.5) / s,
        a = (i * 0.5) / s;
      return (
        (t.x = this.actualX - r),
        (t.y = this.actualY - a),
        (t.width = r * 2),
        (t.height = a * 2),
        this
      );
    }
    setBackgroundColor(t) {
      if (typeof t == 'string') {
        const e = Number.parseInt(t.replace('#', ''), 16);
        this.backgroundColor = Number.isNaN(e) ? 0 : e;
      } else this.backgroundColor = t;
      return this;
    }
    startFollow(t, e = 0, i = 0) {
      return (this.followId = t), (this.followLerpX = e), (this.followLerpY = i), this;
    }
    stopFollow() {
      return (this.followId = -1), (this.followLerpX = 0), (this.followLerpY = 0), this;
    }
    get isFollowing() {
      return this.followId >= 0;
    }
    fadeIn(t, e = 0, i = 0, s = 0, r) {
      return (
        (this._fadeColorR = e / 255),
        (this._fadeColorG = i / 255),
        (this._fadeColorB = s / 255),
        (this._fadeEffect = -1),
        this._startEffect(0, t / 1e3, 0, 1, 0),
        (this._fadeCallback = r ?? null),
        this
      );
    }
    fadeOut(t, e = 0, i = 0, s = 0, r) {
      return (
        (this._fadeColorR = e / 255),
        (this._fadeColorG = i / 255),
        (this._fadeColorB = s / 255),
        (this._fadeEffect = -1),
        this._startEffect(0, t / 1e3, 1, 0, 0),
        (this._fadeCallback = r ?? null),
        this
      );
    }
    fadeComplete() {
      for (let t = 0; t < this._effects.length; t++)
        this._effects[t].kind === 0 &&
          ((this._effects[t].active = !1), (this._fadeAlpha = this._effects[t].to));
      return this;
    }
    get isFading() {
      for (let t = 0; t < this._effects.length; t++) {
        const e = this._effects[t];
        if (e.active && e.kind === 0) return !0;
      }
      return !1;
    }
    get progress() {
      for (let t = 0; t < this._effects.length; t++) {
        const e = this._effects[t];
        if (e.active && e.kind === 0)
          return e.duration <= 0 ? 1 : 1 - Math.max(0, e.time) / e.duration;
      }
      return 1;
    }
    setFadeEffect(t) {
      return (this._fadeEffect = t), this;
    }
    get fadeEffect() {
      return this._fadeEffect;
    }
    getFadeColor(t) {
      return (
        (t[0] = this._fadeColorR),
        (t[1] = this._fadeColorG),
        (t[2] = this._fadeColorB),
        (t[3] = this._fadeAlpha),
        this
      );
    }
    pan(t, e, i = 1e3, s = !1, r = 0) {
      const a = this._allocEffect();
      return a === null
        ? this
        : ((a.kind = 1),
          (a.duration = i > 0 ? i / 1e3 : 1e-6),
          (a.time = a.duration),
          (a.delay = r > 0 ? r / 1e3 : 0),
          (a.fromX = this.x),
          (a.fromY = this.y),
          (a.toX = t),
          (a.toY = e),
          (a.active = !0),
          this);
    }
    zoomTo(t, e = 1e3, i = !1, s = 0) {
      return this._startEffect(2, e / 1e3, this.zoom, t, s / 1e3), this;
    }
    shake(t, e) {
      (this.shakeIntensity = t), (this.shakeDuration = e > 0 ? e : 1e-6), (this.shakeTime = e);
    }
    stopShake() {
      (this.shakeTime = 0), (this.shakeX = 0), (this.shakeY = 0);
    }
    update(t, e = -1, i = -1) {
      this._updateShake(t), this._updateFollow(t, e, i), this._updateEffects(t);
    }
    _updateShake(t) {
      if (this.shakeTime > 0)
        if (((this.shakeTime -= t), this.shakeTime <= 0))
          (this.shakeTime = 0), (this.shakeX = 0), (this.shakeY = 0);
        else {
          const e = this.shakeIntensity * (this.shakeTime / this.shakeDuration);
          (this.shakeX = (Math.random() - 0.5) * 2 * e),
            (this.shakeY = (Math.random() - 0.5) * 2 * e);
        }
      else (this.shakeX = 0), (this.shakeY = 0);
    }
    _updateFollow(t, e, i) {
      this.followId < 0 ||
        e < 0 ||
        (this.followLerpX <= 0
          ? (this.x = e)
          : (this.x += (e - this.x) * Math.min(1, this.followLerpX * t)),
        this.followLerpY <= 0
          ? (this.y = i)
          : (this.y += (i - this.y) * Math.min(1, this.followLerpY * t)));
    }
    _updateEffects(t) {
      const e = this._effects;
      for (let i = 0; i < e.length; i++) {
        const s = e[i];
        if (s.active) {
          if (s.delay > 0) {
            if (((s.delay -= t), s.delay > 0)) continue;
            const r = -s.delay;
            (s.delay = 0),
              this._applyEffect(s, Math.min(r, s.time)),
              (s.time -= r),
              s.time <= 0 && this._finishEffect(s);
            continue;
          }
          (s.time -= t),
            this._applyEffect(s, Math.max(0, s.time)),
            s.time <= 0 && this._finishEffect(s);
        }
      }
    }
    _applyEffect(t, e) {
      const i = t.duration > 0 ? 1 - e / t.duration : 1,
        s = Math.max(0, Math.min(1, i)),
        r = s * s * (3 - 2 * s);
      switch (t.kind) {
        case 0:
          this._fadeAlpha = t.from + (t.to - t.from) * r;
          break;
        case 1:
          (this.x = t.fromX + (t.toX - t.fromX) * r), (this.y = t.fromY + (t.toY - t.fromY) * r);
          break;
        case 2:
          this.zoom = t.from + (t.to - t.from) * r;
          break;
      }
    }
    _finishEffect(t) {
      if (((t.active = !1), t.kind === 0)) {
        this._fadeAlpha = t.to;
        const e = this._fadeCallback;
        e !== null && ((this._fadeCallback = null), e());
      }
    }
    _startEffect(t, e, i, s, r) {
      const a = this._allocEffect();
      a !== null &&
        ((a.kind = t),
        (a.duration = e > 0 ? e : 1e-6),
        (a.time = a.duration),
        (a.from = i),
        (a.to = s),
        (a.delay = r),
        (a.fromX = this.x),
        (a.fromY = this.y),
        (a.active = !0));
    }
    _allocEffect() {
      const t = this._effects;
      for (let e = 0; e < t.length; e++) if (!t[e].active) return (t[e].active = !0), t[e];
      return null;
    }
    get actualX() {
      return this.x + this.shakeX;
    }
    get actualY() {
      return this.y + this.shakeY;
    }
  },
  Wt = 8,
  Fi = class {
    constructor(t) {
      n(this, '_cameras', []);
      n(this, '_byName', new Map());
      n(this, '_main');
      (this._main = new Ot('main')),
        this._cameras.push(this._main),
        this._byName.set('main', this._main);
    }
    get main() {
      return this._main;
    }
    get count() {
      return this._cameras.length;
    }
    add(t = 0, e = 0, i = '') {
      if (this._cameras.length >= Wt)
        return (
          console.warn(`CameraManager: カメラ数が上限 (${Wt}) に達したため追加できません。`), null
        );
      const s = new Ot(i.length > 0 ? i : `camera${this._cameras.length}`);
      return (s.x = t), (s.y = e), this._cameras.push(s), this._byName.set(s.name, s), s;
    }
    getCamera(t) {
      return this._byName.get(t) ?? null;
    }
    getCameras() {
      return this._cameras;
    }
    collectForRender(t) {
      let e = 0;
      for (let i = 0; i < this._cameras.length; i++) {
        const s = this._cameras[i];
        s.visible && (t[e++] = s);
      }
      return e;
    }
    update(t, e = -1, i = -1, s = -1) {
      for (let r = 0; r < this._cameras.length; r++) {
        const a = this._cameras[r];
        a.update(t, a.isFollowing ? i : -1, a.isFollowing ? s : -1);
      }
    }
  },
  Y = {
    Sprites: 1,
    Tilemap: 2,
    Tweens: 4,
    Anims: 8,
    Physics: 32,
    Particles: 128,
    Sound: 256,
    Camera: 512,
  },
  Ti = class {
    constructor(t = {}) {
      n(this, 'id', '');
      n(this, 'scene');
      n(this, 'engine');
      n(this, 'arena');
      n(this, 'input');
      n(this, 'load');
      n(this, 'textures');
      n(this, 'events', new ze());
      n(this, '_ownRegistry', new Vt());
      n(this, 'cameras');
      n(this, 'camera');
      n(this, '_plugins', []);
      n(this, '_tilemaps', []);
      n(this, '_paused', !1);
      n(this, '_timeFacade', null);
      n(this, '_world', null);
      n(this, '_bodyHandles', new Map());
      n(this, '_containerHandles', new Map());
      n(this, '_active', Y.Sprites | Y.Camera);
      n(this, '_tweens', null);
      n(this, '_anim', null);
      n(this, '_particles', null);
      n(this, '_physics', null);
      n(this, '_sound', null);
      n(this, '_followId', -1);
      n(this, '_followX', -1);
      n(this, '_followY', -1);
      n(this, '_hitBuffer', new Int32Array(64));
      n(this, '_fonts', new Map());
      n(this, 'math', Ze);
      n(this, 'add', {
        sprite: (t = 0, e = 0, i, s) => {
          const r = this.arena.allocate();
          if (r === -1) throw new Error('アリーナの容量に到達しました。');
          const a = this.arena.idToIndex[r];
          this.arena.setPosX(a, t), this.arena.setPosY(a, e);
          const h = new Te(r, this.arena);
          if (i) {
            const o = this.textures.get(i) || this.load.get(i);
            o && h.setTexture(o, s ?? 0);
          }
          return h;
        },
        text: (t = 0, e = 0, i = '', s = {}) => new lt(t, e, i, s, this.arena),
        tilemap: (t, e = 32) => {
          const i = new li(this.arena, t, e);
          return this._tilemaps.push(i), (this._active |= Y.Tilemap), i;
        },
        container: (t = 0, e = 0, i = []) => {
          const s = this.add.sprite(t, e);
          this._active |= Y.Sprites;
          const r = this.getContainer(s.id);
          for (let a = 0; a < i.length; a++) r.add(i[a].id);
          return r;
        },
        image: (t = 0, e = 0, i, s) => this.add.sprite(t, e, i, s),
        group: (t = []) => {
          const e = new vt();
          return e.addMultiple(t), e;
        },
        particles: (t = 0, e = 0, i = void 0, s = {}) => {
          const r = this.particles.create({ x: t, y: e, ...s });
          if (r === null) return null;
          if (i) {
            const a = this.textures.get(i) || this.load.get(i);
            a && r.setTexture(a);
          }
          return r;
        },
        bitmapText: (t = 0, e = 0, i = '', s, r) => {
          const a = new lt(t, e, i, { fontSize: s.size, lineSpacing: s.lineHeight }, this.arena);
          return a.setGlyphSource(new Me(s, this.textures.get(r ?? ''))), a;
        },
      });
      n(this, '_shapes', null);
      let e = 1e5;
      typeof t == 'string'
        ? (this.id = t)
        : ((this.id = t.id || this.constructor.name),
          (e = t.maxInstances ?? 1e5),
          Object.assign(this, t)),
        (this.arena = new Ae(e)),
        this._ensureBodyFactory(),
        (this.input = new Ve()),
        (this.textures = new je()),
        (this.load = new Ke(this.textures)),
        this.load.setSoundManagerFactory(() => this.sound),
        (this.cameras = new Fi(this)),
        (this.camera = this.cameras.main);
    }
    setCameraFollowTarget(t, e, i) {
      (this._followId = t), (this._followX = e), (this._followY = i);
    }
    get activeSubsystems() {
      return this._active;
    }
    hasSubsystem(t) {
      return (this._active & t) !== 0;
    }
    markSubsystem(t) {
      this._active |= t;
    }
    get tweens() {
      return (
        this._tweens === null && ((this._tweens = new xi(this.arena)), (this._active |= Y.Tweens)),
        this._tweens
      );
    }
    get anim() {
      return (
        this._anim === null &&
          ((this._anim = new Ge(this.arena)),
          (this._active |= Y.Anims),
          (this.arena.animTracker = this._anim)),
        this._anim
      );
    }
    get particles() {
      return (
        this._particles === null &&
          ((this._particles = new ei(this.arena.capacity)),
          this._particles.init(this),
          (this._active |= Y.Particles)),
        this._particles
      );
    }
    get sound() {
      return (
        this._sound === null && ((this._sound = new hi()), (this._active |= Y.Sound)), this._sound
      );
    }
    setSoundManager(t) {
      (this._sound = t), (this._active |= Y.Sound);
    }
    get physics() {
      return (
        this._physics === null &&
          ((this._physics = new ii(this.arena.capacity)),
          this._physics.init(this),
          (this._active |= Y.Physics)),
        this._physics
      );
    }
    _ensureBodyFactory() {
      this.arena.bodyFactory === null && (this.arena.bodyFactory = (t) => this.getBodyById(t));
    }
    get world() {
      return this._world ?? (this._world = new ri(this.physics));
    }
    getBody(t) {
      return this.getBodyById(t.id);
    }
    getBodyById(t) {
      this._ensureBodyFactory();
      let e = this._bodyHandles.get(t);
      return e === void 0 && ((e = new si(t, this.physics)), this._bodyHandles.set(t, e)), e;
    }
    getContainer(t) {
      let e = this._containerHandles.get(t);
      return e === void 0 && ((e = new Xe(t, this.arena)), this._containerHandles.set(t, e)), e;
    }
    get registry() {
      var t;
      return ((t = this.scene) == null ? void 0 : t.registry) ?? this._ownRegistry;
    }
    get scale() {
      return this.engine.scale;
    }
    get game() {
      return this.engine;
    }
    get scenePlugin() {
      return this.scene;
    }
    get time() {
      return this._timeFacade ?? (this._timeFacade = new ci(this.engine.time));
    }
    get anims() {
      return this.anim;
    }
    createFont(t = 'default', e = {}) {
      var a;
      const i = this._fonts.get(t);
      if (i) return i;
      const s = (a = this.engine) == null ? void 0 : a.device;
      if (!s) return null;
      const r = new De(s, t, e);
      return this._fonts.set(t, r), r;
    }
    getFont(t = 'default') {
      return this._fonts.get(t) ?? null;
    }
    addText(t, e, i, s = {}, r = 'default') {
      const a = new lt(t, e, i, s, this.arena),
        h = this.getFont(r);
      return h && a.setGlyphSource(h), a;
    }
    _addShape(t, e, i, s, r, a, h) {
      return (
        this._shapes ?? (this._shapes = new Bt(this.arena, (u, l) => this.textures.addCanvas(u, l)))
      ).add(t, e, i, s, r, a, h);
    }
    addRectangle(t, e, i, s, r = 16777215, a = 1) {
      const h = this._addShape(P.Rectangle, i, s, 0, 0, r, a);
      return h >= 0 && this._setShapePos(h, t, e), h;
    }
    addCircle(t, e, i, s = 16777215, r = 1) {
      const a = this._addShape(P.Circle, i * 2, i * 2, 0, 0, s, r);
      return a >= 0 && this._setShapePos(a, t, e), a;
    }
    addEllipse(t, e, i, s, r = 16777215, a = 1) {
      const h = this._addShape(P.Ellipse, i, s, 0, 0, r, a);
      return h >= 0 && this._setShapePos(h, t, e), h;
    }
    addTriangle(t, e, i, s, r = 16777215, a = 1) {
      const h = this._addShape(P.Triangle, i, s, 0, 0, r, a);
      return h >= 0 && this._setShapePos(h, t, e), h;
    }
    addStar(t, e, i, s, r = s / 2, a = 16777215, h = 1) {
      const o = this._addShape(P.Star, s * 2, s * 2, i, r / s, a, h);
      return o >= 0 && this._setShapePos(o, t, e), o;
    }
    addRoundRect(t, e, i, s, r = 8, a = 16777215, h = 1) {
      const o = this._addShape(P.RoundRect, i, s, r, 0, a, h);
      return o >= 0 && this._setShapePos(o, t, e), o;
    }
    addLine(t, e, i, s = 1, r = 16777215, a = 1) {
      const h = this._addShape(P.Line, i, s, s, 0, r, a);
      return h >= 0 && this._setShapePos(h, t, e), h;
    }
    addGrid(t, e, i, s, r = 2, a = 1, h = 16777215, o = 1) {
      const u = this._addShape(P.Grid, i * r, s * r, r, a, h, o);
      return u >= 0 && this._setShapePos(u, t, e), u;
    }
    addIsoTriangle(t, e, i, s, r = 16777215, a = 1) {
      const h = this._addShape(P.IsoTriangle, i, s, 0, 0, r, a);
      return h >= 0 && this._setShapePos(h, t, e), h;
    }
    addIsoDiamond(t, e, i, s, r = 16777215, a = 1) {
      const h = this._addShape(P.IsoDiamond, i, s, 0, 0, r, a);
      return h >= 0 && this._setShapePos(h, t, e), h;
    }
    addQuad(t, e, i, s, r = 0, a = 16777215, h = 1) {
      const o = this._addShape(P.Quad, i, s, r, 0, a, h);
      return o >= 0 && this._setShapePos(o, t, e), o;
    }
    addArc(t, e, i, s = 2, r = 16777215, a = 1) {
      const h = this._addShape(P.Arc, i * 2, i * 2, s, 0, r, a);
      return h >= 0 && this._setShapePos(h, t, e), h;
    }
    _setShapePos(t, e, i) {
      const s = this.shapes.ids[t];
      if (s < 0) return;
      const r = this.arena.idToIndex[s];
      r < 0 || (this.arena.setPosX(r, e), this.arena.setPosY(r, i));
    }
    get shapes() {
      return (
        this._shapes ?? (this._shapes = new Bt(this.arena, (t, e) => this.textures.addCanvas(t, e)))
      );
    }
    preload() {}
    init() {}
    create() {}
    update(t) {}
    fixedUpdate(t) {}
    shutdown() {}
    setPaused(t) {
      this._paused = t;
    }
    get paused() {
      return this._paused;
    }
    sysShutdown() {
      var t, e, i;
      this.shutdown(), this.input.detach();
      for (let s = 0; s < this._plugins.length; s++)
        (e = (t = this._plugins[s]).destroy) == null || e.call(t);
      (i = this._sound) == null || i.destroy(), (this._sound = null), (this._active &= -257);
    }
    sysInit(t) {
      (this.engine = t), t.device && this.textures.setDevice(t.device), this.preload(), this.init();
    }
    sysCreate() {
      this.input.attach(window),
        (this.input.pointerTransform = (t, e, i) => {
          this.engine.scale.transform(t, e, i);
        }),
        this.create();
    }
    sysUpdate(t) {
      var h, o, u, l, d, c, f, _, g, p, y, v;
      if (this._paused) return;
      const e = this._active;
      e & Y.Camera && this.cameras.update(t, this._followId, this._followX, this._followY),
        this.input.update(t);
      const i = this.cameras.main,
        s =
          ((u = (o = (h = this.sys) == null ? void 0 : h.scale) == null ? void 0 : o.gameSize) ==
          null
            ? void 0
            : u.width) ?? 0,
        r =
          ((c = (d = (l = this.sys) == null ? void 0 : l.scale) == null ? void 0 : d.gameSize) ==
          null
            ? void 0
            : c.height) ?? 0,
        a = i.zoom !== 0 ? i.zoom : 1;
      (this.input.worldPointerX = i.actualX + (this.input.pointerX - s * 0.5) / a),
        (this.input.worldPointerY = i.actualY + (this.input.pointerY - r * 0.5) / a),
        e & Y.Tweens && this._tweens.update(t * 1e3),
        e & Y.Anims && this._anim.update(t),
        e & Y.Particles && this._particles.update(t),
        e & Y.Sound && this._sound.update(),
        e & Y.Physics && (this._physics.update(t), this._physics.collide()),
        this.update(t);
      for (let m = 0; m < this._plugins.length; m++)
        (_ = (f = this._plugins[m]).update) == null || _.call(f, t);
      if (
        (this.arena.hasHierarchy &&
          this.arena.dirtyHierarchy &&
          (this.arena.computeWorldTransforms(), (this.arena.dirtyHierarchy = !1)),
        e & Y.Tilemap)
      ) {
        const m =
            ((p = (g = this.engine) == null ? void 0 : g.scale) == null ? void 0 : p.width) ?? 800,
          F =
            ((v = (y = this.engine) == null ? void 0 : y.scale) == null ? void 0 : v.height) ?? 600,
          w = this._tilemaps,
          x = this.cameras.main;
        for (let A = 0; A < w.length; A++) w[A].updateCulling(x, m, F);
      }
    }
    sysFixedUpdate(t) {
      var e, i;
      if (!this._paused) {
        this.fixedUpdate(t);
        for (let s = 0; s < this._plugins.length; s++)
          (i = (e = this._plugins[s]).fixedUpdate) == null || i.call(e, t);
      }
    }
    registerPlugin(t) {
      var e;
      this._plugins.push(t), (e = t.init) == null || e.call(t, this);
    }
    pickTop() {
      return this.arena.hitTest(this.input.pointerX, this.input.pointerY, this._hitBuffer) > 0
        ? this._hitBuffer[0]
        : -1;
    }
    pickAll(t) {
      return this.arena.hitTest(this.input.pointerX, this.input.pointerY, t);
    }
  };
export { bi as P, Ti as S, ie as W, Si as a, Ei as f };
