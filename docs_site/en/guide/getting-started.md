# Quick Start Guide

This guide covers the minimum steps needed to get a PlutoEngine game running in your browser.

---

## 3 Steps to Launch Your First Game

```
[ Step 1: Install ]         -->  [ Step 2: Define Scene ]    -->  [ Step 3: Launch Engine ]
 bun add pluto-engine              Extend Scene class                new PlutoEngine(config)
```

### Step 1: Install Package

Install `pluto-engine` using your package manager of choice:

::: code-group
```bash [bun]
bun add pluto-engine
```
```bash [npm]
npm install pluto-engine
```
```bash [pnpm]
pnpm add pluto-engine
```
:::

### Step 2: Setup HTML

Create an `index.html` file with a centered `<canvas>`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PlutoEngine Quick Start</title>
  <style>
    body { margin: 0; background: #050811; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
  </style>
</head>
<body>
  <canvas id="game-canvas"></canvas>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

### Step 3: Implement Game Logic

Write the following code in `src/main.ts`:

```typescript
import { PlutoEngine, Scene } from 'pluto-engine';

class GameScene extends Scene {
  create() {
    // Spawn sprite at screen center
    const sprite = this.add.sprite(400, 300, 32);
    sprite.setTint(0x00ffcc); // Emerald green
  }

  update(dt: number) {
    // Per-frame logic (Zero-Allocation)
  }
}

// Initialize and start engine
new PlutoEngine({
  canvas: 'game-canvas',
  width: 800,
  height: 600,
  maxInstances: 50000,
  scene: [GameScene],
});
```

Start your dev server and check your browser:

```bash
bun run dev
```

---

## Guide Roadmap

Explore the guides to learn more:

- **[Introduction to PlutoEngine](./intro)**: Core philosophy, GC elimination, and SoA design.
- **[Installation & Setup](./setup)**: Details on TS imports, standalone ESM, and CDN tags.
- **[Hello World](./hello-world)**: Full walk-through with keyboard controls and boundaries.
- **[Architecture Overview](./architecture)**: Under-the-hood look at memory arenas and rendering.
- **[Tutorial: Making a Swarm Survivor](/en/tutorial/01-setup)**: The complete 10-part tutorial building a 10,000+ monster survival game from scratch.
