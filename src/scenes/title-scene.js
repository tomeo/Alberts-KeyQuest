import Phaser from "phaser";

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super("TitleScene");
    }

    preload() {
        this.load.atlasXML('albert', 'assets/character_maleAdventurer_sheetHD.png', 'assets/character_maleAdventurer_sheetHD.xml');
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, height * 0.15, "Albert's KeyQuest", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "20px",
            fill: "#fff"
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.25, "Press Enter to Start", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "16px",
            fill: "#fff"
        }).setOrigin(0.5);

        // Switch to Level 1 Scene on Enter key
        this.input.keyboard.on("keydown-ENTER", () => {
            this.scene.start("Level1Scene");
        });
    }
}
