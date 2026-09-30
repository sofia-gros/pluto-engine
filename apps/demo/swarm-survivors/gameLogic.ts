import type { Scene, Sprite } from '@pluto-engine/core';
import { XPBDSolver, type XPBDParticles } from '@pluto-engine/xpbd';
import { ContinuumCrowds } from '@pluto-engine/continuum';

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
    this.sprite = scene.add.sprite(x, y, 'chars');
    this.sprite.play('walking_front');
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
    
    if (inputDir.x > 0.1) {
      this.sprite.setFlipX(false);
      this.sprite.play('walking_side', true);
    } else if (inputDir.x < -0.1) {
      this.sprite.setFlipX(true);
      this.sprite.play('walking_side', true);
    } else if (inputDir.y < -0.1) {
      this.sprite.play('walking_back', true);
    } else if (inputDir.y > 0.1) {
      this.sprite.play('walking_front', true);
    } else {
      // If stopped
      this.sprite.play('idle_front', true);
    }

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
        // findNearestEnemy は ID を返すため、位置参照には密添字へ変換します。
        const targetId = swarm.findNearestEnemy(this.x, this.y, 380, scene);
        const targetIdx = targetId === -1 ? -1 : scene.arena.idToIndex[targetId];
        if (targetIdx >= 0) {
          const tx = scene.arena.posX[targetIdx];
          const ty = scene.arena.posY[targetIdx];
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
        // 戻り値は ID。位置は密添字で参照します。
        const strikeId = swarm.findNearestEnemy(this.x, this.y, 350, scene);
        const strikeIdx = strikeId === -1 ? -1 : scene.arena.idToIndex[strikeId];
        if (strikeIdx >= 0) {
          swarm.applyAreaDamage(
            scene.arena.posX[strikeIdx],
            scene.arena.posY[strikeIdx],
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

/**
 * プレイヤー中心で追従する Continuity 群集のフロー場。
 *
 * アルゴリズムの実体は同梱パッケージ `@pluto-engine/continuum` の
 * ContinuumCrowds です。以前はこのデモ内に手書きの複製を持っており、
 * パッケージ側とアルゴリズム・定数が食い違っていました。
 * ここではワールド座標とグリッド座標の変換だけを担当します。
 */
export class ContinuumFlowGrid {
  /** ContinuumCrowds 本体 */
  private readonly crowd: ContinuumCrowds;

  cols: number;
  rows: number;
  cellSize: number;
  invCellSize: number;
  width: number;
  height: number;
  size: number;

  /** 密度場 (Compatible: 呼び出し側が直接 fill / 加算する) */
  density: Float32Array;
  pressure: Float32Array;
  /** 一括計算済みの速度場 */
  precomputedVx: Float32Array;
  precomputedVy: Float32Array;

  /** グリッド原点のワールド座標 (プレイヤー中心で動く) */
  originX = 0;
  originY = 0;

  private readonly _dirX: Float32Array;
  private readonly _dirY: Float32Array;

  constructor(cols = 96, rows = 96, cellSize = 24) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.invCellSize = 1.0 / cellSize;
    this.width = cols * cellSize;
    this.height = rows * cellSize;
    this.size = cols * rows;

    this.crowd = new ContinuumCrowds(cols, rows, cellSize, {
      targetDensity: 3.5,
      pressureStiffness: 1.5,
    });

    this.density = this.crowd.density;
    this.pressure = this.crowd.pressure;
    this.precomputedVx = this.crowd.fieldVx;
    this.precomputedVy = this.crowd.fieldVy;

    this._dirX = new Float32Array(this.size);
    this._dirY = new Float32Array(this.size);
  }

  /**
   * プレイヤー位置を中心にグリッド原点を移動し、
   * 全セルを「プレイヤーへ向かう方向」で埋めます。
   */
  updatePlayerCenter(px: number, py: number): void {
    this.originX = px - this.width * 0.5;
    this.originY = py - this.height * 0.5;

    const halfW = this.width * 0.5;
    const halfH = this.height * 0.5;
    for (let r = 0; r < this.rows; r++) {
      const cy = (r + 0.5) * this.cellSize;
      const dy = cy - halfH;
      const row = r * this.cols;
      for (let c = 0; c < this.cols; c++) {
        const cx = (c + 0.5) * this.cellSize;
        const dx = cx - halfW;
        const d2 = dx * dx + dy * dy;
        const invDist = 1.0 / (Math.sqrt(d2) + 0.001);
        this._dirX[row + c] = -dx * invDist;
        this._dirY[row + c] = -dy * invDist;
      }
    }

    // 目標方向を ContinuumCrowds へ渡す
    for (let i = 0; i < this.size; i++) {
      this.crowd.setTargetDirectionRaw(i, this._dirX[i], this._dirY[i]);
    }
  }

  /**
   * UIC 圧力を解きます。実時間では 2 反復が目安です。
   */
  solvePoissonUIC(iterations = 2): void {
    this.crowd.computeDivergence();
    this.crowd.solvePressure(iterations);
  }

  /**
   * 目標方向と圧力勾配を合成して速度場を一括計算します。
   */
  precomputeVelocityField(speed = 1.0, pressureWeight = 0.7): void {
    this.crowd.bakeVelocityField(speed, pressureWeight, false);
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

  /** XPBD の接触ペア (i, j) を詰めた配列。上限は maxEnemies * 12。 */
  private _overlapPairs: Int32Array;
  /** Morton 近傍クエリの書き込み先 */
  private _overlapQuery: Uint32Array;
  /** XPBD へ渡す SoA 粒子データ */
  private _overlapParticles: XPBDParticles;

  /**
   * プレイヤーのアリーナ ID。
   *
   * プレイヤーは敵と同じアリーナのインスタンスを 1 つ占めています。
   * 敵だけを前提とした走査 (弾の衝突・範囲ダメージ・最近傍探索) では
   * プレイヤーを除外しないと、プレイヤーが自傷したり
   * 敵の弾で解放されてハンドルだけ宙に浮いたりします。
   * update() の先頭で毎回取り直します。
   */
  playerId = -1;

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

    // XPBD 用の事前確保バッファ。毎フレーム new しません。
    // posX / posY はアリーナの配列を直接参照するため二重管理しません。
    this._overlapPairs = new Int32Array(this.maxEnemies * 12);
    this._overlapQuery = new Uint32Array(64);
    this._overlapParticles = {
      count: 0,
      posX: this.scene.arena.posX,
      posY: this.scene.arena.posY,
      prevX: new Float32Array(this.maxEnemies),
      prevY: new Float32Array(this.maxEnemies),
      velX: new Float32Array(this.maxEnemies),
      velY: new Float32Array(this.maxEnemies),
      radii: new Float32Array(this.maxEnemies),
      invMasses: new Float32Array(this.maxEnemies),
    };
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
    const sprite = this.scene.add.sprite(x, y, 'chars');
    sprite.scale = scale;
    const id = sprite.id;
    if (id === -1) return;

    if (type === 1) {
       sprite.play('walking_other_side');
    } else if (type === 2) {
       sprite.play('walking_back');
    } else if (type === 3) {
       sprite.play('walking_front');
       sprite.setTintFill(0xffcccc);
    } else {
       sprite.play('walking_front');
    }
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
    const sprite = this.scene.add.sprite(x, y, 'chars');
    sprite.setFrame(1);
    if (type === 1) {
       sprite.setTintFill(0xffff00);
    } else {
       sprite.setTintFill(0x00aaff);
    }
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
    const sprite = this.scene.add.sprite(x, y, 'chars');
    sprite.setFrame(0);
    sprite.setTintFill(0xff6666);
    sprite.scale = 12;
    this.psprite[i] = sprite;
  }

  /**
   * 敵を倒します。引数はアリーナの ID です。
   */
  kill(id: number, coinRateBonus = 0, scene?: Scene) {
    const s = scene || this.scene;
    const isBoss = this.type[id] === 3;
    // 位置は密添字で管理しているため、ID から変換します。
    const idx = s.arena.idToIndex[id];
    if (idx < 0) return;
    const x = s.arena.posX[idx];
    const y = s.arena.posY[idx];
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
    // プレイヤーの ID を毎回取り直します (restartGame で再生成されるため)。
    this.playerId = player.sprite.id;

    for (let i = 0; i < this.projCount; i++) {
      this.px[i] += this.pvx[i] * dt;
      this.py[i] += this.pvy[i] * dt;
      this.psprite[i].x = this.px[i];
      this.psprite[i].y = this.py[i];
      this.plife[i] -= dt;

      const projX = this.px[i];
      const projY = this.py[i];
      const dmg = this.pdmg[i];

      // 弾の当たり判定。e はアリーナの ID なので、位置は密添字へ変換します。
      for (let e = 0; e < this.scene.arena.capacity; e++) {
        if (e === this.playerId) continue;
        const ei = this.scene.arena.idToIndex[e];
        if (ei < 0) continue;
        const dx = this.scene.arena.posX[ei] - projX;
        const dy = this.scene.arena.posY[ei] - projY;
        const hitRadius = this.scene.arena.scale[ei] * 0.5 + 6;
        if (dx * dx + dy * dy < hitRadius * hitRadius) {
          this.hp[e] -= dmg;
          const kForce = 8 * (1.0 - this.knockResist[e]);
          // 位置は密添字。方向が不明でも 0 除算しないよう微小量を足します。
          const invLen = 1.0 / (Math.sqrt(dx * dx + dy * dy) + 1e-4);
          this.scene.arena.posX[ei] += dx * invLen * 0.1 * kForce;
          this.scene.arena.posY[ei] += dy * invLen * 0.1 * kForce;

          if (this.hp[e] <= 0) {
            this.kill(e, stats.coinRate || 0);
            // kill() は swap-remove で密添字を移すため、
            // 続く反復で ei が無効になります。ここでは弾を処理終了します。
            break;
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
    const ox = flow.originX;
    const oy = flow.originY;
    const invCs = flow.invCellSize;
    const activeCount = this.scene.arena.activeCount;

    for (let i = 0; i < activeCount; i++) {
      const gx = ((this.scene.arena.posX[i] - ox) * invCs) | 0;
      const gy = ((this.scene.arena.posY[i] - oy) * invCs) | 0;
      if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
        flow.density[gy * cols + gx] += 1.0;
      }
    }
    flow.solvePoissonUIC();
    flow.precomputeVelocityField();

    const pRadius = 12;
    // プレイヤーはアリーナのインスタンスを 1 つ占めています。
    // このパスは敵の衝突判定なので、自分自身とは判定してはいけません。
    // 放任すると毎フレーム自分へ接触ダメージが入り、即死します。
    const pIdx = player.sprite.index;
    this.scene.spatialHash.clear();

    const pVx = flow.precomputedVx;
    const pVy = flow.precomputedVy;
    const posX = this.scene.arena.posX;
    const posY = this.scene.arena.posY;
    const facing = this.scene.arena.facing;
    const scale = this.scene.arena.scale;
    const vx = this.vx;
    const vy = this.vy;
    const spd = this.spd;

    // 以降のパスでは 2 つの添字空間を取り違えないようにします。
    //   i  : アリーナの密添字 (0..activeCount)。posX / posY / scale / facing のキー
    //   id : アリーナの ID (再利用される)。vx / vy / spd / hp などのキー
    // free() は swap-remove を行うため、解放が 1 度でも起きると
    // ID と密添字は一致しなくなります。
    const indexToId = this.scene.arena.indexToId;

    // =========================================================================
    // Pass 1: Flow Steering (Lerp of Lerp 双線形補間 & 速度更新)
    // =========================================================================
    for (let i = 0; i < activeCount; i++) {
      const id = indexToId[i];
      const ex = posX[i];
      const ey = posY[i];
      const lx = ex - ox;
      const ly = ey - oy;
      const gx = lx * invCs;
      const gy = ly * invCs;
      const ix = gx | 0;
      const iy = gy | 0;
      let steerX = 0;
      let steerY = 0;

      if (ix >= 1 && ix < cols - 2 && iy >= 1 && iy < rows - 2) {
        // Lerp of Lerp (FMA 最適化: 乗算3回・加算3回)
        const fx = gx - ix;
        const fy = gy - iy;
        const idx00 = iy * cols + ix;
        const idx01 = idx00 + cols;

        const vx00 = pVx[idx00];
        const topVx = vx00 + fx * (pVx[idx00 + 1] - vx00);
        const vx01 = pVx[idx01];
        const botVx = vx01 + fx * (pVx[idx01 + 1] - vx01);
        steerX = topVx + fy * (botVx - topVx);

        const vy00 = pVy[idx00];
        const topVy = vy00 + fx * (pVy[idx00 + 1] - vy00);
        const vy01 = pVy[idx01];
        const botVy = vy01 + fx * (pVy[idx01 + 1] - vy01);
        steerY = topVy + fy * (botVy - topVy);
      } else {
        const dx = px - ex;
        const dy = py - ey;
        const d2 = dx * dx + dy * dy;
        const invD = 1.0 / (Math.sqrt(d2) + 0.001);
        steerX = dx * invD;
        steerY = dy * invD;
      }

      // 速度と速度特性は ID 添字で管理しています。
      const targetSpd = spd[id];
      vx[id] += (steerX * targetSpd - vx[id]) * 8.0 * dt;
      vy[id] += (steerY * targetSpd - vy[id]) * 8.0 * dt;
    }

    // =========================================================================
    // Pass 2: 座標積分 (Position Integration - V8 自動 SIMD アンローリング)
    // =========================================================================
    for (let i = 0; i < activeCount; i++) {
      const id = indexToId[i];
      posX[i] += vx[id] * dt;
      posY[i] += vy[id] * dt;
    }

    // =========================================================================
    // Pass 3: 向き判定 & Spatial Hash 登録
    // =========================================================================
    for (let i = 0; i < activeCount; i++) {
      const id = indexToId[i];
      if (vx[id] > 2) facing[i] = 1.0;
      else if (vx[id] < -2) facing[i] = -1.0;
      // 空間ハッシュは ID で登録します。後続の Pass 5 も ID 前提で動きます。
      this.scene.spatialHash.addEntity(id, posX[i], posY[i]);
    }

    // =========================================================================
    // Pass 4: プレイヤー近接・衝突判定 (AABB 高速枝刈り: 99.9% スキップ)
    // =========================================================================
    const maxReach = pRadius + 24; // 最大敵半径考慮
    const minX = px - maxReach;
    const maxX = px + maxReach;
    const minY = py - maxReach;
    const maxY = py + maxReach;

    for (let i = 0; i < activeCount; i++) {
      if (i === pIdx) continue;
      const id = indexToId[i];
      const ex = posX[i];
      const ey = posY[i];

      // AABB 枝刈り (四則演算のみ)
      if (ex >= minX && ex <= maxX && ey >= minY && ey <= maxY) {
        const pdx = ex - px;
        const pdy = ey - py;
        const pDist2 = pdx * pdx + pdy * pdy;
        const reach = pRadius + scale[i] * 0.42;

        if (pDist2 < reach * reach) {
          player.takeDamage(this.atkPower[id] * dt, stats);
          this.scene.camera.shake(3, 0.1);
          const pDist = Math.sqrt(pDist2);
          const pen = reach - pDist;
          const invPdist = 1.0 / (pDist || 1);
          const nx = pdx * invPdist;
          const ny = pdy * invPdist;
          posX[i] += nx * pen * 0.4;
          posY[i] += ny * pen * 0.4;
        }
      }
    }

    this.scene.spatialHash.build();

    // -------------------------------------------------------------------------
    // Pass 5: XPBD による群集の重なり緩和
    // -------------------------------------------------------------------------
    // 近傍リストは Morton 空間ハッシュから作ります (O(n) 構築)。
    // 位置の押し戻しは XPBD のサブステップで解くため、
    // 以前の手書きの対称押し出しより収束が速く、密集時も貫通しにくくなります。
    const pairs = this._overlapPairs;
    const scratch = this._overlapQuery;
    let pairCount = 0;

    for (let i = 0; i < activeCount && pairCount * 2 < pairs.length - 2; i++) {
      const eRadius = scale[i] * 0.42;
      const count = this.scene.spatialHash.query(posX[i], posY[i], eRadius * 2, scratch);
      for (let j = 0; j < count; j++) {
        const otherId = scratch[j];
        // 空間ハッシュは ID を返すため、密添字へ変換して比較します。
        const other = this.scene.arena.idToIndex[otherId];
        // 各ペアを 1 度だけ処理する
        if (other < 0 || other <= i) continue;
        pairs[pairCount * 2] = i;
        pairs[pairCount * 2 + 1] = other;
        pairCount++;
        if (pairCount * 2 >= pairs.length - 2) break;
      }
    }

    if (pairCount > 0) {
      const particles = this._overlapParticles;
      particles.count = activeCount;
      // 半径は SoA から読み戻すため、ここへ写す (毎フレームの割り当ては無い)
      for (let i = 0; i < activeCount; i++) {
        particles.radii[i] = scale[i] * 0.42;
        // プレイヤーは群集の押し出し対象ではありません。
        // 動かすと操作感が悪く、かつ毎フレーム位置が上書きされます。
        particles.invMasses[i] = i === pIdx ? 0.0 : 1.0;
      }
      // posX / posY はアリーナの配列を直接参照するため、鍵は密添字です。
      XPBDSolver.resolveOverlaps(particles, dt, {
        pairs,
        pairCount,
        substeps: 2,
        compliance: 0.0005,
      });
    }

    const pRad = player.pickupRadius * (1 + (stats.pickupRadius || 0));
    for (let i = 0; i < this.dropCount; i++) {
      const dx = px - this.dx[i];
      const dy = py - this.dy[i];
      const dist = Math.hypot(dx, dy);

      if (dist < pRad) {
        const pull = (1.0 - dist / pRad) * 440 + 130;
        // アイテムがプレイヤーと完全に重なると dist が 0 になり、
        // 0/0 で NaN 发生后アリーナ全体が汚染されます。
        // 向きが決められないので 1e-4 を足して有限値に収めます。
        const invDist = 1.0 / (dist + 1e-4);
        this.dx[i] += dx * invDist * pull * dt;
        this.dy[i] += dy * invDist * pull * dt;
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
    // i はアリーナの ID、ii は密添字です。位置参照は密添字側だけを使います。
    for (let i = 0; i < scene.arena.capacity; i++) {
      if (i === this.playerId) continue;
      const ii = scene.arena.idToIndex[i];
      if (ii < 0) continue;
      const dx = scene.arena.posX[ii] - x;
      const dy = scene.arena.posY[ii] - y;
      const d2 = dx * dx + dy * dy;
      if (d2 < r2) {
        this.hp[i] -= dmg;
        if (knockback > 0) {
          const actualKnock = knockback * (1.0 - this.knockResist[i]);
          if (actualKnock > 0.4) {
            const invLen = 1.0 / (Math.sqrt(d2) + 1e-4);
            scene.arena.posX[ii] += dx * invLen * actualKnock;
            scene.arena.posY[ii] += dy * invLen * actualKnock;
          }
        }
        if (this.hp[i] <= 0) {
          // kill() は swap-remove で密添字を移すため、以降の反復 Affected します。
          this.kill(i, coinRate, scene);
          break;
        }
      }
    }
  }

  /**
   * 指定座標に最も近い敵の ID を返します。該当なしは -1。
   * 戻り値は ID であり、位置参照には `arena.idToIndex` が必要です。
   */
  findNearestEnemy(x: number, y: number, maxDist = 380, scene: Scene) {
    let nearestId = -1;
    let minDist2 = maxDist * maxDist;
    for (let i = 0; i < scene.arena.capacity; i++) {
      if (i === this.playerId) continue;
      const ii = scene.arena.idToIndex[i];
      if (ii < 0) continue;
      const dx = scene.arena.posX[ii] - x;
      const dy = scene.arena.posY[ii] - y;
      const d2 = dx * dx + dy * dy;
      if (d2 < minDist2) {
        minDist2 = d2;
        nearestId = i;
      }
    }
    return nearestId;
  }
}
