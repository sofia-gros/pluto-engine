# PlutoEngine レンダラーパイプライン詳細設計

## 1. 概要
PlutoEngineのレンダラーパイプラインは、WebGL2の機能を最大限に活用し、**シングルパス描画**と**ゼロオーバーヘッドのデータ転送**を実現します。コアアーキテクチャのSoA (Structure of Arrays) データ構造を直接WebGLのバッファに流し込むことで、CPUからGPUへの転送コストを最小化します。

## 2. WGSL-First + Build-time Transpilation to GLSL
複数回のドローコールを発行するのではなく、Instanced Rendering（インスタンシング）を活用して、大量の2Dスプライトやパーティクルを一度のドローコール（シングルパス）で描画します。
PlutoEngineは **WGSL（WebGPU Shading Language）を唯一のシェーダー記述言語** として採用する「WGSL-First」戦略をとります。開発者およびユーザーは `.wgsl` ファイルのみを記述します。
WebGPUをサポートしていない古いデバイス（WebGL2環境）をサポートするため、Viteプラグインを用いたビルド時トランスパイル（Build-time Transpilation）によって `.wgsl` から WebGL2 向けの GLSL コードを自動生成します。これにより、実行時のパースオーバーヘッドをゼロにしつつ、開発体験の向上と高い互換性を両立します。

## 3. データ転送設計 (SoAからGPUへ)
コアシステムで管理されている `Float32Array`（SoAレイアウト）は、WebGL2のバッファ（VBO）やWebGPUの `GPUBuffer` へ直接マッピング・転送されます。中間オブジェクトの生成を行わないため、データ変換とGCのオーバーヘッドがありません。

### 3.1 動的バッファ転送とバインド
PlutoEngineでは、GPU転送の直前にデータの詰め替えを行うのではなく、SoAレイアウトの `Float32Array` サブアレイをそのまま `gl.bufferSubData` や `device.queue.writeBuffer` を用いて GPU へ転送します。

```typescript
/**
 * 描画データをWebGL2に転送・描画するクラス。
 */
class SpriteRenderer {
    private gl: WebGL2RenderingContext;
    private instanceVao: WebGLVertexArrayObject;
    private positionXBuffer: WebGLBuffer;
    private positionYBuffer: WebGLBuffer;

    /**
     * SoAマネージャーから直接データをGPUへ転送し、描画する。
     * @param transformManager コアで管理されているトランスフォームSoA
     * @param count 描画する有効なエンティティ数
     */
    public render(transformManager: TransformManager, count: number): void {
        const gl = this.gl;

        gl.bindVertexArray(this.instanceVao);

        // 位置Xのバッファ更新 (subarrayを使用して必要な分だけ直接転送)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionXBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, transformManager.positionX.subarray(0, count));
        
        // 位置Yのバッファ更新
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionYBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, transformManager.positionY.subarray(0, count));

        // インスタンシング描画（シングルパス）
        // 例: 6頂点（Quad）をcount個インスタンス描画
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);

        gl.bindVertexArray(null);
    }
}
```

## 4. テクスチャアトラスとバッチング
異なるテクスチャを持つスプライトであってもドローコールを分割しないよう、WebGL2の `TEXTURE_2D_ARRAY` を用いたテクスチャ配列を採用します。
各インスタンスの属性として「テクスチャレイヤーID」をSoA側から渡し、フラグメントシェーダー内でサンプリング先を動的に決定します。

### 4.1 シェーダー設計（フラグメントシェーダー例）
```glsl
#version 300 es
precision highp float;

// 頂点シェーダーから渡されるUV座標
in vec2 v_uv;
// インスタンスごとに渡されるテクスチャのレイヤーID
in float v_textureLayer; 

// テクスチャ配列（テクスチャアトラスの代替）
uniform highp sampler2DArray u_textureArray;

out vec4 outColor;

void main() {
    // レイヤーIDを用いて3Dテクスチャ座標としてサンプリング
    outColor = texture(u_textureArray, vec3(v_uv, v_textureLayer));
}
```

## 5. 将来の拡張性
- **WebGPUへの移行**: SoAベースのバッファ管理は、WebGPUの Compute Shader や Storage Buffer と非常に相性が良く、将来的により高度な計算（XPBDのGPU並列化など）と描画の統合が容易です。
- **データ駆動のカリング**: 描画前に、SoAデータに対してSIMD的（またはWebAssembly/Workerによる）なフラスタムカリングを適用し、描画対象のインデックスリスト（要素バッファ）のみを構築してGPUに渡す最適化を計画しています。これにより無駄な頂点処理を省きます。

## 6. テキストレンダリング: MSDF (Multi-channel Signed Distance Field) パイプライン
PlutoEngineのテキスト描画は、極限のパフォーマンスと高品質なレンダリングを両立するため、MSDF (Multi-channel Signed Distance Field) を採用します。
- **目標**: すべてのテキスト（文字スプライト）を単一のMSDFテクスチャアトラスとして管理し、前述のインスタンシング描画パイプラインに統合します。
- **仕組み**: 文字ごとに個別のテクスチャを生成・バインドするのではなく、事前に生成されたMSDFアトラスを参照し、シェーダー（WGSL）内で距離場に基づくアンチエイリアス処理を行います。これにより、拡大縮小に強く、かつフォント描画時でもドローコールの分割を防ぎ、数千〜数万文字の動的テキストを60FPSで安定して描画可能にします。
