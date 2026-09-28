/**
 * @file GraphicsDevice.ts
 * @description
 * WebGL2 / WebGPU 抽象グラフィックスデバイスインターフェース。
 * ハードウェアインスタンシング、シェーダーパイプライン、Texture2DArray 管理を統一的に扱います。
 */

export interface BufferInfo {
  buffer: any;
  size: number;
}

export interface PipelineInfo {
  id: any;
}

export interface TextureFrame {
  uvX: number;
  uvY: number;
  uvW: number;
  uvH: number;
}

export interface TextureAsset {
  key: string;
  layerIndex: number;
  width: number;
  height: number;
  frameWidth?: number;
  frameHeight?: number;
  frames?: TextureFrame[];
}

export interface TextureUploadOptions {
  frameWidth?: number;
  frameHeight?: number;
}

export interface GraphicsDevice {
  /**
   * グラフィックスコンテキストを初期化します。
   */
  init(canvas: HTMLCanvasElement): Promise<void>;

  /**
   * スプライト・SDF等の標準シェーダーパイプラインを初期化します。
   */
  initPipelines(): void;

  /**
   * ストリーミングデータ用のGPUバッファを作成します。
   */
  createBuffer(size: number): BufferInfo;

  /**
   * GPUバッファをゼロアロケーションで更新します。
   */
  updateBuffer(bufferInfo: BufferInfo, data: Float32Array | Uint32Array | Uint8Array): void;

  /**
   * 画像・Canvas・BitmapをGPUのTexture2DArrayに転送し、テクスチャアセットを登録します。
   */
  uploadTexture(
    key: string,
    source: HTMLImageElement | HTMLCanvasElement | ImageBitmap | ImageData,
    options?: TextureUploadOptions,
  ): TextureAsset;

  /**
   * 登録済みテクスチャアセットを取得します。
   */
  getTexture(key: string): TextureAsset | undefined;

  /**
   * 画面をクリアします。
   */
  clear(r: number, g: number, b: number, a: number): void;

  /**
   * スプライト描画用シェーダーとテクスチャ配列をバインドします。
   */
  bindShaders(): void;

  /**
   * インスタンシング描画用の頂点属性を設定します。
   */
  setupInstancedAttributes(buffers: Record<string, BufferInfo>): void;

  /**
   * インスタンスを描画します。
   */
  drawInstanced(activeCount: number): void;

  /**
   * uniform マトリックスを設定します。
   */
  setUniformMatrix4fv(name: string, matrix: Float32Array): void;

  /**
   * シェーダーパイプラインを作成します。
   */
  createPipeline(vertSource: string, fragSource: string): PipelineInfo;

  /**
   * パイプラインをバインドします。
   */
  bindPipeline(pipeline: PipelineInfo): void;

  /**
   * コンテキストとGPUリソースを解放します。
   */
  destroy(): void;
}
