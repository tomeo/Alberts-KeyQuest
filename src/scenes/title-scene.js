import Phaser from "phaser";
import { addOptions } from "../options.js";

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super("TitleScene");
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, height * 0.3, "Albert's KeyQuest", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "3rem",
            fill: "#fff"
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.5, "Press Enter to Start", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "1.5rem",
            fill: "#fff"
        }).setOrigin(0.5);

        addOptions(this);

        this.input.keyboard.on("keydown-ENTER", () => {
            this.scene.start("Level1Scene");
        });
    }
}
