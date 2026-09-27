/**
 * @file Math.ts
 * @description
 * Phaserライクなヘルパー関数群
 */

export class MathHelpers {
  public Distance = {
    Between(x1: number, y1: number, x2: number, y2: number): number {
      const dx = x2 - x1;
      const dy = y2 - y1;
      return Math.sqrt(dx * dx + dy * dy);
    },
    BetweenSquared(x1: number, y1: number, x2: number, y2: number): number {
      const dx = x2 - x1;
      const dy = y2 - y1;
      return dx * dx + dy * dy;
    },
  };

  public Angle = {
    Between(x1: number, y1: number, x2: number, y2: number): number {
      return Math.atan2(y2 - y1, x2 - x1);
    },
  };

  public Clamp(val: number, min: number, max: number): number {
    if (val < min) return min;
    if (val > max) return max;
    return val;
  }

  public DegToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  public RadToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }
}

export const mathHelpers = new MathHelpers();
