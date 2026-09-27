/// <reference path="./env.d.ts" />
export * from './GraphicsDevice';
export * from './WebGPUDevice';
export * from './WebGL2Device';

import type { GraphicsDevice } from './GraphicsDevice';
import { WebGL2Device } from './WebGL2Device';
// import { WebGPUDevice } from './WebGPUDevice';

/**
 * Creates a GraphicsDevice, prioritizing WebGPU if available.
 */
export async function createGraphicsDevice(canvas: HTMLCanvasElement): Promise<GraphicsDevice> {
  // WebGPU is not fully implemented yet, force WebGL2
  /*
  if (navigator.gpu) {
    try {
      const device = new WebGPUDevice();
      await device.init(canvas);
      return device;
    } catch (e) {
      console.warn('WebGPU initialization failed, falling back to WebGL2', e);
    }
  }
  */

  const device = new WebGL2Device();
  await device.init(canvas);
  return device;
}
