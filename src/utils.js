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
    { "word": "Man", "icon": "👨" },
    { "word": "Egg", "icon": "🥚" },
    { "word": "Box", "icon": "📦" },
    { "word": "Sky", "icon": "☁️" },
    { "word": "Sea", "icon": "🌊" },
    { "word": "Bed", "icon": "🛏️" },
    { "word": "Ice", "icon": "🧊" },
    { "word": "Jam", "icon": "🍓" },
    { "word": "Lip", "icon": "👄" },
    { "word": "Net", "icon": "🕸️" },
    { "word": "Pie", "icon": "🥧" },
    { "word": "Rod", "icon": "🎣" },
    { "word": "Toy", "icon": "🧸" },
    { "word": "Ink", "icon": "🖋️" },
    { "word": "Pad", "icon": "📓" },
    { "word": "Cup", "icon": "🍵" },
    { "word": "Bus", "icon": "🚌" },
    { "word": "Van", "icon": "🚐" },
    { "word": "Web", "icon": "🕸️" },
    { "word": "Tap", "icon": "🚰" },
    { "word": "Hen", "icon": "🐓" },
    { "word": "Ant", "icon": "🐜" },
    { "word": "Rat", "icon": "🐀" },
    { "word": "Jar", "icon": "🥫" },
    { "word": "Fan", "icon": "🌀" },
    { "word": "Log", "icon": "🪵" },
    { "word": "Bow", "icon": "🏹" },
    { "word": "Gem", "icon": "💎" },
    { "word": "Ham", "icon": "🍖" },
    { "word": "Nut", "icon": "🥜" },
    { "word": "Pin", "icon": "📌" },
    { "word": "Rug", "icon": "🖼️" },
    { "word": "Tag", "icon": "🏷️" },
    { "word": "Hat", "icon": "🎩" },
    { "word": "Pet", "icon": "🐕" },
    { "word": "Yak", "icon": "🐃" },
    { "word": "Wig", "icon": "🤡" },
    { "word": "Zip", "icon": "🧳" },
    { "word": "Bat", "icon": "🦇" },
    { "word": "Cup", "icon": "🏆" },
    { "word": "Pen", "icon": "🖊️" },
    { "word": "Bus", "icon": "🚌" },
    { "word": "Ant", "icon": "🐜" },
    { "word": "Ink", "icon": "🖋️" },
    { "word": "Sun", "icon": "🌞" },
    { "word": "Cat", "icon": "🐱" },
    { "word": "Dog", "icon": "🐕" },
    { "word": "Fox", "icon": "🦊" },
    { "word": "Bee", "icon": "🐝" },
    { "word": "Rat", "icon": "🐀" },
    { "word": "Pig", "icon": "🐖" },
    { "word": "Hen", "icon": "🐓" },
    { "word": "Cow", "icon": "🐄" },
    { "word": "Map", "icon": "🗺️" },
    { "word": "Toy", "icon": "🧸" },
    { "word": "Jar", "icon": "🥫" },
    { "word": "Web", "icon": "🕸️" },
    { "word": "Log", "icon": "🪵" },
    { "word": "Hat", "icon": "🎩" },
    { "word": "Cup", "icon": "🍵" },
    { "word": "Key", "icon": "🔑" },
    { "word": "Bow", "icon": "🎀" },
    { "word": "Owl", "icon": "🦉" },
    { "word": "Cap", "icon": "🧢" },
    { "word": "Elf", "icon": "🧝" },
    { "word": "Man", "icon": "👨" },
    { "word": "Gem", "icon": "💎" },
    { "word": "Ham", "icon": "🍖" },
    { "word": "Nut", "icon": "🥜" },
    { "word": "Pin", "icon": "📌" },
    { "word": "Rug", "icon": "🖼️" },
    { "word": "Tag", "icon": "🏷️" }
];

export const getRandomWord = () => {
    return wordsWithIcons[Math.floor(Math.random() * wordsWithIcons.length)];
};

let femaleVoice = null;
const setFemaleVoice = () => {
    const voices = speechSynthesis.getVoices();
    femaleVoice = voices.find(voice => voice.name.includes("Female") || voice.name.includes("Google UK English Female"));
};

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = setFemaleVoice;
} else {
    setFemaleVoice();
}

export const speakText = (text, callback = null) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;

    if (femaleVoice) {
        utterance.voice = femaleVoice;
    }

    setTimeout(() => {
        speechSynthesis.speak(utterance);
    }, 0);

    if (callback) {
        utterance.onend = () => {
            setTimeout(callback, 0);
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