// Web Audio API Synthesizer for high-fidelity auditory feedback in gamification.
class SoundFXEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime); // A4
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playXpGain() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3); // C6
    
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.2);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
    
    osc.start();
    osc.stop(now + 0.35);
  }

  playLevelUp() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc1.type = 'sine';
    osc2.type = 'triangle';
    
    osc1.frequency.setValueAtTime(261.63, now); // C4
    osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.15);
    osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.35);
    
    osc2.frequency.setValueAtTime(329.63, now); // E4
    osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.35);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    
    osc1.start();
    osc2.start();
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
  }

  playRedeem() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'sine';
    // Synthesize a beautiful double bell chime (analogous to a cash register)
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    
    osc.start();
    osc.stop(now + 0.4);
  }

  playStreakFire() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.2);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
    
    osc.start();
    osc.stop(now + 0.25);
  }
}

export const sfx = new SoundFXEngine();
export default sfx;
