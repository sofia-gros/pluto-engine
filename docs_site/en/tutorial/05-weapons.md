# Chapter 5: Automated Weapons & Projectiles

The signature appeal of any Swarm Survivor game is **the auto-firing arsenal that systematically shreds through hordes of enemies without demanding constant manual aiming**.

In Chapter 5, we create two devastating automatic weapons:
1. **Orbiting Energy Blades**: 3 golden blades swirling rapidly around the hero, carving a safe perimeter against charging mobs.
2. **Homing Magic Daggers**: Fast-moving azure projectiles that automatically acquire the nearest enemy and fire on a repeating cooldown.

Using the spatial hash built in Chapter 4, collision checks with thousands of enemies take virtually zero CPU time.

---

## 1. Weapon 1: Orbiting Energy Blades

We allocate 3 blade sprites in the arena and animate them in circular orbits using trigonometry:

```typescript
export class SwarmSurvivorScene extends Scene {
  // ... Previous properties ...

  // Orbiting blades setup
  private readonly bladeCount = 3;
  private readonly bladeIds = new Int32Array(3);
  private bladeAngle = 0;       // Current orbit angle in radians
  private readonly bladeRadius = 75; // Orbit radius in px
  private readonly bladeSpeed = 4.0; // Angular velocity (rad/s)
  private readonly bladeDamage = 15; // Damage per contact

  private initWeapons(): void {
    // Allocate 3 blade sprites from arena (20px scale)
    for (let i = 0; i < this.bladeCount; i++) {
      const blade = this.add.sprite(0, 0, 20);
      blade.setTint(0xfacc15); // Luminous gold (0xfacc15)
      this.bladeIds[i] = blade.id;
    }
  }
```

### Updating Blades and Resolving Hits

Every frame, we increment the orbit angle, position each blade, and use our spatial hash to damage nearby enemies:

```typescript
  private updateBlades(dt: number): void {
    this.bladeAngle += this.bladeSpeed * dt;
    const px = this.player.x;
    const py = this.player.y;
    const posX = this.arena.posX;
    const posY = this.arena.posY;

    for (let i = 0; i < this.bladeCount; i++) {
      const id = this.bladeIds[i];
      // Distribute blades evenly (120 degrees apart)
      const angle = this.bladeAngle + (i * Math.PI * 2) / this.bladeCount;

      const bx = px + Math.cos(angle) * this.bladeRadius;
      const by = py + Math.sin(angle) * this.bladeRadius;

      posX[id] = bx;
      posY[id] = by;

      // Query enemies within 18px of blade using spatial hash
      this.queryNearbyEnemies(bx, by, 18, (enemyIdx) => {
        this.damageEnemy(enemyIdx, this.bladeDamage * dt * 10);
      });
    }
  }
```

---

## 2. Weapon 2: Auto-Targeting Magic Daggers

We manage projectiles inside a fixed-size SoA pool to avoid runtime garbage collection:

```typescript
const MAX_PROJECTILES = 200;

export class SwarmSurvivorScene extends Scene {
  // Projectile pool
  private projCount = 0;
  private readonly projIds = new Int32Array(MAX_PROJECTILES);
  private readonly projVelX = new Float32Array(MAX_PROJECTILES);
  private readonly projVelY = new Float32Array(MAX_PROJECTILES);
  private readonly projLife = new Float32Array(MAX_PROJECTILES);

  // Firing accumulator
  private daggerTimer = 0;
  private readonly daggerInterval = 0.4; // Fire every 400ms
```

### Acquiring Targets and Firing (`fireDagger`)

We use `queryNearbyEnemies` to find the monster nearest to the player:

```typescript
  private fireDagger(): void {
    if (this.projCount >= MAX_PROJECTILES) return;

    const px = this.player.x;
    const py = this.player.y;

    // Find closest enemy within 500px range
    let closestEnemyId = -1;
    let closestDistSq = 500 * 500;

    this.queryNearbyEnemies(px, py, 500, (enemyIdx, id) => {
      const dx = this.arena.posX[id] - px;
      const dy = this.arena.posY[id] - py;
      const dSq = dx * dx + dy * dy;
      if (dSq < closestDistSq) {
        closestDistSq = dSq;
        closestEnemyId = id;
      }
    });

    // Fire dagger if a target was found
    if (closestEnemyId !== -1) {
      const targetX = this.arena.posX[closestEnemyId];
      const targetY = this.arena.posY[closestEnemyId];
      const dx = targetX - px;
      const dy = targetY - py;
      const dist = Math.hypot(dx, dy);

      const bulletSpeed = 500; // 500 px/s
      const sprite = this.add.sprite(px, py, 14);
      sprite.setTint(0x38bdf8); // Sky blue

      const idx = this.projCount++;
      this.projIds[idx] = sprite.id;
      this.projVelX[idx] = (dx / dist) * bulletSpeed;
      this.projVelY[idx] = (dy / dist) * bulletSpeed;
      this.projLife[idx] = 1.5; // 1.5s lifetime
    }
  }
```

### Updating Projectiles & Impact Resolution

```typescript
  private updateProjectiles(dt: number): void {
    const posX = this.arena.posX;
    const posY = this.arena.posY;

    for (let i = this.projCount - 1; i >= 0; i--) {
      const id = this.projIds[i];

      // Advance projectile
      posX[id] += this.projVelX[i] * dt;
      posY[id] += this.projVelY[i] * dt;
      this.projLife[i] -= dt;

      let hit = false;
      // Check collision within 16px of projectile
      this.queryNearbyEnemies(posX[id], posY[id], 16, (enemyIdx) => {
        if (!hit) {
          hit = true;
          this.damageEnemy(enemyIdx, 30); // 30 damage
        }
      });

      // Free slot if projectile hits or expires
      if (hit || this.projLife[i] <= 0) {
        this.arena.free(id); // Return slot to Free List (Zero GC!)

        // Swap with tail element for O(1) removal
        const last = --this.projCount;
        this.projIds[i] = this.projIds[last];
        this.projVelX[i] = this.projVelX[last];
        this.projVelY[i] = this.projVelY[last];
        this.projLife[i] = this.projLife[last];
      }
    }
  }
```

---

## 3. Dealing Damage & Destroying Enemies

When enemy HP hits zero, return their ID slot back to the arena's Free List:

```typescript
  public damageEnemy(enemyIndex: number, amount: number): void {
    this.enemyHp[enemyIndex] -= amount;

    if (this.enemyHp[enemyIndex] <= 0) {
      const id = this.enemyIds[enemyIndex];
      this.arena.free(id); // Instantly available for next spawn!

      // O(1) swap removal from enemy pool
      const last = --this.enemyCount;
      this.enemyIds[enemyIndex] = this.enemyIds[last];
      this.enemyHp[enemyIndex] = this.enemyHp[last];
      this.enemySpeed[enemyIndex] = this.enemySpeed[last];
    }
  }
```

---

## 4. Verification

Reload your game!
A trio of golden blades spins vigorously around your hero, obliterating charging enemies on contact. Simultaneously, sleek cyan daggers launch relentlessly toward approaching monsters, creating a satisfying automated battle rhythm.

However, notice that enemies still stack directly on top of each other into a single point.
In [Chapter 6: XPBD Crowd Physics & Anti-Clustering](./06-xpbd-physics), we bring in PlutoEngine's **XPBD solver** to give the horde realistic crowd body-pushing physics!
