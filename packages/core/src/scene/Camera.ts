/**
 * @file Camera.ts
 * @description
 * カメラマネージャー。2D空間におけるビューポートの位置、ズーム、回転、およびシェイクなどのエフェクトを管理します。
 */

export class Camera {
  public x: number = 0;
  public y: number = 0;
  public zoom: number = 1.0;
  public rotation: number = 0;

  // シェイクエフェクト用ステート
  private shakeIntensity: number = 0;
  private shakeDuration: number = 0;
  private shakeTime: number = 0;

  public shakeX: number = 0;
  public shakeY: number = 0;

  constructor() {}

  /**
   * 画面を揺らすシェイクエフェクトを開始します。
   * @param intensity 揺れの強さ
   * @param duration 揺れの持続時間(ms または 秒、ループのスケールに依存)
   */
  public shake(intensity: number, duration: number): void {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeTime = duration;
  }

  /**
   * システムから毎フレーム呼ばれる更新処理。
   * @param dt デルタタイム
   */
  public update(dt: number): void {
    if (this.shakeTime > 0) {
      this.shakeTime -= dt;
      if (this.shakeTime <= 0) {
        this.shakeTime = 0;
        this.shakeX = 0;
        this.shakeY = 0;
      } else {
        const currentIntensity = this.shakeIntensity * (this.shakeTime / this.shakeDuration);
        // ランダムな方向に揺らす (-currentIntensity ～ currentIntensity)
        this.shakeX = (Math.random() - 0.5) * 2 * currentIntensity;
        this.shakeY = (Math.random() - 0.5) * 2 * currentIntensity;
      }
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
    }
  }

  /**
   * 実際のレンダリングに使用する X 座標 (シェイクを加味)
   */
  public get actualX(): number {
    return this.x + this.shakeX;
  }

  /**
   * 実際のレンダリングに使用する Y 座標 (シェイクを加味)
   */
  public get actualY(): number {
    return this.y + this.shakeY;
  }
}
