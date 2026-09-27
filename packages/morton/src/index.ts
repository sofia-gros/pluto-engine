/**
 * Expands a 16-bit integer into 32 bits by inserting 1 zero bit after each bit.
 */
function expandBits(v: number): number {
  v = (v | (v << 8)) & 0x00ff00ff;
  v = (v | (v << 4)) & 0x0f0f0f0f;
  v = (v | (v << 2)) & 0x33333333;
  v = (v | (v << 1)) & 0x55555555;
  return v >>> 0;
}

/**
 * Converts 2D coordinates into a 32-bit Morton code.
 * x and y must be 16-bit integers (0 to 65535).
 */
export function encodeMorton2D(x: number, y: number): number {
  return (expandBits(x) | (expandBits(y) << 1)) >>> 0;
}

/**
 * Zero-allocation spatial hash using 2D Morton codes.
 */
export class MortonSpatialHash {
  private cellSize: number;
  private maxEntities: number;

  private entityIds: Uint32Array;
  private entityCodes: Uint32Array;
  private sortedIds: Uint32Array;

  private cellStart: Uint32Array;
  private cellCount: Uint32Array;

  private count: number;

  constructor(maxEntities: number, cellSize: number, hashSize = 262144) {
    this.cellSize = cellSize;
    this.maxEntities = maxEntities;

    this.entityIds = new Uint32Array(maxEntities);
    this.entityCodes = new Uint32Array(maxEntities);
    this.sortedIds = new Uint32Array(maxEntities);

    // hashSize must be a power of 2 for fast modulo via bitwise AND
    this.cellStart = new Uint32Array(hashSize);
    this.cellCount = new Uint32Array(hashSize);

    this.count = 0;
  }

  public clear(): void {
    this.count = 0;
    this.cellStart.fill(0);
    this.cellCount.fill(0);
  }

  public addEntity(id: number, x: number, y: number): void {
    if (this.count >= this.maxEntities) return;

    const cx = (Math.floor(x / this.cellSize) + 32768) & 0xffff;
    const cy = (Math.floor(y / this.cellSize) + 32768) & 0xffff;

    const code = encodeMorton2D(cx, cy) & (this.cellStart.length - 1);

    this.entityIds[this.count] = id;
    this.entityCodes[this.count] = code;
    this.cellCount[code]++;
    this.count++;
  }

  public build(): void {
    let start = 0;
    for (let i = 0; i < this.cellStart.length; i++) {
      this.cellStart[i] = start;
      start += this.cellCount[i];
      this.cellCount[i] = 0;
    }

    for (let i = 0; i < this.count; i++) {
      const id = this.entityIds[i];
      const code = this.entityCodes[i];
      const offset = this.cellStart[code] + this.cellCount[code];
      this.sortedIds[offset] = id;
      this.cellCount[code]++;
    }
  }

  /**
   * Finds entities in nearby cells and writes them to the provided output array.
   * Returns the number of entities found.
   */
  public query(x: number, y: number, radius: number, outArray: Uint32Array): number {
    const minX = (Math.floor((x - radius) / this.cellSize) + 32768) & 0xffff;
    const minY = (Math.floor((y - radius) / this.cellSize) + 32768) & 0xffff;
    const maxX = (Math.floor((x + radius) / this.cellSize) + 32768) & 0xffff;
    const maxY = (Math.floor((y + radius) / this.cellSize) + 32768) & 0xffff;

    let outCount = 0;
    const mask = this.cellStart.length - 1;

    for (let cy = minY; cy <= maxY; cy++) {
      for (let cx = minX; cx <= maxX; cx++) {
        const code = encodeMorton2D(cx, cy) & mask;
        const start = this.cellStart[code];
        const count = this.cellCount[code];

        for (let i = 0; i < count; i++) {
          if (outCount < outArray.length) {
            outArray[outCount++] = this.sortedIds[start + i];
          }
        }
      }
    }

    return outCount;
  }
}
export * from './MortonPlugin';
