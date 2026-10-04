# Chapter 1: Project Setup & Arena Initialization

Welcome to the Swarm Survivor tutorial! 🎮
Over the course of these 10 chapters, you will build a complete, high-octane **Swarm Survivor game** from scratch using PlutoEngine, featuring **thousands of monsters relentlessly swarming the player in real-time**!

In traditional browser game engines, having more than 300 active enemies quickly triggers garbage collection (GC) stalls and frame drops. With PlutoEngine's **Data-Oriented Design (SoA) and Zero-Allocation architecture**, your game will effortlessly simulate 5,000+ monsters at a silky-smooth 144 FPS.

In Chapter 1, we will set up the development environment, configure the HTML canvas, and initialize the engine with a massive memory arena.

---

## 1. Project Initialization

Let's scaffold a clean Vite + TypeScript project.

```bash
# Using Bun (Recommended)
bun create vite swarm-survivor --template vanilla-ts
cd swarm-survivor

# Install PlutoEngine
bun add pluto-engine
```

> [!TIP]
> If you prefer npm or pnpm, run `npm create vite@latest swarm-survivor -- --template vanilla-ts` followed by `npm install pluto-engine`.

---

## 2. Canvas & HTML Setup (`index.html`)

Configure `index.html` with a centered, glowing canvas container:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Swarm Survivor - PlutoEngine</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      user-select: none;
    }
    body {
      background-color: #030712;
      color: #f3f4f6;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
    }
    #game-container {
      position: relative;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.15);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #1f2937;
    }
    canvas {
      display: block;
    }
  </style>
</head>
<body>
  <div id="game-container">
    <canvas id="game-canvas"></canvas>
  </div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

---

## 3. Scene & Engine Startup (`src/main.ts`)

Create your game scene `SwarmSurvivorScene` and bootstrap `PlutoEngine` in `src/main.ts`:

```typescript
import { PlutoEngine, ScaleMode, Scene } from 'pluto-engine';

/**
 * Main gameplay scene for Swarm Survivor
 */
export class SwarmSurvivorScene extends Scene {
  /**
   * Called once when the scene initializes
   */
  create(): void {
    console.log('🪐 SwarmSurvivorScene initialized!');
    console.log(`Arena capacity: ${this.arena.capacity} instances`);

    // Place a small test marker sprite at the center of the arena
    const centerMarker = this.add.sprite(960 / 2, 540 / 2, 'textureKey').setDisplaySize(16, 16);
    centerMarker.setTint(0x38bdf8); // Sky blue (0xRRGGBB)
  }

  /**
   * Per-frame game loop (Zero-Allocation execution)
   * @param dt Elapsed time since previous frame in seconds
   */
  update(dt: number): void {
    // Player controls will be implemented in Chapter 2
  }
}

// Bootstrap PlutoEngine instance
const engine = new PlutoEngine({
  canvas: 'game-canvas',
  width: 960,
  height: 540,
  scaleMode: ScaleMode.FIT,
  autoCenter: true,
  maxInstances: 50000, // Pre-allocates SoA arena capacity for 50,000 entities
  scene: [SwarmSurvivorScene],
});
```

---

## 4. The Power of `maxInstances: 50000`

The secret to PlutoEngine's performance lies in **allocating all memory upfront during boot**:

- `Float32Array` (4 bytes) × 50,000 slots = ~200 KB per array.
- Combining X, Y, scale, facing, tint, and active flags consumes **just a few megabytes of contiguous memory**.

Because this memory is locked in at startup, the browser's JavaScript V8 engine never needs to reallocate heap memory while monsters spawn and perish. This permanently eliminates garbage collection pauses!

---

## 5. Verification

Start your local dev server:

```bash
bun run dev
```

Open your browser. You will see a crisp dark canvas with a glowing sky-blue marker sprite centered perfectly.

Chapter 1 is complete! In [Chapter 2: Player Controls & Input Management](./02-player), we will create our hero character and implement responsive 8-way movement.
