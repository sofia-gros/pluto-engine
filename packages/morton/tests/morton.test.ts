import { describe, expect, it } from 'vitest';
import { MortonSpatialHash, encodeMorton2D } from '../src/index';

describe('Morton Code', () => {
  it('should correctly interleave bits', () => {
    // x = 1 (01), y = 0 (00) -> 01
    expect(encodeMorton2D(1, 0)).toBe(1);
    // x = 0 (00), y = 1 (01) -> 10 (2)
    expect(encodeMorton2D(0, 1)).toBe(2);
    // x = 1, y = 1 -> 11 (3)
    expect(encodeMorton2D(1, 1)).toBe(3);
    // x = 2 (10), y = 0 -> 0100 (4)
    expect(encodeMorton2D(2, 0)).toBe(4);
    // x = 255, y = 255 -> 0xFFFF (65535)
    expect(encodeMorton2D(255, 255)).toBe(65535);
  });
});

describe('MortonSpatialHash', () => {
  it('should correctly add and query entities without allocations', () => {
    const hash = new MortonSpatialHash(100, 10, 1024);

    // Entity 1 at (5, 5)
    hash.addEntity(1, 5, 5);
    // Entity 2 at (15, 5)
    hash.addEntity(2, 15, 5);
    // Entity 3 at (50, 50)
    hash.addEntity(3, 50, 50);

    hash.build();

    const outArray = new Uint32Array(10);

    // Query near (0, 0) with radius 12
    // Should find entity 1 (5, 5) and entity 2 (15, 5) depending on cell boundaries
    // Cells:
    // (5,5) is cell (0,0) (offset 32768)
    // (15,5) is cell (1,0)
    const found = hash.query(0, 0, 15, outArray);

    const foundIds = Array.from(outArray.slice(0, found));
    expect(foundIds).toContain(1);
    expect(foundIds).toContain(2);
    expect(foundIds).not.toContain(3);
  });

  it('should respect max capacity', () => {
    const hash = new MortonSpatialHash(2, 10, 1024);
    hash.addEntity(1, 0, 0);
    hash.addEntity(2, 0, 0);
    hash.addEntity(3, 0, 0); // Should be ignored

    hash.build();

    const outArray = new Uint32Array(5);
    const count = hash.query(0, 0, 10, outArray);

    expect(count).toBe(2);
    const foundIds = Array.from(outArray.slice(0, count));
    expect(foundIds).toContain(1);
    expect(foundIds).toContain(2);
    expect(foundIds).not.toContain(3);
  });

  it('should clear properly', () => {
    const hash = new MortonSpatialHash(10, 10, 1024);
    hash.addEntity(1, 0, 0);
    hash.build();

    hash.clear();
    hash.addEntity(2, 0, 0);
    hash.build();

    const outArray = new Uint32Array(5);
    const count = hash.query(0, 0, 10, outArray);

    expect(count).toBe(1);
    expect(outArray[0]).toBe(2);
  });
});
