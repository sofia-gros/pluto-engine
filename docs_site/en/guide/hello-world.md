# Hello World

In this guide, you will create a minimal game with PlutoEngine, displaying your first animated sprite and controlling it smoothly using keyboard arrow keys.

---

## 1. Project Directory Structure

Here is the minimal setup:

```
my-pluto-game/
├── index.html
├── src/
│   └── main.ts
├── package.json
└── tsconfig.json
```

---

## 2. HTML Canvas Setup (`index.html`)

Create a clean HTML file centering the canvas with a sleek dark aesthetic:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PlutoEngine Hello World</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background-color: #0b0f19;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
      font-family: sans-serif;
    }
    canvas {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <canvas id="game-canvas"></canvas>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

---

## 3. Game Logic (`src/main.ts`)

Extend the `Scene` class to define creation and game loop logic, then pass it to `PlutoEngine`:

```typescript
import { PlutoEngine, Scene, type Sprite } from 'pluto-engine';

/**
 * Main game scene
 */
class MainScene extends Scene {
  private player!: Sprite;
  private speed = 250; // pixels per second

  /**
   * Called once when the scene is created
   */
  create(): void {
    // Spawn a sprite at screen center (400, 300) with scale 32px
    this.player = this.add.sprite(400, 300, 32);

    // Apply a vibrant cyan tint (0x00E5FF)
    this.player.setTint(0x00e5ff);

    console.log(`Player created with Arena Slot ID: ${this.player.id}`);
  }

  /**
   * Called on every frame (Zero-Allocation execution)
   * @param dt Delta time in seconds since last frame
   */
  update(dt: number): void {
    const moveDist = this.speed * dt;

    // Check synchronous latched keyboard input
    if (this.input.isKeyPressed('KeyA') || this.input.isKeyPressed('ArrowLeft')) {
      this.player.x -= moveDist;
      this.player.setFlipX(true); // Face left
    }
    if (this.input.isKeyPressed('KeyD') || this.input.isKeyPressed('ArrowRight')) {
      this.player.x += moveDist;
      this.player.setFlipX(false); // Face right
    }
    if (this.input.isKeyPressed('KeyW') || this.input.isKeyPressed('ArrowUp')) {
      this.player.y -= moveDist;
    }
    if (this.input.isKeyPressed('KeyS') || this.input.isKeyPressed('ArrowDown')) {
      this.player.y += moveDist;
    }

    // Clamp player within screen boundaries
    this.player.x = Math.max(16, Math.min(800 - 16, this.player.x));
    this.player.y = Math.max(16, Math.min(600 - 16, this.player.y));
  }
}

// Start engine instance
new PlutoEngine({
  canvas: 'game-canvas',
  width: 800,
  height: 600,
  maxInstances: 10000, // Maximum arena capacity
  scene: [MainScene],
});
```

---

## 4. Key Concepts Explained

### `this.add.sprite(x, y, scale)`
Rather than allocating a heavyweight object on the JavaScript heap, `this.add.sprite` retrieves a free index from the pre-allocated `InstanceBufferArena`'s Free List and returns an ultra-light Flyweight handle.

### `this.player.x` and `this.player.y`
Property getters and setters map directly to flat contiguous TypedArrays (`arena.posX[id]`, `arena.posY[id]`).

### `this.input.isKeyPressed(code)`
PlutoEngine latches asynchronous DOM keyboard events at the beginning of each frame tick. This guarantees consistent state across your entire game logic, preventing input tearing.

### Zero-Allocation Game Loop
Notice that inside `update(dt)` there are no `new Vector2()` allocations, no object literals, and no array manipulations. All calculations use primitive scalar numbers, keeping the garbage collector dormant.

---

## 5. Running the Game

Launch your local development server:

```bash
bun run dev
# or
npm run dev
```

Open `http://localhost:5173` in your browser. You will see a glowing cyan sprite centered on a deep cosmic background, responding instantly and smoothly to your WASD and arrow keys!

Congratulations! 🎉 You have mastered the fundamentals of PlutoEngine.
Next, check out [Architecture Overview](./architecture) to explore the internals of SoA memory management, or dive directly into building a complete game in [Tutorial: Making a Swarm Survivor](/en/tutorial/01-setup)!
