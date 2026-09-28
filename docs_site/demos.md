# 🎮 PlutoEngine プレイアブルデモ一覧

PlutoEngine の圧倒的なパフォーマンス（10万体描画・ゼロアロケーション・Phaserライクアーキテクチャ）をブラウザ上で実際に体験できるデモゲームです。

---

## 1. ⚔️ Pluto Quest: 王国の年代記 (2D クラシック RPG)

流体シミュレーション（Continuum Crowds）を一切使用せず、**Phaser と同様の「古典的なシーン・スプライト・ステートマシンAI・ArcadePhysics AABB 衝突判定」** だけで構築された正統派 2D トップダウン・アクションRPGです。

- **町・平原・ダンジョンのシームレスなワールド**: 広場、家屋、川、森林、古代遺跡、ボス部屋。
- **クエスト & NPC 対話システム**: 長老、武器商人（購入・装備）、衛兵、巫女（回復）。
- **リアルタイム戦闘**: 剣撃、火炎魔法、旋風ダッシュ、ドロップ品回収、宝箱開封。
- **内蔵ベンチマーク機能**: ゲーム画面上の `[B]` ボタンから、通常RPG（100体）から 1,000体、5,000体、20,000体の大群ダンジョンへ瞬時に切り替えて 60〜144 FPS の動作を確認可能。

👉 **[Pluto Quest をプレイする](/pluto-engine/demos/rpg/index.html)**

---

## 2. 🪐 Swarm Survivors (大量群集サバイバー)

10,000〜40,000体以上の敵がシームレスに出現し、Continuum Crowds (ポアソン群集流体) や XPBD 物理によって滑らかに押し寄せる大群集デモゲームです。

👉 **[Swarm Survivors をプレイする](/pluto-engine/demos/swarm-survivors/index.html)**

---

## 3. ⚡ 詳細ベンチマーク & プロファイラ

Steering アルゴリズム（Baseline / FastMath / FastIndex / Precomputed Bilinear）および AABB 枝刈り物理の内部詳細分解ベンチマークツールです。

👉 **[ベンチマークダッシュボードを開く](/pluto-engine/demos/benchmark/index.html)**

---

## ソースコード
すべてのデモのソースコードは、GitHub リポジトリの `apps/demo/` 内に公開されています。
- `apps/demo/rpg/`: 2D クラシックRPG
- `apps/demo/swarm-survivors/`: スウォームサバイバー
- `apps/demo/benchmark/`: プロファイラツール
