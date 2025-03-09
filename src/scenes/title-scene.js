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

        this.add.text(width / 2, height * 0.4, "Press 1 for Level 1", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "1.5rem",
            fill: "#fff"
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.5, "Press 2 for Level 2", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "1.5rem",
            fill: "#fff"
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.6, "Press 3 for Level 3", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "1.5rem",
            fill: "#fff"
        }).setOrigin(0.5);

        addOptions(this);

        this.input.keyboard.on("keydown-ONE", () => this.scene.start("Level1Scene"));
        this.input.keyboard.on("keydown-TWO", () => this.scene.start("Level2Scene"));
        this.input.keyboard.on("keydown-THREE", () => this.scene.start("Level3Scene"));
    }
}
