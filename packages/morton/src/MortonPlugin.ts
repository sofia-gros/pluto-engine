import type { Plugin, Scene } from '@pluto-engine/core';
import { MortonSpatialHash } from './index';

// TypeScriptのモジュール拡張 (Declaration Merging) を利用して、
// プラグインをインポートするだけで Scene クラスに spatialHash プロパティが生えるようにします。
declare module '@pluto-engine/core' {
  interface Scene {
    spatialHash: MortonSpatialHash;
  }
}

/**
 * PlutoEngine Scene プラグイン
 * SceneにMortonSpatialHashインスタンスを注入します。
 */
export class MortonPlugin implements Plugin {
  private hash!: MortonSpatialHash;
  private cellSize: number;

  constructor(cellSize = 64) {
    this.cellSize = cellSize;
  }

  public init(scene: Scene): void {
    // Scene のアリーナ最大容量に合わせて空間ハッシュを初期化
    this.hash = new MortonSpatialHash(scene.arena.capacity, this.cellSize);
    
    // Scene に直接インスタンスを注入（this.spatialHash としてアクセス可能に）
    scene.spatialHash = this.hash;
  }
}
