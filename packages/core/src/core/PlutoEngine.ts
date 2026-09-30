/**
 * @file PlutoEngine.ts
 * @description
 * Phaser の `new Phaser.Game(config)` に相当するエンジンのエントリポイント。
 * レンダリングループ、時間管理、スケール、シーン遷移、および GPU への SoA バッファストリーミングを統括します。
 *
 * 設計上の掟: render() 内の new を禁止します。
 * プロジェクション行列と tint のビューは事前に確保し、
 * 毎フレームの書き込みのみを行います。
 */

import { createGraphicsDevice } from '@pluto-engine/renderer';
import type { BufferInfo, GraphicsDevice } from '@pluto-engine/renderer';
import { ScaleManager, ScaleMode } from '../scale/ScaleManager';
import type { Scene } from '../scene/Scene';
import { SceneManager } from '../scene/SceneManager';
import { TimeStepManager } from '../time/TimeStepManager';
import { GameLoop } from './GameLoop';

export interface FpsConfig {
  /** 目標フレームレート。0 または未指定なら VSync に任せます */
  target?: number;
  /** 許容最低フレームレート。これを下回ると固定ステップの消化を 1 回に抑えます */
  min?: number;
  /** 固定シミュレーション刻み幅 (秒) */
  fixedDeltaTime?: number;
  /** 1 フレームで許容する固定ステップの最大反復回数 */
  panicLimit?: number;
}

export interface EngineConfig {
  canvas?: HTMLCanvasElement | string;
  width?: number;
  height?: number;
  scaleMode?: ScaleMode;
  pixelArt?: boolean;
  autoCenter?: boolean;
  maxInstances?: number;
  fps?: FpsConfig;
  /**
   * 描画バックエンドの選択。
   * 'auto' (既定) は WebGPU を試し、失敗したら WebGL2 へ落ちます。
   */
  backend?: 'auto' | 'webgpu' | 'webgl2';
  scene: (new () => Scene)[];
}

export class PlutoEngine {
  public readonly scene: SceneManager;
  public readonly config: EngineConfig;
  public readonly scale: ScaleManager;
  public readonly time: TimeStepManager;
  public readonly loop: GameLoop;

  public device: GraphicsDevice | null = null;
  private canvasElement: HTMLCanvasElement | null = null;

  private gpuBuffers: Record<string, BufferInfo> = {};

  /** 毎フレーム再利用するためのバッファ。render() 内で new してはいけません。 */
  private readonly _projMatrix = new Float32Array(16);

  constructor(config: EngineConfig) {
    this.config = Object.assign(
      {
        width: 800,
        height: 600,
        scaleMode: ScaleMode.FIT,
        pixelArt: false,
        autoCenter: true,
        maxInstances: 100000,
        fps: { target: 0, min: 30, fixedDeltaTime: 1 / 60, panicLimit: 5 },
      },
      config,
    );

    this.scale = new ScaleManager({
      width: this.config.width,
      height: this.config.height,
      mode: this.config.scaleMode,
      pixelArt: this.config.pixelArt,
      autoCenter: this.config.autoCenter,
    });

    this.time = new TimeStepManager();

    const fps = this.config.fps ?? {};
    this.loop = new GameLoop(
      {
        targetFps: fps.target ?? 0,
        minFps: fps.min ?? 30,
        fixedDeltaTime: fps.fixedDeltaTime ?? 1 / 60,
        panicLimit: fps.panicLimit ?? 5,
      },
      {
        onFixedUpdate: (fixedDt) => {
          this.scene.fixedUpdate(fixedDt);
        },
        onUpdate: (_time, dt) => {
          this.time.step(performance.now());
          this.time.measuredFps = this.loop.measuredFps;
          this.time.update(dt * 1000);
          this.scene.update(dt);
        },
        onRender: () => {
          this.render();
        },
      },
    );

    this.scene = new SceneManager(this);

    // デバッグ用のフック。URL に ?debug を付けたときだけ window へ公開します。
    // 自動テストからアリーナの実値 (座標・スケール) を読むために使います。
    if (typeof location !== 'undefined' && new URLSearchParams(location.search).has('debug')) {
      (window as unknown as { __pluto?: PlutoEngine }).__pluto = this;
    }

    this.ready = this.init();
  }

  public readonly ready: Promise<void>;

  private async init(): Promise<void> {
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

    this.device = await createGraphicsDevice(canvas, { backend: this.config.backend });
    this.device.initPipelines();

    const maxInstances = this.config.maxInstances!;
    const bufferNames = [
      'posX',
      'posY',
      'rotation',
      'scale',
      'facing',
      'visible',
      'uvX',
      'uvY',
      'uvW',
      'uvH',
      'frameIdx',
      'tint',
      'isText',
    ] as const;
    for (let i = 0; i < bufferNames.length; i++) {
      this.gpuBuffers[bufferNames[i]] = this.device.createBuffer(maxInstances * 4);
    }

    for (let i = 0; i < this.config.scene.length; i++) {
      const SceneClass = this.config.scene[i];
      const tempInstance = new SceneClass();
      const key = tempInstance.id || SceneClass.name;
      this.scene.add(key, SceneClass);

      if (i === 0) {
        this.scene.start(key);
      }
    }

    this.loop.start();
  }

  public updateTimeMs = 0;
  public renderTimeMs = 0;
  public uploadTimeMs = 0;
  public drawTimeMs = 0;
  /** SoA をそのまま転送するためパッキング時間は 0 です。実測値を保持します。 */
  public packTimeMs = 0;

  public render() {
    if (!this.device) return;
    const activeScene = this.scene.activeScene;
    if (!activeScene) return;

    const arena = activeScene.arena;

    // Dense Set のため、そのままの状態で GPU へ転送できます。
    const renderCount = arena.activeCount;

    // 階層を使っている場合だけ、解決済みのワールド座標を転送します。
    // 使っていない場合は posX / rotation をそのまま転送し、
    // 毎フレームのコピーを発生させません。
    const posX = arena.hasHierarchy ? arena.worldX : arena.posX;
    const posY = arena.hasHierarchy ? arena.worldY : arena.posY;
    const rotData = arena.hasHierarchy ? arena.worldRotation : arena.rotation;

    const tPackStart = performance.now();
    this.packTimeMs = performance.now() - tPackStart;

    if (renderCount > 0) {
      // Dirty Flag に基づく選択的転送。
      // subarray() は new を発生させるため、srcOffset / length で範囲を指定する。
      if (arena.dirtyPos || (arena.dirtyHierarchy && arena.hasHierarchy)) {
        this.device.updateBuffer(this.gpuBuffers['posX'], posX, 0, renderCount);
        this.device.updateBuffer(this.gpuBuffers['posY'], posY, 0, renderCount);
        arena.dirtyPos = false;
      }

      if (arena.dirtyRotation || (arena.dirtyHierarchy && arena.hasHierarchy)) {
        this.device.updateBuffer(this.gpuBuffers['rotation'], rotData, 0, renderCount);
        arena.dirtyRotation = false;
      }

      if (arena.dirtyScale) {
        this.device.updateBuffer(this.gpuBuffers['scale'], arena.scale, 0, renderCount);
        this.device.updateBuffer(this.gpuBuffers['facing'], arena.facing, 0, renderCount);
        arena.dirtyScale = false;
      }

      // depth は GPU へ渡していません。かつては属性として渡していましたが、
      // 頂点シェーダで参照されないデッド属性でした。
      // 描画順のソートを実装するまでは CPU 側（SoA）で保持するだけです。

      if (arena.dirtyUv) {
        this.device.updateBuffer(this.gpuBuffers['uvX'], arena.uvX, 0, renderCount);
        this.device.updateBuffer(this.gpuBuffers['uvY'], arena.uvY, 0, renderCount);
        this.device.updateBuffer(this.gpuBuffers['uvW'], arena.uvW, 0, renderCount);
        this.device.updateBuffer(this.gpuBuffers['uvH'], arena.uvH, 0, renderCount);
        arena.dirtyUv = false;
      }

      if (arena.dirtyFrameIdx) {
        this.device.updateBuffer(this.gpuBuffers['frameIdx'], arena.frameIdx, 0, renderCount);
        arena.dirtyFrameIdx = false;
      }

      if (arena.dirtyTint) {
        // tint は Uint32Array のまま転送する。bufferSubData はバイト列をコピーするため
        // 同じメモリを RGBA として扱える。ビュー生成が不要になる。
        this.device.updateBuffer(this.gpuBuffers['tint'], arena.tint, 0, renderCount);
        arena.dirtyTint = false;
      }

      // isText は文字列内容が変わらない限り変化しないため、
      // テキストを 1 つも使っていないシーンでは転送を丸ごと省けます。
      // dirty が立っていなければ、前回転送済みの内容のままなので送信不要です。
      if (arena.hasText && arena.dirtyIsText) {
        this.device.updateBuffer(this.gpuBuffers['isText'], arena.isText, 0, renderCount);
        arena.dirtyIsText = false;
      }

      // visible は setVisible() が呼ばれたフレームだけ転送します。
      if (arena.dirtyVisible) {
        this.device.updateBuffer(this.gpuBuffers['visible'], arena.visible, 0, renderCount);
        arena.dirtyVisible = false;
      }
    }
    const tUploadEnd = performance.now();
    this.uploadTimeMs = tUploadEnd - tPackStart;

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

    // 使い回しバッファへ書き込む (毎フレーム new しない)
    const proj = this._projMatrix;
    proj[0] = sx * cosR;
    proj[1] = sy * sinR;
    proj[2] = 0;
    proj[3] = 0;
    proj[4] = sx * -sinR;
    proj[5] = sy * cosR;
    proj[6] = 0;
    proj[7] = 0;
    proj[8] = 0;
    proj[9] = 0;
    proj[10] = 1;
    proj[11] = 0;
    proj[12] = sx * (-cx * cosR + cy * sinR);
    proj[13] = sy * (-cx * sinR - cy * cosR);
    proj[14] = 0;
    proj[15] = 1;

    this.device.setUniformMatrix4fv('projectionMatrix', proj);

    if (renderCount > 0) {
      this.device.setupInstancedAttributes(this.gpuBuffers);
      this.device.drawInstanced(renderCount);
    }
    this.drawTimeMs = performance.now() - tUploadEnd;
  }

  /**
   * エンジンインスタンスとレンダラー、アニメーションループを破棄・解放します。
   */
  public destroy(): void {
    this.loop.destroy();
    this.scale.destroy();
    if (this.scene.activeScene) {
      this.scene.activeScene.sysShutdown();
    }
    if (this.device) {
      this.device.destroy();
    }
  }
}
