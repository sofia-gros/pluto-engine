# 🎮 PlutoEngine Playable Demos

Experience the unmatched performance of PlutoEngine (100,000+ entities, zero-allocation, Phaser-like developer experience) directly in your browser.

---

## 1. ⚔️ Pluto Quest: Chronicles of the Arena (2D Classic Action RPG)

A traditional top-down 2D Action RPG built **without any fluid dynamics (zero Continuum Crowds)**, using pure standard **Phaser-style scenes, sprites, state-machine AI, and ArcadePhysics AABB collision culling**.

- **Seamless Fantasy World**: Town plaza, shops, NPC houses, river crossings, wilderness forests, and ancient monster dungeons.
- **Quest & NPC Dialogue System**: Quest-giving Elder, Weapon/Armor Merchant Boris, Guard Captain Roland, and Priestess Lyra.
- **Real-Time Action Combat**: Sword slashes, fireball magic spells, whirlwind dash attacks, loot magnets, and treasure chests.
- **Built-in Benchmark Panel**: Press `[B]` to switch live from standard RPG mode (100 entities) to 1,000, 5,000, and 20,000 monsters, proving stable 60-144 FPS with zero GC spikes.

👉 **[Play Pluto Quest (2D RPG)](/pluto-engine/demos/rpg/index.html)**

---

## 2. 🪐 Swarm Survivors

A massive swarm survival game where 10,000–40,000+ enemies seamlessly spawn and flow towards the player using Continuum Crowds (Poisson Fluid Dynamics) and XPBD physics.

👉 **[Play Swarm Survivors](/pluto-engine/demos/swarm-survivors/index.html)**

---

## 3. ⚡ Benchmarks & Performance Profiler

Interactive profiling dashboard dissecting Steering algorithm variations and Arcade Physics AABB culling speedups.

👉 **[Open Benchmark Dashboard](/pluto-engine/demos/benchmark/index.html)**

---

## Source Code
All demo source codes are available in the GitHub repository under `apps/demo/`:
- `apps/demo/rpg/`: 2D Classic RPG Demo
- `apps/demo/swarm-survivors/`: Swarm Survivor Game
- `apps/demo/benchmark/`: Real-time Profiler Tool
