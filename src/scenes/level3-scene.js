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
        let activeCharacters = new Set();  // Track active letters/numbers
        let keyQueue = [];  // Queue for key presses

        // Audio Context for custom sounds
        const audioContext = this.sound.context;

        // Play a cheerful sound for correct answers
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

        // Play a short buzzer sound for incorrect answers
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

        // Helper function to get random letters and numbers
        const getRandomCharacter = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
            let char;
            do {
                char = chars.charAt(Math.floor(Math.random() * chars.length));
            } while (activeCharacters.has(char));  // Ensure unique character

            activeCharacters.add(char);  // Mark character as active
            return char;
        };

        // Create falling letters and numbers
        const createFallingCharacter = () => {
            if (activeLetters.length >= 3) return;  // Limit to max 3 letters

            const char = getRandomCharacter();
            const text = this.add.text(Phaser.Math.Between(50, width - 50), -50, char, {
                fontFamily: '"Press Start 2P", cursive',
                fontSize: "6rem",  // Larger font size
                fill: "#fff"
            }).setOrigin(0.5);

            text.setData('char', char);
            text.setData('speed', Phaser.Math.Between(50, 150));  // Varied speeds
            text.setData('processed', false);  // New flag to prevent multiple triggers
            activeLetters.push(text);
        };

        // Make letters fall
        const updateFallingLetters = (time, delta) => {
            for (let i = activeLetters.length - 1; i >= 0; i--) {
                const letter = activeLetters[i];
                letter.y += letter.getData('speed') * delta / 1000;

                if (letter.y > height + 50) {  // Remove if it falls off-screen
                    const char = letter.getData('char');
                    activeCharacters.delete(char);  // Remove from active set
                    letter.destroy();
                    activeLetters.splice(i, 1);
                }
            }
        };

        // Process key queue
        const processKeyQueue = () => {
            if (keyQueue.length === 0) return;  // No keys to process

            const pressedKey = keyQueue.shift();  // Get the next key
            let letterProcessed = false;

            for (let i = activeLetters.length - 1; i >= 0; i--) {
                const letter = activeLetters[i];
                const letterChar = letter.getData('char');
                const isProcessed = letter.getData('processed');

                if (letterChar === pressedKey && !isProcessed) {
                    letterProcessed = true;
                    letter.setData('processed', true);  // Mark as processed immediately

                    // Immediate removal from active lists
                    activeLetters.splice(i, 1);
                    activeCharacters.delete(letterChar);

                    playCorrectSound();  // Play cheerful sound

                    // Change color to green and stop moving
                    letter.setFill("#32CD32");  // Lime green color
                    letter.setData('speed', 0);  // Stop movement

                    // Fade out and destroy
                    this.tweens.add({
                        targets: letter,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => {
                            letter.destroy();
                            createFallingCharacter();  // Add a new letter immediately
                            processKeyQueue();  // Process the next key in the queue
                        }
                    });

                    break;  // Exit loop after handling the letter
                }
            }

            if (!letterProcessed) {
                // Play incorrect sound and shake screen on wrong key press
                playIncorrectSound();
                this.cameras.main.shake(200, 0.01);  // 200ms shake with small intensity
                processKeyQueue();  // Process the next key in the queue
            }
        };

        // Handle key presses and add them to the queue
        this.input.keyboard.on('keydown', (event) => {
            keyQueue.push(event.key.toUpperCase());  // Queue the key press
            processKeyQueue();  // Try to process the queue
        });

        // Initial letters
        createFallingCharacter();
        createFallingCharacter();
        createFallingCharacter();

        // Timed event to create falling characters if less than 3
        this.time.addEvent({
            delay: 1000,
            callback: createFallingCharacter,
            loop: true
        });

        // Update function to manage falling letters
        this.events.on('update', updateFallingLetters);
    }
}
