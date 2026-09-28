import { expect, test } from 'vitest';
import { ENGINE_VERSION } from '../src/index';

/**
 * エンジンの基本情報テスト
 */
test('ENGINE_VERSION should be defined', () => {
  expect(ENGINE_VERSION).toBe('1.1.0');
});

// モックなしで実際のDOM APIが呼べるかのテスト（Browser modeの確認）
test('DOM API is available in tests', () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');

  // ブラウザ環境であれば、getContext('webgl2') が null になる（ハードウェア支援がない場合など）か、
  // WebGL2RenderingContext を返す。いずれにせよ document は存在する。
  expect(document).toBeDefined();
});
