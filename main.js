import Phaser from "phaser";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

let albert;
let gameStarted = false;
let currentChallenge = "";
let lastChallenge = "";

function preload() {
    this.load.atlasXML('albert', 'assets/character_maleAdventurer_sheetHD.png', 'assets/character_maleAdventurer_sheetHD.xml');
}

function create() {
    const { width, height } = this.scale;

    // Title Screen
    const titleText = this.add.text(width / 2, height * 0.15, "Albert's KeyQuest", {
        fontFamily: '"Press Start 2P", cursive',
        fontSize: "20px",
        fill: "#fff",
        align: "center"
    }).setOrigin(0.5, 0.5);

    const startText = this.add.text(width / 2, height * 0.25, "Press Enter to Start", {
        fontFamily: '"Press Start 2P", cursive',
        fontSize: "16px",
        fill: "#fff",
        align: "center"
    }).setOrigin(0.5, 0.5);

    // Add Albert (Adventurer) sprite
    albert = this.add.sprite(width / 2, height - 100, 'albert');

    // Animations
    this.anims.create({ key: 'idle', frames: [{ key: 'albert', frame: 'idle' }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: 'jump', frames: [{ key: 'albert', frame: 'jump' }], frameRate: 1, repeat: 0 });
    this.anims.create({ key: 'typing', frames: [{ key: 'albert', frame: 'interact' }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: 'walk', frames: [
        { key: 'albert', frame: 'walk0' }, { key: 'albert', frame: 'walk1' },
        { key: 'albert', frame: 'walk2' }, { key: 'albert', frame: 'walk3' },
        { key: 'albert', frame: 'walk4' }, { key: 'albert', frame: 'walk5' },
        { key: 'albert', frame: 'walk6' }, { key: 'albert', frame: 'walk7' }
    ], frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'cheer', frames: [
        { key: 'albert', frame: 'cheer0' }, { key: 'albert', frame: 'cheer1' }
    ], frameRate: 4, repeat: 0 });

    albert.play('idle');

    // Typing Challenge Setup
    const challengeText = this.add.text(width / 2, height * 0.3, "", {
        fontFamily: '"Press Start 2P", cursive',
        fontSize: "24px",
        fill: "#FFD700",
        align: "center"
    }).setOrigin(0.5, 0.5).setVisible(false);

    const instructionText = this.add.text(width / 2, height * 0.4, "", {
        fontFamily: '"Press Start 2P", cursive',
        fontSize: "16px",
        fill: "#fff",
        align: "center"
    }).setOrigin(0.5, 0.5).setVisible(false);

    function startGame() {
        gameStarted = true;
        titleText.setVisible(false);
        startText.setVisible(false);
        challengeText.setVisible(true);
        instructionText.setVisible(true);
        generateChallenge();
    }

    function generateChallenge() {
        const possibleChallenges = ["A", "B", "C", "D", "E", "F", "G"];
        let newChallenge;
        do {
            newChallenge = Phaser.Utils.Array.GetRandom(possibleChallenges);
        } while (newChallenge === lastChallenge);
        
        lastChallenge = newChallenge;
        currentChallenge = newChallenge;
        challengeText.setText(currentChallenge);
        instructionText.setText("Type the letter to continue...");
    }

    this.input.keyboard.on("keydown", (event) => {
        if (!gameStarted) {
            if (event.key === "Enter") startGame();
        } else {
            if (event.key.toUpperCase() === currentChallenge) {
                albert.play('cheer');
                albert.once('animationcomplete', () => albert.play('idle'));
                generateChallenge();
            } else {
                albert.play('typing');
            }
        }
    });
}

function update() {}
