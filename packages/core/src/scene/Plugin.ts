/**
 * @file Plugin.ts
 * @description
 * Scene に拡張機能（物理エンジン、AI、カスタムロジックなど）を注入するためのインターフェース。
 */

import type { Scene } from './Scene';

export interface Plugin {
  /** プラグインの初期化時に呼ばれます */
  init?(scene: Scene): void;
  /** 毎フレームの可変更新時に呼ばれます */
  update?(dt: number): void;
  /** 固定タイムステップの更新時に呼ばれます */
  fixedUpdate?(fixedDt: number): void;
  /** シーン破棄時に呼ばれます */
  destroy?(): void;
}
