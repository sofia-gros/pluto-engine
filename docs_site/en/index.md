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
  - title: Ultra Fast Instancing (100,000+ Sprites)
    details: Render tens of thousands of sprites in a single draw call with zero GC overhead at 144 FPS.
  - title: Data-Oriented Design (SoA)
    details: Built from the ground up on contiguous TypedArrays (SoA) to maximize CPU L1/L2 cache coherency.
  - title: WebGPU / WebGL2 Hybrid
    details: WGSL-first shader architecture with seamless WebGL2 fallbacks and hardware-instanced pipelines.
  - title: Integrated XPBD Physics & Spatial Hash
    details: Position-Based Dynamics crowd physics and Morton Z-curve spatial hashing solve horde collisions in O(1) time.
---
