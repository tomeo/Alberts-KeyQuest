import Phaser from "phaser";
import { addOptions } from "../options.js";
import { getRandomWord, speakText } from "../utils.js";
import { addBackToTitleButton } from "../utils.js";

export default class Level2Scene extends Phaser.Scene {
    constructor() {
        super("Level2Scene");
    }

    preload() {
        // Preload assets if needed
    }

    create() {
        const { width, height } = this.scale;

        addOptions(this);
        addBackToTitleButton(this);

        let currentWord = "";
        let currentIcon = "";
        let typedWord = "";
        let isSpeaking = false;
        let femaleVoice = null;
        let usedWords = new Set();  // Track used words to avoid duplicates

        // Extracted sound functions from Level 3
        const audioContext = this.sound.context;

        const playCorrectSound = () => {
            const gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);  // Set volume
            gainNode.connect(audioContext.destination);

            // Create a major chord (C5 + E5 + G5)
            const frequencies = [523.25, 659.25, 784.0];  // C5, E5, G5
            frequencies.forEach((frequency, index) => {
                const oscillator = audioContext.createOscillator();
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.connect(gainNode);
                oscillator.start(audioContext.currentTime + index * 0.05);  // Slight delay for a chord effect
                oscillator.stop(audioContext.currentTime + 0.3 + index * 0.05);  // Play for 0.3s each
            });
        };

        const playIncorrectSound = () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sawtooth';  // Harsh tone for incorrect answers
            oscillator.frequency.setValueAtTime(120, audioContext.currentTime);  // Low buzz
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);  // Set volume

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);  // Play for 0.2 seconds
        };

        // Keep the original size for the icon (36rem)
        const iconText = this.add.text(width / 2, height * 0.3, "", {
            fontFamily: '"Roboto", sans-serif',
            fontSize: "36rem",  // Original size
            fill: "#FFD700"
        }).setOrigin(0.5);

        // Move underscores further down the screen
        const underscoreText = this.add.text(width / 2, height * 0.7, "", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "6rem",  // Doubled size for underscores
            fill: "#fff"
        }).setOrigin(0.5);

        // Move hint text even further down to avoid overlap
        const hintText = this.add.text(width / 2, height * 0.85, "", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "4rem",  // Doubled size for hints
            fill: "#888"
        }).setOrigin(0.5);

        const updateWordDisplay = () => {
            let displayText = "";
            let hintDisplay = "";

            for (let i = 0; i < currentWord.length; i++) {
                if (i < typedWord.length) {
                    displayText += currentWord[i];  // Show correct letters directly
                    hintDisplay += " ";  // Empty space for typed letters
                } else {
                    displayText += "_";  // Show underscores for remaining letters
                    hintDisplay += currentWord[i];  // Show letter hints directly under underscores
                }
            }

            underscoreText.setText(displayText);
            hintText.setText(hintDisplay);
        };

        const loadNewWord = () => {
            let newWordData;
            do {
                newWordData = getRandomWord();
            } while (usedWords.has(newWordData.word.toUpperCase()) && usedWords.size < 23);  // Prevent duplicates until all words are used

            currentWord = newWordData.word.toUpperCase();
            currentIcon = newWordData.icon;
            typedWord = "";

            underscoreText.setScale(1);  // Reset size for new word
            iconText.setScale(1);        // Reset icon size
            iconText.setAngle(0);        // Reset icon rotation

            iconText.setText(currentIcon);
            updateWordDisplay();
        };

        const handleCorrectAnswer = () => {
            isSpeaking = true;
            playCorrectSound();  // Play correct sound

            // Start enlarging the word slowly
            const tween = this.tweens.add({
                targets: underscoreText,
                scaleX: 2,
                scaleY: 2,
                duration: 2000,  // Grow slowly over 2 seconds
                ease: 'Linear'
            });

            speakText(`Yes, that was ${currentWord}, good job!`, () => {
                isSpeaking = false;

                // Stop enlarging and reset size
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
                speakText(expectedLetter);  // Speak each correct letter

                if (typedWord.length === currentWord.length) {
                    handleCorrectAnswer();  // Speak the full word on correct completion
                }
            } else {
                playIncorrectSound();  // Play incorrect sound
                this.cameras.main.shake(200, 0.01);  // Shake on wrong answer
            }
        });

        loadNewWord();
    }
}
