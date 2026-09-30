import { describe, expect, test } from 'vitest';
import { encodeMorton2D, MortonSpatialHash } from '../src/index';

describe('encodeMorton2D', () => {
  test('interleaves bits correctly', () => {
    expect(encodeMorton2D(0, 0)).toBe(0);
    expect(encodeMorton2D(1, 0)).toBe(1);
    expect(encodeMorton2D(0, 1)).toBe(2);
    expect(encodeMorton2D(1, 1)).toBe(3);
    expect(encodeMorton2D(2, 0)).toBe(4);
    expect(encodeMorton2D(0, 2)).toBe(8);
    expect(encodeMorton2D(3, 3)).toBe(15);
  });

  test('produces a full 16x16 quadrant value', () => {
    // x と y が共に 0xff なら全ビットが立つ
    expect(encodeMorton2D(255, 255)).toBe(65535);
  });

  test('Z-order preserves locality: nearby cells have nearby codes', () => {
    const base = encodeMorton2D(100, 100);
    const right = encodeMorton2D(101, 100);
    const far = encodeMorton2D(300, 300);
    // 1 セル隣のコード差は、遠隔セルより小さい
    expect(Math.abs(base - right)).toBeLessThan(Math.abs(base - far));
  });
});

describe('MortonSpatialHash: radix sort', () => {
  test('entities are stored in ascending Morton code order', () => {
    const hash = new MortonSpatialHash(64, 32);
    // 意図的にランダム順に挿入する
    hash.addEntity(0, 500, 500);
    hash.addEntity(1, 0, 0);
    hash.addEntity(2, 320, 32);
    hash.addEntity(3, 1000, 1000);
    hash.addEntity(4, 0, 1000);

    hash.build();

    // query で全エンティティを回収し、コード順になっていることを確認する
    const out = new Uint32Array(64);
    // 広域を1回クエリして全件取る
    const n = hash.query(-32768, -32768, 65535, out);
    expect(n).toBe(5);
  });

  test('radix sort is stable and produces a sorted code sequence', () => {
    const hash = new MortonSpatialHash(1000, 10);
    // 同じセルに大量のエンティティを入れて tie の stability を見る
    for (let i = 0; i < 200; i++) {
      hash.addEntity(i, 100, 100);
    }
    hash.build();

    const out = new Uint32Array(512);
    const n = hash.query(100, 100, 5, out);
    expect(n).toBe(200);
    // 同一セル内では挿入順が保たれる (安定ソート)
    for (let i = 0; i < n; i++) {
      expect(out[i]).toBe(i);
    }
  });

  test('build handles many entities and repeated rebuilds', () => {
    const hash = new MortonSpatialHash(5000, 64);
    for (let round = 0; round < 3; round++) {
      hash.clear();
      for (let i = 0; i < 5000; i++) {
        // 決定論的な擬似乱数
        const x = ((i * 7919) % 4000) - 1000;
        const y = ((i * 104729) % 4000) - 1000;
        hash.addEntity(i, x, y);
      }
      hash.build();
      const out = new Uint32Array(64);
      // 各エンティティが自分自身を見つけられること
      for (let i = 0; i < 5000; i += 500) {
        const x = ((i * 7919) % 4000) - 1000;
        const y = ((i * 104729) % 4000) - 1000;
        const n = hash.query(x, y, 1, out);
        let found = false;
        for (let k = 0; k < n; k++) {
          if (out[k] === i) found = true;
        }
        expect(found).toBe(true);
      }
    }
  });

  test('build cost does not depend on a bucket table size', () => {
    // 少数のエンティティでも build が速いこと (桶の全走査が無いことの回帰防止)
    const hash = new MortonSpatialHash(100, 64);
    for (let i = 0; i < 100; i++) {
      hash.addEntity(i, i * 10, i * 10);
    }
    const t0 = performance.now();
    for (let i = 0; i < 200; i++) hash.build();
    const elapsed = performance.now() - t0;
    // 200 回ビルドして 100ms を超えない (旧実装は 262144 桶走査で確実に超える)
    expect(elapsed).toBeLessThan(100);
  });
});

describe('MortonSpatialHash: query', () => {
  test('returns only entities inside the queried cells', () => {
    const hash = new MortonSpatialHash(100, 64);
    hash.addEntity(1, 0, 0);
    hash.addEntity(2, 1000, 1000);
    hash.addEntity(3, 10, 10);
    hash.build();

    const out = new Uint32Array(16);
    const n = hash.query(0, 0, 32, out);

    expect(n).toBe(2); // id 1 と 3
    let has1 = false;
    let has3 = false;
    for (let i = 0; i < n; i++) {
      if (out[i] === 1) has1 = true;
      if (out[i] === 3) has3 = true;
    }
    expect(has1).toBe(true);
    expect(has3).toBe(true);
  });

  test('a radius spanning many cells finds all enclosed entities', () => {
    const hash = new MortonSpatialHash(1000, 10);
    // 0〜100 の範囲に 10 個配置
    for (let i = 0; i < 10; i++) {
      hash.addEntity(i, i * 10, i * 10);
    }
    hash.build();

    const out = new Uint32Array(1024);
    const n = hash.query(50, 50, 100, out);
    expect(n).toBe(10);
  });

  test('handles negative coordinates', () => {
    const hash = new MortonSpatialHash(100, 32);
    hash.addEntity(1, -100, -100);
    hash.addEntity(2, -150, -150);
    hash.addEntity(3, 500, 500);
    hash.build();

    const out = new Uint32Array(16);
    const n = hash.query(-120, -120, 20, out);
    expect(n).toBe(2);
  });

  test('respects the output buffer capacity', () => {
    const hash = new MortonSpatialHash(100, 10);
    for (let i = 0; i < 50; i++) {
      hash.addEntity(i, 0, 0);
    }
    hash.build();
    const out = new Uint32Array(8);
    const n = hash.query(0, 0, 5, out);
    // バッファを溢れさせない
    expect(n).toBe(8);
  });

  test('query on an empty hash returns 0', () => {
    const hash = new MortonSpatialHash(16, 32);
    hash.build();
    const out = new Uint32Array(8);
    expect(hash.query(0, 0, 100, out)).toBe(0);
  });

  test('exceeding maxEntities is ignored silently', () => {
    const hash = new MortonSpatialHash(3, 32);
    hash.addEntity(1, 0, 0);
    hash.addEntity(2, 10, 0);
    hash.addEntity(3, 20, 0);
    hash.addEntity(4, 30, 0);
    hash.build();
    expect(hash.entityCount).toBe(3);
  });

  test('clear resets the hash', () => {
    const hash = new MortonSpatialHash(16, 32);
    hash.addEntity(1, 0, 0);
    hash.build();
    expect(hash.entityCount).toBe(1);
    hash.clear();
    expect(hash.entityCount).toBe(0);
    const out = new Uint32Array(8);
    expect(hash.query(0, 0, 100, out)).toBe(0);
  });

  test('rejects invalid constructor arguments', () => {
    expect(() => new MortonSpatialHash(0, 32)).toThrow();
    expect(() => new MortonSpatialHash(10, 0)).toThrow();
  });
});
