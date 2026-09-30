/**
 * @file Camera.ts
 * @description
 * カメラ 1 台分のビューポートとエフェクトを管理します。
 *
 * 設計方針:
 *  - 位置・ズーム・回転はすべて 0 個のヒープ割り当てで扱います。
 *  - エフェクト (フェード / パン / ズーム) は固定長 Effect のプールで持ち、
 *    毎フレーム new しません。
 *  - 複数カメラは CameraManager が持ち、描画はカメラごとに
 *    ドローコールを分けるだけで実現します (SoA 転送は 1 回のまま)。
 */

import type { BoundsRect } from '../arena/Sprite';

/** カメラが保持できるエフェクトの同時実行数上限 */
const MAX_EFFECTS = 8;

/** エフェクトの種類 */
export const enum EffectKind {
  Fade = 0,
  Pan = 1,
  Zoom = 2,
}

/** 進行中のエフェクト 1 件 */
interface Effect {
  kind: EffectKind;
  /** 残り時間 (秒) */
  time: number;
  /** 総時間 (秒) */
  duration: number;
  /** 開始時の値 */
  from: number;
  /** 終了時の値 */
  to: number;
  /** 遅延 (秒) */
  delay: number;
  /** Pan / Zoom の開始時のスクロール位置 */
  fromX: number;
  fromY: number;
  /** Pan / Zoom の目標スクロール位置 */
  toX: number;
  toY: number;
  active: boolean;
}

export class Camera {
  /** スクロール位置 (ワールド座標) */
  public x = 0;
  public y = 0;
  /** ズーム倍率。1.0 が等倍です */
  public zoom = 1.0;
  /** 回転 (ラジアン) */
  public rotation = 0;
  /** 背景色 (0xRRGGBB)。0 はエンジン既定の色を使用します */
  public backgroundColor = 0;
  /** このカメラの識別名 */
  public name = '';
  /** カメラが有効かどうか。false なら描画しません */
  public visible = true;

  // --- シェイク ---
  private shakeIntensity = 0;
  private shakeDuration = 0;
  private shakeTime = 0;
  public shakeX = 0;
  public shakeY = 0;

  // --- 追従 ---
  /** 追従対象の ID (-1 で無効) */
  private followId = -1;
  private followLerpX = 0;
  private followLerpY = 0;

  // --- フェード ---
  private _fadeAlpha = 1;
  private _fadeColorR = 0;
  private _fadeColorG = 0;
  private _fadeColorB = 0;

  /** フェードした範囲の描画矩形 (-1 で全画面) */
  private _fadeEffect = -1;

  /** エフェクトのプール。固定長で確保し、毎フレーム new しません。 */
  private readonly _effects: Effect[] = [];

  constructor(name = '') {
    this.name = name;
    for (let i = 0; i < MAX_EFFECTS; i++) {
      this._effects.push({
        kind: EffectKind.Fade,
        time: 0,
        duration: 1,
        from: 0,
        to: 0,
        delay: 0,
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: 0,
        active: false,
      });
    }
  }

  // ============================================================
  // Phaser 互換: スクロール
  // ============================================================

  /** スクロール位置を設定し、チェーンのために this を返します。 */
  public setScroll(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  /** 横スクロールを設定します (Phaser 互換の setScrollX)。 */
  public setScrollX(x: number): this {
    this.x = x;
    return this;
  }

  /** 縦スクロールを設定します (Phaser 互換の setScrollY)。 */
  public setScrollY(y: number): this {
    this.y = y;
    return this;
  }

  public get scrollX(): number {
    return this.x;
  }
  public set scrollX(val: number) {
    this.x = val;
  }

  public get scrollY(): number {
    return this.y;
  }
  public set scrollY(val: number) {
    this.y = val;
  }

  /** ズームを設定し、チェーンのために this を返します。 */
  public setZoom(value: number): this {
    if (value > 0) this.zoom = value;
    return this;
  }

  /** 回転を度で設定します (Phaser 互換)。内部ではラジアンです。 */
  public setRotation(degrees: number): this {
    this.rotation = (degrees * Math.PI) / 180;
    return this;
  }

  /** 回転を度で取得します (Phaser 互換の angle)。 */
  public get angle(): number {
    return (this.rotation * 180) / Math.PI;
  }
  public set angle(degrees: number) {
    this.rotation = (degrees * Math.PI) / 180;
  }

  /**
   * 画面中央のワールド座標を out へ書き出します (Phaser 互換の getCenter)。
   */
  public getCenter(out: { x: number; y: number }, viewWidth: number, viewHeight: number): this {
    out.x = this.actualX + viewWidth * 0.5;
    out.y = this.actualY + viewHeight * 0.5;
    return this;
  }

  public get centerX(): number {
    return this.actualX;
  }
  public set centerX(val: number) {
    this.x = val;
  }

  public get centerY(): number {
    return this.actualY;
  }
  public set centerY(val: number) {
    this.y = val;
  }

  /**
   * 指定座標を画面中央に置くようにスクロール位置を設定します。
   */
  public centerOn(x: number, y: number, viewWidth = 0, viewHeight = 0): this {
    this.x = x - viewWidth * 0.5;
    this.y = y - viewHeight * 0.5;
    return this;
  }

  /**
   * スクリーン座標からワールド座標を復元します (Phaser 互換の getWorldPoint)。
   */
  public getWorldPoint(
    screenX: number,
    screenY: number,
    viewWidth: number,
    viewHeight: number,
    out: { x: number; y: number },
  ): this {
    const z = this.zoom !== 0 ? this.zoom : 1;
    out.x = this.actualX + (screenX - viewWidth * 0.5) / z;
    out.y = this.actualY + (screenY - viewHeight * 0.5) / z;
    return this;
  }

  /** 画面可視範囲をワールド座標の矩形として out へ書き出します。 */
  public getWorldBounds(out: BoundsRect, viewWidth: number, viewHeight: number): this {
    const z = this.zoom !== 0 ? this.zoom : 1;
    const halfW = viewWidth * 0.5 / z;
    const halfH = viewHeight * 0.5 / z;
    out.x = this.actualX - halfW;
    out.y = this.actualY - halfH;
    out.width = halfW * 2;
    out.height = halfH * 2;
    return this;
  }

  /** 背景色を設定します (Phaser 互換の setBackgroundColor)。 */
  public setBackgroundColor(color: string | number): this {
    if (typeof color === 'string') {
      const parsed = Number.parseInt(color.replace('#', ''), 16);
      this.backgroundColor = Number.isNaN(parsed) ? 0 : parsed;
    } else {
      this.backgroundColor = color;
    }
    return this;
  }

  // ============================================================
  // Phaser 互換: 追従
  // ============================================================

  /**
   * 指定スプライトを追従します (Phaser 互換の startFollow)。
   *
   * 補間は線形です。lerp が 0 ならスナップ移動になります。
   *
   * @param targetId 追従するスプライトの ID
   * @param lerpX X 方向の補間係数 (大きいほど遅く追従)
   * @param lerpY Y 方向の補間係数
   */
  public startFollow(targetId: number, lerpX = 0, lerpY = 0): this {
    this.followId = targetId;
    this.followLerpX = lerpX;
    this.followLerpY = lerpY;
    return this;
  }

  /** 追従を解除します (Phaser 互換の stopFollow)。 */
  public stopFollow(): this {
    this.followId = -1;
    this.followLerpX = 0;
    this.followLerpY = 0;
    return this;
  }

  /** 追従対象が設定されているかを取得します。 */
  public get isFollowing(): boolean {
    return this.followId >= 0;
  }

  // ============================================================
  // Phaser 互換: フェード
  // ============================================================

  /** フェードインを開始します (Phaser 互換の fadeIn)。 */
  public fadeIn(duration: number, red = 0, green = 0, blue = 0, callback?: () => void): this {
    this._fadeColorR = red / 255;
    this._fadeColorG = green / 255;
    this._fadeColorB = blue / 255;
    this._fadeEffect = -1;
    this._startEffect(EffectKind.Fade, duration / 1000, 0, 1, 0);
    this._fadeCallback = callback ?? null;
    return this;
  }

  /** フェードアウトを開始します (Phaser 互換の fadeOut)。 */
  public fadeOut(
    duration: number,
    red = 0,
    green = 0,
    blue = 0,
    callback?: () => void,
  ): this {
    this._fadeColorR = red / 255;
    this._fadeColorG = green / 255;
    this._fadeColorB = blue / 255;
    this._fadeEffect = -1;
    this._startEffect(EffectKind.Fade, duration / 1000, 1, 0, 0);
    this._fadeCallback = callback ?? null;
    return this;
  }

  /** フェードを即座に完了させます (Phaser 互換の fadeComplete)。 */
  public fadeComplete(): this {
    for (let i = 0; i < this._effects.length; i++) {
      if (this._effects[i].kind === EffectKind.Fade) {
        this._effects[i].active = false;
        this._fadeAlpha = this._effects[i].to;
      }
    }
    return this;
  }

  /** フェード実行中かどうか (Phaser 互換の isFading)。 */
  public get isFading(): boolean {
    for (let i = 0; i < this._effects.length; i++) {
      const e = this._effects[i];
      if (e.active && e.kind === EffectKind.Fade) return true;
    }
    return false;
  }

  /** フェードの進行度 (0〜1) を返します (Phaser 互換の progress)。 */
  public get progress(): number {
    for (let i = 0; i < this._effects.length; i++) {
      const e = this._effects[i];
      if (e.active && e.kind === EffectKind.Fade) {
        if (e.duration <= 0) return 1;
        return 1 - Math.max(0, e.time) / e.duration;
      }
    }
    return 1;
  }

  /** フェード完了時のコールバック */
  private _fadeCallback: (() => void) | null = null;

  /** フェードした範囲の描画矩形 (-1 で全画面) */
  public setFadeEffect(effectId: number): this {
    this._fadeEffect = effectId;
    return this;
  }

  public get fadeEffect(): number {
    return this._fadeEffect;
  }

  /**
   * フェード色と不透明度を out へ書き出します (0〜1 に正規化済み)。
   */
  public getFadeColor(out: Float32Array): this {
    out[0] = this._fadeColorR;
    out[1] = this._fadeColorG;
    out[2] = this._fadeColorB;
    out[3] = this._fadeAlpha;
    return this;
  }

  // ============================================================
  // Phaser 互換: パン / ズームトゥ
  // ============================================================

  /**
   * 指定位置へ滑らかに移動します (Phaser 互換の pan)。
   */
  public pan(x: number, y: number, duration = 1000, ease = false, delay = 0): this {
    void ease;
    const e = this._allocEffect();
    if (e === null) return this;
    e.kind = EffectKind.Pan;
    e.duration = duration > 0 ? duration / 1000 : 1e-6;
    e.time = e.duration;
    e.delay = delay > 0 ? delay / 1000 : 0;
    e.fromX = this.x;
    e.fromY = this.y;
    e.toX = x;
    e.toY = y;
    e.active = true;
    return this;
  }

  /**
   * ズーム率を指定値へ滑らかに変化させます (Phaser 互換の zoomTo)。
   */
  public zoomTo(value: number, duration = 1000, ease = false, delay = 0): this {
    void ease;
    this._startEffect(EffectKind.Zoom, duration / 1000, this.zoom, value, delay / 1000);
    return this;
  }

  // ============================================================
  // シェイク
  // ============================================================

  /**
   * 画面を揺らすシェイクエフェクトを開始します。
   * @param intensity 揺れの強さ
   * @param duration 揺れの持続時間 (秒)
   */
  public shake(intensity: number, duration: number): void {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration > 0 ? duration : 1e-6;
    this.shakeTime = duration;
  }

  /** シェイクを即座に停止します (Phaser 互換の stopShake)。 */
  public stopShake(): void {
    this.shakeTime = 0;
    this.shakeX = 0;
    this.shakeY = 0;
  }

  // ============================================================
  // 更新
  // ============================================================

  /**
   * 毎フレームの更新です。CameraManager から全カメラへ呼ばれます。
   *
   * @param dt デルタタイム (秒)
   * @param followX 追従対象の世界座標 X (-1 で追従なし)
   * @param followY 追従対象の世界座標 Y
   */
  public update(dt: number, followX = -1, followY = -1): void {
    this._updateShake(dt);
    this._updateFollow(dt, followX, followY);
    this._updateEffects(dt);
  }

  private _updateShake(dt: number): void {
    if (this.shakeTime > 0) {
      this.shakeTime -= dt;
      if (this.shakeTime <= 0) {
        this.shakeTime = 0;
        this.shakeX = 0;
        this.shakeY = 0;
      } else {
        const currentIntensity = this.shakeIntensity * (this.shakeTime / this.shakeDuration);
        this.shakeX = (Math.random() - 0.5) * 2 * currentIntensity;
        this.shakeY = (Math.random() - 0.5) * 2 * currentIntensity;
      }
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
    }
  }

  private _updateFollow(dt: number, followX: number, followY: number): void {
    if (this.followId < 0 || followX < 0) return;
    if (this.followLerpX <= 0) {
      this.x = followX;
    } else {
      this.x += (followX - this.x) * Math.min(1, this.followLerpX * dt);
    }
    if (this.followLerpY <= 0) {
      this.y = followY;
    } else {
      this.y += (followY - this.y) * Math.min(1, this.followLerpY * dt);
    }
  }

  private _updateEffects(dt: number): void {
    const effects = this._effects;
    for (let i = 0; i < effects.length; i++) {
      const e = effects[i];
      if (!e.active) continue;

      if (e.delay > 0) {
        e.delay -= dt;
        if (e.delay > 0) continue;
        // 遅延明けに残り時間だけ進めます
        const remain = -e.delay;
        e.delay = 0;
        this._applyEffect(e, Math.min(remain, e.time));
        e.time -= remain;
        if (e.time <= 0) this._finishEffect(e);
        continue;
      }

      e.time -= dt;
      this._applyEffect(e, Math.max(0, e.time));
      if (e.time <= 0) this._finishEffect(e);
    }
  }

  private _applyEffect(e: Effect, timeLeft: number): void {
    const t = e.duration > 0 ? 1 - timeLeft / e.duration : 1;
    // smoothstep で滑らかに補間します
    const c = Math.max(0, Math.min(1, t));
    const eased = c * c * (3 - 2 * c);
    switch (e.kind) {
      case EffectKind.Fade:
        this._fadeAlpha = e.from + (e.to - e.from) * eased;
        break;
      case EffectKind.Pan:
        this.x = e.fromX + (e.toX - e.fromX) * eased;
        this.y = e.fromY + (e.toY - e.fromY) * eased;
        break;
      case EffectKind.Zoom:
        this.zoom = e.from + (e.to - e.from) * eased;
        break;
    }
  }

  private _finishEffect(e: Effect): void {
    e.active = false;
    if (e.kind === EffectKind.Fade) {
      this._fadeAlpha = e.to;
      const cb = this._fadeCallback;
      if (cb !== null) {
        this._fadeCallback = null;
        cb();
      }
    }
  }

  private _startEffect(
    kind: EffectKind,
    duration: number,
    from: number,
    to: number,
    delay: number,
  ): void {
    const e = this._allocEffect();
    if (e === null) return;
    e.kind = kind;
    e.duration = duration > 0 ? duration : 1e-6;
    e.time = e.duration;
    e.from = from;
    e.to = to;
    e.delay = delay;
    e.fromX = this.x;
    e.fromY = this.y;
    e.active = true;
  }

  /** 空きエフェクト枠を 1 つ確保します。満杯なら null を返します。 */
  private _allocEffect(): Effect | null {
    const effects = this._effects;
    for (let i = 0; i < effects.length; i++) {
      if (!effects[i].active) {
        effects[i].active = true;
        return effects[i];
      }
    }
    return null;
  }

  // ============================================================
  // 描画用
  // ============================================================

  /** 実際にレンダリングに使う X 座標 (シェイクを加味)。 */
  public get actualX(): number {
    return this.x + this.shakeX;
  }

  /** 実際にレンダリングに使う Y 座標 (シェイクを加味)。 */
  public get actualY(): number {
    return this.y + this.shakeY;
  }
}
