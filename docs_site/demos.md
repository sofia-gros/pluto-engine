# 🎮 PlutoEngine デモ一覧

PlutoEngine の圧倒的なパフォーマンス（10万体描画・ゼロアロケーション）をブラウザ上で実際に体験できるデモです。

## 1. Swarm Survivors (Vampire Survivors クローン)

10,000体以上の敵がシームレスに出現し、Continuum Crowds (ポアソン群集流体) や XPBD物理によって滑らかに押し寄せるデモゲームです。
画面揺らし、MSDFフォント、インスタンシング描画のすべてが組み込まれています。

**[👉 Swarm Survivors をプレイする](/pluto-engine/demos/swarm-survivors/index.html)**

> ※ご注意: デモは別画面（フルブラウザ）で開きます。スマホでも動作するようにスケーリングされますが、PCでの閲覧を推奨します。

---

## ソースコード
このデモのソースコードは、GitHub リポジトリの `apps/demo/swarm-survivors/` 内にすべて公開されています。Phaser などのエンジンに似たプラグインアーキテクチャ（`this.add.sprite`, `this.registerPlugin`）で、これほど巨大なスケールのゲームが非常に簡潔に書かれていることを確認できます。
