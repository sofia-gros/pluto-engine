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
import { type FilterDef, WebGPUDevice, filters, filtersExternal } from '@pluto-engine/renderer';

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
/** `tsq=1` で WebGPU timestamp query を有効化します (Phase 8 P-02、診断用)。 */
const TSQ = strParam('tsq', '0') === '1';
/**
 * 画面内に見せるスプライトの割合 (0.01〜1)。
 *
 * **カリングの交差点を測るために必要です。**
 * `Camera.zoom` は大きいほど拡大、つまり**可視範囲が狭く**なります。
 * 全スプライトを収めるズームを基準に、
 * 可視面積が `visible` 倍になるよう `1 / sqrt(visible)` を掛けます
 * （可視スプライト数 = 全体 × zoom^2 のため）。
 *
 * 注意: 逆向き（`× sqrt`）にするとズームが小さくなってむしろ
 * 可視が増えてしまい、`renderCount` が変化しなくなります。
 */
const VISIBLE_FRAC = Math.min(1, Math.max(0.01, Number(strParam('visible', '1')) || 1));
/**
 * `cull=compute` で compute カリング + 間接描画を有効にします (Phase 8 P-02)。
 *
 * `cull=gpu`（頂点シェーダの縮退三角形）と違い、可視インスタンスだけを
 * 描画するため CPU コストも GPU コストも減るはずです。
 */
const CULL_MODE = strParam('cull', 'cpu');
const GPU_CULL = CULL_MODE === 'gpu';
const COMPUTE_CULL = CULL_MODE === 'compute';

/**
 * グリッドの列数。0 なら `sqrt(count)` から自動決定します。
 *
 * `?cols=32&overdraw=300` のように指定すると、32x32 のセルに
 * 300 枚ずつ重ねて配置するため、描画数と塗り面積を同時に増やせます。
 */
const GRID_COLS = Math.max(0, Number(strParam('cols', '0')) || 0);

/**
 * 1 セルあたりの重なり枚数。1 が通常配置、大きいほどオーバードローです。
 */
const OVERDRAW = Math.max(1, Number(strParam('overdraw', '1')) || 1);

/** 1 スプライトのフレーム辺長 (px)。`?size=` で変更できます。 */
const SPRITE_SIZE = Math.max(1, Number(strParam('size', '32')) || 32);

/** セル間隔 (px)。`?spacing=` で変更できます。 */
const SPRITE_SPACING = Math.max(1, Number(strParam('spacing', '64')) || 64);

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
  /**
   * `?filter=` からフィルタ列を組み立てます（例: `?filter=blur,vignette`）。
   *
   * **エンジン生成時に 1 度だけ** 呼ばれます。毎フレーム呼ぶと
   * `new` が増えて R-02 に反します。
   */
  /** 実際に積んだフィルタ名（ベンチの報告用）。`buildFilters` が埋めます。 */
  const FILTER_NAMES: string[] = [];

  function buildFilters(): FilterDef[] {
    const spec = strParam('filter', '');
    if (!spec) return [];
    const out: FilterDef[] = [];
    FILTER_NAMES.length = 0;
    for (const raw of spec.split(',')) {
      const name = raw.trim();
      switch (name) {
        case 'blur': {
          const f = filters.internal.blur();
          f.setStrength(6);
          out.push(f);
          FILTER_NAMES.push(f.name);
          break;
        }
        case 'vignette': {
          const f = filters.internal.vignette();
          f.setRadius(0.35);
          f.setStrength(1);
          out.push(f);
          FILTER_NAMES.push(f.name);
          break;
        }
        case 'pixelate': {
          const f = filters.internal.pixelate();
          f.setBlockSize(8);
          out.push(f);
          FILTER_NAMES.push(f.name);
          break;
        }
        case 'grayscale': {
          const f = filters.internal.colorMatrix();
          f.setGrayscale(1);
          out.push(f);
          FILTER_NAMES.push(f.name);
          break;
        }
        case 'invert': {
          const f = filters.internal.colorMatrix();
          f.setInvert(1);
          out.push(f);
          FILTER_NAMES.push(f.name);
          break;
        }
        case 'sepia': {
          const f = filters.internal.colorMatrix();
          f.setSepia(1);
          out.push(f);
          FILTER_NAMES.push(f.name);
          break;
        }
        case 'identity': {
          // 判定用: 何もしない 1 パス。
          // これが参照画像と一致しなければ、フィルタの中身ではなく
          // offscreen → blit の経路の問題です。
          const f = filters.internal.colorMatrix();
          f.reset();
          FILTER_NAMES.push(f.name);
          out.push(f);
          break;
        }
        case 'brightness': {
          const f = filters.internal.colorMatrix();
          f.setBrightness(0.3);
          out.push(f);
          FILTER_NAMES.push(f.name);
          break;
        }
        case 'threshold': {
          const f = filtersExternal.threshold();
          f.setLevel(0.5);
          out.push(f);
          FILTER_NAMES.push(f.name);
          break;
        }
        default:
          console.warn(`[bench] 未対応のフィルタ: ${name}`);
          break;
      }
    }
    return out;
  }

  const engine = new PlutoEngine({
    canvas,
    width: 1280,
    height: 720,
    maxInstances: ENTITIES + 1024,
    backend: BACKEND as 'auto' | 'webgpu' | 'webgl2',
    cpuOnly: CPU_ONLY,
    gpuCulling: GPU_CULL,
    gpuComputeCulling: COMPUTE_CULL,
    gpuTimestampQuery: TSQ,
    scene: [BenchScene],
    // Filter は URL で指定します（?filter=blur,vignette）。
    // フィルタのインスタンスは 1 度だけ作り、毎フレーム new しません（R-02）。
    filters: buildFilters(),
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
    /** compute カリングが数えた可視数。非同期読み出しなので -1 が混ざります。 */
    visible: number;
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
      /**
       * compute カリングが数えた可視数。非同期読み出しなので -1 が混ざります。
       * 実測できた値だけを採用するため、毎フレーム取ります。
       */
      visible: engine.device?.resolveVisibleCount?.() ?? -1,
    };
  }

  const visibleDrawnSamples: number[] = [];
  for (let i = 0; i < FRAMES; i++) {
    const m = await measureFrame();
    frameTotal.push(m.frame);
    cull.push(m.cull);
    upload.push(m.upload);
    draw.push(m.draw);
    if (m.gpu >= 0) gpuMs.push(m.gpu);
    if (m.visible >= 0) visibleDrawnSamples.push(m.visible);
  }

  const result = {
    requestedBackend: RAW_BACKEND,
    actualBackend,
    cpuOnly: CPU_ONLY,
    gpuCulling: GPU_CULL,
    computeCulling: COMPUTE_CULL,
    /** 設定値ではなく、実際に各カリング経路が走ったか。 */
    gpuCullingActive: engine.gpuCullingActive,
    computeCullingActive: engine.computeCullingActive,
    /** Filter（RenderGraph 経路）が実際に使われたか。設定値ではなく実測値です。 */
    filtersActive: engine.filtersActive,
    /** 適用されたフィルタ名（順序付き）。 */
    appliedFilters: FILTER_NAMES,
    /**
     * Filter 経路の診断。
     *
     * `passes` が 0 なら filter が 1 度も走っていません（空描画）。
     * `lastError` にはその理由が入ります。
     */
    filterStatus: (engine.device as { filterStatus?: () => unknown })?.filterStatus?.() ?? null,
    /** RenderGraph が scene 描画を呼んだ回数（1 であるべき）。 */
    sceneDrawCalls: engine.renderGraph.sceneDrawCalls(),
    /** compute カリングがどの段階で落ちたか（診断用）。 */
    computeCullingStatus:
      (engine.device as { computeCullingStatus?: () => unknown })?.computeCullingStatus?.() ?? null,
    entities: ENTITIES,
    /** 実際に 1 フレームで描画されたインスタンス数。
     *  これが 0 だとカリングが全部落としており、比較になりません。 */
    renderCount: engine.renderCount,
    /** 要求した可視率。実測の `renderCount` と突き合わせるため記録します。 */
    visibleFracRequested: VISIBLE_FRAC,
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
    /**
     * compute カリングが実際に数えた可視インスタンス数。
     *
     * 間接描画は CPU から描画数が返らないため、**これが唯一の証拠**です。
     * -1 なら非対応・非同期読み出し未完了です。
     */
    visibleDrawn: visibleDrawnSamples.length
      ? visibleDrawnSamples[visibleDrawnSamples.length - 1]
      : -1,
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
    // cols を指定すると「重なり枚数（overdraw）」で負荷を掛けられます。
    const cols = GRID_COLS > 0 ? GRID_COLS : Math.ceil(Math.sqrt(count));
    const spacing = SPRITE_SPACING;
    const tex = this.textures.get('__bench-white');

    /**
     * グリッドのセル数に対して count を割り当てる総当たり写法です。
     *
     * セルを重复して使うことで **オーバードロー**を作れます。
     * 30 万体を 1280x720 に「重なりなく」収めると 1 スプライトが 0.6px に
     * なりサブピクセル化するため、GPU の処理量がインスタンス数に比例しません。
     * セル重复なら「描画数」と「塗り面積」を同時に増やせます。
     */
    for (let i = 0; i < count; i++) {
      const cell = OVERDRAW > 1 ? i % (cols * cols || 1) : i;
      const x = (cell % cols) * spacing;
      const y = ((cell / cols) | 0) * spacing;
      const id = arena.allocate();
      if (id === -1) break;
      const idx = arena.idToIndex[id];
      arena.setPosX(idx, x);
      arena.setPosY(idx, y);
      arena.setFrameSize(idx, SPRITE_SIZE, SPRITE_SIZE, false);
      if (tex) {
        arena.assetRef[idx] = tex;
        arena.setFrameIdx(idx, tex.layerIndex ?? 0);
      }
      arena.setTint(idx, 0xff8888ff);
    }

    const rows = Math.ceil((OVERDRAW > 1 ? cols * cols : count) / cols);
    this.worldWidth = cols * spacing;
    this.worldHeight = rows * spacing;

    // 全スプライトが画面に収まる最大ズーム（90% を加えて余裕を持たせます）
    // Camera.zoom は大きいほど拡大 = 可視範囲が狭くなります。
    // 可視面積を VISIBLE_FRAC 倍にするには 1/sqrt(frac) を掛けます。
    const cam = this.cameras.main;
    const viewW = 1280;
    const viewH = 720;
    const zoomAll = Math.min(viewW / this.worldWidth, viewH / this.worldHeight) * 0.9;
    const zoom = (zoomAll * 0.9) / Math.sqrt(VISIBLE_FRAC);
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
