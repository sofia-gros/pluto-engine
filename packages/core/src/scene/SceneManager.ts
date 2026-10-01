/**
 * @file SceneManager.ts
 * @description
 * 複数の Scene を管理し、シーンの遷移と
 * 毎フレームの update / fixedUpdate のディスパッチを担当します。
 */

import type { PlutoEngine } from '../core/PlutoEngine';
import { DataRegistry } from '../events/DataRegistry';
import type { Scene } from './Scene';

export class SceneManager {
  private _scenes = new Map<string, Scene>();
  private _activeScene: Scene | null = null;
  /** 前面で動作しているシーン (HUD を並行させる場合に利用) */
  private _overlayScene: Scene | null = null;
  private _engine: PlutoEngine;

  /**
   * 全シーンで共有するグローバルデータストア。
   * シーンを跨いでスコアや進行度を渡す場合に使います。
   */
  public readonly registry = new DataRegistry();

  constructor(engine: PlutoEngine) {
    this._engine = engine;
  }

  public add(key: string, sceneClass: new () => Scene, autoStart = false): void {
    const scene = new sceneClass();
    scene.id = key;
    scene.scene = this;
    this._scenes.set(key, scene);

    if (autoStart) {
      this.start(key);
    }
  }

  /**
   * シーンが存在するか確認します (Phaser 互換の this.scene.isActive)。
   */
  public isActive(key: string): boolean {
    return this._scenes.has(key);
  }

  /**
   * シーンを取得します (Phaser 互換の this.scene.get)。
   */
  public get(key: string): Scene | null {
    return this._scenes.get(key) ?? null;
  }

  /**
   * シーンを開始します (Phaser 互換の this.scene.start)。
   *
   * `preload()` でキューに積まれたアセットがある場合は読み込みを待ってから
   * `create()` を呼びます。キューが空 (preload を使わないシーン) なら
   * await せずに同期的に進むので、既存の挙動は変わりません。
   */
  public start(key: string): void {
    const scene = this._scenes.get(key);
    if (!scene) throw new Error(`Scene ${key} not found.`);
    this._activeScene = scene;
    scene.sysInit(this._engine);

    if (scene.load.pendingCount === 0) {
      scene.sysCreate();
      return;
    }
    void scene.load.start().then(() => {
      // 待ちている間にシーンが停止されていたら create() は呼ばれません。
      if (this._activeScene !== scene) return;
      scene.sysCreate();
    });
  }

  /**
   * シーンを停止します (Phaser 互換の this.scene.stop)。
   *
   * 破棄はせずに一時停止させ、start() で再開できるようにします。
   */
  public stop(key: string): void {
    const scene = this._scenes.get(key);
    if (!scene) return;
    scene.sysShutdown();
    if (this._activeScene === scene) this._activeScene = null;
    if (this._overlayScene === scene) this._overlayScene = null;
  }

  /**
   * シーンを再初期化して開始します (Phaser 互換の this.scene.restart)。
   *
   * 一時停止状態を解除してから作り直します。
   */
  public restart(key: string): void {
    const scene = this._scenes.get(key);
    if (!scene) throw new Error(`Scene ${key} not found.`);
    scene.sysShutdown();
    scene.setPaused(false);
    this._activeScene = scene;
    scene.sysInit(this._engine);
    scene.sysCreate();
  }

  /**
   * シーンを一時停止します (Phaser 互換の this.scene.pause)。
   */
  public pause(key?: string): void {
    const scene = key === undefined ? this._activeScene : this._scenes.get(key);
    scene?.setPaused(true);
  }

  /**
   * シーンを再開します (Phaser 互換の this.scene.resume)。
   */
  public resume(key?: string): void {
    const scene = key === undefined ? this._activeScene : this._scenes.get(key);
    scene?.setPaused(false);
  }

  public switch(key: string): void {
    if (this._activeScene) {
      this._activeScene.sysShutdown();
    }
    this.start(key);
  }

  /**
   * HUD として前面で同時に動作させるシーンを登録します。
   */
  public setOverlay(key: string | null): void {
    if (key === null) {
      this._overlayScene?.sysShutdown();
      this._overlayScene = null;
      return;
    }
    const scene = this._scenes.get(key);
    if (!scene) throw new Error(`Scene ${key} not found.`);
    this._overlayScene = scene;
    scene.sysInit(this._engine);
    scene.sysCreate();
  }

  public get activeScene(): Scene | null {
    return this._activeScene;
  }

  public get overlayScene(): Scene | null {
    return this._overlayScene;
  }

  /**
   * 登録済みのシーンキーを返します。
   */
  public getKeys(): string[] {
    // 呼び出しは初期化時想定。実行中の毎フレーム呼び出しは避けること。
    const keys: string[] = [];
    this._scenes.forEach((_v, k) => keys.push(k));
    return keys;
  }

  /**
   * 全シーンを停止します。
   */
  public pauseAll(): void {
    this._activeScene?.setPaused(true);
    this._overlayScene?.setPaused(true);
  }

  public resumeAll(): void {
    this._activeScene?.setPaused(false);
    this._overlayScene?.setPaused(false);
  }

  /**
   * 固定ステップを能動シーンと前面シーンへ配信します。
   */
  public fixedUpdate(fixedDt: number): void {
    this._activeScene?.sysFixedUpdate(fixedDt);
    this._overlayScene?.sysFixedUpdate(fixedDt);
  }

  /**
   * 可変フレームの更新を能動シーンと前面シーンへ配信します。
   */
  public update(dt: number): void {
    this._activeScene?.sysUpdate(dt);
    this._overlayScene?.sysUpdate(dt);
  }
}
