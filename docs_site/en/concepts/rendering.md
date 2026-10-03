# WGSL-First Rendering Pipeline

The PlutoEngine renderer completely abandons the traditional WebGL state-machine approach, adopting a **WGSL-First** architecture that heavily integrates WebGPU compute shaders and render pipelines.

## Architecture Overview

The primary role of the CPU (JavaScript/TypeScript) is simply to transfer Structure of Arrays (SoA) buffers to the GPU. All heavy lifting for rendering (culling, sorting, instancing setup) is executed on the GPU using compute shaders.

1. **Data Synchronization (CPU -> GPU)**
   Data is transferred from CPU `Float32Array` arenas directly into GPU StorageBuffers.
2. **Compute Phase (WGSL Compute)**
   - **Culling**: Entities outside the camera frustum are culled.
   - **Morton Order Sorting**: To maximize spatial locality and handle depth sorting, Z-Curve (Morton Code) sorting is performed entirely on the GPU.
3. **Render Phase (WGSL Render)**
   Using indirect draw buffers populated by the compute shaders, the GPU issues draw commands to itself without CPU intervention (GPU-Driven Rendering).

## Benefits

- **Drastic CPU Load Reduction**: The CPU does not need to iterate and issue thousands of draw calls, highly contributing to the Zero-Allocation philosophy.
- **Massive Entity Rendering**: Drawing 10,000 to 100,000 entities simultaneously remains completely stable at 60FPS (or higher).
