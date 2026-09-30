/**
 * @file CameraManager.ts
 * @description
 * 描画戦略の根拠をここにまとめます。
 *
 * 描画戦略:
 *  - SoA への GPU 転送は 1 回だけです。
 *  - カメラごとに投影行列を切り替えて drawInstanced します。
 *  - つまりカメラ 2 台でもバッファ転送は増えず、
 *    増えるのは uniform の更新とドローコールだけです。
 */

import { Camera } from './Camera';
import type { Scene } from './Scene';

/** 保持できるカメラの上限。超過時は警告して拒否します。 */
export const MAX_CAMERAS = 8;

export class CameraManager {
  private readonly _cameras: Camera[] = [];
  /** 名前の重複を避けるための索引。 */
  private readonly _byName = new Map<string, Camera>();
  private _main!: Camera;

  constructor(scene: Scene) {
    this._main = new Camera('main');
    this._cameras.push(this._main);
    this._byName.set('main', this._main);
    void scene;
  }

  /** 最も前面のカメラ (Phaser 互換の this.cameras.main)。 */
  public get main(): Camera {
    return this._main;
  }

  /** 登録済みカメラの数。 */
  public get count(): number {
    return this._cameras.length;
  }

  /**
   * カメラを追加します (Phaser 互換の this.cameras.add)。
   * 上限 (MAX_CAMERAS) を超える場合は null を返します。
   */
  public add(x = 0, y = 0, name = ''): Camera | null {
    if (this._cameras.length >= MAX_CAMERAS) {
      console.warn(`CameraManager: カメラ数が上限 (${MAX_CAMERAS}) に達したため追加できません。`);
      return null;
    }
    const cam = new Camera(name.length > 0 ? name : `camera${this._cameras.length}`);
    cam.x = x;
    cam.y = y;
    this._cameras.push(cam);
    this._byName.set(cam.name, cam);
    return cam;
  }

  /**
   * 名前でカメラを取得します (Phaser 互換の this.cameras.getCamera)。
   */
  public getCamera(name: string): Camera | null {
    return this._byName.get(name) ?? null;
  }

  /**
   * 描画対象となるカメラを列挙します。
   * 毎フレーム new しないよう、呼び出し側の配列へ書き込みます。
   *
   * @param out 出力先。カメラ数だけ上書きします
   * @returns 書き込んだカメラ数
   */
  public collectForRender(out: Camera[]): number {
    let n = 0;
    for (let i = 0; i < this._cameras.length; i++) {
      const c = this._cameras[i];
      if (c.visible) out[n++] = c;
    }
    return n;
  }

  /**
   * 追従を 1 フレーム進めます。
   *
   * @param dt デルタタイム (秒)
   * @param followId 追従対象の ID (-1 で追従なし)
   * @param followX 追従対象の世界座標 X
   * @param followY 追従対象の世界座標 Y
   */
  public update(dt: number, followId = -1, followX = -1, followY = -1): void {
    for (let i = 0; i < this._cameras.length; i++) {
      const c = this._cameras[i];
      // 追従が設定されているカメラにだけ座標を渡します。
      c.update(dt, c.isFollowing ? followX : -1, c.isFollowing ? followY : -1);
    }
    void followId;
  }
}
