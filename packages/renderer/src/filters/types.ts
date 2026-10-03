/**
 * @file types.ts
 * @description Filter / RenderGraph の型定義（Phase 8 RenderGraph / Filter 基盤）。
 *
 * ## Filter は「宣言」で、毎フレームの確保はゼロ
 *
 * 鉄則 R-02（update/render ループ内で `new` / `{}` / `[]` を作らない）に従い、
 * Filter は uniform 配列とパス列を**構築時に確保**します。
 * 毎フレームは値を書き換えるだけです。
 *
 * ```ts
 * const f = filters.internal.colorMatrix();
 * f.setBrightness(0.5);              // 確保済み配列に書くだけ
 * const passes = [f];                // 毎フレームの new は呼び出し側の責務
 * ```
 *
 * ## WebGPU のみ・WebGL2 の扱い
 *
 * 9.2 の分類で滤镜の多くは **C（WebGPU のみ）** です。
 * WebGL2 では「未対応」を表すだけで、実装は作りません
 * （簡易版を足すと挙動が二重になり、どちらが正か分からなくなるためです）。
 * `FilterDef.webgpuOnly` が true のフィルタは WebGL2 では無視されます。
 */

/** 1 パスの定義。uniform は事前確保済みで、毎フレームは書き換えのみ。 */
export interface FilterPass {
  /**
   * フルスクリーン三角形を描画する WGSL。
   *
   * 入口点は `fs_main` 固定、頂点シェーダは共有の
   * `fullscreen.ts` が fourni します。fragment 側は
   * `@group(0) @binding(0)` にSampler、`@binding(1)` に
   * source テクスチャ、`@binding(2)` に uniform を受け取ります。
   */
  readonly wgsl: string;
  /** uniform データ（`vec4` 単位・16 バイト境界） */
  readonly uniforms: Float32Array;
  /** このパスが source テクスチャを読むか（false なら黒で塗りつぶす） */
  readonly samplesSource: boolean;
}

/**
 * 1 つのフィルタ。
 *
 * 複数パス（ぼかしの水平/垂直など）は `passCount` で表します。
 */
export interface FilterDef {
  /** 安定識別子（保存 / セーブデータからの復元用） */
  readonly key: string;
  /** 表示名 */
  readonly name: string;
  /** 1 フレームあたりのパス数 */
  readonly passCount: number;
  /** WebGPU のみサポートされるか（WebGL2 では無視される） */
  readonly webgpuOnly: boolean;

  /** pass 番号の uniform 配列（構築時に確保済み） */
  uniform(passIndex: number): Float32Array;
  /** pass 番号の WGSL（毎回同じ文字列を返してよい） */
  wgsl(passIndex: number): string;
  /** pass 番号が source を読むか */
  passSamplesSource(passIndex: number): boolean;
}

/**
 * オフスクリーン描画先。
 *
 * スプライトを直接ここに描画し、フィルタで加工してから画面へ出します。
 */
export interface RenderTarget {
  /** GPU 側の実体（バックエンド依存） */
  readonly native: unknown;
  readonly width: number;
  readonly height: number;
}

/**
 * フィルタチェーンの適用結果を表す不変データ。
 *
 * `internal` / `external` の 2 系統を 1 本のチェーンに並べ替えます
 * （Phaser 4 と同じ考え方です）。
 */
export interface FilterChain {
  readonly internal: readonly FilterDef[];
  readonly external: readonly FilterDef[];
}

/**
 * チェーンを空にします（設定ミスの切り分け用）。
 */
export const EMPTY_FILTER_CHAIN: FilterChain = { internal: [], external: [] };

/**
 * uniform のサイズをバイト単位で受け取るヘルパーの型。
 *
 * vec4 単位で確保するため、バイト数は 16 の倍数である必要があります。
 */
export type UniformByteLength = 16 | 32 | 48 | 64 | 80 | 96 | 112 | 128;
