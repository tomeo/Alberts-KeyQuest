import Phaser from "phaser";

console.log("🚀 Phaser is attempting to start!");

import TitleScene from "./scenes/title-scene.js";
import Level1Scene from "./scenes/level1-scene.js";
import Level2Scene from "./scenes/level2-scene.js";
import Level3Scene from "./scenes/level3-scene.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    scene: [TitleScene, Level1Scene, Level2Scene, Level3Scene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);
