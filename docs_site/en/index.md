---
layout: home

hero:
  name: PlutoEngine
  text: The Next-Gen 2D Web Game Engine
  tagline: Zero Allocation. Structure of Arrays. Pure Performance.
  actions:
    - theme: brand
      text: Get Started (Guide)
      link: /en/guide/intro
    - theme: brand
      text: Start Tutorial
      link: /en/tutorial/01-setup
    - theme: alt
      text: View on GitHub
      link: https://github.com/sofia-gros/pluto-engine

features:
  - title: Ultra Fast Instancing (300,000+ Sprites)
    details: Render hundreds of thousands of sprites in a single draw call with zero GC overhead at silky smooth framerates.
  - title: Phaser-like Arcade Physics (AABB Culling)
    details: Universal this.physics.add.overlap supporting single bodies, arrays, arenas, and typed buffers. Broadphase AABB culling checks 300,000 entities in 0.08ms.
  - title: Data-Oriented Design & Loop Fission
    details: Flat Structure of Arrays (SoA) memory combined with loop fission to maximize CPU cache line efficiency and enable V8 automatic SIMD vectorization.
  - title: Poisson Continuum Crowds
    details: Precomputed velocity fields with bilinear Lerp of Lerp interpolation for fluid, natural steering of massive hordes with minimal CPU overhead.
  - title: WebGPU / WebGL2 Hybrid
    details: WGSL-first shader architecture with seamless WebGL2 fallbacks and hardware-instanced pipelines.
  - title: Integrated XPBD Physics & Spatial Hash
    details: Position-Based Dynamics crowd physics and Morton Z-curve spatial hashing solve horde collisions in O(1) time.
---
