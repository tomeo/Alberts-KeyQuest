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

        const setFemaleVoice = () => {
            const voices = speechSynthesis.getVoices();
            femaleVoice = voices.find(voice => 
                voice.name.includes("Female") || 
                voice.name.toLowerCase().includes("woman") ||
                voice.name.toLowerCase().includes("girl") ||
                voice.name.includes("Google UK English Female")
            );
        };

        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = setFemaleVoice;
        } else {
            setFemaleVoice();
        }

        const speakText = (text, callback = null) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;

            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }

            utterance.onend = () => {
                if (callback) callback();
            };

            speechSynthesis.speak(utterance);
        };

        const loadNewWord = () => {
            let newWordData;
            do {
                newWordData = getRandomWord();
            } while (usedWords.has(newWordData.word.toUpperCase()) && usedWords.size < 23);  // Prevent duplicates until all words are used

            currentWord = newWordData.word.toUpperCase();
            currentIcon = newWordData.icon;
            typedWord = "";

            usedWords.add(currentWord);  // Track used words

            underscoreText.setScale(1);  // Reset size for new word
            iconText.setScale(1);        // Reset icon size
            iconText.setAngle(0);        // Reset icon rotation

            iconText.setText(currentIcon);
            updateWordDisplay();
        };

        const handleCorrectAnswer = () => {
            isSpeaking = true;

            // Spin and temporary 50% more scale-up effect for the icon
            this.tweens.add({
                targets: iconText,
                scaleX: 2.25,  // Temporarily scale to 2.25x size (50% more than 1.5x)
                scaleY: 2.25,  // Temporarily scale to 2.25x size (50% more than 1.5x)
                angle: 360,    // Spin 360 degrees
                duration: 2000,
                ease: 'Cubic.easeOut',
                yoyo: true  // Return to original size and angle
            });

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
                this.cameras.main.shake(200, 0.01);  // Shake on wrong answer
            }
        });

        loadNewWord();
    }
}
