var B = Object.defineProperty;
var S = (t, e, i) =>
  e in t ? B(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : (t[e] = i);
var s = (t, e, i) => S(t, typeof e != 'symbol' ? e + '' : e, i);
(function () {
  const e = document.createElement('link').relList;
  if (e && e.supports && e.supports('modulepreload')) return;
  for (const a of document.querySelectorAll('link[rel="modulepreload"]')) r(a);
  new MutationObserver((a) => {
    for (const n of a)
      if (n.type === 'childList')
        for (const h of n.addedNodes) h.tagName === 'LINK' && h.rel === 'modulepreload' && r(h);
  }).observe(document, { childList: !0, subtree: !0 });
  function i(a) {
    const n = {};
    return (
      a.integrity && (n.integrity = a.integrity),
      a.referrerPolicy && (n.referrerPolicy = a.referrerPolicy),
      a.crossOrigin === 'use-credentials'
        ? (n.credentials = 'include')
        : a.crossOrigin === 'anonymous'
          ? (n.credentials = 'omit')
          : (n.credentials = 'same-origin'),
      n
    );
  }
  function r(a) {
    if (a.ep) return;
    a.ep = !0;
    const n = i(a);
    fetch(a.href, n);
  }
})();
const L = `#version 300 es
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
`,
  X = `#version 300 es
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
class M {
  constructor() {
    s(this, 'gl', null);
    s(this, 'currentPipeline', null);
    s(this, 'spritePipeline', null);
    s(this, 'quadBuffer', null);
    s(this, 'textureArray', null);
    s(this, 'textureWidth', 2048);
    s(this, 'textureHeight', 2048);
    s(this, 'maxLayers', 64);
    s(this, 'currentLayerCount', 1);
    s(this, 'textures', new Map());
  }
  async init(e) {
    const i = e.getContext('webgl2') || e.getContext('experimental-webgl2');
    if (!i) throw new Error('WebGL2 is not supported');
    (this.gl = i),
      this.gl.enable(this.gl.BLEND),
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA),
      this.initTextureArray();
  }
  initTextureArray() {
    if (!this.gl) return;
    (this.textureArray = this.gl.createTexture()),
      this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.textureArray),
      this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST),
      this.gl.texParameteri(this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST),
      this.gl.texParameteri(
        this.gl.TEXTURE_2D_ARRAY,
        this.gl.TEXTURE_WRAP_S,
        this.gl.CLAMP_TO_EDGE,
      ),
      this.gl.texParameteri(
        this.gl.TEXTURE_2D_ARRAY,
        this.gl.TEXTURE_WRAP_T,
        this.gl.CLAMP_TO_EDGE,
      ),
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
    const e = new Uint8Array([255, 255, 255, 255]);
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
      e,
    ),
      this.textures.set('__default_white__', {
        key: '__default_white__',
        layerIndex: 0,
        width: 1,
        height: 1,
        frames: [{ uvX: 0, uvY: 0, uvW: 1 / this.textureWidth, uvH: 1 / this.textureHeight }],
      });
  }
  uploadTexture(e, i, r) {
    if (!this.gl || !this.textureArray) throw new Error('Device or texture array not initialized');
    if (this.textures.has(e)) return this.textures.get(e);
    if (this.currentLayerCount >= this.maxLayers)
      return (
        console.warn(
          `TextureArray layer limit reached (${this.maxLayers}). Reusing existing layer.`,
        ),
        this.textures.get('__default_white__')
      );
    const a = this.currentLayerCount++,
      n = i.width,
      h = i.height;
    this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.textureArray),
      this.gl.texSubImage3D(
        this.gl.TEXTURE_2D_ARRAY,
        0,
        0,
        0,
        a,
        n,
        h,
        1,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        i,
      );
    const o = [],
      c = (r == null ? void 0 : r.frameWidth) || n,
      l = (r == null ? void 0 : r.frameHeight) || h,
      p = Math.max(1, Math.floor(n / c)),
      f = Math.max(1, Math.floor(h / l));
    for (let d = 0; d < f; d++)
      for (let _ = 0; _ < p; _++)
        o.push({
          uvX: (_ * c) / this.textureWidth,
          uvY: (d * l) / this.textureHeight,
          uvW: c / this.textureWidth,
          uvH: l / this.textureHeight,
        });
    const y = {
      key: e,
      layerIndex: a,
      width: n,
      height: h,
      frameWidth: c,
      frameHeight: l,
      frames: o,
    };
    return this.textures.set(e, y), y;
  }
  getTexture(e) {
    return this.textures.get(e);
  }
  initPipelines() {
    (this.spritePipeline = this.createPipeline(L, X)), this.createQuadBuffer();
  }
  createQuadBuffer() {
    if (!this.gl) return;
    const e = new Float32Array([
      -0.5, -0.5, 0, 0, 0.5, -0.5, 1, 0, -0.5, 0.5, 0, 1, 0.5, 0.5, 1, 1,
    ]);
    (this.quadBuffer = this.gl.createBuffer()),
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer),
      this.gl.bufferData(this.gl.ARRAY_BUFFER, e, this.gl.STATIC_DRAW);
  }
  createBuffer(e) {
    if (!this.gl) throw new Error('Device not initialized');
    const i = this.gl.createBuffer();
    if (!i) throw new Error('Failed to create WebGL2 buffer');
    return (
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, i),
      this.gl.bufferData(this.gl.ARRAY_BUFFER, e, this.gl.DYNAMIC_DRAW),
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null),
      { buffer: i, size: e }
    );
  }
  updateBuffer(e, i) {
    if (!this.gl) throw new Error('Device not initialized');
    const r = e.buffer;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, r),
      this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, i),
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }
  clear(e, i, r, a) {
    this.gl &&
      (this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height),
      this.gl.clearColor(e, i, r, a),
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT));
  }
  bindShaders() {
    if (this.spritePipeline && this.gl) {
      this.bindPipeline(this.spritePipeline),
        this.gl.activeTexture(this.gl.TEXTURE0),
        this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.textureArray);
      const e = this.spritePipeline.id,
        i = this.gl.getUniformLocation(e, 'textureArray');
      i !== null && this.gl.uniform1i(i, 0);
    }
  }
  setupInstancedAttributes(e) {
    if (!this.gl || !this.spritePipeline) return;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer),
      this.gl.enableVertexAttribArray(0),
      this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, !1, 16, 0),
      this.gl.enableVertexAttribArray(1),
      this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, !1, 16, 8);
    const i = (a, n, h) => {
        const o = e[n];
        o &&
          this.gl &&
          (this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.buffer),
          this.gl.enableVertexAttribArray(a),
          this.gl.vertexAttribPointer(a, h, this.gl.FLOAT, !1, 0, 0),
          this.gl.vertexAttribDivisor(a, 1));
      },
      r = (a, n, h) => {
        e[n]
          ? i(a, n, 1)
          : this.gl && (this.gl.disableVertexAttribArray(a), this.gl.vertexAttrib1f(a, h));
      };
    if (
      (i(2, 'posX', 1),
      i(3, 'posY', 1),
      i(4, 'scale', 1),
      r(5, 'facing', 1),
      r(6, 'uvX', 0),
      r(7, 'uvY', 0),
      r(8, 'uvW', 1),
      r(9, 'uvH', 1),
      r(10, 'layerDepth', 0),
      r(11, 'frameIdx', 0),
      e.tint)
    ) {
      const a = e.tint;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, a.buffer),
        this.gl.enableVertexAttribArray(12),
        this.gl.vertexAttribPointer(12, 4, this.gl.UNSIGNED_BYTE, !0, 0, 0),
        this.gl.vertexAttribDivisor(12, 1);
    } else this.gl.disableVertexAttribArray(12), this.gl.vertexAttrib4f(12, 1, 1, 1, 1);
  }
  compileShader(e, i) {
    if (!this.gl) throw new Error('Device not initialized');
    const r = this.gl.createShader(e);
    if (!r) throw new Error('Failed to create shader');
    if (
      (this.gl.shaderSource(r, i),
      this.gl.compileShader(r),
      !this.gl.getShaderParameter(r, this.gl.COMPILE_STATUS))
    ) {
      const a = this.gl.getShaderInfoLog(r);
      throw (this.gl.deleteShader(r), new Error(`Shader compile error: ${a}`));
    }
    return r;
  }
  createPipeline(e, i) {
    if (!this.gl) throw new Error('Device not initialized');
    const r = this.compileShader(this.gl.VERTEX_SHADER, e),
      a = this.compileShader(this.gl.FRAGMENT_SHADER, i),
      n = this.gl.createProgram();
    if (!n) throw new Error('Failed to create program');
    if (
      (this.gl.attachShader(n, r),
      this.gl.attachShader(n, a),
      this.gl.linkProgram(n),
      !this.gl.getProgramParameter(n, this.gl.LINK_STATUS))
    ) {
      const h = this.gl.getProgramInfoLog(n);
      throw (this.gl.deleteProgram(n), new Error(`Program link error: ${h}`));
    }
    return this.gl.deleteShader(r), this.gl.deleteShader(a), { id: n };
  }
  bindPipeline(e) {
    this.gl && ((this.currentPipeline = e.id), this.gl.useProgram(this.currentPipeline));
  }
  setUniformMatrix4fv(e, i) {
    if (!this.gl || !this.currentPipeline) return;
    const r = this.gl.getUniformLocation(this.currentPipeline, e);
    r !== null && this.gl.uniformMatrix4fv(r, !1, i);
  }
  drawInstanced(e) {
    this.gl && this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, 0, 4, e);
  }
  destroy() {
    if (this.gl) {
      const e = this.gl.getExtension('WEBGL_lose_context');
      e && e.loseContext(),
        (this.gl = null),
        (this.currentPipeline = null),
        (this.spritePipeline = null),
        (this.quadBuffer = null),
        (this.textureArray = null);
    }
  }
}
async function C(t) {
  const e = new M();
  return await e.init(t), e;
}
var D = class {
    constructor(t = {}) {
      s(this, 'width');
      s(this, 'height');
      s(this, 'mode');
      s(this, 'pixelArt');
      s(this, 'autoCenter');
      s(this, 'canvas', null);
      s(this, 'resizeListener');
      (this.width = t.width || 800),
        (this.height = t.height || 600),
        (this.mode = t.mode ?? 1),
        (this.pixelArt = t.pixelArt ?? !1),
        (this.autoCenter = t.autoCenter ?? !0),
        (this.resizeListener = this.onResize.bind(this)),
        typeof window < 'u' && window.addEventListener('resize', this.resizeListener);
    }
    setCanvas(t) {
      (this.canvas = t),
        this.pixelArt && (this.canvas.style.imageRendering = 'pixelated'),
        this.onResize();
    }
    onResize() {
      if (!this.canvas || typeof window > 'u') return;
      const t = Math.min(window.devicePixelRatio || 1, 2);
      if (this.mode === 0)
        (this.canvas.width = this.width * t),
          (this.canvas.height = this.height * t),
          (this.canvas.style.width = `${this.width}px`),
          (this.canvas.style.height = `${this.height}px`);
      else if (this.mode === 2) {
        const e = window.innerWidth,
          i = window.innerHeight;
        (this.width = e),
          (this.height = i),
          (this.canvas.width = e * t),
          (this.canvas.height = i * t),
          (this.canvas.style.width = `${e}px`),
          (this.canvas.style.height = `${i}px`);
      } else if (this.mode === 1) {
        const e = window.innerWidth,
          i = window.innerHeight,
          r = e / this.width,
          a = i / this.height,
          n = Math.min(r, a),
          h = this.width * n,
          o = this.height * n;
        (this.canvas.style.width = `${h}px`),
          (this.canvas.style.height = `${o}px`),
          (this.canvas.width = this.width * t),
          (this.canvas.height = this.height * t),
          this.autoCenter &&
            ((this.canvas.style.position = 'absolute'),
            (this.canvas.style.left = `${(e - h) / 2}px`),
            (this.canvas.style.top = `${(i - o) / 2}px`));
      }
    }
    destroy() {
      typeof window < 'u' && window.removeEventListener('resize', this.resizeListener);
    }
    transformX(t) {
      if (!this.canvas) return t;
      const e = this.canvas.getBoundingClientRect();
      return (t - e.left) * (this.width / e.width);
    }
    transformY(t) {
      if (!this.canvas) return t;
      const e = this.canvas.getBoundingClientRect();
      return (t - e.top) * (this.height / e.height);
    }
  },
  U = class {
    constructor(t) {
      s(this, '_scenes', new Map());
      s(this, '_activeScene', null);
      s(this, '_engine');
      this._engine = t;
    }
    add(t, e, i = !1) {
      const r = new e();
      (r.id = t), (r.scene = this), this._scenes.set(t, r), i && this.start(t);
    }
    start(t) {
      const e = this._scenes.get(t);
      if (!e) throw new Error(`Scene ${t} not found.`);
      (this._activeScene = e), e.sysInit(this._engine), e.sysCreate();
    }
    switch(t) {
      this._activeScene && this._activeScene.sysShutdown(), this.start(t);
    }
    get activeScene() {
      return this._activeScene;
    }
  },
  H = class {
    constructor() {
      s(this, 'fps', 0);
      s(this, 'deltaTime', 0);
      s(this, 'time', 0);
      s(this, 'lastTime', 0);
      s(this, 'frames', 0);
      s(this, 'lastFpsTime', 0);
      (this.lastTime = performance.now()), (this.lastFpsTime = this.lastTime);
    }
    step(t) {
      return (
        (this.deltaTime = (t - this.lastTime) / 1e3),
        this.deltaTime > 0.1 && (this.deltaTime = 0.1),
        (this.time += this.deltaTime),
        (this.lastTime = t),
        this.frames++,
        t - this.lastFpsTime >= 1e3 &&
          ((this.fps = this.frames), (this.frames = 0), (this.lastFpsTime = t)),
        this.deltaTime
      );
    }
  },
  tt = class {
    constructor(t) {
      s(this, 'scene');
      s(this, 'config');
      s(this, 'scale');
      s(this, 'time');
      s(this, 'device', null);
      s(this, 'canvasElement', null);
      s(this, 'gpuBuffers', {});
      s(this, 'ready');
      s(this, 'isDestroyed', !1);
      s(this, 'animFrameId', null);
      s(this, 'accumulator', 0);
      s(this, 'fixedDt', 1 / 60);
      s(this, 'updateTimeMs', 0);
      s(this, 'renderTimeMs', 0);
      s(this, 'uploadTimeMs', 0);
      s(this, 'drawTimeMs', 0);
      s(this, 'packTimeMs', 0);
      (this.config = Object.assign(
        { width: 800, height: 600, scaleMode: 1, pixelArt: !1, autoCenter: !0, maxInstances: 1e5 },
        t,
      )),
        (this.scale = new D({
          width: this.config.width,
          height: this.config.height,
          mode: this.config.scaleMode,
          pixelArt: this.config.pixelArt,
          autoCenter: this.config.autoCenter,
        })),
        (this.time = new H()),
        (this.scene = new U(this)),
        (this.ready = this.init());
    }
    async init() {
      let t;
      typeof this.config.canvas == 'string'
        ? (t = document.getElementById(this.config.canvas))
        : this.config.canvas
          ? (t = this.config.canvas)
          : ((t = document.createElement('canvas')), document.body.appendChild(t)),
        (this.canvasElement = t),
        this.scale.setCanvas(t),
        (this.device = await C(t)),
        this.device.initPipelines();
      const e = this.config.maxInstances;
      (this.gpuBuffers.posX = this.device.createBuffer(e * 4)),
        (this.gpuBuffers.posY = this.device.createBuffer(e * 4)),
        (this.gpuBuffers.scale = this.device.createBuffer(e * 4)),
        (this.gpuBuffers.facing = this.device.createBuffer(e * 4)),
        (this.gpuBuffers.uvX = this.device.createBuffer(e * 4)),
        (this.gpuBuffers.uvY = this.device.createBuffer(e * 4)),
        (this.gpuBuffers.uvW = this.device.createBuffer(e * 4)),
        (this.gpuBuffers.uvH = this.device.createBuffer(e * 4)),
        (this.gpuBuffers.frameIdx = this.device.createBuffer(e * 4)),
        (this.gpuBuffers.tint = this.device.createBuffer(e * 4));
      for (let r = 0; r < this.config.scene.length; r++) {
        const a = this.config.scene[r],
          h = new a().id || a.name;
        this.scene.add(h, a), r === 0 && this.scene.start(h);
      }
      const i = (r) => {
        this.isDestroyed || (this.step(r), (this.animFrameId = requestAnimationFrame(i)));
      };
      this.animFrameId = requestAnimationFrame(i);
    }
    step(t) {
      const e = this.time.step(t),
        i = performance.now();
      for (this.accumulator += e; this.accumulator >= this.fixedDt; )
        this.scene.activeScene && this.scene.activeScene.sysFixedUpdate(this.fixedDt),
          (this.accumulator -= this.fixedDt);
      this.scene.activeScene && this.scene.activeScene.sysUpdate(e);
      const r = performance.now();
      this.updateTimeMs = r - i;
      const a = performance.now();
      this.render(), (this.renderTimeMs = performance.now() - a);
    }
    render() {
      var w, v, u, g;
      if (!this.device) return;
      const t = this.scene.activeScene;
      if (!t) return;
      const e = t.arena,
        i = e.activeCount,
        r = performance.now();
      (this.packTimeMs = 0),
        i > 0 &&
          (e.dirtyPos &&
            (this.device.updateBuffer(this.gpuBuffers.posX, e.posX.subarray(0, i)),
            this.device.updateBuffer(this.gpuBuffers.posY, e.posY.subarray(0, i)),
            (e.dirtyPos = !1)),
          e.dirtyScale &&
            (this.device.updateBuffer(this.gpuBuffers.scale, e.scale.subarray(0, i)),
            this.device.updateBuffer(this.gpuBuffers.facing, e.facing.subarray(0, i)),
            (e.dirtyScale = !1)),
          e.dirtyUv &&
            (this.device.updateBuffer(this.gpuBuffers.uvX, e.uvX.subarray(0, i)),
            this.device.updateBuffer(this.gpuBuffers.uvY, e.uvY.subarray(0, i)),
            this.device.updateBuffer(this.gpuBuffers.uvW, e.uvW.subarray(0, i)),
            this.device.updateBuffer(this.gpuBuffers.uvH, e.uvH.subarray(0, i)),
            (e.dirtyUv = !1)),
          e.dirtyFrameIdx &&
            (this.device.updateBuffer(this.gpuBuffers.frameIdx, e.frameIdx.subarray(0, i)),
            (e.dirtyFrameIdx = !1)),
          e.dirtyTint &&
            (this.device.updateBuffer(
              this.gpuBuffers.tint,
              new Uint8Array(e.tint.buffer, e.tint.byteOffset, i * 4),
            ),
            (e.dirtyTint = !1)));
      const a = performance.now();
      (this.uploadTimeMs = a - r),
        this.device.clear(0.01, 0.02, 0.05, 1),
        this.device.bindShaders();
      const n = this.canvasElement.width,
        h = this.canvasElement.height,
        o = ((w = t.camera) == null ? void 0 : w.zoom) || 1.4,
        c = ((v = t.camera) == null ? void 0 : v.rotation) || 0,
        l = ((u = t.camera) == null ? void 0 : u.actualX) || 0,
        p = ((g = t.camera) == null ? void 0 : g.actualY) || 0,
        f = Math.cos(-c),
        y = Math.sin(-c),
        d = (2 / n) * o,
        _ = -(2 / h) * o,
        T = new Float32Array([
          d * f,
          _ * y,
          0,
          0,
          d * -y,
          _ * f,
          0,
          0,
          0,
          0,
          1,
          0,
          d * (-l * f + p * y),
          _ * (-l * y - p * f),
          0,
          1,
        ]);
      this.device.setUniformMatrix4fv('projectionMatrix', T),
        i > 0 &&
          (this.device.setupInstancedAttributes(this.gpuBuffers), this.device.drawInstanced(i)),
        (this.drawTimeMs = performance.now() - a);
    }
    destroy() {
      (this.isDestroyed = !0),
        this.animFrameId !== null &&
          (cancelAnimationFrame(this.animFrameId), (this.animFrameId = null)),
        this.scene.activeScene && this.scene.activeScene.sysShutdown(),
        this.device && this.device.destroy();
    }
  },
  W = class {
    constructor(t) {
      s(this, 'capacity');
      s(this, '_activeCount', 0);
      s(this, 'posX');
      s(this, 'posY');
      s(this, 'rotation');
      s(this, 'scale');
      s(this, 'facing');
      s(this, 'uvX');
      s(this, 'uvY');
      s(this, 'uvW');
      s(this, 'uvH');
      s(this, 'frameIdx');
      s(this, 'tint');
      s(this, 'parentId');
      s(this, 'localX');
      s(this, 'localY');
      s(this, 'localRotation');
      s(this, 'interactive');
      s(this, 'hitWidth');
      s(this, 'hitHeight');
      s(this, 'idToIndex');
      s(this, 'indexToId');
      s(this, 'dirtyPos', !0);
      s(this, 'dirtyScale', !0);
      s(this, 'dirtyUv', !0);
      s(this, 'dirtyFrameIdx', !0);
      s(this, 'dirtyTint', !0);
      s(this, 'freeList');
      s(this, 'freeListHead', 0);
      (this.capacity = t),
        (this.posX = new Float32Array(t)),
        (this.posY = new Float32Array(t)),
        (this.rotation = new Float32Array(t)),
        (this.scale = new Float32Array(t)),
        (this.facing = new Float32Array(t)),
        (this.uvX = new Float32Array(t)),
        (this.uvY = new Float32Array(t)),
        (this.uvW = new Float32Array(t)),
        (this.uvH = new Float32Array(t)),
        (this.frameIdx = new Float32Array(t)),
        (this.tint = new Uint32Array(t)),
        (this.parentId = new Int32Array(t).fill(-1)),
        (this.localX = new Float32Array(t)),
        (this.localY = new Float32Array(t)),
        (this.localRotation = new Float32Array(t)),
        (this.interactive = new Uint8Array(t)),
        (this.hitWidth = new Float32Array(t)),
        (this.hitHeight = new Float32Array(t)),
        (this.idToIndex = new Int32Array(t).fill(-1)),
        (this.indexToId = new Int32Array(t).fill(-1)),
        (this.freeList = new Int32Array(t));
      for (let e = 0; e < t; e++) this.freeList[e] = e;
    }
    allocate() {
      if (this.freeListHead >= this.capacity) return -1;
      const t = this.freeList[this.freeListHead++],
        e = this._activeCount++;
      return (
        (this.idToIndex[t] = e),
        (this.indexToId[e] = t),
        (this.posX[e] = 0),
        (this.posY[e] = 0),
        (this.rotation[e] = 0),
        (this.scale[e] = 1),
        (this.facing[e] = 1),
        (this.tint[e] = 4294967295),
        (this.parentId[e] = -1),
        (this.localX[e] = 0),
        (this.localY[e] = 0),
        (this.localRotation[e] = 0),
        (this.interactive[e] = 0),
        (this.hitWidth[e] = 0),
        (this.hitHeight[e] = 0),
        (this.dirtyPos = !0),
        (this.dirtyScale = !0),
        (this.dirtyUv = !0),
        (this.dirtyFrameIdx = !0),
        (this.dirtyTint = !0),
        t
      );
    }
    free(t) {
      const e = this.idToIndex[t];
      if (e < 0 || e >= this._activeCount) return;
      const i = this._activeCount - 1;
      if (e !== i) {
        const r = this.indexToId[i];
        (this.posX[e] = this.posX[i]),
          (this.posY[e] = this.posY[i]),
          (this.rotation[e] = this.rotation[i]),
          (this.scale[e] = this.scale[i]),
          (this.facing[e] = this.facing[i]),
          (this.uvX[e] = this.uvX[i]),
          (this.uvY[e] = this.uvY[i]),
          (this.uvW[e] = this.uvW[i]),
          (this.uvH[e] = this.uvH[i]),
          (this.frameIdx[e] = this.frameIdx[i]),
          (this.tint[e] = this.tint[i]),
          (this.parentId[e] = this.parentId[i]),
          (this.localX[e] = this.localX[i]),
          (this.localY[e] = this.localY[i]),
          (this.localRotation[e] = this.localRotation[i]),
          (this.interactive[e] = this.interactive[i]),
          (this.hitWidth[e] = this.hitWidth[i]),
          (this.hitHeight[e] = this.hitHeight[i]),
          (this.idToIndex[r] = e),
          (this.indexToId[e] = r);
      }
      (this.idToIndex[t] = -1),
        (this.indexToId[i] = -1),
        this._activeCount--,
        (this.dirtyPos = !0),
        (this.dirtyScale = !0),
        (this.dirtyUv = !0),
        (this.dirtyFrameIdx = !0),
        (this.dirtyTint = !0),
        (this.freeList[--this.freeListHead] = t);
    }
    get activeCount() {
      return this._activeCount;
    }
    clear() {
      (this._activeCount = 0),
        (this.freeListHead = 0),
        this.idToIndex.fill(-1),
        this.indexToId.fill(-1),
        this.parentId.fill(-1);
      for (let t = 0; t < this.capacity; t++) this.freeList[t] = t;
    }
  },
  P = class {
    constructor(t, e) {
      s(this, 'id');
      s(this, '_arena');
      s(this, '_asset');
      s(this, '_currentFrame', 0);
      (this.id = t), (this._arena = e);
    }
    get idx() {
      return this._arena.idToIndex[this.id];
    }
    get x() {
      return this._arena.posX[this.idx];
    }
    set x(t) {
      (this._arena.posX[this.idx] = t), (this._arena.dirtyPos = !0);
    }
    get y() {
      return this._arena.posY[this.idx];
    }
    set y(t) {
      (this._arena.posY[this.idx] = t), (this._arena.dirtyPos = !0);
    }
    get scale() {
      return this._arena.scale[this.idx];
    }
    set scale(t) {
      (this._arena.scale[this.idx] = t), (this._arena.dirtyScale = !0);
    }
    get facing() {
      return this._arena.facing[this.idx];
    }
    set facing(t) {
      (this._arena.facing[this.idx] = t), (this._arena.dirtyScale = !0);
    }
    get frameIdx() {
      return this._arena.frameIdx[this.idx];
    }
    set frameIdx(t) {
      (this._arena.frameIdx[this.idx] = t), (this._arena.dirtyFrameIdx = !0);
    }
    get uvX() {
      return this._arena.uvX[this.idx];
    }
    set uvX(t) {
      (this._arena.uvX[this.idx] = t), (this._arena.dirtyUv = !0);
    }
    get uvY() {
      return this._arena.uvY[this.idx];
    }
    set uvY(t) {
      (this._arena.uvY[this.idx] = t), (this._arena.dirtyUv = !0);
    }
    get uvW() {
      return this._arena.uvW[this.idx];
    }
    set uvW(t) {
      (this._arena.uvW[this.idx] = t), (this._arena.dirtyUv = !0);
    }
    get uvH() {
      return this._arena.uvH[this.idx];
    }
    set uvH(t) {
      (this._arena.uvH[this.idx] = t), (this._arena.dirtyUv = !0);
    }
    get frame() {
      return this._currentFrame;
    }
    set frame(t) {
      this.setFrame(Math.floor(t));
    }
    setTexture(t, e = 0) {
      var a;
      this._asset = t;
      const i = this.idx,
        r =
          (t == null ? void 0 : t.layerIndex) ??
          ((a = t == null ? void 0 : t.textureAsset) == null ? void 0 : a.layerIndex) ??
          0;
      return (
        (this._arena.frameIdx[i] = r), (this._arena.dirtyFrameIdx = !0), this.setFrame(e), this
      );
    }
    setFrame(t) {
      var r, a, n;
      const e =
        ((r = this._asset) == null ? void 0 : r.frames) ||
        ((n = (a = this._asset) == null ? void 0 : a.textureAsset) == null ? void 0 : n.frames);
      if (!e || e.length === 0) return this;
      const i = typeof t == 'number' ? t : 0;
      if (i >= 0 && i < e.length) {
        this._currentFrame = i;
        const h = e[i],
          o = this.idx;
        (this._arena.uvX[o] = h.uvX),
          (this._arena.uvY[o] = h.uvY),
          (this._arena.uvW[o] = h.uvW),
          (this._arena.uvH[o] = h.uvH),
          (this._arena.dirtyUv = !0);
      }
      return this;
    }
    setFlipX(t) {
      return (this._arena.facing[this.idx] = t ? -1 : 1), (this._arena.dirtyScale = !0), this;
    }
    setTint(t) {
      let e = t;
      if (!(t & 4278190080)) {
        const i = (t >> 16) & 255,
          r = (t >> 8) & 255,
          a = t & 255;
        e = (255 << 24) | (a << 16) | (r << 8) | i;
      }
      return (this._arena.tint[this.idx] = e), (this._arena.dirtyTint = !0), this;
    }
    setInteractive(t, e) {
      const i = this.idx;
      return (
        (this._arena.interactive[i] = 1),
        t !== void 0
          ? (this._arena.hitWidth[i] = t)
          : (this._arena.hitWidth[i] = this._asset ? (this._asset.width ?? 0) : 0),
        e !== void 0
          ? (this._arena.hitHeight[i] = e)
          : (this._arena.hitHeight[i] = this._asset ? (this._asset.height ?? 0) : 0),
        this
      );
    }
    destroy() {
      this._arena.free(this.id);
    }
  },
  O = class {
    constructor(t, e, i, r, a) {
      s(this, '_text');
      s(this, '_sprites', []);
      s(this, 'x');
      s(this, 'y');
      s(this, '_arena');
      s(this, '_style');
      (this.x = t),
        (this.y = e),
        (this._text = i),
        (this._style = r),
        (this._arena = a),
        this._buildSprites();
    }
    _buildSprites() {
      for (const r of this._sprites) this._arena.free(r.id);
      this._sprites.length = 0;
      const t = this._style.fontSize ?? 16,
        e = this._style.color ?? 4294967295;
      let i = this.x;
      for (let r = 0; r < this._text.length; r++) {
        const a = this._arena.allocate();
        a !== -1 &&
          ((this._arena.posX[a] = i),
          (this._arena.posY[a] = this.y),
          (this._arena.scale[a] = t),
          (this._arena.tint[a] = e),
          this._sprites.push(new P(a, this._arena))),
          (i += t);
      }
    }
    get text() {
      return this._text;
    }
    set text(t) {
      this._text !== t && ((this._text = t), this._buildSprites());
    }
    destroy() {
      for (const t of this._sprites) this._arena.free(t.id);
      this._sprites.length = 0;
    }
  },
  k = class {
    constructor() {
      s(this, '_entityListeners', new Map());
      s(this, '_rawKeys', new Set());
      s(this, '_currentKeys', new Set());
      s(this, '_previousKeys', new Set());
      s(this, 'pointerX', 0);
      s(this, 'pointerY', 0);
      s(this, '_rawPointerDown', !1);
      s(this, '_currentPointerDown', !1);
      s(this, '_previousPointerDown', !1);
      s(this, '_gamepads', []);
      s(this, '_previousGamepadButtons', []);
      s(this, '_boundOnKeyDown');
      s(this, '_boundOnKeyUp');
      s(this, '_boundOnPointerMove');
      s(this, '_boundOnPointerDown');
      s(this, '_boundOnPointerUp');
      (this._boundOnKeyDown = this.onKeyDown.bind(this)),
        (this._boundOnKeyUp = this.onKeyUp.bind(this)),
        (this._boundOnPointerMove = this.onPointerMove.bind(this)),
        (this._boundOnPointerDown = this.onPointerDown.bind(this)),
        (this._boundOnPointerUp = this.onPointerUp.bind(this));
    }
    attach(t = window) {
      t.addEventListener('keydown', this._boundOnKeyDown),
        t.addEventListener('keyup', this._boundOnKeyUp),
        t.addEventListener('pointermove', this._boundOnPointerMove),
        t.addEventListener('pointerdown', this._boundOnPointerDown),
        t.addEventListener('pointerup', this._boundOnPointerUp);
    }
    detach(t = window) {
      t.removeEventListener('keydown', this._boundOnKeyDown),
        t.removeEventListener('keyup', this._boundOnKeyUp),
        t.removeEventListener('pointermove', this._boundOnPointerMove),
        t.removeEventListener('pointerdown', this._boundOnPointerDown),
        t.removeEventListener('pointerup', this._boundOnPointerUp);
    }
    onKeyDown(t) {
      this._rawKeys.add(t.code);
    }
    onKeyUp(t) {
      this._rawKeys.delete(t.code);
    }
    onPointerMove(t) {
      (this.pointerX = t.clientX), (this.pointerY = t.clientY);
    }
    onPointerDown() {
      this._rawPointerDown = !0;
    }
    onPointerUp() {
      this._rawPointerDown = !1;
    }
    update() {
      this._previousKeys.clear();
      for (const t of this._currentKeys) this._previousKeys.add(t);
      this._currentKeys.clear();
      for (const t of this._rawKeys) this._currentKeys.add(t);
      if (
        ((this._previousPointerDown = this._currentPointerDown),
        (this._currentPointerDown = this._rawPointerDown),
        typeof navigator < 'u' && navigator.getGamepads)
      ) {
        const t = navigator.getGamepads();
        for (let e = 0; e < t.length; e++) {
          const i = t[e];
          if (i)
            if (!this._previousGamepadButtons[e])
              this._previousGamepadButtons[e] = new Array(i.buttons.length).fill(!1);
            else {
              const r = this._gamepads[e];
              if (r)
                for (let a = 0; a < r.buttons.length; a++)
                  this._previousGamepadButtons[e][a] = r.buttons[a].pressed;
            }
        }
        this._gamepads = Array.from(t);
      }
    }
    isKeyPressed(t) {
      return this._currentKeys.has(t);
    }
    isKeyJustPressed(t) {
      return this._currentKeys.has(t) && !this._previousKeys.has(t);
    }
    isKeyJustReleased(t) {
      return !this._currentKeys.has(t) && this._previousKeys.has(t);
    }
    isPointerDown() {
      return this._currentPointerDown;
    }
    isPointerJustPressed() {
      return this._currentPointerDown && !this._previousPointerDown;
    }
    isPointerJustReleased() {
      return !this._currentPointerDown && this._previousPointerDown;
    }
    isGamepadButtonPressed(t, e) {
      const i = this._gamepads[t];
      return !i || !i.buttons[e] ? !1 : i.buttons[e].pressed;
    }
    getGamepadAxis(t, e) {
      const i = this._gamepads[t];
      if (!i || i.axes.length <= e) return 0;
      const r = i.axes[e];
      return Math.abs(r) > 0.1 ? r : 0;
    }
    on(t, e, i) {
      let r = this._entityListeners.get(t.id);
      return (
        r || ((r = {}), this._entityListeners.set(t.id, r)), r[e] || (r[e] = []), r[e].push(i), this
      );
    }
    off(t, e, i) {
      const r = this._entityListeners.get(t.id);
      return !r || !r[e] ? this : ((r[e] = r[e].filter((a) => a !== i)), this);
    }
    emit(t, e, ...i) {
      const r = this._entityListeners.get(t);
      if (!(!r || !r[e])) for (let a = 0; a < r[e].length; a++) r[e][a](...i);
    }
  },
  K = class {
    constructor(t) {
      s(this, '_queue', []);
      s(this, '_cache', new Map());
      s(this, '_isLoading', !1);
      s(this, '_textureManager', null);
      this._textureManager = t || null;
    }
    setTextureManager(t) {
      this._textureManager = t;
    }
    image(t, e) {
      return this._cache.has(t) || this._queue.push({ key: t, url: e, type: 'image' }), this;
    }
    spritesheet(t, e, i) {
      return (
        this._cache.has(t) || this._queue.push({ key: t, url: e, type: 'spritesheet', config: i }),
        this
      );
    }
    json(t, e) {
      return this._queue.push({ key: t, url: e, type: 'json' }), this;
    }
    csv(t, e) {
      return this._queue.push({ key: t, url: e, type: 'csv' }), this;
    }
    yaml(t, e) {
      return this._queue.push({ key: t, url: e, type: 'yaml' }), this;
    }
    async start() {
      if (this._isLoading || this._queue.length === 0) return;
      this._isLoading = !0;
      const t = this._queue.map((e) => this._loadItem(e));
      await Promise.all(t), (this._queue.length = 0), (this._isLoading = !1);
    }
    async _loadItem(t) {
      try {
        const e = await fetch(t.url);
        if (!e.ok) throw new Error(`Failed to load ${t.url}: ${e.statusText}`);
        switch (t.type) {
          case 'image': {
            const i = await e.blob(),
              r = new Image();
            (r.src = URL.createObjectURL(i)),
              await new Promise((n, h) => {
                (r.onload = n), (r.onerror = h);
              });
            let a;
            this._textureManager && (a = this._textureManager.addImage(t.key, r)),
              this._cache.set(t.key, { type: 'image', image: r, textureAsset: a });
            break;
          }
          case 'spritesheet': {
            const i = await e.blob(),
              r = new Image();
            (r.src = URL.createObjectURL(i)),
              await new Promise((h, o) => {
                (r.onload = h), (r.onerror = o);
              });
            const a = t.config;
            let n;
            this._textureManager && (n = this._textureManager.addSpritesheet(t.key, r, a)),
              this._cache.set(t.key, { type: 'spritesheet', image: r, config: a, textureAsset: n });
            break;
          }
          case 'json': {
            const i = await e.json();
            this._cache.set(t.key, i);
            break;
          }
          case 'csv':
          case 'yaml': {
            const i = await e.text();
            this._cache.set(t.key, i);
            break;
          }
        }
      } catch (e) {
        console.error(`Error loading asset [${t.key}]:`, e);
      }
    }
    get(t) {
      return this._cache.get(t);
    }
    clear() {
      this._cache.clear(), (this._queue.length = 0);
    }
  },
  z = class {
    constructor(t) {
      s(this, 'device', null);
      s(this, 'textures', new Map());
      this.device = t || null;
    }
    setDevice(t) {
      this.device = t;
      for (const [e, i] of this.textures.entries()) {
        const r = i._source;
        if (r && this.device) {
          const a = this.device.uploadTexture(e, r, {
            frameWidth: i.frameWidth,
            frameHeight: i.frameHeight,
          });
          this.textures.set(e, a);
        }
      }
    }
    addImage(t, e) {
      if (this.device) {
        const r = this.device.uploadTexture(t, e);
        return this.textures.set(t, r), r;
      }
      const i = {
        key: t,
        layerIndex: 0,
        width: e.width,
        height: e.height,
        frameWidth: e.width,
        frameHeight: e.height,
        frames: [{ uvX: 0, uvY: 0, uvW: 1, uvH: 1 }],
        _source: e,
      };
      return this.textures.set(t, i), i;
    }
    addSpritesheet(t, e, i) {
      if (this.device) {
        const a = this.device.uploadTexture(t, e, i);
        return this.textures.set(t, a), a;
      }
      const r = {
        key: t,
        layerIndex: 0,
        width: e.width,
        height: e.height,
        frameWidth: i.frameWidth || e.width,
        frameHeight: i.frameHeight || e.height,
        _source: e,
      };
      return this.textures.set(t, r), r;
    }
    createCanvasTexture(t, e, i, r, a) {
      const n = document.createElement('canvas');
      (n.width = e), (n.height = i);
      const h = n.getContext('2d');
      return r(h), a ? this.addSpritesheet(t, n, a) : this.addImage(t, n);
    }
    get(t) {
      return this.device ? this.device.getTexture(t) || this.textures.get(t) : this.textures.get(t);
    }
    exists(t) {
      return this.textures.has(t) || (this.device ? this.device.getTexture(t) !== void 0 : !1);
    }
  },
  G = class {
    constructor() {
      s(this, 'Distance', {
        Between(t, e, i, r) {
          const a = i - t,
            n = r - e;
          return Math.sqrt(a * a + n * n);
        },
        BetweenSquared(t, e, i, r) {
          const a = i - t,
            n = r - e;
          return a * a + n * n;
        },
      });
      s(this, 'Angle', {
        Between(t, e, i, r) {
          return Math.atan2(r - e, i - t);
        },
      });
    }
    Clamp(t, e, i) {
      return t < e ? e : t > i ? i : t;
    }
    DegToRad(t) {
      return t * (Math.PI / 180);
    }
    RadToDeg(t) {
      return t * (180 / Math.PI);
    }
  },
  V = new G(),
  q = class {
    constructor(t, e = 1e4) {
      s(this, 'capacity');
      s(this, '_activeCount', 0);
      s(this, 'active');
      s(this, 'entityId');
      s(this, 'propType');
      s(this, 'startVal');
      s(this, 'endVal');
      s(this, 'duration');
      s(this, 'elapsed');
      s(this, 'freeList');
      s(this, 'freeListHead', 0);
      s(this, '_arena');
      (this._arena = t),
        (this.capacity = e),
        (this.active = new Uint8Array(e)),
        (this.entityId = new Int32Array(e)),
        (this.propType = new Uint8Array(e)),
        (this.startVal = new Float32Array(e)),
        (this.endVal = new Float32Array(e)),
        (this.duration = new Float32Array(e)),
        (this.elapsed = new Float32Array(e)),
        (this.freeList = new Int32Array(e));
      for (let i = 0; i < e; i++) this.freeList[i] = i;
    }
    add(t, e, i, r, a) {
      if (this.freeListHead >= this.capacity) return -1;
      const n = this.freeList[this.freeListHead++];
      return (
        (this.active[n] = 1),
        this._activeCount++,
        (this.entityId[n] = t),
        (this.propType[n] = e),
        (this.startVal[n] = i),
        (this.endVal[n] = r),
        (this.duration[n] = a),
        (this.elapsed[n] = 0),
        n
      );
    }
    free(t) {
      t < 0 ||
        t >= this.capacity ||
        this.active[t] === 0 ||
        ((this.active[t] = 0), this._activeCount--, (this.freeList[--this.freeListHead] = t));
    }
    update(t) {
      if (this._activeCount !== 0)
        for (let e = 0; e < this.capacity; e++) {
          if (this.active[e] === 0) continue;
          this.elapsed[e] += t;
          let i = this.elapsed[e] / this.duration[e];
          i >= 1 && (i = 1);
          const r = this.entityId[e];
          if (r >= 0 && this.active[e]) {
            const a = this.startVal[e] + (this.endVal[e] - this.startVal[e]) * i;
            switch (this.propType[e]) {
              case 0:
                this._arena.posX[r] = a;
                break;
              case 1:
                this._arena.posY[r] = a;
                break;
              case 2:
                this._arena.scale[r] = a;
                break;
              case 3:
                this._arena.tint[r] = a >>> 0;
                break;
            }
          }
          i >= 1 && this.free(e);
        }
    }
    clear() {
      (this._activeCount = 0), (this.freeListHead = 0), this.active.fill(0);
      for (let t = 0; t < this.capacity; t++) this.freeList[t] = t;
    }
  },
  N = class {
    constructor(t, e = 1e4) {
      s(this, 'capacity');
      s(this, '_activeCount', 0);
      s(this, '_animations', new Map());
      s(this, 'active');
      s(this, 'entityId');
      s(this, 'animId');
      s(this, 'currentFrameIdx');
      s(this, 'repeatCount');
      s(this, 'elapsed');
      s(this, 'refFramesLength');
      s(this, 'refFrameDuration');
      s(this, 'refRepeat');
      s(this, 'refFramesPtr');
      s(this, '_flatFrames');
      s(this, '_flatFramesCount', 0);
      s(this, '_animKeyToIndex', new Map());
      s(this, '_nextAnimIndex', 0);
      s(this, 'freeList');
      s(this, 'freeListHead', 0);
      s(this, '_arena');
      s(this, '_spriteMap', new Map());
      (this._arena = t),
        (this.capacity = e),
        (this.active = new Uint8Array(e)),
        (this.entityId = new Int32Array(e)),
        (this.animId = new Int32Array(e)),
        (this.currentFrameIdx = new Int32Array(e)),
        (this.repeatCount = new Int32Array(e)),
        (this.elapsed = new Float32Array(e)),
        (this.refFramesLength = new Int32Array(e)),
        (this.refFrameDuration = new Float32Array(e)),
        (this.refRepeat = new Int32Array(e)),
        (this.refFramesPtr = new Int32Array(e)),
        (this._flatFrames = new Int32Array(1e5)),
        (this.freeList = new Int32Array(e));
      for (let i = 0; i < e; i++) this.freeList[i] = i;
    }
    create(t) {
      const e = Array.isArray(t) ? t : [t];
      for (const i of e) {
        const r = i.frameRate ?? 24,
          a = { key: i.key, frames: i.frames, frameDuration: 1e3 / r, repeat: i.repeat ?? 0 };
        this._animations.set(i.key, a);
        const n = this._nextAnimIndex++;
        this._animKeyToIndex.set(i.key, n),
          (this.refFramesLength[n] = a.frames.length),
          (this.refFrameDuration[n] = a.frameDuration),
          (this.refRepeat[n] = a.repeat),
          (this.refFramesPtr[n] = this._flatFramesCount);
        for (let h = 0; h < a.frames.length; h++)
          this._flatFrames[this._flatFramesCount++] = a.frames[h];
      }
    }
    play(t, e) {
      const i = this._animKeyToIndex.get(e);
      if (i === void 0) {
        console.warn(`Animation key not found: ${e}`);
        return;
      }
      let r = -1;
      for (let h = 0; h < this.capacity; h++)
        if (this.active[h] === 1 && this.entityId[h] === t.id) {
          r = h;
          break;
        }
      if (r === -1) {
        if (this.freeListHead >= this.capacity) return;
        (r = this.freeList[this.freeListHead++]),
          (this.active[r] = 1),
          this._activeCount++,
          (this.entityId[r] = t.id),
          this._spriteMap.set(t.id, t);
      }
      (this.animId[r] = i),
        (this.currentFrameIdx[r] = 0),
        (this.repeatCount[r] = 0),
        (this.elapsed[r] = 0);
      const a = this.refFramesPtr[i],
        n = this._flatFrames[a];
      t.setFrame(n);
    }
    free(t) {
      this.active[t] !== 0 &&
        ((this.active[t] = 0),
        this._activeCount--,
        (this.freeList[--this.freeListHead] = t),
        this._spriteMap.delete(this.entityId[t]));
    }
    update(t) {
      if (this._activeCount !== 0)
        for (let e = 0; e < this.capacity; e++) {
          if (this.active[e] === 0) continue;
          const i = this.entityId[e];
          if (i < 0 || this._arena.idToIndex[i] < 0) {
            this.free(e);
            continue;
          }
          const r = this.animId[e],
            a = this.refFrameDuration[r];
          if (((this.elapsed[e] += t), this.elapsed[e] >= a)) {
            this.elapsed[e] -= a;
            const n = this.refFramesLength[r];
            this.currentFrameIdx[e]++;
            let h = !1;
            if (this.currentFrameIdx[e] >= n) {
              const o = this.refRepeat[r];
              o === -1
                ? (this.currentFrameIdx[e] = 0)
                : this.repeatCount[e] < o
                  ? (this.repeatCount[e]++, (this.currentFrameIdx[e] = 0))
                  : (h = !0);
            }
            if (h) this.free(e);
            else {
              const o = this.refFramesPtr[r] + this.currentFrameIdx[e],
                c = this._flatFrames[o],
                l = this._spriteMap.get(i);
              l && l.setFrame(c);
            }
          }
        }
    }
    clear() {
      (this._activeCount = 0),
        (this.freeListHead = 0),
        this.active.fill(0),
        this._spriteMap.clear();
      for (let t = 0; t < this.capacity; t++) this.freeList[t] = t;
    }
  },
  $ = class {
    constructor(t, e, i) {
      s(this, 'arena');
      s(this, 'mapWidth');
      s(this, 'mapHeight');
      s(this, 'tileSize');
      s(this, 'layersData', []);
      s(this, 'activeTiles', new Map());
      s(this, 'lastStartX', -1);
      s(this, 'lastStartY', -1);
      s(this, 'lastEndX', -1);
      s(this, 'lastEndY', -1);
      var r;
      if (((this.arena = t), Array.isArray(e))) {
        (this.mapHeight = e.length),
          (this.mapWidth = ((r = e[0]) == null ? void 0 : r.length) || 0),
          (this.tileSize = i || 32);
        const a = new Array(this.mapWidth * this.mapHeight).fill(0);
        for (let n = 0; n < this.mapHeight; n++)
          for (let h = 0; h < this.mapWidth; h++) a[n * this.mapWidth + h] = e[n][h];
        this.layersData.push(a);
      } else {
        (this.mapWidth = e.width), (this.mapHeight = e.height), (this.tileSize = e.tilewidth);
        for (const a of e.layers)
          a.type === 'tilelayer' && a.visible !== !1 && this.layersData.push(a.data);
      }
      for (let a = 0; a < this.layersData.length; a++)
        this.activeTiles.set(a, new Int32Array(this.mapWidth * this.mapHeight).fill(-1));
    }
    updateCulling(t, e, i, r = 1) {
      const a = e / 2 / t.zoom,
        n = i / 2 / t.zoom,
        h = Math.max(0, Math.floor((t.x - a) / this.tileSize) - r),
        o = Math.max(0, Math.floor((t.y - n) / this.tileSize) - r),
        c = Math.min(this.mapWidth - 1, Math.floor((t.x + a) / this.tileSize) + r),
        l = Math.min(this.mapHeight - 1, Math.floor((t.y + n) / this.tileSize) + r);
      if (
        !(
          h === this.lastStartX &&
          o === this.lastStartY &&
          c === this.lastEndX &&
          l === this.lastEndY
        )
      ) {
        for (let p = 0; p < this.layersData.length; p++) {
          const f = this.activeTiles.get(p);
          for (let y = this.lastStartY; y <= this.lastEndY; y++)
            if (!(y < 0 || y >= this.mapHeight)) {
              for (let d = this.lastStartX; d <= this.lastEndX; d++)
                if (!(d < 0 || d >= this.mapWidth) && (d < h || d > c || y < o || y > l)) {
                  const _ = y * this.mapWidth + d,
                    T = f[_];
                  T !== -1 && (this.arena.free(T), (f[_] = -1));
                }
            }
        }
        for (let p = 0; p < this.layersData.length; p++) {
          const f = this.activeTiles.get(p),
            y = this.layersData[p];
          for (let d = o; d <= l; d++)
            for (let _ = h; _ <= c; _++) {
              const T = d * this.mapWidth + _;
              if (!(y[T] <= 0) && f[T] === -1) {
                const v = this.arena.allocate();
                v !== -1 &&
                  ((this.arena.posX[v] = _ * this.tileSize + this.tileSize / 2),
                  (this.arena.posY[v] = d * this.tileSize + this.tileSize / 2),
                  (this.arena.scale[v] = this.tileSize),
                  (f[T] = v));
              }
            }
        }
        (this.lastStartX = h), (this.lastStartY = o), (this.lastEndX = c), (this.lastEndY = l);
      }
    }
    destroy() {
      for (let t = 0; t < this.layersData.length; t++) {
        const e = this.activeTiles.get(t);
        for (let i = 0; i < e.length; i++) e[i] !== -1 && this.arena.free(e[i]);
      }
      (this.layersData = []), this.activeTiles.clear();
    }
  },
  j = class {
    constructor() {
      s(this, 'x', 0);
      s(this, 'y', 0);
      s(this, 'zoom', 1);
      s(this, 'rotation', 0);
      s(this, 'shakeIntensity', 0);
      s(this, 'shakeDuration', 0);
      s(this, 'shakeTime', 0);
      s(this, 'shakeX', 0);
      s(this, 'shakeY', 0);
    }
    shake(t, e) {
      (this.shakeIntensity = t), (this.shakeDuration = e), (this.shakeTime = e);
    }
    update(t) {
      if (this.shakeTime > 0)
        if (((this.shakeTime -= t), this.shakeTime <= 0))
          (this.shakeTime = 0), (this.shakeX = 0), (this.shakeY = 0);
        else {
          const e = this.shakeIntensity * (this.shakeTime / this.shakeDuration);
          (this.shakeX = (Math.random() - 0.5) * 2 * e),
            (this.shakeY = (Math.random() - 0.5) * 2 * e);
        }
      else (this.shakeX = 0), (this.shakeY = 0);
    }
    get actualX() {
      return this.x + this.shakeX;
    }
    get actualY() {
      return this.y + this.shakeY;
    }
  },
  J = class {
    constructor(t = 1e5) {
      s(this, 'arena');
      s(this, 'maxParticles');
      s(this, 'velX');
      s(this, 'velY');
      s(this, 'life');
      s(this, 'lifeMax');
      s(this, 'activeIds');
      s(this, 'activeCount', 0);
      (this.maxParticles = t),
        (this.velX = new Float32Array(t)),
        (this.velY = new Float32Array(t)),
        (this.life = new Float32Array(t)),
        (this.lifeMax = new Float32Array(t)),
        (this.activeIds = new Int32Array(t).fill(-1));
    }
    init(t) {
      this.arena = t.arena;
    }
    createEmitter(t) {
      const {
        x: e,
        y: i,
        count: r,
        speed: a,
        life: n,
        angleMin: h = 0,
        angleMax: o = Math.PI * 2,
      } = t;
      for (let c = 0; c < r && !(this.activeCount >= this.maxParticles); c++) {
        const l = this.arena.allocate();
        if (l === -1) break;
        const p = h + Math.random() * (o - h),
          f = a * (0.5 + Math.random() * 0.5);
        (this.arena.posX[l] = e),
          (this.arena.posY[l] = i),
          (this.arena.scale[l] = 1),
          (this.velX[l] = Math.cos(p) * f),
          (this.velY[l] = Math.sin(p) * f),
          (this.life[l] = n),
          (this.lifeMax[l] = n),
          (this.activeIds[this.activeCount++] = l);
      }
    }
    update(t) {
      for (let e = 0; e < this.activeCount; e++) {
        const i = this.activeIds[e];
        if (i === -1) continue;
        if (((this.life[i] -= t), this.life[i] <= 0)) {
          this.arena.free(i),
            (this.activeIds[e] = this.activeIds[this.activeCount - 1]),
            (this.activeIds[this.activeCount - 1] = -1),
            this.activeCount--,
            e--;
          continue;
        }
        (this.arena.posX[i] += this.velX[i] * t), (this.arena.posY[i] += this.velY[i] * t);
        const r = this.life[i] / this.lifeMax[i];
        this.arena.scale[i] = r;
      }
    }
    destroy() {
      for (let t = 0; t < this.activeCount; t++)
        this.activeIds[t] !== -1 && this.arena.free(this.activeIds[t]);
      this.activeCount = 0;
    }
  },
  Q = class {
    constructor(t = 1e5) {
      s(this, 'scene');
      s(this, 'arena');
      s(this, 'velX');
      s(this, 'velY');
      s(this, 'mass');
      s(this, 'bounce');
      s(this, '_overlapRules', []);
      s(this, '_colliderRules', []);
      s(this, 'add', {
        existing: (t) => t,
        overlap: (t, e, i, r = 0) => {
          let a = this.arena,
            n = i;
          typeof e == 'function' ? (n = e) : e && (a = e),
            n && this._overlapRules.push({ targetA: t, targetB: a, callback: n, margin: r });
        },
        collider: (t, e, i, r = 0) => {
          let a = this.arena,
            n = i;
          typeof e == 'function' ? (n = e) : e && (a = e),
            this._colliderRules.push({ targetA: t, targetB: a, callback: n, bounce: r });
        },
      });
      (this.velX = new Float32Array(t)),
        (this.velY = new Float32Array(t)),
        (this.mass = new Float32Array(t).fill(1)),
        (this.bounce = new Float32Array(t).fill(0));
    }
    init(t) {
      (this.scene = t), (this.arena = t.arena);
    }
    setVelocity(t, e, i) {
      (this.velX[t] = e), (this.velY[t] = i);
    }
    update(t) {
      const e = this.arena;
      if (!e) return;
      const i = e.activeCount;
      for (let r = 0; r < i; r++) (e.posX[r] += this.velX[r] * t), (e.posY[r] += this.velY[r] * t);
    }
    processOverlaps() {
      const t = this._overlapRules.length;
      if (t !== 0)
        for (let e = 0; e < t; e++) {
          const i = this._overlapRules[e];
          this._evaluateOverlapPair(i.targetA, i.targetB, i.callback, i.margin);
        }
    }
    processColliders() {
      const t = this._colliderRules.length;
      if (t !== 0)
        for (let e = 0; e < t; e++) {
          const i = this._colliderRules[e];
          this._evaluateColliderPair(i.targetA, i.targetB, i.callback, i.bounce);
        }
    }
    _evaluateOverlapPair(t, e, i, r) {
      if (Array.isArray(t)) {
        for (let a = 0; a < t.length; a++) {
          const n = t[a];
          n && this._evaluateSingleVsTarget(n, e, i, r);
        }
        return;
      }
      if ('x' in t && 'y' in t && typeof t.x == 'number') {
        this._evaluateSingleVsTarget(t, e, i, r);
        return;
      }
      this._evaluateBufferVsTarget(t, e, i, r);
    }
    _evaluateSingleVsTarget(t, e, i, r) {
      var T, w, v;
      const a = t.x,
        n = t.y,
        h =
          (t.radius ??
            ((T = t.body) == null ? void 0 : T.radius) ??
            (t.width ? t.width * 0.5 : 16)) + r,
        o = a - h,
        c = a + h,
        l = n - h,
        p = n + h;
      if (Array.isArray(e)) {
        for (let u = 0; u < e.length; u++) {
          const g = e[u];
          if (!g) continue;
          const m = g.x,
            x = g.y;
          if (m >= o && m <= c && x >= l && x <= p) {
            const A =
                g.radius ??
                ((w = g.body) == null ? void 0 : w.radius) ??
                (g.width ? g.width * 0.5 : 16),
              b = h + A,
              I = m - a,
              R = x - n;
            I * I + R * R < b * b && i(t, g);
          }
        }
        return;
      }
      if ('x' in e && 'y' in e && typeof e.x == 'number') {
        const u = e,
          g = u.x,
          m = u.y;
        if (g >= o && g <= c && m >= l && m <= p) {
          const x =
              u.radius ??
              ((v = u.body) == null ? void 0 : v.radius) ??
              (u.width ? u.width * 0.5 : 16),
            A = h + x,
            b = g - a,
            I = m - n;
          b * b + I * I < A * A && i(t, u);
        }
        return;
      }
      const f = e,
        y = f.posX,
        d = f.posY,
        _ = this._getBufCount(f);
      for (let u = 0; u < _; u++) {
        const g = y[u],
          m = d[u];
        if (g >= o && g <= c && m >= l && m <= p) {
          const x = this._getBufRadius(f, u),
            A = h + x,
            b = g - a,
            I = m - n;
          b * b + I * I < A * A && i(t, u);
        }
      }
    }
    _evaluateBufferVsTarget(t, e, i, r) {
      var o;
      const a = t.posX,
        n = t.posY,
        h = this._getBufCount(t);
      for (let c = 0; c < h; c++) {
        const l = a[c],
          p = n[c],
          f = this._getBufRadius(t, c) + r,
          y = l - f,
          d = l + f,
          _ = p - f,
          T = p + f;
        if ('x' in e && 'y' in e && typeof e.x == 'number') {
          const w = e,
            v = w.x,
            u = w.y;
          if (v >= y && v <= d && u >= _ && u <= T) {
            const g =
                w.radius ??
                ((o = w.body) == null ? void 0 : o.radius) ??
                (w.width ? w.width * 0.5 : 16),
              m = f + g,
              x = v - l,
              A = u - p;
            x * x + A * A < m * m && i(c, w);
          }
        } else if ('posX' in e && 'posY' in e) {
          const w = e,
            v = w.posX,
            u = w.posY,
            g = this._getBufCount(w);
          for (let m = 0; m < g; m++) {
            const x = v[m],
              A = u[m];
            if (x >= y && x <= d && A >= _ && A <= T) {
              const b = this._getBufRadius(w, m),
                I = f + b,
                R = x - l,
                F = A - p;
              R * R + F * F < I * I && i(c, m);
            }
          }
        }
      }
    }
    _evaluateColliderPair(t, e, i, r = 0) {
      var a;
      if ('x' in t && 'y' in t && typeof t.x == 'number') {
        const n = t,
          h = n.x,
          o = n.y,
          c =
            n.radius ??
            ((a = n.body) == null ? void 0 : a.radius) ??
            (n.width ? n.width * 0.5 : 16),
          l = h - c,
          p = h + c,
          f = o - c,
          y = o + c;
        if ('posX' in e && 'posY' in e) {
          const d = e,
            _ = d.posX,
            T = d.posY,
            w = this._getBufCount(d);
          for (let v = 0; v < w; v++) {
            const u = _[v],
              g = T[v];
            if (u >= l && u <= p && g >= f && g <= y) {
              const m = this._getBufRadius(d, v),
                x = c + m,
                A = u - h,
                b = g - o,
                I = A * A + b * b;
              if (I < x * x && I > 1e-4) {
                const R = Math.sqrt(I),
                  F = x - R,
                  E = A / R,
                  Y = b / R;
                (_[v] += E * F), (T[v] += Y * F), i && i(n, v);
              }
            }
          }
        }
      }
    }
    _getBufCount(t) {
      return 'activeCount' in t && typeof t.activeCount == 'number'
        ? t.activeCount
        : 'count' in t && typeof t.count == 'number'
          ? t.count
          : t.posX.length;
    }
    _getBufRadius(t, e) {
      if ('scale' in t && t.scale) return t.scale[e] * 0.42;
      if ('radius' in t) {
        if (typeof t.radius == 'number') return t.radius;
        if (t.radius && typeof t.radius[e] == 'number') return t.radius[e];
      }
      return 16;
    }
    collide() {
      this.processOverlaps(), this.processColliders();
    }
    clear() {
      (this._overlapRules.length = 0), (this._colliderRules.length = 0);
    }
    destroy() {
      this.clear();
    }
  },
  et = class {
    constructor(t = {}) {
      s(this, 'id', '');
      s(this, 'scene');
      s(this, 'engine');
      s(this, 'arena');
      s(this, 'input');
      s(this, 'load');
      s(this, 'textures');
      s(this, 'tweens');
      s(this, 'anim');
      s(this, 'particles');
      s(this, 'physics');
      s(this, 'camera');
      s(this, '_plugins', []);
      s(this, '_tilemaps', []);
      s(this, 'math', V);
      s(this, 'add', {
        sprite: (t = 0, e = 0, i, r) => {
          const a = this.arena.allocate();
          if (a === -1) throw new Error('アリーナの容量に到達しました。');
          const n = this.arena.idToIndex[a];
          (this.arena.posX[n] = t), (this.arena.posY[n] = e), (this.arena.dirtyPos = !0);
          const h = new P(a, this.arena);
          if (i) {
            const o = this.textures.get(i) || this.load.get(i);
            o && h.setTexture(o, r ?? 0);
          }
          return h;
        },
        text: (t = 0, e = 0, i = '', r = {}) => new O(t, e, i, r, this.arena),
        tilemap: (t, e = 32) => {
          const i = new $(this.arena, t, e);
          return this._tilemaps.push(i), i;
        },
      });
      let e = 1e5;
      typeof t == 'string'
        ? (this.id = t)
        : ((this.id = t.id || this.constructor.name),
          (e = t.maxInstances ?? 1e5),
          Object.assign(this, t)),
        (this.arena = new W(e)),
        (this.input = new k()),
        (this.textures = new z()),
        (this.load = new K(this.textures)),
        (this.tweens = new q(this.arena)),
        (this.anim = new N(this.arena)),
        (this.particles = new J(e)),
        (this.physics = new Q(e)),
        this.physics.init(this),
        (this.camera = new j());
    }
    get scale() {
      return this.engine.scale;
    }
    get time() {
      return this.engine.time;
    }
    preload() {}
    init() {}
    create() {}
    update(t) {}
    fixedUpdate(t) {}
    shutdown() {}
    sysShutdown() {
      var t, e;
      this.shutdown();
      for (let i = 0; i < this._plugins.length; i++)
        (e = (t = this._plugins[i]).destroy) == null || e.call(t);
    }
    sysInit(t) {
      (this.engine = t),
        t.device && this.textures.setDevice(t.device),
        this.particles.init(this),
        this.physics.init(this),
        this.preload(),
        this.init();
    }
    sysCreate() {
      this.input.attach(window), this.create();
    }
    sysUpdate(t) {
      var r, a, n, h, o, c;
      this.camera.update(t),
        this.input.update(),
        this.tweens.update(t),
        this.anim.update(t),
        this.particles.update(t),
        this.physics.update(t),
        this.physics.collide(),
        this.update(t);
      for (let l = 0; l < this._plugins.length; l++)
        (a = (r = this._plugins[l]).update) == null || a.call(r, t);
      const e =
          ((h = (n = this.engine) == null ? void 0 : n.scale) == null ? void 0 : h.width) ?? 800,
        i = ((c = (o = this.engine) == null ? void 0 : o.scale) == null ? void 0 : c.height) ?? 600;
      for (let l = 0; l < this._tilemaps.length; l++)
        this._tilemaps[l].updateCulling(this.camera, e, i);
    }
    sysFixedUpdate(t) {
      var e, i;
      this.fixedUpdate(t);
      for (let r = 0; r < this._plugins.length; r++)
        (i = (e = this._plugins[r]).fixedUpdate) == null || i.call(e, t);
    }
    registerPlugin(t) {
      var e;
      this._plugins.push(t), (e = t.init) == null || e.call(t, this);
    }
  };
export { tt as P, et as S };
