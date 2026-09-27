# Getting Started

PlutoEngine is a next-generation 2D game engine built around zero-allocation and data-oriented design principles. It is engineered to achieve extreme performance (stable 60FPS/144FPS) in browser environments.

## Core Features

- **Zero-Allocation**: Eliminates per-frame garbage collection (GC) spikes.
- **Structure of Arrays (SoA)**: Improves memory locality and maximizes CPU cache efficiency.
- **WGSL First**: Adopts WGSL for modern WebGPU, with built-in fallback to WebGL2.

## Installation

```bash
npm install pluto-engine
```

## Basic Usage

Initializing the engine is straightforward:

```ts
import { PlutoEngine } from 'pluto-engine';

const engine = new PlutoEngine({ canvas: document.getElementById('app') });
engine.start();
```
