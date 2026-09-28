import type { Scene, Sprite } from '@pluto-engine/core';

export class Player {
  sprite: Sprite;

  get x() {
    return this.sprite.x;
  }
  set x(v) {
    this.sprite.x = v;
  }
  get y() {
    return this.sprite.y;
  }
  set y(v) {
    this.sprite.y = v;
  }

  vx = 0;
  vy = 0;

  hp = 40;
  maxHp = 40;
  baseSpeed = 150;
  pickupRadius = 65;

  level = 1;
  exp = 0;
  expNext = 12;
  runCoins = 0;

  skills = new Map<string, number>();

  wandTimer = 0;
  orbitAngle = 0;
  orbitHitTimer = 0;
  garlicTimer = 0;
  lightningTimer = 0;

  constructor(scene: Scene, x: number, y: number) {
    this.sprite = scene.add.sprite(x, y, 'player');
    this.sprite.scale = 28;
    this.skills.set('magic_wand', 1);
  }

  recalculateStats(treeStats: any) {
    this.maxHp = 40 + (treeStats.maxHp || 0);
    this.hp = Math.min(this.hp, this.maxHp);
  }

  addExp(amt: number) {
    this.exp += amt;
    while (this.exp >= this.expNext) {
      this.exp -= this.expNext;
      this.level++;
      this.expNext = Math.round(this.expNext * 1.35 + 16);
      window.dispatchEvent(new CustomEvent('hardcore-levelup', { detail: { level: this.level } }));
    }
  }

  addCoin(amt: number) {
    this.runCoins += amt;
  }

  takeDamage(amt: number, treeStats: any) {
    const armor = treeStats.armor || 0;
    const finalDmg = Math.max(3, amt - armor);
    this.hp -= finalDmg;
    if (this.hp <= 0) {
      if (treeStats.revive && treeStats.revive > 0) {
        treeStats.revive--;
        this.hp = this.maxHp * 0.5;
      } else {
        this.hp = 0;
        window.dispatchEvent(new CustomEvent('hardcore-death'));
      }
    }
  }

  update(dt: number, inputDir: { x: number; y: number }, swarm: any, stats: any, scene: Scene) {
    if (stats.hpRegen > 0 && this.hp < this.maxHp) {
      this.hp = Math.min(this.maxHp, this.hp + stats.hpRegen * dt);
    }

    const speed = this.baseSpeed * (1 + (stats.moveSpeed || 0));
    this.vx = inputDir.x * speed;
    this.vy = inputDir.y * speed;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (inputDir.x > 0.1) this.sprite.setFlipX(false);
    else if (inputDir.x < -0.1) this.sprite.setFlipX(true);

    const atkMult = 1 + (stats.bulletDmg || 0);
    const cdFactor = Math.max(0.4, 1 - (stats.cooldown || 0));
    const areaScale = 1 + (stats.areaSize || 0);
    const knockMult = 1 + (stats.knockback || 0);
    const coinRate = stats.coinRate || 0;

    const wandLvl = this.skills.get('magic_wand') || 0;
    if (wandLvl > 0) {
      this.wandTimer += dt;
      const wandCd = Math.max(0.25, 0.6 - wandLvl * 0.05) * cdFactor;
      if (this.wandTimer >= wandCd) {
        this.wandTimer = 0;
        const target = swarm.findNearestEnemy(this.x, this.y, 380, scene);
        if (target !== -1) {
          const tx = swarm.scene.arena.posX[target];
          const ty = swarm.scene.arena.posY[target];
          const pCount = 1 + (stats.bonusProj || 0);
          for (let p = 0; p < pCount; p++) {
            const spread = (p - (pCount - 1) / 2) * 0.2;
            const ang = scene.math.Angle.Between(this.x, this.y, tx, ty) + spread;
            const vx = Math.cos(ang) * 400;
            const vy = Math.sin(ang) * 400;
            swarm.spawnProjectile(this.x, this.y, vx, vy, (18 + wandLvl * 6) * atkMult, 1);
          }
        }
      }
    }

    const orbitLvl = this.skills.get('holy_orbit') || 0;
    if (orbitLvl > 0) {
      this.orbitAngle += (2.2 + orbitLvl * 0.3) * dt;
      this.orbitHitTimer += dt;
      if (this.orbitHitTimer >= 0.25) {
        this.orbitHitTimer = 0;
        const numOrbs = Math.min(3, 1 + Math.floor(orbitLvl / 2));
        const orbDist = 48 * areaScale;
        for (let o = 0; o < numOrbs; o++) {
          const ang = this.orbitAngle + (o * Math.PI * 2) / numOrbs;
          const ox = this.x + Math.cos(ang) * orbDist;
          const oy = this.y + Math.sin(ang) * orbDist;
          swarm.applyAreaDamage(
            ox,
            oy,
            14 * areaScale,
            (10 + orbitLvl * 4) * atkMult,
            6 * knockMult,
            coinRate,
            scene,
          );
        }
      }
    }

    const garlicLvl = this.skills.get('garlic_aura') || 0;
    if (garlicLvl > 0) {
      this.garlicTimer += dt;
      if (this.garlicTimer >= 2.2 * cdFactor) {
        this.garlicTimer = 0;
        const radius = (42 + garlicLvl * 8) * areaScale;
        swarm.applyAreaDamage(
          this.x,
          this.y,
          radius,
          (14 + garlicLvl * 6) * atkMult,
          8 * knockMult,
          coinRate,
          scene,
        );
      }
    }

    const lightLvl = this.skills.get('lightning_strike') || 0;
    if (lightLvl > 0) {
      this.lightningTimer += dt;
      if (this.lightningTimer >= 2.0 * cdFactor) {
        this.lightningTimer = 0;
        const target = swarm.findNearestEnemy(this.x, this.y, 350, scene);
        if (target !== -1) {
          swarm.applyAreaDamage(
            swarm.scene.arena.posX[target],
            swarm.scene.arena.posY[target],
            38 * areaScale,
            (45 + lightLvl * 20) * atkMult,
            14 * knockMult,
            coinRate,
            scene,
          );
        }
      }
    }
  }
}

export class ContinuumFlowGrid {
  cols: number;
  rows: number;
  cellSize: number;
  width: number;
  height: number;
  size: number;
  dirX: Float32Array;
  dirY: Float32Array;
  density: Float32Array;
  pressure: Float32Array;
  originX = 0;
  originY = 0;

  constructor(cols = 96, rows = 96, cellSize = 24) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.width = cols * cellSize;
    this.height = rows * cellSize;
    this.size = cols * rows;
    this.dirX = new Float32Array(this.size);
    this.dirY = new Float32Array(this.size);
    this.density = new Float32Array(this.size);
    this.pressure = new Float32Array(this.size);
  }

  updatePlayerCenter(px: number, py: number) {
    this.originX = px - this.width * 0.5;
    this.originY = py - this.height * 0.5;
    const halfW = this.width * 0.5;
    const halfH = this.height * 0.5;
    for (let r = 0; r < this.rows; r++) {
      const cy = (r + 0.5) * this.cellSize;
      const dy = cy - halfH;
      const rowIdx = r * this.cols;
      for (let c = 0; c < this.cols; c++) {
        const cx = (c + 0.5) * this.cellSize;
        const dx = cx - halfW;
        const dist = Math.hypot(dx, dy) + 0.001;
        const idx = rowIdx + c;
        this.dirX[idx] = -dx / dist;
        this.dirY[idx] = -dy / dist;
      }
    }
  }

  solvePoissonUIC(iterations = 2) {
    const cols = this.cols;
    const rows = this.rows;
    const p = this.pressure;
    const rho = this.density;
    for (let iter = 0; iter < iterations; iter++) {
      for (let r = 1; r < rows - 1; r++) {
        const row = r * cols;
        for (let c = 1; c < cols - 1; c++) {
          const idx = row + c;
          const excess = Math.max(0, rho[idx] - 3.5);
          p[idx] = (p[idx - 1] + p[idx + 1] + p[idx - cols] + p[idx + cols] + excess * 1.5) * 0.25;
        }
      }
    }
  }
}

export class SwarmSystem {
  scene: Scene;
  maxEnemies: number;

  vx: Float32Array;
  vy: Float32Array;
  hp: Float32Array;
  maxHp: Float32Array;
  spd: Float32Array;
  type: Uint8Array;
  knockResist: Float32Array;
  atkPower: Float32Array;

  maxDrops = 15000;
  dropCount = 0;
  dx: Float32Array;
  dy: Float32Array;
  dtype: Uint8Array;
  dval: Float32Array;
  dsprite: Sprite[];

  maxProjectiles = 600;
  projCount = 0;
  px: Float32Array;
  py: Float32Array;
  pvx: Float32Array;
  pvy: Float32Array;
  pdmg: Float32Array;
  plife: Float32Array;
  ppierce: Int8Array;
  psprite: Sprite[];

  constructor(scene: Scene, maxEnemies = 40000) {
    this.scene = scene;
    this.maxEnemies = maxEnemies;

    this.vx = new Float32Array(maxEnemies);
    this.vy = new Float32Array(maxEnemies);
    this.hp = new Float32Array(maxEnemies);
    this.maxHp = new Float32Array(maxEnemies);
    this.spd = new Float32Array(maxEnemies);
    this.type = new Uint8Array(maxEnemies);
    this.knockResist = new Float32Array(maxEnemies);
    this.atkPower = new Float32Array(maxEnemies);

    this.dx = new Float32Array(this.maxDrops);
    this.dy = new Float32Array(this.maxDrops);
    this.dtype = new Uint8Array(this.maxDrops);
    this.dval = new Float32Array(this.maxDrops);
    this.dsprite = new Array(this.maxDrops);

    this.px = new Float32Array(this.maxProjectiles);
    this.py = new Float32Array(this.maxProjectiles);
    this.pvx = new Float32Array(this.maxProjectiles);
    this.pvy = new Float32Array(this.maxProjectiles);
    this.pdmg = new Float32Array(this.maxProjectiles);
    this.plife = new Float32Array(this.maxProjectiles);
    this.ppierce = new Int8Array(this.maxProjectiles);
    this.psprite = new Array(this.maxProjectiles);
  }

  spawn(
    x: number,
    y: number,
    type = 0,
    hp = 24,
    speed = 55,
    knockResist = 0,
    atk = 22,
    scale = 20,
  ) {
    const sprite = this.scene.add.sprite(x, y, 'enemy');
    sprite.scale = scale;
    const id = sprite.id;
    if (id === -1) return;

    sprite.setTint(type);
    sprite.setFlipX(false);

    this.vx[id] = 0;
    this.vy[id] = 0;
    this.hp[id] = hp;
    this.maxHp[id] = hp;
    this.spd[id] = speed;
    this.type[id] = type;
    this.knockResist[id] = knockResist;
    this.atkPower[id] = atk;
  }

  spawnDrop(x: number, y: number, type: number, val: number) {
    if (this.dropCount >= this.maxDrops) return;
    const i = this.dropCount++;
    this.dx[i] = x;
    this.dy[i] = y;
    this.dtype[i] = type;
    this.dval[i] = val;
    const sprite = this.scene.add.sprite(x, y, 'drop');
    sprite.scale = 14;
    this.dsprite[i] = sprite;
  }

  spawnProjectile(x: number, y: number, vx: number, vy: number, dmg: number, pierce = 1) {
    if (this.projCount >= this.maxProjectiles) return;
    const i = this.projCount++;
    this.px[i] = x;
    this.py[i] = y;
    this.pvx[i] = vx;
    this.pvy[i] = vy;
    this.pdmg[i] = dmg;
    this.plife[i] = 1.5;
    this.ppierce[i] = pierce;
    const sprite = this.scene.add.sprite(x, y, 'projectile');
    sprite.scale = 12;
    this.psprite[i] = sprite;
  }

  kill(id: number, coinRateBonus = 0, scene?: Scene) {
    const s = scene || this.scene;
    const isBoss = this.type[id] === 3;
    const x = s.arena.posX[id];
    const y = s.arena.posY[id];
    if (isBoss) {
      for (let c = 0; c < 5; c++) this.spawnDrop(x, y, 1, 2);
      for (let e = 0; e < 15; e++) this.spawnDrop(x, y, 0, 15);
    } else {
      const coinChance = 0.08 + coinRateBonus;
      if (Math.random() < coinChance) {
        this.spawnDrop(x, y, 1, 1);
      } else {
        this.spawnDrop(x, y, 0, 4 + this.type[id] * 2);
      }
    }
    s.arena.free(id);
  }

  update(dt: number, player: Player, flow: ContinuumFlowGrid, stats: any) {
    const px = player.x;
    const py = player.y;

    for (let i = 0; i < this.projCount; i++) {
      this.px[i] += this.pvx[i] * dt;
      this.py[i] += this.pvy[i] * dt;
      this.psprite[i].x = this.px[i];
      this.psprite[i].y = this.py[i];
      this.plife[i] -= dt;

      const projX = this.px[i];
      const projY = this.py[i];
      const dmg = this.pdmg[i];

      for (let e = 0; e < this.scene.arena.capacity; e++) {
        if (this.scene.arena.idToIndex[e] < 0) continue;
        const dx = this.scene.arena.posX[e] - projX;
        const dy = this.scene.arena.posY[e] - projY;
        const hitRadius = this.scene.arena.scale[e] * 0.5 + 6;
        if (dx * dx + dy * dy < hitRadius * hitRadius) {
          this.hp[e] -= dmg;
          const kForce = 8 * (1.0 - this.knockResist[e]);
          this.scene.arena.posX[e] += (dx || 1) * 0.1 * kForce;
          this.scene.arena.posY[e] += (dy || 1) * 0.1 * kForce;

          if (this.hp[e] <= 0) {
            this.kill(e, stats.coinRate || 0);
          }
          this.ppierce[i]--;
          if (this.ppierce[i] <= 0) {
            this.plife[i] = 0;
            break;
          }
        }
      }

      if (this.plife[i] <= 0) {
        this.psprite[i].destroy();
        const lastP = --this.projCount;
        if (i !== lastP) {
          this.px[i] = this.px[lastP];
          this.py[i] = this.py[lastP];
          this.pvx[i] = this.pvx[lastP];
          this.pvy[i] = this.pvy[lastP];
          this.pdmg[i] = this.pdmg[lastP];
          this.plife[i] = this.plife[lastP];
          this.ppierce[i] = this.ppierce[lastP];
          this.psprite[i] = this.psprite[lastP];
        }
        i--;
      }
    }

    flow.density.fill(0);
    const cols = flow.cols;
    const rows = flow.rows;
    const cs = flow.cellSize;
    const ox = flow.originX;
    const oy = flow.originY;

    for (let i = 0; i < this.scene.arena.capacity; i++) {
      if (this.scene.arena.idToIndex[i] < 0) continue;
      const gx = Math.floor((this.scene.arena.posX[i] - ox) / cs);
      const gy = Math.floor((this.scene.arena.posY[i] - oy) / cs);
      if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
        flow.density[gy * cols + gx] += 1.0;
      }
    }
    flow.solvePoissonUIC();

    const pRadius = 12;

    this.scene.spatialHash.clear();

    for (let i = 0; i < this.scene.arena.capacity; i++) {
      if (this.scene.arena.idToIndex[i] < 0) continue;
      const ex = this.scene.arena.posX[i];
      const ey = this.scene.arena.posY[i];
      const gx = Math.floor((ex - ox) / cs);
      const gy = Math.floor((ey - oy) / cs);
      let steerX = 0,
        steerY = 0;

      if (gx >= 1 && gx < cols - 1 && gy >= 1 && gy < rows - 1) {
        const idx = gy * cols + gx;
        const gradPx = (flow.pressure[idx + 1] - flow.pressure[idx - 1]) * 0.5;
        const gradPy = (flow.pressure[idx + cols] - flow.pressure[idx - cols]) * 0.5;
        steerX = flow.dirX[idx] - gradPx * 0.7;
        steerY = flow.dirY[idx] - gradPy * 0.7;
      } else {
        const d = this.scene.math.Distance.Between(ex, ey, px, py) + 0.001;
        const dx = px - ex;
        const dy = py - ey;
        steerX = dx / d;
        steerY = dy / d;
      }

      const steerLen = Math.hypot(steerX, steerY);
      if (steerLen > 0.001) {
        steerX /= steerLen;
        steerY /= steerLen;
      }

      const targetSpd = this.spd[i];
      this.vx[i] += (steerX * targetSpd - this.vx[i]) * 8.0 * dt;
      this.vy[i] += (steerY * targetSpd - this.vy[i]) * 8.0 * dt;
      this.scene.arena.posX[i] += this.vx[i] * dt;
      this.scene.arena.posY[i] += this.vy[i] * dt;
      this.scene.spatialHash.addEntity(i, this.scene.arena.posX[i], this.scene.arena.posY[i]);

      if (this.vx[i] > 2) this.scene.arena.facing[i] = 1.0;
      else if (this.vx[i] < -2) this.scene.arena.facing[i] = -1.0;

      const pdx = this.scene.arena.posX[i] - px;
      const pdy = this.scene.arena.posY[i] - py;
      const pDist = Math.hypot(pdx, pdy);
      const reach = pRadius + this.scene.arena.scale[i] * 0.42;

      if (pDist < reach) {
        player.takeDamage(this.atkPower[i] * dt, stats);
        // ダメージを受けた時に画面を少し揺らす
        this.scene.camera.shake(3, 0.1);
        const pen = reach - pDist;
        const nx = pdx / (pDist || 1);
        const ny = pdy / (pDist || 1);
        this.scene.arena.posX[i] += nx * pen * 0.4;
        this.scene.arena.posY[i] += ny * pen * 0.4;
      }
    }

    this.scene.spatialHash.build();

    const outArray = new Uint32Array(32);
    for (let i = 0; i < this.scene.arena.capacity; i++) {
      if (this.scene.arena.idToIndex[i] < 0) continue;
      const eRadius = this.scene.arena.scale[i] * 0.42;
      const count = this.scene.spatialHash.query(
        this.scene.arena.posX[i],
        this.scene.arena.posY[i],
        eRadius * 2,
        outArray,
      );
      for (let j = 0; j < count; j++) {
        const other = outArray[j];
        if (other > i && this.scene.arena.idToIndex[other] >= 0) {
          const oRadius = this.scene.arena.scale[other] * 0.42;
          const targetDist = eRadius + oRadius;
          const dx = this.scene.arena.posX[other] - this.scene.arena.posX[i];
          const dy = this.scene.arena.posY[other] - this.scene.arena.posY[i];
          const d2 = dx * dx + dy * dy;
          if (d2 < targetDist * targetDist && d2 > 0.0001) {
            const dist = Math.sqrt(d2);
            const overlap = (targetDist - dist) * 0.45;
            const nx = dx / dist;
            const ny = dy / dist;
            this.scene.arena.posX[i] -= nx * overlap * 0.5;
            this.scene.arena.posY[i] -= ny * overlap * 0.5;
            this.scene.arena.posX[other] += nx * overlap * 0.5;
            this.scene.arena.posY[other] += ny * overlap * 0.5;
          }
        }
      }
    }

    const pRad = player.pickupRadius * (1 + (stats.pickupRadius || 0));
    for (let i = 0; i < this.dropCount; i++) {
      const dx = px - this.dx[i];
      const dy = py - this.dy[i];
      const dist = Math.hypot(dx, dy);

      if (dist < pRad) {
        const pull = (1.0 - dist / pRad) * 440 + 130;
        this.dx[i] += (dx / dist) * pull * dt;
        this.dy[i] += (dy / dist) * pull * dt;
        this.dsprite[i].x = this.dx[i];
        this.dsprite[i].y = this.dy[i];

        if (dist < 20) {
          if (this.dtype[i] === 0) {
            player.addExp(this.dval[i] * (1 + (stats.expGain || 0)));
          } else {
            player.addCoin(this.dval[i]);
          }
          this.dsprite[i].destroy();
          const lastD = --this.dropCount;
          if (i !== lastD) {
            this.dx[i] = this.dx[lastD];
            this.dy[i] = this.dy[lastD];
            this.dtype[i] = this.dtype[lastD];
            this.dval[i] = this.dval[lastD];
            this.dsprite[i] = this.dsprite[lastD];
          }
          i--;
        }
      }
    }
  }

  applyAreaDamage(
    x: number,
    y: number,
    radius: number,
    dmg: number,
    knockback = 0,
    coinRate = 0,
    scene: Scene,
  ) {
    const r2 = radius * radius;
    for (let i = 0; i < scene.arena.capacity; i++) {
      if (scene.arena.idToIndex[i] < 0) continue;
      const dx = scene.arena.posX[i] - x;
      const dy = scene.arena.posY[i] - y;
      const d2 = dx * dx + dy * dy;
      if (d2 < r2) {
        this.hp[i] -= dmg;
        if (knockback > 0) {
          const actualKnock = knockback * (1.0 - this.knockResist[i]);
          if (actualKnock > 0.4) {
            const d = Math.sqrt(d2) || 1;
            scene.arena.posX[i] += (dx / d) * actualKnock;
            scene.arena.posY[i] += (dy / d) * actualKnock;
          }
        }
        if (this.hp[i] <= 0) {
          this.kill(i, coinRate, scene);
        }
      }
    }
  }

  findNearestEnemy(x: number, y: number, maxDist = 380, scene: Scene) {
    let nearestIdx = -1;
    let minDist2 = maxDist * maxDist;
    for (let i = 0; i < scene.arena.capacity; i++) {
      if (scene.arena.idToIndex[i] < 0) continue;
      const dx = scene.arena.posX[i] - x;
      const dy = scene.arena.posY[i] - y;
      const d2 = dx * dx + dy * dy;
      if (d2 < minDist2) {
        minDist2 = d2;
        nearestIdx = i;
      }
    }
    return nearestIdx;
  }
}
