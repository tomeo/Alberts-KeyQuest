import Phaser from "phaser";
import { addOptions } from "../options.js";
import { addBackToTitleButton } from "../utils.js";
import WordManager from "../WordManager.js";
import audio from "../audio/AudioManager.js";
import { BackgroundManager } from "../BackgroundManager.js";

export default class Level3Scene extends Phaser.Scene {
  constructor() {
    super("Level3Scene");
    this.wordManager = new WordManager();
  }

  create() {
    audio.init(this);

    const background = new BackgroundManager(this);
    background.draw();

    const { width, height } = this.scale;

    addOptions(this);
    addBackToTitleButton(this);

    let activeLetters = [];
    let activeCharacters = new Set();
    let keyQueue = [];
    let warningCircles = new Map();

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

    const createWarningCircle = (letter) => {
      if (warningCircles.has(letter)) return; // Avoid creating multiple circles

      const circleSize = 65; // Increased size (30% larger)
      const circle = this.add.graphics();
      circle.fillStyle(0xff0000, 1); // **Solid red with no opacity**
      circle.fillCircle(0, 0, circleSize);
      circle.setDepth(-1); // Ensures the letter stays **above** the circle
      circle.setPosition(letter.x, letter.y);

      this.tweens.add({
        targets: circle,
        alpha: 0.2, // Fades slightly for effect
        duration: 150, // **Faster blinking effect**
        yoyo: true,
        repeat: -1
      });

      warningCircles.set(letter, circle);
    };

    const updateFallingLetters = (time, delta) => {
      for (let i = activeLetters.length - 1; i >= 0; i--) {
        const letter = activeLetters[i];
        letter.y += letter.getData('speed') * delta / 1000;

        // **Warning circle starts at 60% of the screen height instead of 70%**
        if (letter.y > height * 0.6) {
          if (!warningCircles.has(letter)) {
            createWarningCircle(letter);
          }
        }

        // If there's a warning circle, make sure it follows the letter
        if (warningCircles.has(letter)) {
          warningCircles.get(letter).setPosition(letter.x, letter.y);
        }

        // If letter falls off the screen, remove it
        if (letter.y > height + 50) {
          const char = letter.getData('char');
          activeCharacters.delete(char);
          letter.destroy();
          activeLetters.splice(i, 1);

          // Remove the warning circle if it exists
          if (warningCircles.has(letter)) {
            warningCircles.get(letter).destroy();
            warningCircles.delete(letter);
          }
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

          audio.sfx.correct();

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

          // Remove the warning circle if it exists
          if (warningCircles.has(letter)) {
            warningCircles.get(letter).destroy();
            warningCircles.delete(letter);
          }

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
        audio.sfx.incorrect();
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
