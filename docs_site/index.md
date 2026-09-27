---
layout: home

hero:
  name: PlutoEngine
  text: 次世代2D Webエンジン
  tagline: ゼロアロケーション。SoA（Structure of Arrays）。純粋なパフォーマンス。
  actions:
    - theme: brand
      text: はじめる
      link: /guide/getting-started
    - theme: alt
      text: GitHubで見る
      link: https://github.com/yourusername/pluto-engine

features:
  - title: 超高速インスタンシング
    details: GCのオーバーヘッドなしで、数万のスプライトを単一のドローコールでレンダリングします。
  - title: データ指向設計 (SoA)
    details: キャッシュの一貫性を最大化するために、フラットなTypedArray (SoA) 上にゼロから構築されています。
  - title: WGSLファースト
    details: シェーダーをWGSLで記述し、古いデバイス向けにWebGL2へ自動的にトランスパイルします。
---