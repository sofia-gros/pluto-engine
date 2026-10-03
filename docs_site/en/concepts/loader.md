# Asset Loader

The PlutoEngine asset loader is designed to balance pre-loading during engine startup with zero-allocation constraints during gameplay.

## Asynchronous Streaming and Arena Packing

Resources such as textures, audio, and JSON data are batched and downloaded (or streamed) during the initialization phase.
The crucial part is how loaded data (especially imagery) is placed into memory.

### Texture Atlases and WebGPU

Multiple small sprites are automatically packed into large texture atlases.
This minimizes texture binding context switches during rendering to almost zero.

- At runtime, only integer "Texture IDs" and "UV Offsets" are stored in the SoA arenas.
- String-based asset lookups (e.g., `getSprite("player")`) are only permitted during initialization. At runtime, assets are strictly accessed via fast numerical IDs.

## Chunk-Based Dynamic Loading

For massive scenes, assets for required chunks are asynchronously loaded in background Web Workers based on spatial partitioning (like Morton order). They are transferred directly to the GPU while avoiding main-thread garbage collection spikes.
