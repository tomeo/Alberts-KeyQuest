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

    utterance.onend = () => {
        if (callback) callback();
    };

    speechSynthesis.speak(utterance);
};
