// Sistema de sonido usando Web Audio API para evitar depender de archivos externos
class SoundSystem {
  private ctx: AudioContext | null = null;
  private audioBuffers: Record<string, AudioBuffer> = {};
  private muted: boolean = false;

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
    return this.muted;
  }

  isMuted() {
    return this.muted;
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
    gain.gain.value = volume;
    
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

    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
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
    // Efecto de "carillón de cristal" usando escala pentatónica
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const duration = 0.6 - (i * 0.05);
        this.playTone(freq, 'sine', duration, 0.06);
        // Añadir armónico sutil para brillo
        this.playTone(freq * 2, 'sine', duration * 0.5, 0.02);
      }, i * 45);
    });
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
      this.loadSound('great', '/public/sounds/great.wav'),
      this.loadSound('excellent', '/public/sounds/excellent.wav'),
      this.loadSound('perfect', '/public/sounds/perfect.wav'),
      this.loadSound('amazing', '/public/sounds/amazing.wav'),
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
