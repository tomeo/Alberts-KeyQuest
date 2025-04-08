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
}
