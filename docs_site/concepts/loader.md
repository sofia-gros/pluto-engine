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
- **`TextureManager` (`this.textures`)**: ロード済みテクスチャを管理します。`this.textures.createTextureFromBuffer(key, buffer, width, height)` を使うと、メモリバッファから動的にテクスチャを生成することもできます。

## GPU Texture2DArray へのアップロード

ロードされた画像テクスチャは、`device.writeTexture()` を通じて GPU の `Texture2DArray` にまとめてアップロードされます。

- 実行時は、SoAアリーナの中に「UV座標のオフセット」と「テクスチャレイヤーID」の整数のみが保存されます。
- 文字列によるアセットの検索（例: `getTexture("player")`）は初期化時のみ許可され、実行時は高速な数値IDアクセスのみが行われます。

## メモリバッファからの動的テクスチャ生成

手続き的に生成したテクスチャは `createTextureFromBuffer` で登録できます：

```typescript
preload(): void {
  // Uint8Array のピクセルデータで動的にテクスチャを生成
  const width = 32;
  const height = 32;
  const buffer = new Uint8Array(width * height * 4);
  
  for (let i = 0; i < buffer.length; i += 4) {
    buffer[i] = 0;       // R
    buffer[i+1] = 255;   // G
    buffer[i+2] = 204;   // B
    buffer[i+3] = 255;   // A
  }

  this.textures.createTextureFromBuffer('gem', buffer, width, height);
}
```
