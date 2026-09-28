/**
 * @file ui.ts
 * @description
 * 2D クラシックRPGのHUD、ダイアログ、インベントリ、ショップ、ベンチマーク操作UI。
 */

import { rpgAudio } from './audio';
import { ARMORS, type ArmorData, type Player, type Quest, type TownNPC, WEAPONS, type WeaponData } from './entities';

export class RPGUIManager {
  private player: Player;
  private onBenchmarkModeChange: (count: number) => void;

  // DOM Elements
  private hpBar!: HTMLElement;
  private hpText!: HTMLElement;
  private mpBar!: HTMLElement;
  private mpText!: HTMLElement;
  private expBar!: HTMLElement;
  private lvlText!: HTMLElement;
  private goldText!: HTMLElement;
  private gemText!: HTMLElement;
  private questList!: HTMLElement;

  // Modals
  private dialogModal!: HTMLElement;
  private dialogSpeaker!: HTMLElement;
  private dialogText!: HTMLElement;
  private dialogBtn!: HTMLElement;

  private shopModal!: HTMLElement;
  private inventoryModal!: HTMLElement;
  private benchmarkModal!: HTMLElement;

  private isTyping = false;
  private currentFullText = '';
  private typeTimer: any = null;

  constructor(player: Player, onBenchmarkModeChange: (count: number) => void) {
    this.player = player;
    this.onBenchmarkModeChange = onBenchmarkModeChange;
    this.cacheDOMElements();
    this.setupEventListeners();
  }

  private cacheDOMElements(): void {
    this.hpBar = document.getElementById('rpg-hp-bar')!;
    this.hpText = document.getElementById('rpg-hp-text')!;
    this.mpBar = document.getElementById('rpg-mp-bar')!;
    this.mpText = document.getElementById('rpg-mp-text')!;
    this.expBar = document.getElementById('rpg-exp-bar')!;
    this.lvlText = document.getElementById('rpg-lvl-text')!;
    this.goldText = document.getElementById('rpg-gold-text')!;
    this.gemText = document.getElementById('rpg-gem-text')!;
    this.questList = document.getElementById('rpg-quest-list')!;

    this.dialogModal = document.getElementById('rpg-dialog-modal')!;
    this.dialogSpeaker = document.getElementById('rpg-dialog-speaker')!;
    this.dialogText = document.getElementById('rpg-dialog-text')!;
    this.dialogBtn = document.getElementById('rpg-dialog-btn')!;

    this.shopModal = document.getElementById('rpg-shop-modal')!;
    this.inventoryModal = document.getElementById('rpg-inventory-modal')!;
    this.benchmarkModal = document.getElementById('rpg-benchmark-modal')!;
  }

  private setupEventListeners(): void {
    // インベントリ開閉
    document.getElementById('btn-inventory')?.addEventListener('click', () => {
      this.toggleInventory();
    });
    document.getElementById('btn-close-inventory')?.addEventListener('click', () => {
      this.inventoryModal.classList.add('hidden');
    });

    // ショップ閉じる
    document.getElementById('btn-close-shop')?.addEventListener('click', () => {
      this.shopModal.classList.add('hidden');
    });

    // ベンチマーク開閉
    document.getElementById('btn-benchmark-panel')?.addEventListener('click', () => {
      this.benchmarkModal.classList.toggle('hidden');
    });
    document.getElementById('btn-close-benchmark')?.addEventListener('click', () => {
      this.benchmarkModal.classList.add('hidden');
    });

    // ベンチマークプリセットボタン
    document.querySelectorAll('.btn-spawn-bench').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const count = parseInt((e.target as HTMLElement).getAttribute('data-count') || '100', 10);
        this.onBenchmarkModeChange(count);
      });
    });

    // ダイアログ進行ボタン
    this.dialogBtn?.addEventListener('click', () => {
      this.advanceDialog();
    });

    // キーボードショートカット
    window.addEventListener('keydown', (e) => {
      if (e.key === 'i' || e.key === 'I') {
        this.toggleInventory();
      } else if (e.key === 'b' || e.key === 'B') {
        this.benchmarkModal.classList.toggle('hidden');
      } else if (e.key === 'Escape') {
        this.inventoryModal.classList.add('hidden');
        this.shopModal.classList.add('hidden');
        this.benchmarkModal.classList.add('hidden');
        this.dialogModal.classList.add('hidden');
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (!this.dialogModal.classList.contains('hidden')) {
          this.advanceDialog();
        }
      }
    });
  }

  public updateHUD(): void {
    const p = this.player;

    // HP Bar
    const hpPct = Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100));
    this.hpBar.style.width = `${hpPct}%`;
    this.hpText.textContent = `${Math.ceil(p.hp)}/${p.maxHp}`;

    // MP Bar
    const mpPct = Math.max(0, Math.min(100, (p.mp / p.maxMp) * 100));
    this.mpBar.style.width = `${mpPct}%`;
    this.mpText.textContent = `${Math.ceil(p.mp)}/${p.maxMp}`;

    // EXP Bar
    const expPct = Math.max(0, Math.min(100, (p.exp / p.expNext) * 100));
    this.expBar.style.width = `${expPct}%`;
    this.lvlText.textContent = `Lv.${p.level}`;

    // Gold & Gems
    this.goldText.textContent = `${p.gold}`;
    this.gemText.textContent = `${p.gems}`;

    // Active Quests
    let questHtml = '';
    for (const q of p.quests) {
      const isDone = q.currentCount >= q.targetCount;
      questHtml += `
        <div class="bg-slate-900/80 border ${isDone ? 'border-emerald-500/80' : 'border-slate-700/80'} p-2 rounded-lg text-xs">
          <div class="flex justify-between font-bold ${isDone ? 'text-emerald-400' : 'text-amber-300'}">
            <span>${q.title}</span>
            <span>${q.currentCount}/${q.targetCount}</span>
          </div>
          <div class="text-[10px] text-slate-400 mt-0.5">${q.description}</div>
        </div>
      `;
    }
    this.questList.innerHTML = questHtml;
  }

  /**
   * NPC との会話開始
   */
  public startDialogue(npc: TownNPC, onComplete?: () => void): void {
    if (npc.type === 'merchant') {
      this.openShop();
      return;
    }
    if (npc.type === 'priestess') {
      this.player.hp = this.player.maxHp;
      this.player.mp = this.player.maxMp;
      rpgAudio.playPotion();
    }

    this.dialogModal.classList.remove('hidden');
    this.dialogSpeaker.textContent = npc.name;

    const randomText = npc.dialogs[Math.floor(Math.random() * npc.dialogs.length)];
    this.typewriterText(randomText);
  }

  private typewriterText(text: string): void {
    if (this.typeTimer) clearInterval(this.typeTimer);
    this.isTyping = true;
    this.currentFullText = text;
    this.dialogText.textContent = '';

    let i = 0;
    this.typeTimer = setInterval(() => {
      if (i < text.length) {
        this.dialogText.textContent += text.charAt(i);
        if (i % 2 === 0) rpgAudio.playDialogBeep();
        i++;
      } else {
        clearInterval(this.typeTimer);
        this.isTyping = false;
      }
    }, 25);
  }

  private advanceDialog(): void {
    if (this.isTyping) {
      clearInterval(this.typeTimer);
      this.dialogText.textContent = this.currentFullText;
      this.isTyping = false;
    } else {
      this.dialogModal.classList.add('hidden');
    }
  }

  /**
   * ショップ画面を開く
   */
  public openShop(): void {
    this.shopModal.classList.remove('hidden');
    this.renderShopItems();
  }

  private renderShopItems(): void {
    const list = document.getElementById('rpg-shop-items')!;
    let html = '';

    // 武器
    for (const wKey of ['iron_blade', 'flame_katana', 'excalibur']) {
      const w = WEAPONS[wKey];
      const isEquipped = this.player.weapon.id === w.id;
      html += `
        <div class="flex items-center justify-between bg-slate-900/90 border border-slate-700 p-2.5 rounded-xl">
          <div>
            <div class="font-bold text-amber-300 text-xs">${w.name} (ATK +${w.atk})</div>
            <div class="text-[10px] text-slate-400">${w.description}</div>
          </div>
          <button class="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs btn-buy-item" data-type="weapon" data-id="${w.id}">
            ${isEquipped ? '装備中' : `🪙 ${w.price}`}
          </button>
        </div>
      `;
    }

    // 防具
    for (const aKey of ['iron_plate', 'dragon_scale']) {
      const a = ARMORS[aKey];
      const isEquipped = this.player.armor.id === a.id;
      html += `
        <div class="flex items-center justify-between bg-slate-900/90 border border-slate-700 p-2.5 rounded-xl">
          <div>
            <div class="font-bold text-sky-300 text-xs">${a.name} (DEF +${a.def})</div>
            <div class="text-[10px] text-slate-400">${a.description}</div>
          </div>
          <button class="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs btn-buy-item" data-type="armor" data-id="${a.id}">
            ${isEquipped ? '装備中' : `🪙 ${a.price}`}
          </button>
        </div>
      `;
    }

    // ポーション
    html += `
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
    `;

    list.innerHTML = html;

    list.querySelectorAll('.btn-buy-item').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const type = (e.currentTarget as HTMLElement).getAttribute('data-type');
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        this.buyItem(type!, id!);
      });
    });
  }

  private buyItem(type: string, id: string): void {
    const p = this.player;
    if (type === 'weapon') {
      const w = WEAPONS[id];
      if (p.gold >= w.price && p.weapon.id !== w.id) {
        p.gold -= w.price;
        p.weapon = w;
        rpgAudio.playCoin();
        this.renderShopItems();
        this.updateHUD();
      }
    } else if (type === 'armor') {
      const a = ARMORS[id];
      if (p.gold >= a.price && p.armor.id !== a.id) {
        p.gold -= a.price;
        p.armor = a;
        rpgAudio.playCoin();
        this.renderShopItems();
        this.updateHUD();
      }
    } else if (type === 'potion_hp') {
      if (p.gold >= 25) {
        p.gold -= 25;
        p.hpPotions++;
        rpgAudio.playCoin();
        this.renderShopItems();
        this.updateHUD();
      }
    } else if (type === 'potion_mp') {
      if (p.gold >= 20) {
        p.gold -= 20;
        p.mpPotions++;
        rpgAudio.playCoin();
        this.renderShopItems();
        this.updateHUD();
      }
    }
  }

  /**
   * インベントリ画面の開閉
   */
  public toggleInventory(): void {
    this.inventoryModal.classList.toggle('hidden');
    if (!this.inventoryModal.classList.contains('hidden')) {
      this.renderInventory();
    }
  }

  private renderInventory(): void {
    const p = this.player;
    const invContent = document.getElementById('rpg-inventory-content')!;
    invContent.innerHTML = `
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-1.5">
          <span class="text-amber-400 font-bold">⚔️ 装備ステータス</span>
          <div>武器: <span class="font-bold text-amber-300">${p.weapon.name}</span> (ATK +${p.weapon.atk})</div>
          <div>防具: <span class="font-bold text-sky-300">${p.armor.name}</span> (DEF +${p.armor.def})</div>
          <div class="mt-2 pt-2 border-t border-slate-800 text-slate-300">
            <div>総合攻撃力: <span class="font-bold text-rose-400">${p.attackPower}</span></div>
            <div>総合防御力: <span class="font-bold text-blue-400">${p.defensePower}</span></div>
            <div>移動速度: <span class="font-bold text-emerald-400">${p.baseSpeed} px/s</span></div>
          </div>
        </div>
        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
          <span class="text-emerald-400 font-bold">🎒 所持アイテム</span>
          <div class="flex items-center justify-between">
            <span>HPポーション: ${p.hpPotions}個</span>
            <button class="px-2 py-0.5 bg-rose-600 rounded text-[10px] btn-use-hp" ${p.hpPotions <= 0 ? 'disabled' : ''}>使う</button>
          </div>
          <div class="flex items-center justify-between">
            <span>MPポーション: ${p.mpPotions}個</span>
            <button class="px-2 py-0.5 bg-indigo-600 rounded text-[10px] btn-use-mp" ${p.mpPotions <= 0 ? 'disabled' : ''}>使う</button>
          </div>
        </div>
      </div>
    `;

    invContent.querySelector('.btn-use-hp')?.addEventListener('click', () => {
      p.useHpPotion();
      this.renderInventory();
      this.updateHUD();
    });
    invContent.querySelector('.btn-use-mp')?.addEventListener('click', () => {
      p.useMpPotion();
      this.renderInventory();
      this.updateHUD();
    });
  }
}
