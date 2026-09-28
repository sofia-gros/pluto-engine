import { PlutoEngine, Scene } from '@pluto-engine/core';
import { MortonPlugin } from '@pluto-engine/morton';

import { ContinuumFlowGrid, Player, SwarmSystem } from './gameLogic.js';
import { InteractiveSkillTreeUI, SaveManager, SkillTreeGraph } from './tree.js';

class GameScene extends Scene {
  private player!: Player;
  private swarm!: SwarmSystem;
  private flow!: ContinuumFlowGrid;

  private treeGraph!: SkillTreeGraph;
  private treeUI!: InteractiveSkillTreeUI;
  private saveData: any;

  private surviveDuration = 10 * 60;
  private elapsedTime = 0;
  private isGameOver = false;
  private isPaused = false;
  private bossSpawnsDone = new Set<number>();
  private inputDir = { x: 0, y: 0 };

  constructor() {
    super({ maxInstances: 50000 });
    this.registerPlugin(new MortonPlugin(64));
  }

  create() {
    this.saveData = SaveManager.load();
    this.treeGraph = new SkillTreeGraph();
    this.treeUI = new InteractiveSkillTreeUI(this.treeGraph, this.saveData, () => {
      this.player.recalculateStats(this.getComputedTreeStats());
    });

    this.flow = new ContinuumFlowGrid(96, 96, 24);
    this.swarm = new SwarmSystem(this, 40000);
    this.player = new Player(this, 0, 0);

    this.initControls();

    window.addEventListener('hardcore-levelup', (e: any) => this.showLevelUpModal(e.detail.level));
    window.addEventListener('hardcore-death', () => this.triggerGameOver(false));

    document.getElementById('btn-tree-restart')!.onclick = () => this.restartGame();
    this.restartGame();
  }

  getComputedTreeStats() {
    const stats: any = {};
    for (const [id, node] of this.treeGraph.nodes) {
      const lvl = this.saveData.nodeLevels[id] || 0;
      if (lvl > 0 && node.statKey !== 'none') {
        stats[node.statKey] = (stats[node.statKey] || 0) + node.stepVal * lvl;
      }
    }
    return stats;
  }

  restartGame() {
    this.elapsedTime = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.bossSpawnsDone.clear();

    if (this.player?.sprite) this.player.sprite.destroy();
    this.player = new Player(this, 0, 0);
    this.player.recalculateStats(this.getComputedTreeStats());

    this.arena.clear();
    // re-init swarm if needed, but clearing arena is mostly enough.
    this.swarm.dropCount = 0;
    this.swarm.projCount = 0;

    document.getElementById('boss-alert')!.classList.add('hidden');
    const treeModal = document.getElementById('tree-modal')!;
    treeModal.classList.add('hidden');
    treeModal.classList.remove('flex');
    const lvlModal = document.getElementById('levelup-modal')!;
    lvlModal.classList.add('hidden');
    lvlModal.classList.remove('flex');

    this.spawnNormalHorde(18);
  }

  spawnNormalHorde(count: number) {
    const p = this.player;
    const timeMin = this.elapsedTime / 60;
    const hpFactor = Math.pow(1.0 + timeMin * 0.5, 2.5);

    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = 280 + Math.random() * 220;

      let type = 0;
      let hp = 18 * hpFactor;
      let spd = 62 + Math.random() * 20;
      let knockResist = 0.0;
      let atk = 22 + timeMin * 6;
      let scale = 20;

      if (timeMin >= 0.5 && Math.random() < 0.35) {
        type = 1;
        hp = 45 * hpFactor;
        spd = 72 + Math.random() * 15;
        knockResist = 0.25;
        atk = 32 + timeMin * 8;
      }

      if (timeMin >= 1.5 && Math.random() < 0.25) {
        type = 2;
        hp = 110 * hpFactor;
        spd = 50 + Math.random() * 10;
        knockResist = 0.85;
        atk = 48 + timeMin * 10;
        scale = 24;
      }

      this.swarm.spawn(
        p.x + Math.cos(ang) * dist,
        p.y + Math.sin(ang) * dist,
        type,
        hp,
        spd,
        knockResist,
        atk,
        scale,
      );
    }
  }

  spawnBoss(tier = 1) {
    const p = this.player;
    const ang = Math.random() * Math.PI * 2;
    const dist = 320;
    const hp = 1800 * Math.pow(tier, 2.3);
    const spd = 48 + tier * 8;
    const knockResist = 1.0;
    const atk = 65 + tier * 30;
    const scale = 44;

    this.swarm.spawn(
      p.x + Math.cos(ang) * dist,
      p.y + Math.sin(ang) * dist,
      3,
      hp,
      spd,
      knockResist,
      atk,
      scale,
    );

    const alert = document.getElementById('boss-alert')!;
    alert.innerText = `⚠️ Tier ${tier} ボス出現！ノックバック完全無効 (HP ${Math.round(hp)}) ⚠️`;
    alert.classList.remove('hidden');
    setTimeout(() => alert.classList.add('hidden'), 4500);
  }

  initControls() {
    const base = document.getElementById('joystick-base')!;
    const thumb = document.getElementById('joystick-thumb')!;
    let touchId: number | null = null;
    let startX = 0,
      startY = 0;

    window.addEventListener(
      'touchstart',
      (e) => {
        if (this.isPaused || this.isGameOver || touchId !== null) return;
        const t = e.changedTouches[0];
        if (t.clientY > window.innerHeight * 0.3) {
          touchId = t.identifier;
          startX = t.clientX;
          startY = t.clientY;
          base.style.left = `${startX - 56}px`;
          base.style.top = `${startY - 56}px`;
          thumb.style.transform = `translate(-50%, -50%)`;
          base.classList.remove('hidden');
        }
      },
      { passive: false },
    );

    window.addEventListener(
      'touchmove',
      (e) => {
        if (touchId === null) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === touchId) {
            const dx = t.clientX - startX;
            const dy = t.clientY - startY;
            const dist = Math.hypot(dx, dy);
            const maxR = 45;
            const clampedR = Math.min(dist, maxR);
            const ang = Math.atan2(dy, dx);
            const nx = Math.cos(ang) * clampedR;
            const ny = Math.sin(ang) * clampedR;
            thumb.style.transform = `translate(calc(-50% + ${nx}px), calc(-50% + ${ny}px))`;
            this.inputDir.x = dist > 5 ? Math.cos(ang) * (clampedR / maxR) : 0;
            this.inputDir.y = dist > 5 ? Math.sin(ang) * (clampedR / maxR) : 0;
            break;
          }
        }
      },
      { passive: false },
    );

    const endTouch = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          touchId = null;
          base.classList.add('hidden');
          this.inputDir.x = 0;
          this.inputDir.y = 0;
          break;
        }
      }
    };
    window.addEventListener('touchend', endTouch);
    window.addEventListener('touchcancel', endTouch);

    const keys: Record<string, boolean> = {};
    window.addEventListener('keydown', (e) => {
      keys[e.code] = true;
    });
    window.addEventListener('keyup', (e) => {
      keys[e.code] = false;
    });

    this.updateKeyInput = () => {
      if (touchId !== null) return;
      let kx = 0,
        ky = 0;
      if (keys['KeyW'] || keys['ArrowUp']) ky -= 1;
      if (keys['KeyS'] || keys['ArrowDown']) ky += 1;
      if (keys['KeyA'] || keys['ArrowLeft']) kx -= 1;
      if (keys['KeyD'] || keys['ArrowRight']) kx += 1;
      const len = Math.hypot(kx, ky);
      this.inputDir.x = len > 0 ? kx / len : 0;
      this.inputDir.y = len > 0 ? ky / len : 0;
    };
  }

  updateKeyInput!: () => void;

  showLevelUpModal(_lvl: number) {
    this.isPaused = true;
    const modal = document.getElementById('levelup-modal')!;
    const container = document.getElementById('skill-choices')!;
    container.innerHTML = '';

    const catalog = [
      { id: 'magic_wand', name: '魔導弾', desc: '近接敵へ誘導弾を連射' },
      { id: 'holy_orbit', name: '聖球', desc: '周囲を旋回する聖なる球（小ノックバック）' },
      { id: 'garlic_aura', name: '聖域衝撃', desc: '数秒ごとに周囲へ小波紋を放つ' },
      { id: 'lightning_strike', name: '天罰雷雲', desc: 'ランダムな敵1体へ落雷' },
    ];

    const pool = [...catalog].sort(() => Math.random() - 0.5).slice(0, 3);
    for (const skill of pool) {
      const curLvl = this.player.skills.get(skill.id) || 0;
      const btn = document.createElement('button');
      btn.className =
        'w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-left transition-all active:scale-95';
      btn.innerHTML = `
        <div>
          <div class="font-black text-amber-300 text-xs sm:text-sm">${skill.name} <span class="text-[10px] text-cyan-400 font-mono">Lv.${curLvl} → ${curLvl + 1}</span></div>
          <p class="text-[10px] text-slate-400 mt-0.5">${skill.desc}</p>
        </div>
        <span class="text-base">✨</span>
      `;
      btn.onclick = () => {
        this.player.skills.set(skill.id, curLvl + 1);
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        this.isPaused = false;
      };
      container.appendChild(btn);
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  triggerGameOver(won = false) {
    this.isGameOver = true;
    this.isPaused = true;

    this.saveData.coins += this.player.runCoins;
    SaveManager.save(this.saveData.coins, this.saveData.nodeLevels);

    const modal = document.getElementById('tree-modal')!;
    const title = document.getElementById('tree-modal-title')!;
    const sub = document.getElementById('tree-modal-sub')!;

    const m = Math.floor(this.elapsedTime / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(this.elapsedTime % 60)
      .toString()
      .padStart(2, '0');
    sub.innerText = `生存時間: ${m}:${s} | 獲得コイン: +${this.player.runCoins}🪙 | スキルツリーを開放して次へ挑め`;

    title.innerText = won ? '🎉 10-MINUTE VICTORY!' : 'SURVIVAL FAILED';
    title.className = `text-base sm:text-lg font-black ${won ? 'text-amber-400' : 'text-rose-500'}`;

    document.getElementById('total-coins')!.innerText = this.saveData.coins.toLocaleString();

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    setTimeout(() => {
      this.treeUI.resize();
      this.treeUI.render();
    }, 50);
  }

  update(dt: number) {
    if (this.isPaused || this.isGameOver || !this.player) return;

    this.elapsedTime += dt;

    if (this.elapsedTime >= this.surviveDuration) {
      this.triggerGameOver(true);
      return;
    }

    this.updateKeyInput();
    const treeStats = this.getComputedTreeStats();

    if (this.elapsedTime >= 120 && !this.bossSpawnsDone.has(1)) {
      this.bossSpawnsDone.add(1);
      this.spawnBoss(1);
    }
    if (this.elapsedTime >= 300 && !this.bossSpawnsDone.has(2)) {
      this.bossSpawnsDone.add(2);
      this.spawnBoss(2);
    }
    if (this.elapsedTime >= 480 && !this.bossSpawnsDone.has(3)) {
      this.bossSpawnsDone.add(3);
      this.spawnBoss(3);
    }

    const targetCount = Math.min(
      15000,
      Math.floor(25 + Math.pow(this.elapsedTime / 60, 2.2) * 220),
    );
    if (this.arena.activeCount < targetCount) {
      this.spawnNormalHorde(Math.min(targetCount - this.arena.activeCount, 15));
    }

    this.flow.updatePlayerCenter(this.player.x, this.player.y);
    this.player.update(dt, this.inputDir, this.swarm, treeStats, this);
    this.swarm.update(dt, this.player, this.flow, treeStats);

    this.updateHUD();

    // Camera follow player logic
    this.camera.x = this.player.x;
    this.camera.y = this.player.y;
    this.camera.zoom = 1.4;
  }

  updateHUD() {
    const p = this.player;
    const hpPct = Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100));
    document.getElementById('hp-bar')!.style.width = `${hpPct}%`;
    document.getElementById('hp-text')!.innerText = `${Math.ceil(p.hp)}/${p.maxHp}`;

    document.getElementById('player-lvl')!.innerText = `Lv.${p.level}`;
    const expPct = Math.min(100, (p.exp / p.expNext) * 100);
    document.getElementById('exp-bar')!.style.width = `${expPct}%`;

    const rem = Math.max(0, this.surviveDuration - this.elapsedTime);
    const m = Math.floor(rem / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(rem % 60)
      .toString()
      .padStart(2, '0');
    document.getElementById('game-timer')!.innerText = `${m}:${s}`;

    document.getElementById('run-coins')!.innerText = p.runCoins.toLocaleString();
    document.getElementById('horde-count')!.innerText = this.arena.activeCount.toLocaleString();
  }
}

new PlutoEngine({
  canvas: 'game-canvas',
  maxInstances: 50000,
  scaleMode: 2, // ScaleMode.RESIZE
  scene: [GameScene],
});
