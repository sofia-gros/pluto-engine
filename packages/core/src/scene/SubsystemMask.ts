/**
 * @file SubsystemMask.ts
 * @description
 * ゼロコスト・サブシステムのビットマスク定義。
 *
 * 方針:
 *  シーンには大量のマネージャー (tweens / anims / physics など) があります。
 *  使われていない機能を更新ループから除外するため、
 *  初回アクセス時にフラグを立て、毎フレームはビット 1 回の判定だけで
 *  スキップできるようにします。
 *
 * 目標: 未使用サブシステム 1 つあたりのオーバーヘッドを 0.0001ms 未満に抑えます。
 */

/**
 * 各サブシステムを示すビット。
 * 値は 1 << n とし、直接 bitwise OR で合成できるようにします。
 */
export const Subsystem = {
  None: 0,
  /** スプライト生成と描画対象 */
  Sprites: 1 << 0,
  /** タイルマップ */
  Tilemap: 1 << 1,
  /** this.tweens */
  Tweens: 1 << 2,
  /** this.anim */
  Anims: 1 << 3,
  /** 群集シミュレーション (プラグイン) */
  Swarm: 1 << 4,
  /** this.physics */
  Physics: 1 << 5,
  /** ライティング */
  Lighting: 1 << 6,
  /** this.particles */
  Particles: 1 << 7,
  /** this.sound */
  Sound: 1 << 8,
  /** カメラ */
  Camera: 1 << 9,
  /** テキスト (MSDF) */
  Text: 1 << 10,
} as const;

export type SubsystemBit = (typeof Subsystem)[keyof typeof Subsystem];

/** 名前からビットを取得するための表 (デバッグ表示用) */
export const SUBSYSTEM_NAMES: Record<number, string> = {
  [Subsystem.Sprites]: 'Sprites',
  [Subsystem.Tilemap]: 'Tilemap',
  [Subsystem.Tweens]: 'Tweens',
  [Subsystem.Anims]: 'Anims',
  [Subsystem.Swarm]: 'Swarm',
  [Subsystem.Physics]: 'Physics',
  [Subsystem.Lighting]: 'Lighting',
  [Subsystem.Particles]: 'Particles',
  [Subsystem.Sound]: 'Sound',
  [Subsystem.Camera]: 'Camera',
  [Subsystem.Text]: 'Text',
};

/**
 * ビットマスクを名前のリストへ変換します (プロファイラ表示用)。
 */
export function describeSubsystems(mask: number): string {
  if (mask === 0) return 'None';
  const names: string[] = [];
  for (const key of Object.keys(SUBSYSTEM_NAMES)) {
    const bit = Number(key);
    if ((mask & bit) !== 0) names.push(SUBSYSTEM_NAMES[bit]);
  }
  return names.join('|');
}
