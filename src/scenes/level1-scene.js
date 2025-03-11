import Phaser from "phaser";
import { addOptions } from "../options.js";
import { addBackToTitleButton, speakText } from "../utils.js";

export default class Level1Scene extends Phaser.Scene {
    constructor() {
        super("Level1Scene");
    }

    preload() {
        this.load.atlasXML('albert', '../assets/character_maleAdventurer_sheetHD.png', '../assets/character_maleAdventurer_sheetHD.xml');
    }

    create() {
        const { width, height } = this.scale;

        this.anims.create({ key: 'idle', frames: [{ key: 'albert', frame: 'idle' }], frameRate: 1, repeat: -1 });
        this.anims.create({ key: 'cheer', frames: [{ key: 'albert', frame: 'cheer0' }, { key: 'albert', frame: 'cheer1' }], frameRate: 4, repeat: 0 });

        addOptions(this);
        addBackToTitleButton(this);

        let albert = this.add.sprite(width / 2, height - 100, 'albert');
        albert.play('idle');

        let currentChallenge = "";
        let lastChallenge = "";

        const challengeText = this.add.text(width / 2, height * 0.3, "", {
            fontFamily: '"Roboto", sans-serif',
            fontSize: "12rem",
            fill: "#FFD700"
        }).setOrigin(0.5);

        const iconMap = {
            A: "🚑", B: "🏀", C: "🐈", D: "🐕", E: "🦅", F: "🐠", G: "🍇",
            H: "🏠", I: "🧊", J: "🤹", K: "🪁", L: "🦁", M: "🍈", N: "🌙",
            O: "🐙", P: "🍍", Q: "👑", R: "🤖", S: "🐍", T: "🌳", U: "☂️",
            V: "🎻", W: "🚶", X: "❌", Y: "🧶", Z: "🦓"
        };

        const nameMap = {
            A: "ambulance", B: "basketball", C: "cat", D: "dog", E: "eagle", F: "fish", G: "grapes",
            H: "house", I: "ice", J: "juggling", K: "kite", L: "lion", M: "melon", N: "night",
            O: "octopus", P: "pineapple", Q: "queen", R: "robot", S: "snake", T: "tree", U: "umbrella",
            V: "violin", W: "walking", X: "cross", Y: "yarn", Z: "zebra"
        };

        const possibleChallenges = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

        const generateChallenge = () => {
            let newChallenge;
            do {
                newChallenge = Phaser.Utils.Array.GetRandom(possibleChallenges);
            } while (newChallenge === lastChallenge);

            lastChallenge = newChallenge;
            currentChallenge = newChallenge;
            challengeText.setText(currentChallenge);
        };

        const handleCorrectAnswer = () => {
            let iconText, wordText;
        
            if (iconMap[currentChallenge.toUpperCase()]) {
                challengeText.setText("");  
        
                iconText = this.add.text(challengeText.x, challengeText.y, iconMap[currentChallenge.toUpperCase()], {
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "8rem"
                }).setOrigin(0.5);
        
                if (nameMap[currentChallenge.toUpperCase()]) {
                    wordText = this.add.text(challengeText.x, challengeText.y + 100, nameMap[currentChallenge.toUpperCase()], {
                        fontFamily: '"Press Start 2P", cursive',
                        fontSize: "1.5rem",
                        fill: "#fff"
                    }).setOrigin(0.5);
                }
            }
        
            const greatText = this.add.text(albert.x, albert.y - 200, "Great!", {
                fontFamily: '"Press Start 2P", cursive',
                fontSize: "1.5rem",
                fill: "#fff",
                backgroundColor: "#000",
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5);
            setTimeout(() => greatText.destroy(), 800);
        
            if (nameMap[currentChallenge.toUpperCase()]) {
                speakText(`Yes, that is the letter ${currentChallenge.toUpperCase()}`, () => {
                    setTimeout(() => {
                        speakText(`${currentChallenge.toUpperCase()} is for ${nameMap[currentChallenge.toUpperCase()]}`, () => {
                            challengeText.setText(currentChallenge);  
                            if (iconText) iconText.destroy();
                            if (wordText) wordText.destroy();
                            generateChallenge();
                        });
                    }, 50);
                });
            } else {
                speakText(`Yes, that is the number ${currentChallenge}`, () => {
                    challengeText.setText(currentChallenge);  
                    if (iconText) iconText.destroy();
                    if (wordText) wordText.destroy();
                    generateChallenge();
                });
            }
        
            albert.setPipeline('GlowFilter');
            setTimeout(() => albert.resetPipeline(), 500);
        };

        generateChallenge();

        this.input.keyboard.on("keydown", (event) => {
            if (event.key.toUpperCase() === currentChallenge) {
                albert.play('cheer');
                handleCorrectAnswer();
                albert.once('animationcomplete', () => {
                    albert.play('idle');
                });
            } else {
                this.cameras.main.shake(200, 0.01);
            }
        });
    }
}
