import Phaser from "phaser";

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

        let albert = this.add.sprite(width / 2, height - 100, 'albert');
        albert.play('idle');

        let currentChallenge = "";
        let lastChallenge = "";
        let isSpeaking = false;
        let femaleVoice = null;

        const challengeText = this.add.text(width / 2, height * 0.3, "", {
            fontFamily: '"Roboto", sans-serif',
            fontSize: `${8}rem`,
            fill: "#FFD700"
        }).setOrigin(0.5);

        const instructionText = this.add.text(width / 2, height * 0.1, "Type the letter or number to continue...", {
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
            femaleVoice = voices.find(voice => voice.name.includes("Female") || voice.name.includes("female") || voice.name.includes("Google UK English Female"));
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
            speechSynthesis.speak(utterance);
        };

        const handleCorrectAnswer = () => {
            if (!isNaN(currentChallenge)) {
                speak(`Yes, that is the number ${currentChallenge}`, () => generateChallenge());
            } else {
                speak(`Yes, that is the letter ${currentChallenge}`, () => generateChallenge());
            }
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
                albert.once('animationcomplete', () => albert.play('idle'));
            }
        });
    }
}
