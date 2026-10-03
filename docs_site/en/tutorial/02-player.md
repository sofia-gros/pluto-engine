# Chapter 2: Player Controls & Input Management

In Chapter 1, we initialized our game foundation with a massive instance arena.
In Chapter 2, we bring our hero into the arena and implement **crisp, responsive 8-directional movement** using the keyboard (WASD and arrow keys)!

The critical takeaway in this chapter is **how to normalize diagonal vectors without allocating heap objects (Zero-Allocation math)**.

---

## 1. Creating the Player Sprite

Add a `player` property to the scene and spawn a sprite handle inside `create()`:

```typescript
import { PlutoEngine, ScaleMode, Scene, type Sprite } from 'pluto-engine';

export class SwarmSurvivorScene extends Scene {
  // Player sprite handle
  private player!: Sprite;

  // Player gameplay attributes
  private playerSpeed = 220; // Movement speed in px/s
  public playerHp = 100;
  public playerMaxHp = 100;

  create(): void {
    // Spawn player sprite at screen center (960/2, 540/2) with 28px scale
    this.player = this.add.sprite(960 / 2, 540 / 2, 28);

    // Apply an emerald green tint (0x10b981)
    this.player.setTint(0x10b981);

    console.log(`Player spawned at Arena Slot ID: ${this.player.id}`);
  }
}
```

---

## 2. 8-Way Movement & Zero-Allocation Vector Normalization

In traditional JavaScript game development, normalizing diagonal movement often involves `new Vector2(dx, dy).normalize()`. Doing this 60 to 144 times every second produces memory garbage, inevitably triggering GC freezes.

In PlutoEngine, we perform this calculation purely using scalar variables on the stack:

```typescript
  update(dt: number): void {
    // 1. Gather directional input (stack variables = zero heap allocations)
    let moveX = 0;
    let moveY = 0;

    if (this.input.isKeyPressed('KeyA') || this.input.isKeyPressed('ArrowLeft')) {
      moveX -= 1;
    }
    if (this.input.isKeyPressed('KeyD') || this.input.isKeyPressed('ArrowRight')) {
      moveX += 1;
    }
    if (this.input.isKeyPressed('KeyW') || this.input.isKeyPressed('ArrowUp')) {
      moveY -= 1;
    }
    if (this.input.isKeyPressed('KeyS') || this.input.isKeyPressed('ArrowDown')) {
      moveY += 1;
    }

    // 2. Normalize and move if there is input
    if (moveX !== 0 || moveY !== 0) {
      // Calculate length for diagonal compensation
      const length = Math.hypot(moveX, moveY); // sqrt(moveX^2 + moveY^2)
      const normX = moveX / length;
      const normY = moveY / length;

      // Apply displacement
      const dist = this.playerSpeed * dt;
      this.player.x += normX * dist;
      this.player.y += normY * dist;

      // 3. Flip sprite facing horizontally
      if (moveX < 0) {
        this.player.setFlipX(true); // Facing left
      } else if (moveX > 0) {
        this.player.setFlipX(false); // Facing right
      }
    }

    // 4. Clamp position within arena boundaries
    const halfSize = 14;
    this.player.x = Math.max(halfSize, Math.min(960 - halfSize, this.player.x));
    this.player.y = Math.max(halfSize, Math.min(540 - halfSize, this.player.y));
  }
```

---

## 3. Why `this.input` is Rock-Solid

PlutoEngine's `InputManager` latches asynchronous browser DOM events right before each frame begins:

- **Zero Dropped Inputs**: Fast key presses and combinations are never lost between frame intervals.
- **Deterministic Logic**: Eliminates intermediate state tearing during updates.

---

## 4. Full Source Code (`src/main.ts`)

Here is your updated `src/main.ts`:

```typescript
import { PlutoEngine, ScaleMode, Scene, type Sprite } from 'pluto-engine';

export class SwarmSurvivorScene extends Scene {
  private player!: Sprite;
  private playerSpeed = 220;
  public playerHp = 100;
  public playerMaxHp = 100;

  create(): void {
    this.player = this.add.sprite(960 / 2, 540 / 2, 28);
    this.player.setTint(0x10b981);
  }

  update(dt: number): void {
    let moveX = 0;
    let moveY = 0;

    if (this.input.isKeyPressed('KeyA') || this.input.isKeyPressed('ArrowLeft')) moveX -= 1;
    if (this.input.isKeyPressed('KeyD') || this.input.isKeyPressed('ArrowRight')) moveX += 1;
    if (this.input.isKeyPressed('KeyW') || this.input.isKeyPressed('ArrowUp')) moveY -= 1;
    if (this.input.isKeyPressed('KeyS') || this.input.isKeyPressed('ArrowDown')) moveY += 1;

    if (moveX !== 0 || moveY !== 0) {
      const length = Math.hypot(moveX, moveY);
      const dist = this.playerSpeed * dt;
      this.player.x += (moveX / length) * dist;
      this.player.y += (moveY / length) * dist;

      if (moveX < 0) this.player.setFlipX(true);
      else if (moveX > 0) this.player.setFlipX(false);
    }

    const halfSize = 14;
    this.player.x = Math.max(halfSize, Math.min(960 - halfSize, this.player.x));
    this.player.y = Math.max(halfSize, Math.min(540 - halfSize, this.player.y));
  }
}

new PlutoEngine({
  canvas: 'game-canvas',
  width: 960,
  height: 540,
  scaleMode: ScaleMode.FIT,
  autoCenter: true,
  maxInstances: 50000,
  scene: [SwarmSurvivorScene],
});
```

---

## 5. Verification

Refresh your browser and press WASD or arrow keys.
Your glowing emerald hero glides smoothly around the screen, preserving uniform speed diagonally and automatically flipping when turning around.

Now that the player is ready, head to [Chapter 3: Spawning Thousands in the Swarm](./03-spawning-swarms) to spawn an endless horde of monsters!
