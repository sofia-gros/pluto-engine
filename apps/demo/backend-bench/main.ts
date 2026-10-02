/**
 * @file main.ts
 * @description
 * Phase 8 P-01 / P-05 のバックエンド別ベンチハーネス。
 *
 * 既存の `apps/demo/benchmark` は CPU 側の steering 計測用で、
 * レンダラバックエンドを比較する仕組みではありませんでした。
 * 本ページは要件2（WebGPU > WebGL > CPU）の 3 系統を**同じシーン・同じ
 * フレーム数**で計測します。
 *
 * ## クエリパラメータ
 *
 * | パラメータ | 既定 | 意味 |
 * | --- | --- | --- |
 * | `backend` | `auto` | `webgpu` / `webgl2` / `cpu` / `auto` |
 * | `entities` | 50000 | 生成するスプライト数 |
 * | `frames` | 120 | 計測するフレーム数 |
 * | `warmup` | 30 | ウォームアップフレーム数 |
 *
 * `backend=cpu` は `PlutoEngine` の `cpuOnly` モードを使い、
 * clear / 転送 / draw をすべて省いて CPU 側の時間だけを測ります。
 *
 * ## 結果の取り出し
 *
 * 計測が終わると `window.__benchResult` に構造化された数値が入ります。
 * `scripts/gpu-benchmark.mjs` がこれを読み取ります。
 */

import { PlutoEngine, Scene } from '@pluto-engine/core';
import { WebGPUDevice } from '@pluto-engine/renderer';

/** クエリパラメータを整数として読みます。不正値は `def` に戻します。 */
function intParam(name: string, def: number): number {
  const raw = new URLSearchParams(location.search).get(name);
  if (raw === null) return def;
  const v = Number.parseInt(raw, 10);
  return Number.isFinite(v) && v > 0 ? v : def;
}

function strParam(name: string, def: string): string {
  return new URLSearchParams(location.search).get(name) ?? def;
}

/** 中央値を返します。外れ値（GC や OS スケジューリング）に強い統計量です。 */
function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) * 0.5;
}

function p95(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95));
  return sorted[idx];
}

const ENTITIES = intParam('entities', 50000);
const FRAMES = intParam('frames', 120);
const WARMUP = intParam('warmup', 30);
const RAW_BACKEND = strParam('backend', 'auto');

/** `cpu` は PlutoEngine の cpuOnly モードに割り当てます。 */
const CPU_ONLY = RAW_BACKEND === 'cpu';
const BACKEND = CPU_ONLY ? 'auto' : RAW_BACKEND;
/** `cull=gpu` で頂点シェーダ カリングを有効にします (Phase 8 P-03)。 */
const GPU_CULL = strParam('cull', 'cpu') === 'gpu';
/** `tsq=1` で WebGPU timestamp query を有効化します (Phase 8 P-02、診断用)。 */
const TSQ = strParam('tsq', '0') === '1';

const status = document.getElementById('status') as HTMLDivElement;

/** 1x1 の白テクスチャで全スプライトを描画します。 */
function makeWhiteTexture(scene: Scene): void {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1, 1);
  }
  scene.textures.addCanvas('__bench-white', canvas);
}

/**
 * 実際に使われたバックエンド名を取得します。
 *
 * GraphicsDevice には公開の識別子フィールドが無いため、
 * WebGPU 固有のメソッドの有無で判定します。
 */
function detectBackend(device: unknown): string {
  if (device === null || device === undefined) return 'none';
  if (device instanceof WebGPUDevice) return 'webgpu';
  return 'webgl2';
}

async function main(): Promise<void> {
  status.textContent = `booting (backend=${RAW_BACKEND}, entities=${ENTITIES})`;

  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const engine = new PlutoEngine({
    canvas,
    width: 1280,
    height: 720,
    maxInstances: ENTITIES + 1024,
    backend: BACKEND as 'auto' | 'webgpu' | 'webgl2',
    cpuOnly: CPU_ONLY,
    gpuCulling: GPU_CULL,
    gpuTimestampQuery: TSQ,
    scene: [BenchScene],
  });

  await engine.ready;
  const actualBackend = CPU_ONLY ? 'cpu' : detectBackend(engine.device);

  const scene = engine.scene.activeScene as BenchScene | null;
  if (!scene) {
    status.textContent = 'no active scene';
    return;
  }
  makeWhiteTexture(scene);
  scene.spawn(ENTITIES);

  // エンジン自身のループを止めて、時刻を合成して決定的に回します。
  // requestAnimationFrame の揺らぎで比較が壊れるためです。
  engine.loop.stop();

  const stepFrames = (count: number, startTime: number): number => {
    const dtMs = 1000 / 60;
    let t = startTime;
    for (let i = 0; i < count; i++) {
      t += dtMs;
      engine.loop.step(t);
    }
    return t;
  };

  status.textContent = `warming up (${WARMUP} frames)...`;
  let clock = stepFrames(WARMUP, 0);

  status.textContent = `measuring (${FRAMES} frames)...`;
  const cull: number[] = [];
  const upload: number[] = [];
  const draw: number[] = [];
  const frameTotal: number[] = [];
  const gpuMs: number[] = [];

  // CPU 系列は、同じ可視インスタンスを CPU でラスタライズします。
  // これがないと「draw を省いたフレーム」となり、比較になりません。
  const raster = CPU_ONLY ? new CpuRasterizer() : null;
  const ctx2d = CPU_ONLY ? canvas.getContext('2d') : null;
  const scene0 = engine.scene.activeScene;

  /**
   * 1 フレーム分の計測。
   *
   * **フレームごとにイベントループへ yield することが必須です。**
   * WebGPU の `mapAsync` は Promise なので、コールバックが走るのは
   * イベントループが回るときだけです。同期ループで Frames 回すると
   * コールバックが一度も実行されず、timestamp が永久に取れません
   * （実際にこれで 0 サンプルでした）。
   */
  async function measureFrame(): Promise<{
    frame: number;
    cull: number;
    upload: number;
    draw: number;
    gpu: number;
  }> {
    const t0 = performance.now();
    clock += 1000 / 60;
    engine.loop.step(clock);
    const tStep = performance.now();
    if (raster && ctx2d && scene0) {
      raster.draw(scene0.arena, engine.renderCount);
      raster.present(ctx2d);
    }
    const tEnd = performance.now();
    // マクロタスクを 1 つ譲って Promise のコールバックを走らせます。
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
    return {
      frame: tEnd - t0,
      cull: engine.cullTimeMs,
      upload: engine.uploadTimeMs,
      draw: CPU_ONLY ? tEnd - tStep : engine.drawTimeMs,
      gpu: engine.device?.resolveGpuTimeMs?.() ?? -1,
    };
  }

  for (let i = 0; i < FRAMES; i++) {
    const m = await measureFrame();
    frameTotal.push(m.frame);
    cull.push(m.cull);
    upload.push(m.upload);
    draw.push(m.draw);
    if (m.gpu >= 0) gpuMs.push(m.gpu);
  }

  const result = {
    requestedBackend: RAW_BACKEND,
    actualBackend,
    cpuOnly: CPU_ONLY,
    gpuCulling: GPU_CULL,
    /** 設定値ではなく、実際に GPU カリング経路が走ったか。 */
    gpuCullingActive: engine.gpuCullingActive,
    entities: ENTITIES,
    /** 実際に 1 フレームで描画されたインスタンス数。
     *  これが 0 だとカリングが全部落としており、比較になりません。 */
    renderCount: engine.renderCount,
    worldWidth: scene.worldWidth,
    worldHeight: scene.worldHeight,
    frames: FRAMES,
    warmup: WARMUP,
    cullMsMedian: median(cull),
    cullMsP95: p95(cull),
    uploadMsMedian: median(upload),
    drawMsMedian: median(draw),
    frameMsMedian: median(frameTotal),
    frameMsP95: p95(frameTotal),
    /**
     * GPU 実行時間 (timestamp query)。
     * 非対応環境や非同期読み出しが間に合わなかった場合は -1 です。
     * **CPU 時間との比較にはこちらを使う必要があります**
     * （ドローコール発行は非同期なので CPU 時間だけでは GPU の増加が見えない）。
     */
    gpuMsMedian: gpuMs.length > 0 ? median(gpuMs) : -1,
    gpuSampleCount: gpuMs.length,
    /**
     * timestamp query が使えるか（デバッグ・報告用）。
     * `gpuMsMedian === -1` の原因が「feature 不足」なのか
     * 「非同期読み出しが未完了」なのかを切り分けるための項目です。
     */
    timestampSupported:
      (
        engine.device as { isTimestampQuerySupported?: () => boolean }
      )?.isTimestampQuerySupported?.() ?? false,
    /** 読み出しが失敗したときの理由。切り分け用。 */
    timestampError:
      (engine.device as { lastTimestampError?: () => string })?.lastTimestampError?.() ?? '',
    /** 生読できた timestamp の生値 (診断用)。読めていなければ -1。 */
    timestampRaw: (() => {
      const buf = new Float64Array(2);
      const ok =
        (engine.device as { lastTimestampRaw?: (o: Float64Array) => boolean })?.lastTimestampRaw?.(
          buf,
        ) ?? false;
      return ok ? [buf[0], buf[1]] : [-1, -1];
    })(),
  };

  (window as unknown as { __benchResult: typeof result }).__benchResult = result;
  status.innerHTML =
    `backend=<b>${actualBackend}</b><br>` +
    `entities=${ENTITIES}<br>` +
    `frame median=${result.frameMsMedian.toFixed(3)}ms ` +
    `p95=${result.frameMsP95.toFixed(3)}ms<br>` +
    `cull=${result.cullMsMedian.toFixed(3)}ms ` +
    `upload=${result.uploadMsMedian.toFixed(3)}ms ` +
    `draw=${result.drawMsMedian.toFixed(3)}ms`;
}

class BenchScene extends Scene {
  /**
   * アリーナ容量を明示します。
   *
   * `SceneManager` は `new sceneClass()` でシーンを作るため、
   * エンジン設定の `maxInstances` はシーンに伝わりません
   * （伝えないと GPU バッファだけ大きくなり、`allocate()` が黙って -1 を返します）。
   * ベンチは指定した `?entities=` 分を確実に確保する必要があります。
   */
  constructor() {
    super({ maxInstances: Math.max(1, ENTITIES + 1024) });
  }

  /** 生成したグリッドのワールド幅 */
  worldWidth = 1;
  /** 生成したグリッドのワールド高さ */
  worldHeight = 1;

  /** 描画負荷だけを測るため、カメラはそのまま何も動かしません。 */
  override create(): void {
    this.cameras.main.setScroll(0, 0);
  }

  /**
   * グリッド状にスプライトを生成し、**全スプライトが画面内に収まる**ように
   * カメラをズームします。
   *
   * ここ zoom を合わせないとカリングがほぼ全部落としてしまい、
   * 描画コストが 0 になってバックエンド比較が成立しません。
   */
  spawn(count: number): void {
    const arena = this.arena;
    const cols = Math.ceil(Math.sqrt(count));
    const spacing = 64;
    const tex = this.textures.get('__bench-white');

    for (let i = 0; i < count; i++) {
      const x = (i % cols) * spacing;
      const y = ((i / cols) | 0) * spacing;
      const id = arena.allocate();
      if (id === -1) break;
      const idx = arena.idToIndex[id];
      arena.setPosX(idx, x);
      arena.setPosY(idx, y);
      arena.setFrameSize(idx, 32, 32, false);
      if (tex) {
        arena.assetRef[idx] = tex;
        arena.setFrameIdx(idx, tex.layerIndex ?? 0);
      }
      arena.setTint(idx, 0xff8888ff);
    }

    this.worldWidth = cols * spacing;
    this.worldHeight = Math.ceil(count / cols) * spacing;

    // 全スプライトが画面に収まる最大ズーム（90% を加えて余裕を持たせます）
    // カメラをこの倍率にすると描画対象が全件になるため、
    // 「CPU カリングが捨てるものがない」構成になります。
    const cam = this.cameras.main;
    const viewW = 1280;
    const viewH = 720;
    const zoom = Math.min(viewW / this.worldWidth, viewH / this.worldHeight) * 0.9;
    cam.setZoom(zoom);
    // 中心をグリッドの真中に合わせます
    cam.setScroll(this.worldWidth / 2, this.worldHeight / 2);
  }
}

/** 内部計算用の使い回しバッファ。 */
const CPU_FRAME_W = 1280;
const CPU_FRAME_H = 720;

/**
 * CPU 参照ラスタライザ。
 *
 * 要件2（WebGPU > WebGL > CPU）の CPU 系は、**同じ可視インスタンスを
 * CPU で塗る**必要があります。`PlutoEngine` の `cpuOnly` は draw を省くだけなので、
 * そのままでは「GPU を使わないフレーム」が 되어必ず最速になり、
 * 3 系統の比較が成立しません。
 *
 * ここではフレームバッファ（`Uint32Array`）に 1 ピクセル単位で
 * 塗りつぶします。乗算ブレンドとテクスチャサンプリングは行わず、
 * 「同じピクセル数を描く」という下限コストで比較します。
 */
class CpuRasterizer {
  readonly pixels: Uint32Array;
  private readonly image: ImageData | null;

  constructor() {
    this.pixels = new Uint32Array(CPU_FRAME_W * CPU_FRAME_H);
    if (typeof ImageData !== 'undefined') {
      this.image = new ImageData(CPU_FRAME_W, CPU_FRAME_H);
    } else {
      this.image = null;
    }
  }

  /**
   * 可視インスタンスを矩形塗りします。
   *
   * @param arena アリーナ（SoA を直接読みます）
   * @param count 描画対象数
   */
  draw(arena: CpuArenaLike, count: number): void {
    this.pixels.fill(0xff101010);
    for (let i = 0; i < count; i++) {
      const x = arena.posX[i];
      const y = arena.posY[i];
      const w = Math.max(1, Math.round(arena.frameWidth[i] * arena.scaleX[i]));
      const h = Math.max(1, Math.round(arena.frameHeight[i] * arena.scaleY[i]));
      const x0 = Math.max(0, Math.round(x - w * 0.5));
      const y0 = Math.max(0, Math.round(y - h * 0.5));
      const x1 = Math.min(CPU_FRAME_W, x0 + w);
      const y1 = Math.min(CPU_FRAME_H, y0 + h);
      for (let py = y0; py < y1; py++) {
        const row = py * CPU_FRAME_W;
        for (let px = x0; px < x1; px++) {
          this.pixels[row + px] = 0xff8888ff;
        }
      }
    }
  }

  /** フレームバッファを canvas へ描画します（present 相当）。 */
  present(ctx: CanvasRenderingContext2D | null): void {
    if (!ctx || !this.image) return;
    // Uint32Array のビューを ImageData へ載せます
    new Uint8ClampedArray(this.image.data.buffer).set(new Uint8Array(this.pixels.buffer));
    ctx.putImageData(this.image, 0, 0);
  }
}

/** CPU ラスタライザが アリーナ から読む SoA の一部。 */
interface CpuArenaLike {
  posX: Float32Array;
  posY: Float32Array;
  frameWidth: Float32Array;
  frameHeight: Float32Array;
  scaleX: Float32Array;
  scaleY: Float32Array;
}

main().catch((err: unknown) => {
  status.textContent = `error: ${String(err)}`;
  (window as unknown as { __benchError: string }).__benchError = String(err);
});
