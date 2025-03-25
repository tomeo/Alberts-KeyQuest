import MusicManager from "./MusicManager.js";
import SFXManager from "./SFXManager.js";
import SpeechManager from "./SpeechManager.js";

class AudioManager {
  constructor() {
    this.scene = null;
    this.music = null;
    this.sfx = null;
    this.speech = new SpeechManager();
    this.muted = false;
  }

  init(scene) {
    if (!this.scene) {
      this.scene = scene;
      this.music = new MusicManager(scene);
      this.sfx = new SFXManager(scene);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    this.music?.setMuted(this.muted);
    this.sfx?.setMuted(this.muted);
    this.speech?.setMuted(this.muted);
  }

  setVolume(volume) {
    this.music?.setVolume(volume);
    this.sfx?.setVolume(volume);
  }

  isMuted() {
    return this.muted;
  }
}

const audioManager = new AudioManager();
export default audioManager;
