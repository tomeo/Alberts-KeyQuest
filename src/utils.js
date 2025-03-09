export const wordsWithIcons = [
    { "word": "Cat", "icon": "🐱" },
    { "word": "Dog", "icon": "🐕" },
    { "word": "Sun", "icon": "🌞" },
    { "word": "Bee", "icon": "🐝" },
    { "word": "Pig", "icon": "🐖" },
    { "word": "Fox", "icon": "🦊" },
    { "word": "Bus", "icon": "🚌" },
    { "word": "Car", "icon": "🚗" },
    { "word": "Key", "icon": "🔑" },
    { "word": "Hat", "icon": "🎩" },
    { "word": "Bat", "icon": "🦇" },
    { "word": "Bug", "icon": "🐛" },
    { "word": "Cow", "icon": "🐄" },
    { "word": "Hen", "icon": "🐓" },
    { "word": "Box", "icon": "📦" },
    { "word": "Cup", "icon": "🏆" },
    { "word": "Pen", "icon": "🖊️" },
    { "word": "Map", "icon": "🗺️" },
    { "word": "Bow", "icon": "🎀" },
    { "word": "Owl", "icon": "🦉" },
    { "word": "Cap", "icon": "🧢" },
    { "word": "Elf", "icon": "🧝" },
    { "word": "Man", "icon": "👨" }
];

export const getRandomWord = () => {
    return wordsWithIcons[Math.floor(Math.random() * wordsWithIcons.length)];
};

export const speakText = (text, callback = null) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;

    // Ensure it doesn't block the main thread
    setTimeout(() => {
        speechSynthesis.speak(utterance);
    }, 0);

    if (callback) {
        utterance.onend = () => {
            setTimeout(callback, 0);  // Use setTimeout to avoid blocking
        };
    }
};

export const addBackToTitleButton = (scene) => {
    const backButton = scene.add.text(20, 20, "← Back to Title", {
        fontFamily: '"Press Start 2P", cursive',
        fontSize: "1rem",
        fill: "#fff",
        backgroundColor: "#333",
        padding: { x: 10, y: 5 }
    }).setInteractive();

    // Hover effect for the button
    backButton.on('pointerover', () => backButton.setStyle({ fill: "#FFD700" }));
    backButton.on('pointerout', () => backButton.setStyle({ fill: "#fff" }));

    // Click action to go back to the title screen
    backButton.on('pointerup', () => {
        scene.scene.start("TitleScene");
    });
};