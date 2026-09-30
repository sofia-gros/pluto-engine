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

/**
 * キー 1 個分の参照ハンドル (Phaser 互換の Key)。
 *
 * 状態は InputManager 内の Set を参照するため、
 * このインスタンスは own プロパティを code と _input の 2 つだけ持ちます。
 */
export class Key {
  /** KeyboardEvent.code (例: 'KeyW', 'ArrowUp') */
  public readonly code: string;
  private readonly _input: InputManager;

  constructor(code: string, input: InputManager) {
    this.code = code;
    this._input = input;
  }

  /** 押されているか */
  public get isDown(): boolean {
    return this._input.isKeyPressed(this.code);
  }
  /** このフレームで押されたか */
  public get isJustDown(): boolean {
    return this._input.isKeyJustPressed(this.code);
  }
  /** このフレームで離されたか */
  public get isJustUp(): boolean {
    return this._input.isKeyJustReleased(this.code);
  }
}

/** 矢印キーなどの定型キーの集合 (Phaser 互換の cursorKeys) */
export interface CursorKeys {
  up: Key;
  down: Key;
  left: Key;
  right: Key;
  space: Key;
  shift: Key;
}

/**
 * ポインタの参照ハンドル (Phaser 互換の Pointer)。
 *
 * pluto-engine は単一ポインタのみを扱うため、座標と状態を
 * InputManager から参照するだけの薄い存在です。
 */
export class Pointer {
  private readonly _input: InputManager;
  /** 常に 0 です (単一ポインタのため) */
  public readonly id = 0;

  constructor(input: InputManager) {
    this._input = input;
  }

  /** ゲーム座標の X */
  public get x(): number {
    return this._input.pointerX;
  }
  /** ゲーム座標の Y */
  public get y(): number {
    return this._input.pointerY;
  }
  /** 画面座標の X (CSS ピクセル) */
  public get worldX(): number {
    return this._input.clientX;
  }
  /** 画面座標の Y (CSS ピクセル) */
  public get worldY(): number {
    return this._input.clientY;
  }
  public get isDown(): boolean {
    return this._input.isPointerDown();
  }
  public get isJustDown(): boolean {
    return this._input.isPointerJustPressed();
  }
  public get isJustUp(): boolean {
    return this._input.isPointerJustReleased();
  }
  /** ボタン番号は無視され、常に左ボタン相当です */
  public get button(): number {
    return 0;
  }
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

  // --- Phaser 互換のファサード用キャッシュ ---
  /** 生成済みの Key ハンドル。code -> Key の対応です。 */
  private readonly _keyHandles = new Map<string, Key>();
  /** 矢印キーの集合。初回要求時に 1 度だけ生成します。 */
  private _cursorKeys: CursorKeys | null = null;
  /** 単一ポインタのハンドル。 */
  private readonly _primaryPointer: Pointer;

  constructor() {
    this._boundOnKeyDown = this.onKeyDown.bind(this);
    this._boundOnKeyUp = this.onKeyUp.bind(this);
    this._boundOnPointerMove = this.onPointerMove.bind(this);
    this._boundOnPointerDown = this.onPointerDown.bind(this);
    this._boundOnPointerUp = this.onPointerUp.bind(this);
    this._primaryPointer = new Pointer(this);
  }

  /**
   * キーボードのファサード (Phaser 互換の this.input.keyboard)。
   * this 自体を返します。
   */
  public get keyboard(): this {
    return this;
  }

  /**
   * ポインタのファサード (Phaser 互換の this.input)。
   * this 自体を返します。
   */
  public get pointer(): Pointer {
    return this._primaryPointer;
  }

  /**
   * ゲームパッドのファサード (Phaser 互換の this.input.gamepad)。
   * this 自体を返します。
   */
  public get gamepad(): this {
    return this;
  }

  /**
   * プライマリポインタ (Phaser 互換の activePointer)。
   */
  public get activePointer(): Pointer {
    return this._primaryPointer;
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

  // ============================================================
  // Phaser 互換のファサード
  // ============================================================

  /**
   * キーの参照ハンドルを生成します (Phaser 互換の this.input.keyboard.addKey)。
   *
   * 生成された Key は内部の Set と同じ状態を見ます。
   * 状態自体を複製しないため、毎フレーム new も発生しません。
   * 同じ code を複数回要求しても同じ Key インスタンスを返します。
   */
  public addKey(code: string): Key {
    let key = this._keyHandles.get(code);
    if (key === undefined) {
      key = new Key(code, this);
      this._keyHandles.set(code, key);
    }
    return key;
  }

  /**
   * 複数のキーをまとめて生成します (Phaser 互換の addKeys)。
   *
   * @param codes KeyboardEvent.code の配列、または単一文字列
   * @returns 生成した Key の配列
   */
  public addKeys(codes: string | string[]): Key[] {
    const list = typeof codes === 'string' ? [codes] : codes;
    const out: Key[] = [];
    for (let i = 0; i < list.length; i++) out.push(this.addKey(list[i]));
    return out;
  }

  /**
   * 矢印キーの Key 群を生成します (Phaser 互換の createCursorKeys)。
   */
  public createCursorKeys(): CursorKeys {
    if (this._cursorKeys === null) {
      this._cursorKeys = {
        up: this.addKey('ArrowUp'),
        down: this.addKey('ArrowDown'),
        left: this.addKey('ArrowLeft'),
        right: this.addKey('ArrowRight'),
        space: this.addKey('Space'),
        shift: this.addKey('ShiftLeft'),
      };
    }
    return this._cursorKeys;
  }

  /**
   * ポインタを追加します (Phaser 互換の addPointer)。
   *
   * pluto-engine は単一ポインタのみを扱うため、2 つ目以降は無視されます。
   * 戻り値は常に this.primaryPointer です。
   */
  public addPointer(_id?: number): Pointer {
    return this._primaryPointer;
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
