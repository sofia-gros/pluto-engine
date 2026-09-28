#version 300 es
precision highp float;

in vec2 vUV;
in float vLayer;
in vec4 vTint;

uniform highp sampler2DArray textureArray;

out vec4 fragColor;

void main() {
    vec4 texColor = texture(textureArray, vec3(vUV, vLayer));
    fragColor = texColor * vTint;
}
