---
layout: home

hero:
  name: PlutoEngine
  text: 次世代2D Webゲームエンジン
  tagline: ゼロアロケーション。SoA（Structure of Arrays）。純粋なパフォーマンス。
  actions:
    - theme: brand
      text: はじめに (ガイド)
      link: /guide/intro
    - theme: brand
      text: チュートリアル制作
      link: /tutorial/01-setup
    - theme: alt
      text: GitHubで見る
      link: https://github.com/sofia-gros/pluto-engine

features:
  - title: 超高速インスタンシング (300,000+ スプライト)
    details: GCのオーバーヘッドをゼロにし、30万体以上のスプライトを単一のドローコールで安定してレンダリングします。
  - title: Phaser-like Arcade Physics (AABB 枝刈り)
    details: this.physics.add.overlap で単一/配列/アリーナ/バッファの全組み合わせを透過判定。AABB Broadphase Culling により30万体を 0.08ms で高速処理。
  - title: データ指向設計 (SoA) & ループ分離
    details: CPUキャッシュラインを最大化する TypedArray (SoA) と Loop Fission により、V8/JITコンパイラの自動 SIMD ベクトル化を促進。
  - title: ポアソン群集流体 (Continuum Crowds)
    details: 速度場事前計算と Lerp of Lerp 双線形補間により、滑らかで自然な数万体の誘導・ステアリングを最小負荷で実現。
  - title: WebGPU 統合ハードウェアインスタンシング
    details: WebGPU と WebGPU の両バックエンドで30万体（300,000+）の同時描画を完全サポート。パッキングのインライン化と適正サイズ転送により、クラッシュ知らずの圧倒的スケーラビリティを実現。
  - title: 高速物理 & 空間分割内蔵
    details: XPBD位置ベース動力学ソルバとモートン順序空間ハッシュにより、大群の衝突判定をO(1)で解決。
---
