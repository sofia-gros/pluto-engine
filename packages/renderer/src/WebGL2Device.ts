import type {
  BufferInfo,
  GraphicsDevice,
  PipelineInfo,
  TextureAsset,
  TextureFrame,
  TextureUploadOptions,
} from './GraphicsDevice';

/**
 * WebGL2 スプライト描画用の頂点シェーダー（GLSL ES 3.0）
 * インスタンシング属性を使用し、SoA データを直接処理する。
 */
const SPRITE_VERT_GLSL = `#version 300 es
precision highp float;

layout(location = 0) in vec2 vertexPos;
layout(location = 1) in vec2 vertexUV;
layout(location = 2) in float posX;
layout(location = 3) in float posY;
layout(location = 4) in float scale;
layout(location = 5) in float facing;
layout(location = 6) in float uvX;
layout(location = 7) in float uvY;
layout(location = 8) in float uvW;
layout(location = 9) in float uvH;
layout(location = 10) in float layerDepth;
layout(location = 11) in float frameIdx;
layout(location = 12) in vec4 tint;

uniform mat4 projectionMatrix;

out vec2 vUV;
out float vLayer;
out vec4 vTint;

void main() {
    vec2 scaledPos = vec2(vertexPos.x * scale * facing, vertexPos.y * scale);
    vec2 worldPos = scaledPos + vec2(posX, posY);
    gl_Position = projectionMatrix * vec4(worldPos, 0.0, 1.0);
    vUV = vertexUV * vec2(uvW, uvH) + vec2(uvX, uvY);
    vLayer = frameIdx;
    vTint = tint;
}
`;

/**
 * WebGL2 スプライト描画用のフラグメントシェーダー（GLSL ES 3.0）
 * sampler2DArray でテクスチャアトラスを参照し、Tint 色を乗算する。
 */
const SPRITE_FRAG_GLSL = `#version 300 es
precision highp float;

uniform highp sampler2DArray textureArray;

in vec2 vUV;
in float vLayer;
in vec4 vTint;

out vec4 fragColor;

void main() {
    vec4 texColor = texture(textureArray, vec3(vUV, vLayer));
    fragColor = texColor * vTint;
}
`;

export class WebGL2Device implements GraphicsDevice {
  private gl: WebGL2RenderingContext | null = null;
  private currentPipeline: WebGLProgram | null = null;

  private spritePipeline: PipelineInfo | null = null;
  private quadBuffer: WebGLBuffer | null = null;
  private textureArray: WebGLTexture | null = null;

  public readonly textureWidth = 2048;
  public readonly textureHeight = 2048;
  public readonly maxLayers = 64;
  private currentLayerCount = 1; // Layer 0 は白色単色ピクセル

  private textures: Map<string, TextureAsset> = new Map();

  async init(canvas: HTMLCanvasElement): Promise<void> {
    const gl = (canvas.getContext('webgl2') ||
      canvas.getContext('experimental-webgl2')) as WebGL2RenderingContext | null;
    if (!gl) {
      throw new Error('WebGL2 is not supported');
    }
    this.gl = gl;

    // ブレンド設定 (透過PNG対応)
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    // Texture2DArray の初期化 (Layer 0 に白ピクセルを格納)
    this.initTextureArray();
  }

  private initTextureArray(): void {
    if (!this.gl) return;
    this.textureArray = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.textureArray);

    // テクスチャパラメータ (ピクセルアート向けニアレスト隣接)
    this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

    // 2048x2048 x 64レイヤー の 3D テクスチャ領域を GPU 側に事前確保
    this.gl.texImage3D(
      this.gl.TEXTURE_2D_ARRAY,
      0,
      this.gl.RGBA,
      this.textureWidth,
      this.textureHeight,
      this.maxLayers,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      null,
    );

    // Layer 0: 単色・未テクスチャ用 1x1 白ピクセルを書き込み
    const whitePixel = new Uint8Array([255, 255, 255, 255]);
    this.gl.texSubImage3D(
      this.gl.TEXTURE_2D_ARRAY,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      whitePixel,
    );

    // レイヤー0アセットをデフォルト白テクスチャとして登録
    this.textures.set('__default_white__', {
      key: '__default_white__',
      layerIndex: 0,
      width: 1,
      height: 1,
      frames: [{ uvX: 0, uvY: 0, uvW: 1.0 / this.textureWidth, uvH: 1.0 / this.textureHeight }],
    });
  }

  /**
   * 画像・Canvasを GPU の Texture2DArray に転送し、スプライト用の TextureAsset を生成します。
   */
  uploadTexture(
    key: string,
    source: HTMLImageElement | HTMLCanvasElement | ImageBitmap | ImageData,
    options?: TextureUploadOptions,
  ): TextureAsset {
    if (!this.gl || !this.textureArray) {
      throw new Error('Device or texture array not initialized');
    }

    if (this.textures.has(key)) {
      return this.textures.get(key)!;
    }

    if (this.currentLayerCount >= this.maxLayers) {
      console.warn(`TextureArray layer limit reached (${this.maxLayers}). Reusing existing layer.`);
      return this.textures.get('__default_white__')!;
    }

    const layerIndex = this.currentLayerCount++;
    const width = source.width;
    const height = source.height;

    this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.textureArray);

    // GPU への直接サブ画像転送 (TexSubImage3D)
    this.gl.texSubImage3D(
      this.gl.TEXTURE_2D_ARRAY,
      0,
      0,
      0,
      layerIndex,
      width,
      height,
      1,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      source as any,
    );

    // フレーム UV 座標の計算
    const frames: TextureFrame[] = [];
    const frameWidth = options?.frameWidth || width;
    const frameHeight = options?.frameHeight || height;

    const cols = Math.max(1, Math.floor(width / frameWidth));
    const rows = Math.max(1, Math.floor(height / frameHeight));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        frames.push({
          uvX: (c * frameWidth) / this.textureWidth,
          uvY: (r * frameHeight) / this.textureHeight,
          uvW: frameWidth / this.textureWidth,
          uvH: frameHeight / this.textureHeight,
        });
      }
    }

    const asset: TextureAsset = {
      key,
      layerIndex,
      width,
      height,
      frameWidth,
      frameHeight,
      frames,
    };

    this.textures.set(key, asset);
    return asset;
  }

  getTexture(key: string): TextureAsset | undefined {
    return this.textures.get(key);
  }

  initPipelines(): void {
    this.spritePipeline = this.createPipeline(SPRITE_VERT_GLSL, SPRITE_FRAG_GLSL);
    this.createQuadBuffer();
  }

  private createQuadBuffer(): void {
    if (!this.gl) return;
    // スプライト用 Quad (4頂点 Triangle Strip)
    const quadData = new Float32Array([
      -0.5, -0.5, 0.0, 0.0, 0.5, -0.5, 1.0, 0.0, -0.5, 0.5, 0.0, 1.0, 0.5, 0.5, 1.0, 1.0,
    ]);
    this.quadBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, quadData, this.gl.STATIC_DRAW);
  }

  createBuffer(size: number): BufferInfo {
    if (!this.gl) throw new Error('Device not initialized');
    const buffer = this.gl.createBuffer();
    if (!buffer) throw new Error('Failed to create WebGL2 buffer');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, size, this.gl.DYNAMIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    return { buffer, size };
  }

  updateBuffer(bufferInfo: BufferInfo, data: Float32Array | Uint32Array | Uint8Array): void {
    if (!this.gl) throw new Error('Device not initialized');
    const buffer = bufferInfo.buffer as WebGLBuffer;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, data);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  clear(r: number, g: number, b: number, a: number): void {
    if (!this.gl) return;
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  bindShaders(): void {
    if (this.spritePipeline && this.gl) {
      this.bindPipeline(this.spritePipeline);
      // Texture2DArray をバインド
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.textureArray);
      const program = this.spritePipeline.id as WebGLProgram;
      const loc = this.gl.getUniformLocation(program, 'textureArray');
      if (loc !== null) {
        this.gl.uniform1i(loc, 0);
      }
    }
  }

  setupInstancedAttributes(buffers: Record<string, BufferInfo>): void {
    if (!this.gl || !this.spritePipeline) return;

    // 0: vertexPos, 1: vertexUV
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
    this.gl.enableVertexAttribArray(0);
    this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 16, 0);

    this.gl.enableVertexAttribArray(1);
    this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, 16, 8);

    const bindInstancedAttr = (loc: number, bufName: string, size: number) => {
      const b = buffers[bufName];
      if (b && this.gl) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, b.buffer);
        this.gl.enableVertexAttribArray(loc);
        this.gl.vertexAttribPointer(loc, size, this.gl.FLOAT, false, 0, 0);
        this.gl.vertexAttribDivisor(loc, 1);
      }
    };

    const setDef1f = (loc: number, bufName: string, def: number) => {
      if (buffers[bufName]) {
        bindInstancedAttr(loc, bufName, 1);
      } else if (this.gl) {
        this.gl.disableVertexAttribArray(loc);
        this.gl.vertexAttrib1f(loc, def);
      }
    };

    bindInstancedAttr(2, 'posX', 1);
    bindInstancedAttr(3, 'posY', 1);
    bindInstancedAttr(4, 'scale', 1);

    setDef1f(5, 'facing', 1.0);
    setDef1f(6, 'uvX', 0.0);
    setDef1f(7, 'uvY', 0.0);
    setDef1f(8, 'uvW', 1.0);
    setDef1f(9, 'uvH', 1.0);
    setDef1f(10, 'layerDepth', 0.0);
    setDef1f(11, 'frameIdx', 0.0);

    if (buffers['tint']) {
      const b = buffers['tint'];
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, b.buffer);
      this.gl.enableVertexAttribArray(12);
      this.gl.vertexAttribPointer(12, 4, this.gl.UNSIGNED_BYTE, true, 0, 0);
      this.gl.vertexAttribDivisor(12, 1);
    } else {
      this.gl.disableVertexAttribArray(12);
      this.gl.vertexAttrib4f(12, 1.0, 1.0, 1.0, 1.0);
    }
  }

  private compileShader(type: number, source: string): WebGLShader {
    if (!this.gl) throw new Error('Device not initialized');
    const shader = this.gl.createShader(type);
    if (!shader) throw new Error('Failed to create shader');
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error(`Shader compile error: ${info}`);
    }
    return shader;
  }

  createPipeline(vertSource: string, fragSource: string): PipelineInfo {
    if (!this.gl) throw new Error('Device not initialized');
    const vert = this.compileShader(this.gl.VERTEX_SHADER, vertSource);
    const frag = this.compileShader(this.gl.FRAGMENT_SHADER, fragSource);

    const program = this.gl.createProgram();
    if (!program) throw new Error('Failed to create program');
    this.gl.attachShader(program, vert);
    this.gl.attachShader(program, frag);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(program);
      this.gl.deleteProgram(program);
      throw new Error(`Program link error: ${info}`);
    }

    this.gl.deleteShader(vert);
    this.gl.deleteShader(frag);

    return { id: program };
  }

  bindPipeline(pipeline: PipelineInfo): void {
    if (!this.gl) return;
    this.currentPipeline = pipeline.id as WebGLProgram;
    this.gl.useProgram(this.currentPipeline);
  }

  setUniformMatrix4fv(name: string, matrix: Float32Array): void {
    if (!this.gl || !this.currentPipeline) return;
    const location = this.gl.getUniformLocation(this.currentPipeline, name);
    if (location !== null) {
      this.gl.uniformMatrix4fv(location, false, matrix);
    }
  }

  drawInstanced(activeCount: number): void {
    if (!this.gl) return;
    this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, 0, 4, activeCount);
  }

  destroy(): void {
    if (this.gl) {
      const ext = this.gl.getExtension('WEBGL_lose_context');
      if (ext) {
        ext.loseContext();
      }
      this.gl = null;
      this.currentPipeline = null;
      this.spritePipeline = null;
      this.quadBuffer = null;
      this.textureArray = null;
    }
  }
}
