/**
 * @file InstanceLayout.ts
 * @description
 * インスタンス描画の頂点データレイアウトを単一の情報源として保持します。
 *
 * ## なぜ vec4 に詰めるのか
 *
 * GPU へ渡せる「枠」には硬件による上限があります。
 *  - WebGL2 の `MAX_VERTEX_ATTRIBS` は 16
 *  - WebGPU の `maxVertexBuffers` は 8（仕様既定値）
 *
 * スカラー 1 値 = 1 枠 として消費すると、これらの上限に数体で届いてしまいます。
 * そこで **1 枠 = vec4 (4 値)** としてまとめます。これが「枠を
 * データ的に増やす」取り組みの本体です。
 *
 * 結果、1 インスタンスあたりの転送は 13 本のバッファから 4 本へ、
 * 頂点属性は 15/16 から 6/16 へ、頂点バッファは 2/8 から 5/8 へ縮小します。
 *
 * ## 書き込みは write-through
 *
 * ミラー配列 (`packed*`) は毎フレーム repack しません。
 * `InstanceBufferArena` の write-through セッターが SoA とミラーの
 * **両方へ同時に書き込みます**（1  体あたりのコストは O(1)）。
 *
 * ## レイアウト
 *
 * | バッファ              | 内容                                             | バイト |
 * | --------------------- | ------------------------------------------------ | ------ |
 * | `packedTransform`     | `posX, posY, scaleX, scaleY`                     | 16     |
 * | `packedUv`            | `uvX, uvY, uvW, uvH`                              | 16     |
 * | `packedFlags`         | `frameIdx, facing, visible, isText`               | 16     |
 * | `packedShape`         | `rotation, frameWidth, frameHeight, depth`        | 16     |
 * | `packedTint`          | `RGBA` (unorm8x4)                                 | 4      |
 * | `packedOrigin`        | `originX, originY, scrollFactorX, scrollFactorY`  | 16     |
 * | `packedExt` (オプトイン) | `vec4` × 4 のユーザー拡張領域                      | 64     |
 *
 * 既定で 1 インスタンス 84 バイトです。
 *
 * ## scale は「倍率」です
 *
 * `scale` はフレーム寸法の**倍率**です。`scale = 1` ならスプライトは
 * フレームそのままiterateの大きさになります。
 *
 * ```ts
 * this.load.sprite('hero', src, { frameWidth: 32, frameHeight: 32 });
 * const p = this.add.sprite(x, y, 'hero');  // 32px
 * p.scale = 2;                              // 64px
 * ```
 *
 * そのためフレームのピクセル寸法は `packedShape` の
 * `frameWidth` / `frameHeight` として per-instance で渡します。
 * スプライトの辺長・当たり判定・`getBounds` はすべてこの値と `scale` から
 * 導出するため、画像サイズに追従して Phaser 互換になります。
 */

/**
 * テクスチャ未設定のスプライトに与えるフレーム寸法 (px)。
 *
 * Phaser は `__DEFAULT` テクスチャ (32x32) をスプライトの既定として使います。
 * 実際は透明なので見えないですが、サイズと当たり判定は 32px として成立します。
 */
export const DEFAULT_FRAME_SIZE = 32;

/**
 * `packedTransform` 内でのレーン位置。
 *
 * `const enum` はコンパイル時にインライン化されます。
 * write-through セッター（毎フレーム数千回呼ばれる経路）からの
 * プロパティ参照をゼロにするため、あえて const enum を使います。
 */
// biome-ignore lint/suspicious/noConstEnum: ホットパスでインライン化されるため
export const enum TransformLane {
  PosX = 0,
  PosY = 1,
  ScaleX = 2,
  ScaleY = 3,
}

/** `packedShape` 内でのレーン位置 */
// biome-ignore lint/suspicious/noConstEnum: ホットパスでインライン化されるため
export const enum ShapeLane {
  Rotation = 0,
  FrameWidth = 1,
  FrameHeight = 2,
  Depth = 3,
}

/** `packedUv` 内でのレーン位置 */
// biome-ignore lint/suspicious/noConstEnum: ホットパスでインライン化されるため
export const enum UvLane {
  X = 0,
  Y = 1,
  W = 2,
  H = 3,
}

/** `packedFlags` 内でのレーン位置 */
// biome-ignore lint/suspicious/noConstEnum: ホットパスでインライン化されるため
export const enum FlagsLane {
  FrameIdx = 0,
  Facing = 1,
  Visible = 2,
  IsText = 3,
}

/** `packedOrigin` 内でのレーン位置 */
// biome-ignore lint/suspicious/noConstEnum: ホットパスでインライン化されるため
export const enum OriginLane {
  OriginX = 0,
  OriginY = 1,
  ScrollFactorX = 2,
  ScrollFactorY = 3,
}

/** `packedExt` 内でのレーン位置（利用側が定義するユーザー拡張枠） */
// biome-ignore lint/suspicious/noConstEnum: ホットパスでインライン化されるため
export const enum ExtLane {
  /** `active` フラグ（0 = 非表示・非更新） */
  Active = 0,
  /** `tintMode`（Phaser 4 の 6 モード） */
  TintMode = 1,
  /** `blendMode`（バッチ分割のキー。WebGL2 は 4 種） */
  BlendMode = 2,
  /** 予備 */
  Spare = 3,
}

/**
 * Phaser 4 の tint ブレンドモード。
 *
 * `MULTIPLY` は従来から使われていた既定値です。
 * `FILL` は v3 の `setTintFill()` の後継ですが、
 * 実装が非推奨（頂点属性の幅が狭い）ため、今回は CPU 側でのみ扱います。
 */
// biome-ignore lint/suspicious/noConstEnum: ホットパスでインライン化されるため
export const enum TintMode {
  Multiply = 0,
  Fill = 1,
  Add = 2,
  Screen = 3,
  Overlay = 4,
  HardLight = 5,
}

/** `TINT` に格納する `TintMode` のビット数 */
export const TINT_MODE_COUNT = 6;

/**
 * WebGL2 がネイティブにサポートするブレンドモード（4 種）。
 * それ以外は `setBlendMode` で指定しても**無視**されます（要件2: 追加コスト高）。
 */
// biome-ignore lint/suspicious/noConstEnum: ホットパスでインライン化されるため
export const enum BlendMode {
  Normal = 0,
  Add = 1,
  Multiply = 2,
  Screen = 3,
  Count = 4,
}

/** 共有 Quad の頂点属性（GLSL location / WGSL @location 共通） */
export const QUAD_LOCATION = {
  /** `vec2` 頂点位置 (-0.5 〜 0.5) */
  Pos: 0,
  /** `vec2` 頂点 UV (0 〜 1) */
  Uv: 1,
} as const;

/** 共有 Quad のストライド (vec2 × 2 = 16 バイト) */
export const QUAD_STRIDE_BYTES = 16;

/** インスタンス用バッファ 1 本の仕様 */
export interface InstanceBufferSpec {
  /** GPU バッファ名。`PlutoEngine` が `gpuBuffers` のキーとして使います */
  readonly name: string;
  /** アリーナ側のミラー配列（Float32Array か Uint32Array） */
  readonly arrayName:
    | 'packedTransform'
    | 'packedUv'
    | 'packedFlags'
    | 'packedShape'
    | 'packedTint'
    | 'packedOrigin'
    | 'packedExt';
  /** 1 インスタンスあたりのバイト数（WebGL2 の stride / WebGPU の arrayStride） */
  readonly stride: number;
  /** このバッファが持つ `vec4` の個数 */
  readonly vectors: number;
  /** WebGL2 で使用する `location` の開始番号 */
  readonly location: number;
  /** WebGPU の `setVertexBuffer` スロット番号（0 は共有 Quad 予約） */
  readonly slot: number;
  /** WebGPU の `GPUVertexFormat` */
  readonly format: 'float32x4' | 'unorm8x4';
  /** true なら初期化時に必ず確保する、false なら利用者が求めるまで未確保 */
  readonly eager: boolean;
}

/**
 * インスタンス用バッファの定義順。
 * 配列の順序がそのまま location / slot の割り当て順になります。
 */
export const INSTANCE_BUFFERS: readonly InstanceBufferSpec[] = [
  {
    name: 'packedTransform',
    arrayName: 'packedTransform',
    stride: 16,
    vectors: 1,
    location: 2,
    slot: 1,
    format: 'float32x4',
    eager: true,
  },
  {
    name: 'packedUv',
    arrayName: 'packedUv',
    stride: 16,
    vectors: 1,
    location: 3,
    slot: 2,
    format: 'float32x4',
    eager: true,
  },
  {
    name: 'packedFlags',
    arrayName: 'packedFlags',
    stride: 16,
    vectors: 1,
    location: 4,
    slot: 3,
    format: 'float32x4',
    eager: true,
  },
  {
    // rotation とフレームのピクセル寸法。
    // フレーム寸法が無いと頂点シェーダがクワッドの大きさを決められないため、
    // scale(倍率) と切り離して必ず渡す必要があります。
    name: 'packedShape',
    arrayName: 'packedShape',
    stride: 16,
    vectors: 1,
    location: 5,
    slot: 4,
    format: 'float32x4',
    eager: true,
  },
  {
    // tint は 1 インスタンス 4 バイト (RGBA) で、vec4 1 枠として扱います。
    name: 'packedTint',
    arrayName: 'packedTint',
    stride: 4,
    vectors: 1,
    location: 6,
    slot: 5,
    format: 'unorm8x4',
    eager: true,
  },
  {
    // 描画原点 と カメラスクロール係数。
    // origin はクワッドを shift させるため頂点シェーダで必要になり、
    // scrollFactor はカメラごとの描画位置を計算するために必要です。
    // どちらも per-instance の値なので vec4 1 枠にまとめます。
    name: 'packedOrigin',
    arrayName: 'packedOrigin',
    stride: 16,
    vectors: 1,
    location: 7,
    slot: 6,
    format: 'float32x4',
    eager: true,
  },
  {
    // ユーザー拡張枠。vec4 × 4 を 1 本のバッファ (64 バイト) にまとめ、
    // WebGPU のバッファ枠を 1 つだけ消費します。
    //
    // `active` / `tintMode` / `blendMode` は**ここに入れません**。
    // 3 つとも頂点シェーダでは使わないため、転送する意味がありません
    // （1 インスタンス 48 バイトの無駄になるため）。
    // `active` は CPU 側で `visible` と AND させて描画ゲートします。
    name: 'packedExt',
    arrayName: 'packedExt',
    stride: 64,
    vectors: 4,
    location: 8,
    slot: 7,
    format: 'float32x4',
    eager: false,
  },
];

/** 初期化時に必ず確保するバッファの数 */
export const CORE_INSTANCE_BUFFER_COUNT = INSTANCE_BUFFERS.filter((b) => b.eager).length;

/** 名前からバッファ定義を引くためのマップ（module スコープで 1 度だけ構築） */
export const INSTANCE_BUFFER_BY_NAME: ReadonlyMap<string, InstanceBufferSpec> = new Map(
  INSTANCE_BUFFERS.map((b) => [b.name, b]),
);

/**
 * 1 インスタンスあたりの転送バイト数（拡張枠を含む）。
 *
 * `stride` が既に「1 インスタンスあたりのバイト数」なので、
 * `vectors` を掛けてはいけません（拡張枠は stride 64 に vec4 x 4 が入っているため）。
 */
export function totalBytesPerInstance(includeExt = false): number {
  let sum = 0;
  for (let i = 0; i < INSTANCE_BUFFERS.length; i++) {
    const b = INSTANCE_BUFFERS[i];
    if (!b.eager && !includeExt) continue;
    sum += b.stride;
  }
  return sum;
}

/** 描画に使う WebGL2 頂点属性の使用数（共有 Quad の 2 個を含む） */
export function glslAttributeCount(includeExt = false): number {
  let n = 2; // 共有 Quad の pos / uv
  for (let i = 0; i < INSTANCE_BUFFERS.length; i++) {
    const b = INSTANCE_BUFFERS[i];
    if (!b.eager && !includeExt) continue;
    n += b.vectors;
  }
  return n;
}

/**
 * GLSL ES 3.00 のインスタンス属性宣言を生成します。
 * WebGL2Device から 1 か所のみで呼び出されます。
 */
export function glslInstanceDecl(includeExt = false): string {
  const lines: string[] = [];
  for (let i = 0; i < INSTANCE_BUFFERS.length; i++) {
    const b = INSTANCE_BUFFERS[i];
    if (!b.eager && !includeExt) continue;
    for (let v = 0; v < b.vectors; v++) {
      lines.push(
        `layout(location = ${b.location + v}) in vec4 ${gLSLName(b, v)};` +
          `  // ${b.name}${b.vectors > 1 ? `[${v}]` : ''}`,
      );
    }
  }
  return lines.join('\n');
}

/**
 * WGSL の `VertexInput` 構造体メンバーを生成します。
 * WebGPUDevice から 1 か所のみで呼び出されます。
 */
export function wgslInstanceMembers(includeExt = false): string {
  const lines: string[] = [];
  for (let i = 0; i < INSTANCE_BUFFERS.length; i++) {
    const b = INSTANCE_BUFFERS[i];
    if (!b.eager && !includeExt) continue;
    for (let v = 0; v < b.vectors; v++) {
      lines.push(`  @location(${b.location + v}) ${wGSLName(b, v)}: vec4<f32>,`);
    }
  }
  return lines.join('\n');
}

/** WebGL2 の `vertexAttribPointer` へ渡す設定を生成します。 */
export function glslAttributeSpecs(includeExt = false): {
  location: number;
  size: number;
  type: number;
  normalized: boolean;
  stride: number;
  offset: number;
}[] {
  const out: {
    location: number;
    size: number;
    type: number;
    normalized: boolean;
    stride: number;
    offset: number;
  }[] = [];
  for (let i = 0; i < INSTANCE_BUFFERS.length; i++) {
    const b = INSTANCE_BUFFERS[i];
    if (!b.eager && !includeExt) continue;
    for (let v = 0; v < b.vectors; v++) {
      out.push({
        location: b.location + v,
        size: 4,
        type: b.format === 'unorm8x4' ? 0x1401 /* UNSIGNED_BYTE */ : 0x1406 /* FLOAT */,
        normalized: b.format === 'unorm8x4',
        stride: b.stride,
        offset: v * 16,
      });
    }
  }
  return out;
}

/** WebGPU の `GPUVertexBufferLayout` へ渡す属性配列を生成します。 */
export function wgslAttributeSpecs(
  includeExt = false,
): { shaderLocation: number; offset: number; format: GPUVertexFormat }[] {
  const out: { shaderLocation: number; offset: number; format: GPUVertexFormat }[] = [];
  for (let i = 0; i < INSTANCE_BUFFERS.length; i++) {
    const b = INSTANCE_BUFFERS[i];
    if (!b.eager && !includeExt) continue;
    for (let v = 0; v < b.vectors; v++) {
      out.push({
        shaderLocation: b.location + v,
        offset: v * (b.format === 'unorm8x4' ? 4 : 16),
        format: b.format,
      });
    }
  }
  return out;
}

/** バッファ名からシェーダ側の識別子を導出します (WebGL2 / WebGPU で共通の Stem を使います) */
function stem(b: InstanceBufferSpec): string {
  switch (b.arrayName) {
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

function gLSLName(b: InstanceBufferSpec, v: number): string {
  return b.vectors > 1 ? `${stem(b)}${v}` : stem(b);
}

function wGSLName(b: InstanceBufferSpec, v: number): string {
  return gLSLName(b, v);
}
