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
  private packedUvX: Float32Array;
  private packedUvY: Float32Array;
  private packedUvW: Float32Array;
  private packedUvH: Float32Array;
  private packedFrameIdx: Float32Array;

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
    this.packedUvX = new Float32Array(this.config.maxInstances!);
    this.packedUvY = new Float32Array(this.config.maxInstances!);
    this.packedUvW = new Float32Array(this.config.maxInstances!);
    this.packedUvH = new Float32Array(this.config.maxInstances!);
    this.packedFrameIdx = new Float32Array(this.config.maxInstances!);

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
    this.gpuBuffers['uvX'] = this.device.createBuffer(maxInstances * 4);
    this.gpuBuffers['uvY'] = this.device.createBuffer(maxInstances * 4);
    this.gpuBuffers['uvW'] = this.device.createBuffer(maxInstances * 4);
    this.gpuBuffers['uvH'] = this.device.createBuffer(maxInstances * 4);
    this.gpuBuffers['frameIdx'] = this.device.createBuffer(maxInstances * 4);

    for (let i = 0; i < this.config.scene.length; i++) {
      const SceneClass = this.config.scene[i];
      const tempInstance = new SceneClass();
      const key = tempInstance.id || SceneClass.name;
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

  public updateTimeMs = 0;
  public renderTimeMs = 0;
  public uploadTimeMs = 0;
  public drawTimeMs = 0;

  private step(now: number) {
    const dt = this.time.step(now);

    const t0 = performance.now();
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
    const t1 = performance.now();
    this.updateTimeMs = t1 - t0;

    const tRenderStart = performance.now();
    this.render();
    this.renderTimeMs = performance.now() - tRenderStart;
  }

  private render() {
    if (!this.device) return;
    const activeScene = this.scene.activeScene;
    if (!activeScene) return;

    const arena = activeScene.arena;
    let idx = 0;

    const tUploadStart = performance.now();

    // アリーナの生存エンティティをパック
    for (let i = 0; i < arena.capacity; i++) {
      if (arena.active[i]) {
        this.packedPosX[idx] = arena.posX[i];
        this.packedPosY[idx] = arena.posY[i];
        this.packedScale[idx] = arena.scale[i];
        this.packedUvX[idx] = arena.uvX[i];
        this.packedUvY[idx] = arena.uvY[i];
        this.packedUvW[idx] = arena.uvW[i];
        this.packedUvH[idx] = arena.uvH[i];
        this.packedFrameIdx[idx] = arena.frameIdx[i];
        idx++;
      }
    }

    const renderCount = idx;

    if (renderCount > 0) {
      this.device.updateBuffer(this.gpuBuffers['posX'], this.packedPosX.subarray(0, renderCount));
      this.device.updateBuffer(this.gpuBuffers['posY'], this.packedPosY.subarray(0, renderCount));
      this.device.updateBuffer(this.gpuBuffers['scale'], this.packedScale.subarray(0, renderCount));
      this.device.updateBuffer(this.gpuBuffers['uvX'], this.packedUvX.subarray(0, renderCount));
      this.device.updateBuffer(this.gpuBuffers['uvY'], this.packedUvY.subarray(0, renderCount));
      this.device.updateBuffer(this.gpuBuffers['uvW'], this.packedUvW.subarray(0, renderCount));
      this.device.updateBuffer(this.gpuBuffers['uvH'], this.packedUvH.subarray(0, renderCount));
      this.device.updateBuffer(
        this.gpuBuffers['frameIdx'],
        this.packedFrameIdx.subarray(0, renderCount),
      );
    }
    const tUploadEnd = performance.now();
    this.uploadTimeMs = tUploadEnd - tUploadStart;

    this.device.clear(0.01, 0.02, 0.05, 1.0);
    this.device.bindShaders();

    const w = this.canvasElement!.width;
    const h = this.canvasElement!.height;
    const zoom = activeScene.camera?.zoom || 1.4;
    const rot = activeScene.camera?.rotation || 0.0;
    const cx = activeScene.camera?.actualX || 0;
    const cy = activeScene.camera?.actualY || 0;

    const cosR = Math.cos(-rot);
    const sinR = Math.sin(-rot);
    const sx = (2 / w) * zoom;
    const sy = -(2 / h) * zoom;

    const proj = new Float32Array([
      sx * cosR,
      sy * sinR,
      0,
      0,
      sx * -sinR,
      sy * cosR,
      0,
      0,
      0,
      0,
      1,
      0,
      sx * (-cx * cosR + cy * sinR),
      sy * (-cx * sinR - cy * cosR),
      0,
      1,
    ]);

    this.device.setUniformMatrix4fv('projectionMatrix', proj);

    if (renderCount > 0) {
      this.device.setupInstancedAttributes(this.gpuBuffers);
      this.device.drawInstanced(renderCount);
    }
    this.drawTimeMs = performance.now() - tUploadEnd;
  }
}
