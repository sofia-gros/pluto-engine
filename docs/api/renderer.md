# GraphicsDevice (Core Renderer)

## Introduction

`GraphicsDevice` is a zero-allocation unified renderer abstraction supporting both WebGPU and WebGL2. It takes raw SoA TypedArrays (`InstanceBufferArena`) and streams them directly into VRAM using `writeBuffer` or `bufferSubData` without creating JavaScript objects.

- Author: PlutoEngine
- Source code: [GraphicsDevice.ts](../../packages/renderer/src/GraphicsDevice.ts)

## Install plugin

```bash
bun add @pluto-engine/renderer
```

## Usage

### Import

```typescript
import { createGraphicsDevice, GraphicsDevice } from '@pluto-engine/renderer';
```

### Initialization

Always initialize via the asynchronous factory function. It will automatically return a `WebGPUDevice` if supported, otherwise it falls back to a `WebGL2Device`.

```typescript
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const device: GraphicsDevice = await createGraphicsDevice(canvas);
```

### Methods

#### Create Buffer

Creates a hardware buffer for vertex data or instance data.

```typescript
// Create an instance buffer big enough for 100,000 sprites (approx 3.2MB)
const instanceBuffer = device.createBuffer(100000 * 32, 'DYNAMIC');
```

#### Update Buffer (Zero-Allocation Streaming)

Streams the contents of a TypedArray directly into VRAM.

```typescript
// Copies the arena's posX Float32Array into VRAM at a specific offset
device.updateBuffer(instanceBuffer, scene.arena.posX, offset);
```
- `buffer` : The target hardware buffer.
- `data` : A `Float32Array`, `Uint32Array`, etc.
- `offset` : Byte offset in the hardware buffer.

### Example

```typescript
scene.onRender = (alpha) => {
    // Pack posX, posY, scale, etc into a single interleaved Float32Array (or use multiple buffers)
    // Then stream directly to GPU
    device.updateBuffer(myInstBuffer, packedData, 0);
    
    // Call draw (Specific draw API depends on WebGL/WebGPU underlying wrapper)
    device.drawInstanced(activeCount);
};
```
