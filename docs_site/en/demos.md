# 🎮 PlutoEngine Demos

Experience the unmatched performance of PlutoEngine (100,000+ entities, zero-allocation) directly in your browser.

## 1. Swarm Survivors

A massive swarm survival game where 10,000+ enemies seamlessly spawn and flow towards the player using Continuum Crowds (Poisson Fluid Dynamics) and XPBD physics.
It showcases hardware instancing, MSDF text rendering, spatial hashing, and zero-allocation logic loops.

**[👉 Play Swarm Survivors](/pluto-engine/demos/swarm-survivors/index.html)**

> Note: The demo will open in the current window. It scales for mobile devices, but desktop is recommended for the best experience.

---

## Source Code
The full source code for this demo is available in the GitHub repository under `apps/demo/swarm-survivors/`. You can see how a game of this scale is written elegantly using our Phaser-like plugin architecture (`this.add.sprite`, `this.registerPlugin`).
