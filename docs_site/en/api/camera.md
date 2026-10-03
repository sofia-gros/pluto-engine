# Camera / CameraManager

The system responsible for managing the rendering area and viewpoint of the 2D world. It supports camera movement, zooming, and effects like shaking.

## Overview

Each scene can have multiple cameras, but a default `main` camera is always provided.
Camera transforms (position, scale, rotation) are translated into matrix operations and passed directly to the shaders during rendering.

### Architecture Under the Hood
- **Float32Array Matrices**: The camera's view matrix and projection matrix are stored as `Float32Array`s, ensuring they are ready for direct transfer to WebGL.

## Usage

```typescript
export class MainScene extends Scene {
  create() {
    // Scroll camera
    this.cameras.main.x = 100;
    this.cameras.main.y = 200;

    // Zoom camera
    this.cameras.main.zoom = 1.5;

    // Camera shake
    this.cameras.main.shake(500, 0.05);

    // Set bounds (prevent camera from moving outside this area)
    this.cameras.main.setBounds(0, 0, 2000, 2000);
  }
}
```

## Methods

### `shake(duration, intensity)`
Plays a shaking effect on the camera.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `duration` | `number` | - | The duration of the shake in milliseconds. |
| `intensity` | `number` | `0.05` | The intensity of the shake. |

### `setBounds(x, y, width, height)`
Sets the bounding rectangle that the camera can move within.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `x` | `number` | The top-left X coordinate of the bounds. |
| `y` | `number` | The top-left Y coordinate of the bounds. |
| `width` | `number` | The width of the bounds. |
| `height` | `number` | The height of the bounds. |

## Properties

- `x` (number): The X coordinate of the camera's center or top-left (scroll amount).
- `y` (number): The Y coordinate of the camera's center or top-left (scroll amount).
- `zoom` (number): The zoom level of the camera (default `1.0`).
