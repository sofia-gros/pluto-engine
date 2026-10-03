# Chapter 3: Spawning Thousands in the Swarm

In Chapter 2, we built a responsive player controller.
In Chapter 3, we dive into the marquee feature of this tutorial: **spawning thousands of monsters outside the viewport and having them swarm the player simultaneously**!

In traditional web engines, simulating just 500 enemy sprites causes frame rates to plummet. In PlutoEngine, **5,000+ monsters rush the player while maintaining a rock-solid 144 FPS**.

---

## 1. Designing the Enemy Data Pool (SoA)

To keep garbage collection at zero, we do not push `new Enemy()` instances into an array. Instead, we allocate a **flat Structure of Arrays (SoA)** pool upfront:

```typescript
// Capacity constants
const MAX_ENEMIES = 10000;

export class SwarmSurvivorScene extends Scene {
  // ... Player properties ...

  // Enemy SoA Pool
  private enemyCount = 0;
  private readonly enemyIds = new Int32Array(MAX_ENEMIES);
  private readonly enemyHp = new Float32Array(MAX_ENEMIES);
  private readonly enemySpeed = new Float32Array(MAX_ENEMIES);

  // Spawning accumulator
  private spawnTimer = 0;
  private readonly spawnInterval = 0.1; // Spawn batch every 100ms
```

---

## 2. Off-Screen Circular Spawning

We spawn monsters along a circular perimeter just outside the player's view ($R \approx 600\text{px}$) at random angles:

```typescript
  /**
   * Spawns a batch of enemies around the player
   * @param count Number of monsters to spawn
   */
  private spawnEnemies(count: number): void {
    const spawnRadius = 600; // Radius outside screen
    const px = this.player.x;
    const py = this.player.y;

    for (let i = 0; i < count; i++) {
      if (this.enemyCount >= MAX_ENEMIES) break;

      // Random angle (0 to 2π)
      const angle = Math.random() * Math.PI * 2;
      const spawnX = px + Math.cos(angle) * spawnRadius;
      const spawnY = py + Math.sin(angle) * spawnRadius;

      // Allocate sprite ID from arena (18px scale)
      const sprite = this.add.sprite(spawnX, spawnY, 18);
      // Crimson red tint (0xef4444)
      sprite.setTint(0xef4444);

      // Register into pool
      const idx = this.enemyCount++;
      this.enemyIds[idx] = sprite.id;
      this.enemyHp[idx] = 20; // 20 HP
      this.enemySpeed[idx] = 90 + Math.random() * 40; // 90 to 130 px/s
    }
  }
```

---

## 3. High-Throughput Swarm Tracking

Every frame, we update the direction and position of all active enemies towards the hero.

By caching local references to the TypedArrays (`this.arena.posX`, `this.arena.posY`), the JavaScript JIT compiler generates optimal linear pointer access without overhead:

```typescript
  /**
   * Moves all active enemies toward the hero
   */
  private updateEnemies(dt: number): void {
    const px = this.player.x;
    const py = this.player.y;
    const posX = this.arena.posX;
    const posY = this.arena.posY;
    const facing = this.arena.facing;

    const count = this.enemyCount;
    for (let i = 0; i < count; i++) {
      const id = this.enemyIds[i];

      // Relative displacement to player
      const dx = px - posX[id];
      const dy = py - posY[id];
      const dist = Math.hypot(dx, dy);

      if (dist > 1.0) {
        // Move normalized step
        const step = (this.enemySpeed[i] * dt) / dist;
        posX[id] += dx * step;
        posY[id] += dy * step;

        // Flip facing direction toward movement
        facing[id] = dx < 0 ? -1.0 : 1.0;
      }
    }
  }
```

---

## 4. Integration into `update(dt)`

Wire the spawn timer and movement updates into the main game loop:

```typescript
  update(dt: number): void {
    // 1. Move player
    this.updatePlayer(dt);

    // 2. Accumulate spawn timer
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer -= this.spawnInterval;
      // Spawn 15 enemies per interval (150 enemies per second!)
      this.spawnEnemies(15);
    }

    // 3. Move swarm
    this.updateEnemies(dt);
  }
```

---

## 5. Verification: 5,000 Monsters on Screen!

Reload your browser.
Crimson swarms appear from every edge of the screen, converging relentlessly onto the player.

Open Chrome DevTools (F12) -> Performance tab.
Even as the enemy count surges past 1,000, 3,000, and 5,000 monsters, **frame rate stays pinned at your monitor's maximum (60 or 144 FPS), and heap allocations flatline at zero**.

However, you will notice two problems:
1. When checking collisions between thousands of entities, brute-force checks take $O(N^2)$ calculations.
2. Monsters clump directly on top of each other.

In [Chapter 4: Morton Spatial Hashing & Fast Queries](./04-spatial-hash), we introduce lightning-fast $O(1)$ spatial queries to solve collision detection!
