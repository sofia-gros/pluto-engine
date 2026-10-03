[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [pluto/src](../README.md) / TentacleOptions

# Interface: TentacleOptions

Defined in: [verlet-ik/src/Tentacle.ts:18](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/Tentacle.ts#L18)

触手の生成設定

## Properties

### damping?

> `optional` **damping?**: `number`

Defined in: [verlet-ik/src/Tentacle.ts:31](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/Tentacle.ts#L31)

速度の減衰 (0〜1)

***

### dirX?

> `optional` **dirX?**: `number`

Defined in: [verlet-ik/src/Tentacle.ts:24](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/Tentacle.ts#L24)

伸びる初期方向 (0, 1) が下向き

***

### dirY?

> `optional` **dirY?**: `number`

Defined in: [verlet-ik/src/Tentacle.ts:25](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/Tentacle.ts#L25)

***

### gravityX?

> `optional` **gravityX?**: `number`

Defined in: [verlet-ik/src/Tentacle.ts:33](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/Tentacle.ts#L33)

重力

***

### gravityY?

> `optional` **gravityY?**: `number`

Defined in: [verlet-ik/src/Tentacle.ts:34](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/Tentacle.ts#L34)

***

### iterations?

> `optional` **iterations?**: `number`

Defined in: [verlet-ik/src/Tentacle.ts:27](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/Tentacle.ts#L27)

拘束を解く反復回数。大きいほど硬くなります

***

### segmentLength?

> `optional` **segmentLength?**: `number`

Defined in: [verlet-ik/src/Tentacle.ts:22](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/Tentacle.ts#L22)

节間の距離。実際の長さは segments * segmentLength です。

***

### segments?

> `optional` **segments?**: `number`

Defined in: [verlet-ik/src/Tentacle.ts:20](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/Tentacle.ts#L20)

节の数 (根元を含む)。既定 12

***

### stiffness?

> `optional` **stiffness?**: `number`

Defined in: [verlet-ik/src/Tentacle.ts:29](https://github.com/sofia-gros/pluto-engine/blob/d3e5151654e0015799b06bdbbf560a8da4522843/packages/verlet-ik/src/Tentacle.ts#L29)

拘束の剛性係数 (0〜1)
