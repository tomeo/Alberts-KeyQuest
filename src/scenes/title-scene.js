import Phaser from "phaser";
import WebFont from 'webfontloader';
import { addOptions } from "../options.js";

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
    const { width, height } = this.scale;

    // Background layers
    const gfx = this.add.graphics();

    // Sky
    gfx.fillStyle(0x552b84, 1);
    gfx.fillRect(0, 0, width, height);

    // Wavy hill 1
    gfx.fillStyle(0x4d2676, 1);
    gfx.beginPath();
    gfx.moveTo(0, height * 0.75);
    for (let x = 0; x <= width; x += 40) {
      const y = height * 0.75 + 20 * Math.sin(x * 0.02);
      gfx.lineTo(x, y);
    }
    gfx.lineTo(width, height);
    gfx.lineTo(0, height);
    gfx.closePath();
    gfx.fillPath();

    // Wavy hill 2
    gfx.fillStyle(0x3a1d5a, 1);
    gfx.beginPath();
    gfx.moveTo(0, height * 0.85);
    for (let x = 0; x <= width; x += 40) {
      const y = height * 0.85 + 25 * Math.sin(x * 0.025 + 1);
      gfx.lineTo(x, y);
    }
    gfx.lineTo(width, height);
    gfx.lineTo(0, height);
    gfx.closePath();
    gfx.fillPath();

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 50; i++) {
      const char = Phaser.Math.RND.pick(chars);
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const floatText = this.add.text(x, y, char, {
        fontFamily: '"Press Start 2P", cursive',
        fontSize: "4rem",
        fill: "#ffffff33"
      }).setAlpha(0.2);

      this.tweens.add({
        targets: floatText,
        y: y + Phaser.Math.Between(10, 40),
        duration: Phaser.Math.Between(3000, 4000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      });
    }

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
