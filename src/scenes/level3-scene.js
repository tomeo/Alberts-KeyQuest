import Phaser from "phaser";
import { addOptions } from "../options.js";
import { addBackToTitleButton } from "../utils.js";
import WordManager from "../WordManager.js";
import AudioManager from "../AudioManager.js";

export default class Level3Scene extends Phaser.Scene {
    constructor() {
        super("Level3Scene");
        this.wordManager = new WordManager();
    }

    create() {
        const { width, height } = this.scale;

        addOptions(this);
        addBackToTitleButton(this);

        this.audioManager = new AudioManager(this);

        let activeLetters = [];
        let activeCharacters = new Set();
        let keyQueue = [];

        const getRandomCharacter = () => {
            let wordData;
            do {
                wordData = this.wordManager.getRandomWord();
            } while (activeCharacters.has(wordData.word.charAt(0).toUpperCase()));

            const char = wordData.word.charAt(0).toUpperCase();
            activeCharacters.add(char);
            return { 
                letter: char, 
                icon: wordData.icon, 
                word: wordData.word.toUpperCase()
            };
        };

        const createFallingCharacter = () => {
            if (activeLetters.length >= 3) return;

            const { letter, icon, word } = getRandomCharacter();
            const text = this.add.text(Phaser.Math.Between(50, width - 50), -50, letter, {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "6rem",
                fill: "#fff"
            }).setOrigin(0.5);

            text.setData('char', letter);
            text.setData('icon', icon);
            text.setData('word', word);
            text.setData('speed', Phaser.Math.Between(50, 150));
            text.setData('processed', false);
            activeLetters.push(text);
        };

        const updateFallingLetters = (time, delta) => {
            for (let i = activeLetters.length - 1; i >= 0; i--) {
                const letter = activeLetters[i];
                letter.y += letter.getData('speed') * delta / 1000;

                if (letter.y > height + 50) {
                    const char = letter.getData('char');
                    activeCharacters.delete(char);
                    letter.destroy();
                    activeLetters.splice(i, 1);
                }
            }
        };

        const processKeyQueue = () => {
            if (keyQueue.length === 0) return;

            const pressedKey = keyQueue.shift();
            let letterProcessed = false;

            for (let i = activeLetters.length - 1; i >= 0; i--) {
                const letter = activeLetters[i];
                const letterChar = letter.getData('char');
                const isProcessed = letter.getData('processed');

                if (letterChar === pressedKey && !isProcessed) {
                    letterProcessed = true;
                    letter.setData('processed', true);

                    activeLetters.splice(i, 1);
                    activeCharacters.delete(letterChar);

                    this.audioManager.playCorrectSound();

                    const iconText = this.add.text(letter.x, letter.y, letter.getData('icon'), {
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: "6rem"
                    }).setOrigin(0.5);

                    const wordText = this.add.text(letter.x, letter.y + 75, letter.getData('word'), {
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: "2rem",
                        fill: "#fff"
                    }).setOrigin(0.5);

                    letter.setAlpha(0);

                    this.tweens.add({
                        targets: [iconText, wordText],
                        alpha: 0,
                        duration: 1500,
                        onComplete: () => {
                            iconText.destroy();
                            wordText.destroy();
                            createFallingCharacter();
                            processKeyQueue();
                        }
                    });

                    break;
                }
            }

            if (!letterProcessed) {
                this.audioManager.playIncorrectSound();
                this.cameras.main.shake(200, 0.01);
                processKeyQueue();
            }
        };

        this.input.keyboard.on('keydown', (event) => {
            keyQueue.push(event.key.toUpperCase());
            processKeyQueue();
        });

        createFallingCharacter();
        createFallingCharacter();
        createFallingCharacter();

        this.time.addEvent({
            delay: 1000,
            callback: createFallingCharacter,
            loop: true
        });

        this.events.on('update', updateFallingLetters);
    }
}
