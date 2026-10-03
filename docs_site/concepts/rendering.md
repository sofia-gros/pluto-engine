# レンダリングパイプライン (Rendering)

PlutoEngine のレンダラは、**WebGPU** および **WebGL2** の双方でハードウェアインスタンシングによる超大規模描画（30万体以上）を完全サポートした統合アーキテクチャです。`createGraphicsDevice(canvas)` により、WebGPU 対応環境ではモダンな WebGPU パイプラインが自動選択され、未対応環境ではシームレスに WebGL2 へフォールバックします。

## アーキテクチャの概要

CPU（JavaScript/TypeScript側）の役割は、SoA（Structure of Arrays）形式のバッファをゼロアロケーションで GPU へストリーミングすることに特化しています。

1. **データ同期 (CPU → GPU)**
   CPU上の `Float32Array` アリーナから、`GraphicsDevice`（`WebGL2Device` / `WebGPUDevice`）を通じて GPU バッファへデータを転送します。Dirty Flags 機構により、変更のあったバッファのみを選択的に転送します。
2. **GPU Texture2DArray**
   スプライトテクスチャは `TextureManager` が管理する `GPU Texture2DArray` としてアップロードされます。これにより、異なるテクスチャを持つスプライトを描画する際にもバインド切り替えを発生させず、1ドローコールでの一括描画を可能にします。
3. **ハードウェアインスタンシング**
   単一のクアッドメッシュ（4頂点）に対してインスタンスアトリビュートをバインドし、WebGL2 の `gl.drawArraysInstanced()` または WebGPU の `drawIndexed(6, activeCount)` を1回呼び出すことで、30万体以上のスプライトを一括描画します。

## WebGPU バックエンドの最適化 (30万体対応)

WebGPU バックエンドでは、以前の 150,000 体クラッシュ限界（ブラウザ/GPU 間の IPC キュー過負荷）を克服するため、以下の最適化が適用されています：

- **JS パッキングループのインライン化**: 属性ごとの関数呼び出し（`_readF32` / `_readU32`）や Map 検索を排除し、ループ外で事前に TypedArray 参照を解決してインライン配列アクセス化。CPU 側のパッキング負荷を最小化。
- **`writeBuffer` 転送の適正サイズ化**: 固定の全バッファ（64MB）転送を廃止し、実際に描画される `activeCount * STRIDE_BYTES` だけを GPU キューへ転送。IPC 過負荷を根絶し、30万体の極限負荷でも WebGL2 と同等の滑らかさで動作します。

## メリット

- **描画コールの極小化**: 30万体以上のエンティティを単一ドローコールで描画。
- **ゼロアロケーションとの統合**: アリーナの `Float32Array` を追加コピーなしにそのまま GPU へストリーミング。
- **最高峰のスケーラビリティ & 互換性**: WebGPU による次世代の描画性能と、WebGL2 による確実なフォールバックを両立。
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
