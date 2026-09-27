# PlutoEngine

PlutoEngine のコアとなるエンジンインスタンスです。設定オプション、初期化ライフサイクル、プラグインの登録などを管理します。
データ指向設計 (DOD: Data-Oriented Design) とゼロアロケーション (Zero-Allocation) を念頭に設計されており、1万体以上のエンティティをブラウザ上で安定したフレームレートで動作させることができます。

## 概要 (Overview)

`PlutoEngine` クラスはゲームループ、シーン管理、レンダリングシステムなどの初期化と制御を担います。

### アーキテクチャの内部設計
- **ゼロアロケーション**: 毎フレームのヒープメモリアロケーションを排除しています。
- **TypedArrays の活用**: コンポーネントデータは連続したメモリブロック (SoA: Structure of Arrays) に格納されます。これにより、キャッシュ効率が劇的に向上し、GC（ガベージコレクション）スパイクを防ぎます。

## インスタンス化 (Instantiation)

```typescript
import { PlutoEngine } from 'pluto-engine';

const config = {
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  fps: 60,
  plugins: [MyCustomPlugin]
};

const engine = new PlutoEngine(config);
engine.start();
```

## パラメータ (Parameters)

| パラメータ | 型 | デフォルト | 説明 |
| :--- | :--- | :--- | :--- |
| `config.width` | `number` | `800` | キャンバスの幅。 |
| `config.height` | `number` | `600` | キャンバスの高さ。 |
| `config.backgroundColor` | `string` | `'#000000'` | 背景色。 |
| `config.fps` | `number` | `60` | 目標とするフレームレート。 |
| `config.plugins` | `Array<any>` | `[]` | エンジン初期化時に登録するプラグインの配列。 |

## メソッド (Methods)

### `start()`
エンジンのゲームループを開始します。ゼロアロケーションループがここで発火します。

### `stop()`
エンジンのゲームループを停止します。

### `addScene(key, scene)`
シーンを登録します。

| パラメータ | 型 | 説明 |
| :--- | :--- | :--- |
| `key` | `string` | シーンを一意に識別するキー。 |
| `scene` | `Scene` | 登録するシーンのインスタンス、またはコンストラクタ。 |

## プロパティ (Properties)

- `width` (number): 現在のキャンバスの幅。
- `height` (number): 現在のキャンバスの高さ。
- `isRunning` (boolean): エンジンが実行中かどうか。
