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

        // 🟢 Create Animations FIRST before using them
        this.anims.create({ key: 'idle', frames: [{ key: 'albert', frame: 'idle' }], frameRate: 1, repeat: -1 });
        this.anims.create({ key: 'jump', frames: [{ key: 'albert', frame: 'jump' }], frameRate: 1, repeat: 0 });
        this.anims.create({ key: 'typing', frames: [{ key: 'albert', frame: 'interact' }], frameRate: 1, repeat: -1 });
        this.anims.create({
            key: 'cheer',
            frames: [{ key: 'albert', frame: 'cheer0' }, { key: 'albert', frame: 'cheer1' }],
            frameRate: 4,
            repeat: 0
        });

        // 🟢 Now we create the sprite and play the idle animation
        let albert = this.add.sprite(width / 2, height - 100, 'albert');
        albert.play('idle');  // Play idle AFTER animations are created

        let currentChallenge = "";
        let lastChallenge = "";

        const challengeText = this.add.text(width / 2, height * 0.3, "", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "24px",
            fill: "#FFD700"
        }).setOrigin(0.5);

        const instructionText = this.add.text(width / 2, height * 0.4, "Type the letter to continue...", {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "16px",
            fill: "#fff"
        }).setOrigin(0.5);

        const possibleChallenges = ["A", "B", "C", "D", "E", "F", "G"];

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
            console.log("Key pressed:", event.key);
            if (event.key.toUpperCase() === currentChallenge) {
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
