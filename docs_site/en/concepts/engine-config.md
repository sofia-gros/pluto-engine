# Engine Configuration & Initialization

PlutoEngine is an ultra-high-performance 2D game engine for the browser, built fundamentally around Zero-Allocation and Data-Oriented Design (DOD).
By pre-allocating all memory arenas during engine initialization, it completely eliminates garbage collection (GC) spikes during the game loop.

## Core Philosophy

1. **Zero-Allocation**
   In the critical path of `update` and `render` loops, the engine strictly avoids the `new` operator, as well as array or object literals. This prevents the browser GC from causing frame drops.
2. **Data-Oriented Design (DOD / SoA)**
   Instead of using arrays of object instances (Array of Structures - AoS), component data is stored in flat TypedArrays like `Float32Array` or `Uint32Array` (Structure of Arrays - SoA).
3. **WGSL-First Rendering**
   To fully leverage WebGPU, all rendering logic is designed WGSL-first, tightly integrating with compute shaders for parallel processing.

## Initialization Flow

```typescript
import { Engine, EngineConfig } from 'pluto-engine';

const config: EngineConfig = {
  canvas: document.getElementById('gameCanvas') as HTMLCanvasElement,
  maxEntities: 100000,       // Maximum number of entities to pre-allocate
  targetFPS: 60,             // Target framerate
  memoryPoolSize: 1024 * 1024 * 64, // 64MB shared memory pool
};

const engine = new Engine(config);
await engine.init();
engine.start();
```

During initialization, index spaces in TypedArrays are allocated up to `maxEntities`. During gameplay, the engine recycles these indices (e.g., using a free-list) to maintain zero-allocation.
