export default class MusicManager {
  constructor(scene) {
    this.scene = scene;
    this.music = null;
    this.volume = 0.5;
    this.muted = false;
  }

  play(key, loop = true) {
    if (this.music) this.music.stop();
    this.music = this.scene.sound.add(key, { loop, volume: this.muted ? 0 : this.volume });
    this.music.play();
  }

  stop() {
    if (this.music) this.music.stop();
  }

  setVolume(volume) {
    this.volume = volume;
    if (this.music) {
      this.music.setVolume(this.muted ? 0 : volume);
    }
  }

  setMuted(mute) {
    this.muted = mute;
    if (this.music) {
      this.music.setVolume(mute ? 0 : this.volume);
    }
  }
}
