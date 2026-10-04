# 第6章: XPBDによる群衆のめり込み防止物理

第5章までで、プレイヤーの自動攻撃兵器によって無数の敵をなぎ倒せるようになりました。
しかし、画面をよく見ると不自然な点があります。**敵同士が衝突判定を持たないため、何千体ものモンスターが完全に重なり合い、まるで1個の点のように縮んでしまう「重なり問題（Clumping Issue）」**です。

群衆が1点に集まってしまうと、せっかくの「大群」の迫力が台無しになってしまいます。

第6章では、PlutoEngine の誇る高速物理演算プラグイン **`XPBDPlugin`**（Extended Position Based Dynamics）と、モートン符号を用いた超高速空間分割プラグイン **`MortonPlugin`** を活用し、**数千体のモンスターがお互いを自然に押し合い、流体のように蠢く有機的な群衆物理（Anti-Clustering）**を実装します！

---

## 1. なぜ従来の力学（Force-Based）ではなく XPBD なのか？

Box2D などの従来の物理エンジンは、衝突時に「反発力（Force）」を計算して速度を積分します。しかし、数千体が密集する満員電車のような過密状態では：
- 力が累積してオブジェクトが画面外へ弾け飛ぶ（物理爆発）
- 振動（ジッター）が止まらなくなる
- 莫大な計算コストがかかる

一方、**XPBD（位置ベース動力学）**は、**「重なり合っている距離の分だけ、直接位置（Position）を押し戻す（Solve）」**アプローチをとります。
どれほど高密度に敵が密集しても絶対に発散（爆発）せず、極めて安定したシミュレーションを維持できます。PlutoEngine v1.2.1 ではこれが `XPBDPlugin` として標準搭載されています。

---

## 2. MortonPlugin と XPBDPlugin の導入

v1.2.1 の新アーキテクチャでは、物理演算をプラグインとしてシーンに追加します。衝突判定を高速化するためには、モートン符号（Morton Code）ベースの空間ハッシュである `MortonPlugin` を併用します。

```typescript
import { Scene, XPBDPlugin, MortonPlugin, InstanceBufferArena } from 'pluto-engine';

export class SwarmSurvivorScene extends Scene {
  private morton!: MortonPlugin;
  private xpbd!: XPBDPlugin;
  private arena!: InstanceBufferArena;

  onAwake(): void {
    // 1. SoAベースのインスタンスアリーナを初期化
    this.arena = new InstanceBufferArena(10000);

    // 2. モートン符号による空間分割プラグインを追加
    this.morton = this.registerPlugin(new MortonPlugin({ arena: this.arena }));

    // 3. XPBDプラグインを追加し、空間分割を紐付け
    this.xpbd = this.registerPlugin(new XPBDPlugin({ 
      morton: this.morton,
      iterations: 2 // 押し戻しの反復回数（多いほど硬い剛体になる）
    }));
  }
```

---

## 3. 敵とプレイヤーを物理システムに登録

`XPBDPlugin` にオブジェクトを認識させるには、SoAバッファのインデックス（ID）を使ってボディ（Body）を登録します。
ここでは、オブジェクト指向の `new` を更新ループ内で使わず、Zero-Allocation の思想に従います。

```typescript
  /**
   * 敵をスポーンして物理システムに登録
   */
  private spawnEnemy(x: number, y: number): void {
    const id = this.arena.allocate();
    this.arena.posX[id] = x;
    this.arena.posY[id] = y;

    // 半径9pxの動的オブジェクトとして登録
    this.xpbd.addBody(id, { 
      radius: 9, 
      isStatic: false,
      layer: 'enemy'
    });
  }

  /**
   * プレイヤーの登録
   */
  private setupPlayer(x: number, y: number): void {
    const id = this.arena.allocate();
    this.arena.posX[id] = x;
    this.arena.posY[id] = y;

    // プレイヤーは半径14px
    this.xpbd.addBody(id, { 
      radius: 14, 
      isStatic: false,
      layer: 'player' 
    });
  }
```

---

## 4. 衝突判定と押し戻しの自動化

以前のバージョンでは手動で `solveCrowdOverlap` のようなメソッドを書き、ループ内で直接反発計算を行っていましたが、v1.2.1 では `XPBDPlugin` がこれを完全に自動化します。
`fixedUpdate` で手動で計算を呼ぶ必要はありません。

また、プレイヤーと敵が衝突した際のダメージ処理などは、プラグインのイベントリスナーを用いて実装できます。

```typescript
  onStart(): void {
    // プレイヤーと敵が衝突した時のコールバックを登録
    this.xpbd.onCollision('player', 'enemy', (playerId, enemyId, overlap) => {
      // プレイヤーに微小ダメージ
      this.playerHp -= 0.1;
    });
  }
```

内部的には、Flyweight パターンと Float32Array（SoA）を利用しているため、毎フレーム数千回の衝突判定が発生しても、オブジェクトのメモリ確保（`new`）は一切行われず、ガベージコレクション（GC）のスパイクによるカクつき（Stutter）も防げます。

---

## 5. 動作確認: 蠢く生きた群衆！

ブラウザを更新してプレイしてみてください。

数千体の赤いモンスターたちが、**お互いの体を押し合い、プレイヤーの周囲に巨大な円陣を作りながら押し寄せてくる**はずです！
狭い通路を抜ける液体のように、モンスターが自然に回り込んでくるリアルな群衆挙動が、一切のフレーム低下なしに WebGPU バックエンド上で実現しました。

敵を倒し、群衆を押し返せるようになりましたが、ゲームには「報酬」が必要です。
続く第7章では、敵が倒れた場所にドロップする**経験値ジェム（XP Gems）と、プレイヤーのレベルアップシステム**を実装します！
