# 第9章: 画面振動・フラッシュとサウンド演出

ゲーム開発において、真の「中毒性」と「爽快感」を決定づける最後のスパイスは、**画面の揺れ（スクリーンシェイク）、被弾時の閃光（ヒットフラッシュ）、そして耳に響く小気味よい効果音（SE）**です！

PlutoEngine v1.2.1 のアーキテクチャでは、**WebGPU** による描画レイヤーや **InstanceBufferArena** への SoA (Structure of Arrays) アクセスを活かし、パフォーマンスを一切犠牲にすることなく極上の演出を実現します。

第9章では、外部のアセットファイル（MP3やWAV）を一切ロードすることなく、ブラウザ標準の **Web Audio API によるゼロ遅延・プロシージャル効果音生成** と、**非線形カメラトラウマによる画面振動システム** を組み込みます！

---

## 1. 非線形カメラトラウマ (Screen Shake) の実装

画面を揺らす際、単純にランダムな値を足すだけでは安っぽく感じられます。近代的なゲーム開発では、**トラウマ（Trauma）を2乗して揺れ幅を計算する非線形減衰モデル**が広く使われます。

```typescript
export class SwarmSurvivorScene extends Scene {
  // ... 前章までのプロパティ ...

  // 画面振動 (Trauma) 変数
  private cameraTrauma = 0; // 0.0 〜 1.0
  private readonly maxShakeOffset = 18; // 最大揺れ幅 (px)
  private readonly traumaDecay = 1.8;   // 1秒あたりの減衰率

  /**
   * 画面の揺れ衝撃を加える
   * @param amount 衝撃量 (0.1 〜 0.5)
   */
  public addTrauma(amount: number): void {
    this.cameraTrauma = Math.min(1.0, this.cameraTrauma + amount);
  }

  /**
   * カメラの揺れを更新
   */
  private updateCameraShake(dt: number): void {
    if (this.cameraTrauma > 0) {
      // 減衰
      this.cameraTrauma = Math.max(0, this.cameraTrauma - this.traumaDecay * dt);

      // 非線形シェイク強度 (trauma の 2 乗)
      const shake = this.cameraTrauma * this.cameraTrauma * this.maxShakeOffset;

      // WebGPUのRenderGraphに渡すカメラ座標を振動させる
      this.camera.x = (Math.random() * 2 - 1) * shake;
      this.camera.y = (Math.random() * 2 - 1) * shake;
    } else {
      this.camera.x = 0;
      this.camera.y = 0;
    }
  }
```

敵に強力な一撃が当たったときや、プレイヤーが被弾したときに `this.addTrauma(0.15)` を呼び出します。毎フレーム呼ばれる `update` 内で `new` によるオブジェクト生成は一切行わず、ゼロアロケーションを徹底しています！

---

## 2. 被弾時の閃光 (Hit Flash)

敵に攻撃が当たった瞬間に、敵のスプライト色を**純白 (0xffffffff)** に切り替え、数フレーム後に元の赤色に戻すことで、圧倒的な打撃感を生み出します。v1.2.1 では `InstanceBufferArena` の SoA (Structure of Arrays) 構造を直接操作します。

```typescript
  public damageEnemy(enemyIndex: number, amount: number): void {
    const id = this.enemyIds[enemyIndex];

    // InstanceBufferArena (SoA) の Uint32Array を直接書き換えて純白に光らせる
    this.arena.tints[id] = 0xffffffff;

    // Tweenを使って元の赤色 (0xef4444) に戻す (80ms)
    // 内部ではフライウェイト(Flyweight)パターンによりゼロアロケーションで処理されます
    this.tweens.add({
  targets: { id: id },
  props: { tint: 0xef4444 },
  duration: 80
});

    // 画面をごくわずかに揺らす
    this.addTrauma(0.04);

    // ... XPBDPluginによる衝撃伝播やダメージ処理 ...
  }
```

---

## 3. Web Audio API による完全アセットレス効果音

重いオーディオファイルをダウンロードさせるとロード待ちが発生します。ここでは、Web Audio API のオシレーター（発振器）を使って、**ゼロバイトで超軽量・ゼロ遅延の効果音シンセサイザー**を作ります！

```typescript
/**
 * ゼロ遅延・プロシージャル効果音シンセサイザー
 */
class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * 敵への打撃音 (ノイズと急激な周波数ドロップ)
   */
  public playHit(): void {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  /**
   * ジェム回収音 (ピロリンと上がる高音チャイム)
   */
  public playGem(): void {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  }

  /**
   * レベルアップ・ファンファーレ
   */
  public playLevelUp(): void {
    const ctx = this.getContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + i * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }
}
```

これをシーン内に `private sfx = new SoundEffects();` として一度だけ保持し：
- 敵に攻撃が当たった時: `this.sfx.playHit();`
- ジェムを拾った時: `this.sfx.playGem();`
- レベルアップした時: `this.sfx.playLevelUp();`
を呼び出すだけで、外部ファイルなしで気持ちのいいアーケードサウンドが鳴り響きます！

---

## 4. リアルタイム・パフォーマンスモニターの追加

画面の右上に、現在のFPS（フレームレート）と、アクティブなエンティティ総数を表示するパフォーマンスカウンターを設置します。PlutoEngine v1.2.1 の MortonPlugin (空間ハッシュ) と XPBDPlugin (物理演算) がどれほど高速か確認しましょう。

```typescript
  private fpsCounterText!: Text;

  private initPerformanceMonitor(): void {
    this.fpsCounterText = this.add.text(960 - 220, 20, 'FPS: 60 | ENTITIES: 0', {
      fontSize: 14,
      color: 0x4ade80, // 明るいグリーン
    });
  }

  private updatePerformanceMonitor(): void {
    // InstanceBufferArena の現在アクティブなスプライト総数を取得
    const activeEntities = this.arena.activeCount;
    const currentFps = Math.round(1 / (this.time.delta || 0.016));

    this.fpsCounterText.text = `FPS: ${currentFps} | ACTIVE: ${activeEntities}`;
  }
```

---

## 5. 動作確認

ゲームを起動してみましょう！

敵を斬りつけるたびに画面が心地よく震え、純白のフラッシュが瞬き、小気味よい打撃音が連打されます。
ジェムを連続で吸い込むと「ピロロロロ！」と気持ちいいハイトーンが響き渡り、レベルアップ時には輝かしいコードが鳴り響きます。

右上のカウンターには、**数千体のエンティティがひしめき合っているにもかかわらず、WebGPU バックエンドにより堂々と 60FPS / 144FPS を維持している証拠**が表示されているはずです！

いよいよ物語はクライマックスへ突入します。
最終第10章では、画面全体を埋め尽くす弾幕と突進攻撃を繰り出す**巨大ボスモンスター（Swarm Titan）**を降臨させ、ゲームを勝利・ゲームオーバーの完全なループとして完結させます！
