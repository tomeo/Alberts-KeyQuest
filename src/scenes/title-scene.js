import Phaser from "phaser";
import WebFont from 'webfontloader';
import { addOptions } from "../options.js";
import { BackgroundManager } from "../BackgroundManager.js";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  preload() {
    this.load.image("logo", "logo.png");
    this.fontsReady = false;
    WebFont.load({
      google: {
        families: ['Press Start 2P'],
      },
      active: () => {
        this.fontsReady = true;
      }
    });
  }

  create() {
    if (!this.fontsReady) {
      this.time.delayedCall(50, () => this.create(), [], this);
      return;
    }

    const background = new BackgroundManager(this);
    background.draw();
    background.drawBackgroundFloat("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");

    const { width, height } = this.scale;

    // Logo
    const logo = this.add.image(width / 2, height * 0.28, "logo").setOrigin(0.5).setScale(0.6);
    this.tweens.add({
      targets: logo,
      y: height * 0.27,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    // Instructions
    const baseStyle = {
      fontFamily: '"Press Start 2P", cursive',
      fontSize: "1.5rem",
      align: "center"
    };

    const instructions = [
      { text: "Press 1 for Level 1", color: "#FFD93D", key: "ONE", scene: "Level1Scene" },
      { text: "Press 2 for Level 2", color: "#58D68D", key: "TWO", scene: "Level2Scene" },
      { text: "Press 3 for Level 3", color: "#5DADE2", key: "THREE", scene: "Level3Scene" },
    ];

    instructions.forEach((item, i) => {
      const style = { ...baseStyle, fill: item.color };
      const txt = this.add.text(width / 2, height * (0.58 + i * 0.1), item.text, style)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.scene.start(item.scene));

      this.input.keyboard.on(`keydown-${item.key}`, () => this.scene.start(item.scene));
    });

    addOptions(this);
  }
}
