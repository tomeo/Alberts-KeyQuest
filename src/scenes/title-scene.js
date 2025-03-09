import Phaser from "phaser";
import { addOptions } from "../options.js";

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super("TitleScene");
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, height * 0.2, "Albert's KeyQuest", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "3rem",
            fill: "#fff"
        }).setOrigin(0.5);

        // Option for Level 1
        const level1Text = this.add.text(width / 2, height * 0.5, "Press 1 for Level 1", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "1.5rem",
            fill: "#fff"
        }).setOrigin(0.5);

        // Option for Level 2
        const level2Text = this.add.text(width / 2, height * 0.6, "Press 2 for Level 2", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "1.5rem",
            fill: "#fff"
        }).setOrigin(0.5);

        addOptions(this);

        // Event listener for Level 1
        this.input.keyboard.on("keydown-ONE", () => {
            this.scene.start("Level1Scene");
        });

        // Event listener for Level 2
        this.input.keyboard.on("keydown-TWO", () => {
            this.scene.start("Level2Scene");
        });
    }
}
