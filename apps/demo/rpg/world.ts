/**
 * @file world.ts
 * @description
 * 2D クラシックRPGのワールドマップ構築・障害物管理。
 * 町（Plaza / Castle）、平原（Meadows / Forest）、ダンジョン（Ruins / Cavern）の
 * 3エリアをシームレスにつなぎ、AABBコリジョン判定を提供します。
 */

import type { Scene, Sprite } from '@pluto-engine/core';

export enum TileType {
  DEEP_WATER = 0,
  GRASS = 1,
  COBBLESTONE = 2,
  WALL = 3,
  WOOD_FLOOR = 4,
  WATER = 5,
  BRIDGE = 6,
  DUNGEON_FLOOR = 7,
  DUNGEON_WALL = 8,
  LAVA = 9,
}

export interface WorldProp {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'tree' | 'rock' | 'chest' | 'fountain' | 'pillar' | 'stall' | 'house';
  solid: boolean;
  interactable?: boolean;
  opened?: boolean;
  sprite?: Sprite;
}

export class RPGWorld {
  public scene: Scene;
  public readonly mapWidth = 90;
  public readonly mapHeight = 90;
  public readonly tileSize = 32;

  public readonly worldWidth: number;
  public readonly worldHeight: number;

  public tiles: Uint8Array;
  public solidMap: Uint8Array; // 1 = solid, 0 = walkable

  public props: WorldProp[] = [];
  public propSprites: Sprite[] = [];
  public chests: WorldProp[] = [];

  constructor(scene: Scene) {
    this.scene = scene;
    this.worldWidth = this.mapWidth * this.tileSize;
    this.worldHeight = this.mapHeight * this.tileSize;

    this.tiles = new Uint8Array(this.mapWidth * this.mapHeight);
    this.solidMap = new Uint8Array(this.mapWidth * this.mapHeight);

    this.generateWorld();
    this.spawnWorldTilesAndProps();
  }

  private generateWorld(): void {
    const W = this.mapWidth;
    const H = this.mapHeight;

    // 1. 基本地形の生成
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const idx = y * W + x;

        // エリア判定:
        // 左上 (0..44, 0..44): 町・広場 (Town)
        // 右側・中央 (45..89, 0..50): 平原・森・川 (Meadow)
        // 南部 (0..89, 50..89): 古代遺跡・ダンジョン (Dungeon)

        if (y < 46 && x < 46) {
          // 町エリア
          if (
            x === 0 ||
            y === 0 ||
            (x === 45 && !(y >= 20 && y <= 24)) ||
            (y === 45 && !(x >= 20 && x <= 24))
          ) {
            this.tiles[idx] = TileType.WALL;
            this.solidMap[idx] = 1;
          } else if (
            (x >= 14 && x <= 30 && y >= 14 && y <= 30) ||
            (x >= 20 && x <= 24) ||
            (y >= 20 && y <= 24)
          ) {
            this.tiles[idx] = TileType.COBBLESTONE;
          } else if (
            (x >= 6 && x <= 12 && y >= 6 && y <= 12) ||
            (x >= 32 && x <= 38 && y >= 6 && y <= 12)
          ) {
            // 家屋の床
            this.tiles[idx] = TileType.WOOD_FLOOR;
          } else {
            this.tiles[idx] = TileType.GRASS;
          }
        } else if (y >= 50) {
          // ダンジョンエリア
          if (x === 0 || x === W - 1 || y === H - 1 || (y === 50 && !(x >= 20 && x <= 24))) {
            this.tiles[idx] = TileType.DUNGEON_WALL;
            this.solidMap[idx] = 1;
          } else if (
            x >= 35 &&
            x <= 55 &&
            y >= 65 &&
            y <= 80 &&
            (x === 35 || x === 55 || y === 65 || y === 80)
          ) {
            // ボス部屋の壁
            if (!(x === 45 && y === 65)) {
              this.tiles[idx] = TileType.DUNGEON_WALL;
              this.solidMap[idx] = 1;
            } else {
              this.tiles[idx] = TileType.DUNGEON_FLOOR;
            }
          } else if (
            (x >= 70 && x <= 80 && y >= 55 && y <= 65) ||
            (x >= 10 && x <= 18 && y >= 75 && y <= 82)
          ) {
            this.tiles[idx] = TileType.LAVA;
            this.solidMap[idx] = 1;
          } else {
            this.tiles[idx] = TileType.DUNGEON_FLOOR;
          }
        } else {
          // 平原・森林・川エリア
          if (x >= 62 && x <= 65) {
            // 川 (縦に流れる)
            if (y >= 20 && y <= 24) {
              this.tiles[idx] = TileType.BRIDGE; // 橋
            } else {
              this.tiles[idx] = TileType.WATER;
              this.solidMap[idx] = 1;
            }
          } else {
            this.tiles[idx] = TileType.GRASS;
          }
        }
      }
    }

    // 2. 町の家屋の壁を配置
    this.addBuilding(6, 6, 7, 7);
    this.addBuilding(32, 6, 7, 7);
    this.addBuilding(6, 32, 7, 7);
    this.addBuilding(32, 32, 7, 7);

    // 3. プロップ（噴水、露店、木、宝箱、柱）の配置
    // 町の噴水
    this.addProp(22 * 32 + 16, 22 * 32 + 16, 48, 48, 'fountain', true);

    // 露店
    this.addProp(16 * 32, 20 * 32, 36, 28, 'stall', true);
    this.addProp(28 * 32, 20 * 32, 36, 28, 'stall', true);

    // 平原の木々
    for (let i = 0; i < 45; i++) {
      const tx = 48 + Math.floor(Math.random() * 38);
      const ty = 4 + Math.floor(Math.random() * 42);
      if (tx >= 60 && tx <= 67) continue; // 川を避ける
      this.addProp(tx * 32 + 16, ty * 32 + 16, 32, 32, 'tree', true);
    }

    // ダンジョンの古代の柱
    for (let i = 0; i < 20; i++) {
      const tx = 8 + Math.floor(Math.random() * 74);
      const ty = 54 + Math.floor(Math.random() * 30);
      if (this.tiles[ty * W + tx] === TileType.DUNGEON_FLOOR) {
        this.addProp(tx * 32 + 16, ty * 32 + 16, 24, 32, 'pillar', true);
      }
    }

    // 宝箱 (開けられるインタラクティブオブジェクト)
    this.addChest(35 * 32 + 16, 9 * 32 + 16); // 民家の中
    this.addChest(82 * 32 + 16, 12 * 32 + 16); // 平原の奥
    this.addChest(12 * 32 + 16, 60 * 32 + 16); // ダンジョン西翼
    this.addChest(45 * 32 + 16, 76 * 32 + 16); // ボス部屋の奥
    this.addChest(78 * 32 + 16, 82 * 32 + 16); // ダンジョン東宝物庫
  }

  private addBuilding(x: number, y: number, w: number, h: number): void {
    const W = this.mapWidth;
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const curX = x + dx;
        const curY = y + dy;
        const idx = curY * W + curX;
        // 壁（出入口 dy === h-1 && dx === Math.floor(w/2) は開けておく）
        if (dy === 0 || dy === h - 1 || dx === 0 || dx === w - 1) {
          if (dy === h - 1 && dx === Math.floor(w / 2)) {
            this.tiles[idx] = TileType.WOOD_FLOOR;
            this.solidMap[idx] = 0;
          } else {
            this.tiles[idx] = TileType.WALL;
            this.solidMap[idx] = 1;
          }
        }
      }
    }
  }

  private addProp(
    x: number,
    y: number,
    width: number,
    height: number,
    type: any,
    solid: boolean,
  ): void {
    this.props.push({ x, y, width, height, type, solid });
  }

  private addChest(x: number, y: number): void {
    const chest: WorldProp = {
      x,
      y,
      width: 28,
      height: 28,
      type: 'chest',
      solid: true,
      interactable: true,
      opened: false,
    };
    this.props.push(chest);
    this.chests.push(chest);
  }

  private spawnWorldTilesAndProps(): void {
    // タイルを PlutoEngine のアリーナにインスタンス化
    const W = this.mapWidth;
    const H = this.mapHeight;

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const idx = y * W + x;
        const tType = this.tiles[idx];
        const spr = this.scene.add.sprite(x * this.tileSize + 16, y * this.tileSize + 16);
        spr.scale = this.tileSize + 0.5; // シーム防止

        switch (tType) {
          case TileType.GRASS:
            // 草原: 明るい緑
            spr.setTint(0x3a7d44);
            break;
          case TileType.COBBLESTONE:
            // 石畳: ライトグレー
            spr.setTint(0x9ca3af);
            break;
          case TileType.WALL:
            // 町の壁: 濃い石造りグレー
            spr.setTint(0x4b5563);
            break;
          case TileType.WOOD_FLOOR:
            // 民家の床: 温かみのある木目ブラウン
            spr.setTint(0x854d0e);
            break;
          case TileType.WATER:
            // 川: 澄んだブルー
            spr.setTint(0x0284c7);
            break;
          case TileType.BRIDGE:
            // 橋: 木製ブラウン
            spr.setTint(0xa16207);
            break;
          case TileType.DUNGEON_FLOOR:
            // ダンジョン床: 暗いスレートパープル
            spr.setTint(0x1e1b4b);
            break;
          case TileType.DUNGEON_WALL:
            // ダンジョン壁: 堅牢な暗黒石
            spr.setTint(0x0f172a);
            break;
          case TileType.LAVA:
            // 溶岩: 燃え盛るオレンジレッド
            spr.setTint(0xe11d48);
            break;
          default:
            spr.setTint(0x111827);
            break;
        }
      }
    }

    // プロップの描画スプライト配置
    for (const prop of this.props) {
      const spr = this.scene.add.sprite(prop.x, prop.y);
      spr.scale = Math.max(prop.width, prop.height);
      prop.sprite = spr;

      switch (prop.type) {
        case 'fountain':
          spr.setTint(0x38bdf8); // 噴水ブルー
          break;
        case 'stall':
          spr.setTint(0xf59e0b); // 露店アンバー
          break;
        case 'tree':
          spr.setTint(0x15803d); // 深緑の木
          break;
        case 'pillar':
          spr.setTint(0x64748b); // 石柱
          break;
        case 'chest':
          spr.setTint(0xfacc15); // 黄金の宝箱
          break;
      }
      this.propSprites.push(spr);
    }
  }

  /**
   * 座標 (x, y) が通行不能（Solid）かどうかを O(1) で判定
   */
  public isBlocked(x: number, y: number, radius = 12): boolean {
    if (
      x < radius ||
      x >= this.worldWidth - radius ||
      y < radius ||
      y >= this.worldHeight - radius
    ) {
      return true;
    }

    // 周囲4隅のタイルチェック
    const minTx = Math.floor((x - radius) / this.tileSize);
    const maxTx = Math.floor((x + radius) / this.tileSize);
    const minTy = Math.floor((y - radius) / this.tileSize);
    const maxTy = Math.floor((y + radius) / this.tileSize);

    for (let ty = minTy; ty <= maxTy; ty++) {
      for (let tx = minTx; tx <= maxTx; tx++) {
        if (tx < 0 || tx >= this.mapWidth || ty < 0 || ty >= this.mapHeight) return true;
        if (this.solidMap[ty * this.mapWidth + tx] === 1) return true;
      }
    }

    // プロップ障害物チェック
    for (let i = 0; i < this.props.length; i++) {
      const p = this.props[i];
      if (!p.solid) continue;
      const hw = p.width / 2 + radius;
      const hh = p.height / 2 + radius;
      if (Math.abs(x - p.x) < hw && Math.abs(y - p.y) < hh) {
        return true;
      }
    }

    return false;
  }
}
