# PlutoEngine 実装ロードマップ & ワークフロー (Implementation Roadmap)

無秩序な実装（スパゲッティコード化やパフォーマンス劣化）を防ぐため、PlutoEngineの実装は以下の厳密なフェーズとステップに従って進めます。
各ステップは「詳細設計の確認」→「TDDでの実装」→「Vitestでの検証」のサイクルを回して完了とします。

---

## フェーズ 1: 基盤アーキテクチャ (Core Foundation)
エンジンの最も低レイヤーにあたる、メモリ管理とゲームループを構築します。このフェーズでは描画は行わず、データの健全性とループの正確性のみを担保します。

- [ ] **Step 1.1: `InstanceBufferArena` の実装**
  - `Float32Array` 等を用いた SoA (Structure of Arrays) のメモリプール実装。
  - 動的リサイズを避け、初期化時に確保したバッファ上での効率的な allocate / free 機構の作成。
- [ ] **Step 1.2: Flyweight オブジェクトの実装**
  - `Sprite` などのクラスが、Step 1.1 のアリーナの「インデックス番号」のみを保持し、ゲッター/セッターを通じて直接 TypedArray にアクセスする機構。
- [ ] **Step 1.3: `GameLoop` と TimeStep 管理**
  - `requestAnimationFrame` をフックし、可変 `dt` と固定 `fixedDeltaTime`（アキュムレータ）を分離したループの構築。
  - 目標FPSの可変設定と、パニック時（Spiral of Death）の安全処理。
- [ ] **Step 1.4: `InputManager` の実装**
  - Ebitengine スタイルの同期クエリ（`isKeyJustPressed`等）の実現と、フレームごとの状態ラッチ。

---

## フェーズ 2: 数学・物理・インテリジェンス (Math, Physics & AI Solvers)
ブラウザAPI（WebGLやDOM）に依存しない純粋な TypeScript アルゴリズム群を実装します。将来的にWasm化可能なように設計しますが、基本は Pure TS で構築しエコシステムの利便性を保ちます。

- [ ] **Step 2.1: 2D Morton 空間ハッシュ (`@pluto-engine/morton`)**
  - アクション、STG、RPGのすべての近傍探索を加速するビット演算空間ハッシュ。
- [ ] **Step 2.2: 2D-SDF コライダー (`@pluto-engine/sdf-collider`)**
  - タイルマップ等の地形を符号付き距離場 (SDF) として保持し、どんな数万の群集やプレイヤーも「角に引っかからず滑らかに滑る」 $O(1)$ の衝突判定を実装。
- [ ] **Step 2.3: XPBD 剛体緩和ソルバ (`@pluto-engine/xpbd`)**
  - 位置ベース動力学によるめり込み反発アルゴリズム。
- [ ] **Step 2.4: Continuum Crowds & Poisson UIC (`@pluto-engine/poisson`, `continuum`)**
  - 流体力学的な群集シミュレーション。グリッドベースの密度スプラッティングと、ヤコビ反復法を用いた圧力ポアソン方程式ソルバの実装。
- [ ] **Step 2.5: SoA ユーティリティ AI (`@pluto-engine/ai`)**
  - FSM（状態遷移）の複雑さを排除し、SoAアーキテクチャ上で数万体のNPCの行動（接近、逃走、補給など）を軽量に意思決定するシステム。

---

## フェーズ 3: 統一シングルパス・レンダラ (WebGL2 / WebGPU Unified Renderer)
フェーズ1で構築した SoA バッファを、直接 GPU へ送り込んで描画するバックエンドを実装します。ゲームロジックはすべてCPU側に留め、GPUは「送られてきたインスタンス配列を爆速で描画する」ことに専念させます（汎用エンジンとしての制約）。

- [ ] **Step 3.1: 描画デバイス抽象化層 (`GraphicsDevice`) の初期化**
  - WebGPUと WebGL2 を隠蔽する抽象レイヤーの実装。
- [ ] **Step 3.2: 共有バッファのGPU転送パイプライン**
  - 毎フレーム `InstanceBufferArena` のスライスをそのまま GPU へストリーミングする仕組み。
- [ ] **Step 3.3: 統合シェーダーと SDF レンダリング**
  - テクスチャアトラスバッチングに加え、UIやフォントをどんな解像度でもボケずに描画するための SDF シェーダーの実装。

---

## フェーズ 4: 表現力とファサード統合 (Facade & Integration)
開発者が簡単に使える Phaser ライクなAPIを提供し、実際のデモアプリを構築します。

- [ ] **Step 4.1: Scene クラスとプラグインシステムの統合**
  - `this.add.sprite()` などの基本APIと、ユーザーが物理エンジン（XPBD、Verlet、またはMatter.js等）を自由に抜き差しできるプラグインアーキテクチャの構築。
- [ ] **Step 4.2: 軽量物理モジュール `@pluto-engine/verlet-ik` の構築**
  - マントや触手の演出に特化した軽量な Verlet積分モジュールをパッケージとして分離・実装し、プラガブルな設計を検証。
- [ ] **Step 4.3: デモアプリ (`apps/demo`) の実装**
  - 構築した全機能を用いたゲームロジックを実装し、実ブラウザ上でのプロファイリング（GCゼロ、目標FPSの維持）を検証。
