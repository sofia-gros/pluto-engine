/**
 * @file InputManager.ts
 * @description
 * Ebitengine スタイルの同期クエリを提供する入力マネージャー。
 * DOM イベントから非同期に受け取った状態を、毎フレームの update() 時にラッチし、
 * ゲームロジック中に入力状態が途中で変わることを防ぎます。
 * キーボード、ポインタ (マウス/タッチ)、ゲームパッドに対応します。
 */

export type PointerTransform = (clientX: number, clientY: number, out: Float32Array) => void;

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

  public get timeDown(): number {
    return this._input.getKeyTimeDown(this.code);
  }
  public get timeUp(): number {
    return this._input.getKeyTimeUp(this.code);
  }
  public get duration(): number {
    return this._input.getKeyDuration(this.code);
  }

  // no-op for Phaser compat
  public enableCapture(): void {}
  public removeFrom(): void {}
  public addTo(): void {}
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
  /**
   * ワールド座標の X。
   * Phaser 互換のため `x` と同じゲーム座標を返します。
   * 変換前の画面座標が必要な場合は `screenX` を使ってください。
   */
  public get worldX(): number {
    return this._input.worldPointerX;
  }
  /** ワールド座標の Y。`y` と同じゲーム座標を返します */
  public get worldY(): number {
    return this._input.worldPointerY;
  }
  /** 変換前の画面座標の X (CSS ピクセル) */
  public get screenX(): number {
    return this._input.clientX;
  }
  /** 変換前の画面座標の Y (CSS ピクセル) */
  public get screenY(): number {
    return this._input.clientY;
  }
  /** ポインタ ID。単一ポインタのため常に 0 */
  public get pointerId(): number {
    return this._input.pointerId;
  }
  /** 前フレームからの移動量 X */
  public get movementX(): number {
    return this._input.pointerX - this._input.prevPointerX;
  }
  /** 前フレームからの移動量 Y */
  public get movementY(): number {
    return this._input.pointerY - this._input.prevPointerY;
  }
  /** 前フレームからの移動量 X (`movementX` と同値) */
  public get dx(): number {
    return this._input.pointerX - this._input.prevPointerX;
  }
  /** 前フレームからの移動量 Y (`movementY` と同値) */
  public get dy(): number {
    return this._input.pointerY - this._input.prevPointerY;
  }
  /** 移動速度 X (座標 / 秒) */
  public get velocityX(): number {
    return this._input.pointerVelocityX;
  }
  /** 移動速度 Y (座標 / 秒) */
  public get velocityY(): number {
    return this._input.pointerVelocityY;
  }
  /** 移動方向 (ラジアン、+X 方向が 0) */
  public get angle(): number {
    return this._input.pointerAngle;
  }
  /** ボタン押下からの累積移動距離 */
  public get distance(): number {
    return this._input.pointerDistance;
  }
  /** ボタンが押された位置の X */
  public get downX(): number {
    return this._input.downPointerX;
  }
  /** ボタンが押された位置の Y */
  public get downY(): number {
    return this._input.downPointerY;
  }
  /** ボタンが離された位置の X */
  public get upX(): number {
    return this._input.upPointerX;
  }
  /** ボタンが離された位置の Y */
  public get upY(): number {
    return this._input.upPointerY;
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

/**
 * Phaser 4 互換のゲームパッドハンドル。
 *
 * 設計上の掟 (R-03): own property は `index` と `_input` の 2 個だけ。
 * 接続状態は InputManager 側の SoA とブラウザの Gamepad 参照が正本です。
 */
export class GamepadHandle {
  /** コントローラー番号 (0 から) */
  public readonly index: number;

  private readonly _input: InputManager;

  constructor(index: number, input: InputManager) {
    this.index = index;
    this._input = input;
  }

  /** このスロットにゲームパッドが接続されているか */
  get connected(): boolean {
    return this._input.getGamepadConnected(this.index);
  }

  /** 接続済みならブラウザの Gamepad オブジェクトを返す */
  get native(): Gamepad | null {
    return this._input.getGamepadNative(this.index);
  }

  /** ゲームパッドの識別名 (Phaser 互換の `id`) */
  get id(): string {
    const pad = this.native;
    return pad ? pad.id : '';
  }

  /** ゲームパッドのボタン数 */
  get buttons(): number {
    const pad = this.native;
    return pad ? pad.buttons.length : 0;
  }

  /** アナログ軸の数 */
  get axes(): number {
    const pad = this.native;
    return pad ? pad.axes.length : 0;
  }

  /**
   * ボタンが押されているか (Phaser 互換の `isDown`)。
   * @param buttonIndex 0=A, 1=B, ...
   */
  isDown(buttonIndex: number): boolean {
    return this._input.isGamepadButtonPressed(this.index, buttonIndex);
  }

  /** ボタンが今フレームで押されたか */
  isJustDown(buttonIndex: number): boolean {
    return this._input.isGamepadButtonJustPressed(this.index, buttonIndex);
  }

  /** ボタンが今フレームで離されたか */
  isJustUp(buttonIndex: number): boolean {
    return this._input.isGamepadButtonJustReleased(this.index, buttonIndex);
  }

  /**
   * アナログ軸の値 (0=左X, 1=左Y, 2=右X, 3=右Y)。
   * デッドゾーン (0.1) は入力側で処理済みです。
   */
  getAxis(axisIndex: number): number {
    return this._input.getGamepadAxis(this.index, axisIndex);
  }

  /** デバッグ用の文字列表現 */
  toString(): string {
    return `Gamepad(${this.index})`;
  }
}

export class InputManager {
  // --- Keyboard ---
  private _rawKeys = new Set<string>();
  private _timeDownMap = new Map<string, number>();
  private _timeUpMap = new Map<string, number>();
  private _currentTimeMs = 0;
  private _currentKeys = new Set<string>();
  private _previousKeys = new Set<string>();

  // --- Pointer (Mouse/Touch) ---
  /** 変換後のワールド/キャンバス座標 */
  public pointerX = 0;
  public pointerY = 0;
  /** 変換前の画面座標 (CSS ピクセル) */
  public clientX = 0;
  public clientY = 0;
  /** 前フレームのワールド座標。dx / dy の算出に使う */
  public prevPointerX = 0;
  public prevPointerY = 0;
  /** ボタンが押された位置 (ワールド座標) */
  public downPointerX = 0;
  public downPointerY = 0;
  /** ボタンが離された位置 (ワールド座標) */
  public upPointerX = 0;
  public upPointerY = 0;
  /** 移動速度 (ワールド座標 / 秒) */
  public pointerVelocityX = 0;
  public pointerVelocityY = 0;
  public worldPointerX = 0;
  public worldPointerY = 0;
  /** ボタン押下からの累積移動距離 (ワールド座標) */
  public pointerDistance = 0;
  /** 現在の移動方向 (ラジアン、+X 方向が 0) */
  public pointerAngle = 0;
  /** ポインタ ID。単一ポインタのため常に 0 */
  public pointerId = 0;
  private _rawPointerDown = false;
  private _currentPointerDown = false;
  private _previousPointerDown = false;
  private _rawPointerX = 0;
  private _rawPointerY = 0;
  /** 押下からの累積距離の基準点。押下中か離された直後だけ有効 */
  private _distanceOriginX = 0;
  private _distanceOriginY = 0;

  /**
   * 画面座標からゲーム座標へ変換する関数。
   * ScaleManager が設定し、未設定の場合は画面座標をそのまま渡します。
   */
  public pointerTransform: PointerTransform | null = null;
  private readonly _pointerScratch = new Float32Array(2);

  // --- Gamepad ---
  // Gamepad API は毎フレーム navigator.getGamepads() をポーリングする仕様です。
  // ブラウザの Gamepad  型は、同名の Flyweight クラスと衝突するため
  // globalThis 経由の完全修飾で参照します。
  private _gamepads: (Gamepad | null)[] = [];
  private _currentGamepadButtons: boolean[][] = [];
  private _previousGamepadButtons: boolean[][] = [];
  /** 生成済みの Gamepad ハンドル。index -> Gamepad の対応です。 */
  private _gamepadHandles: GamepadHandle[] = [];
  /** `getAllGamepads` が引数なしで使う返信用バッファ。 */
  private readonly _gamepadHandleBuffer: (GamepadHandle | null)[] = [];

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

  /**
   * 毎フレーム 1 回、入力状態を更新します。
   * @param dtSeconds 前フレームからの経過秒数。速度の算出に使います。
   *   未指定や 0 の場合は生の移動量を速度として扱います。
   */
  public update(dtSeconds = 0): void {
    this._currentTimeMs += dtSeconds * 1000;
    // Keyboard
    this._previousKeys.clear();
    for (const key of this._currentKeys) this._previousKeys.add(key);
    this._currentKeys.clear();
    for (const key of this._rawKeys) this._currentKeys.add(key);

    // Pointer: 座標変換はフレーム内で一度だけ行う
    this.prevPointerX = this.pointerX;
    this.prevPointerY = this.pointerY;
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

    // 速度・角度・累積距離。Phaser 互換の派生値
    const dx = this.pointerX - this.prevPointerX;
    const dy = this.pointerY - this.prevPointerY;
    if (dtSeconds > 0) {
      this.pointerVelocityX = dx / dtSeconds;
      this.pointerVelocityY = dy / dtSeconds;
    } else {
      // dt が不明なら生 の移動量をそのまま速度扱いする
      this.pointerVelocityX = dx;
      this.pointerVelocityY = dy;
    }
    if (dx !== 0 || dy !== 0) {
      this.pointerAngle = Math.atan2(dy, dx);
    }

    // 押下したフレームで累積距離の基準をリセットする
    if (this._currentPointerDown && !this._previousPointerDown) {
      this.downPointerX = this.pointerX;
      this.downPointerY = this.pointerY;
      this._distanceOriginX = this.pointerX;
      this._distanceOriginY = this.pointerY;
      this.pointerDistance = 0;
    } else if (!this._currentPointerDown && this._previousPointerDown) {
      this.upPointerX = this.pointerX;
      this.upPointerY = this.pointerY;
    }
    if (this._currentPointerDown) {
      const ddx = this.pointerX - this._distanceOriginX;
      const ddy = this.pointerY - this._distanceOriginY;
      this.pointerDistance = Math.sqrt(ddx * ddx + ddy * ddy);
    }

    this.worldPointerX = this.pointerX;
    this.worldPointerY = this.pointerY;
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

  // --- Phaser 4 互換のゲームパッド API ---

  /**
   * 指定スロットにゲームパッドが接続されているか。
   * Gamepad ハンドルからの参照用に公開しています。
   */
  public getGamepadConnected(padIndex: number): boolean {
    return this._gamepads[padIndex] != null;
  }

  /**
   * 指定スロットのブラウザ Gamepad オブジェクトを返す。未接続なら null。
   * Gamepad ハンドルからの参照用に公開しています。
   */
  public getGamepadNative(padIndex: number): Gamepad | null {
    const pad = this._gamepads[padIndex];
    return pad === undefined ? null : pad;
  }

  /**
   * Gamepad API が利用可能か (Phaser 互換の `input.gamepad.supported`)。
   * navigator が無い環境 (SSR / テスト) では false を返します。
   */
  public get isGamepadSupported(): boolean {
    return typeof navigator !== 'undefined' && typeof navigator.getGamepads === 'function';
  }

  /**
   * 接続されているゲームパッドの数 (Phaser 互換の `input.gamepad.total`)。
   */
  public get gamepadTotal(): number {
    return this.getGamepadCount();
  }

  /**
   * 指定インデックスの Gamepad ハンドルを返します (Phaser 互換の `getPad`)。
   *
   * ハンドルは内部配列を使い回すため、同じインデックスでは常に同じ
   * インスタンスが返ります。接続されていない場合は null です。
   */
  public getGamepad(padIndex: number): GamepadHandle | null {
    return this._getGamepadHandle(padIndex);
  }

  /**
   * 接続されているゲームパッドのハンドルをまとめて返します
   * (Phaser 互換の `getAll`)。
   *
   * @param out 呼び出し側の使い回し配列。省略時は内部のバッファを使います。
   * @returns 接続中の Gamepad ハンドル (未接続のスロットは null)
   */
  public getAllGamepads(out?: (GamepadHandle | null)[]): (GamepadHandle | null)[] {
    const target = out ?? this._gamepadHandleBuffer;
    const n = this._gamepads.length;
    for (let i = 0; i < n; i++) {
      target[i] = this._getGamepadHandle(i);
    }
    target.length = n;
    return target;
  }

  /**
   * 内部バッファを、必要に応じて拡張しつつ Gamepad ハンドルを取得します。
   */
  private _getGamepadHandle(padIndex: number): GamepadHandle | null {
    if (padIndex < 0) return null;
    if (padIndex >= this._gamepadHandles.length) {
      for (let i = this._gamepadHandles.length; i <= padIndex; i++) {
        this._gamepadHandles.push(new GamepadHandle(i, this));
      }
    }
    return this._gamepadHandles[padIndex];
  }
}

/** Phaser 4 互換の公開名。内部では GamepadHandle と呼びます。 */
export { GamepadHandle as Gamepad };
