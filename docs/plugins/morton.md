# MortonSpatialHash (Plugin)

## Introduction

`MortonSpatialHash` provides a blazingly fast, zero-allocation 2D spatial hashing system based on Morton Codes (Z-order curve) and Radix Sort. It allows $O(1)$ neighborhood queries for tens of thousands of entities.

- Author: PlutoEngine
- Source code: [MortonSpatialHash.ts](../../packages/morton/src/index.ts)

## Install plugin

```bash
bun add @plutoengine/morton
```

## Usage

### Import

```typescript
import { MortonSpatialHash, encodeMorton2D } from '@plutoengine/morton';
```

### Create instance

```typescript
const hash = new MortonSpatialHash(maxInstances);
```

- `maxInstances` : Maximum number of entities to track.

### Methods

#### Build Grid

You must rebuild the grid every frame after entities have moved. This method takes `x` and `y` typed arrays, calculates Morton codes, and sorts them internally without triggering Garbage Collection.

```typescript
hash.build(positionsX, positionsY, activeCount);
```
- `positionsX` : `Float32Array` from the Scene Arena.
- `positionsY` : `Float32Array` from the Scene Arena.
- `activeCount` : Number of alive entities.

#### Query Neighborhood

Find all entity IDs within a certain radius of a target point.

```typescript
const count = hash.query(x, y, radius, outIndices);
```
- `x`, `y` : Target coordinate.
- `radius` : Search radius.
- `outIndices` : A pre-allocated `Int32Array` where the found entity IDs will be written.
- Returns: The number of entities found.

### Example

```typescript
const outArray = new Int32Array(500); // Pre-allocate once

scene.update = (dt) => {
    // 1. Rebuild hash
    hash.build(scene.arena.posX, scene.arena.posY, scene.arena.activeCount);

    // 2. Query enemies near player
    const foundCount = hash.query(player.x, player.y, 100.0, outArray);
    
    for(let i=0; i<foundCount; i++) {
        const enemyId = outArray[i];
        // Deal damage...
    }
};
```
