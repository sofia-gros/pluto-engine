import { describe, expect, it } from 'vitest';
import { SDFCollider } from '../src/SDFCollider';

describe('SDFCollider', () => {
  it('should interpolate distances correctly', () => {
    const sdf = new SDFCollider(2, 2, 1.0);
    sdf.setDistance(0, 0, 0);
    sdf.setDistance(1, 0, 10);
    sdf.setDistance(0, 1, 10);
    sdf.setDistance(1, 1, 20);

    const out = new Float32Array(3);

    // Exact corners
    sdf.evaluate(0, 0, out);
    expect(out[0]).toBeCloseTo(0);

    sdf.evaluate(1, 0, out);
    expect(out[0]).toBeCloseTo(10);

    // Center
    sdf.evaluate(0.5, 0.5, out);
    expect(out[0]).toBeCloseTo(10);
  });

  it('should compute normals correctly', () => {
    const sdf = new SDFCollider(3, 3, 1.0);
    // Plane at x=1, gradient pointing in +x direction
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        sdf.setDistance(x, y, x - 1);
      }
    }

    const out = new Float32Array(3);

    // Evaluate in the middle cell (1 to 2)
    sdf.evaluate(1.5, 1.5, out);

    // Distance should be 0.5
    expect(out[0]).toBeCloseTo(0.5);

    // Normal should point entirely along +x
    expect(out[1]).toBeCloseTo(1.0);
    expect(out[2]).toBeCloseTo(0.0);
  });

  it('should handle boundaries properly', () => {
    const sdf = new SDFCollider(2, 2, 1.0);
    sdf.setDistance(0, 0, 5);
    sdf.setDistance(1, 0, 5);
    sdf.setDistance(0, 1, 5);
    sdf.setDistance(1, 1, 5);

    const out = new Float32Array(3);

    // Out of bounds evaluation
    sdf.evaluate(-1, -1, out);
    expect(out[0]).toBeCloseTo(5); // Clamped to (0,0)

    sdf.evaluate(10, 10, out);
    expect(out[0]).toBeCloseTo(5); // Clamped to (1,1)
  });

  it('should throw when initialData is invalid', () => {
    expect(() => {
      new SDFCollider(2, 2, 1.0, new Float32Array(3));
    }).toThrow();
  });
});
