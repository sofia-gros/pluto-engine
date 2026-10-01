import type { InstanceBufferArena } from '../arena/InstanceBufferArena';
import type { Camera } from '../scene/Camera';
import { TilemapLayer } from './TilemapLayer';

export interface TiledJSON {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: {
    type: string;
    data: number[];
    visible: boolean;
    opacity: number;
    x: number;
    y: number;
  }[];
  tilesets: {
    firstgid: number;
    image: string;
    name: string;
    tilewidth: number;
    tileheight: number;
    /** 1 タイルに収まるフレーム数 (縦方向)。未指定は 1 とみなします */
    columns?: number;
    count?: number;
  }[];
  /** Tiled の collision layers (オブジェクト图层) */
  objectlayers?: {
    name: string;
    visible: boolean;
    objects?: { gid?: number; x: number; y: number; width: number; height: number }[];
  }[];
}

export class Tilemap {
  private arena: InstanceBufferArena;
  public mapWidth: number;
  public mapHeight: number;
  public tileSize: number;

  private layersData: number[][] = [];

  /**
   * 現在アリーナにアロケートされているタイル (layerIndex -> mapIndex -> arenaId)
   */
  private activeTiles: Map<number, Int32Array> = new Map();

  /**
   * flat なタイル参照 (layerIndex * mapWidth * mapHeight + mapIndex -> tileIndex)。
   * 判定クエリを走査するための SoA です。
   */
  private flatTiles: Int32Array = new Int32Array(0);

  /** タイルセットの firstgid 昇順。gid -> 参照解決に使います。 */
  private tilesets: TiledJSON['tilesets'] = [];
  /** 最初のタイルセットの UV グリッド寸法 */
  private tileCols = 1;
  private tileRows = 1;

  /**
   * 衝突 information の SoA (layerIndex * w * h + mapIndex -> 1 = 衝突あり)。
   * `setCollisionByIndex` で設定します。
   */
  private collision: Uint8Array = new Uint8Array(0);

  /** レイヤーのオフセット (Phaser 互換の `setPosition` / scrollFactor) */
  private layerScrollX: Float32Array = new Float32Array(0);
  private layerScrollY: Float32Array = new Float32Array(0);

  /** 生成済み TilemapLayer のキャッシュ */
  private readonly _layerHandles = new Map<number, TilemapLayer>();

  // 最後にカリングした範囲を記録して差分だけ更新
  private lastStartX = -1;
  private lastStartY = -1;
  private lastEndX = -1;
  private lastEndY = -1;

  constructor(arena: InstanceBufferArena, mapData: TiledJSON | number[][], tileSize?: number) {
    this.arena = arena;

    if (Array.isArray(mapData)) {
      // 簡易配列フォーマット
      this.mapHeight = mapData.length;
      this.mapWidth = mapData[0]?.length || 0;
      this.tileSize = tileSize || 32;
      const flat = new Array(this.mapWidth * this.mapHeight).fill(0);
      for (let y = 0; y < this.mapHeight; y++) {
        for (let x = 0; x < this.mapWidth; x++) {
          flat[y * this.mapWidth + x] = mapData[y][x];
        }
      }
      this.layersData.push(flat);
    } else {
      // Tiled JSON フォーマット
      this.mapWidth = mapData.width;
      this.mapHeight = mapData.height;
      this.tileSize = mapData.tilewidth;
      this.tilesets = mapData.tilesets ?? [];
      this._initTilesetGrid();

      for (const layer of mapData.layers) {
        if (layer.type === 'tilelayer' && layer.visible !== false) {
          this.layersData.push(layer.data);
        }
      }
    }

    const cellCount = this.mapWidth * this.mapHeight;
    this.flatTiles = new Int32Array(cellCount * this.layersData.length);
    for (let l = 0; l < this.layersData.length; l++) {
      this.activeTiles.set(l, new Int32Array(cellCount).fill(-1));
      const data = this.layersData[l];
      const base = l * cellCount;
      for (let i = 0; i < cellCount; i++) this.flatTiles[base + i] = data[i] ?? 0;
    }
    this.collision = new Uint8Array(cellCount * this.layersData.length);
    this.layerScrollX = new Float32Array(this.layersData.length);
    this.layerScrollY = new Float32Array(this.layersData.length);

    // 衝突information の SoA を確保してから、Tiled の object layer を読み込みます。
    // 確保前に読むと書き込みが無視されていまいます。
    if (!Array.isArray(mapData)) {
      for (const objLayer of mapData.objectlayers ?? []) {
        if (objLayer.visible === false) continue;
        for (const obj of objLayer.objects ?? []) {
          if (obj.gid === undefined || obj.width <= 0 || obj.height <= 0) continue;
          // ピクセル座標をタイル座標へ変換します
          const tx = Math.floor(obj.x / this.tileSize);
          const ty = Math.floor(obj.y / this.tileSize);
          const tw = Math.max(1, Math.floor(obj.width / this.tileSize));
          const th = Math.max(1, Math.floor(obj.height / this.tileSize));
          this._markCollision(tx, ty, tw, th, 1);
        }
      }
    }
  }

  /**
   * タイルセットの UV グリッド寸法を確定します。
   *
   * Tiled は `columns` を持たないため、画像の実寸から算出できない場合は
   * 1 行構成 (columns = 1) とみなします。呼び出し側は
   * {@link Tilemap.setTileGrid} で明示的に指定できます。
   */
  private _initTilesetGrid(): void {
    const first = this.tilesets[0];
    if (first === undefined) {
      this.tileCols = 1;
      this.tileRows = 1;
      return;
    }
    this.tileCols = first.columns ?? 1;
    const count = first.count ?? 1;
    this.tileRows = Math.max(1, Math.ceil(count / this.tileCols));
  }

  /**
   * UV グリッドの列数・行数を明示的に設定します。
   * Tiled JSON に `columns` が無い場合に使います。
   */
  public setTileGrid(cols: number, rows: number): void {
    if (cols > 0) this.tileCols = cols;
    if (rows > 0) this.tileRows = rows;
  }

  /** レイヤー数 */
  public get layerCount(): number {
    return this.layersData.length;
  }

  /**
   * TilemapLayer ハンドル (Phaser 互換の `tilemap.getLayerIndex` 系) を取得します。
   * キャッシュするため、同じインデックスなら毎回同じインスタンスを返します。
   */
  public getLayer(index: number): TilemapLayer {
    let l = this._layerHandles.get(index);
    if (l === undefined) {
      l = new TilemapLayer(index, this);
      this._layerHandles.set(index, l);
    }
    return l;
  }

  // ============================================================
  // Flyweight (TilemapLayer) 向けの公開アクセサ
  // ============================================================

  /** レイヤーが存在するか */
  public isLayerValid(index: number): boolean {
    return index >= 0 && index < this.layersData.length;
  }

  /** レイヤーのタイル参照配列 (layerIndex * cellCount + mapIndex -> tileIndex) */
  public getFlatTiles(): Int32Array {
    return this.flatTiles;
  }

  /** 1 レイヤあたりのセル数 */
  public get cellsPerLayer(): number {
    return this.mapWidth * this.mapHeight;
  }

  /** バーのオフセット X */
  public getLayerScrollX(index: number): number {
    return this.isLayerValid(index) ? this.layerScrollX[index] : 0;
  }

  /** レイヤーのオフセット Y */
  public getLayerScrollY(index: number): number {
    return this.isLayerValid(index) ? this.layerScrollY[index] : 0;
  }

  /** レイヤーのオフセットを設定します (Phaser 互換の `setPosition`) */
  public setLayerPosition(index: number, x: number, y: number): void {
    if (!this.isLayerValid(index)) return;
    this.layerScrollX[index] = x;
    this.layerScrollY[index] = y;
  }

  /**
   * 指定 gid のタイルに衝突フラグを立てます (Phaser 互換の `setCollisionByIndex`)。
   * @returns 設定したタイル数
   */
  public setCollisionByIndex(index: number, collides: boolean): number {
    const count = this.flatTiles.length;
    let n = 0;
    for (let i = 0; i < count; i++) {
      if (this.flatTiles[i] === index) {
        this.collision[i] = collides ? 1 : 0;
        n++;
      }
    }
    return n;
  }

  /**
   * 指定矩形に衝突フラグを立てます (Tiled の object layer 相当)。
   * @param tx タイル X
   * @param ty タイル Y
   * @param tw タイル幅
   * @param th タイル高
   */
  private _markCollision(tx: number, ty: number, tw: number, th: number, value: 0 | 1): void {
    const perLayer = this.cellsPerLayer;
    for (let l = 0; l < this.layersData.length; l++) {
      const base = l * perLayer;
      for (let y = ty; y < ty + th; y++) {
        if (y < 0 || y >= this.mapHeight) continue;
        for (let x = tx; x < tx + tw; x++) {
          if (x < 0 || x >= this.mapWidth) continue;
          this.collision[base + y * this.mapWidth + x] = value;
        }
      }
    }
  }

  /**
   * 指定タイル座標に衝突があるか (SoA を O(1) で参照)。
   */
  public hasCollisionAt(layerIndex: number, tileX: number, tileY: number): boolean {
    if (!this.isLayerValid(layerIndex)) return false;
    if (tileX < 0 || tileX >= this.mapWidth) return false;
    if (tileY < 0 || tileY >= this.mapHeight) return false;
    const i = layerIndex * this.cellsPerLayer + tileY * this.mapWidth + tileX;
    return this.collision[i] === 1;
  }

  /**
   * 指定タイルの gid を返します。範囲外なら 0。
   */
  public getTileIndexAt(layerIndex: number, tileX: number, tileY: number): number {
    if (!this.isLayerValid(layerIndex)) return 0;
    if (tileX < 0 || tileX >= this.mapWidth) return 0;
    if (tileY < 0 || tileY >= this.mapHeight) return 0;
    const i = layerIndex * this.cellsPerLayer + tileY * this.mapWidth + tileX;
    return this.flatTiles[i];
  }

  /**
   * gid を UV グリッドのフレーム番号へ変換します。
   *
   * Tiled の gid は `firstgid + フレーム番号` です。
   * @returns フレーム番号。解決できない場合は -1
   */
  public gidToFrame(gid: number): number {
    if (gid <= 0 || this.tilesets.length === 0) return -1;
    // firstgid 降順に探して、最初に条件を満たすタイルセットを使います
    for (let i = this.tilesets.length - 1; i >= 0; i--) {
      const ts = this.tilesets[i];
      if (gid >= ts.firstgid) {
        const local = gid - ts.firstgid;
        const cols = ts.columns ?? this.tileCols;
        const total = ts.count ?? cols * this.tileRows;
        if (local < 0 || local >= total) return -1;
        // フレーム番号がグリッドの行数を超える場合は折り返しません
        if (this.tileRows > 0 && Math.floor(local / cols) >= this.tileRows) return -1;
        return local;
      }
    }
    return -1;
  }

  /**
   * カメラの可視範囲外のタイルのIDを解放し、可視範囲内のタイルをアロケートします。
   */
  public updateCulling(
    camera: Camera,
    screenWidth: number,
    screenHeight: number,
    buffer = 1,
  ): void {
    const hw = screenWidth / 2 / camera.zoom;
    const hh = screenHeight / 2 / camera.zoom;

    const startX = Math.max(0, Math.floor((camera.x - hw) / this.tileSize) - buffer);
    const startY = Math.max(0, Math.floor((camera.y - hh) / this.tileSize) - buffer);
    const endX = Math.min(this.mapWidth - 1, Math.floor((camera.x + hw) / this.tileSize) + buffer);
    const endY = Math.min(this.mapHeight - 1, Math.floor((camera.y + hh) / this.tileSize) + buffer);

    if (
      startX === this.lastStartX &&
      startY === this.lastStartY &&
      endX === this.lastEndX &&
      endY === this.lastEndY
    ) {
      return; // 変化なし
    }

    // 古い範囲で画面外に出たものを解放
    for (let l = 0; l < this.layersData.length; l++) {
      const active = this.activeTiles.get(l)!;
      for (let y = this.lastStartY; y <= this.lastEndY; y++) {
        if (y < 0 || y >= this.mapHeight) continue;
        for (let x = this.lastStartX; x <= this.lastEndX; x++) {
          if (x < 0 || x >= this.mapWidth) continue;

          if (x < startX || x > endX || y < startY || y > endY) {
            const idx = y * this.mapWidth + x;
            const arenaId = active[idx];
            if (arenaId !== -1) {
              this.arena.free(arenaId);
              active[idx] = -1;
            }
          }
        }
      }
    }

    const perLayer = this.cellsPerLayer;

    // 新しい範囲で画面内に入ったものを確保
    for (let l = 0; l < this.layersData.length; l++) {
      const active = this.activeTiles.get(l)!;
      const base = l * perLayer;
      const offX = this.layerScrollX[l];
      const offY = this.layerScrollY[l];
      for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
          const idx = y * this.mapWidth + x;
          const tileIndex = this.flatTiles[base + idx];
          // 0 or -1 means empty tile in Tiled
          if (tileIndex <= 0) continue;

          if (active[idx] === -1) {
            const id = this.arena.allocate();
            if (id === -1) continue;
            const dense = this.arena.idToIndex[id];
            this.arena.setPosX(dense, x * this.tileSize + this.tileSize / 2 + offX);
            this.arena.setPosY(dense, y * this.tileSize + this.tileSize / 2 + offY);
            // scale は倍率です。タイルは 1 タイル分を描画したいので
            // フレーム寸法そのものを与えて scale = 1 で描画します。
            this.arena.setFrameSize(dense, this.tileSize, this.tileSize, false);
            // テクスチャ未設定のスプライトは既定で透明なので、
            // 描画されるよう不透明へ戻します。
            this.arena.setTint(dense, 0xffffffff);

            // gid をフレーム番号へ変換し、タイルセットの UV を割り当てます。
            // これで実際にテクスチャの該当部分が描画されます
            // (以前は UV 未割り当てで単色のまま描画されていました)。
            const frame = this.gidToFrame(tileIndex);
            if (frame >= 0) {
              this._applyTileUv(id, frame);
            }
            active[idx] = id;
          } else {
            // すでに確保済みでもオフセット変更を追従させます
            const dense = this.arena.idToIndex[active[idx]];
            if (dense >= 0) {
              this.arena.setPosX(dense, x * this.tileSize + this.tileSize / 2 + offX);
              this.arena.setPosY(dense, y * this.tileSize + this.tileSize / 2 + offY);
            }
          }
        }
      }
    }

    this.lastStartX = startX;
    this.lastStartY = startY;
    this.lastEndX = endX;
    this.lastEndY = endY;
  }

  /**
   * タイルセットの UV を割り当てます。
   *
   * UV はテクスチャ配列のレイヤー寸法で正規化されるため、
   * {@link GraphicsDevice.textureWidth} の情報をここには持たない前提で
   * アセットの `frames` を参照します (フレーム番号で参照するのが確実です)。
   */
  private _applyTileUv(entityId: number, frame: number): void {
    const idx = this.arena.idToIndex[entityId];
    if (idx < 0) return;
    const asset = this.arena.assetRef[idx];
    if (!asset || !asset.frames || asset.frames.length === 0) return;
    if (frame >= asset.frames.length) return;
    const f = asset.frames[frame];
    this.arena.setUv4(idx, f.uvX, f.uvY, f.uvW, f.uvH);
    this.arena.srcFrame[idx] = frame;
  }

  public destroy(): void {
    for (let l = 0; l < this.layersData.length; l++) {
      const active = this.activeTiles.get(l)!;
      for (let i = 0; i < active.length; i++) {
        if (active[i] !== -1) {
          this.arena.free(active[i]);
        }
      }
    }
    this.layersData = [];
    this.activeTiles.clear();
    this._layerHandles.clear();
  }
}
