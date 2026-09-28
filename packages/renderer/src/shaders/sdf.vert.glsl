#version 300 es
precision highp float;

layout(location = 0) in vec2 vertexPos;
layout(location = 1) in vec2 vertexUV;

// Instance attributes
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
