<div align="center">
  <h1>🌌 PlutoEngine</h1>
  <p><strong>Next-generation Zero-Allocation 2D WebGL/WebGPU Game Engine</strong></p>
  <p>A data-oriented, highly optimized 2D engine built for the web, capable of rendering and simulating 100,000+ entities at 60/144 FPS in the browser without garbage collection spikes.</p>
</div>

---

## 📖 About / 概要

PlutoEngine is a modern 2D game engine designed specifically for **massive entity counts** (like *Vampire Survivors*-style swarms or sandbox simulations). 
While excellent traditional object-oriented engines like Phaser and PixiJS are industry standards and incredibly feature-rich, they often encounter limitations when instantiating tens of thousands of objects due to JavaScript's Garbage Collection (GC) overhead and the memory footprint of deep prototype chains.

PlutoEngine takes a radically different approach: **Data-Oriented Design (DOD)** and **Zero-Allocation loops**. 

Instead of objects like `new Sprite(x, y)`, PlutoEngine uses a flat `Structure of Arrays (SoA)` architecture backed by TypedArrays (`Float32Array`, `Uint32Array`). 
Rendering is done via **Hardware Instancing** in WebGL2 (and WebGPU ready), meaning 100,000 sprites can be drawn in a single Draw Call.

## 🚀 Performance Comparison

*Note: The following are conceptual benchmarks for rendering + basic physics/movement loops in a standard modern browser.*

| Metric | Traditional OOP Engine (e.g., Phaser/PixiJS) | PlutoEngine |
|--------|----------------------------------------------|-------------|
| **Entity State Memory** | Scattered heap objects with properties | Pre-allocated contiguous `Float32Array` |
| **Max Entities (60FPS)** | ~10,000 - 20,000 (depending on logic) | **100,000+** |
| **Draw Calls** | Batched (often breaks on texture/Z changes) | **1** (Instanced via Texture Arrays) |
| **Garbage Collection** | Occasional GC spikes from object creation | **Zero** (in hot path) |
| **Spatial Hashing** | Object grids / Quadtrees | Bit-interleaved **Morton Codes** (TypedArray) |

## 🌟 Key Features

*   **Zero-Allocation Loop**: Once the `InstanceBufferArena` is allocated, no new objects or arrays are created during gameplay. Goodbye, GC micro-stutters!
*   **WGSL-First Shaders**: Shaders are written in WGSL and automatically transpiled to GLSL for WebGL2 fallback at build time via our custom Vite plugin.
*   **SoA Scene Graph**: Hierarchical transformations (parents & children) calculated entirely within flat loops without deep tree traversals.
*   **Built-in Advanced Plugins**:
    *   **Morton Spatial Hash**: $O(1)$ neighboring queries using Z-order curves.
    *   **XPBD**: Extended Position-Based Dynamics for crowd anti-clustering.
    *   **Continuum Crowds**: Poisson pressure solvers for fluid-like swarms.
    *   **Verlet IK**: Lightweight physics for ropes and boss tentacles.
*   **Modern Audio**: Web Audio API integration with `DynamicsCompressorNode` limiting and `VoiceNode` pooling for zero-clip massive explosions.

## 📦 Installation & Usage

You can use PlutoEngine via ES modules, or directly drop it in a script tag.

```bash
bun add @pluto-engine/core @pluto-engine/renderer
```

### Quick Start Example

```typescript
import { PlutoEngine, Scene } from '@pluto-engine/core';
import { MortonPlugin } from '@pluto-engine/morton';

class MainScene extends Scene {
  init() {
    // Inject Morton Spatial Hashing
    this.registerPlugin(new MortonPlugin(64));
  }

  create() {
    // Spawn 10,000 entities instantly without GC
    for (let i = 0; i < 10000; i++) {
      this.add.sprite(Math.random() * 800, Math.random() * 600, 16);
    }
  }

  update(dt) {
    // Update logic runs directly on typed arrays
  }
}

const engine = new PlutoEngine({
  width: 800,
  height: 600,
  scene: MainScene
});
```

## 📚 Documentation

Read the full documentation, architecture deep-dives, and our **10-Part Swarm Survivor Tutorial** here:
**[👉 PlutoEngine Documentation](https://sofia-gros.github.io/pluto-engine/)**

## 📄 License
MIT License
