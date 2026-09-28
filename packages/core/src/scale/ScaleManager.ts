/**
 * @file ScaleManager.ts
 * @description
 * 画面の論理解像度と物理解像度のマッピング、リサイズ時のアスペクト比維持などを管理する。
 */

export enum ScaleMode {
  NONE = 0,
  FIT = 1,
  RESIZE = 2,
}

export interface ScaleConfig {
  width: number;
  height: number;
  mode: ScaleMode;
  pixelArt: boolean;
  autoCenter: boolean;
}

export class ScaleManager {
  public width: number;
  public height: number;
  public mode: ScaleMode;
  public pixelArt: boolean;
  public autoCenter: boolean;

  private canvas: HTMLCanvasElement | null = null;
  private resizeListener: () => void;

  constructor(config: Partial<ScaleConfig> = {}) {
    this.width = config.width || 800;
    this.height = config.height || 600;
    this.mode = config.mode ?? ScaleMode.FIT;
    this.pixelArt = config.pixelArt ?? false;
    this.autoCenter = config.autoCenter ?? true;

    this.resizeListener = this.onResize.bind(this);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.resizeListener);
    }
  }

  public setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    if (this.pixelArt) {
      this.canvas.style.imageRendering = 'pixelated';
    }

    this.onResize();
  }

  public onResize() {
    if (!this.canvas || typeof window === 'undefined') return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (this.mode === ScaleMode.NONE) {
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
    } else if (this.mode === ScaleMode.RESIZE) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      this.width = windowWidth;
      this.height = windowHeight;
      this.canvas.width = windowWidth * dpr;
      this.canvas.height = windowHeight * dpr;
      this.canvas.style.width = `${windowWidth}px`;
      this.canvas.style.height = `${windowHeight}px`;
    } else if (this.mode === ScaleMode.FIT) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const scaleX = windowWidth / this.width;
      const scaleY = windowHeight / this.height;
      const scale = Math.min(scaleX, scaleY);

      const displayWidth = this.width * scale;
      const displayHeight = this.height * scale;

      this.canvas.style.width = `${displayWidth}px`;
      this.canvas.style.height = `${displayHeight}px`;

      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;

      if (this.autoCenter) {
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${(windowWidth - displayWidth) / 2}px`;
        this.canvas.style.top = `${(windowHeight - displayHeight) / 2}px`;
      }
    }
  }

  public destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  public transformX(screenX: number): number {
    if (!this.canvas) return screenX;
    const rect = this.canvas.getBoundingClientRect();
    return (screenX - rect.left) * (this.width / rect.width);
  }

  public transformY(screenY: number): number {
    if (!this.canvas) return screenY;
    const rect = this.canvas.getBoundingClientRect();
    return (screenY - rect.top) * (this.height / rect.height);
  }
}
