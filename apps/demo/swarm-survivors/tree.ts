export class SkillTreeGraph {
  nodes: Map<string, any>;
  edges: string[][];

  constructor() {
    this.nodes = new Map();
    this.edges = [];
    this.buildGraph();
  }

  addNode(
    id: string,
    x: number,
    y: number,
    cat: string,
    title: string,
    desc: string,
    statKey: string,
    stepVal: number,
    maxLvl: number,
    baseCost: number,
    costScale: number,
    isSpecial = false,
  ) {
    this.nodes.set(id, {
      id,
      x,
      y,
      cat,
      title,
      desc,
      statKey,
      stepVal,
      maxLvl,
      baseCost,
      costScale,
      isSpecial,
      level: 0,
      unlocked: id === 'core',
    });
  }

  addEdge(fromId: string, toId: string) {
    this.edges.push([fromId, toId]);
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
      true,
    );

    const sectors = [
      { cat: 'offense', baseAngle: -Math.PI / 2, name: '攻撃' },
      { cat: 'defense', baseAngle: Math.PI / 6, name: '防御' },
      { cat: 'utility', baseAngle: (5 * Math.PI) / 6, name: '収益' },
    ];

    sectors.forEach((sec) => {
      let prevTierNodes = ['core'];
      for (let ring = 1; ring <= 5; ring++) {
        const ringDist = ring * 130;
        const countInRing = ring * 2 + 1;
        const curTierNodes = [];

        for (let i = 0; i < countInRing; i++) {
          const spread = (i - (countInRing - 1) / 2) * 0.28;
          const ang = sec.baseAngle + spread;
          const nx = Math.round(Math.cos(ang) * ringDist);
          const ny = Math.round(Math.sin(ang) * ringDist);
          const nodeId = `${sec.cat}_r${ring}_n${i}`;

          const isKeystone =
            (ring === 3 && i === 1) || (ring === 5 && (i === 0 || i === countInRing - 1));
          let title = '',
            desc = '',
            statKey = '',
            stepVal = 0,
            maxLvl = isKeystone ? 1 : 5;
          const baseCost = 6 + ring * 8 + (isKeystone ? 40 : 0);
          const costScale = 1.35 + ring * 0.05;

          if (sec.cat === 'offense') {
            if (isKeystone) {
              title = ring === 3 ? '双弾乱舞' : '破滅の極点';
              desc = ring === 3 ? '魔導弾の同時発射数 +1' : '全クリティカル倍率 +50%';
              statKey = ring === 3 ? 'bonusProj' : 'critMult';
              stepVal = ring === 3 ? 1 : 0.5;
            } else {
              const types = [
                { t: '鋭利刃', s: 'bulletDmg', d: '攻撃力 +2.5%', v: 0.025 },
                { t: '急速展開', s: 'atkSpeed', d: '攻撃間隔 -2.0%', v: 0.02 },
                { t: '急所眼', s: 'critChance', d: '会心率 +1.5%', v: 0.015 },
                { t: '衝撃伝播', s: 'knockback', d: 'ノックバック +6.0%', v: 0.06 },
                { t: '領域拡張', s: 'areaSize', d: '攻撃範囲 +3.0%', v: 0.03 },
              ];
              const tData = types[(ring + i) % types.length];
              title = `${tData.t} T${ring}.${i + 1}`;
              desc = tData.d;
              statKey = tData.s;
              stepVal = tData.v;
            }
          } else if (sec.cat === 'defense') {
            if (isKeystone) {
              title = ring === 3 ? '不死鳥の契約' : '金剛の要塞';
              desc = ring === 3 ? '1回だけHP50%で復活' : '被ダメージを常に -4 軽減';
              statKey = ring === 3 ? 'revive' : 'armor';
              stepVal = ring === 3 ? 1 : 4;
            } else {
              const types = [
                { t: '巨人の血肉', s: 'maxHp', d: '最大HP +6', v: 6 },
                { t: '細胞再生', s: 'hpRegen', d: '毎秒HP再生 +0.08', v: 0.08 },
                { t: '硬質外骨格', s: 'armor', d: '被ダメ軽減 -0.5', v: 0.5 },
                { t: '疾風脚', s: 'moveSpeed', d: '移動速度 +1.5%', v: 0.015 },
                { t: '反発衝角', s: 'bodyPush', d: '接触反発 +8.0%', v: 0.08 },
              ];
              const tData = types[(ring + i) % types.length];
              title = `${tData.t} T${ring}.${i + 1}`;
              desc = tData.d;
              statKey = tData.s;
              stepVal = tData.v;
            }
          } else {
            if (isKeystone) {
              title = ring === 3 ? '超引力磁場' : '強欲の権化';
              desc = ring === 3 ? '回収範囲 +60%' : 'コインドロップ率 +15%';
              statKey = ring === 3 ? 'pickupRadius' : 'coinRate';
              stepVal = ring === 3 ? 0.6 : 0.15;
            } else {
              const types = [
                { t: '強奪の勘', s: 'coinRate', d: 'コインドロップ率 +1.5%', v: 0.015 },
                { t: '賢者の眼', s: 'expGain', d: '経験値倍率 +2.5%', v: 0.025 },
                { t: '微小引力', s: 'pickupRadius', d: '回収範囲 +4.0%', v: 0.04 },
                { t: '精神集中', s: 'cooldown', d: '全クールダウン -1.5%', v: 0.015 },
                { t: '持続詠唱', s: 'duration', d: '効果持続時間 +3.0%', v: 0.03 },
              ];
              const tData = types[(ring + i) % types.length];
              title = `${tData.t} T${ring}.${i + 1}`;
              desc = tData.d;
              statKey = tData.s;
              stepVal = tData.v;
            }
          }

          this.addNode(
            nodeId,
            nx,
            ny,
            sec.cat,
            title,
            desc,
            statKey,
            stepVal,
            maxLvl,
            baseCost,
            costScale,
            isKeystone,
          );
          curTierNodes.push(nodeId);

          if (prevTierNodes.length === 1 && prevTierNodes[0] === 'core') {
            this.addEdge('core', nodeId);
          } else {
            const pIdx = Math.min(
              prevTierNodes.length - 1,
              Math.floor((i / countInRing) * prevTierNodes.length),
            );
            this.addEdge(prevTierNodes[pIdx], nodeId);
            if (pIdx + 1 < prevTierNodes.length && Math.random() < 0.4) {
              this.addEdge(prevTierNodes[pIdx + 1], nodeId);
            }
          }

          if (i > 0 && Math.random() < 0.45) {
            this.addEdge(curTierNodes[i - 1], nodeId);
          }
        }
        prevTierNodes = curTierNodes;
      }
    });
  }

  isNodePurchasable(nodeId: string, savedLevels: Record<string, number>) {
    if (nodeId === 'core') return false;
    for (const [a, b] of this.edges) {
      if (a === nodeId) {
        if (b === 'core' || (savedLevels[b] && savedLevels[b] > 0)) return true;
      } else if (b === nodeId) {
        if (a === 'core' || (savedLevels[a] && savedLevels[a] > 0)) return true;
      }
    }
    return false;
  }
}

export class SaveManager {
  static KEY = 'SWARM_HARDCORE_SAVE_V1';
  static load() {
    try {
      const data = JSON.parse(localStorage.getItem(this.KEY) || '{}');
      return {
        coins: Number(data.coins) || 0,
        nodeLevels: data.nodeLevels || {},
      };
    } catch {
      return { coins: 0, nodeLevels: {} };
    }
  }
  static save(coins: number, nodeLevels: Record<string, number>) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify({ coins, nodeLevels }));
    } catch {}
  }
}

export class InteractiveSkillTreeUI {
  tree: SkillTreeGraph;
  saveData: any;
  onUpdateCallback: () => void;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  camX = 0;
  camY = 0;
  zoom = 1.0;
  isDragging = false;
  lastPointer = { x: 0, y: 0 };
  selectedNodeId: string | null = null;

  constructor(treeGraph: SkillTreeGraph, saveData: any, onUpdateCallback: () => void) {
    this.tree = treeGraph;
    this.saveData = saveData;
    this.onUpdateCallback = onUpdateCallback;
    this.canvas = document.getElementById('tree-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.initEvents();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.render();
  }

  initEvents() {
    const canvas = this.canvas;
    const onStart = (cx: number, cy: number) => {
      this.isDragging = true;
      this.lastPointer = { x: cx, y: cy };
    };

    const onMove = (cx: number, cy: number) => {
      if (!this.isDragging) return;
      const dx = cx - this.lastPointer.x;
      const dy = cy - this.lastPointer.y;
      this.camX += dx / this.zoom;
      this.camY += dy / this.zoom;
      this.lastPointer = { x: cx, y: cy };
      this.render();
    };

    const onEnd = () => {
      this.isDragging = false;
    };

    canvas.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onEnd);

    let initialTouchDist: number | null = null;
    canvas.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length === 1) {
          onStart(e.touches[0].clientX, e.touches[0].clientY);
        } else if (e.touches.length === 2) {
          this.isDragging = false;
          initialTouchDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY,
          );
        }
      },
      { passive: false },
    );

    canvas.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length === 1) {
          onMove(e.touches[0].clientX, e.touches[0].clientY);
        } else if (e.touches.length === 2 && initialTouchDist !== null) {
          const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY,
          );
          const factor = dist / initialTouchDist;
          this.zoom = Math.max(0.35, Math.min(2.5, this.zoom * factor));
          initialTouchDist = dist;
          this.render();
        }
      },
      { passive: false },
    );

    canvas.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        onEnd();
        initialTouchDist = null;
      }
    });

    canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
        this.zoom = Math.max(0.35, Math.min(2.5, this.zoom * zoomFactor));
        this.render();
      },
      { passive: false },
    );

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = this.canvas.width / rect.width;
      const screenX = (e.clientX - rect.left) * dpr;
      const screenY = (e.clientY - rect.top) * dpr;

      const worldX = (screenX - this.canvas.width * 0.5) / this.zoom - this.camX;
      const worldY = (screenY - this.canvas.height * 0.5) / this.zoom - this.camY;

      let clicked = null;
      for (const [, node] of this.tree.nodes) {
        const dist = Math.hypot(node.x - worldX, node.y - worldY);
        const hitR = node.isSpecial ? 22 : 16;
        if (dist < hitR) {
          clicked = node;
          break;
        }
      }

      if (clicked) {
        this.selectedNodeId = clicked.id;
        this.showInspector(clicked);
        this.render();
      }
    });

    document.getElementById('btn-tree-zoom-in')!.onclick = () => {
      this.zoom = Math.min(2.5, this.zoom * 1.25);
      this.render();
    };
    document.getElementById('btn-tree-zoom-out')!.onclick = () => {
      this.zoom = Math.max(0.35, this.zoom / 1.25);
      this.render();
    };
    document.getElementById('btn-tree-reset')!.onclick = () => {
      this.camX = 0;
      this.camY = 0;
      this.zoom = 1.0;
      this.render();
    };

    document.getElementById('btn-node-upgrade')!.onclick = () => {
      if (!this.selectedNodeId) return;
      this.upgradeNode(this.selectedNodeId);
    };
  }

  showInspector(node: any) {
    const card = document.getElementById('node-inspector')!;
    card.classList.remove('hidden');

    const curLvl = this.saveData.nodeLevels[node.id] || 0;
    const isMax = curLvl >= node.maxLvl;
    const cost = Math.round(node.baseCost * Math.pow(node.costScale, curLvl));
    const isPurchasable = this.tree.isNodePurchasable(node.id, this.saveData.nodeLevels);
    const canAfford = this.saveData.coins >= cost && isPurchasable && !isMax;

    document.getElementById('inspector-cat')!.innerText = node.cat.toUpperCase();
    document.getElementById('inspector-title')!.innerText = node.title;
    document.getElementById('inspector-level')!.innerText = `Lv.${curLvl}/${node.maxLvl}`;
    document.getElementById('inspector-desc')!.innerText = node.desc;
    document.getElementById('inspector-cost')!.innerText = isMax
      ? 'MAX'
      : `🪙 ${cost.toLocaleString()}`;

    const btn = document.getElementById('btn-node-upgrade') as HTMLButtonElement;
    if (isMax) {
      btn.innerText = '習得済';
      btn.className =
        'px-3 py-1 bg-slate-800 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed';
      btn.disabled = true;
    } else if (!isPurchasable) {
      btn.innerText = '未開放（隣接ノードを習得してください）';
      btn.className =
        'px-3 py-1 bg-slate-800 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed';
      btn.disabled = true;
    } else if (!canAfford) {
      btn.innerText = 'コイン不足';
      btn.className =
        'px-3 py-1 bg-slate-800 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed';
      btn.disabled = true;
    } else {
      btn.innerText = '強化する';
      btn.className =
        'px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg active:scale-95 transition-all';
      btn.disabled = false;
    }
  }

  upgradeNode(nodeId: string) {
    const node = this.tree.nodes.get(nodeId);
    if (!node) return;
    const curLvl = this.saveData.nodeLevels[node.id] || 0;
    if (curLvl >= node.maxLvl) return;
    const cost = Math.round(node.baseCost * Math.pow(node.costScale, curLvl));
    if (this.saveData.coins < cost) return;

    this.saveData.coins -= cost;
    this.saveData.nodeLevels[node.id] = curLvl + 1;
    SaveManager.save(this.saveData.coins, this.saveData.nodeLevels);

    document.getElementById('total-coins')!.innerText = this.saveData.coins.toLocaleString();
    this.showInspector(node);
    this.onUpdateCallback();
    this.render();
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(this.camX, this.camY);

    for (const [fromId, toId] of this.tree.edges) {
      const fromNode = this.tree.nodes.get(fromId);
      const toNode = this.tree.nodes.get(toId);
      if (!fromNode || !toNode) continue;

      const fromActive =
        fromId === 'core' ||
        (this.saveData.nodeLevels[fromId] && this.saveData.nodeLevels[fromId] > 0);
      const toActive =
        toId === 'core' || (this.saveData.nodeLevels[toId] && this.saveData.nodeLevels[toId] > 0);
      const edgeConnected = fromActive && toActive;
      const edgeAvailable = fromActive || toActive;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.lineWidth = edgeConnected ? 3.5 : 1.5;
      ctx.strokeStyle = edgeConnected ? '#f59e0b' : edgeAvailable ? '#334155' : '#1e293b';
      ctx.stroke();
    }

    for (const [id, node] of this.tree.nodes) {
      const lvl = this.saveData.nodeLevels[id] || 0;
      const isMax = lvl >= node.maxLvl;
      const isActive = id === 'core' || lvl > 0;
      const isPurchasable = this.tree.isNodePurchasable(id, this.saveData.nodeLevels);
      const isSelected = this.selectedNodeId === id;

      const radius = node.isSpecial ? 16 : 10;

      if (isSelected || (node.isSpecial && isActive)) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? 'rgba(251, 191, 36, 0.35)' : 'rgba(56, 189, 248, 0.25)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.lineWidth = isSelected ? 3 : 2;

      let color = '#475569';
      if (node.cat === 'offense')
        color = isActive ? '#ef4444' : isPurchasable ? '#f87171' : '#334155';
      else if (node.cat === 'defense')
        color = isActive ? '#38bdf8' : isPurchasable ? '#7dd3fc' : '#1e293b';
      else if (node.cat === 'utility')
        color = isActive ? '#10b981' : isPurchasable ? '#6ee7b7' : '#1e293b';
      else if (id === 'core') color = '#fbbf24';

      ctx.strokeStyle = color;
      ctx.fillStyle = isActive ? (isMax ? '#f59e0b' : color) : '#0f172a';
      ctx.fill();
      ctx.stroke();

      if (node.isSpecial) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      if (node.maxLvl > 1 && (isActive || isPurchasable)) {
        ctx.fillStyle = isActive ? '#fef08a' : '#94a3b8';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${lvl}/${node.maxLvl}`, node.x, node.y + radius + 11);
      }
    }

    ctx.restore();
  }
}
