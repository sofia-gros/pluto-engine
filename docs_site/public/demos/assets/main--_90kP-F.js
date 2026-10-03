var mt = Object.defineProperty;
var ut = (f, t, e) =>
  t in f ? mt(f, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (f[t] = e);
var h = (f, t, e) => ut(f, typeof t != 'symbol' ? t + '' : t, e);
import { P as ft, S as vt } from './index-BHyN-INv.js';
import { C as yt } from './index-kf00V5in.js';
var xt = class {
  constructor(f = 64) {
    h(this, 'hash');
    h(this, 'cellSize');
    this.cellSize = f;
  }
  init(f) {
    (this.hash = new gt(f.arena.capacity, this.cellSize)), (f.spatialHash = this.hash);
  }
};
function nt(f) {
  return (
    (f = (f | (f << 8)) & 16711935),
    (f = (f | (f << 4)) & 986895),
    (f = (f | (f << 2)) & 53687091),
    (f = (f | (f << 1)) & 1431655765),
    f >>> 0
  );
}
function ot(f, t) {
  return (nt(f) | (nt(t) << 1)) >>> 0;
}
var U = 32768,
  gt = class {
    constructor(f, t) {
      h(this, 'cellSize');
      h(this, 'maxEntities');
      h(this, 'entityIds');
      h(this, 'entityCodes');
      h(this, 'tmpIds');
      h(this, 'tmpCodes');
      h(this, 'radixCounts', new Uint32Array(256));
      h(this, 'sortedIds');
      h(this, 'sortedCodes');
      h(this, 'count', 0);
      if (f <= 0) throw new Error('maxEntities must be positive');
      if (t <= 0) throw new Error('cellSize must be positive');
      (this.cellSize = t),
        (this.maxEntities = f),
        (this.entityIds = new Uint32Array(f)),
        (this.entityCodes = new Uint32Array(f)),
        (this.tmpIds = new Uint32Array(f)),
        (this.tmpCodes = new Uint32Array(f)),
        (this.sortedIds = new Uint32Array(f)),
        (this.sortedCodes = new Uint32Array(f));
    }
    clear() {
      this.count = 0;
    }
    get entityCount() {
      return this.count;
    }
    get size() {
      return this.cellSize;
    }
    addEntity(f, t, e) {
      if (this.count >= this.maxEntities) return;
      const i = (Math.floor(t / this.cellSize) + U) & 65535,
        s = (Math.floor(e / this.cellSize) + U) & 65535;
      (this.entityIds[this.count] = f), (this.entityCodes[this.count] = ot(i, s)), this.count++;
    }
    build() {
      const f = this.count;
      if (f === 0) return;
      let t = this.entityIds,
        e = this.entityCodes,
        i = this.tmpIds,
        s = this.tmpCodes;
      for (let n = 0; n < 32; n += 8) {
        const a = this.radixCounts;
        a.fill(0);
        for (let l = 0; l < f; l++) a[(e[l] >>> n) & 255]++;
        let c = 0;
        for (let l = 0; l < 256; l++) {
          const p = a[l];
          (a[l] = c), (c += p);
        }
        for (let l = 0; l < f; l++) {
          const p = e[l],
            u = a[(p >>> n) & 255]++;
          (i[u] = t[l]), (s[u] = p);
        }
        const o = t;
        (t = i), (i = o);
        const r = e;
        (e = s), (s = r);
      }
      for (let n = 0; n < f; n++) (this.sortedIds[n] = t[n]), (this.sortedCodes[n] = e[n]);
    }
    lowerBound(f) {
      let t = 0,
        e = this.count;
      for (; t < e; ) {
        const i = (t + e) >>> 1;
        this.sortedCodes[i] < f ? (t = i + 1) : (e = i);
      }
      return t;
    }
    queryCell(f, t, e, i) {
      const s = ot(f, t),
        n = this.lowerBound(s);
      let a = i;
      for (let c = n; c < this.count && this.sortedCodes[c] === s; c++)
        a < e.length && (e[a++] = this.sortedIds[c]);
      return a;
    }
    query(f, t, e, i) {
      if (this.count === 0) return 0;
      const s = this.cellSize,
        n = (Math.floor((f - e) / s) + U) & 65535,
        a = (Math.floor((t - e) / s) + U) & 65535,
        c = (Math.floor((f + e) / s) + U) & 65535,
        o = (Math.floor((t + e) / s) + U) & 65535;
      let r = 0;
      for (let l = a; l <= o; l++)
        for (let p = n; p <= c; p++)
          if (((r = this.queryCell(p, l, i, r)), r >= i.length)) return r;
      return r;
    }
  },
  wt = Math.PI * 2,
  bt = class _ {
    static step(t, e, i = {}) {
      const s = Math.max(1, i.substeps ?? 4),
        n = Math.max(1, i.iterations ?? 1),
        a = i.compliance ?? 0,
        c = i.maxSpeed ?? 1e4,
        o = i.friction ?? 0,
        r = i.restitution ?? 0,
        l = t.count;
      for (let m = 0; m < l; m++)
        (t.prevX[m] = t.posX[m]),
          (t.prevY[m] = t.posY[m]),
          (t.posX[m] += t.velX[m] * e),
          (t.posY[m] += t.velY[m] * e);
      const p = e / s,
        u = a / (p * p);
      r > 0 && _._recordPreSolveNormalVel(t, i, 1 / e);
      for (let m = 0; m < s; m++)
        for (let y = 0; y < n; y++)
          i.pairs !== void 0
            ? _._solvePairs(t, i.pairs, i.pairCount ?? 0, u)
            : _._solveAll(t, l, u);
      const v = 1 / e;
      for (let m = 0; m < l; m++) {
        let y = (t.posX[m] - t.prevX[m]) * v,
          x = (t.posY[m] - t.prevY[m]) * v;
        if (c > 0) {
          const g = Math.sqrt(y * y + x * x);
          if (g > c) {
            const w = c / g;
            (y *= w), (x *= w);
          }
        }
        (t.velX[m] = y), (t.velY[m] = x);
      }
      if (o > 0)
        for (let m = 0; m < l; m++) {
          const y = 1 - o;
          (t.velX[m] *= y), (t.velY[m] *= y);
        }
      r > 0 && _._applyRestitution(t, i);
    }
    static resolveOverlaps(t, e, i = {}) {
      const s = Math.max(1, i.substeps ?? 2),
        n = Math.max(1, i.iterations ?? 1),
        a = i.compliance ?? 0,
        c = t.count,
        o = e / s,
        r = a / (o * o);
      for (let l = 0; l < c; l++) (t.prevX[l] = t.posX[l]), (t.prevY[l] = t.posY[l]);
      for (let l = 0; l < s; l++)
        for (let p = 0; p < n; p++)
          i.pairs !== void 0
            ? _._solvePairs(t, i.pairs, i.pairCount ?? 0, r)
            : _._solveAll(t, c, r);
      if (e > 0) {
        const l = 1 / e;
        for (let p = 0; p < c; p++)
          (t.velX[p] = (t.posX[p] - t.prevX[p]) * l), (t.velY[p] = (t.posY[p] - t.prevY[p]) * l);
      }
    }
    static _solveAll(t, e, i) {
      for (let s = 0; s < e; s++) for (let n = s + 1; n < e; n++) _._resolvePair(t, s, n, i);
    }
    static _solvePairs(t, e, i, s) {
      for (let n = 0; n < i; n++) {
        const a = e[n * 2],
          c = e[n * 2 + 1];
        a < 0 || c < 0 || _._resolvePair(t, a, c, s);
      }
    }
    static _resolvePair(t, e, i, s) {
      const n = t.invMasses[e],
        a = t.invMasses[i],
        c = n + a;
      if (c === 0) return;
      const o = t.posX[e] - t.posX[i],
        r = t.posY[e] - t.posY[i],
        l = t.radii[e] + t.radii[i],
        p = o * o + r * r;
      if (p >= l * l) return;
      let u, v, m;
      if (p > 1e-12) (m = Math.sqrt(p)), (u = o / m), (v = r / m);
      else {
        const k = (e * 2.39996323 + i) % wt;
        (m = 0), (u = Math.cos(k)), (v = Math.sin(k));
      }
      const x = -(m - l) / (c + s),
        g = u * x,
        w = v * x;
      n > 0 && ((t.posX[e] += g * n), (t.posY[e] += w * n)),
        a > 0 && ((t.posX[i] -= g * a), (t.posY[i] -= w * a));
    }
    static _applyRestitution(t, e) {
      const i = e.pairs,
        s = e.preSolveNormalVel;
      if (i === void 0 || s === void 0) return;
      const n = e.pairCount ?? 0,
        a = e.restitution ?? 0;
      for (let c = 0; c < n; c++) {
        const o = i[c * 2],
          r = i[c * 2 + 1];
        if (o < 0 || r < 0) continue;
        const l = s[c];
        if (l >= 0) continue;
        const p = t.invMasses[o] + t.invMasses[r];
        if (p === 0) continue;
        const u = t.posX[o] - t.posX[r],
          v = t.posY[o] - t.posY[r],
          m = u * u + v * v;
        if (m <= 1e-12) continue;
        const y = Math.sqrt(m),
          x = u / y,
          g = v / y,
          k = (-((t.velX[o] - t.velX[r]) * x + (t.velY[o] - t.velY[r]) * g) - a * l) / p;
        (t.velX[o] += k * t.invMasses[o] * x),
          (t.velY[o] += k * t.invMasses[o] * g),
          (t.velX[r] -= k * t.invMasses[r] * x),
          (t.velY[r] -= k * t.invMasses[r] * g);
      }
    }
    static _recordPreSolveNormalVel(t, e, i) {
      const s = e.pairs,
        n = e.preSolveNormalVel;
      if (s === void 0 || n === void 0) return;
      const a = e.pairCount ?? 0,
        c = i > 0 ? i : 1;
      for (let o = 0; o < a; o++) {
        const r = s[o * 2],
          l = s[o * 2 + 1];
        if (r < 0 || l < 0) {
          n[o] = 0;
          continue;
        }
        const p = t.posX[r] - t.posX[l],
          u = t.posY[r] - t.posY[l],
          v = p * p + u * u;
        if (v <= 1e-12) {
          n[o] = 0;
          continue;
        }
        const m = Math.sqrt(v),
          y = p / m,
          x = u / m,
          g = (t.posX[r] - t.prevX[r]) * c,
          w = (t.posY[r] - t.prevY[r]) * c,
          k = (t.posX[l] - t.prevX[l]) * c,
          X = (t.posY[l] - t.prevY[l]) * c;
        n[o] = (g - k) * y + (w - X) * x;
      }
    }
    static solve(t, e, i, s, n, a, c, o = 0) {
      const r = o / (c * c);
      for (let l = 0; l < a; l++)
        for (let p = 0; p < t; p++)
          for (let u = p + 1; u < t; u++) _._resolveLegacy(e, i, s, n, p, u, r);
    }
    static _resolveLegacy(t, e, i, s, n, a, c) {
      const o = s[n],
        r = s[a],
        l = o + r;
      if (l === 0) return;
      const p = t[n] - t[a],
        u = e[n] - e[a],
        v = i[n] + i[a],
        m = p * p + u * u;
      if (m >= v * v) return;
      const y = m > 1e-12 ? Math.sqrt(m) : 0,
        x = y > 0 ? p / y : 1,
        g = y > 0 ? u / y : 0,
        k = -(y - v) / (l + c),
        X = x * k,
        L = g * k;
      o > 0 && ((t[n] += X * o), (e[n] += L * o)), r > 0 && ((t[a] -= X * r), (e[a] -= L * r));
    }
  };
class at {
  constructor(t, e, i) {
    h(this, 'sprite');
    h(this, 'vx', 0);
    h(this, 'vy', 0);
    h(this, 'hp', 40);
    h(this, 'maxHp', 40);
    h(this, 'baseSpeed', 150);
    h(this, 'pickupRadius', 65);
    h(this, 'level', 1);
    h(this, 'exp', 0);
    h(this, 'expNext', 12);
    h(this, 'runCoins', 0);
    h(this, 'skills', new Map());
    h(this, 'wandTimer', 0);
    h(this, 'orbitAngle', 0);
    h(this, 'orbitHitTimer', 0);
    h(this, 'garlicTimer', 0);
    h(this, 'lightningTimer', 0);
    (this.sprite = t.add.sprite(e, i, 'chars')),
      this.sprite.play('walking_front'),
      this.sprite.setDisplaySize(28, 28),
      this.skills.set('magic_wand', 1);
  }
  get x() {
    return this.sprite.x;
  }
  set x(t) {
    this.sprite.x = t;
  }
  get y() {
    return this.sprite.y;
  }
  set y(t) {
    this.sprite.y = t;
  }
  recalculateStats(t) {
    (this.maxHp = 40 + (t.maxHp || 0)), (this.hp = Math.min(this.hp, this.maxHp));
  }
  addExp(t) {
    for (this.exp += t; this.exp >= this.expNext; )
      (this.exp -= this.expNext),
        this.level++,
        (this.expNext = Math.round(this.expNext * 1.35 + 16)),
        window.dispatchEvent(
          new CustomEvent('hardcore-levelup', { detail: { level: this.level } }),
        );
  }
  addCoin(t) {
    this.runCoins += t;
  }
  takeDamage(t, e) {
    const i = e.armor || 0,
      s = Math.max(3, t - i);
    (this.hp -= s),
      this.hp <= 0 &&
        (e.revive && e.revive > 0
          ? (e.revive--, (this.hp = this.maxHp * 0.5))
          : ((this.hp = 0), window.dispatchEvent(new CustomEvent('hardcore-death'))));
  }
  update(t, e, i, s, n) {
    s.hpRegen > 0 &&
      this.hp < this.maxHp &&
      (this.hp = Math.min(this.maxHp, this.hp + s.hpRegen * t));
    const a = this.baseSpeed * (1 + (s.moveSpeed || 0));
    (this.vx = e.x * a),
      (this.vy = e.y * a),
      (this.x += this.vx * t),
      (this.y += this.vy * t),
      e.x > 0.1
        ? (this.sprite.setFlipX(!1), this.sprite.play('walking_side', !0))
        : e.x < -0.1
          ? (this.sprite.setFlipX(!0), this.sprite.play('walking_side', !0))
          : e.y < -0.1
            ? this.sprite.play('walking_back', !0)
            : e.y > 0.1
              ? this.sprite.play('walking_front', !0)
              : this.sprite.play('idle_front', !0);
    const c = 1 + (s.bulletDmg || 0),
      o = Math.max(0.4, 1 - (s.cooldown || 0)),
      r = 1 + (s.areaSize || 0),
      l = 1 + (s.knockback || 0),
      p = s.coinRate || 0,
      u = this.skills.get('magic_wand') || 0;
    if (u > 0) {
      this.wandTimer += t;
      const x = Math.max(0.25, 0.6 - u * 0.05) * o;
      if (this.wandTimer >= x) {
        this.wandTimer = 0;
        const g = i.findNearestEnemy(this.x, this.y, 380, n),
          w = g === -1 ? -1 : n.arena.idToIndex[g];
        if (w >= 0) {
          const k = n.arena.posX[w],
            X = n.arena.posY[w],
            L = 1 + (s.bonusProj || 0);
          for (let I = 0; I < L; I++) {
            const S = (I - (L - 1) / 2) * 0.2,
              O = n.math.Angle.Between(this.x, this.y, k, X) + S,
              H = Math.cos(O) * 400,
              $ = Math.sin(O) * 400;
            i.spawnProjectile(this.x, this.y, H, $, (18 + u * 6) * c, 1);
          }
        }
      }
    }
    const v = this.skills.get('holy_orbit') || 0;
    if (
      v > 0 &&
      ((this.orbitAngle += (2.2 + v * 0.3) * t),
      (this.orbitHitTimer += t),
      this.orbitHitTimer >= 0.25)
    ) {
      this.orbitHitTimer = 0;
      const x = Math.min(3, 1 + Math.floor(v / 2)),
        g = 48 * r;
      for (let w = 0; w < x; w++) {
        const k = this.orbitAngle + (w * Math.PI * 2) / x,
          X = this.x + Math.cos(k) * g,
          L = this.y + Math.sin(k) * g;
        i.applyAreaDamage(X, L, 14 * r, (10 + v * 4) * c, 6 * l, p, n);
      }
    }
    const m = this.skills.get('garlic_aura') || 0;
    if (m > 0 && ((this.garlicTimer += t), this.garlicTimer >= 2.2 * o)) {
      this.garlicTimer = 0;
      const x = (42 + m * 8) * r;
      i.applyAreaDamage(this.x, this.y, x, (14 + m * 6) * c, 8 * l, p, n);
    }
    const y = this.skills.get('lightning_strike') || 0;
    if (y > 0 && ((this.lightningTimer += t), this.lightningTimer >= 2 * o)) {
      this.lightningTimer = 0;
      const x = i.findNearestEnemy(this.x, this.y, 350, n),
        g = x === -1 ? -1 : n.arena.idToIndex[x];
      g >= 0 &&
        i.applyAreaDamage(
          n.arena.posX[g],
          n.arena.posY[g],
          38 * r,
          (45 + y * 20) * c,
          14 * l,
          p,
          n,
        );
    }
  }
}
class Mt {
  constructor(t = 96, e = 96, i = 24) {
    h(this, 'crowd');
    h(this, 'cols');
    h(this, 'rows');
    h(this, 'cellSize');
    h(this, 'invCellSize');
    h(this, 'width');
    h(this, 'height');
    h(this, 'size');
    h(this, 'density');
    h(this, 'pressure');
    h(this, 'precomputedVx');
    h(this, 'precomputedVy');
    h(this, 'originX', 0);
    h(this, 'originY', 0);
    h(this, '_dirX');
    h(this, '_dirY');
    (this.cols = t),
      (this.rows = e),
      (this.cellSize = i),
      (this.invCellSize = 1 / i),
      (this.width = t * i),
      (this.height = e * i),
      (this.size = t * e),
      (this.crowd = new yt(t, e, i, { targetDensity: 3.5, pressureStiffness: 1.5 })),
      (this.density = this.crowd.density),
      (this.pressure = this.crowd.pressure),
      (this.precomputedVx = this.crowd.fieldVx),
      (this.precomputedVy = this.crowd.fieldVy),
      (this._dirX = new Float32Array(this.size)),
      (this._dirY = new Float32Array(this.size));
  }
  updatePlayerCenter(t, e) {
    (this.originX = t - this.width * 0.5), (this.originY = e - this.height * 0.5);
    const i = this.width * 0.5,
      s = this.height * 0.5;
    for (let n = 0; n < this.rows; n++) {
      const c = (n + 0.5) * this.cellSize - s,
        o = n * this.cols;
      for (let r = 0; r < this.cols; r++) {
        const p = (r + 0.5) * this.cellSize - i,
          u = p * p + c * c,
          v = 1 / (Math.sqrt(u) + 0.001);
        (this._dirX[o + r] = -p * v), (this._dirY[o + r] = -c * v);
      }
    }
    for (let n = 0; n < this.size; n++)
      this.crowd.setTargetDirectionRaw(n, this._dirX[n], this._dirY[n]);
  }
  solvePoissonUIC(t = 2) {
    this.crowd.computeDivergence(), this.crowd.solvePressure(t);
  }
  precomputeVelocityField(t = 1, e = 0.7) {
    this.crowd.bakeVelocityField(t, e, !1);
  }
}
class kt {
  constructor(t, e = 4e4) {
    h(this, 'scene');
    h(this, 'maxEnemies');
    h(this, 'vx');
    h(this, 'vy');
    h(this, 'hp');
    h(this, 'maxHp');
    h(this, 'spd');
    h(this, 'type');
    h(this, 'knockResist');
    h(this, 'atkPower');
    h(this, 'maxDrops', 15e3);
    h(this, 'dropCount', 0);
    h(this, 'dx');
    h(this, 'dy');
    h(this, 'dtype');
    h(this, 'dval');
    h(this, 'dsprite');
    h(this, 'maxProjectiles', 600);
    h(this, 'projCount', 0);
    h(this, 'px');
    h(this, 'py');
    h(this, 'pvx');
    h(this, 'pvy');
    h(this, 'pdmg');
    h(this, 'plife');
    h(this, 'ppierce');
    h(this, 'psprite');
    h(this, '_overlapPairs');
    h(this, '_overlapQuery');
    h(this, '_overlapParticles');
    h(this, 'playerId', -1);
    (this.scene = t),
      (this.maxEnemies = e),
      (this.vx = new Float32Array(e)),
      (this.vy = new Float32Array(e)),
      (this.hp = new Float32Array(e)),
      (this.maxHp = new Float32Array(e)),
      (this.spd = new Float32Array(e)),
      (this.type = new Uint8Array(e)),
      (this.knockResist = new Float32Array(e)),
      (this.atkPower = new Float32Array(e)),
      (this.dx = new Float32Array(this.maxDrops)),
      (this.dy = new Float32Array(this.maxDrops)),
      (this.dtype = new Uint8Array(this.maxDrops)),
      (this.dval = new Float32Array(this.maxDrops)),
      (this.dsprite = new Array(this.maxDrops)),
      (this.px = new Float32Array(this.maxProjectiles)),
      (this.py = new Float32Array(this.maxProjectiles)),
      (this.pvx = new Float32Array(this.maxProjectiles)),
      (this.pvy = new Float32Array(this.maxProjectiles)),
      (this.pdmg = new Float32Array(this.maxProjectiles)),
      (this.plife = new Float32Array(this.maxProjectiles)),
      (this.ppierce = new Int8Array(this.maxProjectiles)),
      (this.psprite = new Array(this.maxProjectiles)),
      (this._overlapPairs = new Int32Array(this.maxEnemies * 12)),
      (this._overlapQuery = new Uint32Array(64)),
      (this._overlapParticles = {
        count: 0,
        posX: this.scene.arena.posX,
        posY: this.scene.arena.posY,
        prevX: new Float32Array(this.maxEnemies),
        prevY: new Float32Array(this.maxEnemies),
        velX: new Float32Array(this.maxEnemies),
        velY: new Float32Array(this.maxEnemies),
        radii: new Float32Array(this.maxEnemies),
        invMasses: new Float32Array(this.maxEnemies),
      });
  }
  spawn(t, e, i = 0, s = 24, n = 55, a = 0, c = 22, o = 20) {
    const r = this.scene.add.sprite(t, e, 'chars');
    r.setDisplaySize(o, o);
    const l = r.id;
    l !== -1 &&
      (i === 1
        ? r.play('walking_other_side')
        : i === 2
          ? r.play('walking_back')
          : i === 3
            ? (r.play('walking_front'), r.setTintFill(16764108))
            : r.play('walking_front'),
      r.setFlipX(!1),
      (this.vx[l] = 0),
      (this.vy[l] = 0),
      (this.hp[l] = s),
      (this.maxHp[l] = s),
      (this.spd[l] = n),
      (this.type[l] = i),
      (this.knockResist[l] = a),
      (this.atkPower[l] = c));
  }
  spawnDrop(t, e, i, s) {
    if (this.dropCount >= this.maxDrops) return;
    const n = this.dropCount++;
    (this.dx[n] = t), (this.dy[n] = e), (this.dtype[n] = i), (this.dval[n] = s);
    const a = this.scene.add.sprite(t, e, 'chars');
    a.setFrame(1),
      i === 1 ? a.setTintFill(16776960) : a.setTintFill(43775),
      a.setDisplaySize(14, 14),
      (this.dsprite[n] = a);
  }
  spawnProjectile(t, e, i, s, n, a = 1) {
    if (this.projCount >= this.maxProjectiles) return;
    const c = this.projCount++;
    (this.px[c] = t),
      (this.py[c] = e),
      (this.pvx[c] = i),
      (this.pvy[c] = s),
      (this.pdmg[c] = n),
      (this.plife[c] = 1.5),
      (this.ppierce[c] = a);
    const o = this.scene.add.sprite(t, e, 'chars');
    o.setFrame(0), o.setTintFill(16737894), o.setDisplaySize(12, 12), (this.psprite[c] = o);
  }
  kill(t, e = 0, i) {
    const s = i || this.scene,
      n = this.type[t] === 3,
      a = s.arena.idToIndex[t];
    if (a < 0) return;
    const c = s.arena.posX[a],
      o = s.arena.posY[a];
    if (n) {
      for (let r = 0; r < 5; r++) this.spawnDrop(c, o, 1, 2);
      for (let r = 0; r < 15; r++) this.spawnDrop(c, o, 0, 15);
    } else {
      const r = 0.08 + e;
      Math.random() < r
        ? this.spawnDrop(c, o, 1, 1)
        : this.spawnDrop(c, o, 0, 4 + this.type[t] * 2);
    }
    s.arena.free(t);
  }
  update(t, e, i, s) {
    const n = e.x,
      a = e.y;
    this.playerId = e.sprite.id;
    for (let d = 0; d < this.projCount; d++) {
      (this.px[d] += this.pvx[d] * t),
        (this.py[d] += this.pvy[d] * t),
        (this.psprite[d].x = this.px[d]),
        (this.psprite[d].y = this.py[d]),
        (this.plife[d] -= t);
      const b = this.px[d],
        T = this.py[d],
        P = this.pdmg[d];
      for (let M = 0; M < this.scene.arena.capacity; M++) {
        if (M === this.playerId) continue;
        const D = this.scene.arena.idToIndex[M];
        if (D < 0) continue;
        const C = this.scene.arena.posX[D] - b,
          Y = this.scene.arena.posY[D] - T,
          E = this.scene.arena.frameWidth[D] * this.scene.arena.scaleX[D] * 0.5 + 6;
        if (C * C + Y * Y < E * E) {
          this.hp[M] -= P;
          const A = 8 * (1 - this.knockResist[M]),
            B = 1 / (Math.sqrt(C * C + Y * Y) + 1e-4);
          if (
            ((this.scene.arena.posX[D] += C * B * 0.1 * A),
            (this.scene.arena.posY[D] += Y * B * 0.1 * A),
            this.hp[M] <= 0)
          ) {
            this.kill(M, s.coinRate || 0);
            break;
          }
          if ((this.ppierce[d]--, this.ppierce[d] <= 0)) {
            this.plife[d] = 0;
            break;
          }
        }
      }
      if (this.plife[d] <= 0) {
        this.psprite[d].destroy();
        const M = --this.projCount;
        d !== M &&
          ((this.px[d] = this.px[M]),
          (this.py[d] = this.py[M]),
          (this.pvx[d] = this.pvx[M]),
          (this.pvy[d] = this.pvy[M]),
          (this.pdmg[d] = this.pdmg[M]),
          (this.plife[d] = this.plife[M]),
          (this.ppierce[d] = this.ppierce[M]),
          (this.psprite[d] = this.psprite[M])),
          d--;
      }
    }
    i.density.fill(0);
    const c = i.cols,
      o = i.rows,
      r = i.originX,
      l = i.originY,
      p = i.invCellSize,
      u = this.scene.arena.activeCount;
    for (let d = 0; d < u; d++) {
      const b = ((this.scene.arena.posX[d] - r) * p) | 0,
        T = ((this.scene.arena.posY[d] - l) * p) | 0;
      b >= 0 && b < c && T >= 0 && T < o && (i.density[T * c + b] += 1);
    }
    i.solvePoissonUIC(), i.precomputeVelocityField();
    const v = 12,
      m = e.sprite.index;
    this.scene.spatialHash.clear();
    const y = i.precomputedVx,
      x = i.precomputedVy,
      g = this.scene.arena.posX,
      w = this.scene.arena.posY,
      k = this.scene.arena.facing,
      X = this.scene.arena.frameWidth,
      L = this.scene.arena.scaleX,
      I = this.vx,
      S = this.vy,
      O = this.spd,
      H = this.scene.arena.indexToId;
    for (let d = 0; d < u; d++) {
      const b = H[d],
        T = g[d],
        P = w[d],
        M = T - r,
        D = P - l,
        C = M * p,
        Y = D * p,
        E = C | 0,
        A = Y | 0;
      let B = 0,
        G = 0;
      if (E >= 1 && E < c - 2 && A >= 1 && A < o - 2) {
        const z = C - E,
          V = Y - A,
          N = A * c + E,
          F = N + c,
          J = y[N],
          Z = J + z * (y[N + 1] - J),
          tt = y[F],
          dt = tt + z * (y[F + 1] - tt);
        B = Z + V * (dt - Z);
        const et = x[N],
          st = et + z * (x[N + 1] - et),
          it = x[F],
          pt = it + z * (x[F + 1] - it);
        G = st + V * (pt - st);
      } else {
        const z = n - T,
          V = a - P,
          N = z * z + V * V,
          F = 1 / (Math.sqrt(N) + 0.001);
        (B = z * F), (G = V * F);
      }
      const q = O[b];
      (I[b] += (B * q - I[b]) * 8 * t), (S[b] += (G * q - S[b]) * 8 * t);
    }
    for (let d = 0; d < u; d++) {
      const b = H[d];
      (g[d] += I[b] * t), (w[d] += S[b] * t);
    }
    for (let d = 0; d < u; d++) {
      const b = H[d];
      I[b] > 2 ? (k[d] = 1) : I[b] < -2 && (k[d] = -1),
        this.scene.spatialHash.addEntity(b, g[d], w[d]);
    }
    const $ = v + 24,
      rt = n - $,
      ct = n + $,
      lt = a - $,
      ht = a + $;
    for (let d = 0; d < u; d++) {
      if (d === m) continue;
      const b = H[d],
        T = g[d],
        P = w[d];
      if (T >= rt && T <= ct && P >= lt && P <= ht) {
        const M = T - n,
          D = P - a,
          C = M * M + D * D,
          Y = v + X[d] * L[d] * 0.42;
        if (C < Y * Y) {
          e.takeDamage(this.atkPower[b] * t, s), this.scene.camera.shake(3, 0.1);
          const E = Math.sqrt(C),
            A = Y - E,
            B = 1 / (E || 1),
            G = M * B,
            q = D * B;
          (g[d] += G * A * 0.4), (w[d] += q * A * 0.4);
        }
      }
    }
    this.scene.spatialHash.build();
    const j = this._overlapPairs,
      W = this._overlapQuery;
    let R = 0;
    for (let d = 0; d < u && R * 2 < j.length - 2; d++) {
      const b = X[d] * L[d] * 0.42,
        T = this.scene.spatialHash.query(g[d], w[d], b * 2, W);
      for (let P = 0; P < T; P++) {
        const M = W[P],
          D = this.scene.arena.idToIndex[M];
        if (!(D < 0 || D <= d) && ((j[R * 2] = d), (j[R * 2 + 1] = D), R++, R * 2 >= j.length - 2))
          break;
      }
    }
    if (R > 0) {
      const d = this._overlapParticles;
      d.count = u;
      for (let b = 0; b < u; b++)
        (d.radii[b] = X[b] * L[b] * 0.42), (d.invMasses[b] = b === m ? 0 : 1);
      bt.resolveOverlaps(d, t, { pairs: j, pairCount: R, substeps: 2, compliance: 5e-4 });
    }
    const Q = e.pickupRadius * (1 + (s.pickupRadius || 0));
    for (let d = 0; d < this.dropCount; d++) {
      const b = n - this.dx[d],
        T = a - this.dy[d],
        P = Math.hypot(b, T);
      if (P < Q) {
        const M = (1 - P / Q) * 440 + 130,
          D = 1 / (P + 1e-4);
        if (
          ((this.dx[d] += b * D * M * t),
          (this.dy[d] += T * D * M * t),
          (this.dsprite[d].x = this.dx[d]),
          (this.dsprite[d].y = this.dy[d]),
          P < 20)
        ) {
          this.dtype[d] === 0
            ? e.addExp(this.dval[d] * (1 + (s.expGain || 0)))
            : e.addCoin(this.dval[d]),
            this.dsprite[d].destroy();
          const C = --this.dropCount;
          d !== C &&
            ((this.dx[d] = this.dx[C]),
            (this.dy[d] = this.dy[C]),
            (this.dtype[d] = this.dtype[C]),
            (this.dval[d] = this.dval[C]),
            (this.dsprite[d] = this.dsprite[C])),
            d--;
        }
      }
    }
  }
  applyAreaDamage(t, e, i, s, n = 0, a = 0, c) {
    const o = i * i;
    for (let r = 0; r < c.arena.capacity; r++) {
      if (r === this.playerId) continue;
      const l = c.arena.idToIndex[r];
      if (l < 0) continue;
      const p = c.arena.posX[l] - t,
        u = c.arena.posY[l] - e,
        v = p * p + u * u;
      if (v < o) {
        if (((this.hp[r] -= s), n > 0)) {
          const m = n * (1 - this.knockResist[r]);
          if (m > 0.4) {
            const y = 1 / (Math.sqrt(v) + 1e-4);
            (c.arena.posX[l] += p * y * m), (c.arena.posY[l] += u * y * m);
          }
        }
        if (this.hp[r] <= 0) {
          this.kill(r, a, c);
          break;
        }
      }
    }
  }
  findNearestEnemy(t, e, i = 380, s) {
    let n = -1,
      a = i * i;
    for (let c = 0; c < s.arena.capacity; c++) {
      if (c === this.playerId) continue;
      const o = s.arena.idToIndex[c];
      if (o < 0) continue;
      const r = s.arena.posX[o] - t,
        l = s.arena.posY[o] - e,
        p = r * r + l * l;
      p < a && ((a = p), (n = c));
    }
    return n;
  }
}
class It {
  constructor() {
    h(this, 'nodes');
    h(this, 'edges');
    (this.nodes = new Map()), (this.edges = []), this.buildGraph();
  }
  addNode(t, e, i, s, n, a, c, o, r, l, p, u = !1) {
    this.nodes.set(t, {
      id: t,
      x: e,
      y: i,
      cat: s,
      title: n,
      desc: a,
      statKey: c,
      stepVal: o,
      maxLvl: r,
      baseCost: l,
      costScale: p,
      isSpecial: u,
      level: 0,
      unlocked: t === 'core',
    });
  }
  addEdge(t, e) {
    this.edges.push([t, e]);
  }
  buildGraph() {
    this.addNode(
      'core',
      0,
      0,
      'core',
      '生存の本能',
      'すべての力の発脈点。',
      'none',
      0,
      1,
      0,
      1,
      !0,
    ),
      [
        { cat: 'offense', baseAngle: -Math.PI / 2, name: '攻撃' },
        { cat: 'defense', baseAngle: Math.PI / 6, name: '防御' },
        { cat: 'utility', baseAngle: (5 * Math.PI) / 6, name: '収益' },
      ].forEach((e) => {
        let i = ['core'];
        for (let s = 1; s <= 5; s++) {
          const n = s * 130,
            a = s * 2 + 1,
            c = [];
          for (let o = 0; o < a; o++) {
            const r = (o - (a - 1) / 2) * 0.28,
              l = e.baseAngle + r,
              p = Math.round(Math.cos(l) * n),
              u = Math.round(Math.sin(l) * n),
              v = `${e.cat}_r${s}_n${o}`,
              m = (s === 3 && o === 1) || (s === 5 && (o === 0 || o === a - 1));
            let y = '',
              x = '',
              g = '',
              w = 0,
              k = m ? 1 : 5;
            const X = 6 + s * 8 + (m ? 40 : 0),
              L = 1.35 + s * 0.05;
            if (e.cat === 'offense')
              if (m)
                (y = s === 3 ? '双弾乱舞' : '破滅の極点'),
                  (x = s === 3 ? '魔導弾の同時発射数 +1' : '全クリティカル倍率 +50%'),
                  (g = s === 3 ? 'bonusProj' : 'critMult'),
                  (w = s === 3 ? 1 : 0.5);
              else {
                const I = [
                    { t: '鋭利刃', s: 'bulletDmg', d: '攻撃力 +2.5%', v: 0.025 },
                    { t: '急速展開', s: 'atkSpeed', d: '攻撃間隔 -2.0%', v: 0.02 },
                    { t: '急所眼', s: 'critChance', d: '会心率 +1.5%', v: 0.015 },
                    { t: '衝撃伝播', s: 'knockback', d: 'ノックバック +6.0%', v: 0.06 },
                    { t: '領域拡張', s: 'areaSize', d: '攻撃範囲 +3.0%', v: 0.03 },
                  ],
                  S = I[(s + o) % I.length];
                (y = `${S.t} T${s}.${o + 1}`), (x = S.d), (g = S.s), (w = S.v);
              }
            else if (e.cat === 'defense')
              if (m)
                (y = s === 3 ? '不死鳥の契約' : '金剛の要塞'),
                  (x = s === 3 ? '1回だけHP50%で復活' : '被ダメージを常に -4 軽減'),
                  (g = s === 3 ? 'revive' : 'armor'),
                  (w = s === 3 ? 1 : 4);
              else {
                const I = [
                    { t: '巨人の血肉', s: 'maxHp', d: '最大HP +6', v: 6 },
                    { t: '細胞再生', s: 'hpRegen', d: '毎秒HP再生 +0.08', v: 0.08 },
                    { t: '硬質外骨格', s: 'armor', d: '被ダメ軽減 -0.5', v: 0.5 },
                    { t: '疾風脚', s: 'moveSpeed', d: '移動速度 +1.5%', v: 0.015 },
                    { t: '反発衝角', s: 'bodyPush', d: '接触反発 +8.0%', v: 0.08 },
                  ],
                  S = I[(s + o) % I.length];
                (y = `${S.t} T${s}.${o + 1}`), (x = S.d), (g = S.s), (w = S.v);
              }
            else if (m)
              (y = s === 3 ? '超引力磁場' : '強欲の権化'),
                (x = s === 3 ? '回収範囲 +60%' : 'コインドロップ率 +15%'),
                (g = s === 3 ? 'pickupRadius' : 'coinRate'),
                (w = s === 3 ? 0.6 : 0.15);
            else {
              const I = [
                  { t: '強奪の勘', s: 'coinRate', d: 'コインドロップ率 +1.5%', v: 0.015 },
                  { t: '賢者の眼', s: 'expGain', d: '経験値倍率 +2.5%', v: 0.025 },
                  { t: '微小引力', s: 'pickupRadius', d: '回収範囲 +4.0%', v: 0.04 },
                  { t: '精神集中', s: 'cooldown', d: '全クールダウン -1.5%', v: 0.015 },
                  { t: '持続詠唱', s: 'duration', d: '効果持続時間 +3.0%', v: 0.03 },
                ],
                S = I[(s + o) % I.length];
              (y = `${S.t} T${s}.${o + 1}`), (x = S.d), (g = S.s), (w = S.v);
            }
            if (
              (this.addNode(v, p, u, e.cat, y, x, g, w, k, X, L, m),
              c.push(v),
              i.length === 1 && i[0] === 'core')
            )
              this.addEdge('core', v);
            else {
              const I = Math.min(i.length - 1, Math.floor((o / a) * i.length));
              this.addEdge(i[I], v),
                I + 1 < i.length && Math.random() < 0.4 && this.addEdge(i[I + 1], v);
            }
            o > 0 && Math.random() < 0.45 && this.addEdge(c[o - 1], v);
          }
          i = c;
        }
      });
  }
  isNodePurchasable(t, e) {
    if (t === 'core') return !1;
    for (const [i, s] of this.edges)
      if (i === t) {
        if (s === 'core' || (e[s] && e[s] > 0)) return !0;
      } else if (s === t && (i === 'core' || (e[i] && e[i] > 0))) return !0;
    return !1;
  }
}
class K {
  static load() {
    try {
      const t = JSON.parse(localStorage.getItem(this.KEY) || '{}');
      return { coins: Number(t.coins) || 0, nodeLevels: t.nodeLevels || {} };
    } catch {
      return { coins: 0, nodeLevels: {} };
    }
  }
  static save(t, e) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify({ coins: t, nodeLevels: e }));
    } catch {}
  }
}
h(K, 'KEY', 'SWARM_HARDCORE_SAVE_V1');
class St {
  constructor(t, e, i) {
    h(this, 'tree');
    h(this, 'saveData');
    h(this, 'onUpdateCallback');
    h(this, 'canvas');
    h(this, 'ctx');
    h(this, 'camX', 0);
    h(this, 'camY', 0);
    h(this, 'zoom', 1);
    h(this, 'isDragging', !1);
    h(this, 'lastPointer', { x: 0, y: 0 });
    h(this, 'selectedNodeId', null);
    (this.tree = t),
      (this.saveData = e),
      (this.onUpdateCallback = i),
      (this.canvas = document.getElementById('tree-canvas')),
      (this.ctx = this.canvas.getContext('2d')),
      this.initEvents();
  }
  resize() {
    const t = this.canvas.getBoundingClientRect(),
      e = Math.min(window.devicePixelRatio || 1, 2);
    (this.canvas.width = t.width * e), (this.canvas.height = t.height * e), this.render();
  }
  initEvents() {
    const t = this.canvas,
      e = (a, c) => {
        (this.isDragging = !0), (this.lastPointer = { x: a, y: c });
      },
      i = (a, c) => {
        if (!this.isDragging) return;
        const o = a - this.lastPointer.x,
          r = c - this.lastPointer.y;
        (this.camX += o / this.zoom),
          (this.camY += r / this.zoom),
          (this.lastPointer = { x: a, y: c }),
          this.render();
      },
      s = () => {
        this.isDragging = !1;
      };
    t.addEventListener('mousedown', (a) => e(a.clientX, a.clientY)),
      window.addEventListener('mousemove', (a) => i(a.clientX, a.clientY)),
      window.addEventListener('mouseup', s);
    let n = null;
    t.addEventListener(
      'touchstart',
      (a) => {
        a.touches.length === 1
          ? e(a.touches[0].clientX, a.touches[0].clientY)
          : a.touches.length === 2 &&
            ((this.isDragging = !1),
            (n = Math.hypot(
              a.touches[0].clientX - a.touches[1].clientX,
              a.touches[0].clientY - a.touches[1].clientY,
            )));
      },
      { passive: !1 },
    ),
      t.addEventListener(
        'touchmove',
        (a) => {
          if (a.touches.length === 1) i(a.touches[0].clientX, a.touches[0].clientY);
          else if (a.touches.length === 2 && n !== null) {
            const c = Math.hypot(
                a.touches[0].clientX - a.touches[1].clientX,
                a.touches[0].clientY - a.touches[1].clientY,
              ),
              o = c / n;
            (this.zoom = Math.max(0.35, Math.min(2.5, this.zoom * o))), (n = c), this.render();
          }
        },
        { passive: !1 },
      ),
      t.addEventListener('touchend', (a) => {
        a.touches.length === 0 && (s(), (n = null));
      }),
      t.addEventListener(
        'wheel',
        (a) => {
          a.preventDefault();
          const c = a.deltaY < 0 ? 1.15 : 0.87;
          (this.zoom = Math.max(0.35, Math.min(2.5, this.zoom * c))), this.render();
        },
        { passive: !1 },
      ),
      t.addEventListener('click', (a) => {
        const c = t.getBoundingClientRect(),
          o = this.canvas.width / c.width,
          r = (a.clientX - c.left) * o,
          l = (a.clientY - c.top) * o,
          p = (r - this.canvas.width * 0.5) / this.zoom - this.camX,
          u = (l - this.canvas.height * 0.5) / this.zoom - this.camY;
        let v = null;
        for (const [, m] of this.tree.nodes) {
          const y = Math.hypot(m.x - p, m.y - u),
            x = m.isSpecial ? 22 : 16;
          if (y < x) {
            v = m;
            break;
          }
        }
        v && ((this.selectedNodeId = v.id), this.showInspector(v), this.render());
      }),
      (document.getElementById('btn-tree-zoom-in').onclick = () => {
        (this.zoom = Math.min(2.5, this.zoom * 1.25)), this.render();
      }),
      (document.getElementById('btn-tree-zoom-out').onclick = () => {
        (this.zoom = Math.max(0.35, this.zoom / 1.25)), this.render();
      }),
      (document.getElementById('btn-tree-reset').onclick = () => {
        (this.camX = 0), (this.camY = 0), (this.zoom = 1), this.render();
      }),
      (document.getElementById('btn-node-upgrade').onclick = () => {
        this.selectedNodeId && this.upgradeNode(this.selectedNodeId);
      });
  }
  showInspector(t) {
    document.getElementById('node-inspector').classList.remove('hidden');
    const i = this.saveData.nodeLevels[t.id] || 0,
      s = i >= t.maxLvl,
      n = Math.round(t.baseCost * Math.pow(t.costScale, i)),
      a = this.tree.isNodePurchasable(t.id, this.saveData.nodeLevels),
      c = this.saveData.coins >= n && a && !s;
    (document.getElementById('inspector-cat').innerText = t.cat.toUpperCase()),
      (document.getElementById('inspector-title').innerText = t.title),
      (document.getElementById('inspector-level').innerText = `Lv.${i}/${t.maxLvl}`),
      (document.getElementById('inspector-desc').innerText = t.desc),
      (document.getElementById('inspector-cost').innerText = s
        ? 'MAX'
        : `🪙 ${n.toLocaleString()}`);
    const o = document.getElementById('btn-node-upgrade');
    s
      ? ((o.innerText = '習得済'),
        (o.className =
          'px-3 py-1 bg-slate-800 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed'),
        (o.disabled = !0))
      : a
        ? c
          ? ((o.innerText = '強化する'),
            (o.className =
              'px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg active:scale-95 transition-all'),
            (o.disabled = !1))
          : ((o.innerText = 'コイン不足'),
            (o.className =
              'px-3 py-1 bg-slate-800 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed'),
            (o.disabled = !0))
        : ((o.innerText = '未開放（隣接ノードを習得してください）'),
          (o.className =
            'px-3 py-1 bg-slate-800 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed'),
          (o.disabled = !0));
  }
  upgradeNode(t) {
    const e = this.tree.nodes.get(t);
    if (!e) return;
    const i = this.saveData.nodeLevels[e.id] || 0;
    if (i >= e.maxLvl) return;
    const s = Math.round(e.baseCost * Math.pow(e.costScale, i));
    this.saveData.coins < s ||
      ((this.saveData.coins -= s),
      (this.saveData.nodeLevels[e.id] = i + 1),
      K.save(this.saveData.coins, this.saveData.nodeLevels),
      (document.getElementById('total-coins').innerText = this.saveData.coins.toLocaleString()),
      this.showInspector(e),
      this.onUpdateCallback(),
      this.render());
  }
  render() {
    const t = this.ctx,
      e = this.canvas.width,
      i = this.canvas.height;
    t.clearRect(0, 0, e, i),
      t.save(),
      t.translate(e * 0.5, i * 0.5),
      t.scale(this.zoom, this.zoom),
      t.translate(this.camX, this.camY);
    for (const [s, n] of this.tree.edges) {
      const a = this.tree.nodes.get(s),
        c = this.tree.nodes.get(n);
      if (!a || !c) continue;
      const o = s === 'core' || (this.saveData.nodeLevels[s] && this.saveData.nodeLevels[s] > 0),
        r = n === 'core' || (this.saveData.nodeLevels[n] && this.saveData.nodeLevels[n] > 0),
        l = o && r,
        p = o || r;
      t.beginPath(),
        t.moveTo(a.x, a.y),
        t.lineTo(c.x, c.y),
        (t.lineWidth = l ? 3.5 : 1.5),
        (t.strokeStyle = l ? '#f59e0b' : p ? '#334155' : '#1e293b'),
        t.stroke();
    }
    for (const [s, n] of this.tree.nodes) {
      const a = this.saveData.nodeLevels[s] || 0,
        c = a >= n.maxLvl,
        o = s === 'core' || a > 0,
        r = this.tree.isNodePurchasable(s, this.saveData.nodeLevels),
        l = this.selectedNodeId === s,
        p = n.isSpecial ? 16 : 10;
      (l || (n.isSpecial && o)) &&
        (t.beginPath(),
        t.arc(n.x, n.y, p + 6, 0, Math.PI * 2),
        (t.fillStyle = l ? 'rgba(251, 191, 36, 0.35)' : 'rgba(56, 189, 248, 0.25)'),
        t.fill()),
        t.beginPath(),
        t.arc(n.x, n.y, p, 0, Math.PI * 2),
        (t.lineWidth = l ? 3 : 2);
      let u = '#475569';
      n.cat === 'offense'
        ? (u = o ? '#ef4444' : r ? '#f87171' : '#334155')
        : n.cat === 'defense'
          ? (u = o ? '#38bdf8' : r ? '#7dd3fc' : '#1e293b')
          : n.cat === 'utility'
            ? (u = o ? '#10b981' : r ? '#6ee7b7' : '#1e293b')
            : s === 'core' && (u = '#fbbf24'),
        (t.strokeStyle = u),
        (t.fillStyle = o ? (c ? '#f59e0b' : u) : '#0f172a'),
        t.fill(),
        t.stroke(),
        n.isSpecial &&
          ((t.fillStyle = '#ffffff'), t.beginPath(), t.arc(n.x, n.y, 4, 0, Math.PI * 2), t.fill()),
        n.maxLvl > 1 &&
          (o || r) &&
          ((t.fillStyle = o ? '#fef08a' : '#94a3b8'),
          (t.font = 'bold 9px monospace'),
          (t.textAlign = 'center'),
          t.fillText(`${a}/${n.maxLvl}`, n.x, n.y + p + 11));
    }
    t.restore();
  }
}
const Dt = {
  idle_front: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  idle_back: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
  idle_side: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
  idle_other_side: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
  walking_front: [52, 53, 54, 55, 56, 57],
  walking_back: [58, 59, 60, 61, 62, 63],
  walking_side: [64, 65, 66, 67],
  walking_other_side: [68, 69, 70, 71],
};
class Ct extends vt {
  constructor() {
    super({ maxInstances: 5e4 });
    h(this, 'player');
    h(this, 'swarm');
    h(this, 'flow');
    h(this, 'treeGraph');
    h(this, 'treeUI');
    h(this, 'saveData');
    h(this, 'surviveDuration', 10 * 60);
    h(this, 'elapsedTime', 0);
    h(this, 'isGameOver', !1);
    h(this, 'isPaused', !1);
    h(this, 'bossSpawnsDone', new Set());
    h(this, 'inputDir', { x: 0, y: 0 });
    h(this, 'updateKeyInput');
    this.registerPlugin(new xt(64));
  }
  preload() {
    this.load.spritesheet('chars', '/pluto-engine/demos/' + 'assets/spritesheet.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
  }
  create() {
    for (const [e, i] of Object.entries(Dt))
      this.anims.create({ key: e, frames: i, frameRate: 10, repeat: -1 });
    (this.saveData = K.load()),
      (this.treeGraph = new It()),
      (this.treeUI = new St(this.treeGraph, this.saveData, () => {
        this.player.recalculateStats(this.getComputedTreeStats());
      })),
      (this.flow = new Mt(96, 96, 24)),
      (this.swarm = new kt(this, 4e4)),
      (this.player = new at(this, 0, 0)),
      this.initControls(),
      window.addEventListener('hardcore-levelup', (e) => this.showLevelUpModal(e.detail.level)),
      window.addEventListener('hardcore-death', () => this.triggerGameOver(!1)),
      (document.getElementById('btn-tree-restart').onclick = () => this.restartGame()),
      this.restartGame();
  }
  getComputedTreeStats() {
    const e = {};
    for (const [i, s] of this.treeGraph.nodes) {
      const n = this.saveData.nodeLevels[i] || 0;
      n > 0 && s.statKey !== 'none' && (e[s.statKey] = (e[s.statKey] || 0) + s.stepVal * n);
    }
    return e;
  }
  restartGame() {
    var s;
    (this.elapsedTime = 0),
      (this.isGameOver = !1),
      (this.isPaused = !1),
      this.bossSpawnsDone.clear(),
      (s = this.player) != null && s.sprite && this.player.sprite.destroy(),
      this.arena.clear(),
      (this.player = new at(this, 0, 0)),
      this.player.recalculateStats(this.getComputedTreeStats()),
      (this.swarm.dropCount = 0),
      (this.swarm.projCount = 0),
      document.getElementById('boss-alert').classList.add('hidden');
    const e = document.getElementById('tree-modal');
    e.classList.add('hidden'), e.classList.remove('flex');
    const i = document.getElementById('levelup-modal');
    i.classList.add('hidden'), i.classList.remove('flex'), this.spawnNormalHorde(18);
  }
  spawnNormalHorde(e) {
    const i = this.player,
      s = this.elapsedTime / 60,
      n = Math.pow(1 + s * 0.5, 2.5);
    for (let a = 0; a < e; a++) {
      const c = Math.random() * Math.PI * 2,
        o = 280 + Math.random() * 220;
      let r = 0,
        l = 18 * n,
        p = 62 + Math.random() * 20,
        u = 0,
        v = 22 + s * 6,
        m = 20;
      s >= 0.5 &&
        Math.random() < 0.35 &&
        ((r = 1), (l = 45 * n), (p = 72 + Math.random() * 15), (u = 0.25), (v = 32 + s * 8)),
        s >= 1.5 &&
          Math.random() < 0.25 &&
          ((r = 2),
          (l = 110 * n),
          (p = 50 + Math.random() * 10),
          (u = 0.85),
          (v = 48 + s * 10),
          (m = 24)),
        this.swarm.spawn(i.x + Math.cos(c) * o, i.y + Math.sin(c) * o, r, l, p, u, v, m);
    }
  }
  spawnBoss(e = 1) {
    const i = this.player,
      s = Math.random() * Math.PI * 2,
      n = 320,
      a = 1800 * Math.pow(e, 2.3),
      c = 48 + e * 8,
      o = 1,
      r = 65 + e * 30;
    this.swarm.spawn(i.x + Math.cos(s) * n, i.y + Math.sin(s) * n, 3, a, c, o, r, 44);
    const p = document.getElementById('boss-alert');
    (p.innerText = `⚠️ Tier ${e} ボス出現！ノックバック完全無効 (HP ${Math.round(a)}) ⚠️`),
      p.classList.remove('hidden'),
      setTimeout(() => p.classList.add('hidden'), 4500);
  }
  initControls() {
    const e = document.getElementById('joystick-base'),
      i = document.getElementById('joystick-thumb');
    let s = null,
      n = 0,
      a = 0;
    window.addEventListener(
      'touchstart',
      (r) => {
        if (this.isPaused || this.isGameOver || s !== null) return;
        const l = r.changedTouches[0];
        l.clientY > window.innerHeight * 0.3 &&
          ((s = l.identifier),
          (n = l.clientX),
          (a = l.clientY),
          (e.style.left = `${n - 56}px`),
          (e.style.top = `${a - 56}px`),
          (i.style.transform = 'translate(-50%, -50%)'),
          e.classList.remove('hidden'));
      },
      { passive: !1 },
    ),
      window.addEventListener(
        'touchmove',
        (r) => {
          if (s !== null)
            for (let l = 0; l < r.changedTouches.length; l++) {
              const p = r.changedTouches[l];
              if (p.identifier === s) {
                const u = p.clientX - n,
                  v = p.clientY - a,
                  m = Math.hypot(u, v),
                  y = 45,
                  x = Math.min(m, y),
                  g = Math.atan2(v, u),
                  w = Math.cos(g) * x,
                  k = Math.sin(g) * x;
                (i.style.transform = `translate(calc(-50% + ${w}px), calc(-50% + ${k}px))`),
                  (this.inputDir.x = m > 5 ? Math.cos(g) * (x / y) : 0),
                  (this.inputDir.y = m > 5 ? Math.sin(g) * (x / y) : 0);
                break;
              }
            }
        },
        { passive: !1 },
      );
    const c = (r) => {
      for (let l = 0; l < r.changedTouches.length; l++)
        if (r.changedTouches[l].identifier === s) {
          (s = null), e.classList.add('hidden'), (this.inputDir.x = 0), (this.inputDir.y = 0);
          break;
        }
    };
    window.addEventListener('touchend', c), window.addEventListener('touchcancel', c);
    const o = {};
    window.addEventListener('keydown', (r) => {
      o[r.code] = !0;
    }),
      window.addEventListener('keyup', (r) => {
        o[r.code] = !1;
      }),
      (this.updateKeyInput = () => {
        if (s !== null) return;
        let r = 0,
          l = 0;
        (o.KeyW || o.ArrowUp) && (l -= 1),
          (o.KeyS || o.ArrowDown) && (l += 1),
          (o.KeyA || o.ArrowLeft) && (r -= 1),
          (o.KeyD || o.ArrowRight) && (r += 1);
        const p = Math.hypot(r, l);
        (this.inputDir.x = p > 0 ? r / p : 0), (this.inputDir.y = p > 0 ? l / p : 0);
      });
  }
  showLevelUpModal(e) {
    this.isPaused = !0;
    const i = document.getElementById('levelup-modal'),
      s = document.getElementById('skill-choices');
    s.innerHTML = '';
    const a = [
      ...[
        { id: 'magic_wand', name: '魔導弾', desc: '近接敵へ誘導弾を連射' },
        { id: 'holy_orbit', name: '聖球', desc: '周囲を旋回する聖なる球（小ノックバック）' },
        { id: 'garlic_aura', name: '聖域衝撃', desc: '数秒ごとに周囲へ小波紋を放つ' },
        { id: 'lightning_strike', name: '天罰雷雲', desc: 'ランダムな敵1体へ落雷' },
      ],
    ]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    for (const c of a) {
      const o = this.player.skills.get(c.id) || 0,
        r = document.createElement('button');
      (r.className =
        'w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-left transition-all active:scale-95'),
        (r.innerHTML = `
        <div>
          <div class="font-black text-amber-300 text-xs sm:text-sm">${c.name} <span class="text-[10px] text-cyan-400 font-mono">Lv.${o} → ${o + 1}</span></div>
          <p class="text-[10px] text-slate-400 mt-0.5">${c.desc}</p>
        </div>
        <span class="text-base">✨</span>
      `),
        (r.onclick = () => {
          this.player.skills.set(c.id, o + 1),
            i.classList.add('hidden'),
            i.classList.remove('flex'),
            (this.isPaused = !1);
        }),
        s.appendChild(r);
    }
    i.classList.remove('hidden'), i.classList.add('flex');
  }
  triggerGameOver(e = !1) {
    (this.isGameOver = !0),
      (this.isPaused = !0),
      (this.saveData.coins += this.player.runCoins),
      K.save(this.saveData.coins, this.saveData.nodeLevels);
    const i = document.getElementById('tree-modal'),
      s = document.getElementById('tree-modal-title'),
      n = document.getElementById('tree-modal-sub'),
      a = Math.floor(this.elapsedTime / 60)
        .toString()
        .padStart(2, '0'),
      c = Math.floor(this.elapsedTime % 60)
        .toString()
        .padStart(2, '0');
    (n.innerText = `生存時間: ${a}:${c} | 獲得コイン: +${this.player.runCoins}🪙 | スキルツリーを開放して次へ挑め`),
      (s.innerText = e ? '🎉 10-MINUTE VICTORY!' : 'SURVIVAL FAILED'),
      (s.className = `text-base sm:text-lg font-black ${e ? 'text-amber-400' : 'text-rose-500'}`),
      (document.getElementById('total-coins').innerText = this.saveData.coins.toLocaleString()),
      i.classList.remove('hidden'),
      i.classList.add('flex'),
      setTimeout(() => {
        this.treeUI.resize(), this.treeUI.render();
      }, 50);
  }
  update(e) {
    if (this.isPaused || this.isGameOver || !this.player) return;
    if (((this.elapsedTime += e), this.elapsedTime >= this.surviveDuration)) {
      this.triggerGameOver(!0);
      return;
    }
    this.updateKeyInput();
    const i = this.getComputedTreeStats();
    this.elapsedTime >= 120 &&
      !this.bossSpawnsDone.has(1) &&
      (this.bossSpawnsDone.add(1), this.spawnBoss(1)),
      this.elapsedTime >= 300 &&
        !this.bossSpawnsDone.has(2) &&
        (this.bossSpawnsDone.add(2), this.spawnBoss(2)),
      this.elapsedTime >= 480 &&
        !this.bossSpawnsDone.has(3) &&
        (this.bossSpawnsDone.add(3), this.spawnBoss(3));
    const s = Math.min(15e3, Math.floor(25 + Math.pow(this.elapsedTime / 60, 2.2) * 220));
    this.arena.activeCount < s && this.spawnNormalHorde(Math.min(s - this.arena.activeCount, 15)),
      this.flow.updatePlayerCenter(this.player.x, this.player.y),
      this.player.update(e, this.inputDir, this.swarm, i, this),
      this.swarm.update(e, this.player, this.flow, i),
      this.updateHUD(),
      (this.camera.x = this.player.x),
      (this.camera.y = this.player.y),
      (this.camera.zoom = 1.4);
  }
  updateHUD() {
    const e = this.player,
      i = Math.max(0, Math.min(100, (e.hp / e.maxHp) * 100));
    (document.getElementById('hp-bar').style.width = `${i}%`),
      (document.getElementById('hp-text').innerText = `${Math.ceil(e.hp)}/${e.maxHp}`),
      (document.getElementById('player-lvl').innerText = `Lv.${e.level}`);
    const s = Math.min(100, (e.exp / e.expNext) * 100);
    document.getElementById('exp-bar').style.width = `${s}%`;
    const n = Math.max(0, this.surviveDuration - this.elapsedTime),
      a = Math.floor(n / 60)
        .toString()
        .padStart(2, '0'),
      c = Math.floor(n % 60)
        .toString()
        .padStart(2, '0');
    (document.getElementById('game-timer').innerText = `${a}:${c}`),
      (document.getElementById('run-coins').innerText = e.runCoins.toLocaleString()),
      (document.getElementById('horde-count').innerText = this.arena.activeCount.toLocaleString());
  }
}
new ft({ canvas: 'game-canvas', maxInstances: 5e4, scaleMode: 2, scene: [Ct] });
