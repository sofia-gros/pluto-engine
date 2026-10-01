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

import { INSTANCE_BUFFERS, createGraphicsDevice } from '@pluto-engine/renderer';
import type { BufferInfo, GraphicsDevice } from '@pluto-engine/renderer';
import type { InstanceBufferArena } from '../arena/InstanceBufferArena';
import { ScaleManager, ScaleMode } from '../scale/ScaleManager';
import type { Camera } from '../scene/Camera';
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
  /**
   * 描画対象のカメラを一時的に保持する配列です。
   * CameraManager.collectForRender() が上書きします。
   * 毎フレーム new しないため、確保済みの配列を再利用します。
   */
  private readonly _activeCameras: Camera[] = [];

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
    // 転送する GPU バッファは `InstanceBufferArena` の packed ミラー 5 本だけです。
    // vec4 にまとめることで、転送単位が 13 本から 5 本へ減ります
    // （`InstanceLayout` がレイアウトの単一の情報源です）。
    //
    // バッファサイズ:
    //   packedTransform = 16 バイト / 体 (posX, posY, scaleX, scaleY)
    //   packedUv        = 16 バイト / 体 (uvX, uvY, uvW, uvH)
    //   packedFlags     = 16 バイト / 体 (frameIdx, facing, visible, isText)
    //   packedShape     = 16 バイト / 体 (rotation, frameW, frameH, depth)
    //   packedTint      =  4 バイト / 体 (unorm8x4)
    // 合計 68 バイト / 体。300k 体でも 20.4 MB です。
    for (let i = 0; i < INSTANCE_BUFFERS.length; i++) {
      const spec = INSTANCE_BUFFERS[i];
      if (!spec.eager) continue;
      // `stride` は 1 インスタンスあたりのバイト数そのものです。
      this.gpuBuffers[spec.name] = this.device.createBuffer(maxInstances * spec.stride);
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
  /**
   * SoA から vec4 への pack コストです。
   *
   * write-through のため、毎フレームの pack は **構造的に 0** です。
   * pack は `InstanceBufferArena` の write-through セッター内で
   * 「動いたスプライト 1 体につき定数回」だけ発生します。
   */
  public packTimeMs = 0;

  /**
   * カリング（可視判定と先頭への詰め替え）に要した時間 (ms)。
   *
   * 描画対象を V 体へ絞ったぶん、転送量と頂点処理が減ります。
   * `totalInstanceCount` と `renderCount` を合わせて効果を確認できます。
   */
  public cullTimeMs = 0;

  /** 登録済みインスタンス総数（カリング前） */
  public totalInstanceCount = 0;

  /** 実際に描画したインスタンス数（カリング後） */
  public renderCount = 0;

  /** カメラごとの判定矩形を書き出す使い回しバッファ */
  private readonly _camRect = new Float32Array(4);

  public render() {
    if (!this.device) return;
    const activeScene = this.scene.activeScene;
    if (!activeScene) return;

    const arena = activeScene.arena;

    // 階層を毎フレーム解決してから描画します。ワールド座標が
    // 確定していないとカリングの判定が狂うためです。
    if (arena.hasHierarchy && arena.dirtyHierarchy) {
      arena.computeWorldTransforms();
      arena.dirtyHierarchy = false;
    }

    // Dense Set のため、そのままの状態で GPU へ転送できます。
    // カリングはカメラごとの可視区間求出で行い、転送は 1 回だけです。
    const totalCount = arena.activeCount;

    const tPackStart = performance.now();
    this.packTimeMs = performance.now() - tPackStart;

    // 描画対象の総数。カメラごとのカリング結果を反映します。
    let renderCount = totalCount;

    this.totalInstanceCount = totalCount;
    const tFrameStart = performance.now();

    this.device.clear(0.01, 0.02, 0.05, 1.0);
    this.device.bindShaders();

    const w = this.canvasElement!.width;
    const h = this.canvasElement!.height;

    // カメラごとに描画します。
    // SoA への GPU 転送は 1 回だけで済みます。増えるのは
    // 投影行列の更新とドローコールだけです。
    if (totalCount > 0) {
      const camCount = activeScene.cameras.collectForRender(this._activeCameras);
      if (camCount === 0) {
        // 全カメラが非表示なら描画をスキップします。
        this.cullTimeMs = 0;
        this.renderCount = 0;
        this.drawTimeMs = performance.now() - tFrameStart;
        return;
      }

      // カリングは「先頭から連続した区間」として描画するため、
      // 可視インスタンスを先頭へ寄せる partitionVisible を使います。
      // 1 カメラなら全件を一度だけ寄せればよく、転送も 1 回で済みます。
      const tCullStart = performance.now();
      let maxVisible = totalCount;
      for (let ci = 0; ci < camCount; ci++) {
        const cam = this._activeCameras[ci];
        const rect = this._cameraRect(cam, w, h, this._camRect);
        const visible = arena.partitionVisible(rect[0], rect[1], rect[2], rect[3]);
        if (visible < maxVisible) maxVisible = visible;
        if (maxVisible === 0) break;
      }
      this.cullTimeMs = performance.now() - tCullStart;
      renderCount = maxVisible;
      this.renderCount = renderCount;

      if (renderCount > 0) {
        // 並びが変わったため、転送をここで行います
        const tUploadStart = performance.now();
        this._uploadDirtyGroups(arena, renderCount);
        this.uploadTimeMs = performance.now() - tUploadStart;

        for (let ci = 0; ci < camCount; ci++) {
          const cam = this._activeCameras[ci];
          this._writeProjection(cam, w, h);
          this.device.setUniformMatrix4fv('projectionMatrix', this._projMatrix);
          this.device.setupInstancedAttributes(this.gpuBuffers, renderCount, 0);
          this.device.drawInstanced(renderCount, 0);
        }
      }
    } else {
      this.cullTimeMs = 0;
      this.renderCount = 0;
    }
    this.drawTimeMs = performance.now() - tFrameStart;
  }

  /**
   * dirty グループフラグに従って、描画に必要な範囲だけを GPU へ転送します。
   */
  private _uploadDirtyGroups(arena: InstanceBufferArena, renderCount: number): void {
    if (!this.device) return;
    if (renderCount <= 0) return;

    if (arena.dirtyTransformGroup) {
      this.device.updateBuffer(
        this.gpuBuffers.packedTransform,
        arena.packedTransform,
        0,
        renderCount * 4,
      );
      arena.dirtyTransformGroup = false;
    }
    if (arena.dirtyUvGroup) {
      this.device.updateBuffer(this.gpuBuffers.packedUv, arena.packedUv, 0, renderCount * 4);
      arena.dirtyUvGroup = false;
    }
    if (arena.dirtyFlagsGroup) {
      this.device.updateBuffer(this.gpuBuffers.packedFlags, arena.packedFlags, 0, renderCount * 4);
      arena.dirtyFlagsGroup = false;
    }
    if (arena.dirtyShapeGroup) {
      this.device.updateBuffer(this.gpuBuffers.packedShape, arena.packedShape, 0, renderCount * 4);
      arena.dirtyShapeGroup = false;
    }
    if (arena.dirtyOriginGroup) {
      this.device.updateBuffer(
        this.gpuBuffers.packedOrigin,
        arena.packedOrigin,
        0,
        renderCount * 4,
      );
      arena.dirtyOriginGroup = false;
    }
    if (arena.dirtyTintGroup) {
      // packedTint は 1 インスタンス 1 個の uint32 です
      this.device.updateBuffer(this.gpuBuffers.packedTint, arena.packedTint, 0, renderCount);
      arena.dirtyTintGroup = false;
    }
  }

  /**
   * カメラから見えるワールド矩形を `out` に書き出します。
   *
   * 投影は Y-down で、ズーム倍のした矩形がそのままワールド座標の
   * 可視範囲になります。位置は補間後の `actualX` / `actualY` を使います
   * （`_writeProjection` と同じ値を参照しないと 1 フレームずれます）。
   */
  private _cameraRect(cam: Camera, w: number, h: number, out: Float32Array): Float32Array {
    const zoom = cam.zoom > 0 ? cam.zoom : 1;
    const halfW = w / 2 / zoom;
    const halfH = h / 2 / zoom;
    const cx = cam.actualX || 0;
    const cy = cam.actualY || 0;
    out[0] = cx - halfW;
    out[1] = cy - halfH;
    out[2] = cx + halfW;
    out[3] = cy + halfH;
    return out;
  }

  /**
   * 指定したカメラの投影行列を _projMatrix へ書き出します。
   * 使い回しバッファを使うため、毎フレーム new しません。
   */
  private _writeProjection(cam: Camera, w: number, h: number): void {
    const zoom = cam?.zoom || 1.4;
    const rot = cam?.rotation || 0.0;
    const cx = cam?.actualX || 0;
    const cy = cam?.actualY || 0;

    const cosR = Math.cos(-rot);
    const sinR = Math.sin(-rot);
    const sx = (2 / w) * zoom;
    const sy = -(2 / h) * zoom;

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
