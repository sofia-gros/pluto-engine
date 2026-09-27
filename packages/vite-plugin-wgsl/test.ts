import { readFileSync } from 'fs';
import { transpileWGSLtoGLSL } from './src/index';

const code = readFileSync('../renderer/src/shaders/sprite.wgsl', 'utf-8');
console.log(transpileWGSLtoGLSL(code));
