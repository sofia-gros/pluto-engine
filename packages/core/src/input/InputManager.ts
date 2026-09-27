/**
 * @file InputManager.ts
 * @description
 * Ebitengine スタイルの同期クエリを提供する入力マネージャー。
 * DOMイベントから非同期に受け取った状態を、毎フレームの update() 時にラッチ（固定）し、
 * ゲームロジック中に入力状態が途中で変わることを防ぎます。
 */

export class InputManager {
  // リアルタイムのDOMイベントで書き換わる状態
  private _rawKeys = new Set<string>();

  // 今フレームで固定された状態
  private _currentKeys = new Set<string>();
  // 1フレーム前の状態
  private _previousKeys = new Set<string>();

  private _boundOnKeyDown: (e: KeyboardEvent) => void;
  private _boundOnKeyUp: (e: KeyboardEvent) => void;

  constructor() {
    this._boundOnKeyDown = this.onKeyDown.bind(this);
    this._boundOnKeyUp = this.onKeyUp.bind(this);
  }

  /**
   * DOMイベントリスナーを登録します。
   */
  public attach(target: GlobalEventHandlers = window): void {
    target.addEventListener('keydown', this._boundOnKeyDown as EventListener);
    target.addEventListener('keyup', this._boundOnKeyUp as EventListener);
  }

  /**
   * DOMイベントリスナーを解除します。
   */
  public detach(target: GlobalEventHandlers = window): void {
    target.removeEventListener('keydown', this._boundOnKeyDown as EventListener);
    target.removeEventListener('keyup', this._boundOnKeyUp as EventListener);
  }

  private onKeyDown(e: KeyboardEvent): void {
    this._rawKeys.add(e.code);
  }

  private onKeyUp(e: KeyboardEvent): void {
    this._rawKeys.delete(e.code);
  }

  /**
   * フレームの最初に呼び出し、入力状態をラッチ（固定）します。
   * これにより、フレームの途中で非同期にキー状態が変わることを防ぎます。
   */
  public update(): void {
    // 現在のキー状態を前回にコピー
    this._previousKeys.clear();
    for (const key of this._currentKeys) {
      this._previousKeys.add(key);
    }

    // raw状態を現在のキー状態にコピー
    this._currentKeys.clear();
    for (const key of this._rawKeys) {
      this._currentKeys.add(key);
    }
  }

  /**
   * キーが押されているかどうかを判定します。
   * @param code KeyboardEvent.code (例: "Space", "ArrowUp")
   */
  public isKeyPressed(code: string): boolean {
    return this._currentKeys.has(code);
  }

  /**
   * 今フレームでキーが押された瞬間かどうかを判定します。
   */
  public isKeyJustPressed(code: string): boolean {
    return this._currentKeys.has(code) && !this._previousKeys.has(code);
  }

  /**
   * 今フレームでキーが離された瞬間かどうかを判定します。
   */
  public isKeyJustReleased(code: string): boolean {
    return !this._currentKeys.has(code) && this._previousKeys.has(code);
  }
}
