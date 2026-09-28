# Performance & Benchmarks

PlutoEngine is engineered to achieve high real-time performance on the web by leveraging **Zero-Allocation**, **Structure of Arrays (SoA)**, and **GPU Hardware Instancing (WebGL2)** to simulate and render massive crowds with hundreds of thousands of entities smoothly.

---

## 📊 Benchmark Dashboard (v1.0.7 vs v1.0.9)

Real-world benchmark measurements captured in a headed Chromium environment (Playwright with hardware GPU acceleration enabled), simulating swarms from 25,000 to 300,000 entities.

<BenchmarkChart />

---

## 🚀 Key Improvements in v1.0.9

In v1.0.9, we overhauled critical bottlenecks in memory layout and CPU-to-GPU data streaming, achieving notable performance gains and stable frame rates across large entity counts.

### 1. Zero Data Packing Overhead (6.3ms ➔ 0.0ms)
- **v1.0.7 (Previous)**: Compacting sparse arrays on entity deletion incurred ~**6.3ms** per frame at 300k entities.
- **v1.0.9 (Current)**: Introducing **Swap-Remove Sparse Sets** keeps memory dense at all times, completely eliminating packing overhead (**0.0ms**).

### 2. 84% GPU Upload Bandwidth Reduction (Dirty Flags)
- **v1.0.7 (Previous)**: Unconditionally uploaded all entity buffers to the GPU every frame (~2.0ms).
- **v1.0.9 (Current)**: Fine-grained **Dirty Flags** upload only modified buffers, reducing upload latency to **0.32 ms (-84% reduction)**.

### 3. Optimized Continuum Crowds Poisson Solver
- Improved cache locality in the 128x128 Gauss-Seidel relaxation pass accelerated fluid pressure solving from **0.9ms ➔ 0.19ms (4.7x faster)**.

### 4. Vector Field Precomputation & Bilinear Interpolation
- **Precomputed Grid**: Velocity vectors are precomputed once per frame across the 128x128 grid (16,384 cells), eliminating redundant gradient and `Math.hypot` calculations per entity.
- **Bilinear Filtering**: 4-neighbor bilinear interpolation delivers fluid motion without grid stepping artifacts.

---

### Hardware & Test Environment

| Component | Specification |
| :--- | :--- |
| **OS** | Microsoft Windows 11 Pro |
| **CPU** | AMD Ryzen 7 2700 Eight-Core Processor |
| **GPU** | NVIDIA GeForce RTX 4060 |
| **RAM** | 32 GB |
| **Browser / Runtime** | Chromium (Playwright Headed / 144Hz) |
| **Sampling** | 35–40 frames sampled per entity benchmark tier |
