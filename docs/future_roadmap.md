
# PlutoEngine Future Roadmap

現在の開発フェーズでは実装を見送ったものの、将来的に「大規模な2Dブラウザゲーム」を構築する上で必要不可欠となる機能群のリストです。

## テクスチャの高度な圧縮・最適化
- **KTX2 / Basis Universal のサポート**: 
  - メモリ帯域幅の削減とVRAM使用量の最適化のため、WebGL/WebGPU 拡張を利用した圧縮テクスチャ形式のサポートを追加する。
  - 現在の \LoaderManager\ のインターフェース設計は、将来的にバイナリパーサーを組み込めるように柔軟にしておく。

## Phaser4ライクな機能・不足機能の追加
- **Input Events (Pointer / Keyboard / Gamepad)**: 
  - エンティティがクリックされたか・ホバーされたかを判定する仕組み (Raycasting / AABB Hit Test)。
  - UIやボタンなどを実装するためのインタラクション基盤。
- **高度な Tilemap**: 
  - Tiled (TMX/JSON) 等で作成されたマップデータを高速に描画する層。
  - 現在の簡易的な実装から、巨大なマップをチャンクベースでカリング（画面外描画スキップ）する本格的な Static/Dynamic Tilemap へアップグレード。
- **Particle System**: 
  - SoA (Structure of Arrays) の恩恵を最も受ける「パーティクルエミッター」。
  - GPUインスタンシングを極限まで活用し、10万〜100万パーティクルを60FPSで描画・更新するプラグイン。
- **Arcade Physics (軽量物理エンジン)**: 
  - 既存のXPBD等とは別に、シンプルな AABB (Axis-Aligned Bounding Box) や 円 の衝突判定、速度・加速度の計算を行う軽量な2D物理挙動システム。

