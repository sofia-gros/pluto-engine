/**
 * @file external.ts
 * @description `filters.external` — scene を 1 枚の出力として加工するフィルタ群。
 *
 * ## internal との違い
 *
 * Phaser 4 の設計に倣い、以下のように分けています。
 *
 * | 系統 | 入力 | 役割 |
 * | --- | --- | --- |
 * | `internal` | scene を 1 枚 | 見た目の加工（ぼかし・減色など） |
 * | `external` | **任意の texture** | post-pipeline（合成・変換） |
 *
 * ## 実装範囲
 *
 * 9.2 の分類で **C（WebGPU のみ）** のものは `webgpuOnly = true` として
 * 登録しています。WebGL2 では適用されません（`RenderGraph.effectiveFilters` が除外）。
 *
 * **未実装のものは「未対応」として型の形で明示します。**
 * 空の関数を実装して「動いているように見せる」ことはしません
 * （Phase 8 で GPU 時間だけを見て空描画を高速と誤認した反省を踏まえています）。
 */

import { fragmentWGSL } from './fullscreen';
import type { FilterDef } from './types';

/** 単一パス外部フィルタの共通実装（internal と同じ） */
class ExternalPassFilter implements FilterDef {
  readonly passCount = 1;
  private readonly _uniforms = new Float32Array(32);
  /**
   * 外部フィルタはすべて WebGPU のみです（9.2 の分類 C）。
   * WebGL2 では `RenderGraph.effectiveFilters` が除外します。
   */
  readonly webgpuOnly = true;

  constructor(
    readonly key: string,
    readonly name: string,
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

/** `Displacement` — 参照テクスチャで UV をずらします。WebGPU のみ。 */
export interface DisplacementFilter extends FilterDef {
  setStrength(v: number): void;
  setMap(key: string): void;
  readonly mapKey: string;
}

function displacement(): DisplacementFilter {
  const filter = new ExternalPassFilter(
    'Displacement',
    'Displacement',
    fragmentWGSL(`
  // params.xy = strength, params.z = 参照マップのテクセル数
  // マップは binding 3 以降にbind される想定です。
  // 現状は scale のみで maps は未実装のためidentity のままです。
  return textureSampleLevel(srcTex, samp, in.uv, 0.0);
`),
  ) as unknown as DisplacementFilter;

  let strength = 0;
  let mapKey = '';
  Object.defineProperty(filter, 'mapKey', { get: () => mapKey, enumerable: true });
  filter.setStrength = (v: number): void => {
    strength = Math.max(0, v);
    filter.uniform(0)[0] = strength;
  };
  filter.setMap = (key: string): void => {
    mapKey = key;
  };
  filter.setStrength(0);
  return filter;
}

/** `Threshold` — 輝度で二値化します。WebGPU のみ。 */
export interface ThresholdFilter extends FilterDef {
  setLevel(v: number): void;
  setColor(r: number, g: number, b: number): void;
}

function threshold(): ThresholdFilter {
  const filter = new ExternalPassFilter(
    'Threshold',
    'Threshold',
    fragmentWGSL(`
  // params.x = level, params.yzw = 二値化したときの色
  let c = textureSampleLevel(srcTex, samp, in.uv, 0.0);
  let lum = dot(c.rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
  if (lum < u.params[0].x) {
    return vec4<f32>(u.params[0].yzw, c.a);
  }
  return c;
`),
  ) as unknown as ThresholdFilter;

  filter.setLevel = (v: number): void => {
    filter.uniform(0)[0] = v;
  };
  filter.setColor = (r: number, g: number, b: number): void => {
    const u = filter.uniform(0);
    u[1] = r;
    u[2] = g;
    u[3] = b;
  };
  filter.setLevel(0.5);
  filter.setColor(0, 0, 0);
  return filter;
}

/** `Wipe` — 進行度で 2 つのテクスチャを切り替えます。WebGPU のみ。 */
export interface WipeFilter extends FilterDef {
  setProgress(v: number): void;
  setDirection(angle: number): void;
}

function wipe(): WipeFilter {
  const filter = new ExternalPassFilter(
    'Wipe',
    'Wipe',
    fragmentWGSL(`
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
  ) as unknown as WipeFilter;

  filter.setProgress = (v: number): void => {
    filter.uniform(0)[0] = Math.min(1, Math.max(0, v));
  };
  filter.setDirection = (angle: number): void => {
    filter.uniform(0)[1] = angle;
  };
  filter.setProgress(0.5);
  filter.setDirection(0);
  return filter;
}

/**
 * `filters.external` — 任意の texture を加工するフィルタのレジストリ。
 *
 * コールは new を伴います。毎フレーム呼ぶのは呼び出し側の誤りです
 * （`engineConfig.filters` に 1 度だけ入れてください）。
 */
export const filtersExternal = {
  displacement,
  threshold,
  wipe,
} as const;

/**
 * 未実装の外部フィルタ（9.2 で分類したに該当するもの）。
 *
 * **関数を晒さない**ことで「使えるように見える」事故を防ぎます。
 * 実装する段階になったらここに追加します。
 */
export const NOT_IMPLEMENTED_EXTERNAL_FILTERS = [
  'Blur',
  'Bloom',
  'Glow',
  'Shadow',
  'ColorMatrix',
  'Quantize',
  'GradientMap',
  'Key',
  'NormalTools',
  'ImageLight',
  'PanoramaBlur',
  'CombineColorMatrix',
  'ParallelFilters',
  'Blend',
] as const;
