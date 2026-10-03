# PlutoEngine

The core engine instance of PlutoEngine. It manages configuration options, initialization lifecycle, and plugin registration.
Designed with Data-Oriented Design (DOD) and Zero-Allocation in mind, it can run over 10,000 entities at a stable framerate in the browser.

## Overview

The `PlutoEngine` class is responsible for initializing and controlling the game loop, scene management, and rendering system.

### Architecture Under the Hood
- **Zero-Allocation**: Eliminates heap memory allocation every frame to prevent Garbage Collection (GC) spikes.
- **TypedArrays**: Component data is stored in contiguous memory blocks (SoA: Structure of Arrays) which massively improves cache efficiency.

## Instantiation

```typescript
import { PlutoEngine } from 'pluto-engine';

const config = {
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  fps: 60,
  plugins: [MyCustomPlugin]
};

const engine = new PlutoEngine(config);
engine.start();
```

## Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `config.width` | `number` | `800` | The width of the canvas. |
| `config.height` | `number` | `600` | The height of the canvas. |
| `config.backgroundColor` | `string` | `'#000000'` | The background color. |
| `config.fps` | `number` | `60` | The target framerate. |
| `config.plugins` | `Array<any>` | `[]` | An array of plugins to register upon engine initialization. |

## Methods

### `start()`
Starts the engine's game loop. The zero-allocation loop kicks in here.

### `stop()`
Stops the engine's game loop.

### `addScene(key, scene)`
Registers a scene.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `key` | `string` | A unique key to identify the scene. |
| `scene` | `Scene` | The scene instance or constructor to register. |

## Properties

- `width` (number): The current width of the canvas.
- `height` (number): The current height of the canvas.
- `isRunning` (boolean): Whether the engine is currently running.
