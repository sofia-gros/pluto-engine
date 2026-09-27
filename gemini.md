# PlutoEngine Agent Guidelines (Gemini & Subagents Context)

このドキュメントは、PlutoEngineプロジェクトに参画するすべてのAIエージェント（メインエージェント、`engine_architect`, `math_solver`, `qa_tester` など）が、コードを読解・生成する際に必ず守るべき「掟（ルール）」を定義したものです。

## 1. コア設計思想 (Core Philosophy)
このエンジンは「1万体以上のエンティティを、ユーザーが設定した目標フレームレート（デフォルト60FPS、144FPS等も可）でブラウザ上で安定して動かす」ことを目的としています。
通常のオブジェクト指向やDOM操作ではGCスパイクが発生するため、以下の原則を**絶対**に守ってください。

- **ゼロアロケーション (Zero-Allocation)**: `update` ループや `render` ループの内部で、ヒープメモリを動的に確保（`new` 演算子, オブジェクトリテラル `{}`, 配列リテラル `[]`, `.push()` など）してはいけません。
- **データ指向設計 (Data-Oriented Design / SoA)**: コンポーネントやエンティティのデータは、必ず事前確保された `Float32Array` や `Uint32Array` などのフラットな TypedArray (Structure of Arrays) に格納してください。
- **フライウェイトパターン (Flyweight Pattern)**: `Sprite` などのクラスは、単なる TypedArray への「インデックス（id）」だけを保持する軽量なハンドルとして実装してください。

## 2. 開発スタックとツールチェイン
- **ランタイム / パッケージマネージャ**: `Bun` (すべてのコマンドは `bun run ...` で実行します)
- **モノレポ**: `Bun Workspaces` (ルートから `packages/*`, `apps/*` を参照)
- **ビルドツール**: `tsup`
- **Lint / Format**: `Biome` (フォーマットは `bun run format`、Lintは `bun run lint` を使用)
- **テスト**: `Vitest Browser Mode` + `Playwright` (`bun run test`)

## 3. テストの掟 (Testing Rules)
- **モック禁止**: Canvas API, WebGL2, DOM API をモック（JSDOMなど）で誤魔化さないでください。Vitest Browser Mode により実ブラウザ環境が立ち上がるため、本物の `document.createElement('canvas')` や `getContext('webgl2')` をそのまま使用してテストを書いてください。

## 4. コーディングスタイル
- **言語**: TypeScript (`strict: true`)
- **ドキュメンテーション**: コード内の Docコメント (JSDoc) は**必ず日本語**で記述してください。
- **エラー処理**: 実行時のオーバーヘッドを避けるため、クリティカルループ外の初期化時（アリーナの確保時など）に厳密なバリデーションを行ってください。

## 5. ワークフロー
1. 実装前に必ず `docs/detailed_design/` 配下の関連設計書を確認すること。
2. 設計に変更が必要な場合は、コードを書く前に（または同時に）設計書を更新し、柔軟なアーキテクチャを維持すること。

## 6. エンジンの配布・提供方法 (Distribution Methods)
PlutoEngine は、様々なユースケースに対応するため、以下の4つの配布形態をサポートしています。

1. **GitHub上のソースコード (Source Code on GitHub)**
   - 開発者がリポジトリを直接クローンし、拡張・カスタマイズを行うための標準的な方法。
2. **TypeScript エンジンインポート (TS Engine Imports)**
   - TypeScriptプロジェクト（Next.js, Viteなど）にモジュールとして直接インポートし、型安全な開発を行う形態。
3. **トランスパイル済み JavaScript インポート (Transpiled JS Imports)**
   - ビルド済みのJSモジュールを直接利用し、ビルド環境に依存せずに組み込む形態。
4. **`<script>` タグによる直接利用 (CDN Ready)**
   - `pluto.global.js` や `pluto.esm.js` を用いて、HTMLの `<script>` タグから直接読み込む形態。シェーダーなどのアセットは単一ファイルにインライン化されており、スタンドアロンのブラウザ環境で即座に動作します。
