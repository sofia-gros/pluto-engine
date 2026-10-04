# VerletPlugin

PlutoEngine v1.2.1 では、IK（インバースキネマティクス）や布のシミュレーション用に、ゼロアロケーションな Verlet 積分散アルゴリズムを提供しています。計算はすべてSoA（Structure of Arrays）配列上で行われます。

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
    // ループ内での new の使用を避け、アリーナのデータを直接更新します
    this.verlet.solve(this.arena.posX, this.arena.posY, this.arena.activeCount);
  }
}
```
