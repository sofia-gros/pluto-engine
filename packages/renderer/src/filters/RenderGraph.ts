/**
 * @file RenderGraph.ts
 * @description Filter チェーンを統括する多重パス構成（Phase 8 RenderGraph）。
 *
 * ## 役割
 *
 * 1 フレームの描画を「scene → filter たち → canvas」という**パスの列**として
 * 表現し、ping-pong テクスチャの所有者と順序を管理します。
 *
 * ```
 *   sceneTarget  ──▶ filter[0] ──▶ scratch ──▶ filter[1] ──▶ sceneTarget
 *        └──────────────── presentTarget(canvas) ────────────────┘
 * ```
 *
 * ## 毎フレームの確保はゼロ
 *
 * 鉄則 R-02 に従い、パス列の配列はフレーム内で作らず、
 * `setFilters` で鎖を確定したときのものを使い回します。
 * 毎フレーム行うのは uniform の `writeBuffer` と draw だけです。
 *
 * ## Filter が 0 個なら何もしない
 *
 * `hasFilters` が false のとき `render()` は scene を直接 swapchain へ描きます。
 * 既存挙動は完全に保存されます（既定オフ）。
 */

import type { FilterDef } from './types';

/** WebGPU 限定-method を抽象化した最小インターフェース */
interface FilterCapableDevice {
  isFilterSupported(): boolean;
  beginSceneToTarget(width: number, height: number): boolean;
  /** 診断: scene target の中心画素を読み戻す */
  probeSceneTarget?(): void;
  runFilterPass(
    wgsl: string,
    srcTexture: unknown,
    dstTexture: unknown,
    uniforms: Float32Array,
    probe?: boolean,
  ): boolean;
  presentTarget(srcTexture: unknown): boolean;
  getSceneTexture(): unknown;
  getFilterScratchTexture(): unknown;
}

export class RenderGraph {
  private _internal: readonly FilterDef[] = [];
  private _external: readonly FilterDef[] = [];
  /** ping-pong の現在地。偶数回swap 後は sceneTexture を返す */
  private _flipped = false;

  /**
   * Filter チェーンを設定します。
   *
   * @param internal `filters.internal` 由来のフィルタ列
   * @param external 外部（post-pipeline）フィルタ列。RenderGraph は順序を保つだけで、
   *                 個別の意味は持ちません
   */
  setFilters(internal: readonly FilterDef[], external: readonly FilterDef[] = []): void {
    this._internal = internal;
    this._external = external;
    // 画面サイズ依存の重みを持つフィルタ（Blur）をここで 1 度だけ更新します
    this._notifyViewport(this._lastWidth, this._lastHeight);
  }

  /** フィルタが 1 つでもあれば true */
  get hasFilters(): boolean {
    return this._internal.length > 0 || this._external.length > 0;
  }

  /**
   * 実際に適用されるフィルタ列（WebGL2 で無視されるものを除外）。
   *
   * `webgpuOnly` は **対応状況が確定してから**判定します。
   * ここで推測すると、「対応済みでないのに適用された」挙動になります。
   */
  effectiveFilters(device: unknown): readonly FilterDef[] {
    const dev = device as Partial<FilterCapableDevice>;
    const supported = typeof dev.isFilterSupported === 'function' && dev.isFilterSupported();
    const all = this._internal.concat(this._external);
    return supported ? all.filter((f) => !f.webgpuOnly || supported) : [];
  }

  /**
   * 1 フレームを描画します。
   *
   * @param drawScene スプライト描画（この中では `drawInstanced` を呼ぶ）
   * @param width 画面幅 (px)
   * @param height 画面高 (px)
   */
  render(drawScene: () => void, width: number, height: number, device: unknown): boolean {
    const dev = device as Partial<FilterCapableDevice>;
    if (
      typeof dev.beginSceneToTarget !== 'function' ||
      typeof dev.runFilterPass !== 'function' ||
      typeof dev.presentTarget !== 'function'
    ) {
      // Filter を扱えないバックエンドは従来どおり直接描画します
      drawScene();
      return false;
    }
    /**
     * `drawScene` が 1 回だけ呼ばれる前提を、**count で保証**します。
     *
     * 2 回以上呼ばれると、フィルタ連鎖の途中で scene が canvas へ
     * 直接描かれて混線します（実際にそうなりました）。
     */
    this._sceneDrawCalls = 0;

    const chain = this.effectiveFilters(device);
    if (chain.length === 0) {
      drawScene();
      return false;
    }

    this._notifyViewport(width, height);
    if (dev.beginSceneToTarget(width, height) !== true) {
      drawScene();
      return false;
    }

    // 1. scene をオフスクリーンへ
    this._sceneDrawCalls++;
    drawScene();
    /**
     * 診断は**初回フレームだけ**行います。
     *
     * 同じ readback バッファを scene probe と filter probe で共有しているため、
     * 毎フレーム両方を走らせると二重 map になり、どちらか失敗します。
     */
    if (this._probeSceneOnce) {
      this._probeSceneOnce = false;
      dev.probeSceneTarget?.();
    }

    // 2. filter を順に適用（ping-pong）
    this._flipped = false;
    for (let i = 0; i < chain.length; i++) {
      const f = chain[i];
      for (let p = 0; p < f.passCount; p++) {
        const src = this._flipped ? dev.getFilterScratchTexture?.() : dev.getSceneTexture?.();
        const dst = this._flipped ? dev.getSceneTexture?.() : dev.getFilterScratchTexture?.();
        if (!src || !dst) return false;
        if (f.passSamplesSource(p)) {
          // 最初の 1 フレームだけ probe します（読み戻しは 1 回で足りるため）
          dev.runFilterPass(f.wgsl(p), src, dst, f.uniform(p), this._probeOnce);
          this._probeOnce = false;
        }
        this._flipped = !this._flipped;
      }
    }

    // 3. 最後の結果を canvas へ
    const finalTexture = this._flipped ? dev.getFilterScratchTexture?.() : dev.getSceneTexture?.();
    if (!finalTexture) return false;
    return dev.presentTarget(finalTexture) === true;
  }

  /** 画面サイズ依存の重みを持つフィルタへサイズを伝えます */
  private _notifyViewport(width: number, height: number): void {
    if (width === this._lastWidth && height === this._lastHeight) return;
    this._lastWidth = width;
    this._lastHeight = height;
    const all = this._internal.concat(this._external);
    for (let i = 0; i < all.length; i++) {
      const f = all[i] as FilterDef & { setViewportSize?: (w: number, h: number) => void };
      f.setViewportSize?.(width, height);
    }
  }

  private _lastWidth = 0;
  private _lastHeight = 0;
  /**
   * 診断 probe を 1 回だけ行うためのフラグ。
   *
   * 読み戻しは非同期で高コストなので、毎フレームは過剰です。
   */
  private _probeOnce = true;
  /** scene target の probe を 1 回だけ行うフラグ（buffer を共有するため） */
  private _probeSceneOnce = true;
  /** 直近のフレームで `drawScene` を呼んだ回数（1 であることを保証） */
  private _sceneDrawCalls = 0;

  /** 診断: 直近のフレームで scene 描画を何回呼んだか */
  sceneDrawCalls(): number {
    return this._sceneDrawCalls;
  }
}
