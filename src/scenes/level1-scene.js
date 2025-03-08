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

        const instructionText = this.add.text(width / 2, height * 0.1, "Press the key", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: `${1}rem`,
            fill: "#fff"
        }).setOrigin(0.5);

        const challengeText = this.add.text(width / 2, height * 0.3, "", {
            fontFamily: '"Roboto", sans-serif',
            fontSize: `${8}rem`,
            fill: "#FFD700"
        }).setOrigin(0.1);

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

        generateChallenge();

        this.input.keyboard.on("keydown", (event) => {
            if (event.key.toUpperCase() === currentChallenge.toUpperCase()) {
                albert.play('cheer');
                albert.once('animationcomplete', () => {
                    albert.play('idle');
                    generateChallenge();
                });
            } else {
                albert.play('typing');
                albert.once('animationcomplete', () => albert.play('idle'));
            }
        });
    }
}
