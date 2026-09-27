# Chapter 7: XP Gems, Free List & Leveling Up

After wiping out hordes of enemies, a satisfying reward loop is essential!
The core addiction of the Survivor genre is **the explosion of shimmering XP Gems dropped by fallen monsters, magnetized toward your hero as you surge through levels and stack upgrades**.

In Chapter 7, we demonstrate the power of PlutoEngine's **Free List recycling ecosystem** while implementing gem magnetism and player progression!

---

## 1. The Zero-Net-Allocation Recycling Loop

When an enemy dies, its ID slot is released back to the arena via `this.arena.free(enemyId)`.
Immediately afterward, when we spawn an XP Gem with `this.add.sprite(ex, ey, 10)`, observe what happens under the hood:

```
[ Monster Dies ] ──> Calls arena.free(id: 42) (Pushed to Free List)
                           │
[ Gem Spawns ]   <── Calls arena.allocate() (Pops and reuses id: 42!)
```

**Net memory growth is exactly ZERO.**
The memory slot just vacated by the fallen monster is instantly repurposed as a sparkling gem. Even as tens of thousands of monsters fall, total heap memory remains completely flat!

---

## 2. XP Gem Pool Configuration

We manage gems inside a flat SoA pool:

```typescript
const MAX_GEMS = 5000;

export class SwarmSurvivorScene extends Scene {
  // ... Previous properties ...

  // Gem SoA pool
  private gemCount = 0;
  private readonly gemIds = new Int32Array(MAX_GEMS);
  private readonly gemValues = new Float32Array(MAX_GEMS);

  // Player progression attributes
  public playerLevel = 1;
  public playerXp = 0;
  public playerXpNeeded = 100;
  public magnetRadius = 130; // Radius in px to magnetize gems
```

---

## 3. Dropping Gems on Monster Death

We update `damageEnemy` from Chapter 5 to drop gems upon defeat:

```typescript
  public damageEnemy(enemyIndex: number, amount: number): void {
    this.enemyHp[enemyIndex] -= amount;

    if (this.enemyHp[enemyIndex] <= 0) {
      const id = this.enemyIds[enemyIndex];
      const ex = this.arena.posX[id];
      const ey = this.arena.posY[id];

      // 1. Release enemy slot back to arena
      this.arena.free(id);

      // 2. Remove from enemy pool in O(1) via swap
      const last = --this.enemyCount;
      this.enemyIds[enemyIndex] = this.enemyIds[last];
      this.enemyHp[enemyIndex] = this.enemyHp[last];
      this.enemySpeed[enemyIndex] = this.enemySpeed[last];

      // 3. Spawn gem within pool limits
      if (this.gemCount < MAX_GEMS) {
        // The slot freed above is recycled immediately!
        const gem = this.add.sprite(ex, ey, 10);
        // Brilliant emerald gem tint (0x34d399)
        gem.setTint(0x34d399);

        const gIdx = this.gemCount++;
        this.gemIds[gIdx] = gem.id;
        this.gemValues[gIdx] = 10; // 10 XP
      }
    }
  }
```

---

## 4. Gem Magnetism & Pickup (`updateGems`)

When the player enters a gem's magnetic radius, the gem accelerates toward the hero:

```typescript
  private updateGems(dt: number): void {
    const px = this.player.x;
    const py = this.player.y;
    const magnetSq = this.magnetRadius * this.magnetRadius;
    const pickupDistSq = 20 * 20; // Collection threshold (20px)
    const posX = this.arena.posX;
    const posY = this.arena.posY;

    for (let i = this.gemCount - 1; i >= 0; i--) {
      const id = this.gemIds[i];
      const gx = posX[id];
      const gy = posY[id];

      const dx = px - gx;
      const dy = py - gy;
      const distSq = dx * dx + dy * dy;

      // Magnet pull when in range
      if (distSq < magnetSq) {
        const dist = Math.sqrt(distSq);
        const pullSpeed = 450 * dt;

        posX[id] += (dx / dist) * pullSpeed;
        posY[id] += (dy / dist) * pullSpeed;

        // Collect gem on contact
        if (distSq < pickupDistSq) {
          this.gainXp(this.gemValues[i]);

          // Free gem sprite
          this.arena.free(id);

          // O(1) pool swap removal
          const last = --this.gemCount;
          this.gemIds[i] = this.gemIds[last];
          this.gemValues[i] = this.gemValues[last];
        }
      }
    }
  }
```

---

## 5. Level Up & Upgrade Progression (`gainXp`)

When accumulated XP passes the threshold, the player levels up and gains stat enhancements:

```typescript
  private gainXp(amount: number): void {
    this.playerXp += amount;

    if (this.playerXp >= this.playerXpNeeded) {
      this.playerXp -= this.playerXpNeeded;
      this.playerLevel++;
      // Increase XP requirement by 25% each level
      this.playerXpNeeded = Math.floor(this.playerXpNeeded * 1.25);

      this.applyLevelUpUpgrade();
    }
  }

  private applyLevelUpUpgrade(): void {
    console.log(`🎉 LEVEL UP! Reached Level ${this.playerLevel}`);

    // Cycle through character upgrades
    switch (this.playerLevel % 3) {
      case 0:
        this.playerSpeed += 25;
        console.log(`Speed increased: ${this.playerSpeed} px/s`);
        break;
      case 1:
        this.magnetRadius += 30;
        console.log(`Magnet radius expanded: ${this.magnetRadius} px`);
        break;
      case 2:
        this.bladeSpeed += 1.5;
        console.log(`Blade rotation speed boosted: ${this.bladeSpeed}`);
        break;
    }
  }
```

---

## 6. Verification

Run your game!
As your weapons cleave through the swarm, a constellation of emerald gems carpets the battlefield. Run through them to watch them zoom into your character, triggering level-up bonuses in your console.

However, displaying stats in the browser console won't satisfy players.
In [Chapter 8: Dynamic HUD & Zero-Alloc Tweens](./08-hud-tweens), we integrate PlutoEngine's `add.text` and **zero-allocation Tween system** to render an on-screen HUD and bouncy floating damage numbers!
