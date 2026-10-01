/**
 * @file main.ts
 * @description
 * Pluto Quest - 2D クラシックRPG メインエントリーポイント。
 * 流体シミュレーション (Continuum Crowds) を一切使わず、
 * Phaser 同等の直感的なシーン・スプライト・AABB ArcadePhysics 構成で動作する実演デモ。
 */

import { PlutoEngine, Scene } from '@pluto-engine/core';
import { MonsterUtilityAI } from './ai';
import { rpgAudio } from './audio';
import {
  FloatingText,
  Monster,
  type MonsterType,
  Player,
  RPGLoot,
  RPGProjectile,
  TownNPC,
} from './entities';
import { RPGUIManager } from './ui';
import { RPGWorld } from './world';

class RPGScene extends Scene {
  /** ゲーム固有のワールド情報。Phaser 互換の Scene.world とは別物です。 */
  public rpgWorld!: RPGWorld;
  public player!: Player;
  public npcs: TownNPC[] = [];
  public monsters: Monster[] = [];
  public projectiles: RPGProjectile[] = [];
  public loots: RPGLoot[] = [];
  public floatingTexts: FloatingText[] = [];

  public ui!: RPGUIManager;

  private inputDir = { x: 0, y: 0 };
  private mousePos = { x: 0, y: 0 };

  // パフォーマンス計測用
  private frameTimes: number[] = [];
  private lastFpsUpdate = 0;
  private currentFps = 60;
  private currentFrameTime = 0.8;

  /** SoA Utility AI 本体 */
  private readonly monsterAI: MonsterUtilityAI;
  /** AI へ渡す SoA 配列 (.monsters を毎フレーム走査する個体が配列) */
  private readonly aiX: Float32Array;
  private readonly aiY: Float32Array;
  private readonly aiHp: Float32Array;
  private readonly aiMaxHp: Float32Array;
  private readonly aiShoot: Float32Array;
  private readonly aiBoss: Float32Array;
  /** 評価対象とする最大個体数 */
  private aiCount = 0;

  constructor() {
    super({ maxInstances: 100000 });
    this.monsterAI = new MonsterUtilityAI(100000);
    this.aiX = new Float32Array(100000);
    this.aiY = new Float32Array(100000);
    this.aiHp = new Float32Array(100000);
    this.aiMaxHp = new Float32Array(100000);
    this.aiShoot = new Float32Array(100000);
    this.aiBoss = new Float32Array(100000);
  }

  create() {
    // 1. ワールド構築 (町・平原・ダンジョンのタイル & プロップ)
    this.rpgWorld = new RPGWorld(this);

    // 2. 地形から符号付き距離場を生成する。
    // これによりプレイヤーは壁の角で引っかからず滑らかに滑れるようになります。
    this.rpgWorld.buildSDF();

    // 3. プレイヤー生成
    this.player = new Player(this, this.rpgWorld);

    // 4. 町の NPC 生成
    this.spawnTownNPCs();

    // 5. 初期モンスター生成 (標準RPG構成: 80体)
    this.spawnMonsters(80);

    // 6. UI マネージャー初期化
    this.ui = new RPGUIManager(this.player, (count) => {
      this.setBenchmarkScale(count);
    });

    // 7. 入力イベント設定
    this.setupInput();

    // 9. カメラ初期設定 (プレイヤーにフォーカス)
    this.camera.x = this.player.x;
    this.camera.y = this.player.y;
    this.camera.zoom = 1.0;
  }

  private spawnTownNPCs(): void {
    // 長老セドリック (広場の北)
    this.npcs.push(
      new TownNPC(this, 'elder', '長老 セドリック', 'elder', 22 * 32 + 16, 18 * 32 + 16, [
        'おお、若き勇者よ！南の洞窟に魔物の気配が満ちておる。まずはスライムを退治して腕を磨くのじゃ！',
        '街道の東にある川を越えると、獰猛なゴブリンどもが群れておる。準備を怠るでないぞ。',
        '最南端の暗黒遺跡には、かつて王国を滅ぼしかけた大魔竜が眠っておるという…気をつけるのじゃ。',
      ]),
    );

    // 商人ボリス (露店)
    this.npcs.push(
      new TownNPC(this, 'merchant', '商人 ボリス', 'merchant', 16 * 32 + 16, 21 * 32 + 16, [
        'いらっしゃい！良質な鋼鉄の剣や回復薬を取り揃えてるぜ。金さえあれば何でも売ってやるよ！',
      ]),
    );

    // 衛兵長ローランド (町の門)
    this.npcs.push(
      new TownNPC(this, 'guard', '衛兵長 ローランド', 'guard', 44 * 32 + 16, 22 * 32 + 16, [
        'ここから先は危険地帯だ。[LMB]で剣を振り、[RMB]で炎の魔法を放てるぞ。健闘を祈る！',
        '敵に囲まれたら[Shift]の疾風ダッシュで切り抜けるんだ！',
      ]),
    );

    // 巫女ライラ (噴水前)
    this.npcs.push(
      new TownNPC(this, 'priestess', '巫女 ライラ', 'priestess', 24 * 32 + 16, 24 * 32 + 16, [
        '旅のお方、お怪我はありませんか？聖なる泉の力で、あなたの傷と魔力を全快させましょう！',
      ]),
    );
  }

  public spawnMonsters(count: number): void {
    // 既存モンスターの解放
    for (const m of this.monsters) {
      if (m.sprite) m.sprite.destroy();
    }
    this.monsters = [];
    // AI が評価する対象数を記録します
    this.aiCount = 0;

    // モンスターのエリア別配置
    for (let i = 0; i < count; i++) {
      let type: MonsterType = 'slime';
      let x = 0;
      let y = 0;

      const r = Math.random();
      if (r < 0.5) {
        // 平原エリア: スライム
        type = 'slime';
        x = (48 + Math.random() * 38) * 32;
        y = (6 + Math.random() * 40) * 32;
      } else if (r < 0.85) {
        // 森林・遺跡周辺: ゴブリン
        type = 'goblin';
        x = (8 + Math.random() * 78) * 32;
        y = (52 + Math.random() * 20) * 32;
      } else {
        // ダンジョン深部: スケルトン
        type = 'skeleton';
        x = (10 + Math.random() * 74) * 32;
        y = (68 + Math.random() * 18) * 32;
      }

      if (!this.rpgWorld.isBlocked(x, y, 14)) {
        this.monsters.push(new Monster(this, i, type, x, y));
      }
    }

    // ダンジョン最奥のボス (邪竜オーバーロード)
    const bossX = 45 * 32 + 16;
    const bossY = 74 * 32 + 16;
    this.monsters.push(new Monster(this, 999999, 'boss', bossX, bossY));

    // AI の評価対象数を確定します
    this.aiCount = this.monsters.length;
  }

  public setBenchmarkScale(count: number): void {
    this.spawnMonsters(count);
    const badge = document.getElementById('bench-entity-count');
    if (badge) badge.textContent = `${this.monsters.length}`;
  }

  private setupInput(): void {
    // キーボード移動
    window.addEventListener('keydown', (e) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') this.inputDir.y = -1;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') this.inputDir.y = 1;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') this.inputDir.x = -1;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') this.inputDir.x = 1;

      // アクションキー
      if (e.key === 'q' || e.key === 'Q') {
        this.player.useHpPotion();
        this.ui.updateHUD();
      }
      if (e.key === 'Shift') {
        this.handleDash();
      }
      if (e.key === 'e' || e.key === 'E') {
        this.handleInteract();
      }
      if (e.key === ' ') {
        this.handleFireball();
      }
    });

    window.addEventListener('keyup', (e) => {
      if ((e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') && this.inputDir.y < 0)
        this.inputDir.y = 0;
      if ((e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') && this.inputDir.y > 0)
        this.inputDir.y = 0;
      if ((e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') && this.inputDir.x < 0)
        this.inputDir.x = 0;
      if ((e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') && this.inputDir.x > 0)
        this.inputDir.x = 0;
    });

    // マウス操作
    const canvas = document.getElementById('game-canvas')!;
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left - rect.width / 2;
      const screenY = e.clientY - rect.top - rect.height / 2;
      this.mousePos.x = this.camera.x + screenX / this.camera.zoom;
      this.mousePos.y = this.camera.y + screenY / this.camera.zoom;
    });

    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        // 左クリック: 剣攻撃
        this.handleSlash();
      } else if (e.button === 2) {
        // 右クリック: 魔法
        e.preventDefault();
        this.handleFireball();
      }
    });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // クイックHPボタン
    document.getElementById('btn-quick-hp')?.addEventListener('click', () => {
      this.player.useHpPotion();
      this.ui.updateHUD();
    });
  }

  private handleSlash(): void {
    const slash = this.player.performSlash();
    if (!slash) return;

    // AABB 枝刈りによる近接モンスター判定 (Phaser-like Arcade Physics)
    for (let i = 0; i < this.monsters.length; i++) {
      const m = this.monsters[i];
      if (m.hp <= 0) continue;

      const dx = m.x - slash.x;
      const dy = m.y - slash.y;
      const maxR = slash.radius + m.radius;

      // AABB 枝刈り
      if (Math.abs(dx) > maxR || Math.abs(dy) > maxR) continue;

      if (dx * dx + dy * dy < maxR * maxR) {
        const knockLen = Math.hypot(dx, dy) || 1;
        const dead = m.takeDamage(slash.damage, (dx / knockLen) * 30, (dy / knockLen) * 30);
        this.spawnFloatingText(m.x, m.y, `-${slash.damage}`, '#fde047');

        if (dead) {
          this.handleMonsterDeath(m);
        }
      }
    }
  }

  private handleFireball(): void {
    const fireball = this.player.castFireball(this.mousePos.x, this.mousePos.y);
    if (!fireball) return;

    this.projectiles.push(
      new RPGProjectile(
        this,
        fireball.x,
        fireball.y,
        fireball.vx,
        fireball.vy,
        fireball.damage,
        false,
      ),
    );
    this.ui.updateHUD();
  }

  private handleDash(): void {
    const dash = this.player.performDash();
    if (!dash) return;

    this.camera.shake(4, 0.12);

    // 旋風範囲攻撃
    for (let i = 0; i < this.monsters.length; i++) {
      const m = this.monsters[i];
      if (m.hp <= 0) continue;
      const dx = m.x - dash.x;
      const dy = m.y - dash.y;
      const maxR = dash.radius + m.radius;
      if (Math.abs(dx) > maxR || Math.abs(dy) > maxR) continue;

      if (dx * dx + dy * dy < maxR * maxR) {
        const dead = m.takeDamage(
          dash.damage,
          (dx / (Math.hypot(dx, dy) || 1)) * 40,
          (dy / (Math.hypot(dx, dy) || 1)) * 40,
        );
        this.spawnFloatingText(m.x, m.y, `-${dash.damage}`, '#38bdf8');
        if (dead) this.handleMonsterDeath(m);
      }
    }
    this.ui.updateHUD();
  }

  private handleInteract(): void {
    const p = this.player;

    // 1. NPC との会話チェック (半径 48px)
    for (const npc of this.npcs) {
      const dist = Math.hypot(npc.x - p.x, npc.y - p.y);
      if (dist < 50) {
        this.ui.startDialogue(npc);
        return;
      }
    }

    // 2. 宝箱を開ける (半径 44px)
    for (const chest of this.rpgWorld.chests) {
      if (chest.opened) continue;
      const dist = Math.hypot(chest.x - p.x, chest.y - p.y);
      if (dist < 46) {
        chest.opened = true;
        chest.sprite?.setTint(0x71717a); // 開封済みグレー
        rpgAudio.playCoin();

        // 宝箱から大量のゴールドとアイテム
        const goldVal = 50 + Math.floor(Math.random() * 100);
        p.gold += goldVal;
        p.gems += 2;
        p.hpPotions += 2;
        p.mpPotions += 2;

        this.spawnFloatingText(chest.x, chest.y, `+${goldVal} Gold!`, '#facc15');
        this.spawnFloatingText(chest.x, chest.y - 16, `+2 Gems & Potions!`, '#38bdf8');
        this.ui.updateHUD();
        return;
      }
    }
  }

  private handleMonsterDeath(m: Monster): void {
    // EXP 獲得とレベルアップ判定
    const leveled = this.player.gainExp(m.expReward);
    this.spawnFloatingText(m.x, m.y, `+${m.expReward} EXP`, '#4ade80');
    if (leveled) {
      this.spawnFloatingText(this.player.x, this.player.y - 24, '✨ LEVEL UP!', '#facc15');
    }

    // クエスト進行度の加算
    for (const q of this.player.quests) {
      if (
        (q.id === 'quest_slime' && m.type === 'slime') ||
        (q.id === 'quest_goblin' && m.type === 'goblin') ||
        (q.id === 'quest_boss' && m.isBoss)
      ) {
        if (q.currentCount < q.targetCount) {
          q.currentCount++;
          if (q.currentCount >= q.targetCount && !q.completed) {
            q.completed = true;
            this.player.gold += q.rewardGold;
            this.player.gainExp(q.rewardExp);
            rpgAudio.playQuestComplete();
            this.spawnFloatingText(
              this.player.x,
              this.player.y - 40,
              '📜 QUEST COMPLETE!',
              '#facc15',
            );
          }
        }
      }
    }

    // ドロップ品生成 (ゴールド / ポーション / ジェム)
    if (Math.random() < 0.75) {
      this.loots.push(new RPGLoot(this, m.x, m.y, 'coin', m.goldReward));
    }
    if (Math.random() < 0.25) {
      this.loots.push(new RPGLoot(this, m.x + 8, m.y, 'potion_hp', 1));
    }
    if (m.isBoss) {
      this.loots.push(new RPGLoot(this, m.x, m.y, 'gem', 10));
      // 生存個体だけを先頭に詰めます (ipar 配列の隙間をなくす)
    }

    this.ui.updateHUD();
  }

  private spawnFloatingText(x: number, y: number, text: string, color = '#ffffff'): void {
    this.floatingTexts.push(new FloatingText(x, y, text, color));
  }

  /**
   * 生存しているモンスターの状態を SoA へ写し、
   * 一括で Utility AI の效y を採点し直します。
   * 個体ごとの FSM を持たないので、個体追加が他の個体へ影響しません。
   */
  private updateMonsterAI(): void {
    const ai = this.monsterAI;
    const monsters = this.monsters;
    const n = this.aiCount;

    let live = 0;
    for (let i = 0; i < n; i++) {
      const m = monsters[i];
      if (m.hp <= 0) continue;

      // 生存個体だけを先頭に詰めます (ipar 配列の隙間をなくす)
      const dst = live++;
      this.aiX[dst] = m.x;
      this.aiY[dst] = m.y;
      this.aiHp[dst] = m.hp;
      this.aiMaxHp[dst] = m.maxHp;
      this.aiShoot[dst] = m.type === 'skeleton' || m.isBoss ? 1 : 0;
      this.aiBoss[dst] = m.isBoss ? 1 : 0;
      m.aiIndex = dst;
      m.aiRef = ai;
    }

    ai.update(
      this.aiX,
      this.aiY,
      this.aiHp,
      this.aiMaxHp,
      this.aiShoot,
      this.aiBoss,
      this.player.x,
      this.player.y,
      live,
    );
  }

  update(dt: number): void {
    const t0 = performance.now();

    // 1. プレイヤー更新
    this.player.update(dt, this.inputDir);

    // 2. カメラのスムーズ追従 (Lerp)
    const targetCamX = this.player.x;
    const targetCamY = this.player.y;
    this.camera.x += (targetCamX - this.camera.x) * Math.min(1.0, 10 * dt);
    this.camera.y += (targetCamY - this.camera.y) * Math.min(1.0, 10 * dt);

    // 3. NPC 更新
    for (const npc of this.npcs) {
      npc.update(dt, this.rpgWorld);
    }

    // 4. モンスター AI の一括評価 (SoA Utility AI)
    // 個体ごとの FSM ではなく、全個体の效y を 1 回で採点します。
    this.updateMonsterAI();

    // 5. モンスター更新 (Utility AI の結果に基づく行動)
    for (let i = 0; i < this.monsters.length; i++) {
      const m = this.monsters[i];
      if (m.hp <= 0) continue;

      const act = m.update(dt, this.player.x, this.player.y, this.rpgWorld);
      if (act?.shoot) {
        this.projectiles.push(
          new RPGProjectile(
            this,
            act.shoot.x,
            act.shoot.y,
            act.shoot.vx,
            act.shoot.vy,
            act.shoot.damage,
            true,
          ),
        );
      }

      // プレイヤーとの直接接触ダメージ判定 (AABB 枝刈り)
      const dx = this.player.x - m.x;
      const dy = this.player.y - m.y;
      const maxR = this.player.radius + m.radius;
      if (Math.abs(dx) <= maxR && Math.abs(dy) <= maxR) {
        if (dx * dx + dy * dy < maxR * maxR) {
          const dmg = this.player.takeDamage(m.atk);
          if (dmg > 0) {
            this.spawnFloatingText(this.player.x, this.player.y, `-${dmg}`, '#ef4444');
            this.ui.updateHUD();
          }
        }
      }
    }

    // 5. 飛び道具更新 & 衝突判定
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const active = p.update(dt, this.rpgWorld);
      if (!active) {
        this.projectiles.splice(i, 1);
        continue;
      }

      if (p.isEnemy) {
        // 敵弾 vs プレイヤー
        const dx = this.player.x - p.x;
        const dy = this.player.y - p.y;
        const maxR = this.player.radius + p.radius;
        if (Math.abs(dx) <= maxR && Math.abs(dy) <= maxR && dx * dx + dy * dy < maxR * maxR) {
          const dmg = this.player.takeDamage(p.damage);
          if (dmg > 0) {
            this.spawnFloatingText(this.player.x, this.player.y, `-${dmg}`, '#ef4444');
            this.ui.updateHUD();
          }
          p.sprite.destroy();
          this.projectiles.splice(i, 1);
        }
      } else {
        // 味方弾 vs モンスター
        for (let j = 0; j < this.monsters.length; j++) {
          const m = this.monsters[j];
          if (m.hp <= 0) continue;

          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const maxR = m.radius + p.radius;
          if (Math.abs(dx) <= maxR && Math.abs(dy) <= maxR && dx * dx + dy * dy < maxR * maxR) {
            const dead = m.takeDamage(p.damage, p.vx * 0.1, p.vy * 0.1);
            this.spawnFloatingText(m.x, m.y, `-${p.damage}`, '#f97316');
            if (dead) this.handleMonsterDeath(m);

            p.sprite.destroy();
            this.projectiles.splice(i, 1);
            break;
          }
        }
      }
    }

    // 6. ドロップ品更新 & 回収判定
    for (let i = this.loots.length - 1; i >= 0; i--) {
      const loot = this.loots[i];
      loot.update(dt, this.player.x, this.player.y);

      const dx = this.player.x - loot.x;
      const dy = this.player.y - loot.y;
      const maxR = this.player.radius + loot.radius;

      if (Math.abs(dx) <= maxR && Math.abs(dy) <= maxR && dx * dx + dy * dy < maxR * maxR) {
        if (loot.type === 'coin') {
          this.player.gold += loot.value;
          rpgAudio.playCoin();
          this.spawnFloatingText(
            this.player.x,
            this.player.y - 10,
            `+${loot.value} Gold`,
            '#facc15',
          );
        } else if (loot.type === 'gem') {
          this.player.gems += loot.value;
          rpgAudio.playCoin();
          this.spawnFloatingText(
            this.player.x,
            this.player.y - 10,
            `+${loot.value} Gems!`,
            '#38bdf8',
          );
        } else if (loot.type === 'potion_hp') {
          this.player.hpPotions += loot.value;
          rpgAudio.playPotion();
          this.spawnFloatingText(
            this.player.x,
            this.player.y - 10,
            `+${loot.value} HP Potion`,
            '#ef4444',
          );
        } else if (loot.type === 'potion_mp') {
          this.player.mpPotions += loot.value;
          rpgAudio.playPotion();
          this.spawnFloatingText(
            this.player.x,
            this.player.y - 10,
            `+${loot.value} MP Potion`,
            '#3b82f6',
          );
        }

        loot.destroy();
        this.loots.splice(i, 1);
        this.ui.updateHUD();
      }
    }

    // 7. フローティングテキスト更新
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      if (!this.floatingTexts[i].update(dt)) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // 8. ベンチマーク・プロファイラー統計更新
    const t1 = performance.now();
    this.frameTimes.push(t1 - t0);
    if (this.frameTimes.length > 60) this.frameTimes.shift();

    if (t1 - this.lastFpsUpdate > 300) {
      this.lastFpsUpdate = t1;
      this.currentFps = 1 / Math.max(0.0001, dt);
      const avgFt =
        this.frameTimes.reduce((a, b) => a + b, 0) / Math.max(1, this.frameTimes.length);
      this.currentFrameTime = avgFt;

      const fpsElem = document.getElementById('bench-fps');
      const ftElem = document.getElementById('bench-frame-time');
      const entElem = document.getElementById('bench-entity-count');

      if (fpsElem) fpsElem.textContent = this.currentFps.toFixed(1);
      if (ftElem) ftElem.textContent = `${this.currentFrameTime.toFixed(2)}ms`;
      if (entElem)
        entElem.textContent = `${this.monsters.length + this.npcs.length + this.projectiles.length}`;
    }
  }
}

// エンジンの起動
new PlutoEngine({
  canvas: 'game-canvas',
  width: 960,
  height: 640,
  maxInstances: 100000,
  scene: [RPGScene],
});
