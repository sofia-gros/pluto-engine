var L = Object.defineProperty;
var q = (l, e, s) =>
  e in l ? L(l, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : (l[e] = s);
var n = (l, e, s) => q(l, typeof e != 'symbol' ? e + '' : e, s);
import { P as U, S as V } from './index-C8vtGklY.js';
class W {
  constructor() {
    n(this, 'ctx', null);
    n(this, 'enabled', !0);
  }
  init() {
    if (!this.ctx && typeof window < 'u') {
      const e = window.AudioContext || window.webkitAudioContext;
      e && (this.ctx = new e());
    }
    this.ctx && this.ctx.state === 'suspended' && this.ctx.resume();
  }
  playSwordSlash() {
    if (!this.enabled || (this.init(), !this.ctx)) return;
    const e = this.ctx.currentTime,
      s = this.ctx.createOscillator(),
      i = this.ctx.createGain();
    (s.type = 'triangle'),
      s.frequency.setValueAtTime(450, e),
      s.frequency.exponentialRampToValueAtTime(80, e + 0.12),
      i.gain.setValueAtTime(0.3, e),
      i.gain.exponentialRampToValueAtTime(0.01, e + 0.12),
      s.connect(i),
      i.connect(this.ctx.destination),
      s.start(e),
      s.stop(e + 0.12);
  }
  playFireball() {
    if (!this.enabled || (this.init(), !this.ctx)) return;
    const e = this.ctx.currentTime,
      s = this.ctx.createOscillator(),
      i = this.ctx.createGain();
    (s.type = 'sawtooth'),
      s.frequency.setValueAtTime(220, e),
      s.frequency.linearRampToValueAtTime(880, e + 0.08),
      s.frequency.exponentialRampToValueAtTime(110, e + 0.22),
      i.gain.setValueAtTime(0.25, e),
      i.gain.exponentialRampToValueAtTime(0.01, e + 0.22),
      s.connect(i),
      i.connect(this.ctx.destination),
      s.start(e),
      s.stop(e + 0.22);
  }
  playHit() {
    if (!this.enabled || (this.init(), !this.ctx)) return;
    const e = this.ctx.currentTime,
      s = this.ctx.createOscillator(),
      i = this.ctx.createGain();
    (s.type = 'square'),
      s.frequency.setValueAtTime(180, e),
      s.frequency.exponentialRampToValueAtTime(40, e + 0.08),
      i.gain.setValueAtTime(0.25, e),
      i.gain.exponentialRampToValueAtTime(0.01, e + 0.08),
      s.connect(i),
      i.connect(this.ctx.destination),
      s.start(e),
      s.stop(e + 0.08);
  }
  playCoin() {
    if (!this.enabled || (this.init(), !this.ctx)) return;
    const e = this.ctx.currentTime,
      s = this.ctx.createOscillator(),
      i = this.ctx.createGain();
    (s.type = 'sine'),
      s.frequency.setValueAtTime(987.77, e),
      s.frequency.setValueAtTime(1318.51, e + 0.06),
      i.gain.setValueAtTime(0.2, e),
      i.gain.setValueAtTime(0.2, e + 0.06),
      i.gain.exponentialRampToValueAtTime(0.01, e + 0.2),
      s.connect(i),
      i.connect(this.ctx.destination),
      s.start(e),
      s.stop(e + 0.2);
  }
  playPotion() {
    if (!this.enabled || (this.init(), !this.ctx)) return;
    const e = this.ctx.currentTime,
      s = this.ctx.createOscillator(),
      i = this.ctx.createGain();
    (s.type = 'sine'),
      s.frequency.setValueAtTime(440, e),
      s.frequency.exponentialRampToValueAtTime(880, e + 0.15),
      i.gain.setValueAtTime(0.2, e),
      i.gain.exponentialRampToValueAtTime(0.01, e + 0.2),
      s.connect(i),
      i.connect(this.ctx.destination),
      s.start(e),
      s.stop(e + 0.2);
  }
  playDialogBeep() {
    if (!this.enabled || (this.init(), !this.ctx)) return;
    const e = this.ctx.currentTime,
      s = this.ctx.createOscillator(),
      i = this.ctx.createGain();
    (s.type = 'sine'),
      s.frequency.setValueAtTime(600 + Math.random() * 80, e),
      i.gain.setValueAtTime(0.08, e),
      i.gain.exponentialRampToValueAtTime(0.005, e + 0.03),
      s.connect(i),
      i.connect(this.ctx.destination),
      s.start(e),
      s.stop(e + 0.03);
  }
  playLevelUp() {
    if (!this.enabled || (this.init(), !this.ctx)) return;
    const e = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((i, t) => {
      const a = this.ctx.createOscillator(),
        o = this.ctx.createGain();
      (a.type = 'triangle'),
        a.frequency.setValueAtTime(i, e + t * 0.08),
        o.gain.setValueAtTime(0.25, e + t * 0.08),
        o.gain.exponentialRampToValueAtTime(0.01, e + t * 0.08 + 0.25),
        a.connect(o),
        o.connect(this.ctx.destination),
        a.start(e + t * 0.08),
        a.stop(e + t * 0.08 + 0.25);
    });
  }
  playQuestComplete() {
    if (!this.enabled || (this.init(), !this.ctx)) return;
    const e = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((i, t) => {
      const a = this.ctx.createOscillator(),
        o = this.ctx.createGain();
      (a.type = 'sine'),
        a.frequency.setValueAtTime(i, e + t * 0.1),
        o.gain.setValueAtTime(0.22, e + t * 0.1),
        o.gain.exponentialRampToValueAtTime(0.01, e + t * 0.1 + 0.35),
        a.connect(o),
        o.connect(this.ctx.destination),
        a.start(e + t * 0.1),
        a.stop(e + t * 0.1 + 0.35);
    });
  }
  playDash() {
    if (!this.enabled || (this.init(), !this.ctx)) return;
    const e = this.ctx.currentTime,
      s = this.ctx.createOscillator(),
      i = this.ctx.createGain();
    (s.type = 'triangle'),
      s.frequency.setValueAtTime(300, e),
      s.frequency.exponentialRampToValueAtTime(100, e + 0.15),
      i.gain.setValueAtTime(0.18, e),
      i.gain.exponentialRampToValueAtTime(0.01, e + 0.15),
      s.connect(i),
      i.connect(this.ctx.destination),
      s.start(e),
      s.stop(e + 0.15);
  }
}
const x = new W();
var z = class {
    constructor(l) {
      n(this, 'bestScores');
      n(this, 'bestActionIds');
      n(this, 'currentScores');
      n(this, 'maxEntities');
      n(this, 'lastEvaluatedActionCount', 0);
      if (l <= 0) throw new Error('maxEntities must be positive');
      (this.maxEntities = l),
        (this.bestScores = new Float32Array(l)),
        (this.bestActionIds = new Uint16Array(l)),
        (this.currentScores = new Float32Array(l));
    }
    beginEvaluation(l) {
      const e = Math.min(l, this.maxEntities);
      this.bestScores.fill(-1 / 0, 0, e),
        this.bestActionIds.fill(0, 0, e),
        (this.lastEvaluatedActionCount = 0);
    }
    evaluateAction(l, e, s) {
      const i = Math.min(e, this.maxEntities);
      if (i === 0) {
        this.lastEvaluatedActionCount++;
        return;
      }
      s(this.currentScores, i);
      const t = this.bestScores,
        a = this.bestActionIds,
        o = this.currentScores;
      for (let h = 0; h < i; h++) o[h] > t[h] && ((t[h] = o[h]), (a[h] = l));
      this.lastEvaluatedActionCount++;
    }
    selectAction(l) {
      return this.bestActionIds[l];
    }
    scoreOf(l) {
      return this.bestScores[l];
    }
    static utility(l, e = 0) {
      return l - e;
    }
  },
  v = ((l) => (
    (l[(l.Chase = 0)] = 'Chase'),
    (l[(l.KeepDistance = 1)] = 'KeepDistance'),
    (l[(l.Idle = 2)] = 'Idle'),
    (l[(l.Retreat = 3)] = 'Retreat'),
    (l[(l.Attack = 4)] = 'Attack'),
    l
  ))(v || {});
const G = { preferredRange: 90, preferredShootRange: 220, retreatHpRatio: 0.25, giveUpRange: 900 };
class O {
  constructor(e, s = {}) {
    n(this, 'ai');
    n(this, 'config');
    n(this, 'dist');
    n(this, 'hpRatio');
    n(this, 'canShoot');
    n(this, 'isBoss');
    n(this, 'count', 0);
    n(this, '_invGiveUp');
    n(this, '_hpRetreat');
    (this.ai = new z(e)),
      (this.config = { ...G, ...s }),
      (this.dist = new Float32Array(e)),
      (this.hpRatio = new Float32Array(e)),
      (this.canShoot = new Float32Array(e)),
      (this.isBoss = new Float32Array(e)),
      (this._invGiveUp = 1 / this.config.giveUpRange),
      (this._hpRetreat = this.config.retreatHpRatio);
  }
  update(e, s, i, t, a, o, h, r, c) {
    if (((this.count = c), c === 0)) return;
    for (let d = 0; d < c; d++) {
      const f = h - e[d],
        p = r - s[d];
      (this.dist[d] = Math.sqrt(f * f + p * p)),
        (this.hpRatio[d] = t[d] > 0 ? i[d] / t[d] : 0),
        (this.canShoot[d] = a[d]),
        (this.isBoss[d] = o[d]);
    }
    this.ai.beginEvaluation(c);
    const m = this.config.preferredRange;
    this.ai.evaluateAction(0, c, (d, f) => {
      for (let p = 0; p < f; p++) {
        const y = this.dist[p];
        if (y >= this.config.giveUpRange) d[p] = 0;
        else {
          const b = (y - m) / m;
          d[p] = b <= 0 ? 1 : 1 - Math.min(1, b * 0.35);
        }
      }
    });
    const u = this.config.preferredShootRange;
    this.ai.evaluateAction(1, c, (d, f) => {
      for (let p = 0; p < f; p++) {
        if (this.canShoot[p] === 0) {
          d[p] = 0;
          continue;
        }
        const b = (this.dist[p] - u) / u;
        d[p] = 1 - Math.min(1, Math.abs(b));
      }
    }),
      this.ai.evaluateAction(2, c, (d, f) => {
        for (let p = 0; p < f; p++) d[p] = this.dist[p] * this._invGiveUp;
      }),
      this.ai.evaluateAction(3, c, (d, f) => {
        for (let p = 0; p < f; p++) {
          if (this.isBoss[p] === 1) {
            d[p] = 0;
            continue;
          }
          const y = this._hpRetreat - this.hpRatio[p];
          d[p] = y > 0 ? 1 + y * 3 : 0;
        }
      }),
      this.ai.evaluateAction(4, c, (d, f) => {
        for (let p = 0; p < f; p++)
          this.dist[p] > this.config.preferredRange ? (d[p] = 0) : (d[p] = 0.85);
      });
  }
  actionOf(e) {
    return this.ai.selectAction(e);
  }
  scoreOf(e) {
    return this.ai.scoreOf(e);
  }
}
const E = {
    bronze_sword: {
      id: 'bronze_sword',
      name: '銅の剣',
      atk: 10,
      price: 0,
      color: 13467442,
      description: '冒険者ギルド支給の標準的な剣。',
    },
    iron_blade: {
      id: 'iron_blade',
      name: '鋼鉄のブロードソード',
      atk: 25,
      price: 150,
      color: 9741240,
      description: '鋭い刃を持つ良質な鋼鉄の剣。',
    },
    flame_katana: {
      id: 'flame_katana',
      name: '炎熱の刀',
      atk: 45,
      price: 400,
      color: 16347926,
      description: '赤熱した刀身が敵を焼き尽くす。',
    },
    excalibur: {
      id: 'excalibur',
      name: '聖剣エクスカリバー',
      atk: 90,
      price: 1e3,
      color: 3718648,
      description: '伝説の光を放つ至高の神剣。',
    },
  },
  B = {
    leather_tunic: {
      id: 'leather_tunic',
      name: '革の服',
      def: 2,
      price: 0,
      color: 9584654,
      description: '動きやすい軽量な革の鎧。',
    },
    iron_plate: {
      id: 'iron_plate',
      name: '鋼鉄のプレートメイル',
      def: 8,
      price: 180,
      color: 6583435,
      description: '強固な鉄板で鍛造された重装鎧。',
    },
    dragon_scale: {
      id: 'dragon_scale',
      name: '竜鱗の戦甲',
      def: 20,
      price: 650,
      color: 15680580,
      description: '火竜の強靭な鱗で作られた伝説の鎧。',
    },
  },
  w = class w {
    constructor(e, s) {
      n(this, 'scene');
      n(this, 'world');
      n(this, 'sprite');
      n(this, 'slashSprite');
      n(this, 'x', 22 * 32 + 16);
      n(this, 'y', 24 * 32 + 16);
      n(this, 'vx', 0);
      n(this, 'vy', 0);
      n(this, 'facing', 1);
      n(this, 'radius', 14);
      n(this, 'level', 1);
      n(this, 'exp', 0);
      n(this, 'expNext', 50);
      n(this, 'hp', 100);
      n(this, 'maxHp', 100);
      n(this, 'mp', 60);
      n(this, 'maxMp', 60);
      n(this, 'baseSpeed', 160);
      n(this, 'gold', 80);
      n(this, 'gems', 0);
      n(this, 'weapon', E.bronze_sword);
      n(this, 'armor', B.leather_tunic);
      n(this, 'hpPotions', 3);
      n(this, 'mpPotions', 2);
      n(this, 'quests', [
        {
          id: 'quest_slime',
          title: 'スライム洞窟の討伐',
          description: '平原の南に繁殖したスライムを 10体 討伐する。',
          targetCount: 10,
          currentCount: 0,
          rewardGold: 100,
          rewardExp: 80,
          completed: !1,
          claimed: !1,
        },
        {
          id: 'quest_goblin',
          title: 'ゴブリン部隊の迎撃',
          description: '遺跡周辺を占拠するゴブリン戦士を 8体 討伐する。',
          targetCount: 8,
          currentCount: 0,
          rewardGold: 250,
          rewardExp: 180,
          completed: !1,
          claimed: !1,
        },
        {
          id: 'quest_boss',
          title: 'ダンジョン最奥の覇王撃破',
          description: '最南端のボス部屋に巣食う邪竜オーバーロードを討ち果たす。',
          targetCount: 1,
          currentCount: 0,
          rewardGold: 1e3,
          rewardExp: 1e3,
          completed: !1,
          claimed: !1,
        },
      ]);
      n(this, 'attackCooldown', 0);
      n(this, 'slashAnimTimer', 0);
      n(this, 'dashCooldown', 0);
      n(this, 'invulnerableTimer', 0);
      (this.scene = e),
        (this.world = s),
        (this.sprite = e.add.sprite(this.x, this.y)),
        (this.sprite.scale = 26),
        this.sprite.setTint(3718648),
        (this.slashSprite = e.add.sprite(-1e3, -1e3)),
        (this.slashSprite.scale = 36),
        this.slashSprite.setTint(16707722);
    }
    get attackPower() {
      return 10 + this.level * 4 + this.weapon.atk;
    }
    get defensePower() {
      return 2 + this.level * 2 + this.armor.def;
    }
    update(e, s) {
      this.attackCooldown > 0 && (this.attackCooldown -= e),
        this.dashCooldown > 0 && (this.dashCooldown -= e),
        this.invulnerableTimer > 0
          ? ((this.invulnerableTimer -= e),
            this.sprite.setTint(
              Math.floor(this.invulnerableTimer * 20) % 2 === 0 ? 16777215 : 3718648,
            ))
          : this.sprite.setTint(3718648),
        (this.mp = Math.min(this.maxMp, this.mp + 4 * e));
      let i = this.baseSpeed;
      if (s.x !== 0 || s.y !== 0) {
        const t = Math.hypot(s.x, s.y) || 1,
          a = s.x / t,
          o = s.y / t;
        a !== 0 && (this.facing = a > 0 ? 1 : -1),
          this.world.slideMove(this.x, this.y, this.radius, a * i * e, o * i * e, w._moveOut),
          (this.x = w._moveOut[0]),
          (this.y = w._moveOut[1]);
      }
      (this.sprite.x = this.x),
        (this.sprite.y = this.y),
        (this.sprite.facing = this.facing),
        this.slashAnimTimer > 0 &&
          ((this.slashAnimTimer -= e),
          (this.slashSprite.x = this.x + this.facing * 20),
          (this.slashSprite.y = this.y),
          (this.slashSprite.facing = this.facing),
          this.slashAnimTimer <= 0 && ((this.slashSprite.x = -1e3), (this.slashSprite.y = -1e3)));
    }
    performSlash() {
      return this.attackCooldown > 0
        ? null
        : ((this.attackCooldown = 0.22),
          (this.slashAnimTimer = 0.12),
          x.playSwordSlash(),
          (this.slashSprite.x = this.x + this.facing * 20),
          (this.slashSprite.y = this.y),
          this.slashSprite.setTint(this.weapon.color),
          { x: this.x + this.facing * 24, y: this.y, radius: 28, damage: this.attackPower });
    }
    castFireball(e, s) {
      if (this.mp < 12) return null;
      (this.mp -= 12), x.playFireball();
      const i = e - this.x,
        t = s - this.y,
        a = Math.hypot(i, t) || 1,
        o = 340;
      return {
        x: this.x + (i / a) * 20,
        y: this.y + (t / a) * 20,
        vx: (i / a) * o,
        vy: (t / a) * o,
        damage: Math.floor(this.attackPower * 1.5),
      };
    }
    performDash() {
      if (this.dashCooldown > 0 || this.mp < 20) return null;
      (this.dashCooldown = 1), (this.mp -= 20), (this.invulnerableTimer = 0.35), x.playDash();
      const s = this.x + this.facing * 80;
      return (
        this.world.isBlocked(s, this.y, this.radius) || (this.x = s),
        { x: this.x, y: this.y, radius: 60, damage: Math.floor(this.attackPower * 2) }
      );
    }
    takeDamage(e) {
      if (this.invulnerableTimer > 0) return 0;
      const s = Math.max(1, e - this.defensePower);
      return (
        (this.hp -= s),
        (this.invulnerableTimer = 0.4),
        x.playHit(),
        this.scene.camera.shake(6, 0.15),
        s
      );
    }
    gainExp(e) {
      this.exp += e;
      let s = !1;
      for (; this.exp >= this.expNext; )
        (this.exp -= this.expNext),
          this.level++,
          (this.expNext = Math.floor(this.expNext * 1.5 + 20)),
          (this.maxHp += 20),
          (this.hp = this.maxHp),
          (this.maxMp += 10),
          (this.mp = this.maxMp),
          (s = !0),
          x.playLevelUp();
      return s;
    }
    useHpPotion() {
      return this.hpPotions <= 0 || this.hp >= this.maxHp
        ? !1
        : (this.hpPotions--, (this.hp = Math.min(this.maxHp, this.hp + 50)), x.playPotion(), !0);
    }
    useMpPotion() {
      return this.mpPotions <= 0 || this.mp >= this.maxMp
        ? !1
        : (this.mpPotions--, (this.mp = Math.min(this.maxMp, this.mp + 40)), x.playPotion(), !0);
    }
  };
n(w, '_moveOut', new Float32Array(2));
let I = w;
class T {
  constructor(e, s, i, t, a, o, h) {
    n(this, 'id');
    n(this, 'name');
    n(this, 'type');
    n(this, 'x');
    n(this, 'y');
    n(this, 'originX');
    n(this, 'originY');
    n(this, 'sprite');
    n(this, 'facing', 1);
    n(this, 'radius', 16);
    n(this, 'wanderTimer', 0);
    n(this, 'isMoving', !1);
    n(this, 'moveTarget', { x: 0, y: 0 });
    n(this, 'dialogs');
    switch (
      ((this.id = s),
      (this.name = i),
      (this.type = t),
      (this.x = a),
      (this.y = o),
      (this.originX = a),
      (this.originY = o),
      (this.dialogs = h),
      (this.sprite = e.add.sprite(a, o)),
      (this.sprite.scale = 26),
      t)
    ) {
      case 'elder':
        this.sprite.setTint(16436245);
        break;
      case 'merchant':
        this.sprite.setTint(4906624);
        break;
      case 'guard':
        this.sprite.setTint(9741240);
        break;
      case 'priestess':
        this.sprite.setTint(16020150);
        break;
    }
  }
  update(e, s) {
    if (((this.wanderTimer -= e), this.wanderTimer <= 0))
      if (((this.wanderTimer = 2 + Math.random() * 3), Math.random() < 0.6)) {
        this.isMoving = !0;
        const i = Math.random() * Math.PI * 2,
          t = Math.random() * 40;
        this.moveTarget = { x: this.originX + Math.cos(i) * t, y: this.originY + Math.sin(i) * t };
      } else this.isMoving = !1;
    if (this.isMoving) {
      const i = this.moveTarget.x - this.x,
        t = this.moveTarget.y - this.y,
        a = Math.hypot(i, t);
      if (a > 4) {
        const h = i / a,
          r = t / a;
        this.facing = h > 0 ? 1 : -1;
        const c = this.x + h * 35 * e,
          m = this.y + r * 35 * e;
        s.isBlocked(c, m, this.radius) ? (this.isMoving = !1) : ((this.x = c), (this.y = m));
      } else this.isMoving = !1;
    }
    (this.sprite.x = this.x), (this.sprite.y = this.y), (this.sprite.facing = this.facing);
  }
}
class _ {
  constructor(e, s, i, t, a) {
    n(this, 'id');
    n(this, 'type');
    n(this, 'x');
    n(this, 'y');
    n(this, 'vx', 0);
    n(this, 'vy', 0);
    n(this, 'hp');
    n(this, 'maxHp');
    n(this, 'atk');
    n(this, 'expReward');
    n(this, 'goldReward');
    n(this, 'speed');
    n(this, 'radius');
    n(this, 'sprite');
    n(this, 'facing', 1);
    n(this, 'aiIndex', 0);
    n(this, 'aiRef', null);
    n(this, 'actionTimer', 0);
    n(this, 'aggroRange', 260);
    n(this, 'isBoss', !1);
    switch (
      ((this.id = s),
      (this.type = i),
      (this.x = t),
      (this.y = a),
      (this.sprite = e.add.sprite(t, a)),
      i)
    ) {
      case 'slime':
        (this.hp = 30),
          (this.maxHp = 30),
          (this.atk = 12),
          (this.speed = 70),
          (this.radius = 12),
          (this.expReward = 15),
          (this.goldReward = 8),
          (this.sprite.scale = 22),
          this.sprite.setTint(2278750);
        break;
      case 'goblin':
        (this.hp = 65),
          (this.maxHp = 65),
          (this.atk = 22),
          (this.speed = 105),
          (this.radius = 14),
          (this.expReward = 35),
          (this.goldReward = 20),
          (this.sprite.scale = 26),
          this.sprite.setTint(14251782);
        break;
      case 'skeleton':
        (this.hp = 90),
          (this.maxHp = 90),
          (this.atk = 28),
          (this.speed = 80),
          (this.radius = 15),
          (this.expReward = 60),
          (this.goldReward = 40),
          (this.sprite.scale = 28),
          this.sprite.setTint(14870768);
        break;
      case 'boss':
        (this.isBoss = !0),
          (this.hp = 1200),
          (this.maxHp = 1200),
          (this.atk = 45),
          (this.speed = 60),
          (this.radius = 36),
          (this.aggroRange = 500),
          (this.expReward = 800),
          (this.goldReward = 600),
          (this.sprite.scale = 64),
          this.sprite.setTint(14427686);
        break;
    }
  }
  update(e, s, i, t) {
    if (this.hp <= 0) return null;
    const a = s - this.x,
      o = i - this.y,
      h = Math.hypot(a, o);
    this.actionTimer -= e;
    const r = this.aiRef !== null ? this.aiRef.actionOf(this.aiIndex) : v.Idle,
      c = h > 1e-4 ? 1 / h : 0,
      m = a * c,
      u = o * c;
    let d = 0,
      f = 0;
    switch (r) {
      case v.Chase:
        (d = m), (f = u);
        break;
      case v.Retreat:
        (d = -m), (f = -u);
        break;
      case v.KeepDistance:
        (d = -m), (f = -u);
        break;
      case v.Attack:
        (d = 0), (f = 0);
        break;
      case v.Idle:
      default:
        (d = 0), (f = 0);
        break;
    }
    if (d !== 0 || f !== 0) {
      this.facing = d > 0 ? 1 : -1;
      const p = this.x + d * this.speed * e,
        y = this.y + f * this.speed * e;
      t.isBlocked(p, this.y, this.radius) || (this.x = p),
        t.isBlocked(this.x, y, this.radius) || (this.y = y);
    }
    if ((this.type === 'skeleton' || this.isBoss) && this.actionTimer <= 0 && h > 1e-4) {
      this.actionTimer = this.isBoss ? 2.5 : 2;
      const p = this.isBoss ? 180 : 200;
      return { shoot: { x: this.x, y: this.y, vx: m * p, vy: u * p, damage: this.atk } };
    }
    return (
      (this.sprite.x = this.x), (this.sprite.y = this.y), (this.sprite.facing = this.facing), null
    );
  }
  takeDamage(e, s = 0, i = 0) {
    (this.hp -= e), x.playHit();
    const t = this.isBoss ? 0.2 : 1;
    return (this.x += s * t), (this.y += i * t), this.hp <= 0 ? (this.sprite.destroy(), !0) : !1;
  }
}
class H {
  constructor(e, s, i, t, a, o, h = !1) {
    n(this, 'sprite');
    n(this, 'x');
    n(this, 'y');
    n(this, 'vx');
    n(this, 'vy');
    n(this, 'radius');
    n(this, 'damage');
    n(this, 'lifetime', 2.5);
    n(this, 'isEnemy', !1);
    (this.x = s),
      (this.y = i),
      (this.vx = t),
      (this.vy = a),
      (this.damage = o),
      (this.radius = h ? 6 : 8),
      (this.isEnemy = h),
      (this.sprite = e.add.sprite(s, i)),
      (this.sprite.scale = h ? 14 : 18),
      this.sprite.setTint(h ? 9647082 : 16347926);
  }
  update(e, s) {
    return (
      (this.lifetime -= e),
      this.lifetime <= 0
        ? (this.sprite.destroy(), !1)
        : ((this.x += this.vx * e),
          (this.y += this.vy * e),
          s.isBlocked(this.x, this.y, this.radius)
            ? (this.sprite.destroy(), !1)
            : ((this.sprite.x = this.x), (this.sprite.y = this.y), !0))
    );
  }
}
class S {
  constructor(e, s, i, t, a = 1) {
    n(this, 'sprite');
    n(this, 'x');
    n(this, 'y');
    n(this, 'type');
    n(this, 'value');
    n(this, 'radius', 12);
    switch (
      ((this.x = s),
      (this.y = i),
      (this.type = t),
      (this.value = a),
      (this.sprite = e.add.sprite(s, i)),
      (this.sprite.scale = 16),
      t)
    ) {
      case 'coin':
        this.sprite.setTint(16436245);
        break;
      case 'gem':
        this.sprite.setTint(3718648);
        break;
      case 'potion_hp':
        this.sprite.setTint(15680580);
        break;
      case 'potion_mp':
        this.sprite.setTint(3900150);
        break;
    }
  }
  update(e, s, i) {
    const t = s - this.x,
      a = i - this.y,
      o = Math.hypot(t, a);
    o < 120 &&
      o > 1 &&
      ((this.x += (t / o) * 240 * e),
      (this.y += (a / o) * 240 * e),
      (this.sprite.x = this.x),
      (this.sprite.y = this.y));
  }
  destroy() {
    this.sprite.destroy();
  }
}
class j {
  constructor(e, s, i, t = '#ffffff') {
    n(this, 'x');
    n(this, 'y');
    n(this, 'text');
    n(this, 'color');
    n(this, 'lifetime', 0.8);
    n(this, 'maxLifetime', 0.8);
    (this.x = e), (this.y = s), (this.text = i), (this.color = t);
  }
  update(e) {
    return (this.lifetime -= e), (this.y -= 30 * e), this.lifetime > 0;
  }
}
class X {
  constructor(e, s) {
    n(this, 'player');
    n(this, 'onBenchmarkModeChange');
    n(this, 'hpBar');
    n(this, 'hpText');
    n(this, 'mpBar');
    n(this, 'mpText');
    n(this, 'expBar');
    n(this, 'lvlText');
    n(this, 'goldText');
    n(this, 'gemText');
    n(this, 'questList');
    n(this, 'dialogModal');
    n(this, 'dialogSpeaker');
    n(this, 'dialogText');
    n(this, 'dialogBtn');
    n(this, 'shopModal');
    n(this, 'inventoryModal');
    n(this, 'benchmarkModal');
    n(this, 'isTyping', !1);
    n(this, 'currentFullText', '');
    n(this, 'typeTimer', null);
    (this.player = e),
      (this.onBenchmarkModeChange = s),
      this.cacheDOMElements(),
      this.setupEventListeners();
  }
  cacheDOMElements() {
    (this.hpBar = document.getElementById('rpg-hp-bar')),
      (this.hpText = document.getElementById('rpg-hp-text')),
      (this.mpBar = document.getElementById('rpg-mp-bar')),
      (this.mpText = document.getElementById('rpg-mp-text')),
      (this.expBar = document.getElementById('rpg-exp-bar')),
      (this.lvlText = document.getElementById('rpg-lvl-text')),
      (this.goldText = document.getElementById('rpg-gold-text')),
      (this.gemText = document.getElementById('rpg-gem-text')),
      (this.questList = document.getElementById('rpg-quest-list')),
      (this.dialogModal = document.getElementById('rpg-dialog-modal')),
      (this.dialogSpeaker = document.getElementById('rpg-dialog-speaker')),
      (this.dialogText = document.getElementById('rpg-dialog-text')),
      (this.dialogBtn = document.getElementById('rpg-dialog-btn')),
      (this.shopModal = document.getElementById('rpg-shop-modal')),
      (this.inventoryModal = document.getElementById('rpg-inventory-modal')),
      (this.benchmarkModal = document.getElementById('rpg-benchmark-modal'));
  }
  setupEventListeners() {
    var e, s, i, t, a, o;
    (e = document.getElementById('btn-inventory')) == null ||
      e.addEventListener('click', () => {
        this.toggleInventory();
      }),
      (s = document.getElementById('btn-close-inventory')) == null ||
        s.addEventListener('click', () => {
          this.inventoryModal.classList.add('hidden');
        }),
      (i = document.getElementById('btn-close-shop')) == null ||
        i.addEventListener('click', () => {
          this.shopModal.classList.add('hidden');
        }),
      (t = document.getElementById('btn-benchmark-panel')) == null ||
        t.addEventListener('click', () => {
          this.benchmarkModal.classList.toggle('hidden');
        }),
      (a = document.getElementById('btn-close-benchmark')) == null ||
        a.addEventListener('click', () => {
          this.benchmarkModal.classList.add('hidden');
        }),
      document.querySelectorAll('.btn-spawn-bench').forEach((h) => {
        h.addEventListener('click', (r) => {
          const c = parseInt(r.target.getAttribute('data-count') || '100', 10);
          this.onBenchmarkModeChange(c);
        });
      }),
      (o = this.dialogBtn) == null ||
        o.addEventListener('click', () => {
          this.advanceDialog();
        }),
      window.addEventListener('keydown', (h) => {
        h.key === 'i' || h.key === 'I'
          ? this.toggleInventory()
          : h.key === 'b' || h.key === 'B'
            ? this.benchmarkModal.classList.toggle('hidden')
            : h.key === 'Escape'
              ? (this.inventoryModal.classList.add('hidden'),
                this.shopModal.classList.add('hidden'),
                this.benchmarkModal.classList.add('hidden'),
                this.dialogModal.classList.add('hidden'))
              : (h.key === ' ' || h.key === 'Enter') &&
                (this.dialogModal.classList.contains('hidden') || this.advanceDialog());
      });
  }
  updateHUD() {
    const e = this.player,
      s = Math.max(0, Math.min(100, (e.hp / e.maxHp) * 100));
    (this.hpBar.style.width = `${s}%`), (this.hpText.textContent = `${Math.ceil(e.hp)}/${e.maxHp}`);
    const i = Math.max(0, Math.min(100, (e.mp / e.maxMp) * 100));
    (this.mpBar.style.width = `${i}%`), (this.mpText.textContent = `${Math.ceil(e.mp)}/${e.maxMp}`);
    const t = Math.max(0, Math.min(100, (e.exp / e.expNext) * 100));
    (this.expBar.style.width = `${t}%`),
      (this.lvlText.textContent = `Lv.${e.level}`),
      (this.goldText.textContent = `${e.gold}`),
      (this.gemText.textContent = `${e.gems}`);
    let a = '';
    for (const o of e.quests) {
      const h = o.currentCount >= o.targetCount;
      a += `
        <div class="bg-slate-900/80 border ${h ? 'border-emerald-500/80' : 'border-slate-700/80'} p-2 rounded-lg text-xs">
          <div class="flex justify-between font-bold ${h ? 'text-emerald-400' : 'text-amber-300'}">
            <span>${o.title}</span>
            <span>${o.currentCount}/${o.targetCount}</span>
          </div>
          <div class="text-[10px] text-slate-400 mt-0.5">${o.description}</div>
        </div>
      `;
    }
    this.questList.innerHTML = a;
  }
  startDialogue(e, s) {
    if (e.type === 'merchant') {
      this.openShop();
      return;
    }
    e.type === 'priestess' &&
      ((this.player.hp = this.player.maxHp), (this.player.mp = this.player.maxMp), x.playPotion()),
      this.dialogModal.classList.remove('hidden'),
      (this.dialogSpeaker.textContent = e.name);
    const i = e.dialogs[Math.floor(Math.random() * e.dialogs.length)];
    this.typewriterText(i);
  }
  typewriterText(e) {
    this.typeTimer && clearInterval(this.typeTimer),
      (this.isTyping = !0),
      (this.currentFullText = e),
      (this.dialogText.textContent = '');
    let s = 0;
    this.typeTimer = setInterval(() => {
      s < e.length
        ? ((this.dialogText.textContent += e.charAt(s)), s % 2 === 0 && x.playDialogBeep(), s++)
        : (clearInterval(this.typeTimer), (this.isTyping = !1));
    }, 25);
  }
  advanceDialog() {
    this.isTyping
      ? (clearInterval(this.typeTimer),
        (this.dialogText.textContent = this.currentFullText),
        (this.isTyping = !1))
      : this.dialogModal.classList.add('hidden');
  }
  openShop() {
    this.shopModal.classList.remove('hidden'), this.renderShopItems();
  }
  renderShopItems() {
    const e = document.getElementById('rpg-shop-items');
    let s = '';
    for (const i of ['iron_blade', 'flame_katana', 'excalibur']) {
      const t = E[i],
        a = this.player.weapon.id === t.id;
      s += `
        <div class="flex items-center justify-between bg-slate-900/90 border border-slate-700 p-2.5 rounded-xl">
          <div>
            <div class="font-bold text-amber-300 text-xs">${t.name} (ATK +${t.atk})</div>
            <div class="text-[10px] text-slate-400">${t.description}</div>
          </div>
          <button class="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs btn-buy-item" data-type="weapon" data-id="${t.id}">
            ${a ? '装備中' : `🪙 ${t.price}`}
          </button>
        </div>
      `;
    }
    for (const i of ['iron_plate', 'dragon_scale']) {
      const t = B[i],
        a = this.player.armor.id === t.id;
      s += `
        <div class="flex items-center justify-between bg-slate-900/90 border border-slate-700 p-2.5 rounded-xl">
          <div>
            <div class="font-bold text-sky-300 text-xs">${t.name} (DEF +${t.def})</div>
            <div class="text-[10px] text-slate-400">${t.description}</div>
          </div>
          <button class="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs btn-buy-item" data-type="armor" data-id="${t.id}">
            ${a ? '装備中' : `🪙 ${t.price}`}
          </button>
        </div>
      `;
    }
    (s += `
      <div class="flex items-center justify-between bg-slate-900/90 border border-slate-700 p-2.5 rounded-xl">
        <div>
          <div class="font-bold text-rose-300 text-xs">回復ポーション (HP +50)</div>
          <div class="text-[10px] text-slate-400">所持数: ${this.player.hpPotions}個</div>
        </div>
        <button class="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs btn-buy-item" data-type="potion_hp" data-id="potion_hp">
          🪙 25
        </button>
      </div>
      <div class="flex items-center justify-between bg-slate-900/90 border border-slate-700 p-2.5 rounded-xl">
        <div>
          <div class="font-bold text-indigo-300 text-xs">魔力ポーション (MP +40)</div>
          <div class="text-[10px] text-slate-400">所持数: ${this.player.mpPotions}個</div>
        </div>
        <button class="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs btn-buy-item" data-type="potion_mp" data-id="potion_mp">
          🪙 20
        </button>
      </div>
    `),
      (e.innerHTML = s),
      e.querySelectorAll('.btn-buy-item').forEach((i) => {
        i.addEventListener('click', (t) => {
          const a = t.currentTarget.getAttribute('data-type'),
            o = t.currentTarget.getAttribute('data-id');
          this.buyItem(a, o);
        });
      });
  }
  buyItem(e, s) {
    const i = this.player;
    if (e === 'weapon') {
      const t = E[s];
      i.gold >= t.price &&
        i.weapon.id !== t.id &&
        ((i.gold -= t.price),
        (i.weapon = t),
        x.playCoin(),
        this.renderShopItems(),
        this.updateHUD());
    } else if (e === 'armor') {
      const t = B[s];
      i.gold >= t.price &&
        i.armor.id !== t.id &&
        ((i.gold -= t.price),
        (i.armor = t),
        x.playCoin(),
        this.renderShopItems(),
        this.updateHUD());
    } else
      e === 'potion_hp'
        ? i.gold >= 25 &&
          ((i.gold -= 25), i.hpPotions++, x.playCoin(), this.renderShopItems(), this.updateHUD())
        : e === 'potion_mp' &&
          i.gold >= 20 &&
          ((i.gold -= 20), i.mpPotions++, x.playCoin(), this.renderShopItems(), this.updateHUD());
  }
  toggleInventory() {
    this.inventoryModal.classList.toggle('hidden'),
      this.inventoryModal.classList.contains('hidden') || this.renderInventory();
  }
  renderInventory() {
    var i, t;
    const e = this.player,
      s = document.getElementById('rpg-inventory-content');
    (s.innerHTML = `
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-1.5">
          <span class="text-amber-400 font-bold">⚔️ 装備ステータス</span>
          <div>武器: <span class="font-bold text-amber-300">${e.weapon.name}</span> (ATK +${e.weapon.atk})</div>
          <div>防具: <span class="font-bold text-sky-300">${e.armor.name}</span> (DEF +${e.armor.def})</div>
          <div class="mt-2 pt-2 border-t border-slate-800 text-slate-300">
            <div>総合攻撃力: <span class="font-bold text-rose-400">${e.attackPower}</span></div>
            <div>総合防御力: <span class="font-bold text-blue-400">${e.defensePower}</span></div>
            <div>移動速度: <span class="font-bold text-emerald-400">${e.baseSpeed} px/s</span></div>
          </div>
        </div>
        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
          <span class="text-emerald-400 font-bold">🎒 所持アイテム</span>
          <div class="flex items-center justify-between">
            <span>HPポーション: ${e.hpPotions}個</span>
            <button class="px-2 py-0.5 bg-rose-600 rounded text-[10px] btn-use-hp" ${e.hpPotions <= 0 ? 'disabled' : ''}>使う</button>
          </div>
          <div class="flex items-center justify-between">
            <span>MPポーション: ${e.mpPotions}個</span>
            <button class="px-2 py-0.5 bg-indigo-600 rounded text-[10px] btn-use-mp" ${e.mpPotions <= 0 ? 'disabled' : ''}>使う</button>
          </div>
        </div>
      </div>
    `),
      (i = s.querySelector('.btn-use-hp')) == null ||
        i.addEventListener('click', () => {
          e.useHpPotion(), this.renderInventory(), this.updateHUD();
        }),
      (t = s.querySelector('.btn-use-mp')) == null ||
        t.addEventListener('click', () => {
          e.useMpPotion(), this.renderInventory(), this.updateHUD();
        });
  }
}
var g = 3,
  Y = -1,
  N = class {
    constructor(l, e, s, i) {
      n(this, 'width');
      n(this, 'height');
      n(this, 'invResolution');
      n(this, 'resolution');
      n(this, 'data');
      if (l <= 0 || e <= 0) throw new Error('SDF grid size must be positive');
      if (s <= 0) throw new Error('resolution must be positive');
      if (
        ((this.width = l),
        (this.height = e),
        (this.resolution = s),
        (this.invResolution = 1 / s),
        i)
      ) {
        if (i.length !== l * e) throw new Error('initialData length must match width * height');
        this.data = i;
      } else this.data = new Float32Array(l * e);
    }
    get gridWidth() {
      return this.width;
    }
    get gridHeight() {
      return this.height;
    }
    get worldWidth() {
      return this.width * this.resolution;
    }
    get worldHeight() {
      return this.height * this.resolution;
    }
    get raw() {
      return this.data;
    }
    setDistance(l, e, s) {
      l < 0 || l >= this.width || e < 0 || e >= this.height || (this.data[e * this.width + l] = s);
    }
    getDistance(l, e) {
      return l < 0 || l >= this.width || e < 0 || e >= this.height
        ? 0
        : this.data[e * this.width + l];
    }
    evaluate(l, e, s) {
      const i = l * this.invResolution,
        t = e * this.invResolution,
        a = Math.floor(i),
        o = Math.floor(t),
        h = i - a,
        r = t - o,
        c = Math.max(0, Math.min(this.width - 1, a)),
        m = Math.max(0, Math.min(this.height - 1, o)),
        u = Math.max(0, Math.min(this.width - 1, a + 1)),
        d = Math.max(0, Math.min(this.height - 1, o + 1)),
        f = this.data[m * this.width + c],
        p = this.data[m * this.width + u],
        y = this.data[d * this.width + c],
        b = this.data[d * this.width + u],
        M = f * (1 - h) + p * h,
        F = y * (1 - h) + b * h,
        $ = M * (1 - r) + F * r,
        k = (p - f) * (1 - r) + (b - y) * r,
        A = (y - f) * (1 - h) + (b - p) * h,
        C = k * k + A * A;
      let D = 0,
        R = 0;
      if (C > 1e-12) {
        const P = 1 / Math.sqrt(C);
        (D = k * P), (R = A * P);
      }
      (s[0] = $), (s[1] = D), (s[2] = R);
    }
    distanceAt(l, e) {
      const s = l * this.invResolution,
        i = e * this.invResolution,
        t = Math.floor(s),
        a = Math.floor(i),
        o = s - t,
        h = i - a,
        r = Math.max(0, Math.min(this.width - 1, t)),
        c = Math.max(0, Math.min(this.height - 1, a)),
        m = Math.max(0, Math.min(this.width - 1, t + 1)),
        u = Math.max(0, Math.min(this.height - 1, a + 1)),
        d = this.data[c * this.width + r],
        f = this.data[c * this.width + m],
        p = this.data[u * this.width + r],
        y = this.data[u * this.width + m],
        b = d * (1 - o) + f * o,
        M = p * (1 - o) + y * o;
      return b * (1 - h) + M * h;
    }
    generate(l) {
      const e = this.width,
        s = this.height,
        i = e * s,
        t = new Float32Array(i * g);
      this._seed(t, l, !0), this._edt(t, e, s);
      const a = new Float32Array(i);
      for (let o = 0; o < i; o++) a[o] = Math.sqrt(this._finalize(t, o));
      this._seed(t, l, !1), this._edt(t, e, s);
      for (let o = 0; o < i; o++)
        this.data[o] = (a[o] - Math.sqrt(this._finalize(t, o))) * this.resolution;
    }
    _finalize(l, e) {
      const s = l[e * g];
      return s < 0 ? 0 : s;
    }
    _seed(l, e, s) {
      const i = this.width,
        t = this.height;
      for (let a = 0; a < i * t; a++) (l[a * g] = Y), (l[a * g + 1] = 0), (l[a * g + 2] = 0);
      for (let a = 0; a < t; a++)
        for (let o = 0; o < i; o++) {
          const h = a * i + o;
          e((o + 0.5) * this.resolution, (a + 0.5) * this.resolution) === s &&
            ((l[h * g] = 0), (l[h * g + 1] = o), (l[h * g + 2] = a));
        }
    }
    _edt(l, e, s) {
      for (let i = 0; i < s; i++)
        for (let t = 0; t < e; t++) {
          const a = i * e + t;
          t > 0 && this._prop(l, a, a - 1, t, i),
            i > 0 && this._prop(l, a, a - e, t, i),
            t > 0 && i > 0 && this._prop(l, a, a - e - 1, t, i),
            t + 1 < e && i > 0 && this._prop(l, a, a - e + 1, t, i);
        }
      for (let i = s - 1; i >= 0; i--)
        for (let t = e - 1; t >= 0; t--) {
          const a = i * e + t;
          t + 1 < e && this._prop(l, a, a + 1, t, i),
            i + 1 < s && this._prop(l, a, a + e, t, i),
            t + 1 < e && i + 1 < s && this._prop(l, a, a + e + 1, t, i),
            t > 0 && i + 1 < s && this._prop(l, a, a + e - 1, t, i);
        }
    }
    _prop(l, e, s, i, t) {
      if (l[s * g] < 0) return;
      const o = l[s * g + 1] - i,
        h = l[s * g + 2] - t,
        r = o * o + h * h,
        c = l[e * g];
      (c < 0 || r < c) &&
        ((l[e * g] = r), (l[e * g + 1] = l[s * g + 1]), (l[e * g + 2] = l[s * g + 2]));
    }
    resolveCircle(l, e, s, i, t) {
      this.evaluate(l, e, t);
      const a = t[0];
      if (((i[0] = l), (i[1] = e), a >= s || a <= 0)) return !1;
      const o = s - a;
      return (i[0] = l + t[1] * o), (i[1] = e + t[2] * o), !0;
    }
    sweep(l, e, s, i, t, a, o, h) {
      const r = Math.max(1, a | 0);
      for (let c = 1; c <= r; c++) {
        const m = c / r,
          u = l + (s - l) * m,
          d = e + (i - e) * m;
        if ((this.evaluate(u, d, h), h[0] < t)) return (o[0] = u), (o[1] = d), !0;
      }
      return !1;
    }
    generateFromGrid(l, e, s) {
      this.generate((i, t) => {
        const a = Math.floor(i / e),
          o = Math.floor(t / e),
          h = l[o];
        if (!h) return !1;
        const r = h[a];
        return r === void 0 ? !1 : s(r);
      });
    }
  };
class K {
  constructor(e) {
    n(this, 'scene');
    n(this, 'mapWidth', 90);
    n(this, 'mapHeight', 90);
    n(this, 'tileSize', 32);
    n(this, 'sdf', null);
    n(this, '_sdfScratch', new Float32Array(3));
    n(this, 'worldWidth');
    n(this, 'worldHeight');
    n(this, 'tiles');
    n(this, 'solidMap');
    n(this, 'props', []);
    n(this, 'propSprites', []);
    n(this, 'chests', []);
    (this.scene = e),
      (this.worldWidth = this.mapWidth * this.tileSize),
      (this.worldHeight = this.mapHeight * this.tileSize),
      (this.tiles = new Uint8Array(this.mapWidth * this.mapHeight)),
      (this.solidMap = new Uint8Array(this.mapWidth * this.mapHeight)),
      this.generateWorld(),
      this.spawnWorldTilesAndProps();
  }
  generateWorld() {
    const e = this.mapWidth,
      s = this.mapHeight;
    for (let i = 0; i < s; i++)
      for (let t = 0; t < e; t++) {
        const a = i * e + t;
        i < 46 && t < 46
          ? t === 0 ||
            i === 0 ||
            (t === 45 && !(i >= 20 && i <= 24)) ||
            (i === 45 && !(t >= 20 && t <= 24))
            ? ((this.tiles[a] = 3), (this.solidMap[a] = 1))
            : (t >= 14 && t <= 30 && i >= 14 && i <= 30) ||
                (t >= 20 && t <= 24) ||
                (i >= 20 && i <= 24)
              ? (this.tiles[a] = 2)
              : (t >= 6 && t <= 12 && i >= 6 && i <= 12) ||
                  (t >= 32 && t <= 38 && i >= 6 && i <= 12)
                ? (this.tiles[a] = 4)
                : (this.tiles[a] = 1)
          : i >= 50
            ? t === 0 || t === e - 1 || i === s - 1 || (i === 50 && !(t >= 20 && t <= 24))
              ? ((this.tiles[a] = 8), (this.solidMap[a] = 1))
              : t >= 35 &&
                  t <= 55 &&
                  i >= 65 &&
                  i <= 80 &&
                  (t === 35 || t === 55 || i === 65 || i === 80)
                ? t === 45 && i === 65
                  ? (this.tiles[a] = 7)
                  : ((this.tiles[a] = 8), (this.solidMap[a] = 1))
                : (t >= 70 && t <= 80 && i >= 55 && i <= 65) ||
                    (t >= 10 && t <= 18 && i >= 75 && i <= 82)
                  ? ((this.tiles[a] = 9), (this.solidMap[a] = 1))
                  : (this.tiles[a] = 7)
            : t >= 62 && t <= 65
              ? i >= 20 && i <= 24
                ? (this.tiles[a] = 6)
                : ((this.tiles[a] = 5), (this.solidMap[a] = 1))
              : (this.tiles[a] = 1);
      }
    this.addBuilding(6, 6, 7, 7),
      this.addBuilding(32, 6, 7, 7),
      this.addBuilding(6, 32, 7, 7),
      this.addBuilding(32, 32, 7, 7),
      this.addProp(22 * 32 + 16, 22 * 32 + 16, 48, 48, 'fountain', !0),
      this.addProp(16 * 32, 20 * 32, 36, 28, 'stall', !0),
      this.addProp(28 * 32, 20 * 32, 36, 28, 'stall', !0);
    for (let i = 0; i < 45; i++) {
      const t = 48 + Math.floor(Math.random() * 38),
        a = 4 + Math.floor(Math.random() * 42);
      (t >= 60 && t <= 67) || this.addProp(t * 32 + 16, a * 32 + 16, 32, 32, 'tree', !0);
    }
    for (let i = 0; i < 20; i++) {
      const t = 8 + Math.floor(Math.random() * 74),
        a = 54 + Math.floor(Math.random() * 30);
      this.tiles[a * e + t] === 7 && this.addProp(t * 32 + 16, a * 32 + 16, 24, 32, 'pillar', !0);
    }
    this.addChest(35 * 32 + 16, 9 * 32 + 16),
      this.addChest(82 * 32 + 16, 12 * 32 + 16),
      this.addChest(12 * 32 + 16, 60 * 32 + 16),
      this.addChest(45 * 32 + 16, 76 * 32 + 16),
      this.addChest(78 * 32 + 16, 82 * 32 + 16);
  }
  addBuilding(e, s, i, t) {
    const a = this.mapWidth;
    for (let o = 0; o < t; o++)
      for (let h = 0; h < i; h++) {
        const r = e + h,
          m = (s + o) * a + r;
        (o === 0 || o === t - 1 || h === 0 || h === i - 1) &&
          (o === t - 1 && h === Math.floor(i / 2)
            ? ((this.tiles[m] = 4), (this.solidMap[m] = 0))
            : ((this.tiles[m] = 3), (this.solidMap[m] = 1)));
      }
  }
  addProp(e, s, i, t, a, o) {
    this.props.push({ x: e, y: s, width: i, height: t, type: a, solid: o });
  }
  addChest(e, s) {
    const i = {
      x: e,
      y: s,
      width: 28,
      height: 28,
      type: 'chest',
      solid: !0,
      interactable: !0,
      opened: !1,
    };
    this.props.push(i), this.chests.push(i);
  }
  spawnWorldTilesAndProps() {
    const e = this.mapWidth,
      s = this.mapHeight;
    for (let i = 0; i < s; i++)
      for (let t = 0; t < e; t++) {
        const a = i * e + t,
          o = this.tiles[a],
          h = this.scene.add.sprite(t * this.tileSize + 16, i * this.tileSize + 16);
        switch (((h.scale = this.tileSize + 0.5), o)) {
          case 1:
            h.setTint(3833156);
            break;
          case 2:
            h.setTint(10265519);
            break;
          case 3:
            h.setTint(4937059);
            break;
          case 4:
            h.setTint(8736014);
            break;
          case 5:
            h.setTint(165063);
            break;
          case 6:
            h.setTint(10576391);
            break;
          case 7:
            h.setTint(1973067);
            break;
          case 8:
            h.setTint(988970);
            break;
          case 9:
            h.setTint(14753096);
            break;
          default:
            h.setTint(1120295);
            break;
        }
      }
    for (const i of this.props) {
      const t = this.scene.add.sprite(i.x, i.y);
      switch (((t.scale = Math.max(i.width, i.height)), (i.sprite = t), i.type)) {
        case 'fountain':
          t.setTint(3718648);
          break;
        case 'stall':
          t.setTint(16096779);
          break;
        case 'tree':
          t.setTint(1409085);
          break;
        case 'pillar':
          t.setTint(6583435);
          break;
        case 'chest':
          t.setTint(16436245);
          break;
      }
      this.propSprites.push(t);
    }
  }
  isBlocked(e, s, i = 12) {
    if (e < i || e >= this.worldWidth - i || s < i || s >= this.worldHeight - i) return !0;
    const t = Math.floor((e - i) / this.tileSize),
      a = Math.floor((e + i) / this.tileSize),
      o = Math.floor((s - i) / this.tileSize),
      h = Math.floor((s + i) / this.tileSize);
    for (let r = o; r <= h; r++)
      for (let c = t; c <= a; c++)
        if (
          c < 0 ||
          c >= this.mapWidth ||
          r < 0 ||
          r >= this.mapHeight ||
          this.solidMap[r * this.mapWidth + c] === 1
        )
          return !0;
    for (let r = 0; r < this.props.length; r++) {
      const c = this.props[r];
      if (!c.solid) continue;
      const m = c.width / 2 + i,
        u = c.height / 2 + i;
      if (Math.abs(e - c.x) < m && Math.abs(s - c.y) < u) return !0;
    }
    return !1;
  }
  buildSDF() {
    const e = new N(this.mapWidth, this.mapHeight, this.tileSize);
    e.generate((s, i) => {
      const t = Math.floor(s / this.tileSize),
        a = Math.floor(i / this.tileSize);
      return t < 0 || t >= this.mapWidth || a < 0 || a >= this.mapHeight
        ? !0
        : this.solidMap[a * this.mapWidth + t] === 1;
    });
    for (let s = 0; s < this.props.length; s++) {
      const i = this.props[s];
      i.solid && this._stampPropIntoSDF(e, i.x, i.y, i.width * 0.5, i.height * 0.5);
    }
    this.sdf = e;
  }
  _stampPropIntoSDF(e, s, i, t, a) {
    const o = Math.max(0, Math.floor((s - t) / this.tileSize)),
      h = Math.min(this.mapWidth - 1, Math.floor((s + t) / this.tileSize)),
      r = Math.max(0, Math.floor((i - a) / this.tileSize)),
      c = Math.min(this.mapHeight - 1, Math.floor((i + a) / this.tileSize));
    for (let m = r; m <= c; m++) for (let u = o; u <= h; u++) e.setDistance(u, m, -this.tileSize);
  }
  slideMove(e, s, i, t, a, o) {
    if (((o[0] = e), (o[1] = s), !this.isBlocked(e + t, s + a, i)))
      return (o[0] = e + t), (o[1] = s + a), !0;
    const h = this.sdf;
    if (!h)
      return (
        this.isBlocked(e + t, s, i) || (o[0] = e + t),
        this.isBlocked(o[0], s + a, i) || (o[1] = s + a),
        o[0] !== e || o[1] !== s
      );
    if ((h.evaluate(e, s, this._sdfScratch), this._sdfScratch[0] < i)) {
      const y = i - this._sdfScratch[0];
      (e += this._sdfScratch[1] * y), (s += this._sdfScratch[2] * y);
    }
    const r = this._sdfScratch[1],
      c = this._sdfScratch[2],
      m = t * r + a * c,
      u = t - r * m,
      d = a - c * m,
      f = e + u,
      p = s + d;
    return this.isBlocked(f, p, i)
      ? this.isBlocked(e + u, s, i)
        ? this.isBlocked(e, s + d, i)
          ? !1
          : ((o[0] = e), (o[1] = s + d), !0)
        : ((o[0] = e + u), (o[1] = s), !0)
      : ((o[0] = f), (o[1] = p), !0);
  }
}
class Q extends V {
  constructor() {
    super({ maxInstances: 1e5 });
    n(this, 'world');
    n(this, 'player');
    n(this, 'npcs', []);
    n(this, 'monsters', []);
    n(this, 'projectiles', []);
    n(this, 'loots', []);
    n(this, 'floatingTexts', []);
    n(this, 'ui');
    n(this, 'inputDir', { x: 0, y: 0 });
    n(this, 'mousePos', { x: 0, y: 0 });
    n(this, 'frameTimes', []);
    n(this, 'lastFpsUpdate', 0);
    n(this, 'currentFps', 60);
    n(this, 'currentFrameTime', 0.8);
    n(this, 'monsterAI');
    n(this, 'aiX');
    n(this, 'aiY');
    n(this, 'aiHp');
    n(this, 'aiMaxHp');
    n(this, 'aiShoot');
    n(this, 'aiBoss');
    n(this, 'aiCount', 0);
    (this.monsterAI = new O(1e5)),
      (this.aiX = new Float32Array(1e5)),
      (this.aiY = new Float32Array(1e5)),
      (this.aiHp = new Float32Array(1e5)),
      (this.aiMaxHp = new Float32Array(1e5)),
      (this.aiShoot = new Float32Array(1e5)),
      (this.aiBoss = new Float32Array(1e5));
  }
  create() {
    (this.world = new K(this)),
      this.world.buildSDF(),
      (this.player = new I(this, this.world)),
      this.spawnTownNPCs(),
      this.spawnMonsters(80),
      (this.ui = new X(this.player, (s) => {
        this.setBenchmarkScale(s);
      })),
      this.setupInput(),
      (this.camera.x = this.player.x),
      (this.camera.y = this.player.y),
      (this.camera.zoom = 1);
  }
  spawnTownNPCs() {
    this.npcs.push(
      new T(this, 'elder', '長老 セドリック', 'elder', 22 * 32 + 16, 18 * 32 + 16, [
        'おお、若き勇者よ！南の洞窟に魔物の気配が満ちておる。まずはスライムを退治して腕を磨くのじゃ！',
        '街道の東にある川を越えると、獰猛なゴブリンどもが群れておる。準備を怠るでないぞ。',
        '最南端の暗黒遺跡には、かつて王国を滅ぼしかけた大魔竜が眠っておるという…気をつけるのじゃ。',
      ]),
    ),
      this.npcs.push(
        new T(this, 'merchant', '商人 ボリス', 'merchant', 16 * 32 + 16, 21 * 32 + 16, [
          'いらっしゃい！良質な鋼鉄の剣や回復薬を取り揃えてるぜ。金さえあれば何でも売ってやるよ！',
        ]),
      ),
      this.npcs.push(
        new T(this, 'guard', '衛兵長 ローランド', 'guard', 44 * 32 + 16, 22 * 32 + 16, [
          'ここから先は危険地帯だ。[LMB]で剣を振り、[RMB]で炎の魔法を放てるぞ。健闘を祈る！',
          '敵に囲まれたら[Shift]の疾風ダッシュで切り抜けるんだ！',
        ]),
      ),
      this.npcs.push(
        new T(this, 'priestess', '巫女 ライラ', 'priestess', 24 * 32 + 16, 24 * 32 + 16, [
          '旅のお方、お怪我はありませんか？聖なる泉の力で、あなたの傷と魔力を全快させましょう！',
        ]),
      );
  }
  spawnMonsters(s) {
    for (const a of this.monsters) a.sprite && a.sprite.destroy();
    (this.monsters = []), (this.aiCount = 0);
    for (let a = 0; a < s; a++) {
      let o = 'slime',
        h = 0,
        r = 0;
      const c = Math.random();
      c < 0.5
        ? ((o = 'slime'), (h = (48 + Math.random() * 38) * 32), (r = (6 + Math.random() * 40) * 32))
        : c < 0.85
          ? ((o = 'goblin'),
            (h = (8 + Math.random() * 78) * 32),
            (r = (52 + Math.random() * 20) * 32))
          : ((o = 'skeleton'),
            (h = (10 + Math.random() * 74) * 32),
            (r = (68 + Math.random() * 18) * 32)),
        this.world.isBlocked(h, r, 14) || this.monsters.push(new _(this, a, o, h, r));
    }
    const i = 45 * 32 + 16,
      t = 74 * 32 + 16;
    this.monsters.push(new _(this, 999999, 'boss', i, t)), (this.aiCount = this.monsters.length);
  }
  setBenchmarkScale(s) {
    this.spawnMonsters(s);
    const i = document.getElementById('bench-entity-count');
    i && (i.textContent = `${this.monsters.length}`);
  }
  setupInput() {
    var i;
    window.addEventListener('keydown', (t) => {
      (t.key === 'w' || t.key === 'W' || t.key === 'ArrowUp') && (this.inputDir.y = -1),
        (t.key === 's' || t.key === 'S' || t.key === 'ArrowDown') && (this.inputDir.y = 1),
        (t.key === 'a' || t.key === 'A' || t.key === 'ArrowLeft') && (this.inputDir.x = -1),
        (t.key === 'd' || t.key === 'D' || t.key === 'ArrowRight') && (this.inputDir.x = 1),
        (t.key === 'q' || t.key === 'Q') && (this.player.useHpPotion(), this.ui.updateHUD()),
        t.key === 'Shift' && this.handleDash(),
        (t.key === 'e' || t.key === 'E') && this.handleInteract(),
        t.key === ' ' && this.handleFireball();
    }),
      window.addEventListener('keyup', (t) => {
        (t.key === 'w' || t.key === 'W' || t.key === 'ArrowUp') &&
          this.inputDir.y < 0 &&
          (this.inputDir.y = 0),
          (t.key === 's' || t.key === 'S' || t.key === 'ArrowDown') &&
            this.inputDir.y > 0 &&
            (this.inputDir.y = 0),
          (t.key === 'a' || t.key === 'A' || t.key === 'ArrowLeft') &&
            this.inputDir.x < 0 &&
            (this.inputDir.x = 0),
          (t.key === 'd' || t.key === 'D' || t.key === 'ArrowRight') &&
            this.inputDir.x > 0 &&
            (this.inputDir.x = 0);
      });
    const s = document.getElementById('game-canvas');
    s.addEventListener('mousemove', (t) => {
      const a = s.getBoundingClientRect(),
        o = t.clientX - a.left - a.width / 2,
        h = t.clientY - a.top - a.height / 2;
      (this.mousePos.x = this.camera.x + o / this.camera.zoom),
        (this.mousePos.y = this.camera.y + h / this.camera.zoom);
    }),
      s.addEventListener('mousedown', (t) => {
        t.button === 0
          ? this.handleSlash()
          : t.button === 2 && (t.preventDefault(), this.handleFireball());
      }),
      s.addEventListener('contextmenu', (t) => t.preventDefault()),
      (i = document.getElementById('btn-quick-hp')) == null ||
        i.addEventListener('click', () => {
          this.player.useHpPotion(), this.ui.updateHUD();
        });
  }
  handleSlash() {
    const s = this.player.performSlash();
    if (s)
      for (let i = 0; i < this.monsters.length; i++) {
        const t = this.monsters[i];
        if (t.hp <= 0) continue;
        const a = t.x - s.x,
          o = t.y - s.y,
          h = s.radius + t.radius;
        if (!(Math.abs(a) > h || Math.abs(o) > h) && a * a + o * o < h * h) {
          const r = Math.hypot(a, o) || 1,
            c = t.takeDamage(s.damage, (a / r) * 30, (o / r) * 30);
          this.spawnFloatingText(t.x, t.y, `-${s.damage}`, '#fde047'),
            c && this.handleMonsterDeath(t);
        }
      }
  }
  handleFireball() {
    const s = this.player.castFireball(this.mousePos.x, this.mousePos.y);
    s &&
      (this.projectiles.push(new H(this, s.x, s.y, s.vx, s.vy, s.damage, !1)), this.ui.updateHUD());
  }
  handleDash() {
    const s = this.player.performDash();
    if (s) {
      this.camera.shake(4, 0.12);
      for (let i = 0; i < this.monsters.length; i++) {
        const t = this.monsters[i];
        if (t.hp <= 0) continue;
        const a = t.x - s.x,
          o = t.y - s.y,
          h = s.radius + t.radius;
        if (!(Math.abs(a) > h || Math.abs(o) > h) && a * a + o * o < h * h) {
          const r = t.takeDamage(
            s.damage,
            (a / (Math.hypot(a, o) || 1)) * 40,
            (o / (Math.hypot(a, o) || 1)) * 40,
          );
          this.spawnFloatingText(t.x, t.y, `-${s.damage}`, '#38bdf8'),
            r && this.handleMonsterDeath(t);
        }
      }
      this.ui.updateHUD();
    }
  }
  handleInteract() {
    var i;
    const s = this.player;
    for (const t of this.npcs)
      if (Math.hypot(t.x - s.x, t.y - s.y) < 50) {
        this.ui.startDialogue(t);
        return;
      }
    for (const t of this.world.chests) {
      if (t.opened) continue;
      if (Math.hypot(t.x - s.x, t.y - s.y) < 46) {
        (t.opened = !0), (i = t.sprite) == null || i.setTint(7434618), x.playCoin();
        const o = 50 + Math.floor(Math.random() * 100);
        (s.gold += o),
          (s.gems += 2),
          (s.hpPotions += 2),
          (s.mpPotions += 2),
          this.spawnFloatingText(t.x, t.y, `+${o} Gold!`, '#facc15'),
          this.spawnFloatingText(t.x, t.y - 16, '+2 Gems & Potions!', '#38bdf8'),
          this.ui.updateHUD();
        return;
      }
    }
  }
  handleMonsterDeath(s) {
    const i = this.player.gainExp(s.expReward);
    this.spawnFloatingText(s.x, s.y, `+${s.expReward} EXP`, '#4ade80'),
      i && this.spawnFloatingText(this.player.x, this.player.y - 24, '✨ LEVEL UP!', '#facc15');
    for (const t of this.player.quests)
      ((t.id === 'quest_slime' && s.type === 'slime') ||
        (t.id === 'quest_goblin' && s.type === 'goblin') ||
        (t.id === 'quest_boss' && s.isBoss)) &&
        t.currentCount < t.targetCount &&
        (t.currentCount++,
        t.currentCount >= t.targetCount &&
          !t.completed &&
          ((t.completed = !0),
          (this.player.gold += t.rewardGold),
          this.player.gainExp(t.rewardExp),
          x.playQuestComplete(),
          this.spawnFloatingText(
            this.player.x,
            this.player.y - 40,
            '📜 QUEST COMPLETE!',
            '#facc15',
          )));
    Math.random() < 0.75 && this.loots.push(new S(this, s.x, s.y, 'coin', s.goldReward)),
      Math.random() < 0.25 && this.loots.push(new S(this, s.x + 8, s.y, 'potion_hp', 1)),
      s.isBoss && this.loots.push(new S(this, s.x, s.y, 'gem', 10)),
      this.ui.updateHUD();
  }
  spawnFloatingText(s, i, t, a = '#ffffff') {
    this.floatingTexts.push(new j(s, i, t, a));
  }
  updateMonsterAI() {
    const s = this.monsterAI,
      i = this.monsters,
      t = this.aiCount;
    let a = 0;
    for (let o = 0; o < t; o++) {
      const h = i[o];
      if (h.hp <= 0) continue;
      const r = a++;
      (this.aiX[r] = h.x),
        (this.aiY[r] = h.y),
        (this.aiHp[r] = h.hp),
        (this.aiMaxHp[r] = h.maxHp),
        (this.aiShoot[r] = h.type === 'skeleton' || h.isBoss ? 1 : 0),
        (this.aiBoss[r] = h.isBoss ? 1 : 0),
        (h.aiIndex = r),
        (h.aiRef = s);
    }
    s.update(
      this.aiX,
      this.aiY,
      this.aiHp,
      this.aiMaxHp,
      this.aiShoot,
      this.aiBoss,
      this.player.x,
      this.player.y,
      a,
    );
  }
  update(s) {
    const i = performance.now();
    this.player.update(s, this.inputDir);
    const t = this.player.x,
      a = this.player.y;
    (this.camera.x += (t - this.camera.x) * Math.min(1, 10 * s)),
      (this.camera.y += (a - this.camera.y) * Math.min(1, 10 * s));
    for (const h of this.npcs) h.update(s, this.world);
    this.updateMonsterAI();
    for (let h = 0; h < this.monsters.length; h++) {
      const r = this.monsters[h];
      if (r.hp <= 0) continue;
      const c = r.update(s, this.player.x, this.player.y, this.world);
      c != null &&
        c.shoot &&
        this.projectiles.push(
          new H(this, c.shoot.x, c.shoot.y, c.shoot.vx, c.shoot.vy, c.shoot.damage, !0),
        );
      const m = this.player.x - r.x,
        u = this.player.y - r.y,
        d = this.player.radius + r.radius;
      if (Math.abs(m) <= d && Math.abs(u) <= d && m * m + u * u < d * d) {
        const f = this.player.takeDamage(r.atk);
        f > 0 &&
          (this.spawnFloatingText(this.player.x, this.player.y, `-${f}`, '#ef4444'),
          this.ui.updateHUD());
      }
    }
    for (let h = this.projectiles.length - 1; h >= 0; h--) {
      const r = this.projectiles[h];
      if (!r.update(s, this.world)) {
        this.projectiles.splice(h, 1);
        continue;
      }
      if (r.isEnemy) {
        const m = this.player.x - r.x,
          u = this.player.y - r.y,
          d = this.player.radius + r.radius;
        if (Math.abs(m) <= d && Math.abs(u) <= d && m * m + u * u < d * d) {
          const f = this.player.takeDamage(r.damage);
          f > 0 &&
            (this.spawnFloatingText(this.player.x, this.player.y, `-${f}`, '#ef4444'),
            this.ui.updateHUD()),
            r.sprite.destroy(),
            this.projectiles.splice(h, 1);
        }
      } else
        for (let m = 0; m < this.monsters.length; m++) {
          const u = this.monsters[m];
          if (u.hp <= 0) continue;
          const d = u.x - r.x,
            f = u.y - r.y,
            p = u.radius + r.radius;
          if (Math.abs(d) <= p && Math.abs(f) <= p && d * d + f * f < p * p) {
            const y = u.takeDamage(r.damage, r.vx * 0.1, r.vy * 0.1);
            this.spawnFloatingText(u.x, u.y, `-${r.damage}`, '#f97316'),
              y && this.handleMonsterDeath(u),
              r.sprite.destroy(),
              this.projectiles.splice(h, 1);
            break;
          }
        }
    }
    for (let h = this.loots.length - 1; h >= 0; h--) {
      const r = this.loots[h];
      r.update(s, this.player.x, this.player.y);
      const c = this.player.x - r.x,
        m = this.player.y - r.y,
        u = this.player.radius + r.radius;
      Math.abs(c) <= u &&
        Math.abs(m) <= u &&
        c * c + m * m < u * u &&
        (r.type === 'coin'
          ? ((this.player.gold += r.value),
            x.playCoin(),
            this.spawnFloatingText(
              this.player.x,
              this.player.y - 10,
              `+${r.value} Gold`,
              '#facc15',
            ))
          : r.type === 'gem'
            ? ((this.player.gems += r.value),
              x.playCoin(),
              this.spawnFloatingText(
                this.player.x,
                this.player.y - 10,
                `+${r.value} Gems!`,
                '#38bdf8',
              ))
            : r.type === 'potion_hp'
              ? ((this.player.hpPotions += r.value),
                x.playPotion(),
                this.spawnFloatingText(
                  this.player.x,
                  this.player.y - 10,
                  `+${r.value} HP Potion`,
                  '#ef4444',
                ))
              : r.type === 'potion_mp' &&
                ((this.player.mpPotions += r.value),
                x.playPotion(),
                this.spawnFloatingText(
                  this.player.x,
                  this.player.y - 10,
                  `+${r.value} MP Potion`,
                  '#3b82f6',
                )),
        r.destroy(),
        this.loots.splice(h, 1),
        this.ui.updateHUD());
    }
    for (let h = this.floatingTexts.length - 1; h >= 0; h--)
      this.floatingTexts[h].update(s) || this.floatingTexts.splice(h, 1);
    const o = performance.now();
    if (
      (this.frameTimes.push(o - i),
      this.frameTimes.length > 60 && this.frameTimes.shift(),
      o - this.lastFpsUpdate > 300)
    ) {
      (this.lastFpsUpdate = o), (this.currentFps = 1 / Math.max(1e-4, s));
      const h = this.frameTimes.reduce((u, d) => u + d, 0) / Math.max(1, this.frameTimes.length);
      this.currentFrameTime = h;
      const r = document.getElementById('bench-fps'),
        c = document.getElementById('bench-frame-time'),
        m = document.getElementById('bench-entity-count');
      r && (r.textContent = this.currentFps.toFixed(1)),
        c && (c.textContent = `${this.currentFrameTime.toFixed(2)}ms`),
        m &&
          (m.textContent = `${this.monsters.length + this.npcs.length + this.projectiles.length}`);
    }
  }
}
new U({ canvas: 'game-canvas', width: 960, height: 640, maxInstances: 1e5, scene: [Q] });
