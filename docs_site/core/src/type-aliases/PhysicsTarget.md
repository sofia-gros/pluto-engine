[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / PhysicsTarget

# Type Alias: PhysicsTarget

> **PhysicsTarget** = [`PhysicsBody`](../interfaces/PhysicsBody.md) \| [`PhysicsBody`](../interfaces/PhysicsBody.md)[] \| [`InstanceBufferArena`](../classes/InstanceBufferArena.md) \| [`PhysicsBuffer`](../interfaces/PhysicsBuffer.md)

Defined in: [core/src/physics/ArcadePhysics.ts:41](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/physics/ArcadePhysics.ts#L41)

判定対象として指定可能なすべての物理ターゲット型
- 単一オブジェクト (Sprite, Player)
- オブジェクト配列 (Sprite[], PhysicsBody[])
- InstanceBufferArena (SoA アリーナ)
- PhysicsBuffer (カスタム TypedArray バッファ)
