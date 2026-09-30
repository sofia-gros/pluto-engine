/**
 * @file InputManager.ts
 * @description
 * Ebitengine スタイルの同期クエリを提供する入力マネージャー。
 * DOM イベントから非同期に受け取った状態を、毎フレームの update() 時にラッチし、
 * ゲームロジック中に入力状態が途中で変わることを防ぎます。
 * キーボード、ポインタ (マウス/タッチ)、ゲームパッドに対応します。
 */

export interface PointerTransform {
  (clientX: number, clientY: number, out: Float32Array): void;
}

export class InputManager {
  // --- Keyboard ---
  private _rawKeys = new Set<string>();
  private _currentKeys = new Set<string>();
  private _previousKeys = new Set<string>();

  // --- Pointer (Mouse/Touch) ---
  /** 変換後のワールド/キャンバス座標 */
  public pointerX = 0;
  public pointerY = 0;
  /** 変換前の画面座標 (CSS ピクセル) */
  public clientX = 0;
  public clientY = 0;
  private _rawPointerDown = false;
  private _currentPointerDown = false;
  private _previousPointerDown = false;
  private _rawPointerX = 0;
  private _rawPointerY = 0;

  /**
   * 画面座標からゲーム座標へ変換する関数。
   * ScaleManager が設定し、未設定の場合は画面座標をそのまま渡します。
   */
  public pointerTransform: PointerTransform | null = null;
  private readonly _pointerScratch = new Float32Array(2);

  // --- Gamepad ---
  // Gamepad API は毎フレーム navigator.getGamepads() をポーリングする仕様です。
  private _gamepads: (Gamepad | null)[] = [];
  private _currentGamepadButtons: boolean[][] = [];
  private _previousGamepadButtons: boolean[][] = [];

  private _boundOnKeyDown: (e: KeyboardEvent) => void;
  private _boundOnKeyUp: (e: KeyboardEvent) => void;
  private _boundOnPointerMove: (e: PointerEvent) => void;
  private _boundOnPointerDown: (e: PointerEvent) => void;
  private _boundOnPointerUp: (e: PointerEvent) => void;
  private _boundTarget: GlobalEventHandlers | null = null;

  constructor() {
    this._boundOnKeyDown = this.onKeyDown.bind(this);
    this._boundOnKeyUp = this.onKeyUp.bind(this);
    this._boundOnPointerMove = this.onPointerMove.bind(this);
    this._boundOnPointerDown = this.onPointerDown.bind(this);
    this._boundOnPointerUp = this.onPointerUp.bind(this);
  }

  public attach(target: GlobalEventHandlers = window): void {
    // 二重登録を防ぐ
    this.detach();
    target.addEventListener('keydown', this._boundOnKeyDown as EventListener);
    target.addEventListener('keyup', this._boundOnKeyUp as EventListener);
    target.addEventListener('pointermove', this._boundOnPointerMove as EventListener);
    target.addEventListener('pointerdown', this._boundOnPointerDown as EventListener);
    target.addEventListener('pointerup', this._boundOnPointerUp as EventListener);
    this._boundTarget = target;
  }

  public detach(target?: GlobalEventHandlers): void {
    const t = target ?? this._boundTarget;
    if (!t) return;
    t.removeEventListener('keydown', this._boundOnKeyDown as EventListener);
    t.removeEventListener('keyup', this._boundOnKeyUp as EventListener);
    t.removeEventListener('pointermove', this._boundOnPointerMove as EventListener);
    t.removeEventListener('pointerdown', this._boundOnPointerDown as EventListener);
    t.removeEventListener('pointerup', this._boundOnPointerUp as EventListener);
    this._boundTarget = null;
  }

  public get attached(): boolean {
    return this._boundTarget !== null;
  }

  private onKeyDown(e: KeyboardEvent): void {
    this._rawKeys.add(e.code);
  }
  private onKeyUp(e: KeyboardEvent): void {
    this._rawKeys.delete(e.code);
  }

  private onPointerMove(e: PointerEvent): void {
    this._rawPointerX = e.clientX;
    this._rawPointerY = e.clientY;
  }
  private onPointerDown(e: PointerEvent): void {
    this._rawPointerX = e.clientX;
    this._rawPointerY = e.clientY;
    this._rawPointerDown = true;
  }
  private onPointerUp(): void {
    this._rawPointerDown = false;
  }

  public update(): void {
    // Keyboard
    this._previousKeys.clear();
    for (const key of this._currentKeys) this._previousKeys.add(key);
    this._currentKeys.clear();
    for (const key of this._rawKeys) this._currentKeys.add(key);

    // Pointer: 座標変換はフレーム内で一度だけ行う
    this.clientX = this._rawPointerX;
    this.clientY = this._rawPointerY;
    if (this.pointerTransform) {
      const out = this._pointerScratch;
      this.pointerTransform(this._rawPointerX, this._rawPointerY, out);
      this.pointerX = out[0];
      this.pointerY = out[1];
    } else {
      this.pointerX = this._rawPointerX;
      this.pointerY = this._rawPointerY;
    }
    this._previousPointerDown = this._currentPointerDown;
    this._currentPointerDown = this._rawPointerDown;

    this.pollGamepads();
  }

  /**
   * ゲームパッドの状態をポーリングし、前フレームとの差分を検出します。
   *
   * `navigator.getGamepads()` は毎回新しい配列を返すため、
   * Array.from でコピーすると毎フレーム確保が発生します。
   * ここでは参照を 1 度だけ確保して中身だけ上書きします。
   */
  private pollGamepads(): void {
    if (typeof navigator === 'undefined' || !navigator.getGamepads) return;

    const pads = navigator.getGamepads();
    if (pads.length === 0) {
      this._gamepads.length = 0;
      this._currentGamepadButtons.length = 0;
      this._previousGamepadButtons.length = 0;
      return;
    }

    if (this._currentGamepadButtons.length < pads.length) {
      for (let i = this._currentGamepadButtons.length; i < pads.length; i++) {
        this._currentGamepadButtons.push([]);
        this._previousGamepadButtons.push([]);
      }
    }
    if (this._gamepads.length < pads.length) {
      for (let i = this._gamepads.length; i < pads.length; i++) {
        this._gamepads.push(null);
      }
    }

    for (let i = 0; i < pads.length; i++) {
      const pad = pads[i];
      const cur = this._currentGamepadButtons[i];
      const prev = this._previousGamepadButtons[i];
      // 参照のみ差し替えます (new は発生しません)
      this._gamepads[i] = pad;

      if (!pad) {
        // パッドが外れた場合は状態をクリアする
        cur.length = 0;
        prev.length = 0;
        continue;
      }

      if (cur.length !== pad.buttons.length) {
        cur.length = pad.buttons.length;
        prev.length = pad.buttons.length;
        for (let b = 0; b < pad.buttons.length; b++) {
          // 初見の場合は現在の実状態を前フレームとして記録します
          prev[b] = pad.buttons[b].pressed;
          cur[b] = pad.buttons[b].pressed;
        }
        continue;
      }

      for (let b = 0; b < pad.buttons.length; b++) {
        prev[b] = cur[b];
        cur[b] = pad.buttons[b].pressed;
      }
    }

    // 末尾が余った場合は切り詰めます
    if (this._gamepads.length > pads.length) {
      this._gamepads.length = pads.length;
      this._currentGamepadButtons.length = pads.length;
      this._previousGamepadButtons.length = pads.length;
    }
  }

  // --- API ---

  public isKeyPressed(code: string): boolean {
    return this._currentKeys.has(code);
  }
  public isKeyJustPressed(code: string): boolean {
    return this._currentKeys.has(code) && !this._previousKeys.has(code);
  }
  public isKeyJustReleased(code: string): boolean {
    return !this._currentKeys.has(code) && this._previousKeys.has(code);
  }

  public isPointerDown(): boolean {
    return this._currentPointerDown;
  }
  public isPointerJustPressed(): boolean {
    return this._currentPointerDown && !this._previousPointerDown;
  }
  public isPointerJustReleased(): boolean {
    return !this._currentPointerDown && this._previousPointerDown;
  }

  /**
   * ゲームパッドの指定ボタンが押されているか (buttonIndex: 0=A, 1=B など)
   */
  public isGamepadButtonPressed(padIndex: number, buttonIndex: number): boolean {
    const cur = this._currentGamepadButtons[padIndex];
    return cur !== undefined && cur[buttonIndex] === true;
  }

  /**
   * ゲームパッドのボタンが今フレームで押されたか。
   */
  public isGamepadButtonJustPressed(padIndex: number, buttonIndex: number): boolean {
    const cur = this._currentGamepadButtons[padIndex];
    const prev = this._previousGamepadButtons[padIndex];
    if (cur === undefined || prev === undefined) return false;
    return cur[buttonIndex] === true && prev[buttonIndex] !== true;
  }

  /**
   * ゲームパッドのボタンがこのフレームで離されたか。
   */
  public isGamepadButtonJustReleased(padIndex: number, buttonIndex: number): boolean {
    const cur = this._currentGamepadButtons[padIndex];
    const prev = this._previousGamepadButtons[padIndex];
    if (cur === undefined || prev === undefined) return false;
    return cur[buttonIndex] !== true && prev[buttonIndex] === true;
  }

  /**
   * ゲームパッドのアナログスティックの値を取得します
   * @param padIndex コントローラー番号 (0 から)
   * @param axisIndex 軸番号 (0=左X, 1=左Y, 2=右X, 3=右Y)
   */
  public getGamepadAxis(padIndex: number, axisIndex: number): number {
    const pad = this._gamepads[padIndex];
    if (!pad || pad.axes.length <= axisIndex) return 0;
    const val = pad.axes[axisIndex];
    // デッドゾーン処理 (0.1)
    return Math.abs(val) > 0.1 ? val : 0;
  }

  /**
   * 接続されているゲームパッドの数を返します。
   */
  public getGamepadCount(): number {
    let n = 0;
    for (let i = 0; i < this._gamepads.length; i++) {
      if (this._gamepads[i]) n++;
    }
    return n;
  }
}
