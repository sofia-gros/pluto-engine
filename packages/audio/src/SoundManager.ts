/**
 * @file SoundManager.ts
 * @description
 * `@pluto-engine/core` へ移動した SoundManager の再エクスポートです。
 *
 * 実装は `packages/core/src/sound/SoundManager.ts` にあり、
 * `Scene.sound` から遅延生成で参照されます。
 *
 * 移動の理由: 以前は `@pluto-engine/audio` に実装があり `audio` が `core` に依存する
 * 向きでした。`Scene.sound` をゼロコスト・サブシステムとして実装するには core 側の
 * 遅延サブシステムと 1 つのビットにまとめる必要があるため、依存の向きが反転していたので
 * 実装を core 側へ移し、こちらは後方互換用の再エクスポートに留めています。
 *
 * 既存の `import { SoundManager } from '@pluto-engine/audio'` はそのまま動作します。
 */

export {
  SoundManager,
  SoundHandle,
  Voice,
  type PlayOptions,
  type AudioConfig,
} from '@pluto-engine/core';
