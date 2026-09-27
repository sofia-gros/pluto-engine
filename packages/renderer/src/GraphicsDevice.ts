export interface BufferInfo {
  buffer: any;
  size: number;
}

export interface PipelineInfo {
  id: any;
}

export interface GraphicsDevice {
  /**
   * Initialize the graphics context
   */
  init(canvas: HTMLCanvasElement): Promise<void>;

  /**
   * Initialize standard shaders (sprite, sdf, etc)
   */
  initPipelines(): void;

  /**
   * Create a buffer for streaming data (e.g., SoA)
   */
  createBuffer(size: number): BufferInfo;

  /**
   * Update the GPU buffer with zero-allocation streaming
   */
  updateBuffer(bufferInfo: BufferInfo, data: Float32Array): void;

  /**
   * Clear the screen
   */
  clear(r: number, g: number, b: number, a: number): void;

  /**
   * Bind standard sprite shaders and prepare for drawing
   */
  bindShaders(): void;

  /**
   * Setup attributes for instanced rendering
   */
  setupInstancedAttributes(buffers: Record<string, BufferInfo>): void;

  /**
   * Draw instances
   */
  drawInstanced(activeCount: number): void;

  /**
   * Set uniform matrix
   */
  setUniformMatrix4fv(name: string, matrix: Float32Array): void;

  /**
   * Create a shader pipeline
   */
  createPipeline(vertSource: string, fragSource: string): PipelineInfo;

  /**
   * Bind the pipeline
   */
  bindPipeline(pipeline: PipelineInfo): void;

  /**
   * Destroy the context and release resources
   */
  destroy(): void;
}
