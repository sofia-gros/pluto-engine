# UtilityAISystem (Plugin)

## Introduction

`UtilityAISystem` replaces expensive FSMs (Finite State Machines) with a lightweight, Structure of Arrays (SoA) compatible score-based AI. Entities dynamically choose their best `actionId` by calculating utilities (scores) without any branching or object allocation.

- Author: PlutoEngine
- Source code: [UtilityAISystem.ts](../../packages/ai/src/UtilityAISystem.ts)

## Install plugin

```bash
bun add @pluto-engine/ai
```

## Usage

### Import

```typescript
import { UtilityAISystem } from '@pluto-engine/ai';
```

### Create instance

```typescript
const aiSystem = new UtilityAISystem(maxInstances);
```

### Properties

- `aiSystem.actionIds` : `Uint8Array` storing the currently selected action for each entity ID.

### Methods

#### Begin Evaluation

Resets the internal score buffers before evaluating actions.

```typescript
aiSystem.beginEvaluation(activeCount);
```

#### Evaluate Action

Scores an action for all active entities. If the score is higher than the previous maximum, the entity's `actionId` is updated.

```typescript
// evaluateAction(actionId, scoringKernel)
aiSystem.evaluateAction(1 /* ATTACK */, (id) => {
    // Calculate score for this specific entity ID
    const distToPlayer = calculateDist(id);
    return (distToPlayer < 100) ? 100.0 : 0.0;
});
```

### Example

```typescript
const ACTION_IDLE = 0;
const ACTION_ATTACK = 1;
const ACTION_FLEE = 2;

scene.update = (dt) => {
    aiSystem.beginEvaluation(scene.arena.activeCount);

    // Idle is baseline score
    aiSystem.evaluateAction(ACTION_IDLE, (id) => 10.0);
    
    // Attack if player is near
    aiSystem.evaluateAction(ACTION_ATTACK, (id) => {
        return (getDist(id) < 200) ? 50.0 : 0.0;
    });

    // Flee if HP is low
    aiSystem.evaluateAction(ACTION_FLEE, (id) => {
        return (getHp(id) < 10) ? 100.0 : 0.0;
    });

    // Now aiSystem.actionIds contains the best action for each entity
};
```
