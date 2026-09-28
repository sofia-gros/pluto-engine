/**
 * @file SoundManager.ts
 * @description
 * Web Audio API を使用したサウンドマネージャー。
 * 動的メモリ確保を避けるため、GainNodeやPannerNodeなどをプーリングして使い回します。
 */

export interface PlayOptions {
  volume?: number;
  loop?: boolean;
  x?: number;
  y?: number;
  z?: number;
}

export class Voice {
  private context: AudioContext;
  private panner: PannerNode;
  private gain: GainNode;

  public isPlaying: boolean = false;
  private source: AudioBufferSourceNode | null = null;
  private onEndedCallback: () => void;

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
      this.source = null;
    };
  }

  public play(buffer: AudioBuffer, options?: PlayOptions): void {
    this.isPlaying = true;

    this.source = this.context.createBufferSource();
    this.source.buffer = buffer;
    this.source.loop = options?.loop ?? false;
    this.source.connect(this.panner);

    this.gain.gain.value = options?.volume ?? 1.0;

    this.x = options?.x ?? 0;
    this.y = options?.y ?? 0;
    this.z = options?.z ?? 0;

    this.source.onended = this.onEndedCallback;
    this.source.start(0);
  }

  public stop(): void {
    if (this.isPlaying && this.source) {
      this.source.stop();
      this.isPlaying = false;
    }
  }

  public get x(): number {
    return this.panner.positionX.value;
  }
  public set x(val: number) {
    this.panner.positionX.value = val;
  }

  public get y(): number {
    return this.panner.positionY.value;
  }
  public set y(val: number) {
    this.panner.positionY.value = val;
  }

  public get z(): number {
    return this.panner.positionZ.value;
  }
  public set z(val: number) {
    this.panner.positionZ.value = val;
  }

  public get volume(): number {
    return this.gain.gain.value;
  }
  public set volume(val: number) {
    this.gain.gain.value = val;
  }
}

export interface AudioConfig {
  defaultVolume?: number;
  poolSize?: number;
}

export class SoundManager {
  public context: AudioContext;
  private masterGain: GainNode;
  private compressor: DynamicsCompressorNode;

  private buffers: Map<string, AudioBuffer> = new Map();
  private voicePool: Voice[] = [];

  private _defaultVolume = 1.0;

  constructor(config: AudioConfig = {}) {
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();

    this.compressor = this.context.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-24, this.context.currentTime);
    this.compressor.knee.setValueAtTime(30, this.context.currentTime);
    this.compressor.ratio.setValueAtTime(12, this.context.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.context.currentTime);
    this.compressor.release.setValueAtTime(0.25, this.context.currentTime);

    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = this._defaultVolume;

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.context.destination);

    const poolSize = config.poolSize ?? 32;
    for (let i = 0; i < poolSize; i++) {
      this.voicePool.push(new Voice(this.context, this.masterGain));
    }
  }

  public setConfig(config: AudioConfig): void {
    if (config.defaultVolume !== undefined) {
      this._defaultVolume = config.defaultVolume;
      this.masterGain.gain.value = this._defaultVolume;
    }
  }

  public addBuffer(key: string, buffer: AudioBuffer): void {
    this.buffers.set(key, buffer);
  }

  public async loadAudioData(key: string, audioData: ArrayBuffer): Promise<void> {
    const buffer = await this.context.decodeAudioData(audioData);
    this.buffers.set(key, buffer);
  }

  public play(key: string, options?: PlayOptions): Voice | null {
    const buffer = this.buffers.get(key);
    if (!buffer) {
      console.warn(`SoundManager: Buffer not found for key: ${key}`);
      return null;
    }

    let voice: Voice | null = null;
    for (let i = 0; i < this.voicePool.length; i++) {
      if (!this.voicePool[i].isPlaying) {
        voice = this.voicePool[i];
        break;
      }
    }

    if (!voice) {
      return null;
    }

    voice.play(buffer, options);
    return voice;
  }

  public setListenerPosition(x: number, y: number, z: number = 100): void {
    const listener = this.context.listener;
    if (listener.positionX) {
      listener.positionX.value = x;
      listener.positionY.value = y;
      listener.positionZ.value = z;
    } else {
      listener.setPosition(x, y, z);
    }
  }
}
