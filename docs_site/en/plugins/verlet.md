# VerletPlugin


## Standalone Usage

```typescript
import { VerletSolver } from '@pluto-engine/verlet-ik';
const solver = new VerletSolver();
```

## Plugin Usage (this.registerPlugin)

```typescript
import { VerletPlugin } from '@pluto-engine/verlet-ik';

class MyScene extends Scene {
  constructor() {
    super();
    this.registerPlugin(new VerletPlugin());
  }

  update() {
    // Use it via this.verlet
    // this.verlet...
  }
}
```
