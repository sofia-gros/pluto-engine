/**
 * @file internal.ts
 * @description `filters.internal` — scene を 1 枚の花として加工するフィルタ群。
 *
 * Phaser 4 の internal filter と同じく、**入力は scene で 1 枚**のフィルタです。
 * post-pipeline（外部フィルタ）は `external.ts` 側に置きます。
 *
 * ## 実装しないものは「未対応」で表す
 *
 * 9.2 の表で却下（E）になったものはここに追加しません。
 * RW は「WebGPU のみ」を意味し、WebGL2 では `webgpuOnly` により無視されます。
 */

import { fragmentWGSL } from './fullscreen';
import type { FilterDef } from './types';

/**
 * uniform を 1 つだけ持つ単一パスフィルタの共通実装。
 *
 * `passCount` が 1 の滤镜はこれで足ります。uniform は構築時に確保します
 * （鉄則 R-02）。
 */
class SinglePassFilter implements FilterDef {
  readonly passCount = 1;
  /** vec4 × 8（128 バイト）を 1 つ確保します */
  private readonly _uniforms = new Float32Array(32);

  constructor(
    readonly key: string,
    readonly name: string,
    readonly webgpuOnly: boolean,
    private readonly _wgsl: string,
  ) {}

  uniform(passIndex: number): Float32Array {
    void passIndex;
    return this._uniforms;
  }

  wgsl(passIndex: number): string {
    void passIndex;
    return this._wgsl;
  }

  passSamplesSource(passIndex: number): boolean {
    void passIndex;
    return true;
  }
}

/**
 * `ColorMatrix` — 4x5 の色変換行列。
 *
 * Phaser の `ColorMatrix` と同じ 4x5（RGBA 変換 + オフセット）です。
 * `reset()` で単位行列に戻します。
 */
export interface ColorMatrixFilter extends FilterDef {
  /**
   * 4x5 行列を直接設定します。
   *
   * @param m 長さ 20 の配列（row major / RGBA の順）
   */
  setMatrix(m: ArrayLike<number>): void;
  reset(): void;
  setBrightness(v: number): void;
  setSaturation(v: number): void;
  setHue(v: number): void;
  setGrayscale(v: number): void;
  setSepia(v: number): void;
  setInvert(v: number): void;
  setAlpha(v: number): void;
}

const IDENTITY = new Float32Array([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]);

function colorMatrix(): ColorMatrixFilter {
  const base = new SinglePassFilter(
    'ColorMatrix',
    'ColorMatrix',
    false,
    fragmentWGSL(`
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
  );

  const filter = base as unknown as ColorMatrixFilter;

  filter.setMatrix = (m: ArrayLike<number>): void => {
    const u = base.uniform(0);
    for (let i = 0; i < 20; i++) u[i] = m[i] ?? IDENTITY[i];
  };
  filter.reset = (): void => {
    filter.setMatrix(IDENTITY);
  };

  /**
   * 明度を足します（0 で不変、1 で白飛び）。
   *
   * 加算量を float で持つのではなく `+v` をそのまま加えるのは、
   * 行列の-offset 側が sRGB 域で計算されるためです。
   */
  filter.setBrightness = (v: number): void => {
    const u = base.uniform(0);
    filter.setMatrix(IDENTITY);
    u[1] = v;
    u[6] = v;
    u[11] = v;
  };

  filter.setSaturation = (v: number): void => {
    // ITU-R BT.709 の輝度係数
    const lr = 0.2126;
    const lg = 0.7152;
    const lb = 0.0722;
    const i = 1 - v;
    filter.setMatrix([
      lr * v + i,
      lg * v,
      lb * v,
      0,
      0,
      lr * v,
      lg * v + i,
      lb * v,
      0,
      0,
      lr * v,
      lg * v,
      lb * v + i,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
    ]);
  };

  filter.setHue = (v: number): void => {
    // 0.5 が無彩色（変化なし）です。Phaser と同じ 0..1 の範囲に正規化します。
    const h = (v - 0.5) * Math.PI;
    const c = Math.cos(h);
    const s = Math.sin(h);
    const lr = 0.2126;
    const lg = 0.7152;
    const lb = 0.0722;
    const m = [
      lr + c * (1 - lr) + s * -lr,
      lg + c * -lg + s * -lg,
      lb + c * -lb + s * (1 - lb),
      0,
      0,
      lr + c * -lr + s * 0.143,
      lg + c * (1 - lg) + s * 0.14,
      lb + c * -lb + s * -0.283,
      0,
      0,
      lr + c * -lr + s * -(1 - lr),
      lg + c * -lg + s * lg,
      lb + c * (1 - lb) + s * -lb,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
    ];
    filter.setMatrix(m);
  };

  filter.setGrayscale = (v: number): void => {
    const u = base.uniform(0);
    const lr = 0.2126;
    const lg = 0.7152;
    const lb = 0.0722;
    filter.setMatrix([
      lr * v + (1 - v),
      lg * v,
      lb * v,
      0,
      0,
      lr * v,
      lg * v + (1 - v),
      lb * v,
      0,
      0,
      lr * v,
      lg * v,
      lb * v + (1 - v),
      0,
      0,
      0,
      0,
      0,
      1,
      0,
    ]);
    void u;
  };

  filter.setSepia = (v: number): void => {
    const i = 1 - v;
    filter.setMatrix([
      0.393 + 0.607 * i,
      0.769 - 0.769 * i,
      0.189 - 0.189 * i,
      0,
      0,
      0.349 - 0.349 * i,
      0.686 + 0.314 * i,
      0.168 - 0.168 * i,
      0,
      0,
      0.272 - 0.272 * i,
      0.534 - 0.534 * i,
      0.131 + 0.869 * i,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
    ]);
  };

  filter.setInvert = (v: number): void => {
    const i = 1 - 2 * v;
    filter.setMatrix([i, 0, 0, 0, 0, 0, i, 0, 0, 0, 0, 0, i, 0, 0, 0, 0, 0, 1, 0]);
  };

  filter.setAlpha = (v: number): void => {
    filter.reset();
    base.uniform(0)[18] = v;
  };

  filter.reset();
  return filter;
}

/**
 * `Pixelate` — ピクセル化。
 *
 * 画面を `blockSize` ピクセルの格子に落とし、格子の中心をサンプルします。
 */
export interface PixelateFilter extends FilterDef {
  setBlockSize(px: number): void;
  readonly blockSize: number;
}

function pixelate(): PixelateFilter {
  const filter = new SinglePassFilter(
    'Pixelate',
    'Pixelate',
    false,
    fragmentWGSL(`
  // params.x = ブロック辺長(px), params.zw = 1/幅, 1/高さ
  let block = max(u.params[0].x, 1.0);
  let step = block * u.params[0].zw;
  // 格子の中心へ丸めます（ブロックの角ではなく中心をサンプルする）
  let snapped = (floor(in.uv / step) + 0.5) * step;
  return textureSampleLevel(srcTex, samp, snapped, 0.0);
`),
  ) as unknown as PixelateFilter;

  let size = 4;
  Object.defineProperty(filter, 'blockSize', {
    get: () => size,
    enumerable: true,
  });
  filter.setBlockSize = (px: number): void => {
    size = Math.max(1, px);
    const u = filter.uniform(0);
    u[0] = size;
  };

  filter.setBlockSize(4);
  return filter;
}

/**
 * `Vignette` — 周囲を暗くします。
 *
 * `radius`（内側の無変化率）と `strength`（最大暗さ）を線形補間します。
 */
export interface VignetteFilter extends FilterDef {
  setRadius(v: number): void;
  setStrength(v: number): void;
  setRounded(v: boolean): void;
}

function vignette(): VignetteFilter {
  const filter = new SinglePassFilter(
    'Vignette',
    'Vignette',
    false,
    fragmentWGSL(`
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
  ) as unknown as VignetteFilter;

  filter.setRadius = (v: number): void => {
    filter.uniform(0)[0] = Math.min(1, Math.max(0, v));
  };
  filter.setStrength = (v: number): void => {
    filter.uniform(0)[1] = Math.min(1, Math.max(0, v));
  };
  filter.setRounded = (v: boolean): void => {
    filter.uniform(0)[2] = v ? 1 : 0;
  };

  filter.setRadius(0.5);
  filter.setStrength(1);
  filter.setRounded(false);
  return filter;
}

/**
 * `Blur` — 分離可能ぼかし（水平 → 垂直の 2 パス）。
 *
 * ## なぜ 2 パスか
 *
 * NxN のカーネルを 1 パスで実装すると N^2 サンプル必要ですが、
 * 水平 → 垂直に分けると 2N サンプルで済みます（Separable Gaussian）。
 * コストは O(N^2) から O(N) になります。
 */
export interface BlurFilter extends FilterDef {
  setStrength(px: number): void;
  readonly strength: number;
  /**
   * 画面サイズを渡します（テクスチャ 1 px あたりのステップを計算するため）。
   *
   * RenderGraph が毎フレーム呼びます。サイズが変わらない限り重みは再計算しません。
   */
  setViewportSize(w: number, h: number): void;
}

/**
 * 分離可能ガウシアンの重みを 9 タップで事前に求めます。
 *
 * 9 タップはシェーダ側のループを固定にするためで、
 * `strength` を変えてもシェーダは再コンパイルされません。
 */
const BLUR_TAPS = 9;

function blur(): BlurFilter {
  /** pass 0 = 水平、pass 1 = 垂直 */
  const uniforms = [new Float32Array(32), new Float32Array(32)];
  let strength = 4;
  let width = 1;
  let height = 1;

  /**
   * 9 タップの重みを `params[1]`〜`params[3]` へ 1 vec4 ずつ置きます。
   * シェーダは固定 tap 数で unroll されているので、ここは 9 個書くだけです。
   */
  function writeWeights(): void {
    const sigma = Math.max(0.0001, strength / 2);
    const half = (BLUR_TAPS - 1) >> 1;
    for (let p = 0; p < 2; p++) {
      const u = uniforms[p];
      // pass 0 は水平（x 方向）、pass 1 は垂直（y 方向）
      u[0] = p === 0 ? 1 / width : 0;
      u[1] = p === 0 ? 0 : 1 / height;
      u[2] = strength;
      for (let t = 0; t < BLUR_TAPS; t++) {
        const x = t - half;
        u[4 + t] = Math.exp(-(x * x) / (2 * sigma * sigma));
      }
    }
  }

  const wgsl = fragmentWGSL(`
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
`);

  const filter: BlurFilter = {
    key: 'Blur',
    name: 'Blur',
    passCount: 2,
    webgpuOnly: false,
    uniform: (i: number): Float32Array => uniforms[i] ?? uniforms[0],
    wgsl: (): string => wgsl,
    passSamplesSource: (): boolean => true,
    setStrength: (px: number): void => {
      strength = Math.max(0, px);
      writeWeights();
    },
    get strength(): number {
      return strength;
    },
    setViewportSize: (w: number, h: number): void => {
      if (w === width && h === height) return;
      width = w;
      height = h;
      writeWeights();
    },
  };

  writeWeights();
  return filter;
}

/**
 * `Bloom` — ブルーム（高輝度部分のぼかし）。
 *
 * 2パス（水平・垂直）で実装します。
 */
export interface BloomFilter extends FilterDef {
  setStrength(px: number): void;
  setThreshold(v: number): void;
  readonly strength: number;
  setViewportSize(w: number, h: number): void;
}

function bloom(): BloomFilter {
  const uniforms = [new Float32Array(32), new Float32Array(32)];
  let strength = 4;
  let threshold = 0.5;
  let width = 1;
  let height = 1;

  function writeWeights(): void {
    const sigma = Math.max(0.0001, strength / 2);
    const half = (BLUR_TAPS - 1) >> 1;
    for (let p = 0; p < 2; p++) {
      const u = uniforms[p];
      u[0] = p === 0 ? 1 / width : 0;
      u[1] = p === 0 ? 0 : 1 / height;
      u[2] = strength;
      u[3] = threshold;
      u[9] = p === 0 ? 1 : 0; // params[2].y
      for (let t = 0; t < BLUR_TAPS; t++) {
        const x = t - half;
        u[4 + t] = Math.exp(-(x * x) / (2 * sigma * sigma));
      }
    }
  }

  const wgsl = fragmentWGSL(`
  let step = u.params[0].xy;
  let th = u.params[0].w;
  let isPass0 = u.params[2].y > 0.5;

  var c = textureSampleLevel(srcTex, samp, in.uv, 0.0);
  if (isPass0) {
    if (dot(c.rgb, vec3<f32>(0.2126, 0.7152, 0.0722)) < th) { c = vec4<f32>(0.0); }
  }
  c = c * u.params[1].x;

  var s1 = textureSampleLevel(srcTex, samp, in.uv + step, 0.0);
  var s2 = textureSampleLevel(srcTex, samp, in.uv - step, 0.0);
  if (isPass0) {
    if (dot(s1.rgb, vec3<f32>(0.2126, 0.7152, 0.0722)) < th) { s1 = vec4<f32>(0.0); }
    if (dot(s2.rgb, vec3<f32>(0.2126, 0.7152, 0.0722)) < th) { s2 = vec4<f32>(0.0); }
  }
  c += (s1 + s2) * u.params[1].y;

  s1 = textureSampleLevel(srcTex, samp, in.uv + step * 2.0, 0.0);
  s2 = textureSampleLevel(srcTex, samp, in.uv - step * 2.0, 0.0);
  if (isPass0) {
    if (dot(s1.rgb, vec3<f32>(0.2126, 0.7152, 0.0722)) < th) { s1 = vec4<f32>(0.0); }
    if (dot(s2.rgb, vec3<f32>(0.2126, 0.7152, 0.0722)) < th) { s2 = vec4<f32>(0.0); }
  }
  c += (s1 + s2) * u.params[1].z;

  s1 = textureSampleLevel(srcTex, samp, in.uv + step * 3.0, 0.0);
  s2 = textureSampleLevel(srcTex, samp, in.uv - step * 3.0, 0.0);
  if (isPass0) {
    if (dot(s1.rgb, vec3<f32>(0.2126, 0.7152, 0.0722)) < th) { s1 = vec4<f32>(0.0); }
    if (dot(s2.rgb, vec3<f32>(0.2126, 0.7152, 0.0722)) < th) { s2 = vec4<f32>(0.0); }
  }
  c += (s1 + s2) * u.params[1].w;

  s1 = textureSampleLevel(srcTex, samp, in.uv + step * 4.0, 0.0);
  s2 = textureSampleLevel(srcTex, samp, in.uv - step * 4.0, 0.0);
  if (isPass0) {
    if (dot(s1.rgb, vec3<f32>(0.2126, 0.7152, 0.0722)) < th) { s1 = vec4<f32>(0.0); }
    if (dot(s2.rgb, vec3<f32>(0.2126, 0.7152, 0.0722)) < th) { s2 = vec4<f32>(0.0); }
  }
  c += (s1 + s2) * u.params[2].x;

  return c;
`);

  const filter: BloomFilter = {
    key: 'Bloom',
    name: 'Bloom',
    passCount: 2,
    webgpuOnly: false,
    uniform: (i: number): Float32Array => uniforms[i] ?? uniforms[0],
    wgsl: (): string => wgsl,
    passSamplesSource: (): boolean => true,
    setStrength: (px: number): void => {
      strength = Math.max(0, px);
      writeWeights();
    },
    setThreshold: (v: number): void => {
      threshold = Math.max(0, v);
      writeWeights();
    },
    get strength(): number {
      return strength;
    },
    setViewportSize: (w: number, h: number): void => {
      if (w === width && h === height) return;
      width = w;
      height = h;
      writeWeights();
    },
  };

  writeWeights();
  return filter;
}

/**
 * `Glow` — グロー（アルファチャンネルの抽出とぼかし）。
 *
 * 2パス（水平・垂直）で実装します。
 */
export interface GlowFilter extends FilterDef {
  setStrength(px: number): void;
  setColor(r: number, g: number, b: number, a: number): void;
  readonly strength: number;
  setViewportSize(w: number, h: number): void;
}

function glow(): GlowFilter {
  const uniforms = [new Float32Array(32), new Float32Array(32)];
  let strength = 4;
  let colorR = 1;
  let colorG = 1;
  let colorB = 1;
  let colorA = 1;
  let width = 1;
  let height = 1;

  function writeWeights(): void {
    const sigma = Math.max(0.0001, strength / 2);
    const half = (BLUR_TAPS - 1) >> 1;
    for (let p = 0; p < 2; p++) {
      const u = uniforms[p];
      u[0] = p === 0 ? 1 / width : 0;
      u[1] = p === 0 ? 0 : 1 / height;
      u[2] = strength;
      u[3] = 0; // unused
      u[9] = p === 0 ? 1 : 0; // params[2].y
      u[12] = colorR; // params[3].x
      u[13] = colorG; // params[3].y
      u[14] = colorB; // params[3].z
      u[15] = colorA; // params[3].w
      
      for (let t = 0; t < BLUR_TAPS; t++) {
        const x = t - half;
        u[4 + t] = Math.exp(-(x * x) / (2 * sigma * sigma));
      }
    }
  }

  const wgsl = fragmentWGSL(`
  let step = u.params[0].xy;
  let isPass0 = u.params[2].y > 0.5;
  let color = u.params[3];

  var c = textureSampleLevel(srcTex, samp, in.uv, 0.0);
  if (isPass0) {
    c = color * c.a;
  }
  c = c * u.params[1].x;

  var s1 = textureSampleLevel(srcTex, samp, in.uv + step, 0.0);
  var s2 = textureSampleLevel(srcTex, samp, in.uv - step, 0.0);
  if (isPass0) {
    s1 = color * s1.a;
    s2 = color * s2.a;
  }
  c += (s1 + s2) * u.params[1].y;

  s1 = textureSampleLevel(srcTex, samp, in.uv + step * 2.0, 0.0);
  s2 = textureSampleLevel(srcTex, samp, in.uv - step * 2.0, 0.0);
  if (isPass0) {
    s1 = color * s1.a;
    s2 = color * s2.a;
  }
  c += (s1 + s2) * u.params[1].z;

  s1 = textureSampleLevel(srcTex, samp, in.uv + step * 3.0, 0.0);
  s2 = textureSampleLevel(srcTex, samp, in.uv - step * 3.0, 0.0);
  if (isPass0) {
    s1 = color * s1.a;
    s2 = color * s2.a;
  }
  c += (s1 + s2) * u.params[1].w;

  s1 = textureSampleLevel(srcTex, samp, in.uv + step * 4.0, 0.0);
  s2 = textureSampleLevel(srcTex, samp, in.uv - step * 4.0, 0.0);
  if (isPass0) {
    s1 = color * s1.a;
    s2 = color * s2.a;
  }
  c += (s1 + s2) * u.params[2].x;

  return c;
`);

  const filter: GlowFilter = {
    key: 'Glow',
    name: 'Glow',
    passCount: 2,
    webgpuOnly: false,
    uniform: (i: number): Float32Array => uniforms[i] ?? uniforms[0],
    wgsl: (): string => wgsl,
    passSamplesSource: (): boolean => true,
    setStrength: (px: number): void => {
      strength = Math.max(0, px);
      writeWeights();
    },
    setColor: (r: number, g: number, b: number, a: number): void => {
      colorR = r;
      colorG = g;
      colorB = b;
      colorA = a;
      writeWeights();
    },
    get strength(): number {
      return strength;
    },
    setViewportSize: (w: number, h: number): void => {
      if (w === width && h === height) return;
      width = w;
      height = h;
      writeWeights();
    },
  };

  writeWeights();
  return filter;
}

export const filters = {
  internal: {
    colorMatrix,
    pixelate,
    vignette,
    blur,
    bloom,
    glow,
  },
} as const;
