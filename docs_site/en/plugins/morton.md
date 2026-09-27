# Morton Order and Spatial Partitioning (Z-Curve)

To handle collision detection and rendering optimization for tens of thousands of entities, PlutoEngine provides an advanced spatial partitioning plugin based on Morton Order (Z-Curve).

## What is Morton Order?

Morton order maps 2D (or 3D) coordinate data into a 1D integer (Morton Code) while preserving spatial locality.
It is calculated by interleaving the binary bits of the coordinate values.

```
X Coordinate: 011
Y Coordinate: 101
Morton Code : 100111
```

## Ultra-Fast GPU Sorting with WGSL

Standard Quadtrees are completely against Data-Oriented Design. They require memory allocations for tree nodes, pointer chasing, and recursive traversals, which lead to GC spikes and cache misses.

Instead, PlutoEngine calculates Morton Codes from X and Y coordinates directly on the GPU via WGSL compute shaders.
Then, a parallel Radix Sort is executed on the GPU, reordering buffers so that spatially close entities are strictly adjacent in memory.

As a result, broad-phase collision detection and frustum culling become incredibly fast operations. They simply require binary searches or linear scans over a flat 1D array, without a single pointer dereference.

## Standalone Usage

```typescript
import { MortonSpatialHash } from '@pluto-engine/morton';
const solver = new MortonSpatialHash();
```

## Plugin Usage (this.registerPlugin)

```typescript
import { MortonPlugin } from '@pluto-engine/morton';

class MyScene extends Scene {
  constructor() {
    super();
    this.registerPlugin(new MortonPlugin());
  }

  update() {
    // Use it via this.spatialHash
    // this.spatialHash...
  }
}
```
