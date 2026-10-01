/**
 * @file TilemapLayer.ts
 * @description
 * Phaser 4 互換のタイルレイヤーハンドル。
 *
 * 設計上の掟 (R-03): own property は `index` と `_map` の 2 個だけ。
 * タイル参照は Tilemap の SoA 配列が正本であり、本クラスは値を持ちません。
 */

import type { Tilemap } from './Tilemap';

/** 当たり判定矩形を取り出すための使い回しバッファ */
const RECT = new Float32Array(4);

export class TilemapLayer {
  /** Tilemap 内のレイヤーインデックス */
  public readonly index: number;

  private readonly _map: Tilemap;

  constructor(index: number, map: Tilemap) {
    this.index = index;
    this._map = map;
  }

  /** レイヤーが有効か */
  get isValid(): boolean {
    return this._map.isLayerValid(this.index);
  }

  /** レイヤーのオフセット X */
  get scrollX(): number {
    return this._map.getLayerScrollX(this.index);
  }

  /** レイヤーのオフセット Y */
  get scrollY(): number {
    return this._map.getLayerScrollY(this.index);
  }

  /** レイヤーの表示状態 (0 = 描画しない) */
  get visible(): boolean {
    return this.isValid;
  }

  set visible(_v: boolean) {
    // レイヤーの可視性は Tilemap 側の culling が管理します。
    // Flyweight 側では状態を持たないため、 setter は何もしません。
  }

  /**
   * レイヤーのオフセットを設定します (Phaser 互換の `setPosition`)。
   */
  setPosition(x: number, y: number): this {
    this._map.setLayerPosition(this.index, x, y);
    return this;
  }

  /**
   * 指定 gid のタイルを衝突tiles に指定します (Phaser 互換の `setCollisionByIndex`)。
   * @returns 設定したタイル数
   */
  setCollisionByIndex(tileIndex: number, collides: boolean): number {
    return this._map.setCollisionByIndex(tileIndex, collides);
  }

  /**
   * 指定 gid のタイル群をまとめて衝突tiles に指定します (Phaser 互換の `setCollision`)。
   * (Phaser 互換の `setCollision`)。
   * @returns 設定したタイル数
   */
  setCollision(tiles: number[], collides = true): number {
    let n = 0;
    for (let i = 0; i < tiles.length; i++) {
      n += this._map.setCollisionByIndex(tiles[i], collides);
    }
    return n;
  }

  /**
   * 指定タイル座標の gid を返します (Phaser 互換の `index`)。
   *
   * フィールド `index` と同名になるため `tileIndex` として命名しています。
   */
  tileIndex(tileX: number, tileY: number): number {
    return this._map.getTileIndexAt(this.index, tileX, tileY);
  }

  /** 指定タイル座標が衝突タイルか */
  collides(tileX: number, tileY: number): boolean {
    return this._map.hasCollisionAt(this.index, tileX, tileY);
  }

  /**
   * レイヤー全体の矩形を `out` バッファに書き出します (Phaser 互換の `getBounds`)。
   *
   * @param out 4 要素以上 (x, y, width, height)
   */
  getBounds(out: Float32Array = RECT): Float32Array {
    out[0] = this.scrollX;
    out[1] = this.scrollY;
    out[2] = this._map.mapWidth * this._map.tileSize;
    out[3] = this._map.mapHeight * this._map.tileSize;
    return out;
  }

  /** このレイヤーに存在するタイル数 (デバッグ・統計用) */
  get tileCount(): number {
    const per = this._map.cellsPerLayer;
    const flat = this._map.getFlatTiles();
    let n = 0;
    for (let i = 0; i < per; i++) {
      if (flat[this.index * per + i] > 0) n++;
    }
    return n;
  }

  /**
   * レイヤーを破棄します (Phaser 互換の `destroy`)。
   *
   * Tilemap 全体の破棄は Tilemap.destroy() で行います。
   * ここではこのレイヤーへの参照を破棄します。
   */
  destroy(): this {
    this._map.setLayerPosition(this.index, 0, 0);
    return this;
  }
}
