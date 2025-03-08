export const addOptions = (scene) => {
    const { width } = scene.scale;

    const fullscreenButton = scene.add.text(width - 20, 20, "⛶", {
        fontFamily: '"Press Start 2P", cursive',
        fontSize: "24px",
        fill: "#fff"
    }).setInteractive().setOrigin(1, 0);

    fullscreenButton.on('pointerup', () => {
        if (scene.scale.isFullscreen) {
            scene.scale.stopFullscreen();
        } else {
            scene.scale.startFullscreen();
        }
    });

    scene.input.keyboard.on("keydown-F", () => {
        if (scene.scale.isFullscreen) {
            scene.scale.stopFullscreen();
        } else {
            scene.scale.startFullscreen();
        }
    });
};
