import type { Plugin } from 'vite';

export function transpileWGSLtoGLSL(wgsl: string): { vert: string; frag: string } {
  // Extract Vertex & Fragment blocks
  const vertexMatch = wgsl.match(
    /@vertex\s*fn\s+([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\)\s*(?:->\s*([a-zA-Z0-9_]+))?\s*\{([\s\S]*?)\n\}/,
  );
  const fragMatch = wgsl.match(
    /@fragment\s*fn\s+([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\)\s*->\s*(.*?)\s*\{([\s\S]*?)\n\}/,
  );

  if (!vertexMatch || !fragMatch) {
    console.log('Vertex:', !!vertexMatch, 'Frag:', !!fragMatch);
    throw new Error('Failed to parse WGSL vertex or fragment block');
  }

  // Parse struct for VertexOutput
  const structMatch = wgsl.match(/struct\s+VertexOutput\s*\{([\s\S]*?)\}/);
  const varyings: { name: string; type: string }[] = [];
  if (structMatch) {
    const lines = structMatch[1].split('\n');
    for (const line of lines) {
      if (!line.trim() || line.includes('@builtin(position)')) continue;
      const m = line.match(/@location\(\d+\)\s*([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)/);
      if (m) {
        varyings.push({ name: m[1], type: convertType(m[2]) });
      }
    }
  }

  function convertType(t: string): string {
    if (t === 'vec2<f32>' || t === 'vec2f') return 'vec2';
    if (t === 'vec3<f32>' || t === 'vec3f') return 'vec3';
    if (t === 'vec4<f32>' || t === 'vec4f') return 'vec4';
    if (t === 'mat4x4<f32>' || t === 'mat4x4f') return 'mat4';
    if (t === 'f32') return 'float';
    if (t === 'i32') return 'int';
    if (t === 'u32') return 'uint';
    return t;
  }

  // Parse globals (uniforms, textures)
  const globals: string[] = [];
  const globalRegex =
    /@group\(\d+\)\s*@binding\(\d+\)\s*var(?:<uniform>)?\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+);/g;
  let gm;
  while ((gm = globalRegex.exec(wgsl)) !== null) {
    const name = gm[1];
    const type = gm[2];
    if (type.includes('texture_2d_array')) {
      globals.push(`uniform sampler2DArray ${name};`);
    } else if (type === 'sampler') {
      // GLSL combines texture and sampler, skip
    } else {
      globals.push(`uniform ${convertType(type)} ${name};`);
    }
  }

  // Build Vertex Shader
  const vertInputArgs = vertexMatch[2]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const vertAttrs: string[] = [];
  for (const arg of vertInputArgs) {
    const m = arg.match(/@location\((\d+)\)\s*([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)/);
    if (m) {
      vertAttrs.push(`layout(location = ${m[1]}) in ${convertType(m[3])} ${m[2]};`);
    }
  }

  let vertBody = vertexMatch[4];
  // Naive replacement for `let x = vec2<f32>(...)` -> `vec2 x = vec2(...)`
  vertBody = vertBody.replace(/let\s+([a-zA-Z0-9_]+)\s*=\s*vec2<f32>/g, 'vec2 $1 = vec2');
  vertBody = vertBody.replace(/let\s+([a-zA-Z0-9_]+)\s*=\s*vec3<f32>/g, 'vec3 $1 = vec3');
  vertBody = vertBody.replace(/let\s+([a-zA-Z0-9_]+)\s*=\s*vec4<f32>/g, 'vec4 $1 = vec4');
  vertBody = vertBody.replace(/let\s+([a-zA-Z0-9_]+)\s*=\s*/g, (_, name) => `${name} = `); // Need types for lets in GLSL...
  vertBody = vertBody.replace(/vec2<f32>/g, 'vec2');
  vertBody = vertBody.replace(/vec3<f32>/g, 'vec3');
  vertBody = vertBody.replace(/vec4<f32>/g, 'vec4');

  // Handle `out.xxx = ...`
  vertBody = vertBody.replace(/var\s+out\s*:\s*VertexOutput;/g, '');
  vertBody = vertBody.replace(/out\.position/g, 'gl_Position');
  vertBody = vertBody.replace(/out\.([a-zA-Z0-9_]+)/g, 'v_$1');
  vertBody = vertBody.replace(/return\s+out;/g, '');

  const vertVaryings = varyings.map((v) => `out ${v.type} v_${v.name};`).join('\n');

  const glslVert = `#version 300 es
precision highp float;

${vertAttrs.join('\n')}
${globals.join('\n')}

${vertVaryings}

void main() {
${vertBody}
}
`;

  // Build Fragment Shader
  let fragBody = fragMatch[4];
  fragBody = fragBody.replace(/let\s+([a-zA-Z0-9_]+)\s*=\s*/g, 'vec4 $1 = '); // assuming color
  fragBody = fragBody.replace(
    /textureSample\(([^,]+),\s*[^,]+,\s*([^,]+),\s*([^)]+)\)/g,
    'texture($1, vec3($2, float($3)))',
  ); // 2D array texture
  fragBody = fragBody.replace(/in\.([a-zA-Z0-9_]+)/g, 'v_$1');
  fragBody = fragBody.replace(/return\s+(.*?);/g, 'fragColor = $1;');
  fragBody = fragBody.replace(/i32\((.*?)\)/g, 'int($1)');

  const fragVaryings = varyings.map((v) => `in ${v.type} v_${v.name};`).join('\n');

  const glslFrag = `#version 300 es
precision highp float;
precision highp sampler2DArray;

${globals.join('\n')}
${fragVaryings}

out vec4 fragColor;

void main() {
${fragBody}
}
`;

  return { vert: glslVert, frag: glslFrag };
}

export default function wgslPlugin(): Plugin {
  return {
    name: 'vite-plugin-wgsl',
    transform(code, id) {
      if (id.endsWith('.wgsl')) {
        const glsl = transpileWGSLtoGLSL(code);
        return {
          code: `
export const wgsl = ${JSON.stringify(code)};
export const glsl = ${JSON.stringify(glsl)};
export default wgsl;
          `,
          map: null,
        };
      }
    },
  };
}
