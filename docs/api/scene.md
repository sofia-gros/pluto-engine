# Scene (Core)

## Introduction

Scene is the main facade and lifecycle manager in PlutoEngine. It orchestrates the `InstanceBufferArena`, `GameLoop`, `InputManager`, and any registered plugins (XPBD, AI, etc.). It provides a familiar Phaser-like API to allocate sprites while strictly maintaining a Zero-Allocation SoA (Structure of Arrays) architecture under the hood.

- Author: PlutoEngine
- Source code: [Scene.ts](../../packages/core/src/scene/Scene.ts)

## Install plugin

The `Scene` is part of the `@pluto-engine/core` package.

```bash
bun add @pluto-engine/core
```

## Usage

### Import

```typescript
import { PlutoEngine, Scene } from '@pluto-engine/core';
```

### Create instance (Engine Entry Point)

To use a Scene, you pass it to the `PlutoEngine` configuration object, exactly like Phaser.

```typescript
const game = new PlutoEngine({
    canvas: 'game-canvas',
    maxInstances: 100000,
    scene: [MyGameScene]
});
```

- `maxInstances` : Maximum number of entities (sprites) this scene can handle. Pre-allocates TypedArrays. Default is `100000`.

### Register Plugins

Inject lightweight physics, AI, or rendering plugins into the Scene lifecycle.

```typescript
scene.registerPlugin(pluginInstance);
```

- `pluginInstance` : An object implementing the `Plugin` interface (`init`, `update`, `fixedUpdate`, `destroy`).

Example:
```typescript
import { XPBDSolver } from '@pluto-engine/xpbd';
scene.registerPlugin(new XPBDSolver());
```

### Add Sprite

Allocate a new flyweight sprite from the `InstanceBufferArena`. Returns `-1` (or throws) if capacity is full.

```typescript
const sprite = scene.add.sprite();
```

Properties of the returned `Sprite` flyweight object:
- `sprite.x` (number)
- `sprite.y` (number)
- `sprite.scale` (number)
- `sprite.setFlipX(flip: boolean)`
- `sprite.setTint(tintHex: number)`
- `sprite.destroy()` : Returns the internal ID to the free-list in $O(1)$.

### Lifecycle Methods (Phaser-compatible)

When you extend the `Scene` class, you can override these methods:

```typescript
class MyGame extends Scene {
    // 1. Called first, used for passing data between scenes
    init() {}

    // 2. Called once to allocate sprites, attach plugins, and load initial states
    create() {
        this.registerPlugin(new XPBDSolver());
        const player = this.add.sprite();
    }

    // 3. Called every frame with variable delta time
    update(dt: number) {
        if (this.input.isKeyPressed('Space')) {
            // Jump logic...
        }
    }

    // 4. Called at a fixed physics interval
    fixedUpdate(fixedDt: number) {
        // AI / Physics manual updates if not using a plugin
    }
}
```

### Input

Access the latched `InputManager` to check keys synchronously without GC spikes.

```typescript
const isDown = scene.input.isKeyPressed('Space');
const justDown = scene.input.isKeyJustPressed('ArrowUp');
const justUp = scene.input.isKeyJustReleased('ArrowUp');
```
