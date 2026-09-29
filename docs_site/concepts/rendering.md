# レンダリングパイプライン (Rendering)

PlutoEngine のレンダラは、WebGL2 によるハードウェアインスタンシングを主軸とした実装です。WebGPU への対応は移行パスとして整備中であり、対応ブラウザでは段階的に有効化される予定です。

## アーキテクチャの概要

CPU（JavaScript/TypeScript側）の主な役割は、SoA（Structure of Arrays）形式のバッファをGPUに転送することです。現行の WebGL2 実装では、GPU Texture2DArray とハードウェアインスタンシングを使用しています。

1. **データ同期 (CPU → GPU)**
   CPU上の `Float32Array` アリーナから、WebGL2 デバイス（`WebGL2Device.uploadTexture()`）を通じて GPU バッファへデータを転送します。Dirty Flags 機構により、変更のあったバッファだけを選択的に転送します。
2. **GPU Texture2DArray**
   スプライトテクスチャは `TextureManager` が管理する `GPU Texture2DArray` としてアップロードされます。これにより、異なるスプライトを描画する際のテクスチャバインド切り替えを最小化します。
3. **ハードウェアインスタンシング (WebGL2)**
   単一のクアッドメッシュ（4頂点）に対してインスタンスアトリビュートをバインドし、`gl.drawArraysInstanced()` を1回呼び出すことで、10万体以上のスプライトを一括描画します。

## WebGPU について

WGSL コンピュートシェーダ・GPU-Driven Rendering（インダイレクト描画バッファによる CPU 非介入の描画コマンド発行）は将来の対応として計画中です。現時点では WebGL2 実装が唯一の本番パスです。

## メリット

- **描画コールの最小化**: 10万体以上のエンティティを1ドローコールで描画。
- **ゼロアロケーションとの統合**: アリーナの `Float32Array` を追加コピーなしにそのまま GPU へストリーミング。
- **広いブラウザ互換性**: WebGL2 はすべての主要なモダンブラウザでサポートされています。
