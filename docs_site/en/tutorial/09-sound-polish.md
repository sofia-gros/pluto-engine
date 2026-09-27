# Chapter 9: Camera Shake, Flash & Polish

The final differentiator between an ordinary prototype and an irresistible game is audiovisual impact: **screen shake, hit flashes, and crisp sound effects**!

In Chapter 9, without downloading a single external audio file (no MP3/WAV dependencies), we implement **zero-latency procedural sound synthesis using the browser's built-in Web Audio API** along with a **trauma-decay camera shake system**!

---

## 1. Nonlinear Camera Shake via Trauma Decay

Simply adding random noise to camera coordinates creates jarring, unconvincing shake. Modern game engines use a **squared trauma decay model**:

```typescript
export class SwarmSurvivorScene extends Scene {
  // ... Previous properties ...

  // Camera trauma state
  private cameraTrauma = 0; // Ranges from 0.0 to 1.0
  private readonly maxShakeOffset = 18; // Maximum shake amplitude in px
  private readonly traumaDecay = 1.8;   // Trauma decay per second

  /**
   * Adds an impulse to camera trauma
   * @param amount Impulse magnitude (0.1 to 0.5)
   */
  public addTrauma(amount: number): void {
    this.cameraTrauma = Math.min(1.0, this.cameraTrauma + amount);
  }

  /**
   * Updates camera offsets with decaying trauma
   */
  private updateCameraShake(dt: number): void {
    if (this.cameraTrauma > 0) {
      // Linear decay
      this.cameraTrauma = Math.max(0, this.cameraTrauma - this.traumaDecay * dt);

      // Nonlinear intensity: trauma squared
      const shake = this.cameraTrauma * this.cameraTrauma * this.maxShakeOffset;

      // Jitter camera offset
      this.camera.x = (Math.random() * 2 - 1) * shake;
      this.camera.y = (Math.random() * 2 - 1) * shake;
    } else {
      this.camera.x = 0;
      this.camera.y = 0;
    }
  }
```

Trigger `this.addTrauma(0.15)` whenever critical strikes connect or when the hero suffers damage!

---

## 2. White Hit Flash

Briefly setting a damaged enemy's sprite tint to pure bright white (`0xffffffff`) delivers immediate, tactile combat feedback:

```typescript
  public damageEnemy(enemyIndex: number, amount: number): void {
    const id = this.enemyIds[enemyIndex];

    // Flash pure white
    this.arena.tint[id] = 0xffffffff;

    // Use zero-alloc Tween to return to crimson (0xef4444) over 80ms
    this.tweens.add(
      id,
      TweenProperty.TINT,
      0xffffffff,
      0xef4444,
      80
    );

    // Micro screen impulse
    this.addTrauma(0.04);

    // ... damage logic ...
  }
```

---

## 3. Zero-Asset Sound Synthesizer via Web Audio API

Audio files create loading bottlenecks. Instead, we generate punchy 8-bit / 16-bit arcade sound effects mathematically in real-time:

```typescript
/**
 * Zero-latency procedural sound synthesizer
 */
class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Impact hit sound: triangle wave frequency dive
   */
  public playHit(): void {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  /**
   * Gem collection chime: bright ascending sine
   */
  public playGem(): void {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  }

  /**
   * Level-up fanfare chord
   */
  public playLevelUp(): void {
    const ctx = this.getContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + i * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }
}
```

Store `private sfx = new SoundEffects();` inside the scene:
- On enemy hit: `this.sfx.playHit();`
- On gem pickup: `this.sfx.playGem();`
- On level up: `this.sfx.playLevelUp();`

---

## 4. Real-Time Performance Monitor

Add a live performance readout in the top right to showcase the engine's power:

```typescript
  private fpsCounterText!: Text;

  private initPerformanceMonitor(): void {
    this.fpsCounterText = this.add.text(960 - 220, 20, 'FPS: 60 | ENTITIES: 0', {
      fontSize: 14,
      color: 0x4ade80, // Crisp green
    });
  }

  private updatePerformanceMonitor(): void {
    const activeEntities = this.arena.activeCount;
    const currentFps = Math.round(1 / (this.time.delta || 0.016));

    this.fpsCounterText.text = `FPS: ${currentFps} | ACTIVE: ${activeEntities}`;
  }
```

---

## 5. Verification

Refresh your game!

Attacks now land with visceral weight: blades trigger thunderous screen rumbles, damaged enemies flash pure white, and synthetic percussion rhythms accompany your combat.
Sweeping through gem clusters unleashes cascading musical chimes, and the top-right counter proves your browser is effortlessly rendering **thousands of active entities at 60/144 FPS**!

Now comes the grand finale!
In [Chapter 10: Boss Battle, Utility AI & Victory Loop](./10-boss), we summon the terrifying **Swarm Titan Boss** with multi-phase AI, completing the full game loop!
