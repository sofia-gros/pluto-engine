# Installation & Setup

PlutoEngine can be integrated into your workflow through four distribution formats, covering everything from TypeScript bundler projects to standalone HTML scripts.

---

## Prerequisites

- **Node.js**: v18.0.0 or higher, or **Bun** (recommended: 1.0+)
- **Modern Browser**: Chrome, Edge, Firefox, or Safari with WebGL2 or WebGPU support enabled.

---

## Method 1: Package Manager (Recommended)

For modern web projects using Vite, Next.js, Nuxt, or Astro, installing via a package manager provides optimal bundling, tree-shaking, and full TypeScript type definitions.

### 1. Create a Project (Vite + TypeScript)

```bash
# Using Bun (Recommended)
bun create vite my-pluto-game --template vanilla-ts
cd my-pluto-game

# Using npm
npm create vite@latest my-pluto-game -- --template vanilla-ts
cd my-pluto-game
```

### 2. Install PlutoEngine

Install the all-in-one `pluto-engine` package or `@pluto-engine/core`:

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
```bash [yarn]
yarn add pluto-engine
```
:::

If you prefer modular fine-grained dependencies:

```bash
bun add @pluto-engine/core @pluto-engine/renderer @pluto-engine/xpbd @pluto-engine/morton
```

---

## Method 2: TypeScript Engine Imports

In your TypeScript project, configure `tsconfig.json` for strict typing and modern JavaScript module resolution:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "strict": true,
    "isolatedModules": true
  }
}
```

Import directly in your source code:

```typescript
import { PlutoEngine, Scene } from 'pluto-engine';
// or
import { PlutoEngine, Scene } from '@pluto-engine/core';
```

---

## Method 3: Transpiled JavaScript ESM Imports

If you want to run modern JavaScript directly in the browser without a bundler, import the transpiled ES module via CDN:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PlutoEngine ESM Demo</title>
</head>
<body>
  <canvas id="game-canvas"></canvas>

  <script type="module">
    import { PlutoEngine, Scene } from 'https://cdn.jsdelivr.net/npm/pluto-engine/dist/pluto.esm.js';

    class MainScene extends Scene {
      create() {
        const sprite = this.add.sprite(400, 300, 'textureKey').setDisplaySize(30, 30);
        sprite.setTint(0x00ffff);
      }
    }

    new PlutoEngine({
      canvas: 'game-canvas',
      scene: [MainScene]
    });
  </script>
</body>
</html>
```

---

## Method 4: `<script>` Tag (CDN Ready)

For single-file demos, prototyping, or embedding in CodePen and JSFiddle, load the standalone global UMD/IIFE bundle. All shaders and core modules are bundled into a single file, exposing the `Pluto` namespace globally on `window`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PlutoEngine Standalone</title>
  <!-- PlutoEngine Global Bundle -->
  <script src="https://cdn.jsdelivr.net/npm/pluto-engine/dist/pluto.global.js"></script>
</head>
<body>
  <canvas id="game-canvas"></canvas>

  <script>
    const { PlutoEngine, Scene } = window.Pluto;

    class BattleScene extends Scene {
      create() {
        console.log("Instance arena ready!");
      }
    }

    const game = new PlutoEngine({
      canvas: 'game-canvas',
      width: 1280,
      height: 720,
      scene: [BattleScene]
    });
  </script>
</body>
</html>
```

---

## Recommended Developer Tooling

1. **Editor**: [Visual Studio Code](https://code.visualstudio.com/) or [Cursor](https://www.cursor.com/)
2. **Recommended Extensions**:
   - `Biome` (Fast formatting and linting)
   - `TypeScript Vue Plugin` / `Tailwind CSS IntelliSense` (for hybrid UI overlays)
3. **Local Dev Server**: Vite or Bun dev server (`bun run dev`)

Once your environment is ready, continue to [Hello World](./hello-world) to run your first game canvas.
