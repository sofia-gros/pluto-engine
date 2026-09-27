# PoissonSolver (Plugin)

## Introduction

`PoissonSolver` provides a grid-based Continuum Crowds simulation. It uses density splatting and Jacobi iteration to solve the Unilateral Incompressibility Constraint (UIC) for pressure, enabling fluid-like swarming behaviors for massive crowds.

- Author: PlutoEngine
- Source code: [PoissonSolver.ts](../../packages/poisson/src/PoissonSolver.ts)

## Install plugin

```bash
bun add @pluto-engine/poisson
```

## Usage

### Import

```typescript
import { PoissonSolver } from '@pluto-engine/poisson';
```

### Create instance

```typescript
const solver = new PoissonSolver(gridWidth, gridHeight, cellSize);
```

- `gridWidth` : Number of columns in the grid.
- `gridHeight` : Number of rows in the grid.
- `cellSize` : Physical size of one cell.

### Properties

- `solver.density` : `Float32Array` of grid densities.
- `solver.pressure` : `Float32Array` of computed pressures.
- `solver.dirX`, `solver.dirY` : `Float32Array` of flow vector fields.

### Methods

#### Splat Density

Map entity coordinates into the grid density field.

```typescript
solver.splatDensity(positionsX, positionsY, activeCount);
```

#### Solve Pressure

Run Jacobi iterations to calculate pressure waves avoiding dense areas.

```typescript
solver.solve(iterations);
```
- `iterations` : Recommended `2` to `4` for real-time.

#### Get Pressure Gradient

Retrieve the push-back vector at a specific grid coordinate to apply to entity steering.

```typescript
solver.getPressureGradient(gridX, gridY, outVector);
```
- `outVector` : A `Float32Array(2)` to receive the `[x, y]` gradient.

### Example

```typescript
scene.update = (dt) => {
    // 1. Splat all enemy positions to density
    solver.splatDensity(scene.arena.posX, scene.arena.posY, scene.arena.activeCount);
    
    // 2. Compute fluid pressure
    solver.solve(2);
    
    // 3. Apply to steering...
};
```
