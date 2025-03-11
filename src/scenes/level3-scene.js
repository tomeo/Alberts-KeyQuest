import Phaser from "phaser";
import { addOptions } from "../options.js";
import { addBackToTitleButton } from "../utils.js";

export default class Level3Scene extends Phaser.Scene {
    constructor() {
        super("Level3Scene");
    }

    create() {
        const { width, height } = this.scale;

        addOptions(this);
        addBackToTitleButton(this);

        let activeLetters = [];
        let activeCharacters = new Set();
        let keyQueue = [];

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

        const getRandomCharacter = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
            let char;
            do {
                char = chars.charAt(Math.floor(Math.random() * chars.length));
            } while (activeCharacters.has(char));

            activeCharacters.add(char);
            return char;
        };

        const createFallingCharacter = () => {
            if (activeLetters.length >= 3) return;

            const char = getRandomCharacter();
            const text = this.add.text(Phaser.Math.Between(50, width - 50), -50, char, {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "6rem",
                fill: "#fff"
            }).setOrigin(0.5);

            text.setData('char', char);
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

                    playCorrectSound();

                    letter.setFill("#32CD32");
                    letter.setData('speed', 0);

                    this.tweens.add({
                        targets: letter,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => {
                            letter.destroy();
                            createFallingCharacter();
                            processKeyQueue();
                        }
                    });

                    break;
                }
            }

            if (!letterProcessed) {
                playIncorrectSound();
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
