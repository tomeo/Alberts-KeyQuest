import Phaser from "phaser";
import { addOptions } from "../options.js";

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super("TitleScene");
    }

    create() {
        const { width, height } = this.scale;

        const fontStyle = {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "3rem",
            fill: "#fff"
        };

        // Delay rendering to ensure the font is loaded
        this.time.delayedCall(100, () => {
            this.add.text(width / 2, height * 0.2, "Albert's KeyQuest", fontStyle).setOrigin(0.5);
            this.add.text(width / 2, height * 0.4, "Press 1 for Level 1", fontStyle).setOrigin(0.5);
            this.add.text(width / 2, height * 0.5, "Press 2 for Level 2", fontStyle).setOrigin(0.5);
            this.add.text(width / 2, height * 0.6, "Press 3 for Level 3", fontStyle).setOrigin(0.5);
        });

        addOptions(this);

        this.input.keyboard.on("keydown-ONE", () => this.scene.start("Level1Scene"));
        this.input.keyboard.on("keydown-TWO", () => this.scene.start("Level2Scene"));
        this.input.keyboard.on("keydown-THREE", () => this.scene.start("Level3Scene"));
    }
}
