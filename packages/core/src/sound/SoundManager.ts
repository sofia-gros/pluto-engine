/**
 * @file SoundManager.ts
 * @description
 * Web Audio API を使った Phaser 互換サウンドマネージャー。
 *
 * 設計方針:
 *  - `Voice` を固定長プールで持ち、再生ごとに `PannerNode` / `GainNode` を作りません。
 *    唯一やむを得ないのが `AudioBufferSourceNode` で、これは Web Audio の仕様上
 *    再生ごとに生成が必須です (1 再生 1 new)。
 *  - キーで管理する音频は `Map` に入れています。登録は起動時にOccursり、
 *    毎フレームの走査で new はありません。
 *  - `play()` は毎フレーム呼べますが、内部の確保は `AudioBufferSourceNode` 1 個だけです。
 *
 * Phaser との差分:
 *  - `AudioSprite` は実装しません。`SoundManager` が既に「1 キーで複数同時再生」できる
 *    ので、同じ用途に使う音源が重複しない 1 本の Voice で足ります。
 *  - `Sound` オブジェクトへの `setVolume` / `stop` / `isPlaying` は `SoundHandle` として
 *    返します。Phaser の `Sound` は毎フレーム生成されるオブジェクトですが、
 *    こちらはプール済みの `Voice` をそのまま返すので new は発生しません。
 */

/** 再生の指定。Phaser の config と同じ形です。 */
export interface PlayOptions {
  /** 音量 0〜1 */
  volume?: number;
  /** ループするか */
  loop?: boolean;
  /** 音速 playbackRate 1.0 = 等倍 */
  rate?: number;
  /** 音源の横幅秒数。rate を上書きします */
  seek?: number;
  /** 音源の再生開始位置 (秒) */
  delay?: number;
  /** 音源の X 座標 (3D 配置用) */
  x?: number;
  /** 音源の Y 座標 (3D 配置用) */
  y?: number;
  /** 音源の Z 座標 (3D 配置用) */
  z?: number;
  /** 再生中の bool を反転してミュートするか */
  mute?: boolean;
  /** 再生ループ的回数を指定 (loop: true のときのみ有効) */
  loops?: number;
  /** フェードイン (ms)。フェードアウトは非対応です。 */
  fadeIn?: number;
}

/** SoundManager の構成値。 */
export interface AudioConfig {
  /** master gain の初期値 0〜1 */
  defaultVolume?: number;
  /** Voice プールの数 */
  poolSize?: number;
  /** リスナーの初期位置 X */
  listenerX?: number;
  /** リスナーの初期位置 Y */
  listenerY?: number;
  /** リスナーの初期位置 Z */
  listenerZ?: number;
}

/**
 * 再生 1 本を表すハンドル。
 *
 * 内部的にはプール済みの {@link Voice} をそのまま公開するので、
 * `play()` が返した後も new は発生しません。
 */
export class SoundHandle {
  /**
   * Voice プール内のインデックス。-1 は未割当を示します。
   *
   * **own property はこの値と `_manager` の 2 個だけ** (掟 R-03)。
   * Voice 自体は SoundManager のプールが使い回すため、
   * ハンドル側はインデックスしか保持しません。
   */
  public voiceIndex: number;

  private _manager: SoundManager;

  constructor(manager: SoundManager, voiceIndex: number) {
    this._manager = manager;
    this.voiceIndex = voiceIndex;
  }

  /**
   * 再生中のキー名。未割当または停止済みなら空文字です。
   * 文字列への参照を own property として持たない点が掟 R-03 違反を避ける鍵です。
   */
  public get key(): string {
    const v = this._voice;
    return v === null ? '' : v.key;
  }

  /** 割当中の Voice。未割当なら null */
  private get _voice(): Voice | null {
    return this._manager.getVoiceByIndex(this.voiceIndex);
  }

  /** 再生中か */
  public get isPlaying(): boolean {
    const v = this._voice;
    return v !== null && v.isPlaying;
  }

  /** 一時停止中か */
  public get isPaused(): boolean {
    const v = this._voice;
    return v !== null && v.paused;
  }

  /** 音量 0〜1 */
  public get volume(): number {
    const v = this._voice;
    return v === null ? 0 : v.volume;
  }
  public set volume(val: number) {
    const v = this._voice;
    if (v !== null) v.volume = val;
  }

  /** 再生速度倍率 (1.0 = 等速) */
  public get rate(): number {
    const v = this._voice;
    return v === null ? 1 : v.rate;
  }
  public set rate(val: number) {
    const v = this._voice;
    if (v !== null) v.rate = val;
  }

  /** 再生位置 (秒) */
  public get seek(): number {
    const v = this._voice;
    return v === null ? 0 : v.seek;
  }
  public set seek(val: number) {
    const v = this._voice;
    if (v !== null) v.seek = val;
  }

  /** ループ再生するか */
  public get loop(): boolean {
    const v = this._voice;
    return v !== null && v.loop;
  }
  public set loop(val: boolean) {
    const v = this._voice;
    if (v !== null) v.loop = val;
  }

  /** 再生中なら停止し、ハンドルを解放します */
  public stop(): void {
    const v = this._voice;
    if (v === null) return;
    v.stop();
    this.voiceIndex = -1;
  }

  /** 一時停止します */
  public pause(): void {
    const v = this._voice;
    if (v !== null) v.pause();
  }

  /** 一時停止を解除します */
  public resume(): void {
    const v = this._voice;
    if (v !== null) v.resume();
  }

  /** 音源の X 座標 */
  public get x(): number {
    const v = this._voice;
    return v === null ? 0 : v.x;
  }
  public set x(val: number) {
    const v = this._voice;
    if (v !== null) v.x = val;
  }

  /** 音源の Y 座標 */
  public get y(): number {
    const v = this._voice;
    return v === null ? 0 : v.y;
  }
  public set y(val: number) {
    const v = this._voice;
    if (v !== null) v.y = val;
  }

  /** 音源の Z 座標 */
  public get z(): number {
    const v = this._voice;
    return v === null ? 0 : v.z;
  }
  public set z(val: number) {
    const v = this._voice;
    if (v !== null) v.z = val;
  }

  /**
   * 同じキーの音源を再生し直します。
   * 再生中に呼ぶと 2 本目として扱われます (Phaser と同じ挙動です)。
   */
  public play(): SoundHandle {
    const key = this.key;
    if (key === '') return this;
    this.stop();
    const next = this._manager.playVoice(key, this._voiceOptions());
    this.voiceIndex = next === null ? -1 : this._manager.indexOfVoice(next);
    return this;
  }

  /** 音量を更新しつつ再生中の状態を保ちます */
  public setVolume(val: number): this {
    this.volume = val;
    return this;
  }

  /** 再生速度を設定します (Phaser 互換の `setRate`) */
  public setRate(val: number): this {
    this.rate = val;
    return this;
  }

  /** 再生位置を設定します (Phaser 互換の `setSeek`) */
  public setSeek(val: number): this {
    this.seek = val;
    return this;
  }

  /** ループを設定します (Phaser 互換の `setLoop`) */
  public setLoop(val: boolean): this {
    this.loop = val;
    return this;
  }

  /** 再生中なら停止します (Phaser 互換の `destroy`) */
  public destroy(): this {
    this.stop();
    return this;
  }

  /** playAudioSprite の引数に流した値を保持します。 */
  private _voiceOptions(): PlayOptions {
    const v = this._voice;
    if (v === null) return { volume: 0 };
    return {
      volume: v.volume,
      x: v.x,
      y: v.y,
      z: v.z,
      loop: v.loop,
      rate: v.rate,
    };
  }
}

/**
 * 再生ボイス 1 本。
 *
 * `PannerNode` と `GainNode` は生成時に 1 度だけ作り、以降は書き換えるだけです。
 * `AudioBufferSourceNode` だけは再生ごとに生成します (Web Audio の仕様上の制約)。
 */
export class Voice {
  private context: AudioContext;
  private panner: PannerNode;
  private gain: GainNode;

  /** 再生中か */
  public isPlaying = false;
  /** ループ再生中か */
  public loop = false;
  /** 一時停止中か (Phaser 互換の `pause` / `resume`) */
  public paused = false;
  /** 再生速度倍率 (1.0 = 等速) */
  public rate = 1;
  /** 再生位置 (秒)。`AudioBufferSourceNode` の能力上、停止中のみ変更できます。 */
  public seek = 0;
  /** 再生中のキー名。stopByKey() が voice 側を照合するために持ちます。 */
  public key = '';
  /** フェードインで減衰している途中なら true */
  public fadingIn = false;

  private source: AudioBufferSourceNode | null = null;
  private onEndedCallback: () => void;
  private fadeGain = 1.0;
  private _startTime = 0;

  constructor(context: AudioContext, destination: AudioNode) {
    this.context = context;

    this.panner = context.createPanner();
    this.panner.panningModel = 'HRTF';
    this.panner.distanceModel = 'inverse';
    this.panner.refDistance = 100;
    this.panner.maxDistance = 10000;
    this.panner.rolloffFactor = 1;

    this.gain = context.createGain();

    this.panner.connect(this.gain);
    this.gain.connect(destination);

    this.onEndedCallback = () => {
      this.isPlaying = false;
      this.fadingIn = false;
      this.source = null;
    };
  }

  /**
   * 再生を開始します。
   *
   * @param buffer 再生する音声データ
   * @param options 再生の指定
   */
  public play(buffer: AudioBuffer, options?: PlayOptions): void {
    // 既に再生中なら使い回さずに作り直します (1 再生 1 source の制約)。
    if (this.source !== null) {
      try {
        this.source.onended = null;
        this.source.stop();
      } catch {
        // 既に停止済みの source に対する stop は例外になるので無視します。
      }
    }

    this.isPlaying = true;
    this.loop = options?.loop ?? false;

    const src = this.context.createBufferSource();
    src.buffer = buffer;
    src.loop = this.loop;

    let rate = options?.rate ?? this.rate;
    if (options?.seek !== undefined && buffer.duration > 0) {
      // 横幅指定があれば再生速度から逆算します (Phaser と同じ考え方です)。
      rate = buffer.duration / options.seek;
    }
    src.playbackRate.value = rate;
    this.rate = rate;
    this.seek = options?.seek ?? 0;
    this.paused = false;

    src.connect(this.panner);
    src.onended = this.onEndedCallback;
    this.source = src;

    this.fadeGain = 1.0;
    if (options?.mute === true) {
      this.fadeGain = 0.0;
    }
    this.gain.gain.value = (options?.volume ?? 1.0) * this.fadeGain;

    this.x = options?.x ?? 0;
    this.y = options?.y ?? 0;
    this.z = options?.z ?? 0;

    // フェードインは開始時刻からの線形ランプで表します。setValueCurve は
    // 呼び出しごとに new が要るため、毎フレームの value 書き込みで済ませます。
    if (options?.fadeIn !== undefined && options.fadeIn > 0) {
      this.fadingIn = true;
      this.gain.gain.cancelScheduledValues(this.context.currentTime);
      this.gain.gain.setValueAtTime(0, this.context.currentTime);
      this._fadeFrom = 0;
      this._fadeTo = options.volume ?? 1.0;
      this._fadeDuration = options.fadeIn;
    } else {
      this._fadeFrom = 0;
      this._fadeTo = 0;
      this._fadeDuration = 0;
    }

    this._startTime = this.context.currentTime;
    src.start(0, options?.delay ?? 0);
  }

  private _fadeFrom = 0;
  private _fadeTo = 0;
  private _fadeDuration = 0;

  /**
   * フェードインを進めます。
   * SoundManager から毎フレーム 1 回だけ呼ばれます。
   *
   * @param now AudioContext の現在時刻
   */
  public updateFade(now: number): void {
    if (!this.fadingIn) return;
    const t = (now - this._startTime) / this._fadeDuration;
    if (t >= 1) {
      this.fadingIn = false;
      this.gain.gain.value = this._fadeTo;
      return;
    }
    this.gain.gain.value = this._fadeFrom + (this._fadeTo - this._fadeFrom) * t;
  }

  public stop(): void {
    if (this.source !== null) {
      try {
        this.source.onended = null;
        this.source.stop();
      } catch {
        // 既に停止済みの source に対する stop は例外になるので無視します。
      }
      this.source = null;
    }
    this.isPlaying = false;
    this.paused = false;
    this.fadingIn = false;
    this.seek = 0;
  }

  /** 一時停止前の再生速度。resume で復元します。 */
  private _rateBeforePause = 1;

  /**
   * 一時停止します (Phaser 互換の `pause`)。
   *
   * `AudioBufferSourceNode` は再生位置を直接操作できないため、
   * playbackRate を 0 にして実質停止させます。
   *
   */
  public pause(): void {
    if (!this.isPlaying || this.paused) return;
    this.paused = true;
    if (this.source !== null) {
      this._rateBeforePause = this.source.playbackRate.value;
      this.source.playbackRate.value = 0;
    }
  }

  /** 一時停止を解除します (Phaser 互換の `resume`)。 */
  public resume(): void {
    if (!this.paused) return;
    this.paused = false;
    if (this.source !== null) {
      this.source.playbackRate.value = this._rateBeforePause;
    }
  }

  /**
   * 再生速度を変更します (Phaser 互換の `setRate`)。
   * 一時停止中の場合は解除時に適用する値を更新します。
   */
  public setRate(value: number): void {
    if (value <= 0) return;
    this.rate = value;
    if (this.paused) {
      this._rateBeforePause = value;
      return;
    }
    if (this.source !== null) this.source.playbackRate.value = value;
  }

  /**
   * 再生位置を変更します (Phaser 互換の `setSeek`)。
   *
   * `AudioBufferSourceNode` の再生位置は start() の offset 引数でのみ
   * 指定できるため、**停止中のみ**有効です。
   */
  public setSeek(seconds: number): void {
    if (seconds < 0) return;
    this.seek = seconds;
  }

  /** 音源の X 座標 */
  public get x(): number {
    return this.panner.positionX.value;
  }
  public set x(val: number) {
    this.panner.positionX.value = val;
  }

  /** 音源の Y 座標 */
  public get y(): number {
    return this.panner.positionY.value;
  }
  public set y(val: number) {
    this.panner.positionY.value = val;
  }

  /** 音源の Z 座標 */
  public get z(): number {
    return this.panner.positionZ.value;
  }
  public set z(val: number) {
    this.panner.positionZ.value = val;
  }

  /** 音量 0〜1 */
  public get volume(): number {
    return this.gain.gain.value;
  }
  public set volume(val: number) {
    this.gain.gain.value = val;
    if (this.fadingIn) this._fadeTo = val;
  }
}

/**
 * シーン単位のサウンドマネージャー。
 *
 * Phaser の `this.sound` に対応するファサードです。
 * コンストラクタでは `AudioContext` を 1 度だけ作るので、
 * 生成コストはシーン 1 あたり 1 回です。
 */
export class SoundManager {
  /** Web Audio のコンテキスト */
  public readonly context: AudioContext;

  private masterGain: GainNode;
  private compressor: DynamicsCompressorNode;

  private buffers = new Map<string, AudioBuffer>();
  private voicePool: Voice[] = [];
  /** key → そのキーで再生中の Voice。Phaser の get() 相当に使います。 */
  private active = new Map<string, SoundHandle>();

  private _defaultVolume = 1.0;
  private _muted = false;
  private _unlocked = false;
  private _paused = false;

  constructor(config: AudioConfig = {}) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctor === undefined) {
      throw new Error('Web Audio API が利用できません (AudioContext がありません)');
    }
    this.context = new Ctor();

    this.compressor = this.context.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-24, this.context.currentTime);
    this.compressor.knee.setValueAtTime(30, this.context.currentTime);
    this.compressor.ratio.setValueAtTime(12, this.context.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.context.currentTime);
    this.compressor.release.setValueAtTime(0.25, this.context.currentTime);

    this.masterGain = this.context.createGain();

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.context.destination);

    const poolSize = config.poolSize ?? 32;
    for (let i = 0; i < poolSize; i++) {
      this.voicePool.push(new Voice(this.context, this.masterGain));
    }

    if (config.defaultVolume !== undefined) {
      this._defaultVolume = config.defaultVolume;
    }
    this.masterGain.gain.value = this._defaultVolume;

    this.setListenerPosition(config.listenerX ?? 0, config.listenerY ?? 0, config.listenerZ ?? 100);
  }

  // ============================================================
  // 設定
  // ============================================================

  /**
   * 構成値の変更を反映します。
   * 既存の {@link setConfig} を Phaser 互換の命名へ揃えたものです。
   */
  public setConfig(config: AudioConfig): void {
    if (config.defaultVolume !== undefined) {
      this.setVolume(config.defaultVolume);
    }
  }

  /** master gain の音量 0〜1 */
  public get volume(): number {
    return this._defaultVolume;
  }
  public set volume(val: number) {
    this.setVolume(val);
  }

  /** master gain の音量を設定します。 */
  public setVolume(val: number): this {
    this._defaultVolume = Math.max(0, Math.min(1, val));
    this.masterGain.gain.value = this._defaultVolume;
    return this;
  }

  /** 全体のミュート状態 */
  public get mute(): boolean {
    return this._muted;
  }
  public set mute(val: boolean) {
    this.setMute(val);
  }

  /**
   * 全体をミュートします。
   * ミュート中も `play()` 自体は動き、 master gain だけを 0 にします。
   */
  public setMute(val: boolean): this {
    this._muted = val;
    this.masterGain.gain.value = val ? 0 : this._defaultVolume;
    return this;
  }

  /** AudioContext が動作状態か (ユーザー操作で解除されたか) */
  public get unlocked(): boolean {
    return this._unlocked;
  }

  /**
   * ブラウザの自動再生ポリシーにより停止している AudioContext を再開します。
   *
   * ブラウザの規約でユーザー操作orquないと呼べないため、
   * クリックなどのハンドラの中から呼ぶ想定です。
   */
  public unlock(): this {
    if (this.context.state === 'suspended') {
      void this.context.resume();
    }
    this._unlocked = this.context.state === 'running';
    return this;
  }

  /** ポーズ中か */
  public get paused(): boolean {
    return this._paused;
  }

  /**
   * 再生中をサスペンドします。
   *
   * AudioContext は 1 個しかないので、Voice ごとではなく context 全体をサスペンドします。
   * 再生位置は保持されるため、再開しても続きから鳴ります。
   */
  public pauseAll(): this {
    if (this.context.state === 'running') {
      void this.context.suspend();
    }
    this._paused = true;
    return this;
  }

  /** ポーズを解除します。 */
  public resumeAll(): this {
    if (this.context.state === 'suspended') {
      void this.context.resume();
    }
    this._paused = false;
    return this;
  }

  // ============================================================
  // 音声の登録
  // ============================================================

  /**
   * キー对应的音声データを登録します (Phaser の audio.add)。
   */
  public add(key: string, buffer: AudioBuffer): this {
    this.buffers.set(key, buffer);
    return this;
  }

  /**
   * エンコード済み音声データを変換して登録します。
   *
   * @param key 登録キー
   * @param audioData エンコード済みの ArrayBuffer
   */
  public async loadAudioData(key: string, audioData: ArrayBuffer): Promise<void> {
    const buffer = await this.context.decodeAudioData(audioData);
    this.buffers.set(key, buffer);
  }

  /**
   * 登録済みの音声を削除します (Phaser の audio.remove)。
   *
   * @returns 削除できたら true
   */
  public remove(key: string): boolean {
    this.stopByKey(key);
    return this.buffers.delete(key);
  }

  /** キーが登録されているか */
  public exists(key: string): boolean {
    return this.buffers.has(key);
  }

  // ============================================================
  // 再生
  // ============================================================

  /**
   * 空いている Voice を 1 つ確保します。
   * プールが尽きた場合は null を返します。
   */
  private _acquireVoice(): Voice | null {
    for (let i = 0; i < this.voicePool.length; i++) {
      if (!this.voicePool[i].isPlaying) return this.voicePool[i];
    }
    return null;
  }

  /**
   * プール内のインデックスから Voice を取得します (Flyweight 用)。
   * @returns 範囲外なら null
   */
  public getVoiceByIndex(index: number): Voice | null {
    if (index < 0 || index >= this.voicePool.length) return null;
    return this.voicePool[index];
  }

  /**
   * Voice をプール内のインデックスへ変換します (Flyweight 用)。
   * @returns 見つからなければ -1
   */
  public indexOfVoice(voice: Voice): number {
    for (let i = 0; i < this.voicePool.length; i++) {
      if (this.voicePool[i] === voice) return i;
    }
    return -1;
  }

  /**
   * 内部用。キーを指定して Voice を再生します。
   * {@link SoundHandle.play} から使います。
   */
  public playVoice(key: string, options?: PlayOptions): Voice | null {
    const buffer = this.buffers.get(key);
    if (buffer === undefined) {
      console.warn(`SoundManager: Buffer not found for key: ${key}`);
      return null;
    }
    const voice = this._acquireVoice();
    if (voice === null) return null;
    voice.key = key;
    voice.play(buffer, options);
    return voice;
  }

  /**
   * 音声を再生します (Phaser の this.sound.play)。
   *
   * **毎回の new は発生しません。** キーが違ってもハンドルは
   * 使い回しのプール (`_handlePool`) から借り、内部の `voiceIndex` を
   * 書き換えるだけなので、毎フレーム再生しても GC が発生しません。
   *
   * @param key 登録キー
   * @param config 再生の指定
   * @returns ハンドル。キーが未登録、またはプールが枯れている場合は null
   */
  public play(key: string, config?: PlayOptions): SoundHandle | null {
    const voice = this.playVoice(key, config);
    if (voice === null) return null;
    const handle = this._acquireHandle();
    handle.voiceIndex = this.indexOfVoice(voice);
    this.active.set(key, handle);
    return handle;
  }

  /**
   * 使い回しできる SoundHandle を 1 つ取得します。
   *
   * **貸出中でない**ハンドルだけを返します。
   * ボイスは同時に 1 本しか鳴らせないため、
   * 再生中のハンドルは貸出中として扱い、再利用しません
   * (同じハンドルを 2 つの呼び出し元に渡すと stop が衝突するため)。
   * 空きが無ければその時だけ new します (初回のみ発生)。
   */
  private _acquireHandle(): SoundHandle {
    for (let i = 0; i < this._handlePool.length; i++) {
      const h = this._handlePool[i];
      if (h.voiceIndex < 0) return h; // 停止済み
      const v = this.getVoiceByIndex(h.voiceIndex);
      // ボイスが鳴っていない = 貸出中でない
      if (v === null || !v.isPlaying) return h;
    }
    const created = new SoundHandle(this, -1);
    this._handlePool.push(created);
    return created;
  }

  /**
   * 使い回す SoundHandle のプール。
   * 再生中のハンドルは貸出中のため再利用しません。
   */
  private readonly _handlePool: SoundHandle[] = [];

  /**
   * 音量だけ変えた「別」として再生します (Phaser の playAudioSprite)。
   *
   * 返されたハンドルは 2 本目として管理されるので、
   * `stopByKey` などでまとめて止められます。
   */
  public playAudioSprite(key: string, config?: PlayOptions): SoundHandle | null {
    const options = config ?? {};
    // playAudioSprite は offset の割合で開始位置を指定します。
    // 内部の play() は delay (秒) を受け取るので割合を秒へ変換します。
    const buffer = this.buffers.get(key);
    let delay = options.delay ?? 0;
    if (options.seek !== undefined && buffer !== undefined && buffer.duration > 0) {
      delay = options.seek * buffer.duration;
    }
    // オブジェクト spread は new になるため、使い回しのバッファへ書き込みます
    const opts = this._audioSpriteOptions;
    opts.volume = options.volume;
    opts.loop = options.loop;
    opts.rate = options.rate;
    opts.mute = options.mute;
    opts.fadeIn = options.fadeIn;
    opts.x = options.x;
    opts.y = options.y;
    opts.z = options.z;
    opts.delay = delay;
    opts.seek = options.seek;
    return this.play(key, opts);
  }

  /**
   * playAudioSprite 用の一時オブジェクト。
   * spread による毎回の確保を避けるため、1 つだけ使い回します。
   */
  private readonly _audioSpriteOptions: PlayOptions = {};

  /**
   * 指定キーの再生を全部停止します (Phaser の stopByKey)。
   *
   * @returns 停止した本数
   */
  public stopByKey(key: string): number {
    let stopped = 0;
    for (let i = 0; i < this.voicePool.length; i++) {
      const v = this.voicePool[i];
      if (!v.isPlaying || v.key !== key) continue;
      v.stop();
      stopped++;
    }
    // 自然終了済みのハンドルが残っていれば、それもテーブルから落とします。
    const handle = this.active.get(key);
    if (handle !== undefined && !handle.isPlaying) this.active.delete(key);
    return stopped;
  }

  /**
   * 再生中のハンドルを取得します (Phaser の this.sound.get)。
   */
  public get(key: string): SoundHandle | null {
    return this.active.get(key) ?? null;
  }

  /**
   * そのキーが再生中か (Phaser の isPlaying)。
   */
  public isPlaying(key: string): boolean {
    const handle = this.active.get(key);
    if (handle === undefined) return false;
    if (!handle.isPlaying) {
      // 自然に終了したのでテーブルからも外します。
      this.active.delete(key);
      return false;
    }
    return true;
  }

  /** 再生中の総本数 */
  public get playingCount(): number {
    let n = 0;
    for (let i = 0; i < this.voicePool.length; i++) {
      if (this.voicePool[i].isPlaying) n++;
    }
    return n;
  }

  /** キーが登録されている数 */
  public get count(): number {
    return this.buffers.size;
  }

  /**
   * 全ての再生を停止し、登録済み音声も削除します (Phaser の removeAll / stopAll)。
   */
  public stopAll(): void {
    for (let i = 0; i < this.voicePool.length; i++) this.voicePool[i].stop();
    this.active.clear();
  }

  /**
   * 登録済み音声をすべて削除します (Phaser の removeAll)。
   */
  public removeAll(): void {
    this.stopAll();
    this.buffers.clear();
  }

  // ============================================================
  // 3D 配置
  // ============================================================

  /**
   * リスナーの位置を設定します。
   *
   * @param x リスナー X
   * @param y リスナー Y
   * @param z リスナー Z
   */
  public get listenerX(): number {
    return this.context.listener.positionX?.value ?? 0;
  }
  public set listenerX(v: number) {
    if (this.context.listener.positionX !== undefined) this.context.listener.positionX.value = v;
  }
  public get listenerY(): number {
    return this.context.listener.positionY?.value ?? 0;
  }
  public set listenerY(v: number) {
    if (this.context.listener.positionY !== undefined) this.context.listener.positionY.value = v;
  }
  public get listenerZ(): number {
    return this.context.listener.positionZ?.value ?? 0;
  }
  public set listenerZ(v: number) {
    if (this.context.listener.positionZ !== undefined) this.context.listener.positionZ.value = v;
  }

  public setListenerPosition(x: number, y: number, z = 100): this {
    const listener = this.context.listener;
    if (listener.positionX !== undefined) {
      listener.positionX.value = x;
      listener.positionY.value = y;
      listener.positionZ.value = z;
    } else {
      // 古い WebKit 向けのフォールバックです。
      const legacy = listener as unknown as {
        setPosition(x: number, y: number, z: number): void;
      };
      legacy.setPosition(x, y, z);
    }
    return this;
  }

  // ============================================================
  // 毎フレーム
  // ============================================================

  /**
   * 毎フレームの更新です。
   *
   * フェードインを進め、終了したハンドルをテーブルから落とします。
   * new は発生しません。
   *
   * @param now AudioContext の現在時刻 (省略時は内部の値を使います)
   */
  public update(now?: number): void {
    const t = now ?? this.context.currentTime;
    for (let i = 0; i < this.voicePool.length; i++) {
      const v = this.voicePool[i];
      if (v.fadingIn) v.updateFade(t);
    }

    // 終了したハンドルだけを確認するため、active を走査します。
    if (this.active.size === 0) return;
    for (const handle of this.active.values()) {
      if (!handle.isPlaying) this.active.delete(handle.key);
    }
  }

  /**
   * シーン破棄時の後片付けです。
   * AudioContext を閉じて解放します。
   */
  public destroy(): void {
    this.stopAll();
    this.buffers.clear();
    if (this.context.state !== 'closed') {
      void this.context.close();
    }
  }
}
