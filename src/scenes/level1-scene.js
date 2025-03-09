import Phaser from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import GlowFilterPipelinePlugin from 'phaser3-rex-plugins/plugins/glowfilterpipeline-plugin.js';
import { addOptions } from "../options.js";
import { addBackToTitleButton } from "../utils.js";

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
        this.anims.create({ key: 'jump', frames: [{ key: 'albert', frame: 'jump' }], frameRate: 1, repeat: 0 });
        this.anims.create({ key: 'typing', frames: [{ key: 'albert', frame: 'interact' }], frameRate: 1, repeat: -1 });
        this.anims.create({
            key: 'cheer',
            frames: [{ key: 'albert', frame: 'cheer0' }, { key: 'albert', frame: 'cheer1' }],
            frameRate: 4,
            repeat: 0
        });

        addOptions(this);
        addBackToTitleButton(this);

        let albert = this.add.sprite(width / 2, height - 100, 'albert');
        albert.play('idle');

        let currentChallenge = "";
        let lastChallenge = "";
        let isSpeaking = false;
        let femaleVoice = null;

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

        const challengeText = this.add.text(width / 2, height * 0.3, "", {
            fontFamily: '"Roboto", sans-serif',
            fontSize: `${12}rem`,
            fill: "#FFD700"
        }).setOrigin(0.5);

        const instructionText = this.add.text(width / 2, height * 0.1, "Press the key", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: `${1}rem`,
            fill: "#fff"
        }).setOrigin(0.5);

        const uppercaseLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
        const lowercaseLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
        const numbers = Array.from({ length: 10 }, (_, i) => i.toString());
        const possibleChallenges = [...uppercaseLetters, ...lowercaseLetters, ...numbers];

        const generateChallenge = () => {
            let newChallenge;
            do {
                newChallenge = Phaser.Utils.Array.GetRandom(possibleChallenges);
            } while (newChallenge === lastChallenge);

            lastChallenge = newChallenge;
            currentChallenge = newChallenge;

            challengeText.setText(currentChallenge);
        };

        const setFemaleVoice = () => {
            const voices = speechSynthesis.getVoices();
            femaleVoice = voices.find(voice => voice.name.includes("Female") || voice.name.includes("Google UK English Female"));
        };

        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = setFemaleVoice;
        } else {
            setFemaleVoice();
        }

        const speak = (message, callback) => {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.rate = 1;
            utterance.pitch = 1;
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
            isSpeaking = true;
            utterance.onend = () => {
                isSpeaking = false;
                if (callback) callback();
            };
            setTimeout(() => speechSynthesis.speak(utterance), 100);
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
                speak(`Yes, that is the letter ${currentChallenge.toUpperCase()}`, () => {
                    setTimeout(() => {
                        speak(`${currentChallenge.toUpperCase()} is for ${nameMap[currentChallenge.toUpperCase()]}`, () => {
                            challengeText.setText(currentChallenge);  
                            if (iconText) iconText.destroy();
                            if (wordText) wordText.destroy();
                            generateChallenge();
                        });
                    }, 50);
                });
            } else {
                speak(`Yes, that is the number ${currentChallenge}`, () => {
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
            if (isSpeaking) return;
        
            if (event.key.toUpperCase() === currentChallenge.toUpperCase()) {
                albert.play('cheer');
                handleCorrectAnswer();
                albert.once('animationcomplete', () => {
                    albert.play('idle');
                });
            } else {
                albert.play('typing');
                this.cameras.main.shake(200, 0.01);  // 🔄 Shake Only on Wrong Answer
                albert.once('animationcomplete', () => albert.play('idle'));
            }
        });

        generateChallenge();

        this.input.keyboard.on("keydown", (event) => {
            if (isSpeaking) return;

            if (event.key.toUpperCase() === currentChallenge.toUpperCase()) {
                albert.play('cheer');
                handleCorrectAnswer();
                albert.once('animationcomplete', () => {
                    albert.play('idle');
                });
            } else {
                albert.play('typing');
                albert.once('animationcomplete', () => albert.play('idle'));
            }
        });
    }
}
