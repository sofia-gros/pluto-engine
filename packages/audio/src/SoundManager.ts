/**
 * @file SoundManager.ts
 * @description
 * Web Audio API を使用したサウンドマネージャー。
 * 動的メモリ確保を避けるため、GainNodeやPannerNodeなどをプーリングして使い回します。
 * （AudioBufferSourceNode は Web Audio API の仕様上再利用できないため、再生時に都度生成します）
 */

export interface PlayOptions {
  volume?: number;
  pan?: [number, number, number];
}

class VoiceNode {
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
    this.source.connect(this.panner);

    if (options?.volume !== undefined) {
      this.gain.gain.value = options.volume;
    } else {
      this.gain.gain.value = 1.0;
    }

    if (options?.pan) {
      const [x, y, z] = options.pan;
      this.panner.positionX.value = x;
      this.panner.positionY.value = y;
      this.panner.positionZ.value = z;
    } else {
      this.panner.positionX.value = 0;
      this.panner.positionY.value = 0;
      this.panner.positionZ.value = 0;
    }

    this.source.onended = this.onEndedCallback;
    this.source.start(0);
  }
}

export class SoundManager {
  public context: AudioContext;
  private masterGain: GainNode;
  private compressor: DynamicsCompressorNode;
  
  private buffers: Map<string, AudioBuffer> = new Map();
  private voicePool: VoiceNode[] = [];
  private poolSize = 32;

  constructor() {
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    this.compressor = this.context.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-24, this.context.currentTime);
    this.compressor.knee.setValueAtTime(30, this.context.currentTime);
    this.compressor.ratio.setValueAtTime(12, this.context.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.context.currentTime);
    this.compressor.release.setValueAtTime(0.25, this.context.currentTime);

    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = 1.0;

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.context.destination);

    for (let i = 0; i < this.poolSize; i++) {
      this.voicePool.push(new VoiceNode(this.context, this.masterGain));
    }
  }

  /**
   * オーディオバッファの追加
   */
  public addBuffer(key: string, buffer: AudioBuffer): void {
    this.buffers.set(key, buffer);
  }

  /**
   * ArrayBufferなどからデコードして追加
   */
  public async loadAudioData(key: string, audioData: ArrayBuffer): Promise<void> {
    const buffer = await this.context.decodeAudioData(audioData);
    this.buffers.set(key, buffer);
  }

  /**
   * サウンドの再生
   * @param key サウンドキー
   * @param options オプション（音量、位置など）
   */
  public play(key: string, options?: PlayOptions): void {
    const buffer = this.buffers.get(key);
    if (!buffer) {
      console.warn(`SoundManager: Buffer not found for key: ${key}`);
      return;
    }

    let voice: VoiceNode | undefined = undefined;
    for (let i = 0; i < this.poolSize; i++) {
      if (!this.voicePool[i].isPlaying) {
        voice = this.voicePool[i];
        break;
      }
    }

    if (!voice) {
      return;
    }

    voice.play(buffer, options);
  }
}
