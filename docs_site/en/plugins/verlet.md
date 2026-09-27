# VerletPlugin


## Standalone Usage

```typescript
import { VerletSolver } from '@plutoengine/verlet-ik';
const solver = new VerletSolver();
```

## Plugin Usage (this.registerPlugin)

```typescript
import { VerletPlugin } from '@plutoengine/verlet-ik';

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
