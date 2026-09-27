# TweenManager

エンティティのプロパティ（位置、スケール、アルファ値など）を時間経過とともに滑らかに変化させるシステムです。

## 概要 (Overview)

PlutoEngine のトゥイーンシステムは、大量のオブジェクトに対するアニメーションを同時に実行できるよう、データ指向で設計されています。

### アーキテクチャの内部設計
- **DOD 配列ベースの実装 (Array-based DOD)**: 各トゥイーンの進行状態、目標値、開始値などはすべて連続した TypedArray に格納されます。
- **オブジェクト生成ゼロ**: トゥイーンの追加時に設定オブジェクトのパースを行いますが、実行中（更新ループ）はオブジェクトのアロケーションを一切行いません。

## 使用例 (Usage)

```typescript
export class MainScene extends Scene {
  create() {
    const sprite = this.add.sprite(100, 100, 'box');

    this.tweens.add({
      targets: sprite,
      x: 500,
      y: 300,
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1 // 無限ループ
    });
  }
}
```

## パラメータ (Tween Configuration)

`this.tweens.add(config)` に渡す設定オブジェクトのプロパティです。

| パラメータ | 型 | デフォルト | 説明 |
| :--- | :--- | :--- | :--- |
| `targets` | `any \| Array<any>` | - | トゥイーンを適用する対象（スプライトなど）。配列で複数指定可能。 |
| `duration` | `number` | `1000` | アニメーションの持続時間（ミリ秒）。 |
| `ease` | `string` | `'Linear'` | イージング関数名（例: `'Power2'`, `'Bounce.out'`）。 |
| `delay` | `number` | `0` | アニメーション開始前の待機時間（ミリ秒）。 |
| `yoyo` | `boolean` | `false` | `true` の場合、逆再生して元の状態に戻ります。 |
| `repeat` | `number` | `0` | リピート回数。`-1` で無限ループ。 |
| `onComplete` | `Function` | `undefined` | トゥイーン完了時に呼ばれるコールバック。 |

## メソッド (Methods)

### `add(config)`
新しいトゥイーンを作成し、再生を開始します。

### `pauseAll()`
現在実行中のすべてのトゥイーンを一時停止します。

### `resumeAll()`
一時停止中のすべてのトゥイーンを再開します。
