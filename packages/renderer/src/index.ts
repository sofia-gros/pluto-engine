/// <reference path="./env.d.ts" />
export * from './GraphicsDevice';
export * from './WebGPUDevice';
export * from './WebGL2Device';

import type { GraphicsDevice } from './GraphicsDevice';
import { WebGL2Device } from './WebGL2Device';
import { WebGPUDevice } from './WebGPUDevice';

export interface CreateDeviceOptions {
  /** 'auto' (既定) は WebGPU を試し失敗時 WebGL2 へ落ちます */
  backend?: 'auto' | 'webgpu' | 'webgl2';
  /** フォールバック時に警告を出します */
  warnOnFallback?: boolean;
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
    await device.init(canvas);
    return device;
  }

  // WebGPU を試します。失敗しても auto なら WebGL2 へ落ちます
  if (typeof navigator !== 'undefined' && navigator.gpu) {
    try {
      const device = new WebGPUDevice();
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
  await device.init(canvas);
  return device;
}
