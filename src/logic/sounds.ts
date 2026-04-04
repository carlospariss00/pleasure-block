// Sistema de sonido usando Web Audio API para evitar depender de archivos externos
class SoundSystem {
  private ctx: AudioContext | null = null;
  private audioBuffers: Record<string, AudioBuffer> = {};
  private muted: boolean = false;
  private volume: number = 0.8;
  private bgMusic: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        // En Vite, los archivos en 'public' se acceden desde la raíz '/'
        this.bgMusic = new Audio('/sounds/bg3.mp3'); 
        this.bgMusic.loop = true;
        this.bgMusic.volume = this.volume * 0.2;
      } catch (e) {
        console.error("Error al inicializar la música de fondo:", e);
      }
    }
  }

  private async init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
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
      } else {
        // Solo reanudar si el juego está activo (esto lo manejaremos en App.tsx mejor)
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
      this.bgMusic.play().catch(e => console.warn("Interacción requerida", e));
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

  private async loadSound(name: string, url: string) {
    if (this.audioBuffers[name]) return;
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const ctx = await this.init();
      this.audioBuffers[name] = await ctx.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.warn(`No se pudo cargar el sonido: ${url}`, e);
    }
  }

  private playBuffer(name: string, volume: number = 0.5) {
    if (this.muted) return;
    const buffer = this.audioBuffers[name];
    if (!buffer || !this.ctx) return;

    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    
    source.buffer = buffer;
    gain.gain.value = volume * this.volume;
    
    source.connect(gain);
    gain.connect(this.ctx.destination);
    source.start();
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(volume * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playPlace() {
    // Un "clic" suave y elegante
    this.playTone(300, 'sine', 0.1, 0.05);
    setTimeout(() => this.playTone(150, 'sine', 0.15, 0.03), 20);
  }

  playPickup() {
    this.playTone(880, 'sine', 0.04, 0.02);
  }

  playClear() {
    // Efecto de "carillón" más grave y potente
    const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const duration = 0.7 - (i * 0.05);
        this.playTone(freq, 'sine', duration, 0.08);
        // Añadir sub-armónico para dar cuerpo
        this.playTone(freq / 2, 'sine', duration * 0.8, 0.04);
      }, i * 50);
    });
  }

  vibrate(pattern: number | number[]) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }

  playLevelUp() {
    // Sonido triunfal y brillante
    const fanfarria = [440, 554.37, 659.25, 880];
    fanfarria.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.4, 0.07);
        this.playTone(freq * 1.005, 'sine', 0.4, 0.05); // Chorus effect
      }, i * 120);
    });
  }

  playGameOver() {
    this.playTone(220, 'sawtooth', 0.5, 0.1);
    setTimeout(() => this.playTone(196, 'sawtooth', 0.8, 0.1), 200);
  }

  // Voces para combos
  async preloadVoices() {
    await Promise.all([
      this.loadSound('great', '/sounds/great.wav'),
      this.loadSound('excellent', '/sounds/excellent.wav'),
      this.loadSound('perfect', '/sounds/perfect.wav'),
      this.loadSound('amazing', '/sounds/amazing.wav'),
    ]);
  }

  playVoice(type: 'great' | 'excellent' | 'perfect' | 'amazing') {
    this.playBuffer(type, 0.7);
  }
}

export const sounds = new SoundSystem();
// Intentar pre-cargar las voces
if (typeof window !== 'undefined') {
  sounds.preloadVoices();
}
