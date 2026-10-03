/**
 * @file Shape.ts
 * @description
 * Phaser 互換の静的シェイプ。
 *
 * 設計上の判断:
 * Pluto のアarena はクアッド主体のバッファです。円や星のように頂点を持つ形状を
 * クアッド 1 枚で描くには **形状を canvas にベイクしてテクスチャ化する**必要が
 * あります。生成時だけ CPU 侧的処理であって、R-01（CPU 側は SoA）と
 * R-05（WebGPU > WebGL > CPU）のどちらにも反しません。
 *
 * **キャッシュが肝**です。同じ (種別, 寸法, 補助パラメータ) の組み合わせは
 * ベイク 1 枚に集約し、全インスタンスがそのテクスチャを参照します。
 * 1000 個の 32x16 矩形でも GPU レイヤーは 1 枚で済みます。
 *
 * CPU 側の状態は SoA のみです:
 * - `kind`   : {@link ShapeKind} (`Uint8Array`)
 * - `param0` : 幅 / 半径 (px)
 * - `param1` : 高さ (px)
 * - `param2` : 補助パラメータ (角丸半径 / 星の角数 など)
 * - `param3` : 補助パラメータ (星の内半径比 など)
 * - `ids`    : アリーナの疎添字 ID (`Int32Array`)
 *
 * テクスチャ参照は生成時に確定するため、毎フレームは `ids` の走査だけで済みます。
 */

import type { TextureAsset } from '@pluto-engine/renderer';
import type { InstanceBufferArena } from './InstanceBufferArena';

export const ShapeKind = {
  /** 矩形 */
  Rectangle: 0,
  /** 円 */
  Circle: 1,
  /** 楕円 */
  Ellipse: 2,
  /** 三角形 */
  Triangle: 3,
  /** 星形 */
  Star: 4,
  /** 角丸矩形 */
  RoundRect: 5,
  /** 線 (param0 = 長さ) */
  Line: 6,
  /** 格子 (param0 = セル幅, param1 = セル高, param2 = セル数) */
  Grid: 7,
  /** 等角三角形 */
  IsoTriangle: 8,
  /** 等角四角形（ダイヤ） */
  IsoDiamond: 9,
  /** 四辺形 (param2 = 各隅の inset 個数) */
  Quad: 10,
  /** 円弧 (param0 = 半径, param1 = 線幅) */
  Arc: 11,
} as const;

export type ShapeKindValue = (typeof ShapeKind)[keyof typeof ShapeKind];

/** 1 形状あたりのパラメータ数。SoA は `n * SHAPE_PARAMS` で確保します。 */
export const SHAPE_PARAMS = 4;

/** シェイプ用テクスチャのキ接頭辞。他のアセットと分離します。 */
const KEY_PREFIX = '__shape:';

/** キャッシュの上限。到達時は白 1 ピクセル相当へフォールバックします。 */
const MAX_CACHE = 512;

/** ベイク結果を受け取る_TEXTURE 登録口。TextureManager の `addCanvas` 相当。 */
export type ShapeTextureRegistrar = (key: string, canvas: HTMLCanvasElement) => TextureAsset;

export class ShapeManager {
  private readonly arena: InstanceBufferArena;
  private readonly registerTexture: ShapeTextureRegistrar;
  private readonly capacity: number;

  /** 形状 ID -> 形状種別 */
  public readonly kind: Uint8Array;
  /** 形状 ID -> 幅 / 半径 (px) */
  public readonly param0: Float32Array;
  /** 形状 ID -> 高さ (px) */
  public readonly param1: Float32Array;
  /** 形状 ID -> 補助パラメータ */
  public readonly param2: Float32Array;
  /** 形状 ID -> 補助パラメータ */
  public readonly param3: Float32Array;
  /** 形状 ID -> アリーナの疎添字 ID */
  public readonly ids: Int32Array;

  private _count = 0;

  /** (種別, 寸法, 補助) -> ベイク済みテクスチャ */
  private readonly _baked = new Map<string, TextureAsset>();

  constructor(arena: InstanceBufferArena, registerTexture: ShapeTextureRegistrar, capacity = 4096) {
    this.arena = arena;
    this.registerTexture = registerTexture;
    this.capacity = capacity;
    this.kind = new Uint8Array(capacity);
    this.param0 = new Float32Array(capacity);
    this.param1 = new Float32Array(capacity);
    this.param2 = new Float32Array(capacity);
    this.param3 = new Float32Array(capacity);
    this.ids = new Int32Array(capacity).fill(-1);
  }

  /** 生成済みシェイプ数 */
  public get count(): number {
    return this._count;
  }

  /** 形状の種別を返します。範囲外なら -1。 */
  public getKind(shapeId: number): number {
    return shapeId >= 0 && shapeId < this._count ? this.kind[shapeId] : -1;
  }

  /**
   * 形状のパラメータを `out` へ書き出します。
   *
   * @param out `SHAPE_PARAMS` 要素以上のバッファ
   * @returns 書き出した要素数
   */
  public getParams(shapeId: number, out: Float32Array): number {
    if (shapeId < 0 || shapeId >= this._count) return 0;
    out[0] = this.param0[shapeId];
    out[1] = this.param1[shapeId];
    out[2] = this.param2[shapeId];
    out[3] = this.param3[shapeId];
    return SHAPE_PARAMS;
  }

  /**
   * シェイプを生成します (Phaser 互換の `add.rectangle` などに対応)。
   *
   * @param kind {@link ShapeKind}
   * @param width 幅 / 半径 (px)
   * @param height 高さ (px)
   * @param aux2 形状ごとの補助パラメータ
   * @param aux3 形状ごとの補助パラメータ
   * @param color 塗り色 (0xRRGGBB)
   * @param alpha 濃度 (0〜1)
   * @returns 生成されたシェイプ ID。空席がない場合は -1
   */
  public add(
    kind: number,
    width: number,
    height: number,
    aux2 = 0,
    aux3 = 0,
    color = 0xffffff,
    alpha = 1,
  ): number {
    if (this._count >= this.capacity) {
      console.warn('ShapeManager: シェイプ数が上限に達しました。');
      return -1;
    }

    const w = Math.max(1, Math.round(width));
    const h = Math.max(1, Math.round(height));

    // 同じ寸法は 1 枚だけベイクします。
    const key = `${kind}:${w}:${h}:${aux2}:${aux3}`;
    const asset = this._bake(key, kind, w, h, aux2, aux3);

    const arenaId = this.arena.allocate();
    if (arenaId === -1) return -1;
    const dense = this.arena.idToIndex[arenaId];

    const id = this._count++;
    this.kind[id] = kind;
    this.param0[id] = width;
    this.param1[id] = height;
    this.param2[id] = aux2;
    this.param3[id] = aux3;
    this.ids[id] = arenaId;

    // 形状のスプライトはフレーム寸法 = 形状寸法で描画します。
    // scale は倍率なので 1 のままにします。
    this.arena.setFrameSize(dense, w, h, false);
    this.arena.setScale(dense, 1, 1);
    if (asset) {
      this.arena.assetRef[dense] = asset;
      this.arena.setFrameIdx(dense, asset.layerIndex ?? 0);
    }
    // ベイクした画像は白なので、色は tint で乗算します。
    this.arena.setTint(
      dense,
      (Math.round(Math.max(0, Math.min(1, alpha)) * 255) << 24) | (color & 0xffffff),
    );
    return id;
  }

  /** シェイプを解放します (Phaser 互換の `destroy`)。 */
  public remove(shapeId: number): boolean {
    if (shapeId < 0 || shapeId >= this._count) return false;
    const arenaId = this.ids[shapeId];
    if (arenaId >= 0) {
      this.arena.free(arenaId);
      this.ids[shapeId] = -1;
    }
    return true;
  }

  public destroy(): void {
    for (let i = 0; i < this._count; i++) this.remove(i);
    this._count = 0;
    this._baked.clear();
  }

  /**
   * 形状を canvas にベイクしてテクスチャ化します。
   *
   * キャッシュにヒットした場合は再生成しません。
   */
  private _bake(
    key: string,
    kind: number,
    w: number,
    h: number,
    aux2: number,
    aux3: number,
  ): TextureAsset | null {
    const cached = this._baked.get(key);
    if (cached !== undefined) return cached;
    if (this._baked.size >= MAX_CACHE) return null;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    this._draw(ctx, kind, w, h, aux2, aux3);

    const asset = this.registerTexture(`${KEY_PREFIX}${key}`, canvas);
    this._baked.set(key, asset);
    return asset;
  }

  /**
   * canvas 2d へ形状を描き込みます。
   *
   * 各形状は「0,0 から w,h の矩形にちょうど収まる」よう正規化しています。
   * アリーナがクアッドなので、これを超えると描画が切れます。
   */
  private _draw(
    ctx: CanvasRenderingContext2D,
    kind: number,
    w: number,
    h: number,
    aux2: number,
    aux3: number,
  ): void {
    switch (kind) {
      case ShapeKind.Rectangle:
        ctx.fillRect(0, 0, w, h);
        break;
      case ShapeKind.Circle:
        // param0 を直径として扱います
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case ShapeKind.Ellipse:
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      case ShapeKind.Triangle:
        this._fillPolygon(ctx, [w / 2, 0, w, h, 0, h]);
        break;
      case ShapeKind.IsoTriangle:
        this._fillPolygon(ctx, [0, 0, w, h / 2, 0, h]);
        break;
      case ShapeKind.IsoDiamond:
        this._fillPolygon(ctx, [w / 2, 0, w, h / 2, w / 2, h, 0, h / 2]);
        break;
      case ShapeKind.Quad:
        this._fillPolygon(ctx, [aux2, 0, w - aux2, 0, w, h - aux2, aux2, h]);
        break;
      case ShapeKind.Star: {
        const points = Math.max(3, Math.floor(aux2) || 5);
        const innerRatio = aux3 > 0 ? aux3 : 0.5;
        this._fillPolygon(ctx, this._starPath(w, h, points, innerRatio));
        break;
      }
      case ShapeKind.RoundRect: {
        const r = Math.min(aux2 > 0 ? aux2 : 8, Math.min(w, h) / 2);
        ctx.beginPath();
        ctx.roundRect(0, 0, w, h, r);
        ctx.fill();
        break;
      }
      case ShapeKind.Line: {
        const width = Math.max(1, Math.round(aux2 > 0 ? aux2 : 1));
        ctx.lineWidth = width;
        ctx.beginPath();
        // 水平線を縦幅の中央に引きます
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
        break;
      }
      case ShapeKind.Grid: {
        const cells = Math.max(1, Math.floor(aux2) || 2);
        const lw = Math.max(1, Math.round(aux3 > 0 ? aux3 : 1));
        ctx.lineWidth = lw;
        ctx.beginPath();
        for (let i = 1; i < cells; i++) {
          const x = (w / cells) * i;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          const y = (h / cells) * i;
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        }
        ctx.stroke();
        break;
      }
      case ShapeKind.Arc: {
        const lw = Math.max(1, Math.round(aux2 > 0 ? aux2 : 2));
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, Math.max(0, Math.min(w, h) / 2 - lw / 2), 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      default:
        // 未知の種別は矩形にフォールバックします
        ctx.fillRect(0, 0, w, h);
        break;
    }
  }

  /**
   * 多角形を塗りつぶします。座標は `[x0, y0, x1, y1, ...]` のフラットな配列です。
   */
  private _fillPolygon(ctx: CanvasRenderingContext2D, coords: number[]): void {
    const n = coords.length / 2;
    if (n < 3) return;
    ctx.beginPath();
    ctx.moveTo(coords[0], coords[1]);
    for (let i = 1; i < n; i++) ctx.lineTo(coords[i * 2], coords[i * 2 + 1]);
    ctx.closePath();
    ctx.fill();
  }

  /** 星形の頂点列を生成します。 */
  private _starPath(w: number, h: number, points: number, innerRatio: number): number[] {
    const cx = w / 2;
    const cy = h / 2;
    const rx = w / 2;
    const ry = h / 2;
    const out: number[] = [];
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? 1 : innerRatio;
      const th = (Math.PI * i) / points - Math.PI / 2;
      out.push(cx + Math.cos(th) * rx * r, cy + Math.sin(th) * ry * r);
    }
    return out;
  }
}
