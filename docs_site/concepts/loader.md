# アセットローダー (Asset Loader)

PlutoEngine のアセットローダーは、シーンライフサイクルの `preload()` フックを通じたゲーム起動時の事前ロードと、実行時のゼロアロケーションを両立するように設計されています。

## preload() ライフサイクル

シーンは `preload()` → `create()` → `update()` の順で実行されます。テクスチャや音声などのリソースは `preload()` 内で宣言し、エンジンが完了を待ってから `create()` に進みます。

```typescript
export class GameScene extends Scene {
  preload(): void {
    // this.load.image() でテクスチャを登録
    this.load.image('player', '/assets/player.png');
    this.load.image('enemy', '/assets/enemy.png');
  }

  create(): void {
    // preload() 完了後に呼ばれる
    // this.textures でロード済みテクスチャにアクセス
    const player = this.add.sprite(400, 300, 32);
    player.setTexture('player');
  }
}
```

## TextureManager と LoaderManager

- **`LoaderManager` (`this.load`)**: `preload()` フェーズで `this.load.image(key, url)` を呼び出すことでテクスチャのロードをキューに積みます。
- **`TextureManager` (`this.textures`)**: ロード済みテクスチャを管理します。`this.textures.createCanvasTexture(key, canvas)` を使うと、`HTMLCanvasElement` から動的にテクスチャを生成することもできます。

## GPU Texture2DArray へのアップロード

ロードされた画像テクスチャは、`device.uploadTexture()` を通じて GPU の `Texture2DArray` にまとめてアップロードされます。

- 実行時は、SoAアリーナの中に「UV座標のオフセット」と「テクスチャレイヤーID」の整数のみが保存されます。
- 文字列によるアセットの検索（例: `getTexture("player")`）は初期化時のみ許可され、実行時は高速な数値IDアクセスのみが行われます。

## キャンバステクスチャの動的生成

手続き的に生成したテクスチャは `createCanvasTexture` で登録できます：

```typescript
preload(): void {
  // Canvas で手続き的に生成したテクスチャを登録
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#00ffcc';
  ctx.fillRect(0, 0, 32, 32);

  this.textures.createCanvasTexture('gem', canvas);
}
```
