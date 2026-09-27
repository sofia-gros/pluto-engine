# WGSL-First レンダリングパイプライン (Rendering)

PlutoEngineのレンダラは、従来のWebGLのステートマシンベースのアプローチを完全に捨て去り、WebGPUのコンピュートシェーダとレンダーパイプラインを統合した**WGSL-First**なアーキテクチャを採用しています。

## アーキテクチャの概要

CPU（JavaScript/TypeScript側）の主な役割は、SoA（Structure of Arrays）形式のバッファをGPUに転送するだけです。描画ロジックの重い処理（カリング、ソーティング、インスタンシングの準備）はすべてGPU上のコンピュートシェーダで実行されます。

1. **データ同期 (CPU -> GPU)**
   CPU上の `Float32Array` アリーナからGPUのStorageBufferへデータを転送します。
2. **コンピュートフェーズ (WGSL Compute)**
   - **カリング**: カメラのフラストム外にあるエンティティを除外します。
   - **モートン順序ソート (Morton Order)**: 空間局所性を高めるために、Z-Curve（Morton Code）を利用してZインデックスのソートをGPU上で行います。
3. **レンダーフェーズ (WGSL Render)**
   コンピュートシェーダが生成したインダイレクト描画バッファ（Indirect Buffer）を使用し、CPUを介さずにGPU自身が描画コマンドを発行します（GPU-Driven Rendering）。

## メリット

- **CPU負荷の激減**: CPUはドローコールの発行ループを回す必要がありません（Zero-Allocationに大きく貢献）。
- **大量のエンティティ描画**: 1万～10万のエンティティを同時に画面上にレンダリングしても、60FPS（またはそれ以上）を安定して維持できます。
