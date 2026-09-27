# 第10章: ボス戦AI・ウェーブ完了とゲームループ

いよいよ最終章です！🏆
第9章までで、数千体のモンスターの大群、自動攻撃兵器、XPBD群衆物理、ジェム回収、HUD、そして効果音と画面振動を備えた本格ゲームの基礎がすべて完成しました。

第10章では、この大群サバイバーのクライマックスを飾る**巨大ボス「スウォーム・タイタン（Swarm Titan）」**を出現させ、**Utility AI によるマルチフェーズ行動パターン（突進・全方位弾幕・護衛召喚）**と、完全な勝敗判定（ゲームループ）を実装してゲームを完成させます！

---

## 1. ボス降臨の演出 (The Boss Arrival)

サバイバル時間が一定に達した時（または一定レベル到達時）、周囲の雑魚敵をすべて吹き飛ばす衝撃波とともに、画面外から巨大ボスが降臨します！

```typescript
export class SwarmSurvivorScene extends Scene {
  // ... 前章までのプロパティ ...

  // ボス管理
  private bossActive = false;
  private bossId = -1;
  private bossHp = 0;
  private readonly bossMaxHp = 1500;
  private bossAiTimer = 0;
  private bossPhase = 0; // 0: 追跡, 1: 突進チャージ, 2: 弾幕ノヴァ

  // ボスHPゲージ用テキスト
  private bossHpText!: Text;

  /**
   * ボスを降臨させる
   */
  private spawnBoss(): void {
    this.bossActive = true;
    this.bossHp = this.bossMaxHp;

    // 1. 周囲の雑魚敵を一掃する衝撃波 (カメラトラウマ最大)
    this.addTrauma(0.8);
    for (let i = this.enemyCount - 1; i >= 0; i--) {
      this.arena.free(this.enemyIds[i]);
    }
    this.enemyCount = 0;

    // 2. 画面上部から巨大ボスを生成 (サイズ 72px)
    const bossSprite = this.add.sprite(960 / 2, -100, 72);
    // 妖しい魔界の紫 (0xa855f7)
    bossSprite.setTint(0xa855f7);
    this.bossId = bossSprite.id;

    // 3. ボスHPバーを表示
    this.bossHpText = this.add.text(960 / 2 - 120, 50, '--- SWARM TITAN: 1500 / 1500 ---', {
      fontSize: 16,
      color: 0xc084fc,
    });

    // 画面中央上部へ入場するTweenアニメーション
    this.tweens.add(this.bossId, TweenProperty.Y, -100, 120, 1200);

    console.log('⚠️ 警告: 巨大ボス [SWARM TITAN] が出現しました！');
  }
```

---

## 2. ボスの Utility AI パターン

ボスは単調に追尾するだけでなく、AIタイマーによって3つの異なる攻撃行動（フェーズ）を交互に繰り出します：

1. **フェーズ 0: 重力追尾 (Tracking)**: プレイヤーの周囲を巨大な体でじわじわと追い詰める。
2. **フェーズ 1: 超音速突進 (Dash Charge)**: プレイヤーの現在位置をロックオンし、画面端まで高速突進！
3. **フェーズ 2: 全方位弾幕ノヴァ (Radial Barrage)**: 立ち止まり、360度全方位へ16発の弾幕を発射！

```typescript
  private updateBossAI(dt: number): void {
    if (!this.bossActive) return;

    this.bossAiTimer += dt;
    const bx = this.arena.posX[this.bossId];
    const by = this.arena.posY[this.bossId];
    const px = this.player.x;
    const py = this.player.y;

    // 3秒ごとにフェーズを切り替え
    if (this.bossAiTimer >= 3.0) {
      this.bossAiTimer = 0;
      this.bossPhase = (this.bossPhase + 1) % 3;

      if (this.bossPhase === 2) {
        // フェーズ 2: 16方向放射弾幕を発射！
        this.fireBossRadialBarrage(bx, by);
      }
    }

    // フェーズごとの行動
    if (this.bossPhase === 0) {
      // 通常追跡
      const dx = px - bx;
      const dy = py - by;
      const dist = Math.hypot(dx, dy);
      if (dist > 1.0) {
        const speed = 70 * dt;
        this.arena.posX[this.bossId] += (dx / dist) * speed;
        this.arena.posY[this.bossId] += (dy / dist) * speed;
      }
    } else if (this.bossPhase === 1) {
      // 突進 (プレイヤー方向へ高速移動)
      const dx = px - bx;
      const dy = py - by;
      const dist = Math.hypot(dx, dy);
      if (dist > 1.0) {
        const dashSpeed = 220 * dt;
        this.arena.posX[this.bossId] += (dx / dist) * dashSpeed;
        this.arena.posY[this.bossId] += (dy / dist) * dashSpeed;
      }
    }

    // ボスHP表示の更新
    this.bossHpText.text = `--- SWARM TITAN: ${Math.max(0, Math.ceil(this.bossHp))} / ${this.bossMaxHp} ---`;
  }

  /**
   * ボスの全方位弾幕 (16方向)
   */
  private fireBossRadialBarrage(bx: number, by: number): void {
    this.addTrauma(0.3);
    const numBullets = 16;
    for (let i = 0; i < numBullets; i++) {
      const angle = (i * Math.PI * 2) / numBullets;
      // 敵弾を生成
      const bullet = this.add.sprite(bx, by, 14);
      bullet.setTint(0xf43f5e); // 危険なローズレッド
      // ... 弾プールに登録して射出 ...
    }
  }
```

---

## 3. 勝敗判定と完全なゲームループ

ボスを撃破した際の「VICTORY（完全勝利）」と、プレイヤーのHPが尽きた際の「GAME OVER」を実装します。

```typescript
  // ゲームオーバー/クリア判定
  private isGameOver = false;

  private checkGameConditions(): void {
    if (this.isGameOver) return;

    // 1. プレイヤー死亡
    if (this.playerHp <= 0) {
      this.isGameOver = true;
      this.add.text(960 / 2 - 150, 540 / 2 - 40, 'GAME OVER', {
        fontSize: 48,
        color: 0xef4444,
      });
      this.add.text(960 / 2 - 130, 540 / 2 + 30, 'Press SPACE to Restart', {
        fontSize: 20,
        color: 0xffffff,
      });
      return;
    }

    // 2. ボス撃破 (勝利！)
    if (this.bossActive && this.bossHp <= 0) {
      this.isGameOver = true;
      this.arena.free(this.bossId); // ボスを消滅
      this.bossActive = false;

      this.addTrauma(1.0); // 最大の画面揺れ！
      this.sfx.playLevelUp(); // 勝利ファンファーレ

      this.add.text(960 / 2 - 140, 540 / 2 - 40, 'VICTORY!', {
        fontSize: 48,
        color: 0xfacc15, // 輝く黄金色
      });
      this.add.text(960 / 2 - 160, 540 / 2 + 30, 'You survived the Swarm Titan!', {
        fontSize: 20,
        color: 0x38bdf8,
      });
    }

    // スペースキーでリスタート
    if (this.isGameOver && this.input.isKeyJustPressed('Space')) {
      // シーンを再起動
      this.scene.start('SwarmSurvivorScene');
    }
  }
```

---

## 4. チュートリアル完結！学んだことの振り返り

🎉 **おめでとうございます！**
あなたは、数万体のモンスターが蠢く本格的な大群サバイバーゲームを、PlutoEngine 上で完全にゼロから構築しました！

このチュートリアルを通じて、現代ゲームエンジンの最先端技術を実践的に習得しました：

1. **ゼロアロケーション（Zero-Allocation）**: 実行時GCを完全に排除し、滑らかな描画を永続化。
2. **データ指向設計（SoA / Structure of Arrays）**: `InstanceBufferArena` による驚異的なCPUキャッシュ局所性。
3. **フライウェイト・ハンドル（Flyweight Pattern）**: 開発者フレンドリーなAPIと高速内部処理の両立。
4. **モートン空間ハッシュ（Morton Spatial Partitioning）**: $O(N^2)$ の当たり判定を $O(1)$ に短縮。
5. **XPBD（Extended Position Based Dynamics）**: 数千体が重なり合わない安定したリアル群衆物理。
6. **Web Audio プロシージャル合成**: 外部ファイル不要のゼロ遅延サウンド。
7. **SoA Tween & SDF テキスト**: 演出と情報表示をGCフリーで完結。

---

## 5. 次のステップ: あなたのゲームを世界へ！

PlutoEngine の可能性は無限大です。ここからさらに発展させるためのアイデアをご紹介します：

- 🎨 **カスタムスプライトシートのロード**: `this.load.image` で美しいドット絵キャラクターを適用。
- ⚔️ **新しい武器の追加**: 稲妻チェーンライトニング、炎の結界、巨大鎌など。
- 🧪 **ポアソンディスクサンプリング**: `@pluto-engine/poisson` で障害物（木や岩）を自然に配置。
- 🦾 **Verlet IK 触手**: `@pluto-engine/verlet-ik` でボスにうねる多関節の触手を実装。

さらに詳しい技術仕様については、左サイドバーの **[コア概念](/concepts/engine-config)** や **[プラグイン](/plugins/xpbd)**、**[APIリファレンス](/api/pluto-engine)** をご覧ください。

あなたの創る素晴らしいゲームの世界を、PlutoEngine は全力でサポートします！🚀
