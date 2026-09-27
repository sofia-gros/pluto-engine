# TweenManager

A system for smoothly animating entity properties (such as position, scale, and alpha) over time.

## Overview

The tween system in PlutoEngine is designed around Data-Oriented Design to smoothly animate a massive amount of objects simultaneously.

### Architecture Under the Hood
- **Array-based DOD**: The progression state, target values, and starting values for all tweens are stored entirely in contiguous TypedArrays.
- **Zero-Object Instantiation**: Setup objects are parsed when tweens are added, but absolutely no objects are allocated during the execution (update loop).

## Usage

```typescript
export class MainScene extends Scene {
  create() {
    const sprite = this.add.sprite(100, 100, 'box');

    this.tweens.add({
      targets: sprite,
      x: 500,
      y: 300,
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1 // Infinite loop
    });
  }
}
```

## Tween Configuration

The properties of the configuration object passed to `this.tweens.add(config)`.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `targets` | `any \| Array<any>` | - | The target(s) to apply the tween to (e.g., Sprite). Can be an array. |
| `duration` | `number` | `1000` | The duration of the animation in milliseconds. |
| `ease` | `string` | `'Linear'` | The name of the easing function (e.g., `'Power2'`, `'Bounce.out'`). |
| `delay` | `number` | `0` | Time to wait before starting the animation in milliseconds. |
| `yoyo` | `boolean` | `false` | If `true`, the animation will play in reverse back to the starting state. |
| `repeat` | `number` | `0` | Number of times to repeat. Use `-1` for infinite loops. |
| `onComplete` | `Function` | `undefined` | Callback invoked when the tween completes. |

## Methods

### `add(config)`
Creates a new tween and starts playing it.

### `pauseAll()`
Pauses all currently running tweens.

### `resumeAll()`
Resumes all paused tweens.
