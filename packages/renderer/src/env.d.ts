declare module '*?raw' {
  const content: string;
  export default content;
}
declare module '*.wgsl' {
  export const wgsl: string;
  export const glsl: { vert: string; frag: string };
  const defaultExport: string;
  export default defaultExport;
}
