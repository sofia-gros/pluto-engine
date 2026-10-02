/**
 * @file fullscreen.ts
 * @description フィルタ用のフルスクリーン三角形。
 *
 * ## なぜ三角形 1 枚か
 *
 * 2 枚の quad（4 頂点）では**対角線の隙間**が問題になるため、
 * 三角形 1 枚で全画面を覆います。頂点は 3 つだけで、
 * 画面外も三角形の一部なのでクランプ処理が不要です。
 *
 * ```wgsl
 * // (-1,-1) (3,-1) (-1,3) を 1 枚の三角形にする
 * ```
 *
 * 描画は `draw(3, 1, 0, 0)` です。
 */

/** 頂点シェーダ（共有・全フィルタ共通） */
export const FULLSCREEN_VERT_WGSL = /* wgsl */ `
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

/**
 * 頂点シェーダ（不変 blit 用。uniform なし・texture 1 枚のみ）。
 *
 * `FULLSCREEN_VERT_WGSL` と同じ構造ですが、uniform を持たないぶん
 * binding が 2 つだけです。
 */
export const BLIT_VERT_WGSL = /* wgsl */ `
struct VsOut {
  @builtin(position) pos : vec4<f32>,
  @location(0) uv : vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vi : u32) -> VsOut {
  var p = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0),
  );
  var o : VsOut;
  let xy : vec2<f32> = p[vi];
  o.pos = vec4<f32>(xy, 0.0, 1.0);
  o.uv = vec2<f32>(xy.x * 0.5 + 0.5, 0.5 - xy.y * 0.5);
  return o;
}
`;

/**
 * フラグメントシェーダの共通前置きを生成します。
 *
 * 各フィルタは「sample と uniform を読む」部分だけを書きます。
 * `body` は `vec4<f32>` を返す式（色）である必要があります。
 *
 * ## `body` は「文の並び」です
 *
 * `return ${body};` の形にすると、`body` に `let` 宣言が来た時点で
 * `expected ';' for return statement` という **WGSL の構文エラー**になります。
 * そのため `fs_main` の**中身**としてそのまま埋め込みます。
 *
 * ```wgsl
 * // body は return を含む文の並びで書きます
 * let c = textureSampleLevel(...);
 * return c;
 * ```
 *
 * @param body `vec4<f32>` を返す WGSL の文の並び（`return` を含む）
 */
export function fragmentWGSL(body: string): string {
  return `${FULLSCREEN_VERT_WGSL}
@group(0) @binding(0) var samp : sampler;
@group(0) @binding(1) var srcTex : texture_2d<f32>;

struct FilterUniforms {
  // 各 vec4 はフィルタごとに自由に解釈します
  params : array<vec4<f32>, 8>,
};
@group(0) @binding(2) var<uniform> u : FilterUniforms;

@fragment
fn fs_main(in : VsOut) -> @location(0) vec4<f32> {
  ${body}
}
`;
}
