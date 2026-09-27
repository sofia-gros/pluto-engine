# はじめに

PlutoEngineは、ゼロアロケーションとデータ指向設計をコアに据えた次世代2Dゲームエンジンです。ブラウザ環境での極限のパフォーマンス（60FPS/144FPSの安定動作）を目指して設計されています。

## コアの特徴

- **Zero-Allocation**: 毎フレームのガベージコレクション（GC）スパイクを排除。
- **Structure of Arrays (SoA)**: メモリの局所性を高め、CPUキャッシュ効率を最大化。
- **WGSLファースト**: 最新のWebGPU向けにWGSLを採用し、WebGL2へのフォールバックもサポート。

## インストール

```bash
npm install pluto-engine
```

## 基本的な使い方

エンジンの初期化は非常にシンプルです：

```ts
import { PlutoEngine } from 'pluto-engine';

const engine = new PlutoEngine({ canvas: document.getElementById('app') });
engine.start();
```
