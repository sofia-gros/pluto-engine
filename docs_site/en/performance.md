# Performance & Benchmarks

PlutoEngine is designed from the ground up to achieve unprecedented 2D performance on the web by leveraging **Zero-Allocation**, **Structure of Arrays (SoA)**, and **GPU Hardware Instancing (WebGL2 / WebGPU)** to effortlessly simulate and render hundreds of thousands of entities in real-time.

---

## 📊 Interactive Benchmark Dashboard

Real-world benchmark measurements captured in a headed Chromium environment (Playwright Headed with GPU acceleration enabled), simulating massive swarms from 25,000 to 300,000 entities.

<BenchmarkChart />

---

## Detailed Version Comparison (v1.0.7 vs v1.0.8)

In **v1.0.8**, we introduced radical Data-Oriented Design (DOD) optimizations to the engine's core memory layout based on extensive community feedback.

### 1. Zero Data Packing Overhead (0.0 ms)
- **Legacy (v1.0.7)**: Destroyed entities were marked using an `active[i] = 0` flag. As a result, the engine spent ~**6.3ms** per frame scanning sparse arrays and repacking active elements before GPU upload.
- **v1.0.8**: Uses a **Swap-Remove Sparse Set** pattern. Destroyed entities are instantly swapped with the last active entity in the array. The active segment is always completely contiguous, allowing `subarray(0, activeCount)` to be passed directly to WebGL buffers with **0.0ms packing overhead**.

### 2. 75% CPU-to-GPU Bandwidth Reduction (Dirty Flags)
- **Legacy (v1.0.7)**: All attributes (Position, Rotation, Scale, UV, Tint, etc.) were unconditionally re-uploaded to the GPU every frame.
- **v1.0.8**: Granular **Dirty Flags** (`dirtyPos`, `dirtyScale`, `dirtyUv`, etc.) track which properties changed. When only coordinates change, static scale and UV buffer uploads are skipped, slashing bandwidth consumption by **~75%**.

---

### Test Environment Hardware Specs

| Component | Specification |
| :--- | :--- |
| **OS** | Microsoft Windows 11 Pro |
| **CPU** | AMD Ryzen 7 2700 Eight-Core Processor |
| **GPU** | NVIDIA GeForce RTX 4060 |
| **RAM** | 32 GB |
| **Browser / Runtime** | Chromium (Playwright Headed / 144Hz) |
| **Sampling Window** | 45 frames per entity step (P5 / P50 / P95 percentiles) |

---

### 300,000 Entities Swarm Profiling Breakdown

| Task | v1.0.7 (Old) | v1.0.8 (New) | Improvement | Optimization Mechanism |
| :--- | :---: | :---: | :---: | :--- |
| **Poisson Solver** | 0.90 ms | **0.18 ms** | **5.0x Faster** | Flat SoA pressure field iterations on 128x128 grid |
| **Entity Update / Sim** | 20.10 ms | **15.99 ms** | **+25% Faster** | Sparse Set dense array iteration (zero branching on `active`) |
| **Data Packing** | 6.30 ms | **0.00 ms** | **100% Eliminated** | Contiguous subarray passed directly to WebGL2 |
| **WebGL Upload (CPU→GPU)** | 2.00 ms | **0.32 ms** | **-84% Bandwidth** | Dirty Flags skip static buffer transfers |
| **Draw Call (WebGL2)** | 0.09 ms | **0.08 ms** | **Negligible** | Single `drawArraysInstanced` invocation |
| **Total CPU Time (1 Frame)** | **~29.39 ms** | **~16.57 ms** | **~1.8x Faster** | **Maintains 40 FPS at 300,000 entities (vs 14 FPS in v1.0.7)** |

---

## Core Architectural Pillars

1. **TypedArray SoA (Structure of Arrays)**:
   All entity properties reside in flat, pre-allocated `Float32Array` or `Int32Array` buffers. Zero dynamic object allocations (`{}`) during game loops guarantee zero GC pauses.

2. **GPU Instancing**:
   The renderer directly binds contiguous TypedArray slices (`subarray(0, activeCount)`) as instance attributes and draws all entities in a single `drawArraysInstanced` call.

3. **Continuum Crowds (Poisson Flow Fields)**:
   Instead of expensive O(N²) pair-wise collision checks for 300,000 swarm units, density is splatted onto a uniform grid to solve the Poisson pressure equation in **O(N)** time complexity.
