import type { InstanceBufferArena } from '../arena/InstanceBufferArena';
import type { Camera } from '../scene/Camera';

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
  }[];
}

export class Tilemap {
  private arena: InstanceBufferArena;
  public mapWidth: number;
  public mapHeight: number;
  public tileSize: number;

  private layersData: number[][] = [];

  // 現在アリーナにアロケートされているタイル (layerIndex -> mapIndex -> arenaId)
  private activeTiles: Map<number, Int32Array> = new Map();

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

      for (const layer of mapData.layers) {
        if (layer.type === 'tilelayer' && layer.visible !== false) {
          this.layersData.push(layer.data);
        }
      }
    }

    for (let l = 0; l < this.layersData.length; l++) {
      this.activeTiles.set(l, new Int32Array(this.mapWidth * this.mapHeight).fill(-1));
    }
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

    // 新しい範囲で画面内に入ったものを確保
    for (let l = 0; l < this.layersData.length; l++) {
      const active = this.activeTiles.get(l)!;
      const data = this.layersData[l];
      for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
          const idx = y * this.mapWidth + x;
          const tileIndex = data[idx];
          // 0 or -1 means empty tile in Tiled
          if (tileIndex <= 0) continue;

          if (active[idx] === -1) {
            const id = this.arena.allocate();
            if (id !== -1) {
              const dense = this.arena.idToIndex[id];
              this.arena.setPosX(dense, x * this.tileSize + this.tileSize / 2);
              this.arena.setPosY(dense, y * this.tileSize + this.tileSize / 2);
              // scale は倍率です。タイルはテクスチャ未設定 (UV 未割り当て) なので、
              // フレーム寸法そのものを与えて scale = 1 で 1 タイル分を描画します。
              // UV mapping can be applied here based on tileIndex
              this.arena.setFrameSize(dense, this.tileSize, this.tileSize, false);
              // テクスチャ未設定のスプライトは既定で透明のため、
              // タイルとして描画されるよう不透明へ戻します。
              this.arena.setTint(dense, 0xffffffff);
              active[idx] = id;
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
  }
}
