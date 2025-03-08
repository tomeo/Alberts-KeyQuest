import Phaser from "phaser";
import TitleScene from "./scenes/title-scene.js";
import Level1Scene from "./scenes/level1-scene.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    scene: [TitleScene, Level1Scene]
};

new Phaser.Game(config);
