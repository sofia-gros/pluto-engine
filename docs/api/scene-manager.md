# SceneManager (Core)

## Introduction

`SceneManager` is the orchestrator for multiple `Scene` instances in PlutoEngine (e.g., TitleScreen, GameScene, ResultScene). It manages the global `GameLoop` and dispatches `update` and `fixedUpdate` events to the active scene while strictly enforcing zero-allocation during gameplay.

- Author: PlutoEngine
- Source code: [SceneManager.ts](../../packages/core/src/scene/SceneManager.ts)

## Install plugin

Included in the core package.
```bash
bun add @pluto-engine/core
```

## Usage

### Import

```typescript
import { SceneManager, Scene } from '@pluto-engine/core';
```

### Create and Register Scenes (via PlutoEngine)

The `SceneManager` is automatically created and injected into your scenes as `this.scene` when you initialize the engine.

```typescript
import { PlutoEngine, Scene } from '@pluto-engine/core';

class TitleScene extends Scene {}
class GameScene extends Scene {}

const game = new PlutoEngine({
    scene: [TitleScene, GameScene]
});
```

### Methods (Accessible via `this.scene`)

#### `add(key, SceneClass, autoStart)`
Registers a new scene dynamically.

#### `start(key)`
Starts a scene, invoking its `init` and `create` lifecycle methods.

#### `switch(key)`
Calls `shutdown()` on the currently active scene, and seamlessly transitions to the specified scene.

### Example

```typescript
import { SceneManager, Scene } from '@pluto-engine/core';

class TitleScene extends Scene {
    create() {
        console.log("Title Screen Loaded!");
    }

    update(dt: number) {
        if (this.input.isKeyJustPressed('Space')) {
            this.manager.switch('game');
        }
    }
}

class GameScene extends Scene {
    create() {
        console.log("Game Started!");
        // Initialize 10,000 enemies here...
    }
}

const game = new SceneManager();
game.add('title', TitleScene);
game.add('game', GameScene);
game.start('title');
```
