// Sistema de sonido usando Web Audio API para evitar depender de archivos externos
class SoundSystem {
  private ctx: AudioContext | null = null;
  private audioBuffers: Record<string, AudioBuffer> = {};
  private muted: boolean = false;
  private volume: number = 0.8;
  private bgMusic: HTMLAudioElement | null = null;
  private voicesLoaded: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.bgMusic = new Audio('/sounds/bg3.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = this.volume * 0.2;
      } catch (e) {
        console.error("Error al inicializar la música de fondo:", e);
      }
    }
  }

  private async init(): Promise<AudioContext> {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    return this.ctx;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.bgMusic) {
      if (this.muted) {
        this.bgMusic.pause();
      }
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.bgMusic) {
      this.bgMusic.volume = this.volume * 0.3;
    }
  }

  startMusic() {
    if (this.bgMusic && !this.muted) {
      this.bgMusic.play().catch(() => {});
    }
  }

  stopMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    }
  }

  getVolume() {
    return this.volume;
  }

  private async loadSound(name: string, url: string): Promise<void> {
    if (this.audioBuffers[name]) return;
    try {
      const response = await fetch(url);
      if (!response.ok) return;
      const arrayBuffer = await response.arrayBuffer();
      const ctx = await this.init();
      this.audioBuffers[name] = await ctx.decodeAudioData(arrayBuffer);
    } catch {
      console.warn(`No se pudo cargar el sonido: ${url}`);
    }
  }

  private playBuffer(name: string, vol: number = 0.5): void {
    if (this.muted) return;
    const buffer = this.audioBuffers[name];
    if (!buffer || !this.ctx) return;

    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();

    source.buffer = buffer;
    gain.gain.value = vol * this.volume;

    source.connect(gain);
    gain.connect(this.ctx.destination);
    source.start();
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1): void {
    if (this.muted) return;
    this.init().then(ctx => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(vol * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    });
  }

  playPlace(): void {
    this.playTone(300, 'sine', 0.1, 0.05);
    setTimeout(() => this.playTone(150, 'sine', 0.15, 0.03), 20);
  }

  playPickup(): void {
    this.playTone(880, 'sine', 0.04, 0.02);
  }

  playClear(): void {
    const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const duration = 0.7 - (i * 0.05);
        this.playTone(freq, 'sine', duration, 0.08);
        this.playTone(freq / 2, 'sine', duration * 0.8, 0.04);
      }, i * 50);
    });
  }

  vibrate(pattern: number | number[]): void {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }

  playLevelUp(): void {
    const fanfarria = [440, 554.37, 659.25, 880];
    fanfarria.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.4, 0.07);
        this.playTone(freq * 1.005, 'sine', 0.4, 0.05);
      }, i * 120);
    });
  }

  playGameOver(): void {
    this.playTone(220, 'sawtooth', 0.5, 0.1);
    setTimeout(() => this.playTone(196, 'sawtooth', 0.8, 0.1), 200);
  }

  async preloadVoices(): Promise<void> {
    await Promise.all([
      this.loadSound('great', '/sounds/great.wav'),
      this.loadSound('excellent', '/sounds/excellent.wav'),
      this.loadSound('perfect', '/sounds/perfect.wav'),
      this.loadSound('amazing', '/sounds/amazing.wav'),
    ]);
    this.voicesLoaded = true;
  }

  playVoice(type: 'great' | 'excellent' | 'perfect' | 'amazing'): void {
    if (this.audioBuffers[type]) {
      this.playBuffer(type, 0.7);
    } else if (this.voicesLoaded) {
      this.playComboVoiceSynth(type);
    }
  }

  private playComboVoiceSynth(type: 'great' | 'excellent' | 'perfect' | 'amazing'): void {
    const configs = {
      great: { freqs: [392, 493.88], delay: 0 },
      excellent: { freqs: [440, 554.37, 659.25], delay: 50 },
      perfect: { freqs: [523.25, 659.25, 783.99], delay: 100 },
      amazing: { freqs: [523.25, 659.25, 783.99, 1046.50], delay: 150 },
    };
    const config = configs[type];
    config.freqs.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.3, 0.1);
        this.playTone(freq * 2, 'sine', 0.2, 0.05);
      }, config.delay + i * 80);
    });
  }

  playFullClear(): void {
    const fanfare = [523.25, 659.25, 783.99, 1046.50];
    fanfare.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.5, 0.1);
        this.playTone(freq * 1.5, 'sine', 0.3, 0.05);
        this.playTone(freq / 2, 'sine', 0.6, 0.06);
      }, i * 100);
    });
    setTimeout(() => {
      this.playTone(1046.50, 'sine', 1.0, 0.15);
      this.playTone(2093, 'sine', 0.8, 0.08);
    }, 500);
  }
}

export const sounds = new SoundSystem();

if (typeof window !== 'undefined') {
  sounds.preloadVoices();
}
