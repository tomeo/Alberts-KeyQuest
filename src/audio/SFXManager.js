export default class SFXManager {
  constructor(scene) {
    this.scene = scene;
    this.audioContext = scene.sound.context;
    this.volume = 1;
    this.muted = false;
  }

  _playOscillator({ type, frequency, duration = 0.3, gain = 0.5, delay = 0 }) {
    if (this.muted) return;

    const ctx = this.audioContext;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(gain, ctx.currentTime);
    gainNode.connect(ctx.destination);

    const oscillator = ctx.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    oscillator.connect(gainNode);
    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration);
  }

  correct() {
    const frequencies = [523.25, 659.25, 784.0]; // C5, E5, G5
    frequencies.forEach((frequency, index) => {
      this._playOscillator({
        type: 'triangle',
        frequency,
        duration: 0.3,
        delay: index * 0.05
      });
    });
  }

  incorrect() {
    this._playOscillator({
      type: 'sawtooth',
      frequency: 120,
      duration: 0.2
    });
  }

  play(key) {
    if (!this.muted) {
      this.scene.sound.play(key, { volume: this.volume });
    }
  }

  setVolume(volume) {
    this.volume = volume;
  }

  setMuted(mute) {
    this.muted = mute;
  }
}
