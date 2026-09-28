import type { InstanceBufferArena } from '../arena/InstanceBufferArena';
import type { Plugin } from '../scene/Plugin';
import type { Scene } from '../scene/Scene';

export class ArcadePhysics implements Plugin {
  private arena!: InstanceBufferArena;

  public velX: Float32Array;
  public velY: Float32Array;
  public mass: Float32Array;
  public bounce: Float32Array;

  constructor(maxInstances = 100000) {
    this.velX = new Float32Array(maxInstances);
    this.velY = new Float32Array(maxInstances);
    this.mass = new Float32Array(maxInstances).fill(1.0);
    this.bounce = new Float32Array(maxInstances).fill(0.0);
  }

  public init(scene: Scene): void {
    this.arena = scene.arena;
  }

  public setVelocity(id: number, vx: number, vy: number): void {
    this.velX[id] = vx;
    this.velY[id] = vy;
  }

  public update(dt: number): void {
    const arena = this.arena;
    const count = arena.capacity;

    for (let i = 0; i < count; i++) {
      

      arena.posX[i] += this.velX[i] * dt;
      arena.posY[i] += this.velY[i] * dt;
    }
  }

  // O(N^2) naive collision, should be combined with spatial hash in the future
  public collide(): void {
    const arena = this.arena;
    const count = arena.capacity;

    for (let i = 0; i < count; i++) {
      if (arena.idToIndex[i] < 0 || arena.hitWidth[i] === 0) continue;
      for (let j = i + 1; j < count; j++) {
        if (arena.idToIndex[j] < 0 || arena.hitWidth[j] === 0) continue;

        const hwI = (arena.hitWidth[i] * arena.scale[i]) / 2;
        const hhI = (arena.hitHeight[i] * arena.scale[i]) / 2;
        const hwJ = (arena.hitWidth[j] * arena.scale[j]) / 2;
        const hhJ = (arena.hitHeight[j] * arena.scale[j]) / 2;

        const dx = arena.posX[j] - arena.posX[i];
        const dy = arena.posY[j] - arena.posY[i];

        const sumHW = hwI + hwJ;
        const sumHH = hhI + hhJ;

        if (Math.abs(dx) < sumHW && Math.abs(dy) < sumHH) {
          // Collision detected
          const overlapX = sumHW - Math.abs(dx);
          const overlapY = sumHH - Math.abs(dy);

          if (overlapX < overlapY) {
            // X-axis resolve
            const sign = Math.sign(dx) || 1;
            arena.posX[i] -= (overlapX / 2) * sign;
            arena.posX[j] += (overlapX / 2) * sign;

            const b = (this.bounce[i] + this.bounce[j]) / 2;
            const temp = this.velX[i];
            this.velX[i] = this.velX[j] * b;
            this.velX[j] = temp * b;
          } else {
            // Y-axis resolve
            const sign = Math.sign(dy) || 1;
            arena.posY[i] -= (overlapY / 2) * sign;
            arena.posY[j] += (overlapY / 2) * sign;

            const b = (this.bounce[i] + this.bounce[j]) / 2;
            const temp = this.velY[i];
            this.velY[i] = this.velY[j] * b;
            this.velY[j] = temp * b;
          }
        }
      }
    }
  }

  public destroy(): void {
    // arrays are managed by GC
  }
}
