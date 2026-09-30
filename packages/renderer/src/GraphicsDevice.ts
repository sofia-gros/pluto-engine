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
  /**
   * フレーム名 → 添字の対応表。
   *
   * TexturePacker などのアトラスを読む場合だけ入ります。
   * 均一グリッドのスプライトシートでは null のままです
   * (null のままでも setFrame('name') は 0 へフォールバックします)。
   */
  frameNames?: Map<string, number> | null;
}

export interface TextureUploadOptions {
  frameWidth?: number;
  frameHeight?: number;
  /**
   * 明示的なフレーム矩形 (ピクセル単位)。
   *
   * 指定すると、frameWidth / frameHeight による均一グリッドの自動計算を
   * 飛ばしてこの配列をそのまま使います。TexturePacker のアトラス用です。
   */
  frames?: { x: number; y: number; w: number; h: number }[];
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
   *
   * `subarray()` は毎回新しいビューオブジェクトをヒープへ確保するため使わないでください。
   * 配列全体と範囲 (srcOffset / length) を渡し、転送したい範囲だけを GPU へ送ります。
   */
  updateBuffer(
    bufferInfo: BufferInfo,
    data: Float32Array | Uint32Array | Uint8Array,
    srcOffset?: number,
    length?: number,
  ): void;

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
   *
   * @param sdfThreshold SDF テキストの輪郭位置 (0.5 が縁)
   * @param sdfSmoothing 輪郭をぼかす幅
   */
  bindShaders(sdfThreshold?: number, sdfSmoothing?: number): void;

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
