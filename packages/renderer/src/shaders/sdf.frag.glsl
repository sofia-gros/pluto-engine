#version 300 es
precision highp float;
precision highp sampler2DArray;

in vec2 vUV;
in float vLayer;
in vec4 vTint;

uniform sampler2DArray textureArray;

out vec4 fragColor;

void main() {
    float dist = texture(textureArray, vec3(vUV, vLayer)).r;
    float smoothing = fwidth(dist);
    float alpha = smoothstep(0.5 - smoothing, 0.5 + smoothing, dist);
    fragColor = vec4(vTint.rgb, vTint.a * alpha);
}
