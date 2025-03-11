import Phaser from "phaser";
import { addOptions } from "../options.js";
import { addBackToTitleButton, speakText } from "../utils.js";
import WordManager from "../WordManager.js";

export default class Level2Scene extends Phaser.Scene {
    constructor() {
        super("Level2Scene");
        this.wordManager = new WordManager();
    }

    create() {
        const { width, height } = this.scale;

        addOptions(this);
        addBackToTitleButton(this);

        let currentWord = "";
        let currentIcon = "";
        let typedWord = "";
        let isSpeaking = false;
        let usedWords = new Set();

        const iconText = this.add.text(width / 2, height * 0.3, "", {
            fontFamily: '"Roboto", sans-serif',
            fontSize: "36rem",
            fill: "#FFD700"
        }).setOrigin(0.5);

        const underscoreText = this.add.text(width / 2, height * 0.7, "", {
            fontFamily: '"Roboto", sans-serif',
            fontSize: "6rem",
            fill: "#fff"
        }).setOrigin(0.5);

        const hintText = this.add.text(width / 2, height * 0.85, "", {
            fontFamily: '"Roboto", sans-serif',
            fontSize: "4rem",
            fill: "#888"
        }).setOrigin(0.5);

        const updateWordDisplay = () => {
            let displayText = "";
            let hintDisplay = "";

            for (let i = 0; i < currentWord.length; i++) {
                if (i < typedWord.length) {
                    displayText += currentWord[i] + " ";
                    hintDisplay += "  ";
                } else {
                    displayText += "_ ";
                    hintDisplay += currentWord[i] + " ";
                }
            }

            underscoreText.setText(displayText.trim());
            hintText.setText(hintDisplay.trim());
        };

        const loadNewWord = () => {
            let newWordData;
            do {
                newWordData = this.wordManager.getRandomWord();
            } while (usedWords.has(newWordData.word.toUpperCase()) && usedWords.size < 23);

            currentWord = newWordData.word.toUpperCase();
            currentIcon = newWordData.icon;
            typedWord = "";

            iconText.setText(currentIcon);
            updateWordDisplay();

            // Speak the new word
            speakText(`Spell the word ${currentWord}`);
        };

        const handleCorrectAnswer = () => {
            isSpeaking = true;

            speakText(`Yes, that was ${currentWord}, good job!`, () => {
                isSpeaking = false;
                loadNewWord();
            });
        };

        this.input.keyboard.on("keydown", (event) => {
            if (isSpeaking) return;

            const expectedLetter = currentWord[typedWord.length];
            if (event.key.toUpperCase() === expectedLetter) {
                typedWord += event.key.toUpperCase();
                updateWordDisplay();
                speakText(expectedLetter);

                if (typedWord.length === currentWord.length) {
                    handleCorrectAnswer();
                }
            }
        });

        loadNewWord();
    }
}
