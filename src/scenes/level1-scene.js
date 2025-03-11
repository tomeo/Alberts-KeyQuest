import Phaser from "phaser";
import { addOptions } from "../options.js";
import { addBackToTitleButton, speakText } from "../utils.js";
import WordManager from "../WordManager.js";

export default class Level1Scene extends Phaser.Scene {
    constructor() {
        super("Level1Scene");
        this.wordManager = new WordManager();
    }

    preload() {
        this.load.atlasXML('albert', '../assets/character_maleAdventurer_sheetHD.png', '../assets/character_maleAdventurer_sheetHD.xml');
    }

    create() {
        const { width, height } = this.scale;

        addOptions(this);
        addBackToTitleButton(this);

        this.anims.create({ key: 'idle', frames: [{ key: 'albert', frame: 'idle' }], frameRate: 1, repeat: -1 });
        this.anims.create({ key: 'cheer', frames: [{ key: 'albert', frame: 'cheer0' }, { key: 'albert', frame: 'cheer1' }], frameRate: 4, repeat: 0 });

        let albert = this.add.sprite(width / 2, height - 100, 'albert');
        albert.play('idle');

        let currentLetter = "";
        let currentWord = "";
        let currentIcon = "";
        let lastLetter = "";

        const challengeText = this.add.text(width / 2, height * 0.3, "", {
            fontFamily: '"Roboto", sans-serif',
            fontSize: "36rem",
            fill: "#FFD700"
        }).setOrigin(0.5);

        const generateChallenge = () => {
            let wordData;
            do {
                wordData = this.wordManager.getRandomWord();
            } while (wordData.word.charAt(0).toUpperCase() === lastLetter);

            currentLetter = wordData.word.charAt(0).toUpperCase();
            currentWord = wordData.word;
            currentIcon = wordData.icon;
            lastLetter = currentLetter;

            challengeText.setText(currentLetter);
        };

        const handleCorrectAnswer = () => {
            albert.play('cheer');

            const iconText = this.add.text(challengeText.x, challengeText.y, currentIcon, {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "24rem"
            }).setOrigin(0.5);

            const wordText = this.add.text(
                challengeText.x,
                challengeText.y + 300,
                currentWord.toUpperCase(),
                {
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "8rem",
                    fill: "#fff"
                }
            ).setOrigin(0.5);

            challengeText.setText(""); // Hide the letter

            speakText(`Yes, that is the letter ${currentLetter}`, () => {
                setTimeout(() => {
                    speakText(`${currentLetter} is for ${currentWord}`, () => {
                        iconText.destroy();
                        wordText.destroy();
                        albert.play('idle');
                        generateChallenge();
                    });
                }, 50);
            });
        };

        generateChallenge();

        this.input.keyboard.on("keydown", (event) => {
            if (event.key.toUpperCase() === currentLetter) {
                handleCorrectAnswer();
            } else {
                this.cameras.main.shake(200, 0.01);
            }
        });
    }
}
