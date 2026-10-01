var k = Object.defineProperty;
var V = (e, i, t) =>
  i in e ? k(e, i, { enumerable: !0, configurable: !0, writable: !0, value: t }) : (e[i] = t);
var l = (e, i, t) => V(e, typeof i != 'symbol' ? i + '' : i, t);
var M = 1e20,
  C = class {
    constructor(e, i, t) {
      l(this, 'width');
      l(this, 'height');
      l(this, 'cellSize');
      l(this, 'invCellSize');
      l(this, 'distance');
      l(this, 'gradX');
      l(this, 'gradY');
      l(this, 'unreachable');
      l(this, '_wall');
      l(this, '_visited');
      l(this, '_stack');
      l(this, '_stackSize', 0);
      if (e <= 0 || i <= 0) throw new Error('field size must be positive');
      if (t <= 0) throw new Error('cellSize must be positive');
      (this.width = e), (this.height = i), (this.cellSize = t), (this.invCellSize = 1 / t);
      const s = e * i;
      (this.distance = new Float32Array(s)),
        (this.gradX = new Float32Array(s)),
        (this.gradY = new Float32Array(s)),
        (this.unreachable = new Uint8Array(s)),
        (this._wall = new Uint8Array(s)),
        (this._visited = new Uint8Array(s)),
        (this._stack = new Int32Array(s));
    }
    solve(e) {
      if ((this.reset(), e < 0 || e >= this.width * this.height)) {
        this._markAllUnreachable();
        return;
      }
      for (
        this.distance[e] = 0, this._stack[0] = e, this._stackSize = 1, this._visited[e] = 1;
        this._stackSize > 0;
      ) {
        const i = this._stack[--this._stackSize],
          t = this.distance[i],
          s = i % this.width,
          n = (i / this.width) | 0;
        s > 0 && this._updateNeighbor(i - 1, t),
          s + 1 < this.width && this._updateNeighbor(i + 1, t),
          n > 0 && this._updateNeighbor(i - this.width, t),
          n + 1 < this.height && this._updateNeighbor(i + this.width, t);
      }
      this._propagateUnreachable();
    }
    solveMulti(e) {
      this.reset();
      const i = this.width * this.height;
      for (let t = 0; t < e.length; t++) {
        const s = e[t];
        s < 0 ||
          s >= i ||
          (this.distance[s] !== M &&
            ((this.distance[s] = 0), (this._visited[s] = 1), (this._stack[this._stackSize++] = s)));
      }
      for (; this._stackSize > 0; ) {
        const t = this._stack[--this._stackSize],
          s = this.distance[t],
          n = t % this.width,
          o = (t / this.width) | 0;
        n > 0 && this._updateNeighbor(t - 1, s),
          n + 1 < this.width && this._updateNeighbor(t + 1, s),
          o > 0 && this._updateNeighbor(t - this.width, s),
          o + 1 < this.height && this._updateNeighbor(t + this.width, s);
      }
      this._propagateUnreachable();
    }
    markWalls(e) {
      for (let i = 0; i < this.height; i++)
        for (let t = 0; t < this.width; t++) e(t, i) && (this._wall[i * this.width + t] = 1);
    }
    clearWalls() {}
    reset() {
      const e = this.width * this.height;
      for (let i = 0; i < e; i++)
        (this.distance[i] = M),
          (this.gradX[i] = 0),
          (this.gradY[i] = 0),
          (this.unreachable[i] = this._wall[i]),
          (this._visited[i] = 0);
      this._stackSize = 0;
    }
    _updateNeighbor(e, i) {
      if (this.unreachable[e] === 1) return;
      const t = i + 1;
      t < this.distance[e] &&
        ((this.distance[e] = t),
        (this._visited[e] = 1),
        this._stackSize < this._stack.length && (this._stack[this._stackSize++] = e));
    }
    _propagateUnreachable() {
      const e = this.width * this.height;
      for (let i = 0; i < e; i++)
        (this._wall[i] === 1 || this.distance[i] >= M) && (this.unreachable[i] = 1);
    }
    _markAllUnreachable() {
      const e = this.width * this.height;
      for (let i = 0; i < e; i++) this.unreachable[i] = 1;
    }
    computeGradient(e = {}) {
      const i = Math.max(0, e.smoothingPasses ?? 1),
        t = e.smoothingStrength ?? 0.5,
        { width: s, height: n, distance: o, gradX: f, gradY: a } = this;
      for (let g = 0; g < n; g++)
        for (let d = 0; d < s; d++) {
          const h = g * s + d;
          if (this.unreachable[h] === 1) {
            (f[h] = 0), (a[h] = 0);
            continue;
          }
          const r = d > 0 ? h - 1 : h,
            y = d + 1 < s ? h + 1 : h,
            c = g > 0 ? h - s : h,
            x = g + 1 < n ? h + s : h;
          let w = (o[r] - o[y]) * 0.5,
            _ = (o[c] - o[x]) * 0.5;
          (f[h] = w), (a[h] = _);
        }
      for (let g = 0; g < i; g++)
        for (let d = 0; d < n; d++)
          for (let h = 0; h < s; h++) {
            const r = d * s + h;
            if (this.unreachable[r] === 1) continue;
            const y = h > 0 ? r - 1 : r,
              c = h + 1 < s ? r + 1 : r,
              x = d > 0 ? r - s : r,
              w = d + 1 < n ? r + s : r,
              _ = (f[y] + f[c] + f[x] + f[w]) * 0.25,
              u = (a[y] + a[c] + a[x] + a[w]) * 0.25;
            (f[r] += (_ - f[r]) * t), (a[r] += (u - a[r]) * t);
          }
    }
    normalizeGradient() {
      const { gradX: e, gradY: i } = this;
      for (let t = 0; t < e.length; t++) {
        if (this.unreachable[t] === 1) {
          (e[t] = 0), (i[t] = 0);
          continue;
        }
        const s = Math.sqrt(e[t] * e[t] + i[t] * i[t]);
        s > 1e-6 ? ((e[t] /= s), (i[t] /= s)) : ((e[t] = 0), (i[t] = 0));
      }
    }
    sampleDirection(e, i, t) {
      const s = e * this.invCellSize,
        n = i * this.invCellSize,
        o = Math.floor(s),
        f = Math.floor(n),
        a = s - o,
        g = n - f,
        d = Math.max(0, Math.min(this.width - 1, o)),
        h = Math.max(0, Math.min(this.height - 1, f)),
        r = Math.max(0, Math.min(this.width - 1, o + 1)),
        y = Math.max(0, Math.min(this.height - 1, f + 1)),
        c = h * this.width + d,
        x = h * this.width + r,
        w = y * this.width + d,
        _ = y * this.width + r;
      if (this.unreachable[c] === 1 || this.unreachable[x] === 1) return (t[0] = 0), (t[1] = 0), !1;
      const u = this.gradX[c] + a * (this.gradX[x] - this.gradX[c]),
        v = this.gradX[w] + a * (this.gradX[_] - this.gradX[w]),
        p = this.gradY[c] + a * (this.gradY[x] - this.gradY[c]),
        S = this.gradY[w] + a * (this.gradY[_] - this.gradY[w]);
      let m = u + g * (v - u),
        b = p + g * (S - p);
      const z = Math.sqrt(m * m + b * b);
      return z > 1e-6
        ? ((m /= z), (b /= z), (t[0] = m), (t[1] = b), !0)
        : ((t[0] = 0), (t[1] = 0), !1);
    }
    distanceAt(e, i) {
      const t = Math.floor(e * this.invCellSize),
        s = Math.floor(i * this.invCellSize);
      if (t < 0 || t >= this.width || s < 0 || s >= this.height) return 1 / 0;
      const n = this.distance[s * this.width + t];
      return n >= M ? 1 / 0 : n * this.cellSize;
    }
  },
  F = class {
    constructor(e, i, t, s = {}) {
      l(this, 'targetDensity');
      l(this, 'pressureStiffness');
      l(this, 'pressure');
      l(this, 'fieldVx');
      l(this, 'fieldVy');
      l(this, 'unreachable');
      l(this, 'width');
      l(this, 'height');
      l(this, 'cellSize');
      l(this, 'invCellSize');
      l(this, 'invCellSizeSq');
      l(this, 'density');
      l(this, '_nextPressure');
      l(this, '_divergence');
      l(this, '_targetVx');
      l(this, '_targetVy');
      l(this, '_eikonal');
      if (e <= 0 || i <= 0) throw new Error('field size must be positive');
      if (t <= 0) throw new Error('cellSize must be positive');
      (this.width = e),
        (this.height = i),
        (this.cellSize = t),
        (this.invCellSize = 1 / t),
        (this.invCellSizeSq = this.invCellSize * this.invCellSize),
        (this.targetDensity = s.targetDensity ?? 3.5),
        (this.pressureStiffness = s.pressureStiffness ?? 1.5);
      const n = e * i;
      (this.pressure = new Float32Array(n)),
        (this.fieldVx = new Float32Array(n)),
        (this.fieldVy = new Float32Array(n)),
        (this.unreachable = new Uint8Array(n)),
        (this.density = new Float32Array(n)),
        (this._nextPressure = new Float32Array(n)),
        (this._divergence = new Float32Array(n)),
        (this._targetVx = new Float32Array(n)),
        (this._targetVy = new Float32Array(n)),
        (this._eikonal = new C(e, i, t));
    }
    clear() {
      this.density.fill(0);
    }
    splat(e, i, t = 1) {
      const s = e * this.invCellSize,
        n = i * this.invCellSize,
        o = Math.floor(s),
        f = Math.floor(n),
        a = s - o,
        g = n - f,
        d = Math.max(0, Math.min(this.width - 1, o)),
        h = Math.max(0, Math.min(this.height - 1, f)),
        r = Math.max(0, Math.min(this.width - 1, o + 1)),
        y = Math.max(0, Math.min(this.height - 1, f + 1)),
        c = this.density;
      (c[h * this.width + d] += t * (1 - a) * (1 - g)),
        (c[h * this.width + r] += t * a * (1 - g)),
        (c[y * this.width + d] += t * (1 - a) * g),
        (c[y * this.width + r] += t * a * g);
    }
    computeDivergence() {
      const e = this.width * this.height,
        i = this.targetDensity;
      for (let t = 0; t < e; t++) {
        const s = this.density[t] - i;
        this._divergence[t] = s > 0 ? s : 0;
      }
    }
    solvePressure(e = 2) {
      const i = this.width,
        t = this.height,
        s = this.pressure,
        n = this._nextPressure,
        o = this._divergence,
        f = this.pressureStiffness * this.invCellSizeSq;
      for (let a = 0; a < i; a++) (s[a] = 0), (s[(t - 1) * i + a] = 0);
      for (let a = 0; a < t; a++) (s[a * i] = 0), (s[a * i + i - 1] = 0);
      for (let a = 0; a < e; a++) {
        for (let g = 1; g < t - 1; g++) {
          const d = g * i;
          for (let h = 1; h < i - 1; h++) {
            const r = d + h,
              c = (s[r - 1] + s[r + 1] + s[r - i] + s[r + i] + o[r] * f) * 0.25;
            n[r] = c > 0 ? c : 0;
          }
        }
        s.set(n);
      }
    }
    setTargetDirection(e, i, t, s) {
      const n = Math.floor(e * this.invCellSize),
        o = Math.floor(i * this.invCellSize);
      n < 0 ||
        n >= this.width ||
        o < 0 ||
        o >= this.height ||
        this.setTargetDirectionRaw(o * this.width + n, t, s);
    }
    setTargetDirectionRaw(e, i, t) {
      if (e < 0 || e >= this.width * this.height) return;
      const s = Math.sqrt(i * i + t * t);
      s < 1e-6 || ((this._targetVx[e] = i / s), (this._targetVy[e] = t / s));
    }
    solveNavigation(e, i, t = {}) {
      this._eikonal.markWalls(i),
        this._eikonal.solve(e),
        this._eikonal.computeGradient(t),
        this._eikonal.normalizeGradient();
      const s = this.width * this.height;
      for (let n = 0; n < s; n++) this.unreachable[n] = this._eikonal.unreachable[n];
    }
    bakeVelocityField(e, i = 0.7, t = !0) {
      const s = this.width,
        n = this.height,
        o = this.pressure,
        f = 0.5 * this.invCellSize;
      for (let a = 1; a < n - 1; a++) {
        const g = a * s;
        for (let d = 1; d < s - 1; d++) {
          const h = g + d;
          if (this.unreachable[h] === 1) {
            (this.fieldVx[h] = 0), (this.fieldVy[h] = 0);
            continue;
          }
          const r = (o[h + 1] - o[h - 1]) * f,
            y = (o[h + s] - o[h - s]) * f;
          let c = this._targetVx[h],
            x = this._targetVy[h];
          if (t) {
            const v = this._eikonal.gradX[h],
              p = this._eikonal.gradY[h];
            (v !== 0 || p !== 0) && ((c = v), (x = p));
          }
          const w = c - r * i,
            _ = x - y * i,
            u = w * w + _ * _;
          if (u > 1e-8) {
            const v = e / Math.sqrt(u);
            (this.fieldVx[h] = w * v), (this.fieldVy[h] = _ * v);
          } else (this.fieldVx[h] = 0), (this.fieldVy[h] = 0);
        }
      }
    }
    sampleVelocity(e, i, t) {
      const s = e * this.invCellSize,
        n = i * this.invCellSize,
        o = Math.floor(s),
        f = Math.floor(n),
        a = s - o,
        g = n - f,
        d = Math.max(0, Math.min(this.width - 1, o)),
        h = Math.max(0, Math.min(this.height - 1, f)),
        r = Math.max(0, Math.min(this.width - 1, o + 1)),
        y = Math.max(0, Math.min(this.height - 1, f + 1)),
        c = h * this.width + d,
        x = h * this.width + r,
        w = y * this.width + d,
        _ = y * this.width + r;
      if (this.unreachable[c] === 1 || this.unreachable[x] === 1) return (t[0] = 0), (t[1] = 0), !1;
      const u = this.fieldVx[c] + a * (this.fieldVx[x] - this.fieldVx[c]),
        v = this.fieldVx[w] + a * (this.fieldVx[_] - this.fieldVx[w]),
        p = this.fieldVy[c] + a * (this.fieldVy[x] - this.fieldVy[c]),
        S = this.fieldVy[w] + a * (this.fieldVy[_] - this.fieldVy[w]);
      return (t[0] = u + g * (v - u)), (t[1] = p + g * (S - p)), !0;
    }
    pressureAt(e, i) {
      const t = Math.floor(e * this.invCellSize),
        s = Math.floor(i * this.invCellSize);
      return t < 0 || t >= this.width || s < 0 || s >= this.height
        ? 0
        : this.pressure[s * this.width + t];
    }
    sampleDirection(e, i, t) {
      return this._eikonal.sampleDirection(e, i, t);
    }
  };
export { F as C };
