# 第10章: ボス戦AI・ウェーブ完了とゲームループ

いよいよ最終章です。
第9章までで、数千体のモンスターの大群、自動攻撃兵器、`XPBDPlugin` による群衆物理、ジェム回収、HUD、そして効果音と画面振動を備えた本格ゲームの基礎がすべて完成しました。

第10章では、この大群サバイバーのクライマックスを飾る**巨大ボス「スウォーム・タイタン（Swarm Titan）」**を出現させ、**Utility AI によるマルチフェーズ行動パターン（突進・全方位弾幕・護衛召喚）**と、完全な勝敗判定（ゲームループ）を実装してゲームを完成させます。

---

## 1. ボス降臨の演出 (The Boss Arrival)

サバイバル時間が一定に達した時（または一定レベル到達時）、周囲の雑魚敵をすべて吹き飛ばす衝撃波とともに、画面外から巨大ボスが降臨します。
ここでも、`InstanceBufferArena` による SoA (Structure of Arrays) 操作を活用し、オブジェクトの生成・破棄によるガベージコレクション(GC)を回避します。

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
      // 物理制約と空間ハッシュの登録解除
      this.physics.removeBody(this.enemyIds[i]);
      this.morton.remove(this.enemyIds[i]);
      this.arena.free(this.enemyIds[i]);
    }
    this.enemyCount = 0;

    // 2. 画面上部から巨大ボスを生成 (サイズ 72px)
    this.bossId = this.arena.allocate();
    this.arena.posX[this.bossId] = 960 / 2;
    this.arena.posY[this.bossId] = -100;
    this.arena.scale[this.bossId] = 72;
    this.arena.tint[this.bossId] = 0xa855f7; // 妖しい魔界の紫
    
    // ボス用の物理ボディ登録 (XPBDPlugin)
    this.physics.addBody(this.bossId, { mass: 1000, radius: 36 });
    // ボス用の空間ハッシュ登録 (MortonPlugin)
    this.morton.insert(this.bossId, 960 / 2, -100, 36);

    // 3. ボスHPバーを表示
    this.bossHpText = this.add.text(960 / 2 - 120, 50, '--- SWARM TITAN: 1500 / 1500 ---', {
      fontSize: 16,
      color: 0xc084fc,
    });

    // 画面中央上部へ入場するTweenアニメーション (SoAベースのTween)
    this.tweens.add(this.bossId, TweenProperty.Y, -100, 120, 1200);

    console.log('警告: 巨大ボス [SWARM TITAN] が出現しました！');
  }
```

---

## 2. ボスの Utility AI パターン

ボスは単調に追尾するだけでなく、AIタイマーによって3つの異なる攻撃行動（フェーズ）を交互に繰り出します：

1. **フェーズ 0: 重力追尾 (Tracking)**: プレイヤーの周囲を巨大な体でじわじわと追い詰める。
2. **フェーズ 1: 超音速突進 (Dash Charge)**: プレイヤーの現在位置をロックオンし、画面端まで高速突進。
3. **フェーズ 2: 全方位弾幕ノヴァ (Radial Barrage)**: 立ち止まり、360度全方位へ16発の弾幕を発射。

`update()` ループ内で `new` キーワードを使用しないよう、算術演算はすべて基本型のまま処理します。

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

    // 移動後の空間ハッシュ(MortonPlugin)更新
    this.morton.update(this.bossId, this.arena.posX[this.bossId], this.arena.posY[this.bossId]);

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
      // 敵弾を生成 (SoA)
      const bulletId = this.arena.allocate();
      this.arena.posX[bulletId] = bx;
      this.arena.posY[bulletId] = by;
      this.arena.scale[bulletId] = 14;
      this.arena.tint[bulletId] = 0xf43f5e; // 危険なローズレッド
      
      // 速度ベクトルを設定して弾プール等に登録
      const vx = Math.cos(angle) * 300;
      const vy = Math.sin(angle) * 300;
      // ... 弾の移動処理用配列に登録 ...
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
      
      // 物理・ハッシュから除外してボスを消滅
      this.physics.removeBody(this.bossId);
      this.morton.remove(this.bossId);
      this.arena.free(this.bossId);
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

おめでとうございます。
数万体のモンスターが押し寄せる大群サバイバーゲームを、PlutoEngine v1.2.1 上で完全にゼロから構築しました。

このチュートリアルを通じて、現代のWebGPUゲームエンジンの技術を実践的に習得しました：

1. **ゼロアロケーション（Zero-Allocation）**: `new` の排除により実行時GCを完全に無くし、滑らかな描画を永続化。
2. **データ指向設計（SoA / Structure of Arrays）**: `InstanceBufferArena` による Float32Array バッファでのCPUキャッシュ局所性の最大化。
3. **WebGPU レンダリングと RenderGraph**: 高速なバッチ処理と最新のグラフィックスAPI(`createGraphicsDevice`)を活用した描画パイプライン。
4. **モートン空間ハッシュ（MortonPlugin）**: 空間分割とZオーダー曲線を用い、$O(N^2)$ の当たり判定を $O(1)$ スケールに短縮。
5. **XPBD（Extended Position Based Dynamics）**: `XPBDPlugin` による、数千体が重なり合わない安定したリアル群衆物理。
6. **Web Audio プロシージャル合成**: 外部ファイル不要のゼロ遅延サウンド。
7. **フライウェイト・パターン**: 開発者フレンドリーなAPIと高速内部処理の両立。

---

## 5. 次のステップ: あなたのゲームを世界へ

PlutoEngine をさらに発展させるためのアイデアをご紹介します：

- **カスタムスプライトシートのロード**: `this.load.image` でスプライトシートを読み込み、`this.textures` で管理してキャラクターに適用。
- **新しい武器の追加**: 稲妻チェーンライトニング、炎の結界、巨大鎌など。
- **ポアソンディスクサンプリング**: `@pluto-engine/poisson` で障害物（木や岩）を自然に配置。
- **Verlet IK 触手**: `@pluto-engine/verlet-ik` でボスにうねる多関節の触手を実装。

さらに詳しい技術仕様については、左サイドバーの **[コア概念](/concepts/engine-config)** や **[プラグイン](/plugins/xpbd)**、**[APIリファレンス](/api/pluto-engine)** をご覧ください。
