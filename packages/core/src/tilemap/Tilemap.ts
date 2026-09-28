import type { InstanceBufferArena } from '../arena/InstanceBufferArena';

export class Tilemap {
  private arena: InstanceBufferArena;
  public mapWidth: number;
  public mapHeight: number;
  public tileSize: number;

  constructor(arena: InstanceBufferArena, mapData: number[][], tileSize: number) {
    this.arena = arena;
    this.mapHeight = mapData.length;
    this.mapWidth = mapData[0]?.length || 0;
    this.tileSize = tileSize;

    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        const tileIndex = mapData[y][x];
        if (tileIndex === -1) continue; // 空のタイル

        const id = this.arena.allocate();
        if (id !== -1) {
          // 世界座標の計算
          this.arena.posX[id] = x * tileSize + tileSize / 2;
          this.arena.posY[id] = y * tileSize + tileSize / 2;
          this.arena.scale[id] = tileSize;
          // 後々テクスチャ配列などが追加された場合はここで設定します
        }
      }
    }
  }

  public destroy(): void {
    // 割り当てたIDを解放するロジック（実際にはFreeListに戻すなど）
  }
}
