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

        const iconText = this.add.text(width / 2, height * 0.3, "", {
            fontFamily: '"Roboto", sans-serif',
            fontSize: "18rem",
            fill: "#FFD700"
        }).setOrigin(0.5);

        const underscoreText = this.add.text(width / 2, height * 0.5, "", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "3rem",
            fill: "#fff"
        }).setOrigin(0.5);

        const hintText = this.add.text(width / 2, height * 0.55, "", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "2rem",
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
            const { word, icon } = getRandomWord();
            currentWord = word.toUpperCase();
            currentIcon = icon;
            typedWord = "";
            iconText.setText(currentIcon);
            updateWordDisplay();
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
