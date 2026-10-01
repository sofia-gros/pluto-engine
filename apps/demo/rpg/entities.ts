/**
 * @file entities.ts
 * @description
 * 2D クラシックRPGのキャラクター、モンスター、NPC、飛び道具、ドロップ品。
 * Continuum Crowds (流体シミュレーション) は一切使用せず、
 * Phaser 同様の古典的なステートマシンAIと ArcadePhysics AABB コリジョンで動作します。
 */

import type { Scene, Sprite } from '@pluto-engine/core';
import { MonsterAction, type MonsterUtilityAI } from './ai';
import { rpgAudio } from './audio';
import type { RPGWorld } from './world';

export interface WeaponData {
  id: string;
  name: string;
  atk: number;
  price: number;
  color: number;
  description: string;
}

export interface ArmorData {
  id: string;
  name: string;
  def: number;
  price: number;
  color: number;
  description: string;
}

export const WEAPONS: Record<string, WeaponData> = {
  bronze_sword: {
    id: 'bronze_sword',
    name: '銅の剣',
    atk: 10,
    price: 0,
    color: 0xcd7f32,
    description: '冒険者ギルド支給の標準的な剣。',
  },
  iron_blade: {
    id: 'iron_blade',
    name: '鋼鉄のブロードソード',
    atk: 25,
    price: 150,
    color: 0x94a3b8,
    description: '鋭い刃を持つ良質な鋼鉄の剣。',
  },
  flame_katana: {
    id: 'flame_katana',
    name: '炎熱の刀',
    atk: 45,
    price: 400,
    color: 0xf97316,
    description: '赤熱した刀身が敵を焼き尽くす。',
  },
  excalibur: {
    id: 'excalibur',
    name: '聖剣エクスカリバー',
    atk: 90,
    price: 1000,
    color: 0x38bdf8,
    description: '伝説の光を放つ至高の神剣。',
  },
};

export const ARMORS: Record<string, ArmorData> = {
  leather_tunic: {
    id: 'leather_tunic',
    name: '革の服',
    def: 2,
    price: 0,
    color: 0x92400e,
    description: '動きやすい軽量な革の鎧。',
  },
  iron_plate: {
    id: 'iron_plate',
    name: '鋼鉄のプレートメイル',
    def: 8,
    price: 180,
    color: 0x64748b,
    description: '強固な鉄板で鍛造された重装鎧。',
  },
  dragon_scale: {
    id: 'dragon_scale',
    name: '竜鱗の戦甲',
    def: 20,
    price: 650,
    color: 0xef4444,
    description: '火竜の強靭な鱗で作られた伝説の鎧。',
  },
};

export interface Quest {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardGold: number;
  rewardExp: number;
  completed: boolean;
  claimed: boolean;
}

export class Player {
  public scene: Scene;
  public world: RPGWorld;
  public sprite: Sprite;
  public slashSprite: Sprite;

  /** 移動の書き込み先。毎フレーム new しないため共有します。 */
  private static readonly _moveOut = new Float32Array(2);

  public x = 22 * 32 + 16;
  public y = 24 * 32 + 16;
  public vx = 0;
  public vy = 0;
  public facing = 1;
  public radius = 14;

  // RPG Stats
  public level = 1;
  public exp = 0;
  public expNext = 50;
  public hp = 100;
  public maxHp = 100;
  public mp = 60;
  public maxMp = 60;
  public baseSpeed = 160;

  public gold = 80;
  public gems = 0;

  public weapon: WeaponData = WEAPONS.bronze_sword;
  public armor: ArmorData = ARMORS.leather_tunic;
  public hpPotions = 3;
  public mpPotions = 2;

  // Active Quests
  public quests: Quest[] = [
    {
      id: 'quest_slime',
      title: 'スライム洞窟の討伐',
      description: '平原の南に繁殖したスライムを 10体 討伐する。',
      targetCount: 10,
      currentCount: 0,
      rewardGold: 100,
      rewardExp: 80,
      completed: false,
      claimed: false,
    },
    {
      id: 'quest_goblin',
      title: 'ゴブリン部隊の迎撃',
      description: '遺跡周辺を占拠するゴブリン戦士を 8体 討伐する。',
      targetCount: 8,
      currentCount: 0,
      rewardGold: 250,
      rewardExp: 180,
      completed: false,
      claimed: false,
    },
    {
      id: 'quest_boss',
      title: 'ダンジョン最奥の覇王撃破',
      description: '最南端のボス部屋に巣食う邪竜オーバーロードを討ち果たす。',
      targetCount: 1,
      currentCount: 0,
      rewardGold: 1000,
      rewardExp: 1000,
      completed: false,
      claimed: false,
    },
  ];

  // Combat Timers
  public attackCooldown = 0;
  public slashAnimTimer = 0;
  public dashCooldown = 0;
  public invulnerableTimer = 0;

  constructor(scene: Scene, world: RPGWorld) {
    this.scene = scene;
    this.world = world;

    // プレイヤーの本体スプライト
    this.sprite = scene.add.sprite(this.x, this.y);
    this.sprite.setDisplaySize(26, 26);
    this.sprite.setTint(0x38bdf8); // 勇者スカイブルー

    // 剣の斬撃エフェクトスプライト
    this.slashSprite = scene.add.sprite(-1000, -1000);
    this.slashSprite.setDisplaySize(36, 36);
    this.slashSprite.setTint(0xfef08a);
  }

  public get attackPower(): number {
    return 10 + this.level * 4 + this.weapon.atk;
  }

  public get defensePower(): number {
    return 2 + this.level * 2 + this.armor.def;
  }

  public update(dt: number, inputDir: { x: number; y: number }): void {
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.dashCooldown > 0) this.dashCooldown -= dt;
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
      this.sprite.setTint(Math.floor(this.invulnerableTimer * 20) % 2 === 0 ? 0xffffff : 0x38bdf8);
    } else {
      this.sprite.setTint(0x38bdf8);
    }

    // MP 自然回復 (毎秒 4 MP)
    this.mp = Math.min(this.maxMp, this.mp + 4 * dt);

    // 移動処理
    let speed = this.baseSpeed;
    if (inputDir.x !== 0 || inputDir.y !== 0) {
      const len = Math.hypot(inputDir.x, inputDir.y) || 1;
      const nx = inputDir.x / len;
      const ny = inputDir.y / len;

      if (nx !== 0) this.facing = nx > 0 ? 1 : -1;

      // SDF の法線へ移動を射影し、壁に沿って滑らかに滑ります。
      // X/Y 軸分離の AABB 判定では角で移動が止まってしまいます。
      this.world.slideMove(
        this.x,
        this.y,
        this.radius,
        nx * speed * dt,
        ny * speed * dt,
        Player._moveOut,
      );
      this.x = Player._moveOut[0];
      this.y = Player._moveOut[1];
    }

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.facing = this.facing;

    // 斬撃アニメーション更新
    if (this.slashAnimTimer > 0) {
      this.slashAnimTimer -= dt;
      this.slashSprite.x = this.x + this.facing * 20;
      this.slashSprite.y = this.y;
      this.slashSprite.facing = this.facing;
      if (this.slashAnimTimer <= 0) {
        this.slashSprite.x = -1000;
        this.slashSprite.y = -1000;
      }
    }
  }

  /**
   * 剣による近接攻撃 (Phaser風の扇状・矩形スイング)
   */
  public performSlash(): { x: number; y: number; radius: number; damage: number } | null {
    if (this.attackCooldown > 0) return null;
    this.attackCooldown = 0.22;
    this.slashAnimTimer = 0.12;

    rpgAudio.playSwordSlash();
    this.slashSprite.x = this.x + this.facing * 20;
    this.slashSprite.y = this.y;
    this.slashSprite.setTint(this.weapon.color);

    return {
      x: this.x + this.facing * 24,
      y: this.y,
      radius: 28,
      damage: this.attackPower,
    };
  }

  /**
   * 魔法ファイアボール発射
   */
  public castFireball(
    targetX: number,
    targetY: number,
  ): { x: number; y: number; vx: number; vy: number; damage: number } | null {
    if (this.mp < 12) return null;
    this.mp -= 12;

    rpgAudio.playFireball();
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const len = Math.hypot(dx, dy) || 1;
    const spd = 340;

    return {
      x: this.x + (dx / len) * 20,
      y: this.y + (dy / len) * 20,
      vx: (dx / len) * spd,
      vy: (dy / len) * spd,
      damage: Math.floor(this.attackPower * 1.5),
    };
  }

  /**
   * 旋風ダッシュ / 必殺技
   */
  public performDash(): { x: number; y: number; radius: number; damage: number } | null {
    if (this.dashCooldown > 0 || this.mp < 20) return null;
    this.dashCooldown = 1.0;
    this.mp -= 20;
    this.invulnerableTimer = 0.35;

    rpgAudio.playDash();

    // 前方に瞬間加速
    const dashDist = 80;
    const nextX = this.x + this.facing * dashDist;
    if (!this.world.isBlocked(nextX, this.y, this.radius)) {
      this.x = nextX;
    }

    return {
      x: this.x,
      y: this.y,
      radius: 60,
      damage: Math.floor(this.attackPower * 2.0),
    };
  }

  public takeDamage(amount: number): number {
    if (this.invulnerableTimer > 0) return 0;
    const actualDamage = Math.max(1, amount - this.defensePower);
    this.hp -= actualDamage;
    this.invulnerableTimer = 0.4;
    rpgAudio.playHit();
    this.scene.camera.shake(6, 0.15);
    return actualDamage;
  }

  public gainExp(amount: number): boolean {
    this.exp += amount;
    let leveledUp = false;
    while (this.exp >= this.expNext) {
      this.exp -= this.expNext;
      this.level++;
      this.expNext = Math.floor(this.expNext * 1.5 + 20);
      this.maxHp += 20;
      this.hp = this.maxHp;
      this.maxMp += 10;
      this.mp = this.maxMp;
      leveledUp = true;
      rpgAudio.playLevelUp();
    }
    return leveledUp;
  }

  public useHpPotion(): boolean {
    if (this.hpPotions <= 0 || this.hp >= this.maxHp) return false;
    this.hpPotions--;
    this.hp = Math.min(this.maxHp, this.hp + 50);
    rpgAudio.playPotion();
    return true;
  }

  public useMpPotion(): boolean {
    if (this.mpPotions <= 0 || this.mp >= this.maxMp) return false;
    this.mpPotions--;
    this.mp = Math.min(this.maxMp, this.mp + 40);
    rpgAudio.playPotion();
    return true;
  }
}

export type NPCType = 'elder' | 'merchant' | 'guard' | 'priestess';

export class TownNPC {
  public id: string;
  public name: string;
  public type: NPCType;
  public x: number;
  public y: number;
  public originX: number;
  public originY: number;
  public sprite: Sprite;
  public facing = 1;
  public radius = 16;

  public wanderTimer = 0;
  public isMoving = false;
  public moveTarget = { x: 0, y: 0 };
  public dialogs: string[];

  constructor(
    scene: Scene,
    id: string,
    name: string,
    type: NPCType,
    x: number,
    y: number,
    dialogs: string[],
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.dialogs = dialogs;

    this.sprite = scene.add.sprite(x, y);
    this.sprite.setDisplaySize(26, 26);

    switch (type) {
      case 'elder':
        this.sprite.setTint(0xfacc15); // 長老: ゴールド
        break;
      case 'merchant':
        this.sprite.setTint(0x4ade80); // 商人: エメラルドグリーン
        break;
      case 'guard':
        this.sprite.setTint(0x94a3b8); // 衛兵: シルバー
        break;
      case 'priestess':
        this.sprite.setTint(0xf472b6); // 巫女: ピンク
        break;
    }
  }

  public update(dt: number, world: RPGWorld): void {
    this.wanderTimer -= dt;
    if (this.wanderTimer <= 0) {
      this.wanderTimer = 2.0 + Math.random() * 3.0;
      if (Math.random() < 0.6) {
        this.isMoving = true;
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.random() * 40;
        this.moveTarget = {
          x: this.originX + Math.cos(ang) * dist,
          y: this.originY + Math.sin(ang) * dist,
        };
      } else {
        this.isMoving = false;
      }
    }

    if (this.isMoving) {
      const dx = this.moveTarget.x - this.x;
      const dy = this.moveTarget.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 4) {
        const spd = 35;
        const nx = dx / dist;
        const ny = dy / dist;
        this.facing = nx > 0 ? 1 : -1;
        const nextX = this.x + nx * spd * dt;
        const nextY = this.y + ny * spd * dt;
        if (!world.isBlocked(nextX, nextY, this.radius)) {
          this.x = nextX;
          this.y = nextY;
        } else {
          this.isMoving = false;
        }
      } else {
        this.isMoving = false;
      }
    }

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.facing = this.facing;
  }
}

export type MonsterType = 'slime' | 'goblin' | 'skeleton' | 'boss';

export class Monster {
  public id: number;
  public type: MonsterType;
  public x: number;
  public y: number;
  public vx = 0;
  public vy = 0;
  public hp: number;
  public maxHp: number;
  public atk: number;
  public expReward: number;
  public goldReward: number;
  public speed: number;
  public radius: number;
  public sprite: Sprite;
  public facing = 1;

  // Utility AI 用のインデックスと参照。
  // 遷移グラフは持たず、SoA で採点された結果を行動として使います。
  public aiIndex = 0;
  public aiRef: MonsterUtilityAI | null = null;

  /** 攻撃間隔 (秒) */
  public actionTimer = 0;
  /** 索敵の開始距離。Utility AI の giveUpRange と対になる値です */
  public aggroRange = 260;
  public isBoss = false;

  constructor(scene: Scene, id: number, type: MonsterType, x: number, y: number) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;

    this.sprite = scene.add.sprite(x, y);

    switch (type) {
      case 'slime':
        this.hp = 30;
        this.maxHp = 30;
        this.atk = 12;
        this.speed = 70;
        this.radius = 12;
        this.expReward = 15;
        this.goldReward = 8;
        this.sprite.setDisplaySize(22, 22);
        this.sprite.setTint(0x22c55e); // スライムグリーン
        break;
      case 'goblin':
        this.hp = 65;
        this.maxHp = 65;
        this.atk = 22;
        this.speed = 105;
        this.radius = 14;
        this.expReward = 35;
        this.goldReward = 20;
        this.sprite.setDisplaySize(26, 26);
        this.sprite.setTint(0xd97706); // ゴブリンオレンジ
        break;
      case 'skeleton':
        this.hp = 90;
        this.maxHp = 90;
        this.atk = 28;
        this.speed = 80;
        this.radius = 15;
        this.expReward = 60;
        this.goldReward = 40;
        this.sprite.setDisplaySize(28, 28);
        this.sprite.setTint(0xe2e8f0); // スケルトンホワイト
        break;
      case 'boss':
        this.isBoss = true;
        this.hp = 1200;
        this.maxHp = 1200;
        this.atk = 45;
        this.speed = 60;
        this.radius = 36;
        this.aggroRange = 500;
        this.expReward = 800;
        this.goldReward = 600;
        this.sprite.setDisplaySize(64, 64);
        this.sprite.setTint(0xdc2626); // ドラゴン真紅
        break;
    }
  }

  public update(
    dt: number,
    playerX: number,
    playerY: number,
    world: RPGWorld,
  ): { shoot?: { x: number; y: number; vx: number; vy: number; damage: number } } | null {
    if (this.hp <= 0) return null;

    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.hypot(dx, dy);

    this.actionTimer -= dt;

    // 行動は SoA Utility AI が決めています。
    // 遷移グラフを個体に持たせないため、個体追加が他へ影響しません。
    const action =
      this.aiRef !== null ? this.aiRef.actionOf(this.aiIndex) : MonsterAction.Idle;

    const invDist = dist > 1e-4 ? 1.0 / dist : 0;
    const nx = dx * invDist;
    const ny = dy * invDist;

    // 移動は選択された行動に応じます
    let moveX = 0;
    let moveY = 0;
    switch (action) {
      case MonsterAction.Chase:
        moveX = nx;
        moveY = ny;
        break;
      case MonsterAction.Retreat:
        // プレイヤーから離れる
        moveX = -nx;
        moveY = -ny;
        break;
      case MonsterAction.KeepDistance:
        // 近づきすぎない (スケルトン・ボスの射撃陣形)
        moveX = -nx;
        moveY = -ny;
        break;
      case MonsterAction.Attack:
        // 攻撃行動では足止め
        moveX = 0;
        moveY = 0;
        break;
      case MonsterAction.Idle:
      default:
        moveX = 0;
        moveY = 0;
        break;
    }

    if (moveX !== 0 || moveY !== 0) {
      this.facing = moveX > 0 ? 1 : -1;
      const nextX = this.x + moveX * this.speed * dt;
      const nextY = this.y + moveY * this.speed * dt;
      if (!world.isBlocked(nextX, this.y, this.radius)) this.x = nextX;
      if (!world.isBlocked(this.x, nextY, this.radius)) this.y = nextY;
    }

      // 距離に関係なく発射します
    if (
      (this.type === 'skeleton' || this.isBoss) &&
      this.actionTimer <= 0 &&
      dist > 1e-4
    ) {
      this.actionTimer = this.isBoss ? 2.5 : 2.0;
      const spd = this.isBoss ? 180 : 200;
      return {
        shoot: {
          x: this.x,
          y: this.y,
          vx: nx * spd,
          vy: ny * spd,
          damage: this.atk,
        },
      };
    }

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.facing = this.facing;
    return null;
  }

  public takeDamage(damage: number, knockX = 0, knockY = 0): boolean {
    this.hp -= damage;
    rpgAudio.playHit();

    // ノックバック (ボスは軽減)
    const factor = this.isBoss ? 0.2 : 1.0;
    this.x += knockX * factor;
    this.y += knockY * factor;

    if (this.hp <= 0) {
      // FSM を廃したので state フラグは持ちません。
      // 死亡は hp <= 0 だけで表現されます。
      this.sprite.destroy();
      return true; // 死亡
    }
    return false;
  }
}

export class RPGProjectile {
  public sprite: Sprite;
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public radius: number;
  public damage: number;
  public lifetime = 2.5;
  public isEnemy = false;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number,
    isEnemy = false,
  ) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.radius = isEnemy ? 6 : 8;
    this.isEnemy = isEnemy;

    this.sprite = scene.add.sprite(x, y);
    const size = isEnemy ? 14 : 18;
    this.sprite.setDisplaySize(size, size);
    this.sprite.setTint(isEnemy ? 0x9333ea : 0xf97316); // 敵弾: 紫, 味方弾: 火炎オレンジ
  }

  public update(dt: number, world: RPGWorld): boolean {
    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.sprite.destroy();
      return false;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (world.isBlocked(this.x, this.y, this.radius)) {
      this.sprite.destroy();
      return false; // 壁に衝突して消滅
    }

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    return true;
  }
}

export class RPGLoot {
  public sprite: Sprite;
  public x: number;
  public y: number;
  public type: 'coin' | 'gem' | 'potion_hp' | 'potion_mp';
  public value: number;
  public radius = 12;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    type: 'coin' | 'gem' | 'potion_hp' | 'potion_mp',
    value = 1,
  ) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.value = value;

    this.sprite = scene.add.sprite(x, y);
    this.sprite.setDisplaySize(16, 16);

    switch (type) {
      case 'coin':
        this.sprite.setTint(0xfacc15); // ゴールド
        break;
      case 'gem':
        this.sprite.setTint(0x38bdf8); // ダイヤブルー
        break;
      case 'potion_hp':
        this.sprite.setTint(0xef4444); // 赤ポーション
        break;
      case 'potion_mp':
        this.sprite.setTint(0x3b82f6); // 青ポーション
        break;
    }
  }

  public update(dt: number, playerX: number, playerY: number): void {
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.hypot(dx, dy);

    // 吸い寄せマグネット (120px以内)
    if (dist < 120 && dist > 1) {
      const spd = 240;
      this.x += (dx / dist) * spd * dt;
      this.y += (dy / dist) * spd * dt;
      this.sprite.x = this.x;
      this.sprite.y = this.y;
    }
  }

  public destroy(): void {
    this.sprite.destroy();
  }
}

export class FloatingText {
  public x: number;
  public y: number;
  public text: string;
  public color: string;
  public lifetime = 0.8;
  public maxLifetime = 0.8;

  constructor(x: number, y: number, text: string, color = '#ffffff') {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
  }

  public update(dt: number): boolean {
    this.lifetime -= dt;
    this.y -= 30 * dt; // 上に浮かび上がる
    return this.lifetime > 0;
  }
}
