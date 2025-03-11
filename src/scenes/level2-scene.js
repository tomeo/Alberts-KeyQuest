import Phaser from "phaser";
import { addOptions } from "../options.js";
import { getRandomWord, speakText } from "../utils.js";
import { addBackToTitleButton } from "../utils.js";

export default class Level2Scene extends Phaser.Scene {
    constructor() {
        super("Level2Scene");
    }

    preload() {}

    create() {
        const { width, height } = this.scale;

        addOptions(this);
        addBackToTitleButton(this);

        let currentWord = "";
        let currentIcon = "";
        let typedWord = "";
        let isSpeaking = false;
        let usedWords = new Set();

        const audioContext = this.sound.context;

        const playCorrectSound = () => {
            const gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.connect(audioContext.destination);

            const frequencies = [523.25, 659.25, 784.0];
            frequencies.forEach((frequency, index) => {
                const oscillator = audioContext.createOscillator();
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.connect(gainNode);
                oscillator.start(audioContext.currentTime + index * 0.05);
                oscillator.stop(audioContext.currentTime + 0.3 + index * 0.05);
            });
        };

        const playIncorrectSound = () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(120, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
        };

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
                newWordData = getRandomWord();
            } while (usedWords.has(newWordData.word.toUpperCase()) && usedWords.size < 23);

            currentWord = newWordData.word.toUpperCase();
            currentIcon = newWordData.icon;
            typedWord = "";

            underscoreText.setScale(1);
            iconText.setScale(1);
            iconText.setAngle(0);

            iconText.setText(currentIcon);
            updateWordDisplay();
        };

        const handleCorrectAnswer = () => {
            isSpeaking = true;
            playCorrectSound();

            this.tweens.add({
                targets: iconText,
                scaleX: 2.25,
                scaleY: 2.25,
                angle: 360,
                duration: 2000,
                ease: 'Cubic.easeOut',
                yoyo: true
            });

            const tween = this.tweens.add({
                targets: underscoreText,
                scaleX: 2,
                scaleY: 2,
                duration: 2000,
                ease: 'Linear'
            });

            speakText(`Yes, that was ${currentWord}, good job!`, () => {
                isSpeaking = false;
                tween.stop();
                underscoreText.setScale(1);
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
            } else {
                playIncorrectSound();
                this.cameras.main.shake(200, 0.01);
            }
        });

        loadNewWord();
    }
}
