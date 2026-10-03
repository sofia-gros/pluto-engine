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
   * テクスチャ配列 1 レあたりの幅 (ピクセル)。
   *
   * フレーム UV の正規化はこのレイヤー寸法が基準になります。
   * ソース画像がレイヤーより小さい場合、画像は左上に寄せて配置され、
   * 残りは未使用領域となるため、ソース寸法で正規化してはいけません。
   */
  readonly textureWidth: number;
  /**
   * テクスチャ配列 1 レあたりの高さ (ピクセル)。{@link textureWidth} と同じ基準。
   */
  readonly textureHeight: number;

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
   * プロシージャルテクスチャをGPUで生成し、TextureAssetとして登録します。
   */
  generateProceduralTexture(
    key: string,
    type: 'gradient' | 'noise',
    width: number,
    height: number,
    options?: any,
  ): TextureAsset | null;

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
   *
   * `buffers` は `InstanceBufferArena` の `packed*` ミラーに対応する
   * GPU バッファ表です（`INSTANCE_BUFFERS` の name がキーになります）。
   *
   * @param buffers      パック済みバッファの表
   * @param activeCount  描画するインスタンス数
   * @param baseInstance 描画開始インスタンスのインデックス。
   *                     可視区間だけを描画したい場合に使います。
   *                     WebGPU には `firstInstance` 引数がありますが、
   *                     WebGL2 には無いので `vertexAttribPointer` の
   *                     `byteOffset` へ加算して実現します。
   */
  setupInstancedAttributes(
    buffers: Record<string, BufferInfo>,
    activeCount?: number,
    baseInstance?: number,
  ): void;

  /**
   * インスタンスを描画します。
   *
   * @param activeCount  描画するインスタンス数
   * @param baseInstance 描画開始インスタンスのインデックス
   */
  drawInstanced(activeCount: number, baseInstance?: number): void;

  /**
   * 現在の描画結果を `out` へ読み戻します。
   *
   * スクリーンショット取得や、golden テスト（描画の回帰検出）に使います。
   * GPU 側では毎フレームの定常経路ではないため、遅延確保を許します。
   *
   * **左上原点**の RGBA 8bit の tight 配列で返します
   * （WebGL の `readPixels` は下原点のため、行を反転して渡します）。
   * キャンバスの設定によりアルファは premultiplied です。
   *
   * @param out    `width * height * 4` 要素の受け先（呼び出し側の使い回し配列）
   * @param width  既定は描画バッファの幅
   * @param height 既定は描画バッファの高さ
   * @returns 読み戻せたなら true。対応しないバックエンドやコンテキスト喪失中なら false
   */
  readPixels(out: Uint8Array, width?: number, height?: number): boolean;

  /**
   * uniform マトリックスを設定します。
   */
  setUniformMatrix4fv(name: string, matrix: Float32Array): void;

  /**
   * GPU カリングの可視矩形を設定します（Phase 8 P-03）。
   *
   * 有効にすると頂点シェーダが矩形外のクワッドを縮退三角形へ変換し、
   * ラスタライザに破棄させます。これにより CPU 側の SoA の詰め替え
   * （`partitionVisible`）が不要になります。
   *
   * 未実装のバックエンドでは何もしません（optional）。
   *
   * @param rect `(minX, minY, maxX, maxY)` のワールド座標 4 要素
   * @param enabled false で頂点シェーダのカリングを無効にします
   */
  setCullRect?(rect: Float32Array, enabled: boolean): void;

  /**
   * 直近の GPU 実行時間を返します (Phase 8 P-02)。
   *
   * ドローコール発行は非同期なので、CPU 時間だけでは
   * 「カリングを GPU に移した副作用（頂点処理の増）」を観測できません。
   * WebGPU の timestamp query で実測します。
   *
   * 非対応・未計測のときは -1 を返します（optional なので
   * 未実装のバックエンドではこのメソッド自体がありません）。
   *
   * **読み出しは非同期**です。実測できるフレームまで -1 が返るため、
   * ベンチは連続してフレームを回して中央値を取る必要があります。
   */
  resolveGpuTimeMs?(): number;

  /**
   * compute カリングを実行し、間接描画引数を更新します (Phase 8 P-02)。
   *
   * 頂点シェーダによる GPU カリング（P-03）と違い、**可視インスタンスだけを
   * 描画します**。CPU コスト，切れない上に GPU 側も減るため、両方の 利得を
   * 同時に得られます。コストは画面外も compute が 1 件ずつ判定する点です。
   *
   * 対応していないバックエンドでは何もしず false を返します（optional）。
   *
   * @param rect 可視矩形 (minX, minY, maxX, maxY)
   * @param instanceCount 判定対象のインスタンス数
   * @returns dispatch を行ったか
   */
  beginComputeCulling?(rect: Float32Array, instanceCount: number): boolean;

  /** compute カリングが使える状態か (Phase 8 P-02)。 */
  isComputeCullingSupported?(): boolean;

  /**
   * compute カリングで数えた可視インスタンス数を返します (Phase 8 P-02)。
   *
   * **間接描画は CPU から見た描画数を返さないため、.compute カリングの
   * 実効性を示す唯一の証拠です。** ベンチはこれを報告します。
   *
   * 読み出しは非同期です。実測できるフレームまで -1 を返します。
   */
  resolveVisibleCount?(): number;

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
