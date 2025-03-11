export default class WordManager {
    constructor() {
        this.wordsWithIcons = [
            { word: "ambulance", icon: "🚑" },
            { word: "basketball", icon: "🏀" },
            { word: "cat", icon: "🐈" },
            { word: "dog", icon: "🐕" },
            { word: "eagle", icon: "🦅" },
            { word: "fish", icon: "🐠" },
            { word: "grapes", icon: "🍇" },
            { word: "house", icon: "🏠" },
            { word: "ice", icon: "🧊" },
            { word: "juggling", icon: "🤹" },
            { word: "kite", icon: "🪁" },
            { word: "lion", icon: "🦁" },
            { word: "melon", icon: "🍈" },
            { word: "night", icon: "🌙" },
            { word: "octopus", icon: "🐙" },
            { word: "pineapple", icon: "🍍" },
            { word: "queen", icon: "👑" },
            { word: "robot", icon: "🤖" },
            { word: "snake", icon: "🐍" },
            { word: "tree", icon: "🌳" },
            { word: "umbrella", icon: "☂️" },
            { word: "violin", icon: "🎻" },
            { word: "walking", icon: "🚶" },
            { word: "cross", icon: "❌" },
            { word: "yarn", icon: "🧶" },
            { word: "zebra", icon: "🦓" },
            { word: "sun", icon: "🌞" },
            { word: "bee", icon: "🐝" },
            { word: "pig", icon: "🐖" },
            { word: "fox", icon: "🦊" },
            { word: "bus", icon: "🚌" },
            { word: "car", icon: "🚗" },
            { word: "key", icon: "🔑" },
            { word: "hat", icon: "🎩" },
            { word: "bat", icon: "🦇" },
            { word: "bug", icon: "🐛" },
            { word: "cow", icon: "🐄" },
            { word: "hen", icon: "🐓" },
            { word: "box", icon: "📦" },
            { word: "cup", icon: "🏆" },
            { word: "pen", icon: "🖊️" },
            { word: "map", icon: "🗺️" },
            { word: "bow", icon: "🎀" },
            { word: "owl", icon: "🦉" },
            { word: "cap", icon: "🧢" },
            { word: "elf", icon: "🧝" },
            { word: "man", icon: "👨" },
            { word: "egg", icon: "🥚" }
        ];
    }

    getRandomWord() {
        return this.wordsWithIcons[Math.floor(Math.random() * this.wordsWithIcons.length)];
    }

    getRandomWordByLength(length) {
        const filteredWords = this.wordsWithIcons.filter(wordObj => wordObj.word.length === length);
        return filteredWords.length > 0 ? filteredWords[Math.floor(Math.random() * filteredWords.length)] : null;
    }
}
