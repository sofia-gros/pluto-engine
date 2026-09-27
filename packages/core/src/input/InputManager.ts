/**
 * @file InputManager.ts
 * @description
 * Ebitengine スタイルの同期クエリを提供する入力マネージャー。
 * DOMイベントから非同期に受け取った状態を、毎フレームの update() 時にラッチ（固定）し、
 * ゲームロジック中に入力状態が途中で変わることを防ぎます。
 * キーボード、マウス/タッチ（ポインター）、ゲームパッドに対応。
 */

export class InputManager {
  // --- Keyboard ---
  private _rawKeys = new Set<string>();
  private _currentKeys = new Set<string>();
  private _previousKeys = new Set<string>();

  // --- Pointer (Mouse/Touch) ---
  public pointerX = 0;
  public pointerY = 0;
  private _rawPointerDown = false;
  private _currentPointerDown = false;
  private _previousPointerDown = false;

  // --- Gamepad ---
  // Gamepad APIは毎フレーム navigator.getGamepads() をポーリングする仕様です。
  private _gamepads: (Gamepad | null)[] = [];
  private _previousGamepadButtons: boolean[][] = [];

  private _boundOnKeyDown: (e: KeyboardEvent) => void;
  private _boundOnKeyUp: (e: KeyboardEvent) => void;
  private _boundOnPointerMove: (e: PointerEvent) => void;
  private _boundOnPointerDown: (e: PointerEvent) => void;
  private _boundOnPointerUp: (e: PointerEvent) => void;

  constructor() {
    this._boundOnKeyDown = this.onKeyDown.bind(this);
    this._boundOnKeyUp = this.onKeyUp.bind(this);
    this._boundOnPointerMove = this.onPointerMove.bind(this);
    this._boundOnPointerDown = this.onPointerDown.bind(this);
    this._boundOnPointerUp = this.onPointerUp.bind(this);
  }

  public attach(target: GlobalEventHandlers = window): void {
    target.addEventListener('keydown', this._boundOnKeyDown as EventListener);
    target.addEventListener('keyup', this._boundOnKeyUp as EventListener);
    target.addEventListener('pointermove', this._boundOnPointerMove as EventListener);
    target.addEventListener('pointerdown', this._boundOnPointerDown as EventListener);
    target.addEventListener('pointerup', this._boundOnPointerUp as EventListener);
  }

  public detach(target: GlobalEventHandlers = window): void {
    target.removeEventListener('keydown', this._boundOnKeyDown as EventListener);
    target.removeEventListener('keyup', this._boundOnKeyUp as EventListener);
    target.removeEventListener('pointermove', this._boundOnPointerMove as EventListener);
    target.removeEventListener('pointerdown', this._boundOnPointerDown as EventListener);
    target.removeEventListener('pointerup', this._boundOnPointerUp as EventListener);
  }

  private onKeyDown(e: KeyboardEvent): void { this._rawKeys.add(e.code); }
  private onKeyUp(e: KeyboardEvent): void { this._rawKeys.delete(e.code); }
  
  private onPointerMove(e: PointerEvent): void {
    // 実際のキャンバス内座標への変換は後続のScaleManagerとの連携が必要ですが、一旦スクリーン座標
    this.pointerX = e.clientX;
    this.pointerY = e.clientY;
  }
  private onPointerDown(): void { this._rawPointerDown = true; }
  private onPointerUp(): void { this._rawPointerDown = false; }

  public update(): void {
    // Keyboard
    this._previousKeys.clear();
    for (const key of this._currentKeys) this._previousKeys.add(key);
    this._currentKeys.clear();
    for (const key of this._rawKeys) this._currentKeys.add(key);

    // Pointer
    this._previousPointerDown = this._currentPointerDown;
    this._currentPointerDown = this._rawPointerDown;

    // Gamepad (Polling)
    if (typeof navigator !== 'undefined' && navigator.getGamepads) {
      const pads = navigator.getGamepads();
      for (let i = 0; i < pads.length; i++) {
        const pad = pads[i];
        if (!pad) continue;
        
        // 前フレームのボタン状態を保存
        if (!this._previousGamepadButtons[i]) {
          this._previousGamepadButtons[i] = new Array(pad.buttons.length).fill(false);
        } else {
          // 現在のGamepads状態（this._gamepads）を前フレームとして記録
          const oldPad = this._gamepads[i];
          if (oldPad) {
            for (let b = 0; b < oldPad.buttons.length; b++) {
              this._previousGamepadButtons[i][b] = oldPad.buttons[b].pressed;
            }
          }
        }
      }
      // Shallow copy the array
      this._gamepads = Array.from(pads);
    }
  }

  // --- API ---

  public isKeyPressed(code: string): boolean { return this._currentKeys.has(code); }
  public isKeyJustPressed(code: string): boolean { return this._currentKeys.has(code) && !this._previousKeys.has(code); }
  
  public isPointerDown(): boolean { return this._currentPointerDown; }
  public isPointerJustPressed(): boolean { return this._currentPointerDown && !this._previousPointerDown; }

  /** 
   * Gamepadの指定ボタンが押されているか (buttonIndex: 0=A, 1=B, etc)
   */
  public isGamepadButtonPressed(padIndex: number, buttonIndex: number): boolean {
    const pad = this._gamepads[padIndex];
    if (!pad || !pad.buttons[buttonIndex]) return false;
    return pad.buttons[buttonIndex].pressed;
  }

  /**
   * Gamepadのアナログスティックの値を取得します
   * @param padIndex コントローラー番号 (0~)
   * @param axisIndex 軸番号 (0=左X, 1=左Y, 2=右X, 3=右Y)
   */
  public getGamepadAxis(padIndex: number, axisIndex: number): number {
    const pad = this._gamepads[padIndex];
    if (!pad || pad.axes.length <= axisIndex) return 0;
    const val = pad.axes[axisIndex];
    // デッドゾーン処理 (0.1)
    return Math.abs(val) > 0.1 ? val : 0;
  }
}
