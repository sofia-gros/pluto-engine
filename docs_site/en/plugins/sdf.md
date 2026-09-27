# SDF Text & Poisson Disk Sampling

High-quality font rendering and natural object placement are vital in 2D games. PlutoEngine solves these through the SDF and procedural generation plugins.

## Signed Distance Field (SDF) Fonts

Traditional bitmap fonts become pixelated when scaled. SDF stores the "distance" to the nearest contour of a glyph inside the texture.

PlutoEngine's WGSL renderer samples this SDF texture and mathematically computes perfectly crisp curves at any scale, directly inside the fragment shader.
Effects like outlines, glows, and drop shadows are applied at virtually zero cost using simple shader arithmetic.

## Poisson Disk Sampling

This is an algorithm used to place objects (like grass, trees, or crowds) randomly but "naturally" (without excessive overlap).
Within PlutoEngine's DOD architecture, this algorithm is run during initialization. The resulting massive coordinate data array is bulk-loaded directly into the `Float32Array` arena.

At runtime, tens of thousands of vegetation entities are drawn via WGSL instancing with strict zero-allocation.

## Standalone Usage

```typescript
import { SDFCollider } from '@plutoengine/sdf-collider';
const solver = new SDFCollider();
```

## Plugin Usage (this.registerPlugin)

```typescript
import { SdfPlugin } from '@plutoengine/sdf-collider';

class MyScene extends Scene {
  constructor() {
    super();
    this.registerPlugin(new SdfPlugin());
  }

  update() {
    // Use it via this.sdf
    // this.sdf...
  }
}
```
