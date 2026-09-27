# Scene

A Scene is a distinct part of your game (e.g., Title Screen, Main Game, Result Screen).
It has its own lifecycle (init, preload, create, update) and is responsible for asset loading and entity creation.

## Overview

Each scene maintains its own isolated state and allows transitioning to other scenes.
Internally, arenas of entities and components (TypedArrays) are managed per scene and efficiently reset upon scene termination.

### Architecture Under the Hood
- **Arena Reset**: Entity ID counters are reset upon scene transitions, avoiding costly memory re-allocations.
- **Flyweight Pattern**: Objects created in the scene (like Sprites) act merely as lightweight handles wrapping an index in the TypedArray.

## Lifecycle

You can implement the following methods in a scene.

```typescript
import { Scene } from 'pluto-engine';

export class MainScene extends Scene {
  init(data) {
    // Receive data passed from other scenes
  }

  preload() {
    // Load assets (images, audio, etc.)
    this.load.image('hero', 'assets/hero.png');
  }

  create() {
    // Create game objects
    const player = this.add.sprite(100, 200, 'hero');
  }

  update(dt) {
    // Frame updates (*Do not instantiate objects here*)
  }
}
```

## Subsystems

### `this.add` (GameObjectFactory)
Factory for generating entities.
- `this.add.sprite(x, y, texture)`
- `this.add.text(x, y, text, style)`

### `this.load` (LoaderManager)
Manager for asynchronously loading assets, usually during the preload phase.
- `this.load.image(key, url)`
- `this.load.audio(key, url)`

### `this.sound` (SoundManager)
Manages audio playback.
- `this.sound.play(key)`

## Methods

### `start(key, data)`
Transitions to another scene.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `key` | `string` | The target scene key. |
| `data` | `any` | Data to pass to the target scene's `init` method. |

## Properties

- `cameras` (CameraManager): Manages cameras in the scene.
- `tweens` (TweenManager): Manages animations and tweens.
