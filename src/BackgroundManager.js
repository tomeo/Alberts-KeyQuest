export class BackgroundManager {
  constructor(scene) {
    this.scene = scene;
    this.gfx = scene.add.graphics();
    this.width = scene.scale.width;
    this.height = scene.scale.height;
  }

  draw() {
    this.drawSky();
    this.drawHill1();
    this.drawHill2();
  }

  drawSky() {
    this.gfx.fillStyle(0x552b84, 1);
    this.gfx.fillRect(0, 0, this.width, this.height);
  }

  drawHill1() {
    this.gfx.fillStyle(0x4d2676, 1);
    this.gfx.beginPath();
    this.gfx.moveTo(0, this.height * 0.75);
    for (let x = 0; x <= this.width; x += 40) {
      const y = this.height * 0.75 + 20 * Math.sin(x * 0.02);
      this.gfx.lineTo(x, y);
    }
    this.gfx.lineTo(this.width, this.height);
    this.gfx.lineTo(0, this.height);
    this.gfx.closePath();
    this.gfx.fillPath();
  }

  drawHill2() {
    this.gfx.fillStyle(0x3a1d5a, 1);
    this.gfx.beginPath();
    this.gfx.moveTo(0, this.height * 0.85);
    for (let x = 0; x <= this.width; x += 40) {
      const y = this.height * 0.85 + 25 * Math.sin(x * 0.025 + 1);
      this.gfx.lineTo(x, y);
    }
    this.gfx.lineTo(this.width, this.height);
    this.gfx.lineTo(0, this.height);
    this.gfx.closePath();
    this.gfx.fillPath();
  }

  drawBackgroundFloat(chars) {
    this.floatingTexts = [];

    for (let i = 0; i < 50; i++) {
      const char = Phaser.Math.RND.pick(chars);
      const x = Phaser.Math.Between(0, this.width);
      const y = Phaser.Math.Between(0, this.height);
      const floatText = this.scene.add.text(x, y, char, {
        fontFamily: '"Press Start 2P", cursive',
        fontSize: "4rem",
        fill: "#ffffff33"
      }).setAlpha(0.2);

      this.scene.tweens.add({
        targets: floatText,
        y: y + Phaser.Math.Between(10, 40),
        duration: Phaser.Math.Between(3000, 4000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      });

      this.floatingTexts.push(floatText);
    }
  }

  clearFloatingTexts() {
    if (this.floatingTexts) {
      this.floatingTexts.forEach(text => text.destroy());
      this.floatingTexts = [];
    }
  }
}
