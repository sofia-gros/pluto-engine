# PoissonPlugin


## Standalone Usage

```typescript
import { PoissonSolver } from '@plutoengine/poisson';
const solver = new PoissonSolver();
```

## Plugin Usage (this.registerPlugin)

```typescript
import { PoissonPlugin } from '@plutoengine/poisson';

class MyScene extends Scene {
  constructor() {
    super();
    this.registerPlugin(new PoissonPlugin());
  }

  update() {
    // Use it via this.poisson
    // this.poisson...
  }
}
```
