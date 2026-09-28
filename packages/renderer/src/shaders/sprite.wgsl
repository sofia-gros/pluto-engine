struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) layerDepth: f32,
    @location(2) tint: vec4<f32>,
};

@group(0) @binding(0) var<uniform> projectionMatrix: mat4x4<f32>;
@group(0) @binding(1) var textureArray: texture_2d_array<f32>;
@group(0) @binding(2) var textureSampler: sampler;

@vertex
fn vs_main(
    @location(0) vertexPos: vec2<f32>,
    @location(1) vertexUV: vec2<f32>,
    // Instance attributes
    @location(2) posX: f32,
    @location(3) posY: f32,
    @location(4) scale: f32,
    @location(5) facing: f32,
    @location(6) uvX: f32,
    @location(7) uvY: f32,
    @location(8) uvW: f32,
    @location(9) uvH: f32,
    @location(10) layerDepth: f32,
    @location(11) frameIdx: f32,
    @location(12) tint: vec4<f32>
) -> VertexOutput {
    var out: VertexOutput;
    
    let scaledPos = vec2<f32>(vertexPos.x * scale * facing, vertexPos.y * scale);
    let worldPos = scaledPos + vec2<f32>(posX, posY);
    
    out.position = projectionMatrix * vec4<f32>(worldPos, 0.0, 1.0);
    out.uv = vertexUV * vec2<f32>(uvW, uvH) + vec2<f32>(uvX, uvY);
    out.layerDepth = frameIdx;
    out.tint = tint;
    
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let color = textureSample(textureArray, textureSampler, in.uv, i32(in.layerDepth));
    return color * in.tint;
}
