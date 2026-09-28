# Arcade Physics Plugin (Phaser-like AABB Engine)

PlutoEngine includes a built-in `ArcadePhysics` plugin featuring an intuitive Phaser-like API powered by **AABB Broadphase Culling capable of evaluating 300,000 entities in 0.08 ms**.

---

## ⚡ Key Features

- **Phaser-like Declarative API**: Simple registrations via `this.physics.add.overlap()` and `this.physics.add.collider()`.
- **Universal Target Support**: Seamless pairwise collision detection between:
  - **Single GameObjects** (`player`, `boss`, `Sprite`)
  - **Arrays** (`bullets: Sprite[]`, `items: PhysicsBody[]`)
  - **SoA Arenas** (`this.arena` - massive swarms with hundreds of thousands of entities)
  - **TypedArray Buffers** (`PhysicsBuffer` - custom Float32Array SoA collections)
- **Ultra-Fast AABB Broadphase Culling**:
  - Eliminates redundant distance calculations (square roots and multiplications) across large swarms. Skips 99.9% of distant entities using simple arithmetic bounds checks.
- **Zero-Allocation**: No heap allocations or GC spikes during the collision detection loop.

---

## 🎮 Usage Examples

### 1. Player vs Massive Swarm (`this.arena`)

```typescript
export class GameScene extends Scene {
  create() {
    const player = this.add.sprite(400, 300, 'player');
    player.radius = 16;

    // Register overlap with 300,000 swarm entities
    this.physics.add.overlap(player, this.arena, (p, enemyIdx) => {
      p.takeDamage(10);
      console.log(`Enemy #${enemyIdx} touched player!`);
    });
  }
}
```

---

### 2. Bullet Array (`Sprite[]`) vs Swarm (`this.arena`)

```typescript
export class GameScene extends Scene {
  bullets: Sprite[] = [];

  create() {
    this.physics.add.overlap(this.bullets, this.arena, (bullet, enemyIdx) => {
      this.enemyHp[enemyIdx] -= bullet.damage;
      bullet.destroy();
    });
  }
}
```

---

### 3. Custom TypedArray Buffer (`PhysicsBuffer`) vs Swarm

```typescript
const bulletBuffer = {
  posX: new Float32Array(1000),
  posY: new Float32Array(1000),
  count: activeBulletCount,
  radius: 8,
};

this.physics.add.overlap(bulletBuffer, this.arena, (bulletIdx, enemyIdx) => {
  console.log(`Bullet #${bulletIdx} hit enemy #${enemyIdx}`);
});
```

---

### 4. Collider with Penetration Resolution (`this.physics.add.collider`)

```typescript
this.physics.add.collider(player, boss, (p, b) => {
  console.log("Player collided with boss!");
});
```

---

## 📊 Performance Comparison (300,000 Entities)

| Approach | Latency (300k) | Characteristics |
| :--- | :---: | :--- |
| **Naive All-Pairs / Full Scan** | **2.65 ms** | Runs `dx*dx + dy*dy < r*r` on all 300k entities |
| **AABB Broadphase Culling (PlutoEngine)** | **0.08 ms (33x Faster)** | Skips 99.9% of entities via fast bounding box rejection |

---

## 🔧 API Reference

### `this.physics.add.overlap(targetA, targetB, callback, margin?)`
- **`targetA`**: `PhysicsBody` | `PhysicsBody[]` | `InstanceBufferArena` | `PhysicsBuffer`
- **`targetB`**: `PhysicsBody` | `PhysicsBody[]` | `InstanceBufferArena` | `PhysicsBuffer`
- **`callback`**: `(itemA, itemB) => void`
- **`margin`**: Additional margin added to radius (px)

### `this.physics.add.collider(targetA, targetB, callback?, bounce?)`
- **`bounce`**: Restitution coefficient (0.0 to 1.0)
