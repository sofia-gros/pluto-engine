import type {
  BufferInfo,
  GraphicsDevice,
  PipelineInfo,
  TextureAsset,
  TextureUploadOptions,
} from './GraphicsDevice';

export class WebGPUDevice implements GraphicsDevice {
  private device: GPUDevice | null = null;
  private textures: Map<string, TextureAsset> = new Map();

  async init(canvas: HTMLCanvasElement): Promise<void> {
    if (!navigator.gpu) {
      throw new Error('WebGPU is not supported');
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error('No WebGPU adapter found');
    }
    this.device = await adapter.requestDevice();
    const context = canvas.getContext('webgpu');
    if (!context) {
      throw new Error('Failed to get WebGPU context');
    }
    context.configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: 'premultiplied',
    });
  }

  initPipelines(): void {}

  createBuffer(size: number): BufferInfo {
    if (!this.device) {
      throw new Error('Device not initialized');
    }
    const buffer = this.device.createBuffer({
      size: size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX,
    });
    return { buffer, size };
  }

  updateBuffer(bufferInfo: BufferInfo, data: Float32Array | Uint32Array | Uint8Array): void {
    if (!this.device) {
      throw new Error('Device not initialized');
    }
    this.device.queue.writeBuffer(
      bufferInfo.buffer as GPUBuffer,
      0,
      data.buffer,
      data.byteOffset,
      data.byteLength,
    );
  }

  uploadTexture(
    key: string,
    source: HTMLImageElement | HTMLCanvasElement | ImageBitmap | ImageData,
    options?: TextureUploadOptions,
  ): TextureAsset {
    const asset: TextureAsset = {
      key,
      layerIndex: 0,
      width: source.width,
      height: source.height,
      frameWidth: options?.frameWidth || source.width,
      frameHeight: options?.frameHeight || source.height,
      frames: [{ uvX: 0, uvY: 0, uvW: 1, uvH: 1 }],
    };
    this.textures.set(key, asset);
    return asset;
  }

  getTexture(key: string): TextureAsset | undefined {
    return this.textures.get(key);
  }

  clear(_r: number, _g: number, _b: number, _a: number): void {}
  bindShaders(): void {}
  setupInstancedAttributes(_buffers: Record<string, BufferInfo>): void {}
  drawInstanced(_activeCount: number): void {}
  setUniformMatrix4fv(_name: string, _matrix: Float32Array): void {}
  createPipeline(_vertSource: string, _fragSource: string): PipelineInfo {
    return { id: null };
  }
  bindPipeline(_pipeline: PipelineInfo): void {}

  destroy(): void {
    if (this.device) {
      this.device.destroy();
      this.device = null;
    }
  }
}
