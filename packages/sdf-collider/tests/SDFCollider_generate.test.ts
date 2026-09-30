import { describe, expect, test } from 'vitest';
import { SDFCollider } from '../src/SDFCollider';

/** 垂直な壁 (x が 28〜36 の帯) の SDF を生成します。 */
function makeVerticalWall(size = 64): SDFCollider {
  const sdf = new SDFCollider(size, size, 1);
  const half = size * 0.5;
  sdf.generate((x) => Math.abs(x - half) < 4);
  return sdf;
}

/** 水平な壁 (y が 28〜36 の帯) の SDF を生成します。 */
function makeHorizontalWall(size = 64): SDFCollider {
  const sdf = new SDFCollider(size, size, 1);
  const half = size * 0.5;
  sdf.generate((_x, y) => Math.abs(y - half) < 4);
  return sdf;
}

describe('SDFCollider: generate (8SSEDT)', () => {
  test('positive distance outside and negative inside', () => {
    const sdf = makeVerticalWall(64);
    const out = new Float32Array(3);

    // 壁の左外側
    sdf.evaluate(2, 32, out);
    expect(out[0]).toBeGreaterThan(0);

    // 壁の内部
    sdf.evaluate(32, 32, out);
    expect(out[0]).toBeLessThan(0);
  });

  test('distance grows as you move away from the wall', () => {
    const sdf = makeVerticalWall(64);
    const out = new Float32Array(3);
    sdf.evaluate(2, 32, out);
    const near = out[0];
    sdf.evaluate(20, 32, out);
    const far = out[0];
    expect(far).toBeLessThan(near);
    expect(far).toBeGreaterThan(0);
  });

  test('distance magnitude is accurate to about one cell', () => {
    const sdf = makeVerticalWall(64);
    const out = new Float32Array(3);
    // 壁の左面は x=28。x=8 なら距離は約 20
    sdf.evaluate(8, 32, out);
    expect(out[0]).toBeGreaterThan(17);
    expect(out[0]).toBeLessThan(23);
  });

  test('normal points away from the wall', () => {
    const vertical = makeVerticalWall(64);
    const out = new Float32Array(3);

    // left of the wall: normal is (-1, 0)
    vertical.evaluate(2, 32, out);
    expect(out[1]).toBeCloseTo(-1, 1);
    expect(out[2]).toBeCloseTo(0, 1);

    // right of the wall: normal is (+1, 0)
    vertical.evaluate(62, 32, out);
    expect(out[1]).toBeCloseTo(1, 1);
    expect(out[2]).toBeCloseTo(0, 1);

    const horizontal = makeHorizontalWall(64);
    // above the wall: normal is (0, -1)
    horizontal.evaluate(32, 2, out);
    expect(out[1]).toBeCloseTo(0, 1);
    expect(out[2]).toBeCloseTo(-1, 1);

    // below the wall: normal is (0, +1)
    horizontal.evaluate(32, 62, out);
    expect(out[1]).toBeCloseTo(0, 1);
    expect(out[2]).toBeCloseTo(1, 1);
  });

  test('generateFromGrid marks solid tiles', () => {
    // 8x8 のグリッド、中央 2x2 が壁
    const grid: number[][] = [];
    for (let y = 0; y < 8; y++) {
      const row: number[] = [];
      for (let x = 0; x < 8; x++) {
        row.push(x >= 3 && x <= 4 && y >= 3 && y <= 4 ? 1 : 0);
      }
      grid.push(row);
    }
    const sdf = new SDFCollider(64, 64, 1);
    sdf.generateFromGrid(grid, 8, (t) => t === 1);

    const out = new Float32Array(3);
    // 壁の中央は内側 (負)
    sdf.evaluate(32, 32, out);
    expect(out[0]).toBeLessThan(0);
    // 左上のはずれは外側 (正)
    sdf.evaluate(2, 2, out);
    expect(out[0]).toBeGreaterThan(0);
  });

  test('a field with no solid anywhere stays finite', () => {
    const sdf = new SDFCollider(32, 32, 1);
    sdf.generate(() => false);
    const out = new Float32Array(3);
    sdf.evaluate(16, 16, out);
    expect(Number.isFinite(out[0])).toBe(true);
  });

  test('a field that is entirely solid is a documented degenerate case', () => {
    const sdf = new SDFCollider(32, 32, 1);
    sdf.generate(() => true);
    const out = new Float32Array(3);
    sdf.evaluate(16, 16, out);
    // 内側 (自由空間側) に種が存在しないため距離は定義できず 0 になります。
    // the inner (free space) side has no seed, so distance is undefined
    expect(Number.isFinite(out[0])).toBe(true);
    expect(out[0]).toBe(0);
  });
});

describe('SDFCollider: resolveCircle', () => {
  test('a circle clear of the wall is not moved', () => {
    const sdf = makeVerticalWall(64);
    const out = new Float32Array(2);
    const scratch = new Float32Array(3);
    // 壁の左面 (x=28) から十分遠い
    const moved = sdf.resolveCircle(10, 32, 1, out, scratch);
    expect(moved).toBe(false);
    expect(out[0]).toBe(10);
    expect(out[1]).toBe(32);
  });

  test('a circle overlapping the wall is pushed out along the normal', () => {
    const sdf = makeVerticalWall(64);
    const out = new Float32Array(2);
    const scratch = new Float32Array(3);

    // 壁面 x=28。中心 26 半径 4 なら距離 2 < 4 で接触する
    const moved = sdf.resolveCircle(26, 32, 4, out, scratch);
    expect(moved).toBe(true);
    expect(out[0]).toBeLessThan(26);
    expect(out[1]).toBeCloseTo(32, 3);
  });

  test('pushing out places the circle at exactly the contact distance', () => {
    const sdf = makeVerticalWall(64);
    const out = new Float32Array(2);
    const scratch = new Float32Array(3);
    const radius = 3;

    sdf.resolveCircle(26, 32, radius, out, scratch);
    const after = sdf.distanceAt(out[0], out[1]);
    expect(after).toBeGreaterThanOrEqual(radius - 0.5);
    expect(after).toBeLessThan(radius + 0.5);
  });

  test('a circle slides along the wall instead of stopping', () => {
    const sdf = makeVerticalWall(64);
    const out = new Float32Array(2);
    const scratch = new Float32Array(3);

    // 壁に押し出された状態から縦方向に動かします。y 座標は保たれます
    sdf.resolveCircle(26, 32, 4, out, scratch);
    const pushedY = out[1];
    // 縦方向へ滑らせる
    const slid = sdf.resolveCircle(out[0] + 1, pushedY + 10, 4, out, scratch);
    expect(slid).toBe(true);
    // y は吸引されず、x だけが壁側へ押される
    expect(out[1]).toBeCloseTo(pushedY + 10, 3);
    expect(out[0]).toBeLessThan(27);
  });

  test('a deeply buried circle is left alone rather than teleported', () => {
    const sdf = makeVerticalWall(64);
    const out = new Float32Array(2);
    const scratch = new Float32Array(3);
    // 完全に埋もれている位置
    const moved = sdf.resolveCircle(32, 32, 2, out, scratch);
    expect(moved).toBe(false);
    expect(out[0]).toBe(32);
  });
});

describe('SDFCollider: sweep', () => {
  test('detects a wall crossing between two points', () => {
    const sdf = makeVerticalWall(64);
    const hit = new Float32Array(2);
    const scratch = new Float32Array(3);

    const collided = sdf.sweep(0, 32, 63, 32, 1, 64, hit, scratch);
    expect(collided).toBe(true);
    expect(hit[0]).toBeLessThan(30);
    expect(hit[0]).toBeGreaterThan(26);
  });

  test('reports no hit for a path entirely in free space', () => {
    const sdf = makeVerticalWall(64);
    const hit = new Float32Array(2);
    const scratch = new Float32Array(3);
    // 壁を横切らない移動
    const collided = sdf.sweep(2, 2, 2, 20, 1, 16, hit, scratch);
    expect(collided).toBe(false);
  });

  test('a fast step does not tunnel through the wall', () => {
    const sdf = makeVerticalWall(64);
    const hit = new Float32Array(2);
    const scratch = new Float32Array(3);
    // 1 フレームで 60 単位進む場合。サンプル 64 なら必ず壁に当たる
    const collided = sdf.sweep(1, 32, 61, 32, 1, 64, hit, scratch);
    expect(collided).toBe(true);
  });
});

describe('SDFCollider: API surface', () => {
  test('exposes grid and world dimensions', () => {
    const sdf = new SDFCollider(16, 8, 2);
    expect(sdf.gridWidth).toBe(16);
    expect(sdf.gridHeight).toBe(8);
    expect(sdf.worldWidth).toBe(32);
    expect(sdf.worldHeight).toBe(16);
  });

  test('rejects invalid construction', () => {
    expect(() => new SDFCollider(0, 8, 1)).toThrow();
    expect(() => new SDFCollider(8, 8, 0)).toThrow();
    expect(() => new SDFCollider(8, 8, 1, new Float32Array(3))).toThrow();
  });

  test('setDistance and getDistance respect bounds', () => {
    const sdf = new SDFCollider(4, 4, 1);
    sdf.setDistance(1, 1, -5);
    expect(sdf.getDistance(1, 1)).toBe(-5);
    // 範囲外は無視される
    sdf.setDistance(10, 10, 1);
    expect(sdf.getDistance(10, 10)).toBe(0);
  });

  test('evaluate clamps at the grid edge without NaN', () => {
    const sdf = new SDFCollider(8, 8, 1);
    const out = new Float32Array(3);
    sdf.evaluate(-1000, -1000, out);
    expect(Number.isFinite(out[0])).toBe(true);
    expect(Number.isFinite(out[1])).toBe(true);
    expect(Number.isFinite(out[2])).toBe(true);
    sdf.evaluate(1000, 1000, out);
    expect(Number.isFinite(out[0])).toBe(true);
  });
});
