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
  - title: 超高速インスタンシング (100,000+ スプライト)
    details: GCのオーバーヘッドをゼロにし、数万〜10万体以上のスプライトを単一のドローコールで144FPSレンダリングします。
  - title: データ指向設計 (SoA)
    details: CPUキャッシュラインを最大化するため、フラットなTypedArray (SoA) 上にアリーナメモリをゼロから構築。
  - title: WebGPU / WebGL2 ハイブリッド
    details: WGSLパイプラインを採用し、WebGL2への自動フォールバックとハードウェアインスタンシングをサポート。
  - title: 高速物理 & 空間分割内蔵
    details: XPBD位置ベース動力学ソルバとモートン順序空間ハッシュにより、大群の衝突判定をO(1)で解決。
---