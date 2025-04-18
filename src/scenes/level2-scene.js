import Phaser from "phaser";
import { addOptions } from "../options.js";
import { addBackToTitleButton } from "../utils.js";
import WordManager from "../WordManager.js";
import audio from "../audio/AudioManager.js";
import { BackgroundManager } from "../BackgroundManager.js";

export default class Level2Scene extends Phaser.Scene {
  constructor() {
    super("Level2Scene");
    this.wordManager = new WordManager();
  }

  create() {
    audio.init(this);

    const background = new BackgroundManager(this);
    background.draw();

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
        newWordData = this.wordManager.getRandomWordByLength(3);
      } while (usedWords.has(newWordData.word.toUpperCase()) && usedWords.size < 23);

      currentWord = newWordData.word.toUpperCase();
      currentIcon = newWordData.icon;
      typedWord = "";

      iconText.setText(currentIcon);
      updateWordDisplay();

      audio.speech.speak(`Spell the word ${currentWord}`);
    };

    const handleCorrectAnswer = () => {
      console.log("Correct answer!");
      isSpeaking = true;

      audio.speech.runSpeechScript([
        `Yes, that was ${currentWord}, good job!`
      ], () => {
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

        audio.speech.runSpeechScript([
          expectedLetter
        ], () => {
          if (typedWord.length === currentWord.length) {
            handleCorrectAnswer();
          }
        });
      }
    });

    loadNewWord();
  }
}
