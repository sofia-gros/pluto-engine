# Chapter 10: Boss Battle, Utility AI & Victory Loop

We have arrived at the grand finale! 🏆
Across the previous 9 chapters, you constructed thousands of monsters, automated spinning weapons, XPBD crowd physics, gem magnetism, an on-screen HUD, procedural sound synthesizers, and screen trauma shaking.

In Chapter 10, we bring our Swarm Survivor to a climax by summoning the colossal **Swarm Titan Boss**, scripting **Utility AI multi-phase attack patterns (Tracking, Dash Charges, and Radial Bullet Hell)**, and completing the full victory/game-over lifecycle!

---

## 1. The Boss Arrival

When the survival timer hits the climax threshold, an apocalyptic shockwave clears minor mobs, shaking the entire screen as the Titan descends:

```typescript
export class SwarmSurvivorScene extends Scene {
  // ... Previous properties ...

  // Boss state
  private bossActive = false;
  private bossId = -1;
  private bossHp = 0;
  private readonly bossMaxHp = 1500;
  private bossAiTimer = 0;
  private bossPhase = 0; // 0: Tracking, 1: Dash Charge, 2: Radial Barrage

  // Boss HUD readout
  private bossHpText!: Text;

  /**
   * Summons the Swarm Titan Boss
   */
  private spawnBoss(): void {
    this.bossActive = true;
    this.bossHp = this.bossMaxHp;

    // 1. Apocalyptic shockwave clears surrounding mobs
    this.addTrauma(0.8);
    for (let i = this.enemyCount - 1; i >= 0; i--) {
      this.arena.free(this.enemyIds[i]);
    }
    this.enemyCount = 0;

    // 2. Spawn colossal boss sprite from above screen (72px scale)
    this.bossId = this.arena.allocate();
    this.arena.posX[this.bossId] = 960 / 2;
    this.arena.posY[this.bossId] = -100;
    this.arena.scale[this.bossId] = 72;
    this.arena.tint[this.bossId] = 0xa855f7; // Menacing eldritch purple tint

    // 3. Display Boss health header
    this.bossHpText = this.add.text(960 / 2 - 140, 50, '--- SWARM TITAN: 1500 / 1500 ---', {
      fontSize: 16,
      color: 0xc084fc,
    });

    // Dramatic entrance tween moving boss onto screen
    this.tweens.add({
  targets: { id: this.bossId },
  props: { y: 120 },
  duration: 1200
});

    console.log('⚠️ WARNING: SWARM TITAN HAS AWAKENED!');
  }
```

---

## 2. Multi-Phase Boss Utility AI

The Titan cycles through three distinct combat behaviors every 3 seconds:

1. **Phase 0: Heavy Tracking**: Relentlessly encroaches toward the player.
2. **Phase 1: Supersonic Dash Charge**: Locks onto the hero's position and surges forward at extreme velocity!
3. **Phase 2: Radial Bullet Hell Barrage**: Stations in place and fires a 16-way ring of red projectiles!

```typescript
  private updateBossAI(dt: number): void {
    if (!this.bossActive) return;

    this.bossAiTimer += dt;
    const bx = this.arena.posX[this.bossId];
    const by = this.arena.posY[this.bossId];
    const px = this.player.x;
    const py = this.player.y;

    // Transition phase every 3 seconds
    if (this.bossAiTimer >= 3.0) {
      this.bossAiTimer = 0;
      this.bossPhase = (this.bossPhase + 1) % 3;

      if (this.bossPhase === 2) {
        // Phase 2: Unleash radial 16-way projectile ring
        this.fireBossRadialBarrage(bx, by);
      }
    }

    // Execute active phase behavior
    if (this.bossPhase === 0) {
      // Tracking
      const dx = px - bx;
      const dy = py - by;
      const dist = Math.hypot(dx, dy);
      if (dist > 1.0) {
        const speed = 70 * dt;
        this.arena.posX[this.bossId] += (dx / dist) * speed;
        this.arena.posY[this.bossId] += (dy / dist) * speed;
      }
    } else if (this.bossPhase === 1) {
      // High-speed Dash Charge
      const dx = px - bx;
      const dy = py - by;
      const dist = Math.hypot(dx, dy);
      if (dist > 1.0) {
        const dashSpeed = 220 * dt;
        this.arena.posX[this.bossId] += (dx / dist) * dashSpeed;
        this.arena.posY[this.bossId] += (dy / dist) * dashSpeed;
      }
    }

    // Update Boss health text
    this.bossHpText.text = `--- SWARM TITAN: ${Math.max(0, Math.ceil(this.bossHp))} / ${this.bossMaxHp} ---`;
  }

  /**
   * Fires a 16-way radial bullet hell nova
   */
  private fireBossRadialBarrage(bx: number, by: number): void {
    this.addTrauma(0.3);
    const numBullets = 16;
    for (let i = 0; i < numBullets; i++) {
      const angle = (i * Math.PI * 2) / numBullets;
      // Spawn enemy projectile (SoA)
      const bulletId = this.arena.allocate();
      this.arena.posX[bulletId] = bx;
      this.arena.posY[bulletId] = by;
      this.arena.scale[bulletId] = 14;
      this.arena.tint[bulletId] = 0xf43f5e; // Threatening rose red
      // ... register into projectile pool ...
    }
  }
```

---

## 3. Victory & Game Over Conditions

Handle victory when the boss is vanquished, or game over if the hero's health depletes:

```typescript
  private isGameOver = false;

  private checkGameConditions(): void {
    if (this.isGameOver) return;

    // 1. Player Defeat
    if (this.playerHp <= 0) {
      this.isGameOver = true;
      this.add.text(960 / 2 - 150, 540 / 2 - 40, 'GAME OVER', {
        fontSize: 48,
        color: 0xef4444,
      });
      this.add.text(960 / 2 - 130, 540 / 2 + 30, 'Press SPACE to Restart', {
        fontSize: 20,
        color: 0xffffff,
      });
      return;
    }

    // 2. Boss Vanquished (VICTORY!)
    if (this.bossActive && this.bossHp <= 0) {
      this.isGameOver = true;
      this.arena.free(this.bossId); // Destroy boss
      this.bossActive = false;

      this.addTrauma(1.0); // Maximum screen rumble
      this.sfx.playLevelUp(); // Victory fanfare

      this.add.text(960 / 2 - 140, 540 / 2 - 40, 'VICTORY!', {
        fontSize: 48,
        color: 0xfacc15, // Radiance gold
      });
      this.add.text(960 / 2 - 160, 540 / 2 + 30, 'You survived the Swarm Titan!', {
        fontSize: 20,
        color: 0x38bdf8,
      });
    }

    // Restart via Spacebar
    if (this.isGameOver && this.input.isKeyJustPressed('Space')) {
      this.scene.start('SwarmSurvivorScene');
    }
  }
```

---

## 4. Tutorial Complete! What You Built

🎉 **Congratulations!**
You have engineered a full-scale, production-ready Swarm Survivor game completely from scratch using PlutoEngine!

Take pride in the mastery of modern engine architecture you've demonstrated:

1. **Zero-Allocation**: Complete elimination of runtime GC pauses.
2. **Data-Oriented Design (Structure of Arrays)**: Unmatched CPU cache utilization with `InstanceBufferArena`.
3. **Flyweight Handles**: High-level developer ergonomics without memory bloat.
4. **Morton Spatial Partitioning**: Collapsed $O(N^2)$ collision checks into instant $O(1)$ operations.
5. **XPBD Crowd Physics**: Organic, anti-clustering fluid dynamics for thousands of entities.
6. **Procedural Web Audio**: Zero-asset, zero-latency synthesizer soundscapes.
7. **SoA Tweens & SDF Typography**: Visceral tactile juice and crisp HUD telemetry.

---

## 5. Next Horizons

PlutoEngine provides an expansive canvas for your creativity. Consider these next expansions:

- 🎨 **Custom Spritesheets**: Load custom pixel art using `this.load.image`.
- ⚔️ **New Weapon Arsenals**: Add chain lightning, orbiting shields, and flame trails.
- 🧪 **Poisson Disk Sampling**: Use `@pluto-engine/poisson` to scatter natural obstacles and trees.
- 🦾 **Verlet Inverse Kinematics**: Use `@pluto-engine/verlet-ik` to attach writhing multi-jointed tentacles to boss monsters.

Explore the sidebar to delve into **[Concepts](/en/concepts/engine-config)**, **[Plugins](/en/plugins/xpbd)**, and the complete **[API Reference](/en/api/pluto-engine)**.

Happy game creating, and welcome to the next era of high-performance web gaming! 🪐🚀
