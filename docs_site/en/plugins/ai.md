# AI and Behavior Trees

When attempting to run AI for thousands or tens of thousands of entities simultaneously, object-oriented state machines or node-based behavior trees suffer severe performance collapse due to pointer chasing and virtual function call overheads.

## Flat Data-Driven AI

PlutoEngine's AI plugin flattens logic trees into a sequence of "instruction arrays" (bytecode) in memory.

1. **Behavior Compilation**
   AI behaviors defined via nodes or JSON (State Machines or Behavior Trees) are compiled into a 1D instruction set (an arena of `Uint16Array` or `Uint32Array`) during initialization.
2. **Instruction Pointers**
   Instead of holding massive state objects, an entity's AI component only stores an "Instruction Pointer (index)" and a few registers (like timers or target entity IDs).
3. **Batch Execution**
   The CPU continuously iterates over arrays of entities sharing the same AI patterns. Instructions are processed sequentially via tightly packed switch statements or lookup tables.

This minimizes CPU cache misses, allowing 10,000 enemy entities to simultaneously execute complex searching, pathfinding, and attacking logic without dropping frames.

## Standalone Usage

```typescript
import { UtilityAISystem } from '@plutoengine/ai';
const solver = new UtilityAISystem();
```

## Plugin Usage (this.registerPlugin)

```typescript
import { AiPlugin } from '@plutoengine/ai';

class MyScene extends Scene {
  constructor() {
    super();
    this.registerPlugin(new AiPlugin());
  }

  update() {
    // Use it via this.ai
    // this.ai...
  }
}
```
