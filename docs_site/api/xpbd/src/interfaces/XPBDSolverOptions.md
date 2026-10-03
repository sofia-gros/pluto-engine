[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [xpbd/src](../README.md) / XPBDSolverOptions

# Interface: XPBDSolverOptions

Defined in: [xpbd/src/XPBDSolver.ts:38](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/xpbd/src/XPBDSolver.ts#L38)

## Properties

### compliance?

> `optional` **compliance?**: `number`

Defined in: [xpbd/src/XPBDSolver.ts:44](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/xpbd/src/XPBDSolver.ts#L44)

接触のコンプライアンス (m/N)。0 なら完全に剛体

***

### friction?

> `optional` **friction?**: `number`

Defined in: [xpbd/src/XPBDSolver.ts:55](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/xpbd/src/XPBDSolver.ts#L55)

接線方向の減衰 (0 でなし)

***

### iterations?

> `optional` **iterations?**: `number`

Defined in: [xpbd/src/XPBDSolver.ts:42](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/xpbd/src/XPBDSolver.ts#L42)

1 サブステップあたりの反復回数

***

### maxSpeed?

> `optional` **maxSpeed?**: `number`

Defined in: [xpbd/src/XPBDSolver.ts:46](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/xpbd/src/XPBDSolver.ts#L46)

速度上限。分裂を explosive にしないためのクランプ

***

### pairCount?

> `optional` **pairCount?**: `number`

Defined in: [xpbd/src/XPBDSolver.ts:53](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/xpbd/src/XPBDSolver.ts#L53)

pairs に含まれるペア数

***

### pairs?

> `optional` **pairs?**: `Int32Array`

Defined in: [xpbd/src/XPBDSolver.ts:51](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/xpbd/src/XPBDSolver.ts#L51)

接触ペアのリスト。渡されない場合は全探索 (O(n^2)) になります。
近傍リストを Morton 空間ハッシュで作る運用を推奨します。

***

### preSolveInvDt?

> `optional` **preSolveInvDt?**: `number`

Defined in: [xpbd/src/XPBDSolver.ts:67](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/xpbd/src/XPBDSolver.ts#L67)

速度復元に使う 1/dt。省略時は step() が設定します。

***

### preSolveNormalVel?

> `optional` **preSolveNormalVel?**: `Float32Array`

Defined in: [xpbd/src/XPBDSolver.ts:65](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/xpbd/src/XPBDSolver.ts#L65)

反発を適用するための作業バッファ (ペアごとに 1 要素)。
呼び出し側が確保して渡します。渡されない場合、反発は行われません。

位置拘束は接近速度を 0 へ潰してしまうため、反発には
「拘束を解く前」の法線方向速度が必要です。ここに記録します。

***

### restitution?

> `optional` **restitution?**: `number`

Defined in: [xpbd/src/XPBDSolver.ts:57](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/xpbd/src/XPBDSolver.ts#L57)

反発係数 (0 でなし、1 で完全反発)

***

### substeps?

> `optional` **substeps?**: `number`

Defined in: [xpbd/src/XPBDSolver.ts:40](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/xpbd/src/XPBDSolver.ts#L40)

1 ステップを何分割するか。大きいほど剛性が高い挙動になります
