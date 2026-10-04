# Chapter 6: XPBD Crowd Physics & Anti-Clustering

By the end of Chapter 5, our automated blades and magic daggers were slicing through waves of enemies.
However, you likely noticed a glaring visual issue: **without collision repulsion, thousands of monsters converge directly on top of each other, shrinking into a single dense dot (the "Clumping Problem")**.

When a horde collapses into a single point, the visual thrill of surviving an overwhelming army is lost.

In Chapter 6, we apply the principles of **Extended Position-Based Dynamics (XPBD)** to simulate **realistic, fluid crowd physics where thousands of enemies dynamically push against one another without exploding or lagging**!

---

## 1. Why XPBD Instead of Force-Based Physics?

Traditional rigid-body engines like Box2D calculate reaction forces and integrate velocity over time. In ultra-dense crowd scenarios:
- Compounded forces cause objects to violently launch off-screen (physics explosion).
- High-frequency jittering never settles.
- CPU calculation times skyrocket.

In contrast, **XPBD (Position-Based Dynamics)** directly projects positions to resolve overlapping constraints:
$$\Delta \mathbf{x} = \frac{1}{2} (\text{overlap}) \cdot \mathbf{n}$$
No matter how densely packed the monsters become, XPBD is unconditionally stable and never diverges.

```
[ Enemy A ] <---- Overlap Distance ----> [ Enemy B ]
     │                                      │
     └─── Push A left by 50%    Push B right by 50% ───┘
```

---

## 2. Implementing the Anti-Clustering Solver

Using our uniform spatial grid from Chapter 4, neighbor lookups for collision pairs run in $O(1)$ constant time:

```typescript
export class SwarmSurvivorScene extends Scene {
  // ... Previous properties ...

  // Enemy collision geometry
  private readonly enemyRadius = 9;   // 9px radius (18px diameter)
  private readonly minSeparation = 18; // Desired minimum distance (9 + 9)
  private readonly minSepSq = 18 * 18; // Squared distance threshold
```

### Constraint Relaxation Pass (`solveCrowdOverlap`)

We project overlapping pairs away from each other:

```typescript
  /**
   * Applies XPBD positional projection to resolve monster overlap
   */
  private solveCrowdOverlap(): void {
    const posX = this.arena.posX;
    const posY = this.arena.posY;
    const count = this.enemyCount;
    const minSep = this.minSeparation;
    const minSepSq = this.minSepSq;

    for (let i = 0; i < count; i++) {
      const idA = this.enemyIds[i];
      const ax = posX[idA];
      const ay = posY[idA];

      // Query neighbors within separation distance
      this.queryNearbyEnemies(ax, ay, minSep, (neighborIdx, idB) => {
        // Prevent self-collision and duplicate checks
        if (neighborIdx <= i) return;

        const bx = posX[idB];
        const by = posY[idB];

        const dx = bx - ax;
        const dy = by - ay;
        const distSq = dx * dx + dy * dy;

        // If monsters are overlapping
        if (distSq < minSepSq && distSq > 0.0001) {
          const dist = Math.sqrt(distSq);
          const overlap = minSep - dist;
          const nx = dx / dist;
          const ny = dy / dist;

          // Push each entity apart by 50% (XPBD projection)
          const push = overlap * 0.5;

          posX[idA] -= nx * push;
          posY[idA] -= ny * push;

          posX[idB] += nx * push;
          posY[idB] += ny * push;
        }
      });
    }
  }
```

---

## 3. Placement in `fixedUpdate`

Physics constraints belong in PlutoEngine's deterministic `fixedUpdate(1/60)` loop:

```typescript
  /**
   * Fixed 60Hz physics update loop
   */
  fixedUpdate(fixedDt: number): void {
    // 1. Rebuild spatial grid with latest positions
    this.buildSpatialGrid();

    // 2. Execute XPBD relaxation passes (2 iterations for firmer crowd density)
    this.solveCrowdOverlap();
    this.solveCrowdOverlap();
  }
```

---

## 4. Player-Monster Body Blocking

We also apply directional repulsion between the hero and enemies so monsters cannot phase into the player's center:

```typescript
  private solvePlayerOverlap(): void {
    const px = this.player.x;
    const py = this.player.y;
    const playerRadius = 14;
    const combinedRadius = playerRadius + this.enemyRadius;
    const combSq = combinedRadius * combinedRadius;

    this.queryNearbyEnemies(px, py, combinedRadius, (enemyIdx, id) => {
      const ex = this.arena.posX[id];
      const ey = this.arena.posY[id];
      const dx = ex - px;
      const dy = ey - py;
      const distSq = dx * dx + dy * dy;

      if (distSq < combSq && distSq > 0.001) {
        const dist = Math.sqrt(distSq);
        const overlap = combinedRadius - dist;

        // Push enemy outward
        this.arena.posX[id] += (dx / dist) * overlap;
        this.arena.posY[id] += (dy / dist) * overlap;

        // Inflict minor contact damage to player
        this.playerHp -= 0.1;
      }
    });
  }
```

---

## 5. Verification: A Living, Surging Horde!

Reload your game!

Notice the dramatic transformation: thousands of red enemies now **push and elbow each other, forming a vast, undulating ring of monsters surrounding your hero**.
They flow around each other like organic fluid, surging forward with terrifying collective momentum while performance remains capped at 60/144 FPS.

Now that the horde behaves realistically, it's time for rewards!
In [Chapter 7: XP Gems, Free List & Leveling Up](./07-gems-leveling), we implement glittering gem drops and player power progression!
