export default class SpeechManager {
  constructor() {
    this.muted = false;
    this.voice = null;
    this._initVoices();
  }

  _initVoices() {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (!voices.length) return;

      this.voice = voices.find(v => v.name.includes("Female")) || voices[0];
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  speak(text) {
    if (this.muted || !text) {
      return;
    }

    const u = new SpeechSynthesisUtterance(text);
    if (this.voice) u.voice = this.voice;

    u.onstart = () => console.log("🎙️ started");
    u.onerror = (e) => console.error("❌ speech error:", e);
    u.onend = () => console.log("✅ speech ended");

    speechSynthesis.cancel();

    setTimeout(() => {
      speechSynthesis.speak(u);
      console.log("📤 speech dispatched");
    }, 100);
  }

  runSpeechScript(steps = [], finalCallback = null) {
    if (this.muted || !steps.length) {
      if (finalCallback) finalCallback({});
      return;
    }

    const context = {};

    const runNext = (index) => {
      if (index >= steps.length) {
        if (finalCallback) finalCallback(context);
        return;
      }

      const step = steps[index];

      if (typeof step === "string") {
        const utterance = new SpeechSynthesisUtterance(step);
        if (this.voice) utterance.voice = this.voice;

        let handled = false;
        const finish = () => {
          if (!handled) {
            handled = true;
            runNext(index + 1);
          }
        };

        utterance.onend = finish;
        utterance.onerror = (e) => {
          console.warn("❌ Speech error:", e);
          finish();
        };

        const estimatedTime = Math.max(800, step.length * 80);
        setTimeout(() => {
          console.warn("⚠️ Speech fallback timeout");
          finish();
        }, estimatedTime);

        speechSynthesis.cancel();
        setTimeout(() => {
          speechSynthesis.speak(utterance);
        }, 50);

      } else if (typeof step === "function") {
        const result = step(context);

        if (result instanceof Promise) {
          result.then(() => runNext(index + 1));
        } else {
          runNext(index + 1);
        }
      } else if (step && step.text) {
        this.speak(step.text, () => {
          if (step.after) step.after(context);
          runNext(index + 1);
        });

      } else {
        runNext(index + 1);
      }
    };

    runNext(0);
  }


  setMuted(mute) {
    this.muted = mute;
  }
}
