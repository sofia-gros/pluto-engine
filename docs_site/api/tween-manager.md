# TweenManager API リファレンス

`TweenManager` は、ゼロアロケーションを目指したデータ指向 (SoA) のトゥイーンシステムです。
アリーナ内のエンティティのプロパティを直接書き換え、GCスパイクを発生させずに数千のオブジェクトをアニメーションさせます。

## 概要

`Scene` の `tweens` プロパティからアクセスします。

```typescript
this.tweens.add({
  targets: sprite,
  props: { x: 500, alpha: 0 },
  duration: 1000,
  ease: 'Sine.easeInOut',
  yoyo: true
});
```

## メソッド

### `add(config: TweenConfig): Tween`
単一のトゥイーンを追加します。
設定に従ってプロパティの補間をスケジューリングします。戻り値として `Tween` ハンドル（Flyweight）を返します。

### `chain(configs: TweenConfig[]): Tween`
複数のトゥイーン設定を順番に実行するチェーンを作成します。前の設定が完了してから次が開始されます。

### `killTweensOf(target: TweenTarget | number): number`
指定した対象（エンティティIDまたはターゲットオブジェクト）が持つトゥイーンをすべて停止・解放します。

### `killTweensOfGroup(group: number | Tween): number`
グループID指定、または `Tween` ハンドルを指定して、関連するトゥイーンをすべて停止します。

## TweenConfig インターフェース

トゥイーンの設定オブジェクトです。

- `targets: TweenTarget | TweenTarget[]`
  対象のオブジェクト（または配列）。`id` プロパティを持つ必要があります。
- `props: Record<string, number>`
  補間するプロパティと目標値。対応プロパティ: `x`, `y`, `scale`, `scaleX`, `scaleY`, `tint`, `alpha`, `rotation`, `angle`, `flipX`
- `duration?: number`
  所要時間（ミリ秒）。デフォルトは 1000。
- `delay?: number`
  開始までの遅延（ミリ秒）。
- `ease?: string`
  イージング名（例: `'Cubic.easeOut'`, `'Quad.easeIn'`）。
- `yoyo?: boolean`
  往復再生するかどうか。
- `repeat?: number`
  繰り返し回数（-1 は無限、0 は 1 回のみ）。
- `onStart?: () => void`
  開始時に 1 度だけ呼ばれるコールバック。
- `onUpdate?: () => void`
  毎フレーム呼ばれるコールバック。
- `onComplete?: () => void`
  完了時に 1 度だけ呼ばれるコールバック。

## Tween ハンドルの操作

`add` や `chain` が返す `Tween` オブジェクトを通じて、再生中のトゥイーンを制御できます。

- `isPlaying(): boolean`
- `isPaused(): boolean`
- `pause(): void`
- `resume(): void`
- `stop(): void`
- `seek(ms: number): void`
- `progress: number` (Getter) - 現在の進行度(0〜1)
