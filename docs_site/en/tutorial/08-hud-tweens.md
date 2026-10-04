# Chapter 8: Dynamic HUD & Zero-Alloc Tweens

What elevates a good game into an unforgettable one is "game feel"—satisfying visual juice and immediate, punchy feedback!
Even the tightest combat feels flat if players cannot see the damage they inflict or track their health and kill tally.

In Chapter 8, we leverage PlutoEngine's **SDF text system (`this.add.text`)** and **data-oriented Zero-Allocation Tween engine (`this.tweens`)** to render a clean HUD and bouncing, animated floating damage numbers!

---

## 1. Constructing the In-Game HUD

In the top-left corner of the screen, we create text displays for Level, Health, Kills, and Survival Time:

```typescript
import { PlutoEngine, ScaleMode, Scene, TweenProperty, type Sprite, type Text } from 'pluto-engine';

export class SwarmSurvivorScene extends Scene {
  // ... Previous properties ...

  // HUD Text Handles
  private hudLevelText!: Text;
  private hudHpText!: Text;
  private hudStatsText!: Text;

  // Game statistics
  private killCount = 0;
  private survivalTime = 0; // seconds

  private initHUD(): void {
    // Player level in top left (24px font)
    this.hudLevelText = this.add.text(20, 20, 'LV. 1', {
      fontSize: 24,
      color: 0x38bdf8, // Sky blue
    });

    // Health readout
    this.hudHpText = this.add.text(20, 52, 'HP: 100 / 100', {
      fontSize: 18,
      color: 0x10b981, // Emerald green
    });

    // Kill tally and survival stopwatch
    this.hudStatsText = this.add.text(20, 80, 'KILLS: 0 | TIME: 00:00', {
      fontSize: 16,
      color: 0x9ca3af, // Slate gray
    });
  }
```

---

## 2. High-Efficiency HUD Updates

To prevent allocating redundant string objects on every frame tick, we format time and statistics only when whole seconds change:

```typescript
  private lastDisplayedSec = -1;

  private updateHUD(dt: number): void {
    this.survivalTime += dt;
    const currentSec = Math.floor(this.survivalTime);

    // Update stats once per second
    if (currentSec !== this.lastDisplayedSec) {
      this.lastDisplayedSec = currentSec;

      const min = Math.floor(currentSec / 60).toString().padStart(2, '0');
      const sec = (currentSec % 60).toString().padStart(2, '0');

      this.hudStatsText.text = `KILLS: ${this.killCount} | TIME: ${min}:${sec}`;
    }

    // Health readout
    const hpDisplay = Math.max(0, Math.ceil(this.playerHp));
    this.hudHpText.text = `HP: ${hpDisplay} / ${this.playerMaxHp}`;
  }
```

---

## 3. Data-Oriented SoA Tweens in PlutoEngine

Unlike generic animation libraries (like GSAP or Tween.js) that create promises and closure objects, PlutoEngine's `TweenManager` **runs entirely on pre-allocated SoA TypedArrays**:

```typescript
// Zero-allocation property interpolation
this.tweens.add({
  targets: { id: entityId },
  props: { scale: endValue },
  duration: durationMs
});
```

When an animation finishes, its slot automatically recycles back into the Tween Free List with zero garbage collection!

---

## 4. Implementing Floating Damage Numbers

When attacks strike monsters, we spawn a brief damage popup text that bounces upwards:

```typescript
  /**
   * Spawns a floating damage popup over hit target
   */
  private spawnDamagePopup(x: number, y: number, damage: number): void {
    const rounded = Math.round(damage);
    if (rounded <= 0) return;

    // Slight randomized offset above enemy
    const startX = x + (Math.random() * 16 - 8);
    const startY = y - 10;

    const popup = this.add.text(startX, startY, `${rounded}`, {
      fontSize: 16,
      color: 0xfacc15, // Golden yellow
    });

    // 1. Float upwards over 350ms
    this.tweens.add({
  targets: { id: popup.id },
  props: { y: startY - 35 },
  duration: 350
});

    // 2. Pop scale effect (starts large, settles small)
    this.tweens.add({
  targets: { id: popup.id },
  props: { scale: 12 },
  duration: 350
});
  }
```

Trigger this inside `damageEnemy`:

```typescript
  public damageEnemy(enemyIndex: number, amount: number): void {
    const id = this.enemyIds[enemyIndex];
    this.spawnDamagePopup(this.arena.posX[id], this.arena.posY[id], amount);

    this.enemyHp[enemyIndex] -= amount;
    // ...
```

---

## 5. Hero Pulse Effect on Level Up

When reaching a new level, give the hero an energetic expansion pulse:

```typescript
  private applyLevelUpUpgrade(): void {
    this.hudLevelText.text = `LV. ${this.playerLevel}`;

    // Expand player scale to 44px then settle back to 28px
    this.tweens.add({
  targets: { id: this.player.id },
  props: { scale: // Expanded size
      28 },
  duration: // Normal base size
      300 // Duration: 300ms
});
    // ...
  }
```

---

## 6. Verification

Spin up your game and crash into the enemy frontline!

Numbers burst enthusiastically into the air on every hit, while the kill counter and timer tick up in the HUD. When you collect enough gems, your hero expands with a triumphant visual pulse!

In [Chapter 9: Camera Shake, Flash & Polish](./09-sound-polish), we take visual and auditory feedback to the next level with procedural sound synthesizers and screen trauma shaking!
