# Chapter 4: Ultra-fast Neighborhood Search with Morton Spatial Hash

In Chapter 3, we successfully rendered over 5,000 enemy monsters on screen, tracking the player smoothly at over 60FPS.
However, we now hit a massive wall: **the "$O(N^2)$ trap" of collision detection**.

If we naively calculate collisions between 5,000 enemies and player attacks/weapons:
$$\text{Checks} = 5,000 \times 5,000 = 25,000,000 \text{ checks / frame}$$
At 60FPS, that's **1.5 billion square root (distance) calculations per second**, which will instantly freeze even the latest CPUs.

In Chapter 4, we introduce PlutoEngine's **Morton Spatial Hash (MortonPlugin)**, reducing collision detection complexity to a lightning-fast $O(1)$ search!

---

## 1. How Uniform Spatial Grids Work

Spatial partitioning involves dividing the entire game world into a grid (cells) and registering which cell each entity is in.
When a bullet or weapon searches for an enemy, it only needs to scan **the few cells surrounding it**, dropping the number of checks from 5,000 to just 10-20!

```
+----+----+----+----+
|    |    |  * |    |  <-- Instead of searching the whole screen,
+----+----+----+----+
|    | P  | ** |    |  <-- Only check the 3x3 cells around the weapon (P)!
+----+----+----+----+
|    |    |  * |    |
+----+----+----+----+
```

---

## 2. Registering MortonPlugin

PlutoEngine provides an ultra-fast spatial hashing package `@plutoengine/morton` using Morton codes (Z-order Curve).
By simply registering it as a plugin, a zero-allocation spatial hash is injected into your scene.

```typescript
import { Scene } from '@plutoengine/core';
import { MortonPlugin } from '@plutoengine/morton';

export class SwarmSurvivorScene extends Scene {
  constructor() {
    super(10000); // Max 10,000 entities
    
    // Register Morton spatial hash with a cell size of 64
    // (Automatically injects this.spatialHash)
    this.registerPlugin(new MortonPlugin(64));
  }
}
```

---

## 3. Building the Grid (`build`)

Every frame, immediately after enemy movement, register entities into the spatial hash and build it.

```typescript
  public sysUpdate(dt: number): void {
    super.sysUpdate(dt);

    // 1. Clear the hash
    this.spatialHash.clear();

    // 2. Register entities
    for (let i = 0; i < this.arena.capacity; i++) {
      if (this.arena.active[i] === 0) continue;
      this.spatialHash.addEntity(i, this.arena.posX[i], this.arena.posY[i]);
    }

    // 3. Build spatial hash
    this.spatialHash.build();
  }
```

---

## 4. Searching for Nearby Enemies in $O(1)$ (`query`)

To search for enemies within a specific coordinate and radius, use `this.spatialHash.query`.
By pre-allocating an array to receive the results, you can retrieve search results with zero allocations.

```typescript
  private queryResult = new Uint32Array(64);

  public attackNearbyEnemies(px: number, py: number, radius: number): void {
    // Execute query (returns the number of entities found)
    const count = this.spatialHash.query(px, py, radius, this.queryResult);

    for (let i = 0; i < count; i++) {
      const enemyId = this.queryResult[i];
      // Apply damage or logic to enemyId
      this.damageEnemy(enemyId);
    }
  }
```

---

## 5. Affinity with Morton Spatial Hash

Managing entities along the Morton order naturally keeps spatially close entities continuous in memory. This greatly improves cache hit rates and makes parallel optimization easier.

---

## 6. Summary & Next Chapter Preview

With the introduction of the spatial hash plugin, **even with 5,000 enemies, collision detection CPU time dropped to less than 0.2ms!**

We are perfectly prepared! In the upcoming Chapter 5, we will implement an **automatic weapon system** featuring a "spinning energy blade" that rotates rapidly around the player and a "homing magic missile" that automatically snipes the nearest enemy!
