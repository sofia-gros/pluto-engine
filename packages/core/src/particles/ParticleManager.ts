import type { InstanceBufferArena } from '../arena/InstanceBufferArena';
import type { Plugin } from '../scene/Plugin';
import type { Scene } from '../scene/Scene';

export interface EmitterConfig {
  x: number;
  y: number;
  count: number;
  speed: number;
  life: number;
  angleMin?: number;
  angleMax?: number;
}

export class ParticleManager implements Plugin {
  private arena!: InstanceBufferArena;
  private maxParticles: number;

  // SoA for physics
  private velX: Float32Array;
  private velY: Float32Array;
  private life: Float32Array;
  private lifeMax: Float32Array;

  // Emitters
  private activeIds: Int32Array;
  private activeCount = 0;

  constructor(maxParticles = 100000) {
    this.maxParticles = maxParticles;
    this.velX = new Float32Array(maxParticles);
    this.velY = new Float32Array(maxParticles);
    this.life = new Float32Array(maxParticles);
    this.lifeMax = new Float32Array(maxParticles);
    this.activeIds = new Int32Array(maxParticles).fill(-1);
  }

  public init(scene: Scene): void {
    this.arena = scene.arena;
  }

  public createEmitter(config: EmitterConfig): void {
    const { x, y, count, speed, life, angleMin = 0, angleMax = Math.PI * 2 } = config;
    for (let i = 0; i < count; i++) {
      if (this.activeCount >= this.maxParticles) break;
      const id = this.arena.allocate();
      if (id === -1) break;

      const angle = angleMin + Math.random() * (angleMax - angleMin);
      const v = speed * (0.5 + Math.random() * 0.5);

      // allocate() が返した id はそのまま密添字でも使えますが、
      // swap-remove の後では乖離しうるため idToIndex 経由で解決します。
      const idx = this.arena.idToIndex[id];
      this.arena.setPosX(idx, x);
      this.arena.setPosY(idx, y);
      // パーティクルは 1 ピクセル点として描画したいため、
      // フレーム寸法を 1 に落として scale = 1（倍率）で 1px 相当にします。
      // scale は倍率である点に注意してください。
      this.arena.setFrameSize(idx, 1, 1, false);
      // テクスチャ未設定のスプライトは既定で透明なので、
      // 描画されるよう不透明へ戻します。
      this.arena.setTint(idx, 0xffffffff);

      this.velX[id] = Math.cos(angle) * v;
      this.velY[id] = Math.sin(angle) * v;
      this.life[id] = life;
      this.lifeMax[id] = life;

      this.activeIds[this.activeCount++] = id;
    }
  }

  public update(dt: number): void {
    for (let i = 0; i < this.activeCount; i++) {
      const id = this.activeIds[i];
      if (id === -1) continue;
      const idx = this.arena.idToIndex[id];
      if (idx < 0) continue;

      this.life[id] -= dt;
      if (this.life[id] <= 0) {
        this.arena.free(id);

        // Swap and pop
        this.activeIds[i] = this.activeIds[this.activeCount - 1];
        this.activeIds[this.activeCount - 1] = -1;
        this.activeCount--;
        i--; // Re-check the swapped element
        continue;
      }

      this.arena.setPosX(idx, this.arena.posX[idx] + this.velX[id] * dt);
      this.arena.setPosY(idx, this.arena.posY[idx] + this.velY[id] * dt);

      // Alpha / Scale decay
      const ratio = this.life[id] / this.lifeMax[id];
      this.arena.setScale(idx, ratio);
    }
  }

  public destroy(): void {
    for (let i = 0; i < this.activeCount; i++) {
      if (this.activeIds[i] !== -1) {
        this.arena.free(this.activeIds[i]);
      }
    }
    this.activeCount = 0;
  }
}
