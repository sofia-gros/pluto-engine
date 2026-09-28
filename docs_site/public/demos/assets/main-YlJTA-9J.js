var ot = Object.defineProperty;
var at = (m, t, e) =>
  t in m ? ot(m, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (m[t] = e);
var h = (m, t, e) => at(m, typeof t != 'symbol' ? t + '' : t, e);
import { P as ct, S as rt } from './index-Ci5NGFrL.js';
var ht = class {
  constructor(m = 64) {
    h(this, 'hash');
    h(this, 'cellSize');
    this.cellSize = m;
  }
  init(m) {
    (this.hash = new lt(m.arena.capacity, this.cellSize)), (m.spatialHash = this.hash);
  }
};
function Q(m) {
  return (
    (m = (m | (m << 8)) & 16711935),
    (m = (m | (m << 4)) & 252645135),
    (m = (m | (m << 2)) & 858993459),
    (m = (m | (m << 1)) & 1431655765),
    m >>> 0
  );
}
function Z(m, t) {
  return (Q(m) | (Q(t) << 1)) >>> 0;
}
var lt = class {
  constructor(m, t, e = 262144) {
    h(this, 'cellSize');
    h(this, 'maxEntities');
    h(this, 'entityIds');
    h(this, 'entityCodes');
    h(this, 'sortedIds');
    h(this, 'cellStart');
    h(this, 'cellCount');
    h(this, 'count');
    (this.cellSize = t),
      (this.maxEntities = m),
      (this.entityIds = new Uint32Array(m)),
      (this.entityCodes = new Uint32Array(m)),
      (this.sortedIds = new Uint32Array(m)),
      (this.cellStart = new Uint32Array(e)),
      (this.cellCount = new Uint32Array(e)),
      (this.count = 0);
  }
  clear() {
    (this.count = 0), this.cellStart.fill(0), this.cellCount.fill(0);
  }
  addEntity(m, t, e) {
    if (this.count >= this.maxEntities) return;
    const i = (Math.floor(t / this.cellSize) + 32768) & 65535,
      s = (Math.floor(e / this.cellSize) + 32768) & 65535,
      c = Z(i, s) & (this.cellStart.length - 1);
    (this.entityIds[this.count] = m),
      (this.entityCodes[this.count] = c),
      this.cellCount[c]++,
      this.count++;
  }
  build() {
    let m = 0;
    for (let t = 0; t < this.cellStart.length; t++)
      (this.cellStart[t] = m), (m += this.cellCount[t]), (this.cellCount[t] = 0);
    for (let t = 0; t < this.count; t++) {
      const e = this.entityIds[t],
        i = this.entityCodes[t],
        s = this.cellStart[i] + this.cellCount[i];
      (this.sortedIds[s] = e), this.cellCount[i]++;
    }
  }
  query(m, t, e, i) {
    const s = (Math.floor((m - e) / this.cellSize) + 32768) & 65535,
      c = (Math.floor((t - e) / this.cellSize) + 32768) & 65535,
      o = (Math.floor((m + e) / this.cellSize) + 32768) & 65535,
      r = (Math.floor((t + e) / this.cellSize) + 32768) & 65535;
    let n = 0;
    const l = this.cellStart.length - 1;
    for (let d = c; d <= r; d++)
      for (let p = s; p <= o; p++) {
        const u = Z(p, d) & l,
          x = this.cellStart[u],
          y = this.cellCount[u];
        for (let v = 0; v < y; v++) n < i.length && (i[n++] = this.sortedIds[x + v]);
      }
    return n;
  }
};
class tt {
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
    (this.sprite = t.add.sprite(e, i, 'player')),
      (this.sprite.scale = 28),
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
  update(t, e, i, s, c) {
    s.hpRegen > 0 &&
      this.hp < this.maxHp &&
      (this.hp = Math.min(this.maxHp, this.hp + s.hpRegen * t));
    const o = this.baseSpeed * (1 + (s.moveSpeed || 0));
    (this.vx = e.x * o),
      (this.vy = e.y * o),
      (this.x += this.vx * t),
      (this.y += this.vy * t),
      e.x > 0.1 ? this.sprite.setFlipX(!1) : e.x < -0.1 && this.sprite.setFlipX(!0);
    const r = 1 + (s.bulletDmg || 0),
      n = Math.max(0.4, 1 - (s.cooldown || 0)),
      l = 1 + (s.areaSize || 0),
      d = 1 + (s.knockback || 0),
      p = s.coinRate || 0,
      u = this.skills.get('magic_wand') || 0;
    if (u > 0) {
      this.wandTimer += t;
      const g = Math.max(0.25, 0.6 - u * 0.05) * n;
      if (this.wandTimer >= g) {
        this.wandTimer = 0;
        const w = i.findNearestEnemy(this.x, this.y, 380, c);
        if (w !== -1) {
          const M = i.scene.arena.posX[w],
            X = i.scene.arena.posY[w],
            P = 1 + (s.bonusProj || 0);
          for (let A = 0; A < P; A++) {
            const T = (A - (P - 1) / 2) * 0.2,
              b = c.math.Angle.Between(this.x, this.y, M, X) + T,
              j = Math.cos(b) * 400,
              U = Math.sin(b) * 400;
            i.spawnProjectile(this.x, this.y, j, U, (18 + u * 6) * r, 1);
          }
        }
      }
    }
    const x = this.skills.get('holy_orbit') || 0;
    if (
      x > 0 &&
      ((this.orbitAngle += (2.2 + x * 0.3) * t),
      (this.orbitHitTimer += t),
      this.orbitHitTimer >= 0.25)
    ) {
      this.orbitHitTimer = 0;
      const g = Math.min(3, 1 + Math.floor(x / 2)),
        w = 48 * l;
      for (let M = 0; M < g; M++) {
        const X = this.orbitAngle + (M * Math.PI * 2) / g,
          P = this.x + Math.cos(X) * w,
          A = this.y + Math.sin(X) * w;
        i.applyAreaDamage(P, A, 14 * l, (10 + x * 4) * r, 6 * d, p, c);
      }
    }
    const y = this.skills.get('garlic_aura') || 0;
    if (y > 0 && ((this.garlicTimer += t), this.garlicTimer >= 2.2 * n)) {
      this.garlicTimer = 0;
      const g = (42 + y * 8) * l;
      i.applyAreaDamage(this.x, this.y, g, (14 + y * 6) * r, 8 * d, p, c);
    }
    const v = this.skills.get('lightning_strike') || 0;
    if (v > 0 && ((this.lightningTimer += t), this.lightningTimer >= 2 * n)) {
      this.lightningTimer = 0;
      const g = i.findNearestEnemy(this.x, this.y, 350, c);
      g !== -1 &&
        i.applyAreaDamage(
          i.scene.arena.posX[g],
          i.scene.arena.posY[g],
          38 * l,
          (45 + v * 20) * r,
          14 * d,
          p,
          c,
        );
    }
  }
}
class dt {
  constructor(t = 96, e = 96, i = 24) {
    h(this, 'cols');
    h(this, 'rows');
    h(this, 'cellSize');
    h(this, 'invCellSize');
    h(this, 'width');
    h(this, 'height');
    h(this, 'size');
    h(this, 'dirX');
    h(this, 'dirY');
    h(this, 'density');
    h(this, 'pressure');
    h(this, 'precomputedVx');
    h(this, 'precomputedVy');
    h(this, 'originX', 0);
    h(this, 'originY', 0);
    (this.cols = t),
      (this.rows = e),
      (this.cellSize = i),
      (this.invCellSize = 1 / i),
      (this.width = t * i),
      (this.height = e * i),
      (this.size = t * e),
      (this.dirX = new Float32Array(this.size)),
      (this.dirY = new Float32Array(this.size)),
      (this.density = new Float32Array(this.size)),
      (this.pressure = new Float32Array(this.size)),
      (this.precomputedVx = new Float32Array(this.size)),
      (this.precomputedVy = new Float32Array(this.size));
  }
  updatePlayerCenter(t, e) {
    (this.originX = t - this.width * 0.5), (this.originY = e - this.height * 0.5);
    const i = this.width * 0.5,
      s = this.height * 0.5;
    for (let c = 0; c < this.rows; c++) {
      const r = (c + 0.5) * this.cellSize - s,
        n = c * this.cols;
      for (let l = 0; l < this.cols; l++) {
        const p = (l + 0.5) * this.cellSize - i,
          u = p * p + r * r,
          x = 1 / (Math.sqrt(u) + 0.001),
          y = n + l;
        (this.dirX[y] = -p * x), (this.dirY[y] = -r * x);
      }
    }
  }
  solvePoissonUIC(t = 2) {
    const e = this.cols,
      i = this.rows,
      s = this.pressure,
      c = this.density;
    for (let o = 0; o < t; o++)
      for (let r = 1; r < i - 1; r++) {
        const n = r * e;
        for (let l = 1; l < e - 1; l++) {
          const d = n + l,
            p = Math.max(0, c[d] - 3.5);
          s[d] = (s[d - 1] + s[d + 1] + s[d - e] + s[d + e] + p * 1.5) * 0.25;
        }
      }
  }
  precomputeVelocityField() {
    const t = this.cols,
      e = this.rows,
      i = this.pressure,
      s = this.dirX,
      c = this.dirY,
      o = this.precomputedVx,
      r = this.precomputedVy;
    for (let n = 1; n < e - 1; n++) {
      const l = n * t;
      for (let d = 1; d < t - 1; d++) {
        const p = l + d,
          u = (i[p + 1] - i[p - 1]) * 0.5,
          x = (i[p + t] - i[p - t]) * 0.5,
          y = s[p] - u * 0.7,
          v = c[p] - x * 0.7,
          g = y * y + v * v;
        if (g > 1e-4) {
          const w = 1 / Math.sqrt(g);
          (o[p] = y * w), (r[p] = v * w);
        } else (o[p] = 0), (r[p] = 0);
      }
    }
  }
}
class pt {
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
      (this.psprite = new Array(this.maxProjectiles));
  }
  spawn(t, e, i = 0, s = 24, c = 55, o = 0, r = 22, n = 20) {
    const l = this.scene.add.sprite(t, e, 'enemy');
    l.scale = n;
    const d = l.id;
    d !== -1 &&
      (l.setTint(i),
      l.setFlipX(!1),
      (this.vx[d] = 0),
      (this.vy[d] = 0),
      (this.hp[d] = s),
      (this.maxHp[d] = s),
      (this.spd[d] = c),
      (this.type[d] = i),
      (this.knockResist[d] = o),
      (this.atkPower[d] = r));
  }
  spawnDrop(t, e, i, s) {
    if (this.dropCount >= this.maxDrops) return;
    const c = this.dropCount++;
    (this.dx[c] = t), (this.dy[c] = e), (this.dtype[c] = i), (this.dval[c] = s);
    const o = this.scene.add.sprite(t, e, 'drop');
    (o.scale = 14), (this.dsprite[c] = o);
  }
  spawnProjectile(t, e, i, s, c, o = 1) {
    if (this.projCount >= this.maxProjectiles) return;
    const r = this.projCount++;
    (this.px[r] = t),
      (this.py[r] = e),
      (this.pvx[r] = i),
      (this.pvy[r] = s),
      (this.pdmg[r] = c),
      (this.plife[r] = 1.5),
      (this.ppierce[r] = o);
    const n = this.scene.add.sprite(t, e, 'projectile');
    (n.scale = 12), (this.psprite[r] = n);
  }
  kill(t, e = 0, i) {
    const s = i || this.scene,
      c = this.type[t] === 3,
      o = s.arena.posX[t],
      r = s.arena.posY[t];
    if (c) {
      for (let n = 0; n < 5; n++) this.spawnDrop(o, r, 1, 2);
      for (let n = 0; n < 15; n++) this.spawnDrop(o, r, 0, 15);
    } else {
      const n = 0.08 + e;
      Math.random() < n
        ? this.spawnDrop(o, r, 1, 1)
        : this.spawnDrop(o, r, 0, 4 + this.type[t] * 2);
    }
    s.arena.free(t);
  }
  update(t, e, i, s) {
    const c = e.x,
      o = e.y;
    for (let a = 0; a < this.projCount; a++) {
      (this.px[a] += this.pvx[a] * t),
        (this.py[a] += this.pvy[a] * t),
        (this.psprite[a].x = this.px[a]),
        (this.psprite[a].y = this.py[a]),
        (this.plife[a] -= t);
      const S = this.px[a],
        I = this.py[a],
        k = this.pdmg[a];
      for (let f = 0; f < this.scene.arena.capacity; f++) {
        if (this.scene.arena.idToIndex[f] < 0) continue;
        const D = this.scene.arena.posX[f] - S,
          L = this.scene.arena.posY[f] - I,
          C = this.scene.arena.scale[f] * 0.5 + 6;
        if (D * D + L * L < C * C) {
          this.hp[f] -= k;
          const E = 8 * (1 - this.knockResist[f]);
          if (
            ((this.scene.arena.posX[f] += (D || 1) * 0.1 * E),
            (this.scene.arena.posY[f] += (L || 1) * 0.1 * E),
            this.hp[f] <= 0 && this.kill(f, s.coinRate || 0),
            this.ppierce[a]--,
            this.ppierce[a] <= 0)
          ) {
            this.plife[a] = 0;
            break;
          }
        }
      }
      if (this.plife[a] <= 0) {
        this.psprite[a].destroy();
        const f = --this.projCount;
        a !== f &&
          ((this.px[a] = this.px[f]),
          (this.py[a] = this.py[f]),
          (this.pvx[a] = this.pvx[f]),
          (this.pvy[a] = this.pvy[f]),
          (this.pdmg[a] = this.pdmg[f]),
          (this.plife[a] = this.plife[f]),
          (this.ppierce[a] = this.ppierce[f]),
          (this.psprite[a] = this.psprite[f])),
          a--;
      }
    }
    i.density.fill(0);
    const r = i.cols,
      n = i.rows,
      l = i.originX,
      d = i.originY,
      p = i.invCellSize,
      u = this.scene.arena.activeCount;
    for (let a = 0; a < u; a++) {
      const S = ((this.scene.arena.posX[a] - l) * p) | 0,
        I = ((this.scene.arena.posY[a] - d) * p) | 0;
      S >= 0 && S < r && I >= 0 && I < n && (i.density[I * r + S] += 1);
    }
    i.solvePoissonUIC(), i.precomputeVelocityField();
    const x = 12;
    this.scene.spatialHash.clear();
    const y = i.precomputedVx,
      v = i.precomputedVy,
      g = this.scene.arena.posX,
      w = this.scene.arena.posY,
      M = this.scene.arena.facing,
      X = this.scene.arena.scale,
      P = this.vx,
      A = this.vy,
      T = this.spd;
    for (let a = 0; a < u; a++) {
      const S = g[a],
        I = w[a],
        k = S - l,
        f = I - d,
        D = k * p,
        L = f * p,
        C = D | 0,
        E = L | 0;
      let z = 0,
        $ = 0;
      if (C >= 1 && C < r - 2 && E >= 1 && E < n - 2) {
        const Y = D - C,
          N = L - E,
          B = E * r + C,
          H = B + r,
          K = y[B],
          _ = K + Y * (y[B + 1] - K),
          O = y[H],
          it = O + Y * (y[H + 1] - O);
        z = _ + N * (it - _);
        const q = v[B],
          W = q + Y * (v[B + 1] - q),
          J = v[H],
          nt = J + Y * (v[H + 1] - J);
        $ = W + N * (nt - W);
      } else {
        const Y = c - S,
          N = o - I,
          B = Y * Y + N * N,
          H = 1 / (Math.sqrt(B) + 0.001);
        (z = Y * H), ($ = N * H);
      }
      const R = T[a];
      (P[a] += (z * R - P[a]) * 8 * t), (A[a] += ($ * R - A[a]) * 8 * t);
    }
    for (let a = 0; a < u; a++) (g[a] += P[a] * t), (w[a] += A[a] * t);
    for (let a = 0; a < u; a++)
      P[a] > 2 ? (M[a] = 1) : P[a] < -2 && (M[a] = -1),
        this.scene.spatialHash.addEntity(a, g[a], w[a]);
    const b = x + 24,
      j = c - b,
      U = c + b,
      et = o - b,
      st = o + b;
    for (let a = 0; a < u; a++) {
      const S = g[a],
        I = w[a];
      if (S >= j && S <= U && I >= et && I <= st) {
        const k = S - c,
          f = I - o,
          D = k * k + f * f,
          L = x + X[a] * 0.42;
        if (D < L * L) {
          e.takeDamage(this.atkPower[a] * t, s), this.scene.camera.shake(3, 0.1);
          const C = Math.sqrt(D),
            E = L - C,
            z = 1 / (C || 1),
            $ = k * z,
            R = f * z;
          (g[a] += $ * E * 0.4), (w[a] += R * E * 0.4);
        }
      }
    }
    this.scene.spatialHash.build();
    const V = new Uint32Array(32);
    for (let a = 0; a < u; a++) {
      const S = this.scene.arena.scale[a] * 0.42,
        I = this.scene.spatialHash.query(
          this.scene.arena.posX[a],
          this.scene.arena.posY[a],
          S * 2,
          V,
        );
      for (let k = 0; k < I; k++) {
        const f = V[k];
        if (f > a && f < u) {
          const D = this.scene.arena.scale[f] * 0.42,
            L = S + D,
            C = this.scene.arena.posX[f] - this.scene.arena.posX[a],
            E = this.scene.arena.posY[f] - this.scene.arena.posY[a],
            z = C * C + E * E;
          if (z < L * L && z > 1e-4) {
            const $ = Math.sqrt(z),
              R = (L - $) * 0.45,
              Y = 1 / $,
              N = C * Y,
              B = E * Y;
            (this.scene.arena.posX[a] -= N * R * 0.5),
              (this.scene.arena.posY[a] -= B * R * 0.5),
              (this.scene.arena.posX[f] += N * R * 0.5),
              (this.scene.arena.posY[f] += B * R * 0.5);
          }
        }
      }
    }
    const G = e.pickupRadius * (1 + (s.pickupRadius || 0));
    for (let a = 0; a < this.dropCount; a++) {
      const S = c - this.dx[a],
        I = o - this.dy[a],
        k = Math.hypot(S, I);
      if (k < G) {
        const f = (1 - k / G) * 440 + 130;
        if (
          ((this.dx[a] += (S / k) * f * t),
          (this.dy[a] += (I / k) * f * t),
          (this.dsprite[a].x = this.dx[a]),
          (this.dsprite[a].y = this.dy[a]),
          k < 20)
        ) {
          this.dtype[a] === 0
            ? e.addExp(this.dval[a] * (1 + (s.expGain || 0)))
            : e.addCoin(this.dval[a]),
            this.dsprite[a].destroy();
          const D = --this.dropCount;
          a !== D &&
            ((this.dx[a] = this.dx[D]),
            (this.dy[a] = this.dy[D]),
            (this.dtype[a] = this.dtype[D]),
            (this.dval[a] = this.dval[D]),
            (this.dsprite[a] = this.dsprite[D])),
            a--;
        }
      }
    }
  }
  applyAreaDamage(t, e, i, s, c = 0, o = 0, r) {
    const n = i * i;
    for (let l = 0; l < r.arena.capacity; l++) {
      if (r.arena.idToIndex[l] < 0) continue;
      const d = r.arena.posX[l] - t,
        p = r.arena.posY[l] - e,
        u = d * d + p * p;
      if (u < n) {
        if (((this.hp[l] -= s), c > 0)) {
          const x = c * (1 - this.knockResist[l]);
          if (x > 0.4) {
            const y = Math.sqrt(u) || 1;
            (r.arena.posX[l] += (d / y) * x), (r.arena.posY[l] += (p / y) * x);
          }
        }
        this.hp[l] <= 0 && this.kill(l, o, r);
      }
    }
  }
  findNearestEnemy(t, e, i = 380, s) {
    let c = -1,
      o = i * i;
    for (let r = 0; r < s.arena.capacity; r++) {
      if (s.arena.idToIndex[r] < 0) continue;
      const n = s.arena.posX[r] - t,
        l = s.arena.posY[r] - e,
        d = n * n + l * l;
      d < o && ((o = d), (c = r));
    }
    return c;
  }
}
class mt {
  constructor() {
    h(this, 'nodes');
    h(this, 'edges');
    (this.nodes = new Map()), (this.edges = []), this.buildGraph();
  }
  addNode(t, e, i, s, c, o, r, n, l, d, p, u = !1) {
    this.nodes.set(t, {
      id: t,
      x: e,
      y: i,
      cat: s,
      title: c,
      desc: o,
      statKey: r,
      stepVal: n,
      maxLvl: l,
      baseCost: d,
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
          const c = s * 130,
            o = s * 2 + 1,
            r = [];
          for (let n = 0; n < o; n++) {
            const l = (n - (o - 1) / 2) * 0.28,
              d = e.baseAngle + l,
              p = Math.round(Math.cos(d) * c),
              u = Math.round(Math.sin(d) * c),
              x = `${e.cat}_r${s}_n${n}`,
              y = (s === 3 && n === 1) || (s === 5 && (n === 0 || n === o - 1));
            let v = '',
              g = '',
              w = '',
              M = 0,
              X = y ? 1 : 5;
            const P = 6 + s * 8 + (y ? 40 : 0),
              A = 1.35 + s * 0.05;
            if (e.cat === 'offense')
              if (y)
                (v = s === 3 ? '双弾乱舞' : '破滅の極点'),
                  (g = s === 3 ? '魔導弾の同時発射数 +1' : '全クリティカル倍率 +50%'),
                  (w = s === 3 ? 'bonusProj' : 'critMult'),
                  (M = s === 3 ? 1 : 0.5);
              else {
                const T = [
                    { t: '鋭利刃', s: 'bulletDmg', d: '攻撃力 +2.5%', v: 0.025 },
                    { t: '急速展開', s: 'atkSpeed', d: '攻撃間隔 -2.0%', v: 0.02 },
                    { t: '急所眼', s: 'critChance', d: '会心率 +1.5%', v: 0.015 },
                    { t: '衝撃伝播', s: 'knockback', d: 'ノックバック +6.0%', v: 0.06 },
                    { t: '領域拡張', s: 'areaSize', d: '攻撃範囲 +3.0%', v: 0.03 },
                  ],
                  b = T[(s + n) % T.length];
                (v = `${b.t} T${s}.${n + 1}`), (g = b.d), (w = b.s), (M = b.v);
              }
            else if (e.cat === 'defense')
              if (y)
                (v = s === 3 ? '不死鳥の契約' : '金剛の要塞'),
                  (g = s === 3 ? '1回だけHP50%で復活' : '被ダメージを常に -4 軽減'),
                  (w = s === 3 ? 'revive' : 'armor'),
                  (M = s === 3 ? 1 : 4);
              else {
                const T = [
                    { t: '巨人の血肉', s: 'maxHp', d: '最大HP +6', v: 6 },
                    { t: '細胞再生', s: 'hpRegen', d: '毎秒HP再生 +0.08', v: 0.08 },
                    { t: '硬質外骨格', s: 'armor', d: '被ダメ軽減 -0.5', v: 0.5 },
                    { t: '疾風脚', s: 'moveSpeed', d: '移動速度 +1.5%', v: 0.015 },
                    { t: '反発衝角', s: 'bodyPush', d: '接触反発 +8.0%', v: 0.08 },
                  ],
                  b = T[(s + n) % T.length];
                (v = `${b.t} T${s}.${n + 1}`), (g = b.d), (w = b.s), (M = b.v);
              }
            else if (y)
              (v = s === 3 ? '超引力磁場' : '強欲の権化'),
                (g = s === 3 ? '回収範囲 +60%' : 'コインドロップ率 +15%'),
                (w = s === 3 ? 'pickupRadius' : 'coinRate'),
                (M = s === 3 ? 0.6 : 0.15);
            else {
              const T = [
                  { t: '強奪の勘', s: 'coinRate', d: 'コインドロップ率 +1.5%', v: 0.015 },
                  { t: '賢者の眼', s: 'expGain', d: '経験値倍率 +2.5%', v: 0.025 },
                  { t: '微小引力', s: 'pickupRadius', d: '回収範囲 +4.0%', v: 0.04 },
                  { t: '精神集中', s: 'cooldown', d: '全クールダウン -1.5%', v: 0.015 },
                  { t: '持続詠唱', s: 'duration', d: '効果持続時間 +3.0%', v: 0.03 },
                ],
                b = T[(s + n) % T.length];
              (v = `${b.t} T${s}.${n + 1}`), (g = b.d), (w = b.s), (M = b.v);
            }
            if (
              (this.addNode(x, p, u, e.cat, v, g, w, M, X, P, A, y),
              r.push(x),
              i.length === 1 && i[0] === 'core')
            )
              this.addEdge('core', x);
            else {
              const T = Math.min(i.length - 1, Math.floor((n / o) * i.length));
              this.addEdge(i[T], x),
                T + 1 < i.length && Math.random() < 0.4 && this.addEdge(i[T + 1], x);
            }
            n > 0 && Math.random() < 0.45 && this.addEdge(r[n - 1], x);
          }
          i = r;
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
class F {
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
h(F, 'KEY', 'SWARM_HARDCORE_SAVE_V1');
class ut {
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
      e = (o, r) => {
        (this.isDragging = !0), (this.lastPointer = { x: o, y: r });
      },
      i = (o, r) => {
        if (!this.isDragging) return;
        const n = o - this.lastPointer.x,
          l = r - this.lastPointer.y;
        (this.camX += n / this.zoom),
          (this.camY += l / this.zoom),
          (this.lastPointer = { x: o, y: r }),
          this.render();
      },
      s = () => {
        this.isDragging = !1;
      };
    t.addEventListener('mousedown', (o) => e(o.clientX, o.clientY)),
      window.addEventListener('mousemove', (o) => i(o.clientX, o.clientY)),
      window.addEventListener('mouseup', s);
    let c = null;
    t.addEventListener(
      'touchstart',
      (o) => {
        o.touches.length === 1
          ? e(o.touches[0].clientX, o.touches[0].clientY)
          : o.touches.length === 2 &&
            ((this.isDragging = !1),
            (c = Math.hypot(
              o.touches[0].clientX - o.touches[1].clientX,
              o.touches[0].clientY - o.touches[1].clientY,
            )));
      },
      { passive: !1 },
    ),
      t.addEventListener(
        'touchmove',
        (o) => {
          if (o.touches.length === 1) i(o.touches[0].clientX, o.touches[0].clientY);
          else if (o.touches.length === 2 && c !== null) {
            const r = Math.hypot(
                o.touches[0].clientX - o.touches[1].clientX,
                o.touches[0].clientY - o.touches[1].clientY,
              ),
              n = r / c;
            (this.zoom = Math.max(0.35, Math.min(2.5, this.zoom * n))), (c = r), this.render();
          }
        },
        { passive: !1 },
      ),
      t.addEventListener('touchend', (o) => {
        o.touches.length === 0 && (s(), (c = null));
      }),
      t.addEventListener(
        'wheel',
        (o) => {
          o.preventDefault();
          const r = o.deltaY < 0 ? 1.15 : 0.87;
          (this.zoom = Math.max(0.35, Math.min(2.5, this.zoom * r))), this.render();
        },
        { passive: !1 },
      ),
      t.addEventListener('click', (o) => {
        const r = t.getBoundingClientRect(),
          n = this.canvas.width / r.width,
          l = (o.clientX - r.left) * n,
          d = (o.clientY - r.top) * n,
          p = (l - this.canvas.width * 0.5) / this.zoom - this.camX,
          u = (d - this.canvas.height * 0.5) / this.zoom - this.camY;
        let x = null;
        for (const [, y] of this.tree.nodes) {
          const v = Math.hypot(y.x - p, y.y - u),
            g = y.isSpecial ? 22 : 16;
          if (v < g) {
            x = y;
            break;
          }
        }
        x && ((this.selectedNodeId = x.id), this.showInspector(x), this.render());
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
      c = Math.round(t.baseCost * Math.pow(t.costScale, i)),
      o = this.tree.isNodePurchasable(t.id, this.saveData.nodeLevels),
      r = this.saveData.coins >= c && o && !s;
    (document.getElementById('inspector-cat').innerText = t.cat.toUpperCase()),
      (document.getElementById('inspector-title').innerText = t.title),
      (document.getElementById('inspector-level').innerText = `Lv.${i}/${t.maxLvl}`),
      (document.getElementById('inspector-desc').innerText = t.desc),
      (document.getElementById('inspector-cost').innerText = s
        ? 'MAX'
        : `🪙 ${c.toLocaleString()}`);
    const n = document.getElementById('btn-node-upgrade');
    s
      ? ((n.innerText = '習得済'),
        (n.className =
          'px-3 py-1 bg-slate-800 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed'),
        (n.disabled = !0))
      : o
        ? r
          ? ((n.innerText = '強化する'),
            (n.className =
              'px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg active:scale-95 transition-all'),
            (n.disabled = !1))
          : ((n.innerText = 'コイン不足'),
            (n.className =
              'px-3 py-1 bg-slate-800 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed'),
            (n.disabled = !0))
        : ((n.innerText = '未開放（隣接ノードを習得してください）'),
          (n.className =
            'px-3 py-1 bg-slate-800 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed'),
          (n.disabled = !0));
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
      F.save(this.saveData.coins, this.saveData.nodeLevels),
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
    for (const [s, c] of this.tree.edges) {
      const o = this.tree.nodes.get(s),
        r = this.tree.nodes.get(c);
      if (!o || !r) continue;
      const n = s === 'core' || (this.saveData.nodeLevels[s] && this.saveData.nodeLevels[s] > 0),
        l = c === 'core' || (this.saveData.nodeLevels[c] && this.saveData.nodeLevels[c] > 0),
        d = n && l,
        p = n || l;
      t.beginPath(),
        t.moveTo(o.x, o.y),
        t.lineTo(r.x, r.y),
        (t.lineWidth = d ? 3.5 : 1.5),
        (t.strokeStyle = d ? '#f59e0b' : p ? '#334155' : '#1e293b'),
        t.stroke();
    }
    for (const [s, c] of this.tree.nodes) {
      const o = this.saveData.nodeLevels[s] || 0,
        r = o >= c.maxLvl,
        n = s === 'core' || o > 0,
        l = this.tree.isNodePurchasable(s, this.saveData.nodeLevels),
        d = this.selectedNodeId === s,
        p = c.isSpecial ? 16 : 10;
      (d || (c.isSpecial && n)) &&
        (t.beginPath(),
        t.arc(c.x, c.y, p + 6, 0, Math.PI * 2),
        (t.fillStyle = d ? 'rgba(251, 191, 36, 0.35)' : 'rgba(56, 189, 248, 0.25)'),
        t.fill()),
        t.beginPath(),
        t.arc(c.x, c.y, p, 0, Math.PI * 2),
        (t.lineWidth = d ? 3 : 2);
      let u = '#475569';
      c.cat === 'offense'
        ? (u = n ? '#ef4444' : l ? '#f87171' : '#334155')
        : c.cat === 'defense'
          ? (u = n ? '#38bdf8' : l ? '#7dd3fc' : '#1e293b')
          : c.cat === 'utility'
            ? (u = n ? '#10b981' : l ? '#6ee7b7' : '#1e293b')
            : s === 'core' && (u = '#fbbf24'),
        (t.strokeStyle = u),
        (t.fillStyle = n ? (r ? '#f59e0b' : u) : '#0f172a'),
        t.fill(),
        t.stroke(),
        c.isSpecial &&
          ((t.fillStyle = '#ffffff'), t.beginPath(), t.arc(c.x, c.y, 4, 0, Math.PI * 2), t.fill()),
        c.maxLvl > 1 &&
          (n || l) &&
          ((t.fillStyle = n ? '#fef08a' : '#94a3b8'),
          (t.font = 'bold 9px monospace'),
          (t.textAlign = 'center'),
          t.fillText(`${o}/${c.maxLvl}`, c.x, c.y + p + 11));
    }
    t.restore();
  }
}
class yt extends rt {
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
    this.registerPlugin(new ht(64));
  }
  create() {
    (this.saveData = F.load()),
      (this.treeGraph = new mt()),
      (this.treeUI = new ut(this.treeGraph, this.saveData, () => {
        this.player.recalculateStats(this.getComputedTreeStats());
      })),
      (this.flow = new dt(96, 96, 24)),
      (this.swarm = new pt(this, 4e4)),
      (this.player = new tt(this, 0, 0)),
      this.initControls(),
      window.addEventListener('hardcore-levelup', (e) => this.showLevelUpModal(e.detail.level)),
      window.addEventListener('hardcore-death', () => this.triggerGameOver(!1)),
      (document.getElementById('btn-tree-restart').onclick = () => this.restartGame()),
      this.restartGame();
  }
  getComputedTreeStats() {
    const e = {};
    for (const [i, s] of this.treeGraph.nodes) {
      const c = this.saveData.nodeLevels[i] || 0;
      c > 0 && s.statKey !== 'none' && (e[s.statKey] = (e[s.statKey] || 0) + s.stepVal * c);
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
      (this.player = new tt(this, 0, 0)),
      this.player.recalculateStats(this.getComputedTreeStats()),
      this.arena.clear(),
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
      c = Math.pow(1 + s * 0.5, 2.5);
    for (let o = 0; o < e; o++) {
      const r = Math.random() * Math.PI * 2,
        n = 280 + Math.random() * 220;
      let l = 0,
        d = 18 * c,
        p = 62 + Math.random() * 20,
        u = 0,
        x = 22 + s * 6,
        y = 20;
      s >= 0.5 &&
        Math.random() < 0.35 &&
        ((l = 1), (d = 45 * c), (p = 72 + Math.random() * 15), (u = 0.25), (x = 32 + s * 8)),
        s >= 1.5 &&
          Math.random() < 0.25 &&
          ((l = 2),
          (d = 110 * c),
          (p = 50 + Math.random() * 10),
          (u = 0.85),
          (x = 48 + s * 10),
          (y = 24)),
        this.swarm.spawn(i.x + Math.cos(r) * n, i.y + Math.sin(r) * n, l, d, p, u, x, y);
    }
  }
  spawnBoss(e = 1) {
    const i = this.player,
      s = Math.random() * Math.PI * 2,
      c = 320,
      o = 1800 * Math.pow(e, 2.3),
      r = 48 + e * 8,
      n = 1,
      l = 65 + e * 30;
    this.swarm.spawn(i.x + Math.cos(s) * c, i.y + Math.sin(s) * c, 3, o, r, n, l, 44);
    const p = document.getElementById('boss-alert');
    (p.innerText = `⚠️ Tier ${e} ボス出現！ノックバック完全無効 (HP ${Math.round(o)}) ⚠️`),
      p.classList.remove('hidden'),
      setTimeout(() => p.classList.add('hidden'), 4500);
  }
  initControls() {
    const e = document.getElementById('joystick-base'),
      i = document.getElementById('joystick-thumb');
    let s = null,
      c = 0,
      o = 0;
    window.addEventListener(
      'touchstart',
      (l) => {
        if (this.isPaused || this.isGameOver || s !== null) return;
        const d = l.changedTouches[0];
        d.clientY > window.innerHeight * 0.3 &&
          ((s = d.identifier),
          (c = d.clientX),
          (o = d.clientY),
          (e.style.left = `${c - 56}px`),
          (e.style.top = `${o - 56}px`),
          (i.style.transform = 'translate(-50%, -50%)'),
          e.classList.remove('hidden'));
      },
      { passive: !1 },
    ),
      window.addEventListener(
        'touchmove',
        (l) => {
          if (s !== null)
            for (let d = 0; d < l.changedTouches.length; d++) {
              const p = l.changedTouches[d];
              if (p.identifier === s) {
                const u = p.clientX - c,
                  x = p.clientY - o,
                  y = Math.hypot(u, x),
                  v = 45,
                  g = Math.min(y, v),
                  w = Math.atan2(x, u),
                  M = Math.cos(w) * g,
                  X = Math.sin(w) * g;
                (i.style.transform = `translate(calc(-50% + ${M}px), calc(-50% + ${X}px))`),
                  (this.inputDir.x = y > 5 ? Math.cos(w) * (g / v) : 0),
                  (this.inputDir.y = y > 5 ? Math.sin(w) * (g / v) : 0);
                break;
              }
            }
        },
        { passive: !1 },
      );
    const r = (l) => {
      for (let d = 0; d < l.changedTouches.length; d++)
        if (l.changedTouches[d].identifier === s) {
          (s = null), e.classList.add('hidden'), (this.inputDir.x = 0), (this.inputDir.y = 0);
          break;
        }
    };
    window.addEventListener('touchend', r), window.addEventListener('touchcancel', r);
    const n = {};
    window.addEventListener('keydown', (l) => {
      n[l.code] = !0;
    }),
      window.addEventListener('keyup', (l) => {
        n[l.code] = !1;
      }),
      (this.updateKeyInput = () => {
        if (s !== null) return;
        let l = 0,
          d = 0;
        (n.KeyW || n.ArrowUp) && (d -= 1),
          (n.KeyS || n.ArrowDown) && (d += 1),
          (n.KeyA || n.ArrowLeft) && (l -= 1),
          (n.KeyD || n.ArrowRight) && (l += 1);
        const p = Math.hypot(l, d);
        (this.inputDir.x = p > 0 ? l / p : 0), (this.inputDir.y = p > 0 ? d / p : 0);
      });
  }
  showLevelUpModal(e) {
    this.isPaused = !0;
    const i = document.getElementById('levelup-modal'),
      s = document.getElementById('skill-choices');
    s.innerHTML = '';
    const o = [
      ...[
        { id: 'magic_wand', name: '魔導弾', desc: '近接敵へ誘導弾を連射' },
        { id: 'holy_orbit', name: '聖球', desc: '周囲を旋回する聖なる球（小ノックバック）' },
        { id: 'garlic_aura', name: '聖域衝撃', desc: '数秒ごとに周囲へ小波紋を放つ' },
        { id: 'lightning_strike', name: '天罰雷雲', desc: 'ランダムな敵1体へ落雷' },
      ],
    ]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    for (const r of o) {
      const n = this.player.skills.get(r.id) || 0,
        l = document.createElement('button');
      (l.className =
        'w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-left transition-all active:scale-95'),
        (l.innerHTML = `
        <div>
          <div class="font-black text-amber-300 text-xs sm:text-sm">${r.name} <span class="text-[10px] text-cyan-400 font-mono">Lv.${n} → ${n + 1}</span></div>
          <p class="text-[10px] text-slate-400 mt-0.5">${r.desc}</p>
        </div>
        <span class="text-base">✨</span>
      `),
        (l.onclick = () => {
          this.player.skills.set(r.id, n + 1),
            i.classList.add('hidden'),
            i.classList.remove('flex'),
            (this.isPaused = !1);
        }),
        s.appendChild(l);
    }
    i.classList.remove('hidden'), i.classList.add('flex');
  }
  triggerGameOver(e = !1) {
    (this.isGameOver = !0),
      (this.isPaused = !0),
      (this.saveData.coins += this.player.runCoins),
      F.save(this.saveData.coins, this.saveData.nodeLevels);
    const i = document.getElementById('tree-modal'),
      s = document.getElementById('tree-modal-title'),
      c = document.getElementById('tree-modal-sub'),
      o = Math.floor(this.elapsedTime / 60)
        .toString()
        .padStart(2, '0'),
      r = Math.floor(this.elapsedTime % 60)
        .toString()
        .padStart(2, '0');
    (c.innerText = `生存時間: ${o}:${r} | 獲得コイン: +${this.player.runCoins}🪙 | スキルツリーを開放して次へ挑め`),
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
    const c = Math.max(0, this.surviveDuration - this.elapsedTime),
      o = Math.floor(c / 60)
        .toString()
        .padStart(2, '0'),
      r = Math.floor(c % 60)
        .toString()
        .padStart(2, '0');
    (document.getElementById('game-timer').innerText = `${o}:${r}`),
      (document.getElementById('run-coins').innerText = e.runCoins.toLocaleString()),
      (document.getElementById('horde-count').innerText = this.arena.activeCount.toLocaleString());
  }
}
new ct({ canvas: 'game-canvas', maxInstances: 5e4, scaleMode: 2, scene: [yt] });
