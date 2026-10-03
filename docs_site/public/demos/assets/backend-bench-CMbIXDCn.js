var ne = Object.defineProperty;
var se = (s, e, a) =>
  e in s ? ne(s, e, { enumerable: !0, configurable: !0, writable: !0, value: a }) : (s[e] = a);
var A = (s, e, a) => se(s, typeof e != 'symbol' ? e + '' : e, a);
import { P as ae, S as ie, f as re, a as M, W as oe } from './index-BHyN-INv.js';
function H(s, e) {
  const a = new URLSearchParams(location.search).get(s);
  if (a === null) return e;
  const t = Number.parseInt(a, 10);
  return Number.isFinite(t) && t > 0 ? t : e;
}
function g(s, e) {
  return new URLSearchParams(location.search).get(s) ?? e;
}
function I(s) {
  if (s.length === 0) return 0;
  const e = [...s].sort((t, r) => t - r),
    a = e.length >> 1;
  return e.length % 2 === 1 ? e[a] : (e[a - 1] + e[a]) * 0.5;
}
function Q(s) {
  if (s.length === 0) return 0;
  const e = [...s].sort((t, r) => t - r),
    a = Math.min(e.length - 1, Math.floor(e.length * 0.95));
  return e[a];
}
const E = H('entities', 5e4),
  N = H('frames', 120),
  $ = H('warmup', 30),
  L = g('backend', 'auto'),
  v = L === 'cpu',
  ce = v ? 'auto' : L,
  le = g('tsq', '0') === '1',
  J = Math.min(1, Math.max(0.01, Number(g('visible', '1')) || 1)),
  ee = g('cull', 'cpu'),
  V = ee === 'gpu',
  X = ee === 'compute',
  K = Math.max(0, Number(g('cols', '0')) || 0),
  Z = Math.max(1, Number(g('overdraw', '1')) || 1),
  j = Math.max(1, Number(g('size', '32')) || 32),
  ue = Math.max(1, Number(g('spacing', '64')) || 64),
  y = document.getElementById('status');
function me(s) {
  const e = document.createElement('canvas');
  (e.width = 1), (e.height = 1);
  const a = e.getContext('2d');
  a && ((a.fillStyle = '#ffffff'), a.fillRect(0, 0, 1, 1)),
    s.textures.addCanvas('__bench-white', e);
}
function he(s) {
  return s == null ? 'none' : s instanceof oe ? 'webgpu' : 'webgl2';
}
async function pe() {
  var R, z, _, G, T, O, F, q;
  y.textContent = `booting (backend=${L}, entities=${E})`;
  const s = document.getElementById('game-canvas'),
    e = [];
  function a() {
    const l = g('filter', '');
    if (!l) return [];
    const i = [];
    e.length = 0;
    for (const m of l.split(',')) {
      const o = m.trim();
      switch (o) {
        case 'blur': {
          const n = M.internal.blur();
          n.setStrength(6), i.push(n), e.push(n.name);
          break;
        }
        case 'vignette': {
          const n = M.internal.vignette();
          n.setRadius(0.35), n.setStrength(1), i.push(n), e.push(n.name);
          break;
        }
        case 'pixelate': {
          const n = M.internal.pixelate();
          n.setBlockSize(8), i.push(n), e.push(n.name);
          break;
        }
        case 'grayscale': {
          const n = M.internal.colorMatrix();
          n.setGrayscale(1), i.push(n), e.push(n.name);
          break;
        }
        case 'invert': {
          const n = M.internal.colorMatrix();
          n.setInvert(1), i.push(n), e.push(n.name);
          break;
        }
        case 'sepia': {
          const n = M.internal.colorMatrix();
          n.setSepia(1), i.push(n), e.push(n.name);
          break;
        }
        case 'identity': {
          const n = M.internal.colorMatrix();
          n.reset(), e.push(n.name), i.push(n);
          break;
        }
        case 'brightness': {
          const n = M.internal.colorMatrix();
          n.setBrightness(0.3), i.push(n), e.push(n.name);
          break;
        }
        case 'threshold': {
          const n = re.threshold();
          n.setLevel(0.5), i.push(n), e.push(n.name);
          break;
        }
        default:
          console.warn(`[bench] 未対応のフィルタ: ${o}`);
          break;
      }
    }
    return i;
  }
  const t = new ae({
    canvas: s,
    width: 1280,
    height: 720,
    maxInstances: E + 1024,
    backend: ce,
    cpuOnly: v,
    gpuCulling: V,
    gpuComputeCulling: X,
    gpuTimestampQuery: le,
    scene: [de],
    filters: a(),
  });
  await t.ready;
  const r = v ? 'cpu' : he(t.device),
    u = t.scene.activeScene;
  if (!u) {
    y.textContent = 'no active scene';
    return;
  }
  me(u), u.spawn(E), t.loop.stop();
  const w = (l, i) => {
    const m = 16.666666666666668;
    let o = i;
    for (let n = 0; n < l; n++) (o += m), t.loop.step(o);
    return o;
  };
  y.textContent = `warming up (${$} frames)...`;
  let x = w($, 0);
  y.textContent = `measuring (${N} frames)...`;
  const d = [],
    C = [],
    k = [],
    S = [],
    h = [],
    p = v ? new fe() : null,
    f = v ? s.getContext('2d') : null,
    P = t.scene.activeScene;
  async function D() {
    var o, n, W, Y;
    const l = performance.now();
    (x += 1e3 / 60), t.loop.step(x);
    const i = performance.now();
    p && f && P && (p.draw(P.arena, t.renderCount), p.present(f));
    const m = performance.now();
    return (
      await new Promise((te) => {
        setTimeout(te, 0);
      }),
      {
        frame: m - l,
        cull: t.cullTimeMs,
        upload: t.uploadTimeMs,
        draw: v ? m - i : t.drawTimeMs,
        gpu:
          ((n = (o = t.device) == null ? void 0 : o.resolveGpuTimeMs) == null
            ? void 0
            : n.call(o)) ?? -1,
        visible:
          ((Y = (W = t.device) == null ? void 0 : W.resolveVisibleCount) == null
            ? void 0
            : Y.call(W)) ?? -1,
      }
    );
  }
  const b = [];
  for (let l = 0; l < N; l++) {
    const i = await D();
    S.push(i.frame),
      d.push(i.cull),
      C.push(i.upload),
      k.push(i.draw),
      i.gpu >= 0 && h.push(i.gpu),
      i.visible >= 0 && b.push(i.visible);
  }
  const c = {
    requestedBackend: L,
    actualBackend: r,
    cpuOnly: v,
    gpuCulling: V,
    computeCulling: X,
    gpuCullingActive: t.gpuCullingActive,
    computeCullingActive: t.computeCullingActive,
    filtersActive: t.filtersActive,
    appliedFilters: e,
    filterStatus:
      ((z = (R = t.device) == null ? void 0 : R.filterStatus) == null ? void 0 : z.call(R)) ?? null,
    sceneDrawCalls: t.renderGraph.sceneDrawCalls(),
    computeCullingStatus:
      ((G = (_ = t.device) == null ? void 0 : _.computeCullingStatus) == null
        ? void 0
        : G.call(_)) ?? null,
    entities: E,
    renderCount: t.renderCount,
    visibleFracRequested: J,
    worldWidth: u.worldWidth,
    worldHeight: u.worldHeight,
    frames: N,
    warmup: $,
    cullMsMedian: I(d),
    cullMsP95: Q(d),
    uploadMsMedian: I(C),
    drawMsMedian: I(k),
    frameMsMedian: I(S),
    frameMsP95: Q(S),
    gpuMsMedian: h.length > 0 ? I(h) : -1,
    gpuSampleCount: h.length,
    timestampSupported:
      ((O = (T = t.device) == null ? void 0 : T.isTimestampQuerySupported) == null
        ? void 0
        : O.call(T)) ?? !1,
    timestampError:
      ((q = (F = t.device) == null ? void 0 : F.lastTimestampError) == null ? void 0 : q.call(F)) ??
      '',
    visibleDrawn: b.length ? b[b.length - 1] : -1,
    timestampRaw: (() => {
      var m, o;
      const l = new Float64Array(2);
      return (((o = (m = t.device) == null ? void 0 : m.lastTimestampRaw) == null
        ? void 0
        : o.call(m, l)) ?? !1)
        ? [l[0], l[1]]
        : [-1, -1];
    })(),
  };
  (window.__benchResult = c),
    (y.innerHTML = `backend=<b>${r}</b><br>entities=${E}<br>frame median=${c.frameMsMedian.toFixed(3)}ms p95=${c.frameMsP95.toFixed(3)}ms<br>cull=${c.cullMsMedian.toFixed(3)}ms upload=${c.uploadMsMedian.toFixed(3)}ms draw=${c.drawMsMedian.toFixed(3)}ms`);
}
class de extends ie {
  constructor() {
    super({ maxInstances: Math.max(1, E + 1024) });
    A(this, 'worldWidth', 1);
    A(this, 'worldHeight', 1);
  }
  create() {
    this.cameras.main.setScroll(0, 0);
  }
  spawn(a) {
    const t = this.arena,
      r = K > 0 ? K : Math.ceil(Math.sqrt(a)),
      u = ue,
      w = this.textures.get('__bench-white');
    for (let p = 0; p < a; p++) {
      const f = Z > 1 ? p % (r * r || 1) : p,
        P = (f % r) * u,
        D = ((f / r) | 0) * u,
        b = t.allocate();
      if (b === -1) break;
      const c = t.idToIndex[b];
      t.setPosX(c, P),
        t.setPosY(c, D),
        t.setFrameSize(c, j, j, !1),
        w && ((t.assetRef[c] = w), t.setFrameIdx(c, w.layerIndex ?? 0)),
        t.setTint(c, 4287138047);
    }
    const x = Math.ceil((Z > 1 ? r * r : a) / r);
    (this.worldWidth = r * u), (this.worldHeight = x * u);
    const d = this.cameras.main,
      h = (Math.min(1280 / this.worldWidth, 720 / this.worldHeight) * 0.9 * 0.9) / Math.sqrt(J);
    d.setZoom(h), d.setScroll(this.worldWidth / 2, this.worldHeight / 2);
  }
}
const U = 1280,
  B = 720;
class fe {
  constructor() {
    A(this, 'pixels');
    A(this, 'image');
    (this.pixels = new Uint32Array(U * B)),
      typeof ImageData < 'u' ? (this.image = new ImageData(U, B)) : (this.image = null);
  }
  draw(e, a) {
    this.pixels.fill(4279242768);
    for (let t = 0; t < a; t++) {
      const r = e.posX[t],
        u = e.posY[t],
        w = Math.max(1, Math.round(e.frameWidth[t] * e.scaleX[t])),
        x = Math.max(1, Math.round(e.frameHeight[t] * e.scaleY[t])),
        d = Math.max(0, Math.round(r - w * 0.5)),
        C = Math.max(0, Math.round(u - x * 0.5)),
        k = Math.min(U, d + w),
        S = Math.min(B, C + x);
      for (let h = C; h < S; h++) {
        const p = h * U;
        for (let f = d; f < k; f++) this.pixels[p + f] = 4287138047;
      }
    }
  }
  present(e) {
    !e ||
      !this.image ||
      (new Uint8ClampedArray(this.image.data.buffer).set(new Uint8Array(this.pixels.buffer)),
      e.putImageData(this.image, 0, 0));
  }
}
pe().catch((s) => {
  (y.textContent = `error: ${String(s)}`), (window.__benchError = String(s));
});
