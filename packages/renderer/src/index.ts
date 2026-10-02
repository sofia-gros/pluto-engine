/// <reference path="./env.d.ts" />
export * from './GraphicsDevice';
export * from './InstanceLayout';
export * from './WebGPUDevice';
export * from './WebGL2Device';

// Phase 8: Filter 基盤（RenderGraph / filters.internal / filters.external）
export * from './filters/RenderGraph';
export * from './filters/types';
export { filters } from './filters/internal';
export { filtersExternal, NOT_IMPLEMENTED_EXTERNAL_FILTERS } from './filters/external';

import type { GraphicsDevice } from './GraphicsDevice';
import { WebGL2Device } from './WebGL2Device';
import { WebGPUDevice } from './WebGPUDevice';

export interface CreateDeviceOptions {
  /** 'auto' (既定) は WebGPU を試し失敗時 WebGL2 へ落ちます */
  backend?: 'auto' | 'webgpu' | 'webgl2';
  /** フォールバック時に警告を出します */
  warnOnFallback?: boolean;
  /**
   * WebGPU の timestamp query を有効化します (Phase 8 P-02)。
   *
   * feature を `requestDevice` 時に要求する必要があるため、
   * デバイス生成前に指定しなければなりません。
   *
   * **読み出しが値を返さない既知の問題があるため既定は false** です。
   * 有効化しても描画は壊れません（タイムスタンプが計測されないだけ）。
   * 詳細は IMPACT_SCOPE.md の 9.3 を参照してください。
   */
  timestampQuery?: boolean;
  /**
   * compute カリング（間接描画）を有効化します (Phase 8 P-02、既定は false)。
   *
   * 頂点シェーダ GPU カリング（P-03）とは別物で、可視インスタンスだけを
   * 描画します。WebGPU の compute と indirect draw を使います。
   *
   * ストレージバッファを compute stage で 4 本使うため
   * `maxStorageBuffersPerShaderStage < 4` の環境では自動的に無効になります。
   */
  computeCulling?: boolean;
}

/**
 * GraphicsDevice を生成します。
 *
 * 'auto' の場合は WebGPU を優先し、初期化に失敗したら WebGL2 へ自動的に
 * フォールバックします。'webgpu' を明示した場合はフォールバックしません
 * (呼び出し側で制御できます)。
 */
export async function createGraphicsDevice(
  canvas: HTMLCanvasElement,
  options: CreateDeviceOptions = {},
): Promise<GraphicsDevice> {
  const backend = options.backend ?? 'auto';

  if (backend === 'webgl2') {
    const device = new WebGL2Device();
    // 拡張の要求は init() より前に行う必要があります
    if (options.timestampQuery === true) device.enableTimestampQuery();
    await device.init(canvas);
    return device;
  }

  // WebGPU を試します。失敗しても auto なら WebGL2 へ落ちます
  if (typeof navigator !== 'undefined' && navigator.gpu) {
    try {
      const device = new WebGPUDevice();
      if (options.timestampQuery === true) device.enableTimestampQuery();
      if (options.computeCulling === true) device.enableComputeCulling();
      await device.init(canvas);
      // パイプラインが組めない場合は描画できないため WebGL2 へ戻します
      device.initPipelines();
      return device;
    } catch (e) {
      if (backend === 'webgpu') throw e;
      if (options.warnOnFallback !== false) {
        console.warn('WebGPU initialization failed, falling back to WebGL2', e);
      }
    }
  } else if (backend === 'webgpu') {
    throw new Error('WebGPU is not available in this browser');
  }

  const device = new WebGL2Device();
  if (options.timestampQuery === true) device.enableTimestampQuery();
  await device.init(canvas);
  return device;
}
