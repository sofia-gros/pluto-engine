# VerletSolver (Plugin)

## Introduction

`VerletSolver` is a lightweight physics plugin using Verlet Integration. It calculates point constraints (ropes, capes, tentacles) purely on TypedArrays without object allocations.

- Author: PlutoEngine
- Source code: [VerletSolver.ts](../../packages/verlet-ik/src/VerletSolver.ts)

## Install plugin

```bash
bun add @plutoengine/verlet-ik
```

## Usage

### Import

```typescript
import { VerletSolver } from '@plutoengine/verlet-ik';
```

### Create instance

```typescript
// Supports up to 1000 constraint points
const verlet = new VerletSolver(1000);
```

### Methods

#### Add Point

Allocates a point in the solver and returns its ID.

```typescript
const p1 = verlet.addPoint(x, y, isPinned);
```

#### Add Constraint (Rope segment)

Binds two points together to maintain a specific distance.

```typescript
verlet.addConstraint(p1, p2, distance);
```

#### Update

Step the simulation (Gravity, Integration, Constraint Relaxation).

```typescript
verlet.update(dt);
```

### Example

```typescript
const verlet = new VerletSolver(100);

// Create a pendulum / rope
const anchor = verlet.addPoint(100, 100, true);  // Pinned (immovable)
const tail1  = verlet.addPoint(100, 150, false); // Movable
const tail2  = verlet.addPoint(100, 200, false);

verlet.addConstraint(anchor, tail1, 50);
verlet.addConstraint(tail1, tail2, 50);

scene.update = (dt) => {
    verlet.update(dt);
    // Render the rope using verlet.x[tail1], verlet.y[tail1]...
};
```
