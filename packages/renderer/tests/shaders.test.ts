import { describe, expect, it } from 'vitest';
import sdfFragGlsl from '../src/shaders/sdf.frag.glsl?raw';
import sdfVertGlsl from '../src/shaders/sdf.vert.glsl?raw';
import sdfWgsl from '../src/shaders/sdf.wgsl?raw';
import spriteFragGlsl from '../src/shaders/sprite.frag.glsl?raw';
import spriteVertGlsl from '../src/shaders/sprite.vert.glsl?raw';
import spriteWgsl from '../src/shaders/sprite.wgsl?raw';

describe('Shader Compilation', () => {
  it('should compile WebGL2 GLSL shaders successfully', () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    expect(gl).not.toBeNull();
    if (!gl) return;

    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      expect(shader).not.toBeNull();
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (!success) {
        const info = gl.getShaderInfoLog(shader);
        throw new Error(`Shader compilation failed: ${info}`);
      }
      return shader;
    };

    // Sprite
    const spriteVert = compileShader(spriteVertGlsl, gl.VERTEX_SHADER);
    const spriteFrag = compileShader(spriteFragGlsl, gl.FRAGMENT_SHADER);
    expect(spriteVert).toBeTruthy();
    expect(spriteFrag).toBeTruthy();

    // SDF
    const sdfVert = compileShader(sdfVertGlsl, gl.VERTEX_SHADER);
    const sdfFrag = compileShader(sdfFragGlsl, gl.FRAGMENT_SHADER);
    expect(sdfVert).toBeTruthy();
    expect(sdfFrag).toBeTruthy();
  });

  it('should compile WebGPU WGSL shaders successfully', async () => {
    // Only run if WebGPU is supported
    if (!navigator.gpu) {
      console.warn('WebGPU not supported in this environment, skipping WGSL test.');
      return;
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      console.warn('No WebGPU adapter found, skipping WGSL test.');
      return;
    }

    const device = await adapter.requestDevice();

    const checkWgsl = async (source: string, name: string) => {
      const module = device.createShaderModule({ code: source });
      const info = await module.getCompilationInfo();
      const errors = info.messages.filter((m) => m.type === 'error');
      if (errors.length > 0) {
        throw new Error(
          `WGSL Compilation failed for ${name}:\n${errors.map((e) => `${e.lineNum}:${e.linePos} - ${e.message}`).join('\n')}`,
        );
      }
      expect(errors.length).toBe(0);
    };

    await checkWgsl(spriteWgsl, 'sprite.wgsl');
    await checkWgsl(sdfWgsl, 'sdf.wgsl');
  });
});
