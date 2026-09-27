# Introduction to PlutoEngine

Welcome to the world of **PlutoEngine**! 🪐

PlutoEngine is a next-generation, Data-Oriented (SoA) 2D WebGL/WebGPU game engine built with a singular obsession: **smoothly simulating and rendering over 100,000 active entities at stable 60 FPS / 144 FPS in web browsers**.

```
       +-------------------------------------------------------+
       |                     PlutoEngine                       |
       +-------------------------------------------------------+
            |                      |                      |
   [ Zero-Allocation ]    [ Data-Oriented SoA ]   [ WebGL2 / WebGPU ]
   Zero GC per frame       Contiguous TypedArrays  Instanced Draw Stream
            |                      |                      |
            +----------------------+----------------------+
                                   |
              100,000+ Sprites performing at 144 FPS
```

---

## Why PlutoEngine?

In modern web game development, genres like **Swarm Survivors (horde survival), Bullet Hell SHMUPs, and massive particle-driven simulations** have long been the Achilles' heel of JavaScript game engines.

### The "Garbage Collection Wall" in Traditional Engines

Renowned engines such as PixiJS and Phaser rely on traditional Object-Oriented Programming (OOP) and deep scene graphs. While intuitive and flexible, this design hits severe performance bottlenecks when scaling to tens of thousands of entities:

1. **Garbage Collection (GC) Spikes**: Creating and discarding hundreds of small objects every frame (`Vector2`, particle handles, event payloads) floods the V8 heap, causing noticeable micro-stutters and frame drops.
2. **CPU Cache Misses**: Individual entity objects are scattered randomly across the heap. The CPU cannot take advantage of contiguous L1/L2 cache prefetching, stalling execution while waiting on RAM.
3. **Draw Call Explosion**: Changing pipeline state and dispatching draw calls for individual nodes saturates CPU-to-GPU command buffers.

PlutoEngine tears down this wall by completely redesigning the engine from memory layout upward.

---

## Three Core Architectural Pillars

### 1. Zero-Allocation
During the core game loop (`update` and `render`), **zero dynamic heap allocations occur**—no `new` operators, no object literals `{}`, no array literals `[]`, and no `.push()`.
All entity transforms, tweens, and physics states reside inside pre-allocated, fixed-capacity arenas (`InstanceBufferArena`) and are recycled through a high-speed Free List.

> [!TIP]
> With zero allocations per frame, the browser's Garbage Collector remains completely dormant. Your game will run for hours without a single GC-induced stutter.

### 2. Data-Oriented Design (Structure of Arrays / SoA)
Instead of storing entities as individual class instances, data is organized in parallel, contiguous TypedArrays:

```typescript
// Traditional OOP (Array of Structures / AoS) - Poor cache locality
const enemies = [
  { x: 10, y: 20, vx: 1, vy: 2, hp: 100 },
  { x: 15, y: 25, vx: 1, vy: 2, hp: 100 },
];

// PlutoEngine (Structure of Arrays / SoA) - Maximum cache efficiency
class InstanceBufferArena {
  posX = new Float32Array(100000);
  posY = new Float32Array(100000);
  scale = new Float32Array(100000);
  facing = new Float32Array(100000);
  tint = new Uint32Array(100000);
}
```

Updating entity positions iterates sequentially through a single flat `Float32Array`. Every cache line loaded by the CPU is packed with useful data, unlocking blazing SIMD-like execution speeds.

### 3. Flyweight Handle Pattern
To keep the developer experience friendly and intuitive, classes like `Sprite` are implemented as ultralight flyweight handles:

```typescript
// sprite is a lightweight handle wrapping only an integer ID
const sprite = this.add.sprite(100, 200, 32);
sprite.x += 5; // Direct mapped to arena.posX[sprite.id] += 5
```

---

## Rendering: Unified WebGL2 & WebGPU Pipeline

PlutoEngine's rendering pipeline is built from the ground up for hardware instancing:

- **WebGPU Ready**: Next-gen WGSL shaders for parallelized rendering and compute passes.
- **WebGL2 Fallback**: Seamless fallback supporting millions of devices with hardware-instanced vertex buffers.
- **Direct GPU Streaming**: TypedArray buffers from the arena stream directly to GPU VBOs with zero copy overhead.

---

## 4 Distribution Formats

PlutoEngine supports any project workflow:

| Format | Description | Target Use Case |
| :--- | :--- | :--- |
| **1. GitHub Source** | Clone the Bun monorepo and extend the core engine | Engine developers and contributors |
| **2. TypeScript Imports** | Import `@pluto-engine/core` via npm or bun | Production apps in Vite, Next.js, Nuxt |
| **3. Transpiled ESM** | Import bundled `pluto.esm.js` directly | Modern browsers without bundlers |
| **4. `<script>` Tag (CDN)** | Drop standalone `pluto.global.js` into HTML | Rapid prototyping, CodePen, interactive demos |

---

## Engine Feature Comparison

| Feature | PlutoEngine | Phaser 3 | PixiJS v8 |
| :--- | :--- | :--- | :--- |
| **Active Sprites (60 FPS)** | **100,000+** | ~3,000 - 5,000 | ~10,000 - 20,000 |
| **Memory Architecture** | **Pure SoA (TypedArrays)** | OOP (AoS) | Scene Graph (AoS) |
| **Runtime GC Pressure** | **0 bytes (Zero-Alloc)** | Frequent per frame | Minor per frame |
| **Physics Engine** | **Ultra-light XPBD** | Arcade / Matter.js | External plugin |
| **Spatial Partitioning** | **Morton Spatial Hash** | None (Custom) | None |
| **Developer Experience** | **Intuitive Phaser-like API** | Mature & rich | Rendering-focused |

---

## Next Steps

Ready to unleash unstoppable performance in your browser games?
Head to [Installation & Setup](./setup) to get your environment ready, or jump straight into running code in [Hello World](./hello-world)!
