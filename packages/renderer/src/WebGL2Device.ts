import type { BufferInfo, GraphicsDevice, PipelineInfo } from './GraphicsDevice';

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

out vec2 v_uv;
out float v_layerDepth;
out vec4 v_tint;

void main() {
    vec2 scaledPos = vec2(vertexPos.x * scale * facing, vertexPos.y * scale);
    vec2 worldPos = scaledPos + vec2(posX, posY);
    gl_Position = projectionMatrix * vec4(worldPos, 0.0, 1.0);
    v_uv = vertexUV * vec2(uvW, uvH) + vec2(uvX, uvY);
    v_layerDepth = frameIdx;
    v_tint = tint;
}
`;

/**
 * WebGL2 スプライト描画用のフラグメントシェーダー（GLSL ES 3.0）
 * sampler2DArray でテクスチャアトラスを参照し、Tint 色を乗算する。
 */
const SPRITE_FRAG_GLSL = `#version 300 es
precision highp float;
precision highp sampler2DArray;
precision highp int;

uniform sampler2DArray textureArray;

in vec2 v_uv;
in float v_layerDepth;
in vec4 v_tint;

out vec4 fragColor;

void main() {
    vec4 texColor = texture(textureArray, vec3(v_uv, float(int(v_layerDepth))));
    fragColor = texColor * v_tint;
}
`;

export class WebGL2Device implements GraphicsDevice {
  private gl: WebGL2RenderingContext | null = null;
  private currentPipeline: WebGLProgram | null = null;

  private spritePipeline: PipelineInfo | null = null;
  private quadBuffer: WebGLBuffer | null = null;
  private defaultTexture: WebGLTexture | null = null;

  async init(canvas: HTMLCanvasElement): Promise<void> {
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      throw new Error('WebGL2 is not supported');
    }
    this.gl = gl;
    // Basic setup
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.defaultTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.defaultTexture);
    this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texImage3D(
      this.gl.TEXTURE_2D_ARRAY,
      0,
      this.gl.RGBA,
      1,
      1,
      1,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255, 255]),
    );
  }

  initPipelines(): void {
    this.spritePipeline = this.createPipeline(SPRITE_VERT_GLSL, SPRITE_FRAG_GLSL);
    this.createQuadBuffer();
  }

  private createQuadBuffer(): void {
    if (!this.gl) return;
    // Simple quad for sprites: 4 vertices (x, y, u, v)
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

  updateBuffer(bufferInfo: BufferInfo, data: Float32Array): void {
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
      // Bind texture array
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.defaultTexture);
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
      bindInstancedAttr(12, 'tint', 4);
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
    // Draw Triangle Strip for Quad (4 vertices)
    this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, 0, 4, activeCount);
  }

  destroy(): void {
    if (this.gl) {
      this.gl = null;
      this.currentPipeline = null;
      this.spritePipeline = null;
      this.quadBuffer = null;
    }
  }
}
