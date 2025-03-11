export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.audioContext = scene.sound.context;
    }

    playCorrectSound() {
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.connect(this.audioContext.destination);

        const frequencies = [523.25, 659.25, 784.0]; // C5, E5, G5
        frequencies.forEach((frequency, index) => {
            const oscillator = this.audioContext.createOscillator();
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.connect(gainNode);
            oscillator.start(this.audioContext.currentTime + index * 0.05);
            oscillator.stop(this.audioContext.currentTime + 0.3 + index * 0.05);
        });
    }

    playIncorrectSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(120, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }
}
