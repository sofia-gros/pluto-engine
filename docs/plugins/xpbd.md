# XPBDSolver (Plugin)

## Introduction

`XPBDSolver` is an Extended Position Based Dynamics (XPBD) solver optimized for SoA (Structure of Arrays) in PlutoEngine. It resolves overlapping circles/entities and handles infinite mass (static objects) without creating any objects (`new`) during the calculation loop.

- Author: PlutoEngine
- Source code: [XPBDSolver.ts](../../packages/xpbd/src/XPBDSolver.ts)

## Install plugin

```bash
bun add @plutoengine/xpbd
```

## Usage

### Import

```typescript
import { XPBDSolver } from '@plutoengine/xpbd';
```

### Register to Scene

To use the solver automatically in the fixed update step, register it to the Scene.

```typescript
scene.registerPlugin(new XPBDSolver());
```

*(Note: The exact plugin wrapper class name may vary depending on implementation, but the core logic remains in `XPBDSolver`)*

### Direct Method (Static)

If you wish to call the solver manually inside your own system without registering as a Scene plugin:

```typescript
XPBDSolver.solve(
    positionsX, 
    positionsY, 
    radii, 
    invMasses, 
    iterations
);
```

- `positionsX` : `Float32Array` of X coordinates.
- `positionsY` : `Float32Array` of Y coordinates.
- `radii` : `Float32Array` of collision radii.
- `invMasses` : `Float32Array` of inverse masses ($1.0 / mass$). Set to $0$ for immovable static objects (like walls/pillars).
- `iterations` : (number) Accuracy of the solver. Default is `2`.

### Example

```typescript
import { Scene } from '@plutoengine/core';
import { XPBDSolver } from '@plutoengine/xpbd';

const scene = new Scene(50000);

// Use XPBD to prevent entities from overlapping
scene.registerPlugin(new XPBDSolver());

const mob1 = scene.add.sprite();
const mob2 = scene.add.sprite();

// If mob1 and mob2 overlap, the solver will push them apart during scene.fixedUpdate()
```
