import type { InstanceBufferArena } from './InstanceBufferArena';

export class Sprite {
  public readonly id: number;
  private readonly _arena: InstanceBufferArena;

  constructor(id: number, arena: InstanceBufferArena) {
    this.id = id;
    this._arena = arena;
  }

  private get idx(): number {
    return this._arena.idToIndex[this.id];
  }

  public get x(): number {
    return this._arena.posX[this.idx];
  }
  public set x(val: number) {
    this._arena.posX[this.idx] = val;
    this._arena.dirtyPos = true;
  }

  public get y(): number {
    return this._arena.posY[this.idx];
  }
  public set y(val: number) {
    this._arena.posY[this.idx] = val;
    this._arena.dirtyPos = true;
  }

  public get scale(): number {
    return this._arena.scale[this.idx];
  }
  public set scale(val: number) {
    this._arena.scale[this.idx] = val;
    this._arena.dirtyScale = true;
  }

  public get frameIdx(): number {
    return this._arena.frameIdx[this.idx];
  }
  public set frameIdx(val: number) {
    this._arena.frameIdx[this.idx] = val;
    this._arena.dirtyFrameIdx = true;
  }

  // Animation support
  public get frame(): number {
    return this._currentFrame;
  }
  public set frame(val: number) {
    this.setFrame(Math.floor(val));
  }

  private _asset: any;
  private _currentFrame = 0;

  public setTexture(asset: any, frame: string | number = 0): this {
    this._asset = asset;
    const i = this.idx;
    this._arena.frameIdx[i] = 0;
    this._arena.dirtyFrameIdx = true;
    this.setFrame(frame);
    return this;
  }

  public setFrame(frame: string | number): this {
    if (!this._asset || !this._asset.frames) return this;
    const fIdx = typeof frame === 'number' ? frame : 0;
    if (fIdx >= 0 && fIdx < this._asset.frames.length) {
      this._currentFrame = fIdx;
      const fData = this._asset.frames[fIdx];
      const i = this.idx;
      this._arena.uvX[i] = fData.uvX;
      this._arena.uvY[i] = fData.uvY;
      this._arena.uvW[i] = fData.uvW;
      this._arena.uvH[i] = fData.uvH;
      this._arena.dirtyUv = true;
    }
    return this;
  }

  public setFlipX(flip: boolean): this {
    this._arena.facing[this.idx] = flip ? -1.0 : 1.0;
    // For now we can bundle facing with dirtyScale or create a separate dirty facing flag.
    // Let's bundle with dirtyScale to save some flags.
    this._arena.dirtyScale = true;
    return this;
  }

  public setTint(tintHex: number): this {
    this._arena.tint[this.idx] = tintHex;
    this._arena.dirtyTint = true;
    return this;
  }

  public setInteractive(hitWidth?: number, hitHeight?: number): this {
    const i = this.idx;
    this._arena.interactive[i] = 1;
    if (hitWidth !== undefined) {
      this._arena.hitWidth[i] = hitWidth;
    } else {
      this._arena.hitWidth[i] = this._asset ? (this._asset.width ?? 0) : 0;
    }

    if (hitHeight !== undefined) {
      this._arena.hitHeight[i] = hitHeight;
    } else {
      this._arena.hitHeight[i] = this._asset ? (this._asset.height ?? 0) : 0;
    }
    return this;
  }

  public destroy(): void {
    this._arena.free(this.id);
  }
}
