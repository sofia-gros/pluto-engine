import { describe, expect, test } from 'vitest';
import { createGraphicsDevice } from '../src/index';
import { alignBufferSize } from '../src/WebGPUDevice';

/**
 * 注意: このファイルは WebGL / WebGPU のコンテキストを生成しません。
 * テストブラウザのコンテキスト上限がほぼ埋まっているため、
 * 実機でのコンテキスト生成を伴う検証は
 * scripts/smoke-test.mjs (Playwright + GPU 有効) 側で行います。
 */

/**
 * WebGPU が本当に使えるかを調べます。
 * navigator.gpu が存在してもアダプタが取得できない環境
 * (ヘッドレス Chromium など) があるため、アダプタまで取得して判定します。
 */
async function probeWebGPU(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.gpu) return false;
  try {
    const adapter = await navigator.gpu.requestAdapter();
    return adapter !== null;
  } catch {
    return false;
  }
}

describe('createGraphicsDevice: forced webgpu without an adapter', () => {
  test('rejects instead of silently falling back', async () => {
    const hasWebGPU = await probeWebGPU();
    if (hasWebGPU) {
      // アダプタがある環境では生成できます
      return;
    }
    // navigator.gpu が無い、またはアダプタが取れない場合は
    // 明示指定した backend を勝手に差し替えず、例外にします
    await expect(
      createGraphicsDevice(document.createElement('canvas'), { backend: 'webgpu' }),
    ).rejects.toThrow();
  });
});

describe('alignBufferSize', () => {
  test('rounds up to a multiple of 4', () => {
    expect(alignBufferSize(4)).toBe(4);
    expect(alignBufferSize(6)).toBe(8);
    expect(alignBufferSize(1)).toBe(4);
    expect(alignBufferSize(16)).toBe(16);
    expect(alignBufferSize(17)).toBe(20);
  });

  test('handles zero and negative sizes without crashing', () => {
    expect(alignBufferSize(0)).toBe(0);
    expect(Number.isFinite(alignBufferSize(-3))).toBe(true);
  });

  test('the result is always 4-byte aligned', () => {
    for (let i = 0; i < 40; i++) {
      expect(alignBufferSize(i) % 4).toBe(0);
    }
  });
});
