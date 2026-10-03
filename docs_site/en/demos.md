# PlutoEngine Playable Demos

These demos run directly in your browser and show PlutoEngine handling large entity counts (100,000+) with zero-allocation rendering.

---

## 1. Pluto Quest: Chronicles of the Arena (2D Classic Action RPG)

A traditional top-down 2D Action RPG built **without any fluid dynamics (zero Continuum Crowds)**, using pure standard **scene management, sprites, state-machine AI, and ArcadePhysics AABB collision culling**.

- **Seamless Fantasy World**: Town plaza, shops, NPC houses, river crossings, wilderness forests, and ancient monster dungeons.
- **Quest & NPC Dialogue System**: Quest-giving Elder, Weapon/Armor Merchant Boris, Guard Captain Roland, and Priestess Lyra.
- **Real-Time Action Combat**: Sword slashes, fireball magic spells, whirlwind dash attacks, loot magnets, and treasure chests.
- **Built-in Benchmark Panel**: Press `[B]` to switch live from standard RPG mode (100 entities) to 1,000, 5,000, and 20,000 monsters, demonstrating stable 60–144 FPS with zero GC spikes.

**<a href="/pluto-engine/demos/rpg/index.html" target="_blank" rel="noopener noreferrer">Play Pluto Quest (2D RPG)</a>**

---

## 2. Swarm Survivors

A swarm survival game where 10,000–40,000+ enemies spawn and flow towards the player using Continuum Crowds (Poisson Fluid Dynamics) and XPBD physics.

**<a href="/pluto-engine/demos/swarm-survivors/index.html" target="_blank" rel="noopener noreferrer">Play Swarm Survivors</a>**

---

## 3. Benchmarks & Performance Profiler

Interactive profiling dashboard covering steering algorithm variations and Arcade Physics AABB culling performance.

**<a href="/pluto-engine/demos/benchmark/index.html" target="_blank" rel="noopener noreferrer">Open Benchmark Dashboard</a>**

---

## Source Code
All demo source code is available in the GitHub repository under `apps/demo/`:
- `apps/demo/rpg/`: 2D Classic RPG Demo
- `apps/demo/swarm-survivors/`: Swarm Survivor Game
- `apps/demo/benchmark/`: Real-time Profiler Tool
