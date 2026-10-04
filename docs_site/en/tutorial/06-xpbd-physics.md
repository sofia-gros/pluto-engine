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

## 2. Introducing MortonPlugin and XPBDPlugin

In the new architecture of v1.2.1, physics is added to the scene as a plugin. To accelerate collision detection, we use `MortonPlugin`, a spatial hash based on Morton codes.

```typescript
import { Scene, XPBDPlugin, MortonPlugin, InstanceBufferArena } from 'pluto-engine';

export class SwarmSurvivorScene extends Scene {
  private morton!: MortonPlugin;
  private xpbd!: XPBDPlugin;
  private arena!: InstanceBufferArena;

  onAwake(): void {
    // 1. Initialize SoA-based instance arena
    this.arena = new InstanceBufferArena(10000);

    // 2. Add spatial partitioning plugin using Morton codes
    this.morton = this.registerPlugin(new MortonPlugin({ arena: this.arena }));

    // 3. Add XPBD plugin and link the spatial partitioning
    this.xpbd = this.registerPlugin(new XPBDPlugin({ 
      morton: this.morton,
      iterations: 2 // Solver iterations (higher means more rigid bodies)
    }));
  }
```

---

## 3. Registering Enemies and Player to the Physics System

To make the `XPBDPlugin` recognize objects, we register bodies using the SoA buffer index (ID).
Here, we avoid using object-oriented `new` in the update loop, strictly adhering to the Zero-Allocation philosophy.

```typescript
  /**
   * Spawn enemy and register to physics system
   */
  private spawnEnemy(x: number, y: number): void {
    const id = this.arena.allocate();
    this.arena.posX[id] = x;
    this.arena.posY[id] = y;

    // Register as a dynamic body with 9px radius
    this.xpbd.addBody(id, { 
      radius: 9, 
      isStatic: false,
      layer: 'enemy'
    });
  }

  /**
   * Register player
   */
  private setupPlayer(x: number, y: number): void {
    const id = this.arena.allocate();
    this.arena.posX[id] = x;
    this.arena.posY[id] = y;

    // Player has a 14px radius
    this.xpbd.addBody(id, { 
      radius: 14, 
      isStatic: false,
      layer: 'player' 
    });
  }
```

---

## 4. Automating Collision and Repulsion

In older versions, we had to write manual methods like `solveCrowdOverlap` and directly compute repulsion forces in the loop. In v1.2.1, the `XPBDPlugin` fully automates this.
You no longer need to manually call solver functions in `fixedUpdate`.

Also, processing damage when the player collides with enemies can be easily implemented using the plugin's event listeners.

```typescript
  onStart(): void {
    // Register callback for player-enemy collisions
    this.xpbd.onCollision('player', 'enemy', (playerId, enemyId, overlap) => {
      // Inflict minor contact damage to player
      this.playerHp -= 0.1;
    });
  }
```

Internally, it utilizes the Flyweight pattern and `Float32Array` (SoA). Even if thousands of collision checks occur every frame, no memory allocation (`new`) happens, perfectly preventing stutters caused by Garbage Collection (GC) spikes.

---

## 5. Verification: A Living, Surging Horde!

Reload your game!

Notice the dramatic transformation: thousands of red enemies now **push and elbow each other, forming a vast, undulating ring of monsters surrounding your hero**.
They flow around each other like organic fluid, surging forward with terrifying collective momentum while performance remains capped at 60/144 FPS.

Now that the horde behaves realistically, it's time for rewards!
In [Chapter 7: XP Gems, Free List & Leveling Up](./07-gems-leveling), we implement glittering gem drops and player power progression!
