# Extended Position Based Dynamics (XPBD) Physics

Instead of traditional Rigid Body Dynamics, PlutoEngine includes a built-in, highly robust 2D physics engine based on Extended Position Based Dynamics (XPBD).

## Advantages of XPBD

Traditional force-based approaches integrate forces/accelerations into velocities, and then velocities into positions.
XPBD differs by **directly solving and modifying "positions"** based on constraints.

- **Infinite Stiffness**: It can stably simulate infinitely stiff constraints (like solid joints or inelastic ropes) that would otherwise explode (diverge) in traditional spring-damper models.
- **Iteration Independent**: Physical behavior remains consistent regardless of the number of solver iterations or sub-steps.

## Implementation via DOD and SoA

Physics simulation is typically a major CPU and memory bottleneck.
PlutoEngine's XPBD solver is designed entirely using Data-Oriented Design.

- Physical properties like `positions`, `prev_positions`, `inverse_mass`, and `velocities` are strictly maintained in SoA format.
- Constraint solving (collision resolution, joints) is executed as contiguous, flat mathematical operations over `Float32Array` blocks.
- Class instantiations (e.g., `new Vector2()` or `new ContactPoint()`) are completely banned inside the physics loop to ensure zero-allocation.

## Standalone Usage

```typescript
import { XPBDSolver } from '@pluto-engine/xpbd';
const solver = new XPBDSolver();
```

## Plugin Usage (this.registerPlugin)

```typescript
import { XpbdPlugin } from '@pluto-engine/xpbd';

class MyScene extends Scene {
  constructor() {
    super();
    this.registerPlugin(new XpbdPlugin());
  }

  update() {
    // Use it via this.xpbd
    // this.xpbd...
  }
}
```
