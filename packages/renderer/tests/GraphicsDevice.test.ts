import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WebGL2Device } from '../src/WebGL2Device';
import { WebGPUDevice } from '../src/WebGPUDevice';
import { createGraphicsDevice } from '../src/index';

// Create a mock canvas
function createMockCanvas() {
  const canvas = document.createElement('canvas');
  // Removed mock according to rules - use actual browser canvas
  return canvas;
}

describe('GraphicsDevice', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = createMockCanvas();
  });

  describe('WebGL2Device', () => {
    it('initializes context and updates buffer', async () => {
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

  describe('WebGPUDevice', () => {
    let originalGpu: any;

    beforeEach(() => {
      originalGpu = navigator.gpu;
      // Mock WebGPU
      Object.defineProperty(navigator, 'gpu', {
        value: {
          requestAdapter: vi.fn().mockResolvedValue({
            requestDevice: vi.fn().mockResolvedValue({
              queue: {
                writeBuffer: vi.fn(),
              },
              createBuffer: vi.fn(() => ({})),
              destroy: vi.fn(),
            }),
          }),
          getPreferredCanvasFormat: vi.fn().mockReturnValue('bgra8unorm'),
        },
        writable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(navigator, 'gpu', {
        value: originalGpu,
        writable: true,
      });
    });

    it('initializes context and updates buffer', async () => {
      const device = new WebGPUDevice();
      await device.init(canvas);

      const bufferInfo = device.createBuffer(1024);
      expect(bufferInfo).toBeDefined();

      const data = new Float32Array(256);
      expect(() => {
        device.updateBuffer(bufferInfo, data);
      }).not.toThrow();

      device.destroy();
    });
  });

  describe('createGraphicsDevice', () => {
    it('prioritizes WebGPU when available', async () => {
      Object.defineProperty(navigator, 'gpu', {
        value: {
          requestAdapter: vi.fn().mockResolvedValue({
            requestDevice: vi.fn().mockResolvedValue({
              queue: { writeBuffer: vi.fn() },
              createBuffer: vi.fn(),
              destroy: vi.fn(),
            }),
          }),
          getPreferredCanvasFormat: vi.fn().mockReturnValue('bgra8unorm'),
        },
        writable: true,
      });

      const device = await createGraphicsDevice(canvas);
      expect(device).toBeInstanceOf(WebGPUDevice);
    });

    it('falls back to WebGL2 when WebGPU is not available', async () => {
      Object.defineProperty(navigator, 'gpu', {
        value: undefined,
        writable: true,
      });

      const device = await createGraphicsDevice(canvas);
      expect(device).toBeInstanceOf(WebGL2Device);
    });
  });
});
