import { beforeEach, describe, expect, it } from 'vitest';
import { WebGL2Device } from '../src/WebGL2Device';
import { WebGPUDevice } from '../src/WebGPUDevice';
import { createGraphicsDevice } from '../src/index';

describe('GraphicsDevice', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
  });

  describe('WebGL2Device', () => {
    it('initializes context and updates buffer on real browser canvas', async () => {
      const device = new WebGL2Device();
      await device.init(canvas);

      const bufferInfo = device.createBuffer(1024);
      expect(bufferInfo).toBeDefined();
      expect(bufferInfo.size).toBe(1024);

      const data = new Float32Array(256);
      expect(() => {
        device.updateBuffer(bufferInfo, data);
      }).not.toThrow();

      device.destroy();
    });
  });

  describe('createGraphicsDevice', () => {
    it('creates a valid graphics device (WebGL2 or WebGPU) for real canvas', async () => {
      const device = await createGraphicsDevice(canvas);
      expect(device).toBeDefined();
      expect(device instanceof WebGL2Device || device instanceof WebGPUDevice).toBe(true);
      device.destroy();
    });
  });
});
