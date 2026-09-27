/**
 * @file PlutoEngine.ts
 * @description
 * Phaser の `new Phaser.Game(config)` に相当するエンジンのエントリーポイント。
 */

import { createGraphicsDevice } from '@pluto-engine/renderer';
import type { BufferInfo, GraphicsDevice } from '@pluto-engine/renderer';
import { ScaleManager, ScaleMode } from '../scale/ScaleManager';
import type { Scene } from '../scene/Scene';
import { SceneManager } from '../scene/SceneManager';
import { TimeManager } from '../time/TimeManager';

export interface EngineConfig {
  canvas?: HTMLCanvasElement | string;
  width?: number;
  height?: number;
  scaleMode?: ScaleMode;
  pixelArt?: boolean;
  autoCenter?: boolean;
  maxInstances?: number;
  scene: (new () => Scene)[];
}

export class PlutoEngine {
  public readonly scene: SceneManager;
  public readonly config: EngineConfig;
  public readonly scale: ScaleManager;
  public readonly time: TimeManager;

  public device: GraphicsDevice | null = null;
  private canvasElement: HTMLCanvasElement | null = null;

  private gpuBuffers: Record<string, BufferInfo> = {};
  private packedPosX: Float32Array;
  private packedPosY: Float32Array;
  private packedScale: Float32Array;

  constructor(config: EngineConfig) {
    this.config = Object.assign(
      {
        width: 800,
        height: 600,
        scaleMode: ScaleMode.FIT,
        pixelArt: false,
        autoCenter: true,
        maxInstances: 100000,
      },
      config,
    );

    this.packedPosX = new Float32Array(this.config.maxInstances!);
    this.packedPosY = new Float32Array(this.config.maxInstances!);
    this.packedScale = new Float32Array(this.config.maxInstances!);

    this.scale = new ScaleManager({
      width: this.config.width,
      height: this.config.height,
      mode: this.config.scaleMode,
      pixelArt: this.config.pixelArt,
      autoCenter: this.config.autoCenter,
    });

    this.time = new TimeManager();
    this.scene = new SceneManager(this);

    // Phaserのように非同期で初期化を走らせる
    this.init();
  }

  private async init() {
    let canvas: HTMLCanvasElement;
    if (typeof this.config.canvas === 'string') {
      canvas = document.getElementById(this.config.canvas) as HTMLCanvasElement;
    } else if (this.config.canvas) {
      canvas = this.config.canvas;
    } else {
      canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
    }
    this.canvasElement = canvas;
    this.scale.setCanvas(canvas);

    this.device = await createGraphicsDevice(canvas);
    this.device.initPipelines();

    const maxInstances = this.config.maxInstances!;
    this.gpuBuffers['posX'] = this.device.createBuffer(maxInstances * 4);
    this.gpuBuffers['posY'] = this.device.createBuffer(maxInstances * 4);
    this.gpuBuffers['scale'] = this.device.createBuffer(maxInstances * 4);

    for (let i = 0; i < this.config.scene.length; i++) {
      const SceneClass = this.config.scene[i];
      const tempInstance = new SceneClass();
      const key = tempInstance.key || SceneClass.name;
      this.scene.add(key, SceneClass);

      if (i === 0) {
        this.scene.start(key);
      }
    }

    // メインループ開始
    const loop = (now: number) => {
      this.step(now);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  private accumulator = 0;
  private readonly fixedDt = 1 / 60;

  private step(now: number) {
    const dt = this.time.step(now);

    this.accumulator += dt;
    while (this.accumulator >= this.fixedDt) {
      if (this.scene.activeScene) {
        this.scene.activeScene.sysFixedUpdate(this.fixedDt);
      }
      this.accumulator -= this.fixedDt;
    }

    if (this.scene.activeScene) {
      this.scene.activeScene.sysUpdate(dt);
    }

    this.render();
  }

  private render() {
    if (!this.device) return;
    const activeScene = this.scene.activeScene;
    if (!activeScene) return;

    const arena = activeScene.arena;
    let idx = 0;

    // アリーナの生存エンティティをパック
    for (let i = 0; i < arena.capacity; i++) {
      if (arena.active[i]) {
        this.packedPosX[idx] = arena.posX[i];
        this.packedPosY[idx] = arena.posY[i];
        this.packedScale[idx] = arena.scale[i];
        idx++;
      }
    }

    const renderCount = idx;

    if (renderCount > 0) {
      this.device.updateBuffer(this.gpuBuffers['posX'], this.packedPosX.subarray(0, renderCount));
      this.device.updateBuffer(this.gpuBuffers['posY'], this.packedPosY.subarray(0, renderCount));
      this.device.updateBuffer(this.gpuBuffers['scale'], this.packedScale.subarray(0, renderCount));
    }

    this.device.clear(0.01, 0.02, 0.05, 1.0);
    this.device.bindShaders();

    const w = this.canvasElement!.width;
    const h = this.canvasElement!.height;
    const zoom = activeScene.camera?.zoom || 1.4;
    const cx = activeScene.camera?.x || 0;
    const cy = activeScene.camera?.y || 0;

    const proj = new Float32Array([
      (2 / w) * zoom,
      0,
      0,
      0,
      0,
      -(2 / h) * zoom,
      0,
      0,
      0,
      0,
      1,
      0,
      -(cx * (2 / w) * zoom),
      cy * (2 / h) * zoom,
      0,
      1,
    ]);

    this.device.setUniformMatrix4fv('projectionMatrix', proj);

    if (renderCount > 0) {
      this.device.setupInstancedAttributes(this.gpuBuffers);
      this.device.drawInstanced(renderCount);
    }
  }
}
