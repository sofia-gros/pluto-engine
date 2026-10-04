# Scene & Arena Memory Management

In PlutoEngine, a "Scene" represents a collection of pre-allocated component data (the Arena) and the systems that manipulate them.

## Arena Memory Management

To prevent memory fragmentation and GC spikes caused by object creation and destruction, PlutoEngine uses a custom Arena Allocator.

### Structure of Arrays (SoA)

An Entity is nothing more than an integer "ID". Its actual data is stored at the same index across multiple independent TypedArrays, one for each component type.

```typescript
// Internal representation (SoA)
const positionsX = new Float32Array(MAX_ENTITIES);
const positionsY = new Float32Array(MAX_ENTITIES);
const velocitiesX = new Float32Array(MAX_ENTITIES);
const velocitiesY = new Float32Array(MAX_ENTITIES);

// Updating Entity ID = 42
positionsX[42] += velocitiesX[42] * dt;
positionsY[42] += velocitiesY[42] * dt;
```

This drastically improves CPU cache hit rates and enables SIMD-like contiguous memory access patterns.

## Entity Lifecycle

"Spawning" an entity simply means popping a free ID from a free-list and initializing the corresponding indices in the component arrays. "Despawning" means pushing the ID back to the free-list.

1. **Spawn**: Pop an ID from the free-list. Reset target indices in component arrays.
2. **Update**: Systems iterate over all active IDs.
3. **Despawn**: Push the ID back to the free-list for reuse.
